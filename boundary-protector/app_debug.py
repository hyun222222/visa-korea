"""
디버그용 간단한 지도 테스트
"""

import streamlit as st

st.set_page_config(page_title="지도 테스트", layout="wide")

st.title("🗺️ 지도 렌더링 디버그 테스트")

st.write("## 1단계: Streamlit이 작동하는지 확인")
st.success("✅ 이 메시지가 보이면 Streamlit은 작동합니다!")

st.write("## 2단계: Folium 임포트 테스트")
try:
    import folium
    from streamlit_folium import st_folium
    st.success("✅ Folium 라이브러리가 정상적으로 로드되었습니다!")
except Exception as e:
    st.error(f"❌ Folium 임포트 실패: {e}")
    st.stop()

st.write("## 3단계: 기본 지도 생성 테스트")
try:
    # 서울 시청 좌표로 매우 간단한 지도 생성
    m = folium.Map(
        location=[37.5665, 126.9780],
        zoom_start=15
    )
    st.success("✅ Folium 지도 객체가 생성되었습니다!")
    
    # 지도 HTML 미리보기
    map_html = m._repr_html_()
    st.write(f"생성된 HTML 크기: {len(map_html)} bytes")
    
except Exception as e:
    st.error(f"❌ 지도 생성 실패: {e}")
    st.stop()

st.write("## 4단계: Streamlit에서 지도 렌더링 테스트")
st.write("👇 아래에 지도가 나타나야 합니다:")

try:
    st_folium(m, width=700, height=500)
    st.success("✅ st_folium 호출이 완료되었습니다!")
except Exception as e:
    st.error(f"❌ 지도 렌더링 실패: {e}")
    import traceback
    st.code(traceback.format_exc())

st.write("---")
st.write("### 결과 확인")
st.write("위에 지도가 보이지 않는다면, 아래 정보를 캡처해주세요:")
st.write("1. 이 페이지 전체 스크린샷")
st.write("2. 브라우저 개발자 도구(F12) → Console 탭의 에러 메시지")
