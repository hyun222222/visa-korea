import requests
import json

VWORLD_API_KEY = "52A793EE-1EE9-3355-95AD-C087CB071EC8"

# 테스트 주소
test_addresses = [
    "서울시 강남구 테헤란로 152",
    "서울시강남구테헤란로152",
    "강남구 테헤란로 152"
]

for addr in test_addresses:
    print(f"\n{'='*60}")
    print(f"테스트 주소: {addr}")
    print(f"{'='*60}")
    
    url = 'http://api.vworld.kr/req/search'
    params = {
        'service': 'search',
        'request': 'search',
        'version': '2.0',
        'crs': 'epsg:4326',
        'query': addr,
        'type': 'address',
        'category': 'road',
        'format': 'json',
        'errorformat': 'json',
        'key': VWORLD_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        print(f"HTTP 상태 코드: {response.status_code}")
        
        data = response.json()
        print(f"응답 상태: {data['response']['status']}")
        
        if data['response']['status'] == 'OK':
            items = data['response']['result']['items']
            print(f"검색 결과 개수: {len(items)}")
            if items:
                result = items[0]
                print(f"주소: {result.get('address', {}).get('road', 'N/A')}")
                print(f"좌표: ({result['point']['y']}, {result['point']['x']})")
        else:
            print(f"에러 메시지: {data['response'].get('error', {}).get('text', 'N/A')}")
            print(f"전체 응답: {json.dumps(data, indent=2, ensure_ascii=False)}")
            
    except Exception as e:
        print(f"예외 발생: {e}")
