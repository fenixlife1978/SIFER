import { createClient } from '@libsql/client';

export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  const body=req.body||{};
  // La primera etapa solo registra operaciones de forma idempotente. La aplicación de
  // cada dominio (ventas, inventario, caja) se habilitará después de definir su esquema. 
  const operationId=String(body.operationId||'');
  const type=String(body.type||'');
  if(!operationId||!type) return res.status(400).json({ok:false,error:'operationId y type son obligatorios'});
  try{
    const db=createClient({url,authToken});
    if(type==='sale-created'){
      const sale=body.payload?.sale;
      if(sale?.numero){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
          numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
          subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
          saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,created_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sale_lines (
          sale_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,price REAL NOT NULL,discount REAL NOT NULL DEFAULT 0,
          PRIMARY KEY(sale_number,product_id),FOREIGN KEY(sale_number) REFERENCES sifer_sales(numero)
        )`,args:[]});
        await db.execute({sql:`INSERT OR IGNORE INTO sifer_sales(numero,fecha,cliente_id,cliente,total,subtotal,impuesto,pagado,saldo,tipo,documento_origen,created_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,args:[
            String(sale.numero),String(sale.fecha||''),sale.clienteId??null,sale.cliente??'Cliente general',
            Number(sale.total)||0,Number(sale.subtotal)||0,Number(sale.impuesto)||0,Number(sale.pagado)||0,
            Number(sale.saldo)||0,sale.tipo??'',sale.documentoOrigen??null,new Date().toISOString()
        ]});
        const lines=Array.isArray(sale.lineas)?sale.lineas:[];
        const stmts=lines.filter((l:any)=>l?.id).map((l:any)=>({sql:`INSERT OR IGNORE INTO sifer_sale_lines(sale_number,product_id,qty,price,discount) VALUES(?,?,?,?,?)`,args:[
          String(sale.numero),String(l.id),Number(l.qty)||0,Number(l.price)||0,Number(l.disc)||0
        ]}));
        if(stmts.length)await db.batch(stmts,'write');
      }
    }
    if(type==='products-inventory-snapshot'){
      const products=Array.isArray(body.payload?.products)?body.payload.products:[];
      if(products.length){
        const now=new Date().toISOString();
        const stmts:any[]=[];
        for(const p of products){
          if(!p?.id||!p?.nombre) continue;
          stmts.push(
            {sql:`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,updated_at)
              VALUES(?,?,?,?,?,?,?,?,?,?)
              ON CONFLICT(id) DO UPDATE SET codigo=excluded.codigo,nombre=excluded.nombre,categoria=excluded.categoria,
              marca=excluded.marca,unidad=excluded.unidad,costo=excluded.costo,precio=excluded.precio,
              imagen=excluded.imagen,updated_at=excluded.updated_at`,
             args:[String(p.id),p.codigo??'',p.nombre,p.categoria??'',p.marca??'',p.unidad??'',Number(p.costo)||0,Number(p.precio)||0,p.imagen??'',now]},
            {sql:`INSERT INTO sifer_inventory(product_id,stock,min_stock,updated_at)
              VALUES(?,?,?,?)
              ON CONFLICT(product_id) DO UPDATE SET stock=excluded.stock,min_stock=excluded.min_stock,updated_at=excluded.updated_at`,
             args:[String(p.id),Number(p.stock)||0,Number(p.min)||0,now]}
          );
        }
        if(stmts.length) await db.batch(stmts,'write');
      }
    }
    await db.batch([
      {sql:`CREATE TABLE IF NOT EXISTS sifer_products (
        id TEXT PRIMARY KEY,codigo TEXT,nombre TEXT NOT NULL,categoria TEXT,marca TEXT,unidad TEXT,
        costo REAL NOT NULL DEFAULT 0,precio REAL NOT NULL DEFAULT 0,imagen TEXT,updated_at TEXT NOT NULL
      )`,args:[]},
      {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory (
        product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES sifer_products(id)
      )`,args:[]},
      {sql:`CREATE TABLE IF NOT EXISTS sifer_sync_operations (
        operation_id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        received_at TEXT NOT NULL
      )`,args:[]},
      {sql:`INSERT OR IGNORE INTO sifer_sync_operations(operation_id,type,payload_json,created_at,received_at)
        VALUES(?,?,?,?,?)`,args:[operationId,type,JSON.stringify(body.payload??null),String(body.createdAt||new Date().toISOString()),new Date().toISOString()]}
    ],'write');
    return res.status(200).json({ok:true,operationId});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
