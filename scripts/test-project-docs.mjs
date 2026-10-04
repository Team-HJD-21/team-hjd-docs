import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
execFileSync(process.execPath, [path.join(root, 'scripts/build-project-search.mjs')], {stdio: 'inherit'});
const pages = JSON.parse(readFileSync(path.join(root, 'static/the-developer-search.json'), 'utf8'));
for (const suffix of ['', '/core', '/player', '/world', '/enemy', '/integration', '/turret', '/turret/quick-start', '/turret/api-reference', '/turret/snapshots', '/turret/testing', '/turret/runtime-flows']) {
  assert(pages.some(page => page.url === `/docs/projects/the-developer${suffix}`), `Missing ${suffix}`);
}
for (const symbol of ['TurretSnapshot', 'ApplyDamage', 'TrySpawn', 'InitBullet', 'MatchSession'])
  assert(pages.some(page => page.text.includes(symbol)), `Search missing ${symbol}`);
for (const [module, children] of Object.entries({
  core: ['quick-start', 'api-reference', 'events', 'testing'],
  player: ['quick-start', 'combat', 'health', 'skills', 'testing'],
  world: ['quick-start', 'spatial-inputs', 'progress', 'testing'],
  enemy: ['quick-start', 'api-reference', 'targeting', 'damage', 'testing'],
})) {
  for (const child of children)
    assert(pages.some(page => page.url === `/docs/projects/the-developer/${module}/${child}`), `Missing ${module}/${child}`);
}
assert.equal(pages.length, 30, 'Search must index every module document');
const workflow = readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
assert(!/unity-6-the-developer|cbc-source|import-turret-docs/.test(workflow), 'Deploy must not read the game repo');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
assert(!Object.values(pkg.scripts).some(value => /import-turret-docs|cbc-source/.test(value)));
function checkDirectory(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) checkDirectory(file);
    else if (entry.name.endsWith('.md')) {
      const content = readFileSync(file, 'utf8');
      assert(!/https?:\/\/[^\s)"<>]*unity-6-the-developer|private-reference:/.test(content), `${file}: inaccessible source link`);
      assert(!/배포본이 아닙니다|정식 기능으로 표시하지 않습니다/.test(content), `${file}: placeholder`);
    }
  }
}
checkDirectory(path.join(root, 'docs/projects'));
assert(readFileSync(path.join(root, 'docs/projects/the-developer/turret/runtime-flows.md'), 'utf8').includes('```mermaid'));
const config = readFileSync(path.join(root, 'docusaurus.config.ts'), 'utf8');
assert(config.includes('@docusaurus/plugin-client-redirects'));
assert(config.includes("label: '프로젝트 API'"));
assert(config.includes("{to: '/docs/projects', label: '프로젝트 API', position: 'left'}"), 'Project navbar must be a direct link');
assert(config.includes("from: '/projects/the-developer/search', to: '/docs/projects/the-developer/api-search'"), 'Preserve old API search bookmarks');
const sidebar = readFileSync(path.join(root, 'sidebars.ts'), 'utf8');
assert(sidebar.indexOf("'projects/the-developer/api-search'") > sidebar.indexOf("label: 'The Developer'"), 'Search belongs under The Developer');
assert(sidebar.includes('Turret / Power — 터렛·전력·상태'), 'Module titles must use a consistent format');
assert(readFileSync(path.join(root, 'docs/projects/the-developer/api-search.mdx'), 'utf8').includes('<ProjectApiSearch />'));
assert(config.includes("to: '/docs/collaboration/overview'"));
console.log('PASS: project modules, local search, common collaboration, legacy redirects, standalone deployment.');
