---
title: World / Spaceship — 공간과 씬 연결
sidebar_position: 4
---

# World / Spaceship 연동 가이드

**기준:** main `b73e0e76` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

별도 World API 문서가 없어 코드에서 현재 연결 지점을 정리했습니다. 저작된 맵·Collider 배치와 Core 공간 계산, Spaceship 저장 실험은 서로 다른 책임입니다.

## 전장 공간 입력

| 계약 | 제공 값 | 소비자 |
| --- | --- | --- |
| `IBattlefieldTurretInputSource.CaptureTurretLayout()` | 순수 `BattlefieldSpatialInput` | Core의 터렛 배치 계산 |
| `IBattlefieldTurretInputSource.LayoutChanged` | 실제 배치 변화 알림 | Scene 조립자가 입력 재수집 |
| `IBattlefieldEnemyPositionSource.CaptureEnemyPositions()` | `IReadOnlyList<EnemySpatialInput>` | Match 동적 참가자 갱신 |
| `MatchSession.Battlefield` | topology·frontline·grid 결과 | World/UI/디버그 조회 |

`TurretBattlefieldInputSource`와 `EnemySpawnExecutor`가 각 입력을 제공합니다. `InitialStageCompositionRoot`가 이 값을 조립합니다. 소비자가 Transform을 Domain에 직접 전달하거나 Match의 컬렉션을 직접 수정하지 않습니다.

터렛 배치 변경은 topology 재계산, Player·Enemy 이동은 동적 위치 갱신으로 구분합니다. 현재 grid/영역 진단 기능을 실제 맵 확장·적 경로 정책 전체로 설명하지 마세요.

## Spaceship 왕복 준비

1. `SpaceshipEnter`에 로드할 Scene 이름과 목적지 Transform 이름을 지정합니다. 기본 목적지 이름은 `Triangle`입니다.
2. Player 오브젝트의 **Layer**가 `Player`인지 확인합니다. 이 진입 판정은 태그가 아닙니다.
3. Scene이 Build Settings에 있고 목적지 이름이 일치해야 합니다. Additive 로드 후 Player 위치를 이동합니다.
4. `SpaceshipExit`에는 이미 로드된 돌아갈 Scene, 귀환 Trigger 이름, 언로드할 원래 Scene 이름을 설정합니다.
5. 출구는 Trigger 아래쪽으로 Collider 크기와 padding을 반영해 Player를 옮깁니다. Rigidbody2D가 있으면 속도도 초기화합니다.

씬 진입/출구는 Trigger로 실행됩니다. 외부에서 `EnterSpaceship()`이나 `TryExit()`를 호출하는 public API는 아닙니다. 필드 이름·Scene 이름이 잘못되면 Console 오류와 함께 전환이 중단됩니다.

## 진행 상태 실험 API

| API | 현재 동작 |
| --- | --- |
| `SpaceshipProgressReader.MissionData` | 현재 선택 미션 데이터 |
| `SpaceshipProgressReader.ProgressData` | coin·progressLevel 데이터 |
| `SpaceshipProgressReader.Load<T>(...)` | 초기 JSON 또는 이번 세션에서 저장한 JSON을 객체에 덮어쓰기 |
| `MissionProgresser.AdvanceMission()` | 선택 미션을 1과 2 사이에서 전환 후 저장 |
| `NaviProgresser.TryUpgrade()` | coin이 1 이상이면 1 소비·level 증가·저장, 아니면 false |

현재 파일명은 코드 그대로 `PocMissonData.json`과 `PocProgressData.json`입니다. 경로는 `Application.persistentDataPath`입니다. 철자를 임의로 고치면 기존 파일 조회와 달라집니다.

:::warning 정식 저장 계약이 아닙니다
`SaveSession` 플래그는 런타임 시작 때 false로 초기화됩니다. 파일이 있어도 이번 세션 저장 플래그가 없으면 초기 TextAsset을 읽습니다. 재실행 후 영구 진행 복구·Cloud Save·Core Reward transaction이 완성됐다고 설명하지 않습니다. Reader 참조와 초기 JSON이 없으면 동작하지 않습니다.
:::

## 검증

- Planet → Spaceship → Planet 왕복 후 Player가 Trigger에 갇히지 않는지 확인합니다.
- 돌아갈 Scene이 미리 로드돼 있는지 확인합니다.
- 진행 업그레이드 실패(false) 시 UI에서 성공으로 표시하지 않습니다.
- 저장 플래그의 세션 내 재진입과 앱 재실행을 따로 시험합니다.
- [터렛 snapshot](turret/snapshots.md)과 Core grid를 World의 최종 점령 규칙으로 확정하지 않습니다.
