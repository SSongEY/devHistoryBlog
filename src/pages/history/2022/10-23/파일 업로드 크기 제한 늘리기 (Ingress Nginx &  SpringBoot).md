---
title: "파일 업로드 크기 제한 늘리기 (Ingress Nginx & SpringBoot)"
date: "2022-10-23"
layout: post
draft: false
path: "/history/posts/2022-10-23--001"
category: "history"
type: "info"
tags:
 - "nginx"
 - "springboot"
description: ""
---

# 1. Nginx 설정

- nginx 의 기본 body sizesms 1MB이다.
- 이 때, 업로드 파일을 포함한 요청 사이즈가 1MB가 넘으면 413(Request Entity Too Large) 에러를 반환한다.

### 1.1. ConfigMap 으로 설정하기

```yaml
apiVersion: v1
kind: ConfigMap
proxy-body-size: "10m"
data:
metadata:
labels:
  app: ingress-nginx
name: nginx-configuration
```

### 1.2. Ingress Annotation 으로 설정하기

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
```

---

# 2. SpringBoot 설정

- SpringBoot 에 설정된 기본값은 1048576 bytes 이다.
- 이 때, 업로드 파일 사이즈가 위 사이즈를 넘으면 **“multipart.MaxUploadSizeExceededException”** 에러가 발생한다.

### 2.1. SpringBoot 2.x 버전

```yaml
# application.yaml
spring:
	servlet:
		multipart: 
			maxFileSize: 10MB
			maxRequestSize: 10MB
```

### 2.2. SpringBoot 1.4 & 1.5 버전

```yaml
spring:
	http:
		multipart:
			maxFileSize: 10MB
			maxRequestSize: 10MB
```

### 2.3. SpringBoot 1.3.x 이하 버전

```yaml
multipart:
	maxFileSize: 10MB
	maxRequestSize: 10MB
```