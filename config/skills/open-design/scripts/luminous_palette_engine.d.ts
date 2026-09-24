/**
 * ⚡ LUMINOUS PALETTE ENGINE — TypeScript Type Definitions
 * ========================================================
 * Contract types for Antigravity 2.0 Luminous Light Theme Color Engine.
 */

export interface OklchColor {
  l: number;
  c: number;
  h: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface LuminousSurfaces {
  canvas: string;
  canvasOklch: OklchColor;
  canvasY: number;
  card: string;
  cardAcrylic: string;
  cardBackdrop: string;
  cardY: number;
  subSurface: string;
  subSurfaceOklch: OklchColor;
  border: string;
  borderTranslucent: string;
  borderTranslucentOklch: string;
  borderDeltaL: number;
  insetHighlight: string;
  boxShadowInset: string;
  shadowAmbient: string;
  shadowKey: string;
  shadowCard: string;
}

export interface LuminousAccent {
  solid: string;
  solidFg: string;
  solidFgContrast: number;
  solidHover: string;
  solidActive: string;
  text: string;
  textOklch: OklchColor;
  textContrastOnCanvas: number;
  textContrastOnCard: number;
  textApcaOnCanvas: number;
  textApcaOnCard: number;
  textAAA: string;
  textAAAContrastOnCanvas: number;
  textAAAContrastOnCard: number;
  subtle: string;
  subtleBorder: string;
  subtleFg: string;
}

export interface LuminousNeutrals {
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderMuted: string;
  textPrimaryContrastOnCanvas: number;
  textSecondaryContrastOnCanvas: number;
  textMutedContrastOnCanvas: number;
}

export interface LuminousMetrics {
  canvasLuminance: number;
  cardLuminance: number;
  solidContrastFg: number;
  textContrastOnCanvas: number;
  textContrastOnCard: number;
  textApcaOnCanvas: number;
  textApcaOnCard: number;
  textAAAContrastOnCanvas: number;
  textAAAContrastOnCard: number;
  borderDeltaL: number;
}

export interface LuminousPalette {
  seed: {
    hex: string;
    rgb: RgbColor;
    oklch: OklchColor;
    luminance: number;
  };
  surfaces: LuminousSurfaces;
  accent: LuminousAccent;
  neutrals: LuminousNeutrals;
  metrics: LuminousMetrics;
  cssVariables: Record<string, string>;
}

export interface PaletteOptions {
  canvasPreset?: 'warm-paper' | 'warm_paper' | 'ivory' | 'alabaster' | 'titanium-ice' | 'titanium_ice';
  canvasHex?: string;
  insetOpacity?: number;
  targetRatio?: number;
  safetyBuffer?: number;
  bisectionIterations?: number;
  gamutIterations?: number;
  bendHue?: boolean;
  amberTargetHue?: number;
  prefix?: string;
  polarity?: 'light' | 'dark';
  mode?: 'light' | 'dark';
}

export interface CssVariablesOptions {
  prefix?: string;
  asObject?: boolean;
  selector?: string;
}

export interface AccessibleTextOptions {
  targetRatio?: number;
  seedHex?: string;
  safetyBuffer?: number;
  bisectionIterations?: number;
  bendHue?: boolean;
  amberTargetHue?: number;
  polarity?: 'light' | 'dark';
  mode?: 'light' | 'dark';
}

export declare function clamp(val: number, min: number, max: number): number;
export declare function isBrowser(): boolean;
export declare function parseHex(hex: string): [number, number, number];
export declare const parseColor: typeof parseHex;
export declare function rgbToHex(r: number, g: number, b: number): string;
export declare function srgbToLinear(c: number): number;
export declare function linearToSrgb(cLin: number): number;
export declare function getLinearLuminance(rLin: number, gLin: number, bLin: number): number;
export declare function hexToRelativeLuminance(hex: string): number;
export declare function getContrastRatio(colorA: string | number, colorB: string | number): number;
export declare function getApcaContrast(textHex: string, bgHex: string): number;
export declare function linearRgbToOklab(rLin: number, gLin: number, bLin: number): [number, number, number];
export declare function oklabToLinearRgb(L: number, a: number, b: number): [number, number, number];
export declare function oklabToOklch(L: number, a: number, b: number): OklchColor;
export declare function oklchToOklab(l: number, c: number, h: number): [number, number, number];
export declare function isInSrgbGamut(rLin: number, gLin: number, bLin: number, eps?: number): boolean;
export declare function hexToOklch(hex: string): OklchColor;
export declare function gamutMapOklch(L: number, C: number, h: number, maxIterations?: number): OklchColor;
export declare function oklchToHex(l: number, c: number, h: number, options?: PaletteOptions): string;
export declare function bendPerceptualHue(L: number, h: number, options?: PaletteOptions): number;
export declare function findAccessibleLightness(
  bgLuminances: number[],
  baseChroma: number,
  baseHue: number,
  options?: PaletteOptions
): { l: number; h: number; hex: string };
export declare function resolveAccessibleTextColor(bgHex: string, options?: AccessibleTextOptions): string;
export declare function generateLuminousSurfaces(seedOklch: OklchColor, options?: PaletteOptions): LuminousSurfaces;
export declare function generateLuminousAccent(seedHex: string, surfaces: LuminousSurfaces, options?: PaletteOptions): LuminousAccent;
export declare function generateLuminousNeutrals(seedOklch: OklchColor, surfaces: LuminousSurfaces, options?: PaletteOptions): LuminousNeutrals;
export declare function generateLuminousPalette(seedHex: string, options?: PaletteOptions): LuminousPalette;
export declare function getCssVariables(palette: LuminousPalette, options?: CssVariablesOptions): string | Record<string, string>;

export interface LuminousPaletteEngineInterface {
  version: string;
  generateLuminousPalette: typeof generateLuminousPalette;
  getCssVariables: typeof getCssVariables;
  resolveAccessibleTextColor: typeof resolveAccessibleTextColor;
  hexToOklch: typeof hexToOklch;
  oklchToHex: typeof oklchToHex;
  hexToRelativeLuminance: typeof hexToRelativeLuminance;
  getContrastRatio: typeof getContrastRatio;
  getApcaContrast: typeof getApcaContrast;
  gamutMapOklch: typeof gamutMapOklch;
  bendPerceptualHue: typeof bendPerceptualHue;
  findAccessibleLightness: typeof findAccessibleLightness;
  generateLuminousSurfaces: typeof generateLuminousSurfaces;
  generateLuminousAccent: typeof generateLuminousAccent;
  generateLuminousNeutrals: typeof generateLuminousNeutrals;
  parseHex: typeof parseHex;
  parseColor: typeof parseHex;
  rgbToHex: typeof rgbToHex;
  srgbToLinear: typeof srgbToLinear;
  linearToSrgb: typeof linearToSrgb;
  linearRgbToOklab: typeof linearRgbToOklab;
  oklabToLinearRgb: typeof oklabToLinearRgb;
  oklabToOklch: typeof oklabToOklch;
  oklchToOklab: typeof oklchToOklab;
}

export declare const LuminousPaletteEngine: LuminousPaletteEngineInterface;
export default LuminousPaletteEngine;
