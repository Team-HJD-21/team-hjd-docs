---
title: Core API 사용법
---

# Core API 사용법

**기준:** main `b73e0e76` · **영역:** 양현석 · **원본:** `Assets/PoC/Core/README.md`, `Application/MatchSession.cs`, `Application/IAppMatchHost.cs`, `Contracts/IMatchEventStream.cs`, `Domain/Match/MatchSimulation.cs`.

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

`MatchSession`을 직접 `new`하는 public 생성자는 없습니다. 앱 경계나 `MatchSessionFactory`를 통해 생성합니다.

[Core — 세션·명령·이벤트 목차](../core.md) · [통합 체크리스트](../integration.md)
