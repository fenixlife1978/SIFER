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
  imagen?:string;
  fuenteUrl?:string;
  estadoVerificacion?:string;
  detalles?:Record<string,any>;
  proveedores?:any[];
  min?:number;
  ubicacion?:string;
  stockMaximo?:number;
  reorderPoint?:number;
  margenDetal?:number;
  precioMayor?:number;
  precioTaller?:number;
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
        fuente_url TEXT,
        estado_verificacion TEXT,
        detalles_json TEXT NOT NULL DEFAULT '{}',
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

    try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN fuente_url TEXT',args:[]})}catch(e){}
    try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN estado_verificacion TEXT',args:[]})}catch(e){}
    try{await db.execute({sql:"ALTER TABLE sifer_products ADD COLUMN detalles_json TEXT NOT NULL DEFAULT '{}'",args:[]})}catch(e){}
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_inventory_ledger(operation_id TEXT NOT NULL,documento TEXT NOT NULL,product_id TEXT NOT NULL,qty_delta REAL NOT NULL,reason TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(operation_id,product_id))`,args:[]});

    if(req.method==='GET'){
      // Remove only recognizable starter/demo rows; preserve real operator-entered products.
      await db.batch([
        {sql:"DELETE FROM sifer_inventory WHERE product_id IN ('PR-001','PR-002','PR-003','PR-004','PR-005','PR-006')",args:[]},
        {sql:"DELETE FROM sifer_products WHERE id IN ('PR-001','PR-002','PR-003','PR-004','PR-005','PR-006')",args:[]},
        {sql:"DELETE FROM sifer_inventory WHERE product_id IN (SELECT id FROM sifer_products WHERE upper(coalesce(codigo,'')) LIKE '%REF-PENDIENTE%' OR upper(coalesce(codigo,'')) LIKE 'DEMO-%' OR upper(coalesce(codigo,'')) LIKE 'TEST-%' OR upper(coalesce(nombre,'')) LIKE '%TALADRO INALAMBRICO 20V%' OR upper(coalesce(nombre,'')) LIKE '%GUANTES DE SEGURIDAD REFORZADOS%' OR upper(coalesce(nombre,'')) LIKE '%CEMENTO GRIS 42.5 KG%')",args:[]},
        {sql:"DELETE FROM sifer_products WHERE upper(coalesce(codigo,'')) LIKE '%REF-PENDIENTE%' OR upper(coalesce(codigo,'')) LIKE 'DEMO-%' OR upper(coalesce(codigo,'')) LIKE 'TEST-%' OR upper(coalesce(nombre,'')) LIKE '%TALADRO INALAMBRICO 20V%' OR upper(coalesce(nombre,'')) LIKE '%GUANTES DE SEGURIDAD REFORZADOS%' OR upper(coalesce(nombre,'')) LIKE '%CEMENTO GRIS 42.5 KG%'",args:[]}
      ],'write');
      const rows=await db.execute(`SELECT p.id,p.codigo,p.nombre,p.categoria,p.marca,p.unidad,p.costo,p.precio,p.imagen,p.fuente_url AS fuenteUrl,p.estado_verificacion AS estadoVerificacion,p.detalles_json AS detallesJson,
        i.stock,i.min_stock AS min
        FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id ORDER BY p.id`);
      const products=rows.rows.map((row:any)=>{let details:any={};try{details=JSON.parse(String(row.detallesJson||'{}'))||{}}catch(e){};const {detallesJson,...base}=row;return {...details,...base,detalles:details};});
      return res.status(200).json({ok:true,products});
    }

    if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
    if(req.body?.action==='upsert'){
      const p=req.body?.product as Product;
      if(!p?.id||!p?.nombre||!String(p.codigo||'').trim())return res.status(400).json({ok:false,error:'Se requiere ID, código y descripción del producto.'});
      const now=new Date().toISOString();
      const detailsJson=JSON.stringify(p.detalles||{});
      await db.execute({sql:`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,fuente_url,estado_verificacion,detalles_json,updated_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET codigo=excluded.codigo,nombre=excluded.nombre,categoria=excluded.categoria,marca=excluded.marca,
        unidad=excluded.unidad,costo=excluded.costo,precio=excluded.precio,imagen=excluded.imagen,fuente_url=excluded.fuente_url,
        estado_verificacion=excluded.estado_verificacion,detalles_json=excluded.detalles_json,updated_at=excluded.updated_at`,
        args:[String(p.id),String(p.codigo),String(p.nombre),p.categoria??'',p.marca??'',p.unidad??'',Number(p.costo)||0,Number(p.precio)||0,p.imagen??'',p.fuenteUrl??'',p.estadoVerificacion??'',detailsJson,now]});
      const current=await db.execute({sql:'SELECT stock FROM sifer_inventory WHERE product_id=? LIMIT 1',args:[String(p.id)]});
      if(current.rows.length){
        await db.execute({sql:'UPDATE sifer_inventory SET min_stock=?,updated_at=? WHERE product_id=?',args:[Math.max(0,Number(p.min)||0),now,String(p.id)]});
      }else{
        const initialStock=Math.max(0,Number(req.body?.initialStock)||0);
        await db.execute({sql:'INSERT INTO sifer_inventory(product_id,stock,min_stock,updated_at) VALUES(?,?,?,?)',args:[String(p.id),initialStock,Math.max(0,Number(p.min)||0),now]});
        if(initialStock>0)await db.execute({sql:'INSERT OR IGNORE INTO sifer_inventory_ledger(operation_id,documento,product_id,qty_delta,reason,created_at) VALUES(?,?,?,?,?,?)',args:['initial-stock:'+String(p.id),'INICIAL-'+String(p.codigo),String(p.id),initialStock,'initial',now]});
      }
      const saved=await db.execute({sql:`SELECT p.id,p.codigo,p.nombre,p.categoria,p.marca,p.unidad,p.costo,p.precio,p.imagen,p.fuente_url AS fuenteUrl,p.estado_verificacion AS estadoVerificacion,p.detalles_json AS detallesJson,i.stock,i.min_stock AS min FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id WHERE p.id=? LIMIT 1`,args:[String(p.id)]});
      const row:any=saved.rows[0]||{};
      let details:any={};try{details=JSON.parse(String(row.detallesJson||'{}'))||{}}catch(e){}
      const {detallesJson,...base}=row;
      return res.status(200).json({ok:true,product:{...details,...base,detalles:details}});
    }

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
        {sql:`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,fuente_url,estado_verificacion,detalles_json,updated_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET
            codigo=excluded.codigo,nombre=excluded.nombre,categoria=excluded.categoria,
            marca=excluded.marca,unidad=excluded.unidad,costo=excluded.costo,precio=excluded.precio,
            imagen=excluded.imagen,fuente_url=excluded.fuente_url,estado_verificacion=excluded.estado_verificacion,detalles_json=excluded.detalles_json,updated_at=excluded.updated_at`,
         args:[String(p.id),p.codigo??'',p.nombre,p.categoria??'',p.marca??'',p.unidad??'',Number(p.costo)||0,Number(p.precio)||0,p.imagen??'',p.fuenteUrl??'',p.estadoVerificacion??'',JSON.stringify(p.detalles||{}),now]},
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
