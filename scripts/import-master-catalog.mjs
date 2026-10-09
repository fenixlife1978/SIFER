#!/usr/bin/env node
// Importa JSONL en lotes pequeños y reanudables a la biblioteca de catálogo (nunca al inventario).
// SIFER_CATALOG_URL=https://sifer-360.vercel.app/api/master-catalog SIFER_CATALOG_IMPORT_KEY=... node scripts/import-master-catalog.mjs ./catalogo.jsonl
import fs from 'node:fs';
import readline from 'node:readline';
const file=process.argv[2],endpoint=process.env.SIFER_CATALOG_URL,key=process.env.SIFER_CATALOG_IMPORT_KEY;
if(!file||!endpoint||!key){console.error('Faltan archivo JSONL, SIFER_CATALOG_URL o SIFER_CATALOG_IMPORT_KEY');process.exit(2)}
const batchSize=Math.max(1,Math.min(100,Number(process.env.SIFER_CATALOG_BATCH_SIZE)||100));
const rl=readline.createInterface({input:fs.createReadStream(file),crlfDelay:Infinity});
let batch=[],line=0,sent=0,upserted=0,skipped=0;
async function flush(){if(!batch.length)return;const payload=batch;const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','x-catalog-import-key':key},body:JSON.stringify({items:payload})});const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok)throw new Error('Lote rechazado cerca de línea '+line+': HTTP '+r.status+' '+JSON.stringify(d));sent+=payload.length;upserted+=Number(d.importedOrUpdated)||0;skipped+=Number(d.skipped)||0;console.log(JSON.stringify({linesRead:line,sent,importedOrUpdated:upserted,skipped}));batch=[]}
for await(const raw of rl){line++;if(!raw.trim())continue;let item;try{item=JSON.parse(raw)}catch{throw new Error('JSON inválido en línea '+line)}if(!item||typeof item!=='object'||Array.isArray(item))throw new Error('Cada línea debe ser un objeto JSON: '+line);batch.push(item);if(batch.length>=batchSize)await flush()}
await flush();console.log(JSON.stringify({done:true,linesRead:line,sent,importedOrUpdated:upserted,skipped}));
