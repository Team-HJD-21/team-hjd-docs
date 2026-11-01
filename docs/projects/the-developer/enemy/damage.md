---
title: 서버 피해와 네트워크
---

# 서버 피해와 네트워크

**기준:** main `d0922f0bf86e0348bed1acbfd5ae6231a1202f63` (2026-11-01) · **원본:** `Assets/Scripts/Features/Enemy/Monster/EnemyHealth.cs`, `Networking/EnemyNetworkController.cs`, `Spawning/EnemySpawnExecutor.cs`, `Monster/EnemyCloseRangeAttack.cs`.

## 체력과 네트워크 수명

`EnemyHealth`는 이제 일반 MonoBehaviour입니다. `Initialize()`가 최대 체력과 피해 수신 상태를 초기화하고, `Deactivate()`는 이후 피해를 막습니다. 활성·생존 상태에서 양수 `TakeDamage(int)`만 적용하며 체력이 0이 되면 `Died(EnemyHealth)`를 한 번 발행합니다. 자체 `IsServer`·`IsSpawned`·RPC·Despawn 기능은 없습니다.

네트워크 경로의 `EnemyNetworkController`가 서버 `OnNetworkSpawn`에서 체력을 초기화하고 Died를 구독합니다. 서버의 사망 처리에서 `DeathConfirmed(ulong)`를 통지한 뒤 아직 Spawn 상태라면 Despawn합니다. `OnNetworkDespawn`은 구독을 해제하고 체력을 비활성화한 후 `Despawned(ulong)`를 통지합니다. Executor는 네트워크 드라이버의 이벤트로 사망 및 추적 목록을 관리합니다.

```csharp
// 호출자가 네트워크 권한과 Spawn 상태를 확인하는 사용 예입니다.
void ApplyServerHit(EnemyNetworkController driver, EnemyHealth health, int damage)
{
    if (driver != null && driver.IsServer && driver.IsSpawned && health != null)
        health.TakeDamage(damage);
}
```

체력 값은 자동 복제되지 않습니다. TakeDamage를 Client에서 직접 호출해도 메서드 자체가 권한을 검사하지 않으므로, 피해 호출 경계에서 서버 권한을 보장해야 합니다. Client의 직접 호출이 서버 RPC가 되거나 서버의 체력을 바꾼다고 해석하지 마세요.

## Enemy가 대상에 주는 피해

`EnemyCombat.TryAttack()`은 쿨타임·유효 타깃과 `EnemyAttack.Execute` 성공을 확인합니다. `EnemyCloseRangeAttack`은 Turret에 `TargetableComponent.TryApplyDamage(int)`를 호출하고, Player에는 부모의 `PlayerInfo.TakeDamage(int)`를 호출합니다. 타깃을 찾지 못하거나 피해가 양수가 아니면 실패합니다. CU의 `ControlUnitHealth`가 제공하는 HealthChanged·Destroyed와 게임 종료 연결은 별도로 확인합니다.

이 문서는 main 공개 계약의 정적 대조입니다. Unity 컴파일·실제 Host/Client 전투 검증을 수행한 기록은 아닙니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)