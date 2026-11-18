import {NextRequest,NextResponse} from 'next/server';
import {languageFromPath,visaPublic} from '@/lib/brand';
export function proxy(request:NextRequest){
 const pathname=request.nextUrl.pathname;
 const reviewHost=request.nextUrl.hostname==='review.koreavisalaw.com';
 const refundPolicy=pathname==='/refund-policy';
 const reviewPage=pathname==='/visa-review'||refundPolicy||(reviewHost&&pathname==='/');
 const lang=request.nextUrl.searchParams.get('lang');
 const headers=new Headers(request.headers);
 headers.delete('x-kimhyun-review');
 headers.set('x-kimhyun-locale',reviewPage?(lang==='ko'||lang==='en'||lang==='zh'?lang:refundPolicy?'ko':'en'):languageFromPath(pathname));
 if(reviewPage) headers.set('x-kimhyun-review','1');
 if(!visaPublic && (request.nextUrl.pathname.startsWith('/api/translate')||request.nextUrl.pathname.startsWith('/admin')||request.nextUrl.pathname==='/board')) return NextResponse.json({message:'This feature remains on the existing site during the design review.'},{status:503,headers:{'X-Robots-Tag':'noindex, nofollow'}});
 if(reviewHost&&pathname==='/'){
   const target=request.nextUrl.clone();
   target.pathname='/visa-review';
   const response=NextResponse.rewrite(target,{request:{headers}});
   response.headers.set('X-Robots-Tag','noindex, nofollow');
   response.headers.set('Referrer-Policy','no-referrer');
   return response;
 }
 if(reviewHost&&!pathname.startsWith('/api/visa-review')&&!reviewPage&&!pathname.startsWith('/fonts/')){
   return NextResponse.redirect(new URL(pathname+request.nextUrl.search,'https://koreavisalaw.com'));
 }
 const r=NextResponse.next({request:{headers}});
 const privatePath=/^\/(?:admin(?:\/|$)|api(?:\/|$)|(?:en|ko)\/entry-refusal\/apply(?:\/|$))/.test(request.nextUrl.pathname);
 if(!visaPublic||privatePath)r.headers.set('X-Robots-Tag','noindex, nofollow');
 if(reviewPage){
   r.headers.set('X-Robots-Tag','noindex, nofollow');
   r.headers.set('Referrer-Policy','no-referrer');
 }
 return r;
}
export const config={matcher:['/((?!_next|favicon.ico|.*\\.(?:png|jpg|webp|css|js|woff2)).*)']};
