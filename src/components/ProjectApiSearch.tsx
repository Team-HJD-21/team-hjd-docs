import React,{useEffect,useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {searchPages,projects} from '@site/scripts/search-contract.mjs';
type Project='the-developer'|'leave-me-alone';
type Page={title:string;url:string;text:string;project:Project;archive:boolean;category:string};
export default function ProjectApiSearch({project='the-developer',archive=false}:{project?:Project;archive?:boolean}) {
  const [query,setQuery]=useState(''),[pages,setPages]=useState<Page[]>([]),[error,setError]=useState(false),[loading,setLoading]=useState(true);
  const indexUrl=useBaseUrl('/'+project+(archive?'-archive-search.json':'-search.json'));
  const name=projects[project];
  useEffect(()=>{const controller=new AbortController();setPages([]);setQuery('');setError(false);setLoading(true);
    fetch(indexUrl,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(p=>{if(!controller.signal.aborted){setPages(p);setLoading(false)}}).catch(e=>{if(e.name!=='AbortError'){setError(true);setLoading(false)}});
    return()=>controller.abort();
  },[indexUrl]);
  const results=searchPages(pages,project,archive,query) as Page[];
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return <section className="margin-vert--lg" aria-label={name+(archive?' 아카이브 검색':' 문서 검색')}>
    <h1>{name} {archive?'아카이브 검색':'문서 검색'}</h1>
    <p>{archive?'보관된 과거 문서만 검색합니다. 현재 작업 기준으로 사용하지 마세요.':'현재 문서의 제목·본문·API·도구 사용법을 검색합니다. 아카이브는 포함하지 않습니다.'}</p>
    <p><strong>검색 범위: {name}</strong> · <Link to={'/docs/projects/'+project+(archive?'/api-search':'/archive-search')}>{archive?'현행 문서 검색':'아카이브 검색'}</Link></p>
    <label htmlFor="project-document-query">{name} {archive?'보관 문서':'문서'} 검색어</label>
    <input id="project-document-query" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={name+' 안에서 검색'} style={{display:'block',width:'100%',padding:12,margin:'8px 0 24px',fontSize:'1rem'}} />
    {error?<p role="alert">검색 정보를 불러오지 못했습니다. <Link to={'/docs/projects/'+project}>프로젝트 목차</Link>를 이용하세요.</p>:loading?<p role="status">문서를 불러오는 중입니다.</p>:<><p aria-live="polite">{results.length}개 문서</p>{results.length===0&&<p>{archive?'조건에 맞는 보관 문서가 없습니다.':'검색어를 바꾸거나 더 짧게 입력해 보세요.'}</p>}<ul>{results.map(p=>{const match=terms.length?p.text.toLocaleLowerCase().indexOf(terms[0]):0;const start=Math.max(0,match-70);return <li key={p.url} className="margin-bottom--lg"><small>{archive?'보관 기록':p.category}</small><br/><Link to={p.url}>{p.title}</Link><p style={{whiteSpace:'pre-wrap'}}>{p.text.slice(start,start+230)}…</p></li>})}</ul></>}
  </section>;
}
