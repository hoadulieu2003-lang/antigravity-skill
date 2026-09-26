/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: DURABLE RUNTIME ENGINE
 * 
 * Module lõi phục vụ Event Sourcing, Crash Recovery & Durable AI Agent Sessions
 * Tuân thủ nghiêm ngặt chuẩn kiến trúc:
 * - vincemakes/kiso: Event-sourced sessions, durable approvals, crash window uncertainty resolution.
 * - arXiv:2609.26891 (JAZ): Harness as a Language, inspectable state transitions & deterministic replay.
 * 
 * Chủ quản: Anh (Lead Architect)
 * Tác tử phụ trách: Pod 1 (Durable Runtime Architect)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// 1. PHÂN LOẠI & ĐỊNH NGHĨA SỰ KIỆN (Event Types & State Definitions)
// ============================================================================

export type EventType =
  | 'SessionStarted'
  | 'AgentDecided'
  | 'ToolRequested'
  | 'HumanApproved'
  | 'HumanRejected'
  | 'ToolExecuted'
  | 'SnapshotCreated'
  | 'RecoveryResolved'
  | 'SessionCompleted'
  | 'SessionFailed';

export type SessionStatus =
  | 'INITIALIZING'
  | 'READY'
  | 'REASONING'
  | 'AWAITING_HUMAN_APPROVAL'
  | 'EXECUTING_TOOL'
  | 'AWAITING_RECOVERY_DECISION'
  | 'COMPLETED'
  | 'FAILED';

export interface SessionStartedPayload {
  readonly sessionId: string;
  readonly initialGoal: string;
  readonly actor: string;
  readonly modelId: string;
  readonly configuration: {
    readonly snapshotFrequency: number;
    readonly requireApprovalForSideEffects: boolean;
    readonly allowedTools: readonly string[];
  };
}

export interface AgentDecidedPayload {
  readonly turnId: number;
  readonly reasoningTokens?: number;
  readonly thoughtSummary: string;
  readonly intent: string;
  readonly proposedAction: 'INVOKE_TOOL' | 'REQUEST_USER_INPUT' | 'FINISH_TASK';
  readonly modelMetadata?: {
    readonly modelName: string;
    readonly testTimeComputeMs?: number;
  };
}

export interface ToolRequestedPayload {
  readonly callId: string;
  readonly toolName: string;
  readonly arguments: Record<string, unknown>;
  readonly isSideEffecting: boolean;
  readonly idempotencyKey: string;
}

export interface HumanApprovedPayload {
  readonly callId: string;
  readonly approvedBy: string;
  readonly decision: 'APPROVED' | 'MODIFIED';
  readonly feedbackNotes?: string;
  readonly modifiedArguments?: Record<string, unknown>;
}

export interface HumanRejectedPayload {
  readonly callId: string;
  readonly rejectedBy: string;
  readonly reason: string;
}

export interface ToolExecutedPayload {
  readonly callId: string;
  readonly toolName: string;
  readonly status: 'SUCCESS' | 'ERROR';
  readonly output: unknown;
  readonly errorDetails?: {
    readonly code: string;
    readonly message: string;
    readonly stackTrace?: string;
  };
  readonly durationMs: number;
}

export interface SnapshotCreatedPayload {
  readonly snapshotId: string;
  readonly upToSeq: number;
  readonly stateHash: string;
  readonly materializedState: SessionMaterializedState;
}

export interface RecoveryResolvedPayload {
  readonly unresolvedCallId: string;
  readonly resolutionStrategy: 'RETRY' | 'ABANDON' | 'MANUAL_INTERVENTION_ACKNOWLEDGED';
  readonly resolvedBy: string;
  readonly rationale: string;
}

export interface SessionCompletedPayload {
  readonly finalOutput: string;
  readonly totalTurns: number;
  readonly totalDurationMs: number;
}

export interface SessionFailedPayload {
  readonly fatalError: string;
  readonly seqAtFailure: number;
}

export type EventPayloadMap = {
  SessionStarted: SessionStartedPayload;
  AgentDecided: AgentDecidedPayload;
  ToolRequested: ToolRequestedPayload;
  HumanApproved: HumanApprovedPayload;
  HumanRejected: HumanRejectedPayload;
  ToolExecuted: ToolExecutedPayload;
  SnapshotCreated: SnapshotCreatedPayload;
  RecoveryResolved: RecoveryResolvedPayload;
  SessionCompleted: SessionCompletedPayload;
  SessionFailed: SessionFailedPayload;
};

export interface JournalEvent<TType extends EventType = EventType> {
  readonly id: string;
  readonly sessionId: string;
  readonly seq: number;
  readonly timestamp: string;
  readonly type: TType;
  readonly payload: EventPayloadMap[TType];
  readonly metadata: {
    readonly agentVersion: string;
    readonly environment: string;
    readonly traceId: string;
  };
  readonly previousHash: string;
  readonly eventHash: string;
}

export interface PendingToolCall {
  readonly callId: string;
  readonly toolName: string;
  readonly arguments: Record<string, unknown>;
  readonly isSideEffecting: boolean;
  readonly idempotencyKey: string;
  readonly requestedAtSeq: number;
  readonly approvalStatus: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
}

export interface InFlightUncertainCall {
  readonly callId: string;
  readonly toolName: string;
  readonly arguments: Record<string, unknown>;
  readonly isSideEffecting: boolean;
  readonly requestedAtSeq: number;
  readonly detectionReason: string;
}

export interface SessionMaterializedState {
  readonly sessionId: string;
  readonly currentSeq: number;
  readonly status: SessionStatus;
  readonly goal: string;
  readonly lastTurnId: number;
  readonly pendingToolCalls: Record<string, PendingToolCall>;
  readonly uncertainCalls: Record<string, InFlightUncertainCall>;
  readonly executionHistory: Array<{
    readonly callId: string;
    readonly toolName: string;
    readonly status: 'SUCCESS' | 'ERROR';
    readonly output: unknown;
  }>;
  readonly snapshotCount: number;
  readonly lastSnapshotSeq: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ============================================================================
// 2. GIAO DIỆN & HIỆN THỰC HÓA BỘ LƯU TRỮ NHẬT KÝ (Storage Adapter)
// ============================================================================

export interface ISessionJournalStorage {
  append(event: JournalEvent): Promise<void>;
  readEvents(sessionId: string, fromSeq?: number, toSeq?: number): Promise<JournalEvent[]>;
  saveSnapshot(snapshot: {
    readonly sessionId: string;
    readonly upToSeq: number;
    readonly state: SessionMaterializedState;
    readonly timestamp: string;
  }): Promise<void>;
  getLatestSnapshot(sessionId: string): Promise<{
    readonly sessionId: string;
    readonly upToSeq: number;
    readonly state: SessionMaterializedState;
    readonly timestamp: string;
  } | null>;
  getEventCount(sessionId: string): Promise<number>;
}

export class FileJournalStorage implements ISessionJournalStorage {
  private readonly baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getJournalPath(sessionId: string): string {
    return path.join(this.baseDir, `session_${sessionId}.events.jsonl`);
  }

  private getSnapshotPath(sessionId: string): string {
    return path.join(this.baseDir, `session_${sessionId}.snapshots.jsonl`);
  }

  async append(event: JournalEvent): Promise<void> {
    const filePath = this.getJournalPath(event.sessionId);
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(filePath, line, 'utf-8');
  }

  async readEvents(sessionId: string, fromSeq: number = 1, toSeq?: number): Promise<JournalEvent[]> {
    const filePath = this.getJournalPath(sessionId);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    const events: JournalEvent[] = [];

    for (const line of lines) {
      const event: JournalEvent = JSON.parse(line);
      if (event.seq >= fromSeq && (toSeq === undefined || event.seq <= toSeq)) {
        events.push(event);
      }
    }

    return events;
  }

  async saveSnapshot(snapshot: {
    readonly sessionId: string;
    readonly upToSeq: number;
    readonly state: SessionMaterializedState;
    readonly timestamp: string;
  }): Promise<void> {
    const filePath = this.getSnapshotPath(snapshot.sessionId);
    const line = JSON.stringify(snapshot) + '\n';
    fs.appendFileSync(filePath, line, 'utf-8');
  }

  async getLatestSnapshot(sessionId: string): Promise<{
    readonly sessionId: string;
    readonly upToSeq: number;
    readonly state: SessionMaterializedState;
    readonly timestamp: string;
  } | null> {
    const filePath = this.getSnapshotPath(sessionId);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    if (lines.length === 0) return null;

    const lastLine = lines[lines.length - 1];
    return JSON.parse(lastLine);
  }

  async getEventCount(sessionId: string): Promise<number> {
    const filePath = this.getJournalPath(sessionId);
    if (!fs.existsSync(filePath)) return 0;
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    return lines.length;
  }
}

// ============================================================================
// 3. SUY DIỄN TRẠNG THÁI TẤT ĐỊNH & KIỂM TOÁN CHUỖI BĂM (Deterministic Reducer)
// ============================================================================

export class StateReducer {
  static createInitialState(sessionId: string): SessionMaterializedState {
    const now = new Date().toISOString();
    return {
      sessionId,
      currentSeq: 0,
      status: 'INITIALIZING',
      goal: '',
      lastTurnId: 0,
      pendingToolCalls: {},
      uncertainCalls: {},
      executionHistory: [],
      snapshotCount: 0,
      lastSnapshotSeq: 0,
      createdAt: now,
      updatedAt: now,
    };
  }

  static applyEvent(
    state: SessionMaterializedState,
    event: JournalEvent
  ): SessionMaterializedState {
    const next: SessionMaterializedState = {
      ...state,
      currentSeq: event.seq,
      updatedAt: event.timestamp,
      pendingToolCalls: { ...state.pendingToolCalls },
      uncertainCalls: { ...state.uncertainCalls },
      executionHistory: [...state.executionHistory],
    };

    switch (event.type) {
      case 'SessionStarted': {
        const payload = event.payload as SessionStartedPayload;
        return {
          ...next,
          status: 'READY',
          goal: payload.initialGoal,
        };
      }

      case 'AgentDecided': {
        const payload = event.payload as AgentDecidedPayload;
        return {
          ...next,
          lastTurnId: payload.turnId,
          status: payload.proposedAction === 'REQUEST_USER_INPUT'
            ? 'AWAITING_HUMAN_APPROVAL'
            : 'REASONING',
        };
      }

      case 'ToolRequested': {
        const payload = event.payload as ToolRequestedPayload;
        const pendingCall: PendingToolCall = {
          callId: payload.callId,
          toolName: payload.toolName,
          arguments: payload.arguments,
          isSideEffecting: payload.isSideEffecting,
          idempotencyKey: payload.idempotencyKey,
          requestedAtSeq: event.seq,
          approvalStatus: payload.isSideEffecting ? 'PENDING_APPROVAL' : 'NOT_REQUIRED',
        };

        next.pendingToolCalls[payload.callId] = pendingCall;
        return {
          ...next,
          status: payload.isSideEffecting ? 'AWAITING_HUMAN_APPROVAL' : 'EXECUTING_TOOL',
        };
      }

      case 'HumanApproved': {
        const payload = event.payload as HumanApprovedPayload;
        if (next.pendingToolCalls[payload.callId]) {
          const call = next.pendingToolCalls[payload.callId];
          next.pendingToolCalls[payload.callId] = {
            ...call,
            approvalStatus: 'APPROVED',
            arguments: payload.modifiedArguments || call.arguments,
          };
        }
        return {
          ...next,
          status: 'EXECUTING_TOOL',
        };
      }

      case 'HumanRejected': {
        const payload = event.payload as HumanRejectedPayload;
        if (next.pendingToolCalls[payload.callId]) {
          const call = next.pendingToolCalls[payload.callId];
          next.pendingToolCalls[payload.callId] = {
            ...call,
            approvalStatus: 'REJECTED',
          };
        }
        return {
          ...next,
          status: 'READY',
        };
      }

      case 'ToolExecuted': {
        const payload = event.payload as ToolExecutedPayload;
        delete next.pendingToolCalls[payload.callId];
        delete next.uncertainCalls[payload.callId];

        next.executionHistory.push({
          callId: payload.callId,
          toolName: payload.toolName,
          status: payload.status,
          output: payload.output,
        });

        return {
          ...next,
          status: 'READY',
        };
      }

      case 'SnapshotCreated': {
        const payload = event.payload as SnapshotCreatedPayload;
        return {
          ...next,
          snapshotCount: next.snapshotCount + 1,
          lastSnapshotSeq: payload.upToSeq,
        };
      }

      case 'RecoveryResolved': {
        const payload = event.payload as RecoveryResolvedPayload;
        delete next.uncertainCalls[payload.unresolvedCallId];
        delete next.pendingToolCalls[payload.unresolvedCallId];

        return {
          ...next,
          status: Object.keys(next.uncertainCalls).length === 0 ? 'READY' : 'AWAITING_RECOVERY_DECISION',
        };
      }

      case 'SessionCompleted': {
        return {
          ...next,
          status: 'COMPLETED',
        };
      }

      case 'SessionFailed': {
        return {
          ...next,
          status: 'FAILED',
        };
      }

      default:
        return next;
    }
  }

  static computeEventHash(
    sessionId: string,
    seq: number,
    type: string,
    payload: unknown,
    previousHash: string
  ): string {
    const payloadStr = JSON.stringify(payload);
    const content = `${sessionId}:${seq}:${type}:${payloadStr}:${previousHash}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

// ============================================================================
// 4. ĐỘNG CƠ THỰC THI SẢN XUẤT (DurableRuntimeEngine)
// ============================================================================

export interface RuntimeConfig {
  snapshotInterval: number;
  agentVersion: string;
  environment: string;
}

export class DurableRuntimeEngine {
  private readonly storage: ISessionJournalStorage;
  private readonly config: RuntimeConfig;
  private state: SessionMaterializedState;
  private lastEventHash: string = '0000000000000000000000000000000000000000000000000000000000000000';

  constructor(storage: ISessionJournalStorage, config?: Partial<RuntimeConfig>) {
    this.storage = storage;
    this.config = {
      snapshotInterval: config?.snapshotInterval ?? 4,
      agentVersion: config?.agentVersion ?? '2.0.0-enterprise',
      environment: config?.environment ?? 'production',
    };
    this.state = StateReducer.createInitialState('');
  }

  getState(): SessionMaterializedState {
    return JSON.parse(JSON.stringify(this.state));
  }

  async commitEvent<TType extends EventType>(
    sessionId: string,
    type: TType,
    payload: unknown
  ): Promise<JournalEvent<TType>> {
    const seq = this.state.currentSeq + 1;
    const timestamp = new Date().toISOString();
    const id = `evt_${sessionId}_${seq}_${Date.now()}`;
    const previousHash = this.lastEventHash;
    const eventHash = StateReducer.computeEventHash(sessionId, seq, type, payload, previousHash);

    const event: JournalEvent<TType> = {
      id,
      sessionId,
      seq,
      timestamp,
      type,
      payload: payload as any,
      metadata: {
        agentVersion: this.config.agentVersion,
        environment: this.config.environment,
        traceId: `tr_${sessionId}_${seq}`,
      },
      previousHash,
      eventHash,
    };

    // 1. Write Ahead Log (WAL)
    await this.storage.append(event);
    this.lastEventHash = eventHash;

    // 2. Pure state projection
    this.state = StateReducer.applyEvent(this.state, event);

    // 3. Periodic Compaction / Snapshotting
    if (this.state.currentSeq - this.state.lastSnapshotSeq >= this.config.snapshotInterval) {
      await this.triggerSnapshot(sessionId);
    }

    return event;
  }

  async triggerSnapshot(sessionId: string): Promise<void> {
    const upToSeq = this.state.currentSeq;
    const snapshotId = `snp_${sessionId}_${upToSeq}`;
    const stateCopy = this.getState();
    const stateHash = crypto.createHash('sha256').update(JSON.stringify(stateCopy)).digest('hex');

    const snapshotPayload: SnapshotCreatedPayload = {
      snapshotId,
      upToSeq,
      stateHash,
      materializedState: stateCopy,
    };

    await this.commitEvent(sessionId, 'SnapshotCreated', snapshotPayload);

    await this.storage.saveSnapshot({
      sessionId,
      upToSeq,
      state: stateCopy,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Khôi phục phiên làm việc sau sự cố (Cold Recovery & Crash Window Audit)
   */
  async recover(sessionId: string): Promise<{
    recoveredState: SessionMaterializedState;
    eventsReplayed: number;
    snapshotUsed: boolean;
    uncertainCallsCount: number;
  }> {
    const latestSnapshot = await this.storage.getLatestSnapshot(sessionId);
    let startSeq = 1;
    let baseState: SessionMaterializedState;
    let snapshotUsed = false;

    if (latestSnapshot) {
      baseState = latestSnapshot.state;
      startSeq = latestSnapshot.upToSeq + 1;
      snapshotUsed = true;
    } else {
      baseState = StateReducer.createInitialState(sessionId);
    }

    const events = await this.storage.readEvents(sessionId, startSeq);
    let currentState = baseState;
    let prevHash = latestSnapshot ? '0000000000000000000000000000000000000000000000000000000000000000' : '0000000000000000000000000000000000000000000000000000000000000000';

    for (const event of events) {
      prevHash = event.eventHash;
      currentState = StateReducer.applyEvent(currentState, event);
    }

    this.lastEventHash = prevHash;

    // Quét phát hiện crash window
    const pendingCalls = Object.values(currentState.pendingToolCalls);
    const uncertainMap: Record<string, InFlightUncertainCall> = {};

    for (const call of pendingCalls) {
      uncertainMap[call.callId] = {
        callId: call.callId,
        toolName: call.toolName,
        arguments: call.arguments,
        isSideEffecting: call.isSideEffecting,
        requestedAtSeq: call.requestedAtSeq,
        detectionReason: `Crash detected: Tool ${call.toolName} (callId: ${call.callId}) was pending execution before process termination.`,
      };
    }

    if (Object.keys(uncertainMap).length > 0) {
      currentState = {
        ...currentState,
        uncertainCalls: uncertainMap,
        status: 'AWAITING_RECOVERY_DECISION',
      };
    }

    this.state = currentState;

    return {
      recoveredState: this.getState(),
      eventsReplayed: events.length,
      snapshotUsed,
      uncertainCallsCount: Object.keys(uncertainMap).length,
    };
  }

  /**
   * Giải quyết quyết định phục hồi từ con người
   */
  async resolveRecovery(
    sessionId: string,
    unresolvedCallId: string,
    strategy: 'RETRY' | 'ABANDON' | 'MANUAL_INTERVENTION_ACKNOWLEDGED',
    resolvedBy: string,
    rationale: string
  ): Promise<void> {
    await this.commitEvent(sessionId, 'RecoveryResolved', {
      unresolvedCallId,
      resolutionStrategy: strategy,
      resolvedBy,
      rationale,
    });
  }
}
