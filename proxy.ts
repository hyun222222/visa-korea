import {NextRequest,NextResponse} from 'next/server';
import {languageFromPath,visaPublic} from '@/lib/brand';
import {isReviewMarket, reviewMarkets, visaReviewHost} from '@/lib/visa-review-locales';
import {isKoreanReviewTopic, koreanReviewTopicUrl, koreanGuideHubPath, koreanGuideHubUrl} from '@/lib/visa-review-ko-topics';
export function proxy(request:NextRequest){
 const pathname=request.nextUrl.pathname;
 const reviewHost=request.nextUrl.hostname===visaReviewHost;
 const market=pathname.match(/^\/visa-review\/([^/]+)$/)?.[1];
 const storefront=isReviewMarket(market)?reviewMarkets[market]:null;
 const topic=pathname.match(/^\/ko\/([^/]+)$/)?.[1];
 const koreanTopic=isKoreanReviewTopic(topic);
 const koreanHub=pathname===koreanGuideHubPath;
 const reviewDiscovery=reviewHost&&['/robots.txt','/sitemap.xml','/llms.txt'].includes(pathname);
 const refundPolicy=pathname==='/refund-policy';
 const reviewPage=pathname==='/visa-review'||refundPolicy||(reviewHost&&pathname==='/');
 const lang=request.nextUrl.searchParams.get('lang');
 const headers=new Headers(request.headers);
 headers.delete('x-kimhyun-review');
 headers.delete('x-kimhyun-review-host');
 if(reviewHost) headers.set('x-kimhyun-review-host','1');
 headers.set('x-kimhyun-locale',storefront?.tag??(reviewPage?(lang==='ko'||lang==='en'||lang==='zh'?lang:refundPolicy?'ko':'en'):languageFromPath(pathname)));
 if(reviewPage||storefront||koreanTopic||koreanHub) headers.set('x-kimhyun-review','1');
 if(!visaPublic && (request.nextUrl.pathname.startsWith('/api/translate')||request.nextUrl.pathname.startsWith('/admin')||request.nextUrl.pathname==='/board')) return NextResponse.json({message:'This feature remains on the existing site during the design review.'},{status:503,headers:{'X-Robots-Tag':'noindex, nofollow'}});
 if(reviewHost&&pathname==='/'){
   const target=request.nextUrl.clone();
   target.pathname='/visa-review';
   const response=NextResponse.rewrite(target,{request:{headers}});
   response.headers.set('X-Robots-Tag','noindex, nofollow');
   response.headers.set('Referrer-Policy','no-referrer');
   return response;
 }
 if((koreanTopic||koreanHub)&&!reviewHost&&(request.nextUrl.hostname==='koreavisalaw.com'||request.nextUrl.hostname==='www.koreavisalaw.com')){
   const canonical = new URL(koreanTopic ? koreanReviewTopicUrl(topic) : koreanGuideHubUrl);
   canonical.search = request.nextUrl.search;
   return NextResponse.redirect(canonical,308);
 }
 if(pathname==='/visa-review/topics'||pathname.startsWith('/visa-review/topics/')){
   return new NextResponse(null,{status:404,headers:{'X-Robots-Tag':'noindex, nofollow'}});
 }
 if(reviewHost&&!pathname.startsWith('/api/visa-review')&&!reviewPage&&!storefront&&!koreanTopic&&!koreanHub&&!reviewDiscovery&&!pathname.startsWith('/fonts/')){
   return NextResponse.redirect(new URL(pathname+request.nextUrl.search,'https://koreavisalaw.com'));
 }
 const r=NextResponse.next({request:{headers}});
 const privatePath=/^\/(?:admin(?:\/|$)|api(?:\/|$)|(?:en|ko)\/entry-refusal\/apply(?:\/|$))/.test(request.nextUrl.pathname);
 if(!visaPublic||privatePath||((storefront||koreanTopic||koreanHub)&&!reviewHost))r.headers.set('X-Robots-Tag','noindex, nofollow');
 if(pathname==='/board') r.headers.set('X-Robots-Tag','noindex, follow');
 if(reviewPage){
   r.headers.set('X-Robots-Tag','noindex, nofollow');
   r.headers.set('Referrer-Policy','no-referrer');
 }
 return r;
}
export const config={matcher:['/((?!_next|favicon.ico|.*\\.(?:png|jpg|webp|css|js|woff2)).*)']};
