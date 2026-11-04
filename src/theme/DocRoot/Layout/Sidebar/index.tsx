import React, {type ReactNode, useEffect} from 'react';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import DocSidebar from '@theme/DocSidebar';
import type {Props} from '@theme/DocRoot/Layout/Sidebar';
import styles from './styles.module.css';

export default function DocRootLayoutSidebar({sidebar, hiddenSidebarContainer, setHiddenSidebarContainer}: Props): ReactNode {
  const {pathname} = useLocation();
  const toggle = () => setHiddenSidebarContainer(value => !value);
  useEffect(() => {
    // Close after selecting a document on a phone; resizing keeps the current state.
    if (window.matchMedia('(max-width: 640px)').matches) setHiddenSidebarContainer(true);
  }, [pathname, setHiddenSidebarContainer]);
  return <aside className={ThemeClassNames.docs.docSidebarContainer} data-collapsed={hiddenSidebarContainer}>
    <div className={styles.viewport}>
      <DocSidebar sidebar={sidebar} path={pathname} onCollapse={toggle} isHidden={hiddenSidebarContainer} />
      {hiddenSidebarContainer && <button className={styles.expand} type="button" onClick={toggle}
        title="사이드바 열기" aria-label="사이드바 열기" aria-expanded={false}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>}
    </div>
  </aside>;
}
