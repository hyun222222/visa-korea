import {shareMetadata} from '@/lib/share-metadata';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {articles, type CompareSide} from '@/lib/visa-review-guide-content';
import {guideLinks} from '@/lib/visa-review-guide-links';
import {ReviewJsonLd} from '@/components/review-json-ld';
import {isKoreanReviewTopic, koreanReviewTopics, koreanReviewTopicSlugs, koreanReviewTopicUrl, koreanGuideHubUrl} from '@/lib/visa-review-ko-topics';
import {visaReviewOrigin} from '@/lib/visa-review-locales';
import {copy, planPrice, type Plan} from '../../review-copy';
import {reviewBusinessRegistrationNumber} from '@/lib/visa-review-server';
import review from '../../review.module.css';
import styles from './topic.module.css';

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
    ...shareMetadata({title: article.title, description: article.meta_description, url, locale: 'ko_KR', article: {}}),
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
  const url = koreanReviewTopicUrl(topic);
  const {sources, related} = guideLinks[topic];
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
      <ReviewJsonLd data={{'@graph': [
        {
          '@type': 'Article', '@id': url + '#article', url, mainEntityOfPage: url,
          headline: article.title, description: article.meta_description, inLanguage: 'ko',
          publisher: {'@type': 'Organization', name: '김현정 법률사무소'},
          citation: sources.map(({label, url}) => ({'@type': 'CreativeWork', name: label, url})),
        },
        {
          '@type': 'FAQPage', '@id': url, url, inLanguage: 'ko', lastReviewed: article.verified_on,
          mainEntity: article.faq.map(({q, a}) => ({
            '@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a},
          })),
          breadcrumb: {'@id': url + '#breadcrumb'},
        },
        {
          '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
          itemListElement: [
            {'@type': 'ListItem', position: 1, name: '한국 비자·체류 안내', item: koreanGuideHubUrl},
            {'@type': 'ListItem', position: 2, name: koreanReviewTopics[topic], item: url},
          ],
        },
      ]}}/>
      <header className={review.masthead}>
        <div className={review.container}>
          <a className={review.firm} href={`${visaReviewOrigin}/?lang=ko`}>김현정 법률사무소</a>
          <nav className={review.utility} aria-label="주제 안내">
            <a href={koreanGuideHubUrl}>한국 비자·체류 안내</a>
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
              <p className={review.heroNote}>김현정 법률사무소 · 자료 기준일 <time dateTime={article.verified_on}>{article.verified_on}</time></p>
            </div>
          </div>
        </header>

        <div className={`${review.container} ${styles.reading}`}>
          <nav aria-label="현재 위치" className={styles.breadcrumb}>
            <a href={koreanGuideHubUrl}>한국 비자·체류 안내</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{koreanReviewTopics[topic]}</span>
          </nav>
          {topic === 'visa-status-check' && <p><a href={sources[0].url}>{sources[0].label}</a></p>}
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
          <section>
            <h2>공식 자료</h2>
            <ul>{sources.map(({label, url}) => <li key={url}><a href={url}>{label}</a></li>)}</ul>
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
          <p className={styles.related}>함께 읽기 · <a href={related.url}>{related.label}</a></p>
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
