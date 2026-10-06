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
      add('assistant','Hola. Soy SIFER. Estoy conectado al POS y puedo navegar por sus módulos y ejecutar acciones operativas autorizadas. Las operaciones sensibles siempre requieren tu confirmación.');
      input.focus();
    }
  }
  orb.addEventListener('click',()=>toggle());
  root.querySelector('.sifer-ai-close').addEventListener('click',()=>toggle(false));
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
        fields:[...document.querySelectorAll('input,select,textarea')].map((el,i)=>({n:i+1,tag:el.tagName.toLowerCase(),id:el.id||'',name:el.name||'',type:el.type||'',placeholder:el.placeholder||'',label:el.getAttribute('aria-label')||''})).filter(x=>x.id||x.name||x.placeholder||x.label).slice(0,700),
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
    print:{description:'Imprimir la vista actual',mutating:false}
  };
  function buildCapabilities(){ return Object.entries(SIFER_CAPABILITIES).map(([name,x])=>({name,...x})); }
  function currentActionState(){
    try{
      const raw=localStorage.getItem('sifer360_v1'),d=raw?JSON.parse(raw):{};
      const box=(d.cajas||[]).find(x=>x.id===d.terminalId);
      return {cajaId:d.terminalId||null,cajaAbierta:Boolean(box?.abierta),cart:typeof cart!=='undefined'&&Array.isArray(cart)?cart.map((x,i)=>({index:i,id:x.id,nombre:x.nombre,qty:x.qty,price:x.price})):[],currentModule:document.getElementById('windowTitle')?.textContent||'Inicio'};
    }catch{return {};}
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
        const type=args.type==='cxp'?'cxp':'cxc', list=type==='cxc'?(typeof db!=='undefined'?db.cxc:[]):(typeof db!=='undefined'?db.cxp:[]);
        const query=normalizeLocal(args.query||'');
        const item=list.find(x=>normalizeLocal([x.id,x.documento,x.cliente,x.proveedor].filter(Boolean).join(' ')).includes(query));
        if(!item) throw new Error('No encontré el documento de cuenta indicado');
        if(typeof payAccount!=='function') throw new Error('Pago de cuenta no disponible');
        payAccount(type,item.id); return {ok:true,message:type==='cxc'?'Cobro CxC preparado':'Pago CxP preparado'};
      }
      case 'select_customer': {
        const query=normalizeLocal(args.query||'');
        const list=(typeof db!=='undefined'&&Array.isArray(db.clientes))?db.clientes:[];
        const c=list.find(x=>normalizeLocal([x.id,x.nombre,x.documento,x.telefono].filter(Boolean).join(' ')).includes(query));
        if(!c) throw new Error('No encontré ese cliente');
        saleCustomer=c.id; if(typeof renderView==='function') renderView(); return {ok:true,message:'Cliente seleccionado: '+c.nombre};
      }
      case 'edit_cart_line': {
        const idx=Number(args.index); if(!Number.isInteger(idx)||!Array.isArray(cart)||!cart[idx]) throw new Error('Línea de carrito no encontrada');
        const l=cart[idx],qty=args.qty===undefined?l.qty:Number(args.qty),price=args.price===undefined?l.price:Number(args.price),disc=args.discount===undefined?l.disc:Number(args.discount);
        if(qty<=0||price<0||disc<0) throw new Error('Cantidad, precio o descuento inválido');
        const p=db.productos.find(x=>x.id===l.id)||((typeof getRepuestos==='function')?getRepuestos().find(x=>x.id===l.id):null);
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
    return String(s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9.%-]+/g,' ').trim();
  }
  function localActionFromCommand(command){
    const q=normalizeLocal(command);
    const actionPrefix='(?:.*?)(?:abre|abrir|ir|ve|vamos|lleva|entra|muestra|mostrar|muestr)';
    if(new RegExp(actionPrefix+'.*(pos|punto de venta|ventas)').test(q)) return {name:'navigate',args:{view:'pos'}};
    if(new RegExp(actionPrefix+'.*(inventario|productos|product|inventarii)').test(q)) return {name:'navigate',args:{view:'productos'}};
    if(new RegExp(actionPrefix+'.*(compras|compra)').test(q)) return {name:'navigate',args:{view:'compras'}};
    if(new RegExp(actionPrefix+'.*(clientes|cliente)').test(q)) return {name:'navigate',args:{view:'clientes'}};
    if(new RegExp(actionPrefix+'.*(proveedores|proveedor)').test(q)) return {name:'navigate',args:{view:'proveedores'}};
    if(new RegExp(actionPrefix+'.*(cuentas por cobrar|cxc)').test(q)) return {name:'navigate',args:{view:'cxc'}};
    if(new RegExp(actionPrefix+'.*(cuentas por pagar|cxp)').test(q)) return {name:'navigate',args:{view:'cxp'}};
    if(new RegExp(actionPrefix+'.*(caja|cortes|corte)').test(q)) return {name:'navigate',args:{view:'caja'}};
    if(new RegExp(actionPrefix+'.*(pedidos|pedido)').test(q)) return {name:'navigate',args:{view:'pedidos'}};
    if(new RegExp(actionPrefix+'.*(presupuesto|cotizacion)').test(q)) return {name:'navigate',args:{view:'presupuestos'}};
    if(new RegExp(actionPrefix+'.*(configuracion|config)').test(q)) return {name:'navigate',args:{view:'config'}};
    if(/nuevo (cliente|clientes)|crear (cliente|clientes)|abre(r)? (cliente|clientes)/.test(q)) return {name:'open_customer',args:{}};
    if(/nuevo (proveedor|proveedores)|crear (proveedor|proveedores)|abre(r)? (proveedor|proveedores)/.test(q)) return {name:'open_supplier',args:{}};
    if(/nuevo pedido|crear pedido/.test(q)) return {name:'new_order',args:{}};
    if(/nuevo presupuesto|crear presupuesto|nueva cotizacion|crear cotizacion/.test(q)) return {name:'open_quote',args:{}};
    if(/tasa bcv|tipo de cambio|cotizacion bcv|dolar bcv/.test(q)) return {name:'open_bcv',args:{}};
    if(/(cobro|pago).*(cxc|cuenta por cobrar|cliente)/.test(q)) { const m=q.match(/(?:cobro|pago).*?(?:cxc|cuenta por cobrar|cliente)\s*(.*)$/); return {name:'open_account_payment',args:{type:'cxc',query:(m?.[1]||'').trim()}}; }
    if(/(pago|pagar).*(cxp|cuenta por pagar|proveedor)/.test(q)) { const m=q.match(/(?:pago|pagar).*?(?:cxp|cuenta por pagar|proveedor)\s*(.*)$/); return {name:'open_account_payment',args:{type:'cxp',query:(m?.[1]||'').trim()}}; }
    if(/selecciona|seleccionar|usa|usar|asigna.*cliente/.test(q)) { const m=q.match(/(?:selecciona|seleccionar|usa|usar|asigna.*cliente)\s+(?:el\s+cliente\s+)?(.+)$/); if(m?.[1]) return {name:'select_customer',args:{query:m[1]}}; }
    if(/descuento/.test(q)&&/carrito|articulo|linea|producto/.test(q)) { const m=q.match(/(\d+(?:\.\d+)?)\s*%/); if(m) return {name:'set_discount',args:{discount:Number(m[1])},confirmationText:'Aplicar un descuento del '+m[1]+'% a la línea actual del carrito.'}; }
    if(/(devolucion|devuelve|devolver).*(articulo|producto|linea|carrito)/.test(q)) return {name:'mark_return',args:{},confirmationText:'Marcar el artículo actual del carrito como devolución.'};
    if(/buscar (articulo|producto|repuesto)|buscar en catalogo|buscar repuesto/.test(q)) return {name:'open_item_search',args:{}};
    if(/(abrir|abre).*(caja)/.test(q)) return {name:'open_cash',args:{},confirmationText:'Abrir la caja actual.'};
    if(/(cobrar|facturar|ir a cobrar|pasar a cobro)/.test(q)) return {name:'open_checkout',args:{}};
    if(/corte x/.test(q)) return {name:'show_x',args:{}};
    if(/(prepara|mostrar|ver|abre).*(corte z)/.test(q)) return {name:'show_z',args:{}};
    if(/(ejecuta|haz|realiza|cierra).*(corte z)/.test(q)) return {name:'execute_z',args:{},confirmationText:'Ejecutar el Corte Z y cerrar la caja actual.'};
    if(/(cancela|cancelar).*(venta)/.test(q)) return {name:'cancel_sale',args:{},confirmationText:'Cancelar la venta actual sin registrarla.'};
    if(/(elimina|quita|borra).*(linea|articulo|producto).*(carrito)/.test(q)){
      const state=currentActionState(); const idx=state.cart.length?state.cart.length-1:null;
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

  async function ask(text){
    const command=extractWakeWord(text);
    if(command===null){ status.textContent='SIFER está en espera…'; setTimeout(()=>{if(!busy)status.textContent='';},1800); return; }
    if(!command){ status.textContent='Dime qué necesitas después de “SIFER”.'; setTimeout(()=>{if(!busy)status.textContent='';},2200); return; }
    busy=true; send.disabled=true; orb.classList.add('active'); status.textContent='SIFER está procesando…';
    messages.push({role:'user',text:'SIFER, '+command}); render();
    try{
      const localAction=localActionFromCommand(command);
      if(isTodaySalesQuery(command)){
        messages.push({role:'assistant',text:answerTodaySales()}); render(); return;
      }else if(localAction){
        const execution=await executeSiferAction(localAction);
        if(execution?.cancelled){
          messages.push({role:'assistant',text:'Operación cancelada. No se modificó el POS.'});
        }else{
          messages.push({role:'assistant',text:execution?.message||'Acción ejecutada por SIFER.'});
        }
        render(); return;
      }
      const readOnlyData=buildReadOnlyData();
      const systemMap=buildSystemMap();
      const context={module:document.getElementById('windowTitle')?.textContent||'Inicio',product:'SIFER360 POS Automotriz',readOnlyData,systemMap,capabilities:buildCapabilities(),actionState:currentActionState()};
      const history=messages.slice(-12).map(m=>({role:m.role==='assistant'?'assistant':'user',content:m.text}));
      const r=await fetch('/api/sifer-assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:history,context})});
      if(!r.ok){let e='No pude conectar con el núcleo de inteligencia de SIFER.';try{const j=await r.json();e=j.error||e}catch{};throw new Error(e);}
      if(!r.body)throw new Error('El servidor no devolvió un flujo de respuesta.');
      const aiIndex=messages.push({role:'assistant',text:''})-1; render();
      const reader=r.body.getReader(),decoder=new TextDecoder();
      while(true){const {value,done}=await reader.read();if(done)break;messages[aiIndex].text+=decoder.decode(value,{stream:true});render();}
      messages[aiIndex].text+=decoder.decode(); render();
    }catch(e){
      messages.push({role:'assistant',text:'No pude completar la respuesta: '+(e?.message||'error desconocido')+'\\n\\nEl POS permanece intacto.'});render();
    }finally{
      busy=false;send.disabled=false;orb.classList.remove('active');status.textContent='';input.focus();
    }
  }
  form.addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';ask(text);});
})();
