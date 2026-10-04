---
title: Spaceship 씬 왕복
---

# Spaceship 씬 왕복

**기준:** main `b73e0e76` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

## Spaceship 왕복 준비

1. `SpaceshipEnter`에 로드할 Scene 이름과 목적지 Transform 이름을 지정합니다. 기본 목적지 이름은 `Triangle`입니다.
2. Player 오브젝트의 **Layer**가 `Player`인지 확인합니다. 이 진입 판정은 태그가 아닙니다.
3. Scene이 Build Settings에 있고 목적지 이름이 일치해야 합니다. Additive 로드 후 Player 위치를 이동합니다.
4. `SpaceshipExit`에는 이미 로드된 돌아갈 Scene, 귀환 Trigger 이름, 언로드할 원래 Scene 이름을 설정합니다.
5. 출구는 Trigger 아래쪽으로 Collider 크기와 padding을 반영해 Player를 옮깁니다. Rigidbody2D가 있으면 속도도 초기화합니다.

씬 진입/출구는 Trigger로 실행됩니다. 외부에서 `EnterSpaceship()`이나 `TryExit()`를 호출하는 public API는 아닙니다. 필드 이름·Scene 이름이 잘못되면 Console 오류와 함께 전환이 중단됩니다.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)
