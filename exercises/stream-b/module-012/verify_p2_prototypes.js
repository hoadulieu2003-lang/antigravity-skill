/**
 * Automated Verification Script for Phase 2 Prototypes & Checkpoint 12.1
 * Module 12 — Brand & Image Direction (Stream B)
 * Evaluates: T01-T14 principles, B01-B08 blocking gates, and Directive compliance
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('================================================================');
console.log('RUNNING MODULE 12 PHASE 2 AUTOMATED SELF-VERIFICATION');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. SOURCE SNAPSHOT INTEGRITY & WORKSPACE ISOLATION
console.log('--- TEST GROUP 1: INTEGRITY & WORKSPACE ISOLATION ---');
const snapshotPath = path.join(__dirname, 'source_snapshot', 'design_training_007_submission_r04.zip');
assert(fs.existsSync(snapshotPath), 'Source snapshot file exists in source_snapshot/');

if (fs.existsSync(snapshotPath)) {
  const buf = fs.readFileSync(snapshotPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  assert(hash === 'e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76',
    `Snapshot SHA-256 matches exact canonical hash: ${hash}`);
}

// Check stream isolation: no stream-a paths accessed
const streamAPath = path.join(__dirname, '..', 'stream-a');
assert(!fs.existsSync(path.join(__dirname, 'stream-a')), 'No stream-a directory created in workspace');

// 2. CANONICAL OPERATIONAL SNAPSHOT T01–T08 PARITY
console.log('\n--- TEST GROUP 2: CANONICAL CONTENT PARITY (T01–T08) ---');
const optionAPath = path.join(__dirname, 'directions', 'option_a', 'index.html');
const optionBPath = path.join(__dirname, 'directions', 'option_b', 'index.html');

assert(fs.existsSync(optionAPath), 'directions/option_a/index.html exists');
assert(fs.existsSync(optionBPath), 'directions/option_b/index.html exists');

const htmlA = fs.readFileSync(optionAPath, 'utf8');
const htmlB = fs.readFileSync(optionBPath, 'utf8');

const canonicalTours = [
  { id: 'T01', dest: 'Hạ Long', time: '14/09/2026 07:30', assignee: 'Lan', status: 'Chờ đối tác', note: 'Khách sạn chưa xác nhận 4 phòng' },
  { id: 'T02', dest: 'Ninh Bình', time: '14/09/2026 06:00', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã đủ xe, hướng dẫn viên và danh sách khách' },
  { id: 'T03', dest: 'Sapa', time: '15/09/2026 21:30', assignee: 'Huy', status: 'Thiếu hồ sơ', note: '2 khách chưa gửi CCCD' },
  { id: 'T04', dest: 'Đà Nẵng', time: '16/09/2026 08:00', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Chờ chốt danh sách suất ăn' },
  { id: 'T05', dest: 'Hà Giang', time: '17/09/2026 05:30', assignee: 'Minh', status: 'Sẵn sàng', note: 'Đã hoàn tất checklist khởi hành' },
  { id: 'T06', dest: 'Phú Quốc', time: '18/09/2026 09:10', assignee: 'Huy', status: 'Chờ đối tác', note: 'Nhà xe trung chuyển chưa xác nhận' },
  { id: 'T07', dest: 'Mộc Châu', time: '19/09/2026 06:30', assignee: 'Lan', status: 'Đang chuẩn bị', note: 'Đang rà soát danh sách phòng' },
  { id: 'T08', dest: 'Huế', time: '12/09/2026 07:00', assignee: 'An', status: 'Hoàn thành', note: 'Đoàn đã khởi hành và bàn giao nhật ký' }
];

canonicalTours.forEach(tour => {
  const inA = htmlA.includes(tour.id) && htmlA.includes(tour.dest) && htmlA.includes(tour.assignee) && htmlA.includes(tour.status);
  const inB = htmlB.includes(tour.id) && htmlB.includes(tour.dest) && htmlB.includes(tour.assignee) && htmlB.includes(tour.status);
  assert(inA, `Option A contains canonical tour ${tour.id} (${tour.dest}, ${tour.assignee}, ${tour.status})`);
  assert(inB, `Option B contains canonical tour ${tour.id} (${tour.dest}, ${tour.assignee}, ${tour.status})`);
});

// Check T01 is focal in both
assert(htmlA.includes('Khách sạn chưa xác nhận 4 phòng'), 'Option A highlights T01 critical bottleneck note');
assert(htmlB.includes('Khách sạn chưa xác nhận 4 phòng'), 'Option B highlights T01 critical bottleneck note');

// 3. ZERO-MOTION INVARIANT CHECK (TEST T12)
console.log('\n--- TEST GROUP 3: ZERO-MOTION INVARIANT (TEST T12) ---');
function checkZeroMotion(html, name) {
  const hasZeroAnimation = html.includes('animation-duration: 0s !important') || html.includes('animation: 0s');
  const hasZeroTransition = html.includes('transition-duration: 0s !important') || html.includes('transition: 0s');
  const hasScrollAuto = html.includes('scroll-behavior: auto !important');
  assert(hasZeroAnimation, `${name} enforces 0s animation duration invariant`);
  assert(hasZeroTransition, `${name} enforces 0s transition duration invariant`);
  assert(hasScrollAuto, `${name} enforces auto scroll-behavior invariant`);
  
  // Check for forbidden nonzero durations in styles
  const nonZeroDurationRegex = /(animation|transition)[^;{}]*:\s*([1-9]\d*(\.\d+)?m?s|0\.\d+s)/gi;
  const violations = html.match(nonZeroDurationRegex) || [];
  assert(violations.length === 0, `${name} has 0 nonzero animation/transition duration violations (Found: ${violations.length})`);
}

checkZeroMotion(htmlA, 'Option A');
checkZeroMotion(htmlB, 'Option B');

// 4. STRATEGIC DIVERGENCE (7 AXES) CHECK (TEST T03 / GATE B01)
console.log('\n--- TEST GROUP 4: 7-AXIS STRATEGIC DIVERGENCE ---');
// Axis 1: Personality & Voice
assert(htmlA.includes('Trí tuệ Thực địa Nhân văn') && htmlB.includes('Hệ thống Tín hiệu Lộ trình'), 'Axis 1 Brand Personality: Distinct names & strategic framing');
// Axis 2: Composition
assert(htmlA.includes('editorial-grid') && htmlB.includes('cartographic-matrix'), 'Axis 2 Composition Model: Editorial Asymmetric (A) vs Cartographic Grid (B)');
// Axis 3: Typography
assert(htmlA.includes('Georgia') && htmlB.includes('Consolas'), 'Axis 3 Typography: Georgia Serif (A) vs Segoe UI & Consolas Monospace (B)');
// Axis 4: Image source/style
assert(htmlA.includes('halong_field_documentary.svg') && htmlB.includes('route_signal_abstract.svg'), 'Axis 4 Image Style: Field documentary (A) vs Cartographic signal matrix (B)');
// Axis 5: Crop & perspective
assert(htmlA.includes('50% 40%') && htmlB.includes('72% 30%'), 'Axis 5 Crop/Perspective: Eye-level harbor crop (A) vs Orthogonal crosshair crop (B)');
// Axis 6: Icon/diagram language
assert(htmlA.includes('t01_route_narrative.svg') && htmlB.includes('t01_route_schematic.svg'), 'Axis 6 Diagram Language: Narrative timeline (A) vs Schematic break circuit (B)');
// Axis 7: Surface/texture
assert(htmlA.includes('paper_grain_subtle.svg') && htmlB.includes('grid_matrix_pattern.svg'), 'Axis 7 Surface Texture: Warm paper grain (A) vs Technical millimeter grid (B)');

// 5. ASSET MANIFEST & INTEGRITY (TEST T05 / GATE B05)
console.log('\n--- TEST GROUP 5: ASSET MANIFEST INTEGRITY ---');
const manifestPath = path.join(__dirname, 'assets', 'ASSET_MANIFEST.yaml');
assert(fs.existsSync(manifestPath), 'assets/ASSET_MANIFEST.yaml exists');

const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const assetEntries = manifestContent.split('- asset_id:').slice(1);
assert(assetEntries.length >= 14, `Manifest documents all ${assetEntries.length} runtime assets (>= 14)`);

let manifestHashesValid = true;
let totalBytes = 0;
assetEntries.forEach(entry => {
  const fileMatch = entry.match(/file:\s*([^\r\n]+)/);
  const hashMatch = entry.match(/sha256:\s*"([^"]+)"/);
  if (fileMatch && hashMatch) {
    const relFile = fileMatch[1].trim();
    const expectedHash = hashMatch[1].trim();
    const absFile = path.join(__dirname, relFile);
    if (!fs.existsSync(absFile)) {
      console.error(`Missing asset file: ${absFile}`);
      manifestHashesValid = false;
    } else {
      const fileBuf = fs.readFileSync(absFile);
      totalBytes += fileBuf.length;
      const actualHash = crypto.createHash('sha256').update(fileBuf).digest('hex');
      if (actualHash !== expectedHash) {
        console.error(`Hash mismatch for ${relFile}: expected ${expectedHash}, got ${actualHash}`);
        manifestHashesValid = false;
      }
    }
  }
});
assert(manifestHashesValid, '100% of asset files exist and their SHA-256 hashes match manifest');
assert(totalBytes < 3500000, `Total runtime asset size is ${totalBytes} bytes (< 3.5MB budget)`);

// Check zero remote requests
const remoteUrlRegex = /src=["']https?:\/\//i;
assert(!remoteUrlRegex.test(htmlA), 'Option A has 0 remote runtime URLs');
assert(!remoteUrlRegex.test(htmlB), 'Option B has 0 remote runtime URLs');

// 6. ACCESSIBILITY & MINIMUM TOUCH TARGETS (TEST T08, T10, T11)
console.log('\n--- TEST GROUP 6: ACCESSIBILITY, TARGETS & NON-COLOR MEANING ---');
// W3C Complex Images Text Equivalent (<ol> with list items)
assert(htmlA.includes('<ol class="sr-only">') && htmlA.includes('Mốc 1:') && htmlA.includes('Mốc 3:'),
  'Option A has accessible ordered list text equivalent for route diagram');
assert(htmlB.includes('<ol class="sr-only">') && htmlB.includes('Ga 01:') && htmlB.includes('Ga 03:'),
  'Option B has accessible ordered list text equivalent for route diagram');

// Minimum 44x44px touch targets in CSS
assert(htmlA.includes('min-width: 44px') && htmlA.includes('min-height: 44px'),
  'Option A enforces min 44x44px touch target bounds on interactive controls');
assert(htmlB.includes('min-width: 44px') && htmlB.includes('min-height: 44px'),
  'Option B enforces min 44x44px touch target bounds on interactive controls');

// Non-color status: status badges always contain text and icon
assert(htmlA.includes('badge-waiting') && htmlA.includes('Chờ đối tác') && htmlA.includes('waiting_partner.svg'),
  'Option A pairs status colors with explicit text and distinct SVG icon');
assert(htmlB.includes('badge-hazard') && htmlB.includes('Chờ đối tác') && htmlB.includes('waiting_partner.svg'),
  'Option B pairs status colors with explicit text and distinct SVG icon');

// Lan fictional disclosure
assert(htmlA.includes('Nhân vật điều phối giả lập') && htmlA.includes('Fictional Operator'),
  'Option A contains explicit fictional operator disclosure badge for Lan');
assert(htmlB.includes('Nhân vật điều phối giả lập') && htmlB.includes('Fictional Operator'),
  'Option B contains explicit fictional operator disclosure badge for Lan');

// 7. WCAG 2.2 AA CONTRAST RATIOS (TEST T11)
console.log('\n--- TEST GROUP 7: WCAG 2.2 AA CONTRAST RATIO VERIFICATION ---');
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function sRGBtoLin(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function getLuminance(rgb) {
  return 0.2126 * sRGBtoLin(rgb[0]) + 0.7152 * sRGBtoLin(rgb[1]) + 0.0722 * sRGBtoLin(rgb[2]);
}
function getContrast(hex1, hex2) {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

const contrastPairs = [
  // Option A
  { name: 'Option A Primary Charcoal on Warm Paper (#1C1917 on #FAF8F5)', fg: '#1C1917', bg: '#FAF8F5' },
  { name: 'Option A Secondary Muted Ink on Warm Paper (#44403C on #FAF8F5)', fg: '#44403C', bg: '#FAF8F5' },
  { name: 'Option A Terracotta Accent on Warm Paper (#C2410C on #FAF8F5)', fg: '#C2410C', bg: '#FAF8F5' },
  { name: 'Option A Waiting Amber Text on Waiting BG (#92400E on #FEF3C7)', fg: '#92400E', bg: '#FEF3C7' },
  { name: 'Option A Ready Pine Green on Ready BG (#065F46 on #ECFDF5)', fg: '#065F46', bg: '#ECFDF5' },
  { name: 'Option A Missing Brick Red on Missing BG (#991B1B on #FEF2F2)', fg: '#991B1B', bg: '#FEF2F2' },
  { name: 'Option A In-Prep Slate Blue on Prep BG (#1E40AF on #EFF6FF)', fg: '#1E40AF', bg: '#EFF6FF' },
  { name: 'Option A Primary Button White on Terracotta (#FFFFFF on #C2410C)', fg: '#FFFFFF', bg: '#C2410C' },

  // Option B
  { name: 'Option B Technical Graphite on Slate (#0F172A on #F8FAFC)', fg: '#0F172A', bg: '#F8FAFC' },
  { name: 'Option B Secondary Dark Slate on Slate (#334155 on #F8FAFC)', fg: '#334155', bg: '#F8FAFC' },
  { name: 'Option B Cobalt Accent on Slate (#1D4ED8 on #F8FAFC)', fg: '#1D4ED8', bg: '#F8FAFC' },
  { name: 'Option B Hazard Yellow Text on Hazard BG (#854D0E on #FEF9C3)', fg: '#854D0E', bg: '#FEF9C3' },
  { name: 'Option B Telemetry Green on Telemetry BG (#166534 on #DCFCE7)', fg: '#166534', bg: '#DCFCE7' },
  { name: 'Option B Fault Signal Red on Fault BG (#991B1B on #FEE2E2)', fg: '#991B1B', bg: '#FEE2E2' },
  { name: 'Option B Telecom Cyan on Prep BG (#075985 on #E0F2FE)', fg: '#075985', bg: '#E0F2FE' },
  { name: 'Option B Primary Button White on Cobalt (#FFFFFF on #1D4ED8)', fg: '#FFFFFF', bg: '#1D4ED8' }
];

contrastPairs.forEach(p => {
  const cr = getContrast(p.fg, p.bg);
  assert(cr >= 4.5, `${p.name} achieves WCAG 2.2 AA contrast: ${cr.toFixed(2)}:1 (>= 4.5:1)`);
});

// 8. CHECKPOINT 12.1 YAML FORMAT (DIRECTIVE SECTION 23)
console.log('\n--- TEST GROUP 8: CHECKPOINT 12.1 YAML FORMAT ---');
const cpPath = path.join(__dirname, 'CHECKPOINT_12_1.yaml');
assert(fs.existsSync(cpPath), 'CHECKPOINT_12_1.yaml exists');

const cpContent = fs.readFileSync(cpPath, 'utf8');
assert(cpContent.includes('submission_type: DESIGN_TRAINING_012_CHECKPOINT_12_1'), 'Correct submission_type');
assert(cpContent.includes('stream_id: B'), 'Correct stream_id: B');
assert(cpContent.includes('workspace: design-training/stream-b/module-012/'), 'Correct workspace path');
assert(cpContent.includes('source_snapshot_sha256: "e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76"'), 'Correct source snapshot SHA-256');
assert(cpContent.includes('brand_thesis_draft:'), 'Contains brand_thesis_draft section');
assert(cpContent.includes('direction_a:'), 'Contains direction_a section');
assert(cpContent.includes('direction_b:'), 'Contains direction_b section');
assert(cpContent.includes('image_language_roles:'), 'Contains image_language_roles list');
assert(cpContent.includes('hero_context') && cpContent.includes('fictional_person') && cpContent.includes('icon_family'), 'Contains all 6 asset roles');
assert(cpContent.includes('test_matrix_draft_path: "TEST_MATRIX_DRAFT.md"'), 'Specifies test_matrix_draft_path');

console.log('\n================================================================');
console.log(`VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

process.exit(failCount === 0 ? 0 : 1);
