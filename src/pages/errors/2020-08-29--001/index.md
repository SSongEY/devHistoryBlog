---
title: "[Node] gyp verb check python checking for Python executable \"python\" in the PATH"
date: "2020-08-29"
layout: post
draft: false
path: "/errors/2020-08-29-001"
category: "errors"
tags:
  - "node"
description: "[Node] Node.js 종속성을 위해 Windows에서 Python 실행하기"
---

## 문제
gatsby node_modules 설치 도중 문제 발생

## 원인
phthon 2.7 미설치 또는 PYTHON 환경변수 없음

## 해결
* python 미 설치시
```
(관리자 권한으로 실행)
npm install --global --production windows-build-tools
```  
설치 경로
C:\Users\ben\.windows-build-tools\python27\python.exe 
참고 - 지원되지 않으므로 3.x가 아닌 python 2.7을 사용  

* [node-gyp](https://stackoverflow.com/questions/39739626/what-is-node-gyp) 설치  
```
npm install --global node-gyp
```

일단 설치되면 모든 노드 - gyp 종속성이 다운로드되지만 여전히 환경 변수가 필요합니다. 
유효성 검사 Python은 실제로 올바른 폴더에 있습니다.


환경변수 세팅
```
setx PYTHON "%USERPROFILE%\.windows-build-tools\python27\python.exe"
```

cmd를 재시작하고  후 PYTHON 변수 존재 여부 확인
```
set PYTHON
```

마지막으로 node module 재설치
```
npm install <module>
```

참고  
https://code.i-harness.com/ko-kr/q/e6ce22
