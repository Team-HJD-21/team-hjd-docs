---
title: Enemy / Encounter — 스폰·타깃·피해
sidebar_position: 6
---

# Enemy / Encounter 연동 가이드

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

Docs/architecture/enemy-system-guide.md와 현재 main의 실제 controller·ability·network 수명을 대조했습니다. 레거시 `Monster`와 새 PoC의 서버 기반 Enemy를 구분합니다.

## 필요한 작업부터 읽기

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| Enemy 빠른 시작 | [Enemy 빠른 시작](enemy/quick-start.md) |
| Enemy 스폰 API 사용법 | [Enemy 스폰 API 사용법](enemy/api-reference.md) |
| 셀 단위 스폰 분산 규칙 | [공간 기반 스폰 분산](enemy/spawn-distribution.md) |
| 타깃 제공·선택과 NavMesh 이동 | [타깃 제공과 선택](enemy/targeting.md) |
| 서버 피해와 네트워크 | [서버 피해와 네트워크](enemy/damage.md) |
| Enemy 검증과 제한 사항 | [Enemy 검증과 제한 사항](enemy/testing.md) |

EnemyHealth의 자체 서버 검사가 제거되고 네트워크 수명은 EnemyNetworkController로 이동했습니다. 최신 타깃 전달은 AssignTarget, 행동 확장은 EnemyAbility/MovingEnemyController를 사용합니다. [피해 경계](enemy/damage.md)와 [API 참조](enemy/api-reference.md)를 확인하세요. 기존 스폰·타깃 설명은 개별 동작 기준을 유지합니다. NavMesh 경로, Rigidbody2D 이동과 서버 FixedUpdate 경계는 #534의 main 코드를 정적으로 대조했으며 Unity 플레이 검증을 뜻하지 않습니다.

[The Developer 목차](index.md) · [통합 체크리스트](integration.md)
