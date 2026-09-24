/**
 * ⚡ CONSTRUCTABLE MUTATION ENGINE & FASTDOM PHASE SCHEDULER (UMD / Standalone Global Bundle)
 * ===========================================================================================
 * Universal standalone UMD/Global build of ConstructableMutation for direct <script src="..."> tags,
 * CommonJS require(), AMD define(), legacy browsers, Electron, and local file:// protocols.
 *
 * Core Modules:
 *  - ConstructableMutationEngine
 *  - LayoutPhaseCoordinator
 *  - TokenSyncCoordinator
 *  - createConstructableMutationSystem
 *  - DirtyBufferPool & DirtyEntry
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const exports = factory();
    global.ConstructableMutation = exports;
    global.ConstructableMutationEngine = exports.ConstructableMutationEngine;
    global.LayoutPhaseCoordinator = exports.LayoutPhaseCoordinator;
    global.TokenSyncCoordinator = exports.TokenSyncCoordinator;
    global.createConstructableMutationSystem = exports.createConstructableMutationSystem;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  function requestFrame(callback) {
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

  function cancelFrame(id) {
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

  function hasAdoptedStyleSheetsSupport(targetScope) {
    if (typeof CSSStyleSheet === 'undefined') {
      return false;
    }
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

  class DirtyEntry {
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

  class DirtyBufferPool {
    constructor() {
      this.buffer = new Map();
      this.dirtyCount = 0;
    }

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

    hasDirty() {
      return this.dirtyCount > 0;
    }

    resetDirtyFlags() {
      this.dirtyCount = 0;
      for (const propMap of this.buffer.values()) {
        for (const entry of propMap.values()) {
          entry.isDirty = false;
        }
      }
    }

    clear() {
      this.buffer.clear();
      this.dirtyCount = 0;
    }
  }

  // =============================================================================
  // 2. CONSTRUCTABLE MUTATION ENGINE
  // =============================================================================

  class ConstructableMutationEngine {
    constructor(options = {}) {
      this.scope = options.scope || (isBrowser() ? document : null);
      this.styleSheetId = options.styleSheetId || 'antigravity-constructable-styles';
      this.autoAdopt = options.autoAdopt !== false;
      this.defaultSelector = options.defaultSelector || ':root';
      this.coordinator = options.coordinator || null;

      this.styleSheet = null;
      this.ruleMap = new Map();
      this.fallbackStyleElement = null;

      this.dirtyBuffer = new DirtyBufferPool();
      this.elementDirtyBuffer = new Map();
      this.elementDirtyCount = 0;

      this.rafScheduled = false;
      this.rafHandle = null;
      this._supportsAdopted = hasAdoptedStyleSheetsSupport(this.scope);

      this._initializeEngine();
    }

    isAdoptedStyleSheetsSupported() {
      return this._supportsAdopted;
    }

    _initializeEngine() {
      if (!this.scope) return;

      if (this._supportsAdopted) {
        try {
          this.styleSheet = new CSSStyleSheet();
          if (this.autoAdopt && 'adoptedStyleSheets' in this.scope) {
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

    _initFallbackStyle() {
      if (!isBrowser() || !this.scope) return;

      const doc = this.scope.ownerDocument || (this.scope.nodeType === 9 ? this.scope : document);
      if (!doc || !doc.head) return;

      let el = doc.getElementById(this.styleSheetId);
      if (!el) {
        el = doc.createElement('style');
        el.id = this.styleSheetId;
        el.setAttribute('data-constructable-fallback', 'true');
        doc.head.appendChild(el);
      }
      this.fallbackStyleElement = el;
    }

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
          // Selector fallback
        }
      }

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
          // Fallback
        }
      }

      return null;
    }

    mutateImmediate(selector, property, value, priority = '') {
      const rule = this.getOrCreateRule(selector);
      if (rule && rule.style && typeof rule.style.setProperty === 'function') {
        rule.style.setProperty(property, value, priority);
        return;
      }

      if (this.scope && this.scope.style && typeof this.scope.style.setProperty === 'function') {
        this.scope.style.setProperty(property, value, priority);
        return;
      }

      if (isBrowser() && (selector === ':root' || selector === 'html')) {
        document.documentElement.style.setProperty(property, value, priority);
        return;
      }

      if (this.fallbackStyleElement) {
        this._updateFallbackTextContent(selector, property, value, priority);
      }
    }

    mutateElementImmediate(element, property, value, priority = '') {
      if (!element || !element.style) return;
      element.style.setProperty(property, value, priority);
    }

    _updateFallbackTextContent(selector, property, value, priority) {
      if (!this.fallbackStyleElement) return;
      const prioStr = priority ? ` !${priority}` : '';
      const newDecl = `${property}: ${value}${prioStr};`;
      const cur = this.fallbackStyleElement.textContent || '';
      const escSel = escapeRegex(selector);
      const escProp = escapeRegex(property);

      if (new RegExp(escSel).test(cur)) {
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

    scheduleMutation(selector, property, value, priority = '') {
      this.dirtyBuffer.set(selector, property, value, priority);
      this._requestFlush();
    }

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

    flush() {
      let mutatedCount = 0;

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

  class LayoutPhaseCoordinator {
    constructor() {
      this.readQueue = [];
      this.writeQueue = [];
      this.nextFrameReadQueue = [];
      this.nextFrameWriteQueue = [];
      this.nextTaskId = 1;
      this.rafHandle = null;
      this.isFlushing = false;
      this.currentPhase = 'IDLE';
      this.isolatedElements = new WeakMap();
    }

    scheduleRead(taskFn, priority = 0) {
      const id = this.nextTaskId++;
      const task = { id, fn: taskFn, priority };

      if (this.currentPhase === 'WRITE') {
        this.nextFrameReadQueue.push(task);
      } else {
        this.readQueue.push(task);
      }

      this._requestFrame();
      return id;
    }

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

    _requestFrame() {
      if (this.rafHandle !== null || this.isFlushing) return;

      this.rafHandle = requestFrame(() => {
        this.rafHandle = null;
        this.flush();
      });
    }

    flush() {
      if (this.isFlushing) return;
      this.isFlushing = true;

      try {
        this.currentPhase = 'READ';
        if (this.readQueue.length > 0) {
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

        this.currentPhase = 'WRITE';
        if (this.writeQueue.length > 0) {
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

        if (this.readQueue.length > 0 || this.writeQueue.length > 0) {
          this._requestFrame();
        }
      }
    }

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

  class TokenSyncCoordinator {
    constructor(options = {}) {
      this.mutationEngine = options.mutationEngine || null;
      this.astDebounceMs = typeof options.astDebounceMs === 'number' ? options.astDebounceMs : 50;

      this.tokenStore = new Map();
      if (options.initialTokens) {
        for (const [k, v] of Object.entries(options.initialTokens)) {
          this.tokenStore.set(k, v);
        }
      }

      this.listeners = new Set();
      this.tokenListeners = new Map();

      this.isLocked = false;
      this.activeSource = null;
      this.reentrancyDepth = 0;
      this.maxReentrancyDepth = 5;

      this.debounceTimers = new Map();
    }

    getToken(key) {
      return this.tokenStore.get(key);
    }

    getAllTokens() {
      const result = {};
      for (const [k, v] of this.tokenStore.entries()) {
        result[k] = v;
      }
      return result;
    }

    subscribe(callback) {
      this.listeners.add(callback);
      return () => {
        this.listeners.delete(callback);
      };
    }

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

    isSourceBlocked(source) {
      if (!this.isLocked) return false;
      if (this.activeSource === source) {
        return this.reentrancyDepth >= this.maxReentrancyDepth;
      }
      return true;
    }

    dispatchFromSlider(tokenKey, value, metadata = {}) {
      if (this.isSourceBlocked('SLIDER')) return;

      const selector = metadata.selector || ':root';
      const priority = metadata.priority || '';

      if (this.mutationEngine) {
        this.mutationEngine.scheduleMutation(selector, tokenKey, String(value), priority);
      }

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

    dispatchFromCodeEditor(tokenKey, value, metadata = {}) {
      if (this.isSourceBlocked('CODE_EDITOR')) return;
      this.runTransaction('CODE_EDITOR', () => {
        this._applyTokenMutation('CODE_EDITOR', tokenKey, value, metadata);
      });
    }

    dispatchFromAstSync(tokenKeyOrMap, value, metadata = {}) {
      if (this.isSourceBlocked('AST_SYNC')) return;

      if (typeof tokenKeyOrMap === 'object' && tokenKeyOrMap !== null) {
        this.runTransaction('AST_SYNC', () => {
          for (const [k, v] of Object.entries(tokenKeyOrMap)) {
            this._applyTokenMutation('AST_SYNC', k, v, metadata);
          }
        });
      } else {
        this.runTransaction('AST_SYNC', () => {
          this._applyTokenMutation('AST_SYNC', tokenKeyOrMap, value, metadata);
        });
      }
    }

    _applyTokenMutation(source, tokenKey, value, metadata = {}) {
      const previousValue = this.tokenStore.get(tokenKey);
      const selector = metadata.selector || ':root';
      const priority = metadata.priority || '';

      const existing = this.debounceTimers.get(tokenKey);
      if (existing) {
        clearTimeout(existing.timer);
        this.debounceTimers.delete(tokenKey);
      }

      this.tokenStore.set(tokenKey, value);

      if (this.mutationEngine) {
        if (metadata.immediate) {
          this.mutationEngine.mutateImmediate(selector, tokenKey, String(value), priority);
        } else {
          this.mutationEngine.scheduleMutation(selector, tokenKey, String(value), priority);
        }
      }

      this._notifyListeners({
        tokenKey,
        value,
        previousValue,
        source,
        timestamp: Date.now(),
        metadata,
      });
    }

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

    _notifyListeners(event) {
      for (const listener of this.listeners) {
        try {
          listener(event);
        } catch (err) {
          console.error('[TokenSyncCoordinator] Error in global listener:', err);
        }
      }

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

    dispose() {
      for (const item of this.debounceTimers.values()) {
        clearTimeout(item.timer);
      }
      this.debounceTimers.clear();
      this.listeners.clear();
      this.tokenListeners.clear();
      this.tokenStore.clear();
      this.isLocked = false;
      this.activeSource = null;
      this.reentrancyDepth = 0;
    }
  }

  // =============================================================================
  // 5. UNIFIED SYSTEM FACADE
  // =============================================================================

  function createConstructableMutationSystem(options = {}) {
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

  const ConstructableMutation = {
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

  return ConstructableMutation;
});
