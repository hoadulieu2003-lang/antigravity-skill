/**
 * ⚡ WOW ENGINE REACT — AST CONTRACT & TYPE DEFINITIONS
 * High-Performance, Zero-Dependency, 60 FPS, Next.js SSR-Safe UI Interaction Suite
 * Upstream Heritage: Emil Kowalski Design Engineering & Portfolio K18
 */

import type { RefObject, MouseEvent as ReactMouseEvent, ReactNode, ReactElement } from 'react';

// ============================================================================
// 1. UTILITY & GENERAL TYPES
// ============================================================================
export type ReducedMotionBehavior = 'always' | 'never' | 'user-preference';

export function isBrowser(): boolean;
export function clamp(val: number, min: number, max: number): number;
export function prefersReducedMotion(): boolean;
export const useIsomorphicLayoutEffect: typeof import('react').useEffect;

// ============================================================================
// 2. SPOTLIGHT TYPES
// ============================================================================
export interface SpotlightOptions {
  /** Bán kính phát hiện mở rộng ngoài biên phần tử px (Mặc định: 0) */
  proximity?: number;
  /** Class CSS tự động thêm khi con trỏ hoạt động trong vùng (Mặc định: 'is-spotlight-active') */
  activeClass?: string;
  /** Xuất biến tỷ lệ --mouse-rx và --mouse-ry (0.0 -> 1.0) (Mặc định: true) */
  relativeRatio?: boolean;
  /** Xuất biến tâm hóa --mouse-cx và --mouse-cy (-1.0 -> 1.0) (Mặc định: true) */
  centeredCoords?: boolean;
  /** Bán kính quầng sáng spotlight px (Mặc định: 380) */
  radius?: number;
  /** Màu vệt sáng spotlight CSS (Mặc định: 'rgba(56, 189, 248, 0.15)') */
  color?: string;
  /** Bật/tắt hook (Mặc định: true) */
  enabled?: boolean;
  /** Callback kích hoạt mỗi frame con trỏ di chuyển */
  onMove?: (event: PointerEvent, data: SpotlightMoveData) => void;
}

export interface SpotlightMoveData {
  x: number;
  y: number;
  rx: number;
  ry: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  element: HTMLElement;
}

export interface SpotlightReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  isHovered: boolean;
  /** Đo lại bounding rect khi giao diện dịch chuyển layout */
  refresh: () => void;
  /** Hủy thủ công listener */
  destroy: () => void;
}

export function useSpotlight<T extends HTMLElement = HTMLElement>(
  options?: SpotlightOptions
): SpotlightReturn<T>;

// ============================================================================
// 3. PARALLAX TILT TYPES
// ============================================================================
export interface ParallaxTiltOptions {
  /** Góc nghiêng tối đa tính bằng độ deg (Mặc định: 12) */
  maxTilt?: number;
  /** Khoảng cách phối cảnh 3D perspective px (Mặc định: 1000) */
  perspective?: number;
  /** Tỷ lệ phóng to khi hover (Mặc định: 1.04) */
  scale?: number;
  /** Độ cứng lò xo k trong phương trình vi phân (Mặc định: 0.08) */
  stiffness?: number;
  /** Hệ số cản dao động damping (Mặc định: 0.78) */
  damping?: number;
  /** Đảo ngược hướng nghiêng (Mặc định: false) */
  reverse?: boolean;
  /** Tự động dựng lớp phản quang specular Glare (Mặc định: false) */
  glare?: boolean;
  /** Độ mờ cực đại của Glare (Mặc định: 0.3) */
  glareMaxOpacity?: number;
  /** Trục nghiêng cho phép: 'x' | 'y' | 'both' (Mặc định: 'both') */
  axis?: 'x' | 'y' | 'both';
  /** Tôn trọng prefers-reduced-motion (Mặc định: true) */
  respectReducedMotion?: boolean;
  /** Bật/tắt hook (Mặc định: true) */
  enabled?: boolean;
  /** Callback bắn ra góc xoay tức thời */
  onTilt?: (data: { rotX: number; rotY: number; scale: number }) => void;
}

export interface ParallaxTiltReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  isHovered: boolean;
  /** Khôi phục thẻ về trạng thái phẳng ban đầu */
  reset: () => void;
  /** Điều khiển góc nghiêng và độ phóng to thủ công bằng mã */
  setValues: (values: { rotX?: number; rotY?: number; scale?: number } | number, rotY?: number) => void;
}

export function useParallaxTilt<T extends HTMLElement = HTMLElement>(
  options?: ParallaxTiltOptions
): ParallaxTiltReturn<T>;

// ============================================================================
// 4. WEB AUDIO HAPTICS TYPES
// ============================================================================
export interface HapticsOptions {
  /** Âm lượng mặc định 0.0 đến 1.0 (Mặc định: 1.0) */
  volume?: number;
  /** Khởi tạo ở trạng thái tắt tiếng (Mặc định: false) */
  muted?: boolean;
}

export type HapticSoundType = 'click' | 'pop' | 'chime' | 'switch' | 'toggle' | 'tab';

export interface HapticsReturn {
  playClick: () => void;
  playPop: () => void;
  playChime: () => void;
  playTabSwitch: () => void;
  playToggle: (state?: boolean) => void;
  isMuted: boolean;
  toggleMute: () => boolean;
  setMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  /** Tiện ích gán trực tiếp onClick cho phần tử JSX kèm callback mở rộng: <button {...bindHaptic('pop', handleClick)}> */
  bindHaptic: (
    sound?: HapticSoundType,
    userOnClick?: (e: ReactMouseEvent) => void
  ) => { onClick: (e: ReactMouseEvent) => void };
}

export declare class WebAudioHapticsCore {
  constructor(options?: HapticsOptions);
  subscribe(listener: () => void): () => void;
  notify(): void;
  getSnapshot(): string;
  getServerSnapshot(): string;
  getContext(): AudioContext | null;
  bindAutoUnlock(): void;
  setMuted(muted: boolean): void;
  getIsMuted(): boolean;
  toggleMute(): boolean;
  setVolume(volume: number): void;
  getVolume(): number;
  playClick(): void;
  playPop(): void;
  playChime(): void;
  playTabSwitch(): void;
  playToggle(state?: boolean): void;
}

export declare const hapticsStore: WebAudioHapticsCore;

export function useHaptics(options?: HapticsOptions): HapticsReturn;

// ============================================================================
// 5. MAGNETIC BUTTON TYPES (2-TIER DOM ARCHITECTURE)
// ============================================================================
export interface MagneticOptions {
  /** Hệ số hút nam châm pull factor (Mặc định: 0.32, khoảng hợp lý 0.15 -> 0.5) */
  pullFactor?: number;
  /** Độ dịch chuyển tối đa tính bằng px (Mặc định: 32) */
  maxDistance?: number;
  /** Bán kính nhận diện nam châm mở rộng px (Mặc định: 0 - chỉ trong biên thẻ) */
  proximityRadius?: number;
  /** Thời lượng hồi vị lò xo khi nhả chuột ms (Mặc định: 400) */
  returnDuration?: number;
  /** Đường cong lò xo đàn hồi CSS (Mặc định: cubic-bezier(0.22, 1.61, 0.36, 1)) */
  returnEasing?: string;
  /** Tôn trọng prefers-reduced-motion (Mặc định: true) */
  respectReducedMotion?: boolean;
  /** Bật/tắt hook (Mặc định: true) */
  enabled?: boolean;
  /** Callback cung cấp độ dịch chuyển tức thời */
  onPull?: (data: { dx: number; dy: number; distance: number; angle: number }) => void;
}

export interface MagneticReturn<
  T extends HTMLElement = HTMLElement,
  K extends HTMLElement = HTMLElement
> {
  /** Ref gắn vào tầng Anchor (vùng bắt sự kiện / tiệm cận) */
  ref: RefObject<T | null>;
  /** Alias cho ref tầng Anchor */
  anchorRef: RefObject<T | null>;
  /** Ref gắn vào tầng Target / Core (phần tử nhận biến --mag-x/--mag-y) */
  targetRef: RefObject<K | null>;
  /** Alias cho ref tầng Target / Core */
  coreRef: RefObject<K | null>;
  isHovered: boolean;
  isPressed: boolean;
  reset: () => void;
}

export function useMagnetic<
  T extends HTMLElement = HTMLElement,
  K extends HTMLElement = HTMLElement
>(options?: MagneticOptions): MagneticReturn<T, K>;

// ============================================================================
// 6. WOW ENGINE MASTER SUITE TYPES
// ============================================================================
export interface WowEngineConfig {
  spotlight?: boolean | SpotlightOptions;
  parallax?: boolean | ParallaxTiltOptions;
  haptics?: boolean | HapticsOptions;
  magnetic?: boolean | MagneticOptions;
  /** Tự động theo dõi các node con thêm mới qua MutationObserver (Mặc định: true) */
  observeMutations?: boolean;
}

export interface WowEngineReturn<T extends HTMLElement = HTMLElement> {
  containerRef: RefObject<T | null>;
  haptics: HapticsReturn;
  refresh: () => void;
  destroy: () => void;
}

export function useWowEngine<T extends HTMLElement = HTMLElement>(
  config?: WowEngineConfig
): WowEngineReturn<T>;

export function WowEngineProvider(props: {
  children: ReactNode;
  config?: WowEngineConfig;
}): ReactElement;

export function useGlobalHaptics(): HapticsReturn;

// ============================================================================
// 7. VANILLA ADAPTERS
// ============================================================================
export function initSpotlight(
  selector: string | HTMLElement | NodeList | HTMLElement[],
  options?: SpotlightOptions
): { destroy: () => void; update: () => void };

export function initParallaxTilt(
  selector: string | HTMLElement | NodeList | HTMLElement[],
  options?: ParallaxTiltOptions
): { destroy: () => void; reset: () => void; setValues: (vals: any, yVal?: number) => void };

declare const _default: {
  useWowEngine: typeof useWowEngine;
  useSpotlight: typeof useSpotlight;
  useParallaxTilt: typeof useParallaxTilt;
  useHaptics: typeof useHaptics;
  hapticsStore: WebAudioHapticsCore;
  useMagnetic: typeof useMagnetic;
  WowEngineProvider: typeof WowEngineProvider;
  useGlobalHaptics: typeof useGlobalHaptics;
  initSpotlight: typeof initSpotlight;
  initParallaxTilt: typeof initParallaxTilt;
};

export default _default;
