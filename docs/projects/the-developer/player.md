---
title: Player — 입력·전투·피해
sidebar_position: 3
---

# Player 연동 가이드

**기준:** main `b73e0e76` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

별도 Player 전용 Markdown이 없어 현재 구현을 참고해 작성했습니다. Player V2의 Manager 기반 런타임과 Core adapter를 구분합니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Player 구성과 입력 | [Player 구성과 입력](player/quick-start.md) |
| 탄환과 Enemy 피해 | [탄환과 Enemy 피해](player/combat.md) |
| 체력과 UI 연결 | [체력과 UI 연결](player/health.md) |
| 임시 터렛 스킬 | [임시 터렛 스킬](player/skills.md) |
| Player 검증과 제한 사항 | [Player 검증과 제한 사항](player/testing.md) |

기존 설명을 목적별 페이지로 나누었습니다. 문서 기준 커밋은 변경하지 않았으며, 새 기능 구현이나 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
