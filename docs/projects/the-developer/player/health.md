---
title: 체력과 UI 연결
---

# 체력과 UI 연결

**기준:** main `eb35ceb1` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 체력과 UI

| API / 값 | 현재 의미 | 제한 |
| --- | --- | --- |
| `PlayerInfo.TakeDamage(int)` | 현재 HP 감소와 사망 흐름 진입 | 기존 GeneralManager 경로 사용 |
| `RecoverHp()` | 회복 coroutine 시작 | 중복 호출 제어는 소비자가 검토 |
| `onHpChange` | 현재 HP·최대 HP UI 전달 | FixedUpdate에서도 발행되므로 변경 시 한 번인 이벤트가 아님 |
| `onDeath` | 선언된 UnityEvent | 현재 `Die()`에서 Invoke되지 않음; 이 이벤트만 구독해 사망 표시하지 말 것 |

`curHp`, `maxHp`가 public이라고 새 모듈에서 직접 바꾸는 계약으로 삼지 마세요. `PlayerInfo`를 새 Match PlayerState와 자동 동기화하는 계약은 현재 미완성입니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
