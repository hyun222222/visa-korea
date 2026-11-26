import type {KoreanReviewTopic} from './visa-review-ko-topics';
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

export type CompareSide = {title: string; items: string[]};
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

export const articles: Record<KoreanReviewTopic, TopicContent> = {
  'd10-visa': d10, 'd8-visa': d8, 'e7-job-loss': e7Loss, 'e7-visa': e7,
  'f2-7-visa': f27, 'f4-visa': f4, 'f5-visa': f5, reentry,
  'visa-refusal': refusal, 'visa-status-check': status,
};
