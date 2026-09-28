'use client';
import {useEffect,useRef,useState} from 'react';
import {supabase} from '@/lib/supabase';

type Account={label:string;caseId:string;documentId:string;loginUrl:string};
type Saved={runId:string;manifest:string;ownerId:string};
const storageKey='airport-verification-cleanup-v1';

export function AirportVerification(){
 const [saved,setSaved]=useState<Saved|null>(null),[accounts,setAccounts]=useState<Account[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[checks,setChecks]=useState<Record<string,boolean>>({});
 const mounted=useRef(false),epoch=useRef(0),owner=useRef<string|null>(null);
 useEffect(()=>{
  mounted.current=true;let alive=true;
  let observedEvent=false;
  function changed(id:string|null){if(!alive)return;if(owner.current!==id){owner.current=id;epoch.current++;setAccounts([]);setSaved(null);setBusy(false);setMessage('');setChecks({});}if(id){try{const text=sessionStorage.getItem(`${storageKey}:${id}`);if(text){const data=JSON.parse(text) as Saved;if(data.ownerId===id&&typeof data.manifest==='string'&&typeof data.runId==='string')setSaved(data);}}catch{setMessage('이전 검증 정리 정보를 읽지 못했습니다.');}}}
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{observedEvent=true;changed(session?.user.id||null);});
  void supabase.auth.getSession().then(({data:{session}})=>{if(!observedEvent)changed(session?.user.id||null);});
  return ()=>{alive=false;mounted.current=false;epoch.current++;subscription.unsubscribe();};
 },[]);
 async function perform(action:'start'|'cleanup'){
  if(busy||(action==='start'&&saved)||(action==='cleanup'&&!saved))return;
  const requestEpoch=epoch.current;setBusy(true);setMessage('');
  try{
   const {data:{session}}=await supabase.auth.getSession();
   if(!mounted.current||requestEpoch!==epoch.current||!session||session.user.id!==owner.current)return;
   const r=await fetch('/api/airport/verification',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({action,...(action==='cleanup'?{manifest:saved?.manifest}:{})})});
   const result=await r.json();
   // Retain cleanup capability even if the office signs out while creation is in flight.
   const value=result.manifest?{runId:result.runId,manifest:result.manifest,ownerId:session.user.id}:null;
   let persistenceFailed=false;
   if(value){try{sessionStorage.setItem(`${storageKey}:${session.user.id}`,JSON.stringify(value));}catch{persistenceFailed=true;}}
   if(action==='cleanup'&&r.ok){try{sessionStorage.removeItem(`${storageKey}:${session.user.id}`);}catch{/* Clear the visible state below; retrying cleanup is harmless. */}}
   if(!mounted.current||requestEpoch!==epoch.current)return;
   if(value)setSaved(value);if(result.checks)setChecks(result.checks);
   if(!r.ok)throw new Error(`${result.error||'검증 요청 실패'}${result.cleaned?' · 생성 중인 테스트 자료는 정리했습니다.':''}`);
   if(action==='start'){setAccounts(result.accounts);setMessage(`고객 A·B의 일반 고객 권한과 실제 API 접근 분리를 확인했습니다. 각 고객으로 로그인해 화면도 확인하세요.${persistenceFailed?' 정리 정보 저장 실패: 새로고침하지 말고 이 화면에서 정리하세요.':''}`);}
   else{setSaved(null);setAccounts([]);setChecks({});const n=result.counts;setMessage(`테스트 자료 정리 완료: 계정 ${n.users}개, 사건 ${n.cases}개, 서류 ${n.documents}개, 파일 ${n.files}개.`);}
  }catch(e){if(mounted.current&&requestEpoch===epoch.current)setMessage(e instanceof Error?e.message:'검증을 완료하지 못했습니다.');}
  finally{if(mounted.current&&requestEpoch===epoch.current)setBusy(false);}
 }
 return <section className="kh-section"><h2>고객 A·B 실제 접근 분리 검증</h2><p>폐기할 테스트 계정 두 개와 종료 상태의 가상 사건·PDF만 만듭니다. 실제 위임계약·서명·결제·고객 메일은 발생하지 않으며 신규 접수도 열리지 않습니다.</p>
 <p>고객 로그인은 별도 브라우저에서 진행하세요. 현재 관리자 브라우저에서 로그인하면 관리자 계정이 고객 계정으로 바뀝니다. 로그인 링크는 이 화면에만 잠시 보관되며 새로고침하면 사라집니다.</p>
 <button disabled={busy||Boolean(saved)} onClick={()=>perform('start')}>테스트 고객 A·B 만들기</button>{saved&&<button disabled={busy} onClick={()=>perform('cleanup')}>이 검증의 계정·사건·서류 모두 정리</button>}
 {saved&&<p>검증 번호: {saved.runId} · 정리 전에는 새 검증을 만들 수 없습니다.</p>}
 {accounts.map(a=><div key={a.label}><h3>TEST CUSTOMER {a.label}</h3><p>접수번호: <code>{a.caseId}</code></p><p>서류번호: <code>{a.documentId}</code></p><p><a href={a.loginUrl} target="_blank" rel="noopener noreferrer">테스트 고객 {a.label} 로그인</a></p><p><a href={`/en/entry-refusal/apply?case=${a.caseId}`} target="_blank" rel="noopener noreferrer">고객 {a.label} 본인 사건 화면</a></p>{accounts.filter(other=>other.label!==a.label).map(other=><p key={other.label}><a href={`/en/entry-refusal/apply?case=${other.caseId}`} target="_blank" rel="noopener noreferrer">고객 {a.label} 로그인 상태에서 고객 {other.label} 사건 접근 거절 확인</a></p>)}</div>)}
 {Object.keys(checks).length>0&&<details><summary>실제 고객 API 검증 결과</summary><ul>{Object.entries(checks).map(([name,ok])=><li key={name}>{name}: {ok?'통과':'실패'}</li>)}</ul></details>}
 <p role="status">{busy?'처리 중…':message}</p>
 </section>;
}
