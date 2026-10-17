---
title: Initial Stage UI 연동
---

# Initial Stage UI 연동

**기준:** 게임 main `7f22b9ca` (#530) · **원본:** `Docs/architecture/player-ui-api.md`, 공개 Player·Turret·Core API.

이 문서는 상태 표시와 터렛 조작을 연결할 때 사용할 API 계약과 제한을 정리합니다. 프리팹 계층·배치·스타일 등 화면 제작 세부 사항은 다루지 않습니다. 원본도 최종 Unity PlayMode 외형·조작 검증은 별도라고 기록합니다.

## 상태 데이터

| 표시 | 데이터 원본 | 연결 규칙 |
| --- | --- | --- |
| Player 체력 | `PlayerInfo.curHp`, `maxHp`, `onHpChange` | 현재 값으로 초기화하고 UnityEvent를 구독합니다. `onHpChange`는 FixedUpdate에서도 발생할 수 있어 값 변경 1회에 대응하는 이벤트로 가정하지 않습니다. |
| CU 체력 | `ControlUnitHealth.CurrentHealth`, `MaxHealth`, `HealthChanged` | 현재 값을 즉시 읽고 `HealthChanged`를 구독합니다. |
| CU 전력 | `TurretController.Budget`의 `CurrentPower`, `MaximumPower`, `PendingRecovery` | 전력 예약·반환은 기존 API가 소유합니다. UI에서 예산을 직접 수정하지 않습니다. |

초기 값이나 대상 오브젝트가 아직 준비되지 않았으면 대기 상태를 표시하고 다시 찾습니다. 다중 플레이어에서는 HUD가 로컬 플레이어의 `PlayerInfo`에 연결되도록 구성해야 합니다. 현재 연결은 플레이어 UI에 새로운 Match 동기화 계약을 추가하지 않습니다.

## 터렛 선택과 명령

- 터렛은 현재 씬의 등록 ID로 선택하고, 교체 후에도 같은 ID로 새 컴포넌트를 다시 조회합니다.
- 활성화 요청은 `TurretController.RequestActivation(instanceId, shouldActivate)`로 전달하고 `TurretActivationResult`를 처리합니다. UI가 전력을 미리 소비하거나 직접 상태를 바꾸지 않습니다.
- 승급·강등은 `RequestLevelUpgrade` / `RequestLevelDowngrade`, 세부 강화는 `ApplyUpgrade` / `DowngradeUpgrade`의 결과를 표시합니다.
- Core 지역이 연결된 HUD는 `TurretController.Regions`에서 확정된 지역 정책과 점령 셀을 읽습니다. 동적 정책은 지역 잠금 대신 활성 터렛의 점유 상태를 안내합니다.
- 살아 있는 조작 가능 Player가 CU 상호작용 거리 안에 있을 때 `TryStartAutoActivation()`을 호출할 수 있습니다. 이는 후보·전력 재배분을 Turret Controller에 요청하는 API이며 HUD가 직접 활성 상태를 바꾸지 않습니다.
- 선택 가능 거리와 Player 입력 허용 여부는 UI 정책입니다. Initial Stage HUD 기본 상호작용 거리는 10 Unity 단위이며, 게임 입력이 차단되거나 일시정지·사망 중일 때는 수동 요청을 막습니다.

## 냉각·자동 활성화·강화 제한

| 조회 | 사용 |
| --- | --- |
| `IsCoolingDown`, `CoolingDownRemaining` | 과열 회복과 수동 OFF 뒤 냉각을 함께 표시합니다. 남은 시간은 표시 주기에 다시 읽습니다. |
| `IsManualOperationBlocked` | 자동 활성화가 진행되는 동안 수동 변경 버튼을 차단합니다. |
| `CanModifyUpgrades` | 세부 강화와 레벨 변경을 공통으로 허용할지 결정합니다. 활성화·냉각·잠금·파괴·자동 활성화 중에는 false입니다. |

과열 중에도 `IsActivated`와 예약 전력은 유지되고 `IsOperational`은 false입니다. 켜진 터렛의 OFF는 냉각 중에도 허용되지만, 자동 활성화 중에는 수동 OFF도 막힙니다. 꺼진 터렛은 냉각 완료 전 ON 요청이 `CoolingDown`으로 거부됩니다. 냉각 시간은 게임 시간 기준입니다.

업그레이드와 레벨 변경은 비활성·냉각 완료 상태에서만 가능합니다. 변경 후 새 요구 전력은 다음 ON에서 예약됩니다. 한 세부 강화 분기를 0~5단계로 조정하고, 0단계일 때만 다른 분기를 선택할 수 있습니다. 허용 여부를 버튼에 반영하되 요청 시 API 결과도 다시 확인합니다.

`SnapshotChanged`는 객체 값 변경 알림에 사용하고, 이동 거리와 냉각 남은 시간처럼 시간·위치에 따라 달라지는 값은 별도로 갱신합니다. 스냅샷 이벤트만으로 냉각 종료나 이동을 감지한다고 가정하지 마세요.

다음: [Player 체력·UI](health.md) · [터렛 API](../turret/api-reference.md) · [통합 체크리스트](../integration.md)
