---
title: 진행 상태·날씨 큐와 저장 경계
---

# 진행 상태·날씨 큐와 저장 경계

**기준:** 날씨 사용법은 게임 main `06e834cc3` (#677 포함)의 `weather-system-guide.md`와 Map 코드를 대조했습니다.

## 기존 Spaceship 진행 실험

SpaceshipProgressReader의 MissionData·ProgressData·Load, MissionProgresser.AdvanceMission, NaviProgresser.TryUpgrade는 기존 세션 JSON 실험 경로입니다. 파일은 Application.persistentDataPath의 PocMissonData.json/PocProgressData.json이며 철자를 임의 변경하지 않습니다. SaveSession은 시작 시 false여서 파일 존재만으로 재실행 진행 복구를 보장하지 않습니다.

이 경로는 [Core 바이너리 체크포인트](../core/api-reference.md#체크포인트-실행과-저장소)와 다릅니다. 새 저장소가 있다고 기존 진행 실험이나 실제 전체 Feature writer가 자동 이관되지는 않습니다.

## 현재 Map 날씨

| API / 값 | 현재 구현 |
| --- | --- |
| WeatherManager.CurrentWeather | 현재 값 읽기, 시작값은 Inspector의 `currentWeather` (코드 기본값 `SUNNY`) |
| ChangeWeather / CallWeatherChange | 권위 범위에서 난수가 바인딩된 경우 큐 소비·보충 → 화면 적용 → `Changed` 순서로 진행합니다. Match에 속한 Client의 변경 호출은 적용되지 않습니다. |
| Weather | SUNNY / RAIN / THUNDERSTORM / HEATWAVE. WEATHER_COUNT는 개수 sentinel이며 날씨가 아닙니다. |
| `IMatchEnvironmentSource.Changed` | Match의 확정 환경 변경을 구독하고 snapshot에서 날씨와 예고를 읽습니다. |
| CountTick | 낮밤 소스가 없는 경우의 간격 전환입니다. 독립 Scene에서는 `Time.timeAsDouble`, Host Match에서는 주입된 Match 시계·예약을 사용합니다. 간격 기본값은 5초입니다. |

기본 큐 길이는 5(최소 1)입니다. `IRandomConsumer.BindRandom()`이 받은 Match `weather` 스트림으로 낮·밤별 가중치 합에서 추첨합니다. 맑음·비·뇌우·폭염 순으로 낮은 5·2·1·2, 밤은 6·2·2·0이 기본값입니다. 합이 0이면 오류를 기록하고 맑음을 반환합니다. 난수 바인딩 전에는 큐를 채우거나 소비하지 않습니다. `IMatchWeatherSource.WeatherId`와 `Forecast`에서 현재 ID와 읽기 전용 예고 복사본을 읽습니다. 최초 예고를 읽기 전에 Scene 조립이 완료됐는지 확인하세요.

`WeatherManager`는 `IMatchScheduledEnvironmentFeature`와 `IMatchWeatherSource`를 구현합니다. `BindAuthority`가 Host 전환을 연결하고, Client는 `BindReplica`와 `ApplyReplica(snapshot)`를 통해 확정 환경을 화면에 적용합니다. Client 적용은 확정된 예고를 적용합니다. `world/weather` writer는 아직 연결되지 않았습니다. [가중 선택 예제](../core/randomness.md)에서 공용 난수 API를 확인하세요.

### 구독과 수동 변경

- 환경 source의 `Changed`를 구독하고 수명 종료 시 해제합니다. 날씨 ID와 예고를 읽고 이전 값과 비교합니다.
- `ChangeWeather()`와 Inspector 버튼에서 쓸 수 있는 `CallWeatherChange()`는 큐의 다음 값으로 진행합니다. 같은 날씨가 연속으로 선택되어도 알림은 발생합니다. 구독자는 같은 상태가 반복돼도 효과를 중복 누적하지 않도록 처리합니다.
- 일반 `ChangeWeather()`는 기존 예약을 재시작하지 않습니다. 독립 Scene의 시각은 `Time.timeScale`, 정식 Match의 시각은 공용 필드 시간의 정지·배속을 따릅니다.

### Scene 설정

1. 독립 간격 전환을 사용하는 Scene에서는 같은 GameObject에 `WeatherManager`와 `CountTick`을 둡니다.
2. `MainCamera`에 `WeatherShaderApply`를 붙이고 `WeatherManager`의 `_weatherShaderApply`를 연결합니다. 초기화 시 `Camera.main`으로 보완할 수 있으며 카메라 교체 시 새 참조는 조립부에서 관리합니다.
3. 카메라 컴포넌트에 날씨별 Material을 지정합니다. 해당 Material이 없으면 원본 화면을 표시합니다. `_transitionMaterial`이 비어 있거나 `_transitionDuration`이 0이면 효과를 즉시 바꿉니다.


## 날씨 화면 효과

WeatherManager는 지정된 MainCamera의 WeatherShaderApply를 사용하고, 없거나 다른 태그 참조면 Camera.main에서 같은 컴포넌트를 찾습니다. `ApplyWeather(weather)`는 초기 값을 즉시 표시하고 이후 변경은 설정된 Material과 전환 시간(기본 1.5초)으로 보간합니다. `ApplyWeather`와 `SetEffectsEnabled(bool)`의 변경 범위는 카메라 표현입니다. 현재 날씨·예고 큐·변경 알림은 `WeatherManager`가 관리합니다. 같은 날씨를 다시 적용하면 전환을 재시작하지 않습니다. 렌더링은 `OnRenderImage`와 `Graphics.Blit` 경로를 사용합니다.

`PlayerWeatherEffectBinding`은 로컬 플레이어 조립부에서 `PrepareLocalActor`·`BindLocalActor`·`UnbindLocalActor`로 연결합니다. `BindLocalActor`는 `PlayerLocationState`의 현재 위치를 즉시 적용하고 `LocationChanged`를 구독합니다. `true`면 효과를 숨기고 `false`면 다시 표시합니다. 기준 main의 C#에서 `CheckLocation(bool)` 호출부는 확인되지 않아 실제 포털 진입과의 연결은 별도 확인이 필요합니다. 로컬 화면 표시와 Host의 확정 출입/전체 필드 정지는 별개입니다. 전원 내부 정책은 [출입 보고 API](../core/presence-reporting.md)를 따릅니다.

이번 갱신은 실제 main의 정적 API 대조입니다. 렌더링·카메라 외형·날씨 효과·포털/네트워크 동작을 Unity에서 새로 검증하지 않았습니다.

[World 목차](../world.md) · [Core 시간·저장 API](../core/api-reference.md)

## 낮밤·환경 복원 계약

`Initial_Stage`의 Host는 기본 낮 300게임초, 밤 300게임초를 반복합니다. `WeatherManager`가 같은 객체의 `IMatchDayNightCycle.PhaseAdvanced`를 구독하면 `CountTick`의 간격 예약은 시작하지 않습니다. 정상 주기 전환에서 이전 단계의 예고를 비우고 새 단계 가중치로 채운 큐의 첫 날씨를 선택하며, 복원·Client 적용에서는 새 날씨를 선택하지 않습니다. 전환한 환경은 다음 Encounter 계획에 반영됩니다.

디버그 HUD는 현재 단계와 남은 시간을 표시합니다. Host의 `TryRestartCurrentPhase()`는 공용 시각과 현재 단계를 유지하고 이 구간의 예약을 교체합니다. 재시작에 성공하면 HUD가 기존 날씨 버튼을 한 번 호출합니다. 낮밤 모드는 `world/time-of-day`로 시간을 복원합니다. `CountTick.CaptureTimerState()`와 `RestoreTimerState()`는 간격 예약이 실제로 바인딩된 모드에만 사용합니다.

환경 snapshot은 시간 Epoch를 포함하고 v2 채널로 전송합니다. 같은 epoch에서 시간 역행은 거부하되 복원 세대 교체는 별도로 처리합니다. Scene 조립부의 clock 주입과 PublishCurrent 연결이 있어야 초기/복원 환경을 그 시계에 맞출 수 있습니다. [환경·낮밤 세부 계약](../core/api-reference.md#환경-epoch낮밤-확장)을 함께 확인하세요.

### Client 카운트다운

HUD는 기존 `IMatchDayNightCycle.RemainingSeconds`를 읽습니다. Client는 Host가 보낸 `MatchEnvironmentSnapshot.PhaseAnchor`와 같은 Match·복원 세대의 공용 게임 시계로 남은 시간을 계산합니다. 자료가 없으면 `--:--`를 표시하고, 경계에 먼저 도달하면 0에서 다음 Host 확정을 기다립니다. 낮밤은 공용 게임 시계의 정지·배속을 따르므로 필드 전용 정지와 구분합니다. Reset은 Host 권한에서 사용합니다.
