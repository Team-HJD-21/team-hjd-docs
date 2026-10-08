---
title: 명시적 터렛 생성·초기화
---

# 명시적 터렛 생성·초기화

기준: 게임 main `eb35ceb1` · 원본: `Docs/architecture/turrets/initialization.md`.

`TurretInitializationData`는 새 게임이나 향후 로드 경로에서 사용할 해석된 생성 입력입니다. 조회용 `TurretSnapshot`이나 파일 저장 형식이 아닙니다.

```csharp
var initial = TurretInitializationData.CreateDefault(
    canonPrefab.Definition,
    isLocked: false,
    shouldActivate: true);

TurretBase turret = TurretFactory.Create(
    canonPrefab,
    initial,
    controller,
    position,
    rotation,
    parent);
```

로드된 값을 적용할 때도 같은 생성 경로를 사용합니다.

```csharp
var initial = new TurretInitializationData(
    prefab.Definition,
    currentHealth: 37,
    isLocked: false,
    shouldActivate: true,
    damageBonus: 0,
    upgrade: resolvedUpgrade,
    upgradeLevel: 2);
```

- Definition은 선택한 프리팹과 일치해야 합니다.
- 체력 0은 파괴 상태이며 자동 복구하지 않습니다.
- 상태는 비활성 객체에서 첫 `Awake` 전에 준비합니다.
- `ShouldActivate`는 의도이며 전력 예약 성공 보장이 아닙니다.
- 초기화 직후 명시적인 ON/OFF, 잠금 또는 비활성화는 대기 중인 초기 활성화를 취소합니다.
- 체력과 업그레이드를 적용한 뒤 전력 비용을 계산합니다.
- 기존 Scene/Prefab 직접 배치도 초기 상태 적용 → 등록 → 초기 활성화 순서로 동작합니다.

새 비활성 인스턴스를 직접 조립하는 소비자는 `PrepareInitialization(data, source)`를 한 번 호출한 뒤 활성화할 수 있습니다. 기본 경로는 `TurretFactory.Create`입니다. 현재 Canon/Missile은 이 계약을 따르며 기존 Laser는 지원하지 않습니다.

`CopyForLevelChange`는 승급·강등 상태 이전, `Restore()`는 파괴 터렛 수리, `Initialize(data)`는 생성 입력 적용입니다. 서로 대체하지 않습니다.

JSON 저장, 슬롯·버전·마이그레이션, 영구 ID, Research/Profile 해금, 전체 Match 복원은 아직 포함하지 않습니다.

