import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {applySearchContentReview,searchArticles} from '../lib/search-content-review.ts';
import {applyLegalReview} from '../lib/blog-legal-review.ts';
import {blogPublicationDate} from '../lib/blog-publication-date.ts';
const revisions=JSON.parse(fs.readFileSync(new URL('../lib/blog-legal-revisions.json',import.meta.url),'utf8'));

test('CMS timestamp keeps the Korean publication day without rewriting stored history',()=>{
  assert.equal(blogPublicationDate('2026-11-15T15:00:00+00:00'),'2026-11-16');
  assert.equal(blogPublicationDate('2026-11-16T00:00:00+09:00'),'2026-11-16');
  assert.equal(blogPublicationDate('2026-11-16'),'2026-11-16');
  assert.equal(blogPublicationDate('2026-06-04T03:00:00+00:00'),'2026-06-04');
});

test('new translations share canonical slug bases and official sources',()=>{
  assert.equal(searchArticles.length,4);
  for(const base of ['deportation-order-objection','f6-marriage-visa-refusal-reapplication']){
    const ko=searchArticles.find(p=>p.slug===base),en=searchArticles.find(p=>p.slug===`${base}-en`);
    assert.ok(ko&&en);assert.deepEqual(ko.sources,en.sources);
    assert.ok(ko.sources.every(s=>/^https:\/\/(www\.)?law.go.kr\/|^https:\/\/overseas.mofa.go.kr\//.test(s.url)));
  }
});
test('review sources attach only to matched CMS content, preserving later administrator edits',()=>{
  for(const p of searchArticles){
    const db={...p,sources:undefined,modifiedAt:undefined};
    const reviewed=applySearchContentReview(db);assert.ok(reviewed.sources.length);assert.equal(reviewed.modifiedAt,'2026-11-16');
    assert.equal(reviewed.publishedAt,p.publishedAt);
    const changed={...db,title:'Later editorial change'};assert.equal(applySearchContentReview(changed),changed);
    const reordered={...db,body:db.body.map(b=>Object.fromEntries(Object.entries(b).reverse()))};assert.ok(applySearchContentReview(reordered).sources.length);
  }
});
test('D8 search-title update retains the judicial correction and never restores old text',()=>{
  const r=revisions.find(r=>r.slug==='d8-visa-guide-en');
  const corrected=applyLegalReview({...r.before,slug:r.slug,publishedAt:'2026-06-04'});
  const result=applySearchContentReview(corrected);
  assert.equal(result.title,'Korea D-8 Visa Requirements: Investment Structure & Evidence');
  assert.deepEqual(result.body,r.after.body);assert.deepEqual(result.sources,r.after.sources);
  assert.match(JSON.stringify(result.body),/2024nu52900/);assert.match(JSON.stringify(result.body),/in that case/);
  assert.deepEqual(applySearchContentReview(result),result);
});
test('new legal articles do not repeat the overbroad deadlines or universal F6 rule',()=>{
  const dep=searchArticles.find(p=>p.slug==='deportation-order-objection');const en=searchArticles.find(p=>p.slug==='deportation-order-objection-en');
  assert.match(JSON.stringify(dep.body),/180일/);assert.match(JSON.stringify(dep.body),/1년/);assert.match(JSON.stringify(dep.body),/20개월/);
  assert.match(JSON.stringify(en.body),/one year/);assert.doesNotMatch(JSON.stringify(en.body),/Each deadline runs separately/);
  const f6=searchArticles.find(p=>p.slug==='f6-marriage-visa-refusal-reapplication');
  assert.match(f6.title,/재외공관/);assert.match(JSON.stringify(f6.body),/12개 호/);assert.match(JSON.stringify(f6.body),/그대로 적용해서는 안 됩니다/);
});
