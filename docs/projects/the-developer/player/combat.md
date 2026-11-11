---
title: 무기·스패너·Enemy 피해
---

# 무기·스패너·Enemy 피해

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 탄환 초기화와 Enemy 피해

장착 선택은 `PlayerWeaponSelection.CurrentWeapon`과 `TrySelectWeaponSlot`/`TrySelectWeapon`/`SelectAdjacentWeapon`/`SelectNextWeapon`이 소유합니다. 숫자 슬롯은 1 스패너·2 기본총·3 냉각총·4 스나이퍼이며 없는 장비는 선택하지 않습니다. `PlayerAttack`은 선택한 장비로 공격을 수행합니다. `TryFire()`는 장착 무기의 공격 시도이며 적중 보장이 아닙니다. 원거리 공격은 발사 가능 상태·간격·프리팹·같은 Player 소유 총구·조준 방향을 검사합니다. 스패너는 탄환과 총구 없이 공격합니다.

```csharp
using UnityEngine;

// bullet은 프리팹으로 생성해 전달받은 PlayerBullet입니다.
bool ConfigureShot(PlayerBullet bullet, Vector2 direction)
{
    return bullet.Initialize(Color.white, 13f, direction);
}
```

`PlayerBullet.Initialize(color, damage, worldDirection)`은 성공 여부를 bool로 반환합니다. Rigidbody2D와 Collider가 있어야 하며 방향을 정규화하고 프리팹 속도만 적용합니다. 0 또는 비정상 방향, 음수·비정상 속도나 피해, 잘못된 수명, Collider 누락이면 실패하므로 호출 측이 인스턴스를 정리해야 합니다. 예시 피해량은 API 모양을 보여주는 값이지 밸런스 보증이 아닙니다.

이동 중인 Player의 속도는 탄환에 전달되지 않습니다. 탄환은 정지·전진·후진·횡이동 모두 같은 설정 속도를 사용합니다. 기존 `InitBullet(WeaponType, Color, float, Vector2, Vector2)`는 제거됐습니다. 기본 총과 냉각총은 각각 설정된 산탄 수와 각도를 사용하며 코드 기본값은 모두 5발·25도입니다. 씬의 실제 직렬화된 설정을 우선하고 최종 밸런스로 해석하지 않습니다. `Initialize(Color, float, Vector2, bool cryogenic)` 오버로드는 Warm/Cryo 비행 표시를 추가하며 기존 3인자 오버로드도 유지합니다. 표시 연결은 별도 피해 권한·서버 RPC를 추가하지 않습니다.

현재 충돌 흐름:

1. 탄환 Collider는 Trigger로 처리되어 Rigidbody 충격량을 전달하지 않습니다.
2. 첫 유효 충돌에서 피해 적용과 탄환 제거를 한 번만 수행해 중복 콜백 피해를 막습니다.
3. Player/Bullet은 통과하고 적은 피해 후 제거합니다. 다른 장애물과 충돌하면 피해 대상이 아니어도 탄환을 제거합니다.
4. Enemy 피해는 Host/Server 권한을 따릅니다. Cryo 감속은 현재 Monster의 별도 `MonsterSlowDebuff` 경로이며 Enemy에 자동 적용되지 않습니다.

이 내용은 현재 공개 탄환 API와 충돌 동작입니다. 실제 Initial Stage에서의 고속 탄환 통과 여부와 무기 외형은 별도 Unity 실행 검증으로 확인해야 합니다.

main `d0922f0b`에서 `EnemyHealth` 자체 서버 검사는 제거됐습니다. 네트워크 피해 호출 측에서 서버·Spawn 상태를 확인해야 합니다. [Enemy 피해 경계](../enemy.md)를 확인하세요.

## 스패너 공격과 일반 터렛 수리

`PlayerSpannerWeapon.TryAttack(Vector2)`는 근접 타격을 예약합니다. 현재 Player 프리팹의 일반 필드 터렛 수리·복구는 `PlayerTurretRepair`가 처리합니다. 발 위치에서 반경 3 안의 가까운 손상·파괴 터렛에 R을 유지합니다. 살아 있는 터렛은 최대 체력의 10%/게임초를 `Repair(rate, deltaTime)`로 회복하고, 파괴 터렛은 별도 진행률을 채운 뒤 `Restore()`를 호출합니다. 이동·거리 이탈·조작 차단으로 중단되면 키를 놓고 다시 누릅니다. 기존 구성은 `PlayerSpannerRepair` API를 사용할 수 있습니다.

## 탄창과 재장전

수리 대상이 있으면 R은 수리를 우선합니다. 없으면 장착 총기를 재장전합니다. 기본총·냉각총은 15발, 스나이퍼는 5발이며 마지막 발을 성공적으로 발사하면 자동 재장전합니다. 기본 재장전은 1.5게임초입니다. 총기별 잔탄은 무기 변경 뒤에도 유지하며 필드 정지 중에는 재장전 시간이 흐르지 않습니다. `/weapon` v2 체크포인트는 잔탄과 재장전 진행을 보관합니다. v1은 가득 찬 탄창에서 시작합니다.


## 8방향 표시와 모션 API

몸체·총구 외형은 연결된 클립에 따라 8방향을 사용하고 실제 탄환은 연속 마우스 조준 벡터로 발사합니다. 표시 방향을 탄환 방향의 양자화 규칙으로 쓰지 않습니다. 표시 모션은 물리 루트·Collider를 이동시키지 않습니다.

| 공개 API | 책임 |
| --- | --- |
| `PlayerMotionSet.GetClip(PlayerMotion)` | 정지 모션 조회 |
| `GetClip(motion, bool hovering, PlayerLateralLean lean)` | 부유 행동과 Neutral / Left / Right / Back 자세 선택 |
| `Clip.Animation(PlayerAimFacing)` | 해당 방향의 AnimationClip 조회 |
| `HasEightWayRanged`, `HasEightWayTools`, `HasAnimatorConfiguration` | 방향별 클립과 Controller 구성 여부 조회 |
| `PlayerSpriteMotion.OwnsDisplay` | 표시 소유 여부. true일 때 PlayerVisual의 별도 Sprite 반전과 중복 제어하지 않음 |
| `PlayRangedShot()` / `PlayToolAction(bool repairing)` | 사격 또는 공구 행동 시작 |
| `ToolImpactDelay(bool repairing)` | 연결된 클립 길이로 타격 지연 계산 |
| `PauseAtImpact(float seconds)` | 해당 Player Animator만 일시 정지. 전체 게임·물리를 멈추지 않음 |

8방향은 필요한 클립이 구성된 경우에 사용합니다. 이동 시작·정지와 방향 전환 중에는 행동 진행률을 유지하고 공격·타격 예약을 다시 시작하지 않습니다. Sprite 키·반복·재생 길이는 AnimationClip이 소유하며 이전 Frames / Sample 조회는 사용하지 않습니다.

현재 몸체와 무기는 분리 Sprite입니다. PlayerWeaponAppearance.TryGetFrame이 몸체 프레임별 무기·좌표를 조회하고 PlayerWeaponVisual이 Animator 이후 LateUpdate에 표시합니다. TryGetMuzzlePosition은 외형의 총구를 제공하며 PlayerWeaponRig가 없을 때의 기존 자세별 총구를 보완합니다. 총구 섬광·비행/명중 표시와 실제 피해 판정을 구분합니다. 실제 Unity 재생·타격 타이밍·서버 피해는 별도 검증합니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
