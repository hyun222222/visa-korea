export const visaPublic = process.env.NEXT_PUBLIC_VISA_PUBLIC !== 'false';
export const hubOrigin = visaPublic ? 'https://kimnhyun.com' : 'https://kim-hyun-brand.kimhyun.chatgpt.site';
export const visaOrigin = process.env.NEXT_PUBLIC_VISA_ORIGIN || 'https://koreavisalaw.com';
export const languages = ['ko','en','zh','ja'] as const;
export type Language = typeof languages[number];
export function languageFromPath(path: string): Language {const p=path.split('/')[1];return languages.includes(p as Language)?p as Language:'ko';}
export function hubHref(path: string, lang: string='ko') {return `${hubOrigin}${lang==='ko'?'':'/en'}/${path}`;}
export function consultationHref(lang: string='ko') {return `${hubHref('consultation/',lang)}?field=immigration&source=koreavisalaw.com`;}
export const labels = {
 ko: {name:'김앤현',area:'비자·출입국',about:'변호사 소개',check:'체류자격 점검',medical:'의료 비자',invest:'한국 투자',blog:'법률정보',consult:'상담 안내',firm:'김앤현 종합사이트',cases:'해결사례',privacy:'개인정보 안내',address:'서울 서초구 법원로 16 정곡빌딩 동관 502호',notice:'문의만으로 수임계약이 체결되지 않습니다. 상담 범위와 비용을 먼저 안내합니다.'},
 en: {name:'KIM & HYUN',area:'IMMIGRATION',about:'Our lawyers',check:'Visa self-check',medical:'Medical visas',invest:'Investing in Korea',blog:'Legal insights',consult:'Consultation',firm:'Kim & Hyun main site',cases:'Case results',privacy:'Privacy',address:'502, East Wing, Jeonggok Building, 16 Beobwon-ro, Seocho-gu, Seoul',notice:'An inquiry does not establish representation. Scope and fees are explained before work begins.'},
 zh: {name:'KIM & HYUN',area:'签证与出入境',about:'律师介绍',check:'签证条件自查',medical:'医疗签证',invest:'投资韩国',blog:'法律信息',consult:'咨询指南',firm:'律所主站（英语）',cases:'案件成果（英语）',privacy:'隐私说明（英语）',address:'韩国首尔瑞草区法院路16号正谷大厦东馆502室',notice:'提出咨询不等于成立委托关系。服务范围与费用将在开始前说明。'},
 ja: {name:'KIM & HYUN',area:'ビザ・出入国',about:'弁護士紹介',check:'ビザ要件の確認',medical:'医療ビザ',invest:'韓国への投資',blog:'法律情報',consult:'相談案内',firm:'事務所総合サイト（英語）',cases:'解決事例（英語）',privacy:'個人情報の取扱い（英語）',address:'韓国ソウル市瑞草区法院路16 正谷ビル東館502号',notice:'お問い合わせだけでは委任契約は成立しません。業務範囲と費用を事前にご案内します。'}
};

