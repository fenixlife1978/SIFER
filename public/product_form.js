/* SIFER360 — formulario comercial ampliado inspirado en POSSystem-FERRETERIA.
 * Guarda metadatos completos en Turso y mantiene el inventario como dato operativo independiente.
 */
(function(global){
  'use strict';
  var editingId = '';
  var supplierRows = [];
  var formSource = null;
  var formRepuestoSource = null;
  var fieldIds = [
    'fp-codigo','fp-sku','fp-barra','fp-codfab','fp-desc','fp-descCorta','fp-modelo','fp-ref',
    'fp-marca','fp-oem','fp-cat','fp-subcat','fp-nroParte','fp-compat','fp-costo','fp-gastos',
    'fp-costoRealUSD','fp-costoRealBs','fp-margen','fp-precioUSD','fp-precioBs',
    'fp-mayorUSD','fp-mayorBs','fp-mayorMargen','fp-ofertaUSD','fp-ofertaBs','fp-ofertaMargen',
    'fp-promoUSD','fp-promoBs','fp-promoMargen','fp-unidad','fp-stockInicial','fp-min','fp-max',
    'fp-reorden','fp-ubicacion','fp-presentacion','fp-contenido','fp-subpresentacion','fp-contenidoFraccion',
    'fp-ivaRate','fp-fabricante','fp-mpn','fp-nota','fp-imagen','fp-descMax'
  ];
  var checkIds = ['fp-lotes','fp-vencimiento','fp-seriales','fp-negativo','fp-auditoria','fp-ivaAplicar','fp-ivaIncluido','fp-igtf','fp-inactivo','fp-excludeGap'];

  function el(id){ return document.getElementById(id); }
  function text(v){ return String(v == null ? '' : v); }
  function n(v){ var x=Number(String(v == null ? '' : v).replace(',','.')); return Number.isFinite(x)?x:0; }
  function rate(){ return n(global.db && global.db.config && global.db.config.bcv && global.db.config.bcv.rate); }
  function val(p,key,alt){ return p && p[key] != null ? p[key] : (alt == null ? '' : alt); }
  function input(id,label,value,type,extra){
    type=type||'text';
    var numeric=type==='number'?' inputmode="decimal" step="any"':'';
    return '<div class="field"><label for="'+id+'">'+label+'</label><input id="'+id+'" type="'+type+'" value="'+global.esc(text(value))+'"'+numeric+' '+(extra||'')+'></div>';
  }
  function check(id,label,checked){
    return '<label class="check-group" style="display:flex;align-items:center;gap:6px;margin:6px 0"><input id="'+id+'" type="checkbox" '+(checked?'checked':'')+'> '+label+'</label>';
  }
  function area(id,label,value,extra){
    return '<div class="field full"><label for="'+id+'">'+label+'</label><textarea id="'+id+'" rows="3" '+(extra||'')+'>'+global.esc(text(value))+'</textarea></div>';
  }
  function section(title,html){ return '<fieldset class="panel" style="margin:8px 0"><legend>'+title+'</legend><div class="formgrid">'+html+'</div></fieldset>'; }
  function optionList(key,defaults){
    var cfg=global.db.config||(global.db.config={});
    cfg.productFormOptions=cfg.productFormOptions||{};
    var values=(cfg.productFormOptions[key]||[]).slice();
    (defaults||[]).forEach(function(v){if(values.indexOf(v)<0)values.push(v);});
    (global.db.productos||[]).forEach(function(p){var v=p[key==='marcas'?'marca':key==='categorias'?'categoria':key==='unidades'?'unidad':key==='presentaciones'?'presentacion':'subcategoria'];if(v&&values.indexOf(v)<0)values.push(v);});
    return values;
  }
  function managed(id,label,value,key,defaults,allowRemove){
    var options=optionList(key,defaults);
    return '<div class="field"><label for="'+id+'">'+label+'</label><div style="display:flex;gap:4px;align-items:center"><input id="'+id+'" list="fp-list-'+key+'" value="'+global.esc(text(value))+'" style="min-width:0;flex:1"><datalist id="fp-list-'+key+'">'+options.map(function(v){return '<option value="'+global.esc(v)+'"></option>';}).join('')+'</datalist><button class="btn" type="button" data-fp-add-option="'+key+'" data-fp-field="'+id+'" title="Agregar opción">+</button>'+(allowRemove?'<button class="btn" type="button" data-fp-remove-option="'+key+'" data-fp-field="'+id+'" title="Eliminar opción">−</button>':'')+'</div></div>';
  }
  function manageOption(key,fieldId,remove){
    var cfg=global.db.config||(global.db.config={});
    cfg.productFormOptions=cfg.productFormOptions||{};
    var value=(el(fieldId)&&el(fieldId).value||'').trim();
    if(!value){alert('Escribe primero el valor que quieres '+(remove?'eliminar':'agregar')+'.');return;}
    var values=cfg.productFormOptions[key]||[];
    if(remove){
      if(!values.includes(value)){alert('Ese valor no está guardado como opción administrable.');return;}
      if(!confirm('¿Eliminar "'+value+'" de las opciones?'))return;
      cfg.productFormOptions[key]=values.filter(function(v){return v!==value;});
    }else{
      if(!values.includes(value))values.push(value);
      cfg.productFormOptions[key]=values;
    }
    var list=el('fp-list-'+key);if(list){if(remove){Array.from(list.options).forEach(function(o){if(o.value===value)o.remove();});}else if(!Array.from(list.options).some(function(o){return o.value===value;})){var option=document.createElement('option');option.value=value;list.appendChild(option);}}
    global.save('product-form-options');
  }
  function pane(id,title,html,active){
    return '<button type="button" class="fp-tab '+(active?'active':'')+'" data-fp-tab="'+id+'" style="padding:7px 10px;border:1px solid #b8c7d8;border-bottom:0;background:'+(active?'#fff':'#eaf0f7')+';border-radius:4px 4px 0 0;font-weight:700;font-size:11px">'+title+'</button><div id="'+id+'" class="fp-pane" style="display:'+(active?'block':'none')+';padding:8px;border:1px solid #c8d2df;background:#fff">'+html+'</div>';
  }
  function tierFields(prefix,title,d){
    return section(title,
      input('fp-'+prefix+'USD','Precio USD',val(d,prefix+'USD',0),'number','oninput="SIFERProductForm.priceTier(\''+prefix+'\',\'usd\')"')+
      input('fp-'+prefix+'Bs','Precio Bs.',val(d,prefix+'Bs',0),'number','oninput="SIFERProductForm.priceTier(\''+prefix+'\',\'bs\')"')+
      input('fp-'+prefix+'Margen','Margen (%)',val(d,prefix+'Margen',0),'number','oninput="SIFERProductForm.priceTier(\''+prefix+'\',\'margen\')"'));
  }
  function switchTab(id){
    document.querySelectorAll('.fp-pane').forEach(function(p){p.style.display=p.id===id?'block':'none';});
    document.querySelectorAll('[data-fp-tab]').forEach(function(b){
      var active=b.getAttribute('data-fp-tab')===id;
      b.style.background=active?'#fff':'#eaf0f7'; b.style.color=active?'#064b87':'#333';
    });
  }
  function renderSuppliers(){
    var box=el('fp-suppliers');
    if(!box)return;
    box.innerHTML=supplierRows.map(function(s,i){
      return '<tr><td>'+global.esc(s.nombre||'')+'</td><td>'+global.esc(s.codigo||'')+'</td><td>'+global.esc(s.costo==null?'':s.costo)+'</td><td>'+(s.principal?'Sí':'No')+'</td><td><button class="btn" type="button" data-fp-supplier-primary="'+i+'">Principal</button> <button class="btn" type="button" data-fp-supplier-remove="'+i+'">Quitar</button></td></tr>';
    }).join('')||'<tr><td colspan="5" style="text-align:center;color:#777;padding:10px">No hay proveedores asociados.</td></tr>';
    if(!box.dataset.bound){box.dataset.bound='1';box.addEventListener('click',function(ev){var primary=ev.target.closest('[data-fp-supplier-primary]');if(primary){var pi=Number(primary.getAttribute('data-fp-supplier-primary'));supplierRows=supplierRows.map(function(s,i){return Object.assign({},s,{principal:i===pi});});renderSuppliers();return;}var b=ev.target.closest('[data-fp-supplier-remove]');if(!b)return;supplierRows.splice(Number(b.getAttribute('data-fp-supplier-remove')),1);if(!supplierRows.some(function(s){return s.principal;})&&supplierRows.length)supplierRows[0].principal=true;renderSuppliers();});}
  }
  function addSupplier(){
    var nombre=prompt('Nombre del proveedor:');
    if(!nombre||!nombre.trim())return;
    var codigo=prompt('Código del producto en ese proveedor (opcional):')||'';
    var costo=prompt('Costo de compra referencial (opcional):')||'';
    supplierRows.push({nombre:nombre.trim(),codigo:codigo.trim(),costo:costo===''?null:n(costo),principal:supplierRows.length===0});
    renderSuppliers();
  }
  function pricing(from){
    var r=rate(),cost=n(el('fp-costo')&&el('fp-costo').value),extra=n(el('fp-gastos')&&el('fp-gastos').value);
    var real=cost*(1+extra/100);
    if(el('fp-costoRealUSD'))el('fp-costoRealUSD').value=real.toFixed(2);
    if(el('fp-costoRealBs'))el('fp-costoRealBs').value=r>0?(real*r).toFixed(2):'';
    var margin=n(el('fp-margen')&&el('fp-margen').value),usd=n(el('fp-precioUSD')&&el('fp-precioUSD').value),bs=n(el('fp-precioBs')&&el('fp-precioBs').value);
    if(from==='costo'||from==='margen')usd=real*(1+margin/100);
    else if(from==='bs'&&r>0)usd=bs/r;
    else if(from==='usd')bs=r>0?usd*r:bs;
    if(from==='usd'&&real>0)margin=((usd-real)/real)*100;
    if(from==='bs'&&real>0&&r>0)margin=((usd-real)/real)*100;
    if(from!=='margen'&&from!=='costo'&&from!=='bs'&&from!=='usd'){}
    if(from==='bs'||from==='usd'||from==='costo'||from==='margen'){
      if(el('fp-precioUSD'))el('fp-precioUSD').value=usd.toFixed(2);
      if(el('fp-precioBs'))el('fp-precioBs').value=r>0?(usd*r).toFixed(2):(from==='bs'?bs.toFixed(2):'');
      if(el('fp-margen'))el('fp-margen').value=margin.toFixed(2);
    }
    var rateLabel=el('fp-rate-label'); if(rateLabel)rateLabel.textContent=r>0?('Tasa BCV vigente: '+r.toLocaleString('es-VE')+' Bs/USD'):'No hay tasa BCV disponible; los campos Bs. no se calculan automáticamente.';
  }
  function priceTier(prefix,from){
    var r=rate(),cost=n(el('fp-costoRealUSD')&&el('fp-costoRealUSD').value);
    var u=el('fp-'+prefix+'USD'),b=el('fp-'+prefix+'Bs'),m=el('fp-'+prefix+'Margen');
    if(!u||!b||!m)return;
    var usd=n(u.value),bs=n(b.value),margin=n(m.value);
    if(from==='margen')usd=cost*(1+margin/100);
    if(from==='bs'&&r>0)usd=bs/r;
    if(from==='usd'||from==='bs')margin=cost>0?((usd-cost)/cost)*100:0;
    u.value=usd.toFixed(2); b.value=r>0?(usd*r).toFixed(2):(from==='bs'?bs.toFixed(2):''); m.value=margin.toFixed(2);
  }
  function open(item){
    item=item||null;
    var existing=item&&item.id&&Array.isArray(global.db.productos)?global.db.productos.find(function(p){return String(p.id)===String(item.id);}):null;
    var p=existing||item||{};
    // Normaliza referencias del Catálogo Máster a la ficha comercial completa.
    // Los datos que no constan en la fuente (SKU interno, precios, costo, stock y ubicación)
    // quedan vacíos para que el administrador los defina, sin inventar valores.
    if(!existing && item && (item.masterId || item.fuenteUrl || item.estadoVerificacion || item.descripcionTecnica)){
      var masterCompat=Array.isArray(item.compatibilidad)
        ? item.compatibilidad.map(function(x){return [x.marca,x.modelo,x.anios,x.motor,x.version,x.posicion].filter(Boolean).join(' — ');}).join('\n')
        : text(item.compatibilidad||'');
      var masterCross=Array.isArray(item.referenciasCruzadas)
        ? item.referenciasCruzadas.map(function(x){return (x.marca||'')+': '+(x.codigo||'');}).join('\n')
        : text(item.referenciasCruzadas||'');
      var masterNotes=[item.descripcionTecnica,item.especificaciones,item.estadoCompatibilidad,item.estadoVerificacion]
        .filter(function(x,i,a){return !!x && a.indexOf(x)===i;}).join('\n\n');
      p=Object.assign({},item,{
        codigo:'',sku:'',barra:'',
        codigoFabricante:item.codigoFabricante||item.codigoProveedor||'',
        codigoOEM:item.codigoOEM||'',
        nombre:item.nombre||item.descripcionTecnica||'',
        descCorta:item.nombre||'',
        modelo:item.modelo||'',
        referencia:item.referencia||item.codigoProveedor||'',
        marca:item.marca||'',
        fabricante:item.fabricante||item.fuenteNombre||'',
        categoria:item.categoria||'',
        subcategoria:item.subcategoria||'',
        nroParte:item.nroParte||item.mpn||item.codigoProveedor||'',
        mpn:item.mpn||item.nroParte||item.codigoProveedor||'',
        unidad:item.unidadMedida||item.unidad||'Unidad',
        compatibilidad:masterCompat,
        referenciasCruzadas:masterCross,
        especificaciones:masterNotes,
        nota:masterNotes,
        costo:'',costoRealUSD:'',costoRealBs:'',precio:'',precioBs:'',
        precioMayor:'',precioMayorBs:'',precioOferta:'',precioOfertaBs:'',
        precioPromo:'',precioPromoBs:'',margenDetal:'',margenMayor:'',margenOferta:'',margenPromo:'',
        stock:0,stockInicial:0,min:'',stockMaximo:'',reorderPoint:'',ubicacion:'',
        presentacion:item.presentacion||item.unidadMedida||'',
        imagen:item.imagen||item.fotoReal||''
      });
    }
    var d=Object.assign({},p.detalles||{},p);
    editingId=existing?String(existing.id):'';
    formSource=item&&item.fuenteUrl?item:null;
    formRepuestoSource=item&&item.__siferRepuesto?{id:item.__siferRepuestoId||'',original:item}:null;
    supplierRows=Array.isArray(d.proveedores)?d.proveedores.map(function(s){return Object.assign({},s);}):[];
    var code=val(d,'codigo',val(d,'codigoProveedor',''));
    var name=val(d,'nombre','');
    var category=val(d,'categoria','');
    var brand=val(d,'marca','');
    var compatText=Array.isArray(d.compatibilidad)?d.compatibilidad.map(function(x){return [x.marca,x.modelo,x.anios,x.motor,x.posicion].filter(Boolean).join(' - ');}).join('\n'):val(d,'compatibilidad','');
    var unit=val(d,'unidad',val(d,'unidadMedida','Unidad'));
    var sourceHtml=formSource?'<div style="padding:8px;background:#eef7ff;border:1px solid #b8d4ee;margin-bottom:8px;font-size:11px"><b>Referencia procedente del catálogo</b><br><a href="'+global.esc(formSource.fuenteUrl)+'" target="_blank" rel="noopener">Abrir fuente documental</a><br>'+global.esc(formSource.estadoVerificacion||'Consultar la aplicación exacta antes de instalar')+'</div>':'';
    var general=section('Identificación principal',
      input('fp-codigo','Código interno / SKU comercial',code||'', 'text')+
      '<div class="field"><label for="fp-sku">SKU</label><div style="display:flex;gap:5px;align-items:center"><input id="fp-sku" type="text" value="'+global.esc(text(val(d,'sku',code||'')))+'" style="min-width:0;flex:1"><button class="btn" id="fp-generate-inline" type="button" style="white-space:nowrap">⚡ SKU automático</button></div></div>'+
      input('fp-barra','Código de barras',val(d,'barra',''))+
      input('fp-codfab','Código del fabricante',val(d,'codigoFabricante',''))+
      input('fp-desc','Descripción completa',name,'text','required')+
      input('fp-descCorta','Descripción corta para el ticket',val(d,'descCorta',name))+
      input('fp-modelo','Modelo',val(d,'modelo',''))+
      input('fp-ref','Referencia comercial',val(d,'referencia',''))+
      managed('fp-marca','Marca comercial',brand,'marcas',['Bosch','NGK','Denso','Gates','SKF','KYB','TRW','GM','Chevrolet','Toyota','Ford','Genérica'],true)+
      input('fp-oem','Código original OEM',val(d,'codigoOEM',''))+
      managed('fp-cat','Categoría',category,'categorias',['Motor','Filtros','Lubricantes','Frenos','Suspensión','Dirección','Electricidad','Refrigeración','Transmisión','Accesorios','General'],true)+
      managed('fp-subcat','Subcategoría',val(d,'subcategoria',''),'subcategorias',['Bujías','Correas','Sensores','Bombas','Bujes','Terminales','Rodamientos','Pastillas','Filtros','Mangueras','General'],true)+
      input('fp-nroParte','MPN / Número de parte',val(d,'nroParte',val(d,'mpn','')))+
      area('fp-compat','Compatibilidad vehicular (marca, modelo, año, motor, versión y posición)',compatText)+
      area('fp-cross','Referencias cruzadas (marca: código; una por línea)',Array.isArray(d.referenciasCruzadas)?d.referenciasCruzadas.map(function(x){return (x.marca||'')+': '+(x.codigo||'');}).join('\n'):val(d,'referenciasCruzadas',''))
    );
    var costs=section('Costos y precios',
      input('fp-costo','Costo de compra USD',val(d,'costo',0),'number','oninput="SIFERProductForm.pricing(\'costo\')"')+
      input('fp-gastos','Gastos adicionales (%)',val(d,'gastosPct',0),'number','oninput="SIFERProductForm.pricing(\'costo\')"')+
      input('fp-costoRealUSD','Costo real USD',val(d,'costoRealUSD',0),'number','readonly')+
      input('fp-costoRealBs','Costo real Bs.',val(d,'costoRealBs',0),'number','readonly')+
      input('fp-margen','Margen de ganancia (%)',val(d,'margenDetal',val(d,'margenPct',0)),'number','oninput="SIFERProductForm.pricing(\'margen\')"')+
      input('fp-precioUSD','Precio de venta USD',val(d,'precio',0),'number','oninput="SIFERProductForm.pricing(\'usd\')"')+
      input('fp-precioBs','Precio de venta Bs.',val(d,'precioBs',0),'number','oninput="SIFERProductForm.pricing(\'bs\')"')+
      '<div class="field full"><small id="fp-rate-label" style="color:#555"></small></div>'
    );
    var priceLists=section('Lista mayorista',
      input('fp-mayorUSD','Mayorista USD',val(d,'precioMayor',0),'number','oninput="SIFERProductForm.priceTier(\'mayor\',\'usd\')"')+
      input('fp-mayorBs','Mayorista Bs.',val(d,'precioMayorBs',0),'number','oninput="SIFERProductForm.priceTier(\'mayor\',\'bs\')"')+
      input('fp-mayorMargen','Margen mayorista (%)',val(d,'margenMayor',0),'number','oninput="SIFERProductForm.priceTier(\'mayor\',\'margen\')"')+
      input('fp-ofertaUSD','Oferta USD',val(d,'precioOferta',0),'number','oninput="SIFERProductForm.priceTier(\'oferta\',\'usd\')"')+
      input('fp-ofertaBs','Oferta Bs.',val(d,'precioOfertaBs',0),'number','oninput="SIFERProductForm.priceTier(\'oferta\',\'bs\')"')+
      input('fp-ofertaMargen','Margen oferta (%)',val(d,'margenOferta',0),'number','oninput="SIFERProductForm.priceTier(\'oferta\',\'margen\')"')+
      input('fp-promoUSD','Promoción USD',val(d,'precioPromo',0),'number','oninput="SIFERProductForm.priceTier(\'promo\',\'usd\')"')+
      input('fp-promoBs','Promoción Bs.',val(d,'precioPromoBs',0),'number','oninput="SIFERProductForm.priceTier(\'promo\',\'bs\')"')+
      input('fp-promoMargen','Margen promoción (%)',val(d,'margenPromo',0),'number','oninput="SIFERProductForm.priceTier(\'promo\',\'margen\')"')
    );
    var inventory=section('Inventario y trazabilidad',
      '<div class="field full" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:6px"><div><label>Stock actual</label><input value="'+global.esc(text(val(d,'stock',0)))+'" readonly></div><div><label>Reservado</label><input value="'+global.esc(text(val(d,'reservado',0)))+'" readonly></div><div><label>Disponible</label><input value="'+global.esc(text(Math.max(0,n(val(d,'stock',0))-n(val(d,'reservado',0)))))+'" readonly></div></div>'+
      managed('fp-unidad','Unidad base',unit||'Unidad','unidades',['Unidad','Juego','Par','Caja','Paquete','Litro','Galón','Metro','Rollo','Kit'],false)+
      input('fp-stockInicial','Existencia inicial (solo al crear)',existing?val(d,'stock',0):val(d,'stockInicial',val(d,'stock',0)),'number',existing?'readonly':'min="0"')+
      input('fp-min','Stock mínimo',val(d,'min',0),'number','min="0"')+
      input('fp-max','Stock máximo',val(d,'stockMaximo',0),'number','min="0"')+
      input('fp-reorden','Punto de reorden',val(d,'reorderPoint',val(d,'puntoReorden',0)),'number','min="0"')+
      input('fp-ubicacion','Ubicación física',val(d,'ubicacion',''))+
      '<div class="field full">'+check('fp-lotes','Maneja lotes',!!d.manejaLotes)+check('fp-vencimiento','Maneja vencimiento',!!d.manejaVencimiento)+check('fp-seriales','Maneja seriales únicos',!!d.manejaSeriales)+check('fp-negativo','Permitir inventario negativo',!!d.permiteNegativo)+check('fp-auditoria','Requiere auditoría de conteo',!!d.requiereAuditoria)+'</div>'
    );
    var presentations=section('Presentaciones y fraccionamiento',
      managed('fp-presentacion','Presentación principal',val(d,'presentacion','Unidad'),'presentaciones',['Unidad','Par','Juego','Kit','Caja','Paquete','Blíster','Botella','Galón','Litro'],true)+
      input('fp-contenido','Contenido total',val(d,'contenidoTotal',''))+
      input('fp-subpresentacion','Subpresentación / fraccionado',val(d,'subPresentacion',''))+
      input('fp-contenidoFraccion','Contenido por fracción',val(d,'contenidoFraccion',''))
    );
    var taxes=section('Configuración fiscal',
      '<div class="field">'+check('fp-ivaAplicar','Aplicar IVA (gravado)',d.ivaExento!==true)+'</div>'+
      input('fp-ivaRate','Alícuota IVA (%)',val(d,'ivaRate',16),'number','min="0"')+
      '<div class="field">'+check('fp-ivaIncluido','IVA incluido en precio',!!d.ivaIncluido)+'</div>'+
      '<div class="field">'+check('fp-igtf','Aplicar IGTF a pagos en moneda extranjera',!!d.aplicaIGTF)+'</div>'
    );
    var manufacturer=section('Fabricante, imágenes y especificaciones',
      input('fp-fabricante','Fabricante',val(d,'fabricante',''))+
      input('fp-mpn','MPN / Part Number',val(d,'mpn',val(d,'nroParte','')))+
      input('fp-imagen','URL de imagen',val(d,'imagen',val(d,'fotoReal','/icon.svg')))+
      area('fp-nota','Notas / especificaciones',val(d,'especificaciones',val(d,'nota','')))
    );
    var suppliers='<fieldset class="panel" style="margin:8px 0"><legend>Proveedores asociados</legend><div style="overflow:auto"><table class="grid" style="width:100%"><thead><tr><th>Proveedor</th><th>Código proveedor</th><th>Costo ref.</th><th>Principal</th><th>Acción</th></tr></thead><tbody id="fp-suppliers"></tbody></table></div><button type="button" class="btn" id="fp-add-supplier" style="margin-top:8px">➕ Agregar proveedor</button></fieldset>';
    var pos=section('POS y venta',
      input('fp-descMax','Descuento máximo permitido (%)',val(d,'descuentoMaximo',0),'number','min="0" max="100"')+
      '<div class="field">'+check('fp-inactivo','Producto inactivo (no vender)',!!d.inactivo)+check('fp-excludeGap','Excluir del cálculo de brecha',!!d.exclude_from_gap)+'</div>'+
      area('fp-posNotas','Notas para caja / venta',val(d,'posNotas',''))
    );
    var history='<fieldset class="panel" style="margin:8px 0"><legend>Historial de cambios</legend><div style="max-height:190px;overflow:auto"><table class="grid" style="width:100%"><thead><tr><th>Fecha</th><th>Usuario</th><th>Operación</th><th>Detalle</th></tr></thead><tbody>'+
      (Array.isArray(d.historial)?d.historial:[]).map(function(h){return '<tr><td>'+global.esc(h.fecha||h.at||'')+'</td><td>'+global.esc(h.usuario||'')+'</td><td>'+global.esc(h.operacion||h.action||'')+'</td><td>'+global.esc(h.detalle||h.note||'')+'</td></tr>';}).join('')+
      '</tbody></table></div><p style="font-size:10px;color:#666">El historial se amplía automáticamente al guardar cada cambio.</p></fieldset>';
    var tabs='<div class="fp-tabs" style="display:flex;gap:3px;flex-wrap:wrap;border-bottom:1px solid #c8d2df;margin-bottom:8px">'+
      ['General','Costos y precios','Listas de precio','Inventario','Presentaciones','Impuestos','Fabricante','Proveedores','POS / Venta','Historial'].map(function(t,i){return '<button type="button" class="fp-tab" data-fp-tab="fp-pane-'+i+'" style="padding:7px 9px;border:1px solid #b8c7d8;border-bottom:0;background:'+(i===0?'#fff':'#eaf0f7')+';border-radius:4px 4px 0 0;font-weight:700;font-size:11px">'+t+'</button>';}).join('')+'</div>';
    var panes='<div id="fp-pane-0" class="fp-pane" style="display:block">'+general+'</div>'+
      '<div id="fp-pane-1" class="fp-pane" style="display:none">'+costs+'</div>'+
      '<div id="fp-pane-2" class="fp-pane" style="display:none">'+priceLists+'</div>'+
      '<div id="fp-pane-3" class="fp-pane" style="display:none">'+inventory+'</div>'+
      '<div id="fp-pane-4" class="fp-pane" style="display:none">'+presentations+'</div>'+
      '<div id="fp-pane-5" class="fp-pane" style="display:none">'+taxes+'</div>'+
      '<div id="fp-pane-6" class="fp-pane" style="display:none">'+manufacturer+'</div>'+
      '<div id="fp-pane-7" class="fp-pane" style="display:none">'+suppliers+'</div>'+
      '<div id="fp-pane-8" class="fp-pane" style="display:none">'+pos+'</div>'+
      '<div id="fp-pane-9" class="fp-pane" style="display:none">'+history+'</div>';
    var title=editingId?'Editar producto — '+name:(item?'Nuevo producto desde Catálogo Máster':'Nuevo Producto');
    var searchHtml='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;background:#f4f7fb;border:1px solid #c9d8eb;padding:8px;margin-bottom:8px"><span style="font-size:11px;color:#244b70">Ficha comercial ampliada · los datos técnicos del catálogo no crean stock automáticamente.</span><button type="button" class="btn" onclick="openMasterCatalogSelectorModal(\'producto\')">🔍 Buscar en Catálogo Máster</button></div>';
    global.openModal(title,searchHtml+sourceHtml+'<input type="hidden" id="fp-source-url" value="'+global.esc(val(d,'fuenteUrl',''))+'"><input type="hidden" id="fp-source-status" value="'+global.esc(val(d,'estadoVerificacion',''))+'"><div style="max-height:62vh;overflow:auto;padding:2px">'+tabs+panes+'</div>',
      '<button class="btn" id="fp-generate" type="button">⚡ Generar código</button>'+(editingId?'<button class="btn" id="fp-duplicate" type="button">📋 Duplicar</button>':'')+'<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn" id="fp-save-new" type="button">➕ Guardar y nuevo</button><button class="btn primary" id="fp-save" type="button">💾 '+(editingId?'Guardar cambios':'Guardar producto')+'</button>');
    document.querySelectorAll('[data-fp-tab]').forEach(function(b){b.addEventListener('click',function(){switchTab(b.getAttribute('data-fp-tab'));});});
    var formRoot=el('modalBody');if(formRoot&&!formRoot.dataset.fpOptionsBound){formRoot.dataset.fpOptionsBound='1';formRoot.addEventListener('click',function(ev){var a=ev.target.closest('[data-fp-add-option]');if(a){manageOption(a.getAttribute('data-fp-add-option'),a.getAttribute('data-fp-field'),false);return;}var r=ev.target.closest('[data-fp-remove-option]');if(r)manageOption(r.getAttribute('data-fp-remove-option'),r.getAttribute('data-fp-field'),true);});}
    if(el('fp-add-supplier'))el('fp-add-supplier').addEventListener('click',addSupplier);
    renderSuppliers();
    if(el('fp-save'))el('fp-save').addEventListener('click',function(){save('close');});
    if(el('fp-save-new'))el('fp-save-new').addEventListener('click',function(){save('new');});
    if(el('fp-generate'))el('fp-generate').addEventListener('click',generateCode);
    if(el('fp-generate-inline'))el('fp-generate-inline').addEventListener('click',generateCode);
    if(el('fp-duplicate'))el('fp-duplicate').addEventListener('click',duplicateCurrent);
    pricing('');
  }
  function gather(){
    var details={};
    fieldIds.forEach(function(id){var node=el(id);if(node)details[id.replace('fp-','')]=node.value;});
    checkIds.forEach(function(id){var node=el(id);if(node)details[id.replace('fp-','')]=node.checked;});
    details.compatibilidad=el('fp-compat')?el('fp-compat').value.trim():'';
    details.posNotas=el('fp-posNotas')?el('fp-posNotas').value.trim():'';
    details.referenciasCruzadas=(el('fp-cross')?el('fp-cross').value:'').split(/\n+/).map(function(line){var s=line.split(':');return {marca:(s.shift()||'').trim(),codigo:s.join(':').trim()};}).filter(function(x){return x.marca&&x.codigo;});
    details.proveedores=supplierRows.map(function(s){return Object.assign({},s);});
    details.historial=[];
    details.subcategoria=details.subcat||'';
    details.stockMaximo=n(details.max);
    details.reorderPoint=n(details.reorden);
    details.puntoReorden=n(details.reorden);
    details.descuentoMaximo=n(details.descMax);
    details.contenidoTotal=details.contenido||'';
    details.subPresentacion=details.subpresentacion||'';
    details.margenDetal=n(details.margen);
    details.precioUSD=n(details.precioUSD);
    details.precioBs=n(details.precioBs);
    details.precioMayor=n(details.mayorUSD);
    details.precioMayorBs=n(details.mayorBs);
    details.margenMayor=n(details.mayorMargen);
    details.precioOferta=n(details.ofertaUSD);
    details.precioOfertaBs=n(details.ofertaBs);
    details.margenOferta=n(details.ofertaMargen);
    details.precioPromo=n(details.promoUSD);
    details.precioPromoBs=n(details.promoBs);
    details.margenPromo=n(details.promoMargen);
    details.ivaExento=!details.ivaAplicar;
    details.aplicaIGTF=!!details.igtf;
    details.manejaLotes=!!details.lotes;
    details.manejaVencimiento=!!details.vencimiento;
    details.manejaSeriales=!!details.seriales;
    details.permiteNegativo=!!details.negativo;
    details.requiereAuditoria=!!details.auditoria;
    details.exclude_from_gap=!!details.excludeGap;
    return details;
  }
  function generateCode(){var code=global.id?global.id('SKU','producto'):('SKU-'+Date.now());if(el('fp-codigo'))el('fp-codigo').value=code;if(el('fp-sku'))el('fp-sku').value=code;}
  function duplicateCurrent(){editingId='';if(el('fp-codigo'))el('fp-codigo').value='';if(el('fp-sku'))el('fp-sku').value='';if(el('fp-desc'))el('fp-desc').value=(el('fp-desc').value||'')+' (copia)';var b=el('fp-save');if(b)b.textContent='💾 Guardar producto';}
  async function save(mode){
    var name=(el('fp-desc')&&el('fp-desc').value||'').trim();
    var code=(el('fp-codigo')&&el('fp-codigo').value||'').trim();
    if(!code||!name){alert('Indica al menos el código interno y la descripción del producto.');return;}
    var duplicate=(global.db.productos||[]).find(function(p){return String(p.codigo||'').toLowerCase()===code.toLowerCase()&&String(p.id)!==editingId;});
    if(duplicate){alert('Ya existe un producto con ese código. Usa otro código o abre el registro existente.');return;}
    var details=gather(),old=editingId?(global.db.productos||[]).find(function(p){return String(p.id)===editingId;}):null;
    var sourceUrl=el('fp-source-url')?el('fp-source-url').value:'';
    var sourceStatus=el('fp-source-status')?el('fp-source-status').value:'';
    var costo=n(el('fp-costo').value), rateNow=rate(), precioUSD=n(el('fp-precioUSD').value);
    var stockInicial=old?n(old.stock):Math.max(0,n(el('fp-stockInicial').value));
    var p={
      id:editingId||(global.id?global.id('PR','producto'):'PR-'+String(Date.now())),
      codigo:code,nombre:name,categoria:(el('fp-cat').value||'').trim(),marca:(el('fp-marca').value||'').trim(),
      unidad:(el('fp-unidad').value||'Unidad').trim(),costo:costo,precio:precioUSD,
      stock:stockInicial,min:Math.max(0,n(el('fp-min').value)),imagen:(el('fp-imagen').value||'/icon.svg').trim(),
      codigoOEM:(el('fp-oem').value||'').trim(),fuenteUrl:sourceUrl,estadoVerificacion:sourceStatus,
      precioTaller:n(el('fp-ofertaUSD').value)||n(el('fp-mayorUSD').value),precioMayor:n(el('fp-mayorUSD').value),
      margenDetal:n(el('fp-margen').value),reorderPoint:n(el('fp-reorden').value),
      stockMaximo:n(el('fp-max').value),ubicacion:(el('fp-ubicacion').value||'').trim(),
      ivaExento:!el('fp-ivaAplicar').checked,ivaRate:n(el('fp-ivaRate').value)||16,ivaIncluido:el('fp-ivaIncluido').checked,aplicaIGTF:el('fp-igtf').checked,
      descuentoMaximo:n(el('fp-descMax').value),inactivo:el('fp-inactivo').checked,exclude_from_gap:el('fp-excludeGap').checked,
      manejaLotes:el('fp-lotes').checked,manejaVencimiento:el('fp-vencimiento').checked,manejaSeriales:el('fp-seriales').checked,
      permiteNegativo:el('fp-negativo').checked,requiereAuditoria:el('fp-auditoria').checked,
      presentacion:el('fp-presentacion').value,contenidoTotal:el('fp-contenido').value,subPresentacion:el('fp-subpresentacion').value,contenidoFraccion:el('fp-contenidoFraccion').value,
      codigoFabricante:el('fp-codfab').value,barra:el('fp-barra').value,sku:el('fp-sku').value,descCorta:el('fp-descCorta').value,modelo:el('fp-modelo').value,referencia:el('fp-ref').value,nroParte:el('fp-nroParte').value,subcategoria:el('fp-subcat').value,fabricante:el('fp-fabricante').value,mpn:el('fp-mpn').value,especificaciones:el('fp-nota').value,compatibilidad:details.compatibilidad,referenciasCruzadas:details.referenciasCruzadas,proveedores:supplierRows.map(function(s){return Object.assign({},s);}),
      detalles:details,proveedores:supplierRows.map(function(s){return Object.assign({},s);}),
      updatedAt:new Date().toISOString()
    };
    var hist=old&&Array.isArray(old.historial)?old.historial.slice():[];
    hist.unshift({fecha:new Date().toISOString(),usuario:(global.usuarioActual&&global.usuarioActual().nombre)||'Administrador',operacion:old?'Actualización':'Creación',detalle:name+' — '+code});
    p.historial=hist.slice(0,100);details.historial=p.historial;p.detalles=details;
    try{
      if(navigator.onLine){
        var response=await fetch('/api/turso-products',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'upsert',product:p,initialStock:stockInicial})});
        var result=await response.json().catch(function(){return {};});
        if(!response.ok||!result.ok)throw new Error(result.error||'No se pudo guardar en Turso');
        if(result.product){p=Object.assign({},p,result.product,{detalles:details,historial:hist});}
      }else if(global.SiferOffline&&typeof global.SiferOffline.enqueue==='function'){
        await global.SiferOffline.enqueue('product-upsert',{product:p,initialStock:stockInicial});
      }else{
        alert('Sin conexión y sin cola offline disponible. No se guardó el producto.');return;
      }
      if(old){var idx=global.db.productos.findIndex(function(x){return String(x.id)===editingId;});global.db.productos[idx]=Object.assign({},old,p,{stock:old.stock,min:p.min});}
      else global.db.productos.push(p);
      if(formRepuestoSource){
        global.db.repuestos=Array.isArray(global.db.repuestos)?global.db.repuestos:[];
        var repuestoId=formRepuestoSource.id;
        var repuesto=global.db.repuestos.find(function(x){return repuestoId && String(x.id)===String(repuestoId);});
        if(!repuesto){
          repuesto={id:repuestoId||('AUT-'+String(Date.now()))};
          global.db.repuestos.push(repuesto);
        }
        var fitments=String(details.compatibilidad||'').split(/\n+/).map(function(line){
          var parts=line.split(/\s*[—-]\s*/).map(function(x){return x.trim();});
          return parts.length>=2?{marca:parts[0],modelo:parts[1],anios:parts[2]||'Todos',motor:parts[3]||'',version:parts[4]||'',posicion:parts[5]||''}:null;
        }).filter(Boolean);
        Object.assign(repuesto,{
          sku:p.sku||p.codigo,codigoOEM:p.codigoOEM,nombre:p.nombre,categoria:p.categoria,marca:p.marca,
          costo:p.costo,precio:p.precio,stock:p.stock,min:p.min,ubicacion:p.ubicacion,
          garantia:repuesto.garantia||'',especificaciones:p.especificaciones,imagen:p.imagen,
          referenciasCruzadas:details.referenciasCruzadas||[],compatibilidad:fitments,updatedAt:p.updatedAt
        });
      }
      global.save('product-upsert');
      global.closeModal();global.renderView();
      global.toast(navigator.onLine?'Producto guardado en Turso.':'Producto guardado localmente; pendiente de sincronizar con Turso.');
      if(mode==='new')open(null);
    }catch(err){
      global.toast('No se guardó el producto: '+String(err&&err.message||err));
    }
  }
  global.SIFERProductForm={open:open,pricing:pricing,priceTier:priceTier,switchTab:switchTab,save:save,manageOption:manageOption};
  global.openCommercialProductFormWithMaster=open;
  global.openProduct=function(pid){
    var p=(global.db.productos||[]).find(function(x){return String(x.id)===String(pid);});
    if(!p)return;
    open(p);
  };
})(window);
