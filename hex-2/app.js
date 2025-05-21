// https://github.com/mdn/dom-examples/blob/main/channel-messaging-basic/index.html
const channel = new MessageChannel();
const output = document.querySelector(".output");
const iframe = document.querySelector("iframe");

// Wait for the iframe to load
iframe.addEventListener("load", onLoad);

function onLoad() {
  // Listen for messages on port1
  channel.port1.onmessage = onMessageFromIFrame;
  // Transfer port2 to the iframe
  /*
  iframe.contentWindow.postMessage(
    "test1.txt",
    "*",
    [channel.port2]
  );
  */
}

// Handle messages received on port1
function onMessageFromIFrame(e) {
  output.innerText = e.data;
  console.log('Frontend index.html received response from IFrame:', e.data);
  console.log('Sending FETCH_RESPONSE message to sw');
  /*
  navigator.serviceWorker.controller.postMessage({
    type: 'FETCH_RESPONSE',
    data: e.data
  });
  */
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.postMessage({
      type: 'FETCH_RESPONSE',
      data: e.data
    });
  });
  console.log('Sent FETCH_RESPONSE message to sw');
}

// https://github.com/mdn/dom-examples/blob/main/service-worker/simple-service-worker/app.js

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        'sw.js',
        {
          scope: './',
        }
      );
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }

    // https://web.dev/articles/two-way-communication-guide#channel-api
    navigator.serviceWorker.onmessage = (event) => {
      if (event.data && event.data.type === 'FETCH') {
        console.log('Frontend index.html received message from sw', event);
        iframe.contentWindow.postMessage(
          "test1.txt",
          "*",
          [channel.port2]
        );
      }
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/postMessage
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage(
        "Test message sent immediately after creation",
      );
    });
  }
};

registerServiceWorker();

// Attach logic to button

const button = document.querySelector("button");
const fileContents = document.querySelector("#file_contents");

button.addEventListener("click", onClick);

async function onClick() {
  console.log('click');
  fileContents.innerHTML = "Clicked"
  const resp = await fetch("test1.txt");
  const txt = await resp.text();
  console.log('Fetched data:', txt);
  fileContents.innerHTML = txt;
}

