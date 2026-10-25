---
title: 타깃 제공과 선택
---

# 타깃 제공과 선택

**기준:** main `789f5b44` · **영역:** 조수빈 · **원본:** `Assets/Scripts/Features/Enemy/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 타깃 제공 계약

`ITargetable`은 `TargetTransform`, `TargetType`, `HealthRatio`, `FirepowerRatio`, `CanBeTargeted`를 제공합니다. Enemy가 다른 영역의 체력 필드를 직접 수정하는 계약이 아닙니다.

`DamageableTargetAdapter`는 부모의 `IDamageableTarget`에서 체력·파괴 상태를 읽어 `TargetableComponent`에 전달합니다. 무기 터렛은 활성 상태이고 생존할 때, CU는 생존하는 동안 선택 대상입니다. CU는 터렛 Registry와 전력 예약에 포함되지 않습니다. 과열 중이라도 활성 무기 터렛은 대상이 될 수 있습니다.

`FirepowerRatio`는 호환 이름이며 실제 값은 `DpsPerPower`입니다. 이론 DPS는 유효 공격력 × 초당 발사 횟수 × 발사당 최대 탄환 수입니다. 전력 0과 CU의 효율은 0이며 과열·명중률·폭발 다중 피해는 제외합니다. 0~1 범위로 제한하지 않습니다.

## NavMesh 경로와 공격 거리

**추가 기준:** main `38ea25959be48810b1a68427524a09861c12460a` (#534) · **원본:** `Assets/Scripts/Features/Enemy/Routing/EnemyNavMeshPathfinder.cs`, `Monster/EnemyController.cs`, `Networking/EnemyNetworkController.cs`, `EnemyNetworkAnimator.cs`.

| 공개 API / 실행 경계 | 계약 |
| --- | --- |
| `EnemyNavMeshPathfinder.TryCalculatePath(Vector3 start, Vector3 target, out Vector3[] corners)` | bool. 시작·목표의 Z를 0으로 두고 반경 3, AllAreas로 SamplePosition 후 완전한 경로만 허용 |
| 실패 반환 | 샘플 실패·부분/무효 경로는 false와 null corners. 호출 측이 실패를 처리 |
| `EnemyController.SetTarget(Transform)` | 목표 Collider 목록과 경로 인덱스를 다시 설정하고 현재 목표 위치까지 경로 계산. null이면 목표·경로 해제 |
| `EnemyNetworkController` | Spawn된 서버만 FixedUpdate에서 EnemyAIBrain.UpdateAI 실행 |

EnemyController는 도착한 코너를 건너뛰고 다음 코너 방향으로 Rigidbody2D 속도를 설정합니다. 경로가 없거나 소진되면 정지합니다. 경로 계산은 SetTarget 호출 때 수행하므로 이동 표적·지형 변경의 재탐색은 실제 호출 주기로 확인해야 하며 자동 NavMeshAgent 재계산 계약으로 해석하지 않습니다.

공격 거리는 Transform 중심이 아니라 Enemy의 비 Trigger 몸통과 목표 자식의 활성·활성화된 비 Trigger Collider 사이 거리입니다. 몸통 참조가 없으면 범위 판정은 실패합니다. 공격 시 목표 쪽을 바라보고 EnemyNetworkAnimator는 서버 공격 RPC에 방향 값을 함께 전달합니다. 이 변경이 타깃 점수·권한·스폰 계약을 새로 완성한 것은 아닙니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
