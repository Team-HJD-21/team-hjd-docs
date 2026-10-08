// Optional, read-only maintainer check. Never invoked by the public build/CI.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const source = process.argv[2];
assert(source, 'Pass an explicit, clean checkout of the documented main revision.');
const expected = 'eb35ceb1e734cc515977bb1698b29b1e166c677a';
assert.equal(execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim(), expected);
assert.equal(execFileSync('git', ['-C', source, 'status', '--porcelain'], {encoding:'utf8'}).trim(), '', 'Source must be clean');
const checks = [
  ['Assets/Scripts/Tower/Turret/Core/TurretBase.cs', ['TurretActivationResult RequestActivation(bool', 'bool ApplyDamage(int', 'bool Restore()', 'bool SetLocked(bool', 'TurretUpgradeResult ApplyUpgrade(', 'TurretLevelUpgradeResult RequestLevelUpgrade(']],
  ['Assets/Scripts/Tower/Turret/Core/TurretInstanceRegistry.cs', ['event Action<int> SnapshotChanged', 'bool TryGetSnapshot(int', 'GetOperationalSnapshots()', 'bool TryGetInstanceId(Transform']],
  ['Assets/Scripts/Tower/Turret/Core/TurretSnapshot.cs', ['float Range', 'int EffectivePower']],
  ['Assets/Scripts/Tower/Turret/Contracts/TurretActivationResult.cs', ['namespace TeamHJD.Game.Turrets.Contracts', 'InsufficientPower', 'PowerSourceUnavailable']],
  ['Assets/PoC/Core/Application/MatchSession.cs', ['CreateSnapshot(long', 'Submit(GameCommand']],
  ['Assets/PoC/Core/Application/IAppMatchHost.cs', ['StartMatch(', 'CompleteCurrentMatch(', 'UpdateBattlefieldTurretLayout(']],
  ['Assets/PoC/Core/Domain/Match/MatchSimulation.cs', ['SimulationStatus.NotHandled']],
  ['Assets/Scripts/Player_V2/PlayerWeapon/PlayerBullet.cs', ['InitBullet(', 'DefaultShotgun', 'TakeDamage']],
  ['Assets/PoC/Enemy/Scripts/Spawning/EncounterRuntime.cs', ['bool TrySpawn(', 'out string result']],
  ['Assets/PoC/Enemy/Scripts/Monster/EnemyHealth.cs', ['void TakeDamage(int', 'IsServer', 'Despawn(']],
  ['Assets/PoC/Spaceship/Scripts/MutiScene/NaviProgresser.cs', ['bool TryUpgrade()']],
  ['Assets/PoC/Spaceship/Scripts/MutiScene/MissionProgresser.cs', ['void AdvanceMission()']],
];
let count = 0;
for (const [file, symbols] of checks) {
  const code = readFileSync(path.join(source, file), 'utf8');
  for (const symbol of symbols) { assert(code.includes(symbol), `${file}: ${symbol}`); count++; }
}
console.log(`PASS: ${count} source contract checks at ${expected}. Static checks only, not Unity compilation/play tests.`);
