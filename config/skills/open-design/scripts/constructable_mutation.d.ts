/**
 * ⚡ CONSTRUCTABLE MUTATION ENGINE & FASTDOM PHASE SCHEDULER
 * ==========================================================
 * TypeScript type definitions for ConstructableMutationEngine,
 * LayoutPhaseCoordinator, and TokenSyncCoordinator.
 */

export type SyncSource = 'SLIDER' | 'CODE_EDITOR' | 'AST_SYNC' | 'API' | string;
export type LayoutPhase = 'IDLE' | 'READ' | 'WRITE';

export interface TokenChangeEvent<T = any> {
  tokenKey: string;
  value: T;
  previousValue: T;
  source: SyncSource;
  timestamp: number;
  metadata?: {
    selector?: string;
    priority?: string;
    unit?: string;
    immediate?: boolean;
    [key: string]: any;
  };
}

export interface MutationSpec {
  selector?: string;
  element?: any;
  property: string;
  value: string;
  priority?: string;
}

export interface ConstructableMutationOptions {
  scope?: any;
  styleSheetId?: string;
  autoAdopt?: boolean;
  defaultSelector?: string;
  coordinator?: LayoutPhaseCoordinator;
}

export interface LayoutIsolationOptions {
  containment?: string;
}

export interface TokenSyncOptions {
  mutationEngine?: ConstructableMutationEngine;
  astDebounceMs?: number;
  initialTokens?: Record<string, any>;
}

export interface ConstructableSystemOptions extends ConstructableMutationOptions, TokenSyncOptions {}

export interface ConstructableSystemResult {
  mutationEngine: ConstructableMutationEngine;
  coordinator: LayoutPhaseCoordinator;
  tokenSync: TokenSyncCoordinator;
  dispose: () => void;
}

/**
 * Reusable zero-GC dirty entry for coalesced mutations.
 */
export declare class DirtyEntry {
  value: string;
  priority: string;
  isDirty: boolean;
  constructor();
  set(value: string, priority?: string): void;
  clear(): void;
}

/**
 * Reusable dirty buffer pool maintaining capacity without reallocations.
 */
export declare class DirtyBufferPool {
  buffer: Map<string, Map<string, DirtyEntry>>;
  dirtyCount: number;
  constructor();
  set(selector: string, property: string, value: string, priority?: string): void;
  hasDirty(): boolean;
  resetDirtyFlags(): void;
  clear(): void;
}

/**
 * ConstructableMutationEngine provides direct, high-throughput CSSOM updates
 * via CSSStyleSheet() and adoptedStyleSheets when supported, with rAF coalescing.
 */
export declare class ConstructableMutationEngine {
  scope: any;
  styleSheetId: string;
  autoAdopt: boolean;
  defaultSelector: string;
  coordinator: LayoutPhaseCoordinator | null;
  styleSheet: any;
  ruleMap: Map<string, any>;
  fallbackStyleElement: any;
  dirtyBuffer: DirtyBufferPool;
  elementDirtyBuffer: Map<any, Map<string, DirtyEntry>>;
  elementDirtyCount: number;

  constructor(options?: ConstructableMutationOptions);
  isAdoptedStyleSheetsSupported(): boolean;
  getOrCreateRule(selector?: string): any;
  mutateImmediate(selector: string, property: string, value: string, priority?: string): void;
  mutateElementImmediate(element: any, property: string, value: string, priority?: string): void;
  scheduleMutation(selector: string, property: string, value: string, priority?: string): void;
  scheduleElementMutation(element: any, property: string, value: string, priority?: string): void;
  batchMutate(mutations: MutationSpec[]): void;
  flush(): number;
  dispose(): void;
}

/**
 * FastDOM Two-Phase Layout Coordinator separating Reads from Writes.
 */
export declare class LayoutPhaseCoordinator {
  readQueue: Array<{ id: number; fn: Function; priority: number }>;
  writeQueue: Array<{ id: number; fn: Function; priority: number }>;
  currentPhase: LayoutPhase;
  isFlushing: boolean;

  constructor();
  scheduleRead(taskFn: () => void, priority?: number): number;
  scheduleWrite(taskFn: () => void, priority?: number): number;
  cancel(taskId: number): boolean;
  flush(): void;
  isolateElement(element: any, options?: LayoutIsolationOptions): () => void;
  restoreElement(element: any): void;
  dispose(): void;
}

/**
 * Bidirectional Token Synchronizer with 60 FPS CSSOM + 50ms debounced AST Store
 * and Transaction Reentrancy Lock.
 */
export declare class TokenSyncCoordinator {
  mutationEngine: ConstructableMutationEngine | null;
  astDebounceMs: number;
  tokenStore: Map<string, any>;
  isLocked: boolean;
  activeSource: SyncSource | null;
  reentrancyDepth: number;
  maxReentrancyDepth: number;

  constructor(options?: TokenSyncOptions);
  getToken(key: string): any;
  getAllTokens(): Record<string, any>;
  isSourceBlocked(source: SyncSource, tokenKey?: string): boolean;
  subscribe(callback: (event: TokenChangeEvent) => void): () => void;
  subscribeToToken(tokenKey: string, callback: (event: TokenChangeEvent) => void): () => void;
  dispatchFromSlider(tokenKey: string, value: any, metadata?: Record<string, any>): void;
  dispatchFromCodeEditor(tokenKey: string, value: any, metadata?: Record<string, any>): void;
  dispatchFromAstSync(tokenKeyOrMap: Record<string, any> | string, value?: any, metadata?: Record<string, any>): void;
  runTransaction(source: SyncSource, action: () => void): void;
  flushDebounced(): void;
  dispose(): void;
}

export declare function isBrowser(): boolean;
export declare function requestFrame(callback: (time: number) => void): any;
export declare function cancelFrame(id: any): void;
export declare function hasAdoptedStyleSheetsSupport(targetScope?: any): boolean;
export declare function createConstructableMutationSystem(options?: ConstructableSystemOptions): ConstructableSystemResult;

export declare const ConstructableMutation: {
  version: string;
  ConstructableMutationEngine: typeof ConstructableMutationEngine;
  LayoutPhaseCoordinator: typeof LayoutPhaseCoordinator;
  TokenSyncCoordinator: typeof TokenSyncCoordinator;
  DirtyBufferPool: typeof DirtyBufferPool;
  DirtyEntry: typeof DirtyEntry;
  createConstructableMutationSystem: typeof createConstructableMutationSystem;
  hasAdoptedStyleSheetsSupport: typeof hasAdoptedStyleSheetsSupport;
  requestFrame: typeof requestFrame;
  cancelFrame: typeof cancelFrame;
  isBrowser: typeof isBrowser;
};

export default ConstructableMutation;

declare global {
  interface Window {
    ConstructableMutation?: typeof ConstructableMutation;
    ConstructableMutationEngine?: typeof ConstructableMutationEngine;
    LayoutPhaseCoordinator?: typeof LayoutPhaseCoordinator;
    TokenSyncCoordinator?: typeof TokenSyncCoordinator;
    createConstructableMutationSystem?: typeof createConstructableMutationSystem;
  }
}
