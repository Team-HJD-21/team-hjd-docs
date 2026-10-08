---
title: 터렛 스냅샷과 상태 동기화
---

# 터렛 스냅샷과 상태 동기화

기준: CBC main `eb35ceb1`. `TurretSnapshot`은 조회 시점의 값입니다. 보관한 스냅샷이 자동으로 갱신되거나 네트워크 동기화되지는 않습니다.

## 조회 계약

| API | 용도 |
| --- | --- |
| `TryGetSnapshot(int id, out TurretSnapshot snapshot)` | 단일 터렛 값 조회; 사라진 ID는 false |
| `GetAllSnapshots()` | 등록된 전체 터렛 |
| `GetActiveSnapshots()` | 활성화된 터렛 |
| `GetOperationalSnapshots()` | 실제 작동 가능한 터렛 |
| `TryGetInstanceId(Transform child, out int id)` | 자식 Transform에서 부모 터렛의 ID 찾기 |
| `TryGet(int id, out TurretBase turret)` | 명령을 보낼 실제 컴포넌트 조회 |

`GetAll`, `GetActive`, `GetOperational`은 컴포넌트 목록이며 Snapshot 버전과 다릅니다. 목록 조회는 복사/할당 비용이 있으므로 대량 호출을 매 프레임 반복하기 전에 측정하세요.

## 스냅샷 필드

`InstanceId`, `DefinitionId`, `Position`, `IsActivated`, `IsOperational`, `IsDestroyed`, `IsLocked`, `CurrentHealth`, `MaxHealth`, `EffectiveDamage`, `Range`, `EffectivePower`, `SelectedUpgradeId`, `UpgradeLevel`.

컴포넌트의 사거리는 `EffectiveRange`, 스냅샷 필드는 **`Range`**입니다. `TheoreticalDps`와 `DpsPerPower`도 제공하며 과열·명중률·폭발 다중 피해를 제외한 이론값입니다. `TurretControllerSnapshot`은 컨트롤러 집계이며 개별 터렛 스냅샷과 다릅니다.

## 구독은 재조회 신호로 사용

```csharp
using System;
using TeamHJD.Game.Turrets;

public sealed class TurretSnapshotObserver : IDisposable
{
    private readonly Action<int, TurretSnapshot?> _render;

    public TurretSnapshotObserver(Action<int, TurretSnapshot?> render)
    {
        _render = render ?? throw new ArgumentNullException(nameof(render));
        TurretInstanceRegistry.SnapshotChanged += Refresh;
        foreach (var snapshot in TurretInstanceRegistry.GetAllSnapshots())
            _render(snapshot.InstanceId, snapshot);
    }

    private void Refresh(int id)
    {
        if (TurretInstanceRegistry.TryGetSnapshot(id, out var snapshot))
            _render(id, snapshot);
        else
            _render(id, null); // 등록 해제: UI 항목/타깃 제거
    }

    public void Dispose()
        => TurretInstanceRegistry.SnapshotChanged -= Refresh;
}
```

수명 주기가 끝날 때 반드시 Dispose하세요. 정적 이벤트이므로 씬 객체를 계속 잡아둘 수 있습니다. 이벤트 이후에도 조회 실패를 정상적인 제거로 처리해야 합니다.

:::warning 위치와 ID 수명
Transform 이동만으로 `SnapshotChanged`가 발생하지는 않습니다. 이동하는 대상의 위치가 필요하면 적절한 주기로 재조회하거나 Battlefield의 동적 위치 입력을 사용하세요. ID는 현재 런타임용이며 저장 파일·다른 세션에서 영구 식별자로 쓰지 않습니다.
:::

적 타깃 연결은 [Enemy 가이드](../enemy.md)의 `DamageableTargetAdapter` 규칙을 함께 확인하세요.
