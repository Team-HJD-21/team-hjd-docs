---
title: Core — 세션·명령·이벤트
sidebar_position: 2
---

# Core 연동 가이드

**기준:** main `b73e0e76` · **영역:** 양현석 · **원본:** `Assets/PoC/Core/README.md`, `Application/MatchSession.cs`, `Application/IAppMatchHost.cs`, `Contracts/IMatchEventStream.cs`, `Domain/Match/MatchSimulation.cs`.

Core README의 설명과 코드를 함께 대조했습니다. 기존 `Global`·`Game`·`GeneralManager`와 새 `TeamHJD.Game.*` 계약이 자동 호환되는 구조는 아닙니다.

## 먼저 준비할 것

Scene 조립은 `InitialStageCompositionRoot`와 앱의 `IAppMatchHost` 경계에서 수행합니다. Feature마다 별도 `AppRoot`를 만들거나 Match를 임의로 중복 생성하지 않습니다.

Contracts/Application은 Domain을 참조하고, Presentation/Bootstrap이 이 계약과 서비스를 소비합니다. Domain과 Application은 Unity 오브젝트를 직접 찾아 쓰는 계층이 아닙니다. Unity 타입을 순수 공간 입력으로 바꾸는 작업은 Scene adapter가 맡습니다.

## 주요 API

| API | 사용할 때 | 주의 |
| --- | --- | --- |
| `IAppMatchHost.StartMatch(...)` | Scene 조립자가 설정·초기 상태·규칙·공간 입력을 연결 | Config와 State의 Match ID가 같아야 함 |
| `MatchSession.Submit(GameCommand)` | 명령 권한과 처리 결과 조회 | `Accepted`를 가정하지 말고 상태 확인 |
| `MatchSession.Events.Subscribe(Action<MatchEvent>)` | UI·상태 표시가 Match 사실을 구독 | 반환된 `IDisposable` 해제 |
| `MatchSession.CreateSnapshot(long sequence)` | 특정 순번의 상태 조회 | 네트워크 동기화·저장 복구 기능이 아님 |
| `MatchSession.Battlefield` | topology·frontline·grid 읽기 | MatchSnapshot과 다른 공간 snapshot |
| `UpdateBattlefieldParticipants(dynamicInput)` | Player·Enemy 위치 갱신 | Scene 수집 결과를 전달 |
| `UpdateBattlefieldTurretLayout(staticInput)` | 터렛 배치 변경 | 정적 topology 재계산 경계 |
| `ReconfigureBattlefieldGrid(configuration)` | grid 설정 변경 | 콘텐츠 설정·유효 범위 확인 |
| `CompleteCurrentMatch(outcome, eventSequence)` | 앱 경계에서 완료 결과 생성 | 최종 게임 승패 정책과 구분 |
| `EndCurrentMatch()` | Scene/Match 종료 | 구독과 객체 수명 정리 |

`MatchSession`을 직접 `new`하는 public 생성자는 없습니다. 앱 경계나 `MatchSessionFactory`를 통해 생성합니다.

## 구독 예제

아래 함수는 이미 조립된 세션을 전달받는 소비자 예제입니다. 자동 Bootstrap 예제가 아닙니다.

```csharp
using System;
using TeamHJD.Game.Application;

public sealed class MatchObserver : IDisposable
{
    private readonly IDisposable subscription;
    public MatchObserver(MatchSession session)
    {
        subscription = session.Events.Subscribe(evt =>
            UnityEngine.Debug.Log(evt.GetType().Name));
    }
    public void Dispose() => subscription.Dispose();
}
```

## 명령이 전투를 실행하지 않을 때

현재 `MatchSimulation.Execute()`는 `SimulationStatus.NotHandled`를 반환하는 골격입니다. 따라서 `FireCommand`·`ActivateTurretCommand`라는 타입이 존재한다고 실제 Player 사격이나 터렛 활성화가 처리되는 것은 아닙니다.

`MatchSession.Submit()`은 Authority를 검사하고 `Unauthorized`, `NotHandled`, `Rejected`, `Accepted`로 결과를 나눕니다. 이 경계를 무시해 UI에서 성공 처리하지 마세요. [터렛 명령 API](turret/api-reference.md)는 별도의 현재 런타임 호출입니다.

`InitialStagePocModeRules`의 `IsVictory`와 `IsDefeat`는 현재 false를 반환하고 보상 영수증은 빈 통화 변경으로 생성됩니다. 출시 승패·경제 계약으로 재사용하지 않습니다.

## 수명과 검증

1. Scene 조립자가 세션을 한 번 연결했는지 확인합니다.
2. `PlayerSceneAdapter.Bind(session)` 전에 `Submit()`을 호출하면 예외가 발생합니다.
3. 다른 Match ID의 이벤트·결과는 허용되지 않습니다.
4. 구독과 Match 종료를 함께 정리합니다. 폐기한 세션 호출은 `ObjectDisposedException`입니다.
5. Player V2와 새 Command 경계가 완전히 통합됐다고 표시하지 않습니다.

[World의 공간 입력](world.md) · [통합 검증](integration.md)
