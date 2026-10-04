---
title: 이벤트 구독과 세션 수명
---

# 이벤트 구독과 세션 수명

**기준:** main `b73e0e76` · **영역:** 양현석 · **원본:** `Assets/PoC/Core/README.md`, `Application/MatchSession.cs`, `Application/IAppMatchHost.cs`, `Contracts/IMatchEventStream.cs`, `Domain/Match/MatchSimulation.cs`.

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

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)
