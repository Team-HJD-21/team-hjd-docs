# The Developer 공개 문서 동기화 — 2026-11-01

- 원본: Team-HJD-21/unity-6-the-developer main d0922f0bf86e0348bed1acbfd5ae6231a1202f63.
- 원본 Docs tree: 7f1ce2e99b640829a6255ea70200c799a521d894. 이전 동기화 기준 7802e0c6 이후 Docs 변경 없음; 공개 코드 계약 변경을 별도로 대조함.
- 출처: Assets/Scripts/Features/Enemy/Monster, Networking/EnemyNetworkController.cs, Spawning/EnemySpawnExecutor.cs, Assets/Scripts/Map/WeatherManager.cs 및 ShaderTests.cs.
- 반영: EnemyHealth 수명·권한 분리, EnemyController.SetTargetAndDestination, 역할 컴포넌트 및 공격 실행 API, Player/Turret 문서의 이전 자체 서버 검사 설명 정정, 날씨 화면 효과 호출 사용법.
- 현재 체크아웃 task/545-field-turret-power-loss와 미커밋 작업은 보존. 문서는 git show main의 확정본만 대조; 로컬 작업 중인 OFF 정책 수정은 가져오지 않음.
- 게임 코드·원본 에셋·회의록·내부 기획은 복사하지 않음. 짧은 호출 예제는 사용법을 위해 작성.
- Unity 컴파일·플레이 검증은 수행하지 않음. 사이트 검사·빌드와 배포 확인은 별도 수행.