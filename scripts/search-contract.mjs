export const projects = {'the-developer':'The Developer','leave-me-alone':'Leave Me Alone'};
export function isProjectUrl(project,url) {
  return typeof url === 'string' && (url === '/docs/projects/'+project || url.startsWith('/docs/projects/'+project+'/') || (project === 'the-developer' && url.startsWith('/docs/editor-tools/the-developer')));
}
export function searchPages(pages,project,archive,query) {
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return pages.filter(p=>p.project===project && p.archive===archive && isProjectUrl(project,p.url) && terms.every(t=>(p.title+' '+p.text).toLocaleLowerCase().includes(t)))
    .sort((a,b)=>Number(terms.every(t=>b.title.toLocaleLowerCase().includes(t)))-Number(terms.every(t=>a.title.toLocaleLowerCase().includes(t))) || a.title.localeCompare(b.title,'ko'));
}
