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
    const mode = body.mode === 'plan' ? 'plan' : 'chat';
    const command = String(body.command || '').slice(0, 4000);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    const context = body.context || {};
    const capabilities = Array.isArray(context.capabilities) ? context.capabilities : [];

    const ai = new GoogleGenAI({ apiKey: apiKey });

    if (mode === 'plan') {
      const allowed = capabilities.map(x => x.name).filter(Boolean);
      const plannerPrompt = `Eres el motor de interpretación y planificación de SIFER, un POS automotriz venezolano. Tu trabajo es ENTENDER la intención del usuario, interpretar lenguaje natural, contexto y errores ortográficos, decidir qué operación corresponde y devolver un plan ejecutable.

No muestres razonamiento interno paso a paso. Devuelve únicamente JSON.
Nunca inventes una herramienta. Solo puedes usar estas capacidades: ${JSON.stringify(capabilities)}.
Si la solicitud es informativa y no requiere acción, devuelve:
{"ok":true,"type":"answer","answer":"..."}
Si requiere una sola acción, devuelve:
{"ok":true,"type":"action","action":{"name":"CAPACIDAD","args":{},"confirmationText":"..."}}
Si requiere varias acciones encadenadas, devuelve:
{"ok":true,"type":"plan","summary":"Resumen breve de lo realizado","actions":[{"name":"CAPACIDAD","args":{},"confirmationText":"..."}]}
Usa planes de varios pasos cuando la solicitud lo requiera (por ejemplo abrir un formulario, llenar campos y finalmente guardar).
Los argumentos deben usar el estado real suministrado. Para seleccionar un producto, cliente, documento o línea, usa sus IDs o índices reales cuando estén disponibles.
Las capacidades ui_click/ui_fill/ui_select solo pueden operar controles y campos visibles del mapa DOM actual; no inventes selectores ni ejecutes JavaScript arbitrario.
No ejecutes directamente: tu salida será validada por el ejecutor local antes de tocar el POS.
Si falta información indispensable para una acción, pide una aclaración como answer en vez de inventarla.
Contexto actual:
${JSON.stringify(context).slice(0, 50000)}

Solicitud del usuario:
${command}

Historial reciente:
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
