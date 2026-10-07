---
title: Timeline·Capture·공유
sidebar_position: 8
---

# Timeline·Capture·공유

> **중요도: 중요** · 사건이 발생한 순간을 찾고 팀원에게 재현 맥락을 전달할 때 읽습니다.

## Timeline에서 사건 찾기

1. A · Record를 선택합니다. LIVE는 현재, 종료 Match/IMPORTED는 기록 조회입니다.
2. `Search source / kind / text`에 출처·이벤트 종류·문구를 입력합니다.
3. 사건 행을 선택해 Request ID, 종류/지점/개체, 계획/실제 수량과 메시지를 확인합니다.
4. 현재 활성 Scene에 남아 있는 터렛 파괴·복구 마커는 Frame으로 찾을 수 있습니다. 과거 기록에서 임의의 현재 터렛을 선택하지 않습니다.

Bookmark 입력란에 메모를 넣고 **Bookmark**를 누르면 현재 실행에 마커가 추가됩니다. “반복 시작”, “Grid 변경 직후”, “증상 재현”처럼 후속 분석에 필요한 시점을 표시하세요.

## 조건부 정지

Timeline에서 요청 실패, 터렛 파괴, Grid OOB 조건을 각각 무장합니다. 조건이 **새로 관측**되면 로컬 Editor를 한 번 정지하고 이유를 남깁니다.

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/13-timeline-controls.png" title="Timeline의 조건과 이벤트 목록" caption="조건부 정지 체크박스, Rearm / Bookmark와 RequestStarted / EnemySpawned 사건 목록입니다. 사진에서는 조건이 체크되지 않았으며, 조건부 Pause 발생이나 선택 사건 상세를 보여주는 화면은 아닙니다." />

Resume만 누르면 같은 조건을 계속 반복해 정지시키지 않습니다. 다음 발생도 잡으려면 **Rearm**으로 재무장합니다. 과거 buffer를 읽는 것은 신규 정지를 만들지 않으며, 이미 파괴된 터렛을 뒤늦게 수집했다고 새 파괴로 만들지 않습니다.

OOB가 지속 중이면 재무장 후 다시 정지할 수 있습니다. 정지는 원격 Client 전체를 멈추는 네트워크 명령이 아닙니다.

## Capture mode와 화면 캡처

Capture / Compare의 **Scene Capture preset**은 화면 공유용 표시 조합입니다. 화면을 자동 촬영하거나 동영상을 녹화하지는 않습니다. 필요한 Game/Scene View와 패널을 배치하고 직접 캡처하세요.

Capture mode는 새 시간·Grid·스폰 명령을 숨기거나 비활성화하지만, 이미 실행 중인 반복 요청과 무장 조건부 정지를 자동 중단하지 않습니다. 고정된 장면이 필요하면 먼저 반복을 Stop하고 필요에 따라 Pause합니다.

## Build 라벨과 파일 내보내기

1. Scene capture / metadata에서 Commit·Build를 식별할 라벨을 입력합니다. 도구는 Git commit을 자동 추측하지 않습니다.
2. **Stamp build/commit label on live record**로 현재 기록에 라벨을 반영합니다.
3. **Copy capture metadata** 또는 **Copy context**로 Scene·Match·revision·Grid 맥락을 복사합니다.
4. Record export / import를 펼치고 필요한 파일을 저장합니다.

<GuideMedia type="image" src="/img/editor-tools/the-developer/game-debugger/14-export-and-metadata.png" title="Capture 메타데이터와 Export / Import" caption="라벨·Stamp·Copy와 JSON / events CSV / samples CSV / Import 버튼의 위치입니다. 사진의 기록은 PARTIAL이고 Build 라벨은 미기록입니다. 공유 전 실제 라벨과 수집 상태를 확인하며, 이 화면 자체가 파일 저장 성공을 뜻하지는 않습니다." />

| 버튼 | 용도 |
| --- | --- |
| Export run JSON + metadata | 관측 기록·메타데이터와 보존된 요청 상세를 다른 사람이 다시 조회 |
| Export events CSV | 요청/실제 생성·사망·제거 등 사건 분석 |
| Export samples CSV | 생존 수·전력·기하 등 시간 표본 분석 |
| Import read-only comparison JSON | 이전 기록을 IMPORTED 슬롯으로 불러와 조회/비교 |

파일 경로는 직접 선택합니다. 의도하지 않게 저장소에 자료가 들어가거나 개인 경로·네트워크 식별 정보가 공개되지 않도록 공유 전 내용을 확인하세요.

## A/B 비교

종료한 Match 또는 Imported JSON을 A/B로 선택하고 Statistics의 clock/bin/필터를 맞춥니다. Scene/Stage·난이도·content/Build 라벨, PARTIAL/생략 여부가 다른 기록을 같은 조건의 실험처럼 비교하지 않습니다.

Import는 **읽기 전용 관측 비교**입니다. 기록의 Scene이나 GameObject를 다시 생성하지 않고 Match를 재실행하지 않습니다. 정확한 Replay나 Runtime Grid override의 전체 변경 이력을 복구하는 기능도 아닙니다.

## 기록의 수명과 상한

- 공용 수집은 창 수와 무관하게 동작하며 창을 닫아도 Match를 종료하지 않습니다.
- 실행은 8개, 실행별 이벤트 8,192·표본 7,200·마커 512 상한입니다. 오래된 자료 제거와 손실을 표시합니다.
- Runtime 최근 이벤트와 무거운 요청 상세는 별도 상한이 있으므로 기록이 항상 완전하다고 가정하지 않습니다.
- domain reload/다음 Play에서는 Editor SessionState의 제한된 크기로 복원합니다. Editor를 완전히 종료하기 전에 필요한 기록을 JSON Export하세요.
- Import는 16MiB/schema와 수치·시간·컬렉션 조건을 검사합니다. 무효 파일을 정상 관측값처럼 표시하지 않습니다.

## 팀원에게 보낼 최소 자료

```text
Scene / Build 또는 commit 라벨:
Match ID / Battlefield revision:
Request ID / source / preset / 요청 예산:
재현 순서와 기대 결과:
실제 결과와 후보 Reason 또는 Timeline 사건:
화면 + 관측 JSON/CSV:
```

화면 한 장만 보내기보다 **현재 상태인지 요청 당시 상태인지**도 적어주세요. 생략/부분 기록과 미관측값은 숨기지 않습니다.

## 다음에 읽을 문서

[Statistics 비교 기준](statistics.md) · [Spawn evidence](spawn-inspection.md) · [팀 문서 기여](../../../team/document-contribution.md)
