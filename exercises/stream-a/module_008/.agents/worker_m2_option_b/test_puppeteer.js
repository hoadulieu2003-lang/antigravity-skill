const path = require('path');
let puppeteer;
try {
  puppeteer = require('puppeteer-core');
} catch (e1) {
  try {
    puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
  } catch (e2) {
    console.error('[FATAL] puppeteer-core not found.');
    process.exit(1);
  }
}

const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const optionBUrl = 'file:///' + path.resolve(__dirname, '..', '..', 'directions', 'option_b.html').replace(/\\/g, '/');

// Math helpers
function parseRgb(str) {
  const match = str.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!match) return [0, 0, 0];
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  return 0.2126 * srgbToLinear(rgb[0]) + 0.7152 * srgbToLinear(rgb[1]) + 0.0722 * srgbToLinear(rgb[2]);
}

function contrastRatio(rgbA, rgbB) {
  const l1 = relativeLuminance(rgbA);
  const l2 = relativeLuminance(rgbB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(4));
}

(async () => {
  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(optionBUrl, { waitUntil: 'load' });

  console.log('\n=== CHECK 1: OPTION B TELEMETRY ===');
  const telemetry = await page.evaluate(() => {
    const bodyStyles = window.getComputedStyle(document.body);
    const rootStyles = window.getComputedStyle(document.documentElement);
    const primaryBtn = document.querySelector('.dispatch-action-primary, .btn-primary');
    const btnStyles = primaryBtn ? window.getComputedStyle(primaryBtn) : null;
    const badge = document.querySelector('.status-badge');
    const badgeStyles = badge ? window.getComputedStyle(badge) : null;

    return {
      canvasBg: bodyStyles.backgroundColor,
      fontFamily: bodyStyles.fontFamily,
      brandPrimary: btnStyles ? btnStyles.backgroundColor : null,
      focusRingToken: rootStyles.getPropertyValue('--color-focus-ring').trim(),
      badgeBorderWidth: badgeStyles ? badgeStyles.borderWidth : null,
      badgeBorderStyle: badgeStyles ? badgeStyles.borderStyle : null
    };
  });

  console.log('Canvas Bg:', telemetry.canvasBg, '(Expected rgb(248, 250, 252) / #F8FAFC)');
  console.log('Brand Primary:', telemetry.brandPrimary, '(Expected rgb(55, 48, 163) / #3730A3)');
  console.log('Focus Ring Token:', telemetry.focusRingToken, '(Expected var(--primitive-blue-600))');
  console.log('Badge Border Width:', telemetry.badgeBorderWidth);
  const badgeRaw = await page.evaluate(() => {
    const el = document.querySelector('.status-badge');
    return {
      inlineStyle: el.style.borderWidth,
      computedWidth: window.getComputedStyle(el).borderWidth,
      tokenVar: window.getComputedStyle(document.documentElement).getPropertyValue('--dispatch-badge-border-width')
    };
  });
  console.log('Badge raw details:', badgeRaw);

  console.log('\n=== CHECK 2: WCAG 2.2 AA CONTRAST RATIOS (LIVE COMPUTED) ===');
  const pairs = [
    { name: 'NORMAL Badge (Text on Bg)', sel: '[data-status="NORMAL"]', threshold: 4.5 },
    { name: 'ATTENTION Badge (Text on Bg)', sel: '[data-status="ATTENTION"]', threshold: 4.5 },
    { name: 'ERROR Badge (Text on Bg)', sel: '[data-status="ERROR"]', threshold: 4.5 },
    { name: 'SUCCESS Badge (Text on Bg)', sel: '[data-status="SUCCESS"]', threshold: 4.5 },
    { name: 'Primary Action CTA (Text on Bg)', sel: '.dispatch-action-primary', threshold: 4.5 },
    { name: 'App Title on Canvas/Surface', sel: '.ledger-title', threshold: 3.0 }
  ];

  for (const p of pairs) {
    const colors = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);

      let cur = el;
      let bg = 'rgb(255, 255, 255)';
      while (cur && cur !== document.documentElement) {
        const curBg = window.getComputedStyle(cur).backgroundColor;
        if (curBg && curBg !== 'rgba(0, 0, 0, 0)' && curBg !== 'transparent') {
          bg = curBg;
          break;
        }
        cur = cur.parentElement;
      }

      return { fg: s.color, bg: bg };
    }, p.sel);

    if (!colors) throw new Error('Element not found for ' + p.name);
    const cr = contrastRatio(parseRgb(colors.fg), parseRgb(colors.bg));
    const passed = cr >= p.threshold;
    console.log(`  [CONTRAST] ${p.name.padEnd(34)} | ${colors.fg} on ${colors.bg} -> ${cr}:1 (req >= ${p.threshold}:1) -> ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) throw new Error(`Contrast check failed for ${p.name}`);
  }
  console.log('PASS: All computed contrast ratios meet or exceed thresholds!');

  console.log('\n=== CHECK 3: RESPONSIVE CADENCE (ZERO HORIZONTAL OVERFLOW) ===');
  const viewports = [
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 100));

    const overflowMetrics = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const innerWidth = window.innerWidth;
      const overflowX = scrollWidth > innerWidth;
      const overflowPx = Math.max(0, scrollWidth - innerWidth);
      return { scrollWidth, innerWidth, overflowX, overflowPx };
    });

    console.log(`  [OVERFLOW] ${vp.name.padEnd(8)} (${vp.width}x${vp.height}) | scrollWidth: ${overflowMetrics.scrollWidth}px vs innerWidth: ${overflowMetrics.innerWidth}px | Overflow: ${overflowMetrics.overflowPx}px`);
    if (overflowMetrics.overflowX || overflowMetrics.overflowPx > 0) {
      throw new Error(`Horizontal overflow detected at viewport ${vp.name}!`);
    }
  }
  console.log('PASS: Zero horizontal overflow across all 3 viewports!');

  console.log('\n=== CHECK 4: KEYBOARD FOCUS & FSM ASYNC BEHAVIOR ===');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  // Test focus visible outline on button
  const focusCheck = await page.evaluate(() => {
    const btn = document.getElementById('btn-global-dispatch');
    btn.focus();
    const s = window.getComputedStyle(btn);
    return {
      outlineWidth: s.outlineWidth,
      outlineStyle: s.outlineStyle,
      outlineColor: s.outlineColor
    };
  });
  console.log('Focus outline on global button:', focusCheck);

  // Test FSM action on TF-802
  const preClickState = await page.evaluate(() => {
    const btn = document.getElementById('action-btn-tf802');
    btn.focus();
    return {
      focused: document.activeElement === btn,
      ariaDisabled: btn.getAttribute('aria-disabled')
    };
  });
  console.log('Pre-click on action-btn-tf802:', preClickState);

  // Trigger click
  await page.click('#action-btn-tf802');
  await new Promise(r => setTimeout(r, 100));

  const postClickState = await page.evaluate(() => {
    const btn = document.getElementById('action-btn-tf802');
    return {
      focused: document.activeElement === btn,
      evictedToBody: document.activeElement === document.body,
      ariaDisabled: btn.getAttribute('aria-disabled'),
      ariaBusy: btn.getAttribute('aria-busy'),
      hasDisabledAttr: btn.hasAttribute('disabled')
    };
  });

  console.log('Post-click FSM state (VALIDATING):', postClickState);
  if (!postClickState.focused) throw new Error('Focus was lost during FSM transition!');
  if (postClickState.evictedToBody) throw new Error('Focus was evicted to document.body!');
  if (postClickState.ariaDisabled !== 'true') throw new Error('aria-disabled was not set!');
  if (postClickState.hasDisabledAttr) throw new Error('HTML disabled attribute was used instead of aria-disabled!');

  console.log('PASS: FSM preserved keyboard focus on action button without eviction!');

  await browser.close();
  console.log('\nALL PUPPETEER CHECKS PASSED WITH ZERO ERRORS!');
})().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
