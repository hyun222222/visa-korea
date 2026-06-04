# 🚀 Korea Visa Law — Vercel 배포 가이드

## 사전 준비물
- GitHub 계정 (이미 https://github.com/hyun222222/visa-korea 연동됨)
- Vercel 계정 (https://vercel.com — GitHub 로그인 가능)
- Supabase 프로젝트 (https://supabase.com/dashboard/project/amqnssakcqsdeeunrtfz)

---

## 1단계: Supabase 데이터베이스 설정 (5분)

### 1-1. SQL 실행
1. [Supabase Dashboard](https://supabase.com/dashboard/project/amqnssakcqsdeeunrtfz) 접속
2. 좌측 메뉴 **SQL Editor** (`</>` 아이콘) 클릭
3. **+ New query** 클릭
4. `database/full_migration.sql` 파일 내용 전체를 복사-붙여넣기
5. **Run** 클릭 (또는 Ctrl+Enter)
6. "Success" 확인

### 1-2. 결과 확인
- 좌측 **Table Editor** 클릭
- `blog_posts` 테이블: 글 5개 확인
- `posts` 테이블: 글 3개 확인

### 1-3. 관리자 계정 만들기
1. 좌측 **Authentication** (사람 아이콘) 클릭
2. **Users** 탭 → **Add user** → **Create new user**
3. 이메일: 본인 이메일 (예: admin@kimnhyun.com)
4. 비밀번호: 원하는 비밀번호
5. ✅ **Auto Confirm User** 체크
6. **Create user** 클릭

---

## 2단계: Supabase API 키 확인 (1분)

1. Supabase Dashboard → 좌측 **Project Settings** (톱니바퀴)
2. **API** 탭 클릭
3. 아래 두 값을 메모:
   - **Project URL**: `https://amqnssakcqsdeeunrtfz.supabase.co`
   - **anon public** 키: `eyJ...` (긴 문자열)

---

## 3단계: Vercel 배포 (5분)

### 3-1. Vercel에 프로젝트 연결
1. https://vercel.com 접속 → **Add New Project**
2. GitHub 저장소 `hyun222222/visa-korea` 선택
3. **Framework Preset**: `Next.js` (자동 감지됨)

### 3-2. 환경 변수 설정
**Environment Variables** 섹션에 아래 두 개 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://amqnssakcqsdeeunrtfz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (2단계에서 복사한 anon key) |

### 3-3. 배포
- **Deploy** 클릭
- 빌드 완료까지 약 1~2분 대기
- 완료되면 `https://visa-korea-xxxxx.vercel.app` 형태 URL 발급

---

## 4단계: 커스텀 도메인 연결 (선택)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. `koreavisalaw.com` 입력 → **Add**
3. 도메인 DNS에 Vercel CNAME 레코드 추가:
   - **Type**: CNAME
   - **Name**: @ (또는 www)
   - **Value**: `cname.vercel-dns.com`
4. SSL 인증서는 자동 발급 (약 10분 소요)

---

## 5단계: 로컬 개발용 설정 (선택)

로컬에서 개발할 때는 `.env.local` 파일 필요:

```bash
# 프로젝트 루트에 .env.local 파일 생성
cp .env.local.example .env.local
# 그 후 .env.local에 실제 키 입력
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://amqnssakcqsdeeunrtfz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_실제_anon_키_입력
```

---

## 관리자 사용법

### 블로그 글 관리
1. `https://도메인/admin` 접속
2. 1단계에서 만든 계정으로 로그인
3. **블로그 관리** 탭 → 새 칼럼 작성 / 수정 / 삭제

### 게시판 글 관리
1. 같은 관리자 대시보드에서 **게시판 관리** 탭 선택
2. 공지사항, 비자 뉴스, Q&A 글 관리

### 게시판 접근 권한
- **읽기**: 누구나 가능 (로그인 불필요)
- **쓰기/수정/삭제**: 관리자 로그인 필수

---

## 트러블슈팅

### "Supabase 연결 실패" 표시될 때
- 환경 변수가 제대로 설정되었는지 확인
- Vercel에서 환경 변수 변경 후 **Redeploy** 필요

### 빌드 에러
```bash
cd C:\Users\hyunj\visa-korea
npm run build
```
로컬에서 먼저 빌드 테스트 후 push

### 관리자 로그인 안 됨
- Supabase Authentication에서 사용자가 **Confirmed** 상태인지 확인
- 비밀번호는 최소 6자 이상
