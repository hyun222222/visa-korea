import {NextRequest,NextResponse} from 'next/server';
import {languageFromPath,visaPublic} from '@/lib/brand';
export function proxy(request:NextRequest){
 const headers=new Headers(request.headers);headers.set('x-kimhyun-locale',languageFromPath(request.nextUrl.pathname));
 if(!visaPublic && (request.nextUrl.pathname.startsWith('/api/translate')||request.nextUrl.pathname.startsWith('/admin')||request.nextUrl.pathname==='/board')) return NextResponse.json({message:'This feature remains on the existing site during the design review.'},{status:503,headers:{'X-Robots-Tag':'noindex, nofollow'}});
 const r=NextResponse.next({request:{headers}});if(!visaPublic)r.headers.set('X-Robots-Tag','noindex, nofollow');return r;
}
export const config={matcher:['/((?!_next|favicon.ico|.*\\.(?:png|jpg|webp|css|js|woff2)).*)']};
