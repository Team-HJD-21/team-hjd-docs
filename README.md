# TeamHJD Tech Docs

## 프로젝트 탐색 구조 (2026-10-05)

상단 프로젝트 API는 `/docs/projects`로 직접 이동합니다. 프로젝트 선택 → The Developer → 모듈별 목차/하위 문서 순서로 읽습니다. Core·Player·World/Spaceship·Enemy를 목적별 18개 하위 문서로 분리했으며 기존 모듈 주소와 설명·제한 사항을 보존했습니다. Turret/Power도 다른 모듈과 같은 제목 형식으로 표시합니다.

API 찾기는 The Developer 사이드바 내부 `/docs/projects/the-developer/api-search`에 있습니다. 기존 `/projects/the-developer/search`와 `/turret-search`는 새 주소로 이동합니다. 검색은 30개 로컬 Markdown 문서를 색인하며 공통 협업 가이드나 게임 저장소의 배포 의존성을 변경하지 않습니다.

## 공통 가이드와 프로젝트 문서

협업·Git·PR·온보딩은 프로젝트와 무관한 공통 가이드로 유지합니다. 프로젝트 API의 배포 원본은 `docs/projects/<project-slug>/`입니다. 현재 The Developer는 Core, Player, World/Spaceship, Turret/Power, Enemy 및 통합 체크리스트를 제공합니다. 다른 프로젝트는 별도 디렉터리·사이드바 카테고리·탐색 진입점을 추가합니다.

검색 인덱스는 `npm start`와 `npm run build` 때 공개 문서 파일에서 로컬 생성합니다. 외부 검색 서비스나 게임 저장소 접근은 사용하지 않습니다.

2026-10-05 기준 CBC main `b73e0e76a93d2b2793751402539e7fb2fe449462`의 담당 문서와 코드를 확인하여 연동 가이드를 작성했습니다. 기존 터렛 런타임 가이드는 보존하고, main에 이미 존재하는 API의 빠른 시작·참조·스냅샷·검증 페이지를 추가했습니다. 미병합 PR #476/#481의 API는 사용 가능 기능으로 표시하지 않습니다. 코드 전체, 원본 에셋, 기획·스프린트·회의 자료는 복사하지 않았습니다. 소스 대조는 정적 확인이며 Unity 플레이 검증을 대신하지 않습니다.

검증: `npm run check` 후 `npm run build`.

원본 시그니처 정적 대조: `node scripts/verify-source-contracts.mjs <clean-game-checkout>` (명시적 로컬 경로, 문서 기준 커밋 일치 필요). 읽기 전용이며 공개 CI에서는 실행하지 않습니다. 이는 Unity 컴파일/플레이 시험이 아닙니다.

CBC 변경은 이 사이트 문서를 자동으로 바꾸지 않습니다. main을 확인하고 공개할 계약·예제·제한 사항을 문서 저장소의 별도 변경으로 검토합니다. 예전 자동 복사 도구는 검토된 문서를 덮어쓸 수 있어 폐기했습니다. 배포에는 게임 저장소 접근이 필요하지 않습니다. 기존 `/docs/turret` 및 `/turret-search`는 새 프로젝트 경로로 리디렉션됩니다.

## 공개/비공개 경계

- 회사 사이트의 아트·로고·장식 이미지·메일 바닥글은 `team-hjd-site/assets`에서 독립 배포합니다.
- 공통 개발 가이드와 프로젝트별 연동 문서는 이 저장소에서 독립 배포합니다.
- 이 사이트와 레포는 여전히 공개입니다. 게임 레포를 Private으로 전환해도 이미 이관한 문서가 비공개가 되지는 않습니다.
- 코드·원본 게임 에셋·미공개 기획은 게임 레포에 유지합니다. 기존 게임 파일을 삭제하거나 저장소 공개 상태를 바꾸지 않았습니다.

TeamHJD의 기술 지식과 협업 방식을 기록하는 Docusaurus 기반 문서 사이트입니다.

## 로컬에서 보기

```bash
npm install
npm start
```

## 문서 작성 원칙

- 시작 부분에 중요도(`필수` / `중요` / `참고`)와 읽는 시점을 명시합니다.
- 독자가 다음에 읽을 문서를 안내합니다.
- 팀만의 규칙은 이유와 함께 기록합니다.

## 배포 전 확인

GitHub Pages의 **Source**를 `GitHub Actions`로 설정합니다. 문서 주소는 `https://docs.teamhjd.com/`입니다. 팀 대표 사이트 `https://teamhjd.com/`은 별도 저장소 `Team-HJD-21/team-hjd-site`에서 배포합니다. 배포 빌드는 `actions/configure-pages`의 현재 주소를 읽습니다.

## 사용자 도메인 연결

1. 이 문서 저장소 Settings → Pages의 Custom domain을 `docs.teamhjd.com`으로 설정합니다. 대표 사이트 저장소의 Custom domain은 `teamhjd.com`입니다.
2. Squarespace DNS에서 아래 레코드를 유지하고 `docs` CNAME을 추가합니다. 이미 설정한 `@`와 `www`는 변경하지 않습니다.

| 이름 | 종류 | 값 |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | team-hjd-21.github.io |
| docs | CNAME | team-hjd-21.github.io |

구글 메일의 MX와 SPF/DKIM/DMARC TXT 및 도메인 인증 레코드는 유지합니다. 루트 도메인에 CNAME을 추가하거나 DNS 전체를 초기화하지 않습니다.

3. Deploy 워크플로를 다시 실행합니다. 주소가 바뀌면 루트 경로(`/`) 기준으로 다시 빌드해야 합니다.
4. DNS 및 인증서 발급이 완료되면 Enforce HTTPS를 켜고 홈과 문서 및 API 검색을 확인합니다. 기존 Squarespace 웹사이트 연결은 대체되지만 이메일 연결은 유지됩니다.

GitHub Actions 배포는 `CNAME` 파일이 아니라 Pages 설정으로 사용자 도메인을 관리합니다. 도메인 갱신 비용 외에 Squarespace 웹사이트 구독은 필요 없습니다.
