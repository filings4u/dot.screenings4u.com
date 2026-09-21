(function(){
  const header = document.querySelector('[data-site-header]');
  if(!header) return;

  const current = document.body.dataset.page || '';
  const link = (href,label,key='') => `<a class="nav-link ${current===key?'active':''}" href="${href}">${label}</a>`;

  header.innerHTML = `
    <header class="site-header">
      <div class="utility-bar">
        <div class="container utility-inner">
          <div class="utility-group"><strong>DOT Compliance Software by screenings4u</strong><span class="utility-dot"></span><span>Built for regulated workforces</span></div>
          <div class="utility-group"><span>Software Sales &amp; Support</span><strong>(773) 245-7009</strong></div>
        </div>
      </div>
      <nav class="main-nav" aria-label="Primary navigation">
        <div class="container nav-inner">
          <a class="brand" href="index.html" aria-label="screenings4u DOT home">
            <span class="brand-mark">screenings<span class="four">4</span>u</span><span class="brand-divider"></span><span>DOT</span>
          </a>
          <button class="mobile-toggle" type="button" aria-expanded="false" aria-controls="primary-links" aria-label="Open navigation"><span class="mobile-toggle-lines"><span></span></span></button>
          <div class="nav-links" id="primary-links">
            ${link('platform.html','Platform','platform')}
            <details class="nav-menu"><summary class="menu-summary">Solutions <span class="chevron"></span></summary><div class="menu-panel"><a href="employers.html">Employers</a><a href="owner-operator.html">Owner-Operators</a><a href="ctpa.html">C/TPAs</a></div></details>
            <details class="nav-menu"><summary class="menu-summary">DOT Agencies <span class="chevron"></span></summary><div class="menu-panel"><a href="fmcsa.html">FMCSA</a><a href="faa.html">FAA</a><a href="fra.html">FRA</a><a href="fta.html">FTA</a><a href="phmsa.html">PHMSA</a><a href="uscg.html">USCG</a></div></details>
            ${link('resources.html','Resources','resources')}
            ${link('blog.html','Blog','blog')}
            <div class="mobile-nav-actions">
              <a class="btn btn-secondary" href="login.html">Sign In</a>
              <a class="btn btn-secondary" href="demo.html">Request Demo</a>
              <a class="btn btn-primary" href="index.html#agency-plans">View Plans</a>
            </div>
          </div>
          <div class="nav-actions">
            <a class="nav-link" href="login.html">Sign In</a>
            <a class="btn btn-secondary" href="demo.html">Request Demo</a>
            <a class="btn btn-primary" href="index.html#agency-plans">View Plans</a>
          </div>
        </div>
      </nav>
    </header>`;

  const toggle = header.querySelector('.mobile-toggle');
  const navLinks = header.querySelector('.nav-links');

  if(toggle && navLinks){
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded','false');
      navLinks.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click',()=>{
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded',String(!open));
      navLinks.classList.toggle('mobile-open',!open);
      document.body.classList.toggle('nav-open',!open);
    });

    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

    window.addEventListener('resize',()=>{
      if(window.matchMedia('(min-width: 1025px)').matches) closeMenu();
    });
  }
})();
