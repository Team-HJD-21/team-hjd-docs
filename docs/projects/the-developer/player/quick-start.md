---
title: Player 구성과 입력
---

# Player 구성과 입력

**기준:** main `6b4310dc` (#549, 2026-10-24) · **영역:** 이영빈 · **현재 원본 경로:** `Assets/Scripts/Features/Player/`, `Assets/Scripts/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 프리팹 구성과 입력

Player V2는 `PlayerInputHandler`, `PlayerMovement`, `PlayerVisual`, `PlayerAttack`, `PlayerInfo`와 스킬 컴포넌트를 조합합니다. 입력 소비자가 매번 별도 키 입력을 수집하기보다 InputHandler의 값을 읽도록 구성합니다.

| `PlayerInputHandler` 속성 | 현재 입력 | 의미 |
| --- | --- | --- |
| `MoveInput` | WASD / 방향키 | 정규화한 이동 방향 |
| `AimDirection` | 마우스 | 월드 XY 평면을 기준으로 한 조준 방향 |
| `MouseWorldPosition`, `HasAimTarget` | 마우스 | 조준 평면의 위치와 유효한 대상 좌표 여부 |
| `IsAttackPressed` | Space | 현재 장착한 총 또는 스패너의 공격 시도 |
| `WasBombPressed` | E | 기존 속성 이름이며 현재 Controller는 `Loadout.E`에 선택한 스킬을 실행 |
| `WasSkillQPressed` | Q | `Loadout.Q`에 선택한 스킬 실행 |
| `WasRecoverPressed` | F | 본인 소유 임시 터렛 회수 |
| `WasWeaponSwitchPressed` | Tab | 해당 프레임 무기 전환 입력 |

현재 InputHandler는 이동·포인터와 Space/Q/E/F/Tab을 `GameInput`에서 읽습니다. 소비자는 프레임별 공개 값을 사용하며 별도 Input.GetKeyDown 수집을 중복 연결하지 않습니다. MainCamera 태그·활성 카메라와 Rigidbody2D를 확인하세요.

## 무기와 스킬 UI 연결

`PlayerAttack.CurrentWeapon`으로 장착 상태를 읽고 `SelectNextWeapon()`으로 기본 총 → 냉각총 → 스패너를 순환합니다. 스패너 프리팹이 없으면 기존 두 무기만 순환합니다. 실제 공격은 `TryFire()`로 요청하며 성공을 적중으로 해석하지 않습니다.

Q/E를 특정 스킬로 고정하지 말고 PlayerSkillController의 Loadout과 `CanPrepare`, `CanUse`, `CanRecover`를 확인하세요. 선택창이 열린 동안 스킬 사용은 제한됩니다.

스킬 HUD는 씬이 소유한 `PlayerSkillHUD.prefab`과 `PlayerSkillHudSceneBinding`을 사용합니다. Player 자식으로 HUD를 생성하는 팩토리는 제거됐습니다. 같은 씬·로컬 소유자 확인과 연결·해제는 [스킬·HUD 안내](skills.md)를, 무기·8방향 표시는 [무기 안내](combat.md)를 따릅니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
