---
title: 문제 해결과 사용 한계
sidebar_position: 9
---

# 문제 해결과 사용 한계

> **중요도: 참고** · 화면이 비어 있거나 요청/조회가 기대와 다를 때 사용합니다.

## 메뉴와 연결

| 증상 | 확인 순서 |
| --- | --- |
| Game Debugger 메뉴가 없다 | 문서 기준의 도구 커밋이 포함됐는지 → Console 컴파일 오류 → Tools / TeamHJD 확인 |
| 예전 Battlefield Debug 창이 없다 | 제거된 독립 창을 찾지 말고 Game Debugger의 Battlefield 패널 사용 |
| NO RECORD / N/A | Play Mode → 활성 Match → 진단 source → 권한. Client 미관측을 0으로 해석하지 않기 |
| Request 버튼이 없다/비활성 | Capture 해제 → Play Mode → snapshot/Host/Executor/catalog 준비 → 화면의 반환 사유 |
| Play 재진입 후 이전 Match 값이 없다 | 종료 기록은 A · Record에서 선택. 현재 Match와 이전 실행은 분리됨 |

이미 구성된 Scene을 무조건 재설치하거나 검증 조건을 제거하지 않습니다. 연결 경고와 요청 반환 사유를 먼저 읽습니다.

## 스폰

| 증상 | 확인 순서 |
| --- | --- |
| 지점을 늘렸는데 수량이 그대로 | 전체 요청 예산/프리셋 세트 크기 → 후보 배정. 지점 수만큼 예산은 자동 증가하지 않음 |
| 특정 지점에 생성되지 않는다 | Candidates의 ID/Reason → 비활성·점령 → Grid 밖/Player·Turret 점유 → 기존 밀도/거리/예산 소진 |
| 계획보다 actual이 작다 | Planned composition의 실행 거부 사유 → 계획 이후 상태 변경/catalog/prefab 구성 |
| 반복이 중지됐다 | 화면의 중지 사유 → 실패/권한 상실/Match 교체/reload/소유 pane dispose |
| 간격 설정을 바꿨지만 기존대로 실행 | 시작 때 고정된 설정. Stop 후 다시 Start |
| 생성됐지만 이동·공격하지 않는다 | 타깃 등록·Enemy AI·서버 권한·전투 연결은 Enemy/관련 Owner와 확인. 생성 성공이 이동 성공을 인증하지 않음 |

## Scene과 통계

| 증상 | 확인 순서 |
| --- | --- |
| Grid/전선이 보이지 않는다 | Scene Gizmos + Scene layers + 레이어 → Frame Grid → LIVE/PREVIEW → 비공선 터렛 3개 이상 |
| Overlay가 없다 | Scene View Overlays 메뉴에서 Battlefield 표시 |
| 클릭해도 셀/변이 선택되지 않는다 | 해당 pick 모드 → 다른 pick과 상호 배제 → Alt 카메라 조작 여부 |
| 범위 변경 뒤 셀 내용이 다르다 | Grid 분할 변경으로 cell ID/bounds가 바뀌었는지. 과거 번호를 동일 위치로 단정하지 않기 |
| 그래프가 최신을 따라가지 않는다 | 수동 X 탐색 후 Follow latest 다시 켜기 |
| Y 범위가 맞지 않는다 | Auto Y 활성화/보이는 series·X 구간 확인 |
| 고정 요청이 unavailable | 최신 상세 보존 상한. 다른 요청/Follow 또는 저장한 JSON 조회 |
| 과거 개체가 Scene에서 선택되지 않는다 | 종료/Imported Match 또는 제거된 객체. 당시 좌표는 Inspector 지도에서 확인 |
| 배치한 스포너가 다음 실행에 사라졌다 | Play Mode 복제 또는 Edit Mode Scene 미저장 여부. 도구의 기록 Export가 Scene 저장을 대신하지 않음 |

## 기능 범위

이 도구가 제공하는 것은 현재 프로젝트의 Match·기하·스폰 관측과 Editor 실험 명령입니다. 다음은 별도 도구/Feature 계약이 필요합니다.

- CPU/GPU·프레임 비용: Unity Profiler.
- 일반 오류·stack trace: Console과 해당 Feature 테스트.
- 일반 AI 의사결정 이유·타깃 점수, 피해/DPS, 네트워크 packet trace: 현재 진단 계약에 없는 자료.
- 실제 전술 우세·influence map·최종 Wave/승패·밸런스 판정: 별도 게임 로직과 통합 검증.
- 결정론적 Replay/상태 복원: 관측 JSON Import와 다른 기능.

## 해결되지 않으면

[공유 양식](timeline-and-sharing.md)에 맞춰 버전·Scene·Match·Request·실제 사유와 기록을 전달합니다. 수치를 추측해 채우거나 PARTIAL/N/A를 정상 총량으로 바꾸지 않습니다.
