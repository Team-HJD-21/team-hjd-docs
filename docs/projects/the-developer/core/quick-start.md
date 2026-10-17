---
title: Core 빠른 시작
---

# Core 빠른 시작

**기준:** 게임 main `7f22b9ca` (#530) · **원본:** Core 공개 API와 `Docs/architecture/core-api-usage.md`.

## 먼저 준비할 것

Scene 조립은 `InitialStageCompositionRoot`와 앱의 `IAppMatchHost` 경계에서 수행합니다. Feature마다 별도 `AppRoot`를 만들거나 Match를 임의로 중복 생성하지 않습니다.

Contracts/Application은 Domain을 참조하고, Presentation/Bootstrap이 이 계약과 서비스를 소비합니다. Domain과 Application은 Unity 오브젝트를 직접 찾아 쓰는 계층이 아닙니다. Unity 타입을 순수 공간 입력으로 바꾸는 작업은 Scene adapter가 맡습니다.

네트워크 Match를 연결할 때는 Session을 AppRoot에 명시적으로 연결하고 Host/Client 연결을 별도로 시작합니다. 연결 완료, Match 준비, Match 시작은 각각 별도 단계입니다. 지역 Grid와 Encounter 요청의 API 순서는 [지역·Encounter 연동](regions-encounters.md)을 참고하세요.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)
