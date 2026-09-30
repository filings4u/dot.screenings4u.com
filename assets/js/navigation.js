(function(){
  'use strict';
  const CONFIG_API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';
  const CACHE_KEY='s4u_dot_url_config_v2';
  const CACHE_MS=60*60*1000;

  function readCache(){try{const x=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');return x&&Date.now()-x.at<CACHE_MS?x.urls:null}catch{return null}}
  function writeCache(urls){try{localStorage.setItem(CACHE_KEY,JSON.stringify({at:Date.now(),urls}))}catch{}}
  function loadUrlConfiguration(){
    if(window.S4UUrlConfigPromise)return window.S4UUrlConfigPromise;
    window.S4UUrlConfigPromise=fetch(CONFIG_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'url_configuration'})})
      .then(async r=>{const d=await r.json();if(!r.ok||d.error||!d.urls)throw new Error(d.error||'URL configuration unavailable.');window.S4UUrlConfig=d.urls;writeCache(d.urls);return d.urls})
      .catch(err=>{console.warn('screenings4u DOT URL configuration could not be refreshed.',err);return readCache()});
    return window.S4UUrlConfigPromise;
  }
  function safeHttpUrl(raw,fallback){if(!raw)return fallback;try{const u=new URL(String(raw),location.href),host=u.hostname.toLowerCase(),allowed=host==='screenings4u.com'||host.endsWith('.screenings4u.com')||host==='www.roselandcompanies.com'||host==='roselandcompanies.com'||host==='127.0.0.1'||host==='localhost';return (u.protocol==='https:'||u.protocol==='http:')&&allowed?u.href:fallback}catch{return fallback}}
  function normalizedPath(href){try{const u=new URL(href,location.href);return u.pathname==='/'?'/':u.pathname}catch{return''}}
  function managedVisible(href){
    const list=window.S4UManagedPageManifest;if(!Array.isArray(list))return true;
    const path=normalizedPath(href),row=list.find(x=>x.route===path||(path==='/'&&x.route==='/index.html'));
    if(!row)return true;const cfg=row.published_config||{};return cfg.nav_visible!==false&&!['disabled','inactive'].includes(String(cfg.status||'active').toLowerCase());
  }

  function render(urls){
    const header=document.querySelector('[data-site-header]');if(!header)return;
    const marketing=urls?.marketing_pages||{},current=document.body.dataset.page||'';
    const u=(key,fallback)=>safeHttpUrl(marketing[key],fallback),home=u('home','index.html'),plans=home+(home.includes('#')?'':'#agency-plans');
    const link=(href,label,key='')=>`<a class="nav-link ${current===key?'active':''}" href="${href}">${label}</a>`;
    header.innerHTML=`<header class="site-header"><div class="utility-bar"><div class="container utility-inner"><div class="utility-group"><strong>DOT Compliance Software by screenings4u</strong><span class="utility-dot"></span><span>Built for regulated workforces</span></div><div class="utility-group"><span>Software Sales &amp; Support</span><strong>(773) 245-7009</strong></div></div></div><nav class="main-nav" aria-label="Primary navigation"><div class="container nav-inner"><a class="brand brand-image" href="${home}" aria-label="screenings4u Workforce DOT home"><img src="assets/img/logo2.png" alt="screenings4u Workforce DOT" width="376" height="96"></a><button class="mobile-toggle" type="button" aria-expanded="false" aria-controls="primary-links" aria-label="Open navigation"><span class="mobile-toggle-lines"><span></span></span></button><div class="nav-links" id="primary-links">${link(u('platform','platform.html'),'Platform','platform')}<details class="nav-menu"><summary class="menu-summary">Solutions <span class="chevron"></span></summary><div class="menu-panel"><a href="${u('employers','employers.html')}">Employers</a><a href="${u('owner_operator','owner-operator.html')}">Owner-Operators</a><a href="${u('ctpa','ctpa.html')}">C/TPAs</a></div></details><details class="nav-menu"><summary class="menu-summary">DOT Agencies <span class="chevron"></span></summary><div class="menu-panel"><a href="${u('fmcsa','fmcsa.html')}">FMCSA</a><a href="${u('faa','faa.html')}">FAA</a><a href="${u('fra','fra.html')}">FRA</a><a href="${u('fta','fta.html')}">FTA</a><a href="${u('phmsa','phmsa.html')}">PHMSA</a><a href="${u('uscg','uscg.html')}">USCG</a></div></details>${link(u('resources','resources.html'),'Resources','resources')}${link(u('blog','blog.html'),'Blog','blog')}<div class="mobile-nav-actions"><a class="btn btn-secondary" href="${u('login_directory','login.html')}">Sign In</a><a class="btn btn-secondary" href="${u('demo','demo.html')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div></div><div class="nav-actions"><a class="nav-link" href="${u('login_directory','login.html')}">Sign In</a><a class="btn btn-secondary" href="${u('demo','demo.html')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div></div></nav></header>`;
    header.querySelectorAll('a[href]').forEach(a=>{if(!managedVisible(a.href))a.hidden=true});
    const toggle=header.querySelector('.mobile-toggle'),navLinks=header.querySelector('.nav-links');
    if(toggle&&navLinks){const close=()=>{toggle.setAttribute('aria-expanded','false');navLinks.classList.remove('mobile-open');document.body.classList.remove('nav-open')};toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));navLinks.classList.toggle('mobile-open',!open);document.body.classList.toggle('nav-open',!open)});navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));window.addEventListener('resize',()=>{if(window.matchMedia('(min-width:1025px)').matches)close()},{passive:true})}
  }

  const cached=readCache();render(cached||window.S4UUrlConfig||null);
  loadUrlConfiguration().then(urls=>{if(urls)render(urls)});
  window.addEventListener('s4u:management-runtime-updated',()=>render(window.S4UUrlConfig||readCache()||null));
})();
