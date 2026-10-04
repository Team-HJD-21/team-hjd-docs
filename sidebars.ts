import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projects: [
    'projects/index',
    {
      type: 'category', label: 'The Developer', collapsed: false,
      link: {type: 'doc', id: 'projects/the-developer/index'},
      items: [
        'projects/the-developer/api-search',
        ...[
          {name: 'core', label: 'Core — 세션·명령·이벤트', pages: ['quick-start', 'api-reference', 'events', 'testing']},
          {name: 'player', label: 'Player — 입력·전투·피해', pages: ['quick-start', 'combat', 'health', 'skills', 'testing']},
          {name: 'world', label: 'World / Spaceship — 공간·씬·진행 상태', pages: ['quick-start', 'spatial-inputs', 'progress', 'testing']},
        ].map(({name, label, pages}) => ({
          type: 'category' as const, label, collapsed: true,
          link: {type: 'doc' as const, id: `projects/the-developer/${name}`},
          items: pages.map(page => `projects/the-developer/${name}/${page}`),
        })),
        {
          type: 'category', label: 'Turret / Power — 터렛·전력·상태', collapsed: true,
          link: {type: 'doc', id: 'projects/the-developer/turret/index'},
          items: ['quick-start', 'api-reference', 'snapshots', 'testing', 'runtime-flows'].map(name => `projects/the-developer/turret/${name}`),
        },
        {
          type: 'category', label: 'Enemy / Encounter — 스폰·타깃·피해', collapsed: true,
          link: {type: 'doc', id: 'projects/the-developer/enemy'},
          items: ['quick-start', 'api-reference', 'targeting', 'damage', 'testing'].map(page => `projects/the-developer/enemy/${page}`),
        },
        'projects/the-developer/integration',
      ],
    },
  ],
  docs: [
    'start-here',
    {
      type: 'category',
      label: '01–14. Git과 작업 시작',
      collapsed: false,
      items: [
        'collaboration/overview',
        'collaboration/git-basics',
        'collaboration/git-workflow',
        'collaboration/github-flow',
      ],
    },
    {
      type: 'category',
      label: '15–26. PR부터 릴리스까지',
      collapsed: false,
      items: ['delivery/pull-request', 'delivery/quality-checks'],
    },
    {
      type: 'category',
      label: '27–31. Unity와 개발 지식',
      collapsed: false,
      items: [
        'collaboration/unity-git',
        'collaboration/advanced-git',
        'reference/glossary',
        'reference/abbreviations',
      ],
    },
    {
      type: 'category',
      label: '32–33. 팀 온보딩과 운영',
      collapsed: true,
      items: ['team/onboarding', 'team/working-agreements', 'team/document-contribution'],
    },
    {
      type: 'category',
      label: '문서 이용 안내',
      collapsed: true,
      items: ['reference/priority-guide'],
    },
  ],
};

export default sidebars;
