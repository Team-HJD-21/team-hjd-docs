export const projects = {'the-developer':'The Developer','leave-me-alone':'Leave Me Alone'};
export function isProjectUrl(project,url) {
  return typeof url === 'string' && (url === '/docs/projects/'+project || url.startsWith('/docs/projects/'+project+'/') || (project === 'the-developer' && url.startsWith('/docs/editor-tools/the-developer')));
}
export function searchPages(pages,project,archive,query) {
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return pages.filter(p=>p.project===project && p.archive===archive && isProjectUrl(project,p.url) && terms.every(t=>(p.title+' '+p.text).toLocaleLowerCase().includes(t)))
    .sort((a,b)=>Number(terms.every(t=>b.title.toLocaleLowerCase().includes(t)))-Number(terms.every(t=>a.title.toLocaleLowerCase().includes(t))) || a.title.localeCompare(b.title,'ko'));
}

export function markdownExcerpt(markdown,query) {
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  // Keep whole Markdown blocks, including code fences and GFM tables.
  const blocks=[]; let lines=[],fence=null;
  for(const line of markdown.split(/\r?\n/)) {
    const match=line.match(/^\s*(`{3,}|~{3,})/);
    if(match){if(!fence)fence=match[1];else if(match[1][0]===fence[0]&&match[1].length>=fence.length)fence=null;}
    if(!line.trim()&&!fence){if(lines.length){blocks.push(lines.join('\n'));lines=[];}}
    else lines.push(line);
  }
  if(lines.length)blocks.push(lines.join('\n'));
  const valid=blocks.filter(b=>!/^\s*(import |:::|<|# )/.test(b));
  const selected=valid.find(b=>terms.length&&terms.every(t=>b.toLocaleLowerCase().includes(t)))||valid.find(b=>terms.length&&b.toLocaleLowerCase().includes(terms[0]))||valid[0]||blocks[0]||'';
  let result=selected.slice(0,1800);
  // A shortened code block still renders as code, not a broken paragraph.
  const fences=result.match(/^\s*(?:`{3,}|~{3,}).*$/gm)||[];
  if(fences.length%2)result+='\n'+fences[0].trim().match(/^(`{3,}|~{3,})/)[0];
  return result;
}

export function highlightParts(value,query) {
  const terms=[...new Set(query.trim().split(/\s+/).filter(Boolean))].sort((a,b)=>b.length-a.length);
  if(!terms.length)return [{text:value,match:false}];
  // Literal terms only: punctuation in an API identifier is not a regular expression.
  const escaped=terms.map(t=>Array.from(t).map(c=>('^$.*+?()[]{}|'.includes(c)||c.charCodeAt(0)===92)?String.fromCharCode(92)+c:c).join(''));
  const regex=new RegExp(escaped.join('|'),'giu');
  const parts=[];let start=0;
  for(const match of value.matchAll(regex)) {
    if(match.index>start)parts.push({text:value.slice(start,match.index),match:false});
    parts.push({text:match[0],match:true});start=match.index+match[0].length;
  }
  if(start<value.length)parts.push({text:value.slice(start),match:false});
  return parts;
}
