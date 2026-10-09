(function(global){
  'use strict';
  var tempLines=[],supplierMatches=[],productMatches=[],selectedProductId='',selectedPurchaseNo='',lastHydrateAt=0,hydrating=false;
  function el(id){return document.getElementById(id)}
  function n(v){
    if(typeof v==='number')return Number.isFinite(v)?v:0;
    var s=String(v==null?'':v).trim().replace(/\s/g,'');
    if(!s)return 0;
    if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(',','.');
    var x=Number(s);return Number.isFinite(x)?x:0;
  }
  function r2(v){return Math.round((n(v)+Number.EPSILON)*100)/100}
  function dec(){var d=n(el('pe-dec')?.value||2);return d===3||d===4?d:2}
  function fmt(v){return new Intl.NumberFormat('es-VE',{minimumFractionDigits:dec(),maximumFractionDigits:dec()}).format(n(v))}
  function esc(v){return typeof global.esc==='function'?global.esc(String(v==null?'':v)):String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function money(v){return typeof global.money==='function'?global.money(v):fmt(v)}
  function tasaBcv(){return n(global.db?.config?.bcv?.rate||0)}
  function moneda(){return el('pe-moneda')?.value||'USDT'}
  function tasaCompra(){return n(el('pe-tasa-compra')?.value)||tasaBcv()}
  function ivaRate(){return Math.max(0,n(global.db?.config?.impuesto)||16)}
  function getProductById(id){return (global.db.productos||[]).find(function(p){return String(p.id)===String(id)})}
  function getProductByCode(code){return (global.db.productos||[]).find(function(p){return String(p.codigo||'').toLowerCase()===String(code||'').trim().toLowerCase()})}
  function totalBase(){return r2(tempLines.reduce(function(s,l){return s+n(l.subtotalBs)},0))}
  function totalIva(){return r2(tempLines.reduce(function(s,l){return s+n(l.ivaBs)},0))}
  function totalFactura(){return r2(totalBase()+totalIva())}
  function paidCalc(total){
    var type=el('pe-tipo')?.value||'Contado',rate=tasaCompra(),paid=0;
    if(type==='Contado')paid=total;
    else if(type==='Mixto'){
      var bs=n(el('pe-pago-bs')?.value),usd=n(el('pe-pago-usd')?.value);
      paid=bs>0?bs:r2(usd*rate);
    }
    paid=Math.max(0,Math.min(total,paid));
    return {total:total,pagado:r2(paid),pendiente:r2(Math.max(0,total-paid)),pagadoUSDProv:rate>0?r2(paid/rate):0,pagadoUSDBcv:tasaBcv()>0?r2(paid/tasaBcv()):0,pendienteUSD:tasaBcv()>0?r2(Math.max(0,total-paid)/tasaBcv()):0};
  }
  function syncMixed(origin){
    var rate=tasaCompra();if(rate<=0)return;
    var bs=n(el('pe-pago-bs')?.value),usd=n(el('pe-pago-usd')?.value);
    if(origin==='bs'&&bs>0)el('pe-pago-usd').value=fmt(r2(bs/rate));
    if(origin==='usd'&&usd>0)el('pe-pago-bs').value=fmt(r2(usd*rate));
    renderTotals();
  }
  function renderTotals(){
    var total=totalFactura(),bcv=tasaBcv(),rate=tasaCompra(),r=paidCalc(total);
    if(el('pe-subtotal'))el('pe-subtotal').textContent=fmt(totalBase());
    if(el('pe-iva-total'))el('pe-iva-total').textContent=fmt(totalIva());
    if(el('pe-total'))el('pe-total').textContent=fmt(total);
    if(el('pe-total-usd-prov'))el('pe-total-usd-prov').textContent=fmt(rate>0?total/rate:0)+' $';
    if(el('pe-total-usd-bcv'))el('pe-total-usd-bcv').textContent=fmt(bcv>0?total/bcv:0)+' $';
    if(el('pe-pagado'))el('pe-pagado').textContent=fmt(r.pagado);
    if(el('pe-pagado-usd'))el('pe-pagado-usd').textContent=fmt(r.pagadoUSDProv)+' $';
    if(el('pe-pagado-bcv'))el('pe-pagado-bcv').textContent=fmt(r.pagadoUSDBcv)+' $';
    if(el('pe-pendiente'))el('pe-pendiente').textContent=fmt(r.pendiente);
    if(el('pe-pendiente-usd'))el('pe-pendiente-usd').textContent=fmt(r.pendienteUSD)+' $';
    if(el('pe-mixto-row'))el('pe-mixto-row').style.display=(el('pe-tipo')?.value==='Mixto')?'':'none';
  }
  function updateCurrency(){
    var m=moneda(),bcv=tasaBcv();
    if(el('pe-tasa-compra')){
      if(m==='BCV')el('pe-tasa-compra').value=bcv>0?String(bcv).replace('.',','):'';
      else if(!n(el('pe-tasa-compra').value))el('pe-tasa-compra').value=bcv>0?String(bcv).replace('.',','):'';
    }
    if(el('pe-costo'))el('pe-costo').placeholder=m==='BCV'?'Costo unitario en USD al BCV':'Costo unitario en USDT / paralelo';
    renderPreview();renderTotals();
  }
  function changeType(){
    var t=el('pe-tipo').value;
    el('pe-credit-fields').style.display=(t==='Credito'||t==='Mixto')?'':'none';
    el('pe-mixed-fields').style.display=t==='Mixto'?'':'none';
    renderTotals();
  }
  function closeSuggest(id){var box=el(id);if(box){box.classList.remove('show');box.innerHTML=''}}
  function searchSupplier(){
    el('pe-proveedor-id').value='';
    var q=(el('pe-proveedor').value||'').trim().toLowerCase(),box=el('pe-supplier-results');
    if(!q){closeSuggest('pe-supplier-results');return}
    supplierMatches=(global.db.proveedores||[]).filter(function(s){return [s.nombre,s.documento,s.rif,s.telefono].some(function(v){return String(v||'').toLowerCase().includes(q)})}).slice(0,10);
    box.innerHTML=supplierMatches.map(function(s,i){return '<button type="button" data-pe-supplier="'+i+'">'+esc(s.nombre)+(s.documento?' · '+esc(s.documento):'')+'</button>'}).join('');
    box.classList.toggle('show',supplierMatches.length>0);
  }
  function selectSupplier(i){
    var s=supplierMatches[i];if(!s)return;
    el('pe-proveedor').value=s.nombre;el('pe-proveedor-id').value=s.id;closeSuggest('pe-supplier-results');
    el('pe-product-search').focus();
  }
  function productSearch(){
    var q=(el('pe-product-search').value||'').trim().toLowerCase(),box=el('pe-product-results');
    selectedProductId='';if(el('pe-product-id'))el('pe-product-id').value='';
    if(!q){closeSuggest('pe-product-results');return}
    var words=q.split(/\s+/).filter(Boolean);
    productMatches=(global.db.productos||[]).filter(function(p){
      var fields=[p.codigo,p.barra,p.codigoBarras,p.nombre,p.descripcion,p.categoria,p.subcategoria,p.marca,p.sku,p.codigoOEM,p.referencia];
      var vals=fields.map(function(v){return String(v||'').toLowerCase()});
      return vals.some(function(v){return v===q||v.includes(q)})||words.length>1&&words.every(function(w){return vals.some(function(v){return v.includes(w)})});
    }).slice(0,15);
    box.innerHTML=productMatches.map(function(p,i){return '<button type="button" data-pe-product="'+i+'"><b>'+esc(p.codigo||p.sku||'SIN CÓDIGO')+'</b> — '+esc(p.nombre||p.descripcion||'')+' · Stock: '+fmt(p.stock||0)+' · Costo: '+fmt(p.costo||0)+'</button>'}).join('');
    box.classList.toggle('show',productMatches.length>0);
  }
  function selectProduct(i){
    var p=productMatches[i];if(!p)return;
    selectedProductId=String(p.id);el('pe-product-search').value=(p.codigo||p.sku||p.nombre||'');
    el('pe-product-id').value=String(p.id);closeSuggest('pe-product-results');
    if(!n(el('pe-costo').value))el('pe-costo').value=String(n(p.costo||0)).replace('.',',');
    renderPreview();el('pe-cantidad').focus();el('pe-cantidad').select();
  }
  function selectedProduct(){
    return getProductById(el('pe-product-id')?.value)||getProductByCode(el('pe-product-search')?.value);
  }
  function renderPreview(){
    var p=selectedProduct();
    if(!p){if(el('pe-prev'))el('pe-prev').value='';if(el('pe-pond'))el('pe-pond').value='';return}
    var oldCost=n(p.costo),stock=n(p.stock),qty=n(el('pe-cantidad')?.value)||1,cost=n(el('pe-costo')?.value),bcv=tasaBcv(),rate=tasaCompra();
    var costBCV=bcv>0?cost*rate/bcv:cost;
    var weighted=stock+qty>0?(oldCost*stock+costBCV*qty)/(stock+qty):costBCV;
    el('pe-prev').value=fmt(oldCost);
    el('pe-pond').value=fmt(weighted);
  }
  function addLine(){
    var p=selectedProduct();
    if(!p){
      var matches=(global.db.productos||[]).filter(function(x){return String(x.codigo||'').toLowerCase()===String(el('pe-product-search').value||'').trim().toLowerCase()});
      if(matches.length===1){p=matches[0];selectedProductId=String(p.id);el('pe-product-id').value=String(p.id)}
    }
    if(!p)return global.toast('Busque y seleccione un producto existente del inventario');
    var qty=n(el('pe-cantidad').value),cost=n(el('pe-costo').value),bcv=tasaBcv(),rate=tasaCompra();
    if(qty<=0)return global.toast('La cantidad debe ser mayor a cero');
    if(cost<=0)return global.toast('Ingrese un costo unitario mayor a cero');
    if(bcv<=0)return global.toast('No hay una tasa BCV válida. Actualice la tasa antes de registrar la entrada.');
    if(rate<=0)return global.toast('Indique la tasa de compra válida.');
    var costVES=r2(cost*rate),costBCV=r2(costVES/bcv),subtotal=r2(costVES*qty),exempt=!!el('pe-exento').checked,ivaPct=exempt?0:ivaRate(),iva=r2(subtotal*ivaPct/100);
    tempLines.push({id:String(p.id),codigo:String(p.codigo||p.sku||''),descripcion:String(p.nombre||p.descripcion||''),cantidad:qty,qty:qty,costo:r2(cost),costoVES:costVES,costoBCV:costBCV,exentoIva:exempt,ivaPct:ivaPct,subtotalBs:subtotal,total:subtotal,ivaBs:iva,iva:iva,totalLinea:r2(subtotal+iva)});
    renderLines();
    el('pe-product-search').value='';el('pe-product-id').value='';selectedProductId='';el('pe-cantidad').value='1';el('pe-costo').value='';el('pe-prev').value='';el('pe-pond').value='';el('pe-exento').checked=false;closeSuggest('pe-product-results');el('pe-product-search').focus();
  }
  function toggleExempt(i,checked){
    var l=tempLines[i];if(!l)return;l.exentoIva=!!checked;l.ivaPct=checked?0:ivaRate();l.ivaBs=l.iva=l.subtotalBs*l.ivaPct/100;l.ivaBs=l.iva=r2(l.ivaBs);l.totalLinea=r2(l.subtotalBs+l.ivaBs);renderLines();
  }
  function removeLine(i){tempLines.splice(i,1);renderLines()}
  function renderLines(){
    if(!el('pe-lines'))return;
    el('pe-lines').innerHTML=tempLines.map(function(l,i){return '<tr><td>'+esc(l.codigo)+'</td><td>'+esc(l.descripcion)+'</td><td>'+fmt(l.cantidad)+'</td><td>'+fmt(l.costo)+'</td><td>'+fmt(l.costoBCV)+'</td><td><input type="checkbox" '+(l.exentoIva?'checked':'')+' data-pe-exempt="'+i+'" aria-label="Exento de IVA"></td><td>'+fmt(l.subtotalBs)+'</td><td>'+fmt(l.ivaBs)+'</td><td>'+fmt(l.totalLinea)+'</td><td><button class="btn" type="button" data-pe-remove="'+i+'" title="Quitar línea">✕</button></td></tr>'}).join('')||'<tr><td colspan="10" style="text-align:center;color:#667085;padding:18px">Sin productos agregados</td></tr>';
    renderTotals();
  }
  function resetForm(){
    tempLines=[];supplierMatches=[];productMatches=[];selectedProductId='';
    el('pe-nro').value=global.id('CMP','compra');el('pe-fecha').value=new Date().toISOString().slice(0,10);
    el('pe-factura').value='';el('pe-proveedor').value='';el('pe-proveedor-id').value='';el('pe-obs').value='';
    el('pe-tasa-bcv').value=tasaBcv()>0?String(tasaBcv()).replace('.',','):'';
    el('pe-moneda').value='USDT';el('pe-tasa-compra').value=tasaBcv()>0?String(tasaBcv()).replace('.',','):'';
    el('pe-costeo').value=global.db.config?.costeoInventario||'promedio';el('pe-tipo').value='Contado';
    el('pe-dias').value=String(global.db.config?.diasCreditoCompra||30);el('pe-pago-bs').value='';el('pe-pago-usd').value='';
    el('pe-product-search').value='';el('pe-product-id').value='';el('pe-cantidad').value='1';el('pe-costo').value='';
    el('pe-prev').value='';el('pe-pond').value='';el('pe-exento').checked=false;el('pe-dec').value=String(global.db.config?.decimalesCosto||2);
    closeSuggest('pe-supplier-results');closeSuggest('pe-product-results');changeType();updateCurrency();renderLines();
  }
  function formHtml(){
    return '<div class="purchase-layout">'+
      '<div class="purchase-col">'+
        '<fieldset class="purchase-panel"><legend>1. Datos de la Entrada por Compra</legend><div class="purchase-formgrid">'+
          field('N° de entrada','<input id="pe-nro" readonly>')+
          field('Fecha','<input id="pe-fecha" type="date" required>')+
          field('Nro. de factura del proveedor','<input id="pe-factura" placeholder="Número de factura">','full')+
          field('Proveedor','<div class="purchase-suggest"><input id="pe-proveedor" autocomplete="off" placeholder="Buscar por nombre, RIF o teléfono" required><input id="pe-proveedor-id" type="hidden"><div id="pe-supplier-results" class="purchase-suggestions"></div></div>','full')+
          field('Tasa BCV del día (VES/USD)','<input id="pe-tasa-bcv" inputmode="decimal" placeholder="Tasa oficial" required>')+
          field('Moneda de compra','<select id="pe-moneda"><option value="USDT">USDT / Paralelo</option><option value="BCV">BCV</option></select>')+
          field('Tasa de compra','<input id="pe-tasa-compra" inputmode="decimal" placeholder="Tasa de la factura" required>')+
          field('Costeo del inventario','<select id="pe-costeo"><option value="promedio">Promedio ponderado</option><option value="ultima">Última compra</option></select>')+
          field('Observaciones','<textarea id="pe-obs" placeholder="Notas, recepción, diferencias, etc."></textarea>','full')+
        '</div><div class="purchase-note">Los importes se convierten a bolívares con la tasa de compra y se expresan también en USD BCV para mantener trazabilidad.</div></fieldset>'+
        '<fieldset class="purchase-panel"><legend>2. Tipo de compra y condiciones de pago</legend><div class="purchase-formgrid">'+
          field('Tipo de compra','<select id="pe-tipo"><option value="Contado">Contado</option><option value="Credito">Crédito</option><option value="Mixto">Mixto</option></select>')+
          '<div id="pe-credit-fields" class="purchase-field" style="display:none"><label>Días de crédito</label><input id="pe-dias" type="number" min="1" step="1" value="30"></div>'+
          '<div id="pe-mixed-fields" class="purchase-field full" style="display:none"><div class="purchase-row">'+field('Monto pagado (Bs.)','<input id="pe-pago-bs" inputmode="decimal" placeholder="0,00">')+field('Monto pagado (USD proveedor)','<input id="pe-pago-usd" inputmode="decimal" placeholder="0,00">')+'</div><div class="purchase-note">Al editar cualquiera de los importes, el otro se convierte usando la tasa de compra.</div></div>'+
        '</div></fieldset>'+
        '<fieldset class="purchase-panel"><legend>3. Agregar producto</legend><div class="purchase-formgrid">'+
          field('Producto (código, nombre, marca o referencia)','<div class="purchase-suggest"><input id="pe-product-search" autocomplete="off" placeholder="Escriba para buscar en el inventario"><input id="pe-product-id" type="hidden"><div id="pe-product-results" class="purchase-suggestions"></div></div>','full')+
          field('Cantidad recibida','<input id="pe-cantidad" type="number" min="0.001" step="any" value="1">')+
          field('Costo unitario proveedor','<input id="pe-costo" inputmode="decimal" placeholder="Costo en la moneda de compra">')+
          field('Exento de IVA','<label style="display:flex;align-items:center;gap:6px;font-weight:400"><input id="pe-exento" type="checkbox" style="width:16px"> Sí, esta línea está exenta</label>')+
          field('Costo anterior (USD BCV)','<input id="pe-prev" readonly>')+
          field('Costo ponderado proyectado','<input id="pe-pond" readonly>')+
          field('Decimales','<select id="pe-dec"><option value="2">2 decimales</option><option value="3">3 decimales</option><option value="4">4 decimales</option></select>')+
        '</div><div class="purchase-actions"><button class="btn primary" id="pe-add-line" type="button">➕ Agregar a la entrada (Enter)</button></div></fieldset>'+
      '</div>'+
      '<div class="purchase-col"><fieldset class="purchase-panel"><legend>4. Detalle de la entrada</legend><div class="purchase-lines-wrap"><table class="purchase-lines"><thead><tr><th>Código</th><th>Producto</th><th>Cant.</th><th>Costo prov.</th><th>Costo USD BCV</th><th>Exento IVA</th><th>Subtotal Bs.</th><th>IVA</th><th>Total línea</th><th></th></tr></thead><tbody id="pe-lines"></tbody></table></div>'+
        '<div class="purchase-totals">'+
          totalCard('Subtotal (Bs.)','pe-subtotal')+totalCard('IVA total (Bs.)','pe-iva-total')+
          totalCard('Total factura (Bs.)','pe-total',true)+totalCard('Total factura (USD proveedor)','pe-total-usd-prov')+
          totalCard('Total factura (USD BCV)','pe-total-usd-bcv')+totalCard('Total pagado (Bs.)','pe-pagado')+
          totalCard('Total pagado (USD proveedor)','pe-pagado-usd')+totalCard('Total pagado (USD BCV)','pe-pagado-bcv')+
          totalCard('Pendiente por pagar (Bs.)','pe-pendiente')+totalCard('Pendiente por pagar (USD BCV)','pe-pendiente-usd')+
          '<div id="pe-mixto-row" class="purchase-total" style="display:none">Pago mixto: se calcula en Bs. y USD según la tasa de compra.</div>'+
        '</div><div class="purchase-actions"><button class="btn primary" id="pe-save" type="button">💾 Guardar entrada y recibir inventario</button><button class="btn" id="pe-save-new" type="button">💾 Guardar y nueva entrada</button><button class="btn" id="pe-cancel" type="button">Cancelar</button></div>'+
        '<div class="purchase-note">Al guardar, la entrada queda recibida, actualiza existencias y costo según el método elegido, registra CxP si queda saldo y conserva las tasas utilizadas.</div>'+
      '</fieldset></div></div>';
  }
  function field(label,html,cls){return '<div class="purchase-field '+(cls||'')+'"><label>'+label+'</label>'+html+'</div>'}
  function totalCard(label,id,strong){return '<div class="purchase-total '+(strong?'strong':'')+'">'+label+'<b id="'+id+'">0,00</b></div>'}
  function bindForm(){
    el('pe-proveedor').addEventListener('input',searchSupplier);
    el('pe-proveedor').addEventListener('keydown',function(e){if(e.key==='Escape')closeSuggest('pe-supplier-results');if(e.key==='ArrowDown'&&supplierMatches.length){e.preventDefault();selectSupplier(0)}});
    el('pe-product-search').addEventListener('input',productSearch);
    el('pe-product-search').addEventListener('keydown',function(e){if(e.key==='Escape'){closeSuggest('pe-product-results');return}if(e.key==='Enter'){e.preventDefault();if(productMatches.length&&!selectedProductId)selectProduct(0);else addLine()}});
    el('pe-cantidad').addEventListener('input',renderPreview);el('pe-costo').addEventListener('input',renderPreview);
    el('pe-moneda').addEventListener('change',updateCurrency);el('pe-tasa-bcv').addEventListener('input',function(){if(moneda()==='BCV')updateCurrency();else{renderPreview();renderTotals()}});
    el('pe-tasa-compra').addEventListener('input',function(){renderPreview();renderTotals()});
    el('pe-tipo').addEventListener('change',changeType);
    el('pe-pago-bs').addEventListener('input',function(){syncMixed('bs')});el('pe-pago-usd').addEventListener('input',function(){syncMixed('usd')});
    el('pe-dec').addEventListener('change',function(){global.db.config.decimalesCosto=dec();global.save('purchase-settings');renderLines();renderPreview()});
    el('pe-add-line').addEventListener('click',addLine);
    el('pe-lines').addEventListener('change',function(e){var t=e.target.closest('[data-pe-exempt]');if(t)toggleExempt(Number(t.getAttribute('data-pe-exempt')),t.checked)});
    el('pe-lines').addEventListener('click',function(e){var t=e.target.closest('[data-pe-remove]');if(t)removeLine(Number(t.getAttribute('data-pe-remove')))});
    el('pe-save').addEventListener('click',function(){savePurchase(false)});
    el('pe-save-new').addEventListener('click',function(){savePurchase(true)});
    el('pe-cancel').addEventListener('click',closePurchase);
    var body=el('modalBody');
    if(body&&!body.dataset.purchaseSuggestionsBound){body.dataset.purchaseSuggestionsBound='1';body.addEventListener('click',function(e){var s=e.target.closest('[data-pe-supplier]');if(s){selectSupplier(Number(s.getAttribute('data-pe-supplier')));return}var p=e.target.closest('[data-pe-product]');if(p)selectProduct(Number(p.getAttribute('data-pe-product')))})}
  }
  function openPurchase(){
    var modal=el('modal');modal.classList.add('purchase-modal');
    global.openModal('Entrada por Compra',formHtml(),'<span style="font-size:11px;color:#667085">SIFER · Entrada de mercancía, costo real e IVA</span>');
    resetForm();bindForm();el('pe-product-search').focus();
  }
  function closePurchase(){el('modal').classList.remove('purchase-modal');global.closeModal()}
  function savePurchase(newAfter){
    var supplierId=el('pe-proveedor-id').value,supplier=(global.db.proveedores||[]).find(function(s){return String(s.id)===String(supplierId)});
    var supplierName=(el('pe-proveedor').value||'').trim();
    if(!tempLines.length)return global.toast('Agregue al menos un producto a la entrada');
    if(!supplierName||!supplier)return global.toast('Seleccione un proveedor existente del maestro de proveedores');
    var date=el('pe-fecha').value,bcv=n(el('pe-tasa-bcv').value),rate=tasaCompra(),type=el('pe-tipo').value,total=totalFactura(),res=paidCalc(total);
    if(!date)return global.toast('Indique la fecha de la entrada');
    if(bcv<=0)return global.toast('No hay una tasa BCV válida. Actualice la tasa antes de registrar la entrada.');
    if(rate<=0)return global.toast('Indique una tasa de compra válida');
    if(total<=0)return global.toast('El total de la entrada debe ser mayor a cero');
    if(type==='Mixto'&&res.pagado<=0)return global.toast('Indique el monto del pago mixto');
    if(type==='Contado'&&!global.cajaActual().abierta)return global.toast('Abra la caja antes de registrar una entrada de contado');
    if(type==='Mixto'&&res.pagado>0&&!global.cajaActual().abierta)return global.toast('Abra la caja antes de registrar el pago de una entrada mixta');
    if(type==='Mixto'&&n(el('pe-pago-bs').value)>total+0.01)return global.toast('El pago no puede superar el total de la factura');
    var numero=el('pe-nro').value,paid=type==='Contado'?total:res.pagado,pending=r2(total-paid);
    var dueDate='';if(type!=='Contado'){var due=new Date(date+'T12:00:00');due.setDate(due.getDate()+Math.max(1,Math.floor(n(el('pe-dias').value)||30)));dueDate=due.toISOString().slice(0,10)}
    var purchase={
      numero:numero,fecha:date,proveedor:supplierName,proveedorId:supplier.id,nroFactura:el('pe-factura').value.trim(),
      observaciones:el('pe-obs').value.trim(),cost_supplier_currency:moneda(),purchase_rate_type:moneda(),purchase_rate_value:rate,
      bcv_rate_at_purchase:bcv,totalUSDProv:r2(total/rate),totalUSDBcv:r2(total/bcv),pagadoUSDProv:r2(paid/rate),
      pagadoUSDBcv:r2(paid/bcv),pendienteUSD:r2(pending/bcv),costeo:el('pe-costeo').value,tipo:type,
      diasCredito:type==='Contado'?0:Math.max(1,Math.floor(n(el('pe-dias').value)||30)),vencimiento:dueDate,
      pagos:type==='Mixto'?[{moneda:'Bs',monto:n(el('pe-pago-bs').value)},{moneda:'USD',monto:n(el('pe-pago-usd').value)}].filter(function(p){return p.monto>0}):[],
      pagado:paid,pendiente:pending,total:total,subtotal:totalBase(),impuesto:totalIva(),estatus:'Recibida',
      cajaId:global.cajaActual().id,operadorId:global.usuarioActual().id,lineas:tempLines.map(function(l){return Object.assign({},l)})
    };
    // Inventario y costo se actualizan solo en la entrada que se guarda.
    purchase.lineas.forEach(function(line){
      var p=getProductById(line.id);if(!p)return;
      var stock=n(p.stock),qty=n(line.cantidad),cost=n(line.costoBCV);
      p.stock=stock+qty;
      if(cost>0){
        if(purchase.costeo==='promedio'&&stock>0)p.costo=r2((n(p.costo)*stock+cost*qty)/p.stock);
        else p.costo=r2(cost);
      }
    });
    global.db.compras=Array.isArray(global.db.compras)?global.db.compras:[];
    global.db.compras.push(purchase);
    if(pending>0){
      global.db.cxp=Array.isArray(global.db.cxp)?global.db.cxp:[];
      global.db.cxp.push({id:global.id('CXP','cxp'),fecha:date,documento:numero,proveedorId:supplier.id,proveedor:supplierName,total:total,saldo:pending,estado:'Pendiente',vencimiento:dueDate,tipo:type});
      supplier.saldo=n(supplier.saldo)+pending;
    }
    if(paid>0)global.cajaActual().saldo-=paid;
    global.db.movimientos=Array.isArray(global.db.movimientos)?global.db.movimientos:[];
    global.db.movimientos.push({fecha:new Date().toISOString(),tipo:'Entrada por Compra',documento:numero,detalle:supplierName,monto:paid?-paid:0,cajaId:global.cajaActual().id});
    global.db.config.costeoInventario=purchase.costeo;global.db.config.diasCreditoCompra=purchase.diasCredito;global.db.config.decimalesCosto=dec();
    global.save('purchase-created');
    selectedPurchaseNo=numero;
    closePurchase();global.renderView();global.toast(numero+' guardada; inventario recibido y costo actualizado.');
    if(newAfter)openPurchase();
  }
  function filterHistory(){
    var q=(el('purchase-search')?.value||'').trim().toLowerCase(),state=el('purchase-filter')?.value||'Todos';
    return (global.db.compras||[]).filter(function(p){
      var s=[p.numero,p.nroFactura,p.proveedor].join(' ').toLowerCase();
      return (!q||s.includes(q))&&(state==='Todos'||(state==='Con saldo'&&n(p.saldo)>0)||(state==='Pagada'&&n(p.saldo)<=0));
    }).sort(function(a,b){return String(b.fecha||'').localeCompare(String(a.fecha||''))});
  }
  function detailHtml(p){
    if(!p)return '<div class="purchase-detail" style="color:#667085">Seleccione una entrada para ver el detalle.</div>';
    return '<div class="purchase-detail"><b>'+esc(p.numero)+'</b> · '+esc(p.fecha)+' · '+esc(p.proveedor)+'<br>'+
      'Factura proveedor: '+esc(p.nroFactura||'—')+' · Tipo: '+esc(p.tipo||'Contado')+' · Estatus: '+esc(p.estatus||'Recibida')+'<br>'+
      'Moneda: '+esc(p.cost_supplier_currency||'—')+' · Tasa compra: '+fmt(p.purchase_rate_value)+' · Tasa BCV: '+fmt(p.bcv_rate_at_purchase)+'<br>'+
      'Total: <b>'+fmt(p.total)+' Bs.</b> · Pagado: '+fmt(p.pagado)+' Bs. · Saldo: '+fmt(p.saldo)+' Bs.+'<br>'+
      'USD proveedor: '+fmt(p.totalUSDProv)+' $ · USD BCV: '+fmt(p.totalUSDBcv)+' $ · Costeo: '+esc(p.costeo||'promedio')+
      (p.diasCredito?' · Crédito: '+esc(p.diasCredito)+' días':'')+(p.observaciones?'<br>Observaciones: '+esc(p.observaciones):'')+
      '<div class="purchase-detail-grid"><table><thead><tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Costo USD BCV</th><th>Subtotal Bs.</th><th>IVA</th><th>Total</th></tr></thead><tbody>'+
      (p.lineas||[]).map(function(l){return '<tr><td>'+esc(l.codigo||'')+'</td><td>'+esc(l.descripcion||'')+'</td><td>'+fmt(l.cantidad||l.qty)+'</td><td>'+fmt(l.costoBCV||l.costo)+'</td><td>'+fmt(l.subtotalBs||l.total)+'</td><td>'+fmt(l.ivaBs||l.iva)+'</td><td>'+fmt(l.totalLinea||((n(l.total)||0)+(n(l.iva)||0)))+'</td></tr>'}).join('')+'</tbody></table></div></div>';
  }
  function selectPurchase(numero){
    selectedPurchaseNo=numero;var p=(global.db.compras||[]).find(function(x){return x.numero===numero});if(!p)return;
    if(el('purchase-detail'))el('purchase-detail').innerHTML=detailHtml(p);
    if(el('purchase-table'))el('purchase-table').querySelectorAll('tr[data-purchase]').forEach(function(tr){tr.classList.toggle('selected',tr.getAttribute('data-purchase')===numero)});
  }
  async function hydratePurchases(){
    if(hydrating||!navigator.onLine||Date.now()-lastHydrateAt<30000)return;
    hydrating=true;lastHydrateAt=Date.now();
    try{
      var response=await fetch('/api/sifer-data?query=purchases',{cache:'no-store'});
      if(response.ok){var data=await response.json();if(data.ok&&Array.isArray(data.items)){
        var local=Array.isArray(global.db.compras)?global.db.compras:[],remote=data.items,remoteIds=new Set(remote.map(function(p){return String(p.numero)}));
        global.db.compras=remote.concat(local.filter(function(p){return !remoteIds.has(String(p.numero))}));
        var cxpResponse=await fetch('/api/sifer-data?query=cxp',{cache:'no-store'});
        if(cxpResponse.ok){var cxpData=await cxpResponse.json();if(cxpData.ok&&Array.isArray(cxpData.items)){
          var localCxp=Array.isArray(global.db.cxp)?global.db.cxp:[],remoteDocs=new Set(cxpData.items.map(function(a){return String(a.documento)}));
          global.db.cxp=cxpData.items.map(function(a){var old=localCxp.find(function(x){return String(x.documento)===String(a.documento)});return {...old,...a,id:old?.id||('CXP-'+String(a.documento)),proveedorId:a.proveedorId||old?.proveedorId}}).concat(localCxp.filter(function(a){return !remoteDocs.has(String(a.documento))}));
        }}
        if(el('main')&&document.querySelector('#main h2')&&document.querySelector('#main h2').textContent.includes('Entradas por Compra'))global.renderView();
      }}
    }catch(e){}finally{hydrating=false}
  }
  function comprasView(){
    hydratePurchases();
    var all=global.db.compras||[],total=all.reduce(function(s,p){return s+n(p.total)},0),saldo=all.reduce(function(s,p){return s+n(p.saldo)},0);
    var rows=filterHistory();if(!selectedPurchaseNo&&rows.length)selectedPurchaseNo=rows[0].numero;
    return '<div class="pagehead"><div><h2>Compras · Entradas por Compra</h2><div class="sub">Recepción de mercancía, costo real, IVA, tasas de conversión y cuentas por pagar.</div></div><button class="btn primary" onclick="openPurchase()">➕ Entrada por Compra</button></div>'+
      '<div class="cards"><div class="card">Total de compras<b>'+money(total)+'</b><span>'+all.length+' documentos recibidos</span></div><div class="card">Cuentas por pagar<b>'+money(saldo)+'</b><span>saldo de entradas pendientes</span></div></div>'+
      '<div class="panel"><div class="panelhead">Historial de Entradas por Compra</div><div class="panelbody">'+
      '<div class="purchase-history-tools"><input id="purchase-search" placeholder="Buscar N° entrada, factura o proveedor" oninput="SIFERPurchaseEntry.refreshHistory()"><select id="purchase-filter" onchange="SIFERPurchaseEntry.refreshHistory()"><option>Todos</option><option>Con saldo</option><option>Pagada</option></select>'+
      '<button class="btn" onclick="SIFERPurchaseEntry.exportHistory()">📄 Exportar CSV</button><button class="btn" onclick="SIFERPurchaseEntry.printSelected()">🖨️ Imprimir</button><button class="btn" onclick="SIFERPurchaseEntry.shareSelected()">↗ Compartir</button></div>'+
      '<div style="overflow:auto"><table id="purchase-table"><thead><tr><th>N° Entrada</th><th>Factura</th><th>Fecha</th><th>Proveedor</th><th>Total</th><th>Tipo</th><th>Pagado</th><th>Saldo</th><th>Estatus</th><th></th></tr></thead><tbody>'+
      rows.map(function(p){return '<tr data-purchase="'+esc(p.numero)+'" class="'+(p.numero===selectedPurchaseNo?'selected':'')+'"><td>'+esc(p.numero)+'</td><td>'+esc(p.nroFactura||'—')+'</td><td>'+esc(p.fecha||'')+'</td><td>'+esc(p.proveedor||'')+'</td><td>'+money(p.total)+'</td><td>'+esc(p.tipo||'Contado')+'</td><td>'+money(p.pagado)+'</td><td>'+money(p.saldo)+'</td><td>'+(n(p.saldo)>0?'Con saldo':'Pagada')+'</td><td><button class="btn" onclick="SIFERPurchaseEntry.selectPurchase(\''+String(p.numero).replace(/'/g,"\\'")+'\')">Ver</button></td></tr>'}).join('')||'<tr><td colspan="10" style="text-align:center;padding:18px;color:#667085">Todavía no hay entradas por compra registradas.</td></tr>'+
      '</tbody></table></div><div id="purchase-detail" class="purchase-panel" style="margin-top:10px">'+detailHtml(all.find(function(p){return p.numero===selectedPurchaseNo})||null)+'</div></div></div>';
  }
  function refreshHistory(){
    var table=el('purchase-table');if(!table)return;
    var rows=filterHistory();
    table.querySelector('tbody').innerHTML=rows.map(function(p){return '<tr data-purchase="'+esc(p.numero)+'" class="'+(p.numero===selectedPurchaseNo?'selected':'')+'"><td>'+esc(p.numero)+'</td><td>'+esc(p.nroFactura||'—')+'</td><td>'+esc(p.fecha||'')+'</td><td>'+esc(p.proveedor||'')+'</td><td>'+money(p.total)+'</td><td>'+esc(p.tipo||'Contado')+'</td><td>'+money(p.pagado)+'</td><td>'+money(p.saldo)+'</td><td>'+(n(p.saldo)>0?'Con saldo':'Pagada')+'</td><td><button class="btn" onclick="SIFERPurchaseEntry.selectPurchase(\''+String(p.numero).replace(/'/g,"\\'")+'\')">Ver</button></td></tr>'}).join('')||'<tr><td colspan="10" style="text-align:center;padding:18px;color:#667085">No hay resultados para la búsqueda.</td></tr>';
  }
  function exportHistory(){
    var rows=filterHistory(),header=['Entrada','Factura proveedor','Fecha','Proveedor','Moneda','Tasa compra','Tasa BCV','Tipo','Subtotal Bs','IVA Bs','Total Bs','Pagado Bs','Saldo Bs','USD proveedor','USD BCV','Observaciones'];
    var csv=[header].concat(rows.map(function(p){return [p.numero,p.nroFactura,p.fecha,p.proveedor,p.cost_supplier_currency,p.purchase_rate_value,p.bcv_rate_at_purchase,p.tipo,p.subtotal,p.impuesto,p.total,p.pagado,p.saldo,p.totalUSDProv,p.totalUSDBcv,p.observaciones]})).map(function(row){return row.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n');
    var blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='entradas-por-compra.csv';a.click();URL.revokeObjectURL(url);
  }
  function printSelected(){
    var p=(global.db.compras||[]).find(function(x){return x.numero===selectedPurchaseNo});
    if(!p)return global.toast('Seleccione una entrada para imprimir');
    var area=el('thermal-print-area');area.style.display='block';area.innerHTML='<h2>ENTRADA POR COMPRA</h2><b>'+esc(p.numero)+'</b><br>Fecha: '+esc(p.fecha)+'<br>Proveedor: '+esc(p.proveedor)+'<br>Factura: '+esc(p.nroFactura||'—')+'<hr>'+(p.lineas||[]).map(function(l){return esc(l.codigo)+' '+esc(l.descripcion)+'<br>'+fmt(l.cantidad)+' x '+fmt(l.costoBCV)+' = '+fmt(l.totalLinea)}).join('<br>')+'<hr>Subtotal: '+fmt(p.subtotal)+'<br>IVA: '+fmt(p.impuesto)+'<br><b>TOTAL Bs.: '+fmt(p.total)+'</b><br>Pagado: '+fmt(p.pagado)+'<br>Saldo: '+fmt(p.saldo)+'<br>Tasa BCV: '+fmt(p.bcv_rate_at_purchase)+'<br>Observaciones: '+esc(p.observaciones||'');
    global.print();setTimeout(function(){area.style.display='none';area.innerHTML=''},500);
  }
  async function shareSelected(){
    var p=(global.db.compras||[]).find(function(x){return x.numero===selectedPurchaseNo});if(!p)return global.toast('Seleccione una entrada para compartir');
    var txt='Entrada por Compra '+p.numero+'\nFecha: '+p.fecha+'\nProveedor: '+p.proveedor+'\nFactura: '+(p.nroFactura||'—')+'\nTotal: '+fmt(p.total)+' Bs.\nPagado: '+fmt(p.pagado)+' Bs.\nSaldo: '+fmt(p.saldo)+' Bs.';
    try{if(navigator.share)await navigator.share({title:'Entrada por Compra '+p.numero,text:txt});else if(navigator.clipboard){await navigator.clipboard.writeText(txt);global.toast('Resumen copiado') }else global.toast(txt)}catch(e){}
  }
  function init(){var body=el('main');if(body&&!body.dataset.purchaseSelectBound){body.dataset.purchaseSelectBound='1';body.addEventListener('click',function(e){var tr=e.target.closest('tr[data-purchase]');if(tr&&!e.target.closest('button'))selectPurchase(tr.getAttribute('data-purchase'))})}}
  global.SIFERPurchaseEntry={openPurchase:openPurchase,savePurchase:savePurchase,closePurchase:closePurchase,comprasView:comprasView,selectPurchase:selectPurchase,refreshHistory:refreshHistory,exportHistory:exportHistory,printSelected:printSelected,shareSelected:shareSelected,hydratePurchases:hydratePurchases};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})(window);
