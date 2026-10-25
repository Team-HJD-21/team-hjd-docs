---
title: Enemy 빠른 시작
---

# Enemy 빠른 시작

**기준:** main `789f5b44` · **영역:** 조수빈 · **원본:** `Assets/Scripts/Features/Enemy/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 빠른 시작

1. Scene에 NGO NetworkManager와 `EnemySpawnExecutor`를 준비하고 Host/Server로 실행합니다.
2. Executor의 Enemy catalog·분대 프리셋·자식 SpawnPoint를 구성합니다.
3. 스폰할 Prefab의 `NetworkObject`, `EnemyController`, `EnemyAIBrain`, `EnemyNetworkController`를 확인합니다. 피해 대상에는 `EnemyHealth`도 필요합니다.
4. Player/Turret에 유효한 `TargetableComponent`를 연결합니다.
5. Enemy 생성과 추적 목록은 Executor를 통해 관리합니다. 단순 Instantiate만으로 NGO 적 생성이 완료되지 않습니다.

## NavMesh 이동 준비 — main 38ea2595

#534의 현재 경로는 `Assets/Scripts/Features/Enemy/Routing/EnemyNavMeshPathfinder.cs`와 `Monster/EnemyController.cs`입니다.

- 이동할 XY 평면에 맞는 NavMesh와 연결된 보행 영역을 준비합니다. 경로 래퍼는 시작·목표의 Z를 0으로 두고 반경 3 안에서 NavMesh 위치를 찾습니다.
- Enemy에는 Rigidbody2D·Animator와 활성 비 Trigger 몸통 Collider를 준비합니다. 이동은 Transform 직접 이동 대신 Rigidbody2D.linearVelocity를 사용합니다.
- EnemyNetworkController는 Spawn 완료된 서버에서만 FixedUpdate로 AI를 실행합니다. 독립 테스트 드라이버를 네트워크 AI와 중복 실행하지 않습니다.
- 목표 전달은 `EnemyController.SetTarget(Transform)`으로 합니다. 경로 계산 실패 또는 경로 소진 시 이동을 멈추며 직선 추적 폴백을 보장하지 않습니다.

[경로 계산·공격 거리 계약](targeting.md#navmesh-경로와-공격-거리)과 [실행 확인 항목](testing.md)을 확인하세요.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
