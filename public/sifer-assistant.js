/* SIFER — holographic POS assistant
 * Reversible integration: this file owns the assistant UI and can be removed
 * without touching POS business logic.
 */
(() => {
  const messages = [];
  let open = false;
  let busy = false;

  const css = `
  #sifer-ai-root{position:fixed;right:18px;bottom:28px;z-index:90;font-family:Arial,Helvetica,sans-serif}
  #sifer-ai-orb{width:72px;height:72px;border-radius:50%;border:1px solid rgba(75,190,255,.75);background:radial-gradient(circle at 50% 45%,rgba(160,235,255,.95) 0 7%,rgba(37,160,255,.38) 18%,rgba(0,77,150,.20) 42%,transparent 68%),rgba(0,20,45,.86);box-shadow:0 0 10px rgba(0,183,255,.75),0 0 28px rgba(0,130,255,.42),inset 0 0 22px rgba(105,225,255,.5);cursor:pointer;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;color:#dff8ff;font-weight:800;letter-spacing:.08em;font-size:10px}
  #sifer-ai-orb:before,#sifer-ai-orb:after{content:"";position:absolute;inset:7px;border:1px solid rgba(90,210,255,.35);border-radius:50%;animation:siferOrbit 5s linear infinite}
  #sifer-ai-orb:after{inset:15px;border-color:rgba(140,235,255,.28);animation-duration:3.2s;animation-direction:reverse}
  #sifer-ai-orb .sifer-core{width:18px;height:18px;border-radius:50%;background:#d8fbff;box-shadow:0 0 8px #fff,0 0 22px #28cfff,0 0 38px #0789ff;z-index:2;animation:siferPulse 1.8s ease-in-out infinite}
  #sifer-ai-orb .sifer-p{position:absolute;width:3px;height:3px;border-radius:50%;background:#8feaff;box-shadow:0 0 7px #22bfff;animation:siferFloat 2.4s ease-in-out infinite}
  #sifer-ai-orb .p1{left:16px;top:25px}.p2{right:13px;top:19px;animation-delay:.4s}.p3{right:18px;bottom:19px;animation-delay:.8s}.p4{left:13px;bottom:22px;animation-delay:1.1s}.p5{left:32px;top:10px;animation-delay:1.5s}
  #sifer-ai-orb.active{box-shadow:0 0 15px rgba(75,210,255,.95),0 0 45px rgba(0,140,255,.65),inset 0 0 30px rgba(105,225,255,.65)}
  #sifer-ai-orb.active .sifer-core{animation:siferPulse .7s ease-in-out infinite}
  #sifer-ai-panel{position:absolute;right:0;bottom:84px;width:min(410px,calc(100vw - 28px));height:min(600px,calc(100vh - 120px));background:linear-gradient(145deg,rgba(4,18,34,.98),rgba(1,10,22,.98));border:1px solid rgba(55,184,255,.48);border-radius:14px;box-shadow:0 0 30px rgba(0,115,220,.32),0 18px 60px rgba(0,0,0,.48);display:none;overflow:hidden;color:#e8f8ff;backdrop-filter:blur(12px)}
  #sifer-ai-panel.show{display:flex;flex-direction:column}
  .sifer-ai-head{height:68px;display:flex;align-items:center;gap:11px;padding:10px 13px;border-bottom:1px solid rgba(83,185,255,.2);background:linear-gradient(90deg,rgba(0,92,170,.16),transparent)}
  .sifer-ai-mini{width:42px;height:42px;border-radius:50%;background:radial-gradient(circle,#dffcff 0 7%,#36caff 16%,#0569b9 43%,#02152b 72%);box-shadow:0 0 15px rgba(28,190,255,.55);flex:0 0 auto}
  .sifer-ai-title{font-size:15px;font-weight:800;letter-spacing:.08em}.sifer-ai-sub{font-size:10px;color:#77cbed;margin-top:3px}
  .sifer-ai-close{margin-left:auto;border:0;background:transparent;color:#9bdcff;font-size:21px;cursor:pointer}
  .sifer-ai-chat{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
  .sifer-msg{max-width:88%;padding:10px 12px;border-radius:10px;font-size:12px;line-height:1.45;white-space:pre-wrap}
  .sifer-msg.ai{align-self:flex-start;background:rgba(12,61,94,.56);border:1px solid rgba(55,184,255,.18)}
  .sifer-msg.user{align-self:flex-end;background:rgba(0,111,191,.72);border:1px solid rgba(93,211,255,.24)}
  .sifer-ai-status{padding:0 14px 7px;font-size:9px;color:#68c9ef;min-height:15px}
  .sifer-ai-form{display:flex;gap:7px;padding:9px;border-top:1px solid rgba(83,185,255,.2);background:rgba(0,0,0,.22)}
  .sifer-ai-input{flex:1;min-width:0;resize:none;height:42px;background:#031526;border:1px solid rgba(80,180,235,.35);border-radius:8px;color:#e9fbff;padding:10px;font-size:12px;outline:none}
  .sifer-ai-input:focus{border-color:#2bc8ff;box-shadow:0 0 0 2px rgba(43,200,255,.08)}
  .sifer-ai-send{width:48px;border:1px solid #168ac5;border-radius:8px;background:linear-gradient(#0798df,#075b98);color:#fff;font-weight:800;cursor:pointer}
  .sifer-ai-send:disabled{opacity:.45;cursor:wait}
  @keyframes siferOrbit{to{transform:rotate(360deg) scaleX(.72)}}
  @keyframes siferPulse{0%,100%{transform:scale(.78);opacity:.85}50%{transform:scale(1.18);opacity:1}}
  @keyframes siferFloat{0%,100%{transform:translate(0,0);opacity:.45}50%{transform:translate(4px,-7px);opacity:1}}
  @media(max-width:700px){#sifer-ai-root{right:10px;bottom:22px}#sifer-ai-orb{width:62px;height:62px}#sifer-ai-panel{bottom:72px;height:min(560px,calc(100vh - 105px))}}
  `;
  const style=document.createElement('style'); style.id='sifer-ai-style'; style.textContent=css; document.head.appendChild(style);

  const root=document.createElement('div'); root.id='sifer-ai-root';
  root.innerHTML=`
    <div id="sifer-ai-panel">
      <div class="sifer-ai-head">
        <div class="sifer-ai-mini"></div>
        <div><div class="sifer-ai-title">SIFER</div><div class="sifer-ai-sub">ASISTENTE INTELIGENTE · POS AUTOMOTRIZ</div></div>
        <button class="sifer-ai-close" title="Cerrar">×</button>
      </div>
      <div class="sifer-ai-chat" id="sifer-ai-chat"></div>
      <div class="sifer-ai-status" id="sifer-ai-status"></div>
      <form class="sifer-ai-form" id="sifer-ai-form">
        <textarea class="sifer-ai-input" id="sifer-ai-input" placeholder="Dile a SIFER qué necesitas…" rows="1"></textarea>
        <button class="sifer-ai-send" id="sifer-ai-send" type="submit">➤</button>
      </form>
    </div>
    <button id="sifer-ai-orb" title="Abrir SIFER">
      <i class="sifer-core"></i><i class="sifer-p p1"></i><i class="sifer-p p2"></i><i class="sifer-p p3"></i><i class="sifer-p p4"></i><i class="sifer-p p5"></i>
      <span>SIFER</span>
    </button>`;
  document.body.appendChild(root);

  const orb=root.querySelector('#sifer-ai-orb');
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
  function toggle(force){
    open=force===undefined?!open:force;
    panel.classList.toggle('show',open);
    if(open && !messages.length){
      add('assistant','Hola. Soy SIFER. Estoy conectado a la interfaz del POS y listo para aprender a trabajar contigo.\n\nPor ahora estoy en fase inicial: conversación y razonamiento. Las acciones reales sobre ventas, inventario, caja y devoluciones se habilitarán de forma controlada en la siguiente etapa.');
      input.focus();
    }
  }
  orb.addEventListener('click',()=>toggle());
  root.querySelector('.sifer-ai-close').addEventListener('click',()=>toggle(false));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});

  async function ask(text){
    busy=true; send.disabled=true; orb.classList.add('active'); status.textContent='SIFER está procesando…';
    const userMsg={role:'user',text}; messages.push(userMsg); render();
    const aiIndex=messages.push({role:'assistant',text:''})-1; render();
    try{
      const context={module:document.getElementById('windowTitle')?.textContent||'Inicio',product:'SIFER360 POS Automotriz'};
      const history=messages.filter((_,i)=>i!==aiIndex).slice(-12).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
      const r=await fetch('/api/sifer-assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:history,context})});
      if(!r.ok){let e='No pude conectar con el núcleo de inteligencia de SIFER.';try{const j=await r.json();e=j.error||e}catch{};throw new Error(e);}
      if(!r.body)throw new Error('El servidor no devolvió un flujo de respuesta.');
      const reader=r.body.getReader(), decoder=new TextDecoder();
      while(true){const {value,done}=await reader.read();if(done)break;messages[aiIndex].text+=decoder.decode(value,{stream:true});render();}
      messages[aiIndex].text+=decoder.decode();
    }catch(e){messages[aiIndex].text='No pude completar la respuesta: '+(e?.message||'error desconocido')+'\n\nLa interfaz del POS permanece intacta.';render();}
    finally{busy=false;send.disabled=false;orb.classList.remove('active');status.textContent='';input.focus();}
  }
  form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';ask(text);});
})();
