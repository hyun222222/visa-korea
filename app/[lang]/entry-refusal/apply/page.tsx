import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {AirportIntake} from '@/components/airport-intake';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
 const {lang}=await params;
 return {title:lang==='en'?'Airport Legal Assistance · USD 3,300 | Korea Visa Law':'공항 긴급 대응 신청 · USD 3,300 | Korea Visa Law',description:lang==='en'?'Prepare evidence for your airport entry refusal, review and sign the agreement, pay with PayPal, and email your case documents.':'공항 입국불허 사유별 자료를 준비하고 위임계약 서명·PayPal 결제 후 사건 서류를 이메일로 보내세요.',robots:{index:false,follow:false},referrer:'no-referrer'};
}
export default async function Page({params}:{params:Promise<{lang:string}>}){
 const {lang}=await params;if(lang!=='ko'&&lang!=='en')notFound();
 return <AirportIntake lang={lang}/>;
}
