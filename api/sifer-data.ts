import { createClient } from '@libsql/client';

export default async function handler(req:any,res:any){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  const query=String(req.query?.query||'').toLowerCase();
  try{
    if(query==='today-sales'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
        numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
        subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
        saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT numero,fecha,total,pagado,saldo,tipo FROM sifer_sales
        WHERE date(substr(fecha,1,10),'localtime')=date('now','localtime')
        ORDER BY created_at DESC`,args:[]});
      const sales=r.rows.filter((x:any)=>String(x.tipo||'').toLowerCase()!=='anulada');
      return res.status(200).json({ok:true,query:'today-sales',count:sales.length,total:sales.reduce((s:any,x:any)=>s+Number(x.total)||0,0),sales});
    }
    if(query==='cxc'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
        numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
        subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
        saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT numero,fecha,cliente_id,cliente,total,pagado,saldo,tipo FROM sifer_sales
        WHERE saldo>0 AND lower(coalesce(tipo,'')) NOT IN ('anulada','cancelada')
        ORDER BY fecha ASC,created_at ASC`,args:[]});
      const items=r.rows.map((x:any)=>({...x,total:Number(x.total||0),pagado:Number(x.pagado||0),saldo:Number(x.saldo||0)}));
      return res.status(200).json({ok:true,query:'cxc',count:items.length,total:items.reduce((s:any,x:any)=>s+x.total,0),pagado:items.reduce((s:any,x:any)=>s+x.pagado,0),saldo:items.reduce((s:any,x:any)=>s+x.saldo,0),items});
    }
    if(query==='cxp'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_accounts_payable (
        id TEXT PRIMARY KEY,documento TEXT UNIQUE NOT NULL,proveedor_id TEXT,proveedor TEXT,
        total REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,fecha TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'Pendiente',created_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT documento,proveedor_id,proveedor,total,saldo,fecha,estado FROM sifer_accounts_payable
        WHERE saldo>0 AND lower(coalesce(estado,'')) NOT IN ('pagado','anulada','cancelada') ORDER BY fecha ASC,created_at ASC`,args:[]});
      const items=r.rows.map((x:any)=>({...x,total:Number(x.total||0),saldo:Number(x.saldo||0)}));
      return res.status(200).json({ok:true,query:'cxp',count:items.length,total:items.reduce((s:any,x:any)=>s+x.total,0),saldo:items.reduce((s:any,x:any)=>s+x.saldo,0),items});
    }
    if(query==='inventory'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_inventory (
        product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
      )`,args:[]});
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_products (
        id TEXT PRIMARY KEY,codigo TEXT,nombre TEXT NOT NULL,categoria TEXT,marca TEXT,unidad TEXT,
        costo REAL NOT NULL DEFAULT 0,precio REAL NOT NULL DEFAULT 0,imagen TEXT,updated_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT p.id,p.codigo,p.nombre,p.categoria,p.marca,p.unidad,p.costo,p.precio,
        i.stock,i.min_stock AS min FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id
        ORDER BY p.nombre`,args:[]});
      const items=r.rows.map((x:any)=>({...x,stock:Number(x.stock||0),min:Number(x.min||0)}));
      return res.status(200).json({ok:true,query:'inventory',count:items.length,available:items.filter((x:any)=>x.stock>0).length,units:items.reduce((s:any,x:any)=>s+x.stock,0),items});
    }
    return res.status(400).json({ok:false,error:'Consulta no soportada'});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}