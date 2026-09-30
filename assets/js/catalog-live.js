(()=>{
const ENDPOINT='https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/dot-marketing-catalog';
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n||0));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function load(){const r=await fetch(ENDPOINT);if(!r.ok)throw new Error('Catalog unavailable');return r.json()}
function renderPlans(el,plans,aud){const list=plans.filter(p=>p.audience===aud).sort((a,b)=>(a.monthly_price||0)-(b.monthly_price||0));el.innerHTML=list.map((p,i)=>`<article class="price-card ${i===list.length-1?'featured':''}"><div class="kicker">${esc(aud.replace('_',' '))}</div><h3>${esc(p.name.replace(/^DOT\s+/i,''))}</h3><div class="price">${money(p.monthly_price)} <small>/ month</small></div><p class="price-desc">${esc(p.description||'')}</p><ul class="checks">${(p.included_services||[]).slice(0,7).map(x=>`<li>${esc(x.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()))}</li>`).join('')}</ul><a class="btn ${i===list.length-1?'btn-primary':'btn-secondary'}" href="account-creation.html?plan=${encodeURIComponent(p.code)}">Choose plan</a></article>`).join('')||'<p>Plans are being updated.</p>'}
function renderServices(el,services){el.innerHTML=services.slice(0,18).map(s=>`<article class="catalog-card"><span class="category">${esc(s.category)}</span><h3>${esc(s.name)}</h3><p>${esc(s.description||'')}</p><div class="service-price">${s.base_amount==null?'Contact us':new Intl.NumberFormat('en-US',{style:'currency',currency:s.currency||'USD'}).format(s.base_amount)}</div></article>`).join('')}
window.DOTCatalog={load,renderPlans,renderServices};
})();
