import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createClient} from '@supabase/supabase-js';

// No implicit write: default --plan reads only these four slugs and saves a backup.
// Never print keys, bearer tokens, source environment files or full DB rows.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articles = JSON.parse(fs.readFileSync(path.join(root, 'lib/search-articles-20261116.json'), 'utf8'));
const allowed = new Set(['deportation-order-objection', 'deportation-order-objection-en', 'f6-marriage-visa-refusal-reapplication', 'f6-marriage-visa-refusal-reapplication-en']);
if (articles.length !== 4 || articles.some(p => !allowed.has(p.slug))) throw Error('Unexpected publication scope');
const mode = process.argv[2] || '--plan';
if (!['--plan','--publish','--rollback'].includes(mode)) throw Error('Use --plan, --publish BACKUP, or --rollback BACKUP');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
if (!url || new URL(url).hostname !== 'amqnssakcqsdeeunrtfz.supabase.co') throw Error('Expected visa production Supabase project');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!key) throw Error('Supply an existing Supabase key through the process environment');
const accessToken = process.env.VISA_CONTENT_ACCESS_TOKEN;
const db = createClient(url, key, {auth:{persistSession:false,autoRefreshToken:false}, ...(accessToken ? {global:{headers:{Authorization:`Bearer ${accessToken}`}}} : {})});
const selected = 'id,slug,title,title_en,excerpt,category,keywords,published_at,read_minutes,author,body,created_at,updated_at';
const rows = articles.map(p => ({slug:p.slug,title:p.title,title_en:null,excerpt:p.excerpt,category:p.category,keywords:p.keywords,published_at:`${p.publishedAt}T00:00:00+09:00`,read_minutes:p.readMinutes,author:p.author,body:p.body}));
function stable(value) { return Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])) : value; }
function same(a,b) { return JSON.stringify(stable({title:a.title,title_en:a.title_en||null,excerpt:a.excerpt,category:a.category,keywords:a.keywords,read_minutes:a.read_minutes,author:a.author,body:a.body})) === JSON.stringify(stable({title:b.title,title_en:b.title_en||null,excerpt:b.excerpt,category:b.category,keywords:b.keywords,read_minutes:b.read_minutes,author:b.author,body:b.body})); }
const hash = crypto.createHash('sha256').update(JSON.stringify(stable(rows))).digest('hex');
async function readRows() {const {data,error}=await db.from('blog_posts').select(selected).in('slug',[...allowed]);if(error)throw Error(`Read failed (${error.code || 'unknown'}); no table or policy changes attempted`);return data;}
const current = await readRows();
for (const row of current) if(!same(row,rows.find(p=>p.slug===row.slug))) throw Error(`Existing editorial content differs at ${row.slug}; refusing to overwrite it`);
if (mode === '--plan') {
  const folder=path.join(root,'publication-backups');fs.mkdirSync(folder,{recursive:true});
  const backup=path.join(folder,`visa-search-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(backup,JSON.stringify({project:new URL(url).hostname,createdAt:new Date().toISOString(),hash,slugs:[...allowed],before:current,missing:rows.filter(p=>!current.some(r=>r.slug===p.slug)).map(p=>p.slug)},null,2));
  console.log(JSON.stringify({mode:'plan',existingMatching:current.length,missing:4-current.length,backup}));
} else {
  if(!process.argv[3])throw Error('Use the backup file returned by --plan');
  const backupPath=path.resolve(process.argv[3]);const backup=JSON.parse(fs.readFileSync(backupPath,'utf8'));
  if(backup.project!==new URL(url).hostname||backup.hash!==hash||JSON.stringify(backup.slugs)!==JSON.stringify([...allowed]))throw Error('Backup does not match this project and publication');
  if(!process.env.SUPABASE_SERVICE_ROLE_KEY&&!accessToken)throw Error('Writing requires an existing authorized admin token or service-role environment value');
  if(mode==='--publish') {
    const missing=rows.filter(p=>!current.some(r=>r.slug===p.slug));
    let inserted=[];
    // Atomic insert-if-absent, never an update of an existing slug. Preserves RLS.
    if(missing.length){const {data,error}=await db.from('blog_posts').upsert(missing,{onConflict:'slug',ignoreDuplicates:true}).select('id,slug,updated_at');if(error)throw Error(`Publish failed (${error.code||'unknown'})`);inserted=data;}
    // Persist created-row identities immediately, before read-back. Never include
    // rows inserted concurrently by someone else or rows merely present in a plan.
    const receiptPath=backupPath+'.receipt.json';
    const priorReceipt=fs.existsSync(receiptPath)?JSON.parse(fs.readFileSync(receiptPath,'utf8')):null;
    if(priorReceipt&&priorReceipt.hash!==hash)throw Error('Existing receipt does not match');
    const created=[...(priorReceipt?.created||[]),...inserted.filter(row=>!(priorReceipt?.created||[]).some(old=>old.id===row.id))];
    fs.writeFileSync(receiptPath,JSON.stringify({publishedAt:new Date().toISOString(),hash,created},null,2));
    const after=await readRows();if(after.length!==4||after.some(r=>!same(r,rows.find(p=>p.slug===r.slug))))throw Error('Post-write verification differs; inspect the four target slugs');
    console.log(JSON.stringify({mode:'published',verified:after.length,inserted:inserted.length}));
  } else {
    const receipt=JSON.parse(fs.readFileSync(backupPath+'.receipt.json','utf8'));if(receipt.hash!==hash)throw Error('Receipt mismatch');
    let deleted=0;
    for(const record of receipt.created){const row=current.find(r=>r.slug===record.slug);if(!row)continue;if(row.id!==record.id||row.updated_at!==record.updated_at)throw Error(`Later CMS edit at ${record.slug}; rollback stopped`);const {data,error}=await db.from('blog_posts').delete().eq('id',record.id).eq('slug',record.slug).eq('updated_at',record.updated_at).select('slug');if(error)throw Error(`Rollback failed (${error.code||'unknown'})`);deleted+=data.length;}
    console.log(JSON.stringify({mode:'rolled-back',deleted,existingBeforePublicationPreserved:backup.before.length}));
  }
}
