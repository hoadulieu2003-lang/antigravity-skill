#!/usr/bin/env node
/**
 * ============================================================================
 * ⚡ ANTIGRAVITY 2.0 // AUTOMATED DELIGHT AUDIT TOOL (WP-R3-05)
 * ============================================================================
 * High-Precision Automated Delight & Craftsmanship Score Auditor (Thang điểm 10.0)
 * Evaluates web interfaces across 5 Core Pillars & Multi-Breakpoint Matrix:
 *   - Multi-Breakpoint Matrix: Desktop (1440x900), Tablet (768x1024), Mobile (375x812)
 *   - Zero-Horizontal-Overflow Hard Gating (Mobile & Tablet overflow protection)
 *   - Cumulative Layout Shift (CLS) Continuous Monitoring (PerformanceObserver)
 *   - Pillar 1: 60 FPS Motion & Inertia Smoothness + Layout Stability
 *   - Pillar 2: Mechanical Bottom-Out Press (:active scale(0.965) & translateY(1px))
 *   - Pillar 3: Spotlight Glow & 3D Parallax Tilt (Two-Corner Inversion & z-index guard)
 *   - Pillar 4: WCAG AA/AAA Contrast with Acrylic Alpha-Compositing
 *   - Pillar 5: WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer (setHapticMode, navigator.vibrate)
 *
 * Runs over Chrome CDP (port 9223 default, 9222 fallback) or headless Chrome.
 *
 * Usage:
 *   node scripts/audit_delight_score.js --url <URL> --port <PORT> --threshold 8.5
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------------
// Candidate Puppeteer Resolution
// ----------------------------------------------------------------------------
const candidatePuppeteerPaths = [
  'puppeteer-core',
  'C:/Users/game/node_modules/puppeteer-core',
  'C:/Users/game/cdp_reader/node_modules/puppeteer-core',
  'C:/Users/game/Documents/app/SCRIPT_FACTORY_PRO_ECOSYSTEM/03_CDP_BRIDGE_ORCHESTRATOR/node_modules/puppeteer-core'
];

let puppeteer = null;
for (const p of candidatePuppeteerPaths) {
  try {
    puppeteer = require(p);
    break;
  } catch (_) {}
}

if (!puppeteer) {
  console.error('[FATAL] puppeteer-core module could not be resolved in candidate paths.');
  process.exit(1);
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// ----------------------------------------------------------------------------
// Multi-Breakpoint Matrix Specification (Requirement 1)
// ----------------------------------------------------------------------------
const BREAKPOINTS = {
  desktop: {
    id: 'desktop',
    name: 'Desktop HiDPI',
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  tablet: {
    id: 'tablet',
    name: 'Tablet (iPad)',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  },
  mobile: {
    id: 'mobile',
    name: 'Mobile (iPhone / Android)',
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  }
};

// ----------------------------------------------------------------------------
// Mathematical & Algorithmic Helpers (Exported for Unit Tests)
// ----------------------------------------------------------------------------
function parseRgba(colorStr) {
  if (!colorStr || colorStr === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
  // Hex formats
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1.0
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: +(parseInt(hex.slice(6, 8), 16) / 255).toFixed(3)
      };
    }
  }
  // rgba(r, g, b, a) or rgb(r, g, b)
  const m = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (m) {
    return {
      r: parseFloat(m[1]),
      g: parseFloat(m[2]),
      b: parseFloat(m[3]),
      a: m[4] !== undefined ? parseFloat(m[4]) : 1.0
    };
  }
  return { r: 0, g: 0, b: 0, a: 1.0 };
}

function compositeColor(fg, bg) {
  const alpha = fg.a;
  if (alpha >= 0.999) return { r: fg.r, g: fg.g, b: fg.b, a: 1.0 };
  const r = Math.round(fg.r * alpha + bg.r * (1 - alpha));
  const g = Math.round(fg.g * alpha + bg.g * (1 - alpha));
  const b = Math.round(fg.b * alpha + bg.b * (1 - alpha));
  const a = +(alpha + bg.a * (1 - alpha)).toFixed(3);
  return { r, g, b, a };
}

function sRgbLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const cNorm = c / 255;
    return cNorm <= 0.03928 ? cNorm / 12.92 : Math.pow((cNorm + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(rgb1, rgb2) {
  const l1 = sRgbLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = sRgbLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return +((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function checkTwoCornerInversion({ transform1, transform2, pitch1, pitch2, roll1, roll2 }) {
  // 1. Telemetry inversion
  let telemetryInverted = false;
  if (typeof pitch1 === 'number' && typeof pitch2 === 'number' && pitch1 !== 0 && pitch2 !== 0) {
    if (pitch1 * pitch2 < 0) telemetryInverted = true;
  }
  if (typeof roll1 === 'number' && typeof roll2 === 'number' && roll1 !== 0 && roll2 !== 0) {
    if (roll1 * roll2 < 0) telemetryInverted = true;
  }

  // 2. Parse rotateX and rotateY from transform strings
  const getRotations = (str) => {
    if (!str) return { x: 0, y: 0 };
    const mx = str.match(/rotateX\(\s*([-\d.]+)\s*deg\)/i);
    const my = str.match(/rotateY\(\s*([-\d.]+)\s*deg\)/i);
    return {
      x: mx ? parseFloat(mx[1]) : 0,
      y: my ? parseFloat(my[1]) : 0
    };
  };

  const r1 = getRotations(transform1);
  const r2 = getRotations(transform2);
  let angleInverted = false;
  if ((r1.x !== 0 && r2.x !== 0 && r1.x * r2.x < 0) || (r1.y !== 0 && r2.y !== 0 && r1.y * r2.y < 0)) {
    angleInverted = true;
  }

  // 3. Parse matrix3d
  const parseMatrix3d = (str) => {
    if (!str || !str.includes('matrix3d')) return null;
    const m = str.match(/matrix3d\(([^)]+)\)/);
    if (!m) return null;
    return m[1].split(',').map(v => parseFloat(v.trim()));
  };

  const m1 = parseMatrix3d(transform1);
  const m2 = parseMatrix3d(transform2);
  let matrixInverted = false;
  if (m1 && m2 && m1.length === 16 && m2.length === 16) {
    const val1 = m1[2] || m1[6] || m1[8] || m1[9] || 0;
    const val2 = m2[2] || m2[6] || m2[8] || m2[9] || 0;
    if (val1 !== 0 && val2 !== 0 && val1 * val2 < 0) {
      matrixInverted = true;
    }
  }

  const hasPerspective = (transform1 && (transform1.includes('perspective') || transform1.includes('matrix3d'))) ||
                         (transform2 && (transform2.includes('perspective') || transform2.includes('matrix3d')));

  return hasPerspective && (telemetryInverted || angleInverted || matrixInverted);
}

function isSmallIconButton(rect) {
  if (!rect) return false;
  return rect.width < 32 && rect.height < 32;
}

function matchActiveRule(cssText, ruleType) {
  if (!cssText) return false;
  if (ruleType === 'scale') {
    return /(?:scale(?:3d)?\s*\(\s*(?:0\.96[0-9]*|0\.97))/i.test(cssText);
  }
  if (ruleType === 'translateY') {
    return /(?:translateY\s*\(\s*(?:1|1\.5|2|-1|-1\.5|-2)\s*px|translate\s*\([^,]+,\s*(?:1|1\.5|2|-1|-1\.5|-2)\s*px\))/i.test(cssText);
  }
  return false;
}

/**
 * Requirement 2 Helper: Pure function to check horizontal overflow metrics
 */
function checkHorizontalOverflow(scrollWidth, innerWidth) {
  const hasOverflow = scrollWidth > innerWidth;
  const overflowPx = hasOverflow ? Math.max(0, scrollWidth - innerWidth) : 0;
  return {
    hasOverflow,
    overflowPx,
    scrollWidth,
    innerWidth
  };
}

/**
 * Requirement 2 Helper: Identify elements causing horizontal overflow
 */
function findOffendingOverflowElements(elements, innerWidth) {
  if (!Array.isArray(elements)) return [];
  const offending = [];
  for (const el of elements) {
    const width = el.width !== undefined ? el.width : (el.rect ? el.rect.width : 0);
    const right = el.right !== undefined ? el.right : (el.rect ? el.rect.right : 0);
    const scrollWidth = el.scrollWidth || width;
    const protrusion = Math.max(0, right - innerWidth, width - innerWidth, scrollWidth - innerWidth);
    if (protrusion > 1) { // 1px rounding tolerance
      offending.push({
        selector: el.selector || el.tag || 'unknown',
        tag: el.tag || 'div',
        width: Math.round(width),
        scrollWidth: Math.round(scrollWidth),
        right: Math.round(right),
        overflowPx: Math.round(protrusion)
      });
    }
  }
  return offending.sort((a, b) => b.overflowPx - a.overflowPx);
}

/**
 * Requirement 3 Helper: Evaluate Cumulative Layout Shift (CLS)
 * Standards:
 *   - CLS <= 0.05: EXCELLENT (Tối đa, penalty 0.0)
 *   - 0.05 < CLS <= 0.10: GOOD (Điểm khá, penalty 0.1)
 *   - 0.10 < CLS <= 0.25: NEEDS_IMPROVEMENT (penalty 0.3)
 *   - CLS > 0.25: CRITICAL (Vi phạm nặng, penalty 0.6)
 */
function evaluateClsScore(clsValue) {
  const cls = typeof clsValue === 'number' && !isNaN(clsValue) ? Math.max(0, clsValue) : 0;
  let rating = 'EXCELLENT';
  let penalty = 0.0;
  let status = 'PASS';
  let description = '';

  if (cls <= 0.05) {
    rating = 'EXCELLENT';
    penalty = 0.0;
    status = 'PASS';
    description = `CLS cực thấp (${cls.toFixed(4)} <= 0.05), độ ổn định bố cục đạt mức tối đa.`;
  } else if (cls <= 0.10) {
    rating = 'GOOD';
    penalty = 0.1;
    status = 'PASS';
    description = `CLS ở mức khá (${cls.toFixed(4)} <= 0.10), xuất hiện rung dịch chuyển nhẹ khi tương tác.`;
  } else if (cls <= 0.25) {
    rating = 'NEEDS_IMPROVEMENT';
    penalty = 0.3;
    status = 'WARN';
    description = `CLS cần cải thiện (${cls.toFixed(4)} > 0.10), gây giật gián đoạn trải nghiệm thị giác.`;
  } else {
    rating = 'CRITICAL';
    penalty = 0.6;
    status = 'FAIL';
    description = `CLS vi phạm nặng (${cls.toFixed(4)} > 0.25), bố cục bị xô lệch nghiêm trọng khi render.`;
  }

  return {
    cls: +cls.toFixed(4),
    rating,
    penalty,
    status,
    description
  };
}

/**
 * Requirement 4 Helper: Check WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer
 */
function checkDualHapticSyncer(engine) {
  if (!engine) {
    return {
      isV2: false,
      hasSetHapticMode: false,
      hasVibrateDetection: false,
      scoreFactor: 0
    };
  }
  const isV2 = engine.version === '2.0' || !!engine.isV2 || typeof engine.playRotaryStep === 'function';
  const hasSetHapticMode = typeof engine.setHapticMode === 'function';
  const hasVibrateDetection = engine.hasVibrationSupport !== undefined ||
    engine.isVibrateSupported !== undefined ||
    typeof engine.checkVibrationSupport === 'function';

  let scoreFactor = 0;
  if (isV2) scoreFactor += 0.5;
  if (hasSetHapticMode) scoreFactor += 0.3;
  if (hasVibrateDetection) scoreFactor += 0.2;

  return {
    isV2,
    hasSetHapticMode,
    hasVibrateDetection,
    scoreFactor: Math.min(1.0, scoreFactor)
  };
}

/**
 * Requirement 2 Hard Gating Helper:
 * If horizontal overflow occurs on mobile or tablet, penalize score and enforce FAIL!
 */
function evaluateHardGating({ overallScore, threshold = 8.5, breakpointResults = [] }) {
  let hardGated = false;
  let hardGateReason = null;
  let penalizedScore = overallScore;

  const mobileBp = breakpointResults.find(b => b.id === 'mobile');
  const tabletBp = breakpointResults.find(b => b.id === 'tablet');

  if (mobileBp && mobileBp.hasOverflow) {
    hardGated = true;
    hardGateReason = `TRÀN NGANG TRÊN MOBILE: Màn hình Mobile (375px) bị tràn ngang ${mobileBp.overflowPx}px (scrollWidth: ${mobileBp.scrollWidth}px > innerWidth: ${mobileBp.innerWidth}px)`;
  } else if (tabletBp && tabletBp.hasOverflow) {
    hardGated = true;
    hardGateReason = `TRÀN NGANG TRÊN TABLET: Màn hình Tablet (768px) bị tràn ngang ${tabletBp.overflowPx}px (scrollWidth: ${tabletBp.scrollWidth}px > innerWidth: ${tabletBp.innerWidth}px)`;
  }

  if (hardGated) {
    penalizedScore = Math.min(penalizedScore - 2.5, threshold - 0.5);
    penalizedScore = Math.max(0, +penalizedScore.toFixed(2));
  }

  const verdict = (!hardGated && penalizedScore >= threshold) ? 'PASS' : 'FAIL';

  return {
    hardGated,
    hardGateReason,
    penalizedScore,
    verdict
  };
}

// ----------------------------------------------------------------------------
// CLI Arguments Parsing
// ----------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    url: '',
    port: 9223,
    threshold: 8.5,
    output: '.antigravity/delight_audit_report.json',
    ledger: '.antigravity/delight_audit_ledger.md',
    receipt: '.antigravity/receipts/wp_r3_05.json',
    receiptSpecified: false,
    headless: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--url' && i + 1 < args.length) {
      config.url = args[++i];
    } else if (arg === '--port' && i + 1 < args.length) {
      config.port = parseInt(args[++i], 10);
    } else if (arg === '--threshold' && i + 1 < args.length) {
      config.threshold = parseFloat(args[++i]);
    } else if (arg === '--output' && i + 1 < args.length) {
      config.output = args[++i];
    } else if (arg === '--ledger' && i + 1 < args.length) {
      config.ledger = args[++i];
    } else if (arg === '--receipt' && i + 1 < args.length) {
      config.receipt = args[++i];
      config.receiptSpecified = true;
    } else if (arg === '--headless') {
      config.headless = true;
    } else if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (!config.url && !arg.startsWith('--')) {
      config.url = arg;
    }
  }

  // Default fallback URLs if none specified
  if (!config.url) {
    const showcasePath = 'C:/Users/game/.gemini/exercises/wow_pilot_showcase/index.html';
    if (fs.existsSync(showcasePath)) {
      config.url = 'file:///' + showcasePath.replace(/\\/g, '/');
    } else {
      config.url = 'http://localhost:5173';
    }
  }

  return config;
}

// ----------------------------------------------------------------------------
// Browser CDP Connector
// ----------------------------------------------------------------------------
async function connectOrLaunchBrowser(config) {
  let browser = null;
  let isConnectedRemote = false;

  if (!config.headless) {
    // 1. Try target port
    try {
      console.log(`[CONNECT] Attempting Chrome CDP connection at port ${config.port}...`);
      browser = await puppeteer.connect({
        browserURL: `http://127.0.0.1:${config.port}`,
        defaultViewport: null
      });
      isConnectedRemote = true;
      console.log(`[CONNECT] Successfully attached to live Chrome on port ${config.port}`);
    } catch (err1) {
      console.warn(`[CONNECT] Port ${config.port} unavailable: ${err1.message}`);
      // 2. If target was 9223, try 9222 fallback
      if (config.port === 9223) {
        try {
          console.log(`[CONNECT] Trying fallback CDP port 9222...`);
          browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:9222`,
            defaultViewport: null
          });
          isConnectedRemote = true;
          console.log(`[CONNECT] Successfully attached to fallback Chrome on port 9222`);
        } catch (err2) {
          console.warn(`[CONNECT] Port 9222 fallback unavailable: ${err2.message}`);
        }
      }
    }
  }

  // 3. Fallback to launch headless Chrome if remote connection not established
  if (!browser) {
    console.log(`[CONNECT] Remote CDP unavailable. Launching isolated headless Chrome engine...`);
    if (!fs.existsSync(CHROME_PATH)) {
      throw new Error(`Chrome executable not found at ${CHROME_PATH}`);
    }
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-gpu-rasterization',
        '--enable-webgl',
        '--window-size=1440,900'
      ]
    });
    isConnectedRemote = false;
  }

  return { browser, isConnectedRemote };
}

// ----------------------------------------------------------------------------
// Target Page Navigation & Resolution with CLS Injection
// ----------------------------------------------------------------------------
async function resolvePage(browser, targetUrl, isConnectedRemote) {
  const pages = await browser.pages();
  let targetPage = null;

  if (isConnectedRemote) {
    const normTarget = targetUrl.toLowerCase().replace(/\\/g, '/');
    targetPage = pages.find(p => {
      const u = p.url().toLowerCase().replace(/\\/g, '/');
      return u === normTarget || (normTarget.startsWith('http://localhost') && u.includes('localhost'));
    });
  }

  let createdNew = false;
  if (!targetPage) {
    targetPage = await browser.newPage();
    createdNew = true;
  }

  // Inject Continuous CLS PerformanceObserver on new document
  await targetPage.evaluateOnNewDocument(() => {
    window.__delightClsEntries = [];
    window.__delightTotalCls = 0;
    try {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__delightTotalCls += entry.value;
            window.__delightClsEntries.push({
              value: +entry.value.toFixed(5),
              startTime: +entry.startTime.toFixed(1),
              sources: (entry.sources || []).map(s => {
                let name = 'element';
                try {
                  name = s.node ? (s.node.nodeName || 'element').toLowerCase() : 'element';
                } catch (_) {}
                return {
                  name,
                  currentRect: s.currentRect ? { width: Math.round(s.currentRect.width), height: Math.round(s.currentRect.height) } : null
                };
              })
            });
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      window.__delightClsObserver = observer;
    } catch (e) {
      console.warn('CLS PerformanceObserver init error:', e);
    }
  });

  await targetPage.setViewport({ width: 1440, height: 900 });

  const curUrl = targetPage.url().toLowerCase().replace(/\\/g, '/');
  const wantedUrl = targetUrl.toLowerCase().replace(/\\/g, '/');
  if (curUrl !== wantedUrl && !curUrl.includes(wantedUrl)) {
    console.log(`[NAVIGATE] Loading target URL: ${targetUrl}`);
    await targetPage.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 600));
  } else {
    console.log(`[NAVIGATE] Target page already open: ${targetPage.url()}`);
  }

  await targetPage.bringToFront();

  // Also ensure CLS observer is active if page was already loaded
  await targetPage.evaluate(() => {
    if (window.__delightTotalCls === undefined) {
      window.__delightClsEntries = [];
      window.__delightTotalCls = 0;
      try {
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__delightTotalCls += entry.value;
              window.__delightClsEntries.push({
                value: +entry.value.toFixed(5),
                startTime: +entry.startTime.toFixed(1)
              });
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        window.__delightClsObserver = observer;
      } catch (_) {}
    }

    if (document.documentElement.classList.contains('test-mode')) {
      document.documentElement.classList.remove('test-mode');
      document.documentElement.classList.add('kinetic-mode');
      document.documentElement.setAttribute('data-test-mode', 'false');
    }
  });

  return { page: targetPage, createdNew };
}

// ----------------------------------------------------------------------------
// Requirement 1 & 2: Multi-Breakpoint Matrix & Zero-Horizontal-Overflow Audit
// ----------------------------------------------------------------------------
async function auditMultiBreakpointMatrix(page) {
  console.log('\n--- [MULTI-BREAKPOINT] Auditing Responsive Matrix & Zero-Horizontal-Overflow ---');
  const results = [];

  for (const bp of [BREAKPOINTS.desktop, BREAKPOINTS.tablet, BREAKPOINTS.mobile]) {
    console.log(`[VIEWPORT] Emulating ${bp.name} (${bp.width}x${bp.height}, Touch: ${bp.hasTouch})...`);
    await page.setUserAgent(bp.userAgent);
    await page.setViewport({
      width: bp.width,
      height: bp.height,
      deviceScaleFactor: bp.deviceScaleFactor,
      isMobile: bp.isMobile,
      hasTouch: bp.hasTouch
    });

    // Wait for responsive CSS reflow and media query styles to settle
    await new Promise(r => setTimeout(r, 350));

    // Scroll sequence to test layout stability during scroll & trigger potential dynamic shifts
    await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 150));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 200));

    // Evaluate Zero-Horizontal-Overflow on documentElement & body
    const overflowReport = await page.evaluate((bpInnerWidth) => {
      const docScrollWidth = document.documentElement ? document.documentElement.scrollWidth : 0;
      const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
      const maxScrollWidth = Math.max(docScrollWidth, bodyScrollWidth);
      const innerWidth = window.innerWidth || bpInnerWidth;
      const hasOverflow = maxScrollWidth > innerWidth + 1; // 1px rounding tolerance
      const overflowPx = hasOverflow ? Math.round(maxScrollWidth - innerWidth) : 0;

      const offendingElements = [];
      if (hasOverflow) {
        // Recursive DOM traversal to locate precise elements causing overflow
        function checkNode(node) {
          if (!node || node.nodeType !== 1) return;
          const style = window.getComputedStyle(node);
          if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
            return;
          }
          const rect = node.getBoundingClientRect();
          const nodeScroll = node.scrollWidth;
          const rightProtrusion = rect.right - innerWidth;
          const widthProtrusion = rect.width - innerWidth;
          const scrollProtrusion = nodeScroll - innerWidth;
          const maxProtrusion = Math.max(rightProtrusion, widthProtrusion, scrollProtrusion);

          if (maxProtrusion > 1) {
            let sel = node.tagName.toLowerCase();
            if (node.id) sel += `#${node.id}`;
            else if (node.className && typeof node.className === 'string') {
              const cls = node.className.trim().split(/\s+/).filter(c => c && !c.includes(':') && !c.includes('[')).slice(0, 3).join('.');
              if (cls) sel += `.${cls}`;
            }
            offendingElements.push({
              selector: sel,
              tag: node.tagName.toLowerCase(),
              width: Math.round(rect.width),
              scrollWidth: nodeScroll,
              right: Math.round(rect.right),
              overflowPx: Math.round(maxProtrusion)
            });
          }
          for (const child of node.children) {
            checkNode(child);
          }
        }
        checkNode(document.body || document.documentElement);
      }

      // Deduplicate offenders by selector
      const unique = [];
      const seen = new Set();
      offendingElements.sort((a, b) => b.overflowPx - a.overflowPx);
      for (const item of offendingElements) {
        if (!seen.has(item.selector)) {
          seen.add(item.selector);
          unique.push(item);
        }
      }

      return {
        innerWidth,
        scrollWidth: maxScrollWidth,
        hasOverflow,
        overflowPx,
        offendingElements: unique.slice(0, 6)
      };
    }, bp.width);

    const bpResult = {
      id: bp.id,
      name: bp.name,
      viewport: `${bp.width}x${bp.height}`,
      innerWidth: overflowReport.innerWidth,
      scrollWidth: overflowReport.scrollWidth,
      hasOverflow: overflowReport.hasOverflow,
      overflowPx: overflowReport.overflowPx,
      status: overflowReport.hasOverflow ? 'FAIL' : 'PASS',
      offendingElements: overflowReport.offendingElements
    };

    console.log(`[VIEWPORT RESULT] ${bp.name} (${bp.width}px): ScrollWidth=${bpResult.scrollWidth}px | Overflow=${bpResult.overflowPx}px | Status=${bpResult.status}`);
    results.push(bpResult);
  }

  // Restore Desktop Viewport for the 5 Pillars Audit
  await page.setUserAgent(BREAKPOINTS.desktop.userAgent);
  await page.setViewport({
    width: BREAKPOINTS.desktop.width,
    height: BREAKPOINTS.desktop.height,
    deviceScaleFactor: BREAKPOINTS.desktop.deviceScaleFactor,
    isMobile: BREAKPOINTS.desktop.isMobile,
    hasTouch: BREAKPOINTS.desktop.hasTouch
  });
  await new Promise(r => setTimeout(r, 200));

  const allPassed = results.every(r => !r.hasOverflow);
  const mobileResult = results.find(r => r.id === 'mobile');
  const mobileOverflow = mobileResult ? mobileResult.hasOverflow : false;

  return {
    matrix: results,
    allPassed,
    mobileOverflow
  };
}

// ----------------------------------------------------------------------------
// Requirement 3: Harvest Cumulative Layout Shift (CLS)
// ----------------------------------------------------------------------------
async function harvestClsMetrics(page) {
  const data = await page.evaluate(() => {
    return {
      totalCls: +(window.__delightTotalCls || 0).toFixed(4),
      entriesCount: (window.__delightClsEntries || []).length,
      entries: (window.__delightClsEntries || []).slice(0, 5)
    };
  });
  const evaluation = evaluateClsScore(data.totalCls);
  return {
    ...data,
    ...evaluation
  };
}

// ============================================================================
// PILLAR AUDIT IMPLEMENTATIONS
// ============================================================================

/**
 * Pillar 1: Chuyển động 60 FPS (Đo FPS thực tế, đếm giật khung hình, smooth ratio, layout stability)
 */
async function auditPillar1_Motion60Fps(page, clsMetrics = null) {
  console.log('\n--- [PILLAR 1] Auditing 60 FPS Motion & Inertia Smoothness ---');

  // Start FPS sampler in the page context
  await page.evaluate(() => {
    window.__delightFpsSamples = [];
    window.__delightFpsStop = false;
    let lastTime = performance.now();
    function loop(now) {
      const delta = now - lastTime;
      lastTime = now;
      window.__delightFpsSamples.push(delta);
      if (!window.__delightFpsStop) {
        requestAnimationFrame(loop);
      }
    }
    requestAnimationFrame(loop);
  });

  // Perform dynamic interactions: Inertial scroll sequence & native mouse moves
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy({ top: 120, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 100));
  }
  // Native CDP mouse moves across interactive cards to trigger true :hover animations & GPU work
  for (let x = 150; x <= 850; x += 140) {
    try {
      await page.mouse.move(x, 300);
    } catch (_) {}
    await page.evaluate((px) => {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: px, clientY: 300, bubbles: true }));
    }, x);
    await new Promise(r => setTimeout(r, 60));
  }
  // Scroll back to top
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await new Promise(r => setTimeout(r, 400));

  // Harvest measurements
  const rawMetrics = await page.evaluate(() => {
    window.__delightFpsStop = true;
    const samples = window.__delightFpsSamples.slice(2);
    if (!samples.length) {
      return { totalFrames: 0, avgFps: 60, smoothRatio: 1, jankCount: 0, maxDeltaMs: 16.67 };
    }
    const totalDuration = samples.reduce((a, b) => a + b, 0);
    const avgDelta = totalDuration / samples.length;
    const avgFps = Math.min(60, +(1000 / avgDelta).toFixed(1));
    const jankCount = samples.filter(d => d > 25).length;
    const severeJankCount = samples.filter(d => d > 50).length;
    const smoothFrames = samples.filter(d => d <= 22).length;
    const smoothRatio = +(smoothFrames / samples.length).toFixed(3);
    const maxDeltaMs = +Math.max(...samples).toFixed(1);

    return {
      totalFrames: samples.length,
      avgFps,
      avgDeltaMs: +avgDelta.toFixed(2),
      jankCount,
      severeJankCount,
      smoothRatio,
      maxDeltaMs
    };
  });

  // Incorporate CLS layout stability penalty if present
  let clsPenalty = 0;
  if (clsMetrics) {
    clsPenalty = clsMetrics.penalty;
    rawMetrics.cls = {
      totalCls: clsMetrics.totalCls,
      rating: clsMetrics.rating,
      penalty: clsMetrics.penalty
    };
  }

  // Score calculation (Scale to 2.0 max)
  const fpsFactor = Math.min(1.0, rawMetrics.avgFps / 60.0);
  const smoothFactor = rawMetrics.smoothRatio;
  const jankPenalty = Math.min(0.4, (rawMetrics.jankCount / Math.max(1, rawMetrics.totalFrames)) * 1.5);

  let rawScore = (fpsFactor * 1.2 + smoothFactor * 0.8) - jankPenalty - clsPenalty;
  rawScore = Math.max(0, Math.min(2.0, rawScore));
  const score = +rawScore.toFixed(2);

  const findings = [];
  if (rawMetrics.jankCount > 0) {
    findings.push(`Phát hiện ${rawMetrics.jankCount} khung hình giật (> 25ms, Max: ${rawMetrics.maxDeltaMs}ms).`);
  }
  if (rawMetrics.avgFps < 55) {
    findings.push(`Tốc độ khung hình trung bình ${rawMetrics.avgFps} FPS dưới ngưỡng tối ưu 58 FPS.`);
  }
  if (clsMetrics && clsMetrics.penalty > 0) {
    findings.push(`Biến động bố cục tích lũy CLS (${clsMetrics.totalCls}): ${clsMetrics.description}`);
  }

  const pass = score >= 1.7;
  console.log(`[PILLAR 1 RESULT] Score: ${score}/2.00 | Avg FPS: ${rawMetrics.avgFps} | Smooth Ratio: ${(rawMetrics.smoothRatio * 100).toFixed(1)}% | Jank: ${rawMetrics.jankCount} | CLS: ${clsMetrics ? clsMetrics.totalCls : 'N/A'}`);

  return {
    pillar: 'Pillar 1: Chuyển động 60 FPS (Motion Smoothness)',
    score,
    maxScore: 2.0,
    pass,
    metrics: rawMetrics,
    findings
  };
}

/**
 * Pillar 2: Độ lún cơ học
 * (Quét toàn bộ interactive elements xem có :active scale 0.965 hoặc translateY(1px) cho icon buttons < 32px không)
 */
async function auditPillar2_MechanicalPress(page) {
  console.log('\n--- [PILLAR 2] Auditing Tactile Mechanical Press (:active scale 0.965 & translateY(1px)) ---');

  const analysis = await page.evaluate(() => {
    function getAllRules(node) {
      let rules = [];
      try {
        const list = node.cssRules || [];
        for (const r of list) {
          rules.push(r);
          if (r.cssRules) {
            rules = rules.concat(getAllRules(r));
          }
        }
      } catch (_) {}
      return rules;
    }

    let allRules = [];
    for (const sheet of document.styleSheets) {
      allRules = allRules.concat(getAllRules(sheet));
    }

    let styleTagFallbackText = '';
    for (const s of document.querySelectorAll('style')) {
      styleTagFallbackText += ' ' + s.textContent;
    }

    const scaleRuleSelectors = [];
    const translateYRuleSelectors = [];
    let hasActiveScale0965Rule = false;
    let hasSmallButtonTranslateYRule = false;
    let activeRuleCount = 0;

    const scaleRegex = /(?:scale(?:3d)?\s*\(\s*(?:0\.96[0-9]*|0\.97))/i;
    const translateYRegex = /(?:translateY\s*\(\s*(?:1|1\.5|2|-1|-1\.5|-2)\s*px|translate\s*\([^,]+,\s*(?:1|1\.5|2|-1|-1\.5|-2)\s*px\))/i;

    for (const rule of allRules) {
      if (rule.selectorText && rule.selectorText.includes(':active')) {
        activeRuleCount++;
        const text = rule.cssText;
        if (scaleRegex.test(text)) {
          hasActiveScale0965Rule = true;
          scaleRuleSelectors.push(rule.selectorText);
        }
        if (translateYRegex.test(text)) {
          hasSmallButtonTranslateYRule = true;
          translateYRuleSelectors.push(rule.selectorText);
        }
      }
    }

    if (!hasActiveScale0965Rule && scaleRegex.test(styleTagFallbackText)) {
      hasActiveScale0965Rule = true;
    }
    if (!hasSmallButtonTranslateYRule && translateYRegex.test(styleTagFallbackText)) {
      hasSmallButtonTranslateYRule = true;
    }

    function cleanSelector(sel) {
      return sel.replace(/:active/g, '').replace(/:hover/g, '').replace(/:focus/g, '').trim();
    }

    const selectorList = 'button, a[href], input[type="button"], input[type="submit"], [role="button"], [data-magnetic], .btn, .btn-magnetic';
    const rawElements = Array.from(document.querySelectorAll(selectorList));

    let smallIconButtonsCount = 0;
    let standardButtonsCount = 0;
    let smallButtonsWithShift = 0;
    let standardButtonsWithScale = 0;
    const samples = [];

    rawElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
      if (!isVisible) return;

      const isSmall = rect.width < 32 && rect.height < 32;

      const matchesScale = scaleRuleSelectors.some(sel => {
        try {
          return el.matches(cleanSelector(sel));
        } catch (_) {
          return false;
        }
      });

      const matchesTranslate = translateYRuleSelectors.some(sel => {
        try {
          return el.matches(cleanSelector(sel));
        } catch (_) {
          return false;
        }
      });

      if (isSmall) {
        smallIconButtonsCount++;
        if (matchesTranslate || (matchesScale && hasSmallButtonTranslateYRule)) {
          smallButtonsWithShift++;
        }
      } else {
        standardButtonsCount++;
        if (matchesScale) {
          standardButtonsWithScale++;
        }
      }

      if (samples.length < 8) {
        samples.push({
          tag: el.tagName.toLowerCase(),
          class: (el.className || '').toString().slice(0, 40),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          isSmall,
          tactile: isSmall ? matchesTranslate : matchesScale
        });
      }
    });

    const totalCount = smallIconButtonsCount + standardButtonsCount;
    const totalCovered = smallButtonsWithShift + standardButtonsWithScale;
    const coverageRatio = totalCount > 0 ? +(totalCovered / totalCount).toFixed(3) : 1.0;

    return {
      hasActiveScale0965Rule,
      hasSmallButtonTranslateYRule,
      activeRuleCount,
      scaleRuleSelectors: scaleRuleSelectors.slice(0, 5),
      translateYRuleSelectors: translateYRuleSelectors.slice(0, 5),
      totalInteractiveCount: totalCount,
      smallIconButtonsCount,
      smallButtonsWithShift,
      standardButtonsCount,
      standardButtonsWithScale,
      coverageRatio,
      samples
    };
  });

  let score = 0;
  if (analysis.hasActiveScale0965Rule) score += 0.8;
  if (analysis.hasSmallButtonTranslateYRule || analysis.smallIconButtonsCount === 0) score += 0.4;
  score += +(analysis.coverageRatio * 0.8).toFixed(2);
  score = Math.min(2.0, +score.toFixed(2));

  const findings = [];
  if (!analysis.hasActiveScale0965Rule) {
    findings.push('Thiếu quy tắc CSS cơ học chuẩn `:active scale(0.965)` trong stylesheet.');
  }
  if (analysis.smallIconButtonsCount > 0 && !analysis.hasSmallButtonTranslateYRule) {
    findings.push(`Có ${analysis.smallIconButtonsCount} icon button < 32px nhưng chưa định nghĩa translateY(1px).`);
  }
  if (analysis.coverageRatio < 0.9) {
    findings.push(`Độ phủ lún cơ học chỉ đạt ${(analysis.coverageRatio * 100).toFixed(1)}% (Dưới ngưỡng tối ưu 90%).`);
  }

  const pass = score >= 1.7;
  console.log(`[PILLAR 2 RESULT] Score: ${score}/2.00 | Scale 0.965 Rule: ${analysis.hasActiveScale0965Rule} | Active Rules: ${analysis.activeRuleCount} | Coverage: ${(analysis.coverageRatio * 100).toFixed(1)}%`);

  return {
    pillar: 'Pillar 2: Độ lún cơ học (Mechanical Bottom-Out)',
    score,
    maxScore: 2.0,
    pass,
    metrics: analysis,
    findings
  };
}

/**
 * Pillar 3: Đèn rọi Spotlight & Parallax Tilt 3D
 * (Two-Corner Inversion Test kiểm tra ma trận 3D tilt, kiểm tra --mouse-x/--mouse-y và z-index bảo vệ chữ)
 */
async function auditPillar3_SpotlightAnd3D(page) {
  console.log('\n--- [PILLAR 3] Auditing Spotlight Glow & 3D Parallax Tilt (Two-Corner Inversion) ---');

  try {
    await page.mouse.move(450, 320);
  } catch (_) {}

  const spotlightResult = await page.evaluate(() => {
    const evt = new PointerEvent('pointermove', { clientX: 450, clientY: 320, bubbles: true });
    window.dispatchEvent(evt);
    document.dispatchEvent(evt);

    const rootX = document.documentElement.style.getPropertyValue('--mouse-x') ||
                  document.body?.style.getPropertyValue('--mouse-x') ||
                  window.getComputedStyle(document.documentElement).getPropertyValue('--mouse-x') || '';
    const rootY = document.documentElement.style.getPropertyValue('--mouse-y') ||
                  document.body?.style.getPropertyValue('--mouse-y') ||
                  window.getComputedStyle(document.documentElement).getPropertyValue('--mouse-y') || '';

    const ambientLayer = document.querySelector('.ambient-spotlight-layer, [data-spotlight], .spotlight-monolith');
    const ambientBg = ambientLayer ? window.getComputedStyle(ambientLayer).backgroundImage : '';

    return {
      hasVariables: rootX.includes('450') && rootY.includes('320'),
      rootX,
      rootY,
      hasAmbientLayer: !!ambientLayer,
      hasRadialGradient: ambientBg.includes('radial-gradient')
    };
  });

  const tiltResult = await page.evaluate(async () => {
    const tiltCard = document.querySelector('[data-tilt], .tilt-monolith-stage, .acrylic-card');
    if (!tiltCard) {
      return { found: false, inversionPassed: false };
    }

    const rect = tiltCard.getBoundingClientRect();
    tiltCard.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Corner 1: Top-Left (15% X, 15% Y)
    const c1X = rect.left + rect.width * 0.15;
    const c1Y = rect.top + rect.height * 0.15;
    tiltCard.dispatchEvent(new MouseEvent('mousemove', { clientX: c1X, clientY: c1Y, bubbles: true }));

    await new Promise(r => requestAnimationFrame(r));

    const transformC1 = tiltCard.style.transform || window.getComputedStyle(tiltCard).transform;
    const pitchEl1 = tiltCard.querySelector('[data-tilt-pitch]');
    const rollEl1 = tiltCard.querySelector('[data-tilt-roll]');
    const pitchVal1 = pitchEl1 ? parseFloat(pitchEl1.textContent) : 0;
    const rollVal1 = rollEl1 ? parseFloat(rollEl1.textContent) : 0;

    // Corner 2: Bottom-Right (85% X, 85% Y)
    const c2X = rect.left + rect.width * 0.85;
    const c2Y = rect.top + rect.height * 0.85;
    tiltCard.dispatchEvent(new MouseEvent('mousemove', { clientX: c2X, clientY: c2Y, bubbles: true }));

    await new Promise(r => requestAnimationFrame(r));

    const transformC2 = tiltCard.style.transform || window.getComputedStyle(tiltCard).transform;
    const pitchEl2 = tiltCard.querySelector('[data-tilt-pitch]');
    const rollEl2 = tiltCard.querySelector('[data-tilt-roll]');
    const pitchVal2 = pitchEl2 ? parseFloat(pitchEl2.textContent) : 0;
    const rollVal2 = rollEl2 ? parseFloat(rollEl2.textContent) : 0;

    const telemetryInverted = (pitchVal1 !== 0 && pitchVal2 !== 0 && pitchVal1 * pitchVal2 < 0) ||
                              (rollVal1 !== 0 && rollVal2 !== 0 && rollVal1 * rollVal2 < 0);

    const getAngles = (str) => {
      if (!str) return { x: 0, y: 0 };
      const mx = str.match(/rotateX\(\s*([-\d.]+)\s*deg\)/i);
      const my = str.match(/rotateY\(\s*([-\d.]+)\s*deg\)/i);
      return {
        x: mx ? parseFloat(mx[1]) : 0,
        y: my ? parseFloat(my[1]) : 0
      };
    };

    const a1 = getAngles(transformC1);
    const a2 = getAngles(transformC2);
    const angleInverted = (a1.x !== 0 && a2.x !== 0 && a1.x * a2.x < 0) ||
                          (a1.y !== 0 && a2.y !== 0 && a1.y * a2.y < 0);

    let matrixInverted = false;
    const parseM3D = (str) => {
      const m = str && str.match(/matrix3d\(([^)]+)\)/);
      return m ? m[1].split(',').map(v => parseFloat(v.trim())) : null;
    };
    const m1 = parseM3D(transformC1);
    const m2 = parseM3D(transformC2);
    if (m1 && m2 && m1.length === 16 && m2.length === 16) {
      const v1 = m1[2] || m1[6] || m1[8] || m1[9] || 0;
      const v2 = m2[2] || m2[6] || m2[8] || m2[9] || 0;
      if (v1 !== 0 && v2 !== 0 && v1 * v2 < 0) matrixInverted = true;
    }

    const hasPerspective = (transformC1.includes('perspective') || transformC1.includes('matrix3d')) ||
                           (transformC2.includes('perspective') || transformC2.includes('matrix3d'));

    const inversionPassed = hasPerspective && (telemetryInverted || angleInverted || matrixInverted);

    return {
      found: true,
      hasPerspective,
      transformC1,
      transformC2,
      pitch1: pitchVal1,
      roll1: rollVal1,
      pitch2: pitchVal2,
      roll2: rollVal2,
      telemetryInverted,
      angleInverted,
      matrixInverted,
      inversionPassed
    };
  });

  const zIndexProtection = await page.evaluate(() => {
    const cardInner = document.querySelector('.card-inner, [data-card-inner], .tilt-monolith-stage .card-inner');
    if (!cardInner) {
      const card = document.querySelector('.acrylic-card, [data-tilt]');
      if (!card) return { found: false, passed: false };
      const children = Array.from(card.children);
      const textContainer = children.find(c => {
        const s = window.getComputedStyle(c);
        return (s.position === 'relative' || s.position === 'absolute') && parseInt(s.zIndex, 10) >= 2;
      });
      return {
        found: true,
        passed: !!textContainer,
        position: textContainer ? window.getComputedStyle(textContainer).position : 'static',
        zIndex: textContainer ? window.getComputedStyle(textContainer).zIndex : 'auto'
      };
    }

    const s = window.getComputedStyle(cardInner);
    const zIdx = parseInt(s.zIndex, 10) || 0;
    const passed = (s.position === 'relative' || s.position === 'absolute') && zIdx >= 2;

    return {
      found: true,
      passed,
      position: s.position,
      zIndex: s.zIndex
    };
  });

  let score = 0;
  if (spotlightResult.hasVariables && spotlightResult.hasAmbientLayer) score += 0.7;
  else if (spotlightResult.hasVariables || spotlightResult.hasAmbientLayer) score += 0.4;

  if (tiltResult.found && tiltResult.inversionPassed) score += 0.7;
  else if (tiltResult.found && tiltResult.hasPerspective) score += 0.4;

  if (zIndexProtection.found && zIndexProtection.passed) score += 0.6;
  else if (zIndexProtection.found) score += 0.3;

  score = Math.min(2.0, +score.toFixed(2));

  const findings = [];
  if (!spotlightResult.hasVariables) {
    findings.push('Biến CSS --mouse-x/--mouse-y không cập nhật khi phát sự kiện pointermove.');
  }
  if (!tiltResult.inversionPassed) {
    findings.push('Two-Corner Inversion Test thất bại: Ma trận 3D Tilt không đảo góc phối cảnh giữa 2 góc đối diện.');
  }
  if (!zIndexProtection.passed) {
    findings.push('Card Inner thiếu `position: relative` và `z-index >= 2` để bảo vệ độ tương phản chữ trước ánh đèn rọi.');
  }

  const pass = score >= 1.7;
  console.log(`[PILLAR 3 RESULT] Score: ${score}/2.00 | Spotlight: ${spotlightResult.hasVariables} | Inversion Passed: ${tiltResult.inversionPassed} | Z-Index Guard: ${zIndexProtection.passed}`);

  return {
    pillar: 'Pillar 3: Đèn rọi Spotlight & Parallax Tilt 3D',
    score,
    maxScore: 2.0,
    pass,
    metrics: {
      spotlight: spotlightResult,
      tilt: tiltResult,
      zIndexProtection
    },
    findings
  };
}

/**
 * Pillar 4: Độ tương phản màu sắc WCAG AA (>= 4.5:1) và AAA (>= 7:1)
 * hỗ trợ tính toán alpha-compositing trên nền Acrylic mờ
 */
async function auditPillar4_WcagContrastAndAcrylic(page) {
  console.log('\n--- [PILLAR 4] Auditing WCAG AA (>= 4.5:1) & AAA (>= 7:1) Contrast with Acrylic Alpha-Compositing ---');

  const contrastReport = await page.evaluate(() => {
    function parseRgbaInner(str) {
      if (!str || str === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
      const m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
      if (m) {
        return {
          r: parseFloat(m[1]),
          g: parseFloat(m[2]),
          b: parseFloat(m[3]),
          a: m[4] !== undefined ? parseFloat(m[4]) : 1.0
        };
      }
      return { r: 0, g: 0, b: 0, a: 1.0 };
    }

    function compositeColorsInner(fg, bg) {
      const alpha = fg.a;
      if (alpha >= 0.999) return { r: fg.r, g: fg.g, b: fg.b, a: 1.0 };
      const r = Math.round(fg.r * alpha + bg.r * (1 - alpha));
      const g = Math.round(fg.g * alpha + bg.g * (1 - alpha));
      const b = Math.round(fg.b * alpha + bg.b * (1 - alpha));
      const a = +(alpha + bg.a * (1 - alpha)).toFixed(3);
      return { r, g, b, a };
    }

    function luminanceInner(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function contrastRatioInner(c1, c2) {
      const l1 = luminanceInner(c1.r, c1.g, c1.b);
      const l2 = luminanceInner(c2.r, c2.g, c2.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    let baseCanvasColor = parseRgbaInner(window.getComputedStyle(document.body).backgroundColor);
    if (baseCanvasColor.a === 0) {
      baseCanvasColor = { r: 248, g: 250, b: 252, a: 1.0 }; // Icy Platinum fallback
    }

    function getCompositedBackgroundColor(el) {
      let current = el;
      const layers = [];
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const bg = parseRgbaInner(style.backgroundColor);
        if (bg.a > 0) {
          layers.unshift(bg);
        }
        current = current.parentElement;
      }

      let effective = baseCanvasColor;
      for (const layer of layers) {
        effective = compositeColorsInner(layer, effective);
      }
      return effective;
    }

    const acrylicCards = Array.from(document.querySelectorAll('.acrylic-card, [data-acrylic]'));
    let acrylicHasBlur = false;
    let acrylicHasSpecularBorder = false;

    if (acrylicCards.length > 0) {
      const s = window.getComputedStyle(acrylicCards[0]);
      const bf = s.backdropFilter || s.webkitBackdropFilter || '';
      acrylicHasBlur = bf.includes('blur');
      const hasSpecularRim = !!acrylicCards[0].querySelector('.specular-rim, [data-specular-rim]');
      const hasInsetShadow = s.boxShadow.includes('inset 0 1px');
      const hasTopHighlight = s.borderTopColor.includes('255, 255, 255') || s.borderTopColor.includes('rgb(255');
      acrylicHasSpecularBorder = hasSpecularRim || hasInsetShadow || hasTopHighlight;
    } else {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && rule.selectorText.includes('acrylic')) {
              if (rule.cssText.includes('backdrop-filter') && rule.cssText.includes('blur')) acrylicHasBlur = true;
              if (rule.cssText.includes('inset 0 1px') || rule.cssText.includes('specular')) acrylicHasSpecularBorder = true;
            }
          }
        } catch (_) {}
      }
    }

    const textElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label, code, .telemetry-val, .badge'));
    let aaPassCount = 0;
    let aaaPassCount = 0;
    let totalEvaluated = 0;
    let minContrast = 999;
    let minContrastElement = '';
    const sampleResults = [];

    textElements.forEach(el => {
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2) return;
      const hasDirectText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (!hasDirectText && el.children.length > 0) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.1) return;

      const fg = parseRgbaInner(style.color);
      const bg = getCompositedBackgroundColor(el);
      const effectiveFg = compositeColorsInner(fg, bg);
      const ratio = contrastRatioInner(effectiveFg, bg);

      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight, 10) || 400;
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);

      const passesAA = isLargeText ? ratio >= 3.0 : ratio >= 4.5;
      const passesAAA = isLargeText ? ratio >= 4.5 : ratio >= 7.0;

      totalEvaluated++;
      if (passesAA) aaPassCount++;
      if (passesAAA) aaaPassCount++;

      if (ratio < minContrast) {
        minContrast = ratio;
        minContrastElement = `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 30)} ("${text.slice(0, 20)}")`;
      }

      if (sampleResults.length < 8) {
        sampleResults.push({
          selector: `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 25)}`,
          text: text.slice(0, 25),
          fg: style.color,
          bg: `rgb(${bg.r},${bg.g},${bg.b})`,
          ratio: +ratio.toFixed(2),
          isLargeText,
          passesAA,
          passesAAA
        });
      }
    });

    const aaRatio = totalEvaluated > 0 ? +(aaPassCount / totalEvaluated).toFixed(3) : 1.0;
    const aaaRatio = totalEvaluated > 0 ? +(aaaPassCount / totalEvaluated).toFixed(3) : 1.0;

    return {
      totalEvaluated,
      aaPassCount,
      aaaPassCount,
      aaRatio,
      aaaRatio,
      minContrast: minContrast === 999 ? 0 : +minContrast.toFixed(2),
      minContrastElement,
      acrylicHasBlur,
      acrylicHasSpecularBorder,
      sampleResults
    };
  });

  let score = +(contrastReport.aaRatio * 1.2).toFixed(2);
  score += +(contrastReport.aaaRatio * 0.5).toFixed(2);
  if (contrastReport.acrylicHasBlur && contrastReport.acrylicHasSpecularBorder) score += 0.3;
  else if (contrastReport.acrylicHasBlur || contrastReport.acrylicHasSpecularBorder) score += 0.15;
  score = Math.min(2.0, +score.toFixed(2));

  const findings = [];
  if (contrastReport.aaRatio < 0.95) {
    findings.push(`Tỷ lệ đạt WCAG AA là ${(contrastReport.aaRatio * 100).toFixed(1)}% (Dưới ngưỡng 95%). Min contrast: ${contrastReport.minContrast}:1 tại ${contrastReport.minContrastElement}.`);
  }
  if (!contrastReport.acrylicHasBlur) {
    findings.push('Thẻ Acrylic thiếu thuộc tính `backdrop-filter: blur(...)` mờ quang học.');
  }

  const pass = score >= 1.7;
  console.log(`[PILLAR 4 RESULT] Score: ${score}/2.00 | WCAG AA: ${(contrastReport.aaRatio * 100).toFixed(1)}% | WCAG AAA: ${(contrastReport.aaaRatio * 100).toFixed(1)}% | Acrylic Blur: ${contrastReport.acrylicHasBlur}`);

  return {
    pillar: 'Pillar 4: Độ tương phản màu sắc WCAG AA & AAA trên Acrylic',
    score,
    maxScore: 2.0,
    pass,
    metrics: contrastReport,
    findings
  };
}

/**
 * Pillar 5: Phản hồi âm thanh WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer (Requirement 4)
 * (Kiểm tra sự hiện diện của WebAudioHaptics v2.0, Dual Audio-Haptic Syncer, navigator.vibrate, setHapticMode)
 */
async function auditPillar5_WebAudioHaptics(page) {
  console.log('\n--- [PILLAR 5] Auditing WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer ---');

  const hapticsReport = await page.evaluate(() => {
    // 1. Check Engine Presence & Method Synthesis
    const engine = window.WowEngine?.haptics || window.WebAudioHaptics || window.Haptics || window.haptics;
    let engineExists = !!engine;
    let methodsPassed = 0;
    const requiredWaveforms = ['playClick', 'playPop', 'playDetent', 'playSwitch', 'playChime'];
    const methodResults = {};

    if (engine) {
      for (const m of requiredWaveforms) {
        if (typeof engine[m] === 'function') {
          try {
            engine[m]();
            methodResults[m] = 'PASS';
            methodsPassed++;
          } catch (e) {
            methodResults[m] = `FAIL: ${e.message}`;
          }
        } else {
          methodResults[m] = 'MISSING';
        }
      }
    }

    // 2. Check WebAudioHaptics v2.0 Extended Waveforms
    const v2Waveforms = ['playRotaryStep', 'playDoubleStage', 'playLaser', 'playSubBassDrop', 'playGlassClink'];
    let v2MethodsPassed = 0;
    const v2Results = {};
    if (engine) {
      for (const m of v2Waveforms) {
        if (typeof engine[m] === 'function') {
          try {
            engine[m]();
            v2Results[m] = 'PASS';
            v2MethodsPassed++;
          } catch (_) {
            v2Results[m] = 'FAIL';
          }
        } else {
          v2Results[m] = 'MISSING';
        }
      }
    }

    const versionStr = engine?.version || (v2MethodsPassed >= 2 ? '2.0' : '1.0');
    const isV2 = versionStr.startsWith('2') || v2MethodsPassed >= 2 || !!engine?.isV2;

    // 3. Dual Audio-Haptic Syncer: navigator.vibrate support detection & setHapticMode API
    const syncer = engine?.syncer || window.DualHapticSyncer || window.AudioHapticSyncer || engine;
    const hasSetHapticMode = typeof engine?.setHapticMode === 'function' || typeof syncer?.setHapticMode === 'function';
    
    // Check navigator.vibrate support detection
    const hasVibrateSupportDetection = (
      engine?.hasVibrationSupport !== undefined ||
      engine?.isVibrateSupported !== undefined ||
      syncer?.hasVibrationSupport !== undefined ||
      syncer?.isVibrateSupported !== undefined ||
      typeof engine?.checkVibrationSupport === 'function' ||
      typeof syncer?.checkVibrationSupport === 'function' ||
      (typeof navigator !== 'undefined' && 'vibrate' in navigator)
    );

    let setHapticModeWorks = false;
    let currentHapticMode = 'dual';
    if (hasSetHapticMode) {
      try {
        const setFn = (typeof engine?.setHapticMode === 'function') ? engine.setHapticMode.bind(engine) : syncer.setHapticMode.bind(syncer);
        setFn('dual');
        currentHapticMode = engine?.hapticMode || syncer?.hapticMode || (typeof engine?.getHapticMode === 'function' ? engine.getHapticMode() : 'dual');
        setHapticModeWorks = true;
      } catch (_) {
        setHapticModeWorks = false;
      }
    }

    const dualSyncer = {
      detected: isV2 && (hasSetHapticMode || hasVibrateSupportDetection),
      isV2,
      version: versionStr,
      v2MethodsPassed,
      totalV2Methods: v2Waveforms.length,
      hasSetHapticMode,
      setHapticModeWorks,
      hasVibrateSupportDetection,
      currentHapticMode,
      platformVibrateAvailable: typeof navigator !== 'undefined' && 'vibrate' in navigator
    };

    // 4. Sound Toggle Button Check
    const toggleBtn = document.getElementById('soundToggleBtn') || document.querySelector('[data-sound-toggle], .btn-sound-toggle');
    let hasToggleBtn = !!toggleBtn;
    let toggleWorks = false;
    let toggleStates = null;

    if (toggleBtn && engine) {
      const getMuteState = () => {
        if (typeof engine.getMuted === 'function') return engine.getMuted();
        if (engine.isMuted !== undefined) return engine.isMuted;
        return toggleBtn.getAttribute('aria-pressed') === 'false';
      };

      const initialMuted = getMuteState();
      toggleBtn.click();
      const mutedAfterClick = getMuteState();
      const iconOff = document.getElementById('soundIconOff') || toggleBtn.querySelector('.icon-muted, [data-sound-icon-off]');
      const iconOffVisible = iconOff ? window.getComputedStyle(iconOff).display !== 'none' : true;

      // Click again to restore
      toggleBtn.click();
      const unmutedAfterSecondClick = getMuteState();

      toggleWorks = (mutedAfterClick !== initialMuted) && (unmutedAfterSecondClick === initialMuted);
      toggleStates = {
        initialMuted,
        mutedAfterClick,
        unmutedAfterSecondClick,
        iconOffVisible
      };
    }

    // 5. Scan data-haptic attributes in DOM
    const hapticElements = Array.from(document.querySelectorAll('[data-haptic]'));
    const hapticCount = hapticElements.length;
    const hapticTypes = {};
    hapticElements.forEach(el => {
      const type = el.getAttribute('data-haptic') || 'default';
      hapticTypes[type] = (hapticTypes[type] || 0) + 1;
    });

    const interactiveCount = document.querySelectorAll('button, a[href], [role="button"], .btn-magnetic').length;
    const hapticCoverage = interactiveCount > 0 ? +(hapticCount / interactiveCount).toFixed(3) : 1.0;

    return {
      engineExists,
      methodsPassed,
      totalMethods: requiredWaveforms.length,
      methodResults,
      dualSyncer,
      hasToggleBtn,
      toggleWorks,
      toggleStates,
      hapticCount,
      hapticCoverage,
      hapticTypes
    };
  });

  // Scoring logic (Max 2.0)
  // - Standard Core Waveforms (5 waveforms): up to 0.6 points
  // - WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer: up to 0.5 points
  //   * v2.0 engine or extended waveforms: 0.25 pts
  //   * Dual Audio-Haptic Syncer (setHapticMode / vibrate detection): 0.25 pts
  // - Sound Toggle Button & state management: up to 0.5 points
  // - Data-haptic attributes coverage: up to 0.4 points
  let score = 0;
  if (hapticsReport.engineExists) {
    score += +( (hapticsReport.methodsPassed / hapticsReport.totalMethods) * 0.6 ).toFixed(2);
  }

  // Dual syncer & v2.0 scoring
  if (hapticsReport.dualSyncer) {
    if (hapticsReport.dualSyncer.isV2) score += 0.25;
    if (hapticsReport.dualSyncer.hasSetHapticMode || hapticsReport.dualSyncer.hasVibrateSupportDetection) {
      score += (hapticsReport.dualSyncer.hasSetHapticMode && hapticsReport.dualSyncer.hasVibrateSupportDetection) ? 0.25 : 0.15;
    }
  }

  if (hapticsReport.hasToggleBtn && hapticsReport.toggleWorks) score += 0.5;
  else if (hapticsReport.hasToggleBtn) score += 0.25;

  if (hapticsReport.hapticCount >= 4 || hapticsReport.hapticCoverage >= 0.5) score += 0.4;
  else if (hapticsReport.hapticCount > 0) score += 0.2;

  score = Math.min(2.0, +score.toFixed(2));

  const findings = [];
  if (!hapticsReport.engineExists) {
    findings.push('Không tìm thấy đối tượng window.WowEngine.haptics hoặc WebAudioHaptics trên trang.');
  }
  if (hapticsReport.methodsPassed < hapticsReport.totalMethods) {
    findings.push(`Thiếu hoặc lỗi khi gọi ${hapticsReport.totalMethods - hapticsReport.methodsPassed} dạng sóng âm xúc giác cơ bản.`);
  }
  if (!hapticsReport.dualSyncer.isV2) {
    findings.push('WebAudioHaptics v2.0 (10 waveforms) chưa được nâng cấp đầy đủ.');
  }
  if (!hapticsReport.dualSyncer.hasSetHapticMode) {
    findings.push('Dual Audio-Haptic Syncer: Thiếu API `setHapticMode` để điều phối đồng bộ âm thanh và rung xúc giác.');
  }
  if (!hapticsReport.hasToggleBtn) {
    findings.push('Thiếu nút bật/tắt âm thanh trực quan (#soundToggleBtn) theo chuẩn kiểm soát người dùng.');
  }

  const pass = score >= 1.7;
  console.log(`[PILLAR 5 RESULT] Score: ${score}/2.00 | Engine: ${hapticsReport.engineExists} | v2.0: ${hapticsReport.dualSyncer.isV2} | Syncer API: ${hapticsReport.dualSyncer.hasSetHapticMode} | Toggle: ${hapticsReport.hasToggleBtn}`);

  return {
    pillar: 'Pillar 5: Phản hồi âm thanh WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer',
    score,
    maxScore: 2.0,
    pass,
    metrics: hapticsReport,
    findings
  };
}

// ============================================================================
// REPORT & RECEIPT GENERATORS
// ============================================================================
function generateEvidenceLedger(auditData) {
  const { url, port, threshold, overallScore, verdict, hardGated, hardGateReason, breakpoints, cls, pillars, timestamp } = auditData;
  const isPass = verdict === 'PASS';

  let md = `# ⚡ SỔ CÁI BẰNG CHỨNG KIỂM TOÁN ĐỘ THĂNG HOA (DELIGHT & CRAFTSMANSHIP EVIDENCE LEDGER)
> **Phiên bản**: Antigravity 2.0 Multi-Breakpoint & CLS Automated Delight Auditor (WP-R3-05)  
> **Thời điểm thẩm định**: ${timestamp}  
> **Mục tiêu kiểm toán**: \`${url}\`  
> **Cổng Chrome CDP**: \`${port}\`  
> **Điểm tổng kết**: **${overallScore.toFixed(2)} / 10.00**  
> **Khóa chặn cứng (Hard Gating)**: ${hardGated ? `🚨 **TRIGGERED (BỊ KHÓA CHẶT DO TRÀN NGANG)**` : '✅ **PASSED (ZERO HORIZONTAL OVERFLOW)**'}  
> **Phán quyết**: **${isPass ? '✅ TEST_PASS (ĐẠT CHUẨN THĂNG HOA & TINH XẢO)' : '❌ TEST_FAIL (CHƯA ĐẠT NGƯỠNG YÊU CẦU)'}** (Ngưỡng yêu cầu: >= ${threshold})

---

## 📱 1. MA TRẬN ĐA KÍCH THƯỚC MÀN HÌNH (MULTI-BREAKPOINT RESPONSIVE MATRIX)

| Thiết Bị (Device) | Viewport | Inner Width | Scroll Width | Tràn Ngang (Overflow) | Trạng Thái (Status) | Phần Tử Vi Phạm (Offenders) |
|---|---|---|---|---|---|---|
`;

  if (breakpoints && breakpoints.matrix) {
    breakpoints.matrix.forEach(bp => {
      const statusIcon = bp.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
      const offendersStr = (bp.offendingElements && bp.offendingElements.length > 0)
        ? bp.offendingElements.map(o => `\`${o.selector}\` (+${o.overflowPx}px)`).join(', ')
        : 'Không có (Zero Overflow)';
      md += `| **${bp.name}** | \`${bp.viewport}\` | ${bp.innerWidth}px | ${bp.scrollWidth}px | ${bp.overflowPx}px | ${statusIcon} | ${offendersStr} |\n`;
    });
  }

  md += `\n> **Đặc Quyền Khóa Chặt (Hard Gating Rule)**: Nếu trang web bị tràn ngang trên màn hình Mobile (375px) hoặc Tablet (768px), hệ thống lập tức đánh rớt kiểm toán độc lập.\n`;
  if (hardGated && hardGateReason) {
    md += `> 🚨 **Lý do kích hoạt Hard Gate**: ${hardGateReason}\n`;
  }

  md += `\n---

## 📈 2. BIẾN ĐỘNG BỐ CỤC TÍCH LŨY (CUMULATIVE LAYOUT SHIFT - CLS)

- **Tổng chỉ số CLS thực tế**: **\`${cls ? cls.totalCls : 0.0}\`**
- **Xếp hạng độ ổn định**: **${cls ? cls.rating : 'EXCELLENT'}** (${cls ? cls.description : 'Bố cục hoàn toàn ổn định.'})
- **Tiêu chuẩn kiểm toán**:
  - \`CLS <= 0.05\`: Tối đa (Hoàn hảo, không gián đoạn thị giác)
  - \`0.05 < CLS <= 0.10\`: Khá (Rung lắc nhẹ khi resize / cuộn)
  - \`CLS > 0.25\`: Vi phạm nặng (Layout Shift nghiêm trọng)

---

## 📊 3. BẢNG TỔNG HỢP 5 TRỤ CỘT ĐÁNH GIÁ (5-PILLAR CRAFTSMANSHIP SCORECARD)

| Trụ Cột (Pillar) | Trọng Số | Điểm Đạt Được | Tỷ Lệ | Trạng Thái | Ghi Chú Nổi Bật |
|---|---|---|---|---|---|
`;

  pillars.forEach(p => {
    const ratioPct = ((p.score / p.maxScore) * 100).toFixed(1);
    const statusIcon = p.pass ? '✅ PASS' : '⚠️ ATTENTION';
    let note = '';
    if (p.pillar.includes('Pillar 1')) {
      note = `Avg FPS: ${p.metrics.avgFps} | Smooth: ${(p.metrics.smoothRatio * 100).toFixed(1)}% | Jank: ${p.metrics.jankCount} | CLS: ${cls ? cls.totalCls : '0.0000'}`;
    } else if (p.pillar.includes('Pillar 2')) {
      note = `:active scale(0.965): ${p.metrics.hasActiveScale0965Rule ? 'CÓ' : 'KHÔNG'} | Phủ: ${(p.metrics.coverageRatio * 100).toFixed(1)}%`;
    } else if (p.pillar.includes('Pillar 3')) {
      note = `Spotlight: ${p.metrics.spotlight.hasVariables ? 'OK' : 'FAIL'} | 3D Inversion: ${p.metrics.tilt.inversionPassed ? 'OK' : 'FAIL'} | Z-Index: ${p.metrics.zIndexProtection.passed ? 'OK' : 'FAIL'}`;
    } else if (p.pillar.includes('Pillar 4')) {
      note = `WCAG AA: ${(p.metrics.aaRatio * 100).toFixed(1)}% | WCAG AAA: ${(p.metrics.aaaRatio * 100).toFixed(1)}% | Acrylic Blur: ${p.metrics.acrylicHasBlur ? 'CÓ' : 'KHÔNG'}`;
    } else if (p.pillar.includes('Pillar 5')) {
      note = `v2.0: ${p.metrics.dualSyncer?.isV2 ? 'CÓ' : 'KHÔNG'} | Syncer API: ${p.metrics.dualSyncer?.hasSetHapticMode ? 'CÓ' : 'KHÔNG'} | Vibrate: ${p.metrics.dualSyncer?.hasVibrateSupportDetection ? 'CÓ' : 'KHÔNG'}`;
    }

    md += `| **${p.pillar}** | ${p.maxScore.toFixed(1)} | **${p.score.toFixed(2)}** | ${ratioPct}% | ${statusIcon} | ${note} |\n`;
  });

  md += `| **TỔNG ĐIỂM (OVERALL DELIGHT SCORE)** | **10.0** | **${overallScore.toFixed(2)}** | **${(overallScore * 10).toFixed(1)}%** | **${isPass ? 'PASS' : 'FAIL'}** | **Ngưỡng đạt: >= ${threshold}** |\n\n`;

  md += `---

## 🔍 4. CHI TIẾT BẰNG CHỨNG TỪNG TRỤ CỘT (DETAILED EVIDENCE LEDGER)

`;

  pillars.forEach((p, idx) => {
    md += `### 4.${idx + 1}. ${p.pillar}\n`;
    md += `- **Điểm số**: \`${p.score.toFixed(2)} / ${p.maxScore.toFixed(1)}\` (${p.pass ? 'PASS' : 'FAIL'})\n`;
    md += `- **Bằng chứng kỹ thuật (Technical Evidence)**:\n`;
    md += '```json\n' + JSON.stringify(p.metrics, null, 2) + '\n```\n';
    if (p.findings && p.findings.length > 0) {
      md += `- **Phát hiện cần cải thiện (Findings)**:\n`;
      p.findings.forEach(f => {
        md += `  - ⚠️ ${f}\n`;
      });
    } else {
      md += `- **Phát hiện**: Không có sai sót kỹ thuật. Đạt chuẩn hoàn mỹ.\n`;
    }
    md += '\n';
  });

  md += `---

## ⚖️ 5. PHÁN QUYẾT ĐỘC LẬP (INDEPENDENT AUDIT VERDICT)
- **Điểm Craftsmanship định lượng**: **${overallScore.toFixed(2)} / 10.00**
- **Ngưỡng PASS yêu cầu**: **>= ${threshold}**
- **Khóa Chặn Tràn Ngang**: **${hardGated ? '🚨 THẤT BẠI (TRÀN NGANG MOBILE/TABLET)' : '✅ THÀNH CÔNG (ZERO-HORIZONTAL-OVERFLOW)'}**
- **Kết luận**: **${isPass ? 'ĐƯỢC CHẤP THUẬN (APPROVED) — Thiết kế đạt độ tinh xảo cao, vi tương tác vật lý sống động, chuyển động 60 FPS mượt mà, layout ổn định zero-overflow trên đa màn hình và phản hồi xúc giác trọn vẹn.' : 'TỪ CHỐI (REJECTED) — Chưa đạt ngưỡng điểm thăng hoa yêu cầu hoặc vi phạm Hard Gating tràn ngang. Cần nâng cấp các tiêu chí chưa vượt qua trước khi release.'}**

---
*Báo cáo được sinh tự động bởi Antigravity 2.0 Multi-Breakpoint & CLS Automated Delight Auditor (WP-R3-05)*.
`;

  return md;
}

function generateReceiptManifest(auditData) {
  return {
    wp: 'WP-R3-05',
    task: 'Multi-Breakpoint & CLS CDP Audit Inspector (scripts/audit_delight_score.js)',
    status: auditData.verdict === 'PASS' ? 'COMPLETED' : 'FAILED',
    timestamp: auditData.timestamp,
    target_url: auditData.url,
    cdp_port: auditData.port,
    threshold: auditData.threshold,
    overall_delight_score: auditData.overallScore,
    verdict: auditData.verdict,
    hard_gated: auditData.hardGated,
    hard_gate_reason: auditData.hardGateReason,
    cls: {
      totalCls: auditData.cls?.totalCls || 0,
      rating: auditData.cls?.rating || 'EXCELLENT',
      status: auditData.cls?.status || 'PASS'
    },
    breakpoints: {
      matrix: (auditData.breakpoints?.matrix || []).map(b => ({
        id: b.id,
        name: b.name,
        viewport: b.viewport,
        hasOverflow: b.hasOverflow,
        overflowPx: b.overflowPx,
        status: b.status
      })),
      all_passed: auditData.breakpoints?.allPassed || false,
      zero_horizontal_overflow: !auditData.breakpoints?.mobileOverflow
    },
    pillars: auditData.pillars.map(p => ({
      name: p.pillar,
      score: p.score,
      max: p.maxScore,
      pass: p.pass
    })),
    artifacts_created: [
      'C:/Users/game/.gemini/scripts/audit_delight_score.js',
      'C:/Users/game/.gemini/scripts/test_audit_delight_score.js',
      'C:/Users/game/.gemini/' + auditData.outputFile,
      'C:/Users/game/.gemini/' + auditData.ledgerFile,
      'C:/Users/game/.gemini/' + auditData.receiptFile
    ],
    summary: `Đã hoàn thành nâng cấp công cụ kiểm toán tự động scripts/audit_delight_score.js (WP-R3-05). Tích hợp Ma Trận Đa Kích Thước Màn Hình (Desktop 1440x900, Tablet 768x1024, Mobile 375x812), Thuật toán Zero-Horizontal-Overflow đệ quy kèm Hard Gating rớt kiểm toán nếu tràn ngang trên mobile, Đo đạc Biến Động Bố Cục Tích Lũy (CLS) qua PerformanceObserver, và nâng cấp Trụ cột 5 kiểm chứng WebAudioHaptics v2.0 và Dual Audio-Haptic Syncer (setHapticMode API, navigator.vibrate). Điểm kiểm toán thực tế đạt ${auditData.overallScore.toFixed(2)}/10.00 (Ngưỡng PASS >= ${auditData.threshold}).`
  };
}

// ============================================================================
// MAIN EXECUTION PIPELINE
// ============================================================================
async function run() {
  const config = parseArgs();

  if (config.help) {
    console.log(`
⚡ ANTIGRAVITY 2.0 // AUTOMATED DELIGHT AUDIT TOOL (WP-R3-05)
Usage:
  node scripts/audit_delight_score.js [options]

Options:
  --url <URL>          Target page URL to audit (Default: wow_pilot_showcase or localhost:5173)
  --port <PORT>        Chrome CDP port (Default: 9223, Fallback: 9222)
  --threshold <SCORE>  Minimum score for PASS verdict (Default: 8.5, Max: 10.0)
  --output <PATH>      JSON report destination (Default: .antigravity/delight_audit_report.json)
  --ledger <PATH>      Markdown evidence ledger destination (Default: .antigravity/delight_audit_ledger.md)
  --receipt <PATH>     Receipt manifest destination (Default: .antigravity/receipts/wp_r3_05.json)
  --headless           Run with isolated headless Chrome instead of connecting to CDP
  --help, -h           Show this manual
`);
    process.exit(0);
  }

  console.log('================================================================');
  console.log('⚡ ANTIGRAVITY 2.0 // AUTOMATED DELIGHT AUDIT ENGINE (WP-R3-05)');
  console.log(`Target URL : ${config.url}`);
  console.log(`CDP Port   : ${config.port}`);
  console.log(`Threshold  : ${config.threshold}/10.00`);
  console.log('================================================================');

  const { browser, isConnectedRemote } = await connectOrLaunchBrowser(config);

  try {
    const { page, createdNew } = await resolvePage(browser, config.url, isConnectedRemote);

    // 1. Multi-Breakpoint Matrix & Zero-Horizontal-Overflow Audit (Req 1 & 2)
    const breakpointResults = await auditMultiBreakpointMatrix(page);

    // 2. Continuous CLS layout shift measurement
    const clsMetrics = await harvestClsMetrics(page);

    // 3. 5 Pillars Audit Execution
    const p1 = await auditPillar1_Motion60Fps(page, clsMetrics);
    const p2 = await auditPillar2_MechanicalPress(page);
    const p3 = await auditPillar3_SpotlightAnd3D(page);
    const p4 = await auditPillar4_WcagContrastAndAcrylic(page);
    const p5 = await auditPillar5_WebAudioHaptics(page);

    const pillars = [p1, p2, p3, p4, p5];
    const initialScore = +(pillars.reduce((acc, p) => acc + p.score, 0)).toFixed(2);

    // 4. Hard Gating Evaluation (Req 2)
    const gating = evaluateHardGating({
      overallScore: initialScore,
      threshold: config.threshold,
      breakpointResults: breakpointResults.matrix
    });

    const overallScore = gating.penalizedScore;
    const verdict = gating.verdict;

    console.log('\n================================================================');
    console.log(`🏆 DELIGHT & CRAFTSMANSHIP SCORE: ${overallScore.toFixed(2)} / 10.00`);
    console.log(`🎯 PASS THRESHOLD               : ${config.threshold.toFixed(2)}`);
    console.log(`📱 MULTI-BREAKPOINT STATUS      : ${breakpointResults.allPassed ? '✅ ZERO OVERFLOW' : '❌ OVERFLOW DETECTED'}`);
    console.log(`📈 CLS RATING                   : ${clsMetrics.rating} (${clsMetrics.totalCls})`);
    if (gating.hardGated) {
      console.log(`🚨 HARD GATING TRIGGERED        : ${gating.hardGateReason}`);
    }
    console.log(`⚖️ AUDIT VERDICT                : ${verdict === 'PASS' ? '✅ PASS (APPROVED)' : '❌ FAIL (REJECTED)'}`);
    console.log('================================================================');

    const auditData = {
      timestamp: new Date().toISOString(),
      url: config.url,
      port: config.port,
      threshold: config.threshold,
      overallScore,
      verdict,
      hardGated: gating.hardGated,
      hardGateReason: gating.hardGateReason,
      cls: clsMetrics,
      breakpoints: breakpointResults,
      pillars,
      outputFile: config.output,
      ledgerFile: config.ledger,
      receiptFile: config.receipt
    };

    // 1. Write JSON Report
    const outJsonPath = path.resolve(config.output);
    fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
    fs.writeFileSync(outJsonPath, JSON.stringify(auditData, null, 2), 'utf-8');
    console.log(`[OUTPUT] JSON Report written to: ${outJsonPath}`);

    // 2. Write Markdown Evidence Ledger
    const outLedgerPath = path.resolve(config.ledger);
    fs.mkdirSync(path.dirname(outLedgerPath), { recursive: true });
    const ledgerMd = generateEvidenceLedger(auditData);
    fs.writeFileSync(outLedgerPath, ledgerMd, 'utf-8');
    console.log(`[OUTPUT] Evidence Ledger written to: ${outLedgerPath}`);

    // 3. Write Receipt Manifest
    const isReferenceShowcase = config.url.includes('wow_pilot_showcase');
    if (config.receiptSpecified || isReferenceShowcase) {
      const outReceiptPath = path.resolve(config.receipt);
      fs.mkdirSync(path.dirname(outReceiptPath), { recursive: true });
      const receiptData = generateReceiptManifest(auditData);
      fs.writeFileSync(outReceiptPath, JSON.stringify(receiptData, null, 2), 'utf-8');
      console.log(`[OUTPUT] Receipt Manifest written to: ${outReceiptPath}`);
    }

    // Cleanup page if created newly
    if (createdNew && isConnectedRemote) {
      await page.close().catch(() => {});
    }

    if (!isConnectedRemote) {
      await browser.close().catch(() => {});
    } else {
      browser.disconnect();
    }

    if (verdict !== 'PASS') {
      console.warn(`[WARN] Audit completed but score (${overallScore}) did not meet threshold (${config.threshold}) or failed hard gating.`);
      process.exit(1);
    } else {
      console.log(`[SUCCESS] Delight Audit Completed Successfully with Score ${overallScore}/10.00!`);
      process.exit(0);
    }
  } catch (err) {
    console.error('[FATAL] Delight Audit execution failed:', err);
    if (!isConnectedRemote) {
      await browser.close().catch(() => {});
    } else {
      browser.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  run().catch(err => {
    console.error('Unhandled fatal error:', err);
    process.exit(1);
  });
}

module.exports = {
  run,
  auditPillar1_Motion60Fps,
  auditPillar2_MechanicalPress,
  auditPillar3_SpotlightAnd3D,
  auditPillar4_WcagContrastAndAcrylic,
  auditPillar5_WebAudioHaptics,
  auditMultiBreakpointMatrix,
  calculateContrastRatio,
  compositeColor,
  parseRgba,
  checkTwoCornerInversion,
  matchActiveRule,
  isSmallIconButton,
  BREAKPOINTS,
  checkHorizontalOverflow,
  findOffendingOverflowElements,
  evaluateClsScore,
  checkDualHapticSyncer,
  evaluateHardGating
};
