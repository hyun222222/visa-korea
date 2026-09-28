// Authorization and cleanup regression tests with isolated provider doubles.
// Run the administrator's diagnostic button separately to verify real services.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const env={NEXT_PUBLIC_SUPABASE_URL:'https://storage.invalid',NEXT_PUBLIC_SUPABASE_ANON_KEY:'anon-test',SUPABASE_SERVICE_ROLE_KEY:'service-test',AIRPORT_ENABLED:'false'};
let createdKeys=[],files=new Map(),failUpload=false,corruptDownload=false,failCleanup=false,privateBucket=true,publicStatus=400,databaseFail=false;
const bucket={async upload(p,b){files.set(p,b);return {error:failUpload?{message:'provider secret error'}:null}},async download(p){return files.has(p)?{data:new Blob([corruptDownload?'wrong':files.get(p)]),error:null}:{data:null,error:{message:'not found'}}},async list(prefix,{search}){return {data:[...files.keys()].filter(p=>p===`${prefix}/${search}`).map(p=>({name:p.split('/').pop()})),error:null}},async remove(paths){if(failCleanup)return {error:{message:'failed'}};paths.forEach(p=>files.delete(p));return {error:null}}};
function createClient(_url,key,options){
 createdKeys.push(key);
 if(key==='anon-test')return {auth:{async getUser(token){return {data:{user:['admin','client'].includes(token)?{id:token}:null},error:null}}},async rpc(name){assert.equal(name,'is_visa_content_admin');return {data:options.global.headers.Authorization==='Bearer admin',error:null}}};
 return {
  from(name){assert.equal(name,'airport_desk');const query={select(cols){assert.equal(cols,'id');return query},eq(col,value){assert.equal(col,'id');assert.equal(value,true);return query},async single(){return {data:{id:true},error:databaseFail?{}:null}}};return query},
  storage:{from(name){assert.equal(name,'airport-private');return bucket},async getBucket(){return {data:{public:!privateBucket},error:null}}}
 };
}
const output={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../app/api/airport/diagnostics/route.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:output,require(name){if(name==='next/server')return {NextResponse:{json:(body,options)=>new Response(JSON.stringify(body),{...options,headers:{...options.headers,'Content-Type':'application/json'}})}};if(name==='@supabase/supabase-js')return {createClient};return require(name)},process:{env},Buffer,URL,Request,Response,AbortSignal,fetch:async(_url,options)=>{assert.equal(options.headers,undefined);return new Response('',{status:publicStatus})}});
const checks=[];async function check(name,fn){createdKeys=[];files=new Map();failUpload=corruptDownload=failCleanup=databaseFail=false;privateBucket=true;publicStatus=400;await fn();checks.push(name)}
async function call(method,token,origin='https://site.invalid'){const response=await output[method](new Request('https://site.invalid/api/airport/diagnostics',{method,headers:{Origin:origin,...(token?{Authorization:`Bearer ${token}`}:{})}}));return {status:response.status,body:await response.json()}}
(async()=>{
 await check('GET authenticates with anon key while intake is disabled',async()=>{const r=await call('GET','admin');assert.equal(r.status,200);assert.equal(r.body.admin,true);assert.deepEqual(createdKeys,['anon-test'])});
 await check('GET customer does not gain administrator status',async()=>{const r=await call('GET','client');assert.equal(r.status,200);assert.equal(r.body.authenticated,true);assert.equal(r.body.admin,false)});
 await check('GET invalid token rejected',async()=>assert.equal((await call('GET','invalid')).status,401));
 await check('POST missing authentication never constructs service client',async()=>{assert.equal((await call('POST')).status,401);assert.equal(createdKeys.includes('service-test'),false)});
 await check('POST customer denied before service key use',async()=>{assert.equal((await call('POST','client')).status,403);assert.equal(createdKeys.includes('service-test'),false);assert.equal(files.size,0)});
 await check('POST cross origin denied before authentication',async()=>{assert.equal((await call('POST','admin','https://evil.invalid')).status,403);assert.equal(createdKeys.length,0)});
 await check('POST admin succeeds with disabled intake and removes all test files',async()=>{const r=await call('POST','admin');assert.equal(r.status,200);assert.equal(r.body.ok,true);assert.ok(Object.values(r.body.stages).every(Boolean));assert.equal(files.size,0)});
 await check('wrong service key gives safe error and no upload',async()=>{databaseFail=true;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.error,'Server database connection failed');assert.equal(files.size,0)});
 await check('public bucket is rejected before upload',async()=>{privateBucket=false;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.stages.privateBucket,false);assert.equal(files.size,0)});
 await check('uncertain failed upload still attempts cleanup',async()=>{failUpload=true;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.stages.cleanup,true);assert.equal(files.size,0);assert.doesNotMatch(JSON.stringify(r.body),/provider secret/)});
 await check('download mismatch still cleans up',async()=>{corruptDownload=true;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.stages.download,false);assert.equal(r.body.stages.cleanup,true);assert.equal(files.size,0)});
 await check('public read success is a verification failure and cleans up',async()=>{publicStatus=200;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.stages.publicReadBlocked,false);assert.equal(files.size,0)});
 await check('provider outage does not count as public access denial',async()=>{publicStatus=500;const r=await call('POST','admin');assert.equal(r.body.stages.publicReadBlocked,false);assert.equal(files.size,0)});
 await check('cleanup failure explicitly fails diagnostic',async()=>{failCleanup=true;const r=await call('POST','admin');assert.equal(r.status,503);assert.equal(r.body.ok,false);assert.equal(r.body.stages.cleanup,false);assert.match(r.body.error,/cleanup must be checked/);assert.equal(files.size,1)});
 console.log(JSON.stringify({provider:'ISOLATED DOUBLES; live diagnostic requires authenticated office UI',passed:checks.length,checks},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
