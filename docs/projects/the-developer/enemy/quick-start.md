---
title: Enemy 빠른 시작
---

# Enemy 빠른 시작

**기준:** main `b73e0e76` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/TurretTargetableAdapter.cs`.

## 빠른 시작

1. Scene에 NGO NetworkManager와 `EnemySpawnExecutor`를 준비하고 Host/Server로 실행합니다.
2. Executor의 Enemy catalog·분대 프리셋·자식 SpawnPoint를 구성합니다.
3. 스폰할 Prefab의 `NetworkObject`, `EnemyController`, `EnemyAIBrain`, `EnemyNetworkController`를 확인합니다. 피해 대상에는 `EnemyHealth`도 필요합니다.
4. Player/Turret에 유효한 `TargetableComponent`를 연결합니다.
5. Enemy 생성과 추적 목록은 Executor를 통해 관리합니다. 단순 Instantiate만으로 NGO 적 생성이 완료되지 않습니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
