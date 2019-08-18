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
    "url": "webpack-runtime-5325ec56ef2b13ba260e.js"
  },
  {
    "url": "app-8e1122ac1661dc6f8a52.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-c5cb64bc0edabf3c9d7d.js"
  },
  {
    "url": "index.html",
    "revision": "29b24064aac826780d4b358dfe22b6bd"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "82d7495e19c946f16b078cefdb772a6b"
  },
  {
    "url": "2.91757557b6e100f76998.css"
  },
  {
    "url": "component---src-pages-index-jsx.4b7a5e4932fb3d6e460e.css"
  },
  {
    "url": "component---src-pages-index-jsx-2a23507782c42ca221a4.js"
  },
  {
    "url": "1-e71908e4a8b539d0d194.js"
  },
  {
    "url": "0-8fad947e24d720b95329.js"
  },
  {
    "url": "3-849a9c84f0a5c4d29af0.js"
  },
  {
    "url": "2-77575828080a1a40ae7d.js"
  },
  {
    "url": "static/d/221/path---index-6a9-F2WFbKNvBiwY9IpuhJhgtdl0IAY.json",
    "revision": "27fd3ea90dec1edac7767746fad1de7a"
  },
  {
    "url": "component---src-pages-404-jsx-aadce67b6e00f5b82971.js"
  },
  {
    "url": "static/d/251/path---404-html-516-62a-h0HFuJHo2CidEyQntirtFskWJ9Q.json",
    "revision": "1a316b716ebb4c9bcf7fd5070c20237f"
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