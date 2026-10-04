import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

type Page = {title: string; url: string; text: string};
export default function TheDeveloperSearch() {
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState(false);
  const indexUrl = useBaseUrl('/the-developer-search.json?revision=b73e0e76-projects-v1');
  useEffect(() => {
    const controller = new AbortController();
    fetch(indexUrl, {signal: controller.signal}).then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    }).then(setPages).catch(err => {if (err.name !== 'AbortError') setError(true);});
    return () => controller.abort();
  }, [indexUrl]);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = pages.filter(page => terms.every(term => `${page.title} ${page.text}`.toLocaleLowerCase().includes(term)));
  return <Layout title="The Developer API 찾기" description="메서드 이름과 한글 설명으로 The Developer의 모듈 연동 문서 검색">
    <main className="container margin-vert--lg" style={{maxWidth: 900}}>
      <h1>The Developer API 찾기</h1>
      <p>메서드 이름 또는 한글 설명으로 찾아보세요. 예: ApplyDamage, TrySpawn 또는 전력</p>
      <label htmlFor="turret-query">검색어</label>
      <input id="turret-query" type="search" value={query} onChange={event => setQuery(event.target.value)}
        style={{display: 'block', width: '100%', padding: 12, margin: '8px 0 24px', fontSize: '1rem'}} />
      {error ? <p role="alert">검색 정보를 불러오지 못했습니다. <Link to="/docs/projects/the-developer">문서 목차</Link>를 이용하세요.</p>
        : <><p aria-live="polite">{results.length}개 문서</p><ul>{results.map(page => {
          const match = terms.length ? page.text.toLocaleLowerCase().indexOf(terms[0]) : 0;
          const start = Math.max(0, match - 70);
          return <li key={page.url} className="margin-bottom--lg"><Link to={page.url}>{page.title}</Link>
            <p style={{whiteSpace: 'pre-wrap'}}>{page.text.slice(start, start + 230)}…</p></li>;
        })}</ul></>}
    </main>
  </Layout>;
}
