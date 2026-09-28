import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {admin,airportReady,automaticPayment,hostedPaymentUrl,notifyOffice,contract,contractVersion,db,hash,identity,paypal} from '@/lib/airport-server';
import {AIRPORT_PRICE,validateDetails,validUpload} from '@/lib/airport-validation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
function json(value:unknown,status=200){return NextResponse.json(value,{status,headers});}
function originOK(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
async function owned(req:Request,id:string){
 const user=await identity(req);
 const {data,error}=await db().from('airport_cases').select('*').eq('id',id).eq('user_id',user.id).single();
 if(error||!data)throw new Error('Case unavailable');
 return data;
}
async function verifyPayment(c:Record<string,unknown>){
 if(!c.paypal_order_id)return false;
 const order=await paypal(`/v2/checkout/orders/${c.paypal_order_id}`);
 const unit=order.purchase_units?.[0];
 const capture=unit?.payments?.captures?.find((v:{status:string})=>v.status==='COMPLETED');
 if(order.status!=='COMPLETED'||!capture||capture.amount?.currency_code!=='USD'||capture.amount?.value!==AIRPORT_PRICE||unit.custom_id!==c.id)return false;
 const result=await db().from('airport_cases').update({status:'paid',paypal_capture_id:capture.id,paid_at:c.paid_at||new Date().toISOString()}).eq('id',c.id).eq('status','signed').select('id');
 if(result.error)throw new Error('Payment reconciliation pending');
 if(result.data?.length && process.env.RESEND_API_KEY && process.env.AIRPORT_NOTIFY_TO && process.env.AIRPORT_NOTIFY_FROM){
   try { await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.AIRPORT_NOTIFY_FROM,to:process.env.AIRPORT_NOTIFY_TO,subject:'공항 긴급 사건 결제 확인 — USD 3,300',text:`사건번호: ${c.id}\n관리자 화면에서 서명계약과 자료를 확인하세요.\nhttps://koreavisalaw.com/admin/airport`})}); } catch { /* case remains visible in administrator queue */ }
 }
 return true;
}
export async function GET(req:Request){
 try{
  const url=new URL(req.url),id=url.searchParams.get('id');
  if(!airportReady())return json({ready:false,open:false});
  if(url.searchParams.get('mine')==='true'){
    const user=await identity(req);const cases=await db().from('airport_cases').select('id,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(10);
    if(cases.error)throw cases.error;return json({cases:cases.data});
  }
  if(id){const c=await owned(req,id); if(c.status==='signed'&&c.paypal_order_id)await verifyPayment(c); const fresh=await owned(req,id); const docs=await db().from('airport_documents').select('id,name,created_at').eq('case_id',id); return json({case:fresh,documents:docs.data||[]});}
  const desk=await db().from('airport_desk').select('*').eq('id',true).single();
  if(desk.error)return json({ready:false,open:false});
  return json({ready:true,open:desk.data.is_open&&!desk.data.active_case,version:contractVersion,mode:automaticPayment()?'api':'hosted',privacy:{ko:process.env.AIRPORT_PRIVACY_KO,en:process.env.AIRPORT_PRIVACY_EN}});
 }catch{return json({error:'Unable to load. Sign in again or contact the office.'},400);}
}
export async function POST(req:Request){
 try{
  if(!originOK(req))return json({error:'Invalid origin'},403);
  if(!airportReady())return json({error:'Online intake is not yet available.'},503);
  if(Number(req.headers.get('content-length')||0)>50000)return json({error:'Request too large'},413);
  const b=await req.json();
  if(b.action==='preview'){
    const d=validateDetails(b.details);
    return json({agreement:contract(d),hash:hash(contract(d)),version:contractVersion});
  }
  if(b.action==='sign'){
    const user=await identity(req),d=validateDetails(b.details),agreement=contract(d);
    if(b.hash!==hash(agreement))return json({error:'Agreement changed. Review the contract again.'},409);
    const id=randomUUID(),privacy=process.env[d.lang==='ko'?'AIRPORT_PRIVACY_KO':'AIRPORT_PRIVACY_EN']!;
    const result=await db().rpc('reserve_airport_case',{p_id:id,p_user:user.id,p_details:d,p_agreement:agreement,p_hash:hash(agreement),p_version:contractVersion,p_privacy:privacy});
    if(result.error)return json({error:'Intake is closed or another case has reserved the slot.'},409);
    return json({id});
  }
  if(b.action==='order'){
    const c=await owned(req,b.id);
    if(c.status!=='signed')return json({error:'Case cannot be paid again'},409);
    const lock=await db().rpc('lock_airport_payment',{p_id:c.id});
    if(lock.error)return json({error:'Reservation expired. Contact the office.'},409);
    if(!automaticPayment())return json({url:hostedPaymentUrl,mode:'hosted'});
    let order;
    if(c.paypal_order_id)order=await paypal(`/v2/checkout/orders/${c.paypal_order_id}`);
    else {
      const root=new URL(req.url).origin,lang=c.details.lang;
      order=await paypal('/v2/checkout/orders','POST',{intent:'CAPTURE',purchase_units:[{custom_id:c.id,description:'Korea airport entry refusal urgent legal response',amount:{currency_code:'USD',value:AIRPORT_PRICE}}],payment_source:{paypal:{experience_context:{user_action:'PAY_NOW',shipping_preference:'NO_SHIPPING',return_url:`${root}/${lang}/entry-refusal/apply?case=${c.id}&approved=1`,cancel_url:`${root}/${lang}/entry-refusal/apply?case=${c.id}&cancelled=1`}}}},`${c.id}-order`);
      const save=await db().from('airport_cases').update({paypal_order_id:order.id}).eq('id',c.id);
      if(save.error)throw new Error('Unable to record payment order');
    }
    const href=order.links?.find((l:{rel:string})=>['payer-action','approve'].includes(l.rel))?.href;
    if(!href) return json({error:'Check payment status before retrying.'},409);
    return json({url:href});
  }
  if(b.action==='capture'){
    const c=await owned(req,b.id);
    if(c.status==='paid')return json({paid:true});
    if(c.status!=='signed'||!c.paypal_order_id)return json({error:'No eligible order'},409);
    // A browser return is not proof of payment. Capture and independently retrieve the stored order.
    try{await paypal(`/v2/checkout/orders/${c.paypal_order_id}/capture`,'POST',{},`${c.id}-capture`);}catch{/* reconcile even after network loss or duplicate capture */}
    return json({paid:await verifyPayment(c)});
  }
  if(b.action==='payment-report'){
    const c=await owned(req,b.id);
    if(automaticPayment()||c.status!=='signed')return json({error:'Check the current payment status'},409);
    if(typeof b.reference!=='string'||b.reference.trim().length<6||b.reference.length>120)return json({error:'Enter the PayPal transaction reference'},400);
    const desk=await db().from('airport_desk').select('active_case').eq('id',true).single();
    if(desk.data?.active_case!==c.id)return json({error:'Reservation expired. Contact the office with your transaction reference.'},409);
    const update=await db().from('airport_cases').update({status:'payment_review',payer_reference:b.reference.trim()}).eq('id',c.id).eq('status','signed');
    if(update.error)throw update.error;
    try{await notifyOffice(c.id);}catch{return json({ok:true,warning:'Your payment report was saved, but the office alert failed. Please call +82-2-3477-7600 now.'});}
    return json({ok:true});
  }
  if(b.action==='admin-confirm-payment'){
    const a=await admin(req);
    if(typeof b.reference!=='string'||!/^[A-Za-z0-9-]{6,80}$/.test(b.reference)||b.amount!==AIRPORT_PRICE||b.currency!=='USD')return json({error:'Confirm the actual USD 3300.00 transaction in PayPal first.'},400);
    const update=await db().from('airport_cases').update({status:'paid',paypal_capture_id:b.reference,payment_confirmed_by:a.id,paid_at:new Date().toISOString()}).eq('id',b.id).in('status',['signed','payment_review']);
    if(update.error)throw update.error;return json({ok:true});
  }
  if(b.action==='download'){
    await owned(req,b.id);
    const file=await db().from('airport_documents').select('path').eq('id',b.document).eq('case_id',b.id).single();
    if(!file.data)throw new Error('File unavailable');
    const link=await db().storage.from('airport-private').createSignedUrl(file.data.path,60,{download:true});
    if(link.error)throw link.error;
    return json({url:link.data.signedUrl});
  }
  if(b.action==='admin-list'){
    await admin(req);
    const cases=await db().from('airport_cases').select('*').order('created_at',{ascending:false}).limit(50);
    const desk=await db().from('airport_desk').select('*').eq('id',true).single();
    if(cases.error||desk.error)throw new Error('Database unavailable');
    return json({cases:cases.data,desk:desk.data});
  }
  if(b.action==='admin-files'){
    await admin(req); const files=await db().from('airport_documents').select('*').eq('case_id',b.id);
    const links=await Promise.all((files.data||[]).map(async file=>({name:file.name,url:(await db().storage.from('airport-private').createSignedUrl(file.path,60,{download:true})).data?.signedUrl})));
    return json({files:links});
  }
  if(b.action==='admin-open'){
    await admin(req); const update=await db().from('airport_desk').update({is_open:b.open===true}).eq('id',true); if(update.error)throw update.error; return json({ok:true});
  }
  if(b.action==='admin-release'){
    await admin(req);
    const c=await db().from('airport_cases').select('*').eq('id',b.id).single();
    if(!c.data)throw new Error('Case unavailable');
    // Do not release a PayPal order that could still settle later.
    if(c.data.status==='signed'&&c.data.paypal_order_id){
      const order=await paypal(`/v2/checkout/orders/${c.data.paypal_order_id}`);
      if(!['VOIDED'].includes(order.status))return json({error:'PayPal order may still settle. Reconcile/void it before releasing this slot.'},409);
    }
    const u=await db().from('airport_cases').update({status:'closed'}).eq('id',b.id);if(u.error)throw u.error;
    const r=await db().from('airport_desk').update({active_case:null,expires_at:null,is_open:false}).eq('active_case',b.id);if(r.error)throw r.error;
    return json({ok:true});
  }
  return json({error:'Unknown action'},400);
 }catch{return json({error:'Request could not be completed. Check your information or contact the office.'},400);}
}
export async function PUT(req:Request){
 try{
  if(!originOK(req)||!airportReady())return json({error:'Unavailable'},403);
  // Keep request below Vercel function body limit; enforce actual magic bytes as well as MIME.
  if(Number(req.headers.get('content-length')||0)>4*1024*1024)return json({error:'Maximum 3 MB per file'},413);
  const id=new URL(req.url).searchParams.get('id')||'',c=await owned(req,id);
  if(!['paid','payment_review'].includes(c.status))return json({error:'Complete the payment step before uploading'},403);
  const form=await req.formData(),file=form.get('file');
  if(!(file instanceof File)||file.size>3*1024*1024||!validUpload(file.name,file.type,file.size))return json({error:'Use PDF, JPG or PNG up to 3 MB'},400);
  const count=await db().from('airport_documents').select('id',{count:'exact',head:true}).eq('case_id',id);
  if((count.count||0)>=20)return json({error:'Maximum 20 files per case'},400);
  const bytes=Buffer.from(await file.arrayBuffer());
  const matches=file.type==='application/pdf'?bytes.subarray(0,5).toString()==='%PDF-':file.type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  if(!matches)return json({error:'File format does not match its content'},400);
  const path=`${c.user_id}/${id}/${randomUUID()}.${file.type==='application/pdf'?'pdf':file.type==='image/png'?'png':'jpg'}`;
  const upload=await db().storage.from('airport-private').upload(path,bytes,{contentType:file.type,upsert:false});if(upload.error)throw upload.error;
  const insert=await db().from('airport_documents').insert({case_id:id,path,name:file.name.slice(0,200),mime:file.type,size:file.size});
  if(insert.error){await db().storage.from('airport-private').remove([path]);throw insert.error;}
  return json({ok:true});
 }catch{return json({error:'Upload failed. Your file has not been confirmed as received.'},400);}
}
