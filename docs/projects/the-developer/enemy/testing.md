---
title: Enemy 검증과 제한 사항
---

# Enemy 검증과 제한 사항

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 검증 체크

- Host와 Client 호출을 분리해 확인합니다. EnemyHealth 자체는 권한을 검사하지 않으므로 호출 측의 서버 검사를 확인합니다. Initialize 전·Deactivate 후에는 피해가 무시되는지 확인합니다. Died·DeathConfirmed와 Despawned를 통한 사망·추적 해제가 중복되지 않는지 확인합니다.
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


## 능력 구조·Stage 1 변형 확인 — main 1a03e9a9

공통 EnemyRoot → 이동/능력 기반 → Runtime 프리팹 연결과 catalog의 실제 참조를 확인합니다. AssignTarget 후 이동/정지, 능력 조건과 쿨타임 분리, 원거리 발사 Animation Event의 1회 실행, 비활성화 시 예약 취소, 폭발 제거 요청과 서버 Despawn, 탄환의 유효 서버 생성·충돌 중복 방지를 별도로 확인하세요.

검증용 프리팹을 Runtime catalog로 오인하지 않고, 능력·투사체 테스트 코드가 있다는 이유로 네트워크 전체·밸런스·실제 두 프로세스 플레이를 인수 완료로 표시하지 않습니다. 이번 문서 동기화는 Unity 시험을 실행하지 않았습니다.
