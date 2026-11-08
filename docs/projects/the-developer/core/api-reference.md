---
title: Core API 사용법
---

# Core API 사용법

**기준:** 게임 main `d9ea70570b40a7d8d6a4d633299d0be7d1c1502c` (#623, 2026-11-06). 기존 전용 요청 API와 실제 scoped runtime/복원 계약을 정적으로 대조했습니다.

## 주요 API

| API | 사용할 때 | 주의 |
| --- | --- | --- |
| `IAppMatchHost.StartMatch(...)` | Scene 조립자가 설정·초기 상태·규칙·공간 입력을 연결 | Config와 State의 Match ID가 같아야 함 |
| `PlayerSceneAdapter.Bind/BindNetworkMatch/Unbind` | Player Feature의 Match·네트워크 수명 연결·정리 | 실제 이동·공격을 대신 실행하지 않음 |
| `TurretCommandGateway.TrySubmit(request)` | 공용 터렛 조작 요청 전달 | 전송 접수와 실제 적용 결과를 구분 |
| `MatchSession.Events.Subscribe(Action<MatchEvent>)` | UI·상태 표시가 Match 사실을 구독 | 반환된 `IDisposable` 해제 |
| `MatchSession.CreateSnapshot(long sequence)` | 특정 순번의 상태 조회 | 네트워크 동기화·저장 복구 기능이 아님 |
| `MatchSession.Battlefield` | topology·frontline·grid 읽기 | MatchSnapshot과 다른 공간 snapshot |
| `UpdateBattlefieldParticipants(dynamicInput)` | Player·Enemy 위치 갱신 | Scene 수집 결과를 전달 |
| `UpdateBattlefieldTurretLayout(staticInput)` | 터렛 배치 변경 | 정적 topology 재계산 경계 |
| `ReconfigureBattlefieldGrid(configuration)` | grid 설정 변경 | 콘텐츠 설정·유효 범위 확인 |
| `CompleteCurrentMatch(outcome, eventSequence)` | 앱 경계에서 완료 결과 생성 | 최종 게임 승패 정책과 구분 |
| `EndCurrentMatch()` | Scene/Match 종료 | 구독과 객체 수명 정리 |
| `MatchSession.InitializeRegions(definition, mode)` | Match 소유 지역 Grid 초기화 | 같은 Match에서 임의 중복 초기화 금지 |
| `session.Regions.Snapshot` / `Changed` | 확정 점유 상태 조회·변경 구독 | Battlefield 밀도 Grid와 별개 |
| `EncounterRequestService.Submit(request, verifiedIssuer)` | Match 단위 Encounter 요청 | 발신자는 연결 경계에서 검증 |

범용 Submit 두 개와 전용 명령·결과·로컬 권한 타입은 제거했습니다. 실제 스폰은 `EncounterRequestService`, 터렛은 전용 gateway/service를 사용합니다.

`MatchSession`을 직접 `new`하는 public 생성자는 없습니다. 앱 경계나 `MatchSessionFactory`를 통해 생성합니다.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)

지역·정책 전환, 요청 ID와 재전송, NGO Match 수명은 [지역·Encounter 연동](regions-encounters.md)을 확인하세요.

## 공용 터렛 명령과 표시 — main 9cf0e16b

**기준:** 2026-11-05 Core API 정리 · **원본:** Core 공개 API와 `Docs/architecture/core-api-usage.md`.

| 공개 Port / API | 계약 |
| --- | --- |
| SceneEntityIdentity | Scene 배치 개체의 논리 ID. DefinitionId·로컬 InstanceId·SDK NetworkObjectId와 구분 |
| ITurretEntityIdResolver.TryResolveEntityId / TryResolveLocalId | 현재 Match의 실제 등록·소유자를 확인하여 논리 ID와 로컬 ID 대응 |
| ITurretEntityRegistration.TryRegisterEntity(matchId, entityId, localInstanceId, out reason) | 실제 Factory 생성/등록 뒤 권위자가 정한 ID를 연결. 실패 시 생성자 책임으로 rollback |
| ITurretCommandRequester.TrySubmit(request) | 현재 Match·참가자의 의도를 접수. true를 실행 성공으로 표시하지 않음 |
| TryRetry(Guid requestId) / ResultReceived / PendingCount | 응답이 없으면 같은 GUID로 재시도, 결과 이벤트와 대기 수 확인 |
| ITurretCommandConsumer.BindTurretCommands(matchId, playerId, requester, presentation) | HUD에 요청 Port와 Host 확정 표시 원본을 함께 주입 |
| UnbindTurretCommands(matchId) | 같은 Match의 요청·표시 구독 정리 |
| RegisterAuthorityPlayerActor(matchId, playerId, actualHostActor) | Host가 소유한 실제 actor 등록. 반환 lease를 교체·Despawn에 해제 |

명령 종류는 SetActivation, StartAutoActivation, UpgradeLevel, DowngradeLevel, ApplyUpgrade, DowngradeUpgrade입니다. 수리·임의 피해·개체 생성 명령은 포함하지 않습니다. 같은 GUID·같은 의도는 최초 확정 결과를 재사용하며 다른 의도는 RequestConflict입니다. Accepted는 자동 작업의 시작이고 Applied는 즉시 적용입니다. 발신자는 실제 연결에서 확인하며 payload IssuerId를 인증으로 믿지 않습니다.

Host는 실제 권위 actor의 위치·생존·CanAct와 대상 상태를 검증합니다. 정식 NetworkBinding의 상호작용 거리는 기본 10이며 Client HUD의 거리 힌트로 인증하지 않습니다. 실제 Host actor가 없는 원격 참가자는 AuthorityActorUnavailable입니다. Client가 보낸 위치/생존 값이나 PlayerStart를 권위 actor 대신 사용하지 않습니다.

Scene에 배치를 복제했으면 재생 전에 `Tools > TeamHJD > The Developer > Configure Turret Identities`로 누락·중복 제작 키를 정리합니다. 정상 키는 유지하며 Client마다 런타임 GUID를 새로 만들지 않습니다. 승급·강등 시 FieldTurret의 실제 교체 사실에 맞춰 같은 논리 ID를 이전합니다. Match 종료 시 대응표와 구독을 폐기합니다.

Host의 표시 source가 FieldTurret 원본을 읽어 TurretPresentationFrame을 만들고 Client는 읽기 전용 replica를 사용합니다. AppRoot.AttachTurretCommandTransport 및 AttachTurretPresentationTransport는 App에 전송 소유권을 넘깁니다. Match gateway·replication 해제가 빌린 연결 전체를 닫아서는 안 됩니다. 표시 Frame은 최대 1,024개 터렛·표시 이름 256자·전체 payload 4MiB 계약이며 초과분을 조용히 잘라 완전한 상태로 표시하지 않습니다. 준비 세대·서버 발신·revision·내용 충돌을 검사합니다. 표시 채널/codec v2의 혼합 빌드 호환은 보장하지 않습니다.

표시 복사본은 실제 FieldTurret 생성·외형·공격 복제를 대신하지 않습니다. 원본이 보고한 UTP·Windows 두 프로세스 검증과 전체 협동 플레이 완성을 구분합니다. 이번 문서 동기화에서는 Unity 실행 시험을 수행하지 않았습니다.


## App·Match 기반 API — main 1a03e9a9

**대조 기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05). 아래는 #615로 병합된 기반 계약입니다. 기능 인터페이스의 존재와 실제 Feature 연결 완료를 구분합니다.

### 시작·연결·종료

| 경계 | 호출과 소유권 |
| --- | --- |
| App 생성 | `AppBootstrap` → `AppRoot.Initialize`. App이 서비스·연결·Scene 전환·저장소 수명을 소유합니다. |
| 게임 흐름 | `GameFlowController`의 `EnterSpaceshipAsync`, `LaunchMissionAsync`, `RestartMissionAsync`, `ReturnToSpaceshipAsync`. Mission은 실제 Scene 조립과 준비 완료를 확인하며 실패는 Faulted/취소로 전달합니다. |
| 세 상태 | `GameFlowPhase`는 App 위치, `NetworkMatchPhase`는 연결 참가자의 준비·시작·결과 전달, `MatchPhase`는 한 판의 규칙 상태입니다. 하나가 Running이라고 다른 단계의 준비를 추정하지 않습니다. |
| 실제 actor 등록 | `RegisterAuthorityPlayerActor(matchId, playerId, actor)`는 Host의 실제 actor를 연결합니다. SDK 연결 ID·Player ID·논리 Entity ID·NetworkObject ID는 서로 대체하지 않습니다. |
| 종료 | `TryEndMatch(ownedMatchId)`/Scene 해제 때 소유 lease·구독·actor·지역/터렛·공용 시간을 끝까지 해제하고 오류를 합칩니다. 다른 Feature 객체를 임의로 파괴하지 않습니다. |

현재 `InitialStageCompositionRoot`는 터렛 Match 바인딩 → Session 생성 → 해금 구역 준비 → 공용 시간/Coordinator → Match 난수 및 소비자 → 선택적 환경/Spawn source → 로컬 actor·지역·Encounter → Coordinator 시작 순서로 조립합니다. 기존 Enemy의 Battlefield 경로는 유지하며, 환경·추가 Spawn Port는 해당 인터페이스를 구현한 소비자에만 연결합니다.

### 공용 시간과 예약

| 공개 API / 타입 | 사용 계약 |
| --- | --- |
| `ITimestampSource` | NGO 서버 시각 또는 standalone Unity 단조 시각의 준비 여부·double 초를 제공합니다. |
| `MatchTimeService.Clock` / `IMatchTime` | Match의 게임 초·정지·배속을 읽습니다. App/UI/NGO pump를 전역 정지시키지 않습니다. |
| `MatchTimeService.Scheduler` / `IMatchScheduler` | 단발·반복 작업을 게임 초 기준으로 등록하며 반환 lease와 취소 토큰으로 정리합니다. |
| `ScheduleRepeating(firstDelaySeconds, intervalSeconds, callback, cancellation)` | 첫 지연과 이후 주기를 구분합니다. 등록 중 즉시 실행하지 않으며 긴 프레임의 누락 반복을 무제한 재생하지 않습니다. |
| `AcquirePause(owner)` | 캡처·복원 등 임시 정지 lease. 참가자 전원 내부 정책 및 다른 lease와 OR로 결합합니다. |
| `Restore(gameSeconds)` | 새 epoch를 발행하고 이전 epoch의 예약을 취소합니다. Feature가 복원한 남은 시간으로 다시 예약해야 합니다. |
| `MatchTimeReplica` | Client는 검증된 Host anchor를 읽습니다. 최초 유효 수신 전 시계를 정상 준비 상태로 취급하지 않습니다. |

Preparing 시간은 자동 정지하며 로딩 시간을 게임 시간에 포함하지 않습니다. callback과 시계 제어는 소유 스레드에서 사용합니다. `InitialStageCompositionRoot.MatchTime` / `MatchTimers`는 조립부의 주입 경계이며 전역 검색 API가 아닙니다.

`IFieldSimulationConsumer.BindFieldSimulation`와 `IMatchScheduledEnvironmentFeature.BindAuthority`는 Feature가 실제로 구현·연결해야 하는 계약입니다. 현재 조립부는 Enemy·터렛의 FieldSimulation과 Map의 권위 환경을 연결합니다. 날씨의 Host/Client 처리와 난수 경계는 [현재 Weather 구현](../world/progress.md)을 확인하세요.

### 체크포인트 실행과 저장소

`AppRoot.CreateCheckpointScope(runtime, participants, requiredKeys)`는 Match 조립부가 실제 원본 writer와 필수 키를 지정해 만듭니다. `MissingParticipantKeys`를 확인하고, Feature 교체 시 `Register(writer)`의 lease를 보관·해제하며 Match 종료 때 scope를 Dispose합니다. `core/random` writer만 등록해 전체 게임 저장이 준비됐다고 판단하지 않습니다.

| API / 결과 | 계약 |
| --- | --- |
| `scope.Service.SaveAsync(slot, cancellation)` | 권위·현재 Match/epoch·중복·필수 writer를 검사한 뒤 같은 프레임에 실제 상태를 캡처하고 불변 자료를 저장합니다. |
| `RestoreAsync` | 전체 PrepareRestore → Apply → ResolveReferences → FinishRestore. 실패 시 백업 Rollback 및 참조 재연결을 시도하고 복구 불가 상태는 Fault 처리합니다. |
| `IsSuccess` / `IsCurrentScope` | 성공과 현재 Match에 적용 가능한 결과인지 따로 확인합니다. 오래된 비동기 완료로 현재 UI를 변경하지 않습니다. |
| `Saved` / `Restored` | 각각 파일 교체 / 상태 적용 완료. NotFound·Busy·Rejected·Cancelled·Failed·Faulted·RestoreRolledBack을 성공으로 뭉개지 않습니다. |
| `AppRoot.ReadCheckpointAsync` | metadata를 읽는 경계입니다. 새 Match나 실제 actor 재생성을 자동 수행하지 않습니다. |
| `CheckpointRequestChannel` / `CheckpointTrigger` | 주입한 명시 요청만 실행합니다. 자동 저장·복원 사건을 새로 정하는 기능이 아닙니다. |

App은 `Application.persistentDataPath/Checkpoints`의 `BinaryCheckpointStore`와 codec을 조립합니다. 슬롯은 정규화한 1–64자 ASCII 문자·숫자·하이픈·밑줄 이름이며 경로를 받지 않습니다. 완성 임시 파일을 flush한 뒤 `<slot>.checkpoint`로 교체하고, 손상·미지원 schema를 빈 저장 성공으로 바꾸지 않습니다. 해시는 손상 감지이며 Backend 인증이 아닙니다.

World는 복원하고 Progression은 현재 값을 유지합니다. Currency도 기본 유지하며 `CurrencyRestorePolicy.RestoreCheckpoint`를 명시한 경우만 저장값을 사용합니다. Initial_Stage는 `Checkpoints`와 `CheckpointRequests`를 제공하며 `RegisterCheckpointParticipant(writer)`로 Match 수명의 실제 writer를 연결할 수 있습니다. Core 난수·공간·시간대와 CU·터렛·Enemy·Encounter·Player writer를 조립합니다. 실제 `world/weather` writer가 필요한 Scene에서는 누락으로 전체 Save/Restore가 차단됩니다. 자동 저장 사건은 등록되어 있지 않습니다.

`AppRoot.ResumeCheckpointAsync(slot, missionScene)`는 시작/허브에서 1인 Story 슬롯의 메타데이터를 읽고 새 Match에 복원합니다. 동일 Scene의 `RestoreAsync`와 달리 새 Match를 구성하며, 실패·취소 시 해당 복원 작업의 Match를 정리합니다. 결과의 `Status`, `Reason`, `IsCurrentScope`를 확인하세요.

### Scene·화면과 입력 잠금

| API | 사용할 때 |
| --- | --- |
| `SceneFlowController.LoadAsync / ReplaceAsync / UnloadAsync` | 각각 Additive 로드 / Single 교체 / 명시 해제. 같은 Scene의 Replace도 재로드합니다. |
| `CancelCurrent` / `Progress` | 취소 가능한 Additive 작업만 취소합니다. NGO 완료 대기의 NaN은 미제공 진행률이며 임의 백분율을 만들지 않습니다. |
| `IInputBlocker.Acquire(owner)` | 자기 화면·전환의 IDisposable 입력 잠금만 해제합니다. 사망·다른 화면의 잠금을 덮어쓰지 않습니다. |
| `ShowMenu / ShowLoading / Close / Back` | 개인 화면과 입력 lease 수명 관리. Escape 메뉴는 공유 Match 시간 정지가 아닙니다. |
| `BindMatch / ShowResult / ResetContext` | 현재 Match의 불변 결과만 표시하고 과거 문맥을 정리합니다. 완료 결과 전달 전에 연결/Session을 없애지 않습니다. |

정식 귀환은 Match를 종료하므로 전투 중 임시 우주선 방문과 구분합니다. 고정 1–2인 Host의 공동 Scene 로드와 전원 준비 이후 시작은 [Scene 이동 경계](../world/quick-start.md#ngo-driver와-app-이동-제한--main-d9ea7057)를 확인하세요. SDK 초기화와 로비 사용법은 아래 플랫폼 항목을 따릅니다.

**원본:** `Docs/architecture/core-lifecycle-and-api-guide.md`, `network-match-api.md`, `match-time-api.md`, `match-field-pause-api.md`, `match-environment-api.md`, `checkpoint-execution-api.md`, `checkpoint-storage-api.md`, `scene-flow-api.md`, `screen-management-api.md`와 현재 Core 조립 코드. 이 페이지는 API 정적 대조 결과이며 Unity 실행 인수 기록이 아닙니다.

## 시간·복원·환경 보충 — main d9ea7057

**기준:** 게임 main `d9ea70570b40a7d8d6a4d633299d0be7d1c1502c` (#623, 2026-11-06). 아래는 현재 main의 공개 계약이며 실제 Feature가 모두 이 경로를 소비한다는 뜻은 아닙니다.

### FieldSimulationTime: 소유자와 생성물의 시간

| API | 호출 계약 |
| --- | --- |
| `FieldSimulationTime.CanAdvance(owner)` | 부모의 PlayerMatchPresence 시간·종료 취소, 없으면 FieldSimulationActor를 확인합니다. null owner는 false입니다. |
| `FieldSimulationTime.Seconds(owner)` | 쿨다운/수명 deadline에 사용할 절대 게임 초. 바인딩이 없는 독립 Feature 실행은 Time.timeAsDouble로 동작합니다. |
| `FieldSimulationTime.DeltaTime(owner)` / `FieldSimulationTime.FixedDeltaTime(owner)` | 진행 불가면 0, 진행 가능하면 연결된 Match 배속으로 보정한 Unity delta를 제공합니다. |
| `FieldSimulationTime.ScaleDelta(time, unityDelta)` | 연결된 Match의 배속을 적용하면서 Unity timeScale을 중복 곱하지 않습니다. 정지·준비 불가·유효하지 않은 결과는 진행시키지 않습니다. |
| `FieldSimulationTime.BindSpawned(spawned, owner, destroyOnCompletion = true)` | 생성자가 생성 직후 호출합니다. 소유자의 Scene과 바인딩된 시간·Match 취소 수명을 전달합니다. |

생성물과 소유자 Scene이 다르면 부모 없는 root를 소유자 Scene으로 옮깁니다. 이미 다른 Scene의 부모에 붙은 생성물은 거부하므로 바인딩/Scene 귀속을 먼저 준비하세요. 시계 없는 독립 실행에 임의의 전역 Match를 찾아 연결하지 않습니다. 같은 owner의 시간만 전달하며 Player의 우주선 이동 허용 여부는 별도 PlayerControlState 책임입니다.

`FieldSimulationActor.Synchronize`는 필드 정지 동안 Rigidbody2D.simulated·Animator.speed를 다시 고정하고, NavMeshAgent의 이전 isStopped 상태를 보관·복원합니다. NetworkObject나 Feature 자체 수명을 끄는 API가 아닙니다. 이 공용 도구의 추가만으로 모든 Player/Enemy/터렛 이동·쿨다운·생성물이 이관됐다고 설명하지 않습니다.

### 체크포인트 writer·Animator·대상 참조

| 공개 계약 | 사용법과 실패 경계 |
| --- | --- |
| `ICheckpointParticipantProvider.GetCheckpointParticipants()` | Scene 밖에 유지되는 Feature 소유자가 실제 writer를 명시 제공합니다. 조립부에서 사용해야 하며, 구현만 추가해도 자동 등록되지는 않습니다. |
| `CheckpointAnimatorState.Capture(animator)` | 레이어의 fullPathHash·normalizedTime과 Float/Int/Bool 파라미터를 값으로 보관합니다. 전환 중이면 예외를 처리하고 전환 완료 뒤 재시도합니다. |
| `CheckpointAnimatorState.Apply(animator)` | 레이어 수·파라미터 타입·state 존재를 확인해 상태를 적용하고 Trigger는 재실행하지 않도록 reset합니다. 공격/스킬 함수를 새로 호출하는 기능이 아닙니다. |
| `CheckpointAnimatorState.Write(writer)` / `Read(reader, codec)` | 불변 Animator 자료를 명시 바이너리 형식으로 처리합니다. 읽기는 레이어 16·파라미터 256개와 유효 수치를 검사합니다. |
| `CheckpointSceneReferences.Capture(target)` | Player 슬롯 또는 SceneEntityIdentity 논리 ID로 참조 키를 만듭니다. null은 빈 키, ID 없는 실제 대상은 실패입니다. |
| `CheckpointSceneReferences.Resolve(scene, key)` | 모든 actor 적용 뒤 같은 Scene의 활성·유효한 대상을 찾습니다. 빈 키는 null, 누락/중복 대상은 예외입니다. |

참조 키는 helper가 만든 값을 그대로 저장합니다. Unity instance ID나 NetworkObjectId를 저장 키로 대체하지 않습니다. CheckpointActorFactory의 신규 자동 ID 접두사는 `entity/`이며 이미 유효한 ID를 새로 만들지 않습니다. 이러한 공용 도구와 실제 Feature의 Capture/Prepare/Apply/Resolve/rollback 전체 통합은 구분합니다.

### 환경 epoch·낮밤 확장

`MatchEnvironmentSnapshot.Epoch`가 Match 시간의 복원 세대를 함께 전달합니다. 같은 epoch에서는 게임 시간 역행을 거부하고, 복원으로 epoch가 바뀌면 더 작은 게임 초를 적용할 수 있습니다. 값이 같더라도 epoch 교체는 새 revision의 환경 상태로 게시합니다. 같은 revision에 epoch/시간/내용이 다르면 충돌이며, 과거 revision은 계속 거부합니다. `HasSameValues`만으로 epoch까지 동일하다고 판단하지 않습니다.

`EnvironmentReplicationCodec`과 채널은 v2(`teamhjd.core.environment.v2`)로 변경됐습니다. 최대 payload는 16,384바이트이며 v1/v2 혼합 빌드가 호환된다고 가정하지 않습니다.

`MatchEnvironmentSceneScope`는 선택적인 `IMatchClock clock`을 받아 실제 시간 epoch를 환경에 연결하고, `PublishCurrent()`로 Match 시작 직후 초기 환경을 게시하는 접점을 제공합니다. 호출과 실제 source 연결은 조립부 책임입니다. 현재 main의 기존 조립부가 이 추가 인자/초기 게시를 모두 사용한다고 설명하지 않습니다.

`IMatchDayNightCycle`은 IMatchTimeOfDaySource를 확장해 `DayNightPhase.Day/Night`, `Phase`, `RemainingSeconds`와 `PhaseAdvanced`를 제공합니다. PhaseAdvanced는 정상 주기 진행 신호이며 복원/Client 적용의 Changed를 새 날씨 추첨 신호로 사용하지 않습니다. Initial_Stage의 실제 주기·예약과 Client 표현은 [낮밤·환경 복원 계약](../world/progress.md#낮밤환경-복원-계약)에서 확인하세요.

**출처:** Core/Presentation/Scene의 FieldSimulationTime·FieldSimulationActor·CheckpointAnimatorState·CheckpointSceneReferences, Contracts의 ICheckpointParticipantProvider·IMatchDayNightCycle, Domain/Application의 MatchState·환경 snapshot/runtime/replica 및 환경 전송 코드. 이번 문서 갱신은 정적 대조이며 Unity·실제 두 실행 파일의 인수 검증이 아닙니다.

## Steam 초기화와 로비

앱은 주입된 `IPlatformService.SignInAsync(cancellation)`로 사용자를 읽습니다. `PlatformUser.PlatformId`는 Steam 계정 ID입니다. Match 참가자와 NGO 연결 ID는 별도 계약으로 배정합니다. Steam 모드 초기화에 실패하면 진단창에서 원인을 확인하고 재시도할 때까지 출격을 차단합니다.

- `IPlatformLobbyService`의 `CreateLobbyAsync`와 `JoinLobbyAsync`는 각각 친구 공개 2인 로비 생성과 명시 참가입니다. `CurrentLobby`로 ID·Owner·멤버를 읽습니다.
- `JoinRequested`는 초대에서 받은 참가 의도를 전달합니다. `OpenInviteOverlay()`로 초대 창을 열고 `LeaveLobby()`로 나갑니다.
- 앱이 `IPlatformRuntime.Pump()`를 계속 호출합니다. 취소 또는 실시간 제한 이후에는 늦게 돌아온 SDK 응답을 정리해야 다음 생성·참가가 가능합니다.
- 로비 참가 이후의 게임 연결은 현재 UTP 경로입니다. Steam transport와 Backend ticket 검증은 별도 연동입니다.
