import type { BlogPost, BlogBlock } from './blog-posts';
import type { Language } from './brand';

export const d8Updated = '2026-10-26';
export const d8BaseSlug = 'd8-visa-rejection-reasons';
export const d8Slug = (lang: Language) => d8BaseSlug + (lang === 'ko' ? '' : `-${lang}`);
export const d8Path = (lang: Language) => `${lang === 'ko' ? '' : `/${lang}`}/blog/${d8Slug(lang)}`;
export const isD8Review = (slug: string) => [d8BaseSlug, ...['en','zh','ja'].map(l => `${d8BaseSlug}-${l}`)].includes(slug);

// Narrow errata for the published article. Exact matches protect subsequent CMS edits.
// The original DB is preserved; admin reads the same corrected copy as the website.
// Source: https://www.investkorea.org/ik-en/cntnts/i-358/web.do (checked 2026-10-26).
const errata: Record<string, string> = {
  '**외국인이 직접 설립한 법인에 대한 투자**의 진정성 의심.': '**투자 구조와 실제 사업 내용의 불일치** — 외국인이 직접 법인을 설립했다는 사실 자체는 거절 사유가 아닙니다. 투자 방식과 사업 운영 자료가 신청하는 D-8 유형에 맞는지 확인해야 합니다.',
  'Investment in a Corporation Established Directly by a Foreigner.': 'Mismatch between the investment structure and the application: establishing a corporation as a foreign investor is not, by itself, a reason for refusal. Check the applicable D-8 category and supporting business records.',
  '对外国人直接设立的法人进行投资的真实性存疑。': '投资结构与申请内容不一致：外国投资者直接设立法人本身并不是拒签理由，应核对所申请的D-8类别及实际经营资料。',
  '外国人が直接設立した法人に対する投資の真実性疑義。': '投資形態と申請内容の不一致：外国人が自ら法人を設立したこと自体は拒否理由ではありません。申請するD-8の区分と事業資料を確認する必要があります。',
};

export function correctD8Post(post: BlogPost): BlogPost {
  if (!isD8Review(post.slug)) return post;
  const text = (value: string) => errata[value] ?? value;
  const body: BlogBlock[] = post.body.map(block => block.type === 'list'
    ? {...block, items: block.items.map(text)} : {...block, text: text(block.text)});
  return {...post, body};
}

export const d8Copy = {
  ko: {
    label: '주요 안내 · D-8 투자비자', title: '법인 등록까지 했는데 D-8 비자가 거절됐나요?',
    summary: '거절 통지서의 사유와 투자금 흐름, 사업장 자료를 함께 확인하세요. 재신청 전에 무엇을 보완할지 살펴봅니다.',
    read: 'D-8 거절 사유와 준비자료 보기', heading: 'D-8 비자 거절, 변호사 상담 전에 준비할 것',
    intro: '통지서에 적힌 문제와 이미 제출한 자료를 먼저 대조합니다. 법인을 직접 설립했다는 이유만으로 거절된다고 단정할 수 없습니다.',
    documents: ['거절·보완 통지서와 받은 날짜', '외국인투자 신고·등록 자료와 송금·입출금 내역', '법인·사업자등록 자료와 임대차계약서', '실제 사업 운영 자료와 기존 제출서류 목록'],
    process: '상담에서는 통지 내용과 자료의 불일치를 확인하고, 보완·재신청 또는 불복 검토가 필요한지 설명합니다. 처분 종류와 받은 날짜에 따라 기한이 달라질 수 있으므로 통지서를 기준으로 확인합니다.',
    fees: '자료검토·서면 작성·대리의 범위와 비용은 수임 전에 안내합니다. 승인이나 소송 결과를 보장하지 않습니다.',
    call: '전화로 상담하기', kakao: '카카오톡 상담', lawyer: '김현정 변호사 소개', guide: '투자 절차·준비서류 안내',
    sources: '공식 안내', source: 'Invest KOREA 기업투자(D-8) 안내 (영문)', updated: '투자 구조 설명·상담 준비 안내 보강: 2026.10.26',
  },
  en: {
    label: 'FEATURED GUIDE · D-8 INVESTOR VISA', title: 'Company registered, but your D-8 visa was refused?',
    summary: 'Compare the refusal reasons with your investment trail and business records. Review what needs to change before another application.',
    read: 'D-8 refusal reasons and documents to prepare', heading: 'D-8 visa lawyer: prepare for a refusal review',
    intro: 'Start with the written refusal and the documents already submitted. Incorporating a company as a foreign investor is not, by itself, a reason for refusal.',
    documents: ['Refusal or additional-document notice, and the date received', 'Foreign-investment records and the remittance/account trail', 'Company and business registration records and office lease', 'Evidence of business operations and your previous submission list'],
    process: 'We compare the stated reasons with your records, then explain whether document supplementation, a fresh application or a challenge needs consideration. Available procedures and time limits depend on the decision and dates; have the notice reviewed promptly.',
    fees: 'The scope and fees for document review, drafting and representation are explained before engagement. Visa approval and litigation outcomes are not guaranteed.',
    call: 'Call a lawyer', kakao: 'Chat on KakaoTalk', lawyer: 'Meet attorney Kim Hyun-jung', guide: 'Investment process and document checklist',
    sources: 'Official guidance', source: 'Invest KOREA: Corporate Investor Visa (D-8)', updated: 'Investment-structure clarification and consultation guide updated: 26 October 2026',
  },
  zh: {
    label: '重点指南 · D-8投资签证', title: '公司已登记，D-8签证却被拒签？',
    summary: '将拒签理由与投资款流向、经营资料逐项核对，再考虑如何补充申请材料。',
    read: '查看D-8拒签原因及准备资料', heading: '咨询D-8签证律师前需准备什么？',
    intro: '先核对书面拒签理由与已提交的材料。外国投资者自行设立法人本身并不构成拒签理由。',
    documents: ['拒签或补交材料通知及收件日期', '外国投资登记资料及汇款、银行流水', '法人、营业登记资料及办公场所租赁合同', '实际经营资料及此前提交的材料清单'],
    process: '律师核对通知与材料中的差异，再说明是否需要补充材料、重新申请或考虑救济程序。程序与期限取决于具体决定和日期，请及时核对通知。',
    fees: '材料审查、文书起草及代理的范围与费用会在委托前说明，不保证签证或诉讼结果。',
    call: '电话咨询', kakao: 'KakaoTalk咨询', lawyer: '金贤正律师介绍（英语）', guide: '投资程序及准备资料',
    sources: '官方指南', source: 'Invest KOREA：D-8企业投资签证（英语）', updated: '投资结构说明与咨询指南更新：2026.10.26',
  },
  ja: {
    label: '注目ガイド · D-8投資ビザ', title: '法人登録後にD-8ビザが不許可になりましたか？',
    summary: '不許可理由と投資資金の流れ、事業資料を照合し、再申請前に補足すべき点を確認します。',
    read: 'D-8不許可理由と準備資料を見る', heading: 'D-8ビザの弁護士相談に向けた準備',
    intro: '不許可通知と提出済みの資料を照合することから始めます。外国人が法人を直接設立したこと自体は不許可理由ではありません。',
    documents: ['不許可・補完通知と受領日', '外国人投資関連書類と送金・入出金記録', '法人・事業者登録資料と賃貸借契約書', '事業運営を示す資料と提出済み書類の一覧'],
    process: '通知内容と資料の相違を確認し、資料の補完、再申請または不服申立ての検討が必要か説明します。手続きや期限は処分の種類と日付によって異なるため、通知書を早めに確認してください。',
    fees: '資料確認、書面作成、代理の範囲と費用は受任前に案内します。ビザや訴訟の結果は保証しません。',
    call: '電話で相談', kakao: 'KakaoTalkで相談', lawyer: '金賢正弁護士の紹介（英語）', guide: '投資手続きと必要資料',
    sources: '公式案内', source: 'Invest KOREA：D-8企業投資ビザ（英語）', updated: '投資形態の説明・相談案内更新：2026.10.26',
  },
} as const;
