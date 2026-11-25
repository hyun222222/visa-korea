import {localizedAlternates, shareMetadata} from '@/lib/share-metadata';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import VisaHome from '@/components/visa-home';
import copy from '@/lib/home-copy.json';
import {languages,type Language} from '@/lib/brand';
const searchTitles:Record<Language,string>={
 ko:'한국 비자·출입국 변호사 | 코리아비자로 · 김앤현',
 en:'Korean Immigration Lawyer in Seoul | Kim & Hyun',
 zh:'韩国签证与出入境律师 | Korea Visa Law',
 ja:'韓国ビザ・出入国の弁護士 | Korea Visa Law',
};
export async function generateMetadata({params}: {params: Promise<{lang: string}>}): Promise<Metadata> {
  const {lang} = await params;
  if (!languages.includes(lang as Language)) notFound();
  const title = searchTitles[lang as Language];
  const description = copy[lang as Language].intro;
  const url = `/${lang}`;
  return {
    title, description,
    alternates: {canonical: url, languages: localizedAlternates(code => `/${code}`)},
    ...shareMetadata({title, description, url}),
  };
}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!languages.includes(lang as Language))notFound();return <VisaHome lang={lang as Language}/>;}
export function generateStaticParams(){return languages.map(lang=>({lang}));}
