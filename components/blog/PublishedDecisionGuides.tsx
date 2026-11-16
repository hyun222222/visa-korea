import {getSupabasePosts} from '@/lib/blog-db';
import type {Language} from '@/lib/brand';

// A guide is linked only when it is actually available in the authoritative CMS.
export async function PublishedDecisionGuides({lang}: {lang: Language}) {
  if (lang !== 'ko' && lang !== 'en') return null;
  const slugs = ['deportation-order-objection', 'f6-marriage-visa-refusal-reapplication']
    .map(slug => lang === 'en' ? `${slug}-en` : slug);
  const posts = (await getSupabasePosts()).filter(post => slugs.includes(post.slug));
  if (!posts.length) return null;
  return <section className="kh-section"><h2>{lang === 'ko' ? '통지를 받았다면 먼저 확인할 기한과 자료' : 'Received a decision? Check the deadlines and evidence'}</h2>
    <div className="kh-columns">{posts.map(post => <article className="kh-note" key={post.slug}>
      <h3><a href={`${lang === 'ko' ? '' : '/en'}/blog/${post.slug}`}>{post.title} ↗</a></h3><p>{post.excerpt}</p>
    </article>)}</div>
  </section>;
}
