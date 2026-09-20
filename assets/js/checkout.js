
(()=>{
 const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout';
 const KEY='sb_publishable__BLewZS6h2V4yUczky-BTQ_EemiOdDL';
 const p=new URLSearchParams(location.search),id=p.get('plan'),info=window.DOT_PLAN_INDEX?.[id];
 const summary=document.getElementById('planSummary'),form=document.getElementById('checkoutForm'),status=document.getElementById('checkoutStatus');
 if(!info){summary.textContent='The selected plan could not be found.';form.style.display='none';return}
 summary.innerHTML=`<strong>${info.name}</strong> · $${info.price}/month`;
 form.onsubmit=async e=>{e.preventDefault();const btn=form.querySelector('button');btn.disabled=true;status.textContent='Preparing your secure checkout…';
  try{const email=new FormData(form).get('email');const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({plan_id:id,email,account_type:info.account_type})});const d=await r.json();if(!r.ok||d.error)throw new Error(d.error||'Unable to begin checkout.');
   sessionStorage.setItem('dot_checkout_intent',JSON.stringify(d));
   status.innerHTML=`Plan reserved. Reference <strong>${d.reference}</strong>. The Stripe payment surface is connected through the Workforce checkout backend; this page is ready for the secure payment mount.`;
  }catch(err){status.textContent=err.message||'Unable to begin checkout.';btn.disabled=false}
 };
})();
