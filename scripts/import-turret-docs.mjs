import {readFile, writeFile, mkdir, rm, access} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

// Only these public integration documents are imported. Personal and planning
// documents are never swept into the public site.
export const pages = [
  ['index', '터렛 연동 가이드'],
  ['quick-start', '빠른 시작'],
  ['api-reference', 'API 사용법'],
  ['snapshots', '스냅샷'],
  ['testing', '검증과 제한 사항'],
  ['runtime-flows', '전체 구조와 실행 흐름'],
];
const site = path.resolve(import.meta.dirname, '..');
const source = path.resolve(process.argv[2] || path.join(site, 'cbc-source'));
const published = process.argv.includes('--published');
const repository = 'https://github.com/Team-HJD-21/unity-6-the-developer';
const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
const branch = execFileSync('git', ['-C', source, 'rev-parse', '--abbrev-ref', 'HEAD'], {encoding: 'utf8'}).trim();
if (published && branch !== 'main') throw new Error('Published imports require CBC main.');
if (execFileSync('git', ['-C', source, 'status', '--porcelain', '--', 'Docs'], {encoding: 'utf8'}).trim() && published)
  throw new Error('Published imports require committed CBC Docs.');
const output = path.join(site, 'docs', 'turret');
await mkdir(output, {recursive: true});
const searchable = [];
let hasIntegrationDocs = true;
try { await access(path.join(source, 'Docs/architecture/turrets/index.md')); }
catch { hasIntegrationDocs = false; }

const sourcePath = slug => slug === 'runtime-flows'
  ? 'Docs/architecture/turret-system-guide.md'
  : `Docs/architecture/turrets/${slug}.md`;
const mapped = new Map(pages.map(([slug]) => [sourcePath(slug), slug]));
const notice = published
  ? `CBC main의 문서 복사본입니다. 기준 커밋: [${revision.slice(0, 8)}](${repository}/commit/${revision}).`
  : `로컬 검토용 미리보기입니다. 배포본이 아닙니다. 기준 브랜치: \`${branch}\`. 코드 기준 커밋: [${revision.slice(0, 8)}](${repository}/commit/${revision}). 문서에는 미커밋 편집이 포함될 수 있습니다.`;

for (const [index, [slug, title]] of pages.entries()) {
  const filename = path.join(output, `${slug}.md`);
  if (!hasIntegrationDocs && slug !== 'index' && slug !== 'runtime-flows') {
    // Remove only our allowlisted generated pages. Never clean other folders.
    await rm(filename, {force: true});
    continue;
  }
  let body = !hasIntegrationDocs && slug === 'index'
    ? '# 터렛 연동 가이드\n\n분리된 API 문서가 CBC main에 아직 병합되지 않았습니다. 검토 중인 브랜치의 API를 정식 기능으로 표시하지 않습니다.\n\n[현재 main의 전체 구현 가이드](runtime-flows.md)를 확인하세요.\n'
    : await readFile(path.join(source, sourcePath(slug)), 'utf8');
  body = body.replace(/\]\(([^)]+)\)/g, (whole, target) => {
    if (/^(?:[a-z]+:|#|\/)/i.test(target)) return whole;
    const [relative, anchor] = target.split('#');
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath(slug)), relative));
    const local = mapped.get(resolved);
    // External anchors belong to CBC and do not rely on Docusaurus slug rules.
    return `](${local && !anchor ? `${local}.md` : `${repository}/blob/${revision}/${resolved}${anchor ? `#${anchor}` : ''}`})`;
  });
  const header = `---\ntitle: ${title}\nsidebar_position: ${index + 1}\nedit_url: ${repository}/edit/main/${sourcePath(slug)}\n---\n\n:::${published ? 'info' : 'warning'} 출처와 상태\n${notice}\n:::\n\n`;
  await writeFile(filename, header + body, 'utf8');
  searchable.push({title, url: slug === 'index' ? '/docs/turret' : `/docs/turret/${slug}`, text: body.replace(/```[\s\S]*?```/g, match => match.replace(/```\w*/g, '')).replace(/[#|*]/g, '')});
}
await mkdir(path.join(site, 'static'), {recursive: true});
await writeFile(path.join(site, 'static/turret-search.json'), JSON.stringify(searchable), 'utf8');
console.log(`Imported ${searchable.length} pages from CBC ${branch} ${revision.slice(0, 8)} (${published ? 'published' : 'preview'}).`);
