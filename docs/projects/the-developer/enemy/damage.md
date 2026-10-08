---
title: 서버 피해와 네트워크
---

# 서버 피해와 네트워크

**기준:** main `eb35ceb1` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

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

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
