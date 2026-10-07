(function(){
  const LOCAL_KEY='sifer360_memory_v2';
  const MAX_EPISODES=300;
  const MAX_FACTS=500;
  let store={facts:{},episodes:[],lastPull:''};
  let ready=false;

  function loadStore(){
    try{
      const raw=localStorage.getItem(LOCAL_KEY);
      if(raw){
        const s=JSON.parse(raw);
        if(s&&typeof s==='object'){
          store.facts=s.facts&&typeof s.facts==='object'?s.facts:{};
          store.episodes=Array.isArray(s.episodes)?s.episodes:[];
          store.lastPull=String(s.lastPull||'');
          return;
        }
      }
    }catch{}
    store={facts:{},episodes:[],lastPull:''};
  }
  function saveStore(){
    try{ localStorage.setItem(LOCAL_KEY,JSON.stringify(store)); }catch{}
  }
  function norm(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  }
  function tokens(s){
    return norm(s).split(/[^a-z0-9]+/).filter(t=>t.length>2);
  }
  function newId(prefix){
    return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  }
  function allFacts(){
    return Object.keys(store.facts).map(k=>store.facts[k]);
  }
  function scoreFact(f,qTokens){
    if(!qTokens.length) return 0;
    const hay=norm((f.content||'')+' '+(f.tags||''));
    let score=0;
    for(const t of qTokens) if(hay.includes(t)) score++;
    return score;
  }

  async function push(path,body){
    try{
      const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
      if(!r.ok) return null;
      return await r.json();
    }catch{return null;}
  }

  async function pullSync(){
    try{
      const data=await push('/api/sifer-memory',{op:'sync',facts:allFacts(),episodes:store.episodes.slice(0,150)});
      if(!data||!data.ok) return false;
      const now=new Date().toISOString();
      for(const f of (data.facts||[])){
        const id=String(f.id||'');
        if(!id) continue;
        const local=store.facts[id];
        const incoming={id:id,content:String(f.content||''),tags:String(f.tags||''),scope:String(f.scope||'global'),use_count:Number(f.use_count)||0,created_at:String(f.created_at||now),updated_at:String(f.updated_at||now)};
        if(!local||String(local.updated_at||'')<=incoming.updated_at) store.facts[id]=incoming;
      }
      const byId={};
      for(const e of store.episodes) if(e&&e.id) byId[e.id]=e;
      for(const e of (data.episodes||[])){
        const id=String(e.id||'');
        if(!id) continue;
        const incoming={id:id,at:String(e.at||now),module:String(e.module||''),command:String(e.command||''),outcome:String(e.outcome||''),success:e.success===0?false:true,created_at:String(e.created_at||now)};
        if(!byId[id]||String(byId[id].at||'')<=incoming.at) byId[id]=incoming;
      }
      store.episodes=Object.keys(byId).map(k=>byId[k]).sort((a,b)=>String(b.at).localeCompare(String(a.at))).slice(0,MAX_EPISODES);
      store.lastPull=now;
      const facts=allFacts();
      if(facts.length>MAX_FACTS) facts.sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,MAX_FACTS).forEach(f=>{delete store.facts[f.id];});
      saveStore();
      return true;
    }catch{return false;}
  }

  function remember(content,tags){
    const text=String(content||'').trim().slice(0,2000);
    if(!text) return null;
    const now=new Date().toISOString();
    const existing=allFacts().find(f=>norm(f.content)===norm(text));
    const id=existing?existing.id:newId('F');
    const fact={id:id,content:text,tags:String(tags||'').slice(0,400),scope:'global',use_count:existing?Number(existing.use_count)||0:0,created_at:existing?existing.created_at:now,updated_at:now};
    store.facts[id]=fact;
    saveStore();
    push('/api/sifer-memory',{op:'fact_save',id:id,content:text,tags:fact.tags,scope:'global'});
    return fact;
  }

  function forget(query){
    const q=String(query||'').trim();
    if(!q) return 0;
    let deleted=0;
    if(store.facts[q]){ delete store.facts[q]; deleted=1; }
    else{
      const qTokens=tokens(q);
      for(const f of allFacts()){
        if(scoreFact(f,qTokens)>0){ delete store.facts[f.id]; deleted++; }
      }
    }
    if(deleted) saveStore();
    push('/api/sifer-memory',{op:'fact_delete',q:q});
    return deleted;
  }

  function recordEpisode(command,module,outcome,success){
    try{
      const now=new Date().toISOString();
      const ep={id:newId('E'),at:now,module:String(module||'').slice(0,80),command:String(command||'').slice(0,400),outcome:String(outcome||'').slice(0,900),success:success!==false,created_at:now};
      store.episodes.unshift(ep);
      if(store.episodes.length>MAX_EPISODES) store.episodes.length=MAX_EPISODES;
      saveStore();
      push('/api/sifer-memory',{op:'episode_save',...ep});
      return ep;
    }catch{return null;}
  }

  function relevantFacts(command,limit){
    const qTokens=tokens(command);
    const facts=allFacts();
    const scored=facts.map(f=>({f:f,s:scoreFact(f,qTokens)}));
    scored.sort((a,b)=>b.s-a.s||String(b.f.updated_at).localeCompare(String(a.f.updated_at)));
    const matched=scored.filter(x=>x.s>0).slice(0,limit).map(x=>x.f);
    if(matched.length>=Math.min(3,limit)) return matched;
    const fallback=scored.slice(0,limit).map(x=>x.f);
    const seen={};
    return matched.concat(fallback.filter(f=>{if(seen[f.id])return false;seen[f.id]=1;return matched.every(m=>m.id!==f.id)})).slice(0,limit);
  }

  function contextSlice(command){
    try{
      const facts=relevantFacts(command,8).map(f=>({content:f.content,tags:f.tags||''}));
      const episodes=store.episodes.slice(0,6).map(e=>({at:e.at,module:e.module,command:e.command,outcome:e.outcome,success:e.success}));
      const failures=store.episodes.filter(e=>!e.success).slice(0,4).map(e=>({command:e.command,outcome:e.outcome}));
      return {facts:facts,episodes:episodes,recentFailures:failures,totalFacts:allFacts().length,totalEpisodes:store.episodes.length};
    }catch{return null;}
  }

  function recallList(q,limit){
    const facts=q?relevantFacts(q,limit||10):allFacts().sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))).slice(0,limit||10);
    return facts;
  }

  function boot(){
    loadStore();
    ready=true;
    pullSync().catch(()=>{});
    setInterval(()=>{ pullSync().catch(()=>{}); },120000);
  }

  window.SIFER_MEMORY={
    boot:boot,
    remember:remember,
    forget:forget,
    recordEpisode:recordEpisode,
    contextSlice:contextSlice,
    recallList:recallList,
    pullSync:pullSync,
    isReady:()=>ready,
    stats:()=>({facts:allFacts().length,episodes:store.episodes.length})
  };

  boot();
})();
