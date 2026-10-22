// Offline cache for the web app: always try the network first (so updates arrive at once),
// fall back to the saved copy when offline.
const CACHE = 'lpp-2.1.1-048ac6a570';
const ASSETS = ['./', 'index.html', 'app.js?v=2.1.1', 'app.css?v=2.1.1', 'manifest.webmanifest', 'fonts/Inter-Regular.woff', 'fonts/Inter-Medium.woff', 'fonts/Inter-SemiBold.woff', 'fonts/Inter-Bold.woff', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(a => new Request(a, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const page = u.pathname.endsWith('/') || u.pathname.endsWith('index.html');
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: page }).then(r => r || caches.match('index.html'))));
});
