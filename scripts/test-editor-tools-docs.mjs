// Editor 도구의 nav 순서·목차·로컬 링크·사진 번호를 확인합니다.
// 게임 저장소, 배포 서버, 원격 계정에 접근하지 않습니다.
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const config = readFileSync(path.join(root, 'docusaurus.config.ts'), 'utf8');
const navbar = config.slice(config.indexOf('navbar:'), config.indexOf('footer:'));
const project = navbar.indexOf("label: '프로젝트 API'");
const editor = navbar.indexOf("label: '에디터 도구'");
const glossary = navbar.indexOf("label: '용어 사전'");
assert(project >= 0 && editor > project && glossary > editor, 'Editor tools must be between Project API and Glossary');
assert(navbar.includes("{to: '/docs/editor-tools', label: '에디터 도구', position: 'left'}"));

const sidebar = readFileSync(path.join(root, 'sidebars.ts'), 'utf8');
assert(sidebar.includes('editorTools: ['));
assert(sidebar.includes("id: 'editor-tools/the-developer/index'"));
assert(sidebar.includes("id: 'editor-tools/the-developer/game-debugger/index'"));
const children = ['quick-start', 'window-and-time', 'battlefield', 'encounter', 'statistics',
  'spawn-inspection', 'timeline-and-sharing', 'troubleshooting'];
for (const child of children) assert(sidebar.includes(`'${child}'`), `Missing sidebar item ${child}`);

const pages = ['editor-tools/index.md', 'editor-tools/the-developer/index.md',
  'editor-tools/the-developer/game-debugger/index.md',
  ...children.map(name => `editor-tools/the-developer/game-debugger/${name}.md`)];
const placeholderIds = new Set();
const mediaRefs = [];
for (const page of pages) {
  const file = path.join(root, 'docs', page);
  const content = readFileSync(file, 'utf8');
  assert(/^---\r?\n/.test(content) && /^title: .+$/m.test(content), `Missing frontmatter ${page}`);
  assert(content.includes('중요도:'), `Missing reading priority ${page}`);
  assert(!/https?:\/\/[^\s)"<>]*unity-6-the-developer|private-reference:/.test(content), `Private source link ${page}`);
  for (const [, target] of content.matchAll(/(?<!!)\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
    if (/^https?:|^#|^\//.test(target)) continue;
    assert(existsSync(path.resolve(path.dirname(file), target.split('#')[0])), `Broken link ${page}: ${target}`);
  }
  // 사진을 받으면 번호 표식은 실제 이미지로 교체하므로 전체 표식 수를 고정하지 않습니다.
  for (const [, type, src] of content.matchAll(/<GuideMedia type="(image|video)" src="([^"]+)"/g)) {
    mediaRefs.push({type, src});
    assert(existsSync(path.join(root, 'static', src)), `Missing media ${page}: ${src}`);
  }
  for (const [, id, description] of content.matchAll(/\[#(\d+),\s*([^\]\n]+)\]/g)) {
    assert(!placeholderIds.has(id), `Duplicate screenshot #${id}`);
    assert(Number(id) >= 1 && Number(id) <= 14 && description.length > 10, `Invalid screenshot #${id}`);
    placeholderIds.add(id);
  }
}
assert.equal(placeholderIds.size, 0, 'All delivered slots must be filled; #4/#11 were removed');
const manifest = JSON.parse(readFileSync(path.join(root, 'planning/game-debugger-media.json'), 'utf8'));
assert.deepEqual(manifest.map(item => item.number), [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14]);
assert.equal(mediaRefs.length, 12);
assert.equal(new Set(mediaRefs.map(item => item.src)).size, 12);
for (const item of manifest) {
  assert(mediaRefs.some(ref => ref.src === item.src && ref.type === item.type), `Unlinked media #${item.number}`);
  const bytes = readFileSync(path.join(root, 'static', item.src));
  if (item.type === 'image') assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  else assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
}
const component = readFileSync(path.join(root, 'src/components/GuideMedia/index.tsx'), 'utf8');
assert(component.includes('controls playsInline preload="metadata"'));
assert(component.includes('useBaseUrl(src)') && !component.includes('autoPlay'));
console.log(`PASS: ${pages.length} editor-tool pages, navbar/sidebar/links, 6 images + 6 videos, no pending placeholders.`);
