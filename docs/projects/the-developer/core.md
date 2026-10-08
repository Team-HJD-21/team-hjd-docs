---
title: Core — 세션·명령·이벤트
sidebar_position: 2
---

# Core 연동 가이드

**기준:** main `eb35ceb1` · **영역:** 양현석 · **원본:** `Docs/architecture/core-api-usage.md`, `Assets/PoC/Core/README.md`와 실제 공개 계약.

Core README의 설명과 코드를 함께 대조했습니다. 기존 `Global`·`Game`·`GeneralManager`와 새 `TeamHJD.Game.*` 계약이 자동 호환되는 구조는 아닙니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Core 빠른 시작 | [Core 빠른 시작](core/quick-start.md) |
| Core API 사용법 | [Core API 사용법](core/api-reference.md) |
| 모듈 연결과 소유권 | [Core 호출·소유권 계약](core/contracts.md) |
| 이벤트 구독과 세션 수명 | [이벤트 구독과 세션 수명](core/events.md) |
| Core 검증과 제한 사항 | [Core 검증과 제한 사항](core/testing.md) |

게임 저장소의 공개 계약을 목적별 페이지로 나누었습니다. 문서 동기화는 새 기능 구현이나 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
