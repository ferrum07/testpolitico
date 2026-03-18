// sw.js — indecisos.es Service Worker
const CACHE = 'indecisos-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/quiz-engine.js',
  '/como-funciona.html',
  '/aviso-legal.html',
  '/generales/index.html',
  '/generales/app.js',
  '/cyl/index.html',
  '/cyl/app.js',
  '/logos/psoe.png',
  '/logos/pp.png',
  '/logos/vox.png',
  '/logos/sumar.png',
  '/logos/upl.png',
  '/logos/poravila.png',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo cachear GET
  if (e.request.method !== 'GET') return;
  // No cachear requests externos (analytics, CDN de librerías del test)
  if (!e.request.url.startsWith(self.location.origin) &&
      !e.request.url.startsWith('https://fonts.googleapis.com') &&
      !e.request.url.startsWith('https://fonts.gstatic.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => {
        // Sin conexión y sin caché: mostrar index si es navegación
        if (e.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});
