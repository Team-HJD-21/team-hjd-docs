---
title: 창 구성과 시간 제어
sidebar_position: 3
---

# 창 구성과 시간 제어

> **중요도: 중요** · 여러 값을 함께 보거나 빠르게 반복 시험할 때 읽습니다.

## 패널 배치

상단 `Layout`에서 `Single`, `2 · Columns`, `2 · Rows`, `4 · Panels`를 선택합니다. Columns는 좌우, Rows는 상하 배치입니다. 분할 경계를 드래그하면 크기를 조절할 수 있습니다.

각 영역의 `P1~P4` 옆 드롭다운으로 기능을 선택합니다. **같은 Statistics를 두 곳에 배치해 서로 다른 지표를 볼 수도 있습니다.** 클릭/포커스한 영역은 강조 테두리와 `ACTIVE · P#`로 표시되고 좌측 메뉴는 그 영역만 변경합니다.

| 빠른 배치 | 용도 |
| --- | --- |
| Battlefield + Stats | 현재 공간·터렛 상태와 시간 추이를 함께 보기 |
| Encounter + Stats | 요청과 생성량·판단 결과 연결 |
| Monitor ×4 | 전체 상태·공간·요청·통계 함께 보기 |

좁은 dock에서는 Single/상하 배치, 여러 표와 지도를 함께 보려면 넓은 창을 권장합니다. 긴 표는 가로/세로 scroll하며 열을 임의로 줄여 읽지 못하게 만들지 않습니다.

## 독립 상태와 공유 상태

| 영역별 유지 | 모든 영역이 공유 |
| --- | --- |
| 표시 기능, 기록 A/B, 지표·필터·bin/clock, 검색, 기능별 scroll, Snapshot 선택·Follow·zoom/pan | Match, Collector/Recorder, 시간 제어, Scene 레이어·셀 선택, 조건부 정지 무장, 반복 실행기 |

숨긴 영역의 상태는 다시 표시할 때 복원됩니다. 창/domain reload용 Editor 상태이며 게임 저장 데이터는 아닙니다. 패널 4개는 게임 4개를 실행하는 기능이 아닙니다.

## 시간 toolbar

Play Mode에서 상단 시간 도구를 사용합니다.

| 조작 | 동작 |
| --- | --- |
| 0.25× / 0.5× / 1× / 2× / 4× | 로컬 `Time.timeScale` 변경 |
| 수치 직접 입력 | 0~8 범위로 지정 |
| Pause / Resume | 로컬 Unity Editor 정지/재개 |
| Step | Editor를 정지하고 Unity 한 프레임 진행 |
| Restore | 도구가 소유한 시간·정지 변경 복원 |

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/03-time-controls.mp4" title="배속과 Pause — 시간 제어 실험" caption="실행 중 시간 toolbar를 조작하는 예시입니다. 게임 시간과 실제 시간을 구분하며 배속·정지 전후의 변화를 확인하세요." />

**Stop을 구분하세요.** `Stop repeat`는 Encounter 반복 요청만 중단합니다. Unity 상단의 Play 종료는 실행 중인 Match를 끝냅니다. 시간 toolbar의 `Restore`는 시간·정지 설정 복원이며 Match 종료 버튼이 아닙니다.

**Pause와 timeScale 0은 다릅니다.** Step은 timeScale이 0보다 클 때만 사용할 수 있습니다. Step 한 번은 결정론적 Match tick이나 네트워크 공통 tick을 뜻하지 않습니다.

`fixedDeltaTime`, FPS, 네트워크 clock은 자동으로 맞추지 않습니다. Host Editor의 Pause가 원격 Client까지 멈추는 것도 아닙니다.

## 종료와 복원

- 창만 닫아도 일반적인 시간 변경은 유지됩니다. 원복하려면 Restore를 사용합니다.
- Play 종료, script reload, Editor 종료에서는 소유한 값을 복원합니다.
- 외부 시스템이 timeScale을 변경했다면 그 값을 무조건 덮어쓰지 않습니다.
- 반복 실행을 시작한 pane을 닫거나 분할 재구성으로 dispose하면 반복은 중지됩니다. 같은 pane에서 기능만 바꾸는 경우에는 계속될 수 있습니다.
- Capture mode에서는 새 게임 변경 조작을 숨기지만 이미 시작한 반복이나 무장 조건부 정지를 자동 취소하지 않습니다.

## 추천 실험

먼저 1×에서 일회 요청을 확인한 뒤 반복 요청을 시작합니다. 2×에서 생성 추이를 보고, 문제 구간에서 Pause → Step → Snapshot/Timeline 상세 확인 → Restore 순서로 진행합니다. Game clock과 Real clock을 섞어 놓고 배속 전후의 생성률을 비교하지 않습니다.

## 다음에 읽을 문서

[반복 Encounter 요청](encounter.md) · [그래프 clock과 축](statistics.md) · [조건부 정지](timeline-and-sharing.md)
