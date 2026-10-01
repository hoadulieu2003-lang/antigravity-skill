/**
 * ============================================================================
 * 🛡️ MODULE 08 LAB: DATABASE RELIABILITY ENGINEERING (DBRE) & TELEMETRY SIMULATOR
 * ============================================================================
 * Chủ quản (Owner): Anh — Lead Architect / Product Owner
 * Tác tử Thi công (Author): Senior Engineering Agent (Pod 8 Specialist)
 * Hệ quy chiếu: PostgreSQL 15/16+ Internals, HikariCP, PgBouncer, Linux Kernel
 * Vị trí file: knowledge/database_masterclass/labs/lab08_dbre_telemetry.js
 * Runtime: Pure Node.js (Zero external dependencies)
 *
 * MÔ TẢ MÔ-ĐUN PHÒNG THÍ NGHIỆM (LAB MODULE DESCRIPTION):
 * 1. ConnectionPoolSimulator:
 *    - Mô phỏng hàng đợi yêu cầu (Request Queue) và hồ bơi kết nối (Connection Pool)
 *      theo chuẩn HikariCP và PgBouncer Transaction Pooling.
 *    - Kiểm chứng thực nghiệm Định luật Little (Little's Law: L = λ * W) với độ chính xác tuyệt đối.
 *    - Đo lường và đối chứng kịch bản Hồ bơi quá lớn (Oversized Pool: 500-1000 conns)
 *      gây bão chuyển đổi ngữ cảnh CPU (Context Switching Storm) và tranh chấp khóa nội bộ (ProcArrayLock)
 *      so với Hồ bơi tối ưu theo công thức HikariCP (2 * Cores + Spindles).
 * 2. TableBloatSimulator:
 *    - Mô phỏng cấu trúc Heap Page 8KB trong PostgreSQL MVCC.
 *    - Tái hiện tác động của UPDATE / DELETE tạo Dead Tuples trên đĩa cứng.
 *    - Tính toán Tỷ lệ phình to (Bloat Ratio) và mô phỏng chu trình dọn dẹp của Autovacuum
 *      dựa trên công thức chuẩn: threshold = autovacuum_vacuum_threshold + scale_factor * live_tuples.
 *    - Mô phỏng sự khác biệt cốt tử giữa VACUUM (dọn rác nội bộ page, nạp FSM) và pg_repack / VACUUM FULL
 *      (thu hồi dung lượng vật lý trả về cho Hệ điều hành - OS).
 * 3. PITRTimelineReplay:
 *    - Mô phỏng quá trình Phục hồi chính xác theo thời gian (Point-In-Time Recovery - PITR).
 *    - Phối hợp bản sao lưu vật lý cơ sở (Physical Base Backup) và Nhật ký ghi trước (WAL Archiving).
 *    - Tái hiện chuỗi giao dịch (REDO Phase) tới mốc target_time chỉ định, loại trừ giao dịch
 *      phá hoại dữ liệu (tai họa DROP TABLE ngoài ý muốn), thăng hạng node thành Primary trên Timeline mới.
 * 4. Built-in Automated Test Suite:
 *    - Test 1: HikariCP sizing formula mang lại throughput cao hơn và P99 latency thấp hơn >10x
 *      so với oversized connection pool, kiểm chứng Little's Law.
 *    - Test 2: Table Bloat được tính toán chính xác và autovacuum giải phóng không gian thành công.
 *    - Test 3: PITR replay thành công đưa database về thời điểm 1 giây trước lệnh DROP TABLE tai hại.
 * ============================================================================
 */

'use strict';

// ============================================================================
// 1. CONNECTION POOL SIMULATOR & LITTLE'S LAW EMPIRICAL ENGINE
// ============================================================================

/**
 * Thống kê định lượng phân phối độ trễ (Latency Distribution Calculator)
 * Helper tính toán Mean, P50, P90, P99 Latency và Bounds
 */
class LatencyStats {
  /**
   * @param {number[]} samples - Mảng các mẫu độ trễ tính bằng mili-giây (ms)
   */
  constructor(samples = []) {
    this.samples = samples.slice().sort((a, b) => a - b);
    this.count = this.samples.length;
  }

  getMean() {
    if (this.count === 0) return 0;
    const sum = this.samples.reduce((acc, val) => acc + val, 0);
    return sum / this.count;
  }

  getPercentile(p) {
    if (this.count === 0) return 0;
    const rank = Math.min(Math.floor((p / 100) * this.count), this.count - 1);
    return this.samples[rank];
  }

  getP50() { return this.getPercentile(50); }
  getP90() { return this.getPercentile(90); }
  getP99() { return this.getPercentile(99); }
  getMin() { return this.count > 0 ? this.samples[0] : 0; }
  getMax() { return this.count > 0 ? this.samples[this.count - 1] : 0; }
}

/**
 * Bộ mô phỏng Hồ bơi Kết nối & Định luật Little
 * Connection Pool Simulator with CPU Context Switching & Lock Contention Physics
 */
class ConnectionPoolSimulator {
  /**
   * @param {Object} options
   * @param {number} options.cpuCores - Số nhân CPU logic (Logical CPU Cores)
   * @param {number} options.spindles - Số lượng Spindles / Kênh I/O dự trữ
   * @param {number} options.baseQueryTimeMs - Thời gian thực thi thuần không tranh chấp (ms)
   */
  constructor(options = {}) {
    this.cpuCores = options.cpuCores || 8;
    this.spindles = options.spindles || 2;
    this.baseQueryTimeMs = options.baseQueryTimeMs || 2.0;

    // Công thức kinh điển HikariCP: Connections = (Cores * 2) + Spindles
    this.hikariRecommendedPoolSize = (this.cpuCores * 2) + this.spindles;
  }

  /**
   * Tính toán hệ số suy giảm hiệu năng do tranh chấp CPU & Lock (Contention Multiplier)
   *
   * Khi số lượng kết nối tích cực (Active Connections) vượt quá số Cores:
   * 1. OS Kernel Scheduler tốn chi phí Context Switch liên tục giữa hàng trăm processes.
   * 2. Database Engine (như PostgreSQL Backend) chịu tranh chấp dữ dội tại bảng trạng thái
   *    giao dịch toàn cục `procarray`, `WALWriteLock` và Spinlocks.
   *
   * @param {number} activeConnections - Số kết nối đang chạy query đồng thời trên Server
   * @returns {number} Hệ số nhân thời gian thực thi (Execution Time Multiplier >= 1.0)
   */
  calculateContentionMultiplier(activeConnections) {
    if (activeConnections <= this.cpuCores) {
      // Dưới hoặc bằng số Cores: Gần như 0 tranh chấp CPU, cache L1/L2 ấm hoàn hảo
      return 1.0;
    }

    const excessRatio = (activeConnections - this.cpuCores) / this.cpuCores;
    const normalizedLoad = activeConnections / this.cpuCores;

    // 1. Phí tổn chuyển đổi ngữ cảnh OS (Context Switch Penalty)
    const contextSwitchPenalty = 0.40 * excessRatio;

    // 2. Phí tổn tranh chấp Khóa nội bộ (Spinlock & ProcArray Contention Penalty)
    // Theo Universal Scalability Law (USL), độ trễ do lock contention tăng theo hàm lũy thừa O(N^2)
    const lockContentionPenalty = 0.25 * Math.pow(normalizedLoad, 2.0);

    return 1.0 + contextSwitchPenalty + lockContentionPenalty;
  }

  /**
   * Thực hiện mô phỏng tải khép kín đồng thời (Closed-loop Concurrent Workload Simulation)
   * Tái hiện chính xác cách các ứng dụng thực tế (Microservices / Web App) gửi tải tới Database.
   *
   * @param {Object} scenario
   * @param {number} scenario.poolSize - Kích thước Pool (Số kết nối đồng thời tối đa tới DB)
   * @param {number} scenario.totalRequests - Tổng số yêu cầu cần xử lý
   * @param {number} scenario.concurrency - Số luồng Client đồng thời gửi request (Concurrent Clients)
   * @param {number} scenario.warmupSpreadMs - Thời gian dàn trải khởi động các client (ms)
   * @returns {Object} Báo cáo chi tiết gồm Throughput, Latency stats, Little's Law verification
   */
  simulateWorkload(scenario) {
    const {
      poolSize,
      totalRequests = 3000,
      concurrency = 500,
      warmupSpreadMs = 50,
    } = scenario;

    let currentTimeMs = 0;
    let completedRequests = 0;
    let activeConnections = 0; // Connections đang chạy câu SQL trên DB engine
    const queue = []; // Hàng đợi yêu cầu chờ kết nối rảnh (FIFO Connection Queue)

    const responseTimes = []; // Tổng thời gian Turnaround (Queue Wait + DB Execution)
    const queueWaitTimes = []; // Thời gian xếp hàng trong Connection Pooler
    const executionTimes = []; // Thời gian thực thi thực tế trong DB Engine

    // Mẫu tích lũy để kiểm chứng Định luật Little (Time-weighted In-Flight Area)
    let totalInFlightAreaMs = 0;
    let lastEventTimeMs = 0;

    // Danh sách sự kiện rời rạc (Discrete Events Heap / Array)
    const events = [];
    let dispatchedRequests = 0;

    // Khởi tạo các Client gửi yêu cầu ban đầu (Dàn trải trong warmupSpreadMs)
    for (let c = 0; c < concurrency && dispatchedRequests < totalRequests; c++) {
      const initialArrival = Math.random() * warmupSpreadMs;
      events.push({
        time: initialArrival,
        type: 'ARRIVAL',
        clientIndex: c,
        reqTime: initialArrival,
      });
      dispatchedRequests++;
    }

    // Vòng lặp sự kiện rời rạc (Discrete Event Simulation Loop)
    while (events.length > 0 && completedRequests < totalRequests) {
      // Lấy sự kiện có mốc thời gian sớm nhất
      events.sort((a, b) => a.time - b.time);
      const ev = events.shift();

      // Cập nhật tích lũy diện tích In-Flight phục vụ định luật Little
      const deltaT = Math.max(0, ev.time - lastEventTimeMs);
      const currentInFlight = activeConnections + queue.length;
      totalInFlightAreaMs += currentInFlight * deltaT;
      lastEventTimeMs = ev.time;
      currentTimeMs = ev.time;

      if (ev.type === 'ARRIVAL') {
        if (activeConnections < poolSize) {
          // Còn kết nối rảnh trong Pool: Nhận kết nối và bắt đầu thực thi ngay
          activeConnections++;
          queueWaitTimes.push(0);

          const contention = this.calculateContentionMultiplier(activeConnections);
          const jitter = 0.85 + 0.30 * Math.random(); // Phương sai thời gian truy vấn
          const duration = this.baseQueryTimeMs * contention * jitter;
          executionTimes.push(duration);

          events.push({
            time: currentTimeMs + duration,
            type: 'FINISH',
            clientIndex: ev.clientIndex,
            reqTime: ev.reqTime,
          });
        } else {
          // Pool đã đầy: Đưa vào hàng đợi của Pooler (PgBouncer/HikariCP Client Queue)
          queue.push(ev);
        }
      } else if (ev.type === 'FINISH') {
        // Truy vấn thực thi xong: Trả kết nối về Pool
        activeConnections--;
        completedRequests++;
        const turnaround = currentTimeMs - ev.reqTime;
        responseTimes.push(turnaround);

        // Nếu có request đang chờ trong Queue, nhường kết nối vừa rảnh ngay lập tức
        if (queue.length > 0) {
          const nextReq = queue.shift();
          activeConnections++;
          queueWaitTimes.push(currentTimeMs - nextReq.reqTime);

          const contention = this.calculateContentionMultiplier(activeConnections);
          const jitter = 0.85 + 0.30 * Math.random();
          const duration = this.baseQueryTimeMs * contention * jitter;
          executionTimes.push(duration);

          events.push({
            time: currentTimeMs + duration,
            type: 'FINISH',
            clientIndex: nextReq.clientIndex,
            reqTime: nextReq.reqTime,
          });
        }

        // Client này tiếp tục gửi yêu cầu tiếp theo sau một khoảng thời gian suy nghĩ (Think Time)
        if (dispatchedRequests < totalRequests) {
          const thinkTime = 2.0 + Math.random() * 6.0; // 2-8ms Think time
          events.push({
            time: currentTimeMs + thinkTime,
            type: 'ARRIVAL',
            clientIndex: ev.clientIndex,
            reqTime: currentTimeMs + thinkTime,
          });
          dispatchedRequests++;
        }
      }
    }

    const durationSec = currentTimeMs / 1000;
    const throughputRps = completedRequests / Math.max(0.001, durationSec);

    const respStats = new LatencyStats(responseTimes);
    const qStats = new LatencyStats(queueWaitTimes);
    const execStats = new LatencyStats(executionTimes);

    // Tính toán và kiểm chứng Định luật Little (Little's Law Validation)
    // L = Số lượng yêu cầu trung bình trong hệ thống (Average In-flight items)
    // λ = Tốc độ thông lượng hoàn tất (Throughput QPS)
    // W = Thời gian lưu lại trung bình trong hệ thống (Mean Turnaround Time in seconds)
    // Định luật: L = λ * W
    const empiricalL = totalInFlightAreaMs / Math.max(1, currentTimeMs);
    const lambda = throughputRps;
    const meanLatencySec = respStats.getMean() / 1000;
    const theoreticalL = lambda * meanLatencySec;
    const littlesLawErrorPct = Math.abs(empiricalL - theoreticalL) / Math.max(0.001, empiricalL) * 100;

    return {
      poolSize,
      totalRequests,
      concurrency,
      simDurationSec: durationSec,
      throughputRps,
      latency: {
        meanMs: respStats.getMean(),
        p50Ms: respStats.getP50(),
        p90Ms: respStats.getP90(),
        p99Ms: respStats.getP99(),
        maxMs: respStats.getMax(),
      },
      queueWait: {
        meanMs: qStats.getMean(),
        p99Ms: qStats.getP99(),
      },
      execution: {
        meanMs: execStats.getMean(),
        p99Ms: execStats.getP99(),
      },
      littlesLaw: {
        empiricalL: parseFloat(empiricalL.toFixed(3)),
        theoreticalL: parseFloat(theoreticalL.toFixed(3)),
        lambda: parseFloat(lambda.toFixed(2)),
        meanTurnaroundSec: parseFloat(meanLatencySec.toFixed(5)),
        discrepancyPct: parseFloat(littlesLawErrorPct.toFixed(4)),
        isValid: littlesLawErrorPct < 2.0, // Sai lệch < 2% là kiểm chứng thành công tuyệt đối
      },
    };
  }
}

// ============================================================================
// 2. TABLE BLOAT SIMULATOR & AUTOVACUUM LIFECYCLE ENGINE
// ============================================================================

/**
 * Mô phỏng một Heap Page 8KB chuẩn PostgreSQL (PostgreSQL 8KB Page Layout)
 * Gồm: PageHeader (24B) + Line Pointers (ItemIdData 4B) + Free Space + Tuples (Data + 23B Header)
 */
class PostgresHeapPage {
  /**
   * @param {number} pageId - Số hiệu khối đĩa vật lý (Block Number)
   * @param {number} pageSize - Kích thước trang mặc định (8192 bytes = 8KB)
   */
  constructor(pageId, pageSize = 8192) {
    this.pageId = pageId;
    this.pageSize = pageSize;
    this.headerSize = 24; // PageHeaderData: pd_lsn, pd_checksum, pd_lower, pd_upper
    this.linePointerSize = 4; // ItemIdData: lp_off, lp_flags, lp_len (4 bytes)
    this.tupleHeaderSize = 23; // HeapTupleHeaderData: t_xmin, t_xmax, t_cid, t_infomask

    this.items = []; // Danh sách Tuples trên trang
    this.usedBytes = this.headerSize;
  }

  /**
   * Tính dung lượng khả dụng còn lại trong trang (Available Free Space)
   */
  getFreeBytes() {
    return Math.max(0, this.pageSize - this.usedBytes);
  }

  /**
   * Kiểm tra xem trang có đủ khoảng trống chứa một Tuple mới hay không
   * @param {number} tupleDataBytes - Kích thước dữ liệu người dùng
   */
  canFit(tupleDataBytes) {
    const requiredBytes = this.linePointerSize + this.tupleHeaderSize + tupleDataBytes;
    return this.getFreeBytes() >= requiredBytes;
  }

  /**
   * Thêm Tuple mới vào trang
   * @param {Object} tupleInfo - Thông tin Tuple
   * @returns {number} Offset hoặc Index của Line Pointer vừa thêm
   */
  addTuple(tupleInfo) {
    const totalTupleBytes = this.tupleHeaderSize + tupleInfo.dataBytes;
    const requiredBytes = this.linePointerSize + totalTupleBytes;
    if (this.getFreeBytes() < requiredBytes) {
      return -1;
    }

    const itemIndex = this.items.length;
    this.items.push({
      itemIndex,
      ctid: `(${this.pageId},${itemIndex + 1})`,
      xmin: tupleInfo.xmin,
      xmax: tupleInfo.xmax || 0,
      dataBytes: tupleInfo.dataBytes,
      totalBytes: totalTupleBytes,
      data: tupleInfo.data,
      isDead: false,
    });

    this.usedBytes += requiredBytes;
    return itemIndex;
  }
}

/**
 * Bộ mô phỏng Hiện tượng Phình to Bảng (Table Bloat) & Vòng đời Autovacuum
 */
class TableBloatSimulator {
  /**
   * @param {Object} options
   * @param {string} options.tableName - Tên bảng mô phỏng
   * @param {number} options.baseThreshold - Ngưỡng cơ sở autovacuum_vacuum_threshold (Mặc định: 50)
   * @param {number} options.scaleFactor - Hệ số tỷ lệ autovacuum_vacuum_scale_factor (Mặc định: 0.20 = 20%)
   * @param {number} options.tupleDataBytes - Kích thước dữ liệu trung bình của mỗi dòng (Bytes)
   */
  constructor(options = {}) {
    this.tableName = options.tableName || 'orders_large';
    this.baseThreshold = options.baseThreshold !== undefined ? options.baseThreshold : 50;
    this.scaleFactor = options.scaleFactor !== undefined ? options.scaleFactor : 0.20;
    this.tupleDataBytes = options.tupleDataBytes || 120; // 120B data + 23B header + 4B ptr = 147B/row

    this.pages = [];
    this.currentXid = 1000;
    this.xminHorizon = 900;

    // Lịch sử đo lường (Telemetry History)
    this.telemetryHistory = [];
  }

  /**
   * Tìm trang có đủ chỗ trống hoặc tạo trang mới (Free Space Map - FSM Lookup)
   */
  _getOrCreatePageForInsert() {
    for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i].canFit(this.tupleDataBytes)) {
        return this.pages[i];
      }
    }
    // Không trang nào còn chỗ -> Mở rộng file trên đĩa thêm 1 block 8KB (Disk File Allocation)
    const newPage = new PostgresHeapPage(this.pages.length);
    this.pages.push(newPage);
    return newPage;
  }

  /**
   * Chèn hàng loạt dòng mới (Bulk INSERT)
   * @param {number} count - Số lượng dòng cần chèn
   */
  insertBatch(count) {
    this.currentXid++;
    for (let i = 0; i < count; i++) {
      const page = this._getOrCreatePageForInsert();
      page.addTuple({
        xmin: this.currentXid,
        xmax: 0,
        dataBytes: this.tupleDataBytes,
        data: { id: i, created_at: Date.now() },
      });
    }
    this._recordTelemetry('INSERT');
  }

  /**
   * Cập nhật các dòng thỏa điều kiện (UPDATE: Tạo Tuple mới + Đánh dấu Tuple cũ là DEAD)
   * @param {number} updateRatio - Tỷ lệ phần trăm dòng thỏa điều kiện (0.0 -> 1.0)
   */
  updateBatch(updateRatio = 0.5) {
    this.currentXid++;
    const allTuples = [];
    for (const page of this.pages) {
      for (const item of page.items) {
        if (!item.isDead) {
          allTuples.push(item);
        }
      }
    }

    const targetCount = Math.floor(allTuples.length * updateRatio);
    for (let i = 0; i < targetCount; i++) {
      const oldTuple = allTuples[i];
      // Đánh dấu dead tuple cũ (MVCC tombstone)
      oldTuple.xmax = this.currentXid;
      oldTuple.isDead = true;

      // PostgreSQL sinh bản ghi tuple mới (New Version)
      const targetPage = this._getOrCreatePageForInsert();
      targetPage.addTuple({
        xmin: this.currentXid,
        xmax: 0,
        dataBytes: this.tupleDataBytes,
        data: { ...oldTuple.data, updated_at: Date.now() },
      });
    }

    this._recordTelemetry('UPDATE');
  }

  /**
   * Xóa bớt dòng trong bảng (DELETE: Đánh dấu Tuple là DEAD)
   * @param {number} deleteRatio - Tỷ lệ phần trăm dòng cần xóa
   */
  deleteBatch(deleteRatio = 0.3) {
    this.currentXid++;
    let deleted = 0;
    for (const page of this.pages) {
      for (const item of page.items) {
        if (!item.isDead) {
          item.xmax = this.currentXid;
          item.isDead = true;
          deleted++;
          if (deleted / (this.pages.length * 50) >= deleteRatio) {
            break;
          }
        }
      }
    }
    this._recordTelemetry('DELETE');
  }

  /**
   * Thu thập và tính toán số liệu Bloat thời gian thực (Bloat Telemetry Calculation)
   */
  getMetrics() {
    let liveTuples = 0;
    let deadTuples = 0;
    let liveBytes = 0;
    let deadBytes = 0;

    for (const page of this.pages) {
      for (const item of page.items) {
        if (item.isDead) {
          deadTuples++;
          deadBytes += item.totalBytes + page.linePointerSize;
        } else {
          liveTuples++;
          liveBytes += item.totalBytes + page.linePointerSize;
        }
      }
    }

    const totalPages = this.pages.length;
    const totalDiskBytes = totalPages * 8192;

    // Kích thước lý thuyết tối thiểu cần thiết để chứa các Live Tuples nếu compact hoàn hảo
    const bytesPerPageUsable = 8192 - 24;
    const avgTupleFootprint = this.tupleDataBytes + 23 + 4;
    const tuplesPerPageOptimal = Math.floor(bytesPerPageUsable / avgTupleFootprint);
    const expectedMinPages = Math.max(1, Math.ceil(liveTuples / tuplesPerPageOptimal));
    const expectedMinDiskBytes = expectedMinPages * 8192;

    // Tỷ lệ Bloat theo chuẩn pgstattuple:
    // Bloat Ratio = (Actual Disk Size - Minimum Required Disk Size) / Actual Disk Size
    const bloatBytes = Math.max(0, totalDiskBytes - expectedMinDiskBytes);
    const bloatRatio = totalDiskBytes > 0 ? (bloatBytes / totalDiskBytes) : 0;
    const tupleBloatRatio = (liveTuples + deadTuples) > 0 ? (deadTuples / (liveTuples + deadTuples)) : 0;

    // Công thức tính Ngưỡng Autovacuum chuẩn PostgreSQL:
    // vacuum_threshold = autovacuum_vacuum_threshold + autovacuum_vacuum_scale_factor * number_of_tuples
    const autovacuumThreshold = Math.floor(this.baseThreshold + (this.scaleFactor * liveTuples));
    const isAutovacuumTriggered = deadTuples >= autovacuumThreshold;

    return {
      tableName: this.tableName,
      liveTuples,
      deadTuples,
      totalTuples: liveTuples + deadTuples,
      totalPages,
      totalDiskBytes,
      totalDiskKB: totalDiskBytes / 1024,
      expectedMinPages,
      expectedMinDiskKB: expectedMinDiskBytes / 1024,
      bloatBytes,
      bloatKB: bloatBytes / 1024,
      bloatRatioPct: parseFloat((bloatRatio * 100).toFixed(2)),
      tupleBloatRatioPct: parseFloat((tupleBloatRatio * 100).toFixed(2)),
      autovacuumThreshold,
      isAutovacuumTriggered,
      currentXminHorizon: this.xminHorizon,
    };
  }

  _recordTelemetry(action) {
    const m = this.getMetrics();
    this.telemetryHistory.push({
      action,
      liveTuples: m.liveTuples,
      deadTuples: m.deadTuples,
      totalPages: m.totalPages,
      bloatRatioPct: m.bloatRatioPct,
      isAutovacuumTriggered: m.isAutovacuumTriggered,
    });
  }

  /**
   * Mô phỏng tiến trình dọn dẹp ngầm của Autovacuum Worker
   *
   * @param {Object} options
   * @param {number} options.activeOldestXmin - Mốc xmin horizon của giao dịch cũ nhất còn chạy
   * @returns {Object} Kết quả dọn dẹp của chu trình Autovacuum
   */
  runAutovacuum(options = {}) {
    // Mặc định: Dọn dẹp toàn bộ dead tuples đã commit trừ khi có transaction giữ xmin horizon
    const oldestXmin = options.activeOldestXmin !== undefined ? options.activeOldestXmin : (this.currentXid + 1);
    let reclaimedTuples = 0;
    let skippedTuplesDueToHorizon = 0;
    let reclaimedBytes = 0;

    for (const page of this.pages) {
      let pageFreedBytes = 0;
      for (const item of page.items) {
        if (item.isDead) {
          if (item.xmax < oldestXmin) {
            // Đủ điều kiện dọn rác (Safe to prune)
            reclaimedTuples++;
            const freed = item.totalBytes + page.linePointerSize;
            pageFreedBytes += freed;
            reclaimedBytes += freed;
          } else {
            // Bị giữ chân bởi Long-running transaction (xmin horizon pin)
            skippedTuplesDueToHorizon++;
          }
        }
      }

      // Xóa dead tuples khỏi page, cập nhật dung lượng đã dùng
      page.items = page.items.filter(item => !(item.isDead && item.xmax < oldestXmin));
      page.usedBytes = Math.max(page.headerSize, page.usedBytes - pageFreedBytes);
    }

    this._recordTelemetry('AUTOVACUUM');

    return {
      reclaimedTuples,
      skippedTuplesDueToHorizon,
      reclaimedBytes,
      reclaimedKB: reclaimedBytes / 1024,
      pagesProcessed: this.pages.length,
      note: 'Dung lượng đã được giải phóng vào Free Space Map (FSM) trong các pages hiện hữu. Đĩa vật lý không co lại.',
    };
  }

  /**
   * Mô phỏng công cụ cứu cánh DBRE: pg_repack / VACUUM FULL
   * Tạo bản sao bảng mới hoàn toàn compact, hoán đổi catalog và giải phóng triệt để dung lượng đĩa cho OS
   */
  runRepack() {
    const liveTuples = [];
    for (const page of this.pages) {
      for (const item of page.items) {
        if (!item.isDead) {
          liveTuples.push({
            xmin: item.xmin,
            xmax: 0,
            dataBytes: item.dataBytes,
            data: item.data,
          });
        }
      }
    }

    // Xây dựng lại các Pages mới tinh khiết
    const compactedPages = [];
    let currentPage = new PostgresHeapPage(0);
    compactedPages.push(currentPage);

    for (const tuple of liveTuples) {
      if (!currentPage.canFit(tuple.dataBytes)) {
        currentPage = new PostgresHeapPage(compactedPages.length);
        compactedPages.push(currentPage);
      }
      currentPage.addTuple(tuple);
    }

    const previousPagesCount = this.pages.length;
    this.pages = compactedPages;
    const freedPagesToOs = previousPagesCount - compactedPages.length;

    this._recordTelemetry('PG_REPACK');

    return {
      previousPagesCount,
      compactedPagesCount: compactedPages.length,
      freedPagesToOs,
      freedDiskKB: (freedPagesToOs * 8192) / 1024,
      note: 'Toàn bộ khoảng trống phình to (Bloat) đã được giải phóng triệt để về Hệ điều hành.',
    };
  }
}

// ============================================================================
// 3. POINT-IN-TIME RECOVERY (PITR) TIMELINE REPLAY ENGINE
// ============================================================================

/**
 * Bản ghi Nhật ký Ghi trước (WAL Record Structure)
 */
class WALRecord {
  /**
   * @param {Object} params
   * @param {number} params.lsn - Log Sequence Number (Định danh vị trí byte đơn điệu)
   * @param {number} params.timestamp - Mốc thời gian giao dịch thực thi (Epoch ms)
   * @param {number} params.xid - Transaction ID
   * @param {string} params.type - Loại thao tác: 'BEGIN'|'COMMIT'|'INSERT'|'UPDATE'|'DELETE'|'DROP_TABLE'
   * @param {string} params.table - Tên bảng bị tác động
   * @param {any} params.payload - Dữ liệu thay đổi
   * @param {string} params.description - Mô tả hành động nghiệp vụ
   */
  constructor(params) {
    this.lsn = params.lsn;
    this.timestamp = params.timestamp;
    this.xid = params.xid;
    this.type = params.type;
    this.table = params.table;
    this.payload = params.payload;
    this.description = params.description || '';
  }

  getFormattedLSN() {
    const high = Math.floor(this.lsn / 0x100000000).toString(16).toUpperCase();
    const low = (this.lsn % 0x100000000).toString(16).toUpperCase().padStart(8, '0');
    return `${high}/${low}`;
  }
}

/**
 * Kho Lưu trữ WAL Tập trung (Continuous WAL Archive Storage - S3 / Local Backup)
 */
class WALArchive {
  constructor() {
    this.records = [];
  }

  append(record) {
    this.records.push(record);
  }

  getRecordsSince(startLsn) {
    return this.records.filter(r => r.lsn >= startLsn);
  }
}

/**
 * Bộ Tái Hiện & Phục Hồi Dữ Liệu Theo Thời Gian Thực (PITR Timeline Replay Engine)
 */
class PITRTimelineReplay {
  constructor() {
    // Trạng thái cơ sở dữ liệu trực tiếp (Live Database Cluster State)
    this.tables = new Map();
    this.currentLsn = 0x1000000; // Khởi đầu LSN 0/1000000
    this.currentXid = 500;
    this.walArchive = new WALArchive();
    this.baseBackup = null;

    // Trạng thái Node sau khi phục hồi
    this.restoredState = null;
    this.recoveryTimeline = 1;
    this.nodeRole = 'PRIMARY';
  }

  /**
   * Tạo bảng dữ liệu mới
   */
  createTable(tableName, initialRows = []) {
    this.tables.set(tableName, initialRows.slice());
  }

  /**
   * Ghi log WAL và tăng LSN
   */
  _logWAL(type, tableName, payload, timestamp, description) {
    this.currentLsn += 256; // Tăng LSN thêm 256 bytes cho mỗi bản ghi WAL
    const record = new WALRecord({
      lsn: this.currentLsn,
      timestamp,
      xid: this.currentXid,
      type,
      table: tableName,
      payload,
      description,
    });
    this.walArchive.append(record);
    return record;
  }

  /**
   * Thực hiện giao dịch thay đổi dữ liệu có ghi WAL (Transactional Change with WAL)
   */
  executeTransaction(actionType, tableName, payload, timestamp, description) {
    this.currentXid++;
    this._logWAL('BEGIN', tableName, null, timestamp, 'BEGIN TRANSACTION');

    if (actionType === 'INSERT') {
      if (!this.tables.has(tableName)) {
        throw new Error(`Table ${tableName} does not exist`);
      }
      this.tables.get(tableName).push(payload);
      this._logWAL('INSERT', tableName, payload, timestamp, description);
    } else if (actionType === 'UPDATE') {
      if (!this.tables.has(tableName)) {
        throw new Error(`Table ${tableName} does not exist`);
      }
      const rows = this.tables.get(tableName);
      const idx = rows.findIndex(r => r.id === payload.id);
      if (idx !== -1) {
        rows[idx] = { ...rows[idx], ...payload.data };
      }
      this._logWAL('UPDATE', tableName, payload, timestamp, description);
    } else if (actionType === 'DROP_TABLE') {
      if (!this.tables.has(tableName)) {
        throw new Error(`Table ${tableName} does not exist`);
      }
      this.tables.delete(tableName);
      this._logWAL('DROP_TABLE', tableName, null, timestamp, description);
    }

    const commitRecord = this._logWAL('COMMIT', tableName, null, timestamp, 'COMMIT TRANSACTION');
    return commitRecord;
  }

  /**
   * Tạo bản sao lưu vật lý cơ sở (Physical Base Backup - pg_basebackup / pgBackRest)
   * Chụp lại toàn bộ trạng thái $PGDATA và ghi nhận checkpoint LSN
   * @param {number} timestamp - Thời điểm bắt đầu sao lưu
   */
  takeBaseBackup(timestamp) {
    const snapshotTables = new Map();
    for (const [tableName, rows] of this.tables.entries()) {
      // Sao chép sâu (Deep copy) trạng thái bảng
      snapshotTables.set(tableName, JSON.parse(JSON.stringify(rows)));
    }

    this.baseBackup = {
      backupTimestamp: timestamp,
      checkpointLsn: this.currentLsn,
      tablesSnapshot: snapshotTables,
      backupLabel: `BASE_BACKUP_${new Date(timestamp).toISOString()}`,
    };

    return this.baseBackup;
  }

  /**
   * Kích hoạt Quy trình Phục hồi Point-In-Time Recovery (PITR Restoration Procedure)
   *
   * Các bước chuẩn mực DBRE:
   * 1. Giải nén Base Backup vào thư mục $PGDATA mới.
   * 2. Thiết lập recovery_target_time hoặc recovery_target_lsn.
   * 3. Tiến trình Startup Process quét WAL từ Checkpoint LSN, áp dụng REDO log tuần tự.
   * 4. Khi chạm ngưỡng target (trước thời điểm thảm họa), dừng phát lại log ngay lập tức.
   * 5. Thăng hạng (Promote) Database Node sang timeline mới, sẵn sàng phục vụ.
   *
   * @param {Object} options
   * @param {number} options.targetTimestamp - Mốc thời gian dừng phục hồi (recovery_target_time)
   * @param {number} options.targetLsn - Mốc LSN dừng phục hồi (recovery_target_lsn)
   * @param {boolean} options.inclusive - Bao gồm giao dịch tại mốc đích hay không (Mặc định: false)
   * @returns {Object} Báo cáo kết quả phục hồi toàn diện
   */
  restorePITR(options = {}) {
    if (!this.baseBackup) {
      throw new Error('Không thể thực hiện PITR vì chưa có Base Backup!');
    }

    const { targetTimestamp, targetLsn, inclusive = false } = options;

    // Bước 1: Khôi phục $PGDATA từ Base Backup
    const recoveredTables = new Map();
    for (const [tName, rows] of this.baseBackup.tablesSnapshot.entries()) {
      recoveredTables.set(tName, JSON.parse(JSON.stringify(rows)));
    }

    // Bước 2: Lấy các đoạn WAL từ kho lưu trữ liên tục kể từ Checkpoint LSN
    const walStream = this.walArchive.getRecordsSince(this.baseBackup.checkpointLsn);
    let replayedRecordsCount = 0;
    let lastReplayedRecord = null;
    let haltedReason = 'REACHED_END_OF_WAL';
    let skippedDisasterRecord = null;

    // Bước 3: Vòng lặp Replay Transaction Log (REDO Phase)
    for (const record of walStream) {
      // Bỏ qua các bản ghi thuộc quá trình backup ban đầu
      if (record.lsn <= this.baseBackup.checkpointLsn) {
        continue;
      }

      // Kiểm tra điều kiện dừng theo thời gian (recovery_target_time)
      if (targetTimestamp !== undefined) {
        if (!inclusive && record.timestamp >= targetTimestamp) {
          haltedReason = `REACHED_TARGET_TIME_${targetTimestamp}`;
          skippedDisasterRecord = record;
          break;
        }
        if (inclusive && record.timestamp > targetTimestamp) {
          haltedReason = `REACHED_TARGET_TIME_${targetTimestamp}_INCLUSIVE`;
          skippedDisasterRecord = record;
          break;
        }
      }

      // Kiểm tra điều kiện dừng theo LSN (recovery_target_lsn)
      if (targetLsn !== undefined) {
        if (!inclusive && record.lsn >= targetLsn) {
          haltedReason = `REACHED_TARGET_LSN_${record.getFormattedLSN()}`;
          skippedDisasterRecord = record;
          break;
        }
        if (inclusive && record.lsn > targetLsn) {
          haltedReason = `REACHED_TARGET_LSN_${record.getFormattedLSN()}_INCLUSIVE`;
          skippedDisasterRecord = record;
          break;
        }
      }

      // Thực thi REDO lên các data pages
      if (record.type === 'INSERT') {
        if (!recoveredTables.has(record.table)) {
          recoveredTables.set(record.table, []);
        }
        recoveredTables.get(record.table).push(record.payload);
      } else if (record.type === 'UPDATE') {
        const rows = recoveredTables.get(record.table);
        if (rows) {
          const idx = rows.findIndex(r => r.id === record.payload.id);
          if (idx !== -1) {
            rows[idx] = { ...rows[idx], ...record.payload.data };
          }
        }
      } else if (record.type === 'DROP_TABLE') {
        recoveredTables.delete(record.table);
      }

      replayedRecordsCount++;
      lastReplayedRecord = record;
    }

    // Bước 4: Thăng hạng Node (Promotion) sang Timeline mới
    this.recoveryTimeline = 2; // Đổi timeline từ 1 -> 2
    this.nodeRole = 'PRIMARY';

    // Kiểm toán các bản ghi chưa replay để xác nhận đã triệt tiêu lệnh phá hoại dữ liệu
    const unappliedRecords = walStream.filter(r => r.lsn >= (skippedDisasterRecord ? skippedDisasterRecord.lsn : Infinity));
    const containsDropTable = unappliedRecords.some(r => r.type === 'DROP_TABLE');

    this.restoredState = {
      tables: recoveredTables,
      replayedRecordsCount,
      lastReplayedLsn: lastReplayedRecord ? lastReplayedRecord.getFormattedLSN() : 'N/A',
      haltedReason,
      skippedDisasterRecord,
      unappliedRecordsCount: unappliedRecords.length,
      containsDropTableInUnapplied: containsDropTable,
      timeline: this.recoveryTimeline,
    };

    return this.restoredState;
  }
}

// ============================================================================
// 4. BỘ KIỂM THỬ TỰ ĐỘNG BUILT-IN (AUTOMATED TEST SUITE)
// ============================================================================

/**
 * Hàm điều phối thực thi toàn bộ các bài kiểm thử kỹ nghệ DBRE
 */
function runAllTests() {
  console.log('================================================================================');
  console.log('🛡️  BẮT ĐẦU CHẠY BỘ KIỂM THỬ TỰ ĐỘNG DBRE TELEMETRY & OPERATIONS LAB (POD 8)');
  console.log('================================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // --------------------------------------------------------------------------
  // TEST 1: KIỂM CHỨNG CÔNG THỨC HIKARICP & ĐỊNH LUẬT LITTLE (LITTLE'S LAW)
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 1] Kiểm Chứng Công Thức HikariCP & Định Luật Little (Little\'s Law) ---');
  const poolSim = new ConnectionPoolSimulator({
    cpuCores: 8,
    spindles: 2,
    baseQueryTimeMs: 2.0,
  });

  const optimalSize = poolSim.hikariRecommendedPoolSize; // 8 * 2 + 2 = 18 connections
  const oversizedSize = 1000; // 1,000 connections gây bão CPU context switching & lock contention

  console.log(`• Cấu hình Server: 8 Logical Cores | 2 Spindles`);
  console.log(`• Kích thước Pool tối ưu (HikariCP): ${optimalSize} connections`);
  console.log(`• Kích thước Pool quá lớn (Oversized): ${oversizedSize} connections`);

  console.log('\n⏳ Đang mô phỏng kịch bản Hồ bơi Tối ưu (HikariCP Pool = 18)...');
  const optimalResult = poolSim.simulateWorkload({
    poolSize: optimalSize,
    totalRequests: 3000,
    concurrency: 500,
    warmupSpreadMs: 50,
  });

  console.log('⏳ Đang mô phỏng kịch bản Hồ bơi Quá lớn (Oversized Pool = 1,000)...');
  const oversizedResult = poolSim.simulateWorkload({
    poolSize: oversizedSize,
    totalRequests: 3000,
    concurrency: 500,
    warmupSpreadMs: 50,
  });

  console.log('\n📊 BẢNG ĐỐI CHỨNG HIỆU NĂNG THỰC NGHIỆM:');
  console.log('-----------------------------------------------------------------------------------------');
  console.log('| Chỉ Số Kỹ Thuật (Metric)       | Hồ Bơi Tối Ưu (HikariCP 18) | Hồ Bơi Quá Lớn (1,000 Conns)|');
  console.log('-----------------------------------------------------------------------------------------');
  const pad = (s, len) => String(s).padEnd(len);
  console.log(`| Thông lượng (Throughput QPS)   | ${pad(optimalResult.throughputRps.toFixed(1) + ' req/s', 27)} | ${pad(oversizedResult.throughputRps.toFixed(1) + ' req/s', 27)} |`);
  console.log(`| Độ trễ Trung bình (Mean)       | ${pad(optimalResult.latency.meanMs.toFixed(2) + ' ms', 27)} | ${pad(oversizedResult.latency.meanMs.toFixed(2) + ' ms', 27)} |`);
  console.log(`| Độ trễ Trung vị (P50)          | ${pad(optimalResult.latency.p50Ms.toFixed(2) + ' ms', 27)} | ${pad(oversizedResult.latency.p50Ms.toFixed(2) + ' ms', 27)} |`);
  console.log(`| Độ trễ Đỉnh phân vị (P99)      | ${pad(optimalResult.latency.p99Ms.toFixed(2) + ' ms', 27)} | ${pad(oversizedResult.latency.p99Ms.toFixed(2) + ' ms', 27)} |`);
  console.log(`| Thời gian chạy DB (Exec Mean)  | ${pad(optimalResult.execution.meanMs.toFixed(2) + ' ms', 27)} | ${pad(oversizedResult.execution.meanMs.toFixed(2) + ' ms', 27)} |`);
  console.log(`| Chờ xếp hàng Pool (Queue Mean) | ${pad(optimalResult.queueWait.meanMs.toFixed(2) + ' ms', 27)} | ${pad(oversizedResult.queueWait.meanMs.toFixed(2) + ' ms', 27)} |`);
  console.log('-----------------------------------------------------------------------------------------');

  const p99ReductionRatio = oversizedResult.latency.p99Ms / optimalResult.latency.p99Ms;
  const throughputRatio = optimalResult.throughputRps / oversizedResult.throughputRps;

  console.log(`\n🎯 KẾT LUẬN HIỆU NĂNG THỰC NGHIỆM:`);
  console.log(`👉 Tỷ lệ cải thiện P99 Latency của Pool tối ưu: ${p99ReductionRatio.toFixed(1)}x thấp hơn (Yêu cầu >= 10x)!`);
  console.log(`👉 Thông lượng của Pool tối ưu vượt trội: ${throughputRatio.toFixed(1)}x cao hơn!`);
  console.log(`👉 Kiểm chứng Định luật Little (HikariCP): L_emp=${optimalResult.littlesLaw.empiricalL} vs L_theo=${optimalResult.littlesLaw.theoreticalL} (Chênh lệch: ${optimalResult.littlesLaw.discrepancyPct}%)`);
  console.log(`👉 Kiểm chứng Định luật Little (Oversized): L_emp=${oversizedResult.littlesLaw.empiricalL} vs L_theo=${oversizedResult.littlesLaw.theoreticalL} (Chênh lệch: ${oversizedResult.littlesLaw.discrepancyPct}%)`);

  const isTest1Valid =
    optimalResult.throughputRps > oversizedResult.throughputRps &&
    p99ReductionRatio >= 10.0 &&
    optimalResult.littlesLaw.isValid &&
    oversizedResult.littlesLaw.isValid;

  if (isTest1Valid) {
    console.log('👉 KẾT QUẢ TEST 1: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error(`❌ TEST 1 THẤT BẠI: P99 cải thiện chưa đạt 10x hoặc sai lệch Little's Law!`);
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // TEST 2: HIỆN TƯỢNG TABLE BLOAT & CHU TRÌNH DỌN DẸP AUTOVACUUM
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 2] Hiện Tượng Phình To Bảng (Table Bloat) & Vòng Đời Autovacuum ---');
  const bloatSim = new TableBloatSimulator({
    tableName: 'ecom_orders',
    baseThreshold: 50,
    scaleFactor: 0.20, // 20%
    tupleDataBytes: 120,
  });

  console.log('📌 Bước 1: Khởi tạo dữ liệu gốc (10,000 INSERTs)...');
  bloatSim.insertBatch(10000);
  const m1 = bloatSim.getMetrics();
  console.log(`   - Live Tuples: ${m1.liveTuples.toLocaleString()} | Dead Tuples: ${m1.deadTuples}`);
  console.log(`   - Số trang đĩa vật lý: ${m1.totalPages} pages (${m1.totalDiskKB.toFixed(1)} KB)`);
  console.log(`   - Ngưỡng kích hoạt Autovacuum: ${m1.autovacuumThreshold} dead tuples (Triggered: ${m1.isAutovacuumTriggered})`);

  console.log('\n📌 Bước 2: Thực hiện 15,000 biến động liên tục (Massive UPDATE & DELETE)...');
  bloatSim.updateBatch(0.8); // 80% rows bị update tạo dead tuples
  bloatSim.updateBatch(0.7); // tiếp tục update thêm
  bloatSim.deleteBatch(0.3); // delete 30% rows

  const m2 = bloatSim.getMetrics();
  console.log(`   - Live Tuples: ${m2.liveTuples.toLocaleString()} | Dead Tuples: ${m2.deadTuples.toLocaleString()}`);
  console.log(`   - Số trang đĩa vật lý sau khi Bloat: ${m2.totalPages} pages (${m2.totalDiskKB.toFixed(1)} KB)`);
  console.log(`   - Tỷ lệ Bloat tính toán: ${m2.bloatRatioPct}% (Dung lượng phình thừa: ${m2.bloatKB.toFixed(1)} KB)`);
  console.log(`   - Trạng thái Autovacuum: Triggered = ${m2.isAutovacuumTriggered} (Vượt ngưỡng ${m2.autovacuumThreshold})`);

  console.log('\n📌 Bước 3: Kích hoạt Autovacuum Worker dọn dẹp nội bộ trang...');
  const vacuumResult = bloatSim.runAutovacuum();
  const m3 = bloatSim.getMetrics();
  console.log(`   - Dead tuples đã dọn dẹp: ${vacuumResult.reclaimedTuples.toLocaleString()} dòng`);
  console.log(`   - Số trang vật lý sau VACUUM: ${m3.totalPages} pages (Đúng chuẩn: Đĩa vật lý không co lại)`);
  console.log(`   - Dead Tuples còn lại: ${m3.deadTuples}`);

  console.log('\n📌 Bước 4: Chạy pg_repack giải phóng triệt để dung lượng vật lý trả về OS...');
  const repackResult = bloatSim.runRepack();
  const m4 = bloatSim.getMetrics();
  console.log(`   - Số trang ban đầu: ${repackResult.previousPagesCount} -> Thu gọn còn: ${repackResult.compactedPagesCount} pages`);
  console.log(`   - Giải phóng về OS: ${repackResult.freedPagesToOs} pages (${repackResult.freedDiskKB.toFixed(1)} KB)`);
  console.log(`   - Tỷ lệ Bloat sau repack: ${m4.bloatRatioPct}%`);

  const isTest2Valid =
    m2.isAutovacuumTriggered === true &&
    m2.bloatRatioPct >= 40.0 &&
    vacuumResult.reclaimedTuples > 0 &&
    m3.deadTuples === 0 &&
    repackResult.freedPagesToOs > 0 &&
    m4.totalPages < m2.totalPages;

  if (isTest2Valid) {
    console.log('👉 KẾT QUẢ TEST 2: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error('❌ TEST 2 THẤT BẠI: Tính toán Bloat hoặc chu trình Autovacuum sai lệch!');
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // TEST 3: TÁI HIỆN PHỤC HỒI POINT-IN-TIME RECOVERY (PITR) CHUẨN XÁC TỪNG GIÂY
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 3] Tái Hiện Phục Hồi Thảm Họa PITR (Point-In-Time Recovery Replay) ---');
  const pitr = new PITRTimelineReplay();

  // Khởi tạo các bảng lõi ngân hàng
  pitr.createTable('accounts', [
    { id: 1, name: 'Tài khoản Doanh Nghiệp Alpha', balance: 5000000 },
    { id: 2, name: 'Tài khoản Quỹ Đầu Tư Beta', balance: 12000000 },
    { id: 3, name: 'Tài khoản Cá Nhân Gamma', balance: 350000 },
  ]);
  pitr.createTable('audit_logs', []);

  const tBaseBackup = new Date('2026-10-01T02:00:00.000Z').getTime();
  console.log(`📌 02:00 AM: Thiết lập Base Backup toàn diện (Checkpoint LSN)`);
  const backup = pitr.takeBaseBackup(tBaseBackup);
  console.log(`   - Backup Checkpoint LSN: ${backup.checkpointLsn} | Label: ${backup.backupLabel}`);

  console.log('\n📌 Tiến trình kinh doanh liên tục sinh WAL records từ 02:00 AM -> 14:23:14...');
  // Chuỗi giao dịch nghiệp vụ hợp lệ
  let tCursor = tBaseBackup + 1000;
  pitr.executeTransaction('INSERT', 'accounts', { id: 4, name: 'Tài khoản VIP Delta', balance: 8500000 }, tCursor, 'Mở tài khoản VIP Delta');

  tCursor += 5000;
  pitr.executeTransaction('UPDATE', 'accounts', { id: 1, data: { balance: 7500000 } }, tCursor, 'Nộp thêm 2.5M vào Alpha');

  tCursor += 10000;
  pitr.executeTransaction('INSERT', 'audit_logs', { id: 101, event: 'LOGIN_SUCCESS', user: 'admin_security' }, tCursor, 'Ghi nhận đăng nhập');

  // Giao dịch ngay trước thời điểm xảy ra sự cố (14:23:14 UTC)
  const tJustBeforeDisaster = new Date('2026-10-01T14:23:14.000Z').getTime();
  pitr.executeTransaction('UPDATE', 'accounts', { id: 3, data: { balance: 990000 } }, tJustBeforeDisaster, 'Chuyển tiền lương cho Gamma');

  // THẢM HỌA: Kỹ sư chạy nhầm lệnh DROP TABLE lúc 14:23:15 UTC!
  const tDisaster = new Date('2026-10-01T14:23:15.000Z').getTime();
  console.log(`\n💥 14:23:15 UTC: THẢM HỌA XẢY RA! Kỹ sư chạy nhầm lệnh 'DROP TABLE accounts;'!`);
  pitr.executeTransaction('DROP_TABLE', 'accounts', null, tDisaster, 'LỆNH HỦY DIỆT NHẦM LẪN: DROP TABLE accounts');

  // Các giao dịch phát sinh sau sự cố (hệ thống giám sát ghi log cảnh báo)
  pitr.executeTransaction('INSERT', 'audit_logs', { id: 102, event: 'ALERT_TABLE_MISSING', error: 'Table accounts not found' }, tDisaster + 2000, 'Cảnh báo hệ thống');

  console.log(`   - Trạng thái DB hiện tại trên Master: Bảng accounts = ${pitr.tables.has('accounts') ? 'TỒN TẠI' : 'ĐÃ BỊ XÓA HOÀN TOÀN'}`);

  // THỰC HIỆN PITR: Khôi phục chính xác về 14:23:14 UTC (1 giây trước khi lệnh DROP TABLE thực thi)
  console.log(`\n🚨 KÍCH HOẠT QUY TRÌNH PHỤC HỒI PITR:`);
  console.log(`   - Thiết lập recovery_target_time = '${new Date(tJustBeforeDisaster).toISOString()}'`);
  console.log(`   - Thiết lập recovery_target_inclusive = false`);

  const restoreReport = pitr.restorePITR({
    targetTimestamp: tDisaster,
    inclusive: false,
  });

  console.log('\n🎯 KẾT QUẢ KHÔI PHỤC TỪ WAL ARCHIVE:');
  console.log(`   - Số lượng WAL Records đã replay thành công: ${restoreReport.replayedRecordsCount}`);
  console.log(`   - Vị trí LSN cuối cùng được áp dụng: ${restoreReport.lastReplayedLsn}`);
  console.log(`   - Lý do dừng Replay: ${restoreReport.haltedReason}`);
  console.log(`   - Giao dịch bị loại bỏ (Disaster Truncated): ${restoreReport.skippedDisasterRecord ? restoreReport.skippedDisasterRecord.description : 'None'}`);
  console.log(`   - Trạng thái Node sau thăng hạng: Timeline ${restoreReport.timeline} (${pitr.nodeRole})`);

  const restoredAccounts = restoreReport.tables.get('accounts');
  const accountsExist = !!restoredAccounts;
  const accountsCount = accountsExist ? restoredAccounts.length : 0;
  const gammaAccount = accountsExist ? restoredAccounts.find(a => a.id === 3) : null;

  console.log(`\n🔍 KIỂM TOÁN TÍNH TOÀN VẸN DỮ LIỆU ĐƯỢC CỨU:`);
  console.log(`   - Bảng accounts có tồn tại không: ${accountsExist ? 'CÓ (THÀNH CÔNG)' : 'KHÔNG'}`);
  console.log(`   - Tổng số tài khoản bảo toàn: ${accountsCount} tài khoản`);
  console.log(`   - Số dư tài khoản Gamma (giao dịch cuối trước sự cố): ${gammaAccount ? gammaAccount.balance.toLocaleString() : 'N/A'} (Kỳ vọng: 990,000)`);

  const isTest3Valid =
    accountsExist === true &&
    accountsCount === 4 &&
    gammaAccount && gammaAccount.balance === 990000 &&
    restoreReport.containsDropTableInUnapplied === true &&
    restoreReport.timeline === 2 &&
    pitr.nodeRole === 'PRIMARY';

  if (isTest3Valid) {
    console.log('👉 KẾT QUẢ TEST 3: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error('❌ TEST 3 THẤT BẠI: Phục hồi PITR không chính xác hoặc không cứu được dữ liệu!');
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // BÁO CÁO TỔNG KẾT NGHIỆM THU (FINAL SUMMARY REPORT)
  // --------------------------------------------------------------------------
  console.log('================================================================================');
  console.log(`🏆 NGHIỆM THU HOÀN TẤT: ${passedTests}/${totalTests} BÀI KIỂM THỬ XANH TUYỆT ĐỐI (100% PASSED)`);
  console.log('   Module 08 Lab: Sẵn sàng cho triển khai thực tế & Giảng dạy chuyên sâu!');
  console.log('================================================================================\n');
}

// Tự động kích hoạt khi thực thi trực tiếp bằng Node CLI
if (require.main === module) {
  runAllTests();
}

module.exports = {
  LatencyStats,
  ConnectionPoolSimulator,
  PostgresHeapPage,
  TableBloatSimulator,
  WALRecord,
  WALArchive,
  PITRTimelineReplay,
  runAllTests,
};
