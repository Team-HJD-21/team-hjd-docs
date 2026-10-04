import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  projects: [
    'projects/index',
    {
      type: 'category', label: 'The Developer', collapsed: false,
      link: {type: 'doc', id: 'projects/the-developer/index'},
      items: [
        'projects/the-developer/core', 'projects/the-developer/player', 'projects/the-developer/world',
        {
          type: 'category', label: 'Turret · Power', collapsed: false,
          link: {type: 'doc', id: 'projects/the-developer/turret/index'},
          items: ['quick-start', 'api-reference', 'snapshots', 'testing', 'runtime-flows'].map(name => `projects/the-developer/turret/${name}`),
        },
        'projects/the-developer/enemy', 'projects/the-developer/integration',
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
