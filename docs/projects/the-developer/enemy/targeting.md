---
title: 타깃 제공과 선택
---

# 타깃 제공과 선택

**기준:** main `eb35ceb1` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 타깃 제공 계약

`ITargetable`은 `TargetTransform`, `TargetType`, `HealthRatio`, `FirepowerRatio`, `CanBeTargeted`를 제공합니다. Enemy가 다른 영역의 체력 필드를 직접 수정하는 계약이 아닙니다.

`DamageableTargetAdapter`는 부모의 `IDamageableTarget`에서 체력·파괴 상태를 읽어 `TargetableComponent`에 전달합니다. 무기 터렛은 활성 상태이고 생존할 때, CU는 생존하는 동안 선택 대상입니다. CU는 터렛 Registry와 전력 예약에 포함되지 않습니다. 과열 중이라도 활성 무기 터렛은 대상이 될 수 있습니다.

`FirepowerRatio`는 호환 이름이며 실제 값은 `DpsPerPower`입니다. 이론 DPS는 유효 공격력 × 초당 발사 횟수 × 발사당 최대 탄환 수입니다. 전력 0과 CU의 효율은 0이며 과열·명중률·폭발 다중 피해는 제외합니다. 0~1 범위로 제한하지 않습니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
