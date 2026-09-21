(() => {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const tabs = [...document.querySelectorAll('.tour-tab')];
  const image = document.getElementById('tourImage');
  const path = document.getElementById('tourPath');
  const panels = [...document.querySelectorAll('.tour-copy-panel')];
  const screens = {
    dashboard: { src: 'assets/images/screens/dashboard.png', alt: 'Screenings4u DOT dashboard', path: 'dashboard' },
    pools: { src: 'assets/images/screens/pools.png', alt: 'Screenings4u DOT consortium pools software', path: 'pools' },
    reports: { src: 'assets/images/screens/reports.png', alt: 'Screenings4u DOT reporting software', path: 'reports' },
    branding: { src: 'assets/images/screens/branding.png', alt: 'Screenings4u DOT white label branding controls', path: 'branding' }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.screen;
      if (!screens[key]) return;
      tabs.forEach(item => {
        item.classList.toggle('active', item === tab);
        item.setAttribute('aria-selected', String(item === tab));
      });
      panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === key));
      image.classList.add('fade');
      setTimeout(() => {
        image.src = screens[key].src;
        image.alt = screens[key].alt;
        path.textContent = screens[key].path;
        image.classList.remove('fade');
      }, 130);
    });
  });
})();
