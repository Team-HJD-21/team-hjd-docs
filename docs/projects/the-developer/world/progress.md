---
title: 진행 상태·날씨 큐와 저장 경계
---

# 진행 상태·날씨 큐와 저장 경계

**기준:** 게임 main `1a03e9a9164e5db94cbc8775162467d08cf63a3b` (2026-11-05), 공개 API·현재 구현 정적 대조.

## 기존 Spaceship 진행 실험

SpaceshipProgressReader의 MissionData·ProgressData·Load, MissionProgresser.AdvanceMission, NaviProgresser.TryUpgrade는 기존 세션 JSON 실험 경로입니다. 파일은 Application.persistentDataPath의 PocMissonData.json/PocProgressData.json이며 철자를 임의 변경하지 않습니다. SaveSession은 시작 시 false여서 파일 존재만으로 재실행 진행 복구를 보장하지 않습니다.

이 경로는 [Core 바이너리 체크포인트](../core/api-reference.md#체크포인트-실행과-저장소)와 다릅니다. 새 저장소가 있다고 기존 진행 실험이나 실제 전체 Feature writer가 자동 이관되지는 않습니다.

## 현재 Map 날씨

| API / 값 | 현재 구현 |
| --- | --- |
| WeatherManager.CurrentWeather | 현재 값 읽기, 초기 SUNNY |
| ChangeWeather / CallWeatherChange | 큐에서 하나 소비 → 큐 보충 → 화면 효과 적용 → OnWeatherChange 알림. CallWeatherChange도 실제 큐 변경을 수행합니다. |
| Weather | SUNNY / RAIN / THUNDERSTORM / HEATWAVE. WEATHER_COUNT는 개수 sentinel이며 날씨가 아닙니다. |
| OnWeatherChange | static Action이며 Weather와 실제 Queue를 전달합니다. 구독·해제하고 복사 필요 시 ToArray로 보관합니다. |
| CountTick | 같은 GameObject의 WeatherManager를 찾아 기본 5초 WaitForSeconds 간격으로 ChangeWeather를 호출합니다. |

기본 큐 길이는 5(최소 1), sunnyWeight는 3, 다른 세 날씨는 각 1입니다. 현재 추첨은 UnityEngine.Random.Range이며 기본 독립 확률은 맑음 3/6·나머지 각 1/6입니다. 초기 Start는 큐·표시·셰이더를 준비하지만 초기 변경 알림을 발행하지 않으므로 구독 직후 CurrentWeather를 읽습니다. 실제 Queue를 소비자가 Dequeue/Clear로 수정하지 않습니다.

현재 Map은 IRandomConsumer·IMatchScheduledEnvironmentFeature·IMatchWeatherSource·ICheckpointParticipant를 구현하지 않습니다. Core의 난수/시간/환경/저장 Port와 사용 예제가 있어도 실제 Weather가 Host 난수·공용 scheduler·환경 replica·저장 writer로 통합된 것은 아닙니다. [가중 선택 예제](../core/randomness.md)는 API 사용법이며 현재 Weather 코드 교체 완료 주장이 아닙니다.

## 날씨 화면 효과

WeatherManager는 지정된 MainCamera의 WeatherShaderApply를 사용하고, 없거나 다른 태그 참조면 Camera.main에서 같은 컴포넌트를 찾습니다. `ApplyWeather(weather)`는 초기 값을 즉시 표시하고 이후 변경은 설정된 Material과 전환 시간(기본 1.5초)으로 보간합니다. `SetEffectsEnabled(bool)`는 카메라의 효과 표시만 바꿉니다.

과거 ShaderTests의 수동 flag 토글 경로와 현재 실제 날씨 큐의 연결을 혼용하지 않습니다. WeatherChangeEvent의 선언만으로 강우·낙뢰·폭염의 전투 피해/이동 보정이 자동 연결된 것은 아닙니다.

`PlayerWeatherEffectBinding`은 씬이 지정한 로컬 actor의 PlayerLocationState.LocationChanged를 구독해 우주선 내부에서 화면 효과를 숨기고, actor 교체·Unbind·Destroy에 해제합니다. 로컬 화면 표시와 Host의 확정 출입/전체 필드 정지는 별개입니다. 전원 내부 정책은 [출입 보고 API](../core/presence-reporting.md)를 따릅니다.

이번 갱신은 실제 main의 정적 API 대조입니다. 렌더링·카메라 외형·날씨 효과·포털/네트워크 동작을 Unity에서 새로 검증하지 않았습니다.

[World 목차](../world.md) · [Core 시간·저장 API](../core/api-reference.md)
