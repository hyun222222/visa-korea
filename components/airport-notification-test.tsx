'use client';
import {useRef,useState,useEffect} from 'react';
import {supabase} from '@/lib/supabase';
export function AirportNotificationTest(){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const live=useRef(true);
 useEffect(()=>{live.current=true;return()=>{live.current=false;};},[]);
 async function send(){
  setBusy(true);setMessage('');
  try{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session)throw new Error('관리자 로그인 필요');
   const r=await fetch('/api/airport/notification-test',{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`}}),b=await r.json();
   if(!r.ok)throw new Error(b.error);
   if(live.current)setMessage(`테스트 알림 발송 요청이 수락되었습니다. 실제 배달은 Resend 기록에서 확인하세요. 검증번호: ${b.reference} / 메일 ID: ${b.emailId||'미제공'}`);
  }catch(e){if(live.current)setMessage(e instanceof Error?e.message:'발송 실패');}
  finally{if(live.current)setBusy(false);}
 }
 return <section className="kh-section"><h2>사무소 접수 알림 검증</h2><p>설정된 사무소 수신처로 실제 접수 알림과 같은 발송 경로를 사용합니다. 제목에 TEST 표시가 붙고 실제 사건·결제는 만들지 않습니다.</p><button disabled={busy} onClick={send}>{busy?'발송 중…':'사무소에 테스트 접수 알림 발송'}</button>{message&&<p role="status">{message}</p>}</section>;
}
