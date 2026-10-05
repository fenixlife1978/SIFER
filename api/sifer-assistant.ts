import { streamText } from 'ai';

const MODEL = 'openai/gpt-5.5';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return res.status(503).json({
      error: 'SIFER AI todavía no está configurado. Falta la variable AI_GATEWAY_API_KEY en Vercel.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const context = body.context || {};

    const safeMessages = messages
      .filter(m => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

    const result = streamText({
      model: MODEL,
      system: `Eres SIFER, el asistente inteligente del sistema SIFER360, un POS especializado en repuestos automotrices, aceites y lubricantes en Venezuela.

Tu personalidad es profesional, directa, segura y elegante, inspirada en un asistente tecnológico tipo JARVIS, pero sin imitar literalmente a ningún personaje protegido.

Reglas:
- Habla principalmente en español.
- Conoce que SIFER es un POS, no un ERP.
- No inventes datos del inventario, ventas, caja, clientes o documentos.
- En esta fase solo conversa, analiza y explica. NO afirmes haber ejecutado acciones reales.
- No expongas secretos, claves, tokens ni variables de entorno.
- Si el usuario pide una operación financiera, destructiva o que cambie datos, indica que esa capacidad será habilitada con confirmación explícita en la siguiente fase.
- Sé breve salvo que el usuario pida detalle.

Contexto actual:
Módulo visible: ${String(context.module || 'Inicio').slice(0,100)}
Sistema: SIFER360 POS Automotriz.`,
      messages: safeMessages,
      maxOutputTokens: 900,
    });

    const response = result.toTextStreamResponse();
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('SIFER assistant error:', error);
    return res.status(500).json({ error: 'Error interno del asistente SIFER.' });
  }
}
