import os
import json
import requests
import base64
import google.generativeai as genai
from serpapi import GoogleSearch
from dotenv import load_dotenv
from datetime import datetime

# ==========================================
# 1. 설정 (API 키 및 워드프레스 정보)
# ==========================================
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
WP_URL = os.getenv("WP_URL", "https://your-domain.com/wp-json/wp/v2/posts")
WP_USER = os.getenv("WP_USER")
WP_APP_PASS = os.getenv("WP_APP_PASS")

# Gemini 설정
genai.configure(api_key=GEMINI_API_KEY)

# ==========================================
# 2. 안티그래비티 프롬프트 (템플릿)
# ==========================================

# [프롬프트 A] 검색 키워드 추출용 (가볍고 빠른 모델 사용)
PROMPT_EXTRACT_KEYWORDS = """
너는 유능한 법률 연구원이야. 아래 판결문 내용을 바탕으로 구글 뉴스에서 관련 사건을 찾기 위한 '검색 쿼리' 3개를 만들어줘.
반드시 사건번호, 핵심 당사자 이름(비실명화 된 경우 제외), 혐의, 주요 사건 키워드를 조합해.
출력은 오직 콤마(,)로 구분된 키워드 문자열만 내보내. (예: 2023도1234, 김씨 사기 사건, 강남구 오피스텔 분양 사기)

[판결문]:
{ruling_text}
"""

# [프롬프트 B] 최종 블로그 글 생성용
PROMPT_GENERATE_BLOG = """
[Role]
You are a professional legal content editor specializing in SEO-optimized legal news.

[Input Data]
1. 판결문 텍스트:
{ruling_text}

2. 관련 뉴스 후보군 (시스템이 검색함):
{news_candidates}

[Task Instruction]
1) 판결문에서: 사건 개요(확실한 범위), 쟁점, 법원의 판단 핵심, 결론(주문/취지)을 추출하라.
2) 뉴스 후보에서: 판결/사건과 직접 관련된 것만 최대 5개 선별하라. (관련 없으면 0개)
3) 본문은 아래 구조로 작성하라. 반드시 '확실한 사실'만:
   - H2: 한줄 요약
   - H2: 사건 개요(확인된 사실만)
   - H2: 주요 쟁점
   - H2: 법원의 판단(판결문 근거 중심)
   - H2: 관련 보도에서 확인되는 사실(각 항목에 언론사/날짜/링크 표기. 추정 금지)
   - H2: 실무 체크포인트(일반론만, 단정/자문 금지)
   - H2: 면책문구(정보제공 목적, 법률자문 아님)
4) SEO를 위해: 제목은 40~60자 내, 요약(excerpt)은 120~160자 내.
5) 출력은 워드프레스 업로드용 JSON 형식으로만.

[사실/법적 안전 규칙]
- 판결문과 제공된 뉴스 후보에서 '명시적으로 확인되는 사실'만 사용한다.
- 추측, 전망, 단정, 비난, 인신공격, 선정적 표현, 과장, 사실관계 추정은 금지한다.
- 판결문에 없는 사실관계(예: 당사자 행동/동기/추가 경위)는 쓰지 않는다.
- 불명확하면 "확인되지 않음"으로 판단하고 본문에서 제외한다.
- 실명/연락처/주소/주민번호/계좌/차량번호 등 식별정보는 전부 익명화(예: A씨, B회사)한다.
- 허위사실·명예훼손 위험이 있으면 해당 문장을 삭제하고, 안전한 일반론으로 대체한다.
- 법률자문처럼 "~해야 한다/~하면 된다" 단정 금지. "일반적으로 ~로 알려져 있다/검토가 필요하다" 수준의 일반론만 허용.

[JSON Schema Requirement]
{{
  "title": "String (40-60자, SEO 최적화)",
  "slug": "String (lowercase, hyphen only)",
  "excerpt": "String (120-160자, 메타 설명용)",
  "content_html": "String (HTML formatted content with H2 tags)",
  "categories": [1],
  "tags": ["String", "String"],
  "status": "draft",
  "sources": [
    {{"title":"String","date":"String","link":"String"}}
  ],
  "safety_checks": {{
    "no_speculation": true,
    "no_pii": true,
    "only_verifiable_facts": true
  }}
}}
"""

# ==========================================
# 3. 기능 모듈 (Functions)
# ==========================================

def get_search_keywords(ruling_text):
    """1단계: 판결문에서 검색 키워드 추출"""
    print("🔎 [1/4] 판결문 분석 및 키워드 추출 중...")
    
    model = genai.GenerativeModel('models/gemini-2.5-flash')
    response = model.generate_content(
        PROMPT_EXTRACT_KEYWORDS.format(ruling_text=ruling_text[:3000]),
        generation_config=genai.types.GenerationConfig(
            temperature=0.3,
        )
    )
    keywords = response.text.strip()
    print(f"✅ 추출된 키워드: {keywords}\n")
    return keywords

def search_news(query):
    """2단계: 구글 뉴스 검색 (SerpApi)"""
    print(f"🔍 [2/4] 뉴스 검색 중: {query}")
    
    if not SERPAPI_KEY:
        print("⚠️  SerpApi 키가 없습니다. 뉴스 검색을 건너뜁니다.")
        return "관련 뉴스 없음 (SerpApi 키 미설정)"
    
    params = {
        "engine": "google",
        "q": query,
        "tbm": "nws",
        "api_key": SERPAPI_KEY,
        "gl": "kr", 
        "hl": "ko",
        "num": 10
    }
    
    try:
        search = GoogleSearch(params)
        results = search.get_dict().get("news_results", [])
        
        # 프롬프트에 넣기 좋게 텍스트로 변환
        news_text = ""
        for idx, item in enumerate(results[:10]):
            news_text += f"[{idx+1}] 제목: {item.get('title', 'N/A')}\n"
            news_text += f"링크: {item.get('link', 'N/A')}\n"
            news_text += f"날짜: {item.get('date', 'N/A')}\n"
            news_text += f"요약: {item.get('snippet', 'N/A')}\n\n"
        
        if news_text:
            print(f"✅ {len(results)}개의 뉴스 발견\n")
            return news_text
        else:
            print("⚠️  관련 뉴스를 찾지 못했습니다.\n")
            return "관련 뉴스 없음."
    except Exception as e:
        print(f"❌ 뉴스 검색 실패: {str(e)}\n")
        return f"뉴스 검색 실패: {str(e)}"

def generate_content(ruling_text, news_text):
    """3단계: JSON 콘텐츠 생성"""
    print("📝 [3/4] SEO 최적화 콘텐츠 생성 중 (Gemini Pro)...")
    
    try:
        model = genai.GenerativeModel(
            'models/gemini-2.5-flash',
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        prompt = f"""You are a JSON generator. Output only valid JSON. 반드시 한국어로 작성하되 JSON 키는 영문으로 유지.

{PROMPT_GENERATE_BLOG.format(ruling_text=ruling_text, news_candidates=news_text)}"""
        
        response = model.generate_content(prompt)
        
        # JSON 파싱 시도
        try:
            content = json.loads(response.text)
        except json.JSONDecodeError:
            # 마크다운 코드블록 제거 시도
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            content = json.loads(text.strip())
        
        print("✅ 콘텐츠 생성 완료\n")
        return content
    except Exception as e:
        print(f"❌ 콘텐츠 생성 실패: {str(e)}\n")
        raise

def upload_to_wordpress(post_data):
    """4단계: 워드프레스 업로드"""
    print("🚀 [4/4] 워드프레스 업로드 중...")
    
    if not WP_USER or not WP_APP_PASS:
        print("⚠️  워드프레스 인증 정보가 없습니다. 로컬에 JSON 저장만 수행합니다.")
        save_to_local(post_data)
        return
    
    credentials = f"{WP_USER}:{WP_APP_PASS}"
    token = base64.b64encode(credentials.encode()).decode()
    headers = {
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json"
    }
    
    # JSON 데이터를 WP API 필드에 매핑
    payload = {
        "title": post_data.get('title', '제목 없음'),
        "content": post_data.get('content_html', ''),
        "status": post_data.get('status', 'draft'),
        "slug": post_data.get('slug', ''),
        "excerpt": post_data.get('excerpt', ''),
        "categories": post_data.get('categories', [1]),
    }
    
    try:
        res = requests.post(WP_URL, headers=headers, json=payload, timeout=30)
        if res.status_code == 201:
            post_url = res.json().get('link', 'N/A')
            print(f"✅ 업로드 성공! 링크: {post_url}")
            print(f"📊 상태: {payload['status']}")
        else:
            print(f"❌ 업로드 실패 (Status {res.status_code}): {res.text}")
            save_to_local(post_data)
    except Exception as e:
        print(f"❌ 업로드 실패: {str(e)}")
        save_to_local(post_data)

def save_to_local(post_data):
    """로컬에 JSON 저장 (백업용)"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"output_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(post_data, f, ensure_ascii=False, indent=2)
    
    print(f"💾 로컬 저장 완료: {filename}")

def read_ruling_from_file(filepath):
    """파일에서 판결문 읽기"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

# ==========================================
# 4. 실행 (Main Execution)
# ==========================================

if __name__ == "__main__":
    print("=" * 60)
    print("⚡ ANTIGRAVITY ENGINE - 법률 콘텐츠 자동화 시스템")
    print("=" * 60)
    print()
    
    # [옵션 1] 직접 텍스트 입력
    # ruling_input = """
    # [여기에 대법원 혹은 하급심 판결문 텍스트 전체를 붙여넣으세요]
    # """
    
    # [옵션 2] 파일에서 읽기 (테스트용)
    ruling_input = read_ruling_from_file("test_ruling.txt")
    
    # 입력 검증
    if len(ruling_input.strip()) < 100:
        print("❌ 오류: 판결문이 너무 짧습니다.")
        print("💡 'test_ruling.txt' 파일을 확인하거나 코드 내에서 직접 입력하세요.")
        exit(1)
    
    try:
        # 1. 키워드 추출
        keywords = get_search_keywords(ruling_input)
        
        # 2. 뉴스 검색
        news_data = search_news(keywords)
        
        # 3. 콘텐츠 생성
        blog_json = generate_content(ruling_input, news_data)
        
        # 4. 워드프레스 업로드
        upload_to_wordpress(blog_json)
        
        print()
        print("=" * 60)
        print("✅ 모든 작업이 완료되었습니다!")
        print("=" * 60)
        
    except KeyboardInterrupt:
        print("\n\n⚠️  사용자에 의해 중단되었습니다.")
    except Exception as e:
        print(f"\n\n❌ 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()
