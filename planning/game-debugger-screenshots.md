# Game Debugger 사용법 · 사진/영상 대응표

2026-10-08 · 제공 자료를 삽입하고 localhost에서 검증했다. 사용자가 함께 미리보기를 확인하며 검증 종료 후 배포를 승인했다. 이 파일은 `docs/` 밖의 편집용 기록이며 공개 문서 페이지로 생성되지 않는다.

## 전달 순서와 사용 위치

| 번호 | 종류 | 본문 | 저장 파일 | 실제 화면의 범위 |
| --- | --- | --- | --- | --- |
| #1 | 사진 | quick-start · 창 열기 | 01-open-menu.png | Tools → TeamHJD → Game Debugger |
| #2 | 사진 | quick-start · 기본 모니터 | 02-monitor-four-panels.png | 네 패널 배치. Edit Mode PREVIEW / N/A이며 SERVER 실행 증거가 아님 |
| #3 | 영상 | window-and-time · 시간 toolbar | 03-time-controls.mp4 | 배속·시간 제어 예시. Stop repeat / Play 종료 / Restore 의미는 본문에서 구분 |
| #4 | 제외 | battlefield | — | 사진 자리만 제거. Grid/셀 선택 기능 설명은 유지 |
| #5 | 사진 | battlefield · 전선 변 검사 | 05-frontline-inspector.png | 선택 변·기하 법선·ID/길이/중점 상세 |
| #6 | 영상 | battlefield · Grid 설정 | 06-grid-settings.mp4 | Edit Mode PREVIEW의 공용 기본값과 Scene 표시. 실제 Runtime override 적용 장면은 없음. 방법 설명은 유지 |
| #7 | 영상 | encounter · 일회 요청 | 07-encounter-request.mp4 | 요청과 planned/actual |
| #8 | 영상 | encounter · 연속 요청 | 08-repeat-running.mp4 | 반복 설정과 RUNNING |
| #9 | 영상 | statistics · 보기와 기록 | 09-time-series.mp4 | 시간 bin 기반 선 그래프. 막대 히스토그램으로 표기하지 않음 |
| #10 | 영상 | statistics · 큰 창 | 10-statistics-window.mp4 | 통계 독립 창. A/B 준비·검증 증거로 확대 해석하지 않음 |
| #11 | 제외 | spawn-inspection | — | 사진 자리만 제거. 지도/후보 표 설명은 유지 |
| #12 | 사진 | encounter · 최근 요청 표 | 12-request-results.png | 요청별 계획 10 / 생성 10 / OK. 개별 Network ID·생성 XY 목록은 아님 |
| #13 | 사진 | timeline-and-sharing · 조건부 정지 | 13-timeline-controls.png | 조건 UI와 이벤트 목록. 조건 미선택이며 실제 Pause/선택 상세 증거는 아님 |
| #14 | 사진 | timeline-and-sharing · 내보내기 | 14-export-and-metadata.png | metadata/export 버튼 위치. PARTIAL / Build 미기록. 파일 저장 성공 증거가 아님 |

#12는 원래 Spawn Inspector 개체 목록 자리였지만 실제 사진은 Encounter 요약 표다. 의미에 맞게 Encounter로 옮기고 Spawn Inspector에서 상세 사용법과 교차 링크를 유지했다. #13은 조건부 정지 조작 설명과 함께 두되 실제 정지 발생 화면이 아니라는 caption을 명시했다.

## 파일 관리와 표시

- 사진: `static/img/editor-tools/the-developer/game-debugger/`
- 영상: `static/video/editor-tools/the-developer/game-debugger/`
- 대응 manifest: [game-debugger-media.json](game-debugger-media.json)
- 제공된 12개 원본과 복사본의 SHA-256 일치를 확인했다. 원본을 잘라내거나 재인코딩하지 않았다.
- 공용 `GuideMedia` 카드로 표시한다. 이미지는 원본 비율을 유지하고 클릭하여 크게 볼 수 있다.
- 영상은 `controls / playsInline / preload=metadata`를 사용한다. 자동 재생은 하지 않으며 원본 영상 링크도 제공한다.
- 영상은 브라우저 기본 재생·탐색·전체화면 기능을 사용한다. CSS는 라이트/다크와 좁은 화면에서 기존 문서 스타일을 따른다.
- 개인 계정·네트워크 식별 정보 등 공개 범위를 배포 승인 전에 사용자가 최종 확인한다.

## 로컬 확인

```bash
npm run check
npm run build
npm run serve -- --host 127.0.0.1 --port 3000 --no-open
```

시작 주소: `http://localhost:3000/docs/editor-tools/the-developer/game-debugger/quick-start`

확인 순서: 메뉴/네 패널 → 시간 제어 영상 → 전선/Grid → 일회/반복 요청 → 선 그래프/독립 창 → Timeline/Capture.

자동 검사는 nav/목차/Markdown 링크, 12개 미디어의 연결·존재·파일 signature와 번호 표식 제거를 확인한다. 실제 브라우저에서는 로딩/재생/탐색, 전체화면·원본 링크와 가독성을 별도로 확인한다. 자료에 나타나지 않은 게임 기능까지 검증 완료로 기록하지 않는다.
