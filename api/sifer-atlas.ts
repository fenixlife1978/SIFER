import { createClient } from '@libsql/client';

function dbClient(){
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return null;
  return createClient({url,authToken});
}

async function ensure(db:any){
  await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_atlas(
    version TEXT PRIMARY KEY,
    atlas_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,args:[]});
}

export default async function handler(req:any,res:any){
  const db=dbClient();
  if(!db) return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  try{
    await ensure(db);
    if(req.method==='GET'){
      const version=String(req.query?.version||req.url?.split('?')[1]?.replace(/^version=/,'')||'').trim();
      if(!version) return res.status(400).json({ok:false,error:'version es obligatoria'});
      const rows=await db.execute({sql:'SELECT atlas_json,updated_at FROM sifer_atlas WHERE version=? LIMIT 1',args:[version]});
      if(!rows.rows.length) return res.status(200).json({ok:true,found:false});
      let atlas:any=null;
      try{ atlas=JSON.parse(String(rows.rows[0].atlas_json)); }catch{ atlas=null; }
      if(!atlas) return res.status(200).json({ok:true,found:false});
      return res.status(200).json({ok:true,found:true,version,atlas,updatedAt:rows.rows[0].updated_at});
    }
    if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
    const body=req.body||{};
    const version=String(body.version||'').trim();
    const atlas=body.atlas;
    if(!version||!atlas||typeof atlas!=='object') return res.status(400).json({ok:false,error:'version y atlas son obligatorios'});
    const json=JSON.stringify(atlas);
    if(json.length>6000000) return res.status(413).json({ok:false,error:'Atlas demasiado grande'});
    await db.execute({sql:`INSERT INTO sifer_atlas(version,atlas_json,updated_at) VALUES(?,?,?)
      ON CONFLICT(version) DO UPDATE SET atlas_json=excluded.atlas_json,updated_at=excluded.updated_at`,
      args:[version,json,new Date().toISOString()]});
    return res.status(200).json({ok:true,version,bytes:json.length});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
