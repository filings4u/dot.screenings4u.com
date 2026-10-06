(()=>{
'use strict';
const SITE_KEY='0x4AAAAAAE4-F43E-viFsKat';
const buttons=[...document.querySelectorAll('[data-login-url]')];
const status=document.getElementById('hubSecurityStatus');
let verified=false,widget=null;
const allowedHost=/^(?:[a-z0-9-]+\.)*screenings4u\.com$/i;
function safeUrl(raw){
  try{
    const u=new URL(String(raw||''));
    if(u.protocol!=='https:'||!allowedHost.test(u.hostname))return null;
    if(u.hostname==='dot.screenings4u.com'&&u.pathname==='/')return u.href;
    return u.pathname.endsWith('/login.html')?u.href:null;
  }catch{return null}
}
function sync(){
  buttons.forEach(btn=>{
    const valid=!!safeUrl(btn.dataset.loginUrl);
    btn.disabled=!verified||!valid;
    btn.setAttribute('aria-disabled',String(btn.disabled));
  });
}
buttons.forEach(btn=>btn.addEventListener('click',()=>{
  if(!verified)return;
  const u=safeUrl(btn.dataset.loginUrl);
  if(u)location.assign(u);
}));
function mount(){
  if(!window.turnstile||widget!==null)return;
  widget=window.turnstile.render('#turnstileHub',{
    sitekey:SITE_KEY,
    action:'dot_login_hub',
    theme:'auto',
    size:'flexible',
    callback:t=>{
      verified=!!String(t||'');
      if(status)status.textContent=verified?'Security check complete. Choose your portal.':'Waiting for security verification…';
      sync();
    },
    'expired-callback':()=>{
      verified=false;
      if(status)status.textContent='Security check expired. Complete it again.';
      sync();
    },
    'error-callback':()=>{
      verified=false;
      if(status)status.textContent='Security check could not load. Refresh the page and try again.';
      sync();
      return true;
    }
  });
}
(function wait(){if(window.turnstile)mount();else setTimeout(wait,80)})();
sync();
})();
