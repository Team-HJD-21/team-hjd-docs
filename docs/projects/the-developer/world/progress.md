---
title: 진행 상태와 저장 실험
---

# 진행 상태와 저장 실험

**기준:** main `eb35ceb1` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

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

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)
