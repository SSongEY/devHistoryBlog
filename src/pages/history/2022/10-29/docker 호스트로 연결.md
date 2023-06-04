---
title: "docker 호스트로 연결"
date: "2022-10-29"
layout: post
draft: false
path: "/history/posts/2022-10-29--001"
category: "history"
type: "info"
tags:
 - "docker"
description: ""
---

docker 로 띄운 컨테이너에서 내 현재 로컬의 DB를 붙여 테스트를 하게 되었다.  
때문에 컨테이너에서 호스트의 주소로 연결하는 방법이 필요했다.

docker 18.03 부터 호스트의 IP를 직접 입력하는 방법 외에 호스트 주소로 바로 연결이 가능하다.

### ✔️ Mac or Windows

```bash
'host.docker.internal'
또는
172.17.0.1
```

### ✔️ Linux

```bash
$ docker run --network="host"

localhost
또는
127.0.0.1
```