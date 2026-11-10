import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {applyLegalReview} from '../lib/blog-legal-review.ts';
import {correctD8Post} from '../lib/d8-search.ts';
const revisions=JSON.parse(fs.readFileSync(new URL('../lib/blog-legal-revisions.json',import.meta.url),'utf8'));

test('all 30 audited CMS snapshots receive the reviewed text, sources and date without changing addresses or publication history',()=>{
  assert.equal(revisions.length,30);
  const counts={ko:0,en:0,zh:0,ja:0};
  for(const r of revisions){
    const lang=r.slug.match(/-(en|zh|ja)$/)?.[1] ?? 'ko';counts[lang]++;
    const original={...structuredClone(r.before),slug:r.slug,publishedAt:'2026-06-04',author:'Kim & Hyun',category:'investor',readMinutes:5};
    const backup=structuredClone(original);
    const reviewed=correctD8Post(applyLegalReview(original));
    assert.equal(reviewed.title,r.after.title,r.slug);
    assert.deepEqual(reviewed.body,r.after.body,r.slug);
    assert.equal(reviewed.slug,original.slug);
    assert.equal(reviewed.publishedAt,original.publishedAt);
    assert.equal(reviewed.modifiedAt,'2026-11-10');
    assert.ok(reviewed.sources.length);
    assert.deepEqual(original,backup);
    assert.deepEqual(applyLegalReview(reviewed),reviewed);
    assert.ok(!/2024(?:구단|gudan)12447|2023(?:구단|gudan)10742/i.test(JSON.stringify(reviewed)));
  }
  assert.deepEqual(counts,{ko:11,en:7,zh:6,ja:6});
});
test('later CMS editorial changes are preserved rather than overwritten by the audited snapshot',()=>{
  for(const r of revisions){
    const future={...r.before,slug:r.slug,title:'A later editorial decision',body:[{type:'p',text:'New verified evidence'}]};
    assert.equal(applyLegalReview(future),future);
  }
  const unknown={slug:'new-article',title:'New',excerpt:'New',body:[]};
  assert.equal(applyLegalReview(unknown),unknown);
});
test('JSONB field order does not prevent corrections from reaching production',()=>{
  for(const r of revisions){
    const before={...r.before,slug:r.slug,body:r.before.body.map(b=>Object.fromEntries(Object.entries(b).reverse()))};
    assert.deepEqual(applyLegalReview(before).body,r.after.body);
  }
});
