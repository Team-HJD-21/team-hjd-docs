---
title: Spaceship 씬 왕복
---

# Spaceship 씬 왕복

**기준:** 게임 main `e00fcba0692a69dbf656c68be1f033300961e302` (2026-11-08), `spaceship-travel-api.md`와 실제 출입 API 정적 대조.

## Spaceship 왕복 준비

1. `SpaceshipEnter`에 로드할 Scene과 도착 표식을 지정합니다. 현재 표식은 `Capsule`입니다. 출입 Collider의 부모 계층에 `PlayerActorIdentity`가 있어야 합니다.
2. 로드할 Scene을 Build Settings에 포함하고, `SpaceshipExit`의 돌아갈 Scene과 필드 표식·padding을 확인합니다. App의 Scene 조립부가 `ISpaceshipTravelConsumer`에 `ISpaceshipTravel`을 전달합니다.
3. 문 접촉은 `SpaceshipEnter.EnterAsync(Collider2D)` 또는 `SpaceshipExit.ExitAsync(Collider2D)`로 들어갑니다. 첫 출격은 `GameFlow.LaunchMissionAsync`로 정식 Match를 시작합니다. 전투 중 방문은 기존 필드와 Player를 유지한 채 우주선을 Additive 로드하고 이동합니다.
4. 방문 후 복귀는 같은 actor를 필드 입구 바깥으로 옮기고 위치를 보고합니다. 목적지 누락 시 이동이 실패하며 새로 로드한 방문 Scene과 이동 입력 잠금을 정리합니다.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)


## App Scene 전환과 임시 방문 구분 — main 1a03e9a9

`GameFlowController.ReturnToSpaceshipAsync`는 Match를 종료하는 정식 귀환입니다. 전투 중 임시 방문에는 이 API를 재사용하지 않습니다. `SceneFlowController.LoadAsync / ReplaceAsync / UnloadAsync`와 소유자별 입력 잠금과 App/NGO 각각의 전환 제한은 [Scene·화면 API](../core/api-reference.md#scene화면과-입력-잠금)를 확인하세요.

실제 Host 이동 완료 뒤의 위치 보고는 [출입 API](../core/presence-reporting.md)를 따릅니다. 로컬 PlayerLocationState로 카메라 날씨 효과를 숨기는 것과 전체 참가자 출입/필드 정지는 같은 경로가 아닙니다. Actor 생성은 PlayerStart가 속한 Scene을 사용하며 부모 Transform도 같은 Scene이어야 합니다.

## NGO driver와 App 이동 제한 — main d9ea7057

`NgoSceneFlow` 자체는 Scene 관리를 켠 **1–2인 Host**가 선택한 Load/Replace/Unload를 지원합니다. 작업 시작 때 참가자 집합을 고정하고 전체 완료 목록을 확인하며, 도중 새 참가/이탈·Host 종료·일부 timeout·실시간 deadline 초과를 성공으로 처리하지 않습니다. 완료 콜백 내부 정리가 끝난 뒤 다음 작업을 허용하고 이벤트 구독을 정리합니다. Client가 Scene을 독자적으로 고르는 API가 아닙니다.

현재 App/GameFlow도 고정 1–2인 Host의 공동 Scene 이동을 허용합니다. `LaunchMissionAsync`는 전체 Scene 로드 후 전원의 Feature 준비를 기다리고 시작합니다. Client의 독립 Scene 전환은 차단됩니다. 임시 포털 방문은 Host 권위 actor의 위치를 보고하며, 원격 Client의 출입 요청 RPC는 별도 구현 범위입니다.
