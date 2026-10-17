---
title: Player — 입력·전투·피해
sidebar_position: 3
---

# Player 연동 가이드

**최근 원본 확인:** main `20ca65d1` (#529) · **영역:** 이영빈 · **현재 경로:** `Assets/Scripts/Features/Player/`. 세부 Player 문서는 본문에 각각의 기준 커밋을 표시합니다.

Player V2의 Manager 기반 런타임과 Core adapter를 구분합니다. Initial Stage HUD 연동/API 조건은 별도 페이지에 정리하며, 프리팹 내부 구성이나 화면 디자인 지침은 이 사이트의 범위에 포함하지 않습니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Player 구성과 입력 | [Player 구성과 입력](player/quick-start.md) |
| 탄환과 Enemy 피해 | [탄환과 Enemy 피해](player/combat.md) |
| 체력과 UI 연결 | [체력과 UI 연결](player/health.md) |
| Initial Stage 상태 표시와 터렛 UI 연동 | [Initial Stage UI 연동](player/ui-integration.md) |
| 임시 터렛 스킬 | [임시 터렛 스킬](player/skills.md) |
| Player 검증과 제한 사항 | [Player 검증과 제한 사항](player/testing.md) |

기존 Player 설명은 개별 기준 커밋을 유지합니다. 최신 HUD 연동 문서와 체력 사망 이벤트 설명을 추가했으며, 이를 Unity PlayMode에서 검증했다는 뜻은 아닙니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
