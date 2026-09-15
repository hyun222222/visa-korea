'use client';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {languageFromPath,languages,labels,hubHref,consultationHref} from '@/lib/brand';
export function Header(){
 const lang=languageFromPath(usePathname()||'/'),t=labels[lang];const [open,setOpen]=useState(false);
 const nav=[[`/${lang}#about`,t.about],[`/${lang}#calculators`,t.check],[`/${lang}/medical-visa`,t.medical],[`/${lang}/investing-in-korea`,t.invest],[lang==='ko'?'/blog':`/${lang}/blog`,t.blog]];
 return <><div className="kh-family"><span>SEOUL · KIM & HYUN LAW OFFICE</span><a href={hubHref('',lang)}>{t.firm} ↗</a></div><header className="kh-header"><a className="kh-brand" href={`/${lang}`}><strong>{t.name}</strong><span>{t.area}</span></a><button className="kh-toggle" aria-expanded={open} aria-controls="visa-nav" onClick={()=>setOpen(!open)} aria-label={lang==='ko'?'메뉴 열기':'Menu'}>☰</button><nav id="visa-nav" className={open?'is-open':''}>{nav.map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav><details className="kh-languages"><summary>{lang.toUpperCase()}</summary><div>{languages.map(l=><a key={l} href={`/${l}`} lang={l}>{({ko:'한국어',en:'English',zh:'中文',ja:'日本語'})[l]}</a>)}</div></details><a className="kh-contact" href={consultationHref(lang)}>{t.consult} ↗</a></header></>;
}
