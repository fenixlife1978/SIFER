import { createClient } from '@libsql/client';

async function ensure(db:any){
  await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_customer_orders(
    id TEXT PRIMARY KEY,numero TEXT UNIQUE NOT NULL,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,
    operador_id TEXT,operador TEXT,estado TEXT NOT NULL,total REAL NOT NULL,payload_json TEXT NOT NULL,
    caja_id TEXT,claimed_by TEXT,claimed_at TEXT,updated_at TEXT NOT NULL,created_at TEXT NOT NULL
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
      const r=await db.execute({sql:`UPDATE sifer_customer_orders SET estado='En caja',claimed_by=?,claimed_at=?,caja_id=?,updated_at=? WHERE id=? AND estado='Pendiente'`,args:[actor,now,caja||null,now,id]});
      if(!r.rowsAffected)return res.status(409).json({ok:false,conflict:true,error:'El pedido ya fue tomado por otra caja u operador'});
      return res.status(200).json({ok:true,state:'En caja',id,claimedBy:actor});
    }
    if(action==='release'){
      const r=await db.execute({sql:`UPDATE sifer_customer_orders SET estado='Pendiente',claimed_by=NULL,claimed_at=NULL,updated_at=? WHERE id=? AND estado='En caja' AND claimed_by=?`,args:[now,id,actor]});
      if(!r.rowsAffected)return res.status(409).json({ok:false,conflict:true,error:'El pedido no está reservado por este operador'});
      return res.status(200).json({ok:true,state:'Pendiente',id});
    }
    if(action==='finalize'){
      const saleNumber=String(b.saleNumber||'');
      const r=await db.execute({sql:`UPDATE sifer_customer_orders SET estado='Facturado',payload_json=json_set(payload_json,'$.saleNumber',?),updated_at=? WHERE id=? AND estado='En caja' AND claimed_by=?`,args:[saleNumber,now,id,actor]});
      if(!r.rowsAffected)return res.status(409).json({ok:false,conflict:true,error:'El pedido no está reservado por este operador o ya fue facturado'});
      return res.status(200).json({ok:true,state:'Facturado',id,saleNumber});
    }
    return res.status(400).json({ok:false,error:'Acción no soportada'});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}