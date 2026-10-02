(function(){
  'use strict';
  const CATALOG='https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/dot-marketing-catalog';

  function money(v){const n=Number(v);return Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n):''}

  async function syncCatalog(){
    const nodes=[...document.querySelectorAll('[data-plan-code]')];
    if(!nodes.length) return;
    try{
      const r=await fetch(CATALOG,{headers:{Accept:'application/json'},cache:'no-store'});
      if(!r.ok) throw new Error('catalog '+r.status);
      const payload=await r.json();
      const plans=Array.isArray(payload?.plans)?payload.plans:Array.isArray(payload?.data?.plans)?payload.data.plans:[];
      const map=new Map(plans.map(p=>[String(p.code||''),p]));
      nodes.forEach(node=>{
        const plan=map.get(String(node.dataset.planCode||''));
        if(!plan) return;
        const price=node.querySelector('[data-plan-price]');
        if(price){
          const fmt=price.dataset.priceFormat||'monthly';
          const val=money(plan.monthly_price ?? plan.price ?? plan.billing_model?.amount);
          price.textContent=fmt==='number'?val:`${val}/mo`;
        }
        const desc=node.querySelector('[data-plan-description]');
        if(desc&&plan.description) desc.textContent=plan.description;
        const link=node.querySelector('a[data-plan-checkout]');
        if(link){
          const code=String(plan.code||'').trim().toLowerCase();
          const q=new URLSearchParams({plan:code});
          if(code.startsWith('dot_ctpa_')) q.set('type','ctpa');
          else if(code.startsWith('owner_operator_')) { q.set('type','owner_operator'); q.set('agency','FMCSA'); }
          else if(code.startsWith('dot_employer_')) q.set('type','employer');
          else {
            const m=code.match(/^dot_(fmcsa|faa|fra|fta|phmsa|uscg)_/);
            if(m){ q.set('type','employer'); q.set('agency',m[1].toUpperCase()); }
          }
          link.href=`checkout.html?${q.toString()}`;
        }
      });
      window.S4UDotCatalog=payload;
      window.dispatchEvent(new CustomEvent('s4u:catalog-loaded',{detail:payload}));
    }catch(err){console.warn('Live DOT catalog unavailable; using page fallback values.',err)}
  }

  function navAccessibility(){
    document.addEventListener('keydown',e=>{
      if(e.key!=='Escape')return;
      document.querySelectorAll('.primary-nav.open,.nav-links.open').forEach(nav=>nav.classList.remove('open'));
      document.querySelectorAll('.nav-toggle[aria-expanded="true"]').forEach(btn=>btn.setAttribute('aria-expanded','false'));
      document.body.classList.remove('nav-open');
      document.querySelectorAll('details[open]').forEach(d=>d.removeAttribute('open'));
    });
  }

  function externalLinks(){
    document.querySelectorAll('a[target="_blank"]').forEach(a=>{
      const rel=new Set(String(a.rel||'').split(/\s+/).filter(Boolean));rel.add('noopener');rel.add('noreferrer');a.rel=[...rel].join(' ');
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{syncCatalog();navAccessibility();externalLinks()},{once:true});
  else {syncCatalog();navAccessibility();externalLinks()}
})();
