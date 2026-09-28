import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {entryCopy, type EntryLanguage} from '@/lib/entry-refusal';
import {visaOrigin, hubHref, consultationHref} from '@/lib/brand';
import {EntryPayment} from '@/components/entry-payment';
import {EntryUrgent, EntrySticky} from '@/components/entry-urgent';


function getLanguage(lang:string):EntryLanguage {if(lang!=='ko'&&lang!=='en') notFound();return lang;}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const lang=getLanguage((await params).lang),t=entryCopy[lang],url=`${visaOrigin}/${lang}/entry-refusal`;
  return {title:`${t.title} | Korea Visa Law`,description:t.description,alternates:{canonical:url,languages:{ko:`${visaOrigin}/ko/entry-refusal`,en:`${visaOrigin}/en/entry-refusal`}},openGraph:{title:t.title,description:t.description,url,type:'website'}};
}
export default async function Page({params}:{params:Promise<{lang:string}>}) {
  const lang=getLanguage((await params).lang),t=entryCopy[lang],other=lang==='ko'?'en':'ko';
  const schema={'@context':'https://schema.org','@type':'Service',name:t.title,description:t.description,url:`${visaOrigin}/${lang}/entry-refusal`,provider:{'@id':`${visaOrigin}/#office`},serviceType:'Legal consultation on refusal of entry to Korea',areaServed:{'@type':'Country',name:'South Korea'}};
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
    <section className="kh-hero"><div className="kh-inner"><span className="kh-eyebrow">KOREA VISA LAW / ENTRY REFUSAL</span><h1>{t.title}</h1><p>{t.intro}</p><div className="er-actions"><a className="kh-button" href="#airport-help">{lang==='ko'?'공항 긴급 문의':'Airport assistance'}</a><a href="#family-help">{lang==='ko'?'가족·초청인이 대신 문의':'Contact for family or guest'}</a><a href="#consultation">{lang==='ko'?'상담 범위·비용·결제':'Scope, fees & payment'}</a></div><p><a href={`/${other}/entry-refusal`} hrefLang={other}>{t.other} ↗</a></p></div></section>
    <div className="kh-container er-content">
      <EntryUrgent lang={lang}/><aside className="kh-note"><h2>{t.urgent}</h2><p>{t.urgentText}</p><a href="tel:+82234777600">{t.call}: +82-2-3477-7600</a></aside>
      {t.sections.map(([heading,paragraphs])=><section className="kh-section" key={heading}><h2>{heading}</h2>{paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
      <section className="kh-section"><h2>{t.lawyerTitle}</h2><article className="kh-profile"><img src="/lawyer-hyunjung-matched.webp" width="160" height="228" alt={lang==='ko'?'김현정 변호사':'Attorney Hyunjung Kim'} loading="lazy"/><div><p>{t.lawyerBio}</p><a href={hubHref('lawyers/hyunjung/',lang)}>{t.lawyerLink} ↗</a></div></article></section>
      <section className="kh-section" id="consultation"><h2>{t.paymentTitle}</h2><p>{t.paymentIntro}</p><EntryPayment lang={lang}/><a className="kh-button" href={consultationHref(lang)}>{t.contact} ↗</a><p className="er-payment-note">{t.paymentLimit}</p><p className="kh-note">{t.noGuarantee}</p></section>
      <section className="kh-section er-sources"><h2>{t.sources}</h2><p>{t.date}</p><ul><li><a href="https://www.law.go.kr/법령/출입국관리법/제12조">{lang==='ko'?'출입국관리법 제12조':'Immigration Act, Article 12 (Korean)'}</a></li><li><a href="https://www.law.go.kr/법령/출입국관리법시행규칙/제19조">{lang==='ko'?'출입국관리법 시행규칙 제19조':'Enforcement Rule, Article 19 (Korean)'}</a></li><li>{lang==='ko'?'김현정, 국내 입국불허 제도의 현황과 불복절차, 연구 원고 및 제공 판결문.':'Hyunjung Kim, research manuscript on entry refusal in Korea and supplied court materials.'}</li><li><a href="https://www.paypal.com/kr/digital-wallet/system-enhancement-faq?locale.x=ko_KR">{lang==='ko'?'PayPal 한국 국내 결제 제한':'PayPal restrictions on Korean domestic payments'}</a></li></ul></section>
    </div><EntrySticky lang={lang}/>
  </>;
}
