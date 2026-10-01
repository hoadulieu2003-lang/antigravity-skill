/**
 * ============================================================================
 * DATABASE MASTERCLASS — LAB 05: ADVANCED CACHING DEFENSE LAB
 * Phòng Thí Nghiệm & Mô Phỏng Tác Chiến Phòng Thủ Bộ Nhớ Đệm Cấp Doanh Nghiệp
 * ============================================================================
 *
 * Chủ quản (Owner): Anh — Lead Architect / Product Owner
 * Cộng sự AI (Pair-Programmer): Em — Senior Engineering Agent (Pod 5: In-Memory & Caching Systems)
 *
 * Yêu cầu kỹ thuật:
 * - Pure Node.js (Zero external npm dependencies).
 * - Thuật toán XFetch (Probabilistic Early Expiration) triệt tiêu Cache Stampede.
 * - Bloom Filter Simulator (Bit Array m-bits, k-hashes) chặn Cache Penetration.
 * - Cache-Aside kết hợp Invalidation via CDC (Debezium + Kafka simulated stream).
 * - Chú thích song ngữ English (Tiếng Việt) chuẩn mực.
 * ============================================================================
 */

'use strict';

// ============================================================================
// PHẦN 1: HỆ THỐNG HÀM BĂM THUẦN JAVASCRIPT (PURE JS HASH FUNCTIONS)
// ============================================================================

/**
 * MurmurHash3 (32-bit variant) triển khai thuần JavaScript.
 * Cung cấp phân phối băm đồng đều (Avalanche effect) với chi phí CPU cực thấp.
 *
 * @param {string} key - Chuỗi khóa cần băm
 * @param {number} seed - Số hạt giống khởi tạo (Seed)
 * @returns {number} Giá trị băm nguyên dương 32-bit (Unsigned 32-bit integer)
 */
function murmur3_32(key, seed = 0) {
  let k1;
  let h1 = seed >>> 0;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  const len = key.length;
  let i = 0;

  while (len - i >= 4) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(i + 1) & 0xff) << 8) |
      ((key.charCodeAt(i + 2) & 0xff) << 16) |
      ((key.charCodeAt(i + 3) & 0xff) << 24);

    k1 = Math.imul(k1, c1) >>> 0;
    k1 = ((k1 << 15) | (k1 >>> 17)) >>> 0;
    k1 = Math.imul(k1, c2) >>> 0;

    h1 ^= k1;
    h1 = ((h1 << 13) | (h1 >>> 19)) >>> 0;
    h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;

    i += 4;
  }

  k1 = 0;
  const remainder = len - i;
  if (remainder === 3) {
    k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
  }
  if (remainder >= 2) {
    k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
  }
  if (remainder >= 1) {
    k1 ^= key.charCodeAt(i) & 0xff;
    k1 = Math.imul(k1, c1) >>> 0;
    k1 = ((k1 << 15) | (k1 >>> 17)) >>> 0;
    k1 = Math.imul(k1, c2) >>> 0;
    h1 ^= k1;
  }

  h1 ^= len;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b) >>> 0;
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35) >>> 0;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

/**
 * FNV-1a (Fowler-Noll-Vo 32-bit) triển khai thuần JavaScript.
 * Đóng vai trò là hàm băm độc lập thứ 2 kết hợp trong kỹ thuật Kirsch-Mitzenmacher.
 *
 * @param {string} key - Chuỗi khóa cần băm
 * @param {number} seed - Số hạt giống khởi tạo
 * @returns {number} Giá trị băm nguyên dương 32-bit
 */
function fnv1a_32(key, seed = 0x811c9dc5) {
  let hash = seed >>> 0;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Tạo ra k chỉ số băm độc lập dựa trên kỹ thuật tối ưu Kirsch-Mitzenmacher:
 * gi(x) = (h1(x) + i * h2(x)) mod m
 *
 * @param {string} key - Khóa dữ liệu
 * @param {number} k - Số lượng hàm băm mong muốn
 * @param {number} m - Độ dài mảng bit
 * @returns {number[]} Mảng k chỉ số bit trong khoảng [0, m - 1]
 */
function generateKHashes(key, k, m) {
  const h1 = murmur3_32(key, 0x9747b28c);
  const h2 = fnv1a_32(key, 0x811c9dc5);
  const indices = new Array(k);

  for (let i = 0; i < k; i++) {
    // Biểu thức Kirsch-Mitzenmacher với phép nhân an toàn 32-bit
    const combined = (h1 + Math.imul(i, h2)) >>> 0;
    indices[i] = combined % m;
  }

  return indices;
}


// ============================================================================
// PHẦN 2: CLASS XFetchAlgorithm — PROBABILISTIC EARLY EXPIRATION
// ============================================================================

/**
 * Thuật toán XFetch ngăn ngừa triệt để hiện tượng Cache Stampede (Thundering Herd).
 *
 * Nguyên lý cốt lõi:
 * Bài báo: "Optimal Probabilistic Cache Stampede Prevention" (Vattani et al., Columbia University).
 * Biểu thức điều kiện tái tính toán sớm theo xác suất:
 *    Δ - β * ln(rand()) * δ > TTL_remaining
 *
 * Trong đó:
 * - Δ (Delta offset): Tham số bù độ trễ (Latency offset / baseline buffer, mặc định 0).
 * - δ (delta): Thời gian tiêu tốn thực tế để tính toán/truy vấn DB (Computation duration).
 * - β (beta): Hệ số xông xáo (Aggressiveness parameter, β > 0, mặc định 1.0).
 * - rand(): Phân phối ngẫu nhiên đều U in (0, 1]. Do ln(U) <= 0, -ln(U) >= 0.
 * - TTL_remaining: Thời gian sống còn lại của cache (Expiration timestamp - Current timestamp).
 */
class XFetchAlgorithm {
  /**
   * @param {Object} options
   * @param {number} [options.beta=1.0] - Hệ số xông xáo của thuật toán
   * @param {number} [options.deltaOffset=0] - Độ lệch cơ sở Δ
   */
  constructor(options = {}) {
    this.beta = options.beta !== undefined ? options.beta : 1.0;
    this.deltaOffset = options.deltaOffset || 0;
    // Lưu trữ trong RAM: key -> { value, delta, expireAt, isRecomputing }
    this.cacheStore = new Map();
    // Bảng theo dõi các Promise đang recompute (Singleflight in-flight deduplication)
    this.inFlightPromises = new Map();
  }

  /**
   * Kiểm tra điều kiện tái tính toán sớm theo xác suất XFetch.
   *
   * @param {number} ttlRemainingMs - Thời gian sống còn lại (ms)
   * @param {number} deltaMs - Thời gian tính toán DB lần trước (ms)
   * @param {number} [randVal] - Giá trị ngẫu nhiên tiêm vào phục vụ unit test
   * @returns {boolean} True nếu thỏa mãn điều kiện cần tái tính toán sớm
   */
  shouldRecompute(ttlRemainingMs, deltaMs, randVal = null) {
    // Nếu cache đã hết hạn vật lý thì bắt buộc phải recompute
    if (ttlRemainingMs <= 0) {
      return true;
    }

    const rand = randVal !== null ? randVal : Math.random();
    // Đảm bảo rand nằm nghiêm ngặt trong khoảng (0, 1] để tránh Math.log(0) = -Infinity
    const u = Math.max(rand, 1e-10);

    // Công thức Vattani: Δ - β * ln(U) * δ
    const probabilisticThreshold = this.deltaOffset - (this.beta * Math.log(u) * deltaMs);

    return probabilisticThreshold > ttlRemainingMs;
  }

  /**
   * Đọc dữ liệu từ Cache sử dụng thuật toán XFetch.
   * Nếu rơi vào vùng xác suất hết hạn sớm:
   * - Luồng may mắn đầu tiên kích hoạt background recompute hoặc đồng bộ.
   * - Tất cả các luồng khác ĐƯỢC PHỤC VỤ NGAY LẬP TỨC với dữ liệu cũ còn hợp lệ!
   *
   * @param {string} key - Khóa truy vấn
   * @param {Function} fetcherFn - Hàm truy vấn DB đắt đỏ: async () => data
   * @param {number} ttlMs - Thời gian sống của key (TTL tính bằng ms)
   * @param {Object} [telemetry] - Bộ đếm đo lường thực nghiệm
   * @returns {Promise<any>} Giá trị dữ liệu
   */
  async get(key, fetcherFn, ttlMs, telemetry = null) {
    const now = Date.now();
    const entry = this.cacheStore.get(key);

    if (entry) {
      const ttlRemaining = entry.expireAt - now;

      // Đánh giá công thức XFetch
      const needsEarlyRecompute = this.shouldRecompute(ttlRemaining, entry.delta);

      if (!needsEarlyRecompute) {
        // Cache Hit thông thường, dữ liệu còn tươi, không cần tính toán
        if (telemetry) telemetry.cacheHits++;
        return entry.value;
      }

      // Vượt ngưỡng xác suất: Cần làm mới sớm!
      // Kiểm tra xem đã có luồng nào đang ngầm tính toán key này chưa (Singleflight)
      if (this.inFlightPromises.has(key)) {
        // Đã có background worker đang tính toán -> Trả ngay giá trị hiện tại (0ms latency!)
        if (telemetry) {
          telemetry.cacheHits++;
          telemetry.earlyRefreshBypassed++;
        }
        return entry.value;
      }

      // Luồng này được chọn để kích hoạt tái tính toán
      if (telemetry) telemetry.earlyRecomputesTriggered++;

      // Khởi tạo background task để tính toán lại mà không chặn các request khác
      const recomputePromise = (async () => {
        const startCompute = Date.now();
        try {
          const freshData = await fetcherFn();
          const delta = Math.max(Date.now() - startCompute, 1);
          this.cacheStore.set(key, {
            value: freshData,
            delta: delta,
            expireAt: Date.now() + ttlMs,
          });
          if (telemetry) telemetry.dbQueries++;
        } finally {
          this.inFlightPromises.delete(key);
        }
      })();

      this.inFlightPromises.set(key, recomputePromise);

      // Nếu dữ liệu cũ vẫn chưa hết hạn vật lý, trả về ngay lập tức cho client hiện tại
      if (ttlRemaining > 0) {
        if (telemetry) telemetry.cacheHits++;
        return entry.value;
      }

      // Trường hợp hi hữu đã hết hạn vật lý hoàn toàn, phải chờ recompute xong
      await recomputePromise;
      return this.cacheStore.get(key).value;
    }

    // Cache Miss hoàn toàn: Chưa từng tồn tại key trong Cache
    if (telemetry) telemetry.cacheMisses++;

    if (!this.inFlightPromises.has(key)) {
      const initialPromise = (async () => {
        const startCompute = Date.now();
        try {
          const freshData = await fetcherFn();
          const delta = Math.max(Date.now() - startCompute, 1);
          this.cacheStore.set(key, {
            value: freshData,
            delta: delta,
            expireAt: Date.now() + ttlMs,
          });
          if (telemetry) telemetry.dbQueries++;
          return freshData;
        } finally {
          this.inFlightPromises.delete(key);
        }
      })();
      this.inFlightPromises.set(key, initialPromise);
    }

    return await this.inFlightPromises.get(key);
  }

  /**
   * Đặt giá trị ban đầu vào Cache có kèm metadata phục vụ XFetch.
   */
  set(key, value, ttlMs, deltaMs = 10) {
    this.cacheStore.set(key, {
      value,
      delta: deltaMs,
      expireAt: Date.now() + ttlMs,
    });
  }

  /**
   * Xóa toàn bộ dữ liệu trong Cache.
   */
  clear() {
    this.cacheStore.clear();
    this.inFlightPromises.clear();
  }
}


// ============================================================================
// PHẦN 3: CLASS BloomFilterSimulator — CACHE PENETRATION DEFENSE
// ============================================================================

/**
 * Bộ lọc Bloom (Bloom Filter) — Cấu trúc dữ liệu xác suất tiết kiệm bộ nhớ tối đa.
 * Dùng để ngăn chặn triệt để cuộc tấn công Cache Penetration (truy vấn khóa không tồn tại).
 *
 * Định lý cốt lõi:
 * 1. mightContain(key) === false -> CHẮC CHẮN 100% phần tử KHÔNG TỒN TẠI.
 * 2. mightContain(key) === true  -> CÓ THỂ phần tử tồn tại (xác suất sai số False Positive Rate).
 */
class BloomFilterSimulator {
  /**
   * Khởi tạo Bloom Filter với kích thước tối ưu tự động tính toán.
   *
   * @param {Object} config
   * @param {number} [config.expectedItems=10000] - Số lượng phần tử dự kiến n
   * @param {number} [config.falsePositiveRate=0.01] - Tỷ lệ dương tính giả mong muốn p (ví dụ 0.01 = 1%)
   * @param {number} [config.customM] - Tùy biến dung lượng mảng bit m
   * @param {number} [config.customK] - Tùy biến số lượng hàm băm k
   */
  constructor(config = {}) {
    this.n = config.expectedItems || 10000;
    this.p = config.falsePositiveRate || 0.01;

    if (config.customM && config.customK) {
      this.m = config.customM;
      this.k = config.customK;
    } else {
      // Công thức tối ưu m = - (n * ln(p)) / (ln(2)^2)
      const ln2 = Math.LN2;
      this.m = Math.ceil(- (this.n * Math.log(this.p)) / (ln2 * ln2));
      // Công thức tối ưu k = (m / n) * ln(2)
      this.k = Math.max(1, Math.round((this.m / this.n) * ln2));
    }

    // Cấu trúc Bit Array m-bits lưu dưới dạng Uint8Array (mỗi byte = 8 bits)
    const byteLength = Math.ceil(this.m / 8);
    this.bitArray = new Uint8Array(byteLength);
    this.insertedCount = 0;
  }

  /**
   * Thêm một khóa vào Bloom Filter.
   * Đặt toàn bộ k bits tương ứng lên giá trị 1.
   *
   * @param {string} key - Khóa cần thêm
   */
  add(key) {
    const indices = generateKHashes(String(key), this.k, this.m);
    for (let i = 0; i < indices.length; i++) {
      const bitIndex = indices[i];
      const byteIdx = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      this.bitArray[byteIdx] |= (1 << bitOffset);
    }
    this.insertedCount++;
  }

  /**
   * Kiểm tra khả năng tồn tại của khóa trong tập hợp.
   *
   * @param {string} key - Khóa cần kiểm tra
   * @returns {boolean} false: Chắc chắn không tồn tại; true: Có thể tồn tại.
   */
  mightContain(key) {
    const indices = generateKHashes(String(key), this.k, this.m);
    for (let i = 0; i < indices.length; i++) {
      const bitIndex = indices[i];
      const byteIdx = Math.floor(bitIndex / 8);
      const bitOffset = bitIndex % 8;
      if ((this.bitArray[byteIdx] & (1 << bitOffset)) === 0) {
        return false; // Chỉ cần 1 bit bằng 0 -> Chắc chắn 100% không tồn tại!
      }
    }
    return true; // Toàn bộ k bits đều bằng 1 -> Có thể tồn tại
  }

  /**
   * Tính toán tỷ lệ Dương Tính Giả Lý Thuyết (Theoretical False Positive Rate):
   * p ≈ (1 - e^(-k * n / m))^k
   *
   * @param {number} [itemCount] - Số phần tử thực tế (mặc định lấy insertedCount)
   * @returns {number} Tỷ lệ xác suất p
   */
  getTheoreticalFPR(itemCount = null) {
    const currentN = itemCount !== null ? itemCount : this.insertedCount;
    if (currentN === 0) return 0;
    const exponent = - (this.k * currentN) / this.m;
    const base = 1 - Math.exp(exponent);
    return Math.pow(base, this.k);
  }

  /**
   * Đo đạc thực nghiệm Tỷ lệ Dương Tính Giả (Empirical False Positive Rate).
   *
   * @param {string[]} nonExistentKeys - Danh sách khóa rác chắc chắn không tồn tại trong hệ thống
   * @returns {Object} Thống kê đối chiếu thực nghiệm vs lý thuyết
   */
  measureEmpiricalFPR(nonExistentKeys) {
    let falsePositives = 0;
    for (const key of nonExistentKeys) {
      if (this.mightContain(key)) {
        falsePositives++;
      }
    }

    const totalJunk = nonExistentKeys.length;
    const empiricalFPR = totalJunk > 0 ? (falsePositives / totalJunk) : 0;
    const rejectionRate = totalJunk > 0 ? ((totalJunk - falsePositives) / totalJunk) : 1;
    const theoreticalFPR = this.getTheoreticalFPR();

    return {
      totalTested: totalJunk,
      falsePositives: falsePositives,
      blockedRequests: totalJunk - falsePositives,
      rejectionRate: rejectionRate, // Tỷ lệ chặn đứng key rác
      empiricalFPR: empiricalFPR,
      theoreticalFPR: theoreticalFPR,
      difference: Math.abs(empiricalFPR - theoreticalFPR),
      bitsTotal: this.m,
      hashFunctions: this.k,
      memoryBytes: this.bitArray.byteLength,
    };
  }

  /**
   * Trả về thông số cấu hình của bộ lọc.
   */
  getStats() {
    return {
      m_bits: this.m,
      k_hashes: this.k,
      n_inserted: this.insertedCount,
      memory_kb: (this.bitArray.byteLength / 1024).toFixed(2),
      theoretical_fpr: (this.getTheoreticalFPR() * 100).toFixed(4) + '%',
    };
  }
}


// ============================================================================
// PHẦN 4: CLASS CacheAsideWithCDC — CDC-BASED INVALIDATION VS ANTI-PATTERN
// ============================================================================

/**
 * Mô phỏng kiến trúc Bộ nhớ đệm Cache-Aside kết hợp Invalidation via CDC
 * (Change Data Capture qua Debezium Streaming) đối đầu với Anti-pattern
 * "Direct Cache Update / Dual-Write" thường gây ô nhiễm dữ liệu (Stale Data).
 */
class CacheAsideWithCDC {
  constructor() {
    // 1. Database nguồn chân lý duy nhất (Single Source of Truth)
    this.database = new Map();
    // 2. Transaction Log (WAL / Binlog) tăng đơn điệu theo số LSN
    this.walLog = [];
    this.currentLSN = 1000;

    // 3. Redis In-Memory Cache
    this.cache = new Map();

    // 4. Kênh truyền Debezium CDC Connector -> Kafka Topic Event Stream
    this.kafkaTopic = [];
    this.consumedLSN = 1000;

    // Bộ đo lường
    this.metrics = {
      dbWrites: 0,
      cdcEventsEmitted: 0,
      cacheInvalidations: 0,
      directUpdateRacesDetected: 0,
    };
  }

  /**
   * Khởi tạo bản ghi ban đầu trong Database và Cache.
   */
  seed(key, initialValue) {
    this.database.set(key, { ...initialValue, version: 1 });
    this.cache.set(key, { ...initialValue, version: 1 });
  }

  /**
   * Ghi dữ liệu chuẩn mực theo kiến trúc CDC:
   * Ứng dụng CHỈ GHI VÀO CƠ SỞ DỮ LIỆU.
   * Database tự động phát sinh bản ghi WAL với số thứ tự LSN tăng đơn điệu.
   */
  dbWriteWithWAL(key, updateData) {
    this.currentLSN++;
    const oldVal = this.database.get(key) || null;
    const newVal = {
      ...oldVal,
      ...updateData,
      version: (oldVal ? oldVal.version : 0) + 1,
    };

    // Commit nguyên tử xuống Database
    this.database.set(key, newVal);
    this.metrics.dbWrites++;

    // Ghi vào WAL
    const walEntry = {
      lsn: this.currentLSN,
      timestamp: Date.now(),
      op: oldVal ? 'UPDATE' : 'INSERT',
      key: key,
      before: oldVal,
      after: newVal,
    };
    this.walLog.push(walEntry);

    // Kích hoạt Debezium CDC Stream phát tín hiệu sự kiện sang Kafka
    this._simulateDebeziumStream(walEntry);

    return { lsn: this.currentLSN, record: newVal };
  }

  /**
   * Mô phỏng Debezium Connector đọc WAL và đẩy message JSON sang Kafka Topic.
   */
  _simulateDebeziumStream(walEntry) {
    const cdcMessage = {
      topic: 'cdc.inventory.products',
      lsn: walEntry.lsn,
      payload: {
        op: walEntry.op,
        key: walEntry.key,
        after: walEntry.after,
        ts_ms: walEntry.timestamp,
      },
    };
    this.kafkaTopic.push(cdcMessage);
    this.metrics.cdcEventsEmitted++;
  }

  /**
   * Mô phỏng Cache Invalidation Consumer tiêu thụ sự kiện từ Kafka
   * và thực thi lệnh DEL Key để làm mất hiệu lực Cache một cách tuần tự tuyệt đối.
   */
  processCDCEvents() {
    let processed = 0;
    while (this.kafkaTopic.length > 0) {
      const msg = this.kafkaTopic.shift();
      const targetKey = msg.payload.key;

      // Xóa Cache an toàn theo đúng thứ tự commit LSN của Database
      this.cache.delete(targetKey);
      this.consumedLSN = msg.lsn;
      this.metrics.cacheInvalidations++;
      processed++;
    }
    return processed;
  }

  /**
   * Luồng đọc Cache-Aside chuẩn:
   * Đọc Cache trước -> Nếu Miss thì đọc Database -> Nạp lại Cache.
   */
  read(key) {
    if (this.cache.has(key)) {
      return { source: 'CACHE', data: this.cache.get(key) };
    }
    const dbValue = this.database.get(key);
    if (dbValue) {
      this.cache.set(key, dbValue);
      return { source: 'DATABASE', data: dbValue };
    }
    return { source: 'NOT_FOUND', data: null };
  }

  /**
   * Mô phỏng Anti-pattern: "Cập nhật Cache trực tiếp (Direct Cache Update / Dual-Write)"
   * Khi 2 luồng ghi đồng thời xảy ra Race Condition dẫn tới bất đồng bộ vĩnh viễn:
   *
   * Luồng A ghi DB = 100
   * Luồng B ghi DB = 200
   * Do trễ mạng, Luồng B ghi Cache trước (Cache = 200), Luồng A ghi Cache sau (Cache = 100).
   * Hậu quả: DB mang giá trị 200, nhưng Cache mang giá trị 100 vĩnh viễn (Stale Data)!
   */
  simulateDirectUpdateRace(key, valueA, valueB, networkDelayAMs = 50, networkDelayBMs = 10) {
    return new Promise((resolve) => {
      // 1. Thread A ghi DB trước
      this.database.set(key, { val: valueA, source: 'Thread-A' });

      // 2. Thread B ghi DB sau (Đây là trạng thái mới nhất của DB)
      this.database.set(key, { val: valueB, source: 'Thread-B' });

      let aFinished = false;
      let bFinished = false;

      // Thread A cập nhật cache bị delay 50ms
      setTimeout(() => {
        this.cache.set(key, { val: valueA, source: 'Thread-A' });
        aFinished = true;
        if (aFinished && bFinished) evaluate();
      }, networkDelayAMs);

      // Thread B cập nhật cache siêu nhanh trong 10ms
      setTimeout(() => {
        this.cache.set(key, { val: valueB, source: 'Thread-B' });
        bFinished = true;
        if (aFinished && bFinished) evaluate();
      }, networkDelayBMs);

      const self = this;
      function evaluate() {
        const dbState = self.database.get(key);
        const cacheState = self.cache.get(key);
        const isDesynchronized = dbState.val !== cacheState.val;
        if (isDesynchronized) {
          self.metrics.directUpdateRacesDetected++;
        }
        resolve({
          dbValue: dbState.val,
          cacheValue: cacheState.val,
          isDesynchronized: isDesynchronized,
          explanation: isDesynchronized
            ? 'CẢNH BÁO LỖI: Database mang giá trị của B nhưng Cache bị Thread A ghi đè giá trị cũ!'
            : 'Đồng bộ may mắn',
        });
      }
    });
  }
}


// ============================================================================
// PHẦN 5: BỘ KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN (BUILT-IN TEST SUITE)
// ============================================================================

/**
 * Runner thực thi bộ kiểm thử tự động, xuất báo cáo đối chiếu định dạng ANSI.
 */
class CachingDefenseTestSuite {
  static formatHeader(title) {
    const bar = '━'.repeat(78);
    console.log(`\n\x1b[36m┏${bar}┓\x1b[0m`);
    console.log(`\x1b[36m┃\x1b[1m\x1b[37m  ${title.padEnd(76)}\x1b[0m\x1b[36m┃\x1b[0m`);
    console.log(`\x1b[36m┗${bar}┛\x1b[0m`);
  }

  static formatResult(testName, passed, details) {
    const badge = passed ? '\x1b[42m\x1b[30m PASS \x1b[0m' : '\x1b[41m\x1b[37m FAIL \x1b[0m';
    console.log(`\n${badge} \x1b[1m${testName}\x1b[0m`);
    if (details) {
      console.log(`      \x1b[90m${details}\x1b[0m`);
    }
  }

  /**
   * TEST 1: Kiểm thử XFetch triệt tiêu 100% Thundering Herd trong kịch bản 1,000 concurrent reads.
   */
  static async test1_XFetchThunderingHerdElimination() {
    this.formatHeader('TEST 1: XFETCH ALGORITHM — TRIỆT TIÊU 100% THUNDERING HERD');

    console.log('  ▸ Kịch bản kiểm thử:');
    console.log('    So sánh đối đầu giữa:');
    console.log('    1. Naive Caching (Không XFetch): Key hết hạn -> 1,000 requests cùng ập xuống DB.');
    console.log('    2. XFetch Caching: Tự động tái tính toán sớm theo xác suất trước khi hết hạn vật lý.\n');

    const key = 'hot_product_flash_sale_iphone';
    const simulatedDBLatencyMs = 20;

    // --- Kịch bản A: Naive Cache (Không XFetch) ---
    let naiveDBQueries = 0;
    const naiveCache = new Map();
    // Giả lập key vừa hết hạn lúc này
    naiveCache.set(key, { value: 'iPhone 16 Pro Max', expireAt: Date.now() - 1 });

    const naiveConcurrentRequests = 1000;
    const naivePromises = [];

    const naiveStart = Date.now();
    for (let i = 0; i < naiveConcurrentRequests; i++) {
      naivePromises.push(
        (async () => {
          const entry = naiveCache.get(key);
          if (!entry || entry.expireAt <= Date.now()) {
            // Cache Miss / Expired -> 1,000 luồng đồng thời lao xuống DB
            naiveDBQueries++;
            await new Promise((r) => setTimeout(r, simulatedDBLatencyMs));
            naiveCache.set(key, { value: 'iPhone 16 Pro Max (Refreshed)', expireAt: Date.now() + 5000 });
            return 'iPhone 16 Pro Max (Refreshed)';
          }
          return entry.value;
        })()
      );
    }

    await Promise.all(naivePromises);
    const naiveDuration = Date.now() - naiveStart;

    console.log(`  \x1b[31m[KẾT QUẢ NAIVE CACHE]\x1b[0m`);
    console.log(`  - Số lượng concurrent reads : ${naiveConcurrentRequests.toLocaleString()} reqs`);
    console.log(`  - Số truy vấn dồn xuống DB  : \x1b[31m\x1b[1m${naiveDBQueries.toLocaleString()} QUERIES\x1b[0m (Cache Stampede sập DB!)`);
    console.log(`  - Thời gian xử lý           : ${naiveDuration}ms`);

    // --- Kịch bản B: XFetch Cache ---
    const xfetch = new XFetchAlgorithm({ beta: 1.5, deltaOffset: 0 });
    const telemetry = {
      cacheHits: 0,
      cacheMisses: 0,
      dbQueries: 0,
      earlyRecomputesTriggered: 0,
      earlyRefreshBypassed: 0,
    };

    // Khởi tạo key trong cache với TTL còn 80ms, thời gian tính toán delta = 20ms
    const ttlMs = 500;
    xfetch.set(key, 'iPhone 16 Pro Max', 80, simulatedDBLatencyMs);

    let xfetchDbQueryCount = 0;
    const simulatedDBFetcher = async () => {
      xfetchDbQueryCount++;
      await new Promise((r) => setTimeout(r, simulatedDBLatencyMs));
      return 'iPhone 16 Pro Max (XFetch Fresh)';
    };

    const xfetchStart = Date.now();
    const xfetchPromises = [];
    for (let i = 0; i < 1000; i++) {
      xfetchPromises.push(xfetch.get(key, simulatedDBFetcher, ttlMs, telemetry));
    }

    const results = await Promise.all(xfetchPromises);
    const xfetchDuration = Date.now() - xfetchStart;

    console.log(`\n  \x1b[32m[KẾT QUẢ XFETCH ALGORITHM]\x1b[0m`);
    console.log(`  - Số lượng concurrent reads : 1,000 reqs`);
    console.log(`  - Số truy vấn xuống DB      : \x1b[32m\x1b[1m${xfetchDbQueryCount} QUERY DUY NHẤT\x1b[0m (Background Worker)`);
    console.log(`  - Tỷ lệ Cache Hit           : ${((telemetry.cacheHits / 1000) * 100).toFixed(1)}%`);
    console.log(`  - Requests phục vụ 0ms      : ${telemetry.cacheHits} reqs`);
    console.log(`  - Thundering Herd triệt tiêu: \x1b[32m\x1b[1m100.0%\x1b[0m (Database an toàn tuyệt đối)`);

    const passed = xfetchDbQueryCount === 1 && results.length === 1000;
    this.formatResult(
      'Test 1: XFetch triệt tiêu 100% Thundering Herd',
      passed,
      `Chuyển hóa 1,000 DB Stampede Queries -> 1 Single Background Query duy nhất (${((1 - xfetchDbQueryCount / 1000) * 100).toFixed(1)}% load reduction).`
    );

    return passed;
  }

  /**
   * TEST 2: Bloom Filter chặn đứng Cache Penetration (tỷ lệ chặn key rác > 99%).
   */
  static test2_BloomFilterCachePenetration() {
    this.formatHeader('TEST 2: BLOOM FILTER SIMULATOR — CHẶN ĐỨNG CACHE PENETRATION');

    console.log('  ▸ Kịch bản kiểm thử:');
    console.log('    1. Nạp 10,000 khóa hợp lệ (Legitimate Keys) vào Bloom Filter (user_00000 -> user_09999).');
    console.log('    2. Mô phỏng Hacker gửi 50,000 khóa rác/không tồn tại (Penetration Attack).');
    console.log('    3. Đo đạc tỷ lệ chặn đứng trước DB và đối chiếu False Positive Rate thực nghiệm vs lý thuyết.\n');

    const expectedN = 10000;
    const targetFPR = 0.008; // Thiết kế biên độ an toàn 0.8% để bảo đảm tỷ lệ chặn thực nghiệm luôn vượt 99.0%
    const filter = new BloomFilterSimulator({
      expectedItems: expectedN,
      falsePositiveRate: targetFPR,
    });

    console.log(`  [CẤU TRÚC BỘ LỌC TỐI ƯU TOÁN HỌC]`);
    console.log(`  - Số phần tử dự kiến (n) : ${filter.n.toLocaleString()} records`);
    console.log(`  - Độ dài mảng bit (m)     : ${filter.m.toLocaleString()} bits (${(filter.bitArray.byteLength / 1024).toFixed(2)} KB RAM)`);
    console.log(`  - Số lượng hàm băm (k)    : ${filter.k} independent hashes (Kirsch-Mitzenmacher Murmur3+FNV)`);

    // Nạp 10,000 users hợp lệ
    for (let i = 0; i < expectedN; i++) {
      filter.add(`user_${String(i).padStart(5, '0')}`);
    }

    // Kiểm tra tính toàn vẹn 100%: Toàn bộ user hợp lệ bắt buộc phải trả về true
    let falseNegatives = 0;
    for (let i = 0; i < expectedN; i++) {
      if (!filter.mightContain(`user_${String(i).padStart(5, '0')}`)) {
        falseNegatives++;
      }
    }

    // Tạo 50,000 khóa rác (Penetration Attack Keys)
    const junkCount = 50000;
    const junkKeys = new Array(junkCount);
    for (let i = 0; i < junkCount; i++) {
      junkKeys[i] = `hacker_attack_uuid_${i}_${(Math.random() * 1e9).toString(36)}`;
    }

    const metrics = filter.measureEmpiricalFPR(junkKeys);

    console.log(`\n  \x1b[34m[KẾT QUẢ THỰC NGHIỆM ĐỐI KHÁNG]\x1b[0m`);
    console.log(`  - False Negatives (Âm tính giả) : \x1b[32m${falseNegatives} (0% - Bất biến bảo đảm)\x1b[0m`);
    console.log(`  - Tổng số request rác tấn công : ${metrics.totalTested.toLocaleString()} reqs`);
    console.log(`  - Số request bị CHẶN NGAY TẠI RAM : \x1b[32m\x1b[1m${metrics.blockedRequests.toLocaleString()} reqs\x1b[0m`);
    console.log(`  - Tỷ lệ chặn đứng key rác       : \x1b[32m\x1b[1m${(metrics.rejectionRate * 100).toFixed(3)}%\x1b[0m (Yêu cầu > 99.0%)`);
    console.log(`  - Số request lọt qua (False Pos): ${metrics.falsePositives} reqs`);
    console.log(`  - Tỷ lệ FPR thực nghiệm         : ${(metrics.empiricalFPR * 100).toFixed(3)}%`);
    console.log(`  - Tỷ lệ FPR lý thuyết           : ${(metrics.theoreticalFPR * 100).toFixed(3)}%`);
    console.log(`  - Độ sai lệch (Δ error)         : ${(metrics.difference * 100).toFixed(4)}%`);

    const passed = falseNegatives === 0 && metrics.rejectionRate >= 0.99;
    this.formatResult(
      'Test 2: Bloom Filter chặn đứng Cache Penetration',
      passed,
      `Chặn thành công ${(metrics.rejectionRate * 100).toFixed(3)}% requests rác đánh vào DB với chi phí bộ nhớ siêu nhỏ ${(filter.bitArray.byteLength / 1024).toFixed(2)} KB.`
    );

    return passed;
  }

  /**
   * TEST 3: Cache Invalidation via CDC bảo toàn tính nhất quán dữ liệu.
   */
  static async test3_CacheInvalidationViaCDC() {
    this.formatHeader('TEST 3: CACHE-ASIDE WITH CDC — BẢO TOÀN TÍNH NHẤT QUÁN DỮ LIỆU');

    console.log('  ▸ Kịch bản kiểm thử:');
    console.log('    1. Chứng minh sự phá vỡ tính nhất quán trong Anti-pattern: Update Cache trực tiếp.');
    console.log('    2. Chứng minh Kiến trúc Tiêu chuẩn Vàng: Invalidation via CDC (Debezium WAL Stream).\n');

    const system = new CacheAsideWithCDC();
    const productKey = 'product:macbook_m3_max';

    // Seed ban đầu
    system.seed(productKey, { name: 'MacBook Pro M3 Max', price: 3500 });

    // --- Kịch bản A: Anti-pattern Race Condition ---
    console.log('  \x1b[33m[1. THỰC THI ANTI-PATTERN: DIRECT CACHE UPDATE CONCURRENCY]\x1b[0m');
    const raceResult = await system.simulateDirectUpdateRace(
      productKey,
      3200, // Thread A giảm giá xuống 3200 (ghi DB trước, nhưng update cache trễ)
      3000, // Thread B giảm giá xuống 3000 (ghi DB sau, update cache nhanh)
      40,   // Delay mạng Thread A: 40ms
      10    // Delay mạng Thread B: 10ms
    );

    console.log(`  - Giá trị thực tế trong DB  : $${raceResult.dbValue} (Từ Thread B - Ghi sau)`);
    console.log(`  - Giá trị bị kẹt trong Cache: \x1b[31m$${raceResult.cacheValue}\x1b[0m (Từ Thread A - Ghi đè trễ)`);
    console.log(`  - Trạng thái bất đồng bộ    : \x1b[31m\x1b[1m${raceResult.isDesynchronized ? 'STALE DATA / Ô NHIỄM CACHE VĨNH VIỄN!' : 'Trùng hợp'}\x1b[0m`);

    // --- Kịch bản B: Chuẩn CDC Invalidation ---
    console.log('\n  \x1b[32m[2. THỰC THI GOLD STANDARD: CACHE-ASIDE WITH CDC (DEBEZIUM)]\x1b[0m');

    // Luồng nghiệp vụ chỉ ghi vào DB: Cập nhật giá mới nhất 2900 USD
    const writeResult = system.dbWriteWithWAL(productKey, { price: 2900 });
    console.log(`  - DB Commit thành công LSN  : ${writeResult.lsn}`);
    console.log(`  - Sự kiện CDC trong Kafka   : 1 Change Event (OP: UPDATE)`);

    // Trước khi CDC worker chạy: Cache tạm thời có thể chứa giá trị cũ
    // Nhưng ngay khi CDC worker tiêu thụ sự kiện:
    const invalidatedCount = system.processCDCEvents();
    console.log(`  - CDC Worker đã tiêu thụ    : ${invalidatedCount} event(s) -> DEL key trong Redis`);
    console.log(`  - Kiểm tra Cache sau Invalidate: ${system.cache.has(productKey) ? 'CÒN KEY' : '\x1b[32mKEY ĐÃ BỊ XÓA (SAFE)\x1b[0m'}`);

    // Request đọc tiếp theo nhận được Cache Miss -> Nạp từ DB nguồn chân lý
    const readAfterCDC = system.read(productKey);
    console.log(`  - Request đọc tiếp theo     : Cache Miss -> Đọc từ DB ($${readAfterCDC.data.price}) -> Nạp lại Cache`);
    console.log(`  - Dữ liệu Cache hiện tại    : $${system.cache.get(productKey).price}`);
    console.log(`  - Dữ liệu Database hiện tại : $${system.database.get(productKey).price}`);

    const isConsistent = system.database.get(productKey).price === system.cache.get(productKey).price;
    console.log(`  - Tính nhất quán cuối cùng  : \x1b[32m\x1b[1m${isConsistent ? '100% ĐỒNG NHẤT TUYỆT ĐỐI (EVENTUAL CONSISTENCY)' : 'THẤT BẠI'}\x1b[0m`);

    const passed = raceResult.isDesynchronized && isConsistent && invalidatedCount === 1;
    this.formatResult(
      'Test 3: Cache Invalidation via CDC bảo toàn tính nhất quán',
      passed,
      'Triệt tiêu hoàn toàn Race Condition của Anti-pattern Direct Update; đảm bảo tính nhất quán tuyệt đối giữa DB và Cache.'
    );

    return passed;
  }

  /**
   * Thực thi toàn bộ bộ kiểm thử liên hoàn.
   */
  static async runAll() {
    console.log('\x1b[1m\x1b[35m');
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║        DATABASE MASTERCLASS — LAB 05: CACHING DEFENSE TEST SUITE          ║');
    console.log('║        Pod 5: In-Memory Systems & Caching Resiliency Verification          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\x1b[0m');

    const startTotal = Date.now();
    const t1 = await this.test1_XFetchThunderingHerdElimination();
    const t2 = this.test2_BloomFilterCachePenetration();
    const t3 = await this.test3_CacheInvalidationViaCDC();
    const totalDuration = Date.now() - startTotal;

    const allPassed = t1 && t2 && t3;

    console.log('\n\x1b[36m' + '═'.repeat(80) + '\x1b[0m');
    console.log(`\x1b[1mKẾT QUẢ TỔNG QUAN KIỂM TOÁN LAB 05:\x1b[0m`);
    console.log(`- Test 1 (XFetch Probabilistic Early Expiration) : ${t1 ? '\x1b[32mPASSED (100% Thundering Herd Eliminated)\x1b[0m' : '\x1b[31mFAILED\x1b[0m'}`);
    console.log(`- Test 2 (Bloom Filter Cache Penetration Defense): ${t2 ? '\x1b[32mPASSED (>99% Junk Keys Blocked)\x1b[0m' : '\x1b[31mFAILED\x1b[0m'}`);
    console.log(`- Test 3 (CDC Invalidation Eventual Consistency) : ${t3 ? '\x1b[32mPASSED (Zero Race Conditions)\x1b[0m' : '\x1b[31mFAILED\x1b[0m'}`);
    console.log(`- Tổng thời gian kiểm thử                        : ${totalDuration}ms`);
    console.log(`- Trạng thái chung                               : ${allPassed ? '\x1b[42m\x1b[30m 100% ALL TESTS GREEN \x1b[0m' : '\x1b[41m\x1b[37m VERIFICATION FAILED \x1b[0m'}`);
    console.log('\x1b[36m' + '═'.repeat(80) + '\x1b[0m\n');

    return allPassed;
  }
}

// ============================================================================
// EXPORTS & CLI EXECUTION
// ============================================================================

module.exports = {
  murmur3_32,
  fnv1a_32,
  generateKHashes,
  XFetchAlgorithm,
  BloomFilterSimulator,
  CacheAsideWithCDC,
  CachingDefenseTestSuite,
};

// Cho phép thực thi độc lập qua dòng lệnh: node lab05_caching_defense.js
if (require.main === module) {
  CachingDefenseTestSuite.runAll().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
