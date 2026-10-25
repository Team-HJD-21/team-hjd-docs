---
title: Enemy 검증과 제한 사항
---

# Enemy 검증과 제한 사항

**기준:** main `789f5b44` · **영역:** 조수빈 · **원본:** `Assets/Scripts/Features/Enemy/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 검증 체크

- Host와 Client 호출을 분리해 확인합니다.
- 분대 계획 수와 Executor 실제 생성 수를 비교합니다.
- 타깃이 파괴/비활성/제거되면 다시 유효한 대상을 선택하는지 확인합니다.
- [Player 탄환](../player.md)이 EnemyHealth와 Monster 양쪽에 중복 피해를 주지 않는지 확인합니다.
- [터렛 피해](../turret/api-reference.md)는 EnemyHealth와 메서드 이름·반환값이 다릅니다.

## NavMesh 이동 확인 — main 38ea2595

- XY NavMesh의 시작·목표 샘플 실패와 부분 경로에서 false / null을 반환하고 정지하는지 확인합니다.
- 장애물 주위 코너 이동·도착 판정·Rigidbody2D 속도 정지와 이동 표적의 재탐색 호출 주기를 확인합니다.
- 몸통·목표 Collider 표면 거리, 목표 방향별 활성 Collider, Trigger 제외와 공격 직전 바라보는 방향을 확인합니다.
- Spawn된 서버의 FixedUpdate만 AI를 진행하고 Client는 중복 이동·피해를 실행하지 않는지 확인합니다. Host/Client 공격 방향 표시도 확인합니다.

이 문서 작업은 공개 계약 정적 대조이며 Unity NavMesh Bake·Test Runner·실제 이동을 실행한 기록이 아닙니다.

NGO PoC 코드의 존재는 출시 협동 모드 지원의 확정을 뜻하지 않습니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
