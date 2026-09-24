/**
 * ⚡ STRICT SANITIZATION PIPELINE (UMD / Standalone Global Bundle)
 * ===============================================================
 * Universal standalone UMD/Global build of StrictSanitizer for direct <script src="..."> tags,
 * CommonJS require(), AMD define(), legacy browsers, Electron, and local file:// protocols.
 *
 * Modules:
 *  - SafeStyleSanitizer
 *  - SafeDOMAssembler
 *  - SafeSchemaMerger
 *  - ContractFreezer
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.StrictSanitizer = exports;
    global.SafeStyleSanitizer = exports.SafeStyleSanitizer;
    global.SafeDOMAssembler = exports.SafeDOMAssembler;
    global.SafeSchemaMerger = exports.SafeSchemaMerger;
    global.ContractFreezer = exports.ContractFreezer;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

  function isDomNode(val) {
    if (val === null || typeof val !== 'object') return false;
    if (typeof Node !== 'undefined' && val instanceof Node) return true;
    return typeof val.nodeType === 'number' &&
      (typeof val.appendChild === 'function' ||
       typeof val.setAttribute === 'function' ||
       typeof val.tagName === 'string');
  }

  function isWindow(val) {
    if (val === null || typeof val !== 'object') return false;
    if (typeof window !== 'undefined' && val === window) return true;
    if (typeof globalThis !== 'undefined' && val === globalThis) return true;
    return val.window === val;
  }

  function isPlainObject(val) {
    if (val === null || typeof val !== 'object') return false;
    if (isDomNode(val) || isWindow(val)) return false;
    const proto = Object.getPrototypeOf(val);
    return proto === null || proto === Object.prototype;
  }

  function toKebabCase(str) {
    if (!str) return '';
    if (str.startsWith('--')) {
      return str; // CSS custom variables are case-sensitive
    }
    return str
      .replace(/^ms-/, '-ms-')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
  }

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

  function sanitizeUrl(rawUrl, fallback) {
    fallback = fallback || '#';
    if (!rawUrl || typeof rawUrl !== 'string') return fallback;
    const decoded = rawUrl
      .replace(/&#x([0-9a-fA-F]+);?/g, function (_, hex) { return String.fromCharCode(parseInt(hex, 16)); })
      .replace(/&#([0-9]+);?/g, function (_, dec) { return String.fromCharCode(parseInt(dec, 10)); })
      .replace(/&colon;/gi, ':')
      .replace(/&tab;/gi, '')
      .replace(/&newline;/gi, '');
    const clean = decoded.trim().replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '');
    if (/^(?:javascript|data|vbscript|blob):/i.test(clean)) {
      return fallback;
    }
    return clean || fallback;
  }

  const SAFE_CSS_PROPERTIES = new Set([
    'width', 'min-width', 'max-width', 'inline-size', 'min-inline-size', 'max-inline-size',
    'height', 'min-height', 'max-height', 'block-size', 'min-block-size', 'max-block-size',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'margin-inline', 'margin-inline-start', 'margin-inline-end',
    'margin-block', 'margin-block-start', 'margin-block-end',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'padding-inline', 'padding-inline-start', 'padding-inline-end',
    'padding-block', 'padding-block-start', 'padding-block-end',
    'box-sizing', 'overflow', 'overflow-x', 'overflow-y', 'overflow-wrap', 'display',
    'border', 'border-width', 'border-style', 'border-color', 'border-radius',
    'border-top', 'border-right', 'border-bottom', 'border-left',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
    'border-collapse', 'border-spacing',
    'outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
    'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
    'justify-content', 'justify-items', 'justify-self',
    'align-items', 'align-content', 'align-self',
    'order', 'gap', 'row-gap', 'column-gap',
    'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
    'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
    'grid-column', 'grid-column-start', 'grid-column-end',
    'grid-row', 'grid-row-start', 'grid-row-end', 'grid-area',
    'place-content', 'place-items', 'place-self',
    'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant',
    'line-height', 'letter-spacing',
    'text-align', 'text-decoration', 'text-decoration-line', 'text-decoration-color',
    'text-decoration-style', 'text-decoration-thickness',
    'text-transform', 'text-overflow', 'text-indent', 'text-shadow',
    'white-space', 'word-break', 'word-wrap', 'vertical-align', 'color',
    'background', 'background-color', 'background-image', 'background-clip',
    'background-origin', 'background-position', 'background-repeat', 'background-size', 'background-attachment',
    'opacity', 'box-shadow', 'filter', 'backdrop-filter', 'mix-blend-mode',
    'accent-color', 'caret-color',
    'transform', 'transform-origin', 'perspective', 'perspective-origin', 'backface-visibility',
    'transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
    'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay',
    'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state',
    'will-change',
    'position', 'top', 'right', 'bottom', 'left', 'z-index',
    'inset', 'inset-inline', 'inset-inline-start', 'inset-inline-end',
    'inset-block', 'inset-block-start', 'inset-block-end',
    'cursor', 'pointer-events', 'user-select', 'visibility',
    'aspect-ratio', 'isolation', 'content-visibility', 'contain',
    'object-fit', 'object-position', 'clip-path',
  ]);

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

  function isSafeCssProperty(prop) {
    if (!prop || typeof prop !== 'string') return false;
    const kebab = toKebabCase(prop.trim());
    if (kebab === '__proto__' || kebab === 'constructor' || kebab === 'prototype') return false;
    if (kebab.startsWith('--') && /^--[a-zA-Z0-9\-_]+$/.test(kebab)) return true;
    return SAFE_CSS_PROPERTIES.has(kebab.toLowerCase());
  }

  function clampZIndex(val) {
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

  function sanitizeStyleValue(prop, val) {
    if (val === null || val === undefined) return null;
    const propKebab = toKebabCase(String(prop).trim());

    if (!isSafeCssProperty(propKebab)) return null;

    const strVal = String(val).trim();
    if (!strVal) return null;

    for (const pattern of FORBIDDEN_CSS_PATTERNS) {
      if (pattern.test(strVal)) return null;
    }

    if (propKebab === 'position') {
      const normPos = strVal.toLowerCase().replace(/\s+/g, '');
      if (normPos.includes('fixed')) return null;
      const ALLOWED_POSITIONS = new Set(['static', 'relative', 'absolute', 'sticky']);
      return ALLOWED_POSITIONS.has(normPos) ? normPos : null;
    }

    if (propKebab === 'z-index') {
      return clampZIndex(strVal);
    }

    return strVal;
  }

  function sanitizeStyleObject(styles) {
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

  function applySafeStyles(element, styles) {
    if (!element || !element.style || typeof element.style.setProperty !== 'function') return;
    if (!styles || typeof styles !== 'object') return;

    for (const [rawProp, rawVal] of Object.entries(styles)) {
      if (rawProp === '__proto__' || rawProp === 'constructor' || rawProp === 'prototype') continue;
      const propKebab = toKebabCase(rawProp);
      const safeVal = sanitizeStyleValue(propKebab, rawVal);
      if (safeVal !== null) {
        element.style.setProperty(propKebab, safeVal);
      }
    }
  }

  const SafeStyleSanitizer = {
    SAFE_CSS_PROPERTIES,
    isSafeCssProperty,
    clampZIndex,
    sanitizeStyleValue,
    sanitizeStyleObject,
    applySafeStyles,
  };

  const DOM_CLOBBERING_PREFIX = 'gvs_cmp_';

  function scopeIdentifier(idOrName) {
    if (idOrName === null || idOrName === undefined) return '';
    const str = String(idOrName).trim();
    if (!str) return '';
    if (str.startsWith(DOM_CLOBBERING_PREFIX)) return str;
    return DOM_CLOBBERING_PREFIX + str;
  }

  function unscopeIdentifier(scopedId) {
    if (scopedId === null || scopedId === undefined) return '';
    const str = String(scopedId);
    return str.startsWith(DOM_CLOBBERING_PREFIX) ? str.slice(DOM_CLOBBERING_PREFIX.length) : str;
  }

  const SAFE_HTML_TAGS = new Set([
    'a', 'abbr', 'address', 'article', 'aside', 'b', 'bdi', 'bdo', 'blockquote',
    'br', 'button', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'dd',
    'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure',
    'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img',
    'ins', 'kbd', 'li', 'main', 'mark', 'nav', 'ol', 'p', 'pre', 'q', 'rp', 'rt',
    'ruby', 's', 'samp', 'section', 'small', 'span', 'strong', 'sub', 'summary',
    'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'tr', 'u',
    'ul', 'var', 'wbr',
    'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text', 'tspan',
  ]);

  const FORBIDDEN_HTML_TAGS = new Set([
    'script', 'style', 'iframe', 'object', 'embed', 'link', 'base', 'meta',
    'applet', 'frame', 'frameset', 'form', 'input', 'textarea', 'select', 'option',
  ]);

  function sanitizeHtml(html, options) {
    options = options || {};
    if (!html || typeof html !== 'string') return '';

    let sanitized = html;
    // 0. Remove HTML comments
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
    // Strip trailing unclosed dangerous start tags
    sanitized = sanitized.replace(/<\s*(?:script|iframe|object|embed|applet)\b[^>]*$/gi, '');

    const tagRegex = /<\/?([a-zA-Z0-9\-:]+)([^>]*)>/g;
    sanitized = sanitized.replace(tagRegex, function (match, tagName, rawAttrs) {
      const lowerTag = tagName.toLowerCase();
      if (match.startsWith('</')) {
        if (FORBIDDEN_HTML_TAGS.has(lowerTag)) return '';
        return SAFE_HTML_TAGS.has(lowerTag) ? '</' + lowerTag + '>' : '';
      }
      if (FORBIDDEN_HTML_TAGS.has(lowerTag)) return '';
      if (!SAFE_HTML_TAGS.has(lowerTag)) return '';

      const attrRegex = /([a-zA-Z0-9\-_:]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/g;
      let attrMatch;
      const cleanAttrs = [];

      while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
        const rawAttrName = attrMatch[1];
        if (!rawAttrName) continue;
        const attrName = rawAttrName.toLowerCase();
        const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

        if (attrName.startsWith('on')) continue;

        if (attrName === 'id' || attrName === 'name') {
          cleanAttrs.push(attrName + '="' + escapeHtml(scopeIdentifier(attrVal)) + '"');
          continue;
        }

        if (attrName === 'href' || attrName === 'src' || attrName === 'action' || attrName === 'poster') {
          cleanAttrs.push(attrName + '="' + escapeHtml(sanitizeUrl(attrVal, '#')) + '"');
          continue;
        }

        if (attrName === 'target' && attrVal === '_blank') {
          cleanAttrs.push('target="_blank"');
          cleanAttrs.push('rel="noopener noreferrer"');
          continue;
        }

        if (attrName === 'style') {
          const declarations = attrVal.split(';');
          const safeDecls = [];
          for (const decl of declarations) {
            const colonIdx = decl.indexOf(':');
            if (colonIdx === -1) continue;
            const prop = decl.slice(0, colonIdx).trim();
            const val = decl.slice(colonIdx + 1).trim();
            const safeVal = sanitizeStyleValue(prop, val);
            if (safeVal !== null) {
              safeDecls.push(toKebabCase(prop) + ':' + safeVal);
            }
          }
          if (safeDecls.length > 0) {
            cleanAttrs.push('style="' + escapeHtml(safeDecls.join('; ')) + '"');
          }
          continue;
        }

        if (
          attrName.startsWith('data-') ||
          attrName.startsWith('aria-') ||
          ['class', 'alt', 'title', 'role', 'width', 'height', 'tabindex', 'viewbox', 'fill', 'stroke', 'd'].includes(attrName)
        ) {
          cleanAttrs.push(attrName + '="' + escapeHtml(attrVal) + '"');
        }
      }

      const attrStr = cleanAttrs.length > 0 ? ' ' + cleanAttrs.join(' ') : '';
      const isSelfClosing = match.endsWith('/>') || ['img', 'br', 'hr'].includes(lowerTag);
      return isSelfClosing ? '<' + lowerTag + attrStr + ' />' : '<' + lowerTag + attrStr + '>';
    });

    return sanitized;
  }

  function parseHtmlToElements(html) {
    const root = createSafeElement('div');
    const cleanHtml = sanitizeHtml(html);

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

  function createSafeElement(tagName) {
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
          get: function () { return unscopeIdentifier(el.getAttribute('id') || ''); },
          set: function (v) { origSetAttr('id', scopeIdentifier(v)); },
        });
        Object.defineProperty(el, 'name', {
          configurable: true,
          get: function () { return unscopeIdentifier(el.getAttribute('name') || ''); },
          set: function (v) { origSetAttr('name', scopeIdentifier(v)); },
        });
      } catch (e) {}
      return el;
    }

    const attributes = new Map();
    const children = [];
    const styleProps = new Map();
    const eventListeners = new Map();

    const element = {
      tagName: tagName.toUpperCase(),
      nodeType: 1,
      children: children,
      parentNode: null,
      style: {
        setProperty: function (prop, val) {
          styleProps.set(toKebabCase(prop), String(val));
        },
        getPropertyValue: function (prop) {
          return styleProps.get(toKebabCase(prop)) || '';
        },
        removeProperty: function (prop) {
          styleProps.delete(toKebabCase(prop));
        },
      },
      dataset: {},
      classList: {
        _classes: new Set(),
        add: function () {
          for (let i = 0; i < arguments.length; i++) element.classList._classes.add(arguments[i]);
        },
        remove: function () {
          for (let i = 0; i < arguments.length; i++) element.classList._classes.delete(arguments[i]);
        },
        contains: function (c) {
          return element.classList._classes.has(c);
        },
      },
      setAttribute: function (name, value) {
        const lower = name.toLowerCase();
        const finalVal = (lower === 'id' || lower === 'name') ? scopeIdentifier(value) : String(value);
        attributes.set(lower, finalVal);
        if (lower.startsWith('data-')) {
          const camel = lower.slice(5).replace(/-([a-z])/g, function (_, l) { return l.toUpperCase(); });
          element.dataset[camel] = finalVal;
        }
      },
      getAttribute: function (name) {
        return attributes.get(name.toLowerCase()) || null;
      },
      removeAttribute: function (name) {
        const lower = name.toLowerCase();
        attributes.delete(lower);
        if (lower.startsWith('data-')) {
          const camel = lower.slice(5).replace(/-([a-z])/g, function (_, l) { return l.toUpperCase(); });
          delete element.dataset[camel];
        }
      },
      hasAttribute: function (name) {
        return attributes.has(name.toLowerCase());
      },
      appendChild: function (child) {
        children.push(child);
        if (child && typeof child === 'object') child.parentNode = element;
        return child;
      },
      removeChild: function (child) {
        const idx = children.indexOf(child);
        if (idx !== -1) {
          children.splice(idx, 1);
          if (child && typeof child === 'object') child.parentNode = null;
        }
        return child;
      },
      addEventListener: function (type, listener) {
        if (!eventListeners.has(type)) eventListeners.set(type, new Set());
        eventListeners.get(type).add(listener);
      },
      removeEventListener: function (type, listener) {
        if (eventListeners.has(type)) eventListeners.get(type).delete(listener);
      },
      get textContent() {
        return children
          .map(function (c) { return typeof c === 'string' ? c : c.textContent || ''; })
          .join('');
      },
      set textContent(text) {
        children.length = 0;
        children.push(String(text));
      },
      get innerHTML() {
        return children
          .map(function (c) { return typeof c === 'string' ? escapeHtml(c) : c.outerHTML || ''; })
          .join('');
      },
      set innerHTML(htmlStr) {
        children.length = 0;
        const parsedNodes = parseHtmlToElements(htmlStr);
        parsedNodes.forEach(function (node) {
          element.appendChild(node);
        });
      },
      get outerHTML() {
        const tag = tagName.toLowerCase();
        const attrs = [];
        for (const [k, v] of attributes.entries()) {
          attrs.push(escapeHtml(k) + '="' + escapeHtml(v) + '"');
        }
        if (element.classList._classes.size > 0) {
          attrs.push('class="' + escapeHtml(Array.from(element.classList._classes).join(' ')) + '"');
        }
        if (styleProps.size > 0) {
          const styles = Array.from(styleProps.entries())
            .map(function (pair) { return pair[0] + ':' + pair[1]; })
            .join(';');
          attrs.push('style="' + escapeHtml(styles) + '"');
        }
        const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
        if (['img', 'br', 'hr', 'input'].includes(tag)) {
          return '<' + tag + attrStr + ' />';
        }
        return '<' + tag + attrStr + '>' + element.innerHTML + '</' + tag + '>';
      },
      querySelector: function (selector) {
        const all = element.querySelectorAll(selector);
        return all.length > 0 ? all[0] : null;
      },
      querySelectorAll: function (selector) {
        const results = [];
        const matchSelector = function (node, sel) {
          if (!node || typeof node !== 'object') return false;
          if (sel.startsWith('#')) {
            const expectedId = sel.slice(1);
            const actualId = node.getAttribute ? node.getAttribute('id') : null;
            return actualId === expectedId || actualId === scopeIdentifier(expectedId);
          }
          if (sel.startsWith('.')) {
            return node.classList && node.classList.contains(sel.slice(1));
          }
          return node.tagName && node.tagName.toLowerCase() === sel.toLowerCase();
        };

        const traverse = function (node) {
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
      attachShadow: function (init) {
        init = init || { mode: 'open' };
        const shadow = createSafeElement('div');
        shadow.mode = init.mode || 'open';
        shadow.host = element;
        element.shadowRoot = shadow;
        return shadow;
      },
    };

    return element;
  }

  function mountInShadowRoot(hostElement, content, options) {
    options = options || {};
    if (!hostElement) throw new Error('mountInShadowRoot requires a valid hostElement');

    let shadowRoot = hostElement.shadowRoot;
    if (!shadowRoot) {
      if (typeof hostElement.attachShadow === 'function') {
        shadowRoot = hostElement.attachShadow({ mode: 'open' });
      } else {
        shadowRoot = createSafeElement('div');
        shadowRoot.mode = 'open';
        shadowRoot.host = hostElement;
        hostElement.shadowRoot = shadowRoot;
      }
    }

    if (options.styles && typeof options.styles === 'string') {
      const styleEl = createSafeElement('style');
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

    if (typeof content === 'string') {
      const sanitizedHtml = sanitizeHtml(content);
      const container = createSafeElement('div');
      container.innerHTML = sanitizedHtml;
      shadowRoot.appendChild(container);
    } else if (content && typeof content === 'object') {
      shadowRoot.appendChild(content);
    }

    return { shadowRoot: shadowRoot, host: hostElement };
  }

  const SafeDOMAssembler = {
    DOM_CLOBBERING_PREFIX: DOM_CLOBBERING_PREFIX,
    scopeIdentifier: scopeIdentifier,
    unscopeIdentifier: unscopeIdentifier,
    sanitizeHtml: sanitizeHtml,
    parseHtmlToElements: parseHtmlToElements,
    createSafeElement: createSafeElement,
    mountInShadowRoot: mountInShadowRoot,
  };

  function safeMerge() {
    const sources = Array.prototype.slice.call(arguments);
    const activeStack = new Set();

    function mergeInternal(target, source) {
      if (!source || typeof source !== 'object') return target;
      if (activeStack.has(source)) return target;
      activeStack.add(source);

      try {
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
          const val = source[key];

          if (Array.isArray(val)) {
            target[key] = val.map(function (item) {
              if (Array.isArray(item)) return item.slice();
              if (isPlainObject(item)) {
                if (activeStack.has(item)) return Object.create(null);
                const nested = Object.create(null);
                return mergeInternal(nested, item);
              }
              return item;
            });
          } else if (isPlainObject(val)) {
            if (!isPlainObject(target[key])) target[key] = Object.create(null);
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
    for (let i = 0; i < sources.length; i++) {
      const src = sources[i];
      if (src && typeof src === 'object') mergeInternal(result, src);
    }

    return result;
  }

  const safeDeepMerge = safeMerge;

  const SafeSchemaMerger = {
    safeMerge: safeMerge,
    safeDeepMerge: safeDeepMerge,
    isPlainObject: isPlainObject,
  };

  function deepFreeze(obj, visited) {
    visited = visited || new WeakSet();
    if (obj === null || typeof obj !== 'object') return obj;
    if (visited.has(obj)) return obj;
    if (isDomNode(obj) || isWindow(obj)) return obj;
    if (!Array.isArray(obj) && !isPlainObject(obj)) return obj;

    visited.add(obj);

    const propNames = typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function'
      ? Reflect.ownKeys(obj)
      : Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
      const name = propNames[i];
      if (name === '__proto__' || name === 'constructor' || name === 'prototype') continue;
      try {
        const val = obj[name];
        if (val !== null && typeof val === 'object') deepFreeze(val, visited);
      } catch (e) {}
    }

    return Object.freeze(obj);
  }

  const ContractFreezer = {
    deepFreeze: deepFreeze,
    isPlainObject: isPlainObject,
    isDomNode: isDomNode,
    isWindow: isWindow,
  };

  const StrictSanitizer = {
    version: '2.0.0-round4',
    SafeStyleSanitizer: SafeStyleSanitizer,
    SAFE_CSS_PROPERTIES: SAFE_CSS_PROPERTIES,
    isSafeCssProperty: isSafeCssProperty,
    clampZIndex: clampZIndex,
    sanitizeStyleValue: sanitizeStyleValue,
    sanitizeStyleObject: sanitizeStyleObject,
    applySafeStyles: applySafeStyles,
    SafeDOMAssembler: SafeDOMAssembler,
    DOM_CLOBBERING_PREFIX: DOM_CLOBBERING_PREFIX,
    scopeIdentifier: scopeIdentifier,
    unscopeIdentifier: unscopeIdentifier,
    sanitizeHtml: sanitizeHtml,
    parseHtmlToElements: parseHtmlToElements,
    createSafeElement: createSafeElement,
    mountInShadowRoot: mountInShadowRoot,
    SafeSchemaMerger: SafeSchemaMerger,
    safeMerge: safeMerge,
    safeDeepMerge: safeDeepMerge,
    ContractFreezer: ContractFreezer,
    deepFreeze: deepFreeze,
    isBrowser: isBrowser,
    isPlainObject: isPlainObject,
    isDomNode: isDomNode,
    isWindow: isWindow,
    toKebabCase: toKebabCase,
    escapeHtml: escapeHtml,
    sanitizeUrl: sanitizeUrl,
  };

  return StrictSanitizer;
});
