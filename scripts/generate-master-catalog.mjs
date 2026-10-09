#!/usr/bin/env node
/**
 * Generador local de un catálogo automotriz amplio para SIFER.
 *
 * Uso:
 *   node scripts/generate-master-catalog.mjs
 *   node scripts/generate-master-catalog.mjs 10000000 ./catalogo-master
 *
 * Genera archivos JSONL en fragmentos de 100.000 registros para no agotar RAM.
 * Los registros sintéticos se etiquetan claramente; no son referencias OEM ni precios reales.
 * No escribe ni modifica el inventario ni la base de datos. Para importarlos, usar después
 * scripts/import-master-catalog.mjs y api/master-catalog.ts.
 */
import fs from 'node:fs';
import path from 'node:path';

const target = Math.max(1, Math.floor(Number(process.argv[2]) || 10_000_000));
const outDir = path.resolve(process.argv[3] || './catalogo-master');
const chunkSize = Math.max(1000, Math.min(100_000, Number(process.env.CATALOG_CHUNK_SIZE) || 100_000));

const families = [
  ['Motor','Pistones','Pistón de motor'],['Motor','Anillos','Juego de anillos de pistón'],
  ['Motor','Juntas y empaques','Juego de empacaduras de motor'],['Motor','Bombas','Bomba de aceite'],
  ['Distribución','Correas','Correa de distribución'],['Distribución','Cadenas','Cadena de tiempo'],
  ['Distribución','Tensores','Tensor de distribución'],['Encendido','Bujías','Bujía de encendido'],
  ['Encendido','Bobinas','Bobina de encendido'],['Eléctrico y Electrónico','Sensores','Sensor automotriz'],
  ['Eléctrico y Electrónico','Relés','Relé automotriz'],['Eléctrico y Electrónico','Alternadores','Alternador'],
  ['Eléctrico y Electrónico','Arranque','Motor de arranque'],['Inyección y Combustible','Inyectores','Inyector de combustible'],
  ['Inyección y Combustible','Bombas','Bomba de gasolina'],['Filtros','Aceite','Filtro de aceite'],
  ['Filtros','Aire','Filtro de aire'],['Filtros','Combustible','Filtro de combustible'],
  ['Aceites y Lubricantes','Aceite motor','Aceite de motor'],['Aceites y Lubricantes','Transmisión','Lubricante de transmisión'],
  ['Aceites y Lubricantes','Grasas','Grasa multipropósito'],['Químicos y Aditivos','Aditivos','Aditivo para motor'],
  ['Químicos y Aditivos','Refrigerantes','Refrigerante/anticongelante'],['Químicos y Aditivos','Limpieza','Limpiador de inyectores'],
  ['Refrigeración','Radiadores','Radiador'],['Refrigeración','Termostatos','Termostato'],
  ['Frenos','Pastillas','Juego de pastillas de freno'],['Frenos','Discos','Disco de freno'],
  ['Suspensión','Amortiguadores','Amortiguador'],['Suspensión','Bujes','Buje de suspensión'],
  ['Dirección','Terminales','Terminal de dirección'],['Dirección','Axiales','Barra axial'],
  ['Transmisión y Embrague','Embrague','Kit de embrague'],['Transmisión y Embrague','Juntas homocinéticas','Junta homocinética'],
  ['Rodamientos','Rueda','Rodamiento de rueda'],['Carrocería','Manillas','Manilla de puerta'],
  ['Iluminación','Faros','Faro delantero'],['Iluminación','Stop','Lámpara trasera'],
  ['Neumáticos y Rines','Neumáticos','Neumático'],['Baterías','Baterías','Batería automotriz'],
  ['Escape','Sensores y catalizadores','Catalizador'],['Accesorios','Cabina','Accesorio interior'],
  ['Herramientas y Accesorios','Herramientas','Herramienta automotriz'],['Mangueras y Tuberías','Mangueras','Manguera automotriz'],
  ['Sellos y Retenes','Retenes','Retén de aceite'],['Embrague','Bombines','Bombín de embrague']
];
const makes = [
  ['Chevrolet',['Aveo','Optra','Spark','Cruze','Captiva','Orlando','Sail','N300','Luv D-Max']],
  ['Toyota',['Corolla','Yaris','Hilux','Fortuner','4Runner','Land Cruiser','Terios']],
  ['Ford',['Fiesta','Focus','Fusion','EcoSport','Explorer','Ranger','F-150']],
  ['Hyundai',['Accent','Elantra','Tucson','Santa Fe','Getz','Atos']],
  ['Kia',['Rio','Cerato','Sportage','Picanto','Sorento']],
  ['Nissan',['Sentra','Tiida','Versa','Frontier','X-Trail','Pathfinder']],
  ['Mitsubishi',['Lancer','L200','Montero','Outlander']],
  ['Honda',['Civic','Accord','CR-V','Fit']],
  ['Mazda',['Mazda 3','Mazda 6','BT-50','CX-5']],
  ['Suzuki',['Swift','Vitara','Jimny','Grand Vitara']],
  ['Volkswagen',['Gol','Jetta','Golf','Amarok','Tiguan']],
  ['Renault',['Logan','Symbol','Sandero','Duster','Kangoo']],
  ['Peugeot',['206','207','301','307','Partner']],
  ['Fiat',['Palio','Siena','Uno','Ducato','Strada']],
  ['Chery',['Arauca','Orinoco','Tiggo','QQ','A520']],
  ['Changan',['CS35','CS55','Alsvin','Benni','Honor']],
  ['JAC',['J2','J3','J4','S2','S3','S5','T6']],
  ['Great Wall',['Wingle','Hover','Haval H6','M4']],
  ['Dongfeng',['AX7','S30','Rich','DFSK']],
  ['Geely',['Emgrand','LC','GX3','Coolray']],
  ['Foton',['Tunland','View','Aumark']],
  ['Mack',['Granite','Pinnacle','Anthem']],
  ['International',['4300','DuraStar','ProStar']],
  ['Mercedes-Benz',['Sprinter','C-Class','E-Class','Actros']],
  ['BMW',['Serie 3','Serie 5','X3','X5']],
  ['Audi',['A3','A4','Q3','Q5']],
  ['Jeep',['Cherokee','Grand Cherokee','Wrangler','Compass']],
  ['Dodge',['Ram','Caliber','Journey','Neon']],
  ['Isuzu',['D-Max','NPR','NQR']],
  ['Chrysler',['Neon','Voyager','300']]
];
const partBrands = ['Genérico','Bosch','Denso','NGK','ACDelco','Gates','SKF','Mann-Filter','Mahle','Federal Mogul','Dayco','Valeo','Delphi','KYB','Monroe','TRW','Moog','Sakura','Wega','Takama','Orjin','Total','Mobil','Shell','Castrol','Valvoline','Chevron','PDV','Lubri','Motul','Lukoil','Petronas'];
const positions = ['Delantero','Trasero','Izquierdo','Derecho','Superior','Inferior','Interno','Externo','Central','Universal','Motor','Caja de cambios','Sistema de frenos','Sistema eléctrico'];
const specs = ['Estándar','Reforzado','Premium','Uso pesado','Alta temperatura','Sintético','Semisintético','Mineral','Larga duración','Alta eficiencia'];
const packages = ['Unidad','Juego','Kit','Par','Litro','Cuarto','Galón','Envase 4 L','Envase 5 L','Caja','Rollo','Metro'];
const engines = ['1.0 L','1.2 L','1.3 L','1.4 L','1.5 L','1.6 L','1.8 L','2.0 L','2.4 L','2.5 L','3.0 L','3.5 L','Diésel','Híbrido','Eléctrico'];
const years = Array.from({length: 35}, (_,i) => 1990+i);
const pad = n => String(n).padStart(8,'0');
const slug = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc = s => String(s ?? '').replace(/[\r\n]+/g,' ').trim();

fs.mkdirSync(outDir,{recursive:true});
let stream, chunkIndex=-1, inChunk=0, written=0;
function openChunk() {
  if (stream) stream.end();
  chunkIndex++; inChunk=0;
  const file=path.join(outDir, 'catalogo-master-'+String(chunkIndex+1).padStart(4,'0')+'.jsonl');
  stream=fs.createWriteStream(file,{encoding:'utf8'});
}
function priceFor(id, familyIndex) {
  // Precio sintético explícito para poder filtrar/probar; NO es cotización de mercado.
  return Number((2 + ((id * 7919 + familyIndex * 3571) % 250000) / 100).toFixed(2));
}
function record(id) {
  const fi=id%families.length, family=families[fi];
  const mi=Math.floor(id/families.length)%makes.length, make=makes[mi];
  const models=make[1], model=models[Math.floor(id/(families.length*makes.length))%models.length];
  const year=years[Math.floor(id/7)%years.length];
  const yearEnd=Math.min(year+Math.floor(id/11)%8,2026);
  const brand=partBrands[Math.floor(id/13)%partBrands.length];
  const position=positions[Math.floor(id/17)%positions.length];
  const spec=specs[Math.floor(id/19)%specs.length];
  const pack=packages[Math.floor(id/23)%packages.length];
  const engine=engines[Math.floor(id/29)%engines.length];
  const base=family[2];
  const name=base+' '+spec+' '+position+' para '+make[0]+' '+model+' '+year+'-'+yearEnd;
  const code='GEN-'+slug(family[1]).slice(0,8)+'-'+pad(id+1);
  const price=priceFor(id,fi);
  return {
    masterId:'SIFER-GEN-'+pad(id+1),
    nombre:name,
    categoria:family[0],
    subcategoria:family[1],
    marca:brand,
    fabricante:brand,
    codigoProveedor:code,
    codigoOEM:'GEN-OEM-'+pad(id+1),
    referenciasCruzadas:['GEN-XREF-'+pad(id+1), 'ALT-'+slug(base).slice(0,10)+'-'+pad(id+1)],
    unidadMedida:pack,
    descripcionTecnica:base+'; especificación '+spec+'; posición '+position+'. Registro sintético para búsqueda y expansión del catálogo.',
    especificaciones:'Motor/energía: '+engine+'; presentación: '+pack+'; variante generada.',
    palabrasClave:[base,family[0],family[1],make[0],model,year,yearEnd,brand,position,spec,engine,pack].join(' '),
    compatibilidad:[{marca:make[0],modelo,anios:year+'-'+yearEnd,motor:engine,posicion:position}],
    fuenteUrl:'',
    fuenteNombre:'Generador interno de catálogo SIFER',
    estadoVerificacion:'GENERADO_SINTETICO',
    atributos:{
      generado:true,
      referenciaReal:false,
      precioReferencial:price,
      monedaPrecio:'USD',
      tipoPrecio:'SINTETICO_NO_COTIZACION',
      familia:family[0],
      presentacion:pack,
      posicion,
      especificacion:spec,
      indiceGeneracion:id+1
    }
  };
}
openChunk();
for (let i=0;i<target;i++) {
  if(inChunk>=chunkSize) openChunk();
  const line=JSON.stringify(record(i))+'\n';
  if(!stream.write(line)) await new Promise(resolve=>stream.once('drain',resolve));
  inChunk++; written++;
  if(written%100000===0) console.log('Generados '+written.toLocaleString()+' / '+target.toLocaleString());
}
await new Promise((resolve,reject)=>{stream.end(resolve);stream.on('error',reject)});
fs.writeFileSync(path.join(outDir,'manifest.json'),JSON.stringify({
  nombre:'SIFER Catálogo Máster Automotriz',
  formato:'JSONL (cada línea es un objeto JSON)',
  registros:written,
  fragmentos:chunkIndex+1,
  tamanoFragmentoMax:chunkSize,
  generadoEn:new Date().toISOString(),
  advertencia:'Catálogo sintético. Códigos, equivalencias, compatibilidades y precios son generados, no referencias ni cotizaciones reales.'
},null,2)+'\n');
console.log('COMPLETADO: '+written.toLocaleString()+' registros en '+outDir);
