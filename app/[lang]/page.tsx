import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
import {languages,visaOrigin,type Language} from '@/lib/brand';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!languages.includes(lang as Language))notFound();const t=copy[lang as Language],title=t.title.replace('\n',' ')+' | Kim & Hyun';return {title,description:t.intro,alternates:{canonical:visaOrigin+'/'+lang,languages:Object.fromEntries(languages.map(l=>[l,visaOrigin+'/'+l]))},openGraph:{title,description:t.intro,url:visaOrigin+'/'+lang,type:'website'}};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!languages.includes(lang as Language))notFound();return <VisaHome lang={lang as Language}/>;}
export function generateStaticParams(){return languages.map(lang=>({lang}));}
