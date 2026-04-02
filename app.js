/**
 * My Screen Size — Main Application
 * All screen/device detection, rendering, and interactivity
 */

'use strict';

/* ============================================================
   UTILITIES
============================================================ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function getAspectRatio(w, h) {
  const d = gcd(w, h);
  const rw = w / d, rh = h / d;
  const common = {
    '16:9': [16, 9], '16:10': [16, 10], '4:3': [4, 3],
    '21:9': [21, 9], '3:2': [3, 2], '1:1': [1, 1], '5:4': [5, 4],
  };
  for (const [label, [a, b]] of Object.entries(common)) {
    if (Math.abs(rw / rh - a / b) < 0.015) return label;
  }
  return `${rw}:${rh}`;
}

function detectOS() {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) return 'macOS';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Linux/.test(ua)) return 'Linux';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  return 'Unknown';
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (/Edg/.test(ua)) return 'Edge';
  if (/OPR|Opera/.test(ua)) return 'Opera';
  if (/Chrome/.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Firefox/.test(ua)) return 'Firefox';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/Chromium/.test(ua)) return 'Chromium';
  return 'Unknown';
}

function detectDeviceType(w, h) {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua) || (w >= 768 && w <= 1366 && 'ontouchstart' in window)) return 'Tablet';
  if (/mobile|android|iphone|ipod/i.test(ua) || w < 768) return 'Mobile';
  if (w >= 2560) return 'Large Monitor';
  if (w >= 1920) return 'Desktop Monitor';
  if (w >= 1280) return 'Laptop/Desktop';
  return 'Laptop';
}

function getDeviceEmoji(type) {
  const map = {
    'Mobile': '📱',
    'Tablet': '📱',
    'Laptop/Desktop': '💻',
    'Laptop': '💻',
    'Desktop Monitor': '🖥️',
    'Large Monitor': '🖥️',
  };
  return map[type] || '💻';
}

function estimateDPI() {
  // Use devicePixelRatio as best estimate
  const base = 96; // CSS standard DPI
  return Math.round(base * window.devicePixelRatio);
}

/* ============================================================
   CANVAS GRID BACKGROUND (Hero)
============================================================ */
function initGridCanvas() {
  const canvas = $('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const size = 48;
    ctx.strokeStyle = 'rgba(99,179,255,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += size) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += size) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Accent dots at intersections
    ctx.fillStyle = 'rgba(0,229,200,0.3)';
    for (let x = 0; x <= canvas.width; x += size) {
      for (let y = 0; y <= canvas.height; y += size) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
}

/* ============================================================
   MAIN SCREEN DETECTION
============================================================ */
let screenData = {};

function detect() {
  const sw = screen.width, sh = screen.height;
  const vw = window.innerWidth, vh = window.innerHeight;
  const ratio = window.devicePixelRatio || 1;
  const realW = Math.round(sw * ratio), realH = Math.round(sh * ratio);
  const dpi = estimateDPI();
  const aspect = getAspectRatio(sw, sh);
  const deviceType = detectDeviceType(sw, sh);
  const os = detectOS();
  const browser = detectBrowser();
  const colorDepth = screen.colorDepth || 24;
  const orientation = window.innerWidth >= window.innerHeight ? 'Landscape' : 'Portrait';
  const touchPoints = navigator.maxTouchPoints || 0;
  const hdr = window.matchMedia('(dynamic-range: high)').matches ? 'Supported' : 'Not Detected';

  screenData = { sw, sh, vw, vh, ratio, realW, realH, dpi, aspect, deviceType, os, browser, colorDepth, orientation, touchPoints, hdr };

  // Hero quick stats
  setText('qs-res', `${sw}×${sh}`);
  setText('qs-dpi', `${dpi}`);
  setText('qs-device', deviceType);

  // Detector section
  setText('d-resolution', `${sw} × ${sh}`);
  setText('d-resolution-sub', `Physical: ${realW} × ${realH} px`);
  setText('d-viewport', `${vw} × ${vh} px`);
  setText('d-dpi', `${dpi} DPI`);
  setText('d-ratio', aspect);
  setText('d-color', `${colorDepth}-bit`);
  setText('d-orient', orientation);
  setText('d-touch', touchPoints > 0 ? `${touchPoints} points` : 'None');
  setText('d-device-type', deviceType);
  setText('d-os', os);
  setText('d-browser', browser);
  setText('d-pixratio', `${ratio}×`);
  setText('d-hdr', hdr);

  // Device icon
  const iconEl = $('device-icon');
  if (iconEl) iconEl.textContent = getDeviceEmoji(deviceType);

  // Res bars
  const maxPx = 4096;
  const barW = $('res-bar-w');
  const barH = $('res-bar-h');
  if (barW) barW.style.width = `${(sw / maxPx) * 80}%`;
  if (barH) barH.style.height = `${(sh / maxPx) * 48}px`;

  // Copy bar
  const copyText = $('copy-text');
  if (copyText) {
    copyText.textContent = `${sw}×${sh} | ${dpi} DPI | ${aspect} | ${deviceType} | ${os} | ${browser}`;
  }

  // Ruler
  updateRuler(vw, vh);

  // Breakpoints
  updateBreakpoints(vw);

  // Comparison
  updateComparison(sw, sh);

  return screenData;
}

/* ============================================================
   COPY TO CLIPBOARD
============================================================ */
function initCopy() {
  const btn = $('copy-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const text = $('copy-text')?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copied!';
      btn.style.color = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy All Stats`;
        btn.style.color = '';
      }, 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = '✓ Copied!';
      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012 2v1"/></svg> Copy All Stats`;
      }, 2000);
    });
  });
}

/* ============================================================
   PHYSICAL SIZE CALCULATOR
============================================================ */
function initPhysicalCalc() {
  const btn = $('phys-calc');
  const input = $('phys-input');
  if (!btn || !input) return;

  function calculate() {
    const diag = parseFloat(input.value);
    if (!diag || diag <= 0) return;
    const { sw, sh } = screenData;
    const ratio = sw / sh;
    const h = Math.sqrt((diag * diag) / (1 + ratio * ratio));
    const w = ratio * h;
    const ppi = Math.round(Math.sqrt(sw * sw + sh * sh) / diag);
    const total = (sw * sh / 1e6).toFixed(2);

    setText('pr-w', `${w.toFixed(2)}"`);
    setText('pr-h', `${h.toFixed(2)}"`);
    setText('pr-ppi', `${ppi} PPI`);
    setText('pr-total', `${total}MP`);
  }

  btn.addEventListener('click', calculate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
}

/* ============================================================
   LIVE RULER
============================================================ */
function updateRuler(vw, vh) {
  setText('ruler-label-h', `${vw}px`);
  setText('ruler-label-v', `${vh}px`);
  setText('ruler-dims', `${vw} × ${vh}`);
}

function initRuler() {
  const area = $('ruler-area');
  const crosshair = $('ruler-crosshair');
  if (!area || !crosshair) return;

  area.addEventListener('mousemove', e => {
    const rect = area.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    crosshair.style.display = 'block';
    crosshair.style.left = `${x}px`;
    crosshair.style.top = `${y}px`;
    const dims = $('ruler-dims');
    if (dims) dims.textContent = `${Math.round(x)} × ${Math.round(y)}`;
  });

  area.addEventListener('mouseleave', () => {
    crosshair.style.display = 'none';
    const { vw, vh } = screenData;
    setText('ruler-dims', `${vw} × ${vh}`);
  });
}

/* ============================================================
   BREAKPOINTS
============================================================ */
const BREAKPOINTS = [
  { name: 'XS', min: 0, max: 479, framework: 'Mobile', color: '#ff4f6e' },
  { name: 'SM', min: 480, max: 639, framework: 'Large Mobile', color: '#f5a623' },
  { name: 'MD', min: 640, max: 767, framework: 'Tailwind SM', color: '#ffd600' },
  { name: 'LG', min: 768, max: 1023, framework: 'Tablet / Bootstrap MD', color: '#00e5c8' },
  { name: 'XL', min: 1024, max: 1279, framework: 'Tailwind LG', color: '#3b8fff' },
  { name: '2XL', min: 1280, max: 1535, framework: 'Bootstrap LG', color: '#7c5cfc' },
  { name: '3XL', min: 1536, max: 1919, framework: 'Tailwind 2XL', color: '#e040fb' },
  { name: '4K+', min: 1920, max: Infinity, framework: '4K & Ultra-wide', color: '#00d68f' },
];

function renderBreakpoints() {
  const grid = $('bp-grid');
  if (!grid) return;
  grid.innerHTML = BREAKPOINTS.map(bp => `
    <div class="bp-chip" data-min="${bp.min}" data-max="${bp.max === Infinity ? 99999 : bp.max}">
      <div class="bp-chip__name">${bp.name}</div>
      <div class="bp-chip__range">${bp.min}px${bp.max === Infinity ? '+' : ` – ${bp.max}px`}</div>
      <div style="font-size:0.7rem;color:var(--text-3);margin-top:2px">${bp.framework}</div>
    </div>
  `).join('');
}

function updateBreakpoints(vw) {
  const chips = $$('.bp-chip');
  let current = null;
  chips.forEach(chip => {
    const min = parseInt(chip.dataset.min);
    const max = parseInt(chip.dataset.max);
    const active = vw >= min && vw <= max;
    chip.classList.toggle('active', active);
    if (active) {
      const name = chip.querySelector('.bp-chip__name')?.textContent;
      const framework = chip.querySelectorAll('div')[2]?.textContent;
      current = `${name} — ${framework} (${vw}px)`;
    }
  });
  setText('bp-current-label', current || `${vw}px`);
}

/* ============================================================
   COLOR SPACE / DISPLAY CAPABILITIES
============================================================ */
function renderColorSpace() {
  const grid = $('cs-grid');
  if (!grid) return;

  const mm = q => window.matchMedia(q).matches;

  const features = [
    { name: 'HDR Display', desc: 'High Dynamic Range support', query: '(dynamic-range: high)', valFn: m => m ? 'HDR Supported' : 'SDR Only' },
    { name: 'P3 Wide Gamut', desc: 'Display P3 color space', query: '(color-gamut: p3)', valFn: m => m ? 'P3 Supported' : 'sRGB Only' },
    { name: 'Rec. 2020', desc: 'Ultra HD color gamut', query: '(color-gamut: rec2020)', valFn: m => m ? 'Rec. 2020 Supported' : 'Not Supported' },
    { name: 'sRGB', desc: 'Standard web color space', query: '(color-gamut: srgb)', valFn: m => m ? 'sRGB Supported' : 'Not Detected' },
    { name: 'Dark Mode', desc: 'System dark theme active', query: '(prefers-color-scheme: dark)', valFn: m => m ? 'Dark Mode On' : 'Light Mode' },
    { name: 'Reduced Motion', desc: 'User prefers less animation', query: '(prefers-reduced-motion: reduce)', valFn: m => m ? 'Reduced' : 'Full Motion OK' },
    { name: 'High Contrast', desc: 'Accessibility contrast mode', query: '(prefers-contrast: high)', valFn: m => m ? 'High Contrast' : 'Normal Contrast' },
    { name: 'Hover Support', desc: 'Pointer hover capability', query: '(hover: hover)', valFn: m => m ? 'Hover: Yes' : 'No Hover (Touch)' },
    { name: 'Fine Pointer', desc: 'Mouse or precision device', query: '(pointer: fine)', valFn: m => m ? 'Fine Pointer' : 'Coarse Pointer' },
    { name: 'Coarse Pointer', desc: 'Touch or imprecise input', query: '(pointer: coarse)', valFn: m => m ? 'Touch Device' : 'Precise Device' },
    { name: 'Retina / HiDPI', desc: '2× or higher pixel ratio', query: '(min-resolution: 192dpi)', valFn: m => m ? 'HiDPI / Retina' : 'Standard DPI' },
    { name: 'Print Media', desc: 'Print stylesheet active', query: 'print', valFn: m => m ? 'Print Mode' : 'Screen Mode' },
  ];

  grid.innerHTML = features.map(f => {
    const matches = mm(f.query);
    return `
      <div class="cs-card">
        <div class="cs-status ${matches ? 'yes' : 'no'}" aria-label="${matches ? 'Supported' : 'Not supported'}"></div>
        <div class="cs-info">
          <div class="cs-name">${f.name}</div>
          <div class="cs-desc">${f.desc}</div>
          <div class="cs-val">${f.valFn(matches)}</div>
        </div>
      </div>
    `;
  }).join('');
}

/* ============================================================
   SCREEN SIZE COMPARISON
============================================================ */
const COMMON_SIZES = [
  { label: 'iPhone SE', res: '375×667' },
  { label: 'iPhone 15 Pro', res: '393×852' },
  { label: 'Samsung Galaxy S24', res: '412×915' },
  { label: 'iPad Mini', res: '768×1024' },
  { label: 'iPad Pro 12.9"', res: '1024×1366' },
  { label: 'MacBook Air 13"', res: '1280×800' },
  { label: 'MacBook Pro 14"', res: '1512×982' },
  { label: 'MacBook Pro 16"', res: '1728×1117' },
  { label: 'HD (720p)', res: '1280×720' },
  { label: 'Full HD (1080p)', res: '1920×1080' },
  { label: '2K QHD', res: '2560×1440' },
  { label: '4K UHD', res: '3840×2160' },
];

function updateComparison(sw, sh) {
  const grid = $('compare-grid');
  if (!grid) return;

  const yourRes = `${sw}×${sh}`;
  const yourPixels = sw * sh;

  const allSizes = [...COMMON_SIZES];
  if (!allSizes.find(s => s.res === yourRes)) {
    allSizes.push({ label: 'Your Screen', res: yourRes });
  }

  // Sort by pixel count
  const parsed = allSizes.map(s => {
    const [w, h] = s.res.split('×').map(Number);
    return { ...s, w, h, pixels: w * h };
  });
  parsed.sort((a, b) => a.pixels - b.pixels);

  const maxPixels = parsed[parsed.length - 1].pixels;

  grid.innerHTML = parsed.map(item => {
    const isYours = item.res === yourRes;
    const pct = Math.max(4, (item.pixels / maxPixels) * 100);
    return `
      <div class="cmp-row${isYours ? ' yours' : ''}">
        <span class="cmp-label">${isYours && item.label !== 'Your Screen' ? `★ ${item.label}` : item.label}</span>
        <div class="cmp-bar-wrap">
          <div class="cmp-bar" style="width:${pct}%"></div>
        </div>
        <span class="cmp-res">${item.res}</span>
      </div>
    `;
  }).join('');

  // Animate bars in when visible
  setTimeout(() => {
    $$('.cmp-bar').forEach(b => { b.style.width = b.style.width; });
  }, 100);
}

/* ============================================================
   FAQ
============================================================ */
const FAQ_DATA = [
  {
    q: 'How does My Screen Size detect my screen resolution?',
    a: 'We use the browser\'s native <code>screen.width</code> and <code>screen.height</code> APIs, which report your actual display resolution. No plugins, no permissions, and no data is sent to any server — everything runs locally in your browser.'
  },
  {
    q: 'What is the difference between screen size and viewport size?',
    a: 'Screen size (or display resolution) is your monitor\'s total pixel dimensions — e.g. 1920×1080. Viewport size is the visible area inside your browser window, which excludes the address bar, toolbars, docked panels, and operating system UI. Viewport changes when you resize your browser; screen size only changes if you adjust display settings.'
  },
  {
    q: 'What does DPI (dots per inch) mean?',
    a: 'DPI — or PPI (pixels per inch) for screens — measures how many pixels fit in one inch of your display. A higher number means a sharper, denser image. Standard monitors are around 96 DPI, while Retina and HiDPI displays often reach 220+ DPI. We estimate DPI from your browser\'s device pixel ratio.'
  },
  {
    q: 'What is device pixel ratio (DPR)?',
    a: 'Device Pixel Ratio (DPR) is the ratio between physical pixels and logical CSS pixels. A DPR of 2 means your screen has 4 physical pixels for every 1 CSS pixel, making images and text sharper. This is how Retina displays work on Apple devices.'
  },
  {
    q: 'What is aspect ratio and why does it matter?',
    a: 'Aspect ratio describes the proportional relationship between width and height. 16:9 is the standard widescreen format used by most monitors, TVs, and laptops. 4:3 is the older square-ish format. 21:9 is used by ultrawide monitors. Knowing your aspect ratio helps with video cropping, game settings, and responsive design.'
  },
  {
    q: 'Is my screen information shared with anyone?',
    a: 'No. All detection is performed client-side in your browser using standard Web APIs. We do not collect, log, or transmit any screen data. There are no analytics scripts, no cookies, and no fingerprinting. Your information stays entirely on your device.'
  },
  {
    q: 'How is physical screen size calculated?',
    a: 'Enter your diagonal screen size in the Physical Size Estimator. Using your resolution and the aspect ratio, we calculate the exact physical width and height using the Pythagorean theorem. We then divide the diagonal pixel count by your diagonal size to compute PPI.'
  },
  {
    q: 'What is a breakpoint in responsive web design?',
    a: 'A breakpoint is a viewport width at which a website\'s layout changes to better fit the screen size. For example, a website might switch from a multi-column layout to a single column layout below 768px. Frameworks like Tailwind CSS and Bootstrap define standard breakpoints like SM, MD, LG, and XL.'
  },
];

function renderFAQ() {
  const list = $('faq-list');
  if (!list) return;

  list.innerHTML = FAQ_DATA.map((item, i) => `
    <div class="faq-item" id="faq-${i}">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${item.q}</span>
        <div class="faq-icon" aria-hidden="true">+</div>
      </div>
      <div class="faq-a" id="faq-a-${i}" role="region">${item.a}</div>
    </div>
  `).join('');

  list.addEventListener('click', e => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const item = q.closest('.faq-item');
    const isOpen = item.classList.toggle('open');
    q.setAttribute('aria-expanded', isOpen);
  });

  list.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const q = e.target.closest('.faq-q');
      if (q) { e.preventDefault(); q.click(); }
    }
  });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  const candidates = [
    '.detector', '.ruler-section', '.breakpoints', '.colorspace',
    '.comparison', '.how', '.faq', '.features',
    '.det-card', '.met-card', '.feat-card', '.how-step',
    '.faq-item', '.cmp-row', '.cs-card', '.bp-chip',
  ];

  const els = $$( candidates.join(',') );
  els.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}

/* ============================================================
   RESIZE & ORIENTATION EVENTS
============================================================ */
function initListeners() {
  let debounce;
  window.addEventListener('resize', () => {
    clearTimeout(debounce);
    debounce = setTimeout(detect, 80);
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(detect, 200);
  }, { passive: true });
}

/* ============================================================
   BOOT
============================================================ */
function init() {
  initGridCanvas();
  renderBreakpoints();
  renderFAQ();
  renderColorSpace();
  detect();
  initPhysicalCalc();
  initCopy();
  initRuler();
  initListeners();
  initScrollReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
