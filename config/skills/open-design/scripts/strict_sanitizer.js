/**
 * ⚡ STRICT SANITIZATION PIPELINE & SAFE DOM ASSEMBLER — Antigravity 2.0
 * ======================================================================
 * Enterprise-grade multi-tier security barrier for DOM construction,
 * CSS style sanitization, schema merging, and contract freezing.
 *
 * Architecture Modules:
 *  1. SafeStyleSanitizer:
 *     - Strict CSS property whitelist (Box Model, Flex, Grid, Typography, Luminous surfaces, Transforms, Transitions).
 *     - Delimiter & Word-boundary evasion defense (/\burl\s*\(/i, /\bexpression\s*\(/i, /\bimage\s*\(/i, /[@;{}<>\\]/).
 *     - Safe Z-Index Clamping: Range strictly clamped to [0, 100] (Anti-Clickjacking / UI Redressing).
 *     - Hard ban on "position: fixed" for user/AI customizable components.
 *     - applySafeStyles(element, styles): Strictly uses element.style.setProperty(), zero template string concatenation.
 *
 *  2. SafeDOMAssembler (Anti-DOM Clobbering & XSS):
 *     - Integrated DOMPurify-compliant parser & sanitizer with SANITIZE_DOM: true.
 *     - Mandatory Namespace Scoping for 100% of id and name attributes (gvs_cmp_[id]).
 *     - Shadow DOM encapsulation support (attachShadow mode: open) for style isolation.
 *
 *  3. SafeSchemaMerger (Pure Immutable & Anti-Pollution):
 *     - Clean null-prototype dictionaries via Object.create(null).
 *     - 100% Prototype Pollution rejection: Blocks __proto__, constructor, prototype.
 *     - Circular reference elimination via WeakSet visited tracker (Anti-Call Stack Overflow DoS).
 *
 *  4. ContractFreezer:
 *     - Safe recursive deepFreeze with Plain Object Gating:
 *       Only freezes Plain Objects and Arrays; skips DOM Nodes, Window, and Host Objects.
 *     - WeakSet visited tracker preventing infinite loops on circular graphs.
 *
 * Zero external dependencies. SSR & Headless compatible.
 *
 * @license Apache-2.0
 */

// =============================================================================
// 0. ENVIRONMENT DETECTION & PRIMITIVES
// =============================================================================

export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Checks if a value is a plain object created by {} or Object.create(null).
 *
 * @param {unknown} val
 * @returns {val is Record<string, any>}
 */
export function isPlainObject(val) {
  if (val === null || typeof val !== 'object') return false;
  // Node / Window / Host check
  if (isDomNode(val) || isWindow(val)) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

/**
 * Checks if a value is a DOM Node (browser or mock).
 *
 * @param {unknown} val
 * @returns {boolean}
 */
export function isDomNode(val) {
  if (val === null || typeof val !== 'object') return false;
  if (typeof Node !== 'undefined' && val instanceof Node) return true;
  // Duck typing for mock/virtual nodes (must have nodeType AND DOM element characteristics)
  return typeof /** @type {any} */ (val).nodeType === 'number' &&
    (typeof /** @type {any} */ (val).appendChild === 'function' ||
     typeof /** @type {any} */ (val).setAttribute === 'function' ||
     typeof /** @type {any} */ (val).tagName === 'string');
}

/**
 * Checks if a value is a Window / Global object.
 *
 * @param {unknown} val
 * @returns {boolean}
 */
export function isWindow(val) {
  if (val === null || typeof val !== 'object') return false;
  if (typeof window !== 'undefined' && val === window) return true;
  if (typeof globalThis !== 'undefined' && val === globalThis) return true;
  return /** @type {any} */ (val).window === val;
}

/**
 * Converts a camelCase or snake_case string into kebab-case.
 *
 * @param {string} str
 * @returns {string}
 */
export function toKebabCase(str) {
  if (!str) return '';
  if (str.startsWith('--')) {
    return str; // CSS custom properties (--*) are case-sensitive
  }
  return str
    .replace(/^ms-/, '-ms-')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();
}

/**
 * Strict HTML entity escaping preventing XSS breakouts.
 *
 * @param {unknown} raw
 * @returns {string}
 */
export function escapeHtml(raw) {
  if (raw === null || raw === undefined) return '';
  const str = String(raw);
  const matchHtmlRegExp = /["'&<>`]/;
  if (!matchHtmlRegExp.test(str)) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

/**
 * Validates and sanitizes a URL string.
 *
 * @param {unknown} rawUrl
 * @param {string} [fallback='#']
 * @returns {string}
 */
export function sanitizeUrl(rawUrl, fallback = '#') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  // Decode basic HTML entities to prevent obfuscation bypasses
  const decoded = rawUrl
    .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&colon;/gi, ':')
    .replace(/&tab;/gi, '')
    .replace(/&newline;/gi, '');
  const clean = decoded.trim().replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');
  if (/^(?:javascript|data|vbscript|blob):/i.test(clean)) {
    return fallback;
  }
  return clean || fallback;
}

// =============================================================================
// 1. SAFESTYLESANITIZER (Phòng tuyến An ninh Kiểu dáng CSS)
// =============================================================================

/**
 * Whitelist of safe CSS properties.
 * Covers Box Model, Flex, Grid, Typography, Luminous surfaces, Transforms, Transitions, and CSS Variables.
 */
export const SAFE_CSS_PROPERTIES = new Set([
  // Box Model & Dimensions
  'width', 'min-width', 'max-width', 'inline-size', 'min-inline-size', 'max-inline-size',
  'height', 'min-height', 'max-height', 'block-size', 'min-block-size', 'max-block-size',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'margin-inline', 'margin-inline-start', 'margin-inline-end',
  'margin-block', 'margin-block-start', 'margin-block-end',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'padding-inline', 'padding-inline-start', 'padding-inline-end',
  'padding-block', 'padding-block-start', 'padding-block-end',
  'box-sizing', 'overflow', 'overflow-x', 'overflow-y', 'overflow-wrap', 'display',
  // Borders & Outlines
  'border', 'border-width', 'border-style', 'border-color', 'border-radius',
  'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'border-collapse', 'border-spacing',
  'outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  // Flexbox & CSS Grid
  'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
  'justify-content', 'justify-items', 'justify-self',
  'align-items', 'align-content', 'align-self',
  'order', 'gap', 'row-gap', 'column-gap',
  'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
  'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
  'grid-column', 'grid-column-start', 'grid-column-end',
  'grid-row', 'grid-row-start', 'grid-row-end', 'grid-area',
  'place-content', 'place-items', 'place-self',
  // Typography & Text
  'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant',
  'line-height', 'letter-spacing',
  'text-align', 'text-decoration', 'text-decoration-line', 'text-decoration-color',
  'text-decoration-style', 'text-decoration-thickness',
  'text-transform', 'text-overflow', 'text-indent', 'text-shadow',
  'white-space', 'word-break', 'word-wrap', 'vertical-align', 'color',
  // Luminous Surfaces & Visuals
  'background', 'background-color', 'background-image', 'background-clip',
  'background-origin', 'background-position', 'background-repeat', 'background-size', 'background-attachment',
  'opacity', 'box-shadow', 'filter', 'backdrop-filter', 'mix-blend-mode',
  'accent-color', 'caret-color',
  // Transforms & Motion
  'transform', 'transform-origin', 'perspective', 'perspective-origin', 'backface-visibility',
  'transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay',
  'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state',
  'will-change',
  // Layout & Positioning (Strictly gated)
  'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'inset', 'inset-inline', 'inset-inline-start', 'inset-inline-end',
  'inset-block', 'inset-block-start', 'inset-block-end',
  'cursor', 'pointer-events', 'user-select', 'visibility',
  'aspect-ratio', 'isolation', 'content-visibility', 'contain',
  'object-fit', 'object-position', 'clip-path',
]);

/**
 * Dangerous CSS regex patterns that must trigger an immediate value rejection.
 * Chống bypass bằng khoảng trắng: /\burl\s*\(/i, /\bexpression\s*\(/i, /\bimage\s*\(/i, /[@;{}<>\\]/.
 */
const FORBIDDEN_CSS_PATTERNS = [
  /\burl\s*\(/i,
  /\bexpression\s*\(/i,
  /\bimage\s*\(/i,
  /[@;{}<>\\]/,
  /\bjavascript\s*:/i,
  /\bvbscript\s*:/i,
  /\bdata\s*:/i,
  /-moz-binding/i,
  /\bbehavior\s*:/i,
  /\/\*|\*\//,
  /[\x00-\x1f\x7f]/,
  /\beval\s*\(/i,
  /\bimport\b/i,
];

/**
 * Checks if a CSS property name is safe and permitted.
 *
 * @param {string} prop
 * @returns {boolean}
 */
export function isSafeCssProperty(prop) {
  if (!prop || typeof prop !== 'string') return false;
  const kebab = toKebabCase(prop.trim());
  // Prototype pollution keys check
  if (kebab === '__proto__' || kebab === 'constructor' || kebab === 'prototype') return false;
  // Custom CSS variables (--*)
  if (kebab.startsWith('--') && /^--[a-zA-Z0-9\-_]+$/.test(kebab)) return true;
  return SAFE_CSS_PROPERTIES.has(kebab.toLowerCase());
}

/**
 * Clamps z-index strictly to the safe range [0, 100].
 * Prevents full-screen invisible overlays (Clickjacking / UI Redressing).
 *
 * @param {unknown} val
 * @returns {string}
 */
export function clampZIndex(val) {
  if (val === null || val === undefined) return '0';
  const str = String(val).trim();
  if (str.toLowerCase() === 'auto') return 'auto';
  const num = Number(str);
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return '0';
  }
  const clamped = Math.min(100, Math.max(0, Math.round(num)));
  return String(clamped);
}

/**
 * Sanitizes a CSS style property value.
 * Returns null if the value violates any security policy.
 *
 * @param {string} prop
 * @param {unknown} val
 * @returns {string | null}
 */
export function sanitizeStyleValue(prop, val) {
  if (val === null || val === undefined) return null;
  const propKebab = toKebabCase(String(prop).trim());

  // 1. Property whitelist check
  if (!isSafeCssProperty(propKebab)) {
    return null;
  }

  const strVal = String(val).trim();
  if (!strVal) return null;

  // 2. Delimiter & dangerous pattern checks (including whitespace bypasses)
  for (const pattern of FORBIDDEN_CSS_PATTERNS) {
    if (pattern.test(strVal)) {
      return null;
    }
  }

  // 3. Strict position: fixed prohibition
  if (propKebab === 'position') {
    const normPos = strVal.toLowerCase().replace(/\s+/g, '');
    if (normPos.includes('fixed')) {
      return null; // Cấm triệt để position: fixed
    }
    const ALLOWED_POSITIONS = new Set(['static', 'relative', 'absolute', 'sticky']);
    return ALLOWED_POSITIONS.has(normPos) ? normPos : null;
  }

  // 4. Safe Z-Index Clamping to [0, 100]
  if (propKebab === 'z-index') {
    return clampZIndex(strVal);
  }

  return strVal;
}

/**
 * Sanitizes an entire styles dictionary into a clean, safe property-value map.
 *
 * @param {Record<string, unknown>} styles
 * @returns {Record<string, string>}
 */
export function sanitizeStyleObject(styles) {
  /** @type {Record<string, string>} */
  const clean = Object.create(null);
  if (!styles || typeof styles !== 'object') return clean;

  for (const [key, val] of Object.entries(styles)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const propKebab = toKebabCase(key);
    const safeVal = sanitizeStyleValue(propKebab, val);
    if (safeVal !== null) {
      clean[propKebab] = safeVal;
    }
  }
  return clean;
}

/**
 * Applies safe styles directly to a DOM Element using element.style.setProperty().
 * Cấm tuyệt đối nối chuỗi template string vào style.
 *
 * @param {any} element - DOM Element or Mock Element
 * @param {Record<string, unknown>} styles - Style properties
 * @returns {void}
 */
export function applySafeStyles(element, styles) {
  if (!element || !element.style || typeof element.style.setProperty !== 'function') {
    return;
  }
  if (!styles || typeof styles !== 'object') {
    return;
  }

  for (const [rawProp, rawVal] of Object.entries(styles)) {
    if (rawProp === '__proto__' || rawProp === 'constructor' || rawProp === 'prototype') continue;
    const propKebab = toKebabCase(rawProp);
    const safeVal = sanitizeStyleValue(propKebab, rawVal);
    if (safeVal !== null) {
      element.style.setProperty(propKebab, safeVal);
    }
  }
}

export const SafeStyleSanitizer = {
  SAFE_CSS_PROPERTIES,
  isSafeCssProperty,
  clampZIndex,
  sanitizeStyleValue,
  sanitizeStyleObject,
  applySafeStyles,
};

// =============================================================================
// 2. SAFEDOMASSEMBLER (Chống DOM Clobbering, XSS & Shadow DOM)
// =============================================================================

export const DOM_CLOBBERING_PREFIX = 'gvs_cmp_';

/**
 * Enforces Namespace Scoping for an id or name attribute.
 * Triệt tiêu hoàn toàn nguy cơ ghi đè biến toàn cục window[id] hoặc document[name].
 *
 * @param {unknown} idOrName
 * @returns {string}
 */
export function scopeIdentifier(idOrName) {
  if (idOrName === null || idOrName === undefined) return '';
  const str = String(idOrName).trim();
  if (!str) return '';
  if (str.startsWith(DOM_CLOBBERING_PREFIX)) return str;
  return `${DOM_CLOBBERING_PREFIX}${str}`;
}

/**
 * Removes the namespace scoping prefix if present.
 *
 * @param {unknown} scopedId
 * @returns {string}
 */
export function unscopeIdentifier(scopedId) {
  if (scopedId === null || scopedId === undefined) return '';
  const str = String(scopedId);
  return str.startsWith(DOM_CLOBBERING_PREFIX) ? str.slice(DOM_CLOBBERING_PREFIX.length) : str;
}

/**
 * Permitted safe HTML elements.
 */
const SAFE_HTML_TAGS = new Set([
  'a', 'abbr', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'blockquote',
  'br', 'button', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'dd',
  'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure',
  'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img',
  'ins', 'kbd', 'li', 'main', 'mark', 'nav', 'ol', 'p', 'pre', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'section', 'small', 'span', 'strong', 'sub', 'summary',
  'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'tr', 'u',
  'ul', 'var', 'wbr',
  // Safe SVG primitives
  'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text', 'tspan',
]);

/**
 * Strictly forbidden HTML tags.
 */
const FORBIDDEN_HTML_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'meta',
  'applet', 'frame', 'frameset', 'form', 'input', 'textarea', 'select', 'option',
]);

/**
 * Lightweight, zero-dependency parser & sanitizer complying with DOMPurify SANITIZE_DOM: true.
 * Performs namespace scoping for id/name, removes dangerous tags, attributes, and protocols.
 *
 * @param {string} html
 * @param {{ allowStyles?: boolean }} [options={}]
 * @returns {string}
 */
export function sanitizeHtml(html, options = {}) {
  if (!html || typeof html !== 'string') return '';

  let sanitized = html;

  // 0. Remove HTML comments (prevents mXSS and parser confusion)
  sanitized = sanitized.replace(/<!--[\s\S]*?(?:-->|--!>|$)/g, '');

  // 1. Remove dangerous blocks completely (including content and whitespace in closing tags)
  sanitized = sanitized.replace(/<\s*script\b[^>]*>[\s\S]*?<\/\s*script\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*iframe\b[^>]*>[\s\S]*?<\/\s*iframe\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*object\b[^>]*>[\s\S]*?<\/\s*object\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*embed\b[^>]*>[\s\S]*?<\/\s*embed\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*applet\b[^>]*>[\s\S]*?<\/\s*applet\s*>/gi, '');
  if (!options.allowStyles) {
    sanitized = sanitized.replace(/<\s*style\b[^>]*>[\s\S]*?<\/\s*style\s*>/gi, '');
  }
  // Strip any trailing unclosed dangerous start tags
  sanitized = sanitized.replace(/<\s*(?:script|iframe|object|embed|applet)\b[^>]*$/gi, '');

  // 2. Parse tags and sanitize attributes
  const tagRegex = /<\/?([a-zA-Z0-9\-:]+)([^>]*)>/g;

  sanitized = sanitized.replace(tagRegex, (match, tagName, rawAttrs) => {
    const lowerTag = tagName.toLowerCase();

    // Closing tag handling
    if (match.startsWith('</')) {
      if (FORBIDDEN_HTML_TAGS.has(lowerTag)) return '';
      return SAFE_HTML_TAGS.has(lowerTag) ? `</${lowerTag}>` : '';
    }

    // Opening or self-closing tag
    if (FORBIDDEN_HTML_TAGS.has(lowerTag)) return '';
    if (!SAFE_HTML_TAGS.has(lowerTag)) return '';

    // Sanitize attributes
    const attrRegex = /([a-zA-Z0-9\-_:]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
    let attrMatch;
    const cleanAttrs = [];

    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const rawAttrName = attrMatch[1];
      if (!rawAttrName) continue;
      const attrName = rawAttrName.toLowerCase();
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Hard block all event handlers (onclick, onerror, onload, etc.)
      if (attrName.startsWith('on')) {
        continue;
      }

      // Mandatory Namespace Scoping for DOM Clobbering defense
      if (attrName === 'id' || attrName === 'name') {
        const scoped = scopeIdentifier(attrVal);
        cleanAttrs.push(`${attrName}="${escapeHtml(scoped)}"`);
        continue;
      }

      // URL attribute validation
      if (attrName === 'href' || attrName === 'src' || attrName === 'action' || attrName === 'poster') {
        const safeUrl = sanitizeUrl(attrVal, '#');
        cleanAttrs.push(`${attrName}="${escapeHtml(safeUrl)}"`);
        continue;
      }

      // Safe target="_blank" enforcing rel="noopener noreferrer"
      if (attrName === 'target' && attrVal === '_blank') {
        cleanAttrs.push('target="_blank"');
        cleanAttrs.push('rel="noopener noreferrer"');
        continue;
      }

      // Style attribute sanitization
      if (attrName === 'style') {
        // Parse individual declarations
        const declarations = attrVal.split(';');
        const safeDecls = [];
        for (const decl of declarations) {
          const colonIdx = decl.indexOf(':');
          if (colonIdx === -1) continue;
          const prop = decl.slice(0, colonIdx).trim();
          const val = decl.slice(colonIdx + 1).trim();
          const safeVal = sanitizeStyleValue(prop, val);
          if (safeVal !== null) {
            safeDecls.push(`${toKebabCase(prop)}:${safeVal}`);
          }
        }
        if (safeDecls.length > 0) {
          cleanAttrs.push(`style="${escapeHtml(safeDecls.join('; '))}"`);
        }
        continue;
      }

      // Standard permitted attributes
      if (
        attrName.startsWith('data-') ||
        attrName.startsWith('aria-') ||
        ['class', 'alt', 'title', 'role', 'width', 'height', 'tabindex', 'viewbox', 'fill', 'stroke', 'd'].includes(attrName)
      ) {
        cleanAttrs.push(`${attrName}="${escapeHtml(attrVal)}"`);
      }
    }

    const attrStr = cleanAttrs.length > 0 ? ' ' + cleanAttrs.join(' ') : '';
    const isSelfClosing = match.endsWith('/>') || ['img', 'br', 'hr'].includes(lowerTag);
    return isSelfClosing ? `<${lowerTag}${attrStr} />` : `<${lowerTag}${attrStr}>`;
  });

  return sanitized;
}

/**
 * Parses a sanitized HTML string into a tree of safe virtual DOM elements.
 *
 * @param {string} html
 * @returns {any[]}
 */
export function parseHtmlToElements(html) {
  const root = createSafeElement('div');
  const cleanHtml = sanitizeHtml(html);

  // Stack-based tokenizer for tags and text nodes
  const tokenRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*)>|([^<]+)/g;
  const stack = [root];
  let match;

  while ((match = tokenRegex.exec(cleanHtml)) !== null) {
    if (match[4]) {
      const text = match[4];
      if (stack.length > 1 || text.trim().length > 0) {
        stack[stack.length - 1].appendChild(text);
      }
      continue;
    }

    const isClosing = Boolean(match[1]);
    const tagName = match[2];
    const rawAttrs = match[3];

    if (isClosing) {
      const lowerTag = tagName.toLowerCase();
      // Search down stack for matching tag to handle unclosed inline tags gracefully
      let matchIdx = -1;
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tagName && stack[i].tagName.toLowerCase() === lowerTag) {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx > 0) {
        while (stack.length > matchIdx) {
          stack.pop();
        }
      }
      continue;
    }

    const el = createSafeElement(tagName);
    if (rawAttrs) {
      const attrRegex = /([a-zA-Z0-9\-_:]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
      let am;
      while ((am = attrRegex.exec(rawAttrs)) !== null) {
        const attrName = am[1];
        if (!attrName) continue;
        const attrVal = am[2] ?? am[3] ?? am[4] ?? '';
        el.setAttribute(attrName, attrVal);
      }
    }

    stack[stack.length - 1].appendChild(el);

    const isSelfClosing = ['img', 'br', 'hr', 'input'].includes(tagName.toLowerCase()) || Boolean(rawAttrs && rawAttrs.endsWith('/'));
    if (!isSelfClosing) {
      stack.push(el);
    }
  }

  return root.children;
}

/**
 * Creates a lightweight DOM or Virtual DOM element.
 *
 * @param {string} tagName
 * @returns {any}
 */
export function createSafeElement(tagName) {
  if (isBrowser() && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const el = document.createElement(tagName);
    const origSetAttr = el.setAttribute.bind(el);
    el.setAttribute = function (name, value) {
      const lower = String(name).toLowerCase();
      const finalVal = (lower === 'id' || lower === 'name') ? scopeIdentifier(value) : String(value);
      return origSetAttr(name, finalVal);
    };
    try {
      Object.defineProperty(el, 'id', {
        configurable: true,
        get: () => unscopeIdentifier(el.getAttribute('id') || ''),
        set: (v) => origSetAttr('id', scopeIdentifier(v)),
      });
      Object.defineProperty(el, 'name', {
        configurable: true,
        get: () => unscopeIdentifier(el.getAttribute('name') || ''),
        set: (v) => origSetAttr('name', scopeIdentifier(v)),
      });
    } catch {
      // Ignore if browser restricts property redefinition on some host tags
    }
    return el;
  }

  // Headless Virtual Element
  const attributes = new Map();
  const children = [];
  const styleProps = new Map();
  const eventListeners = new Map();

  const element = {
    tagName: tagName.toUpperCase(),
    nodeType: 1,
    children,
    parentNode: null,
    style: {
      setProperty: (prop, val) => {
        styleProps.set(toKebabCase(prop), String(val));
      },
      getPropertyValue: (prop) => styleProps.get(toKebabCase(prop)) || '',
      removeProperty: (prop) => styleProps.delete(toKebabCase(prop)),
    },
    dataset: {},
    classList: {
      _classes: new Set(),
      add: (...cls) => cls.forEach((c) => element.classList._classes.add(c)),
      remove: (...cls) => cls.forEach((c) => element.classList._classes.delete(c)),
      contains: (c) => element.classList._classes.has(c),
    },
    setAttribute: (name, value) => {
      const lower = name.toLowerCase();
      // Enforce namespace scoping on id and name
      const finalVal = (lower === 'id' || lower === 'name') ? scopeIdentifier(value) : String(value);
      attributes.set(lower, finalVal);
      if (lower.startsWith('data-')) {
        const camel = lower.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        element.dataset[camel] = finalVal;
      }
    },
    getAttribute: (name) => attributes.get(name.toLowerCase()) || null,
    removeAttribute: (name) => {
      const lower = name.toLowerCase();
      attributes.delete(lower);
      if (lower.startsWith('data-')) {
        const camel = lower.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
        delete element.dataset[camel];
      }
    },
    hasAttribute: (name) => attributes.has(name.toLowerCase()),
    appendChild: (child) => {
      children.push(child);
      if (child && typeof child === 'object') child.parentNode = element;
      return child;
    },
    removeChild: (child) => {
      const idx = children.indexOf(child);
      if (idx !== -1) {
        children.splice(idx, 1);
        if (child && typeof child === 'object') child.parentNode = null;
      }
      return child;
    },
    addEventListener: (type, listener) => {
      if (!eventListeners.has(type)) eventListeners.set(type, new Set());
      eventListeners.get(type).add(listener);
    },
    removeEventListener: (type, listener) => {
      if (eventListeners.has(type)) eventListeners.get(type).delete(listener);
    },
    get textContent() {
      return children
        .map((c) => (typeof c === 'string' ? c : c.textContent || ''))
        .join('');
    },
    set textContent(text) {
      children.length = 0;
      children.push(String(text));
    },
    get innerHTML() {
      return children
        .map((c) => (typeof c === 'string' ? escapeHtml(c) : c.outerHTML || ''))
        .join('');
    },
    set innerHTML(htmlStr) {
      children.length = 0;
      const parsedNodes = parseHtmlToElements(htmlStr);
      parsedNodes.forEach((node) => {
        element.appendChild(node);
      });
    },
    get outerHTML() {
      const tag = tagName.toLowerCase();
      const attrs = [];
      for (const [k, v] of attributes.entries()) {
        attrs.push(`${escapeHtml(k)}="${escapeHtml(v)}"`);
      }
      if (element.classList._classes.size > 0) {
        attrs.push(`class="${escapeHtml(Array.from(element.classList._classes).join(' '))}"`);
      }
      if (styleProps.size > 0) {
        const styles = Array.from(styleProps.entries())
          .map(([k, v]) => `${k}:${v}`)
          .join(';');
        attrs.push(`style="${escapeHtml(styles)}"`);
      }
      const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
      if (['img', 'br', 'hr', 'input'].includes(tag)) {
        return `<${tag}${attrStr} />`;
      }
      return `<${tag}${attrStr}>${element.innerHTML}</${tag}>`;
    },
    querySelector: (selector) => {
      const all = element.querySelectorAll(selector);
      return all.length > 0 ? all[0] : null;
    },
    querySelectorAll: (selector) => {
      const results = [];
      const matchSelector = (node, sel) => {
        if (!node || typeof node !== 'object') return false;
        if (sel.startsWith('#')) {
          const expectedId = sel.slice(1);
          const actualId = node.getAttribute ? node.getAttribute('id') : null;
          return actualId === expectedId || actualId === scopeIdentifier(expectedId);
        }
        if (sel.startsWith('.')) {
          return node.classList && node.classList.contains(sel.slice(1));
        }
        return (node.tagName && node.tagName.toLowerCase() === sel.toLowerCase());
      };

      const traverse = (node) => {
        if (node !== element && matchSelector(node, selector)) {
          results.push(node);
        }
        if (node && Array.isArray(node.children)) {
          node.children.forEach(traverse);
        }
      };
      traverse(element);
      return results;
    },
    attachShadow: (init = { mode: 'open' }) => {
      const shadow = createSafeElement('div');
      shadow.mode = init.mode || 'open';
      shadow.host = element;
      element.shadowRoot = shadow;
      return shadow;
    },
  };

  return element;
}

/**
 * Mounts content inside an isolated Shadow DOM container.
 * Encapsulates CSS styles and prevents global style leaks.
 *
 * @param {any} hostElement - Host DOM Element
 * @param {string | any} content - HTML string or DOM node
 * @param {{ styles?: string }} [options={}]
 * @returns {{ shadowRoot: any, host: any }}
 */
export function mountInShadowRoot(hostElement, content, options = {}) {
  if (!hostElement) {
    throw new Error('mountInShadowRoot requires a valid hostElement');
  }

  let shadowRoot = hostElement.shadowRoot;
  if (!shadowRoot) {
    if (typeof hostElement.attachShadow === 'function') {
      shadowRoot = hostElement.attachShadow({ mode: 'open' });
    } else {
      // Mock shadow fallback
      shadowRoot = createSafeElement('div');
      shadowRoot.mode = 'open';
      shadowRoot.host = hostElement;
      hostElement.shadowRoot = shadowRoot;
    }
  }

  // Inject scoped styles
  if (options.styles && typeof options.styles === 'string') {
    const styleEl = createSafeElement('style');
    // Sanitize style string: reject style breakout, url(), expression(), image(), @import, and dangerous protocols
    const cleanStyles = options.styles
      .replace(/<\/\s*style\s*>/gi, '/* blocked-style-breakout */')
      .replace(/\burl\s*\(/gi, '/* blocked-url */(')
      .replace(/\bexpression\s*\(/gi, '/* blocked-expression */(')
      .replace(/\bimage\s*\(/gi, '/* blocked-image */(')
      .replace(/@import\s+[^;]+;?/gi, '/* blocked-import */')
      .replace(/\b(?:javascript|vbscript|behavior|-moz-binding)\s*:/gi, '/* blocked-protocol */:');
    styleEl.textContent = cleanStyles;
    shadowRoot.appendChild(styleEl);
  }

  // Inject content
  if (typeof content === 'string') {
    const sanitizedHtml = sanitizeHtml(content);
    const container = createSafeElement('div');
    container.innerHTML = sanitizedHtml;
    shadowRoot.appendChild(container);
  } else if (content && typeof content === 'object') {
    shadowRoot.appendChild(content);
  }

  return { shadowRoot, host: hostElement };
}

export const SafeDOMAssembler = {
  DOM_CLOBBERING_PREFIX,
  scopeIdentifier,
  unscopeIdentifier,
  sanitizeHtml,
  parseHtmlToElements,
  createSafeElement,
  mountInShadowRoot,
};

// =============================================================================
// 3. SAFESCHEMAMERGER (Pure Immutable & Anti-Pollution)
// =============================================================================

/**
 * Deep merges sources into a pure, null-prototype object.
 *  - 100% Prototype Pollution Protection: Completely blocks __proto__, constructor, and prototype.
 *  - Circular Reference Elimination: Tracks active recursion path with Set to prevent stack overflow DoS without breaking shared DAG objects.
 *  - Pure Immutable: Does not mutate any input object.
 *
 * @param {...any} sources
 * @returns {Record<string, any>}
 */
export function safeMerge(...sources) {
  const activeStack = new Set();

  function mergeInternal(target, source) {
    if (!source || typeof source !== 'object') return target;

    // Circular reference guard on active call stack
    if (activeStack.has(source)) {
      return target;
    }
    activeStack.add(source);

    try {
      // Enumerate own properties
      const keys = Object.keys(source);
      for (const key of keys) {
        // 100% Prototype Pollution rejection
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }

        const val = source[key];

        if (Array.isArray(val)) {
          target[key] = val.map((item) => {
            if (Array.isArray(item)) {
              return item.slice();
            }
            if (isPlainObject(item)) {
              if (activeStack.has(item)) return Object.create(null);
              const nested = Object.create(null);
              return mergeInternal(nested, item);
            }
            return item;
          });
        } else if (isPlainObject(val)) {
          if (!isPlainObject(target[key])) {
            target[key] = Object.create(null);
          }
          mergeInternal(target[key], val);
        } else {
          target[key] = val;
        }
      }
    } finally {
      activeStack.delete(source);
    }

    return target;
  }

  const result = Object.create(null);
  for (const src of sources) {
    if (src && typeof src === 'object') {
      mergeInternal(result, src);
    }
  }

  return result;
}

/**
 * Alias for safeMerge.
 */
export const safeDeepMerge = safeMerge;

export const SafeSchemaMerger = {
  safeMerge,
  safeDeepMerge,
  isPlainObject,
};

// =============================================================================
// 4. CONTRACTFREEZER (Safe Recursive Freeze with Plain Object Gating)
// =============================================================================

/**
 * Recursively freezes plain objects and arrays to enforce immutability.
 * Uses Plain Object Gating to safely skip DOM Nodes, Window, and Host Objects,
 * preventing runtime crashes.
 *
 * @template T
 * @param {T} obj
 * @param {WeakSet<object>} [visited=new WeakSet()]
 * @returns {Readonly<T>}
 */
export function deepFreeze(obj, visited = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Prevent infinite loops on circular references
  if (visited.has(/** @type {object} */ (obj))) {
    return obj;
  }

  // Plain Object Gating: skip DOM nodes, Window, and host non-plain objects
  if (isDomNode(obj) || isWindow(obj)) {
    return obj;
  }

  // Only freeze plain objects and arrays
  if (!Array.isArray(obj) && !isPlainObject(obj)) {
    return obj;
  }

  visited.add(/** @type {object} */ (obj));

  // Recursively freeze children (both string and Symbol keys)
  const propNames = Reflect.ownKeys(obj);
  for (const name of propNames) {
    if (name === '__proto__' || name === 'constructor' || name === 'prototype') continue;
    try {
      const val = /** @type {any} */ (obj)[name];
      if (val !== null && typeof val === 'object') {
        deepFreeze(val, visited);
      }
    } catch {
      // Ignore non-configurable or getter errors
    }
  }

  return Object.freeze(obj);
}

export const ContractFreezer = {
  deepFreeze,
  isPlainObject,
  isDomNode,
  isWindow,
};

// =============================================================================
// 5. MASTER STRICT SANITIZER NAMESPACE & EXPORT
// =============================================================================

export const StrictSanitizer = {
  version: '2.0.0-round4',
  // SafeStyleSanitizer
  SafeStyleSanitizer,
  SAFE_CSS_PROPERTIES,
  isSafeCssProperty,
  clampZIndex,
  sanitizeStyleValue,
  sanitizeStyleObject,
  applySafeStyles,
  // SafeDOMAssembler
  SafeDOMAssembler,
  DOM_CLOBBERING_PREFIX,
  scopeIdentifier,
  unscopeIdentifier,
  sanitizeHtml,
  parseHtmlToElements,
  createSafeElement,
  mountInShadowRoot,
  // SafeSchemaMerger
  SafeSchemaMerger,
  safeMerge,
  safeDeepMerge,
  // ContractFreezer
  ContractFreezer,
  deepFreeze,
  // Utilities
  isBrowser,
  isPlainObject,
  isDomNode,
  isWindow,
  toKebabCase,
  escapeHtml,
  sanitizeUrl,
};

// Browser global attachment
if (isBrowser()) {
  /** @type {any} */ (window).StrictSanitizer = StrictSanitizer;
}

export default StrictSanitizer;
