const cacheName = 'github-api-app'
const dataCacheName = 'data-github-api-app'

const filesToCache = [
	'/',
	'index.html',
	'css/style.css',
	'js/jquery.min.js',
	'js/main.js'
]	


self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install')
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			console.log('[ServiceWorker] Caching app shell')
			cache.addAll(filesToCache)
		})
	)
})

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated')
  e.waitUntil(
  		caches.keys().then(keyList => {
  			console.log(keyList)
  			return Promise.all(keyList.map(key => {
  				if (key !== cacheName && key !== dataCacheName) {
  					console.log('[ServiceWorker] Removing old cache', key)
  					return caches.delete(key)
  				}
  			}))
  		})
  	)
  return self.clients.claim()
});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url)
	const url = "https://api.github.com/users"
	if (e.request.url.includes(url)) {
		e.respondWith(
			caches.open(dataCacheName).then(cache => fetch(e.request).then(response => {
				cache.put(e.request.url, response.clone())
				return response
			}))
		)
	} else {
		e.respondWith(
			caches.match(e.request).then(res => res || fetch(e.request))
		)
	}
	
})