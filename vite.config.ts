import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const API_BODY_LIMIT = 16 * 1024 * 1024;

function readBody(req: any): Promise<any> {
  return new Promise(resolve => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size <= API_BODY_LIMIT) chunks.push(c);
    });
    req.on('end', () => {
      if (size > API_BODY_LIMIT) return resolve({__tooLarge:true});
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
    });
    req.on('error', () => resolve({}));
  });
}

function attachJsonHelpers(res: any) {
  if (res.status && res.json) return;
  res.status = (code: number) => { res.statusCode = code; return res; };
  res.json = (payload: any) => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
    return res;
  };
}

function localApi(): Plugin {
  return {
    name: 'sifer-local-api',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any) => {
        const url = String(req.url || '');
        if (!url.startsWith('/api/')) return;
        const name = url.slice('/api/'.length).split('?')[0].replace(/\/+$/, '');
        if (!/^[a-z0-9][a-z0-9\-]*$/i.test(name)) return;
        try {
          const mod = await server.ssrLoadModule(path.resolve(__dirname, `api/${name}.ts`));
          const handler = mod?.default;
          if (typeof handler !== 'function') {
            res.statusCode = 404;
            res.end(JSON.stringify({ok:false, error:'Endpoint no encontrado: /api/'+name}));
            return;
          }
          req.body = await readBody(req);
          attachJsonHelpers(res);
          await handler(req, res);
          if (!res.writableEnded) res.end();
        } catch (e: any) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ok:false, error:String(e?.message || e)}));
          } else if (!res.writableEnded) {
            res.end();
          }
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
