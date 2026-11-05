# 공개 API 동기화 — 2026-11-05

## 기준과 방향

- 원본: Team-HJD-21/unity-6-the-developer main **1a03e9a9164e5db94cbc8775162467d08cf63a3b**, 2026-11-05 05:49:21 +09:00.
- 이전 자동 동기화 원본 기준: 9cf0e16b5924b6facfc35646184672c1d51e7b1a. 중간에 사이트에 들어온 Random/출입 API와 최신 가중 선택 문서 c42038d는 보존했다.
- 배포 저장소 시작점: Team-HJD-21/team-hjd-docs main c42038d. 기존 primary worktree에서 codex/docs-sync-2026-11-05 브랜치 사용.
- 원본 fetch 성공. 로컬 main과 origin/main이 처음부터 동일해 포인터 변경 불필요.
- 원본 현재 브랜치 task/update-pr-template와 미커밋 .github/pull_request_template.md를 보존했다. 다른 worktree/작업 브랜치를 변경하지 않았다.
- 원본 main → 공개 사이트 문서의 단방향 갱신이다. 게임 코드·원본 에셋·미디어·회의록·내부 기획을 새로 복사하지 않았다. Sidebar·로고·CSS·기존 카테고리·도구 사용법을 보존했다.

## 확인한 변경과 출처

| 원본 main 변경 | 공개 문서 반영 | 직접 대조한 출처 |
| --- | --- | --- |
| #615 Core 기반 | App/Network/Match 상태·수명, 시간/예약, 체크포인트 실행/저장소, Scene/화면/입력 잠금 | Docs/architecture/core-lifecycle-and-api-guide.md, core-api-usage.md, network-match-api.md, match-time-api.md, match-field-pause-api.md, match-environment-api.md, checkpoint-execution-api.md, checkpoint-storage-api.md, scene-flow-api.md, screen-management-api.md; Core/Bootstrap/SceneComposition/InitialStageCompositionRoot.cs |
| Random/출입 | main 기반 계약임을 확인하고 실제 Feature 채택과 구분 | Docs/architecture/core-random-api.md, core-presence-report-api.md; Core 조립부, Map/WeatherManager.cs |
| #575 Player | LMB 소비 순서, Space 대시, 선택/공격 분리, 4무기/분리 외형, 설치/충돌/표시/HUD | Docs/architecture/player-primary-input-api.md, player-dash-api.md, player-weapon-api.md, player-weapon-appearance-api.md, player-device-collision-and-depth.md, player-class-responsibilities.md, player-skill-hud-api.md, player-ui-api.md; PlayerInputHandler, PlayerWeaponSelection |
| #594/#616 Enemy | AssignTarget, 추상 Controller·Moving/Ability 구조, projectile/폭발/감속 경계, 실제 catalog/기반 프리팹 사용법 | Docs/architecture/enemy-system-guide.md; Features/Enemy/Monster, Networking, Targeting, Effects, Contracts의 공개 심볼 |
| #611 Weather | HEATWAVE/WEATHER_COUNT, 큐 변경과 WeatherShaderApply 연결, PlayerWeatherEffectBinding | Map/WeatherManager.cs, CountTick.cs, WeatherShaderApply.cs, WeatherChangeEvent.cs, PlayerWeatherEffectBinding.cs |
| #596/#614/#617 Turret | 50% 기본 부분 반환/잔여 예약, 비율 설정, 자동 큐 우선순위 보존·영구 부족만 제외, 수리 테스트 배치의 공개 확인 순서 | Docs/architecture/turrets/api-reference.md, quick-start.md, testing.md; FieldTurretController.cs, FieldTurretBase.cs |

## 문서와 실제 코드의 차이

Source의 일부 API 문서는 과거 실험/보류 당시 Feature 연동과 시험 수치를 포함한다. 현재 main 코드 대조를 우선했다.

- Features/ 및 Map/에서 IRandomConsumer, IFieldSimulationConsumer, IMatchScheduledEnvironmentFeature, ICheckpointParticipant, IEncounterEnvironmentConsumer, IEncounterSpawnContextConsumer, IMatchWeatherSource, IMatchTimeOfDaySource의 실제 구현은 확인되지 않았다.
- Weather는 UnityEngine.Random.Range와 CountTick/WaitForSeconds를 사용한다. Core scheduler·Host Random·환경 replica·전체 저장 writer로 이관 완료라고 쓰지 않았다.
- Core 조립부의 선택적 환경/Spawn consumer 연결은 실제 Feature 구현이 있을 때만 작동한다. Enemy의 기존 Battlefield 경로는 유지된다.
- 로컬 PlayerLocationState의 카메라 효과 숨김과 Host PlayerMatchPresence/전체 필드 정지는 별개다.
- Steam 접합은 공개 경계/제한만 요약하고 SDK 선택 조사·내부 계획을 가져오지 않았다.
- CU/터렛 성장 트리·회의 타기팅 요구 등 미정 기획은 가져오지 않았다.

## 검증과 배포

npm run check와 npm run build 모두 통과했다. The Developer 37개·Leave Me Alone 6개 검색 문서, 에디터 도구 11개·이미지 6개·영상 6개의 기존 검사를 통과했다. 새 주요 API의 검색 포함과 생성 HTML의 시간/저장/Scene 링크 anchor도 확인했다. 검색 경로와 기존 사이드바를 유지하고 새 source-scope/실제 Feature 경계가 검색에 포함되는지 확인한다. 이 기록의 API 검토는 정적 대조이며 Unity 컴파일·PlayMode·Initial_Stage 직접 조작·네트워크 두 프로세스 시험을 수행한 기록이 아니다.

배포 커밋·원격 head·GitHub Pages/Cloudflare 상태 및 실제 도메인 응답은 배포 후 확인한다. 익명 도메인 응답이 Cloudflare Access 302이면 페이지 본문 검증 성공으로 기록하지 않는다.
