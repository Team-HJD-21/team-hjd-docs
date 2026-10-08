---
title: Turret / Power — 터렛·전력·상태
---

# Turret / Power 연동 가이드

담당: 황재동. 기준: 게임 main `eb35ceb1` (2026-10-08 문서·코드 확인).

터렛은 `TurretBase`를 통해 상태를 변경하고, `TurretInstanceRegistry`의 `TurretSnapshot`으로 외부 시스템에 상태를 전달합니다. 전력 예약은 활성화 요청 내부에서 처리합니다.

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| 터렛을 찾아 켜고 끄기 | [빠른 시작](quick-start.md) |
| 생성 시 초기 체력·잠금·업그레이드 지정 | [명시적 초기화](initialization.md) |
| 피해·복구·잠금·업그레이드 | [API 사용법](api-reference.md) |
| UI와 적 AI의 조회·구독 | [스냅샷과 상태 동기화](snapshots.md) |
| 실패 결과와 연결 검증 | [검증과 제한 사항](testing.md) |
| 구현 구조와 런타임 흐름 | [전체 구조와 실행 흐름](runtime-flows.md) |

:::info 현재 제공 범위
이 문서는 main에 병합된 `TurretController`, `TurretPowerBudget`, `TurretControllerSnapshot`, 자동 활성화 재배분과 `IDamageableTarget` 계약을 포함합니다. 문서 빌드 검증과 Unity 플레이 검증은 별개입니다.
:::

관련 모듈: [Core](../core.md) · [Enemy](../enemy.md) · [통합 체크리스트](../integration.md)
