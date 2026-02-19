// Service Worker para Travel English PWA
// Nome do cache
const CACHE_NAME = 'travel-english-v2.1';

// Arquivos para cache (tudo que precisa funcionar offline)
const urlsToCache = [
  './',                    // Página principal
  './index.html',         // HTML principal
  './manifest.json',      // Manifest do PWA
  
  // Estilos e scripts inline (já estão no HTML)
  
  // Imagens e ícones
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// ============ INSTALAÇÃO ============
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  // Força a ativação imediata
  self.skipWaiting();
  
  // Cache todos os arquivos importantes
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando arquivos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Instalação completa!');
      })
      .catch(error => {
        console.error('[Service Worker] Erro na instalação:', error);
      })
  );
});

// ============ ATIVAÇÃO ============
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  
  // Remove caches antigos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Ativação completa!');
      // Toma controle de todas as abas abertas
      return self.clients.claim();
    })
  );
});

// ============ FETCH (INTERCEPTA REQUESTS) ============
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Para desenvolvimento: desabilite cache se necessário
  // if (event.request.url.includes('localhost')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna do cache
        if (response) {
          console.log('[Service Worker] Retornando do cache:', event.request.url);
          return response;
        }
        
        // Não está no cache - busca da rede
        console.log('[Service Worker] Buscando da rede:', event.request.url);
        
        return fetch(event.request)
          .then(networkResponse => {
            // Verifica se a resposta é válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clona a resposta para adicionar ao cache
            const responseToCache = networkResponse.clone();
            const contentLength = Number(networkResponse.headers.get('content-length') || '0');
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Não cacheia requisições de terceiros ou muito grandes
                if (event.request.url.startsWith('http') && 
                    !event.request.url.includes('chrome-extension') &&
                    (contentLength === 0 || contentLength < 5000000)) { // 5MB
                  cache.put(event.request, responseToCache);
                }
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('[Service Worker] Erro na fetch:', error);
            
            // Se offline e não tem no cache, retorna página offline
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            
            // Para imagens, retorna um fallback
            if (event.request.destination === 'image') {
              return caches.match('./icons/icon-192x192.png');
            }
            
            // Retorna uma resposta de erro genérica
            return new Response('Offline - Travel English', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// ============ MENSAGENS ============
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ============ SYNC BACKGROUND ============
self.addEventListener('sync', event => {
  if (event.tag === 'update-content') {
    console.log('[Service Worker] Sincronizando conteúdo...');
    // Aqui você pode adicionar lógica para sincronizar dados
  }
});

// ============ PUSH NOTIFICATIONS ============
self.addEventListener('push', event => {
  console.log('[Service Worker] Push recebido:', event);
  
  const options = {
    body: 'Novas frases disponíveis no Travel English!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: './'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Travel English', options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notificação clicada');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Abre ou foca na janela do app
        for (const client of clientList) {
          if (client.url === './' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
  );
});