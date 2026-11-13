---
title: Initial Stage UI 연동
---

# Initial Stage UI 연동

**기준:** 게임 main `9cf0e16b5924b6facfc35646184672c1d51e7b1a` (#570, 2026-11-02) · **원본:** `Docs/architecture/player-ui-api.md`, 공개 Player·Turret·Core API.

이 문서는 상태 표시와 터렛 조작을 연결할 때 사용할 API 계약과 제한을 정리합니다. 프리팹 계층·배치·스타일 등 화면 제작 세부 사항은 다루지 않습니다. 원본도 최종 Unity PlayMode 외형·조작 검증은 별도라고 기록합니다.

## 상태 데이터

| 표시 | 데이터 원본 | 연결 규칙 |
| --- | --- | --- |
| Player 체력 | `PlayerInfo.curHp`, `maxHp`, `onHpChange` | 현재 값으로 초기화하고 UnityEvent를 구독합니다. `onHpChange`는 FixedUpdate에서도 발생할 수 있어 값 변경 1회에 대응하는 이벤트로 가정하지 않습니다. |
| CU 체력 | `ControlUnitHealth.CurrentHealth`, `MaxHealth`, `HealthChanged` | 현재 값을 즉시 읽고 `HealthChanged`를 구독합니다. |
| CU 전력 | `FieldTurretController.Budget`의 `CurrentPower`, `MaximumPower`, `PendingRecovery` | 전력 예약·반환은 기존 API가 소유합니다. UI에서 예산을 직접 수정하지 않습니다. |

초기 값이나 대상 오브젝트가 아직 준비되지 않았으면 대기 상태를 표시하고 다시 찾습니다. 다중 플레이어에서는 HUD가 로컬 플레이어의 `PlayerInfo`에 연결되도록 구성해야 합니다. 정식 Scene은 아래 actor 주입·명령/표시 Port를 사용합니다. Client의 초기 로컬 FieldTurret 값을 서버 확정 상태로 사용하지 않습니다.

## 독립 Feature Scene의 로컬 터렛 선택과 명령

- 터렛은 현재 씬의 등록 ID로 선택하고, 교체 후에도 같은 ID로 새 컴포넌트를 다시 조회합니다.
- 활성화 요청은 `FieldTurretController.RequestActivation(instanceId, shouldActivate)`로 전달하고 `FieldTurretActivationResult`를 처리합니다. UI가 전력을 미리 소비하거나 직접 상태를 바꾸지 않습니다.
- 승급·강등은 `RequestLevelUpgrade` / `RequestLevelDowngrade`, 세부 강화는 `ApplyUpgrade` / `DowngradeUpgrade`의 결과를 표시합니다.
- Core 지역이 연결된 HUD는 `FieldTurretController.Regions`에서 확정된 지역 정책과 점령 셀을 읽습니다. 동적 정책은 지역 잠금 대신 활성 터렛의 점유 상태를 안내합니다.
- 살아 있는 조작 가능 Player가 CU 상호작용 거리 안에 있을 때 `TryStartAutoActivation()`을 호출할 수 있습니다. 이는 후보·전력 재배분을 Turret Controller에 요청하는 API이며 HUD가 직접 활성 상태를 바꾸지 않습니다.
- 선택과 조작 가능 거리를 구분합니다. 같은 씬의 활성·등록 터렛은 멀리서도 선택할 수 있고 수동 요청은 Player가 기본 상호작용 거리 10 안에 있어야 합니다. 입력 차단·일시정지·사망 중에도 수동 요청을 막습니다.

## 원거리 선택과 근접 조작

`StageTurretSelection.CanSelect(turret)`는 같은 씬의 활성·등록 상태를 검사하고 거리 제한을 두지 않습니다. `CanInteractWith(turret)`는 여기에 활성 Player와 터렛 중심 사이의 XY 거리를 검사하며 정렬 Z를 제외합니다.

거리 밖에서도 선택·창·사거리를 유지하고 피드백에 `Move closer to control this turret.`를 표시합니다. 기존 요청 결과·현재 상태·냉각 안내는 유지하며 활성화·OFF·레벨·강화 버튼을 비활성화합니다. 접근하면 재클릭 없이 거리 안내가 사라지고 기존 API 조건에 따라 버튼을 활성화합니다. 다시 멀어져도 창을 닫지 않고 조작만 차단합니다. 빈 공간·Escape·Close는 선택을 해제합니다.

Presenter는 요청 직전에도 거리와 조작 허용 조건을 검사합니다. 임시 터렛 미리보기 중 일반 터렛 선택을 막아 같은 클릭이 중복 처리되지 않게 합니다. 씬 스킬 HUD의 로컬 Player 연결은 [스킬·HUD 안내](skills.md)를 따릅니다.

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

## 정식 Scene의 actor·요청·표시 주입

**출처:** main `9cf0e16b`의 `Docs/architecture/player-ui-api.md`, Core 공개 Port와 StageTurretCommandBinding.

1. ILocalPlayerActorConsumer.PrepareLocalActor(matchId, playerId)로 대기 상태를 만들고, 같은 PlayerId의 PlayerActorIdentity·PlayerInfo를 가진 실제 로컬 actor를 BindLocalActor로 주입합니다. UnbindLocalActor는 같은 Match만 해제합니다. UI는 actor를 생성·파괴하지 않으며 대기 중 다른 Player를 대신 찾지 않습니다.
2. BindTurretCommands(matchId, playerId, requester, presentation)로 요청과 Host 확정 표시 source를 주입합니다. 같은 Port의 재주입은 구독·대기 요청을 유지하며 다른 Port 교체는 명시 해제 뒤 수행합니다. 정식 Port가 없으면 로컬 FieldTurret 쓰기로 우회하지 않습니다.
3. StageTurretPresenter는 TurretPresentationFrame의 논리 ID·정의·활성·강화·냉각 상태를 읽고 요청 의도를 만듭니다. StageTurretCommandBinding은 GUID로 요청한 뒤 해당 대상의 추가 입력을 잠급니다. 서버 결과와 그 확정 순번을 반영한 표시 Frame을 모두 받아야 해제합니다. ExecutionFailed도 부작용 가능성이 있어 최신 상태를 기다리고 거부는 즉시 표시합니다.
4. HUD 비활성·재활성은 actor 주입과 대기 추적을 보존합니다. Match 해제·실제 파괴는 요청/표시 구독을 정리하며 다른 Match의 결과·해제를 적용하지 않습니다.

CU 점령 수치는 표시 Frame의 모드·RegionGridId·RegionRevision이 현재 지역 Snapshot과 일치할 때만 결합합니다. 채널 도착 순서가 다르면 대기 안내를 표시하고 이전 지역 수치와 새 HUD 상태를 섞지 않습니다. Client는 오래된 로컬 터렛 사거리 원을 확정 표시로 사용하지 않습니다.

PlayerControlState는 IPlayerInteractionActor로 XY·생존·CanAct를 제공합니다. 서버 actor 소유자가 RegisterAuthorityPlayerActor의 lease를 실제 actor 수명에 연결해야 하며 Client의 위치 주장을 주입하면 안 됩니다. 현재 자기 로컬 actor 생성과 Core 명령·표시 전송을 원격 Player 이동/공격·FieldTurret 전투 복제 완성으로 해석하지 않습니다. 원본의 자동 버튼/UTP·두 프로세스 검사 보고와 PL의 실제 마우스·해상도별 시각 인수는 별도이며, 이번 문서 작업은 실행 시험을 재수행하지 않았습니다.

## 플레이어 상태창과 성장

I 상태창은 `PlayerAttack.TryGetCurrentWeaponStats(out PlayerWeaponStats)`와 `PlayerWeaponAmmo.GetReloadDuration(weapon)`에서 실제 무기 수치를 읽습니다. 피해는 탄환 한 발 또는 근접 타격 한 번 기준입니다. 장착 무기 선택은 기존 `PlayerWeaponSelection`을 사용합니다.

보상 지급은 `PlayerExperience.AddExperience(int)`를 사용합니다. 0 이하·최대 레벨·권한 없는 Client의 요청은 거부됩니다. HUD는 `Level`, `TotalExperience`, `Progress`를 읽고 `Changed`에서 새로 표시합니다. `LevelChanged(previous, current)`는 지급으로 레벨이 달라졌을 때 통지합니다. 복원 후에는 `Changed`로 표시를 갱신합니다.

## 전투 HUD와 장착

`CombatSkillPicker`의 반원 선택창에서 Q/E 슬롯으로 스킬을 끌어 장착합니다. `PlayerSkillController.TryEquip(slot, skill)`의 슬롯 0은 Q, 1은 E입니다. 반대 슬롯의 스킬을 가져오면 서로 교환합니다. SPACE는 고정 Dash입니다. 선택창을 닫는 동안에도 전투 입력 제한을 유지하며 ESC는 선택창이 먼저 소비합니다.

`TryUseSlot(slot)`은 허용된 Q/E 시도에서 `SlotUseAttempted(slot, skill, accepted)`를 한 번 알립니다. 미배정 슬롯과 실제 설치 확정 실패는 공통 Alert로 표시합니다. `PlayerAttack.ShotFired(WeaponType)`는 원거리 발사 성공 시 조준선 피드백에 사용하며 산탄도 한 번만 알립니다. XP 팝업은 `PlayerExperience.ExperienceGranted`를 구독합니다. 우주선 방문 중 HUD 입력과 표시를 숨기고 필드 복귀 시 같은 actor의 상태를 읽습니다.
