import {headers} from 'next/headers';
import {visaOrigin} from '@/lib/brand';
import {koreanGuideHubUrl, koreanReviewTopics, koreanReviewTopicSlugs, koreanReviewTopicUrl} from '@/lib/visa-review-ko-topics';
import {reviewMarkets, reviewMarketsInOrder, reviewMarketUrl, visaReviewOrigin} from '@/lib/visa-review-locales';

export async function GET() {
  const review = (await headers()).get('x-kimhyun-review-host') === '1';
  const title = review
    ? '# Korean visa written review · 김현정 법률사무소'
    : '# Korea Visa Law · Kim & Hyun Law Office · 김앤현 법률사무소';
  const services = [
    '## Korean visa written review',
    '김현정 법률사무소 provides written reviews by email. USD 55 covers one question without attachments. USD 99 covers a requirements review for one person and one status, with up to two documents. See each service page for the USD 330 scope, timing and terms.',
    ...reviewMarketsInOrder.map(code => `- [${reviewMarkets[code].label}](${reviewMarketUrl(code)})`),
    '',
    `## [한국어 비자 주제별 안내](${koreanGuideHubUrl})`,
    ...koreanReviewTopicSlugs.map(slug => `- [${koreanReviewTopics[slug]}](${koreanReviewTopicUrl(slug)})`),
  ];
  const main = [
    '## Visa, residence and airport entry in Korea',
    `- [한국어](${visaOrigin}/ko) · [English](${visaOrigin}/en) · [中文](${visaOrigin}/zh) · [日本語](${visaOrigin}/ja)`,
    `- [한국어 법률정보](${visaOrigin}/blog) · [English legal articles](${visaOrigin}/en/blog) · [中文法律信息](${visaOrigin}/zh/blog) · [日本語の法律情報](${visaOrigin}/ja/blog)`,
    `- [Korean visa refusal at a consulate](${visaOrigin}/en/visa-refusal-remedy)`,
    `- [E-7 employment ending and D-10](${visaOrigin}/en/blog/e7-termination-d10-en)`,
    `- [D-8 投资签证与汇款前核对](${visaOrigin}/zh/blog/d8-visa-guide-zh)`,
    `- [Airport entry refusal](${visaOrigin}/en/entry-refusal) · [공항 입국불허](${visaOrigin}/ko/entry-refusal). The airport service page describes the engagement and its fee.`,
  ];
  return new Response([
    title, '', ...(review ? services : main), '', ...(review ? main : services), '',
    '## References',
    '- [Korea Visa Portal · application status](https://www.visa.go.kr/openPage.do?MENU_ID=10301&LANG_TYPE=EN)',
    '- [Korea Immigration Service](https://www.immigration.go.kr/)',
    '- [Kim & Hyun · office and lawyer information](https://kimnhyun.com/about/)',
    `- [Main sitemap](${visaOrigin}/sitemap.xml) · [Written review sitemap](${visaReviewOrigin}/sitemap.xml)`,
    '',
  ].join('\n'), {headers: {'Content-Type': 'text/plain; charset=utf-8'}});
}
