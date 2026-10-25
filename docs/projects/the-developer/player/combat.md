---
title: 무기·스패너·Enemy 피해
---

# 무기·스패너·Enemy 피해

**기준:** 게임 main `6b4310dc` (#549, 2026-10-24) · **원본:** `Docs/architecture/player-combat-api.md`, `player-weapon-api.md`, `player-motion-api.md`와 `Assets/Scripts/Features/Player/PlayerWeapon/`의 공개 계약.

## 탄환 초기화와 Enemy 피해

`PlayerAttack.CurrentWeapon`을 조회하고 `SelectNextWeapon()`으로 기본 총 → 냉각총 → 스패너를 순환합니다. 스패너 프리팹이 없으면 두 원거리 무기만 순환합니다. `TryFire()`는 장착 무기의 공격 시도이며 적중 보장이 아닙니다. 원거리 공격은 발사 가능 상태·간격·프리팹·같은 Player 소유 총구·조준 방향을 검사합니다. 스패너는 탄환과 총구 없이 공격합니다.

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

`EnemyHealth`는 Host/Server에서만 유효한 피해를 처리합니다. Client에서 호출하면 무시됩니다. [Enemy 피해 경계](../enemy.md)를 확인하세요.

## 스패너 공격과 일반 터렛 수리

| 공개 API | 사용 규칙 |
| --- | --- |
| `PlayerSpannerWeapon.Bind(Transform, PlayerInputHandler)` | 소유자와 조준 입력 연결 |
| `PlayerSpannerWeapon.TryAttack(Vector2)` | 방향·조작 가능 상태·공격 간격·예약 판정 검사. true는 타격 예약이며 적중 보장이 아님 |
| `PlayerSpannerRepair.CanRepair(owner, direction)` | 준비 모션을 고르는 조회이며 대상 예약이 아님 |
| `TryRepair(owner, direction)` / `TryRepair(owner, direction, out position)` | 실행 시 대상을 다시 검사하고 일반 터렛 하나에 `TurretBase.Repair(int)` 요청 |

기본 근접 설정은 반경 2·전방 100도·피해 20·간격 0.6초입니다. Attack/Repair 클립의 50% 지점에 한 번 판정하며 모션이 없으면 휘두르기 표시 시간의 절반을 사용합니다. 무기 전환·비활성화·조작 차단은 남은 판정을 취소합니다. 같은 씬의 EnemyHealth를 대상당 한 번 처리하고 거리·전방·장애물 가림을 검사합니다. 실제 피해는 기존 서버 검사를 따르며 Client 공격 RPC는 추가되지 않았습니다.

수리는 기본 반경 3·전방 100도 안의 가장 가까운 손상 일반 터렛 하나를 10 회복합니다. 잠금·파괴·자동 활성화 진행 중, 다른 씬, 벽 뒤 대상은 제외합니다. 살아 있는 활성·냉각 중 터렛은 수리할 수 있지만 임시 터렛과 CU는 이 경로의 대상이 아닙니다. 수리 준비로 시작한 타격은 적 공격을 함께 수행하지 않으며, 타격 시 조건을 벗어나면 수리하지 않습니다.

`Repair`는 실제 회복이 있을 때만 true이며 활성 상태·전력 예약·냉각을 유지합니다. 파괴 복구용 Restore와 구분하고 RuntimeState 체력을 직접 바꾸지 않습니다. 전력·재화 소비나 서버 수리 RPC를 추가한 계약은 아닙니다. [터렛 부분 수리](../turret/api-reference.md#부분-수리-api)

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

몸체가 무기를 포함하면 별도 총·스패너 SpriteRenderer를 숨기되 총구는 유지합니다. 자세별 총구는 PlayerWeaponRig, 비행·명중 표시는 PlayerProjectileView, 발사 섬광은 PlayerMuzzleFlash.Show(Color)가 담당합니다. 실제 Unity 재생·타격 타이밍·서버 피해는 별도 검증합니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
