(()=>{
const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';
const KEY='sb_publishable__BLewZS6h2V4yUczky-BTQ_EemiOdDL';
const forms=document.querySelectorAll('[data-marketing-form]');
if(!forms.length)return;
const clean=(v,n=10000)=>String(v??'').trim().slice(0,n);
forms.forEach(form=>{
  const status=form.querySelector('[data-form-status]');
  const started=Date.now();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    const fd=new FormData(form);
    if(clean(fd.get('company_website'),500)){ if(status)status.textContent='Thank you.'; form.reset(); return; }
    if(Date.now()-started<1800){ if(status)status.textContent='Please review the form and submit again.'; return; }
    const payload={
      action:'marketing_inquiry',
      inquiry_type:clean(form.dataset.marketingForm,20),
      first_name:clean(fd.get('first_name'),100),
      last_name:clean(fd.get('last_name'),100),
      email:clean(fd.get('email'),320).toLowerCase(),
      phone:clean(fd.get('phone'),50)||null,
      company:clean(fd.get('company'),220)||null,
      account_type:clean(fd.get('account_type'),80)||null,
      dot_agency:clean(fd.get('dot_agency'),80)||null,
      existing_customer:fd.get('existing_customer')==='yes' ? true : fd.get('existing_customer')==='no' ? false : null,
      topic:clean(fd.get('topic'),120)||null,
      employee_count:fd.get('employee_count') ? Number(fd.get('employee_count')) : null,
      employer_client_count:fd.get('employer_client_count') ? Number(fd.get('employer_client_count')) : null,
      timeline:clean(fd.get('timeline'),120)||null,
      message:clean(fd.get('message')||fd.get('notes'),10000)||null,
      page_url:location.href.slice(0,2000),
      source:'dot.screenings4u.com'
    };
    if(button)button.disabled=true;
    if(status){status.classList.remove('success','error');status.textContent='Sending…';}
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify(payload)});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||d.error)throw new Error(d.error||'We could not submit your request.');
      form.reset();
      if(status){status.classList.add('success');status.textContent=payload.inquiry_type==='demo'?'Your demo request has been received. Our team will follow up with you.':'Your message has been received. Our team will follow up with you.';}
    }catch(err){
      if(status){status.classList.add('error');status.textContent=err.message||'Unable to submit. Please call (773) 245-7009.';}
    }finally{if(button)button.disabled=false;}
  });
});
})();
