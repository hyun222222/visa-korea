import {ContactActions} from '@/components/ContactActions';
import {PublishedDecisionGuides} from '@/components/blog/PublishedDecisionGuides';
import {VisaReviewLinks} from '@/components/visa-review-links';
import copy from '@/lib/home-copy.json';
import {D8FeaturedGuide} from '@/components/blog/D8Guide';
import {labels,hubHref,type Language} from '@/lib/brand';
import {reviewMarketUrl} from '@/lib/visa-review-locales';
const reviewLink = {
 ko:'해외 고객을 위한 한국 비자 서면검토', en:'Korean visa written review',
 zh:'韩国签证律师书面审查', ja:'韓国ビザの弁護士による書面審査',
};
const reviewLinkAction = {ko:'서비스와 가격 보기', en:'See services and pricing', zh:'查看服务及价格', ja:'サービスと料金を見る'};
export default function VisaHome({lang}:{lang:Language}){const t=copy[lang],m=labels[lang];return <>
 <section className="kh-hero"><div className="kh-inner"><span className="kh-eyebrow">KIM & HYUN / IMMIGRATION</span><h1>{t.title}</h1><p>{t.intro}</p><ContactActions lang={lang}/></div></section>
 <div className="kh-container">{(lang==='ko'||lang==='en')&&<section className="kh-section kh-note"><h2>{lang==='ko'?'공항에서 입국을 거절당했나요?':'Refused entry at a Korean airport?'}</h2><p>{lang==='ko'?'공항 대기 중인지, 이미 송환되었는지에 따라 검토할 대응이 달라집니다. 통지서와 방문 목적 자료를 준비하세요.':'Your options depend on whether you are still at the airport or already abroad. Prepare your refusal notice and evidence of your intended visit.'}</p><a className="kh-button" href={`/${lang}/entry-refusal`}>{lang==='ko'?'입국불허 대응·상담 안내':'Entry refusal: options and consultation'} ↗</a></section>}<section className="kh-section" id="about"><h2>{t.about}</h2><div className="kh-columns">{[['hyunjung',t.hyunjung,t.bio],['younghoon',t.younghoon,t.youngBio]].map(([id,name,bio])=><article className="kh-profile" key={id}><img src={`/lawyer-${id}-matched.webp`} alt={name} width="160" height="228" loading="lazy"/><div><h3>{name}</h3><p>{bio}</p><a href={hubHref(`lawyers/${id}/`,lang)}>{m.about} ↗{lang==='zh'?'（英语）':lang==='ja'?'（英語）':''}</a></div></article>)}</div></section>
 <D8FeaturedGuide lang={lang}/>
 <PublishedDecisionGuides lang={lang}/>
 <section className="kh-section"><h2>{reviewLink[lang]}</h2><a className="kh-button" href={reviewMarketUrl(lang==='ko'?'en':lang)}>{reviewLinkAction[lang]} ↗</a></section>
 <section className="kh-section"><h2>{t.stepsTitle}</h2><ol className="kh-steps">{t.steps.map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol><p className="kh-note">{t.fees}</p></section>
 <section className="kh-section kh-tools" id="calculators"><h2>{t.tools}</h2><p className="kh-note">{t.toolsNote} <a href="https://www.hikorea.go.kr/">{t.official} ↗</a></p><VisaReviewLinks lang={lang}/></section>
 <section className="kh-section kh-tools" id="requirements"><h2>{t.library}</h2><p>{t.libraryNote}</p><a className="underline" href="https://www.visa.go.kr/">Korea Visa Portal ↗</a></section>
 <section className="kh-section"><h2>{t.cta}</h2><ContactActions lang={lang}/></section></div>
 </>}
