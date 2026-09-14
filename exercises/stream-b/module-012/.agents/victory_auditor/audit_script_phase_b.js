const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('====================================================');
console.log('PHASE B — INTEGRITY & CANONICAL DATA DETAILED AUDIT');
console.log('====================================================');

// 1. Asset Manifest Hash Verification
const manifestContent = fs.readFileSync('assets/ASSET_MANIFEST.yaml', 'utf8');
const lines = manifestContent.split('\n');
let currentPath = null;
let currentSha = null;
const assets = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('file:')) {
    currentPath = trimmed.replace('file:', '').trim().replace(/['"]/g, '');
  } else if (trimmed.startsWith('sha256:')) {
    currentSha = trimmed.replace('sha256:', '').trim().replace(/['"]/g, '');
    if (currentPath && currentSha) {
      assets.push({ path: currentPath, expectedSha: currentSha });
      currentPath = null;
      currentSha = null;
    }
  }
}

console.log(`Checking ${assets.length} assets declared in assets/ASSET_MANIFEST.yaml:`);
let assetPass = true;
for (const a of assets) {
  if (!fs.existsSync(a.path)) {
    console.log(`  FAIL: Missing file ${a.path}`);
    assetPass = false;
    continue;
  }
  const fileBuf = fs.readFileSync(a.path);
  const measuredSha = crypto.createHash('sha256').update(fileBuf).digest('hex');
  const match = measuredSha.toLowerCase() === a.expectedSha.toLowerCase();
  console.log(`  ${a.path} (${fileBuf.length} B) -> SHA-256 match: ${match}`);
  if (!match) {
    console.log(`    Expected: ${a.expectedSha}`);
    console.log(`    Measured: ${measuredSha}`);
    assetPass = false;
  }
}
console.log(`Asset Manifest Verification: ${assetPass ? 'PASS' : 'FAIL'}`);

// 2. Canonical Dataset T01-T08 Verification
console.log('\n--- Checking Canonical Dataset T01-T08 in Option A and Option B ---');
const expectedTours = [
  { id: 'T01', title: 'Hạ Long 2N1Đ', time: '14/09/2026 07:30', assignee: 'Lan', status: 'Chờ đối tác', issue: 'Khách sạn chưa xác nhận 4 phòng' },
  { id: 'T02', title: 'Ninh Bình 1 ngày', time: '14/09/2026 06:00', assignee: 'Minh', status: 'Sẵn sàng', issue: 'Đã đủ xe, hướng dẫn viên và danh sách khách' },
  { id: 'T03', title: 'Sapa 3N2Đ', time: '15/09/2026 21:30', assignee: 'Huy', status: 'Thiếu hồ sơ', issue: '2 khách chưa gửi CCCD' },
  { id: 'T04', title: 'Đà Nẵng 4N3Đ', time: '16/09/2026 08:00', assignee: 'Lan', status: 'Đang chuẩn bị', issue: 'Chờ chốt danh sách suất ăn' },
  { id: 'T05', title: 'Hà Giang 3N2Đ', time: '17/09/2026 05:30', assignee: 'Minh', status: 'Sẵn sàng', issue: 'Đã hoàn tất checklist khởi hành' },
  { id: 'T06', title: 'Phú Quốc 3N2Đ', time: '18/09/2026 09:10', assignee: 'Huy', status: 'Chờ đối tác', issue: 'Nhà xe trung chuyển chưa xác nhận' },
  { id: 'T07', title: 'Mộc Châu 2N1Đ', time: '19/09/2026 06:30', assignee: 'Lan', status: 'Đang chuẩn bị', issue: 'Đang rà soát danh sách phòng' },
  { id: 'T08', title: 'Huế 3N2Đ', time: '12/09/2026 07:00', assignee: 'An', status: 'Hoàn thành', issue: 'Đoàn đã khởi hành và bàn giao nhật ký' }
];

const optionAContent = fs.readFileSync('directions/option_a/index.html', 'utf8');
const optionBContent = fs.readFileSync('directions/option_b/index.html', 'utf8');

function checkDatasetInHtml(html, label) {
  let pass = true;
  console.log(`Checking ${label}...`);
  for (const tour of expectedTours) {
    const hasId = html.includes(tour.id);
    const hasTitle = html.includes(tour.title);
    const hasTime = html.includes(tour.time);
    const hasAssignee = html.includes(tour.assignee);
    const hasStatus = html.includes(tour.status);
    const hasIssue = html.includes(tour.issue);
    const tourPass = hasId && hasTitle && hasTime && hasAssignee && hasStatus && hasIssue;
    if (!tourPass) {
      console.log(`  FAIL on ${tour.id}: id=${hasId}, title=${hasTitle}, time=${hasTime}, assignee=${hasAssignee}, status=${hasStatus}, issue=${hasIssue}`);
      pass = false;
    } else {
      console.log(`  PASS ${tour.id} (${tour.title}, ${tour.assignee}, ${tour.status})`);
    }
  }
  return pass;
}

const passA = checkDatasetInHtml(optionAContent, 'Option A');
const passB = checkDatasetInHtml(optionBContent, 'Option B');
console.log(`Dataset Parity: Option A = ${passA ? 'PASS' : 'FAIL'}, Option B = ${passB ? 'PASS' : 'FAIL'}`);

// 3. Focal Tour T01 and Persona Lan check
console.log('\n--- Checking Focal Tour T01 and Fictional Persona Lan ---');
const t01FocusA = optionAContent.includes('T01') && optionAContent.includes('Hạ Long') && optionAContent.includes('Khách sạn chưa xác nhận 4 phòng');
const t01FocusB = optionBContent.includes('T01') && optionBContent.includes('Hạ Long') && optionBContent.includes('Khách sạn chưa xác nhận 4 phòng');
const lanPersonaA = (optionAContent.includes('giả lập') || optionAContent.includes('Nhân vật giả lập') || optionAContent.includes('fictional')) && optionAContent.includes('Lan');
const lanPersonaB = (optionBContent.includes('giả lập') || optionBContent.includes('Nhân vật giả lập') || optionBContent.includes('fictional')) && optionBContent.includes('Lan');

console.log(`T01 Focal Point: Option A = ${t01FocusA}, Option B = ${t01FocusB}`);
console.log(`Fictional Persona Lan: Option A = ${lanPersonaA}, Option B = ${lanPersonaB}`);

// 4. Anchor timestamp check (13/09/2026 18:00 Asia/Ho_Chi_Minh)
const anchorA = optionAContent.includes('13/09/2026') && optionAContent.includes('18:00');
const anchorB = optionBContent.includes('13/09/2026') && optionBContent.includes('18:00');
console.log(`Anchor Timestamp (13/09/2026 18:00): Option A = ${anchorA}, Option B = ${anchorB}`);

// 5. Zero-Motion Invariant check in HTML/CSS
console.log('\n--- Checking Zero-Motion Invariant in Prototypes ---');
function checkZeroMotion(html, label) {
  // Check for keyframes
  const hasKeyframes = /@keyframes/i.test(html);
  // Check for transition duration > 0s
  const transitionMatches = html.match(/transition(?:-duration)?\s*:\s*([^;]+);/gi) || [];
  let badTransitions = [];
  for (const t of transitionMatches) {
    const val = t.toLowerCase();
    if (!val.includes('0s') && !val.includes('none') && !val.includes('inherit') && !val.includes('initial')) {
      badTransitions.push(t);
    }
  }
  // Check for animation duration > 0s
  const animMatches = html.match(/animation(?:-duration)?\s*:\s*([^;]+);/gi) || [];
  let badAnims = [];
  for (const a of animMatches) {
    const val = a.toLowerCase();
    if (!val.includes('0s') && !val.includes('none')) {
      badAnims.push(a);
    }
  }
  console.log(`${label} Zero-Motion: keyframes=${hasKeyframes}, badTransitions=${badTransitions.length}, badAnimations=${badAnims.length}`);
  if (badTransitions.length > 0) console.log('  Bad transitions:', badTransitions);
  if (badAnims.length > 0) console.log('  Bad animations:', badAnims);
  return !hasKeyframes && badTransitions.length === 0 && badAnims.length === 0;
}

const zmA = checkZeroMotion(optionAContent, 'Option A');
const zmB = checkZeroMotion(optionBContent, 'Option B');
console.log(`Zero-Motion Invariant: Option A = ${zmA ? 'PASS' : 'FAIL'}, Option B = ${zmB ? 'PASS' : 'FAIL'}`);
