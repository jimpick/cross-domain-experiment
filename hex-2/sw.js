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

let resolver = null;
let rejecter = null;
let origEvent = null;

class TextResponse extends Response {
  constructor(response) {
    super();
    this.response = response;
  }
  text() {
    return new Promise.resolve(this.response);
  }
}

self.addEventListener('message', (evt) => {
  console.log("sw message received", evt);
  if (evt.data && evt.data.type === 'FETCH_RESPONSE') {
    console.log("sw fetch response:", origEvent.request.url, evt.data.data);
    if (resolver) {
      resolver(
        new Response(evt.data.data, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      );
    }
  }
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
  // https://web.dev/articles/two-way-communication-guide#channel-api
  if (event.request.url.endsWith("/test1.txt")) {
    origEvent = event;
    const promise = new Promise((resolve, reject) => {
      // https://web.dev/articles/two-way-communication-guide#channel-api
      resolver = resolve;
      rejecter = reject;
    });
    event.respondWith(promise);
    self.clients.matchAll().then(function (clients) {
      if (clients && clients.length) {
        //Respond to last focused tab
        clients[0].postMessage({type: 'FETCH', url: event.request.url});
      }
    });
  }
});

