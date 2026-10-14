---
title: 터렛 API 사용법
---

# 터렛 API 사용법

기준: CBC main `1277de10` (2026-10-14). 기본 네임스페이스는 `TeamHJD.Game.Turrets`, 콘텐츠 정의는 `TeamHJD.Game.Content`, 전력 계약은 `TeamHJD.Game.Turrets.Contracts`입니다.

## 상태 변경 API

| API | 반환 / 사용 규칙 |
| --- | --- |
| `RequestActivation(bool shouldActivate)` | `TurretActivationResult`. 전력 예약·해제까지 내부 처리 |
| `TurretController.RequestActivation(int instanceId, bool shouldActivate)` | 같은 컨트롤러의 등록 터렛에 활성화 요청을 전달; 없는 ID·다른 전력 공급자면 `PowerSourceUnavailable` |
| `IsCoolingDown` / `CoolingDownRemaining` | 과열 회복과 비활성화 뒤 냉각 상태 및 남은 게임 시간 조회 |
| `IsManualOperationBlocked` | 자동 활성화 도중 수동 조작 제한 조회 |
| `CanModifyUpgrades` | 세부 강화·레벨 변경의 공통 허용 조건 |
| `SetLocked(bool isLocked)` | bool. 변경 여부; 잠금과 활성 상태를 구분 |
| `ApplyDamage(int damage)` | bool. 실제 체력 변경 여부; 양수가 아닌 피해나 이미 파괴된 대상은 실패 |
| `Restore()` | bool. 파괴 상태 복구 및 최대 체력 회복; 자동 재활성화는 아님 |
| `SetDamageBonus(int damageBonus)` | void. 보너스 값을 지정 |
| `AddDamageBonus(int damageBonus)` | void. 보너스 값을 더함 |
| `TurretController.ConfigureUnlockZones(Vector2 cuPosition)` | Inspector의 전용 터렛 Grid 설정으로 셀 거리 구역을 구성하고 첫 구역만 해금 |
| `ConfigureUnlockZones(Vector2 cuPosition, int zoneCount)` | Inspector 설정과 호출 시 지정한 구역 수 사용 |
| `ConfigureUnlockZones(TurretGridConfiguration grid, Vector2 cuPosition, int zoneCount = 4)` | 코드에서 만든 전용 Grid 설정 사용 |
| `UnlockThroughZone(int zone)` | 지정 구역과 더 가까운 구역을 해금; 활성화나 전력 예약은 하지 않음 |
| `TryGetUnlockZone(TurretBase turret, out int zone)` | 컨트롤러가 관리하는 터렛의 현재 셀 거리 구역 조회 |
| `ApplyUpgrade(TurretUpgradeDefinition upgrade)` | `TurretUpgradeResult`. 비활성·냉각 완료·자동 활성화 미진행 상태 필요 |
| `DowngradeUpgrade(TurretUpgradeDefinition upgrade)` | 같은 허용 조건; 성공 결과는 `Downgraded` |
| `RequestLevelUpgrade(TurretBase nextLevelPrefab, out TurretBase upgradedTurret)` | 같은 허용 조건; 성공 결과 `Upgraded`와 교체된 컴포넌트 반환 |
| `RequestLevelDowngrade(TurretBase previousLevelPrefab, out TurretBase downgradedTurret)` | 같은 허용 조건; 성공 결과 `Downgraded`와 교체된 컴포넌트 반환 |

`RuntimeState`를 직접 바꾸면 컴포넌트의 전력·이벤트 처리와 어긋날 수 있습니다. 외부 변경은 위 API로 요청하세요. 업그레이드 성공 여부도 enum으로 확인하고, 프리팹 교체 성공 뒤에는 반환된 컴포넌트나 ID 재조회 결과를 사용합니다.

세부 강화와 레벨 변경은 터렛이 비활성 상태이고 냉각이 끝난 경우에만 성공합니다. 활성 중에는 `RequiresDeactivation`, 꺼진 냉각 중에는 `CoolingDown`, 자동 활성화 중에는 `AutoActivationInProgress` 결과를 확인하세요. 강화는 단계 0~5의 단일 분기이며, 다른 분기를 고르려면 먼저 현재 분기를 0으로 되돌려야 합니다. 요구 전력 변경은 즉시 예약하지 않고 다음 활성화 요청에서 반영됩니다.

구역은 Core의 `BattlefieldGridConfiguration`과 별개인 `TurretGridConfiguration`을 사용합니다. `TurretController` Inspector 기본값은 맵 275×275, 셀 16×16, 구역 4개입니다. `ConfigureUnlockZones(cuPosition)`은 이 설정을 사용하며, Core Grid 크기를 바꿔도 자동으로 동기화되지 않으므로 맵 설정을 맞춰야 합니다. 구역은 CU 셀에서 상하좌우 셀 거리로 계산하고 새 터렛에도 적용됩니다. Grid 밖 터렛은 잠기며 아직 열리지 않은 구역은 `SetLocked(false)`로 해제할 수 없습니다. 상세 조건은 [실행 흐름의 잠금·해금](runtime-flows.md#62-잠금과-해금)을 확인하세요.

## 활성화 결과

| 결과 | 의미 |
| --- | --- |
| `Activated` / `Deactivated` | 요청대로 상태가 변경됨 |
| `Unchanged` | 요청한 활성 상태와 이미 같음 |
| `Destroyed` / `Locked` | 켜려는 터렛이 파괴·잠금 상태 |
| `CoolingDown` | 꺼진 터렛의 냉각이 끝나기 전에 켜기 요청 |
| `InsufficientPower` | 전력 예약에 실패 |
| `PowerSourceUnavailable` | 전력 공급자가 없거나 초기화되지 않음 |
| `InvalidPowerCost` | 전력 비용이 유효하지 않음 |
| `AutoActivationInProgress` | 자동 재배분 진행 중 개별 활성화 요청이 거부됨 |

켜짐(`IsActivated`)과 공격 가능(`IsOperational`)은 다릅니다. 과열 냉각 중에는 활성·전력 예약을 유지해도 공격하지 않습니다. `IsOperational`은 과열·잠금·파괴 상태까지 반영합니다. 냉각 남은 시간은 `CoolingDownRemaining`을 다시 읽어 표시하세요.

## 피해와 복구 예제

Enemy가 CU와 무기 터렛에 공통으로 피해를 줄 때는 `IDamageableTarget`의 `CurrentHealth`, `MaxHealth`, `IsDestroyed`, `ApplyDamage(int)`를 사용합니다. `TurretBase`와 `ControlUnitHealth`가 구현하며 CU는 Registry·활성화·전력 명령에는 포함되지 않습니다.

`TurretController.TryStartAutoActivation()`은 버튼 시점의 사거리 내 적 수로 후보 순서를 고정하고 활성 터렛을 끈 뒤 전력을 재배분합니다. 전력 반환 중에는 재시도하며 수락부터 게임 시간 60초 쿨타임입니다. 상세 조건은 [실행 흐름](runtime-flows.md)의 자동 활성화를 확인하세요.

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
