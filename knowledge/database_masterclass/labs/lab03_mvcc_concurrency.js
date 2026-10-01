/**
 * 🏛️ DATABASE MASTERCLASS — LAB 03: MVCC & CONCURRENCY CONTROL ENGINE
 * (HỆ THỐNG MÔ PHỎNG ĐỒNG THỜI & KIỂM SOÁT ĐA PHIÊN BẢN CƠ SỞ DỮ LIỆU)
 *
 * File: lab03_mvcc_concurrency.js
 * Author: Antigravity Autonomous Engineering Fleet — Pod 3 (Concurrency Specialist)
 * Operating System: Pure Node.js (Zero External Dependencies)
 * Standard: Bilingual Terminology English (Tiếng Việt)
 *
 * ============================================================================
 * KIẾN TRÚC MÔ-ĐUN PHÒNG THÍ NGHIỆM (LABORATORY ARCHITECTURAL MODULES):
 * 1. MVCCEngine:
 *    - HeapTuple (xmin, xmax, ctid, infomask, HOT - Heap-Only Tuple chain).
 *    - TransactionManager & Snapshot Generator (xmin:xmax:xip_list).
 *    - PostgreSQL-style Canonical Tuple Visibility Check Algorithm.
 *    - Vacuum Engine dọn dẹp các Dead Tuples (Bộ dữ liệu chết).
 * 2. ConcurrencyAnomalyDetector:
 *    - Dirty Read (G1a) & Non-repeatable Read (G1b / Fuzzy Read).
 *    - Write Skew (G-skew-write) trên bài toán Ca Trực Bác Sĩ (On-Call Doctors).
 *    - Serializable Snapshot Isolation (SSI) với đồ thị phụ thuộc rw-antidependency
 *      và phát hiện chu kỳ nguy hiểm (Dangerous Structure Detection).
 * 3. DeadlockDetector:
 *    - Lock Manager (Shared S-Lock & Exclusive X-Lock).
 *    - Wait-For Graph (WFG - Đồ thị chờ đợi tài nguyên).
 *    - Thuật toán DFS phát hiện chu trình 3 màu (White, Gray, Black).
 *    - Chiến lược chọn nạn nhân (Victim Selection) & Tự động Abort.
 * 4. Built-in Test Suite:
 *    - Test 1: MVCC Visibility Test (Read Committed vs Repeatable Read).
 *    - Test 2: Write Skew Anomaly vs SSI Detection & Resolution.
 *    - Test 3: Deadlock Cycle Detection & Automatic Resource Release.
 * ============================================================================
 */

'use strict';

const assert = require('node:assert');

// ============================================================================
// HẰNG SỐ & ĐỊNH DANH HỆ THỐNG (CONSTANTS & SYSTEM ENUMS)
// ============================================================================

/**
 * Trạng thái Giao dịch (Transaction Status)
 */
const TxStatus = {
  IN_PROGRESS: 'IN_PROGRESS', // Đang diễn ra
  COMMITTED: 'COMMITTED',     // Đã cam kết thành công
  ABORTED: 'ABORTED',         // Đã hủy / Hoàn tác
};

/**
 * Cấp độ Cô lập (Isolation Levels)
 */
const IsolationLevel = {
  READ_UNCOMMITTED: 'READ_UNCOMMITTED', // Đọc chưa cam kết (cho phép Dirty Read)
  READ_COMMITTED: 'READ_COMMITTED',     // Đọc đã cam kết (mỗi query 1 snapshot mới)
  REPEATABLE_READ: 'REPEATABLE_READ',   // Đọc lặp lại được (1 snapshot cho cả transaction)
  SERIALIZABLE: 'SERIALIZABLE',         // Tuần tự hóa (SSI - Serializable Snapshot Isolation)
};

/**
 * Cờ Infomask của Tuple (Tuple Infomask Flags theo chuẩn PostgreSQL)
 */
const TupleFlags = {
  HEAP_XMIN_COMMITTED: 0x0001, // xmin đã commit
  HEAP_XMIN_ABORTED: 0x0002,   // xmin đã abort
  HEAP_XMAX_COMMITTED: 0x0004, // xmax đã commit
  HEAP_XMAX_ABORTED: 0x0008,   // xmax đã abort
  HEAP_HOT_UPDATED: 0x0010,    // Đã được cập nhật dạng HOT (Heap-Only Tuple)
};

/**
 * Loại Khóa (Lock Modes)
 */
const LockMode = {
  SHARED: 'S',      // Khóa chia sẻ (Đọc)
  EXCLUSIVE: 'X',   // Khóa độc quyền (Ghi)
};

// ============================================================================
// 1. PHẦN MỘT: CẤU TRÚC DỮ LIỆU HEAP & SNAPSHOT (HEAP & SNAPSHOT INTERNALS)
// ============================================================================

/**
 * Lớp đại diện cho một con trỏ vật lý Tuple (Physical Item Pointer / ctid)
 * Định dạng: (BlockNumber, OffsetNumber)
 */
class ItemPointer {
  constructor(block, offset) {
    this.block = block;
    this.offset = offset;
  }

  toString() {
    return `(${this.block}, ${this.offset})`;
  }

  equals(other) {
    if (!other) return false;
    return this.block === other.block && this.offset === other.offset;
  }
}

/**
 * Lớp đại diện cho một Heap Tuple trong trang nhớ PostgreSQL
 */
class HeapTuple {
  /**
   * @param {string} id - Khóa chính logic (Logical Primary Key)
   * @param {object} data - Dữ liệu thực tế của tuple
   * @param {number} xmin - Transaction ID tạo ra tuple (INSERT)
   * @param {ItemPointer} ctid - Vị trí vật lý hiện tại hoặc trỏ tới tuple mới nhất
   */
  constructor(id, data, xmin, ctid) {
    this.id = id;
    this.data = JSON.parse(JSON.stringify(data)); // Deep copy payload
    this.xmin = xmin;                             // XID chèn bản ghi
    this.xmax = 0;                                // XID xóa hoặc cập nhật bản ghi (0 nếu còn sống)
    this.ctid = ctid;                             // Con trỏ vật lý (Physical pointer)
    this.infomask = 0;                            // Cờ trạng thái tối ưu hóa
    this.isHotUpdated = false;                    // Đánh dấu Heap-Only Tuple
  }

  /**
   * Thiết lập cờ trạng thái (Set Flag)
   */
  setFlag(flag) {
    this.infomask |= flag;
  }

  /**
   * Kiểm tra cờ trạng thái (Has Flag)
   */
  hasFlag(flag) {
    return (this.infomask & flag) === flag;
  }

  /**
   * Tạo bản sao độc lập (Clone Tuple)
   */
  clone() {
    const copy = new HeapTuple(this.id, this.data, this.xmin, new ItemPointer(this.ctid.block, this.ctid.offset));
    copy.xmax = this.xmax;
    copy.infomask = this.infomask;
    copy.isHotUpdated = this.isHotUpdated;
    return copy;
  }
}

/**
 * Lớp đại diện cho Ảnh chụp trạng thái dữ liệu (Snapshot)
 * Định dạng chuẩn: `xmin:xmax:xip_list`
 */
class Snapshot {
  /**
   * @param {number} xmin - XID nhỏ nhất vẫn đang active tại thời điểm chụp
   * @param {number} xmax - XID đầu tiên chưa được cấp phát tại thời điểm chụp
   * @param {Set<number>} xip - Tập hợp các XID đang active nằm giữa [xmin, xmax)
   */
  constructor(xmin, xmax, xip) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.xip = new Set(xip);
  }

  toString() {
    const activeList = Array.from(this.xip).sort((a, b) => a - b).join(',');
    return `${this.xmin}:${this.xmax}:${activeList ? activeList : ''}`;
  }
}

/**
 * Ngữ cảnh Giao dịch (Transaction Context)
 */
class TransactionContext {
  /**
   * @param {number} txId - Transaction Identifier
   * @param {string} isolationLevel - Cấp độ cô lập
   */
  constructor(txId, isolationLevel) {
    this.txId = txId;
    this.isolationLevel = isolationLevel;
    this.status = TxStatus.IN_PROGRESS;
    this.snapshot = null;                 // Snapshot cố định (dành cho RR & SSI)
    this.readSet = new Set();             // Danh sách tuple ID đã đọc (phục vụ SSI)
    this.writeSet = new Set();            // Danh sách tuple ID đã ghi (phục vụ SSI & 2PL)
    this.startTime = Date.now();
  }
}

// ============================================================================
// 2. PHẦN HAI: ĐỘNG CƠ MVCC POSTGRESQL CHUẨN MỰC (MVCC ENGINE)
// ============================================================================

/**
 * Động cơ Quản lý Đa Phiên bản MVCC (Multi-Version Concurrency Control Engine)
 */
class MVCCEngine {
  constructor() {
    this.heap = [];                                 // Heap Storage: Danh sách các HeapTuple
    this.txIdCounter = 100;                         // Bộ đếm cấp phát Transaction ID (bắt đầu từ 100)
    this.activeTransactions = new Map();            // txId -> TransactionContext
    this.transactionStatus = new Map();             // txId -> TxStatus (COMMITTED / ABORTED / IN_PROGRESS)
    
    // Tọa độ vật lý trang bộ nhớ (Page Block & Offset)
    this.currentBlock = 0;
    this.currentOffset = 0;
    this.maxOffsetPerPage = 100;
  }

  /**
   * Cấp phát tọa độ vật lý mới cho Tuple
   * @returns {ItemPointer}
   */
  allocateItemPointer() {
    this.currentOffset++;
    if (this.currentOffset > this.maxOffsetPerPage) {
      this.currentBlock++;
      this.currentOffset = 1;
    }
    return new ItemPointer(this.currentBlock, this.currentOffset);
  }

  /**
   * Khởi tạo Giao dịch mới (Begin Transaction)
   * @param {string} isolationLevel - Cấp độ cô lập (Mặc định READ_COMMITTED)
   * @returns {TransactionContext}
   */
  beginTransaction(isolationLevel = IsolationLevel.READ_COMMITTED) {
    const txId = ++this.txIdCounter;
    const tx = new TransactionContext(txId, isolationLevel);
    
    this.activeTransactions.set(txId, tx);
    this.transactionStatus.set(txId, TxStatus.IN_PROGRESS);

    // Đối với REPEATABLE_READ và SERIALIZABLE: Chụp Snapshot ngay tại thời điểm khởi tạo
    if (isolationLevel === IsolationLevel.REPEATABLE_READ || isolationLevel === IsolationLevel.SERIALIZABLE) {
      tx.snapshot = this.createSnapshot();
    }

    return tx;
  }

  /**
   * Tạo Ảnh chụp trạng thái dữ liệu (Create Snapshot: xmin:xmax:xip_list)
   * @returns {Snapshot}
   */
  createSnapshot() {
    const activeTxIds = Array.from(this.activeTransactions.keys()).sort((a, b) => a - b);
    
    // xmax: Transaction ID đầu tiên chưa được cấp phát (txIdCounter + 1)
    const xmax = this.txIdCounter + 1;
    
    // xmin: Transaction ID nhỏ nhất trong số các transaction đang active
    // Nếu không có transaction nào active, xmin = xmax
    const xmin = activeTxIds.length > 0 ? activeTxIds[0] : xmax;
    
    // xip: Danh sách transaction active nằm giữa [xmin, xmax)
    const xip = new Set(activeTxIds.filter(id => id >= xmin && id < xmax));

    return new Snapshot(xmin, xmax, xip);
  }

  /**
   * Lấy Snapshot hiệu lực cho câu lệnh truy vấn của transaction
   * @param {TransactionContext} tx
   * @returns {Snapshot}
   */
  getEffectiveSnapshot(tx) {
    if (tx.isolationLevel === IsolationLevel.READ_COMMITTED) {
      // READ_COMMITTED: Luôn chụp Snapshot mới cho từng câu lệnh truy vấn
      return this.createSnapshot();
    }
    // REPEATABLE_READ & SERIALIZABLE: Tái sử dụng Snapshot chụp lúc đầu transaction
    if (!tx.snapshot) {
      tx.snapshot = this.createSnapshot();
    }
    return tx.snapshot;
  }

  /**
   * Giải thuật Kiểm tra Tính Khả Kiến của Tuple (PostgreSQL Tuple Visibility Check Algorithm)
   * Đây là trái tim của MVCC giải quyết triệt để bài toán: Tuple này có nhìn thấy được không?
   *
   * @param {HeapTuple} tuple - Bản ghi Heap cần kiểm tra
   * @param {Snapshot} snapshot - Snapshot tại thời điểm kiểm tra
   * @param {TransactionContext} currentTx - Giao dịch đang thực thi đọc
   * @returns {boolean} true nếu khả kiến (visible), false nếu vô hình (invisible)
   */
  isTupleVisible(tuple, snapshot, currentTx) {
    const xmin = tuple.xmin;
    const xmax = tuple.xmax;
    const xminStatus = this.transactionStatus.get(xmin) || TxStatus.IN_PROGRESS;

    // ------------------------------------------------------------------------
    // BƯỚC 1: KIỂM TRA TÍNH KHẢ KIẾN CỦA XMIN (TRANSACTION TẠO RA TUPLE)
    // ------------------------------------------------------------------------

    // Trường hợp 1.1: Tuple được tạo bởi chính giao dịch hiện tại
    if (xmin === currentTx.txId) {
      // Nếu chính giao dịch hiện tại đã xóa hoặc cập nhật nó (xmax == currentTx)
      if (xmax === currentTx.txId) {
        return false; // Vô hình vì chính mình đã xóa
      }
      // Nếu chưa bị chính mình xóa, nó luôn luôn khả kiến với chính mình
      return true;
    }

    // Trường hợp 1.2: Giao dịch tạo ra tuple đã bị ABORT
    if (xminStatus === TxStatus.ABORTED) {
      return false; // Dữ liệu của transaction abort không bao giờ tồn tại
    }

    // Trường hợp 1.3: Giao dịch tạo ra tuple vẫn đang IN_PROGRESS
    if (xminStatus === TxStatus.IN_PROGRESS) {
      // Trong cấp độ READ_UNCOMMITTED (Dirty Read), có thể nhìn thấy dữ liệu chưa commit
      if (currentTx.isolationLevel === IsolationLevel.READ_UNCOMMITTED) {
        return true;
      }
      // Các cấp độ chuẩn khác: Tuyệt đối không nhìn thấy dữ liệu chưa commit của transaction khác
      return false;
    }

    // Trường hợp 1.4: Giao dịch tạo ra tuple đã COMMITTED
    // Áp dụng bộ lọc Snapshot: xmin:xmax:xip
    if (xmin >= snapshot.xmax) {
      // Tuple được commit bởi transaction sinh ra SAU khi chụp Snapshot -> VÔ HÌNH
      return false;
    }

    if (snapshot.xip.has(xmin)) {
      // Tại thời điểm snapshot, transaction xmin vẫn đang chạy (chưa commit) -> VÔ HÌNH
      return false;
    }

    // Đến đây, xmin đã được xác nhận là HỢP LỆ & KHẢ KIẾN (Visible Insert).

    // ------------------------------------------------------------------------
    // BƯỚC 2: KIỂM TRA TÍNH KHẢ KIẾN CỦA XMAX (TRANSACTION XÓA/CẬP NHẬT TUPLE)
    // ------------------------------------------------------------------------

    // Trường hợp 2.1: Tuple chưa từng bị xóa hay cập nhật (xmax == 0)
    if (xmax === 0) {
      return true; // Tuple đang sống nguyên vẹn -> KHẢ KIẾN
    }

    // Trường hợp 2.2: Tuple bị xóa/cập nhật bởi chính giao dịch hiện tại
    if (xmax === currentTx.txId) {
      return false; // Chính mình đã xóa -> VÔ HÌNH
    }

    const xmaxStatus = this.transactionStatus.get(xmax) || TxStatus.IN_PROGRESS;

    // Trường hợp 2.3: Giao dịch xóa tuple đã bị ABORT
    if (xmaxStatus === TxStatus.ABORTED) {
      // Thao tác xóa bị hủy bỏ, dữ liệu được khôi phục -> KHẢ KIẾN
      return true;
    }

    // Trường hợp 2.4: Giao dịch xóa tuple vẫn đang IN_PROGRESS (chưa commit)
    if (xmaxStatus === TxStatus.IN_PROGRESS) {
      // Trong cấp độ READ_UNCOMMITTED (Dirty Read): Thao tác xóa/cập nhật dở dang coi như có hiệu lực
      if (currentTx.isolationLevel === IsolationLevel.READ_UNCOMMITTED) {
        return false; // Tuple cũ coi như đã bị xóa/thay thế bẩn
      }
      // Transaction khác đang sửa/xóa nhưng chưa commit -> Với snapshot của ta, tuple VẪN SỐNG!
      return true;
    }

    // Trường hợp 2.5: Giao dịch xóa tuple đã COMMITTED
    if (xmax >= snapshot.xmax) {
      // Thao tác xóa xảy ra SAU khi chụp snapshot -> Tại thời điểm snapshot, tuple vẫn còn sống!
      return true;
    }

    if (snapshot.xip.has(xmax)) {
      // Thao tác xóa đang dở dang tại thời điểm chụp snapshot -> VẪN SỐNG!
      return true;
    }

    // Thao tác xóa đã commit HOÀN TẤT TRƯỚC thời điểm snapshot -> Tuple ĐÃ CHẾT (Dead Tuple)
    return false;
  }

  /**
   * Truy vấn đọc toàn bộ các bản ghi khả kiến (SELECT)
   * @param {TransactionContext} tx
   * @param {function(object): boolean} [predicate]
   * @returns {Array<{id: string, data: object, tuple: HeapTuple}>}
   */
  select(tx, predicate = () => true) {
    const snapshot = this.getEffectiveSnapshot(tx);
    const visibleResults = [];

    for (const tuple of this.heap) {
      if (this.isTupleVisible(tuple, snapshot, tx)) {
        if (predicate(tuple.data)) {
          // Ghi nhận vào readSet để phục vụ theo dõi phụ thuộc SSI
          tx.readSet.add(tuple.id);
          visibleResults.push({
            id: tuple.id,
            data: JSON.parse(JSON.stringify(tuple.data)),
            tuple: tuple
          });
        }
      }
    }

    return visibleResults;
  }

  /**
   * Truy vấn đọc một bản ghi theo ID (SELECT BY ID)
   * @param {TransactionContext} tx
   * @param {string} id
   * @returns {object|null}
   */
  selectById(tx, id) {
    const results = this.select(tx, data => true);
    const found = results.find(r => r.id === id);
    return found ? found.data : null;
  }

  /**
   * Chèn bản ghi mới vào Heap (INSERT)
   * @param {TransactionContext} tx
   * @param {string} id
   * @param {object} data
   * @returns {HeapTuple}
   */
  insert(tx, id, data) {
    const ctid = this.allocateItemPointer();
    const tuple = new HeapTuple(id, data, tx.txId, ctid);
    this.heap.push(tuple);
    tx.writeSet.add(id);
    return tuple;
  }

  /**
   * Cập nhật bản ghi theo cơ chế HOT (UPDATE with Heap-Only Tuple Chain)
   * Mô phỏng chính xác hành vi của PostgreSQL:
   * 1. Tìm tuple hiện tại khả kiến.
   * 2. Kiểm tra xung đột ghi (Write-Write Conflict / First-Committer-Wins).
   * 3. Đánh dấu xmax của tuple cũ = txId hiện tại.
   * 4. Tạo tuple mới với ctid mới, xmin = txId, xmax = 0.
   * 5. Nối ctid của tuple cũ trỏ tới tuple mới tạo thành HOT chain.
   *
   * @param {TransactionContext} tx
   * @param {string} id
   * @param {object} newData
   * @returns {HeapTuple}
   */
  update(tx, id, newData) {
    const snapshot = this.getEffectiveSnapshot(tx);
    
    // Tìm tuple đang khả kiến với transaction hiện tại
    const targetTuple = this.heap.find(t => t.id === id && this.isTupleVisible(t, snapshot, tx));

    if (!targetTuple) {
      throw new Error(`Record with ID '${id}' not found or not visible to Transaction ${tx.txId}`);
    }

    // ------------------------------------------------------------------------
    // KIỂM TRA XUNG ĐỘT GHI ĐỒNG THỜI (WRITE-WRITE CONFLICT CHECK)
    // ------------------------------------------------------------------------
    if (targetTuple.xmax !== 0 && targetTuple.xmax !== tx.txId) {
      const xmaxStatus = this.transactionStatus.get(targetTuple.xmax);
      
      // Nếu một transaction khác đang cập nhật/xóa dòng này mà chưa commit
      if (xmaxStatus === TxStatus.IN_PROGRESS) {
        throw new Error(
          `SerializationFailure (40001): Concurrent update detected on row '${id}' by Transaction ${targetTuple.xmax}. Row is currently locked.`
        );
      }

      // Đối với REPEATABLE_READ hoặc SERIALIZABLE: Quy tắc First-Committer-Wins
      // Nếu dòng này đã bị sửa và commit bởi transaction khác sau thời điểm chụp snapshot của ta
      if (
        (tx.isolationLevel === IsolationLevel.REPEATABLE_READ || tx.isolationLevel === IsolationLevel.SERIALIZABLE) &&
        xmaxStatus === TxStatus.COMMITTED
      ) {
        throw new Error(
          `SerializationFailure (40001): could not serialize access due to concurrent update (First-Committer-Wins on row '${id}')`
        );
      }
    }

    // 1. Cấp phát vị trí vật lý mới cho phiên bản kế tiếp
    const newCtid = this.allocateItemPointer();
    const newTuple = new HeapTuple(id, newData, tx.txId, newCtid);

    // 2. Cập nhật metadata của tuple cũ: xmax và con trỏ ctid nối chuỗi HOT
    targetTuple.xmax = tx.txId;
    targetTuple.ctid = newCtid;              // Trỏ ctid sang tuple mới (HOT Chain)
    targetTuple.isHotUpdated = true;
    targetTuple.setFlag(TupleFlags.HEAP_HOT_UPDATED);

    // 3. Đưa tuple mới vào Heap
    this.heap.push(newTuple);
    tx.writeSet.add(id);

    return newTuple;
  }

  /**
   * Xóa bản ghi (DELETE)
   * Đánh dấu xmax = txId hiện tại (không xóa vật lý ngay lập tức)
   * @param {TransactionContext} tx
   * @param {string} id
   */
  delete(tx, id) {
    const snapshot = this.getEffectiveSnapshot(tx);
    const targetTuple = this.heap.find(t => t.id === id && this.isTupleVisible(t, snapshot, tx));

    if (!targetTuple) {
      throw new Error(`Record with ID '${id}' not found for deletion`);
    }

    targetTuple.xmax = tx.txId;
    tx.writeSet.add(id);
  }

  /**
   * Dò theo chuỗi HOT Chain từ tuple gốc đến tuple mới nhất (Follow HOT Chain)
   * @param {string} id - ID của bản ghi
   * @returns {Array<HeapTuple>} Danh sách toàn bộ chuỗi phiên bản
   */
  getHotChain(id) {
    return this.heap.filter(t => t.id === id);
  }

  /**
   * Cam kết giao dịch (Commit Transaction)
   * @param {TransactionContext} tx
   */
  commit(tx) {
    tx.status = TxStatus.COMMITTED;
    this.transactionStatus.set(tx.txId, TxStatus.COMMITTED);
    this.activeTransactions.delete(tx.txId);

    // Gắn Hint Bits vào các tuple do transaction này tạo ra/xóa
    for (const tuple of this.heap) {
      if (tuple.xmin === tx.txId) {
        tuple.setFlag(TupleFlags.HEAP_XMIN_COMMITTED);
      }
      if (tuple.xmax === tx.txId) {
        tuple.setFlag(TupleFlags.HEAP_XMAX_COMMITTED);
      }
    }
  }

  /**
   * Hủy bỏ / Hoàn tác giao dịch (Abort Transaction)
   * @param {TransactionContext} tx
   */
  abort(tx) {
    tx.status = TxStatus.ABORTED;
    this.transactionStatus.set(tx.txId, TxStatus.ABORTED);
    this.activeTransactions.delete(tx.txId);

    // Gắn cờ Aborted
    for (const tuple of this.heap) {
      if (tuple.xmin === tx.txId) {
        tuple.setFlag(TupleFlags.HEAP_XMIN_ABORTED);
      }
      if (tuple.xmax === tx.txId) {
        tuple.setFlag(TupleFlags.HEAP_XMAX_ABORTED);
      }
    }
  }

  /**
   * Thu gom rác Heap (VACUUM Engine Simulator)
   * Quét toàn bộ Heap và loại bỏ các Dead Tuples (Bộ dữ liệu chết) mà không còn bất kỳ
   * active transaction nào có thể nhìn thấy nữa.
   *
   * @returns {{scanned: number, deadReclaimed: number, liveRetained: number}}
   */
  vacuum() {
    // Tìm xmin nhỏ nhất trong số các active transaction hiện tại
    const activeTxIds = Array.from(this.activeTransactions.keys());
    const oldestActiveXmin = activeTxIds.length > 0 ? Math.min(...activeTxIds) : this.txIdCounter + 1;

    const initialCount = this.heap.length;
    
    // Một tuple là DEAD khi: xmax đã commit VÀ xmax < oldestActiveXmin
    // HOẶC xmin đã abort
    this.heap = this.heap.filter(tuple => {
      const xminStatus = this.transactionStatus.get(tuple.xmin);
      const xmaxStatus = this.transactionStatus.get(tuple.xmax);

      // Nếu transaction tạo ra nó đã abort -> Dead tuple
      if (xminStatus === TxStatus.ABORTED) {
        return false; // Reclaim
      }

      // Nếu tuple đã bị xóa và transaction xóa đã commit TRƯỚC transaction active cổ nhất
      if (tuple.xmax !== 0 && xmaxStatus === TxStatus.COMMITTED && tuple.xmax < oldestActiveXmin) {
        return false; // Reclaim dead tuple!
      }

      return true; // Giữ lại
    });

    const deadReclaimed = initialCount - this.heap.length;
    return {
      scanned: initialCount,
      deadReclaimed: deadReclaimed,
      liveRetained: this.heap.length
    };
  }
}

// ============================================================================
// 3. PHẦN BA: TÁI HIỆN DỊ THƯỜNG & SERIALIZABLE SNAPSHOT ISOLATION (SSI)
// ============================================================================

/**
 * Lớp Phát Hiện Dị Thường & Triển Khai Serializable Snapshot Isolation (SSI)
 */
class ConcurrencyAnomalyDetector {
  constructor(engine) {
    this.engine = engine;
    
    // Cấu trúc dữ liệu phục vụ thuật toán SSI (Michael Cahill 2008)
    this.sireadLocks = new Map(); // tupleId -> Set<txId> (SIREAD predicate locks)
    this.rwAntidependencies = []; // Cạnh [T_reader, T_writer, tupleId]
  }

  /**
   * Tái hiện Dị thường Đọc Bẩn (Dirty Read - G1a):
   * T1 cập nhật dữ liệu nhưng CHƯA COMMIT (sau đó abort).
   * T2 đọc dữ liệu dở dang đó nếu ở cấp độ READ_UNCOMMITTED.
   * Đồng thời chứng minh MVCC READ_COMMITTED triệt tiêu hoàn toàn Dirty Read.
   */
  demonstrateDirtyRead() {
    console.log('\n--- 🔬 THÍ NGHIỆM 1: TÁI HIỆN DỊ THƯỜNG ĐỌC BẨN (DIRTY READ - G1a) ---');

    // Khởi tạo bản ghi ban đầu
    const tInit = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.insert(tInit, 'acc_1', { owner: 'Alice', balance: 100 });
    this.engine.commit(tInit);
    console.log('  [Setup] Bản ghi ban đầu acc_1: balance = 100 (Committed)');

    // T1: Cập nhật balance lên 999 nhưng CHƯA COMMIT
    const t1 = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.update(t1, 'acc_1', { owner: 'Alice', balance: 999 });
    console.log(`  [T1 - Active] UPDATE acc_1: balance = 999 (Chưa commit)`);

    // T2_Dirty: Đọc dưới cấp độ READ_UNCOMMITTED -> Thấy giá trị 999 (DIRTY READ!)
    const t2_dirty = this.engine.beginTransaction(IsolationLevel.READ_UNCOMMITTED);
    const dirtyResult = this.engine.selectById(t2_dirty, 'acc_1');
    console.log(`  [T2 - Read Uncommitted] Đọc acc_1: balance = ${dirtyResult.balance} ⚠️ [DIRTY READ XẢY RA!]`);
    assert.strictEqual(dirtyResult.balance, 999, 'Read Uncommitted phải nhìn thấy dirty value');

    // T2_Clean: Đọc dưới cấp độ READ_COMMITTED -> Chỉ thấy giá trị 100 (KHÔNG BỊ BẨN)
    const t2_clean = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const cleanResult = this.engine.selectById(t2_clean, 'acc_1');
    console.log(`  [T2 - Read Committed] Đọc acc_1: balance = ${cleanResult.balance} ✅ [DIRTY READ ĐÃ BỊ CHẶN BỞI MVCC!]`);
    assert.strictEqual(cleanResult.balance, 100, 'Read Committed phải bảo vệ khỏi dirty read');

    // T1 Abort: Giả lập sự cố sập nguồn / rollback
    this.engine.abort(t1);
    console.log('  [T1] Gặp sự cố -> ABORT / ROLLBACK');

    // Sau khi T1 abort, đọc lại ở Read Committed vẫn an toàn tuyệt đối là 100
    const finalCheck = this.engine.selectById(t2_clean, 'acc_1');
    console.log(`  [T2 - Final Read] Đọc acc_1 sau khi T1 abort: balance = ${finalCheck.balance} (Toàn vẹn tuyệt đối)`);
    assert.strictEqual(finalCheck.balance, 100);
    
    this.engine.commit(t2_dirty);
    this.engine.commit(t2_clean);
  }

  /**
   * Tái hiện Dị thường Đọc Không Lặp Lại Được (Non-repeatable Read - G1b / Fuzzy Read):
   * T1 đọc giá trị lúc t1.
   * T2 cập nhật và COMMIT lúc t2.
   * Dưới READ_COMMITTED: T1 đọc lại lúc t3 thấy giá trị đã đổi (Non-repeatable Read).
   * Dưới REPEATABLE_READ: T1 đọc lại lúc t3 vẫn thấy giá trị cũ (Bảo vệ thành công).
   */
  demonstrateNonRepeatableRead() {
    console.log('\n--- 🔬 THÍ NGHIỆM 2: DỊ THƯỜNG ĐỌC KHÔNG LẶP LẠI ĐƯỢC (NON-REPEATABLE READ - G1b) ---');

    // Khởi tạo
    const tInit = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.insert(tInit, 'product_10', { name: 'SSD NVMe 2TB', price: 200 });
    this.engine.commit(tInit);
    console.log('  [Setup] product_10: price = $200 (Committed)');

    // 1. Trường hợp READ_COMMITTED (Dị thường xảy ra)
    console.log('  ► Kịch bản A: Dưới cấp độ READ_COMMITTED:');
    const tRC = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const read1 = this.engine.selectById(tRC, 'product_10');
    console.log(`    (1) tRC đọc lần 1: price = $${read1.price}`);

    // T_Modifier cập nhật lên 250 và COMMIT
    const tMod = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.update(tMod, 'product_10', { name: 'SSD NVMe 2TB', price: 250 });
    this.engine.commit(tMod);
    console.log(`    (2) tMod UPDATE price = $250 và COMMIT`);

    // tRC đọc lại lần 2
    const read2 = this.engine.selectById(tRC, 'product_10');
    console.log(`    (3) tRC đọc lần 2: price = $${read2.price} ⚠️ [NON-REPEATABLE READ XẢY RA!]`);
    assert.notStrictEqual(read1.price, read2.price, 'Trong Read Committed, 2 lần đọc cho kết quả khác nhau');
    this.engine.commit(tRC);

    // 2. Trường hợp REPEATABLE_READ (Bảo vệ bằng Snapshot tái sử dụng)
    console.log('  ► Kịch bản B: Dưới cấp độ REPEATABLE_READ:');
    const tRR = this.engine.beginTransaction(IsolationLevel.REPEATABLE_READ);
    const rrRead1 = this.engine.selectById(tRR, 'product_10');
    console.log(`    (1) tRR đọc lần 1: price = $${rrRead1.price}`);

    // T_Modifier2 cập nhật lên 300 và COMMIT
    const tMod2 = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.update(tMod2, 'product_10', { name: 'SSD NVMe 2TB', price: 300 });
    this.engine.commit(tMod2);
    console.log(`    (2) tMod2 UPDATE price = $300 và COMMIT`);

    // tRR đọc lại lần 2 -> Snapshot cũ được giữ nguyên!
    const rrRead2 = this.engine.selectById(tRR, 'product_10');
    console.log(`    (3) tRR đọc lần 2: price = $${rrRead2.price} ✅ [BẢO TỒN TÍNH LẶP LẠI (REPEATABLE)!]`);
    assert.strictEqual(rrRead1.price, rrRead2.price, 'Trong Repeatable Read, 2 lần đọc phải giống nhau');
    this.engine.commit(tRR);
  }

  /**
   * Tái hiện Dị thường Ghi Lệch Ràng Buộc (Write Skew - G-skew-write)
   * Bài toán Ca Trực Bác Sĩ (The On-Call Doctor Problem):
   * Bất biến nghiệp vụ (Business Invariant): count(on_call = true) >= 1.
   * Hai bác sĩ Alice và Bob đều đang trực (count = 2).
   * Cả 2 cùng xin nghỉ trực đồng thời.
   *
   * @param {boolean} useSSI - Nếu true, kích hoạt thuật toán Serializable Snapshot Isolation
   * @returns {{success: boolean, finalOnCallCount: number, error?: string}}
   */
  simulateOnCallDoctorsWriteSkew(useSSI = false) {
    const modeName = useSSI ? 'SERIALIZABLE (SSI)' : 'SNAPSHOT ISOLATION (SI)';
    console.log(`\n--- 🔬 THÍ NGHIỆM 3: WRITE SKEW CA TRỰC BÁC SĨ [Chế độ: ${modeName}] ---`);

    // Reset danh sách SIREAD locks và edges
    this.sireadLocks.clear();
    this.rwAntidependencies = [];

    const prefix = useSSI ? 'ssi' : 'si';
    const aliceId = `doc_alice_${prefix}`;
    const bobId = `doc_bob_${prefix}`;

    // Setup ban đầu: 2 bác sĩ đang trực trong phân hệ này
    const tInit = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    this.engine.insert(tInit, aliceId, { name: 'Dr. Alice', on_call: true, group: prefix });
    this.engine.insert(tInit, bobId, { name: 'Dr. Bob', on_call: true, group: prefix });
    this.engine.commit(tInit);
    console.log(`  [Setup] ${aliceId}: on_call = true, ${bobId}: on_call = true (Tổng trực: 2)`);

    const iso = useSSI ? IsolationLevel.SERIALIZABLE : IsolationLevel.REPEATABLE_READ;

    // T1: Bác sĩ Alice xin nghỉ trực
    const t1 = this.engine.beginTransaction(iso);
    // T2: Bác sĩ Bob xin nghỉ trực
    const t2 = this.engine.beginTransaction(iso);

    // Bước 1: Cả hai giao dịch kiểm tra số bác sĩ đang trực
    const t1Doctors = this.engine.select(t1, d => d.group === prefix && d.on_call === true);
    const t2Doctors = this.engine.select(t2, d => d.group === prefix && d.on_call === true);

    console.log(`  [T1 - Alice] Kiểm tra bác sĩ trực: đếm được ${t1Doctors.length} bác sĩ. (Thỏa mãn >= 2 để xin nghỉ)`);
    console.log(`  [T2 - Bob]   Kiểm tra bác sĩ trực: đếm được ${t2Doctors.length} bác sĩ. (Thỏa mãn >= 2 để xin nghỉ)`);

    // Nếu chạy SSI: Đăng ký SIREAD locks trên các dòng đã đọc
    if (useSSI) {
      this.registerSIReadLock(t1.txId, aliceId);
      this.registerSIReadLock(t1.txId, bobId);
      this.registerSIReadLock(t2.txId, aliceId);
      this.registerSIReadLock(t2.txId, bobId);
    }

    // Bước 2: T1 sửa dòng của Alice (Alice nghỉ trực)
    this.engine.update(t1, aliceId, { name: 'Dr. Alice', on_call: false, group: prefix });
    console.log(`  [T1 - Alice] UPDATE ${aliceId}: on_call = false`);
    if (useSSI) {
      this.recordRwAntidependencies(t1.txId, aliceId);
    }

    // Bước 3: T2 sửa dòng của Bob (Bob nghỉ trực)
    this.engine.update(t2, bobId, { name: 'Dr. Bob', on_call: false, group: prefix });
    console.log(`  [T2 - Bob]   UPDATE ${bobId}: on_call = false`);
    if (useSSI) {
      this.recordRwAntidependencies(t2.txId, bobId);
    }

    // Bước 4: Commit
    // T1 commit trước
    this.engine.commit(t1);
    console.log(`  [T1 - Alice] COMMIT thành công!`);

    // T2 commit sau
    if (useSSI) {
      // Kiểm tra chu trình nguy hiểm trong đồ thị phụ thuộc rw
      const dangerousCycle = this.detectDangerousStructureSSI();
      if (dangerousCycle) {
        console.log(`  [SSI Guard] 🚨 PHÁT HIỆN CHU TRÌNH XUNG ĐỘT RW NGUY HIỂM: ${dangerousCycle.join(' -> ')}`);
        console.log(`  [SSI Guard] Cưỡng chế ABORT T2 với lỗi: SerializationFailure (40001)`);
        this.engine.abort(t2);

        // Kiểm tra số bác sĩ trực thực tế sau khi SSI can thiệp
        const tCheck = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
        const remaining = this.engine.select(tCheck, d => d.group === prefix && d.on_call === true);
        this.engine.commit(tCheck);

        console.log(`  [Kết quả SSI] Bất biến được bảo tồn: Số bác sĩ trực = ${remaining.length} (>= 1) ✅ [BẢO VỆ THÀNH CÔNG!]`);
        return {
          success: true,
          finalOnCallCount: remaining.length,
          error: 'SerializationFailure: could not serialize access due to read/write dependencies'
        };
      }
    }

    // Nếu không có SSI (Naive Snapshot Isolation):
    // T2 commit thành công vì write set của T1 (aliceId) và T2 (bobId) hoàn toàn RỜI NHAU (Disjoint Write Sets)!
    this.engine.commit(t2);
    console.log(`  [T2 - Bob]   COMMIT thành công! (Không hề có Write-Write conflict ở cấp độ dòng)`);

    // Kiểm tra kết quả trên Snapshot Isolation thuần túy
    const tCheck = this.engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const remaining = this.engine.select(tCheck, d => d.group === prefix && d.on_call === true);
    this.engine.commit(tCheck);

    console.log(`  [Hậu quả SI] ❌ THẢM HỌA WRITE SKEW: Số bác sĩ trực = ${remaining.length}! BỆNH VIỆN KHÔNG CÒN BÁC SĨ TRỰC!`);
    return {
      success: false,
      finalOnCallCount: remaining.length
    };
  }

  /**
   * Đăng ký SIREAD Lock ảo (SSI Monitoring Marker)
   */
  registerSIReadLock(txId, tupleId) {
    if (!this.sireadLocks.has(tupleId)) {
      this.sireadLocks.set(tupleId, new Set());
    }
    this.sireadLocks.get(tupleId).add(txId);
  }

  /**
   * Ghi nhận cạnh chống phụ thuộc rw-antidependency (T_reader -> T_writer)
   * Khi T_writer ghi vào một tuple mà T_reader đã đọc trước đó.
   */
  recordRwAntidependencies(writerTxId, tupleId) {
    const readers = this.sireadLocks.get(tupleId);
    if (!readers) return;

    for (const readerTxId of readers) {
      if (readerTxId !== writerTxId) {
        // T_reader đọc dữ liệu phiên bản cũ trước khi T_writer ghi đè
        // -> Cạnh có hướng: T_reader -> T_writer
        this.rwAntidependencies.push({
          from: readerTxId,
          to: writerTxId,
          resource: tupleId
        });
        console.log(`    [SSI Graph] Cạnh mới: T${readerTxId} --(rw on ${tupleId})--> T${writerTxId}`);
      }
    }
  }

  /**
   * Phát hiện Cấu trúc Nguy hiểm trong SSI (Dangerous Structure Detection)
   * Tìm chu trình hoặc cấu trúc 2 cạnh rw liên tiếp: T_in -> T_pivot -> T_out
   */
  detectDangerousStructureSSI() {
    // Xây dựng adjacency list
    const adj = new Map();
    for (const edge of this.rwAntidependencies) {
      if (!adj.has(edge.from)) adj.set(edge.from, new Set());
      adj.get(edge.from).add(edge.to);
    }

    // Tìm chu trình bằng DFS
    for (const startNode of adj.keys()) {
      const visited = new Set();
      const path = [];

      const dfs = (curr) => {
        visited.add(curr);
        path.push(curr);

        const neighbors = adj.get(curr) || new Set();
        for (const next of neighbors) {
          if (next === startNode && path.length >= 2) {
            path.push(next);
            return true; // Tìm thấy chu trình!
          }
          if (!visited.has(next)) {
            if (dfs(next)) return true;
          }
        }

        path.pop();
        return false;
      };

      if (dfs(startNode)) {
        return path.map(id => `T${id}`);
      }
    }

    return null;
  }
}

// ============================================================================
// 4. PHẦN BỐN: BỘ QUẢN LÝ KHÓA & PHÁT HIỆN DEADLOCK (DEADLOCK DETECTOR)
// ============================================================================

/**
 * Quản lý Khóa & Phát hiện Bế tắc (Lock Manager & Wait-For Graph Deadlock Detector)
 */
class DeadlockDetector {
  constructor() {
    // resourceId -> { mode: 'S'|'X', holders: Set<txId>, waitQueue: Array<{txId, mode}> }
    this.resourceLocks = new Map();
    // txId -> Set<resourceId> (các khóa đang nắm giữ)
    this.heldLocks = new Map();
    // Wait-For Graph: Map<waitingTxId, Set<holdingTxId>>
    this.waitForGraph = new Map();
    // Transaction priorities hoặc thời điểm bắt đầu (cho victim selection)
    this.txStartTimes = new Map();
  }

  /**
   * Đăng ký Transaction
   */
  registerTransaction(txId) {
    this.heldLocks.set(txId, new Set());
    this.waitForGraph.set(txId, new Set());
    this.txStartTimes.set(txId, Date.now() + Math.random());
  }

  /**
   * Yêu cầu cấp phát Khóa (Acquire Lock)
   * Hỗ trợ Shared (S) và Exclusive (X) Locks
   *
   * @param {number} txId - Transaction xin khóa
   * @param {string} resourceId - Tên tài nguyên (ví dụ 'table_users', 'row_10')
   * @param {string} mode - 'S' (Shared) hoặc 'X' (Exclusive)
   * @returns {{granted: boolean, deadlockDetected?: boolean, cycle?: number[], victim?: number}}
   */
  acquireLock(txId, resourceId, mode = LockMode.EXCLUSIVE) {
    if (!this.heldLocks.has(txId)) {
      this.registerTransaction(txId);
    }

    let resInfo = this.resourceLocks.get(resourceId);

    // 1. Nếu tài nguyên chưa ai giữ khóa
    if (!resInfo || resInfo.holders.size === 0) {
      resInfo = {
        mode: mode,
        holders: new Set([txId]),
        waitQueue: []
      };
      this.resourceLocks.set(resourceId, resInfo);
      this.heldLocks.get(txId).add(resourceId);
      return { granted: true };
    }

    // 2. Nếu chính mình đã giữ khóa này rồi
    if (resInfo.holders.has(txId)) {
      if (resInfo.mode === LockMode.EXCLUSIVE || mode === LockMode.SHARED) {
        return { granted: true }; // Đã có quyền
      }
      // Nâng cấp khóa (Lock Escalation S -> X)
      if (resInfo.holders.size === 1) {
        resInfo.mode = LockMode.EXCLUSIVE;
        return { granted: true };
      }
    }

    // 3. Kiểm tra tính tương thích (Lock Compatibility)
    // S-Lock tương thích với S-Lock (nếu không có ai chờ xin X)
    const isCompatible = (resInfo.mode === LockMode.SHARED && mode === LockMode.SHARED);

    if (isCompatible && resInfo.waitQueue.length === 0) {
      resInfo.holders.add(txId);
      this.heldLocks.get(txId).add(resourceId);
      return { granted: true };
    }

    // 4. XUNG ĐỘT KHÓA -> BỊ CHẶN VÀ ĐƯA VÀO HÀNG ĐỢI CHỜ (WAIT-FOR)
    resInfo.waitQueue.push({ txId, mode });

    // Cập nhật Wait-For Graph: txId phải chờ TẤT CẢ các holders hiện tại của resourceId
    const waitingSet = this.waitForGraph.get(txId);
    for (const holderTxId of resInfo.holders) {
      if (holderTxId !== txId) {
        waitingSet.add(holderTxId);
      }
    }

    // 5. CHẠY THUẬT TOÁN PHÁT HIỆN DEADLOCK QUA WFG
    const cycle = this.detectCycleDFS();
    if (cycle) {
      // Chọn nạn nhân (Victim Selection)
      const victim = this.selectVictim(cycle, 'YOUNGEST');
      
      // Tiến hành Abort nạn nhân và giải phóng khóa
      this.abortVictim(victim);

      return {
        granted: false,
        deadlockDetected: true,
        cycle: cycle,
        victim: victim
      };
    }

    return { granted: false, deadlockDetected: false };
  }

  /**
   * Giải phóng toàn bộ khóa của một transaction (Release Locks)
   * @param {number} txId
   */
  releaseLocks(txId) {
    const resources = this.heldLocks.get(txId) || new Set();

    for (const resId of resources) {
      const resInfo = this.resourceLocks.get(resId);
      if (resInfo) {
        resInfo.holders.delete(txId);

        // Đánh thức các transaction đang chờ trong waitQueue
        if (resInfo.waitQueue.length > 0) {
          // Lấy người chờ đầu tiên
          const nextWait = resInfo.waitQueue.shift();
          resInfo.mode = nextWait.mode;
          resInfo.holders.add(nextWait.txId);
          this.heldLocks.get(nextWait.txId).add(resId);

          // Xóa cạnh chờ trong WFG
          const waitSet = this.waitForGraph.get(nextWait.txId);
          if (waitSet) waitSet.delete(txId);
        }
      }
    }

    // Xóa transaction khỏi WFG
    this.heldLocks.delete(txId);
    this.waitForGraph.delete(txId);
    this.txStartTimes.delete(txId);

    // Xóa cạnh mà các transaction khác đang trỏ tới txId này
    for (const [wTx, holders] of this.waitForGraph.entries()) {
      holders.delete(txId);
    }
  }

  /**
   * Thuật toán DFS phát hiện Chu Trình trong Wait-For Graph (3-Color DFS)
   * 0: WHITE (Chưa duyệt)
   * 1: GRAY  (Đang nằm trong call stack đệ quy - nếu gặp lại là có CYCLE!)
   * 2: BLACK (Đã duyệt an toàn không có chu trình)
   *
   * @returns {number[]|null} Danh sách txId tạo thành chu trình hoặc null
   */
  detectCycleDFS() {
    const color = new Map(); // txId -> 0 | 1 | 2
    const parent = new Map();
    let cyclePath = null;

    for (const txId of this.waitForGraph.keys()) {
      color.set(txId, 0);
    }

    const dfs = (u) => {
      color.set(u, 1); // Đánh dấu GRAY (đang duyệt)

      const neighbors = this.waitForGraph.get(u) || new Set();
      for (const v of neighbors) {
        if (color.get(v) === 1) {
          // GẶP LẠI GRAY NODE -> PHÁT HIỆN CHU TRÌNH DEADLOCK!
          cyclePath = [v, u];
          let curr = u;
          while (curr !== v && parent.has(curr)) {
            curr = parent.get(curr);
            cyclePath.push(curr);
          }
          cyclePath.reverse();
          return true;
        }

        if (color.get(v) === 0) {
          parent.set(v, u);
          if (dfs(v)) return true;
        }
      }

      color.set(u, 2); // Đánh dấu BLACK (hoàn tất)
      return false;
    };

    for (const txId of this.waitForGraph.keys()) {
      if (color.get(txId) === 0) {
        if (dfs(txId)) return cyclePath;
      }
    }

    return null;
  }

  /**
   * Chiến lược Chọn Nạn Nhân (Victim Selection Strategy)
   * - YOUNGEST: Chọn transaction trẻ nhất (ID lớn nhất / thời gian bắt đầu muộn nhất)
   * - FEWEST_LOCKS: Chọn transaction giữ ít khóa nhất (chi phí rollback thấp nhất)
   *
   * @param {number[]} cycle - Danh sách txId trong chu trình
   * @param {'YOUNGEST'|'FEWEST_LOCKS'} strategy
   * @returns {number} txId của nạn nhân được chọn
   */
  selectVictim(cycle, strategy = 'YOUNGEST') {
    const uniqueTxIds = Array.from(new Set(cycle));

    if (strategy === 'FEWEST_LOCKS') {
      return uniqueTxIds.reduce((minTx, tx) => {
        const countCurrent = (this.heldLocks.get(tx) || new Set()).size;
        const countMin = (this.heldLocks.get(minTx) || new Set()).size;
        return countCurrent < countMin ? tx : minTx;
      }, uniqueTxIds[0]);
    }

    // Mặc định: YOUNGEST (txId lớn nhất)
    return Math.max(...uniqueTxIds);
  }

  /**
   * Abort Nạn nhân và Thu hồi Khóa
   * @param {number} victimTxId
   */
  abortVictim(victimTxId) {
    // Xóa nạn nhân khỏi toàn bộ hàng đợi chờ
    for (const resInfo of this.resourceLocks.values()) {
      resInfo.waitQueue = resInfo.waitQueue.filter(entry => entry.txId !== victimTxId);
    }

    // Giải phóng toàn bộ khóa mà nạn nhân đang giữ để giải phóng các transaction khác
    this.releaseLocks(victimTxId);
  }
}

// ============================================================================
// 5. PHẦN NĂM: BỘ KIỂM THỬ TỰ ĐỘNG CHUẨN MỰC (BUILT-IN TEST SUITE)
// ============================================================================

/**
 * Runner chạy bộ kiểm thử toàn diện
 */
function runAllTests() {
  console.log('================================================================================');
  console.log('🏛️ DATABASE MASTERCLASS — BỘ KIỂM THỬ THỰC CHIẾN MVCC & CONCURRENCY (LAB 03)');
  console.log('================================================================================');

  let testsPassed = 0;
  let totalTests = 0;

  function runTest(name, fn) {
    totalTests++;
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`🧪 KIỂM THỬ SỐ ${totalTests}: ${name}`);
    console.log(`--------------------------------------------------------------------------------`);
    try {
      fn();
      console.log(`\n  👉 KẾT QUẢ: [PASS] ĐẠT YÊU CẦU 100% ✅`);
      testsPassed++;
    } catch (err) {
      console.error(`\n  👉 KẾT QUẢ: [FAIL] THẤT BẠI ❌`);
      console.error(`  Chi tiết lỗi: ${err.message}`);
      console.error(err.stack);
      process.exitCode = 1;
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: KIỂM CHỨNG TÍNH KHẢ KIẾN MVCC (VISIBILITY RULES & HOT CHAINS)
  // --------------------------------------------------------------------------
  runTest('MVCC Visibility Check & Heap-Only Tuple (HOT) Chains', () => {
    const engine = new MVCCEngine();

    // 1. INSERT bản ghi ban đầu
    const t1 = engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const tuple1 = engine.insert(t1, 'user_1', { name: 'Alice', balance: 500 });
    engine.commit(t1);

    console.log(`  [1.1] Đã chèn user_1 bởi T${t1.txId}: ctid = ${tuple1.ctid}, xmin = ${tuple1.xmin}, xmax = ${tuple1.xmax}`);
    assert.strictEqual(tuple1.xmin, t1.txId);
    assert.strictEqual(tuple1.xmax, 0);

    // 2. T2 khởi tạo Repeatable Read và đọc
    const t2_rr = engine.beginTransaction(IsolationLevel.REPEATABLE_READ);
    const readInitial = engine.selectById(t2_rr, 'user_1');
    console.log(`  [1.2] T2 (Repeatable Read) đọc ban đầu: balance = ${readInitial.balance}`);
    assert.strictEqual(readInitial.balance, 500);

    // 3. T3 thực hiện UPDATE qua cơ chế HOT
    const t3 = engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const tuple2 = engine.update(t3, 'user_1', { name: 'Alice', balance: 650 });
    engine.commit(t3);

    console.log(`  [1.3] T3 UPDATE user_1 -> balance = 650`);
    console.log(`        Tuple cũ: xmax = ${tuple1.xmax}, ctid trỏ tới ${tuple1.ctid} (HOT Linked)`);
    console.log(`        Tuple mới: xmin = ${tuple2.xmin}, xmax = ${tuple2.xmax}, ctid = ${tuple2.ctid}`);

    assert.strictEqual(tuple1.xmax, t3.txId, 'Tuple cũ phải có xmax = t3');
    assert.strictEqual(tuple1.ctid.equals(tuple2.ctid), true, 'ctid tuple cũ phải trỏ tới tuple mới');
    assert.strictEqual(tuple1.isHotUpdated, true, 'Tuple cũ phải được gắn cờ HOT updated');

    // 4. T4 (Read Committed) phải nhìn thấy giá trị mới (650)
    const t4_rc = engine.beginTransaction(IsolationLevel.READ_COMMITTED);
    const readRC = engine.selectById(t4_rc, 'user_1');
    console.log(`  [1.4] T4 (Read Committed) đọc sau update: balance = ${readRC.balance} (Thấy mới nhất)`);
    assert.strictEqual(readRC.balance, 650);

    // 5. T2 (Repeatable Read) VẪN PHẢI nhìn thấy giá trị cũ (500) nhờ Snapshot Isolation
    const readRR = engine.selectById(t2_rr, 'user_1');
    console.log(`  [1.5] T2 (Repeatable Read) đọc lại: balance = ${readRR.balance} (Bảo toàn Snapshot)`);
    assert.strictEqual(readRR.balance, 500);

    // 6. Kiểm tra VACUUM: Trước khi T2 kết thúc, dead tuple KHÔNG ĐƯỢC dọn
    let vacReport = engine.vacuum();
    console.log(`  [1.6] Chạy VACUUM khi T2 còn mở: Thu hồi được ${vacReport.deadReclaimed} dead tuples (Đúng vì T2 vẫn cần nó)`);
    assert.strictEqual(vacReport.deadReclaimed, 0);

    // Kết thúc T2
    engine.commit(t2_rr);
    engine.commit(t4_rc);

    // Chạy lại VACUUM sau khi không còn transaction nào giữ snapshot cũ
    vacReport = engine.vacuum();
    console.log(`  [1.7] Chạy VACUUM sau khi T2 commit: Thu hồi thành công ${vacReport.deadReclaimed} dead tuple!`);
    assert.strictEqual(vacReport.deadReclaimed, 1);
  });

  // --------------------------------------------------------------------------
  // TEST 2: DỊ THƯỜNG WRITE SKEW TRÊN SI VS BẢO VỆ BỞI SSI (SERIALIZABLE)
  // --------------------------------------------------------------------------
  runTest('Write Skew Anomaly vs Serializable Snapshot Isolation (SSI)', () => {
    const engine = new MVCCEngine();
    const detector = new ConcurrencyAnomalyDetector(engine);

    // Tái hiện Dirty Read & Non-repeatable Read
    detector.demonstrateDirtyRead();
    detector.demonstrateNonRepeatableRead();

    // 1. Chạy trên Snapshot Isolation thuần túy (Dị thường Write Skew xuất hiện)
    const resultSI = detector.simulateOnCallDoctorsWriteSkew(false);
    assert.strictEqual(resultSI.success, false, 'SI thuần túy phải thất bại trong việc ngăn Write Skew');
    assert.strictEqual(resultSI.finalOnCallCount, 0, 'Cả hai bác sĩ đều nghỉ trực -> Vi phạm bất biến');

    // 2. Chạy trên Serializable Snapshot Isolation (SSI)
    const resultSSI = detector.simulateOnCallDoctorsWriteSkew(true);
    assert.strictEqual(resultSSI.success, true, 'SSI phải phát hiện chu trình và bảo vệ bất biến');
    assert.strictEqual(resultSSI.finalOnCallCount, 1, 'Phải còn đúng 1 bác sĩ trực ban');
    assert.ok(resultSSI.error.includes('SerializationFailure'), 'Phải ném ra lỗi SerializationFailure 40001');
  });

  // --------------------------------------------------------------------------
  // TEST 3: PHÁT HIỆN CHU TRÌNH DEADLOCK TRÊN WAIT-FOR GRAPH & ABORT NẠN NHÂN
  // --------------------------------------------------------------------------
  runTest('Deadlock Detection on Wait-For Graph (WFG) & Automatic Victim Abort', () => {
    const detector = new DeadlockDetector();

    const T1 = 101;
    const T2 = 102;
    const ResA = 'table_orders';
    const ResB = 'table_payments';

    console.log('  [Setup] 2 Giao dịch: T1 (ID: 101) và T2 (ID: 102)');
    console.log('  [Setup] 2 Tài nguyên: ResA (table_orders) và ResB (table_payments)');

    // 1. T1 xin khóa X trên ResA -> Thành công
    const step1 = detector.acquireLock(T1, ResA, LockMode.EXCLUSIVE);
    console.log(`  (1) T1 xin khóa X trên ResA: ${step1.granted ? 'THÀNH CÔNG' : 'CHỜ'}`);
    assert.strictEqual(step1.granted, true);

    // 2. T2 xin khóa X trên ResB -> Thành công
    const step2 = detector.acquireLock(T2, ResB, LockMode.EXCLUSIVE);
    console.log(`  (2) T2 xin khóa X trên ResB: ${step2.granted ? 'THÀNH CÔNG' : 'CHỜ'}`);
    assert.strictEqual(step2.granted, true);

    // 3. T1 xin khóa X trên ResB -> Bị chặn vì T2 đang giữ -> T1 chờ T2 (WFG: T1 -> T2)
    const step3 = detector.acquireLock(T1, ResB, LockMode.EXCLUSIVE);
    console.log(`  (3) T1 xin khóa X trên ResB: ${step3.granted ? 'THÀNH CÔNG' : 'CHỜ T2'} (WFG: T1 -> T2)`);
    assert.strictEqual(step3.granted, false);
    assert.strictEqual(step3.deadlockDetected, false);

    // 4. T2 xin khóa X trên ResA -> Bị chặn vì T1 đang giữ -> T2 chờ T1 (WFG: T2 -> T1)
    // TẠO THÀNH CHU TRÌNH DEADLOCK: T1 -> T2 -> T1!
    console.log(`  (4) T2 xin khóa X trên ResA -> Gây ra chu trình: T2 -> T1 -> T2`);
    const step4 = detector.acquireLock(T2, ResA, LockMode.EXCLUSIVE);

    console.log(`      Deadlock Detected: ${step4.deadlockDetected ? 'CÓ 🚨' : 'KHÔNG'}`);
    console.log(`      Chu trình phát hiện: ${step4.cycle.join(' -> ')}`);
    console.log(`      Nạn nhân được chọn (Victim Aborted): T${step4.victim}`);

    assert.strictEqual(step4.deadlockDetected, true, 'Phải phát hiện Deadlock ngay lập tức');
    assert.strictEqual(step4.victim, T2, 'Chiến lược Youngest phải chọn T2 (102 > 101)');

    // 5. Kiểm tra tính toàn vẹn: T2 đã bị abort, khóa trên ResB đã được giải phóng
    // và trao lại cho T1 đang chờ!
    const resBInfo = detector.resourceLocks.get(ResB);
    console.log(`  (5) Sau khi T2 bị abort: Khóa ResB hiện do T${Array.from(resBInfo.holders).join(', ')} nắm giữ.`);
    assert.strictEqual(resBInfo.holders.has(T1), true, 'T1 phải được giải phóng và sở hữu ResB');

    // T1 hoàn tất và giải phóng tài nguyên an toàn
    detector.releaseLocks(T1);
    console.log(`  (6) T1 hoàn tất thành công và giải phóng toàn bộ khóa ✅`);
  });

  // --------------------------------------------------------------------------
  // BÁO CÁO TỔNG HỢP KIỂM THỬ (TEST SUMMARY REPORT)
  // --------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`📊 BÁO CÁO TỔNG HỢP KẾT QUẢ KIỂM THỬ: ${testsPassed}/${totalTests} TESTS PASSED`);
  if (testsPassed === totalTests) {
    console.log(`🎉 TOÀN BỘ CÁC MODULE CONCURRENCY, MVCC, SSI VÀ DEADLOCK HOẠT ĐỘNG HOÀN HẢO!`);
  } else {
    console.log(`⚠️ CÓ ${totalTests - testsPassed} TEST BỊ THẤT BẠI. CẦN KIỂM TRA LẠI.`);
  }
  console.log('================================================================================\n');
}

// ============================================================================
// XUẤT MODULE & TỰ ĐỘNG THỰC THI (EXPORTS & RUNNER)
// ============================================================================

module.exports = {
  TxStatus,
  IsolationLevel,
  TupleFlags,
  LockMode,
  ItemPointer,
  HeapTuple,
  Snapshot,
  TransactionContext,
  MVCCEngine,
  ConcurrencyAnomalyDetector,
  DeadlockDetector,
  runAllTests
};

// Nếu file được gọi trực tiếp bằng Node CLI: node lab03_mvcc_concurrency.js
if (require.main === module) {
  runAllTests();
}
