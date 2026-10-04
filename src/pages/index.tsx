import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

const paths = [
  {level: '필수', title: '새 팀원 시작하기', text: '첫 작업 전 알아야 할 협업 흐름과 문서 읽는 법', to: '/docs/start-here'},
  {level: '필수', title: 'Issue → PR → Merge', text: '작업 하나가 팀에 안전하게 반영되는 전체 과정', to: '/docs/collaboration/overview'},
  {level: '중요', title: 'PR과 리뷰', text: '변경을 공유하고 더 나은 코드로 만드는 방법', to: '/docs/delivery/pull-request'},
];

export default function Home(): JSX.Element {
  const logoForLightMode = useBaseUrl('img/brand/teamhjd-dark.png');
  const logoForDarkMode = useBaseUrl('img/brand/teamhjd-light.png');

  return <Layout title="팀의 지식이 흐르는 곳" description="TeamHJD 기술 및 협업 문서">
    <main>
      <section className={styles.hero}>
        <div className={styles.brandLockup} aria-hidden="true">
          <img className={styles.logoOnLight} src={logoForLightMode} alt="" />
          <img className={styles.logoOnDark} src={logoForDarkMode} alt="" />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>TEAMHJD KNOWLEDGE BASE</p>
          <h1>필요한 순간에,<br />다음 행동이 보이는 문서</h1>
          <p className={styles.lead}>개념을 모아두는 곳을 넘어, 팀원이 같은 흐름으로 일하도록 돕는 TeamHJD의 기술·협업 가이드입니다.</p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/docs/start-here">처음부터 따라가기</Link>
            <Link className="button button--secondary button--lg" to="/docs/collaboration/overview">협업 흐름 보기</Link>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><p>RECOMMENDED PATH</p><h2>처음이라면 이 순서로 읽어요</h2></div>
        <div className={styles.cards}>{paths.map((path, index) => <Link key={path.title} to={path.to} className={styles.card}>
          <span className={clsx(styles.badge, path.level === '필수' && styles.required)}>{index + 1}. {path.level}</span>
          <h3>{path.title}</h3><p>{path.text}</p><span className={styles.arrow}>읽기 →</span>
        </Link>)}</div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><p>PROJECT DOCUMENTATION</p><h2>프로젝트별 개발 문서</h2></div>
        <article className={styles.projectEntry}>
          <div><h3>The Developer</h3><p>Core · Player · World / Spaceship · Turret / Power · Enemy<br />main 기준 API와 모듈 연결 방법을 확인하세요.</p></div>
          <div className={styles.actions}>
            <Link className="button button--primary" to="/docs/projects/the-developer">문서 들어가기 →</Link>
            <Link className="button button--secondary" to="/projects/the-developer/search">API 찾기</Link>
          </div>
        </article>
      </section>
      <section className={clsx(styles.section, styles.situation)}>
        <div className={styles.sectionHeading}><p>FIND BY MOMENT</p><h2>지금 어떤 도움이 필요한가요?</h2></div>
        <div className={styles.situationLinks}>
          <Link to="/docs/collaboration/git-basics">처음 GitHub에서 작업해요 <span>→</span></Link>
          <Link to="/docs/delivery/pull-request">PR을 올리거나 리뷰해야 해요 <span>→</span></Link>
          <Link to="/docs/team/onboarding">팀의 방식과 기준이 궁금해요 <span>→</span></Link>
          <Link to="/docs/reference/glossary">용어가 낯설어요 <span>→</span></Link>
        </div>
      </section>
    </main>
  </Layout>;
}
