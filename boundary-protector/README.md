# 경계침범 프로텍터 (Boundary Trespass Protector)

⚖️ 변호사를 위한 토지 경계 분쟁 분석 웹 애플리케이션

## 개요

국토교통부 브이월드(V-World) API를 활용하여 위성지도 위에 연속지적도(법적 경계)를 중첩하여 표시하는 법률 전문가용 도구입니다.

## 주요 기능

- 📍 **주소 검색**: 특정 주소로 지도 이동
- 🗺️ **위성 영상**: V-World 실제 위성 사진 제공
- 📐 **연속지적도 중첩**: 법적 경계선 표시
- 🎚️ **투명도 조절**: 슬라이더로 지적도 투명도 실시간 조정
- ⚖️ **법적 면책**: 참고용 도구임을 명확히 고지

## 설치 방법

### 1. 필수 요구사항
- Python 3.8 이상
- pip (Python 패키지 관리자)

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

## 실행 방법

```bash
streamlit run app.py
```

브라우저가 자동으로 열리며 `http://localhost:8501`에서 애플리케이션이 실행됩니다.

## V-World API 키 설정

1. [V-World 오픈 API](https://www.vworld.kr/dev/v4api.do)에서 API 키 발급
2. `app.py` 파일에서 `VWORLD_API_KEY` 변수에 API 키 입력

## 사용 방법

1. **주소 검색**: 좌측 사이드바에 주소 입력 (예: "서울시 강남구 테헤란로 152")
2. **투명도 조절**: 슬라이더를 움직여 지적도 레이어의 투명도 조정
3. **지도 탐색**: 마우스로 확대/축소 및 이동

## 법적 고지사항

> ⚠️ **중요**: 본 서비스가 제공하는 도면은 참고용이며, 법적 효력이 있는 측량 성과도가 아닙니다. 정확한 경계 확인을 위해서는 한국국토정보공사(LX)의 경계복원측량을 실시해야 합니다.

## 개인정보 보호

- 입력된 주소 및 검색 기록은 서버에 저장되지 않습니다
- 모든 처리는 클라이언트(브라우저) 측에서만 이루어집니다
- 페이지 새로고침 시 모든 데이터가 초기화됩니다

## 기술 스택

- **Frontend Framework**: Streamlit
- **Map Engine**: V-World OpenLayers 3
- **Base Map**: V-World Satellite Imagery
- **Overlay**: V-World WMS 'lp_pa_cbnd_bubun' (연속지적도)
- **Language**: Python 3.8+

## 색상 디자인

- **Primary**: Navy Blue (#001f3f) - 법률가의 권위와 신뢰
- **Background**: White (#ffffff) - 깔끔하고 전문적인 느낌
- **Accent**: Gold (#d4af37) - 강조 요소
- **Font**: Noto Sans KR - 한글 최적화 고딕체

## 라이선스

본 프로젝트는 법무법인 내부 사용을 목적으로 개발되었습니다.

## 지원

문제가 발생하거나 문의사항이 있으시면 개발팀에 연락해주세요.
