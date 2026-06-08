import { VisaCalculators } from "@/components/calculators/VisaCalculators";
import { VisaRequirementsTable } from "@/components/calculators/VisaRequirementsTable";
import { FileText, Scale, Shield, BookOpen, Building2, MapPin, Phone, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GOOGLE_FORM_URL } from "@/lib/constants";

const TRANSLATIONS = {
    ko: {
        heroTitle: "대한민국 비자 종합 평가",
        heroDesc: "법무부 출입국 대행기관 및 김앤현 법률사무소와 함께하는 비자 자격 평가 및 출입국 계획 수립.",
        checkEligibility: "자격 자가진단",
        aboutUs: "법률사무소 소개",
        aboutTitle: "김앤현 법률사무소",
        aboutDesc1: "우리는 대한민국 이민법 및 비자 신청, 체류 허가, 귀화 업무와 관련하여 신뢰할 수 있는 법률 서비스를 제공합니다.",
        aboutDesc2: "현행 출입국 관리법령에 근거한 정확한 법적 안내를 제공하며, 복잡한 행정 절차를 원활하게 진행하도록 지원합니다.",
        contactInfo: "연락처 및 위치 정보",
        officeLocation: "사무소 위치",
        locationDetail: "대한민국 서울 서초구 법원로 16",
        phoneWhatsapp: "전화번호 / WhatsApp",
        email: "이메일",
        disclaimerText: "대한민국 법률에 의거하여 공식 등록된 대행기관입니다. 과거의 성공 사례가 유사한 사안의 결과를 보장하지 않습니다.",
        assessmentTitle: "비자 자격 자가진단",
        assessmentDesc: "2025년 최신 출입국관리법령을 기준으로 다양한 비자 유형에 대한 자격 여부를 진단해보세요.",
        libraryTitle: "비자 요건 라이브러리",
        libraryDesc: "대한민국의 주요 비자 종류, 발급 목적, 체류 기간에 대한 종합적인 가이드라인입니다.",
        feature1Title: "법령 및 지침 준수",
        feature1Desc: "모든 진단과 가이드는 법무부의 최신 출입국관리법령 및 심사 지침을 엄격히 준수합니다.",
        feature2Title: "서식 작성 지원",
        feature2Desc: "통합신청서(제34호 서식) 등 공식 행정 서식을 요건에 맞게 올바르게 작성하도록 안내합니다.",
        feature3Title: "변호사 검토",
        feature3Desc: "복잡하고 난이도 높은 사안에 대해서는 김앤현 법률사무소의 이민 대리 변호사가 직접 검토합니다.",
        ctaTitle: "개별 법률 상담 신청",
        ctaDesc: "복잡한 출입국 사안이나 거부 처분에 대해서는 라이선스를 갖춘 변호사와의 직접 상담을 권장합니다.",
        contactButton: "김앤현 상담 신청"
    },
    en: {
        heroTitle: "Korea Visa Legal Authority",
        heroDesc: "Official visa eligibility assessment and strategic immigration planning. Verified by Kim&Hyun Law Office.",
        checkEligibility: "Check Eligibility",
        aboutUs: "About Us",
        aboutTitle: "Kim&Hyun Law Office",
        aboutDesc1: "We provide reliable legal services in Korean immigration law, assisting with visa applications, residence permits, and naturalization matters.",
        aboutDesc2: "Our practice focuses on delivering accurate legal guidance based on current immigration regulations and assisting clients through complex administrative procedures.",
        contactInfo: "Contact Information",
        officeLocation: "Office Location",
        locationDetail: "Seoul, South Korea",
        phoneWhatsapp: "Phone / WhatsApp",
        email: "Email",
        disclaimerText: "Licensed to practice law in the Republic of Korea. Attorney advertising. Prior results do not guarantee similar outcomes.",
        assessmentTitle: "Visa Eligibility Assessment",
        assessmentDesc: "Use our legal tools to determine your eligibility for various Korean visa types based on the 2025 Immigration Control Act.",
        libraryTitle: "Visa Requirements Library",
        libraryDesc: "Comprehensive guide to visa types, purposes, and stay periods.",
        feature1Title: "Statutory Compliance",
        feature1Desc: "All assessments are strictly based on the latest Ministry of Justice manuals and enforcement ordinances.",
        feature2Title: "Document Guidance",
        feature2Desc: "Guides on how to prepare official application forms (Form No. 34, etc.) formatted perfectly for submission.",
        feature3Title: "Attorney Verified",
        feature3Desc: "Complex cases are flagged for review by our partner immigration attorneys at Kim&Hyun.",
        ctaTitle: "Professional Legal Consultation",
        ctaDesc: "For complex immigration matters, direct consultation with a licensed attorney is recommended.",
        contactButton: "Contact Kim&Hyun"
    },
    zh: {
        heroTitle: "韩国签证综合评估中心",
        heroDesc: "基于法务部登记代理机构与金&贤律师事务所的签证资格评估与出入境合规规划。",
        checkEligibility: "在线评估",
        aboutUs: "律所介绍",
        aboutTitle: "金&贤 律师事务所",
        aboutDesc1: "我们在韩国出入境管理法、签证申请、滞留资格以及入籍归化等领域提供合规可靠的法律服务。",
        aboutDesc2: "致力于根据最新的出入境法规提供准确的法律指导，协助客户顺利完成复杂的行政审查程序。",
        contactInfo: "联系方式及地址",
        officeLocation: "律所地址",
        locationDetail: "大韩民国首尔瑞草区法院路16",
        phoneWhatsapp: "电话 / WhatsApp",
        email: "电子邮件",
        disclaimerText: "大韩民国执业律师事务所。过往的成功案例不保证类似案件的最终结果。",
        assessmentTitle: "签证资格在线评估",
        assessmentDesc: "根据2025年最新出入境管理法，评估您是否符合申请各类韩国签证的条件。",
        libraryTitle: "签证申请指南库",
        libraryDesc: "有关韩国主要签证类型、申请目的和滞留期限的综合指南。",
        feature1Title: "严格遵守法规",
        feature1Desc: "所有评估与指南均严格依据法务部最新颁布的出入境管理法及审查指南进行。",
        feature2Title: "申请文件指导",
        feature2Desc: "指导如何正确填写综合申请书（第34号格式）等官方行政申请文件。",
        feature3Title: "律师核查服务",
        feature3Desc: "对于疑难及复杂案件，将由金&贤出入境合规律师直接进行深度审核。",
        ctaTitle: "一对一律师法律咨询",
        ctaDesc: "对于复杂的出入境案件或拒签救济，建议直接咨询拥有执业资格的韩国律师。",
        contactButton: "联系金&贤律所"
    },
    ja: {
        heroTitle: "韓国ビザ総合適性診断",
        heroDesc: "法務部出入国代행機関および金＆賢法律事務所によるビザ要件の判定と出入国戦略の策定。",
        checkEligibility: "適性診断",
        aboutUs: "事務所紹介",
        aboutTitle: "金＆賢 法律事務所",
        aboutDesc1: "当事務所は、韓国の出入国管理法、ビザ申請、在留資格、帰化申請に関する信頼できる法律サービスを提供しています。",
        aboutDesc2: "現行の出入国管理法令に基づき正確な法的アドバイスを提供し、複雑な行政手続きを円滑にサポートします。",
        contactInfo: "お問い合わせ・アクセス",
        officeLocation: "所在地",
        locationDetail: "大韓民国ソウル特別市瑞草区法院路16",
        phoneWhatsapp: "電話番号 / WhatsApp",
        email: "メールアドレス",
        disclaimerText: "大韓民国で認可された法律事務所です。過去の事例は将来の結果を保証するものではありません。",
        assessmentTitle: "ビザ適性オンライン診断",
        assessmentDesc: "2025年最新の出入国管理法に基づき、様々な韓国ビザの要件を満たしているか診断します。",
        libraryTitle: "ビザ要件ライブラリ",
        libraryDesc: "韓国の主なビザの種類、取得目的、在留期間に関する総合的なガイドラインです。",
        feature1Title: "法令の厳格遵守",
        feature1Desc: "すべての診断は、法務部の最新出入国管理法令および審査基準に厳密に基づいています。",
        feature2Title: " Rufus 申請書類の作成支援",
        feature2Desc: "統合申請書（様式第34号）などの公式行政書類が適切に作成できるよう案内します。",
        feature3Title: "弁護士による検証",
        feature3Desc: "複雑で難易度の高い事案については、金＆賢の出入国担当弁護士が直接レビューを行います。",
        ctaTitle: "個別法律相談の申し込み",
        ctaDesc: "複雑な出入国問題やビザ発給拒否に対する救済については、正規の弁護士への直接相談をお勧めします。",
        contactButton: "金＆賢に相談する"
    }
};

const supportedLangs = ["ko", "en", "zh", "ja"] as const;
type Lang = typeof supportedLangs[number];

export default async function LocalizedPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang as Lang;

    if (!supportedLangs.includes(lang)) {
        notFound();
    }

    const t = TRANSLATIONS[lang];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/10 selection:text-primary">
            {/* Hero Section */}
            <div className="relative bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <FadeIn className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center mb-6">
                            <Scale className="h-12 w-12 text-primary mb-4" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                            {t.heroTitle}
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 leading-relaxed font-light">
                            {t.heroDesc}
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <a href="#calculators" className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                {t.checkEligibility}
                            </a>
                            <a href="#about" className="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                {t.aboutUs}
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24">
                {/* About Section */}
                <section id="about" className="scroll-mt-20">
                    <FadeIn>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-white">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-6">
                                        <Building2 className="h-8 w-8 text-secondary" />
                                        <h2 className="text-3xl font-serif font-bold">{t.aboutTitle}</h2>
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                        {t.aboutDesc1}
                                    </p>
                                    <p className="text-slate-300 leading-relaxed">
                                        {t.aboutDesc2}
                                    </p>
                                </div>
                                <div id="contact" className="space-y-4">
                                    <h3 className="text-xl font-serif font-bold mb-6">{t.contactInfo}</h3>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{t.officeLocation}</p>
                                            <p className="text-slate-300">{t.locationDetail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{t.phoneWhatsapp}</p>
                                            <a
                                                href="https://wa.me/821055346843"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-secondary hover:text-secondary/80 transition-colors"
                                            >
                                                +82 10-5534-6843
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{t.email}</p>
                                            <a
                                                href="mailto:info@kimnhyun.com"
                                                className="text-secondary hover:text-secondary/80 transition-colors"
                                            >
                                                info@kimnhyun.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-700">
                                        <p className="text-sm text-slate-400">
                                            {t.disclaimerText}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Calculators Section */}
                <section id="calculators" className="scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl mb-4">{t.assessmentTitle}</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            {t.assessmentDesc}
                        </p>
                    </div>
                    <VisaCalculators />
                </section>

                {/* Requirements Table Section */}
                <section id="requirements">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl mb-4">{t.libraryTitle}</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            {t.libraryDesc}
                        </p>
                    </div>
                    <VisaRequirementsTable />
                </section>

                {/* Features Grid */}
                <section>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <FadeIn delay={0.1} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <BookOpen className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{t.feature1Title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t.feature1Desc}
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <FileText className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{t.feature2Title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t.feature2Desc}
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <Shield className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{t.feature3Title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {t.feature3Desc}
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary rounded-xl overflow-hidden relative shadow-lg">
                    <div className="relative px-8 py-16 md:px-16 md:py-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-3xl font-serif font-bold text-white">{t.ctaTitle}</h2>
                            <p className="text-indigo-100 text-lg font-light">
                                {t.ctaDesc}
                            </p>
                        </div>
                        <a
                            href={GOOGLE_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-slate-50 transition-colors shadow-md"
                        >
                            {t.contactButton}
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function generateStaticParams() {
    return [
        { lang: "ko" },
        { lang: "en" },
        { lang: "zh" },
        { lang: "ja" }
    ];
}
