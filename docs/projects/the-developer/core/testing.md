---
title: Core 검증과 제한 사항
---

# Core 검증과 제한 사항

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 실제 요청 경계와 삭제한 골격

처리기가 없던 MatchSession/PlayerSceneAdapter의 범용 Submit 두 개와 전용 타입13개를 제거했습니다. 존재하지 않는 명령 API를 호출하거나 이를 위해 별도 처리기를 추가하지 마세요.

터렛은 `TurretCommandGateway/Service`, 스폰은 `EncounterRequestService`, Player 이동/공격은 해당 Feature/Host 경계를 사용합니다. 요청 전달·수락·실제 적용 결과를 구분합니다. MatchSession은 한 판 수명·상태·확정 결과를 관리합니다.

AppServices/MatchSessionFactory에서도 삭제한 범용 권한 객체의 주입을 없앴습니다. 실제 Host/참가자 검증과 PlayerSceneAdapter의 Bind/Unbind·실패 정리는 유지합니다.

## 수명과 검증

1. Scene 조립자가 세션을 한 번 연결했는지 확인합니다.
2. Bind/BindNetworkMatch 전에 Player Feature가 Match 소유권을 가진다고 가정하지 않습니다. 실제 초기화와 해제를 조립부에서 연결합니다.
3. 다른 Match ID의 이벤트·결과는 허용되지 않습니다.
4. 구독과 Match 종료를 함께 정리합니다. 폐기한 세션 호출은 `ObjectDisposedException`입니다.
5. Host 수동 확인과 실제 Client Player/HUD·전투 복제 인수를 구분합니다.

[World의 공간 입력](../world.md) · [통합 검증](../integration.md)

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)

## 네트워크 기반 변경의 확인 범위 — main 9cf0e16b

원본 #570은 NGO/UTP 지역 Snapshot·Match 재시작, 터렛 명령/표시와 Windows 두 프로세스 검사를 보고합니다. 일부 Host interaction actor는 개발 fixture이며 실제 원격 Player actor·터렛 전투 복제, LAN/인터넷 지연·손실·수동 GUI 인수까지 증명하지 않습니다. 문서의 API 존재·원본 시험 보고·이번 사이트 검사/빌드 결과를 구분하세요. 이번 동기화에서 Unity 시험을 재실행하지 않았습니다.


## 2026-11-05 동기화의 검증 경계

기준 main `1a03e9a9`의 공개 문서와 실제 Core/Player/Enemy/Map/FieldTurret 심볼을 정적으로 비교했습니다. #615의 기반 조립, #575의 Player 입력/무기, #594·#616의 Enemy 능력 구조, #611의 날씨 표시, #596·#614·#617의 터렛 변경을 구분했습니다.

이번 작업에서 Unity 컴파일·PlayMode·Initial_Stage 직접 조작·다중 프로세스 게임 인수는 실행하지 않았습니다. 소스 문서의 이전 실험 시험 수치와 이번 사이트 check/build는 서로 다른 증거입니다. 특히 실제 Feature의 시간·환경·난수·체크포인트 writer, 원격 Player/포털·공동 Scene 이동은 계약 존재와 별도로 확인합니다.

MatchCoordinator의 CU 읽기/완료 경계와 각 Feature의 실제 전투 실행을 구분합니다. 삭제한 범용 Simulation/Submit 골격은 현재 실행 경로가 아닙니다.
