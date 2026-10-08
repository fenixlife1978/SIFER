import { createClient } from '@libsql/client';

type Product = {
  id:string;
  codigo?:string;
  nombre?:string;
  categoria?:string;
  marca?:string;
  unidad?:string;
  costo?:number;
  precio?:number;
  stock?:number;
  min?:number;
  imagen?:string;
};

export default async function handler(req:any,res:any){
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  try{
    await db.batch([
      {sql:`CREATE TABLE IF NOT EXISTS sifer_products (
        id TEXT PRIMARY KEY,
        codigo TEXT,
        nombre TEXT NOT NULL,
        categoria TEXT,
        marca TEXT,
        unidad TEXT,
        costo REAL NOT NULL DEFAULT 0,
        precio REAL NOT NULL DEFAULT 0,
        imagen TEXT,
        updated_at TEXT NOT NULL
      )`,args:[]},
      {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory (
        product_id TEXT PRIMARY KEY,
        stock REAL NOT NULL DEFAULT 0,
        min_stock REAL NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES sifer_products(id)
      )`,args:[]}
    ],'write');

    if(req.method==='GET'){
      const rows=await db.execute(`SELECT p.id,p.codigo,p.nombre,p.categoria,p.marca,p.unidad,p.costo,p.precio,p.imagen,
        i.stock,i.min_stock AS min
        FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id ORDER BY p.id`);
      return res.status(200).json({ok:true,products:rows.rows});
    }

    if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
    const products=Array.isArray(req.body?.products)?req.body.products:[];
    const existing=await db.execute({sql:'SELECT COUNT(*) AS count FROM sifer_products',args:[]});
    const existingCount=Number(existing.rows?.[0]?.count||0);
    if(existingCount>0)return res.status(409).json({ok:false,conflict:true,error:'El inventario de Turso ya está inicializado; no se permite sobrescribirlo mediante la carga inicial.',count:existingCount});
    const now=new Date().toISOString();
    const stmts:any[]=[];
    for(const raw of products){
      const p=raw as Product;
      if(!p?.id||!p?.nombre) continue;
      stmts.push(
        {sql:`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,updated_at)
          VALUES(?,?,?,?,?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET
            codigo=excluded.codigo,nombre=excluded.nombre,categoria=excluded.categoria,
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
    return res.status(200).json({ok:true,count:products.length,syncedAt:now});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
