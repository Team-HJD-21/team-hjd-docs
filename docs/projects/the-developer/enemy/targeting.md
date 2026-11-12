---
title: 타깃 제공과 선택
---

# 타깃 제공과 선택

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 타깃 제공

`ITargetable`은 TargetTransform·TargetType·HealthRatio·FirepowerRatio·CanBeTargeted를 제공합니다. `DamageableTargetAdapter`가 IDamageableTarget을 읽어 TargetableComponent에 투영합니다. CU는 생존 중, 무기 터렛은 생존하고 잠금 해제 상태라면 OFF여도 대상 후보입니다. `DamageableTargetAdapter`는 `IsLocked`를 확인합니다.

FirepowerRatio는 호환 이름이며 현행 DpsPerPower 값입니다. 유효 공격력 × 발사율 × 발사당 최대 탄환 수 / 전력을 계산하고 전력 0/CU는 0입니다. 0–1 비율, 실제 명중률·폭발 총 피해와 구분합니다. 자동 활성화의 공격력/전력 동점 비교값과도 다릅니다.

## AssignTarget과 행동

`EnemyController`는 공통 참조·`AssignTarget(Transform)`·`ExecuteBehavior`를 가진 추상 기반입니다. AssignTarget은 Targeting을 갱신한 뒤 하위 OnTargetChanged를 호출합니다. `MovingEnemyController`가 실제 이동 목적지/경로를 갱신하며 null 대상은 해제합니다. 이전 `SetTargetAndDestination` 호출은 AssignTarget으로 옮깁니다.

MovingEnemyController는 능력 실행 중이거나 CheckCondition이 참이면 정지하고 능력을 시도합니다. 조건은 쿨타임과 독립적이어서 조건 충족 중 쿨타임 대기도 정지 상태일 수 있습니다. 대상·경로가 없으면 정지하고, 이동은 EnemyMovement의 Rigidbody2D 경로를 사용합니다. Spawn된 서버 드라이버가 FixedUpdate 행동을 실행합니다.

## 거리·경로·능력 확장

기존 EnemyNavMeshPathfinder는 XY/Z0에서 유효한 전체 경로를 반환하며 실패 bool을 처리해야 합니다. 표적 이동/지형 변경의 재탐색은 실제 AssignTarget/이동 경로 갱신 주기를 확인합니다.

능력 공통 기반 `EnemyAbility`는 CheckCondition·TryUse·IsExecuting과 protected Activate를 분리합니다. CheckCondition은 위치/상태, TryUse는 활성·실행 중·쿨타임·조건을 검사하고 Activate 성공 때만 공통 쿨타임을 시작합니다. 근접 능력은 실제 Collider 표면 거리를 사용하고 유효 TargetableComponent와 양수 피해를 요구합니다. 몸통을 명시 연결한 경우와 자동으로 비 Trigger 몸통을 찾는 경우를 구분하세요.

이전 EnemyCombat/EnemyAttack/EnemyCloseRangeAttack을 새 능력 구조에 중복 연결하지 않습니다. [현재 능력·투사체 API](api-reference.md)를 확인하세요. 정적 구조 확인은 실제 AI·네트워크 플레이·밸런스 검증이 아닙니다.

## 분대의 타깃 전환과 공격 인원

`EnemySquad`는 타깃 불가 알림을 받으면 기존 배정을 해제하고 즉시 다시 검색합니다. 후보가 없으면 활성 구성원의 기존 행동 갱신에서 `RefreshTarget()`으로 0.5초마다 재시도합니다. `EnemyPlayerSensor`로 감지한 유효 플레이어를 우선하며, 기존 플레이어가 유효하면 유지합니다.

`ITargetable.MaxAttackers`와 `AssignedAttackerCount`로 한도와 현재 배정을 읽습니다. `TryAssignAttackers(count)`는 유효한 타깃에 남은 자리가 있을 때 양수 인원을 배정합니다. 호출자는 타깃 교체·이탈 시 `UnassignAttackers(count)`로 자신의 배정을 반환합니다. `EnemyDefinition.IsIncludedInAttackerLimit`가 꺼진 몬스터는 분대 타깃을 공유하면서 인원 집계에서 빠집니다. 현재 BomberSlime이 이 설정을 사용합니다.

서버 생성·복원 호출부는 `SetSimulationMatch`를 `NetworkObject.Spawn` 전에 호출합니다. NGO 값은 `OnNetworkSpawn` 이후 서버가 반영하고 Client는 초기 Spawn 자료를 읽습니다.
