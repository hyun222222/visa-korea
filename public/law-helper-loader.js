/* Kim & Hyun Law Helper launcher. No page text or contact data is collected. */
(() => {
  'use strict';
  if(document.getElementById('knh-law-helper-launcher'))return;
  const fields={'sangsok82.com':'inheritance','realaw.kr':'real-estate','adkorealaw.com':'administrative','koreavisalaw.com':'immigration'};
  const site=location.hostname.replace(/^www\./,'');
  if(!Object.hasOwn(fields,site))return;
  const HUB='https://kimnhyun.com';
  const excluded=()=>/^\/(?:(?:ko|en|zh|ja)\/)?(?:admin|api|auth|login|signin|signout|signin-with-chatgpt|signout-with-chatgpt|callback|dashboard|account)(?:\/|$)/i.test(location.pathname);
  const language=()=>/^\/(?:en|zh|ja)(?:\/|$)/i.test(location.pathname)||/^(?:en|zh|ja)/i.test(document.documentElement.lang)?'en':'ko';
  const medicalRoute=()=>site==='koreavisalaw.com'&&/^\/(?:(?:ko|en|zh|ja)\/)?medical-visa(?:\/|$)/i.test(location.pathname);
  const host=document.createElement('div');host.id='knh-law-helper-launcher';
  const shadow=host.attachShadow({mode:'closed'});
  const style=document.createElement('style');
  style.textContent=`:host{all:initial;font-family:Pretendard,'Malgun Gothic',Arial,sans-serif;color:#00074e}:host([hidden]){display:none!important}*{box-sizing:border-box}[hidden]{display:none!important}.launcher{position:fixed;right:20px;bottom:94px;z-index:2147483000;display:flex;align-items:center;gap:9px;min-height:48px;padding:11px 16px;background:#00074e;color:#fff;border:1px solid #b99b32;border-radius:28px;font:600 15px/1.5 Pretendard,'Malgun Gothic',Arial,sans-serif;box-shadow:0 4px 20px #00074e24;cursor:pointer}.launcher:focus-visible,.close:focus-visible,.open-tab:focus-visible{outline:3px solid #8b9fe0;outline-offset:4px}.mark{color:#f0dc8e;font-weight:700}.panel{position:fixed;right:20px;bottom:154px;z-index:2147483001;width:min(440px,calc(100vw - 32px));height:min(720px,calc(100dvh - 180px));background:#fff;border:1px solid #bcc7e1;border-radius:14px;box-shadow:0 10px 45px #00074e30;overflow:hidden;display:flex;flex-direction:column}.toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;flex:0 0 auto;padding:7px 12px;background:#f2f5fc;border-bottom:1px solid #dbe1ee}.open-tab{color:#00074e;text-decoration:underline;font-size:12px;line-height:1.5;padding:6px 0}.close{color:#00074e;border:1px solid #c1cbe1;border-radius:5px;background:#fff;min-height:36px;min-width:36px;font-size:23px;line-height:1;cursor:pointer}.frame{border:0;display:block;width:100%;height:100%;flex:1;min-height:0;background:#fff}.loading{padding:15px;font-size:14px;line-height:1.6;color:#455477}.frame-wrap{position:relative;display:flex;flex:1;min-height:0}.loading{position:absolute;inset:0;background:#fff;z-index:1}.launcher[aria-expanded=true]{background:#28356b}@media(max-width:760px){.launcher{right:12px;bottom:calc(80px + env(safe-area-inset-bottom));padding:10px 14px;font-size:14px}.panel{right:8px;left:8px;width:auto;bottom:calc(140px + env(safe-area-inset-bottom));height:min(660px,calc(100dvh - 156px - env(safe-area-inset-bottom)));border-radius:10px}.toolbar{padding:6px 10px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}`;
  // Medical-visa pages retain a separate 104px messenger stack, 24px from the bottom.
  style.textContent+=':host([data-medical]) .launcher{bottom:calc(144px + env(safe-area-inset-bottom))}:host([data-medical]) .panel{bottom:calc(204px + env(safe-area-inset-bottom))}';
  const launcher=document.createElement('button');launcher.type='button';launcher.className='launcher';launcher.setAttribute('aria-expanded','false');launcher.setAttribute('aria-controls','knh-law-helper-panel');
  const mark=document.createElement('span');mark.className='mark';mark.setAttribute('aria-hidden','true');mark.textContent='법';
  const caption=document.createElement('span');launcher.append(mark,caption);
  const panel=document.createElement('section');panel.className='panel';panel.id='knh-law-helper-panel';panel.hidden=true;panel.setAttribute('role','region');
  const toolbar=document.createElement('div');toolbar.className='toolbar';
  const newTab=document.createElement('a');newTab.className='open-tab';newTab.target='_blank';newTab.rel='noopener noreferrer';
  const closeButton=document.createElement('button');closeButton.className='close';closeButton.type='button';closeButton.textContent='×';
  toolbar.append(newTab,closeButton);
  const frameWrap=document.createElement('div');frameWrap.className='frame-wrap';
  const loading=document.createElement('p');loading.className='loading';loading.setAttribute('role','status');frameWrap.append(loading);
  panel.append(toolbar,frameWrap);shadow.append(style,panel,launcher);
  let frame=null,opened=false,previousFocus=null,loaded=false;
  function frameUrl(){const url=new URL('/law-helper/',HUB);url.searchParams.set('site',site);url.searchParams.set('field',fields[site]);url.searchParams.set('lang',language());return url.href;}
  function labels(){const en=language()==='en';caption.textContent=en?'Prepare a consultation':'법도우미 · 상담 준비';launcher.setAttribute('aria-label',en?'Open Law Helper':'법도우미 열기');panel.setAttribute('aria-label',en?'Law Helper consultation preparation':'법도우미 상담 준비');closeButton.setAttribute('aria-label',en?'Close Law Helper':'법도우미 닫기');newTab.textContent=en?'Open separately':'별도 창에서 열기';newTab.href=frameUrl();loading.textContent=en?'Loading consultation preparation. If it does not open, use “Open separately”.':'상담 준비 화면을 불러오고 있습니다. 열리지 않으면 ‘별도 창에서 열기’를 이용해 주세요.';if(frame)frame.title=en?'Law Helper consultation preparation':'법도우미 상담 준비';}
  function resize(){if(!opened)return;const viewport=window.visualViewport;const top=viewport?viewport.offsetTop:0;const height=viewport?viewport.height:window.innerHeight;const mobile=window.matchMedia('(max-width:760px)').matches;const medical=medicalRoute();let gap=medical?204:mobile?140:154;if(medical){const offset=parseFloat(window.getComputedStyle(launcher).bottom);if(Number.isFinite(offset))gap+=Math.max(0,offset-144);}panel.style.maxHeight=Math.max(180,height-gap-16)+'px';panel.style.bottom=Math.max(gap,window.innerHeight-(top+height)+12)+'px';}
  function open(){if(excluded())return;labels();previousFocus=document.activeElement===host?launcher:document.activeElement;opened=true;panel.hidden=false;launcher.setAttribute('aria-expanded','true');if(!frame){frame=document.createElement('iframe');frame.className='frame';frame.title=language()==='en'?'Law Helper consultation preparation':'법도우미 상담 준비';frame.referrerPolicy='strict-origin';frame.setAttribute('allow','clipboard-write');frame.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox');frame.src=frameUrl();frame.addEventListener('load',()=>{loaded=true;loading.hidden=true;});frameWrap.append(frame);}else loading.hidden=loaded;resize();closeButton.focus();}
  function close(){opened=false;panel.hidden=true;launcher.setAttribute('aria-expanded','false');if(previousFocus&&typeof previousFocus.focus==='function'&&previousFocus.isConnected)previousFocus.focus();else launcher.focus();}
  launcher.addEventListener('click',()=>opened?close():open());closeButton.addEventListener('click',close);
  shadow.addEventListener('keydown',(event)=>{if(event.key==='Escape'){event.preventDefault();close();}});
  window.addEventListener('message',(event)=>{if(!frame||event.origin!==HUB||event.source!==frame.contentWindow)return;if(event.data&&event.data.type==='knh-law-helper-close')close();});
  window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('scroll',resize,{passive:true});
  // SPA navigation may enter an admin route without reloading the root script.
  let lastPath='';function syncRoute(){if(lastPath===location.pathname)return;lastPath=location.pathname;labels();host.toggleAttribute('data-medical',medicalRoute());const hidden=excluded();host.hidden=hidden;if(hidden&&opened)close();panel.style.removeProperty('bottom');panel.style.removeProperty('max-height');resize();}
  window.addEventListener('popstate',syncRoute);window.addEventListener('hashchange',syncRoute);
  const observer=new MutationObserver(syncRoute);observer.observe(document.documentElement,{childList:true,subtree:true});
  document.body.append(host);labels();syncRoute();
})();
