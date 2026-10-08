// Service worker : l'app s'ouvre même sans réseau.
// Page : réseau d'abord (pour recevoir les mises à jour), cache si pas de réponse en 3 s.
// Polices et icônes : cache d'abord.
const VERSION = 'v1';
const CACHE = 'juggernaut-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './fonts/archivo-latin-400-normal.woff2',
  './fonts/archivo-latin-500-normal.woff2',
  './fonts/archivo-latin-600-normal.woff2',
  './fonts/archivo-latin-700-normal.woff2',
  './fonts/big-shoulders-display-latin-600-normal.woff2',
  './fonts/big-shoulders-display-latin-700-normal.woff2',
  './fonts/big-shoulders-display-latin-800-normal.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('juggernaut-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cachedPage() {
  return caches.match('./index.html').then((r) => r || caches.match('./'));
}

function networkFirst(request) {
  return new Promise((resolve) => {
    let settled = false;
    const useCache = () => cachedPage().then((r) => r || Response.error());
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cachedPage().then((r) => resolve(r || fetch(request).catch(() => Response.error())));
    }, 3000);
    fetch(request)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
        }
        if (!settled) { settled = true; clearTimeout(timer); resolve(res); }
      })
      .catch(() => {
        if (!settled) { settled = true; clearTimeout(timer); useCache().then(resolve); }
      });
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
      }
      return res;
    }))
  );
});
