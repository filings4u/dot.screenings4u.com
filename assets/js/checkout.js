(()=>{
const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBiYXNlIiwicmVmIjoid3llemVzZWJveGJta2Vkd mJteXgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4OTE3Mjg2MiwiZXhwIjoyMTA0NzQ4ODYyfQ.2K26FfRMPBcgIvLw-DKq74zgGEWfWUIgd9ni913Nbag'.replace(/\s+/g,'');
const FEATURE_LABELS={"employee_management":"Employee / driver management","driver_qualification":"Driver qualification tools","bulk_employee_import":"Bulk employee import","team_users":"Team users","locations":"Locations","ders_supervisors":"DER / supervisor tools","post_accident":"Post-accident workflow","action_center":"Action Center","policy_acknowledgments":"Policy acknowledgments","training_records":"Training records","programs":"DOT programs","random_pool":"Random pool management","random_selections":"Random selections","testing_orders":"Testing orders & workflow","collection_sites":"Collection sites","results_summary":"Result summary visibility","results_sensitive":"Sensitive result visibility","compliance":"Compliance management","rtd_follow_up":"Return-to-duty / follow-up","documents":"Documents","standard_reports":"Standard reports","advanced_reports":"Advanced reports","notifications":"Notifications","integrations":"Integrations","branded_email":"Branded email","white_label":"White-label capability","audit_history":"Audit history","employer_management":"Employer management","consortium_pools":"Consortium pools","billing_tools":"Billing tools","client_invoicing":"Client invoicing","customer_portal_delivery":"Customer portal delivery","clearinghouse_tools":"Clearinghouse tools","policy_builder":"Policy builder","employer_settings":"Employer settings","employer_import":"Employer import","enrollment_documents":"Enrollment documents","client_payments":"Client payments","sso":"Single sign-on (SSO)"};
const p=new URLSearchParams(location.search);
const type=(p.get('type')||'employer').toLowerCase();
const plan=(p.get('plan')||'essential').toLowerCase();
const agency=(p.get('agency')||(type==='ctpa'?'CTPA':'FMCSA')).toUpperCase();
const status=document.getElementById('checkout-status');
const payButton=document.getElementById('stripe-pay-button');
const errorBox=document.getElementById('stripe-errors');
const accountLabel=type==='ctpa'?'C/TPA':'DOT Employer';
document.getElementById('order-account').textContent=accountLabel;
document.getElementById('order-agency').textContent=agency==='CTPA'?'Multiple / managed programs':agency;
const code=type==='ctpa'?`dot_ctpa_${plan}`:`dot_${agency.toLowerCase()}_${plan}`;

async function api(path,opts={}){
  const r=await fetch(API+path,{...opts,headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':'Bearer '+ANON,...(opts.headers||{})}});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.error)throw Error(d.error||'Unable to continue checkout.');
  return d;
}
function showError(message){
  status.textContent='Checkout could not be loaded.';
  status.classList.add('checkout-error');
  errorBox.textContent=message||'Unable to load secure checkout.';
  errorBox.hidden=false;
}
function titleCaseCode(code){
  return String(code||'')
    .replace(/_/g,' ')
    .replace(/\b\w/g,m=>m.toUpperCase());
}
function planFeatureList(selected){
  const ordered=Array.isArray(selected.included_services)&&selected.included_services.length
    ? selected.included_services
    : Object.entries(selected.feature_entitlements||{})
        .filter(([,enabled])=>enabled===true)
        .map(([key])=>key);
  return [...new Set(ordered)].map(key=>FEATURE_LABELS[key]||titleCaseCode(key));
}
function renderPlan(selected){
  document.getElementById('order-plan').textContent=selected.name||'Selected plan';
  document.getElementById('order-price').textContent=`$${Number(selected.monthly_price||0).toFixed(0)} / month`;

  const desc=document.getElementById('order-description');
  if(desc) desc.textContent=selected.description||'';

  const details=document.getElementById('order-plan-details');
  if(details){
    const features=planFeatureList(selected);
    details.innerHTML=features.length
      ? features.map(label=>`<li>${label}</li>`).join('')
      : '<li>Plan features are included according to your selected subscription.</li>';
  }

  const notes=[];
  const limit=selected.driver_limit ?? selected.employee_limit;
  if(limit!=null) notes.push(`Up to ${Number(limit).toLocaleString()} employees / drivers`);
  else if(type==='employer') notes.push('Unlimited employees / drivers');

  const frequency=String(selected.billing_frequency||selected.billing_model?.frequency||'monthly');
  notes.push(frequency.charAt(0).toUpperCase()+frequency.slice(1)+' subscription');

  const note=document.getElementById('order-plan-note');
  if(note) note.textContent=notes.join(' • ');
}
async function start(){
  try{
    if(typeof window.Stripe!=='function')throw Error('Stripe.js did not load. Refresh the page and try again.');
    const cat=await api(`/workforce-checkout?surface=dot_marketing&agency=${encodeURIComponent(type==='ctpa'?'CTPA':agency)}`,{method:'GET'});
    const selected=(cat.plans||[]).find(x=>x.code===code);
    if(!selected)throw Error('The selected plan is not currently available.');
    renderPlan(selected);

    status.textContent='Loading secure payment form…';
    const session=await api('/workforce-checkout',{method:'POST',body:JSON.stringify({surface:'dot_marketing',embedded:true,plan_code:code})});
    if(!session.stripe_publishable_key)throw Error('Stripe publishable key is not configured in the checkout service.');
    if(!session.client_secret)throw Error('Stripe did not return a Checkout Session client secret.');

    const stripe=window.Stripe(session.stripe_publishable_key);
    if(typeof stripe.initCheckoutElementsSdk!=='function')throw Error('The loaded Stripe.js version does not support Checkout Elements.');

    const checkout=stripe.initCheckoutElementsSdk({
      clientSecret:session.client_secret,
      elementsOptions:{
        appearance:{
          theme:'stripe',
          variables:{
            colorPrimary:'#ff6b00',
            colorText:'#172033',
            colorBackground:'#ffffff',
            colorDanger:'#b42318',
            borderRadius:'10px',
            fontFamily:'Inter, system-ui, sans-serif'
          }
        }
      }
    });

    const contact=checkout.createContactDetailsElement();
    contact.mount('#stripe-contact-element');
    const payment=checkout.createPaymentElement({layout:'accordion'});
    payment.mount('#stripe-payment-element');

    const loaded=await checkout.loadActions();
    if(loaded.type!=='success')throw Error(loaded.error?.message||'Stripe checkout could not initialize.');
    const actions=loaded.actions;

    checkout.on('change',sessionState=>{
      payButton.disabled=!sessionState.canConfirm;
      const amount=sessionState.total?.total?.amount;
      if(amount!==undefined&&amount!==null){
        const n=Number(amount);
        document.getElementById('order-price').textContent=`$${Number.isInteger(n)?n:n.toFixed(2)} / month`;
      }
    });

    payButton.addEventListener('click',async()=>{
      payButton.disabled=true;
      errorBox.hidden=true;
      status.textContent='Confirming payment securely with Stripe…';
      try{
        const result=await actions.confirm();
        if(result.type==='error'){
          throw Error(result.error?.message||'Payment could not be completed.');
        }
      }catch(err){
        errorBox.textContent=err.message||'Payment could not be completed.';
        errorBox.hidden=false;
        payButton.disabled=false;
        status.textContent='Secure payment powered by Stripe.';
      }
    });

    status.textContent='Secure payment powered by Stripe.';
    payButton.hidden=false;
  }catch(e){
    showError(e.message);
    console.error('screenings4u DOT checkout mount failed',e);
  }
}
start();
})();
