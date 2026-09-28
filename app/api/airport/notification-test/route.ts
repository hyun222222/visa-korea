import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {admin,notifyOffice} from '@/lib/airport-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'Invalid origin'},{status:403,headers});
 try{await admin(req);}catch{return NextResponse.json({error:'Administrator access required'},{status:403,headers});}
 const reference=`TEST-${randomUUID()}`;
 try{
  const receipt=await notifyOffice(reference,false,{test:true});
  return NextResponse.json({accepted:true,reference,emailId:receipt.id,delivery:'Check delivery in Resend; API acceptance is not proof of inbox delivery.'},{headers});
 }catch{return NextResponse.json({error:'Office notification test failed'},{status:503,headers});}
}
