---
title: "cron 표현식"
date: "2022-08-21"
layout: post
draft: false
path: "/history/posts/2022-08-21--001"
category: "history"
type: "info"
tags:
  - ""
description: ""
---

계속 까먹는다.. 표현식에 대해 정리한다.

## ✔️ 특수문자

![](001-01.png)

## ✔️ 주기 설정

![](001-02.png)

## ✔️ 예시

- 0-6시 사이에 11분 + 10분마다

```html
11,21,31,41,51 0-6 * * *
```

- 0-6시 사이 매 5분 마다

```html
*/5 0-6 * * *
```