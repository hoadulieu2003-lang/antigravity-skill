/**
 * ⚡ TEST SUITE: Safe Page Assembler — Antigravity 2.0
 * ====================================================
 * Comprehensive verification for:
 *  1. Schema Normalization & Luminous Invariant Integrity
 *  2. Anti-Prototype Pollution Fuzzing & Object.prototype Protection
 *  3. Anti-XSS & Anti-HTML Injection & URL Sanitization
 *  4. Anti-CSS Injection & Delimiter Breakout Defense
 *  5. assembleToDom() Live Hydration & Virtual DOM Tree Verification
 *  6. exportToStandaloneHtml() Full Compilation & Integrity
 */

import {
  SafeDOMAssembler,
  assembleToDom,
  exportToStandaloneHtml,
  safeDeepMerge,
  sanitizeCssValue,
  escapeHtml,
  sanitizeUrl,
  deepFreeze,
  normalizeSchema,
  DEFAULT_PAGE_SCHEMA,
  DEFAULT_LUMINOUS_THEME,
} from './page_assembler.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

console.log('⚡ =========================================================');
console.log('⚡ RUNNING SAFE PAGE ASSEMBLER VERIFICATION SUITE');
console.log('⚡ =========================================================\n');

// =============================================================================
// SUITE 1: SCHEMA NORMALIZATION & IMMUTABILITY
// =============================================================================
console.log('📦 [Suite 1] Schema Normalization & Immutability:');

{
  const normalized = normalizeSchema({});
  assert(normalized.metadata.title.includes('Luminous'), 'Default title includes Luminous');
  assert(normalized.theme.canvas === '#FAF9F6', 'Default canvas is Warm Paper #FAF9F6');
  assert(normalized.theme.surface === '#FFFFFF', 'Default surface is Pure White #FFFFFF');
  assert(normalized.bentoGrid.columns === 12, 'Default Bento grid has 12 columns');
  assert(Object.isFrozen(normalized), 'Normalized schema is deep-frozen');

  // Verify immutability
  let threwOnMutation = false;
  try {
    // @ts-ignore
    normalized.metadata.title = 'Mutated Title';
  } catch {
    threwOnMutation = true;
  }
  assert(
    threwOnMutation || normalized.metadata.title !== 'Mutated Title',
    'Schema is protected against in-place mutations'
  );
}

// =============================================================================
// SUITE 2: PROTOTYPE POLLUTION FUZZING DEFENSE
// =============================================================================
console.log('\n🛡️  [Suite 2] Prototype Pollution Defense:');

{
  // Test Attack 1: Direct __proto__ payload
  const attackPayload1 = JSON.parse('{"__proto__": {"pollutedDirect": "PWNED_1"}}');
  const target1 = {};
  safeDeepMerge(target1, attackPayload1);

  assert(
    /** @type {any} */ ({}).pollutedDirect === undefined,
    'Attack 1: Object.prototype is NOT polluted via __proto__'
  );
  assert(
    /** @type {any} */ (Object.prototype).pollutedDirect === undefined,
    'Attack 1: Object.prototype does not have pollutedDirect property'
  );

  // Test Attack 2: Constructor prototype payload
  const attackPayload2 = {
    constructor: {
      prototype: {
        adminAccess: true,
      },
    },
  };
  const target2 = {};
  safeDeepMerge(target2, attackPayload2);

  assert(
    /** @type {any} */ ({}).adminAccess === undefined,
    'Attack 2: Object.prototype is NOT polluted via constructor.prototype'
  );

  // Test Attack 3: Direct prototype key
  const attackPayload3 = {
    prototype: {
      backdoor: 'ACTIVE',
    },
  };
  const target3 = {};
  safeDeepMerge(target3, attackPayload3);

  assert(
    /** @type {any} */ ({}).backdoor === undefined,
    'Attack 3: Object.prototype is NOT polluted via prototype key'
  );

  // Test Attack 4: Nested deep prototype pollution
  const deepAttack = {
    theme: {
      options: {
        __proto__: {
          nestedPollution: 'FAIL',
        },
      },
    },
  };
  const target4 = {};
  safeDeepMerge(target4, deepAttack);
  assert(
    /** @type {any} */ ({}).nestedPollution === undefined,
    'Attack 4: Nested deep __proto__ does not leak into Object.prototype'
  );

  // Cleanliness test
  assert(
    safeDeepMerge({ a: 1 }, { b: 2 }).b === 2,
    'SafeDeepMerge correctly merges legitimate non-malicious properties'
  );
}

// =============================================================================
// SUITE 3: ANTI-XSS & ANTI-HTML INJECTION SANITIZER
// =============================================================================
console.log('\n🔒 [Suite 3] Anti-XSS & Anti-HTML Injection:');

{
  // escapeHtml unit checks
  assert(
    escapeHtml("<script>alert('xss')</script>") ===
      '&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;',
    'escapeHtml encodes script tags and single quotes'
  );
  assert(
    escapeHtml('<img src=x onerror=alert(1)>') === '&lt;img src=x onerror=alert(1)&gt;',
    'escapeHtml encodes image tags with onerror'
  );
  assert(
    escapeHtml('hello "world" `test`') === 'hello &quot;world&quot; &#96;test&#96;',
    'escapeHtml encodes double quotes and backticks'
  );
  assert(escapeHtml(null) === '', 'escapeHtml handles null gracefully');
  assert(escapeHtml(undefined) === '', 'escapeHtml handles undefined gracefully');

  // sanitizeUrl unit checks
  assert(sanitizeUrl('javascript:alert(1)') === '#', 'sanitizeUrl rejects javascript: scheme');
  assert(sanitizeUrl('JAVASCRIPT:alert(2)') === '#', 'sanitizeUrl case-insensitively rejects scheme');
  assert(sanitizeUrl('vbscript:msgbox(1)') === '#', 'sanitizeUrl rejects vbscript: scheme');
  assert(
    sanitizeUrl('data:text/html;base64,PHNjcmlwdD4=') === '#',
    'sanitizeUrl rejects data:text/html scheme'
  );
  assert(
    sanitizeUrl('https://antigravity.internal/hub') === 'https://antigravity.internal/hub',
    'sanitizeUrl permits valid https:// URLs'
  );
  assert(sanitizeUrl('#architecture') === '#architecture', 'sanitizeUrl permits local hash anchors');
  assert(sanitizeUrl('/dashboard/telemetry') === '/dashboard/telemetry', 'sanitizeUrl permits relative root paths');
  assert(sanitizeUrl('./assets/logo.svg') === './assets/logo.svg', 'sanitizeUrl permits relative child paths');
}

// =============================================================================
// SUITE 4: ANTI-CSS INJECTION & DELIMITER ESCAPE DEFENSE
// =============================================================================
console.log('\n🎨 [Suite 4] Anti-CSS Injection & Delimiter Defense:');

{
  // Permitted formats
  assert(sanitizeCssValue('#FAF9F6') === '#FAF9F6', 'Permits valid 6-char hex');
  assert(sanitizeCssValue('#fff') === '#fff', 'Permits valid 3-char hex');
  assert(sanitizeCssValue('#ffffff80') === '#ffffff80', 'Permits valid 8-char hex with alpha');
  assert(
    sanitizeCssValue('rgba(0, 0, 0, 0.06)') === 'rgba(0, 0, 0, 0.06)',
    'Permits valid rgba() color'
  );
  assert(
    sanitizeCssValue('oklch(0.6 0.25 240)') === 'oklch(0.6 0.25 240)',
    'Permits modern oklch() color'
  );
  assert(sanitizeCssValue('transparent') === 'transparent', 'Permits transparent keyword');
  assert(sanitizeCssValue('1.5rem') === '1.5rem', 'Permits rem dimension');
  assert(sanitizeCssValue('24px') === '24px', 'Permits px dimension');
  assert(sanitizeCssValue('100vh') === '100vh', 'Permits vh dimension');
  assert(
    sanitizeCssValue('cubic-bezier(0.22, 1, 0.36, 1)') === 'cubic-bezier(0.22, 1, 0.36, 1)',
    'Permits cubic-bezier easing'
  );
  assert(
    sanitizeCssValue('0 4px 12px rgba(0, 0, 0, 0.05)') === '0 4px 12px rgba(0, 0, 0, 0.05)',
    'Permits valid box shadow token'
  );
  assert(
    sanitizeCssValue('inset 0 1px 0 rgba(255, 255, 255, 0.9)') ===
      'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    'Permits valid inset highlight shadow'
  );

  // Malicious injections MUST be rejected
  assert(
    sanitizeCssValue('red; background-image: url("http://evil.com/leak")', '#fff') === '#fff',
    'Rejects delimiter semicolon and url() injection'
  );
  assert(
    sanitizeCssValue('rgb(0,0,0); } body { display:none }', '#000') === '#000',
    'Rejects rule closing bracket injection'
  );
  assert(
    sanitizeCssValue('expression(alert(1))', '0px') === '0px',
    'Rejects IE expression() execution vector'
  );
  assert(
    sanitizeCssValue('-moz-binding: url("xss.xml#test")', 'none') === 'none',
    'Rejects -moz-binding XSS vector'
  );
  assert(
    sanitizeCssValue('@import url("http://evil.com/hack.css");', 'none') === 'none',
    'Rejects @import rule injection'
  );
  assert(
    sanitizeCssValue('/* comment */ red', '#fff') === '#fff',
    'Rejects CSS comment syntax'
  );
  assert(
    sanitizeCssValue('<style>body{color:red}</style>', '#fff') === '#fff',
    'Rejects HTML tag injection inside CSS'
  );
}

// =============================================================================
// SUITE 5: LIVE ASSEMBLETODOM() VIRTUAL DOM TREE VERIFICATION
// =============================================================================
console.log('\n🏗️  [Suite 5] assembleToDom() Live Assembly Verification:');

{
  const maliciousSchema = {
    metadata: {
      title: '<script>alert("xss-title")</script>',
    },
    navigation: {
      brandName: '<b onmouseover=alert("nav")>Brand</b>',
      links: [
        { label: '<img src=x onerror=alert("link")>', href: 'javascript:alert("link")' },
        { label: 'Safe Link', href: 'https://example.com' },
      ],
      ctaButton: { text: 'Pwn', link: 'javascript:void(0)' },
    },
    hero: {
      headline: '<script>alert("hero")</script>Headline',
      subheadline: '<svg onload=alert("hero-sub")>Sub',
      ctaButtons: [
        { text: 'Button', link: 'javascript:alert(1)' },
      ],
    },
    bentoGrid: {
      columns: 12,
      cellMatrix: [
        {
          id: 'card-1',
          colSpan: 6,
          title: '<script>alert("card-title")</script>',
          subtitle: '<iframe src=javascript:alert(1)>',
          statValue: '<marquee>99.9%</marquee>',
          statLabel: 'Uptime',
          spotlight: true,
          tilt: true,
        },
      ],
    },
    scrollytelling: {
      scenes: [
        {
          id: 'scene-x',
          title: 'Scene <script>alert(1)</script>',
          description: '<p onclick=alert(1)>Description</p>',
        },
      ],
    },
  };

  const instance = assembleToDom(maliciousSchema);
  assert(instance !== null && typeof instance === 'object', 'assembleToDom returns instance');
  assert(instance.container !== null, 'instance has root container');
  assert(instance.container.classList.contains('od-page-container'), 'Container has od-page-container class');

  // Verify DOM nodes were created with textContent, not unescaped HTML
  const navBrand = instance.container.querySelector('.od-brand-name');
  assert(navBrand !== null, 'Brand element exists in DOM');
  assert(
    navBrand.textContent === '<b onmouseover=alert("nav")>Brand</b>',
    'Brand element uses textContent (literal characters, NOT active tags)'
  );

  // Check URL sanitization in DOM
  const navCta = instance.container.querySelector('.od-nav-cta');
  assert(navCta !== null, 'Nav CTA element exists');
  assert(
    navCta.getAttribute('href') === '#',
    'Nav CTA javascript: link was sanitized to safe #'
  );

  const heroBtn = instance.container.querySelector('.od-hero-actions a');
  assert(heroBtn !== null, 'Hero CTA button exists');
  assert(
    heroBtn.getAttribute('href') === '#',
    'Hero CTA javascript: link was sanitized to safe #'
  );

  // Check Bento Card
  const bentoCard = instance.container.querySelector('#card-1');
  assert(bentoCard !== null, 'Bento card #card-1 was created');
  assert(bentoCard.getAttribute('data-spotlight') === 'true', 'Card has data-spotlight="true"');
  assert(bentoCard.getAttribute('data-tilt') === 'true', 'Card has data-tilt="true"');

  const cardTitle = bentoCard.querySelector('.od-card-title');
  assert(
    cardTitle.textContent === '<script>alert("card-title")</script>',
    'Card title safely populated via textContent without script execution'
  );

  // Test dynamic updateTheme
  instance.updateTheme({ canvas: '#FAF9F6', accent: { primary: '#0284c7' } });
  assert(
    instance.container.style.getPropertyValue('--od-accent') === '#0284c7',
    'updateTheme dynamically updates CSS variable --od-accent'
  );

  // Test destroy
  let destroyed = false;
  try {
    instance.destroy();
    destroyed = true;
  } catch {
    destroyed = false;
  }
  assert(destroyed, 'instance.destroy() executes cleanly');
}

// =============================================================================
// SUITE 6: EXPORTTOSTANDALONEHTML() COMPILATION & FUZZING INTEGRITY
// =============================================================================
console.log('\n📄 [Suite 6] exportToStandaloneHtml() Standalone Compilation:');

{
  const testSchema = {
    metadata: {
      title: '<script>alert("XSS_TITLE")</script>Antigravity Standalone',
      description: 'Luminous Light Theme Showcase',
    },
    theme: {
      canvas: '#FAF9F6; } body { display:none } /*', // Attack payload
      surface: '#FFFFFF',
      accent: { primary: '#2563eb' },
    },
    hero: {
      headline: '<img src=x onerror=alert("HERO_XSS")>Next-Gen Agent Architecture',
      ctaButtons: [
        { text: 'Start Node', link: 'javascript:alert("BUTTON_XSS")', primary: true },
        { text: 'Read Docs', link: 'https://antigravity.dev' },
      ],
    },
    bentoGrid: {
      columns: 12,
      gap: '1.5rem',
      cellMatrix: [
        {
          id: 'cell-speed',
          colSpan: 6,
          title: 'Throughput',
          statValue: '128K',
          statLabel: 'Tokens',
          spotlight: true,
        },
      ],
    },
  };

  const html = exportToStandaloneHtml(testSchema);

  // 1. Structure Assertions
  assert(html.startsWith('<!DOCTYPE html>'), 'Starts with <!DOCTYPE html>');
  assert(html.includes('<html lang="en">'), 'Contains <html lang="en">');
  assert(html.includes('<head>') && html.includes('</head>'), 'Contains complete <head> block');
  assert(html.includes('<body>') && html.includes('</body>'), 'Contains complete <body> block');
  assert(html.includes('<style>') && html.includes('</style>'), 'Contains embedded CSS stylesheet');
  assert(html.includes('<script>') && html.includes('</script>'), 'Contains embedded interaction script');

  // 2. Anti-XSS Verification: Ensure NO executable tags or schemes leaked into HTML
  assert(
    !html.includes('<script>alert("XSS_TITLE")</script>'),
    'Title does NOT contain executable script tag'
  );
  assert(
    html.includes('&lt;script&gt;alert(&quot;XSS_TITLE&quot;)&lt;/script&gt;'),
    'Title is properly HTML entity encoded'
  );
  assert(
    !html.includes('<img src=x onerror=alert("HERO_XSS")>'),
    'Hero headline does NOT contain executable img tag'
  );
  assert(
    html.includes('&lt;img src=x onerror=alert(&quot;HERO_XSS&quot;)&gt;'),
    'Hero headline img tag is properly HTML entity encoded'
  );
  assert(
    !html.includes('href="javascript:'),
    'No href attributes contain javascript: scheme'
  );
  assert(
    html.includes('href="#"'),
    'Malicious button URL was sanitized to href="#"'
  );

  // 3. Anti-CSS Injection Verification
  assert(
    !html.includes('display:none'),
    'CSS injection attack in theme.canvas was completely neutralized'
  );
  assert(
    html.includes('--od-canvas: #FAF9F6;'),
    'Fallback safe canvas color #FAF9F6 was applied'
  );

  // 4. Feature Assertions: WebAudio, Spotlight, Canvas
  assert(html.includes('AudioContext'), 'Standalone script contains WebAudio synthesis engine');
  assert(html.includes('data-spotlight'), 'Standalone HTML includes data-spotlight tracking hooks');
  assert(html.includes('od-hero-canvas'), 'Standalone HTML includes WebGL/Canvas hero background');
  assert(html.includes('od-bento-grid'), 'Standalone HTML includes Bento Telemetry grid layout');
  assert(html.includes('od-soundboard-section'), 'Standalone HTML includes Tactile Soundboard section');
}

// =============================================================================
// SUITE 7: ADVERSARIAL EDGE CASES & BOUNDARY CLAMPING
// =============================================================================
console.log('\n⚡ [Suite 7] Adversarial Boundary Clamping & Evasion Vectors:');

{
  // 1. URL Obfuscation Evasion
  assert(sanitizeUrl('   javascript:alert(1)  ') === '#', 'Rejects leading/trailing whitespace javascript:');
  assert(sanitizeUrl('\0javascript:alert(1)') === '#', 'Rejects null byte prefix');
  assert(sanitizeUrl('data:image/svg+xml,<svg onload=alert(1)>') === '#', 'Rejects data:image/svg+xml with onload');
  assert(sanitizeUrl('blob:https://evil.com/uuid') === '#', 'Rejects blob: URLs');
  assert(sanitizeUrl('javascript\n:alert(1)') === '#', 'Rejects newline inside protocol');
  assert(sanitizeUrl('') === '#', 'Empty URL defaults to #');
  assert(sanitizeUrl(null) === '#', 'Null URL defaults to #');
  assert(sanitizeUrl(undefined) === '#', 'Undefined URL defaults to #');

  // 2. CSS Value Fuzzing & Boundary Cases
  assert(sanitizeCssValue('#gggggg', '#000') === '#000', 'Rejects invalid hex characters');
  assert(sanitizeCssValue('#12', '#000') === '#000', 'Rejects 2-character hex');
  assert(sanitizeCssValue('rgba(255, 255)', '#000') === '#000', 'Rejects incomplete rgba()');
  assert(sanitizeCssValue('calc(100% - 20px); alert(1)', '0') === '0', 'Rejects script after calc');
  assert(sanitizeCssValue(null, 'default') === 'default', 'Null CSS value uses fallback');
  assert(sanitizeCssValue(undefined, 'default') === 'default', 'Undefined CSS value uses fallback');
  assert(sanitizeCssValue(42) === '42', 'Valid finite number returns string');
  assert(sanitizeCssValue(Infinity, '0') === '0', 'Rejects Infinity');
  assert(sanitizeCssValue(NaN, '0') === '0', 'Rejects NaN');

  // 3. Bento Grid Column Clamping
  const clampedInstance = assembleToDom({
    bentoGrid: {
      columns: 999, // Should clamp to max 24
      gap: '2rem',
      cellMatrix: [
        {
          id: 'test-cell',
          colSpan: -5, // Should clamp to min 1
          rowSpan: -2, // Should clamp to min 1
          title: 'Clamped Cell',
        },
      ],
    },
  });

  const gridEl = clampedInstance.container.querySelector('.od-bento-grid');
  assert(gridEl.style.getPropertyValue('--bento-columns') === '24', 'Columns clamped to maximum 24');

  const cellEl = clampedInstance.container.querySelector('#test-cell');
  assert(cellEl.style.getPropertyValue('--col-span') === '1', 'Negative colSpan clamped to minimum 1');
  assert(cellEl.style.getPropertyValue('--row-span') === '1', 'Negative rowSpan clamped to minimum 1');

  // 4. SafeDeepMerge with Arrays & Primitives
  const targetObj = { list: [1, 2, 3], nested: { val: 'orig' } };
  const sourceObj = { list: [4, 5], nested: { extra: 'new' } };
  safeDeepMerge(targetObj, sourceObj);
  assert(targetObj.list.length === 2 && targetObj.list[0] === 4, 'Arrays merged safely by replacement');
  assert(targetObj.nested.val === 'orig' && targetObj.nested.extra === 'new', 'Objects recursively merged');
}

console.log('\n=========================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
console.log('=========================================================\n');
