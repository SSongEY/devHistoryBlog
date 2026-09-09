# EunYoung 작업 기록 블로그

업무·학습·트러블슈팅 기록용 블로그. [Astro](https://astro.build) + GitHub Pages.

- **URL**: https://SSongEY.github.io/devHistoryBlog/
- **작업 브랜치**: `blog` (여기에 push하면 자동 빌드·배포. `develop`/`master`는 사용 안 함)
- **글 작성법**: 사이트의 "이 블로그에 글 쓰는 법" 글 또는 아래 요약 참고
- **공개 저장소 주의**: 글 올리기 전 [`CONTRIBUTING.md`](./CONTRIBUTING.md)의 sanitize 게이트 확인

## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:4321/devHistoryBlog/
npm run build        # 프로덕션 빌드 (+ Pagefind 검색 인덱싱)
npm run preview      # 빌드 결과 미리보기 (검색은 이 모드에서 동작)
```

> 검색(Pagefind)은 빌드된 HTML을 인덱싱하므로 `dev`에서는 동작하지 않는다. 검색 확인은 `build && preview`.

## 새 글 추가

`src/content/posts/` 에 `.md` 파일 추가. 파일명이 URL slug가 된다.

```yaml
---
title: "글 제목"
date: 2026-09-09
tags: ["학습기록"]
summary: "한 줄 요약"
draft: false
---
```

본문은 일반 마크다운. 강조 박스(Callout·Formula 등)는 `:::` 디렉티브로 쓴다:

```md
:::callout{type="think" title="왜?"}
보라 박스 — 안은 그냥 **마크다운**
:::
```

자세한 문법은 사이트의 "이 블로그에 글 쓰는 법" 글 참고.

## 구조

| 경로 | 역할 |
|------|------|
| `src/content/posts/` | 글(Markdown/MDX) |
| `src/content/config.ts` | front-matter 스키마 |
| `src/pages/[...page].astro` | 홈 — 최신 목록(번호 페이징) + 검색 + 인기 태그 |
| `src/pages/posts/[...slug].astro` | 글 상세 |
| `src/pages/tags/` | 태그 목록·태그별 페이지 |
| `src/utils/remark-boxes.mjs` | `:::` 디렉티브 → 커스텀 박스(Callout·Formula 등) 변환 |
| `src/styles/global.css` | 디자인 시스템 |
| `.github/workflows/deploy.yml` | Pages 배포 |

## 기능

- 최신 글 목록(날짜 역순) + **번호 페이징**(20편/페이지, 윈도우형 페이저)
- 전문검색(제목+본문, Pagefind)
- 홈 인기 태그(상위 15) + 전체 태그 페이지 + 태그별 페이지(페이징)
- 반응형 · Pretendard · 라이트 테마
