---
title: "swap 메모리 초기화"
date: "2022-09-03"
layout: post
draft: false
path: "/history/posts/2022-09-03--001"
category: "history"
type: "info"
tags:
  - "linux"
  - "swap"
description: ""
---

리눅스에서 일시적 메모리 사용의 증가로 swap을 사용하게될 경우 메모리에 여유가 생겨도 swap 메모리는 자동으로 초기화되지 않는다.   
이것을 수동으로 초기화하려면 아래의 명령을 입력하면 된다. 당연히 root 권한에서 실행해야 한다.

```bash
$ swapoff -a && swapon -a
```

<br/>

swapoff 처리에 시간이 조금 오래 걸릴 수 있는데 서버가 멈춘 것은 아니므로 걱정하지 않아도 된다.  
swap 메모리에서 필요한 부분을 물리 메모리로 옮기는 처리중인 것이다.