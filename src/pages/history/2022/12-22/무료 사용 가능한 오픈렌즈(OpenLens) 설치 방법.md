---
title: "무료 사용 가능한 오픈렌즈(OpenLens) 설치 방법"
date: "2022-12-22"
layout: post
draft: false
path: "/history/posts/2022-12-22--001"
category: "history"
type: "info"
tags:
description: ""
---

너무너무 잘 사용하던 Lens가 2023년 1월 2일 이후로는 기업에서 유료화가 된다고 한다.

[https://medium.com/k8slens/lens-6-released-vision-for-the-future-new-subscription-model-and-features-available-628ff21fe14a](https://medium.com/k8slens/lens-6-released-vision-for-the-future-new-subscription-model-and-features-available-628ff21fe14a)

[](https://medium.com/k8slens/lens-6-released-vision-for-the-future-new-subscription-model-and-features-available-628ff21fe14a)

하지만 **개인용, 교육용, 스타트업(연매출 또는 자금 1,000만 달러 미만) 은 무료**라고 하니..  
개인 노트북에서는 계속 사용해도 될 듯 싶다.

다만 기존 오픈소스는 '오픈렌즈(OpenLens)'로 이름을 바꿔 유지되고, 'MIT 라이선스' 이니, 무료로 사용이 가능하다.  
오픈렌즈를 설치하는 방법은 아래와 같다.

### ✔️ MacOS - Homebrew

```bash
brew install --cask openlens
```

### ✔️ Windows - Scoop

```bash
scoop bucket add extra
scoop install openlens
```

또는 아래 오픈렌즈 깃헙에서 빌드된 파일을 받아 설치해도 된다.  
[https://github.com/MuhammedKalkan/OpenLens](https://github.com/MuhammedKalkan/OpenLens)

<br/>

참고로, 오픈렌즈에서는 pod 메뉴가 없다.(pod 로그 보기 등.. 불가능)  
이를 사용하려면 extension을 설치해야한다.

### ✔️ 설치 방법

메뉴 > extensions > 설치란에 `@alebcay/openlens-node-pod-menu` 입력 후 install 버튼 클릭