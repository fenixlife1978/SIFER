import { createClient } from '@libsql/client';
const norm=(v:any)=>String(v??'').trim();
const parse=(v:any,f:any)=>{try{return JSON.parse(String(v??''))}catch{return f}};
export default async function handler(req:any,res:any){
 const url=process.env.MASTER_CATALOG_DATABASE_URL,authToken=process.env.MASTER_CATALOG_AUTH_TOKEN;
 if(!url||!authToken)return res.status(503).json({ok:false,configured:false,error:'Catálogo extendido no configurado'});
 const db=createClient({url,authToken});
 try{
 await db.batch([
 {sql:`CREATE TABLE IF NOT EXISTS sifer_master_catalog(master_id TEXT PRIMARY KEY,nombre TEXT NOT NULL,categoria TEXT NOT NULL DEFAULT '',subcategoria TEXT NOT NULL DEFAULT '',marca TEXT NOT NULL DEFAULT '',fabricante TEXT NOT NULL DEFAULT '',codigo_proveedor TEXT NOT NULL DEFAULT '',codigo_oem TEXT NOT NULL DEFAULT '',referencias_json TEXT NOT NULL DEFAULT '[]',unidad_medida TEXT NOT NULL DEFAULT 'Unidad',descripcion_tecnica TEXT NOT NULL DEFAULT '',especificaciones TEXT NOT NULL DEFAULT '',palabras_clave TEXT NOT NULL DEFAULT '',compatibilidad_json TEXT NOT NULL DEFAULT '[]',foto_url TEXT NOT NULL DEFAULT '',fuente_url TEXT NOT NULL DEFAULT '',fuente_nombre TEXT NOT NULL DEFAULT '',estado_verificacion TEXT NOT NULL DEFAULT 'PENDIENTE',atributos_json TEXT NOT NULL DEFAULT '{}',search_text TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL)`,args:[]},
 {sql:'CREATE INDEX IF NOT EXISTS idx_master_oem ON sifer_master_catalog(codigo_oem)',args:[]},
 {sql:'CREATE INDEX IF NOT EXISTS idx_master_category ON sifer_master_catalog(categoria)',args:[]},
 {sql:'CREATE INDEX IF NOT EXISTS idx_master_supplier_code ON sifer_master_catalog(codigo_proveedor)',args:[]}
 ],'write');
 try{
 await db.execute(`CREATE VIRTUAL TABLE IF NOT EXISTS sifer_master_catalog_fts USING fts5(master_id UNINDEXED,search_text,tokenize='unicode61 remove_diacritics 2')`);
 await db.execute(`CREATE TRIGGER IF NOT EXISTS master_fts_insert AFTER INSERT ON sifer_master_catalog BEGIN INSERT INTO sifer_master_catalog_fts(master_id,search_text,rowid) VALUES(new.master_id,new.search_text,new.rowid); END`);
 await db.execute(`CREATE TRIGGER IF NOT EXISTS master_fts_update AFTER UPDATE OF search_text ON sifer_master_catalog BEGIN DELETE FROM sifer_master_catalog_fts WHERE rowid=old.rowid; INSERT INTO sifer_master_catalog_fts(master_id,search_text,rowid) VALUES(new.master_id,new.search_text,new.rowid); END`);
 }catch{}
 if(req.method==='GET'){
  const q=norm(req.query?.q).slice(0,180),cat=norm(req.query?.category),page=Math.max(1,Math.min(1000000,Number(req.query?.page)||1)),limit=Math.max(1,Math.min(100,Number(req.query?.limit)||25)),offset=(page-1)*limit;
  let rows:any,count:any,total:any,source='indexed';
  if(q){
   const tokens=q.normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(Boolean).map((t:string)=>'"'+t.replace(/"/g,'""')+'"').join(' AND ');
   try{
    const filter=cat&&cat!=='Todos'?' AND p.categoria=?':'',args:any=[tokens];if(filter)args.push(cat);
    count=await db.execute({sql:'SELECT COUNT(*) n FROM sifer_master_catalog_fts f JOIN sifer_master_catalog p ON p.rowid=f.rowid WHERE sifer_master_catalog_fts MATCH ?'+filter,args});
    rows=await db.execute({sql:'SELECT p.* FROM sifer_master_catalog_fts f JOIN sifer_master_catalog p ON p.rowid=f.rowid WHERE sifer_master_catalog_fts MATCH ?'+filter+' ORDER BY rank LIMIT ? OFFSET ?',args:[...args,limit,offset]});source='fts';
   }catch{
    const like='%'+q.replace(/[\\%_]/g,'')+'%',filter=cat&&cat!=='Todos'?'categoria=? AND ':'';
    const args:any=[];if(cat&&cat!=='Todos')args.push(cat);args.push(like,like,like);
    count=await db.execute({sql:'SELECT COUNT(*) n FROM sifer_master_catalog WHERE '+filter+'(nombre LIKE ? OR codigo_oem LIKE ? OR search_text LIKE ?)',args});
    rows=await db.execute({sql:'SELECT * FROM sifer_master_catalog WHERE '+filter+'(nombre LIKE ? OR codigo_oem LIKE ? OR search_text LIKE ?) LIMIT ? OFFSET ?',args:[...args,limit,offset]});source='like-fallback';
   }
  }else{
   const filter=cat&&cat!=='Todos'?' WHERE categoria=?':'',args:any=cat&&cat!=='Todos'?[cat]:[];
   count=await db.execute({sql:'SELECT COUNT(*) n FROM sifer_master_catalog'+filter,args});
   rows=await db.execute({sql:'SELECT * FROM sifer_master_catalog'+filter+' ORDER BY nombre LIMIT ? OFFSET ?',args:[...args,limit,offset]});
  }
  total=await db.execute('SELECT COUNT(*) n FROM sifer_master_catalog');
  const items=rows.rows.map((r:any)=>({masterId:r.master_id,nombre:r.nombre,categoria:r.categoria,subcategoria:r.subcategoria,marca:r.marca,fabricante:r.fabricante,codigoProveedor:r.codigo_proveedor,codigoOEM:r.codigo_oem,referenciasCruzadas:parse(r.referencias_json,[]),unidadMedida:r.unidad_medida,descripcionTecnica:r.descripcion_tecnica,especificaciones:r.especificaciones,palabrasClave:r.palabras_clave,compatibilidad:parse(r.compatibilidad_json,[]),fotoReal:r.foto_url,fuenteUrl:r.fuente_url,fuenteNombre:r.fuente_nombre,estadoVerificacion:r.estado_verificacion,atributos:parse(r.atributos_json,{})}));
  const matched=Number(count.rows?.[0]?.n||0);
  return res.status(200).json({ok:true,items,totalMatched:matched,totalCatalog:Number(total.rows?.[0]?.n||0),page,pageSize:limit,totalPages:Math.max(1,Math.ceil(matched/limit)),source});
 }
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});
 const importKey=process.env.MASTER_CATALOG_IMPORT_KEY;
 if(!importKey||req.headers['x-catalog-import-key']!==importKey)return res.status(401).json({ok:false,error:'Importación no autorizada'});
 const items=Array.isArray(req.body?.items)?req.body.items:[];if(!items.length||items.length>250)return res.status(400).json({ok:false,error:'Envía entre 1 y 250 registros por lote'});
 const now=new Date().toISOString(),stmts:any[]=[];let skipped=0;
 for(const p of items){
  const nombre=norm(p?.nombre),id=norm(p?.masterId)||[norm(p?.marca),norm(p?.codigoProveedor),norm(p?.codigoOEM),nombre].join('|').toLowerCase();
  if(!nombre||!id){skipped++;continue}
  const refs=Array.isArray(p.referenciasCruzadas)?p.referenciasCruzadas:String(p.referenciasCruzadas||'').split(/[;,|]/).map((x:string)=>x.trim()).filter(Boolean);
  const search=[nombre,p.categoria,p.subcategoria,p.marca,p.fabricante,p.codigoProveedor,p.codigoOEM,refs.join(' '),p.unidadMedida,p.descripcionTecnica,p.especificaciones,p.palabrasClave,JSON.stringify(p.compatibilidad||[]),JSON.stringify(p.atributos||{})].map(norm).filter(Boolean).join(' ');
  stmts.push({sql:`INSERT INTO sifer_master_catalog(master_id,nombre,categoria,subcategoria,marca,fabricante,codigo_proveedor,codigo_oem,referencias_json,unidad_medida,descripcion_tecnica,especificaciones,palabras_clave,compatibilidad_json,foto_url,fuente_url,fuente_nombre,estado_verificacion,atributos_json,search_text,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(master_id) DO UPDATE SET nombre=excluded.nombre,categoria=excluded.categoria,subcategoria=excluded.subcategoria,marca=excluded.marca,fabricante=excluded.fabricante,codigo_proveedor=excluded.codigo_proveedor,codigo_oem=excluded.codigo_oem,referencias_json=excluded.referencias_json,unidad_medida=excluded.unidad_medida,descripcion_tecnica=excluded.descripcion_tecnica,especificaciones=excluded.especificaciones,palabras_clave=excluded.palabras_clave,compatibilidad_json=excluded.compatibilidad_json,foto_url=excluded.foto_url,fuente_url=excluded.fuente_url,fuente_nombre=excluded.fuente_nombre,estado_verificacion=excluded.estado_verificacion,atributos_json=excluded.atributos_json,search_text=excluded.search_text,updated_at=excluded.updated_at`,args:[id,nombre,norm(p.categoria),norm(p.subcategoria),norm(p.marca),norm(p.fabricante),norm(p.codigoProveedor),norm(p.codigoOEM),JSON.stringify(refs),norm(p.unidadMedida)||'Unidad',norm(p.descripcionTecnica),norm(p.especificaciones),norm(p.palabrasClave),JSON.stringify(Array.isArray(p.compatibilidad)?p.compatibilidad:[]),norm(p.fotoReal||p.imagenUrl),norm(p.fuenteUrl),norm(p.fuenteNombre),norm(p.estadoVerificacion)||'PENDIENTE',JSON.stringify(p.atributos||{}),search,now]});
 }
 if(stmts.length)await db.batch(stmts,'write');
 return res.status(200).json({ok:true,received:items.length,importedOrUpdated:stmts.length,skipped,batchSize:items.length});
 }catch(e:any){return res.status(503).json({ok:false,configured:true,error:String(e?.message||e)})}
}
