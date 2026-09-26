/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: DURABLE RUNTIME ENGINE (CommonJS / Node.js Runtime Build)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// 1. FILE-SYSTEM APPEND-ONLY JOURNAL STORAGE ADAPTER
// ============================================================================

class FileJournalStorage {
  constructor(baseDir) {
    this.baseDir = baseDir;
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  getJournalPath(sessionId) {
    return path.join(this.baseDir, `session_${sessionId}.events.jsonl`);
  }

  getSnapshotPath(sessionId) {
    return path.join(this.baseDir, `session_${sessionId}.snapshots.jsonl`);
  }

  async append(event) {
    const filePath = this.getJournalPath(event.sessionId);
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(filePath, line, 'utf-8');
  }

  async readEvents(sessionId, fromSeq = 1, toSeq) {
    const filePath = this.getJournalPath(sessionId);
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    const events = [];

    for (const line of lines) {
      const event = JSON.parse(line);
      if (event.seq >= fromSeq && (toSeq === undefined || event.seq <= toSeq)) {
        events.push(event);
      }
    }

    return events;
  }

  async saveSnapshot(snapshot) {
    const filePath = this.getSnapshotPath(snapshot.sessionId);
    const line = JSON.stringify(snapshot) + '\n';
    fs.appendFileSync(filePath, line, 'utf-8');
  }

  async getLatestSnapshot(sessionId) {
    const filePath = this.getSnapshotPath(sessionId);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    if (lines.length === 0) return null;

    const lastLine = lines[lines.length - 1];
    return JSON.parse(lastLine);
  }

  async getEventCount(sessionId) {
    const filePath = this.getJournalPath(sessionId);
    if (!fs.existsSync(filePath)) return 0;
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n').filter(Boolean);
    return lines.length;
  }
}

// ============================================================================
// 2. SUY DIỄN TRẠNG THÁI TẤT ĐỊNH & KIỂM TOÁN CHUỖI BĂM
// ============================================================================

class StateReducer {
  static createInitialState(sessionId) {
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

  static applyEvent(state, event) {
    const next = {
      ...state,
      currentSeq: event.seq,
      updatedAt: event.timestamp,
      pendingToolCalls: { ...state.pendingToolCalls },
      uncertainCalls: { ...state.uncertainCalls },
      executionHistory: [...state.executionHistory],
    };

    switch (event.type) {
      case 'SessionStarted': {
        return {
          ...next,
          status: 'READY',
          goal: event.payload.initialGoal,
        };
      }

      case 'AgentDecided': {
        return {
          ...next,
          lastTurnId: event.payload.turnId,
          status: event.payload.proposedAction === 'REQUEST_USER_INPUT'
            ? 'AWAITING_HUMAN_APPROVAL'
            : 'REASONING',
        };
      }

      case 'ToolRequested': {
        const payload = event.payload;
        const pendingCall = {
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
        const payload = event.payload;
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
        const payload = event.payload;
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
        const payload = event.payload;
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
        return {
          ...next,
          snapshotCount: next.snapshotCount + 1,
          lastSnapshotSeq: event.payload.upToSeq,
        };
      }

      case 'RecoveryResolved': {
        const payload = event.payload;
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

  static computeEventHash(sessionId, seq, type, payload, previousHash) {
    const payloadStr = JSON.stringify(payload);
    const content = `${sessionId}:${seq}:${type}:${payloadStr}:${previousHash}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

// ============================================================================
// 3. ĐỘNG CƠ THỰC THI SẢN XUẤT (DurableRuntimeEngine)
// ============================================================================

class DurableRuntimeEngine {
  constructor(storage, config) {
    this.storage = storage;
    this.config = {
      snapshotInterval: config?.snapshotInterval ?? 4,
      agentVersion: config?.agentVersion ?? '2.0.0-enterprise',
      environment: config?.environment ?? 'production',
    };
    this.state = StateReducer.createInitialState('');
    this.lastEventHash = '0000000000000000000000000000000000000000000000000000000000000000';
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  async commitEvent(sessionId, type, payload) {
    const seq = this.state.currentSeq + 1;
    const timestamp = new Date().toISOString();
    const id = `evt_${sessionId}_${seq}_${Date.now()}`;
    const previousHash = this.lastEventHash;
    const eventHash = StateReducer.computeEventHash(sessionId, seq, type, payload, previousHash);

    const event = {
      id,
      sessionId,
      seq,
      timestamp,
      type,
      payload,
      metadata: {
        agentVersion: this.config.agentVersion,
        environment: this.config.environment,
        traceId: `tr_${sessionId}_${seq}`,
      },
      previousHash,
      eventHash,
    };

    await this.storage.append(event);
    this.lastEventHash = eventHash;

    this.state = StateReducer.applyEvent(this.state, event);

    if (this.state.currentSeq - this.state.lastSnapshotSeq >= this.config.snapshotInterval) {
      await this.triggerSnapshot(sessionId);
    }

    return event;
  }

  async triggerSnapshot(sessionId) {
    const upToSeq = this.state.currentSeq;
    const snapshotId = `snp_${sessionId}_${upToSeq}`;
    const stateCopy = this.getState();
    const stateHash = crypto.createHash('sha256').update(JSON.stringify(stateCopy)).digest('hex');

    const snapshotPayload = {
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

  async recover(sessionId) {
    const latestSnapshot = await this.storage.getLatestSnapshot(sessionId);
    let startSeq = 1;
    let baseState;
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

    const pendingCalls = Object.values(currentState.pendingToolCalls);
    const uncertainMap = {};

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

  async resolveRecovery(sessionId, unresolvedCallId, strategy, resolvedBy, rationale) {
    return await this.commitEvent(sessionId, 'RecoveryResolved', {
      unresolvedCallId,
      resolutionStrategy: strategy,
      resolvedBy,
      rationale,
    });
  }
}

module.exports = {
  FileJournalStorage,
  StateReducer,
  DurableRuntimeEngine,
};
