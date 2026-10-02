(function(){
  'use strict';
  const target=document.getElementById('__legacySiteHeaderDisabled');
  if(target){
    const fallback={home:'index.html',platform:'platform.html',employers:'employers.html',owner_operator:'fmcsa-dot-random-consortium-49-cfr-part-382.html',ctpa:'ctpa.html',fmcsa:'fmcsa.html',faa:'faa.html',fra:'fra.html',fta:'fta.html',phmsa:'phmsa.html',uscg:'uscg.html',resources:'resources.html',blog:'blog.html',contact:'contact.html',login_directory:'login.html',demo:'demo.html'};
    const U=(k)=>fallback[k];
    target.innerHTML=`<header class="site-header"><div class="container nav-wrap">
      <a class="brand" href="${U('home')}" aria-label="Workforce DOT by screenings4u home"><img src="images/logo.png" alt="Workforce DOT by screenings4u"></a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primaryNav"><span></span></button>
      <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
        <a href="${U('platform')}">Platform</a>
        <details><summary>Solutions <i></i></summary><div class="dropdown"><a href="${U('employers')}">Employers</a><a href="${U('owner_operator')}">FMCSA Owner-Operator Drivers</a><a href="${U('ctpa')}">C/TPAs</a></div></details>
        <details><summary>DOT Agencies <i></i></summary><div class="dropdown agency-dropdown"><a href="${U('fmcsa')}">FMCSA</a><a href="${U('faa')}">FAA</a><a href="${U('fra')}">FRA</a><a href="${U('fta')}">FTA</a><a href="${U('phmsa')}">PHMSA</a><a href="${U('uscg')}">USCG</a></div></details>
        <details open><summary>Resources <i></i></summary><div class="dropdown"><a href="${U('resources')}">Resource Center</a><a href="${U('blog')}">Blog</a><a class="active-drop" href="${U('contact')}">Contact</a></div></details>
        <a href="pricing.html">Pricing</a>
        <div class="mobile-actions"><a href="${U('login_directory')}">Sign In</a><a class="btn btn-secondary" href="${U('demo')}">Request Demo</a><a class="btn btn-primary" href="pricing.html">View Plans</a></div>
      </nav>
      <div class="nav-actions"><a class="signin" href="${U('login_directory')}">Sign In</a><a class="btn btn-secondary" href="${U('demo')}">Request Demo</a><a class="btn btn-primary" href="pricing.html">View Plans</a></div>
    </div></header>`;
    const toggle=target.querySelector('.nav-toggle'),nav=target.querySelector('.primary-nav');
    if(toggle&&nav) toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);document.body.classList.toggle('nav-open',!open)});
    document.addEventListener('click',e=>target.querySelectorAll('details[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open')}));
    const setScrolled=()=>{const h=target.querySelector('.site-header');if(h)h.classList.toggle('is-scrolled',window.scrollY>18)};window.addEventListener('scroll',setScrolled,{passive:true});setScrolled();
  }

  const topic=document.getElementById('topicSelect');
  document.querySelectorAll('[data-topic]').forEach(link=>link.addEventListener('click',()=>{
    if(topic){ topic.value=link.dataset.topic; setTimeout(()=>topic.focus({preventScroll:true}),450); }
  }));
})();
