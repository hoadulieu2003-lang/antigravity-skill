/**
 * ⚡ TEST SUITE: StrictSanitizationPipeline & Safe DOM Assembler — Antigravity 2.0
 * ==============================================================================
 * Comprehensive security verification verifying:
 *  1. SafeStyleSanitizer: Whitelist, Evasion Vectors, Z-Index Clamping, Position Fixed Hard-Ban
 *  2. applySafeStyles: element.style.setProperty enforcement, Zero cssText/template-strings
 *  3. SafeDOMAssembler: DOM Clobbering Defense via 100% gvs_cmp_ scoping, Anti-XSS Sanitizer
 *  4. Shadow DOM Isolation: open-mode encapsulation & scoped style injection
 *  5. SafeSchemaMerger: Pure Object.create(null), Anti-Prototype Pollution & Circular Ref WeakSet
 *  6. ContractFreezer: Plain Object Gating (skips DOM nodes, Window, Host objects) & Circular Ref Defense
 */

import {
  StrictSanitizer,
  SafeStyleSanitizer,
  SafeDOMAssembler,
  SafeSchemaMerger,
  ContractFreezer,
  SAFE_CSS_PROPERTIES,
  isSafeCssProperty,
  clampZIndex,
  sanitizeStyleValue,
  sanitizeStyleObject,
  applySafeStyles,
  scopeIdentifier,
  unscopeIdentifier,
  sanitizeHtml,
  createSafeElement,
  mountInShadowRoot,
  safeMerge,
  safeDeepMerge,
  deepFreeze,
  isPlainObject,
  isDomNode,
  isWindow,
  escapeHtml,
  sanitizeUrl,
} from './strict_sanitizer.js';

let totalTests = 0;
let passedTests = 0;

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
console.log('⚡ RUNNING STRICT SANITIZER SECURITY BARRIER TEST SUITE');
console.log('⚡ =========================================================\n');

// =============================================================================
// SUITE 1: SAFESTYLESANITIZER — PROPERTY WHITELIST & NORMALIZATION
// =============================================================================
console.log('🎨 [Suite 1] SafeStyleSanitizer — Whitelist & Normalization:');

{
  // Whitelisted Box Model
  assert(isSafeCssProperty('width'), 'Allows width');
  assert(isSafeCssProperty('maxWidth'), 'Allows camelCase maxWidth');
  assert(isSafeCssProperty('max-width'), 'Allows kebab-case max-width');
  assert(isSafeCssProperty('padding-inline-start'), 'Allows modern logical padding');
  assert(isSafeCssProperty('box-sizing'), 'Allows box-sizing');

  // Whitelisted Flex & Grid
  assert(isSafeCssProperty('display'), 'Allows display');
  assert(isSafeCssProperty('flexDirection'), 'Allows camelCase flexDirection');
  assert(isSafeCssProperty('grid-template-columns'), 'Allows grid-template-columns');
  assert(isSafeCssProperty('gap'), 'Allows gap');

  // Whitelisted Typography & Colors
  assert(isSafeCssProperty('font-family'), 'Allows font-family');
  assert(isSafeCssProperty('fontSize'), 'Allows fontSize');
  assert(isSafeCssProperty('color'), 'Allows color');
  assert(isSafeCssProperty('line-height'), 'Allows line-height');

  // Whitelisted Luminous Surfaces & Motion
  assert(isSafeCssProperty('background-color'), 'Allows background-color');
  assert(isSafeCssProperty('backdrop-filter'), 'Allows backdrop-filter');
  assert(isSafeCssProperty('box-shadow'), 'Allows box-shadow');
  assert(isSafeCssProperty('transform'), 'Allows transform');
  assert(isSafeCssProperty('transition'), 'Allows transition');

  // Whitelisted CSS Variables
  assert(isSafeCssProperty('--od-accent'), 'Allows CSS custom property --od-accent');
  assert(isSafeCssProperty('--od-canvas-surface'), 'Allows CSS custom property --od-canvas-surface');
  assert(isSafeCssProperty('--brandAccentColor'), 'Allows mixed-case CSS custom property --brandAccentColor');

  // Modern Layout & Responsive Properties
  assert(isSafeCssProperty('object-fit'), 'Allows object-fit for media');
  assert(isSafeCssProperty('object-position'), 'Allows object-position for media');
  assert(isSafeCssProperty('clip-path'), 'Allows clip-path for shapes');
  assert(isSafeCssProperty('inset'), 'Allows inset shorthand');

  // Strictly Blocked Dangerous Properties
  assert(!isSafeCssProperty('behavior'), 'Rejects IE behavior');
  assert(!isSafeCssProperty('-moz-binding'), 'Rejects Firefox -moz-binding');
  assert(!isSafeCssProperty('javascript'), 'Rejects fake javascript property');
  assert(!isSafeCssProperty('xss-payload'), 'Rejects arbitrary non-whitelisted properties');
  assert(!isSafeCssProperty('__proto__'), 'Rejects __proto__ as property');
  assert(!isSafeCssProperty('constructor'), 'Rejects constructor as property');
  assert(!isSafeCssProperty('prototype'), 'Rejects prototype as property');
}

// =============================================================================
// SUITE 2: SAFESTYLESANITIZER — WHITESPACE EVASIONS & FORBIDDEN PATTERNS
// =============================================================================
console.log('\n🛡️  [Suite 2] SafeStyleSanitizer — Delimiter & Whitespace Evasions:');

{
  // Valid safe values
  assert(sanitizeStyleValue('color', '#FAF9F6') === '#FAF9F6', 'Accepts valid hex color');
  assert(sanitizeStyleValue('background-color', 'rgba(255, 255, 255, 0.95)') === 'rgba(255, 255, 255, 0.95)', 'Accepts valid rgba color');
  assert(sanitizeStyleValue('transform', 'translateY(-2px) scale(0.98)') === 'translateY(-2px) scale(0.98)', 'Accepts safe transform');

  // URL bypasses with arbitrary whitespace
  assert(sanitizeStyleValue('background', 'url("https://evil.com/x.png")') === null, 'Rejects standard url()');
  assert(sanitizeStyleValue('background', 'url  ("https://evil.com/x.png")') === null, 'Rejects url  () with spaces');
  assert(sanitizeStyleValue('background', "url \t ('https://evil.com/x.png')") === null, 'Rejects url with tab spacing');
  assert(sanitizeStyleValue('background', "url\n('https://evil.com/x.png')") === null, 'Rejects url with newline spacing');
  assert(sanitizeStyleValue('background', "URL\r\n( 'https://evil.com' )") === null, 'Rejects uppercase URL with CRLF');

  // Expression bypasses with whitespace
  assert(sanitizeStyleValue('width', 'expression(alert(1))') === null, 'Rejects standard expression()');
  assert(sanitizeStyleValue('width', 'expression  (document.cookie)') === null, 'Rejects expression  () with spaces');
  assert(sanitizeStyleValue('width', "expression\t(alert('XSS'))") === null, 'Rejects expression with tab spacing');

  // Image function bypasses with whitespace
  assert(sanitizeStyleValue('background-image', 'image("test.png")') === null, 'Rejects standard image()');
  assert(sanitizeStyleValue('background-image', 'image   ("test.png")') === null, 'Rejects image   () with spaces');

  // Delimiter and breakout characters [@;{}<>\\]
  assert(sanitizeStyleValue('color', 'red; display: none') === null, 'Rejects semicolon delimiter injection');
  assert(sanitizeStyleValue('color', 'red } body { background: black') === null, 'Rejects closing bracket } breakout');
  assert(sanitizeStyleValue('color', 'red { color: blue') === null, 'Rejects opening bracket { injection');
  assert(sanitizeStyleValue('color', 'red <script>alert(1)</script>') === null, 'Rejects HTML tags < and >');
  assert(sanitizeStyleValue('color', '@import "evil.css"') === null, 'Rejects @ rule injection');
  assert(sanitizeStyleValue('color', 'red\\61') === null, 'Rejects backslash escape injection');

  // Protocol and script injections
  assert(sanitizeStyleValue('background', 'javascript:alert(1)') === null, 'Rejects javascript: protocol');
  assert(sanitizeStyleValue('background', 'vbscript:msgbox(1)') === null, 'Rejects vbscript: protocol');
  assert(sanitizeStyleValue('background', 'data:text/html,<script>alert(1)</script>') === null, 'Rejects data: protocol');
  assert(sanitizeStyleValue('background', '/* comment */ #fff') === null, 'Rejects CSS comments');
}

// =============================================================================
// SUITE 3: Z-INDEX CLAMPING & POSITION: FIXED PROHIBITION
// =============================================================================
console.log('\n🔒 [Suite 3] Z-Index Clamping & Position: Fixed Hard-Ban:');

{
  // Z-Index Clamping to [0, 100]
  assert(clampZIndex('999999') === '100', 'Clamps 999999 down to 100');
  assert(clampZIndex(999999) === '100', 'Clamps numeric 999999 down to 100');
  assert(clampZIndex('2147483647') === '100', 'Clamps max int32 to 100');
  assert(clampZIndex('-50') === '0', 'Clamps negative -50 up to 0');
  assert(clampZIndex(-1) === '0', 'Clamps numeric -1 up to 0');
  assert(clampZIndex('50') === '50', 'Preserves valid in-range 50');
  assert(clampZIndex(0) === '0', 'Preserves 0');
  assert(clampZIndex(100) === '100', 'Preserves 100');
  assert(clampZIndex('auto') === 'auto', 'Preserves auto keyword');
  assert(clampZIndex('AUTO') === 'auto', 'Preserves uppercase AUTO keyword');
  assert(clampZIndex('  Auto  ') === 'auto', 'Preserves mixed-case Auto with whitespace');
  assert(clampZIndex('invalid_nan') === '0', 'Converts NaN to 0');
  assert(clampZIndex(null) === '0', 'Converts null to 0');

  // Verify through sanitizeStyleValue
  assert(sanitizeStyleValue('z-index', '999999') === '100', 'sanitizeStyleValue clamps z-index 999999 to 100');
  assert(sanitizeStyleValue('z-index', '-10') === '0', 'sanitizeStyleValue clamps z-index -10 to 0');
  assert(sanitizeStyleValue('zIndex', '75') === '75', 'sanitizeStyleValue clamps zIndex in-range');

  // Position: fixed Hard-Ban
  assert(sanitizeStyleValue('position', 'fixed') === null, 'Hard-rejects position: fixed');
  assert(sanitizeStyleValue('position', 'FIXED') === null, 'Hard-rejects position: FIXED case-insensitively');
  assert(sanitizeStyleValue('position', '  fixed  ') === null, 'Hard-rejects position: fixed with whitespace');
  assert(sanitizeStyleValue('position', 'fixed !important') === null, 'Hard-rejects position: fixed !important');

  // Allowed positions
  assert(sanitizeStyleValue('position', 'relative') === 'relative', 'Permits position: relative');
  assert(sanitizeStyleValue('position', 'absolute') === 'absolute', 'Permits position: absolute');
  assert(sanitizeStyleValue('position', 'sticky') === 'sticky', 'Permits position: sticky');
  assert(sanitizeStyleValue('position', 'static') === 'static', 'Permits position: static');
}

// =============================================================================
// SUITE 4: APPLYSAFESTYLES & ZERO TEMPLATE STRING ENFORCEMENT
// =============================================================================
console.log('\n⚙️  [Suite 4] applySafeStyles — setProperty & Zero Template Concatenation:');

{
  const mockCalls = [];
  const mockElement = {
    style: {
      setProperty: (prop, val) => {
        mockCalls.push({ prop, val });
      },
      // Intentionally verify cssText is never touched
      cssText: '',
    },
  };

  const maliciousStyles = {
    backgroundColor: '#FAF9F6',
    color: 'red; display: none', // Injection vector
    zIndex: 999999,              // Over-range vector
    position: 'fixed',           // Prohibited vector
    backgroundImage: 'url  ("https://evil.com/x.png")', // Whitespace evasion vector
    transform: 'translateY(10px)',
    '--od-accent': '#2563eb',
    __proto__: { backdoor: true }, // Prototype pollution attempt
  };

  applySafeStyles(mockElement, maliciousStyles);

  // Assert only safe properties reached setProperty
  const appliedProps = mockCalls.map((c) => c.prop);
  assert(appliedProps.includes('background-color'), 'Applied safe background-color');
  assert(appliedProps.includes('transform'), 'Applied safe transform');
  assert(appliedProps.includes('--od-accent'), 'Applied safe CSS variable');
  assert(appliedProps.includes('z-index'), 'Applied clamped z-index');

  const zIndexCall = mockCalls.find((c) => c.prop === 'z-index');
  assert(zIndexCall && zIndexCall.val === '100', 'z-index was clamped to 100 via setProperty');

  assert(!appliedProps.includes('position'), 'position: fixed was strictly rejected');
  assert(!appliedProps.includes('color'), 'Delimiter injection was strictly rejected');
  assert(!appliedProps.includes('background-image'), 'Whitespace url() evasion was strictly rejected');
  assert(!appliedProps.includes('__proto__'), '__proto__ was strictly filtered');

  // Verify cssText remains untouched (zero template string concatenation)
  assert(mockElement.style.cssText === '', 'element.style.cssText was NEVER touched or concatenated');
}

// =============================================================================
// SUITE 5: SAFEDOMASSEMBLER — DOM CLOBBERING & NAMESPACE SCOPING
// =============================================================================
console.log('\n🏛️  [Suite 5] SafeDOMAssembler — DOM Clobbering & Namespace Scoping:');

{
  // Unit tests for scopeIdentifier
  assert(scopeIdentifier('window') === 'gvs_cmp_window', 'Scopes "window" to "gvs_cmp_window"');
  assert(scopeIdentifier('document') === 'gvs_cmp_document', 'Scopes "document" to "gvs_cmp_document"');
  assert(scopeIdentifier('location') === 'gvs_cmp_location', 'Scopes "location" to "gvs_cmp_location"');
  assert(scopeIdentifier('gvs_cmp_test') === 'gvs_cmp_test', 'Does not double-prefix already scoped ID');
  assert(unscopeIdentifier('gvs_cmp_card-1') === 'card-1', 'unscopeIdentifier cleanly recovers original ID');

  // HTML sanitization with DOM Clobbering attack payload
  const clobberingHtml = `
    <div id="window" name="document">
      <form id="body" name="location">
        <a id="cookie" name="defaultView" href="https://example.com">Legit</a>
      </form>
      <input id="top" name="parent" />
    </div>
  `;

  const sanitized = sanitizeHtml(clobberingHtml);

  // Verify IDs and names are 100% scoped
  assert(sanitized.includes('id="gvs_cmp_window"'), 'id="window" rewritten to "gvs_cmp_window"');
  assert(sanitized.includes('name="gvs_cmp_document"'), 'name="document" rewritten to "gvs_cmp_document"');
  assert(sanitized.includes('id="gvs_cmp_cookie"'), 'id="cookie" rewritten to "gvs_cmp_cookie"');
  assert(sanitized.includes('name="gvs_cmp_defaultView"'), 'name="defaultView" rewritten to "gvs_cmp_defaultView"');

  // Verify naked clobbering attributes no longer exist
  assert(!sanitized.includes('id="window"'), 'Unprefixed id="window" completely neutralized');
  assert(!sanitized.includes('name="document"'), 'Unprefixed name="document" completely neutralized');
  assert(!sanitized.includes('name="location"'), 'Unprefixed name="location" completely neutralized');

  // Verify form and input tags (forbidden) were stripped
  assert(!sanitized.includes('<form'), 'Form tags stripped');
  assert(!sanitized.includes('<input'), 'Input tags stripped');

  // Verify createSafeElement dynamically scopes id and name
  const dynEl = createSafeElement('div');
  dynEl.setAttribute('id', 'window');
  dynEl.setAttribute('name', 'document');
  assert(dynEl.getAttribute('id') === 'gvs_cmp_window', 'createSafeElement dynamically scopes id="window"');
  assert(dynEl.getAttribute('name') === 'gvs_cmp_document', 'createSafeElement dynamically scopes name="document"');

  // Verify resilient stack unwinding with unclosed/mismatched inline tags
  const malformedHtml = '<div><p>Hello <b>World</p> Tail</div><span>After</span>';
  const parsedNodes = StrictSanitizer.parseHtmlToElements(malformedHtml);
  assert(parsedNodes.length === 2, 'parseHtmlToElements recovers from unclosed inline tag and produces 2 root elements');
  assert(parsedNodes[0].tagName === 'DIV', 'First element is DIV');
  assert(parsedNodes[1].tagName === 'SPAN', 'Second element is independent SPAN sibling');
}

// =============================================================================
// SUITE 6: SAFEDOMASSEMBLER — ANTI-XSS & ATTRIBUTE SANITIZATION
// =============================================================================
console.log('\n🔒 [Suite 6] SafeDOMAssembler — Anti-XSS & Dangerous Protocol Elimination:');

{
  const xssPayload = `
    <script>alert("XSS_PWNED")</script>
    <img src="valid.png" onerror="alert('IMAGE_XSS')" alt="Picture" />
    <a href="javascript:alert('LINK_XSS')" target="_blank">Click Me</a>
    <iframe src="https://evil.com/phishing"></iframe>
    <object data="exploit.swf"></object>
    <embed src="exploit.swf" />
    <span onclick="alert('CLICK_XSS')" onmouseover="alert('HOVER_XSS')">Hover Me</span>
  `;

  const clean = sanitizeHtml(xssPayload);

  // Tag stripping
  assert(!clean.includes('<script'), 'Script tag completely eliminated');
  assert(!clean.includes('alert("XSS_PWNED")'), 'Script body eliminated');
  assert(!clean.includes('<iframe'), 'Iframe tag completely eliminated');
  assert(!clean.includes('<object'), 'Object tag completely eliminated');
  assert(!clean.includes('<embed'), 'Embed tag completely eliminated');

  // Event handler stripping
  assert(!clean.includes('onerror'), 'onerror attribute eliminated');
  assert(!clean.includes('onclick'), 'onclick attribute eliminated');
  assert(!clean.includes('onmouseover'), 'onmouseover attribute eliminated');

  // URL protocol sanitization
  assert(!clean.includes('javascript:'), 'javascript: protocol in href eliminated');
  assert(clean.includes('href="#"'), 'Dangerous href sanitized to safe #');
  assert(clean.includes('rel="noopener noreferrer"'), 'target="_blank" reinforced with noopener noreferrer');

  // Safe tags preserved
  assert(clean.includes('<img'), 'Safe img tag preserved');
  assert(clean.includes('<span'), 'Safe span tag preserved');
  assert(clean.includes('Hover Me'), 'Text content preserved');

  // Advanced evasions: Whitespace in closing tags
  const whitespaceScript1 = '<script>alert("TRAIL_SPACE")</script >';
  assert(!sanitizeHtml(whitespaceScript1).includes('TRAIL_SPACE'), 'Eliminates script with space in closing tag </script >');

  const whitespaceScript2 = '<script\ntype="text/javascript"\n>alert("NEWLINE_EVASION")\n</SCRIPT   \n>';
  assert(!sanitizeHtml(whitespaceScript2).includes('NEWLINE_EVASION'), 'Eliminates uppercase script with newlines and spaces in closing tag');

  // Advanced evasions: Unclosed dangerous tags
  const unclosedScript = '<script src="evil.js">TrailingContent';
  assert(!sanitizeHtml(unclosedScript).includes('<script'), 'Neutralizes unclosed script tag');

  // Advanced evasions: HTML Comments hiding payloads
  const commentPayload = '<div><!-- <script>alert("COMMENT_XSS")</script> -->SafeText</div>';
  const cleanComment = sanitizeHtml(commentPayload);
  assert(!cleanComment.includes('COMMENT_XSS'), 'Strips HTML comments containing script payload');
  assert(cleanComment.includes('SafeText'), 'Preserves legitimate text outside comments');

  // URL Entity Decoded protocol check
  assert(sanitizeUrl('&#x6a;&#x61;vascript:alert(1)') === '#', 'Rejects hex-entity-encoded javascript: URL');
  assert(sanitizeUrl('&#106;&#97;vascript:alert(1)') === '#', 'Rejects decimal-entity-encoded javascript: URL');
}

// =============================================================================
// SUITE 7: SHADOW DOM ENCAPSULATION & STYLE ISOLATION
// =============================================================================
console.log('\n📦 [Suite 7] Shadow DOM Encapsulation & Style Isolation:');

{
  const host = createSafeElement('div');
  const content = '<h2 id="scoped-heading">Isolated Shadow Header</h2><p>Safe Body</p>';
  const styles = `
    :host { display: block; background: #FAF9F6; }
    h2 { color: #0284c7; }
    @import "evil.css";
    body { background: url('https://evil.com/bg.png'); }
  `;

  const result = mountInShadowRoot(host, content, { styles });

  assert(result !== null && typeof result === 'object', 'mountInShadowRoot returned result object');
  assert(result.shadowRoot !== null, 'Shadow root exists');
  assert(result.shadowRoot.mode === 'open', 'Shadow root initialized with mode: "open"');
  assert(result.host === host, 'Host element bound to shadow root');

  // Verify scoped ID inside shadow DOM
  const heading = result.shadowRoot.querySelector('#scoped-heading');
  assert(heading !== null, 'Scoped element found within shadow root');
  assert(heading.getAttribute('id') === 'gvs_cmp_scoped-heading', 'Shadow DOM element ID was safely namespace scoped');

  // Verify style sanitization within shadow root
  const styleEl = result.shadowRoot.querySelector('style');
  assert(styleEl !== null, 'Shadow root contains isolated style element');
  assert(!styleEl.textContent.includes('@import'), 'Dangerous @import rule blocked in shadow styles');
  assert(!styleEl.textContent.includes("url('https://evil.com/bg.png')"), 'Dangerous url() blocked in shadow styles');
}

// =============================================================================
// SUITE 8: SAFESCHEMAMERGER — PROTOTYPE POLLUTION DEFENSE
// =============================================================================
console.log('\n🛡️  [Suite 8] SafeSchemaMerger — Pure Object.create(null) & Anti-Pollution:');

{
  // Test 1: Null prototype verification
  const mergedEmpty = safeMerge({});
  assert(Object.getPrototypeOf(mergedEmpty) === null, 'Result has null prototype Object.create(null)');

  // Test 2: Attack 1 - Direct __proto__
  const attackPayload1 = JSON.parse('{"__proto__": {"pollutedDirect": "FAIL"}}');
  const target1 = Object.create(null);
  safeMerge(target1, attackPayload1);

  assert(
    /** @type {any} */ ({}).pollutedDirect === undefined,
    'Attack 1: Object.prototype is NOT polluted via direct __proto__'
  );

  // Test 3: Attack 2 - constructor.prototype
  const attackPayload2 = {
    constructor: {
      prototype: {
        adminAccess: true,
      },
    },
  };
  const target2 = Object.create(null);
  safeMerge(target2, attackPayload2);

  assert(
    /** @type {any} */ ({}).adminAccess === undefined,
    'Attack 2: Object.prototype is NOT polluted via constructor.prototype'
  );

  // Test 4: Attack 3 - Direct prototype key
  const attackPayload3 = {
    prototype: {
      backdoor: 'ACTIVE',
    },
  };
  const target3 = Object.create(null);
  safeMerge(target3, attackPayload3);

  assert(
    /** @type {any} */ ({}).backdoor === undefined,
    'Attack 3: Object.prototype is NOT polluted via direct prototype key'
  );

  // Test 5: Attack 4 - Deeply nested prototype attack
  const attackPayload4 = {
    theme: {
      surface: {
        __proto__: {
          pwned: 'YES',
        },
      },
    },
  };
  safeMerge({}, attackPayload4);

  assert(
    /** @type {any} */ ({}).pwned === undefined,
    'Attack 4: Object.prototype is NOT polluted via nested __proto__'
  );

  // Legitimate properties merge cleanly
  const sourceA = { title: 'Antigravity', theme: { canvas: '#FAF9F6' } };
  const sourceB = { version: '2.0.0', theme: { surface: '#FFFFFF' } };
  const combined = safeMerge(sourceA, sourceB);

  assert(combined.title === 'Antigravity', 'Merges legitimate property title');
  assert(combined.version === '2.0.0', 'Merges legitimate property version');
  assert(combined.theme.canvas === '#FAF9F6', 'Deep merges nested canvas');
  assert(combined.theme.surface === '#FFFFFF', 'Deep merges nested surface');

  // Pure immutability: sources are not mutated
  assert(sourceA.theme.surface === undefined, 'Source A was not mutated during merge');

  // DAG Shared Object test (reused references in non-circular graphs must NOT be truncated)
  const sharedSettings = { theme: 'luminous', radius: 8 };
  const dagSource = { cardA: sharedSettings, cardB: sharedSettings };
  const dagMerged = safeMerge(dagSource);
  assert(dagMerged.cardA.theme === 'luminous', 'DAG cardA retains shared theme property');
  assert(dagMerged.cardB.theme === 'luminous', 'DAG cardB retains shared theme property (not truncated to empty)');
  assert(dagMerged.cardB.radius === 8, 'DAG cardB retains shared radius property');
}

// =============================================================================
// SUITE 9: SAFESCHEMAMERGER — CIRCULAR REFERENCE WEAKSET DEFENSE
// =============================================================================
console.log('\n🔄 [Suite 9] SafeSchemaMerger — Circular Reference & Anti-DoS:');

{
  const circularSource = {
    name: 'Root Node',
    metadata: {
      tag: 'CircularTest',
    },
  };
  // Establish self-referential cycle
  /** @type {any} */ (circularSource).self = circularSource;
  /** @type {any} */ (circularSource.metadata).parent = circularSource;

  let mergeThrew = false;
  let mergedResult = null;

  try {
    mergedResult = safeMerge({}, circularSource);
  } catch (err) {
    mergeThrew = true;
    console.error(err);
  }

  assert(!mergeThrew, 'safeMerge survives self-referential circular structure without Call Stack Overflow');
  assert(mergedResult !== null, 'safeMerge produced a valid merged dictionary');
  assert(mergedResult.name === 'Root Node', 'Extracted valid top-level property before circular link');
  assert(mergedResult.metadata.tag === 'CircularTest', 'Extracted valid nested property');
}

// =============================================================================
// SUITE 10: CONTRACTFREEZER — PLAIN OBJECT GATING & CIRCULAR RESILIENCE
// =============================================================================
console.log('\n🧊 [Suite 10] ContractFreezer — Plain Object Gating & Non-Crash Guarantees:');

{
  // 1. Plain Object Freezing
  const config = {
    theme: {
      canvas: '#FAF9F6',
      elevated: ['#FFFFFF', '#FDFBF7'],
    },
  };
  const frozenConfig = deepFreeze(config);
  assert(Object.isFrozen(frozenConfig), 'Top-level plain object is frozen');
  assert(Object.isFrozen(frozenConfig.theme), 'Nested plain object is frozen');
  assert(Object.isFrozen(frozenConfig.theme.elevated), 'Nested array is frozen');

  let mutated = false;
  try {
    /** @type {any} */ (frozenConfig).theme.canvas = '#000000';
  } catch {
    mutated = true; // Throws in strict mode
  }
  assert(mutated || frozenConfig.theme.canvas === '#FAF9F6', 'Frozen plain object prevents mutation');

  // 2. DOM Node Gating (Must NOT freeze DOM nodes, preventing browser runtime crash)
  const mockDomNode = createSafeElement('div');
  mockDomNode.setAttribute('id', 'gvs_cmp_test');
  const containerWithNode = {
    node: mockDomNode,
    title: 'Container',
  };

  let threwOnNode = false;
  try {
    deepFreeze(containerWithNode);
  } catch {
    threwOnNode = true;
  }
  assert(!threwOnNode, 'deepFreeze executes cleanly with DOM Node present');
  assert(!Object.isFrozen(mockDomNode), 'DOM Node was safely gated and NOT frozen');
  assert(Object.isFrozen(containerWithNode), 'Parent container was still successfully frozen');

  // 3. Window / Global Gating (Must NOT freeze globalThis/Window)
  const containerWithWindow = {
    win: globalThis,
    name: 'WindowContainer',
  };
  let threwOnWindow = false;
  try {
    deepFreeze(containerWithWindow);
  } catch {
    threwOnWindow = true;
  }
  assert(!threwOnWindow, 'deepFreeze executes cleanly with Window/globalThis present');
  assert(!Object.isFrozen(globalThis), 'globalThis was safely gated and NOT frozen');

  // 4. Circular Object Gating in deepFreeze
  const circularToFreeze = {
    id: 1,
    children: [],
  };
  /** @type {any} */ (circularToFreeze).loop = circularToFreeze;

  let threwOnCircularFreeze = false;
  try {
    deepFreeze(circularToFreeze);
  } catch {
    threwOnCircularFreeze = true;
  }
  assert(!threwOnCircularFreeze, 'deepFreeze handles circular plain object without stack overflow');
  assert(Object.isFrozen(circularToFreeze), 'Circular object was successfully frozen');

  // 5. Symbol Property Gating & Freezing
  const symKey = Symbol('contractMetadata');
  const objWithSymbol = {
    [symKey]: {
      immutableFlag: true,
    },
  };
  deepFreeze(objWithSymbol);
  assert(Object.isFrozen(objWithSymbol), 'Object with Symbol property is frozen');
  assert(Object.isFrozen(objWithSymbol[symKey]), 'Symbol-keyed child object is frozen');
}

// =============================================================================
// FINAL REPORT
// =============================================================================
console.log('\n=========================================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
console.log('=========================================================\n');
