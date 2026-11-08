---
title: World / Spaceship — 공간·씬·진행 상태
sidebar_position: 4
---

# World / Spaceship 연동 가이드

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

현재 main의 Map 구현과 Core Scene·시간·환경·저장 API의 연결 경계를 함께 대조했습니다. 저작된 맵·Collider 배치와 Core 공간 계산, Spaceship 저장 실험은 서로 다른 책임입니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Spaceship 씬 왕복 | [Spaceship 씬 왕복](world/quick-start.md) |
| 전장 공간 입력 | [전장 공간 입력](world/spatial-inputs.md) |
| 진행 상태·저장 실험·날씨 큐 | [진행 상태와 날씨](world/progress.md) |
| World 검증과 제한 사항 | [World 검증과 제한 사항](world/testing.md) |

Spaceship 왕복과 Map 날씨 사용법은 main `e00fcba0`의 출입·환경 조립을 기준으로 합니다. 공간 입력의 개별 기준과 Unity 실행 검증은 각 문서에서 확인하세요.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
