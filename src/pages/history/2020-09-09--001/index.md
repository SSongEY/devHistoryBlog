---
title: "[Spring] SpringSecurity 에서 req/res에 대한 로깅은?"
date: "2020-09-09"
layout: post
draft: false
path: "/history/posts/2020-09-09--001"
category: "history"
tags:
  - "SpringSecurity"
description: "SpringSecurity 구조"
---

모든 req/res DB 로깅은 interceptor 에서 진행하였고,  
로그인/ 로그아웃에 대한 req/res 로깅은 AuthenticationProvider 클래스를 구현한 곳에서 로깅을 하였는데,
로그인 로그아웃에 대한 로깅 위치에 대한 의문을 가지게 되었다.  

##Spring Security 구조
![](./1.PNG)




##### 참고
* https://sjh836.tistory.com/165

