export type SupportedLang = 'ko' | 'en' | 'zh' | 'ja';

export const TRANSLATIONS = {
  "ko": {
    "nav": {
      "check": "자격 자가 진단",
      "apply": "신청서 작성",
      "blog": "블로그",
      "board": "게시판",
      "contact": "상담 신청"
    },
    "hero": {
      "badge": "김앤현 법률사무소 · 법무부 출입국대행 기관",
      "title": "대한민국 의료관광 비자 및 분쟁구제 지원",
      "desc": "의료비자 신청·불허 사유, 환자 분쟁과 의료광고의 적용 규정을 자료에 따라 검토합니다. 변호사·세무사·변리사 자격과 출입국민원 대행기관 등록에 관한 확인 정보를 소개합니다.",
      "ctaPatient": "의료비자·분쟁 상담 준비",
      "ctaHospital": "병원 광고 & 비자 진단"
    },
    "trust": {
      "title": "변호사·세무사·변리사·자산관리사 자격과 출입국민원 대행기관 등록",
      "lawyer": "변호사 법률자문 및 쟁송",
      "patent": "변리사 지식재산 보호",
      "tax": "세무사 세무 설계",
      "wealth": "자산관리사 자산구조 설계",
      "moj": "법무부 출입국민원 대행기관 등록"
    },
    "visa": {
      "title": "의료관광 비자 제도 안내",
      "desc": "외국인 환자 유치 및 치료를 위한 최적의 비자 종류와 절차를 확인하세요.",
      "c33": {
        "title": "C-3-3 (메디컬 비자)",
        "desc": "치료·의료관광 목적의 단기체류로 최대 90일 범위에서 심사합니다. 환자 본인 신청과 등록 유치기관을 통한 신청 경로를 구분하며, 초청·보증 서류는 경로별로 확인합니다."
      },
      "g110": {
        "title": "G-1-10 (치료·요양 비자)",
        "desc": "장기 치료·요양이 필요한 환자와 해당 동반 가족의 체류를 검토합니다. 공식 안내상 1년 이내이며 실제 허가기간과 연장 요건은 치료계획 등으로 심사합니다."
      },
      "regist": {
        "title": "유치업자/기관 등록",
        "desc": "외국인환자 유치 활동에 필요한 등록과 업무 범위를 확인합니다. 유치기관 등록과 법무부 출입국민원 대행기관 등록은 서로 다릅니다."
      },
      "electronic": {
        "title": "우수기관 전자비자",
        "desc": "우수 유치기관으로 지정될 경우, 대리 신청 및 온라인 전자비자 발급 혜택을 제공받을 수 있습니다."
      }
    },
    "rights": {
      "title": "의료·계약·개인정보 관련 권리와 준비자료",
      "desc": "진료 설명·동의, 개인정보, 분쟁 해결 및 기관 등록 확인을 사안에 맞게 검토합니다.",
      "rightsList": [
        {
          "title": "진료 선택 및 고지 동의권",
          "desc": "치료·동의 자료와 수수료 계약을 확인합니다. 의료법상 설명·서면동의 범위와 민사상 책임을 구분합니다."
        },
        {
          "title": "비밀 보장 및 개인정보권",
          "desc": "의료 정보 및 여권 정보가 외부에 유출되지 않고 엄격하게 비밀이 보장될 권리"
        },
        {
          "title": "조정 신청 및 구제권",
          "desc": "의료 사고나 환불 분쟁 발생 시 의료분쟁조정중재원에 신속하게 조정을 신청할 권리"
        },
        {
          "title": "대행기관 확인 권리",
          "desc": "외국인환자 유치 등록과 출입국민원 대행 등록을 구별하고 맡길 업무에 필요한 등록 여부를 확인합니다."
        }
      ]
    },
    "dispute": {
      "title": "의료관광 분쟁 해결 3단계",
      "desc": "외국인 환자와 병원 간 분쟁 발생 시 합법적이고 신속한 해결 절차입니다.",
      "steps": [
        {
          "num": "1",
          "title": "직접 협상 및 서면 통지",
          "desc": "내용증명 송달을 통해 계약 불이행, 과다 수수료, 부작용에 대한 배상 공식 제기"
        },
        {
          "num": "2",
          "title": "공공조정 및 중재 신청",
          "desc": "한국의료분쟁조정중재원(K-Medi) 또는 소비자원에 조정 신청을 통해 합의 유도"
        },
        {
          "num": "3",
          "title": "변호사 대리 및 행정구제",
          "desc": "접수 경로와 통지 종류에 맞춰 재신청·보완·불복 가능성을 검토합니다."
        }
      ]
    },
    "services": {
      "title": "우선순위 서비스",
      "desc": "자료와 적용 절차를 검토하고, 업무 범위와 비용을 수임 전에 설명합니다. 비자 허가나 분쟁 결과를 보장하지 않습니다.",
      "list": [
        {
          "title": "SNS 의료광고 컴플라이언스",
          "desc": "의료광고의 사전심의 필요 여부, 금지 표현, 심의 내용과 실제 집행의 일치 여부를 검토하고 처분 통지에 대응합니다.",
          "path": "/ko/sns-medical-ad-compliance",
          "badge": "의료광고"
        },
        {
          "title": "의료비자 거부·연장 행정구제",
          "desc": "접수 경로와 통지 종류에 맞춰 재신청·보완·불복 가능성을 검토합니다.",
          "path": "/ko/medical-visa-remedy",
          "badge": "비자 불허"
        },
        {
          "title": "유치업자 등록 및 전자비자",
          "desc": "시·도지사 유치 등록의 요건·갱신과 별도 전자비자 대리신청 요건을 검토합니다.",
          "path": "/ko/attraction-registration",
          "badge": "추천"
        },
        {
          "title": "불법 알선 형사 방어",
          "desc": "등록, 실제 소개·알선 행위, 적용 법률을 확인하고 혐의와 처분 내용에 대응합니다.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "수수료 및 세무 설계",
          "desc": "수수료 계약, 매출·비용 증빙과 적용 세법을 확인합니다. 환급 가능 여부는 거래와 적용 시점에 따라 별도로 검토합니다.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "환불 대리 및 분쟁 해결",
          "desc": "환자 부작용 배상 청구, 성형 수술비 환불 조정 신청 및 민사 대리.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "표준 계약 및 자산 설계",
          "desc": "변리사·자산관리사 결합. 다국어 동의서 작성, 의료 상표 지식재산권, 국외 자산 구조 설계.",
          "path": "https://open.kakao.com/o/saviVYPi"
        }
      ]
    },
    "ai": {
      "title": "상담 전 준비자료 안내",
      "desc": "비자 통지서, 진료·예약 자료와 계약·결제 기록을 준비하세요. 개별 법률 검토의 범위와 상담료는 사전에 안내합니다.",
      "patientTab": "환자 / 보호자용 진단",
      "hospitalTab": "병원 / 유치기관용 진단",
      "submit": "진단 결과 보기",
      "reset": "다시 진단하기",
      "legalNotice": "※ 이 안내는 법률·의료 진단이나 비자 허가 판정이 아닙니다. 자료 전달 방법을 안내받기 전에는 여권·진료기록 등 민감한 정보를 보내지 마세요."
    },
    "process": {
      "title": "수임 진행 절차",
      "desc": "상담, 자료 검토, 대응 방안 협의, 위임 업무 수행, 결과 안내 순서로 진행합니다.",
      "steps": [
        {
          "title": "1. 온라인 문의",
          "desc": "전화 또는 카카오톡으로 상담 방식과 비용을 확인합니다."
        },
        {
          "title": "2. 문서 및 증거 업로드",
          "desc": "자료 전달 방법을 안내받은 뒤 필요한 범위의 기록을 공유합니다."
        },
        {
          "title": "3. 1차 법률 검토",
          "desc": "처분·진료·계약 자료를 검토하고 필요한 추가 자료를 안내합니다."
        },
        {
          "title": "4. 맞춤 전략 수립",
          "desc": "가능한 절차와 범위·보수를 협의하고 서면으로 정합니다."
        },
        {
          "title": "5. 업무 수행과 결과 안내",
          "desc": "위임 범위에서 절차를 수행하고 진행 상황과 결과를 설명합니다. 처리 기간과 결과를 보장하지 않습니다."
        }
      ]
    },
    "faq": {
      "title": "자주 묻는 질문 (FAQ)",
      "desc": "외국인 환자 유치 및 의료 비자 관련하여 가장 자주 묻는 질문들을 모았습니다.",
      "list": [
        {
          "q": "C-3-3 비자가 거부되었습니다. 다시 신청하려면 어떻게 하나요?",
          "a": "불허 통지, 신청 유형, 제출자료와 체류기한부터 확인합니다. 거부 사유에 맞는 보완·재신청 또는 불복 가능성을 검토하며, 대행기관 명의 서면이 모든 신청의 필수 요건은 아닙니다."
        },
        {
          "q": "환자가 성형 부작용으로 환불을 요구합니다. 어떻게 대응해야 하나요?",
          "a": "설명의무, 진료 과정, 인과관계, 계약과 결제 기록을 확인합니다. 부작용만으로 과실·환불 의무를 단정하지 않으며 협의, 의료분쟁 조정 또는 소송의 적합성과 합의 범위를 검토합니다."
        },
        {
          "q": "SNS에 해외 환자 유치 목적의 광고를 올릴 때 주의할 점은 무엇인가요?",
          "a": "광고 내용의 금지사항과 의료법 제57조의 사전심의 대상을 구분합니다. 매체의 법정 요건, 광고 내용·방식, 예외와 해외 집행 조건을 개별 확인하며 모든 SNS 게시물이 자동으로 심의 대상이라고 단정하지 않습니다."
        }
      ]
    },
    "contactForm": {
      "title": "법률 상담 신청",
      "desc": "안전하고 비밀이 보장되는 1:1 창구를 통해 신속히 답변해 드리겠습니다.",
      "name": "성함 / 기관명 *",
      "email": "이메일 주소 *",
      "phone": "연락처 (국가번호 포함) *",
      "channel": "선호하는 메신저 (WhatsApp / WeChat / LINE ID)",
      "message": "상담 요청 내용 (비자 사유, 분쟁 내용 등) *",
      "file": "관련 서류 업로드 (여권, 거부통지서, 진료동의서 등)",
      "sensitiveConsent": "개인정보 및 민감정보(의료·건강정보) 수집·이용 및 국외이전에 동의합니다. *",
      "sensitiveNotice": "의료 비자 및 분쟁 자문 목적에 한정하여 처리하며, 상담 종료 후 안전하게 파기됩니다.",
      "submit": "상담 접수 완료",
      "sending": "접수 중...",
      "success": "성공적으로 상담이 접수되었습니다. 담당 변호사가 신속히 메신저로 연락드리겠습니다."
    },
    "disclaimer": {
      "title": "법적 면책 고지 (Disclaimer)",
      "text": "본 웹사이트에서 제공되는 모든 정보 및 상담 준비 안내는 대한민국 법령에 기반한 일반적인 참고 자료일 뿐이며, 어떠한 경우에도 정식 법률 자문이나 비자 발급 보장, 치료/환불 결과에 대한 약속을 의미하지 않습니다. 구체적인 사안에 대한 의사결정 전에 반드시 김앤현 법률사무소의 변호사 등 공인된 자격사와의 대면 또는 공식 자문을 거치시기 바랍니다. 관련하여 제공된 건강·의료 정보는 개인정보 보호법에 의거하여 비밀을 엄격하게 유지합니다."
    }
  },
  "en": {
    "nav": {
      "check": "Eligibility Check",
      "apply": "Fill Application",
      "blog": "Blog",
      "board": "Q&A Board",
      "contact": "Consultation"
    },
    "hero": {
      "badge": "Kim&Hyun Law Office · Registered Immigration Agency",
      "title": "Korea Medical Visa & Dispute Legal Support",
      "desc": "Review medical visa applications and refusals, patient disputes and medical advertising rules against the relevant records. Attorney, tax and patent qualifications and immigration agency registration are described separately.",
      "ctaPatient": "Prepare Your Consultation",
      "ctaHospital": "Hospital Compliance Assessment"
    },
    "trust": {
      "title": "Professional Credentials & Authorized Immigration Services",
      "lawyer": "Attorney Legal Representation",
      "patent": "Patent Attorney IP Protection",
      "tax": "Tax Accountant Structuring",
      "wealth": "Wealth Management Structuring",
      "moj": "Registered Immigration Application Agency"
    },
    "visa": {
      "title": "Medical Tourism Visa System",
      "desc": "Choose the right visa type and discover the requirements for medical tourism in Korea.",
      "c33": {
        "title": "C-3-3 (Medical Tour Visa)",
        "desc": "Short-term medical treatment or tourism, with a stay of up to 90 days subject to assessment. Distinguish direct patient applications from applications through registered facilitators; invitation and guarantee documents depend on the route."
      },
      "g110": {
        "title": "G-1-10 (Medical Treatment)",
        "desc": "For extended treatment or recuperation and qualifying accompanying family. Official guidance describes a stay within one year; the actual period and extension depend on the treatment plan and applicable requirements."
      },
      "regist": {
        "title": "Agency Registration",
        "desc": "Review registration required for foreign-patient attraction activities. Health-sector facilitator registration and Ministry of Justice immigration agency registration are different."
      },
      "electronic": {
        "title": "E-Visa for Premium Partners",
        "desc": "Premium registered institutions are granted streamlined online E-visa processing."
      }
    },
    "rights": {
      "title": "Patient rights and documents to review",
      "desc": "Review treatment consent, privacy, dispute-resolution options and agency registration under the rules relevant to the matter.",
      "rightsList": [
        {
          "title": "Right to Choose & Informed Consent",
          "desc": "Review treatment and consent records separately from the fee contract, and distinguish statutory consent duties from civil liability."
        },
        {
          "title": "Privacy & Confidentiality",
          "desc": "Right to strictly guard medical records and passport details from unauthorized disclosure."
        },
        {
          "title": "Right to Dispute Resolution",
          "desc": "Right to petition the Korea Medical Dispute Mediation Agency (K-Medi) in case of malpractice or refund disputes."
        },
        {
          "title": "Right to Verify Sponsor Agency",
          "desc": "Distinguish foreign-patient facilitator registration from immigration agency registration and check the registration required for the intended service."
        }
      ]
    },
    "dispute": {
      "title": "3 Steps of Medical Tourism Dispute Settlement",
      "desc": "Authorized procedures to resolve disputes between foreign patients and hospitals in Korea.",
      "steps": [
        {
          "num": "1",
          "title": "Direct Negotiation & Notice",
          "desc": "Serve a formal Demand Letter raising claims for contract breaches, excessive fees, or side effects."
        },
        {
          "num": "2",
          "title": "Public Mediation & Arbitration",
          "desc": "File an official complaint with K-Medi or the Korea Consumer Agency to facilitate settlement."
        },
        {
          "num": "3",
          "title": "Lawyer Advocacy & Remedy",
          "desc": "Review supplementary evidence, a fresh application or remedies according to the application route and decision."
        }
      ]
    },
    "services": {
      "title": "Our Priority Services",
      "desc": "We review the documents, explain available procedures and agree the scope and fees before engagement. Outcomes depend on the facts and the competent authority.",
      "list": [
        {
          "title": "SNS Medical Ad Compliance",
          "desc": "Review whether prior medical-advertising review is required, prohibited claims, compliance with the reviewed content and responses to administrative notices.",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "Medical Advertising"
        },
        {
          "title": "Visa Refusal & Remedy Support",
          "desc": "Review supplementary evidence, a fresh application or remedies according to the application route and decision.",
          "path": "/en/visa-refusal-remedy",
          "badge": "Key Area"
        },
        {
          "title": "Agency Registration Consultation",
          "desc": "Review regional registration and renewal requirements for patient attraction, separately from eligibility to act in electronic visa applications.",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "Recommended"
        },
        {
          "title": "Criminal Defense (Illegal Brokerage)",
          "desc": "Review registration, actual referral activity and the applicable legislation, then address the allegations or notice.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "Tax & Financial Structuring",
          "desc": "Review fee contracts, revenue and cost records, and applicable tax rules. Refund eligibility depends on the transaction and relevant period.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "Malpractice Claims & Refund Remedies",
          "desc": "Filing for refunds, claiming compensation for side effects, and representing patients in K-Medi mediations.",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "IP Protection & Asset Structuring",
          "desc": "Handling international trade contracts, trademarks, and cross-border asset structures for medical clients.",
          "path": "https://open.kakao.com/o/saviVYPi"
        }
      ]
    },
    "ai": {
      "title": "Prepare for a Legal Consultation",
      "desc": "Prepare visa notices, treatment or booking records, and contracts or payment records. The scope and fees for individual legal review are explained in advance.",
      "patientTab": "For Patients / Guardians",
      "hospitalTab": "For Hospitals / Agencies",
      "submit": "Get Diagnosis Results",
      "reset": "Reset Diagnosis",
      "legalNotice": "This information is not a legal or medical diagnosis or a visa decision. Ask how to share documents before sending passport or medical records."
    },
    "process": {
      "title": "Our Process",
      "desc": "Consultation, document review, discussion of options, agreed representation and outcome reporting.",
      "steps": [
        {
          "title": "1. Online Inquiry",
          "desc": "Call or use KakaoTalk to confirm consultation arrangements and fees."
        },
        {
          "title": "2. Document Upload",
          "desc": "Ask how to share records, then provide only what is relevant to the review."
        },
        {
          "title": "3. Legal Assessment",
          "desc": "Review decisions, treatment and contract records and identify further evidence needed."
        },
        {
          "title": "4. Strategy Formulation",
          "desc": "Discuss available procedures, scope and fees and record the engagement in writing."
        },
        {
          "title": "5. Work and outcome reporting",
          "desc": "Carry out the agreed procedures and explain progress and results. No processing time or outcome is guaranteed."
        }
      ]
    },
    "faq": {
      "title": "Frequently Asked Questions (FAQ)",
      "desc": "Here are the most common questions regarding Korean medical visas and dispute remedies.",
      "list": [
        {
          "q": "My C-3-3 medical visa was denied. How can I re-apply?",
          "a": "Review the notice, application route, submitted evidence and stay deadline. Consider supplementary evidence, a fresh application or a remedy appropriate to the decision. An agency-authored explanation is not a universal application requirement."
        },
        {
          "q": "A patient wants a refund due to plastic surgery results. What is the legal procedure?",
          "a": "Review informed consent, treatment records, causation, the contract and payment evidence. A side effect does not by itself establish negligence or a refund obligation. Consider negotiation, medical dispute mediation or litigation and the scope of any settlement."
        },
        {
          "q": "Are SNS advertisements targeted at foreign patients strictly regulated?",
          "a": "Distinguish prohibited advertising content from prior review under Article 57 of the Medical Service Act. Check the statutory media criteria, content, format, exceptions and overseas distribution. Not every social-media post automatically requires prior review."
        }
      ]
    },
    "contactForm": {
      "title": "Submit Consultation Request",
      "desc": "Your data is protected under attorney-client privilege. We will respond promptly.",
      "name": "Name / Institution *",
      "email": "Email Address *",
      "phone": "Phone (with country code) *",
      "channel": "Preferred Messenger (WhatsApp / WeChat / LINE ID)",
      "message": "Case Details (Visa reason, dispute details, etc.) *",
      "file": "Upload Supporting Documents (Passport, visa refusal, contract, etc.)",
      "sensitiveConsent": "I consent to the collection, use, and cross-border transfer of my personal and sensitive (medical) information. *",
      "sensitiveNotice": "All health data is processed solely for visa & dispute counseling and will be securely destroyed after closure.",
      "submit": "Submit Request",
      "sending": "Sending...",
      "success": "Thank you. Your request has been logged. An attorney will contact you shortly via messenger."
    },
    "disclaimer": {
      "title": "Legal Disclaimer",
      "text": "All information and consultation preparation information provided on this website are for general reference only and do not constitute official legal advice, a guarantee of visa issuance, or a promise of surgical/refund outcomes. Please consult Kim&Hyun Law Office directly for professional legal services tailored to your specific case. All medical and personal data is strictly protected under Korean privacy legislation."
    }
  },
  "zh": {
    "nav": {
      "check": "签证评估",
      "apply": "在线申请",
      "blog": "律所博客",
      "board": "问答板块",
      "contact": "法律咨询"
    },
    "hero": {
      "badge": "金&贤 律师事务所 · 法务部登记出入境代办机构",
      "title": "韩国医疗签证拒签申诉与整形退款纠纷解决",
      "desc": "根据资料审查医疗签证申请与拒签、患者纠纷及医疗广告规则。律师、税务师、专利代理师资格与出入境代办登记分别说明。",
      "ctaPatient": "签证与退款咨询材料准备",
      "ctaHospital": "医院广告与签证合规诊断"
    },
    "trust": {
      "title": "律师、税务师、专利代理师、资产管理资格与出入境代办登记",
      "lawyer": "律师 诉讼及法律咨询",
      "patent": "专利代理人 知识产权保护",
      "tax": "税务师 税务筹划",
      "wealth": "资产规划师 跨境资产配置",
      "moj": "法务部出入境代办机构登记"
    },
    "visa": {
      "title": "韩国医疗观光签证制度",
      "desc": "了解针对海外患者赴韩治疗及整容所需的签证种类及核心条件。",
      "c33": {
        "title": "C-3-3 (医疗观光签证)",
        "desc": "用于短期治疗或医疗旅游，在最长90日范围内审查。患者本人申请与通过登记的招徕机构申请是不同途径，邀请及担保资料须按途径确认。"
      },
      "g110": {
        "title": "G-1-10 (长期治疗签证)",
        "desc": "适用于需要长期治疗、疗养的患者及符合条件的随行家属。官方指南为一年以内，实际许可期限与延期条件须结合治疗计划等审查。"
      },
      "regist": {
        "title": "引荐机构注册",
        "desc": "核对招徕外国患者活动所需的登记与业务范围。医疗领域的招徕登记和法务部出入境代办机构登记并不相同。"
      },
      "electronic": {
        "title": "优秀机构电子签证",
        "desc": "获指定为优秀引荐机构时，可享受在线代办及快速签发电子签证的便利。"
      }
    },
    "rights": {
      "title": "患者权利与需要核对的资料",
      "desc": "按具体事项核对诊疗同意、隐私、纠纷解决途径与机构登记。",
      "rightsList": [
        {
          "title": "知情同意权与选择权",
          "desc": "分别审查诊疗同意资料与费用合同，区分法定说明同意义务和民事责任。"
        },
        {
          "title": "隐私与个人信息保护权",
          "desc": "有权要求医疗机构对患者的病历及护照等个人信息进行严格保密，防止外泄。"
        },
        {
          "title": "申请调解与索赔救济权",
          "desc": "发生医疗事故或退款纠纷时，有权向韩国医疗纠纷调解仲裁院申请调解。"
        },
        {
          "title": "核实邀请机构资质权",
          "desc": "区分外国患者招徕登记与出入境代办登记，核对拟委托业务所需的登记。"
        }
      ]
    },
    "dispute": {
      "title": "医疗观光纠纷解决三步走",
      "desc": "外国患者与韩国医院发生纠纷时合法有效的申诉流程：",
      "steps": [
        {
          "num": "1",
          "title": "书面交涉与发送律师函",
          "desc": "通过向医院发送正式存证信函（律师函），正式提出退款、赔偿及合同违约要求。"
        },
        {
          "num": "2",
          "title": "申请官方调解与仲裁",
          "desc": "向韩国医疗纠纷调解仲裁院（K-Medi）或消费者院提交申请，由官方主持调解。"
        },
        {
          "num": "3",
          "title": "律师诉讼与行政救济",
          "desc": "按照申请途径与决定类型，评估补充资料、重新申请或救济程序。"
        }
      ]
    },
    "services": {
      "title": "优先法律服务项目",
      "desc": "审查材料与可适用的程序，并在委托前说明服务范围和费用。不保证签证或纠纷处理结果。",
      "list": [
        {
          "title": "SNS医疗广告合规自查",
          "desc": "核对医疗广告是否需要事前审议、禁止表述、审议内容与实际投放的一致性，并处理行政通知。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "医疗广告"
        },
        {
          "title": "医疗签证拒签行政救济",
          "desc": "按照申请途径与决定类型，评估补充资料、重新申请或救济程序。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "签证不许可"
        },
        {
          "title": "引荐资质注册与电子签证",
          "desc": "审查市、道招徕登记与续期要求，并另行核对电子签证代理申请条件。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "优秀推荐"
        },
        {
          "title": "非法中介刑事辩护",
          "desc": "核对登记、实际介绍招徕行为及适用法律，再处理指控或行政通知。",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "中介费与税务合规设计",
          "desc": "审查费用合同、收入与成本凭证及适用税法。退税条件按交易与适用时间另行判断。",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "整形退款与医疗纠纷调解",
          "desc": "代理患者向医院索赔、申请退款，并在官方调解程序及民事诉讼中代表患者发言。",
          "path": "/zh/refund-dispute",
          "badge": "退款维权"
        },
        {
          "title": "标准合同拟定与跨境资产",
          "desc": "拟定多语种知情同意书，保护医疗品牌商标，以及合理规划跨境资金流向。",
          "path": "https://open.kakao.com/o/saviVYPi"
        }
      ]
    },
    "ai": {
      "title": "法律咨询前的材料准备",
      "desc": "请准备签证通知、诊疗或预约资料、合同及付款记录。个别法律审查的范围和咨询费用会事先说明。",
      "patientTab": "患者 / 家属评估入口",
      "hospitalTab": "医院 / 引荐机构评估入口",
      "submit": "获取评估结果",
      "reset": "重新评估",
      "legalNotice": "本说明并非法律或医疗诊断，也不是签证许可决定。发送护照或病历前，请先确认资料提交方式。"
    },
    "process": {
      "title": "服务流程",
      "desc": "通过严谨、透明的五步法，为您争取最大的合法利益。",
      "steps": [
        {
          "title": "1. 在线咨询",
          "desc": "通过电话或KakaoTalk确认咨询方式与费用。"
        },
        {
          "title": "2. 提交文件",
          "desc": "先确认资料提交方式，再提供审查所需的相关记录。"
        },
        {
          "title": "3. 律师联合研判",
          "desc": "审查决定、诊疗与合同资料，说明需要补充的证据。"
        },
        {
          "title": "4. 制定最佳方案",
          "desc": "讨论可行程序、范围与费用，并以书面约定委托事项。"
        },
        {
          "title": "5. 办理与结果说明",
          "desc": "在委托范围内办理程序并说明进展与结果，不保证办理时间或结果。"
        }
      ]
    },
    "faq": {
      "title": "常见问题解答 (FAQ)",
      "desc": "整理了外国患者在韩接受治疗与签证申诉时最常遇到的问题。",
      "list": [
        {
          "q": "C-3-3医疗签证被拒签了，可以直接重新申请吗？",
          "a": "先核对拒签通知、申请类别、已提交资料及居留期限，再考虑补充证据、重新申请或适用的救济程序。由代办机构署名的说明并非所有申请的必备资料。"
        },
        {
          "q": "患者因整形效果不满意要求退款，医院该如何应对？",
          "a": "核对说明义务、诊疗经过、因果关系、合同和付款记录。出现副作用不当然意味着医疗过失或退款义务，应评估协商、医疗纠纷调解或诉讼及和解范围。"
        },
        {
          "q": "在小红书、微信等社交媒体上投放面向外国患者的医疗广告违法吗？",
          "a": "须区分广告内容禁令与《医疗法》第57条的事前审议。根据媒体法定条件、广告内容与方式、例外及境外投放情况逐项判断，不能认定所有社交媒体帖子均须事前审议。"
        }
      ]
    },
    "contactForm": {
      "title": "预约法律咨询",
      "desc": "您的所有咨询均受律师执业保密条款保护。我们将尽快与您联系。",
      "name": "姓名 / 机构名称 *",
      "email": "电子邮箱 *",
      "phone": "联络电话 (含国家代码) *",
      "channel": "首选社交软件 (微信 / WhatsApp / LINE ID)",
      "message": "案件详情 (拒签原因、退款纠纷经过等) *",
      "file": "上传相关文件 (护照、拒签单、手术同意书等)",
      "sensitiveConsent": "我同意收集、使用及跨境传输我的个人信息及敏感（医疗/健康）信息。 *",
      "sensitiveNotice": "所有医疗健康信息仅限用于签证与纠纷咨询，咨询结束后将进行安全销毁。",
      "submit": "提交咨询",
      "sending": "提交中...",
      "success": "提交成功！律师将尽快通过您留下的社交软件账号与您取得联系。"
    },
    "disclaimer": {
      "title": "法律免责声明",
      "text": "本网站上提供的所有信息和咨询准备资料仅供一般参考，不构成正式的法律意见，亦不保证签证的签发或手术及退款的结果。在做出任何法律决策前，请务必直接咨询金&贤律师事务所的执业律师。我们根据韩国《个人信息保护法》对所有患者的病历及个人隐私进行最严格的保密。"
    }
  },
  "ja": {
    "nav": {
      "check": "ビザ適性診断",
      "apply": "申請書作成",
      "blog": "ブログ",
      "board": "掲示板",
      "contact": "相談申込み"
    },
    "hero": {
      "badge": "金&賢 法律事務所 · 法務部登録出入国代行機関",
      "title": "韓国医療ビザ拒否救済＆美容整形返金トラブル解決",
      "desc": "資料に基づき医療ビザの申請・不許可、患者の紛争、医療広告の規制を検討します。弁護士・税務士・弁理士の資格と出入国民願代行登録は区別してご案内します。",
      "ctaPatient": "ビザ・返金相談の準備資料",
      "ctaHospital": "病院広告＆ビザコンプライアンス診断"
    },
    "trust": {
      "title": "弁護士・税務士・弁理士・資産管理の資格と出入国民願代行登録",
      "lawyer": "弁護士 法律相談·訴訟代理",
      "patent": "弁理士 知的財産権保護",
      "tax": "税理士 税務設計",
      "wealth": "資産管理士 資産構造設計",
      "moj": "法務部出入国民願代行機関登録"
    },
    "visa": {
      "title": "医療観光ビザ制度のご案内",
      "desc": "外国人患者の誘致および治療に必要なビザの種類と手続きをご確認ください。",
      "c33": {
        "title": "C-3-3 (医療観光ビザ)",
        "desc": "短期の治療・医療観光を目的として最長90日の範囲で審査されます。患者本人による申請と登録誘致機関を通じた申請を区別し、招請・保証資料は申請経路ごとに確認します。"
      },
      "g110": {
        "title": "G-1-10 (長期治療ビザ)",
        "desc": "長期の治療・療養が必要な患者と要件を満たす同伴家族の在留を検討します。公式案内は一年以内であり、実際の許可期間と延長条件は治療計画等に基づき審査されます。"
      },
      "regist": {
        "title": "誘致業者登録",
        "desc": "外国人患者の誘致活動に必要な登録と業務範囲を確認します。医療分野の誘致登録と法務部の出入国民願代行登録は別の制度です。"
      },
      "electronic": {
        "title": "優秀誘致機関電子ビザ",
        "desc": "優秀誘致機関に指定された場合、オンラインで電子ビザを代理申請·迅速発給される特典を受けられます。"
      }
    },
    "rights": {
      "title": "患者の権利と確認する資料",
      "desc": "診療の説明・同意、個人情報、紛争解決手続き、機関の登録を事案に応じて確認します。",
      "rightsList": [
        {
          "title": "治療選択権および同意権",
          "desc": "診療・同意資料と手数料契約を分けて確認し、法定説明・同意義務と民事責任を区別します。"
        },
        {
          "title": "プライバシーおよび個人情報保護",
          "desc": "医療情報やパスポート情報が外部に流出せず、厳格に秘密が保持される権利"
        },
        {
          "title": "紛争調停および救済を求める権利",
          "desc": "医療事故や返金トラブル発生時、医療紛争調停仲裁院に迅速に調停を申請する権利"
        },
        {
          "title": "招へい機関の確認権利",
          "desc": "外国人患者誘致登録と出入国民願代行登録を区別し、依頼する業務に必要な登録を確認します。"
        }
      ]
    },
    "dispute": {
      "title": "医療観光トラブル解決の3ステップ",
      "desc": "外国人患者と病院の間でトラブルが発生した際の合法的な解決手順です。",
      "steps": [
        {
          "num": "1",
          "title": "直接交渉および書面通知",
          "desc": "内容証明（通知書）の送付を通じ、契約不履行、過大手数料、副作用に対する補償を公式に提起"
        },
        {
          "num": "2",
          "title": "公的機関への調停申請",
          "desc": "韓国医療紛争調停仲裁院（K-Medi）または消費者院への調停申請による合意形成"
        },
        {
          "num": "3",
          "title": "弁護士代理および行政救済",
          "desc": "申請経路と処分の種類に応じて、補足資料、再申請、不服申立ての適否を検討します。"
        }
      ]
    },
    "services": {
      "title": "最優先サービス",
      "desc": "資料と利用可能な手続きを検討し、業務範囲と費用を受任前に説明します。ビザや紛争の結果は保証しません。",
      "list": [
        {
          "title": "SNS医療広告コンプライアンス",
          "desc": "医療広告の事前審議の要否、禁止表現、審議内容と実際の広告の一致、行政通知への対応を検討します。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "医療広告"
        },
        {
          "title": "医療ビザ拒否·延長救済",
          "desc": "申請経路と処分の種類に応じて、補足資料、再申請、不服申立ての適否を検討します。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "ビザ不許可"
        },
        {
          "title": "誘致機関登録および電子ビザ",
          "desc": "市・道の誘致登録・更新要件と、電子ビザの代理申請条件を別々に検討します。",
          "path": "https://open.kakao.com/o/saviVYPi",
          "badge": "おすすめ"
        },
        {
          "title": "不法紹介·あっせん刑事防衛",
          "desc": "登録、実際の紹介・誘致行為、適用法令を確認し、容疑や行政通知に対応します。",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "手数料および税務スキーム設計",
          "desc": "手数料契約、売上・費用資料と適用税法を確認します。還付の可否は取引と適用時期に応じて検討します。",
          "path": "https://open.kakao.com/o/saviVYPi"
        },
        {
          "title": "返金請求および医療トラブル解決",
          "desc": "施術副作用の損害賠償請求、整形施術費用の返金調停申請および民事代理。",
          "path": "/ja/refund-dispute",
          "badge": "返金トラブル"
        },
        {
          "title": "標準契約書作成および知的財産",
          "desc": "弁理士連携。施術同意書のリーガルチェック、医療ブランド商標登録、海外送金資産の法適合化。",
          "path": "https://open.kakao.com/o/saviVYPi"
        }
      ]
    },
    "ai": {
      "title": "法律相談に向けた資料の準備",
      "desc": "ビザの通知書、診療・予約資料、契約・支払記録をご準備ください。個別の法的検討の範囲と相談料は事前にご案内します。",
      "patientTab": "患者 / 保護者向け診断",
      "hospitalTab": "病院 / 誘致業者向け診断",
      "submit": "診断結果を見る",
      "reset": "もう一度診断する",
      "legalNotice": "この案内は法的・医学的診断やビザ許可の判定ではありません。旅券・診療記録等の送付前に、資料の共有方法をご確認ください。"
    },
    "process": {
      "title": "業務進行プロセス",
      "desc": "相談、資料検討、方針の協議、委任業務の実施、結果のご案内の順に進めます。",
      "steps": [
        {
          "title": "1. オンラインお問い合わせ",
          "desc": "電話またはKakaoTalkで相談方法と費用を確認します。"
        },
        {
          "title": "2. 必要書類のアップロード",
          "desc": "共有方法の案内を受けた後、検討に必要な記録を共有します。"
        },
        {
          "title": "3. 1次リーガルチェック",
          "desc": "処分・診療・契約資料を検討し、必要な追加資料をご案内します。"
        },
        {
          "title": "4. 個別戦略の立案",
          "desc": "利用可能な手続き、範囲と費用を協議し、委任内容を書面で定めます。"
        },
        {
          "title": "5. 業務の実施と結果の説明",
          "desc": "委任範囲内で手続きを進め、経過と結果を説明します。処理期間や結果を保証するものではありません。"
        }
      ]
    },
    "faq": {
      "title": "よくある質問 (FAQ)",
      "desc": "外国人患者の誘致および医療ビザ申請について、よくあるご質問をまとめました。",
      "list": [
        {
          "q": "C-3-3ビザが拒否されました。再申請は可能ですか？",
          "a": "不許可通知、申請区分、提出資料、在留期限から確認し、証拠の補足、再申請、不服申立ての適否を検討します。代行機関名義の説明書が全申請の必須書類というわけではありません。"
        },
        {
          "q": "患者が美容整形の施術結果に不満で返金を求めています。どうすべきですか？",
          "a": "説明義務、診療経過、因果関係、契約と支払記録を確認します。副作用だけで過失や返金義務は決まりません。協議、医療紛争調停、訴訟の適否と和解の範囲を検討します。"
        },
        {
          "q": "外国人患者向けのSNS広告について気をつけるべき規制はありますか？",
          "a": "広告内容の禁止事項と医療法第57条の事前審議を区別します。媒体の法定要件、広告の内容・方法、例外、海外配信の条件を個別に確認し、すべてのSNS投稿が審議対象とは扱いません。"
        }
      ]
    },
    "contactForm": {
      "title": "法律相談の申込み",
      "desc": "守秘義務に基づき、お客様の個人情報は厳重に保護されます。お気軽にご相談ください。",
      "name": "お名前 / 貴社名 *",
      "email": "メールアドレス *",
      "phone": "電話番号 (国番号含む) *",
      "channel": "連絡可能なメッセンジャー (LINE / WhatsApp / WeChat ID)",
      "message": "相談内容 (ビザ拒否理由、トラブル内容など) *",
      "file": "関連書類のアップロード (パスポート、不許可通知、同意書など)",
      "sensitiveConsent": "個人情報および敏感情報(医療·健康情報)の収集·利用·国外移転に同意します。 *",
      "sensitiveNotice": "医療ビザ申請および紛争解決の目的に限り処理され、相談終了後は安全に破棄されます。",
      "submit": "送信する",
      "sending": "送信中...",
      "success": "送信が完了しました。担当弁護士より登録されたメッセンジャーへ速やかにご連絡いたします。"
    },
    "disclaimer": {
      "title": "免責事項",
      "text": "本ウェブサイト上のすべての情報および相談準備の案内は、一般的な参考情報であり、正式な法律相談やビザ発給の保証、治療結果の約束を意味するものではありません。具体的な意思決定の前に、必ず金&賢法律事務所の弁護士への公式相談を行ってください。また、提供された医療情報は個人情報保護法に基づき厳重に秘密管理されます。"
    }
  }
};
