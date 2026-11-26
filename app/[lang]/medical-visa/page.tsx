import {localizedAlternates, shareMetadata} from '@/lib/share-metadata';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {languages,type Language} from '@/lib/brand';
const medicalCopy = {
  ko:['한국 의료비자 신청·체류 연장·불허 대응','한국에서 치료받기 위해 비자를 신청하거나 치료가 길어져 체류를 연장할 때 필요한 자료를 확인하세요. 치료계획서, 비용 부담 자료, 불허 통지서를 어느 단계에서 살펴보는지 안내합니다.'],
  en:['Korea Medical Visa: Applications, Stay and Refusal Review','Distinguish consular visa applications, domestic stay decisions and refusal notices. Prepare treatment plans, funding records and the notice for legal review.'],
  zh:['韩国医疗签证与治疗目的居留','说明以治疗为目的的入境、居留准备和法律咨询程序。'],
  ja:['韓国の医療ビザと治療目的の滞在','治療目的の入国・滞在準備と法律相談の手続きをご案内します。']
};
export async function generateMetadata({params}: {params: Promise<{lang: string}>}): Promise<Metadata> {
  const {lang} = await params;
  if (!languages.includes(lang as Language)) notFound();
  const [heading, description] = medicalCopy[lang as Language];
  const title = heading + ' | Kim & Hyun';
  const url = `/${lang}/medical-visa`;
  return {
    title, description,
    alternates: {canonical: url, languages: localizedAlternates(code => `/${code}/medical-visa`)},
    ...shareMetadata({title, description, url}),
  };
}
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
