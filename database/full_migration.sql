-- ============================================================
-- Korea Visa Law — Full Database Migration
-- Run this ONCE in Supabase SQL Editor.
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
-- ============================================================

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 1: Blog Posts Table
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_minutes INTEGER NOT NULL DEFAULT 5,
    author TEXT NOT NULL DEFAULT '김앤현 법률사무소',
    body JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read blog_posts" ON blog_posts;
CREATE POLICY "Allow public read blog_posts" ON blog_posts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow auth write blog_posts" ON blog_posts;
CREATE POLICY "Allow auth write blog_posts" ON blog_posts
    FOR ALL TO authenticated USING (true);


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 2: Board Posts Table (Bulletin Board)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Notice',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
DROP POLICY IF EXISTS "Allow public read posts" ON posts;
CREATE POLICY "Allow public read posts" ON posts
    FOR SELECT USING (is_published = true);

-- Only authenticated users (admin) can create/update/delete
DROP POLICY IF EXISTS "Allow auth insert posts" ON posts;
CREATE POLICY "Allow auth insert posts" ON posts
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow auth update posts" ON posts;
CREATE POLICY "Allow auth update posts" ON posts
    FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow auth delete posts" ON posts;
CREATE POLICY "Allow auth delete posts" ON posts
    FOR DELETE TO authenticated USING (true);


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 3: Seed Data — Blog Posts (5 articles)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO blog_posts (slug, title, title_en, excerpt, category, keywords, published_at, read_minutes, author, body) VALUES
(
  'd8-investor-visa-basics',
  '한국 투자비자 D-8 기본 요건 — 자본금·송금·실체심사',
  'Korea D-8 Investor Visa: Capital, Remittance, and Substance Review',
  '외국인이 한국에서 법인을 세우고 받는 가장 일반적인 장기 체류 비자가 D-8입니다. 1억 원 자본금만 맞추면 끝이라는 오해가 많지만, 실제 심사는 송금 경로·사업 실체·대표이사 체류 적정성까지 종합적으로 봅니다.',
  'investor',
  ARRAY['D-8 비자','한국 투자비자','외국인 투자','기업투자 비자','Korea D-8 visa','Korea investor visa','Korea business visa','FDI Korea'],
  '2026-05-12T00:00:00Z', 7, '김앤현 법률사무소',
  '[{"type":"p","text":"D-8 (기업투자) 비자는 외국인이 한국에 법인을 설립하고 그 법인을 경영·관리하기 위해 받는 비자입니다. 출입국관리법령상 가장 보편적인 외국인 투자형 체류자격이며, F-2/F-5로 가는 디딤돌로도 자주 활용됩니다."},{"type":"h2","text":"1. 최소 투자금 기준"},{"type":"p","text":"현행 실무상 D-8(기) 신청에는 1억 원 이상의 외국인투자 신고가 요구됩니다. 단, 단순히 자본금 1억 원만 맞추면 되는 것이 아니라 외국인 명의로 송금된 자금이라는 점이 핵심입니다."},{"type":"list","items":["신청인 본인 명의의 해외 계좌에서 한국 법인 계좌로 직접 송금된 흔적이 있어야 함","제3자 송금, 환치기, 친지 차용금은 자금 출처 입증에서 거의 모두 보완 요청 대상","원화로 환전된 후의 입금명세서, SWIFT, 외국환은행 외국인투자신고서가 한 세트로 묶여야 함"]},{"type":"h2","text":"2. 실체 심사 — 가장 자주 놓치는 부분"},{"type":"p","text":"최근 출입국 실무에서 가장 빈번한 보완 요청은 사업 실체(substance) 부족입니다."},{"type":"callout","title":"심사관이 실제로 보는 포인트","text":"임대차계약서, 사무실 사진, 명함, 홈페이지, 거래처 견적/세금계산서, 4대보험 가입 직원 1명 이상 — 이 다섯 가지가 사실상 실체 입증의 표준 패키지입니다."},{"type":"h2","text":"3. 대표자 체류기간과 갱신 전략"},{"type":"p","text":"초기 D-8은 1년 단위로 발급되는 경우가 많고, 사업 실적이 누적되어야 2~3년 단위 연장이 가능합니다."}]'::jsonb
),
(
  'f2-points-system-core',
  'F-2 거주비자 점수제 — 합격선과 가산 전략',
  'Korea F-2 Residence Visa Points System Explained',
  'F-2-7(점수제 거주) 비자는 학력·소득·한국어 능력·연령 등 객관 점수의 합이 일정 기준 이상이어야 받을 수 있습니다.',
  'f-residence',
  ARRAY['F-2 비자','F-2-7 점수제','거주비자','한국 영주권 점수제','Korea F-2 visa','Korea residence visa','points-based visa Korea'],
  '2026-05-09T00:00:00Z', 6, '김앤현 법률사무소',
  '[{"type":"p","text":"F-2-7은 일정 점수 이상을 얻은 외국인에게 거주 자격을 부여하는 점수제 비자입니다."},{"type":"h2","text":"1. 점수 항목 구성"},{"type":"list","items":["기본항목: 연령, 학력, 한국어 능력(TOPIK), 소득","가산항목: 사회봉사, 표창, 한국인 가족 관계, 유학·연수 기간","감점항목: 출입국법 위반 기록, 세금 체납, 형사기록"]},{"type":"h2","text":"2. 가장 효율적으로 점수를 올리는 방법"},{"type":"p","text":"실무상 단기간에 점수를 끌어올릴 수 있는 항목은 한국어(TOPIK), 사회통합프로그램(KIIP), 소득 입증입니다."},{"type":"callout","title":"TOPIK과 KIIP 중 어느 쪽?","text":"KIIP는 한국어와 사회통합을 동시에 충족시켜 가산이 더 큰 경우가 많습니다."}]'::jsonb
),
(
  'f5-permanent-residence-checklist',
  'F-5 영주권 신청 전 체크리스트 — 거절 사유의 90%는 사전 점검 가능',
  'Korea F-5 Permanent Residence Pre-Application Checklist',
  'F-5(영주) 비자 거절 사례를 분석하면 대부분 신청 전에 충분히 막을 수 있었던 사유입니다.',
  'f-residence',
  ARRAY['F-5 비자','한국 영주권','영주권 거절','Korea permanent residence','Korea F-5 visa','Korea PR application'],
  '2026-05-05T00:00:00Z', 8, '김앤현 법률사무소',
  '[{"type":"p","text":"F-5는 한국의 영주 자격입니다. 한 번 받으면 갱신 부담이 크게 줄어듭니다."},{"type":"h2","text":"1. 체류기간 산정을 다시 확인하라"},{"type":"p","text":"트랙별 체류기간 요건이 다르고, 출국 기간이 합산에서 어떻게 차감되는지가 가장 흔한 실수입니다."},{"type":"h2","text":"2. 세금·국민연금·건강보험 완납"},{"type":"list","items":["국세 완납증명서","지방세 완납증명서","건강보험 보험료 납부확인서","국민연금 가입증명서 또는 가입대상 제외 증빙"]},{"type":"callout","title":"체납이 있다면","text":"신청 전 분납 약정만 체결되어 있어도 완납 상태로 인정되지 않습니다."}]'::jsonb
),
(
  'foreign-corporate-setup-pitfalls',
  '외국인 법인설립 시 자주 생기는 문제 — FDI 신고부터 정관까지',
  'Common Pitfalls When a Foreigner Establishes a Korean Corporation',
  '외국인 법인설립은 한국인 설립과 절차가 비슷해 보이지만, 외국인투자촉진법이 따로 적용됩니다.',
  'corporate',
  ARRAY['외국인 법인설립','FDI 신고','외국인투자촉진법','Korea company formation foreigner','FDI Korea filing'],
  '2026-05-02T00:00:00Z', 7, '김앤현 법률사무소',
  '[{"type":"p","text":"외국인이 한국에서 법인을 설립할 때는 일반 상법상 절차에 더해 FDI 신고 절차가 별도로 적용됩니다."},{"type":"h2","text":"1. 신고 → 송금 → 등기 순서를 반드시 지킬 것"},{"type":"list","ordered":true,"items":["외국환은행에 외국인투자 신고","신고 후 해외 계좌에서 한국 법인 자본금 계좌로 송금","송금 확인 후 법인 설립 등기","등기 완료 후 외국인투자기업 등록"]},{"type":"callout","title":"흔한 실수","text":"일단 자본금을 미리 보내두고 신고는 나중에 하는 방식은 외국환거래법 위반이 될 수 있습니다."}]'::jsonb
),
(
  'responding-to-immigration-rfe-and-refusal',
  '출입국 거절·보완 요청을 받았을 때 대응 — 7일·14일이 결정한다',
  'What To Do When You Receive a Korean Immigration RFE or Refusal',
  '출입국 사무소로부터 보완 요청 또는 거절 통지를 받으면 가장 먼저 봐야 할 것은 기한입니다.',
  'immigration-practice',
  ARRAY['출입국 거절','비자 거절 대응','출입국 보완 요청','Korea visa refusal','Korea immigration appeal'],
  '2026-04-27T00:00:00Z', 6, '김앤현 법률사무소',
  '[{"type":"p","text":"출입국·외국인청에서 보완 요청 또는 불허 통지를 받으면, 그 자체는 끝이 아닙니다. 다만 다음 단계에 시간 제한이 매우 짧습니다."},{"type":"h2","text":"1. 보완 요청을 받았을 때"},{"type":"list","items":["기한 확인 — 통상 7~14일","요청된 서류의 실질이 무엇인지 파악","기한 내 제출이 어려우면 사전에 연장 요청 가능"]},{"type":"h2","text":"2. 거절(불허)을 받았을 때"},{"type":"p","text":"거절은 재신청과 이의신청/행정심판 두 갈래입니다."},{"type":"callout","title":"어느 쪽을 선택해야 하나","text":"거절 사유가 서류 부족이면 보완해서 재신청이 빠르고, 판단 자체에 다툼 여지가 있으면 행정심판이 효과적입니다."}]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;


-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART 4: Seed Data — Board Posts (3 notices)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSERT INTO posts (title, content, category, is_published) VALUES
(
    '2026년 하반기 E-7-4 비자 전환 신청 일정 안내',
    '2026년 하반기 숙련기능인력(E-7-4) 전환 신청 일정이 공고되었습니다. 이번 선발은 K-Point 선발 기준이 전년 대비 소폭 조정되었으므로, 본 사이트의 E-7-4 계산기를 이용해 자격 요건을 미리 진단해 보시기 바랍니다.

[주요 변경 내용]
1. 소득 조건 배점 변경
2. 한국어 능력 가점 항목 신설

신청 기간: 2026년 9월 1일 ~ 9월 15일
접수 방법: 하이코리아(HiKorea) 온라인 신청',
    'Notice',
    true
),
(
    'F-2-7 점수제 비자 연장 심사 기준 강화 조치 요약',
    '법무부 출입국관리국에서 F-2-7 우수인재 거주 비자 소지자의 연장 신청 시 소득 증빙 요건 및 한국어 성적 검증을 강화하겠다는 지침을 내렸습니다.

특히 직전 연도 소득이 GNI 1배수 미만일 경우 가점이 대폭 차감되며 연장 기간이 제한될 수 있습니다.',
    'Visa News',
    true
),
(
    'D-10 구직 비자에서 E-7 특정활동 비자 변경 시 인턴십 경력 인정 Q&A',
    'Q: 한국 대학 졸업 후 D-10 비자로 구직 중인데, 국내 IT 벤처기업에서 3개월 동안 근무했습니다. 이 인턴 경력이 E-7 고용추천서 발급이나 실무 경력 1년 기준에 반영될 수 있을까요?

A: D-10 구직 비자 상태에서의 합법적인 인턴 활동은 E-7 고용추천서 발급 시 우호적인 참작 요소가 됩니다. 다만, 법적인 실무 경력 조건 자체를 대체할 수는 없으므로 정식 학위 취득 시점 이후의 상근직 근무 경력증명서가 필요합니다.',
    'Q&A',
    true
);
