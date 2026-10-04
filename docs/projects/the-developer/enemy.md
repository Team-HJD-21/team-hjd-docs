---
title: Enemy — 스폰·타깃·피해
sidebar_position: 6
---

# Enemy / Encounter 연동 가이드

**기준:** main `b73e0e76` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/TurretTargetableAdapter.cs`.

별도 Enemy 사용 문서가 없어 main 코드를 대조했습니다. 레거시 `Monster`와 새 PoC의 서버 기반 Enemy를 구분합니다.

## 빠른 시작

1. Scene에 NGO NetworkManager와 `EnemySpawnExecutor`를 준비하고 Host/Server로 실행합니다.
2. Executor의 Enemy catalog·분대 프리셋·자식 SpawnPoint를 구성합니다.
3. 스폰할 Prefab의 `NetworkObject`, `EnemyController`, `EnemyAIBrain`, `EnemyNetworkController`를 확인합니다. 피해 대상에는 `EnemyHealth`도 필요합니다.
4. Player/Turret에 유효한 `TargetableComponent`를 연결합니다.
5. Enemy 생성과 추적 목록은 Executor를 통해 관리합니다. 단순 Instantiate만으로 NGO 적 생성이 완료되지 않습니다.

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

현재 Encounter는 Match snapshot의 유효성을 확인하고 진단 정보를 출력하지만, topology/grid로 스폰 배치를 결정하는 정식 정책은 아직 적용하지 않습니다.

## 타깃 제공 계약

`ITargetable`은 `TargetTransform`, `TargetType`, `HealthRatio`, `FirepowerRatio`, `CanBeTargeted`를 제공합니다. Enemy가 다른 영역의 체력 필드를 직접 수정하는 계약이 아닙니다.

터렛에는 `TurretTargetableAdapter`가 registry snapshot을 읽어 `TargetableComponent`에 전달합니다. 등록된 터렛이 활성 상태이고, 파괴되지 않고, HP가 양수일 때 선택 대상이 됩니다. `IsOperational`과 동일한 판정이 아니므로 과열 중이라도 활성 상태이면 대상이 될 수 있습니다.

화력 비율은 현재 Inspector의 임시 `_fakeFirepowerRatio`입니다. `EffectiveDamage`를 이용한 정식 AI 위협 점수로 완성됐다고 표시하지 않습니다.

## 피해와 네트워크 주의

```csharp
// Host/Server의 이미 Spawn된 EnemyHealth를 전달받는 예제입니다.
void ApplyServerHit(EnemyHealth health, int damage)
{
    if (health != null && health.IsServer && health.IsSpawned)
        health.TakeDamage(damage);
}
```

`CurrentHealth` 자체는 NetworkVariable이 아닙니다. 현재 체력 값이 Client에 자동 복제되거나, Client의 TakeDamage 호출이 RPC로 서버에 전달된다고 가정하지 마세요. 사망 시 Server에서 `NetworkObject.Despawn()`을 호출합니다.

## 검증 체크

- Host와 Client 호출을 분리해 확인합니다.
- 분대 계획 수와 Executor 실제 생성 수를 비교합니다.
- 타깃이 파괴/비활성/제거되면 다시 유효한 대상을 선택하는지 확인합니다.
- [Player 탄환](player.md)이 EnemyHealth와 Monster 양쪽에 중복 피해를 주지 않는지 확인합니다.
- [터렛 피해](turret/api-reference.md)는 EnemyHealth와 메서드 이름·반환값이 다릅니다.

NGO PoC 코드의 존재는 출시 협동 모드 지원의 확정을 뜻하지 않습니다.
