---
title: Spawn 판단과 분포 검사
sidebar_position: 7
---

# Spawn 판단과 분포 검사

> **중요도: 중요** · 어떤 적이 어디에, 왜 그 수량으로 생성됐는지 확인할 때 읽습니다.

## 시간 그래프와 다른 점

Time series는 “언제 얼마나 발생했는가”, Spawn Inspector는 “**그 요청이 어떤 공간 자료로 판단됐는가**”를 보여줍니다. 현재 Scene을 다시 계산해 과거 요청처럼 표시하지 않습니다.

Statistics → **View → Spawn decisions / distribution**을 선택합니다. A · Record에서 LIVE 또는 종료/Imported 기록을 고를 수 있습니다.

## Request 선택과 고정

`Request`에서 게임 시간·출처·preset·계획/실제 수량·revision을 확인하며 요청을 선택합니다. 요청 번호는 Match 안의 번호이므로 **Match ID와 Request ID를 함께** 해석합니다.

**Follow latest**를 켜면 최신 요청을 따라갑니다. 목록에서 요청을 직접 선택하면 Follow가 꺼지고 해당 자료가 고정됩니다. 선택/필터/검색/지도 zoom·pan은 영역별로 보존됩니다.

고정된 상세가 최근 32개 보존 범위를 벗어나면 unavailable로 표시합니다. 다른 요청을 같은 자료인 것처럼 자동 대체하지 않습니다. 다시 선택하거나 Follow를 켜서 이동하세요.

## 당시 지도와 후보 표

`Decision snapshot · XY`에서 당시 Grid/점유/외곽과 생성 지점을 봅니다.

| 표시 | 의미 |
| --- | --- |
| 주황 선 | 당시 기하 외곽 |
| 파란 점 | 완전한 preset 세트를 배정받은 지점 |
| 회색 점 | 미배정 지점. 실제 제외인지 예산 소진인지 Reason으로 구분 |
| 초록 점 | 실제 생성된 객체의 생성 순간 XY |
| 셀의 적 밀도/아군 점유 색 | 당시 Enemy 및 Player/Turret 점유 |



휠로 확대/축소, 왼쪽 또는 가운데 버튼 드래그로 이동합니다. 4px를 넘는 드래그는 클릭 선택으로 처리하지 않습니다. **Frame snapshot**은 당시 지도 전체 범위로 돌아갑니다. Unity Scene 카메라를 이동시키는 Frame Grid와는 다른 조작입니다.

`Candidates · eligibility and allocation`에는 지점 ID, cell, 초기 Enemy 수, service·예정량·최종 부하, 전선 거리, assigned sets, Reason이 표시됩니다. `Search point / reason`으로 문제 지점이나 사유를 좁힙니다.

## 현재 공간 배정 정책 읽기

1. 비활성/점령 상태 등 생성 불가 지점을 제외합니다.
2. Grid 밖, Player/Turret 점유 셀, 중복/누락 ID를 공간 후보에서 제외합니다. 정상 등록의 복제 ID는 앞 단계에서 보정됩니다.
3. 같은 Grid 셀의 후보를 묶습니다. `cell service + 현재 Enemy 수 + 이번 요청의 셀 예정량`이 작은 셀을 선택하며, 예정량은 같은 셀의 모든 후보가 공유합니다. 복제 지점 수만큼 셀 비중이 늘어나지 않습니다.
4. 셀 내부에서는 `point service + 지점 예정량`으로 지점을 분산합니다. 셀 동률은 현재/예정 적 부하 → 전선 거리 → ordinal ID, 지점 동률은 전선 거리 → ID입니다.
5. 프리셋의 완전한 세트만 배정합니다. 남은 예산으로 새로운 부분 세트를 만들지 않습니다. 실제 생성만 이력에 반영하고 실패/미실행 계획은 소비하지 않습니다.

| 새 진단 열 | 읽는 방법 |
| --- | --- |
| Cell service | 요청 시작 시 셀의 서비스 부하 |
| Cell pending | 전체 요청 배정 후 셀의 예정 적 수. 같은 셀의 후보에서 동일 |
| Final cell score | service + 현재 적 + 최종 예정량. 매 세트 선택 순간의 점수는 아님 |
| Point service | 요청 시작 시 지점의 서비스 부하 |

service는 분산을 위한 **가상 부하**이며 실제 생성 누계나 생존 수가 아닙니다. 신규/재활성 셀은 현재 셀의 최소 service부터, 신규 지점은 해당 셀의 최소 point service부터 시작해 과거 미참여 기간을 몰아주지 않습니다. 이전 기록의 미계측 열은 N/A입니다.

새 Match 또는 XY Grid 설정을 바꾸면 이력을 초기화하고, 표시용 Z·revision·전선 기하 변경만으로는 초기화하지 않습니다. 적이 셀을 떠나도 기존 생성 기회를 기억하므로 가까운 스포너만 계속 선택하지 않습니다. 반복 실험에서는 지점별 수량만 아니라 **셀별 생성 합계**를 비교하세요. 같은 셀의 여러 지점은 한 셀의 생성 비중을 나눠 갖는 것이 정상입니다.

전선이 없으면 거리 우선순위를 전술 점수처럼 해석하지 않습니다. 이 화면은 실제 정책의 관측 결과이며 가상의 suitability 점수나 AI 판단 이유를 만들어 표시하지 않습니다.

## 계획과 실제 결과

`Planned composition · actual result`에서 **지점·종류별 계획 수와 실제 관측 수**를 비교합니다. 같은 종류가 프리셋에 여러 항목으로 등장하면 합산 결과로 확인합니다.

`Actual objects · immutable spawn positions`를 펼치면 Network ID, 몬스터 종류, 생성 지점, 생성 순간 world XY를 볼 수 있습니다. **현재 이동 좌표가 아닙니다.**

요청 전체의 planned/actual 합계는 [Encounter 결과 표 예시](encounter.md#최근-요청-표-읽기)에서도 볼 수 있습니다. 개별 생성 지점·Network ID·생성 XY는 위 두 상세 표에서 확인합니다. 요청 요약과 개체 목록을 혼동하지 마세요.

`Monster` 필터는 계획/실제 객체 표와 지도 실제 점을 같은 기준으로 좁힙니다. 후보 판단은 분대 전체에 대한 것이므로 후보 표까지 특정 몬스터의 판정으로 바꾸지 않습니다.

계획 이후 점령/비활성 전환, catalog/필수 prefab 구성 누락, 분대 등록 실패는 Executor 거부 사유로 확인합니다. 공간 정책에 들어가기 전 Match/catalog/권한 단계에서 실패한 요청은 공간 상세 자체가 없을 수 있습니다.

## Scene 객체와 연결

후보 행/지도에서 지점을 선택하거나 실제 객체 행에서 개체를 선택한 뒤 **Select ... in Scene**을 사용합니다.

- 같은 활성 Match의 현재 객체만 찾습니다.
- 종료/Imported 기록은 과거 객체를 임의로 현재 객체에 대응시키지 않습니다.
- 이미 제거된 개체나 모호한 중복 지점은 실패 사유를 표시합니다.
- Scene에서 현재 위치로 Frame되더라도 Inspector의 과거 XY는 변하지 않습니다.

## 자료 복사와 표시 상한

**Copy request evidence**로 선택한 관측 자료의 JSON을 복사합니다. Request ID, Match·revision, 후보·계획·실제 결과와 함께 공유하세요. 이 자료는 게임 저장/상태 복원/결정론적 Replay 파일이 아닙니다.

현재 상세 보존은 최근 32개 요청, 요청별 후보 256·plan 512·actual 512, 점유 셀/전선 각각 1,024 항목 상한입니다. 삭제/생략 수를 알립니다. actual 상세가 잘렸다면 표는 **captured actual**이며 요청 전체 생성 합계를 대체하지 않습니다. 중요한 요청은 상한에서 사라지기 전에 Export하세요.

지점 중심으로 Grid 후보를 판정하고 spawnRadius 안의 실제 XY는 무작위 분산됩니다. 반지름 안의 모든 생성 위치가 별도로 적합성 검사를 통과했다고 해석하지 않습니다.

## 다음에 읽을 문서

[Encounter 요청 규칙](encounter.md) · [현재 Scene과 전선](battlefield.md) · [기록 공유](timeline-and-sharing.md)
