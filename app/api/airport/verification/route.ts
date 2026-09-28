import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {createHash,createHmac,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {GET as airportGET,POST as airportPOST} from '../route';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'};
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers});
const VERSION='AIRPORT-TEST-ONLY-NON-BINDING';
type Resource={label:'A'|'B';userId:string;caseId:string;documentId:string;path:string};
type Manifest={v:1;runId:string;ownerId:string;createdAt:string;resources:Resource[]};
type Client=ReturnType<typeof client>;
const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
function syntheticPdf(label:string){
 const content=`BT /F1 16 Tf 50 740 Td (TEST ONLY - NON-BINDING CUSTOMER ${label}) Tj ET`;
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
 let pdf='%PDF-1.4\n';const offsets=[0];for(let i=0;i<objects.length;i++){offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
 const start=Buffer.byteLength(pdf);pdf+=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>`${String(n).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;return Buffer.from(pdf);
}
function client(key:string,token?:string){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,key,{auth:{persistSession:false,autoRefreshToken:false},...(token?{global:{headers:{Authorization:`Bearer ${token}`}}}:{})});}
async function administrator(req:Request){
 const token=req.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
 if(!token||!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)return null;
 try{const c=client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,token);const user=await c.auth.getUser(token);if(user.error||!user.data.user)return null;const role=await c.rpc('is_visa_content_admin');return {id:user.data.user.id,admin:!role.error&&role.data===true};}catch{return null;}
}
function seal(m:Manifest,key:string){const payload=Buffer.from(JSON.stringify(m)).toString('base64url');return `${payload}.${createHmac('sha256',key).update(payload).digest('base64url')}`;}
function unseal(value:unknown,key:string):Manifest|null{
 try{
  if(typeof value!=='string'||value.length>8000)return null;
  const [body,signature,extra]=value.split('.');if(!body||!signature||extra)return null;
  const expected=createHmac('sha256',key).update(body).digest(),given=Buffer.from(signature,'base64url');
  if(expected.length!==given.length||!timingSafeEqual(expected,given))return null;
  const m=JSON.parse(Buffer.from(body,'base64url').toString()) as Manifest;
  if(m.v!==1||!uuid(m.runId)||!uuid(m.ownerId)||typeof m.createdAt!=='string'||!Array.isArray(m.resources)||m.resources.length>2||!m.resources.length)return null;
  const ids=new Set<string>();
  for(const r of m.resources){if(!['A','B'].includes(r.label)||!uuid(r.userId)||!uuid(r.caseId)||!uuid(r.documentId)||r.path!==`${r.userId}/${r.caseId}/verification-${m.runId}.pdf`||ids.has(r.userId)||ids.has(r.caseId)||ids.has(r.documentId))return null;ids.add(r.userId);ids.add(r.caseId);ids.add(r.documentId);}
  return m;
 }catch{return null;}
}

async function cleanup(c:Client,m:Manifest){
 const counts={files:0,documents:0,cases:0,users:0};
 // Validate every persisted marker before deleting any member of the signed set.
 const verified=[];
 for(const r of m.resources){
  const [userResult,caseResult,docs]=await Promise.all([c.auth.admin.getUserById(r.userId),c.from('airport_cases').select('*').eq('id',r.caseId).maybeSingle(),c.from('airport_documents').select('id,path,case_id').eq('case_id',r.caseId)]);
  if(userResult.error&&userResult.error.status!==404)throw new Error('Verification account ownership could not be checked');
  const user=userResult.data?.user,record=caseResult.data;
  if(caseResult.error||docs.error)throw new Error('Verification records could not be checked');
  if(user&&(user.app_metadata?.diagnosticRun!==m.runId||user.app_metadata?.airportVerification!==true||user.app_metadata?.diagnosticCreatedBy!==m.ownerId||user.email!==`airport-test-${m.runId}-${r.label.toLowerCase()}@example.invalid`))throw new Error('Verification account marker mismatch; nothing was deleted');
  if(record&&(!user||record.user_id!==r.userId||record.details?.diagnosticRun!==m.runId||record.details?.testOnly!==true||record.agreement_version!==VERSION||record.status!=='closed'||record.paypal_order_id||record.paypal_capture_id||record.paid_at||record.payer_reference))throw new Error('Verification case marker mismatch; nothing was deleted');
  if((docs.data||[]).some(d=>d.id!==r.documentId||d.path!==r.path)||(!record&&(docs.data||[]).length))throw new Error('Verification document marker mismatch; nothing was deleted');
  verified.push({r,user,record,documents:docs.data||[]});
 }
 for(const {r,user,record,documents} of verified){
  const removed=await c.storage.from('airport-private').remove([r.path]);
  if(removed.error)throw new Error('Verification file cleanup failed; retry cleanup');
  const remaining=await c.storage.from('airport-private').list(`${r.userId}/${r.caseId}`,{search:`verification-${m.runId}.pdf`,limit:1});
  if(remaining.error||remaining.data?.some(f=>f.name===`verification-${m.runId}.pdf`))throw new Error('Verification file deletion could not be confirmed');
  counts.files+=(removed.data||[]).length;
  if(documents.length){const deleted=await c.from('airport_documents').delete().eq('id',r.documentId).eq('case_id',r.caseId);if(deleted.error)throw new Error('Verification document cleanup failed; retry cleanup');counts.documents++;}
  if(record){const deleted=await c.from('airport_cases').delete().eq('id',r.caseId).eq('user_id',r.userId).eq('status','closed');if(deleted.error)throw new Error('Verification case cleanup failed; retry cleanup');counts.cases++;}
  if(user){const deleted=await c.auth.admin.deleteUser(r.userId);if(deleted.error)throw new Error('Verification account cleanup failed; retry cleanup');counts.users++;}
 }
 return counts;
}

export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid origin'},403);
 const admin=await administrator(req);if(!admin)return json({error:'Sign in required'},401);if(!admin.admin)return json({error:'Administrator access required'},403);
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)return json({error:'Server storage configuration is missing'},503);
 let body;try{if(Number(req.headers.get('content-length')||0)>10000)return json({error:'Request too large'},413);body=await req.json();}catch{return json({error:'Invalid request'},400);}
 const c=client(key);
 if(body.action==='cleanup'){
  const m=unseal(body.manifest,key);if(!m)return json({error:'Invalid cleanup manifest'},400);
  try{return json({ok:true,runId:m.runId,counts:await cleanup(c,m)});}catch(e){return json({ok:false,error:e instanceof Error?e.message:'Verification cleanup failed'},503);}
 }
 if(body.action!=='start')return json({error:'Unknown action'},400);
 const m:Manifest={v:1,runId:randomUUID(),ownerId:admin.id,createdAt:new Date().toISOString(),resources:[]};
 const accounts:{label:string;caseId:string;documentId:string;loginUrl:string}[]=[];
 const credentials:{label:string;token:string;authClient:Client}[]=[],checks:Record<string,boolean>={};
 let stage='account creation',providerCode:string|undefined;
 function failed(error:unknown,fallback:string):never{const code=error&&typeof error==='object'&&'code' in error?String(error.code):fallback;providerCode=/^[A-Za-z0-9_.-]{1,80}$/.test(code)?code:'PROVIDER_ERROR';throw new Error('Verification provider failed');}
 try{
  for(const label of ['A','B'] as const){
   const email=`airport-test-${m.runId}-${label.toLowerCase()}@example.invalid`,password=randomBytes(40).toString('base64url');
   const created=await c.auth.admin.createUser({email,password,email_confirm:true,app_metadata:{airportVerification:true,diagnosticRun:m.runId,diagnosticCreatedBy:m.ownerId},user_metadata:{display_name:`TEST CUSTOMER ${label} — disposable verification`}});
   if(created.error||!created.data.user)failed(created.error,'CREATE_USER_FAILED');
   const userId=created.data.user.id,caseId=randomUUID(),documentId=randomUUID(),path=`${userId}/${caseId}/verification-${m.runId}.pdf`;
   m.resources.push({label,userId,caseId,documentId,path});
   stage='customer permission verification';
   const authClient=client(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
   const signIn=await authClient.auth.signInWithPassword({email,password});
   if(signIn.error||!signIn.data.session||signIn.data.user?.id!==userId)failed(signIn.error,'TEST_SIGNIN_FAILED');
   credentials.push({label,token:signIn.data.session.access_token,authClient});
   const role=await authClient.rpc('is_visa_content_admin');
   if(role.error||role.data!==false)failed(role.error,'UNEXPECTED_ADMIN_ROLE');
   checks[`customer${label}HasNoAdminRole`]=true;
   stage='synthetic case creation';
   const agreement=`TEST ONLY — NON-BINDING — CUSTOMER ${label}\nThis is a synthetic access-isolation verification record. No client engagement, signature, legal services, or payment exists.\nRun: ${m.runId}`;
   const inserted=await c.from('airport_cases').insert({id:caseId,user_id:userId,details:{testOnly:true,diagnosticRun:m.runId,traveler:`TEST CUSTOMER ${label}`,signer:`TEST CUSTOMER ${label}`,signature:'NOT SIGNED — TEST ONLY',contact:email,lang:'en',airport:'ICN',role:'self',purpose:'Synthetic access isolation verification',relatedParties:'No real persons'},agreement,agreement_hash:createHash('sha256').update(agreement).digest('hex'),agreement_version:VERSION,privacy_notice:'TEST ONLY — contains no client personal information',status:'closed'});
   if(inserted.error)failed(inserted.error,'TEST_CASE_FAILED');
   stage='synthetic document creation';
   const bytes=syntheticPdf(label);
   const uploaded=await c.storage.from('airport-private').upload(path,bytes,{contentType:'application/pdf',upsert:false});if(uploaded.error)failed(uploaded.error,'TEST_UPLOAD_FAILED');
   const doc=await c.from('airport_documents').insert({id:documentId,case_id:caseId,path,name:`TEST-ONLY-CUSTOMER-${label}.pdf`,mime:'application/pdf',size:bytes.length});if(doc.error)failed(doc.error,'TEST_DOCUMENT_FAILED');
   stage='temporary sign-in link creation';
   const link=await c.auth.admin.generateLink({type:'magiclink',email,options:{redirectTo:'https://koreavisalaw.com/en/entry-refusal/apply'}});
   const loginUrl=link.data?.properties?.action_link;
   if(link.error||!loginUrl||!loginUrl.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify?`))failed(link.error,'TEST_LINK_FAILED');
   accounts.push({label,caseId,documentId,loginUrl});
  }
  stage='real customer API access isolation';
  const origin=new URL(req.url).origin;
  await Promise.all(credentials.map(async({label,token})=>{
   const own=m.resources.find(r=>r.label===label)!,other=m.resources.find(r=>r.label!==label)!;
   const request=(query:string)=>new Request(`${origin}/api/airport${query}`,{headers:{Authorization:`Bearer ${token}`}});
   const download=(caseId:string,documentId:string)=>airportPOST(new Request(`${origin}/api/airport`,{method:'POST',headers:{Origin:origin,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({action:'download',id:caseId,document:documentId})}));
   const [ownResponse,otherResponse,mineResponse,ownDownload,otherDownload]=await Promise.all([airportGET(request(`?id=${own.caseId}`)),airportGET(request(`?id=${other.caseId}`)),airportGET(request('?mine=true')),download(own.caseId,own.documentId),download(other.caseId,other.documentId)]);
   const ownBody=await ownResponse.json(),mine=await mineResponse.json(),ownFile=await ownDownload.json();
   checks[`customer${label}OwnCase`]=ownResponse.status===200&&ownBody.case?.id===own.caseId&&ownBody.case?.details?.diagnosticRun===m.runId;
   checks[`customer${label}OtherCaseDenied`]=otherResponse.status===400;
   checks[`customer${label}ListOnlyOwnCase`]=mineResponse.status===200&&Array.isArray(mine.cases)&&mine.cases.length===1&&mine.cases[0].id===own.caseId;
   checks[`customer${label}OwnDownload`]=ownDownload.status===200&&typeof ownFile.url==='string';
   checks[`customer${label}OtherDownloadDenied`]=otherDownload.status===400;
  }));
  if(!Object.values(checks).every(Boolean))throw new Error('isolation');
  return json({ok:true,runId:m.runId,manifest:seal(m,key),accounts,customerAdminAccess:false,checks});
 }catch{
  let cleaned=false,counts;
  try{counts=await cleanup(c,m);cleaned=true;}catch{/* Preserve the signed manifest for exact-resource cleanup retry. */}
  return json({ok:false,error:`Verification failed during ${stage}`,providerCode,cleaned,counts,checks,...(!cleaned&&m.resources.length?{runId:m.runId,manifest:seal(m,key)}:{})},503);
 }finally{await Promise.allSettled(credentials.map(({authClient})=>authClient.auth.signOut({scope:'local'})));}
}
