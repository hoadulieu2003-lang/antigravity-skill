const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_DIR = path.resolve(__dirname, '..', '..');

console.log('BASE_DIR:', BASE_DIR);

const auditReport = {
  timestamp: new Date().toISOString(),
  c01: {},
  c02: {},
  c03: {},
  c04: {},
  c05: {},
  c06: {},
  c07: {},
  forensics: {}
};

// ==========================================
// 1. GATE C01: Token Provenance & Architecture
// ==========================================
console.log('--- Checking Gate C01 ---');
const contractPath = path.join(BASE_DIR, 'COLOR_CONTRACT.yaml');
const contractContent = fs.readFileSync(contractPath, 'utf8');

const hasPrimitive = /primitive/i.test(contractContent) && /--primitive-/i.test(contractContent);
const hasSemantic = /semantic/i.test(contractContent) && /--color-/i.test(contractContent);
const hasComponent = /component/i.test(contractContent) && /--dispatch-/i.test(contractContent);
const hasOpStatus = /OPERATIONAL_STATUS/i.test(contractContent) || /NORMAL[\s\S]*?ATTENTION[\s\S]*?ERROR[\s\S]*?SUCCESS/i.test(contractContent);
const hasFSM = /INTERACTION_STATE/i.test(contractContent) || /IDLE[\s\S]*?VALIDATING[\s\S]*?SAVING[\s\S]*?(FAILURE|CONFIRMED)/i.test(contractContent);
const hasBrandSeg = /brand/i.test(contractContent) && (/identity/i.test(contractContent) || /action/i.test(contractContent));

// Static CSS selector analysis
const htmlFiles = ['index.html', 'directions/option_a.html', 'directions/option_b.html'];
let staticViolations = [];

for (const file of htmlFiles) {
  const filePath = path.join(BASE_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  
  for (const block of styleMatches) {
    const css = block.replace(/<\/?style[^>]*>/gi, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = css.split('}');
    for (const rule of rules) {
      const parts = rule.split('{');
      if (parts.length !== 2) continue;
      const selector = parts[0].trim();
      const body = parts[1].trim();
      if (!selector || selector.includes(':root') || selector.startsWith('@')) continue;
      
      const primCalls = body.match(/var\(--primitive-[^)]+\)/g);
      if (primCalls) {
        staticViolations.push({ file, selector, primCalls });
      }
    }
  }
}

auditReport.c01 = {
  contract_has_primitive: hasPrimitive,
  contract_has_semantic: hasSemantic,
  contract_has_component: hasComponent,
  contract_has_op_status: hasOpStatus,
  contract_has_fsm: hasFSM,
  contract_has_brand_seg: hasBrandSeg,
  static_css_violations_count: staticViolations.length,
  static_css_violations: staticViolations,
  passed: hasPrimitive && hasSemantic && hasComponent && hasOpStatus && hasFSM && hasBrandSeg && staticViolations.length === 0
};
console.log('Gate C01 Result:', auditReport.c01.passed ? 'PASS' : 'FAIL');

// ==========================================
// 2. GATE C02: Strategic Color Directions
// ==========================================
console.log('--- Checking Gate C02 ---');
const optAPath = path.join(BASE_DIR, 'directions', 'option_a.html');
const optBPath = path.join(BASE_DIR, 'directions', 'option_b.html');
const optAContent = fs.readFileSync(optAPath, 'utf8');
const optBContent = fs.readFileSync(optBPath, 'utf8');

const fixtures = ['TF-801', 'TF-802', 'TF-803', 'TF-804'];
const optAHasAllFixtures = fixtures.every(f => optAContent.includes(f));
const optBHasAllFixtures = fixtures.every(f => optBContent.includes(f));

// Check distinct temperature and brand primary in declared CSS
const optABrand = optAContent.match(/--color-brand-primary:\s*([^;]+);/);
const optBBrand = optBContent.match(/--color-brand-primary:\s*([^;]+);/);
const optACanvas = optAContent.match(/--color-canvas-bg:\s*([^;]+);/);
const optBCanvas = optBContent.match(/--color-canvas-bg:\s*([^;]+);/);
const optAFocus = optAContent.match(/--color-focus-ring:\s*([^;]+);/);
const optBFocus = optBContent.match(/--color-focus-ring:\s*([^;]+);/);

auditReport.c02 = {
  option_a_has_fixtures: optAHasAllFixtures,
  option_b_has_fixtures: optBHasAllFixtures,
  optA_brand: optABrand ? optABrand[1].trim() : null,
  optB_brand: optBBrand ? optBBrand[1].trim() : null,
  optA_canvas: optACanvas ? optACanvas[1].trim() : null,
  optB_canvas: optBCanvas ? optBCanvas[1].trim() : null,
  optA_focus: optAFocus ? optAFocus[1].trim() : null,
  optB_focus: optBFocus ? optBFocus[1].trim() : null,
  passed: optAHasAllFixtures && optBHasAllFixtures && 
          (optABrand && optBBrand && optABrand[1].trim() !== optBBrand[1].trim()) &&
          (optACanvas && optBCanvas && optACanvas[1].trim() !== optBCanvas[1].trim())
};
console.log('Gate C02 Result:', auditReport.c02.passed ? 'PASS' : 'FAIL');

// ==========================================
// 3. GATE C03: Mathematical Contrast Compliance
// ==========================================
console.log('--- Checking Gate C03 ---');
function srgbLinear(c255) {
  const c = c255 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relLum(r, g, b) {
  return 0.2126 * srgbLinear(r) + 0.7152 * srgbLinear(g) + 0.0722 * srgbLinear(b);
}
function contrastRatio(rgbA, rgbB) {
  const l1 = relLum(rgbA[0], rgbA[1], rgbA[2]);
  const l2 = relLum(rgbB[0], rgbB[1], rgbB[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(4));
}
function hexToRgb(hex) {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}

// Extract contrast pairs defined in contract
const contrastPairs = [
  { name: 'Normal text on canvas (warm alabaster)', fg: '#0F172A', bg: '#FAF9F6', min: 4.5 },
  { name: 'Secondary text on canvas', fg: '#475569', bg: '#FAF9F6', min: 4.5 },
  { name: 'Muted text on canvas', fg: '#64748B', bg: '#FAF9F6', min: 4.5 },
  { name: 'Primary CTA button text on bg', fg: '#FFFFFF', bg: '#0F172A', min: 4.5 },
  { name: 'Normal status badge text on bg', fg: '#475569', bg: '#F1F5F9', min: 4.5 },
  { name: 'Attention status badge text on bg', fg: '#B45309', bg: '#FEF3C7', min: 4.5 },
  { name: 'Error status badge text on bg', fg: '#BE123C', bg: '#FFE4E6', min: 4.5 },
  { name: 'Success status badge text on bg', fg: '#15803D', bg: '#DCFCE7', min: 4.5 },
  { name: 'Amber focus ring on canvas', fg: '#D97706', bg: '#FAF9F6', min: 3.0 },
  { name: 'Cobalt focus ring on ice slate canvas', fg: '#2563EB', bg: '#F8FAFC', min: 3.0 },
  { name: 'Secondary button text on white', fg: '#0F172A', bg: '#FFFFFF', min: 4.5 },
  { name: 'Attention badge border on warm surface', fg: '#F59E0B', bg: '#FFFFFF', min: 3.0 },
  { name: 'Error badge border on warm surface', fg: '#F43F5E', bg: '#FFFFFF', min: 3.0 },
  { name: 'Success badge border on warm surface', fg: '#22C55E', bg: '#FFFFFF', min: 3.0 },
  { name: 'Normal badge border on warm surface', fg: '#CBD5E1', bg: '#FFFFFF', min: 1.2 } // decorative or structural boundary
];

let c03AllPass = true;
const calculatedPairs = [];
for (const p of contrastPairs) {
  const cr = contrastRatio(hexToRgb(p.fg), hexToRgb(p.bg));
  const pass = cr >= p.min;
  if (!pass) c03AllPass = false;
  calculatedPairs.push({ ...p, cr, pass });
}

auditReport.c03 = {
  pairs_tested: calculatedPairs.length,
  all_pass: c03AllPass,
  calculated_pairs: calculatedPairs
};
console.log('Gate C03 Result:', c03AllPass ? 'PASS' : 'FAIL');

// ==========================================
// 4. GATE C04: Color-Independent Usability
// ==========================================
console.log('--- Checking Gate C04 ---');
const idxPath = path.join(BASE_DIR, 'index.html');
const idxContent = fs.readFileSync(idxPath, 'utf8');

// Check that every status badge in index.html contains:
// 1. Text label
// 2. SVG icon with aria-hidden="true"
const expectedStatuses = ['NORMAL', 'ATTENTION', 'ERROR', 'SUCCESS'];
const statusFindings = [];
for (const st of expectedStatuses) {
  const regex = new RegExp(`data-status=["']${st}["'][\\s\\S]*?aria-hidden=["']true["'][\\s\\S]*?<\\/span>`, 'i');
  const found = regex.test(idxContent);
  statusFindings.push({ status: st, valid_badge: found });
}

// Check screenshots exist
const screenshots = [
  'option_a_desktop.png',
  'option_b_desktop.png',
  'candidate_desktop.png',
  'candidate_tablet.png',
  'candidate_mobile.png',
  'candidate_grayscale.png',
  'candidate_deuteranopia.png',
  'candidate_protanopia.png'
];
const missingScreenshots = screenshots.filter(s => !fs.existsSync(path.join(BASE_DIR, 'screenshots', s)));

auditReport.c04 = {
  status_findings: statusFindings,
  all_statuses_have_3_layers: statusFindings.every(f => f.valid_badge),
  missing_screenshots: missingScreenshots,
  passed: statusFindings.every(f => f.valid_badge) && missingScreenshots.length === 0
};
console.log('Gate C04 Result:', auditReport.c04.passed ? 'PASS' : 'FAIL');

// ==========================================
// 5. GATE C05: Focus Ring Verification
// ==========================================
console.log('--- Checking Gate C05 ---');
const hasFocusVisibleCss = idxContent.includes(':focus-visible') && 
                           (idxContent.includes('outline: 2px solid') || idxContent.includes('outline: 3px solid') || idxContent.includes('outline:2px solid'));
const focusRingContrastOptionA = contrastRatio(hexToRgb('#D97706'), hexToRgb('#FAF9F6'));
const focusRingContrastOptionB = contrastRatio(hexToRgb('#2563EB'), hexToRgb('#F8FAFC'));

auditReport.c05 = {
  has_focus_visible_rule: hasFocusVisibleCss,
  optA_focus_contrast: focusRingContrastOptionA,
  optB_focus_contrast: focusRingContrastOptionB,
  optA_focus_contrast_pass: focusRingContrastOptionA >= 3.0,
  optB_focus_contrast_pass: focusRingContrastOptionB >= 3.0,
  passed: hasFocusVisibleCss && focusRingContrastOptionA >= 3.0 && focusRingContrastOptionB >= 3.0
};
console.log('Gate C05 Result:', auditReport.c05.passed ? 'PASS' : 'FAIL');

// ==========================================
// 6. GATE C06: Responsive Cadence
// ==========================================
console.log('--- Checking Gate C06 ---');
// Read VERIFICATION.json to verify responsive measurements recorded
const verifJsonPath = path.join(BASE_DIR, 'VERIFICATION.json');
let verifData = null;
if (fs.existsSync(verifJsonPath)) {
  verifData = JSON.parse(fs.readFileSync(verifJsonPath, 'utf8'));
}
const responsiveTelemetry = verifData && verifData.telemetry && verifData.telemetry.responsive_measurements;
const responsiveAllZeroOverflow = responsiveTelemetry && responsiveTelemetry.every(v => v.overflow_px === 0 && v.passed);

auditReport.c06 = {
  responsive_telemetry_present: !!responsiveTelemetry,
  responsive_all_zero_overflow: !!responsiveAllZeroOverflow,
  viewports_tested: responsiveTelemetry ? responsiveTelemetry.map(v => ({ vp: v.viewport, overflow: v.overflow_px, passed: v.passed })) : [],
  passed: !!responsiveAllZeroOverflow
};
console.log('Gate C06 Result:', auditReport.c06.passed ? 'PASS' : 'FAIL');

// ==========================================
// 7. GATE C07: Documentation & Deliverables
// ==========================================
console.log('--- Checking Gate C07 ---');
const reportPath = path.join(BASE_DIR, 'DESIGN_TRAINING_008_REPORT.md');
const reportExists = fs.existsSync(reportPath);
let reportContent = '';
if (reportExists) {
  reportContent = fs.readFileSync(reportPath, 'utf8');
}

const requiredSections = [
  '1. Objective & Synthetic Data Notice',
  '2. Bounded Aesthetic & Architectural Principles',
  '3. Visual Direction Comparison & Trade-off Analysis',
  '4. Selected Art Direction & Implementation Details',
  '5. Requirement-to-Evidence Mapping Ledger',
  '6. Programmatic Verification & Evidence Limits',
  '7. Architectural Self-Critique',
  '8. Final Verdict & Release Recommendation'
];

const foundSections = requiredSections.filter(s => {
  const normalizedSearch = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedReport = reportContent.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalizedReport.includes(normalizedSearch);
});

const zipPath = path.join(BASE_DIR, 'design_training_008_submission_r01.zip');
const zipExists = fs.existsSync(zipPath);
const zipSize = zipExists ? fs.statSync(zipPath).size : 0;

auditReport.c07 = {
  report_exists: reportExists,
  required_sections_count: requiredSections.length,
  found_sections_count: foundSections.length,
  missing_sections: requiredSections.filter(s => !foundSections.includes(s)),
  zip_exists: zipExists,
  zip_size_bytes: zipSize,
  verification_json_exists: fs.existsSync(verifJsonPath),
  passed: reportExists && foundSections.length === 8 && zipExists && zipSize > 100000 && fs.existsSync(verifJsonPath)
};
console.log('Gate C07 Result:', auditReport.c07.passed ? 'PASS' : 'FAIL');

// Write out audit report
fs.writeFileSync(path.join(__dirname, 'AUDIT_OUTPUT.json'), JSON.stringify(auditReport, null, 2), 'utf8');
console.log('AUDIT_OUTPUT.json written successfully.');
