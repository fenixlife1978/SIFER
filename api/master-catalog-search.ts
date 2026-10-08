import { createClient } from '@libsql/client';

const norm=(s:any)=>String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');

export default async function handler(req:any,res:any){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,error:'Turso no configurado'});
  try{
    const db=createClient({url,authToken});
    const q=String(req.query?.q||'').trim();
    const category=String(req.query?.category||'Todos').trim();
    const page=Math.max(1,Number(req.query?.page)||1);
    const pageSize=Math.min(50,Math.max(1,Number(req.query?.pageSize)||20));
    const terms=norm(q).split(/\\s+/).filter(Boolean).slice(0,8);
    const where:string[]=[]; const args:any[]=[];
    for(const term of terms){ where.push('searchable_text LIKE ?'); args.push('%'+term+'%'); }
    if(category && category!=='Todos'){ where.push('categoria = ?'); args.push(category); }
    const whereSql=where.length?' WHERE '+where.join(' AND '):'';
    const count=await db.execute({sql:'SELECT COUNT(*) AS n FROM sifer_master_catalog'+whereSql,args});
    const total=Number(count.rows?.[0]?.n)||0;
    const offset=(page-1)*pageSize;
    const rows=await db.execute({sql:`SELECT master_id AS masterId,nombre,descripcion_tecnica AS descripcionTecnica,categoria,subcategoria,marca,origen_marca AS origenMarca,tipo_marca AS tipoMarca,codigo_proveedor AS codigoProveedor,codigo_oem AS codigoOEM,unidad_medida AS unidadMedida,costo_referencial AS costoReferencial,margen_sugerido AS margenSugerido,especificaciones,foto_real AS fotoReal,distribuidor,referencias_json AS referenciasJson,compatibilidad_json AS compatibilidadJson FROM sifer_master_catalog${whereSql} ORDER BY nombre,master_id LIMIT ? OFFSET ?`,args:[...args,pageSize,offset]});
    const items=(rows.rows as any[]).map(r=>({...r,referenciasCruzadas:JSON.parse(String(r.referenciasJson||'[]')),compatibilidad:JSON.parse(String(r.compatibilidadJson||'[]'))}));
    return res.status(200).json({ok:true,persistentSource:true,items,totalMatched:total,totalCatalog:total,page,totalPages:Math.max(1,Math.ceil(total/pageSize))});
  }catch(e:any){ return res.status(503).json({ok:false,error:String(e?.message||e)}); }
}
