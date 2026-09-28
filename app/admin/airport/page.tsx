'use client';
import {useEffect,useRef,useState} from 'react';
import {supabase} from '@/lib/supabase';
import {isVisaContentAdmin} from '@/lib/admin-auth';
import {AirportNotificationTest} from '@/components/airport-notification-test';
import {AirportVerification} from '@/components/airport-verification';
type Case={id:string;status:string;details:{traveler:string;contact:string};agreement:string;created_at:string;payer_reference?:string};
type Diagnostics={ok:boolean;diagnosticId?:string;stages?:Record<string,boolean>;error?:string};
const diagnosticLabels:Record<string,string>={databaseRead:'서버 데이터베이스 연결',privateBucket:'저장소 비공개 설정',upload:'가상 PDF 업로드',download:'다운로드 원본 일치',publicReadBlocked:'외부 공개 접근 차단',cleanup:'테스트 파일 삭제 확인'};
export default function AirportAdmin(){
 const [allowed,setAllowed]=useState<boolean|null>(null),[ready,setReady]=useState(false),[cases,setCases]=useState<Case[]>([]),[open,setOpen]=useState(false),[active,setActive]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[diagnostics,setDiagnostics]=useState<Diagnostics|null>(null);
 const mounted=useRef(false),authEpoch=useRef(0),authUid=useRef<string|null|undefined>(undefined),adminAllowed=useRef(false);
 function current(epoch:number){return mounted.current&&authEpoch.current===epoch&&Boolean(authUid.current);}
 function assertCurrent(epoch:number){if(!current(epoch)||!adminAllowed.current)throw new Error('로그인 계정이 변경되었습니다.');}
 async function sessionFor(epoch:number){assertCurrent(epoch);const {data:{session}}=await supabase.auth.getSession();assertCurrent(epoch);if(!session||session.user.id!==authUid.current)throw new Error('관리자 로그인을 다시 확인하세요.');return session;}
 async function api(epoch:number,action:string,extra:Record<string,unknown>={}){const session=await sessionFor(epoch);assertCurrent(epoch);const r=await fetch('/api/airport',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({action,...extra})});const b=await r.json();assertCurrent(epoch);if(!r.ok)throw new Error(b.error);return b;}
 async function load(epoch:number){assertCurrent(epoch);const status=await fetch('/api/airport',{cache:'no-store'});const availability=await status.json();assertCurrent(epoch);setReady(availability.ready===true);if(!status.ok||availability.ready!==true){setCases([]);setOpen(false);setActive('');return;}const b=await api(epoch,'admin-list');assertCurrent(epoch);setCases(b.cases);setOpen(b.desk.is_open);setActive(b.desk.active_case||'');}
 async function diagnose(epoch:number){assertCurrent(epoch);setDiagnostics(null);const session=await sessionFor(epoch);assertCurrent(epoch);const r=await fetch('/api/airport/diagnostics',{method:'POST',headers:{Authorization:`Bearer ${session.access_token}`}});const result=await r.json();assertCurrent(epoch);setDiagnostics(result);if(!r.ok&&!result.stages)throw new Error(result.error||'검증을 시작하지 못했습니다.');}
 async function run(fn:(epoch:number)=>Promise<void>,epoch=authEpoch.current){if(!current(epoch)||!adminAllowed.current)return;setBusy(true);setMessage('');try{await fn(epoch);}catch(e){if(current(epoch)&&adminAllowed.current)setMessage(e instanceof Error?e.message:'처리 실패');}finally{if(current(epoch)&&adminAllowed.current)setBusy(false);}}
 useEffect(()=>{
  mounted.current=true;let observedEvent=false,disposed=false;
  function changed(uid:string|null){
   if(disposed||!mounted.current||authUid.current===uid)return;
   authUid.current=uid;const epoch=++authEpoch.current;adminAllowed.current=false;
   setAllowed(uid?null:false);setCases([]);setDiagnostics(null);setReady(false);setOpen(false);setActive('');setMessage('');setBusy(false);
   if(!uid)return;
   // Leave the Supabase auth callback before requesting its current session again.
   setTimeout(()=>{if(!current(epoch))return;isVisaContentAdmin().then(ok=>{if(!current(epoch))return;adminAllowed.current=ok;setAllowed(ok);if(ok)void run(load,epoch);});},0);
  }
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{observedEvent=true;changed(session?.user.id||null);});
  void supabase.auth.getSession().then(({data:{session}})=>{if(!observedEvent)changed(session?.user.id||null);});
  return ()=>{disposed=true;mounted.current=false;authEpoch.current++;authUid.current=undefined;adminAllowed.current=false;subscription.unsubscribe();};
 },[]); // eslint-disable-line react-hooks/exhaustive-deps
 if(allowed===null)return <main className="kh-container ai-flow"><h1>공항 사건 관리</h1><p role="status">로그인과 관리자 권한을 확인하고 있습니다.</p></main>;
 if(!allowed)return <main className="kh-container ai-flow"><h1>공항 사건 관리</h1><a href="/admin">사무소 관리자 로그인</a></main>;
 return <main className="kh-container ai-flow"><h1>공항 긴급 사건 관리</h1><p>관리자 로그인 확인 완료</p><p role="status">{message}</p>
 <section className="kh-section"><h2>비공개 저장소 연결 검증</h2><p>고객 정보가 없는 가상 PDF 한 개를 업로드하고 내려받아 비교한 뒤 삭제합니다. 신규 접수는 열리지 않으며 계약·결제·메일 발송은 발생하지 않습니다.</p><button disabled={busy} onClick={()=>run(diagnose)}>{busy?'처리 중…':'비공개 저장소 실제 연결 검증'}</button>
 {diagnostics&&<div role="status"><p>{diagnostics.ok?'모든 저장소 연결 검증 통과':'저장소 검증 결과를 확인하세요.'}</p>{diagnostics.stages&&<ul>{Object.entries(diagnostics.stages).map(([key,value])=><li key={key}>{diagnosticLabels[key]||key}: {value?'통과':'미통과 또는 미실행'}</li>)}</ul>}{diagnostics.error&&<p>{diagnostics.error}</p>}{diagnostics.diagnosticId&&<p>검증 번호: {diagnostics.diagnosticId}</p>}</div>}</section>
 {!ready?<section className="kh-section"><h2>온라인 접수 비활성</h2><p>서버 접수 설정이 아직 활성화되지 않았습니다. 현재 화면에서는 신규 접수를 열거나 실제 사건을 처리할 수 없습니다.</p><button disabled={busy} onClick={()=>run(load)}>설정 상태 새로고침</button></section>:<><p>접수: {open?'열림':'마감'} · 진행 사건: {active||'없음'}</p><p>접수 열기는 30분 내 첫 연락이 가능한 동안에만 사용하세요. 결제 대기 사건도 한 자리를 차지합니다.</p><button disabled={busy} onClick={()=>run(async(epoch)=>{await api(epoch,'admin-open',{open:!open});await load(epoch);})}>{open?'신규 접수 닫기':'신규 접수 열기'}</button> <button disabled={busy} onClick={()=>run(load)}>새로고침</button>
 {cases.map(c=><section className="kh-section" key={c.id}><h2>{c.details.traveler}</h2><p>{c.id} · {c.status} · {c.details.contact}</p><details><summary>서명 계약서</summary><pre className="ai-contract">{c.agreement}</pre></details><p>고객 입력 거래번호: {c.payer_reference||'없음'}</p>
 <button disabled={busy} onClick={()=>run(async(epoch)=>{const b=await api(epoch,'admin-files',{id:c.id});assertCurrent(epoch);const container=document.getElementById(`files-${c.id}`);if(!container)return;container.replaceChildren();for(const file of b.files){const a=document.createElement('a');a.href=file.url;a.textContent=file.name;a.target='_blank';a.rel='noopener noreferrer';container.append(a,document.createElement('br'));}})}>비공개 자료 링크 발급 (60초)</button><div id={`files-${c.id}`}/>
 {['signed','payment_review'].includes(c.status)&&<form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);run(async(epoch)=>{await api(epoch,'admin-confirm-payment',{id:c.id,reference:f.get('reference'),amount:'3300.00',currency:'USD'});await load(epoch);});}}><p>PayPal 판매자 화면에서 이 고객의 USD 3,300 실제 수취를 확인한 후 기록하세요. 고객 입력만으로 승인하지 마세요.</p><input name="reference" required placeholder="확인한 실제 PayPal 거래번호"/><label className="ai-check"><input type="checkbox" required/>수취인·금액·통화·고객 일치 및 결제 완료를 확인했습니다.</label><button disabled={busy}>사무소 결제 확인 기록</button></form>}
 {active===c.id&&<button disabled={busy} onClick={()=>{if(confirm('업무 종료 또는 미결제 주문 취소를 확인했나요? 종료하면 접수는 닫힌 상태가 됩니다.'))run(async(epoch)=>{await api(epoch,'admin-release',{id:c.id});await load(epoch);});}}>사건 종료 후 자리 해제</button>}</section>)}
 </>}<AirportNotificationTest/><AirportVerification/></main>;
}
