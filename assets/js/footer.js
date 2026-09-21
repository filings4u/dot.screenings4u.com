document.addEventListener("DOMContentLoaded", initS4UFooter);

const S4U_URL_CONFIG_API = 'https://wyezpseboxbmkedvbmyx.supabase.co/functions/v1/workforce-checkout-status';

function s4uLoadUrlConfiguration(){
  if(window.S4UUrlConfigPromise) return window.S4UUrlConfigPromise;
  window.S4UUrlConfigPromise = fetch(S4U_URL_CONFIG_API,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'url_configuration'})
  }).then(async r=>{
    const d=await r.json();
    if(!r.ok||d.error||!d.urls) throw new Error(d.error||'URL configuration unavailable.');
    window.S4UUrlConfig=d.urls;
    return d.urls;
  }).catch(err=>{
    console.warn('screenings4u DOT URL configuration could not be loaded.',err);
    return null;
  });
  return window.S4UUrlConfigPromise;
}

function s4uSafeHref(raw,fallback){
  if(!raw) return fallback;
  const value=String(raw).trim();
  if(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) return value;
  if(/^tel:\+?[0-9]+$/i.test(value)) return value;
  try{
    const u=new URL(value);
    const host=u.hostname.toLowerCase();
    const allowed=host==='screenings4u.com'||host.endsWith('.screenings4u.com')||host==='www.roselandcompanies.com'||host==='roselandcompanies.com';
    return u.protocol==='https:'&&allowed?u.href:fallback;
  }catch{return fallback;}
}

async function initS4UFooter() {
  const target=document.getElementById("siteFooter");
  if(!target) return;

  const urls=await s4uLoadUrlConfiguration();
  const marketing=urls?.marketing_pages||{};
  const legal=urls?.legal_pages||{};
  const sites=urls?.sites||{};
  const contact=urls?.contact_uris||{};
  const M=(key,fallback)=>s4uSafeHref(marketing[key],fallback);
  const L=(key,fallback)=>s4uSafeHref(legal[key],fallback);
  const S=(key,fallback)=>s4uSafeHref(sites[key],fallback);
  const C=(key,fallback)=>s4uSafeHref(contact[key],fallback);
  const home=M('home','index.html');
  const plans=home+(home.includes('#')?'':'#agency-plans');
  const supportUrl=M('contact','contact.html')+(M('contact','contact.html').includes('?')?'&':'?')+'topic=support';

  const hasPageCTA=!!document.querySelector(
    "main .cta, main [class*='final-cta'], main [class*='closing-cta']"
  );

  const cta=hasPageCTA?"":`
      <div class="container footer-cta">
        <div class="footer-cta-copy">
          <span class="footer-cta-label">DOT Program Support</span>
          <strong>Need help choosing the right DOT plan or service?</strong>
          <p>Our team can help with Employer, Owner-Operator, and C/TPA software, DOT agency workflows, testing services, and implementation.</p>
        </div>
        <div class="footer-cta-actions">
          <a class="footer-button footer-button-secondary" href="${M('contact','contact.html')}">Contact Our Team</a>
          <a class="footer-button footer-button-primary" href="${plans}">View DOT Plans</a>
        </div>
      </div>`;

  target.innerHTML=cta+`
      <div class="container footer-shell">
        <div class="footer-brand-area">
          <a class="footer-brand" href="${home}" aria-label="screenings4u DOT home">
            <span class="footer-brand-mark">screenings<span class="four">4</span>u</span>
            <span class="footer-brand-divider" aria-hidden="true"></span>
            <span class="footer-brand-product">DOT</span>
          </a>
          <p class="footer-about">DOT workforce compliance software for Employers, Owner-Operators, and C/TPAs managing regulated program workflows across FMCSA, FAA, FRA, FTA, PHMSA, and USCG.</p>
          <div class="footer-contact">
            <a href="${C('support_phone','tel:7732457009')}"><span class="footer-contact-icon" aria-hidden="true">☎</span><span>(773) 245-7009</span></a>
            <a href="${C('support_email','mailto:support@screenings4u.com')}"><span class="footer-contact-icon" aria-hidden="true">✉</span><span>support@screenings4u.com</span></a>
          </div>
          <span class="footer-availability">Supporting DOT-regulated programs nationwide</span>
        </div>

        <nav class="footer-links-grid" aria-label="Footer navigation">
          <div class="footer-col">
            <h4>DOT Platform</h4>
            <a href="${M('platform','platform.html')}">Platform</a>
            <a href="${M('employers','employers.html')}">Employers</a>
            <a href="${M('owner_operator','owner-operator.html')}">Owner-Operators</a>
            <a href="${M('ctpa','ctpa.html')}">C/TPAs</a>
            <a href="${M('demo','demo.html')}">Request Demo</a>
          </div>

          <div class="footer-col">
            <h4>DOT Agencies</h4>
            <a href="${M('fmcsa','fmcsa.html')}">FMCSA</a>
            <a href="${M('faa','faa.html')}">FAA</a>
            <a href="${M('fra','fra.html')}">FRA</a>
            <a href="${M('fta','fta.html')}">FTA</a>
            <a href="${M('phmsa','phmsa.html')}">PHMSA</a>
            <a href="${M('uscg','uscg.html')}">USCG</a>
          </div>

          <div class="footer-col">
            <h4>Resources</h4>
            <a href="${M('resources','resources.html')}">Resource Center</a>
            <a href="${M('blog','blog.html')}">Blog</a>
            <a href="${M('contact','contact.html')}">Contact Us</a>
            <a href="${supportUrl}">Support</a>
            <a href="${M('login_directory','login.html')}">DOT Sign In</a>
          </div>

          <div class="footer-col">
            <h4>screenings4u Family</h4>
            <a href="${S('screenings4u','https://screenings4u.com/')}" target="_blank" rel="noopener noreferrer">screenings4u.com</a>
            <a href="${S('workforce','https://workforce.screenings4u.com/')}" target="_blank" rel="noopener noreferrer">workforce.screenings4u.com</a>
            <a href="${S('training','https://training.screenings4u.com/')}" target="_blank" rel="noopener noreferrer">training.screenings4u.com</a>
            <a href="${S('dot','https://dot.screenings4u.com/')}">dot.screenings4u.com</a>
          </div>
        </nav>
      </div>

      <div class="container footer-bottom">
        <div class="footer-bottom-copy">
          <span class="footer-copyright">© <span id="footerYear"></span> screenings4u DOT, LLC. All rights reserved.</span>
          <span class="footer-subsidiary">A Subsidiary of <a href="${S('roseland_companies','https://www.roselandcompanies.com/')}" target="_blank" rel="noopener noreferrer">Roseland Companies, LLC</a></span>
        </div>

        <nav class="footer-legal-links" aria-label="Legal links">
          <a href="${L('terms','terms.html')}">Terms of Use</a>
          <a href="${L('privacy','privacy.html')}">Privacy Policy</a>
          <a href="${L('refund_policy','refund-policy.html')}">Refund Policy</a>
          <a href="${L('cookie_policy','cookie-policy.html')}">Cookie Policy</a>
          <a href="${L('accessibility','accessibility.html')}">Accessibility</a>
          <a href="${L('disclaimer','disclaimer.html')}">Disclaimer</a>
        </nav>

        <a href="${M('login_directory','login.html')}" class="footer-admin-login">DOT Sign In</a>
      </div>`;

  const y=document.getElementById("footerYear");
  if(y) y.textContent=new Date().getFullYear();
}

window.refreshUniversalFooter=initS4UFooter;
