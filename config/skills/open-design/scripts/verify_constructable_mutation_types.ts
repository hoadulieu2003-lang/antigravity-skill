/**
 * Verification of ConstructableMutationEngine TypeScript Types
 */

import {
  ConstructableMutation,
  ConstructableMutationEngine,
  LayoutPhaseCoordinator,
  TokenSyncCoordinator,
  DirtyBufferPool,
  DirtyEntry,
  createConstructableMutationSystem,
  hasAdoptedStyleSheetsSupport,
  isBrowser,
  type TokenChangeEvent,
  type MutationSpec,
  type SyncSource,
  type LayoutPhase,
} from './constructable_mutation.js';

// Verify Type Contracts
const source: SyncSource = 'SLIDER';
const phase: LayoutPhase = 'READ';

const event: TokenChangeEvent<string> = {
  tokenKey: '--color-accent',
  value: '#3b82f6',
  previousValue: '#ffffff',
  source,
  timestamp: Date.now(),
  metadata: { selector: ':root', priority: 'important' },
};

const mutation: MutationSpec = {
  selector: ':root',
  property: '--space-4',
  value: '16px',
};

// Verify Classes
const pool = new DirtyBufferPool();
pool.set(':root', '--font-sans', 'Inter, sans-serif');
const hasDirty: boolean = pool.hasDirty();
pool.clear();

const coordinator = new LayoutPhaseCoordinator();
const readId: number = coordinator.scheduleRead(() => {
  const current: LayoutPhase = coordinator.currentPhase;
}, 10);
const writeId: number = coordinator.scheduleWrite(() => {
  // write
}, 5);
const canceled: boolean = coordinator.cancel(readId);
coordinator.flush();

const engine = new ConstructableMutationEngine({
  defaultSelector: ':root',
  coordinator,
});
const supported: boolean = engine.isAdoptedStyleSheetsSupported();
engine.scheduleMutation(':root', '--bg', '#ffffff');
engine.mutateImmediate(':root', '--fg', '#000000');
engine.batchMutate([mutation]);
const flushed: number = engine.flush();
engine.dispose();

const tokenSync = new TokenSyncCoordinator({
  mutationEngine: engine,
  astDebounceMs: 50,
  initialTokens: { '--brand': '#6366f1' },
});
const val: any = tokenSync.getToken('--brand');
const all: Record<string, any> = tokenSync.getAllTokens();
const unsub = tokenSync.subscribe((e: TokenChangeEvent) => {
  const key: string = e.tokenKey;
});
tokenSync.dispatchFromSlider('--brand', '#4f46e5');
tokenSync.dispatchFromCodeEditor('--brand', '#4338ca');
tokenSync.dispatchFromAstSync({ '--brand': '#3730a3' });
const blocked: boolean = tokenSync.isSourceBlocked('SLIDER');
tokenSync.runTransaction('API', () => {
  // transaction
});
tokenSync.dispose();

const system = createConstructableMutationSystem({
  defaultSelector: ':root',
  astDebounceMs: 50,
});
system.tokenSync.dispatchFromSlider('--test', '123');
system.dispose();

console.log('✓ All ConstructableMutation TypeScript types verified successfully.');
