-- Apply in the existing Supabase project. No public access to contracts or files.
create table if not exists public.airport_cases (
 id uuid primary key, user_id uuid not null references auth.users(id),
 details jsonb not null, agreement text not null, agreement_hash text not null,
 agreement_version text not null, privacy_notice text not null, signed_at timestamptz not null default now(),
 status text not null default 'signed' check(status in ('signed','payment_review','paid','refunded','closed')),
 payer_reference text, payment_confirmed_by uuid references auth.users(id),
 paypal_order_id text unique, paypal_capture_id text unique,
 paid_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.airport_desk (
 id boolean primary key default true check(id), is_open boolean not null default false,
 active_case uuid references public.airport_cases(id), expires_at timestamptz
);
insert into public.airport_desk(id) values(true) on conflict do nothing;
create table if not exists public.airport_documents (
 id uuid primary key default gen_random_uuid(), case_id uuid not null references public.airport_cases(id),
 path text not null unique, name text not null, mime text not null, size bigint not null,
 created_at timestamptz not null default now()
);
alter table public.airport_cases enable row level security;
alter table public.airport_desk enable row level security;
alter table public.airport_documents enable row level security;
revoke all on public.airport_cases, public.airport_desk, public.airport_documents from anon, authenticated;
grant all on public.airport_cases, public.airport_desk, public.airport_documents to service_role;

create or replace function public.reserve_airport_case(p_id uuid,p_user uuid,p_details jsonb,p_agreement text,p_hash text,p_version text,p_privacy text)
returns uuid language plpgsql security definer set search_path=public as $$
declare desk public.airport_desk%rowtype;
begin
 select * into desk from public.airport_desk where id=true for update;
 if not desk.is_open then raise exception 'Intake closed'; end if;
 if desk.active_case is not null and (desk.expires_at>now() or exists(select 1 from public.airport_cases where id=desk.active_case and (paypal_order_id is not null or status in ('paid','payment_review')))) then raise exception 'Another case is being processed'; end if;
 insert into public.airport_cases(id,user_id,details,agreement,agreement_hash,agreement_version,privacy_notice) values(p_id,p_user,p_details,p_agreement,p_hash,p_version,p_privacy);
 update public.airport_desk set active_case=p_id,expires_at=now()+interval '30 minutes' where id=true;
 return p_id;
end $$;
create or replace function public.lock_airport_payment(p_id uuid)
returns boolean language plpgsql security definer set search_path=public as $$
declare desk public.airport_desk%rowtype;
begin
 select * into desk from public.airport_desk where id=true for update;
 if desk.active_case is distinct from p_id or desk.expires_at<now() then raise exception 'Reservation expired'; end if;
 -- Hold the case while PayPal order creation is in flight. Administrator can release abandoned orders after checking PayPal.
 update public.airport_desk set expires_at='infinity' where id=true;
 return true;
end $$;
revoke all on function public.reserve_airport_case(uuid,uuid,jsonb,text,text,text,text) from public,anon,authenticated;
revoke all on function public.lock_airport_payment(uuid) from public,anon,authenticated;
grant execute on function public.reserve_airport_case(uuid,uuid,jsonb,text,text,text,text) to service_role;
grant execute on function public.lock_airport_payment(uuid) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('airport-private','airport-private',false,10485760,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
-- No anonymous/authenticated Storage policies: all downloads and uploads go through the authorized server.
drop policy if exists airport_block_direct_access on storage.objects;
create policy airport_block_direct_access on storage.objects as restrictive for all to anon, authenticated
using (bucket_id <> 'airport-private') with check (bucket_id <> 'airport-private');
