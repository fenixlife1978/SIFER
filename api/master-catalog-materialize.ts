import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
async function loadGenerator(req:any){
  let source='';
  const localPath=path.join(process.cwd(),'public','master_catalog.js');
  try{ source=fs.readFileSync(localPath,'utf8'); }
  catch{
    const proto=String(req.headers?.['x-forwarded-proto']||'https').split(',')[0];
    const host=String(req.headers?.host||'');
    if(!host)throw new Error('No se pudo localizar la fuente del Catálogo Máster.');
    const r=await fetch(proto+'://'+host+'/master_catalog.js',{cache:'no-store'});
    if(!r.ok)throw new Error('No se pudo cargar la fuente del Catálogo Máster.');
    source=await r.text();
  }
  const sandbox:any={window:{},console:{log(){},warn(){},error(){}},setTimeout,clearTimeout};
  vm.runInNewContext(source,sandbox,{timeout:5000,filename:'master_catalog.js'});
  const getItem=sandbox.window.getMasterItemByIndex;
  const count=Number(sandbox.window.TOTAL_VIRTUAL_CATALOG_COUNT)||0;
  if(typeof getItem!=='function'||!count)throw new Error('Fuente del Catálogo Máster inválida.');
  return {getItem,count};
}

function stmt(x:any,version:string,now:string){
  const normalize=(s:any)=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return {
    sql:`INSERT INTO sifer_master_catalog
      (master_id,nombre,descripcion_tecnica,categoria,subcategoria,marca,origen_marca,tipo_marca,codigo_proveedor,codigo_oem,unidad_medida,costo_referencial,margen_sugerido,especificaciones,foto_real,distribuidor,referencias_json,compatibilidad_json,searchable_text,source_version,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(master_id) DO UPDATE SET
        nombre=excluded.nombre,descripcion_tecnica=excluded.descripcion_tecnica,categoria=excluded.categoria,subcategoria=excluded.subcategoria,
        marca=excluded.marca,origen_marca=excluded.origen_marca,tipo_marca=excluded.tipo_marca,codigo_proveedor=excluded.codigo_proveedor,
        codigo_oem=excluded.codigo_oem,unidad_medida=excluded.unidad_medida,costo_referencial=excluded.costo_referencial,
        margen_sugerido=excluded.margen_sugerido,especificaciones=excluded.especificaciones,foto_real=excluded.foto_real,
        distribuidor=excluded.distribuidor,referencias_json=excluded.referencias_json,compatibilidad_json=excluded.compatibilidad_json,
        searchable_text=excluded.searchable_text,source_version=excluded.source_version,updated_at=excluded.updated_at`,
    args:[
      String(x.masterId),String(x.nombre),String(x.descripcionTecnica||''),String(x.categoria||''),String(x.subcategoria||''),
      String(x.marca||''),String(x.origenMarca||''),String(x.tipoMarca||''),String(x.codigoProveedor||''),String(x.codigoOEM||''),
      String(x.unidadMedida||''),Number(x.costoReferencial)||0,Number(x.margenSugerido)||0,String(x.especificaciones||''),
      String(x.fotoReal||''),String(x.distribuidor||''),JSON.stringify(x.referenciasCruzadas||[]),JSON.stringify(x.compatibilidad||[]),
      normalize([x.nombre,x.marca,x.codigoProveedor,x.codigoOEM,x.categoria,x.subcategoria,x.descripcionTecnica,x.especificaciones,x.origenMarca,x.unidadMedida].join(' ')),
      version,now,now
    ]
  };
}

export default async function handler(req:any,res:any){
  if(req.method!=='GET' && req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return res.status(503).json({ok:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  try{
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_master_catalog_meta (key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL)`,args:[]});
    const gen=await loadGenerator(req);
    const configured=Math.min(2000,Math.max(250,Number(process.env.MASTER_CATALOG_BATCH_SIZE)||1000));
    const meta=await db.execute({sql:`SELECT key,value FROM sifer_master_catalog_meta WHERE key IN ('materialize_cursor','materialize_status','source_version')`,args:[]});
    const state:any={};
    for(const r of meta.rows as any[])state[String(r.key)]=String(r.value);
    let cursor=Math.max(0,Number(state.materialize_cursor)||0);
    // GET solo consulta el estado; únicamente POST modifica/materializa el catálogo.
    if(req.method==='GET'){
      const persistent=await db.execute({sql:'SELECT COUNT(*) AS n FROM sifer_master_catalog',args:[]});
      return res.status(200).json({ok:true,done:cursor>=gen.count,cursor,totalCatalog:gen.count,status:state.materialize_status||'pending',persistentTotal:Number(persistent.rows?.[0]?.n)||0});
    }
    if(cursor>=gen.count){
      return res.status(200).json({ok:true,done:true,cursor,totalCatalog:gen.count,inserted:0,status:'complete'});
    }
    const end=Math.min(gen.count,cursor+configured);
    const version='master-v1';
    const now=new Date().toISOString();
    const rows:any[]=[];
    for(let i=cursor;i<end;i++){
      const item=gen.getItem(i);
      if(item?.masterId&&item?.nombre)rows.push(stmt(item,version,now));
    }
    for(let i=0;i<rows.length;i+=250)await db.batch(rows.slice(i,i+250),'write');
    cursor=end;
    const status=cursor>=gen.count?'complete':'running';
    await db.batch([
      {sql:`INSERT INTO sifer_master_catalog_meta(key,value,updated_at) VALUES('materialize_cursor',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`,args:[String(cursor),now]},
      {sql:`INSERT INTO sifer_master_catalog_meta(key,value,updated_at) VALUES('materialize_status',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`,args:[status,now]},
      {sql:`INSERT INTO sifer_master_catalog_meta(key,value,updated_at) VALUES('source_version',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`,args:[version,now]}
    ],'write');
    const count=await db.execute({sql:'SELECT COUNT(*) AS n FROM sifer_master_catalog',args:[]});
    return res.status(200).json({ok:true,done:status==='complete',status,cursor,totalCatalog:gen.count,inserted:rows.length,persistentTotal:Number(count.rows?.[0]?.n)||0,nextCursor:cursor});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}
