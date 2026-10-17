---
title: 탄환과 Enemy 피해
---

# 탄환과 Enemy 피해

**기준:** 게임 main `20ca65d1` (#529) · **원본:** `Docs/architecture/player-combat-api.md`, `Assets/Scripts/Features/Player/PlayerWeapon/`.

## 탄환 초기화와 Enemy 피해

`PlayerAttack.TryFire()`가 발사 가능 상태, 발사 간격, 프리팹, 같은 Player 소유 총구와 조준 방향을 확인한 뒤 탄환을 만듭니다. 무기 종류는 발사 측에서 피해·색상·간격을 선택합니다.

```csharp
using UnityEngine;

// bullet은 프리팹으로 생성해 전달받은 PlayerBullet입니다.
bool ConfigureShot(PlayerBullet bullet, Vector2 direction)
{
    return bullet.Initialize(Color.white, 13f, direction);
}
```

`PlayerBullet.Initialize(color, damage, worldDirection)`은 성공 여부를 bool로 반환합니다. Rigidbody2D와 Collider가 있어야 하며 방향을 정규화하고 프리팹 속도만 적용합니다. 0 또는 비정상 방향, 음수·비정상 속도나 피해, 잘못된 수명, Collider 누락이면 실패하므로 호출 측이 인스턴스를 정리해야 합니다. 예시 피해량은 API 모양을 보여주는 값이지 밸런스 보증이 아닙니다.

이동 중인 Player의 속도는 탄환에 전달되지 않습니다. 탄환은 정지·전진·후진·횡이동 모두 같은 설정 속도를 사용합니다. 기존 `InitBullet(WeaponType, Color, float, Vector2, Vector2)`는 제거됐습니다. 기본 산탄 수와 발사 각도는 발사 설정을 따릅니다.

현재 충돌 흐름:

1. 탄환 Collider는 Trigger로 처리되어 Rigidbody 충격량을 전달하지 않습니다.
2. 첫 유효 충돌에서 피해 적용과 탄환 제거를 한 번만 수행해 중복 콜백 피해를 막습니다.
3. Player/Bullet은 통과하고 적은 피해 후 제거합니다. 다른 장애물과 충돌하면 피해 대상이 아니어도 탄환을 제거합니다.
4. Enemy 피해는 Host/Server 권한을 따릅니다. Cryo 감속은 현재 Monster의 별도 `MonsterSlowDebuff` 경로이며 Enemy에 자동 적용되지 않습니다.

이 내용은 현재 공개 탄환 API와 충돌 동작입니다. 실제 Initial Stage에서의 고속 탄환 통과 여부와 무기 외형은 별도 Unity 실행 검증으로 확인해야 합니다.

`EnemyHealth`는 Host/Server에서만 유효한 피해를 처리합니다. Client에서 호출하면 무시됩니다. [Enemy 피해 경계](../enemy.md)를 확인하세요.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
