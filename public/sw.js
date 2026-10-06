const CACHE='sifer360-static-v2';
const STATIC_ASSETS=['/icon.svg','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  // Nunca cachear HTML ni JavaScript de la aplicación: evita que una versión vieja
  // del POS/SIFER sobreviva a un despliegue de producción.
  if(url.pathname==='/'||url.pathname.endsWith('.html')||url.pathname.endsWith('.js'))return;
  event.respondWith(fetch(event.request).then(r=>{
    if(r.ok && (url.pathname.endsWith('.svg')||url.pathname.endsWith('.webmanifest'))){const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
    return r;
  }).catch(()=>caches.match(event.request)));
});