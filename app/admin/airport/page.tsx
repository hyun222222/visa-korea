'use client';
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
import {isVisaContentAdmin} from '@/lib/admin-auth';
type Case={id:string;status:string;details:{traveler:string;contact:string};agreement:string;created_at:string;payer_reference?:string};
export default function AirportAdmin(){
 const [allowed,setAllowed]=useState(false),[cases,setCases]=useState<Case[]>([]),[open,setOpen]=useState(false),[active,setActive]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function api(action:string,extra:Record<string,unknown>={}){const {data:{session}}=await supabase.auth.getSession();const r=await fetch('/api/airport',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session?.access_token}`},body:JSON.stringify({action,...extra})});const b=await r.json();if(!r.ok)throw new Error(b.error);return b;}
 async function load(){const b=await api('admin-list');setCases(b.cases);setOpen(b.desk.is_open);setActive(b.desk.active_case||'');}
 async function run(fn:()=>Promise<void>){setBusy(true);setMessage('');try{await fn();}catch(e){setMessage(e instanceof Error?e.message:'처리 실패');}finally{setBusy(false);}}
 useEffect(()=>{isVisaContentAdmin().then(ok=>{setAllowed(ok);if(ok)run(load);});},[]); // eslint-disable-line react-hooks/exhaustive-deps
 if(!allowed)return <main className="kh-container ai-flow"><h1>공항 사건 관리</h1><a href="/admin">사무소 관리자 로그인</a></main>;
 return <main className="kh-container ai-flow"><h1>공항 긴급 사건 관리</h1><p role="status">{message}</p><p>접수: {open?'열림':'마감'} · 진행 사건: {active||'없음'}</p><p>접수 열기는 30분 내 첫 연락이 가능한 동안에만 사용하세요. 결제 대기 사건도 한 자리를 차지합니다.</p><button disabled={busy} onClick={()=>run(async()=>{await api('admin-open',{open:!open});await load();})}>{open?'신규 접수 닫기':'신규 접수 열기'}</button> <button disabled={busy} onClick={()=>run(load)}>새로고침</button>
 {cases.map(c=><section className="kh-section" key={c.id}><h2>{c.details.traveler}</h2><p>{c.id} · {c.status} · {c.details.contact}</p><details><summary>서명 계약서</summary><pre className="ai-contract">{c.agreement}</pre></details><p>고객 입력 거래번호: {c.payer_reference||'없음'}</p>
 <button disabled={busy} onClick={()=>run(async()=>{const b=await api('admin-files',{id:c.id});const container=document.getElementById(`files-${c.id}`)!;container.replaceChildren();for(const file of b.files){const a=document.createElement('a');a.href=file.url;a.textContent=file.name;a.target='_blank';a.rel='noopener noreferrer';container.append(a,document.createElement('br'));}})}>비공개 자료 링크 발급 (60초)</button><div id={`files-${c.id}`}/>
 {['signed','payment_review'].includes(c.status)&&<form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);run(async()=>{await api('admin-confirm-payment',{id:c.id,reference:f.get('reference'),amount:'3300.00',currency:'USD'});await load();});}}><p>PayPal 판매자 화면에서 이 고객의 USD 3,300 실제 수취를 확인한 후 기록하세요. 고객 입력만으로 승인하지 마세요.</p><input name="reference" required placeholder="확인한 실제 PayPal 거래번호"/><label className="ai-check"><input type="checkbox" required/>수취인·금액·통화·고객 일치 및 결제 완료를 확인했습니다.</label><button disabled={busy}>사무소 결제 확인 기록</button></form>}
 {active===c.id&&<button disabled={busy} onClick={()=>{if(confirm('업무 종료 또는 미결제 주문 취소를 확인했나요? 종료하면 접수는 닫힌 상태가 됩니다.'))run(async()=>{await api('admin-release',{id:c.id});await load();});}}>사건 종료 후 자리 해제</button>}</section>)}
 </main>;
}
