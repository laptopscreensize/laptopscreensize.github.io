/**
 * Header Component — My Screen Size
 * Renders the fixed site header with nav, live indicator, and mobile menu
 */

(function () {
  const NAV_LINKS = [
    { label: 'Detector', href: '/#detector' },
    { label: 'Ruler', href: '/#ruler' },
    { label: 'Breakpoints', href: '/#breakpoints' },
    { label: 'Display', href: '/#colorspace' },
    { label: 'Compare', href: '/#compare' },
    { label: 'FAQ', href: '/#faq' },
  ];

  function renderHeader() {
    const root = document.getElementById('header-root');
    if (!root) return;

    // Build nav items
    const navItems = NAV_LINKS.map(
      ({ label, href }) =>
        `<li><a href="${href}">${label}</a></li>`
    ).join('');

    const mobileNavItems = NAV_LINKS.map(
      ({ label, href }) =>
        `<a href="${href}" class="mobile-link">${label}</a>`
    ).join('');

    root.innerHTML = `
      <header id="site-header" role="banner" aria-label="Site header">
        <a href="/" class="header-logo" aria-label="My Screen Size Home">
          <div class="logo-icon" aria-hidden="true">⊡</div>
          My Screen Size
        </a>

        <nav aria-label="Main navigation">
          <ul class="header-nav" role="list">${navItems}</ul>
        </nav>

        <div class="header-actions">
          <div class="header-live" aria-label="Live detection active">
            <div class="live-dot" aria-hidden="true"></div>
            <span id="header-res">Live</span>
          </div>
          <button
            class="hamburger"
            id="hamburger"
            aria-label="Toggle mobile menu"
            aria-expanded="false"
            aria-controls="mobile-nav"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <nav
        id="mobile-nav"
        class="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        ${mobileNavItems}
      </nav>
    `;

    initHeader();
  }

  function initHeader() {
    const header = document.getElementById('site-header');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const headerRes = document.getElementById('header-res');

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = ''; s.style.opacity = '';
        });
      });
    });

    // Scroll shadow
    window.addEventListener('scroll', () => {
      header.style.background =
        window.scrollY > 20
          ? 'rgba(8, 12, 24, 0.95)'
          : 'rgba(8, 12, 24, 0.75)';
    }, { passive: true });

    // Live resolution in header
    function updateHeaderRes() {
      if (headerRes) {
        headerRes.textContent = `${screen.width}×${screen.height}`;
      }
    }

    updateHeaderRes();
    window.addEventListener('resize', updateHeaderRes, { passive: true });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${entry.target.id}`
              ? 'var(--text)'
              : '';
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  }

  // Render on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeader);
  } else {
    renderHeader();
  }
})();
