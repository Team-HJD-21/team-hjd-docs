---
title: Core 빠른 시작
---

# Core 빠른 시작

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 먼저 준비할 것

Scene 조립은 `InitialStageCompositionRoot`와 앱의 `IAppMatchHost` 경계에서 수행합니다. Feature마다 별도 `AppRoot`를 만들거나 Match를 임의로 중복 생성하지 않습니다.

Contracts/Application은 Domain을 참조하고, Presentation/Bootstrap이 이 계약과 서비스를 소비합니다. Domain과 Application은 Unity 오브젝트를 직접 찾아 쓰는 계층이 아닙니다. Unity 타입을 순수 공간 입력으로 바꾸는 작업은 Scene adapter가 맡습니다.

네트워크 Match를 연결할 때는 Session을 AppRoot에 명시적으로 연결하고 Host/Client 연결을 별도로 시작합니다. 연결 완료, Match 준비, Match 시작은 각각 별도 단계입니다. 지역 Grid와 Encounter 요청의 API 순서는 [지역·Encounter 연동](regions-encounters.md)을 참고하세요.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)

## 정식 네트워크 Scene 사용 시 — main 9cf0e16b

Initial_Stage는 InitialStageNetworkBinding의 연결→Host 준비→모두 준비 후 Host 시작 경계를 사용합니다. Client는 자체 권한 MatchSession이나 지역 쓰기 원본을 만들지 않습니다. 초기화·재시작·소유권의 현재 계약은 [지역·Encounter 연동](regions-encounters.md), HUD 요청·논리 ID·표시는 [공용 터렛 API](api-reference.md#공용-터렛-명령과-표시--main-9cf0e16b)를 우선 확인하세요. 독립 Feature Scene의 로컬 API와 정식 네트워크 경로를 혼용하지 않습니다.


## 최신 main의 조립 범위 — 2026-11-05

기준 `1a03e9a9` (#615까지의 Core 기반 포함). App·시간·난수·환경·저장·Scene/화면의 호출 지도는 [App·Match 기반 API](api-reference.md#appmatch-기반-api--main-1a03e9a9)를 확인합니다. 기존 카테고리와 요청/표시 경계는 유지됩니다.

Initial_Stage 조립은 현재 터렛 권한·논리 ID·지역과 CU 읽기 Port를 사용합니다. Random 소비자는 Feature가 IRandomConsumer를 구현한 경우만 연결되고, 환경/추가 Spawn consumer도 선택적입니다. 계약이 병합된 것과 실제 Weather·Player·Enemy에 전체 통합된 것은 다릅니다.
