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
  let orbDocked = false;
  // SIFER: conserva el último artículo de catálogo para consultas contextuales.
  let lastCatalogItem = (()=>{try{return JSON.parse(localStorage.getItem('sifer360_last_catalog_item_v1')||'null')}catch{return null}})();

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
  .sifer-ai-voice{padding:7px;text-align:center;font-size:10px;color:#72d8ff;border-top:1px solid #19445b;display:flex;gap:5px;align-items:center;justify-content:center;flex-wrap:wrap}.sifer-ai-voice button{border:1px solid #277fa6;background:#062337;color:#bceeff;border-radius:999px;padding:5px 8px;font-size:10px;cursor:pointer}.sifer-ai-voice button.on{background:#0b7656;border-color:#43e0a4;color:#fff}.sifer-ai-status{min-height:16px;padding:0 10px 5px;font-size:9px;color:#6fc9ef}.sifer-ai-form{display:flex;gap:6px;padding:8px;border-top:1px solid #19445b}.sifer-ai-input{flex:1;height:42px;resize:none;background:#031526;border:1px solid #2b6985;border-radius:7px;color:#fff;padding:9px;font-size:12px}.sifer-ai-send{width:46px;border:1px solid #168ac5;border-radius:7px;background:#087fc0;color:#fff;font-weight:800}
  @keyframes siferOrbit{to{transform:translate(-50%,-50%) rotate(360deg) scaleX(.7)}}
  #sifer-ai-orb[data-state="listening"] .sifer-core{animation:siferListen 1s ease-in-out infinite}
  #sifer-ai-orb[data-state="thinking"] .sifer-core{animation:siferThink .75s ease-in-out infinite}
  #sifer-ai-orb[data-state="executing"] .sifer-core{animation:siferExec .42s linear infinite}
  #sifer-ai-orb[data-state="speaking"] .sifer-core{animation:siferSpeak .5s ease-in-out infinite}
  #sifer-ai-orb[data-state="error"] .sifer-core{animation:siferError .7s ease-in-out 2}
  @keyframes siferListen{50%{transform:translate(-50%,-50%) scale(1.65);box-shadow:0 0 10px #fff,0 0 32px #39cfff,0 0 62px #168cff}}
  @keyframes siferThink{50%{transform:translate(-50%,-50%) scale(.55);box-shadow:0 0 8px #fff,0 0 30px #9d72ff,0 0 65px #6b42ff}}
  @keyframes siferExec{to{transform:translate(-50%,-50%) rotate(360deg);box-shadow:0 0 10px #fff,0 0 35px #ffd45a,0 0 70px #ff9f1c}}
  @keyframes siferSpeak{50%{transform:translate(-50%,-50%) scale(1.45);box-shadow:0 0 10px #fff,0 0 35px #55ffb0,0 0 65px #16c77a}}
  @keyframes siferError{25%,75%{transform:translate(-56%,-50%)}50%{transform:translate(-44%,-50%);box-shadow:0 0 8px #fff,0 0 30px #ff5c6c,0 0 58px #c61f3c}}
  @media(max-width:700px){#sifer-ai-root{right:3px;bottom:8px}#sifer-ai-panel{right:7px;bottom:96px;width:calc(100vw - 14px);height:min(560px,calc(100vh - 110px))}}
  `;
  const oldStyle=document.getElementById('sifer-ai-style'); if(oldStyle)oldStyle.remove();
  const style=document.createElement('style'); style.id='sifer-ai-style'; style.textContent=css; document.head.appendChild(style);

  const root=document.createElement('div'); root.id='sifer-ai-root';
  root.innerHTML=`
    <button id="sifer-ai-orb" type="button" aria-label="Abrir SIFER" title="Abrir SIFER" data-state="idle"><i class="sifer-core"></i><i class="sifer-p p1"></i><i class="sifer-p p2"></i><i class="sifer-p p3"></i></button>
    <section id="sifer-ai-panel" aria-hidden="true">
      <div class="sifer-ai-head"><div class="sifer-ai-mini"></div><div><div class="sifer-ai-title">SIFER</div><div class="sifer-ai-sub">ASISTENTE INTELIGENTE · POS AUTOMOTRIZ</div></div><button class="sifer-ai-close" type="button" aria-label="Cerrar">×</button></div>
      <div class="sifer-ai-chat" id="sifer-ai-chat"></div>
      <div class="sifer-ai-voice" id="sifer-ai-voice"><button id="sifer-ai-mic" type="button" title="Activar micrófono">🎙️ Micrófono</button><button id="sifer-ai-continuous" type="button" title="Escucha continua">♾️ Escucha continua: OFF</button><span id="sifer-ai-voice-text">Micrófono inactivo · toca 🎙️ para activarlo</span></div>
      <div class="sifer-ai-status" id="sifer-ai-status"></div>
      <form class="sifer-ai-form" id="sifer-ai-form"><textarea class="sifer-ai-input" id="sifer-ai-input" placeholder="Dile a SIFER qué necesitas…" rows="1"></textarea><button class="sifer-ai-send" id="sifer-ai-send" type="submit">➤</button></form>
    </section>`;
  document.body.appendChild(root);
  const orb=root.querySelector('#sifer-ai-orb');
  // Blindaje solo visual de la esfera. No tocar el DOM/atributos del panel.
  function keepOrbAlive(){
    if(!document.body.contains(root)) document.body.appendChild(root);
    if(orbDocked) dockOrbToCart();
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
  // Solo vigilar si el nodo raíz realmente desaparece. Evita observar todo el DOM.
  let orbRepairScheduled=false;
  const repairOrb=()=>{
    if(orbRepairScheduled)return;
    orbRepairScheduled=true;
    requestAnimationFrame(()=>{orbRepairScheduled=false;keepOrbAlive();});
  };
  const siferOrbObserver=new MutationObserver(()=>{
    if(!document.body.contains(root)) repairOrb();
  });
  siferOrbObserver.observe(document.body,{childList:true});
  orb.style.display='block';
  const panel=root.querySelector('#sifer-ai-panel');
  function dockOrbToCart(){
    const host=document.querySelector('.posscreen .postable') || document.querySelector('.posscreen .posleft');
    if(!host){ orbDocked=false; root.style.removeProperty('position'); return false; }
    if(getComputedStyle(host).position==='static') host.style.position='relative';
    if(root.parentElement!==host) host.appendChild(root);
    const r=host.getBoundingClientRect();
    root.style.setProperty('position','absolute','important');
    root.style.setProperty('left',(host.clientWidth-108)+'px','important');
    root.style.setProperty('top','12px','important');
    root.style.setProperty('right','auto','important');
    root.style.setProperty('bottom','auto','important');
    root.style.setProperty('z-index','2147483647','important');
    root.title='SIFER · ubicación en el carrito';
    return true;
  }
  function undockOrb(){
    orbDocked=false;
    if(root.parentElement!==document.body) document.body.appendChild(root);
    root.style.setProperty('position','fixed','important');
    root.style.setProperty('left','auto','important');
    root.style.setProperty('right','16px','important');
    root.style.setProperty('top','auto','important');
    root.style.setProperty('bottom','16px','important');
    root.style.setProperty('z-index','2147483647','important');
    root.title='SIFER';
  }
  function moveOrbToCart(){
    if(dockOrbToCart()){ orbDocked=true; dockOrbToCart(); return true; }
    return false;
  }
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
  const micBtn=root.querySelector('#sifer-ai-mic'), continuousBtn=root.querySelector('#sifer-ai-continuous');
  let continuousListening=localStorage.getItem('sifer360_sifer_continuous_voice_v1')==='1';
  continuousBtn.classList.toggle('on',continuousListening);
  continuousBtn.textContent='♾️ Escucha continua: '+(continuousListening?'ON':'OFF');
  micBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();startVoice();});
  continuousBtn.addEventListener('click',e=>{
    e.preventDefault();e.stopPropagation();
    continuousListening=!continuousListening;
    localStorage.setItem('sifer360_sifer_continuous_voice_v1',continuousListening?'1':'0');
    continuousBtn.classList.toggle('on',continuousListening);
    continuousBtn.textContent='♾️ Escucha continua: '+(continuousListening?'ON':'OFF');
    if(continuousListening){ forceClose(); setVoice('listening','Activando micrófono…'); startVoice(); } else { stopVoice(); }
  });
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const voice={recognition:null,stream:null,recorder:null,chunks:[],listening:false,processing:false,timer:null,restartTimer:null,buffer:'',audioContext:null,analyser:null,startedAt:0,session:0};
  function setVoice(mode,text){
    voiceUi.className='sifer-ai-voice '+(mode||'');
    voiceText.textContent=text||'Micrófono inactivo';
    const state=mode==='listening'?'listening':mode==='processing'?'thinking':mode==='executing'?'executing':mode==='speaking'?'speaking':mode==='error'?'error':'idle';
    orb.setAttribute('data-state',state);
  }
  function speak(text){const value=String(text||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();if(!value||!('speechSynthesis'in window)){restartVoice(120);return;}try{voice.recognition?.stop()}catch{}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang='es-VE';u.rate=1.02;u.pitch=1;u.volume=1;u.onend=()=>restartVoice(120);u.onerror=()=>restartVoice(120);window.speechSynthesis.speak(u);}
  async function ensureMic(){if(voice.stream)return true;if(!navigator.mediaDevices?.getUserMedia){setVoice('off','Micrófono no disponible');return false;}try{voice.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});return true;}catch{setVoice('off','Activa el permiso del micrófono');return false;}}
  function restartVoice(delay=180){if((!open&&!continuousListening)||voice.processing||voice.listening||!continuousListening)return;clearTimeout(voice.restartTimer);voice.restartTimer=setTimeout(()=>startVoice(),delay);}
  async function startVoice(){
    if((!open&&!continuousListening)||voice.processing||voice.listening)return;
    // En Chrome/Android SpeechRecognition administra su propio micrófono. No debemos abrir
    // getUserMedia antes porque ambos pueden competir por el mismo dispositivo de captura.
    if(SpeechRecognition){ startSpeech(); return; }
    const ok=await ensureMic();
    if(!ok||voice.processing||voice.listening)return;
    startRecorder();
  }
  function startSpeech(){try{const session=++voice.session,rec=new SpeechRecognition();rec.lang='es-VE';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=3;setVoice('listening','Activando micrófono…');rec.onstart=()=>{if(session!==voice.session)return;voice.listening=true;voice.recognition=rec;setVoice('listening','Escuchando…')};rec.onend=()=>{if(session!==voice.session)return;voice.listening=false;voice.recognition=null;if((open||continuousListening)&&!voice.processing)restartVoice(150)};
      rec.onerror=e=>{voice.listening=false;voice.recognition=null;
        if(e.error==='not-allowed'||e.error==='service-not-allowed'){setVoice('error','Chrome no permite el micrófono. Revisa el permiso de este sitio.');if(continuousListening)setTimeout(()=>{if(continuousListening&&!voice.processing)startVoice()},1200);return}
        if(e.error==='audio-capture'){setVoice('error','No se pudo capturar el micrófono del teléfono.');}
        else if(e.error==='network')setVoice('error','Chrome no pudo conectar el reconocimiento de voz. Reintentando…');
        else if(e.error!=='no-speech'&&e.error!=='aborted')setVoice('error','La escucha se interrumpió. Reintentando…');
        if((open||continuousListening)&&!voice.processing)restartVoice(e.error==='no-speech'?180:500)
      };rec.onresult=e=>{if(session!==voice.session||voice.processing)return;let t='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)t+=(e.results[i][0]?.transcript||'')+' ';if(!t.trim())return;voice.buffer=(voice.buffer+' '+t).trim();clearTimeout(voice.timer);voice.timer=setTimeout(commitVoice,800)};voice.recognition=rec;rec.start()}catch{voice.listening=false;startRecorder()}}
  function commitVoice(){const text=voice.buffer.trim();voice.buffer='';clearTimeout(voice.timer);if(!text){restartVoice(100);return}try{voice.recognition?.stop()}catch{}voice.listening=false;voice.processing=true;setVoice('processing','Procesando…');ask(text).then(()=>{const last=messages[messages.length-1]?.text;if(last)speak(last);else restartVoice(120)}).finally(()=>{voice.processing=false})}
  function startRecorder(){if(!voice.stream||voice.processing||voice.listening)return;const mime=MediaRecorder.isTypeSupported('audio/webm;codecs=opus')?'audio/webm;codecs=opus':(MediaRecorder.isTypeSupported('audio/webm')?'audio/webm':'audio/mp4');try{const rec=new MediaRecorder(voice.stream,{mimeType:mime});voice.recorder=rec;voice.chunks=[];voice.listening=true;voice.startedAt=Date.now();setVoice('listening','Escuchando…');const AC=window.AudioContext||window.webkitAudioContext;if(AC){voice.audioContext=new AC();const src=voice.audioContext.createMediaStreamSource(voice.stream);voice.analyser=voice.audioContext.createAnalyser();voice.analyser.fftSize=1024;src.connect(voice.analyser);monitorSilence()}rec.ondataavailable=e=>{if(e.data?.size)voice.chunks.push(e.data)};rec.onstop=async()=>{voice.listening=false;voice.recorder=null;clearTimeout(voice.timer);try{voice.audioContext?.close()}catch{}voice.audioContext=null;voice.analyser=null;const blob=new Blob(voice.chunks,{type:rec.mimeType||mime});voice.chunks=[];if(blob.size>1200)await transcribeVoice(blob);else restartVoice(120)};rec.onerror=()=>{voice.listening=false;voice.recorder=null;restartVoice(500)};rec.start(200);setTimeout(()=>{if(voice.recorder===rec&&rec.state==='recording')rec.stop()},10000)}catch{voice.listening=false;voice.recorder=null;restartVoice(500)}}
  function monitorSilence(){const a=voice.analyser;if(!a||!voice.recorder)return;const data=new Uint8Array(a.fftSize);a.getByteTimeDomainData(data);let sum=0;for(const n of data){const v=(n-128)/128;sum+=v*v}const rms=Math.sqrt(sum/data.length),elapsed=Date.now()-voice.startedAt;if(elapsed>700&&rms<0.018){clearTimeout(voice.timer);voice.timer=setTimeout(()=>{if(voice.recorder?.state==='recording')voice.recorder.stop()},750)}else clearTimeout(voice.timer);if(voice.recorder?.state==='recording')requestAnimationFrame(monitorSilence)}
  async function transcribeVoice(blob){voice.processing=true;setVoice('processing','Transcribiendo…');try{const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));const audioBase64=btoa(binary);const r=await fetch('/api/sifer-assistant?mode=transcribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'transcribe',audioBase64,mimeType:blob.type||'audio/webm'})});const data=await r.json();if(!r.ok)throw new Error(data?.error||'No pude transcribir la frase');const text=String(data?.text||'').trim();if(!text)throw new Error('No pude entenderte.');await ask(text);const last=messages[messages.length-1]?.text;if(last)speak(last);else restartVoice(120)}catch(e){speak(e?.message||'No pude entenderte.')}finally{voice.processing=false}}
  function stopVoice(){voice.session++;clearTimeout(voice.timer);clearTimeout(voice.restartTimer);try{voice.recognition?.stop()}catch{}try{voice.recorder?.stop()}catch{}voice.recognition=null;voice.recorder=null;voice.listening=false;voice.processing=false;if(voice.stream){voice.stream.getTracks().forEach(t=>t.stop());voice.stream=null}try{voice.audioContext?.close()}catch{}voice.audioContext=null;voice.analyser=null;setVoice('off','Micrófono inactivo')}
  function forceClose(){
    open=false;
    // Si la escucha continua está activa, cerrar el panel NO debe detener el reconocimiento.
    // stopVoice() se reserva para cuando realmente se apaga la escucha.
    if(!continuousListening) stopVoice();
    else {
      clearTimeout(voice.timer); clearTimeout(voice.restartTimer);
      try{voice.recorder?.stop()}catch{}
      voice.recorder=null;
      voice.processing=false;
      voice.listening=false;
    }
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden','true');
    panel.style.setProperty('display','none','important');
    panel.style.setProperty('visibility','hidden','important');
    panel.style.setProperty('opacity','0','important');
    if(continuousListening) setVoice('listening','Activando micrófono…');
  }
  function toggle(force){
    if(continuousListening && force!==false){
      forceClose();
      startVoice();
      return;
    }
    const next=force===undefined?!open:Boolean(force);
    const emergency=document.getElementById('sifer-emergency-shell');
    if(next && emergency) emergency.removeAttribute('open');
    open=next;
    panel.classList.toggle('show',open);
    panel.setAttribute('aria-hidden',open?'false':'true');
    if(open){
      if(!messages.length)add('assistant','Buenos días. Soy SIFER. Ya estoy en línea. Dime qué necesitas y procuraré que el trabajo pesado parezca sencillo. Prometo no juzgar tus instrucciones… demasiado. 😏');
      render(); setVoice('off',continuousListening?'Escucha continua preparada':'Micrófono inactivo · toca 🎙️ para activarlo'); if(continuousListening)setTimeout(()=>startVoice(),120); setTimeout(()=>input.focus(),50);
    }else{
      forceClose();
    }
  }
  window.SIFER_OPEN=()=>toggle(true);
  window.SIFER_CLOSE=()=>toggle(false);
  document.addEventListener('sifer:open',()=>toggle(true));
  document.addEventListener('sifer:close',()=>toggle(false));
  const forceOpen=()=>{open=true;panel.classList.add('show');panel.style.setProperty('display','flex','important');panel.style.setProperty('visibility','visible','important');panel.style.setProperty('opacity','1','important');panel.setAttribute('aria-hidden','false');render();setVoice('off',continuousListening?'Escucha continua preparada':'Micrófono inactivo · toca 🎙️ para activarlo');if(continuousListening)setTimeout(()=>startVoice(),120);setTimeout(()=>input.focus(),30);};
  document.addEventListener('click',e=>{const target=e.target?.closest?.('#sifer-ai-orb,#sifer-emergency-orb');if(!target)return;e.preventDefault();e.stopPropagation();forceOpen();},true);
  orb.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();forceOpen();});
  root.querySelector('.sifer-ai-close').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();forceClose();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){e.preventDefault();forceClose();}});
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

  function localNavigationFromCommand(text){
    const q=normalizeLocal(text);
    if(!/(abre|abrir|abreme|llevame|llévame|ve a|ir a|entra|entrar|muestra|mostrar|ponme|lleva|accede|acceder|abre el|abre la)/.test(q)) return null;
    const aliases=[
      ['productos',/(inventario|inventarios|existencias|stock|productos|articulos|artículos)/],
      ['pos',/(pos|punto de venta|ventas|vender|facturacion|facturación|factura)/],
      ['repuestos',/(repuestos|repuesto|partes automotrices|autopartes)/],
      ['master_catalog',/(catalogo automotriz|catálogo automotriz|catalogo maestro|catálogo maestro)/],
      ['compras',/(compras|compra)/],
      ['clientes',/(clientes|cliente)/],
      ['proveedores',/(proveedores|proveedor)/],
      ['cxc',/(cuentas por cobrar|cuentas por cobrar|cxc|cobros)/],
      ['cxp',/(cuentas por pagar|cxp|pagos a proveedores)/],
      ['presupuestos',/(presupuestos|presupuesto|cotizaciones|cotizacion|cotización)/],
      ['reportes',/(reportes|reportes generales|informes|estadisticas|estadísticas)/],
      ['caja',/(caja|arqueo|corte x|corte z)/],
      ['config',/(configuracion|configuración|ajustes|preferencias)/],
      ['pedidos',/(pedidos|pedido|ordenes|órdenes)/],
      ['usuarios',/(usuarios|cajas y usuarios|usuarios y cajas)/],
      ['inicio',/(inicio|principal|pantalla inicial)/]
    ];
    for(const [view,re] of aliases) if(re.test(q)) return {name:'navigate',args:{view}};
    return null;
  }

  function isInventoryQuery(text){
    const q=normalizeLocal(text);
    return /(cuantos|cuantas|cuanto).*(producto|productos|articulo|articulos|repuesto|repuestos).*(inventario|stock|existencia|existencias)/.test(q)
      || /(inventario|stock|existencias).*(cuantos|cuantas|productos|articulos|repuestos)/.test(q)
      || /cuantos productos tenemos/.test(q);
  }

  async function answerInventoryQuery(){
    try{
      const response=await fetch('/api/sifer-data?query=inventory',{cache:'no-store'});
      if(!response.ok) throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok) throw new Error(data.error||'Consulta no disponible');
      return 'Turso confirma '+Number(data.count||0)+' artículos registrados. '+Number(data.available||0)+' tienen existencia disponible, con '+Number(data.units||0)+' unidades en total.';
    }catch{
      return 'No pude consultar el inventario real en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }
  function extractStockThreshold(text){
    const q=normalizeLocal(text).replace(/,/g,'.');
    const patterns=[
      /(?:por debajo|debajo|menos de|menor que|menores que|inferior a|hasta|menos a)\\s+(?:las?\\s+)?(\\d+(?:\\.\\d+)?)\\s*(?:unidades?|uds?|existencias?|en stock)?/i,
      /(?:stock|existencia|existencias)\\s*(?:menor|inferior|por debajo)\\s*(?:de|a)?\\s*(\\d+(?:\\.\\d+)?)/i
    ];
    for(const re of patterns){const m=q.match(re);if(m)return Number(m[1]);}
    return null;
  }

  function isLowStockQuery(text){
    const q=normalizeLocal(text);
    return extractStockThreshold(q)!==null
      || /(por debajo|debajo|bajo|bajos|bajas|menor|menos|inferior).*(minimo|minima|minimo de|existencia|stock|unidades)/.test(q)
      || /(minimo|minimos|minimas).*(inventario|stock|productos|articulos|repuestos)/.test(q);
  }

  async function answerLowStockQuery(text){
    try{
      const response=await fetch('/api/sifer-data?query=inventory',{cache:'no-store'});
      if(!response.ok)throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok)throw new Error(data.error||'Consulta no disponible');
      const threshold=extractStockThreshold(text);
      const items=Array.isArray(data.items)?data.items:[];
      const low=items.filter(p=>{
        const stock=Number(p.stock??0);
        if(!Number.isFinite(stock))return false;
        if(threshold!==null)return stock<threshold;
        const minimo=Number(p.min??0);
        return Number.isFinite(minimo)&&minimo>0&&stock<minimo;
      });
      if(!low.length)return threshold!==null
        ? 'Turso confirma que no hay artículos con menos de '+threshold+' unidades de existencia.'
        : 'Turso confirma que no hay artículos por debajo del mínimo configurado.';
      const detail=low.slice(0,30).map(p=>{
        const stock=Number(p.stock??0), minimo=Number(p.min??0);
        return (p.nombre||p.codigo||p.id)+' — existencia '+stock+(threshold===null?' — mínimo '+minimo:'');
      }).join('; ');
      const intro=threshold!==null
        ? 'Turso confirma '+low.length+' artículo'+(low.length===1?'':'s')+' con menos de '+threshold+' unidades.'
        : 'Turso confirma '+low.length+' artículo'+(low.length===1?'':'s')+' por debajo del mínimo.';
      return intro+' '+detail+(low.length>30?' …':'');
    }catch{
      return 'No pude consultar las existencias reales en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }

  function isAccountsReceivableQuery(text){
    const q=normalizeLocal(text);
    return /(cuentas? por cobrar|cxc|cuentas? cobrar|cobrarle a|quien me debe|quienes me deben|deudores|clientes? deben|saldo pendiente.*cliente|pendiente.*cliente)/.test(q);
  }
  async function answerAccountsReceivable(){
    try{
      const response=await fetch('/api/sifer-data?query=cxc',{cache:'no-store'});
      if(!response.ok)throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok)throw new Error(data.error||'Consulta no disponible');
      const items=Array.isArray(data.items)?data.items:[];
      if(!items.length)return 'Turso confirma que no hay cuentas por cobrar con saldo pendiente.';
      const detail=items.slice(0,30).map(x=>(x.cliente||x.cliente_id||'Cliente general')+' — '+String(x.numero||'sin documento')+' — saldo '+formatSalesAmount(x.saldo,'USD')).join('; ');
      return 'Turso confirma '+items.length+' documento'+(items.length===1?'':'s')+' con saldo pendiente por cobrar, por un total de '+formatSalesAmount(data.saldo,'USD')+'. '+detail+(items.length>30?' …':'');
    }catch{
      return 'No pude consultar las cuentas por cobrar reales en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }
  function isAccountsPayableQuery(text){
    const q=normalizeLocal(text);
    return /(cuentas? por pagar|cxp|cuentas? pagar|a quien le debo|a quienes les debo|proveedores? debo|saldo pendiente.*proveedor|pendiente.*proveedor)/.test(q);
  }
  async function answerAccountsPayable(){
    try{
      const response=await fetch('/api/sifer-data?query=cxp',{cache:'no-store'});
      if(!response.ok)throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok)throw new Error(data.error||'Consulta no disponible');
      const items=Array.isArray(data.items)?data.items:[];
      if(!items.length)return 'Turso confirma que no hay cuentas por pagar con saldo pendiente.';
      const detail=items.slice(0,30).map(x=>(x.proveedor||x.proveedor_id||'Proveedor')+' — '+String(x.documento||'sin documento')+' — saldo '+formatSalesAmount(x.saldo,'USD')).join('; ');
      return 'Turso confirma '+items.length+' documento'+(items.length===1?'':'s')+' con saldo pendiente por pagar, por un total de '+formatSalesAmount(data.saldo,'USD')+'. '+detail+(items.length>30?' …':'');
    }catch{
      return 'No pude consultar las cuentas por pagar reales en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }

  function isCashQuery(text){
    const q=normalizeLocal(text);
    return /(cuanto hay en caja|cu[aá]nto hay en caja|cuanto tengo en caja|saldo de caja|saldo en caja|caja est[aá] abierta|caja abierta|cajas abiertas|estado de caja|efectivo en caja|dinero en caja|efectivo.*(?:bolivar|bolívar|bolivares|bolívares|usd|dolar|dólar|sistema|deberia|debería)|(?:bolivar|bolívar|bolivares|bolívares).*efectivo|(?:usd|dolar|dólar).*efectivo)/.test(q);
  }
  async function answerCash(requestText=''){
    try{
      const response=await fetch('/api/sifer-data?query=cash',{cache:'no-store'});
      if(!response.ok)throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok)throw new Error(data.error||'Consulta no disponible');
      const items=Array.isArray(data.items)?data.items:[];
      const open=Array.isArray(data.open)?data.open:items.filter(x=>x.abierta);
      if(!items.length)return 'Turso no tiene cajas registradas todavía.';
      if(!open.length)return 'Turso confirma que no hay ninguna caja abierta en este momento.';
      let rate=Number(typeof db!=='undefined'&&db.config?.bcv?.rate);
      const hasCurrencyDetail=/(bolivar|bolívar|bolivares|bolívares|usd|dolar|dólar|deberia|debería|sistema)/.test(normalizeLocal(requestText));
      const detail=open.map(x=>{
        const usd=Number(x.saldo||0);
        const bs=Number.isFinite(rate)&&rate>0?usd*rate:null;
        return (x.nombre||x.id)+' — '+formatSalesAmount(usd,'USD')+(bs!==null?' — equivalente '+bs.toLocaleString('es-VE',{style:'currency',currency:'VES'}):'');
      }).join('; ');
      return 'Turso confirma '+open.length+' '+(open.length===1?'caja abierta':'cajas abiertas')+'. '+detail+'.'+(hasCurrencyDetail&&Number.isFinite(rate)&&rate>0?' Tasa BCV usada para la equivalencia: '+rate.toLocaleString('es-VE',{minimumFractionDigits:4,maximumFractionDigits:4})+' Bs/USD.':'');
    }catch{
      return 'No pude consultar el estado real de caja en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }
  function isLastZQuery(text){
    const q=normalizeLocal(text);
    return /(ultimo corte z|último corte z|ultimo z|último z|ultimo corte|último corte|cuando fue el ultimo corte|cuando fue el último corte|fecha del ultimo corte|fecha del último corte)/.test(q);
  }
  async function answerLastZ(){
    try{
      const response=await fetch('/api/sifer-data?query=last-z',{cache:'no-store'});
      if(!response.ok)throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok)throw new Error(data.error||'Consulta no disponible');
      const x=data.item;
      if(!x)return 'Turso confirma que todavía no hay un Corte Z registrado para las cajas sincronizadas.';
      const when=x.ultimo_corte_at?new Date(x.ultimo_corte_at).toLocaleString('es-VE'):'sin fecha';
      return 'Turso registra el último Corte Z sincronizado en '+(x.nombre||x.id)+' el '+when+'. El saldo registrado actualmente en esa caja es '+formatSalesAmount(x.saldo,'USD')+'.';
    }catch{
      return 'No pude consultar el último Corte Z real en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }

  function isExploreSystemQuery(text){
    const q=normalizeLocal(text);
    return /(explora|explorar|explorate|recorre|recorrer|map(ea|ear)|mapea|mapear|conoce|aprende|explota|reexplora|re-explora).*(sistema|pos|modulos|modulo|botones|acciones|mapa)/.test(q)
      || /(sistema completo|todo el sistema|todos los modulos|todos los botones|mapa.*operativo|vuelve a explorar|aprendete.*botones)/.test(q);
  }

  async function exploreSystem(){
    if(typeof window.SIFER_ATLAS==='undefined'||!window.SIFER_ATLAS)throw new Error('El explorador del atlas no está disponible.');
    if(window.SIFER_ATLAS.isBusy())return 'SIFER ya está explorando el sistema. Espera a que termine.';
    status.textContent='SIFER está recorriendo y aprendiendo el sistema…';
    const out=await window.SIFER_ATLAS.explore();
    const c=out.counts||{visited:0,failed:0};
    const total=(window.SIFER_ATLAS.navModules()||[]).length||c.visited+c.failed;
    return 'Exploración completada. SIFER recorrió '+c.visited+' de '+total+' módulos y guardó botones, campos, selectores, diálogos, modales y navegación en su memoria persistente (local y en la nube).'+(c.failed?' No pudo observar '+c.failed+' módulo(s).':'');
  }

  function isNaturalCatalogLookup(command){
    const q=normalizeLocal(command);
    if(!q || /\b(?:agrega|añade|mete|pon|importa|incorpora|compra|registra|cobra|factura|vende|elimina|cancela|anula)\b/.test(q)) return false;
    const lookupVerb=/(?:busca|buscar|buscame|encuentra|encontrar|tenemos|hay|existe|disponemos|dame|dime|precio|cuanto cuesta|cuanto vale|cual es el precio)/.test(q);
    const productWord=/(sensor|oxigeno|bateria|correa|cables?|bujia|filtro|aceite|bombillo|repuesto|pieza|articulo|producto|aveo|chevrolet|toyota|ford|nissan|hyundai|kia|corolla|sentra|tiida)/.test(q);
    const excluded=/(referencias? cruzadas?|equivalencias?|ficha tecnica|ficha del|agrega al carrito|para vender)/.test(q);
    return lookupVerb&&productWord&&!excluded;
  }
  function isTodaySalesQuery(text){
    const value=String(text||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
    return /(cuanto.*vend|vendimos|ventas.*hoy|venta.*hoy|vendido.*hoy|total.*ventas.*hoy|total.*vendido)/i.test(value);
  }

  async function answerTodaySales(){
    try{
      const raw=localStorage.getItem('sifer360_v1'); const localDb=raw?JSON.parse(raw):{};
      const currency=localDb.config?.moneda||'USD';
      const response=await fetch('/api/sifer-data?query=today-sales',{cache:'no-store'});
      if(!response.ok) throw new Error('Turso no disponible');
      const data=await response.json();
      if(!data.ok) throw new Error(data.error||'Consulta no disponible');
      const total=Number(data.total||0), count=Number(data.count||0);
      if(!count) return 'Turso confirma que hoy no se han registrado ventas.';
      return 'Turso confirma '+count+' '+(count===1?'venta':'ventas')+' registradas hoy por un total de '+formatSalesAmount(total,currency)+'.';
    }catch{
      return 'No pude consultar las ventas de hoy en Turso. No usaré el caché local para darte una cifra que podría ser incorrecta.';
    }
  }

  function loadLearnedMap(){
    try{return JSON.parse(localStorage.getItem('sifer360_learned_map_v1')||'{}')||{};}catch{return {};}
  }
  function rememberCurrentModule(){
    try{
      const map=loadLearnedMap();
      const title=String(document.getElementById('windowTitle')?.textContent||'Inicio').trim();
      const txt=el=>String(el?.innerText||el?.value||el?.getAttribute?.('aria-label')||el?.title||'').replace(/\s+/g,' ').trim();
      const describe=el=>({n:0,text:txt(el),id:el.id||'',name:el.name||'',title:el.title||'',aria:el.getAttribute?.('aria-label')||'',type:el.type||'',disabled:!!el.disabled,onclick:el.getAttribute?.('onclick')||'',tag:el.tagName?.toLowerCase()||'',value:el.tagName?.toLowerCase()==='button'?'':String(el.value||'').slice(0,200)});
      const buttons=[...document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"],a')].map((el,i)=>({...describe(el),n:i+1})).filter(x=>x.text||x.id||x.title||x.aria||x.onclick).slice(0,1000);
      const fields=[...document.querySelectorAll('input,select,textarea')].map((el,i)=>({...describe(el),n:i+1,placeholder:el.placeholder||'',options:el.tagName.toLowerCase()==='select'?[...el.options].slice(0,100).map(o=>({value:o.value,text:txt(o)})):[]})).filter(x=>x.id||x.name||x.placeholder||x.aria).slice(0,1000);
      const dialogs=[...document.querySelectorAll('.modal,[role="dialog"],.modal-backdrop')].map((el,i)=>({n:i+1,id:el.id||'',text:txt(el).slice(0,1000),buttons:[...el.querySelectorAll('button,[role="button"]')].map(txt).filter(Boolean).slice(0,100)})).filter(x=>x.id||x.text).slice(0,120);
      const nav=[...document.querySelectorAll('.module')].map((el,i)=>({n:i+1,text:txt(el),id:el.id||'',onclick:el.getAttribute('onclick')||'',active:el.classList.contains('active')}));
      map[title]={module:title,learnedAt:new Date().toISOString(),buttons,fields,dialogs,navigation:nav,counts:{buttons:buttons.length,fields:fields.length,dialogs:dialogs.length,navigation:nav.length}};
      localStorage.setItem('sifer360_learned_map_v1',JSON.stringify(map));
      return map;
    }catch{return loadLearnedMap();}
  }
  function learnKnownModules(){
    try{
      rememberCurrentModule();
      const map=loadLearnedMap();
      map.__index=Array.from(new Set(Object.keys(map).filter(k=>k!=='__index'&&!k.startsWith('__'))));
      map.__lastObservedAt=new Date().toISOString();
      localStorage.setItem('sifer360_learned_map_v1',JSON.stringify(map));
    }catch{}
  }
  function buildSystemMap(){
    try{
      const txt=el=>String(el?.innerText||el?.value||el?.getAttribute?.('aria-label')||el?.title||'').replace(/\\s+/g,' ').trim();
      const atlas=(typeof window.SIFER_ATLAS!=='undefined'&&window.SIFER_ATLAS)?window.SIFER_ATLAS.contextSlice():null;
      return {
        generatedAt:new Date().toISOString(),
        atlas:atlas,
        learnedModules:loadLearnedMap(),
        pageTitle:document.title,
        currentModule:txt(document.getElementById('windowTitle'))||'Inicio',
        buttons:[...document.querySelectorAll('button,[role="button"],input[type="button"],input[type="submit"]')].map((el,i)=>({n:i+1,text:txt(el),id:el.id||'',ds:el.getAttribute('data-sifer')||'',onclick:el.getAttribute('onclick')||''})).filter(x=>x.text||x.id||x.ds||x.onclick).slice(0,700),
        fields:[...document.querySelectorAll('input,select,textarea')].map((el,i)=>({n:i+1,tag:el.tagName.toLowerCase(),id:el.id||'',name:el.name||'',type:el.type||'',placeholder:el.placeholder||'',label:el.getAttribute('aria-label')||'',ds:el.getAttribute('data-sifer')||'',value:el.value||'',options:el.tagName.toLowerCase()==='select'?[...el.options].slice(0,80).map(o=>({value:o.value,text:txt(o)})) : []})).filter(x=>x.id||x.name||x.placeholder||x.label||x.ds).slice(0,700),
        dialogs:[...document.querySelectorAll('.modal,[role="dialog"]')].map((el,i)=>({n:i+1,id:el.id||'',text:txt(el).slice(0,500)})).filter(x=>x.id||x.text).slice(0,120),
        scripts:[...document.scripts].map(s=>s.src||'inline').slice(0,100),
        principles:['SIFER360 es un POS automotriz, no un ERP.','Las operaciones sensibles deben pedir confirmación antes de modificar datos.','Turso es la fuente remota operativa; el POS debe conservar operación offline.']
      };
    }catch{return {error:'No se pudo construir el mapa operativo actual.'};}
  }

  const SIFER_CAPABILITIES = {
    navigate:{description:'Cambiar al módulo solicitado',mutating:false},
    add_to_cart:{description:'Agregar un producto o repuesto existente al carrito actual',mutating:false},
    search_catalog:{description:'Buscar productos o repuestos en el Catálogo Automotriz/Máster usando lenguaje natural y devolver coincidencias reales',mutating:false},
    catalog_references:{description:'Mostrar las referencias equivalentes del último artículo identificado o de un artículo indicado',mutating:false},
    catalog_ficha:{description:'Mostrar en pantalla la ficha técnica del artículo identificado en el Catálogo Máster',mutating:false},
    import_catalog_item:{description:'Buscar un artículo en el Catálogo Máster, incorporarlo al inventario real y establecer existencia, mínimo y punto de reorden indicados por el usuario',mutating:true,confirm:false},
    create_purchase:{description:'Registrar una compra real a un proveedor, con cantidad, artículo, costo y condición contado o crédito',mutating:true,confirm:true},
    remove_cart_line:{description:'Eliminar una línea del carrito actual',mutating:true,confirm:false},
    cancel_sale:{description:'Cancelar la venta actual sin registrarla',mutating:true,confirm:true},
    open_cash:{description:'Abrir la caja actual',mutating:true,confirm:false},
    finish_sale:{description:'Cobrar y finalizar la venta actual del carrito (abre el cobro antes si hace falta)',mutating:true,confirm:true},
    charge_order:{description:'Tomar un pedido pendiente, cargarlo en el POS y abrir el cobro',mutating:true,confirm:true},
    quote_to_sale:{description:'Convertir un presupuesto en venta cargando sus líneas en el POS',mutating:true,confirm:true},
    account_pay_finish:{description:'Aplicar un cobro CxC o pago CxP sobre un documento con saldo (requiere el formulario abierto)',mutating:true,confirm:true},
    toggle_cash:{description:'Abrir la caja actual (para cerrar la caja usa execute_z)',mutating:true,confirm:false},
    sync_bcv_rate:{description:'Sincronizar la tasa BCV desde la fuente oficial',mutating:false,confirm:false},
    reset_data:{description:'Restablecer los datos del POS a demostración; pide escribir BORRAR SIFER como confirmación',mutating:true,confirm:false},
    open_checkout:{description:'Abrir la ventana de cobro de la venta actual',mutating:false},
    open_purchase:{description:'Abrir el formulario de nueva compra',mutating:false},
    open_quote:{description:'Abrir el formulario de nuevo presupuesto',mutating:false},
    open_bcv:{description:'Mostrar la tasa BCV y sus acciones disponibles',mutating:false},
    open_account_payment:{description:'Abrir el formulario para cobrar CxC o pagar CxP',mutating:false},
    select_customer:{description:'Seleccionar un cliente existente para la venta actual',mutating:true,confirm:false},
    edit_cart_line:{description:'Modificar cantidad, precio o descuento de una línea del carrito',mutating:true,confirm:false},
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
  const SIFER_CRITICAL=new Set(['create_purchase','cancel_sale','execute_z','mark_return','finish_sale','charge_order','quote_to_sale','account_pay_finish']);
  const SIFER_CRITICAL_DS=new Set(['sale-finish','purchase-save','z-execute','order-charge','quote-to-sale','account-pay-finish']);
  function siferNeedsConfirm(name,args){
    if(SIFER_CRITICAL.has(name))return true;
    if(name==='set_discount'){
      const pct=Number(args?.percent);
      if(Number.isFinite(pct)&&pct>=20)return true;
      const disc=Number(args?.discount??args?.amount??0);
      const idx=args?.index===undefined?null:Number(args.index);
      const l=Array.isArray(cart)?(idx!==null&&cart[idx]?cart[idx]:cart[cart.length-1]):null;
      const lineTotal=l?Number(l.qty||0)*Number(l.price||0):0;
      return lineTotal>0&&(disc/lineTotal)>=0.20;
    }
    if(name==='ui_click'){
      const ds=String(args?.dataSifer||args?.ds||'');
      if(ds&&SIFER_CRITICAL_DS.has(ds))return true;
      const el=siferFindButton(args?.target||args?.text||args?.id);
      const elDs=el?el.getAttribute('data-sifer'):null;
      if(elDs&&SIFER_CRITICAL_DS.has(elDs))return true;
      const t=siferUiText(el)||normalizeLocal(String(args?.target||args?.text||''));
      return /(finalizar|cobrar|pagar|anular|cancelar|devolver|devoluci|corte z|ejecutar z|restablecer|resetear|vaciar carrito)/.test(t);
    }
    return false;
  }
  async function withToastCapture(fn){
    let captured='';
    const orig=(typeof window.toast==='function')?window.toast:null;
    window.toast=function(m){captured=String(m||'');if(orig)orig.apply(window,arguments);};
    try{ const r=await fn(); return {result:r,captured}; }
    finally{ if(orig)window.toast=orig; else delete window.toast; }
  }
  async function executeSiferActionOriginal(action){
    const name=String(action?.name||'').trim(),args=action?.args&&typeof action.args==='object'?action.args:{},cap=SIFER_CAPABILITIES[name];
    if(!cap) throw new Error('Acción no permitida por SIFER: '+name);
    if(siferNeedsConfirm(name,args) && !window.confirm('SIFER solicita confirmación\n\n'+String(action.confirmationText||cap.description)+'\n\n¿Deseas ejecutar esta operación?')) return {cancelled:true};
    switch(name){
      case 'navigate': {
        const allowed=['inicio','pos','pedidos','usuarios','master_catalog','repuestos','productos','compras','clientes','proveedores','cxc','cxp','presupuestos','reportes','caja','config'];
        const target=String(args.view||'inicio'); if(!allowed.includes(target)) throw new Error('Módulo no permitido: '+target);
        const navigate=typeof window.go==='function'?window.go:(typeof go==='function'?go:null); if(!navigate) throw new Error('Navegación no disponible'); navigate(target); setTimeout(rememberCurrentModule,300); return {ok:true,message:'Módulo abierto: '+target};
      }
      case 'create_purchase': {
        if(typeof db==='undefined'||!db) throw new Error('Base de datos del POS no disponible');
        const suppliers=Array.isArray(db.proveedores)?db.proveedores:[];
        const supplierRaw=String(args.supplierQuery||args.proveedor||'');
        const supplierQuery=normalizeLocal(supplierRaw);
        let supplier=null;
        if(/^(ese|ese proveedor|el proveedor|el mismo|proveedor existente|proveedor actual)$/i.test(supplierRaw) && suppliers.length===1) supplier=suppliers[0];
        if(!supplier && supplierQuery) supplier=suppliers.find(s=>normalizeLocal([s.id,s.nombre,s.documento,s.rif,s.telefono,s.email].filter(Boolean).join(' ')).includes(supplierQuery));
        if(!supplier && suppliers.length===1) supplier=suppliers[0];
        if(!supplier) throw new Error('No pude identificar el proveedor de la compra.');
        const query=String(args.productQuery||args.producto||args.query||'').trim();
        let p=findProductForCommand(query);
        if(!p && typeof queryMasterCatalog==='function'){
          const catalog=await queryMasterCatalog(query);
          const rows=Array.isArray(catalog)?catalog:(Array.isArray(catalog?.items)?catalog.items:[]);
          const nq=normalizeLocal(query);
          p=rows.find(x=>normalizeLocal([x.nombre,x.sku,x.codigo,x.marca,x.categoria,x.codigoOEM].filter(Boolean).join(' ')).includes(nq))||rows[0]||null;
        }
        if(!p) throw new Error('No encontré el artículo solicitado para la compra.');
        const qty=Math.max(1,Math.floor(Number(args.quantity||args.qty||1)));
        const costRaw=String(args.cost??'').toLowerCase()==='current'?Number(p.costo??p.precio??0):Number(args.cost??p.costo??p.precio??0);
        const cost=Number.isFinite(costRaw)?costRaw:0;
        if(!Number.isFinite(cost)||cost<0) throw new Error('No pude determinar un costo unitario válido para la compra.');
        const paymentType=String(args.type||'credito').toLowerCase();
        const isMixed=paymentType==='mixto'||paymentType==='mixta';
        const isCash=paymentType==='contado';
        const creditDays=Math.max(0,Math.floor(Number(args.creditDays||0)));
        const total=qty*cost;
        const paidRaw=Number(args.cashAmount??args.contado??args.paid??0);
        const paid=isMixed?Math.min(total,Math.max(0,Number.isFinite(paidRaw)?paidRaw:0)):(isCash?total:0);
        const saldo=Math.max(0,total-paid);
        if(paid>0 && !args.cashOutsideBox && typeof cajaActual==='function' && !cajaActual().abierta) throw new Error('Para registrar el componente de contado de una compra primero debes abrir la caja.');
        const dueDate=saldo&&creditDays?new Date(Date.now()+creditDays*86400000).toLocaleDateString('es-VE'):null;
        const isRep=typeof getRepuestos==='function' && getRepuestos().some(x=>x.id===p.id);
        const target=isRep?getRepuestos().find(x=>x.id===p.id):(Array.isArray(db.productos)?db.productos.find(x=>x.id===p.id):null);
        if(!target) throw new Error('El artículo no está disponible en la base de inventario.');
        target.stock=Number(target.stock||0)+qty;
        db.compras=Array.isArray(db.compras)?db.compras:[];
        db.cxp=Array.isArray(db.cxp)?db.cxp:[];
        db.movimientos=Array.isArray(db.movimientos)?db.movimientos:[];
        const num=typeof id==='function'?id('CMP','compra'):'CMP-'+Date.now();
        const compraTipo=isMixed?'mixto':(isCash?'contado':'credito');
        db.compras.push({numero:num,fecha:typeof fmt==='function'?fmt():new Date().toLocaleString('es-VE'),proveedor:supplier.nombre,proveedorId:supplier.id,total,pagado:paid,saldo,tipo:compraTipo,diasCredito:creditDays,fechaVencimiento:dueDate,lineas:[{id:p.id,qty,costo:cost,tipo:isRep?'repuesto':'producto'}]});
        if(saldo){
          db.cxp.push({id:typeof id==='function'?id('CXP','cxp'):'CXP-'+Date.now(),fecha:typeof fmt==='function'?fmt():new Date().toLocaleString('es-VE'),documento:num,proveedorId:supplier.id,proveedor:supplier.nombre,total,saldo,diasCredito:creditDays,fechaVencimiento:dueDate,estado:'Pendiente'});
          supplier.saldo=Number(supplier.saldo||0)+saldo;
        }
        if(paid>0 && !args.cashOutsideBox && typeof cajaActual==='function') cajaActual().saldo-=paid;
        db.movimientos.push({fecha:typeof fmt==='function'?fmt():new Date().toLocaleString('es-VE'),tipo:'Compra',documento:num,detalle:supplier.nombre+(args.cashOutsideBox?' (contado pagado directamente fuera de caja)':''),monto:(paid>0&&!args.cashOutsideBox)?-paid:0});
        if(typeof save==='function') save('purchase-created');
        if(typeof renderView==='function') renderView();
        return {ok:true,message:'Compra '+num+' registrada '+(isMixed?'como mixta':('a '+(isCash?'contado':'credito')))+': '+qty+' unidades de '+p.nombre+' con '+supplier.nombre+'. Total '+money(total)+'. Contado '+money(paid)+'.'+(saldo?' Saldo a crédito '+money(saldo)+(creditDays?' con vencimiento a '+creditDays+' días.':''):' Sin saldo pendiente.')};
      }
      case 'search_catalog': {
        const item=findMasterCatalogItemForCommand(args.query||args.search||'');
        if(!item) throw new Error('No encontré una coincidencia suficientemente clara en el Catálogo Máster.');
        lastCatalogItem=item;
        try{localStorage.setItem('sifer360_last_catalog_item_v1',JSON.stringify(item));}catch{}
        return {ok:true,message:'Encontré: '+item.nombre+' · '+item.marca+' · OEM '+item.codigoOEM+' · costo referencial '+money(item.costoReferencial)};
      }
      case 'catalog_ficha': {
        const query=String(args.query||args.search||'').trim();
        let item=lastCatalogItem;
        if(query) item=findMasterCatalogItemForCommand(query);
        if(!item) throw new Error('No tengo un artículo identificado. Dime cuál artículo quieres consultar.');
        lastCatalogItem=item;
        try{localStorage.setItem('sifer360_last_catalog_item_v1',JSON.stringify(item));}catch{}
        const refs=Array.isArray(item.referenciasCruzadas)?item.referenciasCruzadas:[];
        const fit=Array.isArray(item.compatibilidad)?item.compatibilidad:[];
        const refHtml=refs.length?refs.map((r,i)=>{
          if(typeof r==='string') return '<div style="padding:4px 0">'+(i+1)+'. '+esc(r)+'</div>';
          return '<div style="padding:4px 0">'+(i+1)+'. <b>'+esc(r?.marca||r?.brand||'')+'</b> · '+esc(r?.codigo||r?.code||r?.numeroParte||r?.partNumber||'')+'</div>';
        }).join(''):'<div style="color:#666">Sin referencias cruzadas registradas.</div>';
        const fitHtml=fit.length?fit.map(x=>'<div style="padding:4px 0"><b>'+esc(x.marca||'')+'</b> '+esc(x.modelo||'')+' · '+esc(x.anios||'')+' · '+esc(x.motor||'')+'</div>').join(''):'<div style="color:#666">Sin compatibilidades registradas.</div>';
        const photo=item.fotoReal||item.fotoFallback||'/icon.svg';
        const body='<div style="display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:start">'+
          '<div><img src="'+esc(photo)+'" style="width:105px;height:105px;object-fit:cover;border:1px solid #ccc;border-radius:6px" onerror="this.src=\'/icon.svg\'"></div>'+
          '<div><div style="font-size:16px;font-weight:800;color:#0b4f85">'+esc(item.nombre||'Artículo')+'</div>'+
          '<div style="font-size:11px;color:#666;margin-top:4px">'+esc(item.descripcionTecnica||'')+'</div>'+
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px;font-size:11px">'+
          '<div><b>Marca:</b> '+esc(item.marca||'—')+'</div><div><b>Origen:</b> '+esc(item.origenMarca||'—')+'</div>'+
          '<div><b>OEM:</b> '+esc(item.codigoOEM||'—')+'</div><div><b>Proveedor:</b> '+esc(item.codigoProveedor||'—')+'</div>'+
          '<div><b>Categoría:</b> '+esc(item.categoria||'—')+'</div><div><b>Costo ref.:</b> '+money(item.costoReferencial)+'</div></div></div></div>'+
          '<div style="margin-top:12px;border-top:1px solid #ddd;padding-top:8px"><b>Especificaciones</b><div style="font-size:11px;margin-top:4px">'+esc(item.especificaciones||'—')+'</div></div>'+
          '<div style="margin-top:10px;border-top:1px solid #ddd;padding-top:8px"><b>Compatibilidad</b><div style="font-size:11px;margin-top:4px">'+fitHtml+'</div></div>'+
          '<div style="margin-top:10px;border-top:1px solid #ddd;padding-top:8px"><b>Referencias cruzadas</b><div style="font-size:11px;margin-top:4px">'+refHtml+'</div></div>';
        if(typeof openModal!=='function') throw new Error('Ventana de ficha no disponible');
        openModal('📋 Ficha técnica del artículo',body,'<button class="btn" onclick="closeModal()">Cerrar</button>');
        return {ok:true,message:'Mostré en pantalla la ficha de '+item.nombre+'.'};
      }
      case 'catalog_references': {
        let item=lastCatalogItem;
        if(!item){
          const query=String(args.query||args.search||'').trim();
          if(query) item=findMasterCatalogItemForCommand(query);
        }
        if(!item) throw new Error('No tengo un artículo identificado recientemente. Dime cuál artículo quieres consultar.');
        lastCatalogItem=item;
        try{localStorage.setItem('sifer360_last_catalog_item_v1',JSON.stringify(item));}catch{}
        const refs=Array.isArray(item.referenciasCruzadas)?item.referenciasCruzadas:[];
        if(!refs.length) return {ok:true,message:'El artículo '+item.nombre+' no tiene referencias equivalentes registradas en el Catálogo Máster.'};
        const lines=refs.map((r,i)=>{
          if(typeof r==='string') return (i+1)+'. '+r;
          const brand=r && (r.marca||r.brand) || '';
          const code=r && (r.codigo||r.code||r.numeroParte||r.partNumber) || '';
          return (i+1)+'. '+[brand,code].filter(Boolean).join(' · ');
        });
        return {ok:true,message:'Referencias de '+item.nombre+' (OEM '+(item.codigoOEM||'N/D')+'):\n'+lines.join('\n')};
      }
      case 'import_catalog_item': {
        if(typeof queryMasterCatalog!=='function') throw new Error('Catálogo Máster no disponible');
        const item=findMasterCatalogItemForCommand(args.query||args.search||command||'');
        if(!item) throw new Error('No encontré el artículo solicitado en el Catálogo Máster.');
        const stock=Math.max(0,Math.floor(Number(args.stock??args.quantity??1)));
        const min=args.min===undefined?0:Math.max(0,Math.floor(Number(args.min)));
        const reorderPoint=args.reorderPoint===undefined?Math.max(min,Math.ceil(min*1.6)):Math.max(0,Math.floor(Number(args.reorderPoint)));
        const reps=typeof getRepuestos==='function'?getRepuestos():[];
        const products=Array.isArray(db?.productos)?db.productos:[];
        const norm=s=>normalizeLocal(s);
        const existingRep=reps.find(r=>norm(r.sku)===norm(item.codigoProveedor)||norm(r.codigoOEM)===norm(item.codigoOEM));
        const existingProd=products.find(p=>norm(p.codigo)===norm(item.codigoProveedor)||norm(p.codigoOEM)===norm(item.codigoOEM));
        if(existingRep||existingProd) throw new Error('Ese artículo ya existe en el inventario: '+(existingRep||existingProd).nombre);
        const r=pushMasterItem(item,stock,min,reorderPoint);
        return {ok:true,message:'Importado al inventario: '+r.nombre+' · '+stock+' unidades · mínimo '+min+' · reorden '+reorderPoint};
      }
      case 'add_to_cart': {
        if(typeof addToCart!=='function') throw new Error('Carrito no disponible');
        let id=String(args.id||''), type=args.type==='repuesto'?'repuesto':'producto', p=null, extra='';
        if(!id){
          const query=String(args.query||args.nombre||args.producto||'').trim();
          p=findProductForCommand(query);
          if(!p) throw new Error('No encontré el artículo '+(query?'"'+query+'"':'indicado')+' en el inventario. Buscar en el Catálogo Máster no modifica el inventario; si quieres incorporarlo, indícame explícitamente "importa … con N unidades".');
          id=String(p.id); type=(p.sku&&!p.codigo?'repuesto':'producto');
        }else{
          const raw=localStorage.getItem('sifer360_v1'),d=raw?JSON.parse(raw):{};
          p=type==='repuesto'?(typeof getRepuestos==='function'?getRepuestos().find(x=>x.id===id):null):(Array.isArray(d.productos)?d.productos.find(x=>x.id===id):null);
        }
        const qty=Math.max(1,Math.floor(Number(args.quantity||args.qty||1)));
        const available=Number(p?.stock??0);
        if(p&&qty>available) throw new Error('No hay existencia suficiente para agregar '+qty+' unidades de '+(p?.nombre||'')+'; hay '+available+' disponibles. Dime "importa … con N unidades" para reponer inventario.');
        for(let i=0;i<qty;i++) addToCart(id,type);
        return {ok:true,message:(qty===1?'Artículo agregado al carrito':'Agregadas '+qty+' unidades al carrito')+' ('+(p?.nombre||id)+')'+extra};
      }
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
        let disc;
        if(args.percent!==undefined){
          const pct=Number(args.percent);
          if(!Number.isFinite(pct)||pct<0||pct>100) throw new Error('Porcentaje de descuento inválido');
          disc=(Number(l.qty||0)*Number(l.price||0))*pct/100;
        }else{
          disc=Math.max(0,Number(args.discount));
        }
        if(!Number.isFinite(disc)||disc>Number(l.qty||0)*Number(l.price||0)) throw new Error('Descuento inválido');
        l.disc=disc;selected=null;renderView();return {ok:true,message:'Descuento aplicado: '+money(disc)};
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
      case 'execute_z': {
        if(typeof executeCorteZ!=='function') throw new Error('Corte Z no disponible');
        if(!cajaActual().abierta) throw new Error('La caja ya está cerrada; no hay corte Z que ejecutar.');
        const z=await withToastCapture(()=>executeCorteZ());
        if(cajaActual().abierta) throw new Error(z.captured||'El Corte Z no se ejecutó.');
        return {ok:true,message:z.captured||'Corte Z ejecutado y caja cerrada.'};
      }
      case 'finish_sale': {
        if(typeof window.finishSale!=='function') throw new Error('Finalizar venta no disponible');
        if(!Array.isArray(cart)||!cart.length) throw new Error('El carrito está vacío; no hay nada que cobrar.');
        if(!cajaActual().abierta) throw new Error('Abre la caja antes de cobrar.');
        let total=NaN;
        const saleBtn=document.querySelector('[data-sifer="sale-finish"]');
        if(saleBtn){ const m=String(saleBtn.getAttribute('onclick')||'').match(/finishSale\((-?\d+(?:\.\d+)?)\)/); if(m) total=Number(m[1]); }
        if(!Number.isFinite(total)){
          const sub=cart.reduce((s,x)=>s+Number(x.price||0)*Number(x.qty||1)-Number(x.disc||0),0);
          total=sub*(1+Number((typeof db!=='undefined'&&db.config)?db.config.impuesto:0)/100);
        }
        const amt=Math.abs(total);
        const preflight=await fetch('/api/sifer-business',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
          operation:'sale-preflight',
          cajaId:typeof cajaActual==='function'?cajaActual().id:'',
          lines:cart.map(x=>({id:x.id,qty:x.qty}))
        })});
        const preflightData=await preflight.json().catch(()=>({}));
        if(!preflight.ok||!preflightData.ok) throw new Error(preflightData.error||'Turso no pudo validar la venta antes del cobro.');
        const isCredit=(typeof saleType!=='undefined'&&saleType==='credito');
        const payField=document.getElementById('payAmount1');
        if(payField&&!isCredit){
          const current=Math.max(0,Number(payField.value)||0);
          if(current<amt){ const desired=Number(args.amount??amt); payField.value=String(Number.isFinite(desired)&&desired>=amt?desired:amt); }
          const m1=document.getElementById('payMethod1');
          if(m1&&args.method) m1.value=String(args.method);
        }
        const fs=await withToastCapture(()=>window.finishSale(total));
        if(Array.isArray(cart)&&cart.length) throw new Error(fs.captured||'El POS rechazó el cobro (revisa montos, caja o stock).');
        return {ok:true,message:(fs.captured&&/(correctamente|procesada)/.test(fs.captured))?fs.captured:('Venta cobrada y finalizada por '+money(amt)+'.')};
      }
      case 'charge_order': {
        if(typeof window.cobrarPedido!=='function') throw new Error('Cobro de pedido no disponible');
        const orders=(typeof db!=='undefined'&&Array.isArray(db.pedidos))?db.pedidos:[];
        let pid=String(args.orderId||args.id||args.query||'').trim();
        if(pid){
          const hit=orders.find(x=>String(x.id)===pid||String(x.numero||'')===pid);
          if(!hit) throw new Error('No encontré el pedido indicado.');
          if(String(hit.estado)!=='Pendiente') throw new Error('El pedido no está Pendiente (estado actual: '+hit.estado+').');
          pid=hit.id;
        }else{
          const pending=orders.filter(x=>String(x.estado)==='Pendiente');
          if(pending.length!==1) throw new Error('Hay '+(pending.length||0)+' pedidos pendientes; indica cuál cobrar.');
          pid=pending[0].id;
        }
        const co=await withToastCapture(()=>window.cobrarPedido(pid));
        if(String((typeof activeOrderId!=='undefined')?activeOrderId:'')!==String(pid)) throw new Error(co.captured||'El POS no tomó el pedido (puede estar reservado por otro operador).');
        return {ok:true,message:'Pedido cargado en el POS y cobro abierto.'};
      }
      case 'quote_to_sale': {
        if(typeof window.quoteToSale!=='function') throw new Error('Conversión de presupuesto no disponible');
        const quotes=(typeof db!=='undefined'&&Array.isArray(db.presupuestos))?db.presupuestos:[];
        let num=String(args.numero||args.id||args.query||'').trim();
        if(num){
          const q=quotes.find(x=>String(x.numero).toLowerCase()===num.toLowerCase());
          if(!q) throw new Error('Presupuesto '+num+' no encontrado.');
          num=q.numero;
        }else{
          const open=quotes.filter(x=>String(x.estado)==='Pendiente');
          if(open.length!==1) throw new Error('Hay '+(open.length||0)+' presupuestos pendientes; indica el número a convertir.');
          num=open[0].numero;
        }
        const qs=await withToastCapture(()=>window.quoteToSale(num));
        const q=quotes.find(x=>String(x.numero)===String(num));
        if(!q||String(q.estado)!=='Convertido') throw new Error(qs.captured||'El presupuesto no se convirtió (¿vencido o sin stock?).');
        return {ok:true,message:'Presupuesto '+num+' convertido en venta y cargado en el POS.'};
      }
      case 'account_pay_finish': {
        if(typeof window.finishAccountPay!=='function') throw new Error('Cobro/pago de cuenta no disponible');
        const type=args.type==='cxp'?'cxp':'cxc';
        const list=(typeof db!=='undefined')?(type==='cxc'?db.cxc:db.cxp):[];
        const q=normalizeLocal(args.query||args.id||args.documento||'');
        let rec=q?list.find(x=>normalizeLocal([x.id,x.documento,x.cliente,x.proveedor].filter(Boolean).join(' ')).includes(q)):null;
        if(!rec){ const withSaldo=list.filter(x=>Number(x.saldo)>0); if(withSaldo.length===1) rec=withSaldo[0]; }
        if(!rec) throw new Error('No encontré el documento con saldo para el cobro/pago.');
        const before=Number(rec.saldo)||0;
        if(!before) throw new Error('El documento '+rec.documento+' no tiene saldo pendiente.');
        const field=document.getElementById('payAccountAmt');
        if(!field) throw new Error('Abre primero el cobro/pago con open_account_payment.');
        if(args.amount!==undefined){ const amt=Number(args.amount); if(!Number.isFinite(amt)||amt<=0) throw new Error('Monto inválido'); field.value=String(Math.min(amt,before)); }
        const ap=await withToastCapture(()=>window.finishAccountPay(type,rec.id));
        const after=Number(rec.saldo)||0;
        if(!(after<before)) throw new Error(ap.captured||'El POS no aplicó el pago (¿caja cerrada o monto inválido?).');
        return {ok:true,message:(type==='cxc'?'Cobro':'Pago')+' aplicado: '+money(before-after)+' sobre '+rec.documento+'. Saldo restante: '+money(after)+'.'};
      }
      case 'toggle_cash': {
        if(typeof toggleCaja!=='function') throw new Error('Apertura de caja no disponible');
        if(cajaActual().abierta) throw new Error('La caja ya está abierta; para cerrar la caja usa execute_z (Corte Z).');
        const box=typeof cajaActual==='function'?cajaActual():null;
        const pre=await fetch('/api/sifer-business',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
          operation:'open-cash',cajaId:box?.id||'',nombre:box?.nombre||box?.id||'Caja'
        })});
        const preData=await pre.json().catch(()=>({}));
        if(!pre.ok||!preData.ok) throw new Error(preData.error||'Turso no pudo registrar la apertura de caja.');
        toggleCaja();
        if(!cajaActual().abierta) throw new Error('No se pudo abrir la caja.');
        return {ok:true,message:'Caja abierta.'};
      }
      case 'sync_bcv_rate': {
        if(typeof updateBCVRate!=='function') throw new Error('Sincronización BCV no disponible');
        const b=await withToastCapture(()=>updateBCVRate(false));
        return {ok:true,message:b.captured||'Tasa BCV sincronizada.'};
      }
      case 'reset_data': {
        if(typeof resetData!=='function') throw new Error('Restablecer datos no disponible');
        const rd=await withToastCapture(()=>resetData());
        if(/cancelado/i.test(rd.captured)) throw new Error('Restablecimiento cancelado; no se modificó nada.');
        return {ok:true,message:rd.captured||'Datos restablecidos a demostración.'};
      }
      case 'refresh': if(typeof refreshModuleData!=='function') throw new Error('Actualización no disponible'); refreshModuleData(); return {ok:true,message:'Módulo actualizado'};
      case 'print': if(typeof printView!=='function') throw new Error('Impresión no disponible'); printView(); return {ok:true,message:'Impresión solicitada'};
      case 'ui_click': {
        const el=siferFindButton(args.target||args.text||args.id); if(!el) throw new Error('No encontré el botón o control visible: '+String(args.target||args.text||args.id||''));
        if(siferSensitiveClick(el) && !window.confirm('SIFER solicita confirmación\\n\\n'+String(action.confirmationText||el.innerText||el.value||'Ejecutar esta operación')+'\\n\\n¿Deseas continuar?')) return {cancelled:true};
        el.click(); setTimeout(rememberCurrentModule,250); return {ok:true,message:'Control ejecutado: '+(el.innerText||el.value||el.title||el.id)};
      }
      case 'ui_fill': {
        const el=siferFindField(args.field||args.target||args.id); if(!el) throw new Error('No encontré el campo visible: '+String(args.field||args.target||args.id||''));
        if(el.tagName.toLowerCase()==='select') throw new Error('Para un selector utiliza ui_select');
        const value=String(args.value??''); const proto=el.tagName.toLowerCase()==='textarea'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
        const setter=Object.getOwnPropertyDescriptor(proto,'value')?.set; if(setter) setter.call(el,value); else el.value=value;
        el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); rememberCurrentModule(); return {ok:true,message:'Campo actualizado: '+(args.field||args.target||args.id)};
      }
      case 'ui_select': {
        const el=siferFindField(args.field||args.target||args.id); if(!el||el.tagName.toLowerCase()!=='select') throw new Error('No encontré el selector visible: '+String(args.field||args.target||args.id||''));
        const wanted=normalizeLocal(args.value??args.option??''); const opt=[...el.options].find(o=>normalizeLocal(o.value)===wanted||normalizeLocal(o.textContent)===wanted||normalizeLocal(o.textContent).includes(wanted));
        if(!opt) throw new Error('No encontré la opción solicitada en el selector'); el.value=opt.value; el.dispatchEvent(new Event('change',{bubbles:true})); rememberCurrentModule(); return {ok:true,message:'Opción seleccionada: '+opt.textContent.trim()};
      }
      default: throw new Error('Acción no implementada');
    }
  }

  function deriveCatalogQuery(command){
    const raw=String(command||'').trim();
    const q=normalizeLocal(raw);
    const removeFiller=s=>String(s||'')
      .replace(/\b(?:sifer|por favor|please|busca|buscar|buscame|búscame|buscalo|búscalo|importa|importe|importalo|importar|incorpora|incorpore|incorporalo|incorporar|agrega|agregar|agregue|añade|anade|añadir|anadir|añadelo|añádelo|anada|añada|mete|meta|echale|pon|ciertas|cierto|ciertos|ciertas|unas|unos|varios|algunos|algunas|restantes|a mi inventario|en mi inventario|a la tienda|a mi tienda|desde el catalogo|del catalogo|catalogo|catalog|unidades|uds|piezas|articulo|articulos|del|de la)\b/gi,' ')
      .replace(/\s+/g,' ').trim();
    const direct=removeFiller(q)
      .replace(/\ben\s*importalo\b|\benimportalo\b|\bimportalo\b/gi,' ')
      .replace(/\b(?:100|\d+)\s*(?:unidades?|uds?|piezas?)\b/g,' ')
      .replace(/\b(?:minimo|minima|min|reorden|reordenar|reordenacion)\s*\d+(?:[.,]\d+)?\b/g,' ')
      .replace(/\s+/g,' ').trim();
    const hasEntity=/(sensor|repuesto|producto|articulo|pieza|bujia|bujia|aceite|filtro|bateria|bombillo|aveo|chevrolet|toyota|ford|nissan|hyundai|kia|corolla|sentra|tiida)/i.test(direct);
    if(direct && hasEntity && !/^(el|la|los|las|ese|esa|eso|esto|lo|la)$/i.test(direct)) return direct;
    const recent=messages.slice().reverse().find(m=>m.role==='user' && /(?:sensor|repuesto|producto|articulo|pieza|aveo|chevrolet|toyota|ford|nissan|hyundai|kia|bujia|bujia)/i.test(String(m.text||'')));
    if(recent) return removeFiller(String(recent.text||''))
      .replace(/\b(?:cuanto|cuantos|tenemos|hay|en inventario|inventario|tienda|disponemos|disponible|disponibles)\b/gi,' ')
      .replace(/\s+/g,' ').trim();
    return direct;
  }

  function findMasterCatalogItemForCommand(command){
    try{
      if(typeof queryMasterCatalog!=='function') return null;
      const query=deriveCatalogQuery(command);
      if(!query) return null;
      const variants=[query];
      const q=normalizeLocal(query);
      if(q.includes('sensor') && q.includes('oxigen')) variants.push('sensor oxigeno aveo');
      if(q.includes('aveo') && q.includes('sensor')) variants.push('sensor aveo');
      const unique=[...new Set(variants.filter(Boolean))];
      const candidates=[];
      for(const v of unique){
        const res=queryMasterCatalog(v,'Todos',1,40);
        for(const item of (res?.items||[])) candidates.push(item);
      }
      const toks=normalizeLocal(query).split(/\s+/).filter(t=>t.length>2);
      const score=item=>{
        const hay=normalizeLocal([item.nombre,item.marca,item.codigoOEM,item.codigoProveedor,item.categoria,item.subcategoria,item.descripcionTecnica,item.especificaciones].filter(Boolean).join(' '));
        return toks.reduce((s,t)=>s+(hay.includes(t)?1:0),0);
      };
      return [...new Map(candidates.map(x=>[x.masterId,x])).values()].sort((a,b)=>score(b)-score(a))[0]||null;
    }catch{return null;}
  }

  function pushMasterItem(item,stock,min,reorderPoint){
    const reps=typeof getRepuestos==='function'?getRepuestos():[];
    const r={
      id:'AUT-'+String((db.seq?.producto||1)).padStart(5,'0'),
      sku:item.codigoProveedor||generateUniqueSKU(item.categoria,item.marca,item.codigoOEM),
      nombre:item.nombre,
      categoria:item.categoria,
      marca:item.marca,
      codigoOEM:item.codigoOEM,
      referenciasCruzadas:Array.isArray(item.referenciasCruzadas)?item.referenciasCruzadas:[],
      compatibilidad:Array.isArray(item.compatibilidad)?item.compatibilidad:[],
      costo:Number(item.costoReferencial)||0,
      precio:Number((Number(item.costoReferencial||0)*(1+(Number(item.margenSugerido||35)/100))).toFixed(2)),
      stock,
      min,
      reorderPoint,
      ubicacion:'Almacén Principal',
      garantia:'12 meses',
      especificaciones:item.especificaciones||item.descripcionTecnica||'',
      imagen:item.fotoReal||item.fotoFallback||'/icon.svg'
    };
    if(db.seq) db.seq.producto=Number(db.seq.producto||1)+1;
    reps.push(r);
    save('sifer-catalog-import');
    if(typeof renderView==='function') renderView();
    return r;
  }

  function extractImportParams(command){
    const q=normalizeLocal(command);
    const numberAfter=(patterns, fallback)=>{
      for(const re of patterns){const m=q.match(re);if(m){const n=Number(String(m[1]).replace(',','.'));if(Number.isFinite(n))return n;}}
      return fallback;
    };
    const stock=numberAfter([
      /(?:importa|incorpora|agrega|mete|pon)\s+(\d+(?:[.]\d+)?)\s*(?:unidades?|uds?|piezas?)/,
      /(\d+(?:[.]\d+)?)\s*(?:unidades?|uds?)\s*(?:en\s+existencia|de\s+existencia|de\s+stock)/
    ],1);
    const min=numberAfter([
      /(?:minimo|minima|mínimo|mínima)\s*(?:de|en)?\s*(\d+(?:[.]\d+)?)/,
      /(?:stock\s+minimo|stock\s+m[iní]nimo)\s*[:=]?\s*(\d+(?:[.]\d+)?)/
    ],null);
    const reorder=numberAfter([
      /(?:reorden|punto\s+de\s+reorden|reordenar)\s*(?:de|en)?\s*(\d+(?:[.]\d+)?)/,
      /(?:reorder\s*point)\s*[:=]?\s*(\d+(?:[.]\d+)?)/
    ],null);
    return {stock:Math.max(0,stock),min:min===null?undefined:Math.max(0,min),reorderPoint:reorder===null?undefined:Math.max(0,reorder)};
  }

  function findProductForCommand(command){
    try{
      const raw=localStorage.getItem('sifer360_v1'),d=raw?JSON.parse(raw):{};
      const items=[...(Array.isArray(d.productos)?d.productos:[]),...(typeof getRepuestos==='function'?(getRepuestos()||[]):[])];
      const q=normalizeLocal(command);
      const cleaned=q
        .replace(/\b(?:cantidad|cant|unidades?|uds?|piezas?|pieza|x)\s*[:=]?\s*\d+(?:[.,]\d+)?\b/g,' ')
        .replace(/\b\d+(?:[.,]\d+)?\s*(?:unidades?|uds?|piezas?|x)?\b/g,' ')
        .replace(/\b(?:registra|registrar|realiza|realizar|haz|hacer|crear|crea|genera|compra|comprar|adquisicion|proveedor|existente|actual|mismo|misma|credito|contado|mixto|mixta|dias?|dia|monto|precio|costo|unidad|por|con|al|a|de|ese|saldo|resto|efectivo|cash)\b/g,' ')
        .replace(/\s+/g,' ').trim();
      const singular=t=>String(t||'').replace(/(es|s)$/,'').replace(/ias$/,'ia').replace(/os$/,'o').replace(/as$/,'a');
      const stop=new Set(['ga','el','la','los','las','del','para','una','uno','un','que','mismo','misma']);
      const tokens=cleaned.split(/\s+/).map(singular).filter(x=>x.length>2&&!stop.has(x));
      if(!tokens.length)return null;
      const scored=items.map(p=>{
        const name=normalizeLocal(p.nombre||'');
        const parts=[p.nombre,p.codigo,p.sku,p.marca,p.categoria,p.codigoOEM,p.descripcion,...(Array.isArray(p.referenciasCruzadas)?p.referenciasCruzadas.flatMap(x=>[x.marca,x.codigo]):[])];
        const hay=normalizeLocal(parts.filter(Boolean).join(' '));
        const hayTokens=hay.split(/\s+/).map(singular);
        let score=0;
        for(const t of tokens){
          if(name.includes(t)) score+=1.4;
          else if(hay.includes(t)) score+=1;
          else if(hayTokens.some(h=>h===t||h.startsWith(t)||t.startsWith(h))) score+=0.75;
        }
        if(name && tokens.every(t=>name.includes(t))) score+=2;
        const compactQuery=normalizeLocal(cleaned).replace(/\s+/g,' ');
        const compactName=normalizeLocal(p.nombre||'').replace(/\s+/g,' ');
        if(compactQuery && compactName.includes(compactQuery)) score+=5;
        return {p,score};
      }).sort((a,b)=>b.score-a.score||String(a.p.nombre||'').length-String(b.p.nombre||'').length);
      const best=scored[0];
      if(!best)return null;
      const minimum=Math.max(1.5,Math.min(tokens.length*0.55,3));
      return best.score>=minimum?best.p:null;
    }catch{return null;}
  }
  function extractRequestedQuantity(command){
    const q=normalizeLocal(command);
    const m=q.match(/(?:\b(?:agrega|añade|mete|pon|echa|incorpora)\s+)?(?:\b(?:cantidad|cant|unidades?|uds?|piezas?|x)\s*[:=]?\s*)?(\d+(?:[.,]\d+)?)\s*(?:unidades?|uds?|piezas?|x)?\b/);
    const n=m?Number(String(m[1]).replace(',','.')):1;
    return Number.isFinite(n)&&n>0?n:1;
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
    if(/\b(?:muevete|muevete de sitio|cambia de sitio|ponte en el carrito|colocate en el carrito|colocate ahi|ve al carrito)\b/.test(q)) return {name:'move_orb_to_cart',args:{}};
    if(/\b(?:vuelve|regresa|vuelve a tu sitio|regresa a tu sitio|ponte donde estabas)\b/.test(q)) return {name:'move_orb_home',args:{}};


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
      if(m)return {name:'set_discount',args:{percent:Number(m[1])},confirmationText:'Aplicar un descuento del '+m[1]+'% a la línea actual del carrito.'};
    }
    if(/(devolucion|devuelve|devolver).*(articulo|producto|linea|carrito)/.test(q)) return {name:'mark_return',args:{},confirmationText:'Marcar el artículo actual del carrito como devolución.'};
    if(/(?:referencias? cruzadas?|equivalencias?|numeros? de parte|n[uú]meros? equivalentes?)/.test(q)) return {name:'catalog_references',args:{query:deriveCatalogQuery(command)}};
    if(/(?:muestra|mostrar|ensena|enseña|ver|dame|abre|abrir).*(?:ficha|ficha tecnica|ficha técnica|detalles?)/.test(q) || /ficha.*(?:sensor|repuesto|producto|articulo|aveo|chevrolet)/.test(q)) return {name:'catalog_ficha',args:{query:deriveCatalogQuery(command)}};
    if(/buscar (articulo|producto|repuesto)|buscar en catalogo|buscar repuesto/.test(q)) return {name:'open_item_search',args:{}};
    if(/(abrir|abre|apertura|abrir la).*(caja)/.test(q)) return {name:'open_cash',args:{},confirmationText:'Abrir la caja actual.'};
    if(/(finaliza|termina|procesa|completa|registra|cobra|factura|cierra).*(venta)|registrar (la )?venta|finalizar (la )?venta/.test(q)&&!/corte/.test(q)){ const method=/pago movil|movil|móvil/.test(q)?'Pago Móvil':(/transferencia/.test(q)?'Transferencia':(/tarjeta/.test(q)?'Tarjeta':(/cheque/.test(q)?'Cheque':'Efectivo'))); return {name:'finish_sale',args:{method},confirmationText:'Cobrar y finalizar la venta actual mediante '+method+'.'}; }
    if(/(cobra|cobrar|factura|toma|abre).*(pedido)/.test(q)){
      const m=q.match(/(?:pedido|id)\s+([a-z0-9-]{3,})/);
      return {name:'charge_order',args:m?{orderId:m[1]}:{},confirmationText:'Tomar el pedido, cargarlo en el POS y abrir el cobro.'};
    }
    if(/(convierte|convertir|transforma).*(presupuesto|cotizacion)/.test(q)){
      const m=q.match(/(pre-[a-z0-9-]+)/);
      return {name:'quote_to_sale',args:m?{numero:m[1]}:{},confirmationText:'Convertir el presupuesto en venta y cargarlo en el POS.'};
    }
    if(/(restablece|restablecer|resetea|resetear|reset)\b.*(datos|sistema)|datos de demostracion/.test(q)) return {name:'reset_data',args:{}};
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
    if(/(?:realiza|haz|registra|registrar|crear|crea|genera|compra).*(?:compra|adquisicion|adquisición)/.test(q)){
      const qty=extractRequestedQuantity(q);
      const isMixed=/\bmixt[oa]\b/.test(q);
      const type=isMixed?'mixto':(/\b(?:a|de)\s+credito\b|\bcredito\b/.test(q)?'credito':'contado');
      const cashOutsideBox=/no.*\b(?:descontar|descuente|descontado|descontada)\b.*\bcaja\b|pago.*directamente.*(?:sin|fuera).*caja/.test(q);
      const supplierQuery=/\b(?:con|al|a)\s+(?:el\s+)?(?:proveedor\s+)?(?:existente|actual|mismo|ese proveedor)\b/.test(q)?'ese proveedor':((q.match(/\b(?:con|al|a)\s+(?:el\s+)?proveedor\s+([^,]+?)(?:\s+(?:a|de)\s+credito|\s+credito|\s+contado|\s+mixto|$)/)||[])[1]||'ese proveedor').trim();
      let productQuery='';
      const productMatch=q.match(/(?:art[ií]culo|producto|repuesto)\s+(?:es|:)?\s*(.+?)(?=,\s*(?:compra|registra)\b|\s+compra\s+\d|\s+registra\s+\$?\d|$)/i);
      if(productMatch?.[1]) productQuery=productMatch[1].replace(/\s+/g,' ').trim();
      if(!productQuery){
        productQuery=q.replace(/\b(?:sifer|registra|registrar|realiza|realizar|haz|hacer|crear|crea|genera|otra|una|la|compra|comprar|adquisicion|adquisición|a|de|credito|contado|mixto|mixta|con|al|proveedor|existente|actual|mismo|ese|proveedor|dias?|dia|monto|por|unidad|unidades?|mismo|actual|efectivo|cash|saldo|resto|parte|solo|registrarla|pago|directamente)\b/g,' ').replace(/\b\d+(?:[.,]\d+)?\b/g,' ').replace(/\s+/g,' ').trim();
      }
      const costMatch=q.match(/(?:monto|precio|costo)\s+(?:por\s+)?unidad\s+(?:es\s+)?(?:el\s+)?mismo(?:\s+actual)?/);
      const daysMatch=q.match(/(?:a|de|por)\s+(\d+)\s+d[ií]as?/);
      const cashMatch=q.match(/(\d+(?:[.,]\d+)?)\s+(?:de\s+)?(?:contado|efectivo|cash)\b/);
      const cashAmount=cashMatch?Number(String(cashMatch[1]).replace(',','.')):0;
      return {name:'create_purchase',args:{productQuery,quantity:qty,supplierQuery,type,cashAmount,cost:'current',creditDays:daysMatch?Number(daysMatch[1]):0,cashOutsideBox},confirmationText:'Preparar una compra '+(isMixed?'mixta':type)+' de '+qty+' unidades de '+productQuery+' con '+supplierQuery+(costMatch?' usando el monto unitario actual registrado.':'')+(isMixed?' con '+cashAmount+' de contado y el saldo a crédito.':'')+(daysMatch?' A crédito a '+daysMatch[1]+' días.':'')+'.'};
    }
    const hasImportVerb=/(?:\b(?:importa|importe|importalo|importar|anadelo|andelo|añadelo|añádelo|incorpora|incorpore|incorporalo)\b)/.test(q);
    const hasCartWord=/(?:carrito|para vender|para la venta|a la venta|al pos|para facturar)\b/.test(q);
    const hasInvTarget=/(?:inventario|stock|existencia|existencias|almacen|mi tienda|la tienda|al catalogo|en el catalogo|catalogo maestro)\b/.test(q);
    const hasAddVerb=/(?:\b(?:agrega|agregue|agreguen|agregar|anade|añade|anada|añada|anadir|añadir|mete|meta|echa|incorpora|incorpore|pon)\b)/.test(q);
    if((hasImportVerb||((hasAddVerb)&&hasInvTarget))&&!hasCartWord){
      const params=extractImportParams(q);
      const query=deriveCatalogQuery(command);
      return {name:'import_catalog_item',args:{query,stock:params.stock,min:params.min,reorderPoint:params.reorderPoint}};
    }
    if(/(?:busca|buscar|buscalo|búscalo|búscame|buscame)\b.*(?:catalogo|cat[aá]logo|en inventario|tienda)/.test(q)){
      return {name:'search_catalog',args:{query:deriveCatalogQuery(command)}};
    }
    if(hasAddVerb&&!hasInvTarget){
      const clean=q
        .replace(/.*?\b(?:agrega|agregue|agreguen|agregar|anade|añade|anada|añada|anadir|añadir|mete|meta|echa|incorpora|incorpore|pon)\b\s*/,' ')
        .replace(/\b(?:al carrito|carrito|para vender|para la venta|a la venta|al pos|para facturar|del articulo|del artículo|el articulo|el artículo|articulo|articulos|artículo|artículos|unidades|uds|piezas|cantidad|cant)\b/g,' ')
        .replace(/\b(?:de|del|la|el|los|las|en)\b/g,' ')
        .replace(/\b\d+(?:[.,]\d+)?\b/g,' ')
        .replace(/\s+/g,' ').trim();
      const explicitQty=/\b\d+\b/.test(q);
      if(!(explicitQty||hasCartWord)) return null;
      const p=clean?findProductForCommand(clean):null;
      if(!p&&!clean) return null;
      const quantity=extractRequestedQuantity(command);
      return p?{name:'add_to_cart',args:{id:p.id,type:(p.sku&&!p.codigo?'repuesto':'producto'),quantity}}
              :{name:'add_to_cart',args:{query:clean,quantity}};
    }
    if(/(actualiza|refresca|sincroniza).*(modulo|pantalla|datos)/.test(q)) return {name:'refresh',args:{}};
    if(/imprime|imprimir/.test(q)) return {name:'print',args:{}};
    return null;
  }

  async function executeSiferAction(action){
    if(action?.name==='move_orb_to_cart'){
      const ok=moveOrbToCart();
      return {message:ok?'Listo. Me moví al área del carrito para no taparte la vista. 😏':'No encuentro ahora el área del carrito en pantalla.'};
    }
    if(action?.name==='move_orb_home'){
      undockOrb();
      return {message:'He vuelto a mi sitio. La esfera queda fuera del área de trabajo.'};
    }
    return await executeSiferActionOriginal(action);
  }

  function sanitizePlan(plan){
    if(!plan||plan.ok!==true)throw new Error('El planificador no devolvió ok:true.');
    const allowed=new Set(buildCapabilities().map(c=>c&&c.name).filter(Boolean));
    const checkAction=(a,where)=>{
      if(!a||typeof a!=='object')throw new Error(where+' no es una acción válida.');
      const name=String(a.name||'').trim();
      if(!allowed.has(name))throw new Error(where+' propone una capacidad no habilitada: '+(name||'(vacía)'));
      const args=(a.args&&typeof a.args==='object'&&!Array.isArray(a.args))?a.args:{};
      for(const k of Object.keys(args)){
        const v=args[k];
        if(v===null||v===undefined)continue;
        const t=typeof v;
        if(t==='string'){ if(v.length>600)throw new Error(where+': el argumento "'+k+'" es demasiado largo.'); }
        else if(t==='number'||t==='boolean'){ if(t==='number'&&!Number.isFinite(v))throw new Error(where+': el argumento "'+k+'" no es un número válido.'); }
        else if(Array.isArray(v)){ for(const x of v){ if(x!==null&&!['string','number','boolean'].includes(typeof x))throw new Error(where+': el argumento "'+k+'" contiene valores no permitidos.'); } }
        else throw new Error(where+': el argumento "'+k+'" debe ser texto, número, booleano o lista.');
      }
      return {name,args,confirmationText:typeof a.confirmationText==='string'?a.confirmationText.slice(0,500):undefined};
    };
    const type=String(plan.type||'');
    if(type==='answer'){
      if(!String(plan.answer||'').trim())throw new Error('El planificador devolvió una respuesta vacía.');
      return plan;
    }
    if(type==='action'){ plan.action=checkAction(plan.action,'La acción'); return plan; }
    if(type==='plan'){
      if(!Array.isArray(plan.actions)||plan.actions.length<1)throw new Error('El plan no contiene acciones.');
      if(plan.actions.length>8)throw new Error('El plan excede 8 pasos.');
      if(!String(plan.summary||'').trim())throw new Error('El plan no tiene resumen.');
      plan.actions=plan.actions.map((a,i)=>checkAction(a,'Paso '+(i+1)));
      return plan;
    }
    throw new Error('Tipo de plan desconocido: '+(type||'(vacío)'));
  }

  async function planWithSifer(command){
    const readOnlyData=buildReadOnlyData();
    const systemMap=buildSystemMap();
    const memory=(typeof window.SIFER_MEMORY!=='undefined'&&window.SIFER_MEMORY)?window.SIFER_MEMORY.contextSlice(command):null;
    const context={module:document.getElementById('windowTitle')?.textContent||'Inicio',product:'SIFER360 POS Automotriz',readOnlyData,systemMap,capabilities:buildCapabilities(),actionState:currentActionState(),learnedMap:loadLearnedMap(),memory};
    const history=messages.slice(-10).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
    const r=await fetch('/api/sifer-assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'plan',command,messages:history,context})});
    if(!r.ok){let e='No pude consultar el núcleo de interpretación de SIFER.';try{const j=await r.json();e=j.error||e}catch{};throw new Error(e);}
    const plan=await r.json();
    if(!plan?.ok)throw new Error(plan?.error||'SIFER no pudo interpretar la solicitud.');
    return sanitizePlan(plan);
  }

  // Respuestas atómicas: preguntas conversacionales simples no deben consumir Gemini.
  // El asistente debe reaccionar en milisegundos cuando la intención no requiere razonamiento externo.
  function localConversationalAnswer(command){
    const q=normalizeLocal(command);
    if(/^(me estas escuchando|me estas oyendo|me escuchas|me oyes|estas escuchando|estas ahi|estas ahi sifer|sifer estas ahi|funcionas|estas activa|estas activo)\\??$/.test(q)){
      return continuousListening && voice.listening
        ? 'Sí. Te escucho perfectamente. La escucha continua está activa.'
        : (continuousListening ? 'Sí. Estoy activa; la escucha continua está encendida y estoy intentando mantener el micrófono conectado.' : 'Sí. Estoy aquí. Toca el micrófono o activa la escucha continua y dime qué necesitas.');
    }
    if(/^(que puedes hacer|que puedes hacer tu|que sabes hacer|para que sirves|cuales son tus funciones|que funciones tienes|como puedes ayudarme|en que puedes ayudarme)\\??$/.test(q)){
      return 'Puedo ayudarte directamente con el POS: buscar productos y repuestos, mostrar fichas y equivalencias, consultar inventario y ventas, navegar módulos, trabajar con el carrito, clientes, compras, caja, pedidos, presupuestos y reportes, además de ejecutar operaciones seguras cuando estén disponibles. Háblame como le hablarías a una persona; no necesitas memorizar comandos.';
    }
    if(/^(hola|buenos dias|buenas tardes|buenas noches|buenas|hey|epa|epa sifer)\\??$/.test(q)){
      return 'Aquí estoy. Lista para trabajar. ¿Qué necesitas?';
    }
    if(/^(gracias|muchas gracias|perfecto|excelente|ok|okay)\\??$/.test(q)){
      return 'A la orden. Seguimos cuando quieras.';
    }
    return null;
  }

  function localMemoryCommand(command){
    const M=(typeof window.SIFER_MEMORY!=='undefined'&&window.SIFER_MEMORY)?window.SIFER_MEMORY:null;
    if(!M)return null;
    const q=normalizeLocal(command);
    let m=q.match(/^(?:recuerda|recuerde|anota|apunta)(?: que| esto| lo siguiente)?[\s:,.]+(.+)$/);
    if(m){
      const fact=M.remember(m[1].trim(),'');
      return fact?'Hecho. Lo guardo en mi memoria persistente: "'+(fact.content.slice(0,160)+(fact.content.length>160?'…':''))+'"':'No me dijiste qué debo recordar.';
    }
    m=q.match(/^(?:que|que) recuerdas(?: de| sobre)?(?: el| la| los| las| tu)?\s*(.*)$/);
    if(m){
      const target=(m[1]||'').trim();
      const facts=M.recallList(target,10);
      if(!facts.length)return 'Todavía no tengo memorizado nada'+(target?' sobre "'+target+'"':'')+'. Dime "recuerda que…" y lo guardo.';
      const lines=facts.map((f,i)=>(i+1)+'. '+String(f.content).slice(0,180));
      return (target?'Esto recuerdo sobre "'+target+'":':'Esto es lo que más recuerdo:')+'\n'+lines.join('\n');
    }
    m=q.match(/^(?:olvida|borra|elimina)(?: de (?:tu|la) )?(?:memoria|recuerdo|recuerdos)(?: que|:)?\s*(.*)$/);
    if(m){
      const target=(m[1]||'').trim();
      if(!target)return 'Dime qué debo olvidar: "olvida de memoria …".';
      const n=M.forget(target);
      return n?'Listo. Eliminé '+n+' '+(n===1?'registro':'registros')+' de mi memoria.':'No encontré nada en mi memoria que coincida con "'+target+'".';
    }
    return null;
  }

  function recordEpisodeSafe(command,outcome,success){
    try{
      const M=(typeof window.SIFER_MEMORY!=='undefined'&&window.SIFER_MEMORY)?window.SIFER_MEMORY:null;
      if(!M)return;
      const title=String(document.getElementById('windowTitle')?.textContent||'Inicio').trim();
      M.recordEpisode(command,title,outcome,success);
    }catch{}
  }

  async function ask(text){
    const rawText=String(text||'').trim();
    const awakened=extractWakeWord(rawText);
    // Dentro del panel SIFER ya está activo: no obligamos al usuario a repetir su nombre.
    const command=awakened===null ? rawText : awakened;
    if(!command){ status.textContent='Dime qué necesitas.'; setTimeout(()=>{if(!busy)status.textContent='';},1800); return; }
    // Ruta atómica: responde sin red, Gemini ni espera cuando la solicitud es trivial.
    const instant=localConversationalAnswer(command);
    messages.push({role:'user',text:'SIFER, '+command}); render();
    if(instant){
      messages.push({role:'assistant',text:instant}); render();
      if(voice.processing){ speak(instant); }
      return;
    }
    const memoryReply=localMemoryCommand(command);
    if(memoryReply!==null){
      messages.push({role:'assistant',text:memoryReply}); render();
      if(voice.processing){ speak(memoryReply); }
      return;
    }
    busy=true; send.disabled=true; orb.classList.add('active'); setVoice('thinking','SIFER está pensando…'); status.textContent='SIFER está interpretando…';
    try{
      if(isExploreSystemQuery(command)){
        status.textContent='SIFER está recorriendo y aprendiendo el sistema…';
        const result=await exploreSystem();
        messages.push({role:'assistant',text:result}); render(); return;
      }
      if(isLowStockQuery(command)){
        messages.push({role:'assistant',text:await answerLowStockQuery(command)}); render(); return;
      }
      if(isAccountsReceivableQuery(command)){
        messages.push({role:'assistant',text:await answerAccountsReceivable()}); render(); return;
      }
      if(isAccountsPayableQuery(command)){
        messages.push({role:'assistant',text:await answerAccountsPayable()}); render(); return;
      }
      if(/(?:cuando|cu[aá]ndo|en cuantos|en cu[aá]ntos|que dia|qué día|fecha).*(?:vence|vencimiento)|(?:vence|vencimiento).*(?:cada|cxp|proveedor|proveedores)/i.test(normalizeLocal(command))){
        const response=await fetch('/api/sifer-data?query=cxp',{cache:'no-store'});
        const data=await response.json().catch(()=>({}));
        if(!response.ok||!data.ok) throw new Error(data.error||'No pude consultar CxP en Turso.');
        const items=Array.isArray(data.items)?data.items:[];
        const answer=items.length
          ? 'Turso tiene '+items.length+' CxP pendientes, pero actualmente no existe un campo de fecha de vencimiento registrado para esos documentos. No voy a inventar una fecha. Documentos: '+items.map(x=>(x.proveedor||'Proveedor')+' — '+String(x.documento||'sin documento')+' — fecha registrada '+String(x.fecha||'sin fecha')).join('; ')+'.'
          : 'Turso confirma que no hay CxP pendientes.';
        messages.push({role:'assistant',text:answer}); render(); return;
      }
      if(isCashQuery(command)){
        messages.push({role:'assistant',text:await answerCash(command)}); render(); return;
      }
      if(isLastZQuery(command)){
        messages.push({role:'assistant',text:await answerLastZ()}); render(); return;
      }
    if(isInventoryQuery(command)){
        messages.push({role:'assistant',text:await answerInventoryQuery()}); render(); return;
      }
      if(isTodaySalesQuery(command)){
        messages.push({role:'assistant',text:await answerTodaySales()}); render(); return;
      }
      // Las consultas de referencias cruzadas/equivalencias son consultas de datos:
      // deben resolverse SIEMPRE de forma determinística antes del planificador.
      // Así frases como "esas son las referencias?", "dame las referencias de ese artículo"
      // o "revisa las referencias cruzadas" no pueden ser interpretadas como una búsqueda
      // nueva ni delegadas al LLM.
      if(isNaturalCatalogLookup(command)){
        const query=deriveCatalogQuery(command);
        if(!query) throw new Error('Dime qué artículo quieres buscar.');
        const execution=await executeSiferAction({name:'search_catalog',args:{query}});
        messages.push({role:'assistant',text:execution?.message||'Búsqueda realizada.'}); render(); return;
      }
      const referenceIntent=/(?:referencias? cruzadas?|referencias?|equivalencias?|numeros? de parte|numeros? equivalentes?)/i.test(normalizeLocal(command));
      let action;
      const fichaIntent=/(?:muestra|mostrar|ensena|enseña|ver|dame|abre|abrir).*(?:ficha|ficha tecnica|ficha técnica|detalles?)|ficha.*(?:sensor|repuesto|producto|articulo|aveo|chevrolet)/i.test(normalizeLocal(command));
      if(fichaIntent){
        action={name:'catalog_ficha',args:{query:deriveCatalogQuery(command)}};
      }else if(referenceIntent){
        action={name:'catalog_references',args:{query:deriveCatalogQuery(command)}};
      }else{
        action=localNavigationFromCommand(command) || localActionFromCommand(command);
      }
      if(!action){
        status.textContent='SIFER está entendiendo la solicitud…';
        const plan=await planWithSifer(command);
        if(plan.type==='answer'){
          messages.push({role:'assistant',text:plan.answer||'Entendido.'}); render(); return;
        }
        if(plan.type==='plan'&&Array.isArray(plan.actions)){
          const total=plan.actions.length;
          for(let i=0;i<total;i++){
            const step=plan.actions[i];
            setVoice('executing','SIFER está ejecutando…'); status.textContent='SIFER está ejecutando el paso '+(i+1)+' de '+total+'…';
            let execution;
            try{
              execution=await executeSiferAction(step);
            }catch(stepErr){
              const why=stepErr?.message||'error desconocido';
              recordEpisodeSafe(command,'Fallo en paso '+(i+1)+'/'+total+' ('+(step.name||'')+'): '+why,false);
              messages.push({role:'assistant',text:'El paso '+(i+1)+' de '+total+' ('+(step.name||'paso sin nombre')+') falló: '+why+'.\nEl plan se detuvo aquí; los pasos anteriores quedaron aplicados y no se intentó repetir.'});
              render(); return;
            }
            if(execution?.cancelled){ messages.push({role:'assistant',text:'Operación cancelada. No se modificó el POS.'}); render(); return; }
            if(execution?.message) messages.push({role:'assistant',text:execution.message});
            await new Promise(r=>setTimeout(r,80));
          }
          messages.push({role:'assistant',text:plan.summary||'Solicitud ejecutada por SIFER.'}); render();
          recordEpisodeSafe(command,plan.summary||'Plan ejecutado',true);
          return;
        }
        if(plan.type!=='action'||!plan.action) throw new Error('No encontré una acción segura para esa solicitud.');
        action=plan.action;
      }
      setVoice('executing','SIFER está ejecutando…'); status.textContent='SIFER está validando y ejecutando…';
      const execution=await executeSiferAction(action);
      if(execution?.cancelled){
        messages.push({role:'assistant',text:'Operación cancelada. No se modificó el POS.'});
      }else{
        messages.push({role:'assistant',text:execution?.message||'Acción ejecutada por SIFER.'});
        recordEpisodeSafe(command,execution?.message||'Acción ejecutada',true);
      }
      render();
    }catch(e){
      const errText=(e?.message||'error desconocido');
      recordEpisodeSafe(command,'Fallo: '+errText,false);
      messages.push({role:'assistant',text:'SIFER no pudo ejecutar la solicitud: '+errText+'\\n\\nNo se realizó ningún cambio inseguro en el POS.'});render();
    }finally{
      busy=false;send.disabled=false;orb.classList.remove('active');if(!voice.listening&&!voice.processing)setVoice('off',continuousListening?'Escucha continua activa':'Listo cuando quieras');status.textContent='';input.focus();
    }
  }
  if(continuousListening){ setVoice('listening','Escucha continua activa'); setTimeout(()=>startVoice(),250); }
  form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';ask(text);});
})();
