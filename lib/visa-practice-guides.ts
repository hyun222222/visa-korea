import type { BlogBlock, BlogPost } from './blog-posts';

export const e7TerminationGuideSlug = 'e7-termination-d10-en';
export const d8RemittanceGuideSlug = 'd8-visa-guide-zh';
const reviewedAt = '2026-11-19';

export const e7TerminationGuide: BlogPost = {
  slug: e7TerminationGuideSlug,
  title: 'E-7 termination and D-10 in Korea: Do I need a letter of release?',
  excerpt: 'Lost your E-7 job in Korea? Check how your employment ended, which immigration procedure applies, and what to prepare if your former employer will not sign a letter of release.',
  category: 'immigration-practice',
  keywords: ['E-7 termination', 'E-7 to D-10', 'Korea letter of release', 'E-7 employer change'],
  publishedAt: reviewedAt,
  modifiedAt: reviewedAt,
  author: 'Kim & Hyun Law Office',
  readMinutes: 4,
  body: [
    {type: 'h2', text: 'Check which immigration procedure you need'},
    {type: 'p', text: 'If you are still looking for work, ask whether you meet the D-10 job-seeker requirements. If you already have another job offer and plan to stay on E-7, ask which workplace-change procedure applies to your occupation. D-10 requires approval for a change of status under Article 24 of the Immigration Act. A workplace change under Article 21 generally requires advance permission, although eligible workers can use a report. Confirm the applicable procedure before you start at the new workplace.'},
    {type: 'p', text: 'The D-10 job-seeker category covers preparation for employment in eligible professional fields. Immigration assesses D-10 eligibility separately from the way your E-7 contract ended. Check your exact E-7 subtype, including E-7-4 if applicable, your qualifications, the field in which you will look for work, and the conditions on your current stay.'},
    {type: 'h2', text: 'When a letter of release may matter'},
    {type: 'p', text: 'For an E-7 workplace change, Annex 5-2 of the Enforcement Rules lists consent from the former workplace. It states exceptions where the workplace suspended or closed its business, or where you worked until the contract expired or the date both sides agreed. For a D-10 application, ask the immigration office which evidence of separation it needs, especially if the contract term remains or the former employer disputes how employment ended.'},
    {type: 'h3', text: 'Was the contract ended early?'},
    {type: 'p', text: 'Distinguish dismissal, resignation, and an agreed end date. Keep the original contract and any amendment, the written notice or emails stating the reason and effective date, and any record of an agreed last day. If your former employer will not provide a letter, ask which records the immigration office will consider. Acceptance of any alternative depends on the facts and the application.'},
    {type: 'h2', text: 'Record three dates before you contact immigration'},
    {type: 'list', ordered: true, items: [
      'Your contract’s scheduled end date and the date employment actually ended.',
      'The authorized stay expiry date on your residence record and any separate date shown on a notice from immigration.',
      'The start date on any new offer and whether you need advance permission for that workplace.',
    ]},
    {type: 'p', text: 'Article 19 generally gives the employer 15 days to report a dismissal or departure to the immigration office. Your own filing and stay dates must be checked separately. Hi Korea and the immigration contact centre at 1345 can help identify the responsible office and applicable procedure.'},
  ],
  sources: [
    {title: 'Immigration Act, Article 19 (employer reporting)', url: 'https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031816569'},
    {title: 'Immigration Act, Article 21 (workplace changes)', url: 'https://www.law.go.kr/법령/출입국관리법/제21조'},
    {title: 'Immigration Act, Article 24 (change of status)', url: 'https://www.law.go.kr/법령/출입국관리법/제24조'},
    {title: 'Immigration Act Enforcement Decree, Annex 1-2 (D-10 and E-7)', url: 'https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=152014589'},
    {title: 'Immigration Act Enforcement Rules, Annex 5-2 (supporting documents)', url: 'https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=152659855'},
    {title: 'Hi Korea immigration services', url: 'https://www.hikorea.go.kr/Main.pt'},
  ],
};

const d8RemittanceHeading = '汇款前先核对投资流程、账户与证明材料';
const d8RemittanceBlocks: BlogBlock[] = [
  {type: 'h2', text: d8RemittanceHeading},
  {type: 'list', ordered: true, items: [
    '先写清拟申请的D-8类别、出资人、韩国企业的设立进度、认购新股还是购买现有股权，以及你将在公司承担的工作。登记所需条件与居留资格应分别核对。',
    '把投资结构和拟汇款安排交给受理外商投资申报的机构和经办外汇银行确认。KOTRA的新设指引列出的现金出资流程包括申报、汇款、股款缴纳、法人及营业登记，再办理外商投资企业登记。购入现有股权等其他方式应另行核对适用程序。',
    '向银行确认汇款人姓名、收款账户、汇款币种、用途说明及银行所需资料。如果汇款人和投资者不同，先核对资金权属、申报内容和银行拟出具的凭证，再决定如何汇款。',
    '提前备好能对应投资人与资金来源的资料，汇款后保留银行汇款凭证、入账记录及出资证明。把申报、汇款、股款缴纳与企业登记日期列成一张时间表。',
  ]},
];

export function addD8RemittanceReview(post: BlogPost): BlogPost {
  if (post.slug !== d8RemittanceGuideSlug || post.body.some(block => block.type === 'h2' && block.text === d8RemittanceHeading)) {
    return post;
  }

  const knownTitle = '韩国D-8投资签证：公司设立、资金入境与经营资料';
  return {
    ...post,
    title: post.title === knownTitle ? '韩国D-8投资签证：汇款前要确认的申请流程与所需材料' : post.title,
    body: [...d8RemittanceBlocks, ...post.body],
    modifiedAt: reviewedAt,
    sources: [
      ...(post.sources ?? []),
      {title: 'KOTRA Invest KOREA｜新设公司与投资资金汇款', url: 'https://www.investkorea.org/ik-ch/cntnts/i-2564/web.do'},
      {title: 'KOTRA Invest KOREA｜各类外商投资程序', url: 'https://www.investkorea.org/ik-ch/cntnts/i-547/web.do'},
    ],
  };
}
