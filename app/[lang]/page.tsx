import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
import {languages,visaOrigin,type Language} from '@/lib/brand';
const searchTitles:Record<Language,string>={
 ko:'한국 비자·출입국 변호사 | 코리아비자로 · 김앤현',
 en:'Korean Visa & Immigration Lawyers | Korea Visa Law',
 zh:'韩国签证与出入境律师 | Korea Visa Law',
 ja:'韓国ビザ・出入国の弁護士 | Korea Visa Law',
};
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!languages.includes(lang as Language))notFound();const t=copy[lang as Language],title=searchTitles[lang as Language];return {title,description:t.intro,alternates:{canonical:visaOrigin+'/'+lang,languages:Object.fromEntries(languages.map(l=>[l,visaOrigin+'/'+l]))},openGraph:{title,description:t.intro,url:visaOrigin+'/'+lang,type:'website'}};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!languages.includes(lang as Language))notFound();return <VisaHome lang={lang as Language}/>;}
export function generateStaticParams(){return languages.map(lang=>({lang}));}
