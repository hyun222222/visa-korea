-- Apply to the existing Supabase project before enabling intake.
begin;

create table if not exists public.visa_review_cases (
  id uuid primary key,
  email text not null,
  name text not null,
  plan text not null check (plan in ('question','documents','strategy')),
  amount_cents integer not null,
  visa text not null,
  question text not null,
  counterparty text not null default '',
  language text not null check (language in ('en','ko','zh')),
  status text not null default 'submitted' check (status in (
    'submitted','accepted','checkout','capturing','paid','in_review','delivered',
    'declined','cancelled','refund_requested','refunding','refunded'
  )),
  terms_version text not null,
  agreement text not null,
  consented_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id),
  checkout_expires_at timestamptz,
  payment_environment text check (payment_environment in ('live','sandbox')),
  payment_order_id text unique,
  payment_approval_url text,
  payment_capture_id text unique,
  payment_consent jsonb,
  paid_at timestamptz,
  materials_submission_started_at timestamptz,
  materials_submitted_at timestamptz,
  deadline_at timestamptz,
  started_at timestamptz,
  delivered_at timestamptz,
  result_emailed_at timestamptz,
  result text,
  refund_requested_at timestamptz,
  refund_resolved_at timestamptz,
  refund_resolution_reason text,
  refund_id text unique,
  refunded_at timestamptz
);
alter table public.visa_review_cases drop constraint if exists visa_review_cases_check;
alter table public.visa_review_cases drop constraint if exists visa_review_amount_check;
alter table public.visa_review_cases add constraint visa_review_amount_check
  check ((plan = 'question' and amount_cents in (5000, 5500))
      or (plan = 'documents' and amount_cents = 9900)
      or (plan = 'strategy' and amount_cents = 33000));
alter table public.visa_review_cases add column if not exists payment_consent jsonb;
alter table public.visa_review_cases add column if not exists materials_submission_started_at timestamptz;
alter table public.visa_review_cases add column if not exists materials_submitted_at timestamptz;
alter table public.visa_review_cases add column if not exists result_emailed_at timestamptz;
alter table public.visa_review_cases add column if not exists refund_resolved_at timestamptz;
alter table public.visa_review_cases add column if not exists refund_resolution_reason text;
-- Columns and historical statuses from an earlier partial-refund migration are retained.
-- The application now offers full refunds only. No historical refund data is deleted.
create index if not exists visa_review_cases_email_idx on public.visa_review_cases (email, submitted_at desc);
create index if not exists visa_review_cases_queue_idx on public.visa_review_cases (status, deadline_at);

create table if not exists public.visa_review_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.visa_review_cases(id) on delete cascade,
  name text not null,
  path text not null unique,
  mime text not null,
  size integer not null check (size between 1 and 3000000)
);
create index if not exists visa_review_documents_case_idx on public.visa_review_documents (case_id);

create table if not exists public.visa_review_codes (
  email text primary key,
  code_hash text not null,
  source_hash text not null,
  last_sent_at timestamptz not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  consumed_at timestamptz
);
create index if not exists visa_review_codes_source_idx on public.visa_review_codes (source_hash, last_sent_at);

alter table public.visa_review_cases enable row level security;
alter table public.visa_review_documents enable row level security;
alter table public.visa_review_codes enable row level security;
revoke all on public.visa_review_cases, public.visa_review_documents, public.visa_review_codes from anon, authenticated;
grant all on public.visa_review_cases, public.visa_review_documents, public.visa_review_codes to service_role;

create or replace function public.issue_visa_review_code(p_email text, p_code_hash text, p_source_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('visa-review-source:' || p_source_hash, 0));
  if (select count(*) from visa_review_codes where source_hash = p_source_hash and last_sent_at > now() - interval '10 minutes') >= 10 then
    return false;
  end if;
  insert into visa_review_codes (email, code_hash, source_hash, last_sent_at, expires_at)
  values (p_email, p_code_hash, p_source_hash, now(), now() + interval '10 minutes')
  on conflict (email) do update set code_hash = excluded.code_hash,
    source_hash = excluded.source_hash, last_sent_at = excluded.last_sent_at,
    expires_at = excluded.expires_at, attempts = 0, consumed_at = null
  where visa_review_codes.last_sent_at < now() - interval '60 seconds';
  return found;
end;
$$;

create or replace function public.consume_visa_review_code(p_email text, p_code_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
declare valid boolean;
begin
  update visa_review_codes set attempts = attempts + 1,
    consumed_at = case when code_hash = p_code_hash then now() else null end
  where email = p_email and expires_at > now() and consumed_at is null and attempts < 5
  returning consumed_at is not null into valid;
  return coalesce(valid, false);
end;
$$;

revoke all on function public.issue_visa_review_code(text,text,text), public.consume_visa_review_code(text,text) from public, anon, authenticated;
grant execute on function public.issue_visa_review_code(text,text,text), public.consume_visa_review_code(text,text) to service_role;

update storage.buckets set public = false where id = 'visa-review-private';
drop policy if exists visa_review_block_direct_access on storage.objects;
create policy visa_review_block_direct_access on storage.objects as restrictive for all to anon, authenticated
using (bucket_id <> 'visa-review-private') with check (bucket_id <> 'visa-review-private');

commit;
