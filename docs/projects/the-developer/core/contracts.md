---
title: Core 호출·소유권 계약
---

# Core 호출·소유권 계약

기준: 게임 main `eb35ceb1` · 원본: `Docs/architecture/core-api-usage.md`.

Player·Turret·Enemy를 Core에 연결할 때 사용할 계약과 종료 책임입니다. 기존 `Global` 계열과의 대응은 책임을 이해하기 위한 설명이며 상속·호환 계보가 아닙니다.

| 호출자 | 사용할 계약 | 직접 하지 않을 일 |
| --- | --- | --- |
| Scene 조립부 | `IAppMatchHost.StartMatch(...)`로 세션 생성·주입 | `AppServices`를 서비스 검색기로 공개하거나 static Instance 사용 |
| Player 입력 | `PlayerSceneAdapter.Bind(session)` → `Submit(GameCommand)` | `MatchState` 직접 변경 또는 명령 성공 추정 |
| Turret 입력 | `CaptureTurretLayout()` → `UpdateBattlefieldTurretLayout(...)` | `TurretBase`·Transform을 Core snapshot에 보관 |
| Player·Enemy 위치 | `BattlefieldDynamicSpatialInput` → `UpdateBattlefieldParticipants(...)` | 별도 전역 Grid나 두 번째 위치 권위 모델 생성 |
| Encounter 소비자 | `BindMatch(matchId, snapshotProvider)` | Battlefield 분석 재구현 또는 과거 Match provider 재사용 |
| HUD·관측자 | `session.Events.Subscribe(...)`, `session.CreateSnapshot(sequence)` | 구독 인터페이스로 이벤트 발행 또는 상태 쓰기 |

`MatchState`는 Core의 Match 상태이며 Battlefield는 파생 분석입니다. Scene adapter가 Unity actor의 값을 투영하며, 전선 기하·셀 점유는 Core가, Spawn 정책은 Enemy/Encounter가 소유합니다.

## Command·Query·Event

- Command는 수행 의도입니다. `MatchSession.Submit` 결과의 `Accepted / Rejected / Unauthorized / NotHandled`를 구분합니다. `NotHandled`를 성공으로 표시하지 않습니다.
- Query는 조회입니다. `MatchSession.Battlefield`의 immutable 결과를 평가 시점에 읽고 `MatchId`, `Revision`, Grid 설정을 함께 해석합니다.
- Event는 이미 발생한 사실입니다. `Subscribe`가 돌려준 `IDisposable`을 구독자가 해제합니다. 요청 수와 실제 생성·사망·제거 수를 구분합니다.

```csharp
playerAdapter.Bind(session);
CommandSubmissionResult result = playerAdapter.Submit(command);

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

`LocalAuthority`는 NGO Server나 Steam 인증 구현이 아닙니다. Host/Client 공통 명령 전송, ID 매핑, 상태 복제, 소유권과 중복 방지는 별도 합의 대상입니다. `CommandId`, 진단 `RequestId`, `NetworkObjectId`도 서로 다른 용도입니다.

Game Debugger의 수동·반복 요청은 테스트 명령입니다. 출시용 Director나 스테이지 진행 규칙으로 해석하지 않습니다. 자세한 조작법은 [Game Debugger](../../../editor-tools/the-developer/game-debugger/index.md)를 확인하세요.

