---
title: Leave Me Alone
sidebar_position: 2
---

# <LeaveMeAloneLogo /> 프로젝트 문서

:::info 문서 기준
Unity 저장소 [`Team-HJD-21/unity-6-leave-me-alone`](https://github.com/Team-HJD-21/unity-6-leave-me-alone)의 최신 확인 `main` 커밋은 `6221b11ba0926c9e6b49e781f6a2eb78285ffbbc` (2026-10-15)입니다. 문서는 저장소의 Docs와 README에서 공개 가능한 프로젝트 안내를 정리합니다. 코드·원본 에셋 묶음·회의록·내부 기획 자료는 복사하지 않았습니다. 게임 동작은 정적 소스 확인 기준이며 Unity 플레이 검증을 뜻하지 않습니다.
:::

**LEAVE ME ALONE!!!**은 토마토 농장을 운영해 AI 농부보다 높은 점수를 얻는 경쟁 게임입니다. 플레이어는 작물을 심고 물을 주어 키운 뒤 수확하며, 경기 중 얻은 차량과 드론 아이템을 사용합니다.

저장소는 Dedicated Server 멀티플레이어를 지향하지만, 확인한 `main`의 게임플레이는 로컬 플레이어와 AI 농부가 한 실행 환경에서 경기하는 구조입니다. 네트워크 패키지 설치만으로 온라인 대전이나 서버 권한 상태 동기화가 구현됐다고 판단하지 않습니다.

## 문서 안내

| 문서 | 내용 |
| --- | --- |
| [게임플레이 흐름](gameplay-flow.md) | 경기 시작·종료, 작물 상태와 아이템 연결 |
| [플레이어 가이드](player-guide.md) | 조작, 작물 관리, 점수와 보상 |
| [The Boss 안내](boss-guide.md) | AI 농부의 역할과 확인 범위 |
| [아이템 사용 안내](items-guide.md) | Pickup Truck, Boost Drone, Toxic Drone의 코드 기준 동작 |
| [Unity 설정](unity-setup.md) | Editor 버전, 패키지, 빌드 씬과 입력 설정 |

## 현재 구현과 방향

- **코드에서 확인한 현재 흐름:** 5분 경기, 로컬 Player 입력, Behavior Graph 기반 AI 농부, 작물 성장·수확, 점수 비교에 따른 결과 씬 이동.
- **저장소가 지향하는 방향:** Dedicated Server 기반 멀티플레이어.
- **완료로 간주하지 않는 항목:** 온라인 매치, 서버 권한 판정, 클라이언트 간 작물 상태 동기화.

문서의 상세 수치와 제한은 각 문서에서 확인 기준과 함께 설명합니다.
