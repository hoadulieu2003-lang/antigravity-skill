import WebGLMicroEngine, {
  initLiquidWaves,
  initParticleMesh,
  initTitaniumGrid,
  FrameBudgetWatchdog,
  LiquidWavesOptions,
  ParticleMeshOptions,
  TitaniumGridOptions,
  EngineInstance,
  ParticleMeshInstance,
} from './webgl_micro_engine.js';

// Type checks
const wavesOpts: LiquidWavesOptions = {
  baseColor: [0.980, 0.976, 0.965],
  speed: 0.25,
  intensity: 1.0,
  maxDpr: 2.0,
  minDpr: 0.75,
};

const meshOpts: ParticleMeshOptions = {
  particleCount: 50,
  maxDistance: 120,
  mouseRadius: 140,
  baseColor: [30, 41, 59],
  speed: 0.5,
  quantizedAlphas: [0.08, 0.18, 0.32, 0.50],
};

const gridOpts: TitaniumGridOptions = {
  baseColor: [0.976, 0.980, 0.984],
  speed: 0.45,
  intensity: 1.0,
};

// Check instance methods
const waves: EngineInstance = initLiquidWaves('#waves', wavesOpts);
waves.pause();
waves.resume();
waves.renderFrame(100);
waves.destroy();

const mesh: ParticleMeshInstance = initParticleMesh('#mesh', meshOpts);
mesh.renderFrame();
const strokeCount: number = mesh.getLastStrokeCount();
const particles = mesh.getParticles();
const buckets = mesh.getBuckets();
mesh.setMousePosition(100, 200, true);
mesh.destroy();

const grid: EngineInstance = initTitaniumGrid('#grid', gridOpts);
grid.destroy();

// Check watchdog
const watchdog = new FrameBudgetWatchdog({ targetFps: 60, budgetCeiling: 20.0 });
watchdog.recordFrame(16.6);
const dpr: number = watchdog.getDpr();
const stats = watchdog.getStats();
watchdog.reset();

// Master init
const inst = WebGLMicroEngine.init('#canvas', { mode: 'liquid-waves' });
inst.destroy();

console.log('TypeScript compilation verification passed!');
