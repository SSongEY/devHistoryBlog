---
title: "신규 콘텐츠는 어떻게 순위를 매길까 — Beta·Thompson Sampling·Sigmoid로 푸는 cold-start 랭킹"
date: 2026-09-09
tags: ["추천시스템", "통계", "Thompson-Sampling", "학습기록"]
summary: "데이터가 거의 없는 신규 콘텐츠를 공정하게 평가하는 세 가지 부드러운 장치 — Bayesian prior·shrinkage, Beta 분포와 Thompson Sampling, Sigmoid decay — 를 이론부터 코드 조립까지 정리한 학습 노트."
draft: false
---

신규 콘텐츠는 시청/클릭 데이터가 거의 없다. 그런데 우리가 알고 싶은 건 "이거 사람들이 끝까지 볼까?"(완주율 같은 성공 지표)다. 데이터가 없는 대상을 어떻게 공정하게 줄 세울지 — 이게 cold-start 랭킹 문제다. 이 글은 그걸 푸는 세 가지 통계 장치를 이론부터 코드 조립까지 정리한 학습 노트다.

## 무슨 문제를 푸나

:::card
**딜레마 ① 적은 데이터를 믿을 수 있나** — 조회 3번에 완주 3번인 A는 완주율 100%? 진짜 좋은 걸까 운일까. 조회 5000번에 완주 3000번인 B는 60%지만 이건 믿을 만하다.

**딜레마 ② 신규에게 기회를 주나** — 검증된 것만 밀면 안전하지만 신규는 영영 못 뜬다. 신규를 마구 밀면 품질이 흔들린다. 이게 *탐색(explore) vs 활용(exploit)* 딜레마다.
:::

:::callout{title="핵심"}
이 두 딜레마를 **세 개의 부드러운 장치**로 푼다 — **①** 부족한 데이터를 카테고리 평균으로 메꾸고(Prior·Shrinkage), **②** 불확실한 만큼 랜덤 기회를 주고(Thompson Sampling), **③** 이미 많이 노출된 건 눌러준다(Sigmoid decay).
:::

## 이론

### 완주율 = 베르누이 "보상"

한 명이 콘텐츠를 봤을 때 결과는 둘 중 하나다: 끝까지 봄(성공) 또는 중간 이탈(실패). 이렇게 성공/실패 딱 두 결과인 시행이 **베르누이 시행**(동전 던지기와 같은 구조). 여러 명이 보면 성공 α번·실패 β번이 쌓인다. 관측 완주율은 `α/(α+β)`지만 데이터가 적으면 이 값을 믿기 어렵다.

:::analogy
🎯 **비유** — 동전을 3번 던져 3번 앞면. "이 동전 앞면 확률 100%"라고 말할 수 있나? 없다. **3번은 너무 적다.**
:::

### Beta 분포 — "완주율이 얼마일지"에 대한 확신의 모양

완주율 p를 숫자 하나로 콕 찍는 대신, "p가 이 근처일 가능성이 높다"는 **종모양 그래프**로 표현한다. 이게 **Beta 분포**이고 두 숫자로 정해진다:

:::formula{big}
Beta(<span class="var">α</span>, <span class="var">β</span>)　 <span class="var">α</span> = 성공 수 + 1 · <span class="var">β</span> = 실패 수 + 1
:::

핵심 성질 하나만 기억하면 된다 — **데이터가 많을수록 뾰족**해지고(확신), **적을수록 펑퍼짐**해진다(불확실). 곡선 아래 넓이는 항상 1이라, "그럴듯한 완주율 범위"가 좁아지면 높이가 솟는다. 이게 뾰족함의 정체다.

:::callout{type="think" title="왜 하필 Beta?"}
완주율처럼 **0~1 사이 비율**의 불확실성을 표현하기에 수학적으로 가장 자연스러운 분포이기 때문. 베르누이 시행의 짝꿍(켤레 사전분포)이라 성공/실패 수를 그대로 α, β에 넣으면 된다.
:::

베이즈 정리로 유도하면 "사후믿음 ∝ 가능도 × 사전믿음"에서, 균등 사전 Beta(1,1)에 완주 s·이탈 f를 관측하면 사후는 정확히 `Beta(s+1, f+1)`이 된다. 코드에서 자주 보이는 `+1`은 바로 이 **Beta(1,1) = 완전 무지(균등)에서 출발**했다는 흔적이고, 그 결과 완주율 추정이 `(s+1)/(s+f+2)`로 눌려 *"3/3 = 100%" 같은 극단 단정을 막는다*(라플라스 보정).

### Prior와 Shrinkage — 데이터가 적을 때 평균으로 당기기

신규를 3번 시청만으로 판단하긴 불안하다. 그럼 "이 카테고리 콘텐츠는 보통 완주율이 이 정도"라는 평균을 빌려온다(**Prior**). 관측치를 이 prior 쪽으로 끌어당기는 게 **Shrinkage**.

:::formula
보정된 완주율 = 카테고리평균 × <span class="var">w</span> + 관측완주율 × (1 − <span class="var">w</span>)
:::

w는 "데이터를 얼마나 안 믿을지"의 가중치. 데이터 적으면 w↑(평균 의존), 많으면 w↓(관측치 신뢰). 흔한 구현은 `w = exp(−조회수 / k)` 꼴 — 조회수가 임계 k에 가까워질수록 자기 데이터를 믿기 시작한다.

:::analogy
🍜 **비유** — 처음 보는 식당을 리뷰 3개로 판단하기 불안하니, 일단 "이 동네 같은 종류 식당 평균 별점"을 섞어 추측한다. 리뷰가 수백 개 쌓이면 그때 그 식당 별점만 본다.
:::

### Thompson Sampling — 불확실한 놈에게 복권을 준다

이제 콘텐츠마다 Beta 종모양이 있다. 평균값으로 줄 세우면 *불확실하지만 잠재력 있는 신규*가 늘 진다. **Thompson Sampling**의 아이디어는 단순하다 —

:::formula{big}
각 콘텐츠의 종모양에서 <span class="var">값 하나를 랜덤으로 뽑아</span>, 그 값을 점수로 쓴다.
:::

검증된 콘텐츠(뾰족)는 어디서 뽑아도 비슷한 값 → 안정적 점수. 신규(펑퍼짐)는 뽑을 때마다 크게 흔들려 *가끔 상위 노출 기회*를 얻는다(= 탐색). 노출이 쌓여 종모양이 뾰족해지면 로또성이 저절로 사라지고 실력으로 정착한다.

:::callout{title="자동 균형"}
확실한 놈은 실력대로, 불확실한 놈은 가끔 대박. **탐색→활용 전환이 파라미터 조작 없이 자동으로** 일어나는 게 TS의 아름다움. 배경은 Multi-Armed Bandit(여러 슬롯머신 중 뭘 당길까) 문제의 고전 해법이며, 1933년 W. R. Thompson이 제안했다.
:::

### Sigmoid — 부드러운 조광 스위치

**Sigmoid**는 값을 0~1로 부드럽게 눌러 담는 S자 곡선이다. 한동안 평평 → 문턱을 넘으면 확 꺾임 → 다시 평평. 딱 끊는 if문 대신 이걸 쓰는 이유는, "조회 539는 만점, 540은 0점" 같은 급단차가 경계에서 순위를 요동치게 만들기 때문. Sigmoid는 전환을 매끄럽게 만들어 순위 안정성을 지킨다.

## 세 장치를 조립하기

<div class="pipe">
  <div class="step"><span class="n">1</span><h5>Prior 결합</h5><p>부족한 데이터를 카테고리 평균으로 보정</p></div>
  <div class="arrow">→</div>
  <div class="step"><span class="n">2</span><h5>Beta 샘플링</h5><p>불확실한 만큼 랜덤 점수 부여</p></div>
  <div class="arrow">→</div>
  <div class="step"><span class="n">3</span><h5>View decay</h5><p>많이 노출된 건 sigmoid로 감쇠</p></div>
  <div class="arrow">→</div>
  <div class="step"><span class="n">4</span><h5>정렬·필터</h5><p>본 것 제외 · 페이지네이션</p></div>
</div>

아래는 세 장치를 numpy로 조립한 **개념 예시**다. 상수들은 설명용 예시값일 뿐이며, 실제로는 도메인·트래픽에 맞게 튜닝한다.

```python
import numpy as np
from scipy.special import expit  # sigmoid

# --- 예시 상수 (설명용, 실제로는 튜닝 대상) ---
PRIOR_K = 30          # 조회수 몇부터 자기 데이터를 믿기 시작할지
PSEUDO_N = 10         # 모두에게 남기는 '탐색 여지' (표본을 이만큼 본 셈)
DECAY_CENTER = 500    # 이 조회수부터 감쇠 시작
DECAY_STEEP = 0.1     # 감쇠가 얼마나 급하게 꺾이나
DECAY_MIN = 0.1       # 감쇠 바닥 (최소 10%는 남김)

def rank_scores(views, self_rate, category_rate):
    # ① Prior 결합: 데이터 적을수록 카테고리 평균 쪽으로 shrinkage
    w = np.exp(-views / PRIOR_K)
    combined = category_rate * w + self_rate * (1 - w)

    # 성공/실패 '재료' — 실제 조회수 대신 고정 PSEUDO_N을 곱해
    # 검증된 콘텐츠의 분포가 지나치게 뾰족해지는 걸 막고 탐색 여지를 남긴다
    success = combined * PSEUDO_N
    failure = (1 - combined) * PSEUDO_N

    # ② Thompson Sampling: 종모양에서 값 하나를 랜덤으로 뽑는다
    ts = np.random.beta(success + 1, failure + 1)

    # ③ View decay: 조회수 많을수록 sigmoid로 점수를 깎는다
    shift = DECAY_CENTER + 4 / DECAY_STEEP  # 문턱을 '감쇠 시작점'으로 정렬
    decay = DECAY_MIN + (1 - DECAY_MIN) * expit(-DECAY_STEEP * (views - shift))

    return ts * decay
```

:::callout{type="think" title="PSEUDO_N을 왜 고정하나"}
조회수가 아주 큰 콘텐츠의 Beta는 원래 극도로 뾰족해져 로또성이 사라진다 → 신규가 못 이긴다. 일부러 "표본 N개 본 셈" 쳐서 α+β를 눌러, **모두에게 탐색 여지를 남기는** 의도적 설계다.
:::

:::callout{type="warn" title="운영 주의 — 캐시와 랜덤 샘플"}
`np.random.beta`는 매 요청마다 재실행하면 순위가 계속 요동친다. 보통 (시간창, 세그먼트) 키로 결과를 캐시하는데, 그러면 **캐시 유효기간 동안 랜덤 샘플이 고정**되고 만료 시 재추첨된다. "유저 요청마다 매번 재샘플링"이 아니라는 점을 기억.
:::

## 한 장 요약

:::card
카테고리 평균으로 **신규의 부족한 데이터를 메꾸고**(Prior·Shrinkage) → 완주율 불확실성만큼 **Beta 분포에서 뽑아 신규에게 기회를 주되**(Thompson Sampling) → 이미 노출 많이 받은 건 **Sigmoid로 볼륨을 낮춘다**(View decay). 세 장치 모두 딱 자르지 않고 부드럽게 조절하니 순위가 튀지 않고, 데이터가 쌓일수록 탐색이 저절로 활용으로 전환된다.
:::

> 더 알아보기: Multi-Armed Bandit, Thompson Sampling (1933), Beta-Bernoulli conjugate prior, Bayesian shrinkage.
