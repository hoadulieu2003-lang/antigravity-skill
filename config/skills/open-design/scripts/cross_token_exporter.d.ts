/**
 * ⚡ CROSS-FRAMEWORK TOKEN EXPORTER — TypeScript Type Definitions
 * ==============================================================
 * Complete type definitions for CrossFrameworkTokenExporter,
 * supporting Tailwind v3, Tailwind v4, CSS Variables, W3C DTCG JSON,
 * and strict TypeScript declarations.
 */

import type {
  LuminousThemeContract,
  PageAssemblySchema,
} from '../schema/round3_ast_contracts.js';

export type DtcgTokenType =
  | 'color'
  | 'dimension'
  | 'shadow'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | (string & {});

export type TokenCategory =
  | 'surfaces'
  | 'foregrounds'
  | 'borders'
  | 'accents'
  | 'semantics'
  | 'typography'
  | 'spacing'
  | 'elevation'
  | 'motion'
  | 'custom'
  | (string & {});

export type TokenLayer =
  | 'A1-identity'
  | 'A1-structure'
  | 'A2'
  | 'B-slot'
  | 'C-extension'
  | (string & {});

export interface StandardTokenSpec {
  readonly name: string;
  readonly category: TokenCategory;
  readonly type: DtcgTokenType;
  readonly layer: TokenLayer;
  readonly description: string;
  readonly fallback?: string;
  readonly aliasTo?: string;
  readonly dtcgPath?: string;
  readonly v4Prefix?: string;
}

export interface TokenNode {
  name: string;
  value: string;
  category?: TokenCategory;
  type?: DtcgTokenType;
  description?: string;
  aliasTo?: string;
  layer?: TokenLayer;
  dtcgPath?: string;
  v4Prefix?: string;
  keyframes?: Record<string, Record<string, string>>;
}

export interface TokenContractAST {
  tokens: TokenNode[];
  keyframes?: Record<string, Record<string, string>>;
  meta?: {
    name?: string;
    version?: string;
    brand?: string;
    description?: string;
    [key: string]: unknown;
  };
}

export interface TailwindConfigExport {
  theme: {
    extend: {
      colors: Record<string, any>;
      boxShadow: Record<string, string>;
      borderRadius: Record<string, string>;
      blur?: Record<string, string>;
      fontFamily?: Record<string, string[]>;
      fontSize?: Record<string, string>;
      lineHeight?: Record<string, string>;
      letterSpacing?: Record<string, string>;
      spacing?: Record<string, string>;
      keyframes?: Record<string, Record<string, string>>;
      animation?: Record<string, string>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  rawString: string;
}

export interface TailwindV4Export {
  themeVariables: Record<string, string>;
  rawCss: string;
}

export interface CssVariablesExport {
  rootVariables: Record<string, string>;
  rawCss: string;
}

export interface DtcgTokenNode {
  $value: string | number | Record<string, unknown>;
  $type: DtcgTokenType;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DtcgJsonExport {
  tokens: Record<string, any>;
  rawJson: string;
}

export interface TypeScriptTokensExport {
  tokens: Record<string, unknown>;
  rawTypeScript: string;
}

export interface TokenExportBundle {
  tailwindConfig: TailwindConfigExport;
  tailwindV4: TailwindV4Export;
  cssVariables: CssVariablesExport;
  dtcgJson: DtcgJsonExport;
  typescriptTokens: TypeScriptTokensExport;
  exportedAt: string;
  version: string;
  checksum?: string;
}

export interface ExporterOptions {
  format?: 'cjs' | 'esm';
  selector?: string;
  brandName?: string;
  minify?: boolean;
}

export declare const STANDARD_TOKEN_SCHEMA: readonly StandardTokenSpec[];
export declare const CATEGORY_ORDER: readonly string[];
export declare const DEFAULT_KEYFRAMES: Record<string, Record<string, string>>;
export declare const DEFAULT_ANIMATIONS: Record<string, string>;

export declare function isBrowser(): boolean;
export declare function normalizeTokenContractAST(input: unknown): TokenContractAST;
export declare function fromLuminousThemeContract(theme: LuminousThemeContract, schema?: Partial<PageAssemblySchema>): TokenContractAST;
export declare function parseCssToTokenContractAST(css: string): TokenContractAST;
export declare function buildInverseTokenMap(tokens: TokenNode[]): Map<string, string>;
export declare function resolveDtcgPointer(val: string, inverseMap: Map<string, string>): string;
export declare function sanitizeTailwindKey(tokenName: string, section: string): string;
export declare function sanitizeTokenKey(tokenName: string, section?: string): string;
export declare function kebabToCamel(name: string): string;
export declare function inferTokenType(name: string, val: string): string;
export declare function extractCssVariablesMap(input: unknown): Record<string, string>;
export declare function mapToTailwindV4VarName(token: TokenNode): string;
export declare function toTokenId(name: string): string;

export declare function exportTailwindV3(input: unknown, options?: ExporterOptions): TailwindConfigExport;
export declare function exportTailwindV4(input: unknown): TailwindV4Export;
export declare function exportCssVariables(input: unknown, options?: ExporterOptions): CssVariablesExport;
export declare function exportW3CDtcgJson(input: unknown): DtcgJsonExport;
export declare function exportTypeScriptDeclarations(input: unknown): TypeScriptTokensExport;
export declare function exportTokenBundle(input: unknown, options?: ExporterOptions): TokenExportBundle;

export declare class CrossFrameworkTokenExporter {
  options: ExporterOptions;
  ast: TokenContractAST;
  constructor(input?: unknown, options?: ExporterOptions);
  setTokens(input: unknown): void;
  exportTailwindV3(options?: ExporterOptions): TailwindConfigExport;
  exportTailwindV4(): TailwindV4Export;
  exportCssVariables(options?: ExporterOptions): CssVariablesExport;
  exportW3CDtcgJson(): DtcgJsonExport;
  exportTypeScriptDeclarations(): TypeScriptTokensExport;
  exportBundle(options?: ExporterOptions): TokenExportBundle;
}

export default CrossFrameworkTokenExporter;
