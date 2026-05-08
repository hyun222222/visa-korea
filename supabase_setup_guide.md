# 🚀 Supabase 연동 완벽 가이드

이 가이드를 따라하면 **데이터 저장(DB)**과 **파일 업로드(Storage)** 기능을 내 프로젝트에 직접 연결할 수 있습니다.

---

## 1단계: Supabase 가입 및 프로젝트 생성

1.  [Supabase 홈페이지(https://supabase.com)](https://supabase.com)에 접속합니다.
2.  우측 상단 **"Start your project"** 버튼을 클릭하고 GitHub 아이디로 로그인합니다.
3.  **"New Project"** 버튼을 누릅니다.
4.  다음 내용을 입력하고 **"Create new project"**를 클릭합니다.
    *   **Name:** `baroso` (원하는 이름 아무거나)
    *   **Database Password:** **꼭 기억해두세요!** (또는 'Generate a password' 클릭 후 복사)
    *   **Region:** `Seoul` (Korea) 선택

*(프로젝트가 생성되는 데 1~2분 정도 걸립니다. 잠시 기다려주세요.)*

---

## 2단계: 데이터베이스 & 스토리지 한방에 설정하기 (SQL 실행)

복잡하게 클릭할 필요 없이, 아래 코드를 복사해서 붙여넣으면 끝납니다.

1.  왼쪽 메뉴에서 **SQL Editor** (아이콘: `_>`)를 클릭합니다.
2.  상단의 **"+ New query"**를 클릭합니다.
3.  아래 코드를 **통째로 복사**해서 붙여넣고, 우측 하단 **"Run"** 버튼을 누릅니다.

```sql
-- 1. 캠페인(소송 모임) 정보를 저장할 테이블 생성
create table public.campaigns (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  title text not null,
  description text,
  open_chat_link text,
  evidence_url text,
  metadata jsonb,
  status text default 'active'
);

-- 2. 누구나 데이터를 쓰고 읽을 수 있게 권한 설정 (데모용)
alter table public.campaigns enable row level security;
create policy "Enable read access for all users" on public.campaigns for select using (true);
create policy "Enable insert access for all users" on public.campaigns for insert with check (true);

-- 3. 파일 업로드를 위한 스토리지 버킷 생성
insert into storage.buckets (id, name, public) values ('evidence', 'evidence', true);

-- 4. 파일 업로드 권한 설정 (누구나 업로드 가능)
create policy "Public Access" on storage.objects for select using ( bucket_id = 'evidence' );
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'evidence' );
```

**"Success"** 메시지가 뜨면 성공입니다! 🎉

---

## 3단계: API 키 연결하기

이제 내 프로젝트와 Supabase를 연결할 열쇠(Key)를 가져와야 합니다.

1.  왼쪽 메뉴 맨 아래 **Project Settings** (톱니바퀴 아이콘) > **API**를 클릭합니다.
2.  **Project URL**과 **Project API keys (anon / public)** 두 가지가 필요합니다.
3.  VS Code로 돌아와서 `c:\Projects\anti` 폴더 안에 **`.env.local`** 파일을 새로 만듭니다.
4.  아래 내용을 복사해서 붙여넣고, 값을 채워주세요.

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL을_붙여넣으세요
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_키를_붙여넣으세요
```

---

## 4단계: 확인하기

1.  `.env.local` 파일을 저장합니다.
2.  터미널에서 서버를 껐다가 다시 켭니다 (`Ctrl+C` 후 `npm run dev`).
3.  웹사이트에서 "모임 개설하기"를 진행해보세요.
4.  Supabase 대시보드의 **Table Editor** 메뉴에서 데이터가 들어왔는지 확인해보세요!

**도움이 필요하면 언제든 말씀해주세요!** 
