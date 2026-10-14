---
title: Player 검증과 제한 사항
---

# Player 검증과 제한 사항

**기준:** main `789f5b44` · **영역:** 이영빈 · **현재 원본 경로:** `Assets/Scripts/Features/Player/`, `Assets/Scripts/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 연결 검증

- MainCamera 태그·활성 카메라와 Rigidbody2D가 준비됐는지 확인합니다.
- Q/Tab과 GameInput의 입력 경로를 따로 확인합니다.
- EnemyHealth와 Monster에 중복 피해를 주지 않는지 확인합니다. Client의 EnemyHealth 피해 호출은 무시됩니다.
- HP 표시가 반복 이벤트에도 안정적인지 확인합니다. 사망 시 `onDeath`가 한 번 호출되는지와 입력 차단·이동 중지가 적용되는지도 확인합니다.
- Q 스킬의 쿨다운과 Manager 유무에 따른 차단·허용 동작을 확인합니다.
- Player V2 상태가 Core PlayerState와 자동 동기화된다고 가정하지 않습니다.

검증 절차 안내이며 실제 Unity 플레이 테스트를 수행했다는 의미가 아닙니다. Initial HUD의 냉각·활성화·강화 제한 확인 항목은 [UI 연동 안내](ui-integration.md)를 참고하세요.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
