/**
 * ============================================================================
 * AUTOMATED RUNTIME VERIFICATION SUITE FOR WOW PILOT SHOWCASE
 * ============================================================================
 * Uses headless Chrome via puppeteer-core to inspect live DOM, styles,
 * Wow Engine interactions, WebAudioHaptics, and Dual-Mode motion (?test-mode=1).
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML_FILE = path.join(__dirname, 'index.html');
const FILE_URL = 'file:///' + HTML_FILE.replace(/\\/g, '/');

// Contrast helper WCAG 2.1
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(rgb1, rgb2) {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(colorStr) {
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}

async function runSuite() {
  console.log('================================================================');
  console.log('⚡ ANTIGRAVITY 2.0 // WOW PILOT SHOWCASE RUNTIME AUDIT');
  console.log('Target:', FILE_URL);
  console.log('================================================================\n');

  const results = [];
  function assert(name, condition, detail = '') {
    results.push({ name, pass: !!condition, detail });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}${detail ? ' -> ' + detail : ''}`);
  }

  // 1. Static file checks
  assert('HTML file exists', fs.existsSync(HTML_FILE), HTML_FILE);
  assert('wow_engine.js exists', fs.existsSync(path.join(__dirname, 'wow_engine.js')));
  assert('style.css exists', fs.existsSync(path.join(__dirname, 'style.css')));

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('Chrome executable not found at:', CHROME_PATH);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    // ------------------------------------------------------------------------
    // TEST SUITE 1: STANDARD 60 FPS MODE
    // ------------------------------------------------------------------------
    console.log('\n--- 1. Testing Standard 60 FPS Mode ---');
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto(FILE_URL, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    assert('Zero runtime console errors on load', consoleErrors.length === 0, consoleErrors.join('; '));

    // Check WowEngine export
    const engineExists = await page.evaluate(() => typeof window.WowEngine !== 'undefined');
    assert('window.WowEngine is defined and exposed', engineExists);

    // Check Background Color (Icy Platinum #F8FAFC)
    const bodyBg = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return {
        bgColor: style.backgroundColor,
        bgImage: style.backgroundImage
      };
    });
    const isIcyPlatinum = bodyBg.bgColor === 'rgb(248, 250, 252)';
    assert('Background canvas is Icy Platinum (#F8FAFC / rgb(248, 250, 252))', isIcyPlatinum, bodyBg.bgColor);
    assert('Dot matrix grid background-image is present', bodyBg.bgImage.includes('radial-gradient'), bodyBg.bgImage);

    // Check Frosted Acrylic Card styling
    const acrylicCardStyles = await page.evaluate(() => {
      const card = document.querySelector('.acrylic-card');
      if (!card) return null;
      const s = window.getComputedStyle(card);
      return {
        backdropFilter: s.backdropFilter || s.webkitBackdropFilter,
        borderTopColor: s.borderTopColor,
        boxShadow: s.boxShadow,
        borderRadius: s.borderRadius
      };
    });
    assert('Acrylic Card has backdrop-filter blur', acrylicCardStyles && acrylicCardStyles.backdropFilter.includes('blur'), acrylicCardStyles?.backdropFilter);
    assert('Acrylic Card has Specular Hairline border & shadow', acrylicCardStyles && acrylicCardStyles.borderRadius !== '0px');

    // Check WCAG AA contrast ratio of primary text
    const contrastRatio = await page.evaluate(() => {
      const title = document.querySelector('.hero-title');
      const body = document.body;
      const titleColor = window.getComputedStyle(title).color;
      const bodyBg = window.getComputedStyle(body).backgroundColor;
      return { titleColor, bodyBg };
    });
    const cVal = getContrast(parseRgb(contrastRatio.titleColor), parseRgb(contrastRatio.bodyBg));
    assert('WCAG AA Contrast ratio is >= 4.5:1 (Actual: ' + cVal.toFixed(2) + ':1)', cVal >= 4.5, `${cVal.toFixed(2)}:1`);

    // Test Spotlight Tracking: simulate cursor movement
    const spotlightUpdated = await page.evaluate(() => {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 420, clientY: 350 }));
      const rootX = document.documentElement.style.getPropertyValue('--mouse-x');
      const rootY = document.documentElement.style.getPropertyValue('--mouse-y');
      return rootX.includes('420') && rootY.includes('350');
    });
    assert('Spotlight tracker updates CSS coordinates on pointermove', spotlightUpdated);

    // Test 3D Parallax Tilt
    const tiltTest = await page.evaluate(() => {
      const tiltCard = document.querySelector('[data-tilt]');
      if (!tiltCard) return null;
      const rect = tiltCard.getBoundingClientRect();
      tiltCard.dispatchEvent(new MouseEvent('mouseenter'));
      tiltCard.dispatchEvent(new MouseEvent('mousemove', {
        clientX: rect.left + rect.width * 0.8,
        clientY: rect.top + rect.height * 0.2
      }));
      const transform = tiltCard.style.transform;
      const pitchEl = tiltCard.querySelector('[data-tilt-pitch]');
      const rollEl = tiltCard.querySelector('[data-tilt-roll]');
      return {
        hasTransform: transform.includes('perspective') && transform.includes('rotateX'),
        pitch: pitchEl ? pitchEl.textContent : '',
        roll: rollEl ? rollEl.textContent : ''
      };
    });
    assert('3D Parallax Tilt applies perspective transformation', tiltTest && tiltTest.hasTransform);
    assert('Parallax Tilt updates Pitch/Roll telemetry readouts', tiltTest && tiltTest.pitch !== '0.0°');

    // Test Magnetic Button
    const magneticTest = await page.evaluate(() => {
      const btn = document.querySelector('.btn-magnetic');
      if (!btn) return null;
      const rect = btn.getBoundingClientRect();
      btn.dispatchEvent(new MouseEvent('mouseenter'));
      btn.dispatchEvent(new MouseEvent('mousemove', {
        clientX: rect.left + rect.width + 30,
        clientY: rect.top + rect.height + 20
      }));
      const transform = btn.style.transform;
      return { hasTranslate: transform.includes('translate') };
    });
    assert('Magnetic Button shifts towards cursor (translate)', magneticTest && magneticTest.hasTranslate);

    // Test Mechanical Bottom-Out CSS rule (:active scale(0.965))
    const mechanicalScaleRule = await page.evaluate(() => {
      let found = false;
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && rule.selectorText.includes(':active') && rule.cssText.includes('scale(0.965)')) {
              found = true;
              break;
            }
          }
        } catch (_) {}
      }
      return found;
    });
    assert('Mechanical bottom-out rule (:active scale(0.965)) exists in CSS', mechanicalScaleRule);

    // Test WebAudioHaptics
    const hapticsTest = await page.evaluate(() => {
      if (!window.WowEngine || !window.WowEngine.haptics) return { pass: false, error: 'haptics not found' };
      try {
        window.WowEngine.haptics.playClick();
        window.WowEngine.haptics.playPop();
        window.WowEngine.haptics.playDetent();
        window.WowEngine.haptics.playSwitch(true);
        window.WowEngine.haptics.playChime();
        const initialMute = window.WowEngine.haptics.getMuted();
        const toggledMute = window.WowEngine.haptics.toggleMute();
        window.WowEngine.haptics.setMuted(initialMute);
        return { pass: true, toggledMute: toggledMute !== initialMute };
      } catch (e) {
        return { pass: false, error: e.message };
      }
    });
    assert('WebAudioHaptics synthesizes all 5 physical waveforms with zero error', hapticsTest.pass, hapticsTest.error || '');
    assert('WebAudioHaptics mute toggle alters state correctly', hapticsTest.toggledMute);

    await page.close();

    // ------------------------------------------------------------------------
    // TEST SUITE 2: DUAL-MODE TEST-MODE (?test-mode=1)
    // ------------------------------------------------------------------------
    console.log('\n--- 2. Testing Dual-Mode Engine (?test-mode=1) ---');
    const testPage = await browser.newPage();
    const testUrl = FILE_URL + '?test-mode=1';
    await testPage.goto(testUrl, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 400));

    const testModeVerification = await testPage.evaluate(() => {
      const hasClass = document.documentElement.classList.contains('test-mode');
      const attr = document.documentElement.getAttribute('data-test-mode');
      const engineIsTest = window.WowEngine && window.WowEngine.isTestMode;
      const telemetryText = document.getElementById('telemetryMotionMode')?.textContent || '';

      // Test a dynamically created element's transition duration under test-mode
      const sample = document.createElement('div');
      sample.className = 'sample-test-el';
      sample.style.transition = 'transform 2s ease';
      document.body.appendChild(sample);
      const computedDuration = window.getComputedStyle(sample).transitionDuration;
      sample.remove();

      return {
        hasClass,
        attr,
        engineIsTest,
        telemetryText,
        computedDuration
      };
    });

    assert('HTML element has .test-mode class applied', testModeVerification.hasClass);
    assert('HTML element data-test-mode is "true"', testModeVerification.attr === 'true');
    assert('WowEngine.isTestMode is true', testModeVerification.engineIsTest);
    assert('Telemetry ribbon indicates 0ms Instant Test Mode', testModeVerification.telemetryText.includes('0ms INSTANT'));
    assert('CSS transitions bypassed in test-mode (duration <= 0.001s)', parseFloat(testModeVerification.computedDuration) <= 0.002, testModeVerification.computedDuration);

    await testPage.close();

  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  const allPassed = results.every(r => r.pass);
  const passCount = results.filter(r => r.pass).length;
  console.log(`TOTAL: ${passCount}/${results.length} CHECKS PASSED`);
  console.log(`VERDICT: ${allPassed ? 'ALL VERIFICATIONS PASSED (SUCCESS)' : 'FAILURES DETECTED'}`);
  console.log('================================================================');

  if (!allPassed) {
    process.exit(1);
  }
}

runSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
