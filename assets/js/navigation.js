(()=>{
'use strict';
const TARGET_ID='siteHeader';
const API='https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/workforce-checkout-status';
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
   <details class="s4u-menu s4u-mega${dropActive(['employers','owner_operator','ctpa'])}">
     <summary>Solutions <i class="s4u-caret"></i></summary>
     <div class="s4u-menu-panel s4u-mega-panel">
       <div class="s4u-mega-grid">
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">Workforce Solutions</span>
           <a class="${active('employers').trim()}" href="${U('employers')}"><strong>Employers</strong><small>Manage employees, testing programs, compliance tasks and records.</small></a>
           <a class="${active('owner_operator').trim()}" href="${U('owner_operator')}"><strong>Owner-Operators</strong><small>FMCSA random consortium and owner-operator program management.</small></a>
           <a class="${active('ctpa').trim()}" href="${U('ctpa')}"><strong>C/TPAs</strong><small>Manage multiple regulated clients, testing activity and compliance workflows.</small></a>
         </div>
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">Platform</span>
           <a href="${U('platform')}"><strong>Workforce DOT Platform</strong><small>One connected workspace for DOT workforce compliance.</small></a>
           <a href="${U('pricing')}"><strong>Plans & Pricing</strong><small>Compare Employer, Owner-Operator and C/TPA plans.</small></a>
           <a href="${U('demo')}"><strong>Request a Demo</strong><small>See the platform and workflows with our team.</small></a>
         </div>
         <a class="s4u-mega-feature" href="${U('platform')}">
           <span>Workforce DOT</span>
           <strong>Connected compliance software for regulated programs.</strong>
           <small>Employees, random programs, testing orders, documents, reporting and audit history in one system.</small>
           <b>Explore the platform →</b>
         </a>
       </div>
     </div>
   </details>
   <details class="s4u-menu s4u-mega${dropActive(['fmcsa','faa','fra','fta','phmsa','uscg'])}">
     <summary>DOT Agencies <i class="s4u-caret"></i></summary>
     <div class="s4u-menu-panel s4u-mega-panel">
       <div class="s4u-mega-grid agencies-grid">
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">DOT Agencies</span>
           <a class="${active('fmcsa').trim()}" href="${U('fmcsa')}"><strong>FMCSA</strong><small>49 CFR Part 382 motor carrier compliance workflows.</small></a>
           <a class="${active('faa').trim()}" href="${U('faa')}"><strong>FAA</strong><small>Aviation drug and alcohol program management.</small></a>
           <a class="${active('fra').trim()}" href="${U('fra')}"><strong>FRA</strong><small>Railroad drug and alcohol compliance under Part 219.</small></a>
         </div>
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">More Agencies</span>
           <a class="${active('fta').trim()}" href="${U('fta')}"><strong>FTA</strong><small>Transit workforce testing and program compliance.</small></a>
           <a class="${active('phmsa').trim()}" href="${U('phmsa')}"><strong>PHMSA</strong><small>Pipeline workforce drug and alcohol compliance.</small></a>
           <a class="${active('uscg').trim()}" href="${U('uscg')}"><strong>USCG</strong><small>Maritime regulated workforce compliance workflows.</small></a>
         </div>
         <a class="s4u-mega-feature" href="${U('fmcsa')}">
           <span>Agency-specific workflows</span>
           <strong>Built around the DOT program you actually operate.</strong>
           <small>Keep agency rules, workforce records, testing activity and compliance work connected.</small>
           <b>Explore DOT agencies →</b>
         </a>
       </div>
     </div>
   </details>
   <details class="s4u-menu s4u-mega${dropActive(['resources','blog','contact'])}">
     <summary>Resources <i class="s4u-caret"></i></summary>
     <div class="s4u-menu-panel s4u-mega-panel">
       <div class="s4u-mega-grid">
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">Resources</span>
           <a class="${active('resources').trim()}" href="${U('resources')}"><strong>Resource Center</strong><small>DOT compliance guides, program resources and platform help.</small></a>
           <a class="${active('blog').trim()}" href="${U('blog')}"><strong>Blog</strong><small>Updates, operational guidance and workforce compliance topics.</small></a>
           <a class="${active('contact').trim()}" href="${U('contact')}"><strong>Contact</strong><small>Talk with the Workforce DOT team.</small></a>
         </div>
         <div class="s4u-mega-col">
           <span class="s4u-mega-eyebrow">Get Started</span>
           <a href="${U('demo')}"><strong>Request Demo</strong><small>Walk through the platform with our team.</small></a>
           <a href="${U('pricing')}"><strong>View Plans</strong><small>Compare plan depth and operating features.</small></a>
           <a href="${U('login_directory')}"><strong>Sign In</strong><small>Access your Workforce DOT account.</small></a>
         </div>
         <a class="s4u-mega-feature" href="${U('resources')}">
           <span>Resource Center</span>
           <strong>Keep DOT program information and platform resources close at hand.</strong>
           <small>Use guides, articles and support resources built for regulated workforce programs.</small>
           <b>Browse resources →</b>
         </a>
       </div>
     </div>
   </details>
   <a class="s4u-link${active('pricing')}" href="${pricing}">Pricing</a>
   <div class="s4u-mobile-actions"><a class="s4u-signin" href="${U('login_directory')}">Sign In</a><a class="s4u-nav-btn secondary" href="${U('demo')}">Request Demo</a><a class="s4u-nav-btn primary" href="${pricing}">View Plans</a></div>
 </div>
 <div class="s4u-actions"><a class="s4u-signin" href="${U('login_directory')}">Sign In</a><a class="s4u-nav-btn secondary" href="${U('demo')}">Request Demo</a><a class="s4u-nav-btn primary" href="${pricing}">View Plans</a></div>
 </nav></header>`;
 const toggle=target.querySelector('.s4u-toggle'),links=target.querySelector('.s4u-links');
 const isMobile=()=>window.innerWidth<=980;
 const closeMenus=()=>target.querySelectorAll('.s4u-menu[open]').forEach(d=>d.removeAttribute('open'));
 const closeMobile=()=>{toggle?.setAttribute('aria-expanded','false');links?.classList.remove('mobile-open');document.body.classList.remove('s4u-nav-open')};
 const close=()=>{closeMobile();closeMenus()};
 toggle?.addEventListener('click',e=>{e.stopPropagation();const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));links?.classList.toggle('mobile-open',!open);document.body.classList.toggle('s4u-nav-open',!open)});
 links?.querySelectorAll('.s4u-menu').forEach(menu=>{
   const summary=menu.querySelector('summary');
   const openDesktop=()=>{if(isMobile())return;links.querySelectorAll('.s4u-menu[open]').forEach(other=>{if(other!==menu)other.removeAttribute('open')});menu.setAttribute('open','')};
   summary?.addEventListener('mouseenter',openDesktop);
   menu.querySelector('.s4u-menu-panel')?.addEventListener('mouseenter',openDesktop);
   summary?.addEventListener('focus',openDesktop);
   summary?.addEventListener('click',e=>{if(!isMobile()){e.preventDefault();e.stopPropagation();const wasOpen=menu.hasAttribute('open');closeMenus();if(!wasOpen)menu.setAttribute('open','')}});
   menu.addEventListener('toggle',()=>{if(isMobile()&&menu.open){links.querySelectorAll('.s4u-menu[open]').forEach(other=>{if(other!==menu)other.removeAttribute('open')})}});
 });
 links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('click',e=>{if(!target.contains(e.target))close();else if(!isMobile()&&!e.target.closest('.s4u-menu'))closeMenus()});
 window.addEventListener('resize',()=>{close()});
}
function init(){render(window.S4UUrlConfig||read());fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'url_configuration'})}).then(async r=>{const d=await r.json();if(!r.ok||!d.urls)throw 0;window.S4UUrlConfig=d.urls;save(d.urls);render(d.urls)}).catch(()=>{});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('s4u:management-runtime-updated',()=>render(window.S4UUrlConfig||read()));
})();
