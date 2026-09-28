import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {entryCopy, type EntryLanguage} from '@/lib/entry-refusal';
import {visaOrigin, hubHref} from '@/lib/brand';
import {EntryPayment} from '@/components/entry-payment';
import {EntryUrgent, EntrySticky} from '@/components/entry-urgent';
import {AirportContact} from '@/components/airport-contact';
import {AirportDocuments} from '@/components/airport-documents';
import {AirportSelfCheck} from '@/components/airport-self-check';


function getLanguage(lang:string):EntryLanguage {if(lang!=='ko'&&lang!=='en') notFound();return lang;}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const lang=getLanguage((await params).lang),t=entryCopy[lang],url=`${visaOrigin}/${lang}/entry-refusal`;
  return {title:t.searchTitle,description:t.description,alternates:{canonical:url,languages:{ko:`${visaOrigin}/ko/entry-refusal`,en:`${visaOrigin}/en/entry-refusal`}},openGraph:{title:t.searchTitle,description:t.description,url,type:'website'}};
}
export default async function Page({params}:{params:Promise<{lang:string}>}) {
  const lang=getLanguage((await params).lang),t=entryCopy[lang],other=lang==='ko'?'en':'ko';
  const url=`${visaOrigin}/${lang}/entry-refusal`;
  const office={'@id':`${visaOrigin}/#office`};
  const schema={
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':'WebPage',
        '@id':`${url}#webpage`,
        url,
        name:t.searchTitle,
        description:t.description,
        inLanguage:lang,
        publisher:office,
        mainEntity:{'@id':`${url}#service`},
        citation:[
          'https://www.law.go.kr/법령/출입국관리법/제12조',
          'https://www.law.go.kr/법령/출입국관리법시행규칙/제19조'
        ]
      },
      {
        '@type':'Service',
        '@id':`${url}#service`,
        name:t.paymentTitle,
        description:t.paymentIntro,
        url:`${url}#consultation`,
        provider:office,
        mainEntityOfPage:{'@id':`${url}#webpage`},
        serviceType:lang==='ko'?'한국 공항 입국불허 긴급 검토·서면 작성·초기 대응':'Legal review, response drafting and initial support for entry refusal at a Korean airport',
        areaServed:{'@type':'Country',name:'South Korea'},
        offers:{
          '@type':'Offer',
          price:'3300',
          priceCurrency:'USD',
          url:`${url}/apply`,
          seller:office
        }
      }
    ]
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
    <section className="kh-hero"><div className="kh-inner"><span className="kh-eyebrow">KOREA VISA LAW / ENTRY REFUSAL</span><h1>{t.title}</h1><p>{t.intro}</p><div className="er-actions"><a className="kh-button" href="#self-check">{lang==='ko'?'현재 상황·서류 O/X 점검':'Check my situation & documents'}</a><a href={`/${lang}/entry-refusal/apply`}>{lang==='ko'?'온라인 신청·계약·결제':'Apply online · Agreement & payment'}</a><a href="#airport-help">{lang==='ko'?'연락 방법':'Contact options'}</a><a href="#consultation">{lang==='ko'?'업무 범위·비용':'Scope & fees'}</a></div><p><a href={`/${other}/entry-refusal`} hrefLang={other}>{t.other} ↗</a></p></div></section>
    <div className="kh-container er-content">
      <section className="kh-section" aria-labelledby="first-steps"><h2 id="first-steps">{t.firstStepsTitle}</h2><p>{t.firstSteps}</p></section>
      <AirportSelfCheck lang={lang}/>
      <section className="kh-section" id="consultation"><h2>{t.paymentTitle}</h2><EntryPayment lang={lang}/><AirportContact lang={lang} stage="agreement"/><p className="er-payment-note">{t.paymentLimit}</p><p className="kh-note">{t.noGuarantee}</p></section>
      <EntryUrgent lang={lang}/><aside className="kh-note"><h2>{t.urgent}</h2><p>{t.urgentText}</p></aside>
      <AirportDocuments lang={lang}/>
      {t.sections.map(([heading,paragraphs])=><section className="kh-section" key={heading}><h2>{heading}</h2>{paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
      <section className="kh-section"><h2>{t.lawyerTitle}</h2><article className="kh-profile"><img src="/lawyer-hyunjung-matched.webp" width="160" height="228" alt={lang==='ko'?'김현정 변호사':'Attorney Hyunjung Kim'} loading="lazy"/><div><p>{t.lawyerBio}</p><a href={hubHref('lawyers/hyunjung/',lang)}>{t.lawyerLink} ↗</a></div></article></section>
      <section className="kh-section er-sources"><h2>{t.sources}</h2><p>{t.date}</p><ul><li><a href="https://www.law.go.kr/법령/출입국관리법/제12조">{lang==='ko'?'출입국관리법 제12조':'Immigration Act, Article 12 (Korean)'}</a></li><li><a href="https://www.law.go.kr/법령/출입국관리법시행규칙/제19조">{lang==='ko'?'출입국관리법 시행규칙 제19조':'Enforcement Rule, Article 19 (Korean)'}</a></li><li>{lang==='ko'?'김현정, 국내 입국불허 제도의 현황과 불복절차, 연구 원고 및 제공 판결문.':'Hyunjung Kim, research manuscript on entry refusal in Korea and supplied court materials.'}</li><li><a href="https://www.paypal.com/kr/digital-wallet/system-enhancement-faq?locale.x=ko_KR">{lang==='ko'?'PayPal 한국 국내 결제 제한':'PayPal restrictions on Korean domestic payments'}</a></li></ul></section>
    </div><EntrySticky lang={lang}/>
  </>;
}
