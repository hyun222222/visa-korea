"""
경계침범 프로텍터 (Boundary Trespass Protector)
변호사를 위한 토지 경계 분쟁 분석 웹 애플리케이션

V-World API를 활용하여 위성지도 위에 연속지적도를 중첩 표시합니다.
"""

import streamlit as st
import folium
from streamlit_folium import st_folium
import requests
import json
import time

# V-World API 키
VWORLD_API_KEY = "52A793EE-1EE9-3355-95AD-C087CB071EC8"

# 페이지 설정
st.set_page_config(
    page_title="경계침범 프로텍터 - 법률 분석 시스템",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 커스텀 CSS 스타일
st.markdown("""
    <style>
    .stApp { background-color: #f8f9fa; }
    .main-title {
        color: #001f3f;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 2.2rem;
        font-weight: 700;
        text-align: center;
        padding: 1rem 0;
        margin-bottom: 0.5rem;
    }
    .subtitle {
        color: #666;
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 2rem;
        border-bottom: 2px solid #d4af37;
        padding-bottom: 1rem;
    }
    .guide-box {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .step-number {
        background-color: #001f3f;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: inline-block;
        text-align: center;
        line-height: 24px;
        margin-right: 8px;
        font-weight: bold;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        font-size: 0.9rem;
    }
    .legend-color {
        width: 15px;
        height: 15px;
        margin-right: 8px;
        border-radius: 3px;
    }
    .analysis-result {
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        color: #856404;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
    }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
""", unsafe_allow_html=True)

# 메인 타이틀
st.markdown('<div class="main-title">⚖️ 경계침범 프로텍터</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">토지 경계 분쟁 해결을 위한 법률 분석 솔루션</div>', unsafe_allow_html=True)

# 사용자 가이드 섹션 (상단 배치)
with st.expander("📖 사용 가이드: 경계 침범 여부를 어떻게 확인하나요?", expanded=True):
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("""
        <div class="guide-box">
            <h4><span class="step-number">1</span>주소 검색</h4>
            <p>분쟁이 발생한 토지의 주소를 입력하여 해당 위치로 이동합니다.</p>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="guide-box">
            <h4><span class="step-number">2</span>경계 확인</h4>
            <p><strong>빨간색 선(지적도)</strong>이 법적 경계입니다. 실제 건물(위성사진)이 이 선을 넘는지 확인하세요.</p>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="guide-box">
            <h4><span class="step-number">3</span>분석 리포트</h4>
            <p>침범이 의심되면 '분석 실행' 버튼을 눌러 예상되는 법적 쟁점을 확인하세요.</p>
        </div>
        """, unsafe_allow_html=True)

# 사이드바 컨트롤
with st.sidebar:
    st.markdown("### 🎛️ 분석 제어 패널")
    
    # 1. 주소 검색
    st.markdown("#### 1️⃣ 대상지 검색")
    address_input = st.text_input(
        "주소 입력",
        placeholder="예: 서울시 강남구 테헤란로 152",
        label_visibility="collapsed"
    )
    search_button = st.button("🔍 위치 이동", use_container_width=True)
    
    st.markdown("---")
    
    # 2. 시각화 설정
    st.markdown("#### 2️⃣ 시각화 설정")
    
    # 범례 표시
    st.markdown("""
    <div style="background: #f0f2f6; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(255, 0, 0, 0.6); border: 1px solid red;"></div>
            <span><strong>연속지적도</strong> (법적 경계)</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: url('https://api.vworld.kr/req/wmts/1.0.0/52A793EE-1EE9-3355-95AD-C087CB071EC8/Satellite/17/111560/50768.jpeg'); background-size: cover;"></div>
            <span><strong>위성영상</strong> (실제 현황)</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    opacity = st.slider(
        "지적도 투명도 조절",
        min_value=0.0,
        max_value=1.0,
        value=0.6,
        step=0.1
    )
    
    st.markdown("---")
    
    # 3. 가상 분석 기능
    st.markdown("#### 3️⃣ AI 법률 분석 (예시)")
    analyze_button = st.button("⚡ 경계 침범 위험 분석", type="primary", use_container_width=True)
    
    if analyze_button:
        with st.spinner("위성 영상과 지적도를 정밀 분석 중입니다..."):
            time.sleep(2) # 분석 시뮬레이션
        
        st.markdown("""
        <div class="analysis-result">
            <strong>⚠️ 분석 결과: 침범 의심</strong><br>
            <hr style="margin: 5px 0; border-color: #d4af37;">
            <small>
            북측 경계에서 약 <strong>1.2m</strong> 가량의 구조물이 인접 토지를 침범한 것으로 추정됩니다.<br><br>
            <strong>💡 권장 조치:</strong><br>
            1. 경계복원측량 신청 (LX)<br>
            2. 점유취득시효(20년) 검토 필요
            </small>
        </div>
        """, unsafe_allow_html=True)

# 지도 초기화 함수 (개선된 검색 로직)
def get_coordinates(address):
    if not address:
        return None
    
    # 1. 입력값 전처리 (공백 제거 등)
    clean_addr = address.strip()
    
    # 2. V-World 검색 API (통합 검색) 사용
    # 이 API는 띄어쓰기에 훨씬 관대하며, 도로명/지번을 자동 구분합니다.
    url = 'http://api.vworld.kr/req/search'
    params = {
        'service': 'search',
        'request': 'search',
        'version': '2.0',
        'crs': 'epsg:4326',
        'query': clean_addr,
        'type': 'address',
        'category': 'road', # 도로명 우선, 실패시 지번 검색됨
        'format': 'json',
        'errorformat': 'json',
        'key': VWORLD_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        
        # 검색 결과 확인
        if data['response']['status'] == 'OK':
            # 첫 번째 결과 사용
            result = data['response']['result']['items'][0]
            return [float(result['point']['y']), float(result['point']['x'])]
            
        # 검색 실패 시 (지번으로 재시도)
        else:
            params['category'] = 'parcel'
            response = requests.get(url, params=params, timeout=5)
            data = response.json()
            if data['response']['status'] == 'OK':
                result = data['response']['result']['items'][0]
                return [float(result['point']['y']), float(result['point']['x'])]
                
    except Exception as e:
        st.error(f"주소 검색 오류: {e}")
        
    return None

# 지도 생성
if 'map_center' not in st.session_state:
    st.session_state.map_center = [37.5665, 126.9780]  # 서울 시청
if 'map_zoom' not in st.session_state:
    st.session_state.map_zoom = 17
if 'searched_address' not in st.session_state:
    st.session_state.searched_address = None

# 주소 검색 처리
if search_button and address_input:
    coords = get_coordinates(address_input)
    if coords:
        st.session_state.map_center = coords
        st.session_state.map_zoom = 19
        st.session_state.searched_address = address_input  # 검색된 주소 저장
        st.success(f"✅ '{address_input}' 위치로 이동했습니다!")
    else:
        st.error("주소를 찾을 수 없습니다.")

# Folium 지도 객체 생성 (기본 OSM 사용)
m = folium.Map(
    location=st.session_state.map_center,
    zoom_start=st.session_state.map_zoom
)

# V-World 위성지도 레이어
folium.TileLayer(
    tiles=f'https://api.vworld.kr/req/wmts/1.0.0/{VWORLD_API_KEY}/Satellite/{{z}}/{{y}}/{{x}}.jpeg',
    attr='V-World Satellite',
    name='V-World 위성지도',
    overlay=False,
    control=True
).add_to(m)

# V-World 하이브리드 레이어 (도로명 등)
folium.TileLayer(
    tiles=f'https://api.vworld.kr/req/wmts/1.0.0/{VWORLD_API_KEY}/Hybrid/{{z}}/{{y}}/{{x}}.png',
    attr='V-World Hybrid',
    name='지명/도로',
    overlay=True,
    control=True
).add_to(m)

# 연속지적도 WMS 레이어
folium.WmsTileLayer(
    url='https://api.vworld.kr/req/wms',
    layers='lp_pa_cbnd_bubun',
    fmt='image/png',
    transparent=True,
    version='1.3.0',
    attr='V-World Cadastral',
    name='연속지적도',
    overlay=True,
    control=True,
    opacity=opacity
).add_to(m)

# 마커 추가 (검색된 경우) - session_state에서 가져오기
if st.session_state.searched_address:
    folium.Marker(
        location=st.session_state.map_center,
        popup=st.session_state.searched_address,
        icon=folium.Icon(color='red', icon='info-sign')
    ).add_to(m)

# 지도 표시
st_folium(m, width="100%", height=700)

# 하단 안내
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #888; font-size: 0.8rem;">
    본 서비스는 법률 상담을 위한 보조 도구이며, 제공되는 지적도는 법적 효력이 없습니다.<br>
    정확한 경계 확인을 위해서는 반드시 <strong>한국국토정보공사(LX)</strong>의 측량을 거쳐야 합니다.
</div>
""", unsafe_allow_html=True)
