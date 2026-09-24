/**
 * ⚡ STRICT SANITIZATION PIPELINE & SAFE DOM ASSEMBLER — TypeScript Definitions
 * ==============================================================================
 * Contracts and type signatures for the Antigravity 2.0 Security Barrier.
 */

export interface SafeStyleSanitizerModule {
  SAFE_CSS_PROPERTIES: ReadonlySet<string>;
  isSafeCssProperty(prop: string): boolean;
  clampZIndex(val: unknown): string;
  sanitizeStyleValue(prop: string, val: unknown): string | null;
  sanitizeStyleObject(styles: Record<string, unknown>): Record<string, string>;
  applySafeStyles(element: any, styles: Record<string, unknown>): void;
}

export interface ShadowMountResult {
  shadowRoot: any;
  host: any;
}

export interface ShadowMountOptions {
  styles?: string;
}

export interface SafeDOMAssemblerModule {
  readonly DOM_CLOBBERING_PREFIX: string;
  scopeIdentifier(idOrName: unknown): string;
  unscopeIdentifier(scopedId: unknown): string;
  sanitizeHtml(html: string, options?: { allowStyles?: boolean }): string;
  parseHtmlToElements(html: string): any[];
  createSafeElement(tagName: string): any;
  mountInShadowRoot(hostElement: any, content: string | any, options?: ShadowMountOptions): ShadowMountResult;
}

export interface SafeSchemaMergerModule {
  safeMerge<T = Record<string, any>>(...sources: any[]): T;
  safeDeepMerge<T = Record<string, any>>(...sources: any[]): T;
  isPlainObject(val: unknown): val is Record<string, any>;
}

export interface ContractFreezerModule {
  deepFreeze<T>(obj: T, visited?: WeakSet<object>): Readonly<T>;
  isPlainObject(val: unknown): val is Record<string, any>;
  isDomNode(val: unknown): boolean;
  isWindow(val: unknown): boolean;
}

export declare const SAFE_CSS_PROPERTIES: ReadonlySet<string>;
export declare function isSafeCssProperty(prop: string): boolean;
export declare function clampZIndex(val: unknown): string;
export declare function sanitizeStyleValue(prop: string, val: unknown): string | null;
export declare function sanitizeStyleObject(styles: Record<string, unknown>): Record<string, string>;
export declare function applySafeStyles(element: any, styles: Record<string, unknown>): void;

export declare const SafeStyleSanitizer: SafeStyleSanitizerModule;

export declare const DOM_CLOBBERING_PREFIX: string;
export declare function scopeIdentifier(idOrName: unknown): string;
export declare function unscopeIdentifier(scopedId: unknown): string;
export declare function sanitizeHtml(html: string, options?: { allowStyles?: boolean }): string;
export declare function parseHtmlToElements(html: string): any[];
export declare function createSafeElement(tagName: string): any;
export declare function mountInShadowRoot(hostElement: any, content: string | any, options?: ShadowMountOptions): ShadowMountResult;

export declare const SafeDOMAssembler: SafeDOMAssemblerModule;

export declare function safeMerge<T = Record<string, any>>(...sources: any[]): T;
export declare function safeDeepMerge<T = Record<string, any>>(...sources: any[]): T;

export declare const SafeSchemaMerger: SafeSchemaMergerModule;

export declare function deepFreeze<T>(obj: T, visited?: WeakSet<object>): Readonly<T>;

export declare const ContractFreezer: ContractFreezerModule;

export declare function isBrowser(): boolean;
export declare function isPlainObject(val: unknown): val is Record<string, any>;
export declare function isDomNode(val: unknown): boolean;
export declare function isWindow(val: unknown): boolean;
export declare function toKebabCase(str: string): string;
export declare function escapeHtml(raw: unknown): string;
export declare function sanitizeUrl(rawUrl: unknown, fallback?: string): string;

export interface StrictSanitizerNamespace {
  readonly version: string;
  SafeStyleSanitizer: SafeStyleSanitizerModule;
  SAFE_CSS_PROPERTIES: ReadonlySet<string>;
  isSafeCssProperty: typeof isSafeCssProperty;
  clampZIndex: typeof clampZIndex;
  sanitizeStyleValue: typeof sanitizeStyleValue;
  sanitizeStyleObject: typeof sanitizeStyleObject;
  applySafeStyles: typeof applySafeStyles;
  SafeDOMAssembler: SafeDOMAssemblerModule;
  DOM_CLOBBERING_PREFIX: string;
  scopeIdentifier: typeof scopeIdentifier;
  unscopeIdentifier: typeof unscopeIdentifier;
  sanitizeHtml: typeof sanitizeHtml;
  parseHtmlToElements: typeof parseHtmlToElements;
  createSafeElement: typeof createSafeElement;
  mountInShadowRoot: typeof mountInShadowRoot;
  SafeSchemaMerger: SafeSchemaMergerModule;
  safeMerge: typeof safeMerge;
  safeDeepMerge: typeof safeDeepMerge;
  ContractFreezer: ContractFreezerModule;
  deepFreeze: typeof deepFreeze;
  isBrowser: typeof isBrowser;
  isPlainObject: typeof isPlainObject;
  isDomNode: typeof isDomNode;
  isWindow: typeof isWindow;
  toKebabCase: typeof toKebabCase;
  escapeHtml: typeof escapeHtml;
  sanitizeUrl: typeof sanitizeUrl;
}

export declare const StrictSanitizer: StrictSanitizerNamespace;
export default StrictSanitizer;
