---
title: Enemy 스폰 API 사용법
---

# Enemy 스폰 API 사용법

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## API

| API | 의미 | 실패 조건 / 주의 |
| --- | --- | --- |
| `EnemySpawnExecutor.CanSpawn` | `IsSpawned && IsServer` | 일반 Client는 false |
| `Execute(SpawnInstruction)` | 지점별 계획을 실행, 실제 생성 수 반환 | catalog·지점·Prefab 누락, 지점 비활성 등 검사 |
| `SpawnedEnemyCount` | Executor의 추적 목록 수 | 계획상의 생성 수와 구분 |
| `CaptureEnemyPositions()` | 스폰된 적의 순수 공간 입력 | despawn된 객체는 입력에서 제외 |
| `EncounterRuntime.TrySpawn(snapshot, squadOrder, maxEnemyCount, out result)` | 요청한 분대 계획·실행 | false와 result 메시지를 함께 확인 |
| `EnemyHealth.Initialize()` / `Deactivate()` | 체력 초기화·피해 수신 활성 / 피해 수신 비활성 | 네트워크에서는 서버 드라이버가 Spawn/Despawn 수명에 연결 |
| `EnemyHealth.TakeDamage(int)` / `Died` | 활성·생존 상태의 양수 피해 적용, 사망 이벤트를 한 번 발행 | 일반 MonoBehaviour이며 자체 서버·Spawn 검사나 RPC·Despawn 없음 |
| `EnemyNetworkController.DeathConfirmed` / `Despawned` | 서버에서 확인한 사망 / 네트워크 제거 알림, 인자는 NetworkObjectId | 드라이버가 Died를 받아 서버 사망 통지 후 Despawn; 생성 주체가 추적 해제 |
| `EnemyController.AssignTarget(Transform)` | 공통 Targeting 갱신 후 하위 OnTargetChanged 실행 | MovingEnemyController가 목적지/경로를 갱신; null은 대상 해제 |
| `EnemyAbility.CheckCondition()` / `TryUse()` / `IsExecuting` | 발동 조건 / 실행 수락 / 진행 상태 | 조건은 쿨타임과 분리하며 Activate 성공 때만 쿨타임 시작 |
| `EnemyTargetSelector.TryFindNearest(...)` | Runtime 후보에서 유효한 최근접 목표를 선택합니다. 요청 인원 수를 전달하면 배정 여유도 검사합니다. | 후보가 없으면 false |

`TrySpawn`의 squadOrder는 catalog의 실제 프리셋 키를 전달합니다. 특정 문자열을 모든 Scene에서 유효하다고 가정하지 않습니다. 생성 상한과 실제 생성 수는 같지 않을 수 있습니다.

현재 Encounter는 Match Battlefield의 topology/grid를 사용해 적합한 셀과 Spawn Point를 선택합니다. 같은 셀의 지점 개수로 생성 비중이 늘어나지 않으며 근거리·원거리 분산과 실패 진단은 [스폰 공간 분산](spawn-distribution.md)을 확인하세요.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)

## Stage 1 능력·투사체 — main 1a03e9a9

| 공개 API | 현재 경계 |
| --- | --- |
| `EnemyProjectileSpawner.TrySpawn(prefab, position, direction, damage)` | 네트워크 실행 중에는 Spawn된 서버만 생성. 초기화 후 NetworkObject.Spawn을 수행하고 수락 bool을 반환합니다. |
| `EnemyProjectile.Initialize(int damage, Vector2 direction)` | 투사체 피해·진행 방향 설정. 생성/네트워크 권한과 별도입니다. |
| `EnemyProjectileAbility.OnProjectileFireAnimationEvent` | 제작 설정이 Animation Event 모드일 때 예약된 발사를 한 번 수행합니다. |
| `OnProjectileAttackAnimationFinished` | 공격 모션 종료와 예약 해제. 비활성화도 남은 예약을 취소합니다. |
| `EnemyExplosionAbility.IsExecuting / RemovalRequested / OnExplosionAnimationFinished` | 폭발 실행·제거 요청·표현 종료를 서버 수명과 구분합니다. |
| `ISlowEffectReceiver.ApplySlow(multiplier, duration)` | ArcaneOrbProjectile이 유효한 대상의 receiver에 감속을 요청합니다. receiver 없는 대상에 새 이동 정책을 임의 추가하지 않습니다. |
| `ArcaneSlowEffect.SetSlowActive(bool)` | 외부에서 확정한 감속의 고리/잔상 표시만 수행합니다. 지속시간은 호출자가 소유합니다. |

현재 능력은 근접·원거리·폭발 등 제작된 구성을 재사용합니다. Source에 추가된 Stage 1 프리팹/이펙트의 존재를 최종 스폰 편성·밸런스·다중 Client 인수로 확대하지 않습니다. `EnemyRoot` 기반과 실제 Runtime catalog 참조를 확인하세요.
