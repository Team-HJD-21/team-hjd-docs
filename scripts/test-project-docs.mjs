import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
execFileSync(process.execPath, [path.join(root, 'scripts/build-project-search.mjs')], {stdio: 'inherit'});
const pages = JSON.parse(readFileSync(path.join(root, 'static/the-developer-search.json'), 'utf8'));
for (const suffix of ['', '/core', '/player', '/player/ui-integration', '/world', '/enemy', '/integration', '/turret', '/turret/quick-start', '/turret/initialization', '/turret/api-reference', '/turret/snapshots', '/turret/testing', '/turret/runtime-flows']) {
  assert(pages.some(page => page.url === `/docs/projects/the-developer${suffix}`), `Missing ${suffix}`);
}
for (const symbol of ['TurretSnapshot', 'ApplyDamage', 'TrySpawn', 'InitBullet', 'MatchSession'])
  assert(pages.some(page => page.text.includes(symbol)), `Search missing ${symbol}`);
for (const [module, children] of Object.entries({
  core: ['quick-start', 'api-reference', 'contracts', 'events', 'testing'],
  player: ['quick-start', 'combat', 'health', 'skills', 'testing', 'ui-integration'],
  world: ['quick-start', 'spatial-inputs', 'progress', 'testing'],
  enemy: ['quick-start', 'api-reference', 'spawn-distribution', 'targeting', 'damage', 'testing'],
})) {
  for (const child of children)
    assert(pages.some(page => page.url === `/docs/projects/the-developer/${module}/${child}`), `Missing ${module}/${child}`);
}
assert.equal(pages.length, 34, 'Search must index every module document');
const leaveMeAlonePages = JSON.parse(readFileSync(path.join(root, 'static/leave-me-alone-search.json'), 'utf8'));
for (const suffix of ['', '/gameplay-flow', '/player-guide', '/boss-guide', '/items-guide', '/unity-setup'])
  assert(leaveMeAlonePages.some(page => page.url === `/docs/projects/leave-me-alone${suffix}`), `Missing Leave Me Alone ${suffix}`);
assert.equal(leaveMeAlonePages.length, 6, 'Leave Me Alone search must index every project document');
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
assert(config.includes("label: '프로젝트 Docs'"));
assert(config.includes("{to: '/docs/projects', label: '프로젝트 Docs', position: 'left'}"), 'Project navbar must be a direct link');
assert(config.includes("from: '/projects/the-developer/search', to: '/docs/projects/the-developer/api-search'"), 'Preserve old API search bookmarks');
const sidebar = readFileSync(path.join(root, 'sidebars.ts'), 'utf8');
assert(sidebar.indexOf("'projects/the-developer/api-search'") > sidebar.indexOf("label: 'The Developer'"), 'Search belongs under The Developer');
assert(sidebar.indexOf("label: 'The Developer'", sidebar.indexOf("projects: [")) < sidebar.indexOf("label: 'Leave Me Alone'"), 'Leave Me Alone must follow The Developer in the project sidebar');
assert(sidebar.includes('Turret / Power — 터렛·전력·상태'), 'Module titles must use a consistent format');
assert(readFileSync(path.join(root, 'docs/projects/the-developer/api-search.mdx'), 'utf8').includes('<ProjectApiSearch />'));
assert(readFileSync(path.join(root, 'docs/projects/leave-me-alone/index.md'), 'utf8').includes('<LeaveMeAloneLogo />'));
const bossGuide = readFileSync(path.join(root, 'docs/projects/leave-me-alone/boss-guide.md'), 'utf8');
assert(bossGuide.includes('6221b11ba0926c9e6b49e781f6a2eb78285ffbbc'), 'Boss guide must track the latest source revision');
assert(bossGuide.includes('```mermaid'), 'Boss guide must include the Behavior Graph flow');
assert(bossGuide.includes('Player 밭 경로는 접근 뒤 상태를 다시 확인'), 'Boss guide must preserve the target recheck behavior');
const projectIndex = readFileSync(path.join(root, 'docs/projects/index.md'), 'utf8');
assert(projectIndex.includes('## <LeaveMeAloneLogo />'), 'Project listing keeps the project logo heading');
assert(projectIndex.includes('<LeaveMeAloneEntryLink />'), 'Project listing uses the small logo and start-docs link');
assert(readFileSync(path.join(root, 'src/theme/MDXComponents.tsx'), 'utf8').includes("width=\"2172\" height=\"724\""), 'Logo keeps its source aspect ratio');
const projectStyles = readFileSync(path.join(root, 'src/css/custom.css'), 'utf8');
assert(projectStyles.includes('aspect-ratio: 2090/228'), 'Leave Me Alone logos crop transparent padding at the artwork ratio');
assert(projectStyles.includes('width: 7.5em'), 'Entry logo is enlarged while staying compact beside its label');
assert(projectStyles.includes('object-fit: cover'), 'Logo artwork is cropped without stretching');
assert(config.includes("to: '/docs/collaboration/overview'"));
console.log('PASS: project modules, local search, common collaboration, legacy redirects, standalone deployment.');
