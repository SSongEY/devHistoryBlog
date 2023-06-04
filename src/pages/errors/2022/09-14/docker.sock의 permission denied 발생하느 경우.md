---
title: "/var/run/docker.sock의 permission denied 발생하는 경우"
date: "2022-09-14"
layout: post
draft: false
path: "/errors/posts/2022-09-14--001"
category: "errors"
type: "error"
tags:
  - "docker"
description: "dependent child images로 인한 오류"
---

아래 명령어 실행 후 docker 재시작 또는 해당 유저 ssh 재접속

```bash
# usermod로 사용자를 docker 그룹에 추가
$ sudo usermod -aG docker [계정명]
```

<br/>

만약 위 명령어 실행 후 터미널 재접속까지 했으나 permission denied 이 계속 발생한다면..  
/var/run/docker.sock 파일의 권한을 666으로 변경한다.  
그럼 그룹 내 다른 사용자도 접근 가능하게 변경된다.  

```bash
# chmod 이용하여 모든 유저 읽기/쓰기 가능하도록 파일 권한 변경
$ sudo chmod 666 /var/run/docker.sock
```