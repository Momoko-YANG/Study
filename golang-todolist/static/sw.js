// Service Worker for Go Todo App
const CACHE_NAME = 'todo-app-v1.0.0';
const STATIC_CACHE = 'static-cache-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-cache-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/static/css/style.css',
    '/static/js/app.js',
    '/static/manifest.json',
    '/templates/index.html',
    '/templates/todos.html',
    '/templates/detail.html',
    '/templates/edit.html',
    '/templates/login.html',
    '/templates/signup.html'
];

// 需要缓存的 API 端点
const API_CACHE_PATTERNS = [
    '/api/todos',
    '/todos'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('Service Worker 安装中...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('缓存静态资源...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('静态资源缓存完成');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('缓存静态资源失败:', error);
            })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker 激活完成');
                return self.clients.claim();
            })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }
    
    // 处理不同类型的请求
    if (isStaticAsset(request)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isApiRequest(request)) {
        event.respondWith(handleApiRequest(request));
    } else if (isPageRequest(request)) {
        event.respondWith(handlePageRequest(request));
    } else {
        event.respondWith(handleOtherRequest(request));
    }
});

// 判断是否为静态资源
function isStaticAsset(request) {
    return request.url.includes('/static/') ||
           request.url.includes('.css') ||
           request.url.includes('.js') ||
           request.url.includes('.png') ||
           request.url.includes('.jpg') ||
           request.url.includes('.jpeg') ||
           request.url.includes('.gif') ||
           request.url.includes('.svg') ||
           request.url.includes('.ico');
}

// 判断是否为 API 请求
function isApiRequest(request) {
    return request.url.includes('/api/') ||
           request.url.includes('/todos') ||
           request.url.includes('/login') ||
           request.url.includes('/signup') ||
           request.url.includes('/logout');
}

// 判断是否为页面请求
function isPageRequest(request) {
    return request.method === 'GET' &&
           request.headers.get('accept').includes('text/html');
}

// 处理静态资源
async function handleStaticAsset(request) {
    try {
        // 首先尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果缓存中没有，从网络获取
        const networkResponse = await fetch(request);
        
        // 将响应添加到缓存
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('处理静态资源失败:', error);
        return new Response('资源加载失败', { status: 404 });
    }
}

// 处理 API 请求
async function handleApiRequest(request) {
    try {
        // 对于 API 请求，优先使用网络
        const networkResponse = await fetch(request);
        
        // 如果是 GET 请求且成功，缓存响应
        if (request.method === 'GET' && networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('API 请求失败:', error);
        
        // 网络失败时，尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('网络连接失败', { status: 503 });
    }
}

// 处理页面请求
async function handlePageRequest(request) {
    try {
        // 首先尝试从网络获取
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // 缓存页面响应
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('页面请求失败:', error);
        
        // 网络失败时，尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果都没有，返回离线页面
        return caches.match('/templates/index.html');
    }
}

// 处理其他请求
async function handleOtherRequest(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.error('请求失败:', error);
        return new Response('请求失败', { status: 503 });
    }
}

// 后台同步
self.addEventListener('sync', event => {
    console.log('后台同步事件:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 执行后台同步
async function doBackgroundSync() {
    try {
        // 这里可以添加后台同步逻辑
        // 例如：同步离线时创建的 todos
        console.log('执行后台同步...');
    } catch (error) {
        console.error('后台同步失败:', error);
    }
}

// 推送通知
self.addEventListener('push', event => {
    console.log('收到推送通知:', event);
    
    const options = {
        body: event.data ? event.data.text() : '您有新的 Todo 提醒',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看详情',
                icon: '/static/icons/checkmark.png'
            },
            {
                action: 'close',
                title: '关闭',
                icon: '/static/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Todo 提醒', options)
    );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
    console.log('通知被点击:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/todos')
        );
    }
});

// 消息处理
self.addEventListener('message', event => {
    console.log('收到消息:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 错误处理
self.addEventListener('error', event => {
    console.error('Service Worker 错误:', event.error);
});

// 未处理的 Promise 拒绝
self.addEventListener('unhandledrejection', event => {
    console.error('未处理的 Promise 拒绝:', event.reason);
});
