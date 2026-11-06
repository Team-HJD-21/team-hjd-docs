---
title: Spaceship 씬 왕복
---

# Spaceship 씬 왕복

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## Spaceship 왕복 준비

1. `SpaceshipEnter`에 로드할 Scene 이름과 목적지 Transform 이름을 지정합니다. 기본 목적지 이름은 `Triangle`입니다.
2. Player 오브젝트의 **Layer**가 `Player`인지 확인합니다. 이 진입 판정은 태그가 아닙니다.
3. Scene이 Build Settings에 있고 목적지 이름이 일치해야 합니다. Additive 로드 후 Player 위치를 이동합니다.
4. `SpaceshipExit`에는 이미 로드된 돌아갈 Scene, 귀환 Trigger 이름, 언로드할 원래 Scene 이름을 설정합니다.
5. 출구는 Trigger 아래쪽으로 Collider 크기와 padding을 반영해 Player를 옮깁니다. Rigidbody2D가 있으면 속도도 초기화합니다.

씬 진입/출구는 Trigger로 실행됩니다. 외부에서 `EnterSpaceship()`이나 `TryExit()`를 호출하는 public API는 아닙니다. 필드 이름·Scene 이름이 잘못되면 Console 오류와 함께 전환이 중단됩니다.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)


## App Scene 전환과 임시 방문 구분 — main 1a03e9a9

`GameFlowController.ReturnToSpaceshipAsync`는 Match를 종료하는 정식 귀환입니다. 전투 중 임시 방문에는 이 API를 재사용하지 않습니다. `SceneFlowController.LoadAsync / ReplaceAsync / UnloadAsync`와 소유자별 입력 잠금과 App/NGO 각각의 전환 제한은 [Scene·화면 API](../core/api-reference.md#scene화면과-입력-잠금)를 확인하세요.

실제 Host 이동 완료 뒤의 위치 보고는 [출입 API](../core/presence-reporting.md)를 따릅니다. 로컬 PlayerLocationState로 카메라 날씨 효과를 숨기는 것과 전체 참가자 출입/필드 정지는 같은 경로가 아닙니다. Actor 생성은 PlayerStart가 속한 Scene을 사용하며 부모 Transform도 같은 Scene이어야 합니다.

## NGO driver와 App 이동 제한 — main d9ea7057

`NgoSceneFlow` 자체는 Scene 관리를 켠 **1–2인 Host**가 선택한 Load/Replace/Unload를 지원합니다. 작업 시작 때 참가자 집합을 고정하고 전체 완료 목록을 확인하며, 도중 새 참가/이탈·Host 종료·일부 timeout·실시간 deadline 초과를 성공으로 처리하지 않습니다. 완료 콜백 내부 정리가 끝난 뒤 다음 작업을 허용하고 이벤트 구독을 정리합니다. Client가 Scene을 독자적으로 고르는 API가 아닙니다.

다만 현재 `AppRoot.GetSceneTravelRestriction`은 Client와 다중 참가자 Host의 App/GameFlow 이동을 계속 제한합니다. 하위 driver 확장을 상위 화면 버튼·공동 재시작/왕복 완료로 설명하지 않습니다. Replace 전 Match 종료와 최종 결과 전달도 호출자 계약입니다. 이 변경에서 실제 2인 게임 이동을 새로 검증하지 않았습니다.
