/* SIFER360 bootstrap — único punto de entrada del asistente.
 * Mantiene la integración desacoplada del POS y evita cargadores duplicados.
 */
(function(){
  'use strict';
  if(window.__SIFER_BOOTSTRAP_ACTIVE__) return;
  window.__SIFER_BOOTSTRAP_ACTIVE__=true;
  var ASSISTANT='/sifer-assistant.js?v=20261006-10-06';
  var boot=null;
  function css(){
    if(document.getElementById('sifer-boot-style')) return;
    var s=document.createElement('style'); s.id='sifer-boot-style';
    s.textContent='#sifer-boot-orb{position:fixed!important;right:14px!important;bottom:18px!important;width:104px!important;height:104px!important;z-index:2147483647!important;border:0!important;padding:0!important;margin:0!important;background:transparent!important;display:block!important;visibility:visible!important;opacity:1!important;cursor:pointer!important;pointer-events:auto!important}#sifer-boot-orb:before,#sifer-boot-orb:after{content:"";position:absolute;left:50%;top:50%;border:1px solid rgba(67,202,255,.45);border-radius:50%;filter:blur(.2px);transform:translate(-50%,-50%);animation:siferBootOrbit 4.8s linear infinite}#sifer-boot-orb:before{width:86px;height:30px}#sifer-boot-orb:after{width:58px;height:20px;border-color:rgba(150,238,255,.38);animation-duration:3.1s;animation-direction:reverse}#sifer-boot-orb i{position:absolute;display:block;border-radius:50%;background:#a7efff;box-shadow:0 0 6px #2acbff,0 0 13px rgba(30,171,255,.8)}#sifer-boot-orb .core{left:50%;top:50%;width:9px;height:9px;transform:translate(-50%,-50%);background:#e9fdff;box-shadow:0 0 6px #fff,0 0 15px #54dcff,0 0 30px rgba(0,148,255,.95);animation:siferBootPulse 1.5s ease-in-out infinite;z-index:3}@keyframes siferBootOrbit{to{transform:translate(-50%,-50%) rotate(360deg) scaleX(.72)}}@keyframes siferBootPulse{0%,100%{transform:translate(-50%,-50%) scale(.8);opacity:.85}50%{transform:translate(-50%,-50%) scale(1.2);opacity:1}}@media(max-width:700px){#sifer-boot-orb{right:3px!important;bottom:10px!important;width:86px!important;height:86px!important}}';
    document.head.appendChild(s);
  }
  function createBoot(){
    if(document.getElementById('sifer-ai-orb')) return null;
    var existing=document.getElementById('sifer-boot-orb'); if(existing) return existing;
    css();
    boot=document.createElement('button'); boot.id='sifer-boot-orb'; boot.type='button'; boot.setAttribute('aria-label','Abrir SIFER'); boot.title='Abrir SIFER';
    boot.innerHTML='<i class="core"></i><i class="p1"></i><i class="p2"></i><i class="p3"></i><i class="p4"></i><i class="p5"></i>';
    boot.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openAssistant(true);});
    (document.body||document.documentElement).appendChild(boot);
    return boot;
  }
  function removeBoot(){if(boot&&boot.parentNode)boot.parentNode.removeChild(boot);boot=null;}
  function assistantScript(){return document.querySelector('script[data-sifer-assistant]');}
  function openAssistant(focus){
    var real=document.getElementById('sifer-ai-orb');
    if(real){real.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return;}
    if(!assistantScript()){
      var s=document.createElement('script'); s.src=ASSISTANT; s.async=false; s.dataset.siferAssistant='1';
      s.onload=function(){setTimeout(function(){var r=document.getElementById('sifer-ai-orb');if(r)r.click();},0);};
      s.onerror=function(){if(boot)boot.title='SIFER no pudo cargarse; toca para reintentar';};
      (document.body||document.documentElement).appendChild(s);
    } else if(focus){setTimeout(function(){var r=document.getElementById('sifer-ai-orb');if(r)r.click();},250);}
  }
  window.addEventListener('sifer:mounted',function(){removeBoot();});
  function start(){
    createBoot();
    if(document.getElementById('sifer-ai-orb')){removeBoot();return;}
    openAssistant(false);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();