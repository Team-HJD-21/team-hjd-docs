---
title: 빠른 시작
sidebar_position: 2
---

# 첫 실행부터 스폰 확인까지

> **중요도: 필수** · Game Debugger를 처음 사용하는 팀원은 이 페이지부터 따라 합니다.

## 1. 준비와 창 열기

1. 도구가 포함된 프로젝트 버전을 받습니다. [문서 기준](../index.md)을 확인하세요.
2. `Assets/PoC/Spaceship/Scenes/Initial_Stage.unity`를 엽니다.
3. 배치·설정 변경을 저장합니다. Play Mode에서 복제한 객체나 저장하지 않은 Edit Mode 배치가 다음 실행에 남는다고 가정하지 않습니다.
4. Unity 상단 **Tools → TeamHJD → Game Debugger**를 선택합니다.

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/01-open-menu.png" title="Game Debugger 메뉴 열기" caption="Unity 상단 Tools → TeamHJD → Game Debugger에서 창을 엽니다." />

별도 `Battlefield Debug` 메뉴/창은 제거됐습니다. Battlefield 기능은 Game Debugger 내부 패널이며 Scene Overlay는 유지됩니다.

## 2. 기본 모니터 배치

상단 **Monitor ×4**를 누르면 Overview / Battlefield / Encounter / Statistics를 함께 볼 수 있습니다. 창이 좁다면 `Encounter + Stats`를 사용하세요.

Play를 누르고 Overview에서 다음을 확인합니다.

- 현재 Match와 SERVER 권한이 보입니다.
- 게임/실제 시간과 수집 수치가 갱신됩니다.
- 연결 경고가 있으면 펼쳐 읽습니다.

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/02-monitor-four-panels.png" title="Monitor ×4 — 네 패널을 함께 보기" caption="Overview / Battlefield / Encounter / Statistics 배치 예시입니다. 이 사진은 Edit Mode PREVIEW이므로 authority N/A, NO RECORD와 비활성 시간 버튼이 정상입니다. Play Mode에서는 활성 Match와 실시간 수치를 확인하세요." />

:::note 자동 첫 요청
현재 Stage 구성은 Match 시작 후 첫 Encounter를 자동 요청합니다. Game Debugger를 열었다고 이 요청이 비활성화되지 않습니다. 이미 생성된 적이 있다면 그 상태에서 추가 요청을 시험하는 것입니다.
:::

## 3. 한 번 요청하고 실제 결과 보기

1. Encounter 패널에서 `Squad Preset Order = Normal`, `Max Enemy Count = 10`으로 시작합니다. 프로젝트의 프리셋 카탈로그가 해당 이름을 제공해야 합니다.
2. **Request Encounter from Current Match Snapshot**을 누릅니다.
3. 최근 요청 표에서 DebugWindow 출처, 계획/실제 수량, 성공 또는 실패를 확인합니다. Request 행을 선택하면 상세 사유를 볼 수 있습니다.
4. 실제 Scene에서 적이 생성됐는지 확인합니다. 수량이 요청 예산과 다르면 실패로 단정하지 말고 후보/프리셋 세트와 실행 결과를 확인합니다.

`Max Enemy Count`는 **전체 요청 예산**입니다. 지점마다 10마리씩 생성하거나 현재 생존 수를 10으로 제한한다는 뜻이 아닙니다.

## 4. 그래프와 판단 자료 연결

Statistics의 기본 `Time series`에서는 요청·실제 생성·사망 추이를 확인합니다. 아직 사망이 발생하지 않았다면 확정 사망 관측이 있는 구간의 0은 정상입니다. 관측 계약이 없는 N/A와는 다릅니다.

`View → Spawn decisions / distribution`으로 바꾸고 방금 요청을 선택하면 당시 Grid·후보 지점·배정 사유·계획/실제 결과를 볼 수 있습니다. **Follow latest**를 끄면 선택한 요청을 고정합니다.

Scene View의 **Gizmos**와 Battlefield의 **Scene layers**를 모두 켜고 `Frame Grid`로 표시 범위를 맞춥니다. 전선이 없다면 유효한 비공선 터렛 3개 이상인지 먼저 확인합니다.

## 첫 확인 체크리스트

- [ ] 활성 Match와 진단 source가 확인된다.
- [ ] 일회 요청의 결과와 실제 생성이 확인된다.
- [ ] 통계의 Request와 Spawn Inspector가 같은 요청을 설명한다.
- [ ] Scene 표시가 현재 상태인지 PREVIEW인지 구분한다.
- [ ] 시험 자료를 보존할 필요가 있으면 종료 전에 JSON을 Export한다.

이 체크리스트는 도구와 기본 생성 경로의 확인입니다. 모든 적의 이동·공격·피해·승패까지 검증한 것은 아닙니다.

## 다음에 읽을 문서

[창 구성·시간 제어](window-and-time.md) · [Encounter 반복 실험](encounter.md) · [문제 해결](troubleshooting.md)
