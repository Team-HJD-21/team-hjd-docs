---
title: 체력과 UI 연결
---

# 체력과 UI 연결

**기준:** Player health behavior was rechecked at main `1277de10`; earlier Player V2 notes remain based on `789f5b44` · **원본:** `Assets/Scripts/Features/Player/PlayerInfo.cs`, `Assets/Scripts/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 체력과 UI

| API / 값 | 현재 의미 | 제한 |
| --- | --- | --- |
| `PlayerInfo.TakeDamage(int)` | 현재 HP 감소와 사망 흐름 진입 | 기존 GeneralManager 경로 사용 |
| `RecoverHp()` | 회복 coroutine 시작 | 중복 호출 제어는 소비자가 검토 |
| `onHpChange` | 현재 HP·최대 HP UI 전달 | FixedUpdate에서도 발행되므로 변경 시 한 번인 이벤트가 아님 |
| `onDeath` | `Die()`가 한 번 호출될 때 Invoke되는 UnityEvent | 사망 시 PlayerControlState 입력을 막고 이동을 중지한 뒤 스킬 선택을 닫음 |

`curHp`, `maxHp`가 public이라고 새 모듈에서 직접 바꾸는 계약으로 삼지 마세요. `PlayerInfo`를 새 Match PlayerState와 자동 동기화하는 계약은 현재 미완성입니다.

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)

## 공용 필드 시간의 감속

`PlayerSlowEffects.ApplySlow(speedMultiplier, duration)`에 이동 배율과 남은 게임 초를 전달합니다. 감속마다 만료 시간을 따로 유지하며 일반 이동과 Dash에는 현재 가장 강한 배율 하나를 적용합니다. 필드 정지 중에는 만료가 진행되지 않습니다. `Changed(multiplier, count)`를 사용해 HUD를 갱신할 수 있습니다. Player의 체크포인트 writer는 감속별 배율과 남은 게임 초를 보관합니다.
