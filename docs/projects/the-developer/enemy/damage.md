---
title: 서버 피해와 네트워크
---

# 서버 피해와 네트워크

**기준:** main `eb35ceb1` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 피해와 네트워크 주의

Enemy가 무기 터렛과 CU를 공격할 때 `TargetableComponent.TryApplyDamage(int)`가 `IDamageableTarget.ApplyDamage(int)`로 전달합니다. CU의 `ControlUnitHealth`는 `HealthChanged`와 `Destroyed`를 발행하며 현재 PoC의 게임 오버 연결은 후속 연동 대상입니다.

```csharp
// Host/Server의 이미 Spawn된 EnemyHealth를 전달받는 예제입니다.
void ApplyServerHit(EnemyHealth health, int damage)
{
    if (health != null && health.IsServer && health.IsSpawned)
        health.TakeDamage(damage);
}
```

`CurrentHealth` 자체는 NetworkVariable이 아닙니다. 현재 체력 값이 Client에 자동 복제되거나, Client의 TakeDamage 호출이 RPC로 서버에 전달된다고 가정하지 마세요. 사망 시 Server에서 `NetworkObject.Despawn()`을 호출합니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
