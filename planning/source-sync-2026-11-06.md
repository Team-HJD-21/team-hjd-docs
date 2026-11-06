# 공개 API 동기화 — 2026-11-06

## 기준과 보존

- 원본 저장소: Team-HJD-21/unity-6-the-developer main d9ea70570b40a7d8d6a4d633299d0be7d1c1502c (#623), 2026-11-06 01:21:25 +09:00.
- 이전 자동 기준: 1a03e9a9164e5db94cbc8775162467d08cf63a3b.
- fetch 성공 후 기존 main이 origin/main의 조상임을 확인하고 main 포인터만 fast-forward했다. 현재 task/update-pr-template 브랜치와 미커밋 .github/pull_request_template.md는 보존했다. source main으로 checkout하지 않았다.
- 사이트 원격 기준: 18641be (Core 범용 명령 안내 #7). 검색 분리 #5와 Markdown 미리보기 #6, 기존 UI/도구 문서를 보존했다.
- 기존 primary worktree의 clean codex/search-markdown-preview 브랜치는 699a676에 그대로 남겼다. 이 브랜치의 원격 main에 없는 커밋 2개도 reset/rebase하지 않았다. origin/main에서 codex/docs-sync-2026-11-06 작업 브랜치를 만들었고 별도 worktree는 만들지 않았다.
- 방향은 source main → 사이트 공개 API/사용법이다. 코드·원본 에셋·회의록·내부 기획은 새로 복사하지 않았다.

## 공개 변경과 실제 코드 확인

- Docs/architecture/core-api-usage.md와 MatchSession/MatchSessionFactory/MatchState/PlayerSceneAdapter: 기존 #7의 범용 Submit 제거를 보존하고 integration.md 잔여 항목을 수정했다. snapshot 초기 자료와 실제 Feature 읽기 원본을 구분했다.
- Core/Presentation/Scene/FieldSimulationTime.cs, FieldSimulationActor.cs: owner의 시간·취소, 절대 초·보정 delta, 생성물 Scene 귀속·바인딩과 물리/Animator/NavMesh 정지 보존을 요약했다.
- Contracts/Persistence/ICheckpointParticipantProvider.cs, Presentation/Scene/CheckpointAnimatorState.cs, CheckpointSceneReferences.cs, CheckpointActorFactory.cs: writer 명시 제공, Animator 전환/파라미터/Trigger, 논리 키 해석과 entity/ 신규 ID 접두사 계약을 요약했다. 실제 Feature writer의 전체 채택과 구분했다.
- Contracts/Environment/IMatchDayNightCycle.cs, Domain/Environment/DayNightPhase.cs, MatchEnvironmentSnapshot.cs, Application/Environment/MatchEnvironmentRuntime.cs/Replica.cs, Bootstrap/SceneComposition/MatchEnvironmentSceneScope.cs: 정상 진행과 복원 사건, epoch/revision/시간 검증, 선택 clock/PublishCurrent 접점을 구분했다.
- Infrastructure/Networking/EnvironmentReplicationCodec.cs/NgoEnvironmentTransport.cs: 환경 v2 및 16,384바이트 상한/혼합 빌드 경계.
- Infrastructure/Networking/NgoSceneFlow.cs와 Bootstrap/AppRoot.cs: driver는 1–2인 Host 전체 cohort 완료를 검사하지만 AppRoot.GetSceneTravelRestriction은 다중 참가자 Host 이동을 여전히 제한한다. 전체 공동 Scene 이동 완료로 적지 않았다.
- 변경된 architecture-rebuild-notes, naming conventions, system-rearchitecture charter의 내부 설계 내용은 사이트로 복사하지 않았다.

## 검증 경계

npm run check 및 npm run build 모두 통과했다. 현재 The Developer 검색 47개·archive 1개, Leave Me Alone 6개·archive 0개와 에디터 도구 11개·이미지 6개·영상 6개의 기존 검사를 통과했다. 검색/아카이브 격리·Markdown 미리보기·다중 검색어 강조·스크립트 거부 검사와 새 공개 API 검색 포함 및 생성 HTML의 링크 anchor도 통과했다. Unity 컴파일·PlayMode·실제 필드 정지/복원·두 실행 파일 Scene 이동 시험은 이번 작업에서 재실행하지 않는다. 기존 검색과 문서 수/탐색 및 사용자 코드 작업을 보존한다.

배포 후 원격 head·GitHub Pages/Cloudflare main 커밋 검사와 실제 docs.teamhjd.com 응답을 확인한다. 익명 302 Cloudflare Access 응답을 페이지 본문 검증으로 표시하지 않는다.
