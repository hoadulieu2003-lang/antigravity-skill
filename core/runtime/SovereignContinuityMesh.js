/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: SOVEREIGN CONTINUITY ARCHITECT (CommonJS / Node.js Runtime Build)
 * File: c:/Users/game/.gemini/core/runtime/SovereignContinuityMesh.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// 1. MẬT MÃ SOVEREIGN & KIỂM TOÁN CHỮ KÝ HMAC-SHA256 (Cryptographic Guard)
// ============================================================================

class SovereignCryptoGuard {
  constructor(secret) {
    if (!secret || secret.trim().length === 0) {
      throw new Error('Sovereign secret key không được để trống.');
    }
    this.secretKey = crypto.createHash('sha256').update(secret).digest();
  }

  sign(data) {
    return crypto.createHmac('sha256', this.secretKey).update(data).digest('hex');
  }

  verify(data, signature) {
    if (!signature || typeof signature !== 'string') return false;
    const computed = this.sign(data);
    const computedBuf = Buffer.from(computed, 'hex');
    const signatureBuf = Buffer.from(signature, 'hex');

    if (computedBuf.length !== signatureBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, signatureBuf);
  }

  signEvent(event) {
    const canonical = [
      event.eventId,
      event.senderPodId,
      event.targetPodId,
      event.channel,
      event.seq,
      JSON.stringify(event.vectorClock),
      event.timestamp,
      JSON.stringify(event.payload),
      event.previousHash,
    ].join('|');
    return this.sign(canonical);
  }

  verifyEvent(event) {
    const canonical = [
      event.eventId,
      event.senderPodId,
      event.targetPodId,
      event.channel,
      event.seq,
      JSON.stringify(event.vectorClock),
      event.timestamp,
      JSON.stringify(event.payload),
      event.previousHash,
    ].join('|');
    return this.verify(canonical, event.signature);
  }

  signMemoryEntry(entry) {
    const canonical = [
      entry.key,
      entry.tier,
      entry.podId,
      JSON.stringify(entry.value),
      entry.tags.join(','),
      entry.version,
      entry.createdAt,
      entry.updatedAt,
    ].join('|');
    return this.sign(canonical);
  }

  verifyMemoryEntry(entry) {
    const canonical = [
      entry.key,
      entry.tier,
      entry.podId,
      JSON.stringify(entry.value),
      entry.tags.join(','),
      entry.version,
      entry.createdAt,
      entry.updatedAt,
    ].join('|');
    return this.verify(canonical, entry.signature);
  }
}

// ============================================================================
// 2. SOVEREIGN MEMORY VAULT (4 Tầng Lưu Trữ Bộ Nhớ Dài Hạn Bền Vững)
// ============================================================================

class SovereignMemoryVault {
  constructor(cryptoGuard) {
    this.memory = new Map();
    this.cryptoGuard = cryptoGuard;
  }

  set(key, value, tier, podId, tags = []) {
    const existing = this.memory.get(key);
    const now = new Date().toISOString();
    const version = existing ? existing.version + 1 : 1;
    const createdAt = existing ? existing.createdAt : now;

    const unsignedEntry = {
      key,
      tier,
      podId,
      value,
      tags: Object.freeze([...tags]),
      version,
      createdAt,
      updatedAt: now,
    };

    const signature = this.cryptoGuard.signMemoryEntry(unsignedEntry);
    const entry = {
      ...unsignedEntry,
      signature,
    };

    this.memory.set(key, entry);
    return entry;
  }

  get(key) {
    const entry = this.memory.get(key);
    if (!entry) return null;

    if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
      throw new Error(`[TAMPER_DETECTED] Mục nhớ '${key}' bị sai lệch chữ ký HMAC-SHA256!`);
    }

    return entry.value;
  }

  getEntry(key) {
    const entry = this.memory.get(key);
    if (!entry) return null;

    if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
      throw new Error(`[TAMPER_DETECTED] Mục nhớ '${key}' bị sai lệch chữ ký HMAC-SHA256!`);
    }

    return { ...entry };
  }

  query(filter) {
    const results = [];
    for (const entry of this.memory.values()) {
      if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
        throw new Error(`[TAMPER_DETECTED] Phát hiện sửa đổi trái phép ở key '${entry.key}'`);
      }
      if (filter.tier && entry.tier !== filter.tier) continue;
      if (filter.podId && entry.podId !== filter.podId) continue;
      if (filter.tag && !entry.tags.includes(filter.tag)) continue;
      results.push({ ...entry });
    }
    return results;
  }

  recordEpisode(record) {
    const key = `episodic:${record.episodeId}`;
    return this.set(key, record, 'EPISODIC', record.podId, ['episode', record.taskId, record.outcome]);
  }

  storeSemanticFact(fact, podId) {
    const key = `semantic:${fact.concept.toLowerCase().replace(/\s+/g, '_')}`;
    return this.set(key, fact, 'SEMANTIC', podId, ['semantic', fact.concept, ...fact.sources]);
  }

  storeProceduralRule(rule, podId) {
    const key = `procedural:${rule.ruleId}`;
    return this.set(key, rule, 'PROCEDURAL', podId, ['rule', rule.domain, rule.isStrictInvariant ? 'invariant' : 'guideline']);
  }

  dump() {
    const out = {};
    for (const [k, v] of this.memory.entries()) {
      out[k] = { ...v };
    }
    return out;
  }

  load(entries) {
    this.memory.clear();
    for (const [key, entry] of Object.entries(entries)) {
      if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
        throw new Error(`[TAMPER_DETECTED] Phát hiện giả mạo mục nhớ '${key}' khi nạp vào Vault.`);
      }
      this.memory.set(key, entry);
    }
  }

  size() {
    return this.memory.size;
  }
}

// ============================================================================
// 3. BỘ ĐIỀU PHỐI LƯỚI TRẠNG THÁI LIÊN TỤC (SovereignContinuityMesh)
// ============================================================================

class SovereignContinuityMesh {
  constructor(config) {
    if (!config || !config.meshDir || !config.sovereignSecret) {
      throw new Error('MeshConfig phải có meshDir và sovereignSecret.');
    }
    this.config = {
      meshDir: config.meshDir,
      sovereignSecret: config.sovereignSecret,
      snapshotIntervalEvents: config.snapshotIntervalEvents ?? 10,
      autoPersistIntervalMs: config.autoPersistIntervalMs ?? 5000,
      heartbeatTtlMs: config.heartbeatTtlMs ?? 30000,
    };

    if (!fs.existsSync(this.config.meshDir)) {
      fs.mkdirSync(this.config.meshDir, { recursive: true });
    }

    this.cryptoGuard = new SovereignCryptoGuard(this.config.sovereignSecret);
    this.memoryVault = new SovereignMemoryVault(this.cryptoGuard);
    this.pods = new Map();
    this.vectorClock = {};
    this.subscribers = new Map();
    this.eventHistory = [];
    this.lastMeshEventHash = '0000000000000000000000000000000000000000000000000000000000000000';
    this.eventsSinceLastSnapshot = 0;

    this.initializeDefaultFleet();
  }

  initializeDefaultFleet() {
    const defaultPods = [
      { podId: 'pod_1', role: 'Sovereign Continuity & Durable Runtime', capabilities: ['wal', 'state_mesh', 'hmac', 'cold_recovery'] },
      { podId: 'pod_2', role: 'Run-to-Skill Compiler', capabilities: ['skill_synthesis', 'ast_validation', 'workflow_extraction'] },
      { podId: 'pod_3', role: 'TwinCheck Verification Auditor', capabilities: ['negative_twin', 'delta_audit', 'falsification'] },
      { podId: 'pod_4', role: 'Generative AG-UI Studio', capabilities: ['luminous_tokens', 'motion_60fps', 'emil_physics'] },
      { podId: 'pod_5', role: 'Stealth Browser Specialist', capabilities: ['cdp_bypass', 'fitts_mouse', 'anti_fingerprint'] },
      { podId: 'pod_6', role: 'Smart Routing Arbiter', capabilities: ['task_sizing', 'thinking_budget', 'fleet_orchestration'] },
    ];

    const now = new Date().toISOString();
    for (const p of defaultPods) {
      this.pods.set(p.podId, {
        podId: p.podId,
        role: p.role,
        status: 'IDLE',
        currentSeq: 0,
        lastHeartbeat: now,
        capabilities: Object.freeze([...p.capabilities]),
        metadata: {},
      });
      this.vectorClock[p.podId] = 0;
    }
  }

  get vault() {
    return this.memoryVault;
  }

  registerPod(node) {
    const now = new Date().toISOString();
    const registered = {
      ...node,
      currentSeq: 0,
      lastHeartbeat: now,
    };
    this.pods.set(node.podId, registered);
    if (this.vectorClock[node.podId] === undefined) {
      this.vectorClock[node.podId] = 0;
    }
    return registered;
  }

  getPod(podId) {
    const p = this.pods.get(podId);
    return p ? { ...p } : null;
  }

  getAllPods() {
    return Array.from(this.pods.values()).map(p => ({ ...p }));
  }

  updatePodStatus(podId, status, metadata) {
    const pod = this.pods.get(podId);
    if (!pod) throw new Error(`Pod '${podId}' không tồn tại trong lưới trạng thái.`);
    pod.status = status;
    pod.lastHeartbeat = new Date().toISOString();
    if (metadata) {
      pod.metadata = { ...pod.metadata, ...metadata };
    }
  }

  getVectorClock() {
    return { ...this.vectorClock };
  }

  subscribe(channel, handler) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel).add(handler);

    return () => {
      this.subscribers.get(channel)?.delete(handler);
    };
  }

  async publish(senderPodId, channel, payload, targetPodId = '*') {
    const sender = this.pods.get(senderPodId);
    if (!sender) {
      throw new Error(`Pod gửi '${senderPodId}' chưa được đăng ký trong lưới.`);
    }

    sender.currentSeq += 1;
    this.vectorClock[senderPodId] = sender.currentSeq;

    const eventId = `mesh_evt_${senderPodId}_${sender.currentSeq}_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const previousHash = this.lastMeshEventHash;

    const unsignedEvent = {
      eventId,
      senderPodId,
      targetPodId,
      channel,
      seq: sender.currentSeq,
      vectorClock: { ...this.vectorClock },
      timestamp,
      payload,
      previousHash,
    };

    const signature = this.cryptoGuard.signEvent(unsignedEvent);
    const event = {
      ...unsignedEvent,
      signature,
    };

    if (!this.cryptoGuard.verifyEvent(event)) {
      throw new Error('Chữ ký HMAC-SHA256 của sự kiện bị suy thoái!');
    }

    this.lastMeshEventHash = crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex');
    this.eventHistory.push(event);

    await this.appendJournal(event);

    this.eventsSinceLastSnapshot += 1;
    if (this.eventsSinceLastSnapshot >= this.config.snapshotIntervalEvents) {
      await this.saveSnapshot();
      this.eventsSinceLastSnapshot = 0;
    }

    await this.dispatchToSubscribers(event);

    return event;
  }

  async dispatchToSubscribers(event) {
    const handlers = this.subscribers.get(event.channel);
    if (!handlers || handlers.size === 0) return;

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[MESH_DISPATCH_ERROR] Lỗi tại subscriber channel '${event.channel}':`, err);
      }
    }
  }

  getJournalPath() {
    return path.join(this.config.meshDir, 'sovereign_mesh.journal.jsonl');
  }

  getSnapshotPath() {
    return path.join(this.config.meshDir, 'sovereign_mesh.snapshot.json');
  }

  async appendJournal(event) {
    const journalPath = this.getJournalPath();
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(journalPath, line, 'utf-8');
  }

  async saveSnapshot() {
    const snapshotId = `snp_mesh_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const podsCopy = {};
    for (const [k, v] of this.pods.entries()) {
      podsCopy[k] = { ...v };
    }

    const memoryDump = this.memoryVault.dump();
    const rawContent = JSON.stringify({
      snapshotId,
      timestamp,
      vectorClock: this.vectorClock,
      pods: podsCopy,
      memoryStore: memoryDump,
    });

    const snapshotHash = crypto.createHash('sha256').update(rawContent).digest('hex');
    const signature = this.cryptoGuard.sign(snapshotHash);

    const snapshot = {
      snapshotId,
      timestamp,
      vectorClock: { ...this.vectorClock },
      pods: podsCopy,
      memoryStore: memoryDump,
      snapshotHash,
      signature,
    };

    const snapshotPath = this.getSnapshotPath();
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
    return snapshot;
  }

  async loadFromDisk() {
    let snapshotLoaded = false;
    let eventsReplayed = 0;

    const snapshotPath = this.getSnapshotPath();
    if (fs.existsSync(snapshotPath)) {
      const rawSnapshot = fs.readFileSync(snapshotPath, 'utf-8');
      const snapshot = JSON.parse(rawSnapshot);

      if (!this.cryptoGuard.verify(snapshot.snapshotHash, snapshot.signature)) {
        throw new Error('[TAMPER_DETECTED] Chữ ký Snapshot của Sovereign Mesh không hợp lệ! Nghi ngờ bị sửa đổi trái phép.');
      }

      for (const [podId, podNode] of Object.entries(snapshot.pods)) {
        this.pods.set(podId, podNode);
      }
      Object.assign(this.vectorClock, snapshot.vectorClock);

      this.memoryVault.load(snapshot.memoryStore);
      snapshotLoaded = true;
    }

    const journalPath = this.getJournalPath();
    if (fs.existsSync(journalPath)) {
      const lines = fs.readFileSync(journalPath, 'utf-8').trim().split('\n').filter(Boolean);
      for (const line of lines) {
        const event = JSON.parse(line);

        if (!this.cryptoGuard.verifyEvent(event)) {
          throw new Error(`[TAMPER_DETECTED] Sự kiện '${event.eventId}' trong journal bị sai lệch chữ ký HMAC-SHA256!`);
        }

        const recordedSeq = this.vectorClock[event.senderPodId] || 0;
        if (event.seq > recordedSeq) {
          const sender = this.pods.get(event.senderPodId);
          if (sender) {
            sender.currentSeq = event.seq;
          }
          this.vectorClock[event.senderPodId] = event.seq;
          this.lastMeshEventHash = crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex');
          eventsReplayed++;
        }
      }
    }

    return {
      snapshotLoaded,
      eventsReplayed,
      memoryCount: this.memoryVault.size(),
      activePodsCount: this.pods.size,
    };
  }

  async bridgeSessionHandoff(sessionId, fromPod, toPod, sessionSummary) {
    return this.publish(
      fromPod,
      'task_handoff',
      {
        sessionId,
        fromPod,
        toPod,
        handoffAt: new Date().toISOString(),
        summary: sessionSummary,
      },
      toPod
    );
  }
}

module.exports = {
  SovereignCryptoGuard,
  SovereignMemoryVault,
  SovereignContinuityMesh,
};
