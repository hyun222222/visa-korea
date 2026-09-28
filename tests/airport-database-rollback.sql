-- Synthetic database integration test. No real engagement or payment.
-- The transaction rolls back ALL fixture and desk changes, even on failure.
begin;
do $test$
declare
  test_user uuid;
  test_case uuid := gen_random_uuid();
  other_case uuid := gen_random_uuid();
  snapshot text := 'TEST ONLY - NON-BINDING - USD 3300 - synthetic signature';
  expected_hash text := repeat('a',64);
  blocked boolean := false;
begin
  select id into strict test_user from auth.users where email='info@kimnhyun.com';
  perform 1 from public.airport_desk where id=true for update;
  if exists(select 1 from public.airport_desk where active_case is not null) then
    raise exception 'Do not run diagnostics while a real case is active';
  end if;
  update public.airport_desk set is_open=true,expires_at=null where id=true;
  perform public.reserve_airport_case(test_case,test_user,
    '{"testOnly":true,"traveler":"SYNTHETIC TEST","signature":"SYNTHETIC TEST"}'::jsonb,
    snapshot,expected_hash,'TEST-NON-BINDING','TEST PRIVACY SNAPSHOT');
  if not exists(select 1 from public.airport_cases where id=test_case and agreement=snapshot
      and agreement_hash=expected_hash and status='signed' and user_id=test_user) then
    raise exception 'Signature snapshot round-trip failed';
  end if;
  begin
    perform public.reserve_airport_case(other_case,test_user,'{}',snapshot,expected_hash,'TEST','TEST');
  exception when others then
    if sqlerrm='Another case is being processed' then blocked:=true; else raise; end if;
  end;
  if not blocked then raise exception 'Single-case concurrency check failed'; end if;
  perform public.lock_airport_payment(test_case);
  if not exists(select 1 from public.airport_desk where active_case=test_case and expires_at='infinity') then
    raise exception 'Payment reservation lock failed';
  end if;
  update public.airport_cases set status='payment_review',payer_reference='TEST-NO-PAYMENT' where id=test_case;
  if exists(select 1 from public.airport_cases where id=test_case and (status='paid' or paid_at is not null)) then
    raise exception 'A customer report must not mark payment complete';
  end if;
  insert into public.airport_documents(case_id,path,name,mime,size)
    values(test_case,'diagnostics/'||test_case||'.pdf','TEST-ONLY.pdf','application/pdf',60);
  if not exists(select 1 from public.airport_documents where case_id=test_case and name='TEST-ONLY.pdf') then
    raise exception 'Document metadata write failed';
  end if;
  if has_table_privilege('anon','public.airport_cases','SELECT')
     or has_table_privilege('authenticated','public.airport_cases','SELECT') then
    raise exception 'Private case read protection failed';
  end if;
  if not exists(select 1 from storage.buckets where id='airport-private' and public=false) then
    raise exception 'Bucket is not private';
  end if;
end $test$;
rollback;
