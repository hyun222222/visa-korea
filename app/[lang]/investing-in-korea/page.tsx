import {localizedAlternates, shareMetadata} from '@/lib/share-metadata';
import { notFound } from "next/navigation";
import { Metadata } from "next";
import InvestingClientPage from "@/components/investing/InvestingClientPage";
import {D8FeaturedGuide} from '@/components/blog/D8Guide';

const supportedLangs = ["ko", "en", "zh", "ja"] as const;
type Lang = typeof supportedLangs[number];

const introductions = {
  ko: "외국인투자 신고부터 법인 등록, D-8 비자 신청까지 단계별로 확인하세요. 신설법인과 기존 주식 취득에 필요한 서류를 나누어 정리했습니다.",
  en: "Follow the steps from foreign investment notification to company registration and a D-8 visa application. Check which documents to prepare for a new company or a purchase of existing shares.",
  zh: "从外国人投资申报、公司登记到申请D-8签证，逐步了解各环节。可分别查看新设公司和收购现有股份所需的文件。",
  ja: "外国人投資の届出から法人登記、D-8ビザ申請までの流れを確認できます。新会社の設立と既存株式の取得に必要な書類を分けて紹介します。",
};

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams.lang || "ko") as Lang;

  const titles = {
    ko: "한국 투자 절차와 D-8 비자 가이드 | 김앤현 법률사무소",
    en: "Investing in Korea: Process & D-8 Visa | Kim & Hyun Law Office",
    zh: "投资韩国：流程与D-8签证指南 | 金&贤 律师事务所",
    ja: "韓国投資：手続きとD-8ビザガイド | 金＆賢 法律事務所"
  };

  if (!supportedLangs.includes(lang)) notFound();
  const title = titles[lang];
  const description = introductions[lang];
  const url = `/${lang}/investing-in-korea`;
  return {
    title, description,
    alternates: {canonical: url, languages: localizedAlternates(code => `/${code}/investing-in-korea`)},
    ...shareMetadata({title, description, url}),
  };
}

export default async function LocalizedPage({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;

  if (!supportedLangs.includes(lang)) {
    notFound();
  }

  return <InvestingClientPage lang={lang} introduction={introductions[lang]} featuredGuide={<D8FeaturedGuide lang={lang}/>}/>;
}

export function generateStaticParams() {
  return [
    { lang: "ko" },
    { lang: "en" },
    { lang: "zh" },
    { lang: "ja" }
  ];
}
