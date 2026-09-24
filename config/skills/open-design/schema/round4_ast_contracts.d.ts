/**
 * ⚡ ROUND 4 AST CONTRACTS — Antigravity 2.0 Open-Design & Generative Visual Studio
 * =================================================================================
 * Frozen Abstract Syntax Tree (AST) Schema & Interface Definitions for Round 4:
 * Visual Inspector State, Dynamic Hot-Insert Blocks, Multi-Target Token Export Bundles,
 * and Intelligent Battery / Frame Pacing Regulation.
 *
 * Core Guarantees:
 *  1. 100% Backward Compatibility with Round 3 AST Contracts, WowEngine v2.0 & PageAssembler.
 *  2. Luminous Light Theme Invariant (Multi-Layered Optical Surfaces & Shadows).
 *  3. WCAG AA Contrast Compliance & Prototype-Pollution Resistant Schema Design.
 *  4. Strict Type Safety with Zero Runtime Dependencies.
 *
 * @license Apache-2.0
 */

import type {
  LuminousThemeText,
  LuminousThemeAccent,
  LuminousThemeShadows,
  LuminousThemeContract,
  BentoCellType,
  BentoCellConfig,
  BentoGridConfig,
  HeroShaderType,
  HeroCTAButton,
  Hero3DConfig,
  ScrollySceneVisual,
  ScrollySceneConfig,
  ScrollyStageConfig,
  SoundboardWaveform,
  SoundboardConfig,
  NavigationLink,
  NavigationConfig,
  FooterConfig,
  PageMetadata,
  CustomSectionConfig,
  PageAssemblySchema,
  AssembledDOMInstance,
  PageAssemblerEngine,
} from './round3_ast_contracts.js';

// Re-export Round 3 Contracts for complete backward compatibility
export type {
  LuminousThemeText,
  LuminousThemeAccent,
  LuminousThemeShadows,
  LuminousThemeContract,
  BentoCellType,
  BentoCellConfig,
  BentoGridConfig,
  HeroShaderType,
  HeroCTAButton,
  Hero3DConfig,
  ScrollySceneVisual,
  ScrollySceneConfig,
  ScrollyStageConfig,
  SoundboardWaveform,
  SoundboardConfig,
  NavigationLink,
  NavigationConfig,
  FooterConfig,
  PageMetadata,
  CustomSectionConfig,
  PageAssemblySchema,
  AssembledDOMInstance,
  PageAssemblerEngine,
};

// =============================================================================
// 1. VISUAL INSPECTOR STATE CONTRACT (Khế ước Trạng thái Bộ Tinh chỉnh Trực quan)
// =============================================================================

export type VisualInspectorTab =
  | 'surfaces'
  | 'physics'
  | 'audio'
  | 'export'
  | 'blocks'
  | 'battery'
  | (string & {});

export interface InspectorSurfaceControls {
  /** Base canvas background color token (e.g. '#FAF9F6', '#FDFBF7') */
  canvas: string;
  /** Primary resting surface color (e.g. '#FFFFFF', '#FAFAFA') */
  surface: string;
  /** Elevated card / panel surface color (e.g. '#FFFFFF') */
  elevated: string;
  /** Subtle optical border color (e.g. 'rgba(0, 0, 0, 0.06)') */
  border: string;
  /** Crystalline inset highlight border (e.g. 'rgba(255, 255, 255, 0.9)') */
  highlight: string;
  /** Optical border stroke width (e.g. '1px' or 1) */
  borderWidth?: string | number;
  /** Outer card border radius (e.g. '16px' or 16) */
  borderRadius?: string | number;
  /** Glass HUD frosted backdrop filter blur in pixels (e.g. 12) */
  glassBlur?: number;
  /** Glass surface background opacity ratio (0.0 to 1.0, e.g. 0.85) */
  glassOpacity?: number;
  /** Multi-dimensional layered shadow elevation preset */
  shadowPreset?: 'none' | 'sm' | 'md' | 'lg' | 'layered' | 'custom';
  /** Directional key light shadow intensity factor (0.0 to 1.0) */
  shadowKeyIntensity?: number;
  /** Soft ambient occlusion shadow intensity factor (0.0 to 1.0) */
  shadowAmbientIntensity?: number;
  /** High contrast primary text color (WCAG AA compliant, e.g. '#0f172a') */
  textPrimary?: string;
  /** Secondary subtitle / label text color (e.g. '#475569') */
  textSecondary?: string;
  /** Muted text color for timestamps and subtle meta (e.g. '#94a3b8') */
  textMuted?: string;
  /** Primary brand accent color (e.g. '#2563eb', '#0284c7') */
  accentPrimary?: string;
  /** Accent hover interactive state color */
  accentHover?: string;
  /** Specular accent glow focus ring color with alpha */
  accentGlow?: string;
  /** Custom CSS variable overrides dictionary */
  customVariables?: Record<string, string>;
}

export interface InspectorPhysicsControls {
  /** Maximum 3D card parallax tilt angle in degrees (e.g. 15) */
  maxTilt: number;
  /** Perspective projection depth in pixels (e.g. 1000) */
  perspective: number;
  /** Elastic scale factor on cursor hover (e.g. 1.05) */
  scale: number;
  /** Damped spring stiffness constant (e.g. 150) */
  stiffness: number;
  /** Damped spring damping constant (e.g. 18) */
  damping: number;
  /** Whether specular glare reflection overlay is enabled */
  glare: boolean;
  /** Maximum opacity ceiling of specular glare reflection (0.0 to 1.0, e.g. 0.25) */
  glareMaxOpacity: number;
  /** Active tilt rotation constraint axes */
  axis: 'x' | 'y' | 'both';
  /** Radial cursor spotlight tracking radius in pixels (e.g. 380) */
  spotlightRadius: number;
  /** Additional proximity detection threshold outside bounding box in pixels (e.g. 40) */
  spotlightProximity: number;
  /** Spotlight peak opacity ratio (0.0 to 1.0, e.g. 0.15) */
  spotlightOpacity: number;
  /** Spring physics preset profile */
  springPreset?: 'gentle' | 'snappy' | 'bouncy' | 'stiff' | 'custom';
  /** Inertial smooth scroll configuration */
  smoothScroll?: {
    enabled?: boolean;
    lerp?: number;
    wheelMultiplier?: number;
  };
}

export interface InspectorAudioControls {
  /** Master audio enable toggle */
  enabled: boolean;
  /** Master mute state */
  muted: boolean;
  /** Master volume gain (0.0 to 1.0, default: 0.15 for subtle haptics) */
  masterVolume: number;
  /** Synthesizer oscillator waveforms */
  waveforms: SoundboardWaveform | SoundboardWaveform[];
  /** Binaural stereo panning based on cursor / element screen X coordinate */
  spatialPanning: boolean;
  /** Mechanical rotary dial stepped click feedback sound */
  rotaryTicks: boolean;
  /** Dual-phase tactile mechanical switch feedback sound */
  mechanicalSwitch: boolean;
  /** Granular toggle map for specific sound synthesizers */
  activeHaptics?: {
    click?: boolean;
    pop?: boolean;
    chime?: boolean;
    tabSwitch?: boolean;
    rotaryStep?: boolean;
    mechanicalSwitch?: boolean;
    successChord?: boolean;
    dullThud?: boolean;
  };
}

export interface VisualInspectorExportOptions {
  /** Export target format */
  format: 'tailwind' | 'css' | 'dtcg' | 'typescript' | 'all' | 'standalone-html';
  /** Minify generated code */
  minify: boolean;
  /** Include WowEngine runtime script in standalone exports */
  includeWowEngine: boolean;
  /** Include TypeScript interface declarations in export */
  includeTypeScriptDefinitions: boolean;
  /** Prefix for CSS Custom Properties (e.g. 'od-' or 'luminous-') */
  prefix?: string;
  /** Options for standalone HTML5 bundle compilation */
  standaloneHtmlOptions?: {
    inlineScripts?: boolean;
    inlineStyles?: boolean;
    targetPlatform?: 'web' | 'iframe' | 'webview';
  };
}

export interface VisualInspectorTarget {
  /** DOM element ID currently selected in inspector */
  elementId?: string | null;
  /** AST schema block ID currently selected */
  blockId?: string | null;
  /** AST schema block archetype type */
  blockType?: string | null;
  /** CSS selector string resolving to target */
  selector?: string | null;
}

export interface VisualInspectorHistory {
  /** Whether an undo action is available */
  canUndo: boolean;
  /** Whether a redo action is available */
  canRedo: boolean;
  /** Total number of undo states available */
  undoCount: number;
  /** Total number of redo states available */
  redoCount: number;
}

export interface VisualInspectorState {
  /** Currently active tab category */
  activeTab: VisualInspectorTab;
  /** Surface optical and color token controls */
  surfaceControls: InspectorSurfaceControls;
  /** Spring physics, spotlight, and motion controls */
  physicsControls: InspectorPhysicsControls;
  /** WebAudio tactile haptic controls */
  audioControls: InspectorAudioControls;
  /** Export bundle and compilation options */
  exportOptions: VisualInspectorExportOptions;
  /** Visibility status of inspector panel */
  isOpen: boolean;
  /** Docking anchor position of the inspector panel */
  dockPosition?: 'left' | 'right' | 'bottom' | 'floating';
  /** Target element or block currently selected for live tuning */
  selectedTarget?: VisualInspectorTarget;
  /** Whether active tokens have unsaved changes */
  isDirty?: boolean;
  /** State undo / redo history tracking */
  history?: VisualInspectorHistory;
}

// =============================================================================
// 2. HOT-INSERT PAYLOAD CONTRACT (Khế ước Khối Giao diện Cắm Nóng Động)
// =============================================================================

export type HotInsertBlockType =
  | 'bento-cell'
  | 'hero-3d'
  | 'scrolly-stage'
  | 'navigation'
  | 'footer'
  | 'custom-section'
  | 'soundboard-dock'
  | 'stat-card'
  | 'feature-grid'
  | BentoCellType
  | (string & {});

export type HotInsertContainer =
  | 'bentoGrid'
  | 'customSections'
  | 'scrollyScenes'
  | 'navigation'
  | 'footer'
  | (string & {});

export type HotInsertEntranceAnimation =
  | 'fade-up'
  | 'scale-in'
  | 'slide-in-right'
  | 'elastic-pop'
  | 'none';

export interface HotInsertMetadata {
  /** Author or generator identity (e.g. 'AI Showrunner', 'User Prompt') */
  author?: string;
  /** Version tag of the inserted block template */
  version?: string;
  /** Name of the originating plugin or skill */
  sourcePlugin?: string;
  /** Semantic search tags */
  tags?: string[];
}

export interface HotInsertPayload {
  /** Globally unique block instance identifier (e.g. 'hot-block-telemetry-01') */
  blockId: string;
  /** Archetype categorization of the component block */
  blockType: HotInsertBlockType;
  /** 0-indexed placement order within the target container */
  placementIndex: number;
  /** Concrete schema properties and attributes for the component */
  props: Record<string, unknown>;
  /** Optional scoped Luminous theme overrides applied solely to this block */
  themeOverrides?: Partial<LuminousThemeContract>;
  /** Target structural container inside the page schema */
  targetContainer?: HotInsertContainer;
  /** Micro-interaction entrance animation triggered on mount */
  animationEntrance?: HotInsertEntranceAnimation;
  /** Automatically scroll to and highlight block upon successful insertion */
  autoFocus?: boolean;
  /** Unix timestamp in milliseconds when the payload was created */
  timestamp?: number;
  /** Supporting audit metadata */
  metadata?: HotInsertMetadata;
}

// =============================================================================
// 3. TOKEN EXPORT BUNDLE CONTRACT (Khế ước Gói Xuất bản Token Đa Nền tảng)
// =============================================================================

export interface TailwindConfigExport {
  /** Structured Tailwind theme extend configuration object */
  theme: {
    extend: {
      colors: Record<string, any>;
      boxShadow: Record<string, string>;
      borderRadius: Record<string, string>;
      backdropBlur?: Record<string, string>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  /** Pre-formatted string ready to write to tailwind.config.ts / .js */
  rawString: string;
}

export interface CssVariablesExport {
  /** Flat map of CSS Custom Property keys and sanitized values */
  rootVariables: Record<string, string>;
  /** Complete, sanitized CSS stylesheet string wrapped in :root { ... } */
  rawCss: string;
}

/**
 * W3C Design Tokens Community Group (DTCG) specification token node
 */
export interface DtcgTokenNode {
  /** Value of the design token */
  $value: string | number | Record<string, unknown>;
  /** Semantic type of the token conforming to DTCG specs */
  $type:
    | 'color'
    | 'dimension'
    | 'shadow'
    | 'fontFamily'
    | 'fontWeight'
    | 'duration'
    | 'cubicBezier'
    | 'number'
    | (string & {});
  /** Human-readable explanation of token intent */
  $description?: string;
  /** Vendor or tool-specific extensions */
  $extensions?: Record<string, unknown>;
  /** Nested sub-tokens */
  [key: string]: unknown;
}

export interface DtcgJsonExport {
  /** Hierarchical DTCG design token tree */
  tokens: Record<string, DtcgTokenNode>;
  /** Formatted JSON string ready to export to tokens.json */
  rawJson: string;
}

export interface TypeScriptTokensExport {
  /** Plain JavaScript object containing token primitives */
  tokens: Record<string, unknown>;
  /** Fully typed TypeScript source code with 'as const' assertions and type helpers */
  rawTypeScript: string;
}

export interface TokenExportBundle {
  /** Tailwind CSS v3/v4 configuration export */
  tailwindConfig: TailwindConfigExport;
  /** W3C Standard CSS Custom Properties export */
  cssVariables: CssVariablesExport;
  /** W3C Design Tokens Community Group (DTCG) standard JSON export */
  dtcgJson: DtcgJsonExport;
  /** Strict Type-Safe TypeScript constants and types export */
  typescriptTokens: TypeScriptTokensExport;
  /** ISO-8601 generation timestamp */
  exportedAt: string;
  /** Export bundle version string */
  version: string;
  /** Optional SHA-256 integrity checksum of token payload */
  checksum?: string;
}

// =============================================================================
// 4. BATTERY GUARD CONFIG CONTRACT (Khế ước Điều tiết Năng lượng & Nhịp Khung Hình)
// =============================================================================

export interface BatteryGuardStatus {
  /** Current battery level ratio (0.0 to 1.0, or -1 if Battery API unavailable) */
  batteryLevel: number;
  /** Whether the host device is connected to AC power / charging */
  isCharging: boolean;
  /** Whether the system is currently operating in Low Power Mode */
  isLowPower: boolean;
  /** Whether the host browser tab is currently hidden / backgrounded */
  isBackgrounded: boolean;
  /** Whether the engine has entered auto-sleep hibernation due to inactivity */
  isSleeping: boolean;
  /** Current effective runtime FPS limit */
  currentEffectiveFps: number;
  /** Timestamp of last detected user interaction in milliseconds */
  lastActiveTimestamp: number;
}

export interface BatteryGuardConfig {
  /**
   * Battery level percentage or ratio threshold triggering Low Power Mode.
   * Values <= 1.0 are treated as ratios (e.g. 0.20 = 20%); values > 1.0 are treated as percentages (e.g. 20 = 20%).
   */
  batteryThreshold: number;
  /** Maximum FPS ceiling when browser tab is blurred or hidden in background (e.g. 15) */
  backgroundFpsThrottle: number;
  /** User inactivity timeout in milliseconds before pausing WebGL and spring loops (e.g. 30000) */
  autoSleepDelayMs: number;
  /** Master enable switch for dynamic battery and frame pacing */
  enabled: boolean;
  /** Explicit manual override flag forcing Low Power Mode */
  lowPowerModeActive?: boolean;
  /** Automatically disables heavy GPU shaders, WebGL particles, and tilt glare on low battery */
  disableHeavyEffectsOnLowBattery: boolean;
  /** Automatically enables prefers-reduced-motion fallback when operating under low power */
  reduceMotionFallback: boolean;
  /** Target foreground frame rate ceiling under normal AC power (default: 60) */
  targetForegroundFps?: number;
  /** List of browser DOM event names that wake the engine from auto-sleep hibernation */
  autoWakeOnEvents?: Array<'pointermove' | 'scroll' | 'keydown' | 'touchstart'>;
}

export interface BatteryGuardController {
  /** Starts battery event listeners and visibility change watchers */
  init: () => void;
  /** Disconnects all listeners and restores unthrottled frame loop */
  destroy: () => void;
  /** Reads current live battery and pacing telemetry status */
  getStatus: () => BatteryGuardStatus;
  /** Dynamically updates energy guard configuration */
  updateConfig: (newConfig: Partial<BatteryGuardConfig>) => void;
  /** Paced requestAnimationFrame replacement respecting battery and sleep states */
  requestFrame: (callback: (timestamp: number) => void) => number;
  /** Cancels a scheduled paced frame */
  cancelFrame: (id: number) => void;
  /** Manually signals user activity to prevent or wake from auto-sleep */
  notifyUserActivity: () => void;
}

// =============================================================================
// 5. EXTENDED V4 PAGE ASSEMBLY & RUNTIME CONTRACTS (Khế ước Mở rộng V4)
// =============================================================================

export interface PageAssemblySchemaV4 extends PageAssemblySchema {
  /** Dynamic battery & energy throttling config */
  batteryGuard?: BatteryGuardConfig;
  /** Visual studio & inspector state */
  inspectorState?: VisualInspectorState;
  /** Dynamic hot-inserted blocks registry */
  hotInsertRegistry?: HotInsertPayload[];
  /** Exported design token bundle */
  tokenBundle?: TokenExportBundle;
}

export interface AssembledDOMInstanceV4 extends AssembledDOMInstance {
  /** Deep-frozen copy of the normalized V4 schema */
  schema: Readonly<PageAssemblySchemaV4>;
  /** Dynamically hot-inserts a new block into the live page */
  hotInsert: (payload: HotInsertPayload) => boolean;
  /** Removes a hot-inserted or existing block by blockId */
  hotRemove: (blockId: string) => boolean;
  /** Updates props or theme of a block dynamically */
  hotUpdate: (
    blockId: string,
    updatedProps: Record<string, unknown>,
    themeOverrides?: Partial<LuminousThemeContract>
  ) => boolean;
  /** Retrieves current battery guard status */
  getBatteryGuardStatus: () => BatteryGuardStatus;
  /** Updates battery guard config dynamically */
  setBatteryGuardConfig: (config: Partial<BatteryGuardConfig>) => void;
  /** Retrieves current visual inspector state */
  getInspectorState: () => VisualInspectorState;
  /** Updates visual inspector state dynamically */
  setInspectorState: (state: Partial<VisualInspectorState>) => void;
  /** Exports current active design token bundle */
  exportTokenBundle: (options?: Partial<VisualInspectorExportOptions>) => TokenExportBundle;
}

export interface PageAssemblerEngineV4 extends PageAssemblerEngine {
  /** Assemble V4 schema into active browser DOM with hot insertion & battery guard */
  assembleToDomV4: (
    schema: PageAssemblySchemaV4,
    containerElement?: HTMLElement | null
  ) => AssembledDOMInstanceV4;

  /** Hot-insert block into assembled DOM instance */
  hotInsertBlock: (
    instance: AssembledDOMInstanceV4,
    payload: HotInsertPayload
  ) => boolean;

  /** Compile token bundle across Tailwind, CSS, DTCG and TS */
  exportTokenBundle: (
    schema: PageAssemblySchema | LuminousThemeContract,
    options?: Partial<VisualInspectorExportOptions>
  ) => TokenExportBundle;

  /** Factory for battery guard energy pacing controller */
  createBatteryGuard: (
    config?: Partial<BatteryGuardConfig>
  ) => BatteryGuardController;
}
