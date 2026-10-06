import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.8-flash';
const ENV_NAME = 'GEMINI_' + 'API_' + 'KEY';

function cleanJson(value) {
  const text = String(value || '').trim().replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/,'').replace(/\s*\`\`\`$/,'');
  try { return JSON.parse(text); } catch {}
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch {}
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const apiKey = process.env[ENV_NAME];
  if (!apiKey) return res.status(503).json({ error: 'SIFER AI todavía no está configurado. Falta la variable de Google AI en Vercel.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const mode = body.mode === 'plan' || body.mode === 'transcribe' ? body.mode : 'chat';
    const command = String(body.command || '').slice(0, 4000);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const context = body.context || {};
    const capabilities = Array.isArray(context.capabilities) ? context.capabilities : [];

    const ai = new GoogleGenAI({ apiKey: apiKey });

    if (mode === 'transcribe') {
      const audioBase64 = String(body.audioBase64 || '');
      const mimeType = String(body.mimeType || 'audio/webm').split(';')[0];
      if (!audioBase64) return res.status(400).json({ error: 'No se recibió audio.' });
      if (!/^audio\\//i.test(mimeType)) return res.status(400).json({ error: 'Formato de audio no válido.' });
      if (audioBase64.length > 12000000) return res.status(413).json({ error: 'El audio es demasiado grande.' });
      const result = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [
          { text: 'Transcribe exactamente lo que dice el usuario en este audio. Devuelve SOLO la transcripción en español, sin explicación. Conserva nombres, números, productos, cantidades y expresiones coloquiales venezolanas.' },
          { inlineData: { mimeType, data: audioBase64 } }
        ] }],
        config: { maxOutputTokens: 500, thinkingConfig: { thinkingLevel: 'low' } }
      });
      return res.status(200).json({ text: String(result.text || '').trim() });
    }

    if (mode === 'plan') {
      const allowed = capabilities.map(x => x.name).filter(Boolean);
      const plannerPrompt = `Eres el CEREBRO de SIFER, un asistente inteligente integrado a un POS automotriz venezolano. Tu función no es hacer coincidencia de palabras: debes comprender la intención humana, usar el contexto disponible, razonar qué quiere conseguir el usuario y convertirlo en una operación segura y ejecutable.

INTERPRETACIÓN HUMANA:
- Comprende español natural, coloquial, abreviaturas, errores ortográficos, frases incompletas y sinónimos.
- Interpreta expresiones venezolanas de trabajo de mostrador cuando el significado sea claro.
- No exijas que el usuario use los nombres exactos de los botones o módulos.
- "quiero vender", "vamos a facturar", "ponme en ventas", "llévame al punto", "abre el POS" pueden expresar la misma intención.
- "dime cuánto hicimos", "qué vendimos hoy", "cuánto se ha vendido" son consultas de negocio; usa únicamente los datos reales suministrados.
- Mantén el contexto: referencias como "ese cliente", "el segundo", "agrégale dos" deben resolverse con historial y estado actual cuando sea posible.
- Corrige mentalmente errores evidentes de escritura sin obligar al usuario a repetir la orden.

RAZONAMIENTO:
1. Determina qué resultado quiere realmente el usuario.
2. Comprueba el estado real del POS suministrado.
3. Elige la capacidad adecuada.
4. Si hacen falta varios pasos, ordénalos lógicamente.
5. Nunca inventes IDs, productos, clientes, precios, existencias, documentos o resultados.
6. Si falta un dato indispensable y no puede inferirse con seguridad, devuelve una pregunta breve como answer.
7. Las operaciones sensibles deben incluir confirmationText claro.
8. No ejecutes SQL, JavaScript arbitrario ni selectores inventados.
9. No afirmes que una acción fue realizada: solo propón acciones; el ejecutor local informará el resultado real.

DEVUELVE SOLO JSON VÁLIDO. No muestres razonamiento interno paso a paso.
Nunca inventes una herramienta. Solo puedes usar estas capacidades:
${JSON.stringify(capabilities)}

Informativa:
{"ok":true,"type":"answer","answer":"respuesta basada únicamente en el contexto real"}

Una acción:
{"ok":true,"type":"action","action":{"name":"CAPACIDAD","args":{},"confirmationText":"..."}}

Varias acciones:
{"ok":true,"type":"plan","summary":"resultado esperado","actions":[{"name":"CAPACIDAD","args":{},"confirmationText":"..."}]}

Las capacidades ui_click/ui_fill/ui_select solo pueden usar controles visibles descritos en systemMap. Si una navegación cambia de módulo, no inventes los campos del módulo destino que no aparecen en el mapa actual. Usa una capacidad específica si existe o solicita el dato faltante.

CONTEXTO REAL DEL POS:
${JSON.stringify(context).slice(0, 50000)}

SOLICITUD DEL USUARIO:
${command}

HISTORIAL RECIENTE:
${JSON.stringify(messages).slice(0, 12000)}`;

      const result = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: plannerPrompt }] }],
        config: { maxOutputTokens: 1800, responseMimeType: 'application/json', thinkingConfig: { thinkingLevel: 'medium' } }
      });
      const plan = cleanJson(result.text || '');
      if (!plan || plan.ok !== true) return res.status(422).json({ error: 'SIFER no pudo producir un plan válido para esa solicitud.' });

      if (plan.type === 'action') {
        const name = String(plan.action?.name || '');
        if (!allowed.includes(name)) return res.status(422).json({ error: 'La interpretación propuso una operación que SIFER no tiene habilitada.' });
        plan.action.args = plan.action.args && typeof plan.action.args === 'object' ? plan.action.args : {};
      }
      if (plan.type === 'plan') {
        if (!Array.isArray(plan.actions) || plan.actions.length < 1 || plan.actions.length > 12) return res.status(422).json({ error: 'El plan de SIFER no es válido.' });
        for (const action of plan.actions) {
          const name = String(action?.name || '');
          if (!allowed.includes(name)) return res.status(422).json({ error: 'El plan contiene una operación no habilitada por SIFER.' });
          action.args = action.args && typeof action.args === 'object' ? action.args : {};
        }
      }
      return res.status(200).json(plan);
    }

    const contents = messages
      .filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 4000) }] }));

    const systemInstruction = `Eres SIFER, asistente inteligente de SIFER360, un POS especializado en repuestos automotrices, aceites y lubricantes en Venezuela. Habla español, sé profesional, directo y seguro. SIFER es un POS, no un ERP. No inventes datos. Usa el mapa operativo y el estado suministrados como fuente de verdad. Puedes explicar módulos, productos, ventas, inventario y flujos. No expongas secretos, claves, tokens ni variables de entorno. Las operaciones que modifican datos se ejecutan mediante el motor de acciones de SIFER y requieren las confirmaciones correspondientes. Módulo actual: ${String(context.module || 'Inicio').slice(0,100)}. Estado: ${JSON.stringify(context.readOnlyData || {}).slice(0,28000)}. Mapa: ${JSON.stringify(context.systemMap || {}).slice(0,28000)}`;

    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: contents.length ? contents : [{ role: 'user', parts: [{ text: 'Hola' }] }],
      config: { systemInstruction, maxOutputTokens: 1200, thinkingConfig: { thinkingLevel: 'low' } }
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    for await (const chunk of stream) {
      const text = chunk.text || '';
      if (text) res.write(text);
    }
    return res.end();
  } catch (error) {
    console.error('SIFER assistant error:', error);
    if (!res.headersSent) return res.status(500).json({ error: 'Error interno del asistente SIFER.' });
    return res.end();
  }
}
