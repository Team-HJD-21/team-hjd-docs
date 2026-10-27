---
title: Turret / Power — 터렛·전력·상태
---

# Turret / Power 연동 가이드

담당: 황재동. 기준: 게임 main `56fed4c3` (2026-10-27). FieldTurret 이름 변경과 지속 수리 API는 `beea8f0d` (#547)의 코드·Docs를 대조했습니다.

맵에 배치되는 터렛은 **FieldTurret**, 플레이어가 설치하는 보조 터렛은 **TemporaryTurret / PlayerTurret**로 구분합니다. 외부 C# 연동에는 새 이름과 네임스페이스를 사용하세요.

| 이전 이름 | 현재 공개 이름 |
| --- | --- |
| `TurretBase` / `TurretController` | `FieldTurretBase` / `FieldTurretController` |
| `TurretDefinition` / `TurretRuntimeState` | `FieldTurretDefinition` / `FieldTurretRuntimeState` |
| `TurretInstanceRegistry` / `TurretFactory` | `FieldTurretInstanceRegistry` / `FieldTurretFactory` |
| `TurretSnapshot` / `TurretControllerSnapshot` | `FieldTurretSnapshot` / `FieldTurretControllerSnapshot` |
| `TurretInitializationData` / `TurretPowerBudget` | `FieldTurretInitializationData` / `FieldTurretPowerBudget` |
| `TurretUpgradeDefinition` / `TurretKind` | `FieldTurretUpgradeDefinition` / `FieldTurretKind` |
| `TurretActivationResult` / `TurretUpgradeResult` | `FieldTurretActivationResult` / `FieldTurretUpgradeResult` |
| `ITurretPowerSource` / `TurretActivationController` | `IFieldTurretPowerSource` / `FieldTurretActivationController` |
| `TowerBullet` / `TowerMissile` | `FieldTurretBullet` / `FieldTurretMissile` |
| `TeamHJD.Game.Turrets` / `.Contracts` namespace와 assembly | `TeamHJD.Game.FieldTurrets` / `.Contracts` |
| `Assets/Scripts/Features/Turrets` | `Assets/Scripts/Features/FieldTurrets` |
| `Assets/Prefabs/Turrets` / `Assets/Data/Turrets` | `Assets/Prefabs/FieldTurrets` / `Assets/Data/FieldTurrets` |

Unity 에셋의 직렬화 필드·ID와 관련 `.meta` GUID는 유지됐고 적용 가능한 Unity 타입에는 이전 메타데이터가 추가됐습니다. 게임 외부에서 직접 컴파일하는 소비자는 새 C# 타입·네임스페이스를 사용해야 합니다.

터렛은 `FieldTurretBase`를 통해 상태를 변경하고, `FieldTurretInstanceRegistry`의 `FieldTurretSnapshot`으로 외부 시스템에 상태를 전달합니다. 전력 예약은 활성화 요청 내부에서 처리합니다.

| 필요한 작업 | 읽을 문서 |
| --- | --- |
| 터렛을 찾아 켜고 끄기 | [빠른 시작](quick-start.md) |
| 생성 시 초기 체력·잠금·업그레이드 지정 | [명시적 초기화](initialization.md) |
| 피해·복구·잠금·업그레이드 | [API 사용법](api-reference.md) |
| UI와 적 AI의 조회·구독 | [스냅샷과 상태 동기화](snapshots.md) |
| 실패 결과와 연결 검증 | [검증과 제한 사항](testing.md) |
| 구현 구조와 런타임 흐름 | [전체 구조와 실행 흐름](runtime-flows.md) |

:::info 현재 제공 범위
이 문서는 main에 병합된 `FieldTurretController`, `FieldTurretPowerBudget`, `FieldTurretControllerSnapshot`, 자동 활성화 재배분, 셀 거리 기반 잠금 해금과 `IDamageableTarget` 계약을 포함합니다. 문서 빌드 검증과 Unity 플레이 검증은 별개입니다.
:::

관련 모듈: [Core](../core.md) · [Enemy](../enemy.md) · [통합 체크리스트](../integration.md)
