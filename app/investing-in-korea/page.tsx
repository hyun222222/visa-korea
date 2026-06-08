import { Metadata } from "next";
import InvestingClientPage from "@/components/investing/InvestingClientPage";

export const metadata: Metadata = {
  title: "한국 투자 절차와 D-8 비자 가이드 | 김앤현 법률사무소",
  description: "외국인투자 신고부터 법인 등록, D-8 비자까지의 실무 흐름을 정리했습니다. 본 페이지는 일반적인 법률 정보이며 개별 법률자문이 아닙니다."
};

export default function RootInvestmentGuidePage() {
  return <InvestingClientPage lang="ko" />;
}
