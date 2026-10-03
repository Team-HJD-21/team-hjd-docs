# TeamHJD Tech Docs

## 터렛 문서 연동

CBC `Docs/architecture/turrets`와 기존 `turret-system-guide.md`가 터렛 문서의 원본입니다. 사이트에서 생성된 `docs/turret`를 직접 수정하지 않습니다.

로컬 검토: `node scripts/import-turret-docs.mjs D:/UnityProjects/CBC-turret-api-docs` 실행 후 `npm start`.

배포 빌드는 CBC main만 가져옵니다. API 문서가 아직 main에 없으면 현재 main의 전체 가이드만 표시합니다. 로컬 브랜치 미리보기에는 배포본이 아니라는 안내를 표시합니다. 기존 Mermaid를 그대로 유지하며 별도 API 검색은 외부 검색 서비스에 정보를 보내지 않습니다.

검증: `node scripts/test-turret-import.mjs D:/UnityProjects/CBC-turret-api-docs` 후 `npm run build`.

CBC 문서 PR이 main에 병합된 뒤 이 사이트의 Deploy 워크플로를 실행하면 최신 문서를 가져옵니다. CBC 변경만으로 이 저장소의 배포가 자동 실행되지는 않습니다. 사이트 설정의 main 병합과 실제 GitHub Pages 배포는 별도 검토 단계입니다.

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
