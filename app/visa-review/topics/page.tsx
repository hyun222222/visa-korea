import type {Metadata} from 'next';
import Link from 'next/link';
import {ReviewJsonLd} from '@/components/review-json-ld';
import {visaOrigin} from '@/lib/brand';
import {shareMetadata} from '@/lib/share-metadata';
import {articles} from '@/lib/visa-review-guide-content';
import {koreanGuideHubUrl, koreanReviewTopicUrl, type KoreanReviewTopic} from '@/lib/visa-review-ko-topics';
import {reviewOffice} from '@/lib/visa-review-server';
import review from '../review.module.css';
import styles from './guide-hub.module.css';

const title = '한국 비자·체류 안내';
const description = 'E-7 해고와 D-10 구직, D-8 투자, F-2-7·F-4·F-5 체류 요건, 비자 조회·불허·재입국까지 내 상황에 맞는 절차와 공식 자료를 확인하세요.';
const groups: {title: string; topics: KoreanReviewTopic[]}[] = [
  {title: '신청 결과를 확인하거나 불허 통지를 받았다면', topics: ['visa-status-check', 'visa-refusal', 'reentry']},
  {title: '한국에서 일자리를 찾거나 근무처를 바꾼다면', topics: ['e7-job-loss', 'd10-visa', 'e7-visa']},
  {title: '투자와 장기체류를 준비한다면', topics: ['d8-visa', 'f2-7-visa', 'f4-visa', 'f5-visa']},
];
const metaTitle = `${title} | 김현정 법률사무소`;
export const metadata: Metadata = {
  title: {absolute: metaTitle}, description,
  alternates: {canonical: koreanGuideHubUrl},
  ...shareMetadata({title: metaTitle, description, url: koreanGuideHubUrl, locale: 'ko_KR'}),
};

export default function KoreanGuideIndex() {
  const topics = groups.flatMap(group => group.topics);
  return <div className={`${review.site} ${styles.hub}`}>
    <ReviewJsonLd data={{
      '@type': 'CollectionPage', '@id': koreanGuideHubUrl, url: koreanGuideHubUrl,
      name: title, description, inLanguage: 'ko',
      publisher: {'@type': 'Organization', name: reviewOffice},
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: topics.map((topic, index) => ({
          '@type': 'ListItem', position: index + 1, name: articles[topic].title, url: koreanReviewTopicUrl(topic),
        })),
      },
    }}/>
    <header className={review.masthead}>
      <div className={review.container}>
        <span className={review.firm}>{reviewOffice}</span>
        <nav className={review.utility} aria-label="서비스 메뉴">
          <a href={visaOrigin + '/blog'}>비자·출입국 칼럼</a>
          <Link href="/visa-review?lang=ko#apply" prefetch={false}>서면검토 신청</Link>
        </nav>
      </div>
    </header>
    <div className={`${review.hero} ${review.marketHero}`}>
      <div className={review.container}><div>
        <h1>{title}</h1>
        <p className={review.lead}>지금 받은 통지나 준비 중인 체류자격을 고르세요. 글마다 먼저 볼 기준과 관련 법령, 공식 안내를 함께 담았습니다.</p>
      </div></div>
    </div>
    <div className={`${review.container} ${styles.groups}`}>
      {groups.map(group => <section key={group.title}>
        <h2>{group.title}</h2>
        <ul>{group.topics.map(topic => <li key={topic}>
          <a href={`/ko/${topic}`}>{articles[topic].title}</a>
          <p>{articles[topic].meta_description}</p>
        </li>)}</ul>
      </section>)}
    </div>
    <footer className={`${review.container} ${review.footer}`}>
      <strong>{reviewOffice}</strong><span>대표자 및 광고 주체 김현정 변호사</span>
      <a href={visaOrigin + '/ko'}>코리아비자로 · 한국 비자 안내</a>
    </footer>
  </div>;
}
