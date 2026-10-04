---
title: 탄환과 Enemy 피해
---

# 탄환과 Enemy 피해

**기준:** main `b73e0e76` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 탄환 초기화와 Enemy 피해

`PlayerBullet.InitBullet(WeaponType weaponType, Color bulletColor, float damage, Vector2 dir, Vector2 playerSpeed)`로 생성한 탄환에 속성을 주입합니다.

```csharp
using UnityEngine;

// bullet은 프리팹으로 생성해 전달받은 PlayerBullet입니다.
void ConfigureShot(PlayerBullet bullet, Vector2 direction, Vector2 velocity)
{
    bullet.InitBullet(WeaponType.DefaultShotgun,
        Color.white, 13f, direction, velocity);
}
```

예시 피해량은 API 호출 형태를 보여주는 값이지 확정 밸런스가 아닙니다.

현재 충돌 흐름:

1. `Enemy` 태그를 대상 또는 루트에서 확인합니다.
2. 부모의 `EnemyHealth`가 있으면 `TakeDamage(int)`를 우선 호출합니다.
3. `EnemyHealth`가 없을 때만 기존 `Monster.TakeDamage(float)`로 피해를 보냅니다.
4. Cryo 감속은 현재 `Monster`에 붙는 `MonsterSlowDebuff` 경로입니다. Enemy PoC에도 감속이 자동 적용된다고 가정하지 않습니다.

`EnemyHealth`는 Host/Server에서만 유효한 피해를 처리합니다. Client에서 호출하면 무시됩니다. [Enemy 피해 경계](../enemy.md)를 확인하세요.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
