---
title: Enemy 스폰 API 사용법
---

# Enemy 스폰 API 사용법

**기준:** main `eb35ceb1` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## API

| API | 의미 | 실패 조건 / 주의 |
| --- | --- | --- |
| `EnemySpawnExecutor.CanSpawn` | `IsSpawned && IsServer` | 일반 Client는 false |
| `Execute(SpawnInstruction)` | 지점별 계획을 실행, 실제 생성 수 반환 | catalog·지점·Prefab 누락, 지점 비활성 등 검사 |
| `SpawnedEnemyCount` | Executor의 추적 목록 수 | 계획상의 생성 수와 구분 |
| `CaptureEnemyPositions()` | 스폰된 적의 순수 공간 입력 | despawn된 객체는 입력에서 제외 |
| `EncounterRuntime.TrySpawn(snapshot, squadOrder, maxEnemyCount, out result)` | 요청한 분대 계획·실행 | false와 result 메시지를 함께 확인 |
| `EnemyHealth.TakeDamage(int)` | 서버 피해·사망·Despawn | Server + Spawned + 살아 있음 + 양수 피해 필요 |
| `EnemySquadTargetSelector.TrySelectNearestTarget(origin, out target)` | 가장 가까운 유효 Player/Turret 선택 | 대상이 없으면 false |

`TrySpawn`의 squadOrder는 catalog의 실제 프리셋 키를 전달합니다. 특정 문자열을 모든 Scene에서 유효하다고 가정하지 않습니다. 생성 상한과 실제 생성 수는 같지 않을 수 있습니다.

현재 Encounter는 Match Battlefield의 topology/grid를 사용해 적합한 셀과 Spawn Point를 선택합니다. 같은 셀의 지점 개수로 생성 비중이 늘어나지 않으며 근거리·원거리 분산과 실패 진단은 [스폰 공간 분산](spawn-distribution.md)을 확인하세요.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
