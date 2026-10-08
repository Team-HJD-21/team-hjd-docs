---
title: 전장 공간 입력
---

# 전장 공간 입력

**기준:** main `eb35ceb1` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

## 전장 공간 입력

| 계약 | 제공 값 | 소비자 |
| --- | --- | --- |
| `IBattlefieldTurretInputSource.CaptureTurretLayout()` | 순수 `BattlefieldSpatialInput` | Core의 터렛 배치 계산 |
| `IBattlefieldTurretInputSource.LayoutChanged` | 실제 배치 변화 알림 | Scene 조립자가 입력 재수집 |
| `IBattlefieldEnemyPositionSource.CaptureEnemyPositions()` | `IReadOnlyList<EnemySpatialInput>` | Match 동적 참가자 갱신 |
| `MatchSession.Battlefield` | topology·frontline·grid 결과 | World/UI/디버그 조회 |

`TurretBattlefieldInputSource`와 `EnemySpawnExecutor`가 각 입력을 제공합니다. `InitialStageCompositionRoot`가 이 값을 조립합니다. 소비자가 Transform을 Domain에 직접 전달하거나 Match의 컬렉션을 직접 수정하지 않습니다.

터렛 배치 변경은 topology 재계산, Player·Enemy 이동은 동적 위치 갱신으로 구분합니다. 현재 grid/영역 진단 기능을 실제 맵 확장·적 경로 정책 전체로 설명하지 마세요.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)
