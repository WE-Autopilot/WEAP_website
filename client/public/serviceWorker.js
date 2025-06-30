/**
 * Service Worker for WE Autopilot Website
 * Provides offline functionality and caching for a better user experience
 */

// Cache name with version
const CACHE_NAME = "weap-cache-v1";

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/Logo_trimmed.svg",
  "/headerlogo.png",
  "/vectors/HeaderVector.svg",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force activation on all clients

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) =>
        console.error("Service Worker: Cache installation failed", err)
      )
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log("Service Worker: Removing old cache", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim(); // Take control of all clients
      })
  );
});

// Helper to check if URL is one we should network-first
const isNetworkFirstRequest = (url) => {
  const networkFirstPatterns = [
    // API requests
    /\/api\//,
    // Dynamic routes
    /\/contact/,
    // Main HTML
    /\/index.html$/,
  ];

  return networkFirstPatterns.some((pattern) => pattern.test(url));
};

// Helper to determine if request should be cached
const shouldCache = (url, response) => {
  // Don't cache error responses
  if (!response || response.status !== 200) return false;

  // Don't cache API responses
  if (url.includes("/api/")) return false;

  // Cache responses that can be safely stored
  const contentType = response.headers.get("content-type");
  if (!contentType) return false;

  // Cache static assets and HTML pages
  return (
    contentType.includes("text/html") ||
    contentType.includes("text/css") ||
    contentType.includes("application/javascript") ||
    contentType.includes("image/")
  );
};

// Fetch event - intercept requests
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests
  if (requestUrl.origin !== location.origin) {
    return;
  }

  // Strategy based on request type
  if (isNetworkFirstRequest(requestUrl.pathname)) {
    // Network-first strategy for dynamic content
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();

          if (shouldCache(requestUrl.href, response)) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clonedResponse))
              .catch((err) => console.error("Cache put error:", err));
          }

          return response;
        })
        .catch(() => {
          console.log(
            "Service Worker: Falling back to cache for",
            requestUrl.href
          );
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/index.html");
          });
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse;
        }

        // Not in cache, get from network
        return fetch(event.request).then((response) => {
          const clonedResponse = response.clone();

          if (shouldCache(requestUrl.href, response)) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clonedResponse))
              .catch((err) => console.error("Cache put error:", err));
          }

          return response;
        });
      })
    );
  }
});

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
