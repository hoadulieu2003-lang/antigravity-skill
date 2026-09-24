/**
 * ⚡ CONSTRUCTABLE MUTATION ENGINE & FASTDOM PHASE SCHEDULER
 * ==========================================================
 * High-performance (60/120 FPS) CSSOM mutation engine and two-phase layout scheduler
 * for real-time design systems, visual token editing, and interactive UI controls.
 *
 * Core Pillars:
 *  1. ConstructableMutationEngine:
 *     - Direct CSSOM manipulation via CSSStyleSheet() & adoptedStyleSheets when supported.
 *     - Direct property mutation on CSSStyleRule instances via rule.style.setProperty(name, val).
 *     - Coalesced batching via requestAnimationFrame with reusable DirtyBuffer (Zero-GC pressure).
 *     - Safe fallback for legacy browsers or unsupported scopes (targetScope.style or injected <style>).
 *  2. LayoutPhaseCoordinator (FastDOM 2-Phase Scheduling):
 *     - Strict separation of READ phase and WRITE phase, flushed sequentially within a single rAF frame.
 *     - 100% Layout Thrashing elimination.
 *     - Element CSS isolation helper: applies 'contain: layout size style' during active mutations.
 *  3. TokenSyncCoordinator:
 *     - Bidirectional token synchronization: Slider event -> 60/120 FPS CSSOM mutation -> 50ms debounced AST store.
 *     - Transaction Reentrancy Lock: Distinguishes 'SLIDER' | 'CODE_EDITOR' | 'AST_SYNC' to prevent echo loops.
 *
 * Zero external dependencies (0 KB runtime assets).
 * SSR-safe: 100% compatible with Node.js, Vite, React, Vue, Next.js, and browser script tags.
 *
 * Author: Antigravity 2.0 Open Design System
 * License: Apache-2.0
 */

// =============================================================================
// 0. ENVIRONMENT & UTILITY HELPERS
// =============================================================================

export function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Universal requestAnimationFrame abstraction with graceful fallback for Node.js / SSR.
 */
export function requestFrame(callback) {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback);
  }
  if (typeof globalThis !== 'undefined' && typeof globalThis.requestAnimationFrame === 'function') {
    return globalThis.requestAnimationFrame(callback);
  }
  return setTimeout(function () {
    callback(Date.now());
  }, 16);
}

/**
 * Universal cancelAnimationFrame abstraction.
 */
export function cancelFrame(id) {
  if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    return window.cancelAnimationFrame(id);
  }
  if (typeof globalThis !== 'undefined' && typeof globalThis.cancelAnimationFrame === 'function') {
    return globalThis.cancelAnimationFrame(id);
  }
  clearTimeout(id);
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Feature detection for Constructable Stylesheets and adoptedStyleSheets.
 */
export function hasAdoptedStyleSheetsSupport(targetScope) {
  if (typeof CSSStyleSheet === 'undefined') {
    return false;
  }
  // Check if constructor works
  try {
    new CSSStyleSheet();
  } catch (e) {
    return false;
  }
  if (targetScope) {
    return 'adoptedStyleSheets' in targetScope && Boolean(targetScope.adoptedStyleSheets);
  }
  if (isBrowser() && 'adoptedStyleSheets' in document) {
    return Boolean(document.adoptedStyleSheets);
  }
  return false;
}

// =============================================================================
// 1. REUSABLE DIRTY BUFFER (ZERO-GC POOL)
// =============================================================================

/**
 * Zero-GC Dirty Entry holding a property value and priority.
 * Reused in-place across frames without allocating new objects.
 */
export class DirtyEntry {
  constructor() {
    this.value = '';
    this.priority = '';
    this.isDirty = false;
  }

  set(value, priority = '') {
    this.value = value;
    this.priority = priority;
    this.isDirty = true;
  }

  clear() {
    this.isDirty = false;
  }
}

/**
 * Reusable two-level Map buffer: Selector -> Property -> DirtyEntry.
 * Prevents garbage collection churn during high-frequency (60/120 Hz) event streams.
 */
export class DirtyBufferPool {
  constructor() {
    /** @type {Map<string, Map<string, DirtyEntry>>} */
    this.buffer = new Map();
    this.dirtyCount = 0;
  }

  /**
   * Set a dirty property mutation for a given selector.
   */
  set(selector, property, value, priority = '') {
    let propMap = this.buffer.get(selector);
    if (!propMap) {
      propMap = new Map();
      this.buffer.set(selector, propMap);
    }

    let entry = propMap.get(property);
    if (!entry) {
      entry = new DirtyEntry();
      propMap.set(property, entry);
    }

    if (!entry.isDirty) {
      this.dirtyCount++;
    }
    entry.set(value, priority);
  }

  /**
   * Checks whether the buffer has any pending dirty entries.
   */
  hasDirty() {
    return this.dirtyCount > 0;
  }

  /**
   * Clears dirty flags without removing map keys to maintain pre-allocated capacity.
   */
  resetDirtyFlags() {
    this.dirtyCount = 0;
    for (const propMap of this.buffer.values()) {
      for (const entry of propMap.values()) {
        entry.isDirty = false;
      }
    }
  }

  /**
   * Completely clears the buffer.
   */
  clear() {
    this.buffer.clear();
    this.dirtyCount = 0;
  }
}

// =============================================================================
// 2. CONSTRUCTABLE MUTATION ENGINE
// =============================================================================

/**
 * High-performance CSSOM mutation engine utilizing Constructable Stylesheets
 * and direct CSSStyleRule property sets with coalesced rAF batching.
 */
export class ConstructableMutationEngine {
  /**
   * @param {Object} [options]
   * @param {Document|ShadowRoot|HTMLElement} [options.scope] Target document, shadow root or element
   * @param {string} [options.styleSheetId] Identifier for fallback style element
   * @param {boolean} [options.autoAdopt] Whether to automatically adopt the stylesheet
   * @param {string} [options.defaultSelector] Default selector for CSS rules (default ':root')
   * @param {LayoutPhaseCoordinator} [options.coordinator] Optional shared layout coordinator
   */
  constructor(options = {}) {
    this.scope = options.scope || (isBrowser() ? document : null);
    this.styleSheetId = options.styleSheetId || 'antigravity-constructable-styles';
    this.autoAdopt = options.autoAdopt !== false;
    this.defaultSelector = options.defaultSelector || ':root';
    this.coordinator = options.coordinator || null;

    /** @type {CSSStyleSheet|null} */
    this.styleSheet = null;
    /** @type {Map<string, CSSStyleRule>} */
    this.ruleMap = new Map();
    /** @type {HTMLStyleElement|null} */
    this.fallbackStyleElement = null;

    // Zero-GC dirty buffer for coalescing mutations
    this.dirtyBuffer = new DirtyBufferPool();
    // Element-specific dirty buffer: Map<HTMLElement, Map<string, DirtyEntry>>
    /** @type {Map<any, Map<string, DirtyEntry>>} */
    this.elementDirtyBuffer = new Map();
    this.elementDirtyCount = 0;

    this.rafScheduled = false;
    this.rafHandle = null;
    this._supportsAdopted = hasAdoptedStyleSheetsSupport(this.scope);

    // Initialize stylesheet if in supported environment
    this._initializeEngine();
  }

  /**
   * Returns whether adoptedStyleSheets is supported in the current environment & scope.
   */
  isAdoptedStyleSheetsSupported() {
    return this._supportsAdopted;
  }

  /**
   * Get or initialize the internal CSSStyleSheet.
   */
  _initializeEngine() {
    if (!this.scope) return;

    if (this._supportsAdopted) {
      try {
        this.styleSheet = new CSSStyleSheet();
        if (this.autoAdopt && 'adoptedStyleSheets' in this.scope) {
          // Adopt cleanly without duplicating
          const current = this.scope.adoptedStyleSheets || [];
          if (!current.includes(this.styleSheet)) {
            this.scope.adoptedStyleSheets = [...current, this.styleSheet];
          }
        }
      } catch (err) {
        this._supportsAdopted = false;
        this._initFallbackStyle();
      }
    } else {
      this._initFallbackStyle();
    }
  }

  /**
   * Initialize fallback <style> tag if adoptedStyleSheets is unavailable.
   */
  _initFallbackStyle() {
    if (!this.scope) return;

    // Check if target is a document or element
    const doc = this.scope.ownerDocument || (this.scope.nodeType === 9 ? this.scope : (isBrowser() ? document : null));
    if (!doc || !doc.head) return;

    let el = typeof doc.getElementById === 'function' ? doc.getElementById(this.styleSheetId) : null;
    if (!el && typeof doc.createElement === 'function') {
      el = doc.createElement('style');
      el.id = this.styleSheetId;
      if (typeof el.setAttribute === 'function') {
        el.setAttribute('data-constructable-fallback', 'true');
      }
      doc.head.appendChild(el);
    }
    this.fallbackStyleElement = el;
  }

  /**
   * Locates or creates a CSSStyleRule for a specific selector inside the active stylesheet.
   * @param {string} selector
   * @returns {CSSStyleRule|null}
   */
  getOrCreateRule(selector = this.defaultSelector) {
    if (this.ruleMap.has(selector)) {
      return this.ruleMap.get(selector);
    }

    if (this.styleSheet && typeof this.styleSheet.insertRule === 'function') {
      try {
        const index = this.styleSheet.cssRules ? this.styleSheet.cssRules.length : 0;
        this.styleSheet.insertRule(`${selector} {}`, index);
        const rule = this.styleSheet.cssRules[index];
        if (rule) {
          this.ruleMap.set(selector, rule);
          return rule;
        }
      } catch (err) {
        // Selector might need escaping or sheet threw error
      }
    }

    // Fallback to <style> element's sheet if available
    if (this.fallbackStyleElement && this.fallbackStyleElement.sheet) {
      try {
        const sheet = this.fallbackStyleElement.sheet;
        const index = sheet.cssRules ? sheet.cssRules.length : 0;
        sheet.insertRule(`${selector} {}`, index);
        const rule = sheet.cssRules[index];
        if (rule) {
          this.ruleMap.set(selector, rule);
          return rule;
        }
      } catch (err) {
        // Continue to fallback
      }
    }

    return null;
  }

  /**
   * Apply an immediate, synchronous mutation to a selector's CSS rule.
   * @param {string} selector
   * @param {string} property
   * @param {string} value
   * @param {string} [priority]
   */
  mutateImmediate(selector, property, value, priority = '') {
    const rule = this.getOrCreateRule(selector);
    if (rule && rule.style && typeof rule.style.setProperty === 'function') {
      rule.style.setProperty(property, value, priority);
      return;
    }

    // Fallback: If scope is an HTMLElement with inline styles
    if (this.scope && this.scope.style && typeof this.scope.style.setProperty === 'function') {
      this.scope.style.setProperty(property, value, priority);
      return;
    }

    // Fallback: If browser documentElement is available and selector is :root / html / body
    if (isBrowser() && (selector === ':root' || selector === 'html')) {
      document.documentElement.style.setProperty(property, value, priority);
      return;
    }

    // Fallback: Append/update fallback style textContent if rules are unavailable
    if (this.fallbackStyleElement) {
      this._updateFallbackTextContent(selector, property, value, priority);
    }
  }

  /**
   * Apply an immediate, synchronous mutation to a specific DOM element.
   * @param {HTMLElement} element
   * @param {string} property
   * @param {string} value
   * @param {string} [priority]
   */
  mutateElementImmediate(element, property, value, priority = '') {
    if (!element || !element.style) return;
    element.style.setProperty(property, value, priority);
  }

  /**
   * Internal textContent updater when CSSStyleRule is inaccessible.
   */
  _updateFallbackTextContent(selector, property, value, priority) {
    if (!this.fallbackStyleElement) return;
    const prioStr = priority ? ` !${priority}` : '';
    const newDecl = `${property}: ${value}${prioStr};`;
    const cur = this.fallbackStyleElement.textContent || '';
    const escSel = escapeRegex(selector);
    const escProp = escapeRegex(property);

    if (new RegExp(escSel).test(cur)) {
      // Basic replace or append within existing rule block
      const regex = new RegExp(`(${escSel}\\s*\\{[^\\}]*?)(${escProp}\\s*:[^;]+;)([^\\}]*\\})`, 'g');
      if (regex.test(cur)) {
        this.fallbackStyleElement.textContent = cur.replace(regex, `$1${newDecl}$3`);
      } else {
        this.fallbackStyleElement.textContent = cur.replace(
          new RegExp(`(${escSel}\\s*\\{)([^\\}]*\\})`),
          `$1\n  ${newDecl}$2`
        );
      }
    } else {
      this.fallbackStyleElement.textContent += `\n${selector} {\n  ${newDecl}\n}`;
    }
  }

  /**
   * Schedules a high-performance coalesced mutation (60/120 FPS rAF batch).
   * Overwrites any existing dirty entry in the same frame for Zero-GC.
   *
   * @param {string} selector CSS selector (e.g. ':root', '.card', '[data-theme]')
   * @param {string} property CSS property or variable name (e.g. '--color-accent', 'transform')
   * @param {string} value Target CSS value
   * @param {string} [priority] Optional priority ('important' or '')
   */
  scheduleMutation(selector, property, value, priority = '') {
    this.dirtyBuffer.set(selector, property, value, priority);
    this._requestFlush();
  }

  /**
   * Schedules a coalesced mutation on a specific element.
   * @param {HTMLElement} element
   * @param {string} property
   * @param {string} value
   * @param {string} [priority]
   */
  scheduleElementMutation(element, property, value, priority = '') {
    let propMap = this.elementDirtyBuffer.get(element);
    if (!propMap) {
      propMap = new Map();
      this.elementDirtyBuffer.set(element, propMap);
    }

    let entry = propMap.get(property);
    if (!entry) {
      entry = new DirtyEntry();
      propMap.set(property, entry);
    }

    if (!entry.isDirty) {
      this.elementDirtyCount++;
    }
    entry.set(value, priority);

    this._requestFlush();
  }

  /**
   * Batch schedules multiple mutations at once.
   * @param {Array<{selector?: string, element?: HTMLElement, property: string, value: string, priority?: string}>} mutations
   */
  batchMutate(mutations) {
    if (!Array.isArray(mutations)) return;
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.element) {
        this.scheduleElementMutation(m.element, m.property, m.value, m.priority || '');
      } else {
        this.scheduleMutation(m.selector || this.defaultSelector, m.property, m.value, m.priority || '');
      }
    }
  }

  /**
   * Trigger frame request through LayoutPhaseCoordinator if available, or internal rAF.
   */
  _requestFlush() {
    if (this.rafScheduled) return;
    this.rafScheduled = true;

    if (this.coordinator && typeof this.coordinator.scheduleWrite === 'function') {
      this.coordinator.scheduleWrite(() => {
        this.flush();
      });
      return;
    }

    this.rafHandle = requestFrame(() => {
      this.rafScheduled = false;
      this.flush();
    });
  }

  /**
   * Flushes all pending mutations synchronously to the CSSOM.
   * Returns the total number of applied property mutations.
   * @returns {number}
   */
  flush() {
    let mutatedCount = 0;

    // 1. Flush Selector-based mutations
    if (this.dirtyBuffer.hasDirty()) {
      for (const [selector, propMap] of this.dirtyBuffer.buffer.entries()) {
        const rule = this.getOrCreateRule(selector);
        for (const [property, entry] of propMap.entries()) {
          if (entry.isDirty) {
            if (rule && rule.style && typeof rule.style.setProperty === 'function') {
              rule.style.setProperty(property, entry.value, entry.priority);
            } else {
              this.mutateImmediate(selector, property, entry.value, entry.priority);
            }
            entry.clear();
            mutatedCount++;
          }
        }
      }
      this.dirtyBuffer.dirtyCount = 0;
    }

    // 2. Flush Element-based mutations
    if (this.elementDirtyCount > 0) {
      for (const [element, propMap] of this.elementDirtyBuffer.entries()) {
        if (!element || !element.style) continue;
        for (const [property, entry] of propMap.entries()) {
          if (entry.isDirty) {
            element.style.setProperty(property, entry.value, entry.priority);
            entry.clear();
            mutatedCount++;
          }
        }
      }
      this.elementDirtyCount = 0;
    }

    this.rafScheduled = false;
    return mutatedCount;
  }

  /**
   * Cleans up and detaches the stylesheet from scope.
   */
  dispose() {
    if (this.rafHandle !== null) {
      cancelFrame(this.rafHandle);
      this.rafHandle = null;
    }
    this.rafScheduled = false;

    if (this.styleSheet && this.scope && 'adoptedStyleSheets' in this.scope) {
      try {
        this.scope.adoptedStyleSheets = (this.scope.adoptedStyleSheets || []).filter(
          (s) => s !== this.styleSheet
        );
      } catch (err) {
        // Ignore
      }
    }

    if (this.fallbackStyleElement && this.fallbackStyleElement.parentNode) {
      this.fallbackStyleElement.parentNode.removeChild(this.fallbackStyleElement);
      this.fallbackStyleElement = null;
    }

    this.ruleMap.clear();
    this.dirtyBuffer.clear();
    this.elementDirtyBuffer.clear();
    this.elementDirtyCount = 0;
  }
}

// =============================================================================
// 3. LAYOUT PHASE COORDINATOR (FASTDOM 2-PHASE SCHEDULING)
// =============================================================================

/**
 * FastDOM-inspired Two-Phase Layout Coordinator.
 * Strictly separates DOM Read operations from DOM Write operations within a single rAF frame,
 * completely preventing Forced Synchronous Layout / Layout Thrashing.
 */
export class LayoutPhaseCoordinator {
  constructor() {
    /** @type {Array<{id: number, fn: Function, priority: number}>} */
    this.readQueue = [];
    /** @type {Array<{id: number, fn: Function, priority: number}>} */
    this.writeQueue = [];

    /** @type {Array<{id: number, fn: Function, priority: number}>} */
    this.nextFrameReadQueue = [];
    /** @type {Array<{id: number, fn: Function, priority: number}>} */
    this.nextFrameWriteQueue = [];

    this.nextTaskId = 1;
    this.rafHandle = null;
    this.isFlushing = false;
    /** @type {'IDLE' | 'READ' | 'WRITE'} */
    this.currentPhase = 'IDLE';

    /** @type {WeakMap<any, string>} Saved containment states for CSS isolation */
    this.isolatedElements = new WeakMap();
  }

  /**
   * Schedule a read task (e.g. measuring clientHeight, getBoundingClientRect, computedStyle).
   * Executes in the READ phase before any pending WRITE tasks in the frame.
   *
   * @param {Function} taskFn Read operation
   * @param {number} [priority=0] Higher numbers execute earlier
   * @returns {number} Task ID for cancellation
   */
  scheduleRead(taskFn, priority = 0) {
    const id = this.nextTaskId++;
    const task = { id, fn: taskFn, priority };

    // If currently in WRITE phase, defer read to NEXT frame to prevent layout thrashing
    if (this.currentPhase === 'WRITE') {
      this.nextFrameReadQueue.push(task);
    } else {
      this.readQueue.push(task);
    }

    this._requestFrame();
    return id;
  }

  /**
   * Schedule a write task (e.g. mutating style.setProperty, classList, CSSOM, innerHTML).
   * Executes in the WRITE phase after all scheduled READ tasks have completed.
   *
   * @param {Function} taskFn Write operation
   * @param {number} [priority=0] Higher numbers execute earlier
   * @returns {number} Task ID for cancellation
   */
  scheduleWrite(taskFn, priority = 0) {
    const id = this.nextTaskId++;
    const task = { id, fn: taskFn, priority };

    // If currently in WRITE phase, defer to next frame write queue
    if (this.currentPhase === 'WRITE') {
      this.nextFrameWriteQueue.push(task);
    } else {
      this.writeQueue.push(task);
    }

    this._requestFrame();
    return id;
  }

  /**
   * Cancels a previously scheduled read or write task.
   * @param {number} taskId
   * @returns {boolean} True if task was found and canceled
   */
  cancel(taskId) {
    const remove = (queue) => {
      const idx = queue.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        queue.splice(idx, 1);
        return true;
      }
      return false;
    };

    return (
      remove(this.readQueue) ||
      remove(this.writeQueue) ||
      remove(this.nextFrameReadQueue) ||
      remove(this.nextFrameWriteQueue)
    );
  }

  /**
   * Request next frame if not already scheduled.
   */
  _requestFrame() {
    if (this.rafHandle !== null || this.isFlushing) return;

    this.rafHandle = requestFrame(() => {
      this.rafHandle = null;
      this.flush();
    });
  }

  /**
   * Execute all pending reads followed by all writes synchronously in sequence.
   */
  flush() {
    if (this.isFlushing) return;
    this.isFlushing = true;

    try {
      // -------------------------------------------------------------
      // Phase 1: READ Phase (Snapshot reads and execute)
      // -------------------------------------------------------------
      this.currentPhase = 'READ';
      if (this.readQueue.length > 0) {
        // Sort by descending priority
        this.readQueue.sort((a, b) => b.priority - a.priority);
        const reads = this.readQueue;
        this.readQueue = [];

        for (let i = 0; i < reads.length; i++) {
          try {
            reads[i].fn();
          } catch (err) {
            console.error('[LayoutPhaseCoordinator] Error during READ phase:', err);
          }
        }
      }

      // -------------------------------------------------------------
      // Phase 2: WRITE Phase (Snapshot writes and execute)
      // -------------------------------------------------------------
      this.currentPhase = 'WRITE';
      if (this.writeQueue.length > 0) {
        // Sort by descending priority
        this.writeQueue.sort((a, b) => b.priority - a.priority);
        const writes = this.writeQueue;
        this.writeQueue = [];

        for (let i = 0; i < writes.length; i++) {
          try {
            writes[i].fn();
          } catch (err) {
            console.error('[LayoutPhaseCoordinator] Error during WRITE phase:', err);
          }
        }
      }

      // -------------------------------------------------------------
      // Phase 3: Transition to next frame queues without dropping tasks
      // -------------------------------------------------------------
      if (this.nextFrameReadQueue.length > 0) {
        this.readQueue.push(...this.nextFrameReadQueue);
        this.nextFrameReadQueue = [];
      }
      if (this.nextFrameWriteQueue.length > 0) {
        this.writeQueue.push(...this.nextFrameWriteQueue);
        this.nextFrameWriteQueue = [];
      }
    } finally {
      this.currentPhase = 'IDLE';
      this.isFlushing = false;

      // If tasks were deferred to next frame, schedule rAF
      if (this.readQueue.length > 0 || this.writeQueue.length > 0) {
        this._requestFrame();
      }
    }
  }

  /**
   * CSS Isolation Helper: Applies 'contain: layout size style' (or custom containment)
   * on a target element during active interactive mutations (e.g. slider drag).
   * Restricts layout recomputations to that specific subtree, isolating the rest of DOM.
   *
   * @param {HTMLElement} element Target DOM element
   * @param {Object} [options]
   * @param {string} [options.containment='layout size style'] Containment property value
   * @returns {() => void} Restore function to revert containment
   */
  isolateElement(element, options = {}) {
    if (!element || !element.style) return () => {};

    const containment = options.containment || 'layout size style';
    let record = this.isolatedElements.get(element);

    if (!record) {
      record = {
        originalContain: element.style.contain || '',
        count: 1,
      };
      this.isolatedElements.set(element, record);
    } else {
      record.count++;
    }

    element.style.contain = containment;

    return () => {
      this.restoreElement(element);
    };
  }

  /**
   * Restores previous CSS containment on the isolated element with reference counting.
   * @param {HTMLElement} element
   */
  restoreElement(element) {
    if (!element || !element.style) return;

    const record = this.isolatedElements.get(element);
    if (!record) return;

    record.count--;
    if (record.count <= 0) {
      this.isolatedElements.delete(element);
      if (record.originalContain) {
        element.style.contain = record.originalContain;
      } else {
        if (typeof element.style.removeProperty === 'function') {
          element.style.removeProperty('contain');
        } else {
          element.style.contain = '';
        }
      }
    }
  }

  /**
   * Dispose all pending tasks and reset coordinator.
   */
  dispose() {
    if (this.rafHandle !== null) {
      cancelFrame(this.rafHandle);
      this.rafHandle = null;
    }
    this.readQueue = [];
    this.writeQueue = [];
    this.nextFrameReadQueue = [];
    this.nextFrameWriteQueue = [];
    this.isFlushing = false;
    this.currentPhase = 'IDLE';
  }
}

// =============================================================================
// 4. TOKEN SYNC COORDINATOR (BIDIRECTIONAL & REENTRANCY LOCK)
// =============================================================================

/**
 * Valid sync origins for preventing infinite feedback loops.
 * @typedef {'SLIDER' | 'CODE_EDITOR' | 'AST_SYNC' | 'API'} SyncSource
 */

/**
 * Coordinates bidirectional token synchronization between interactive sliders,
 * code/JSON editors, and in-memory AST token representations.
 */
export class TokenSyncCoordinator {
  /**
   * @param {Object} [options]
   * @param {ConstructableMutationEngine} [options.mutationEngine] Associated mutation engine
   * @param {number} [options.astDebounceMs=50] Debounce interval for AST store updates
   * @param {Record<string, any>} [options.initialTokens] Initial token key-value dictionary
   */
  constructor(options = {}) {
    this.mutationEngine = options.mutationEngine || null;
    this.astDebounceMs = typeof options.astDebounceMs === 'number' ? options.astDebounceMs : 50;

    /** @type {Map<string, any>} In-memory AST token store */
    this.tokenStore = new Map();
    if (options.initialTokens) {
      for (const [k, v] of Object.entries(options.initialTokens)) {
        this.tokenStore.set(k, v);
      }
    }

    /** @type {Set<(event: Object) => void>} Global change listeners */
    this.listeners = new Set();
    /** @type {Map<string, Set<(event: Object) => void>>} Per-token listeners */
    this.tokenListeners = new Map();

    // Reentrancy lock state
    this.isLocked = false;
    /** @type {SyncSource|null} */
    this.activeSource = null;
    this.reentrancyDepth = 0;
    this.maxReentrancyDepth = 5;
    /** @type {Set<string>} Active tokens currently being mutated in the call stack */
    this.activeTokens = new Set();

    // Debounce timer pool for AST updates
    /** @type {Map<string, any>} */
    this.debounceTimers = new Map();
  }

  /**
   * Get current value of a design token.
   * @param {string} key
   * @returns {any}
   */
  getToken(key) {
    return this.tokenStore.get(key);
  }

  /**
   * Returns a snapshot of all active tokens as a plain JavaScript object.
   * @returns {Record<string, any>}
   */
  getAllTokens() {
    const result = {};
    for (const [k, v] of this.tokenStore.entries()) {
      result[k] = v;
    }
    return result;
  }

  /**
   * Subscribe to token mutations across all sources.
   * @param {(event: Object) => void} callback
   * @returns {() => void} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Subscribe to mutations of a specific token key.
   * @param {string} tokenKey
   * @param {(event: Object) => void} callback
   * @returns {() => void} Unsubscribe function
   */
  subscribeToToken(tokenKey, callback) {
    let set = this.tokenListeners.get(tokenKey);
    if (!set) {
      set = new Set();
      this.tokenListeners.set(tokenKey, set);
    }
    set.add(callback);
    return () => {
      const s = this.tokenListeners.get(tokenKey);
      if (s) {
        s.delete(callback);
        if (s.size === 0) {
          this.tokenListeners.delete(tokenKey);
        }
      }
    };
  }

  /**
   * Checks whether a mutation dispatch from the given source should be blocked by reentrancy locks.
   * Prevents cross-source echo loops (e.g. SLIDER -> CODE_EDITOR -> SLIDER) and cyclic recursion on the
   * same token, while allowing same-source cascading updates on different tokens up to maxReentrancyDepth.
   *
   * @param {SyncSource} source
   * @param {string} [tokenKey]
   * @returns {boolean}
   */
  isSourceBlocked(source, tokenKey = '') {
    if (!this.isLocked) return false;
    // Cross-source calls during an active transaction are always blocked (anti-echo loop)
    if (this.activeSource !== source) {
      return true;
    }
    // Reentrancy on the SAME token within the same transaction is blocked (anti-cycle loop)
    if (tokenKey && this.activeTokens.has(tokenKey)) {
      return true;
    }
    // Same-source cascading to different tokens is allowed up to maxReentrancyDepth
    return this.reentrancyDepth >= this.maxReentrancyDepth;
  }

  /**
   * Dispatches a token change initiated from an interactive Slider / Color Picker.
   *
   * Flow:
   *  1. Immediately mutates CSSOM at 60/120 FPS via ConstructableMutationEngine (zero lag).
   *  2. Debounces in-memory AST store update by 50ms to prevent expensive AST re-parsing.
   *  3. Enforces reentrancy lock to suppress echo loops.
   *
   * @param {string} tokenKey CSS variable or token name (e.g. '--color-primary')
   * @param {any} value Target value
   * @param {Object} [metadata] Optional metadata (selector, unit, priority)
   */
  dispatchFromSlider(tokenKey, value, metadata = {}) {
    if (this.isSourceBlocked('SLIDER', tokenKey)) return;

    const selector = metadata.selector || ':root';
    const priority = metadata.priority || '';

    // Fast-path for SLIDER: Mutate CSSOM immediately at 60/120 FPS
    if (this.mutationEngine) {
      this.mutationEngine.scheduleMutation(selector, tokenKey, String(value), priority);
    }

    // Debounce the AST Store and listener notification
    const existing = this.debounceTimers.get(tokenKey);
    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
      this.debounceTimers.delete(tokenKey);
      this.runTransaction('SLIDER', () => {
        this._applyTokenMutation('SLIDER', tokenKey, value, metadata);
      });
    }, this.astDebounceMs);

    this.debounceTimers.set(tokenKey, { timer, tokenKey, value, metadata });
  }

  /**
   * Dispatches a token change initiated from a Code Editor or JSON payload.
   *
   * Flow:
   *  1. Immediately updates in-memory AST Store.
   *  2. Mutates CSSOM immediately.
   *  3. Notifies UI listeners (sliders) to reposition controls without triggering echo events.
   *
   * @param {string} tokenKey
   * @param {any} value
   * @param {Object} [metadata]
   */
  dispatchFromCodeEditor(tokenKey, value, metadata = {}) {
    if (this.isSourceBlocked('CODE_EDITOR', tokenKey)) return;
    this.runTransaction('CODE_EDITOR', () => {
      this._applyTokenMutation('CODE_EDITOR', tokenKey, value, metadata);
    });
  }

  /**
   * Dispatches a batch or single token change from an AST synchronization round.
   *
   * @param {Record<string, any>|string} tokenKeyOrMap
   * @param {any} [value]
   * @param {Object} [metadata]
   */
  dispatchFromAstSync(tokenKeyOrMap, value, metadata = {}) {
    if (typeof tokenKeyOrMap === 'object' && tokenKeyOrMap !== null) {
      if (this.isSourceBlocked('AST_SYNC')) return;
      this.runTransaction('AST_SYNC', () => {
        for (const [k, v] of Object.entries(tokenKeyOrMap)) {
          this._applyTokenMutation('AST_SYNC', k, v, metadata);
        }
      });
    } else {
      if (this.isSourceBlocked('AST_SYNC', String(tokenKeyOrMap))) return;
      this.runTransaction('AST_SYNC', () => {
        this._applyTokenMutation('AST_SYNC', tokenKeyOrMap, value, metadata);
      });
    }
  }

  /**
   * Internal token mutation applier and listener notifier.
   */
  _applyTokenMutation(source, tokenKey, value, metadata = {}) {
    const previousValue = this.tokenStore.get(tokenKey);
    const selector = metadata.selector || ':root';
    const priority = metadata.priority || '';

    // Clear any pending debounced slider write for this key
    const existing = this.debounceTimers.get(tokenKey);
    if (existing) {
      clearTimeout(existing.timer);
      this.debounceTimers.delete(tokenKey);
    }

    this.tokenStore.set(tokenKey, value);

    // Mutate CSSOM
    if (this.mutationEngine) {
      if (metadata.immediate) {
        this.mutationEngine.mutateImmediate(selector, tokenKey, String(value), priority);
      } else {
        this.mutationEngine.scheduleMutation(selector, tokenKey, String(value), priority);
      }
    }

    // Mark token active in call stack to prevent self-referential cycles
    this.activeTokens.add(tokenKey);
    try {
      this._notifyListeners({
        tokenKey,
        value,
        previousValue,
        source,
        timestamp: Date.now(),
        metadata,
      });
    } finally {
      this.activeTokens.delete(tokenKey);
    }
  }

  /**
   * Executes an action within a Reentrancy Lock scope for a given source.
   * Distinguishes sources and supports nested same-source mutations up to maxReentrancyDepth.
   *
   * @param {SyncSource} source
   * @param {Function} action
   */
  runTransaction(source, action) {
    if (this.isSourceBlocked(source)) return;

    const previousSource = this.activeSource;
    const wasLocked = this.isLocked;

    this.isLocked = true;
    this.activeSource = source;
    this.reentrancyDepth++;

    try {
      action();
    } finally {
      this.reentrancyDepth--;
      if (this.reentrancyDepth === 0) {
        this.isLocked = false;
        this.activeSource = null;
      } else {
        this.activeSource = previousSource;
        this.isLocked = wasLocked;
      }
    }
  }

  /**
   * Internal notification dispatcher.
   */
  _notifyListeners(event) {
    // Notify global listeners
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[TokenSyncCoordinator] Error in global listener:', err);
      }
    }

    // Notify per-token listeners
    const specific = this.tokenListeners.get(event.tokenKey);
    if (specific) {
      for (const listener of specific) {
        try {
          listener(event);
        } catch (err) {
          console.error(`[TokenSyncCoordinator] Error in listener for ${event.tokenKey}:`, err);
        }
      }
    }
  }

  /**
   * Flushes all pending debounced updates immediately, committing values to AST store and notifying listeners.
   */
  flushDebounced() {
    if (this.debounceTimers.size === 0) return;
    const pending = Array.from(this.debounceTimers.values());
    this.debounceTimers.clear();

    for (const item of pending) {
      clearTimeout(item.timer);
      this.runTransaction('SLIDER', () => {
        this._applyTokenMutation('SLIDER', item.tokenKey, item.value, item.metadata);
      });
    }
  }

  /**
   * Disposes all timers and clears listener subscriptions.
   */
  dispose() {
    for (const item of this.debounceTimers.values()) {
      clearTimeout(item.timer);
    }
    this.debounceTimers.clear();
    this.listeners.clear();
    this.tokenListeners.clear();
    this.tokenStore.clear();
    this.activeTokens.clear();
    this.isLocked = false;
    this.activeSource = null;
    this.reentrancyDepth = 0;
  }
}

// =============================================================================
// 5. UNIFIED SYSTEM FACADE
// =============================================================================

/**
 * Creates an integrated Constructable Mutation & FastDOM Phase Scheduler system.
 *
 * @param {Object} [options]
 * @param {Document|ShadowRoot|HTMLElement} [options.scope]
 * @param {string} [options.defaultSelector=':root']
 * @param {number} [options.astDebounceMs=50]
 * @param {Record<string, any>} [options.initialTokens]
 * @returns {{
 *   mutationEngine: ConstructableMutationEngine,
 *   coordinator: LayoutPhaseCoordinator,
 *   tokenSync: TokenSyncCoordinator,
 *   dispose: () => void
 * }}
 */
export function createConstructableMutationSystem(options = {}) {
  const coordinator = new LayoutPhaseCoordinator();
  const mutationEngine = new ConstructableMutationEngine({
    scope: options.scope,
    defaultSelector: options.defaultSelector,
    coordinator,
  });
  const tokenSync = new TokenSyncCoordinator({
    mutationEngine,
    astDebounceMs: options.astDebounceMs,
    initialTokens: options.initialTokens,
  });

  return {
    mutationEngine,
    coordinator,
    tokenSync,
    dispose() {
      tokenSync.dispose();
      mutationEngine.dispose();
      coordinator.dispose();
    },
  };
}

// Master namespace export
export const ConstructableMutation = {
  version: '2.0.0',
  ConstructableMutationEngine,
  LayoutPhaseCoordinator,
  TokenSyncCoordinator,
  DirtyBufferPool,
  DirtyEntry,
  createConstructableMutationSystem,
  hasAdoptedStyleSheetsSupport,
  requestFrame,
  cancelFrame,
  isBrowser,
};

// Universal browser global attachment
if (isBrowser()) {
  const win = window;
  win.ConstructableMutation = ConstructableMutation;
  win.ConstructableMutationEngine = ConstructableMutationEngine;
  win.LayoutPhaseCoordinator = LayoutPhaseCoordinator;
  win.TokenSyncCoordinator = TokenSyncCoordinator;
  win.createConstructableMutationSystem = createConstructableMutationSystem;
}

export default ConstructableMutation;
