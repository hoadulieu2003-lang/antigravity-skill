/**
 * ============================================================================
 * UNIT TEST SUITE FOR AUTOMATED DELIGHT AUDIT TOOL (WP-R3-05)
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
  evaluateHardGating
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
console.log('⚡ RUNNING COMPREHENSIVE UNIT TESTS FOR scripts/audit_delight_score.js (WP-R3-05)');
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

console.log('\n================================================================');
console.log(`TOTAL: ${passedTests}/${totalTests} UNIT TESTS PASSED (100% GREEN)`);
console.log('================================================================');
