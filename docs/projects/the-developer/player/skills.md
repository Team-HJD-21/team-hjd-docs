---
title: 임시 터렛 스킬과 HUD 연동
---

# 임시 터렛 스킬과 HUD 연동

**기준:** 게임 main `6b4310dc` (#549, 2026-10-24) · **영역:** 이영빈 · **원본:** `Docs/architecture/player-skill-review.md`, `player-skill-hud-api.md`와 `Assets/Scripts/Features/Player/PlayerSkills/`의 공개 계약.

## 선택과 실행 계약

Q/E는 PlayerSkillController의 `Loadout.Q` / `Loadout.E`에 선택한 스킬을 실행합니다. `TryUse(PlayerSkillId)`는 CanUse와 Loadout 포함 여부를 검사합니다. 공통 `PlayerSkillBase.TryUseSkill()`도 활성 상태·프리팹·수량·쿨타임·조작 가능 상태를 확인합니다.

| 조회 / 요청 | 사용 |
| --- | --- |
| `CanPrepare`, `CanUse`, `CanRecover` | 선택 준비·사용·회수의 허용 조건을 각각 확인 |
| `TrySelect`, `ClearSelection`, `Loadout.Changed` | 선택 변경과 표시 갱신 |
| `SkillCount`, `IsSkillReady`, `RemainingCooldown`, `CooldownProgress` | 슬롯 수량과 남은 시간 조회 |
| `IsPlacingTurret`, `PlacementHint`, `TurretPlacementFeedback` | 설치 미리보기와 안내·실패 결과 조회 |
| `BarrierPlacementHint` | 기존 방벽 안내 호출과의 호환용 속성 |

임시 터렛은 `PlayerSkillId.TemporaryTurret`으로 요청합니다. 수락은 미리보기 진입이며 즉시 생성됐다는 뜻이 아닙니다. 외부 public DeployTurret()을 가정하지 않습니다. 이 스킬은 [전력 기반 TurretBase](../turret/index.md)의 일반 건설·지역 해금 계약과 구분합니다.

## 임시 터렛 설치 미리보기

PlayerTurretSkill.HasPrefab은 TemporaryTurret을 가진 본체와 정상 구성된 PlayerTurretPlacementPreview를 모두 요구합니다. 미리보기는 시각 전용이며 체력·충돌·발사·적 타깃 등록을 하지 않습니다.

1. 선택 스킬의 Q/E로 미리보기에 진입합니다. 이때 수량·설치 쿨타임은 소모하지 않습니다.
2. Player 중심 3×3 격자의 가운데를 제외한 8칸 중 마우스 방향의 한 칸을 고릅니다. 기본 간격은 4이며 먼 커서도 인접 칸을 사용합니다. Player 이동을 추적하고 정렬 Z를 유지하며 월드 Tilemap 셀에 고정하지 않습니다.
3. 왼쪽 클릭으로 확정합니다. UI 위 클릭은 무시하고 LateUpdate에서 처리해 일반 터렛 선택과 같은 클릭이 중복 실행되지 않게 합니다.
4. 우클릭·Escape·같은 스킬 키로 취소합니다. 선택창 열기·다른 스킬·행동 불가·장착 해제·Player 비활성화도 취소합니다.

`GetPlacementPosition(Vector2 pointerPosition)`은 커서 월드 위치로 후보를 계산합니다. `TryConfirmPlacement(Vector3 pointerPosition)`은 후보를 다시 계산하고 전체 판정에 성공한 경우에만 수량을 차감하고 쿨타임을 시작합니다. `CancelPlacement()`는 생성 없이 미리보기를 정리합니다.

미리보기 지면·충돌 검사는 0.05초 간격이지만 확정 시 Physics2D Transform 동기화와 전체 판정을 다시 수행합니다. 불가 위치를 클릭하면 미리보기를 유지하며 수량·쿨타임을 소모하지 않습니다.

## 설치 판정과 회수

`PlayerTurretPlacementRules.Evaluate(prefab, position, player, ground)`는 아래 결과를 반환합니다. CanPlace는 Allowed 여부만 반환하는 편의 API입니다.

| 결과 | 의미 |
| --- | --- |
| `Allowed` | 설치 가능 |
| `GroundUnavailable` / `InvalidFootprint` | 유효한 같은 씬 지면 또는 바닥 bounds가 없음 |
| `OutsideGround` | 바닥이 맵 밖이나 빈 지면 타일에 걸침 |
| `OverlapsTurret` / `BlockedByObstacle` | 다른 포탑 본체 또는 일반 장애물과 겹침 |
| `OverlapsPlayer` / `OverlapsEnemy` | 설치자·다른 Player 또는 Enemy 몸이 점유함 |

캐릭터 결과 두 개는 enum 끝에 추가돼 기존 값은 유지합니다. 바닥 공간은 루트 SpriteRenderer와 BoxCollider2D 중 더 넓은 bounds를 포함합니다. Core 지역 Grid·터렛 해금 구역은 지형 판정으로 사용하지 않습니다.

Player·Enemy 몸과 터렛 본체는 충돌 행렬에서 제외돼 있어도 점유 판정에 포함합니다. 자식 Collider의 태그만 믿지 않고 부모 컴포넌트와 레이어도 확인합니다. Trigger·탄환 레이어는 제외하고 일반 지형에는 기존 충돌 설정을 적용합니다.

F 회수는 본인이 설치한 살아 있는 임시 터렛과의 XY 거리를 사용합니다. 기본 2.5는 중심이 아닌 Collider 표면까지의 거리이며 정렬 Z를 제외합니다. `TryRecoverNearest()` / `RecoverableTurret`를 사용하고 설치 중·선택창 등 회수 제한을 확인합니다. 임시 터렛의 수량·손상 재충전과 일반 터렛의 Repair(int)를 같은 수리 계약으로 취급하지 않습니다.

미리보기 중 최신 실패는 PlacementFeedback으로 유지되고 성공·취소·비활성화 시 지워집니다. HUD는 실패 이유를 우선 표시하고 회수 안내를 숨깁니다.

## 씬이 소유하는 스킬 HUD

`Assets/Prefabs/UI/PlayerSkillHUD.prefab`을 씬 루트에 준비합니다. Initial_Stage와 PlayerTest에 배치된 구성이며 Player 프리팹은 HUD 자식이나 HUD 프리팹 참조를 소유하지 않습니다. 런타임 UI 생성용 PlayerSkillHudFactory / PlayerSkillUiFactory는 제거됐습니다.

| 연결 API | 책임 |
| --- | --- |
| `PlayerSkillHudSceneBinding.BindLocalPlayer(PlayerSkillController player)` | 권장 명시적 연결. 같은 씬·로컬 소유자 조건 검사 |
| `PlayerSkillController.BindHud(hud)` | 활성·같은 씬·필수 참조를 검사하는 내부 통합·테스트용 진입점. 로컬 판정은 바인더 책임 |
| `DetachHud(hud)` / `PlayerSkillHud.Unbind()` | 이전 구독·버튼 리스너·양방향 참조 해제 |
| `PlayerSkillHud.IsConfigured` | Q/E 슬롯·선택창과 필수 쿨타임 마스크 검사 |
| `IsFullyConfigured` | 툴팁·회수/설치 안내·아이콘까지 포함한 전체 프리팹 검사 |

미연결 바인더는 기본 0.25초 간격의 일시정지와 무관한 시간으로 활성 Player를 찾습니다. 연결 후에는 매 프레임 전체 Player를 탐색하지 않습니다.

- 다른 씬·비활성 Player는 제외합니다. NetworkObject가 있으면 Spawn 완료와 IsOwner를 모두 요구합니다.
- PlayerActorIdentity가 있으면 Local Player Id와 일치해야 합니다. 현재 기본값은 `local-player`입니다.
- 둘 다 없는 테스트 Player는 같은 씬에 후보가 하나일 때만 임시 연결하고 이후 명시적인 로컬 소유자를 우선합니다.
- Player/HUD 비활성화 때 창·안내·구독·참조를 정리합니다. 씬의 HUD와 Controller Loadout 선택 데이터는 삭제하지 않습니다.

필수 참조 누락은 연결을 거부합니다. 툴팁·아이콘·회수/설치 안내 같은 보조 참조는 해당 기능만 생략하고 정상 선택·슬롯 기능은 유지합니다. 없는 UI를 실행 중 만들거나 Inspector 레이아웃·폰트를 재구성하지 않습니다.

선택 카드·이름은 창 열기·Loadout 변경 때 갱신하고 닫힌 선택창은 갱신하지 않습니다. 슬롯 쿨타임·사용 가능 상태와 포인터·회수 위치는 현재 상태를 추적합니다. 씬에는 활성 EventSystem과 입력 모듈 하나를 별도로 준비해야 하며 HUD가 생성해 주지 않습니다.

HUD 소유자 선택은 서버 권한이나 스킬 실행 RPC를 추가하지 않습니다. 실제 씬·마우스 조작·재연결은 [검증 안내](testing.md)를 따릅니다.

[Core 명령과의 차이](../core.md) · [Player 목차](../player.md) · [통합 체크리스트](../integration.md)
