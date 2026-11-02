/**
 * LearnX Offline Service Worker
 * Implements Cache Storage for offline learning system.
 */

const CACHE_NAME = "learnx-v1";
const OFFLINE_URLS = [
  "/",
  "/favicon.svg",
  "/offline-learning",
];

// Install: pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch((err) => {
        console.warn("Service Worker pre-cache partial warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first with Cache fallback for navigation & static assets
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Avoid intercepting API calls if online (let IndexedDB/Axios handle offline)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.mode === "navigate") {
          return caches.match("/offline-learning") || caches.match("/");
        }
        return new Response("Offline resource unavailable", {
          status: 503,
          statusText: "Service Unavailable (Offline)",
        });
      })
  );
});
