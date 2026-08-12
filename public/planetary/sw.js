/* Walkable Worlds — lightweight offline shell + radio clip
 * Scope-aware so embedding at /planetary/ does not hijack the whole origin.
 */
const CACHE = 'ww-shell-v3';
const RADIO_CACHE = 'ww-radio-clip-v1';

function basePath() {
  try {
    const p = new URL(self.registration.scope).pathname;
    return p.endsWith('/') ? p : `${p}/`;
  } catch {
    return '/';
  }
}

function underScope(pathname, base) {
  if (base === '/') return true;
  const prefix = base.slice(0, -1); // /planetary
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

self.addEventListener('install', (event) => {
  const base = basePath();
  const shell = [
    base,
    `${base}index.html`,
    `${base}favicon.svg`,
    `${base}manifest.webmanifest`,
  ];
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(shell)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== RADIO_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const base = basePath();
  if (!underScope(url.pathname, base)) return;

  if (url.pathname.includes('/offline-radio/')) {
    event.respondWith(
      caches.open(RADIO_CACHE).then((c) =>
        c.match(req).then((hit) => hit || new Response('No offline clip', { status: 404 })),
      ),
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        if (
          res.ok &&
          (url.pathname === base ||
            url.pathname === base.slice(0, -1) ||
            url.pathname.endsWith('.html') ||
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css'))
        ) {
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((c) => c || caches.match(base) || caches.match(`${base}index.html`)),
      ),
  );
});
