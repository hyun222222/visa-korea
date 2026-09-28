import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {AirportIntake} from '@/components/airport-intake';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
 const {lang}=await params;
 return {title:lang==='en'?'Airport Legal Assistance · USD 3,300 | Korea Visa Law':'공항 긴급 대응 신청 · USD 3,300 | Korea Visa Law',robots:{index:false,follow:false},referrer:'no-referrer'};
}
export default async function Page({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(lang!=='ko'&&lang!=='en')notFound();
 return <AirportIntake lang={lang}/>;
}
