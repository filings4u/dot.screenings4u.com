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

async function initPricing(root){
  const plans = {
    employer:{label:'DOT Employer',plans:[['Essential',85,'Core DOT workforce administration for smaller organizations.'],['Professional',145,'Expanded administration, locations and reporting for growing DOT workforces.'],['Enterprise',245,'Advanced controls, integrations and audit visibility for larger operations.']],features:[
      ['Employee / driver records',[1,1,1]],['DOT programs',[1,1,1]],['Pools',[1,1,1]],['Random selections',[1,1,1]],['Testing workflows',[1,1,1]],['Results and documents',[1,1,1]],['Operational reports',[1,1,1]],['Notifications',[1,1,1]],['Locations',[0,1,1]],['Advanced reporting',[0,1,1]],['User roles',[0,1,1]],['Integrations',[0,0,1]],['Audit history',[0,0,1]],['White label',[0,0,1]],['Enterprise administration',[0,0,1]]
    ]},
    owner:{label:'Owner-Operator',plans:[['Essential',45,'A focused compliance workspace for a single-driver business.'],['Plus',125,'More workflow visibility and program tools for an owner-operator.'],['Complete',225,'A broader software package with deeper records and reporting.']],features:[
      ['Single-driver profile',[1,1,1]],['DOT program workspace',[1,1,1]],['Random pool participation',[1,1,1]],['Testing records',[1,1,1]],['Results and documents',[1,1,1]],['Compliance history',[1,1,1]],['Notifications',[0,1,1]],['Expanded reporting',[0,1,1]],['Document organization',[0,1,1]],['Priority support',[0,0,1]],['Advanced workflow tools',[0,0,1]],['Audit history',[0,0,1]]
    ]},
    ctpa:{label:'C/TPA',plans:[['Essential',125,'Core software for managing a growing client portfolio.'],['Professional',225,'Expanded portfolio administration, reporting and delivery tools.'],['Enterprise',375,'Advanced C/TPA operations with branding and broader controls.']],features:[
      ['Employer portfolio management',[1,1,1]],['Covered worker records',[1,1,1]],['Consortium pools',[1,1,1]],['Random selections',[1,1,1]],['Testing oversight',[1,1,1]],['Portfolio reporting',[1,1,1]],['Client billing workflows',[0,1,1]],['Employer portal delivery',[0,1,1]],['Advanced reports',[0,1,1]],['White label',[0,0,1]],['Branded email',[0,0,1]],['Team administration',[0,0,1]]
    ]}
  };

  try{
    const r=await fetch('https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/dot-public-catalog');
    const live=await r.json();
    if(r.ok&&!live.error){
      const groups={employer:['dot_fmcsa_essential','dot_fmcsa_professional','dot_fmcsa_enterprise'],owner:['owner_operator_essential','owner_operator_plus','owner_operator_complete'],ctpa:['dot_ctpa_essential','dot_ctpa_professional','dot_ctpa_enterprise']};
      const audience={employer:'employer',owner:'owner_operator',ctpa:'ctpa'};
      for(const k of Object.keys(groups)){
        const ps=groups[k].map(code=>(live.plans||[]).find(x=>x.code===code)).filter(Boolean);
        if(ps.length===3){
          const avail=f=>audience[k]==='ctpa'?f.ctpa_available:audience[k]==='owner_operator'?f.owner_operator_available:f.employer_available;
          const features=(live.features||[]).filter(avail).map(f=>[f.name,ps.map(pl=>(live.plan_features||[]).some(x=>x.plan_id===pl.id&&x.feature_id===f.id&&x.enabled)?1:0)]);
          plans[k]={label:k==='employer'?'DOT Employer':k==='owner'?'Owner-Operator':'C/TPA',plans:ps.map(pl=>[pl.name.replace(/^(FMCSA DOT|DOT C\/TPA|Owner-Operator)\s+/i,''),Number(pl.monthly_price||0),pl.description||'']),features};
        }
      }
    }
  }catch(e){console.warn('Using embedded DOT pricing fallback.',e)}
  let selectedAgency='FMCSA';
  let type = root.dataset.pricingType || 'employer';
  let mobilePlan = 0;
  const tabs = root.querySelectorAll('[data-pricing-tab]');
  tabs.forEach(btn=>btn.addEventListener('click',()=>{type=btn.dataset.pricingTab;mobilePlan=0;render()}));
  const agencyBox=document.createElement('div');agencyBox.className='pricing-agency-select';agencyBox.innerHTML='<label for="dotAgencyChoice"><strong>DOT agency</strong></label><select id="dotAgencyChoice"><option>FMCSA</option><option>FAA</option><option>FTA</option><option>FRA</option><option>PHMSA</option><option>USCG</option></select>';tabs[0]?.parentElement?.after(agencyBox);agencyBox.querySelector('select').addEventListener('change',e=>selectedAgency=e.target.value);

  function checkoutHref(plan){
    const page=(document.body.dataset.page||'').toLowerCase();
    const agencies={fmcsa:'FMCSA',faa:'FAA',fra:'FRA',fta:'FTA',phmsa:'PHMSA',uscg:'USCG'};
    const agency=type==='ctpa'?'CTPA':(agencies[page]||selectedAgency);
    const q=new URLSearchParams({type,plan:plan.toLowerCase()});
    if(agency) q.set('agency',agency);
    return `checkout.html?${q.toString()}`;
  }

  function render(){
    const cfg=plans[type] || plans.employer;
    agencyBox.style.display=type==='employer'?'flex':'none';
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
}
