const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
let calls=[],fail=false;
const env={RESEND_API_KEY:'test-only',AIRPORT_NOTIFY_FROM:'Test Office <info@example.invalid>',AIRPORT_NOTIFY_TO:'office@example.invalid'};
function load(file,dependencies={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require(name){if(name in dependencies)return dependencies[name];if(name==='server-only')return {};if(name==='@supabase/supabase-js')return {createClient(){throw new Error('unexpected database access')}};if(name.startsWith('./airport-'))return {};return require(name)},process:{env},Buffer,URL,Request,Response,fetch:async(url,options)=>{calls.push({url,...options,body:JSON.parse(options.body)});return new Response(JSON.stringify(fail?{error:'secret upstream detail'}:{id:'test-email-id'}),{status:fail?500:200})}});return exports;}
const server=load('lib/airport-server.ts');
const route=load('app/api/airport/notification-test/route.ts',{'next/server':{NextResponse:{json:(body,options)=>new Response(JSON.stringify(body),{...options,headers:{...options.headers,'Content-Type':'application/json'}})}},'@/lib/airport-server':{notifyOffice:server.notifyOffice,admin:async req=>{if(req.headers.get('authorization')!=='Bearer office-admin')throw new Error('denied')}}});
async function request(token='office-admin',origin='https://site.invalid'){const r=await route.POST(new Request('https://site.invalid/api/airport/notification-test',{method:'POST',headers:{origin,authorization:`Bearer ${token}`},body:JSON.stringify({to:'attacker@example.invalid'})}));return {status:r.status,body:await r.json()};}
(async()=>{
 assert.equal((await request('customer')).status,403);assert.equal(calls.length,0);
 assert.equal((await request('office-admin','https://evil.invalid')).status,403);assert.equal(calls.length,0);
 const result=await request();assert.equal(result.status,200);assert.equal(result.body.emailId,'test-email-id');assert.equal(calls[0].body.to,env.AIRPORT_NOTIFY_TO);assert.match(calls[0].body.subject,/TEST/);assert.match(calls[0].body.text,/실제 의뢰·계약·결제가 없/);
 await server.notifyOffice('ordinary-case');assert.doesNotMatch(calls[1].body.subject,/TEST/);assert.match(calls[1].body.subject,/결제 확인 요청/);
 fail=true;const failed=await request();assert.equal(failed.status,503);assert.doesNotMatch(JSON.stringify(failed.body),/secret upstream/);
 console.log(JSON.stringify({provider:'ISOLATED DOUBLES; actual delivery requires Resend confirmation',checks:5,passed:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
