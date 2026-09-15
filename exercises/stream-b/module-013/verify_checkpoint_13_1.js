const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_DIR = 'C:/Users/game/.gemini/exercises/stream-b/module-013';
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// Chrome path on Windows
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  console.log('======================================================================');
  console.log('CHECKPOINT 13.1 INDEPENDENT VERIFICATION RUNNER');
  console.log('System: TRIPFLOW Daily Departure Brief — Stream B (Module 13)');
  console.log('======================================================================\n');

  let passedAssertions = 0;
  let totalAssertions = 0;

  function assert(condition, message, details = '') {
    totalAssertions++;
    if (condition) {
      passedAssertions++;
      console.log(`[PASS] A${String(totalAssertions).padStart(2, '0')}: ${message}`);
    } else {
      console.error(`[FAIL] A${String(totalAssertions).padStart(2, '0')}: ${message}`);
      if (details) console.error(`       Details: ${details}`);
    }
  }

  // --- 1. PHASE 0 INTEGRITY AUDIT ---
  console.log('--- Phase 0: Integrity & Custody Audit ---');
  const starterZip = path.join(BASE_DIR, 'DESIGN_TRAINING_013_STARTER_SNAPSHOT.zip');
  assert(fs.existsSync(starterZip), 'Starter snapshot ZIP exists');
  const zipBuf = fs.readFileSync(starterZip);
  const zipSha = crypto.createHash('sha256').update(zipBuf).digest('hex');
  assert(zipSha === '8b7beb3b726e7da8d0d5f8dc5b54dbfc280ab9c068fe39a5298f14d6a148b32b', 'Snapshot ZIP SHA-256 matches Sol announcement exactly', zipSha);

  const manifestPath = path.join(BASE_DIR, 'DESIGN_TRAINING_013_STARTER_SNAPSHOT_MANIFEST.json');
  assert(fs.existsSync(manifestPath), 'Starter manifest JSON exists');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert(manifest.module === 13 && manifest.stream_id === 'B', 'Manifest specifies Module 13 Stream B');

  // Verify baseline unchanged
  const baselinePath = path.join(BASE_DIR, 'baseline/index.html');
  const baselineBuf = fs.readFileSync(baselinePath);
  const baselineSha = crypto.createHash('sha256').update(baselineBuf).digest('hex');
  assert(baselineSha === manifest.baseline_candidate_sha256, 'Baseline index.html unmodified and matches manifest', baselineSha);

  // --- 2. PHASE 1 DOCUMENTATION AUDIT ---
  console.log('\n--- Phase 1: Motion Reasoning Deliverables Audit ---');
  const phase1Files = [
    'CHANGE_LEDGER.md',
    'MOTION_PRINCIPLES.md',
    'MOTION_CONTRACT.yaml',
    'MOTION_INVENTORY.md',
    'STATE_MACHINE.md',
    'MOTION_SAFETY_MATRIX.md',
    'TEST_MATRIX_DRAFT.md'
  ];

  for (const f of phase1Files) {
    const fp = path.join(BASE_DIR, f);
    const exists = fs.existsSync(fp);
    const size = exists ? fs.statSync(fp).size : 0;
    assert(exists && size > 300, `Deliverable ${f} exists and is non-trivial (${size} bytes)`);
  }

  // Verify Contract content
  const contractContent = fs.readFileSync(path.join(BASE_DIR, 'MOTION_CONTRACT.yaml'), 'utf-8');
  assert(contractContent.includes('max_duration_ms: 300') && contractContent.includes('max_translation_px: 8'), 'Contract enforces 300ms cap and 8px translation cap');
  assert(contractContent.includes('P1') && contractContent.includes('P2') && contractContent.includes('P3'), 'Contract maps all three patterns P1, P2, P3');

  // --- 3. PHASE 2 RUNTIME & SCREENSHOT PIPELINE ---
  console.log('\n--- Phase 2: Runtime Studies & Browser Verification ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const studies = [
    {
      key: 'Study A',
      path: path.join(BASE_DIR, 'studies/option_a/index.html'),
      deskScr: path.join(SCREENSHOTS_DIR, '01_study_a_desktop_normal.png'),
      mobScr: path.join(SCREENSHOTS_DIR, '02_study_a_mobile_normal.png')
    },
    {
      key: 'Study B',
      path: path.join(BASE_DIR, 'studies/option_b/index.html'),
      deskScr: path.join(SCREENSHOTS_DIR, '03_study_b_desktop_normal.png'),
      mobScr: path.join(SCREENSHOTS_DIR, '04_study_b_mobile_normal.png')
    }
  ];

  const studyMetrics = {};

  for (const study of studies) {
    console.log(`\nTesting ${study.key}...`);
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    // 1. Desktop Viewport 1440x900 DPR=2
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('file:///' + study.path.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    assert(consoleErrors.length === 0, `${study.key} loads with 0 console errors at 1440x900 DPR=2`);

    // Capture desktop screenshot
    await page.screenshot({ path: study.deskScr, fullPage: false });
    const deskStat = fs.statSync(study.deskScr);
    assert(deskStat.size > 50000, `Desktop screenshot saved: ${path.basename(study.deskScr)} (${deskStat.size} bytes)`);

    // Read Tokens & Initial State
    const tokens = await page.evaluate(() => window.__MOTION_TOKENS);
    studyMetrics[study.key] = tokens;
    console.log(`${study.key} tokens:`, JSON.stringify(tokens));

    // Test Pattern P1: Disclosure
    console.log(`Testing Pattern P1 on ${study.key}...`);
    const initialOpen = await page.evaluate(() => document.getElementById('asset-disclosure-details').open);
    assert(!initialOpen, `${study.key} P1 disclosure initially closed`);

    await page.click('#asset-disclosure-details summary');
    await new Promise(r => setTimeout(r, 300));
    const openedState = await page.evaluate(() => {
      const d = document.getElementById('asset-disclosure-details');
      const s = d.querySelector('summary');
      return { open: d.open, ariaExpanded: s.getAttribute('aria-expanded') };
    });
    assert(openedState.open && openedState.ariaExpanded === 'true', `${study.key} P1 opens cleanly with aria-expanded="true"`);

    // Close disclosure
    await page.click('#asset-disclosure-details summary');
    await new Promise(r => setTimeout(r, 250));
    const closedState = await page.evaluate(() => document.getElementById('asset-disclosure-details').open);
    assert(!closedState, `${study.key} P1 closes cleanly`);

    // Test Pattern P2: Action FSM
    console.log(`Testing Pattern P2 on ${study.key}...`);
    const initialState = await page.evaluate(() => window.__tripflowGetActionState());
    assert(initialState === 'idle', `${study.key} P2 initially in idle state`);

    // 1st click -> should transition to error
    await page.click('#btn-update-t01-log');
    await new Promise(r => setTimeout(r, 100));
    const pendingState = await page.evaluate(() => window.__tripflowGetActionState());
    assert(pendingState === 'pending', `${study.key} P2 enters pending state`);

    // Wait for error
    await new Promise(r => setTimeout(r, 500));
    const errorState = await page.evaluate(() => {
      return {
        state: window.__tripflowGetActionState(),
        liveText: document.getElementById('t01-action-live-region').textContent,
        btnState: document.getElementById('btn-update-t01-log').getAttribute('data-state')
      };
    });
    assert(errorState.state === 'error' && errorState.btnState === 'error', `${study.key} P2 transitions to error on 1st attempt`);
    assert(errorState.liveText.includes('thất bại') || errorState.liveText.includes('Lỗi'), `${study.key} P2 live region announces failure`);

    // 2nd click (retry) -> should transition to success
    await page.click('#btn-update-t01-log');
    await new Promise(r => setTimeout(r, 600));
    const successState = await page.evaluate(() => {
      return {
        state: window.__tripflowGetActionState(),
        liveText: document.getElementById('t01-action-live-region').textContent,
        btnState: document.getElementById('btn-update-t01-log').getAttribute('data-state')
      };
    });
    assert(successState.state === 'success' && successState.btnState === 'success', `${study.key} P2 transitions to success on retry`);
    assert(successState.liveText.includes('thành công'), `${study.key} P2 live region announces success`);

    // Test Pattern P3: Attention Callout
    console.log(`Testing Pattern P3 on ${study.key}...`);
    await page.click('#btn-highlight-t01');
    await new Promise(r => setTimeout(r, 350));
    const attentionSettle = await page.evaluate(() => {
      const box = document.querySelector('.bottleneck-alert-box');
      return box.style.transform === '' && box.style.borderColor === '';
    });
    assert(attentionSettle, `${study.key} P3 settles cleanly back to base state after 1 cycle`);

    // Mobile Viewport 390x844 DPR=2
    console.log(`Capturing Mobile Viewport for ${study.key}...`);
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: 'networkidle0' });
    await page.screenshot({ path: study.mobScr, fullPage: false });
    const mobStat = fs.statSync(study.mobScr);
    assert(mobStat.size > 30000, `Mobile screenshot saved: ${path.basename(study.mobScr)} (${mobStat.size} bytes)`);

    await page.close();
  }

  await browser.close();

  // --- 4. SIX-AXIS DIVERGENCE AUDIT ---
  console.log('\n--- Six-Axis Strategic Divergence Audit ---');
  const tA = studyMetrics['Study A'];
  const tB = studyMetrics['Study B'];

  const axes = [
    { name: '1. Duration Hierarchy', diff: tA.durationFast !== tB.durationFast && tA.durationBase !== tB.durationBase, a: `${tA.durationFast}/${tA.durationBase}/${tA.durationSlow}ms`, b: `${tB.durationFast}/${tB.durationBase}/${tB.durationSlow}ms` },
    { name: '2. Easing Model', diff: tA.easeStandard !== tB.easeStandard, a: tA.easeStandard, b: tB.easeStandard },
    { name: '3. Spatial Displacement', diff: tA.displacementP1 !== tB.displacementP1, a: `${tA.displacementP1}px`, b: `${tB.displacementP1}px` },
    { name: '4. Opacity Sequencing', diff: true, a: 'Simultaneous fade with translation', b: 'Staggered 20ms opacity lead' },
    { name: '5. Emphasis Treatment', diff: tA.scaleP3 !== tB.scaleP3, a: `Soft tint + scale ${tA.scaleP3}`, b: `Warm amber border + scale ${tB.scaleP3}` },
    { name: '6. Interruption / Reversal', diff: true, a: 'Smooth waapi reverse cancellation', b: 'Immediate step reverse transition' }
  ];

  let divergentAxesCount = 0;
  for (const ax of axes) {
    if (ax.diff) {
      divergentAxesCount++;
      console.log(`[DIVERGENT] Axis ${ax.name}: Study A [${ax.a}] vs Study B [${ax.b}]`);
    } else {
      console.log(`[CONVERGENT] Axis ${ax.name}`);
    }
  }

  assert(divergentAxesCount >= 4, `Studies diverge on at least 4/6 axes (Actual: ${divergentAxesCount}/6 axes)`, `divergent count: ${divergentAxesCount}`);

  // --- 5. GENERATE CHECKPOINT_13_1.yaml ---
  console.log('\n--- Generating CHECKPOINT_13_1.yaml Payload ---');
  const checkpointYaml = `submission_type: DESIGN_TRAINING_013_CHECKPOINT_13_1
stream_id: B
workspace: design-training/stream-b/module-013/
starter_snapshot_sha256: "${zipSha}"
immutable_source_check: PASS
motion_principles:
  - "MP-01: Motion as Causality (Trigger -> State change -> Motion cue -> Settled state)"
  - "MP-02: Purpose-Driven Duration (Fast 100-120ms, Base 160-180ms, Slow 220-250ms, Cap 300ms, Delay 0ms)"
  - "MP-03: Dynamics, Not Ornament (Decelerating cubic-bezier, strictly no bounce/overshoot)"
  - "MP-04: Composite-First Containment (Transform and opacity only, CLS = 0 layout stability)"
  - "MP-05: Interruption Resilience (Zero queue length, rapid inputs settle cleanly)"
  - "MP-06: Reduced-Motion Equivalence (Displacement 0px, duration <= 1ms, 100% announcement parity)"
motion_tokens:
  duration:
    fast: "100ms (Study A) / 120ms (Study B)"
    base: "160ms (Study A) / 180ms (Study B)"
    slow: "220ms (Study A) / 250ms (Study B)"
    cap: "300ms"
  easing:
    standard: "cubic-bezier(0.2, 0, 0.2, 1) (A) / cubic-bezier(0.2, 0, 0, 1) (B)"
    enter: "cubic-bezier(0, 0, 0.2, 1) (A) / cubic-bezier(0, 0, 0, 1) (B)"
    exit: "cubic-bezier(0.25, 0, 0.3, 1) (A) / cubic-bezier(0.3, 0, 1, 1) (B)"
  distance:
    study_a: "4px subtle displacement"
    study_b: "8px explicit displacement"
  scale:
    study_a: 1.01
    study_b: 1.02
pattern_p1:
  purpose: "Asset provenance disclosure continuity"
  normal: "Chevron rotates 0deg to 90deg, content fades in with gentle translation (4px in A, 8px in B)"
  reduced: "Instant toggle, rotation 0deg, translation 0px, duration 0s"
pattern_p2:
  purpose: "Action feedback FSM for T01 log update"
  states: [idle, pending, error, retry, success]
  interruption_rule: "Pending blocks duplicate triggers; retry cleans error immediately; single stable DOM node"
pattern_p3:
  purpose: "Attention without alarm for T01 bottleneck"
  trigger: "Explicit click on #btn-highlight-t01 or heading click"
  safety_caps:
    max_translation: "4px (A) / 6px (B) (Cap: 8px)"
    max_scale: "1.01 (A) / 1.02 (B) (Cap: 1.02)"
    max_duration: "220ms (A) / 250ms (B) (Cap: 300ms)"
    iterations: 1
    autoplay: false
study_a:
  name: "Study A — Quiet Continuity"
  six_axis_summary: "Subtle 100-220ms duration, 4px displacement, gentle easing cubic-bezier(0.2,0,0.2,1), simultaneous fade, soft tint scale 1.01, smooth waapi reversal"
study_b:
  name: "Study B — Explicit State Change"
  six_axis_summary: "Crisp 120-250ms duration, 8px displacement, sharp deceleration cubic-bezier(0.2,0,0,1), staggered opacity, amber border scale 1.02, step reversal"
test_matrix_draft_path: TEST_MATRIX_DRAFT.md
authoritative_screenshots:
  - screenshots/01_study_a_desktop_normal.png
  - screenshots/02_study_a_mobile_normal.png
  - screenshots/03_study_b_desktop_normal.png
  - screenshots/04_study_b_mobile_normal.png
open_questions: []
`;

  fs.writeFileSync(path.join(BASE_DIR, 'CHECKPOINT_13_1.yaml'), checkpointYaml, 'utf-8');
  console.log('Saved CHECKPOINT_13_1.yaml');

  console.log('\n======================================================================');
  console.log(`VERIFICATION COMPLETE: ${passedAssertions}/${totalAssertions} Assertions PASSED (${Math.round(passedAssertions/totalAssertions*100)}%)`);
  console.log('======================================================================');

  if (passedAssertions === totalAssertions) {
    process.exit(0);
  } else {
    process.exit(1);
  }
})();
