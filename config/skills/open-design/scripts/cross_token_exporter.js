/**
 * ⚡ CROSS-FRAMEWORK TOKEN EXPORTER — Antigravity 2.0 Open-Design
 * ==============================================================
 * Multi-Target Design Token Export Engine for TokenContractAST,
 * LuminousThemeContract, and PageAssemblySchema.
 *
 * Core Capabilities:
 *  1. exportTailwindV3(): Generates tailwind.config.js with complete theme.extend
 *     (colors, boxShadow, blur, borderRadius, animation, keyframes) with clean regex prefix key sanitization.
 *  2. exportTailwindV4(): Generates modern CSS @theme blocks conforming to Tailwind v4,
 *     mapping standard prefixes (--color-*, --shadow-*, --radius-*, --spacing-*, --font-*, --ease-*, --animate-*)
 *     and preserving aliasTo / var(--...) inheritance.
 *  3. exportCssVariables(): Generates visually grouped :root CSS stylesheets
 *     (Surfaces, Foregrounds, Borders, Accents, Semantics, Typography, Spacing, Elevation, Motion)
 *     conforming to design-systems/agentic/tokens.css.
 *  4. exportW3CDtcgJson(): Generates W3C Design Tokens Community Group (DTCG) standard JSON
 *     with $value and $type, integrating an Inverse Token Map to accurately resolve valid pointers {color.surface}.
 *  5. exportTypeScriptDeclarations(): Generates type-safe .d.ts definitions with union types
 *     DesignTokenCssVariable, DesignTokenId, and ColorTokenVariable.
 *  6. Seamless integration with LuminousThemeContract (Round 3) and PageAssemblySchema (Round 3/4).
 *
 * Zero runtime dependencies (0 KB runtime assets).
 * SSR-safe: 100% compatible with Node.js, Vite, Next.js, and browser script tags.
 *
 * Author: Antigravity 2.0 Open Design System
 * License: Apache-2.0
 */

import { createHash } from 'node:crypto';

// Browser environment check
export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Standard Token Schema definitions matching Antigravity 2.0 and open-design contracts.
 */
export const STANDARD_TOKEN_SCHEMA = Object.freeze([
  // ─── Surfaces ────────────────────────────────────────────────────────
  {
    name: '--bg',
    category: 'surfaces',
    type: 'color',
    layer: 'A1-identity',
    description: 'Page background — defines the brand canvas.',
    fallback: '#faf9f6',
    dtcgPath: 'color.bg',
    v4Prefix: '--color-bg',
  },
  {
    name: '--surface',
    category: 'surfaces',
    type: 'color',
    layer: 'A1-identity',
    description: 'Card / lifted container background.',
    fallback: '#ffffff',
    dtcgPath: 'color.surface',
    v4Prefix: '--color-surface',
  },
  {
    name: '--surface-warm',
    category: 'surfaces',
    type: 'color',
    layer: 'B-slot',
    description: 'Tertiary surface tier.',
    aliasTo: 'var(--surface)',
    dtcgPath: 'color.surfaceWarm',
    v4Prefix: '--color-surface-warm',
  },
  {
    name: '--canvas',
    category: 'surfaces',
    type: 'color',
    layer: 'A1-identity',
    description: 'Base canvas background (Luminous Light Theme).',
    fallback: '#faf9f6',
    dtcgPath: 'color.canvas',
    v4Prefix: '--color-canvas',
  },
  {
    name: '--elevated',
    category: 'surfaces',
    type: 'color',
    layer: 'A1-identity',
    description: 'Elevated card surface for floating cards and HUDs.',
    fallback: '#ffffff',
    dtcgPath: 'color.elevated',
    v4Prefix: '--color-elevated',
  },
  {
    name: '--sub-surface',
    category: 'surfaces',
    type: 'color',
    layer: 'A2',
    description: 'Sub-surface tier for subtle contrasting blocks.',
    fallback: '#f4f4f0',
    dtcgPath: 'color.subSurface',
    v4Prefix: '--color-sub-surface',
  },

  // ─── Foregrounds ─────────────────────────────────────────────────────
  {
    name: '--fg',
    category: 'foregrounds',
    type: 'color',
    layer: 'A1-identity',
    description: 'Primary text color.',
    fallback: '#0f172a',
    dtcgPath: 'color.fg',
    v4Prefix: '--color-fg',
  },
  {
    name: '--fg-2',
    category: 'foregrounds',
    type: 'color',
    layer: 'B-slot',
    description: 'Secondary text tier.',
    aliasTo: 'var(--fg)',
    dtcgPath: 'color.fg2',
    v4Prefix: '--color-fg-2',
  },
  {
    name: '--muted',
    category: 'foregrounds',
    type: 'color',
    layer: 'A1-identity',
    description: 'Subtext / captions.',
    fallback: '#64748b',
    dtcgPath: 'color.muted',
    v4Prefix: '--color-muted',
  },
  {
    name: '--meta',
    category: 'foregrounds',
    type: 'color',
    layer: 'B-slot',
    description: 'Tertiary FG / metadata tier.',
    aliasTo: 'var(--muted)',
    dtcgPath: 'color.meta',
    v4Prefix: '--color-meta',
  },
  {
    name: '--text-primary',
    category: 'foregrounds',
    type: 'color',
    layer: 'A1-identity',
    description: 'High contrast primary text color (WCAG AA).',
    fallback: '#0f172a',
    dtcgPath: 'color.textPrimary',
    v4Prefix: '--color-text-primary',
  },
  {
    name: '--text-secondary',
    category: 'foregrounds',
    type: 'color',
    layer: 'A1-identity',
    description: 'Secondary text color for labels and subtitles.',
    fallback: '#475569',
    dtcgPath: 'color.textSecondary',
    v4Prefix: '--color-text-secondary',
  },
  {
    name: '--text-muted',
    category: 'foregrounds',
    type: 'color',
    layer: 'A1-identity',
    description: 'Muted text color for timestamps and subtle meta.',
    fallback: '#94a3b8',
    dtcgPath: 'color.textMuted',
    v4Prefix: '--color-text-muted',
  },

  // ─── Borders ─────────────────────────────────────────────────────────
  {
    name: '--border',
    category: 'borders',
    type: 'color',
    layer: 'A1-identity',
    description: 'Default border / card edge.',
    fallback: 'rgba(0, 0, 0, 0.06)',
    dtcgPath: 'color.border',
    v4Prefix: '--color-border',
  },
  {
    name: '--border-soft',
    category: 'borders',
    type: 'color',
    layer: 'B-slot',
    description: 'Inner row separator that does not visually compete.',
    aliasTo: 'var(--border)',
    dtcgPath: 'color.borderSoft',
    v4Prefix: '--color-border-soft',
  },
  {
    name: '--highlight',
    category: 'borders',
    type: 'color',
    layer: 'A2',
    description: 'Inset highlight border for crystalline optical depth.',
    fallback: 'rgba(255, 255, 255, 0.90)',
    dtcgPath: 'color.highlight',
    v4Prefix: '--color-highlight',
  },

  // ─── Accents ─────────────────────────────────────────────────────────
  {
    name: '--accent',
    category: 'accents',
    type: 'color',
    layer: 'A1-identity',
    description: 'Brand accent.',
    fallback: '#2563eb',
    dtcgPath: 'color.accent',
    v4Prefix: '--color-accent',
  },
  {
    name: '--accent-on',
    category: 'accents',
    type: 'color',
    layer: 'A2',
    description: 'FG when --accent is the bg.',
    fallback: '#ffffff',
    dtcgPath: 'color.accentOn',
    v4Prefix: '--color-accent-on',
  },
  {
    name: '--accent-hover',
    category: 'accents',
    type: 'color',
    layer: 'A2',
    description: 'Hover state for elements using --accent as bg.',
    fallback: 'color-mix(in oklab, var(--accent), black 8%)',
    dtcgPath: 'color.accentHover',
    v4Prefix: '--color-accent-hover',
  },
  {
    name: '--accent-active',
    category: 'accents',
    type: 'color',
    layer: 'A2',
    description: 'Active state for elements using --accent as bg.',
    fallback: 'color-mix(in oklab, var(--accent), black 14%)',
    dtcgPath: 'color.accentActive',
    v4Prefix: '--color-accent-active',
  },
  {
    name: '--accent-glow',
    category: 'accents',
    type: 'color',
    layer: 'A2',
    description: 'Specular accent glow focus ring with alpha.',
    fallback: 'rgba(37, 99, 235, 0.25)',
    dtcgPath: 'color.accentGlow',
    v4Prefix: '--color-accent-glow',
  },

  // ─── Semantics ───────────────────────────────────────────────────────
  {
    name: '--success',
    category: 'semantics',
    type: 'color',
    layer: 'A2',
    description: 'Success state color.',
    fallback: '#16a34a',
    dtcgPath: 'color.success',
    v4Prefix: '--color-success',
  },
  {
    name: '--warn',
    category: 'semantics',
    type: 'color',
    layer: 'A2',
    description: 'Warning state color.',
    fallback: '#eab308',
    dtcgPath: 'color.warn',
    v4Prefix: '--color-warn',
  },
  {
    name: '--danger',
    category: 'semantics',
    type: 'color',
    layer: 'A2',
    description: 'Danger state color.',
    fallback: '#dc2626',
    dtcgPath: 'color.danger',
    v4Prefix: '--color-danger',
  },

  // ─── Typography — Fonts ──────────────────────────────────────────────
  {
    name: '--font-display',
    category: 'typography',
    type: 'fontFamily',
    layer: 'A1-identity',
    description: 'Display / heading font stack.',
    fallback: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    dtcgPath: 'typography.font.display',
    v4Prefix: '--font-display',
  },
  {
    name: '--font-body',
    category: 'typography',
    type: 'fontFamily',
    layer: 'A1-identity',
    description: 'Body font stack.',
    fallback: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    dtcgPath: 'typography.font.body',
    v4Prefix: '--font-body',
  },
  {
    name: '--font-mono',
    category: 'typography',
    type: 'fontFamily',
    layer: 'A2',
    description: 'Monospace font stack.',
    fallback: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
    dtcgPath: 'typography.font.mono',
    v4Prefix: '--font-mono',
  },

  // ─── Typography — Scale ─────────────────────────────────────────────
  {
    name: '--text-xs',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — extra small.',
    fallback: '0.75rem',
    dtcgPath: 'typography.fontSize.xs',
    v4Prefix: '--text-xs',
  },
  {
    name: '--text-sm',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — small.',
    fallback: '0.875rem',
    dtcgPath: 'typography.fontSize.sm',
    v4Prefix: '--text-sm',
  },
  {
    name: '--text-base',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — body baseline.',
    fallback: '1rem',
    dtcgPath: 'typography.fontSize.base',
    v4Prefix: '--text-base',
  },
  {
    name: '--text-lg',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — H3 / featured body.',
    fallback: '1.125rem',
    dtcgPath: 'typography.fontSize.lg',
    v4Prefix: '--text-lg',
  },
  {
    name: '--text-xl',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — H2.',
    fallback: '1.375rem',
    dtcgPath: 'typography.fontSize.xl',
    v4Prefix: '--text-xl',
  },
  {
    name: '--text-2xl',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — section title.',
    fallback: '1.75rem',
    dtcgPath: 'typography.fontSize.2xl',
    v4Prefix: '--text-2xl',
  },
  {
    name: '--text-3xl',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — H1.',
    fallback: '2.25rem',
    dtcgPath: 'typography.fontSize.3xl',
    v4Prefix: '--text-3xl',
  },
  {
    name: '--text-4xl',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Type scale step — display / hero.',
    fallback: '3rem',
    dtcgPath: 'typography.fontSize.4xl',
    v4Prefix: '--text-4xl',
  },

  // ─── Typography — Leading & Tracking ────────────────────────────────
  {
    name: '--leading-body',
    category: 'typography',
    type: 'number',
    layer: 'A1-structure',
    description: 'Line-height for reading body.',
    fallback: '1.55',
    dtcgPath: 'typography.lineHeight.body',
    v4Prefix: '--leading-body',
  },
  {
    name: '--leading-tight',
    category: 'typography',
    type: 'number',
    layer: 'A1-structure',
    description: 'Line-height for headings.',
    fallback: '1.15',
    dtcgPath: 'typography.lineHeight.tight',
    v4Prefix: '--leading-tight',
  },
  {
    name: '--tracking-display',
    category: 'typography',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Letter-spacing applied to display sizes.',
    fallback: '-0.02em',
    dtcgPath: 'typography.letterSpacing.display',
    v4Prefix: '--tracking-display',
  },

  // ─── Spacing ─────────────────────────────────────────────────────────
  {
    name: '--space-1',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 4px tier.',
    fallback: '4px',
    dtcgPath: 'spacing.space1',
    v4Prefix: '--spacing-1',
  },
  {
    name: '--space-2',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 8px tier.',
    fallback: '8px',
    dtcgPath: 'spacing.space2',
    v4Prefix: '--spacing-2',
  },
  {
    name: '--space-3',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 12px tier.',
    fallback: '12px',
    dtcgPath: 'spacing.space3',
    v4Prefix: '--spacing-3',
  },
  {
    name: '--space-4',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 16px tier.',
    fallback: '16px',
    dtcgPath: 'spacing.space4',
    v4Prefix: '--spacing-4',
  },
  {
    name: '--space-5',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 20px tier.',
    fallback: '20px',
    dtcgPath: 'spacing.space5',
    v4Prefix: '--spacing-5',
  },
  {
    name: '--space-6',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 24px tier.',
    fallback: '24px',
    dtcgPath: 'spacing.space6',
    v4Prefix: '--spacing-6',
  },
  {
    name: '--space-8',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 32px tier.',
    fallback: '32px',
    dtcgPath: 'spacing.space8',
    v4Prefix: '--spacing-8',
  },
  {
    name: '--space-12',
    category: 'spacing',
    type: 'dimension',
    layer: 'A2',
    description: 'Base spacing — 48px tier.',
    fallback: '48px',
    dtcgPath: 'spacing.space12',
    v4Prefix: '--spacing-12',
  },

  // ─── Section Rhythm & Container ──────────────────────────────────────
  {
    name: '--section-y-desktop',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Vertical padding between sections — desktop.',
    fallback: '96px',
    dtcgPath: 'layout.sectionYDesktop',
    v4Prefix: '--spacing-section-y-desktop',
  },
  {
    name: '--section-y-tablet',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Vertical padding between sections — tablet.',
    fallback: '68px',
    dtcgPath: 'layout.sectionYTablet',
    v4Prefix: '--spacing-section-y-tablet',
  },
  {
    name: '--section-y-phone',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Vertical padding between sections — phone.',
    fallback: '48px',
    dtcgPath: 'layout.sectionYPhone',
    v4Prefix: '--spacing-section-y-phone',
  },
  {
    name: '--container-max',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Max content container width.',
    fallback: '1200px',
    dtcgPath: 'layout.containerMax',
    v4Prefix: '--spacing-container-max',
  },
  {
    name: '--container-gutter-desktop',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Container side gutter — desktop.',
    fallback: '36px',
    dtcgPath: 'layout.containerGutterDesktop',
    v4Prefix: '--spacing-container-gutter-desktop',
  },
  {
    name: '--container-gutter-tablet',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Container side gutter — tablet.',
    fallback: '24px',
    dtcgPath: 'layout.containerGutterTablet',
    v4Prefix: '--spacing-container-gutter-tablet',
  },
  {
    name: '--container-gutter-phone',
    category: 'spacing',
    type: 'dimension',
    layer: 'A1-structure',
    description: 'Container side gutter — phone.',
    fallback: '16px',
    dtcgPath: 'layout.containerGutterPhone',
    v4Prefix: '--spacing-container-gutter-phone',
  },

  // ─── Elevation — Radii ───────────────────────────────────────────────
  {
    name: '--radius-sm',
    category: 'elevation',
    type: 'dimension',
    layer: 'A2',
    description: 'Small radius — buttons, inputs, chips.',
    fallback: '8px',
    dtcgPath: 'radius.sm',
    v4Prefix: '--radius-sm',
  },
  {
    name: '--radius-md',
    category: 'elevation',
    type: 'dimension',
    layer: 'A2',
    description: 'Medium radius — cards, modals.',
    fallback: '12px',
    dtcgPath: 'radius.md',
    v4Prefix: '--radius-md',
  },
  {
    name: '--radius-lg',
    category: 'elevation',
    type: 'dimension',
    layer: 'A2',
    description: 'Large radius — featured containers.',
    fallback: '20px',
    dtcgPath: 'radius.lg',
    v4Prefix: '--radius-lg',
  },
  {
    name: '--radius-pill',
    category: 'elevation',
    type: 'dimension',
    layer: 'A2',
    description: 'Pill radius — avatars, badges.',
    fallback: '9999px',
    dtcgPath: 'radius.pill',
    v4Prefix: '--radius-pill',
  },

  // ─── Elevation — Shadows ─────────────────────────────────────────────
  {
    name: '--elev-flat',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'No elevation.',
    fallback: 'none',
    dtcgPath: 'shadow.flat',
    v4Prefix: '--shadow-flat',
  },
  {
    name: '--elev-ring',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Hairline ring (1px box-shadow border).',
    fallback: '0 0 0 1px var(--border)',
    dtcgPath: 'shadow.ring',
    v4Prefix: '--shadow-ring',
  },
  {
    name: '--elev-raised',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Raised surface.',
    fallback: '0 24px 72px rgba(0, 0, 0, 0.36)',
    dtcgPath: 'shadow.raised',
    v4Prefix: '--shadow-raised',
  },
  {
    name: '--focus-ring',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Keyboard focus indicator.',
    fallback: '0 0 0 4px rgba(96, 165, 250, 0.28)',
    dtcgPath: 'shadow.focusRing',
    v4Prefix: '--shadow-focus-ring',
  },
  {
    name: '--shadow-sm',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Subtle ambient shadow for resting elements.',
    fallback: '0 1px 2px rgba(0, 0, 0, 0.04)',
    dtcgPath: 'shadow.sm',
    v4Prefix: '--shadow-sm',
  },
  {
    name: '--shadow-md',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Medium shadow for cards and floating elements.',
    fallback: '0 4px 12px rgba(0, 0, 0, 0.05)',
    dtcgPath: 'shadow.md',
    v4Prefix: '--shadow-md',
  },
  {
    name: '--shadow-lg',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Deep elevation shadow for dialogs and HUD nav.',
    fallback: '0 12px 28px -4px rgba(0, 0, 0, 0.04)',
    dtcgPath: 'shadow.lg',
    v4Prefix: '--shadow-lg',
  },
  {
    name: '--shadow-ambient',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Soft ambient occlusion shadow.',
    fallback: '0 8px 32px rgba(0, 0, 0, 0.04)',
    dtcgPath: 'shadow.ambient',
    v4Prefix: '--shadow-ambient',
  },
  {
    name: '--shadow-key',
    category: 'elevation',
    type: 'shadow',
    layer: 'A2',
    description: 'Directional key light shadow.',
    fallback: '0 1px 3px rgba(0, 0, 0, 0.06)',
    dtcgPath: 'shadow.key',
    v4Prefix: '--shadow-key',
  },

  // ─── Motion ──────────────────────────────────────────────────────────
  {
    name: '--motion-fast',
    category: 'motion',
    type: 'duration',
    layer: 'A2',
    description: 'Hover / micro-state duration.',
    fallback: '130ms',
    dtcgPath: 'motion.durationFast',
    v4Prefix: '--animate-fast',
  },
  {
    name: '--motion-base',
    category: 'motion',
    type: 'duration',
    layer: 'A2',
    description: 'General state-change duration.',
    fallback: '220ms',
    dtcgPath: 'motion.durationBase',
    v4Prefix: '--animate-base',
  },
  {
    name: '--ease-standard',
    category: 'motion',
    type: 'cubicBezier',
    layer: 'A2',
    description: 'Standard easing curve.',
    fallback: 'cubic-bezier(0.2, 0, 0, 1)',
    dtcgPath: 'motion.easeStandard',
    v4Prefix: '--ease-standard',
  },
]);

/**
 * Standard visual categories in order for CSS Variables export.
 */
export const CATEGORY_ORDER = [
  'Surfaces',
  'Foregrounds',
  'Borders',
  'Accents',
  'Semantics',
  'Typography',
  'Spacing',
  'Elevation',
  'Motion',
  'Custom',
];

/**
 * Default 60 FPS Keyframes and animations
 */
export const DEFAULT_KEYFRAMES = {
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(12px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.96)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'spin-slow': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  'pulse-subtle': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.75' },
  },
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
};

export const DEFAULT_ANIMATIONS = {
  'fade-up': 'fade-up var(--motion-base, 220ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)) forwards',
  'scale-in': 'scale-in var(--motion-fast, 130ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)) forwards',
  'spin-slow': 'spin-slow 8s linear infinite',
  'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
};

// =============================================================================
// 1. TOKEN NORMALIZATION & AST CONVERSION
// =============================================================================

/**
 * Checks if a string is a valid color format.
 */
function isColorValue(val) {
  if (typeof val !== 'string') return false;
  const s = val.trim();
  return (
    s.startsWith('#') ||
    s.startsWith('rgb(') ||
    s.startsWith('rgba(') ||
    s.startsWith('hsl(') ||
    s.startsWith('hsla(') ||
    s.startsWith('oklch(') ||
    s.startsWith('oklab(') ||
    s.startsWith('color-mix(') ||
    ['transparent', 'currentColor'].includes(s)
  );
}

/**
 * Checks if a string is a shadow value.
 */
function isShadowValue(val) {
  if (typeof val !== 'string') return false;
  const s = val.trim();
  if (s === 'none') return true;
  return /^(inset\s+)?-?\d+(\.\d+)?(px|rem|em)\s+-?\d+/.test(s);
}

/**
 * Inactive/safe hash generator for checksums.
 */
function computeChecksum(data) {
  try {
    return createHash('sha256').update(typeof data === 'string' ? data : JSON.stringify(data)).digest('hex');
  } catch {
    let hash = 0;
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

/**
 * Normalizes any token input format into canonical TokenContractAST.
 * Handles:
 *  - PageAssemblySchema (schema.theme or schema.tokens)
 *  - LuminousThemeContract (theme.canvas, theme.surface, theme.accent, etc.)
 *  - TokenContractAST ({ tokens: [...] })
 *  - Array of TokenNode or TokenSpec
 *  - Raw dictionary Record<string, string>
 *  - Raw CSS stylesheet string :root { ... }
 *
 * @param {unknown} input
 * @returns {object} Canonical TokenContractAST
 */
export function normalizeTokenContractAST(input) {
  if (!input) {
    return {
      tokens: STANDARD_TOKEN_SCHEMA.map((s) => ({
        name: s.name,
        value: s.fallback || (s.aliasTo ? s.aliasTo : ''),
        category: s.category,
        type: s.type,
        description: s.description,
        aliasTo: s.aliasTo,
        layer: s.layer,
      })),
      keyframes: { ...DEFAULT_KEYFRAMES },
      meta: { name: 'standard-tokens', version: '4.0.0' },
    };
  }

  // Case 1: Raw CSS stylesheet string
  if (typeof input === 'string') {
    return parseCssToTokenContractAST(input);
  }

  // Case 2: PageAssemblySchema with .theme
  if (typeof input === 'object' && input !== null && 'theme' in input && typeof input.theme === 'object') {
    return fromLuminousThemeContract(input.theme, input);
  }

  // Case 3: LuminousThemeContract directly
  if (typeof input === 'object' && input !== null && ('canvas' in input || 'surface' in input) && ('accent' in input || 'text' in input)) {
    return fromLuminousThemeContract(input);
  }

  // Case 4: Already a TokenContractAST with .tokens
  if (typeof input === 'object' && input !== null && 'tokens' in input) {
    const rawTokens = Array.isArray(input.tokens)
      ? input.tokens
      : Object.entries(input.tokens).map(([k, v]) => (typeof v === 'object' && v !== null ? { name: k, ...v } : { name: k, value: String(v) }));

    const normalized = rawTokens.map(normalizeTokenNode);
    return {
      tokens: normalized,
      keyframes: input.keyframes ? { ...DEFAULT_KEYFRAMES, ...input.keyframes } : { ...DEFAULT_KEYFRAMES },
      meta: { version: '4.0.0', ...input.meta },
    };
  }

  // Case 5: Array of tokens
  if (Array.isArray(input)) {
    return {
      tokens: input.map(normalizeTokenNode),
      keyframes: { ...DEFAULT_KEYFRAMES },
      meta: { version: '4.0.0' },
    };
  }

  // Case 6: Plain Record<string, string>
  if (typeof input === 'object' && input !== null) {
    const tokens = Object.entries(input).map(([name, value]) => {
      const normalizedName = name.startsWith('--') ? name : `--${name}`;
      return normalizeTokenNode({ name: normalizedName, value: String(value) });
    });
    return {
      tokens,
      keyframes: { ...DEFAULT_KEYFRAMES },
      meta: { version: '4.0.0' },
    };
  }

  return normalizeTokenContractAST(null);
}

/**
 * Normalizes a single TokenNode against the standard schema.
 */
function normalizeTokenNode(node) {
  const name = node.name.startsWith('--') ? node.name : `--${node.name}`;
  const schemaSpec = STANDARD_TOKEN_SCHEMA.find((s) => s.name === name);

  let val = node.value !== undefined ? String(node.value) : schemaSpec?.fallback || schemaSpec?.aliasTo || '';
  let aliasTo = node.aliasTo;

  // Detect alias from value
  if (!aliasTo && typeof val === 'string' && val.trim().startsWith('var(--')) {
    const match = val.trim().match(/^var\((--[a-zA-Z0-9_-]+)\)$/);
    if (match) {
      aliasTo = match[1];
    }
  }

  // Infer category if missing
  let category = node.category || schemaSpec?.category;
  if (!category) {
    category = inferCategory(name, val);
  }

  // Infer type if missing
  let type = node.type || schemaSpec?.type;
  if (!type) {
    type = inferDtcgType(name, val, category);
  }

  return {
    name,
    value: val,
    category,
    type,
    description: node.description || schemaSpec?.description || '',
    aliasTo: aliasTo || schemaSpec?.aliasTo,
    layer: node.layer || schemaSpec?.layer || 'C-extension',
    keyframes: node.keyframes,
    dtcgPath: node.dtcgPath || schemaSpec?.dtcgPath,
    v4Prefix: node.v4Prefix || schemaSpec?.v4Prefix,
  };
}

/**
 * Infers category from name and value.
 */
function inferCategory(name, val) {
  const n = name.toLowerCase();
  if (n.includes('bg') || n.includes('surface') || n.includes('canvas') || n.includes('elevated')) return 'surfaces';
  if (n.includes('fg') || n.includes('text') || n.includes('muted') || n.includes('meta')) return 'foregrounds';
  if (n.includes('border') || n.includes('highlight') || n.includes('stroke') || n.includes('divider')) return 'borders';
  if (n.includes('accent') || n.includes('primary') || n.includes('brand') || n.includes('glow')) return 'accents';
  if (n.includes('success') || n.includes('warn') || n.includes('danger') || n.includes('info') || n.includes('error')) return 'semantics';
  if (n.includes('font') || n.includes('text-') || n.includes('leading') || n.includes('tracking')) return 'typography';
  if (n.includes('space') || n.includes('gap') || n.includes('section') || n.includes('container') || n.includes('gutter') || n.includes('padding') || n.includes('margin')) return 'spacing';
  if (n.includes('radius') || n.includes('shadow') || n.includes('elev') || n.includes('ring') || n.includes('blur')) return 'elevation';
  if (n.includes('motion') || n.includes('ease') || n.includes('duration') || n.includes('animate') || n.includes('transition')) return 'motion';
  if (isColorValue(val)) return 'accents';
  if (isShadowValue(val)) return 'elevation';
  return 'custom';
}

/**
 * Infers DTCG token type.
 */
function inferDtcgType(name, val, category) {
  const n = name.toLowerCase();
  if (category === 'surfaces' || category === 'foregrounds' || category === 'borders' || category === 'accents' || category === 'semantics') return 'color';
  if (n.startsWith('--font-') || n.includes('family')) return 'fontFamily';
  if (n.includes('weight')) return 'fontWeight';
  if (n.includes('leading') || n.includes('opacity') || /^\d+(\.\d+)?$/.test(val.trim())) return 'number';
  if (n.startsWith('--shadow-') || n.startsWith('--elev-') || n.includes('ring') || isShadowValue(val)) return 'shadow';
  if (n.startsWith('--ease-') || n.includes('bezier') || val.includes('cubic-bezier')) return 'cubicBezier';
  if (n.startsWith('--motion-') || n.includes('duration') || /^\d+(\.\d+)?(ms|s)$/.test(val.trim())) return 'duration';
  if (n.startsWith('--space-') || n.startsWith('--radius-') || n.startsWith('--text-') || /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/.test(val.trim())) return 'dimension';
  if (isColorValue(val)) return 'color';
  return 'dimension';
}

/**
 * Converts a LuminousThemeContract into a full TokenContractAST.
 *
 * @param {object} theme LuminousThemeContract
 * @param {object} [schema] Optional parent schema
 * @returns {object} Canonical TokenContractAST
 */
export function fromLuminousThemeContract(theme, schema = {}) {
  const map = new Map();

  // Seed standard tokens first
  for (const s of STANDARD_TOKEN_SCHEMA) {
    map.set(s.name, {
      name: s.name,
      value: s.fallback || (s.aliasTo ? s.aliasTo : ''),
      category: s.category,
      type: s.type,
      description: s.description,
      aliasTo: s.aliasTo,
      layer: s.layer,
    });
  }

  // Populate from LuminousThemeContract
  if (theme.canvas) {
    map.set('--canvas', { name: '--canvas', value: theme.canvas, category: 'surfaces', type: 'color' });
    map.set('--bg', { name: '--bg', value: theme.canvas, category: 'surfaces', type: 'color' });
  }
  if (theme.surface) {
    map.set('--surface', { name: '--surface', value: theme.surface, category: 'surfaces', type: 'color' });
  }
  if (theme.elevated) {
    map.set('--elevated', { name: '--elevated', value: theme.elevated, category: 'surfaces', type: 'color' });
  }
  if (theme.border) {
    map.set('--border', { name: '--border', value: theme.border, category: 'borders', type: 'color' });
  }
  if (theme.highlight) {
    map.set('--highlight', { name: '--highlight', value: theme.highlight, category: 'borders', type: 'color' });
  }

  // Text tokens
  if (theme.text) {
    if (theme.text.primary) {
      map.set('--fg', { name: '--fg', value: theme.text.primary, category: 'foregrounds', type: 'color' });
      map.set('--text-primary', { name: '--text-primary', value: theme.text.primary, category: 'foregrounds', type: 'color' });
    }
    if (theme.text.secondary) {
      map.set('--text-secondary', { name: '--text-secondary', value: theme.text.secondary, category: 'foregrounds', type: 'color' });
    }
    if (theme.text.muted) {
      map.set('--muted', { name: '--muted', value: theme.text.muted, category: 'foregrounds', type: 'color' });
      map.set('--text-muted', { name: '--text-muted', value: theme.text.muted, category: 'foregrounds', type: 'color' });
    }
  }

  // Accent tokens
  if (theme.accent) {
    const accentVal = theme.accent.solid || theme.accent.primary;
    if (accentVal) {
      map.set('--accent', { name: '--accent', value: accentVal, category: 'accents', type: 'color' });
    }
    if (theme.accent.solidFg) {
      map.set('--accent-on', { name: '--accent-on', value: theme.accent.solidFg, category: 'accents', type: 'color' });
    }
    if (theme.accent.hover || theme.accent.solidHover) {
      map.set('--accent-hover', { name: '--accent-hover', value: theme.accent.hover || theme.accent.solidHover, category: 'accents', type: 'color' });
    }
    if (theme.accent.glow) {
      map.set('--accent-glow', { name: '--accent-glow', value: theme.accent.glow, category: 'accents', type: 'color' });
    }
  }

  // Shadow tokens
  if (theme.shadows) {
    if (theme.shadows.sm) map.set('--shadow-sm', { name: '--shadow-sm', value: theme.shadows.sm, category: 'elevation', type: 'shadow' });
    if (theme.shadows.md) map.set('--shadow-md', { name: '--shadow-md', value: theme.shadows.md, category: 'elevation', type: 'shadow' });
    if (theme.shadows.lg) map.set('--shadow-lg', { name: '--shadow-lg', value: theme.shadows.lg, category: 'elevation', type: 'shadow' });
    if (theme.shadows.ambient) map.set('--shadow-ambient', { name: '--shadow-ambient', value: theme.shadows.ambient, category: 'elevation', type: 'shadow' });
    if (theme.shadows.key) map.set('--shadow-key', { name: '--shadow-key', value: theme.shadows.key, category: 'elevation', type: 'shadow' });
  }

  // Custom tokens
  if (theme.customTokens && typeof theme.customTokens === 'object') {
    for (const [k, v] of Object.entries(theme.customTokens)) {
      const normName = k.startsWith('--') ? k : `--${k}`;
      map.set(normName, normalizeTokenNode({ name: normName, value: String(v) }));
    }
  }

  return {
    tokens: Array.from(map.values()),
    keyframes: { ...DEFAULT_KEYFRAMES },
    meta: {
      name: schema?.metadata?.title || 'luminous-theme',
      version: '4.0.0',
    },
  };
}

/**
 * Parses a raw CSS string into a TokenContractAST.
 */
export function parseCssToTokenContractAST(css) {
  const tokens = [];
  const declRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = declRegex.exec(css)) !== null) {
    const name = match[1].trim();
    const value = match[2].trim();
    tokens.push(normalizeTokenNode({ name, value }));
  }
  return {
    tokens,
    keyframes: { ...DEFAULT_KEYFRAMES },
    meta: { version: '4.0.0' },
  };
}

// =============================================================================
// 2. INVERSE TOKEN MAP BUILDER (Bản Đồ Ánh Xạ Ngược)
// =============================================================================

/**
 * Builds an Inverse Token Map from CSS variable names (--surface)
 * to valid DTCG dot paths (color.surface).
 *
 * @param {Array<object>} tokens
 * @returns {Map<string, string>}
 */
export function buildInverseTokenMap(tokens) {
  const map = new Map();

  // 1. Seed from standard schema
  for (const s of STANDARD_TOKEN_SCHEMA) {
    if (s.dtcgPath) {
      map.set(s.name, s.dtcgPath);
    }
  }

  // 2. Add tokens from input
  for (const t of tokens) {
    if (t.dtcgPath) {
      map.set(t.name, t.dtcgPath);
    } else if (!map.has(t.name)) {
      map.set(t.name, inferDtcgPath(t));
    }
  }

  return map;
}

/**
 * Infers a clean DTCG path for a token.
 */
function inferDtcgPath(token) {
  const raw = token.name.startsWith('--') ? token.name.slice(2) : token.name;
  const parts = raw.split('-');
  const camelName = parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');

  const cat = (token.category || inferCategory(token.name, token.value)).toLowerCase();

  switch (cat) {
    case 'surfaces':
    case 'foregrounds':
    case 'borders':
    case 'accents':
    case 'semantics':
      if (raw.startsWith('color-') && raw.length > 6) {
        return `color.${toTokenId(raw.slice(6))}`;
      }
      return `color.${camelName}`;
    case 'spacing':
      return `spacing.${camelName}`;
    case 'typography':
      if (raw.startsWith('font-')) return `typography.font.${toTokenId(raw.slice(5))}`;
      if (raw.startsWith('text-')) return `typography.fontSize.${toTokenId(raw.slice(5))}`;
      if (raw.startsWith('leading-')) return `typography.lineHeight.${toTokenId(raw.slice(8))}`;
      return `typography.${camelName}`;
    case 'elevation':
      if (raw.startsWith('radius-')) return `radius.${toTokenId(raw.slice(7))}`;
      if (raw.startsWith('shadow-')) return `shadow.${toTokenId(raw.slice(7))}`;
      if (raw.startsWith('elev-')) return `shadow.${toTokenId(raw.slice(5))}`;
      if (raw.includes('ring')) return `shadow.${camelName}`;
      return `elevation.${camelName}`;
    case 'motion':
      if (raw.startsWith('motion-')) return `motion.${toTokenId(raw.slice(7))}`;
      if (raw.startsWith('ease-')) return `motion.${toTokenId(raw.slice(5))}`;
      return `motion.${camelName}`;
    default:
      return `custom.${camelName}`;
  }
}

/**
 * Resolves DTCG pointer reference from var(--name) or aliasTo.
 * Replaces var(--surface) -> {color.surface}.
 *
 * @param {string} val
 * @param {Map<string, string>} inverseMap
 * @returns {string}
 */
export function resolveDtcgPointer(val, inverseMap) {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();

  // Direct alias: var(--name)
  const directMatch = trimmed.match(/^var\((--[a-zA-Z0-9_-]+)\)$/);
  if (directMatch) {
    const varName = directMatch[1];
    const path = inverseMap.get(varName);
    return path ? `{${path}}` : `{${varName.slice(2)}}`;
  }

  // Composite expression: replace all var(--name) inside string
  return trimmed.replace(/var\((--[a-zA-Z0-9_-]+)\)/g, (full, varName) => {
    const path = inverseMap.get(varName);
    return path ? `{${path}}` : full;
  });
}

// =============================================================================
// 3. TAILWIND V3 EXPORTER
// =============================================================================

/**
 * Sanitizes a token name for Tailwind v3 theme.extend keys.
 * Fixes naive regex bugs: guarantees that keywords like 'bg', 'surface', 'border'
 * never degenerate into empty strings.
 *
 * @param {string} tokenName
 * @param {'colors' | 'boxShadow' | 'borderRadius' | 'blur' | 'spacing' | 'fontFamily'} section
 * @returns {string}
 */
export function sanitizeTailwindKey(tokenName, section) {
  let raw = tokenName.startsWith('--') ? tokenName.slice(2) : tokenName;

  // Protected exact keys that MUST NEVER be stripped to empty string
  const PROTECTED = new Set([
    'bg',
    'surface',
    'surface-warm',
    'canvas',
    'elevated',
    'fg',
    'border',
    'highlight',
    'accent',
    'muted',
    'meta',
    'ring',
    'shadow',
    'radius',
    'blur',
    'gap',
    'space',
  ]);

  if (PROTECTED.has(raw)) {
    return raw;
  }

  if (section === 'colors') {
    if (raw.startsWith('color-') && raw.length > 6) {
      return raw.slice(6);
    }
    return raw;
  }

  if (section === 'boxShadow') {
    if (raw.startsWith('shadow-') && raw.length > 7) {
      return raw.slice(7);
    }
    if (raw.startsWith('elev-') && raw.length > 5) {
      return raw.slice(5);
    }
    return raw;
  }

  if (section === 'borderRadius') {
    if (raw.startsWith('radius-') && raw.length > 7) {
      return raw.slice(7);
    }
    return raw;
  }

  if (section === 'blur') {
    if (raw.startsWith('blur-') && raw.length > 5) {
      return raw.slice(5);
    }
    return raw;
  }

  if (section === 'spacing') {
    if (raw.startsWith('space-') && raw.length > 6) {
      return raw.slice(6);
    }
    if (raw.startsWith('spacing-') && raw.length > 8) {
      return raw.slice(8);
    }
    return raw;
  }

  if (section === 'fontFamily') {
    if (raw.startsWith('font-') && raw.length > 5) {
      return raw.slice(5);
    }
    return raw;
  }

  if (section === 'fontSize') {
    if (raw.startsWith('text-') && raw.length > 5) {
      return raw.slice(5);
    }
    if (raw.startsWith('font-size-') && raw.length > 10) {
      return raw.slice(10);
    }
    return raw;
  }

  if (section === 'lineHeight') {
    if (raw.startsWith('leading-') && raw.length > 8) {
      return raw.slice(8);
    }
    if (raw.startsWith('line-height-') && raw.length > 12) {
      return raw.slice(12);
    }
    return raw;
  }

  if (section === 'letterSpacing') {
    if (raw.startsWith('tracking-') && raw.length > 9) {
      return raw.slice(9);
    }
    if (raw.startsWith('letter-spacing-') && raw.length > 15) {
      return raw.slice(15);
    }
    return raw;
  }

  return raw;
}

/**
 * Exports complete Tailwind v3 configuration with theme.extend.
 *
 * @param {unknown} input
 * @param {object} [options]
 * @param {'cjs' | 'esm'} [options.format='cjs']
 * @returns {{ theme: object, rawString: string }}
 */
export function exportTailwindV3(input, options = {}) {
  const ast = normalizeTokenContractAST(input);
  const format = options.format || 'cjs';

  const colors = {};
  const boxShadow = {};
  const borderRadius = {};
  const blur = {};
  const fontFamily = {};
  const fontSize = {};
  const lineHeight = {};
  const letterSpacing = {};
  const spacing = {};

  for (const t of ast.tokens) {
    const val = `var(${t.name})`;

    // Categorize into Tailwind v3 sections
    if (t.type === 'color' || ['surfaces', 'foregrounds', 'borders', 'accents', 'semantics'].includes(t.category)) {
      const key = sanitizeTailwindKey(t.name, 'colors');
      colors[key] = val;
    } else if (t.type === 'shadow' || (t.category === 'elevation' && (t.name.includes('shadow') || t.name.includes('elev') || t.name.includes('ring')))) {
      const key = sanitizeTailwindKey(t.name, 'boxShadow');
      boxShadow[key] = val;
    } else if (t.type === 'dimension' && (t.name.includes('radius') || (t.category === 'elevation' && !t.name.includes('shadow') && !t.name.includes('elev') && !t.name.includes('ring') && !t.name.includes('blur')))) {
      const key = sanitizeTailwindKey(t.name, 'borderRadius');
      borderRadius[key] = val;
    } else if (t.name.includes('blur')) {
      const key = sanitizeTailwindKey(t.name, 'blur');
      blur[key] = val;
    } else if (t.type === 'fontFamily' || t.name.startsWith('--font-')) {
      const key = sanitizeTailwindKey(t.name, 'fontFamily');
      fontFamily[key] = [val];
    } else if (t.name.startsWith('--leading-') || t.name.includes('line-height') || (t.category === 'typography' && t.type === 'number')) {
      const key = sanitizeTailwindKey(t.name, 'lineHeight');
      lineHeight[key] = val;
    } else if (t.name.startsWith('--tracking-') || t.name.includes('letter-spacing')) {
      const key = sanitizeTailwindKey(t.name, 'letterSpacing');
      letterSpacing[key] = val;
    } else if (t.name.startsWith('--text-') || (t.category === 'typography' && t.type === 'dimension')) {
      const key = sanitizeTailwindKey(t.name, 'fontSize');
      fontSize[key] = val;
    } else if (t.category === 'spacing' || t.name.startsWith('--space-')) {
      const key = sanitizeTailwindKey(t.name, 'spacing');
      spacing[key] = val;
    }
  }

  // Ensure standard blur presets exist
  if (!blur.sm) blur.sm = '4px';
  if (!blur.md) blur.md = '8px';
  if (!blur.lg) blur.lg = '16px';
  if (!blur.glass) blur.glass = '12px';

  // Merge keyframes & animations
  const keyframes = { ...DEFAULT_KEYFRAMES, ...ast.keyframes };
  const animation = { ...DEFAULT_ANIMATIONS };

  const themeExtend = {
    colors,
    boxShadow,
    borderRadius,
    blur,
    fontFamily,
    fontSize,
    lineHeight,
    letterSpacing,
    spacing,
    keyframes,
    animation,
  };

  const theme = {
    extend: themeExtend,
  };

  const rawConfig = {
    darkMode: ['class'],
    content: ['./src/**/*.{html,js,ts,jsx,tsx}', './index.html'],
    theme,
    plugins: [],
  };

  const jsonIndented = JSON.stringify(rawConfig, null, 2);

  const rawString =
    format === 'esm'
      ? `/** @type {import('tailwindcss').Config} */\nexport default ${jsonIndented};\n`
      : `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${jsonIndented};\n`;

  return {
    theme,
    rawString,
  };
}

// =============================================================================
// 4. TAILWIND V4 EXPORTER (@theme CSS)
// =============================================================================

/**
 * Maps a token into its Tailwind v4 CSS Custom Property name.
 *
 * @param {object} token
 * @returns {string} e.g. '--color-surface', '--shadow-sm', '--radius-md'
 */
export function mapToTailwindV4VarName(token) {
  // If token explicitly defines a v4 prefix, honor it
  if (token.v4Prefix && typeof token.v4Prefix === 'string' && token.v4Prefix.trim()) {
    return token.v4Prefix.trim();
  }

  const name = token.name.startsWith('--') ? token.name : `--${token.name}`;
  const raw = name.slice(2);

  // If already correctly prefixed in v4 format:
  if (raw.startsWith('color-')) return name;
  if (raw.startsWith('shadow-')) return name;
  if (raw.startsWith('radius-')) return name;
  if (raw.startsWith('spacing-')) return name;
  if (raw.startsWith('font-')) return name;
  if (raw.startsWith('ease-')) return name;
  if (raw.startsWith('animate-')) return name;
  if (raw.startsWith('blur-')) return name;

  // Exact base keyword handling (prevents --shadow-shadow, --radius-radius, --blur-blur)
  if (raw === 'shadow') return '--shadow';
  if (raw === 'radius') return '--radius';
  if (raw === 'blur') return '--blur';
  if (raw === 'space' || raw === 'spacing') return '--spacing';

  // Colors
  if (
    ['bg', 'surface', 'surface-warm', 'canvas', 'elevated', 'sub-surface', 'card', 'fg', 'fg-2', 'muted', 'meta', 'text-primary', 'text-secondary', 'text-muted', 'border', 'border-soft', 'highlight', 'accent', 'accent-on', 'accent-hover', 'accent-active', 'accent-glow', 'accent-light', 'success', 'warn', 'danger'].includes(raw) ||
    ['surfaces', 'foregrounds', 'borders', 'accents', 'semantics'].includes(token.category) ||
    token.type === 'color'
  ) {
    return `--color-${raw}`;
  }

  // Shadows
  if (raw.startsWith('elev-')) {
    return `--shadow-${raw.slice(5)}`;
  }
  if (raw === 'focus-ring') {
    return `--shadow-focus-ring`;
  }
  if (token.type === 'shadow' || (token.category === 'elevation' && (raw.includes('shadow') || raw.includes('elev') || raw.includes('ring')))) {
    const s = raw.replace(/^shadow-/, '');
    return s ? `--shadow-${s}` : '--shadow';
  }

  // Radii
  if (raw.startsWith('radius-')) {
    return name;
  }
  if (token.type === 'dimension' && (token.category === 'elevation' || raw.includes('radius'))) {
    const r = raw.replace(/^radius-/, '');
    return r ? `--radius-${r}` : '--radius';
  }

  // Blurs
  if (raw.includes('blur')) {
    const b = raw.replace(/^blur-/, '');
    return b ? `--blur-${b}` : '--blur';
  }

  // Spacing
  if (raw.startsWith('space-')) {
    return `--spacing-${raw.slice(6)}`;
  }
  if (raw.startsWith('spacing-')) {
    return name;
  }
  if (raw.startsWith('section-y-') || raw.startsWith('container-') || raw.startsWith('gap-') || raw.startsWith('pad-')) {
    return `--spacing-${raw}`;
  }
  if (token.category === 'spacing') {
    const sp = raw.replace(/^(space|spacing)-/, '');
    return sp ? `--spacing-${sp}` : '--spacing';
  }

  // Fonts
  if (raw.startsWith('font-')) {
    return name;
  }
  if (token.type === 'fontFamily') {
    return `--font-${raw}`;
  }

  // Easing
  if (raw.startsWith('ease-')) {
    return name;
  }
  if (token.type === 'cubicBezier' || raw.includes('ease')) {
    const e = raw.replace(/^ease-/, '');
    return e ? `--ease-${e}` : '--ease';
  }

  // Motion durations & animations
  if (raw.startsWith('motion-')) {
    return `--animate-${raw.slice(7)}`;
  }
  if (raw.startsWith('animate-')) {
    return name;
  }
  if (token.category === 'motion') {
    const m = raw.replace(/^(motion|animate)-/, '');
    return m ? `--animate-${m}` : '--animate';
  }

  return `--${raw}`;
}

/**
 * Exports modern Tailwind v4 @theme CSS block.
 * Preserves inheritance: rewrites aliasTo and var(--...) to point to new Tailwind v4 names.
 *
 * @param {unknown} input
 * @returns {{ themeVariables: Record<string, string>, rawCss: string }}
 */
export function exportTailwindV4(input) {
  const ast = normalizeTokenContractAST(input);

  // 1. Build dictionary of all v4 variable names: originalVar -> v4Var
  // Pre-seed from STANDARD_TOKEN_SCHEMA so unexported standard vars resolve correctly
  const v4Map = new Map();
  for (const s of STANDARD_TOKEN_SCHEMA) {
    v4Map.set(s.name, mapToTailwindV4VarName(s));
  }
  for (const t of ast.tokens) {
    v4Map.set(t.name, mapToTailwindV4VarName(t));
  }

  // Rewriter for var(--...) to point to v4 names
  const rewriteVarsToV4 = (val) => {
    if (!val || typeof val !== 'string') return val;
    return val.replace(/var\((--[a-zA-Z0-9_-]+)\)/g, (full, origVar) => {
      const mapped = v4Map.get(origVar);
      return mapped ? `var(${mapped})` : full;
    });
  };

  const themeVariables = {};
  const lines = [];

  for (const t of ast.tokens) {
    const v4Name = mapToTailwindV4VarName(t);
    let finalValue = t.value;
    if ((!finalValue || !String(finalValue).trim()) && t.aliasTo) {
      finalValue = t.aliasTo.startsWith('var(') ? t.aliasTo : `var(${t.aliasTo})`;
    }
    finalValue = rewriteVarsToV4(finalValue);

    themeVariables[v4Name] = finalValue;
    lines.push(`  ${v4Name}: ${finalValue};`);
  }

  // Add default keyframes and animations to @theme if not present
  lines.push('  /* Easing curves */');
  lines.push('  --ease-standard: cubic-bezier(0.2, 0, 0, 1);');
  lines.push('  /* Animations */');
  lines.push('  --animate-fade-up: fade-up 220ms cubic-bezier(0.2, 0, 0, 1) forwards;');
  lines.push('  --animate-scale-in: scale-in 130ms cubic-bezier(0.2, 0, 0, 1) forwards;');

  // Merge any custom animations from ast.keyframes
  const allKeyframes = { ...DEFAULT_KEYFRAMES, ...ast.keyframes };
  for (const kfName of Object.keys(ast.keyframes || {})) {
    const animVar = `--animate-${kfName}`;
    if (!themeVariables[animVar]) {
      const animVal = `${kfName} var(--motion-base, 220ms) var(--ease-standard, cubic-bezier(0.2, 0, 0, 1)) forwards`;
      themeVariables[animVar] = animVal;
      lines.push(`  ${animVar}: ${animVal};`);
    }
  }

  // Generate CSS @keyframes blocks
  const keyframeBlocks = [];
  for (const [name, frames] of Object.entries(allKeyframes)) {
    const stepLines = [];
    for (const [step, props] of Object.entries(frames)) {
      if (typeof props === 'object' && props !== null) {
        const propLines = Object.entries(props)
          .map(([prop, val]) => `    ${prop}: ${val};`)
          .join('\n');
        stepLines.push(`  ${step} {\n${propLines}\n  }`);
      } else {
        stepLines.push(`  ${step} { ${props} }`);
      }
    }
    keyframeBlocks.push(`@keyframes ${name} {\n${stepLines.join('\n')}\n}`);
  }

  const rawCss = `@theme {\n${lines.join('\n')}\n}\n\n${keyframeBlocks.join('\n\n')}\n`;

  return {
    themeVariables,
    rawCss,
  };
}

// =============================================================================
// 5. CSS VARIABLES EXPORTER (design-systems/agentic/tokens.css standard)
// =============================================================================

/**
 * Categorizes tokens into visual groups.
 */
function groupTokensByCategory(tokens) {
  const groups = new Map();
  for (const cat of CATEGORY_ORDER) {
    groups.set(cat, []);
  }

  for (const t of tokens) {
    const rawCat = t.category || inferCategory(t.name, t.value);
    const catName =
      rawCat === 'surfaces'
        ? 'Surfaces'
        : rawCat === 'foregrounds'
        ? 'Foregrounds'
        : rawCat === 'borders'
        ? 'Borders'
        : rawCat === 'accents'
        ? 'Accents'
        : rawCat === 'semantics'
        ? 'Semantics'
        : rawCat === 'typography'
        ? 'Typography'
        : rawCat === 'spacing'
        ? 'Spacing'
        : rawCat === 'elevation'
        ? 'Elevation'
        : rawCat === 'motion'
        ? 'Motion'
        : 'Custom';

    if (!groups.has(catName)) {
      groups.set(catName, []);
    }
    groups.get(catName).push(t);
  }

  return groups;
}

/**
 * Exports visually grouped :root CSS stylesheet.
 *
 * @param {unknown} input
 * @param {object} [options]
 * @param {string} [options.selector=':root']
 * @param {string} [options.brandName='Agentic']
 * @returns {{ rootVariables: Record<string, string>, rawCss: string }}
 */
export function exportCssVariables(input, options = {}) {
  const ast = normalizeTokenContractAST(input);
  const selector = options.selector || ':root';
  const brandName = options.brandName || ast.meta?.brand || 'Agentic';

  const rootVariables = {};
  const groups = groupTokensByCategory(ast.tokens);

  const cssLines = [];
  cssLines.push(`/* design-systems/${brandName.toLowerCase()}/tokens.css`);
  cssLines.push(` * Structured token bindings for ${brandName}.`);
  cssLines.push(` * Luminous light theme surfaces, accessible contrast, and tactile motion.`);
  cssLines.push(` */\n`);
  cssLines.push(`${selector} {`);

  for (const [catName, tokens] of groups.entries()) {
    if (tokens.length === 0) continue;
    cssLines.push(`  /* ─── ${catName} ─── */`);
    for (const t of tokens) {
      const val = t.aliasTo && !t.value ? (t.aliasTo.startsWith('var(') ? t.aliasTo : `var(${t.aliasTo})`) : t.value;
      rootVariables[t.name] = val;
      cssLines.push(`  ${t.name}: ${val};`);
    }
    cssLines.push('');
  }

  // Remove trailing blank line before closing bracket
  if (cssLines[cssLines.length - 1] === '') {
    cssLines.pop();
  }
  cssLines.push('}\n');

  const rawCss = cssLines.join('\n');

  return {
    rootVariables,
    rawCss,
  };
}

// =============================================================================
// 6. W3C DTCG JSON EXPORTER (Design Tokens Community Group)
// =============================================================================

/**
 * Sets a value at a dot-path in a nested object.
 */
function setNestedPath(obj, path, value) {
  const keys = path.split('.');
  let curr = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in curr) || typeof curr[k] !== 'object' || curr[k] === null) {
      curr[k] = {};
    }
    curr = curr[k];
  }
  curr[keys[keys.length - 1]] = value;
}

/**
 * Exports W3C Design Tokens Community Group JSON with $value, $type,
 * and Inverse Token Map for resolving pointers like {color.surface}.
 *
 * @param {unknown} input
 * @returns {{ tokens: Record<string, any>, rawJson: string }}
 */
export function exportW3CDtcgJson(input) {
  const ast = normalizeTokenContractAST(input);
  const inverseMap = buildInverseTokenMap(ast.tokens);

  const tokens = {};

  for (const t of ast.tokens) {
    const dtcgPath = inverseMap.get(t.name) || inferDtcgPath(t);

    let resolvedValue;
    if ((!t.value || String(t.value).trim() === '') && t.aliasTo) {
      resolvedValue = resolveDtcgPointer(t.aliasTo.startsWith('var(') ? t.aliasTo : `var(${t.aliasTo})`, inverseMap);
    } else {
      resolvedValue = resolveDtcgPointer(t.value, inverseMap);
    }

    const node = {
      $value: resolvedValue,
      $type: t.type || 'color',
    };

    if (t.description) {
      node.$description = t.description;
    }

    setNestedPath(tokens, dtcgPath, node);
  }

  const rawJson = JSON.stringify(tokens, null, 2);

  return {
    tokens,
    rawJson,
  };
}

// =============================================================================
// 7. TYPESCRIPT DECLARATIONS EXPORTER (.d.ts)
// =============================================================================

/**
 * Converts a CSS variable name (--space-4) to a camelCase ID (space4).
 */
export function toTokenId(name) {
  const raw = name.startsWith('--') ? name.slice(2) : name;
  const parts = raw.split('-');
  return parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
}

/**
 * Exports type-safe TypeScript declarations (.d.ts) with union types.
 *
 * @param {unknown} input
 * @returns {{ tokens: Record<string, unknown>, rawTypeScript: string }}
 */
export function exportTypeScriptDeclarations(input) {
  const ast = normalizeTokenContractAST(input);

  const cssVarNames = Array.from(new Set(ast.tokens.map((t) => t.name)));
  const tokenIds = Array.from(new Set(ast.tokens.map((t) => toTokenId(t.name))));
  const colorVarNames = Array.from(
    new Set(
      ast.tokens
        .filter((t) => t.type === 'color' || ['surfaces', 'foregrounds', 'borders', 'accents', 'semantics'].includes(t.category))
        .map((t) => t.name)
    )
  );

  // Build clean dictionary of tokens
  const tokenDict = {};
  for (const t of ast.tokens) {
    tokenDict[toTokenId(t.name)] = t.value;
  }

  const formatUnion = (items) => {
    if (items.length === 0) return 'never';
    return items.map((item) => `  | '${item}'`).join('\n') + '\n  | (string & {});';
  };

  const lines = [
    '/**',
    ' * ⚡ DESIGN SYSTEM TOKEN DECLARATIONS — Auto-generated by CrossFrameworkTokenExporter',
    ' * =================================================================================',
    ' * Strict Type-Safe Design Token Contracts, CSS Custom Properties & Union Types.',
    ' */',
    '',
    '/**',
    ' * Union of all CSS Custom Property variables defined in this token contract.',
    ' */',
    `export type DesignTokenCssVariable =\n${formatUnion(cssVarNames)}`,
    '',
    '/**',
    ' * Clean token identifiers (camelCase IDs without leading dashes).',
    ' */',
    `export type DesignTokenId =\n${formatUnion(tokenIds)}`,
    '',
    '/**',
    ' * Union of all color token CSS variables.',
    ' */',
    `export type ColorTokenVariable =\n${formatUnion(colorVarNames)}`,
    '',
    '/**',
    ' * Design token dictionary map contract.',
    ' */',
    'export interface DesignTokensRecord {',
    '  readonly [key: string]: string;',
    '}',
    '',
    'export declare const DESIGN_TOKENS: Record<DesignTokenId, string>;',
    'export declare const CSS_VARIABLES: Record<DesignTokenCssVariable, string>;',
    '',
  ];

  const rawTypeScript = lines.join('\n');

  return {
    tokens: tokenDict,
    rawTypeScript,
  };
}

// =============================================================================
// 8. MASTER TOKEN EXPORT BUNDLE (Khế ước Gói Xuất bản Toàn diện)
// =============================================================================

/**
 * Compiles a comprehensive TokenExportBundle conforming to Round 4 contracts.
 *
 * @param {unknown} input
 * @param {object} [options]
 * @returns {object} TokenExportBundle
 */
export function exportTokenBundle(input, options = {}) {
  const ast = normalizeTokenContractAST(input);

  const tailwindConfig = exportTailwindV3(ast, options);
  const tailwindV4 = exportTailwindV4(ast);
  const cssVariables = exportCssVariables(ast, options);
  const dtcgJson = exportW3CDtcgJson(ast);
  const typescriptTokens = exportTypeScriptDeclarations(ast);

  const exportedAt = new Date().toISOString();
  const version = ast.meta?.version || '4.0.0';
  const checksum = computeChecksum(cssVariables.rawCss);

  return {
    tailwindConfig,
    tailwindV4,
    cssVariables,
    dtcgJson,
    typescriptTokens,
    exportedAt,
    version,
    checksum,
  };
}

// =============================================================================
// 9. CROSS FRAMEWORK TOKEN EXPORTER CLASS (Cỗ Máy Lớp Đối Tượng)
// =============================================================================

/**
 * ⚡ CrossFrameworkTokenExporter
 * Master multi-target export engine.
 */
export class CrossFrameworkTokenExporter {
  constructor(input, options = {}) {
    this.options = { ...options };
    this.ast = normalizeTokenContractAST(input);
  }

  /**
   * Updates or re-normalizes the internal token AST.
   */
  setTokens(input) {
    this.ast = normalizeTokenContractAST(input);
  }

  /**
   * Export Tailwind v3 config.
   */
  exportTailwindV3(options = {}) {
    return exportTailwindV3(this.ast, { ...this.options, ...options });
  }

  /**
   * Export modern Tailwind v4 @theme CSS.
   */
  exportTailwindV4() {
    return exportTailwindV4(this.ast);
  }

  /**
   * Export grouped CSS variables stylesheet.
   */
  exportCssVariables(options = {}) {
    return exportCssVariables(this.ast, { ...this.options, ...options });
  }

  /**
   * Export W3C DTCG JSON.
   */
  exportW3CDtcgJson() {
    return exportW3CDtcgJson(this.ast);
  }

  /**
   * Export TypeScript declarations (.d.ts).
   */
  exportTypeScriptDeclarations() {
    return exportTypeScriptDeclarations(this.ast);
  }

  /**
   * Export complete bundle across all 5 targets.
   */
  exportBundle(options = {}) {
    return exportTokenBundle(this.ast, { ...this.options, ...options });
  }
}

/**
 * Compatibility helpers for unified token API
 */
export function extractCssVariablesMap(input) {
  const ast = normalizeTokenContractAST(input);
  const vars = {};
  for (const t of ast.tokens) {
    vars[t.name] = t.value;
  }
  return vars;
}

export function sanitizeTokenKey(name, section) {
  return sanitizeTailwindKey(name, section);
}

export function kebabToCamel(name) {
  return toTokenId(name);
}

export function inferTokenType(name, val) {
  return inferDtcgType(name, val, inferCategory(name, val));
}

// Master namespace object
export const CrossFrameworkTokenExporterEngine = CrossFrameworkTokenExporter;

// Global browser window attachment
if (isBrowser()) {
  const win = window;
  win.CrossFrameworkTokenExporter = CrossFrameworkTokenExporter;
  win.exportTailwindV3 = exportTailwindV3;
  win.exportTailwindV4 = exportTailwindV4;
  win.exportCssVariables = exportCssVariables;
  win.exportW3CDtcgJson = exportW3CDtcgJson;
  win.exportTypeScriptDeclarations = exportTypeScriptDeclarations;
  win.exportTokenBundle = exportTokenBundle;
}

export default CrossFrameworkTokenExporter;
