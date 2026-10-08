(function(){
  const SCHEMA=2;
  const LOCAL_KEY='sifer360_atlas_v2';
  const SLEEP=ms=>new Promise(r=>setTimeout(r,ms));
  const MAX_BUTTONS=700;
  const MAX_FIELDS=400;
  let current=null;
  let busy=false;

  const MODAL_OPENERS={
    inicio:[['openBCV']],
    pos:[['openItemSearch'],['openClientSearch'],['checkout'],['openDeliveryModal'],['openShipToModal'],['openCustomerClassModal'],['openGiftCardModal']],
    productos:[['openProduct'],['openRepuestoModal'],['openMasterCatalogSelectorModal','producto']],
    repuestos:[['openRepuestoModal'],['openMasterCatalogSelectorModal','repuesto']],
    compras:[['openPurchase']],
    clientes:[['openClient'],['openClientSearch']],
    proveedores:[['openSupplier']],
    presupuestos:[['openQuote']],
    pedidos:[['nuevoPedido']],
    usuarios:[['nuevoUsuario']],
    caja:[['showCorteZ']],
    config:[['openCustomerClassModal'],['openDeliveryModal'],['openGiftCardModal'],['openShipToModal']],
    master_catalog:[['openMasterCatalogSelectorModal','producto']]
  };

  function norm(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/\s+/g,' ').trim();
  }
  function textOf(el){
    const v=el?.innerText||el?.value||el?.getAttribute?.('aria-label')||el?.title||'';
    return String(v).replace(/\s+/g,' ').trim().slice(0,160);
  }
  function handlerOf(el){
    const oc=el.getAttribute?.('onclick')||'';
    const m=oc.match(/^\s*([A-Za-z_$][\w$]*)\s*\(/);
    return m?m[1]:'';
  }
  function labelOf(el){
    if(!el.id) return el.getAttribute?.('aria-label')||'';
    const lb=document.querySelector('label[for="'+String(el.id).replace(/"/g,'')+'"]');
    return lb?textOf(lb):(el.getAttribute?.('aria-label')||'');
  }
  function describeButton(el){
    const h=handlerOf(el);
    const out={t:textOf(el),h:h,ds:el.getAttribute?.('data-sifer')||'',id:el.id||''};
    if(!h) out.oc=String(el.getAttribute?.('onclick')||'').replace(/\s+/g,' ').slice(0,140);
    if(el.disabled) out.dis=1;
    return out;
  }
  function describeField(el){
    const out={tag:el.tagName.toLowerCase(),id:el.id||'',nm:el.name||'',ty:el.type||'',ph:String(el.placeholder||'').slice(0,120),lb:labelOf(el).slice(0,120),ds:el.getAttribute?.('data-sifer')||''};
    const ch=el.getAttribute?.('onchange')||el.getAttribute?.('oninput')||el.getAttribute?.('onclick')||'';
    if(ch) out.ch=String(ch).replace(/\s+/g,' ').slice(0,160);
    if(el.tagName.toLowerCase()==='select'){
      const opts=Array.from(el.options||[]);
      out.opts=opts.slice(0,60).map(o=>({v:String(o.value||'').slice(0,80),t:textOf(o)}));
      out.total=opts.length;
    }
    return out;
  }
  function describeButtons(root){
    const els=Array.from(root.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"],a[href]'));
    const out=[],seen=new Map();
    for(const el of els){
      if(!(textOf(el)||el.id||el.getAttribute?.('data-sifer')||el.getAttribute?.('onclick'))) continue;
      const d=describeButton(el);
      const key=(d.ds?'ds:'+d.ds:'')+'|'+(d.id?'id:'+d.id:'')+'|'+(d.h?'h:'+d.h:'')+'|'+(d.t||'')+'|'+(d.oc||'');
      const prev=seen.get(key);
      if(prev!==undefined){ out[prev].n=(out[prev].n||1)+1; continue; }
      seen.set(key,out.length);
      out.push(d);
      if(out.length>=MAX_BUTTONS) break;
    }
    return out;
  }
  function describeFields(root){
    const els=Array.from(root.querySelectorAll('input,select,textarea'));
    const out=[],seen=new Set();
    for(const el of els){
      if(!(el.id||el.name||el.placeholder||el.getAttribute?.('aria-label')||el.getAttribute?.('data-sifer'))) continue;
      const d=describeField(el);
      const key=(d.id||'')+'|'+(d.nm||'')+'|'+(d.lb||'')+'|'+(d.ph||'')+'|'+(d.ch||'');
      if(seen.has(key)) continue;
      seen.add(key);
      out.push(d);
      if(out.length>=MAX_FIELDS) break;
    }
    return out;
  }
  function describeTables(root){
    return Array.from(root.querySelectorAll('table')).slice(0,12).map(tb=>({
      h:Array.from(tb.querySelectorAll('thead th,thead td')).slice(0,20).map(th=>textOf(th)),
      rows:tb.tBodies&&tb.tBodies[0]?tb.tBodies[0].rows.length:0
    })).filter(t=>t.h.length||t.rows);
  }
  function describeModal(){
    const wrap=document.getElementById('modal');
    if(!wrap||!wrap.classList.contains('show')) return null;
    return {
      ti:String(document.getElementById('modalTitle')?.textContent||'').trim().slice(0,120),
      buttons:describeButtons(wrap),
      fields:describeFields(wrap)
    };
  }
  function closeModalSafe(){
    try{ if(typeof closeModal==='function') closeModal(); else document.getElementById('modal')?.classList.remove('show'); }catch{}
  }

  function captureNav(){
    const bar=document.querySelector('.modulebar');
    const menu=document.querySelector('.menubar');
    return {
      modules:bar?Array.from(bar.querySelectorAll('.module')).map(el=>({k:(el.getAttribute('onclick')||'').match(/go\('([^']+)'\)/)?.[1]||'',t:textOf(el),ds:el.getAttribute('data-sifer')||''})).filter(x=>x.k):[],
      menus:menu?Array.from(menu.querySelectorAll('button')).map(el=>({t:textOf(el),oc:String(el.getAttribute('onclick')||'').slice(0,120)})):[],
      titlebar:Array.from(document.querySelectorAll('.titlebar button,.titlebar .win-icon')).map(el=>({t:textOf(el),h:handlerOf(el)})).filter(x=>x.t||x.h)
    };
  }

  function navModules(){
    const base=typeof navItems==='function'?navItems():[];
    return Array.from(new Map([...base,['pedidos','📝 Pedidos'],['usuarios','👥 Usuarios/Cajas']].map(x=>[x[0],x])).values());
  }
  function currentViewKey(){
    try{
      const active=document.querySelector('.module.active');
      const m=(active?.getAttribute('onclick')||'').match(/go\('([^']+)'\)/);
      if(m) return m[1];
    }catch{}
    return 'inicio';
  }
  function currentModuleKey(){
    try{
      const a=document.querySelector('.module.active');
      const k=(a?.getAttribute('onclick')||'').match(/go\('([^']+)'\)/)?.[1];
      if(k) return k;
    }catch{}
    try{
      const ti=norm(document.getElementById('windowTitle')?.textContent);
      const mods=current?.modules||{};
      const found=Object.keys(mods).find(k=>norm(mods[k].ti)===ti);
      if(found) return found;
    }catch{}
    return 'inicio';
  }

  async function appHash(){
    try{
      const r=await fetch('/index.html',{cache:'no-cache'});
      const html=await r.text();
      const srcs=Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g)).map(m=>m[1]).join(',');
      let h=5381;
      const seed=html+'|'+srcs+'|schema'+SCHEMA;
      for(let i=0;i<seed.length;i++) h=(((h<<5)+h)+seed.charCodeAt(i))|0;
      return (h>>>0).toString(16);
    }catch{return 'nohash';}
  }

  function load(){
    try{
      const raw=localStorage.getItem(LOCAL_KEY);
      if(!raw) return null;
      const a=JSON.parse(raw);
      if(a&&a.schema===SCHEMA&&a.modules) return a;
    }catch{}
    return null;
  }
  function save(a){
    try{ localStorage.setItem(LOCAL_KEY,JSON.stringify(a)); }catch{}
  }

  async function pushCloud(a){
    try{
      const r=await fetch('/api/sifer-atlas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({version:a.version,atlas:a})});
      return !!r.ok;
    }catch{return false;}
  }
  async function pullCloud(version){
    try{
      const r=await fetch('/api/sifer-atlas?version='+encodeURIComponent(version),{cache:'no-store'});
      if(!r.ok) return null;
      const j=await r.json();
      if(j&&j.ok&&j.atlas&&j.atlas.schema===SCHEMA) return j.atlas;
    }catch{}
    return null;
  }

  async function ensureFresh(force){
    const h=await appHash();
    const local=load();
    if(local&&local.version===h){ current=local; return local; }
    const cloud=await pullCloud(h);
    if(cloud){ current=cloud; save(cloud); return cloud; }
    current=local;
    if(force){
      const fresh=await explore(true);
      return fresh;
    }
    return null;
  }

  async function openAndCapture(fnName,arg){
    try{
      const fn=window[fnName];
      if(typeof fn!=='function') return null;
      fn(arg);
      await SLEEP(340);
      const d=describeModal();
      closeModalSafe();
      await SLEEP(70);
      if(!d) return null;
      return {opener:fnName,ti:d.ti,buttons:d.buttons,fields:d.fields};
    }catch{
      closeModalSafe();
      return null;
    }
  }

  function snapshotModule(key,label){
    const main=document.getElementById('main')||document.body;
    const entry={
      key:key,
      ti:String(document.getElementById('windowTitle')?.textContent||'').trim()||String(label||key).replace(/^\S+\s*/,''),
      buttons:describeButtons(main),
      fields:describeFields(main),
      tables:describeTables(main),
      modals:[],
      at:new Date().toISOString()
    };
    return entry;
  }

  async function captureModals(key,entry){
    const openers=MODAL_OPENERS[key]||[];
    const modals=[];
    for(const opener of openers){
      const d=await openAndCapture(opener[0],opener[1]);
      if(d) modals.push(d);
    }
    entry.modals=modals;
  }

  async function explore(force){
    if(busy) throw new Error('SIFER ya está explorando el sistema. Espera a que termine.');
    busy=true;
    try{
      const h=await appHash();
      const orig=currentViewKey();
      const out={schema:SCHEMA,version:h,at:new Date().toISOString(),nav:captureNav(),index:[],modules:{},failures:[]};
      const mods=navModules();
      const navigate=typeof window.go==='function'?window.go:(typeof go==='function'?go:null);
      if(!navigate) throw new Error('Navegación no disponible para explorar el sistema.');
      let visited=0;
      for(const [key,label] of mods){
        try{
          navigate(key);
          await SLEEP(key==='master_catalog'||key==='repuestos'?520:340);
          const entry=snapshotModule(key,label);
          await captureModals(key,entry);
          out.modules[key]=entry;
          visited++;
        }catch(e){
          out.failures.push(key+': '+String(e?.message||e));
        }
      }
      try{ navigate(orig); await SLEEP(260); }catch{}
      out.index=Object.keys(out.modules);
      out.counts={visited:visited,failed:mods.length-visited};
      current=out;
      save(out);
      pushCloud(out);
      return out;
    }finally{ busy=false; }
  }

  function findButton(moduleKey,target){
    const mods=current?.modules||{};
    const mod=mods[moduleKey]||mods[currentModuleKey()];
    if(!mod) return null;
    const q=norm(target);
    if(!q) return null;
    const pools=[{scope:'view',list:mod.buttons}];
    for(const m of (mod.modals||[])) if(m) pools.push({scope:'modal:'+m.ti,list:m.buttons});
    for(const pool of pools){
      for(const b of pool.list){
        if(b.ds&&norm(b.ds)===q) return {...b,by:'data-sifer',scope:pool.scope};
      }
      for(const b of pool.list){
        if(b.h&&norm(b.h)===q) return {...b,by:'handler',scope:pool.scope};
      }
      for(const b of pool.list){
        const t=norm(b.t);
        if(t&&(t===q||t.includes(q)||q.includes(t))) return {...b,by:'text',scope:pool.scope};
      }
    }
    return null;
  }

  function findField(moduleKey,target){
    const mods=current?.modules||{};
    const mod=mods[moduleKey]||mods[currentModuleKey()];
    if(!mod) return null;
    const q=norm(target);
    if(!q) return null;
    const pools=[{scope:'view',list:mod.fields}];
    for(const m of (mod.modals||[])) if(m) pools.push({scope:'modal:'+m.ti,list:m.fields});
    for(const pool of pools){
      for(const f of pool.list){
        if(f.ds&&norm(f.ds)===q) return {...f,by:'data-sifer',scope:pool.scope};
      }
      for(const f of pool.list){
        if(f.id&&norm(f.id)===q) return {...f,by:'id',scope:pool.scope};
      }
      for(const f of pool.list){
        const hay=norm([f.lb,f.ph,f.nm,f.id].join(' '));
        if(hay&&(hay===q||hay.includes(q)||q.includes(hay))) return {...f,by:'label',scope:pool.scope};
      }
    }
    return null;
  }

  function contextSlice(){
    const a=current;
    if(!a) return null;
    const key=currentModuleKey();
    const mod=a.modules[key]||null;
    return {
      schema:a.schema,
      version:a.version,
      generatedAt:a.at,
      currentKey:key,
      currentTitle:mod?mod.ti:'',
      index:Object.keys(a.modules).map(k=>({key:k,title:a.modules[k].ti})),
      summary:Object.keys(a.modules).map(k=>{
        const m=a.modules[k]||{};
        return {key:k,title:m.ti,buttons:(m.buttons||[]).slice(0,50).map(b=>b.ds||b.h||b.t).filter(Boolean),modals:(m.modals||[]).map(x=>x.ti)};
      }),
      menus:a.nav&&a.nav.menus?a.nav.menus.map(m=>m.t):[],
      current:mod,
      exploredAt:a.at
    };
  }

  function boot(){
    ensureFresh().then(a=>{
      if(!a||!current||!current.index||!current.index.length){
        setTimeout(()=>{ try{ explore(); }catch{} },1500);
      }
    }).catch(()=>{});
  }

  window.SIFER_ATLAS={
    SCHEMA:SCHEMA,
    load:load,
    explore:explore,
    ensureFresh:ensureFresh,
    get:()=>current,
    appHash:appHash,
    navModules:navModules,
    currentModuleKey:currentModuleKey,
    contextSlice:contextSlice,
    findButton:findButton,
    findField:findField,
    isBusy:()=>busy,
    refresh:()=>ensureFresh(true)
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else setTimeout(boot,0);
})();
