---
title: 진행 상태·날씨 큐와 저장 실험
---

# 진행 상태·날씨 큐와 저장 실험

**기준:** main `789f5b44` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

## 진행 상태 실험 API

| API | 현재 동작 |
| --- | --- |
| `SpaceshipProgressReader.MissionData` | 현재 선택 미션 데이터 |
| `SpaceshipProgressReader.ProgressData` | coin·progressLevel 데이터 |
| `SpaceshipProgressReader.Load<T>(...)` | 초기 JSON 또는 이번 세션에서 저장한 JSON을 객체에 덮어쓰기 |
| `MissionProgresser.AdvanceMission()` | 선택 미션을 1과 2 사이에서 전환 후 저장 |
| `NaviProgresser.TryUpgrade()` | coin이 1 이상이면 1 소비·level 증가·저장, 아니면 false |

현재 파일명은 코드 그대로 `PocMissonData.json`과 `PocProgressData.json`입니다. 경로는 `Application.persistentDataPath`입니다. 철자를 임의로 고치면 기존 파일 조회와 달라집니다.

:::warning 정식 저장 계약이 아닙니다
`SaveSession` 플래그는 런타임 시작 때 false로 초기화됩니다. 파일이 있어도 이번 세션 저장 플래그가 없으면 초기 TextAsset을 읽습니다. 재실행 후 영구 진행 복구·Cloud Save·Core Reward transaction이 완성됐다고 설명하지 않습니다. Reader 참조와 초기 JSON이 없으면 동작하지 않습니다.
:::

## Map 날씨 큐와 변경 알림

**추가 기준:** main `4ff1e77d524abff9126c010ad99ef075ecef2069` (#537) · **원본:** `Assets/Scripts/Map/WeatherManager.cs`, `CountTick.cs`, `WeatherChangeEvent.cs`. 아래 타입의 네임스페이스는 `Map`입니다.

| 공개 API | 계약 |
| --- | --- |
| `WeatherManager.CurrentWeather` | 현재 날씨 조회. 초기 기본값 SUNNY |
| `WeatherManager.ChangeWeather()` | 예정 큐에서 하나를 꺼내 현재 날씨로 적용하고 큐 보충 후 변경 알림 |
| `WeatherManager.OnWeatherChange` | static Action 필드. 현재 Weather와 실제 Queue를 전달하며 += / -=로 수명에 맞게 구독·해제 |
| `WeatherManager.Weather` | SUNNY / RAIN / THUNDERSTORM. WEATHER_MAX는 THUNDERSTORM의 별칭이며 추가 날씨가 아님 |

WeatherManager와 CountTick을 같은 GameObject에 구성합니다. WeatherManager는 WeatherChangeEvent 컴포넌트를 요구합니다. CountTick은 Start에서 기본 5초 간격으로 ChangeWeather를 호출하며 WaitForSeconds를 사용하므로 게임 시간·timeScale의 영향을 받습니다.

예정 큐의 기본 길이는 5이며 최소 1개로 보충합니다. 추첨 기본 가중치는 SUNNY 3, 나머지 날씨 각각 1입니다. 큐는 초기화 시 미리 채우고 변경마다 하나를 소비한 뒤 다시 채웁니다. 초기 Start는 표시를 갱신하지만 OnWeatherChange 초기 알림을 발행하지 않으므로 구독 직후 현재 값은 CurrentWeather로 읽습니다.

알림의 Queue는 불변 Snapshot이나 복사본이 아닙니다. 소비자는 Dequeue·Clear·Enqueue로 수정하지 말고 보관이 필요하면 ToArray()로 자체 복사합니다. static 알림에는 발신 Manager 식별자가 없으므로 씬 수명과 복수 Manager 구성을 확인하고 구독을 반드시 해제합니다.

현재 ChangeWeather 경로는 날씨·예정 큐·알림과 연결된 임시 Image 색상을 갱신합니다. WeatherChangeEvent의 ChangeWeatherRain / ChangeWeatherThunder 필드는 선언돼 있지만 이 메서드에서 호출하지 않습니다. ParticleSystem 참조만으로 날씨별 재생·피해·이동 보정이 연결됐다고 가정하지 않습니다. 서버 권한·RPC·저장/복원 계약은 추가되지 않았습니다.

실제 씬에서 초기 값, 연속 변경과 큐 길이, 일시정지, 구독 해제와 재진입, 표시 참조 누락을 확인하세요. 이번 동기화는 API 정적 확인과 문서 빌드이며 날씨 연출의 플레이 검증을 수행하지 않았습니다.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)
