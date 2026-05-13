-- ============================================================
-- balawso (campaigns) — RLS hardening + data validation
-- Run this entire script in Supabase Dashboard > SQL Editor
-- against the production project (amqnssakcqsdeeunrtfz).
--
-- Idempotent: safe to re-run.
--
-- NOTE: constraints are added with NOT VALID so existing rows
-- are grandfathered in. New inserts/updates are validated.
-- To enforce on existing rows later, run:
--   alter table public.campaigns validate constraint <name>;
-- ============================================================

-- ============================================================
-- 1) public.campaigns — drop old permissive policies, add tight ones
-- ============================================================

drop policy if exists "Enable read access for all users"   on public.campaigns;
drop policy if exists "Enable insert access for all users" on public.campaigns;
drop policy if exists "Enable update access for all users" on public.campaigns;
drop policy if exists "Enable delete access for all users" on public.campaigns;
drop policy if exists "campaigns_select_active"            on public.campaigns;
drop policy if exists "campaigns_insert_anon"              on public.campaigns;

alter table public.campaigns enable row level security;

-- Data validation: prevents garbage / oversized / unknown categories
-- NOT VALID = existing rows are not checked, only new writes
alter table public.campaigns drop constraint if exists campaigns_category_check;
alter table public.campaigns drop constraint if exists campaigns_title_len_check;
alter table public.campaigns drop constraint if exists campaigns_description_len_check;
alter table public.campaigns drop constraint if exists campaigns_open_chat_link_check;
alter table public.campaigns drop constraint if exists campaigns_status_check;

alter table public.campaigns
  add constraint campaigns_category_check
    check (category in ('data-leak','apartment-defect','state-liability','consumer-damage')) not valid;

alter table public.campaigns
  add constraint campaigns_title_len_check
    check (char_length(title) between 1 and 500) not valid;

alter table public.campaigns
  add constraint campaigns_description_len_check
    check (description is null or char_length(description) <= 8000) not valid;

alter table public.campaigns
  add constraint campaigns_open_chat_link_check
    check (open_chat_link is null or open_chat_link ~ '^https?://') not valid;

alter table public.campaigns
  add constraint campaigns_status_check
    check (status in ('active','closed','pending','rejected')) not valid;

-- READ: only currently-active rows are public
create policy "campaigns_select_active"
  on public.campaigns for select
  using (status = 'active');

-- INSERT: anon may insert, but row must enter as status='active' (validation runs after)
create policy "campaigns_insert_anon"
  on public.campaigns for insert
  with check (status = 'active');

-- UPDATE / DELETE: no anon access (no policy = denied under RLS)
--   Use a service_role key on the server / admin tool for moderation.

-- ============================================================
-- 2) storage.objects (bucket "evidence") — drop permissive policies,
--    enforce size + mime type at the bucket level
-- ============================================================

drop policy if exists "Public Access"          on storage.objects;
drop policy if exists "Public Upload"          on storage.objects;
drop policy if exists "evidence_public_read"   on storage.objects;
drop policy if exists "evidence_public_upload" on storage.objects;

-- Tighten the bucket: 10 MB cap + restricted mime types
update storage.buckets
   set public = true,
       file_size_limit = 10485760,  -- 10 MB
       allowed_mime_types = array[
         'image/jpeg','image/png','image/webp','image/gif',
         'application/pdf'
       ]
 where id = 'evidence';

-- READ: anyone can read evidence files (they're referenced by public campaign pages)
create policy "evidence_public_read"
  on storage.objects for select
  using (bucket_id = 'evidence');

-- INSERT: anyone can upload, but bucket-level size/mime limits already enforce sanity
create policy "evidence_public_upload"
  on storage.objects for insert
  with check (bucket_id = 'evidence');

-- UPDATE / DELETE: no anon access.

-- ============================================================
-- 3) Sanity check: confirm RLS is enabled on every public table
--    (visa tables, posts, etc. — anon should not be able to touch them
--    unless explicit policies say so)
-- ============================================================

do $$
declare
    t record;
begin
    for t in
        select n.nspname as schema, c.relname as table_name
          from pg_class c
          join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public'
           and c.relkind = 'r'
           and c.relname not in ('schema_migrations')
    loop
        execute format('alter table %I.%I enable row level security;', t.schema, t.table_name);
    end loop;
end$$;

-- ============================================================
-- Verification queries (run these manually to confirm)
-- ============================================================
-- 1) Should show only the two policies we created on campaigns/storage.objects:
--    select tablename, policyname, cmd from pg_policies
--      where tablename in ('campaigns','objects')
--      order by tablename, policyname;
--
-- 2) Should show the bucket size limits set:
--    select id, file_size_limit, allowed_mime_types from storage.buckets where id = 'evidence';
--
-- 3) Should show RLS = true on every public table:
--    select schemaname, tablename, rowsecurity from pg_tables where schemaname = 'public';
--
-- 4) (Optional) Check how many existing rows would fail current title constraint:
--    select count(*) from public.campaigns
--     where char_length(title) not between 1 and 500;
