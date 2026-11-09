---
title: Core 호출·소유권 계약
---

# Core 호출·소유권 계약

**기준:** 게임 main `d9ea70570b40a7d8d6a4d633299d0be7d1c1502c` (#623, 2026-11-06), 공개 API 정적 대조.

Player·Turret·Enemy를 Core에 연결할 때 사용할 계약과 종료 책임입니다. 기존 `Global` 계열과의 대응은 책임을 이해하기 위한 설명이며 상속·호환 계보가 아닙니다.

| 호출자 | 사용할 계약 | 직접 하지 않을 일 |
| --- | --- | --- |
| Scene 조립부 | `IAppMatchHost.StartMatch(...)`로 세션 생성·주입 | `AppServices`를 서비스 검색기로 공개하거나 static Instance 사용 |
| Player 수명/입력 | `PlayerSceneAdapter.Bind/BindNetworkMatch/Unbind`로 수명 연결. 입력 실행은 Player Feature/Host 경계 | 삭제된 범용 Submit 호출 또는 MatchState HP를 실제 원본으로 간주 |
| Turret 입력 | `CaptureTurretLayout()` → `UpdateBattlefieldTurretLayout(...)` | `FieldTurretBase`·Transform을 Core snapshot에 보관 |
| Player·Enemy 위치 | `BattlefieldDynamicSpatialInput` → `UpdateBattlefieldParticipants(...)` | 별도 전역 Grid나 두 번째 위치 권위 모델 생성 |
| Encounter 소비자 | `BindMatch(matchId, snapshotProvider)` | Battlefield 분석 재구현 또는 과거 Match provider 재사용 |
| HUD·관측자 | `session.Events.Subscribe(...)`, `session.CreateSnapshot(sequence)` | 구독 인터페이스로 이벤트 발행 또는 상태 쓰기 |

`MatchState`는 Core의 Match 상태이며 Battlefield는 파생 분석입니다. Scene adapter가 Unity actor의 값을 투영하며, 전선 기하·셀 점유는 Core가, Spawn 정책은 Enemy/Encounter가 소유합니다.

## Command·Query·Event

- Command는 수행 의도입니다. 터렛은 `TurretCommandGateway/Service`, 스폰은 `EncounterRequestService`의 요청/결과를 사용합니다. 각 경계가 Match·실제 발신자·권한·중복을 검증합니다. 처리기가 없던 범용 Submit과 전용 타입은 제거했습니다.
- Query는 조회입니다. `MatchSession.Battlefield`의 immutable 결과를 평가 시점에 읽고 `MatchId`, `Revision`, Grid 설정을 함께 해석합니다.
- Event는 이미 발생한 사실입니다. `Subscribe`가 돌려준 `IDisposable`을 구독자가 해제합니다. 요청 수와 실제 생성·사망·제거 수를 구분합니다.

```csharp
// 조립부가 수명을 연결한다. 실제 이동/공격은 Player Feature가 처리한다.
playerAdapter.Bind(session);
// Scene/Match 종료 때 조립부가 playerAdapter.Unbind()를 호출한다.

session.UpdateBattlefieldTurretLayout(
    turretSource.CaptureTurretLayout());

encounterConsumer.BindMatch(
    session.Config.MatchId,
    () => session.Battlefield);

IDisposable subscription = session.Events.Subscribe(OnMatchEvent);
```

## 종료 책임

Scene 소유자는 `IAppMatchHost.CurrentMatchId`와 자신이 만든 ID를 비교하고 `TryEndMatch(ownedMatchId)`를 사용합니다. Encounter unbind, Player actor 정리, 소유 Match 종료 순서로 정리하고 한 소비자의 실패가 나머지 정리를 중단하지 않게 합니다.

`MatchSession.Dispose()` 이후 변경·명령 호출은 `ObjectDisposedException`입니다. 오래된 session이나 provider를 새 Match에 연결하지 않습니다.

## 아직 완성되지 않은 경계

범용 로컬 권한 객체는 제거했습니다. 실제 Host/참가자 검증은 네트워크 및 각 Feature 요청 경계가 수행합니다. main `9cf0e16b`에서 터렛 명령 gateway·논리 ID 대응·지역 및 표시 Frame 전송이 연결됐습니다. [현재 공용 터렛 계약](api-reference.md#공용-터렛-명령과-표시--main-9cf0e16b)을 따르며 원격 Player actor·실제 터렛 전투 복제는 별도입니다. `MatchRequestContext.RequestId`, 진단 `RequestId`, `NetworkObjectId`도 서로 다른 용도입니다.

Game Debugger의 수동·반복 요청은 테스트 명령입니다. 출시용 Director나 스테이지 진행 규칙으로 해석하지 않습니다. 자세한 조작법은 [Game Debugger](../../../editor-tools/the-developer/game-debugger/index.md)를 확인하세요.


## 종료 오류와 재바인딩 — main 9cf0e16b

Player adapter와 Scene은 해제 콜백 전에 이전 입력·소유 참조를 닫습니다. actor·지역·Feature·FieldTurret 정리를 끝까지 시도하고 오류를 합쳐 전달하며 설정 실패도 rollback합니다. Dispose/TryEndMatch가 오류를 던졌다고 이전 입력을 계속 사용할 수 있다는 의미는 아닙니다. 해제 도중 새 Match를 재바인딩하지 마세요. Unity/NGO 객체 제거가 프레임 끝에 확정되는 시점과 참조 해제 시점을 구분합니다.


## 기반 수명과 실제 Feature 연결 — main 1a03e9a9

App의 위치, 네트워크 준비·시작, Match 규칙 상태를 구분합니다. Initial_Stage는 실제 터렛 Match lease를 먼저 연결한 뒤 Session·공용 시간·난수·환경·actor·지역·Encounter를 조립하고, 초기화 실패 시 소유한 바인딩을 rollback합니다.

Match/Scene 종료 시 RandomConsumerScope·환경·actor·지역/터렛·입력 구독·시간 서비스를 해제합니다. 체크포인트 scope의 필수 writer 목록은 조립 계약에서 정하며 실제 등록 목록으로 자동 추정하지 않습니다. 상세한 [시간·저장·화면 API](api-reference.md#공용-시간과-예약)를 확인하세요.

현재 `EnemySpawnExecutor`와 `FieldTurretController`는 `IRandomConsumer`·`IFieldSimulationConsumer`를 구현합니다. `WeatherManager`는 `IMatchScheduledEnvironmentFeature`·`IMatchWeatherSource`를 구현하며 `IRandomConsumer`로 주입된 Match `weather` 스트림을 사용합니다. 저장은 실제 writer 등록과 필수 키를 검사하며 `world/weather` 누락 시 전체 저장을 거부합니다.

## MatchState와 snapshot 원본 경계 — main d9ea7057

MatchSession.Start는 MatchState.Start를 호출하며 Preparing에서만 Running으로 전환합니다. Complete는 같은 Match의 결과를 Running에서만 확정하고, MarkDisposed는 단계만 닫습니다. Feature actor의 파괴와 실제 HP·전력 변경은 각 소유자의 책임입니다.

MatchSessionFactory는 삭제된 범용 IAuthority를 받지 않습니다. Bind/BindNetworkMatch는 Player 수명/권한 문맥이며 이동·공격 명령 처리기를 새로 만드는 계약이 아닙니다. MatchSnapshot은 초기 Domain 자료·단계·확정 결과의 복사본이므로 실제 Player/CU HP, 터렛 전력, Enemy 상태와 공간은 각 Feature 읽기 Port와 Battlefield를 사용합니다.

공용 시간/생성물·writer provider·Animator/참조 복원과 환경 epoch는 [최신 보충](api-reference.md#시간복원환경-보충--main-d9ea7057)을 따릅니다. 현재 Feature 채택 여부와 구분하며 source scope를 생략해 전역 Scene/Manager를 다시 검색하지 않습니다.
