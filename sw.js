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
    "url": "webpack-runtime-be45aa6b7825d2e4e3a2.js"
  },
  {
    "url": "app-00a0dc28c2e101544963.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-c5cb64bc0edabf3c9d7d.js"
  },
  {
    "url": "index.html",
    "revision": "3008cf213cb7158561b06f373200536a"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "2df951e28725f057930a51d03c225b99"
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
    "url": "1-913b00b08949b81eb77e.js"
  },
  {
    "url": "0-e8bad8b4cd735b129e6a.js"
  },
  {
    "url": "3-4855fbcb652429953df5.js"
  },
  {
    "url": "2-f713cb661b9637afd702.js"
  },
  {
    "url": "static/d/707/path---index-6a9-sfIyapSINknkXfxrcnaLKhXT02w.json",
    "revision": "db7c233113bd724241404396a9fd17ee"
  },
  {
    "url": "component---src-pages-404-jsx-565b8a52a307725a6477.js"
  },
  {
    "url": "static/d/457/path---404-html-516-62a-PFYbZcnIDS14qXYIEOd5w6Uq8pw.json",
    "revision": "d324f194987e95e435a15474a377fafd"
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