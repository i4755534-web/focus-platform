// Advanced PWA Service Worker for FOCUS
const CACHE_NAME = 'focus-v2.0';
const STATIC_CACHE = 'focus-static-v2.0';
const DYNAMIC_CACHE = 'focus-dynamic-v2.0';
const API_CACHE = 'focus-api-v2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/auth/user',
  '/api/channels',
  '/api/messages/recent'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then(cache => {
        console.log('[SW] Caching API endpoints');
        return cache.addAll(API_ENDPOINTS.map(url => new Request(url, { mode: 'no-cors' })));
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      // Take control of all clients
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first, cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    // Images - Cache first, network fallback
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.match(/\.(js|css)$/)) {
    // Static assets - Cache first, network fallback
    event.respondWith(handleStaticRequest(request));
  } else {
    // Pages - Network first, cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response
  return new Response(JSON.stringify({ error: 'Offline', message: 'No internet connection' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle image requests
async function handleImageRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for image');
  }

  // Return placeholder
  return new Response('', { status: 404 });
}

// Handle static assets
async function handleStaticRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for static asset');
  }

  return new Response('', { status: 404 });
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed for page, trying cache');
  }

  // Try cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page
  const offlineResponse = await caches.match('/offline.html');
  if (offlineResponse) {
    return offlineResponse;
  }

  // Fallback
  return new Response('Offline - Please check your internet connection', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'New message in FOCUS',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey || 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'FOCUS', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync functions
async function syncMessages() {
  try {
    // Sync pending messages
    console.log('[SW] Syncing messages...');
    // Implementation would sync pending messages here
  } catch (error) {
    console.error('[SW] Message sync failed:', error);
  }
}

async function updateContent() {
  try {
    // Update cached content
    console.log('[SW] Updating content...');
    // Implementation would update content here
  } catch (error) {
    console.error('[SW] Content update failed:', error);
  }
}

// Cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

  await Promise.all(
    cacheNames.map(cacheName => {
      if (!validCaches.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
}