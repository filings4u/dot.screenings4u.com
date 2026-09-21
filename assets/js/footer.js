document.addEventListener("DOMContentLoaded", initS4UDotFooter);

function initS4UDotFooter() {
  const target = document.getElementById("siteFooter");
  if (!target) return;

  const hasPageCTA = !!document.querySelector(
    "main .demo-section, main .cta, main [class*='final-cta'], main [class*='closing-cta']"
  );

  const cta = hasPageCTA
    ? ""
    : `
      <div class="container footer-cta">
        <div class="footer-cta-copy">
          <span class="footer-cta-label">DOT Workforce Software</span>
          <strong>Run your DOT program from one connected platform.</strong>
          <p>Explore software for regulated employers, C/TPAs and owner-operators with workflows built around real DOT program operations.</p>
        </div>
        <div class="footer-cta-actions">
          <a class="footer-button footer-button-secondary" href="index.html#demo">Request Demo</a>
          <a class="footer-button footer-button-primary" href="checkout.html">Start Subscription</a>
        </div>
      </div>`;

  target.innerHTML = cta + `
    <div class="container footer-shell">
      <div class="footer-brand-area">
        <a class="footer-brand" href="index.html" aria-label="screenings4u DOT software home">
          <img src="images/logo2.png" alt="screenings4u" class="footer-logo" width="1261" height="237" loading="lazy" decoding="async">
        </a>
        <p class="footer-about">DOT workforce software for regulated employers, owner-operators and C/TPAs. Manage testing, random programs, compliance, documents, reporting and more in one platform.</p>
        <div class="footer-contact">
          <a href="tel:7732457009"><span class="footer-contact-icon" aria-hidden="true">☎</span><span>(773) 245-7009</span></a>
          <a href="mailto:support@screenings4u.com"><span class="footer-contact-icon" aria-hidden="true">✉</span><span>support@screenings4u.com</span></a>
        </div>
        <span class="footer-availability">Software support nationwide</span>
      </div>

      <nav class="footer-links-grid" aria-label="Footer navigation">
        <div class="footer-col">
          <h4>Product</h4>
          <a href="index.html#product">Platform Overview</a>
          <a href="index.html#solutions">Software Features</a>
          <a href="index.html#demo">Request a Demo</a>
          <a href="checkout.html">Start Subscription</a>
        </div>

        <div class="footer-col">
          <h4>DOT Agencies</h4>
          <a href="fmcsa.html">FMCSA</a>
          <a href="faa.html">FAA</a>
          <a href="fra.html">FRA</a>
          <a href="fta.html">FTA</a>
          <a href="phmsa.html">PHMSA</a>
          <a href="uscg.html">USCG</a>
        </div>

        <div class="footer-col">
          <h4>Software Solutions</h4>
          <a href="fmcsa.html">DOT Employer Software</a>
          <a href="ctpa.html">C/TPA Software</a>
          <a href="owner-operator.html">Owner-Operator Software</a>
          <a href="index.html#agencies">Agency Solutions</a>
        </div>

        <div class="footer-col">
          <h4>screenings4u</h4>
          <a href="https://screenings4u.com/index.html">Main Website</a>
          <a href="https://screenings4u.com/about-us.html">About Us</a>
          <a href="https://screenings4u.com/contact.html">Contact Us</a>
          <a href="https://screenings4u.com/faqs.html">FAQs</a>
          <a href="mailto:support@screenings4u.com">Software Support</a>
        </div>
      </nav>
    </div>

    <div class="container footer-bottom">
      <div class="footer-bottom-copy">
        <span class="footer-copyright">© <span id="footerYear"></span> screenings4u. All rights reserved.</span>
        <span class="footer-subsidiary">A Subsidiary of <a href="https://www.roselandcompanies.com/" target="_blank" rel="noopener noreferrer">Roseland Companies, LLC</a></span>
      </div>

      <nav class="footer-legal-links" aria-label="Legal links">
        <a href="https://screenings4u.com/terms.html">Terms of Use</a>
        <a href="https://screenings4u.com/privacy.html">Privacy Policy</a>
        <a href="https://screenings4u.com/refund-policy.html">Refund Policy</a>
        <a href="https://screenings4u.com/cookie-policy.html">Cookie Policy</a>
        <a href="https://screenings4u.com/accessibility.html">Accessibility</a>
        <a href="https://screenings4u.com/disclaimer.html">Disclaimer</a>
      </nav>

      <a href="https://screenings4u.com/" class="footer-admin-login">screenings4u.com</a>
    </div>`;

  const y = document.getElementById("footerYear");
  if (y) y.textContent = new Date().getFullYear();
}

window.refreshUniversalFooter = initS4UDotFooter;
