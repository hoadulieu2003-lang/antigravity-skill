/**
 * Type definitions for WebGLMicroEngine — Antigravity 2.0
 */

export interface FrameBudgetWatchdogOptions {
  targetFps?: number;
  budgetCeiling?: number;
  maxDpr?: number;
  minDpr?: number;
  historySize?: number;
  streakThreshold?: number;
  onDprChange?: (newDpr: number) => void;
}

export interface FrameBudgetStats {
  fps: number;
  avgFrameTime: number;
  currentDpr: number;
  streak: number;
}

export declare class FrameBudgetWatchdog {
  constructor(options?: FrameBudgetWatchdogOptions);
  recordFrame(now: number): void;
  stepDown(): void;
  getDpr(): number;
  getStats(): FrameBudgetStats;
  reset(): void;
}

export interface EngineInstance {
  destroy: () => void;
  pause: () => void;
  resume: () => void;
  renderFrame: (timeMs?: number) => void;
  getWatchdog: () => FrameBudgetWatchdog | null;
  resize?: () => void;
}

export interface ParticleMeshInstance extends EngineInstance {
  getLastStrokeCount: () => number;
  getParticles: () => Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }>;
  getBuckets: () => number[][];
  setMousePosition: (x: number, y: number, active?: boolean) => void;
}

export interface LiquidWavesOptions {
  baseColor?: [number, number, number];
  speed?: number;
  intensity?: number;
  maxDpr?: number;
  minDpr?: number;
}

export interface ParticleMeshOptions {
  particleCount?: number;
  maxDistance?: number;
  mouseRadius?: number;
  baseColor?: [number, number, number];
  speed?: number;
  quantizedAlphas?: [number, number, number, number];
  maxDpr?: number;
  minDpr?: number;
}

export interface TitaniumGridOptions {
  baseColor?: [number, number, number];
  speed?: number;
  intensity?: number;
  maxDpr?: number;
  minDpr?: number;
}

export type MicroEngineMode = 'liquid-waves' | 'particle-mesh' | 'titanium-grid';

export interface MicroEngineInitOptions extends LiquidWavesOptions, ParticleMeshOptions, TitaniumGridOptions {
  mode?: MicroEngineMode;
}

export declare function initLiquidWaves(target: string | HTMLCanvasElement | null, options?: LiquidWavesOptions): EngineInstance;
export declare function initParticleMesh(target: string | HTMLCanvasElement | null, options?: ParticleMeshOptions): ParticleMeshInstance;
export declare function initTitaniumGrid(target: string | HTMLCanvasElement | null, options?: TitaniumGridOptions): EngineInstance;

export declare function computeLuminance(r: number, g: number, b: number): number;
export declare function clamp(val: number, min: number, max: number): number;
export declare function lerp(start: number, end: number, factor: number): number;
export declare function prefersReducedMotion(): boolean;
export declare function isTestMode(): boolean;

export declare const SHADERS: {
  QUAD_VS: string;
  LIQUID_WAVES_FS: string;
  TITANIUM_GRID_FS: string;
};

export declare const WebGLMicroEngine: {
  version: string;
  init(target: string | HTMLCanvasElement | null, options?: MicroEngineInitOptions): EngineInstance | ParticleMeshInstance;
  initLiquidWaves: typeof initLiquidWaves;
  initParticleMesh: typeof initParticleMesh;
  initTitaniumGrid: typeof initTitaniumGrid;
  FrameBudgetWatchdog: typeof FrameBudgetWatchdog;
  SHADERS: typeof SHADERS;
  initAll(options?: MicroEngineInitOptions): { destroy: () => void };
};

export default WebGLMicroEngine;
