---
title: Core 검증과 제한 사항
---

# Core 검증과 제한 사항

**기준:** main `eb35ceb1` · **영역:** 양현석 · **원본:** `Assets/PoC/Core/README.md`, `Application/MatchSession.cs`, `Application/IAppMatchHost.cs`, `Contracts/IMatchEventStream.cs`, `Domain/Match/MatchSimulation.cs`.

## 명령이 전투를 실행하지 않을 때

현재 `MatchSimulation.Execute()`는 `SimulationStatus.NotHandled`를 반환하는 골격입니다. 따라서 `FireCommand`·`ActivateTurretCommand`라는 타입이 존재한다고 실제 Player 사격이나 터렛 활성화가 처리되는 것은 아닙니다.

`MatchSession.Submit()`은 Authority를 검사하고 `Unauthorized`, `NotHandled`, `Rejected`, `Accepted`로 결과를 나눕니다. 이 경계를 무시해 UI에서 성공 처리하지 마세요. [터렛 명령 API](../turret/api-reference.md)는 별도의 현재 런타임 호출입니다.

`InitialStagePocModeRules`의 `IsVictory`와 `IsDefeat`는 현재 false를 반환하고 보상 영수증은 빈 통화 변경으로 생성됩니다. 출시 승패·경제 계약으로 재사용하지 않습니다.


## 수명과 검증

1. Scene 조립자가 세션을 한 번 연결했는지 확인합니다.
2. `PlayerSceneAdapter.Bind(session)` 전에 `Submit()`을 호출하면 예외가 발생합니다.
3. 다른 Match ID의 이벤트·결과는 허용되지 않습니다.
4. 구독과 Match 종료를 함께 정리합니다. 폐기한 세션 호출은 `ObjectDisposedException`입니다.
5. Player V2와 새 Command 경계가 완전히 통합됐다고 표시하지 않습니다.

[World의 공간 입력](../world.md) · [통합 검증](../integration.md)

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)
