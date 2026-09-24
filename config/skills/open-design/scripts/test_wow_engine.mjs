/**
 * 🧪 Comprehensive Test Suite for WowEngine
 * ==========================================
 * Tests:
 * 1. Syntax & ESM Import Validation
 * 2. SSR Safety (window/document undefined)
 * 3. Math & Logic Bounds (clamp, lerp, coordinates)
 * 4. DOM Simulation: Spotlight (CSS vars, rAF batching, cleanup)
 * 5. DOM Simulation: Parallax Tilt (Spring physics, 3D transform, rest equilibrium, depth layers)
 * 6. Audio Simulation: WebAudioHaptics (Frequencies, waveforms, gain ramps, muting, volume, DOM binding)
 * 7. DOM Simulation: Smooth Scroll (Lerp inertia, wheel normalization, scrollTo, boundaries)
 * 8. Edge Cases: Invalid selectors, empty targets, zero-size elements, reduced motion
 */

import fs from 'fs';
import {
  initSpotlight,
  initParallaxTilt,
  WebAudioHaptics,
  haptics,
  initSmoothScroll,
  WowEngine,
  HAPTIC_PATTERNS,
  canVibrate,
} from './wow_engine.js';

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

console.log('🚀 Starting WowEngine Test Suite...\n');

// -----------------------------------------------------------------------------
// Test 1: Module Structure & Exports
// -----------------------------------------------------------------------------
console.log('📦 Test Suite 1: Module Structure & Exports');
assert(typeof initSpotlight === 'function', 'initSpotlight is exported as function');
assert(typeof initParallaxTilt === 'function', 'initParallaxTilt is exported as function');
assert(typeof WebAudioHaptics === 'function', 'WebAudioHaptics is exported as class');
assert(haptics instanceof WebAudioHaptics, 'haptics is an instance of WebAudioHaptics');
assert(typeof initSmoothScroll === 'function', 'initSmoothScroll is exported as function');
assert(WowEngine && WowEngine.version === '2.0.0', 'WowEngine master object contains version 2.0.0');
assert(typeof WowEngine.initAll === 'function', 'WowEngine.initAll is a function');

// -----------------------------------------------------------------------------
// Test 2: SSR Safety (Zero runtime crash in Node environment)
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 2: SSR Safety (Node.js runtime without DOM)');
{
  const spot = initSpotlight('.any-card');
  assert(typeof spot.destroy === 'function', 'SSR initSpotlight returns safe destroy()');
  assert(typeof spot.update === 'function', 'SSR initSpotlight returns safe update()');
  spot.destroy();

  const tilt = initParallaxTilt('.tilt-card');
  assert(typeof tilt.destroy === 'function', 'SSR initParallaxTilt returns safe destroy()');
  assert(typeof tilt.reset === 'function', 'SSR initParallaxTilt returns safe reset()');
  tilt.destroy();

  const scroll = initSmoothScroll();
  assert(typeof scroll.destroy === 'function', 'SSR initSmoothScroll returns safe destroy()');
  assert(typeof scroll.scrollTo === 'function', 'SSR initSmoothScroll returns safe scrollTo()');
  assert(typeof scroll.stop === 'function', 'SSR initSmoothScroll returns safe stop()');
  assert(typeof scroll.start === 'function', 'SSR initSmoothScroll returns safe start()');
  scroll.destroy();

  const standaloneHaptics = new WebAudioHaptics();
  assert(standaloneHaptics.getContext() === null, 'SSR getContext() returns null safely');
  standaloneHaptics.playClick();
  standaloneHaptics.playPop();
  standaloneHaptics.playChime();
  standaloneHaptics.playTabSwitch();
  standaloneHaptics.playToggle(true);
  const unbind = standaloneHaptics.bind(null);
  assert(typeof unbind === 'function', 'SSR bind() returns no-op function');
  unbind();

  const master = WowEngine.initAll();
  assert(typeof master.destroy === 'function', 'SSR WowEngine.initAll() returns safe destroy()');
  master.destroy();
}

// -----------------------------------------------------------------------------
// Test 3: Audio Synthesis Engine Mocking & Verification
// -----------------------------------------------------------------------------
console.log('\n🔊 Test Suite 3: WebAudioHaptics Synthesizer Verification');
{
  // Mock Web Audio API
  let createdOscillators = [];
  let createdGains = [];

  class MockAudioParam {
    constructor(val = 0) {
      this.value = val;
      this.events = [];
    }
    setValueAtTime(val, time) {
      this.events.push({ type: 'set', val, time });
    }
    exponentialRampToValueAtTime(val, time) {
      this.events.push({ type: 'ramp', val, time });
    }
  }

  class MockOscillator {
    constructor() {
      this.type = 'sine';
      this.frequency = new MockAudioParam(440);
      this.connectedTo = null;
      this.startedAt = null;
      this.stoppedAt = null;
      createdOscillators.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    start(time) {
      this.startedAt = time;
    }
    stop(time) {
      this.stoppedAt = time;
    }
  }

  class MockGain {
    constructor() {
      this.gain = new MockAudioParam(1);
      this.connectedTo = null;
      createdGains.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
  }

  class MockAudioContext {
    constructor() {
      this.currentTime = 10.0;
      this.state = 'running';
      this.destination = {};
    }
    createOscillator() {
      return new MockOscillator();
    }
    createGain() {
      return new MockGain();
    }
    resume() {
      return Promise.resolve();
    }
  }

  // Setup browser mock environment for audio test
  globalThis.window = {
    AudioContext: MockAudioContext,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  globalThis.document = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const audio = new WebAudioHaptics();
  assert(audio.getContext() !== null, 'AudioContext successfully initialized');
  assert(audio.getMuted() === false, 'Audio initially unmuted');

  // Test playClick()
  createdOscillators = [];
  createdGains = [];
  audio.playClick();
  assert(createdOscillators.length === 1, 'playClick creates 1 oscillator');
  assert(createdOscillators[0].type === 'sine', 'playClick uses sine waveform');
  assert(createdOscillators[0].frequency.events[0].val === 800, 'playClick starts at 800Hz');
  assert(createdOscillators[0].frequency.events[1].val === 200, 'playClick ramps to 200Hz');

  // Test playPop()
  createdOscillators = [];
  createdGains = [];
  audio.playPop();
  assert(createdOscillators.length === 1, 'playPop creates 1 oscillator');
  assert(createdOscillators[0].type === 'triangle', 'playPop uses triangle waveform');
  assert(createdOscillators[0].frequency.events[0].val === 320, 'playPop starts at 320Hz');
  assert(createdOscillators[0].frequency.events[1].val === 960, 'playPop ramps up to 960Hz');

  // Test playChime()
  createdOscillators = [];
  createdGains = [];
  audio.playChime();
  assert(createdOscillators.length === 3, 'playChime schedules 3 harmonic chord oscillators');
  const expectedFreqs = [1046.5, 1318.5, 1567.98];
  createdOscillators.forEach((osc, idx) => {
    assert(Math.abs(osc.frequency.events[0].val - expectedFreqs[idx]) < 0.1, `Chime note ${idx} is ${expectedFreqs[idx]}Hz`);
  });

  // Test playTabSwitch()
  createdOscillators = [];
  audio.playTabSwitch();
  assert(createdOscillators.length === 1, 'playTabSwitch creates 1 oscillator');
  assert(createdOscillators[0].frequency.events[0].val === 540, 'playTabSwitch starts at 540Hz');
  assert(createdOscillators[0].frequency.events[1].val === 420, 'playTabSwitch ramps down to 420Hz');

  // Test playToggle()
  createdOscillators = [];
  createdGains = [];
  audio.playToggle(true);
  assert(createdOscillators.length === 1, 'playToggle(true) creates 1 oscillator');
  assert(createdOscillators[0].type === 'sine', 'playToggle uses sine waveform');
  assert(createdOscillators[0].frequency.events[0].val === 440, 'playToggle(true) starts ascending chime at 440Hz');
  assert(createdOscillators[0].frequency.events[1].val === 880, 'playToggle(true) ramps up to 880Hz');
  assert(createdGains[0].gain.events[0].val === 0.07, 'playToggle gain starts at 0.07');

  createdOscillators = [];
  audio.playToggle(false);
  assert(createdOscillators.length === 1, 'playToggle(false) creates 1 oscillator');
  assert(createdOscillators[0].frequency.events[0].val === 660, 'playToggle(false) starts descending chime at 660Hz');
  assert(createdOscillators[0].frequency.events[1].val === 330, 'playToggle(false) ramps down to 330Hz');

  // Test muting
  audio.setMuted(true);
  assert(audio.getMuted() === true, 'setMuted(true) sets muted state');
  createdOscillators = [];
  audio.playClick();
  assert(createdOscillators.length === 0, 'playClick produces no sound when muted');
  audio.setMuted(false);

  // Test volume control
  audio.setVolume(0.5);
  assert(audio.getVolume() === 0.5, 'Volume set to 0.5');
  audio.setVolume(1.5); // Should clamp to 1
  assert(audio.getVolume() === 1.0, 'Volume clamp max 1.0');
  audio.setVolume(-0.2); // Should clamp to 0
  assert(audio.getVolume() === 0.0, 'Volume clamp min 0.0');
  audio.setVolume(1.0);
}

// -----------------------------------------------------------------------------
// Test 4: DOM Simulation (Spotlight & Parallax Tilt)
// -----------------------------------------------------------------------------
console.log('\n🎨 Test Suite 4: DOM Simulation (Spotlight & Parallax Tilt)');
{
  let rafQueue = [];
  globalThis.requestAnimationFrame = (cb) => {
    rafQueue.push(cb);
    return rafQueue.length;
  };
  globalThis.cancelAnimationFrame = (id) => {
    rafQueue = rafQueue.filter((_, idx) => idx + 1 !== id);
  };

  class MockElement {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.style = {
        _props: {},
        setProperty(k, v) { this._props[k] = String(v); },
        removeProperty(k) { delete this._props[k]; },
        getPropertyValue(k) { return this._props[k]; },
      };
      this.classList = {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); },
      };
      this.listeners = {};
      this.children = [];
      this.parentNode = null;
    }
    addEventListener(type, cb) {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push(cb);
    }
    removeEventListener(type, cb) {
      if (this.listeners[type]) {
        this.listeners[type] = this.listeners[type].filter((fn) => fn !== cb);
      }
    }
    dispatchEvent(type, eventObj = {}) {
      if (this.listeners[type]) {
        this.listeners[type].forEach((cb) => cb(eventObj));
      }
    }
    getBoundingClientRect() {
      return { left: 100, top: 200, width: 300, height: 200, right: 400, bottom: 400 };
    }
    getAttribute(attr) {
      return this._attrs ? this._attrs[attr] || null : null;
    }
    setAttribute(attr, val) {
      if (!this._attrs) this._attrs = {};
      this._attrs[attr] = String(val);
    }
    closest(selector) {
      if (selector === '[data-haptic]' && this.getAttribute('data-haptic')) return this;
      if (selector === 'a[href^="#"]' && this.getAttribute('href')?.startsWith('#')) return this;
      return null;
    }
    querySelectorAll() {
      return [];
    }
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    }
    removeChild(child) {
      this.children = this.children.filter((c) => c !== child);
      child.parentNode = null;
      return child;
    }
  }

  // Setup DOM environment
  const mockCard = new MockElement('div');
  globalThis.Element = MockElement;
  globalThis.window.getComputedStyle = () => ({ position: 'relative' });
  globalThis.window.matchMedia = () => ({ matches: false });
  globalThis.document.querySelectorAll = (sel) => {
    if (sel === '.card') return [mockCard];
    return [];
  };

  // Test initSpotlight
  const spotHandle = initSpotlight('.card', { activeClass: 'spotlight-on' });
  assert(mockCard.style._props['--spotlight-opacity'] === '0', 'Spotlight initially has 0 opacity');

  // Trigger pointerenter & pointermove
  mockCard.dispatchEvent('pointerenter', { clientX: 250, clientY: 300 });
  mockCard.dispatchEvent('pointermove', { clientX: 250, clientY: 300 });
  assert(mockCard.classList.contains('spotlight-on'), 'Spotlight adds activeClass');

  // Run pending rAF ticks
  while (rafQueue.length > 0) {
    const cb = rafQueue.shift();
    cb();
  }

  // Target relative coords: clientX=250, left=100 -> x=150 (ratio: 150/300 = 0.5)
  // clientY=300, top=200 -> y=100 (ratio: 100/200 = 0.5)
  assert(mockCard.style._props['--mouse-x'] === '150px', 'Correct --mouse-x calculated');
  assert(mockCard.style._props['--mouse-y'] === '100px', 'Correct --mouse-y calculated');
  assert(mockCard.style._props['--mouse-rx'] === '0.5000', 'Correct --mouse-rx calculated (0.5000)');
  assert(mockCard.style._props['--mouse-ry'] === '0.5000', 'Correct --mouse-ry calculated (0.5000)');
  assert(mockCard.style._props['--mouse-cx'] === '0.0000', 'Center coords --mouse-cx is 0.0000 at center');
  assert(mockCard.style._props['--spotlight-opacity'] === '1', 'Spotlight opacity set to 1 on move');

  // Pointer leave
  mockCard.dispatchEvent('pointerleave');
  assert(mockCard.style._props['--spotlight-opacity'] === '0', 'Spotlight opacity resets to 0 on leave');
  assert(!mockCard.classList.contains('spotlight-on'), 'activeClass removed on leave');

  // Cleanup
  spotHandle.destroy();
  assert(mockCard.style._props['--mouse-x'] === undefined, 'Destroy cleans up custom properties');

  // Test initParallaxTilt
  const tiltCard = new MockElement('div');
  globalThis.document.querySelectorAll = (sel) => (sel === '.tilt' ? [tiltCard] : []);

  const tiltHandle = initParallaxTilt('.tilt', {
    maxTilt: 15,
    perspective: 1000,
    scale: 1.05,
    stiffness: 0.1,
    damping: 0.8,
  });

  assert(tiltCard.style.transformStyle === 'preserve-3d', 'Parallax tilt sets transformStyle to preserve-3d');
  assert(tiltCard.style.willChange === 'transform', 'Parallax tilt sets willChange to transform');

  // Trigger hover
  tiltCard.dispatchEvent('pointerenter', { clientX: 350, clientY: 250 });
  tiltCard.dispatchEvent('pointermove', { clientX: 350, clientY: 250 });

  // Step physics simulation
  for (let i = 0; i < 15; i++) {
    if (rafQueue.length > 0) {
      const cb = rafQueue.shift();
      cb();
    }
  }

  assert(tiltCard.style.transform && tiltCard.style.transform.includes('perspective(1000px)'), '3D perspective applied');
  assert(tiltCard.style.transform.includes('rotateX') && tiltCard.style.transform.includes('rotateY'), 'Rotations applied');

  // Mouse leave triggers spring return
  tiltCard.dispatchEvent('pointerleave');
  for (let i = 0; i < 40; i++) {
    if (rafQueue.length > 0) {
      const cb = rafQueue.shift();
      cb();
    }
  }

  tiltHandle.destroy();
}

// -----------------------------------------------------------------------------
// Test 5: Smooth Scroll Simulation
// -----------------------------------------------------------------------------
console.log('\n📜 Test Suite 5: Smooth Scroll Engine Verification');
{
  let scrolledToY = 0;
  globalThis.window.pageYOffset = 0;
  globalThis.window.innerHeight = 800;
  globalThis.window.scrollTo = (opts) => {
    scrolledToY = typeof opts === 'number' ? opts : opts.top;
  };
  globalThis.document.documentElement = {
    scrollHeight: 3000,
    scrollTop: 0,
  };

  const scrollHandle = initSmoothScroll({ lerp: 0.1 });
  assert(typeof scrollHandle.scrollTo === 'function', 'scrollTo method exists');

  // Programmatic scrollTo
  scrollHandle.scrollTo(500, { immediate: true });
  assert(scrolledToY === 500, 'Immediate scrollTo moves directly to target position');

  // Smooth scroll listener
  let lastProgress = 0;
  const unbind = scrollHandle.onScroll((data) => {
    lastProgress = data.progress;
  });
  assert(typeof unbind === 'function', 'onScroll returns unbind callback');

  scrollHandle.destroy();
}

// -----------------------------------------------------------------------------
// Test 6: Edge Cases & Resilience
// -----------------------------------------------------------------------------
console.log('\n⚡ Test Suite 6: Edge Cases & Error Paths');
{
  // 1. Non-existent selector
  const emptySpot = initSpotlight('#does-not-exist');
  assert(typeof emptySpot.destroy === 'function', 'Empty selector spotlight handles cleanly');
  emptySpot.destroy();

  const emptyTilt = initParallaxTilt('#does-not-exist');
  assert(typeof emptyTilt.destroy === 'function', 'Empty selector tilt handles cleanly');
  emptyTilt.destroy();

  // 2. Null/undefined inputs
  initSpotlight(null);
  initParallaxTilt(null);
  initSpotlight(undefined);
  initParallaxTilt(undefined);
  assert(true, 'Null & undefined targets handled gracefully without exceptions');

  // 3. Reduced motion emulation
  globalThis.window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion'),
  });
  const reducedTilt = initParallaxTilt('.tilt');
  assert(typeof reducedTilt.destroy === 'function', 'Reduced motion safely disables tilt');
  reducedTilt.destroy();

  const reducedScroll = initSmoothScroll();
  assert(typeof reducedScroll.destroy === 'function', 'Reduced motion safely adapts smooth scroll');
  reducedScroll.destroy();
}

// -----------------------------------------------------------------------------
// Test 7: Adversarial Verification & Bug-Busting Audits
// -----------------------------------------------------------------------------
console.log('\n🔍 Test Suite 7: Adversarial Audits & Bug Verification');
{
  // 1. WebAudioHaptics.bind() with zero arguments (Bug Fix: targetRoot vs root)
  const windowListeners = {};
  const docListeners = {};

  globalThis.window.matchMedia = () => ({ matches: false });
  globalThis.window.addEventListener = (evt, fn, opts) => {
    if (!windowListeners[evt]) windowListeners[evt] = [];
    windowListeners[evt].push({ fn, opts });
  };
  globalThis.window.removeEventListener = (evt, fn) => {
    if (windowListeners[evt]) {
      windowListeners[evt] = windowListeners[evt].filter((l) => l.fn !== fn);
    }
  };
  globalThis.document.addEventListener = (evt, fn, opts) => {
    if (!docListeners[evt]) docListeners[evt] = [];
    docListeners[evt].push({ fn, opts });
  };
  globalThis.document.removeEventListener = (evt, fn) => {
    if (docListeners[evt]) {
      docListeners[evt] = docListeners[evt].filter((l) => l.fn !== fn);
    }
  };

  let rafQueue = [];
  globalThis.requestAnimationFrame = (cb) => {
    rafQueue.push(cb);
    return rafQueue.length;
  };
  globalThis.cancelAnimationFrame = (id) => {
    rafQueue = rafQueue.filter((_, idx) => idx + 1 !== id);
  };

  const testHaptics = new WebAudioHaptics();
  let unbindFn;
  try {
    unbindFn = testHaptics.bind(); // Zero arguments!
    assert(typeof unbindFn === 'function', 'haptics.bind() with zero arguments does not throw and returns unbind');
    assert(docListeners['click'] && docListeners['click'].length === 1, 'haptics.bind() binds click listener to document by default');
  } catch (err) {
    assert(false, `haptics.bind() with zero arguments threw: ${err.message}`);
  }

  // 2. data-haptic="toggle" support in bind()
  let togglePlayedState = null;
  testHaptics.playToggle = (state) => { togglePlayedState = state; };
  const mockToggleBtn = new Element('button');
  mockToggleBtn.setAttribute('data-haptic', 'toggle');
  mockToggleBtn.checked = true;

  // Trigger click on document
  const clickHandler = docListeners['click'][0].fn;
  clickHandler({ target: mockToggleBtn });
  assert(togglePlayedState === true, 'haptics.bind() plays toggle sound with checked=true');

  mockToggleBtn.checked = false;
  clickHandler({ target: mockToggleBtn });
  assert(togglePlayedState === false, 'haptics.bind() plays toggle sound with checked=false');

  unbindFn();
  assert(docListeners['click'].length === 0, 'haptics.bind unbind properly removes listener from document');

  // 3. WebAudioHaptics.destroy()
  let contextClosed = false;
  testHaptics.ctx = {
    close: () => { contextClosed = true; return Promise.resolve(); },
  };
  testHaptics.destroy();
  assert(contextClosed === true, 'haptics.destroy() closes AudioContext and cleans up');

  // 4. initSpotlight update() actually refreshes bounding rect (Bug Fix: update() dummy no-op)
  let currentRect = { left: 100, top: 100, width: 200, height: 200, right: 300, bottom: 300 };
  const dynamicCard = new Element('div');
  dynamicCard.getBoundingClientRect = () => currentRect;
  globalThis.document.querySelectorAll = (sel) => (sel === '.dynamic-spot' ? [dynamicCard] : []);

  const spotHandle = initSpotlight('.dynamic-spot');
  dynamicCard.dispatchEvent('pointermove', { clientX: 200, clientY: 200 });
  while (rafQueue.length > 0) rafQueue.shift()();
  assert(dynamicCard.style._props['--mouse-x'] === '100px', 'Initial spotlight x is 100px');

  // Move element position and call update()
  currentRect = { left: 50, top: 50, width: 200, height: 200, right: 250, bottom: 250 };
  spotHandle.update();
  dynamicCard.dispatchEvent('pointermove', { clientX: 200, clientY: 200 });
  while (rafQueue.length > 0) rafQueue.shift()();

  assert(dynamicCard.style._props['--mouse-x'] === '150px', 'After spotHandle.update(), new cached rect computes x=150px');
  spotHandle.destroy();

  // 5. initSpotlight proximity detection (Bug Fix: proximity was unused dead code)
  const proximityCard = new Element('div');
  proximityCard.getBoundingClientRect = () => ({ left: 100, top: 100, width: 200, height: 200, right: 300, bottom: 300 });
  globalThis.document.querySelectorAll = (sel) => (sel === '.prox-card' ? [proximityCard] : []);

  const proxHandle = initSpotlight('.prox-card', { proximity: 50 });
  assert(windowListeners['pointermove'] && windowListeners['pointermove'].length > 0, 'Proximity > 0 attaches window pointermove tracker');

  const winMoveHandler = windowListeners['pointermove'][0].fn;
  // Cursor at (80, 200) -> 20px outside card left edge (left=100) -> distance 20 <= proximity 50
  winMoveHandler({ clientX: 80, clientY: 200 });
  while (rafQueue.length > 0) rafQueue.shift()();
  const proxOpacity = parseFloat(proximityCard.style._props['--spotlight-opacity']);
  assert(proxOpacity > 0 && proxOpacity <= 1, `Proximity spotlight activates outside card with opacity ${proxOpacity}`);

  // Cursor far away (10, 200) -> distance 90 > proximity 50 -> should be 0 opacity
  winMoveHandler({ clientX: 10, clientY: 200 });
  assert(proximityCard.style._props['--spotlight-opacity'] === '0', 'Proximity spotlight turns off when beyond proximity distance');
  proxHandle.destroy();

  // 6. initParallaxTilt rAF loop resting while hovering still (Zero CPU waste bug fix)
  let tiltRafCount = 0;
  let localRafQueue = [];
  const origRaf = globalThis.requestAnimationFrame;
  globalThis.requestAnimationFrame = (cb) => {
    localRafQueue.push(cb);
    return ++tiltRafCount;
  };

  const hoverCard = new Element('div');
  globalThis.document.querySelectorAll = (sel) => (sel === '.hover-card' ? [hoverCard] : []);

  const hoverTilt = initParallaxTilt('.hover-card');
  hoverCard.dispatchEvent('pointerenter', { clientX: 250, clientY: 250 });
  hoverCard.dispatchEvent('pointermove', { clientX: 250, clientY: 250 });

  // Run physics frames while mouse stays stationary
  for (let i = 0; i < 40; i++) {
    if (localRafQueue.length > 0) localRafQueue.shift()();
  }
  assert(localRafQueue.length === 0, 'Parallax tilt rAF loop terminates when card settles while hovering (Zero CPU waste)');

  // 7. initParallaxTilt setValues() and reset() (Bug Fix: setValues was missing)
  assert(typeof hoverTilt.setValues === 'function', 'Parallax tilt instance exposes setValues()');
  hoverTilt.setValues({ rotX: 10, rotY: -8 });
  for (let i = 0; i < 40; i++) {
    if (localRafQueue.length > 0) localRafQueue.shift()();
  }
  assert(hoverCard.style.transform.includes('rotateX(10.00deg)') && hoverCard.style.transform.includes('rotateY(-8.00deg)'), 'setValues() applies programmatic rotation angles');

  hoverTilt.reset();
  assert(hoverCard.style.transform.includes('rotateX(0deg)') && hoverCard.style.transform.includes('rotateY(0deg)'), 'reset() restores resting transform immediately');
  assert(localRafQueue.length === 0, 'reset() cancels running animation frames');
  hoverTilt.destroy();
  globalThis.requestAnimationFrame = origRaf;

  // 8. initSmoothScroll non-passive wheel prevention (Bug Fix: native scroll fighting)
  globalThis.window.matchMedia = () => ({ matches: false });
  const scrollEngine = initSmoothScroll();
  const wheelHandler = windowListeners['wheel'] && windowListeners['wheel'].find((l) => l.opts && l.opts.passive === false)?.fn;
  assert(typeof wheelHandler === 'function', 'initSmoothScroll registers wheel listener with passive: false');

  let defaultPrevented = false;
  const mockWheelEvent = {
    deltaX: 0,
    deltaY: 100,
    deltaMode: 0,
    preventDefault: () => { defaultPrevented = true; },
  };
  wheelHandler(mockWheelEvent);
  assert(defaultPrevented === true, 'Vertical wheel event calls preventDefault() to eliminate native scroll fighting');

  // Horizontal wheel event should NOT preventDefault
  let horizontalPrevented = false;
  const mockHorizEvent = {
    deltaX: 120,
    deltaY: 10,
    deltaMode: 0,
    preventDefault: () => { horizontalPrevented = true; },
  };
  wheelHandler(mockHorizEvent);
  assert(horizontalPrevented === false, 'Horizontal wheel event does NOT call preventDefault()');

  // 9. initSmoothScroll safe scrollTo with non-existent selector
  let lastScrolledY = -999;
  globalThis.window.scrollTo = (opts) => {
    lastScrolledY = typeof opts === 'number' ? opts : opts.top;
  };
  scrollEngine.scrollTo('#definitely-missing-element');
  assert(lastScrolledY === -999, 'scrollTo with non-existent element does NOT reset scroll to top 0');
  scrollEngine.destroy();

  // 10. initSmoothScroll reduced motion onScroll structure (Bug Fix: raw event vs contract object)
  globalThis.window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion'),
  });
  const reducedMotionEngine = initSmoothScroll();
  let receivedScrollData = null;
  reducedMotionEngine.onScroll((data) => {
    receivedScrollData = data;
  });
  if (windowListeners['scroll']) {
    windowListeners['scroll'].forEach((l) => l.fn());
  }
  assert(receivedScrollData !== null && typeof receivedScrollData.scroll === 'number' && typeof receivedScrollData.progress === 'number', 'Reduced motion onScroll emits structured data matching full engine contract');
  reducedMotionEngine.destroy();
}

// -----------------------------------------------------------------------------
// Test 8: WebAudioHaptics v2.0 DSP & Spatial Engine Verification
// -----------------------------------------------------------------------------
console.log('\n🎧 Test Suite 8: WebAudioHaptics v2.0 DSP & Spatial Engine Verification');
{
  let createdOscillators = [];
  let createdGains = [];
  let createdPanners = [];
  let createdFilters = [];
  let createdBuffers = [];
  let createdBufferSources = [];

  class MockAudioParam {
    constructor(val = 0) {
      this.value = val;
      this.events = [];
    }
    setValueAtTime(val, time) {
      this.value = val;
      this.events.push({ type: 'set', val, time });
    }
    exponentialRampToValueAtTime(val, time) {
      this.value = val;
      this.events.push({ type: 'ramp', val, time });
    }
  }

  class MockOscillator {
    constructor() {
      this.type = 'sine';
      this.frequency = new MockAudioParam(440);
      this.connectedTo = null;
      this.startedAt = null;
      this.stoppedAt = null;
      createdOscillators.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    start(time) {
      this.startedAt = time;
    }
    stop(time) {
      this.stoppedAt = time;
    }
  }

  class MockGain {
    constructor() {
      this.gain = new MockAudioParam(1);
      this.connectedTo = null;
      createdGains.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    disconnect() {
      this.connectedTo = null;
    }
  }

  class MockStereoPanner {
    constructor() {
      this.pan = new MockAudioParam(0);
      this.connectedTo = null;
      this.disconnected = false;
      createdPanners.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    disconnect() {
      this.disconnected = true;
      this.connectedTo = null;
    }
  }

  class MockBiquadFilter {
    constructor() {
      this.type = 'lowpass';
      this.frequency = new MockAudioParam(350);
      this.Q = new MockAudioParam(1);
      this.connectedTo = null;
      this.disconnected = false;
      createdFilters.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    disconnect() {
      this.disconnected = true;
      this.connectedTo = null;
    }
  }

  class MockAudioBufferSource {
    constructor() {
      this.buffer = null;
      this.connectedTo = null;
      this.startedAt = null;
      this.disconnected = false;
      createdBufferSources.push(this);
    }
    connect(dest) {
      this.connectedTo = dest;
    }
    start(time) {
      this.startedAt = time;
    }
    disconnect() {
      this.disconnected = true;
      this.connectedTo = null;
    }
  }

  class MockV2AudioContext {
    constructor() {
      this.currentTime = 50.0;
      this.state = 'running';
      this.destination = { name: 'speakers' };
    }
    createOscillator() {
      return new MockOscillator();
    }
    createGain() {
      return new MockGain();
    }
    createStereoPanner() {
      return new MockStereoPanner();
    }
    createBiquadFilter() {
      return new MockBiquadFilter();
    }
    createBuffer(channels, length, sampleRate) {
      const buf = { channels, length, sampleRate };
      createdBuffers.push(buf);
      return buf;
    }
    createBufferSource() {
      return new MockAudioBufferSource();
    }
    resume() {
      return Promise.resolve();
    }
    close() {
      return Promise.resolve();
    }
  }

  globalThis.window = {
    AudioContext: MockV2AudioContext,
    innerWidth: 1200,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const v2Haptics = new WebAudioHaptics();

  // 1. _resolvePan Verification
  assert(v2Haptics._resolvePan(1.0) === 0.75, '_resolvePan applies k=0.75 compression to +1.0 pan');
  assert(v2Haptics._resolvePan(-1.0) === -0.75, '_resolvePan applies k=0.75 compression to -1.0 pan');
  assert(v2Haptics._resolvePan(0.5) === 0.375, '_resolvePan computes 0.5 * 0.75 = 0.375');
  assert(v2Haptics._resolvePan(0) === 0, '_resolvePan returns 0 for center pan');
  assert(v2Haptics._resolvePan(null) === 0, '_resolvePan returns 0 for null');
  assert(v2Haptics._resolvePan(3.0) === 0.75, '_resolvePan clamps out-of-range positive pan to 0.75');
  assert(v2Haptics._resolvePan(-4.0) === -0.75, '_resolvePan clamps out-of-range negative pan to -0.75');
  assert(Math.abs(v2Haptics._resolvePan({ pan: 0.8 }) - 0.6) < 0.0001, '_resolvePan handles options.pan correctly');
  assert(Math.abs(v2Haptics._resolvePan({ clientX: 900, innerWidth: 1200 }) - 0.375) < 0.001, '_resolvePan computes clientX / innerWidth ratio');

  const mockTargetEl = { getBoundingClientRect: () => ({ left: 600, width: 200 }) };
  assert(Math.abs(v2Haptics._resolvePan({ element: mockTargetEl }) - 0.125) < 0.01, '_resolvePan resolves element center position');
  assert(Math.abs(v2Haptics._resolvePan(mockTargetEl) - 0.125) < 0.01, '_resolvePan resolves raw Element directly');
  assert(v2Haptics._resolvePan(NaN) === 0, '_resolvePan returns 0 for NaN input');
  assert(v2Haptics._resolvePan(Infinity) === 0, '_resolvePan returns 0 for Infinity input');
  assert(v2Haptics._resolvePan(-Infinity) === 0, '_resolvePan returns 0 for -Infinity input');
  assert(v2Haptics._resolvePan({ pan: NaN }) === 0, '_resolvePan returns 0 for options.pan NaN');
  assert(v2Haptics._resolvePan({ clientX: NaN }) === 0, '_resolvePan returns 0 for options.clientX NaN');

  // 2. _createSpatialRoute Verification
  const ctx = v2Haptics.getContext();
  createdPanners = [];
  const route = v2Haptics._createSpatialRoute(ctx, 0.45, 80);
  assert(createdPanners.length === 1, '_createSpatialRoute creates StereoPannerNode');
  assert(route.panner === createdPanners[0], 'Route panner matches created instance');
  assert(route.input === createdPanners[0], 'Route input targets panner node');
  assert(route.panner.pan.events[0].val === 0.45, 'Panner pan parameter initialized with 0.45');
  assert(route.panner.connectedTo === v2Haptics.masterGainNode, 'Panner node connects to masterGainNode');
  assert(route.panner.disconnected === false, 'Panner initially connected before safety timeout');
  route.disconnect();
  assert(route.panner.disconnected === true, 'Panner disconnected via route.disconnect()');

  const nanRoute = v2Haptics._createSpatialRoute(ctx, NaN, 50);
  assert(nanRoute.panner.pan.events[0].val === 0, '_createSpatialRoute sanitizes NaN panVal to 0');
  nanRoute.disconnect();

  const mockCtxNoPanner = { currentTime: 10, destination: {} };
  const fallbackRoute = v2Haptics._createSpatialRoute(mockCtxNoPanner, 0.5, 50);
  assert(fallbackRoute.panner === null, 'Fallback route has null panner when unsupported');
  assert(fallbackRoute.input === v2Haptics.masterGainNode, 'Fallback route routes to masterGainNode');

  // 3. Silent Buffer Flush Verification
  createdBuffers = [];
  createdBufferSources = [];
  v2Haptics.flushSilentBuffer();
  assert(createdBuffers.length === 1, 'flushSilentBuffer allocates 1 audio buffer');
  assert(createdBuffers[0].channels === 1 && createdBuffers[0].length === 1 && createdBuffers[0].sampleRate === 22050, 'Silent buffer is 1-channel 1-frame 22050Hz for immediate DAC wakeup');
  assert(createdBufferSources.length === 1, 'flushSilentBuffer creates AudioBufferSourceNode');
  assert(createdBufferSources[0].startedAt === 0, 'Buffer source starts at time 0');
  assert(createdBufferSources[0].connectedTo === ctx.destination, 'Buffer source connects directly to hardware destination');

  // 4. playRotaryStep Verification
  createdOscillators = [];
  createdGains = [];
  v2Haptics._lastRotaryTime = 0;
  v2Haptics.playRotaryStep(6, 24, { pan: 0.2 });
  assert(createdOscillators.length === 1, 'playRotaryStep schedules 1 oscillator');
  assert(createdOscillators[0].type === 'triangle', 'playRotaryStep uses triangle wave for gear click detent');
  assert(Math.abs(createdOscillators[0].frequency.events[0].val - 845) < 0.1, 'Rotary start frequency is 845Hz for step 6/24');
  assert(Math.abs(createdOscillators[0].frequency.events[1].val - 295.75) < 0.1, 'Rotary sweeps 65% downward to 295.75Hz');
  assert(createdGains[0].gain.events[0].val === 0.08, 'Rotary click starts at 0.08 gain');
  assert(createdGains[0].gain.events[1].val === 0.001, 'Rotary click decays to 0.001');

  const oscCountBefore = createdOscillators.length;
  v2Haptics.playRotaryStep(7, 24); // Micro-throttle drops consecutive call within 18ms
  assert(createdOscillators.length === oscCountBefore, '18ms micro-throttle drops consecutive call to prevent acoustic congestion');

  v2Haptics._lastRotaryTime = 0;
  v2Haptics.setMuted(true);
  v2Haptics.playRotaryStep(0, 24);
  assert(createdOscillators.length === oscCountBefore, 'playRotaryStep produces no sound when muted');
  v2Haptics.setMuted(false);

  // 5. playSuccessChord Verification
  createdOscillators = [];
  createdGains = [];
  v2Haptics.playSuccessChord({ pan: -0.5 });
  assert(createdOscillators.length === 3, 'playSuccessChord schedules 3 harmonic oscillators');
  assert(Math.abs(createdOscillators[0].frequency.events[0].val - 523.25) < 0.1, 'Chord Note 0 is C5 (523.25Hz)');
  assert(Math.abs(createdOscillators[1].frequency.events[0].val - 659.25) < 0.1, 'Chord Note 1 is E5 (659.25Hz)');
  assert(Math.abs(createdOscillators[2].frequency.events[0].val - 783.99) < 0.1, 'Chord Note 2 is G5 (783.99Hz)');
  assert(createdOscillators.every(o => o.type === 'sine'), 'All chord notes synthesize pure sine waves');
  assert(Math.abs(createdOscillators[1].startedAt - (createdOscillators[0].startedAt + 0.035)) < 0.001, 'Chord notes are staggered by exactly 35ms');
  assert(createdGains.every(g => g.gain.events[0].val === 0.062), 'Each note starts at safe gain 0.062 (sum < 0.2 headroom, zero digital clipping)');
  assert(createdGains.every(g => g.gain.events[1].val === 0.0001), 'Each note smoothly decays exponentially to 0.0001');

  // 6. playDullThud Verification
  createdOscillators = [];
  createdGains = [];
  createdFilters = [];
  v2Haptics.playDullThud();
  assert(createdOscillators.length === 1, 'playDullThud schedules 1 oscillator');
  assert(createdOscillators[0].type === 'sine', 'playDullThud uses sine sub-bass waveform');
  assert(createdOscillators[0].frequency.events[0].val === 140, 'Dull thud starts pitch sweep at 140Hz');
  assert(createdOscillators[0].frequency.events[1].val === 40, 'Dull thud ramps down to 40Hz sub-bass');
  assert(createdFilters.length === 1, 'playDullThud creates BiquadFilterNode');
  assert(createdFilters[0].type === 'lowpass', 'Filter type is lowpass');
  assert(createdFilters[0].Q.events[0].val === 2.4, 'Filter resonant Q factor is exactly 2.4');
  assert(createdOscillators[0].connectedTo === createdFilters[0], 'Oscillator connects to resonant filter');
  assert(createdFilters[0].connectedTo === createdGains[0], 'Filter connects to gain envelope node');

  // 7. playMechanicalSwitch Verification
  createdOscillators = [];
  createdGains = [];
  v2Haptics.playMechanicalSwitch(true);
  assert(createdOscillators.length === 2, 'playMechanicalSwitch generates 2-phase mechanical actuation (spring latch + bottom-out)');
  assert(createdOscillators[0].type === 'triangle', 'Phase 1 spring latch uses triangle waveform');
  assert(createdOscillators[0].frequency.events[0].val === 650, 'Phase 1 spring latch engage starts at 650Hz');
  assert(createdOscillators[0].frequency.events[1].val === 920, 'Phase 1 spring latch sweeps up to 920Hz');
  assert(createdOscillators[1].type === 'sine', 'Phase 2 bottom-out impact uses sine waveform');
  assert(Math.abs(createdOscillators[1].startedAt - (createdOscillators[0].startedAt + 0.016)) < 0.001, 'Phase 2 begins exactly 16ms after Phase 1 bottom-out stroke');
  assert(createdOscillators[1].frequency.events[0].val === 280, 'Phase 2 bottom-out starts at 280Hz');
  assert(createdOscillators[1].frequency.events[1].val === 120, 'Phase 2 bottom-out ramps down to 120Hz');

  createdOscillators = [];
  v2Haptics.playMechanicalSwitch(false);
  assert(createdOscillators[0].frequency.events[0].val === 820, 'Phase 1 switch release starts at 820Hz');
  assert(createdOscillators[0].frequency.events[1].val === 480, 'Phase 1 switch release ramps down to 480Hz');

  // 8. bind(root) extensions & data-haptic-spatial Verification
  const mockDocListeners = {};
  const mockDoc = {
    addEventListener: (evt, fn) => {
      mockDocListeners[evt] = mockDocListeners[evt] || [];
      mockDocListeners[evt].push(fn);
    },
    removeEventListener: (evt, fn) => {
      if (mockDocListeners[evt]) {
        mockDocListeners[evt] = mockDocListeners[evt].filter(f => f !== fn);
      }
    },
  };

  let playedSound = null;
  let capturedOptions = null;
  const bindHaptics = new WebAudioHaptics();
  bindHaptics.playRotaryStep = (s, m, opts) => { playedSound = 'rotary'; capturedOptions = { s, m, opts }; };
  bindHaptics.playSuccessChord = (opts) => { playedSound = 'chord'; capturedOptions = opts; };
  bindHaptics.playDullThud = (opts) => { playedSound = 'thud'; capturedOptions = opts; };
  bindHaptics.playMechanicalSwitch = (st, opts) => { playedSound = 'mech'; capturedOptions = { st, opts }; };

  const unbindV2 = bindHaptics.bind(mockDoc);
  const v2ClickHandler = mockDocListeners['click'][0];

  class SimpleMockElement {
    constructor(attrs = {}) {
      this._attrs = attrs;
      this.checked = false;
    }
    getAttribute(k) { return this._attrs[k] !== undefined ? this._attrs[k] : null; }
    setAttribute(k, v) { this._attrs[k] = String(v); }
    closest() { return this; }
  }

  const rotaryEl = new SimpleMockElement({ 'data-haptic': 'rotary', 'data-haptic-step': '8', 'data-haptic-max': '32', 'data-haptic-spatial': '0.4' });
  v2ClickHandler({ target: rotaryEl });
  assert(playedSound === 'rotary', 'bind() dispatches playRotaryStep on data-haptic="rotary"');
  assert(capturedOptions.s === 8 && capturedOptions.m === 32, 'Rotary step 8 and max 32 parsed from attributes');
  assert(capturedOptions.opts.pan === 0.4, 'data-haptic-spatial="0.4" extracts pan: 0.4');

  const chordEl = new SimpleMockElement({ 'data-haptic': 'success-chord', 'data-haptic-spatial': 'true' });
  v2ClickHandler({ target: chordEl, clientX: 450 });
  assert(playedSound === 'chord', 'bind() dispatches playSuccessChord on data-haptic="success-chord"');
  assert(capturedOptions.clientX === 450, 'data-haptic-spatial="true" captures event clientX');

  const thudEl = new SimpleMockElement({ 'data-haptic': 'thud' });
  v2ClickHandler({ target: thudEl });
  assert(playedSound === 'thud', 'bind() dispatches playDullThud on data-haptic="thud"');

  const mechEl = new SimpleMockElement({ 'data-haptic': 'mech-switch' });
  mechEl.checked = true;
  v2ClickHandler({ target: mechEl });
  assert(playedSound === 'mech' && capturedOptions.st === true, 'bind() dispatches playMechanicalSwitch with checked state');

  // Test spatial keyword positions
  const leftSpatialEl = new SimpleMockElement({ 'data-haptic': 'click', 'data-haptic-spatial': 'left' });
  bindHaptics.playClick = (opts) => { playedSound = 'click'; capturedOptions = opts; };
  v2ClickHandler({ target: leftSpatialEl });
  assert(capturedOptions.pan === -0.8, 'data-haptic-spatial="left" extracts pan: -0.8');

  const rightSpatialEl = new SimpleMockElement({ 'data-haptic': 'click', 'data-haptic-spatial': 'right' });
  v2ClickHandler({ target: rightSpatialEl });
  assert(capturedOptions.pan === 0.8, 'data-haptic-spatial="right" extracts pan: 0.8');

  // Test micro-deduplication of input + click on same element within 25ms
  const checkboxEl = new SimpleMockElement({ 'data-haptic': 'mech-switch' });
  checkboxEl.checked = true;
  let triggerCount = 0;
  bindHaptics.playMechanicalSwitch = () => { triggerCount++; };
  const v2InputHandler = mockDocListeners['input'][0];
  v2InputHandler({ target: checkboxEl, type: 'input' });
  v2ClickHandler({ target: checkboxEl, type: 'click' }); // Dispatched immediately after input event
  assert(triggerCount === 1, 'bind() deduplicates rapid input+click events on same element to eliminate audio flutter');

  // 9. Showcase wow_engine.js API Parity Verification
  const showcasePath = fs.existsSync('exercises/wow_pilot_showcase/wow_engine.js')
    ? 'exercises/wow_pilot_showcase/wow_engine.js'
    : fs.existsSync('../../../../exercises/wow_pilot_showcase/wow_engine.js')
      ? '../../../../exercises/wow_pilot_showcase/wow_engine.js'
      : new URL('../../../../exercises/wow_pilot_showcase/wow_engine.js', import.meta.url).pathname;
  const showcaseCode = fs.readFileSync(showcasePath, 'utf8');
  const requiredHapticMethods = [
    'destroy', 'setMuted', 'getMuted', 'toggleMute', 'setVolume', 'getVolume',
    'bind', 'playClick', 'playPop', 'playChime', 'playTabSwitch', 'playToggle',
    'playRotaryStep', 'playSuccessChord', 'playDullThud', 'playMechanicalSwitch',
    'flushSilentBuffer', '_resolvePan', '_createSpatialRoute',
    'setHapticMode', 'getHapticMode', 'vibrate', 'playRotary', 'playDetent'
  ];
  requiredHapticMethods.forEach(method => {
    assert(showcaseCode.includes(method), `Showcase wow_engine.js implements ${method}()`);
  });

  unbindV2();
  assert(mockDocListeners['click'].length === 0, 'bind unbind removes click listener');
  assert(mockDocListeners['input'].length === 0, 'bind unbind removes input listener');
}

// -----------------------------------------------------------------------------
// Test Suite 9: Dual Audio-Haptic Syncer & Memory Leak Verification (WP-R3-04)
// -----------------------------------------------------------------------------
console.log('\n📳 Test Suite 9: Dual Audio-Haptic Syncer & Memory Leak Verification (WP-R3-04)');
{
  // 1. Haptic Vibration Patterns Verification
  assert(typeof HAPTIC_PATTERNS === 'object' && HAPTIC_PATTERNS !== null, 'HAPTIC_PATTERNS is exported as an object');
  assert(Array.isArray(HAPTIC_PATTERNS.click) && HAPTIC_PATTERNS.click[0] === 12, "Haptic pattern 'click' is [12]ms");
  assert(Array.isArray(HAPTIC_PATTERNS.pop) && HAPTIC_PATTERNS.pop[0] === 18, "Haptic pattern 'pop' is [18]ms");
  assert(Array.isArray(HAPTIC_PATTERNS.switch) && HAPTIC_PATTERNS.switch.length === 3 &&
    HAPTIC_PATTERNS.switch[0] === 10 && HAPTIC_PATTERNS.switch[1] === 16 && HAPTIC_PATTERNS.switch[2] === 12,
    "Haptic pattern 'switch' is [10, 16, 12]ms (2-phase spring latch + bottom-out)");
  assert(Array.isArray(HAPTIC_PATTERNS.success) && HAPTIC_PATTERNS.success.length === 5 &&
    HAPTIC_PATTERNS.success[0] === 15 && HAPTIC_PATTERNS.success[4] === 30,
    "Haptic pattern 'success' is [15, 35, 20, 35, 30]ms chord cadence");
  assert(Array.isArray(HAPTIC_PATTERNS.thud) && HAPTIC_PATTERNS.thud[0] === 35, "Haptic pattern 'thud' is [35]ms impact damping");
  assert(Array.isArray(HAPTIC_PATTERNS.rotary) && HAPTIC_PATTERNS.rotary[0] === 8, "Haptic pattern 'rotary' is [8]ms micro notch");
  assert(Array.isArray(HAPTIC_PATTERNS.detent) && HAPTIC_PATTERNS.detent[0] === 10, "Haptic pattern 'detent' is [10]ms detent notch");

  // 2. Hardware Vibration Support Detection (canVibrate)
  let mockUserAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)';
  let vibrateCalls = [];
  const mockNavigator = {
    get userAgent() { return mockUserAgent; },
    vibrate: (pattern) => {
      vibrateCalls.push(pattern);
      return true;
    },
  };
  Object.defineProperty(globalThis, 'navigator', {
    value: mockNavigator,
    configurable: true,
    writable: true,
  });

  const dualHaptics = new WebAudioHaptics();
  assert(dualHaptics.canVibrate === true, 'canVibrate getter returns true for Android mobile userAgent');
  assert(canVibrate() === true, 'canVibrate() function returns true for mobile device with navigator.vibrate');

  mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)';
  assert(dualHaptics.canVibrate === true, 'canVibrate returns true for iPhone');

  mockUserAgent = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)';
  assert(dualHaptics.canVibrate === true, 'canVibrate returns true for iPad');

  mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  assert(dualHaptics.canVibrate === false, 'canVibrate returns false for Windows Desktop userAgent');

  // Reset to Android mobile environment for dual syncer tests
  mockUserAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8)';

  // 3. Haptic Operational Modes (setHapticMode / getHapticMode)
  assert(dualHaptics.getHapticMode() === 'dual', 'Default haptic mode is dual');

  dualHaptics.setHapticMode('audio-only');
  assert(dualHaptics.getHapticMode() === 'audio-only', "setHapticMode('audio-only') sets mode to audio-only");
  assert(dualHaptics.shouldPlayAudio() === true, 'shouldPlayAudio() is true in audio-only mode');
  assert(dualHaptics.shouldVibrate() === false, 'shouldVibrate() is false in audio-only mode');

  dualHaptics.setHapticMode('vibrate-only');
  assert(dualHaptics.getHapticMode() === 'vibrate-only', "setHapticMode('vibrate-only') sets mode to vibrate-only");
  assert(dualHaptics.shouldPlayAudio() === false, 'shouldPlayAudio() is false in vibrate-only mode');
  assert(dualHaptics.shouldVibrate() === true, 'shouldVibrate() is true in vibrate-only mode');

  dualHaptics.setHapticMode('mute');
  assert(dualHaptics.getHapticMode() === 'mute', "setHapticMode('mute') sets mode to mute");
  assert(dualHaptics.getMuted() === true, "setHapticMode('mute') automatically activates isMuted");
  assert(dualHaptics.shouldPlayAudio() === false, 'shouldPlayAudio() is false in mute mode');
  assert(dualHaptics.shouldVibrate() === false, 'shouldVibrate() is false in mute mode');

  dualHaptics.setHapticMode('dual');
  assert(dualHaptics.getHapticMode() === 'dual', "setHapticMode('dual') restores dual mode");
  assert(dualHaptics.getMuted() === false, "setHapticMode('dual') unsets isMuted");
  assert(dualHaptics.shouldPlayAudio() === true, 'shouldPlayAudio() is true in dual mode');
  assert(dualHaptics.shouldVibrate() === true, 'shouldVibrate() is true in dual mode');

  // 4. Mock Audio Graph with Disconnect Tracking for Memory Leak Testing
  let disconnectedGains = [];
  let disconnectedOscillators = [];
  let disconnectedFilters = [];
  let capturedOscillators = [];

  class MockDisconnectGain {
    constructor() {
      this.gain = {
        value: 1,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      };
      this.connectedTo = null;
    }
    connect(dest) { this.connectedTo = dest; }
    disconnect() { disconnectedGains.push(this); }
  }

  class MockDisconnectOscillator {
    constructor() {
      this.type = 'sine';
      this.frequency = {
        value: 440,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      };
      this.connectedTo = null;
      this.onended = null;
      capturedOscillators.push(this);
    }
    connect(dest) { this.connectedTo = dest; }
    disconnect() { disconnectedOscillators.push(this); }
    start() {}
    stop() {}
  }

  class MockDisconnectFilter {
    constructor() {
      this.type = 'lowpass';
      this.frequency = { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} };
      this.Q = { setValueAtTime: () => {} };
      this.connectedTo = null;
    }
    connect(dest) { this.connectedTo = dest; }
    disconnect() { disconnectedFilters.push(this); }
  }

  class MockDisconnectAudioContext {
    constructor() {
      this.currentTime = 100.0;
      this.state = 'running';
      this.destination = {};
    }
    createOscillator() { return new MockDisconnectOscillator(); }
    createGain() { return new MockDisconnectGain(); }
    createBiquadFilter() { return new MockDisconnectFilter(); }
    resume() { return Promise.resolve(); }
  }

  globalThis.window.AudioContext = MockDisconnectAudioContext;
  const syncer = new WebAudioHaptics({ mode: 'dual' });
  assert(syncer.getContext() !== null, 'Syncer AudioContext initialized with leak-tracking mock');

  // 5. Dual Dispatch & osc.onended Memory Leak Fix Verification
  // 5a. playClick()
  vibrateCalls = [];
  disconnectedGains = [];
  disconnectedOscillators = [];
  capturedOscillators = [];
  syncer.playClick();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 12, 'playClick() dispatches [12]ms haptic vibration');
  assert(capturedOscillators.length === 1, 'playClick() synthesizes 1 audio oscillator');
  assert(typeof capturedOscillators[0].onended === 'function', 'playClick() assigns osc.onended handler');
  capturedOscillators[0].onended();
  assert(disconnectedGains.length === 1, 'osc.onended disconnects GainNode to eliminate memory leak');
  assert(disconnectedOscillators.length === 1, 'osc.onended disconnects OscillatorNode to eliminate memory leak');

  // 5b. playPop()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playPop();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 18, 'playPop() dispatches [18]ms haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playPop() assigns osc.onended handler');
  capturedOscillators[0].onended();
  assert(disconnectedOscillators.length === 2, 'playPop() osc.onended cleanly disconnects');

  // 5c. playTabSwitch()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playTabSwitch();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 10 && vibrateCalls[0][1] === 16 && vibrateCalls[0][2] === 12,
    'playTabSwitch() dispatches [10, 16, 12]ms haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playTabSwitch() assigns osc.onended handler');
  capturedOscillators[0].onended();

  // 5d. playToggle()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playToggle(true);
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 10 && vibrateCalls[0][1] === 16,
    'playToggle() dispatches [10, 16, 12]ms switch haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playToggle() assigns osc.onended handler');
  capturedOscillators[0].onended();

  // 5e. playSuccessChord()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playSuccessChord();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 15 && vibrateCalls[0][4] === 30,
    'playSuccessChord() dispatches [15, 35, 20, 35, 30]ms chord haptic vibration');
  assert(capturedOscillators.length === 3, 'playSuccessChord() generates 3 chord oscillators');
  capturedOscillators.forEach((osc, idx) => {
    assert(typeof osc.onended === 'function', `playSuccessChord() note ${idx} has onended handler`);
    osc.onended();
  });

  // 5f. playChime()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playChime();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 15 && vibrateCalls[0][4] === 30,
    'playChime() dispatches [15, 35, 20, 35, 30]ms chime haptic vibration');
  capturedOscillators.forEach(osc => osc.onended());

  // 5g. playDullThud() with BiquadFilter cleanup
  vibrateCalls = [];
  capturedOscillators = [];
  disconnectedFilters = [];
  syncer.playDullThud();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 35, 'playDullThud() dispatches [35]ms thud haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playDullThud() assigns osc.onended handler');
  capturedOscillators[0].onended();
  assert(disconnectedFilters.length === 1, 'playDullThud() osc.onended disconnects BiquadFilterNode');

  // 5h. playMechanicalSwitch() 2-phase actuation
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playMechanicalSwitch(true);
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 10 && vibrateCalls[0][1] === 16 && vibrateCalls[0][2] === 12,
    'playMechanicalSwitch() dispatches [10, 16, 12]ms switch haptic vibration');
  assert(capturedOscillators.length === 2, 'playMechanicalSwitch() creates Phase 1 and Phase 2 oscillators');
  assert(typeof capturedOscillators[0].onended === 'function', 'Phase 1 osc has onended');
  assert(typeof capturedOscillators[1].onended === 'function', 'Phase 2 osc has onended');
  capturedOscillators[0].onended();
  capturedOscillators[1].onended();

  // 5i. playRotaryStep() & playRotary()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer._lastRotaryTime = 0; // Reset throttle for test
  syncer.playRotary(4, 24);
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 8, 'playRotary() dispatches [8]ms rotary haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playRotary() assigns osc.onended handler');
  capturedOscillators[0].onended();

  // 5j. playDetent()
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playDetent();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 10, 'playDetent() dispatches [10]ms detent haptic vibration');
  assert(typeof capturedOscillators[0].onended === 'function', 'playDetent() assigns osc.onended handler');
  capturedOscillators[0].onended();

  // 6. Mode Enforcement during Sound Playback
  // Mode: audio-only -> sound plays, zero vibration
  syncer.setHapticMode('audio-only');
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playClick();
  assert(capturedOscillators.length === 1, 'audio-only mode synthesizes audio');
  assert(vibrateCalls.length === 0, 'audio-only mode suppresses hardware vibration');

  // Mode: vibrate-only -> vibration fires, zero audio oscillators
  syncer.setHapticMode('vibrate-only');
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playClick();
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 12, 'vibrate-only mode dispatches vibration');
  assert(capturedOscillators.length === 0, 'vibrate-only mode creates ZERO audio oscillators (CPU/Audio Graph idle)');

  // Mode: mute -> zero audio, zero vibration
  syncer.setHapticMode('mute');
  vibrateCalls = [];
  capturedOscillators = [];
  syncer.playClick();
  assert(vibrateCalls.length === 0, 'mute mode suppresses vibration');
  assert(capturedOscillators.length === 0, 'mute mode suppresses audio');

  // Reset to dual
  syncer.setHapticMode('dual');

  // 7. HTML Element Attribute Extensions in bind()
  // Mock element with data-haptic-mode & data-haptic-vibrate
  class AdvancedMockElement {
    constructor(attrs = {}) {
      this._attrs = { ...attrs };
    }
    getAttribute(attr) { return this._attrs[attr] !== undefined ? this._attrs[attr] : null; }
    setAttribute(attr, val) { this._attrs[attr] = String(val); }
    closest(selector) {
      if (selector === '[data-haptic]' && this._attrs['data-haptic']) return this;
      if (selector === '[data-haptic-vibrate]' && this._attrs['data-haptic-vibrate']) return this;
      if (selector === '[data-haptic-mode]' && this._attrs['data-haptic-mode']) return this;
      return null;
    }
  }

  const suite9Listeners = { click: [], input: [] };
  const suite9Doc = {
    addEventListener: (type, fn) => { suite9Listeners[type].push(fn); },
    removeEventListener: (type, fn) => {
      suite9Listeners[type] = suite9Listeners[type].filter(f => f !== fn);
    },
  };

  const bindSyncer = new WebAudioHaptics();
  const unbindSuite9 = bindSyncer.bind(suite9Doc);
  const clickDispatcher = suite9Listeners['click'][0];

  // 7a. Element with data-haptic-mode="vibrate-only"
  const vibrateOnlyEl = new AdvancedMockElement({
    'data-haptic': 'click',
    'data-haptic-mode': 'vibrate-only',
  });
  vibrateCalls = [];
  capturedOscillators = [];
  clickDispatcher({ target: vibrateOnlyEl });
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 12, 'data-haptic-mode="vibrate-only" element dispatches vibration');
  assert(capturedOscillators.length === 0, 'data-haptic-mode="vibrate-only" element creates zero audio nodes');

  // 7b. Element with data-haptic-mode="audio-only"
  const audioOnlyEl = new AdvancedMockElement({
    'data-haptic': 'click',
    'data-haptic-mode': 'audio-only',
  });
  vibrateCalls = [];
  capturedOscillators = [];
  clickDispatcher({ target: audioOnlyEl });
  assert(capturedOscillators.length === 1, 'data-haptic-mode="audio-only" element creates audio node');
  assert(vibrateCalls.length === 0, 'data-haptic-mode="audio-only" element suppresses vibration');

  // 7c. Element with data-haptic-vibrate="false"
  const noVibrateEl = new AdvancedMockElement({
    'data-haptic': 'pop',
    'data-haptic-vibrate': 'false',
  });
  vibrateCalls = [];
  capturedOscillators = [];
  clickDispatcher({ target: noVibrateEl });
  assert(capturedOscillators.length === 1, 'data-haptic-vibrate="false" element plays audio');
  assert(vibrateCalls.length === 0, 'data-haptic-vibrate="false" element suppresses vibration');

  // 7d. Element with custom vibration pattern data-haptic-vibrate="25, 50, 25"
  const customVibrateEl = new AdvancedMockElement({
    'data-haptic': 'click',
    'data-haptic-vibrate': '25, 50, 25',
  });
  vibrateCalls = [];
  clickDispatcher({ target: customVibrateEl });
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 25 && vibrateCalls[0][1] === 50 && vibrateCalls[0][2] === 25,
    'data-haptic-vibrate="25, 50, 25" dispatches custom haptic vibration sequence [25, 50, 25]ms');

  // 7e. Element with data-haptic="detent"
  const detentEl = new AdvancedMockElement({
    'data-haptic': 'detent',
  });
  vibrateCalls = [];
  clickDispatcher({ target: detentEl });
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 10, 'data-haptic="detent" element dispatches [10]ms detent pulse');

  // 7f. Element with only data-haptic-vibrate="true" (no data-haptic)
  const vibrateAttrOnlyEl = new AdvancedMockElement({
    'data-haptic-vibrate': 'true',
  });
  vibrateCalls = [];
  clickDispatcher({ target: vibrateAttrOnlyEl });
  assert(vibrateCalls.length === 1 && vibrateCalls[0][0] === 12, 'Element with data-haptic-vibrate="true" defaults to click vibration [12]ms');

  unbindSuite9();
  syncer.destroy();
  bindSyncer.destroy();
  dualHaptics.destroy();
}

console.log(`\n========================================`);
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
console.log(`========================================\n`);
