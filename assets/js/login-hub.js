(()=>{
const portals={
  ctpa:'https://ctpa-dot.screenings4u.com/login.html',
  fmcsa:'https://fmcsa-dot.screenings4u.com/login.html',
  faa:'https://faa-dot.screenings4u.com/login.html',
  fra:'https://fra-dot.screenings4u.com/login.html',
  fta:'https://fta-dot.screenings4u.com/login.html',
  phmsa:'https://phmsa-dot.screenings4u.com/login.html',
  uscg:'https://uscg-dot.screenings4u.com/login.html',
  employer_fmcsa:'https://employer-dot.screenings4u.com/login.html',
  employer_faa:'https://employer-faa-dot.screenings4u.com/login.html',
  employer_fra:'https://employer-fra-dot.screenings4u.com/login.html',
  employer_fta:'https://employer-fta-dot.screenings4u.com/login.html',
  employer_phmsa:'https://employer-phmsa-dot.screenings4u.com/login.html',
  employer_uscg:'https://employer-uscg-dot.screenings4u.com/login.html',
  employee_fmcsa:'https://employee-dot.screenings4u.com/login.html',
  employee_faa:'https://employee-faa-dot.screenings4u.com/login.html',
  employee_fra:'https://employee-fra-dot.screenings4u.com/login.html',
  employee_fta:'https://employee-fta-dot.screenings4u.com/login.html',
  employee_phmsa:'https://employee-phmsa-dot.screenings4u.com/login.html',
  employee_uscg:'https://employee-uscg-dot.screenings4u.com/login.html',
  driver_fmcsa:'https://driver-dot.screenings4u.com/login.html'
};
const SITE_KEY='0x4AAAAAAE4-F43E-viFsKat';
const buttons=[...document.querySelectorAll('[data-login-portal]')],status=document.getElementById('hubSecurityStatus');
let token='',widget=null;
const sync=()=>buttons.forEach(b=>{b.disabled=!token;b.setAttribute('aria-disabled',String(!token))});
buttons.forEach(btn=>btn.addEventListener('click',()=>{if(!token)return;const u=portals[btn.dataset.loginPortal];if(u)location.href=u;}));
function mount(){if(!window.turnstile||widget!==null)return;widget=window.turnstile.render('#turnstileHub',{sitekey:SITE_KEY,action:'dot_login_hub',theme:'auto',size:'flexible',callback:t=>{token=String(t||'');if(status)status.textContent='Security check complete. Choose your portal.';sync();},'expired-callback':()=>{token='';if(status)status.textContent='Security check expired. Complete it again.';sync();},'error-callback':()=>{token='';if(status)status.textContent='Security check could not load. Refresh the page and try again.';sync();return true;}})}
(function wait(){if(window.turnstile)mount();else setTimeout(wait,80)})();sync();
})();
