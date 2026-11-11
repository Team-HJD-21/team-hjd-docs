---
title: Battlefield와 Scene 도구
sidebar_position: 4
---

# Battlefield와 Scene 도구

> **중요도: 중요** · 터렛 배치, Grid 범위, 점유와 전선 형상을 확인할 때 읽습니다.

## 먼저 시점을 구분하기

| 모드 | 표시 자료 |
| --- | --- |
| PREVIEW · Edit Mode | 정적 터렛 배치 기반 기하와 Grid. Player/Enemy 전투 입력은 아님 |
| LIVE · Play Mode | 활성 Match의 실제 Core snapshot과 동적 점유 |
| UNAVAILABLE | 조회할 Match/snapshot 없음. 이전 Match를 현재 값처럼 표시하지 않음 |

Statistics의 Spawn 지도는 **요청 당시의 불변 자료**입니다. 현재 Scene 상태가 바뀌어도 과거 지도의 위치를 덮어쓰지 않습니다.

## Scene 표시 켜기

1. Unity **Scene View → Gizmos**를 켭니다.
2. Game Debugger → Battlefield → `Scene 표시 / 레이어`를 펼칩니다.
3. **Scene layers**를 켭니다. 두 스위치가 모두 켜져야 표시와 Scene 선택이 작동합니다.
4. `Frame Grid`로 전장 범위를 화면에 맞춥니다.
5. 빠른 버튼 `Grid` 또는 `Topology`로 필요한 표시 조합을 적용합니다.

| 레이어 | 표시하는 것 |
| --- | --- |
| Uniform Grid | XY 평면의 셀 경계 |
| Territory | 현재 터렛 점으로 구성한 삼각형 영역 |
| Frontline | 삼각형 집합의 기하 외곽선 |
| Cell occupancy | 셀별 실제 점유 정보 |
| Geometric normals | 외곽 변의 기하학적 안/밖 방향 |
| Vertex labels | 터렛 점의 식별 정보 |



Scene 안의 **Battlefield Overlay**는 창과 같은 설정을 조작합니다. 보이지 않으면 Scene View의 Overlays 메뉴에서 Battlefield를 표시하세요. 창을 닫아도 Core 계산이나 공용 수집을 종료하지 않습니다.

## 셀 선택과 범위 밖 객체

`Pick cell (left click)`을 켜고 셀을 클릭합니다. 또는 `선택 셀 / 범위 초과 개체`에서 Cell ID를 입력합니다. `-1`은 선택 없음입니다.

- X/Y 인덱스와 실제 world bounds를 확인합니다.
- Turret / Player / Enemy ID는 범주별 scroll 목록으로 확인합니다.
- OOB는 Grid 밖의 객체이며 적합한 스폰 위치나 제거할 객체라는 판정이 아닙니다.
- `Frame Cell`은 Scene 카메라만 이동합니다. 객체 Transform을 변경하지 않습니다.
- `Copy cell / OOB evidence`는 표시 상한에 가려진 ID까지 포함한 전체 조회 자료를 복사합니다.
- `Copy context`는 Scene·Match·revision·Grid 등의 공유용 맥락입니다.

Cell ID는 **현재 Grid 구성 안에서의 인덱스**입니다. Grid 분할을 바꾸기 전후 같은 번호를 동일한 world 영역으로 해석하지 않습니다.

## 전선 변 검사

Battlefield 또는 Scene Overlay의 `Frontline geometry`를 펼칩니다.

1. `Pick boundary edge in Scene View`를 켭니다. Grid 셀 pick과 동시에 동작하지 않도록 상호 배제됩니다.
2. 주황 외곽선 근처를 클릭합니다. Alt 카메라 탐색은 유지됩니다.
3. 선택한 변의 두 끝 ID, 길이, 중점 XY, 소속 삼각형/연결군, outward/inward normal을 확인합니다.
4. `Frame`은 선택 변에 Scene 카메라를 맞추고, `Copy`는 기하 상세를 복사하며, `Clear`는 선택을 해제합니다.

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/05-frontline-inspector.png" title="선택 전선과 안·밖 법선" caption="turret-5 ↔ turret-6 변을 선택한 예시입니다. Scene의 강조선·법선 화살표와 우측 길이·중점·outward/inward 값을 함께 확인합니다. 법선은 기하 방향이며 방어 우세를 뜻하지 않습니다." />

기하 외곽이 만들어지려면 유효한 **비공선 터렛 점 3개 이상**이 필요합니다. 터렛을 배치하거나 이동한 뒤 PREVIEW/LIVE의 변화를 확인할 수 있지만, 표시 툴이 별도의 영역 정책을 만드는 것은 아닙니다.

:::warning 기하와 전술 판단은 다릅니다
외곽·법선·면적·길이는 현재 Core 자료의 기하 정보입니다. 적 사거리, 교전 강도, 실제 방어 우세나 influence map을 계산한 값이 아닙니다. 그 의미의 표시가 필요하면 해당 게임 시스템의 실제 계약부터 추가해야 합니다.
:::

## Grid 기본값과 Runtime override

| 위치 | 적용 대상 | 적용 방법 |
| --- | --- | --- |
| 공용 Grid 기본값 / 에셋 | 이후 생성되는 Match의 기본값 | 에셋 편집·저장 |
| 현재 Match Grid override / 명시적 적용 | 현재 활성 Match만 | 값을 입력하고 `Apply to Active Match` |

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/06-grid-settings.mp4" title="Grid 기본값 변경과 Scene 표시" caption="영상은 Edit Mode PREVIEW에서 공용 Grid 기본값과 Scene 분할을 확인하는 예시입니다. 현재 Match의 Runtime override 적용 장면은 포함하지 않습니다. Play Mode의 적용·복원 방법은 아래 설명을 참고하세요." />

주요 필드는 다음과 같습니다.

- **Center X/Y:** Grid 중앙 world 좌표. 좌측 하단이 아닙니다.
- **Origin Z:** Scene 표시 평면. 실제 공간 판정은 Unity 2D의 XY를 사용합니다.
- **Map Width/Height:** world 크기. 정사각형일 필요가 없습니다.
- **Cells X/Y:** 가로/세로 분할 수. 서로 다른 값도 가능합니다.

`Restore Authored Defaults`는 현재 Match를 에셋 기본 구성에 맞춥니다. Runtime override는 에셋에 자동 저장되지 않습니다. 에셋을 바꿨다고 이미 실행 중인 Match가 자동 변경되는 것도 아닙니다.

Grid 크기를 크게 바꾸면 객체가 OOB가 되거나 cell ID/후보 판정이 바뀔 수 있으므로 Overview 경고와 Spawn Inspector도 함께 확인하세요.

## Scene 구성 버튼을 사용할 때

Edit Mode의 `Add Turret Battlefield Input Source to Active Scene`은 실제 컴포넌트를 추가하는 구성 명령입니다. 조회/Frame과 달리 Scene을 변경하므로 대상 Active Scene을 확인하고 저장합니다. 정상 구성된 팀 Scene에 무조건 다시 설치하는 절차는 아닙니다.

## 동적 지역의 CU 시작 영역

11월 12일 main `2cbc4542b`부터 지역 Grid의 시작 셀을 설정할 수 있습니다. 위에서 설명한 Battlefield 밀도 Grid·전선 기하와 다른 데이터입니다. 지역 점유 계산에서는 CU도 위치 노드여서 CU와 터렛 두 개가 비공선이면 삼각형을 만들 수 있습니다.

1. Host Match에서 **지역 Grid · 점령 원본 → 지역 정책 → Dynamic**을 선택하고 Reset을 확인합니다.
2. **동적 시작 영역 · Host 설정**을 펼칩니다. 빈 목록은 CU가 있는 셀 하나입니다.
3. `셀 추가`로 X/Y를 편집합니다. 월드 좌표가 아닌 지역 Grid의 셀 좌표이며 CU를 포함하고 상하좌우로 연결돼야 합니다. 목록은 32행씩 표시합니다.
4. **시작 셀 적용 / 점유 Reset**을 누르고 확인합니다. 초안만 편집하면 게임 상태는 변하지 않습니다. 범위 밖·CU 미포함·대각선만 연결된 목록은 거부합니다.
5. **Scene 점령 Grid**와 **CU 시작 / 연결 제외 셀**을 확인합니다. **임시 판정 삼각형**은 계산에 쓴 자료이며 최종 점유 원본은 셀 집합입니다.

**CU 1셀 기본값**은 초안 목록만 비웁니다. 실제 적용 버튼을 눌러야 합니다. 모드/Grid Reset은 기존 명시 목록을 기본값으로 되돌립니다. Client는 확정 점유를 읽으며 시작 영역을 바꾸지 않습니다. 런타임 편집은 Scene/Prefab에 자동 저장되지 않습니다.

[API·저장 호환성과 미연결 범위](../../../projects/the-developer/core/regions-encounters.md#cu-시작-영역과-동적-연결)를 함께 확인하세요. 기존 위 영상은 신규 시작 셀 UI의 검증 영상이 아닙니다.

## 다음에 읽을 문서

[Spawn 판단과 당시 공간](spawn-inspection.md) · [공유용 캡처](timeline-and-sharing.md) · [World 공간 입력 API](../../../projects/the-developer/world/spatial-inputs.md)

## 터렛 ID 표시 — main 9cf0e16b

Scene 정점과 선택 전선 라벨은 T:01234567처럼 축약합니다. 선택 패널의 tooltip·Copy·Capture·요청 데이터는 전체 원본 ID를 유지하므로 짧은 라벨을 네트워크/저장 키로 사용하지 마세요. 배치를 복제했으면 재생 전에 Tools > TeamHJD > The Developer > Configure Turret Identities로 누락·중복 제작 키를 명시 정리합니다.
