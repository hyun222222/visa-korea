"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Coins, 
  Scale, 
  FileText, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle,
  FileCheck,
  CheckSquare,
  Square
} from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TRANSLATIONS = {
  ko: {
    title: "한국 투자 절차와 D-8 비자 가이드",
    subtitle: "Investing in Korea: Process & D-8 Visa",
    intro: "외국인투자 신고부터 법인 등록, D-8 비자까지의 실무 흐름을 정리했습니다. 본 페이지는 일반적인 법률 정보이며 개별 법률자문이 아닙니다.",
    
    // Section 1
    sec1Title: "투자 절차 한눈에",
    sec1Sub: "외국인투자와 D-8 비자는 맞물려 진행되는 별개의 두 트랙입니다.",
    stepBadge: "단계",
    
    // Section 2
    sec2Title: "준비 서류 체크리스트",
    sec2Sub: "투자 구조에 따라 필요한 서류가 달라집니다.",
    tabNew: "신설법인 설립",
    tabExisting: "기존법인 구주매수 (M&A)",
    colStage: "단계",
    colDocs: "필요 서류",
    
    // Section 3
    sec3Title: "간단 자가진단 (판정 아님)",
    sec3Sub: "상담 전 상황을 정리하기 위한 체크리스트이며, 자격 판정이 아닙니다.",
    checkInstruction: "해당하는 항목에 모두 체크해 보세요.",
    checkNoteTitle: "판례 경향 알림 (D-8 비자 중요 포인트)",
    checkNoteDesc: "최근 판례 경향(서울고법 2024누52900 등)에 따르면, 직접 설립한 1인 회사 등은 D-8 비자 해당성이 부인되거나 심사가 매우 엄격할 수 있어 세밀한 사전 검토가 필요합니다.",
    
    // Section 4
    sec4Title: "한국 변호사에게 상담하세요",
    sec4Desc: "상황을 간략히 보내주시면 김현정 변호사가 검토 후, 유료 상담이 필요한 경우 비용을 개별 안내드립니다. 상담은 한국 출입국·투자법에 한정되며 결과를 보장하지 않습니다.",
    btnRequest: "상담 신청",
    btnWhatsApp: "WhatsApp 상담",
    
    // Disclaimer
    disclaimerTitle: "법적 면책공고",
    disclaimerDesc: "본 페이지는 한국 외국인투자·출입국 절차에 관한 일반적인 법률 정보이며, 개별 법률자문이나 변호사·의뢰인 관계를 형성하지 않습니다. 요건과 행정 기준은 변경될 수 있으며, 투자금 기준 등 수치는 시행 당시의 법령 및 법무부·산업통상부 지침에 따릅니다. 변호사·의뢰인 관계는 별도의 위임계약 체결 시에만 성립합니다."
  },
  en: {
    title: "Investing in Korea: Process & D-8 Visa",
    subtitle: "Korea Investment Guide",
    intro: "A practical overview of how foreign investment in Korea works — from notification to company registration and the D-8 visa. This page is general legal information, not legal advice.",
    
    // Section 1
    sec1Title: "The Process at a Glance",
    sec1Sub: "Foreign investment and the D-8 visa run on two tracks that must connect.",
    stepBadge: "Step",
    
    // Section 2
    sec2Title: "Documents to Prepare",
    sec2Sub: "Required documents differ depending on your investment structure.",
    tabNew: "New Company Setup",
    tabExisting: "Existing Shares (M&A)",
    colStage: "Stage",
    colDocs: "Required Documents",
    
    // Section 3
    sec3Title: "Quick Self-Check (Not a Verdict)",
    sec3Sub: "A checklist to help you organize your situation before a consultation. It is not an eligibility decision.",
    checkInstruction: "Tick the items that apply to you.",
    checkNoteTitle: "Precedent Warning (Critical D-8 Point)",
    checkNoteDesc: "According to recent Korean court precedents (Seoul High Court 2024Nu52900, etc.), D-8 visa applications for directly founded sole-proprietor businesses may face much stricter scrutiny or rejection, making early attorney review vital.",
    
    // Section 4
    sec4Title: "Talk to a Licensed Korean Attorney",
    sec4Desc: "Send a brief message describing your situation. Attorney Kim Hyun-jung will review it and, where a paid consultation is appropriate, advise you of the fee individually. Consultations are limited to Korean immigration and investment law and do not guarantee any outcome.",
    btnRequest: "Request a Consultation",
    btnWhatsApp: "WhatsApp Chat",
    
    // Disclaimer
    disclaimerTitle: "Legal Disclaimer",
    disclaimerDesc: "This page provides general legal information about Korean foreign-investment and immigration procedures and does not constitute legal advice or create an attorney-client relationship. Requirements and government criteria may change; figures such as investment thresholds follow the applicable statutes and Ministry of Justice/MOTIE guidelines in force at the time. An attorney-client relationship arises only upon a separate engagement agreement."
  },
  zh: {
    title: "投资韩国：流程与D-8签证指南",
    subtitle: "韩国投资指南",
    intro: "外国人投资申报、法人设立登记到D-8签证的实务流程指南。本页面为一般法律信息，不构成法律咨询。",
    
    // Section 1
    sec1Title: "投资流程一览",
    sec1Sub: "外国人投资与D-8签证是相辅相成的两个独立流程。",
    stepBadge: "步骤",
    
    // Section 2
    sec2Title: "准备文件清单",
    sec2Sub: "所需文件因投资结构而异。",
    tabNew: "新设法人设立",
    tabExisting: "收购现有股份 (M&A)",
    colStage: "阶段",
    colDocs: "所需文件",
    
    // Section 3
    sec3Title: "简易自测（非资格判定）",
    sec3Sub: "咨询前整理自身情况的清单，不作为最终资格判定。",
    checkInstruction: "请勾选适用于您的项目。",
    checkNoteTitle: "判例提示（D-8签证关键点）",
    checkNoteDesc: "根据韩国法院最新判例（首尔高等法院2024Nu52900等），对于直接设立的个人企业，D-8签证的符合性可能会被否决或受到极其严格的审查，因此强烈建议提前进行律师评估。",
    
    // Section 4
    sec4Title: "咨询韩国执业律师",
    sec4Desc: "请简要发送您的具体情况。金贤正律师在评估后，如需有偿咨询，将单独向您通知费用。咨询仅限于韩国出入境与投资法，且不保证任何结果。",
    btnRequest: "申请咨询",
    btnWhatsApp: "WhatsApp 咨询",
    
    // Disclaimer
    disclaimerTitle: "法律免责声明",
    disclaimerDesc: "本页面提供关于韩国外国人投资与出入境程序的常规法律信息，不构成法律意见，亦不建立律师-客户关系。相关要求与行政标准可能会发生变化；投资门槛等数据以施行当时的法律及法务部/产业通商资源部指南为准。律师-客户关系仅在签署单独的委托协议时成立。"
  },
  ja: {
    title: "韓国投資：手続きとD-8ビザガイド",
    subtitle: "韓国投資ガイド",
    intro: "外国人投資申告から法人設立登記、D-8ビザまでの実務プロセスガイド。本ページは一般的な法律情報であり、個別の法律相談ではありません。",
    
    // Section 1
    sec1Title: "投資プロセス一覧",
    sec1Sub: "外国人投資とD-8ビザは相互に関連しながら進められる、別々の2つのプロセスです。",
    stepBadge: "段階",
    
    // Section 2
    sec2Title: "準備書類チェックリスト",
    sec2Sub: "投資スキームによって必要書類が異なります。",
    tabNew: "新設法人設立",
    tabExisting: "既存株式取得 (M&A)",
    colStage: "段階",
    colDocs: "必要書類",
    
    // Section 3
    sec3Title: "簡単セルフチェック（資格判定ではありません）",
    sec3Sub: "相談前にご自身の状況を整理するためのチェックリストであり、資格判定ではありません。",
    checkInstruction: "該当する項目すべてにチェックを入れてください。",
    checkNoteTitle: "判例傾向の注意点（D-8ビザの重要ポイント）",
    checkNoteDesc: "最近の判例傾向（ソウル高法2024ヌ52900等）によると、自身で直接設立した1人会社などはD-8ビザの該当性が否認されたり、審査が非常に厳しくなる可能性があるため、事前の綿密な法的検討が必要です。",
    
    // Section 4
    sec4Title: "韓国の資格を持つ弁護士に相談する",
    sec4Desc: "状況を簡単にお送りいただければ、金賢正弁護士が検討の上、有料相談が必要な場合は費用を個別にご案内いたします。相談は韓国の出入国・投資法に限定され、結果を保証するものではありません。",
    btnRequest: "相談を申し込む",
    btnWhatsApp: "WhatsApp 相談",
    
    // Disclaimer
    disclaimerTitle: "免責事項",
    disclaimerDesc: "本ページは、韓国の外国人投資・出入国手続きに関する一般的な法律情報であり、個別の法律相談や弁護士・依頼人関係を形成するものではありません。要件や行政基準は変更されることがあり、投資基準額などの数値は施行当時の法令および法務部・産業通商資源部の指針に従います。弁護士・依頼人関係は、別途の委任契約締結時にのみ成立します。"
  }
};

const PROCESS_STEPS = [
  {
    num: 1,
    ko: { title: "외국인투자 해당성 확인", desc: "통상 1억 원 이상 + 의결권 주식 10% 이상 보유 요건을 충족해야 합니다.", law: "외국인투자촉진법 시행령 제2조" },
    en: { title: "Confirm Qualifications", desc: "Must meet the criteria of investing KRW 100M+ and holding 10%+ voting shares.", law: "Foreign Investment Promotion Act Decree Art. 2" }
  },
  {
    num: 2,
    ko: { title: "외국인투자 신고", desc: "원칙적으로 해외 투자 자금을 송금하기 전에 KOTRA 또는 외국환은행에 사전 신고해야 합니다.", law: "외국인투자촉진법 제5조" },
    en: { title: "File Investment Notification", desc: "In principle, notify KOTRA or a foreign exchange bank before remitting investment funds.", law: "Foreign Investment Promotion Act Art. 5" }
  },
  {
    num: 3,
    ko: { title: "투자자금 반입 및 납입", desc: "반드시 지정된 외국환은행을 거쳐 본인 명의로 송금해야 하며, 추적 가능한 자금 출처 증빙이 필수적입니다.", law: "외국환거래법 제18조" },
    en: { title: "Remit & Deposit Capital", desc: "Funds must be remitted under the investor's own name via a foreign exchange bank with clear traceability.", law: "Foreign Exchange Transactions Act Art. 18" }
  },
  {
    num: 4,
    ko: { title: "법인 설립 또는 기존주식 취득", desc: "신설 법인은 절차 완료 후 2주 이내에 설립 등기를 마쳐야 합니다.", law: "상법 제317조" },
    en: { title: "Incorporate or Acquire Shares", desc: "For new companies, file corporate registration within 2 weeks of completing setup.", law: "Commercial Act Art. 317" }
  },
  {
    num: 5,
    ko: { title: "외국인투자기업 등록", desc: "자금 납입 및 법인 설립 등 투자가 모두 완료된 날부터 60일 이내에 등록해야 합니다.", law: "외국인투자촉진법 제21조 · 시행령 제27조" },
    en: { title: "Register the Foreign-Invested Company", desc: "Register within 60 days of completing the entire investment transaction.", law: "Foreign Investment Promotion Act Art. 21" }
  },
  {
    num: 6,
    ko: { title: "D-8 체류자격 신청 (선택)", desc: "외국인투자기업 등록 완료 후 비자를 별도 신청합니다. 등록만으로 비자 발급이 보장되지 않으며 엄격한 별도 심사가 진행됩니다.", law: "출입국관리법 제24조" },
    en: { title: "Apply for D-8 Visa", desc: "Company registration alone does not guarantee a visa. Government authorities will conduct a strict, separate assessment.", law: "Immigration Control Act Art. 24" }
  }
];

const DOCS_NEW = [
  {
    stage: { ko: "투자 신고 (Notification)", en: "Notification" },
    docs: {
      ko: "외국인투자 신고서, 여권 사본, 대리인 신청 시 위임장",
      en: "Foreign investment notification form, Passport copy, Power of Attorney (if filed by agent)"
    }
  },
  {
    stage: { ko: "자금 반입 (Funds)", en: "Funds" },
    docs: {
      ko: "송금인 및 송금 취지가 확인되는 외화매입증명서 또는 외화예치증명서",
      en: "FX purchase / deposit certificate clearly showing the remitter and purpose of transfer"
    }
  },
  {
    stage: { ko: "법인 설립 (Incorporation)", en: "Incorporation" },
    docs: {
      ko: "정관, 주식인수증, 주금납입 보관증명서, 임원취임승낙서, 창립총회의사록",
      en: "Articles of incorporation, share subscription proof, capital deposit certificate, directors' acceptance letters, inaugural meeting minutes"
    }
  },
  {
    stage: { ko: "기업 등록 (Registration)", en: "Registration" },
    docs: {
      ko: "외국인투자기업 등록신청서, 법인 등기사항증명서, 사업자등록증 사본, 주주명부 원본",
      en: "Foreign-invested company registration form, Corporate registry extract, Business registration certificate, Shareholder register"
    }
  }
];

const DOCS_EXISTING = [
  {
    stage: { ko: "투자 신고 (Notification)", en: "Notification" },
    docs: {
      ko: "외국인투자 신고서 (기존주식 취득용), 주식양수도 합의서 (사전 신고가 원칙이나 일부 사후신고 가능)",
      en: "Foreign investment notification form (for share acquisition), Share transfer agreement (prior notification preferred, post-acquisition notification possible under conditions)"
    }
  },
  {
    stage: { ko: "구주 매수 (Acquisition)", en: "Acquisition" },
    docs: {
      ko: "주식매매계약서, 대금지급 송금증빙, 주식 양도소득세 신고 증빙, 주주명부 정리 서류",
      en: "Share purchase agreement, Proof of payment transfer, Share transfer tax filing proof, Updated shareholder register"
    }
  },
  {
    stage: { ko: "자금 송금 (Remittance)", en: "Remittance" },
    docs: {
      ko: "송금인 및 거래 내역이 확인되는 외화매입증명서 또는 은행 송금확인증",
      en: "FX purchase / deposit certificate showing the remitter and clear transaction details"
    }
  },
  {
    stage: { ko: "기업 등록 (Registration)", en: "Registration" },
    docs: {
      ko: "외국인투자기업 등록신청서, 법인 등기사항증명서, 사업자등록증 사본, 주주명부 원본",
      en: "Foreign-invested company registration form, Corporate registry extract, Business registration certificate, Shareholder register"
    }
  }
];

const CHECKLIST_ITEMS = [
  {
    id: 0,
    ko: "투자 예정 금액이 1억 원 이상이다.",
    en: "My intended investment is KRW 100 million or more."
  },
  {
    id: 1,
    ko: "의결권 있는 주식의 10% 이상을 보유할 예정이다.",
    en: "I will hold 10% or more of the voting shares."
  },
  {
    id: 2,
    ko: "내가 직접 설립하는 회사가 아니라, 기존 한국 법인에 투자한다. (판례 검토용)",
    en: "I am investing in an existing Korean company (not one I am founding myself)."
  },
  {
    id: 3,
    ko: "투자 자금이 본인 명의이며 출처 추적이 가능하다.",
    en: "The investment funds are in my own name and traceable."
  },
  {
    id: 4,
    ko: "독립된 사업장을 확보할 예정이다.",
    en: "I will secure an independent place of business."
  }
];

type Lang = "ko" | "en" | "zh" | "ja";

export default function InvestmentGuidePage() {
  const params = useParams();
  const langParam = params?.lang as string;
  const currentLang: Lang = (["ko", "en", "zh", "ja"].includes(langParam) ? langParam : "ko") as Lang;
  const t = TRANSLATIONS[currentLang];
  
  const [docTab, setDocTab] = useState<"new" | "existing">("new");
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [resultVisible, setResultVisible] = useState(false);

  const checkedCount = checkedItems.filter(Boolean).length;

  const toggleCheck = (index: number) => {
    const next = [...checkedItems];
    next[index] = !next[index];
    setCheckedItems(next);
  };

  useEffect(() => {
    // Show results if any checkbox changes
    if (checkedItems.some(Boolean)) {
      setResultVisible(true);
    } else {
      setResultVisible(false);
    }
  }, [checkedItems]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/10 selection:text-primary pb-20">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-2">
              <Coins className="h-10 w-10 text-indigo-400" />
            </div>
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
              {t.subtitle}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              {t.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
              {t.intro}
            </p>
          </FadeIn>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Section 1: Process at a Glance */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{t.sec1Title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
              {t.sec1Sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step) => {
              // Localized display
              const stepTitle = currentLang === "ko" ? step.ko.title : step.en.title;
              const stepDesc = currentLang === "ko" ? step.ko.desc : step.en.desc;
              const stepLaw = currentLang === "ko" ? step.ko.law : step.en.law;
              
              // Secondary language text for bilingual experience
              const secondaryTitle = currentLang === "ko" ? step.en.title : step.ko.title;
              const secondaryDesc = currentLang === "ko" ? step.en.desc : step.ko.desc;

              return (
                <FadeIn key={step.num} delay={step.num * 0.05} className="flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                      {t.stepBadge} {step.num}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-mono">
                      {stepLaw}
                    </span>
                  </div>
                  
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {stepTitle}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium italic">
                      {secondaryTitle}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pt-2">
                      {stepDesc}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {secondaryDesc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* Section 2: Documents */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{t.sec2Title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">
              {t.sec2Sub}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
            {/* Tab switchers */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
              <button 
                onClick={() => setDocTab("new")}
                className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all duration-200 ${docTab === "new" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                {t.tabNew}
              </button>
              <button 
                onClick={() => setDocTab("existing")}
                className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all duration-200 ${docTab === "existing" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                {t.tabExisting}
              </button>
            </div>

            {/* Document table content */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <th className="pb-3 w-1/3 font-semibold">{t.colStage}</th>
                    <th className="pb-3 w-2/3 font-semibold">{t.colDocs}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(docTab === "new" ? DOCS_NEW : DOCS_EXISTING).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 pr-4 align-top">
                        <div className="font-bold text-slate-800 text-sm">{currentLang === "ko" ? row.stage.ko : row.stage.en}</div>
                        <div className="text-[11px] text-slate-400 font-light mt-0.5">{currentLang === "ko" ? row.stage.en : row.stage.ko}</div>
                      </td>
                      <td className="py-4 align-top">
                        <div className="text-slate-700 text-sm leading-relaxed">{currentLang === "ko" ? row.docs.ko : row.docs.en}</div>
                        <div className="text-[11px] text-slate-400 leading-relaxed font-light mt-1">{currentLang === "ko" ? row.docs.en : row.docs.ko}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Quick Self-Check */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{t.sec3Title}</h2>
            <p className="text-slate-500 text-sm">
              {t.sec3Sub}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-3">
              {t.checkInstruction}
            </p>
            
            <div className="space-y-4">
              {CHECKLIST_ITEMS.map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(idx)}
                  className={`w-full flex items-start text-left gap-4 p-4 rounded-xl border transition-all duration-200 ${checkedItems[idx] ? "bg-indigo-50/40 border-indigo-200 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-slate-50/30"}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {checkedItems[idx] ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-sm font-semibold transition-colors ${checkedItems[idx] ? "text-indigo-900" : "text-slate-800"}`}>
                      {currentLang === "ko" ? item.ko : item.en}
                    </p>
                    <p className="text-[11px] text-slate-400 font-light">
                      {currentLang === "ko" ? item.en : item.ko}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Special precedent notice regarding Item 3 */}
            <div className="flex gap-3 bg-amber-50/60 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed font-light">
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">{t.checkNoteTitle}</span>
                {t.checkNoteDesc}
              </div>
            </div>

            {/* Verification result box (displays count only, complying with ad regulations) */}
            {resultVisible && (
              <FadeIn className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileCheck className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">자가진단 결과 / Self-Check Results</span>
                </div>
                
                {currentLang === "ko" ? (
                  <p className="text-sm sm:text-base leading-relaxed">
                    5개 중 <strong className="text-indigo-400 text-lg font-bold">{checkedCount}</strong>개 항목에 해당하십니다. 이 요소들은 D-8 투자 사안에서 자주 문제되지만 합격·불합격을 가르는 기준은 아니며, 실제 판단은 행정청이 개별적으로 합니다. 정확한 검토를 위해 변호사 상담을 권합니다.
                  </p>
                ) : (
                  <p className="text-sm sm:text-base leading-relaxed">
                    You've noted <strong className="text-indigo-400 text-lg font-bold">{checkedCount}</strong> of 5 points. These factors commonly matter for a D-8 investment case, but they are not a pass/fail test — each situation is assessed individually by the authorities. The best next step is to have an attorney review your specific facts.
                  </p>
                )}
              </FadeIn>
            )}
          </div>
        </section>

        {/* Section 4: CTA (Price-free) */}
        <section className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {t.sec4Title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {t.sec4Desc}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                href={`/${currentLang}#contact`}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150"
              >
                {t.btnRequest}
              </Link>
              <a 
                href="https://wa.me/821055346843"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 duration-150 flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                {t.btnWhatsApp}
              </a>
            </div>
          </div>
        </section>

        {/* Bottom Disclaimer */}
        <footer className="border-t border-slate-200 pt-8 max-w-4xl mx-auto">
          <div className="flex gap-3 text-slate-400">
            <Scale className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase text-slate-500">{t.disclaimerTitle}</span>
              <p className="text-xs leading-relaxed font-light">
                {t.disclaimerDesc}
              </p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
