import Link from 'next/link';
import {hubHref, type Language} from '@/lib/brand';
import {d8Copy, d8Path} from '@/lib/d8-search';

export function D8FeaturedGuide({lang}: {lang: Language}) {
  const t = d8Copy[lang];
  return <section className="d8-feature" aria-label={t.label}>
    <p className="d8-label">{t.label}</p><h2>{t.title}</h2><p>{t.summary}</p>
    <Link href={d8Path(lang)} className="d8-read">{t.read} ↗</Link>
  </section>;
}

export function D8ConsultationGuide({lang}: {lang: Language}) {
  const t = d8Copy[lang];
  return <section className="d8-review" id="d8-lawyer-review" aria-labelledby="d8-review-title">
    <p className="d8-label">{t.updated}</p><h2 id="d8-review-title">{t.heading}</h2>
    <p>{t.intro}</p><ul>{t.documents.map(item => <li key={item}>{item}</li>)}</ul>
    <p>{t.process}</p><p>{t.fees}</p>
    <div className="d8-actions"><a href="tel:+821055346843" className="kh-button">{t.call}</a><a href="https://open.kakao.com/o/saviVYPi" target="_blank" rel="noopener noreferrer" className="kh-button">{t.kakao}</a></div>
    <p><a href={hubHref('lawyers/hyunjung/',lang)}>{t.lawyer}</a> · <Link href={`/${lang}/investing-in-korea`}>{t.guide}</Link></p>
    <p className="d8-sources">{t.sources}: <a href="https://www.investkorea.org/ik-en/cntnts/i-358/web.do" target="_blank" rel="noopener noreferrer">{t.source}</a> · <a href="https://www.hikorea.go.kr/" target="_blank" rel="noopener noreferrer">Hi Korea</a></p>
  </section>;
}
