---
title: World 검증과 제한 사항
---

# World 검증과 제한 사항

**기준:** main `eb35ceb1` · **영역:** 김진태 · **원본:** `Assets/PoC/Spaceship/Scripts/MutiScene/`, `Assets/PoC/Core/Contracts/IBattlefieldTurretInputSource.cs`, `IBattlefieldEnemyPositionSource.cs`, `Bootstrap/SceneComposition/InitialStageCompositionRoot.cs`.

## 검증

- Planet → Spaceship → Planet 왕복 후 Player가 Trigger에 갇히지 않는지 확인합니다.
- 돌아갈 Scene이 미리 로드돼 있는지 확인합니다.
- 진행 업그레이드 실패(false) 시 UI에서 성공으로 표시하지 않습니다.
- 저장 플래그의 세션 내 재진입과 앱 재실행을 따로 시험합니다.
- [터렛 snapshot](../turret/snapshots.md)과 Core grid를 World의 최종 점령 규칙으로 확정하지 않습니다.

[World / Spaceship — 공간·씬·진행 상태 목차](../world.md) · [통합 체크리스트](../integration.md)
