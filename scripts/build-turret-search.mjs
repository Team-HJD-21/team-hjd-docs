import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const pages = [];
for (const name of (await readdir(path.join(root, 'docs/turret'))).filter(name => name.endsWith('.md')).sort()) {
  const content = await readFile(path.join(root, 'docs/turret', name), 'utf8');
  const slug = name.slice(0, -3);
  const title = content.match(/^title:\s*(.+)$/m)?.[1] || slug;
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  pages.push({title, url: slug === 'index' ? '/docs/turret' : `/docs/turret/${slug}`, text: body.replace(/```\w*/g, '').replace(/[#|*]/g, '')});
}
await mkdir(path.join(root, 'static'), {recursive: true});
await writeFile(path.join(root, 'static/turret-search.json'), JSON.stringify(pages), 'utf8');
console.log(`Built search index from ${pages.length} local pages; no game repository access.`);
