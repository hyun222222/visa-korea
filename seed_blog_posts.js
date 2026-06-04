const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// 1. Load env variables
if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index !== -1) {
            const key = trimmed.substring(0, index).trim();
            let val = trimmed.substring(index + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            process.env[key] = val;
        }
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Define the 20 posts (5 topics * 4 languages)
const posts = [
    // --- TOPIC 1: D-8 INVESTOR VISA ---
    {
        slug: "d8-visa-guide",
        title: "한국 기업투자 D-8 비자 취득 핵심 가이드",
        title_en: "Korea D-8 Corporate Investor Visa Guide",
        excerpt: "외국인이 한국에서 법인을 설립하고 투자를 유치하여 발급받는 D-8 비자의 자본금 송금 및 실제 사업장 입증 요건을 살펴봅니다.",
        category: "investor",
        keywords: ["D-8 비자", "투자비자", "외국인 투자", "법인 설립"],
        author: "김앤현 법률사무소",
        read_minutes: 6,
        body: [
            { type: "p", text: "D-8 비자는 외국인이 국내에 1억 원 이상을 투자하여 법인을 설립하거나 경영하기 위해 발급받는 대표적인 장기 체류 비자입니다." },
            { type: "h2", text: "1. 자본금 송금 요건" },
            { type: "p", text: "투자금은 반드시 투자자 본인의 해외 계좌에서 국내 신설 법인 명의의 임시 계좌로 공식 송금되어야 합니다. 제3자 송금이나 현금 휴대 입국은 원천적으로 제한됩니다." },
            { type: "h2", text: "2. 사업장 실체 입증" },
            { type: "p", text: "가상 오피스나 소호 사무실은 반려 사유가 될 수 있습니다. 실제 사업을 영위할 수 있는 임대차 계약서 및 사무기기 구비 현황 사진이 요구됩니다." }
        ]
    },
    {
        slug: "d8-visa-guide-en",
        title: "Korea D-8 Corporate Investor Visa: Capital and Substance Requirements",
        title_en: "Korea D-8 Corporate Investor Visa Guide",
        excerpt: "An overview of capital transfer procedures and office substance requirements for obtaining a D-8 investment visa in South Korea.",
        category: "investor",
        keywords: ["D-8 Visa", "Investor Visa", "Korea Incorporation", "FDI Korea"],
        author: "Kim & Hyun Law Office",
        read_minutes: 6,
        body: [
            { type: "p", text: "The D-8 visa is a long-term corporate investment visa for foreign entrepreneurs investing at least 100 million KRW to establish a corporation in Korea." },
            { type: "h2", text: "1. Foreign Capital Remittance" },
            { type: "p", text: "All investment funds must be remitted directly from the foreign investor's overseas account to a temporary corporate bank account in Korea. Cash carrying is highly restricted." },
            { type: "h2", text: "2. Physical Office Substance" },
            { type: "p", text: "Virtual offices are generally rejected. You must submit a physical commercial lease contract, photos of the office setup, and equipment configurations." }
        ]
    },
    {
        slug: "d8-visa-guide-zh",
        title: "韩国D-8企业投资签证指南：资本金汇款与运营合规要点",
        title_en: "Korea D-8 Corporate Investor Visa Guide",
        excerpt: "详细介绍外国人赴韩设立法人并申请D-8投资签证时，关于境外资金汇款及办公场所实际运营的审查要点。",
        category: "investor",
        keywords: ["D-8签证", "投资签证", "韩国法人设立", "外商直接投资"],
        author: "金&贤 律师事务所",
        read_minutes: 6,
        body: [
            { type: "p", text: "D-8签证是外国投资者在韩国投资1亿韩元以上设立法人、参与经营管理所取得的核心长期居留签证。" },
            { type: "h2", text: "1. 境外资金汇款要点" },
            { type: "p", text: "投资款必须由投资者本人从境外账户直接电汇至韩国国内银行的法人设立托管账户。通过他人代汇或换汇通常无法通过审查。" },
            { type: "h2", text: "2. 办公场所的实质审查" },
            { type: "p", text: "虚拟办公室很难通过审查。出入境部门通常会要求提交实际商用办公楼租赁合同、办公设施照片以及实际开展业务的证明材料。" }
        ]
    },
    {
        slug: "d8-visa-guide-ja",
        title: "韓国D-8企業投資ビザ取得ガイド：投資資金の送金と事業実態要件",
        title_en: "Korea D-8 Corporate Investor Visa Guide",
        excerpt: "外国人が韓国で法人を設立し、D-8投資ビザを取得するための資金送金手続きと事務所の実態要件について解説します。",
        category: "investor",
        keywords: ["D-8ビザ", "投資ビザ", "韓国法人設立", "FDI韓国"],
        author: "金＆賢 法律事務所",
        read_minutes: 6,
        body: [
            { type: "p", text: "D-8ビザは、外国人が韓国に1億ウォン以上を投資して法人を設立・運営する際に取得する代表的な長期滞在ビザです。" },
            { type: "h2", text: "1. 資金の海外送金ルート" },
            { type: "p", text: "投資資金は必ず投資家本人の海外口座から、韓国の新設法人名義の口座へ直接送金されなければなりません。第三者による送金や現金での持ち込みは認められません。" },
            { type: "h2", text: "2. 事業所の実態要件" },
            { type: "p", text: "バーチャルオフィスは原則として認められません。実際に業務を行うことができる賃貸借契約書や、オフィスの写真・事務機器の設置状況が審査されます。" }
        ]
    },

    // --- TOPIC 2: F-2-7 POINTS SYSTEM ---
    {
        slug: "f2-points-system",
        title: "F-2-7 점수제 거주비자 핵심 요약 및 득점 전략",
        title_en: "Korea F-2-7 Points-Based Residence Visa Guide",
        excerpt: "나이, 학력, 한국어 능력, 소득 점수를 기반으로 장기 체류가 가능한 F-2-7 거주비자의 배점표와 KIIP 가점 획득 방법을 설명합니다.",
        category: "f-residence",
        keywords: ["F-2-7 비자", "점수제 거주", "거주비자", "사회통합프로그램"],
        author: "김앤현 법률사무소",
        read_minutes: 5,
        body: [
            { type: "p", text: "F-2-7 비자는 우수 외국인 인재 유치를 위해 나이, 학력, 한국어 능력, 소득 등을 점수화하여 80점(만점 120점) 이상인 경우 부여하는 거주 체류자격입니다." },
            { type: "h2", text: "1. 주요 배점 기준" },
            { type: "p", text: "연령(최대 25점), 학력(최대 35점), 한국어 능력(최대 20점), 연간 소득(최대 10점)이 기본 구성이며, 가점과 감점을 적용하여 최종 점수를 산출합니다." },
            { type: "h2", text: "2. KIIP 이수 전략" },
            { type: "p", text: "사회통합프로그램(KIIP) 5단계 이수 시 최대 10점의 가점이 부여되므로, 소득이나 연령에서 부족한 점수를 보완하는 가장 확실한 방법입니다." }
        ]
    },
    {
        slug: "f2-points-system-en",
        title: "Korea F-2-7 Points-Based Residence Visa: Scoring Criteria and Strategies",
        title_en: "Korea F-2-7 Points-Based Residence Visa Guide",
        excerpt: "A complete analysis of the F-2-7 residence visa points system, including scoring categories (age, education, TOPIK, income) and KIIP strategies.",
        category: "f-residence",
        keywords: ["F-2-7 Visa", "Residence Visa", "Points System", "KIIP Korea"],
        author: "Kim & Hyun Law Office",
        read_minutes: 5,
        body: [
            { type: "p", text: "The F-2-7 visa allows high-scoring foreign residents in Korea to change their status to a flexible residence visa if they score 80 points or more out of 120." },
            { type: "h2", text: "1. Basic Scoring Categories" },
            { type: "p", text: "Points are distributed across Age (max 25), Education (max 35), Korean Language Ability (max 20), and Annual Income (max 10), plus bonus points." },
            { type: "h2", text: "2. The Importance of KIIP" },
            { type: "p", text: "Completing the Korea Immigration and Integration Program (KIIP) Stage 5 awards up to 10 bonus points, serving as a reliable path to make up for low income scores." }
        ]
    },
    {
        slug: "f2-points-system-zh",
        title: "韩国F-2-7打分制居住签证：评分标准与高分策略",
        title_en: "Korea F-2-7 Points-Based Residence Visa Guide",
        excerpt: "详细解析F-2-7居住签证的评分细则，包含年龄、学历、韩语水平和所得的计分方式，并分享KIIP社会统合课程的提分秘诀。",
        category: "f-residence",
        keywords: ["F-2-7签证", "打分制居住", "社会统合课程", "韩国居住签证"],
        author: "金&贤 律师事务所",
        read_minutes: 5,
        body: [
            { type: "p", text: "F-2-7签证是针对外国优秀人才，根据年龄、学历、韩语水平、收入等大项进行综合评分，达到80分以上（满分120分）时签发的居住签证。" },
            { type: "h2", text: "1. 核心评分板块" },
            { type: "p", text: "主要评定指标包括年龄（最高25分）、学历（最高35分）、韩语能力（最高20分）和年收入（最高10分）。此外还设有加分项与减分项。" },
            { type: "h2", text: "2. 社会统合课程（KIIP）加分" },
            { type: "p", text: "完成社会统合课程5阶段学习可获得最多10分的加分，这对于因为年龄增长或工作初期收入不足而扣分的申请者来说非常重要。" }
        ]
    },
    {
        slug: "f2-points-system-ja",
        title: "韓国F-2-7点数制居住ビザ：配点基準と加点獲得戦略",
        title_en: "Korea F-2-7 Points-Based Residence Visa Guide",
        excerpt: "年齢、学歴、韓国語能力、所得を基準とするF-2-7居住ビザの配点表と、社会統合プログラム（KIIP）による加点獲得について解説します。",
        category: "f-residence",
        keywords: ["F-2-7ビザ", "点数制居住ビザ", "社会統合プログラム", "KIIP"],
        author: "金＆賢 法律事務所",
        read_minutes: 5,
        body: [
            { type: "p", text: "F-2-7ビザは、優秀な外国人材を対象に、年齢、学歴、韓国語能力、所得などを点数化し、80点以上（120点満点）の申請者に付与される居住資格です。" },
            { type: "h2", text: "1. 主な配点項目" },
            { type: "p", text: "年齢（最大25点）、学歴（最大35点）、韓国語能力（最大20点）、年間所得（最大10点）などの基本項目に、加点・減点項目を反映して判定します。" },
            { type: "h2", text: "2. KIIP修了によるメリット" },
            { type: "p", text: "社会統合プログラム（KIIP）第5段階を修了すると、最大10点の加点が付与されます。年齢や所得の配点をカバーするための最も確実な戦略です。" }
        ]
    },

    // --- TOPIC 3: F-5 PERMANENT RESIDENCY ---
    {
        slug: "f5-permanent-residency",
        title: "한국 영주권(F-5) 신청 필수 체크리스트와 거절 사유 분석",
        title_en: "Korea F-5 Permanent Residency Guide",
        excerpt: "GNI 소득 충족 여부, 사회통합프로그램 이수 조건, 해외 범죄경력증명서 아포스티유 제출 등 영주권 심사의 탈락 요인을 분석합니다.",
        category: "f-residence",
        keywords: ["F-5 비자", "영주권 신청", "GNI 소득", "아포스티유"],
        author: "김앤현 법률사무소",
        read_minutes: 7,
        body: [
            { type: "p", text: "영주권(F-5)은 체류 자격 구분에 상관없이 대한민국에 영구히 거주할 수 있는 권리를 부여하는 가장 안정적인 자격입니다." },
            { type: "h2", text: "1. 소득 요건 (GNI 기준)" },
            { type: "p", text: "일반적으로 전년도 한국은행 고시 일인당 국민총소득(GNI)의 1배 또는 2배 이상의 생계유지 능력을 입증해야 합니다. 소득세 신고 금액만 인정되므로 사전에 확인이 필요합니다." },
            { type: "h2", text: "2. 해외 범죄경력증명 요건" },
            { type: "p", text: "본국 정부가 발급한 무범죄증명서에 대해 아포스티유 또는 영사 확인을 받아 제출해야 합니다. 최근 5년 내 중대 범죄 기록이 있을 시 불허됩니다." }
        ]
    },
    {
        slug: "f5-permanent-residency-en",
        title: "Korea F-5 Permanent Residency Checklist: Income and KIIP Requirements",
        title_en: "Korea F-5 Permanent Residency Guide",
        excerpt: "Analyzing key criteria for the F-5 permanent residency visa, focusing on GNI income thresholds, criminal history checks, and KIIP requirements.",
        category: "f-residence",
        keywords: ["F-5 Visa", "Permanent Residency", "GNI Income", "Immigration Korea"],
        author: "Kim & Hyun Law Office",
        read_minutes: 7,
        body: [
            { type: "p", text: "The Permanent Residency (F-5) visa offers unlimited stay and freedom of employment in South Korea, making it the most secure visa category." },
            { type: "h2", text: "1. Income Verification (GNI)" },
            { type: "p", text: "Applicants must typically show an annual income equivalent to 1x or 2x the Gross National Income (GNI) per capita announced by the Bank of Korea. Only taxed income qualifies." },
            { type: "h2", text: "2. Criminal Background Checks" },
            { type: "p", text: "A certified criminal record certificate from your home country, authenticated via Apostille or Embassy legalization, is required. Recent criminal records will lead to rejection." }
        ]
    },
    {
        slug: "f5-permanent-residency-zh",
        title: "韩国F-5永住权申请指南：GNI收入标准与常见拒签原因",
        title_en: "Korea F-5 Permanent Residency Guide",
        excerpt: "归纳总结申请韩国F-5永久居留权的核心要求，涵盖国民总收入（GNI）标准、境外无犯罪证明公证以及社会统合课程合格证书等要点。",
        category: "f-residence",
        keywords: ["F-5签证", "韩国永住权", "GNI收入", "无犯罪记录证明"],
        author: "金&贤 律师事务所",
        read_minutes: 7,
        body: [
            { type: "p", text: "永久居留签证（F-5）在韩国不受滞留期限和就业领域的限制，是滞留在韩外国人最稳定、待遇最完善的签证类型。" },
            { type: "h2", text: "1. 生计维持能力（GNI所得）审查" },
            { type: "p", text: "根据具体申请类型，通常需要证明年所得达到韩国银行公布的前一年人均国民总收入（GNI）的1倍或2倍以上。必须提供税务部门开具的所得证明。" },
            { type: "h2", text: "2. 境外无犯罪记录公证" },
            { type: "p", text: "申请人须提交本国签发的无犯罪记录证明，并经过海牙认证（Apostille）或领事认证。过去五年内如有严重刑事犯罪前科，将不予批准。" }
        ]
    },
    {
        slug: "f5-permanent-residency-ja",
        title: "韓国F-5永住権申請チェックリスト：GNI所得基準と要件解説",
        title_en: "Korea F-5 Permanent Residency Guide",
        excerpt: "韓国の永住権（F-5）申請におけるGNI所得基準、海外犯罪経歴証明書のアポスティーユ提出、審査却下の防止要件について解説します。",
        category: "f-residence",
        keywords: ["F-5ビザ", "永住権申請", "GNI所得基準", "アポスティーユ"],
        author: "金＆賢 法律事務所",
        read_minutes: 7,
        body: [
            { type: "p", text: "永住権（F-5）は、在留期間の延長制限や就労分野の制限がなく、韓国に永久に滞在できる権利を与える最も安定した在留資格です。" },
            { type: "h2", text: "1. 生計維持能力（GNI基準）" },
            { type: "p", text: "一般的に、韓国銀行が告示した前年度の一人当たり国民総所得（GNI）の1倍または2倍以上の年間所得を証明する必要があります。税務署発行の所得証明のみ有効です。" },
            { type: "h2", text: "2. 海外の犯罪経歴証明要件" },
            { type: "p", text: "本国の政府が発行した無犯罪証明書に対し、アポスティーユまたは領事認証を取得して提出する必要があります。過去5年以内の犯罪歴は不許可の要因になります。" }
        ]
    },

    // --- TOPIC 4: E-7-4 SKILLED WORKER ---
    {
        slug: "e7-skilled-worker",
        title: "E-7-4 숙련기능인력 점수제 전환 가이드",
        title_en: "Korea E-7-4 Skilled Worker Visa Guide",
        excerpt: "E-9 등 단순노무 자격에서 E-7-4 숙련기능인력 점수제로 신분을 전환하기 위한 배점 항목과 기업의 국민 고용 쿼터 제한을 분석합니다.",
        category: "immigration-practice",
        keywords: ["E-7-4 비자", "숙련기능인력", "E-9 비자", "국민 고용 비율"],
        author: "김앤현 법률사무소",
        read_minutes: 5,
        body: [
            { type: "p", text: "E-7-4 비자는 E-9(비전문취업), E-10(선원취업), H-2(방문취업) 자격의 외국인 근로자가 숙련성 점수를 충족하여 획득할 수 있는 장기 체류 특정활동 비자입니다." },
            { type: "h2", text: "1. 주요 평가 점수" },
            { type: "p", text: "평균 소득 점수, 보유 자격증, 학력, 연령, 한국어 능력 등의 배점 요건이 있으며 고득점자 순으로 최종 선발됩니다." },
            { type: "h2", text: "2. 기업의 고용 쿼터 제한" },
            { type: "p", text: "기업 내 정규직 한국인 고용 인원의 20%(제조업 기준)를 초과하여 외국인을 E-7-4로 고용할 수 없으므로, 소속 기업의 4대보험 가입 명부를 사전에 체크해야 합니다." }
        ]
    },
    {
        slug: "e7-skilled-worker-en",
        title: "Korea E-7-4 Skilled Worker Points System and Corporate Quota Guide",
        title_en: "Korea E-7-4 Skilled Worker Visa Guide",
        excerpt: "An explanation of the transition from E-9 to E-7-4 skilled worker status, focusing on point calculation methods and corporate hiring quotas.",
        category: "immigration-practice",
        keywords: ["E-7-4 Visa", "Skilled Worker", "E-9 Visa", "Immigration Quota"],
        author: "Kim & Hyun Law Office",
        read_minutes: 5,
        body: [
            { type: "p", text: "The E-7-4 visa allows temporary workers (under E-9, E-10, H-2) to transition into a long-term visa by accumulating points based on their technical skills and integration." },
            { type: "h2", text: "1. Point System Criteria" },
            { type: "p", text: "Points are calculated based on Average Salary, Technical Certifications, Education level, and Korean Language proficiency (TOPIK/KIIP)." },
            { type: "h2", text: "2. Corporate Quota Restrictions" },
            { type: "p", text: "A company cannot employ E-7-4 workers exceeding 20% of its regular Korean workforce. Checking the employer's payroll registration beforehand is critical." }
        ]
    },
    {
        slug: "e7-skilled-worker-zh",
        title: "韩国E-7-4熟练技能人员签证转换：打分项与企业配额限制",
        title_en: "Korea E-7-4 Skilled Worker Visa Guide",
        excerpt: "解析从E-9、H-2等非专业就业签证向E-7-4熟练技能打分制签证转换时的评分指标，以及企业内部国民雇佣比例所导致的聘用人数上限。",
        category: "immigration-practice",
        keywords: ["E-7-4签证", "熟练技能人员", "E-9转E-7-4", "雇佣配额限制"],
        author: "金&贤 律师事务所",
        read_minutes: 5,
        body: [
            { type: "p", text: "E-7-4签证是允许持有E-9（非专业就业）、E-10、H-2等签证的外国技术工人，在达到一定熟练度积分后，转换取得的长期特定活动签证。" },
            { type: "h2", text: "1. 主要计分评估项" },
            { type: "p", text: "评定指标包含过去两年的平均所得、持有的技术资格证、学历、年龄以及韩语沟通能力。高分申请者将被优先选拔。" },
            { type: "h2", text: "2. 企业雇佣配额（20%原则）" },
            { type: "p", text: "企业可聘用的E-7-4外国员工总数通常不能超过其常雇韩国籍员工人数的20%。因此，在申请前需确认公司的国民缴税参保名册。" }
        ]
    },
    {
        slug: "e7-skilled-worker-ja",
        title: "韓国E-7-4熟練技能人材点数制移行ガイド：評価項目と企業枠制限",
        title_en: "Korea E-7-4 Skilled Worker Visa Guide",
        excerpt: "E-9などの単純労務からE-7-4熟練技能人材への在留資格変更に必要な評価項目と、雇用企業の受け入れ枠制限について解説します。",
        category: "immigration-practice",
        keywords: ["E-7-4ビザ", "熟練技能人材", "E-9資格変更", "雇用クオータ"],
        author: "金＆賢 法律事務所",
        read_minutes: 5,
        body: [
            { type: "p", text: "E-7-4ビザは、E-9（非専門就労）やH-2（訪問就労）などの外国人労働者が、技術水準の評価を満たすことで移行できる長期滞在用の特定活動資格です。" },
            { type: "h2", text: "1. 点数算定項目" },
            { type: "p", text: "年間平均所得、保有する技術資格、学歴、年齢、韓国語能力などが点数化され、合計点数の高い順に合格者が決定されます。" },
            { type: "h2", text: "2. 企業の受け入れクオータ制限" },
            { type: "p", text: "企業が雇用できるE-7-4労働者数は、常用雇用の韓国人社員数の20%（製造業基準）を超えることができません。所属企業の4大保険加入者名簿の事前確認が不可欠です。" }
        ]
    },

    // --- TOPIC 5: MEDICAL VISA COMPLIANCE ---
    {
        slug: "medical-visa-compliance",
        title: "의료관광 비자 제도와 유치기관의 광고·행정 준법 실무",
        title_en: "Korea Medical Tourism Visas and Compliance Guide",
        excerpt: "외국인 환자 초청을 위한 C-3-3/G-1-10 비자 발급 조건, 보건복지부 유치업체 등록 요건 및 SNS 의료광고 불법 예방 지침을 분석합니다.",
        category: "immigration-practice",
        keywords: ["의료관광 비자", "유치기관 등록", "의료광고 심의", "외국인 환자"],
        author: "김앤현 법률사무소",
        read_minutes: 6,
        body: [
            { type: "p", text: "외국인 환자의 안전한 국내 유치와 법적 리스크 관리를 위해서는 행정 절차와 보건소 광고 기준을 명밀히 파악해야 합니다." },
            { type: "h2", text: "1. 의료 비자 제도 요건" },
            { type: "p", text: "단기 치료는 C-3-3(최대 90일), 장기 요양은 G-1-10(최대 1년) 비자가 발급됩니다. 반드시 정부 지정 공식 유치기관의 신원보증 및 초청 서류가 뒷받침되어야 합니다." },
            { type: "h2", text: "2. SNS 광고 컴플라이언스" },
            { type: "p", text: "SNS상에서 해외 환자를 대상으로 광고를 진행할 때도 의료법 제56조에 따른 사전 심의 대상이 됩니다. '치료 보장', '환불 조건부 알선' 표현은 행정처분으로 이어지므로 준법 검토를 거쳐야 합니다." }
        ]
    },
    {
        slug: "medical-visa-compliance-en",
        title: "Korea Medical Tourism Visas and Hospital Compliance Requirements",
        title_en: "Korea Medical Tourism Visas and Compliance Guide",
        excerpt: "Understanding the C-3-3/G-1-10 medical visa processes, mandatory agency registration, and compliance guidelines for medical marketing targeting overseas patients.",
        category: "immigration-practice",
        keywords: ["Medical Visa", "Agency Registration", "Medical Ad Review", "Immigration Korea"],
        author: "Kim & Hyun Law Office",
        read_minutes: 6,
        body: [
            { type: "p", text: "Legal compliance in hosting international patients involves strict adherence to immigration procedures and advertising standards under the Medical Service Act." },
            { type: "h2", text: "1. Medical Visa Categories" },
            { type: "p", text: "Short-term treatment uses the C-3-3 visa (up to 90 days), while long-term care relies on the G-1-10 visa (up to 1 year). Both require guarantees from officially registered inviting organizations." },
            { type: "h2", text: "2. SNS Marketing Restrictions" },
            { type: "p", text: "Any medical marketing targeting foreign patients is subject to pre-review by the Medical Advertisement Committee. Phrases promising surgery outcomes or cash-back brokerage are prohibited." }
        ]
    },
    {
        slug: "medical-visa-compliance-zh",
        title: "韩国医疗观光签证与招徕机构合规运营实务",
        title_en: "Korea Medical Tourism Visas and Compliance Guide",
        excerpt: "分析用于招徕外国患者的C-3-3/G-1-10医疗签证申请、保健福祉部注册资质要件，以及在社交媒体推广整形项目时的医疗广告预审规范。",
        category: "immigration-practice",
        keywords: ["医疗观光签证", "引荐机构注册", "医疗广告审查", "赴韩整形退款"],
        author: "金&贤 律师事务所",
        read_minutes: 6,
        body: [
            { type: "p", text: "合法招徕外国患者不仅涉及签证邀请程序，还必须符合韩国医疗广告法规，防范由于不法中介或虚假宣传导致的停业行政处罚。" },
            { type: "h2", text: "1. 医疗签证办理规定" },
            { type: "p", text: "短期整形或治疗适用C-3-3签证（最长90天），长期疗养适用G-1-10签证（最长1年）。必须由通过保建福祉部正式注册的引荐机构提供保证书进行申请。" },
            { type: "h2", text: "2. 社交网络医疗广告审查" },
            { type: "p", text: "在小红书、微信等社交网络上面向外国患者推广医疗项目时，必须遵守医疗广告事先审查制度。‘保证效果’、‘低价返现吸引患者’等违规表述将面临吊销营业执照风险。" }
        ]
    },
    {
        slug: "medical-visa-compliance-ja",
        title: "韓国医療観光ビザ制度と招致機関の広告・行政コンプライアンス実務",
        title_en: "Korea Medical Tourism Visas and Compliance Guide",
        excerpt: "外国人患者招致に必要なC-3-3/G-1-10ビザ要件、保健福祉部への正式登録、およびSNSでの美容整形広告に対する事前審議コンプライアンスを解説します。",
        category: "immigration-practice",
        keywords: ["医療観光ビザ", "招致機関登録", "医療広告審議", "美容整形返金"],
        author: "金＆賢 法律事務所",
        read_minutes: 6,
        body: [
            { type: "p", text: "外国人患者を安全に韓国へ招致し、トラブルを未然に防ぐためには、出入国手続きと医療法上の広告基準を遵守する必要があります。" },
            { type: "h2", text: "1. 医療観光ビザの基本構成" },
            { type: "p", text: "短期治療はC-3-3ビザ（最大90日）、長期療養はG-1-10ビザ（最大1年）が該当します。保健福祉部に登録された公式招致機関の身元保証が義務付けられます。" },
            { type: "h2", text: "2. SNS上の医療広告規制" },
            { type: "p", text: "SNSを利用して外国人向けに美容整形等の広告を行う場合も、医療法に基づく事前審議の対象となります。「治療効果の保証」や「キャッシュバックあっせん」などの表記は処分の対象になります。" }
        ]
    }
];

// 3. Clear existing seed data from Supabase and insert new ones
async function seed() {
    console.log("Starting database seeding...");
    try {
        // Delete existing seed data first to avoid duplicate slug conflicts
        const slugs = posts.map(p => p.slug);
        const { error: deleteError } = await supabase
            .from('blog_posts')
            .delete()
            .in('slug', slugs);

        if (deleteError) {
            console.error("Error clearing old database records:", deleteError);
            process.exit(1);
        }
        console.log("Cleared old database records with matching slugs.");

        // Insert new records
        const insertRows = posts.map(post => ({
            slug: post.slug,
            title: post.title,
            title_en: post.title_en,
            excerpt: post.excerpt,
            category: post.category,
            keywords: post.keywords,
            read_minutes: post.read_minutes,
            author: post.author,
            body: post.body,
            published_at: new Date().toISOString()
        }));

        const { data, error: insertError } = await supabase
            .from('blog_posts')
            .insert(insertRows)
            .select();

        if (insertError) {
            console.error("Error inserting seed blog posts:", insertError);
            process.exit(1);
        }

        console.log(`Successfully seeded ${data.length} blog posts to Supabase database!`);
        process.exit(0);
    } catch (err) {
        console.error("Exception occurred during seeding:", err);
        process.exit(1);
    }
}

if (require.main === module) {
    seed();
}

module.exports = { posts };
