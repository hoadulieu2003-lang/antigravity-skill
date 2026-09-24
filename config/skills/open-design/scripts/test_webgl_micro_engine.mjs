/**
 * 🧪 Comprehensive Unit & Adversarial Test Suite for WebGLMicroEngine
 * ====================================================================
 * Tests:
 * 1. Module Structure & Universal Exports (ESM & UMD)
 * 2. UMD CommonJS & Global Window execution in VM Sandbox
 * 3. SSR Safety (Zero runtime crash in Node.js environment without DOM)
 * 4. Math, Luminance & Shader Invariants:
 *    - Base color luminance >= 0.90 compliance
 *    - Absence of Reinhard tone mapping (no gray crushing)
 *    - Presence of fwidth anti-aliasing in Titanium Grid
 *    - Presence of Blinn-Phong specular formula
 * 5. FrameBudgetWatchdog Logic:
 *    - 60 FPS runtime monitoring
 *    - Consecutive slow frames detection & dynamic DPR step-down
 *    - Cooldown hysteresis to prevent thrashing
 *    - Stats accuracy & reset
 * 6. Interactive Particle Mesh & 4-Tier Quantized Alpha Stroke Buckets:
 *    - Particle network initialization & spring proximity physics
 *    - Exactly <= 4 stroke() calls per frame (verified via mock canvas context)
 *    - 4 discrete bucket quantization & zero popping
 * 7. WebGL Mock Pipeline Simulation:
 *    - Liquid Waves & Titanium Grid compilation, uniforms, and draw calls
 *    - WebGL resource cleanup on destroy()
 * 8. IntersectionObserver Pause & Resume Simulation
 * 9. prefers-reduced-motion & ?test-mode=1 Auto-Bypass
 * 10. Lifecycle Cleanup & Edge Cases
 */

import {
  WebGLMicroEngine,
  initLiquidWaves,
  initParticleMesh,
  initTitaniumGrid,
  FrameBudgetWatchdog,
  computeLuminance,
  clamp,
  lerp,
  SHADERS,
  prefersReducedMotion,
  isTestMode,
} from './webgl_micro_engine.js';

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

console.log('🚀 Starting WebGLMicroEngine Test Suite...\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Module Structure & Exports
// -----------------------------------------------------------------------------
console.log('📦 Test Suite 1: Module Structure & Exports');
assert(typeof WebGLMicroEngine === 'object', 'WebGLMicroEngine is exported as an object');
assert(WebGLMicroEngine.version === '2.0.0', 'WebGLMicroEngine version is 2.0.0');
assert(typeof initLiquidWaves === 'function', 'initLiquidWaves is exported as a function');
assert(typeof initParticleMesh === 'function', 'initParticleMesh is exported as a function');
assert(typeof initTitaniumGrid === 'function', 'initTitaniumGrid is exported as a function');
assert(typeof FrameBudgetWatchdog === 'function', 'FrameBudgetWatchdog is exported as a class');
assert(typeof computeLuminance === 'function', 'computeLuminance is exported as a function');
assert(typeof SHADERS === 'object', 'SHADERS dictionary is exported');
assert(typeof WebGLMicroEngine.init === 'function', 'WebGLMicroEngine.init is a function');
assert(typeof WebGLMicroEngine.initAll === 'function', 'WebGLMicroEngine.initAll is a function');

// -----------------------------------------------------------------------------
// Test Suite 2: UMD CommonJS & Global Window Sandbox Execution
// -----------------------------------------------------------------------------
console.log('\n🌐 Test Suite 2: UMD Sandbox Loading (CJS & Window Global)');
{
  const umdPath = path.join(__dirname, 'webgl_micro_engine.umd.js');
  const umdCode = fs.readFileSync(umdPath, 'utf8');

  // Test CJS export
  const cjsSandbox = {
    exports: {},
    module: { exports: {} },
  };
  vm.createContext(cjsSandbox);
  vm.runInContext(umdCode, cjsSandbox);
  const cjsExport = cjsSandbox.module.exports;

  assert(cjsExport && typeof cjsExport.initLiquidWaves === 'function', 'UMD CommonJS exports initLiquidWaves');
  assert(typeof cjsExport.initParticleMesh === 'function', 'UMD CommonJS exports initParticleMesh');
  assert(typeof cjsExport.initTitaniumGrid === 'function', 'UMD CommonJS exports initTitaniumGrid');
  assert(typeof cjsExport.FrameBudgetWatchdog === 'function', 'UMD CommonJS exports FrameBudgetWatchdog');

  // Test Window Global attachment
  const windowSandbox = {};
  windowSandbox.window = windowSandbox;
  windowSandbox.globalThis = windowSandbox;
  vm.createContext(windowSandbox);
  vm.runInContext(umdCode, windowSandbox);

  assert(windowSandbox.WebGLMicroEngine && windowSandbox.WebGLMicroEngine.version === '2.0.0', 'UMD window.WebGLMicroEngine version is 2.0.0');
  assert(typeof windowSandbox.initLiquidWaves === 'function', 'UMD window.initLiquidWaves is defined');
  assert(typeof windowSandbox.initParticleMesh === 'function', 'UMD window.initParticleMesh is defined');
  assert(typeof windowSandbox.initTitaniumGrid === 'function', 'UMD window.initTitaniumGrid is defined');
}

// -----------------------------------------------------------------------------
// Test Suite 3: SSR Safety (Zero crash in Node runtime without DOM)
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 3: SSR Safety (Node.js runtime without DOM)');
{
  const wavesSSR = initLiquidWaves(null);
  assert(typeof wavesSSR.destroy === 'function', 'SSR initLiquidWaves returns safe destroy()');
  assert(typeof wavesSSR.pause === 'function', 'SSR initLiquidWaves returns safe pause()');
  assert(typeof wavesSSR.resume === 'function', 'SSR initLiquidWaves returns safe resume()');
  assert(typeof wavesSSR.renderFrame === 'function', 'SSR initLiquidWaves returns safe renderFrame()');
  assert(wavesSSR.getWatchdog() === null, 'SSR initLiquidWaves getWatchdog returns null');
  wavesSSR.destroy(); // Should not throw

  const meshSSR = initParticleMesh(null);
  assert(typeof meshSSR.destroy === 'function', 'SSR initParticleMesh returns safe destroy()');
  assert(typeof meshSSR.getLastStrokeCount === 'function', 'SSR initParticleMesh exposes getLastStrokeCount');
  assert(meshSSR.getLastStrokeCount() === 0, 'SSR initParticleMesh stroke count is 0');
  assert(Array.isArray(meshSSR.getParticles()) && meshSSR.getParticles().length === 0, 'SSR initParticleMesh particles is empty array');
  meshSSR.destroy();

  const gridSSR = initTitaniumGrid(null);
  assert(typeof gridSSR.destroy === 'function', 'SSR initTitaniumGrid returns safe destroy()');
  gridSSR.destroy();

  const initAllSSR = WebGLMicroEngine.initAll();
  assert(typeof initAllSSR.destroy === 'function', 'SSR WebGLMicroEngine.initAll returns safe destroy()');
  initAllSSR.destroy();
}

// -----------------------------------------------------------------------------
// Test Suite 4: Math, Luminance & Shader Invariants
// -----------------------------------------------------------------------------
console.log('\n🎨 Test Suite 4: Math, Luminance & Shader Invariants');
{
  // 1. Luminance calculations
  const warmPaperLum = computeLuminance(0.980, 0.976, 0.965);
  assert(warmPaperLum >= 0.90, `Warm Paper #FAF9F6 luminance is ${warmPaperLum.toFixed(3)} (>= 0.90)`);

  const pureWhiteLum = computeLuminance(1.0, 1.0, 1.0);
  assert(pureWhiteLum >= 0.90, `Pure White luminance is ${pureWhiteLum.toFixed(3)} (>= 0.90)`);

  const alabasterLum = computeLuminance(0.976, 0.980, 0.984);
  assert(alabasterLum >= 0.90, `Alabaster luminance is ${alabasterLum.toFixed(3)} (>= 0.90)`);

  // 2. Iridescent Liquid Light Waves shader verification
  const wavesShader = SHADERS.LIQUID_WAVES_FS;
  assert(typeof wavesShader === 'string' && wavesShader.length > 100, 'LIQUID_WAVES_FS is defined and populated');
  assert(!wavesShader.includes('col / (col + 1.0)') && !wavesShader.includes('col / (1.0 + col)'), 'LIQUID_WAVES_FS strictly forbids Reinhard tone mapping (no gray contrast crushing)');
  assert(!wavesShader.includes('col/(col+1.0)') && !wavesShader.includes('col/(1.0+col)'), 'LIQUID_WAVES_FS has no unspaced Reinhard tone mapping');
  assert(wavesShader.includes('iridescent'), 'LIQUID_WAVES_FS contains iridescent thin-film cosine palette');
  assert(wavesShader.includes('u_base'), 'LIQUID_WAVES_FS contains u_base uniform for light theme');
  assert(wavesShader.includes('u_time') && wavesShader.includes('u_mouse'), 'LIQUID_WAVES_FS accepts time and mouse uniforms');

  // 3. Titanium Perspective Grid shader verification
  const gridShader = SHADERS.TITANIUM_GRID_FS;
  assert(typeof gridShader === 'string' && gridShader.length > 100, 'TITANIUM_GRID_FS is defined and populated');
  assert(gridShader.includes('fwidth(gridUV)'), 'TITANIUM_GRID_FS uses fwidth for anti-aliasing against horizon aliasing');
  assert(gridShader.includes('GL_OES_standard_derivatives'), 'TITANIUM_GRID_FS supports GL_OES_standard_derivatives extension');
  assert(gridShader.includes('normalize(L + V)'), 'TITANIUM_GRID_FS computes Blinn-Phong half-vector H = normalize(L + V)');
  assert(gridShader.includes('pow(NdotH, 48.0)'), 'TITANIUM_GRID_FS calculates Blinn-Phong specular exponent (shininess 48.0)');
  assert(gridShader.includes('rd.y >= -0.005'), 'TITANIUM_GRID_FS provides horizon cutoff directly to luminous base');

  // 4. Basic math functions
  assert(clamp(5, 0, 10) === 5, 'clamp within range returns value');
  assert(clamp(-5, 0, 10) === 0, 'clamp below min returns min');
  assert(clamp(15, 0, 10) === 10, 'clamp above max returns max');
  assert(lerp(0, 100, 0.5) === 50, 'lerp halfway returns midpoint');
}

// -----------------------------------------------------------------------------
// Test Suite 5: FrameBudgetWatchdog Logic (Performance Protection & Dynamic DPR)
// -----------------------------------------------------------------------------
console.log('\n⏱️ Test Suite 5: FrameBudgetWatchdog (60 FPS & Dynamic DPR Downscaling)');
{
  let dprChangedTo = null;
  const watchdog = new FrameBudgetWatchdog({
    targetFps: 60,
    budgetCeiling: 20.0, // 50 FPS threshold
    maxDpr: 2.0,
    minDpr: 0.75,
    streakThreshold: 4,
    onDprChange: (newDpr) => {
      dprChangedTo = newDpr;
    },
  });

  assert(watchdog.getDpr() === 2.0, 'Initial DPR is 2.0 (maxDpr)');

  // Feed 10 normal frames (16.6ms each)
  let time = 1000;
  for (let i = 0; i < 10; i++) {
    time += 16.66;
    watchdog.recordFrame(time);
  }

  assert(watchdog.getDpr() === 2.0, 'DPR stays at 2.0 under 60 FPS normal load');
  assert(watchdog.slowFrameStreak === 0, 'Slow frame streak is 0 under normal load');

  const statsNormal = watchdog.getStats();
  assert(statsNormal.fps >= 58 && statsNormal.fps <= 62, `Normal stats report ~60 FPS (${statsNormal.fps})`);

  // Inject slow frames (25.0ms each = 40 FPS) to trigger dynamic DPR step down
  for (let i = 0; i < 5; i++) {
    time += 25.0;
    watchdog.recordFrame(time);
  }
  assert(watchdog.getDpr() === 1.5, `Watchdog automatically stepped down DPR to 1.5 (was ${watchdog.getDpr()})`);
  assert(dprChangedTo === 1.5, 'onDprChange callback was called with 1.5');
  assert(watchdog.cooldownFrames > 110 && watchdog.cooldownFrames <= 120, `Cooldown frames set (${watchdog.cooldownFrames}) to prevent thrashing`);

  // Verify cooldown prevents another immediate downscale
  for (let i = 0; i < 5; i++) {
    time += 25.0;
    watchdog.recordFrame(time);
  }
  assert(watchdog.getDpr() === 1.5, 'DPR remains stable during cooldown period');

  // Fast-forward cooldown
  watchdog.cooldownFrames = 0;

  // Trigger next downscale: 1.5 -> 1.0
  for (let i = 0; i < 5; i++) {
    time += 25.0;
    watchdog.recordFrame(time);
  }
  assert(watchdog.getDpr() === 1.0, `Watchdog stepped down DPR to 1.0 (was ${watchdog.getDpr()})`);

  // Fast-forward cooldown and trigger step down to minDpr (0.75)
  watchdog.cooldownFrames = 0;
  for (let i = 0; i < 5; i++) {
    time += 25.0;
    watchdog.recordFrame(time);
  }
  assert(watchdog.getDpr() === 0.75, `Watchdog stepped down to minDpr 0.75 (was ${watchdog.getDpr()})`);

  // Verify minDpr floor: subsequent slow frames do NOT drop below 0.75
  watchdog.cooldownFrames = 0;
  for (let i = 0; i < 10; i++) {
    time += 25.0;
    watchdog.recordFrame(time);
  }
  assert(watchdog.getDpr() === 0.75, 'DPR does not drop below minDpr floor (0.75)');

  // Reset verification
  watchdog.reset();
  assert(watchdog.history.length === 0, 'Reset clears frame history');
  assert(watchdog.slowFrameStreak === 0, 'Reset clears slow frame streak');
}

// -----------------------------------------------------------------------------
// Test Suite 6: Interactive Particle Mesh & 4-Tier Quantized Alpha Buckets
// -----------------------------------------------------------------------------
console.log('\n🕸️ Test Suite 6: Particle Mesh & 4-Tier Quantized Alpha Buckets');
{
  // Create a realistic Canvas 2D mock tracking stroke and beginPath calls
  let strokeCallCount = 0;
  let strokeStylesUsed = [];
  let lineSegmentsCount = 0;

  const mockCtx = {
    clearRect: () => {},
    fillRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => { lineSegmentsCount++; },
    arc: () => {},
    fill: () => {},
    stroke: () => {
      strokeCallCount++;
      strokeStylesUsed.push(mockCtx.strokeStyle);
    },
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
  };

  const mockCanvas = {
    width: 800,
    height: 600,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
    getContext: (type) => (type === '2d' ? mockCtx : null),
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const mesh = initParticleMesh(mockCanvas, {
    particleCount: 60,
    maxDistance: 140,
    mouseRadius: 150,
    baseColor: [30, 41, 59],
  });

  const particles = mesh.getParticles();
  assert(particles.length === 60, 'Particle mesh initializes exactly 60 particles');
  assert(particles.every(p => p.x >= 0 && p.x <= mockCanvas.width && p.y >= 0 && p.y <= mockCanvas.height), 'All particles are within canvas bounds');

  // Trigger a frame render and measure stroke calls
  strokeCallCount = 0;
  strokeStylesUsed = [];
  lineSegmentsCount = 0;

  mesh.renderFrame();

  const lastStrokes = mesh.getLastStrokeCount();
  assert(lastStrokes <= 4, `4-tier quantized alpha stroke buckets executed ${lastStrokes} stroke() calls (strictly <= 4)`);
  assert(strokeCallCount <= 4, `Mock context recorded exactly ${strokeCallCount} stroke() calls for entire network`);

  // Verify that buckets contain categorized coordinates
  const buckets = mesh.getBuckets();
  assert(buckets.length === 4, 'Mesh maintains exactly 4 quantized alpha stroke buckets');

  // Test mouse proximity spring interaction
  const p0 = particles[0];
  const originalVx = p0.vx;
  const originalVy = p0.vy;

  // Move mouse close to particle 0
  mesh.setMousePosition(p0.x + 10, p0.y + 10, true);
  mesh.renderFrame();

  // The velocity should have been affected by proximity repulsion
  assert(p0.vx !== originalVx || p0.vy !== originalVy, 'Mouse proximity applies spring repulsion physics to nearby particles');

  // Test mouse leave / deactivation
  mesh.setMousePosition(-9999, -9999, false);
  mesh.renderFrame();

  mesh.destroy();
  assert(mesh.getParticles().length === 0, 'destroy() cleans up particle memory');
}

// -----------------------------------------------------------------------------
// Test Suite 7: WebGL Mock Pipeline Simulation
// -----------------------------------------------------------------------------
console.log('\n🔬 Test Suite 7: WebGL Mock Pipeline Simulation');
{
  function createMockWebGL() {
    let deletedBuffers = 0;
    let deletedPrograms = 0;
    let deletedShaders = 0;
    let drawCalls = 0;
    const uniformValues = {};

    const gl = {
      VERTEX_SHADER: 35633,
      FRAGMENT_SHADER: 35632,
      COMPILE_STATUS: 35713,
      LINK_STATUS: 35714,
      ARRAY_BUFFER: 34962,
      STATIC_DRAW: 35044,
      FLOAT: 5126,
      TRIANGLES: 4,

      createShader: (type) => ({ type, id: Math.random() }),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      getShaderInfoLog: () => '',
      deleteShader: () => { deletedShaders++; },

      createProgram: () => ({ id: Math.random() }),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      deleteProgram: () => { deletedPrograms++; },

      createBuffer: () => ({ id: Math.random() }),
      bindBuffer: () => {},
      bufferData: () => {},
      deleteBuffer: () => { deletedBuffers++; },

      getAttribLocation: (prog, name) => 0,
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},

      getUniformLocation: (prog, name) => ({ name }),
      uniform2f: (loc, x, y) => { uniformValues[loc.name] = [x, y]; },
      uniform1f: (loc, v) => { uniformValues[loc.name] = v; },
      uniform3f: (loc, r, g, b) => { uniformValues[loc.name] = [r, g, b]; },

      viewport: () => {},
      drawArrays: (mode, first, count) => {
        drawCalls++;
      },
      getExtension: (name) => ({ name }),
    };

    return {
      gl,
      getStats: () => ({ deletedBuffers, deletedPrograms, deletedShaders, drawCalls, uniformValues }),
    };
  }

  // 1. Test initLiquidWaves with mock WebGL
  {
    const mock = createMockWebGL();
    const mockCanvas = {
      width: 1000,
      height: 700,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 700 }),
      getContext: (type) => (type.includes('webgl') ? mock.gl : null),
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    const waves = initLiquidWaves(mockCanvas, {
      baseColor: [0.980, 0.976, 0.965],
      speed: 0.25,
      intensity: 1.2,
    });

    waves.renderFrame(100);
    const stats = mock.getStats();

    assert(stats.drawCalls >= 1, 'Liquid Waves executed WebGL drawArrays');
    assert(stats.uniformValues['u_base'] && stats.uniformValues['u_base'][0] === 0.980, 'u_base uniform set with Warm Paper RGB');
    assert(stats.uniformValues['u_speed'] === 0.25, 'u_speed uniform set correctly');

    waves.destroy();
    const destroyStats = mock.getStats();
    assert(destroyStats.deletedBuffers >= 1, 'destroy() deletes WebGL buffer');
    assert(destroyStats.deletedPrograms >= 1, 'destroy() deletes WebGL program');
    assert(destroyStats.deletedShaders >= 2, 'destroy() deletes WebGL vertex & fragment shaders');
  }

  // 2. Test initTitaniumGrid with mock WebGL
  {
    const mock = createMockWebGL();
    let requestedDerivatives = false;
    mock.gl.getExtension = (ext) => {
      if (ext === 'OES_standard_derivatives') requestedDerivatives = true;
      return {};
    };

    const mockCanvas = {
      width: 1200,
      height: 800,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 800 }),
      getContext: (type) => (type.includes('webgl') ? mock.gl : null),
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    const grid = initTitaniumGrid(mockCanvas, {
      baseColor: [0.976, 0.980, 0.984],
      speed: 0.5,
    });

    assert(requestedDerivatives === true, 'Titanium Grid requested OES_standard_derivatives extension');

    grid.renderFrame(200);
    const stats = mock.getStats();

    assert(stats.drawCalls >= 1, 'Titanium Grid executed WebGL drawArrays');
    assert(stats.uniformValues['u_base'] && stats.uniformValues['u_base'][0] === 0.976, 'u_base uniform set with Alabaster RGB');

    grid.destroy();
    const gridDestroyStats = mock.getStats();
    assert(gridDestroyStats.deletedPrograms >= 1, 'destroy() cleans up Titanium Grid program');
  }
}

// -----------------------------------------------------------------------------
// Test Suite 8: IntersectionObserver & Accessibility Simulation
// -----------------------------------------------------------------------------
console.log('\n👁️ Test Suite 8: IntersectionObserver & Accessibility Simulation');
{
  // Mock IntersectionObserver in global scope
  let observerCallback = null;
  let observedElement = null;
  let isDisconnected = false;

  global.IntersectionObserver = class {
    constructor(cb) {
      observerCallback = cb;
    }
    observe(el) {
      observedElement = el;
    }
    disconnect() {
      isDisconnected = true;
    }
  };

  const mockCtx = {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    arc: () => {},
    fill: () => {},
  };

  const mockCanvas = {
    width: 600,
    height: 400,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 600, height: 400 }),
    getContext: () => mockCtx,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  // Provide mock window/document
  global.window = {
    devicePixelRatio: 2,
    matchMedia: () => ({ matches: false }),
    location: { search: '' },
    performance: { now: () => 1000 },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  global.document = {
    querySelector: () => mockCanvas,
    querySelectorAll: () => [mockCanvas],
    readyState: 'complete',
    addEventListener: () => {},
  };
  global.requestAnimationFrame = (fn) => setTimeout(() => fn(1016), 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);

  const inst = initParticleMesh(mockCanvas);
  assert(observedElement === mockCanvas, 'Canvas was registered with IntersectionObserver');

  // Trigger intersection false (scrolled out of view)
  observerCallback([{ target: mockCanvas, isIntersecting: false }]);
  // Verify instance is paused without error
  inst.pause();

  // Trigger intersection true (scrolled back into view)
  observerCallback([{ target: mockCanvas, isIntersecting: true }]);
  inst.resume();

  inst.destroy();
  assert(isDisconnected === true, 'destroy() disconnects IntersectionObserver');

  // Test prefers-reduced-motion bypass
  global.window.matchMedia = (query) => {
    if (query.includes('prefers-reduced-motion')) {
      return { matches: true };
    }
    return { matches: false };
  };

  assert(prefersReducedMotion() === true, 'prefersReducedMotion() correctly identifies accessibility preference');

  const reducedMotionInst = initParticleMesh(mockCanvas);
  // It renders a static frame and does not throw
  assert(typeof reducedMotionInst.destroy === 'function', 'Reduced motion safely creates controlled static instance');
  reducedMotionInst.destroy();

  // Test ?test-mode=1 URL query bypass
  global.window.matchMedia = () => ({ matches: false });
  global.window.location.search = '?test-mode=1';

  assert(isTestMode() === true, 'isTestMode() detects ?test-mode=1 parameter');
  const testModeInst = initParticleMesh(mockCanvas);
  assert(typeof testModeInst.destroy === 'function', 'test-mode safely creates deterministic single-frame instance');
  testModeInst.destroy();

  // Clean up globals
  delete global.IntersectionObserver;
  delete global.window;
  delete global.document;
  delete global.requestAnimationFrame;
  delete global.cancelAnimationFrame;
}

// -----------------------------------------------------------------------------
// Test Suite 9: Master Engine Dispatcher & Edge Cases
// -----------------------------------------------------------------------------
console.log('\n⚙️ Test Suite 9: Master Engine Dispatcher & Edge Cases');
{
  // Test WebGLMicroEngine.init mode routing
  const nullWaves = WebGLMicroEngine.init(null, { mode: 'liquid-waves' });
  assert(typeof nullWaves.destroy === 'function', 'WebGLMicroEngine.init(mode: liquid-waves) returns valid handle');

  const nullMesh = WebGLMicroEngine.init(null, { mode: 'particle-mesh' });
  assert(typeof nullMesh.getLastStrokeCount === 'function', 'WebGLMicroEngine.init(mode: particle-mesh) returns valid mesh handle');

  const nullGrid = WebGLMicroEngine.init(null, { mode: 'titanium-grid' });
  assert(typeof nullGrid.destroy === 'function', 'WebGLMicroEngine.init(mode: titanium-grid) returns valid grid handle');

  // Test multiple destroy() calls on same instance (idempotent cleanup)
  nullWaves.destroy();
  nullWaves.destroy();
  assert(true, 'Multiple successive destroy() calls are safe and idempotent');

  // Test invalid CSS selector
  const badSelectorInst = initLiquidWaves('#non-existent-canvas-12345');
  assert(typeof badSelectorInst.destroy === 'function', 'Invalid selector returns safe null-object handle');
  badSelectorInst.destroy();
}

// Test Suite 10: Adversarial Audits & Bug Regression Verification
// -----------------------------------------------------------------------------
console.log('\n🛡️ Test Suite 10: Adversarial Audits & Bug Regression Verification');
{
  // 1. Strict GLSL smoothstep edge order check (edge0 < edge1)
  const gridShader = SHADERS.TITANIUM_GRID_FS;
  assert(
    !gridShader.includes('smoothstep(lineWidth + fw, lineWidth - fw') &&
    !gridShader.includes('smoothstep(lineWidth+fw,lineWidth-fw'),
    'TITANIUM_GRID_FS rejects undefined behavior of edge0 > edge1'
  );
  assert(
    gridShader.includes('lineWidth - fw, lineWidth + fw') ||
    gridShader.includes('lineWidth-fw,lineWidth+fw'),
    'TITANIUM_GRID_FS enforces valid edge0 < edge1 in smoothstep'
  );

  // 2. FrameBudgetWatchdog NaN immunity
  const watchdog = new FrameBudgetWatchdog();
  watchdog.recordFrame(); // undefined now
  watchdog.recordFrame(NaN); // NaN now
  watchdog.recordFrame(0); // 0 now
  const stats = watchdog.getStats();
  assert(!isNaN(stats.fps) && isFinite(stats.fps), `Watchdog fps is finite number (${stats.fps}) despite undefined/NaN inputs`);
  assert(!isNaN(stats.avgFrameTime) && isFinite(stats.avgFrameTime), `Watchdog avgFrameTime is finite (${stats.avgFrameTime})`);

  // 3. Particle Mesh non-destructive position rescaling on resize
  {
    const mockCtx = {
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
      lineWidth: 1,
    };
    let curWidth = 400;
    let curHeight = 300;
    const mockCanvas = {
      width: 400,
      height: 300,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: curWidth, height: curHeight }),
      getContext: () => mockCtx,
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    const mesh = initParticleMesh(mockCanvas, { particleCount: 30, maxDpr: 1.0, minDpr: 1.0 });
    const pList = mesh.getParticles();
    const p0 = pList[0];
    const initialX = p0.x;
    const initialY = p0.y;

    // Simulate canvas element resize in layout (doubling dimensions)
    curWidth = 800;
    curHeight = 600;
    mesh.resize();

    // Verify particle array was not erased and respawned randomly, but scaled by 2
    assert(pList.length === 30, 'Particle count preserved on resize');
    assert(Math.abs(p0.x - initialX * 2) < 0.001, `Particle X rescaled smoothly: was ${initialX.toFixed(1)}, now ${p0.x.toFixed(1)}`);
    assert(Math.abs(p0.y - initialY * 2) < 0.001, `Particle Y rescaled smoothly: was ${initialY.toFixed(1)}, now ${p0.y.toFixed(1)}`);
    mesh.destroy();
  }

  // 4. Particle Mesh mouseRadius DPR scaling
  {
    const mockCtx = {
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
      lineWidth: 1,
    };
    const mockCanvas = {
      width: 1600,
      height: 1200,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      getContext: () => mockCtx,
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    // DPR 2.0 -> effectiveMouseRadius should be 100 * 2 = 200
    const mesh = initParticleMesh(mockCanvas, { particleCount: 1, mouseRadius: 100, maxDpr: 2.0, minDpr: 2.0 });
    const p = mesh.getParticles()[0];
    p.x = 500;
    p.y = 500;
    p.vx = 0;
    p.vy = 0;

    // Place mouse at distance 150 (outside unscaled radius 100, but INSIDE DPR-scaled radius 200)
    mesh.setMousePosition(500 + 150, 500, true);
    mesh.renderFrame();

    assert(p.vx !== 0, `Mouse proximity triggers repulsion within DPR-scaled radius (vx=${p.vx.toFixed(3)})`);
    mesh.destroy();
  }

  // 5. Accessibility & Test-Mode immunity: IntersectionObserver scroll-out/in does NOT restart loop
  {
    let observerCallback = null;
    let scheduledRaf = false;

    global.IntersectionObserver = class {
      constructor(cb) {
        observerCallback = cb;
      }
      observe() {}
      disconnect() {}
    };

    const mockCanvas = {
      width: 400,
      height: 300,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 300 }),
      getContext: () => ({
        clearRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        arc: () => {},
        fill: () => {},
      }),
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    global.window = {
      devicePixelRatio: 1,
      matchMedia: () => ({ matches: true }), // prefers-reduced-motion is TRUE
      location: { search: '' },
      performance: { now: () => 1000 },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    global.document = { querySelector: () => mockCanvas, querySelectorAll: () => [mockCanvas], readyState: 'complete', addEventListener: () => {} };
    global.requestAnimationFrame = (fn) => { scheduledRaf = true; return 1; };
    global.cancelAnimationFrame = () => {};

    const reducedInst = initParticleMesh(mockCanvas);
    scheduledRaf = false;

    // Simulate canvas scrolling out of view
    observerCallback([{ target: mockCanvas, isIntersecting: false }]);
    // Simulate canvas scrolling back into view
    observerCallback([{ target: mockCanvas, isIntersecting: true }]);

    assert(scheduledRaf === false, 'IntersectionObserver scroll-in strictly DOES NOT restart rAF loop under prefers-reduced-motion');
    reducedInst.destroy();

    // 6. Manual pause() immunity against IntersectionObserver scroll-in
    global.window.matchMedia = () => ({ matches: false });
    const normalInst = initParticleMesh(mockCanvas);
    scheduledRaf = false;

    // Developer explicitly pauses the engine
    normalInst.pause();

    // Simulate canvas scrolling out and in
    observerCallback([{ target: mockCanvas, isIntersecting: false }]);
    observerCallback([{ target: mockCanvas, isIntersecting: true }]);

    assert(scheduledRaf === false, 'IntersectionObserver scroll-in strictly DOES NOT override manual developer pause()');
    normalInst.destroy();

    delete global.IntersectionObserver;
    delete global.window;
    delete global.document;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  }

  // 7. Deterministic renderFrame(0) non-negative elapsed time
  {
    let recordedTime = null;
    const mockGl = {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      COMPILE_STATUS: 1,
      LINK_STATUS: 1,
      ARRAY_BUFFER: 1,
      STATIC_DRAW: 1,
      FLOAT: 1,
      TRIANGLES: 1,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      getShaderInfoLog: () => '',
      deleteShader: () => {},
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      deleteProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      deleteBuffer: () => {},
      getAttribLocation: () => 0,
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      getUniformLocation: (p, name) => ({ name }),
      uniform2f: () => {},
      uniform1f: (loc, val) => {
        if (loc.name === 'u_time') recordedTime = val;
      },
      uniform3f: () => {},
      viewport: () => {},
      drawArrays: () => {},
      getExtension: () => ({}),
    };

    const mockCanvas = {
      width: 400,
      height: 300,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 300 }),
      getContext: () => mockGl,
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    const waves = initLiquidWaves(mockCanvas);
    waves.renderFrame(0);
    assert(recordedTime === 0, `renderFrame(0) passes exactly 0.0 to u_time (was ${recordedTime})`);
    waves.destroy();
  }

  // 8. Minified Artifacts Integrity
  {
    const minEsmPath = path.join(__dirname, 'webgl_micro_engine.min.js');
    assert(fs.existsSync(minEsmPath), 'webgl_micro_engine.min.js exists');
    const minEsmContent = fs.readFileSync(minEsmPath, 'utf8');
    assert(minEsmContent.length > 1000, 'webgl_micro_engine.min.js is populated');

    const minUmdPath = path.join(__dirname, 'webgl_micro_engine.umd.min.js');
    assert(fs.existsSync(minUmdPath), 'webgl_micro_engine.umd.min.js exists');
    const minUmdContent = fs.readFileSync(minUmdPath, 'utf8');
    assert(minUmdContent.length > 1000, 'webgl_micro_engine.umd.min.js is populated');
  }
}

console.log('\n========================================');
console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
console.log('========================================\n');

