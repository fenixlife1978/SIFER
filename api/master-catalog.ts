import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS sifer_master_catalog (
    master_id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion_tecnica TEXT,
    categoria TEXT,
    subcategoria TEXT,
    marca TEXT,
    origen_marca TEXT,
    tipo_marca TEXT,
    codigo_proveedor TEXT,
    codigo_oem TEXT,
    unidad_medida TEXT,
    costo_referencial REAL NOT NULL DEFAULT 0,
    margen_sugerido REAL NOT NULL DEFAULT 35,
    especificaciones TEXT,
    foto_real TEXT,
    distribuidor TEXT,
    referencias_json TEXT NOT NULL DEFAULT '[]',
    compatibilidad_json TEXT NOT NULL DEFAULT '[]',
    searchable_text TEXT NOT NULL,
    source_version TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sifer_master_catalog_search ON sifer_master_catalog(searchable_text)`,
  `CREATE INDEX IF NOT EXISTS idx_sifer_master_catalog_categoria ON sifer_master_catalog(categoria)`,
  `CREATE INDEX IF NOT EXISTS idx_sifer_master_catalog_marca ON sifer_master_catalog(marca)`,
  `CREATE INDEX IF NOT EXISTS idx_sifer_master_catalog_oem ON sifer_master_catalog(codigo_oem)`,
  `CREATE TABLE IF NOT EXISTS sifer_master_catalog_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`
];

function rowToItem(r:any){
  return {
    masterId:String(r.master_id),
    nombre:String(r.nombre||''),
    descripcionTecnica:String(r.descripcion_tecnica||''),
    categoria:String(r.categoria||''),
    subcategoria:String(r.subcategoria||''),
    marca:String(r.marca||''),
    origenMarca:String(r.origen_marca||''),
    tipoMarca:String(r.tipo_marca||''),
    codigoProveedor:String(r.codigo_proveedor||''),
    codigoOEM:String(r.codigo_oem||''),
    unidadMedida:String(r.unidad_medida||''),
    costoReferencial:Number(r.costo_referencial)||0,
    margenSugerido:Number(r.margen_sugerido)||0,
    especificaciones:String(r.especificaciones||''),
    fotoReal:String(r.foto_real||''),
    fotoFallback:String(r.foto_real||''),
    distribuidor:String(r.distribuidor||''),
    referenciasCruzadas:JSON.parse(String(r.referencias_json||'[]')),
    compatibilidad:JSON.parse(String(r.compatibilidad_json||'[]'))
  };
}

function normalize(s:any){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
}

function tokens(s:any){
  return normalize(s).split(/\\s+/).filter(Boolean);
}

function score(text:string,q:string){
  const t=normalize(text), ts=tokens(q);
  if(!ts.length)return 0;
  let hit=0;
  for(const x of ts){
    if(t.includes(x))hit++;
  }
  return hit/ts.length;
}

let generatorPromise: Promise<any> | null = null;

async function loadCatalogGenerator(req:any){
  if(generatorPromise) return generatorPromise;
  generatorPromise=(async()=>{
    let source='';
    const localPath=path.join(process.cwd(),'public','master_catalog.js');
    try{
      source=fs.readFileSync(localPath,'utf8');
    }catch{
      const proto=String(req.headers?.['x-forwarded-proto']||'https').split(',')[0];
      const host=String(req.headers?.host||'');
      if(!host) throw new Error('No se pudo localizar la fuente del Catálogo Máster.');
      const r=await fetch(proto+'://'+host+'/master_catalog.js',{cache:'no-store'});
      if(!r.ok) throw new Error('No se pudo cargar la fuente del Catálogo Máster.');
      source=await r.text();
    }
    const sandbox:any={
      window:{},
      console:{log(){},warn(){},error(){}},
      setTimeout,
      clearTimeout
    };
    vm.runInNewContext(source,sandbox,{timeout:5000,filename:'master_catalog.js'});
    const getItem=sandbox.window.getMasterItemByIndex;
    const getManifest=sandbox.window.getMasterCatalogSourceManifest;
    const count=Number(sandbox.window.TOTAL_VIRTUAL_CATALOG_COUNT)||0;
    if(typeof getItem!=='function'||typeof getManifest!=='function'||!count) throw new Error('La fuente del Catálogo Máster no expone el generador esperado.');
    return {getItem,getManifest,count};
  })().catch(err=>{generatorPromise=null;throw err;});
  return generatorPromise;
}

function categoryMatches(item:any,category:string){
  if(!category||category==='Todos') return true;
  const cat=normalize(category);
  const hay=normalize([item.categoria,item.subcategoria,item.nombre,item.marca,item.origenMarca,item.tipoMarca].join(' '));
  if(category==='Nacionales Venezolanas') return hay.includes('venezuela')||item.tipoMarca==='nacional_lider'||item.tipoMarca==='nacional';
  if(category==='Importadas Premium') return item.tipoMarca==='importada_premium'||item.tipoMarca==='premium';
  if(category==='Repuestos Chinos') return ['chery','jac','changan','great wall'].some(x=>hay.includes(x))||item.tipoMarca==='economica';
  if(category==='Aceites y Lubricantes') return hay.includes('aceite')||hay.includes('lubricante');
  return hay.includes(cat)||(category==='Distribución'&&(hay.includes('tiempo')||hay.includes('distribucion')||hay.includes('tensor')));
}

function deterministicCandidateIndexes(q:string,manifest:any,count:number){
  const qNorm=normalize(q);
  const qTokens=tokens(q);
  const vehicles=Array.isArray(manifest?.vehicles)?manifest.vehicles:[];
  const templates=Array.isArray(manifest?.templates)?manifest.templates:[];
  const brands=Array.isArray(manifest?.sparePartBrands)?manifest.sparePartBrands:[];
  const vehicleMatches:any[]=[];
  const templateMatches:any[]=[];
  vehicles.forEach((veh:any,vIdx:number)=>{
    const text=normalize([veh.marca,veh.modelo,veh.anios,veh.motor].join(' '));
    const hits=qTokens.filter((t:string)=>text.includes(t));
    if(hits.length>=Math.min(2,qTokens.length)||qTokens.some((t:string)=>t===normalize(veh.marca)||t===normalize(String(veh.modelo||'').split(' ')[0]))) vehicleMatches.push({vIdx,score:hits.length});
  });
  templates.forEach((tpl:any,tplIdx:number)=>{
    const text=normalize([tpl.nameTpl,tpl.cat,tpl.u,tpl.oemPref].join(' '));
    const hits=qTokens.filter((t:string)=>text.includes(t));
    if(hits.length) templateMatches.push({tplIdx,score:hits.length});
  });
  const out=new Set<number>();
  if(vehicleMatches.length&&templateMatches.length){
    for(const vm of vehicleMatches) for(const tm of templateMatches) for(let bIdx=0;bIdx<brands.length;bIdx++){
      const adjIdx=bIdx*vehicles.length*templates.length+tm.tplIdx*vehicles.length+vm.vIdx;
      const index=120000+adjIdx;
      if(index<count) out.add(index);
    }
  }else if(templateMatches.length&&!vehicleMatches.length){
    for(const tm of templateMatches) for(let vIdx=0;vIdx<vehicles.length;vIdx++) for(let bIdx=0;bIdx<brands.length;bIdx++){
      const adjIdx=bIdx*vehicles.length*templates.length+tm.tplIdx*vehicles.length+vIdx;
      const index=120000+adjIdx;
      if(index<count) out.add(index);
    }
  }
  return [...out];
}

async function generatePersistentCandidates(req:any,q:string,category:string){
  const gen=await loadCatalogGenerator(req);
  const indexes=deterministicCandidateIndexes(q,gen.getManifest(),gen.count);
  if(!indexes.length) return [];
  const qTokens=tokens(q);
  const out:any[]=[];
  for(const index of indexes){
    const item=gen.getItem(index);
    if(!categoryMatches(item,category)) continue;
    const hay=normalize([item.nombre,item.marca,item.codigoOEM,item.codigoProveedor,item.categoria,item.subcategoria,item.descripcionTecnica,item.especificaciones,item.origenMarca,item.unidadMedida].join(' '));
    if(qTokens.length&&!qTokens.every((t:string)=>hay.includes(t))) continue;
    out.push(item);
  }
  out.sort((a:any,b:any)=>score([b.nombre,b.marca,b.codigoOEM,b.codigoProveedor,b.categoria,b.subcategoria].join(' '),q)-score([a.nombre,a.marca,a.codigoOEM,a.codigoProveedor,a.categoria,a.subcategoria].join(' '),q));
  return out;
}

function itemToStmt(x:any,version:string,now:string){
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
  if(req.method!=='GET' && req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  try{
    for(const sql of SCHEMA) await db.execute({sql,args:[]});

    if(req.method==='POST'){
      const body=req.body||{};
      const action=String(body.action||'');
      if(action==='upsert-batch'){
        const rows=Array.isArray(body.items)?body.items:[];
        if(!rows.length)return res.status(400).json({ok:false,error:'items es obligatorio'});
        const now=new Date().toISOString();
        const version=String(body.sourceVersion||'master-v1');
        const stmts=rows.filter((x:any)=>x?.masterId&&x?.nombre).map((x:any)=>itemToStmt(x,version,now));
        for(let i=0;i<stmts.length;i+=250) await db.batch(stmts.slice(i,i+250),'write');
        await db.execute({sql:`INSERT INTO sifer_master_catalog_meta(key,value,updated_at) VALUES('source_version',?,?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`,args:[version,now]});
        const count=await db.execute({sql:'SELECT COUNT(*) AS n FROM sifer_master_catalog',args:[]});
        return res.status(200).json({ok:true,upserted:stmts.length,total:Number(count.rows?.[0]?.n)||0});
      }
      return res.status(400).json({ok:false,error:'Acción no soportada'});
    }

    const q=String(req.query?.q||'').trim();
    const category=String(req.query?.category||'Todos');
    const page=Math.max(1,Number(req.query?.page)||1);
    const pageSize=Math.min(100,Math.max(1,Number(req.query?.pageSize)||20));

    // Si Turso todavía no contiene esa combinación, reconstruimos el candidato
    // directamente desde la fuente determinista y lo persistimos antes de responder.
    // Así la búsqueda factual no depende del navegador ni del muestreo de 4.500 filas.
    if(q){
      const probe=await db.execute({
        sql:`SELECT master_id FROM sifer_master_catalog
             WHERE ${tokens(q).map(()=> 'searchable_text LIKE ?').join(' AND ')} LIMIT 1`,
        args:tokens(q).map((t:string)=>'%'+t+'%')
      });
      if(!probe.rows?.length){
        const generated=await generatePersistentCandidates(req,q,category);
        if(generated.length){
          const now=new Date().toISOString();
          const stmts=generated.slice(0,100).map((x:any)=>itemToStmt(x,'master-v1',now));
          for(let i=0;i<stmts.length;i+=250) await db.batch(stmts.slice(i,i+250),'write');
        }
      }
    }
    if(!q && category==='Todos'){
      const count=await db.execute({sql:'SELECT COUNT(*) AS n FROM sifer_master_catalog',args:[]});
      return res.status(200).json({ok:true,persistent:true,items:[],totalMatched:Number(count.rows?.[0]?.n)||0,page,totalPages:Math.max(1,Math.ceil((Number(count.rows?.[0]?.n)||0)/pageSize))});
    }

    const where:any[]=[];
    const args:any[]=[];
    if(category && category!=='Todos'){where.push('LOWER(categoria)=LOWER(?)');args.push(category);}
    if(q){
      const ts=tokens(q);
      for(const t of ts){where.push('searchable_text LIKE ?');args.push('%'+t+'%');}
    }
    const clause=where.length?' WHERE '+where.join(' AND '):'';
    const count=await db.execute({sql:`SELECT COUNT(*) AS n FROM sifer_master_catalog${clause}`,args});
    const total=Number(count.rows?.[0]?.n)||0;
    const offset=(page-1)*pageSize;
    const data=await db.execute({sql:`SELECT * FROM sifer_master_catalog${clause} LIMIT ? OFFSET ?`,args:[...args,pageSize,offset]});
    const items=data.rows.map(rowToItem);
    items.sort((a:any,b:any)=>score([b.nombre,b.marca,b.codigoOEM,b.codigoProveedor,b.categoria,b.subcategoria].join(' '),q)-score([a.nombre,a.marca,a.codigoOEM,a.codigoProveedor,a.categoria,a.subcategoria].join(' '),q));
    return res.status(200).json({ok:true,persistent:true,items,totalMatched:total,page,totalPages:Math.max(1,Math.ceil(total/pageSize))});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
