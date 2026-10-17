---
title: 임시 터렛 스킬
---

# 임시 터렛 스킬

**기준:** 게임 main `20ca65d1` (#529) · **영역:** 이영빈 · **원본:** `Docs/architecture/player-skill-review.md`, `Assets/Scripts/Features/Player/PlayerSkills/`.

## 임시 터렛 스킬

`PlayerTurretSkill`의 조회 값은 `CurrentCooldownTimer`, `SkillCooldown`, `IsCooldown`입니다. 소환 메서드는 private이므로 외부에서 public `DeployTurret()`을 호출하는 예제를 만들지 않습니다.

Prefab에 `TemporaryTurret`을 구성하고 Q 입력으로 검증합니다. 현재 Manager가 있으면 대화·일시정지·비웨이브 상태에서 차단하지만, Manager가 없으면 허용하는 폴백이 있습니다.

이 스킬은 [전력 기반 TurretBase](../turret/index.md)의 일반 건설 API가 아닙니다. 정식 건설 기능·최종 스킬 밸런스로 혼동하지 마세요.

## 임시 터렛 설치 판정

`PlayerTurretPlacementRules.Evaluate`는 `Allowed`, `GroundUnavailable`, `InvalidFootprint`, `OutsideGround`, `OverlapsTurret`, `BlockedByObstacle` 결과로 설치 가능 여부와 실패 원인을 구분합니다. 기존 `CanPlace`는 `Allowed`인지 bool로 확인하는 편의 API입니다. `PlayerTurretSkill`은 판정에 성공한 뒤에만 보유 수량을 차감하고 생성하므로 거부된 배치는 수량과 설치 쿨타임을 소모하지 않습니다.

바닥 판정은 프리팹 루트 SpriteRenderer의 외형 bounds와 Collider가 있는 지면 타일을 기준으로 합니다. Core 지역 Grid나 터렛 해금 구역은 지형 검사로 사용하지 않습니다. HUD는 실패 이유를 잠시 표시하지만, 배치 판정은 별도 API에서 수행합니다. API 설명은 main `20ca65d1` 기준이며 실제 맵에서 경계·장애물·회수 후 재설치는 게임 실행으로 별도 확인해야 합니다.

[Core 명령과의 차이](../core.md) · [통합 체크리스트](../integration.md)

[Player — 입력·전투·피해 목차](../player.md) · [통합 체크리스트](../integration.md)
