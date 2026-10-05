/* SIFER360 - persistencia local-first y cola de sincronización.
 * La operación POS sigue funcionando sin Internet. IndexedDB conserva una copia
 * durable del estado y una cola de eventos; localStorage queda como caché rápida
 * de compatibilidad durante la migración a Turso.
 */
(function(global){
  const DB_NAME='sifer360_offline';
  const DB_VERSION=1;
  const STATE_STORE='state';
  const QUEUE_STORE='queue';
  let readyPromise=null;
  let lastSnapshot=null;

  function open(){
    if(readyPromise) return readyPromise;
    readyPromise=new Promise((resolve,reject)=>{
      if(!('indexedDB' in global)){ resolve(null); return; }
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STATE_STORE))db.createObjectStore(STATE_STORE);if(!db.objectStoreNames.contains(QUEUE_STORE)){const s=db.createObjectStore(QUEUE_STORE,{keyPath:'operationId'});s.createIndex('createdAt','createdAt');}};
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>resolve(null);
    });
    return readyPromise;
  }
  function tx(store,mode,fn){
    return open().then(db=>{if(!db)return null;return new Promise(resolve=>{const t=db.transaction(store,mode),s=t.objectStore(store);let out;try{out=fn(s)}catch(e){resolve(null);return}t.oncomplete=()=>resolve(out);t.onerror=()=>resolve(null);});});
  }
  function clone(v){try{return structuredClone(v)}catch(e){return JSON.parse(JSON.stringify(v))}}
  function saveState(state){
    lastSnapshot=clone(state);
    return tx(STATE_STORE,'readwrite',s=>s.put({savedAt:new Date().toISOString(),state:lastSnapshot},'current'));
  }
  function loadState(){
    return tx(STATE_STORE,'readonly',s=>{const r=s.get('current');r.onsuccess=()=>{};return r;}).then(()=>null);
  }
  function enqueue(type,payload){
    const operationId=(global.crypto&&crypto.randomUUID)?crypto.randomUUID():('op-'+Date.now()+'-'+Math.random().toString(36).slice(2));
    const item={operationId,type,payload:clone(payload),createdAt:new Date().toISOString(),attempts:0,status:'pending'};
    return tx(QUEUE_STORE,'readwrite',s=>s.put(item)).then(()=>item);
  }
  async function syncPending(){
    if(!navigator.onLine)return;
    const db=await open(); if(!db)return;
    const items=await new Promise(resolve=>{const t=db.transaction(QUEUE_STORE,'readonly'),s=t.objectStore(QUEUE_STORE),a=[];const r=s.openCursor();r.onsuccess=()=>{const cur=r.result;if(cur){a.push(cur.value);cur.continue()}else resolve(a)};r.onerror=()=>resolve(a)});
    for(const item of items){
      try{
        const response=await fetch('/api/turso-sync',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(item)});
        if(!response.ok) throw new Error('HTTP '+response.status);
        await tx(QUEUE_STORE,'readwrite',s=>s.delete(item.operationId));
      }catch(e){break}
    }
    updateStatus();
  }
  async function getQueueCount(){
    const db=await open(); if(!db)return 0;
    return new Promise(resolve=>{const t=db.transaction(QUEUE_STORE,'readonly'),r=t.objectStore(QUEUE_STORE).count();r.onsuccess=()=>resolve(r.result||0);r.onerror=()=>resolve(0)});
  }
  function updateStatus(){
    const el=document.getElementById('syncStatus');
    if(!el)return;
    const online=navigator.onLine;
    getQueueCount().then(n=>{el.textContent=online?(n?'🟡 En línea · '+n+' pendientes':'🟢 En línea'):'🔴 Sin Internet'+(n?' · '+n+' pendientes':'');});
    el.title=online?'Conexión disponible. Pendientes de sincronización se procesarán cuando el adaptador Turso esté configurado.':'El POS continúa operando con almacenamiento local durable.';
  }
  async function persist(state,reason){
    await saveState(state);
    await enqueue('products-inventory-snapshot',{reason,products:Array.isArray(state?.productos)?clone(state.productos):[],at:new Date().toISOString()});
    updateStatus();
    if(navigator.onLine) syncPending();
  }
  global.SiferOffline={
    open,persist,saveState,enqueue,loadState,syncPending,updateStatus,
    isSupported:()=>('indexedDB' in global)
  };
  global.addEventListener('online',()=>{updateStatus();syncPending()});
  global.addEventListener('offline',updateStatus);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{updateStatus();syncPending()});else {updateStatus();syncPending();}
})(window);
