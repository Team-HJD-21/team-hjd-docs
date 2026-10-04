---
title: Player — 입력·전투·피해
sidebar_position: 3
---

# Player 연동 가이드

**기준:** main `b73e0e76` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

별도 Player 전용 Markdown이 없어 현재 구현을 참고해 작성했습니다. Player V2의 Manager 기반 런타임과 Core adapter를 구분합니다.

## 프리팹 구성과 입력

Player V2는 `PlayerInputHandler`, `PlayerMovement`, `PlayerVisual`, `PlayerAttack`, `PlayerInfo`와 스킬 컴포넌트를 조합합니다. 입력 소비자가 매번 별도 키 입력을 수집하기보다 InputHandler의 값을 읽도록 구성합니다.

| `PlayerInputHandler` 속성 | 현재 입력 | 의미 |
| --- | --- | --- |
| `MoveInput` | WASD / 방향키 | 정규화한 이동 방향 |
| `AimDirection` | 마우스 | 월드 XY 평면을 기준으로 한 조준 방향 |
| `MouseWorldPosition` | 마우스 | 조준 평면과 Ray의 교점 |
| `IsAttackPressed` | Space | 누르고 있는 동안 사격 입력 |
| `WasBombPressed` | E | 해당 프레임 폭탄 입력 |
| `WasSkillQPressed` | Q | 해당 프레임 임시 터렛 입력 |
| `WasWeaponSwitchPressed` | Tab | 해당 프레임 무기 전환 입력 |

현재 Q/Tab은 `Input.GetKeyDown`, 나머지는 `GameInput`을 사용합니다. 새 Input System만으로 모두 통합된 것으로 설명하지 않습니다. MainCamera 태그·활성 카메라와 Rigidbody2D를 확인하세요.

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

`EnemyHealth`는 Host/Server에서만 유효한 피해를 처리합니다. Client에서 호출하면 무시됩니다. [Enemy 피해 경계](enemy.md)를 확인하세요.

## 체력과 UI

| API / 값 | 현재 의미 | 제한 |
| --- | --- | --- |
| `PlayerInfo.TakeDamage(int)` | 현재 HP 감소와 사망 흐름 진입 | 기존 GeneralManager 경로 사용 |
| `RecoverHp()` | 회복 coroutine 시작 | 중복 호출 제어는 소비자가 검토 |
| `onHpChange` | 현재 HP·최대 HP UI 전달 | FixedUpdate에서도 발행되므로 변경 시 한 번인 이벤트가 아님 |
| `onDeath` | 선언된 UnityEvent | 현재 `Die()`에서 Invoke되지 않음; 이 이벤트만 구독해 사망 표시하지 말 것 |

`curHp`, `maxHp`가 public이라고 새 모듈에서 직접 바꾸는 계약으로 삼지 마세요. `PlayerInfo`를 새 Match PlayerState와 자동 동기화하는 계약은 현재 미완성입니다.

## 임시 터렛 스킬

`PlayerTurretSkill`의 조회 값은 `CurrentCooldownTimer`, `SkillCooldown`, `IsCooldown`입니다. 소환 메서드는 private이므로 외부에서 public `DeployTurret()`을 호출하는 예제를 만들지 않습니다.

Prefab에 `TemporaryTurret`을 구성하고 Q 입력으로 검증합니다. 현재 Manager가 있으면 대화·일시정지·비웨이브 상태에서 차단하지만, Manager가 없으면 허용하는 폴백이 있습니다.

이 스킬은 [전력 기반 TurretBase](turret/index.md)의 일반 건설 API가 아닙니다. 정식 건설 기능·최종 스킬 밸런스로 혼동하지 마세요.

[Core 명령과의 차이](core.md) · [통합 체크리스트](integration.md)
