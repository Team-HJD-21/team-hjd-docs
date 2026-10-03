import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'TeamHJD Docs',
  tagline: '함께 일하는 방식을 기록하고, 더 잘 만드는 팀의 지식 기반',
  url: process.env.SITE_URL ?? 'https://docs.teamhjd.com',
  baseUrl: process.env.SITE_BASE_URL ?? '/',
  organizationName: 'Team-HJD-21',
  projectName: 'team-hjd-docs',
  favicon: 'img/brand/favicon.png',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {defaultLocale: 'ko', locales: ['ko']},
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/Team-HJD-21/team-hjd-docs/tree/main/',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    image: 'img/teamhjd-social-card.png',
    navbar: {
      title: 'TeamHJD Docs',
      items: [
        {href: 'https://teamhjd.com', label: '팀 홈페이지', position: 'left'},
        {to: '/docs/start-here', label: '시작하기', position: 'left'},
        {to: '/docs/collaboration/overview', label: '협업 가이드', position: 'left'},
        {to: '/docs/turret', label: '터렛 API', position: 'left'},
        {to: '/turret-search', label: 'API 찾기', position: 'left'},
        {to: '/docs/reference/glossary', label: '용어 사전', position: 'left'},
        {to: '/docs/reference/abbreviations', label: '약어', position: 'left'},
        {href: 'https://github.com/Team-HJD-21/team-hjd-docs', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '문서',
          items: [
            {label: '새 팀원 시작하기', to: '/docs/start-here'},
            {label: '협업 가이드', to: '/docs/collaboration/overview'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TeamHJD. Built with Docusaurus.`,
    },
    prism: {
      theme: {plain: {color: '#1f2937', backgroundColor: '#f8fafc'}, styles: []},
      darkTheme: {plain: {color: '#d9f2ee', backgroundColor: '#102832'}, styles: []},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
