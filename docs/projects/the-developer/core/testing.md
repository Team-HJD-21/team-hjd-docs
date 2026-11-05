---
title: Core 검증과 제한 사항
---

# Core 검증과 제한 사항

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

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

## 네트워크 기반 변경의 확인 범위 — main 9cf0e16b

원본 #570은 NGO/UTP 지역 Snapshot·Match 재시작, 터렛 명령/표시와 Windows 두 프로세스 검사를 보고합니다. 일부 Host interaction actor는 개발 fixture이며 실제 원격 Player actor·터렛 전투 복제, LAN/인터넷 지연·손실·수동 GUI 인수까지 증명하지 않습니다. 문서의 API 존재·원본 시험 보고·이번 사이트 검사/빌드 결과를 구분하세요. 이번 동기화에서 Unity 시험을 재실행하지 않았습니다.


## 2026-11-05 동기화의 검증 경계

기준 main `1a03e9a9`의 공개 문서와 실제 Core/Player/Enemy/Map/FieldTurret 심볼을 정적으로 비교했습니다. #615의 기반 조립, #575의 Player 입력/무기, #594·#616의 Enemy 능력 구조, #611의 날씨 표시, #596·#614·#617의 터렛 변경을 구분했습니다.

이번 작업에서 Unity 컴파일·PlayMode·Initial_Stage 직접 조작·다중 프로세스 게임 인수는 실행하지 않았습니다. 소스 문서의 이전 실험 시험 수치와 이번 사이트 check/build는 서로 다른 증거입니다. 특히 실제 Feature의 시간·환경·난수·체크포인트 writer, 원격 Player/포털·공동 Scene 이동은 계약 존재와 별도로 확인합니다.

MatchCoordinator의 CU 읽기/완료 경계와 순수 MatchSimulation.Execute의 NotHandled 골격을 같은 실행 경로로 취급하지 않습니다.
