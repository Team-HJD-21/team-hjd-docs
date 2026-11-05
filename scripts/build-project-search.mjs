import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
function previewMarkdown(body,name,base) {
  return body.replace(/import .*?;\r?\n/g,'').replace(/(!?\[[^\]]*\])\(([^)\s]+)\)/g,(all,label,target)=>{
    if (/^(?:\w+:|\/)/.test(target))return all;
    if(target.startsWith('#')) {
      const slug=name.replace(/\.mdx?$/,'').replace(/(^|\/)index$/,'');
      return label+'('+base+(slug?'/'+slug:'')+target+')';
    }
    const resolved=path.posix.normalize(path.posix.dirname(name)+'/'+target).replace(/\.mdx?(#|$)/,'$1').replace(/(^|\/)index(#|$)/,'$1');
    return label+'('+base+'/'+resolved+')';
  });
}
async function collect(dir,project,base,relative='') {
  const result=[];
  for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
    const name=relative+entry.name;
    if(entry.isDirectory())result.push(...await collect(path.join(dir,entry.name),project,base,name+'/'));
    else if(/\.mdx?$/.test(name) && !/(^|\/)(api-search|search|archive-search)\.mdx?$/.test(name)) {
      const raw=await readFile(path.join(dir,entry.name),'utf8');
      const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const body=raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
      const title=(front?.[1].match(/^title:\s*(.+)$/m)?.[1] || body.match(/^# (.+)$/m)?.[1] || entry.name).replace(/^['"]|['"]$/g,'');
      const slug=name.replace(/\.mdx?$/,'').replace(/(^|\/)index$/,'');
      const archive=name.startsWith('archive/');
      result.push({project,archive,title,url:base+(slug?'/'+slug:''),category:archive?'보관 기록':name.includes('/')?name.split('/')[0]:'프로젝트 안내',markdown:previewMarkdown(body,name,base),text:body.replace(/import .*?;\r?\n/g,'').replace(/[#|*]/g,'')});
    }
  }
  return result;
}
await mkdir(path.join(root,'static'),{recursive:true});
for(const project of ['the-developer','leave-me-alone']) {
  const pages=await collect(path.join(root,'docs/projects',project),project,'/docs/projects/'+project);
  if(project==='the-developer')pages.push(...await collect(path.join(root,'docs/editor-tools/the-developer'),project,'/docs/editor-tools/the-developer'));
  for(const archive of [false,true]) {
    const selected=pages.filter(p=>p.archive===archive);
    await writeFile(path.join(root,'static',project+(archive?'-archive-search.json':'-search.json')),JSON.stringify(selected));
    console.log(project+(archive?' archive: ':' current: ')+selected.length);
  }
}
