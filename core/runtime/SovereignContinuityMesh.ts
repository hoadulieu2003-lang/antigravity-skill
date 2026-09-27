/**
 * ⚡ ANTIGRAVITY ENTERPRISE - KHỐI KỸ THUẬT PHẦN MỀM
 * 🏛️ POD 1: SOVEREIGN CONTINUITY ARCHITECT
 * File: c:/Users/game/.gemini/core/runtime/SovereignContinuityMesh.ts
 * 
 * Module quản trị Lưới Trạng Thái Liên Tục (State Mesh) và Bộ Nhớ Dài Hạn (Long-Term Memory)
 * Kế thừa triết lý cyzus/suzent (Sovereign AI Agent) và DurableRuntimeEngine:
 * "Own its memory, govern its actions, choose its intelligence, and keep its continuity."
 * 
 * 6 Trụ Cột Kiến Trúc Cốt Lõi:
 * 1. Pod State Mesh: Quản trị cấu trúc liên kết phân tán giữa các pods (Pod 1 -> Pod 6) với Vector Clocks.
 * 2. Pod-to-Pod Event Synchronization: Kênh pub/sub có chứng thực mật mã, chống mất gói và kiểm soát thứ tự nhân quả.
 * 3. Sovereign Cryptographic Guard: Bảo vệ toàn vẹn bằng chữ ký HMAC-SHA256 với constant-time comparison chống timing attack.
 * 4. 4-Tier Sovereign Memory Vault: Working, Episodic, Semantic, Procedural Memory độc lập trên ổ đĩa cục bộ.
 * 5. Crash-Proof Cold Restart Engine: Tự động khôi phục nguyên vẹn trạng thái và bộ nhớ sau khi sập nguồn hoặc tắt máy.
 * 6. Durable Session Bridge: Tích hợp liền mạch với DurableRuntimeEngine để phát các sự kiện phiên ra toàn mạng lưới.
 * 
 * Chủ quản: Anh (Lead Architect & Sole Owner)
 * Tác tử phụ trách: Pod 1 (Sovereign Continuity Architect)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ============================================================================
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU & GIAO DIỆN (Types & Interfaces)
// ============================================================================

export type PodId = 'pod_1' | 'pod_2' | 'pod_3' | 'pod_4' | 'pod_5' | 'pod_6' | string;

export type PodStatus = 'ONLINE' | 'BUSY' | 'IDLE' | 'OFFLINE' | 'FAULTED';

export type MeshChannel =
  | 'lifecycle'
  | 'state_sync'
  | 'task_handoff'
  | 'memory_broadcast'
  | 'consensus'
  | 'security_alert'
  | string;

export interface PodNode {
  readonly podId: PodId;
  readonly role: string;
  status: PodStatus;
  currentSeq: number;
  lastHeartbeat: string;
  capabilities: readonly string[];
  metadata: Record<string, unknown>;
}

export type VectorClock = Record<PodId, number>;

export interface MeshEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly senderPodId: PodId;
  readonly targetPodId: PodId | '*'; // '*' biểu thị broadcast toàn lưới
  readonly channel: MeshChannel;
  readonly seq: number;
  readonly vectorClock: VectorClock;
  readonly timestamp: string;
  readonly payload: TPayload;
  readonly previousHash: string;
  readonly signature: string; // HMAC-SHA256
}

// 4 Tầng Bộ Nhớ Sovereign
export type MemoryTier = 'WORKING' | 'EPISODIC' | 'SEMANTIC' | 'PROCEDURAL';

export interface MemoryEntry<T = unknown> {
  readonly key: string;
  readonly tier: MemoryTier;
  readonly podId: PodId;
  readonly value: T;
  readonly tags: readonly string[];
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly signature: string; // HMAC-SHA256
}

export interface EpisodicRecord {
  readonly episodeId: string;
  readonly taskId: string;
  readonly podId: PodId;
  readonly goal: string;
  readonly outcome: 'SUCCESS' | 'FAILURE' | 'ABORTED';
  readonly turns: number;
  readonly summary: string;
  readonly artifacts: readonly string[];
  readonly timestamp: string;
}

export interface SemanticFact {
  readonly concept: string;
  readonly definition: string;
  readonly confidence: number;
  readonly sources: readonly string[];
  readonly verifiedBy: string;
}

export interface ProceduralRule {
  readonly ruleId: string;
  readonly domain: string;
  readonly condition: string;
  readonly action: string;
  readonly isStrictInvariant: boolean;
}

export interface MeshSnapshot {
  readonly snapshotId: string;
  readonly timestamp: string;
  readonly vectorClock: VectorClock;
  readonly pods: Record<PodId, PodNode>;
  readonly memoryStore: Record<string, MemoryEntry>;
  readonly snapshotHash: string;
  readonly signature: string;
}

export interface MeshConfig {
  readonly meshDir: string;
  readonly sovereignSecret: string;
  readonly snapshotIntervalEvents: number;
  readonly autoPersistIntervalMs: number;
  readonly heartbeatTtlMs: number;
}

// ============================================================================
// 2. MẬT MÃ SOVEREIGN & KIỂM TOÁN CHỮ KÝ HMAC-SHA256 (Cryptographic Guard)
// ============================================================================

export class SovereignCryptoGuard {
  private readonly secretKey: Buffer;

  constructor(secret: string) {
    if (!secret || secret.trim().length === 0) {
      throw new Error('Sovereign secret key không được để trống.');
    }
    // Sử dụng SHA-256 để chuẩn hóa secret thành 32-byte key
    this.secretKey = crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * Tính toán chữ ký HMAC-SHA256 cho dữ liệu bất kỳ
   */
  sign(data: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(data).digest('hex');
  }

  /**
   * Xác thực chữ ký bằng constant-time comparison chống tấn công Timing Attack
   */
  verify(data: string, signature: string): boolean {
    if (!signature || typeof signature !== 'string') return false;
    const computed = this.sign(data);
    const computedBuf = Buffer.from(computed, 'hex');
    const signatureBuf = Buffer.from(signature, 'hex');

    if (computedBuf.length !== signatureBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, signatureBuf);
  }

  /**
   * Tạo chữ ký chuẩn cho MeshEvent
   */
  signEvent(event: Omit<MeshEvent, 'signature'>): string {
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

  /**
   * Kiểm tra chữ ký MeshEvent
   */
  verifyEvent(event: MeshEvent): boolean {
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

  /**
   * Ký bộ nhớ MemoryEntry
   */
  signMemoryEntry(entry: Omit<MemoryEntry, 'signature'>): string {
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

  /**
   * Xác thực tính toàn vẹn của MemoryEntry
   */
  verifyMemoryEntry(entry: MemoryEntry): boolean {
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
// 3. SOVEREIGN MEMORY VAULT (4 Tầng Lưu Trữ Bộ Nhớ Dài Hạn Bền Vững)
// ============================================================================

export class SovereignMemoryVault {
  private readonly memory: Map<string, MemoryEntry> = new Map();
  private readonly cryptoGuard: SovereignCryptoGuard;

  constructor(cryptoGuard: SovereignCryptoGuard) {
    this.cryptoGuard = cryptoGuard;
  }

  /**
   * Lưu trữ hoặc cập nhật một mục nhớ có ký số bảo mật
   */
  set<T>(
    key: string,
    value: T,
    tier: MemoryTier,
    podId: PodId,
    tags: string[] = []
  ): MemoryEntry<T> {
    const existing = this.memory.get(key);
    const now = new Date().toISOString();
    const version = existing ? existing.version + 1 : 1;
    const createdAt = existing ? existing.createdAt : now;

    const unsignedEntry: Omit<MemoryEntry<T>, 'signature'> = {
      key,
      tier,
      podId,
      value,
      tags: Object.freeze([...tags]),
      version,
      createdAt,
      updatedAt: now,
    };

    const signature = this.cryptoGuard.signMemoryEntry(unsignedEntry as any);
    const entry: MemoryEntry<T> = {
      ...unsignedEntry,
      signature,
    };

    this.memory.set(key, entry as MemoryEntry);
    return entry;
  }

  /**
   * Đọc mục nhớ kèm kiểm chứng tính toàn vẹn chữ ký HMAC
   */
  get<T>(key: string): T | null {
    const entry = this.memory.get(key);
    if (!entry) return null;

    if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
      throw new Error(`[TAMPER_DETECTED] Mục nhớ '${key}' bị sai lệch chữ ký HMAC-SHA256!`);
    }

    return entry.value as T;
  }

  /**
   * Lấy chi tiết entry
   */
  getEntry(key: string): MemoryEntry | null {
    const entry = this.memory.get(key);
    if (!entry) return null;

    if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
      throw new Error(`[TAMPER_DETECTED] Mục nhớ '${key}' bị sai lệch chữ ký HMAC-SHA256!`);
    }

    return { ...entry };
  }

  /**
   * Tìm kiếm theo tầng (Tier) hoặc tags
   */
  query(filter: { tier?: MemoryTier; podId?: PodId; tag?: string }): MemoryEntry[] {
    const results: MemoryEntry[] = [];
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

  /**
   * Ghi nhận một phiên hành động (Episodic Record)
   */
  recordEpisode(record: EpisodicRecord): MemoryEntry<EpisodicRecord> {
    const key = `episodic:${record.episodeId}`;
    return this.set(key, record, 'EPISODIC', record.podId, ['episode', record.taskId, record.outcome]);
  }

  /**
   * Lưu trữ tri thức thực thể (Semantic Fact)
   */
  storeSemanticFact(fact: SemanticFact, podId: PodId): MemoryEntry<SemanticFact> {
    const key = `semantic:${fact.concept.toLowerCase().replace(/\s+/g, '_')}`;
    return this.set(key, fact, 'SEMANTIC', podId, ['semantic', fact.concept, ...fact.sources]);
  }

  /**
   * Cập nhật quy tắc tác vụ (Procedural Rule)
   */
  storeProceduralRule(rule: ProceduralRule, podId: PodId): MemoryEntry<ProceduralRule> {
    const key = `procedural:${rule.ruleId}`;
    return this.set(key, rule, 'PROCEDURAL', podId, ['rule', rule.domain, rule.isStrictInvariant ? 'invariant' : 'guideline']);
  }

  /**
   * Trích xuất toàn bộ snapshot bộ nhớ dạng Plain Object
   */
  dump(): Record<string, MemoryEntry> {
    const out: Record<string, MemoryEntry> = {};
    for (const [k, v] of this.memory.entries()) {
      out[k] = { ...v };
    }
    return out;
  }

  /**
   * Khôi phục bộ nhớ từ Snapshot hoặc Journal
   */
  load(entries: Record<string, MemoryEntry>): void {
    this.memory.clear();
    for (const [key, entry] of Object.entries(entries)) {
      if (!this.cryptoGuard.verifyMemoryEntry(entry)) {
        throw new Error(`[TAMPER_DETECTED] Phát hiện giả mạo mục nhớ '${key}' khi nạp vào Vault.`);
      }
      this.memory.set(key, entry);
    }
  }

  size(): number {
    return this.memory.size;
  }
}

// ============================================================================
// 4. BỘ ĐIỀU PHỐI LƯỚI TRẠNG THÁI LIÊN TỤC (SovereignContinuityMesh)
// ============================================================================

export type EventHandler<T = any> = (event: MeshEvent<T>) => void | Promise<void>;

export class SovereignContinuityMesh {
  private readonly config: MeshConfig;
  private readonly cryptoGuard: SovereignCryptoGuard;
  private readonly memoryVault: SovereignMemoryVault;
  private readonly pods: Map<PodId, PodNode> = new Map();
  private readonly vectorClock: VectorClock = {};
  private readonly subscribers: Map<MeshChannel, Set<EventHandler>> = new Map();
  private readonly eventHistory: MeshEvent[] = [];
  private lastMeshEventHash: string = '0000000000000000000000000000000000000000000000000000000000000000';
  private eventsSinceLastSnapshot: number = 0;

  constructor(config: Partial<MeshConfig> & { meshDir: string; sovereignSecret: string }) {
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

    // Mặc định đăng ký 6 Pods nòng cốt của Hạm Đội Antigravity
    this.initializeDefaultFleet();
  }

  private initializeDefaultFleet(): void {
    const defaultPods: Array<{ podId: PodId; role: string; capabilities: string[] }> = [
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

  // --- TRUY CẬP VAULT BỘ NHỚ ---
  get vault(): SovereignMemoryVault {
    return this.memoryVault;
  }

  // --- QUẢN LÝ PODS ---
  registerPod(node: Omit<PodNode, 'currentSeq' | 'lastHeartbeat'>): PodNode {
    const now = new Date().toISOString();
    const registered: PodNode = {
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

  getPod(podId: PodId): PodNode | null {
    const p = this.pods.get(podId);
    return p ? { ...p } : null;
  }

  getAllPods(): PodNode[] {
    return Array.from(this.pods.values()).map(p => ({ ...p }));
  }

  updatePodStatus(podId: PodId, status: PodStatus, metadata?: Record<string, unknown>): void {
    const pod = this.pods.get(podId);
    if (!pod) throw new Error(`Pod '${podId}' không tồn tại trong lưới trạng thái.`);
    pod.status = status;
    pod.lastHeartbeat = new Date().toISOString();
    if (metadata) {
      pod.metadata = { ...pod.metadata, ...metadata };
    }
  }

  getVectorClock(): VectorClock {
    return { ...this.vectorClock };
  }

  // --- PUB/SUB SỰ KIỆN LƯỚI ---
  subscribe(channel: MeshChannel, handler: EventHandler): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(handler);

    return () => {
      this.subscribers.get(channel)?.delete(handler);
    };
  }

  /**
   * Phát hành sự kiện vào Mesh (Ký HMAC, ghi WAL, đồng bộ Vector Clock)
   */
  async publish<T>(
    senderPodId: PodId,
    channel: MeshChannel,
    payload: T,
    targetPodId: PodId | '*' = '*'
  ): Promise<MeshEvent<T>> {
    const sender = this.pods.get(senderPodId);
    if (!sender) {
      throw new Error(`Pod gửi '${senderPodId}' chưa được đăng ký trong lưới.`);
    }

    // Tăng sequence của sender và cập nhật vector clock
    sender.currentSeq += 1;
    this.vectorClock[senderPodId] = sender.currentSeq;

    const eventId = `mesh_evt_${senderPodId}_${sender.currentSeq}_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const previousHash = this.lastMeshEventHash;

    const unsignedEvent: Omit<MeshEvent<T>, 'signature'> = {
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

    const signature = this.cryptoGuard.signEvent(unsignedEvent as any);
    const event: MeshEvent<T> = {
      ...unsignedEvent,
      signature,
    };

    // Kiểm tra chữ ký tự thân ngay trước khi phân phối
    if (!this.cryptoGuard.verifyEvent(event as any)) {
      throw new Error('Chữ ký HMAC-SHA256 của sự kiện bị suy thoái!');
    }

    // Cập nhật hash chaining
    this.lastMeshEventHash = crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex');
    this.eventHistory.push(event as MeshEvent);

    // Ghi WAL xuống file nhật ký đĩa
    await this.appendJournal(event);

    // Tăng đếm sự kiện để kiểm tra snapshot
    this.eventsSinceLastSnapshot += 1;
    if (this.eventsSinceLastSnapshot >= this.config.snapshotIntervalEvents) {
      await this.saveSnapshot();
      this.eventsSinceLastSnapshot = 0;
    }

    // Phát tới các subscribers
    await this.dispatchToSubscribers(event);

    return event;
  }

  private async dispatchToSubscribers(event: MeshEvent): Promise<void> {
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

  // --- LƯU TRỮ VÀ KHÔI PHỤC (WAL & COLD RESTARTS) ---
  private getJournalPath(): string {
    return path.join(this.config.meshDir, 'sovereign_mesh.journal.jsonl');
  }

  private getSnapshotPath(): string {
    return path.join(this.config.meshDir, 'sovereign_mesh.snapshot.json');
  }

  private async appendJournal(event: MeshEvent): Promise<void> {
    const journalPath = this.getJournalPath();
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(journalPath, line, 'utf-8');
  }

  /**
   * Lưu ảnh chụp trạng thái toàn diện (State Mesh + Memory Vault + HMAC)
   */
  async saveSnapshot(): Promise<MeshSnapshot> {
    const snapshotId = `snp_mesh_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const podsCopy: Record<PodId, PodNode> = {};
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

    const snapshot: MeshSnapshot = {
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

  /**
   * Tải lại toàn bộ Lưới Trạng Thái từ Đĩa (Cold Restart Engine)
   */
  async loadFromDisk(): Promise<{
    snapshotLoaded: boolean;
    eventsReplayed: number;
    memoryCount: number;
    activePodsCount: number;
  }> {
    let snapshotLoaded = false;
    let eventsReplayed = 0;

    // 1. Nạp snapshot nếu có
    const snapshotPath = this.getSnapshotPath();
    if (fs.existsSync(snapshotPath)) {
      const rawSnapshot = fs.readFileSync(snapshotPath, 'utf-8');
      const snapshot: MeshSnapshot = JSON.parse(rawSnapshot);

      // Xác thực chữ ký Snapshot
      if (!this.cryptoGuard.verify(snapshot.snapshotHash, snapshot.signature)) {
        throw new Error('[TAMPER_DETECTED] Chữ ký Snapshot của Sovereign Mesh không hợp lệ! Nghi ngờ bị sửa đổi trái phép.');
      }

      // Khôi phục pods và vector clocks
      for (const [podId, podNode] of Object.entries(snapshot.pods)) {
        this.pods.set(podId, podNode);
      }
      Object.assign(this.vectorClock, snapshot.vectorClock);

      // Khôi phục Memory Vault
      this.memoryVault.load(snapshot.memoryStore);
      snapshotLoaded = true;
    }

    // 2. Replay các sự kiện trong Journal sau Snapshot
    const journalPath = this.getJournalPath();
    if (fs.existsSync(journalPath)) {
      const lines = fs.readFileSync(journalPath, 'utf-8').trim().split('\n').filter(Boolean);
      for (const line of lines) {
        const event: MeshEvent = JSON.parse(line);

        // Xác thực chữ ký HMAC từng sự kiện
        if (!this.cryptoGuard.verifyEvent(event)) {
          throw new Error(`[TAMPER_DETECTED] Sự kiện '${event.eventId}' trong journal bị sai lệch chữ ký HMAC-SHA256!`);
        }

        // Kiểm tra xem sự kiện này đã được phản ánh trong vectorClock chưa
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

  /**
   * Cầu nối với DurableRuntimeEngine: Chuyển giao tiến trình từ Session vào Mesh
   */
  async bridgeSessionHandoff(sessionId: string, fromPod: PodId, toPod: PodId, sessionSummary: unknown): Promise<MeshEvent> {
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
