document.addEventListener("DOMContentLoaded", initS4UFooter);

function initS4UFooter() {
  const target = document.getElementById("siteFooter");

  if (!target) return;

  const hasPageCTA = !!document.querySelector(
    "main .cta, main [class*='final-cta'], main [class*='closing-cta']"
  );

  const cta = hasPageCTA
    ? ""
    : `
      <div class="container footer-cta">

        <div class="footer-cta-copy">
          <span class="footer-cta-label">DOT Program Support</span>

          <strong>Need help choosing the right DOT plan or service?</strong>

          <p>
            Our team can help with Employer, Owner-Operator, and C/TPA software,
            DOT agency workflows, testing services, and implementation.
          </p>
        </div>

        <div class="footer-cta-actions">

          <a
            class="footer-button footer-button-secondary"
            href="contact.html"
          >
            Contact Our Team
          </a>

          <a
            class="footer-button footer-button-primary"
            href="index.html#agency-plans"
          >
            View DOT Plans
          </a>

        </div>

      </div>
    `;

  target.innerHTML =
    cta +
    `
      <div class="container footer-shell">

        <div class="footer-brand-area">

          <a
            class="footer-brand"
            href="index.html"
            aria-label="screenings4u DOT home"
          >
            <span class="footer-brand-mark">screenings<span class="four">4</span>u</span>
            <span class="footer-brand-divider" aria-hidden="true"></span>
            <span class="footer-brand-product">DOT</span>
          </a>

          <p class="footer-about">
            DOT workforce compliance software for Employers, Owner-Operators,
            and C/TPAs managing regulated program workflows across
            FMCSA, FAA, FRA, FTA, PHMSA, and USCG.
          </p>

          <div class="footer-contact">

            <a href="tel:7732457009">
              <span class="footer-contact-icon" aria-hidden="true">☎</span>
              <span>(773) 245-7009</span>
            </a>

            <a href="mailto:support@screenings4u.com">
              <span class="footer-contact-icon" aria-hidden="true">✉</span>
              <span>support@screenings4u.com</span>
            </a>

          </div>

          <span class="footer-availability">
            Supporting DOT-regulated programs nationwide
          </span>

        </div>


        <nav
          class="footer-links-grid"
          aria-label="Footer navigation"
        >

          <div class="footer-col">
            <h4>DOT Platform</h4>

            <a href="platform.html">Platform</a>
            <a href="employers.html">Employers</a>
            <a href="owner-operator.html">Owner-Operators</a>
            <a href="ctpa.html">C/TPAs</a>
            <a href="demo.html">Request Demo</a>
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
            <h4>Resources</h4>

            <a href="resources.html">Resource Center</a>
            <a href="blog.html">Blog</a>
            <a href="contact.html">Contact Us</a>
            <a href="contact.html?topic=support">Support</a>
            <a href="login.html">DOT Sign In</a>
          </div>


          <div class="footer-col">
            <h4>screenings4u Family</h4>

            <a href="https://screenings4u.com/" target="_blank" rel="noopener noreferrer">
              screenings4u.com
            </a>

            <a href="https://workforce.screenings4u.com/" target="_blank" rel="noopener noreferrer">
              workforce.screenings4u.com
            </a>

            <a href="https://training.screenings4u.com/" target="_blank" rel="noopener noreferrer">
              training.screenings4u.com
            </a>

            <a href="https://dot.screenings4u.com/">
              dot.screenings4u.com
            </a>
          </div>

        </nav>

      </div>


      <div class="container footer-bottom">

        <div class="footer-bottom-copy">

          <span class="footer-copyright">
            © <span id="footerYear"></span>
            screenings4u DOT, LLC. All rights reserved.
          </span>

          <span class="footer-subsidiary">
            A Subsidiary of
            <a
              href="https://www.roselandcompanies.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Roseland Companies, LLC
            </a>
          </span>

        </div>


        <nav
          class="footer-legal-links"
          aria-label="Legal links"
        >

          <a href="terms.html">Terms of Use</a>
          <a href="privacy.html">Privacy Policy</a>
          <a href="refund-policy.html">Refund Policy</a>
          <a href="cookie-policy.html">Cookie Policy</a>
          <a href="accessibility.html">Accessibility</a>
          <a href="disclaimer.html">Disclaimer</a>

        </nav>


        <a
          href="login.html"
          class="footer-admin-login"
        >
          DOT Sign In
        </a>

      </div>
    `;

  const y = document.getElementById("footerYear");

  if (y) {
    y.textContent = new Date().getFullYear();
  }
}

window.refreshUniversalFooter = initS4UFooter;
