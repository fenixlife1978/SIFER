import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.8-flash';
const ENV_NAME = 'GEMINI_' + 'API_' + 'KEY';

function safeText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function friendlyError(error: unknown) {
  const message = safeText((error as any)?.message).toLowerCase();
  if (message.includes('quota') || message.includes('rate') || message.includes('resource exhausted')) {
    return 'En este momento el servicio de inteligencia está temporalmente limitado. Intenta nuevamente en unos segundos.';
  }
  if (message.includes('safety') || message.includes('blocked')) {
    return 'No puedo procesar esa solicitud con las reglas de seguridad actuales. Puedo ayudarte con las funciones del POS SIFER.';
  }
  return 'Todavía no tengo habilitada esa capacidad de consulta en SIFER. Puedo responder sobre las funciones y datos que actualmente tengo disponibles.';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const apiKey = process.env[ENV_NAME];
  if (!apiKey) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('SIFER todavía no tiene conectada la inteligencia externa. La interfaz del POS permanece intacta.');
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const context = body.context || {};
    const readOnlyData = context.readOnlyData || {};

    const contents = messages
      .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content.slice(0, 4000) }]
      }));

    const systemInstruction = `Eres SIFER, asistente inteligente de SIFER360, un POS especializado en repuestos automotrices, aceites y lubricantes en Venezuela.
Habla español, sé profesional, directo y seguro. SIFER es un POS, no un ERP.
No inventes datos. En esta fase conversa, analiza y explica; no afirmes haber ejecutado acciones reales.
Tienes acceso únicamente a datos de consulta enviados por la interfaz actual del POS.
Úsalos para responder preguntas reales cuando la información esté disponible. El bloque resumenHoy contiene los totales calculados por el propio POS para la fecha actual; cuando el usuario pregunte cuánto se vendió hoy, usa esos valores directamente y aclara la moneda si está disponible. No respondas que la capacidad no está habilitada si resumenHoy contiene datos.
Si un dato no aparece en el contexto, dilo claramente.
Si el usuario pide una capacidad que todavía no existe, informa que esa capacidad aún no está habilitada y explica qué sí puedes hacer.
No puedes modificar, crear, eliminar, cobrar, devolver ni cerrar operaciones.
Módulo actual: ${String(context.module || 'Inicio').slice(0, 100)}`;

    let dataText = '{}';
    try {
      dataText = JSON.stringify(readOnlyData).slice(0, 45000);
    } catch {
      dataText = '{"error":"Los datos de consulta no pudieron serializarse."}';
    }

    const enrichedContents = contents.length
      ? contents.map((m: any, i: number) =>
          i === contents.length - 1 && m.role === 'user'
            ? { ...m, parts: [{ text: m.parts[0].text + '\n\nDATOS DE CONSULTA ACTUALES DEL POS (solo lectura):\n' + dataText }] }
            : m
        )
      : [{ role: 'user', parts: [{ text: 'Hola\n\nDATOS DE CONSULTA ACTUALES DEL POS (solo lectura):\n' + dataText }] }];

    const ai = new GoogleGenAI({ apiKey });
    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents: enrichedContents,
      config: { systemInstruction, temperature: 0.25, maxOutputTokens: 900 }
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
    if (!res.headersSent) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(friendlyError(error));
    } else {
      res.end();
    }
  }
}
