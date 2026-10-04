# TeamHJD Tech Docs

## 터렛 문서 연동

공개 터렛 문서의 배포 원본은 이 저장소의 `docs/turret/*.md`입니다. 이 파일들을 직접 수정하고 PR로 검토합니다. 게임 저장소를 비공개로 전환해도 문서 사이트 배포에는 영향이 없습니다.

검색 인덱스는 `npm start`와 `npm run build` 때 공개 문서 파일에서 로컬 생성합니다. 외부 검색 서비스나 게임 저장소 접근은 사용하지 않습니다.

2026-10-05 이관은 당시 공개 배포와 동일한 CBC main `b73e0e76a93d2b2793751402539e7fb2fe449462`의 두 페이지를 대상으로 했습니다. 미병합 API 문서, 게임 소스, 기획·스프린트·회의 자료는 새로 공개하지 않았습니다. Mermaid는 유지했습니다. 내부 코드·기획 링크는 팀원 전용 파일 경로 설명으로 바꾸었으며 비공개 저장소로 향하는 편집 링크도 제거했습니다.

검증: `npm run check` 후 `npm run build`.

CBC 변경은 이 사이트 문서를 자동으로 바꾸지 않습니다. 공개할 문서 변경은 문서 저장소의 별도 PR로 반영합니다. 필요할 때만 명시적인 로컬 경로로 `node scripts/import-turret-docs.mjs <game-checkout> --published`를 실행할 수 있지만 기존 공개 문서 편집을 덮어쓰므로 먼저 차이를 검토해야 합니다. 이 수동 도구는 배포 단계에서 실행되지 않습니다. `--published`는 가져온 `origin/main`과 동일한 커밋·커밋된 Docs만 허용합니다.

## 공개/비공개 경계

- 회사 사이트의 아트·로고·장식 이미지·메일 바닥글은 `team-hjd-site/assets`에서 독립 배포합니다.
- 개발 가이드와 공개 터렛 문서는 이 저장소에서 독립 배포합니다.
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
