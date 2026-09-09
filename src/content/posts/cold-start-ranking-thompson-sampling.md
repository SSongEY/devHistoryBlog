---
title: "신규 콘텐츠는 어떻게 순위를 매길까 — Beta·Thompson Sampling·Sigmoid로 푸는 cold-start 랭킹"
date: 2026-09-09
tags: ["추천시스템", "통계", "Thompson-Sampling", "학습기록"]
summary: "데이터가 거의 없는 새 콘텐츠를 공정하게 평가하고 좋은 신규에게 기회를 주는 방법 — Bayesian prior·shrinkage, Beta 분포와 Thompson Sampling, Sigmoid decay 의 이론과 구현 패턴 정리."
draft: false
---

<div class="eyebrow">추천 시스템 · cold-start 랭킹</div>

데이터가 거의 없는 **새 콘텐츠**를 공정하게 평가하고, 좋은 신규에게 노출 기회를 주는 방법. Beta 분포 · Thompson Sampling · Bayesian prior · Sigmoid decay 의 이론과 구현 패턴 정리.


## 단어장

<p class="muted">본문에 나오는 순서대로. 지금은 훑고, 본문에서 다시 만나면 여기로 돌아오세요.</p>

:::glossary
| 용어 | 영문 | 뜻 |
|---|---|---|
| 완주율 | complete view rate | 콘텐츠를 끝까지 본 비율. "좋은 콘텐츠"를 판단하는 핵심 지표(=보상). |
| 콜드스타트 | cold start | 새 콘텐츠/유저라 데이터가 거의 없어 판단이 어려운 상태. 신규의 본질적 문제. |
| 탐색 vs 활용 | explore vs exploit | **활용**=검증된 좋은 걸 계속 노출. **탐색**=아직 모르는 신규를 시험 노출. 둘의 균형이 추천의 핵심 딜레마. |
| 사전지식 | Prior | 데이터를 보기 *전에* 이미 아는 것. 여기선 "이 카테고리 콘텐츠는 보통 완주율이 이 정도"라는 평균. |
| 수축 | Shrinkage | 데이터가 적을 때 극단적 추정치를 평균(prior) 쪽으로 끌어당기는 것. |
| Beta 분포 | Beta distribution | "완주율(0~1 비율)이 얼마일지"에 대한 *확률의 종모양 그래프*. 데이터 많으면 뾰족, 적으면 펑퍼짐. |
| Thompson Sampling | TS | 그 종모양에서 값을 *랜덤으로 뽑아* 점수로 쓰는 방법. 불확실한 신규에게 "가끔 대박 기회"를 자동으로 준다. |
| Multi-Armed Bandit | MAB | 여러 슬롯머신 중 어느 팔을 당길지 고르는 고전 문제. 탐색·활용의 교과서적 무대. |
| Sigmoid | 시그모이드 | 값을 0~1로 부드럽게 눌러 담는 *S자 곡선*. 여기선 "조회수 많으면 점수를 매끄럽게 감쇠". |
| Retriever | 리트리버 | 추천 후보를 *모아오는* 단계. 신규 콘텐츠 담당 retriever가 이 글의 무대. |
:::

## 1. 무슨 문제를 푸나

<p class="lead">신규 콘텐츠는 시청 데이터가 거의 없다. 그런데 우리가 알고 싶은 건 "이거 사람들이 끝까지 볼까?"(완주율)다.</p>

<div class="two">
<div class="card">
<h4>딜레마 ①  적은 데이터를 믿을 수 있나</h4>
<p>조회 <strong>3번</strong>에 완주 3번인 A → 완주율 100%? <span class="muted">진짜 좋은 걸까, 운일까?</span></p>
<p>조회 <strong>5000번</strong>에 완주 3000번인 B → 60%, <span class="muted">근데 이건 믿을 만하다.</span></p>
</div>
<div class="card">
<h4>딜레마 ②  신규에게 기회를 주나</h4>
<p>검증된 것만 밀면 안전하지만 <strong>신규는 영영 못 뜬다.</strong></p>
<p>신규를 마구 밀면 품질이 흔들린다. <span class="muted">= 탐색 vs 활용</span></p>
</div>
</div>

:::callout{title="핵심"}
이 두 딜레마를 **세 개의 부드러운 장치**로 푼다 — **①** 부족한 데이터를 카테고리 평균으로 메꾸고(Prior), **②** 불확실한 만큼 랜덤 기회를 주고(Thompson Sampling), **③** 이미 많이 노출된 건 눌러준다(Sigmoid decay).
:::

## 2. 이론 — 수학과 알고리즘

<p class="lead">외울 필요 없다. 각 개념이 <em>어떤 문제를 푸는 도구인지</em>만 잡으면 3장 코드가 그대로 읽힌다.</p>

### 2.1 완주율 = 베르누이 "보상"

한 명이 콘텐츠를 봤을 때 결과는 둘 중 하나다: **끝까지 봄(성공)** 또는 **중간 이탈(실패)**. 이렇게 *성공/실패 딱 두 결과*인 시행을 **베르누이 시행**이라 한다(동전 던지기와 같은 구조).

여러 명이 보면 성공이 <span class="var">α</span>번, 실패가 <span class="var">β</span>번 쌓인다. 우리가 추정하려는 건 이 콘텐츠의 **진짜 완주율 <span class="var">p</span>**다. 관측 완주율은 `α / (α+β)`지만 — 데이터가 적으면 이 값을 믿기 어렵다는 게 출발점.

:::analogy
🎯 **비유** — 동전을 3번 던져 3번 앞면. "이 동전 앞면 확률 100%"라고 말할 수 있나? 없다. **3번은 너무 적다.**
:::

### 2.2 Beta 분포 — "완주율이 얼마일지"에 대한 확신의 모양

완주율 <span class="var">p</span>를 숫자 하나로 콕 찍는 대신, **"p가 이 근처일 가능성이 높다"는 종모양 그래프**로 표현한다. 이게 **Beta 분포**이고, 딱 두 숫자로 정해진다:

:::formula{big}
Beta(<span class="var">α</span>, <span class="var">β</span>)　 <span class="var">α</span> = 성공(완주) 수 + 1 · <span class="var">β</span> = 실패(이탈) 수 + 1
:::

핵심 성질 하나만 기억하면 된다 — **데이터가 많을수록 그래프가 뾰족**해지고, **적을수록 펑퍼짐**해진다.

<div class="card">
<h4 style="margin-top:0">📐 축 읽는 법 — x축은 시청 횟수가 <u>아니다</u></h4>
<table style="margin:8px 0 0">
<tbody>
<tr><td style="width:1%; white-space:nowrap"><strong>x축</strong></td><td>완주율 <span class="var">p</span> <strong>그 자체</strong> (0~1의 모든 후보값). "진짜 완주율이 0.3일까 0.6일까"를 가로로 늘어놓은 것.</td></tr>
<tr><td><strong>y축</strong></td><td>그 값의 <strong>그럴듯함</strong>(확률밀도). 높을수록 "진짜 완주율이 이 근처일 것 같다".</td></tr>
<tr><td><strong>넓이</strong></td><td>곡선 아래 전체 넓이 = <strong>항상 1</strong>.</td></tr>
</tbody>
</table>
<p style="margin:.5em 0 0" class="muted">즉 완주율 자체가 아니라 <strong>"완주율이 얼마인지에 대한 믿음의 분포"</strong>다.</p>
</div>

<div class="two">
<figure>
<svg viewBox="0 0 300 180" role="img" aria-label="펑퍼짐한 Beta 분포">
<line x1="30" y1="150" x2="285" y2="150" stroke="#c9c9d1"/>
<line x1="30" y1="20" x2="30" y2="150" stroke="#c9c9d1"/>
<path d="M30,150 C90,140 120,90 157,88 C195,86 225,138 285,150" fill="none" stroke="#6e56cf" stroke-width="3"/>
<path d="M30,150 C90,140 120,90 157,88 C195,86 225,138 285,150 L285,150 L30,150 Z" fill="#6e56cf" opacity="0.08"/>
<text x="157" y="170" text-anchor="middle" font-size="11" fill="#6e6e73">완주율 p →</text>
<text x="157" y="78" text-anchor="middle" font-size="11" fill="#6e56cf">넓게 퍼짐</text>
</svg>
<figcaption><strong>신규 (조회 3번)</strong> · Beta(4,1) 느낌<br>"30%일 수도 90%일 수도 — 모름"</figcaption>
</figure>
<figure>
<svg viewBox="0 0 300 180" role="img" aria-label="뾰족한 Beta 분포">
<line x1="30" y1="150" x2="285" y2="150" stroke="#c9c9d1"/>
<line x1="30" y1="20" x2="30" y2="150" stroke="#c9c9d1"/>
<path d="M30,150 C150,150 165,35 183,35 C201,35 210,150 285,150" fill="none" stroke="#0071e3" stroke-width="3"/>
<path d="M30,150 C150,150 165,35 183,35 C201,35 210,150 285,150 L30,150 Z" fill="#0071e3" opacity="0.08"/>
<text x="157" y="170" text-anchor="middle" font-size="11" fill="#6e6e73">완주율 p →</text>
<text x="183" y="28" text-anchor="middle" font-size="11" fill="#0071e3">뾰족</text>
</svg>
<figcaption><strong>검증됨 (조회 5000번)</strong> · Beta(3000,2000) 느낌<br>"완주율 60% 근처, 거의 확실"</figcaption>
</figure>
</div>

#### 왜 데이터가 많을수록 뾰족해지나

**넓이가 1로 고정**인 게 열쇠다. "그럴듯한 완주율 범위"가 좁아지면, 그 넓이 1을 유지하려고 높이가 솟는다 — 이게 뾰족함의 정체.

- **조회 3번·완주 3번**: 진짜 완주율이 0.5여도 0.9여도 3연속 완주는 흔하다 → "0.5~1.0이 다 그럴듯" → *펑퍼짐*.
- **조회 5000번·완주 3000번**: 완주율이 0.6 근처가 아니면 이 관측(60%)이 거의 안 나온다 → 후보가 0.58~0.62로 압축 → *뾰족*.

:::callout{type="think" title="왜 하필 Beta?"}
완주율처럼 **0~1 사이 비율**의 불확실성을 표현하기에 수학적으로 가장 자연스러운 분포이기 때문. 베르누이 시행의 짝꿍이라 성공/실패 수를 그대로 <span class="var">α</span>, <span class="var">β</span>에 넣으면 된다 <span class="muted">(전문용어로 "켤레 사전분포").</span>
:::

#### 심화 — `Beta(1,1) + 완주 s·이탈 f → Beta(s+1, f+1)`은 어디서 왔나

이 업데이트 식은 **따로 정한 규칙이 아니라 베이즈 정리에서 유도**된다. 출발은 "사후믿음 ∝ 가능도 × 사전믿음" 하나뿐.

<div class="formula" style="text-align:left; line-height:2.1">
① 가능도 (완주 s·이탈 f 관측): &nbsp; <span class="big">p<sup>s</sup> · (1−p)<sup>f</sup></span><br>
② 사전 Beta(1,1) = 균등분포: &nbsp; <span class="big">p<sup>0</sup> · (1−p)<sup>0</sup> = 1</span> &nbsp;<span class="var">(완전 무지)</span><br>
③ 곱하면 지수끼리 더해짐: &nbsp; <span class="big">p<sup>s</sup> · (1−p)<sup>f</sup></span><br>
④ 이 꼴이 곧 <span class="big">Beta(s+1, f+1)</span>의 정의식 &nbsp;<span class="var">→ 사후믿음</span>
</div>

**핵심**: 베르누이 가능도 × Beta 사전을 곱하면 *지수 산수 때문에 결과가 또 Beta*가 된다. 이 "같은 가문으로 유지되는" 성질이 **켤레성(conjugacy)**이다.

:::callout{title="그래서 코드의 +1이란"}
출발 사전믿음을 **Beta(1,1) = 완전 무지(균등)**로 잡았다는 흔적이다. 그 결과 완주율 추정이 `(s+1)/(s+f+2)`로 눌려 **"3/3 = 100%" 같은 극단 단정을 막는다** — 통계의 **라플라스 보정**. 즉 라플라스 보정은 목적이 아니라 Beta(1,1)을 고른 결과다.
:::

### 2.3 Prior와 Shrinkage — 데이터가 적을 때 평균으로 당기기

신규 A의 완주율을 3번 시청만으로 판단하기 불안하다. 그럼 **"이 카테고리 콘텐츠는 보통 완주율이 이 정도"**라는 평균을 빌려온다. 이 사전지식이 **Prior**. 관측치를 이 prior 쪽으로 끌어당기는 걸 **Shrinkage(수축)**라 한다.

:::formula
보정된 완주율 = 카테고리평균 × <span class="var">w</span> + 관측완주율 × (1 − <span class="var">w</span>)
:::

<span class="var">w</span>는 "데이터를 얼마나 안 믿을지"의 가중치다. **데이터 적으면 w↑(평균에 의존), 많으면 w↓(관측치 신뢰).**

:::analogy
🍜 **비유** — 처음 보는 식당을 리뷰 3개로 판단하기 불안하니, 일단 **"이 동네 같은 종류 식당 평균 별점"**을 섞어 추측한다. 리뷰가 수백 개 쌓이면 그때 그 식당 별점만 본다.
:::

<p class="muted">→ 구현에서는 <span class="var">w</span>를 <code>exp(−조회수 / PRIOR_K)</code>으로 만든다.</p>

### 2.4 Thompson Sampling — 불확실한 놈에게 복권을 준다

이제 각 콘텐츠마다 Beta 분포(종모양)가 있다. 평균값으로 줄 세우면 *불확실하지만 잠재력 있는 신규*가 늘 진다. **Thompson Sampling**의 아이디어는 단순하다 —

:::formula{big}
각 콘텐츠의 종모양에서 <span class="var">값 하나를 랜덤으로 뽑아</span>, 그 뽑힌 값을 점수로 쓴다.
:::

<div class="two">
<div class="card">
<h4>검증된 B (뾰족)</h4>
<p>어디서 뽑아도 <strong>거의 0.6 언저리</strong> → 안정적으로 중간 점수. 예측 가능.</p>
</div>
<div class="card">
<h4>신규 A (펑퍼짐)</h4>
<p>뽑을 때마다 0.3도, <strong>가끔 0.9</strong>도 나옴 → 그 순간 상위 노출 기회를 얻는다. <span class="muted">= 탐색</span></p>
</div>
</div>

:::callout{title="자동 균형"}
**확실한 놈은 실력대로, 불확실한 놈은 가끔 대박.** 신규가 노출돼 데이터가 쌓이면 종모양이 뾰족해지며 로또성이 저절로 사라지고 실력으로 정착한다. *탐색→활용 전환이 파라미터 조작 없이 자동으로* 일어나는 게 TS의 아름다움.
:::

<p class="muted">배경: <strong>Multi-Armed Bandit</strong>(여러 슬롯머신 중 뭘 당길까) 문제의 고전 해법. 1933년 W. R. Thompson이 제안, 광고·추천·A/B 테스트에서 널리 쓰인다.</p>

### 2.5 Sigmoid — 부드러운 조광 스위치

**Sigmoid(시그모이드)**는 어떤 값을 0~1 사이로 부드럽게 눌러 담는 **S자 곡선**이다. 한동안 평평 → 어떤 문턱을 넘으면 확 꺾임 → 다시 평평. 딱 끊는 스위치가 아니라 *부드러운 조광(dimmer) 스위치*.

<figure>
<svg viewBox="0 0 420 180" role="img" aria-label="시그모이드 감쇠 곡선">
<line x1="40" y1="150" x2="405" y2="150" stroke="#c9c9d1"/>
<line x1="40" y1="18" x2="40" y2="150" stroke="#c9c9d1"/>
<path d="M40,35 C150,35 175,38 210,90 C245,142 270,145 405,148" fill="none" stroke="#c9760a" stroke-width="3"/>
<line x1="210" y1="18" x2="210" y2="150" stroke="#e0b070" stroke-dasharray="4 4"/>
<text x="210" y="14" text-anchor="middle" font-size="11" fill="#c9760a">문턱</text>
<text x="90" y="30" font-size="11" fill="#6e6e73">가중치 ≈ 1.0 (안 깎음)</text>
<text x="320" y="165" font-size="11" fill="#6e6e73">≈ 0.1 (10분의 1)</text>
<text x="222" y="145" text-anchor="middle" font-size="11" fill="#6e6e73">조회수 →</text>
</svg>
<figcaption>view decay: 조회수가 문턱을 넘으면 점수를 매끄럽게 깎는다.</figcaption>
</figure>

:::callout{type="warn" title="왜 딱 자르는 if문이 아니라?"}
"조회 539는 만점, 540은 0점" 같은 급단차는 경계에서 순위를 요동치게 한다. Sigmoid는 그 전환을 **매끄럽게** 만들어 순위 안정성을 지킨다. <span class="muted">→ 3.3에서 <code>expit(-x)</code>로 등장.</span>
:::

## 3. 구현 패턴

<p class="lead">2장의 세 이론이 실제로 이렇게 조립된다. <span class="muted">(개념 예시 — 상수는 설명용, 실제로는 도메인·트래픽에 맞게 튜닝)</span></p>

### 3.0 전체 파이프라인

<div class="pipe">
<div class="step"><span class="n">1</span><h5>Prior 결합</h5><p>부족한 데이터를 카테고리 평균으로 보정<br><span class="muted">이론 2.3</span></p></div>
<div class="arrow">→</div>
<div class="step"><span class="n">2</span><h5>Beta 샘플링</h5><p>불확실한 만큼 랜덤 점수 부여<br><span class="muted">이론 2.4</span></p></div>
<div class="arrow">→</div>
<div class="step"><span class="n">3</span><h5>View decay</h5><p>많이 노출된 건 sigmoid로 감쇠<br><span class="muted">이론 2.5</span></p></div>
<div class="arrow">→</div>
<div class="step"><span class="n">4</span><h5>정렬·필터</h5><p>seen 제외 · 조회수 컷 · 페이지네이션</p></div>
</div>

재료는 세 가지, 모두 **유저 세그먼트별**로 뽑는다 — ① 조회수, ② 자기 완주율, ③ 카테고리 평균 완주율(=prior).

### 3.1 Prior 결합 <span class="muted" style="font-size:15px">— 이론 2.3</span>

가중치 <span class="var">w</span>를 `exp(−조회수/PRIOR_K)`으로 만든다. 조회 0 → w≈1(카테고리에 의존), 조회 100+ → w≈0(자기 완주율 신뢰).

```python
def prior_weights(views):
    return np.exp(-views / PRIOR_K)   # PRIOR_K = 30

# 카테고리평균 × w + 자기완주율 × (1-w)  → prior 쪽으로 shrinkage
combined = category_rate * w + complete_rate * (1 - w)
```
<p class="loc">1단계 · prior 결합부</p>

그다음 성공/실패 수를 만드는데, 여기 **핵심 트릭**이 있다 — 실제 조회수 대신 무조건 <code>PSEUDO_N</code>을 곱한다.

```python
clipped = PSEUDO_N          # = 10 (항상 고정!)
return {
    "success": combined * clipped,        # → Beta의 α 재료
    "failure": (1 - combined) * clipped,  # → Beta의 β 재료
}
```
<p class="loc">1단계 · 성공/실패 재료</p>

:::callout{type="think" title="PSEUDO_N = 10 이 왜?"}
조회 5000짜리의 Beta는 원래 **극도로 뾰족**해져 로또성이 사라진다 → 신규가 못 이긴다. 일부러 "표본 10개 본 셈" 쳐서 α+β를 ~10으로 눌러, **모두에게 탐색 여지를 남긴다.**
:::

### 3.2 Beta 샘플링 <span class="muted" style="font-size:15px">— 이론 2.4</span>

3.1이 만든 success/failure를 Beta의 <span class="var">α</span>, <span class="var">β</span>로 그대로 넣고 값 하나를 뽑는다. 이 한 줄이 Thompson Sampling의 심장.

```python
def thompson_scores(combined):
    alpha = combined["success"]
    beta  = combined["failure"]
    return np.random.beta(alpha + 1, beta + 1)   # 종모양에서 랜덤 1개 뽑기
```
<p class="loc">2단계 · Beta 샘플링</p>

`+1, +1`은 데이터가 전무할 때도 "0~1 완전 균등"에서 출발하게 하는 안전 바닥(무정보 prior, Beta(1,1)).

### 3.3 View decay <span class="muted" style="font-size:15px">— 이론 2.5</span>

신규 밀어주는 retriever인데 조회수 많은 게 상위를 독식하면 안 된다. 그래서 조회수 많을수록 sigmoid로 점수를 깎아 곱한다.

```python
shift = DECAY_CENTER + 4 / DECAY_STEEP   # = 500 + 40 = 540 (꺾이는 중심)
x = DECAY_STEEP * (views - shift)        # = 0.1 * (views - 540)
sigmoid = expit(-x)                       # S자: 조회수 ↑ → 출력 1→0
weight = DECAY_MIN + (1 - DECAY_MIN) * sigmoid   # 최소 0.1 ~ 최대 1.0

final_scores = ts_scores * decay_weights          # 2단계 × 3단계
```
<p class="loc">3단계 · view decay</p>

| 조회수 | sigmoid 출력 | 감쇠 가중치 | 상태 |
|---|---|---|---|
| ≤ 500 (문턱) | ≈ 0.98 | **≈ 1.0** | 감쇠 시작점 — 여기까진 안 깎음 |
| 540 (중심) | 0.5 | 0.55 | 절반쯤 감쇠 |
| 580 | ≈ 0.02 | ≈ 0.12 | 거의 바닥 |
| 700+ | ≈ 0 | **≈ 0.1** | 10분의 1로 눌림 (과노출) |

:::callout{type="think" title="감쇠는 언제 시작되나"}
**조회수 500(=문턱)부터** 깎이기 시작해 **580쯤 바닥(0.1)**에 닿는다. 전이 폭 **80 = 8 / DECAY_STEEP** — *문턱과 무관*하게 `DECAY_STEEP`만 폭을 정한다.
:::

### 3.4 파라미터 = 손잡이

튜닝은 결국 이 값들을 조절하는 것. 각각이 무엇을 바꾸는지.

| 파라미터 | 예시값 | 무엇을 조절 |
|---|---|---|
| `PRIOR_K` | 30 | 조회수 몇부터 **자기 데이터를 믿을지** (클수록 오래 카테고리 평균 의존) |
| `PSEUDO_N` | 10 | 모두의 **탐색 여지** (작을수록 신규 유리, 순위 흔들림↑) |
| `DECAY_CENTER` | 500 | 조회수 **몇부터 감쇠** 시작 |
| `DECAY_STEEP` | 0.1 | 감쇠가 **얼마나 급하게** 꺾이나 |
| `DECAY_MIN` | 0.1 | 감쇠 **바닥** (최소 10%는 남김) |

### 3.5 후처리와 운영 특성

#### ① 정렬 → dynamic threshold 필터

최종점수 내림차순 정렬 후, **첫 페이지**에선 조회수가 이미 임계 이상인 아이템을 아예 뺀다(신규 취지). 임계값은 완주율 좋을수록 커져 좀 더 살려둔다.

```python
dynamic_threshold = max(30, min(1000 * combined_cvr, 1000))
if view_count >= dynamic_threshold:
    continue   # 이미 뜬 건 제외
```
<p class="loc">후처리 · dynamic threshold</p>

:::callout{type="think" title="의도 — '많이 본 걸 벌주기'가 아니라 '졸업 제도'"}
`combined_cvr`은 조회수가 아니라 **완주율(품질)**이다. 이 필터의 목적은 **이미 노출 기회를 충분히 받은 콘텐츠를 fresh에서 졸업시켜**, 희소한 첫 페이지 슬롯을 *아직 기회를 못 받은 신규에게 계속 돌리는 것*. 이 자기제한 루프가 독식을 막고 **회전(turnover)**을 강제한다.
:::

| 완주율 (cvr) | 졸업 컷 (조회수) | 의도 |
|---|---|---|
| 0.02 (반응 나쁨) | 30 | 손절 — 일찍 뺌 |
| 0.5 (보통) | 500 | 중간 |
| 0.9 (반응 좋음) | 900 | 연장 — 잘 되니 더 유지 |

#### ② seen 필터 · 페이지네이션

이미 본 콘텐츠(`seen`) 제외. cursor로 최근 3일 → 다음 요청마다 과거로 확장.

#### ③ 캐시 — 중요

:::callout{type="warn" title="주의"}
스코어링 결과는 `(날짜, user_segment)` 키로 **짧게 캐시**된다. `np.random.beta`는 캐시 채울 때 한 번만 실행 → **캐시 유효기간 동안 랜덤 샘플이 고정**되고 만료 시 재추첨. *유저 요청마다 매번 재샘플링되는 게 아니다.*
:::

## 4. 예시 — A(신규) vs B(검증됨)

| | A · 신규 | B · 검증됨 |
|---|---|---|
| 조회수 | 3 | 5,000 |
| 관측 완주율 | 100% (3/3) | 60% (3000/5000) |
| 1️⃣ Prior 결합 (w) | w≈0.9 → **카테고리 평균 쪽**으로 크게 당겨짐 | w≈0 → **60% 거의 그대로** |
| 2️⃣ Beta 모양 | 펑퍼짐 → 샘플이 **크게 흔들림** | 표본 10 고정이라 **적당히 흔들림** |
| 3️⃣ View decay | ×1.0 (감쇠 없음) | ×0.1 (조회 5000 → 크게 감쇠) |

<p class="muted">→ A는 <strong>가끔</strong> B를 이겨 상위 노출(탐색). 대부분은 안정적. 노출이 쌓이면 A의 Beta가 뾰족해지며 실력으로 수렴. "무조건 신규 우대"도 "무조건 검증 우대"도 아닌 <strong>확률적으로 공정한 기회 배분</strong>이 핵심.</p>

## 5. 한 장 요약

<div class="card" style="font-size:18px; line-height:1.7">
카테고리 평균으로 <strong>신규의 부족한 데이터를 메꾸고</strong>(Prior·Shrinkage) → 완주율 불확실성만큼 <strong>Beta 분포에서 뽑아 신규에게 기회를 주되</strong>(Thompson Sampling) → 이미 노출 많이 받은 건 <strong>Sigmoid로 볼륨을 낮춘다</strong>(View decay).
</div>

:::callout{title="관통하는 철학"}
세 장치 모두 **딱 자르지 않고 부드럽게 조절**한다 — `exp` 곡선 · Beta 종모양 · Sigmoid S자 전부 매끄러운 곡선이라 순위가 튀지 않는다. 그리고 데이터가 쌓일수록 탐색이 저절로 활용으로 전환된다.
:::

## 부록 — 핵심 함수 구성

| 기능 | 함수(개념) |
|---|---|
| 진입점 | `retrieve` |
| 재료 추출 | `extract_and_validate` |
| 1단계 Prior 결합 | `combine_with_global_prior` |
| 2단계 Beta 샘플링 | `thompson_scores` |
| 3단계 View decay | `view_decay` |
| 점수 조립·정렬·캐시 | `calculate_scores` · `fetch_and_score_cached` |

<p class="muted" style="font-size:14px">더 알아보기: Multi-Armed Bandit, Thompson Sampling (1933), Beta-Bernoulli conjugate prior, Bayesian shrinkage.</p>

<p class="foot">cold-start 랭킹 학습 노트 · 공개 가능한 개념/예시값 기준 작성</p>
