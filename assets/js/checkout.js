(()=>{
const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBiYXNlIiwicmVmIjoid3llemVzZWJveGJta2Vkd mJteXgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4OTE3Mjg2MiwiZXhwIjoyMTA0NzQ4ODYyfQ.2K26FfRMPBcgIvLw-DKq74zgGEWfWUIgd9ni913Nbag'.replace(/\s+/g,'');
const p=new URLSearchParams(location.search);
const type=(p.get('type')||'employer').toLowerCase();
const plan=(p.get('plan')||'essential').toLowerCase();
const agency=(p.get('agency')||(type==='ctpa'?'CTPA':'FMCSA')).toUpperCase();
const status=document.getElementById('checkout-status');
const payButton=document.getElementById('stripe-pay-button');
const errorBox=document.getElementById('stripe-errors');
const accountLabel=type==='ctpa'?'C/TPA':'DOT Employer';
const firstName=document.getElementById('firstName'),lastName=document.getElementById('lastName'),organizationName=document.getElementById('organizationName'),phone=document.getElementById('phone'),termsAccepted=document.getElementById('termsAccepted'),includes=document.getElementById('order-includes');
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
  errorBox.classList.add('show');
}
async function start(){
  try{
    if(typeof window.Stripe!=='function')throw Error('Stripe.js did not load. Refresh the page and try again.');
    const cat=await api(`/workforce-checkout?surface=dot_marketing&agency=${encodeURIComponent(type==='ctpa'?'CTPA':agency)}`,{method:'GET'});
    const selected=(cat.plans||[]).find(x=>x.code===code);
    if(!selected)throw Error('The selected plan is not currently available.');
    document.getElementById('order-plan').textContent=selected.name;
    document.getElementById('order-price').textContent=`$${Number(selected.monthly_price||0).toFixed(0)} / month`;
    const raw=selected.included_services;let featureList=[];if(Array.isArray(raw))featureList=raw;else if(raw&&typeof raw==='object')featureList=Object.entries(raw).filter(([,v])=>v===true||typeof v==='string').map(([k,v])=>typeof v==='string'?v:k.replaceAll('_',' '));if(!featureList.length&&selected.feature_entitlements&&typeof selected.feature_entitlements==='object')featureList=Object.entries(selected.feature_entitlements).filter(([,v])=>v===true).map(([k])=>k.replaceAll('_',' '));includes.innerHTML=(featureList.slice(0,8).length?featureList.slice(0,8):['DOT program management','Secure records and document workflows','Subscription access to the selected agency portal']).map(x=>`<li>${String(x).replace(/\b\w/g,m=>m.toUpperCase())}</li>`).join('');

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

    let stripeCanConfirm=false;const refreshButton=()=>{payButton.disabled=!(stripeCanConfirm&&termsAccepted.checked&&firstName.value.trim()&&lastName.value.trim()&&organizationName.value.trim());};[firstName,lastName,organizationName,termsAccepted].forEach(el=>el.addEventListener(el.type==='checkbox'?'change':'input',refreshButton));checkout.on('change',sessionState=>{
      stripeCanConfirm=!!sessionState.canConfirm;refreshButton();
      if(sessionState.total?.total?.amount){
        document.getElementById('order-price').textContent=`$${sessionState.total.total.amount} / month`;
      }
    });

    payButton.addEventListener('click',async()=>{
      payButton.disabled=true;
      errorBox.classList.remove('show');
      status.textContent='Confirming payment securely with Stripe…';
      try{
        if(!firstName.value.trim()||!lastName.value.trim()||!organizationName.value.trim())throw Error('Complete your customer information before continuing.');
        if(!termsAccepted.checked)throw Error('Accept the subscription terms before continuing.');
        await api('/workforce-checkout',{method:'POST',body:JSON.stringify({action:'update_checkout_profile',intent_id:session.intent_id,session_id:session.session_id,first_name:firstName.value.trim(),last_name:lastName.value.trim(),organization_name:organizationName.value.trim(),phone:phone.value.trim(),terms_accepted:true})});
        const result=await actions.confirm();
        if(result.type==='error'){
          throw Error(result.error?.message||'Payment could not be completed.');
        }
      }catch(err){
        errorBox.textContent=err.message||'Payment could not be completed.';
        errorBox.classList.add('show');
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
