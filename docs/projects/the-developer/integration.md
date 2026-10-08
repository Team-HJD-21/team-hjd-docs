---
title: 모듈 통합 체크리스트
sidebar_position: 7
---

# The Developer 통합 체크리스트

기준은 main `eb35ceb1`입니다. 아래는 각 기능을 연결할 때 수행할 검증 항목이며, 이번 문서 작업에서 Unity PlayMode 검증을 완료했다는 기록은 아닙니다.

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

- Core `Submit()`의 `NotHandled`를 성공으로 취급하지 않습니다.
- 터렛 `RequestActivation()`은 bool이 아니라 `TurretActivationResult`입니다.
- 터렛 `ApplyDamage()`는 bool, Enemy `TakeDamage()`는 void입니다.
- `NaviProgresser.TryUpgrade()`와 `EncounterRuntime.TrySpawn()` 실패를 UI에서 성공으로 표시하지 않습니다.
- snapshot을 보관한다고 최신 상태가 계속 갱신되지 않습니다. 조회를 다시 수행합니다.

## PR 기록

확인한 Scene·실행 권한·재현 순서·기대/실제 결과를 기록합니다. 미확인 항목은 미확인으로 남깁니다. [공통 PR 가이드](../../delivery/pull-request.md)를 따르며, 이 문서를 별도의 PR 승인 정책으로 쓰지 않습니다.

## 공개 문서 검증 범위

이 사이트의 build/check는 문서 경로·검색·출처 경계와 사이트 빌드를 확인합니다. API 심볼은 별도로 기준 main의 코드와 정적으로 대조했습니다. 게임 컴파일, 플레이, 서버/클라이언트 통합 시험은 별도의 게임 검증입니다. API 변경 시 새 기준 커밋과 원본 경로도 함께 갱신합니다.
