// https://github.com/mdn/dom-examples/blob/main/service-worker/simple-service-worker/sw.js

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  /*
  event.waitUntil(
    addResourcesToCache([
      './',
      './index.html',
      './style.css',
      './app.js',
      './image-list.js',
      './star-wars-logo.jpg',
      './gallery/bountyHunters.jpg',
      './gallery/myLittleVader.jpg',
      './gallery/snowTroopers.jpg',
    ])
  );
  */
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch', event.request.url, event);
  /*
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: './gallery/myLittleVader.jpg',
    })
  );
  */
});
