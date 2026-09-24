/**
 * ⚡ ROUND 3 AST CONTRACTS — Antigravity 2.0 Open-Design
 * =======================================================
 * Frozen Abstract Syntax Tree (AST) Schema & Interface Definitions
 * for Luminous Light Theme Pages, Bento Grids, 3D Hero Shaders,
 * Scrollytelling Stages, and Tactile Soundboards.
 *
 * All interfaces adhere strictly to:
 * - Luminous Light Theme Invariant (Multi-Layered Luminous Surfaces)
 * - Safe DOM Assembly & Type Safety Contracts
 * - WCAG AA Contrast Compliance
 *
 * @license Apache-2.0
 */

// =============================================================================
// 1. LUMINOUS THEME CONTRACT (Khế ước Giao diện Sáng Đa Tầng Luminous)
// =============================================================================

export interface LuminousThemeText {
  /** Primary text color, high contrast WCAG AA (e.g. '#0f172a', '#1e293b') */
  primary: string;
  /** Secondary text color for subtitles and labels (e.g. '#475569', '#64748b') */
  secondary: string;
  /** Muted text color for timestamps and subtle meta (e.g. '#94a3b8') */
  muted: string;
}

export interface LuminousThemeAccent {
  /** Primary accent color (e.g. '#2563eb', '#0284c7', '#059669') */
  primary: string;
  /** Hover state accent color */
  hover?: string;
  /** Specular glow / focus ring color with alpha (e.g. 'rgba(37, 99, 235, 0.25)') */
  glow?: string;
}

export interface LuminousThemeShadows {
  /** Subtle ambient shadow for resting elements */
  sm?: string;
  /** Medium shadow for cards and floating elements */
  md?: string;
  /** Deep elevation shadow for dialogs, HUD nav, and modal overlays */
  lg?: string;
  /** Soft ambient glow */
  ambient?: string;
  /** Directional key light shadow */
  key?: string;
}

export interface LuminousThemeContract {
  /** Base canvas background (e.g. Warm Paper '#FAF9F6', Ivory '#FDFBF7', Alabaster '#F8F9FA') */
  canvas: string;
  /** Primary surface color for resting cards and panels (e.g. '#FFFFFF', '#FAFAFA') */
  surface: string;
  /** Elevated card surface for floating cards, popovers, and HUD elements */
  elevated: string;
  /** Subtle optical border color (e.g. 'rgba(0, 0, 0, 0.06)', 'rgba(15, 23, 42, 0.08)') */
  border: string;
  /** Inset highlight border for crystalline optical depth (e.g. 'rgba(255, 255, 255, 0.9)') */
  highlight: string;
  /** High contrast typography color tokens */
  text: LuminousThemeText;
  /** Vibrant brand accent colors */
  accent: LuminousThemeAccent;
  /** Multi-dimensional layered shadows eliminating flat monolithic paper */
  shadows: LuminousThemeShadows;
  /** Optional custom CSS token overrides (token name -> sanitized CSS value) */
  customTokens?: Record<string, string>;
}

// =============================================================================
// 2. BENTO GRID CONFIG (Cấu hình Lưới Bento Đa Chiều)
// =============================================================================

export type BentoCellType = 'stat' | 'feature' | 'graphic' | 'telemetry' | 'quote' | 'custom';

export interface BentoCellConfig {
  /** Unique identifier for the bento cell */
  id: string;
  /** Number of grid columns to span (1 to 12, default: 4) */
  colSpan?: number;
  /** Number of grid rows to span (default: 1) */
  rowSpan?: number;
  /** Optional specific column start index */
  colStart?: number;
  /** Optional specific row start index */
  rowStart?: number;
  /** Cell title / headline */
  title?: string;
  /** Subtitle or explanatory text */
  subtitle?: string;
  /** Chip / status badge text */
  badge?: string;
  /** Main body or feature description */
  content?: string;
  /** Category or display archetype */
  type?: BentoCellType;
  /** Primary metric value for stat cells (e.g. '99.99%', '60 FPS', '128K') */
  statValue?: string;
  /** Label describing the stat value (e.g. 'System Uptime', 'Render Budget') */
  statLabel?: string;
  /** Optional icon identifier or SVG glyph name */
  icon?: string;
  /** Whether the card responds to cursor movement and tactile clicks */
  interactive?: boolean;
  /** Enables dynamic radial cursor spotlight tracking */
  spotlight?: boolean;
  /** Enables 3D spring-physics parallax tilt */
  tilt?: boolean;
  /** Enables tactile WebAudio sound effects on hover and click */
  haptic?: boolean;
  /** Custom CSS classes for container */
  className?: string;
}

export interface BentoGridConfig {
  /** Total number of columns in the grid layout (typically 12 for responsive layouts) */
  columns: number;
  /** Explicit number of rows (optional, defaults to auto-flowing rows) */
  rows?: number;
  /** Array of cell descriptors forming the bento matrix */
  cellMatrix: BentoCellConfig[];
  /** Grid auto-placement density: 'normal' or 'dense' */
  autoDensity?: boolean | 'dense' | 'normal';
  /** Grid gap between cells (e.g. '1.5rem', '24px') */
  gap?: string | number;
  /** Section title displayed above bento grid */
  title?: string;
  /** Section subtitle / description */
  subtitle?: string;
  /** Section badge / pill */
  badge?: string;
}

// =============================================================================
// 3. HERO 3D CONFIG (Cấu hình Khối Hero WebGL 3D Tương tác)
// =============================================================================

export type HeroShaderType =
  | 'liquid-waves'
  | 'particle-mesh'
  | 'titanium-grid'
  | 'fluid'
  | 'simplex-noise'
  | 'none';

export interface HeroCTAButton {
  /** Button label text */
  text: string;
  /** Target URL / Anchor link */
  link?: string;
  /** Whether button renders with elevated accent style */
  primary?: boolean;
  /** Optional leading icon name */
  icon?: string;
  /** Triggers WebAudio haptic tactile feedback */
  haptic?: boolean;
}

export interface Hero3DConfig {
  /** Interactive shader effect or background simulation mode */
  shaderType: HeroShaderType;
  /** Total number of active particles or grid nodes (capped for 60 FPS budget) */
  particleCount: number;
  /** Cursor interaction attraction / repulsion radius in pixels */
  interactiveRadius: number;
  /** Maximum Device Pixel Ratio ceiling (e.g. 2.0 to protect GPU thermals) */
  dprCap: number;
  /** Primary hero headline text */
  headline: string;
  /** Supporting subtitle paragraph */
  subheadline?: string;
  /** Pill badges displayed above the headline */
  badges?: string[];
  /** Primary and secondary Call-To-Action buttons */
  ctaButtons?: HeroCTAButton[];
  /** Base shader primary RGB tint [r, g, b] (0-255 or hex string) */
  baseColor?: [number, number, number] | string;
  /** Animation speed multiplier (default: 1.0) */
  speed?: number;
  /** Whether to render live status indicator badge */
  showLiveBadge?: boolean;
  /** Hero section min-height (e.g. '85vh', '600px') */
  minHeight?: string;
}

// =============================================================================
// 4. SCROLLY STAGE CONFIG (Cấu hình Sân khấu Cuộn Scrollytelling Pinned Stage)
// =============================================================================

export interface ScrollySceneVisual {
  /** Archetype of visual asset */
  type?: 'code' | 'diagram' | 'metric' | 'image' | 'video' | 'custom';
  /** Descriptive caption */
  caption?: string;
  /** Raw textual content or diagram specification */
  content?: string;
  /** Safe URL for image or media asset */
  url?: string;
}

export interface ScrollySceneConfig {
  /** Unique scene identifier */
  id: string;
  /** Scene headline / chapter title */
  title: string;
  /** Chapter narrative description */
  description?: string;
  /** Pill badge or chapter step number (e.g. 'Step 01 / 04') */
  badge?: string;
  /** Highlighted metric indicator */
  metric?: {
    label: string;
    value: string;
  };
  /** Visual stage content displayed alongside narrative */
  visualAsset?: ScrollySceneVisual | string;
}

export interface ScrollyStageConfig {
  /** Array of sequentially pinned scenes */
  scenes: ScrollySceneConfig[];
  /** Pinned viewport duration in viewport height units (e.g. 250vh) */
  pinnedDurationVh: number;
  /** Scroll scrub transition curve (e.g. 'ease-out', 'cubic-bezier(0.22, 1, 0.36, 1)') */
  transitionCurve: 'linear' | 'ease-out' | 'cubic-bezier' | string;
  /** Section headline */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Displays sticky progress track & active scene dot indicator */
  showProgressIndicator?: boolean;
}

// =============================================================================
// 5. SOUNDBOARD CONFIG (Cấu hình Bàn Âm thanh WebAudio Haptic Soundboard)
// =============================================================================

export type SoundboardWaveform = 'sine' | 'triangle' | 'square' | 'sawtooth';

export interface SoundboardConfig {
  /** Synthesizer oscillator waveforms */
  waveforms: SoundboardWaveform | SoundboardWaveform[];
  /** Enables mechanical rotary dial stepped click sounds */
  rotaryTicks: boolean;
  /** Enables dual-phase tactile mechanical switch sounds */
  mechanicalSwitch: boolean;
  /** Enables binaural stereo panning based on cursor / element screen X coordinate */
  spatialPanning: boolean;
  /** Master volume gain (0.0 to 1.0, default: 0.15 for subtle haptics) */
  volume?: number;
  /** Master mute state */
  muted?: boolean;
  /** Whether the soundboard module is active */
  enabled?: boolean;
}

// =============================================================================
// 6. NAVIGATION & FOOTER CONFIG (Cấu hình Thanh Điều Hướng & Chân Trang)
// =============================================================================

export interface NavigationLink {
  /** Navigation item label */
  label: string;
  /** Destination anchor or URL */
  href: string;
  /** Link target (e.g. '_blank', '_self') */
  target?: string;
}

export interface NavigationConfig {
  /** Brand or product name */
  brandName: string;
  /** Optional brand logo URL */
  logoUrl?: string;
  /** Small brand tagline or version badge */
  tagline?: string;
  /** Navigation links */
  links: NavigationLink[];
  /** Primary navigation CTA button */
  ctaButton?: {
    text: string;
    link: string;
    haptic?: boolean;
  };
  /** Applies Glass HUD frosted backdrop filter blur */
  glassHud?: boolean;
}

export interface FooterConfig {
  /** Copyright attribution text */
  copyright: string;
  /** Brand mission or footer tagline */
  tagline?: string;
  /** Footer secondary links */
  links?: Array<{ label: string; href: string }>;
  /** Trust badges or tech stack tags */
  badges?: string[];
}

// =============================================================================
// 7. PAGE METADATA & ASSEMBLY SCHEMA (Khế ước Toàn diện Lắp ghép Trang)
// =============================================================================

export interface PageMetadata {
  /** HTML document title */
  title: string;
  /** SEO meta description */
  description?: string;
  /** HTML language attribute (default: 'en') */
  lang?: string;
  /** Document character encoding (default: 'UTF-8') */
  charset?: string;
  /** Author name / organization */
  author?: string;
  /** SEO keywords */
  keywords?: string[];
  /** OpenGraph / Social preview image URL */
  ogImage?: string;
}

export interface CustomSectionConfig {
  /** Unique section ID */
  id: string;
  /** Section title */
  title?: string;
  /** Safe text or escaped HTML content */
  content?: string;
}

export interface PageAssemblySchema {
  /** Document header metadata */
  metadata: PageMetadata;
  /** Luminous Light Theme color and surface token contract */
  theme: LuminousThemeContract;
  /** Navigation header config */
  navigation?: NavigationConfig;
  /** 3D Interactive Hero section config */
  hero?: Hero3DConfig;
  /** High-density Bento telemetry / feature grid */
  bentoGrid?: BentoGridConfig;
  /** Pinned narrative scrollytelling stage */
  scrollytelling?: ScrollyStageConfig;
  /** Tactile WebAudio soundboard and spatial feedback config */
  soundboard?: SoundboardConfig;
  /** Document footer */
  footer?: FooterConfig;
  /** Optional custom sections */
  customSections?: CustomSectionConfig[];
}

// =============================================================================
// 8. COMPILED RUNTIME CONTRACTS (Khế ước Môi trường Thực thi Biên dịch)
// =============================================================================

export interface AssembledDOMInstance {
  /** Root container element containing the assembled page */
  container: HTMLElement;
  /** Deep-frozen copy of the normalized schema used during assembly */
  schema: Readonly<PageAssemblySchema>;
  /** Safely updates active theme tokens without rebuilding DOM */
  updateTheme: (newTheme: Partial<LuminousThemeContract>) => void;
  /** Cleans up all attached event listeners, WebGL canvases, and audio contexts */
  destroy: () => void;
}

export interface PageAssemblerEngine {
  /** Assemble schema into active browser DOM */
  assembleToDom(
    schema: PageAssemblySchema,
    containerElement?: HTMLElement | null
  ): AssembledDOMInstance;

  /** Compile schema into a single self-contained standalone HTML5 string */
  exportToStandaloneHtml(schema: PageAssemblySchema): string;

  /** Prototype pollution safe deep merge */
  safeDeepMerge<T extends Record<string, any>>(target: T, ...sources: Array<Partial<T> | Record<string, any>>): T;

  /** CSS injection safe value validator */
  sanitizeCssValue(value: unknown, fallback?: string): string;

  /** Strict HTML entity escaper */
  escapeHtml(rawText: unknown): string;

  /** Safe URL protocol validator */
  sanitizeUrl(rawUrl: unknown, fallback?: string): string;
}
