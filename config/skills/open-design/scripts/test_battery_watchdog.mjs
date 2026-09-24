/**
 * 🧪 Comprehensive Unit & Adversarial Test Suite for BatteryWatchdog & EcoGraphicArbiter
 * =======================================================================================
 * Tests:
 * 1. Module Structure & Universal Exports (ESM, CJS, and UMD)
 * 2. Standalone UMD Sandbox Loading in VM
 * 3. SSR Safety (Zero runtime crash in Node.js environment without DOM)
 * 4. AdaptiveBatteryWatchdog Subsystem:
 *    - Safe battery monitoring via navigator.getBattery() with fallback
 *    - Energy Tier classification (TIER_HIGH, TIER_ECO, TIER_CRITICAL)
 *    - Battery event listeners and tier transition callbacks
 * 5. Page Visibility & Window Blur (Zero Idle GPU Overhead):
 *    - Document hidden -> throttles to <= 1 FPS
 *    - Window blur & focus restoration
 * 6. Auto-Sleep Watchdog (Inactivity Hibernation & Instant Wake):
 *    - 30s inactivity timeout -> transitions to SLEEP
 *    - Instant wake-up upon first user gesture / activity
 * 7. EcoGraphicArbiter Subsystem:
 *    - Decoupled Dual-Framerate Architecture (UI @ 60 FPS vs Canvas @ 30 FPS)
 *    - Dynamic tier-driven Canvas FPS adjustment
 *    - Zero idle overhead when tab is hidden or sleeping
 * 8. GPU Scissor Optimization:
 *    - WebGL Bottom-Left coordinate transformation
 *    - Docked Right, Docked Left, Docked Top, and Docked Bottom panels
 *    - Bandwidth savings calculation (35% VRAM savings target)
 *    - Mock WebGL context execution (gl.enable, gl.scissor, gl.disable)
 * 9. Automatic WebGL Context Recovery:
 *    - webglcontextlost intercepts with event.preventDefault() and pauses render
 *    - webglcontextrestored rebinds state, triggers restoration callback and resumes render
 * 10. Adversarial Edge Cases & Idempotence
 */

import {
  BatteryWatchdog,
  AdaptiveBatteryWatchdog,
  EcoGraphicArbiter,
  BATTERY_TIERS,
  DISPLAY_STATES,
  initBatteryWatchdog,
  initGraphicArbiter,
  clamp,
} from './battery_watchdog.js';

import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

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

console.log('🚀 Starting BatteryWatchdog & EcoGraphicArbiter Test Suite...\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Module Structure & Universal Exports
// -----------------------------------------------------------------------------
console.log('📦 Test Suite 1: Module Structure & Universal Exports');
assert(typeof BatteryWatchdog === 'object', 'BatteryWatchdog is exported as an object');
assert(BatteryWatchdog.version === '2.0.0', 'BatteryWatchdog version is 2.0.0');
assert(typeof AdaptiveBatteryWatchdog === 'function', 'AdaptiveBatteryWatchdog is exported as a class');
assert(typeof EcoGraphicArbiter === 'function', 'EcoGraphicArbiter is exported as a class');
assert(typeof initBatteryWatchdog === 'function', 'initBatteryWatchdog factory function is exported');
assert(typeof initGraphicArbiter === 'function', 'initGraphicArbiter factory function is exported');
assert(typeof BATTERY_TIERS === 'object', 'BATTERY_TIERS dictionary is exported');
assert(BATTERY_TIERS.HIGH === 'TIER_HIGH', 'BATTERY_TIERS.HIGH is TIER_HIGH');
assert(BATTERY_TIERS.ECO === 'TIER_ECO', 'BATTERY_TIERS.ECO is TIER_ECO');
assert(BATTERY_TIERS.CRITICAL === 'TIER_CRITICAL', 'BATTERY_TIERS.CRITICAL is TIER_CRITICAL');
assert(typeof DISPLAY_STATES === 'object', 'DISPLAY_STATES dictionary is exported');
assert(DISPLAY_STATES.ACTIVE === 'ACTIVE', 'DISPLAY_STATES.ACTIVE is ACTIVE');
assert(DISPLAY_STATES.SLEEP === 'SLEEP', 'DISPLAY_STATES.SLEEP is SLEEP');
assert(DISPLAY_STATES.HIDDEN === 'HIDDEN', 'DISPLAY_STATES.HIDDEN is HIDDEN');

// -----------------------------------------------------------------------------
// Test Suite 2: Standalone UMD Sandbox Loading (CJS & Window Global)
// -----------------------------------------------------------------------------
console.log('\n🌐 Test Suite 2: Standalone UMD Sandbox Loading');
const umdPath = path.join(__dirname, 'battery_watchdog.umd.js');
assert(fs.existsSync(umdPath), 'battery_watchdog.umd.js bundle exists');

const umdCode = fs.readFileSync(umdPath, 'utf8');

// 2.1 Test CommonJS execution in Node VM
{
  const cjsModule = { exports: {} };
  const cjsContext = vm.createContext({
    module: cjsModule,
    exports: cjsModule.exports,
    console,
  });
  vm.runInContext(umdCode, cjsContext);
  assert(typeof cjsModule.exports.AdaptiveBatteryWatchdog === 'function', 'UMD CJS exports AdaptiveBatteryWatchdog');
  assert(typeof cjsModule.exports.EcoGraphicArbiter === 'function', 'UMD CJS exports EcoGraphicArbiter');
  assert(cjsModule.exports.BATTERY_TIERS.ECO === 'TIER_ECO', 'UMD CJS exports BATTERY_TIERS');
}

// 2.2 Test Browser Global (window) in Node VM
{
  const mockWindow = {};
  const globalContext = vm.createContext({
    window: mockWindow,
    globalThis: mockWindow,
    console,
  });
  vm.runInContext(umdCode, globalContext);
  assert(typeof mockWindow.BatteryWatchdog === 'object', 'UMD sets window.BatteryWatchdog');
  assert(mockWindow.BatteryWatchdog.version === '2.0.0', 'UMD window.BatteryWatchdog.version is 2.0.0');
  assert(typeof mockWindow.AdaptiveBatteryWatchdog === 'function', 'UMD sets window.AdaptiveBatteryWatchdog');
  assert(typeof mockWindow.EcoGraphicArbiter === 'function', 'UMD sets window.EcoGraphicArbiter');
}

// -----------------------------------------------------------------------------
// Test Suite 3: SSR Safety (Zero Crash in Node.js without DOM)
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 3: SSR Safety');
{
  const ssrWatchdog = new AdaptiveBatteryWatchdog({ autoSleep: false });
  assert(ssrWatchdog.getTier() === BATTERY_TIERS.HIGH, 'SSR watchdog defaults to TIER_HIGH safely');
  assert(ssrWatchdog.getTargetFps() === 60, 'SSR watchdog getTargetFps() returns highFps (60)');
  assert(ssrWatchdog.batterySupported === false, 'SSR watchdog indicates battery API unsupported gracefully');
  ssrWatchdog.destroy();
  assert(true, 'SSR watchdog destroy() completes without error');

  const ssrArbiter = new EcoGraphicArbiter({ autoStart: false });
  assert(ssrArbiter.uiTargetFps === 60, 'SSR arbiter defaults uiTargetFps to 60');
  assert(ssrArbiter.canvasTargetFps === 30, 'SSR arbiter defaults canvasTargetFps to 30');
  const stepRes = ssrArbiter.step(Date.now());
  assert(typeof stepRes === 'object', 'SSR arbiter step() returns valid object');
  ssrArbiter.destroy();
  assert(true, 'SSR arbiter destroy() completes cleanly');
}

// -----------------------------------------------------------------------------
// Test Suite 4: AdaptiveBatteryWatchdog - Monitoring & Energy Tiers
// -----------------------------------------------------------------------------
console.log('\n🔋 Test Suite 4: AdaptiveBatteryWatchdog - Monitoring & Energy Tiers');
{
  let tierChangeHistory = [];
  const watchdog = new AdaptiveBatteryWatchdog({
    lowBatteryThreshold: 0.20,
    criticalBatteryThreshold: 0.10,
    ecoFps: 30,
    highFps: 60,
    criticalFps: 15,
    onTierChange: (tier, info) => {
      tierChangeHistory.push({ tier, charging: info.charging, level: info.level });
    },
  });

  // Default state: plugged in, 100%
  assert(watchdog.getTier() === BATTERY_TIERS.HIGH, 'Initial tier is TIER_HIGH');
  assert(watchdog.getTargetFps() === 60, 'Initial target FPS is 60 FPS');

  // Scenario 4.1: Unplugged / On battery power (charging = false, level = 85%) -> TIER_ECO
  watchdog.simulateBattery({ charging: false, level: 0.85 });
  assert(watchdog.getTier() === BATTERY_TIERS.ECO, 'Unplugged power switches immediately to TIER_ECO');
  assert(watchdog.getTargetFps() === 30, 'TIER_ECO target FPS throttles to 30 FPS');
  assert(tierChangeHistory.length === 1 && tierChangeHistory[0].tier === BATTERY_TIERS.ECO, 'onTierChange called for ECO');

  // Scenario 4.2: Plugged back in, level = 85% -> TIER_HIGH
  watchdog.simulateBattery({ charging: true, level: 0.85 });
  assert(watchdog.getTier() === BATTERY_TIERS.HIGH, 'Plugged in AC restores TIER_HIGH');
  assert(watchdog.getTargetFps() === 60, 'TIER_HIGH restores 60 FPS');

  // Scenario 4.3: Plugged in, but battery drops < 20% (level = 18%) -> TIER_ECO
  watchdog.simulateBattery({ charging: true, level: 0.18 });
  assert(watchdog.getTier() === BATTERY_TIERS.ECO, 'Battery level < 20% switches to TIER_ECO even on AC');
  assert(watchdog.getTargetFps() === 30, 'TIER_ECO target FPS is 30 FPS');

  // Scenario 4.4: Unplugged AND battery drops < 10% (level = 8%) -> TIER_CRITICAL
  watchdog.simulateBattery({ charging: false, level: 0.08 });
  assert(watchdog.getTier() === BATTERY_TIERS.CRITICAL, 'Unplugged and battery < 10% switches to TIER_CRITICAL');
  assert(watchdog.getTargetFps() === 15, 'TIER_CRITICAL throttles to 15 FPS');

  // Scenario 4.5: Out-of-bounds safety clamp (level = -0.5 or NaN)
  watchdog.simulateBattery({ charging: true, level: -0.5 });
  assert(watchdog.getBatteryInfo().level === 0, 'Negative battery level clamped to 0');
  watchdog.simulateBattery({ charging: true, level: 1.5 });
  assert(watchdog.getBatteryInfo().level === 1.0, 'Over-1.0 battery level clamped to 1.0');

  watchdog.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 5: Page Visibility API & Window Blur (Zero Idle GPU Overhead)
// -----------------------------------------------------------------------------
console.log('\n👁️ Test Suite 5: Page Visibility API & Window Blur');
{
  let stateHistory = [];
  const watchdog = new AdaptiveBatteryWatchdog({
    hiddenFps: 1,
    blurFps: 5,
    onStateChange: (state) => {
      stateHistory.push(state);
    },
  });

  assert(watchdog.getState() === DISPLAY_STATES.ACTIVE, 'Initial state is ACTIVE');

  // 5.1 Tab Hidden (document.hidden = true)
  watchdog.simulateVisibility(true);
  assert(watchdog.isHidden() === true, 'isHidden() reports true');
  assert(watchdog.getState() === DISPLAY_STATES.HIDDEN, 'Display state transitions to HIDDEN');
  assert(watchdog.getTargetFps() <= 1, 'Target FPS drops to <= 1 FPS (Zero Idle GPU Overhead)');
  assert(watchdog.getTargetFps() === 1, 'Target FPS is exactly 1 FPS');

  // 5.2 Tab Restored
  watchdog.simulateVisibility(false);
  assert(watchdog.isHidden() === false, 'isHidden() reports false');
  assert(watchdog.getState() === DISPLAY_STATES.ACTIVE, 'Display state returns to ACTIVE');
  assert(watchdog.getTargetFps() === 60, 'Target FPS restored to 60 FPS');

  // 5.3 Window Blur / Minimized
  watchdog.simulateBlur(true);
  assert(watchdog.isBlurred() === true, 'isBlurred() reports true');
  assert(watchdog.getState() === DISPLAY_STATES.BLURRED, 'Display state transitions to BLURRED');
  assert(watchdog.getTargetFps() === 5, 'Target FPS drops to blurFps (5 FPS)');

  // 5.4 Window Refocused
  watchdog.simulateBlur(false);
  assert(watchdog.isBlurred() === false, 'isBlurred() reports false');
  assert(watchdog.getState() === DISPLAY_STATES.ACTIVE, 'Display state returns to ACTIVE');

  watchdog.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 6: Auto-Sleep Watchdog (Inactivity Hibernation & Instant Wake)
// -----------------------------------------------------------------------------
console.log('\n💤 Test Suite 6: Auto-Sleep Watchdog');
{
  let sleepCount = 0;
  let wakeCount = 0;

  const watchdog = new AdaptiveBatteryWatchdog({
    idleTimeout: 30000, // 30s
    sleepFps: 0,        // 0 FPS when sleeping
    onSleep: () => sleepCount++,
    onWake: () => wakeCount++,
  });

  assert(watchdog.isSleeping() === false, 'Initially not sleeping');

  // 6.1 Force sleep / hibernation
  watchdog.sleep();
  assert(watchdog.isSleeping() === true, 'isSleeping() reports true after sleep()');
  assert(watchdog.getState() === DISPLAY_STATES.SLEEP, 'State transitions to SLEEP');
  assert(watchdog.getTargetFps() === 0, 'Target FPS drops to 0 FPS (hibernation)');
  assert(sleepCount === 1, 'onSleep callback executed once');

  // 6.2 Wake up on user activity (mouse / keyboard / touch gesture)
  watchdog.recordActivity();
  assert(watchdog.isSleeping() === false, 'isSleeping() reports false after activity');
  assert(watchdog.getState() === DISPLAY_STATES.ACTIVE, 'State transitions back to ACTIVE');
  assert(watchdog.getTargetFps() === 60, 'Target FPS restored to 60 FPS');
  assert(wakeCount === 1, 'onWake callback executed once');

  // 6.3 Test custom short idle timeout
  let autoSlept = false;
  const shortWatchdog = new AdaptiveBatteryWatchdog({
    idleTimeout: 30, // 30ms for rapid unit testing
    sleepFps: 0,
    onSleep: () => {
      autoSlept = true;
    },
  });

  // Wait for 50ms to verify automatic timer trigger
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert(autoSlept === true, 'Auto-sleep timer triggers hibernation after inactivity timeout');
  assert(shortWatchdog.isSleeping() === true, 'shortWatchdog isSleeping() is true');

  // First interaction wakes up immediately
  shortWatchdog.recordActivity();
  assert(shortWatchdog.isSleeping() === false, 'First interaction wakes up immediately');

  watchdog.destroy();
  shortWatchdog.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 7: EcoGraphicArbiter - Decoupled Dual-Framerate Architecture
// -----------------------------------------------------------------------------
console.log('\n⚙️ Test Suite 7: EcoGraphicArbiter - Decoupled Dual-Framerate');
{
  const arbiter = new EcoGraphicArbiter({
    uiTargetFps: 60,
    canvasTargetFps: 30, // Background Canvas runs at 30 FPS
    ecoCanvasTargetFps: 30,
    highCanvasTargetFps: 60,
    autoStart: false,
  });

  let uiTicks = 0;
  let canvasTicks = 0;

  arbiter.registerUIRenderer('inspectorPanel', () => {
    uiTicks++;
  });

  arbiter.registerCanvasRenderer('webglBackground', () => {
    canvasTicks++;
  });

  // Simulate 1000ms at ~16.6ms intervals (60 ticks)
  let currentTime = 10000;
  arbiter.step(currentTime); // Initialize first frame

  for (let i = 1; i <= 60; i++) {
    currentTime += 16.666;
    arbiter.step(currentTime);
  }

  assert(uiTicks >= 58 && uiTicks <= 62, `UI rendered smoothly at 60 FPS (actual: ${uiTicks})`);
  assert(canvasTicks >= 28 && canvasTicks <= 32, `Canvas rendered decoupled at 30 FPS (actual: ${canvasTicks})`);
  const ratio = uiTicks / canvasTicks;
  assert(ratio >= 1.8 && ratio <= 2.2, `Decoupled ratio is ~2:1 (actual: ${ratio.toFixed(2)})`);

  // 7.2 Zero Idle Overhead during sleep
  arbiter.watchdog.sleep();
  const canvasBeforeSleep = canvasTicks;
  for (let i = 1; i <= 30; i++) {
    currentTime += 16.666;
    arbiter.step(currentTime);
  }
  assert(canvasTicks === canvasBeforeSleep, 'Zero canvas frames rendered while sleeping (0 FPS)');

  // 7.3 <= 1 FPS during Hidden tab
  arbiter.watchdog.wake();
  arbiter.watchdog.simulateVisibility(true); // document.hidden = true
  const canvasBeforeHidden = canvasTicks;
  // Step for 1000ms
  for (let i = 1; i <= 60; i++) {
    currentTime += 16.666;
    arbiter.step(currentTime);
  }
  const canvasHiddenFrames = canvasTicks - canvasBeforeHidden;
  assert(canvasHiddenFrames <= 2, `Canvas throttled to <= 1 FPS when hidden (rendered: ${canvasHiddenFrames})`);

  // 7.4 Critical battery throttling (15 FPS)
  arbiter.watchdog.simulateVisibility(false);
  arbiter.watchdog.simulateBattery({ charging: false, level: 0.05 }); // TIER_CRITICAL
  const canvasBeforeCrit = canvasTicks;
  for (let i = 1; i <= 60; i++) {
    currentTime += 16.666;
    arbiter.step(currentTime);
  }
  const canvasCritFrames = canvasTicks - canvasBeforeCrit;
  assert(canvasCritFrames >= 13 && canvasCritFrames <= 17, `Canvas throttled to 15 FPS in TIER_CRITICAL (actual: ${canvasCritFrames})`);

  arbiter.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 8: GPU Scissor Optimization (Panel Overlap & VRAM Fill-Rate Savings)
// -----------------------------------------------------------------------------
console.log('\n✂️ Test Suite 8: GPU Scissor Optimization');
{
  const arbiter = new EcoGraphicArbiter({ autoStart: false });
  const canvasBounds = { x: 0, y: 0, width: 1920, height: 1080 };

  // 8.1 Floating Inspector docked on the Right: 672px width (~35% of 1920 width)
  const panelRight35 = { x: 1920 - 672, y: 0, width: 672, height: 1080 };
  const scissorRight = arbiter.calculateScissorRect(canvasBounds, panelRight35);

  assert(scissorRight.isOccluded === true, 'Docked Right inspector detected as occluded');
  assert(scissorRight.x === 0, 'Visible scissor X starts at 0');
  assert(scissorRight.y === 0, 'Visible scissor Y starts at 0');
  assert(scissorRight.width === 1248, `Visible scissor width is 1248 (1920 - 672)`);
  assert(scissorRight.height === 1080, 'Visible scissor height is full 1080');
  assert(scissorRight.savingsPercent === 35, `Achieved target 35% VRAM fill-rate bandwidth savings (actual: ${scissorRight.savingsPercent}%)`);

  // 8.2 Floating Inspector docked on the Left: 400px width
  const panelLeft = { x: 0, y: 0, width: 400, height: 1080 };
  const scissorLeft = arbiter.calculateScissorRect(canvasBounds, panelLeft);

  assert(scissorLeft.isOccluded === true, 'Docked Left inspector detected as occluded');
  assert(scissorLeft.x === 400, 'Visible scissor X starts at 400');
  assert(scissorLeft.y === 0, 'Visible scissor Y starts at 0');
  assert(scissorLeft.width === 1520, 'Visible scissor width is 1520');
  assert(scissorLeft.height === 1080, 'Visible scissor height is 1080');

  // 8.3 Docked Top panel (200px height) -> WebGL Y-flip verification
  const panelTop = { x: 0, y: 0, width: 1920, height: 200 };
  const scissorTop = arbiter.calculateScissorRect(canvasBounds, panelTop);

  assert(scissorTop.isOccluded === true, 'Docked Top inspector detected');
  assert(scissorTop.x === 0, 'Scissor X is 0');
  assert(scissorTop.y === 0, 'Scissor Y is 0 (bottom of WebGL space)');
  assert(scissorTop.height === 880, 'Scissor height is 880 (1080 - 200)');

  // 8.4 Docked Bottom panel (200px height)
  const panelBottom = { x: 0, y: 880, width: 1920, height: 200 };
  const scissorBottom = arbiter.calculateScissorRect(canvasBounds, panelBottom);
  assert(scissorBottom.isOccluded === true, 'Docked Bottom inspector detected');
  assert(scissorBottom.y === 200, 'Scissor Y starts at 200 in WebGL space');
  assert(scissorBottom.height === 880, 'Scissor height is 880');

  // 8.5 WebGL Context Mock Execution (gl.enable, gl.scissor, gl.disable)
  let glCalls = [];
  const mockGl = {
    SCISSOR_TEST: 0xc11,
    enable: (cap) => glCalls.push({ call: 'enable', cap }),
    disable: (cap) => glCalls.push({ call: 'disable', cap }),
    scissor: (x, y, w, h) => glCalls.push({ call: 'scissor', x, y, w, h }),
  };

  const applied = arbiter.applyScissorOptimization(mockGl, canvasBounds, panelRight35);
  assert(applied.isOccluded === true, 'Scissor optimization applied');
  assert(glCalls.some((c) => c.call === 'enable' && c.cap === mockGl.SCISSOR_TEST), 'gl.enable(gl.SCISSOR_TEST) was called');
  assert(glCalls.some((c) => c.call === 'scissor' && c.w === 1248 && c.h === 1080), 'gl.scissor(0, 0, 1248, 1080) was called');

  arbiter.clearScissorOptimization(mockGl);
  assert(glCalls.some((c) => c.call === 'disable' && c.cap === mockGl.SCISSOR_TEST), 'gl.disable(gl.SCISSOR_TEST) was called');

  // 8.6 Non-overlapping panel
  const panelOutside = { x: 2000, y: 0, width: 300, height: 500 };
  const scissorOutside = arbiter.calculateScissorRect(canvasBounds, panelOutside);
  assert(scissorOutside.isOccluded === false, 'Non-overlapping panel has isOccluded = false');
  assert(scissorOutside.savingsPercent === 0, 'Zero savings when not occluded');

  arbiter.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 9: WebGL Context Recovery Subsystem
// -----------------------------------------------------------------------------
console.log('\n🔄 Test Suite 9: WebGL Context Recovery Subsystem');
{
  const arbiter = new EcoGraphicArbiter({ autoStart: false });

  // Mock HTMLCanvasElement with event dispatch
  const listeners = new Map();
  const mockCanvas = {
    addEventListener: (type, cb) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(cb);
    },
    removeEventListener: (type, cb) => {
      if (!listeners.has(type)) return;
      const arr = listeners.get(type).filter((fn) => fn !== cb);
      listeners.set(type, arr);
    },
    dispatchEvent: (event) => {
      const arr = listeners.get(event.type) || [];
      for (const fn of arr) fn(event);
      return !event.defaultPrevented;
    },
  };

  let lostCalled = false;
  let restoredCalled = false;
  let drawCount = 0;

  arbiter.registerCanvasRenderer('recoveringCanvas', () => {
    drawCount++;
  }, {
    canvas: mockCanvas,
    autoRecover: true,
    onLost: (e) => {
      lostCalled = true;
    },
    onRestored: (e, gl) => {
      restoredCalled = true;
    },
  });

  // Step 1: Render normally
  arbiter.step(1000);
  arbiter.step(1050);
  assert(drawCount === 1, 'Canvas drew 1 frame initially');

  // Step 2: Trigger webglcontextlost event
  let preventDefaultInvoked = false;
  const lostEvent = {
    type: 'webglcontextlost',
    cancelable: true,
    defaultPrevented: false,
    preventDefault: () => {
      preventDefaultInvoked = true;
      lostEvent.defaultPrevented = true;
    },
  };
  mockCanvas.dispatchEvent(lostEvent);

  assert(preventDefaultInvoked === true, 'event.preventDefault() was strictly called on webglcontextlost');
  assert(lostCalled === true, 'onLost callback was triggered');

  // Step 3: Verify rendering is paused while context is lost
  const countDuringLoss = drawCount;
  arbiter.step(1100);
  arbiter.step(1150);
  assert(drawCount === countDuringLoss, 'Canvas rendering paused completely during context loss (prevented black screen crashes)');

  // Step 4: Trigger webglcontextrestored event
  const restoredEvent = { type: 'webglcontextrestored' };
  mockCanvas.dispatchEvent(restoredEvent);

  assert(restoredCalled === true, 'onRestored callback was triggered to rebind shaders/buffers');

  // Step 5: Verify rendering resumes smoothly
  arbiter.step(1200);
  arbiter.step(1250);
  assert(drawCount > countDuringLoss, 'Canvas rendering resumed smoothly after context restoration');

  arbiter.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 10: Adversarial Edge Cases & Idempotence
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 10: Adversarial Edge Cases & Idempotence');
{
  const watchdog = new AdaptiveBatteryWatchdog();
  const arbiter = new EcoGraphicArbiter({ watchdog });

  // 10.1 Multiple successive destroy() calls
  watchdog.destroy();
  watchdog.destroy();
  arbiter.destroy();
  arbiter.destroy();
  assert(true, 'Multiple successive destroy() calls are completely idempotent and safe');

  // 10.2 Zero / degenerate canvas bounds
  const zeroBounds = { width: 0, height: 0 };
  const zeroRect = arbiter.calculateScissorRect(zeroBounds, { x: 0, y: 0, width: 100, height: 100 });
  assert(zeroRect.width === 0 && zeroRect.height === 0, 'Zero canvas dimensions handled gracefully');

  // 10.3 Rapid blur and focus transitions
  const robustWatchdog = new AdaptiveBatteryWatchdog();
  for (let i = 0; i < 50; i++) {
    robustWatchdog.simulateBlur(i % 2 === 0);
  }
  robustWatchdog.simulateBlur(false);
  assert(robustWatchdog.getState() === DISPLAY_STATES.ACTIVE, 'Rapid blur/focus churn leaves watchdog in clean ACTIVE state');
  robustWatchdog.destroy();

  // 10.4 NaN and infinite timestamps in step()
  const robustArbiter = new EcoGraphicArbiter({ autoStart: false });
  robustArbiter.step(NaN);
  robustArbiter.step(Infinity);
  robustArbiter.step(undefined);
  assert(true, 'step() safely survives NaN, Infinity, and undefined timestamps');
  robustArbiter.destroy();

  // 10.5 Missing or null renderers
  robustArbiter.registerUIRenderer('nullRenderer', null);
  robustArbiter.registerCanvasRenderer('nullCanvas', null);
  assert(robustArbiter.uiRenderers.size === 0, 'registerUIRenderer ignores non-functions');
  assert(robustArbiter.canvasRenderers.size === 0, 'registerCanvasRenderer ignores non-functions');

  // 10.6 TypeScript definitions file validation
  const dtsPath = path.join(__dirname, 'battery_watchdog.d.ts');
  assert(fs.existsSync(dtsPath), 'battery_watchdog.d.ts file exists');
  const dtsContent = fs.readFileSync(dtsPath, 'utf8');
  assert(dtsContent.includes('export declare class AdaptiveBatteryWatchdog'), 'd.ts declares AdaptiveBatteryWatchdog');
  assert(dtsContent.includes('export declare class EcoGraphicArbiter'), 'd.ts declares EcoGraphicArbiter');
  assert(dtsContent.includes('export interface ScissorRect'), 'd.ts declares ScissorRect');
  assert(dtsContent.includes('export declare const BATTERY_TIERS'), 'd.ts declares BATTERY_TIERS');
  assert(dtsContent.includes('export declare const DISPLAY_STATES'), 'd.ts declares DISPLAY_STATES');

  // 10.7 Verify battery API rejection handling in browser environment simulation
  const mockFailingNavigator = {
    getBattery: () => Promise.reject(new Error('Permission Denied')),
  };
  const mockGlobalCtx = vm.createContext({
    window: { addEventListener: () => {}, removeEventListener: () => {} },
    document: { hidden: false, addEventListener: () => {}, removeEventListener: () => {} },
    navigator: mockFailingNavigator,
    console,
    Date,
    setTimeout,
    clearTimeout,
  });
  const vmWatchdogCode = `
    const { AdaptiveBatteryWatchdog, BATTERY_TIERS } = module.exports;
    const w = new AdaptiveBatteryWatchdog({ autoSleep: false });
    w;
  `;
  const vmCjsMod = { exports: {} };
  vm.runInContext(umdCode, Object.assign(mockGlobalCtx, { module: vmCjsMod, exports: vmCjsMod.exports }));
  const rejectWatchdog = vm.runInContext(vmWatchdogCode, mockGlobalCtx);
  assert(rejectWatchdog.getTier() === 'TIER_HIGH', 'Rejection in navigator.getBattery gracefully falls back to default high tier');
  assert(rejectWatchdog.batterySupported === false, 'Rejection correctly marks batterySupported as false');
  rejectWatchdog.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 11: Deep Verification & Hardened Guarantees
// -----------------------------------------------------------------------------
console.log('\n🔒 Test Suite 11: Deep Verification & Hardened Guarantees');
{
  // 11.1 Multi-listener event emitter support
  const watchdog = new AdaptiveBatteryWatchdog({ autoSleep: false });
  let tierEvents = [];
  let stateEvents = [];
  let sleepEvents = 0;
  let wakeEvents = 0;

  const onTier = (tier, info) => tierEvents.push({ tier, level: info.level });
  const onState = (state) => stateEvents.push(state);
  const onSleep = () => sleepEvents++;
  const onWake = () => wakeEvents++;

  watchdog.addEventListener('tierchange', onTier);
  watchdog.addEventListener('statechange', onState);
  watchdog.addEventListener('sleep', onSleep);
  watchdog.addEventListener('wake', onWake);

  watchdog.simulateBattery({ charging: false, level: 0.15 }); // triggers ECO
  assert(tierEvents.length === 1 && tierEvents[0].tier === BATTERY_TIERS.ECO, 'addEventListener received tierchange');

  watchdog.simulateVisibility(true);
  assert(stateEvents.includes(DISPLAY_STATES.HIDDEN), 'addEventListener received statechange');

  watchdog.sleep();
  assert(sleepEvents === 1, 'addEventListener received sleep event');

  watchdog.wake();
  assert(wakeEvents === 1, 'addEventListener received wake event');

  // Verify removeEventListener
  watchdog.removeEventListener('tierchange', onTier);
  watchdog.simulateBattery({ charging: true, level: 1.0 });
  assert(tierEvents.length === 1, 'removeEventListener successfully detached tierchange listener');
  watchdog.destroy();

  // 11.2 UI Throttling during Sleep & Hidden (Elimination of Fatal Functional Bug)
  const arbiter = new EcoGraphicArbiter({
    uiTargetFps: 60,
    canvasTargetFps: 30,
    autoStart: false,
  });

  let testUiTicks = 0;
  let testCanvasTicks = 0;
  arbiter.registerUIRenderer('testUI', () => testUiTicks++);
  arbiter.registerCanvasRenderer('testCanvas', () => testCanvasTicks++);

  let t = 20000;
  arbiter.step(t);

  // Normal active: UI renders at 60 FPS
  for (let i = 0; i < 60; i++) {
    t += 16.666;
    arbiter.step(t);
  }
  assert(testUiTicks >= 58, `UI renders normally at 60 FPS when active (rendered: ${testUiTicks})`);

  // Hibernation (Sleep): UI must DROP to 0 FPS (neither UI nor Canvas renders!)
  arbiter.watchdog.sleep();
  const uiBeforeSleep = testUiTicks;
  const canvasBeforeSleep = testCanvasTicks;
  for (let i = 0; i < 30; i++) {
    t += 16.666;
    arbiter.step(t);
  }
  assert(testUiTicks === uiBeforeSleep, 'UI completely halts (0 FPS) during hibernation sleep');
  assert(testCanvasTicks === canvasBeforeSleep, 'Canvas completely halts (0 FPS) during hibernation sleep');

  // Tab hidden: UI must throttle to <= 1 FPS (Zero Idle Overhead)
  arbiter.watchdog.wake();
  arbiter.watchdog.simulateVisibility(true);
  const uiBeforeHidden = testUiTicks;
  for (let i = 0; i < 60; i++) {
    t += 16.666;
    arbiter.step(t);
  }
  const uiHiddenFrames = testUiTicks - uiBeforeHidden;
  assert(uiHiddenFrames <= 2, `UI throttled to <= 1 FPS when tab hidden (rendered: ${uiHiddenFrames})`);

  arbiter.destroy();

  // 11.3 Context recovery auto-attachment via options.gl.canvas
  const mockCanvasEl = {
    addEventListener: (type, cb) => {
      mockCanvasEl._listeners[type] = cb;
    },
    removeEventListener: () => {},
    _listeners: {},
  };
  const mockGlObj = { canvas: mockCanvasEl };

  let glContextLostPrevented = false;
  const glArbiter = new EcoGraphicArbiter({ autoStart: false });
  glArbiter.registerCanvasRenderer('glScene', () => {}, {
    gl: mockGlObj,
    autoRecover: true,
  });

  assert(typeof mockCanvasEl._listeners['webglcontextlost'] === 'function', 'Auto-attached context recovery to gl.canvas');
  const mockLostEvt = {
    type: 'webglcontextlost',
    preventDefault: () => {
      glContextLostPrevented = true;
    },
  };
  mockCanvasEl._listeners['webglcontextlost'](mockLostEvt);
  assert(glContextLostPrevented === true, 'e.preventDefault() called through gl.canvas attachment');
  glArbiter.destroy();

  // 11.4 High-frequency activity debounce
  const debouncedWatchdog = new AdaptiveBatteryWatchdog({ idleTimeout: 500 });
  const initialResetTime = debouncedWatchdog._lastTimerResetTime;
  // Trigger 100 rapid activity events
  for (let i = 0; i < 100; i++) {
    debouncedWatchdog._recordActivityInternal(false);
  }
  assert(debouncedWatchdog.getState() === DISPLAY_STATES.ACTIVE, 'Watchdog remains ACTIVE under 100 rapid events');
  assert(debouncedWatchdog._lastTimerResetTime === initialResetTime, 'Idle timer was not pointlessly re-created 100 times');
  debouncedWatchdog.destroy();

  // 11.5 Scissor test prevention when savings is 0%
  const scissorArbiter = new EcoGraphicArbiter({ autoStart: false });
  let scissorCalls = [];
  const mockGlDisabled = {
    SCISSOR_TEST: 0xc11,
    enable: (cap) => scissorCalls.push('enable'),
    disable: (cap) => scissorCalls.push('disable'),
    scissor: () => scissorCalls.push('scissor'),
  };
  // Panel completely outside canvas -> 0 savings
  scissorArbiter.applyScissorOptimization(mockGlDisabled, { width: 1000, height: 1000 }, { x: 2000, y: 0, width: 200, height: 200 });
  assert(scissorCalls.includes('disable'), 'gl.disable(SCISSOR_TEST) called when savings is 0%');
  assert(!scissorCalls.includes('enable'), 'gl.enable(SCISSOR_TEST) strictly skipped when savings is 0%');
  scissorArbiter.destroy();
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
console.log('========================================\n');

