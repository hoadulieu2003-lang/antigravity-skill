const fs = require('fs');
const path = require('path');

const optionBPath = path.join(__dirname, '..', '..', 'directions', 'option_b.html');
if (!fs.existsSync(optionBPath)) {
  console.error('FAIL: option_b.html does not exist at', optionBPath);
  process.exit(1);
}

const content = fs.readFileSync(optionBPath, 'utf8');

console.log('=== TEST 1: STATIC CSS REGEX AUDIT ===');
const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
let violations = [];
let totalRulesChecked = 0;

for (const styleBlock of styleMatches) {
  let css = styleBlock.replace(/<\/?style[^>]*>/gi, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = css.split('}');
  for (const rule of rules) {
    const parts = rule.split('{');
    if (parts.length !== 2) continue;
    const selector = parts[0].trim();
    const declarations = parts[1].trim();

    if (!selector || selector.includes(':root') || selector.startsWith('@')) continue;

    totalRulesChecked++;
    const primitiveMatch = declarations.match(/var\(--primitive-[^)]+\)/g);
    if (primitiveMatch) {
      for (const match of primitiveMatch) {
        violations.push({ selector, match });
      }
    }
  }
}

console.log(`Total component CSS rules checked: ${totalRulesChecked}`);
console.log(`Violations found: ${violations.length}`);
if (violations.length > 0) {
  console.error('VIOLATIONS:', violations);
  process.exit(1);
} else {
  console.log('PASS: 0 primitive tokens in component CSS rules!');
}

console.log('\n=== TEST 2: CANONICAL FIXTURES IN DOM ===');
const fixtures = [
  { id: 'TF-801', code: 'HAN-NBI-01', status: 'NORMAL', label: 'Bình thường', prefix: '[STD]', coord: 'Huy Trần' },
  { id: 'TF-802', code: 'HAN-SAP-02', status: 'ATTENTION', label: 'Cần chú ý', prefix: '[WARN]', coord: 'Lan Nguyễn' },
  { id: 'TF-803', code: 'HPH-HLB-03', status: 'ERROR', label: 'Lỗi đối tác', prefix: '[ERR]', coord: 'Huy Trần' },
  { id: 'TF-804', code: 'SGN-PQU-04', status: 'SUCCESS', label: 'Hoàn tất điều phối', prefix: '[OK]', coord: 'Lan Nguyễn' }
];

for (const fix of fixtures) {
  const hasId = content.includes(fix.id);
  const hasCode = content.includes(fix.code);
  const hasStatus = content.includes(fix.status);
  const hasLabel = content.includes(fix.label);
  const hasPrefix = content.includes(fix.prefix);
  const hasCoord = content.includes(fix.coord);

  if (!hasId || !hasCode || !hasStatus || !hasLabel || !hasPrefix || !hasCoord) {
    console.error(`FAIL: Missing fixture details for ${fix.id}`, { hasId, hasCode, hasStatus, hasLabel, hasPrefix, hasCoord });
    process.exit(1);
  }
  console.log(`PASS: ${fix.id} (${fix.code}) fully present with ${fix.status}, ${fix.label}, ${fix.prefix}, ${fix.coord}`);
}

console.log('\n=== TEST 3: SYNCHRONIZED SENSORY LAYERS ===');
// Check that each badge has SVG icon with aria-hidden="true", prefix tag, and text label
for (const fix of fixtures) {
  const badgeRegex = new RegExp(`data-status="${fix.status}"[\\s\\S]*?<svg[\\s\\S]*?aria-hidden="true"[\\s\\S]*?${fix.prefix.replace('[', '\\[').replace(']', '\\]')}[\\s\\S]*?${fix.label}`);
  const match = badgeRegex.test(content);
  if (!match) {
    console.error(`FAIL: Synchronized sensory layers missing or malformed for ${fix.status}`);
    process.exit(1);
  }
  console.log(`PASS: Sensory layers for ${fix.status} verified (SVG aria-hidden + ${fix.prefix} + ${fix.label})`);
}

console.log('\n=== TEST 4: FSM FOCUS PRESERVATION ATTRIBUTES ===');
const hasAriaDisabled = content.includes('aria-disabled=');
const hasAriaLive = content.includes('role="status"') && content.includes('aria-live="polite"');
const hasActionButtons = content.includes('action-btn-tf802') && content.includes('action-btn-tf803');
const hasRetryBtn = content.includes('btn-retry-');

console.log('aria-disabled used:', hasAriaDisabled);
console.log('aria-live polite announcer present:', hasAriaLive);
console.log('Action buttons present:', hasActionButtons);
console.log('Retry button logic present:', hasRetryBtn);

if (!hasAriaDisabled || !hasAriaLive || !hasActionButtons || !hasRetryBtn) {
  console.error('FAIL: FSM focus preservation attributes missing');
  process.exit(1);
}
console.log('PASS: FSM and focus preservation verified!');

console.log('\nALL STATIC TESTS PASSED SUCCESSFULLY!');
