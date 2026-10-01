/**
 * ============================================================================
 * 📘 MODULE 02 LAB: INDEXING INTERNALS & COST-BASED OPTIMIZER (CBO) SIMULATOR
 * ============================================================================
 * Chủ quản (Owner): Anh — Lead Architect / Product Owner
 * Tác tử Thi công (Author): Senior Engineering Agent (Pod 2 Specialist)
 * Hệ quy chiếu: PostgreSQL 15/16+ & MySQL 8.0+ (InnoDB) Internals
 * Vị trí file: knowledge/database_masterclass/labs/lab02_indexing_cbo.js
 * Runtime: Pure Node.js (Zero external npm dependencies)
 *
 * MÔ TẢ MÔ-ĐUN PHÒNG THÍ NGHIỆM:
 * 1. BPlusTreeSimulator:
 *    - Mô phỏng cấu trúc B+ Tree tự cân bằng (Self-balancing).
 *    - Node split khi đầy (50-50 Node Split), thăng hạng khóa (Key Promotion).
 *    - Danh sách liên kết hai chiều tại các Node lá (Doubly-Linked Leaf Nodes).
 *    - Tìm kiếm điểm O(log N) (Point Lookup) & Quét dải O(log N + K) (Range Scan).
 * 2. CostBasedOptimizerSimulator:
 *    - Mô hình tính toán chi phí vật lý (Cost Model):
 *      * Sequential Scan (Quét toàn bảng tuần tự)
 *      * Index Scan (Quét chỉ mục B+ Tree + Random I/O)
 *      * Bitmap Index Scan (Gom TID vào Bitmap RAM + Quét Heap có sắp xếp)
 *    - Tự động xác định Điểm hòa vốn (Break-even Tipping Point) theo độ chọn lọc (Selectivity).
 *      Chứng minh toán học vì sao truy vấn chọn lọc > 15-20% dữ liệu khiến CBO chuyển sang Seq Scan.
 *    - Mô phỏng giải thuật ghép bảng (Join Algorithms): Nested Loop Join vs Hash Join
 *      kết hợp bộ nhớ khả dụng (work_mem) và cơ chế tràn đĩa (Disk Spilling / Multi-batch Grace Hash Join).
 * 3. Built-in Automated Test Suite:
 *    - Test 1: Kiểm chứng toàn vẹn cây B+ Tree (1,000 khóa ngẫu nhiên, 100% cân bằng và chính xác).
 *    - Test 2: Kiểm chứng tính tất định của Điểm hòa vốn CBO (15-20% Selectivity threshold).
 *    - Test 3: Kiểm chứng giải thuật Join và cơ chế tràn đĩa bộ nhớ (work_mem spill).
 * ============================================================================
 */

'use strict';

// ============================================================================
// 1. CẤU TRÚC DỮ LIỆU B+ TREE (B+ TREE DATA STRUCTURE & ALGORITHMS)
// ============================================================================

/**
 * Lớp đại diện cho một Node trong cây B+ Tree
 * Class representing a single Node in the B+ Tree
 */
class BPlusTreeNode {
  /**
   * @param {boolean} isLeaf - Cờ xác định Node lá (Leaf) hay Node nội bộ (Internal)
   * @param {number} order - Bậc của cây (Branching Factor / Order)
   */
  constructor(isLeaf = false, order = 4) {
    this.isLeaf = isLeaf;
    this.order = order;
    this.keys = [];          // Danh sách các khóa tìm kiếm (Search keys)
    this.children = [];      // Con trỏ tới các Node con (dành cho Internal Node)
    this.values = [];        // Dữ liệu hoặc con trỏ Tuple (ctid/RowID) (dành cho Leaf Node)
    this.next = null;        // Con trỏ liên kết lá kế tiếp (Forward leaf link)
    this.prev = null;        // Con trỏ liên kết lá phía trước (Backward leaf link)
  }

  /**
   * Kiểm tra Node có bị đầy vượt ngưỡng hay không (Overflow Check)
   */
  isOverflow() {
    return this.keys.length >= this.order;
  }
}

/**
 * Bộ mô phỏng Cây B+ Tree chuẩn cơ sở dữ liệu
 * Database-grade B+ Tree Simulator with Doubly-Linked Leaves
 */
class BPlusTreeSimulator {
  /**
   * @param {number} order - Bậc của cây (Số lượng con trỏ con tối đa cho mỗi node)
   */
  constructor(order = 4) {
    if (order < 3) {
      throw new Error('Order (Bậc của cây) phải lớn hơn hoặc bằng 3');
    }
    this.order = order;
    this.root = new BPlusTreeNode(true, order);
    this.height = 1;
    this.totalKeys = 0;
  }

  /**
   * Chèn một cặp Khóa - Giá trị vào cây B+ Tree
   * Insert a key-value pair into the B+ Tree
   * @param {number|string} key - Khóa chỉ mục (Index Key)
   * @param {any} value - Bản ghi dữ liệu hoặc con trỏ Tuple (Tuple Pointer / ctid)
   */
  insert(key, value) {
    const root = this.root;
    this._insertIntoLeaf(root, key, value);

    // Xử lý tách Root Node nếu bị tràn (Root Node Split)
    if (root.isOverflow()) {
      const newRoot = new BPlusTreeNode(false, this.order);
      const splitResult = this._splitNode(root);

      newRoot.keys.push(splitResult.promotedKey);
      newRoot.children.push(splitResult.leftNode);
      newRoot.children.push(splitResult.rightNode);

      this.root = newRoot;
      this.height++;
    }
    this.totalKeys++;
  }

  /**
   * Đệ quy chèn khóa vào Node lá thích hợp
   * Recursively insert key into the target leaf node
   * @private
   */
  _insertIntoLeaf(currentNode, key, value) {
    if (currentNode.isLeaf) {
      // Tìm vị trí thích hợp để chèn giữ thứ tự sắp xếp (Binary/Linear insertion)
      let idx = 0;
      while (idx < currentNode.keys.length && currentNode.keys[idx] < key) {
        idx++;
      }

      // Xử lý nếu khóa đã tồn tại: ghi đè giá trị
      if (idx < currentNode.keys.length && currentNode.keys[idx] === key) {
        currentNode.values[idx] = value;
        this.totalKeys--; // Bù trừ biến đếm tổng khóa
        return;
      }

      currentNode.keys.splice(idx, 0, key);
      currentNode.values.splice(idx, 0, value);
      return;
    }

    // Điều hướng xuống Node con tương ứng (Internal Node routing)
    let childIdx = 0;
    while (childIdx < currentNode.keys.length && key >= currentNode.keys[childIdx]) {
      childIdx++;
    }

    const child = currentNode.children[childIdx];
    this._insertIntoLeaf(child, key, value);

    // Kiểm tra nếu Node con bị tràn sau khi chèn
    if (child.isOverflow()) {
      const splitResult = this._splitNode(child);
      currentNode.keys.splice(childIdx, 0, splitResult.promotedKey);
      currentNode.children.splice(childIdx, 1, splitResult.leftNode, splitResult.rightNode);
    }
  }

  /**
   * Tách Node (Node Splitting) theo cơ chế 50-50
   * @private
   */
  _splitNode(node) {
    if (node.isLeaf) {
      // Tách Node lá (Leaf Node Split)
      const mid = Math.floor(node.keys.length / 2);
      const rightNode = new BPlusTreeNode(true, this.order);

      rightNode.keys = node.keys.splice(mid);
      rightNode.values = node.values.splice(mid);

      // Cập nhật Danh sách liên kết hai chiều (Doubly-Linked List Maintenance)
      rightNode.next = node.next;
      rightNode.prev = node;
      if (node.next) {
        node.next.prev = rightNode;
      }
      node.next = rightNode;

      // Trong B+ Tree, khóa đầu tiên của Node lá bên phải được sao chép lên Node cha
      const promotedKey = rightNode.keys[0];
      return {
        promotedKey,
        leftNode: node,
        rightNode,
      };
    } else {
      // Tách Node nội bộ (Internal Node Split)
      const mid = Math.floor(node.keys.length / 2);
      const promotedKey = node.keys[mid]; // Khóa giữa được đẩy hẳn lên cha, không lưu ở con

      const rightNode = new BPlusTreeNode(false, this.order);
      rightNode.keys = node.keys.splice(mid + 1);
      rightNode.children = node.children.splice(mid + 1);

      // Xóa khóa trung vị khỏi node trái
      node.keys.splice(mid, 1);

      return {
        promotedKey,
        leftNode: node,
        rightNode,
      };
    }
  }

  /**
   * Tìm kiếm điểm O(log N) (Point Lookup)
   * @param {number|string} key - Khóa cần tra cứu
   * @returns {{ found: boolean, value: any, pageVisits: number, height: number }}
   */
  search(key) {
    let curr = this.root;
    let pageVisits = 1;

    // Duyệt từ Root xuống Leaf
    while (!curr.isLeaf) {
      let idx = 0;
      while (idx < curr.keys.length && key >= curr.keys[idx]) {
        idx++;
      }
      curr = curr.children[idx];
      pageVisits++;
    }

    // Tìm kiếm trong Node lá
    let leafIdx = 0;
    while (leafIdx < curr.keys.length && curr.keys[leafIdx] < key) {
      leafIdx++;
    }

    if (leafIdx < curr.keys.length && curr.keys[leafIdx] === key) {
      return {
        found: true,
        value: curr.values[leafIdx],
        pageVisits,
        height: this.height,
      };
    }

    return {
      found: false,
      value: null,
      pageVisits,
      height: this.height,
    };
  }

  /**
   * Quét dải O(log N + K) (Range Scan) sử dụng Doubly-Linked Leaves
   * @param {number|string} minKey - Khóa cận dưới (Inclusive)
   * @param {number|string} maxKey - Khóa cận trên (Inclusive)
   * @returns {{ results: Array<{key: any, value: any}>, leafPagesTraversed: number, totalSeekVisits: number }}
   */
  rangeSearch(minKey, maxKey) {
    let curr = this.root;
    let seekVisits = 1;

    // Bước 1: Tra cứu cây O(log N) để định vị Node lá chứa minKey
    while (!curr.isLeaf) {
      let idx = 0;
      while (idx < curr.keys.length && minKey >= curr.keys[idx]) {
        idx++;
      }
      curr = curr.children[idx];
      seekVisits++;
    }

    // Bước 2: Quét ngang qua danh sách liên kết hai chiều (Horizontal Leaf Traversal)
    const results = [];
    let leafPagesTraversed = 1;
    let done = false;

    while (curr && !done) {
      for (let i = 0; i < curr.keys.length; i++) {
        const k = curr.keys[i];
        if (k >= minKey && k <= maxKey) {
          results.push({ key: k, value: curr.values[i] });
        } else if (k > maxKey) {
          done = true;
          break;
        }
      }

      if (!done) {
        curr = curr.next;
        if (curr) leafPagesTraversed++;
      }
    }

    return {
      results,
      leafPagesTraversed,
      totalSeekVisits: seekVisits,
    };
  }

  /**
   * Kiểm chứng tính toàn vẹn và cân bằng của cây B+ Tree (Integrity & Balance Audit)
   * @returns {{ isBalanced: boolean, height: number, totalKeys: number, leafCount: number, error: string|null }}
   */
  validateIntegrity() {
    let leafDepths = [];

    // Duyệt đệ quy để thu thập độ sâu của tất cả các Node lá
    const traverse = (node, depth) => {
      if (node.isLeaf) {
        leafDepths.push(depth);
        return;
      }
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    };
    traverse(this.root, 1);

    // Kiểm tra 1: Mọi Node lá phải có cùng một độ sâu (Perfect Balance Invariant)
    const firstDepth = leafDepths[0] || 1;
    const isBalanced = leafDepths.every(d => d === firstDepth);

    // Kiểm tra 2: Tính liên tục của danh sách liên kết hai chiều
    let forwardKeys = [];
    let leftmost = this.root;
    while (!leftmost.isLeaf) {
      leftmost = leftmost.children[0];
    }

    let curr = leftmost;
    let leafCount = 0;
    let prev = null;
    let linkError = null;

    while (curr) {
      leafCount++;
      if (curr.prev !== prev) {
        linkError = 'Doubly linked list backward pointer (prev) bị sai lệch!';
        break;
      }
      for (let i = 0; i < curr.keys.length; i++) {
        forwardKeys.push(curr.keys[i]);
        if (i > 0 && curr.keys[i] <= curr.keys[i - 1]) {
          linkError = `Khóa không được sắp xếp tăng dần: ${curr.keys[i]} <= ${curr.keys[i - 1]}`;
          break;
        }
      }
      prev = curr;
      curr = curr.next;
    }

    return {
      isBalanced,
      height: firstDepth,
      totalKeys: forwardKeys.length,
      leafCount,
      error: !isBalanced ? 'Các Node lá có độ sâu không đồng nhất!' : linkError,
    };
  }
}

// ============================================================================
// 2. BỘ MÔ PHỎNG CHI PHÍ TỐI ƯU HÓA TRUY VẤN (COST-BASED OPTIMIZER - CBO)
// ============================================================================

/**
 * Bộ mô phỏng CBO dựa trên mô hình chi phí của PostgreSQL & MySQL InnoDB
 * Cost-Based Optimizer Simulator with Exact Physical Cost Calculations
 */
class CostBasedOptimizerSimulator {
  /**
   * Khởi tạo cấu hình môi trường tính toán chi phí (Cost Weights & Hardware Specs)
   */
  constructor(config = {}) {
    // Trọng số I/O & CPU mặc định theo chuẩn PostgreSQL Engine Internals
    this.seq_page_cost = config.seq_page_cost ?? 1.0;         // Chi phí đọc 1 trang tuần tự (HDD/SSD Sequential I/O)
    this.random_page_cost = config.random_page_cost ?? 4.0;   // Chi phí đọc 1 trang ngẫu nhiên (HDD=4.0, NVMe SSD=1.1-1.5)
    this.cpu_tuple_cost = config.cpu_tuple_cost ?? 0.01;       // Chi phí CPU xử lý 1 dòng dữ liệu
    this.cpu_index_tuple_cost = config.cpu_index_tuple_cost ?? 0.005; // Chi phí CPU quét 1 mục chỉ mục
    this.cpu_operator_cost = config.cpu_operator_cost ?? 0.0025;     // Chi phí CPU tính toán toán tử lọc điều kiện
    this.page_size_bytes = config.page_size_bytes ?? 8192;    // Kích thước 1 Page chuẩn (8 KB)
    this.work_mem_kb = config.work_mem_kb ?? 4096;            // Bộ nhớ RAM khả dụng cho mỗi phép Join/Sort (4 MB)
  }

  /**
   * Tính toán tham số vật lý của bảng dữ liệu
   * Calculate physical storage profile for table and index
   */
  calculateTableProfile(totalRows, rowWidthBytes = 100, indexKeyWidthBytes = 16) {
    const pageHeaderBytes = 24;
    const itemPointerBytes = 4;
    const usablePageBytes = this.page_size_bytes - pageHeaderBytes;

    // Số dòng tối đa chứa trong 1 Heap Page
    const rowsPerPage = Math.floor(usablePageBytes / (rowWidthBytes + itemPointerBytes));
    const totalHeapPages = Math.ceil(totalRows / rowsPerPage);

    // Số mục chỉ mục tối đa chứa trong 1 B+ Tree Leaf Page
    const indexEntriesPerPage = Math.floor(usablePageBytes / (indexKeyWidthBytes + itemPointerBytes));
    const totalIndexLeafPages = Math.ceil(totalRows / indexEntriesPerPage);

    // Ước lượng chiều cao cây B+ Tree (Tree Height Estimation)
    const fanout = Math.floor(usablePageBytes / (indexKeyWidthBytes + 8));
    const treeHeight = Math.max(1, Math.ceil(Math.log(totalRows) / Math.log(fanout)));

    return {
      totalRows,
      rowWidthBytes,
      rowsPerPage,
      totalHeapPages,
      indexEntriesPerPage,
      totalIndexLeafPages,
      fanout,
      treeHeight,
    };
  }

  /**
   * 1. Chi phí Quét Toàn Bảng (Sequential Scan Cost)
   * Mô hình chuẩn PostgreSQL:
   * Cost = N_pages * seq_page_cost + N_tuples * (cpu_tuple_cost + cpu_operator_cost)
   */
  calculateSeqScanCost(tableProfile) {
    const { totalRows, totalHeapPages } = tableProfile;
    const ioCost = totalHeapPages * this.seq_page_cost;
    const cpuCost = totalRows * (this.cpu_tuple_cost + this.cpu_operator_cost);
    const totalCost = ioCost + cpuCost;

    return {
      plan: 'Sequential Scan (Quét toàn bảng)',
      startupCost: 0.0,
      runCost: Number(totalCost.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      ioCost: Number(ioCost.toFixed(2)),
      cpuCost: Number(cpuCost.toFixed(2)),
      pagesAccessed: totalHeapPages,
      tuplesExamined: totalRows,
    };
  }

  /**
   * 2. Chi phí Quét Chỉ Mục (Index Scan Cost)
   * Áp dụng mô hình chuẩn PostgreSQL cho Index Scan:
   * - Tree traversal: treeHeight * random_page_cost
   * - Index leaf pages: indexPages * seq_page_cost + selectedRows * cpu_index_tuple_cost
   * - Heap access cost: phụ thuộc vào hệ số phân cụm (clusteringFactor / correlation).
   *   * Khi correlation cao (~0.75): Heap pages được đọc gần như tuần tự kết hợp một số seek ngẫu nhiên.
   *   * Khi correlation = 0.0: Mỗi dòng là một Random I/O độc lập.
   * @param {object} tableProfile
   * @param {number} selectivity - Tỷ lệ chọn lọc (0.01 = 1%, 0.20 = 20%)
   * @param {number} clusteringFactor - Hệ số phân cụm (0.0: Heap ngẫu nhiên, 1.0: Clustered hoàn hảo, 0.75: Điển hình)
   */
  calculateIndexScanCost(tableProfile, selectivity, clusteringFactor = 0.75) {
    const { totalRows, totalHeapPages, indexEntriesPerPage, treeHeight } = tableProfile;
    const selectedRows = Math.max(1, Math.round(totalRows * selectivity));

    // Chi phí tầng B+ Tree (Internal traversal + Leaf seek)
    const treeTraversalCost = treeHeight * this.random_page_cost;
    const indexLeafPages = Math.ceil(selectedRows / indexEntriesPerPage);
    const indexLeafCost = indexLeafPages * this.seq_page_cost;
    const indexCpuCost = selectedRows * this.cpu_index_tuple_cost;

    // Chi phí chạm Heap Page (Heap Access Cost)
    // Ước lượng số trang Heap riêng biệt chứa các dòng được chọn (Mackert & Lohman Formula)
    const p = totalHeapPages;
    const n = selectedRows;
    const expectedPages = p * (1 - Math.pow(1 - 1 / p, n));
    const heapPagesTouched = Math.min(p, Math.max(1, Math.round(expectedPages)));

    // Mô hình chi phí Heap I/O theo hệ số tương quan (PostgreSQL correlation weighting):
    // Chi phí I/O = correlation * (trang đọc tuần tự) + (1 - correlation) * (trang đọc ngẫu nhiên)
    const seqPages = heapPagesTouched * clusteringFactor;
    const randomPages = heapPagesTouched * (1 - clusteringFactor);
    const heapIoCost = (seqPages * this.seq_page_cost) + (randomPages * this.random_page_cost);

    const heapCpuCost = selectedRows * this.cpu_tuple_cost;
    const totalCost = treeTraversalCost + indexLeafCost + indexCpuCost + heapIoCost + heapCpuCost;

    return {
      plan: 'Index Scan (Quét chỉ mục)',
      startupCost: Number(treeTraversalCost.toFixed(2)),
      runCost: Number((totalCost - treeTraversalCost).toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      indexIoCost: Number((treeTraversalCost + indexLeafCost).toFixed(2)),
      heapIoCost: Number(heapIoCost.toFixed(2)),
      cpuCost: Number((indexCpuCost + heapCpuCost).toFixed(2)),
      pagesAccessed: Math.round(heapPagesTouched + indexLeafPages + treeHeight),
      tuplesExamined: selectedRows,
    };
  }

  /**
   * 3. Chi phí Quét Chỉ Mục Bitmap (Bitmap Index Scan + Bitmap Heap Scan)
   * Tối ưu I/O bằng cách gom TID vào Bitmap RAM rồi duyệt Heap theo thứ tự địa chỉ vật lý
   */
  calculateBitmapIndexScanCost(tableProfile, selectivity) {
    const { totalRows, totalHeapPages, indexEntriesPerPage, treeHeight } = tableProfile;
    const selectedRows = Math.max(1, Math.round(totalRows * selectivity));

    // Pha 1: Bitmap Index Scan (Xây dựng mảng Bitmap trong RAM)
    const treeTraversalCost = treeHeight * this.random_page_cost;
    const indexLeafPages = Math.ceil(selectedRows / indexEntriesPerPage);
    const indexLeafCost = indexLeafPages * this.seq_page_cost;
    const bitmapCreationCpu = selectedRows * (this.cpu_index_tuple_cost + this.cpu_operator_cost);
    const startupCost = treeTraversalCost + indexLeafCost + bitmapCreationCpu;

    // Pha 2: Bitmap Heap Scan (Duyệt Heap Pages theo thứ tự địa chỉ vật lý)
    const p = totalHeapPages;
    const n = selectedRows;
    const expectedPages = p * (1 - Math.pow(1 - 1 / p, n));
    const heapPagesTouched = Math.min(p, Math.max(1, Math.round(expectedPages)));

    // Do các trang được sắp xếp tăng dần theo BlockID, I/O tiến gần tới Sequential I/O
    // nhưng vẫn có độ trễ do các khoảng nhảy (run gaps) giữa các trang
    const pageDensity = heapPagesTouched / totalHeapPages;
    const effectivePageCost = this.seq_page_cost + (this.random_page_cost - this.seq_page_cost) * Math.pow(1 - pageDensity, 2);
    const heapIoCost = heapPagesTouched * effectivePageCost;

    // CPU chi phí kiểm tra từng dòng trên các trang nạp vào
    const tuplesOnVisitedPages = heapPagesTouched * tableProfile.rowsPerPage;
    const heapCpuCost = (selectedRows * this.cpu_tuple_cost) + (tuplesOnVisitedPages * this.cpu_operator_cost);

    const totalCost = startupCost + heapIoCost + heapCpuCost;

    return {
      plan: 'Bitmap Index Scan (Quét chỉ mục Bitmap)',
      startupCost: Number(startupCost.toFixed(2)),
      runCost: Number((heapIoCost + heapCpuCost).toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      indexIoCost: Number((treeTraversalCost + indexLeafCost).toFixed(2)),
      heapIoCost: Number(heapIoCost.toFixed(2)),
      cpuCost: Number((bitmapCreationCpu + heapCpuCost).toFixed(2)),
      pagesAccessed: Math.round(heapPagesTouched + indexLeafPages),
      tuplesExamined: selectedRows,
    };
  }

  /**
   * Tự động xác định Điểm hòa vốn (Break-even Tipping Point) của Optimizer
   * Quét dải Selectivity từ 0.1% đến 50% để phát hiện thời điểm CBO chuyển kế hoạch sang Seq Scan
   * @param {object} tableProfile
   * @param {number} clusteringFactor
   */
  findBreakEvenThreshold(tableProfile, clusteringFactor = 0.75) {
    const seqScan = this.calculateSeqScanCost(tableProfile);
    let indexScanBreakEven = null;
    let bitmapScanBreakEven = null;

    const samples = [];
    const step = 0.005; // Bước nhảy 0.5% độ chọn lọc

    for (let s = 0.001; s <= 1.00; s += step) {
      const idxCost = this.calculateIndexScanCost(tableProfile, s, clusteringFactor).totalCost;
      const bmpCost = this.calculateBitmapIndexScanCost(tableProfile, s).totalCost;
      const seqCost = seqScan.totalCost;

      // Xác định thời điểm Index Scan vượt mặt Seq Scan
      if (!indexScanBreakEven && idxCost >= seqCost) {
        indexScanBreakEven = Number((s * 100).toFixed(2));
      }

      // Xác định thời điểm Bitmap Scan vượt mặt Seq Scan
      if (!bitmapScanBreakEven && bmpCost >= seqCost) {
        bitmapScanBreakEven = Number((s * 100).toFixed(2));
      }

      // Lưu trữ mẫu đại diện để hiển thị bảng so sánh
      if ([0.001, 0.01, 0.05, 0.10, 0.15, 0.18, 0.20, 0.30, 0.50].some(v => Math.abs(s - v) < 0.002)) {
        let optimalPlan = 'Index Scan';
        const minCost = Math.min(idxCost, bmpCost, seqCost);
        if (minCost === seqCost) {
          optimalPlan = 'Seq Scan';
        } else if (minCost === bmpCost) {
          optimalPlan = 'Bitmap Scan';
        }

        samples.push({
          selectivityPct: (s * 100).toFixed(1) + '%',
          indexScanCost: idxCost,
          bitmapScanCost: bmpCost,
          seqScanCost: seqCost,
          optimalPlan,
        });
      }
    }

    return {
      indexScanBreakEvenPct: indexScanBreakEven,
      bitmapScanBreakEvenPct: bitmapScanBreakEven,
      seqScanConstantCost: seqScan.totalCost,
      clusteringFactor,
      samples,
    };
  }

  /**
   * Mô phỏng chi phí Phép Ghép Bảng (Join Cost Simulator): Nested Loop vs Hash Join
   * @param {number} outerRows - Số dòng bảng bên ngoài (Outer Relation R)
   * @param {number} innerRows - Số dòng bảng bên trong (Inner Relation S)
   * @param {boolean} innerHasIndex - Bảng trong có Index trên Join Key hay không
   * @param {number} tupleWidthBytes - Kích thước trung bình mỗi dòng
   */
  evaluateJoinStrategies(outerRows, innerRows, innerHasIndex = true, tupleWidthBytes = 100) {
    const outerProfile = this.calculateTableProfile(outerRows, tupleWidthBytes);
    const innerProfile = this.calculateTableProfile(innerRows, tupleWidthBytes);

    // 1. NESTED LOOP JOIN
    let nljTotalCost = 0;
    const outerScanCost = this.calculateSeqScanCost(outerProfile).totalCost;

    if (innerHasIndex) {
      // Index Nested Loop: Mỗi dòng Outer thực hiện 1 Index Lookup trên Inner O(log S)
      const singleIndexLookup = (innerProfile.treeHeight * this.random_page_cost) +
        (1 * this.random_page_cost) + (1 * this.cpu_tuple_cost);
      const innerLookupsCost = outerRows * singleIndexLookup;
      nljTotalCost = outerScanCost + innerLookupsCost;
    } else {
      // Classic Nested Loop (Không Index): O(|R| * |S|)
      const innerSeqScanCost = this.calculateSeqScanCost(innerProfile).totalCost;
      nljTotalCost = outerScanCost + (outerRows * innerSeqScanCost);
    }

    // 2. HASH JOIN
    // Chọn bảng nhỏ hơn làm Build Relation
    const buildRelation = outerRows <= innerRows ? { name: 'Outer', rows: outerRows, profile: outerProfile }
      : { name: 'Inner', rows: innerRows, profile: innerProfile };
    const probeRelation = outerRows <= innerRows ? { name: 'Inner', rows: innerRows, profile: innerProfile }
      : { name: 'Outer', rows: outerRows, profile: outerProfile };

    // Kích thước Hash Table trong RAM
    const hashEntryOverhead = 24; // Con trỏ bucket + hash code + line link
    const estimatedHashTableBytes = buildRelation.rows * (tupleWidthBytes + hashEntryOverhead);
    const workMemBytes = this.work_mem_kb * 1024;
    const isMemorySpill = estimatedHashTableBytes > workMemBytes;

    let hashJoinTotalCost = 0;
    let batches = 1;
    let spillIoCost = 0;

    // Chi phí quét 2 bảng
    const scanBuildCost = this.calculateSeqScanCost(buildRelation.profile).totalCost;
    const scanProbeCost = this.calculateSeqScanCost(probeRelation.profile).totalCost;
    const hashComputationCost = (buildRelation.rows + probeRelation.rows) * this.cpu_operator_cost;

    if (!isMemorySpill) {
      // In-Memory Hash Join (Pha 1: Build + Pha 2: Probe hoàn toàn trong RAM)
      hashJoinTotalCost = scanBuildCost + scanProbeCost + hashComputationCost;
    } else {
      // Multi-Batch Grace Hash Join (Tràn đĩa cứng / Spilling to Disk)
      batches = Math.ceil(estimatedHashTableBytes / workMemBytes) * 2; // Số partition dự phòng
      // Chi phí ghi các partition tạm ra đĩa rồi đọc lại
      const totalPagesToSpill = buildRelation.profile.totalHeapPages + probeRelation.profile.totalHeapPages;
      spillIoCost = 2 * totalPagesToSpill * this.seq_page_cost; // 1 lượt Write + 1 lượt Read
      hashJoinTotalCost = scanBuildCost + scanProbeCost + hashComputationCost + spillIoCost;
    }

    // Đưa ra quyết định tối ưu
    const winner = nljTotalCost < hashJoinTotalCost ? 'Nested Loop Join' : 'Hash Join';

    return {
      outerRows,
      innerRows,
      innerHasIndex,
      nestedLoopCost: Number(nljTotalCost.toFixed(2)),
      hashJoin: {
        totalCost: Number(hashJoinTotalCost.toFixed(2)),
        buildTable: buildRelation.name,
        estimatedHashTableKB: Math.round(estimatedHashTableBytes / 1024),
        workMemKB: this.work_mem_kb,
        isMemorySpill,
        batches,
        spillIoCost: Number(spillIoCost.toFixed(2)),
      },
      winner,
      recommendationReason: winner === 'Nested Loop Join'
        ? `Nested Loop tối ưu vì Outer Table nhỏ (${outerRows} dòng) kết hợp Index Seek trên Inner Table.`
        : (isMemorySpill
          ? `Hash Join thắng thế nhưng bị Tràn Đĩa (${batches} batches) do work_mem=${this.work_mem_kb}KB < Cần=${Math.round(estimatedHashTableBytes / 1024)}KB.`
          : `Hash Join tối ưu vượt trội trong RAM (${Math.round(estimatedHashTableBytes / 1024)}KB <= work_mem=${this.work_mem_kb}KB).`),
    };
  }
}

// ============================================================================
// 3. BỘ KIỂM THỬ TỰ ĐỘNG KHÉP KÍN (BUILT-IN AUTOMATED TEST SUITE)
// ============================================================================

/**
 * Điều phối viên kiểm thử tự động (Test Suite Runner)
 */
function runAllTests() {
  console.log('======================================================================');
  console.log('🧪 DATABASE MASTERCLASS LAB 02: B+ TREE & CBO OPTIMIZER VERIFICATION');
  console.log('======================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // --------------------------------------------------------------------------
  // TEST 1: KIỂM CHỨNG B+ TREE CÂN BẰNG, TÌM KIẾM ĐIỂM & QUÉT DẢI 1,000 KHÓA
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 1] Kiểm chứng B+ Tree Simulator (1,000 Khóa ngẫu nhiên) ---');
  const btree = new BPlusTreeSimulator(6); // Bậc 6 (Max 5 keys/node, tách khi đạt 6)
  const testKeyCount = 1000;
  const insertedData = new Map();

  // Tạo tập khóa ngẫu nhiên xáo trộn (Randomized Shuffled Keys)
  const keys = Array.from({ length: testKeyCount }, (_, i) => i + 1);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }

  // Chèn 1,000 khóa vào B+ Tree
  for (const k of keys) {
    const tuplePointer = { pageId: Math.floor(k / 10), offset: k % 10, value: `tuple_${k}` };
    btree.insert(k, tuplePointer);
    insertedData.set(k, tuplePointer);
  }

  // 1. Kiểm tra tính cân bằng và danh sách liên kết
  const audit = btree.validateIntegrity();
  console.log(`✓ Trạng thái cân bằng (All Leaves Same Depth): ${audit.isBalanced ? 'ĐẠT (PASS)' : 'LỖI'}`);
  console.log(`✓ Chiều cao cây B+ Tree (Height): ${audit.height}`);
  console.log(`✓ Tổng số Node lá (Leaf Nodes): ${audit.leafCount}`);
  console.log(`✓ Tổng số khóa quản lý (Total Keys): ${audit.totalKeys} / ${testKeyCount}`);

  if (!audit.isBalanced || audit.totalKeys !== testKeyCount || audit.error) {
    console.error(`❌ TEST 1 THẤT BẠI: ${audit.error}`);
    process.exit(1);
  }

  // 2. Kiểm chứng 100% Tìm kiếm điểm (Point Lookup)
  let lookupSuccess = true;
  for (const k of keys) {
    const searchRes = btree.search(k);
    if (!searchRes.found || searchRes.value.value !== `tuple_${k}`) {
      lookupSuccess = false;
      break;
    }
  }
  console.log(`✓ Kiểm tra Point Lookup 1,000 khóa: ${lookupSuccess ? '100% CHÍNH XÁC (PASS)' : 'LỖI'}`);

  // 3. Kiểm chứng Quét dải (Range Scan: minKey=250, maxKey=750)
  const minK = 250;
  const maxK = 750;
  const rangeRes = btree.rangeSearch(minK, maxK);
  const expectedRangeCount = maxK - minK + 1;
  const isRangeAccurate = rangeRes.results.length === expectedRangeCount &&
    rangeRes.results.every((r, idx) => r.key === minK + idx);

  console.log(`✓ Kiểm tra Range Scan [${minK}..${maxK}]: Tìm thấy ${rangeRes.results.length} dòng (Kỳ vọng: ${expectedRangeCount})`);
  console.log(`✓ Số Node lá duyệt ngang (Leaf Traversals): ${rangeRes.leafPagesTraversed} pages (Không quay lại Root)`);
  console.log(`✓ Độ chính xác dữ liệu Range Scan: ${isRangeAccurate ? '100% CHÍNH XÁC (PASS)' : 'LỖI'}`);

  if (lookupSuccess && isRangeAccurate) {
    console.log('👉 KẾT QUẢ TEST 1: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error('❌ TEST 1 THẤT BẠI!');
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // TEST 2: ĐIỂM HÒA VỐN CBO (BREAK-EVEN THRESHOLD & PLAN TRANSITION)
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 2] Phân Tích Điểm Hòa Vốn CBO (Break-even Tipping Point) ---');
  const cbo = new CostBasedOptimizerSimulator({
    seq_page_cost: 1.0,
    random_page_cost: 4.0, // HDD hoặc SSD chưa tuned
  });

  const tableRows = 100000;
  const tableProfile = cbo.calculateTableProfile(tableRows, 100);
  console.log(`• Bảng giả lập: ${tableRows.toLocaleString()} dòng | ${tableProfile.totalHeapPages.toLocaleString()} Heap Pages (8KB)`);
  console.log(`• Chiều cao B+ Tree: ${tableProfile.treeHeight} tầng | ${tableProfile.totalIndexLeafPages} Leaf Pages`);

  // Phân tích với hệ số phân cụm điển hình trong CSDL quan hệ (correlation = 0.75)
  const breakEven = cbo.findBreakEvenThreshold(tableProfile, 0.75);
  // Phân tích với bảng Heap hoàn toàn vô trật tự (correlation = 0.0 - Worst case unclustered)
  const breakEvenUnclustered = cbo.findBreakEvenThreshold(tableProfile, 0.0);

  console.log(`\n📊 MA TRẬN SO SÁNH CHI PHÍ THEO ĐỘ CHỌN LỌC (SELECTIVITY MATRIX - CORRELATION 0.75):`);
  console.log('-----------------------------------------------------------------------------------------');
  console.log('| Độ Chọn Lọc | Index Scan Cost | Bitmap Scan Cost | Seq Scan Cost | Kế Hoạch Tối Ưu    |');
  console.log('-----------------------------------------------------------------------------------------');
  for (const sample of breakEven.samples) {
    const pad = (s, len) => String(s).padEnd(len);
    console.log(`| ${pad(sample.selectivityPct, 11)} | ${pad(sample.indexScanCost.toFixed(2), 15)} | ${pad(sample.bitmapScanCost.toFixed(2), 16)} | ${pad(sample.seqScanCost.toFixed(2), 13)} | ${pad(sample.optimalPlan, 18)} |`);
  }
  console.log('-----------------------------------------------------------------------------------------');

  console.log(`\n🎯 KẾT QUẢ PHÂN TÍCH ĐIỂM HÒA VỐN CỦA OPTIMIZER:`);
  console.log(`👉 [Hệ số Correlation = 0.75] Ngưỡng lật Index Scan sang Seq Scan: ${breakEven.indexScanBreakEvenPct}%`);
  console.log(`👉 [Hệ số Correlation = 0.75] Ngưỡng lật Bitmap Scan sang Seq Scan: ${breakEven.bitmapScanBreakEvenPct}%`);
  console.log(`👉 [Hệ số Correlation = 0.00] Ngưỡng lật Index Scan (Heap Unclustered): ${breakEvenUnclustered.indexScanBreakEvenPct}%`);
  console.log(`💡 GIẢI MÃ BẢN CHẤT KỸ THUẬT:`);
  console.log(`   - Khi Correlation = 0.0 (Unclustered Heap): Mỗi bản ghi là 1 Random I/O riêng biệt,`);
  console.log(`     khiến Index Scan suy thoái cực nhanh chỉ sau ${breakEvenUnclustered.indexScanBreakEvenPct}% dữ liệu. Đây là lý do`);
  console.log(`     PostgreSQL phát minh Bitmap Index Scan để cứu cánh.`);
  console.log(`   - Khi Correlation = 0.75 (Điển hình CSDL): B+ Tree kết hợp đọc tuần tự cụm trang`);
  console.log(`     giúp Index Scan trụ vững đến ${breakEven.indexScanBreakEvenPct}%.`);
  console.log(`   - Vượt qua 15-20% dữ liệu (chính xác: ${breakEven.indexScanBreakEvenPct}%): Tổng chi phí Random I/O của Index`);
  console.log(`     chính thức vượt qua chi phí đọc tuần tự cả bảng (Seq Scan = ${breakEven.seqScanConstantCost}).`);
  console.log(`     CBO tất định từ bỏ Index Scan và chuyển hẳn sang Sequential Scan!`);

  // Kiểm chứng tính tất định: Break-even point của Index Scan nằm chính xác trong khoảng 15% - 20%
  const isBreakEvenValid = breakEven.indexScanBreakEvenPct >= 15.0 && breakEven.indexScanBreakEvenPct <= 20.0;
  if (isBreakEvenValid) {
    console.log('👉 KẾT QUẢ TEST 2: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error(`❌ TEST 2 THẤT BẠI: Ngưỡng hòa vốn bất thường (${breakEven.indexScanBreakEvenPct}%)`);
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // TEST 3: MÔ PHỎNG GIẢI THUẬT JOIN & TRÀN BỘ NHỚ (HASH JOIN VS NESTED LOOP)
  // --------------------------------------------------------------------------
  totalTests++;
  console.log('--- [TEST 3] Mô Phỏng Chiến Lược Ghép Bảng (Join Algorithms & work_mem) ---');

  // Kịch bản A: Bảng ngoài rất nhỏ (50 dòng) + Bảng trong lớn (100,000 dòng có Index)
  console.log('📌 Kịch bản A: Outer Table (50 dòng) JOIN Inner Table (100,000 dòng - Có Index)');
  const resA = cbo.evaluateJoinStrategies(50, 100000, true);
  console.log(`   - Chi phí Nested Loop: ${resA.nestedLoopCost} | Chi phí Hash Join: ${resA.hashJoin.totalCost}`);
  console.log(`   - Kế hoạch chiến thắng: ${resA.winner} (${resA.recommendationReason})\n`);

  // Kịch bản B: Hai bảng lớn (20,000 dòng JOIN 50,000 dòng) + Đủ RAM (work_mem = 16 MB)
  console.log('📌 Kịch bản B: Outer (20,000 dòng) JOIN Inner (50,000 dòng) | work_mem = 16 MB');
  const cboHighMem = new CostBasedOptimizerSimulator({ work_mem_kb: 16384 });
  const resB = cboHighMem.evaluateJoinStrategies(20000, 50000, true);
  console.log(`   - Chi phí Nested Loop: ${resB.nestedLoopCost} | Chi phí Hash Join: ${resB.hashJoin.totalCost}`);
  console.log(`   - Trạng thái RAM Hash Table: ${resB.hashJoin.estimatedHashTableKB} KB / ${resB.hashJoin.workMemKB} KB (Spill: ${resB.hashJoin.isMemorySpill})`);
  console.log(`   - Kế hoạch chiến thắng: ${resB.winner} (${resB.recommendationReason})\n`);

  // Kịch bản C: Hai bảng lớn + Thiếu RAM nghiêm trọng (work_mem = 512 KB -> Tràn Đĩa)
  console.log('📌 Kịch bản C: Outer (20,000 dòng) JOIN Inner (50,000 dòng) | work_mem = 512 KB (Gây Tràn Đĩa)');
  const cboLowMem = new CostBasedOptimizerSimulator({ work_mem_kb: 512 });
  const resC = cboLowMem.evaluateJoinStrategies(20000, 50000, true);
  console.log(`   - Chi phí Hash Join: ${resC.hashJoin.totalCost} (Bao gồm Chi phí Tràn Đĩa Spill I/O: ${resC.hashJoin.spillIoCost})`);
  console.log(`   - Số Batches phân vùng (Disk Batches): ${resC.hashJoin.batches} batches`);
  console.log(`   - Kế hoạch chiến thắng: ${resC.winner} (${resC.recommendationReason})\n`);

  const isJoinValid = resA.winner === 'Nested Loop Join' &&
    resB.winner === 'Hash Join' && !resB.hashJoin.isMemorySpill &&
    resC.hashJoin.isMemorySpill && resC.hashJoin.batches > 1;

  if (isJoinValid) {
    console.log('👉 KẾT QUẢ TEST 3: THÀNH CÔNG RỰC RỠ (PASSED) ✅\n');
    passedTests++;
  } else {
    console.error('❌ TEST 3 THẤT BẠI!');
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // BÁO CÁO TỔNG KẾT (SUMMARY REPORT)
  // --------------------------------------------------------------------------
  console.log('======================================================================');
  console.log(`🏆 KẾT QUẢ TOÀN DIỆN: ${passedTests}/${totalTests} BÀI KIỂM THỬ XANH TUYỆT ĐỐI (100% PASSED)`);
  console.log('======================================================================');
}

// Tự động kích hoạt khi thực thi trực tiếp bằng Node CLI
if (require.main === module) {
  runAllTests();
}

module.exports = {
  BPlusTreeNode,
  BPlusTreeSimulator,
  CostBasedOptimizerSimulator,
  runAllTests,
};
