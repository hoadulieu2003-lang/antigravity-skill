/**
 * Type definitions for WowEngine
 */

export interface SpotlightOptions {
  proximity?: number;
  activeClass?: string;
  relativeRatio?: boolean;
  centeredCoords?: boolean;
  onMove?: (event: PointerEvent, data: { x: number; y: number; rx: number; ry: number; width: number; height: number; element: Element }) => void;
}

export interface SpotlightInstance {
  destroy: () => void;
  update: () => void;
}

export interface ParallaxTiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  stiffness?: number;
  damping?: number;
  reverse?: boolean;
  glare?: boolean;
  glareMaxOpacity?: number;
  axis?: 'x' | 'y' | 'both';
}

export interface ParallaxTiltInstance {
  destroy: () => void;
  reset: () => void;
}

export interface WebAudioHapticsOptions {
  muted?: boolean;
  volume?: number;
}

export declare class WebAudioHaptics {
  constructor(options?: WebAudioHapticsOptions);
  getContext(): AudioContext | null;
  setMuted(muted: boolean): void;
  getMuted(): boolean;
  toggleMute(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  playClick(): void;
  playPop(): void;
  playChime(): void;
  playTabSwitch(): void;
  playToggle(state?: boolean): void;
  bind(root?: Element | Document): () => void;
}

export declare const haptics: WebAudioHaptics;

export interface SmoothScrollOptions {
  lerp?: number;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  autoResize?: boolean;
  onScroll?: (data: { scroll: number; target: number; limit: number; velocity: number; progress: number; direction: number }) => void;
}

export interface SmoothScrollInstance {
  destroy: () => void;
  scrollTo: (target: number | string | Element, options?: { offset?: number; immediate?: boolean }) => void;
  stop: () => void;
  start: () => void;
  onScroll: (callback: (data: any) => void) => () => void;
}

export interface WowEngineConfig {
  spotlight?: boolean | SpotlightOptions;
  parallax?: boolean | ParallaxTiltOptions;
  haptics?: boolean;
  smoothScroll?: boolean | SmoothScrollOptions;
}

export declare function initSpotlight(selector: string | Element | NodeList | Element[], options?: SpotlightOptions): SpotlightInstance;
export declare function initParallaxTilt(selector: string | Element | NodeList | Element[], options?: ParallaxTiltOptions): ParallaxTiltInstance;
export declare function initSmoothScroll(options?: SmoothScrollOptions): SmoothScrollInstance;

export declare const WowEngine: {
  version: string;
  initSpotlight: typeof initSpotlight;
  initParallaxTilt: typeof initParallaxTilt;
  WebAudioHaptics: typeof WebAudioHaptics;
  haptics: WebAudioHaptics;
  initSmoothScroll: typeof initSmoothScroll;
  initAll: (config?: WowEngineConfig) => { destroy: () => void };
};

export default WowEngine;
