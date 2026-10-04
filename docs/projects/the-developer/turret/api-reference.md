---
title: 터렛 API 사용법
---

# 터렛 API 사용법

기준: CBC main `b73e0e76`. 기본 네임스페이스는 `TeamHJD.Game.Turrets`, 콘텐츠 정의는 `TeamHJD.Game.Content`, 전력 계약은 `TeamHJD.Game.Turrets.Contracts`입니다.

## 상태 변경은 TurretBase를 통해

| API | 반환 / 사용 규칙 |
| --- | --- |
| `RequestActivation(bool shouldActivate)` | `TurretActivationResult`. 전력 예약·해제까지 내부 처리 |
| `SetLocked(bool isLocked)` | bool. 변경 여부; 잠금과 활성 상태를 구분 |
| `ApplyDamage(int damage)` | bool. 실제 체력 변경 여부; 양수가 아닌 피해나 이미 파괴된 대상은 실패 |
| `Restore()` | bool. 파괴 상태 복구 및 최대 체력 회복; 자동 재활성화는 아님 |
| `SetDamageBonus(int damageBonus)` | void. 보너스 값을 지정 |
| `AddDamageBonus(int damageBonus)` | void. 보너스 값을 더함 |
| `ApplyUpgrade(TurretUpgradeDefinition upgrade)` | `TurretUpgradeResult`. 정의·분기·레벨·전력 조건을 검사 |
| `DowngradeUpgrade(TurretUpgradeDefinition upgrade)` | `TurretUpgradeResult`. 성공 결과는 `Downgraded` |
| `RequestLevelUpgrade(TurretBase nextLevelPrefab, out TurretBase upgradedTurret)` | `TurretLevelUpgradeResult`. 다음 레벨 프리팹으로 교체 |
| `RequestLevelDowngrade(TurretBase previousLevelPrefab, out TurretBase downgradedTurret)` | `TurretLevelUpgradeResult`. 이전 레벨 프리팹으로 교체 |

`RuntimeState`를 직접 바꾸면 컴포넌트의 전력·이벤트 처리와 어긋날 수 있습니다. 외부 변경은 위 API로 요청하세요. 업그레이드 성공 여부도 enum으로 확인하고, 프리팹 교체 성공 뒤에는 반환된 컴포넌트나 ID 재조회 결과를 사용합니다.

## 활성화 결과

| 결과 | 의미 |
| --- | --- |
| `Activated` / `Deactivated` | 요청대로 상태가 변경됨 |
| `Unchanged` | 요청한 활성 상태와 이미 같음 |
| `Destroyed` / `Locked` | 켜려는 터렛이 파괴·잠금 상태 |
| `InsufficientPower` | 전력 예약에 실패 |
| `PowerSourceUnavailable` | 전력 공급자가 없거나 초기화되지 않음 |
| `InvalidPowerCost` | 전력 비용이 유효하지 않음 |

켜짐(`IsActivated`)과 공격 가능(`IsOperational`)은 다릅니다. 잠금·파괴·일시 중지까지 반영한 판단에는 `IsOperational`을 사용하세요.

## 피해와 복구 예제

```csharp
using TeamHJD.Game.Turrets;

public static bool HitTurret(int id, int damage)
{
    return TurretInstanceRegistry.TryGet(id, out var turret)
        && turret.ApplyDamage(damage);
}
```

위 메서드는 호출 측 클래스 안에 넣습니다. 체력이 0이 되면 터렛은 비활성화·파괴 처리됩니다. `Restore()` 성공 뒤에도 켜려면 별도로 `RequestActivation(true)`을 요청하고 전력 결과를 확인합니다.

## 전력 공급 계약

`ITurretPowerSource`는 `CurrentPower`, `MaximumPower`, `PowerChanged`와 아래 메서드를 제공합니다.

- `TryConsumePower(int power)` → bool
- `TryChangeReservation(int previousPower, int newPower)` → bool
- `ReleasePower(int power)` → void

이는 공급자 구현을 위한 계약입니다. 일반 버튼·AI는 `RequestActivation`을 사용하고 전력을 별도로 소비하지 않습니다. 콘텐츠 업그레이드에 따른 예약 비용 변경 역시 터렛의 업그레이드 API에 맡깁니다.

다음: [스냅샷과 상태 동기화](snapshots.md) · [검증과 제한 사항](testing.md)
