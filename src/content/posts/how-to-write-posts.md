---
title: "이 블로그에 글 쓰는 법"
date: 2026-09-08
tags: ["메타", "가이드"]
summary: "새 글 추가 방법, front-matter 필드, 순수 .md로 커스텀 박스(Callout·Formula 등) 쓰는 디렉티브 문법, 로컬 미리보기와 배포 흐름 정리."
draft: false
---

## 새 글 추가

`src/content/posts/` 에 `.md` 파일을 하나 만들면 끝. 파일명이 URL slug가 된다 (`my-post.md` → `/posts/my-post`). 맨 위 front-matter만 채우면 목록·태그·검색에 자동 반영된다.

```yaml
---
title: "글 제목"
date: 2026-09-09
tags: ["학습기록", "트러블슈팅"]
summary: "목록과 검색 결과에 보이는 한 줄 요약."
draft: false   # true면 배포에서 제외 (로컬에서는 보임)
---
```

:::card
**필드 정리**

- `title` (필수) — 글 제목
- `date` (필수) — 발행일. 목록은 이 날짜 역순 정렬
- `tags` — 문자열 배열. 메인 태그 필터 + `/tags/<태그>` 페이지 자동 생성
- `summary` — 목록 카드·검색 결과·메타 설명에 사용
- `draft` — `true`면 빌드 배포 제외(로컬 `dev`에서는 보임)
:::

## 기본은 그냥 마크다운

제목·굵게·리스트·표·인용·이미지·**코드블록**은 전부 일반 마크다운 그대로 쓰면 이 블로그 스타일이 자동으로 입혀진다. 특별한 문법이 필요 없다.

````md
## 소제목

**굵게**, *강조*, `인라인 코드`, [링크](https://example.com)

```python
def hello():
    print("코드블록은 문법 하이라이트까지 자동")
```

| 컬럼 | 값 |
|------|----|
| a | 1 |

![이미지 설명](./image.png)
````

## 커스텀 박스 — `:::` 디렉티브 (순수 .md)

Callout·Formula 같은 강조 박스는 MDX 없이 **`:::` 디렉티브**로 쓴다. 박스 안은 그냥 마크다운.

```md
:::callout{title="핵심"}
파란 박스 — 강조하고 싶은 요점. 안에서 **굵게**, `코드` 다 됨.
:::

:::callout{type="think" title="왜?"}
보라 박스 — 사고 과정/배경
:::

:::callout{type="warn" title="주의"}
주황 박스 — 함정/주의사항
:::

:::formula{big}
점수 = α × w + β × (1 − w)
:::

:::analogy
🍜 **비유** — 초록 점선 박스
:::

:::card
회색 카드 박스
:::
```

:::callout{type="think" title="Formula 안에서 글자 색 강조"}
수식의 특정 기호를 보라색으로 강조하려면 인라인 HTML `<span class="var">α</span>` 를 쓰면 된다. 안 써도 박스는 그대로 나온다.
:::

### 파이프라인(단계 카드)이 필요하면

이건 구조가 있어서 raw HTML로 쓴다(자주 쓰진 않음):

```html
<div class="pipe">
  <div class="step"><span class="n">1</span><h5>1단계</h5><p>설명</p></div>
  <div class="arrow">→</div>
  <div class="step"><span class="n">2</span><h5>2단계</h5><p>설명</p></div>
</div>
```

## 로컬 미리보기

```bash
npm install       # 최초 1회
npm run dev       # http://localhost:4321/devHistoryBlog/
```

:::callout{type="warn" title="검색은 빌드 후에만 동작"}
전문검색(Pagefind)은 **빌드된 HTML을 인덱싱**하므로 `dev` 모드에서는 결과가 안 나온다. 검색까지 확인하려면 `npm run build && npm run preview`.
:::

## 배포

`blog` 브랜치에 push하면 GitHub Actions가 자동으로 빌드·배포한다. `develop`/`master`는 사용하지 않는다.

:::callout{type="warn" title="공개 저장소 — 글 쓰기 전 필수 확인"}
이 블로그는 공개된다. 실제 파일 경로·내부 시스템명·운영 파라미터 실측값 등 비공개 정보는 올리기 전에 반드시 일반화하거나 제거한다. 자세한 규칙은 저장소 루트의 `CONTRIBUTING.md` 참고.
:::
