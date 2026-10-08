---
title: Player 검증과 제한 사항
---

# Player 검증과 제한 사항

**기준:** main `eb35ceb1` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 연결 검증

- MainCamera 태그·활성 카메라와 Rigidbody2D가 준비됐는지 확인합니다.
- Q/Tab과 GameInput의 입력 경로를 따로 확인합니다.
- EnemyHealth와 Monster에 중복 피해를 주지 않는지 확인합니다. Client의 EnemyHealth 피해 호출은 무시됩니다.
- HP 표시가 반복 이벤트에도 안정적인지 확인합니다. 현재 onDeath만으로 사망을 감지하지 않습니다.
- Q 스킬의 쿨다운과 Manager 유무에 따른 차단·허용 동작을 확인합니다.
- Player V2 상태가 Core PlayerState와 자동 동기화된다고 가정하지 않습니다.

검증 절차 안내이며 실제 Unity 플레이 테스트를 수행했다는 의미가 아닙니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
