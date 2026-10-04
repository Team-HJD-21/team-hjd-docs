import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
await mkdir(path.join(root, 'static'), {recursive: true});
const projectsRoot = path.join(root, 'docs/projects');
async function collect(directory, prefix = '') {
  const pages = [];
  for (const entry of (await readdir(directory, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) pages.push(...await collect(path.join(directory, entry.name), `${relative}/`));
    else if (entry.name.endsWith('.md')) {
      const content = await readFile(path.join(directory, entry.name), 'utf8');
      const slug = relative.replace(/\.md$/, '').replace(/(^|\/)index$/, '');
      const title = content.match(/^title:\s*(.+)$/m)?.[1] || entry.name;
      const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      pages.push({title, slug, text: body.replace(/```\w*/g, '').replace(/[#|*]/g, '')});
    }
  }
  return pages;
}
for (const project of await readdir(projectsRoot, {withFileTypes: true})) {
  if (!project.isDirectory()) continue;
  const pages = (await collect(path.join(projectsRoot, project.name))).map(({slug, ...page}) => ({
    ...page, url: `/docs/projects/${project.name}${slug ? `/${slug}` : ''}`,
  }));
  await writeFile(path.join(root, 'static', `${project.name}-search.json`), JSON.stringify(pages), 'utf8');
  console.log(`Built ${project.name}: ${pages.length} local pages; no game repository access.`);
}
