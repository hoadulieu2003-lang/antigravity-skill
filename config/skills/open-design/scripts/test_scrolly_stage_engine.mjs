/**
 * 🧪 Comprehensive Test Suite for ScrollyStageEngine
 * ===================================================
 * Complete end-to-end unit, integration, and adversarial tests:
 *  1. Module Structure & Exports (ESM & UMD)
 *  2. SSR Safety (Zero crash in Node runtime without DOM)
 *  3. Timeline Distribution Math & Track Height Calculations
 *  4. GSAP Ticker Master Bridge & Lenis Synchronization (autoRaf: false, lagSmoothing(500, 33))
 *  5. Safe Pinning Guard (assertNoTransformedAncestor checks)
 *  6. DOM Simulation: Stage & Multi-Scene Lifecycle
 *  7. Chapter Markers & Scrub Progress Bar Navigation
 *  8. Battery Watchdog: IntersectionObserver & Pause/Resume
 *  9. Accessibility (prefers-reduced-motion) & TIER_LITE Fallback
 * 10. Lifecycle Cleanup & Memory Leak Immunity
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ScrollyStageEngine,
  assertNoTransformedAncestor,
  setupGsapTickerBridge,
  calculateSceneTimeline,
  calculateTrackHeight,
  calculateLockedVh,
  lockViewportHeight,
  isTierLite,
  prefersReducedMotion,
  clamp,
  lerp,
  isBrowser,
} from './scrolly_stage_engine.js';

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

console.log('🚀 Starting ScrollyStageEngine Test Suite...\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Module Structure & Exports
// -----------------------------------------------------------------------------
console.log('📦 Test Suite 1: Module Structure & Exports (ESM & UMD)');
{
  assert(typeof ScrollyStageEngine === 'function', 'ScrollyStageEngine is exported as a class');
  assert(typeof assertNoTransformedAncestor === 'function', 'assertNoTransformedAncestor is exported as function');
  assert(typeof setupGsapTickerBridge === 'function', 'setupGsapTickerBridge is exported as function');
  assert(typeof calculateSceneTimeline === 'function', 'calculateSceneTimeline is exported as function');
  assert(typeof calculateTrackHeight === 'function', 'calculateTrackHeight is exported as function');
  assert(typeof calculateLockedVh === 'function', 'calculateLockedVh is exported as function');
  assert(typeof lockViewportHeight === 'function', 'lockViewportHeight is exported as function');
  assert(typeof isTierLite === 'function', 'isTierLite is exported as function');
  assert(typeof prefersReducedMotion === 'function', 'prefersReducedMotion is exported as function');
  assert(typeof clamp === 'function', 'clamp is exported as function');
  assert(typeof lerp === 'function', 'lerp is exported as function');
  assert(typeof isBrowser === 'function', 'isBrowser is exported as function');

  // Static methods on class
  assert(typeof ScrollyStageEngine.assertNoTransformedAncestor === 'function', 'ScrollyStageEngine has static assertNoTransformedAncestor');
  assert(typeof ScrollyStageEngine.setupGsapTickerBridge === 'function', 'ScrollyStageEngine has static setupGsapTickerBridge');
  assert(typeof ScrollyStageEngine.calculateSceneTimeline === 'function', 'ScrollyStageEngine has static calculateSceneTimeline');
  assert(typeof ScrollyStageEngine.calculateTrackHeight === 'function', 'ScrollyStageEngine has static calculateTrackHeight');
  assert(typeof ScrollyStageEngine.calculateLockedVh === 'function', 'ScrollyStageEngine has static calculateLockedVh');
  assert(typeof ScrollyStageEngine.lockViewportHeight === 'function', 'ScrollyStageEngine has static lockViewportHeight');
  assert(typeof ScrollyStageEngine.initAll === 'function', 'ScrollyStageEngine has static initAll');

  // Verify UMD script execution in sandbox
  const umdPath = path.join(__dirname, 'scrolly_stage_engine.umd.js');
  assert(fs.existsSync(umdPath), 'scrolly_stage_engine.umd.js exists');
  const umdContent = fs.readFileSync(umdPath, 'utf8');
  assert(umdContent.length > 500, 'scrolly_stage_engine.umd.js has valid content');

  // Load UMD via dynamic CommonJS mock
  const cjsModule = { exports: {} };
  const mockGlobal = {};
  const runUmd = new Function('module', 'exports', 'global', 'window', 'document', umdContent);
  runUmd(cjsModule, cjsModule.exports, mockGlobal, undefined, undefined);

  assert(typeof cjsModule.exports.ScrollyStageEngine === 'function', 'UMD exports ScrollyStageEngine');
  assert(typeof cjsModule.exports.assertNoTransformedAncestor === 'function', 'UMD exports assertNoTransformedAncestor');
  assert(typeof cjsModule.exports.setupGsapTickerBridge === 'function', 'UMD exports setupGsapTickerBridge');
}

// -----------------------------------------------------------------------------
// Test Suite 2: SSR Safety (Node.js runtime without DOM)
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 2: SSR Safety (Node.js runtime without DOM)');
{
  assert(isBrowser() === false, 'isBrowser() returns false in standard Node runtime');

  const engine = new ScrollyStageEngine();
  assert(engine instanceof ScrollyStageEngine, 'Engine instantiates cleanly without window/document');

  // All methods must be safe no-ops in SSR
  engine.init();
  engine.update(0.5);
  engine.goToScene(1);
  engine.nextScene();
  engine.prevScene();
  engine.seek(0.8);
  engine.pause();
  engine.resume();
  engine.refresh();
  engine.destroy();
  assert(engine.isDestroyed === true, 'SSR engine destroy marks isDestroyed = true');

  const allResult = ScrollyStageEngine.initAll();
  assert(Array.isArray(allResult.instances) && allResult.instances.length === 0, 'SSR initAll returns empty instances');
  assert(typeof allResult.destroy === 'function', 'SSR initAll returns callable destroy()');

  assert(calculateLockedVh() === 8.0, 'calculateLockedVh() returns 8.0 fallback in SSR');
  assert(lockViewportHeight() === 8.0, 'lockViewportHeight() returns 8.0 fallback in SSR');

  const check = assertNoTransformedAncestor(null);
  assert(check.safe === true, 'assertNoTransformedAncestor(null) is safe in SSR');
  assert(check.suggestedPinType === 'fixed', 'assertNoTransformedAncestor defaults to fixed in SSR');
}

// -----------------------------------------------------------------------------
// Test Suite 3: Timeline Distribution Math & Track Heights
// -----------------------------------------------------------------------------
console.log('\n📐 Test Suite 3: Timeline Distribution Math & Track Heights');
{
  // Track heights
  assert(calculateTrackHeight(1) === '100vh', 'N=1 yields trackHeight 100vh');
  assert(calculateTrackHeight(4) === '400vh', 'N=4 yields trackHeight 400vh');
  assert(calculateTrackHeight(6, 120) === '720vh', 'N=6 with trackMultiplier 120 yields 720vh');
  assert(calculateTrackHeight(0) === '100vh', 'N=0 clamps to minimum 1 scene (100vh)');

  // Timeline with 0 scenes
  const t0 = calculateSceneTimeline(0.5, 0);
  assert(t0.globalProgress === 0.5, 'N=0 preserves clamped globalProgress');
  assert(t0.activeIndex === 0, 'N=0 activeIndex is 0');
  assert(t0.sceneProgresses.length === 0, 'N=0 sceneProgresses is empty');

  // Timeline with 1 scene
  const t1 = calculateSceneTimeline(0.7, 1);
  assert(t1.activeIndex === 0, 'N=1 activeIndex is always 0');
  assert(t1.sceneProgress === 0.7, 'N=1 sceneProgress equals global progress');
  assert(t1.sceneProgresses[0] === 0.7, 'N=1 sceneProgresses contains progress');

  // Timeline with 3 scenes (Points: Scene 0 = 0.0, Scene 1 = 0.5, Scene 2 = 1.0)
  // At progress 0.0 (Scene 0 active)
  const t3_start = calculateSceneTimeline(0.0, 3);
  assert(t3_start.activeIndex === 0, 'Progress 0.0: activeIndex is 0');
  assert(t3_start.sceneProgresses[0] === 1.0, 'Progress 0.0: scene 0 weight is 1.0');
  assert(t3_start.sceneProgresses[1] === 0.0, 'Progress 0.0: scene 1 weight is 0.0');
  assert(t3_start.sceneProgresses[2] === 0.0, 'Progress 0.0: scene 2 weight is 0.0');

  // At progress 0.25 (Midway between Scene 0 and Scene 1)
  const t3_mid1 = calculateSceneTimeline(0.25, 3);
  assert(t3_mid1.sceneProgresses[0] === 0.5, 'Progress 0.25: scene 0 weight is 0.5');
  assert(t3_mid1.sceneProgresses[1] === 0.5, 'Progress 0.25: scene 1 weight is 0.5');
  assert(t3_mid1.sceneProgresses[2] === 0.0, 'Progress 0.25: scene 2 weight is 0.0');
  assert(Math.abs(t3_mid1.sceneProgress - 0.5) < 1e-4, 'Progress 0.25: local segment progress is 0.5');

  // At progress 0.5 (Scene 1 active)
  const t3_mid2 = calculateSceneTimeline(0.5, 3);
  assert(t3_mid2.activeIndex === 1, 'Progress 0.5: activeIndex is 1');
  assert(t3_mid2.sceneProgresses[0] === 0.0, 'Progress 0.5: scene 0 weight is 0.0');
  assert(t3_mid2.sceneProgresses[1] === 1.0, 'Progress 0.5: scene 1 weight is 1.0');
  assert(t3_mid2.sceneProgresses[2] === 0.0, 'Progress 0.5: scene 2 weight is 0.0');

  // At progress 0.75 (Midway between Scene 1 and Scene 2)
  const t3_mid3 = calculateSceneTimeline(0.75, 3);
  assert(t3_mid3.sceneProgresses[0] === 0.0, 'Progress 0.75: scene 0 weight is 0.0');
  assert(t3_mid3.sceneProgresses[1] === 0.5, 'Progress 0.75: scene 1 weight is 0.5');
  assert(t3_mid3.sceneProgresses[2] === 0.5, 'Progress 0.75: scene 2 weight is 0.5');

  // At progress 1.0 (Scene 2 active)
  const t3_end = calculateSceneTimeline(1.0, 3);
  assert(t3_end.activeIndex === 2, 'Progress 1.0: activeIndex is 2');
  assert(t3_end.sceneProgresses[0] === 0.0, 'Progress 1.0: scene 0 weight is 0.0');
  assert(t3_end.sceneProgresses[1] === 0.0, 'Progress 1.0: scene 1 weight is 0.0');
  assert(t3_end.sceneProgresses[2] === 1.0, 'Progress 1.0: scene 2 weight is 1.0');

  // Clamp & bounds safety
  const t_neg = calculateSceneTimeline(-0.8, 3);
  assert(t_neg.globalProgress === 0.0, 'Negative progress clamped to 0.0');
  assert(t_neg.activeIndex === 0, 'Negative progress activeIndex is 0');

  const t_overflow = calculateSceneTimeline(2.5, 3);
  assert(t_overflow.globalProgress === 1.0, 'Overflow progress clamped to 1.0');
  assert(t_overflow.activeIndex === 2, 'Overflow progress activeIndex is 2');

  const t_nan = calculateSceneTimeline(NaN, 3);
  assert(t_nan.globalProgress === 0.0, 'NaN progress clamped to 0.0');
}

// -----------------------------------------------------------------------------
// Test Suite 4: GSAP Ticker Master Bridge & Lenis Synchronization
// -----------------------------------------------------------------------------
console.log('\n⚡ Test Suite 4: GSAP Ticker Master Bridge & Lenis Synchronization');
{
  let lagSmoothingArgs = null;
  let tickerCallbacks = [];
  const mockGsap = {
    ticker: {
      lagSmoothing: (threshold, adjustedLag) => {
        lagSmoothingArgs = { threshold, adjustedLag };
      },
      add: (fn) => {
        tickerCallbacks.push(fn);
      },
      remove: (fn) => {
        tickerCallbacks = tickerCallbacks.filter((cb) => cb !== fn);
      },
    },
  };

  let lenisRafCalledWith = null;
  let lenisStopped = false;
  let lenisStarted = false;
  let lenisScrollCallbacks = [];
  const mockLenis = {
    options: {
      autoRaf: true, // starts with autoRaf: true to test automatic disabling
    },
    scroll: 350,
    stop: () => { lenisStopped = true; },
    start: () => { lenisStarted = true; },
    raf: (ms) => { lenisRafCalledWith = ms; },
    scrollTo: (y) => { mockLenis.scroll = y; },
    resize: () => {},
    on: (evt, cb) => {
      if (evt === 'scroll') lenisScrollCallbacks.push(cb);
    },
    off: (evt, cb) => {
      if (evt === 'scroll') lenisScrollCallbacks = lenisScrollCallbacks.filter((c) => c !== cb);
    },
  };

  let scrollerProxyConfig = null;
  let scrollTriggerListeners = {};
  let scrollTriggerUpdated = false;
  const mockScrollTrigger = {
    scrollerProxy: (target, config) => {
      scrollerProxyConfig = { target, config };
    },
    update: () => {
      scrollTriggerUpdated = true;
    },
    addEventListener: (evt, cb) => {
      scrollTriggerListeners[evt] = cb;
    },
    removeEventListener: (evt) => {
      delete scrollTriggerListeners[evt];
    },
  };

  const bridge = setupGsapTickerBridge({
    gsap: mockGsap,
    lenis: mockLenis,
    ScrollTrigger: mockScrollTrigger,
    scroller: { id: 'mock-scroller' },
    pinType: 'fixed',
  });

  assert(bridge.isConnected === true, 'setupGsapTickerBridge reports isConnected: true');
  assert(mockLenis.options.autoRaf === false, 'Lenis autoRaf was automatically disabled to prevent double-ticking');
  assert(lenisStopped === true && lenisStarted === true, 'Lenis internal rAF was halted cleanly');
  assert(lagSmoothingArgs && lagSmoothingArgs.threshold === 500 && lagSmoothingArgs.adjustedLag === 33, 'gsap.ticker.lagSmoothing(500, 33) set');
  assert(tickerCallbacks.length === 1, 'Ticker listener was added to gsap.ticker');

  // Trigger ticker with time = 2.5 seconds (should pass 2500ms to lenis.raf)
  tickerCallbacks[0](2.5);
  assert(lenisRafCalledWith === 2500, 'gsap.ticker callback converts seconds to milliseconds: 2.5s -> 2500ms');

  // Verify scrollerProxy
  assert(scrollerProxyConfig !== null, 'scrollerProxy was configured on mockScroller');
  assert(scrollerProxyConfig.config.pinType === 'fixed', 'scrollerProxy pinType is fixed');
  assert(scrollerProxyConfig.config.scrollTop() === 350, 'scrollerProxy.scrollTop() reads lenis.scroll (350)');

  scrollerProxyConfig.config.scrollTop(700);
  assert(mockLenis.scroll === 700, 'scrollerProxy.scrollTop(700) passes scroll target to lenis');

  // Verify lenis on('scroll') triggers ScrollTrigger.update()
  assert(lenisScrollCallbacks.length === 1, 'Lenis scroll callback registered');
  lenisScrollCallbacks[0]();
  assert(scrollTriggerUpdated === true, 'Lenis scroll triggers ScrollTrigger.update()');

  // Test teardown / destroy
  bridge.destroy();
  assert(tickerCallbacks.length === 0, 'bridge.destroy() cleans up gsap.ticker listener');
  assert(lenisScrollCallbacks.length === 0, 'bridge.destroy() cleans up lenis scroll listener');
  assert(Object.keys(scrollTriggerListeners).length === 0, 'bridge.destroy() cleans up ScrollTrigger refresh listener');
}

// -----------------------------------------------------------------------------
// Test Suite 5: Safe Pinning Guard (assertNoTransformedAncestor)
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 5: Safe Pinning Guard (assertNoTransformedAncestor)');
{
  // Build a simulated DOM tree in JS
  function createMockElement(tagName, id = '', className = '') {
    const computedStyles = {
      transform: 'none',
      filter: 'none',
      perspective: 'none',
      contain: '',
      willChange: '',
    };
    return {
      tagName: tagName.toUpperCase(),
      id,
      className,
      parentElement: null,
      _computedStyles: computedStyles,
      style: {
        setProperty: () => {},
        removeProperty: () => {},
      },
      getAttribute: () => null,
      setAttribute: () => {},
    };
  }

  // Setup mock window & document
  const mockDocElement = createMockElement('html');
  const mockBody = createMockElement('body');
  mockBody.parentElement = mockDocElement;

  const mockGrandParent = createMockElement('div', 'grand-parent');
  mockGrandParent.parentElement = mockBody;

  const mockParent = createMockElement('section', 'parent-wrapper');
  mockParent.parentElement = mockGrandParent;

  const mockStage = createMockElement('div', 'scrolly-stage');
  mockStage.parentElement = mockParent;

  // Mock global environment for assertNoTransformedAncestor
  globalThis.window = {
    getComputedStyle: (el) => el._computedStyles || {},
    innerHeight: 900,
    innerWidth: 1440,
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  globalThis.document = {
    documentElement: mockDocElement,
    body: mockBody,
  };

  // Case 1: Clean tree
  const cleanResult = assertNoTransformedAncestor(mockStage);
  assert(cleanResult.safe === true, 'Clean ancestor tree is safe');
  assert(cleanResult.suggestedPinType === 'fixed', 'Clean tree suggests pinType: fixed');
  assert(cleanResult.transformedAncestor === null, 'No transformed ancestor found on clean tree');

  // Case 2: Parent with CSS transform
  mockParent._computedStyles.transform = 'translate3d(0px, 10px, 0px)';
  const transformResult = assertNoTransformedAncestor(mockStage);
  assert(transformResult.safe === false, 'Transform ancestor detected as unsafe');
  assert(transformResult.suggestedPinType === 'transform', 'Transform ancestor suggests pinType: transform');
  assert(transformResult.property === 'transform', 'Property flagged as transform');
  assert(transformResult.transformedAncestor === mockParent, 'Identified exact ancestor element');
  mockParent._computedStyles.transform = 'none'; // reset

  // Case 3: Grandparent with CSS filter
  mockGrandParent._computedStyles.filter = 'blur(10px)';
  const filterResult = assertNoTransformedAncestor(mockStage);
  assert(filterResult.safe === false, 'Filter ancestor detected as unsafe');
  assert(filterResult.suggestedPinType === 'transform', 'Filter ancestor suggests pinType: transform');
  assert(filterResult.property === 'filter', 'Property flagged as filter');
  mockGrandParent._computedStyles.filter = 'none'; // reset

  // Case 4: Parent with CSS perspective
  mockParent._computedStyles.perspective = '1000px';
  const perspResult = assertNoTransformedAncestor(mockStage);
  assert(perspResult.safe === false, 'Perspective ancestor detected as unsafe');
  assert(perspResult.suggestedPinType === 'transform', 'Perspective ancestor suggests pinType: transform');
  mockParent._computedStyles.perspective = 'none'; // reset

  // Case 5: Grandparent with CSS contain: paint
  mockGrandParent._computedStyles.contain = 'paint layout';
  const containResult = assertNoTransformedAncestor(mockStage);
  assert(containResult.safe === false, 'Contain paint/layout detected as unsafe');
  assert(containResult.suggestedPinType === 'transform', 'Contain suggests pinType: transform');
  mockGrandParent._computedStyles.contain = ''; // reset

  // Case 6: Parent with CSS will-change: transform
  mockParent._computedStyles.willChange = 'transform, opacity';
  const willChangeResult = assertNoTransformedAncestor(mockStage);
  assert(willChangeResult.safe === false, 'will-change: transform detected as unsafe');
  assert(willChangeResult.suggestedPinType === 'transform', 'will-change suggests pinType: transform');
  mockParent._computedStyles.willChange = ''; // reset
}

// -----------------------------------------------------------------------------
// Test Suite 6: DOM Simulation: Multi-Scene Lifecycle & GPU Transitions
// -----------------------------------------------------------------------------
console.log('\n🎭 Test Suite 6: DOM Simulation: Multi-Scene Lifecycle & GPU Transitions');
{
  class MockDOMElement {
    constructor(tagName) {
      this.tagName = tagName.toUpperCase();
      this.style = {
        setProperty: (k, v) => { this.style[k] = String(v); },
        removeProperty: (k) => { delete this.style[k]; },
      };
      this.attributes = {};
      this.children = [];
      this.parentElement = null;
      this.listeners = {};
    }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
    appendChild(child) {
      this.children.push(child);
      child.parentElement = this;
      return child;
    }
    remove() {
      if (this.parentElement) {
        this.parentElement.children = this.parentElement.children.filter((c) => c !== this);
        this.parentElement = null;
      }
    }
    addEventListener(evt, fn) {
      if (!this.listeners[evt]) this.listeners[evt] = [];
      this.listeners[evt].push(fn);
    }
    removeEventListener(evt, fn) {
      if (this.listeners[evt]) {
        this.listeners[evt] = this.listeners[evt].filter((f) => f !== fn);
      }
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    getBoundingClientRect() {
      return { top: 0, left: 0, width: 1440, height: 900 };
    }
  }

  // Construct Mock Scene Elements
  const containerEl = new MockDOMElement('div');
  const stageEl = new MockDOMElement('div');
  containerEl.appendChild(stageEl);

  const scene0El = new MockDOMElement('div');
  const scene1El = new MockDOMElement('div');
  const scene2El = new MockDOMElement('div');
  stageEl.appendChild(scene0El);
  stageEl.appendChild(scene1El);
  stageEl.appendChild(scene2El);

  globalThis.document.createElement = (tag) => new MockDOMElement(tag);

  let onProgressRecord = [];
  let onSceneChangeRecord = [];
  let scene0EnterDirection = null;
  let scene0LeaveDirection = null;
  let scene1EnterDirection = null;

  const engine = new ScrollyStageEngine({
    container: containerEl,
    stage: stageEl,
    scenes: [
      {
        id: 'intro',
        title: 'Scene 1: The Spark',
        element: scene0El,
        transition: 'fade',
        onEnter: (s, dir) => { scene0EnterDirection = dir; },
        onLeave: (s, dir) => { scene0LeaveDirection = dir; },
      },
      {
        id: 'expansion',
        title: 'Scene 2: Hyper-Scale',
        element: scene1El,
        transition: 'slide',
        onEnter: (s, dir) => { scene1EnterDirection = dir; },
      },
      {
        id: 'synthesis',
        title: 'Scene 3: The Pinnacle',
        element: scene2El,
        transition: 'zoom',
      },
    ],
    progressBar: true,
    chapterMarkers: true,
    trackMultiplier: 100,
    onProgress: (gProg, actIdx, scnProg) => {
      onProgressRecord.push({ gProg, actIdx, scnProg });
    },
    onSceneChange: (currIdx, prevIdx) => {
      onSceneChangeRecord.push({ currIdx, prevIdx });
    },
  });

  // Verify Container & Stage Layout
  assert(containerEl.style.height === '300vh', 'Container height set to 300vh for 3 scenes');
  assert(containerEl.getAttribute('data-scene-count') === '3', 'Container data-scene-count is 3');
  assert(stageEl.getAttribute('data-scrolly-stage') === 'true', 'Stage data-scrolly-stage attribute set');
  assert(stageEl.style.position === 'sticky', 'Stage position is sticky');

  // Verify Progress Bar & Chapter Markers auto-creation
  assert(engine.progressBar !== null, 'Progress bar element auto-created');
  assert(engine.chapterMarkers.length === 3, '3 chapter marker dots auto-created');

  // Test Initial Frame 0
  assert(engine.activeIndex === 0, 'Initial activeIndex is 0');
  assert(scene0El.style.opacity === '1.000', 'Scene 0 initial opacity is 1.000');
  assert(scene1El.style.opacity === '0.000', 'Scene 1 initial opacity is 0.000');
  assert(scene0El.style.visibility === 'visible', 'Scene 0 is visible');
  assert(scene1El.style.visibility === 'hidden', 'Scene 1 is hidden');

  // Update to progress = 0.5 (Scene 1 fully active)
  engine.update(0.5);
  assert(engine.activeIndex === 1, 'Progress 0.5: activeIndex is 1');
  assert(scene0LeaveDirection === 'forward', 'Scene 0 onLeave called with direction "forward"');
  assert(scene1EnterDirection === 'forward', 'Scene 1 onEnter called with direction "forward"');
  assert(onSceneChangeRecord.length === 1, 'onSceneChange triggered once');
  assert(onSceneChangeRecord[0].currIdx === 1 && onSceneChangeRecord[0].prevIdx === 0, 'onSceneChange recorded 0 -> 1 transition');

  // Check GPU Transform on Scene 1 (slide transition)
  assert(scene1El.style.transform === 'translate3d(0, 0.00px, 0)', 'Scene 1 slide transition reached resting origin translate3d(0, 0, 0)');
  assert(scene1El.style.opacity === '1.000', 'Scene 1 opacity reached 1.000');
  assert(scene0El.style.opacity === '0.000', 'Scene 0 opacity transitioned to 0.000');

  // Check Progress Bar scale
  assert(engine.progressBar.style.transform === 'scaleX(0.5)', 'Progress bar scaleX is 0.5');

  // Check Chapter Markers highlight
  assert(engine.chapterMarkers[0].getAttribute('aria-current') === 'false', 'Marker 0 is inactive');
  assert(engine.chapterMarkers[1].getAttribute('aria-current') === 'step', 'Marker 1 is active (aria-current="step")');
  assert(engine.chapterMarkers[1].getAttribute('data-active') === 'true', 'Marker 1 data-active is true');

  // Update to progress = 1.0 (Scene 2 fully active - zoom transition)
  engine.update(1.0);
  assert(engine.activeIndex === 2, 'Progress 1.0: activeIndex is 2');
  assert(scene2El.style.opacity === '1.000', 'Scene 2 opacity is 1.000');
  assert(scene2El.style.transform === 'translate3d(0, 0, 0) scale(1.000)', 'Scene 2 zoom reached scale(1.000)');

  // Backward navigation: Update to progress = 0.0
  engine.update(0.0);
  assert(engine.activeIndex === 0, 'Progress 0.0: back to Scene 0');
  assert(scene0EnterDirection === 'backward', 'Scene 0 re-entered with direction "backward"');

  engine.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 7: Chapter Markers & Scrub Progress Navigation (Click & Seek)
// -----------------------------------------------------------------------------
console.log('\n🧭 Test Suite 7: Chapter Markers & Scrub Progress Navigation');
{
  class MockElementSimple {
    constructor(tagName = 'DIV') {
      this.tagName = tagName.toUpperCase();
      this.style = {
        setProperty: (k, v) => { this.style[k] = String(v); },
        removeProperty: (k) => { delete this.style[k]; },
      };
      this.attributes = {};
      this.listeners = {};
      this.children = [];
      this.parentElement = null;
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    removeAttribute(k) { delete this.attributes[k]; }
    appendChild(child) {
      this.children.push(child);
      child.parentElement = this;
      return child;
    }
    remove() {
      if (this.parentElement) {
        this.parentElement.children = this.parentElement.children.filter((c) => c !== this);
        this.parentElement = null;
      }
    }
    addEventListener(evt, fn) {
      if (!this.listeners[evt]) this.listeners[evt] = [];
      this.listeners[evt].push(fn);
    }
    removeEventListener(evt, fn) {
      if (this.listeners[evt]) this.listeners[evt] = this.listeners[evt].filter((f) => f !== fn);
    }
    getBoundingClientRect() {
      return { top: 100, left: 50, width: 800, height: 3000 };
    }
  }

  const container = new MockElementSimple();
  const stage = new MockElementSimple();
  const s0 = new MockElementSimple();
  const s1 = new MockElementSimple();
  const s2 = new MockElementSimple();
  const s3 = new MockElementSimple();

  let scrolledToY = null;
  globalThis.window.scrollTo = (opts) => {
    scrolledToY = opts.top;
  };
  globalThis.window.scrollY = 0;

  const engine = new ScrollyStageEngine({
    container,
    stage,
    scenes: [
      { id: 'c1', element: s0 },
      { id: 'c2', element: s1 },
      { id: 'c3', element: s2 },
      { id: 'c4', element: s3 },
    ],
    progressBar: true,
    chapterMarkers: true,
  });

  // N = 4 scenes. Target progress points:
  // Scene 0: 0 / 3 = 0.0
  // Scene 1: 1 / 3 = 0.3333
  // Scene 2: 2 / 3 = 0.6667
  // Scene 3: 3 / 3 = 1.0

  // 1. goToScene(2)
  engine.goToScene(2, { smooth: false });
  assert(Math.abs(engine.progress - 2 / 3) < 1e-4, 'goToScene(2) navigates to progress 2/3');
  assert(engine.activeIndex === 2, 'goToScene(2) sets activeIndex to 2');
  assert(typeof scrolledToY === 'number' && scrolledToY > 0, 'window.scrollTo was called with positive target Y');

  // 2. nextScene() from 2 -> 3
  engine.nextScene();
  assert(engine.activeIndex === 3, 'nextScene() advances to scene 3');
  assert(Math.abs(engine.progress - 1.0) < 1e-4, 'Scene 3 has progress 1.0');

  // 3. prevScene() from 3 -> 2
  engine.prevScene();
  assert(engine.activeIndex === 2, 'prevScene() returns to scene 2');

  // 4. goToScene out of bounds clamping
  engine.goToScene(99);
  assert(engine.activeIndex === 3, 'goToScene(99) clamped to last scene (3)');

  engine.goToScene(-10);
  assert(engine.activeIndex === 0, 'goToScene(-10) clamped to first scene (0)');

  // 5. Test Chapter Marker click
  assert(engine.chapterMarkers.length === 4, '4 chapter marker buttons present');
  const marker1 = engine.chapterMarkers[1];
  assert(marker1.listeners['click'] && marker1.listeners['click'].length === 1, 'Marker 1 has click handler');
  // Simulate click on Marker 1
  marker1.listeners['click'][0]({ preventDefault: () => {} });
  assert(engine.activeIndex === 1, 'Clicking Marker 1 navigates to Scene 1');

  // 6. Test Progress Bar Click
  const pBar = engine.progressBar;
  assert(pBar.listeners['click'] && pBar.listeners['click'].length === 1, 'Progress bar has click listener');
  // Click at clientX = 450 on rect { left: 50, width: 800 } -> ratio = (450 - 50) / 800 = 0.5
  pBar.getBoundingClientRect = () => ({ left: 50, width: 800 });
  pBar.listeners['click'][0]({ clientX: 450 });
  assert(Math.abs(engine.progress - 0.5) < 1e-4, 'Progress bar click at 50% width seeks to progress 0.5');

  engine.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 8: Battery Watchdog (IntersectionObserver) & Pause/Resume
// -----------------------------------------------------------------------------
console.log('\n🔋 Test Suite 8: Battery Watchdog (IntersectionObserver) & Pause/Resume');
{
  class MockElement {
    constructor(tagName = 'DIV') {
      this.tagName = tagName.toUpperCase();
      this.style = {};
      this.attributes = {};
      this.children = [];
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    removeAttribute(k) { delete this.attributes[k]; }
    addEventListener() {}
    removeEventListener() {}
    getBoundingClientRect() { return { top: 0, left: 0, width: 1000, height: 2000 }; }
  }

  let ioCallback = null;
  let ioObservedTarget = null;
  let ioDisconnected = false;

  globalThis.window.IntersectionObserver = class MockIntersectionObserver {
    constructor(cb) {
      ioCallback = cb;
    }
    observe(target) {
      ioObservedTarget = target;
    }
    disconnect() {
      ioDisconnected = true;
    }
  };

  const container = new MockElement();
  const stage = new MockElement();
  const s0 = new MockElement();
  const s1 = new MockElement();

  let updateCount = 0;
  const engine = new ScrollyStageEngine({
    container,
    stage,
    scenes: [{ id: '1', element: s0 }, { id: '2', element: s1 }],
    onProgress: () => { updateCount++; },
  });

  assert(ioObservedTarget === container, 'IntersectionObserver is observing stage container');

  // Trigger off-screen scroll event
  assert(engine.isViewportActive === true, 'Initially active');
  ioCallback([{ target: container, isIntersecting: false }]);
  assert(engine.isViewportActive === false, 'isViewportActive becomes false when off-screen');

  // While off-screen, pause works and updates are held
  const countBefore = updateCount;
  engine.update(0.7);
  // Engine update sets state
  assert(engine.progress === 0.7, 'Progress state stored');

  // Scroll back on-screen
  ioCallback([{ target: container, isIntersecting: true }]);
  assert(engine.isViewportActive === true, 'isViewportActive restored to true on screen re-entry');

  // Test manual pause() guard
  engine.pause();
  assert(engine.isPaused === true, 'engine.pause() sets isPaused = true');
  // When paused, off-screen -> on-screen DOES NOT auto-update
  updateCount = 0;
  ioCallback([{ target: container, isIntersecting: true }]);
  assert(updateCount === 0, 'IntersectionObserver re-entry respects manual pause() and does not force update');

  engine.resume();
  assert(engine.isPaused === false, 'engine.resume() clears isPaused flag');

  engine.destroy();
  assert(ioDisconnected === true, 'destroy() disconnects IntersectionObserver');
}

// -----------------------------------------------------------------------------
// Test Suite 9: Accessibility (prefers-reduced-motion) & TIER_LITE Fallback
// -----------------------------------------------------------------------------
console.log('\n♿ Test Suite 9: Accessibility (prefers-reduced-motion) & TIER_LITE Fallback');
{
  class MockElement {
    constructor(tagName = 'DIV') {
      this.tagName = tagName.toUpperCase();
      this.style = {};
      this.attributes = {};
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    removeAttribute(k) { delete this.attributes[k]; }
    addEventListener() {}
    removeEventListener() {}
    getBoundingClientRect() { return { top: 0, left: 0, width: 1000, height: 2000 }; }
  }

  // 1. Explicit reducedMotion: true
  const c1 = new MockElement();
  const st1 = new MockElement();
  const sc1 = new MockElement();
  const sc2 = new MockElement();

  const reducedEngine = new ScrollyStageEngine({
    container: c1,
    stage: st1,
    scenes: [
      { id: '1', element: sc1, transition: 'zoom' },
      { id: '2', element: sc2, transition: 'slide' },
    ],
    reducedMotion: true,
  });

  assert(reducedEngine.isReducedMotion === true, 'Engine honors reducedMotion: true');
  assert(sc1.style.willChange === 'opacity', 'willChange is restricted to opacity only under reduced motion');

  reducedEngine.update(0.5);
  // Under reduced motion: transform MUST be 'none', zero 3D matrix
  assert(sc1.style.transform === 'none', 'Scene 1 transform is "none" under reduced motion');
  assert(sc2.style.transform === 'none', 'Scene 2 transform is "none" under reduced motion');

  reducedEngine.destroy();

  // 2. TIER_LITE Detection Heuristics
  assert(isTierLite({ tier: 'lite' }) === true, 'isTierLite honors explicit { tier: "lite" }');
  assert(isTierLite({ tier: 'high' }) === false, 'isTierLite honors explicit { tier: "high" }');

  // Test navigator hardwareConcurrency heuristic
  try {
    Object.defineProperty(globalThis, 'navigator', {
      value: { hardwareConcurrency: 2, deviceMemory: 2 },
      configurable: true,
      writable: true,
    });
  } catch {
    globalThis.navigator = { hardwareConcurrency: 2, deviceMemory: 2 };
  }
  assert(isTierLite({}) === true, 'isTierLite detects dual-core / low-memory mobile hardware');

  try {
    Object.defineProperty(globalThis, 'navigator', {
      value: { hardwareConcurrency: 8, deviceMemory: 16 },
      configurable: true,
      writable: true,
    });
  } catch {
    globalThis.navigator = { hardwareConcurrency: 8, deviceMemory: 16 };
  }
  assert(isTierLite({}) === false, 'isTierLite detects high-end desktop hardware');
}

// -----------------------------------------------------------------------------
// Test Suite 10: Lifecycle & Memory Leak Audits
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 10: Lifecycle & Memory Leak Audits');
{
  class MockElementClean {
    constructor(tagName = 'DIV') {
      this.tagName = tagName.toUpperCase();
      this.style = { removeProperty: (k) => { delete this.style[k]; } };
      this.attributes = {};
      this.listeners = {};
    }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; }
    removeAttribute(k) { delete this.attributes[k]; }
    addEventListener(evt, fn) {
      if (!this.listeners[evt]) this.listeners[evt] = [];
      this.listeners[evt].push(fn);
    }
    removeEventListener(evt, fn) {
      if (this.listeners[evt]) this.listeners[evt] = this.listeners[evt].filter((f) => f !== fn);
    }
    getBoundingClientRect() { return { top: 0, left: 0, width: 1000, height: 2000 }; }
  }

  const c = new MockElementClean();
  const st = new MockElementClean();
  const engine = new ScrollyStageEngine({
    container: c,
    stage: st,
    scenes: [{ id: 'a' }, { id: 'b' }],
  });

  assert(engine.isDestroyed === false, 'Engine is not destroyed initially');
  assert(c.getAttribute('data-scrolly-container') === 'true', 'Container marked with attribute');

  // First destroy call
  engine.destroy();
  assert(engine.isDestroyed === true, 'Engine marked as destroyed');
  assert(c.getAttribute('data-scrolly-container') === null, 'data-scrolly-container attribute stripped');
  assert(st.getAttribute('data-scrolly-stage') === null, 'data-scrolly-stage attribute stripped');
  assert(engine.scenes.length === 0, 'scenes array emptied');

  // Idempotency: second destroy call must not throw
  try {
    engine.destroy();
    assert(true, 'Successive destroy() call is safe and idempotent');
  } catch (err) {
    assert(false, `Second destroy threw error: ${err}`);
  }

  // Verify TypeScript definition file
  const dtsPath = path.join(__dirname, 'scrolly_stage_engine.d.ts');
  assert(fs.existsSync(dtsPath), 'scrolly_stage_engine.d.ts exists');
  const dtsContent = fs.readFileSync(dtsPath, 'utf8');
  assert(dtsContent.includes('export declare class ScrollyStageEngine'), 'd.ts declares ScrollyStageEngine class');
  assert(dtsContent.includes('assertNoTransformedAncestor'), 'd.ts declares assertNoTransformedAncestor');
  assert(dtsContent.includes('setupGsapTickerBridge'), 'd.ts declares setupGsapTickerBridge');
}

console.log('\n========================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
console.log('========================================\n');
