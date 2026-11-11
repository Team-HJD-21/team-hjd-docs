---
title: Core — 세션·명령·이벤트
sidebar_position: 2
---

# Core 연동 가이드

**11월 12일 확인:** [현재 사용할 수 있는 기능](core/implementation-status.md)에서 기반 구현과 실제 게임 연결을 구분합니다. [CameraManager](core/camera-management.md)는 사용할 수 있으며, [공용 AudioManager](core/audio.md)는 아직 없습니다. CU 시작 셀과 Host 설정은 [지역 API](core/regions-encounters.md#cu-시작-영역과-동적-연결)에 추가됐습니다.

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

Core의 실제 main 조립과 공개 API를 함께 대조했습니다. App·시간·저장·화면의 최신 계약은 [Core API](core/api-reference.md#appmatch-기반-api--main-1a03e9a9)를 확인하세요. 기존 `Global`·`Game`·`GeneralManager`와 새 `TeamHJD.Game.*` 계약이 자동 호환되는 구조는 아닙니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| 어떤 기반이 구현돼 있는지 확인 | [현재 사용할 수 있는 기능](core/implementation-status.md) |
| 컷씬 시점·블렌드·복귀 | [CameraManager 사용법](core/camera-management.md) |
| Audio 연결 가능 여부 | [Audio 구현 상태](core/audio.md) |
| Core 빠른 시작 | [Core 빠른 시작](core/quick-start.md) |
| Core API 사용법 | [Core API 사용법](core/api-reference.md) |
| Host 난수·체크포인트 | [Host 난수와 체크포인트 API](core/randomness.md) |
| 우주선 출입·정지 | [우주선 출입 보고와 Core 정지 API](core/presence-reporting.md) |
| 모듈 연결과 소유권 | [Core 호출·소유권 계약](core/contracts.md) |
| 이벤트 구독과 세션 수명 | [이벤트 구독과 세션 수명](core/events.md) |
| 지역 Grid와 Encounter 요청 | [지역·Encounter 연동](core/regions-encounters.md) |
| Core 검증과 제한 사항 | [Core 검증과 제한 사항](core/testing.md) |

게임 저장소의 공개 계약을 목적별 페이지로 나누었습니다. 지역·Encounter API 페이지는 공개 호출 계약만 요약하며 회의록·기획·원본 에셋은 포함하지 않습니다. 문서 동기화는 새 기능 구현이나 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
