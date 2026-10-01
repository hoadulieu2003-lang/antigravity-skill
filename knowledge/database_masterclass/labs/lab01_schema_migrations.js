/**
 * 🏛️ DATABASE MASTERCLASS - LAB 01: ZERO-DOWNTIME SCHEMA MIGRATIONS
 * ============================================================================
 * Vị trí: Pod 1 — Relational Modeling & Schema Architect
 * File: lab01_schema_migrations.js
 * Runtime: Pure Node.js (Zero external dependencies)
 * 
 * MÔ TẢ PHÒNG THÍ NGHIỆM:
 * Mô-đun mô phỏng thực chiến các kỹ thuật di cư lược đồ cơ sở dữ liệu không gián
 * đoạn dịch vụ (Zero-Downtime Schema Migrations) ở cấp độ Enterprise:
 * 
 * 1. Expand/Contract Pattern (Mẫu hình Mở rộng / Thu hẹp - Blue-Green Columns):
 *    - Phase 1 (Expand): Bổ sung cột mới nullable (Add new nullable column)
 *    - Phase 2 (Dual-Write): Kích hoạt trigger/logic ghi kép (Dual-write sync)
 *    - Phase 3 (Batched Backfilling): Lấp đầy dữ liệu lịch sử theo khối an toàn
 *    - Phase 4 (Read Cutover): Chuyển hướng 100% logic đọc sang cột mới
 *    - Phase 5 (Contract): Gỡ bỏ ghi kép & DROP COLUMN cũ an toàn
 * 
 * 2. Lock Queue & Head-of-Line Blocking Simulation:
 *    - Mô phỏng xung đột khóa PostgreSQL: AccessShareLock vs AccessExclusiveLock
 *    - Hiện tượng Head-of-Line Blocking làm cạn kiệt Connection Pool
 *    - Cơ chế cứu cánh: lock_timeout (2000ms) + Exponential Backoff & Jitter Retry
 * 
 * 3. Built-in Automated Test Suite:
 *    - Chạy trực tiếp qua: `node lab01_schema_migrations.js`
 *    - Xuất API JSON & Telemetry cho Web Dashboard
 * ============================================================================
 */

'use strict';

// ============================================================================
// PHẦN 1: HỆ THỐNG QUẢN LÝ KHÓA ĐỘNG CƠ (LOCK HIERARCHY & QUEUE MANAGER)
// ============================================================================

/**
 * Các cấp độ khóa bảng chuẩn PostgreSQL (PostgreSQL Table Lock Modes)
 */
const LockMode = {
  ACCESS_SHARE: 'AccessShareLock',         // Dùng cho SELECT (Đọc dữ liệu)
  ROW_EXCLUSIVE: 'RowExclusiveLock',       // Dùng cho INSERT, UPDATE, DELETE (Ghi dữ liệu)
  ACCESS_EXCLUSIVE: 'AccessExclusiveLock'  // Dùng cho DDL: ALTER TABLE, DROP COLUMN (Độc quyền tối cao)
};

/**
 * Ma trận xung đột khóa (Lock Conflict Matrix)
 * True = Có xung đột (Conflict), False = Hợp tác (Compatible)
 */
const LockConflictMatrix = {
  [LockMode.ACCESS_SHARE]: {
    [LockMode.ACCESS_SHARE]: false,
    [LockMode.ROW_EXCLUSIVE]: false,
    [LockMode.ACCESS_EXCLUSIVE]: true
  },
  [LockMode.ROW_EXCLUSIVE]: {
    [LockMode.ACCESS_SHARE]: false,
    [LockMode.ROW_EXCLUSIVE]: false,
    [LockMode.ACCESS_EXCLUSIVE]: true
  },
  [LockMode.ACCESS_EXCLUSIVE]: {
    [LockMode.ACCESS_SHARE]: true,
    [LockMode.ROW_EXCLUSIVE]: true,
    [LockMode.ACCESS_EXCLUSIVE]: true
  }
};

/**
 * Lỗi vượt quá thời gian chờ khóa (PostgreSQL 55P03: lock_not_available)
 */
class LockTimeoutError extends Error {
  constructor(message, txId, lockMode, waitedMs) {
    super(message);
    this.name = 'LockTimeoutError';
    this.code = '55P03'; // Mã lỗi PostgreSQL chuẩn cho lock_not_available
    this.txId = txId;
    this.lockMode = lockMode;
    this.waitedMs = waitedMs;
  }
}

/**
 * Quản lý hàng đợi khóa bảng theo chuẩn FIFO công bằng (Fair FIFO Lock Manager)
 * Mô phỏng chính xác hiện tượng Head-of-Line Blocking
 */
class LockManager {
  constructor(tableName = 'public_table') {
    this.tableName = tableName;
    this.activeLocks = []; // Danh sách các khóa đang giữ: [{ txId, lockMode, acquiredAt }]
    this.waitQueue = [];   // Hàng đợi khóa: [{ txId, lockMode, requestedAt, lockTimeoutMs, resolve, reject, timer }]
    this.lockHistory = []; // Nhật ký biến động khóa (Telemetry)
  }

  /**
   * Kiểm tra tính tương thích giữa khóa yêu cầu và các khóa đang hoạt động
   */
  isCompatibleWithActive(lockMode) {
    for (const active of this.activeLocks) {
      if (LockConflictMatrix[lockMode][active.lockMode]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Yêu cầu cấp khóa (Acquire Lock) với cơ chế timeout phòng hộ
   */
  acquire(txId, lockMode, lockTimeoutMs = 0) {
    return new Promise((resolve, reject) => {
      const requestedAt = Date.now();

      // Nếu không có ai trong hàng đợi và khóa tương thích với active locks -> Cấp ngay
      if (this.waitQueue.length === 0 && this.isCompatibleWithActive(lockMode)) {
        const lock = { txId, lockMode, acquiredAt: requestedAt };
        this.activeLocks.push(lock);
        this._recordHistory('LOCK_GRANTED_IMMEDIATE', txId, lockMode, 0);
        return resolve(lock);
      }

      // NGUYÊN TẮC HEAD-OF-LINE BLOCKING:
      // Phải xếp vào hàng đợi chờ lượt (FIFO). Không được vượt mặt DDL đang chờ!
      const queueItem = {
        txId,
        lockMode,
        requestedAt,
        lockTimeoutMs,
        resolve,
        reject,
        timer: null
      };

      // Thiết lập cơ chế cứu cánh lock_timeout
      if (lockTimeoutMs > 0) {
        queueItem.timer = setTimeout(() => {
          this._handleLockTimeout(queueItem);
        }, lockTimeoutMs);
      }

      this.waitQueue.push(queueItem);
      this._recordHistory('LOCK_QUEUED', txId, lockMode, 0);
    });
  }

  /**
   * Xử lý khi yêu cầu khóa bị quá hạn lock_timeout
   */
  _handleLockTimeout(queueItem) {
    const index = this.waitQueue.indexOf(queueItem);
    if (index !== -1) {
      this.waitQueue.splice(index, 1);
      const waitedMs = Date.now() - queueItem.requestedAt;
      this._recordHistory('LOCK_TIMEOUT_ABORTED', queueItem.txId, queueItem.lockMode, waitedMs);
      
      const err = new LockTimeoutError(
        `[LOCK_TIMEOUT] Giao dịch ${queueItem.txId} hủy yêu cầu ${queueItem.lockMode} trên bảng ${this.tableName} sau ${waitedMs}ms để bảo vệ Connection Pool.`,
        queueItem.txId,
        queueItem.lockMode,
        waitedMs
      );
      queueItem.reject(err);

      // Thử cấp khóa cho các câu lệnh tiếp theo sau khi kẻ cản đường bị loại bỏ
      this._processQueue();
    }
  }

  /**
   * Giải phóng khóa (Release Lock) và đánh thức các truy vấn tiếp theo trong hàng đợi
   */
  release(txId) {
    const initialCount = this.activeLocks.length;
    this.activeLocks = this.activeLocks.filter(l => l.txId !== txId);
    
    if (this.activeLocks.length < initialCount) {
      this._recordHistory('LOCK_RELEASED', txId, null, 0);
      this._processQueue();
    }
  }

  /**
   * Duyệt hàng đợi theo chuẩn công bằng (Fair FIFO Process Queue)
   */
  _processQueue() {
    if (this.waitQueue.length === 0) return;

    // Duyệt từ đầu hàng đợi
    while (this.waitQueue.length > 0) {
      const nextInLine = this.waitQueue[0];

      // Kiểm tra xem phần tử đầu hàng có tương thích với các khóa đang active không
      if (this.isCompatibleWithActive(nextInLine.lockMode)) {
        // Cấp khóa
        this.waitQueue.shift();
        if (nextInLine.timer) clearTimeout(nextInLine.timer);

        const lock = {
          txId: nextInLine.txId,
          lockMode: nextInLine.lockMode,
          acquiredAt: Date.now()
        };
        this.activeLocks.push(lock);
        const waitedMs = Date.now() - nextInLine.requestedAt;
        this._recordHistory('LOCK_GRANTED_FROM_QUEUE', nextInLine.txId, nextInLine.lockMode, waitedMs);
        nextInLine.resolve(lock);

        // Nếu là AccessShareLock hoặc RowExclusiveLock, các câu lệnh tương thích tiếp theo có thể được cấp cùng
        if (nextInLine.lockMode !== LockMode.ACCESS_EXCLUSIVE) {
          continue;
        } else {
          // AccessExclusiveLock độc quyền tuyệt đối, dừng việc cấp thêm
          break;
        }
      } else {
        // Phần tử đầu hàng đợi chưa được cấp khóa -> Toàn bộ các truy vấn sau PHẢI CHỜ (Head-of-Line Blocking)
        break;
      }
    }
  }

  _recordHistory(event, txId, lockMode, waitedMs) {
    this.lockHistory.push({
      timestamp: Date.now(),
      event,
      txId,
      lockMode,
      waitedMs,
      activeCount: this.activeLocks.length,
      queueDepth: this.waitQueue.length
    });
    if (this.lockHistory.length > 500) this.lockHistory.shift();
  }

  getSnapshot() {
    return {
      tableName: this.tableName,
      activeLocks: this.activeLocks.map(l => ({ ...l })),
      waitQueue: this.waitQueue.map(q => ({
        txId: q.txId,
        lockMode: q.lockMode,
        waitedMs: Date.now() - q.requestedAt,
        lockTimeoutMs: q.lockTimeoutMs
      })),
      activeCount: this.activeLocks.length,
      queueDepth: this.waitQueue.length
    };
  }
}

// ============================================================================
// PHẦN 2: BẢNG DỮ LIỆU BỘ NHỚ TRONG (IN-MEMORY RELATIONAL TABLE)
// ============================================================================

/**
 * Bảng dữ liệu quan hệ mô phỏng đầy đủ ràng buộc khóa, schema và triggers
 */
class InMemoryTable {
  constructor(name = 'users') {
    this.name = name;
    this.columns = new Map(); // colName -> { type, nullable, defaultValue }
    this.rows = new Map();    // id -> { id, col1, col2, ... }
    this.triggers = [];       // Danh sách trigger: [{ name, timing, event, fn }]
    this.lockManager = new LockManager(name);
    this.readCounter = 0;
    this.writeCounter = 0;
  }

  /**
   * Đăng ký cột vào lược đồ bảng
   */
  addColumnDefinition(name, type = 'TEXT', nullable = true, defaultValue = null) {
    this.columns.set(name, { name, type, nullable, defaultValue });
  }

  /**
   * Đăng ký trigger (Ví dụ: Trigger ghi kép Dual-write)
   */
  addTrigger(name, timing, event, fn) {
    this.triggers.push({ name, timing, event, fn });
  }

  /**
   * Gỡ bỏ trigger
   */
  removeTrigger(name) {
    this.triggers = this.triggers.filter(t => t.name !== name);
  }

  /**
   * Thực thi truy vấn SELECT có bảo vệ bằng AccessShareLock
   */
  async select(txId, predicate = null, lockTimeoutMs = 5000) {
    await this.lockManager.acquire(txId, LockMode.ACCESS_SHARE, lockTimeoutMs);
    try {
      this.readCounter++;
      const results = [];
      for (const row of this.rows.values()) {
        if (!predicate || predicate(row)) {
          // Trả về bản sao tránh mutate bên ngoài
          results.push({ ...row });
        }
      }
      return results;
    } finally {
      this.lockManager.release(txId);
    }
  }

  /**
   * Thực thi thao tác INSERT có kích hoạt RowExclusiveLock & Triggers
   */
  async insert(txId, rowData, lockTimeoutMs = 5000) {
    await this.lockManager.acquire(txId, LockMode.ROW_EXCLUSIVE, lockTimeoutMs);
    try {
      this.writeCounter++;
      const row = { ...rowData };

      // Áp dụng giá trị mặc định cho các cột còn thiếu
      for (const [colName, colDef] of this.columns.entries()) {
        if (row[colName] === undefined) {
          row[colName] = colDef.defaultValue;
        }
      }

      // Kích hoạt Before-Insert triggers
      for (const trig of this.triggers) {
        if (trig.event === 'INSERT' || trig.event === 'ALL') {
          trig.fn('INSERT', null, row);
        }
      }

      this.rows.set(row.id, row);
      return { ...row };
    } finally {
      this.lockManager.release(txId);
    }
  }

  /**
   * Thực thi thao tác UPDATE có kích hoạt RowExclusiveLock & Triggers
   */
  async update(txId, id, changes, lockTimeoutMs = 5000) {
    await this.lockManager.acquire(txId, LockMode.ROW_EXCLUSIVE, lockTimeoutMs);
    try {
      this.writeCounter++;
      const oldRow = this.rows.get(id);
      if (!oldRow) {
        throw new Error(`Record with id ${id} not found`);
      }

      const newRow = { ...oldRow, ...changes };

      // Kích hoạt Triggers
      for (const trig of this.triggers) {
        if (trig.event === 'UPDATE' || trig.event === 'ALL') {
          trig.fn('UPDATE', oldRow, newRow);
        }
      }

      this.rows.set(id, newRow);
      return { ...newRow };
    } finally {
      this.lockManager.release(txId);
    }
  }

  /**
   * Thực thi thao tác DDL: ALTER TABLE ADD COLUMN (Yêu cầu AccessExclusiveLock)
   */
  async alterTableAddColumn(txId, colName, type = 'TEXT', nullable = true, defaultValue = null, lockTimeoutMs = 2000) {
    await this.lockManager.acquire(txId, LockMode.ACCESS_EXCLUSIVE, lockTimeoutMs);
    try {
      this.addColumnDefinition(colName, type, nullable, defaultValue);
      // PostgreSQL >= 11 metadata-only update: không cần rewrite bảng
      return true;
    } finally {
      this.lockManager.release(txId);
    }
  }

  /**
   * Thực thi thao tác DDL: ALTER TABLE DROP COLUMN (Yêu cầu AccessExclusiveLock)
   */
  async alterTableDropColumn(txId, colName, lockTimeoutMs = 2000) {
    await this.lockManager.acquire(txId, LockMode.ACCESS_EXCLUSIVE, lockTimeoutMs);
    try {
      this.columns.delete(colName);
      // Xóa cột khỏi các dòng vật lý
      for (const row of this.rows.values()) {
        delete row[colName];
      }
      return true;
    } finally {
      this.lockManager.release(txId);
    }
  }

  /**
   * Cập nhật trực tiếp nội bộ (dùng cho Backfill worker)
   */
  async backfillBatch(txId, updates, lockTimeoutMs = 5000) {
    await this.lockManager.acquire(txId, LockMode.ROW_EXCLUSIVE, lockTimeoutMs);
    try {
      for (const { id, changes } of updates) {
        const row = this.rows.get(id);
        if (row) {
          Object.assign(row, changes);
        }
      }
      return updates.length;
    } finally {
      this.lockManager.release(txId);
    }
  }

  count() {
    return this.rows.size;
  }
}

// ============================================================================
// PHẦN 3: ĐỘNG CƠ DI CƯ KHÔNG GIÁN ĐOẠN (ZERO-DOWNTIME MIGRATION ENGINE)
// ============================================================================

/**
 * Các giai đoạn của chu trình Expand/Contract chuẩn Blue-Green
 */
const MigrationPhase = {
  IDLE: 'IDLE',
  PHASE_1_EXPAND: 'PHASE_1_EXPAND',         // 1. Thêm cột mới nullable
  PHASE_2_DUAL_WRITE: 'PHASE_2_DUAL_WRITE', // 2. Kích hoạt trigger ghi kép
  PHASE_3_BACKFILL: 'PHASE_3_BACKFILL',     // 3. Lấp đầy dữ liệu lịch sử theo batch
  PHASE_4_READ_CUTOVER: 'PHASE_4_READ_CUTOVER', // 4. Chuyển hướng đọc sang cột mới
  PHASE_5_CONTRACT: 'PHASE_5_CONTRACT',     // 5. Gỡ bỏ ghi kép & DROP COLUMN cũ
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

/**
 * Động cơ di cư lược đồ Zero-Downtime Migration Engine
 */
class ZeroDowntimeMigrationEngine {
  constructor(options = {}) {
    this.table = options.table || new InMemoryTable('users');
    this.oldColumn = options.oldColumn || 'phone';
    this.newColumn = options.newColumn || 'phone_e164';
    this.transformFn = options.transformFn || ((val) => {
      // Hàm chuyển đổi chuẩn: Chuẩn hóa số điện thoại sang định dạng quốc tế E.164 (+84...)
      if (!val) return null;
      const cleaned = String(val).replace(/\D/g, '');
      if (cleaned.startsWith('84')) return '+' + cleaned;
      if (cleaned.startsWith('0')) return '+84' + cleaned.slice(1);
      return '+84' + cleaned;
    });

    this.batchSize = options.batchSize || 100;
    this.batchDelayMs = options.batchDelayMs || 20; // Giãn cách giữa các batch để tránh I/O throttling
    this.lockTimeoutMs = options.lockTimeoutMs || 2000;
    this.maxRetries = options.maxRetries || 5;

    // Trạng thái và giám sát (Telemetry)
    this.currentPhase = MigrationPhase.IDLE;
    this.currentReadTarget = this.oldColumn; // Ban đầu đọc từ oldColumn
    this.phaseTimestamps = {};
    this.backfilledCount = 0;
    this.totalToBackfill = 0;
    this.logs = [];
    this.errors = [];
    this.dualWritesCount = 0;
  }

  log(message, phase = this.currentPhase) {
    const entry = {
      timestamp: new Date().toISOString(),
      phase,
      message
    };
    this.logs.push(entry);
    // console.log(`[${entry.timestamp}] [${phase}] ${message}`);
  }

  /**
   * Helper: Thực thi DDL an toàn với lock_timeout và Exponential Backoff Retry
   */
  async executeSafeDDL(operationName, ddlFunction) {
    let attempt = 0;
    let baseDelay = 100; // ms

    while (attempt < this.maxRetries) {
      attempt++;
      const txId = `ddl_${operationName}_try_${attempt}_${Date.now()}`;
      try {
        this.log(`[DDL Attempt ${attempt}/${this.maxRetries}] Yêu cầu AccessExclusiveLock cho ${operationName} (lock_timeout=${this.lockTimeoutMs}ms)...`);
        const result = await ddlFunction(txId);
        this.log(`[DDL Success] Thao tác ${operationName} hoàn tất thành công tại lần thử ${attempt}.`);
        return result;
      } catch (err) {
        if (err instanceof LockTimeoutError) {
          // Tính toán thời gian lùi với Jitter ngẫu nhiên (Full Jitter Exponential Backoff)
          const backoff = Math.floor(Math.random() * (baseDelay * Math.pow(2, attempt - 1)));
          this.log(`[DDL Timeout Protected] Bị kẹt hàng đợi khóa. Hủy lệnh an toàn sau ${err.waitedMs}ms. Lùi thời gian (Backoff) ${backoff}ms trước khi thử lại...`);
          if (attempt >= this.maxRetries) {
            throw new Error(`[DDL Aborted] Vượt quá số lần thử lại (${this.maxRetries}) cho thao tác ${operationName}. Hủy migration để bảo vệ hệ thống.`);
          }
          await new Promise(r => setTimeout(r, backoff));
        } else {
          throw err;
        }
      }
    }
  }

  /**
   * BƯỚC 1: EXPAND (Mở rộng)
   * Thêm cột mới nullable vào bảng mà không khóa bảng lâu
   */
  async step1_expand() {
    this.currentPhase = MigrationPhase.PHASE_1_EXPAND;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bắt đầu Bước 1 (Expand): Thêm cột mới nullable "${this.newColumn}" vào bảng "${this.table.name}"`);

    await this.executeSafeDDL(`ADD_COLUMN_${this.newColumn}`, async (txId) => {
      return await this.table.alterTableAddColumn(
        txId,
        this.newColumn,
        'VARCHAR(32)',
        true, // NULLABLE để tương thích ngược 100% với ứng dụng đang chạy
        null,
        this.lockTimeoutMs
      );
    });

    this.log(`Bước 1 hoàn tất. Lược đồ hiện đã mở rộng với cột "${this.newColumn}". Các ứng dụng cũ vẫn hoạt động bình thường.`);
    return true;
  }

  /**
   * BƯỚC 2: DUAL-WRITE (Ghi kép)
   * Thiết lập cơ chế ghi đồng thời vào cả cột cũ và cột mới khi có dữ liệu phát sinh
   */
  async step2_enableDualWrite() {
    this.currentPhase = MigrationPhase.PHASE_2_DUAL_WRITE;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bắt đầu Bước 2 (Dual-Write): Kích hoạt Trigger đồng bộ dữ liệu tự động giữa "${this.oldColumn}" và "${this.newColumn}"`);

    const triggerName = `trg_sync_${this.oldColumn}_to_${this.newColumn}`;
    
    // Đăng ký trigger ghi kép
    this.table.addTrigger(triggerName, 'BEFORE', 'ALL', (op, oldRow, newRow) => {
      // Khi có INSERT hoặc UPDATE vào oldColumn mà newColumn chưa có giá trị mới
      if (newRow[this.oldColumn] !== undefined) {
        newRow[this.newColumn] = this.transformFn(newRow[this.oldColumn]);
        this.dualWritesCount++;
      }
    });

    this.log(`Bước 2 hoàn tất. Trigger ghi kép "${triggerName}" đang hoạt động. Mọi INSERT/UPDATE mới đều được ghi vào cả 2 cột.`);
    return true;
  }

  /**
   * BƯỚC 3: BATCHED BACKFILLING (Lấp đầy dữ liệu lịch sử theo khối)
   * Quét và cập nhật các dòng cũ theo từng khối nhỏ để không gây quá tải CPU/Lock/WAL
   */
  async step3_backfill(onProgress = null) {
    this.currentPhase = MigrationPhase.PHASE_3_BACKFILL;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bắt đầu Bước 3 (Batched Backfilling): Quét các bản ghi lịch sử có "${this.newColumn}" IS NULL theo batch=${this.batchSize}`);

    // Đếm tổng số bản ghi cần backfill
    const allRows = Array.from(this.table.rows.values());
    const candidates = allRows.filter(r => r[this.newColumn] === null || r[this.newColumn] === undefined);
    this.totalToBackfill = candidates.length;
    this.backfilledCount = 0;

    this.log(`Phát hiện ${this.totalToBackfill} bản ghi cần chuyển đổi dữ liệu lịch sử.`);

    // Chia thành từng batch nhỏ
    for (let i = 0; i < candidates.length; i += this.batchSize) {
      const batch = candidates.slice(i, i + this.batchSize);
      const updates = batch.map(row => ({
        id: row.id,
        changes: {
          [this.newColumn]: this.transformFn(row[this.oldColumn])
        }
      }));

      const txId = `backfill_batch_${Math.floor(i / this.batchSize) + 1}`;
      await this.table.backfillBatch(txId, updates, this.lockTimeoutMs);

      this.backfilledCount += updates.length;
      if (onProgress) {
        onProgress({
          processed: this.backfilledCount,
          total: this.totalToBackfill,
          percentage: Math.round((this.backfilledCount / this.totalToBackfill) * 100)
        });
      }

      // Giãn cách giữa các batch để nhường I/O và CPU cho traffic chính
      if (this.batchDelayMs > 0 && i + this.batchSize < candidates.length) {
        await new Promise(r => setTimeout(r, this.batchDelayMs));
      }
    }

    this.log(`Bước 3 hoàn tất. Đã chuyển đổi thành công ${this.backfilledCount}/${this.totalToBackfill} bản ghi lịch sử.`);
    return this.backfilledCount;
  }

  /**
   * BƯỚC 4: READ CUTOVER (Chuyển hướng đọc sang cột mới)
   * Chuyển logic đọc của ứng dụng sang cột mới. Vẫn duy trì ghi kép dự phòng rollback.
   */
  async step4_switchRead() {
    this.currentPhase = MigrationPhase.PHASE_4_READ_CUTOVER;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bắt đầu Bước 4 (Read Cutover): Hoán chuyển 100% logic đọc từ "${this.oldColumn}" sang "${this.newColumn}"`);

    // Kiểm tra tính toàn vẹn trước khi chuyển
    const unmigrated = Array.from(this.table.rows.values()).filter(
      r => r[this.newColumn] === null || r[this.newColumn] === undefined
    );

    if (unmigrated.length > 0) {
      throw new Error(`[CUTOVER_ABORTED] Còn ${unmigrated.length} bản ghi chưa được chuyển đổi! Không thể chuyển hướng đọc.`);
    }

    // Đổi biến đích đọc
    this.currentReadTarget = this.newColumn;
    this.log(`Bước 4 hoàn tất. Ứng dụng hiện đang đọc trực tiếp từ "${this.newColumn}". Ghi kép vẫn được duy trì để hỗ trợ Instant Rollback nếu cần.`);
    return true;
  }

  /**
   * BƯỚC 5: CONTRACT (Thu hẹp & Dọn dẹp)
   * Gỡ bỏ trigger ghi kép và phát lệnh DROP COLUMN cũ an toàn
   */
  async step5_contract() {
    this.currentPhase = MigrationPhase.PHASE_5_CONTRACT;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bắt đầu Bước 5 (Contract): Gỡ bỏ trigger ghi kép và DROP COLUMN "${this.oldColumn}"`);

    // 5.1: Gỡ bỏ Trigger ghi kép
    const triggerName = `trg_sync_${this.oldColumn}_to_${this.newColumn}`;
    this.table.removeTrigger(triggerName);
    this.log(`Đã hủy đăng ký trigger ghi kép "${triggerName}".`);

    // 5.2: DROP COLUMN cũ an toàn với lock_timeout
    await this.executeSafeDDL(`DROP_COLUMN_${this.oldColumn}`, async (txId) => {
      return await this.table.alterTableDropColumn(
        txId,
        this.oldColumn,
        this.lockTimeoutMs
      );
    });

    this.currentPhase = MigrationPhase.COMPLETED;
    this.phaseTimestamps[this.currentPhase] = Date.now();
    this.log(`Bước 5 hoàn tất! Di cư lược đồ Zero-Downtime Migration hoàn thành xuất sắc 100%. Cột cũ "${this.oldColumn}" đã được dọn dẹp sạch sẽ.`);
    return true;
  }

  /**
   * Chạy toàn bộ quy trình 5 bước Expand/Contract tuần tự
   */
  async runFullMigration(onProgress = null) {
    try {
      await this.step1_expand();
      await this.step2_enableDualWrite();
      await this.step3_backfill(onProgress);
      await this.step4_switchRead();
      await this.step5_contract();
      return { success: true, phase: this.currentPhase, backfilled: this.backfilledCount };
    } catch (err) {
      this.currentPhase = MigrationPhase.FAILED;
      this.errors.push(err.message);
      this.log(`[MIGRATION_FAILED] Lỗi tại pha ${this.currentPhase}: ${err.message}`);
      throw err;
    }
  }

  /**
   * Hàm đọc dữ liệu dành cho ứng dụng (Application Read Gateway)
   * Tự động đọc theo cột hiện hành tương ứng với từng giai đoạn
   */
  readField(row) {
    return row[this.currentReadTarget];
  }

  /**
   * Xuất báo cáo trạng thái hoàn chỉnh cho Dashboard / API
   */
  getTelemetry() {
    return {
      currentPhase: this.currentPhase,
      currentReadTarget: this.currentReadTarget,
      oldColumn: this.oldColumn,
      newColumn: this.newColumn,
      totalRows: this.table.count(),
      backfilledCount: this.backfilledCount,
      totalToBackfill: this.totalToBackfill,
      dualWritesCount: this.dualWritesCount,
      readCounter: this.table.readCounter,
      writeCounter: this.table.writeCounter,
      phaseTimestamps: this.phaseTimestamps,
      lockStatus: this.table.lockManager.getSnapshot(),
      logs: this.logs.slice(-50), // 50 logs gần nhất
      errors: this.errors
    };
  }
}

// ============================================================================
// PHẦN 4: BỘ MÔ PHỎNG HÀNG ĐỢI KHÓA & TẮC NGHẼN (LOCK QUEUE SIMULATOR)
// ============================================================================

/**
 * Lớp chuyên trách mô phỏng hiện tượng Head-of-Line Blocking và kỹ thuật cứu cánh
 */
class LockQueueSimulator {
  constructor() {
    this.table = new InMemoryTable('transactions');
    // Khởi tạo cột cơ bản
    this.table.addColumnDefinition('id', 'INT', false);
    this.table.addColumnDefinition('amount', 'NUMERIC(12,2)', false, 0);
  }

  /**
   * KỊCH BẢN THẢM HỌA: Head-of-Line Blocking KHÔNG CÓ lock_timeout
   * Client 1 giữ AccessShareLock lâu -> DDL đến đòi AccessExclusiveLock không timeout ->
   * Toàn bộ các câu SELECT của người dùng đến sau bị kẹt cứng trong hàng đợi!
   */
  async simulateCatastrophicHeadOfLineBlocking() {
    const results = {
      scenario: 'CATASTROPHIC_HOL_BLOCKING_WITHOUT_TIMEOUT',
      slowQueryDurationMs: 800,
      ddlWaitMs: 0,
      normalQueriesBlocked: 0,
      maxNormalQueryLatencyMs: 0,
      events: []
    };

    const addEvent = (msg) => results.events.push({ time: Date.now(), msg });

    // 1. Client 1: Truy vấn phân tích chậm giữ AccessShareLock trong 800ms
    const pClient1 = (async () => {
      const txId = 'tx_analytics_slow_01';
      addEvent('[Client 1] Bắt đầu câu SELECT báo cáo chậm (Yêu cầu AccessShareLock)');
      await this.table.lockManager.acquire(txId, LockMode.ACCESS_SHARE, 0);
      addEvent('[Client 1] Đã nhận AccessShareLock. Bắt đầu xử lý tính toán trong 800ms...');
      await new Promise(r => setTimeout(r, results.slowQueryDurationMs));
      this.table.lockManager.release(txId);
      addEvent('[Client 1] Hoàn tất và giải phóng AccessShareLock.');
    })();

    // Đợi 50ms để Client 1 chiếm chắc khóa
    await new Promise(r => setTimeout(r, 50));

    // 2. Migration DDL: ALTER TABLE đến đòi AccessExclusiveLock với lock_timeout = 0 (Vô hạn)
    const pDDL = (async () => {
      const txId = 'tx_ddl_migration_unsafe';
      const start = Date.now();
      addEvent('[DDL Unsafe] ALTER TABLE ADD COLUMN status... Yêu cầu AccessExclusiveLock (lock_timeout=0)');
      await this.table.lockManager.acquire(txId, LockMode.ACCESS_EXCLUSIVE, 0);
      results.ddlWaitMs = Date.now() - start;
      addEvent(`[DDL Unsafe] Đã nhận AccessExclusiveLock sau khi chờ ${results.ddlWaitMs}ms!`);
      // Giữ thêm 50ms để làm DDL
      await new Promise(r => setTimeout(r, 50));
      this.table.lockManager.release(txId);
      addEvent('[DDL Unsafe] Hoàn tất DDL và giải phóng AccessExclusiveLock.');
    })();

    // Đợi thêm 50ms để DDL xếp vào vị trí Head of Line
    await new Promise(r => setTimeout(r, 50));

    // 3. Normal Web Traffic: 5 truy vấn SELECT của người dùng ập đến
    // Mặc dù SELECT tương thích với Client 1, nhưng do DDL đang đứng đầu hàng đợi nên BỊ KẸT LẠI!
    const normalQueries = [];
    for (let i = 1; i <= 5; i++) {
      normalQueries.push((async () => {
        const txId = `tx_web_select_${i}`;
        const start = Date.now();
        addEvent(`[Web Traffic ${i}] Câu SELECT thông thường đến.`);
        await this.table.lockManager.acquire(txId, LockMode.ACCESS_SHARE, 5000);
        const latency = Date.now() - start;
        results.normalQueriesBlocked++;
        if (latency > results.maxNormalQueryLatencyMs) {
          results.maxNormalQueryLatencyMs = latency;
        }
        addEvent(`[Web Traffic ${i}] Hoàn thành sau khi bị nghẽn ${latency}ms!`);
        this.table.lockManager.release(txId);
      })());
      await new Promise(r => setTimeout(r, 40));
    }

    await Promise.all([pClient1, pDDL, ...normalQueries]);
    return results;
  }

  /**
   * KỊCH BẢN PHÒNG HỘ: Khống chế bằng lock_timeout (200ms) + Exponential Backoff Retry
   * Khi DDL phát hiện bị kẹt sau 200ms -> Hủy DDL an toàn -> Giải phóng hàng đợi cho Web Traffic ->
   * Lùi ngẫu nhiên và thử lại sau khi Client 1 chạy xong -> Cả hai bên đều thành công!
   */
  async simulateResilientLockTimeoutWithBackoff() {
    const results = {
      scenario: 'RESILIENT_LOCK_TIMEOUT_AND_BACKOFF',
      lockTimeoutMs: 200,
      ddlAttempts: 0,
      ddlTimeoutsCount: 0,
      ddlFinalSuccess: false,
      maxWebQueryLatencyMs: 0,
      events: []
    };

    const addEvent = (msg) => results.events.push({ time: Date.now(), msg });

    // 1. Client 1: Truy vấn phân tích chậm giữ AccessShareLock trong 600ms
    const pClient1 = (async () => {
      const txId = 'tx_analytics_slow_02';
      addEvent('[Client 1] Bắt đầu câu SELECT phân tích (AccessShareLock, dự kiến 600ms)');
      await this.table.lockManager.acquire(txId, LockMode.ACCESS_SHARE, 0);
      addEvent('[Client 1] Đã chiếm AccessShareLock. Bắt đầu tính toán...');
      await new Promise(r => setTimeout(r, 600));
      this.table.lockManager.release(txId);
      addEvent('[Client 1] Hoàn tất và giải phóng AccessShareLock.');
    })();

    // Đợi 50ms cho Client 1 chiếm khóa
    await new Promise(r => setTimeout(r, 50));

    // 2. Migration DDL: ALTER TABLE với lock_timeout=200ms và retry loop
    const pDDL = (async () => {
      let success = false;
      let attempt = 0;
      const baseBackoff = 150;

      while (!success && attempt < 5) {
        attempt++;
        results.ddlAttempts++;
        const txId = `tx_ddl_safe_attempt_${attempt}`;
        addEvent(`[DDL Safe] Lần thử ${attempt}: Yêu cầu AccessExclusiveLock (lock_timeout=${results.lockTimeoutMs}ms)...`);
        
        try {
          await this.table.lockManager.acquire(txId, LockMode.ACCESS_EXCLUSIVE, results.lockTimeoutMs);
          // Chiếm khóa thành công!
          addEvent(`[DDL Safe] Lần thử ${attempt}: THÀNH CÔNG! Đã chiếm AccessExclusiveLock.`);
          await new Promise(r => setTimeout(r, 30));
          this.table.lockManager.release(txId);
          success = true;
          results.ddlFinalSuccess = true;
          addEvent(`[DDL Safe] Hoàn tất DDL và giải phóng khóa.`);
        } catch (err) {
          if (err instanceof LockTimeoutError) {
            results.ddlTimeoutsCount++;
            addEvent(`[DDL Safe] Lần thử ${attempt}: HẾT HẠN lock_timeout (${err.waitedMs}ms). Tự động hủy để cứu hàng đợi!`);
            // Lùi ngẫu nhiên (Backoff)
            const backoff = baseBackoff * attempt + Math.floor(Math.random() * 50);
            addEvent(`[DDL Safe] Lùi thời gian chờ (Backoff) ${backoff}ms...`);
            await new Promise(r => setTimeout(r, backoff));
          } else {
            throw err;
          }
        }
      }
    })();

    // Đợi 100ms sau khi DDL thử lần 1
    await new Promise(r => setTimeout(r, 100));

    // 3. Normal Web Traffic: Các câu SELECT của người dùng
    const normalQueries = [];
    for (let i = 1; i <= 4; i++) {
      normalQueries.push((async () => {
        const txId = `tx_web_resilient_${i}`;
        const start = Date.now();
        addEvent(`[Web Traffic ${i}] Câu SELECT thông thường đến.`);
        // Timeout 3000ms
        await this.table.lockManager.acquire(txId, LockMode.ACCESS_SHARE, 3000);
        const latency = Date.now() - start;
        if (latency > results.maxWebQueryLatencyMs) {
          results.maxWebQueryLatencyMs = latency;
        }
        addEvent(`[Web Traffic ${i}] Hoàn thành mượt mà, độ trễ: ${latency}ms.`);
        this.table.lockManager.release(txId);
      })());
      await new Promise(r => setTimeout(r, 80));
    }

    await Promise.all([pClient1, pDDL, ...normalQueries]);
    return results;
  }
}

// ============================================================================
// PHẦN 5: BỘ KIỂM THỬ TỰ ĐỘNG TÍCH HỢP (BUILT-IN AUTOMATED TEST SUITE)
// ============================================================================

/**
 * Chạy toàn bộ các bài kiểm thử kiểm chứng chất lượng và in kết quả chi tiết
 */
async function runAllTests() {
  console.log('\n================================================================================');
  console.log('🏛️  DATABASE MASTERCLASS - LAB 01: ZERO-DOWNTIME SCHEMA MIGRATIONS TEST HARNESS');
  console.log('================================================================================\n');

  let passedTests = 0;
  let totalTests = 2;

  // --------------------------------------------------------------------------
  // TEST 1: KIỂM CHỨNG EXPAND/CONTRACT HOÀN TẤT KHÔNG MẤT MÁT DỮ LIỆU & ĐỌC LIÊN TỤC
  // --------------------------------------------------------------------------
  console.log('🧪 [TEST 1/2] Kiểm chứng Mẫu hình Expand/Contract (Blue-Green Columns)');
  console.log('--------------------------------------------------------------------------------');

  const table = new InMemoryTable('users');
  table.addColumnDefinition('id', 'INT', false);
  table.addColumnDefinition('name', 'VARCHAR(100)', false);
  table.addColumnDefinition('phone', 'VARCHAR(30)', false);

  // 1. Nạp 1,000 bản ghi dữ liệu mẫu với số điện thoại dạng nội địa cũ (090xxxxxxx)
  console.log('-> Đang nạp 1,000 người dùng mẫu vào bảng...');
  for (let i = 1; i <= 1000; i++) {
    const rawPhone = '09' + String(10000000 + i).slice(1);
    await table.insert(`seed_${i}`, {
      id: i,
      name: `User_${i}`,
      phone: rawPhone
    });
  }
  console.log(`-> Đã nạp thành công ${table.count()} bản ghi vào bảng "${table.name}".`);

  // 2. Khởi tạo Engine di cư từ "phone" sang "phone_e164"
  const engine = new ZeroDowntimeMigrationEngine({
    table,
    oldColumn: 'phone',
    newColumn: 'phone_e164',
    batchSize: 100,
    batchDelayMs: 25,
    lockTimeoutMs: 2000
  });

  // 3. Khởi động luồng Traffic người dùng đồng thời (Concurrent Reader & Writer)
  let trafficRunning = true;
  let readSuccessCount = 0;
  let readFailureCount = 0;
  let writeSuccessCount = 0;
  let writeFailureCount = 0;
  let concurrentNewUsersCreated = 0;

  // Reader Worker (Cao tần ~300 reads/sec)
  const readerWorker = (async () => {
    let nextId = 1;
    while (trafficRunning) {
      try {
        const idToRead = (nextId++ % 1000) + 1;
        const res = await table.select(`read_tx_${Date.now()}`, r => r.id === idToRead);
        if (res.length > 0) {
          const val = engine.readField(res[0]);
          if (val) {
            readSuccessCount++;
          } else {
            readFailureCount++;
          }
        }
      } catch (err) {
        readFailureCount++;
      }
      await new Promise(r => setTimeout(r, 4));
    }
  })();

  // Writer Worker (Ghi mới và cập nhật người dùng liên tục trong khi đang di cư)
  const writerWorker = (async () => {
    let userSeq = 1001;
    while (trafficRunning) {
      try {
        const newId = userSeq++;
        const phone = '09' + String(20000000 + newId).slice(1);
        await table.insert(`insert_tx_${Date.now()}`, {
          id: newId,
          name: `Concurrent_User_${newId}`,
          phone: phone
        });
        writeSuccessCount++;
        concurrentNewUsersCreated++;
      } catch (err) {
        writeFailureCount++;
      }
      await new Promise(r => setTimeout(r, 12));
    }
  })();

  // 4. Kích hoạt toàn bộ quy trình 5 bước di cư
  console.log('-> Đang khởi chạy 5 bước Expand/Contract đồng thời với Web Traffic...');
  const migrationStart = Date.now();
  
  await engine.step1_expand();
  console.log('   ✓ Bước 1 (Expand) hoàn tất: Cột mới "phone_e164" đã được thêm.');

  await engine.step2_enableDualWrite();
  console.log('   ✓ Bước 2 (Dual-Write) hoàn tất: Trigger đồng bộ đã được kích hoạt.');

  await engine.step3_backfill((p) => {
    // Progress callback
  });
  console.log(`   ✓ Bước 3 (Backfill) hoàn tất: Đã lấp đầy ${engine.backfilledCount} bản ghi lịch sử.`);

  await engine.step4_switchRead();
  console.log('   ✓ Bước 4 (Read Cutover) hoàn tất: Đã chuyển hướng đọc sang "phone_e164".');

  await engine.step5_contract();
  console.log('   ✓ Bước 5 (Contract) hoàn tất: Trigger ghi kép và cột cũ "phone" đã được xóa.');

  const migrationDuration = Date.now() - migrationStart;

  // Dừng luồng Traffic
  trafficRunning = false;
  await Promise.all([readerWorker, writerWorker]);

  // 5. Kiểm tra tính toàn vẹn dữ liệu (Data Integrity Audit)
  console.log('-> Đang kiểm toán toàn vẹn dữ liệu sau di cư...');
  const allFinalRows = await table.select('audit_tx', null);
  let unmigratedCount = 0;
  let invalidFormatCount = 0;

  for (const row of allFinalRows) {
    if (!row.phone_e164) {
      unmigratedCount++;
    } else if (!row.phone_e164.startsWith('+84')) {
      invalidFormatCount++;
    }
  }

  const test1Assertions = [
    { desc: 'Tổng số bản ghi không bị thất thoát', pass: allFinalRows.length >= 1000 + concurrentNewUsersCreated },
    { desc: 'Số lỗi đọc (Read Failures) bằng 0', pass: readFailureCount === 0 },
    { desc: 'Số lỗi ghi (Write Failures) bằng 0', pass: writeFailureCount === 0 },
    { desc: 'Số bản ghi chưa được chuyển đổi bằng 0', pass: unmigratedCount === 0 },
    { desc: '100% bản ghi đúng định dạng quốc tế (+84...) E.164', pass: invalidFormatCount === 0 },
    { desc: 'Cột cũ "phone" đã được loại bỏ khỏi schema', pass: !table.columns.has('phone') },
    { desc: 'Cột mới "phone_e164" tồn tại trong schema', pass: table.columns.has('phone_e164') }
  ];

  console.log('\n📊 KẾT QUẢ KIỂM THỬ BÀI 1:');
  console.table(test1Assertions.map(a => ({ 'Tiêu chí kiểm thử': a.desc, 'Trạng thái': a.pass ? '✅ PASS' : '❌ FAIL' })));
  console.log(`⏱️  Thời gian di cư hoàn thành: ${migrationDuration}ms | Reads thành công: ${readSuccessCount} | Writes đồng thời: ${writeSuccessCount}\n`);

  const test1Passed = test1Assertions.every(a => a.pass);
  if (test1Passed) passedTests++;

  // --------------------------------------------------------------------------
  // TEST 2: KIỂM CHỨNG LOCK_TIMEOUT KÍCH HOẠT CHÍNH XÁC, HỦY LỆNH & RETRY THÀNH CÔNG
  // --------------------------------------------------------------------------
  console.log('🧪 [TEST 2/2] Kiểm chứng Lock Queue, Head-of-Line Blocking & Lock Timeout Rescue');
  console.log('--------------------------------------------------------------------------------');

  const sim = new LockQueueSimulator();

  console.log('-> Mô phỏng 1: Khảo sát hiện tượng thảm họa Head-of-Line Blocking (Không có lock_timeout)...');
  const catRes = await sim.simulateCatastrophicHeadOfLineBlocking();
  console.log(`   ⚠️ Kết quả: 5 câu SELECT thông thường bị tắc nghẽn hoàn toàn! Độ trễ cao nhất: ${catRes.maxNormalQueryLatencyMs}ms`);

  console.log('-> Mô phỏng 2: Kích hoạt cơ chế phòng hộ lock_timeout (200ms) + Exponential Backoff Retry...');
  const resRes = await sim.simulateResilientLockTimeoutWithBackoff();
  console.log(`   🛡️ DDL đã chủ động hủy bỏ an toàn ${resRes.ddlTimeoutsCount} lần để nhường đường cho Web Traffic!`);
  console.log(`   🛡️ Web Traffic hoàn thành mượt mà với độ trễ tối đa chỉ: ${resRes.maxWebQueryLatencyMs}ms`);
  console.log(`   🛡️ DDL sau đó lùi thời gian (Backoff) và thành công mỹ mãn ở lần thử ${resRes.ddlAttempts}!`);

  const test2Assertions = [
    { desc: 'HOL Blocking được tái hiện chuẩn xác (Độ trễ SELECT bị đẩy lên cao khi DDL vô hạn)', pass: catRes.maxNormalQueryLatencyMs >= 600 },
    { desc: 'lock_timeout kích hoạt chính xác khi bị kẹt khóa', pass: resRes.ddlTimeoutsCount > 0 },
    { desc: 'Độ trễ Web Traffic được bảo vệ an toàn (Giảm rõ rệt so với kịch bản thảm họa)', pass: resRes.maxWebQueryLatencyMs < catRes.maxNormalQueryLatencyMs },
    { desc: 'DDL retry thành công sau khi câu query cản đường hoàn tất', pass: resRes.ddlFinalSuccess === true }
  ];

  console.log('\n📊 KẾT QUẢ KIỂM THỬ BÀI 2:');
  console.table(test2Assertions.map(a => ({ 'Tiêu chí kiểm thử': a.desc, 'Trạng thái': a.pass ? '✅ PASS' : '❌ FAIL' })));

  const test2Passed = test2Assertions.every(a => a.pass);
  if (test2Passed) passedTests++;

  // --------------------------------------------------------------------------
  // TỔNG KẾT
  // --------------------------------------------------------------------------
  console.log('\n================================================================================');
  if (passedTests === totalTests) {
    console.log(`🎉 CHÚC MỪNG: HOÀN TẤT TOÀN DIỆN 2/2 BÀI KIỂM THỬ DATABASE MASTERCLASS LAB 01!`);
    console.log(`   - Expand/Contract Blue-Green: 100% Zero-Downtime & Zero Data Loss`);
    console.log(`   - Head-of-Line Blocking Protection: lock_timeout + Exponential Backoff Verified`);
  } else {
    console.log(`❌ THẤT BẠI: Chỉ đạt ${passedTests}/${totalTests} bài kiểm thử.`);
  }
  console.log('================================================================================\n');

  return {
    passedTests,
    totalTests,
    test1Passed,
    test2Passed,
    success: passedTests === totalTests
  };
}

// ============================================================================
// PHẦN 6: EXPORTS CHO WEB DASHBOARD & REST API
// ============================================================================

module.exports = {
  LockMode,
  LockConflictMatrix,
  LockTimeoutError,
  LockManager,
  InMemoryTable,
  MigrationPhase,
  ZeroDowntimeMigrationEngine,
  LockQueueSimulator,
  runAllTests
};

// Tự động chạy bộ kiểm thử khi gọi trực tiếp bằng Node
if (require.main === module) {
  runAllTests().then(res => {
    if (!res.success) {
      process.exit(1);
    }
  }).catch(err => {
    console.error('Unhandled Test Runner Error:', err);
    process.exit(1);
  });
}
