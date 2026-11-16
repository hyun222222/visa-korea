import articlesData from './search-articles-20261116.json' with { type: 'json' };
import legalRevisions from './blog-legal-revisions.json' with { type: 'json' };
import type { BlogPost } from './blog-posts';

export const searchArticles = articlesData as BlogPost[];
export const searchContentUpdated = '2026-11-16';
type ReviewedText = Pick<BlogPost, 'title' | 'excerpt' | 'body'>;
function snapshot(post: ReviewedText) {
  return JSON.stringify([post.title, post.excerpt, post.body.map(b => b.type === 'list'
    ? [b.type, b.items, Boolean(b.ordered)] : [b.type, b.text, b.type === 'callout' ? b.title : null])]);
}

// The CMS remains authoritative. These additions attach verified sources only to
// the exact reviewed text; future administrator edits are not silently replaced.
export function applySearchContentReview(post: BlogPost): BlogPost {
  const article = searchArticles.find(item => item.slug === post.slug);
  if (article && snapshot(post) === snapshot(article)) {
    return {...post, sources: article.sources, modifiedAt: searchContentUpdated};
  }
  if (post.slug === 'd8-visa-guide-en') {
    const reviewed = legalRevisions.find(item => item.slug === post.slug)?.after as (ReviewedText & Pick<BlogPost, 'sources'>) | undefined;
    const title = 'Korea D-8 Visa Requirements: Investment Structure & Evidence';
    if (reviewed && (snapshot(post) === snapshot(reviewed) ||
      snapshot(post) === snapshot({...reviewed, title}))) {
      return {...post, title, sources: reviewed.sources, modifiedAt: searchContentUpdated};
    }
  }
  return post;
}

export function consultationCopy(slug: string, lang: string) {
  if (lang !== 'ko' && lang !== 'en') return null;
  const en = lang === 'en';
  if (slug.startsWith('deportation-order-objection')) return {
    title: en ? 'A deportation order needs a date-specific review' : '강제퇴거명령, 받은 날짜부터 확인합니다',
    description: en ? 'Tell us the notice type, receipt date, detention status and any removal schedule. We explain the available review, scope and fees before engagement.' : '통지 종류·수령일·현재 보호 여부와 송환 일정을 알려주세요. 검토할 절차와 업무 범위·비용을 수임 전에 안내합니다.',
  };
  if (slug.startsWith('f6-marriage-visa-refusal-reapplication')) return {
    title: en ? 'Prepare the next step after an F-6 refusal' : '결혼비자 거절, 같은 자료를 다시 내기 전에',
    description: en ? 'Prepare the consular post, refusal date, reasons and required travel date. We review timing, possible exceptions and missing evidence; scope and fees are explained first.' : '신청 공관·불허일·거절 사유와 입국이 필요한 시점을 알려주세요. 재신청 시기·예외·보완자료를 검토하며 상담 범위와 비용을 먼저 안내합니다.',
  };
  return null;
}
