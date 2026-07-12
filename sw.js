// BrainDump service worker
//
// Why the app previously needed an uninstall/reinstall to pick up updates: a typical "cache-first"
// service worker checks its cache before the network, finds index.html already sitting there, and
// serves that forever — it never even asks the network if something newer exists. The three things
// below fix that permanently:
//
//   1. Network-first fetching — always try the network first; only fall back to the cache when
//      offline. This means a normal page load simply gets the latest deployed file, no special
//      "update" step required.
//   2. self.skipWaiting() — a newly-installed service worker normally sits "waiting" until every
//      open tab of the app is closed before it activates. skipWaiting() makes it activate immediately.
//   3. self.clients.claim() — makes the new service worker take control of any already-open tabs
//      right away, instead of only affecting the next fresh page load.
//
// Bump VERSION any time you want to force old cached entries to be cleared out immediately (not
// strictly required day-to-day, since network-first already prefers fresh content whenever online).
const VERSION = 'braindump-v2';
const APP_SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(APP_SHELL).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Skip cross-origin requests (CDN scripts, Supabase, Google APIs, etc.) — let the browser handle
  // those normally rather than trying to cache/intercept them here.
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
