(()=>{
'use strict';
const TARGET_ID='siteHeader';
const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';
const CACHE='s4u_dot_url_config_v3';
const fallback={home:'index.html',platform:'platform.html',employers:'employers.html',owner_operator:'fmcsa-dot-random-consortium-49-cfr-part-382.html',ctpa:'ctpa.html',fmcsa:'fmcsa.html',faa:'faa.html',fra:'fra.html',fta:'fta.html',phmsa:'phmsa.html',uscg:'uscg.html',resources:'resources.html',blog:'blog.html',contact:'contact.html',login_directory:'login.html',demo:'demo.html',pricing:'pricing.html'};
const safe=(raw,fb)=>{if(!raw)return fb;try{const u=new URL(String(raw),location.href),h=u.hostname.toLowerCase();const ok=h==='screenings4u.com'||h.endsWith('.screenings4u.com')||h===location.hostname;return ((u.protocol==='https:'||u.origin===location.origin)&&ok)?u.href:fb}catch{return fb}};
const read=()=>{try{const x=JSON.parse(localStorage.getItem(CACHE)||'null');return x&&Date.now()-x.at<3600000?x.urls:null}catch{return null}};
const save=urls=>{try{localStorage.setItem(CACHE,JSON.stringify({at:Date.now(),urls}))}catch{}};
function currentKey(){const f=(location.pathname.split('/').pop()||'index.html').toLowerCase();if(f==='index.html'||!f)return'home';if(f==='fmcsa-dot-random-consortium-49-cfr-part-382.html'||f==='owner-operator.html')return'owner_operator';return f.replace(/\.html$/,'').replace(/-/g,'_')}
function render(urls){
 const target=document.getElementById(TARGET_ID);if(!target)return;
 const m=urls?.marketing_pages||{};const U=(k)=>safe(m[k],fallback[k]);const key=currentKey();const pricing=U('pricing');
 const active=(k)=>key===k?' is-active':'';
 const dropActive=(keys)=>keys.includes(key)?' is-active':'';
 target.innerHTML=`<header class="s4u-header"><nav class="s4u-nav" aria-label="Primary navigation">
 <a class="s4u-brand" href="${U('home')}" aria-label="Workforce DOT by screenings4u home"><img src="images/logo.png" alt="Workforce DOT by screenings4u"></a>
 <button class="s4u-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="s4uPrimary"><span></span></button>
 <div class="s4u-links" id="s4uPrimary">
   <a class="s4u-link${active('platform')}" href="${U('platform')}">Platform</a>
   <details class="s4u-menu${dropActive(['employers','owner_operator','ctpa'])}"><summary>Solutions <i class="s4u-caret"></i></summary><div class="s4u-menu-panel"><a class="${active('employers').trim()}" href="${U('employers')}">Employers</a><a class="${active('owner_operator').trim()}" href="${U('owner_operator')}">Owner-Operators</a><a class="${active('ctpa').trim()}" href="${U('ctpa')}">C/TPAs</a></div></details>
   <details class="s4u-menu${dropActive(['fmcsa','faa','fra','fta','phmsa','uscg'])}"><summary>DOT Agencies <i class="s4u-caret"></i></summary><div class="s4u-menu-panel agencies"><a class="${active('fmcsa').trim()}" href="${U('fmcsa')}">FMCSA</a><a class="${active('faa').trim()}" href="${U('faa')}">FAA</a><a class="${active('fra').trim()}" href="${U('fra')}">FRA</a><a class="${active('fta').trim()}" href="${U('fta')}">FTA</a><a class="${active('phmsa').trim()}" href="${U('phmsa')}">PHMSA</a><a class="${active('uscg').trim()}" href="${U('uscg')}">USCG</a></div></details>
   <details class="s4u-menu${dropActive(['resources','blog','contact'])}"><summary>Resources <i class="s4u-caret"></i></summary><div class="s4u-menu-panel"><a class="${active('resources').trim()}" href="${U('resources')}">Resource Center</a><a class="${active('blog').trim()}" href="${U('blog')}">Blog</a><a class="${active('contact').trim()}" href="${U('contact')}">Contact</a></div></details>
   <a class="s4u-link${active('pricing')}" href="${pricing}">Pricing</a>
   <div class="s4u-mobile-actions"><a class="s4u-signin" href="${U('login_directory')}">Sign In</a><a class="s4u-nav-btn secondary" href="${U('demo')}">Request Demo</a><a class="s4u-nav-btn primary" href="${pricing}">View Plans</a></div>
 </div>
 <div class="s4u-actions"><a class="s4u-signin" href="${U('login_directory')}">Sign In</a><a class="s4u-nav-btn secondary" href="${U('demo')}">Request Demo</a><a class="s4u-nav-btn primary" href="${pricing}">View Plans</a></div>
 </nav></header>`;
 const toggle=target.querySelector('.s4u-toggle'),links=target.querySelector('.s4u-links');
 const close=()=>{toggle?.setAttribute('aria-expanded','false');links?.classList.remove('mobile-open');document.body.classList.remove('s4u-nav-open');target.querySelectorAll('details[open]').forEach(d=>d.removeAttribute('open'))};
 toggle?.addEventListener('click',e=>{e.stopPropagation();const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));links?.classList.toggle('mobile-open',!open);document.body.classList.toggle('s4u-nav-open',!open)});
 links?.querySelectorAll('.s4u-menu').forEach(menu=>menu.addEventListener('toggle',()=>{if(menu.open){links.querySelectorAll('.s4u-menu[open]').forEach(other=>{if(other!==menu)other.removeAttribute('open')})}}));
 links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('click',e=>{if(!target.contains(e.target))close();else target.querySelectorAll('details[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open')})});
 window.addEventListener('resize',()=>{if(innerWidth>980)close()});
}
function init(){render(window.S4UUrlConfig||read());fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'url_configuration'})}).then(async r=>{const d=await r.json();if(!r.ok||!d.urls)throw 0;window.S4UUrlConfig=d.urls;save(d.urls);render(d.urls)}).catch(()=>{});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('s4u:management-runtime-updated',()=>render(window.S4UUrlConfig||read()));
})();
