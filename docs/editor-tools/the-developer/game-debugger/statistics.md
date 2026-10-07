---
title: Statistics와 그래프
sidebar_position: 6
---

# Statistics와 그래프

> **중요도: 중요** · 요청량과 실제 생성·사망 추이, 배속 효과, 실행 간 차이를 분석할 때 읽습니다.

## 보기와 실행 기록 선택

Statistics의 `View`는 두 가지입니다.

- **Time series:** 시간 구간별 수치의 선 그래프.
- **Spawn decisions / distribution:** 요청별 공간/생성 Inspector. [별도 사용법](spawn-inspection.md)을 참고합니다.

`A · Record`에서 LIVE 또는 종료 Match/IMPORTED를 선택합니다. A는 주요 기록, B는 비교 기록입니다. 이전 실행이 남아 있으면 B로 지정해 같은 조건을 비교할 수 있습니다.

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/09-time-series.mp4" title="요청·생성·사망의 시간 추이" caption="시간 구간별 집계를 선으로 연결한 그래프입니다. X축 시간, Y축 수량/bin, 범례와 가시 구간을 함께 읽습니다. 막대 히스토그램이 아니라 시간 bin 기반 선 그래프입니다." />

## 기본 그래프 읽기

기본은 요청·생성·사망 동시 표시, 게임시간 **5초 bin**, 최신 **60초** 추적입니다.

| 선/단위 | 의미 |
| --- | --- |
| 요청 · 황토 | 구간 안의 요청 횟수 |
| 생성 · 초록 | 실제 생성된 객체 수 |
| 사망 · 빨강 | EnemyHealth가 확정한 사망 객체 수 |
| 제거 · 보라 | Despawn·종료·추적 해제 수. 범례에서 추가 표시 가능 |
| X축 | Game 또는 Real seconds |
| Y축 | 수량/bin 또는 선택 지표의 단위 |
| A 실선 / B 점선 | 주 기록과 비교 기록 |

예를 들어 요청 한 번으로 10마리가 생성됐다면 같은 구간에 요청 1, 생성 10이 보이는 것이 정상입니다. 한 적이 사망한 뒤 제거되면 두 사건이 기록될 수 있지만 합쳐서 처치 2회라고 하지 않습니다.

그래프를 클릭하면 선택 구간의 A/B 수치를 아래에서 읽을 수 있습니다. 지도나 Inspector의 개체 선택과는 다른 시간 구간 선택입니다.

## 축 탐색과 최신 추적

| 조작 | 결과 |
| --- | --- |
| Follow latest | 현재 설정한 시간 폭으로 최신 추적(기본 60초). 수동 X 탐색 후 다시 켜면 최신으로 복귀 |
| Auto Y | 현재 X 가시 구간의 표시 series 최댓값 + 여유로 Y 범위 조정 |
| X + / X −, Ctrl+휠 | 시간 폭 확대/축소 |
| 가로 scrollbar, Shift+휠 | 과거 시간 탐색. Follow 해제 |
| Y + / Y −, Alt+휠 | Y 범위 확대/축소. Auto Y 해제 |
| 세로 scrollbar, 일반 휠 | Y 범위 탐색. Auto Y 해제 |
| 가운데 버튼 드래그 | 시간/Y 범위 이동 |
| Fit | 전체 시간 범위에 맞추고 자동 범위 활성화 |

Auto Y는 전체 기록의 오래된 최대치가 아니라 **현재 보이는 구간**을 기준으로 합니다. 작은 수치가 이후에도 계속 눌려 보이면 Auto Y/가시 구간을 확인하세요.

## 큰 Statistics 창

**Open in window**를 누르면 통계 전용 창이 열립니다. 선택한 영역의 조회 설정으로 시작한 뒤 독립적인 필터·축·기록을 사용할 수 있습니다.

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/10-statistics-window.mp4" title="Statistics를 독립 창으로 크게 보기" caption="Open in window로 통계 창을 분리해 더 넓은 화면에서 확인하는 예시입니다. A/B 비교가 필요하면 별도 기록을 준비하고 같은 clock/bin/필터를 맞추세요." />

Match와 수집기는 공유합니다. 통계 창을 크게 열거나 Game Debugger를 닫는다고 별도 게임을 시작하지 않습니다. 좁은 분할 창에서 시각적으로 부족한 경우 이 창으로 상세를 확인하세요.

## clock, bin과 필터

`Chart settings / filters`를 펼칩니다.

- **Real clock:** 실제 시간으로 구간을 집계합니다. 끄면 게임시간입니다. 배속 실험의 목적에 맞춰 선택합니다.
- **Bin seconds:** 한 점이 대표하는 집계 폭. 작은 폭은 변화가 상세하고 큰 폭은 장기 추이에 적합합니다.
- **Requests / Spawned / Died together:** 기본 동시 표시. 끄면 Single metric을 선택할 수 있습니다.
- **Single metric:** 생존 수·전력·가동 비율·영역 면적·외곽 길이 등의 개별 지표.
- **source / preset / Enemy type / SpawnPoint ID:** 실제 이벤트를 필터링합니다. 모든 필터가 Match 전체 표본을 지점별 수치로 바꾸는 것은 아닙니다.

Alive/Power/Ratio/Area/Length는 Match 전체 표본입니다. type/point별 계획 수 계약이 없는 필터에서 Planned/Executed/Failures는 N/A일 수 있습니다. 집계 bin이 2,048개를 넘으면 실제 폭을 늘리고 축에서 알립니다.

## N/A와 불완전 기록

서버 집계가 없는 Client, 표본이 없는 bin, 사망 계약 없는 이전 기록, 관측 손실/상한으로 총량을 보장할 수 없는 구간은 없는 값을 0으로 연결하지 않습니다. Client의 서버 미관측 생성·사망·제거 0은 N/A이며, 실제 양수로 기록된 사실은 유지합니다.

**PARTIAL**은 중간 수집·sequence gap·상한 초과·정상 종료 마커 부재 등을 알립니다. 기록된 양수는 관측 사실이지만 전체 실행의 총량이라고 단정하지 않습니다.

## 비교 실험의 조건

1. A/B의 Stage·난이도·preset/요청 예산과 Build 라벨을 확인합니다.
2. 같은 clock/bin과 필터를 맞춥니다.
3. 중간 수집·PARTIAL·누락 여부를 먼저 확인합니다.
4. 해당 지표가 전체 Match 표본인지 필터된 사건 수인지 구분합니다.
5. 차이를 발견하면 Timeline과 요청 당시 Spawn Inspector로 원인을 좁힙니다.

그래프는 인과관계를 자동 증명하거나 최종 밸런스를 판정하는 도구가 아닙니다.

## 다음에 읽을 문서

[Spawn 판단](spawn-inspection.md) · [기록 Export와 A/B 공유](timeline-and-sharing.md) · [문제 해결](troubleshooting.md)
