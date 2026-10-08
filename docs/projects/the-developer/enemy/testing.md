---
title: Enemy 검증과 제한 사항
---

# Enemy 검증과 제한 사항

**기준:** main `eb35ceb1` · **영역:** 조수빈 · **원본:** `Assets/PoC/Enemy/Scripts/Spawning/`, `Monster/EnemyHealth.cs`, `Targeting/ITargetable.cs`, `Targeting/DamageableTargetAdapter.cs`.

## 검증 체크

- Host와 Client 호출을 분리해 확인합니다.
- 분대 계획 수와 Executor 실제 생성 수를 비교합니다.
- 타깃이 파괴/비활성/제거되면 다시 유효한 대상을 선택하는지 확인합니다.
- [Player 탄환](../player.md)이 EnemyHealth와 Monster 양쪽에 중복 피해를 주지 않는지 확인합니다.
- [터렛 피해](../turret/api-reference.md)는 EnemyHealth와 메서드 이름·반환값이 다릅니다.

NGO PoC 코드의 존재는 출시 협동 모드 지원의 확정을 뜻하지 않습니다.

[Enemy / Encounter — 스폰·타깃·피해 목차](../enemy.md) · [통합 체크리스트](../integration.md)
