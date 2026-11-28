# GameAudioManager 사용법

`GameAudioManager.Play(GameSound.PlayerShot, this)`처럼 실제 재생 사건에서 큐를 요청합니다. 반환된 `VoiceHandle`의 `Stop()`으로 반복음을 해제할 수 있습니다. 공용 효과음은 AudioSource 풀과 GameAudio 믹서를 사용합니다. CameraManager는 로컬 출력의 AudioListener를 선택합니다.

공간 효과음은 로컬 Player에서 음원까지의 XY 벡터를 출력 카메라의 Listener 평면으로 투영합니다. 전술 지도 패닝 중에도 거리 감쇠·거리 제한·풀 우선순위는 Player 위치를 따릅니다. Player 연결 전에는 Listener 위치를 사용합니다. 환경음에 별도 AudioSource를 쓰는 경우 GameAudio 믹서의 그룹을 지정하세요. 공용 풀의 상한은 별도 AudioSource에 적용되지 않습니다.

`GameAudioConfiguration.GameplayMusic`은 낮·밤·우주선 음악 설정을 읽습니다. 필드에서는 현재 Match의 확정 환경을 따르고 우주선에서는 전용 음악을 반복합니다. 개인 메뉴와 설정을 여닫아도 곡은 계속 재생됩니다.

[현재 사용할 수 있는 기능](implementation-status.md) · [CameraManager](camera-management.md)
