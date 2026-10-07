---
title: The Developer
sidebar_position: 1
---

# The Developer 에디터 도구

> **중요도: 중요** · 프로젝트의 개발용 창과 Scene 표시 기능을 사용할 때 읽습니다.

## Game Debugger

Game Debugger는 Match의 상태와 실제 관측 기록을 모아서 보는 Unity Editor 도구입니다. 하나의 창에서 여러 패널을 동시에 보고, Scene Overlay·Gizmo·통계 창으로 같은 자료를 탐색합니다.

| 하고 싶은 일 | 읽을 문서 |
| --- | --- |
| 처음 열고 스폰까지 확인 | [빠른 시작](game-debugger/quick-start.md) |
| 여러 패널을 함께 보기, 배속·Pause·Step | [창 구성과 시간 제어](game-debugger/window-and-time.md) |
| Grid·셀 점유·터렛 영역·외곽선 확인 | [Battlefield와 Scene 도구](game-debugger/battlefield.md) |
| 한 번 또는 일정 간격으로 스폰 요청 | [Encounter 요청과 반복 실험](game-debugger/encounter.md) |
| 요청·생성·사망 추이와 기록 비교 | [Statistics와 그래프](game-debugger/statistics.md) |
| 어떤 지점에서 왜 생성됐는지 확인 | [Spawn 판단과 분포 검사](game-debugger/spawn-inspection.md) |
| 사건에서 멈추고 팀원에게 자료 공유 | [Timeline·Capture·공유](game-debugger/timeline-and-sharing.md) |
| 메뉴 없음, 스폰 실패, N/A 등 해결 | [문제 해결](game-debugger/troubleshooting.md) |

:::info 사용법의 기준
2026-10-08 확인한 게임 저장소의 `feature/core` 작업본 `9fc3a458` 기준입니다. 기존 [프로젝트 API](../../projects/the-developer/index.md)의 main 기준과 다를 수 있습니다. 도구의 커밋이 포함된 체크아웃을 사용하고, 팀원이 다른 버전에서 메뉴나 필드를 찾지 못하면 먼저 코드를 동기화하세요.

실제 사진 6장과 영상 6개를 사용법에 연결했습니다. 사진은 클릭하면 원본 크기로, 영상은 재생·탐색·전체화면 컨트롤로 볼 수 있습니다. 화면은 해당 촬영 시점의 예시이며 전체 전투·밸런스·승패 검증을 완료했다는 의미는 아닙니다.

Spawn Inspector의 service·pending·score 열과 셀 단위 분산 설명은 **2026-10-08 Spatial Spawn Distribution 후속 패치**(`ea31faf7` 정책, `9fc3a458` 진단/UI)를 포함합니다. `36a05922`만 있는 버전에는 이 열이 없으므로 후속 코드까지 반영한 상태에서 사용하세요.
:::

## 관측과 게임 로직의 경계

Core가 전장 자료를 계산하고 Encounter/Enemy가 실제 스폰을 결정·실행합니다. Editor는 실제 자료를 조회하거나 명시적인 요청을 전달합니다. 창을 늘린다고 Match나 수집기를 여러 개 만들지 않습니다.

[Game Debugger 개요](game-debugger/index.md) · [The Developer 프로젝트 API](../../projects/the-developer/index.md)
