/**
 * 🧪 Comprehensive Test Suite for ConstructableMutationEngine & FastDOM Phase Scheduler
 * ======================================================================================
 * Validates:
 *  1. Module Structure & Exports (ESM & UMD)
 *  2. Zero-GC DirtyBufferPool Mechanics
 *  3. ConstructableMutationEngine & adoptedStyleSheets CSSOM Mutation
 *  4. Fallback Strategy for Unsupported Environments
 *  5. Coalesced Batching via rAF (60/120 FPS Burst Simulation)
 *  6. LayoutPhaseCoordinator (FastDOM 2-Phase Scheduling & Thrashing Elimination)
 *  7. CSS Isolation Layer ('contain: layout size style')
 *  8. TokenSyncCoordinator Bidirectional Synchronization
 *  9. Transaction Reentrancy Lock & Loop Immunity
 * 10. Lifecycle Cleanup & Resource Disposal
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ConstructableMutation,
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
} from './constructable_mutation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log('🚀 Starting ConstructableMutationEngine & FastDOM Phase Scheduler Test Suite...\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Module Structure & Exports (ESM & UMD)
// -----------------------------------------------------------------------------
console.log('📦 Test Suite 1: Module Structure & Exports (ESM & UMD)');
{
  assert(typeof ConstructableMutation === 'object', 'ConstructableMutation namespace exists');
  assert(typeof ConstructableMutationEngine === 'function', 'ConstructableMutationEngine class exported');
  assert(typeof LayoutPhaseCoordinator === 'function', 'LayoutPhaseCoordinator class exported');
  assert(typeof TokenSyncCoordinator === 'function', 'TokenSyncCoordinator class exported');
  assert(typeof DirtyBufferPool === 'function', 'DirtyBufferPool class exported');
  assert(typeof DirtyEntry === 'function', 'DirtyEntry class exported');
  assert(typeof createConstructableMutationSystem === 'function', 'createConstructableMutationSystem exported');
  assert(typeof hasAdoptedStyleSheetsSupport === 'function', 'hasAdoptedStyleSheetsSupport exported');
  assert(typeof requestFrame === 'function', 'requestFrame exported');
  assert(typeof cancelFrame === 'function', 'cancelFrame exported');
  assert(typeof isBrowser === 'function', 'isBrowser exported');

  // Verify UMD Bundle loading
  const umdPath = path.join(__dirname, 'constructable_mutation.umd.js');
  assert(fs.existsSync(umdPath), 'constructable_mutation.umd.js file exists');
  const umdContent = fs.readFileSync(umdPath, 'utf8');
  assert(umdContent.includes('ConstructableMutationEngine'), 'UMD contains ConstructableMutationEngine');
  assert(umdContent.includes('LayoutPhaseCoordinator'), 'UMD contains LayoutPhaseCoordinator');
  assert(umdContent.includes('TokenSyncCoordinator'), 'UMD contains TokenSyncCoordinator');

  // Verify UMD in CommonJS context via Node vm
  const { createContext, runInContext } = await import('vm');
  const cjsSandbox = {
    exports: {},
    module: { exports: {} },
    setTimeout,
    clearTimeout,
  };
  createContext(cjsSandbox);
  runInContext(umdContent, cjsSandbox);
  const exportedCjs = cjsSandbox.module.exports;
  assert(typeof exportedCjs.ConstructableMutationEngine === 'function', 'UMD CommonJS exports ConstructableMutationEngine');
  assert(typeof exportedCjs.LayoutPhaseCoordinator === 'function', 'UMD CommonJS exports LayoutPhaseCoordinator');
  assert(typeof exportedCjs.TokenSyncCoordinator === 'function', 'UMD CommonJS exports TokenSyncCoordinator');
  assert(typeof exportedCjs.createConstructableMutationSystem === 'function', 'UMD CommonJS exports createConstructableMutationSystem');

  // Verify UMD in Browser Window context via Node vm
  const windowSandbox = {
    setTimeout,
    clearTimeout,
  };
  windowSandbox.window = windowSandbox;
  windowSandbox.globalThis = windowSandbox;
  createContext(windowSandbox);
  runInContext(umdContent, windowSandbox);
  assert(typeof windowSandbox.ConstructableMutation === 'object', 'UMD Window exports ConstructableMutation');
  assert(typeof windowSandbox.ConstructableMutationEngine === 'function', 'UMD Window exports ConstructableMutationEngine');
  assert(typeof windowSandbox.LayoutPhaseCoordinator === 'function', 'UMD Window exports LayoutPhaseCoordinator');
  assert(typeof windowSandbox.TokenSyncCoordinator === 'function', 'UMD Window exports TokenSyncCoordinator');
}

// -----------------------------------------------------------------------------
// Test Suite 2: Zero-GC DirtyBufferPool Mechanics
// -----------------------------------------------------------------------------
console.log('\n⚡ Test Suite 2: Zero-GC DirtyBufferPool Mechanics');
{
  const pool = new DirtyBufferPool();
  assert(!pool.hasDirty(), 'Initial pool has no dirty entries');
  assert(pool.dirtyCount === 0, 'dirtyCount is initially 0');

  // Add mutation
  pool.set(':root', '--primary', '#3b82f6');
  assert(pool.hasDirty(), 'Pool has dirty entries after set');
  assert(pool.dirtyCount === 1, 'dirtyCount is 1');

  // Coalescing: Overwrite same property 100 times in same frame
  for (let i = 0; i < 100; i++) {
    pool.set(':root', '--primary', `#0000${i.toString(16).padStart(2, '0')}`);
  }
  assert(pool.dirtyCount === 1, 'dirtyCount remains 1 when overwriting same property');

  const propMap = pool.buffer.get(':root');
  assert(propMap !== undefined, 'Found selector map for :root');
  const entry = propMap.get('--primary');
  assert(entry !== undefined, 'Found entry for --primary');
  assert(entry.value === '#000063', 'Latest value coalesced properly');
  assert(entry.isDirty === true, 'Entry is marked dirty');

  // Reset dirty flags without deallocating internal entries
  pool.resetDirtyFlags();
  assert(!pool.hasDirty(), 'Pool dirty count is 0 after resetDirtyFlags');
  assert(entry.isDirty === false, 'Entry dirty flag cleared');
  assert(entry.value === '#000063', 'Entry retains memory slot without GC deallocation');

  // Mutate again reusing existing entry
  pool.set(':root', '--primary', '#ffffff');
  assert(pool.dirtyCount === 1, 'dirtyCount increments back to 1');
  assert(entry.isDirty === true, 'Existing entry flagged dirty again');
  assert(entry.value === '#ffffff', 'Entry value updated in-place');

  pool.clear();
  assert(pool.buffer.size === 0, 'Pool cleared completely');
}

// -----------------------------------------------------------------------------
// Test Suite 3: Constructable Stylesheets & CSSOM Mutation (Simulated Environment)
// -----------------------------------------------------------------------------
console.log('\n🎨 Test Suite 3: Constructable Stylesheets & adoptedStyleSheets CSSOM Mutation');
{
  // Build standard W3C CSSStyleSheet & CSSStyleRule mock
  class MockCSSStyleDeclaration {
    constructor() {
      this.properties = new Map();
    }
    setProperty(prop, val, prio = '') {
      this.properties.set(prop, { value: String(val), priority: prio });
    }
    getPropertyValue(prop) {
      return this.properties.has(prop) ? this.properties.get(prop).value : '';
    }
    removeProperty(prop) {
      this.properties.delete(prop);
    }
  }

  class MockCSSStyleRule {
    constructor(selectorText) {
      this.selectorText = selectorText;
      this.style = new MockCSSStyleDeclaration();
    }
  }

  class MockCSSStyleSheet {
    constructor() {
      this.cssRules = [];
    }
    insertRule(ruleString, index = 0) {
      const match = ruleString.match(/^([^{]+)\s*\{/);
      const selector = match ? match[1].trim() : ':root';
      const rule = new MockCSSStyleRule(selector);
      this.cssRules.splice(index, 0, rule);
      return index;
    }
    deleteRule(index) {
      this.cssRules.splice(index, 1);
    }
  }

  // Setup mock document scope
  const mockDocument = {
    nodeType: 9,
    adoptedStyleSheets: [],
  };

  // Bind CSSStyleSheet constructor to globalThis for test
  globalThis.CSSStyleSheet = MockCSSStyleSheet;

  assert(hasAdoptedStyleSheetsSupport(mockDocument) === true, 'Mock document supports adoptedStyleSheets');

  const engine = new ConstructableMutationEngine({
    scope: mockDocument,
    defaultSelector: ':root',
  });

  assert(engine.isAdoptedStyleSheetsSupported() === true, 'Engine detects adoptedStyleSheets support');
  assert(mockDocument.adoptedStyleSheets.length === 1, 'Constructable stylesheet adopted into scope');
  assert(engine.styleSheet instanceof MockCSSStyleSheet, 'Engine created internal MockCSSStyleSheet');

  // Immediate mutation test
  engine.mutateImmediate(':root', '--color-canvas', '#fdfbf7');
  const rule = engine.getOrCreateRule(':root');
  assert(rule !== null, 'Found or created rule for :root');
  assert(rule.style.getPropertyValue('--color-canvas') === '#fdfbf7', 'Immediate mutation applied to CSSOM');

  // Coalesced mutation via flush
  engine.scheduleMutation(':root', '--surface-card', '#ffffff');
  engine.scheduleMutation(':root', '--border-subtle', 'rgba(0,0,0,0.06)');
  engine.scheduleMutation('[data-theme="luminous"]', '--accent-color', '#4f46e5');

  const flushedCount = engine.flush();
  assert(flushedCount === 3, `Flushed 3 properties successfully (got ${flushedCount})`);
  assert(rule.style.getPropertyValue('--surface-card') === '#ffffff', 'Card surface updated');
  assert(rule.style.getPropertyValue('--border-subtle') === 'rgba(0,0,0,0.06)', 'Subtle border updated');

  const themeRule = engine.getOrCreateRule('[data-theme="luminous"]');
  assert(themeRule !== null, 'Theme rule created');
  assert(themeRule.style.getPropertyValue('--accent-color') === '#4f46e5', 'Accent color updated in theme rule');

  // Cleanup
  engine.dispose();
  assert(mockDocument.adoptedStyleSheets.length === 0, 'Stylesheet removed on engine dispose');
}

// -----------------------------------------------------------------------------
// Test Suite 4: Fallback Strategy for Unsupported Environments
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 4: Fallback Strategy for Unsupported Environments');
{
  // Scope without adoptedStyleSheets
  class MockElement {
    constructor(id = '') {
      this.id = id;
      this.style = {
        _props: new Map(),
        setProperty(k, v, prio = '') {
          this._props.set(k, { value: v, priority: prio });
        },
        getPropertyValue(k) {
          return this._props.has(k) ? this._props.get(k).value : '';
        },
        removeProperty(k) {
          this._props.delete(k);
        },
      };
    }
  }

  const legacyElement = new MockElement('preview-box');

  // Temporarily delete CSSStyleSheet to simulate legacy browser
  const origCSSStyleSheet = globalThis.CSSStyleSheet;
  delete globalThis.CSSStyleSheet;

  const fallbackEngine = new ConstructableMutationEngine({
    scope: legacyElement,
    defaultSelector: ':root',
  });

  assert(fallbackEngine.isAdoptedStyleSheetsSupported() === false, 'Correctly flags adoptedStyleSheets unsupported');

  // Mutate immediate on element fallback
  fallbackEngine.mutateImmediate(':root', '--font-family', 'sans-serif');
  assert(legacyElement.style.getPropertyValue('--font-family') === 'sans-serif', 'Fallback mutates element.style directly');

  // Scheduled mutation on element
  fallbackEngine.scheduleElementMutation(legacyElement, '--padding', '24px');
  const count = fallbackEngine.flush();
  assert(count === 1, 'Flushed 1 element mutation');
  assert(legacyElement.style.getPropertyValue('--padding') === '24px', 'Element style updated after flush');

  fallbackEngine.dispose();
  // Restore
  globalThis.CSSStyleSheet = origCSSStyleSheet;
}

// -----------------------------------------------------------------------------
// Test Suite 5: Coalesced Batching via rAF (60/120 FPS Burst Simulation)
// -----------------------------------------------------------------------------
console.log('\n🚀 Test Suite 5: Coalesced Batching via rAF (60/120 FPS Burst Simulation)');
await (async () => {
  const mockDoc = { adoptedStyleSheets: [] };
  const engine = new ConstructableMutationEngine({
    scope: mockDoc,
    defaultSelector: ':root',
  });

  let rafCallbackCount = 0;
  // Overwrite requestFrame callback counter
  const originalRaf = globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame = (cb) => {
    rafCallbackCount++;
    return setTimeout(() => cb(Date.now()), 10);
  };

  // Simulate 1,000 rapid slider mutations within a single frame
  for (let i = 0; i < 1000; i++) {
    engine.scheduleMutation(':root', '--slider-val', `${i}px`);
  }

  // Wait for frame to flush
  await wait(30);

  const rule = engine.getOrCreateRule(':root');
  assert(rule.style.getPropertyValue('--slider-val') === '999px', 'Final value 999px preserved after 1000 burst mutations');
  assert(rafCallbackCount === 1, `Exactly 1 rAF requested for 1000 mutations (got ${rafCallbackCount})`);

  // Restore
  if (originalRaf) {
    globalThis.requestAnimationFrame = originalRaf;
  }
  engine.dispose();
})();

// -----------------------------------------------------------------------------
// Test Suite 6: LayoutPhaseCoordinator (FastDOM 2-Phase Scheduling)
// -----------------------------------------------------------------------------
console.log('\n⏱️ Test Suite 6: LayoutPhaseCoordinator (FastDOM 2-Phase Scheduling)');
{
  const coordinator = new LayoutPhaseCoordinator();
  const executionOrder = [];

  // Interleave reads and writes
  coordinator.scheduleWrite(() => {
    executionOrder.push('WRITE-1');
  }, 10);

  coordinator.scheduleRead(() => {
    executionOrder.push('READ-1');
  }, 5);

  coordinator.scheduleWrite(() => {
    executionOrder.push('WRITE-2');
  }, 20);

  coordinator.scheduleRead(() => {
    executionOrder.push('READ-2');
  }, 15);

  // Synchronous flush
  coordinator.flush();

  // Expectations:
  // 1. ALL READs must execute BEFORE ANY WRITE!
  // 2. Within READs, priority 15 (READ-2) before priority 5 (READ-1)
  // 3. Within WRITEs, priority 20 (WRITE-2) before priority 10 (WRITE-1)
  const expected = ['READ-2', 'READ-1', 'WRITE-2', 'WRITE-1'];
  assert(JSON.stringify(executionOrder) === JSON.stringify(expected), `FastDOM execution strictly separated: ${executionOrder.join(' -> ')}`);

  // Test Read scheduled during Write phase defers to next frame
  const deferOrder = [];
  coordinator.scheduleWrite(() => {
    deferOrder.push('WRITE-A');
    coordinator.scheduleRead(() => {
      deferOrder.push('DEFERRED-READ');
    });
  });

  coordinator.flush();
  assert(deferOrder.length === 1 && deferOrder[0] === 'WRITE-A', 'Read scheduled during Write phase deferred');

  coordinator.flush();
  assert(deferOrder.length === 2 && deferOrder[1] === 'DEFERRED-READ', 'Deferred read executed in subsequent frame read phase');

  // Test Task Cancellation
  const cancelLog = [];
  const taskId = coordinator.scheduleRead(() => {
    cancelLog.push('SHOULD_NOT_RUN');
  });
  const cancelSuccess = coordinator.cancel(taskId);
  assert(cancelSuccess === true, 'Task canceled successfully');
  coordinator.flush();
  assert(cancelLog.length === 0, 'Canceled task was not executed');

  coordinator.dispose();
}

// -----------------------------------------------------------------------------
// Test Suite 7: CSS Isolation Layer ('contain: layout size style')
// -----------------------------------------------------------------------------
console.log('\n🔒 Test Suite 7: CSS Isolation Layer (contain: layout size style)');
{
  const coordinator = new LayoutPhaseCoordinator();
  const mockCard = {
    style: {
      contain: '',
      removeProperty(k) {
        if (k === 'contain') this.contain = '';
      },
    },
  };

  // Apply default containment
  const restore = coordinator.isolateElement(mockCard);
  assert(mockCard.style.contain === 'layout size style', 'Element isolated with "layout size style"');

  // Revert containment
  restore();
  assert(mockCard.style.contain === '', 'Original containment restored cleanly');

  // Test preserving existing containment
  mockCard.style.contain = 'paint';
  const restoreCustom = coordinator.isolateElement(mockCard, { containment: 'layout style' });
  assert(mockCard.style.contain === 'layout style', 'Custom containment applied');
  restoreCustom();
  assert(mockCard.style.contain === 'paint', 'Previous custom containment "paint" restored');

  coordinator.dispose();
}

// -----------------------------------------------------------------------------
// Test Suite 8: TokenSyncCoordinator Bidirectional Synchronization
// -----------------------------------------------------------------------------
console.log('\n🔄 Test Suite 8: TokenSyncCoordinator Bidirectional Synchronization');
await (async () => {
  const mockDoc = { adoptedStyleSheets: [] };
  const engine = new ConstructableMutationEngine({
    scope: mockDoc,
    defaultSelector: ':root',
  });

  const sync = new TokenSyncCoordinator({
    mutationEngine: engine,
    astDebounceMs: 40,
    initialTokens: {
      '--color-brand': '#10b981',
      '--radius-card': '8px',
    },
  });

  assert(sync.getToken('--color-brand') === '#10b981', 'Initial token retrieved from AST store');

  // 1. Slider Event: Immediate CSSOM + Debounced AST Store
  const sliderEvents = [];
  sync.subscribeToToken('--color-brand', (e) => {
    sliderEvents.push(e);
  });

  sync.dispatchFromSlider('--color-brand', '#059669');

  // Immediate: CSSOM rule is scheduled
  engine.flush();
  const rule = engine.getOrCreateRule(':root');
  assert(rule.style.getPropertyValue('--color-brand') === '#059669', 'CSSOM updated immediately from Slider event');
  assert(sync.getToken('--color-brand') === '#10b981', 'AST store NOT yet updated immediately (debounce active)');
  assert(sliderEvents.length === 0, 'No listener fired yet before debounce elapsed');

  // Wait 60ms for debounce timer to fire
  await wait(60);

  assert(sync.getToken('--color-brand') === '#059669', 'AST store updated after 40ms debounce timer');
  assert(sliderEvents.length === 1, 'Token listener fired after debounce');
  assert(sliderEvents[0].source === 'SLIDER', 'Event source flagged as SLIDER');
  assert(sliderEvents[0].value === '#059669', 'Event carries new value');

  // 2. Code Editor Event: Immediate AST store + Immediate CSSOM
  const editorEvents = [];
  sync.subscribeToToken('--radius-card', (e) => {
    editorEvents.push(e);
  });

  sync.dispatchFromCodeEditor('--radius-card', '16px', { immediate: true });

  assert(sync.getToken('--radius-card') === '16px', 'AST store updated immediately from Code Editor');
  assert(rule.style.getPropertyValue('--radius-card') === '16px', 'CSSOM updated immediately from Code Editor');
  assert(editorEvents.length === 1, 'Code Editor listener notified immediately');
  assert(editorEvents[0].source === 'CODE_EDITOR', 'Event source is CODE_EDITOR');

  // 3. AST Sync Batch Event
  sync.dispatchFromAstSync({
    '--color-bg': '#f8fafc',
    '--color-fg': '#0f172a',
  });

  assert(sync.getToken('--color-bg') === '#f8fafc', 'AST batch token --color-bg recorded');
  assert(sync.getToken('--color-fg') === '#0f172a', 'AST batch token --color-fg recorded');

  sync.dispose();
  engine.dispose();
})();

// -----------------------------------------------------------------------------
// Test Suite 9: Transaction Reentrancy Lock & Feedback Loop Immunity
// -----------------------------------------------------------------------------
console.log('\n🔁 Test Suite 9: Transaction Reentrancy Lock & Feedback Loop Immunity');
{
  const sync = new TokenSyncCoordinator({
    astDebounceMs: 20,
  });

  let loopTriggerCount = 0;

  // Simulate an echo loop: listener that erroneously attempts to dispatch back to the same source
  sync.subscribeToToken('--test-loop', (e) => {
    loopTriggerCount++;
    if (loopTriggerCount < 10) {
      // Reentrant dispatch attempt with same source
      sync.dispatchFromCodeEditor('--test-loop', `val-${loopTriggerCount}`);
    }
  });

  sync.dispatchFromCodeEditor('--test-loop', 'val-0');

  // Due to Reentrancy Lock, re-dispatching inside the same source transaction is suppressed
  assert(loopTriggerCount === 1, `Loop safely blocked by reentrancy lock (invoked ${loopTriggerCount} time)`);
  assert(sync.isLocked === false, 'Reentrancy lock cleanly released after transaction');

  // Test Transaction Exception Safety
  try {
    sync.runTransaction('API', () => {
      throw new Error('Simulated Transaction Failure');
    });
  } catch (err) {
    // Expected
  }
  assert(sync.isLocked === false, 'Reentrancy lock unlocked even when exception thrown');
  assert(sync.activeSource === null, 'activeSource reset to null after exception');

  sync.dispose();
}

// -----------------------------------------------------------------------------
// Test Suite 10: Lifecycle, Disposal & System Facade Integration
// -----------------------------------------------------------------------------
console.log('\n🧹 Test Suite 10: Lifecycle, Disposal & System Facade Integration');
{
  const mockDoc = { adoptedStyleSheets: [] };
  const system = createConstructableMutationSystem({
    scope: mockDoc,
    defaultSelector: ':root',
    astDebounceMs: 30,
    initialTokens: {
      '--system-ready': 'true',
    },
  });

  assert(system.mutationEngine instanceof ConstructableMutationEngine, 'System contains mutationEngine');
  assert(system.coordinator instanceof LayoutPhaseCoordinator, 'System contains coordinator');
  assert(system.tokenSync instanceof TokenSyncCoordinator, 'System contains tokenSync');

  // Verify interaction
  system.tokenSync.dispatchFromCodeEditor('--system-ready', 'active', { immediate: true });
  assert(system.tokenSync.getToken('--system-ready') === 'active', 'System token updated');

  // Dispose whole system cleanly
  system.dispose();
  assert(mockDoc.adoptedStyleSheets.length === 0, 'Stylesheets cleaned up');
  assert(system.coordinator.readQueue.length === 0, 'Coordinator queues empty');
  assert(system.tokenSync.tokenStore.size === 0, 'Token store emptied');
}

// -----------------------------------------------------------------------------
// Test Suite 11: Adversarial LayoutPhaseCoordinator Queue & Reentrant Isolation
// -----------------------------------------------------------------------------
console.log('\n🔥 Test Suite 11: Adversarial Coordinator Queue & Reentrant Isolation');
{
  const coordinator = new LayoutPhaseCoordinator();
  const executionTrail = [];

  // Write scheduled during Write phase must defer to NEXT frame write queue without dropping tasks
  coordinator.scheduleWrite(() => {
    executionTrail.push('FRAME-1-WRITE-A');
    coordinator.scheduleWrite(() => {
      executionTrail.push('FRAME-2-WRITE-DEFERRED');
    });
    coordinator.scheduleRead(() => {
      executionTrail.push('FRAME-2-READ-DEFERRED');
    });
  });

  coordinator.flush();
  assert(executionTrail.length === 1 && executionTrail[0] === 'FRAME-1-WRITE-A', 'Frame 1 writes executed cleanly');

  // Next frame flush: READ must run before WRITE!
  coordinator.flush();
  assert(
    executionTrail.length === 3 &&
    executionTrail[1] === 'FRAME-2-READ-DEFERRED' &&
    executionTrail[2] === 'FRAME-2-WRITE-DEFERRED',
    `Frame 2 deferred tasks executed in strict READ -> WRITE order: ${executionTrail.join(' -> ')}`
  );

  // Test Nested Reentrant Element Isolation with Reference Counting
  const multiIsoElement = {
    style: {
      contain: 'paint',
      removeProperty(k) {
        if (k === 'contain') this.contain = '';
      },
    },
  };

  const restore1 = coordinator.isolateElement(multiIsoElement, { containment: 'layout size style' });
  assert(multiIsoElement.style.contain === 'layout size style', 'First isolation applied');

  const restore2 = coordinator.isolateElement(multiIsoElement, { containment: 'strict' });
  assert(multiIsoElement.style.contain === 'strict', 'Second isolation applied');

  // First release: should not yet revert to original because second isolation is still active
  restore1();
  assert(multiIsoElement.style.contain === 'strict', 'Original containment not prematurely restored');

  // Second release: all isolations released, must restore original "paint"
  restore2();
  assert(multiIsoElement.style.contain === 'paint', 'Original containment "paint" fully restored after all releases');

  coordinator.dispose();
}

// -----------------------------------------------------------------------------
// Test Suite 12: Adversarial TokenSyncCoordinator Source Differentiation & Debounce Commit
// -----------------------------------------------------------------------------
console.log('\n⚔️ Test Suite 12: Adversarial TokenSync Source Differentiation & Debounce Commit');
{
  const sync = new TokenSyncCoordinator({
    astDebounceMs: 200, // long debounce
    initialTokens: {
      '--color-base': '#000000',
      '--color-derived': '#111111',
    },
  });

  // 1. Verify flushDebounced commits pending changes immediately without dropping data
  sync.dispatchFromSlider('--color-base', '#abcdef');
  assert(sync.getToken('--color-base') === '#000000', 'Token not yet committed to store before debounce');
  sync.flushDebounced();
  assert(sync.getToken('--color-base') === '#abcdef', 'flushDebounced successfully committed pending slider value to tokenStore');

  // 2. Verify Cross-Source Echo Blocking:
  // When CODE_EDITOR is active, SLIDER echo is blocked;
  // But nested same-source cascading token update (CODE_EDITOR -> CODE_EDITOR) is permitted.
  let sliderEchoBlocked = false;
  let derivedCascadeSucceeded = false;

  sync.subscribeToToken('--cascade-parent', (e) => {
    if (e.source === 'CODE_EDITOR') {
      // Attempt 1: Echo from SLIDER (should be blocked)
      sync.dispatchFromSlider('--cascade-parent', 'illegal-echo-from-slider');
      if (sync.isSourceBlocked('SLIDER')) {
        sliderEchoBlocked = true;
      }
      // Attempt 2: Derived cascade from CODE_EDITOR (should succeed)
      sync.dispatchFromCodeEditor('--color-derived', '#222222');
      if (sync.getToken('--color-derived') === '#222222') {
        derivedCascadeSucceeded = true;
      }
    }
  });

  sync.dispatchFromCodeEditor('--cascade-parent', 'start');
  assert(sliderEchoBlocked === true, 'Cross-source echo from SLIDER blocked during CODE_EDITOR transaction');
  assert(derivedCascadeSucceeded === true, 'Same-source nested cascade permitted for CODE_EDITOR derived token');

  // 3. Verify Runaway Recursion Blocking:
  // Same source runaway loop beyond maxReentrancyDepth (5) is blocked
  let runawayCount = 0;
  sync.subscribeToToken('--runaway-test', () => {
    runawayCount++;
    sync.dispatchFromCodeEditor('--runaway-test', `depth-${runawayCount}`);
  });

  sync.dispatchFromCodeEditor('--runaway-test', 'depth-0');
  assert(runawayCount <= 5, `Runaway recursion capped at max depth (invoked ${runawayCount} times <= 5)`);
  assert(sync.reentrancyDepth === 0, 'Reentrancy depth cleanly unwound to 0');
  assert(sync.isLocked === false, 'Coordinator lock cleanly released');

  sync.dispose();
}

// -----------------------------------------------------------------------------
// Test Suite 13: Regex Escaping & Scope Fallback Robustness
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 13: Regex Escaping & Scope Fallback Robustness');
{
  const mockStyleEl = {
    textContent: '',
    sheet: null, // Force textContent fallback branch
  };

  const mockDocFallback = {
    nodeType: 9,
    head: {
      appendChild(child) {},
    },
    getElementById(id) {
      return mockStyleEl;
    },
  };

  const origCSS = globalThis.CSSStyleSheet;
  delete globalThis.CSSStyleSheet;

  const fallbackEngine = new ConstructableMutationEngine({
    scope: mockDocFallback,
  });

  // Verify complex selector with special regex characters doesn't crash or fail
  const complexSelector = '[data-theme="luminous"] > .btn-primary:first-child';
  fallbackEngine.mutateImmediate(complexSelector, '--glow-color', 'rgba(255, 255, 255, 0.8)', 'important');
  assert(mockStyleEl.textContent.includes(complexSelector), 'Complex selector written to fallback textContent');
  assert(mockStyleEl.textContent.includes('--glow-color: rgba(255, 255, 255, 0.8) !important;'), 'Property declaration correctly formatted');

  // Update existing rule for same complex selector
  fallbackEngine.mutateImmediate(complexSelector, '--glow-color', '#ffffff');
  assert(mockStyleEl.textContent.includes('--glow-color: #ffffff;'), 'Complex selector rule updated without regex syntax error');

  // Verify hasAdoptedStyleSheetsSupport returns false for plain HTMLElement
  const plainElement = { nodeType: 1, tagName: 'DIV' };
  assert(hasAdoptedStyleSheetsSupport(plainElement) === false, 'hasAdoptedStyleSheetsSupport correctly returns false for plain HTMLElement');

  fallbackEngine.dispose();
  globalThis.CSSStyleSheet = origCSS;
}

// -----------------------------------------------------------------------------
// Final Verification Summary
// -----------------------------------------------------------------------------
console.log('\n============================================================');
console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests} assertions passed)`);
console.log('============================================================\n');
