---
title: Player 구성과 입력
---

# Player 구성과 입력

**기준:** main `b73e0e76` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

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

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
