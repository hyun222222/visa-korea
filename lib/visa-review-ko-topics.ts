import {visaReviewOrigin} from './visa-review-locales';

export const koreanGuideHubPath = '/ko/visa-guides';
export const koreanGuideHubUrl = visaReviewOrigin + koreanGuideHubPath;

export const koreanReviewTopics = {
  'e7-job-loss': 'E-7 해고·퇴직',
  'd10-visa': 'D-10 구직',
  'd8-visa': 'D-8 투자',
  'e7-visa': 'E-7 취업',
  'f2-7-visa': 'F-2-7 점수제 거주',
  'f4-visa': 'F-4 재외동포',
  'f5-visa': 'F-5 영주',
  'visa-refusal': '비자 불허·재신청',
  reentry: '출국 후 재입국',
  'visa-status-check': '비자 결과·체류 조회',
} as const;

export type KoreanReviewTopic = keyof typeof koreanReviewTopics;
export const koreanReviewTopicSlugs = Object.keys(koreanReviewTopics) as KoreanReviewTopic[];

export function isKoreanReviewTopic(value: unknown): value is KoreanReviewTopic {
  return typeof value === 'string' && Object.hasOwn(koreanReviewTopics, value);
}

export function koreanReviewTopicUrl(slug: KoreanReviewTopic) {
  return `${visaReviewOrigin}/ko/${slug}`;
}
