import React, {type ReactNode} from 'react';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';
import type {Props} from '@theme/DocSidebar';

export default function DocSidebar(props: Props): ReactNode {
  return <div className="team-doc-sidebar-desktop" inert={props.isHidden}>
    <DocSidebarDesktop {...props} isHidden={false} />
  </div>;
}
