import json

with open('output_20251212_152945.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 60)
print("📄 생성된 콘텐츠 미리보기")
print("=" * 60)
print(f"\n제목: {data['title']}")
print(f"슬러그: {data['slug']}")
print(f"상태: {data['status']}")
print(f"\n메타 설명 ({len(data['excerpt'])}자):")
print(data['excerpt'][:200])
print(f"\n태그: {', '.join(data['tags'])}")
print(f"\n\n본문 HTML (처음 1000자):")
print(data['content_html'][:1000])
print("\n\n..." if len(data['content_html']) > 1000 else "")
print(f"\n전체 본문 길이: {len(data['content_html'])} 자")
