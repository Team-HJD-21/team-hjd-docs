---
title: Player 구성과 입력
---

# Player 구성과 입력

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 현재 입력과 실행 순서

| 입력 / API | 동작 |
| --- | --- |
| WASD / 방향키 · `MoveInput` | 이동 방향 |
| 마우스 · `AimDirection`, `MouseWorldPosition`, `HasAimTarget` | XY 조준·커서 월드 위치 |
| LMB · `ResolvePrimaryAttack(canAttack)` | UI·설치·포탑 선택이 사용하지 않은 새 클릭으로 공격을 시작 |
| Space · `WasDashPressed` | 대시 새 누름. 현재 공격 키가 아닙니다. |
| Q / E | Loadout에 선택한 스킬의 미리보기/사용 |
| F | 본인 소유 임시 포탑 회수 |
| R | 주변 일반 터렛 수리·복구 우선, 수리 대상이 없으면 총기 재장전 |
| 숫자 1–4 / 휠 / Tab | 1 스패너, 2 기본총, 3 냉각총, 4 스나이퍼 선택/순환 |

입력 수집(-200) → 스킬 문맥 예약(100) → 포탑 선택(150) → 무기 선택(200) → LateUpdate 설치 확정 → 공격(300) 순서입니다. UI가 클릭으로 닫혀도 소비 기록은 해당 프레임에 남고, 먼 포탑·이미 선택한 포탑 클릭도 발사로 이어지지 않습니다.

`GameInput.TryConsumePrimaryPointerPress`는 새 클릭을 한 번만 소비하고 `ReservePrimaryPointerForPlacement`는 설치 시작·진행·확정·취소 프레임을 예약합니다. `PlayerAttackInputState`는 UI·일시정지·조작 차단·설치로 연사가 끊긴 뒤 새 클릭을 요구합니다. 누른 채 문맥이 풀려도 자동 재개하지 않습니다.

## 무기 선택과 공격

선택은 `PlayerWeaponSelection.CurrentWeapon`, `TrySelectWeaponSlot`, `TrySelectWeapon`, `SelectAdjacentWeapon`, `SelectNextWeapon`과 `WeaponChanged`가 소유합니다. PlayerAttack은 선택한 장비로 `TryFire`를 수행하고 공격 간격·피해·탄환을 관리합니다. 선택만으로 공격 쿨타임을 초기화하지 않습니다. [무기·표시·피해](combat.md)를 확인하세요.

## 대시와 이동 작성자

`PlayerDash.TryDash`는 수락 bool, `IsDashing / IsReady / CooldownRemaining / CooldownProgress`는 조회입니다. PlayerMovement가 물리 스텝당 `TryGetVelocity`를 한 번 읽어 Rigidbody2D 속도를 적용합니다. `StopImmediately`는 대시도 취소합니다. 별도 Transform 이동/넉백 작성자를 추가하지 않습니다.

기본 설정은 속도 배율 2.5, 지속 0.16초, 쿨타임 1.2초입니다. 현행 프리팹 값을 우선하며 최종 밸런스 보장이 아닙니다. `PlayerDashTimer`가 마지막 물리 스텝의 초과 이동을 막고, 진행 방향을 막는 실제 충돌은 대시를 끝냅니다. 대시가 별도 무적·네트워크 요청/복제를 제공한다고 해석하지 않습니다.

미리 배치한 `PlayerDashAfterimageController`/`PlayerDashAfterimageEffect`가 몸체와 분리된 무기 잔상을 재사용합니다. 실행 중 잔상 GameObject/그림을 새로 만드는 계약이 아닙니다.

## 스킬·HUD 수명

Q/E는 선택 Loadout과 CanPrepare/CanUse/CanRecover를 확인합니다. 씬 소유 PlayerSkillHUD와 로컬 Owner를 재사용하고 무기·대시 HUD는 같은 Owner를 따릅니다. [스킬·설치·HUD](skills.md), [Initial Stage UI](ui-integration.md)를 확인하세요. 이 페이지의 정적 API 확인은 실제 Unity 입력·PlayMode·원격 Player 인수가 아닙니다.

[Player 목차](../player.md) · [통합 체크리스트](../integration.md)
