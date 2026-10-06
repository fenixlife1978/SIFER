import { createClient } from '@libsql/client';

async function ensure(db:any){
  await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_customer_orders(
    id TEXT PRIMARY KEY,numero TEXT UNIQUE NOT NULL,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,
    operador_id TEXT,operador TEXT,estado TEXT NOT NULL,total REAL NOT NULL,payload_json TEXT NOT NULL,
    caja_id TEXT,claimed_by TEXT,claimed_at TEXT,updated_at TEXT,created_at TEXT NOT NULL
  )`,args:[]});
  for(const sql of [
    'ALTER TABLE sifer_customer_orders ADD COLUMN claimed_by TEXT',
    'ALTER TABLE sifer_customer_orders ADD COLUMN claimed_at TEXT',
    'ALTER TABLE sifer_customer_orders ADD COLUMN updated_at TEXT'
  ]){try{await db.execute({sql,args:[]})}catch(e){}}
}

export default async function handler(req:any,res:any){
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return res.status(503).json({ok:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  try{
    await ensure(db);
    if(req.method==='GET'){
      const rows=await db.execute({sql:'SELECT id,numero,fecha,cliente_id,cliente,operador_id,operador,estado,total,payload_json,caja_id,claimed_by,claimed_at,updated_at,created_at FROM sifer_customer_orders ORDER BY updated_at DESC LIMIT 500',args:[]});
      return res.status(200).json({ok:true,orders:rows.rows});
    }
    if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});
    const b=req.body||{},id=String(b.id||''),action=String(b.action||''),actor=String(b.actorId||''),caja=String(b.cajaId||'');
    if(!id||!action||!actor)return res.status(400).json({ok:false,error:'id, action y actorId son obligatorios'});
    const now=new Date().toISOString();
    if(action==='claim'){
      const current=await db.execute({sql:'SELECT payload_json FROM sifer_customer_orders WHERE id=? AND estado=\'Pendiente\' LIMIT 1',args:[id]});
      if(!current.rows.length)return res.status(409).json({ok:false,conflict:true,error:'El pedido ya fue tomado por otra caja u operador'});
      let payload:any={};try{payload=JSON.parse(String(current.rows[0].payload_json||'{}'))}catch(e){}
      const lines=Array.isArray(payload.lineas)?payload.lineas.filter((x:any)=>x?.id&&Number(x.qty)>0):[];
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_order_reservations(
        order_id TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,reserved_at TEXT NOT NULL,
        PRIMARY KEY(order_id,product_id)
      )`,args:[]});
      const tx=await db.transaction('write');
      try{
        for(const line of lines){
          const rr=await tx.execute({sql:`INSERT OR IGNORE INTO sifer_order_reservations(order_id,product_id,qty,reserved_at)
            SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM sifer_inventory WHERE product_id=? AND stock>=?)`,
            args:[id,String(line.id),Number(line.qty),now,String(line.id),Number(line.qty)]});
          if(!rr.rowsAffected)throw new Error('Stock insuficiente para '+String(line.id));
          const ur=await tx.execute({sql:'UPDATE sifer_inventory SET stock=stock-?,updated_at=? WHERE product_id=? AND stock>=?',args:[Number(line.qty),now,String(line.id),Number(line.qty)]});
          if(!ur.rowsAffected)throw new Error('Stock insuficiente para '+String(line.id));
        }
        const cr=await tx.execute({sql:`UPDATE sifer_customer_orders SET estado='En caja',claimed_by=?,claimed_at=?,caja_id=?,updated_at=? WHERE id=? AND estado='Pendiente'`,args:[actor,now,caja||null,now,id]});
        if(!cr.rowsAffected)throw new Error('El pedido ya fue tomado por otra caja u operador');
        await tx.commit();
      }catch(e){await tx.rollback();return res.status(409).json({ok:false,conflict:true,error:String((e as any)?.message||e)})}finally{tx.close()}
      return res.status(200).json({ok:true,state:'En caja',id,claimedBy:actor,reserved:true});
    }
    if(action==='release'){
      const tx=await db.transaction('write');
      try{
        const current=await tx.execute({sql:'SELECT 1 FROM sifer_customer_orders WHERE id=? AND estado=\'En caja\' AND claimed_by=? LIMIT 1',args:[id,actor]});
        if(!current.rows.length){await tx.rollback();return res.status(409).json({ok:false,conflict:true,error:'El pedido no está reservado por este operador'})}
        const rs=await tx.execute({sql:'SELECT product_id,qty FROM sifer_order_reservations WHERE order_id=?',args:[id]});
        for(const row of rs.rows)await tx.execute({sql:'UPDATE sifer_inventory SET stock=stock+?,updated_at=? WHERE product_id=?',args:[Number(row.qty)||0,now,String(row.product_id)]});
        await tx.execute({sql:'DELETE FROM sifer_order_reservations WHERE order_id=?',args:[id]});
        await tx.execute({sql:`UPDATE sifer_customer_orders SET estado='Pendiente',claimed_by=NULL,claimed_at=NULL,updated_at=? WHERE id=? AND estado='En caja' AND claimed_by=?`,args:[now,id,actor]});
        await tx.commit();
      }catch(e){await tx.rollback();return res.status(503).json({ok:false,error:String((e as any)?.message||e)})}finally{tx.close()}
      return res.status(200).json({ok:true,state:'Pendiente',id,reservationReleased:true});
    }
    if(action==='finalize'){
      const saleNumber=String(b.saleNumber||'');
      const current=await db.execute({sql:'SELECT payload_json FROM sifer_customer_orders WHERE id=? AND estado=\'En caja\' AND claimed_by=? LIMIT 1',args:[id,actor]});
      if(!current.rows.length)return res.status(409).json({ok:false,conflict:true,error:'El pedido no está reservado por este operador o ya fue facturado'});
      let payload:any={}; try{payload=JSON.parse(String(current.rows[0].payload_json||'{}'))}catch(e){}
      payload.saleNumber=saleNumber;
      const tx=await db.transaction('write');
      try{
        const r=await tx.execute({sql:`UPDATE sifer_customer_orders SET estado='Facturado',payload_json=?,updated_at=? WHERE id=? AND estado='En caja' AND claimed_by=?`,args:[JSON.stringify(payload),now,id,actor]});
        if(!r.rowsAffected){await tx.rollback();return res.status(409).json({ok:false,conflict:true,error:'El pedido no está reservado por este operador o ya fue facturado'});}
        // La reserva ya descontó el inventario al tomar el pedido. Al facturarlo
        // solo se elimina la reserva; nunca se repone stock aquí.
        await tx.execute({sql:'DELETE FROM sifer_order_reservations WHERE order_id=?',args:[id]});
        await tx.commit();
      }catch(e){
        await tx.rollback();
        return res.status(503).json({ok:false,error:String((e as any)?.message||e)});
      }finally{tx.close()}
      return res.status(200).json({ok:true,state:'Facturado',id,saleNumber});
    }
    return res.status(400).json({ok:false,error:'Acción no soportada'});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}