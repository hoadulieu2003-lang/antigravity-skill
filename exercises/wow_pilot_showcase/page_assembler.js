/**
 * ⚡ SAFE PAGE ASSEMBLER (Universal UMD / Standalone Global Bundle)
 * Antigravity 2.0 AST Schema-Driven Safe Page Assembler & Standalone Compiler
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exp = factory();
    Object.assign(global, exp);
    global.SafeDOMAssembler = exp.SafeDOMAssembler;
    global.assembleToDom = exp.assembleToDom;
    global.exportToStandaloneHtml = exp.exportToStandaloneHtml;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

/**
 * ⚡ SAFE PAGE ASSEMBLER — Antigravity 2.0 Open-Design
 * ====================================================
 * AST Schema-Driven Safe Page Assembler & Standalone Compiler
 * for Luminous Light Theme Pages, Bento Grids, 3D Hero Shaders,
 * Scrollytelling Stages, and Tactile Soundboards.
 *
 * Core Pillars:
 *  1. Anti-XSS & Safe DOM Assembly: Zero raw innerHTML on untrusted data;
 *     strict HTML entity escaping and URL protocol sanitization.
 *  2. Anti-Prototype Pollution: safeDeepMerge() rejects __proto__, constructor,
 *     and prototype keys; deep-freezes normalized configs.
 *  3. Anti-CSS Injection: sanitizeCssValue() strictly validates colors (hex,
 *     rgb, rgba, hsl, oklch), dimensions, shadows, and curves, rejecting malicious
 *     delimiters, url(), expression(), and behavior properties.
 *  4. Dual Compilation Modes: assembleToDom() for dynamic browser hydration;
 *     exportToStandaloneHtml() for zero-dependency standalone HTML5 production.
 *
 * @license Apache-2.0
 */

// =============================================================================
// 0. ENVIRONMENT & UTILITIES (Môi trường & Tiện ích)
// =============================================================================

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Strict HTML entity escaper preventing XSS breakouts.
 * Encodes &, <, >, ", ', and ` into character references.
 *
 * @param {unknown} raw
 * @returns {string}
 */
function escapeHtml(raw) {
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
 * Safe URL protocol validator preventing javascript:, data:, vbscript: injection.
 * Only allows safe relative paths (#, /, ./, ../) and safe schemes (http, https, mailto, tel).
 *
 * @param {unknown} rawUrl
 * @param {string} [fallback='#']
 * @returns {string}
 */
function sanitizeUrl(rawUrl, fallback = '#') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Disallow ASCII control characters, quotes, angles, backticks
  if (/[\0-\x1F\x7F<>"'`\\]/.test(trimmed)) return fallback;

  // Safe relative paths & anchors
  if (
    trimmed.startsWith('#') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return trimmed;
  }

  // Check explicit protocol
  const colonIndex = trimmed.indexOf(':');
  if (colonIndex !== -1) {
    const protocol = trimmed.substring(0, colonIndex).toLowerCase();
    if (['http', 'https', 'mailto', 'tel'].includes(protocol)) {
      return trimmed;
    }
    // Any other protocol (javascript, data, vbscript, file, blob, etc.) is rejected
    return fallback;
  }

  // Protocol-relative URL check: '//example.com'
  if (trimmed.startsWith('//')) {
    return 'https:' + trimmed;
  }

  // Bare domain or relative slug without leading slash
  if (/^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

// =============================================================================
// 1. ANTI-PROTOTYPE POLLUTION DEEP MERGE (Chống Ô nhiễm Nguyên mẫu)
// =============================================================================

/**
 * Deep freezes an object recursively to guarantee immutability.
 *
 * @template T
 * @param {T} obj
 * @returns {Readonly<T>}
 */
function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Object.isFrozen(obj)) return obj;
  Object.freeze(obj);
  for (const key of Object.keys(obj)) {
    const val = /** @type {any} */ (obj)[key];
    if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

/**
 * Deep merge utility strictly immune to Prototype Pollution.
 * Completely ignores and drops keys matching '__proto__', 'constructor', and 'prototype'.
 *
 * @template T
 * @param {T} target
 * @param {...Array<Partial<T> | Record<string, any>>} sources
 * @returns {T}
 */
function safeDeepMerge(target, ...sources) {
  if (target === null || typeof target !== 'object') {
    target = /** @type {any} */ (Array.isArray(target) ? [] : {});
  }

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;

    // Use Reflect.ownKeys to catch all own properties safely
    const keys = Reflect.ownKeys(source);
    for (const key of keys) {
      if (typeof key === 'symbol') continue;

      // ⚡ Prototype Pollution Defense: strictly forbid prototype pollution vectors
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      const val = /** @type {any} */ (source)[key];
      if (val === undefined) continue;

      if (Array.isArray(val)) {
        /** @type {any} */ (target)[key] = val.map((item) => {
          if (item && typeof item === 'object') {
            return safeDeepMerge(Array.isArray(item) ? [] : {}, item);
          }
          return item;
        });
      } else if (val !== null && typeof val === 'object') {
        const existing = /** @type {any} */ (target)[key];
        if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
          /** @type {any} */ (target)[key] = {};
        }
        /** @type {any} */ (target)[key] = safeDeepMerge(/** @type {any} */ (target)[key], val);
      } else {
        /** @type {any} */ (target)[key] = val;
      }
    }
  }

  return target;
}

// =============================================================================
// 2. ANTI-CSS INJECTION SANITIZER (Bộ Lọc Chống Tiêm Mã CSS)
// =============================================================================

// Strictly forbidden tokens in CSS values
const DANGEROUS_CSS_PATTERNS = /[;<>{}"'`\\]|expression|javascript|behavior|-moz-binding|@import|url\s*\(|\/\*|\*\//i;

// Regular expressions for permitted CSS values
const RE_HEX_COLOR = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RE_RGB_COLOR = /^rgba?\(\s*([0-9]{1,3}\s*,\s*){2}[0-9]{1,3}(\s*,\s*(0|1|0?\.\d+|\d+%))?\s*\)$/i;
const RE_RGB_SPACE_COLOR = /^rgba?\(\s*[\d\.\-%]+(\s+[\d\.\-%]+){2}(\s*\/\s*[\d\.\-%]+)?\s*\)$/i;
const RE_HSL_COLOR = /^hsla?\(\s*[\d\.\-%a-z]+(\s*,\s*[\d\.\-%]+){2}(\s*,\s*[\d\.\-%]+)?\s*\)$/i;
const RE_HSL_SPACE_COLOR = /^hsla?\(\s*[\d\.\-%a-z]+(\s+[\d\.\-%]+){2}(\s*\/\s*[\d\.\-%]+)?\s*\)$/i;
const RE_OKLCH_COLOR = /^(oklch|oklab|lch|lab)\(\s*[\d\.\-%]+(\s+[\d\.\-%]+){2}(\s*\/\s*[\d\.\-%]+)?\s*\)$/i;
const RE_NAMED_COLOR = /^(transparent|currentcolor|inherit|initial|unset|white|black|slate|zinc|gray|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)$/i;
const RE_DIMENSION = /^-?\d+(\.\d+)?(px|rem|em|vh|vw|vmin|vmax|%|deg|ms|s|fr)$/i;
const RE_ZERO = /^0$/;
const RE_CUBIC_BEZIER = /^cubic-bezier\(\s*[\d\.\-]+\s*,\s*[\d\.\-]+\s*,\s*[\d\.\-]+\s*,\s*[\d\.\-]+\s*\)$/i;
const RE_EASING_KEYWORD = /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/i;
const RE_FONT_FAMILY = /^[a-zA-Z0-9\-_,\s]+$/;

/**
 * Tokenizes a CSS value by whitespace, respecting parentheses
 * @param {string} str
 * @returns {string[]}
 */
function tokenizeCssValue(str) {
  const tokens = [];
  let current = '';
  let inParen = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') {
      inParen++;
      current += ch;
    } else if (ch === ')') {
      if (inParen > 0) inParen--;
      current += ch;
    } else if (/\s/.test(ch) && inParen === 0) {
      if (current.trim()) {
        tokens.push(current.trim());
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    tokens.push(current.trim());
  }
  return tokens;
}

/**
 * Validates a single box-shadow component
 * @param {string} part
 * @returns {boolean}
 */
function isValidSingleShadow(part) {
  const p = part.trim();
  if (!p || p === 'none') return true;

  // Check for forbidden characters
  if (DANGEROUS_CSS_PATTERNS.test(p)) return false;

  // Single shadow format: optional 'inset', 2 to 4 lengths, color
  // Or color at front, optional 'inset', 2 to 4 lengths
  const tokens = tokenizeCssValue(p);
  if (tokens.length < 2 || tokens.length > 7) return false;

  let hasLength = 0;
  let hasColor = 0;
  for (const t of tokens) {
    if (t.toLowerCase() === 'inset') continue;
    if (RE_DIMENSION.test(t) || RE_ZERO.test(t)) {
      hasLength++;
      continue;
    }
    // Check if valid color token
    if (
      RE_HEX_COLOR.test(t) ||
      RE_NAMED_COLOR.test(t) ||
      RE_RGB_COLOR.test(t) ||
      RE_RGB_SPACE_COLOR.test(t) ||
      RE_HSL_COLOR.test(t) ||
      RE_HSL_SPACE_COLOR.test(t) ||
      RE_OKLCH_COLOR.test(t)
    ) {
      hasColor++;
      continue;
    }
    return false;
  }
  return hasLength >= 2 && hasColor <= 1;
}

/**
 * Strictly sanitizes and validates CSS values.
 * Prevents delimiter escape, style injection, url() data exfiltration,
 * expression() script execution, and behavior hijacking.
 *
 * @param {unknown} val
 * @param {string} [fallback='']
 * @returns {string}
 */
function sanitizeCssValue(val, fallback = '') {
  if (val === null || val === undefined) return fallback;

  if (typeof val === 'number') {
    return Number.isFinite(val) ? String(val) : fallback;
  }

  if (typeof val !== 'string') return fallback;

  const trimmed = val.trim();
  if (!trimmed) return fallback;

  // Immediate rejection of harmful characters and CSS injection tokens
  if (DANGEROUS_CSS_PATTERNS.test(trimmed)) {
    return fallback;
  }

  // 1. Color formats
  if (
    RE_HEX_COLOR.test(trimmed) ||
    RE_RGB_COLOR.test(trimmed) ||
    RE_RGB_SPACE_COLOR.test(trimmed) ||
    RE_HSL_COLOR.test(trimmed) ||
    RE_HSL_SPACE_COLOR.test(trimmed) ||
    RE_OKLCH_COLOR.test(trimmed) ||
    RE_NAMED_COLOR.test(trimmed)
  ) {
    return trimmed;
  }

  // 2. Dimension and timing units
  if (RE_DIMENSION.test(trimmed) || RE_ZERO.test(trimmed)) {
    return trimmed;
  }

  // 3. Animation easings
  if (RE_CUBIC_BEZIER.test(trimmed) || RE_EASING_KEYWORD.test(trimmed)) {
    return trimmed;
  }

  // 4. Box shadows (support multi-layer comma separated shadows)
  if (trimmed.includes('px') || trimmed.includes('rem') || trimmed.includes('inset')) {
    // Split by commas not inside parentheses
    const shadowParts = trimmed.split(/,(?![^(]*\))/);
    const allValid = shadowParts.every((part) => isValidSingleShadow(part));
    if (allValid) {
      return trimmed;
    }
  }

  // 5. Font stack
  if (RE_FONT_FAMILY.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}

// =============================================================================
// 3. DEFAULT SCHEMA TEMPLATES (Khuôn Mẫu Khởi Tạo Chuẩn)
// =============================================================================

const DEFAULT_LUMINOUS_THEME = Object.freeze({
  canvas: '#FAF9F6',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.06)',
  highlight: 'rgba(255, 255, 255, 0.9)',
  text: Object.freeze({
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#94a3b8',
  }),
  accent: Object.freeze({
    primary: '#2563eb',
    hover: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.25)',
  }),
  shadows: Object.freeze({
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 12px rgba(0, 0, 0, 0.05)',
    lg: '0 12px 28px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
    ambient: '0 1px 3px rgba(0, 0, 0, 0.04)',
    key: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
  }),
  customTokens: Object.freeze({}),
});

const DEFAULT_PAGE_SCHEMA = Object.freeze({
  metadata: Object.freeze({
    title: 'Luminous Experience — Antigravity 2.0',
    description: 'Precision engineered web architecture built on Luminous Light Theme.',
    lang: 'en',
    charset: 'UTF-8',
  }),
  theme: DEFAULT_LUMINOUS_THEME,
  navigation: Object.freeze({
    brandName: 'ANTIGRAVITY',
    tagline: 'Enterprise Engine v2.0',
    links: Object.freeze([
      Object.freeze({ label: 'Architecture', href: '#architecture' }),
      Object.freeze({ label: 'Bento Telemetry', href: '#telemetry' }),
      Object.freeze({ label: 'Scrollytelling', href: '#scrolly' }),
      Object.freeze({ label: 'Soundboard', href: '#soundboard' }),
    ]),
    ctaButton: Object.freeze({ text: 'Deploy Node', link: '#deploy', haptic: true }),
    glassHud: true,
  }),
  hero: Object.freeze({
    shaderType: 'particle-mesh',
    particleCount: 160,
    interactiveRadius: 140,
    dprCap: 2.0,
    headline: 'High-Velocity Autonomous Agent Architecture',
    subheadline:
      'Engineered with tactile spring micro-interactions, 60 FPS frame-budgeted WebGL, and multi-layered luminous surfaces.',
    badges: Object.freeze(['v2.0 Hyper-Parallel', 'WCAG AA Compliant', '60 FPS Budget']),
    ctaButtons: Object.freeze([
      Object.freeze({ text: 'Explore Telemetry', link: '#telemetry', primary: true, haptic: true }),
      Object.freeze({ text: 'Documentation', link: '#scrolly', primary: false, haptic: true }),
    ]),
    baseColor: Object.freeze([37, 99, 235]),
    speed: 1.0,
    showLiveBadge: true,
  }),
  bentoGrid: Object.freeze({
    columns: 12,
    autoDensity: 'dense',
    gap: '1.5rem',
    title: 'System Telemetry & Architecture Grid',
    subtitle: 'Real-time telemetry, resilient state machines, and optical tactile surfaces.',
    cellMatrix: Object.freeze([
      Object.freeze({
        id: 'cell-speed',
        colSpan: 8,
        title: 'Hyper-Overclocked Throughput',
        subtitle: 'Sub-millisecond frame dispatch with zero CPU contention.',
        type: 'stat',
        statValue: '128K',
        statLabel: 'Output Tokens Budget',
        interactive: true,
        spotlight: true,
        tilt: true,
        haptic: true,
      }),
      Object.freeze({
        id: 'cell-fps',
        colSpan: 4,
        title: '60 FPS Invariant',
        subtitle: 'Hardware accelerated rendering.',
        type: 'stat',
        statValue: '60 FPS',
        statLabel: 'Frame Stability',
        interactive: true,
        spotlight: true,
        tilt: true,
        haptic: true,
      }),
      Object.freeze({
        id: 'cell-audit',
        colSpan: 4,
        title: 'Dual Audit Commission',
        subtitle: 'WCAG AA & 8.5+ Craftsmanship.',
        type: 'feature',
        interactive: true,
        spotlight: true,
        tilt: true,
        haptic: true,
      }),
      Object.freeze({
        id: 'cell-mesh',
        colSpan: 8,
        title: 'Zero-Contention Receipt Manifest',
        subtitle: 'Progressive streaming integration across 6 autonomous pods.',
        type: 'telemetry',
        interactive: true,
        spotlight: true,
        tilt: true,
        haptic: true,
      }),
    ]),
  }),
  scrollytelling: Object.freeze({
    pinnedDurationVh: 240,
    transitionCurve: 'cubic-bezier(0.22, 1, 0.36, 1)',
    title: 'Autonomous System Evolution Narrative',
    subtitle: 'Step through the forensic verification loop.',
    scenes: Object.freeze([
      Object.freeze({
        id: 'scene-1',
        title: 'Phase 1: Forensic Inspection & AST Locking',
        description: 'Static AST inspection freezes interface contracts to eliminate merge conflicts.',
        badge: 'Step 01 / 03',
        metric: Object.freeze({ label: 'Contract Integrity', value: '100%' }),
      }),
      Object.freeze({
        id: 'scene-2',
        title: 'Phase 2: 6-Pod Concurrent Assembly',
        description: 'Parallel workers assemble logic, layout, motion, and verification harnesses.',
        badge: 'Step 02 / 03',
        metric: Object.freeze({ label: 'Concurrency Floor', value: '6 Agents' }),
      }),
      Object.freeze({
        id: 'scene-3',
        title: 'Phase 3: Closed-Loop Verification',
        description: 'Adversarial fuzzing, prototype pollution verification, and headless browser audits.',
        badge: 'Step 03 / 03',
        metric: Object.freeze({ label: 'Pass Rate', value: '100% Tests Pass' }),
      }),
    ]),
  }),
  soundboard: Object.freeze({
    waveforms: 'sine',
    rotaryTicks: true,
    mechanicalSwitch: true,
    spatialPanning: true,
    volume: 0.15,
    muted: false,
    enabled: true,
  }),
  footer: Object.freeze({
    copyright: '© 2026 Antigravity Enterprise Engine. All Rights Reserved.',
    tagline: 'Crafted with Luminous Light Theme & Precision Engineering.',
    badges: Object.freeze(['WCAG AA', 'Zero Prototype Pollution', 'Anti-XSS Protected']),
    links: Object.freeze([
      Object.freeze({ label: 'Architecture Specs', href: '#architecture' }),
      Object.freeze({ label: 'Experience Ledger', href: '#experience' }),
      Object.freeze({ label: 'System Health', href: '#telemetry' }),
    ]),
  }),
});

// =============================================================================
// 4. LIGHTWEIGHT VIRTUAL DOM HELPER FOR HEADLESS RUNTIMES
// =============================================================================

/**
 * Creates a lightweight Virtual DOM element when running outside of a browser.
 * Ensures assembleToDom() runs completely in Node.js headless test harnesses.
 *
 * @param {string} tagName
 * @returns {any}
 */
function createVirtualElement(tagName) {
  const attributes = new Map();
  const children = [];
  const eventListeners = new Map();
  const styleProps = new Map();

  const element = {
    tagName: tagName.toUpperCase(),
    children,
    style: {
      setProperty: (prop, val) => {
        styleProps.set(prop, val);
      },
      getPropertyValue: (prop) => styleProps.get(prop) || '',
    },
    dataset: {},
    classList: {
      _classes: new Set(),
      add: (...cls) => cls.forEach((c) => element.classList._classes.add(c)),
      remove: (...cls) => cls.forEach((c) => element.classList._classes.delete(c)),
      contains: (c) => element.classList._classes.has(c),
    },
    setAttribute: (name, value) => {
      attributes.set(name, String(value));
      if (name.startsWith('data-')) {
        const camel = name
          .slice(5)
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        element.dataset[camel] = String(value);
      }
    },
    getAttribute: (name) => attributes.get(name) || null,
    removeAttribute: (name) => {
      attributes.delete(name);
      if (name.startsWith('data-')) {
        const camel = name
          .slice(5)
          .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        delete element.dataset[camel];
      }
    },
    appendChild: (child) => {
      children.push(child);
      child.parentNode = element;
      return child;
    },
    removeChild: (child) => {
      const idx = children.indexOf(child);
      if (idx !== -1) {
        children.splice(idx, 1);
        child.parentNode = null;
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
    dispatchEvent: (event) => {
      const listeners = eventListeners.get(event.type);
      if (listeners) {
        listeners.forEach((fn) => fn(event));
      }
      return true;
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
      if (['img', 'input', 'hr', 'br', 'meta'].includes(tag)) {
        return `<${tag}${attrStr} />`;
      }
      return `<${tag}${attrStr}>${element.innerHTML}</${tag}>`;
    },
    querySelector: (selector) => {
      const all = element.querySelectorAll(selector);
      return all.length > 0 ? all[0] : null;
    },
    querySelectorAll: (selector) => {
      const parts = selector.trim().split(/\s+/);
      let currentMatches = [element];

      for (const part of parts) {
        const nextMatches = [];
        const matchSingle = (el, p) => {
          if (!el || typeof el !== 'object' || !el.tagName) return false;
          if (p.startsWith('.')) {
            return el.classList && el.classList.contains(p.slice(1));
          } else if (p.startsWith('#')) {
            return el.getAttribute && el.getAttribute('id') === p.slice(1);
          } else if (p.startsWith('[') && p.endsWith(']')) {
            const attr = p.slice(1, -1);
            if (attr.includes('=')) {
              const [k, v] = attr.split('=');
              const cleanV = v.replace(/['"]/g, '');
              return el.getAttribute && el.getAttribute(k) === cleanV;
            } else {
              return el.getAttribute && el.getAttribute(attr) !== null;
            }
          } else {
            return el.tagName.toLowerCase() === p.toLowerCase();
          }
        };

        const collectDescendants = (el, p) => {
          if (!el || !el.children) return;
          for (const child of el.children) {
            if (typeof child === 'object' && child.tagName) {
              if (matchSingle(child, p)) {
                nextMatches.push(child);
              }
              collectDescendants(child, p);
            }
          }
        };

        for (const m of currentMatches) {
          collectDescendants(m, part);
        }
        currentMatches = nextMatches;
      }

      return currentMatches;
    },
  };

  return element;
}

// =============================================================================
// 5. SAFEDOMASSEMBLER — COMPILE TO ACTIVE DOM (Lắp ghép Cây DOM Trực tiếp)
// =============================================================================

/**
 * Normalizes and deep-merges user schema with default Luminous specifications.
 *
 * @param {Record<string, any>} userSchema
 * @returns {Readonly<import('../schema/round3_ast_contracts.d.ts').PageAssemblySchema>}
 */
function normalizeSchema(userSchema) {
  const merged = safeDeepMerge({}, DEFAULT_PAGE_SCHEMA, userSchema || {});
  return deepFreeze(merged);
}

/**
 * Applies sanitized Luminous Light Theme CSS Custom Properties onto an element.
 *
 * @param {any} targetElement
 * @param {any} theme
 */
function applyThemeVariables(targetElement, theme) {
  if (!targetElement || !theme) return;
  const style = targetElement.style;

  const setSafeProp = (varName, val, fallback) => {
    const sanitized = sanitizeCssValue(val, fallback);
    style.setProperty(varName, sanitized);
  };

  setSafeProp('--od-canvas', theme.canvas, '#FAF9F6');
  setSafeProp('--od-surface', theme.surface, '#FFFFFF');
  setSafeProp('--od-elevated', theme.elevated, '#FFFFFF');
  setSafeProp('--od-border', theme.border, 'rgba(0, 0, 0, 0.06)');
  setSafeProp('--od-highlight', theme.highlight, 'rgba(255, 255, 255, 0.9)');

  // Text tokens
  if (typeof theme.text === 'object' && theme.text !== null) {
    setSafeProp('--od-text-primary', theme.text.primary, '#0f172a');
    setSafeProp('--od-text-secondary', theme.text.secondary, '#475569');
    setSafeProp('--od-text-muted', theme.text.muted, '#94a3b8');
  } else {
    setSafeProp('--od-text-primary', theme.text, '#0f172a');
  }

  // Accent tokens
  if (typeof theme.accent === 'object' && theme.accent !== null) {
    setSafeProp('--od-accent', theme.accent.primary, '#2563eb');
    setSafeProp('--od-accent-hover', theme.accent.hover, '#1d4ed8');
    setSafeProp('--od-accent-glow', theme.accent.glow, 'rgba(37, 99, 235, 0.25)');
  } else {
    setSafeProp('--od-accent', theme.accent, '#2563eb');
    setSafeProp('--od-accent-hover', '#1d4ed8', '#1d4ed8');
    setSafeProp('--od-accent-glow', 'rgba(37, 99, 235, 0.25)', 'rgba(37, 99, 235, 0.25)');
  }

  // Shadows
  if (typeof theme.shadows === 'object' && theme.shadows !== null) {
    setSafeProp('--od-shadow-sm', theme.shadows.sm, '0 1px 2px rgba(0, 0, 0, 0.04)');
    setSafeProp('--od-shadow-md', theme.shadows.md, '0 4px 12px rgba(0, 0, 0, 0.05)');
    setSafeProp(
      '--od-shadow-lg',
      theme.shadows.lg,
      '0 12px 28px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)'
    );
  }

  // Custom tokens
  if (theme.customTokens && typeof theme.customTokens === 'object') {
    for (const [tokenName, tokenVal] of Object.entries(theme.customTokens)) {
      const cleanVar = tokenName.startsWith('--') ? tokenName : `--${tokenName}`;
      // Verify tokenName has no forbidden characters
      if (/^[a-zA-Z0-9\-_]+$/.test(cleanVar.slice(2))) {
        setSafeProp(cleanVar, tokenVal, '');
      }
    }
  }
}

/**
 * Assembles a PageAssemblySchema safely into a live DOM container.
 * Zero raw innerHTML injection on user-supplied strings.
 *
 * @param {Record<string, any>} schema
 * @param {HTMLElement | any} [containerElement=null]
 * @returns {import('../schema/round3_ast_contracts.d.ts').AssembledDOMInstance}
 */
function assembleToDom(schema, containerElement = null) {
  const normalized = normalizeSchema(schema);
  const cleanups = [];

  // Determine element creation function
  const hasBrowserDom = isBrowser();
  const createElement = (tag) => {
    if (hasBrowserDom && document.createElement) {
      return document.createElement(tag);
    }
    return createVirtualElement(tag);
  };

  // Resolve or instantiate container
  const root = containerElement || createElement('div');
  root.classList.add('od-page-container');
  applyThemeVariables(root, normalized.theme);

  // ---------------------------------------------------------------------------
  // 1. Navigation Header (Glass HUD)
  // ---------------------------------------------------------------------------
  if (normalized.navigation) {
    const navConfig = normalized.navigation;
    const header = createElement('header');
    header.classList.add('od-nav');
    if (navConfig.glassHud) header.classList.add('od-glass-hud');

    const navInner = createElement('div');
    navInner.classList.add('od-nav-inner');

    // Brand
    const brand = createElement('div');
    brand.classList.add('od-nav-brand');
    const brandTitle = createElement('span');
    brandTitle.classList.add('od-brand-name');
    brandTitle.textContent = navConfig.brandName || 'ANTIGRAVITY';
    brand.appendChild(brandTitle);

    if (navConfig.tagline) {
      const tag = createElement('span');
      tag.classList.add('od-brand-tag');
      tag.textContent = navConfig.tagline;
      brand.appendChild(tag);
    }
    navInner.appendChild(brand);

    // Links
    if (Array.isArray(navConfig.links) && navConfig.links.length > 0) {
      const linksNav = createElement('nav');
      linksNav.classList.add('od-nav-links');
      navConfig.links.forEach((l) => {
        const a = createElement('a');
        a.textContent = l.label || 'Link';
        a.setAttribute('href', sanitizeUrl(l.href));
        if (l.target) a.setAttribute('target', l.target);
        linksNav.appendChild(a);
      });
      navInner.appendChild(linksNav);
    }

    // CTA
    if (navConfig.ctaButton) {
      const cta = createElement('a');
      cta.classList.add('od-btn', 'od-btn-accent', 'od-nav-cta');
      cta.textContent = navConfig.ctaButton.text || 'Action';
      cta.setAttribute('href', sanitizeUrl(navConfig.ctaButton.link));
      if (navConfig.ctaButton.haptic) cta.setAttribute('data-haptic', 'true');
      navInner.appendChild(cta);
    }

    header.appendChild(navInner);
    root.appendChild(header);
  }

  // ---------------------------------------------------------------------------
  // 2. 3D Interactive Hero Section
  // ---------------------------------------------------------------------------
  if (normalized.hero) {
    const heroConfig = normalized.hero;
    const heroSection = createElement('section');
    heroSection.classList.add('od-hero-section');
    heroSection.setAttribute('id', 'hero');

    // WebGL Canvas Background
    const canvas = createElement('canvas');
    canvas.classList.add('od-hero-canvas');
    canvas.setAttribute('data-shader', heroConfig.shaderType || 'particle-mesh');
    canvas.setAttribute('data-particles', String(heroConfig.particleCount || 160));
    canvas.setAttribute('data-dpr', String(heroConfig.dprCap || 2.0));
    heroSection.appendChild(canvas);

    // Hero Content
    const heroContent = createElement('div');
    heroContent.classList.add('od-hero-content');

    // Badges
    if (Array.isArray(heroConfig.badges) && heroConfig.badges.length > 0) {
      const badgeRow = createElement('div');
      badgeRow.classList.add('od-badge-row');
      heroConfig.badges.forEach((b) => {
        const badge = createElement('span');
        badge.classList.add('od-pill-badge');
        badge.textContent = b;
        badgeRow.appendChild(badge);
      });
      heroContent.appendChild(badgeRow);
    }

    // Headline
    const h1 = createElement('h1');
    h1.classList.add('od-hero-headline');
    h1.textContent = heroConfig.headline || 'Luminous Architecture';
    heroContent.appendChild(h1);

    // Subheadline
    if (heroConfig.subheadline) {
      const p = createElement('p');
      p.classList.add('od-hero-subheadline');
      p.textContent = heroConfig.subheadline;
      heroContent.appendChild(p);
    }

    // CTA Buttons
    if (Array.isArray(heroConfig.ctaButtons) && heroConfig.ctaButtons.length > 0) {
      const actions = createElement('div');
      actions.classList.add('od-hero-actions');
      heroConfig.ctaButtons.forEach((btn) => {
        const a = createElement('a');
        a.classList.add('od-btn', btn.primary ? 'od-btn-accent' : 'od-btn-secondary');
        a.textContent = btn.text || 'Explore';
        a.setAttribute('href', sanitizeUrl(btn.link));
        if (btn.haptic) a.setAttribute('data-haptic', 'true');
        actions.appendChild(a);
      });
      heroContent.appendChild(actions);
    }

    heroSection.appendChild(heroContent);
    root.appendChild(heroSection);
  }

  // ---------------------------------------------------------------------------
  // 3. Bento Telemetry Grid
  // ---------------------------------------------------------------------------
  if (normalized.bentoGrid) {
    const bentoConfig = normalized.bentoGrid;
    const bentoSection = createElement('section');
    bentoSection.classList.add('od-bento-section');
    bentoSection.setAttribute('id', 'telemetry');

    // Section Header
    if (bentoConfig.title || bentoConfig.subtitle) {
      const header = createElement('div');
      header.classList.add('od-section-header');
      if (bentoConfig.badge) {
        const badge = createElement('span');
        badge.classList.add('od-pill-badge');
        badge.textContent = bentoConfig.badge;
        header.appendChild(badge);
      }
      if (bentoConfig.title) {
        const h2 = createElement('h2');
        h2.textContent = bentoConfig.title;
        header.appendChild(h2);
      }
      if (bentoConfig.subtitle) {
        const p = createElement('p');
        p.textContent = bentoConfig.subtitle;
        header.appendChild(p);
      }
      bentoSection.appendChild(header);
    }

    // Grid Container
    const grid = createElement('div');
    grid.classList.add('od-bento-grid');
    const cols = Math.max(1, Math.min(24, Number(bentoConfig.columns) || 12));
    grid.style.setProperty('--bento-columns', String(cols));

    if (bentoConfig.gap) {
      grid.style.setProperty('--bento-gap', sanitizeCssValue(bentoConfig.gap, '1.5rem'));
    }

    // Cells
    if (Array.isArray(bentoConfig.cellMatrix)) {
      bentoConfig.cellMatrix.forEach((cell) => {
        const card = createElement('article');
        card.classList.add('od-bento-card');
        if (cell.id) card.setAttribute('id', cell.id);

        const colSpan = Math.max(1, Math.min(cols, Number(cell.colSpan) || 4));
        const rowSpan = Math.max(1, Number(cell.rowSpan) || 1);
        card.style.setProperty('--col-span', String(colSpan));
        card.style.setProperty('--row-span', String(rowSpan));

        if (cell.spotlight) card.setAttribute('data-spotlight', 'true');
        if (cell.tilt) card.setAttribute('data-tilt', 'true');
        if (cell.haptic) card.setAttribute('data-haptic', 'true');

        // Card Glow Layer
        const glow = createElement('div');
        glow.classList.add('od-spotlight-glow');
        card.appendChild(glow);

        // Content Wrapper
        const cardInner = createElement('div');
        cardInner.classList.add('od-card-inner');

        // Badge
        if (cell.badge) {
          const badge = createElement('span');
          badge.classList.add('od-cell-badge');
          badge.textContent = cell.badge;
          cardInner.appendChild(badge);
        }

        // Stat Counter
        if (cell.statValue) {
          const statBox = createElement('div');
          statBox.classList.add('od-stat-box');
          const statNum = createElement('div');
          statNum.classList.add('od-stat-number');
          statNum.textContent = cell.statValue;
          statBox.appendChild(statNum);

          if (cell.statLabel) {
            const statLbl = createElement('div');
            statLbl.classList.add('od-stat-label');
            statLbl.textContent = cell.statLabel;
            statBox.appendChild(statLbl);
          }
          cardInner.appendChild(statBox);
        }

        // Title
        if (cell.title) {
          const title = createElement('h3');
          title.classList.add('od-card-title');
          title.textContent = cell.title;
          cardInner.appendChild(title);
        }

        // Subtitle / Description
        if (cell.subtitle || cell.content) {
          const desc = createElement('p');
          desc.classList.add('od-card-desc');
          desc.textContent = cell.subtitle || cell.content;
          cardInner.appendChild(desc);
        }

        card.appendChild(cardInner);
        grid.appendChild(card);
      });
    }

    bentoSection.appendChild(grid);
    root.appendChild(bentoSection);
  }

  // ---------------------------------------------------------------------------
  // 4. Scrollytelling Pinned Stage
  // ---------------------------------------------------------------------------
  if (normalized.scrollytelling) {
    const scrollyConfig = normalized.scrollytelling;
    const scrollySection = createElement('section');
    scrollySection.classList.add('od-scrolly-section');
    scrollySection.setAttribute('id', 'scrolly');

    if (scrollyConfig.title || scrollyConfig.subtitle) {
      const header = createElement('div');
      header.classList.add('od-section-header');
      if (scrollyConfig.title) {
        const h2 = createElement('h2');
        h2.textContent = scrollyConfig.title;
        header.appendChild(h2);
      }
      if (scrollyConfig.subtitle) {
        const p = createElement('p');
        p.textContent = scrollyConfig.subtitle;
        header.appendChild(p);
      }
      scrollySection.appendChild(header);
    }

    const pinnedViewport = createElement('div');
    pinnedViewport.classList.add('od-scrolly-stage');
    const vh = Math.max(100, Number(scrollyConfig.pinnedDurationVh) || 200);
    pinnedViewport.style.setProperty('--pinned-duration', `${vh}vh`);

    if (Array.isArray(scrollyConfig.scenes)) {
      const scenesList = createElement('div');
      scenesList.classList.add('od-scrolly-scenes');

      scrollyConfig.scenes.forEach((scene, index) => {
        const sceneCard = createElement('div');
        sceneCard.classList.add('od-scene-card');
        if (index === 0) sceneCard.classList.add('is-active');
        if (scene.id) sceneCard.setAttribute('data-scene-id', scene.id);

        if (scene.badge) {
          const badge = createElement('span');
          badge.classList.add('od-scene-badge');
          badge.textContent = scene.badge;
          sceneCard.appendChild(badge);
        }

        const title = createElement('h4');
        title.classList.add('od-scene-title');
        title.textContent = scene.title || `Scene ${index + 1}`;
        sceneCard.appendChild(title);

        if (scene.description) {
          const p = createElement('p');
          p.classList.add('od-scene-desc');
          p.textContent = scene.description;
          sceneCard.appendChild(p);
        }

        if (scene.metric) {
          const metricBox = createElement('div');
          metricBox.classList.add('od-scene-metric');
          const val = createElement('strong');
          val.textContent = scene.metric.value;
          const lbl = createElement('span');
          lbl.textContent = scene.metric.label;
          metricBox.appendChild(val);
          metricBox.appendChild(lbl);
          sceneCard.appendChild(metricBox);
        }

        scenesList.appendChild(sceneCard);
      });
      pinnedViewport.appendChild(scenesList);
    }

    scrollySection.appendChild(pinnedViewport);
    root.appendChild(scrollySection);
  }

  // ---------------------------------------------------------------------------
  // 5. Soundboard Controls
  // ---------------------------------------------------------------------------
  if (normalized.soundboard && normalized.soundboard.enabled !== false) {
    const sbConfig = normalized.soundboard;
    const sbSection = createElement('section');
    sbSection.classList.add('od-soundboard-section');
    sbSection.setAttribute('id', 'soundboard');

    const header = createElement('div');
    header.classList.add('od-section-header');
    const h2 = createElement('h2');
    h2.textContent = 'WebAudio Haptics & Tactile Soundboard';
    const p = createElement('p');
    p.textContent =
      'Precision acoustic feedback synthesized live via Web Audio API. Zero asset downloads.';
    header.appendChild(h2);
    header.appendChild(p);
    sbSection.appendChild(header);

    const padContainer = createElement('div');
    padContainer.classList.add('od-soundboard-grid');

    const soundActions = [
      { id: 'btn-click', name: 'Tactile Click', sound: 'click', desc: '1.2 kHz sine transient' },
      { id: 'btn-pop', name: 'Elastic Pop', sound: 'pop', desc: 'Frequency glide chirp' },
      { id: 'btn-chime', name: 'Success Chime', sound: 'chime', desc: 'Triad harmonic chord' },
      { id: 'btn-switch', name: 'Mechanical Switch', sound: 'switch', desc: 'Dual-phase latching click' },
    ];

    soundActions.forEach((item) => {
      const card = createElement('div');
      card.classList.add('od-sound-pad');
      card.setAttribute('data-haptic', item.sound);
      card.setAttribute('data-spotlight', 'true');

      const title = createElement('strong');
      title.textContent = item.name;
      const desc = createElement('span');
      desc.textContent = item.desc;

      card.appendChild(title);
      card.appendChild(desc);
      padContainer.appendChild(card);
    });

    sbSection.appendChild(padContainer);
    root.appendChild(sbSection);
  }

  // ---------------------------------------------------------------------------
  // 6. Footer
  // ---------------------------------------------------------------------------
  if (normalized.footer) {
    const footerConfig = normalized.footer;
    const footer = createElement('footer');
    footer.classList.add('od-footer');

    const inner = createElement('div');
    inner.classList.add('od-footer-inner');

    const copy = createElement('p');
    copy.classList.add('od-footer-copy');
    copy.textContent = footerConfig.copyright || '© 2026 Antigravity';
    inner.appendChild(copy);

    if (footerConfig.tagline) {
      const tag = createElement('p');
      tag.classList.add('od-footer-tag');
      tag.textContent = footerConfig.tagline;
      inner.appendChild(tag);
    }

    if (Array.isArray(footerConfig.badges) && footerConfig.badges.length > 0) {
      const badgeRow = createElement('div');
      badgeRow.classList.add('od-footer-badges');
      footerConfig.badges.forEach((b) => {
        const badge = createElement('span');
        badge.classList.add('od-pill-badge');
        badge.textContent = b;
        badgeRow.appendChild(badge);
      });
      inner.appendChild(badgeRow);
    }

    footer.appendChild(inner);
    root.appendChild(footer);
  }

  // ---------------------------------------------------------------------------
  // 7. Interactive Bindings (Spotlight & Audio Dispatch)
  // ---------------------------------------------------------------------------
  if (hasBrowserDom) {
    // Dynamic Spotlight Pointer Tracking
    const handlePointerMove = (e) => {
      const cards = root.querySelectorAll('[data-spotlight="true"]');
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    root.addEventListener('pointermove', handlePointerMove, { passive: true });
    cleanups.push(() => root.removeEventListener('pointermove', handlePointerMove));
  }

  return {
    container: root,
    schema: normalized,
    updateTheme: (newTheme) => {
      const mergedTheme = safeDeepMerge({}, normalized.theme, newTheme || {});
      applyThemeVariables(root, mergedTheme);
    },
    destroy: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}

// =============================================================================
// 6. STANDALONE HTML COMPILER (Biên dịch Ra File HTML Độc Lập)
// =============================================================================

/**
 * Builds the complete embedded CSS stylesheet for Standalone HTML export.
 *
 * @param {any} theme
 * @returns {string}
 */
function buildStandaloneCss(theme) {
  const cCanvas = sanitizeCssValue(theme.canvas, '#FAF9F6');
  const cSurface = sanitizeCssValue(theme.surface, '#FFFFFF');
  const cElevated = sanitizeCssValue(theme.elevated, '#FFFFFF');
  const cBorder = sanitizeCssValue(theme.border, 'rgba(0, 0, 0, 0.06)');
  const cHighlight = sanitizeCssValue(theme.highlight, 'rgba(255, 255, 255, 0.9)');
  const cTextPrimary = sanitizeCssValue(
    typeof theme.text === 'object' ? theme.text.primary : theme.text,
    '#0f172a'
  );
  const cTextSecondary = sanitizeCssValue(
    typeof theme.text === 'object' ? theme.text.secondary : '#475569',
    '#475569'
  );
  const cTextMuted = sanitizeCssValue(
    typeof theme.text === 'object' ? theme.text.muted : '#94a3b8',
    '#94a3b8'
  );
  const cAccent = sanitizeCssValue(
    typeof theme.accent === 'object' ? theme.accent.primary : theme.accent,
    '#2563eb'
  );
  const cAccentHover = sanitizeCssValue(
    typeof theme.accent === 'object' ? theme.accent.hover : '#1d4ed8',
    '#1d4ed8'
  );
  const cAccentGlow = sanitizeCssValue(
    typeof theme.accent === 'object' ? theme.accent.glow : 'rgba(37, 99, 235, 0.25)',
    'rgba(37, 99, 235, 0.25)'
  );
  const sSm = sanitizeCssValue(
    typeof theme.shadows === 'object' ? theme.shadows.sm : '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 2px rgba(0, 0, 0, 0.04)'
  );
  const sMd = sanitizeCssValue(
    typeof theme.shadows === 'object' ? theme.shadows.md : '0 4px 12px rgba(0,0,0,0.05)',
    '0 4px 12px rgba(0, 0, 0, 0.05)'
  );
  const sLg = sanitizeCssValue(
    typeof theme.shadows === 'object'
      ? theme.shadows.lg
      : '0 12px 28px -4px rgba(0,0,0,0.06), 0 4px 10px -2px rgba(0,0,0,0.03)',
    '0 12px 28px -4px rgba(0, 0, 0, 0.06)'
  );

  return `
    :root {
      --od-canvas: ${cCanvas};
      --od-surface: ${cSurface};
      --od-elevated: ${cElevated};
      --od-border: ${cBorder};
      --od-highlight: ${cHighlight};
      --od-text-primary: ${cTextPrimary};
      --od-text-secondary: ${cTextSecondary};
      --od-text-muted: ${cTextMuted};
      --od-accent: ${cAccent};
      --od-accent-hover: ${cAccentHover};
      --od-accent-glow: ${cAccentGlow};
      --od-shadow-sm: ${sSm};
      --od-shadow-md: ${sMd};
      --od-shadow-lg: ${sLg};
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      background-color: var(--od-canvas);
      color: var(--od-text-primary);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    body {
      min-height: 100vh;
      background: var(--od-canvas);
      overflow-x: hidden;
    }

    /* Glass HUD Navigation */
    .od-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
      border-bottom: 1px solid var(--od-border);
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .od-glass-hud {
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
    }

    .od-nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .od-nav-brand {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      text-decoration: none;
      color: var(--od-text-primary);
    }

    .od-brand-name {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .od-brand-tag {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      padding: 0.15rem 0.5rem;
      background: var(--od-surface);
      border: 1px solid var(--od-border);
      border-radius: 9999px;
      color: var(--od-text-muted);
    }

    .od-nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .od-nav-links a {
      color: var(--od-text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .od-nav-links a:hover {
      color: var(--od-accent);
    }

    /* Buttons */
    .od-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.15s cubic-bezier(0.22, 1, 0.36, 1);
      cursor: pointer;
      border: 1px solid transparent;
      user-select: none;
    }

    .od-btn:active {
      transform: scale(0.97);
    }

    .od-btn-accent {
      background: var(--od-accent);
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .od-btn-accent:hover {
      background: var(--od-accent-hover);
      box-shadow: 0 4px 12px var(--od-accent-glow);
    }

    .od-btn-secondary {
      background: var(--od-surface);
      color: var(--od-text-primary);
      border-color: var(--od-border);
      box-shadow: var(--od-shadow-sm);
    }

    .od-btn-secondary:hover {
      background: var(--od-canvas);
      border-color: rgba(0, 0, 0, 0.12);
    }

    /* 3D Hero Section */
    .od-hero-section {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 4rem 1.5rem;
    }

    .od-hero-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.75;
    }

    .od-hero-content {
      position: relative;
      z-index: 2;
      max-width: 860px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .od-badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .od-pill-badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: var(--font-mono);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: var(--od-surface);
      color: var(--od-accent);
      border: 1px solid var(--od-border);
      box-shadow: var(--od-shadow-sm);
    }

    .od-hero-headline {
      font-size: clamp(2.25rem, 5vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--od-text-primary);
      text-wrap: balance;
    }

    .od-hero-subheadline {
      font-size: clamp(1.0625rem, 2vw, 1.25rem);
      color: var(--od-text-secondary);
      max-width: 640px;
      line-height: 1.6;
    }

    .od-hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 0.5rem;
    }

    /* Bento Grid */
    .od-bento-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
    }

    .od-section-header {
      text-align: center;
      margin-bottom: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .od-section-header h2 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .od-section-header p {
      color: var(--od-text-secondary);
      font-size: 1.0625rem;
      max-width: 580px;
    }

    .od-bento-grid {
      display: grid;
      grid-template-columns: repeat(var(--bento-columns, 12), minmax(0, 1fr));
      gap: var(--bento-gap, 1.5rem);
    }

    .od-bento-card {
      grid-column: span var(--col-span, 4);
      grid-row: span var(--row-span, 1);
      position: relative;
      background: var(--od-surface);
      border: 1px solid var(--od-border);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: var(--od-shadow-sm);
      overflow: hidden;
      transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .od-bento-card:hover {
      box-shadow: var(--od-shadow-md);
      border-color: rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    /* Spotlight Radial Hover Overlay */
    .od-spotlight-glow {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease;
      background: radial-gradient(
        500px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
        rgba(37, 99, 235, 0.08),
        transparent 60%
      );
    }

    .od-bento-card:hover .od-spotlight-glow {
      opacity: 1;
    }

    .od-card-inner {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
    }

    .od-cell-badge {
      align-self: flex-start;
      font-size: 0.75rem;
      font-family: var(--font-mono);
      font-weight: 600;
      color: var(--od-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .od-stat-box {
      margin: 0.5rem 0;
    }

    .od-stat-number {
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--od-accent);
      font-feature-settings: "tnum";
    }

    .od-stat-label {
      font-size: 0.875rem;
      color: var(--od-text-muted);
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .od-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .od-card-desc {
      font-size: 0.9375rem;
      color: var(--od-text-secondary);
      line-height: 1.5;
    }

    /* Scrollytelling Stage */
    .od-scrolly-section {
      max-width: 1000px;
      margin: 0 auto;
      padding: 5rem 1.5rem;
    }

    .od-scrolly-stage {
      position: relative;
      padding: 2rem 0;
    }

    .od-scrolly-scenes {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .od-scene-card {
      background: var(--od-surface);
      border: 1px solid var(--od-border);
      border-radius: 1rem;
      padding: 2.25rem;
      box-shadow: var(--od-shadow-sm);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .od-scene-card.is-active {
      border-color: var(--od-accent);
      box-shadow: var(--od-shadow-md), 0 0 0 1px var(--od-accent);
    }

    .od-scene-badge {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--od-accent);
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: block;
    }

    .od-scene-title {
      font-size: 1.375rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .od-scene-desc {
      color: var(--od-text-secondary);
      font-size: 1rem;
      line-height: 1.6;
    }

    .od-scene-metric {
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--od-border);
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }

    .od-scene-metric strong {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--od-accent);
    }

    .od-scene-metric span {
      font-size: 0.875rem;
      color: var(--od-text-muted);
    }

    /* Soundboard Section */
    .od-soundboard-section {
      max-width: 1000px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    .od-soundboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .od-sound-pad {
      background: var(--od-surface);
      border: 1px solid var(--od-border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
      box-shadow: var(--od-shadow-sm);
      transition: all 0.15s ease;
    }

    .od-sound-pad:hover {
      border-color: var(--od-accent);
      transform: translateY(-2px);
      box-shadow: var(--od-shadow-md);
    }

    .od-sound-pad:active {
      transform: scale(0.96);
    }

    .od-sound-pad strong {
      font-size: 1rem;
      color: var(--od-text-primary);
    }

    .od-sound-pad span {
      font-size: 0.8125rem;
      color: var(--od-text-muted);
    }

    /* Footer */
    .od-footer {
      border-top: 1px solid var(--od-border);
      background: var(--od-surface);
      padding: 3rem 1.5rem;
      margin-top: 4rem;
    }

    .od-footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .od-footer-copy {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--od-text-primary);
    }

    .od-footer-tag {
      font-size: 0.875rem;
      color: var(--od-text-muted);
    }

    .od-footer-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Responsive Queries */
    @media (max-width: 768px) {
      .od-nav-links {
        display: none;
      }
      .od-bento-card {
        grid-column: span var(--bento-columns, 12) !important;
      }
      .od-hero-section {
        min-height: 60vh;
        padding: 3rem 1rem;
      }
    }
  `;
}

/**
 * Builds the inline lightweight JavaScript interaction script for Standalone HTML export.
 *
 * @param {any} schema
 * @returns {string}
 */
function buildStandaloneScript(schema) {
  return `
    (function() {
      'use strict';

      // 1. WebAudio Synthesizer Engine
      var audioCtx = null;
      function getAudioContext() {
        if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playHapticSound(type) {
        var ctx = getAudioContext();
        if (!ctx) return;
        var now = ctx.currentTime;

        if (type === 'click' || type === 'true') {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'pop') {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.045);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'chime') {
          [523.25, 659.25, 783.99].forEach(function(freq, i) {
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.03);
            gain.gain.setValueAtTime(0.08, now + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.03);
            osc.stop(now + i * 0.03 + 0.26);
          });
        } else if (type === 'switch') {
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(180, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
        }
      }

      // Attach Tactile Click Listeners
      document.addEventListener('click', function(e) {
        var target = e.target.closest('[data-haptic]');
        if (target) {
          var soundType = target.getAttribute('data-haptic') || 'click';
          playHapticSound(soundType);
        }
      });

      // 2. Cursor Spotlight Tracking
      var spotlightCards = Array.from(document.querySelectorAll('[data-spotlight="true"]'));
      window.addEventListener('pointermove', function(e) {
        for (var i = 0; i < spotlightCards.length; i++) {
          var card = spotlightCards[i];
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', x + 'px');
          card.style.setProperty('--mouse-y', y + 'px');
        }
      }, { passive: true });

      // 3. WebGL / Canvas Particle Mesh Simulation
      var canvas = document.querySelector('.od-hero-canvas');
      if (canvas && window.requestAnimationFrame) {
        var ctx2d = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: -999, y: -999, active: false };
        var numParticles = parseInt(canvas.getAttribute('data-particles') || '140', 10);
        var dprCap = parseFloat(canvas.getAttribute('data-dpr') || '2.0');
        var dpr = Math.min(window.devicePixelRatio || 1, dprCap);

        function resizeCanvas() {
          var width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
          var height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx2d.scale(dpr, dpr);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        var w = canvas.width / dpr;
        var h = canvas.height / dpr;
        for (var p = 0; p < numParticles; p++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            radius: Math.random() * 2 + 1.2
          });
        }

        window.addEventListener('pointermove', function(e) {
          if (!canvas.parentElement) return;
          var rect = canvas.parentElement.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
          mouse.active = true;
        }, { passive: true });

        function renderFrame() {
          var curW = canvas.width / dpr;
          var curH = canvas.height / dpr;
          ctx2d.clearRect(0, 0, curW, curH);

          // Update & Draw Particles
          ctx2d.fillStyle = 'rgba(37, 99, 235, 0.45)';
          ctx2d.strokeStyle = 'rgba(37, 99, 235, 0.12)';
          ctx2d.lineWidth = 1;

          for (var i = 0; i < particles.length; i++) {
            var pt = particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            if (pt.x < 0 || pt.x > curW) pt.vx *= -1;
            if (pt.y < 0 || pt.y > curH) pt.vy *= -1;

            if (mouse.active) {
              var dx = mouse.x - pt.x;
              var dy = mouse.y - pt.y;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120 && dist > 0) {
                var force = (120 - dist) / 120;
                pt.x -= (dx / dist) * force * 1.5;
                pt.y -= (dy / dist) * force * 1.5;
              }
            }

            ctx2d.beginPath();
            ctx2d.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx2d.fill();

            // Connect nearby nodes
            for (var j = i + 1; j < particles.length; j++) {
              var pt2 = particles[j];
              var d = Math.hypot(pt.x - pt2.x, pt.y - pt2.y);
              if (d < 85) {
                ctx2d.beginPath();
                ctx2d.moveTo(pt.x, pt.y);
                ctx2d.lineTo(pt2.x, pt2.y);
                ctx2d.stroke();
              }
            }
          }
          frameRafId = requestAnimationFrame(renderFrame);
        }
        var frameRafId = null;
        function safeStartFrame() {
          if (typeof document !== 'undefined' && document.hidden) {
            frameRafId = null;
            return;
          }
          if (!frameRafId) {
            frameRafId = requestAnimationFrame(renderFrame);
          }
        }
        safeStartFrame();

        if (typeof document !== 'undefined') {
          document.addEventListener('visibilitychange', function() {
            if (!document.hidden && !frameRafId) {
              frameRafId = requestAnimationFrame(renderFrame);
            } else if (document.hidden && frameRafId) {
              cancelAnimationFrame(frameRafId);
              frameRafId = null;
            }
          });
        }
      }

      // 4. Scrollytelling Scene Observer
      var sceneCards = Array.from(document.querySelectorAll('.od-scene-card'));
      if (sceneCards.length > 0 && window.IntersectionObserver) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              sceneCards.forEach(function(c) { c.classList.remove('is-active'); });
              entry.target.classList.add('is-active');
            }
          });
        }, { threshold: 0.5 });
        sceneCards.forEach(function(card) { observer.observe(card); });
      }
    })();
  `;
}

/**
 * Compiles a PageAssemblySchema into a self-contained, standalone HTML5 document.
 * 100% Anti-XSS sanitized, 100% CSS-injection protected, and zero external runtime dependencies.
 *
 * @param {Record<string, any>} schema
 * @returns {string}
 */
function exportToStandaloneHtml(schema) {
  const normalized = normalizeSchema(schema);
  const meta = normalized.metadata || {};
  const theme = normalized.theme || DEFAULT_LUMINOUS_THEME;
  const nav = normalized.navigation;
  const hero = normalized.hero;
  const bento = normalized.bentoGrid;
  const scrolly = normalized.scrollytelling;
  const soundboard = normalized.soundboard;
  const footer = normalized.footer;

  const title = escapeHtml(meta.title || 'Luminous Experience');
  const desc = escapeHtml(meta.description || '');
  const lang = escapeHtml(meta.lang || 'en');
  const charset = escapeHtml(meta.charset || 'UTF-8');

  // Build Sections Safely
  let navHtml = '';
  if (nav) {
    const brandName = escapeHtml(nav.brandName || 'ANTIGRAVITY');
    const taglineHtml = nav.tagline
      ? `<span class="od-brand-tag">${escapeHtml(nav.tagline)}</span>`
      : '';
    const linksHtml = Array.isArray(nav.links)
      ? nav.links
          .map(
            (l) =>
              `<a href="${escapeHtml(sanitizeUrl(l.href))}"${
                l.target ? ` target="${escapeHtml(l.target)}"` : ''
              }>${escapeHtml(l.label)}</a>`
          )
          .join('')
      : '';
    const ctaHtml = nav.ctaButton
      ? `<a href="${escapeHtml(sanitizeUrl(nav.ctaButton.link))}" class="od-btn od-btn-accent od-nav-cta"${
          nav.ctaButton.haptic ? ' data-haptic="true"' : ''
        }>${escapeHtml(nav.ctaButton.text)}</a>`
      : '';

    navHtml = `
      <header class="od-nav${nav.glassHud ? ' od-glass-hud' : ''}">
        <div class="od-nav-inner">
          <div class="od-nav-brand">
            <span class="od-brand-name">${brandName}</span>
            ${taglineHtml}
          </div>
          <nav class="od-nav-links">
            ${linksHtml}
          </nav>
          ${ctaHtml}
        </div>
      </header>
    `;
  }

  let heroHtml = '';
  if (hero) {
    const badgesHtml = Array.isArray(hero.badges)
      ? `<div class="od-badge-row">${hero.badges
          .map((b) => `<span class="od-pill-badge">${escapeHtml(b)}</span>`)
          .join('')}</div>`
      : '';
    const headline = escapeHtml(hero.headline || '');
    const subheadline = hero.subheadline
      ? `<p class="od-hero-subheadline">${escapeHtml(hero.subheadline)}</p>`
      : '';
    const actionsHtml = Array.isArray(hero.ctaButtons)
      ? `<div class="od-hero-actions">${hero.ctaButtons
          .map(
            (btn) =>
              `<a href="${escapeHtml(sanitizeUrl(btn.link))}" class="od-btn ${
                btn.primary ? 'od-btn-accent' : 'od-btn-secondary'
              }"${btn.haptic ? ' data-haptic="true"' : ''}>${escapeHtml(btn.text)}</a>`
          )
          .join('')}</div>`
      : '';

    heroHtml = `
      <section class="od-hero-section" id="hero">
        <canvas class="od-hero-canvas" data-shader="${escapeHtml(
          hero.shaderType || 'particle-mesh'
        )}" data-particles="${escapeHtml(
      String(hero.particleCount || 140)
    )}" data-dpr="${escapeHtml(String(hero.dprCap || 2.0))}"></canvas>
        <div class="od-hero-content">
          ${badgesHtml}
          <h1 class="od-hero-headline">${headline}</h1>
          ${subheadline}
          ${actionsHtml}
        </div>
      </section>
    `;
  }

  let bentoHtml = '';
  if (bento) {
    const badgeHtml = bento.badge
      ? `<span class="od-pill-badge">${escapeHtml(bento.badge)}</span>`
      : '';
    const titleHtml = bento.title ? `<h2>${escapeHtml(bento.title)}</h2>` : '';
    const subtitleHtml = bento.subtitle ? `<p>${escapeHtml(bento.subtitle)}</p>` : '';
    const headerHtml =
      badgeHtml || titleHtml || subtitleHtml
        ? `<div class="od-section-header">${badgeHtml}${titleHtml}${subtitleHtml}</div>`
        : '';

    const cols = Math.max(1, Math.min(24, Number(bento.columns) || 12));
    const gap = sanitizeCssValue(bento.gap, '1.5rem');

    const cellsHtml = Array.isArray(bento.cellMatrix)
      ? bento.cellMatrix
          .map((cell) => {
            const idAttr = cell.id ? ` id="${escapeHtml(cell.id)}"` : '';
            const cSpan = Math.max(1, Math.min(cols, Number(cell.colSpan) || 4));
            const rSpan = Math.max(1, Number(cell.rowSpan) || 1);
            const spotlightAttr = cell.spotlight ? ' data-spotlight="true"' : '';
            const tiltAttr = cell.tilt ? ' data-tilt="true"' : '';
            const hapticAttr = cell.haptic ? ' data-haptic="true"' : '';

            const cellBadge = cell.badge
              ? `<span class="od-cell-badge">${escapeHtml(cell.badge)}</span>`
              : '';
            let statHtml = '';
            if (cell.statValue) {
              statHtml = `
                <div class="od-stat-box">
                  <div class="od-stat-number">${escapeHtml(cell.statValue)}</div>
                  ${
                    cell.statLabel
                      ? `<div class="od-stat-label">${escapeHtml(cell.statLabel)}</div>`
                      : ''
                  }
                </div>
              `;
            }
            const cellTitle = cell.title
              ? `<h3 class="od-card-title">${escapeHtml(cell.title)}</h3>`
              : '';
            const cellDesc =
              cell.subtitle || cell.content
                ? `<p class="od-card-desc">${escapeHtml(cell.subtitle || cell.content)}</p>`
                : '';

            return `
              <article class="od-bento-card"${idAttr} style="--col-span:${cSpan};--row-span:${rSpan};"${spotlightAttr}${tiltAttr}${hapticAttr}>
                <div class="od-spotlight-glow"></div>
                <div class="od-card-inner">
                  ${cellBadge}
                  ${statHtml}
                  ${cellTitle}
                  ${cellDesc}
                </div>
              </article>
            `;
          })
          .join('')
      : '';

    bentoHtml = `
      <section class="od-bento-section" id="telemetry">
        ${headerHtml}
        <div class="od-bento-grid" style="--bento-columns:${cols};--bento-gap:${gap};">
          ${cellsHtml}
        </div>
      </section>
    `;
  }

  let scrollyHtml = '';
  if (scrolly) {
    const titleHtml = scrolly.title ? `<h2>${escapeHtml(scrolly.title)}</h2>` : '';
    const subtitleHtml = scrolly.subtitle ? `<p>${escapeHtml(scrolly.subtitle)}</p>` : '';
    const headerHtml =
      titleHtml || subtitleHtml
        ? `<div class="od-section-header">${titleHtml}${subtitleHtml}</div>`
        : '';

    const vh = Math.max(100, Number(scrolly.pinnedDurationVh) || 200);
    const scenesHtml = Array.isArray(scrolly.scenes)
      ? scrolly.scenes
          .map((scene, idx) => {
            const activeCls = idx === 0 ? ' is-active' : '';
            const idAttr = scene.id ? ` data-scene-id="${escapeHtml(scene.id)}"` : '';
            const badgeHtml = scene.badge
              ? `<span class="od-scene-badge">${escapeHtml(scene.badge)}</span>`
              : '';
            const sceneTitle = `<h4>${escapeHtml(scene.title || `Scene ${idx + 1}`)}</h4>`;
            const sceneDesc = scene.description
              ? `<p class="od-scene-desc">${escapeHtml(scene.description)}</p>`
              : '';
            const metricHtml = scene.metric
              ? `<div class="od-scene-metric"><strong>${escapeHtml(
                  scene.metric.value
                )}</strong><span>${escapeHtml(scene.metric.label)}</span></div>`
              : '';

            return `
              <div class="od-scene-card${activeCls}"${idAttr}>
                ${badgeHtml}
                ${sceneTitle}
                ${sceneDesc}
                ${metricHtml}
              </div>
            `;
          })
          .join('')
      : '';

    scrollyHtml = `
      <section class="od-scrolly-section" id="scrolly">
        ${headerHtml}
        <div class="od-scrolly-stage" style="--pinned-duration:${vh}vh;">
          <div class="od-scrolly-scenes">
            ${scenesHtml}
          </div>
        </div>
      </section>
    `;
  }

  let soundboardHtml = '';
  if (soundboard && soundboard.enabled !== false) {
    soundboardHtml = `
      <section class="od-soundboard-section" id="soundboard">
        <div class="od-section-header">
          <h2>WebAudio Haptics & Tactile Soundboard</h2>
          <p>Precision acoustic feedback synthesized live via Web Audio API. Zero asset downloads.</p>
        </div>
        <div class="od-soundboard-grid">
          <div class="od-sound-pad" data-haptic="click" data-spotlight="true">
            <strong>Tactile Click</strong>
            <span>1.2 kHz sine transient</span>
          </div>
          <div class="od-sound-pad" data-haptic="pop" data-spotlight="true">
            <strong>Elastic Pop</strong>
            <span>Frequency glide chirp</span>
          </div>
          <div class="od-sound-pad" data-haptic="chime" data-spotlight="true">
            <strong>Success Chime</strong>
            <span>Triad harmonic chord</span>
          </div>
          <div class="od-sound-pad" data-haptic="switch" data-spotlight="true">
            <strong>Mechanical Switch</strong>
            <span>Dual-phase latching click</span>
          </div>
        </div>
      </section>
    `;
  }

  let footerHtml = '';
  if (footer) {
    const copyHtml = `<p class="od-footer-copy">${escapeHtml(
      footer.copyright || '© 2026 Antigravity'
    )}</p>`;
    const taglineHtml = footer.tagline
      ? `<p class="od-footer-tag">${escapeHtml(footer.tagline)}</p>`
      : '';
    const badgesHtml = Array.isArray(footer.badges)
      ? `<div class="od-footer-badges">${footer.badges
          .map((b) => `<span class="od-pill-badge">${escapeHtml(b)}</span>`)
          .join('')}</div>`
      : '';

    footerHtml = `
      <footer class="od-footer">
        <div class="od-footer-inner">
          ${copyHtml}
          ${taglineHtml}
          ${badgesHtml}
        </div>
      </footer>
    `;
  }

  const cssContent = buildStandaloneCss(theme);
  const jsContent = buildStandaloneScript(normalized);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="${charset}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${desc ? `<meta name="description" content="${desc}">` : ''}
  <style>
${cssContent}
  </style>
</head>
<body>
${navHtml}
${heroHtml}
${bentoHtml}
${scrollyHtml}
${soundboardHtml}
${footerHtml}
  <script>
${jsContent}
  </script>
</body>
</html>`;
}

// =============================================================================
// 7. COMPREHENSIVE SAFEDOMASSEMBLER ENGINE EXPORT
// =============================================================================

const SafeDOMAssembler = {
  version: '2.0.0-round3',
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
};

// Universal browser global attachment
if (isBrowser()) {
  /** @type {any} */ (window).SafeDOMAssembler = SafeDOMAssembler;
}




  return {
    version: '2.0.0-round3',
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
    SafeDOMAssembler,
    default: SafeDOMAssembler
  };
});
