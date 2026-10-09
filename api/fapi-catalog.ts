/**
 * SIFER -> FAPI catalog proxy.
 * Keeps FAPI_API_KEY server-side; never accepts an arbitrary upstream URL.
 * Configure FAPI_API_KEY in Vercel Production Environment Variables.
 */
const BASE = 'https://fapi.iisis.ru/fapi/v2';
const text = (v: unknown, max = 120) => String(v ?? '').trim().slice(0, max);
const allowedModes = new Set(['product', 'analog', 'manufacturers', 'usage']);

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const key = process.env.FAPI_API_KEY;
  if (!key) return res.status(503).json({ ok: false, configured: false, error: 'FAPI no configurado' });

  const mode = text(req.query?.mode || 'product', 24);
  if (!allowedModes.has(mode)) return res.status(400).json({ ok: false, error: 'Modo no permitido' });
  const q = text(req.query?.q, 105);
  if ((mode === 'product' || mode === 'analog') && q.length < 2) {
    return res.status(400).json({ ok: false, error: 'Indica un código o número de pieza de al menos 2 caracteres' });
  }

  const params = new URLSearchParams();
  let path = '/usage';
  if (mode === 'product') {
    path = '/productList';
    params.set('n', q);
    if (/\s/.test(q)) params.set('comparison', 'true');
  } else if (mode === 'analog') {
    path = '/analogList';
    params.set('n', q);
    const mfi = Number(req.query?.mfi);
    if (Number.isInteger(mfi) && mfi > 0) params.set('mfi', String(mfi));
    const rating = Number(req.query?.rating);
    if (Number.isInteger(rating) && rating >= 0 && rating <= 100) params.set('r', String(rating));
  } else if (mode === 'manufacturers') {
    path = '/manufacturerList';
  }

  try {
    const upstream = await fetch(BASE + path + (params.size ? '?' + params.toString() : ''), {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + key, Accept: 'application/json' }
    });
    const raw = await upstream.text();
    let payload: any;
    try { payload = raw ? JSON.parse(raw) : {}; } catch { payload = { message: 'Respuesta no JSON del proveedor' }; }
    if (!upstream.ok) {
      // Do not relay the key or upstream request headers. Preserve provider status for diagnosis.
      return res.status(upstream.status === 401 || upstream.status === 402 || upstream.status === 403 ? upstream.status : 502)
        .json({ ok: false, provider: 'FAPI', providerStatus: upstream.status, error: 'FAPI rechazó o no pudo completar la consulta', details: payload });
    }
    return res.status(200).json({ ok: true, configured: true, provider: 'FAPI', mode, data: payload });
  } catch {
    return res.status(502).json({ ok: false, provider: 'FAPI', error: 'No fue posible conectar con el catálogo externo' });
  }
}
