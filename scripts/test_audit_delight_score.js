/**
 * ============================================================================
 * UNIT TEST SUITE FOR AUTOMATED DELIGHT AUDIT TOOL (WP-R4-05)
 * ============================================================================
 * Verifies:
 *   1. Color parsing & Alpha-Compositing
 *   2. WCAG Contrast Ratios (AA & AAA)
 *   3. Two-Corner Inversion 3D Matrix Math
 *   4. Mechanical Press Rule Matching & Size Classification
 *   5. Multi-Breakpoint Matrix Specification (Mobile 375, Tablet 768, Desktop 1440)
 *   6. Zero-Horizontal-Overflow Detection & Offender Extraction Algorithm
 *   7. Cumulative Layout Shift (CLS) Continuous Evaluation & Penalties
 *   8. WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer API Detection
 *   9. Hard Gating Enforcement on Mobile Horizontal Overflow
 *   10. Pillar 6: Battery & Energy Efficiency (AdaptiveBatteryWatchdog & EcoGraphicArbiter)
 *   11. Slider Interaction & CSS Variable Mutation Smoothness (>= 58-60 FPS)
 *   12. 6-Pillar Normalized Scoring (Normalized to 10.00 scale)
 *   13. Evidence Ledger & Receipt Manifest Generation (WP-R4-05)
 * ============================================================================
 */

const assert = require('assert');
const {
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
  evaluateHardGating,
  checkBatteryAndEcoPresence,
  evaluateIdleEfficiency,
  evaluateHiddenVisibilityReaction,
  evaluateSliderSmoothnessMetrics,
  normalizeDelightScore,
  generateEvidenceLedger,
  generateReceiptManifest
} = require('./audit_delight_score.js');

let passedTests = 0;
let totalTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${desc}`);
  } catch (err) {
    console.error(`  [FAIL] ${desc} -> ${err.message}`);
    throw err;
  }
}

console.log('================================================================');
console.log('⚡ RUNNING COMPREHENSIVE UNIT TESTS FOR scripts/audit_delight_score.js (WP-R4-05)');
console.log('================================================================');

// 1. Color Parser Tests
console.log('\n--- 1. Color Parsing (parseRgba) ---');
it('parses 3-digit hex correctly (#fff)', () => {
  const c = parseRgba('#fff');
  assert.deepStrictEqual(c, { r: 255, g: 255, b: 255, a: 1.0 });
});

it('parses 6-digit hex correctly (#0F172A)', () => {
  const c = parseRgba('#0F172A');
  assert.deepStrictEqual(c, { r: 15, g: 23, b: 42, a: 1.0 });
});

it('parses 8-digit hex with alpha (#0F172A80)', () => {
  const c = parseRgba('#0F172A80');
  assert.strictEqual(c.r, 15);
  assert.strictEqual(c.g, 23);
  assert.strictEqual(c.b, 42);
  assert(Math.abs(c.a - 0.502) < 0.01);
});

it('parses rgb(r, g, b) string', () => {
  const c = parseRgba('rgb(248, 250, 252)');
  assert.deepStrictEqual(c, { r: 248, g: 250, b: 252, a: 1.0 });
});

it('parses rgba(r, g, b, a) string with decimal alpha', () => {
  const c = parseRgba('rgba(255, 255, 255, 0.82)');
  assert.deepStrictEqual(c, { r: 255, g: 255, b: 255, a: 0.82 });
});

it('handles transparent color fallback safely', () => {
  const c = parseRgba('transparent');
  assert.deepStrictEqual(c, { r: 0, g: 0, b: 0, a: 0 });
});

// 2. Alpha-Compositing Tests
console.log('\n--- 2. Alpha-Compositing (compositeColor) ---');
it('returns foreground directly if alpha is 1.0', () => {
  const fg = { r: 255, g: 0, b: 0, a: 1.0 };
  const bg = { r: 0, g: 255, b: 0, a: 1.0 };
  const res = compositeColor(fg, bg);
  assert.strictEqual(res.r, 255);
  assert.strictEqual(res.g, 0);
  assert.strictEqual(res.b, 0);
});

it('composites 50% white over black to produce 128 grey', () => {
  const fg = { r: 255, g: 255, b: 255, a: 0.5 };
  const bg = { r: 0, g: 0, b: 0, a: 1.0 };
  const res = compositeColor(fg, bg);
  assert.strictEqual(res.r, 128);
  assert.strictEqual(res.g, 128);
  assert.strictEqual(res.b, 128);
  assert.strictEqual(res.a, 1.0);
});

it('composites Acrylic card (rgba(255,255,255,0.82)) over canvas #F8FAFC', () => {
  const fg = { r: 255, g: 255, b: 255, a: 0.82 };
  const bg = { r: 248, g: 250, b: 252, a: 1.0 };
  const res = compositeColor(fg, bg);
  assert(res.r >= 253 && res.r <= 255);
  assert(res.g >= 253 && res.g <= 255);
  assert(res.b >= 253 && res.b <= 255);
});

// 3. WCAG Contrast Calculation Tests
console.log('\n--- 3. WCAG Contrast Ratio (calculateContrastRatio) ---');
it('calculates 21.0:1 contrast for pure black on pure white', () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const ratio = calculateContrastRatio(black, white);
  assert.strictEqual(ratio, 21.0);
});

it('calculates 1.0:1 contrast for identical colors', () => {
  const c = { r: 120, g: 120, b: 120 };
  const ratio = calculateContrastRatio(c, c);
  assert.strictEqual(ratio, 1.0);
});

it('calculates primary text (#0F172A) on canvas (#F8FAFC) exceeds WCAG AAA (>= 7:1)', () => {
  const text = { r: 15, g: 23, b: 42 };
  const canvas = { r: 248, g: 250, b: 252 };
  const ratio = calculateContrastRatio(text, canvas);
  assert(ratio >= 14.0, `Expected >= 14:1, got ${ratio}:1`);
});

// 4. Two-Corner Inversion 3D Math Tests
console.log('\n--- 4. Two-Corner Inversion Test (checkTwoCornerInversion) ---');
it('passes when telemetry pitch has inverted signs across corners (-4.5° vs +4.5°)', () => {
  const result = checkTwoCornerInversion({
    transform1: 'perspective(1000px) rotateX(-4.5deg) rotateY(3deg)',
    transform2: 'perspective(1000px) rotateX(4.5deg) rotateY(-3deg)',
    pitch1: -4.5,
    pitch2: 4.5,
    roll1: 3.0,
    roll2: -3.0
  });
  assert.strictEqual(result, true);
});

it('passes when rotateX angles parsed from transform invert signs (-5deg vs +5deg)', () => {
  const result = checkTwoCornerInversion({
    transform1: 'perspective(800px) rotateX(-5deg)',
    transform2: 'perspective(800px) rotateX(5deg)',
    pitch1: 0,
    pitch2: 0,
    roll1: 0,
    roll2: 0
  });
  assert.strictEqual(result, true);
});

it('passes when matrix3d off-diagonal entries have opposing signs', () => {
  const m1 = 'matrix3d(1, 0, 0.08, 0, 0, 1, 0, 0, -0.08, 0, 1, 0, 0, 0, 0, 1)';
  const m2 = 'matrix3d(1, 0, -0.08, 0, 0, 1, 0, 0, 0.08, 0, 1, 0, 0, 0, 0, 1)';
  const result = checkTwoCornerInversion({
    transform1: m1,
    transform2: m2
  });
  assert.strictEqual(result, true);
});

it('strictly rejects when both corners rotate in the SAME direction (same sign)', () => {
  const result = checkTwoCornerInversion({
    transform1: 'perspective(1000px) rotateX(4.5deg)',
    transform2: 'perspective(1000px) rotateX(3.5deg)',
    pitch1: 4.5,
    pitch2: 3.5,
    roll1: 2.0,
    roll2: 1.0
  });
  assert.strictEqual(result, false, 'Same-direction tilts must fail inversion test');
});

it('strictly rejects when transform lacks 3D perspective or matrix3d', () => {
  const result = checkTwoCornerInversion({
    transform1: 'translateX(10px)',
    transform2: 'translateX(-10px)',
    pitch1: -5,
    pitch2: 5
  });
  assert.strictEqual(result, false, 'Non-3D transforms without perspective must fail');
});

// 5. Mechanical Press Rule Matching & Size Classification Tests
console.log('\n--- 5. Mechanical Press & Tactile Rules (matchActiveRule & isSmallIconButton) ---');
it('identifies Emil Kowalski standard :active scale(0.965)', () => {
  assert.strictEqual(matchActiveRule('transform: scale(0.965)', 'scale'), true);
  assert.strictEqual(matchActiveRule('transform: scale3d(0.965, 0.965, 1)', 'scale'), true);
  assert.strictEqual(matchActiveRule('transform: scale(0.96)', 'scale'), true);
});

it('rejects invalid or non-tactile active scale transformations', () => {
  assert.strictEqual(matchActiveRule('transform: scale(1.1)', 'scale'), false);
  assert.strictEqual(matchActiveRule('transform: scale(0.8)', 'scale'), false);
  assert.strictEqual(matchActiveRule('color: red', 'scale'), false);
});

it('identifies small icon button :active translateY(1px) and translateY(1.5px)', () => {
  assert.strictEqual(matchActiveRule('transform: translateY(1px)', 'translateY'), true);
  assert.strictEqual(matchActiveRule('transform: translateY(1.5px)', 'translateY'), true);
  assert.strictEqual(matchActiveRule('transform: translateY(2px)', 'translateY'), true);
  assert.strictEqual(matchActiveRule('transform: translate(0px, 1px)', 'translateY'), true);
});

it('correctly classifies elements < 32px as small icon buttons', () => {
  assert.strictEqual(isSmallIconButton({ width: 28, height: 28 }), true);
  assert.strictEqual(isSmallIconButton({ width: 24, height: 24 }), true);
  assert.strictEqual(isSmallIconButton({ width: 30, height: 30 }), true);
  assert.strictEqual(isSmallIconButton({ width: 32, height: 32 }), false);
  assert.strictEqual(isSmallIconButton({ width: 44, height: 44 }), false);
  assert.strictEqual(isSmallIconButton({ width: 120, height: 38 }), false);
});

// 6. Multi-Breakpoint Matrix Specification Tests (Requirement 1)
console.log('\n--- 6. Multi-Breakpoint Matrix Specification (BREAKPOINTS) ---');
it('defines Mobile breakpoint at 375x812 with isMobile: true and hasTouch: true', () => {
  assert(BREAKPOINTS.mobile, 'Mobile breakpoint must exist');
  assert.strictEqual(BREAKPOINTS.mobile.width, 375);
  assert.strictEqual(BREAKPOINTS.mobile.height, 812);
  assert.strictEqual(BREAKPOINTS.mobile.isMobile, true);
  assert.strictEqual(BREAKPOINTS.mobile.hasTouch, true);
  assert(BREAKPOINTS.mobile.userAgent.includes('iPhone'), 'UserAgent must represent iPhone / mobile');
});

it('defines Tablet breakpoint at 768x1024 with hasTouch: true', () => {
  assert(BREAKPOINTS.tablet, 'Tablet breakpoint must exist');
  assert.strictEqual(BREAKPOINTS.tablet.width, 768);
  assert.strictEqual(BREAKPOINTS.tablet.height, 1024);
  assert.strictEqual(BREAKPOINTS.tablet.hasTouch, true);
  assert(BREAKPOINTS.tablet.userAgent.includes('iPad'), 'UserAgent must represent iPad / tablet');
});

it('defines Desktop breakpoint at 1440x900 with isMobile: false and hasTouch: false', () => {
  assert(BREAKPOINTS.desktop, 'Desktop breakpoint must exist');
  assert.strictEqual(BREAKPOINTS.desktop.width, 1440);
  assert.strictEqual(BREAKPOINTS.desktop.height, 900);
  assert.strictEqual(BREAKPOINTS.desktop.isMobile, false);
  assert.strictEqual(BREAKPOINTS.desktop.hasTouch, false);
});

// 7. Zero-Horizontal-Overflow Detection Tests (Requirement 2)
console.log('\n--- 7. Zero-Horizontal-Overflow Detection Algorithm ---');
it('confirms zero overflow when scrollWidth equals innerWidth (375px on 375px)', () => {
  const res = checkHorizontalOverflow(375, 375);
  assert.strictEqual(res.hasOverflow, false);
  assert.strictEqual(res.overflowPx, 0);
});

it('confirms zero overflow when scrollWidth is smaller than innerWidth', () => {
  const res = checkHorizontalOverflow(750, 768);
  assert.strictEqual(res.hasOverflow, false);
  assert.strictEqual(res.overflowPx, 0);
});

it('detects horizontal overflow and computes exact protrusion (415px on 375px)', () => {
  const res = checkHorizontalOverflow(415, 375);
  assert.strictEqual(res.hasOverflow, true);
  assert.strictEqual(res.overflowPx, 40);
});

it('identifies and extracts offending elements exceeding innerWidth', () => {
  const elements = [
    { tag: 'div', selector: '.hero-container', width: 360, right: 360, scrollWidth: 360 },
    { tag: 'section', selector: '.wide-banner', width: 420, right: 420, scrollWidth: 420 },
    { tag: 'img', selector: '#unconstrained-img', width: 395, right: 395, scrollWidth: 395 }
  ];
  const offenders = findOffendingOverflowElements(elements, 375);
  assert.strictEqual(offenders.length, 2);
  assert.strictEqual(offenders[0].selector, '.wide-banner');
  assert.strictEqual(offenders[0].overflowPx, 45);
  assert.strictEqual(offenders[1].selector, '#unconstrained-img');
  assert.strictEqual(offenders[1].overflowPx, 20);
});

it('returns empty list when all elements fit within innerWidth', () => {
  const elements = [
    { tag: 'div', selector: '.card', width: 340, right: 350, scrollWidth: 340 },
    { tag: 'p', selector: '.text', width: 320, right: 330, scrollWidth: 320 }
  ];
  const offenders = findOffendingOverflowElements(elements, 375);
  assert.strictEqual(offenders.length, 0);
});

// 8. Cumulative Layout Shift (CLS) Continuous Evaluation (Requirement 3)
console.log('\n--- 8. Cumulative Layout Shift (CLS) Evaluation ---');
it('rates CLS <= 0.05 as EXCELLENT with 0.0 penalty (Maximum Score)', () => {
  const res = evaluateClsScore(0.002);
  assert.strictEqual(res.rating, 'EXCELLENT');
  assert.strictEqual(res.penalty, 0.0);
  assert.strictEqual(res.status, 'PASS');
});

it('rates 0.05 < CLS <= 0.10 as GOOD with 0.1 penalty', () => {
  const res = evaluateClsScore(0.082);
  assert.strictEqual(res.rating, 'GOOD');
  assert.strictEqual(res.penalty, 0.1);
  assert.strictEqual(res.status, 'PASS');
});

it('rates 0.10 < CLS <= 0.25 as NEEDS_IMPROVEMENT with 0.3 penalty', () => {
  const res = evaluateClsScore(0.185);
  assert.strictEqual(res.rating, 'NEEDS_IMPROVEMENT');
  assert.strictEqual(res.penalty, 0.3);
  assert.strictEqual(res.status, 'WARN');
});

it('rates CLS > 0.25 as CRITICAL with 0.6 penalty (Severe Violation)', () => {
  const res = evaluateClsScore(0.35);
  assert.strictEqual(res.rating, 'CRITICAL');
  assert.strictEqual(res.penalty, 0.6);
  assert.strictEqual(res.status, 'FAIL');
});

// 9. WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer (Requirement 4)
console.log('\n--- 9. WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer ---');
it('detects v2.0 engine with setHapticMode and navigator.vibrate detection', () => {
  const mockEngine = {
    version: '2.0',
    isV2: true,
    hasVibrationSupport: true,
    setHapticMode: (mode) => mode
  };
  const syncerReport = checkDualHapticSyncer(mockEngine);
  assert.strictEqual(syncerReport.isV2, true);
  assert.strictEqual(syncerReport.hasSetHapticMode, true);
  assert.strictEqual(syncerReport.hasVibrateDetection, true);
  assert.strictEqual(syncerReport.scoreFactor, 1.0);
});

it('identifies v2.0 engine via extended waveform synthesis (playRotaryStep)', () => {
  const mockEngine = {
    playRotaryStep: () => {}
  };
  const syncerReport = checkDualHapticSyncer(mockEngine);
  assert.strictEqual(syncerReport.isV2, true);
  assert(syncerReport.scoreFactor >= 0.5);
});

it('detects setHapticMode API presence on syncer', () => {
  const mockEngine = {
    setHapticMode: function(m) { return m; }
  };
  const syncerReport = checkDualHapticSyncer(mockEngine);
  assert.strictEqual(syncerReport.hasSetHapticMode, true);
});

it('safely handles legacy v1 engine without throwing error', () => {
  const mockEngine = {
    playClick: () => {}
  };
  const syncerReport = checkDualHapticSyncer(mockEngine);
  assert.strictEqual(syncerReport.isV2, false);
  assert.strictEqual(syncerReport.hasSetHapticMode, false);
  assert.strictEqual(syncerReport.scoreFactor, 0);
});

// 10. Hard Gating Enforcement on Mobile Overflow (Requirement 2)
console.log('\n--- 10. Hard Gating Enforcement ---');
it('triggers hard gating FAIL when Mobile (375px) has horizontal overflow', () => {
  const gating = evaluateHardGating({
    overallScore: 9.5,
    threshold: 8.5,
    breakpointResults: [
      { id: 'desktop', hasOverflow: false, overflowPx: 0 },
      { id: 'tablet', hasOverflow: false, overflowPx: 0 },
      { id: 'mobile', hasOverflow: true, overflowPx: 42, scrollWidth: 417, innerWidth: 375 }
    ]
  });
  assert.strictEqual(gating.hardGated, true);
  assert.strictEqual(gating.verdict, 'FAIL');
  assert(gating.hardGateReason.includes('TRÀN NGANG TRÊN MOBILE'));
  assert(gating.penalizedScore <= 8.0, 'Penalized score must be below threshold');
});

it('triggers hard gating FAIL when Tablet (768px) has horizontal overflow', () => {
  const gating = evaluateHardGating({
    overallScore: 9.2,
    threshold: 8.5,
    breakpointResults: [
      { id: 'desktop', hasOverflow: false, overflowPx: 0 },
      { id: 'tablet', hasOverflow: true, overflowPx: 25, scrollWidth: 793, innerWidth: 768 },
      { id: 'mobile', hasOverflow: false, overflowPx: 0 }
    ]
  });
  assert.strictEqual(gating.hardGated, true);
  assert.strictEqual(gating.verdict, 'FAIL');
  assert(gating.hardGateReason.includes('TRÀN NGANG TRÊN TABLET'));
});

it('allows PASS verdict when all breakpoints have zero horizontal overflow and score >= threshold', () => {
  const gating = evaluateHardGating({
    overallScore: 9.35,
    threshold: 8.5,
    breakpointResults: [
      { id: 'desktop', hasOverflow: false, overflowPx: 0 },
      { id: 'tablet', hasOverflow: false, overflowPx: 0 },
      { id: 'mobile', hasOverflow: false, overflowPx: 0 }
    ]
  });
  assert.strictEqual(gating.hardGated, false);
  assert.strictEqual(gating.verdict, 'PASS');
  assert.strictEqual(gating.penalizedScore, 9.35);
});

// 11. Pillar 6: Battery & Energy Efficiency Helpers Tests
console.log('\n--- 11. Pillar 6: Battery & Energy Efficiency Helpers ---');
it('detects AdaptiveBatteryWatchdog and EcoGraphicArbiter presence and calculates scoreFactor', () => {
  const resFull = checkBatteryAndEcoPresence({
    AdaptiveBatteryWatchdog: { isBatterySaver: () => false, getFpsLimit: () => 60 },
    EcoGraphicArbiter: { isEcoMode: () => false, getState: () => 'ACTIVE' }
  });
  assert.strictEqual(resFull.hasWatchdog, true);
  assert.strictEqual(resFull.hasArbiter, true);
  assert.strictEqual(resFull.scoreFactor, 0.70);

  const resPartial = checkBatteryAndEcoPresence({
    AdaptiveBatteryWatchdog: { isBatterySaver: () => false }
  });
  assert.strictEqual(resPartial.hasWatchdog, true);
  assert.strictEqual(resPartial.hasArbiter, false);
  assert.strictEqual(resPartial.scoreFactor, 0.35);

  const resNone = checkBatteryAndEcoPresence({});
  assert.strictEqual(resNone.hasWatchdog, false);
  assert.strictEqual(resNone.hasArbiter, false);
  assert.strictEqual(resNone.scoreFactor, 0.0);
});

it('evaluates idle frame rate and auto-sleep efficiency correctly', () => {
  const resEco = evaluateIdleEfficiency({ idleFps: 25, isAutoSleeping: true });
  assert.strictEqual(resEco.rating, 'OPTIMAL_ECO');
  assert.strictEqual(resEco.score, 0.65);

  const resGood = evaluateIdleEfficiency({ idleFps: 60, isAutoSleeping: false });
  assert.strictEqual(resGood.rating, 'GOOD');
  assert.strictEqual(resGood.score, 0.55);

  const resWasteful = evaluateIdleEfficiency({ idleFps: 120, isAutoSleeping: false });
  assert.strictEqual(resWasteful.rating, 'WASTEFUL');
  assert.strictEqual(resWasteful.score, 0.20);
});

it('evaluates visibility state reaction when document is hidden', () => {
  const resHiddenPaused = evaluateHiddenVisibilityReaction({ hiddenFps: 0.5, isPaused: true });
  assert.strictEqual(resHiddenPaused.score, 0.65);
  assert.strictEqual(resHiddenPaused.pass, true);
  assert(resHiddenPaused.description.includes('Phản ứng hoàn hảo khi ẩn tab'));

  const resHiddenThrottled = evaluateHiddenVisibilityReaction({ hiddenFps: 0.8, isPaused: false });
  assert.strictEqual(resHiddenThrottled.score, 0.65);
  assert.strictEqual(resHiddenThrottled.pass, true);

  const resHiddenWarn = evaluateHiddenVisibilityReaction({ hiddenFps: 3.5, isPaused: false });
  assert.strictEqual(resHiddenWarn.score, 0.30);
  assert.strictEqual(resHiddenWarn.rating, 'WARN');
  assert.strictEqual(resHiddenWarn.pass, false);

  const resHiddenUnthrottled = evaluateHiddenVisibilityReaction({ hiddenFps: 60, isPaused: false });
  assert.strictEqual(resHiddenUnthrottled.score, 0.0);
  assert.strictEqual(resHiddenUnthrottled.rating, 'FAIL');
  assert.strictEqual(resHiddenUnthrottled.pass, false);
});

// 12. Slider Interaction & CSS Variable Mutation Smoothness Tests (Requirement 3)
console.log('\n--- 12. Slider Interaction & CSS Variable Mutation Smoothness ---');
it('evaluates 60 FPS slider drag with zero jank as EXCELLENT and PASS', () => {
  const res = evaluateSliderSmoothnessMetrics({ avgFps: 60.0, jankCount: 0, smoothRatio: 1.0, totalFrames: 45 });
  assert.strictEqual(res.pass, true);
  assert.strictEqual(res.rating, 'EXCELLENT');
  assert.strictEqual(res.penalty, 0);
  assert.strictEqual(res.jankCount, 0);
});

it('passes slider test when frame rate meets or exceeds 58 FPS floor (58.5 FPS)', () => {
  const res = evaluateSliderSmoothnessMetrics({ avgFps: 58.5, jankCount: 1, smoothRatio: 0.98, totalFrames: 45 });
  assert.strictEqual(res.pass, true);
  assert.strictEqual(res.rating, 'GOOD');
});

it('rates slider 55-57 FPS as GOOD but fails hard 58 FPS gating', () => {
  const res = evaluateSliderSmoothnessMetrics({ avgFps: 56.0, jankCount: 2, smoothRatio: 0.95, totalFrames: 45 });
  assert.strictEqual(res.pass, false, 'Slider below 58 FPS must not pass strict gating');
  assert.strictEqual(res.rating, 'GOOD');
  assert.strictEqual(res.penalty, 0.1);
});

it('penalizes poor slider drag (< 45 FPS or high jank) with higher penalty', () => {
  const res = evaluateSliderSmoothnessMetrics({ avgFps: 38.0, jankCount: 8, smoothRatio: 0.65, totalFrames: 45 });
  assert.strictEqual(res.pass, false);
  assert.strictEqual(res.rating, 'POOR');
  assert.strictEqual(res.penalty, 0.6);
});

// 13. 6-Pillar Normalized Scoring Tests (Requirement 2)
console.log('\n--- 13. 6-Pillar Normalized Scoring (normalizeDelightScore) ---');
it('normalizes 6 perfect pillars (all 2.0 / 2.0) to exactly 10.00', () => {
  const pillars = [
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 }
  ];
  const score = normalizeDelightScore(pillars);
  assert.strictEqual(score, 10.00);
});

it('normalizes 6 realistic pillars summing to 10.80 / 12.00 to 9.00', () => {
  const pillars = [
    { score: 2.0, maxScore: 2.0 },
    { score: 1.8, maxScore: 2.0 },
    { score: 1.9, maxScore: 2.0 },
    { score: 1.7, maxScore: 2.0 },
    { score: 1.8, maxScore: 2.0 },
    { score: 1.6, maxScore: 2.0 }
  ];
  const score = normalizeDelightScore(pillars);
  assert.strictEqual(score, 9.00);
});

it('gracefully handles legacy 5-pillar array (sum 10.0, max 10.0) returning 10.00', () => {
  const pillars = [
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 },
    { score: 2.0, maxScore: 2.0 }
  ];
  const score = normalizeDelightScore(pillars);
  assert.strictEqual(score, 10.00);
});

it('handles empty or invalid pillars safely without throwing or NaN', () => {
  assert.strictEqual(normalizeDelightScore([]), 0);
  assert.strictEqual(normalizeDelightScore(null), 0);
});

// 14. Evidence Ledger & Receipt Manifest Generation Tests (Requirement 4 & 6)
console.log('\n--- 14. Evidence Ledger & Receipt Manifest (WP-R4-05) ---');
it('generates Markdown Evidence Ledger with 6-Pillar Scorecard and Slider Smoothness', () => {
  const mockAuditData = {
    timestamp: '2026-09-24T15:30:00.000Z',
    url: 'file:///test/index.html',
    port: 9223,
    threshold: 8.5,
    overallScore: 9.35,
    verdict: 'PASS',
    hardGated: false,
    hardGateReason: null,
    cls: { totalCls: 0.001, rating: 'EXCELLENT', description: 'Bố cục ổn định' },
    sliderSmoothness: { avgFps: 60.0, smoothRatio: 1.0, jankCount: 0, maxDeltaMs: 16.6, pass: true, description: 'Mượt mà' },
    breakpoints: {
      matrix: [
        { id: 'desktop', name: 'Desktop', viewport: '1440x900', innerWidth: 1440, scrollWidth: 1440, overflowPx: 0, status: 'PASS' },
        { id: 'tablet', name: 'Tablet', viewport: '768x1024', innerWidth: 768, scrollWidth: 768, overflowPx: 0, status: 'PASS' },
        { id: 'mobile', name: 'Mobile', viewport: '375x812', innerWidth: 375, scrollWidth: 375, overflowPx: 0, status: 'PASS' }
      ]
    },
    pillars: [
      { pillar: 'Pillar 1: Chuyển động 60 FPS (Motion Smoothness)', score: 2.0, maxScore: 2.0, pass: true, metrics: { avgFps: 60, smoothRatio: 1, jankCount: 0 }, findings: [] },
      { pillar: 'Pillar 2: Độ lún cơ học (Mechanical Bottom-Out)', score: 1.85, maxScore: 2.0, pass: true, metrics: { hasActiveScale0965Rule: true, coverageRatio: 0.95 }, findings: [] },
      { pillar: 'Pillar 3: Đèn rọi Spotlight & Parallax Tilt 3D', score: 1.9, maxScore: 2.0, pass: true, metrics: { spotlight: { hasVariables: true }, tilt: { inversionPassed: true }, zIndexProtection: { passed: true } }, findings: [] },
      { pillar: 'Pillar 4: Độ tương phản màu sắc WCAG AA & AAA trên Acrylic', score: 1.8, maxScore: 2.0, pass: true, metrics: { aaRatio: 0.98, aaaRatio: 0.85, acrylicHasBlur: true }, findings: [] },
      { pillar: 'Pillar 5: Phản hồi âm thanh WebAudioHaptics v2.0 & Dual Audio-Haptic Syncer', score: 2.0, maxScore: 2.0, pass: true, metrics: { dualSyncer: { isV2: true, hasSetHapticMode: true, hasVibrateSupportDetection: true } }, findings: [] },
      { pillar: 'Pillar 6: Hiệu quả Năng lượng & Pin (Battery & Energy Efficiency)', score: 1.95, maxScore: 2.0, pass: true, metrics: { presence: { hasWatchdog: true, hasArbiter: true }, idle: { idleFps: 60 }, hidden: { hiddenFps: 0 } }, findings: [] }
    ],
    outputFile: '.antigravity/delight_audit_report.json',
    ledgerFile: '.antigravity/delight_audit_ledger.md',
    receiptFile: '.antigravity/receipts/wp_r4_05.json'
  };

  const md = generateEvidenceLedger(mockAuditData);
  assert(md.includes('WP-R4-05'), 'Ledger must state WP-R4-05');
  assert(md.includes('6-PILLAR CRAFTSMANSHIP SCORECARD'), 'Ledger must contain 6-Pillar Scorecard');
  assert(md.includes('SLIDER INTERACTION SMOOTHNESS'), 'Ledger must contain Slider Smoothness section');
  assert(md.includes('Pillar 6: Hiệu quả Năng lượng & Pin'), 'Ledger must list Pillar 6');
  assert(md.includes('9.35 / 10.00'), 'Ledger must show normalized overall score');
});

it('generates Receipt Manifest with WP-R4-05 format and 6 pillars', () => {
  const mockAuditData = {
    timestamp: '2026-09-24T15:30:00.000Z',
    url: 'file:///test/index.html',
    port: 9223,
    threshold: 8.5,
    overallScore: 9.35,
    verdict: 'PASS',
    hardGated: false,
    hardGateReason: null,
    cls: { totalCls: 0.001, rating: 'EXCELLENT', status: 'PASS' },
    sliderSmoothness: { avgFps: 60.0, pass: true },
    breakpoints: {
      matrix: [
        { id: 'mobile', name: 'Mobile', viewport: '375x812', hasOverflow: false, overflowPx: 0, status: 'PASS' }
      ],
      allPassed: true,
      mobileOverflow: false
    },
    pillars: [
      { pillar: 'P1', score: 2.0, maxScore: 2.0, pass: true },
      { pillar: 'P2', score: 1.8, maxScore: 2.0, pass: true },
      { pillar: 'P3', score: 1.9, maxScore: 2.0, pass: true },
      { pillar: 'P4', score: 1.8, maxScore: 2.0, pass: true },
      { pillar: 'P5', score: 2.0, maxScore: 2.0, pass: true },
      { pillar: 'P6', score: 1.95, maxScore: 2.0, pass: true }
    ],
    outputFile: '.antigravity/delight_audit_report.json',
    ledgerFile: '.antigravity/delight_audit_ledger.md',
    receiptFile: '.antigravity/receipts/wp_r4_05.json'
  };

  const receipt = generateReceiptManifest(mockAuditData);
  assert.strictEqual(receipt.wp, 'WP-R4-05');
  assert.strictEqual(receipt.status, 'COMPLETED');
  assert.strictEqual(receipt.pillars.length, 6);
  assert.strictEqual(receipt.overall_delight_score, 9.35);
  assert(receipt.summary.includes('WP-R4-05'));
  assert(receipt.summary.includes('6 Trụ cột Độc lập'));
});

console.log('\n================================================================');
console.log(`TOTAL: ${passedTests}/${totalTests} UNIT TESTS PASSED (100% GREEN)`);
console.log('================================================================');
