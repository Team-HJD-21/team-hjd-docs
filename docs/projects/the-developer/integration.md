---
title: 모듈 통합 체크리스트
sidebar_position: 7
---

# The Developer 통합 체크리스트

기준은 main `789f5b44`입니다. 아래는 각 기능을 연결할 때 수행할 검증 항목이며, 이번 문서 작업에서 Unity PlayMode 검증을 완료했다는 기록은 아닙니다.

## 연결 전에

- 같은 게임 커밋과 Scene·Prefab을 사용합니다. 미병합 기능을 필요 조건으로 섞지 않습니다.
- 영역 담당과 변경할 계약을 확인합니다. [프로젝트 목차](index.md)를 참고합니다.
- 조회(snapshot)와 명령(상태 변경)을 구분합니다.
- 로컬 MonoBehaviour와 NGO NetworkBehaviour의 권한 차이를 확인합니다.

## 영역별 확인

| 연결 | 확인할 것 | 실패 시 먼저 확인 |
| --- | --- | --- |
| Core ↔ Scene | 세션 1회 연결, 정상 종료, 구독 해제 | Config/State ID, adapter Bind |
| World ↔ Core | 터렛 layout과 동적 위치 입력 분리 | LayoutChanged, Position source |
| Player → Enemy | 서버에서 한 번만 피해 적용 | Enemy 태그, EnemyHealth, IsSpawned |
| Turret → Enemy 타깃 | snapshot 읽기와 타깃 활성 상태 | registry 등록, HP, Adapter |
| Turret → Power | 명령 결과와 실제 활성 상태 일치 | PowerSourceUnavailable / InsufficientPower |
| Enemy → Core | 스폰·제거 후 공간 입력 일치 | Executor 추적 목록, Despawn |
| Spaceship ↔ Planet | 왕복·Player 위치·세션 내 데이터 | Scene 이름, Layer, JSON 참조 |

## 실수하기 쉬운 반환값

- 삭제된 범용 Core Submit을 호출하지 않습니다. 터렛·스폰의 전용 요청/결과와 실제 적용을 구분합니다.
- 터렛 `RequestActivation()`은 bool이 아니라 `FieldTurretActivationResult`입니다.
- 터렛 `ApplyDamage()`는 bool, Enemy `TakeDamage()`는 void입니다.
- `NaviProgresser.TryUpgrade()`와 `EncounterRuntime.TrySpawn()` 실패를 UI에서 성공으로 표시하지 않습니다.
- snapshot을 보관한다고 최신 상태가 계속 갱신되지 않습니다. 조회를 다시 수행합니다.

## PR 기록

확인한 Scene·실행 권한·재현 순서·기대/실제 결과를 기록합니다. 미확인 항목은 미확인으로 남깁니다. [공통 PR 가이드](../../delivery/pull-request.md)를 따르며, 이 문서를 별도의 PR 승인 정책으로 쓰지 않습니다.

## 공개 문서 검증 범위

이 사이트의 build/check는 문서 경로·검색·출처 경계와 사이트 빌드를 확인합니다. API 심볼은 별도로 기준 main의 코드와 정적으로 대조했습니다. 게임 컴파일, 플레이, 서버/클라이언트 통합 시험은 별도의 게임 검증입니다. API 변경 시 새 기준 커밋과 원본 경로도 함께 갱신합니다.


## 최신 기반 연결 확인 — main 1a03e9a9

- App 위치·Network 준비·Match 규칙 상태를 구분하고 Mission Scene 조립 실패/취소를 처리합니다.
- Feature가 실제로 구현한 난수·시간·환경·Spawn consumer만 조립합니다. 현재 Map의 Unity Random/CountTick을 Core scheduler 이관 완료로 표시하지 않습니다.
- 체크포인트는 실제 writer와 필수 키, 참조 복원, stale 비동기 결과, 전체 재실행 흐름을 함께 확인합니다.
- Player의 새 LMB 소비·Space 대시·무기 선택과 Enemy AssignTarget/EnemyAbility, 터렛 파괴 반환·자동 활성화 우선순위는 동일한 main 기준으로 연결합니다.
- Source Docs에 남은 과거 실험·보류 문구와 실제 main 심볼이 다르면 현재 코드의 연결 상태를 확인하고, 실행 검증은 따로 기록합니다.

이번 동기화의 출처·제외 범위·검사 결과는 저장소의 `planning/source-sync-2026-11-05.md`에 기록합니다.

## #623 통합 시 추가 확인

- MatchSnapshot의 초기 자료를 실제 Feature HP/전력 원본으로 사용하지 않습니다.
- FieldSimulationTime에 실제 owner를 전달하고 생성물을 같은 Scene/시간/종료 수명에 연결합니다. 독립 시험의 Unity 시간 fallback과 정식 Match 연결을 구분합니다.
- Animator 전환 중 캡처 재시도, 논리 ID 참조의 누락/중복, 모든 actor 적용 뒤 Resolve와 실패 rollback을 확인합니다.
- 환경 revision·epoch·게임 초를 함께 검사하고 v2 환경 전송에 같은 빌드를 사용합니다.
- NGO driver의 1–2인 참가자 완료 검사와 AppRoot의 남은 이동 제한을 따로 확인합니다.
