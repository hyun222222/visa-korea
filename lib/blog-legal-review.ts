import revisionsData from './blog-legal-revisions.json' with { type: 'json' };
import type { BlogPost, BlogBlock } from './blog-posts';

type ReviewedFields = Pick<BlogPost, 'title' | 'excerpt' | 'body'> & {
  titleEn?: string | null;
  sources?: BlogPost['sources'];
  modifiedAt?: string;
};
const revisions = revisionsData as {slug: string; before: ReviewedFields; after: ReviewedFields}[];

// Normalize object key order because JSONB does not preserve it. Only the audited
// text is replaced; later editorial changes are never silently overwritten.
function textSnapshot(value: ReviewedFields) {
  const blocks = value.body.map((b: BlogBlock) => b.type === 'list'
    ? [b.type, b.items, Boolean(b.ordered)]
    : [b.type, b.text, b.type === 'callout' ? b.title : null]);
  return JSON.stringify([value.title, value.titleEn || null, value.excerpt, blocks]);
}

export function applyLegalReview(post: BlogPost): BlogPost {
  const revision = revisions.find(item => item.slug === post.slug);
  if (!revision) return post;
  const snapshot = textSnapshot(post);
  if (snapshot !== textSnapshot(revision.before) && snapshot !== textSnapshot(revision.after)) return post;
  return {...post, ...revision.after, titleEn: revision.after.titleEn ?? undefined};
}
