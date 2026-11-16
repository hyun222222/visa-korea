import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:3058';
const paths=['/blog/deportation-order-objection','/en/blog/deportation-order-objection-en','/blog/f6-marriage-visa-refusal-reapplication','/en/blog/f6-marriage-visa-refusal-reapplication-en','/ko','/en','/zh','/ja','/blog','/ko/medical-visa','/en/medical-visa','/ko/medical-visa-remedy','/ko/attraction-registration','/ko/sns-medical-ad-compliance'];
const results=[];
for(const path of paths){
 const res=await fetch(base+path);assert.equal(res.status,200,path);const html=await res.text();
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1],h1=html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 const langs=[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(m=>m[1]);
 const call=(html.match(/href="tel:01055346843"/g)||[]).length,kakao=(html.match(/href="https:\/\/open.kakao.com\/o\/saviVYPi"/g)||[]).length;
 const item={path,status:res.status,title,h1,canonical,hreflang:langs,call,kakao};
 if(path.includes('/blog/')){
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
  const article=schemas.find(s=>s['@type']==='Article');assert.ok(article?.citation?.length,path);assert.equal(article.dateModified,'2026-11-16');
  assert.equal(canonical,'https://koreavisalaw.com'+path);assert.deepEqual(langs.sort(),['en','ko']);assert.ok(call&&kakao,path);
  item.citations=article.citation.length;item.articleLanguage=article.inLanguage;
 }
 if(['/ko','/en','/zh','/ja'].includes(path))assert.ok(call>=2&&kakao>=2,path);
 results.push(item);
}
const sitemap=await(await fetch(base+'/sitemap.xml')).text();for(const path of paths.slice(0,4))assert.ok(sitemap.includes('https://koreavisalaw.com'+path),path);
fs.mkdirSync('publication-backups',{recursive:true});fs.writeFileSync('publication-backups/html-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),base,results},null,2));
console.log(JSON.stringify({checked:results.length,newArticleSourcesAndHreflang:4,newArticleSitemapUrls:4,fourLanguageContactLinks:'pass'}));
