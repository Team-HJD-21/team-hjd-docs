/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';

import {useDoc} from '@docusaurus/plugin-content-docs/client';
import ProjectSearchLinks from '@site/src/components/ProjectSearchLinks';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';

import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';

import styles from '@docusaurus/theme-classic/lib/theme/DocItem/Layout/styles.module.css';

/**
 * Keep the outline beside the article at every viewport width
 */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();


  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;



  const desktop =
    canRender ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,

    desktop,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  return (
    <div className="row team-doc-row">
      <div className={clsx('col team-doc-article', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <ProjectSearchLinks />
            <DocVersionBadge />

            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3 team-doc-outline">{docTOC.desktop}</div>}
    </div>
  );
}
