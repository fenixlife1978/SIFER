const NVIDIA_BASE_URL = (process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/,'');
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'z-ai/glm-5.3-flash';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_TRANSCRIBE_MODEL = process.env.NVIDIA_TRANSCRIBE_MODEL || 'openai/whisper-large-v3';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_TRANSCRIBE_MODEL = process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo';
const REQUEST_TIMEOUT_MS = 30000;

async function withTimeout(promise:any, ms=REQUEST_TIMEOUT_MS){
  let timer:any;
  try { return await Promise.race([promise, new Promise((_, reject)=>{ timer=setTimeout(()=>reject(new Error('NVIDIA AI tardó demasiado en responder.')),ms); })]); }
  finally { clearTimeout(timer); }
}

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || '').replace(/\/$/,'');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-reasoner';

async function directOpenAICompatible(baseUrl:string, apiKey:string|undefined, model:string, prompt:string, json=true) {
  if(!baseUrl) return null;
  const body:any={model,messages:[{role:'user',content:prompt}],temperature:0.2,max_tokens:1800};
  if(json) body.response_format={type:'json_object'};
  const response=await withTimeout(fetch(baseUrl.replace(/\/$/,'')+'/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json',...(apiKey?{'Authorization':'Bearer '+apiKey}:{})},
    body:JSON.stringify(body)
  }));
  if(!response.ok) throw new Error('Proveedor IA '+response.status);
  const data=await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function groqChat(messages:any[], options:any={}) {
  if(!GROQ_API_KEY) return null;
  const body:any={model:GROQ_MODEL,messages,temperature:options.temperature ?? 0.15,max_tokens:options.max_tokens ?? 1800};
  if(options.json) body.response_format={type:'json_object'};
  const response=await withTimeout(fetch(GROQ_BASE_URL+'/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ_API_KEY},
    body:JSON.stringify(body)
  }));
  if(!response.ok){ const detail=await response.text().catch(()=> ''); throw new Error('Groq '+response.status+(detail?': '+detail.slice(0,180):'')); }
  const data=await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function googleSearch(query:string, image=false) {
  const key=process.env.GOOGLE_CSE_API_KEY, cx=process.env.GOOGLE_CSE_CX;
  if(!key||!cx) return [];
  const params=new URLSearchParams({key,cx,q:query,num:'5'});
  if(image) params.set('searchType','image');
  const response=await withTimeout(fetch('https://www.googleapis.com/customsearch/v1?'+params.toString()),15000);
  if(!response.ok) throw new Error('Google Custom Search '+response.status);
  const data=await response.json();
  return (data.items||[]).slice(0,5).map((x:any)=>({
    title:String(x.title||'').slice(0,240),url:String(x.link||'').slice(0,1200),
    snippet:String(x.snippet||x.htmlTitle||'').replace(/<[^>]*>/g,'').slice(0,600),
    image:image?String(x.image?.thumbnailLink||x.link||'').slice(0,1200):undefined,
    source:'Google Custom Search'
  })).filter((x:any)=>x.url);
}

async function tavilySearch(query:string) {
  const key=process.env.TAVILY_API_KEY;
  if(!key) return [];
  const response=await withTimeout(fetch('https://api.tavily.com/search',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({api_key:key,query,search_depth:'basic',max_results:5,include_answer:false,include_raw_content:false})
  }),20000);
  if(!response.ok) throw new Error('Tavily '+response.status);
  const data=await response.json();
  return (data.results||[]).slice(0,5).map((x:any)=>({
    title:String(x.title||'').slice(0,240),url:String(x.url||'').slice(0,1200),
    snippet:String(x.content||'').slice(0,700),source:'Tavily'
  })).filter((x:any)=>x.url);
}

async function externalResearch(query:string) {
  const clean=String(query||'').trim().slice(0,300);
  if(!clean) return {available:false,results:[],images:[],message:'Consulta vacía.'};
  const jobs=await Promise.allSettled([
    tavilySearch(clean),
    googleSearch(clean,false),
    googleSearch(clean,true)
  ]);
  const results=jobs[0].status==='fulfilled'?jobs[0].value:[];
  const web=jobs[1].status==='fulfilled'?jobs[1].value:[];
  const images=jobs[2].status==='fulfilled'?jobs[2].value:[];
  const unique=(items:any[])=>items.filter((x,i)=>x.url&&items.findIndex(y=>y.url===x.url)===i);
  const all=unique([...results,...web]).slice(0,8);
  return {available:all.length>0||images.length>0,results:all,images:unique(images).slice(0,6),
    providers:{tavily:jobs[0].status==='fulfilled',googleWeb:jobs[1].status==='fulfilled',googleImages:jobs[2].status==='fulfilled'},
    message:all.length||images.length?'Resultados web recuperados; verificar aplicación y compatibilidad antes de vender.':'No hay resultados externos: faltan claves gratuitas configuradas o los proveedores no respondieron.'};
}

async function nvidiaChat(messages:any[], options:any={}) {
  if(!NVIDIA_API_KEY) return null;
  const body:any={model:NVIDIA_MODEL,messages,temperature:options.temperature ?? 0.15,max_tokens:options.max_tokens ?? 1800};
  if(options.json) body.response_format={type:'json_object'};
  const response=await withTimeout(fetch(NVIDIA_BASE_URL+'/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+NVIDIA_API_KEY},
    body:JSON.stringify(body)
  }));
  if(!response.ok){ const detail=await response.text().catch(()=> ''); throw new Error('NVIDIA '+response.status+(detail?': '+detail.slice(0,180):'')); }
  const data=await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function tryFreeProviders(prompt:string){
  if(GROQ_API_KEY){ try { const text=await groqChat([{role:'user',content:prompt}],{json:/DEVUELVE SOLO JSON|JSON VÁLIDO|JSON válido/i.test(prompt)}); if(text) return {text,provider:'groq',model:GROQ_MODEL}; } catch {} }
  const providers=[
    {name:'ollama',base:OLLAMA_BASE_URL,model:OLLAMA_MODEL,key:undefined},
    {name:'deepseek',base:process.env.DEEPSEEK_API_KEY?'https://api.deepseek.com/v1':'',model:DEEPSEEK_MODEL,key:process.env.DEEPSEEK_API_KEY},
    {name:'compatible',base:process.env.AI_COMPATIBLE_BASE_URL,model:process.env.AI_COMPATIBLE_MODEL||'qwen3:8b',key:process.env.AI_COMPATIBLE_API_KEY}
  ];
  for(const p of providers){
    if(!p.base) continue;
    try{
      const text=await directOpenAICompatible(p.base,p.key,p.model,prompt);
      if(text) return {text,provider:p.name,model:p.model};
    }catch{}
  }
  return null;
}

function cleanJson(value:any) {
  const text = String(value || '').trim().replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/,'').replace(/\s*\`\`\`$/,'');
  try { return JSON.parse(text); } catch {}
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

function decodeAudioBase64(audioBase64:string){
  const bin=atob(audioBase64);
  const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
  return bytes;
}

async function transcribeAudio(audioBase64:string, mimeType:string){
  if(!NVIDIA_API_KEY&&!GROQ_API_KEY) throw new Error('Configura GROQ_API_KEY (opción gratuita con límites) o NVIDIA_API_KEY para transcribir audio.');
  const bytes=decodeAudioBase64(audioBase64);
  const ext=mimeType.includes('webm')?'webm':mimeType.includes('mp4')?'mp4':mimeType.includes('ogg')?'ogg':'webm';
  const providers:any[]=[];
  if(GROQ_API_KEY) providers.push({name:'Groq',url:GROQ_BASE_URL,model:GROQ_TRANSCRIBE_MODEL,key:GROQ_API_KEY});
  if(NVIDIA_API_KEY) providers.push({name:'NVIDIA',url:NVIDIA_BASE_URL,model:NVIDIA_TRANSCRIBE_MODEL,key:NVIDIA_API_KEY});
  let lastError='';
  for(const provider of providers){
    const form=new FormData();
    form.append('file',new Blob([bytes],{type:mimeType}),'audio.'+ext);
    form.append('model',provider.model);
    form.append('response_format','json');
    try{
      const response=await withTimeout(fetch(provider.url+'/audio/transcriptions',{
        method:'POST',headers:{'Authorization':'Bearer '+provider.key},body:form
      }),90000);
      if(!response.ok){ const detail=await response.text().catch(()=> ''); lastError=provider.name+' '+response.status+(detail?': '+detail.slice(0,160):''); continue; }
      const data=await response.json();
      const transcript=String(data?.text||'').trim();
      if(transcript) return transcript;
      lastError=provider.name+' devolvió una transcripción vacía.';
    }catch(err:any){lastError=String(err?.message||err);}
  }
  throw new Error(lastError||'No respondió ningún proveedor de transcripción.');
}

function normalizeCtx(s:any){
  return String(s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
}

function isPlainArgs(args:any){
  if(!args||typeof args!=='object'||Array.isArray(args)) return false;
  const keys=Object.keys(args);
  if(keys.length>40) return false;
  for(const k of keys){
    const v=args[k];
    if(v===null||v===undefined) continue;
    const t=typeof v;
    if(t==='string'){ if(String(v).length>600) return false; continue; }
    if(t==='number'||t==='boolean') continue;
    if(Array.isArray(v)){
      if(v.length>50) return false;
      for(const x of v){
        const xt=typeof x;
        if(xt!=='string'&&xt!=='number'&&xt!=='boolean') return false;
        if(xt==='string'&&String(x).length>400) return false;
      }
      continue;
    }
    return false;
  }
  return true;
}

function validateAction(action:any, allowed:string[], context:any, prefix=''){
  if(!action||typeof action!=='object') return prefix+'acción inválida.';
  const name=String(action.name||'').trim();
  if(!name) return prefix+'falta action.name.';
  if(!/^[a-z][a-z0-9_]*$/.test(name)) return prefix+'nombre de capacidad inválido: '+name;
  if(allowed.length && !allowed.includes(name)) return prefix+'"'+name+'" no está entre las capacidades permitidas.';
  const args=action.args===undefined||action.args===null?{}:action.args;
  if(!isPlainArgs(args)) return prefix+'args de "'+name+'" debe ser un objeto plano con valores simples (string/number/boolean/array).';
  if(action.confirmationText!==undefined){
    if(typeof action.confirmationText!=='string') return prefix+'confirmationText debe ser texto.';
    if(action.confirmationText.length>500) action.confirmationText=action.confirmationText.slice(0,500);
  }
  if(name==='ui_click'||name==='ui_fill'||name==='ui_select'){
    const target=String(args.selector||args.id||args.button||args.dataSifer||args.text||args.label||'').trim();
    if(!target) return prefix+'"'+name+'" necesita args.selector, args.id, args.button, args.dataSifer, args.text o args.label.';
    const sm=(context&&context.systemMap)||{};
    const atlas=sm.atlas||null;
    const hay:any[]=[];
    if(Array.isArray(sm.buttons)) hay.push(...sm.buttons);
    if(Array.isArray(sm.fields)) hay.push(...sm.fields);
    if(atlas&&atlas.current){
      if(Array.isArray(atlas.current.buttons)) hay.push(...atlas.current.buttons);
      if(Array.isArray(atlas.current.fields)) hay.push(...atlas.current.fields);
    }
    if(hay.length){
      const nt=normalizeCtx(target);
      const found=hay.some((b:any)=>[b?.ds,b?.id,b?.text,b?.lb,b?.label,b?.nm,b?.onclick].some((f:any)=>f&&normalizeCtx(f).includes(nt)));
      if(!found) return prefix+'"' +target+'" no existe en el mapa del sistema (no inventes controles). Usa una capacidad de negocio o navega primero.';
    }
  }
  return null;
}

function validatePlanShape(plan:any, allowed:string[], context:any){
  if(!plan||typeof plan!=='object') return 'La respuesta no es un objeto JSON.';
  if(plan.ok!==true) return 'Falta "ok": true.';
  const type=String(plan.type||'');
  if(type==='answer'){
    const a=String(plan.answer||'').trim();
    if(!a) return 'type=answer requiere un "answer" no vacío.';
    if(a.length>3000) return 'El "answer" supera 3000 caracteres.';
    return null;
  }
  if(type==='action') return validateAction(plan.action, allowed, context);
  if(type==='plan'){
    if(typeof plan.summary!=='string'||!plan.summary.trim()) return 'type=plan requiere un "summary" no vacío.';
    if(!Array.isArray(plan.actions)||plan.actions.length<1) return 'plan.actions debe tener al menos 1 acción.';
    if(plan.actions.length>8) return 'El plan tiene '+plan.actions.length+' pasos; el máximo es 8. Divide la operación.';
    for(let i=0;i<plan.actions.length;i++){
      const e=validateAction(plan.actions[i], allowed, context, 'paso '+(i+1)+': ');
      if(e) return e;
    }
    return null;
  }
  return 'type debe ser "answer", "action" o "plan".';
}

function budgetJson(label:string, value:any, max:number){
  if(value===null||value===undefined) return '';
  const s=JSON.stringify(value);
  if(!s||s==='null'||s==='{}'||s==='[]') return '';
  if(s.length<=max) return label+': '+s;
  return label+': '+s.slice(0,max)+'…(truncado)';
}

function buildPlannerPrompt(command:string, context:any, messages:any[], correction:string){
  const caps=Array.isArray(context.capabilities)?context.capabilities:[];
  const atlas=(context.systemMap&&context.systemMap.atlas)||null;
  const parts=[
    budgetJson('ATLAS_VERIFICADO', atlas, 24000),
    budgetJson('MEMORIA_PERSISTENTE', context.memory, 6000),
    budgetJson('ESTADO_READ_ONLY', context.readOnlyData, 9000),
    budgetJson('ACCION_EN_CURSO', context.actionState, 3000),
    budgetJson('MAPA_BOTONES', (context.systemMap&&context.systemMap.buttons)||null, 10000),
    budgetJson('MAPA_CAMPOS', (context.systemMap&&context.systemMap.fields)||null, 8000),
    budgetJson('DIALOGOS', (context.systemMap&&context.systemMap.dialogs)||null, 3000),
    budgetJson('MODULOS_APRENDIDOS', (context.learnedMap&&(context.learnedMap.__index||Object.keys(context.learnedMap).slice(0,40)))||null, 2000),
    budgetJson('INVESTIGACION_WEB', context.externalResearch, 6500)
  ].filter(Boolean).join('\n').slice(0, 66000);

  return `Eres el CEREBRO de SIFER, un asistente inteligente integrado a un POS automotriz venezolano. Tu función no es hacer coincidencia de palabras: debes comprender la intención humana, usar el contexto disponible, razonar qué quiere conseguir el usuario y convertirlo en una operación segura y ejecutable.

INTERPRETACIÓN HUMANA:
- Comprende español natural, coloquial, abreviaturas, errores ortográficos, frases incompletas y sinónimos.
- Interpreta expresiones venezolanas de trabajo de mostrador cuando el significado sea claro.
- No exijas que el usuario use los nombres exactos de los botones o módulos.
- "quiero vender", "vamos a facturar", "ponme en ventas", "llévame al punto", "abre el POS" pueden expresar la misma intención.
- "dime cuánto hicimos", "qué vendimos hoy", "cuánto se ha vendido" son consultas de negocio; usa únicamente los datos reales suministrados.
- Mantén el contexto entre turnos: "búscalo", "ese", "esa pieza", "el que acabas de encontrar", "agrégale 10", "ahora importa ese", "ponle mínimo 30" deben resolverse usando el historial reciente, la memoria operativa y el estado real.
- Une fragmentos de una orden aunque lleguen en mensajes separados. Si el usuario primero identifica un artículo y luego da cantidad, mínimo o reorden, conserva esa entidad y completa la operación.
- Entiende números y unidades aunque estén expresados de distintas formas: "diez", "10", "10 unidades", "cien en existencia", "mínimo treinta", "reorden cuarenta".
- Distingue búsqueda de consulta de inventario: si el usuario dice "búscalo" puede significar buscar en el Catálogo Máster cuando ya indicó que no existe localmente.
- Distingue "consultar" de "incorporar": buscar un artículo no lo agrega; "importa", "incorpora", "añádelo a mi inventario" sí solicita incorporación.
- Si el usuario pide una operación compuesta, conserva todos sus parámetros al convertirla en una acción.

LENGUAJE NATURAL SIN REGLAS RÍGIDAS:
- No exijas palabras clave exactas: cualquier forma de pedirlo en español (coloquial, abreviado, con faltas de ortografía) debe mapearse a la misma capacidad.
- "agrega/añade/pon/mete N unidades del artículo X" o "ponme N X" = add_to_cart con quantity=N y query=X. Si el artículo no está en el inventario local, add_to_cart lo importa automáticamente desde el Catálogo Máster; también puedes encadenar search_catalog → import_catalog_item → add_to_cart.
- Si piden agregar unidades sin indicar cantidad, devuelve una pregunta breve (answer) pidiendo la cantidad antes de ejecutar.
- "importa/incrementa existencias de X con N unidades" = import_catalog_item (no confundir con agregar al carrito).
- "busca/encontrar/ubicar X" solo consulta; nunca modifica inventario ni carrito.

RAZONAMIENTO:
1. Determina el objetivo final, no solo las palabras literales.
2. Resuelve primero las referencias contextuales con historial y estado actual.
3. Comprueba si el artículo existe en inventario local; si no y el usuario pide buscar/importar, usa el Catálogo Máster.
4. Identifica y conserva todos los parámetros explícitos (cantidad, mínimo, reorden, cliente, descuento, etc.).
5. Comprueba el estado real del POS suministrado.
6. Elige la capacidad adecuada o crea un plan de varias capacidades.
7. Nunca inventes IDs, productos, clientes, precios, existencias, documentos o resultados.
8. Si falta un dato indispensable y no puede inferirse con seguridad, devuelve una pregunta breve como answer.
9. Las operaciones sensibles deben incluir confirmationText claro.
10. No ejecutes SQL, JavaScript arbitrario ni selectores inventados.
11. No afirmes que una acción fue realizada: solo propón acciones; el ejecutor local informará el resultado real.
12. Cuando exista una capacidad específica de negocio, prefierela sobre ui_click/ui_fill/ui_select.

EJECUCIÓN ATÓMICA:
- Cada acción debe ser autónoma: valida por sí sola y modifica UNA sola cosa.
- Máximo 8 pasos. Si necesitas más, simplifica o devuelve una pregunta al usuario.
- Ordena los pasos por precondición: primero navegar/abrir el módulo, luego localizar, luego llenar campos, luego confirmar.
- Si un paso depende del resultado de otro (buscar antes de importar, abrir caja antes de cobrar), encadénalos en ese orden exacto.
- Nunca repitas un paso idéntico "por si acaso".
- confirmationText es obligatorio solo cuando la capacidad tenga confirm:true (cobros, compras, pagos, Corte Z, devoluciones, anulaciones, descuentos altos); en las demás no lo incluyas.
- MEMORIA_PERSISTENTE contiene hechos aprendidos del usuario (preferencias, configuración) y fallos recientes: úsalos para responder mejor y no repetir lo que falló.
- ATLAS_VERIFICADO es el mapa real navegable del sistema con botones, campos y sus atributos data-sifer. Para ui_* usa SOLO identificadores presentes ahí; nunca inventes controles ni asumas campos de un módulo que no se haya navegado.

DEVUELVE SOLO JSON VÁLIDO. No muestres razonamiento interno paso a paso.
Nunca inventes una herramienta. Solo puedes usar estas capacidades:
${JSON.stringify(caps)}

Informativa:
{"ok":true,"type":"answer","answer":"respuesta basada únicamente en el contexto real"}

Una acción:
{"ok":true,"type":"action","action":{"name":"CAPACIDAD","args":{},"confirmationText":"..."}}

Varias acciones:
{"ok":true,"type":"plan","summary":"resultado esperado","actions":[{"name":"CAPACIDAD","args":{},"confirmationText":"..."}]}

Las capacidades ui_click/ui_fill/ui_select solo pueden usar controles visibles descritos en ATLAS_VERIFICADO o MAPA_BOTONES. Si una navegación cambia de módulo, no inventes los campos del módulo destino que no aparezcan en el mapa; usa capacidades de negocio o devuelve una pregunta.
- search_catalog sirve para localizar artículos reales del Catálogo Máster sin modificar el inventario.
- import_catalog_item sirve para localizar e incorporar un artículo del Catálogo Máster al inventario real. Debe conservar query, stock, min y reorderPoint cuando el usuario los haya indicado.
- Para órdenes como "busca el sensor de oxígeno del Aveo y, si no está, impórtalo con 100 unidades, mínimo 30 y reorden 40", la intención es una sola operación compuesta: resolver el artículo en el catálogo y luego incorporarlo con esos parámetros.
- Si el usuario usa pronombres ("búscalo", "ese", "ese mismo"), toma como referencia la entidad más reciente y suficientemente clara del historial; no inventes otra.

CONTEXTO REAL DEL POS:
${parts}

SOLICITUD DEL USUARIO:
${command}

HISTORIAL RECIENTE:
${JSON.stringify(messages).slice(0, 12000)}${correction?`

CORRIGE ESTE ERROR Y DEVUELVE SOLO JSON VÁLIDO:
${correction}`:''}`;
}

export default async function handler(req:any, res:any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const hasDirectAI = Boolean(GROQ_API_KEY || OLLAMA_BASE_URL || process.env.DEEPSEEK_API_KEY || process.env.AI_COMPATIBLE_BASE_URL || process.env.TAVILY_API_KEY || (process.env.GOOGLE_CSE_API_KEY && process.env.GOOGLE_CSE_CX));
  if (!NVIDIA_API_KEY && !hasDirectAI) return res.status(503).json({ error: 'SIFER no tiene NVIDIA_API_KEY configurada en producción.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const mode = ['plan','transcribe','research'].includes(body.mode) ? body.mode : 'chat';
    const command = String(body.command || '').slice(0, 4000);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const context = body.context || {};
    const capabilities = Array.isArray(context.capabilities) ? context.capabilities : [];

    if (mode === 'research') {
      const query=String(body.query||body.command||'').trim().slice(0,300);
      if(!query) return res.status(400).json({ok:false,error:'Indica qué repuesto, referencia o imagen quieres buscar.'});
      const result=await externalResearch(query);
      return res.status(200).json({ok:true,...result});
    }

    if (mode === 'transcribe') {
      if (!NVIDIA_API_KEY && !GROQ_API_KEY) return res.status(503).json({ error: 'Configura GROQ_API_KEY para transcripción gratuita con límites o NVIDIA_API_KEY.' });
      const audioBase64 = String(body.audioBase64 || '');
      const mimeType = String(body.mimeType || 'audio/webm').split(';')[0];
      if (!audioBase64) return res.status(400).json({ error: 'No se recibió audio.' });
      if (!/^audio\//i.test(mimeType)) return res.status(400).json({ error: 'Formato de audio no válido.' });
      if (audioBase64.length > 12000000) return res.status(413).json({ error: 'El audio es demasiado grande.' });
      try {
        const text = await transcribeAudio(audioBase64, mimeType);
        if (!text) return res.status(422).json({ error: 'No pude entender la frase del audio.' });
        return res.status(200).json({ ok:true, text });
      } catch (err:any) {
        return res.status(502).json({ error: 'No pude transcribir el audio: '+String(err?.message||err).slice(0,240) });
      }
    }

    if (mode === 'plan') {
      const wantsWeb=/\b(foto|fotografia|imagen|imagen real|foto real|busca en la web|en internet|referencia cruzada|referencias cruzadas|equivalencia|compatibilidad|compatible|oem|numero de parte)\b/i.test(command);
      if(wantsWeb) { try { context.externalResearch=await externalResearch(command); } catch {} }
      const allowed = capabilities.map((x:any) => x.name).filter(Boolean);
      let plan:any = null;
      let lastError = '';
      for (let attempt = 0; attempt < 3 && !plan; attempt++) {
        const plannerPrompt = buildPlannerPrompt(command, context, messages, lastError);
        let planText:string|null = null;
        try { const d = await tryFreeProviders(plannerPrompt); planText = d?.text || null; } catch {}
        if(!planText&&GROQ_API_KEY){try{planText=await groqChat([{role:'user',content:plannerPrompt}],{json:true,max_tokens:1800,temperature:0.1});}catch{}}
        if (!planText) {
          try { planText = await nvidiaChat([{role:'user',content:plannerPrompt}], {json:true, max_tokens:1800, temperature:0.1}); } catch {}
        }
        if (!planText) { lastError = 'El proveedor de IA no respondió.'; continue; }
        const parsed = cleanJson(planText);
        if (!parsed || parsed.ok !== true) { lastError = 'La respuesta no es JSON válido con ok:true.'; continue; }
        const v = validatePlanShape(parsed, allowed, context);
        if (v) { lastError = v; continue; }
        plan = parsed;
      }
      if (!plan) return res.status(422).json({ error: 'SIFER no pudo producir un plan válido. ' + String(lastError || '').slice(0, 300) });
      return res.status(200).json(plan);
    }

    const systemInstruction = `Eres SIFER, asistente inteligente de SIFER360, un POS especializado en repuestos automotrices, aceites y lubricantes en Venezuela. Habla español, sé profesional, directo y seguro. Tu personalidad es amable, elegante, ingeniosa y ligeramente sarcástica, inspirada en un asistente tecnológico de ciencia ficción: humor breve y oportuno, nunca burlón, ofensivo ni condescendente. No conviertas cada respuesta en un chiste; primero resuelve y luego, cuando encaje, añade una frase simpática. SIFER es un POS, no un ERP. No inventes datos. Usa el mapa operativo y el estado suministrado como fuente de verdad. Puedes explicar módulos, productos, ventas, inventario y flujos. No expongas secretos, claves, tokens ni variables de entorno. Las operaciones que modifican datos se ejecutan mediante el motor de acciones de SIFER y requieren las confirmaciones correspondientes. Módulo actual: ${String(context.module || 'Inicio').slice(0,100)}. Estado: ${JSON.stringify(context.readOnlyData || {}).slice(0,28000)}. Mapa: ${JSON.stringify(context.systemMap || {}).slice(0,28000)}`;

    const chatTurns = messages
      .filter((m:any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map((m:any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content.slice(0, 4000) }));

    const flatPrompt = systemInstruction + (chatTurns.length ? '\n\nHISTORIAL:\n' + chatTurns.map((m:any) => m.role + ': ' + m.content).join('\n') : '') + '\n\nUSUARIO:\n' + (command || 'Hola');
    const direct = await tryFreeProviders(flatPrompt);
    let answer = direct?.text || null;
    if (!answer && NVIDIA_API_KEY) {
      answer = await nvidiaChat([{role:'system',content:systemInstruction}, ...chatTurns], {temperature:0.5, max_tokens:900});
    }
    if (!answer) return res.status(503).json({ error: 'SIFER no tiene ningún proveedor de IA configurado (NVIDIA_API_KEY u otro).' });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(answer);
  } catch (error) {
    console.error('SIFER assistant error:', error);
    if (!res.headersSent) { const detail = error instanceof Error ? error.message : String(error || 'error desconocido'); return res.status(502).json({ error: 'SIFER no pudo comunicarse con NVIDIA. '+detail.slice(0,240) }); }
    return res.end();
  }
}
