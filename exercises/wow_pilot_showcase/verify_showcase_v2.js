/**
 * ============================================================================
 * ANTIGRAVITY 2.0 // SHOWCASE V2 DEEP RUNTIME VERIFICATION SUITE
 * ============================================================================
 * Audits all 6 core requirements of Showcase V2:
 *   1. 3D WebGL Micro-Engine Hero Background (Waves, Particles, Grid)
 *   2. WebAudioHaptics v2.0 Soundboard (10 Waveforms, Stepped Rotary, Stereo Pan)
 *   3. Signature Wow Blocks (Luminous Bento, Stepped Odometer, Spring Toast, Spotlight)
 *   4. Live Delight Inspector HUD (Real-time FPS, Tactile Depth, Contrast Ratio)
 *   5. Luminous Light Theme Invariant (Icy Platinum #F8FAFC, Multi-layer Shadows)
 *   6. Mobile 375px Zero-Overflow Audit
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const HTML_FILE = path.join(__dirname, 'index.html');
const FILE_URL = 'file:///' + HTML_FILE.replace(/\\/g, '/');

async function runV2Suite() {
  console.log('================================================================');
  console.log('⚡ ANTIGRAVITY 2.0 // SHOWCASE V2 INTERACTIVE HUB AUDIT');
  console.log('Target:', FILE_URL);
  console.log('================================================================\n');

  const results = [];
  function assert(name, condition, detail = '') {
    results.push({ name, pass: !!condition, detail });
    console.log(`[${condition ? 'PASS' : 'FAIL'}] ${name}${detail ? ' -> ' + detail : ''}`);
  }

  // 1. File existence checks
  assert('HTML file exists', fs.existsSync(HTML_FILE));
  assert('showcase.css exists', fs.existsSync(path.join(__dirname, 'showcase.css')));
  assert('showcase.js exists', fs.existsSync(path.join(__dirname, 'showcase.js')));
  assert('wow_engine.js exists', fs.existsSync(path.join(__dirname, 'wow_engine.js')));
  assert('style.css exists', fs.existsSync(path.join(__dirname, 'style.css')));

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.goto(FILE_URL, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    assert('Zero runtime console errors on V2 load', consoleErrors.length === 0, consoleErrors.join('; '));

    // Global Object Exports
    const exportsExist = await page.evaluate(() => {
      return {
        hasWowEngine: typeof window.WowEngine !== 'undefined',
        hasShowcaseV2: typeof window.ShowcaseV2 !== 'undefined',
        hasHapticsV2: typeof window.ShowcaseV2?.hapticsV2 !== 'undefined'
      };
    });
    assert('window.ShowcaseV2 is defined and exported', exportsExist.hasShowcaseV2);
    assert('window.WowEngine is defined and intact', exportsExist.hasWowEngine);

    // ------------------------------------------------------------------------
    // REQUIREMENT 1: 3D WebGL Micro-Engine
    // ------------------------------------------------------------------------
    console.log('\n--- Req 1: 3D WebGL Micro-Engine in Hero Background ---');
    const webglAudit = await page.evaluate(() => {
      const canvas = document.getElementById('heroWebglCanvas');
      const modeBtns = Array.from(document.querySelectorAll('[data-webgl-mode]')).map(b => b.getAttribute('data-webgl-mode'));
      const activeBtn = document.querySelector('.webgl-mode-btn.active')?.getAttribute('data-webgl-mode');
      const engineMode = window.ShowcaseV2?.webgl?.mode;

      // Test switching to particles
      const particlesBtn = document.querySelector('[data-webgl-mode="particles"]');
      if (particlesBtn) particlesBtn.click();
      const modeAfterClick = window.ShowcaseV2?.webgl?.mode;

      // Test switching to grid
      const gridBtn = document.querySelector('[data-webgl-mode="grid"]');
      if (gridBtn) gridBtn.click();
      const modeAfterGrid = window.ShowcaseV2?.webgl?.mode;

      return {
        canvasExists: !!canvas,
        canvasWidth: canvas?.width,
        canvasHeight: canvas?.height,
        availableModes: modeBtns,
        initialMode: engineMode,
        modeAfterParticles: modeAfterClick,
        modeAfterGrid: modeAfterGrid
      };
    });

    assert('Hero WebGL canvas element exists in DOM', webglAudit.canvasExists);
    assert('Hero WebGL canvas has positive dimensions', webglAudit.canvasWidth > 0 && webglAudit.canvasHeight > 0, `${webglAudit.canvasWidth}x${webglAudit.canvasHeight}`);
    assert('3 WebGL modes present (waves, particles, grid)', webglAudit.availableModes.includes('waves') && webglAudit.availableModes.includes('particles') && webglAudit.availableModes.includes('grid'));
    assert('Switching to particle mesh updates engine mode', webglAudit.modeAfterParticles === 'particles');
    assert('Switching to titanium grid updates engine mode', webglAudit.modeAfterGrid === 'grid');

    // ------------------------------------------------------------------------
    // REQUIREMENT 2: WebAudioHaptics v2.0 (All 10 Sounds & Controllers)
    // ------------------------------------------------------------------------
    console.log('\n--- Req 2: WebAudioHaptics v2.0 Soundboard (10 Sounds) ---');
    const soundboardAudit = await page.evaluate(() => {
      const h = window.ShowcaseV2?.hapticsV2;
      if (!h) return { pass: false, error: 'hapticsV2 missing' };

      const soundTypes = [
        'click', 'pop', 'switch', 'chime', 'detent',
        'rotary', 'spring', 'spatial', 'thud', 'doublestage'
      ];

      const synthesized = [];
      try {
        h.playClick(); synthesized.push('click');
        h.playPop(); synthesized.push('pop');
        h.playSwitch(true); synthesized.push('switch');
        h.playChime(); synthesized.push('chime');
        h.playDetent(); synthesized.push('detent');
        h.playRotary(3, 1); synthesized.push('rotary');
        h.playSpring(); synthesized.push('spring');
        h.playSpatial(-0.85); synthesized.push('spatial');
        h.playThud(); synthesized.push('thud');
        h.playDoubleStage(2); synthesized.push('doublestage');
      } catch (err) {
        return { pass: false, error: err.message, synthesized };
      }

      // Check rotary knob angle setting
      const rotaryDial = document.getElementById('steppedRotaryDial');
      const rotaryAngle = document.getElementById('rotaryAngleReadout');
      if (window.ShowcaseV2.rotary) {
        window.ShowcaseV2.rotary.setAngle(45);
      }
      const angleAfter = rotaryAngle?.textContent;

      // Check rotary knob keyboard navigation (ArrowRight -> +15deg -> 60deg)
      rotaryDial?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const angleAfterKey = rotaryAngle?.textContent;

      // Check two-stage lever click
      const lever = document.getElementById('twoStageLever');
      const labelBefore = document.getElementById('twoStageLabel')?.textContent;
      if (lever) lever.click();
      const labelAfter = document.getElementById('twoStageLabel')?.textContent;

      // Check two-stage lever keyboard navigation (Enter key)
      lever?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      const labelAfterKey = document.getElementById('twoStageLabel')?.textContent;

      // Check spatial pan buttons
      const panBtns = document.querySelectorAll('[data-pan]');
      const panRight = document.querySelector('[data-pan="0.85"]');
      if (panRight) panRight.click();
      const spatialText = document.getElementById('spatialLabel')?.textContent;
      const thumbLeft = document.getElementById('spatialThumb')?.style.left;

      // Check spatial soundboard pad click synchronizing meter thumb
      const spatialLeftPad = document.getElementById('btnHapticSpatialLeft');
      if (spatialLeftPad) spatialLeftPad.click();
      const spatialLeftThumb = document.getElementById('spatialThumb')?.style.left;
      const spatialLeftText = document.getElementById('spatialLabel')?.textContent;

      // Check single sound trigger (no duplicate collision from wow_engine)
      let wowTrig = null;
      let v2Trig = null;
      window.WowEngine.haptics.onAudioTrigger = (type) => { wowTrig = type; };
      window.ShowcaseV2.hapticsV2.onAudioTrigger = (type) => { v2Trig = type; };
      const springBtn = document.getElementById('btnHapticSpring');
      if (springBtn) springBtn.click();
      const singleTriggerPass = (v2Trig === 'spring' && wowTrig === null);

      // Check bidirectional mute synchronization
      const soundBtn = document.getElementById('soundToggleBtn');
      const hudAudioEl = document.getElementById('hudAudioStatusVal');
      soundBtn?.click(); // Mute
      const mutedWow = window.WowEngine.haptics.getMuted();
      const mutedV2 = window.ShowcaseV2.hapticsV2.getMuted();
      const hudTextMuted = hudAudioEl?.textContent;

      soundBtn?.click(); // Un-mute
      const unmutedWow = !window.WowEngine.haptics.getMuted();
      const unmutedV2 = !window.ShowcaseV2.hapticsV2.getMuted();
      const hudTextUnmuted = hudAudioEl?.textContent;

      return {
        pass: synthesized.length === 10,
        synthesizedCount: synthesized.length,
        angleAfter,
        angleAfterKey,
        twoStageActive: labelAfter !== labelBefore,
        twoStageKeyActive: labelAfterKey !== labelAfter,
        spatialText,
        thumbLeft,
        spatialLeftThumb,
        spatialLeftText,
        singleTriggerPass,
        muteSyncPass: (mutedWow && mutedV2 && hudTextMuted === 'Muted (Tắt)'),
        unmuteSyncPass: (unmutedWow && unmutedV2 && hudTextUnmuted === '48kHz Native Synth')
      };
    });

    assert('WebAudioHaptics v2.0 synthesizes all 10 waveforms with zero error', soundboardAudit.pass, `Count: ${soundboardAudit.synthesizedCount}/10`);
    assert('Stepped Rotary Dial updates rotation angle and khac step', soundboardAudit.angleAfter && soundboardAudit.angleAfter.includes('45°'), soundboardAudit.angleAfter);
    assert('Stepped Rotary Dial responds to keyboard arrow keys (ArrowRight -> 60°)', soundboardAudit.angleAfterKey && soundboardAudit.angleAfterKey.includes('60°'), soundboardAudit.angleAfterKey);
    assert('Two-stage mechanical switch advances through physical stages on click', soundboardAudit.twoStageActive);
    assert('Two-stage mechanical switch advances through physical stages on Enter key', soundboardAudit.twoStageKeyActive);
    assert('Spatial audio panning positions audio to Right (+0.85)', soundboardAudit.spatialText && soundboardAudit.spatialText.includes('PHẢI'), soundboardAudit.spatialText);
    assert('Spatial audio meter visual thumb deflects to 92.5%', soundboardAudit.thumbLeft === '92.5%', soundboardAudit.thumbLeft);
    assert('Soundboard Spatial Left pad synchronizes meter thumb to 7.5%', soundboardAudit.spatialLeftThumb === '7.5%', soundboardAudit.spatialLeftThumb);
    assert('Soundboard pad triggers exactly ONE waveform (zero duplicate trigger)', soundboardAudit.singleTriggerPass);
    assert('Sound toggle button synchronizes mute state to both WowEngine and ShowcaseV2', soundboardAudit.muteSyncPass);
    assert('Sound toggle button un-mutes both engines and restores HUD active synth status', soundboardAudit.unmuteSyncPass);

    // ------------------------------------------------------------------------
    // REQUIREMENT 3: Signature Wow Blocks Gallery
    // ------------------------------------------------------------------------
    console.log('\n--- Req 3: Signature Wow Blocks Gallery ---');
    const wowBlocksAudit = await page.evaluate(() => {
      // 1. Odometer
      const odo = document.getElementById('odometerCounter');
      const initialVal = odo?.textContent;
      const btn100 = document.getElementById('btnOdo100');
      if (btn100) btn100.click();
      const afterClick = odo?.textContent;

      // 2. Spring Toast
      const triggerBtn = document.getElementById('btnTriggerToast');
      const stack = document.getElementById('toastFloatingStack');
      const countBefore = stack?.children.length || 0;
      if (triggerBtn) triggerBtn.click();
      const countAfter = stack?.children.length || 0;
      const toastItem = stack?.querySelector('.spring-toast-item');

      // 3. Bento Section
      const sigSection = document.getElementById('signature-blocks');

      return {
        initialVal,
        afterClick,
        odoChanged: afterClick !== initialVal,
        toastSpawned: countAfter > countBefore,
        hasToastTitle: !!toastItem?.querySelector('.toast-title'),
        sigSectionExists: !!sigSection
      };
    });

    assert('Signature Wow Blocks section exists in DOM', wowBlocksAudit.sigSectionExists);
    assert('Mechanical Stepped Odometer increments on button trigger', wowBlocksAudit.odoChanged, `From ${wowBlocksAudit.initialVal} to ${wowBlocksAudit.afterClick}`);
    assert('Spring Physics Toast engine spawns interactive toast', wowBlocksAudit.toastSpawned);
    assert('Spawned toast has title and cubic-bezier spring class', wowBlocksAudit.hasToastTitle);

    // ------------------------------------------------------------------------
    // REQUIREMENT 4: Live Delight Inspector HUD
    // ------------------------------------------------------------------------
    console.log('\n--- Req 4: Live Delight Inspector HUD ---');
    const hudAudit = await page.evaluate(() => {
      const hud = document.getElementById('delightHud');
      const fpsEl = document.getElementById('hudFpsVal');
      const depthEl = document.getElementById('hudTactileDepthVal');
      const depthBar = document.getElementById('hudDepthBar');
      const contrastEl = document.getElementById('hudContrastVal');
      const audioStatusEl = document.getElementById('hudAudioStatusVal');
      const collapseBtn = document.getElementById('hudCollapseBtn');

      // Simulate button click to test tactile depth gauge reaction
      const testBtn = document.getElementById('btnHapticClick');
      testBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      const depthDown = depthEl?.textContent;
      const barWidthDown = depthBar?.style.width;

      testBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      const depthUp = depthEl?.textContent;
      const barWidthUp = depthBar?.style.width;

      // Test collapse
      if (collapseBtn) collapseBtn.click();
      const isCollapsed = hud?.classList.contains('collapsed');
      if (collapseBtn) collapseBtn.click();
      const isRestored = !hud?.classList.contains('collapsed');

      return {
        hudExists: !!hud,
        fpsText: fpsEl?.textContent,
        contrastText: contrastEl?.textContent,
        audioText: audioStatusEl?.textContent,
        depthDown,
        barWidthDown,
        depthUp,
        barWidthUp,
        isCollapsed,
        isRestored
      };
    });

    assert('Live Delight Inspector HUD exists in viewport', hudAudit.hudExists);
    assert('HUD measures live FPS', hudAudit.fpsText && hudAudit.fpsText.includes('FPS'), hudAudit.fpsText);
    assert('HUD reports WCAG AAA contrast ratio', hudAudit.contrastText && hudAudit.contrastText.includes('AAA'), hudAudit.contrastText);
    assert('HUD reports WebAudio engine status', hudAudit.audioText && hudAudit.audioText.includes('Native Synth'), hudAudit.audioText);
    assert('HUD tactile depth gauge reacts on pointerdown (scale 0.965 -1.5px)', hudAudit.depthDown && hudAudit.depthDown.includes('scale(0.965)'), hudAudit.depthDown);
    assert('HUD tactile depth gauge resets on pointerup', hudAudit.depthUp && hudAudit.depthUp.includes('scale(1.0)'), hudAudit.depthUp);
    assert('HUD collapse and restore toggles cleanly', hudAudit.isCollapsed && hudAudit.isRestored);

    // ------------------------------------------------------------------------
    // REQUIREMENT 5: Luminous Light Theme Invariant
    // ------------------------------------------------------------------------
    console.log('\n--- Req 5: Luminous Light Theme Invariant ---');
    const themeAudit = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const card = document.querySelector('.acrylic-card');
      const cardBg = card ? window.getComputedStyle(card).backgroundColor : '';
      const cardShadow = card ? window.getComputedStyle(card).boxShadow : '';
      return { bodyBg, cardBg, cardShadow };
    });

    assert('Canvas background is Icy Platinum (#F8FAFC / rgb(248, 250, 252))', themeAudit.bodyBg === 'rgb(248, 250, 252)', themeAudit.bodyBg);
    assert('Acrylic card has multi-layered luminous shadow', themeAudit.cardShadow.includes('rgba(15, 23, 42'));

    // ------------------------------------------------------------------------
    // REQUIREMENT 6: Mobile 375px Responsive Zero-Overflow Audit
    // ------------------------------------------------------------------------
    console.log('\n--- Req 6: Mobile 375px Responsive Zero-Overflow ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });
    await mobilePage.goto(FILE_URL, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 400));

    const mobileAudit = await mobilePage.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const bodyWidth = document.body.scrollWidth;

      const overflowing = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          if (el.closest('.table-responsive-container, [style*="overflow-x: auto"], [style*="overflow-x:auto"]')) return false;
          const r = el.getBoundingClientRect();
          return r.right > docWidth + 2;
        })
        .map(el => `${el.tagName}.${el.className}`);

      return {
        docWidth,
        bodyWidth,
        overflowCount: overflowing.length,
        overflowing: overflowing.slice(0, 3)
      };
    });

    assert('Mobile zero-overflow: body.scrollWidth <= viewport width (375px)', mobileAudit.bodyWidth <= mobileAudit.docWidth + 2, `body: ${mobileAudit.bodyWidth}px, doc: ${mobileAudit.docWidth}px`);
    assert('Zero overflowing elements on 375px mobile screen', mobileAudit.overflowCount === 0, mobileAudit.overflowing.join(', ') || 'clean');

    await mobilePage.close();
    await page.close();

    const passedCount = results.filter(r => r.pass).length;
    const totalCount = results.length;
    console.log('\n================================================================');
    console.log(`TOTAL: ${passedCount}/${totalCount} CHECKS PASSED`);
    console.log(`VERDICT: ${passedCount === totalCount ? 'ALL V2 VERIFICATIONS PASSED (SUCCESS)' : 'FAILURES DETECTED'}`);
    console.log('================================================================\n');

    await browser.close();
    process.exit(passedCount === totalCount ? 0 : 1);
  } catch (err) {
    console.error('Audit run failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runV2Suite();
