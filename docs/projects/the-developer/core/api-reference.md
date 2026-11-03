---
title: Core API 사용법
---

# Core API 사용법

**기준:** 게임 main `7f22b9ca` (#530) · **원본:** Core 공개 API와 `Docs/architecture/core-api-usage.md`.

## 주요 API

| API | 사용할 때 | 주의 |
| --- | --- | --- |
| `IAppMatchHost.StartMatch(...)` | Scene 조립자가 설정·초기 상태·규칙·공간 입력을 연결 | Config와 State의 Match ID가 같아야 함 |
| `MatchSession.Submit(GameCommand)` | 명령 권한과 처리 결과 조회 | `Accepted`를 가정하지 말고 상태 확인 |
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

`MatchSession`을 직접 `new`하는 public 생성자는 없습니다. 앱 경계나 `MatchSessionFactory`를 통해 생성합니다.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)

지역·정책 전환, 요청 ID와 재전송, NGO Match 수명은 [지역·Encounter 연동](regions-encounters.md)을 확인하세요.

## 공용 터렛 명령과 표시 — main 9cf0e16b

**기준:** `9cf0e16b5924b6facfc35646184672c1d51e7b1a` (#570) · **출처:** 게임 `Docs/architecture/core-sprint-region-and-request-api.md`, `Assets/Scripts/Core/Contracts/Turrets/`, Core SceneComposition.

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
