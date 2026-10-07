import { createClient } from '@libsql/client';

function dbClient(){
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return null;
  return createClient({url,authToken});
}

function queryParam(req:any,name:string){
  const direct=req.query&&req.query[name];
  if(direct!==undefined) return String(direct);
  const qs=String(req.url||'').split('?')[1]||'';
  const m=qs.match(new RegExp('(?:^|&)'+name+'=([^&]*)'));
  return m?decodeURIComponent(m[1]):'';
}

async function ensure(db:any){
  await db.batch([
    {sql:`CREATE TABLE IF NOT EXISTS sifer_memory_facts(
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '',
      scope TEXT NOT NULL DEFAULT 'global',
      use_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_used_at TEXT
    )`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_memory_episodes(
      id TEXT PRIMARY KEY,
      at TEXT NOT NULL,
      module TEXT,
      command TEXT,
      outcome TEXT,
      success INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )`,args:[]}
  ],'write');
}

function norm(s:any){
  return String(s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
}
function tokens(s:any){
  return norm(s).split(/[^a-z0-9]+/).filter(t=>t.length>2);
}
function scoreFact(fact:any,qTokens:string[]){
  if(!qTokens.length) return 0;
  const hay=norm(fact.content+' '+(fact.tags||''));
  let score=0;
  for(const t of qTokens) if(hay.includes(t)) score++;
  return score;
}

export default async function handler(req:any,res:any){
  const db=dbClient();
  if(!db) return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  try{
    await ensure(db);

    if(req.method==='GET'){
      const op=queryParam(req,'op')||'search';
      const limit=Math.min(50,Math.max(1,Number(queryParam(req,'limit'))||10));
      if(op==='episodes_list'){
        const rows=await db.execute({sql:'SELECT id,at,module,command,outcome,success,created_at FROM sifer_memory_episodes ORDER BY at DESC LIMIT ?',args:[limit]});
        return res.status(200).json({ok:true,episodes:rows.rows});
      }
      if(op==='facts_list'){
        const rows=await db.execute({sql:'SELECT id,content,tags,scope,use_count,created_at,updated_at FROM sifer_memory_facts ORDER BY updated_at DESC LIMIT 500',args:[]});
        return res.status(200).json({ok:true,facts:rows.rows});
      }
      const q=queryParam(req,'q');
      const rows=await db.execute({sql:'SELECT id,content,tags,scope,use_count,created_at,updated_at FROM sifer_memory_facts ORDER BY updated_at DESC LIMIT 500',args:[]});
      const qTokens=tokens(q);
      const scored=rows.rows.map(f=>({fact:f,score:scoreFact(f,qTokens)}));
      scored.sort((a:any,b:any)=>b.score-a.score||String(b.fact.updated_at).localeCompare(String(a.fact.updated_at)));
      const facts=scored.slice(0,limit).filter((x:any)=>!qTokens.length||x.score>0).map((x:any)=>({...x.fact,score:x.score}));
      const eps=await db.execute({sql:'SELECT id,at,module,command,outcome,success FROM sifer_memory_episodes ORDER BY at DESC LIMIT 8',args:[]});
      return res.status(200).json({ok:true,facts,episodes:eps.rows,query:q});
    }

    if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
    const body=req.body||{};
    const op=String(body.op||'');

    if(op==='fact_save'){
      const content=String(body.content||'').trim().slice(0,2000);
      if(!content) return res.status(400).json({ok:false,error:'content es obligatorio'});
      const id=String(body.id||'').trim()||('F-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7));
      const tags=String(body.tags||'').trim().slice(0,400);
      const scope=String(body.scope||'global').trim().slice(0,60);
      const now=new Date().toISOString();
      await db.execute({sql:`INSERT INTO sifer_memory_facts(id,content,tags,scope,use_count,created_at,updated_at)
        VALUES(?,?,?,?,0,?,?)
        ON CONFLICT(id) DO UPDATE SET content=excluded.content,tags=excluded.tags,scope=excluded.scope,updated_at=excluded.updated_at`,
        args:[id,content,tags,scope,now,now]});
      return res.status(200).json({ok:true,id,content,tags,scope});
    }

    if(op==='fact_delete'){
      const id=String(body.id||'').trim();
      const q=norm(body.q||'').trim();
      if(id){
        const r=await db.execute({sql:'DELETE FROM sifer_memory_facts WHERE id=?',args:[id]});
        return res.status(200).json({ok:true,deleted:r.rowsAffected,id});
      }
      if(q){
        const rows=await db.execute({sql:'SELECT id,content FROM sifer_memory_facts LIMIT 500',args:[]});
        const qTokens=tokens(q);
        let deleted=0;
        for(const f of rows.rows) if(scoreFact(f,qTokens)>0){ await db.execute({sql:'DELETE FROM sifer_memory_facts WHERE id=?',args:[String(f.id)]}); deleted++; }
        return res.status(200).json({ok:true,deleted});
      }
      return res.status(400).json({ok:false,error:'id o q es obligatorio'});
    }

    if(op==='episode_save'){
      const id=String(body.id||'').trim()||('E-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7));
      const at=String(body.at||new Date().toISOString());
      const module=String(body.module||'').slice(0,80);
      const command=String(body.command||'').slice(0,400);
      const outcome=String(body.outcome||'').slice(0,900);
      const success=body.success===false||body.success===0?0:1;
      await db.execute({sql:`INSERT OR REPLACE INTO sifer_memory_episodes(id,at,module,command,outcome,success,created_at)
        VALUES(?,?,?,?,?,?,?)`,args:[id,at,module,command,outcome,success,new Date().toISOString()]});
      const trim=await db.execute({sql:`DELETE FROM sifer_memory_episodes WHERE id NOT IN
        (SELECT id FROM sifer_memory_episodes ORDER BY at DESC LIMIT 400)`,args:[]});
      return res.status(200).json({ok:true,id,trimmed:trim.rowsAffected});
    }

    if(op==='sync'){
      const facts=Array.isArray(body.facts)?body.facts.slice(0,200):[];
      const episodes=Array.isArray(body.episodes)?body.episodes.slice(0,200):[];
      const now=new Date().toISOString();
      let saved=0;
      for(const f of facts){
        const id=String(f?.id||'').trim(), content=String(f?.content||'').trim().slice(0,2000);
        if(!id||!content) continue;
        await db.execute({sql:`INSERT INTO sifer_memory_facts(id,content,tags,scope,use_count,created_at,updated_at)
          VALUES(?,?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET content=excluded.content,tags=excluded.tags,updated_at=excluded.updated_at`,
          args:[id,content,String(f.tags||'').slice(0,400),String(f.scope||'global').slice(0,60),Number(f.use_count)||0,String(f.created_at||now),String(f.updated_at||now)]});
        saved++;
      }
      for(const e of episodes){
        const id=String(e?.id||'').trim();
        if(!id) continue;
        await db.execute({sql:`INSERT OR REPLACE INTO sifer_memory_episodes(id,at,module,command,outcome,success,created_at)
          VALUES(?,?,?,?,?,?,?)`,args:[id,String(e.at||now),String(e.module||'').slice(0,80),String(e.command||'').slice(0,400),String(e.outcome||'').slice(0,900),e.success===false?0:1,String(e.created_at||now)]});
        saved++;
      }
      const factsRows=await db.execute({sql:'SELECT id,content,tags,scope,use_count,created_at,updated_at FROM sifer_memory_facts ORDER BY updated_at DESC LIMIT 500',args:[]});
      const epsRows=await db.execute({sql:'SELECT id,at,module,command,outcome,success,created_at FROM sifer_memory_episodes ORDER BY at DESC LIMIT 100',args:[]});
      return res.status(200).json({ok:true,saved,facts:factsRows.rows,episodes:epsRows.rows});
    }

    return res.status(400).json({ok:false,error:'op no reconocida'});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
