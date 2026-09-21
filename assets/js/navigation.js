(() => {
  "use strict";

  const MOBILE_BREAKPOINT = 1120;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(initNavigation);

  function initNavigation() {
    const navInner = document.getElementById("navInner");
    const nav = document.getElementById("mainNav");
    const toggle = document.getElementById("mobileToggle");

    if (!navInner || !nav || !toggle) {
      console.error("Screenings4U DOT navigation target missing", {
        navInner: !!navInner,
        mainNav: !!nav,
        mobileToggle: !!toggle
      });
      return;
    }

    if (nav.dataset.s4uInitialized === "1") return;
    nav.dataset.s4uInitialized = "1";

    nav.innerHTML = `
      <div class="nav-item"><a class="nav-link" href="index.html#product">Product</a></div>
      <div class="nav-item"><a class="nav-link" href="index.html#solutions">Solutions</a></div>
      <div class="nav-item">
        <a class="nav-link" href="index.html#agencies">DOT Agencies <span class="chevron" aria-hidden="true">▼</span></a>
        <div class="dropdown">
          <a href="fmcsa.html">FMCSA Software</a>
          <a href="faa.html">FAA Software</a>
          <a href="fra.html">FRA Software</a>
          <a href="fta.html">FTA Software</a>
          <a href="phmsa.html">PHMSA Software</a>
          <a href="uscg.html">USCG Software</a>
        </div>
      </div>
      <div class="nav-item"><a class="nav-link" href="ctpa.html">C/TPA Software</a></div>
      <div class="nav-item"><a class="nav-link" href="owner-operator.html">Owner-Operator</a></div>
      <div class="nav-item"><a class="nav-link" href="index.html#demo">Demo</a></div>
      <div class="mobile-nav-actions">
        <a class="btn btn-outline" href="index.html#demo">Request Demo</a>
        <a class="btn btn-orange" href="checkout.html">Start Subscription</a>
      </div>`;

    function setMenu(open) {
      navInner.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.textContent = open ? "✕" : "☰";
      document.body.classList.toggle("s4u-menu-open", open && window.innerWidth <= MOBILE_BREAKPOINT);
      if (!open) closeDropdowns();
    }

    function closeDropdowns(except = null) {
      nav.querySelectorAll(".nav-item.open").forEach(item => {
        if (item !== except) item.classList.remove("open");
      });
    }

    toggle.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!navInner.classList.contains("menu-open"));
    });

    nav.addEventListener("click", event => {
      const link = event.target.closest(".nav-item > .nav-link");
      if (!link || window.innerWidth > MOBILE_BREAKPOINT) return;
      const item = link.closest(".nav-item");
      const dropdown = item?.querySelector(":scope > .dropdown");
      if (!dropdown) {
        setMenu(false);
        return;
      }
      event.preventDefault();
      const willOpen = !item.classList.contains("open");
      closeDropdowns(item);
      item.classList.toggle("open", willOpen);
    });

    document.addEventListener("click", event => {
      if (!navInner.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
    }, { passive: true });

    initScrollTop();
  }

  function initScrollTop() {
    if (document.getElementById("s4uScrollToTop")) return;
    const button = document.createElement("button");
    button.id = "s4uScrollToTop";
    button.className = "s4u-scroll-top";
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"></path><path d="m6 11 6-6 6 6"></path></svg>';
    document.body.appendChild(button);
    const update = () => button.classList.toggle("is-visible", window.scrollY > 500);
    window.addEventListener("scroll", update, { passive: true });
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    update();
  }
})();
