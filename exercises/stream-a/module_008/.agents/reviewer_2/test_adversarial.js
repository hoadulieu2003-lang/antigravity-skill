const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function parseColor(str) {
  if (!str) return [0, 0, 0, 1];
  const s = str.trim().toLowerCase();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 1];
  }
  const m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)/);
  if (m) {
    return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), m[4] !== undefined ? parseFloat(m[4]) : 1];
  }
  return [0, 0, 0, 1];
}

function srgbLin(c255) {
  const c = c255 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relLum(rgb) {
  return 0.2126 * srgbLin(rgb[0]) + 0.7152 * srgbLin(rgb[1]) + 0.0722 * srgbLin(rgb[2]);
}

function contrast(c1, c2) {
  const l1 = relLum(parseColor(c1));
  const l2 = relLum(parseColor(c2));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file:///C:/Users/game/.gemini/exercises/stream-a/module_008/index.html', { waitUntil: 'load' });

  console.log('--- ADVERSARIAL FOCUS INSPECTION ---');
  const selectors = [
    '#btn-global-dispatch',
    '.filter-tab',
    '#tab-all',
    '#tab-normal',
    '#action-btn-tf802',
    '#action-btn-tf803',
    '.skip-link',
    '#input-tour-search'
  ];

  for (const sel of selectors) {
    const res = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return { found: false, sel: s };
      el.focus();
      const cs = window.getComputedStyle(el);
      let cur = el.parentElement;
      let bg = 'rgb(255, 255, 255)';
      while (cur && cur !== document.documentElement) {
        const b = window.getComputedStyle(cur).backgroundColor;
        if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') {
          bg = b;
          break;
        }
        cur = cur.parentElement;
      }
      return {
        found: true,
        sel: s,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        outlineOffset: cs.outlineOffset,
        adjacentBg: bg
      };
    }, sel);

    if (res.found) {
      const cr = contrast(res.outlineColor, res.adjacentBg);
      console.log(`${res.sel.padEnd(25)} | outline: ${res.outlineWidth} ${res.outlineStyle} ${res.outlineColor} | bg: ${res.adjacentBg} | contrast: ${cr.toFixed(4)}:1`);
    } else {
      console.log(`${sel.padEnd(25)} | NOT FOUND`);
    }
  }

  console.log('\n--- ADVERSARIAL FSM TRANSITION & FOCUS PRESERVATION TEST ---');
  // Test click on #action-btn-tf802
  const fsmResult = await page.evaluate(async () => {
    const btn = document.querySelector('#action-btn-tf802');
    btn.focus();
    const initialFocused = document.activeElement === btn;

    // Trigger click (normal, non-shift)
    btn.click();
    const state1_validating = {
      ariaDisabled: btn.getAttribute('aria-disabled'),
      ariaBusy: btn.getAttribute('aria-busy'),
      text: btn.innerText.trim(),
      activeElementIsBtn: document.activeElement === btn,
      activeElementIsBody: document.activeElement === document.body
    };

    // Wait 600ms for SAVING transition
    await new Promise(r => setTimeout(r, 600));
    const state2_saving = {
      ariaDisabled: btn.getAttribute('aria-disabled'),
      ariaBusy: btn.getAttribute('aria-busy'),
      text: btn.innerText.trim(),
      activeElementIsBtn: document.activeElement === btn,
      activeElementIsBody: document.activeElement === document.body
    };

    // Wait 700ms for CONFIRMED transition
    await new Promise(r => setTimeout(r, 700));
    const state3_confirmed = {
      ariaDisabled: btn.getAttribute('aria-disabled'),
      ariaBusy: btn.getAttribute('aria-busy'),
      text: btn.innerText.trim(),
      activeElementIsBtn: document.activeElement === btn,
      activeElementIsBody: document.activeElement === document.body
    };

    return { initialFocused, state1_validating, state2_saving, state3_confirmed };
  });
  console.log('Normal FSM run:', JSON.stringify(fsmResult, null, 2));

  console.log('\n--- ADVERSARIAL FSM SHIFT-CLICK FAILURE & RETRY FOCUS TEST ---');
  // Reload page to test failure with shift key
  await page.goto('file:///C:/Users/game/.gemini/exercises/stream-a/module_008/index.html', { waitUntil: 'load' });
  const failureResult = await page.evaluate(async () => {
    const btn = document.querySelector('#action-btn-tf802');
    btn.focus();
    // Dispatch shift-click
    const evt = new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: true });
    btn.dispatchEvent(evt);

    // Wait 1300ms for entire chain to complete to FAILURE
    await new Promise(r => setTimeout(r, 1300));

    const active = document.activeElement;
    const retryBtn = document.querySelector('#action-btn-retry-tf-802');
    return {
      retryBtnExists: !!retryBtn,
      retryBtnText: retryBtn ? retryBtn.innerText.trim() : null,
      activeElementTag: active ? active.tagName : null,
      activeElementId: active ? active.id : null,
      focusTransferredToRetry: active === retryBtn,
      evictedToBody: active === document.body
    };
  });
  console.log('Shift-Click Failure run:', JSON.stringify(failureResult, null, 2));

  console.log('\n--- ADVERSARIAL RESPONSIVE CADENCE & OVERFLOW STRESS TEST ---');
  const viewportsToStress = [
    { name: '1440x900', w: 1440, h: 900 },
    { name: '1024x768', w: 1024, h: 768 },
    { name: '768x1024', w: 768, h: 1024 },
    { name: '640x960',  w: 640, h: 960 },
    { name: '414x896',  w: 414, h: 896 },
    { name: '390x844',  w: 390, h: 844 },
    { name: '360x780',  w: 360, h: 780 },
    { name: '320x568',  w: 320, h: 568 }
  ];

  for (const vp of viewportsToStress) {
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    await new Promise(r => setTimeout(r, 50));
    const ov = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const innerW = window.innerWidth;
      return { scrollW, innerW, overflow: Math.max(0, scrollW - innerW) };
    });
    console.log(`Viewport ${vp.name.padEnd(10)} | scrollW: ${ov.scrollW}px | innerW: ${ov.innerW}px | overflow: ${ov.overflow}px -> ${ov.overflow === 0 ? 'PASS' : 'FAIL'}`);
  }

  await browser.close();
})();
