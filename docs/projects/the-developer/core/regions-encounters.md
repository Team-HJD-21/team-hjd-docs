---
title: 지역·Encounter 연동
---

# 지역·Encounter 연동

**기준:** 게임 `main` `7f22b9ca` (#530) · **원본:** `Docs/architecture/core-sprint-region-and-request-api.md`, 공개 Core·Turret 계약.

## 지역 Grid

`MatchSession.InitializeRegions(definition, mode)`로 Match 수명 동안 사용할 지역을 한 번 초기화합니다. Match가 Runtime을 소유하고 `session.Regions.Snapshot`에서 현재 확정 상태를 읽습니다. 변경 알림은 `session.Regions.Changed`를 구독하고 반환된 해제 계약을 정리하세요.

| API | 용도 | 주의 |
| --- | --- | --- |
| `RegionSceneBinding.ResetPolicy(mode, true)` | 사용자 확인 뒤 새 Grid 세대로 정책을 다시 설정 | 확인되지 않은 Reset은 거부됩니다. |
| `RegionSceneBinding.TryUnlockThroughZone(zone)` | 정적 모드에서 지정 구역 해금을 요청 | 활성화나 전력 예약은 별도입니다. |
| `TurretController.Regions` | HUD·Feature가 점령 상태를 읽는 Port | Core 바인딩이 없으면 `null`일 수 있습니다. |
| `RegionGridReplica.Apply(frame, senderIsVerifiedServer)` | 검증된 전달자에게서 받은 프레임으로 Client 읽기 모델 갱신 | 인수의 검증 여부는 전송 어댑터가 보장해야 합니다. |

정적 모드는 CU가 정한 구역을 해금합니다. 동적 모드는 활성 터렛이 셀을 점유하며 지역 잠금은 사용하지 않습니다. 비활성·파괴된 터렛은 다음 계산에서 점유를 내놓고, 과열 터렛은 활성 상태이므로 계속 점유합니다. 점유의 실제 단위는 Grid 셀입니다.

Core 지역 Grid와 Battlefield의 Player·Enemy 밀도 및 전선 분석 Grid는 서로 다른 데이터입니다. Turret의 기존 `UnlockZones`도 Core 지역 상태와 별개입니다. Core 지역이 바인딩된 Scene에서는 두 상태를 함께 쓰지 말고 `RegionSceneBinding` API를 사용하세요. [터렛 API](../turret/api-reference.md)

복제 프레임은 `GridId`, Grid 세대, revision, Match descriptor를 기준으로 오래된 준비·세대·revision을 거부합니다. 같은 revision에 서로 다른 결과가 오면 충돌로 거부합니다. 이 문서 기준에서 실제 NGO 지역 점유 payload 전송은 아직 연결되지 않았습니다.

## Encounter 요청

`EncounterRequestService`는 요청을 조율하고, `IEncounterExecutor` 구현이 실제 계획·생성 경계를 맡습니다. 기존 UI나 도구에서 요청할 때는 현재 Match와 고유 요청 정보를 묶어 제출합니다.

```csharp
var context = new MatchRequestContext(matchId, requestId, issuerId);
var request = new EncounterRequest(context, new DefinitionId("Normal"), 10,
    EncounterRequestSource.RuntimeUI);
EncounterRequestResult result = requests.Submit(request, verifiedIssuer);
```

`verifiedIssuer`에는 연결 경계에서 확인한 참가자 ID를 전달하세요. 요청 payload의 `IssuerId`나 Debugger 출처만으로 권한을 인증하지 않습니다. 같은 작업의 재전송은 같은 Request ID와 같은 payload를 사용하고, 새 실행은 새 ID를 발급합니다.

결과는 성공, 부분 생성, 계획 거부, 생성 실패, 권한·Match·충돌·용량 거부 등을 구분합니다. 부분 실행이나 실패가 확정되면 같은 요청을 다시 제출해 전체 생성을 반복하지 않습니다. `IsReplay`는 기존 확정 결과의 재사용이며, 실행 실패에서 실제 부작용 수를 알 수 없을 때 0개 생성으로 간주하지 않습니다. 중복 방지는 Match 수명 안에서만 유효하고 기본 ledger 한도는 Match당 4096개입니다. 영구 저장 보장은 아닙니다.

Encounter 요청은 Host 연결이나 게임 cadence를 시작하지 않습니다. 요청 주체가 주기를 소유하며 Snapshot 변경 자체를 생성 명령으로 해석하지 마세요.

## 네트워크 Match 수명

`NgoNetworkSession`은 전달된 `NetworkManager`를 사용합니다. App 조립자가 `AppRoot.AttachNetworkSession(adapter)`로 소유권을 넘긴 뒤 `TryStartHost()` 또는 `TryStartClient()`를 명시적으로 호출합니다. Attach만으로 연결이 열리지는 않으며, 어댑터는 자신이 시작한 연결만 닫습니다.

Host만 `NetworkMatchCoordinator.TryPrepare(...)`로 Match 설정을 확정합니다. 각 인스턴스가 Feature 준비를 마치면 `MarkLocalReady()`를 호출하고 Host가 `TryStart()`를 요청합니다. Client는 Host Descriptor를 사용하며 자체 Match 설정을 만들지 않습니다. 실제 Network 연결이 됐다는 사실만으로 Match가 자동 시작되지는 않습니다.

NGO Match 수명 전송은 네트워크가 시작된 뒤 `NgoMatchLifecycleTransport`를 연결합니다. App에 연결된 transport는 AppRoot가 Pump·정리하고, 독립 소비자는 직접 Pump해야 합니다. **지역 점유 Snapshot의 실제 NGO 전송은 이 기준에서 미구현입니다.** API 사용 문서는 Initial Stage의 정식 네트워크 조립이나 실제 플레이 검증을 뜻하지 않습니다.

[Core API 사용법](api-reference.md) · [모듈 통합 체크리스트](../integration.md)
