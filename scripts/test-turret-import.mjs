import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
execFileSync(process.execPath, [path.join(root, 'scripts/build-turret-search.mjs')], {stdio: 'inherit'});
const pages = JSON.parse(readFileSync(path.join(root, 'static/turret-search.json'), 'utf8'));
assert(pages.some(page => page.url === '/docs/turret'));
assert(pages.some(page => page.url === '/docs/turret/runtime-flows'));
assert(pages.some(page => page.text.includes('TurretSnapshot')));
const workflow = readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
assert(!/unity-6-the-developer|cbc-source|import-turret-docs/.test(workflow), 'Deploy must not read the game repo');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
assert(!Object.values(pkg.scripts).some(value => /import-turret-docs|cbc-source/.test(value)));
for (const file of readdirSync(path.join(root, 'docs/turret')).filter(name => name.endsWith('.md'))) {
  const content = readFileSync(path.join(root, 'docs/turret', file), 'utf8');
  assert(!/https?:\/\/[^\s)"<>]*unity-6-the-developer|private-reference:/.test(content), `${file}: inaccessible source link`);
  assert(!/배포본이 아닙니다/.test(content), `${file}: unpublished preview`);
  assert(content.includes('team-hjd-docs/edit/main/docs/turret/'), `${file}: wrong edit destination`);
}
assert(readFileSync(path.join(root, 'docs/turret/runtime-flows.md'), 'utf8').includes('```mermaid'));
console.log('PASS: standalone docs, local search, editing links, no private-source dependencies or preview pages.');
