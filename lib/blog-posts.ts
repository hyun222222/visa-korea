/**
 * Blog content store for koreavisalaw.com.
 *
 * 운영 가이드:
 * - 새 글 추가는 이 파일의 `blogPosts` 배열 맨 위에 객체를 push하면 됨 (최신순 정렬용).
 * - `slug`는 영문 소문자/하이픈만 사용 — URL이 됨 (예: /blog/d8-investor-visa-basics).
 * - `category`는 `BLOG_CATEGORIES`에 정의된 id 중 하나만.
 * - `body`는 마크다운이 아니라 가독성 위해 `BlogBlock[]` 구조화 데이터 (제목/문단/리스트/콜아웃).
 *   나중에 Supabase/CMS로 옮길 때도 같은 타입을 그대로 쓸 수 있게 했음.
 */

export type BlogCategoryId =
    | "investor"
    | "f-residence"
    | "corporate"
    | "immigration-practice"
    | "case-analysis";

export interface BlogCategory {
    id: BlogCategoryId;
    label: string;
    labelEn: string;
    description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
    {
        id: "investor",
        label: "투자비자",
        labelEn: "Investor Visa",
        description: "D-8 기업투자, 외국인 투자 적격 심사, 자본금/송금 실무.",
    },
    {
        id: "f-residence",
        label: "F-2 / F-5",
        labelEn: "Residence & PR",
        description: "거주비자 점수제, 영주권 요건, 장기체류 전환 전략.",
    },
    {
        id: "corporate",
        label: "법인설립",
        labelEn: "Corporate Setup",
        description: "외국인 법인설립, FDI 신고, 정관/임원 구성 실무.",
    },
    {
        id: "immigration-practice",
        label: "출입국 실무",
        labelEn: "Immigration Practice",
        description: "심사 보완 요청, 거절 대응, 체류기간 연장, 재입국 허가.",
    },
    {
        id: "case-analysis",
        label: "사례분석",
        labelEn: "Case Analysis",
        description: "실제 사건 진행 경과와 시사점.",
    },
];

export type BlogBlock =
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "list"; items: string[]; ordered?: boolean }
    | { type: "callout"; title: string; text: string };

export interface BlogPost {
    slug: string;
    title: string;
    titleEn?: string;
    excerpt: string;
    category: BlogCategoryId;
    /** Comma-separated SEO keywords used in metadata. */
    keywords: string[];
    /** ISO date, used for sorting and sitemap lastModified. */
    publishedAt: string;
    /** Estimated read time in minutes. */
    readMinutes: number;
    /** Display author (for trust). */
    author: string;
    body: BlogBlock[];
}

/**
 * Latest-first ordering. Add new posts at the top.
 */
export const blogPosts: BlogPost[] = [
    {
        slug: "d8-investor-visa-basics",
        title: "한국 투자비자 D-8 기본 요건 — 자본금·송금·실체심사",
        titleEn: "Korea D-8 Investor Visa: Capital, Remittance, and Substance Review",
        excerpt:
            "외국인이 한국에서 법인을 세우고 받는 가장 일반적인 장기 체류 비자가 D-8입니다. 1억 원 자본금만 맞추면 끝이라는 오해가 많지만, 실제 심사는 송금 경로·사업 실체·대표이사 체류 적정성까지 종합적으로 봅니다.",
        category: "investor",
        keywords: [
            "D-8 비자",
            "한국 투자비자",
            "외국인 투자",
            "기업투자 비자",
            "Korea D-8 visa",
            "Korea investor visa",
            "Korea business visa",
            "FDI Korea",
        ],
        publishedAt: "2026-05-12",
        readMinutes: 7,
        author: "김앤현 법률사무소",
        body: [
            {
                type: "p",
                text: "D-8 (기업투자) 비자는 외국인이 한국에 법인을 설립하고 그 법인을 경영·관리하기 위해 받는 비자입니다. 출입국관리법령상 가장 보편적인 외국인 투자형 체류자격이며, F-2/F-5로 가는 디딤돌로도 자주 활용됩니다.",
            },
            { type: "h2", text: "1. 최소 투자금 기준" },
            {
                type: "p",
                text: "현행 실무상 D-8(기) 신청에는 1억 원 이상의 외국인투자 신고가 요구됩니다. 단, 단순히 자본금 1억 원만 맞추면 되는 것이 아니라 ‘외국인 명의로 송금된 자금’이라는 점이 핵심입니다.",
            },
            {
                type: "list",
                items: [
                    "신청인 본인 명의의 해외 계좌에서 한국 법인 계좌(또는 외국인투자 신고 계좌)로 직접 송금된 흔적이 있어야 함",
                    "제3자 송금, 환치기, 친지 차용금은 자금 출처 입증에서 거의 모두 보완 요청 대상",
                    "원화로 환전된 후의 입금명세서, SWIFT, 외국환은행 외국인투자신고서가 한 세트로 묶여야 함",
                ],
            },
            { type: "h2", text: "2. 실체 심사 — 가장 자주 놓치는 부분" },
            {
                type: "p",
                text: "최근 출입국 실무에서 가장 빈번한 보완 요청은 ‘사업 실체(substance)’ 부족입니다. 자본금 1억 원이 들어왔어도, 사무실이 가상 주소이거나, 매출/세금계산서가 전혀 없거나, 대표 외에 직원이 0명인 상태가 1년 이상 지속되면 갱신 단계에서 거절 위험이 매우 높습니다.",
            },
            {
                type: "callout",
                title: "심사관이 실제로 보는 포인트",
                text: "임대차계약서, 사무실 사진, 명함, 홈페이지, 거래처 견적/세금계산서, 4대보험 가입 직원 1명 이상 — 이 다섯 가지가 사실상 실체 입증의 표준 패키지입니다.",
            },
            { type: "h2", text: "3. 대표자 체류기간과 갱신 전략" },
            {
                type: "p",
                text: "초기 D-8은 1년 단위로 발급되는 경우가 많고, 사업 실적이 누적되어야 2~3년 단위 연장이 가능합니다. 첫 갱신 시점(통상 신청 후 11~12개월)을 기준으로 매출·고용·세무 기록이 어떻게 누적될지 6개월 전부터 역산해서 관리해야 안전합니다.",
            },
            { type: "h3", text: "F-2 / F-5로 이어가려면" },
            {
                type: "p",
                text: "D-8 보유 기간은 F-2(거주) 점수제 가산점과 F-5(영주) 신청을 위한 체류기간 산정에 사용됩니다. 단, F-5 ‘투자가 영주’ 트랙은 별도 금액 기준(통상 5억 원 이상 + 국민 고용)이 적용되므로 D-8 단계에서 자본금 증액과 고용 기록을 어떻게 만들지 미리 설계해야 합니다.",
            },
            {
                type: "callout",
                title: "법률 자문 포인트",
                text: "투자금 송금 → 외국인투자 신고 → 법인 설립 → D-8 신청은 한 흐름이지만, 한 단계에서 형식이 틀어지면 뒷 단계 전체가 무효가 됩니다. 송금 전에 변호사/외국환은행과 시나리오를 먼저 확정하는 것이 가장 비용을 줄이는 길입니다.",
            },
        ],
    },
    {
        slug: "f2-points-system-core",
        title: "F-2 거주비자 점수제 — 합격선과 가산 전략",
        titleEn: "Korea F-2 Residence Visa Points System Explained",
        excerpt:
            "F-2-7(점수제 거주) 비자는 학력·소득·한국어 능력·연령 등 객관 점수의 합이 일정 기준 이상이어야 받을 수 있습니다. 어디서 점수를 잃는지 알면 6개월~1년 안에 합격선 진입이 가능합니다.",
        category: "f-residence",
        keywords: [
            "F-2 비자",
            "F-2-7 점수제",
            "거주비자",
            "한국 영주권 점수제",
            "Korea F-2 visa",
            "Korea residence visa",
            "points-based visa Korea",
        ],
        publishedAt: "2026-05-09",
        readMinutes: 6,
        author: "김앤현 법률사무소",
        body: [
            {
                type: "p",
                text: "F-2-7은 일정 점수 이상을 얻은 외국인에게 거주 자격을 부여하는 점수제 비자입니다. E-7 등 취업 비자로 일정 기간 체류하다가 F-2로 전환하는 경로가 가장 일반적입니다.",
            },
            { type: "h2", text: "1. 점수 항목 구성" },
            {
                type: "list",
                items: [
                    "기본항목: 연령, 학력, 한국어 능력(TOPIK), 소득(연 소득)",
                    "가산항목: 한국 내 사회봉사, 자원봉사, 표창, 한국인 가족 관계, 유학·연수 기간",
                    "감점항목: 출입국법 위반 기록, 세금 체납, 형사기록",
                ],
            },
            { type: "h2", text: "2. 가장 효율적으로 점수를 올리는 방법" },
            {
                type: "p",
                text: "실무상 신청인이 단기간에 점수를 끌어올릴 수 있는 항목은 한국어(TOPIK 등급 상향), 사회통합프로그램(KIIP) 이수 단계, 그리고 소득 입증(연 소득 신고액)입니다. 학력·연령은 사실상 고정이므로 무리하게 시도할 필요가 없습니다.",
            },
            {
                type: "callout",
                title: "TOPIK과 KIIP 중 어느 쪽?",
                text: "둘 다 점수가 잡히지만, KIIP는 한국어와 사회통합을 동시에 충족시켜 가산이 더 큰 경우가 많습니다. 다만 KIIP는 단계마다 시험이 있어 시간이 더 걸리므로, 시급하면 TOPIK 응시가 빠릅니다.",
            },
            { type: "h2", text: "3. 신청 전 체크리스트" },
            {
                type: "list",
                ordered: true,
                items: [
                    "최근 3년 소득금액증명원/원천징수영수증 확보",
                    "TOPIK 또는 KIIP 이수 증빙",
                    "체류 기간 동안의 출입국 기록 검토(위반/오버스테이 확인)",
                    "국세·지방세 완납 증명서",
                    "범죄경력 조회 결과",
                ],
            },
            {
                type: "p",
                text: "점수가 합격선에서 1~2점 부족한 경우, 갱신 일정을 조정해 한 분기 미루면서 가산 항목을 채우는 것이 거절 후 재신청보다 훨씬 안전합니다.",
            },
        ],
    },
    {
        slug: "f5-permanent-residence-checklist",
        title: "F-5 영주권 신청 전 체크리스트 — 거절 사유의 90%는 사전 점검 가능",
        titleEn: "Korea F-5 Permanent Residence Pre-Application Checklist",
        excerpt:
            "F-5(영주) 비자 거절 사례를 분석하면 대부분 신청 전에 충분히 막을 수 있었던 사유입니다. 체류기간 산정 오류, 세금 체납, 가족 동반 요건 누락이 3대 거절 원인입니다.",
        category: "f-residence",
        keywords: [
            "F-5 비자",
            "한국 영주권",
            "영주권 거절",
            "F-5 신청",
            "Korea permanent residence",
            "Korea F-5 visa",
            "Korea PR application",
        ],
        publishedAt: "2026-05-05",
        readMinutes: 8,
        author: "김앤현 법률사무소",
        body: [
            {
                type: "p",
                text: "F-5는 한국의 영주 자격입니다. 한 번 받으면 갱신 부담이 크게 줄고, 자녀 학습·국민건강보험·금융거래에서의 외국인 핸디캡이 거의 사라집니다. 그만큼 심사도 까다롭습니다.",
            },
            { type: "h2", text: "1. 체류기간 산정을 다시 확인하라" },
            {
                type: "p",
                text: "트랙별 체류기간 요건이 다르고(일반 5년, 점수제 3년 등), 출국 기간이 합산에서 어떻게 차감되는지가 가장 흔한 실수입니다. 1년 중 6개월 이상 해외 체류한 해는 ‘국내 체류기간’ 산정에서 제외될 수 있으므로, 출입국 기록을 자체적으로 한 번 재계산하는 것이 안전합니다.",
            },
            { type: "h2", text: "2. 세금·국민연금·건강보험 완납" },
            {
                type: "list",
                items: [
                    "국세 완납증명서",
                    "지방세 완납증명서",
                    "건강보험 보험료 납부확인서",
                    "국민연금 가입증명서 또는 가입대상 제외 증빙",
                ],
            },
            {
                type: "callout",
                title: "체납이 있다면",
                text: "신청 전 분납 약정만 체결되어 있어도 ‘완납’ 상태로 인정되지 않습니다. 가능하면 신청 60일 전까지 일시 완납 후 증명서를 발급받으세요.",
            },
            { type: "h2", text: "3. 가족관계와 거주 안정성" },
            {
                type: "p",
                text: "배우자/자녀가 함께 거주 중이라면 가족관계증명, 혼인신고(또는 본국 결혼증명 + 아포스티유) 등을 함께 준비합니다. 가족이 본국에 떨어져 있는 경우 ‘국내 정착 의사’ 입증을 위한 보완 서류가 더 요구될 수 있습니다.",
            },
            { type: "h2", text: "4. 자주 놓치는 마지막 한 가지" },
            {
                type: "p",
                text: "신청 직전 6개월 이내의 출입국법 위반(과태료 부과 사실 포함), 단순 교통법규 외 형사기록이 있으면 거절 가능성이 매우 높습니다. 본인이 무관하다고 생각하는 ‘즉결심판’ 기록도 조회에 포함되므로 반드시 사전 확인이 필요합니다.",
            },
            {
                type: "callout",
                title: "비자 가능성 무료 진단",
                text: "체류기간·세금·범죄경력 세 가지를 1~2분 만에 자가 진단할 수 있습니다. 결과에 따라 추가 자료가 필요하면 변호사 상담으로 바로 이어집니다.",
            },
        ],
    },
    {
        slug: "foreign-corporate-setup-pitfalls",
        title: "외국인 법인설립 시 자주 생기는 문제 — FDI 신고부터 정관까지",
        titleEn: "Common Pitfalls When a Foreigner Establishes a Korean Corporation",
        excerpt:
            "외국인 법인설립은 한국인 설립과 절차가 비슷해 보이지만, ‘외국인투자촉진법’이 따로 적용됩니다. FDI 신고 시점, 자본금 송금 방식, 정관·임원 구성에서 실수가 가장 잦습니다.",
        category: "corporate",
        keywords: [
            "외국인 법인설립",
            "FDI 신고",
            "외국인투자촉진법",
            "한국 법인 설립",
            "Korea company formation foreigner",
            "FDI Korea filing",
            "Korea corporate setup",
        ],
        publishedAt: "2026-05-02",
        readMinutes: 7,
        author: "김앤현 법률사무소",
        body: [
            {
                type: "p",
                text: "외국인이 한국에서 법인을 설립할 때는 일반 상법상 절차에 더해 외국인투자촉진법상 FDI(외국인투자) 신고 절차가 별도로 적용됩니다. 두 절차의 순서를 잘못 잡으면 자본금을 보낸 뒤에도 ‘외국인투자’로 인정받지 못하는 일이 생깁니다.",
            },
            { type: "h2", text: "1. 신고 → 송금 → 등기 순서를 반드시 지킬 것" },
            {
                type: "list",
                ordered: true,
                items: [
                    "외국환은행에 외국인투자 신고 (사전 신고)",
                    "신고 후 외국인 명의 해외 계좌에서 한국 법인 자본금 계좌로 송금",
                    "송금 확인 후 법인 설립 등기",
                    "등기 완료 후 외국인투자기업 등록",
                ],
            },
            {
                type: "callout",
                title: "흔한 실수",
                text: "‘일단 자본금을 미리 보내두고 신고는 나중에’ 하는 방식은 외국환거래법 위반이 될 수 있고, 외국인투자기업 등록 자체가 거절될 수 있습니다.",
            },
            { type: "h2", text: "2. 정관·임원 구성 체크포인트" },
            {
                type: "p",
                text: "외국인 단독 대표가 한국에 체류하지 않는 상태로 법인을 운영하면, 사업장 실체 문제로 D-8 갱신·F-2 가산 심사에서 불리해질 수 있습니다. 가능한 경우 한국 거주 임원 1명을 함께 등재하거나, 대표의 한국 체류일수가 일정 수준 이상이 되도록 일정을 관리해야 합니다.",
            },
            { type: "h2", text: "3. 업종 선택과 인허가" },
            {
                type: "p",
                text: "FDI는 모든 업종에 무제한 허용되지 않습니다. 제한·금지 업종(방위산업, 일부 통신·언론 등) 또는 인허가 업종(요식업·여행업·교육업 등)은 별도 라이선스를 먼저 확보해야 법인 설립이 의미가 있습니다. 업종코드 결정 단계에서 변호사·세무사 협의를 권장합니다.",
            },
        ],
    },
    {
        slug: "responding-to-immigration-rfe-and-refusal",
        title: "출입국 거절·보완 요청을 받았을 때 대응 — 7일·14일이 결정한다",
        titleEn: "What To Do When You Receive a Korean Immigration RFE or Refusal",
        excerpt:
            "출입국 사무소로부터 보완 요청 또는 거절 통지를 받으면 가장 먼저 봐야 할 것은 기한입니다. 보완 기한은 통상 7~14일, 행정심판/이의신청 기한도 짧아 첫 반응 속도가 결과를 좌우합니다.",
        category: "immigration-practice",
        keywords: [
            "출입국 거절",
            "비자 거절 대응",
            "출입국 보완 요청",
            "이의신청",
            "Korea visa refusal",
            "Korea immigration appeal",
            "RFE Korea visa",
        ],
        publishedAt: "2026-04-27",
        readMinutes: 6,
        author: "김앤현 법률사무소",
        body: [
            {
                type: "p",
                text: "출입국·외국인청에서 비자 또는 체류자격 신청에 대해 ‘보완 요청’ 또는 ‘불허(거절)’ 통지를 받으면, 그 자체는 끝이 아닙니다. 다만 다음 단계에 시간 제한이 매우 짧기 때문에 첫 일주일이 결정적입니다.",
            },
            { type: "h2", text: "1. 보완 요청을 받았을 때" },
            {
                type: "list",
                items: [
                    "기한 확인 — 통상 7~14일",
                    "요청된 서류의 ‘실질’이 무엇인지 파악 (예: ‘사업 실체 증빙’은 단순 임대차계약서가 아니라 매출·고용·세무 기록 패키지를 요구할 수 있음)",
                    "기한 내 제출이 어려우면 사전에 연장 요청 가능 — 다만 1회로 제한",
                ],
            },
            { type: "h2", text: "2. 거절(불허)을 받았을 때" },
            {
                type: "p",
                text: "거절은 ‘재신청’과 ‘이의신청/행정심판’ 두 갈래입니다. 재신청은 새로운 사유가 있을 때 유리하고, 이의신청·행정심판은 원처분의 위법·부당을 다투는 절차입니다. 기한이 짧으니(통상 90일 이내) 거절 사유서를 받자마자 검토해야 합니다.",
            },
            {
                type: "callout",
                title: "어느 쪽을 선택해야 하나",
                text: "거절 사유가 ‘서류 부족’이면 보완해서 재신청이 빠르고, ‘판단 자체에 다툼 여지’가 있으면 행정심판이 효과적입니다. 변호사 검토 없이 자체 판단으로 재신청을 했다가 같은 사유로 또 거절되면 다음 신청에서 더 불리해집니다.",
            },
            { type: "h2", text: "3. 다음 신청·체류에 미치는 영향" },
            {
                type: "p",
                text: "거절 기록 자체가 영구적인 ‘낙인’은 아니지만, 동일 비자종류 반복 거절은 점수제 심사·F-5 신청 단계에서 부정적 요소로 작용합니다. 첫 거절을 어떻게 마무리하느냐가 향후 2~3년 비자 전략 전체에 영향을 줍니다.",
            },
        ],
    },
];

export const blogPostsSortedByDate = [...blogPosts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
);

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
}

export function getCategoryById(id: BlogCategoryId): BlogCategory | undefined {
    return BLOG_CATEGORIES.find((c) => c.id === id);
}

export function getPostsByCategory(id: BlogCategoryId): BlogPost[] {
    return blogPostsSortedByDate.filter((post) => post.category === id);
}
