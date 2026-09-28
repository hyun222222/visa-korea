import 'server-only';
import {airportPrivacy} from './airport-privacy';
import {createClient} from '@supabase/supabase-js';
import {createHash} from 'node:crypto';
import {airportContracts} from './airport-contracts';
import type {AirportDetails} from './airport-validation';
export const contractVersion='airport-3300-v2-20260928';
export const hostedPaymentUrl='https://www.paypal.com/ncp/payment/7DDC3PVGKV7KJ';
export function airportReady(){return Boolean(process.env.AIRPORT_ENABLED==='true' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.RESEND_API_KEY && process.env.AIRPORT_NOTIFY_FROM && process.env.AIRPORT_NOTIFY_TO);}
export async function notifyOffice(id:string,paid=false){
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`${id}-${paid?'paid':'review'}`},body:JSON.stringify({from:process.env.AIRPORT_NOTIFY_FROM,to:process.env.AIRPORT_NOTIFY_TO,subject:paid?'공항 긴급 사건 결제 확인 — USD 3,300':'공항 긴급 사건 — 결제 확인 요청 및 서류 접수',text:`접수번호: ${id}\n${paid?'결제 확인 완료':'고객이 결제를 알렸습니다. 실제 PayPal 수취를 확인하세요.'}\nhttps://koreavisalaw.com/admin/airport\n계약의 첫 연락 시한을 확인하세요. 고객의 결제 표시는 실제 수취 증명이 아닙니다.`})});
 if(!r.ok)throw new Error('Office notification failed');
}
export function automaticPayment(){return process.env.AIRPORT_PAYMENT_MODE==='api' && Boolean(process.env.PAYPAL_CLIENT_ID&&process.env.PAYPAL_CLIENT_SECRET);}
export function db(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});}
export async function identity(request:Request){
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(!token) throw new Error('Sign in required');
 const {data,error}=await db().auth.getUser(token);
 if(error||!data.user) throw new Error('Sign in required');
 return {id:data.user.id,token};
}
export async function admin(request:Request){
 const user=await identity(request);
 const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{global:{headers:{Authorization:`Bearer ${user.token}`}},auth:{persistSession:false}});
 const {data,error}=await client.rpc('is_visa_content_admin');
 if(error||data!==true) throw new Error('Administrator access required');
 return user;
}
export function contract(d:AirportDetails){
 const text=airportContracts[d.lang].replaceAll('[여행자 성명]',d.traveler).replaceAll('[traveler name]',d.traveler).replaceAll('[공항명]',d.airport).replaceAll('[airport]',d.airport).replaceAll('[일자]','사건별 기재사항 참조').replaceAll('[date]','see case particulars');
 // Exact supplied v2 terms retained. Case-specific details form a signed schedule.
 const header=d.lang==='ko'?'사건별 기재사항':'Case particulars';
 const fields=d.lang==='ko'?`여행자: ${d.traveler}\n서명자: ${d.signer}\n자격: ${d.role}\n공항: ${d.airport}\n연락처: ${d.contact}\n송환 예정: ${d.unknownReturn?'미정':d.returnAt}\n방문 목적: ${d.purpose}\n관계인: ${d.relatedParties}`:`Traveler: ${d.traveler}\nSigner: ${d.signer}\nCapacity: ${d.role}\nAirport: ${d.airport}\nContact: ${d.contact}\nReturn: ${d.unknownReturn?'Unknown':d.returnAt}\nVisit purpose: ${d.purpose}\nRelated parties: ${d.relatedParties}`;
 return `${header}\n${fields}\n\n${text}\n\n${d.lang==='ko'?'전자서명 성명':'Electronic signature name'}: ${d.signature}`;
}
export function hash(text:string){return createHash('sha256').update(text).digest('hex');}
export async function paypal(path:string,method='GET',body?:unknown,key?:string){
 const origin=process.env.PAYPAL_ENV==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';
 const auth=Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
 const tokenResult=await fetch(`${origin}/v1/oauth2/token`,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store'});
 if(!tokenResult.ok)throw new Error('Payment provider unavailable');
 const token=await tokenResult.json();
 const response=await fetch(origin+path,{method,headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json',...(key?{'PayPal-Request-Id':key}:{})},...(body?{body:JSON.stringify(body)}:{}),cache:'no-store'});
 if(!response.ok)throw new Error('Payment provider could not confirm this transaction');
 return response.json();
}

export function privacyNotice(lang:'ko'|'en'){return process.env[lang==='ko'?'AIRPORT_PRIVACY_KO':'AIRPORT_PRIVACY_EN']||airportPrivacy[lang];}
