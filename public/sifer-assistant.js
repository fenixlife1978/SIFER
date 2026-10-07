/* SIFER — holographic POS assistant
 * Reversible integration: this file owns the assistant UI and can be removed
 * without touching POS business logic.
 */
(() => {
  if(window.__SIFER_ASSISTANT_LOADED__) return;
  window.__SIFER_ASSISTANT_LOADED__=true;
  const messages = [];
  let open = false;
  let busy = false;

  const css = `
  #sifer-ai-root{position:fixed;right:16px;bottom:16px;width:92px;height:92px;z-index:2147483647;font-family:Arial,sans-serif;pointer-events:none}
  #sifer-ai-orb{position:absolute;inset:0;width:92px;height:92px;border:0;background:transparent;padding:0;margin:0;cursor:pointer;pointer-events:auto;outline:none}
  #sifer-ai-orb:before,#sifer-ai-orb:after{content:"";position:absolute;left:50%;top:50%;border:1px solid rgba(67,202,255,.55);border-radius:50%;transform:translate(-50%,-50%);animation:siferOrbit 4s linear infinite}
  #sifer-ai-orb:before{width:76px;height:28px}.sifer-core{position:absolute!important;left:50%;top:50%;width:9px;height:9px;border-radius:50%;transform:translate(-50%,-50%);background:#efffff;box-shadow:0 0 8px #fff,0 0 22px #39cfff,0 0 42px #168cff}
  #sifer-ai-orb .sifer-p{position:absolute;width:3px;height:3px;border-radius:50%;background:#b8f4ff;box-shadow:0 0 8px #35d5ff;pointer-events:none}
  #sifer-ai-panel{pointer-events:auto;position:fixed;right:16px;bottom:118px;width:min(410px,calc(100vw - 24px));height:min(600px,calc(100vh - 130px));z-index:2147483646;background:#061522;border:1px solid #249bd0;border-radius:14px;box-shadow:0 12px 50px rgba(0,0,0,.6),0 0 30px rgba(0,160,255,.25);display:none;flex-direction:column;overflow:hidden;color:#e8f8ff}
  #sifer-ai-panel.show{display:flex}
  .sifer-ai-head{height:58px;display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #19445b}.sifer-ai-mini{width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,#36caff 25%,#07558c 55%,#02111e 75%);box-shadow:0 0 16px #26bfff}.sifer-ai-title{font-size:15px;font-weight:800}.sifer-ai-sub{font-size:9px;color:#77cbed}.sifer-ai-close{margin-left:auto;background:none;border:0;color:#b8eaff;font-size:24px;cursor:pointer}
  .sifer-ai-chat{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:8px}.sifer-msg{max-width:88%;padding:9px 11px;border-radius:10px;font-size:12px;line-height:1.4;white-space:pre-wrap}.sifer-msg.ai{align-self:flex-start;background:#0c3d5e}.sifer-msg.user{align-self:flex-end;background:#086fbf}
  .sifer-ai-voice{padding:7px;text-align:center;font-size:10px;color:#72d8ff;border-top:1px solid #19445b}.sifer-ai-status{min-height:16px;padding:0 10px 5px;font-size:9px;color:#6fc9ef}.sifer-ai-form{display:flex;gap:6px;padding:8px;border-top:1px solid #19445b}.sifer-ai-input{flex:1;height:42px;resize:none;background:#031526;border:1px solid #2b6985;border-radius:7px;color:#fff;padding:9px;font-size:12px}.sifer-ai-send{width:46px;border:1px solid #168ac5;border-radius:7px;background:#087fc0;color:#fff;font-weight:800}
  @keyframes siferOrbit{to{transform:translate(-50%,-50%) rotate(360deg) scaleX(.7)}}
  @media(max-width:700px){#sifer-ai-root{right:3px;bottom:8px}#sifer-ai-panel{right:7px;bottom:96px;width:calc(100vw - 14px);height:min(560px,calc(100vh - 110px))}}
  `;
  const oldStyle=document.getElementById('sifer-ai-style'); if(oldStyle)oldStyle.remove();
  const style=document.createElement('style'); style.id='sifer-ai-style'; style.textContent=css; document.head.appendChild(style);

  const root=document.createElement('div'); root.id='sifer-ai-root';
  root.innerHTML=`
    <button id="sifer-ai-orb" type="button" aria-label="Abrir SIFER" title="Abrir SIFER"><i class="sifer-core"></i><i class="sifer-p p1"></i><i class="sifer-p p2"></i><i class="sifer-p p3"></i></button>
    <section id="sifer-ai-panel" aria-hidden="true">
      <div class="sifer-ai-head"><div class="sifer-ai-mini"></div><div><div class="sifer-ai-title">SIFER</div><div class="sifer-ai-sub">ASISTENTE INTELIGENTE · POS AUTOMOTRIZ</div></div><button class="sifer-ai-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="sifer-ai-chat" id="sifer-ai-chat"></div>
      <div class="sifer-ai-voice" id="sifer-ai-voice"><span id="sifer-ai-voice-text">Micrófono inactivo</span></div>
      <div class="sifer-ai-status" id="sifer-ai-status"></div>
      <form class="sifer-ai-form" id="sifer-ai-form"><textarea class="sifer-ai-input" id="sifer-ai-input" placeholder="Dile a SIFER qué necesitas…" rows="1"></textarea><button class="sifer-ai-send" id="sifer-ai-send" type="submit">➤</button></form>
    </section>`;
  document.body.appendChild(root);
  // Blindaje solo visual de la esfera. No tocar el DOM/atributos del panel.
  function keepOrbAlive(){
    if(!document.body.contains(root)) document.body.appendChild(root);
    root.style.setProperty('position','fixed','important');
    root.style.setProperty('z-index','2147483647','important');
    orb.style.setProperty('display','block','important');
    orb.style.setProperty('visibility','visible','important');
    orb.style.setProperty('opacity','1','important');
    orb.style.setProperty('pointer-events','auto','important');
    orb.style.setProperty('z-index','2147483647','important');
  }
  root.setAttribute('data-sifer-mounted','true');
  window.dispatchEvent(new CustomEvent('sifer:mounted'));

  const orb=root.querySelector('#sifer-ai-orb');
  // La esfera debe ser visible por sí misma, sin depender de estilos externos del POS.
  Object.assign(orb.style,{
    display:'block',
    visibility:'visible',
    opacity:'1',
    position:'absolute',
    inset:'0',
    width:'92px',
    height:'92px',
    border:'1px solid rgba(74,218,255,.72)',
    borderRadius:'50%',
    background:'radial-gradient(circle at 50% 50%, #ffffff 0 4%, #55ddff 8%, #0878bd 28%, #03182a 57%, rgba(3,24,42,.05) 62%, transparent 70%)',
    boxShadow:'0 0 10px #fff, 0 0 24px #27cfff, 0 0 52px #0878bd',
    pointerEvents:'auto',
    zIndex:'2147483647'
  });
  keepOrbAlive();
  const siferOrbObserver=new MutationObserver(()=>keepOrbAlive());
  siferOrbObserver.observe(document.body,{childList:true,subtree:true});
  orb.style.display='block';
  const panel=root.querySelector('#sifer-ai-panel');
  const chat=root.querySelector('#sifer-ai-chat');
  const form=root.querySelector('#sifer-ai-form');
  const input=root.querySelector('#sifer-ai-input');
  const send=root.querySelector('#sifer-ai-send');
  const status=root.querySelector('#sifer-ai-status');
  function render(){
    chat.innerHTML=messages.map(m=>`<div class="sifer-msg ${m.role==='user'?'user':'ai'}">${escapeHtml(m.text)}</div>`).join('');
    chat.scrollTop=chat.scrollHeight;
  }
  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function add(role,text){messages.push({role,text});render();}
  const voiceUi=root.querySelector('#sifer-ai-voice'), voiceText=root.querySelector('#sifer-ai-voice-text');
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const voice={recognition:null,stream:null,recorder:null,chunks:[],listening:false,processing:false,timer:null,restartTimer:null,buffer:'',audioContext:null,analyser:null,startedAt:0,session:0};
  function setVoice(mode,text){voiceUi.className='sifer-ai-voice '+(mode||'');voiceText.textContent=text||'Micrófono inactivo';}
  function speak(text){const value=String(text||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();if(!value||!('speechSynthesis'in window)){restartVoice(120);return;}try{voice.recognition?.stop()}catch{}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang='es-VE';u.rate=1.02;u.pitch=1;u.volume=1;u.onend=()=>restartVoice(120);u.onerror=()=>restartVoice(120);window.speechSynthesis.speak(u);}
  async function ensureMic(){if(voice.stream)return true;if(!navigator.mediaDevices?.getUserMedia){setVoice('off','Micrófono no disponible');return false;}try{voice.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});return true;}catch{setVoice('off','Activa el permiso del micrófono');return false;}}
  function restartVoice(delay=180){if(!open||voice.processing)return;clearTimeout(voice.restartTimer);voice.restartTimer=setTimeout(startVoice,delay);}
  async function startVoice(){if(!open||voice.processing||voice.listening)return;const ok=await ensureMic();if(!ok||!open||voice.processing||voice.listening)return;if(SpeechRecognition)startSpeech();else startRecorder();}
  function startSpeech(){try{const session=++voice.session,rec=new SpeechRecognition();rec.lang='es-VE';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=3;rec.onstart=()=>{if(session!==voice.session)return;voice.listening=true;voice.recognition=rec;setVoice('listening','Escuchando…')};rec.onend=()=>{if(session!==voice.session)return;voice.listening=false;voice.recognition=null;if(open&&!voice.processing)restartVoice(150)};rec.onerror=e=>{voice.listening=false;voice.recognition=null;if(e.error==='not-allowed'||e.error==='service-not-allowed'){setVoice('off','Permiso de micrófono requerido');return}if(open&&!voice.processing)restartVoice(400)};rec.onresult=e=>{if(session!==voice.session||voice.processing)return;let t='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)t+=(e.results[i][0]?.transcript||'')+' ';if(!t.trim())return;voice.buffer=(voice.buffer+' '+t).trim();clearTimeout(voice.timer);voice.timer=setTimeout(commitVoice,800)};voice.recognition=rec;rec.start()}catch{voice.listening=false;startRecorder()}}
  function commitVoice(){const text=voice.buffer.trim();voice.buffer='';clearTimeout(voice.timer);if(!text){restartVoice(100);return}try{voice.recognition?.stop()}catch{}voice.listening=false;voice.processing=true;setVoice('processing','Procesando…');ask(text).then(()=>{const last=messages[messages.length-1]?.text;if(last)speak(last);else restartVoice(120)}).finally(()=>{voice.processing=false})}
  function startRecorder(){if(!voice.stream||voice.processing||voice.listening)return;const mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'audio/mp4');try{const rec=new MediaRecorder(voice.stream,{mimeType:mime});voice.recorder=rec;voice.chunks=[];voice.listening=true;voice.startedAt=Date.now();setVoice('listening','Escuchando…');const AC=window.AudioContext||window.webkitAudioContext;if(AC){voice.audioContext=new AC();const src=voice.audioContext.createMediaStreamSource(voice.stream);voice.analyser=voice.audioContext.createAnalyser();voice.analyser.fftSize=1024;src.connect(voice.analyser);monitorSilence()}rec.ondataavailable=e=>{if(e.data?.size)voice.chunks.push(e.data)};rec.onstop=async()=>{voice.listening=false;voice.recorder=null;clearTimeout(voice.timer);try{voice.audioContext?.close()}catch{}voice.audioContext=null;voice.analyser=null;const blob=new Blob(voice.chunks,{type:rec.mimeType||mime});voice.chunks=[];if(blob.size>1200)await transcribeVoice(blob);else restartVoice(120)};rec.onerror=()=>{voice.listening=false;voice.recorder=null;restartVoice(500)};rec.start(200);setTimeout(()=>{if(voice.recorder===rec&&rec.state==='recording')rec.stop()},10000)}catch{voice.listening=false;voice.recorder=null;restartVoice(500)}}
  function monitorSilence(){const a=voice.analyser;if(!a||!voice.recorder)return;const data=new Uint8Array(a.fftSize);a.getByteTimeDomainData(data);let sum=0;for(const n of data){const v=(n-128)/128;sum+=v*v}const rms=Math.sqrt(sum/data.length),elapsed=Date.now()-voice.startedAt;if(elapsed>700&&rms<0.018){clearTimeout(voice.timer);voice.timer=setTimeout(()=>{if(voice.recorder?.state==='recording')voice.recorder.stop()},750)}else clearTimeout(voice.timer);if(voice.recorder?.state==='recording')requestAnimationFrame(monitorSilence)}
  async function transcribeVoice(blob){voice.processing=true;setVoice('processing','Transcribiendo…');try{const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));const audioBase64=btoa(binary);const r=await fetch('/api/sifer-assistant?mode=transcribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'transcribe',audioBase64,mimeType:blob.type||'audio/webm'})});const data=await r.json();if(!r.ok)throw new Error(data?.error||'No pude transcribir la frase');const text=String(data?.text||'').trim();if(!text)throw new Error('No pude entenderte.');await ask(text);const last=messages[messages.length-1]?.text;if(last)speak(last);else restartVoice(120)}catch(e){speak(e?.message||'No pude entenderte.')}finally{voice.processing=false}}
  function stopVoice(){voice.session++;clearTimeout(voice.timer);clearTimeout(voice.restartTimer);try{voice.recognition?.stop()}catch{}try{voice.recorder?.stop()}catch{}voice.recognition=null;voice.recorder=null;voice.listening=false;voice.processing=false;if(voice.stream){voice.stream.getTracks().forEach(t=>t.stop());voice.stream=null}try{voice.audioContext?.close()}catch{}voice.audioContext=null;voice.analyser=null;setVoice('off','Micrófono inactivo')}
  function toggle(force){
    const next=force===undefined?!open:Boolean(force);
    const emergency=document.getElementById('sifer-emergency-shell');
    if(next && emergency) emergency.removeAttribute('open');
    open=next;
    panel.classList.toggle('show',open);
    panel.setAttribute('aria-hidden',open?'false':'true');
    if(open){
      if(!messages.length)add('assistant','Hola. Soy SIFER. Estoy conectado al POS y puedo navegar por sus módulos y ejecutar acciones operativas autorizadas. Las operaciones sensibles siempre requieren tu confirmación.');
      render(); startVoice(); setTimeout(()=>input.focus(),50);
    }else{
      stopVoice();
    }
  }
  window.SIFER_OPEN=()=>toggle(true);
  window.SIFER_CLOSE=()=>toggle(false);
  document.addEventListener('sifer:open',()=>toggle(true));
  document.addEventListener('sifer:close',()=>toggle(false));
  const forceOpen=()=>{open=true;panel.classList.add('show');panel.style.setProperty('display','flex','important');panel.style.setProperty('visibility','visible','important');panel.style.setProperty('opacity','1','important');panel.setAttribute('aria-hidden','false');render();setTimeout(()=>input.focus(),30);startVoice();};
  document.addEventListener('click',e=>{const target=e.target?.closest?.('#sifer-ai-orb,#sifer-emergency-orb');if(!target)return;e.preventDefault();e.stopPropagation();forceOpen();},true);
  orb.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();forceOpen();});
  root.querySelector('.sifer-ai-close').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(false);});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});

  function buildReadOnlyData(){
    try{
      const raw=localStorage.getItem('sifer360_v1'); const db=raw?JSON.parse(raw):{};
      const safeArray=(v,max=200)=>Array.isArray(v)?v.slice(0,max):[];
      const pick=(obj,keys)=>{const out={}; if(!obj||typeof obj!=='object')return out; keys.forEach(k=>{if(obj[k]!==undefined)out[k]=obj[k]}); return out;};
      const now = new Date();
      const todayKey = now.toLocaleDateString('es-ES');
      const isToday = (value) => {
        if(!value) return false;
        const text=String(value);
        const direct=text.split(',')[0].trim();
        if(direct===todayKey) return true;
        const parsed=new Date(value);
        return !Number.isNaN(parsed.getTime()) && parsed.toLocaleDateString('es-ES')===todayKey;
      };
      const ventasHoy=safeArray(db.ventas).filter(v=>isToday(v.fecha));
      const ventasHoyValidas=ventasHoy.filter(v=>String(v.estado||'').toLowerCase()!=='anulada');
      const totalVentasHoy=ventasHoyValidas.reduce((s,v)=>s+Number(v.total||0),0);
      const contadoHoy=ventasHoyValidas.filter(v=>String(v.tipo||'').toLowerCase()==='contado').reduce((s,v)=>s+Number(v.total||0),0);
      const creditoHoy=ventasHoyValidas.filter(v=>String(v.tipo||'').toLowerCase()==='credito').reduce((s,v)=>s+Number(v.total||0),0);

      return {
        fechaActual:todayKey,
        resumenHoy:{
          ventasRegistradas:ventasHoyValidas.length,
          totalVentas:totalVentasHoy,
          ventasContado:contadoHoy,
          ventasCredito:creditoHoy
        },
        config:pick(db.config,['empresa','moneda','impuesto','bcv']),
        productos:safeArray(db.productos).map(x=>pick(x,['id','codigo','nombre','categoria','marca','unidad','costo','precio','stock','min'])),
        clientes:safeArray(db.clientes).map(x=>pick(x,['id','nombre','cedula','telefono','email','tipo','saldo','limiteCredito'])),
        proveedores:safeArray(db.proveedores).map(x=>pick(x,['id','nombre','rif','telefono','email'])),
        ventas:safeArray(db.ventas).map(x=>pick(x,['numero','fecha','cliente','clienteId','total','subtotal','impuesto','tipo','estado','cajaId','usuarioId','items'])),
        compras:safeArray(db.compras).map(x=>pick(x,['numero','fecha','proveedor','proveedorId','total','subtotal','impuesto','estado','items'])),
        pedidos:safeArray(db.pedidos).map(x=>pick(x,['id','numero','fecha','cliente','total','estado','items'])),
        cajas:safeArray(db.cajas).map(x=>pick(x,['id','nombre','abierta','saldo','apertura','ultimoCorteAt'])),
        cxc:safeArray(db.cxc).map(x=>pick(x,['id','cliente','clienteId','documento','saldo','monto','fecha','estado'])),
        cxp:safeArray(db.cxp).map(x=>pick(x,['id','proveedor','proveedorId','documento','saldo','monto','fecha','estado'])),
        pos:{cart:safeArray(db.posCart).map(x=>pick(x,['productId','codigo','nombre','qty','precio','discount','total']))}
      };
    }catch{return {error:'No se pudo leer el estado local de consulta.'};}
  }

  function extractWakeWord(text){
    const value=String(text||'').trim();
    const match=value.match(/\bsifer\b/i);
    if(!match)return null;
    return value.slice(match.index+match[0].length).replace(/^\s*[,;:.-]?\s*/,'').trim();
  }

  function formatSalesAmount(value,currency){
    const code=String(currency||'USD').toUpperCase();
    try{return new Intl.NumberFormat('es-VE',{style:'currency',currency:code}).format(Number(value)||0);}
    catch{return (Number(value)||0).toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+code;}
  }

  function isInventoryQuery(text){
    const q=normalizeLocal(text);
    return /(cuantos|cuantas|cuanto).*(producto|productos|articulo|articulos|repuesto|repuestos).*(inventario|stock|existencia|existencias)/.test(q)
      || /(inventario|stock|existencias).*(cuantos|cuantas|productos|articulos|repuestos)/.test(q)
      || /cuantos productos tenemos/.test(q);
  }

  function answerInventoryQuery(){
    try{
      const raw=localStorage.getItem('sifer360_v1');
      const db=raw?JSON.parse(raw):{};
      const productos=Array.isArray(db.productos)?db.productos:[];
      const repuestos=typeof getRepuestos==='function'?(getRepuestos()||[]):[];
      const all=[...productos,...repuestos];
      const seen=new Set();
      const unique=all.filter(p=>{
        const key=String(p.id||p.codigo||p.sku||p.nombre||Math.random());
        if(seen.has(key)) return false;
        seen.add(key); return true;
      });
      const conExistencia=unique.filter(p=>Number(p.stock||0)>0);
      const unidades=conExistencia.reduce((s,p)=>s+Number(p.stock||0),0);
      const sinExistencia=unique.length-conExistencia.length;
      return 'En el inventario hay '+unique.length+' artículos registrados. '+conExistencia.length+' tienen existencia disponible, con '+unidades+' unidades en total. '+sinExistencia+' están sin existencia.';
    }catch{
      return 'No pude consultar el inventario real del POS en este momento.';
    }
  }

  function isTodaySalesQuery(text){
    const value=String(text||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
    return /(cuanto.*vend|vendimos|ventas.*hoy|venta.*hoy|vendido.*hoy|total.*ventas.*hoy|total.*vendido)/i.test(value);
  }

  function answerTodaySales(){
    try{
      const raw=localStorage.getItem('sifer360_v1'); const db=raw?JSON.parse(raw):{};
      const list=Array.isArray(db.ventas)?db.ventas:[];
      const todayKey=new Date().toLocaleDateString('es-ES');
      const isToday=(value)=>{
        if(!value)return false;
        const text=String(value), direct=text.split(',')[0].trim();
        if(direct===todayKey)return true;
        const parsed=new Date(value);
        return !Number.isNaN(parsed.getTime()) && parsed.toLocaleDateString('es-ES')===todayKey;
      };
      const sales=list.filter(v=>isToday(v.fecha)&&String(v.estado||'').toLowerCase()!=='anulada');
      const total=sales.reduce((sum,v)=>sum+Number(v.total||0),0);
      const cajas=Array.isArray(db.cajas)?db.cajas:[];
      const current=cajas.find(x=>x.id===db.terminalId)||cajas[0]||null;
      const currency=db.config?.moneda||'USD';
      if(!sales.length){
        return current && !current.abierta
          ? 'La caja está cerrada y no se han registrado ventas hoy.'
          : 'Hoy no se han registrado ventas hasta el momento.';
      }
      const base='Hoy se han registrado '+sales.length+' '+(sales.length===1?'venta':'ventas')+' por un total de '+formatSalesAmount(total,currency)+'.';
      return current && !current.abierta ? base+' La caja actual está cerrada.' : base+' La caja está abierta.';
    }catch{
      return 'No pude consultar las ventas de hoy en el estado local del POS.';
    }
  }

  function buildSystemMap(){
    try{
      const txt=el=>String(el?.innerText||el?.value||el?.getAttribute?.('aria-label')||el?.title||'').replace(/\\s+/g,' ').trim();
      return {
        generatedAt:new Date().toISOString(),
        pageTitle:document.title,
        currentModule:txt(document.getElementById('windowTitle'))||'Inicio',
        buttons:[...document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]')].map((el,i)=>({n:i+1,text:txt(el),id:el.id||'',onclick:el.getAttribute('onclick')||''})).filter(x=>x.text||x.id||x.onclick).slice(0,700),
        fields:[...document.querySelectorAll('input,select,textarea')].map((el,i)=>({n:i+1,tag:el.tagName.toLowerCase(),id:el.id||'',name:el.name||'',type:el.type||'',placeholder:el.placeholder||'',label:el.getAttribute('aria-label')||'',value:el.value||'',options:el.tagName.toLowerCase()==='select'?[...el.options].slice(0,80).map(o=>({value:o.value,text:txt(o)})) : []})).filter(x=>x.id||x.name||x.placeholder||x.label).slice(0,700),
        dialogs:[...document.querySelectorAll('.modal,[role="dialog"]')].map((el,i)=>({n:i+1,id:el.id||'',text:txt(el).slice(0,500)})).filter(x=>x.id||x.text).slice(0,120),
        scripts:[...document.scripts].map(s=>s.src||'inline').slice(0,100),
        principles:['SIFER360 es un POS automotriz, no un ERP.','Las operaciones sensibles deben pedir confirmación antes de modificar datos.','Turso es la fuente remota operativa; el POS debe conservar operación offline.']
      };
    }catch{return {error:'No se pudo construir el mapa operativo actual.'};}
  }

  const SIFER_CAPABILITIES = {
    navigate:{description:'Cambiar al módulo solicitado',mutating:false},
    add_to_cart:{description:'Agregar un producto o repuesto existente al carrito actual',mutating:false},
    remove_cart_line:{description:'Eliminar una línea del carrito actual',mutating:true,confirm:true},
    cancel_sale:{description:'Cancelar la venta actual sin registrarla',mutating:true,confirm:true},
    open_cash:{description:'Abrir la caja actual',mutating:true,confirm:true},
    open_checkout:{description:'Abrir la ventana de cobro de la venta actual',mutating:false},
    open_purchase:{description:'Abrir el formulario de nueva compra',mutating:false},
    open_quote:{description:'Abrir el formulario de nuevo presupuesto',mutating:false},
    open_bcv:{description:'Mostrar la tasa BCV y sus acciones disponibles',mutating:false},
    open_account_payment:{description:'Abrir el formulario para cobrar CxC o pagar CxP',mutating:false},
    select_customer:{description:'Seleccionar un cliente existente para la venta actual',mutating:true,confirm:false},
    edit_cart_line:{description:'Modificar cantidad, precio o descuento de una línea del carrito',mutating:true,confirm:true},
    set_discount:{description:'Aplicar un descuento a una línea del carrito',mutating:true,confirm:true},
    mark_return:{description:'Marcar una línea del carrito como devolución',mutating:true,confirm:true},
    open_item_search:{description:'Abrir la búsqueda de artículos del POS',mutating:false},
    open_customer:{description:'Abrir el formulario de cliente',mutating:false},
    open_supplier:{description:'Abrir el formulario de proveedor',mutating:false},
    new_order:{description:'Abrir el formulario de nuevo pedido',mutating:false},
    show_x:{description:'Mostrar Corte X de la caja',mutating:false},
    show_z:{description:'Mostrar el diálogo de Corte Z',mutating:false},
    execute_z:{description:'Ejecutar y cerrar el Corte Z',mutating:true,confirm:true},
    refresh:{description:'Actualizar el módulo actual',mutating:false},
    print:{description:'Imprimir la vista actual',mutating:false},
    ui_click:{description:'Pulsar un botón o control visible del módulo actual identificado por su texto, título o id',mutating:false},
    ui_fill:{description:'Escribir un valor en un campo visible identificado por id, nombre, etiqueta o placeholder',mutating:false},
    ui_select:{description:'Seleccionar una opción en un selector visible del módulo actual',mutating:false}
  };
  function buildCapabilities(){ return Object.entries(SIFER_CAPABILITIES).map(([name,x])=>({name,...x})); }
  function currentActionState(){
    try{
      const raw=localStorage.getItem('sifer360_v1'),d=raw?JSON.parse(raw):{};
      const box=(d.cajas||[]).find(x=>x.id===d.terminalId);
      return {cajaId:d.terminalId||null,cajaAbierta:Boolean(box?.abierta),cart:typeof cart!=='undefined'&&Array.isArray(cart)?cart.map((x,i)=>({index:i,id:x.id,nombre:x.nombre,qty:x.qty,price:x.price})):[],currentModule:document.getElementById('windowTitle')?.textContent||'Inicio'};
    }catch{return {};}
  }
  function siferUiText(el){ return normalizeLocal(el?.innerText||el?.value||el?.getAttribute?.('aria-label')||el?.title||el?.id||''); }
  function siferVisible(el){ if(!el) return false; const r=el.getBoundingClientRect?.(); const st=getComputedStyle(el); return !!r && r.width>0 && r.height>0 && st.visibility!=='hidden' && st.display!=='none'; }
  function siferFindButton(target){
    const q=normalizeLocal(target); if(!q) return null;
    const els=[...document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]')].filter(siferVisible);
    return els.find(el=>siferUiText(el)===q)||els.find(el=>siferUiText(el).includes(q))||null;
  }
  function siferFieldLabel(el){
    if(!el) return '';
    const aria=el.getAttribute('aria-label')||'', ph=el.getAttribute('placeholder')||'';
    let label=aria||ph;
    if(!label && el.id){ const l=document.querySelector('label[for="'+CSS.escape(el.id)+'"]'); if(l) label=l.innerText; }
    if(!label) label=el.closest('.field')?.querySelector('label')?.innerText||'';
    return normalizeLocal(label);
  }
  function siferFindField(target){
    const q=normalizeLocal(target); if(!q) return null;
    const els=[...document.querySelectorAll('input,select,textarea')].filter(siferVisible);
    return els.find(el=>normalizeLocal(el.id)===q||normalizeLocal(el.name)===q)||els.find(el=>siferFieldLabel(el)===q)||els.find(el=>siferFieldLabel(el).includes(q))||els.find(el=>normalizeLocal(el.placeholder).includes(q))||null;
  }
  function siferSensitiveClick(el){
    const t=siferUiText(el);
    return /(guardar|crear|registrar|finalizar|cobrar|pagar|eliminar|borrar|anular|cancelar|devolver|ejecutar|cerrar|actualizar|confirmar|aplicar|convertir|reset|restablecer)/.test(t);
  }
  async function executeSiferAction(action){
    const name=String(action?.name||'').trim(),args=action?.args&&typeof action.args==='object'?action.args:{},cap=SIFER_CAPABILITIES[name];
    if(!cap) throw new Error('Acción no permitida por SIFER: '+name);
    if(cap.confirm && !window.confirm('SIFER solicita confirmación\\n\\n'+String(action.confirmationText||cap.description)+'\\n\\n¿Deseas ejecutar esta operación?')) return {cancelled:true};
    switch(name){
      case 'navigate': {
        const allowed=['inicio','pos','pedidos','usuarios','master_catalog','repuestos','productos','compras','clientes','proveedores','cxc','cxp','presupuestos','reportes','caja','config'];
        const target=String(args.view||'inicio'); if(!allowed.includes(target)) throw new Error('Módulo no permitido: '+target);
        const navigate=typeof window.go==='function'?window.go:(typeof go==='function'?go:null); if(!navigate) throw new Error('Navegación no disponible'); navigate(target); return {ok:true,message:'Módulo abierto: '+target};
      }
      case 'add_to_cart': if(typeof addToCart!=='function') throw new Error('Carrito no disponible'); addToCart(String(args.id||''),args.type==='repuesto'?'repuesto':'producto'); return {ok:true,message:'Artículo agregado al carrito'};
      case 'remove_cart_line': if(typeof selected!=='undefined') selected=Number(args.index); if(typeof removeCart!=='function') throw new Error('Carrito no disponible'); removeCart(); return {ok:true,message:'Línea eliminada del carrito'};
      case 'cancel_sale': if(typeof cancelSale!=='function') throw new Error('Cancelación no disponible'); cancelSale(); return {ok:true,message:'Venta cancelada'};
      case 'open_cash': if(typeof toggleCaja!=='function') throw new Error('Caja no disponible'); if(!currentActionState().cajaAbierta) toggleCaja(); return {ok:true,message:'Caja abierta'};
      case 'open_checkout': if(typeof checkout!=='function') throw new Error('Cobro no disponible'); checkout(); return {ok:true,message:'Cobro abierto'};
      case 'open_purchase': if(typeof openPurchase!=='function') throw new Error('Compras no disponible'); openPurchase(); return {ok:true,message:'Formulario de compra abierto'};
      case 'open_quote': if(typeof openQuote!=='function') throw new Error('Presupuestos no disponible'); openQuote(); return {ok:true,message:'Formulario de presupuesto abierto'};
      case 'open_bcv': if(typeof openBCV!=='function') throw new Error('Tasa BCV no disponible'); openBCV(); return {ok:true,message:'Tasa BCV mostrada'};
      case 'open_account_payment': {
        const type=args.type==='cxp'?'cxp':'cxc', raw=localStorage.getItem('sifer360_v1'), liveDb=raw?JSON.parse(raw):{}, list=type==='cxc'?(Array.isArray(liveDb.cxc)?liveDb.cxc:[]):(Array.isArray(liveDb.cxp)?liveDb.cxp:[]);
        const query=normalizeLocal(args.query||'');
        const item=list.find(x=>normalizeLocal([x.id,x.documento,x.cliente,x.proveedor].filter(Boolean).join(' ')).includes(query));
        if(!item) throw new Error('No encontré el documento de cuenta indicado');
        if(typeof payAccount!=='function') throw new Error('Pago de cuenta no disponible');
        payAccount(type,item.id); return {ok:true,message:type==='cxc'?'Cobro CxC preparado':'Pago CxP preparado'};
      }
      case 'select_customer': {
        const query=normalizeLocal(args.query||'');
        const raw=localStorage.getItem('sifer360_v1'), liveDb=raw?JSON.parse(raw):{}, list=Array.isArray(liveDb.clientes)?liveDb.clientes:[];
        const c=list.find(x=>normalizeLocal([x.id,x.nombre,x.documento,x.telefono].filter(Boolean).join(' ')).includes(query));
        if(!c) throw new Error('No encontré ese cliente');
        saleCustomer=c.id; if(typeof renderView==='function') renderView(); return {ok:true,message:'Cliente seleccionado: '+c.nombre};
      }
      case 'edit_cart_line': {
        const idx=Number(args.index); if(!Number.isInteger(idx)||!Array.isArray(cart)||!cart[idx]) throw new Error('Línea de carrito no encontrada');
        const l=cart[idx],qty=args.qty===undefined?l.qty:Number(args.qty),price=args.price===undefined?l.price:Number(args.price),disc=args.discount===undefined?l.disc:Number(args.discount);
        if(qty<=0||price<0||disc<0) throw new Error('Cantidad, precio o descuento inválido');
        const rawDb=localStorage.getItem('sifer360_v1'), liveDb=rawDb?JSON.parse(rawDb):{}, p=(Array.isArray(liveDb.productos)?liveDb.productos:[]).find(x=>x.id===l.id)||((typeof getRepuestos==='function')?getRepuestos().find(x=>x.id===l.id):null);
        if(!p) throw new Error('Artículo no encontrado');
        if(qty>Number(p.stock||0)&&l.qty>0) throw new Error('La cantidad supera la existencia disponible');
        if(disc>qty*price) throw new Error('El descuento no puede superar el importe de la línea');
        l.qty=qty;l.price=price;l.disc=disc;selected=null;renderView();return {ok:true,message:'Línea actualizada'};
      }
      case 'set_discount': {
        const idx=args.index===undefined?(Array.isArray(cart)?cart.length-1:-1):Number(args.index), l=cart?.[idx];
        if(!l) throw new Error('No hay una línea de carrito seleccionada');
        const disc=Math.max(0,Number(args.discount)); if(!Number.isFinite(disc)||disc>Number(l.qty||0)*Number(l.price||0)) throw new Error('Descuento inválido');
        l.disc=disc;selected=null;renderView();return {ok:true,message:'Descuento aplicado: '+disc};
      }
      case 'mark_return': {
        const idx=args.index===undefined?(Array.isArray(cart)?cart.length-1:-1):Number(args.index); if(!cart?.[idx]) throw new Error('No hay una línea de carrito seleccionada');
        selected=idx; if(typeof returnCart!=='function') throw new Error('Devolución no disponible'); returnCart(); return {ok:true,message:'Artículo marcado para devolución. Debe indicar la venta original al cobrar.'};
      }
      case 'open_item_search': if(typeof openItemSearch!=='function') throw new Error('Búsqueda de artículos no disponible'); openItemSearch(); return {ok:true,message:'Búsqueda de artículos abierta'};
      case 'open_customer': if(typeof openClient!=='function') throw new Error('Clientes no disponible'); openClient(args.id||undefined); return {ok:true,message:'Clientes abierto'};
      case 'open_supplier': if(typeof openSupplier!=='function') throw new Error('Proveedores no disponible'); openSupplier(args.id||undefined); return {ok:true,message:'Proveedores abierto'};
      case 'new_order': if(typeof nuevoPedido!=='function') throw new Error('Pedidos no disponible'); nuevoPedido(); return {ok:true,message:'Nuevo pedido abierto'};
      case 'show_x': if(typeof showCorteX!=='function') throw new Error('Corte X no disponible'); showCorteX(); return {ok:true,message:'Corte X mostrado'};
      case 'show_z': if(typeof showCorteZ!=='function') throw new Error('Corte Z no disponible'); showCorteZ(); return {ok:true,message:'Corte Z preparado'};
      case 'execute_z': if(typeof executeCorteZ!=='function') throw new Error('Corte Z no disponible'); await executeCorteZ(); return {ok:true,message:'Corte Z ejecutado'};
      case 'refresh': if(typeof refreshModuleData!=='function') throw new Error('Actualización no disponible'); refreshModuleData(); return {ok:true,message:'Módulo actualizado'};
      case 'print': if(typeof printView!=='function') throw new Error('Impresión no disponible'); printView(); return {ok:true,message:'Impresión solicitada'};
      case 'ui_click': {
        const el=siferFindButton(args.target||args.text||args.id); if(!el) throw new Error('No encontré el botón o control visible: '+String(args.target||args.text||args.id||''));
        if(siferSensitiveClick(el) && !window.confirm('SIFER solicita confirmación\\n\\n'+String(action.confirmationText||el.innerText||el.value||'Ejecutar esta operación')+'\\n\\n¿Deseas continuar?')) return {cancelled:true};
        el.click(); return {ok:true,message:'Control ejecutado: '+(el.innerText||el.value||el.title||el.id)};
      }
      case 'ui_fill': {
        const el=siferFindField(args.field||args.target||args.id); if(!el) throw new Error('No encontré el campo visible: '+String(args.field||args.target||args.id||''));
        if(el.tagName.toLowerCase()==='select') throw new Error('Para un selector utiliza ui_select');
        const value=String(args.value??''); const proto=el.tagName.toLowerCase()==='textarea'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
        const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set; if(setter) setter.call(el,value); else el.value=value;
        el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return {ok:true,message:'Campo actualizado: '+(args.field||args.target||args.id)};
      }
      case 'ui_select': {
        const el=siferFindField(args.field||args.target||args.id); if(!el||el.tagName.toLowerCase()!=='select') throw new Error('No encontré el selector visible: '+String(args.field||args.target||args.id||''));
        const wanted=normalizeLocal(args.value??args.option??''); const opt=[...el.options].find(o=>normalizeLocal(o.value)===wanted||normalizeLocal(o.textContent)===wanted||normalizeLocal(o.textContent).includes(wanted));
        if(!opt) throw new Error('No encontré la opción solicitada en el selector'); el.value=opt.value; el.dispatchEvent(new Event('change',{bubbles:true})); return {ok:true,message:'Opción seleccionada: '+opt.textContent.trim()};
      }
      default: throw new Error('Acción no implementada');
    }
  }

  function findProductForCommand(command){
    try{
      const raw=localStorage.getItem('sifer360_v1'),d=raw?JSON.parse(raw):{};
      const items=[...(Array.isArray(d.productos)?d.productos:[]),...(typeof getRepuestos==='function'?(getRepuestos()||[]):[])];
      const q=normalizeLocal(command),tokens=q.split(/\\s+/).filter(x=>x.length>2);
      if(!tokens.length)return null;
      const scored=items.map(p=>{
        const hay=normalizeLocal([p.nombre,p.codigo,p.sku,p.marca,p.categoria,p.codigoOEM].filter(Boolean).join(' '));
        const score=tokens.reduce((s,t)=>s+(hay.includes(t)?1:0),0);
        return {p,score};
      }).filter(x=>x.score===tokens.length).sort((a,b)=>a.p.nombre.length-b.p.nombre.length);
      return scored[0]?.p||null;
    }catch{return null;}
  }
  function normalizeLocal(s){
    return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9.%-]+/g,' ').trim();
  }

  const SIFER_INTENTS = [
    {patterns:['punto de venta','pos','ventas','venta'], view:'pos', action:'navigate'},
    {patterns:['inventario','productos','producto','repuestos','repuesto','aceites','lubricantes','catalogo','existencias','stock'], view:'productos', action:'navigate'},
    {patterns:['compras','compra'], view:'compras', action:'navigate'},
    {patterns:['clientes','cliente'], view:'clientes', action:'navigate'},
    {patterns:['proveedores','proveedor'], view:'proveedores', action:'navigate'},
    {patterns:['cuentas por cobrar','cuentas cobrar','cxc','cobros'], view:'cxc', action:'navigate'},
    {patterns:['cuentas por pagar','cuentas pagar','cxp','pagos a proveedores'], view:'cxp', action:'navigate'},
    {patterns:['caja','cajas','cortes'], view:'caja', action:'navigate'},
    {patterns:['pedidos','pedido','ordenes','ordenes de venta'], view:'pedidos', action:'navigate'},
    {patterns:['presupuesto','presupuestos','cotizacion','cotizaciones'], view:'presupuestos', action:'navigate'},
    {patterns:['configuracion','configuracion general','ajustes'], view:'config', action:'navigate'},
    {patterns:['usuarios','usuario'], view:'usuarios', action:'navigate'},
    {patterns:['reportes','reportes de ventas'], view:'reportes', action:'navigate'}
  ];

  function hasAny(q,words){ return words.some(w=>q.includes(w)); }
  function hasNavigationVerb(q){
    return /(^|\s)(abre|abrir|muestra|mostrar|ver|ve|quiero|lleva|llevame|entra|entrar|ir|vamos|ponme|mandame|accede|acceder|navega|navegar|prepara|preparar|inicia|iniciar)(\s|$)/.test(q);
  }
  function resolveNavigationIntent(q){
    const direct=SIFER_INTENTS.find(x=>hasAny(q,x.patterns));
    if(!direct)return null;
    if(!hasNavigationVerb(q) && !/(donde esta|donde estan|quiero|necesito|ir al|ir a)/.test(q))return null;
    return {name:'navigate',args:{view:direct.view}};
  }
  function localActionFromCommand(command){
    const q=normalizeLocal(command);

    const navigation=resolveNavigationIntent(q);
    if(navigation)return navigation;

    if(/nuevo (cliente|clientes)|crear (cliente|clientes)|registrar (cliente|clientes)/.test(q)) return {name:'open_customer',args:{}};
    if(/nuevo (proveedor|proveedores)|crear (proveedor|proveedores)|registrar (proveedor|proveedores)/.test(q)) return {name:'open_supplier',args:{}};
    if(/nuevo pedido|crear pedido|registrar pedido/.test(q)) return {name:'new_order',args:{}};
    if(/nuevo presupuesto|crear presupuesto|nueva cotizacion|crear cotizacion/.test(q)) return {name:'open_quote',args:{}};
    if(/tasa bcv|tipo de cambio|cotizacion bcv|dolar bcv/.test(q)) return {name:'open_bcv',args:{}};

    if(/(cobro|cobrar).*(cxc|cuenta por cobrar|cliente)/.test(q)){
      const m=q.match(/(?:cobro|cobrar).*?(?:cxc|cuenta por cobrar|cliente)\s*(.*)$/);
      return {name:'open_account_payment',args:{type:'cxc',query:(m?.[1]||'').trim()}};
    }
    if(/(pago|pagar).*(cxp|cuenta por pagar|proveedor)/.test(q)){
      const m=q.match(/(?:pago|pagar).*?(?:cxp|cuenta por pagar|proveedor)\s*(.*)$/);
      return {name:'open_account_payment',args:{type:'cxp',query:(m?.[1]||'').trim()}};
    }
    if(/selecciona|seleccionar|usa|usar|asigna.*cliente/.test(q)){
      const m=q.match(/(?:selecciona|seleccionar|usa|usar|asigna.*cliente)\s+(?:el\s+cliente\s+)?(.+)$/);
      if(m?.[1])return {name:'select_customer',args:{query:m[1]}};
    }
    if(/descuento/.test(q)&&/carrito|articulo|linea|producto/.test(q)){
      const m=q.match(/(\d+(?:\.\d+)?)\s*%/);
      if(m)return {name:'set_discount',args:{discount:Number(m[1])},confirmationText:'Aplicar un descuento del '+m[1]+'% a la línea actual del carrito.'};
    }
    if(/(devolucion|devuelve|devolver).*(articulo|producto|linea|carrito)/.test(q)) return {name:'mark_return',args:{},confirmationText:'Marcar el artículo actual del carrito como devolución.'};
    if(/buscar (articulo|producto|repuesto)|buscar en catalogo|buscar repuesto/.test(q)) return {name:'open_item_search',args:{}};
    if(/(abrir|abre|apertura|abrir la).*(caja)/.test(q)) return {name:'open_cash',args:{},confirmationText:'Abrir la caja actual.'};
    if(/(cobrar|facturar|ir a cobrar|pasar a cobro)/.test(q)) return {name:'open_checkout',args:{}};
    if(/corte x/.test(q)) return {name:'show_x',args:{}};
    if(/(prepara|mostrar|ver|abre|abrir).*(corte z)/.test(q)) return {name:'show_z',args:{}};
    if(/(ejecuta|haz|realiza|cierra|finaliza).*(corte z)/.test(q)) return {name:'execute_z',args:{},confirmationText:'Ejecutar el Corte Z y cerrar la caja actual.'};
    if(/(cancela|cancelar|anula|anular).*(venta)/.test(q)) return {name:'cancel_sale',args:{},confirmationText:'Cancelar la venta actual sin registrarla.'};
    if(/(elimina|quita|borra).*(linea|articulo|producto).*(carrito)/.test(q)){
      const state=currentActionState(),idx=state.cart.length?state.cart.length-1:null;
      if(idx===null)return null;
      return {name:'remove_cart_line',args:{index:idx},confirmationText:'Eliminar del carrito el último artículo agregado.'};
    }
    if(/(agrega|añade|mete|pon).*(al carrito|carrito)/.test(q)){
      const clean=q.replace(/.*?(agrega|añade|mete|pon)\s+/,'').replace(/\s+(al carrito|carrito).*$/,'').trim();
      const p=findProductForCommand(clean);
      if(p)return {name:'add_to_cart',args:{id:p.id,type:(p.sku&&!p.codigo?'repuesto':'producto')}};
    }
    if(/(actualiza|refresca|sincroniza).*(modulo|pantalla|datos)/.test(q)) return {name:'refresh',args:{}};
    if(/imprime|imprimir/.test(q)) return {name:'print',args:{}};
    return null;
  }

  async function planWithSifer(command){
    const readOnlyData=buildReadOnlyData();
    const systemMap=buildSystemMap();
    const context={module:document.getElementById('windowTitle')?.textContent||'Inicio',product:'SIFER360 POS Automotriz',readOnlyData,systemMap,capabilities:buildCapabilities(),actionState:currentActionState()};
    const history=messages.slice(-10).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
    const r=await fetch('/api/sifer-assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'plan',command,messages:history,context})});
    if(!r.ok){let e='No pude consultar el núcleo de interpretación de SIFER.';try{const j=await r.json();e=j.error||e}catch{};throw new Error(e);}
    const plan=await r.json();
    if(!plan?.ok)throw new Error(plan?.error||'SIFER no pudo interpretar la solicitud.');
    return plan;
  }

  async function ask(text){
    const rawText=String(text||'').trim();
    const awakened=extractWakeWord(rawText);
    // Dentro del panel SIFER ya está activo: no obligamos al usuario a repetir su nombre.
    const command=awakened===null ? rawText : awakened;
    if(!command){ status.textContent='Dime qué necesitas.'; setTimeout(()=>{if(!busy)status.textContent='';},1800); return; }
    busy=true; send.disabled=true; orb.classList.add('active'); status.textContent='SIFER está interpretando…';
    messages.push({role:'user',text:'SIFER, '+command}); render();
    try{
      if(isInventoryQuery(command)){\n        messages.push({role:'assistant',text:answerInventoryQuery()}); render(); return;\n      }\n      if(isTodaySalesQuery(command)){
        messages.push({role:'assistant',text:answerTodaySales()}); render(); return;
      }
      let action=localActionFromCommand(command);
      if(!action){
        status.textContent='SIFER está entendiendo la solicitud…';
        const plan=await planWithSifer(command);
        if(plan.type==='answer'){
          messages.push({role:'assistant',text:plan.answer||'Entendido.'}); render(); return;
        }
        if(plan.type==='plan'&&Array.isArray(plan.actions)){
          for(const step of plan.actions){
            status.textContent='SIFER está ejecutando el siguiente paso…';
            const execution=await executeSiferAction(step);
            if(execution?.cancelled){ messages.push({role:'assistant',text:'Operación cancelada. No se modificó el POS.'}); render(); return; }
            if(execution?.message) messages.push({role:'assistant',text:execution.message});
            await new Promise(r=>setTimeout(r,80));
          }
          messages.push({role:'assistant',text:plan.summary||'Solicitud ejecutada por SIFER.'}); render(); return;
        }
        if(plan.type!=='action'||!plan.action) throw new Error('No encontré una acción segura para esa solicitud.');
        action=plan.action;
      }
      status.textContent='SIFER está validando y ejecutando…';
      const execution=await executeSiferAction(action);
      if(execution?.cancelled){
        messages.push({role:'assistant',text:'Operación cancelada. No se modificó el POS.'});
      }else{
        messages.push({role:'assistant',text:execution?.message||'Acción ejecutada por SIFER.'});
      }
      render();
    }catch(e){
      messages.push({role:'assistant',text:'SIFER no pudo ejecutar la solicitud: '+(e?.message||'error desconocido')+'\\n\\nNo se realizó ningún cambio inseguro en el POS.'});render();
    }finally{
      busy=false;send.disabled=false;orb.classList.remove('active');status.textContent='';input.focus();
    }
  }
  form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';ask(text);});
})();
