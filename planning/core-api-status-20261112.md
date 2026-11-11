# Core 서비스 문서 동기화

작성일: 2026-11-12. PR: 생성 후 번호 기록. 대조 기준: 게임 main `2cbc4542b`.

## 바뀐 페이지

- 프로젝트 Docs → The Developer → Core에 **현재 사용할 수 있는 기능**, **CameraManager와 시점 전환**, **Audio 구현 상태**를 추가했다.
- Core 목차/API 참조와 검색에서 새 페이지를 찾을 수 있다.
- 지역 API와 Game Debugger Battlefield에 CU 시작 셀·4방향 연결·Host 설정·저장 호환성 안내를 추가했다. 기존 영상의 범위는 유지한다.

CameraManager의 Current/PushView/Dispose·블렌드·로컬 출력 수명을 설명한다. 오디오는 아직 공용 서비스가 없으며 AudioListener 선택과 다르다는 점을 명시한다. 가상의 재생 API를 사용 예제로 제공하지 않는다.

공개할 기술 계약과 한계만 옮겼다. 원본 코드·게임 에셋·요구사항 CSV·회의록·미공개 기획은 복사하지 않았다. 자동 원본 import나 배포 시 게임 저장소 의존성도 추가하지 않았다.

## 확인

- `npm run check` 통과: 프로젝트/아카이브 격리, API 문서·검색, 도구 11페이지·이미지 6장/영상 6개 연결, Markdown 렌더/검색 강조.
- `npm run build` 통과: production 정적 파일 생성.
- 새 3페이지의 실제 HTML 존재·본문과 검색 색인 포함 확인.
- 이번 문서 동기화에서 Unity 실행 검사를 재수행하지 않았다. 인용한 기존 게임 검사의 범위와 문서 검사를 구분한다.

기존 Docs 작업 브랜치는 보존하고 최신 main `05fd861`의 별도 worktree에서 작업했다. 배포·병합 상태는 PR의 실제 결과를 확인한다.
