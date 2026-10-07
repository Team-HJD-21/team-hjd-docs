---
title: Encounter 요청과 반복 실험
sidebar_position: 5
---

# Encounter 요청과 반복 실험

> **중요도: 중요** · 스폰 경로와 생성량을 시험하거나 시간에 따른 분포 변화를 볼 때 읽습니다.

## 요청은 어디로 가나요?

Game Debugger의 Request는 **현재 Match Battlefield snapshot → EncounterRuntime → Planner → 서버 Executor** 경계를 사용합니다. Editor가 프리팹을 임의 Instantiate하는 별도 스폰 버튼이 아닙니다.

MatchStart 자동 요청, Game View UI, Scene 충돌 adapter, DebugWindow 요청은 같은 경계를 사용하고 출처로 구분됩니다. 최근 요청과 Timeline에서 어떤 경로가 요청했는지 확인할 수 있습니다.

## 일회 요청

1. Play Mode에서 활성 Match와 NGO Host/Server·Executor가 준비됐는지 확인합니다.
2. Encounter 패널의 **Squad Preset Order**에 실제 카탈로그의 프리셋 이름을 입력합니다. 첫 시험은 `Normal`입니다.
3. **Max Enemy Count**에 이번 요청 전체의 생성 예산을 입력합니다.
4. **Request Encounter from Current Match Snapshot**을 누릅니다.
5. 최근 요청 표에서 Request ID, 출처, planned/actual과 상태를 확인하고 행을 선택해 상세 사유를 읽습니다.

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/07-encounter-request.mp4" title="일회 요청과 planned / actual 결과" caption="현재 Match snapshot으로 Encounter를 한 번 요청하고 계획·실제 생성 결과를 확인하는 순서입니다. 기존 MatchStart 요청과 추가 DebugWindow 요청의 출처를 구분하세요." />

준비가 안 된 요청은 실패 사유를 반환합니다. Grid나 서버 검증을 우회해 강제로 생성하지 않습니다. 정상적인 수동 요청은 아직 예약된 자동 첫 요청을 취소할 수 있지만, **이미 완료된 자동 요청의 적을 되돌리지는 않습니다.**

### 예산과 실제 수량

프리셋의 완전한 구성 세트를 배정합니다. 예를 들어 한 세트가 5마리인 프리셋에 예산 12를 주면 완전한 세트 2개인 10마리까지만 계획될 수 있습니다. 남은 2마리를 새로운 부분 세트로 만들지 않습니다.

예산은 지점별 수량도, 현재 생존 적 전체의 상한도 아닙니다. 요청을 10마리씩 세 번 성공시키면 기존 적이 남아 있는 상태에서 추가될 수 있습니다. 최종 Wave·생존 상한 정책은 별도 게임 로직입니다.

## 스포너 추가·복제

`SpawnPoint` 컴포넌트가 있으면 부모 이름이나 Left/Right 여부와 관계없이 **같은 Scene 전체**에서 요청 직전에 등록됩니다. 이후 추가·복제·삭제한 지점도 다음 요청에 반영되며 다른 Scene은 섞지 않습니다.

Editor의 빈/복제 ID는 고유 값으로 보정됩니다. 기존 고유 ID는 유지하며 자동 변경은 Undo/Scene 저장 대상입니다. Runtime 복제는 serialized 원본을 덮어쓰지 않고 객체 수명 동안 별도 ID를 유지합니다.

:::warning 등록과 배정은 다릅니다
비활성/점령 지점은 등록 자료에 남더라도 스폰 후보에서는 제외됩니다. 활성 지점도 Grid 범위, Player/Turret 점유, 적 밀도, 전선 거리와 요청 예산에 따라 이번 요청에서 미배정될 수 있습니다. 지점을 늘렸다고 요청 예산이 자동 증가하지 않습니다. [후보 Reason](spawn-inspection.md)으로 실제 판단을 확인하세요.
:::

Edit Mode의 설치 버튼은 초기 테스트 런타임을 구성하는 용도입니다. 이미 런타임과 지점이 배치된 Scene에서 요청할 때마다 설치하거나 기존 지점을 두 개로 되돌릴 필요는 없습니다. 배치한 뒤 Scene을 저장하세요.

## 연속 요청

`연속 Encounter 요청 / 시뮬레이션`을 펼칩니다.

| 설정 | 기본/범위 | 뜻 |
| --- | --- | --- |
| 요청 간격 (초) | 기본 2초, 최소 0.1초 | 다음 요청 사이의 간격 |
| 최대 요청 횟수 | 기본 10, 유한 상한 10,000 | 반복 횟수. 0은 무제한 |
| 실시간 clock 사용 | 기본 꺼짐 | 켜면 timeScale과 무관한 실제 초, 끄면 게임시간 |
| preset/예산 | 일회 요청 필드 사용 | 시작할 때 고정되는 요청당 설정 |

1. 일회 요청으로 정상 연결을 먼저 확인합니다.
2. 간격·횟수·clock을 지정하고 **Start repeat**를 누릅니다.
3. 첫 요청은 한 간격이 지난 뒤 발생합니다. RUNNING/PAUSED/STOPPED, 다음 요청까지, 고정 설정, 성공/시도 횟수를 확인합니다.
4. **Stop repeat**로 종료합니다. 실패/중지 사유는 화면에 표시됩니다.

<GuideMedia type="video" src="/video/editor-tools/the-developer/game-debugger/08-repeat-running.mp4" title="연속 요청 — Running과 중단" caption="일정 간격으로 요청하는 실험입니다. Running 상태·남은 시간·성공/시도 수를 보고, 중단할 때는 Stop repeat를 사용합니다. 반복 요청 예산은 전체 생존 적 수의 상한이 아닙니다." />

### 최근 요청 표 읽기

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/12-request-results.png" title="요청별 계획·실제 생성 요약" caption="Encounter 결과 표의 Source / Preset / 계획 / 생성 / 결과를 함께 읽습니다. 사진의 DebugWindow 요청은 계획 10, 생성 10, OK입니다. 이 표는 요청 합계이며 개별 몬스터나 Network ID 목록이 아닙니다." />

어떤 지점에서 어떤 몬스터가 생성됐는지는 Statistics의 **Spawn decisions / distribution → Planned composition / Actual objects**에서 봅니다. [계획·실제 객체 상세 사용법](spawn-inspection.md#계획과-실제-결과)을 확인하세요.

## 대기·종료 규칙

- 게임시간 clock은 배속을 따릅니다. 실시간 clock은 배속과 무관합니다.
- 두 clock 모두 Editor Pause 및 timeScale 0에서는 대기합니다.
- Editor가 지연돼 여러 간격이 지나도 놓친 요청을 몰아서 처리하지 않습니다.
- 실행 중 설정을 바꾸려면 Stop → 설정 변경 → Start합니다.
- 실패/예외, Match 종료·변경, 대상 제거/비활성, 서버 준비·권한 상실, script reload, Editor 종료에서는 중지하며 자동 재시작하지 않습니다.
- 시작 pane의 창 닫기/분할 재구성은 중지시킵니다. 다른 pane은 같은 반복 상태를 조회·중지할 수 있습니다. 반복 실행기는 하나뿐입니다.
- Capture mode 진입은 이미 실행 중인 반복을 자동 중지하지 않습니다. 종료하려면 Capture를 해제하고 Stop repeat를 사용합니다.

무제한 반복은 적이 계속 누적될 수 있으므로 첫 시험에는 짧은 간격·큰 예산·무제한을 동시에 사용하지 않습니다.

## 다음에 읽을 문서

[스폰 판단과 분포](spawn-inspection.md) · [요청/생성 그래프](statistics.md) · [Enemy 연동 문서](../../../projects/the-developer/enemy.md)
