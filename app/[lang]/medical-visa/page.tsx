import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {languages,visaOrigin,type Language} from '@/lib/brand';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!languages.includes(lang as Language))notFound();const data={ko:['한국 의료비자 신청·체류·불허 대응','치료 목적 사증 신청과 국내 체류, 불허 통지의 종류를 구분하고 치료 계획·비용·통지서 등 검토 자료를 안내합니다.'],en:['Korea Medical Visa: Applications, Stay and Refusal Review','Distinguish consular visa applications, domestic stay decisions and refusal notices. Prepare treatment plans, funding records and the notice for legal review.'],zh:['韩国医疗签证与治疗目的居留','说明以治疗为目的的入境、居留准备和法律咨询程序。'],ja:['韓国の医療ビザと治療目的の滞在','治療目的の入国・滞在準備と法律相談の手続きをご案内します。']}[lang as Language];return {title:data[0]+' | Kim & Hyun',description:data[1],openGraph:{title:data[0]+' | Kim & Hyun',description:data[1],url:visaOrigin+'/'+lang+'/medical-visa',type:'website'},twitter:{card:'summary',title:data[0]+' | Kim & Hyun',description:data[1]},alternates:{canonical:visaOrigin+'/'+lang+'/medical-visa',languages:Object.fromEntries(languages.map(l=>[l,visaOrigin+'/'+l+'/medical-visa']))}};}
import MedicalVisaClient from "./MedicalVisaClient";

export default async function MedicalVisaPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    if(!languages.includes(resolvedParams.lang as Language))notFound();
    return <MedicalVisaClient lang={resolvedParams.lang} />;
}

export function generateStaticParams() {
    return [
        { lang: "ko" },
        { lang: "en" },
        { lang: "zh" },
        { lang: "ja" }
    ];
}
