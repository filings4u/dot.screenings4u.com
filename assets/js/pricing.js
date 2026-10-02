(function(){
  'use strict';

  const target = document.getElementById('__legacySiteHeaderDisabled');
  if (target) {
    const fallback = {home:'index.html',platform:'platform.html',employers:'employers.html',owner_operator:'fmcsa-dot-random-consortium-49-cfr-part-382.html',ctpa:'ctpa.html',fmcsa:'fmcsa.html',faa:'faa.html',fra:'fra.html',fta:'fta.html',phmsa:'phmsa.html',uscg:'uscg.html',resources:'resources.html',blog:'blog.html',contact:'contact.html',login_directory:'login.html',demo:'demo.html'};
    function render(urls){
      const marketing=urls?.marketing_pages||{};
      const U=(k)=>k==='owner_operator'?fallback.owner_operator:(marketing[k]||fallback[k]);
      const plans='pricing.html';
      target.innerHTML=`<header class="site-header"><div class="container nav-wrap">
        <a class="brand" href="${U('home')}" aria-label="Workforce DOT by screenings4u home"><img src="images/logo.png" alt="Workforce DOT by screenings4u"></a>
        <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primaryNav"><span></span></button>
        <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
          <a href="${U('platform')}">Platform</a>
          <details><summary>Solutions <i></i></summary><div class="dropdown"><a href="${U('employers')}">Employers</a><a href="${U('owner_operator')}">FMCSA Owner-Operator Drivers</a><a href="${U('ctpa')}">C/TPAs</a></div></details>
          <details><summary>DOT Agencies <i></i></summary><div class="dropdown agency-dropdown"><a href="${U('fmcsa')}">FMCSA</a><a href="${U('faa')}">FAA</a><a href="${U('fra')}">FRA</a><a href="${U('fta')}">FTA</a><a href="${U('phmsa')}">PHMSA</a><a href="${U('uscg')}">USCG</a></div></details>
          <details><summary>Resources <i></i></summary><div class="dropdown"><a href="${U('resources')}">Resource Center</a><a href="${U('blog')}">Blog</a><a href="${U('contact')}">Contact</a></div></details>
          <a class="active-link" href="${plans}">Pricing</a>
          <div class="mobile-actions"><a href="${U('login_directory')}">Sign In</a><a class="btn btn-secondary" href="${U('demo')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div>
        </nav>
        <div class="nav-actions"><a class="signin" href="${U('login_directory')}">Sign In</a><a class="btn btn-secondary" href="${U('demo')}">Request Demo</a><a class="btn btn-primary" href="${plans}">View Plans</a></div>
      </div></header>`;
      const toggle=target.querySelector('.nav-toggle'),nav=target.querySelector('.primary-nav');
      if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);document.body.classList.toggle('nav-open',!open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');document.body.classList.remove('nav-open')}));}
      document.addEventListener('click',e=>target.querySelectorAll('details[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open')}));
    }
    render(null);
    const setScrolled=()=>{const h=target.querySelector('.site-header');if(h)h.classList.toggle('is-scrolled',window.scrollY>18)};
    window.addEventListener('scroll',setScrolled,{passive:true});setScrolled();
  }

  const labels={
    employee_management:'Employee / driver records',driver_qualification:'Driver qualification tools',bulk_employee_import:'Bulk employee / driver import',team_users:'Staff / account users',locations:'Locations / terminals',ders_supervisors:'DERs & supervisors',post_accident:'Post-accident management',action_center:'Compliance Action Center',policy_acknowledgments:'Policy distribution & acknowledgments',training_records:'Training records',programs:'DOT / non-DOT programs',random_pool:'Random pool participation',consortium_pools:'Consortium pools',random_selections:'Random selections',testing_orders:'Testing orders',collection_sites:'Collection Site Finder',results_summary:'Result summaries',results_sensitive:'Sensitive results',compliance:'Compliance management',rtd_follow_up:'Return-to-duty / follow-up',documents:'Documents & certificates',standard_reports:'Standard reports',advanced_reports:'Advanced reports / MIS',notifications:'Notifications & reminders',integrations:'Integrations',branded_email:'Branded customer email',white_label:'White label',audit_history:'Audit history',employer_management:'Employer client management',billing_tools:'Billing tools',customer_portal_delivery:'Customer portal delivery',clearinghouse_tools:'FMCSA Clearinghouse tools',policy_builder:'Employer drug & alcohol policy builder',employer_settings:'Employer feature controls',employer_import:'Employer spreadsheet import',enrollment_documents:'Enrollment agreements & certificates',client_invoicing:'Client invoicing',client_payments:'Integrated client payments',sso:'Single Sign-On'
  };

  const pricingData={
    employer:{
      eyebrow:'Employer Plans',title:'DOT Employer software plan comparison.',description:'Compare the active DOT Employer Essential, Professional, and Enterprise plans and the services included in each tier.',
      plans:[
        {code:'dot_employer_essential',name:'Essential',price:85,services:['employee_management','post_accident','policy_acknowledgments','programs','random_pool','random_selections','testing_orders','results_summary','compliance','documents','standard_reports','notifications']},
        {code:'dot_employer_professional',name:'Professional',price:145,popular:true,services:['employee_management','driver_qualification','team_users','ders_supervisors','post_accident','action_center','policy_acknowledgments','training_records','programs','random_pool','random_selections','testing_orders','collection_sites','results_summary','results_sensitive','compliance','rtd_follow_up','documents','standard_reports','advanced_reports','notifications']},
        {code:'dot_employer_enterprise',name:'Enterprise',price:245,services:['employee_management','driver_qualification','bulk_employee_import','team_users','locations','ders_supervisors','post_accident','action_center','policy_acknowledgments','training_records','programs','random_pool','random_selections','testing_orders','collection_sites','results_summary','results_sensitive','compliance','rtd_follow_up','documents','standard_reports','advanced_reports','notifications','integrations','branded_email','white_label','audit_history']}
      ]
    },
    owner_operator:{
      eyebrow:'FMCSA Owner-Operator Plans',title:'FMCSA Owner-Operator software plan comparison.',description:'Compare the active single-driver Owner-Operator Essential, Plus, and Complete plans.',
      plans:[
        {code:'owner_operator_essential',name:'Essential',price:45,services:['employee_management','programs','random_pool','testing_orders','documents','standard_reports']},
        {code:'owner_operator_plus',name:'Plus',price:125,popular:true,services:['employee_management','programs','random_pool','testing_orders','results_summary','results_sensitive','compliance','documents','standard_reports']},
        {code:'owner_operator_complete',name:'Complete',price:225,services:['employee_management','programs','random_pool','testing_orders','results_summary','results_sensitive','compliance','documents','standard_reports','advanced_reports','audit_history']}
      ]
    },
    ctpa:{
      eyebrow:'C/TPA Plans',title:'DOT C/TPA software plan comparison.',description:'Compare active C/TPA plans for employer-client management, consortium pools, testing, billing, portal delivery, and enterprise controls.',
      plans:[
        {code:'dot_ctpa_essential',name:'Essential',price:125,services:['employee_management','employer_management','programs','consortium_pools','random_selections','testing_orders','results_summary','compliance','documents','standard_reports','billing_tools','notifications','client_invoicing']},
        {code:'dot_ctpa_professional',name:'Professional',price:225,popular:true,services:['employee_management','employer_management','programs','consortium_pools','random_selections','testing_orders','collection_sites','results_summary','results_sensitive','compliance','documents','standard_reports','advanced_reports','billing_tools','notifications','customer_portal_delivery','client_invoicing']},
        {code:'dot_ctpa_enterprise',name:'Enterprise',price:375,services:['employee_management','employer_management','team_users','locations','ders_supervisors','programs','consortium_pools','random_selections','testing_orders','collection_sites','results_summary','results_sensitive','compliance','rtd_follow_up','documents','standard_reports','advanced_reports','billing_tools','notifications','customer_portal_delivery','integrations','branded_email','clearinghouse_tools','policy_builder','employer_settings','employer_import','enrollment_documents','client_invoicing','white_label','client_payments','sso','audit_history']}
      ]
    }
  };

  const priceBar=document.querySelector('[data-price-bar]');
  const tableBody=document.querySelector('[data-table-body]');
  const tableFoot=document.querySelector('[data-table-foot]');
  const tabs=Array.from(document.querySelectorAll('.product-tab'));
  const eyebrow=document.querySelector('[data-audience-eyebrow]');
  const title=document.querySelector('[data-audience-title]');
  const description=document.querySelector('[data-audience-description]');
  const comparisonHeading=document.querySelector('.comparison-heading');
  const comparisonShell=document.querySelector('[data-comparison-shell]');
  let mobileCards=document.querySelector('[data-mobile-cards]');
  if(!mobileCards&&comparisonHeading&&comparisonShell){
    mobileCards=document.createElement('div');
    mobileCards.className='mobile-plan-cards';
    mobileCards.setAttribute('data-mobile-cards','');
    comparisonShell.parentNode.insertBefore(mobileCards,comparisonShell);
  }
  let activeProduct='employer';

  function checkoutLink(planCode){
    const code=String(planCode||'').trim().toLowerCase();
    const q=new URLSearchParams({plan:code});
    if(code.startsWith('dot_ctpa_')) q.set('type','ctpa');
    else if(code.startsWith('owner_operator_')) { q.set('type','owner_operator'); q.set('agency','FMCSA'); }
    else if(code.startsWith('dot_employer_')) q.set('type','employer');
    else {
      const m=code.match(/^dot_(fmcsa|faa|fra|fta|phmsa|uscg)_/);
      if(m){ q.set('type','employer'); q.set('agency',m[1].toUpperCase()); }
    }
    return `checkout.html?${q.toString()}`;
  }

  function renderPricing(product){
    activeProduct=product;
    const data=pricingData[product];
    if(!data)return;
    eyebrow.textContent=data.eyebrow;title.textContent=data.title;description.textContent=data.description;
    tabs.forEach(tab=>{const active=tab.dataset.product===product;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));});

    priceBar.innerHTML=`<div class="summary-intro"><span class="summary-kicker">${data.eyebrow}</span><p>Pricing stays visible while you compare</p></div>`+data.plans.map(plan=>`<article class="summary-plan ${plan.popular?'is-featured':''}"><span class="summary-plan-name">${plan.name}</span>${plan.popular?'<em>Most Popular</em>':''}<strong>$${plan.price}</strong><small>/month</small><a href="${checkoutLink(plan.code)}" class="mini-btn ${plan.popular?'primary':''}">Choose ${plan.name}</a></article>`).join('');

    const featureOrder=[];
    data.plans.forEach(plan=>plan.services.forEach(service=>{if(!featureOrder.includes(service))featureOrder.push(service);}));
    const core=['employee_management','employer_management','programs','random_pool','consortium_pools','random_selections','testing_orders','results_summary','compliance','documents','standard_reports','notifications','client_invoicing'];
    const coreFeatures=featureOrder.filter(x=>core.includes(x));
    const expanded=featureOrder.filter(x=>!core.includes(x));
    const row=(service)=>`<tr><th scope="row">${labels[service]||service}</th>${data.plans.map(plan=>`<td class="${plan.services.includes(service)?'yes':'no'}">${plan.services.includes(service)?'✓':'—'}</td>`).join('')}</tr>`;
    tableBody.innerHTML=`<tr class="section-row"><th colspan="4">Core included services</th></tr>${coreFeatures.map(row).join('')}${expanded.length?`<tr class="section-row"><th colspan="4">Expanded tools & administration</th></tr>${expanded.map(row).join('')}`:''}`;
    tableFoot.innerHTML=`<tr><th scope="row">Monthly price</th>${data.plans.map(plan=>`<td class="${plan.popular?'popular-col':''}"><strong>$${plan.price}</strong><small>/month</small><a href="${checkoutLink(plan.code)}" class="table-btn ${plan.popular?'primary':''}">Choose ${plan.name}</a></td>`).join('')}</tr>`;

    if(mobileCards){
      mobileCards.innerHTML=data.plans.map(plan=>{
        const features=plan.services.map(service=>`<li>${labels[service]||service}</li>`).join('');
        return `<article class="mobile-plan-card ${plan.popular?'is-featured':''}">
          <div class="mobile-plan-head">
            <div>
              <span class="mobile-plan-name">${plan.name}</span>
              ${plan.popular?'<span class="mobile-plan-badge">Most Popular</span>':''}
            </div>
            <div class="mobile-plan-price"><strong>$${plan.price}</strong><span>/month</span></div>
          </div>
          <a href="${checkoutLink(plan.code)}" class="mobile-plan-cta">Choose ${plan.name}</a>
          <details class="mobile-plan-details" ${plan.popular?'open':''}>
            <summary>Included services (${plan.services.length})</summary>
            <ul class="mobile-feature-list">${features}</ul>
          </details>
        </article>`;
      }).join('');
    }
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>renderPricing(tab.dataset.product)));
  renderPricing(activeProduct);

  const sideLinks=Array.from(document.querySelectorAll('.side-link'));
  const sectionMap=sideLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if(sideLinks.length&&sectionMap.length){const setActive=()=>{let current=sectionMap[0].id;const offset=window.scrollY+160;sectionMap.forEach(section=>{if(section.offsetTop<=offset)current=section.id;});sideLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${current}`));};window.addEventListener('scroll',setActive,{passive:true});setActive();}

  const floatingStack=document.querySelector('[data-floating-stack]');
  const comparisonWrap=document.querySelector('.comparison-wrap');
  const comparisonTableShell=document.querySelector('[data-comparison-shell]');
  if(floatingStack&&comparisonWrap){
    let floatingRaf=0;
    const updateFloating=()=>{
      floatingRaf=0;
      if(window.innerWidth<=700){
        floatingStack.style.opacity='1';
        floatingStack.style.transform='none';
        floatingStack.classList.remove('is-fading');
        return;
      }
      const stopTarget=comparisonTableShell||comparisonWrap;
      const targetBottom=stopTarget.getBoundingClientRect().bottom;
      const stackBottom=floatingStack.getBoundingClientRect().bottom;
      const remaining=targetBottom-stackBottom;
      const fadeStart=560;
      const fadeEnd=120;
      const opacity=Math.max(0,Math.min(1,(remaining-fadeEnd)/(fadeStart-fadeEnd)));
      floatingStack.style.opacity=String(opacity);
      floatingStack.style.transform=opacity<1?`translate3d(0,${-10*(1-opacity)}px,0)`:'translate3d(0,0,0)';
      floatingStack.classList.toggle('is-fading',opacity<=.04);
    };
    const requestFloatingUpdate=()=>{
      if(!floatingRaf) floatingRaf=requestAnimationFrame(updateFloating);
    };
    window.addEventListener('scroll',requestFloatingUpdate,{passive:true});
    window.addEventListener('resize',requestFloatingUpdate);
    requestFloatingUpdate();
  }

  const faqs=Array.from(document.querySelectorAll('#faq details'));
  faqs.forEach(item=>item.addEventListener('toggle',()=>{if(!item.open)return;faqs.forEach(other=>{if(other!==item)other.open=false;});}));


  // Live Supabase catalog sync: pricing remains managed from the DOT portal/catalog.
  function applyLiveCatalog(payload){
    const plans=Array.isArray(payload?.plans)?payload.plans:Array.isArray(payload?.data?.plans)?payload.data.plans:[];
    if(!plans.length)return;
    const groups={
      employer:plans.filter(p=>/^dot_employer_(essential|professional|enterprise)$/i.test(String(p.code||''))),
      owner_operator:plans.filter(p=>/^owner_operator_(essential|plus|complete)$/i.test(String(p.code||''))),
      ctpa:plans.filter(p=>/^dot_ctpa_(essential|professional|enterprise)$/i.test(String(p.code||'')))
    };
    Object.entries(groups).forEach(([key,list])=>{
      if(list.length!==3)return;
      list.sort((a,b)=>(Number(a.billing_model?.website_sort_order)||Number(a.monthly_price)||0)-(Number(b.billing_model?.website_sort_order)||Number(b.monthly_price)||0));
      pricingData[key].plans=list.map((p,i)=>({
        code:p.code,
        name:String(p.name||'').replace(/^DOT\s+(Employer|C\/TPA)\s+/i,'').replace(/^Owner-Operator\s+/i,'') || ['Essential','Professional','Enterprise'][i],
        price:Number(p.monthly_price ?? p.billing_model?.amount ?? 0),
        popular:i===1,
        services:Array.isArray(p.included_services)?p.included_services:[]
      }));
    });
    renderPricing(activeProduct);
  }
  window.addEventListener('s4u:catalog-loaded',e=>applyLiveCatalog(e.detail));
  if(window.S4UDotCatalog)applyLiveCatalog(window.S4UDotCatalog);
})();
