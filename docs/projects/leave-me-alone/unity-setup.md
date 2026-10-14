---
title: Unity 설정
sidebar_position: 6
---

# Unity 프로젝트 설정

:::info 확인 범위
원본 `main` 커밋 `03e20da0eeef6350f2a26807811d81c55bea74dd`의 README와 프로젝트 설정을 기준으로 정리했습니다. 로컬 설치·컴파일·빌드 성공을 의미하지 않습니다.
:::

## Editor와 프로젝트 열기

기준 Unity Editor는 `6000.0.75f1`입니다. Unity Hub에서 프로젝트 루트를 열고 Package Manager가 프로젝트 패키지를 복원하도록 기다립니다. 첫 씬을 열기 전에 스크립트 컴파일이 끝났는지 확인하세요.

Netcode for GameObjects, Multiplayer Services, Vivox, Unity Behavior, URP, Cinemachine 등의 패키지가 설정에 있습니다. 패키지가 설치되어 있다는 사실만으로 대응 기능이 현재 게임 흐름에서 연결·검증됐다고 볼 수 없습니다.

## 빌드 씬

활성 빌드 씬 순서는 다음과 같습니다.

1. `GameStartScene`
2. `MainGameScene`
3. `GameWinScene`
4. `GameLoseScene`
5. `GameTieScene`

## 입력

현재 Player 조작은 Unity의 기존 입력 API와 기본 입력 축 설정을 이용합니다. Input System 패키지가 포함되어 있어도 Player가 Input Actions를 사용한다고 단정하지 않습니다.

이 안내는 Unity Editor 실행, Dedicated Server 빌드, 네트워크 매치 테스트를 기록하지 않습니다. 해당 검증을 추가할 때는 사용한 Editor·빌드 대상·씬과 결과를 함께 남기세요.
