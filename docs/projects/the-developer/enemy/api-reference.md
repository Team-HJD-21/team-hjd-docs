---
title: Enemy 스폰 API 사용법
---

# Enemy 스폰 API 사용법

**기준:** main `d0922f0bf86e0348bed1acbfd5ae6231a1202f63` (2026-11-01, 공개 API 정적 대조) · **영역:** 조수빈 · **원본:** `Assets/Scripts/Features/Enemy/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

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
| `EnemyController.SetTargetAndDestination(Transform)` | 타깃 Collider 정보와 이동 경로를 함께 갱신 | 이전 SetTarget 호출을 이 API로 이관 |
| `EnemyAttack.Execute(TargetableComponent, int)` | 공격 구현의 성공 여부 반환 | EnemyCloseRangeAttack은 Player 또는 Turret 대상과 양수 피해를 검사 |
| `EnemySquadTargetSelector.TrySelectNearestTarget(origin, out target)` | 가장 가까운 유효 Player/Turret 선택 | 대상이 없으면 false |

`TrySpawn`의 squadOrder는 catalog의 실제 프리셋 키를 전달합니다. 특정 문자열을 모든 Scene에서 유효하다고 가정하지 않습니다. 생성 상한과 실제 생성 수는 같지 않을 수 있습니다.

현재 Encounter는 Match Battlefield의 topology/grid를 사용해 적합한 셀과 Spawn Point를 선택합니다. 같은 셀의 지점 개수로 생성 비중이 늘어나지 않으며 근거리·원거리 분산과 실패 진단은 [스폰 공간 분산](spawn-distribution.md)을 확인하세요.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
