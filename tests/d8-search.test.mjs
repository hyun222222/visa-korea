import assert from 'node:assert/strict';
import test from 'node:test';
import {correctD8Post, d8Slug, d8Path, d8Copy, isD8Review} from '../lib/d8-search.ts';

const oldLines = {
  ko: '**외국인이 직접 설립한 법인에 대한 투자**의 진정성 의심.',
  en: 'Investment in a Corporation Established Directly by a Foreigner.',
  zh: '对外国人直接设立的法人进行投资的真实性存疑。',
  ja: '外国人が直接設立した法人に対する投資の真実性疑義。',
};

test('corrects the known corporation error in every published translation without mutating the source', () => {
  for (const [lang, old] of Object.entries(oldLines)) {
    const original = {slug:d8Slug(lang), title:'Preserved title', publishedAt:'2026-06-04', body:[{type:'list',items:['Unchanged',old]}]};
    const corrected = correctD8Post(original);
    assert.notEqual(corrected.body[0].items[1],old);
    assert.equal(original.body[0].items[1],old);
    assert.equal(corrected.body[0].items[0],'Unchanged');
    assert.equal(corrected.title,original.title);
    assert.equal(corrected.publishedAt,original.publishedAt);
    assert.deepEqual(correctD8Post(corrected),corrected);
  }
});

test('does not override future CMS copy or unrelated articles', () => {
  const post = {slug:d8Slug('en'), body:[{type:'p',text:'A future editor has replaced this paragraph.'}]};
  assert.deepEqual(correctD8Post(post),post);
  const unrelated = {...post, slug:'another-article'};
  assert.equal(correctD8Post(unrelated),unrelated);
  assert.equal(isD8Review(d8Slug('en')+'-draft'),false);
});

test('four languages point at their existing canonical articles', () => {
  assert.equal(d8Path('ko'),'/blog/d8-visa-rejection-reasons');
  for(const lang of ['en','zh','ja']) assert.equal(d8Path(lang),`/${lang}/blog/d8-visa-rejection-reasons-${lang}`);
  for(const lang of ['ko','en','zh','ja']) assert.equal(d8Copy[lang].documents.length,4);
});
