(()=>{
const API='https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';
const keyMap={
  ctpa:'ctpa_dot',
  fmcsa:'fmcsa_dot', faa:'faa_dot', fra:'fra_dot', fta:'fta_dot', phmsa:'phmsa_dot', uscg:'uscg_dot',
  employer_fmcsa:'fmcsa_employer_dot', employer_faa:'faa_employer_dot', employer_fra:'fra_employer_dot', employer_fta:'fta_employer_dot', employer_phmsa:'phmsa_employer_dot', employer_uscg:'uscg_employer_dot',
  employee_fmcsa:'fmcsa_employee_dot', employee_faa:'faa_employee_dot', employee_fra:'fra_employee_dot', employee_fta:'fta_employee_dot', employee_phmsa:'phmsa_employee_dot', employee_uscg:'uscg_employee_dot',
  driver_fmcsa:'driver_fmcsa_dot'
};
const SITE_KEY='0x4AAAAAAE4-F43E-viFsKat';
const buttons=[...document.querySelectorAll('[data-login-portal]')],status=document.getElementById('hubSecurityStatus');
let token='',widget=null,endpoints=null,configReady=false;
const allowedHost=/^(?:[a-z0-9-]+\.)*screenings4u\.com$/i;
function safeUrl(raw){try{const u=new URL(String(raw||''));return u.protocol==='https:'&&allowedHost.test(u.hostname)&&u.pathname.endsWith('/login.html')?u.href:null}catch{return null}}
function sync(){buttons.forEach(b=>{const k=keyMap[b.dataset.loginPortal],u=configReady&&endpoints?safeUrl(endpoints[k]):null;const disabled=!token||!u;b.disabled=disabled;b.setAttribute('aria-disabled',String(disabled));})}
async function loadEndpoints(){
  try{
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'url_configuration'})});
    const d=await r.json();
    if(!r.ok||d.error||!d.urls?.portal_login_urls)throw Error(d.error||'Portal configuration unavailable.');
    endpoints=d.urls.portal_login_urls;configReady=true;
    if(status&&!token)status.textContent='Portal directory loaded. Complete the security check to continue.';
  }catch(e){
    configReady=false;endpoints=null;
    if(status)status.textContent='Portal directory is temporarily unavailable. Please try again shortly.';
  }
  sync();
}
buttons.forEach(btn=>btn.addEventListener('click',()=>{
  if(!token||!configReady||!endpoints)return;
  const k=keyMap[btn.dataset.loginPortal],u=safeUrl(endpoints[k]);
  if(u)location.assign(u);
}));
function mount(){if(!window.turnstile||widget!==null)return;widget=window.turnstile.render('#turnstileHub',{sitekey:SITE_KEY,action:'dot_login_hub',theme:'auto',size:'flexible',callback:t=>{token=String(t||'');if(status)status.textContent=configReady?'Security check complete. Choose your portal.':'Security check complete. Loading portal directory…';sync();},'expired-callback':()=>{token='';if(status)status.textContent='Security check expired. Complete it again.';sync();},'error-callback':()=>{token='';if(status)status.textContent='Security check could not load. Refresh the page and try again.';sync();return true;}})}
(function wait(){if(window.turnstile)mount();else setTimeout(wait,80)})();
loadEndpoints();sync();
})();
