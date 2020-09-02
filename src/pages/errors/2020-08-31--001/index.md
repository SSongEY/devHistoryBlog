---
title: "[JPA] No EntityManager with actual transaction available for current thread"
date: "2020-08-29"
layout: post
draft: false
path: "/errors/2020-08-31--001"
category: "errors"
tags:
  - "java"
  - "jpa"
  - "transaction"
description: ""
---

### 문제
deleteBy.. 메소드 호출시 오류 발생

## 원인  
https://stackoverflow.com/questions/32269192/spring-no-entitymanager-with-actual-transaction-available-for-current-thread

### 해결  
메소드에 @transaction 을 추가하는 방법으로 해결하였다.  
잘 모르겠는데... JPA delete transaction 을 찾아봐야겠다.


