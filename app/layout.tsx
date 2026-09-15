import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {visaOrigin,visaPublic} from '@/lib/brand';
import {Header} from '@/components/layout/header';
import {Footer} from '@/components/layout/footer';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(visaOrigin),title:'Korea Visa Law | Kim & Hyun Law Office',description:'김앤현 법률사무소의 비자·체류·출입국 상담 안내.',robots:{index:visaPublic,follow:visaPublic},verification:visaPublic?{other:{'naver-site-verification':'303d6b166faa046c9ce7b2509766ff305312eb65'}}:{}};
export default async function RootLayout({children}:{children:React.ReactNode}){
 const lang=(await headers()).get('x-kimhyun-locale')||'ko';
 const schema={'@context':'https://schema.org','@type':'LegalService','@id':visaOrigin+'/#office',name:'Kim & Hyun Law Office',url:visaOrigin,telephone:'+82-2-3477-7600',email:'info@kimnhyun.com',address:{'@type':'PostalAddress',streetAddress:'502, East Wing, Jeonggok Building, 16 Beobwon-ro',addressLocality:'Seocho-gu, Seoul',addressCountry:'KR'}};
 return <html lang={lang}><head><link rel="stylesheet" href="/fonts/pretendard/font.css"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\u003c')}}/></head><body><Header/><main>{children}</main><Footer/></body></html>;
}
