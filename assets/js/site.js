(function(){
  document.querySelectorAll('[data-prototype-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const status = form.querySelector('.form-status');
      if(status){status.textContent='Form captured in this static prototype. Connect this form to your production CRM, email, or checkout workflow before launch.';status.classList.add('show');}
    });
  });

  const pricingRoot = document.querySelector('[data-pricing-root]');
  if(pricingRoot){initPricing(pricingRoot)}
})();

function initPricing(root){
  const LIVE_PLAN_API='https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/workforce-checkout';
  const plans = {
    employer:{label:'DOT Employer',plans:[['Essential',85,'Core DOT workforce administration for smaller organizations.','dot_employer_essential'],['Professional',145,'Expanded administration, locations and reporting for growing DOT workforces.','dot_employer_professional'],['Enterprise',245,'Advanced controls, integrations and audit visibility for larger operations.','dot_employer_enterprise']],features:[
      ['Employee / driver records',[1,1,1]],['DOT programs',[1,1,1]],['Pools',[1,1,1]],['Random selections',[1,1,1]],['Testing workflows',[1,1,1]],['Results and documents',[1,1,1]],['Operational reports',[1,1,1]],['Notifications',[1,1,1]],['Locations',[0,1,1]],['Advanced reporting',[0,1,1]],['User roles',[0,1,1]],['Integrations',[0,0,1]],['Audit history',[0,0,1]],['White label',[0,0,1]],['Enterprise administration',[0,0,1]]
    ]},
    owner:{label:'Owner-Operator',plans:[['Essential',45,'A focused compliance workspace for a single-driver business.','owner_operator_essential'],['Plus',125,'More workflow visibility and program tools for an owner-operator.','owner_operator_plus'],['Complete',225,'A broader software package with deeper records and reporting.','owner_operator_complete']],features:[
      ['Single-driver profile',[1,1,1]],['DOT program workspace',[1,1,1]],['Random pool participation',[1,1,1]],['Testing records',[1,1,1]],['Results and documents',[1,1,1]],['Compliance history',[1,1,1]],['Notifications',[0,1,1]],['Expanded reporting',[0,1,1]],['Document organization',[0,1,1]],['Priority support',[0,0,1]],['Advanced workflow tools',[0,0,1]],['Audit history',[0,0,1]]
    ]},
    ctpa:{label:'C/TPA',plans:[['Essential',125,'Core software for managing a growing client portfolio.','dot_ctpa_essential'],['Professional',225,'Expanded portfolio administration, reporting and delivery tools.','dot_ctpa_professional'],['Enterprise',375,'Advanced C/TPA operations with branding and broader controls.','dot_ctpa_enterprise']],features:[
      ['Employer portfolio management',[1,1,1]],['Covered worker records',[1,1,1]],['Consortium pools',[1,1,1]],['Random selections',[1,1,1]],['Testing oversight',[1,1,1]],['Portfolio reporting',[1,1,1]],['Client billing workflows',[0,1,1]],['Employer portal delivery',[0,1,1]],['Advanced reports',[0,1,1]],['White label',[0,0,1]],['Branded email',[0,0,1]],['Team administration',[0,0,1]]
    ]}
  };

  let type = root.dataset.pricingType || 'employer';
  let mobilePlan = 0;
  const tabs = root.querySelectorAll('[data-pricing-tab]');
  const loadedTypes=new Set();
  tabs.forEach(btn=>btn.addEventListener('click',()=>{type=btn.dataset.pricingTab;mobilePlan=0;render();hydrateType(type)}));

  function currentAgency(){
    const page=(document.body.dataset.page||'').toLowerCase();
    const agencies={fmcsa:'FMCSA',faa:'FAA',fra:'FRA',fta:'FTA',phmsa:'PHMSA',uscg:'USCG'};
    return agencies[page]||'';
  }

  function shortName(plan){
    const code=String(plan.code||'').toLowerCase();
    const suffix=code.split('_').pop();
    if(suffix==='essential') return 'Essential';
    if(suffix==='professional') return 'Professional';
    if(suffix==='enterprise') return 'Enterprise';
    if(suffix==='plus') return 'Plus';
    if(suffix==='complete') return 'Complete';
    return String(plan.name||'Plan').replace(/^(DOT\s+)?(FMCSA|FAA|FRA|FTA|PHMSA|USCG|C\/TPA|Employer|Owner-Operator)\s+/i,'').trim()||'Plan';
  }

  async function hydrateType(which){
    const agency=which==='employer'?currentAgency():'';
    const cacheKey=which+'|'+agency;
    if(loadedTypes.has(cacheKey)) return;
    loadedTypes.add(cacheKey);
    const params=new URLSearchParams();
    if(which==='ctpa') params.set('type','ctpa');
    else if(which==='owner') params.set('type','owner_operator');
    else {params.set('type','employer');if(agency)params.set('agency',agency)}
    try{
      const response=await fetch(LIVE_PLAN_API+'?'+params.toString(),{method:'GET',cache:'no-store',headers:{'Accept':'application/json'}});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||data.error||!Array.isArray(data.plans)) throw new Error(data.error||'Plan pricing is unavailable.');
      const cfg=plans[which]||plans.employer;
      const live=data.plans.filter(p=>p&&p.active!==false);
      const order=which==='owner'?['essential','plus','complete']:['essential','professional','enterprise'];
      const mapped=order.map(tier=>live.find(p=>String(p.code||'').toLowerCase().endsWith('_'+tier))).filter(Boolean);
      if(mapped.length){
        cfg.plans=mapped.map(p=>[shortName(p),Number(p.monthly_price||0),p.description||'',p.code]);
        if(type===which)render();
      }
    }catch(err){
      loadedTypes.delete(cacheKey);
      console.warn('Live DOT plan pricing could not be refreshed; existing page values remain visible.',err);
    }
  }

  function checkoutHref(plan){
    const page=(document.body.dataset.page||'').toLowerCase();
    const agencies={fmcsa:'FMCSA',faa:'FAA',fra:'FRA',fta:'FTA',phmsa:'PHMSA',uscg:'USCG'};
    const agency=type==='ctpa'?'CTPA':(agencies[page]||'');
    const code=String((plans[type]||plans.employer).plans.find(p=>p[0]===plan)?.[3]||'');
    const tier=(code.split('_').pop()||plan).toLowerCase();
    const q=new URLSearchParams({type,plan:tier});
    if(agency) q.set('agency',agency);
    return `checkout.html?${q.toString()}`;
  }

  function render(){
    const cfg=plans[type] || plans.employer;
    tabs.forEach(btn=>btn.classList.toggle('active',btn.dataset.pricingTab===type));

    const sticky = root.querySelector('[data-sticky]');
    if(sticky){
      sticky.innerHTML = `<div class="cell"><strong>Plan pricing</strong><span>Stays visible while you compare</span></div>${cfg.plans.map((p,i)=>`<div class="cell"><div class="sticky-plan">${p[0]} ${i===1?'<span class="popular-inline">• Most Popular</span>':''}</div><div class="sticky-price">$${p[1]} <small>/month</small></div></div>`).join('')}`;
    }

    const body = root.querySelector('[data-table-body]');
    const head = root.querySelector('[data-table-head]');
    if(body && head){
      const rows = cfg.features.map(f=>`<tr><th scope="row">${f[0]}</th>${f[1].map(v=>`<td>${v?'<span class="check" aria-label="Included">✓</span>':'<span class="dash" aria-label="Not included">—</span>'}</td>`).join('')}</tr>`).join('');
      const priceRow = `<tr class="comparison-price-row" data-final-price-row><th scope="row">Monthly Price</th>${cfg.plans.map((p,i)=>`<td><div class="price-stack"><strong>$${p[1]}</strong><span>/month</span><a class="btn ${i===1?'btn-primary':'btn-secondary'}" href="${checkoutHref(p[0])}">Choose ${p[0]}</a></div></td>`).join('')}</tr>`;
      body.innerHTML=rows+priceRow;
      head.innerHTML=`<tr><th scope="col">Feature</th>${cfg.plans.map(p=>`<th scope="col">${p[0]}</th>`).join('')}</tr>`;
    }

    renderMobile();
    requestAnimationFrame(bindStickyStop);
  }

  function renderMobile(){
    const cfg=plans[type] || plans.employer;
    const tabsBox=root.querySelector('[data-mobile-tabs]');
    const view=root.querySelector('[data-mobile-view]');
    if(!tabsBox || !view) return;
    const p=cfg.plans[mobilePlan];
    tabsBox.innerHTML=cfg.plans.map((plan,i)=>`<button type="button" class="${i===mobilePlan?'active':''}" data-mobile-plan="${i}"><span>${plan[0]}</span><strong>$${plan[1]}</strong></button>`).join('');
    view.innerHTML=cfg.features.map(f=>`<div class="mobile-feature"><strong>${f[0]}</strong><span>${f[1][mobilePlan]?'✓':'—'}</span></div>`).join('')+`<div class="mobile-price-box" data-mobile-final-price><div class="plan-name">${p[0]}</div><div class="plan-price">$${p[1]} <small>/month</small></div><a class="btn ${mobilePlan===1?'btn-primary':'btn-secondary'}" href="${checkoutHref(p[0])}">Choose ${p[0]}</a></div>`;
    root.querySelectorAll('[data-mobile-plan]').forEach(btn=>btn.addEventListener('click',()=>{mobilePlan=Number(btn.dataset.mobilePlan);renderMobile();requestAnimationFrame(bindStickyStop)}));
  }

  let cleanupSticky=null;
  function bindStickyStop(){
    if(cleanupSticky){cleanupSticky();cleanupSticky=null;}
    const sticky=root.querySelector('[data-sticky]');
    const finalRow=root.querySelector('[data-final-price-row]');
    const mobileTabs=root.querySelector('[data-mobile-tabs]');
    const mobileFinal=root.querySelector('[data-mobile-final-price]');

    const sync=()=>{
      if(window.matchMedia('(max-width:760px)').matches){
        if(mobileTabs && mobileFinal){
          const stop = mobileFinal.getBoundingClientRect().top <= mobileTabs.getBoundingClientRect().bottom + 8;
          mobileTabs.classList.toggle('is-at-bottom',stop);
        }
        return;
      }
      if(sticky && finalRow){
        const stop = finalRow.getBoundingClientRect().top <= sticky.getBoundingClientRect().bottom + 8;
        sticky.classList.toggle('is-at-bottom',stop);
      }
    };
    window.addEventListener('scroll',sync,{passive:true});
    window.addEventListener('resize',sync);
    sync();
    cleanupSticky=()=>{window.removeEventListener('scroll',sync);window.removeEventListener('resize',sync);};
  }

  render();
  hydrateType(type);
}
