import React from 'react';
import OriginalComponents from '@theme-original/MDXComponents';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import GuideMedia from '@site/src/components/GuideMedia';

function GameWordmark() {
  const src = useBaseUrl('/img/brand/the-developer-logo.png');
  return <span className="brand-game"><img src={src} width="1280" height="714" alt="The Developer" /></span>;
}

function LeaveMeAloneLogo() {
  const src = useBaseUrl('/img/projects/leave-me-alone/logo.png');
  return <span className="brand-leave-me-alone"><img src={src} width="2172" height="724" alt="Leave Me Alone!!!" /></span>;
}

function LeaveMeAloneEntryLink() {
  const src = useBaseUrl('/img/projects/leave-me-alone/logo.png');
  return (
    <Link className="leave-me-alone-entry" to="/docs/projects/leave-me-alone">
      <span className="leave-me-alone-entry-logo">
        <img src={src} width="2172" height="724" alt="Leave Me Alone!!!" />
      </span>
      <span>개발 문서 시작하기</span>
    </Link>
  );
}

function brandChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, child => {
    if (typeof child !== 'string') return child;
    return child.split(/(The Developer)/g).map((part, index) =>
      part === 'The Developer' ? <GameWordmark key={index} /> : part);
  });
}

function withGameBrand(Component: React.ElementType) {
  return function BrandedText({children, ...props}: any) {
    return <Component {...props}>{brandChildren(children)}</Component>;
  };
}

export default {
  ...OriginalComponents,
  GuideMedia,
  LeaveMeAloneLogo,
  LeaveMeAloneEntryLink,
  h1: withGameBrand(OriginalComponents.h1),
  h2: withGameBrand(OriginalComponents.h2),
  h3: withGameBrand(OriginalComponents.h3),
  a: withGameBrand(OriginalComponents.a),
};
