/**
 * 🧪 Test Suite for LuminousPaletteEngine
 * ========================================
 * Tests:
 * 1. Mathematical Björn Ottosson Matrix Transformations & Roundtrip Accuracy (< 1e-4)
 * 2. Continuous Linear Relative Luminance Y & WCAG 2.1 Contrast / APCA Scoring
 * 3. Binary Bisection (< 10^-5 precision) and Contrast Guarantees
 * 4. Perceptual Hue Bending for Volt / Lemon Yellow (h in [85, 125] -> 65-72° amber)
 * 5. Radial Chroma Gamut Mapping (MINDE) in sRGB
 * 6. 5-Tier Luminous Surface Architecture (Canvas L >= 0.965, Sub-surface L >= 0.94, Border delta L >= 0.098, Inset Highlight)
 * 7. Challenging Seed Suite: #E4FF00, #FF7A00, #39FF14, #0284C7, #4F46E5
 * 8. Edge Case Seeds: #000000, #FFFFFF, #808080, #FF0055, short hex (#abc), invalid fallback
 * 9. 100% Accessible Contrast Enforcement (AA >= 4.5:1, AAA >= 7.0:1 on Canvas and Card)
 * 10. Standalone Utilities: resolveAccessibleTextColor, getCssVariables (string & object)
 * 11. UMD Bundle Compatibility (CommonJS require & window global in VM sandbox)
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

import {
  generateLuminousPalette,
  getCssVariables,
  resolveAccessibleTextColor,
  hexToOklch,
  oklchToHex,
  hexToRelativeLuminance,
  getContrastRatio,
  getApcaContrast,
  gamutMapOklch,
  bendPerceptualHue,
  findAccessibleLightness,
  generateLuminousSurfaces,
  generateLuminousAccent,
  generateLuminousNeutrals,
  parseHex,
  rgbToHex,
  srgbToLinear,
  linearToSrgb,
  linearRgbToOklab,
  oklabToLinearRgb,
  oklabToOklch,
  oklchToOklab,
  LuminousPaletteEngine,
} from './luminous_palette_engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

function assertClose(actual, expected, tolerance = 1e-4, message) {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} (expected ~${expected}, got ${actual}, diff ${diff})`);
}

console.log('⚡ Starting LuminousPaletteEngine Master Verification Suite...\n');

// =============================================================================
// Suite 1: Mathematical Transformations & Björn Ottosson Matrices
// =============================================================================
console.log('📐 Test Suite 1: Björn Ottosson Matrix Accuracy & Roundtrip Reversibility');

// Test linear sRGB gamma conversions
assertClose(srgbToLinear(0.0), 0.0, 1e-6, 'srgbToLinear(0.0) is 0');
assertClose(srgbToLinear(1.0), 1.0, 1e-6, 'srgbToLinear(1.0) is 1');
assertClose(linearToSrgb(0.0), 0.0, 1e-6, 'linearToSrgb(0.0) is 0');
assertClose(linearToSrgb(1.0), 1.0, 1e-6, 'linearToSrgb(1.0) is 1');

// Test roundtrip for various colors
const testColors = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#E4FF00',
  '#FF7A00',
  '#39FF14',
  '#0284C7',
  '#4F46E5',
];

for (const hex of testColors) {
  const [r, g, b] = parseHex(hex);
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);

  const [L, a, b_ok] = linearRgbToOklab(rLin, gLin, bLin);
  const [rLin2, gLin2, bLin2] = oklabToLinearRgb(L, a, b_ok);

  const r2 = linearToSrgb(rLin2);
  const g2 = linearToSrgb(gLin2);
  const b2 = linearToSrgb(bLin2);

  assertClose(r2, r, 5e-5, `Roundtrip Red component for ${hex}`);
  assertClose(g2, g, 5e-5, `Roundtrip Green component for ${hex}`);
  assertClose(b2, b, 5e-5, `Roundtrip Blue component for ${hex}`);

  const oklch = oklabToOklch(L, a, b_ok);
  const [L2, a2, b2_ok] = oklchToOklab(oklch.l, oklch.c, oklch.h);
  assertClose(L2, L, 1e-6, `OKLCH L roundtrip for ${hex}`);
  assertClose(a2, a, 1e-6, `OKLCH a roundtrip for ${hex}`);
  assertClose(b2_ok, b_ok, 1e-6, `OKLCH b roundtrip for ${hex}`);
}

// =============================================================================
// Suite 2: Continuous Linear Relative Luminance Y & WCAG / APCA
// =============================================================================
console.log('\n💡 Test Suite 2: Continuous-Domain Relative Luminance Y & Contrast Metrics');

assertClose(hexToRelativeLuminance('#FFFFFF'), 1.0, 1e-5, 'Luminance of Pure White is 1.0');
assertClose(hexToRelativeLuminance('#000000'), 0.0, 1e-5, 'Luminance of Pure Black is 0.0');

// WCAG contrast ratios
const crWhiteBlack = getContrastRatio('#FFFFFF', '#000000');
assertClose(crWhiteBlack, 21.0, 0.01, 'White vs Black WCAG contrast is 21:1');

const crWhiteCanvas = getContrastRatio('#FFFFFF', '#FAF9F6');
assert(crWhiteCanvas >= 1.0 && crWhiteCanvas <= 1.08, 'Canvas #FAF9F6 is subtly elevated relative to #FFFFFF');

// APCA scores
const apcaWhiteBlack = getApcaContrast('#000000', '#FFFFFF');
assert(apcaWhiteBlack >= 100, `APCA Black on White score is high: ${apcaWhiteBlack}`);
const apcaDarkOnCanvas = getApcaContrast('#0F172A', '#FAF9F6');
assert(apcaDarkOnCanvas >= 95, `APCA #0F172A on Warm Paper is body-text ready: ${apcaDarkOnCanvas}`);

// =============================================================================
// Suite 3: Perceptual Hue Bending (Volt/Lemon Yellow Bezold-Brücke Elimination)
// =============================================================================
console.log('\n🎨 Test Suite 3: Perceptual Hue Bending (Volt / Lemon Yellow Bezold-Brücke Shift)');

// Volt #E4FF00 OKLCH
const voltOklch = hexToOklch('#E4FF00');
console.log(`  Seed #E4FF00 natural OKLCH: L=${voltOklch.l.toFixed(3)}, C=${voltOklch.c.toFixed(3)}, h=${voltOklch.h.toFixed(1)}°`);

// At high lightness L=0.90, hue is unbent
const hueHighL = bendPerceptualHue(0.90, voltOklch.h);
assertClose(hueHighL, voltOklch.h, 1e-4, 'Volt hue at L=0.90 remains pure electric volt');

// At dark lightness L=0.40, hue must be smoothly bent to warm golden amber (65° - 72°)
const hueLowL = bendPerceptualHue(0.40, voltOklch.h);
assert(hueLowL >= 65 && hueLowL <= 72, `Volt hue at L=0.40 bent to warm amber: ${hueLowL.toFixed(1)}° (expected [65, 72])`);

// Intermediate lightness has smooth continuous transition
const hueMidL = bendPerceptualHue(0.65, voltOklch.h);
assert(hueMidL < voltOklch.h && hueMidL > hueLowL, `Smooth continuous transition at L=0.65: ${hueMidL.toFixed(1)}°`);

// Non-volt hue (e.g. indigo h ~ 275°) is unchanged
const indigoOklch = hexToOklch('#4F46E5');
const indigoBent = bendPerceptualHue(0.40, indigoOklch.h);
assertClose(indigoBent, indigoOklch.h, 1e-4, 'Indigo hue (275°) is not bent');

// =============================================================================
// Suite 4: Radial Chroma Gamut Mapping (MINDE)
// =============================================================================
console.log('\n🎯 Test Suite 4: Radial Chroma Gamut Mapping');

// Highly saturated out-of-gamut OKLCH query
const outOfGamutL = 0.7;
const outOfGamutC = 0.45; // Well outside sRGB gamut
const outOfGamutH = 145.0; // Neon green range
const mapped = gamutMapOklch(outOfGamutL, outOfGamutC, outOfGamutH);

assert(mapped.c < outOfGamutC, 'Gamut mapping reduced excessive chroma');
assert(mapped.c > 0.05, 'Gamut mapping preserved substantial vibrant chroma');
assertClose(mapped.l, outOfGamutL, 1e-5, 'Gamut mapping strictly preserved Lightness L');
assertClose(mapped.h, outOfGamutH, 1e-5, 'Gamut mapping strictly preserved Hue h');

const hexMapped = oklchToHex(mapped.l, mapped.c, mapped.h);
assert(/^#[0-9a-fA-F]{6}$/.test(hexMapped), `Gamut mapped color produces valid sRGB hex: ${hexMapped}`);

// =============================================================================
// Suite 5: 5-Tier Luminous Surface Architecture
// =============================================================================
console.log('\n🏛️ Test Suite 5: 5-Tier Luminous Surface Architecture');

const surfacesWarm = generateLuminousSurfaces(hexToOklch('#FF7A00')); // Warm seed -> Warm Paper
assert(surfacesWarm.canvasOklch.l >= 0.965, `Base Canvas L (${surfacesWarm.canvasOklch.l.toFixed(4)}) is >= 0.965`);
assert(surfacesWarm.card === '#FFFFFF', 'Elevated Card is pure white #FFFFFF');
assert(surfacesWarm.subSurfaceOklch.l >= 0.94, `Sub-surface L (${surfacesWarm.subSurfaceOklch.l.toFixed(4)}) is >= 0.94`);
assert(surfacesWarm.borderDeltaL >= 0.098, `Deep Luminous Border delta L (${surfacesWarm.borderDeltaL.toFixed(4)}) is >= 0.098`);
assert(surfacesWarm.insetHighlight.includes('rgba(255, 255, 255'), 'Inset Highlight is pure white specular rim');
assert(surfacesWarm.shadowCard.includes('inset'), 'Card shadow includes inset highlight layer');

// Preset selection
const surfacesIvory = generateLuminousSurfaces(hexToOklch('#4F46E5'), { canvasPreset: 'ivory' });
assert(surfacesIvory.canvas === '#FDFBF7', 'Preset ivory produces #FDFBF7');

const surfacesTitanium = generateLuminousSurfaces(hexToOklch('#0284C7')); // Cyan -> Titanium Ice
assert(surfacesTitanium.canvas === '#F8FAFC', 'Cyan seed intelligently selects Titanium Ice #F8FAFC');

// =============================================================================
// Suite 6: Challenging Seeds Suite & 100% Contrast Verification
// =============================================================================
console.log('\n⚡ Test Suite 6: Challenging Seed Colors & 100% Contrast Verification');

const challengingSeeds = [
  { name: 'Volt / Lemon Yellow', hex: '#E4FF00', expectedAmberBent: true },
  { name: 'Radiant Orange', hex: '#FF7A00', expectedAmberBent: false },
  { name: 'Neon Lime Green', hex: '#39FF14', expectedAmberBent: false },
  { name: 'Vibrant Cyan / Sky', hex: '#0284C7', expectedAmberBent: false },
  { name: 'Deep Indigo', hex: '#4F46E5', expectedAmberBent: false },
];

for (const seed of challengingSeeds) {
  console.log(`\n  Testing Seed [${seed.name}]: ${seed.hex}`);
  const palette = generateLuminousPalette(seed.hex);

  assert(
    palette.accent.solidFg === '#0F172A' || palette.accent.solidFg === '#FFFFFF',
    `Solid button foreground for ${seed.name} is analytically resolved to #0F172A or #FFFFFF`
  );
  assert(
    palette.accent.solidFgContrast >= 4.0,
    `Solid button foreground contrast on ${seed.name} is high (>= 4.0:1, got ${palette.accent.solidFgContrast.toFixed(2)}:1)`
  );

  // 2. Accent text on Canvas & Card (WCAG AA >= 4.5:1)
  console.log(`    Accent Text AA: ${palette.accent.text} (Hue: ${palette.accent.textOklch.h.toFixed(1)}°, L: ${palette.accent.textOklch.l.toFixed(3)})`);
  console.log(`      Contrast on Canvas (${palette.surfaces.canvas}): ${palette.accent.textContrastOnCanvas.toFixed(2)}:1`);
  console.log(`      Contrast on Card (${palette.surfaces.card}): ${palette.accent.textContrastOnCard.toFixed(2)}:1`);
  assert(palette.accent.textContrastOnCanvas >= 4.5, `Accent text on Canvas for ${seed.name} strictly achieves >= 4.5:1`);
  assert(palette.accent.textContrastOnCard >= 4.5, `Accent text on Card for ${seed.name} strictly achieves >= 4.5:1`);

  // If volt yellow, ensure hue was bent to amber
  if (seed.expectedAmberBent) {
    assert(
      palette.accent.textOklch.h >= 65 && palette.accent.textOklch.h <= 75,
      `Volt text hue was successfully bent to amber range: ${palette.accent.textOklch.h.toFixed(1)}°`
    );
  }

  // 3. Accent text AAA (WCAG AAA >= 7.0:1)
  console.log(`    Accent Text AAA: ${palette.accent.textAAA}`);
  console.log(`      Contrast on Canvas: ${palette.accent.textAAAContrastOnCanvas.toFixed(2)}:1`);
  console.log(`      Contrast on Card: ${palette.accent.textAAAContrastOnCard.toFixed(2)}:1`);
  assert(palette.accent.textAAAContrastOnCanvas >= 7.0, `Accent text AAA on Canvas for ${seed.name} strictly achieves >= 7.0:1`);
  assert(palette.accent.textAAAContrastOnCard >= 7.0, `Accent text AAA on Card for ${seed.name} strictly achieves >= 7.0:1`);

  // 4. Neutrals typography
  assert(palette.neutrals.textPrimaryContrastOnCanvas >= 10.0, `Primary text on Canvas for ${seed.name} has deep contrast >= 10:1`);
  assert(palette.neutrals.textSecondaryContrastOnCanvas >= 4.5, `Secondary text on Canvas for ${seed.name} has WCAG AA >= 4.5:1`);

  // 5. CSS Variables mapping
  assert(
    palette.cssVariables['--luminous-seed'].toLowerCase() === seed.hex.toLowerCase(),
    'CSS variables include seed hex'
  );
  assert(palette.cssVariables['--luminous-accent-text'] === palette.accent.text, 'CSS variables include accent-text');
}

// =============================================================================
// Suite 7: Edge Case Seeds (Black, White, Gray, Short Hex, Invalid Strings)
// =============================================================================
console.log('\n🛡️ Test Suite 7: Edge Case Seeds & Resiliency');

const edgeSeeds = [
  { label: 'Pure Black', hex: '#000000' },
  { label: 'Pure White', hex: '#FFFFFF' },
  { label: 'Medium Neutral Gray', hex: '#808080' },
  { label: 'Hot Pink / Magenta', hex: '#FF0055' },
  { label: '3-digit short hex', hex: '#f00' },
  { label: 'Hex without hash', hex: '22c55e' },
  { label: 'Invalid string', hex: 'not-a-color' },
  { label: 'Null / Undefined fallback', hex: null },
];

for (const edge of edgeSeeds) {
  const pal = generateLuminousPalette(edge.hex);
  assert(typeof pal.surfaces.canvas === 'string', `${edge.label} generates safe Canvas`);
  assert(typeof pal.accent.solid === 'string', `${edge.label} generates safe solid accent`);
  assert(pal.accent.textContrastOnCanvas >= 4.5, `${edge.label} achieves >= 4.5:1 contrast on canvas`);
  assert(pal.accent.textContrastOnCard >= 4.5, `${edge.label} achieves >= 4.5:1 contrast on card`);
}

// =============================================================================
// Suite 8: Standalone Utilities & CSS String Formatting
// =============================================================================
console.log('\n🧰 Test Suite 8: Standalone Utilities & CSS Variables Formatting');

const testPalette = generateLuminousPalette('#0284C7');

// getCssVariables as CSS string
const cssBlock = getCssVariables(testPalette);
assert(typeof cssBlock === 'string', 'getCssVariables returns string');
assert(cssBlock.startsWith(':root {'), 'CSS block begins with :root {');
assert(cssBlock.includes('--luminous-canvas:'), 'CSS block includes --luminous-canvas');

// getCssVariables as Object
const cssObj = getCssVariables(testPalette, { asObject: true });
assert(typeof cssObj === 'object' && !Array.isArray(cssObj), 'getCssVariables with asObject returns object map');
assert(cssObj['--luminous-card'] === '#FFFFFF', 'Object map includes --luminous-card');

// resolveAccessibleTextColor standalone
const resolvedAA = resolveAccessibleTextColor('#FAF9F6', { targetRatio: 4.5 });
assert(getContrastRatio(resolvedAA, '#FAF9F6') >= 4.5, 'resolveAccessibleTextColor satisfies AA on #FAF9F6');

const resolvedAAA = resolveAccessibleTextColor('#FAF9F6', { targetRatio: 7.0 });
assert(getContrastRatio(resolvedAAA, '#FAF9F6') >= 7.0, 'resolveAccessibleTextColor satisfies AAA on #FAF9F6');

// =============================================================================
// Suite 9: UMD Bundle Compatibility (CommonJS & Window Sandbox VM)
// =============================================================================
console.log('\n📦 Test Suite 9: UMD Bundle Compatibility (Node CommonJS & Browser VM)');

const umdCode = fs.readFileSync(path.join(__dirname, 'luminous_palette_engine.umd.js'), 'utf8');

// Test 9.1: CommonJS module.exports in VM
const cjsSandbox = {
  exports: {},
  module: { exports: {} },
};
vm.createContext(cjsSandbox);
vm.runInContext(umdCode, cjsSandbox);
const cjsModule = cjsSandbox.module.exports;

assert(typeof cjsModule.generateLuminousPalette === 'function', 'UMD exports generateLuminousPalette via CommonJS');
assert(typeof cjsModule.getCssVariables === 'function', 'UMD exports getCssVariables via CommonJS');
assert(typeof cjsModule.resolveAccessibleTextColor === 'function', 'UMD exports resolveAccessibleTextColor via CommonJS');

const cjsPalette = cjsModule.generateLuminousPalette('#E4FF00');
assert(cjsPalette.accent.textContrastOnCanvas >= 4.5, 'CommonJS UMD palette achieves >= 4.5:1 contrast');

// Test 9.2: Window Global Sandbox in VM
const windowSandbox = {};
windowSandbox.window = windowSandbox;
windowSandbox.globalThis = windowSandbox;
vm.createContext(windowSandbox);
vm.runInContext(umdCode, windowSandbox);

assert(typeof windowSandbox.LuminousPaletteEngine === 'object', 'UMD binds LuminousPaletteEngine to global window');
assert(typeof windowSandbox.generateLuminousPalette === 'function', 'UMD binds generateLuminousPalette to global window');

const winPalette = windowSandbox.generateLuminousPalette('#39FF14');
assert(winPalette.accent.textContrastOnCard >= 4.5, 'Window global UMD palette achieves >= 4.5:1 contrast');

// =============================================================================
// Suite 10: Master Namespace Parity
// =============================================================================
console.log('\n👑 Test Suite 10: Master Namespace Parity');

assert(LuminousPaletteEngine.version === '2.0.0', 'Engine version is 2.0.0');
assert(typeof LuminousPaletteEngine.generateLuminousPalette === 'function', 'Namespace has generateLuminousPalette');
assert(typeof LuminousPaletteEngine.bendPerceptualHue === 'function', 'Namespace has bendPerceptualHue');
assert(typeof LuminousPaletteEngine.gamutMapOklch === 'function', 'Namespace has gamutMapOklch');

console.log(`\n======================================================`);
console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests} assertions verified)`);
console.log(`======================================================\n`);
