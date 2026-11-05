---
title: Enemy 빠른 시작
---

# Enemy 빠른 시작

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

1. Scene에 NGO NetworkManager와 EnemySpawnExecutor, 실제 catalog·분대 preset·SpawnPoint를 준비합니다. 정식 네트워크 생성은 Spawn된 Host/Server에서 수행합니다.
2. 공통 `Assets/Prefabs/Enemies/Base/EnemyRoot.prefab`을 기반으로 NetworkObject·체력·Targeting·Animation·서버 수명 참조를 확인합니다.
3. 이동형은 MovingEnemyController·EnemyMovement와 실제 EnemyAbility를 연결합니다. MeleeEnemy 기반에는 EnemyCloseRangeAbility, 원거리/폭발형은 각 능력과 발사/Animation Event 참조가 필요합니다.
4. Runtime catalog의 실제 프리팹 경로를 확인합니다. `Runtime/Melee/Slime.prefab`과 예전 `Runtime/Slime.prefab`, Testing 프리팹은 같은 연결이 아닙니다.
5. Player/Turret에 유효한 TargetableComponent를 연결하고 NavMesh·Rigidbody2D·몸통 Collider를 확인합니다. 생성·추적·Despawn은 Executor/서버 수명으로 관리합니다.

EnemyController는 추상 기반이며 타깃 전달은 AssignTarget입니다. 능력 조건·공통 쿨타임·실행 중 상태와 네트워크 사망/제거를 구분합니다. 단순 Instantiate나 테스트 파일의 존재로 NGO 전체 생성·Stage 1 밸런스·실제 두 프로세스 플레이가 검증됐다고 설명하지 않습니다.

[스폰·능력 API](api-reference.md) · [타깃과 이동](targeting.md) · [Enemy 목차](../enemy.md)
