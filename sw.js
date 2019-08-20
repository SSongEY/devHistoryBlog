/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.2/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.2"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-84a6afe83b5eb9e8c0a3.js"
  },
  {
    "url": "app-b95d8b38f461518940b6.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-c5cb64bc0edabf3c9d7d.js"
  },
  {
    "url": "index.html",
    "revision": "db3da15a8035ab3459c7edf61f49da78"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "f1dd67009ec813632cf6a98f5a3a9ec9"
  },
  {
    "url": "2.91757557b6e100f76998.css"
  },
  {
    "url": "component---src-pages-index-jsx.4b7a5e4932fb3d6e460e.css"
  },
  {
    "url": "component---src-pages-index-jsx-4e054e2bee9e3efbef31.js"
  },
  {
    "url": "1-cd51e5cf30f09a016f1a.js"
  },
  {
    "url": "0-e8bad8b4cd735b129e6a.js"
  },
  {
    "url": "3-69954b2d650eed1aa2b4.js"
  },
  {
    "url": "2-2dcf5d62592e6c975763.js"
  },
  {
    "url": "static/d/175/path---index-6a9-ExFzPDXhoj4Jesnz9u1DbN1WT18.json",
    "revision": "7faffa6e7eb2f0ce3856fc791bcad32b"
  },
  {
    "url": "component---src-pages-404-jsx-565b8a52a307725a6477.js"
  },
  {
    "url": "static/d/906/path---404-html-516-62a-tBpQeeIBbHBpUSgMNYEhnKU0.json",
    "revision": "f57e79d95f818253561053cb1a37fd1c"
  },
  {
    "url": "static/d/520/path---offline-plugin-app-shell-fallback-a-30-c5a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/devHistoryBlog/offline-plugin-app-shell-fallback/index.html", {
  whitelist: [/^[^?]*([^.?]{5}|\.html)(\?.*)?$/],
  blacklist: [/\?(.+&)?no-cache=1$/],
});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, workbox.strategies.staleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https:/, workbox.strategies.networkFirst(), 'GET');
"use strict";

/* global workbox */
self.addEventListener("message", function (event) {
  var api = event.data.api;

  if (api === "gatsby-runtime-cache") {
    var resources = event.data.resources;
    var cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then(function (cache) {
      return Promise.all(resources.map(function (resource) {
        return cache.add(resource).catch(function (e) {
          // ignore TypeErrors - these are usually due to
          // external resources which don't allow CORS
          if (!(e instanceof TypeError)) throw e;
        });
      }));
    }));
  }
});