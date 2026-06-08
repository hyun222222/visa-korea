import { notFound } from "next/navigation";
import { Metadata } from "next";
import InvestingClientPage from "@/components/investing/InvestingClientPage";

const supportedLangs = ["ko", "en", "zh", "ja"] as const;
type Lang = typeof supportedLangs[number];

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

  const descriptions = {
    ko: "외국인투자 신고부터 법인 등록, D-8 비자까지의 실무 흐름을 정리했습니다. 본 페이지는 일반적인 법률 정보이며 개별 법률자문이 아닙니다.",
    en: "A practical overview of how foreign investment in Korea works — from notification to company registration and the D-8 visa.",
    zh: "外国人投资申报、法人设立登记到D-8签证的实务流程指南。本页面为一般法律信息，不构成法律咨询。",
    ja: "外国人投資申告から法人設立登記、D-8ビザまでの実務プロセスガイド。本ページは一般的な法律情報であり、個別の法律相談ではありません。"
  };

  return {
    title: titles[lang] || titles.en,
    description: descriptions[lang] || descriptions.en,
    alternates: {
      canonical: `/investing-in-korea`,
      languages: {
        ko: "/ko/investing-in-korea",
        en: "/en/investing-in-korea",
        zh: "/zh/investing-in-korea",
        ja: "/ja/investing-in-korea"
      }
    }
  };
}

export default async function LocalizedPage({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;

  if (!supportedLangs.includes(lang)) {
    notFound();
  }

  return <InvestingClientPage lang={lang} />;
}

export function generateStaticParams() {
  return [
    { lang: "ko" },
    { lang: "en" },
    { lang: "zh" },
    { lang: "ja" }
  ];
}
