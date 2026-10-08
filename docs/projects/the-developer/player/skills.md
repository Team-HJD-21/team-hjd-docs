---
title: 임시 터렛 스킬
---

# 임시 터렛 스킬

**기준:** main `eb35ceb1` · **영역:** 이영빈 · **원본:** `Assets/Scripts/Player_V2/`, `Assets/PoC/Core/Presentation/Scene/PlayerSceneAdapter.cs`.

## 임시 터렛 스킬

`PlayerTurretSkill`의 조회 값은 `CurrentCooldownTimer`, `SkillCooldown`, `IsCooldown`입니다. 소환 메서드는 private이므로 외부에서 public `DeployTurret()`을 호출하는 예제를 만들지 않습니다.

Prefab에 `TemporaryTurret`을 구성하고 Q 입력으로 검증합니다. 현재 Manager가 있으면 대화·일시정지·비웨이브 상태에서 차단하지만, Manager가 없으면 허용하는 폴백이 있습니다.

이 스킬은 [전력 기반 TurretBase](../turret/index.md)의 일반 건설 API가 아닙니다. 정식 건설 기능·최종 스킬 밸런스로 혼동하지 마세요.

[Core 명령과의 차이](../core.md) · [통합 체크리스트](../integration.md)

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
