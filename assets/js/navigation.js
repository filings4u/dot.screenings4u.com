(function(){
  'use strict';
  const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';
  const CACHE='s4u_dot_url_config_v2';
  const read=()=>{try{const x=JSON.parse(localStorage.getItem(CACHE)||'null');return x&&Date.now()-x.at<3600000?x.urls:null}catch{return null}};
  const save=urls=>{try{localStorage.setItem(CACHE,JSON.stringify({at:Date.now(),urls}))}catch{}};
  const safe=(raw,fallback)=>{if(!raw)return fallback;try{const u=new URL(String(raw),location.href);const h=u.hostname.toLowerCase();const ok=h==='screenings4u.com'||h.endsWith('.screenings4u.com')||h===location.hostname;return (u.protocol==='https:'||u.origin===location.origin)&&ok?u.href:fallback}catch{return fallback}};
  function render(urls){
    const target=document.getElementById('siteHeader'); if(!target)return;
    const m=urls?.marketing_pages||{}; const U=(k,f)=>safe(m[k],f);
    const home=U('home','index.html'), plans=home+(home.includes('#')?'':'#agency-plans');
    target.innerHTML=`<header class="saas-header"><nav class="saas-nav" aria-label="Primary navigation"><div class="container">
      <a class="saas-brand" href="${home}" aria-label="Workforce DOT by screenings4u home"><img src="images/logo.png" alt="screenings4u"></a>
      <button class="saas-toggle" type="button" aria-expanded="false" aria-controls="saasPrimary"><span></span></button>
      <div class="saas-links" id="saasPrimary">
        <a class="saas-link" href="${U('platform','platform.html')}">Platform</a>
        <details class="saas-menu"><summary>Solutions <i class="saas-caret"></i></summary><div class="saas-menu-panel"><a href="${U('employers','employers.html')}">Employers</a><a href="${U('owner_operator','owner-operator.html')}">Owner-Operators</a><a href="${U('ctpa','ctpa.html')}">C/TPAs</a></div></details>
        <details class="saas-menu"><summary>DOT Agencies <i class="saas-caret"></i></summary><div class="saas-menu-panel"><a href="${U('fmcsa','fmcsa.html')}">FMCSA</a><a href="${U('faa','faa.html')}">FAA</a><a href="${U('fra','fra.html')}">FRA</a><a href="${U('fta','fta.html')}">FTA</a><a href="${U('phmsa','phmsa.html')}">PHMSA</a><a href="${U('uscg','uscg.html')}">USCG</a></div></details>
        <details class="saas-menu"><summary>Resources <i class="saas-caret"></i></summary><div class="saas-menu-panel"><a href="${U('resources','resources.html')}">Resource Center</a><a href="${U('blog','blog.html')}">Blog</a><a href="${U('contact','contact.html')}">Contact</a></div></details>
        <a class="saas-link" href="${plans}">Pricing</a>
        <div class="mobile-saas-actions"><a class="saas-signin" href="${U('login_directory','login.html')}">Sign In</a><a class="btn btn-secondary" href="${U('demo','demo.html')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div>
      </div>
      <div class="saas-actions"><a class="saas-signin" href="${U('login_directory','login.html')}">Sign In</a><a class="btn btn-secondary" href="${U('demo','demo.html')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div>
    </div></nav></header>`;
    const toggle=target.querySelector('.saas-toggle'), links=target.querySelector('.saas-links');
    const close=()=>{toggle?.setAttribute('aria-expanded','false');links?.classList.remove('mobile-open')};
    toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));links.classList.toggle('mobile-open',!open)});
    links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('click',e=>{target.querySelectorAll('.saas-menu[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open')})});
  }
  render(read()||window.S4UUrlConfig||null);
  fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'url_configuration'})}).then(async r=>{const d=await r.json();if(!r.ok||!d.urls)throw new Error(d.error||'URL configuration unavailable');window.S4UUrlConfig=d.urls;save(d.urls);render(d.urls)}).catch(()=>{});
})();
