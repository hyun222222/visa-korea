import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import d10 from '@/content/visa-review-ko/d10-visa.json';
import d8 from '@/content/visa-review-ko/d8-visa.json';
import e7Loss from '@/content/visa-review-ko/e7-job-loss.json';
import e7 from '@/content/visa-review-ko/e7-visa.json';
import f27 from '@/content/visa-review-ko/f2-7-visa.json';
import f4 from '@/content/visa-review-ko/f4-visa.json';
import f5 from '@/content/visa-review-ko/f5-visa.json';
import reentry from '@/content/visa-review-ko/reentry.json';
import refusal from '@/content/visa-review-ko/visa-refusal.json';
import status from '@/content/visa-review-ko/visa-status-check.json';
import {isKoreanReviewTopic, koreanReviewTopics, koreanReviewTopicSlugs, koreanReviewTopicUrl, type KoreanReviewTopic} from '@/lib/visa-review-ko-topics';
import {visaReviewOrigin} from '@/lib/visa-review-locales';
import {copy, planPrice, type Plan} from '../../review-copy';
import {reviewBusinessRegistrationNumber} from '@/lib/visa-review-server';
import review from '../../review.module.css';
import styles from './topic.module.css';

type CompareSide = {title: string; items: string[]};
type CaseSide = CompareSide & {ref: string};
type TopicContent = {
  verified_on: string;
  eyebrow: string;
  title: string;
  meta_description: string;
  lead: string[];
  situations: string[];
  facts: {label: string; value: string; basis?: string}[];
  flow: {title: string; steps: {name: string; desc: string}[]};
  table: {title: string; head: string[]; rows: string[][]};
  versus: {title: string; left: CompareSide; right: CompareSide; first?: boolean};
  cases?: {title: string; left: CaseSide; right: CaseSide; point?: string};
  depends: {title: string; items: string[]};
  risks: {text: string; basis?: string}[];
  checks: string[];
  hook: {tier: string; text: string};
  faq: {q: string; a: string}[];
};

const articles: Record<KoreanReviewTopic, TopicContent> = {
  'd10-visa': d10, 'd8-visa': d8, 'e7-job-loss': e7Loss, 'e7-visa': e7,
  'f2-7-visa': f27, 'f4-visa': f4, 'f5-visa': f5, reentry,
  'visa-refusal': refusal, 'visa-status-check': status,
};

const planByTier: Record<string, Plan> = {55: 'question', 99: 'documents', 330: 'strategy'};
type Props = {params: Promise<{topic: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {topic} = await params;
  if (!isKoreanReviewTopic(topic)) notFound();
  const article = articles[topic];
  const url = koreanReviewTopicUrl(topic);
  return {
    title: `${article.title} | 김현정 법률사무소`,
    description: article.meta_description,
    alternates: {canonical: url},
    openGraph: {type: 'article', title: article.title, description: article.meta_description, url, locale: 'ko_KR'},
  };
}

function Items({items}: {items: string[]}) {
  return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function Comparison({side}: {side: CompareSide & {ref?: string}}) {
  return <div><h3>{side.title}</h3>{side.ref && <p><small>{side.ref}</small></p>}<Items items={side.items}/></div>;
}

export default async function KoreanReviewTopicPage({params}: Props) {
  const {topic} = await params;
  if (!isKoreanReviewTopic(topic)) notFound();
  const article = articles[topic];
  const {flow, table, versus, cases, depends} = article;
  const plan = planByTier[article.hook.tier];
  const planLabel = `${copy.ko.plan[plan].title} · US$${planPrice[plan]}`;
  const checkout = `${visaReviewOrigin}/visa-review?lang=ko&plan=${plan}#apply`;
  const businessNumber = reviewBusinessRegistrationNumber();
  const comparison = <section>
    <h2>{versus.title}</h2>
    <div className={styles.compare}><Comparison side={versus.left}/><Comparison side={versus.right}/></div>
  </section>;
  return (
    <div className={`${review.site} ${styles.topic}`}>
      <header className={review.masthead}>
        <div className={review.container}>
          <a className={review.firm} href={`${visaReviewOrigin}/?lang=ko`}>김현정 법률사무소</a>
          <nav className={review.utility} aria-label="주제 안내">
            <a href="#topics">체류자격별 안내</a>
            <a href={checkout}>서면검토 신청</a>
          </nav>
        </div>
      </header>

      <article>
        <header className={`${review.hero} ${review.marketHero}`}>
          <div className={review.container}>
            <div>
              <p className={review.eyebrow}>{article.eyebrow}</p>
              <h1>{article.title}</h1>
              <div className={styles.lead}>{article.lead.map(line => <p key={line}>{line}</p>)}</div>
              <p className={review.heroNote}>원고 확인 <time dateTime={article.verified_on}>{article.verified_on}</time></p>
            </div>
          </div>
        </header>

        <div className={`${review.container} ${styles.reading}`}>
          <section>
            <h2>이런 상황이라면</h2>
            <Items items={article.situations}/>
          </section>
          {versus.first && comparison}
          <section>
            <h2>먼저 확인할 기준</h2>
            <dl className={styles.facts}>
              {article.facts.map(fact => <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}{fact.basis && <small>{fact.basis}</small>}</dd>
              </div>)}
            </dl>
          </section>
          <section>
            <h2>{flow.title}</h2>
            <ol className={styles.steps}>{flow.steps.map(step => <li key={step.name}><strong>{step.name}</strong> {step.desc}</li>)}</ol>
          </section>
          <section>
            <h2 id="reference-table">{table.title}</h2>
            <div className={styles.table} role="region" aria-labelledby="reference-table" tabIndex={0}>
              <table>
                <thead><tr>{table.head.map((cell, i) => <th key={i} scope="col">{cell}</th>)}</tr></thead>
                <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) =>
                  j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </section>
          {!versus.first && comparison}
          {cases && <section>
            <h2>{cases.title}</h2>
            <div className={styles.compare}><Comparison side={cases.left}/><Comparison side={cases.right}/></div>
            {cases.point && <p>{cases.point}</p>}
          </section>}
          <section>
            <h2>{depends.title}</h2>
            <Items items={depends.items}/>
          </section>
          <section>
            <h2>유의할 점</h2>
            <ul>{article.risks.map(risk => <li key={risk.text}>{risk.text}{risk.basis && <small>{risk.basis}</small>}</li>)}</ul>
          </section>
          <section>
            <h2>신청 전 확인 항목</h2>
            <Items items={article.checks}/>
          </section>
          <section className={styles.cta}>
            <h2>내 상황을 변호사에게 서면으로 검토받기</h2>
            <p>{article.hook.text}</p>
            <p>결제 후 같은 화면에서 질문과 상품에 필요한 자료를 제출합니다. 결제와 필수 자료를 확인하고 수임을 확정한 때부터 24시간 이내에 서면 검토 결과를 전달합니다.</p>
            <a href={checkout} className={review.primary}>{planLabel} 서면검토 신청</a>
          </section>
          <section>
            <h2>자주 묻는 질문</h2>
            <dl className={styles.questions}>{article.faq.map(({q, a}) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}</dl>
          </section>
        </div>
      </article>

      <div className={`${review.container} ${styles.reading}`}>
        <nav id="topics" aria-labelledby="topics-heading" className={styles.topics}>
          <h2 id="topics-heading">체류자격별 안내</h2>
          <ul>{koreanReviewTopicSlugs.map(slug => <li key={slug}>
            <a href={koreanReviewTopicUrl(slug)} aria-current={slug === topic ? 'page' : undefined}>{koreanReviewTopics[slug]}</a>
          </li>)}</ul>
        </nav>
        <footer className={review.footer}>
          <strong>김현정 법률사무소</strong>
          <span>대표자 및 광고 주체 김현정 변호사</span>
          {businessNumber && <span>사업자등록번호 {businessNumber}</span>}
          <span>서울특별시 서초구 법원로 16, 정곡빌딩 동관 502호</span>
          <span><a href="mailto:info@kimnhyun.com">info@kimnhyun.com</a> · <a href="tel:+82234777600">02-3477-7600</a></span>
        </footer>
      </div>
    </div>
  );
}
