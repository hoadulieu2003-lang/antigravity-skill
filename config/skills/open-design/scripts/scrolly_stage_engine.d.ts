/**
 * Type definitions for ScrollyStageEngine
 * Antigravity 2.0 Open-Design Architecture
 */

export type SceneTransitionType = 'fade' | 'slide' | 'zoom' | 'stack' | 'custom' | string;

export interface SceneConfig {
  id?: string | number;
  title?: string;
  label?: string;
  element?: HTMLElement | string | null;
  transition?: SceneTransitionType;
  onEnter?: (scene: SceneInstance, direction: 'forward' | 'backward') => void;
  onLeave?: (scene: SceneInstance, direction: 'forward' | 'backward') => void;
  onUpdate?: (progress: number, scene: SceneInstance) => void;
  customAnimation?: (timeline: any, scene: SceneInstance, index: number, total: number) => void;
  data?: Record<string, any>;
}

export interface SceneInstance extends SceneConfig {
  id: string | number;
  title: string;
  element: HTMLElement | null;
  index: number;
}

export interface TimelineState {
  globalProgress: number;
  activeIndex: number;
  sceneProgress: number;
  sceneProgresses: number[];
}

export interface TransformedAncestorCheckResult {
  safe: boolean;
  transformedAncestor: HTMLElement | null;
  property: string | null;
  value: string | null;
  suggestedPinType: 'fixed' | 'transform';
  reason: string;
}

export interface GsapTickerBridgeOptions {
  gsap?: any;
  lenis?: any;
  ScrollTrigger?: any;
  scroller?: HTMLElement | Window | null;
  pinType?: 'fixed' | 'transform';
}

export interface GsapTickerBridgeInstance {
  isConnected: boolean;
  destroy: () => void;
}

export interface ScrollyStageEngineOptions {
  container: HTMLElement | string;
  stage?: HTMLElement | string | null;
  scenes?: Array<SceneConfig | string>;
  trackMultiplier?: number;
  pinType?: 'auto' | 'fixed' | 'transform';
  gsap?: any;
  ScrollTrigger?: any;
  lenis?: any;
  progressBar?: boolean | HTMLElement | string | null;
  chapterMarkers?: boolean | HTMLElement | string | null;
  transition?: SceneTransitionType;
  onProgress?: (globalProgress: number, activeIndex: number, sceneProgress: number) => void;
  onSceneChange?: (currentIndex: number, previousIndex: number) => void;
  reducedMotion?: 'auto' | boolean;
  tier?: 'auto' | 'high' | 'lite';
  viewportObserver?: boolean;
  autoInit?: boolean;
}

export interface InitAllInstance {
  instances: ScrollyStageEngine[];
  destroy: () => void;
}

export declare class ScrollyStageEngine {
  constructor(options?: ScrollyStageEngineOptions);

  options: ScrollyStageEngineOptions;
  container: HTMLElement | null;
  stage: HTMLElement | null;
  scenes: SceneInstance[];
  progressBar: HTMLElement | null;
  chapterMarkers: HTMLElement[];
  markersContainer: HTMLElement | null;
  activeIndex: number;
  progress: number;
  isViewportActive: boolean;
  isPaused: boolean;
  isDestroyed: boolean;
  pinType: 'fixed' | 'transform';
  isReducedMotion: boolean;
  isTierLite: boolean;

  init(): this;
  update(rawProgress: number): void;
  goToScene(index: number, options?: { smooth?: boolean; immediate?: boolean }): void;
  nextScene(): void;
  prevScene(): void;
  seek(targetProgress: number, options?: { smooth?: boolean; immediate?: boolean }): void;
  pause(): void;
  resume(): void;
  refresh(): void;
  destroy(): void;

  static assertNoTransformedAncestor(element: Element): TransformedAncestorCheckResult;
  static setupGsapTickerBridge(options?: GsapTickerBridgeOptions): GsapTickerBridgeInstance;
  static calculateSceneTimeline(rawProgress: number, sceneCount: number): TimelineState;
  static calculateTrackHeight(sceneCount: number, trackMultiplier?: number): string;
  static calculateLockedVh(): number;
  static lockViewportHeight(targetElement?: Element | null): number;
  static isTierLite(options?: { tier?: string }): boolean;
  static prefersReducedMotion(): boolean;
  static initAll(options?: Partial<ScrollyStageEngineOptions>): InitAllInstance;
}

export declare const isBrowser: () => boolean;
export declare function clamp(val: number, min?: number, max?: number): number;
export declare function lerp(start: number, end: number, factor: number): number;
export declare function prefersReducedMotion(): boolean;
export declare function isTierLite(options?: { tier?: string }): boolean;
export declare function calculateLockedVh(): number;
export declare function lockViewportHeight(targetElement?: Element | null): number;
export declare function assertNoTransformedAncestor(element: Element): TransformedAncestorCheckResult;
export declare function setupGsapTickerBridge(options?: GsapTickerBridgeOptions): GsapTickerBridgeInstance;
export declare function calculateSceneTimeline(rawProgress: number, sceneCount: number): TimelineState;
export declare function calculateTrackHeight(sceneCount: number, trackMultiplier?: number): string;

export default ScrollyStageEngine;
