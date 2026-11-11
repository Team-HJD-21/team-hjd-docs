---
title: Audio 구현 상태
---

# Audio 구현 상태

**중요 · 효과음이나 BGM을 연결하기 전에 읽습니다.** 2026-11-12 main `2cbc4542b` 기준으로 새 공용 AudioManager/BGM/SFX 서비스는 아직 없습니다.

## 지금 코드에 있는 것

- 기존 `AudioManager` 실행 코드는 Legacy 제거 때 걷어냈습니다.
- FieldTurret의 발사·ON/OFF·미사일·폭발 및 `WitchSound` 등에 옛 호출이 주석으로 남아 있습니다. 이 주석은 사용 가능한 새 API 예시가 아닙니다.
- CameraManager는 로컬 출력의 AudioListener를 선택합니다. 음악·효과음 재생, AudioSource 관리, 믹서/볼륨을 제공하는 기능은 아닙니다.

| 필요한 기능 | 현재 상태 |
| --- | --- |
| 공용 BGM/SFX 요청 API | 미구현 |
| 음악의 Scene 전환·유지·정리 | 미연결 |
| 효과음별 클립/설정과 실제 Feature 호출 | 미연결 |
| 볼륨·믹서와 설정 저장 | 완료 계약 없음 |
| 출력 AudioListener 선택 | 기존 CameraManager가 담당 |

## 현재 연결할 때의 주의

옛 `AudioManager.Instance.PlaySfx` 주석을 그대로 풀면 없는 타입을 참조하게 됩니다. Feature마다 임의의 전역 AudioManager를 새로 만들기 전에 Core의 공용 재생 계약을 마련해야 합니다. 현재 문서에 `AppServices.Audio`나 가상의 `PlayBgm` 함수를 사용 가능한 API로 안내하지 않습니다.

Core 공용 계약을 준비할 때 클립 식별자·재생 위치·반복 효과음의 시작/정지·Scene/App 수명·볼륨 설정을 정하고, 실제 Feature 담당자에게 바꿀 호출부를 알린 뒤 연결합니다. 이 항목은 다음 구현에서 결정할 범위이며 현재 제공된 API를 뜻하지 않습니다.

[현재 사용할 수 있는 기능](implementation-status.md) · [CameraManager와 AudioListener 경계](camera-management.md)
