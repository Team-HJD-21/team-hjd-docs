---
title: 타깃 제공과 선택
---

# 타깃 제공과 선택

**기준:** main `b73e0e76` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/TurretTargetableAdapter.cs`.

## 타깃 제공 계약

`ITargetable`은 `TargetTransform`, `TargetType`, `HealthRatio`, `FirepowerRatio`, `CanBeTargeted`를 제공합니다. Enemy가 다른 영역의 체력 필드를 직접 수정하는 계약이 아닙니다.

터렛에는 `TurretTargetableAdapter`가 registry snapshot을 읽어 `TargetableComponent`에 전달합니다. 등록된 터렛이 활성 상태이고, 파괴되지 않고, HP가 양수일 때 선택 대상이 됩니다. `IsOperational`과 동일한 판정이 아니므로 과열 중이라도 활성 상태이면 대상이 될 수 있습니다.

화력 비율은 현재 Inspector의 임시 `_fakeFirepowerRatio`입니다. `EffectiveDamage`를 이용한 정식 AI 위협 점수로 완성됐다고 표시하지 않습니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
