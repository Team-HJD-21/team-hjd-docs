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
if (!process.argv[2]) throw new Error('Pass an explicit local game checkout. This manual export is never part of site deployment.');
const source = path.resolve(process.argv[2]);
const published = process.argv.includes('--published');
const repository = 'https://github.com/Team-HJD-21/team-hjd-docs';
const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
const branch = execFileSync('git', ['-C', source, 'rev-parse', '--abbrev-ref', 'HEAD'], {encoding: 'utf8'}).trim();
const mainRevision = execFileSync('git', ['-C', source, 'rev-parse', 'origin/main'], {encoding: 'utf8'}).trim();
if (published && revision !== mainRevision) throw new Error('Published imports require the fetched CBC main revision.');
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
  ? `공개 문서 기준 게임 커밋: \`${revision.slice(0, 8)}\`. 이 문서는 문서 저장소에 독립적으로 보관됩니다. 사이트 배포에는 게임 저장소 접근이 필요하지 않습니다.`
  : `로컬 검토용 미리보기입니다. 배포본이 아닙니다. 기준 브랜치: \`${branch}\`. 코드 기준 커밋: \`${revision.slice(0, 8)}\`. 문서에는 미커밋 편집이 포함될 수 있습니다.`;

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
    const local = mapped.get(resolved) || (relative === 'runtime-flows.md' ? 'runtime-flows' : undefined);
    if (local) return `](${local}.md${anchor ? `#${anchor}` : ''})`;
    // Keep private source/planning references readable without exporting them.
    return `](#private-reference:${encodeURIComponent(resolved)})`;
  });
  body = body.replace(/\[([^\]]+)\]\(#private-reference:([^)]+)\)/g, (_, label, encoded) => `${label} — \`${decodeURIComponent(encoded)}\` (게임 저장소의 팀원 전용 참고 자료)`);
  const header = `---\ntitle: ${title}\nsidebar_position: ${index + 1}\nedit_url: ${repository}/edit/main/docs/turret/${slug}.md\n---\n\n:::${published ? 'info' : 'warning'} 출처와 상태\n${notice}\n:::\n\n`;
  await writeFile(filename, header + body, 'utf8');
  searchable.push({title, url: slug === 'index' ? '/docs/turret' : `/docs/turret/${slug}`, text: body.replace(/```[\s\S]*?```/g, match => match.replace(/```\w*/g, '')).replace(/[#|*]/g, '')});
}
await mkdir(path.join(site, 'static'), {recursive: true});
await writeFile(path.join(site, 'static/turret-search.json'), JSON.stringify(searchable), 'utf8');
console.log(`Imported ${searchable.length} pages from CBC ${branch} ${revision.slice(0, 8)} (${published ? 'published' : 'preview'}).`);
