import {VisaCalculators} from '@/components/calculators/VisaCalculators';
import {VisaRequirementsTable} from '@/components/calculators/VisaRequirementsTable';
import copy from '@/lib/home-copy.json';
import {labels,hubHref,consultationHref,type Language} from '@/lib/brand';
export default function VisaHome({lang}:{lang:Language}){const t=copy[lang],m=labels[lang];return <>
 <section className="kh-hero"><div className="kh-inner"><span className="kh-eyebrow">KIM & HYUN / IMMIGRATION</span><h1>{t.title}</h1><p>{t.intro}</p><a className="kh-button" href={consultationHref(lang)}>{m.consult} ↗</a></div></section>
 <div className="kh-container"><section className="kh-section" id="about"><h2>{t.about}</h2><div className="kh-columns">{[['hyunjung',t.hyunjung,t.bio],['younghoon',t.younghoon,t.youngBio]].map(([id,name,bio])=><article className="kh-profile" key={id}><img src={`/lawyer-${id}-matched.webp`} alt={name} width="160" height="228" loading="lazy"/><div><h3>{name}</h3><p>{bio}</p><a href={hubHref(`lawyers/${id}/`,lang)}>{m.about} ↗{lang==='zh'?'（英语）':lang==='ja'?'（英語）':''}</a></div></article>)}</div></section>
 <section className="kh-section"><h2>{t.stepsTitle}</h2><ol className="kh-steps">{t.steps.map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol><p className="kh-note">{t.fees}</p></section>
 <section className="kh-section kh-tools" id="calculators"><h2>{t.tools}</h2><p className="kh-note">{t.toolsNote} <a href="https://www.hikorea.go.kr/">{t.official} ↗</a></p><VisaCalculators/></section>
 <section className="kh-section kh-tools" id="requirements"><h2>{t.library}</h2><VisaRequirementsTable/></section>
 <section className="kh-section"><h2>{t.cta}</h2><a className="kh-button" href={consultationHref(lang)}>{m.consult} ↗</a></section></div>
 </>}
