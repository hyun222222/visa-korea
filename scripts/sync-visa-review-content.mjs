import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reviewContentSlugs} from '../lib/visa-review-content.ts';

const sourceIndex = process.argv.indexOf('--source');
if (sourceIndex < 0 || !process.argv[sourceIndex + 1]) {
  throw new Error('Pass --source followed by the reviewed static site folder.');
}
const source = resolve(process.argv[sourceIndex + 1]);
const destination = fileURLToPath(new URL('../public/visa-review-content/', import.meta.url));
const origin = 'https://review.koreavisalaw.com';
const pages = ['ko/index.html', ...reviewContentSlugs.map((slug) => `ko/${slug}/index.html`)];
const allowedPaths = new Set(['/ko', ...reviewContentSlugs.map((slug) => '/ko/' + slug)]);
const outputs = [];

function publicUrls(html) {
  // Next.js normalizes public routes without a trailing slash. The article text stays intact.
  return html.replace(/https:\/\/review\.koreavisalaw\.com\/en\/(?=["'<\s)]|$)/g, origin + '/ko')
    .replace(/https:\/\/review\.koreavisalaw\.com(\/ko(?:\/[a-z0-9-]+)?)\//g, origin + '$1')
    .replace(/href="(\/ko(?:\/[a-z0-9-]+)?)\/"/g, 'href="$1"');
}

for (const file of pages) {
  const original = await readFile(resolve(source, file), 'utf8');
  const html = publicUrls(original);
  if (/paypal\.com\/(?:ncp|checkoutnow)/i.test(html) || /<form\b|type=["']file["']/i.test(html)) {
    throw new Error('The reviewed content must use the application consent flow: ' + file);
  }
  if (file !== 'ko/index.html' && ['stage', 'have', 'due'].some((key) => !html.includes(`name="dg-${key}"`))) {
    throw new Error('The anonymous three-step self-assessment is missing: ' + file);
  }
  for (const [, href] of html.matchAll(/href="(\/ko[^"?#]*)"/g)) {
    if (!allowedPaths.has(href)) throw new Error('Unknown article link in ' + file + ': ' + href);
  }
  const canonical = file === 'ko/index.html' ? '/ko' : '/ko/' + file.split('/')[1];
  if (!html.includes(`rel="canonical" href="${origin}${canonical}"`)) {
    throw new Error('The canonical URL does not match the reviewed route: ' + file);
  }
  outputs.push({file, content: html});
}

outputs.push({file: 'assets/kvl.css', content: await readFile(resolve(source, 'assets/kvl.css'), 'utf8')});
outputs.push({file: 'llms.txt', content: publicUrls(await readFile(resolve(source, 'llms.txt'), 'utf8'))});
outputs.push({file: 'sitemap.xml', content: [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...allowedPaths].sort().map((path) => `  <url><loc>${origin}${path}</loc></url>`),
  '</urlset>', '',
].join('\n')});
outputs.push({file: 'robots.txt', content: [
  'User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /admin',
  'Disallow: /visa-review', 'Sitemap: ' + origin + '/sitemap.xml', '',
].join('\n')});

// Validate the entire reviewed set before replacing any published source file.
for (const {file, content} of outputs) {
  const target = resolve(destination, file);
  await mkdir(dirname(target), {recursive: true});
  await writeFile(target, content, 'utf8');
}
const digest = createHash('sha256');
for (const {file, content} of outputs) digest.update(file).update('\0').update(content).update('\0');
console.log(`Prepared ${pages.length} public pages and ${outputs.length - pages.length} shared files. SHA-256 ${digest.digest('hex')}`);
