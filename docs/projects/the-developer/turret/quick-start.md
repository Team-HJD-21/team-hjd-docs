---
title: 터렛 빠른 시작
---

# 터렛 빠른 시작

기준: CBC main `b73e0e76`. 이미 씬에서 초기화되고 등록된 터렛을 사용하는 외부 호출 예제입니다. 이 예제가 터렛 프리팹·정의·전력 공급원을 생성하거나 연결해 주지는 않습니다.

## 1. ID로 찾고 활성화 요청하기

```csharp
using TeamHJD.Game.Turrets;
using TeamHJD.Game.Turrets.Contracts;

public static class TurretCommands
{
    public static bool TryTurnOn(int instanceId)
    {
        if (!TurretInstanceRegistry.TryGet(instanceId, out var turret))
            return false; // 제거되었거나 아직 등록되지 않은 ID

        var result = turret.RequestActivation(true);
        return result == TurretActivationResult.Activated
            || result == TurretActivationResult.Unchanged;
    }
}
```

`Unchanged`는 요청한 활성화 상태와 이미 같다는 뜻입니다. 공격 가능 여부까지 의미하지는 않습니다. 실제 작동 여부는 `IsOperational`을 확인하세요.

전력 부족·잠금·파괴 등 실패 이유를 UI에 보여줄 때는 bool로 축약하지 말고 `TurretActivationResult`를 그대로 분기하세요. 활성화 전에 `TryConsumePower`를 직접 호출하면 중복 차감할 수 있습니다.

## 2. 끄기 / 조회

```csharp
using TeamHJD.Game.Turrets;

public static void TurnOff(int instanceId)
{
    if (TurretInstanceRegistry.TryGet(instanceId, out var turret))
        turret.RequestActivation(false);
}

public static bool CanOperate(int instanceId)
{
    return TurretInstanceRegistry.TryGetSnapshot(instanceId, out var snapshot)
        && snapshot.IsOperational;
}
```

위 메서드는 호출 측 클래스 안에 넣습니다. 씬 전환 후 예전 ID가 여전히 유효하다고 가정하지 마세요.

## 3. 씬 연결 전제

- 구체 터렛 프리팹에 `TurretDefinition`과 필요한 렌더러·타깃 탐색 참조를 연결합니다.
- 구체 터렛 초기화가 `ConfigureActivation(ITurretPowerSource)`을 성공시켜야 합니다. 이 메서드는 protected이며 일반 UI가 호출하는 API가 아닙니다.
- 외부에서는 등록된 ID 또는 실제 컴포넌트 참조를 받습니다. `TurretBase`는 abstract이므로 직접 인스턴스화하지 않습니다.
- 초기화를 생략한 활성화 요청은 `PowerSourceUnavailable`이 될 수 있습니다.
- 전력 공급자는 `TeamHJD.Game.Turrets.Contracts.ITurretPowerSource`를 구현합니다. 소비·해제·예약 변경을 같은 기준으로 처리해야 합니다.

다음: [API 사용법](api-reference.md) → [스냅샷 구독](snapshots.md)
