---
title: Enemy / Encounter — 스폰·타깃·피해
sidebar_position: 6
---

# Enemy / Encounter 연동 가이드

**기준:** main `b73e0e76` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/TurretTargetableAdapter.cs`.

별도 Enemy 사용 문서가 없어 main 코드를 대조했습니다. 레거시 `Monster`와 새 PoC의 서버 기반 Enemy를 구분합니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Enemy 빠른 시작 | [Enemy 빠른 시작](enemy/quick-start.md) |
| Enemy 스폰 API 사용법 | [Enemy 스폰 API 사용법](enemy/api-reference.md) |
| 타깃 제공과 선택 | [타깃 제공과 선택](enemy/targeting.md) |
| 서버 피해와 네트워크 | [서버 피해와 네트워크](enemy/damage.md) |
| Enemy 검증과 제한 사항 | [Enemy 검증과 제한 사항](enemy/testing.md) |

기존 설명을 목적별 페이지로 나누었습니다. 문서 기준 커밋은 변경하지 않았으며, 새 기능 구현이나 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
