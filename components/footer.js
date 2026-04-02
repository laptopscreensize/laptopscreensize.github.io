/**
 * Footer Component — My Screen Size
 * Renders the site footer with nav links, brand info, and legal
 */

(function () {
  const FOOTER_COLS = [
    {
      title: 'Tools',
      links: [
        { label: 'Screen Detector', href: '#detector' },
        { label: 'Live Ruler', href: '#ruler' },
        { label: 'Breakpoint Tester', href: '#breakpoints' },
        { label: 'Display Capabilities', href: '#colorspace' },
        { label: 'Size Comparison', href: '#compare' },
      ],
    },
    {
      title: 'Learn',
      links: [
        { label: 'How It Works', href: '#how' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Features', href: '#features' },
        { label: 'What is DPI?', href: '#faq' },
        { label: 'Screen Resolutions', href: '#compare' },
      ],
    },
    {
      title: 'Quick Facts',
      links: [
        { label: '1080p = 1920×1080', href: '#compare' },
        { label: '4K = 3840×2160', href: '#compare' },
        { label: 'Retina = 2× DPI', href: '#faq' },
        { label: '16:9 = Widescreen', href: '#faq' },
        { label: 'PPI vs DPI', href: '#faq' },
      ],
    },
  ];

  const TECH_BADGES = ['HTML5', 'CSS3', 'Vanilla JS', 'No Cookies', 'No Tracking'];

  const CURRENT_YEAR = new Date().getFullYear();

  function renderFooter() {
    const root = document.getElementById('footer-root');
    if (!root) return;

    const colsHTML = FOOTER_COLS.map(col => `
      <div class="footer-col">
        <h4>${col.title}</h4>
        <ul>
          ${col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
        </ul>
      </div>
    `).join('');

    const badgesHTML = TECH_BADGES.map(b => `<span class="ft-badge">${b}</span>`).join('');

    root.innerHTML = `
      <footer id="site-footer" role="contentinfo" aria-label="Site footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="#home" class="footer-logo" aria-label="My Screen Size">
                <div class="logo-icon" aria-hidden="true">⊡</div>
                My Screen Size
              </a>
              <p>
                The fastest, most accurate screen size detector on the web.
                100% private — all detection happens in your browser.
              </p>
              <div class="footer-tech" aria-label="Technology badges">
                ${badgesHTML}
              </div>
            </div>
            ${colsHTML}
          </div>

          <div class="footer-bottom">
            <p>© ${CURRENT_YEAR} My Screen Size · <span id="footer-res">—</span> detected</p>
            <div class="footer-bottom-links" role="list" aria-label="Legal links">
              <a href="privacy" role="listitem">Privacy Policy</a>
              <a href="terms" role="listitem">Terms</a>
              <a href="/sitemap.xml" role="listitem">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    `;

    initFooter();
  }

  function initFooter() {
    const footerRes = document.getElementById('footer-res');

    function updateFooterRes() {
      if (footerRes) {
        footerRes.textContent = `${screen.width}×${screen.height}`;
      }
    }

    updateFooterRes();
    window.addEventListener('resize', updateFooterRes, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
  } else {
    renderFooter();
  }
})();
