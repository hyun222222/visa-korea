export type SupportedLang = 'ko' | 'en' | 'zh' | 'ja';

export const TRANSLATIONS = {
    ko: {
        nav: {
            check: "자격 자가 진단",
            apply: "신청서 작성",
            blog: "블로그",
            board: "게시판",
            contact: "상담 신청",
        },
        hero: {
            badge: "김앤현 법률사무소 · 법무부 출입국대행 기관",
            title: "대한민국 의료관광 비자 및 분쟁구제 지원",
            desc: "외국인 환자의 비자(C-3-3, G-1-10) 신청·거부 구제부터 병원의 SNS 의료광고 심의 및 환자 분쟁까지, 4대 자격사와 출입국대행 등록을 결합한 통합 법률 솔루션.",
            ctaPatient: "의료비자 · 분쟁 해결 진단",
            ctaHospital: "병원 광고 & 비자 진단",
        },
        trust: {
            title: "4대 자격사 협업 & 법무부 정식 등록 출입국민원 대행기관",
            lawyer: "변호사 법률자문 및 쟁송",
            patent: "변리사 지식재산 보호",
            tax: "세무사 세무 설계",
            wealth: "자산관리사 자산구조 설계",
            moj: "법무부 출입국대행 기관",
        },
        visa: {
            title: "의료관광 비자 제도 안내",
            desc: "외국인 환자 유치 및 치료를 위한 최적의 비자 종류와 절차를 확인하세요.",
            c33: {
                title: "C-3-3 (메디컬 비자)",
                desc: "단기 치료 및 미용·성형 목적의 90일 이하 단기 비자. 유치기관의 초청장 및 신원보증이 필요합니다.",
            },
            g110: {
                title: "G-1-10 (치료·요양 비자)",
                desc: "장기 치료 또는 요양이 필요한 환자 및 동반 가족을 위한 비자(최대 1년). 연장 신청 시 정밀한 소명이 필요합니다.",
            },
            regist: {
                title: "유치업자/기관 등록",
                desc: "외국인 환자를 합법적으로 유치하기 위한 보건복지부 등록 요건 및 신원보증 적격성 자문.",
            },
            electronic: {
                title: "우수기관 전자비자",
                desc: "우수 유치기관으로 지정될 경우, 대리 신청 및 온라인 전자비자 발급 혜택을 제공받을 수 있습니다.",
            },
        },
        rights: {
            title: "외국인 환자의 4대 법적 권리",
            desc: "대한민국 의료법상 외국인 환자가 보호받아야 할 핵심 권리입니다.",
            rightsList: [
                { title: "진료 선택 및 고지 동의권", desc: "치료의 위험성, 대안, 수수료 구조에 대해 충분한 설명을 듣고 동의할 권리" },
                { title: "비밀 보장 및 개인정보권", desc: "의료 정보 및 여권 정보가 외부에 유출되지 않고 엄격하게 비밀이 보장될 권리" },
                { title: "조정 신청 및 구제권", desc: "의료 사고나 환불 분쟁 발생 시 의료분쟁조정중재원에 신속하게 조정을 신청할 권리" },
                { title: "대행기관 확인 권리", desc: "합법적으로 등록된 유치기관(출입국대행기관)인지 사전에 확인할 권리" }
            ],
        },
        dispute: {
            title: "의료관광 분쟁 해결 3단계",
            desc: "외국인 환자와 병원 간 분쟁 발생 시 합법적이고 신속한 해결 절차입니다.",
            steps: [
                { num: "1", title: "직접 협상 및 서면 통지", desc: "내용증명 송달을 통해 계약 불이행, 과다 수수료, 부작용에 대한 배상 공식 제기" },
                { num: "2", title: "공공조정 및 중재 신청", desc: "한국의료분쟁조정중재원(K-Medi) 또는 소비자원에 조정 신청을 통해 합의 유도" },
                { num: "3", title: "변호사 대리 및 행정구제", desc: "민형사 소송 대리, 위법한 비자 거부 처분에 대한 행정심판 및 소송 제기(강조)" }
            ],
        },
        services: {
            title: "우선순위 서비스",
            desc: "객관적인 지표와 통계를 기반으로 가장 확실한 해결책을 제시합니다.",
            list: [
                { title: "SNS 의료광고 컴플라이언스", desc: "B2B 서비스. 의료법상 SNS 광고 사전심의 및 불법 과장 광고 행정처분 대응 자문.", path: "/ko/sns-medical-ad-compliance", badge: "수요 1위" },
                { title: "의료비자 거부·연장 행정구제", desc: "설권적 처분으로 거부된 C-3-3/G-1-10 비자의 소명 자료 작성 및 행정심판 대행.", path: "/ko/medical-visa-remedy", badge: "수임 2위" },
                { title: "유치업자 등록 및 전자비자", desc: "유치기관 보건복지부 등록 대행 및 우수유치기관 지정을 위한 전략 컨설팅.", path: "/ko/attraction-registration", badge: "추천" },
                { title: "불법 알선 형사 방어", desc: "의료법 제27조 3항(소개·알선 금지) 위반 혐의에 대한 형사 변호 및 소명.", path: "/ko/patient-attraction-defense" },
                { title: "수수료 및 세무 설계", desc: "세무사 협업. 외국인 수수료 투명화 및 부가세 사후 환급 일몰 대응 음성화 리스크 방지.", path: "/ko/fee-tax-structuring" },
                { title: "환불 대리 및 분쟁 해결", desc: "환자 부작용 배상 청구, 성형 수술비 환불 조정 신청 및 민사 대리.", path: "/ko/disputes" },
                { title: "표준 계약 및 자산 설계", desc: "변리사·자산관리사 결합. 다국어 동의서 작성, 의료 상표 지식재산권, 국외 자산 구조 설계.", path: "/ko/contact" }
            ],
        },
        ai: {
            title: "AI 1차 무료 진단",
            desc: "법적 규제 리스크와 해결책을 사전에 무료로 자가 진단하세요. (최종 자문은 변호사가 진행합니다)",
            patientTab: "환자 / 보호자용 진단",
            hospitalTab: "병원 / 유치기관용 진단",
            submit: "진단 결과 보기",
            reset: "다시 진단하기",
            legalNotice: "※ 본 진단은 일반 법률 정보 제공용이며 정식 법률 자문이 아닙니다. 상세 상담은 변호사 면담이 필요합니다.",
        },
        process: {
            title: "수임 진행 절차",
            desc: "체계적이고 투명한 5단계 절차를 통해 최선의 결과를 이끌어냅니다.",
            steps: [
                { title: "1. 온라인 문의", desc: "WhatsApp, LINE, KakaoTalk 또는 접수 폼을 통한 비대면 문의" },
                { title: "2. 문서 및 증거 업로드", desc: "보안이 유지되는 채널을 통한 의료 기록, 비자 서류, 계약 문서 공유" },
                { title: "3. 1차 법률 검토", desc: "변호사, 세무사, 출입국대행인단 간 종합 검토 및 실현 가능성 진단" },
                { title: "4. 맞춤 전략 수립", desc: "의뢰인에게 최적화된 행정소송, 이의신청 또는 합의안 구성" },
                { title: "5. 신속한 사건 해결", desc: "법률대리, 대행 업무 수행 및 해결 상황 실시간 보고" }
            ]
        },
        faq: {
            title: "자주 묻는 질문 (FAQ)",
            desc: "외국인 환자 유치 및 의료 비자 관련하여 가장 자주 묻는 질문들을 모았습니다.",
            list: [
                { q: "C-3-3 비자가 거부되었습니다. 다시 신청하려면 어떻게 하나요?", a: "비자 거부는 출입국 공무원의 재량권이 크기 때문에, 단순 재신청 시 다시 거부될 확률이 높습니다. 거부 사유에 대한 철저한 법률적 분석과 재정 능력 소명, 치료 계획의 정당성 보완 및 법무부 등록 대행기관 명의의 공식 소명서 작성이 필요합니다." },
                { q: "환자가 성형 부작용으로 환불을 요구합니다. 어떻게 대응해야 하나요?", a: "의료법 및 소비자보호법에 의거, 우선 시술 과정에서 사전 설명의무(고지동의)를 다했는지 검토해야 합니다. 이후 직접적인 과실 유무를 판단하고, 과실이 불분명할 경우 합의서 양식 작성을 통해 향후 민형사상 이의를 제기하지 않는 조건으로 합의를 도출하거나 K-Medi 조정을 거치는 것이 유리합니다." },
                { q: "SNS에 해외 환자 유치 목적의 광고를 올릴 때 주의할 점은 무엇인가요?", a: "국내 의료광고와 마찬가지로 SNS 광고 또한 의료광고 사전심의 대상입니다. 특히 '치료 효과 보장', '환불 확약', '비포/애프터 사진의 악용' 등은 보건소 단속 및 단계별 업무정지 처분으로 이어질 수 있으므로 사전에 법률 컴플라이언스 검토를 반드시 거쳐야 합니다." }
            ]
        },
        contactForm: {
            title: "법률 상담 신청",
            desc: "안전하고 비밀이 보장되는 1:1 창구를 통해 신속히 답변해 드리겠습니다.",
            name: "성함 / 기관명 *",
            email: "이메일 주소 *",
            phone: "연락처 (국가번호 포함) *",
            channel: "선호하는 메신저 (WhatsApp / WeChat / LINE ID)",
            message: "상담 요청 내용 (비자 사유, 분쟁 내용 등) *",
            file: "관련 서류 업로드 (여권, 거부통지서, 진료동의서 등)",
            sensitiveConsent: "개인정보 및 민감정보(의료·건강정보) 수집·이용 및 국외이전에 동의합니다. *",
            sensitiveNotice: "의료 비자 및 분쟁 자문 목적에 한정하여 처리하며, 상담 종료 후 안전하게 파기됩니다.",
            submit: "상담 접수 완료",
            sending: "접수 중...",
            success: "성공적으로 상담이 접수되었습니다. 담당 변호사가 신속히 메신저로 연락드리겠습니다."
        },
        disclaimer: {
            title: "법적 면책 고지 (Disclaimer)",
            text: "본 웹사이트에서 제공되는 모든 정보 및 AI 진단 결과는 대한민국 법령에 기반한 일반적인 참고 자료일 뿐이며, 어떠한 경우에도 정식 법률 자문이나 비자 발급 보장, 치료/환불 결과에 대한 약속을 의미하지 않습니다. 구체적인 사안에 대한 의사결정 전에 반드시 김앤현 법률사무소의 변호사 등 공인된 자격사와의 대면 또는 공식 자문을 거치시기 바랍니다. 관련하여 제공된 건강·의료 정보는 개인정보 보호법에 의거하여 비밀을 엄격하게 유지합니다."
        }
    },
    en: {
        nav: {
            check: "Eligibility Check",
            apply: "Fill Application",
            blog: "Blog",
            board: "Q&A Board",
            contact: "Consultation",
        },
        hero: {
            badge: "Kim&Hyun Law Office · Registered Immigration Agency",
            title: "Korea Medical Visa & Remedy Specialists",
            desc: "From visa (C-3-3, G-1-10) application & refusal remedies for foreign patients to hospital compliance and dispute settlement. Integrated solutions combining legal expertise with official immigration registration.",
            ctaPatient: "Check Visa & Dispute Remedy",
            ctaHospital: "Hospital Compliance Assessment",
        },
        trust: {
            title: "Professional Credentials & Authorized Immigration Services",
            lawyer: "Attorney Legal Representation",
            patent: "Patent Attorney IP Protection",
            tax: "Tax Accountant Structuring",
            wealth: "Wealth Management Structuring",
            moj: "Registered Immigration Agency",
        },
        visa: {
            title: "Medical Tourism Visa System",
            desc: "Choose the right visa type and discover the requirements for medical tourism in Korea.",
            c33: {
                title: "C-3-3 (Medical Tour Visa)",
                desc: "Short-term visa (up to 90 days) for treatment or cosmetic surgery. Requires sponsor letters from registered institutions.",
            },
            g110: {
                title: "G-1-10 (Medical Treatment)",
                desc: "Long-term visa (up to 1 year) for patients requiring extended treatment and accompanying family. Requires rigorous extension documentation.",
            },
            regist: {
                title: "Agency Registration",
                desc: "Legal support for Ministry of Health registration, mandatory for hosting international patients in Korea.",
            },
            electronic: {
                title: "E-Visa for Premium Partners",
                desc: "Premium registered institutions are granted streamlined online E-visa processing.",
            },
        },
        rights: {
            title: "4 Legal Rights of Foreign Patients",
            desc: "Core statutory rights protected under the Medical Service Act of Korea.",
            rightsList: [
                { title: "Right to Choose & Informed Consent", desc: "Right to be fully informed about treatment risks, alternatives, and fee structures before signing." },
                { title: "Privacy & Confidentiality", desc: "Right to strictly guard medical records and passport details from unauthorized disclosure." },
                { title: "Right to Dispute Resolution", desc: "Right to petition the Korea Medical Dispute Mediation Agency (K-Medi) in case of malpractice or refund disputes." },
                { title: "Right to Verify Sponsor Agency", desc: "Right to confirm whether the inviting agency is officially registered with the Ministry of Justice." }
            ],
        },
        dispute: {
            title: "3 Steps of Medical Tourism Dispute Settlement",
            desc: "Authorized procedures to resolve disputes between foreign patients and hospitals in Korea.",
            steps: [
                { num: "1", title: "Direct Negotiation & Notice", desc: "Serve a formal Demand Letter raising claims for contract breaches, excessive fees, or side effects." },
                { num: "2", title: "Public Mediation & Arbitration", desc: "File an official complaint with K-Medi or the Korea Consumer Agency to facilitate settlement." },
                { num: "3", title: "Lawyer Advocacy & Remedy", desc: "Initiate litigation or administrative appeals against illegal visa denials (Emphasized)." }
            ],
        },
        services: {
            title: "Our Priority Services",
            desc: "Providing secure outcomes backed by actual litigation and administrative statistics.",
            list: [
                { title: "SNS Medical Ad Compliance", desc: "B2B Service. Pre-reviewing SNS marketing under the Medical Service Act to prevent administrative penalties.", path: "/en/hospital-compliance", badge: "Top Demand" },
                { title: "Visa Refusal & Remedy Support", desc: "Drafting formal complaints and representing administrative appeals against denied C-3-3/G-1-10 visas.", path: "/en/visa-refusal-remedy", badge: "Key Area" },
                { title: "Agency Registration Consultation", desc: "Guiding health organizations through patient attraction registration and premium agency status.", path: "/en/hospital-compliance", badge: "Recommended" },
                { title: "Criminal Defense (Illegal Brokerage)", desc: "Legal defense for alleged violations of illegal brokerage or patient attraction under the Medical Service Act.", path: "/en/legal-rights-disputes" },
                { title: "Tax & Financial Structuring", desc: "Structuring agent fees and VAT refunds transparently to minimize compliance risks.", path: "/en/hospital-compliance" },
                { title: "Malpractice Claims & Refund Remedies", desc: "Filing for refunds, claiming compensation for side effects, and representing patients in K-Medi mediations.", path: "/en/legal-rights-disputes" },
                { title: "IP Protection & Asset Structuring", desc: "Handling international trade contracts, trademarks, and cross-border asset structures for medical clients.", path: "/en/contact" }
            ],
        },
        ai: {
            title: "AI 1st-stage Free Diagnosis",
            desc: "Pre-assess your legal risks and visa options. (Final decisions are reviewed by attorneys)",
            patientTab: "For Patients / Guardians",
            hospitalTab: "For Hospitals / Agencies",
            submit: "Get Diagnosis Results",
            reset: "Reset Diagnosis",
            legalNotice: "* Note: This AI diagnosis is for general information only and does not constitute official legal advice.",
        },
        process: {
            title: "Our Process",
            desc: "Delivering optimal solutions through a highly structured 5-stage workflow.",
            steps: [
                { title: "1. Online Inquiry", desc: "Reach us easily via WhatsApp, LINE, or our secure online intake forms." },
                { title: "2. Document Upload", desc: "Share medical records, visa refusal notices, or contracts securely." },
                { title: "3. Legal Assessment", desc: "Attorneys, tax specialists, and visa agents formulate a combined analysis." },
                { title: "4. Strategy Formulation", desc: "We design optimized settlement contracts, petitions, or appeals." },
                { title: "5. Resolution & Report", desc: "Execution of advocacy, administrative representation, with live updates." }
            ]
        },
        faq: {
            title: "Frequently Asked Questions (FAQ)",
            desc: "Here are the most common questions regarding Korean medical visas and dispute remedies.",
            list: [
                { q: "My C-3-3 medical visa was denied. How can I re-apply?", a: "Immigration officers hold broad discretion. Re-applying with identical documents usually leads to secondary denial. You need a formal legal review of the denial reasons, corrected financial declarations, and an official explanation petition written by an authorized immigration agency like Kim&Hyun." },
                { q: "A patient wants a refund due to plastic surgery results. What is the legal procedure?", a: "First, verify if the duty of explanation (informed consent) was fully satisfied prior to surgery. If there is no negligence, it is usually best to draft a settlement agreement limiting future liability in exchange for partial refund, or undergo K-Medi mediation." },
                { q: "Are SNS advertisements targeted at foreign patients strictly regulated?", a: "Yes, any medical advertisement directed at foreign patients must undergo pre-review under Korean law. Unverified claims of results, guaranteed outcomes, or deceptive photos can result in administrative bans or suspension of licenses." }
            ]
        },
        contactForm: {
            title: "Submit Consultation Request",
            desc: "Your data is protected under attorney-client privilege. We will respond promptly.",
            name: "Name / Institution *",
            email: "Email Address *",
            phone: "Phone (with country code) *",
            channel: "Preferred Messenger (WhatsApp / WeChat / LINE ID)",
            message: "Case Details (Visa reason, dispute details, etc.) *",
            file: "Upload Supporting Documents (Passport, visa refusal, contract, etc.)",
            sensitiveConsent: "I consent to the collection, use, and cross-border transfer of my personal and sensitive (medical) information. *",
            sensitiveNotice: "All health data is processed solely for visa & dispute counseling and will be securely destroyed after closure.",
            submit: "Submit Request",
            sending: "Sending...",
            success: "Thank you. Your request has been logged. An attorney will contact you shortly via messenger."
        },
        disclaimer: {
            title: "Legal Disclaimer",
            text: "All information and AI assessments provided on this website are for general reference only and do not constitute official legal advice, a guarantee of visa issuance, or a promise of surgical/refund outcomes. Please consult Kim&Hyun Law Office directly for professional legal services tailored to your specific case. All medical and personal data is strictly protected under Korean privacy legislation."
        }
    },
    zh: {
        nav: {
            check: "签证评估",
            apply: "在线申请",
            blog: "律所博客",
            board: "问答板块",
            contact: "法律咨询",
        },
        hero: {
            badge: "金&贤 律师事务所 · 法务部登记出入境代办机构",
            title: "韩国医疗签证拒签申诉与整形退款纠纷解决",
            desc: "面向外国患者的医疗签证(C-3-3、G-1-10)拒签行政救济，以及医疗机构的SNS广告合规与患者退款纠纷解决。融合四大法定资质与出入境特许代办资格的综合法律方案。",
            ctaPatient: "签证拒签·退款维权在线诊断",
            ctaHospital: "医院广告与签证合规诊断",
        },
        trust: {
            title: "四大法定资质 & 法务部正式登记出入境事务代办机构",
            lawyer: "律师 诉讼及法律咨询",
            patent: "专利代理人 知识产权保护",
            tax: "税务师 税务筹划",
            wealth: "资产规划师 跨境资产配置",
            moj: "法务部特许出入境代办机构",
        },
        visa: {
            title: "韩国医疗观光签证制度",
            desc: "了解针对海外患者赴韩治疗及整容所需的签证种类及核心条件。",
            c33: {
                title: "C-3-3 (医疗观光签证)",
                desc: "90天以下的短期签证，适用于赴韩整形、美容及治疗。必须由具备资质的邀请机构提供保证书。",
            },
            g110: {
                title: "G-1-10 (长期治疗签证)",
                desc: "面向需要1年以上长期治疗或康复的患者及陪同家属的签证。延签需要提交非常详尽的医疗诊断与资金证明。",
            },
            regist: {
                title: "引荐机构注册",
                desc: "为在韩国合法招徕外国患者所需的保健福祉部注册提供合规法律服务。",
            },
            electronic: {
                title: "优秀机构电子签证",
                desc: "获指定为优秀引荐机构时，可享受在线代办及快速签发电子签证的便利。",
            },
        },
        rights: {
            title: "外国患者的四大法定权利",
            desc: "根据韩国《医疗法》，外国患者在韩接受医疗服务时享有以下核心权利：",
            rightsList: [
                { title: "知情同意权与选择权", desc: "在手术或治疗前，有权听取关于手术风险、替代方案及中介费结构的充分说明并签字。" },
                { title: "隐私与个人信息保护权", desc: "有权要求医疗机构对患者的病历及护照等个人信息进行严格保密，防止外泄。" },
                { title: "申请调解与索赔救济权", desc: "发生医疗事故或退款纠纷时，有权向韩国医疗纠纷调解仲裁院申请调解。" },
                { title: "核实邀请机构资质权", desc: "有权在入境前核实邀请您的中介是否为法务部登记的合法出入境代办机构。" }
            ],
        },
        dispute: {
            title: "医疗观光纠纷解决三步走",
            desc: "外国患者与韩国医院发生纠纷时合法有效的申诉流程：",
            steps: [
                { num: "1", title: "书面交涉与发送律师函", desc: "通过向医院发送正式存证信函（律师函），正式提出退款、赔偿及合同违约要求。" },
                { num: "2", title: "申请官方调解与仲裁", desc: "向韩国医疗纠纷调解仲裁院（K-Medi）或消费者院提交申请，由官方主持调解。" },
                { num: "3", title: "律师诉讼与行政救济", desc: "委托律师提起民事诉讼或刑事报案，或针对非法的签证拒签提起行政申诉（核心）。" }
            ],
        },
        services: {
            title: "优先法律服务项目",
            desc: "基于客观的行政处罚及诉讼数据，为客户提供最具确定性的法律解决方案。",
            list: [
                { title: "SNS医疗广告合规自查", desc: "B2B服务。依照韩国医疗法审查针对中国患者的微信、小红书广告，预防行政处罚。", path: "/zh/contact", badge: "医院首选" },
                { title: "医疗签证拒签行政救济", desc: "针对被拒签的C-3-3/G-1-10签证，起草正式申诉材料并代办申诉手续。", path: "/zh/visa-refusal-remedy", badge: "维权高频" },
                { title: "引荐资质注册与电子签证", desc: "代办保健福祉部引荐机构注册，并为优秀邀请机构的指定提供策略咨询。", path: "/zh/contact", badge: "优秀推荐" },
                { title: "非法中介刑事辩护", desc: "针对违反《医疗法》第27条第3款（禁止非法招徕与引荐）的指控提供刑事辩护。", path: "/zh/contact" },
                { title: "中介费与税务合规设计", desc: "与执业税务师合作，透明化代理费结构，规避退税取消及非法隐瞒收入的法律风险。", path: "/zh/contact" },
                { title: "整形退款与医疗纠纷调解", desc: "代理患者向医院索赔、申请退款，并在官方调解程序及民事诉讼中代表患者发言。", path: "/zh/refund-dispute", badge: "退款维权" },
                { title: "标准合同拟定与跨境资产", desc: "拟定多语种知情同意书，保护医疗品牌商标，以及合理规划跨境资金流向。", path: "/zh/contact" }
            ],
        },
        ai: {
            title: "AI 智能首期免费评估",
            desc: "在线自测您的签证及纠纷法律风险。（最终评估将由执业律师进行）",
            patientTab: "患者 / 家属评估入口",
            hospitalTab: "医院 / 引荐机构评估入口",
            submit: "获取评估结果",
            reset: "重新评估",
            legalNotice: "* 提示：本AI自测仅供一般信息参考，不构成正式的法律意见或保签证发行的承诺。",
        },
        process: {
            title: "服务流程",
            desc: "通过严谨、透明的五步法，为您争取最大的合法利益。",
            steps: [
                { title: "1. 在线咨询", desc: "通过微信、WhatsApp、LINE或网页表单，与我们取得联系。" },
                { title: "2. 提交文件", desc: "在保密协议下，安全上传病历、拒签通知书或中介合同。" },
                { title: "3. 律师联合研判", desc: "由律师、税务师及出入境代办专家进行多维度案情会审。" },
                { title: "4. 制定最佳方案", desc: "起草正式起诉状、律师交涉函或向法务部提交的拒签申诉书。" },
                { title: "5. 推进与结案", desc: "代办行政申诉或代理法庭辩论，定期向您汇报案件进展。" }
            ]
        },
        faq: {
            title: "常见问题解答 (FAQ)",
            desc: "整理了外国患者在韩接受治疗与签证申诉时最常遇到的问题。",
            list: [
                { q: "C-3-3医疗签证被拒签了，可以直接重新申请吗？", a: "韩国签证审批具有极高的行政自由裁量权。如果直接重新申请且材料无变化，极易遭遇二次拒签。必须由金&贤这类法定出入境代办机构对拒签理由书进行深入法律分析，补强资金来源及治疗的真实性，并随附正式申诉书进行申请。" },
                { q: "患者因整形效果不满意要求退款，医院该如何应对？", a: "首先需核实术前是否完全履行了知情同意（告知义务说明）。若无明确过失，建议起草具有法律约束力的和解协议，约定退还部分费用并免除后续一切民刑事责任，或通过官方调解解决，以防止负面舆论。" },
                { q: "在小红书、微信等社交媒体上投放面向外国患者的医疗广告违法吗？", a: "韩国对医疗广告监管极严，面向外国患者的广告同样须通过官方事前审议。虚假夸大宣传、保证手术效果、对比照滥用等均属于违法行为，可能导致医院被责令停业，发布前必须进行合规审查。" }
            ]
        },
        contactForm: {
            title: "预约法律咨询",
            desc: "您的所有咨询均受律师执业保密条款保护。我们将尽快与您联系。",
            name: "姓名 / 机构名称 *",
            email: "电子邮箱 *",
            phone: "联络电话 (含国家代码) *",
            channel: "首选社交软件 (微信 / WhatsApp / LINE ID)",
            message: "案件详情 (拒签原因、退款纠纷经过等) *",
            file: "上传相关文件 (护照、拒签单、手术同意书等)",
            sensitiveConsent: "我同意收集、使用及跨境传输我的个人信息及敏感（医疗/健康）信息。 *",
            sensitiveNotice: "所有医疗健康信息仅限用于签证与纠纷咨询，咨询结束后将进行安全销毁。",
            submit: "提交咨询",
            sending: "提交中...",
            success: "提交成功！律师将尽快通过您留下的社交软件账号与您取得联系。"
        },
        disclaimer: {
            title: "法律免责声明",
            text: "本网站上提供的所有信息和AI评估结果仅供一般参考，不构成正式的法律意见，亦不保证签证的签发或手术及退款的结果。在做出任何法律决策前，请务必直接咨询金&贤律师事务所的执业律师。我们根据韩国《个人信息保护法》对所有患者的病历及个人隐私进行最严格的保密。"
        }
    },
    ja: {
        nav: {
            check: "ビザ適性診断",
            apply: "申請書作成",
            blog: "ブログ",
            board: "掲示板",
            contact: "相談申込み",
        },
        hero: {
            badge: "金&賢 法律事務所 · 法務部登録出入国代行機関",
            title: "韓国医療ビザ拒否救済＆美容整形返金トラブル解決",
            desc: "外国人患者の医療ビザ(C-3-3、G-1-10)拒否時の行政救済から、医療機関のSNS広告審査および返金トラブルまで。4大国家資格と出入国代行登録を組み合わせたトータル法的ソリューション。",
            ctaPatient: "ビザ拒否·返金トラブル無料診断",
            ctaHospital: "病院広告＆ビザコンプライアンス診断",
        },
        trust: {
            title: "4大国家資格 & 法務部正式登録出入国業務代行機関",
            lawyer: "弁護士 法律相談·訴訟代理",
            patent: "弁理士 知的財産権保護",
            tax: "税理士 税務設計",
            wealth: "資産管理士 資産構造設計",
            moj: "法務部登録出入国代行機関",
        },
        visa: {
            title: "医療観光ビザ制度のご案内",
            desc: "外国人患者の誘致および治療に必要なビザの種類と手続きをご確認ください。",
            c33: {
                title: "C-3-3 (医療観光ビザ)",
                desc: "90日以内の短期治療や美容整形を目的とするビザ。誘致機関による招へい状および身元保証が必要です。",
            },
            g110: {
                title: "G-1-10 (長期治療ビザ)",
                desc: "1年以内の長期治療や療養が必要な患者および同伴家族のためのビザ。延長時には厳密な医療診断と資金の証明が必要です。",
            },
            regist: {
                title: "誘致業者登録",
                desc: "外国人患者を合法的に誘致するために必要な保健福祉部への登録要件および身元保証適合性へのアドバイス。",
            },
            electronic: {
                title: "優秀誘致機関電子ビザ",
                desc: "優秀誘致機関に指定された場合、オンラインで電子ビザを代理申請·迅速発給される特典を受けられます。",
            },
        },
        rights: {
            title: "外国人患者の4大法的権利",
            desc: "韓国の医療法上、外国人患者が保護されるべき核心的な権利です。",
            rightsList: [
                { title: "治療選択権および同意権", desc: "治療のリスク、代替案、仲介手数料について十分な説明を受け、同意する権利" },
                { title: "プライバシーおよび個人情報保護", desc: "医療情報やパスポート情報が外部に流出せず、厳格に秘密が保持される権利" },
                { title: "紛争調停および救済を求める権利", desc: "医療事故や返金トラブル発生時、医療紛争調停仲裁院に迅速に調停を申請する権利" },
                { title: "招へい機関の確認権利", desc: "合法的に登録された誘致機関（出入国代行機関）であるかを事前に確認する権利" }
            ],
        },
        dispute: {
            title: "医療観光トラブル解決の3ステップ",
            desc: "外国人患者と病院の間でトラブルが発生した際の合法的な解決手順です。",
            steps: [
                { num: "1", title: "直接交渉および書面通知", desc: "内容証明（通知書）の送付を通じ、契約不履行、過大手数料、副作用に対する補償を公式に提起" },
                { num: "2", title: "公的機関への調停申請", desc: "韓国医療紛争調停仲裁院（K-Medi）または消費者院への調停申請による合意形成" },
                { num: "3", title: "弁護士代理および行政救済", desc: "民事訴訟の代理、および不当なビザ拒否処分に対する行政審判·訴訟の提起（強調）" }
            ],
        },
        services: {
            title: "最優先サービス",
            desc: "客観的な指標と判例統計に基づき、最も確実な法的解決策を提示します。",
            list: [
                { title: "SNS医療広告コンプライアンス", desc: "B2B向け。医療法に基づくSNS広告の事前審議および不法誇大広告処分への事前対策。", path: "/ja/contact", badge: "病院推奨" },
                { title: "医療ビザ拒否·延長救済", desc: "不許可となったC-3-3/G-1-10ビザの不許可理由書を分析し、法務部へ提出する弁明書の作成代行。", path: "/ja/visa-refusal-remedy", badge: "高頻度" },
                { title: "誘致機関登録および電子ビザ", desc: "保健福祉部への外国人患者誘致登録手続き代行および電子ビザ発給要件の適合化アドバイス。", path: "/ja/contact", badge: "おすすめ" },
                { title: "不法紹介·あっせん刑事防衛", desc: "医療法第27条第3項（紹介·あっせんの禁止）違反容疑に対する刑事弁護および弁明支援。", path: "/ja/contact" },
                { title: "手数料および税務スキーム設計", desc: "税理士協働。手数料比率の透明化および免税還付終了後の税務調査リスクへの事前対策。", path: "/ja/contact" },
                { title: "返金請求および医療トラブル解決", desc: "施術副作用の損害賠償請求、整形施術費用の返金調停申請および民事代理。", path: "/ja/refund-dispute", badge: "返金トラブル" },
                { title: "標準契約書作成および知的財産", desc: "弁理士連携。施術同意書のリーガルチェック、医療ブランド商標登録、海外送金資産の法適合化。", path: "/ja/contact" }
            ],
        },
        ai: {
            title: "AI 無料1次適性診断",
            desc: "法的規制リスクと解決策を事前に無料でチェックしてください。（最終判断は弁護士が行います）",
            patientTab: "患者 / 保護者向け診断",
            hospitalTab: "病院 / 誘致業者向け診断",
            submit: "診断結果を見る",
            reset: "もう一度診断する",
            legalNotice: "※本診断は一般的な参考情報の提供を目的としており、正式な法律相談ではありません。",
        },
        process: {
            title: "業務進行プロセス",
            desc: "透明で体系的な5ステップの手順を通じて、最善の解決に導きます。",
            steps: [
                { title: "1. オンラインお問い合わせ", desc: "LINE、WhatsApp、またはWEBフォームから簡単にお問い合わせいただけます。" },
                { title: "2. 必要書類のアップロード", desc: "セキュリティを確保したチャネルで、カルテ、拒否通知書、契約書などを安全に共有します。" },
                { title: "3. 1次リーガルチェック", desc: "弁護士、税理士、出入国代行実務者による多角的な事案分析を実施します。" },
                { title: "4. 個別戦略の立案", desc: "和解書、異議申立書、または法務部宛ての疎明書の最適な案を作成します。" },
                { title: "5. 事件の解決とご報告", desc: "交渉の代理、行政代行の実行、進行状況をリアルタイムでご報告します。" }
            ]
        },
        faq: {
            title: "よくある質問 (FAQ)",
            desc: "外国人患者の誘致および医療ビザ申請について、よくあるご質問をまとめました。",
            list: [
                { q: "C-3-3ビザが拒否されました。再申請は可能ですか？", a: "ビザの発給可否は審査官の裁量が大きいため、同じ書類で再申請すると再び拒否される可能性が極めて高いです。不許可の理由を法的に分析し、資金の透明性や治療の必要性を補強した上で、法務部登録機関である弊社名義の弁明疎明書を添付して再申請する必要があります。" },
                { q: "患者が美容整形の施術結果に不満で返金を求めています。どうすべきですか？", a: "まず、術前に説明義務（同意書の取得）を尽くしたかを確認する必要があります。過失がない場合、一部返金と引き換えに将来の民事·刑事上の請求権を放棄させる合意書を適正に作成するか、公的な紛争調停を活用するのが賢明です。" },
                { q: "外国人患者向けのSNS広告について気をつけるべき規制はありますか？", a: "韓国の医療法上、外国人向けであっても医療広告は事前審議の対象です。施術効果の誇張、過度な割引の明示、治療前後の写真の悪用などは行政処分の対象となるため、事前にリーガルチェックを受けることを強くお勧めします。" }
            ]
        },
        contactForm: {
            title: "法律相談の申込み",
            desc: "守秘義務に基づき、お客様の個人情報は厳重に保護されます。お気軽にご相談ください。",
            name: "お名前 / 貴社名 *",
            email: "メールアドレス *",
            phone: "電話番号 (国番号含む) *",
            channel: "連絡可能なメッセンジャー (LINE / WhatsApp / WeChat ID)",
            message: "相談内容 (ビザ拒否理由、トラブル内容など) *",
            file: "関連書類のアップロード (パスポート、不許可通知、同意書など)",
            sensitiveConsent: "個人情報および敏感情報(医療·健康情報)の収集·利用·国外移転に同意します。 *",
            sensitiveNotice: "医療ビザ申請および紛争解決の目的に限り処理され、相談終了後は安全に破棄されます。",
            submit: "送信する",
            sending: "送信中...",
            success: "送信が完了しました。担当弁護士より登録されたメッセンジャーへ速やかにご連絡いたします。"
        },
        disclaimer: {
            title: "免責事項",
            text: "本ウェブサイト上のすべての情報およびAI診断結果は、一般的な参考情報であり、正式な法律相談やビザ発給の保証、治療結果の約束を意味するものではありません。具体的な意思決定の前に、必ず金&賢法律事務所の弁護士への公式相談を行ってください。また、提供された医療情報は個人情報保護法に基づき厳重に秘密管理されます。"
        }
    }
};

// AI Diagnosis Config
export const AI_DIAGNOSIS_QUESTIONS = {
    patient: [
        {
            id: 'category',
            label: {
                ko: "현재 처한 가장 큰 문제가 무엇입니까?",
                en: "What is your main issue?",
                zh: "您目前面临的最大问题是什么？",
                ja: "現在直면한最も大きな問題は何ですか？"
            },
            options: [
                { value: 'visa_denial', label: { ko: "의료비자(C-3-3/G-1-10) 신청 거부 또는 연장 실패", en: "Visa refusal or extension failure", zh: "医疗签证拒签或延签失败", ja: "医療ビザ拒否または延長失敗" } },
                { value: 'refund_dispute', label: { ko: "성형·치료비 환불 및 수수료 취소 요구", en: "Refund or agent fee cancel request", zh: "整形/治疗费退款及中介费纠纷", ja: "整形·治療費返金や手数料トラブル" } },
                { value: 'side_effect', label: { ko: "수술/치료 부작용 및 의료 과실 발생", en: "Side effect or medical malpractice", zh: "手术副作用及医疗过失", ja: "施術の副作用や医療ミスの発生" } },
                { value: 'illegal_ad', label: { ko: "허위·과장 광고 또는 이중가격 피해", en: "Deceptive advertising or double pricing", zh: "虚假广告或双重价格欺诈", ja: "虚偽広告や二重価格の被害" } }
            ]
        },
        {
            id: 'evidence',
            label: {
                ko: "확보하고 있는 증빙 서류는 무엇입니까?",
                en: "What supporting documents do you have?",
                zh: "您目前有哪些证据材料？",
                ja: "お持ちの証明書類は何ですか？"
            },
            options: [
                { value: 'full_docs', label: { ko: "영수증, 진료기록부, 거부 통지서 모두 있음", en: "Receipt, medical chart, denial notice all present", zh: "收据、病历、拒签信均齐全", ja: "領収書、カルテ、拒否通知すべてあり" } },
                { value: 'partial_docs', label: { ko: "메시지 대화록, 사진 등 일부만 있음", en: "Chat messages, photos (partial)", zh: "仅有聊天记录、照片等部分证据", ja: "チャット履歴、写真など一部のみあり" } },
                { value: 'no_docs', label: { ko: "증빙할 수 있는 서류가 없음", en: "No documents available", zh: "没有任何证明材料", ja: "証明できる書類が何もない" } }
            ]
        }
    ],
    hospital: [
        {
            id: 'category',
            label: {
                ko: "어떤 리스크 진단이 필요하십니까?",
                en: "What compliance assessment is required?",
                zh: "您需要进行哪项风险合规诊断？",
                ja: "どのようなリスク診断が必要ですか？"
            },
            options: [
                { value: 'sns_ad', label: { ko: "SNS(인스타그램, 위챗 등) 의료광고 심의 준수 여부", en: "SNS medical ad pre-review audit", zh: "小红书/微信医疗广告合规自查", ja: "SNS医療広告の審査適合判定" } },
                { value: 'attract_reg', label: { ko: "외국인 환자 유치기관 등록 자격 조건", en: "Patient attraction agency registration", zh: "外国患者引荐机构注册资质", ja: "外国人患者誘致業者の登録要件" } },
                { value: 'dispute_defense', label: { ko: "환자의 부작용 환불 요구 및 의료분쟁 방어", en: "Patient refund claim & malpractice defense", zh: "患者因副作用索赔及纠纷防范", ja: "患者からの返金請求および医療紛争防衛" } },
                { value: 'tax_audit', label: { ko: "알선수수료 신고 및 부가세 사후 환급 세무 리스크", en: "Agent commissions & VAT refund tax compliance", zh: "中介代理费与附加税退税税务合规", ja: "あっせん手数料と免税還付の税務リスク" } }
            ]
        },
        {
            id: 'history',
            label: {
                ko: "관련 처분 또는 분쟁 이력이 있습니까?",
                en: "Have you faced prior legal disputes or penalties?",
                zh: "此前是否有过处罚或纠纷历史？",
                ja: "関連する処分や紛争履歴はありますか？"
            },
            options: [
                { value: 'never', label: { ko: "전혀 없음 (사전 예방 목적)", en: "None (for prevention)", zh: "完全没有（旨在事前预防）", ja: "全くなし（事前予防目的）" } },
                { value: 'ongoing', label: { ko: "현재 분쟁 진행 중이거나 경고를 받음", en: "Currently ongoing or received warning", zh: "目前有纠纷正在进行或收到警告", ja: "現在トラブル中、または警告を受けた" } }
            ]
        }
    ]
};

export const DIAGNOSIS_RESULTS = {
    ko: {
        visa_denial: {
            title: "의료비자 행정구제 처방",
            law: "출입국관리법 제11조(입국의 금지 등) 및 동법 시행규칙 적용",
            remedy: "비자 불허 처분 사유를 서면 분석하여 불복 기간(90일 이내) 내 행정심판 청구 또는 재정 보증 서류 재구성 후 법무부 대행 소명서 제출 권장."
        },
        refund_dispute: {
            title: "수수료 및 성형비 환불 조정 처방",
            law: "의료법 제27조의2(외국인환자 유치에 대한 등록 등) 및 소비자보호법 적용",
            remedy: "의료 행위 자체의 계약 불이행을 구성하는 서면 고지 위반(설명의무 미흡)을 분석하여, K-Medi 공식 조정 신청 대리 권장."
        },
        side_effect: {
            title: "의료사고 손해배상 처방",
            law: "민법 제750조(불법행위의 내용) 및 의료사고피해구제법 적용",
            remedy: "진료기록부 전격 감정을 통해 병원의 고지 의무 위반 및 시술 상 과실 비율을 추정하여, 형사 고소 검토 및 민사 배상 합의서 작성 권장."
        },
        illegal_ad: {
            title: "SNS 불법 광고/과장 광고 피해 대처",
            law: "의료법 제56조(의료광고의 금지 등) 위반 여부 적용",
            remedy: "사전 심의를 거치지 않은 광고 채널 캡처 및 유도 수수료 내역을 문서화하여 행정 당국에 고발 조치 또는 합의 환불 유도."
        },
        sns_ad: {
            title: "SNS 광고 컴플라이언스 처방",
            law: "의료법 제56조제2항(사전심의 대상 의료광고) 적용",
            remedy: "서울행정법원 2024구합74779 판결 기준 적용. 미심의 SNS 광고물은 업무정지 리스크가 있으므로 사전 리뷰 컴플라이언스 계약 체결 권장."
        },
        attract_reg: {
            title: "외국인 환자 유치자격 검토",
            law: "의료 해외진출 및 외국인환자 유치 지원에 관한 법률 제6조 적용",
            remedy: "보건복지부 등록 요건(자본금 1억 이상, 보증보험 1억 이상 가입 등) 적격 검토 및 유치 실적 보고 지침 세무 패키지 제공."
        },
        dispute_defense: {
            title: "환자 컴플레인 방어 처방",
            law: "의료법 제24조의2(의료행위에 관한 설명) 적용",
            remedy: "설명의무 동의 서식의 완결성을 사전 검토하고, 분쟁 시 제3자 누설 방지 조항(부제소 특약)이 포함된 공식的和解 계약서 작성 권장."
        },
        tax_audit: {
            title: "알선수수료 신고 세무 리스크 처방",
            law: "부가가치세법 및 외국인환자 메디컬택스 세무지침 적용",
            remedy: "알선 중개수수료의 적정성(법정 상한 제한) 검토 및 세금계산서 정밀 발급 구조 자문. 세무조사 대비 정밀 컨설팅 권장."
        }
    },
    en: {
        visa_denial: {
            title: "Visa Refusal Legal Remedy",
            law: "Under Article 11 of the Immigration Control Act & Enforcement Regulations",
            remedy: "Analyze the official denial reasons. We recommend filing a formal Administrative Appeal within 90 days or drafting a professional sponsor statement under our authorized immigration agency status."
        },
        refund_dispute: {
            title: "Fee Refund & Mediation Remedy",
            law: "Under Article 27-2 of the Medical Service Act & Consumer Protection Act",
            remedy: "Review whether the duty of explanation (informed consent) was breached. We recommend filing a formal dispute mediation with K-Medi to seek a legal refund."
        },
        side_effect: {
            title: "Malpractice Damage Claim",
            law: "Under Article 750 of the Civil Act & Malpractice Relief Act",
            remedy: "Perform a medical chart audit to assess negligence and informed consent breaches. We recommend filing civil compensation actions or structured settlement mediation."
        },
        illegal_ad: {
            title: "Deceptive Marketing Action",
            law: "Under Article 56 of the Medical Service Act",
            remedy: "Document unreviewed marketing pages and inflated broker commission ledger to seek full refund through regulatory notice or formal settlement negotiation."
        },
        sns_ad: {
            title: "SNS Marketing Compliance Solution",
            law: "Under Article 56(2) of the Medical Service Act",
            remedy: "Based on Seoul Administrative Court Case 2024Guhap74779. Unreviewed SNS materials risk suspension of hospital license. Monthly compliance retainer is advised."
        },
        attract_reg: {
            title: "Attraction Registration Qualification Check",
            law: "Under Article 6 of the Act on Support for Overseas Medical Expansion & Patient Attraction",
            remedy: "Verify the Health Ministry registration criteria (capitalization, warranty insurance, etc.) and audit compliance on official annual attraction performance logs."
        },
        dispute_defense: {
            title: "Malpractice Claim & Complaint Defense",
            law: "Under Article 24-2 of the Medical Service Act (Explanation Obligation)",
            remedy: "Review the surgical consent forms. We recommend drafting settlement templates with non-disclosure (NDA) and non-litigation (no-sue) covenants in case of refunds."
        },
        tax_audit: {
            title: "Broker Commission Tax Compliance",
            law: "Under the Value Added Tax Act & Medical Tax Guidelines",
            remedy: "Audit agent fee rates against statutory caps. Structure clean VAT invoices to mitigate tax auditing and criminal liability for shadow accounting."
        }
    },
    zh: {
        visa_denial: {
            title: "医疗签证拒签行政申诉对策",
            law: "适用韩国《出入境管理法》第11条（禁止入境等）及施行规则",
            remedy: "书面分析拒签原因，建议在90天复议期内提起正式“行政审判”，或由金&贤特许出入境代办机构名义起草并提交法务部申诉声明书。"
        },
        refund_dispute: {
            title: "手术费/中介费退款调解对策",
            law: "适用韩国《医疗法》第27条之2（招徕外国患者注册等）及《消费者保护法》",
            remedy: "审查院方是否违反“知情告知义务”（如未说明手续费及风险），建议代理向韩国医疗纠纷调解仲裁院（K-Medi）申请官方退款调解。"
        },
        side_effect: {
            title: "医疗事故人身损害索赔对策",
            law: "适用韩国《民法》第750条（侵权行为）及《医疗事故受害者救济法》",
            remedy: "对病历进行全面鉴定，确定院方是否存在医疗过失及告知不足，建议代理民事索赔和解交涉，或提起刑事诉讼。"
        },
        illegal_ad: {
            title: "非法广告/价格欺诈应对对策",
            law: "适用韩国《医疗法》第56条（禁止医疗广告等）规定",
            remedy: "将未经审议的社交媒体广告及双重计费证据进行公证，向卫生监督部门进行举报，以此向院方施压进行退款和解。"
        },
        sns_ad: {
            title: "SNS广告合规处方",
            law: "适用韩国《医疗法》第56条第2款（需事前审议的医疗广告）",
            remedy: "适用首尔行政法院2024Guhap74779判决基准。未经审议的SNS广告面临停业整顿风险，建议签署月度合规常年法律顾问契约。"
        },
        attract_reg: {
            title: "外国患者引荐资质审查",
            law: "适用韩国《支持医疗海外拓展及招徕外国患者相关法律》第6条",
            remedy: "审核保健福祉部设立条件（1亿韩元注册资本、1亿韩元保证保险等）并建立招徕业绩定期申报税务合规体系。"
        },
        dispute_defense: {
            title: "患者索赔防御对策",
            law: "适用韩国《医疗法》第24条之2（医疗行为说明义务）",
            remedy: "合规审查手术同意书，在退款时建议草拟包含“禁止提起诉讼（不提起诉讼特约）”及“禁止泄露秘密”的正式和解协议。"
        },
        tax_audit: {
            title: "招徕代理费税务合规处方",
            law: "适用韩国《增值税法》及医疗税务指引",
            remedy: "核查招徕代理费比例是否超出法定上限，规范发票开具结构，防范未来因暗箱操作引发的税务调查风险。"
        }
    },
    ja: {
        visa_denial: {
            title: "医療ビザ拒否に対する行政救済策",
            law: "韓国『出入国管理法』第11条（入国の禁止等）および同法施行規則の適用",
            remedy: "ビザ不許可処分通知書を分析し、不服申立期間（90日以内）に行政審判を請求するか、法務部登録代行機関名義の疎明書を添付して再申請することを推奨します。"
        },
        refund_dispute: {
            title: "施術費用·手数料返金調停策",
            law: "韓国『医療法』第27条の2（外国人患者誘致登録等）および消費者保護法の適用",
            remedy: "説明義務（インフォームドコンセント）の不履行または手数料構造の不開示を分析し、K-Mediへの公式な調停申請の代理を推奨します。"
        },
        side_effect: {
            title: "医療事故·副作用損害賠償策",
            law: "韓国『民法』第750条（不法行為の内容）および医療事故被害救済法の適用",
            remedy: "カルテの鑑定を行い、医師の説明義務違反や過失割合を推定の上、示談合意書（権利放棄特約付き）の作成および民事賠償交渉の代理を推奨します。"
        },
        illegal_ad: {
            title: "不法·虚偽SNS広告被害への対抗策",
            law: "韓国『医療法』第56조（医療広告の禁止等）の適用",
            remedy: "事前審議を経ていない広告や違法手数料の送金記録を文書化し、監督官庁への告発を通じた示談返金交渉の実行を推奨します。"
        },
        sns_ad: {
            title: "SNS広告コンプライアンス対策",
            law: "韓国『医療法』第56条第2項（事前審議対象医療広告）の適用",
            remedy: "ソウル行政法院2024Guhap74779判例を適用。未審議のSNS広告は業務停止リスクがあるため、月額顧問契約による事前リーガルチェックを推奨します。"
        },
        attract_reg: {
            title: "外国人患者誘致業者の適合性判定",
            law: "韓国『医療海外進出および外国人患者誘致支援に関する法律』第6条の適用",
            remedy: "保健福祉部登録要件（資本金1億ウォン、保証保険1億ウォン等）の適合判定、および毎年の誘致実績報告に向けた税務管理パッケージを提供。"
        },
        dispute_defense: {
            title: "患者クレーマー防衛策",
            law: "韓国『医療法』第24条の2（医療行為に関する説明）の適用",
            remedy: "同意書フォーマットの法的効力を事前診断し、返金時には第3者への口外禁止·不提訴特約を含む公式な示談合意書作成を推奨します。"
        },
        tax_audit: {
            title: "紹介手数料申告の税務コンプライアンス",
            law: "韓国『付加価値税法』および外国人患者医療税務のガイドライン適用",
            remedy: "あっせん手数料率の法上限チェック、および適正な税金計算書の発行構造の構築。税務調査に備えたコンサルティングを推奨します。"
        }
    }
};
