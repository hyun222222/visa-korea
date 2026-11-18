import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as content from '../lib/visa-review-content.ts';

const requireModule = createRequire(import.meta.url);
const {NextRequest, NextResponse} = requireModule('next/server');
const source = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;
const exports = {};
runInNewContext(output, {exports, Headers, URL, require: (name) => ({
  'next/server': {NextRequest, NextResponse},
  '@/lib/brand': {visaPublic: true, languageFromPath: () => 'ko'},
  '@/lib/visa-review-content': content,
})[name]});
const call = (path, host = 'review.koreavisalaw.com') => exports.proxy(new NextRequest('https://' + host + path));
const target = response => response.headers.get('x-middleware-rewrite');

test('the review host serves exactly the approved article paths and public discovery files', () => {
  for (const path of ['/ko', ...content.reviewContentSlugs.map(slug => '/ko/' + slug)]) {
    for (const suffix of ['', '/']) {
      const response = call(path + suffix + '?source=article');
      const file = content.reviewContentFile(path);
      assert.equal(new URL(target(response)).pathname, file);
      assert.equal(new URL(target(response)).search, '?source=article');
      assert.ok(existsSync(new URL('../public' + file, import.meta.url)));
      assert.equal(response.headers.get('x-robots-tag'), null);
    }
  }
  for (const path of ['/assets/kvl.css', '/robots.txt', '/sitemap.xml', '/llms.txt']) {
    assert.equal(new URL(target(call(path))).pathname, content.reviewContentFile(path));
  }
  assert.ok(exports.config.matcher.includes('/assets/kvl.css'));
});

test('unknown, lookalike and internal content paths cannot select arbitrary static files', () => {
  for (const path of ['/ko/no-such-topic', '/ko/f4-visa-extra', '/ko//f4-visa', '/ko/../secret',
    '/ko/%2e%2e/secret', '/ko/f4-visa/index.html', '/assets/kvl.css.map', '/assets/other.css']) {
    assert.equal(content.reviewContentFile(path), null);
    assert.equal(target(call(path)), null);
  }
  assert.equal(call('/visa-review-content/ko/f4-visa/index.html').status, 404);
  assert.equal(target(call('/api/visa-review-unrelated')), null);
  assert.equal(new URL(call('/api/visa-review-unrelated').headers.get('location')).hostname, 'koreavisalaw.com');
  assert.equal(target(call('/ko/f4-visa', 'review.koreavisalaw.com.example.invalid')), null);
});

test('root checkout and main-domain pages keep their existing routing', () => {
  assert.equal(new URL(target(call('/?lang=ko&plan=documents'))).pathname, '/visa-review');
  assert.equal(call('/').headers.get('x-robots-tag'), 'noindex, nofollow');
  for (const path of ['/ko', '/ko/f4-visa', '/assets/kvl.css', '/sitemap.xml', '/robots.txt', '/llms.txt']) {
    const response = call(path, 'koreavisalaw.com');
    assert.equal(target(response), null);
    assert.equal(response.headers.get('location'), null);
  }
  for (const language of ['ko', 'en']) {
    const response = call('/' + language + '/review/');
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), `https://review.koreavisalaw.com/?lang=${language}#diagnosis`);
  }
});

test('every published topic retains anonymous diagnosis and links completed results to the app', () => {
  for (const slug of content.reviewContentSlugs) {
    const html = readFileSync(new URL('../public/visa-review-content/ko/' + slug + '/index.html', import.meta.url), 'utf8');
    for (const step of ['stage', 'have', 'due']) assert.ok(html.includes(`name="dg-${step}"`));
    assert.doesNotMatch(html, /paypal\.com\/(?:ncp|checkoutnow)|<form\b|type=["']file["']/i);
    assert.ok(html.includes('https://review.koreavisalaw.com/ko/' + slug + '"'));
    for (const plan of ['question', 'documents', 'strategy']) {
      assert.ok(html.includes('plan=' + plan + '#apply'));
    }
  }
  const sitemap = readFileSync(new URL('../public/visa-review-content/sitemap.xml', import.meta.url), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 11);
  assert.doesNotMatch(sitemap, /\/\?lang|\/review\//);
});
