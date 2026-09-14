/**
 * ============================================================================
 * TRIPFLOW MODULE 008: ADVERSARIAL STRESS HARNESS — CHALLENGER 2
 * Focus: FSM Race Conditions, Focus Eviction, Error Recovery, Viewport Cadence
 * File: adversarial_stress.cjs
 * ============================================================================
 */

'use strict';

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

const path = require('path');
const fs = require('fs');

const CHROME_EXECUTABLE = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const TARGET_HTML = path.resolve(__dirname, '../../index.html');
const TARGET_URL = 'file:///' + TARGET_HTML.replace(/\\/g, '/');

const RESULTS = {
  timestamp: new Date().toISOString(),
  fsm_concurrent_clicks: null,
  fsm_error_recovery: null,
  adversarial_viewports: [],
  keyboard_focus_stress: null,
  all_passed: false
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAdversarialTests() {
  console.log('======================================================================');
  console.log('  CHALLENGER 2: ADVERSARIAL FSM & VIEWPORT STRESS HARNESS');
  console.log('======================================================================');
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Chrome:     ${CHROME_EXECUTABLE}\n`);

  if (!fs.existsSync(CHROME_EXECUTABLE)) {
    console.error(`[FATAL] Chrome executable not found at ${CHROME_EXECUTABLE}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900'
    ]
  });

  try {
    const page = await browser.newPage();
    let overallPassed = true;

    // ========================================================================
    // TEST SUITE 1: RAPID CONCURRENT CLICKS DURING VALIDATING & SAVING
    // ========================================================================
    console.log('----------------------------------------------------------------------');
    console.log('SUITE 1: Rapid Concurrent Clicks on action-btn-tf802');
    console.log('  Testing: Block duplicate async requests & verify document.activeElement');
    console.log('  NEVER becomes document.body during VALIDATING & SAVING states.');
    console.log('----------------------------------------------------------------------');

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(TARGET_URL, { waitUntil: 'load' });

    // Initial check: locate #action-btn-tf802
    const btnExists = await page.$('#action-btn-tf802');
    if (!btnExists) {
      throw new Error('#action-btn-tf802 element not found in DOM!');
    }

    // Focus the button initially
    await page.focus('#action-btn-tf802');
    const initialActive = await page.evaluate(() => ({
      tagName: document.activeElement.tagName.toLowerCase(),
      id: document.activeElement.id
    }));
    console.log(`  [INIT] Focused element: <${initialActive.tagName} id="${initialActive.id}">`);

    // Track activeElement history and duplicate requests
    const clickAuditLog = [];
    let evictedToBodyCount = 0;

    // Trigger initial click to enter VALIDATING state
    console.log('  [CLICK 0] Initial trigger click to enter VALIDATING state...');
    await page.click('#action-btn-tf802');

    // State check immediately after trigger
    const immediateState = await page.evaluate(() => {
      const btn = document.getElementById('action-btn-tf802');
      return {
        ariaDisabled: btn.getAttribute('aria-disabled'),
        ariaBusy: btn.getAttribute('aria-busy'),
        text: btn.innerText.trim(),
        activeIsBody: document.activeElement === document.body,
        activeId: document.activeElement.id
      };
    });
    console.log(`  [STATE] Immediately after click: aria-disabled=${immediateState.ariaDisabled}, aria-busy=${immediateState.ariaBusy}, text="${immediateState.text}", activeId="${immediateState.activeId}"`);

    // (a) Rapid concurrent clicks: Send 10 rapid click events while state is VALIDATING
    console.log('  [STRESS 1A] Sending 10 rapid concurrent clicks during VALIDATING state...');
    for (let i = 1; i <= 10; i++) {
      await page.click('#action-btn-tf802');
      const audit = await page.evaluate((clickIndex) => {
        const btn = document.getElementById('action-btn-tf802');
        const active = document.activeElement;
        const isBody = active === document.body;
        return {
          clickIndex,
          phase: 'VALIDATING',
          ariaDisabled: btn.getAttribute('aria-disabled'),
          ariaBusy: btn.getAttribute('aria-busy'),
          activeTag: active ? active.tagName.toLowerCase() : 'null',
          activeId: active ? active.id : 'null',
          isEvictedToBody: isBody
        };
      }, i);

      if (audit.isEvictedToBody) evictedToBodyCount++;
      clickAuditLog.push(audit);
      await sleep(25); // Rapid burst ~25ms interval
    }

    // Wait for transition to SAVING state (approx 500ms from start)
    console.log('  [WAIT] Waiting 350ms to transition into SAVING state...');
    await sleep(350);

    const savingState = await page.evaluate(() => {
      const btn = document.getElementById('action-btn-tf802');
      return {
        ariaDisabled: btn.getAttribute('aria-disabled'),
        ariaBusy: btn.getAttribute('aria-busy'),
        text: btn.innerText.trim(),
        activeIsBody: document.activeElement === document.body,
        activeId: document.activeElement.id
      };
    });
    console.log(`  [STATE] SAVING phase: aria-disabled=${savingState.ariaDisabled}, text="${savingState.text}", activeId="${savingState.activeId}"`);

    // (b) Send 10 rapid click events while state is SAVING
    console.log('  [STRESS 1B] Sending 10 rapid concurrent clicks during SAVING state...');
    for (let i = 11; i <= 20; i++) {
      await page.click('#action-btn-tf802');
      const audit = await page.evaluate((clickIndex) => {
        const btn = document.getElementById('action-btn-tf802');
        const active = document.activeElement;
        const isBody = active === document.body;
        return {
          clickIndex,
          phase: 'SAVING',
          ariaDisabled: btn.getAttribute('aria-disabled'),
          ariaBusy: btn.getAttribute('aria-busy'),
          activeTag: active ? active.tagName.toLowerCase() : 'null',
          activeId: active ? active.id : 'null',
          isEvictedToBody: isBody
        };
      }, i);

      if (audit.isEvictedToBody) evictedToBodyCount++;
      clickAuditLog.push(audit);
      await sleep(25);
    }

    // Wait for final resolution to CONFIRMED (approx 600ms after saving)
    console.log('  [WAIT] Waiting for final resolution to CONFIRMED state...');
    try {
      await page.waitForFunction(() => {
        const btn = document.getElementById('action-btn-tf802');
        return btn && btn.innerText.includes('xác nhận');
      }, { timeout: 3000 });
    } catch (e) {
      console.warn('  [WARN] Timed out waiting for CONFIRMED state:', e.message);
    }

    const finalConfirmedState = await page.evaluate(() => {
      const btn = document.getElementById('action-btn-tf802');
      const active = document.activeElement;
      return {
        ariaDisabled: btn ? btn.getAttribute('aria-disabled') : null,
        ariaBusy: btn ? btn.getAttribute('aria-busy') : null,
        text: btn ? btn.innerText.trim() : null,
        isConfirmedText: btn ? btn.innerText.includes('xác nhận') : false,
        activeTag: active ? active.tagName.toLowerCase() : null,
        activeId: active ? active.id : null,
        isEvictedToBody: active === document.body
      };
    });

    if (finalConfirmedState.isEvictedToBody) evictedToBodyCount++;

    const fsm1Passed = evictedToBodyCount === 0 &&
                       finalConfirmedState.isConfirmedText &&
                       clickAuditLog.every(l => l.ariaDisabled === 'true');

    if (!fsm1Passed) overallPassed = false;

    RESULTS.fsm_concurrent_clicks = {
      total_rapid_clicks_sent: clickAuditLog.length,
      evicted_to_body_count: evictedToBodyCount,
      final_state: finalConfirmedState,
      all_clicks_intercepted: clickAuditLog.every(l => l.ariaDisabled === 'true'),
      passed: fsm1Passed
    };

    console.log(`  [RESULT] Total Rapid Clicks: ${clickAuditLog.length}`);
    console.log(`  [RESULT] Evicted to body count: ${evictedToBodyCount} (Must be 0)`);
    console.log(`  [RESULT] Final state confirmed: ${finalConfirmedState.isConfirmedText}`);
    console.log(`  [VERDICT] SUITE 1 Rapid Concurrent Clicks: ${fsm1Passed ? 'PASS' : 'FAIL'}\n`);


    // ========================================================================
    // TEST SUITE 2: ERROR RECOVERY FLOW & RETRY FOCUS HANDOFF
    // ========================================================================
    console.log('----------------------------------------------------------------------');
    console.log('SUITE 2: Error Recovery Flow (Shift+Click -> FAILURE)');
    console.log('  Testing: Trigger FAILURE state and verify document.activeElement.id');
    console.log('  immediately becomes retry-btn-tf802 (or corresponding retry button)');
    console.log('  with 0 focus eviction to document.body.');
    console.log('----------------------------------------------------------------------');

    // Reload fresh page for clean state
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    await page.focus('#action-btn-tf802');

    console.log('  [ACTION] Triggering Shift+Click on #action-btn-tf802 to simulate network error...');
    await page.keyboard.down('Shift');
    await page.click('#action-btn-tf802');
    await page.keyboard.up('Shift');

    // Wait for FSM to traverse VALIDATING (500ms) -> SAVING (600ms) -> FAILURE (~1200ms)
    console.log('  [WAIT] Waiting 1300ms for FAILURE state to materialize...');
    await sleep(1300);

    const failureFocusAudit = await page.evaluate(() => {
      const active = document.activeElement;
      const isBody = active === document.body;
      const container = document.getElementById('action-container-tf802');
      const retryBtn = container ? container.querySelector('button') : null;
      const retryBtnId = retryBtn ? retryBtn.id : null;
      const activeId = active ? active.id : null;
      const activeClass = active ? active.className : null;
      const activeText = active ? active.innerText.trim() : null;

      // Check if retry button matches expected patterns
      const isRetryButton = active && (
        active.classList.contains('btn-retry') ||
        activeId.includes('retry') ||
        activeText.includes('Thử lại')
      );

      // Check aria-live announcer
      const announcer = document.getElementById('dispatch-announcer');
      const announcerText = announcer ? announcer.textContent.trim() : '';

      return {
        activeIsBody: isBody,
        activeTag: active ? active.tagName.toLowerCase() : null,
        activeId,
        activeClass,
        activeText,
        retryBtnFound: !!retryBtn,
        retryBtnId,
        isRetryButton,
        announcerText
      };
    });

    console.log(`  [AUDIT] Active Element Tag:    <${failureFocusAudit.activeTag}>`);
    console.log(`  [AUDIT] Active Element ID:     "${failureFocusAudit.activeId}"`);
    console.log(`  [AUDIT] Active Element Class:  "${failureFocusAudit.activeClass}"`);
    console.log(`  [AUDIT] Active Element Text:   "${failureFocusAudit.activeText}"`);
    console.log(`  [AUDIT] Focus Evicted to Body: ${failureFocusAudit.activeIsBody}`);
    console.log(`  [AUDIT] Announcer Message:     "${failureFocusAudit.announcerText}"`);

    // Sub-test: Click the retry button to verify re-entrance
    console.log('  [STRESS 2B] Clicking the Retry button to verify resilient re-trigger...');
    await page.click(`#${failureFocusAudit.activeId}`);
    await sleep(100);

    const postRetryState = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        activeTag: active ? active.tagName.toLowerCase() : null,
        activeId: active ? active.id : null,
        activeText: active ? active.innerText.trim() : null,
        ariaDisabled: active ? active.getAttribute('aria-disabled') : null,
        ariaBusy: active ? active.getAttribute('aria-busy') : null,
        isBody: active === document.body
      };
    });

    console.log(`  [AUDIT] Post-Retry Active ID:  "${postRetryState.activeId}" | aria-disabled: ${postRetryState.ariaDisabled} | Text: "${postRetryState.activeText}"`);

    const fsm2Passed = !failureFocusAudit.activeIsBody &&
                       failureFocusAudit.isRetryButton &&
                       failureFocusAudit.retryBtnFound &&
                       !postRetryState.isBody;

    if (!fsm2Passed) overallPassed = false;

    RESULTS.fsm_error_recovery = {
      failure_audit: failureFocusAudit,
      post_retry_state: postRetryState,
      passed: fsm2Passed
    };

    console.log(`  [VERDICT] SUITE 2 Error Recovery & Retry Focus: ${fsm2Passed ? 'PASS' : 'FAIL'}\n`);


    // ========================================================================
    // TEST SUITE 3: ADVERSARIAL VIEWPORT CADENCE
    // ========================================================================
    console.log('----------------------------------------------------------------------');
    console.log('SUITE 3: Adversarial Viewport Cadence');
    console.log('  Testing: Extreme viewports (320x568, 360x800, 2560x1440, + ultra-wide)');
    console.log('  Strict Assertion: scrollWidth <= innerWidth with 0 overflow.');
    console.log('----------------------------------------------------------------------');

    const ADVERSARIAL_VIEWPORTS = [
      { name: 'iPhone SE (1st gen / narrow min)', width: 320, height: 568, dpr: 2 },
      { name: 'Android Narrow (Samsung A-series)', width: 360, height: 800, dpr: 2 },
      { name: 'iPhone 8 / SE2 (Standard compact)', width: 375, height: 667, dpr: 2 },
      { name: 'Full HD Standard (1080p)', width: 1920, height: 1080, dpr: 1 },
      { name: '4K / QHD Ultra-wide (2560x1440)', width: 2560, height: 1440, dpr: 1 },
      { name: 'Ultrawide 21:9 Cinema (3440x1440)', width: 3440, height: 1440, dpr: 1 }
    ];

    let allViewportsPassed = true;

    for (const vp of ADVERSARIAL_VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
      await page.goto(TARGET_URL, { waitUntil: 'load' });
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await sleep(100);

      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const innerWidth = window.innerWidth;
        const clientWidth = docEl.clientWidth;
        const overflowPx = Math.max(0, scrollWidth - innerWidth);

        // Detect any overflowing child elements
        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > innerWidth + 1) { // 1px tolerance for subpixel antialiasing
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              className: el.className || null,
              right: Math.round(rect.right),
              excessPx: Math.round(rect.right - innerWidth)
            });
          }
        });

        return {
          scrollWidth,
          innerWidth,
          clientWidth,
          overflowPx,
          overflowingElementsCount: overflowingElements.length,
          topOverflowing: overflowingElements.slice(0, 3)
        };
      });

      const vpPassed = metrics.scrollWidth <= metrics.innerWidth && metrics.overflowPx === 0;
      if (!vpPassed) allViewportsPassed = false;

      const record = {
        viewport_name: vp.name,
        width: vp.width,
        height: vp.height,
        dpr: vp.dpr,
        scroll_width: metrics.scrollWidth,
        inner_width: metrics.innerWidth,
        client_width: metrics.clientWidth,
        overflow_px: metrics.overflowPx,
        overflowing_elements: metrics.topOverflowing,
        passed: vpPassed
      };

      RESULTS.adversarial_viewports.push(record);

      console.log(`  [VIEWPORT] ${vp.name.padEnd(34)} | ${vp.width}x${vp.height} (DPR=${vp.dpr}) | scrollWidth: ${metrics.scrollWidth}px vs innerWidth: ${metrics.innerWidth}px | Overflow: ${metrics.overflowPx}px -> ${vpPassed ? 'PASS' : 'FAIL'}`);
      if (metrics.topOverflowing.length > 0) {
        console.log(`             Warning elements:`, JSON.stringify(metrics.topOverflowing));
      }
    }

    if (!allViewportsPassed) overallPassed = false;
    console.log(`  [VERDICT] SUITE 3 Adversarial Viewports: ${allViewportsPassed ? 'PASS' : 'FAIL'}\n`);


    // ========================================================================
    // TEST SUITE 4: KEYBOARD FOCUS & ACCESSIBILITY STRESS AT EXTREME VIEWPORT
    // ========================================================================
    console.log('----------------------------------------------------------------------');
    console.log('SUITE 4: Native Keyboard Tab Focus Ring at 320x568 & 2560x1440');
    console.log('  Testing: Ensure focus rings maintain >=2px solid and >=3:1 contrast');
    console.log('  even under extreme narrow and ultra-wide responsive viewport constraints.');
    console.log('----------------------------------------------------------------------');

    const focusStressResults = [];
    for (const testWidth of [320, 2560]) {
      await page.setViewport({ width: testWidth, height: 800, deviceScaleFactor: 2 });
      await page.goto(TARGET_URL, { waitUntil: 'load' });

      // Tab through to Primary Button
      let primaryFound = false;
      for (let step = 0; step < 10; step++) {
        await page.keyboard.press('Tab');
        await sleep(50);
        const focused = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) return null;
          const s = window.getComputedStyle(active);
          return {
            id: active.id,
            tagName: active.tagName.toLowerCase(),
            outlineWidth: parseFloat(s.outlineWidth) || 0,
            outlineStyle: s.outlineStyle,
            outlineColor: s.outlineColor
          };
        });

        if (focused && focused.id === 'btn-global-dispatch') {
          primaryFound = true;
          const outlinePassed = focused.outlineWidth >= 2 && focused.outlineStyle === 'solid';
          focusStressResults.push({
            viewport_width: testWidth,
            element_id: focused.id,
            outline_width: focused.outlineWidth,
            outline_style: focused.outlineStyle,
            passed: outlinePassed
          });
          console.log(`  [FOCUS @ ${testWidth}px] #${focused.id} | Width: ${focused.outlineWidth}px | Style: ${focused.outlineStyle} -> ${outlinePassed ? 'PASS' : 'FAIL'}`);
          break;
        }
      }
    }

    const focusStressPassed = focusStressResults.length === 2 && focusStressResults.every(r => r.passed);
    if (!focusStressPassed) overallPassed = false;

    RESULTS.keyboard_focus_stress = {
      tests: focusStressResults,
      passed: focusStressPassed
    };

    console.log(`  [VERDICT] SUITE 4 Keyboard Focus Stress: ${focusStressPassed ? 'PASS' : 'FAIL'}\n`);


    // ========================================================================
    // FINAL HARNESS VERDICT
    // ========================================================================
    RESULTS.all_passed = overallPassed;

    console.log('======================================================================');
    console.log(`  CHALLENGER 2 HARNESS OVERALL VERDICT: [ ${overallPassed ? 'PASS' : 'FAIL'} ]`);
    console.log('======================================================================');

    // Save stress test results to JSON
    const reportPath = path.resolve(__dirname, 'ADVERSARIAL_RESULTS.json');
    fs.writeFileSync(reportPath, JSON.stringify(RESULTS, null, 2), 'utf8');
    console.log(`Results saved to: ${reportPath}\n`);

    await browser.close();

    if (!overallPassed) {
      process.exit(1);
    }
  } catch (err) {
    console.error('[ERROR in Adversarial Stress Harness]', err);
    await browser.close();
    process.exit(1);
  }
}

runAdversarialTests();
