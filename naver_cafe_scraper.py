import time
import sys
import re
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

def convert_to_classic_url(url):
    """
    모바일/최신 프론트엔드 URL을 iframe 호환 클래식 URL로 변환
    예: https://cafe.naver.com/f-e/cafes/31619814/menus/2 
    -> https://cafe.naver.com/ArticleList.nhn?search.clubid=31619814&search.menuid=2&search.boardtype=L
    """
    if "ArticleList.nhn" in url:
        return url
        
    pattern = r"cafes/(\d+)/menus/(\d+)"
    match = re.search(pattern, url)
    if match:
        clubid = match.group(1)
        menuid = match.group(2)
        print("💡 모바일/최신 URL 감지됨 -> 클래식 호환 URL로 변환합니다.")
        return f"https://cafe.naver.com/ArticleList.nhn?search.clubid={clubid}&search.menuid={menuid}&search.boardtype=L"
    
    return url

def scrape_naver_cafe():
    # 수집할 URL 목록 (사용자 제공)
    target_urls = [
        "https://cafe.naver.com/f-e/cafes/31619814/menus/2",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/3",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/4",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/5",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/6",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/7",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/8",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/9",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/10",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/11",
        "https://cafe.naver.com/f-e/cafes/31619814/menus/1"
    ]

    # 1. 설정 (Headless 모드 옵션)
    chrome_options = Options()
    # chrome_options.add_argument("--headless") # 창 안 띄우기 (필요시 주석 해제)
    # chrome_options.add_argument("--no-sandbox")
    # chrome_options.add_argument("--disable-dev-shm-usage")
    
    # 봇 탐지 방지를 위한 추가 옵션
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # 브라우저 실행
    print("브라우저를 실행합니다...")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    all_titles = []

    try:
        for idx, url in enumerate(target_urls):
            current_url = convert_to_classic_url(url)
            print(f"\n[{idx+1}/{len(target_urls)}] 접속 중: {current_url}")
            
            try:
                driver.get(current_url)
                time.sleep(3) # 페이지 로딩 대기

                # 2. 접속: iframe 내부로 진입
                try:
                    driver.switch_to.default_content() # 초기화
                    driver.switch_to.frame("cafe_main")
                    print("iframe(cafe_main) 전환 성공")
                except:
                    print("iframe 전환 실패 (계속 진행)")

                # 4. 페이지네이션 (최대 1000페이지까지 수집하도록 수정)
                page = 1
                max_pages = 1000 
                
                while page <= max_pages:
                    print(f"  >>> {page} 페이지 수집 중...")
                    
                    try:
                        titles = driver.find_elements(By.CSS_SELECTOR, "a.article")
                        if not titles:
                            print("  (게시글 없음)")
                        
                        prev_len = len(all_titles)
                        for t in titles:
                            title_text = t.text.strip()
                            if title_text:
                                all_titles.append(title_text)
                                # print(f"수집: {title_text}") # 출력 줄임
                        
                        current_count = len(all_titles)
                        print(f"  (현재 총 {current_count}개)")

                        if current_count == prev_len and page > 1:
                            print("  (새로운 글 없음 → 다음 게시판으로 이동)")
                            break

                    except Exception as e:
                        print(f"  데이터 수집 에러: {e}")

                    # 5. 차단 방지: 페이지 넘김
                    try:
                        next_page_btn = driver.find_element(By.XPATH, f"//a[text()='{page + 1}']")
                        next_page_btn.click()
                        page += 1
                        time.sleep(1.5)
                    except:
                        try:
                            next_arrow = driver.find_element(By.CSS_SELECTOR, "a.next")
                            next_arrow.click()
                            page += 1
                            time.sleep(1.5)
                        except:
                            print("  (마지막 페이지 도달)")
                            break
            except Exception as e:
                print(f"게시판 처리 중 에러: {e}")
                continue
        
        # 6. 저장
        if all_titles:
            # 중복 제거 (선택 사항)
            # all_titles = list(set(all_titles))
            
            df = pd.DataFrame(all_titles, columns=["제목"])
            df.to_csv("cafe_titles.csv", index=False, encoding="utf-8-sig")
            print(f"\n✅ 완료! 총 {len(all_titles)}개의 제목을 'cafe_titles.csv'로 저장했습니다.")
        else:
            print("\n수집된 데이터가 없습니다.")

    except Exception as e:
        print(f"\n전체 에러 발생: {e}")
    finally:
        print("브라우저를 종료합니다.")
        driver.quit()

if __name__ == "__main__":
    scrape_naver_cafe()
