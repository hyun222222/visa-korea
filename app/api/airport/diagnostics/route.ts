import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers});

// Authenticate independently of both the service key and the public intake switch.
// A broken server key must not prevent the office from identifying the problem.
async function authenticate(req:Request){
 const token=req.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!token||!url||!key)return null;
 try{
  const client=createClient(url,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await client.auth.getUser(token);
  if(error||!data.user)return null;
  const role=await client.rpc('is_visa_content_admin');
  return {admin:!role.error&&role.data===true};
 }catch{return null;}
}

export async function GET(req:Request){
 const identity=await authenticate(req);
 return identity?json({authenticated:true,admin:identity.admin}):json({authenticated:false,admin:false,error:'Sign in required'},401);
}

export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid origin'},403);
 const identity=await authenticate(req);
 if(!identity)return json({error:'Sign in required'},401);
 if(!identity.admin)return json({error:'Administrator access required'},403);

 const stages={databaseRead:false,privateBucket:false,upload:false,download:false,publicReadBlocked:false,cleanup:false};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return json({ok:false,stages,error:'Server storage configuration is missing'},503);
 const diagnosticId=randomUUID(),path=`diagnostics/${diagnosticId}.pdf`;
 // This contains no client information and is never registered as a case document.
 const bytes=Buffer.from('%PDF-1.4\n% Synthetic airport storage verification only\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n');
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const bucket=client.storage.from('airport-private');
 let attemptedUpload=false,error='';
 try{
  // Select only the singleton key, never customer records or the active case ID.
  const desk=await client.from('airport_desk').select('id').eq('id',true).single();
  if(desk.error||desk.data?.id!==true)throw new Error('Server database connection failed');
  stages.databaseRead=true;
  const meta=await client.storage.getBucket('airport-private');
  if(meta.error||meta.data?.public!==false)throw new Error('Private storage configuration could not be verified');
  stages.privateBucket=true;
  attemptedUpload=true;
  const uploaded=await bucket.upload(path,bytes,{contentType:'application/pdf',upsert:false});
  if(uploaded.error)throw new Error('Synthetic document upload failed');
  stages.upload=true;
  const downloaded=await bucket.download(path);
  if(downloaded.error||!downloaded.data||!Buffer.from(await downloaded.data.arrayBuffer()).equals(bytes))throw new Error('Synthetic document download did not match');
  stages.download=true;
  const publicResponse=await fetch(`${url.replace(/\/$/,'')}/storage/v1/object/public/airport-private/${path}`,{cache:'no-store',signal:AbortSignal.timeout(8000)});
  stages.publicReadBlocked=[400,401,403,404].includes(publicResponse.status);
  if(!stages.publicReadBlocked)throw new Error('Anonymous document access denial could not be verified');
 }catch(e){
  // Supabase provider errors may contain request details; return only these fixed messages.
  const safe=['Server database connection failed','Private storage configuration could not be verified','Synthetic document upload failed','Synthetic document download did not match','Anonymous document access denial could not be verified'];
  error=e instanceof Error&&safe.includes(e.message)?e.message:'Storage verification could not be completed';
 }finally{
  if(attemptedUpload){
   try{
    const removed=await bucket.remove([path]);
    if(!removed.error){
     const remaining=await bucket.list('diagnostics',{search:`${diagnosticId}.pdf`,limit:1});
     stages.cleanup=!remaining.error&&Array.isArray(remaining.data)&&!remaining.data.some(file=>file.name===`${diagnosticId}.pdf`);
    }
   }catch{/* The result explicitly reports a cleanup failure for office follow-up. */}
   if(!stages.cleanup)error=error?`${error}; synthetic document cleanup must be checked`:'Synthetic document cleanup must be checked';
  }
 }
 const ok=Object.values(stages).every(Boolean);
 return json({ok,diagnosticId,stages,...(error?{error}:{})},ok?200:503);
}
