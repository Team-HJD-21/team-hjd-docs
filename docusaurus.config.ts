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
  plugins: [[
    '@docusaurus/plugin-client-redirects',
    {redirects: [
      ...['', '/quick-start', '/api-reference', '/snapshots', '/testing', '/runtime-flows'].map(suffix => ({
        from: `/docs/turret${suffix}`, to: `/docs/projects/the-developer/turret${suffix}`,
      })),
      {from: '/turret-search', to: '/docs/projects/the-developer/api-search'},
      {from: '/projects/the-developer/search', to: '/docs/projects/the-developer/api-search'},
    ]},
  ]],
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
      title: '',
      logo: {alt: 'Team HJD Docs', src: 'img/brand/teamhjd-docs-logo.png'},
      items: [
        {href: 'https://teamhjd.com', label: '팀 홈페이지', position: 'left'},
        {to: '/docs/start-here', label: '시작하기', position: 'left'},
        {to: '/docs/collaboration/overview', label: '협업 가이드', position: 'left'},
        {to: '/docs/projects', label: '프로젝트 API', position: 'left'},
        {to: '/docs/editor-tools', label: '에디터 도구', position: 'left'},
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
            {label: '프로젝트 API', to: '/docs/projects'},
            {label: '에디터 도구', to: '/docs/editor-tools'},
          ],
        },
        {
          title: 'TeamHJD',
          items: [
            {label: '팀 홈페이지', href: 'https://teamhjd.com/'},
            {label: 'support@teamhjd.com', href: 'https://teamhjd.com/privacy/#email'},
            {label: '개인정보처리방침', href: 'https://teamhjd.com/privacy/'},
            {label: '콘텐츠 이용 · AI 학습 정책', href: 'https://teamhjd.com/content-policy/'},
          ],
        },
      ],
      copyright: `
        <div class="footer-company">
          <dl class="footer-business">
            <div><dt>상호</dt><dd>팀 에이치제이디(TeamHJD)</dd></div>
            <div><dt>대표자</dt><dd>황재동</dd></div>
            <div><dt>사업자등록번호</dt><dd>622-10-17519</dd></div>
            <div><dt>사업장 주소</dt><dd>경기도 수원시 영통구 태장로 71번길 19</dd></div>
          </dl>
          <small>© ${new Date().getFullYear()} TeamHJD. All rights reserved.</small>
        </div>`,
    },
    prism: {
      theme: {plain: {color: '#1f2937', backgroundColor: '#f8fafc'}, styles: []},
      darkTheme: {plain: {color: '#d9f2ee', backgroundColor: '#102832'}, styles: []},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
