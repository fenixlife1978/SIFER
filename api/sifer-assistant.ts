import { GoogleGenAI } from '@google/genai';
const MODEL = 'gemini-3.8-flash';
const ENV_NAME = 'GEMINI_' + 'API_' + 'KEY';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const apiKey = process.env[ENV_NAME];
  if (!apiKey) return res.status(503).json({ error: 'SIFER AI todavía no está configurado. Falta la variable de Google AI en Vercel.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const context = body.context || {};
    const contents = messages.filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 4000) }] }));
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `Eres SIFER, asistente inteligente de SIFER360, un POS especializado en repuestos automotrices, aceites y lubricantes en Venezuela. Habla español, sé profesional, directo y seguro. SIFER es un POS, no un ERP. No inventes datos. En esta fase conversa, analiza y explica; no afirmes haber ejecutado acciones reales. No expongas secretos, claves, tokens ni variables de entorno. Las operaciones que cambien datos se habilitarán después mediante herramientas reales y confirmación explícita. Módulo actual: ${String(context.module || 'Inicio').slice(0,100)}`;
    const stream = await ai.models.generateContentStream({ model: MODEL, contents: contents.length ? contents : [{ role: 'user', parts: [{ text: 'Hola' }] }], config: { systemInstruction, temperature: 0.25, maxOutputTokens: 900 } });
    res.statusCode = 200; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.setHeader('Cache-Control', 'no-store');
    for await (const chunk of stream) { const text = chunk.text || ''; if (text) res.write(text); }
    return res.end();
  } catch (error) { console.error('SIFER assistant error:', error); if (!res.headersSent) return res.status(500).json({ error: 'Error interno del asistente SIFER.' }); return res.end(); }
}
