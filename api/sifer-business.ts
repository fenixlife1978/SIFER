import { createClient } from '@libsql/client';

function num(v:any,d=0){const n=Number(v);return Number.isFinite(n)?n:d}

export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return res.status(503).json({ok:false,error:'Turso no configurado'});
  const op=String(req.body?.operation||'');
  const db=createClient({url,authToken});
  try{
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_cash_registers(
      id TEXT PRIMARY KEY,nombre TEXT NOT NULL,abierta INTEGER NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,
      apertura TEXT,ultimo_corte_at TEXT,seq_venta INTEGER NOT NULL DEFAULT 1,seq_devolucion INTEGER NOT NULL DEFAULT 1,
      seq_z INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL
    )`,args:[]});
    if(op==='open-cash'){
      const id=String(req.body?.cajaId||'');
      if(!id)return res.status(400).json({ok:false,error:'cajaId es obligatorio'});
      const nombre=String(req.body?.nombre||id),now=new Date().toISOString();
      const current=await db.execute({sql:'SELECT id,nombre,abierta,saldo,apertura FROM sifer_cash_registers WHERE id=? LIMIT 1',args:[id]});
      const row=current.rows?.[0];
      if(row&&num(row.abierta)===1)return res.status(200).json({ok:true,alreadyOpen:true,caja:{...row,abierta:true,saldo:num(row.saldo)}});
      await db.execute({sql:`INSERT INTO sifer_cash_registers(id,nombre,abierta,saldo,apertura,updated_at)
        VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET nombre=excluded.nombre,abierta=1,apertura=excluded.apertura,updated_at=excluded.updated_at`,args:[
        id,nombre,1,num(row?.saldo),now,now
      ]});
      return res.status(200).json({ok:true,cajaId:id,abierta:true,apertura:now});
    }
    if(op==='sale-preflight'){
      const cajaId=String(req.body?.cajaId||'');
      const lines=Array.isArray(req.body?.lines)?req.body.lines:[];
      if(!cajaId)return res.status(400).json({ok:false,error:'No se indicó la caja de la venta'});
      if(!lines.length)return res.status(400).json({ok:false,error:'El carrito está vacío'});
      const cash=await db.execute({sql:'SELECT id,nombre,abierta,saldo FROM sifer_cash_registers WHERE id=? LIMIT 1',args:[cajaId]});
      const box=cash.rows?.[0];
      if(!box||num(box.abierta)!==1)return res.status(409).json({ok:false,error:'La caja no figura abierta en Turso. Abra la caja y espere a que se sincronice antes de cobrar.'});
      await db.batch([
        {sql:`CREATE TABLE IF NOT EXISTS sifer_products(id TEXT PRIMARY KEY,codigo TEXT,nombre TEXT NOT NULL,categoria TEXT,marca TEXT,unidad TEXT,costo REAL NOT NULL DEFAULT 0,precio REAL NOT NULL DEFAULT 0,imagen TEXT,updated_at TEXT NOT NULL)`,args:[]},
        {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory(product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)`,args:[]}
      ],'write');
      const ids=lines.map((x:any)=>String(x?.id||'')).filter(Boolean);
      const placeholders=ids.map(()=>'?').join(',');
      const r=await db.execute({sql:`SELECT p.id,p.nombre,p.precio,i.stock FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id WHERE p.id IN (${placeholders})`,args:ids});
      const byId=new Map(r.rows.map((x:any)=>[String(x.id),x]));
      const missing:any[]=[];
      const insufficient:any[]=[];
      for(const l of lines){
        const id=String(l?.id||''),qty=num(l?.qty,0),p=byId.get(id);
        if(!p){missing.push(id);continue}
        if(qty<=0){insufficient.push({id,nombre:p.nombre,stock:num(p.stock),solicitado:qty});continue}
        if(num(p.stock)<qty)insufficient.push({id,nombre:p.nombre,stock:num(p.stock),solicitado:qty});
      }
      if(missing.length)return res.status(409).json({ok:false,error:'Hay artículos del carrito que no existen en el inventario de Turso.',missing});
      if(insufficient.length)return res.status(409).json({ok:false,error:'Turso reporta existencia insuficiente para uno o más artículos.',insufficient});
      return res.status(200).json({ok:true,cajaId,validatedAt:new Date().toISOString(),items:[...byId.values()].map((x:any)=>({id:x.id,nombre:x.nombre,precio:num(x.precio),stock:num(x.stock)}))});
    }
    return res.status(400).json({ok:false,error:'Operación no soportada'});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}
