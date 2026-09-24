/**
 * ⚡ ADAPTIVE BATTERY WATCHDOG & ECO GRAPHIC ARBITER
 * =============================================================================
 * TypeScript definitions for BatteryWatchdog & EcoGraphicArbiter — Antigravity 2.0
 */

export type BatteryTier = 'TIER_HIGH' | 'TIER_ECO' | 'TIER_CRITICAL';

export type DisplayState = 'ACTIVE' | 'IDLE' | 'SLEEP' | 'HIDDEN' | 'BLURRED';

export interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  supported: boolean;
}

export interface AdaptiveBatteryWatchdogOptions {
  lowBatteryThreshold?: number;
  criticalBatteryThreshold?: number;
  idleTimeout?: number;
  hiddenFps?: number;
  blurFps?: number;
  sleepFps?: number;
  ecoFps?: number;
  highFps?: number;
  criticalFps?: number;
  autoSleep?: boolean;
  observeVisibility?: boolean;
  observeBlur?: boolean;
  onTierChange?: (tier: BatteryTier, batteryInfo: BatteryInfo) => void;
  onStateChange?: (state: DisplayState) => void;
  onSleep?: () => void;
  onWake?: () => void;
}

export declare class AdaptiveBatteryWatchdog {
  constructor(options?: AdaptiveBatteryWatchdogOptions);

  tier: BatteryTier;
  state: DisplayState;
  batteryInfo: BatteryInfo;
  batterySupported: boolean;

  getTier(): BatteryTier;
  getState(): DisplayState;
  getBatteryInfo(): BatteryInfo;
  isSleeping(): boolean;
  isHidden(): boolean;
  isBlurred(): boolean;
  getTargetFps(): number;

  sleep(): void;
  wake(): void;
  recordActivity(): void;

  addEventListener(
    event: 'tierchange' | 'statechange' | 'sleep' | 'wake',
    callback: (...args: any[]) => void
  ): void;
  removeEventListener(
    event: 'tierchange' | 'statechange' | 'sleep' | 'wake',
    callback: (...args: any[]) => void
  ): void;

  simulateBattery(customInfo?: Partial<BatteryInfo>): void;
  simulateVisibility(hidden: boolean): void;
  simulateBlur(blurred: boolean): void;
  destroy(): void;
}

export interface CanvasBounds {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

export interface PanelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScissorRect {
  x: number;
  y: number;
  width: number;
  height: number;
  occludedRatio: number;
  isOccluded: boolean;
  savingsPercent: number;
}

export interface ContextRecoveryHandle {
  detach: () => void;
  isLost: () => boolean;
}

export interface CanvasRendererOptions {
  canvas?: HTMLCanvasElement | any;
  gl?: WebGLRenderingContext | WebGL2RenderingContext | any;
  targetFps?: number;
  autoRecover?: boolean;
  onLost?: (event: Event) => void;
  onRestored?: (event: Event, gl?: any) => void;
}

export interface ArbiterMetrics {
  uiFrames: number;
  canvasFrames: number;
  skippedCanvasFrames: number;
  lastStepTime: number;
  measuredUiFps: number;
  measuredCanvasFps: number;
}

export interface EcoGraphicArbiterOptions {
  watchdog?: AdaptiveBatteryWatchdog;
  watchdogOptions?: AdaptiveBatteryWatchdogOptions;
  uiTargetFps?: number;
  canvasTargetFps?: number;
  ecoCanvasTargetFps?: number;
  highCanvasTargetFps?: number;
  criticalCanvasTargetFps?: number;
  hiddenFps?: number;
  sleepFps?: number;
  autoStart?: boolean;
}

export declare class EcoGraphicArbiter {
  constructor(options?: EcoGraphicArbiterOptions);

  watchdog: AdaptiveBatteryWatchdog;
  uiTargetFps: number;
  canvasTargetFps: number;
  ecoCanvasTargetFps: number;
  highCanvasTargetFps: number;
  criticalCanvasTargetFps: number;
  hiddenFps: number;
  sleepFps: number;
  isRunning: boolean;

  registerUIRenderer(id: string, renderFn: (time: number, delta: number) => void): void;
  unregisterUIRenderer(id: string): void;

  registerCanvasRenderer(
    id: string,
    renderFn: (time: number, delta: number) => void,
    options?: CanvasRendererOptions
  ): void;
  unregisterCanvasRenderer(id: string): void;

  calculateScissorRect(canvasBounds: CanvasBounds, panelBounds: PanelBounds): ScissorRect;
  applyScissorOptimization(gl: any, canvasBounds: CanvasBounds, panelBounds: PanelBounds): ScissorRect | null;
  clearScissorOptimization(gl: any): void;

  attachContextRecovery(
    canvas: any,
    callbacks?: { onLost?: (e: any) => void; onRestored?: (e: any, gl?: any) => void }
  ): ContextRecoveryHandle;
  simulateContextLost(canvas: any): boolean;
  simulateContextRestored(canvas: any): boolean;

  getEffectiveUiFps(): number;
  getEffectiveCanvasFps(): number;
  step(now?: number): { renderedUi: boolean; renderedCanvas: boolean };
  start(): void;
  stop(): void;
  getMetrics(): ArbiterMetrics;
  destroy(): void;
}

export declare const BATTERY_TIERS: {
  readonly HIGH: 'TIER_HIGH';
  readonly ECO: 'TIER_ECO';
  readonly CRITICAL: 'TIER_CRITICAL';
};

export declare const DISPLAY_STATES: {
  readonly ACTIVE: 'ACTIVE';
  readonly IDLE: 'IDLE';
  readonly SLEEP: 'SLEEP';
  readonly HIDDEN: 'HIDDEN';
  readonly BLURRED: 'BLURRED';
};

export declare function initBatteryWatchdog(options?: AdaptiveBatteryWatchdogOptions): AdaptiveBatteryWatchdog;
export declare function initGraphicArbiter(options?: EcoGraphicArbiterOptions): EcoGraphicArbiter;

export declare const BatteryWatchdog: {
  version: string;
  BATTERY_TIERS: typeof BATTERY_TIERS;
  DISPLAY_STATES: typeof DISPLAY_STATES;
  AdaptiveBatteryWatchdog: typeof AdaptiveBatteryWatchdog;
  EcoGraphicArbiter: typeof EcoGraphicArbiter;
  initBatteryWatchdog: typeof initBatteryWatchdog;
  initGraphicArbiter: typeof initGraphicArbiter;
};

export default BatteryWatchdog;
