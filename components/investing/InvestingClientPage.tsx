"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Coins, 
  Scale, 
  FileText, 
  Shield, 
  FileCheck,
  CheckSquare,
  Square,
  AlertTriangle
} from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";

type Lang = "ko" | "en" | "zh" | "ja";

interface ChecklistItem {
  id: number;
  ko: string;
  en: string;
  zh: string;
  ja: string;
  law: {
    ko: string;
    en: string;
    zh: string;
    ja: string;
  };
}

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
    sec3Title: "D-8 기업투자비자 간단 자가진단",
    sec3Sub: "아래 항목들은 D-8 기업투자비자 심사에서 자주 문제되는 요소입니다. 해당하는 항목에 체크해 보세요. 상담 준비를 돕기 위한 체크리스트이며, 자격 판정이 아닙니다.",
    checkEmphasis: "본 체크는 비자를 승인하거나 거부하지 않습니다. 실제 판단은 행정청이 사안 전체를 보고 개별적으로 합니다.",
    checkInstruction: "위 항목 중 해당하는 것에 체크해 보세요.",
    
    // Section 4
    sec4Title: "변호사에게 문의",
    sec4Sub: "Ask an attorney",
    sec4Desc: "상황을 간략히 보내주시면 김현정 변호사가 검토 후, 유료 상담이 필요한 경우 비용을 개별 안내드립니다. 모든 문의는 김현정 변호사가 개별 검토하며, 상담은 한국 출입국·투자법에 한정되고 결과를 보장하지 않습니다.",
    btnRequest: "상담 신청",
    btnWhatsApp: "WhatsApp",
    
    // Disclaimer
    disclaimerTitle: "법적 면책공고",
    disclaimerDesc: "본 자가진단은 일반적인 법률 정보일 뿐 법률 자문·자격 판정·비자 결과 보장이 아닙니다. 위 기준은 작성 시점의 외국인투자촉진법 및 관련 판례를 반영한 것으로 변경될 수 있습니다. 변호사·의뢰인 관계는 별도의 위임계약 시에만 성립하며, 모든 문의는 김현정 변호사가 개별 검토합니다."
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
    sec3Title: "D-8 Investor Visa — Quick Self-Check",
    sec3Sub: "These factors commonly come up when the authorities assess a D-8 investor-visa case. Tick the ones that apply to you. This is a checklist to help you prepare — it is not an eligibility decision.",
    checkEmphasis: "No answer here approves or denies a visa. Each case is decided individually by the Korean authorities based on the full facts.",
    checkInstruction: "Tick the items above that apply to you.",
    
    // Section 4
    sec4Title: "Ask an attorney",
    sec4Sub: "변호사에게 문의",
    sec4Desc: "Send a brief message describing your situation. Attorney Kim Hyun-jung will review it and, where a paid consultation is appropriate, advise you of the fee individually. All inquiries are reviewed individually by Kim Hyun-jung. Consultations are limited to Korean immigration and investment law and do not guarantee any outcome.",
    btnRequest: "Request a Consultation",
    btnWhatsApp: "WhatsApp",
    
    // Disclaimer
    disclaimerTitle: "Legal Disclaimer",
    disclaimerDesc: "This self-check provides general legal information only and does not constitute legal advice, an eligibility decision, or any guarantee of a visa outcome. The criteria above reflect the Foreign Investment Promotion Act and related court decisions in force at the time of writing and may change. An attorney-client relationship arises only upon a separate engagement agreement. A licensed Korean attorney (Kim Hyun-jung, Kim & Hyun Law Office) reviews each inquiry individually."
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
    sec3Title: "D-8企业投资签证简易自测",
    sec3Sub: "以下项目是D-8企业投资签证审查中经常遇到的问题。请勾选适用于您的项目。该清单旨在帮助您准备咨询，不作为最终资格判定。",
    checkEmphasis: "此测试不能批准或拒绝签证。实际判定由出入境管理部门根据案件的全部事实独立做出。",
    checkInstruction: "请勾选适用于您的项目。",
    
    // Section 4
    sec4Title: "咨询韩国执业律师",
    sec4Sub: "Ask an attorney",
    sec4Desc: "请简要发送您的具体情况。金贤正律师在评估后，如需有偿咨询，将单独向您通知费用。所有咨询均由金贤正律师个案审查，且仅限于韩国出入境与投资法，不保证任何结果。",
    btnRequest: "申请咨询",
    btnWhatsApp: "WhatsApp",
    
    // Disclaimer
    disclaimerTitle: "法律免责声明",
    disclaimerDesc: "本自测仅提供关于韩国外国人投资与出入境程序的常规法律信息，不构成法律意见、资格判定或任何签证结果的保证。上述标准反映了撰写时生效的外国人投资促进法及相关判例，并可能发生变化。律师-客户关系仅在签署单独的委托协议时成立，所有咨询均由金贤正律师个案审查。"
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
    sec3Title: "D-8企業投資ビザ簡単セルフチェック",
    sec3Sub: "以下の項目はD-8企業投資ビザの審査でよく問題になる要素です。該当する項目にチェックを入れてください。相談準備をサポートするためのチェックリストであり、資格判定ではありません。",
    checkEmphasis: "このチェックはビザを承認または拒否するものではありません。実際の判断は行政庁が事案全体を見て個別に行います。",
    checkInstruction: "該当する項目すべてにチェックを入れてください。",
    
    // Section 4
    sec4Title: "韓国の資格を持つ弁護士に相談する",
    sec4Sub: "Ask an attorney",
    sec4Desc: "状況を簡単にお送りいただければ、金賢正弁護士가検討の上、有料相談が必要な場合は費用を個別にご案内いたします。すべての問い合わせは金賢正弁護士が個別に確認し、相談は韓国の出入国・投資法に限定され、結果を保証するものではありません。",
    btnRequest: "相談を申し込む",
    btnWhatsApp: "WhatsApp",
    
    // Disclaimer
    disclaimerTitle: "免責事項",
    disclaimerDesc: "本セルフチェックは一般的な法律情報を提供するものであり、個別的な法律相談や在留資格・ビザ発給結果を保証するものではありません。上記の基準は作成時点の外国人投資促進法および関連判例を反映したものであり、変更されることがあります。弁護士・依頼人関係は別途の委任契約締結時にのみ成立し、すべての問い合わせは金賢正弁護士が個別に確認します。"
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

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 0,
    ko: "투자 예정 금액이 1억 원 이상이다.",
    en: "My intended investment is KRW 100 million or more.",
    zh: "计划投资金额为1亿韩元以上。",
    ja: "投資予定金額が1億ウォン以上である。",
    law: {
      ko: "외투법 시행령 제2조",
      en: "Foreign Investment Promotion Act, Enforcement Decree Art. 2",
      zh: "《外国人投资促进法》施行令第2条",
      ja: "外国人投資促進法施行令第2条"
    }
  },
  {
    id: 1,
    ko: "의결권 있는 주식의 10% 이상을 보유한다(또는 임원 파견·선임 권한을 수반한다).",
    en: "I will hold 10% or more of the voting shares (or hold shares with the right to appoint/dispatch an officer).",
    zh: "持有10%以上有表表决权股份（或拥有派遣/选任高级管理人员的权利）。",
    ja: "議決権のある株式の10%以上を保有している（または役員の派遣・選任権限を伴う）。",
    law: {
      ko: "외투법 시행령 제2조 제2항",
      en: "FIPA Enforcement Decree Art. 2(2)",
      zh: "《外国人投资促进法》施行令第2条第2款",
      ja: "外国人投資促進法施行令第2条第2項"
    }
  },
  {
    id: 2,
    ko: "내가 처음부터 직접 설립하는 회사가 아니라, 이미 존재하거나 설립 중이던 한국 법인에 투자한다.",
    en: "I am investing in an existing Korean company, not a company I am establishing myself from scratch.",
    zh: "投资于已存在或设立中的韩国法人，而不是自己从头设立新公司。",
    ja: "新規に直接設立する会社ではなく、既に存在しているか設立中の韓国法人に投資する。",
    law: {
      ko: "대구지법 2012구합29, 서울고법 2024누52900",
      en: "Daegu Dist. Court 2012guhap29; Seoul High Court 2024nu52900",
      zh: "大邱地方法院 2012Guhap29 / 首尔高等法院 2024Nu52900",
      ja: "大邱地裁 2012クハプ29 / ソウル高裁 2024ヌ52900"
    }
  },
  {
    id: 3,
    ko: "투자 자금이 본인 명의이며, 출처를 입증할 수 있다.",
    en: "The investment funds are in my own name and I can document their source.",
    zh: "投资资金以本人名义持有，且能够证明其来源。",
    ja: "投資資金が本人名義であり、その出所を立証できる。",
    law: {
      ko: "법무부 D-8 지침, 수원지법 2024구단12447",
      en: "MOJ D-8 guideline; Suwon Dist. Court 2024gudan12447",
      zh: "法务部 D-8 指南 / 水原地方法院 2024Gudan12447",
      ja: "法務部 D-8 指針 / 水原地裁 2024クダン12447"
    }
  },
  {
    id: 4,
    ko: "독립된 사업장을 확보할 예정이다.",
    en: "I will secure an independent place of business.",
    zh: "将确保独立的营业场所。",
    ja: "独立した事業所を確保する予定である。",
    law: {
      ko: "체류연장 심사 요소(대구지법 2023구단10742 등)",
      en: "Reviewed at extension stage (Daegu Dist. Court 2023gudan10742, etc.)",
      zh: "延长停留期审查要素 (大邱地方法院 2023Gudan10742 等)",
      ja: "滞留期間延長審査要素 (大邱地裁 2023クダン10742 など)"
    }
  },
  {
    id: 5,
    ko: "임원·상급관리자·전문가(필수 전문인력)로서 종사한다.",
    en: "I will work as an executive, senior manager, or specialist (essential professional personnel).",
    zh: "将作为高管、高级管理人员或专家（核心专业人员）执业。",
    ja: "役員・上級管理職・専門家（必須専門人材）として従事する。",
    law: {
      ko: "출입국관리법 시행령 별표 1의2 제11호",
      en: "Enforcement Decree of Immigration Act, Annex 1-2 No.11",
      zh: "《出境入境管理法》施行令 附表1-2第11号",
      ja: "出入国管理法施行令 別表1の2第11号"
    }
  }
];

export default function InvestingClientPage({ lang }: { lang: Lang }) {
  const currentLang = lang;
  const t = TRANSLATIONS[currentLang];
  
  const [docTab, setDocTab] = useState<"new" | "existing">("new");
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false, false]);
  const [resultVisible, setResultVisible] = useState(false);

  const checkedCount = checkedItems.filter(Boolean).length;
  const isItem3Checked = checkedItems[2]; // Index 2 is "investing in an existing company"

  const toggleCheck = (index: number) => {
    const next = [...checkedItems];
    next[index] = !next[index];
    setCheckedItems(next);
  };

  useEffect(() => {
    if (checkedItems.some(Boolean)) {
      setResultVisible(true);
    } else {
      setResultVisible(false);
    }
  }, [checkedItems]);

  const getResultText = (count: number) => {
    switch (currentLang) {
      case "ko":
        return (
          <>
            6개 중 <strong className="text-indigo-400 text-lg font-bold">{count}</strong>개 항목에 해당하십니다. 이 요소들은 D-8 사안에서 자주 문제되지만 합격·불합격을 가르는 기준은 아니며, 실제 판단은 행정청이 개별적으로 합니다. 정확한 검토를 위해 변호사 상담을 권합니다.
          </>
        );
      case "zh":
        return (
          <>
            您已勾选了 6 个要素中的 <strong className="text-indigo-400 text-lg font-bold">{count}</strong> 个。这些是在 D-8 签证案件中经常被考量的重要因素，但它们并不是通过或失败的绝对标准——出入境行政机关会对每一份申请进行个案审查。最可靠的下一步是让执业律师评估您的具体情况。
          </>
        );
      case "ja":
        return (
          <>
            6項目のうち <strong className="text-indigo-400 text-lg font-bold">{count}</strong>項目に該当します。これらの要素は D-8 ビザの審査でよく问题になりますが、合否を分ける決定的な基準ではなく、実際の判断は行政庁が事案全体を見て個別に行います。正確な検討のために、弁護士への相談をお勧めします。
          </>
        );
      case "en":
      default:
        return (
          <>
            You've noted <strong className="text-indigo-400 text-lg font-bold">{count}</strong> of 6 factors. These are points that often matter in a D-8 case, but they are not a pass/fail test — the authorities assess every application individually. The most reliable next step is to have a licensed attorney review your specific situation.
          </>
        );
    }
  };

  const getWarningText = () => {
    switch (currentLang) {
      case "ko":
        return "기존 법인 투자가 아니라 직접 회사를 설립하는 경우라면 적합한 비자 유형이 달라질 수 있어, 변호사와 상의해 볼 지점입니다.";
      case "zh":
        return "如果您计划自己成立公司，而不是投资现有公司，适合的签证类型可能会有所不同，这是非常值得与律师讨论的关键点。";
      case "ja":
        return "既存の法人への投資ではなく、ご自身で直接会社を設立される場合、適したビザの種類が異なる可能性があり、弁護士とご相談いただく価値がある点です。";
      case "en":
      default:
        return "If you plan to set up a company yourself rather than invest in an existing one, the visa category that fits may differ — this is a point worth discussing with an attorney.";
    }
  };

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
              const stepTitle = currentLang === "ko" ? step.ko.title : step.en.title;
              const stepDesc = currentLang === "ko" ? step.ko.desc : step.en.desc;
              const stepLaw = currentLang === "ko" ? step.ko.law : step.en.law;
              
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
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {currentLang === "ko" ? "김앤현 법률사무소 · Kim & Hyun Law Office" : "Kim & Hyun Law Office · 김앤현 법률사무소"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">{t.sec3Title}</h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              {t.sec3Sub}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Regulatory compliance warning box */}
            <div className="flex gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed font-light">
              <Shield className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">
                  {currentLang === "ko" ? "안내 / Notice" : "Notice / 안내"}
                </span>
                <p className="font-semibold text-slate-800">
                  {t.checkEmphasis}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {currentLang === "ko" 
                    ? "No answer here approves or denies a visa. Each case is decided individually by the Korean authorities based on the full facts."
                    : "본 체크는 비자를 승인하거나 거부하지 않습니다. 실제 판단은 행정청이 사안 전체를 보고 개별적으로 합니다."
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {CHECKLIST_ITEMS.map((item, idx) => {
                const itemText = item[currentLang] || item.en;
                const lawRef = item.law[currentLang] || item.law.en;
                const secondaryText = currentLang === "ko" ? item.en : item.ko;

                return (
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
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-start gap-4">
                        <p className={`text-sm font-semibold transition-colors ${checkedItems[idx] ? "text-indigo-900" : "text-slate-800"}`}>
                          {itemText}
                        </p>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0 bg-slate-100/60 px-1.5 py-0.5 rounded border border-slate-200/40">
                          {lawRef}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-light">
                        {secondaryText}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center text-xs text-slate-400 font-medium">
              {t.checkInstruction}
            </div>

            {/* Verification result box (displays count only, complying with ad regulations) */}
            {resultVisible && (
              <FadeIn className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileCheck className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    {currentLang === "ko" ? "자가진단 결과 / Self-Check Results" : "Self-Check Results / 자가진단 결과"}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm sm:text-base leading-relaxed">
                  <p>
                    {getResultText(checkedCount)}
                  </p>
                  {!isItem3Checked && (
                    <p className="text-amber-300 border-t border-slate-800 pt-3 text-xs flex gap-1.5 items-start font-light leading-relaxed">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>{getWarningText()}</span>
                    </p>
                  )}
                </div>
              </FadeIn>
            )}
          </div>
        </section>

        {/* Section 4: CTA (Price-free) */}
        <section className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-indigo-400">
                {t.sec4Sub}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {t.sec4Title}
              </h2>
            </div>
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
