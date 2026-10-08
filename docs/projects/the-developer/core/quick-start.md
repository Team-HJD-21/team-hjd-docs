---
title: Core 빠른 시작
---

# Core 빠른 시작

**기준:** main `eb35ceb1` · **영역:** 양현석 · **원본:** `Assets/PoC/Core/README.md`, `Application/MatchSession.cs`, `Application/IAppMatchHost.cs`, `Contracts/IMatchEventStream.cs`, `Domain/Match/MatchSimulation.cs`.

## 먼저 준비할 것

Scene 조립은 `InitialStageCompositionRoot`와 앱의 `IAppMatchHost` 경계에서 수행합니다. Feature마다 별도 `AppRoot`를 만들거나 Match를 임의로 중복 생성하지 않습니다.

Contracts/Application은 Domain을 참조하고, Presentation/Bootstrap이 이 계약과 서비스를 소비합니다. Domain과 Application은 Unity 오브젝트를 직접 찾아 쓰는 계층이 아닙니다. Unity 타입을 순수 공간 입력으로 바꾸는 작업은 Scene adapter가 맡습니다.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)
