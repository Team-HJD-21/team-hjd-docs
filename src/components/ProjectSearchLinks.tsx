import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
export default function ProjectSearchLinks(){const {pathname}=useLocation();const project=pathname.includes('/projects/leave-me-alone')?'leave-me-alone':pathname.includes('/projects/the-developer')||pathname.includes('/editor-tools/the-developer')?'the-developer':null;if(!project)return null;return <nav aria-label="프로젝트 문서 검색" className="margin-bottom--md"><Link to={'/docs/projects/'+project+'/api-search'}>문서 검색</Link> · <Link to={'/docs/projects/'+project+'/archive-search'}>아카이브 검색</Link></nav>}
