---
title: World / Spaceship — 공간·씬·진행 상태
sidebar_position: 4
---

# World / Spaceship 연동 가이드

**기준:** main `b73e0e76` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

별도 World API 문서가 없어 코드에서 현재 연결 지점을 정리했습니다. 저작된 맵·Collider 배치와 Core 공간 계산, Spaceship 저장 실험은 서로 다른 책임입니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Spaceship 씬 왕복 | [Spaceship 씬 왕복](world/quick-start.md) |
| 전장 공간 입력 | [전장 공간 입력](world/spatial-inputs.md) |
| 진행 상태와 저장 실험 | [진행 상태와 저장 실험](world/progress.md) |
| World 검증과 제한 사항 | [World 검증과 제한 사항](world/testing.md) |

기존 설명을 목적별 페이지로 나누었습니다. 문서 기준 커밋은 변경하지 않았으며, 새 기능 구현이나 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
