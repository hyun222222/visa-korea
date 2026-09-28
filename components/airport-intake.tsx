'use client';
import {useEffect,useRef,useState} from 'react';
import {supabase} from '@/lib/supabase';
import {airportPrivacy} from '@/lib/airport-privacy';
import {airportContracts} from '@/lib/airport-contracts';
import {AIRPORT_CODES,type AirportDetails} from '@/lib/airport-validation';
import {AirportContact} from '@/components/airport-contact';
type CaseRecord={id:string;status:string;agreement:string;agreement_hash:string;signed_at:string;details:AirportDetails};
class ChangedSessionError extends Error {}
function emptyDetails(lang:'ko'|'en'):AirportDetails{return {traveler:'',signer:'',role:'self',authority:false,airport:'ICN',stage:'refused',returnAt:'',unknownReturn:false,contact:'',language:lang,purpose:'',relatedParties:'',signature:'',consent:false,privacyConsent:false,transferConsent:false,sensitiveConsent:false,lang};}
export function AirportIntake({lang}:{lang:'ko'|'en'}){
 const ko=lang==='ko',t=(a:string,b:string)=>ko?a:b;
 const [ready,setReady]=useState(false),[open,setOpen]=useState(false),[loading,setLoading]=useState(true),[privacy,setPrivacy]=useState(airportPrivacy[lang]),[mode,setMode]=useState('hosted');
 const [userId,setUserId]=useState<string|null>(null),[authStatus,setAuthStatus]=useState<'signed-out'|'checking'|'verified'|'unverified'>('signed-out');
 const userRef=useRef<string|null>(null),authEpoch=useRef(0),refreshSequence=useRef(0);
 const session=!!userId&&authStatus==='verified';
 const [email,setEmail]=useState(''),[otp,setOtp]=useState(''),[sent,setSent]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const [c,setCase]=useState<CaseRecord|null>(null),[docs,setDocs]=useState<{id:string;name:string}[]>([]),[agreement,setAgreement]=useState(''),[digest,setDigest]=useState(''),[accepted,setAccepted]=useState(false),[privacyOK,setPrivacyOK]=useState(false),[transferOK,setTransferOK]=useState(false),[sensitiveOK,setSensitiveOK]=useState(false),[reference,setReference]=useState('');
 const [d,setD]=useState<AirportDetails>(()=>emptyDetails(lang));
 function field(key:keyof AirportDetails,value:string|boolean){setD(v=>({...v,[key]:value}));setAgreement('');setAccepted(false);}
 function rememberCase(id:string){
  if(!userRef.current)return;
  sessionStorage.setItem(`airport-case:${userRef.current}`,id);
  const url=new URL(location.href);url.searchParams.set('case',id);history.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`);
 }
 async function api(action:string,extra:Record<string,unknown>={}){
  const epoch=authEpoch.current;
  const {data:{session:s}}=await supabase.auth.getSession();
  if(epoch!==authEpoch.current||s?.user.id!==userRef.current)throw new ChangedSessionError();
  const r=await fetch('/api/airport',{method:'POST',headers:{'Content-Type':'application/json',...(s?{Authorization:`Bearer ${s.access_token}`}:{})},body:JSON.stringify({action,...extra})});
  const body=await r.json();if(epoch!==authEpoch.current)throw new ChangedSessionError();if(!r.ok)throw new Error(body.error);return body;
 }
 async function refresh(id:string){
  const epoch=authEpoch.current,sequence=++refreshSequence.current;
  const {data:{session:s}}=await supabase.auth.getSession();if(!s||s.user.id!==userRef.current||epoch!==authEpoch.current)throw new ChangedSessionError();
  const r=await fetch(`/api/airport?id=${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${s.access_token}`}}),b=await r.json();
  if(epoch!==authEpoch.current||sequence!==refreshSequence.current)throw new ChangedSessionError();
  if(!r.ok)throw new Error(b.error);
  if(b.ready===false)return;
  if(b.case?.id!==id||!Array.isArray(b.documents))throw new Error(t('접수 정보를 확인할 수 없습니다.','Unable to verify case information.'));
  setCase(b.case);setDocs(b.documents);rememberCase(id);
 }
 async function run(fn:()=>Promise<void>){const epoch=authEpoch.current;setBusy(true);setMessage('');try{await fn();}catch(e){if(epoch===authEpoch.current&&!(e instanceof ChangedSessionError))setMessage(e instanceof Error?e.message:t('처리할 수 없습니다. 다시 확인해 주세요.','Unable to complete the request.'));}finally{if(epoch===authEpoch.current)setBusy(false);}}
 useEffect(()=>{
  let live=true,events=0;const controller=new AbortController();
  fetch('/api/airport',{signal:controller.signal}).then(r=>r.json()).then(b=>{if(!live)return;setReady(b.ready===true);setOpen(b.open===true);setPrivacy(b.privacy?.[lang]||airportPrivacy[lang]);setMode(b.mode||'hosted');}).catch(()=>{if(live)setMessage(t('접수 상태를 확인할 수 없습니다.','Unable to check availability.'));}).finally(()=>{if(live)setLoading(false);});
  function updateIdentity(id:string|null){
   if(!live||id===userRef.current)return;
   const previous=userRef.current;userRef.current=id;authEpoch.current++;refreshSequence.current++;
   setUserId(id);setAuthStatus(id?'checking':'signed-out');setCase(null);setDocs([]);setAgreement('');setDigest('');setAccepted(false);setReference('');setD(emptyDetails(lang));setSensitiveOK(false);setPrivacyOK(false);setTransferOK(false);setEmail('');setOtp('');setSent(false);setMessage('');setBusy(false);
   sessionStorage.removeItem('airport-case');
   if(previous){const url=new URL(location.href);url.searchParams.delete('case');url.searchParams.delete('approved');url.searchParams.delete('cancelled');history.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`);}
  }
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,s)=>{events++;updateIdentity(s?.user.id||null);});
  supabase.auth.getSession().then(({data})=>{if(events===0)updateIdentity(data.session?.user.id||null);});
  return()=>{live=false;controller.abort();subscription.unsubscribe();authEpoch.current++;refreshSequence.current++;};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[lang]);
 useEffect(()=>{
  if(!userId)return;
  let live=true;const epoch=authEpoch.current,controller=new AbortController();
  (async()=>{const {data:{session:s}}=await supabase.auth.getSession();if(!s||s.user.id!==userId)throw new ChangedSessionError();const r=await fetch('/api/airport/diagnostics',{signal:controller.signal,headers:{Authorization:`Bearer ${s.access_token}`}});const b=await r.json();if(live&&epoch===authEpoch.current)setAuthStatus(r.ok&&b.authenticated===true?'verified':'unverified');})().catch(()=>{if(live&&epoch===authEpoch.current)setAuthStatus('unverified');});
  return()=>{live=false;controller.abort();};
 },[userId]);
 useEffect(()=>{
  if(!session||!userId)return;
  let live=true;const epoch=authEpoch.current,sequence=refreshSequence.current;
  (async()=>{
   const {data:{session:s}}=await supabase.auth.getSession();if(!s||s.user.id!==userId||epoch!==authEpoch.current)return;
   const r=await fetch('/api/airport?mine=true',{headers:{Authorization:`Bearer ${s.access_token}`}}),b=await r.json();if(!live||epoch!==authEpoch.current||sequence!==refreshSequence.current)return;
   if(!r.ok)throw new Error(b.error);if(!Array.isArray(b.cases))return;
   const saved=new URLSearchParams(location.search).get('case')||sessionStorage.getItem(`airport-case:${userId}`);
   // The record endpoint checks ownership, including older cases outside the recent list.
   if(saved){await refresh(saved);return;}
   const current=b.cases.find((v:{status:string})=>['signed','payment_review','paid'].includes(v.status))||b.cases[0];
   if(current)await refresh(current.id);
  })().catch(e=>{if(live&&epoch===authEpoch.current&&!(e instanceof ChangedSessionError))setMessage(t('접수 이력을 불러오지 못했습니다.','Unable to load case history.'));});
  return()=>{live=false;};
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[session,userId]);
 function download(text:string,name:string){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
 const details=()=>({...d,returnAt:d.returnAt?new Date(`${d.returnAt}:00+09:00`).toISOString():'',consent:true,privacyConsent:privacyOK,transferConsent:transferOK,sensitiveConsent:sensitiveOK});
 const documentEmail=c?`mailto:info@kimnhyun.com?subject=${encodeURIComponent(`Airport case documents - ${c.id}`)}`:'mailto:info@kimnhyun.com';
 return <main className="kh-container ai-flow">
  <p><a href={`/${lang}/entry-refusal`}>{t('← 입국불허 안내','← Airport entry refusal')}</a></p>
  <h1>{t('공항 긴급 대응 신청','Airport legal assistance')}</h1>
  <p className="ai-price">USD 3,300 · {t('변호사 업무 최대 3시간','Up to 3 hours of attorney work')}</p>
  <p>{t('접수가 열려 있으면 사무소에 먼저 연락하지 않아도 이 화면에서 계약 서명과 PayPal 결제를 진행할 수 있습니다. 도움이 필요할 때만 각 단계의 연락 방법을 이용하세요.','When intake is open, you can sign the agreement and pay with PayPal online without contacting the office first. Contact options at each step are available if you need help.')}</p>
  <ol className="ai-steps"><li>{t('서류 준비','Prepare')}</li><li>{t('정보·계약 서명','Details & signature')}</li><li>{t('PayPal 결제','PayPal payment')}</li><li>{t('서류 이메일 전송','Email documents')}</li></ol>
  <p className="kh-note">{t('입국 허가·송환 중단 등 특정 결과를 보장하지 않습니다. 공항 방문·통역·소송은 별도 계약입니다.','Admission, suspension of return and other outcomes are not guaranteed. Airport attendance, interpretation and litigation require a separate agreement.')}</p>
  {userId&&<p role="status" className="kh-note">{authStatus==='verified'?t('이메일 로그인 확인 완료. 온라인 접수 상태와 관계없이 인증은 완료되었습니다.','Email sign-in verified. Authentication is complete regardless of whether intake is open.'):authStatus==='checking'?t('서버에서 이메일 로그인을 확인하고 있습니다…','Verifying your email sign-in with the server…'):t('서버에서 로그인을 확인하지 못했습니다. 페이지를 새로고침하거나 다시 로그인해 주세요.','The server could not verify your sign-in. Refresh this page or sign in again.')}</p>}
  {message&&<p role="alert" className="kh-note">{message}</p>}
  <section className="kh-section"><h2>{t('1. 지금 준비할 서류','1. Documents to prepare')}</h2><p>{t('가지고 있는 자료부터 준비하세요. 없는 자료를 만들거나 사실과 다른 내용을 적지 마세요. 이 단계에서는 파일을 전송하지 않습니다.','Prepare the records you already have. Do not fabricate documents or statements. No files are transmitted at this step.')}</p><ul><li>{t('입국불허 통지서 전체 또는 현재 받은 안내','Complete refusal notice or current instructions received')}</li><li>{t('여권 인적사항면·비자 또는 입국 관련 승인 자료','Passport identity page and visa or entry authorization')}</li><li>{t('한국행·송환 항공편, 출발 예정 시각','Inbound and return flights with departure times')}</li><li>{t('숙소·일정·초청장 등 실제 방문 목적을 보여주는 자료','Accommodation, itinerary, invitation and evidence of the actual visit purpose')}</li><li>{t('심사 질문과 답변 메모, 가족·초청인 연락처','Notes of inspection questions and answers; family or host contact')}</li></ul><p>{t('계약 서명과 결제 후 필요한 서류를 info@kimnhyun.com으로 보내 주세요. 서류 파일은 홈페이지에 업로드하지 않습니다.','After signing and paying, email the necessary documents to info@kimnhyun.com. Case document files are not uploaded to this website.')}</p><AirportContact lang={lang} stage="prepare"/></section>
  {loading?<p>{t('접수 상태 확인 중…','Checking availability…')}</p>:!ready?<section className="kh-note"><h2>{t('온라인 접수 연결 준비 중','Online intake is being connected')}</h2><p>{t('계약 서명 저장과 결제 연결을 마친 뒤 온라인 접수를 열겠습니다. 현재 이 화면에서는 서명·결제를 받지 않습니다. 이미 접수한 사건의 서류는 info@kimnhyun.com으로 보내 주세요.','Online intake will open once contract storage and payment are connected. Signatures and payments are not accepted on this screen yet. For an existing case, send documents to info@kimnhyun.com.')}</p><details><summary>{t('위임계약서 미리보기','Preview engagement agreement')}</summary><pre className="ai-contract">{airportContracts[lang]}</pre></details><AirportContact lang={lang} stage="availability"/></section>:!c&&!open?<section className="kh-note"><h2>{t('현재 신규 긴급 접수 마감','New urgent intake is closed')}</h2><p>{t('이미 접수했다면 아래에서 같은 이메일로 로그인하세요.','If you already applied, sign in below using the same email.')}</p><AirportContact lang={lang} stage="availability"/></section>:null}
<section className="kh-section"><details><summary>{t('개인정보 처리·국외이전 안내','Privacy and international transfers')}</summary><pre className="ai-contract">{privacy}</pre></details><p>{t('주민등록번호·여권번호·외국인등록번호는 가리고 제출하세요.','Mask national ID, passport and alien registration numbers before submission.')}</p>{ready&&<><label className="ai-check"><input type="checkbox" checked={privacyOK} onChange={e=>setPrivacyOK(e.target.checked)}/>{t('개인정보 수집·이용에 동의합니다.','I consent to collection and use of personal information.')}</label><label className="ai-check"><input type="checkbox" checked={transferOK} onChange={e=>setTransferOK(e.target.checked)}/>{t('안내된 국외 이전에 별도로 동의합니다.','I separately consent to the described international transfers.')}</label></>}</section>
  {ready&&!session&&<section className="kh-section"><h2>{t('2. 이메일 확인','2. Verify your email')}</h2><p>{t('계약 사본과 접수 기록에 접근하려면 이메일로 로그인하세요. PayPal 결제 후에도 같은 이메일을 사용하고, 사건 서류는 사무소 이메일로 보내 주세요.','Sign in by email to access your contract and case record. Use the same email when returning from PayPal, and send case documents to the office by email.')}</p><label>{t('이메일','Email')}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label><button disabled={busy||!email||!privacyOK||!transferOK} className="kh-button" onClick={()=>run(async()=>{const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:location.href}});if(error)throw error;setSent(true);setMessage(t('이메일의 로그인 링크 또는 인증번호를 확인하세요.','Check your email for the sign-in link or code.'));})}>{t('이메일 인증 보내기','Send sign-in email')}</button>{sent&&<><label>{t('인증번호가 온 경우 입력','If you received a code, enter it')}<input value={otp} onChange={e=>setOtp(e.target.value)} autoComplete="one-time-code"/></label><button disabled={busy||!otp} onClick={()=>run(async()=>{const {error}=await supabase.auth.verifyOtp({email,token:otp,type:'email'});if(error)throw error;const id=userRef.current?sessionStorage.getItem(`airport-case:${userRef.current}`):null;if(id)await refresh(id);})}>{t('확인','Verify')}</button></>}<AirportContact lang={lang} stage="login"/></section>}
  {ready&&session&&!c&&open&&<section className="kh-section"><h2>{t('2. 사건 정보와 계약 서명','2. Case details and agreement')}</h2>
    <div className="ai-fields">
    {(['traveler','signer','contact','relatedParties'] as const).map((key,i)=><label key={key}>{[t('여행자 성명','Traveler full name'),t('서명자 성명','Signer full name'),t('연락처·국가번호','Contact including country code'),t('초청인·회사 등 관계인 이름 (없으면 없음)','Related people or companies (or none)')][i]}<input value={d[key]} onChange={e=>field(key,e.target.value)} maxLength={300}/></label>)}
    <label>{t('서명 자격','Signing capacity')}<select value={d.role} onChange={e=>field('role',e.target.value)}><option value="self">{t('여행자 본인','Traveler')}</option><option value="representative">{t('권한 있는 대리인','Authorized representative')}</option></select></label>
    <label>{t('공항','Airport')}<select value={d.airport} onChange={e=>field('airport',e.target.value)}>{AIRPORT_CODES.map(a=><option key={a}>{a}</option>)}</select></label>
    <label>{t('현재 단계','Current stage')}<select value={d.stage} onChange={e=>field('stage',e.target.value)}><option value="inspection">{t('추가 심사','Further inspection')}</option><option value="refused">{t('입국불허 통지','Refusal notice')}</option><option value="return">{t('송환 대기','Awaiting return')}</option></select></label>
    <label>{t('상담 언어','Working language')}<select value={d.language} onChange={e=>field('language',e.target.value)}><option value="ko">한국어</option><option value="en">English</option></select></label>
    <label>{t('송환 예정 (한국시간 KST)','Scheduled return (Korea time KST)')}<input type="datetime-local" disabled={d.unknownReturn} value={d.returnAt} onChange={e=>field('returnAt',e.target.value)}/></label></div>
    <label className="ai-check"><input type="checkbox" checked={d.unknownReturn} onChange={e=>field('unknownReturn',e.target.checked)}/>{t('송환 시각 미정','Return time not yet known')}</label>
    <p>{t('출발까지 2시간 미만인 경우 온라인 결제를 받지 않습니다.','Online payment is unavailable if the return flight is less than two hours away.')}</p>
    <label>{t('방문 목적과 현재 상황 (상세 서류는 결제 후 이메일로)','Visit purpose and current situation (email detailed documents after payment)')}<textarea value={d.purpose} onChange={e=>field('purpose',e.target.value)} maxLength={1000}/></label>
    <label className="ai-check"><input type="checkbox" checked={d.authority} onChange={e=>field('authority',e.target.checked)}/>{t('본인이거나 계약 체결 권한이 있는 대리인입니다. 단순 결제자에게 대리권이 생기지 않음을 확인합니다.','I am the traveler or authorized to enter this agreement. Payment alone does not confer authority.')}</label>
    <label>{t('전자서명 — 서명자 성명을 그대로 입력','Electronic signature — type the signer’s full name')}<input value={d.signature} onChange={e=>field('signature',e.target.value)} autoComplete="off"/></label>
    <details open><summary>{t('개인정보 처리·국외이전 안내','Privacy and overseas transfer notice')}</summary><pre className="ai-contract">{privacy}</pre></details>
    <label className="ai-check"><input type="checkbox" checked={privacyOK} onChange={e=>setPrivacyOK(e.target.checked)}/>{t('개인정보 처리·국외이전 안내를 읽고 동의합니다.','I have read and agree to the privacy and overseas transfer notice.')}</label>
    <label className="ai-check"><input type="checkbox" checked={sensitiveOK} onChange={e=>setSensitiveOK(e.target.checked)}/>{t('선택: 사건 검토에 필요한 건강·형사 관련 민감정보 처리에 별도로 동의합니다. 미동의 시 해당 자료를 제출하지 마세요.','Optional: I consent to necessary health/criminal information processing. If unchecked, do not submit such records.')}</label>
    <button className="kh-button" disabled={busy||!privacyOK||!transferOK} onClick={()=>run(async()=>{const b=await api('preview',{details:details()});setAgreement(b.agreement);setDigest(b.hash);setAccepted(false);})}>{t('기재 내용을 넣은 계약서 확인','Review the completed agreement')}</button>
    {agreement&&<><pre className="ai-contract" tabIndex={0}>{agreement}</pre><button onClick={()=>download(agreement,'engagement-agreement.txt')}>{t('계약서 저장','Download agreement')}</button><label className="ai-check"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/>{t('전문·위임범위·USD 3,300·환불 조건에 동의하며, 입국 허가나 송환 중단을 보장하지 않음을 확인합니다.','I accept the full agreement, scope, USD 3,300 fee and refund terms, and acknowledge that admission or suspension of return is not guaranteed.')}</label><button className="kh-button" disabled={!accepted||!privacyOK||!transferOK||busy} onClick={()=>run(async()=>{const b=await api('sign',{details:details(),hash:digest});rememberCase(b.id);await refresh(b.id);})}>{t('서명 저장하고 결제로','Save signature and continue to payment')}</button></>}
    <AirportContact lang={lang} stage="agreement"/>
  </section>}
  {c&&<><section className="kh-section"><h2>{c.status==='signed'&&ready?t('3. PayPal 결제','3. PayPal payment'):t('저장된 계약·접수 기록','Saved agreement and case record')}</h2><p>{t('접수번호','Case reference')}: {c.id}</p><p>{t('계약 서명 저장 시각','Agreement saved')}: {new Date(c.signed_at).toLocaleString()}</p><button onClick={()=>download(`${c.agreement}\n\nSigned at: ${c.signed_at}\nSHA-256: ${c.agreement_hash}`,'signed-agreement.txt')}>{t('서명 계약 사본 저장','Download signed contract copy')}</button>
    <details><summary>{t('서명 계약서 보기','View signed agreement')}</summary><pre className="ai-contract">{c.agreement}</pre></details>
    {c.status==='signed'&&ready?<><p>{t('PayPal에서 USD 3,300을 결제한 뒤 이 화면으로 돌아오세요. 결제 화면 이동만으로 결제가 완료되지 않습니다.','Pay USD 3,300 on PayPal, then return here. Opening checkout does not confirm payment.')}</p><button className="kh-button" disabled={busy} onClick={()=>run(async()=>{const b=await api('order',{id:c.id});location.assign(b.url);})}>{t('PayPal에서 USD 3,300 지급','Pay USD 3,300 on PayPal')}</button>{mode==='hosted'?<><label>{t('결제 후 PayPal 거래번호','PayPal transaction reference after payment')}<input value={reference} onChange={e=>setReference(e.target.value)} maxLength={120}/></label><button disabled={busy||reference.length<6} onClick={()=>run(async()=>{const result=await api('payment-report',{id:c.id,reference});await refresh(c.id);if(result.warning)setMessage(result.warning);})}>{t('결제 내역 알리고 서류 이메일 안내 보기','Report payment and view email instructions')}</button></>:<button disabled={busy} onClick={()=>run(async()=>{const b=await api('capture',{id:c.id});await refresh(c.id);if(!b.paid)setMessage(t('결제가 아직 확인되지 않았습니다. 재결제하지 말고 사무소로 연락해 주세요.','Payment is not confirmed. Contact the office before paying again.'));})}>{t('PayPal 결제 확인','Confirm PayPal payment')}</button>}</>:<p className="kh-note">{c.status==='paid'?t('사무소 결제 확인 완료','Payment verified'):c.status==='payment_review'?t('결제 확인 대기. 이 표시는 실제 결제 완료의 증명이 아닙니다.','Payment verification pending. This status is not proof of completed payment.'):c.status==='signed'?t('서명 저장 완료 — 현재 온라인 결제는 중지되어 있습니다.','Signature saved — online payment is currently unavailable.'):t('종료된 접수','Closed case')}</p>}
    <AirportContact lang={lang} stage="payment"/>
  </section>
  <section className="kh-section"><h2>{['paid','payment_review'].includes(c.status)?t('4. 필요한 서류를 이메일로 전달','4. Email your documents'):t('사건 서류','Case documents')}</h2>
    {['paid','payment_review'].includes(c.status)?<>
      <p>{t('필요한 사건 서류는 사무소 이메일로 보내 주세요. 홈페이지에는 서류 파일을 업로드하지 않습니다.','Send the necessary case documents to the office by email. Case document files are not uploaded to this website.')}</p>
      <p><strong>{t('받는 주소: ','Send to: ')}<a href={documentEmail}>info@kimnhyun.com</a></strong></p>
      <ol><li>{t('가능하면 접수할 때 로그인한 이메일 주소로 보내 주세요.','Where possible, send from the email address used to sign in.')}</li><li>{t('메일 제목에 아래 접수번호를 적고, 필요한 PDF 또는 선명한 서류 사진을 첨부하세요.','Include the case reference below in the subject and attach the necessary PDFs or clear document photographs.')}</li><li>{t('보내기 전에 수신 주소와 첨부파일을 확인하세요. 불필요한 주민등록번호·여권번호·외국인등록번호는 가려 주세요.','Check the recipient address and attachments before sending. Mask national ID, passport and alien registration numbers that are not needed.')}</li></ol>
      <p>{t('접수번호','Case reference')}: <strong>{c.id}</strong></p>
      <p>{t('건강·형사 관련 자료는 별도 민감정보 동의를 한 경우에만 보내세요. 아직 동의하지 않았다면 해당 자료를 첨부하기 전에 사무소에 동의 절차를 문의하세요.','Send health or criminal records only after separately consenting to sensitive-information processing. If you have not consented, contact the office for the consent procedure before attaching those records.')}</p>
      <a className="kh-button" href={documentEmail}>{t('서류 보낼 이메일 작성','Compose document email')}</a>
      <p className="kh-note">{t('이 버튼은 이메일 작성 화면을 엽니다. 파일 첨부와 발송은 이메일에서 직접 완료해야 하며, 버튼 클릭만으로 서류가 접수되지 않습니다. 이메일 앱이 열리지 않으면 위 주소와 접수번호를 복사해 사용하는 메일에서 보내 주세요.','This button opens an email draft. Attach your files and send the email yourself; clicking the button does not submit documents. If no email app opens, copy the address and case reference into your usual email service.')}</p>
      <p>{t('서류 수신 여부는 사무소의 회신으로 확인하세요. 이메일의 보호 수준은 사용하는 메일 서비스와 계정 설정에 따라 달라집니다. 암호화 파일을 보내는 경우 비밀번호는 전화 등 별도 연락 방법으로 전달하세요.','Confirm receipt through the office’s reply. Email protection depends on the email service and account settings. If you send encrypted files, provide the password through a separate channel such as a phone call.')}</p>
    </>:c.status==='signed'?<p>{t('계약 서명과 결제 후 필요한 서류를 info@kimnhyun.com으로 보내 주세요.','After signing and paying, email the necessary documents to info@kimnhyun.com.')}</p>:null}
    {docs.length>0&&<><h3>{t('이전에 홈페이지에 보관한 파일','Files previously stored on this website')}</h3><p>{t('기존 파일의 다운로드만 제공합니다. 새 서류는 이메일로 보내 주세요. 이메일로 보낸 자료는 이 목록에 표시되지 않습니다.','Previously stored files remain available for download. Send new documents by email. Emailed documents do not appear in this list.')}</p><ul>{docs.map(file=><li key={file.id}>{file.name} <button disabled={busy} onClick={()=>run(async()=>{const b=await api('download',{id:c.id,document:file.id});location.assign(b.url);})}>{t('다운로드','Download')}</button></li>)}</ul></>}
    <AirportContact lang={lang} stage="documents"/>
  </section></>}

 </main>;
}
