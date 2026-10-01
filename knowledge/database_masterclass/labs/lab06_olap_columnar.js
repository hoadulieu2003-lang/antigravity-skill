/**
 * ============================================================================
 * PHÒNG THÍ NGHIỆM & KIỂM THỬ KỸ THUẬT: OLAP & CƠ CHẾ LƯU TRỮ CỘT (LAB 06)
 * (TECHNICAL LAB & BENCHMARK: OLAP & COLUMNAR STORAGE ARCHITECTURE)
 * ============================================================================
 * 
 * Thuộc Chuỗi Masterclass: Kỹ Thuật Cơ Sở Dữ Liệu Chuyên Sâu (Database Engineering)
 * Chuyên gia Chủ quản: Pod 6 — Lead OLAP, Columnar Storage & Analytics Architect
 * 
 * Mô tả (Description):
 * File này triển khai thực hành 3 thành phần cốt lõi của một hệ thống OLAP hiện đại:
 * 1. ColumnarCompressionEngine:
 *    - Run-Length Encoding (RLE) cho cột có độ biến thiên thấp (Low-cardinality).
 *    - Gorilla Delta-of-Delta Compression cho cột chuỗi thời gian (Monotonic Timestamps).
 *    - Dictionary Encoding cho cột chuỗi ký tự (String/Categorical Columns).
 * 2. VectorizedExecutionSimulator:
 *    - Mô hình Volcano Iterator (Tuple-at-a-time) với chuỗi hàm ảo lặp.
 *    - Động cơ Vectorized Engine (Batch 1,024 elements + Selection Vectors + Loop Unrolling).
 *    - Đo lường và so sánh hiệu năng thực thi trên 1,000,000 dòng dữ liệu.
 * 3. SCDType2Pipeline:
 *    - Mô hình hóa Chiều Thay Đổi Chậm Loại 2 (Slowly Changing Dimension Type 2).
 *    - Tự động đóng bản ghi cũ (valid_to = event_time, is_current = false) và mở bản ghi mới.
 *    - Hỗ trợ Point-in-Time / As-Of historical queries và Audit Trail.
 * 4. Built-in Test Suite:
 *    - Kiểm thử tự động với Assertion độc lập, đo đạc tỷ lệ nén > 70%, Speedup >= 5x-10x.
 * 
 * Yêu cầu: Pure Node.js (Không dùng external npm packages).
 * Chạy trực tiếp: node lab06_olap_columnar.js
 * ============================================================================
 */

'use strict';

const { performance } = require('perf_hooks');
const assert = require('assert');

// ============================================================================
// ANSI Color Codes for Rich Terminal Output (Mã màu hiển thị Terminal)
// ============================================================================
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m',
};

// ============================================================================
// HỖ TRỢ BIT-LEVEL STREAM CHO THUẬT TOÁN GORILLA (BIT-LEVEL STREAM HELPERS)
// ============================================================================

/**
 * Lớp BitWriter: Ghi từng bit đơn lẻ hoặc chuỗi N-bits vào Buffer bộ nhớ liên tục.
 * (BitWriter: Writes variable-length bit sequences into an expanding contiguous memory Buffer).
 */
class BitWriter {
  constructor(initialCapacityBytes = 1024) {
    this.buffer = Buffer.alloc(initialCapacityBytes);
    this.bitPosition = 0; // Tổng số bits đã ghi (Total bits written)
  }

  _ensureCapacity(additionalBits) {
    const requiredBytes = Math.ceil((this.bitPosition + additionalBits) / 8);
    if (requiredBytes > this.buffer.length) {
      let newCapacity = Math.max(this.buffer.length * 2, requiredBytes);
      const newBuffer = Buffer.alloc(newCapacity);
      this.buffer.copy(newBuffer);
      this.buffer = newBuffer;
    }
  }

  /**
   * Ghi 1 bit đơn lẻ (0 hoặc 1)
   */
  writeBit(bit) {
    this._ensureCapacity(1);
    const byteIndex = Math.floor(this.bitPosition / 8);
    const bitOffset = 7 - (this.bitPosition % 8);
    if (bit) {
      this.buffer[byteIndex] |= (1 << bitOffset);
    } else {
      this.buffer[byteIndex] &= ~(1 << bitOffset);
    }
    this.bitPosition++;
  }

  /**
   * Ghi numBits từ giá trị nguyên (MSB first)
   */
  writeBits(value, numBits) {
    this._ensureCapacity(numBits);
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.writeBit(bit);
    }
  }

  /**
   * Ghi số nguyên có dấu 32-bit (Signed 32-bit Integer)
   */
  writeInt32(value) {
    const unsignedVal = value >>> 0;
    this.writeBits(unsignedVal >>> 16, 16);
    this.writeBits(unsignedVal & 0xFFFF, 16);
  }

  /**
   * Xuất Buffer đã được cắt gọn theo đúng số bytes thực sự sử dụng
   */
  getBuffer() {
    const usedBytes = Math.ceil(this.bitPosition / 8);
    return this.buffer.subarray(0, usedBytes);
  }

  get totalBits() {
    return this.bitPosition;
  }
}

/**
 * Lớp BitReader: Đọc từng bit hoặc N-bits từ Buffer nén Gorilla.
 * (BitReader: Reads variable-length bit sequences from a compressed Buffer).
 */
class BitReader {
  constructor(buffer) {
    this.buffer = buffer;
    this.bitPosition = 0;
    this.totalBits = buffer.length * 8;
  }

  readBit() {
    if (this.bitPosition >= this.totalBits) {
      throw new Error(`[BitReader] Đọc vượt quá độ dài bitstream (Bitstream EOF reached at bit ${this.bitPosition})`);
    }
    const byteIndex = Math.floor(this.bitPosition / 8);
    const bitOffset = 7 - (this.bitPosition % 8);
    const bit = (this.buffer[byteIndex] >> bitOffset) & 1;
    this.bitPosition++;
    return bit;
  }

  readBits(numBits) {
    let result = 0;
    for (let i = 0; i < numBits; i++) {
      result = (result << 1) | this.readBit();
    }
    return result;
  }

  readInt32() {
    const high = this.readBits(16);
    const low = this.readBits(16);
    return (high << 16) | low;
  }
}

// ============================================================================
// 1. CLASS: ColumnarCompressionEngine (Động cơ Nén Dữ Liệu Dạng Cột)
// ============================================================================

/**
 * Động cơ Nén Dạng Cột chuyên sâu (Columnar Compression Engine):
 * Triển khai các giải thuật nén chuẩn công nghiệp:
 * - Run-Length Encoding (RLE): Nén dữ liệu lặp liên tiếp
 * - Gorilla Delta-of-Delta: Nén chuỗi thời gian (Timestamps) chuẩn Facebook TSDB
 * - Dictionary Encoding: Nén cột chuỗi ký tự phân loại (Categorical Strings)
 */
class ColumnarCompressionEngine {

  /**
   * Tính toán tỷ lệ nén (Calculate Compression Ratio & Space Savings)
   * @param {number} originalBytes - Dung lượng gốc
   * @param {number} compressedBytes - Dung lượng sau nén
   */
  static calculateMetrics(originalBytes, compressedBytes) {
    const savingsPercent = originalBytes > 0
      ? ((1 - compressedBytes / originalBytes) * 100)
      : 0;
    const compressionFactor = compressedBytes > 0
      ? (originalBytes / compressedBytes)
      : 1;

    return {
      originalBytes,
      compressedBytes,
      savingsPercent: Number(savingsPercent.toFixed(2)),
      compressionFactor: Number(compressionFactor.toFixed(2))
    };
  }

  // --------------------------------------------------------------------------
  // A. RUN-LENGTH ENCODING (RLE)
  // --------------------------------------------------------------------------

  /**
   * Nén mảng dữ liệu bằng Run-Length Encoding (RLE)
   * Nhóm các chuỗi phần tử lặp liên tiếp thành [value, count].
   * @param {Array<any>} data - Mảng dữ liệu đầu vào
   * @returns {Object} Dữ liệu đã nén kèm metadata
   */
  static compressRLE(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { runs: [], totalRows: 0, originalBytes: 0, compressedBytes: 0, metrics: null };
    }

    const runs = [];
    let currentValue = data[0];
    let currentCount = 1;
    let approxOriginalBytes = 0;

    // Đo đạc dung lượng gốc ước tính (Estimated original size)
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (typeof item === 'string') {
        approxOriginalBytes += Buffer.byteLength(item, 'utf8') + 4; // UTF-8 bytes + 4 bytes pointer
      } else if (typeof item === 'number') {
        approxOriginalBytes += 8; // Float64 / Int64 = 8 bytes
      } else {
        approxOriginalBytes += 8;
      }
    }

    // Tiến hành mã hóa Run-Length
    for (let i = 1; i < data.length; i++) {
      if (data[i] === currentValue) {
        currentCount++;
      } else {
        runs.push({ value: currentValue, count: currentCount });
        currentValue = data[i];
        currentCount = 1;
      }
    }
    runs.push({ value: currentValue, count: currentCount });

    // Đo đạc dung lượng nén ước tính (Mỗi cặp run: 1 giá trị + 4 bytes integer count)
    let approxCompressedBytes = 0;
    for (let i = 0; i < runs.length; i++) {
      const val = runs[i].value;
      const valSize = typeof val === 'string' ? Buffer.byteLength(val, 'utf8') : 8;
      approxCompressedBytes += valSize + 4; // value + 4-byte count
    }

    const metrics = this.calculateMetrics(approxOriginalBytes, approxCompressedBytes);

    return {
      type: 'RLE',
      runs,
      totalRows: data.length,
      originalBytes: approxOriginalBytes,
      compressedBytes: approxCompressedBytes,
      metrics
    };
  }

  /**
   * Giải nén RLE khôi phục mảng ban đầu (Lossless Decompression)
   * @param {Object} compressed - Đối tượng nén RLE
   * @returns {Array<any>} Mảng dữ liệu khôi phục 100% nguyên vẹn
   */
  static decompressRLE(compressed) {
    if (!compressed || !Array.isArray(compressed.runs)) {
      return [];
    }

    const result = new Array(compressed.totalRows);
    let targetIdx = 0;

    for (let r = 0; r < compressed.runs.length; r++) {
      const { value, count } = compressed.runs[r];
      for (let c = 0; c < count; c++) {
        result[targetIdx++] = value;
      }
    }

    return result;
  }

  // --------------------------------------------------------------------------
  // B. DELTA-OF-DELTA GORILLA ENCODING (TIMESTAMPS COMPRESSION)
  // --------------------------------------------------------------------------

  /**
   * Nén chuỗi thời gian tăng đơn điệu theo thuật toán Gorilla Delta-of-Delta
   * Tham chiếu: Facebook VLDB 2015 "Gorilla: A Fast, Scalable, In-Memory Time Series Database"
   * @param {Array<number>} timestamps - Mảng timestamps (milliseconds hoặc seconds)
   * @returns {Object} Buffer nhị phân nén và thông số tỷ lệ nén
   */
  static compressDeltaOfDelta(timestamps) {
    if (!Array.isArray(timestamps) || timestamps.length === 0) {
      return { buffer: Buffer.alloc(0), count: 0, originalBytes: 0, compressedBytes: 0, metrics: null };
    }

    const originalBytes = timestamps.length * 8; // 64-bit integer timestamp = 8 bytes
    const writer = new BitWriter(Math.max(1024, Math.ceil(timestamps.length / 2)));

    // 1. Header: Ghi số lượng phần tử (32-bit count)
    writer.writeInt32(timestamps.length);

    // 2. Ghi T0 (Timestamp đầu tiên) dưới dạng 64-bit BigInt (2 x 32-bit words)
    const t0 = BigInt(timestamps[0]);
    writer.writeInt32(Number((t0 >> 32n) & 0xFFFFFFFFn));
    writer.writeInt32(Number(t0 & 0xFFFFFFFFn));

    if (timestamps.length === 1) {
      const buf = writer.getBuffer();
      return {
        type: 'GORILLA_DELTA_OF_DELTA',
        buffer: buf,
        count: 1,
        originalBytes,
        compressedBytes: buf.length,
        metrics: this.calculateMetrics(originalBytes, buf.length)
      };
    }

    // 3. Ghi D0 = T1 - T0 (Delta đầu tiên) dưới dạng 32-bit signed integer
    const d0 = Number(BigInt(timestamps[1]) - t0);
    writer.writeInt32(d0);

    let prevDelta = d0;
    let prevTimestamp = BigInt(timestamps[1]);

    // 4. Mã hóa Delta-of-Delta (DOD) cho các mốc thời gian tiếp theo
    for (let i = 2; i < timestamps.length; i++) {
      const currTimestamp = BigInt(timestamps[i]);
      const currDelta = Number(currTimestamp - prevTimestamp);
      const dod = currDelta - prevDelta; // Delta-of-Delta

      if (dod === 0) {
        // Trường hợp lý tưởng: Timestamps cách đều hoàn hảo (DOD = 0) -> Ghi đúng 1 bit '0'
        writer.writeBit(0);
      } else if (dod >= -63 && dod <= 64) {
        // Biến thiên nhỏ (7 bits): Ghi tiền tố '10' + 7 bits dữ liệu (offset + 63)
        writer.writeBit(1);
        writer.writeBit(0);
        writer.writeBits(dod + 63, 7);
      } else if (dod >= -255 && dod <= 256) {
        // Biến thiên vừa (9 bits): Ghi tiền tố '110' + 9 bits dữ liệu (offset + 255)
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeBit(0);
        writer.writeBits(dod + 255, 9);
      } else if (dod >= -2047 && dod <= 2048) {
        // Biến thiên lớn (12 bits): Ghi tiền tố '1110' + 12 bits dữ liệu (offset + 2047)
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeBit(0);
        writer.writeBits(dod + 2047, 12);
      } else {
        // Biến thiên cực lớn: Ghi tiền tố '1111' + 32 bits signed integer
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeBit(1);
        writer.writeInt32(dod);
      }

      prevDelta = currDelta;
      prevTimestamp = currTimestamp;
    }

    const compressedBuffer = writer.getBuffer();
    const compressedBytes = compressedBuffer.length;
    const metrics = this.calculateMetrics(originalBytes, compressedBytes);

    return {
      type: 'GORILLA_DELTA_OF_DELTA',
      buffer: compressedBuffer,
      count: timestamps.length,
      originalBytes,
      compressedBytes,
      metrics
    };
  }

  /**
   * Giải nén chuỗi thời gian Gorilla Delta-of-Delta khôi phục mảng ban đầu
   * @param {Buffer} buffer - Buffer nhị phân chứa bitstream nén Gorilla
   * @returns {Array<number>} Mảng timestamps khôi phục nguyên vẹn 100%
   */
  static decompressDeltaOfDelta(buffer) {
    if (!buffer || buffer.length === 0) return [];

    const reader = new BitReader(buffer);
    const count = reader.readInt32();
    if (count === 0) return [];

    // Đọc T0
    const highT0 = reader.readInt32();
    const lowT0 = reader.readInt32();
    const t0 = (BigInt(highT0) << 32n) | BigInt(lowT0 >>> 0);

    const result = new Array(count);
    result[0] = Number(t0);
    if (count === 1) return result;

    // Đọc D0
    const d0 = reader.readInt32();
    let prevDelta = d0;
    let prevTimestamp = t0 + BigInt(d0);
    result[1] = Number(prevTimestamp);

    // Giải mã từng Delta-of-Delta
    for (let i = 2; i < count; i++) {
      const bit0 = reader.readBit();
      let dod = 0;

      if (bit0 === 0) {
        // Bit '0' => dod = 0
        dod = 0;
      } else {
        const bit1 = reader.readBit();
        if (bit1 === 0) {
          // '10' => 7 bits
          const bits = reader.readBits(7);
          dod = bits - 63;
        } else {
          const bit2 = reader.readBit();
          if (bit2 === 0) {
            // '110' => 9 bits
            const bits = reader.readBits(9);
            dod = bits - 255;
          } else {
            const bit3 = reader.readBit();
            if (bit3 === 0) {
              // '1110' => 12 bits
              const bits = reader.readBits(12);
              dod = bits - 2047;
            } else {
              // '1111' => 32 bits
              dod = reader.readInt32();
            }
          }
        }
      }

      const currDelta = prevDelta + dod;
      const currTimestamp = prevTimestamp + BigInt(currDelta);
      result[i] = Number(currTimestamp);

      prevDelta = currDelta;
      prevTimestamp = currTimestamp;
    }

    return result;
  }

  // --------------------------------------------------------------------------
  // C. DICTIONARY ENCODING (MÃ HÓA TỪ ĐIỂN CỘT CHUỖI)
  // --------------------------------------------------------------------------

  /**
   * Mã hóa cột chuỗi bằng Dictionary Encoding
   * Trích xuất bảng từ điển phân biệt và chuyển mảng chuỗi thành mảng chỉ mục số nguyên nhỏ gọn.
   * @param {Array<string>} stringArray - Mảng chuỗi ký tự
   * @returns {Object} Từ điển, mảng index dạng TypedArray và metrics nén
   */
  static compressDictionary(stringArray) {
    if (!Array.isArray(stringArray) || stringArray.length === 0) {
      return { dictionary: [], indices: new Uint8Array(0), originalBytes: 0, compressedBytes: 0, metrics: null };
    }

    const dictMap = new Map();
    const dictionary = [];
    let approxOriginalBytes = 0;

    // Xây dựng từ điển (Extract distinct entries)
    for (let i = 0; i < stringArray.length; i++) {
      const str = stringArray[i];
      approxOriginalBytes += Buffer.byteLength(str, 'utf8') + 4; // Ký tự UTF-8 + con trỏ 4 bytes
      if (!dictMap.has(str)) {
        dictMap.set(str, dictionary.length);
        dictionary.push(str);
      }
    }

    const numDistinct = dictionary.length;
    let indices;
    let bytesPerIndex = 1;

    // Tối ưu hóa kích thước kiểu dữ liệu chỉ mục (Adaptive Index TypedArray)
    if (numDistinct <= 256) {
      indices = new Uint8Array(stringArray.length);
      bytesPerIndex = 1;
    } else if (numDistinct <= 65536) {
      indices = new Uint16Array(stringArray.length);
      bytesPerIndex = 2;
    } else {
      indices = new Int32Array(stringArray.length);
      bytesPerIndex = 4;
    }

    // Ánh xạ chuỗi sang số nguyên
    for (let i = 0; i < stringArray.length; i++) {
      indices[i] = dictMap.get(stringArray[i]);
    }

    // Tính toán dung lượng nén: Dung lượng bảng từ điển + mảng chỉ mục TypedArray
    let dictionaryBytes = 0;
    for (let i = 0; i < dictionary.length; i++) {
      dictionaryBytes += Buffer.byteLength(dictionary[i], 'utf8') + 4;
    }
    const indicesBytes = indices.byteLength;
    const totalCompressedBytes = dictionaryBytes + indicesBytes;

    const metrics = this.calculateMetrics(approxOriginalBytes, totalCompressedBytes);

    return {
      type: 'DICTIONARY',
      dictionary,
      indices,
      distinctCount: numDistinct,
      bytesPerIndex,
      originalBytes: approxOriginalBytes,
      compressedBytes: totalCompressedBytes,
      metrics
    };
  }

  /**
   * Giải mã Dictionary Encoding khôi phục mảng chuỗi ban đầu
   * @param {Object} compressed - Đối tượng nén gồm dictionary và indices
   * @returns {Array<string>} Mảng chuỗi khôi phục nguyên vẹn 100%
   */
  static decompressDictionary(compressed) {
    if (!compressed || !Array.isArray(compressed.dictionary) || !compressed.indices) {
      return [];
    }

    const { dictionary, indices } = compressed;
    const length = indices.length;
    const result = new Array(length);

    for (let i = 0; i < length; i++) {
      result[i] = dictionary[indices[i]];
    }

    return result;
  }
}

// ============================================================================
// 2. CLASS: VectorizedExecutionSimulator (Mô Phỏng Động Cơ Vector Hóa vs Volcano)
// ============================================================================

/**
 * ----------------------------------------------------------------------------
 * KIẾN TRÚC VOLCANO ITERATOR (TUPLE-AT-A-TIME)
 * ----------------------------------------------------------------------------
 * Mô hình kinh điển (Goetz Graefe 1990 / 1994 / PostgreSQL Executor):
 * Mỗi toán tử (Operator) kế thừa interface chuẩn: open(), next(), close().
 * Phương thức next() trả về đúng 1 Tuple đơn lẻ.
 * Điểm nghẽn:
 * - Hàng triệu lời gọi hàm ảo (Virtual Function Calls) trên mỗi truy vấn.
 * - Phá vỡ Instruction Pipeline và Branch Predictor của CPU.
 * - Cấp phát và nạp đối tượng bản ghi (Row Object) gây tràn L1/L2 Data Cache.
 */
class VolcanoTuple {
  constructor(fields) {
    this.fields = fields; // Array of columns: [id, status_id, amount, region_id]
  }
  get(index) {
    return this.fields[index];
  }
}

class VolcanoContext {
  constructor() {
    this.tuplesScanned = 0;
    this.virtualCalls = 0;
  }
}

class VolcanoOperator {
  open() {}
  next(ctx) { throw new Error('Abstract method'); }
  close() {}
}

class VolcanoSeqScan extends VolcanoOperator {
  constructor(tuples) {
    super();
    this.tuples = tuples;
    this.cursor = 0;
  }
  next(ctx) {
    ctx.virtualCalls++;
    if (this.cursor >= this.tuples.length) return null;
    ctx.tuplesScanned++;
    return this.tuples[this.cursor++];
  }
}

class VolcanoFilter extends VolcanoOperator {
  constructor(child, predicateFn) {
    super();
    this.child = child;
    this.predicateFn = predicateFn;
  }
  next(ctx) {
    let tuple;
    while ((tuple = this.child.next(ctx)) !== null) {
      ctx.virtualCalls++;
      if (this.predicateFn(tuple)) {
        return tuple;
      }
    }
    return null;
  }
}

class VolcanoProject extends VolcanoOperator {
  constructor(child, indices) {
    super();
    this.child = child;
    this.indices = indices;
  }
  next(ctx) {
    ctx.virtualCalls++;
    const tuple = this.child.next(ctx);
    if (!tuple) return null;
    const projected = new Array(this.indices.length);
    for (let i = 0; i < this.indices.length; i++) {
      projected[i] = tuple.get(this.indices[i]);
    }
    return new VolcanoTuple(projected);
  }
}

class VolcanoAggregate extends VolcanoOperator {
  constructor(child, colIdx = 0) {
    super();
    this.child = child;
    this.colIdx = colIdx;
  }
  execute(ctx) {
    let sum = 0.0;
    let count = 0;
    let tuple;
    while ((tuple = this.child.next(ctx)) !== null) {
      ctx.virtualCalls++;
      sum += tuple.get(this.colIdx);
      count++;
    }
    return {
      sum: Number(sum.toFixed(4)),
      count,
      avg: count > 0 ? Number((sum / count).toFixed(4)) : 0,
      virtualCalls: ctx.virtualCalls
    };
  }
}

/**
 * ----------------------------------------------------------------------------
 * KIẾN TRÚC VECTORIZED ENGINE (BATCH-AT-A-TIME / DATACHUNK)
 * ----------------------------------------------------------------------------
 * Mô hình hiện đại (DuckDB / ClickHouse / Apache Arrow):
 * Dữ liệu được tổ chức theo từng Cột (Column Vectors) sử dụng Flat TypedArrays.
 * Xử lý theo lô (DataChunk, mặc định 1,024 dòng).
 * Sử dụng Selection Vector (Int32Array) để lọc dữ liệu không cần copy hay tạo Object.
 * Tận dụng triệt để:
 * - Vòng lặp chặt chẽ (Tight Loops) tối ưu Cache Locality.
 * - Kỹ thuật Mở vòng lặp (8x Loop Unrolling) khai thác Instruction-Level Parallelism (ILP).
 * - Zero Allocation trong suốt quá trình quét.
 */
class ColumnarBatchDataset {
  constructor(numRows) {
    this.numRows = numRows;
    this.ids = new Int32Array(numRows);
    this.statusIds = new Int32Array(numRows);
    this.amounts = new Float64Array(numRows);
    this.regionIds = new Int32Array(numRows);
  }
}

class VectorizedExecutionSimulator {
  constructor() {
    this.DEFAULT_BATCH_SIZE = 1024;
  }

  /**
   * Sinh dữ liệu mẫu thử nghiệm 1,000,000 dòng cho cả hai mô hình (Row-Store & Column-Store)
   * @param {number} numRows - Số dòng dữ liệu (mặc định 1,000,000)
   */
  static generateDatasets(numRows = 1000000) {
    const rowTuples = new Array(numRows);
    const colData = new ColumnarBatchDataset(numRows);

    for (let i = 0; i < numRows; i++) {
      const id = i;
      const statusId = (i % 5) + 1; // 1 to 5 (status_id = 2 chiếm 20%)
      const amount = (i % 100) + 0.5; // 0.5 to 99.5 (amount > 50 chiếm 50%)
      const regionId = i % 10;

      // Dataset 1: Row-Store (Dành cho Volcano Iterator)
      rowTuples[i] = new VolcanoTuple([id, statusId, amount, regionId]);

      // Dataset 2: Column-Store (Dành cho Vectorized Batch Engine)
      colData.ids[i] = id;
      colData.statusIds[i] = statusId;
      colData.amounts[i] = amount;
      colData.regionIds[i] = regionId;
    }

    return { rowTuples, colData, numRows };
  }

  /**
   * Thực thi truy vấn bằng mô hình Volcano Iterator:
   * SQL: SELECT SUM(amount), AVG(amount), COUNT(*) FROM transactions WHERE status_id = 2 AND amount > 50.0;
   * @param {Array<VolcanoTuple>} rowTuples - Danh sách các Tuple
   */
  static runVolcanoPipeline(rowTuples) {
    const ctx = new VolcanoContext();
    const scan = new VolcanoSeqScan(rowTuples);
    // Filter Operator
    const filter = new VolcanoFilter(scan, (t) => t.get(1) === 2 && t.get(2) > 50.0);
    // Project Operator (chiếu cột amount tại index 2 thành cột 0)
    const project = new VolcanoProject(filter, [2]);
    // Aggregate Operator
    const agg = new VolcanoAggregate(project, 0);

    const startTime = performance.now();
    const result = agg.execute(ctx);
    const executionTimeMs = performance.now() - startTime;

    return {
      engine: 'Volcano (Tuple-at-a-time)',
      ...result,
      executionTimeMs: Number(executionTimeMs.toFixed(3))
    };
  }

  /**
   * Thực thi truy vấn bằng mô hình Vectorized Batch Execution:
   * SQL: SELECT SUM(amount), AVG(amount), COUNT(*) FROM transactions WHERE status_id = 2 AND amount > 50.0;
   * @param {ColumnarBatchDataset} colData - Dữ liệu dạng cột TypedArray
   * @param {number} batchSize - Kích thước Vector Batch (mặc định 1024)
   * @param {Int32Array} sharedSelVector - Selection Vector tái sử dụng
   */
  static runVectorizedPipeline(colData, batchSize = 1024, sharedSelVector = null) {
    const numRows = colData.numRows;
    const numBatches = Math.ceil(numRows / batchSize);
    const statusArray = colData.statusIds;
    const amountArray = colData.amounts;

    // Cấp phát Selection Vector tái sử dụng duy nhất 1 lần (Zero Allocation)
    const selectionVector = sharedSelVector || new Int32Array(batchSize);

    let totalSum = 0.0;
    let totalCount = 0;

    const startTime = performance.now();

    // Vòng lặp duyệt qua các Batch (DataChunk Vector Processing)
    for (let b = 0; b < numBatches; b++) {
      const batchOffset = b * batchSize;
      const batchLimit = Math.min(batchSize, numRows - batchOffset);

      // 1. Vector Filter: Xây dựng Selection Vector chứa các chỉ mục toàn cục thỏa mãn
      let selectedCount = 0;
      for (let i = 0; i < batchLimit; i++) {
        const globalIdx = batchOffset + i;
        if (statusArray[globalIdx] === 2 && amountArray[globalIdx] > 50.0) {
          selectionVector[selectedCount++] = globalIdx;
        }
      }

      // 2. Vector Aggregate: Tính toán trên Selection Vector với Loop Unrolling 8x
      let batchSum = 0.0;
      let i = 0;
      const unrollLimit = selectedCount - 7;

      // Khai thác Instruction-Level Parallelism (ILP / SIMD-style emulation)
      for (; i < unrollLimit; i += 8) {
        batchSum += amountArray[selectionVector[i]] +
                    amountArray[selectionVector[i + 1]] +
                    amountArray[selectionVector[i + 2]] +
                    amountArray[selectionVector[i + 3]] +
                    amountArray[selectionVector[i + 4]] +
                    amountArray[selectionVector[i + 5]] +
                    amountArray[selectionVector[i + 6]] +
                    amountArray[selectionVector[i + 7]];
      }
      // Xử lý các phần tử dư còn lại
      for (; i < selectedCount; i++) {
        batchSum += amountArray[selectionVector[i]];
      }

      totalSum += batchSum;
      totalCount += selectedCount;
    }

    const executionTimeMs = performance.now() - startTime;
    const totalAvg = totalCount > 0 ? totalSum / totalCount : 0;

    return {
      engine: 'Vectorized (Batch-at-a-time + Selection Vector)',
      sum: Number(totalSum.toFixed(4)),
      count: totalCount,
      avg: Number(totalAvg.toFixed(4)),
      batchSize,
      batchesProcessed: numBatches,
      executionTimeMs: Number(executionTimeMs.toFixed(3))
    };
  }

  /**
   * So sánh thực nghiệm trực tiếp giữa Volcano và Vectorized Engine với Warm-up và Multi-run Median
   * @param {number} numRows - Số dòng dữ liệu (1,000,000)
   * @param {number} runs - Số lần đo để lấy trung vị (mặc định 3)
   */
  static benchmark(numRows = 1000000, runs = 3) {
    const { rowTuples, colData } = this.generateDatasets(numRows);
    const sharedSelVector = new Int32Array(1024);

    // Warm-up JIT Compiler (Khởi động V8 JIT để đạt trạng thái biên dịch tối ưu)
    for (let w = 0; w < 2; w++) {
      this.runVolcanoPipeline(rowTuples);
      this.runVectorizedPipeline(colData, 1024, sharedSelVector);
    }

    const volcanoResults = [];
    const vectorizedResults = [];

    // Chạy nhiều lần đo để khử nhiễu Garbage Collection (GC jitter)
    for (let r = 0; r < runs; r++) {
      volcanoResults.push(this.runVolcanoPipeline(rowTuples));
      vectorizedResults.push(this.runVectorizedPipeline(colData, 1024, sharedSelVector));
    }

    // Sắp xếp và lấy giá trị trung vị (Median / Best run)
    volcanoResults.sort((a, b) => a.executionTimeMs - b.executionTimeMs);
    vectorizedResults.sort((a, b) => a.executionTimeMs - b.executionTimeMs);

    const midIdx = Math.floor(runs / 2);
    const bestVolcano = volcanoResults[midIdx];
    const bestVectorized = vectorizedResults[midIdx];

    const speedup = Number((bestVolcano.executionTimeMs / bestVectorized.executionTimeMs).toFixed(2));

    return {
      volcano: bestVolcano,
      vectorized: bestVectorized,
      allVolcanoTimes: volcanoResults.map((r) => r.executionTimeMs),
      allVectorizedTimes: vectorizedResults.map((r) => r.executionTimeMs),
      speedupFactor: speedup,
      accuracyCheck: {
        sumMatches: Math.abs(bestVolcano.sum - bestVectorized.sum) < 1e-4,
        countMatches: bestVolcano.count === bestVectorized.count,
        avgMatches: Math.abs(bestVolcano.avg - bestVectorized.avg) < 1e-4
      }
    };
  }
}

// ============================================================================
// 3. CLASS: SCDType2Pipeline (Pipeline Chiều Thay Đổi Chậm Loại 2 - SCD Type 2)
// ============================================================================

/**
 * Pipeline Xử lý Dimension Table theo chuẩn Slowly Changing Dimension Type 2 (SCD Type 2):
 * Đảm bảo:
 * - Bảo toàn 100% lịch sử biến đổi của từng thực thể (Full Historical Audit Trail).
 * - Sử dụng Surrogate Key (Khóa đại diện nhân tạo tăng đơn điệu) phân biệt các phiên bản.
 * - Tự động đóng bản ghi cũ: valid_to = event_time, is_current = false.
 * - Tự động chèn bản ghi mới: valid_from = event_time, valid_to = null, is_current = true, version++.
 * - Cung cấp hàm truy vấn lịch sử tại bất kỳ thời điểm nào trong quá khứ (As-Of / Point-in-Time Query).
 */
class SCDType2Pipeline {
  constructor(dimensionName = 'dim_customer') {
    this.dimensionName = dimensionName;
    this.dimensionTable = []; // Danh sách toàn bộ các bản ghi lịch sử
    this.currentIndex = new Map(); // Business Key (customer_id) -> Tham chiếu bản ghi hiện tại
    this.surrogateKeySequence = 0;
  }

  /**
   * Xử lý 1 sự kiện thay đổi dữ liệu (Ingest CDC / Dimension Change Event)
   * @param {Object} event - Sự kiện chứa customer_id, event_time và các thuộc tính nghiệp vụ
   */
  ingest(event) {
    if (!event || !event.customer_id || event.event_time === undefined) {
      throw new Error(`[SCDType2Pipeline] Event không hợp lệ (Missing customer_id or event_time)`);
    }

    const { customer_id, event_time, ...businessAttrs } = event;
    const currentRecord = this.currentIndex.get(customer_id);

    // TH 1: Bản ghi mới xuất hiện lần đầu tiên (Initial Insert)
    if (!currentRecord) {
      const newSurrogateKey = ++this.surrogateKeySequence;
      const initialRecord = {
        surrogate_key: newSurrogateKey,
        customer_id,
        ...businessAttrs,
        valid_from: event_time,
        valid_to: null,
        is_current: true,
        version: 1
      };

      this.dimensionTable.push(initialRecord);
      this.currentIndex.set(customer_id, initialRecord);

      return {
        action: 'INSERT_INITIAL',
        surrogate_key: newSurrogateKey,
        customer_id,
        version: 1,
        valid_from: event_time
      };
    }

    // TH 2: Bản ghi đã tồn tại -> Kiểm tra xem các thuộc tính nghiệp vụ có thay đổi không
    let hasAttributeChanged = false;
    const changedFields = [];

    for (const key of Object.keys(businessAttrs)) {
      if (currentRecord[key] !== businessAttrs[key]) {
        hasAttributeChanged = true;
        changedFields.push({ field: key, oldValue: currentRecord[key], newValue: businessAttrs[key] });
      }
    }

    // Nếu dữ liệu không thay đổi -> Thao tác no-op (Idempotent)
    if (!hasAttributeChanged) {
      return {
        action: 'NOOP',
        customer_id,
        surrogate_key: currentRecord.surrogate_key,
        version: currentRecord.version,
        message: 'Không có thuộc tính nào thay đổi (No attributes modified)'
      };
    }

    // TH 3: Phát hiện dữ liệu thay đổi -> Tiến hành chuyển đổi SCD Type 2
    // Bước 1: Đóng phiên bản hiện tại (Close active record)
    currentRecord.valid_to = event_time;
    currentRecord.is_current = false;

    // Bước 2: Tạo phiên bản mới (Insert new active record)
    const newSurrogateKey = ++this.surrogateKeySequence;
    const nextVersion = currentRecord.version + 1;

    const newRecord = {
      surrogate_key: newSurrogateKey,
      customer_id,
      ...businessAttrs,
      valid_from: event_time,
      valid_to: null,
      is_current: true,
      version: nextVersion
    };

    this.dimensionTable.push(newRecord);
    this.currentIndex.set(customer_id, newRecord);

    return {
      action: 'SCD2_TRANSITION',
      customer_id,
      closed_surrogate_key: currentRecord.surrogate_key,
      new_surrogate_key: newSurrogateKey,
      version: nextVersion,
      valid_from: event_time,
      changedFields
    };
  }

  /**
   * Xử lý nạp mẻ nhiều sự kiện theo thứ tự thời gian
   * @param {Array<Object>} events - Mảng các events
   */
  ingestBatch(events) {
    if (!Array.isArray(events)) return [];
    // Đảm bảo events được sắp xếp tăng dần theo event_time
    const sorted = [...events].sort((a, b) => a.event_time - b.event_time);
    return sorted.map((evt) => this.ingest(evt));
  }

  /**
   * Truy vấn bản ghi hiện tại (Get Current Active Record)
   * @param {string} customerId - Mã khách hàng
   */
  getCurrent(customerId) {
    return this.currentIndex.get(customerId) || null;
  }

  /**
   * Truy vấn trạng thái tại một mốc thời gian lịch sử bất kỳ (Point-in-Time / As-Of Query)
   * SQL tương đương:
   * SELECT * FROM dim_customer
   * WHERE customer_id = @id AND valid_from <= @asOfTime AND (valid_to IS NULL OR valid_to > @asOfTime);
   * @param {string} customerId - Mã khách hàng
   * @param {number} asOfTimestamp - Mốc thời gian truy vấn
   */
  queryAsOf(customerId, asOfTimestamp) {
    for (let i = 0; i < this.dimensionTable.length; i++) {
      const rec = this.dimensionTable[i];
      if (rec.customer_id === customerId) {
        const isEffective = rec.valid_from <= asOfTimestamp;
        const isNotExpired = rec.valid_to === null || rec.valid_to > asOfTimestamp;
        if (isEffective && isNotExpired) {
          return rec;
        }
      }
    }
    return null;
  }

  /**
   * Lấy toàn bộ lịch sử biến đổi của khách hàng theo thứ tự phiên bản (Audit Trail)
   * @param {string} customerId - Mã khách hàng
   */
  getHistory(customerId) {
    return this.dimensionTable
      .filter((r) => r.customer_id === customerId)
      .sort((a, b) => a.version - b.version);
  }

  /**
   * Thống kê tổng số bản ghi trong bảng Dimension
   */
  getStatistics() {
    let activeCount = 0;
    let historicalCount = 0;
    for (let i = 0; i < this.dimensionTable.length; i++) {
      if (this.dimensionTable[i].is_current) activeCount++;
      else historicalCount++;
    }
    return {
      tableName: this.dimensionName,
      totalRecords: this.dimensionTable.length,
      activeEntities: activeCount,
      historicalVersions: historicalCount
    };
  }
}

// ============================================================================
// 4. BUILT-IN AUTOMATED TEST SUITE (BỘ KIỂM THỬ TỰ ĐỘNG)
// ============================================================================

/**
 * Trình chạy Kiểm thử Tự Động (Built-in Test Runner)
 */
class BuiltInTestSuite {

  static printHeader(title) {
    console.log(`\n${Colors.cyan}${Colors.bright}==============================================================================${Colors.reset}`);
    console.log(`${Colors.cyan}${Colors.bright}  ${title}${Colors.reset}`);
    console.log(`${Colors.cyan}${Colors.bright}==============================================================================${Colors.reset}`);
  }

  static printSubHeader(subtitle) {
    console.log(`\n${Colors.yellow}--- ${subtitle} ---${Colors.reset}`);
  }

  /**
   * TEST 1: Kiểm thử các giải thuật nén dữ liệu dạng cột (RLE, Gorilla, Dictionary)
   * Điều kiện đạt: Tỷ lệ nén > 70% và Khôi phục 100% nguyên vẹn (Lossless).
   */
  static runTest1_ColumnarCompression() {
    this.printSubHeader('TEST 1: COLUMNAR COMPRESSION ALGORITHMS (RLE, GORILLA, DICTIONARY)');

    // 1A. Run-Length Encoding (RLE) Test
    console.log(`${Colors.bright}[1A] Testing Run-Length Encoding (RLE)...${Colors.reset}`);
    const rleInput = [];
    const sampleStatuses = ['SUCCESS', 'PENDING', 'PROCESSING', 'FAILED', 'CANCELLED'];
    const runLengths = [15000, 20000, 10000, 4000, 1000]; // 50,000 dòng có phân cụm lớn
    for (let i = 0; i < sampleStatuses.length; i++) {
      for (let j = 0; j < runLengths[i]; j++) {
        rleInput.push(sampleStatuses[i]);
      }
    }

    const rleCompressed = ColumnarCompressionEngine.compressRLE(rleInput);
    const rleDecompressed = ColumnarCompressionEngine.decompressRLE(rleCompressed);

    assert.strictEqual(rleDecompressed.length, rleInput.length, 'RLE: Độ dài giải nén không khớp');
    for (let i = 0; i < rleInput.length; i++) {
      if (rleInput[i] !== rleDecompressed[i]) {
        throw new Error(`RLE: Sai lệch dữ liệu tại chỉ mục ${i}`);
      }
    }
    const rleSavings = rleCompressed.metrics.savingsPercent;
    console.log(`  -> Dung lượng gốc:       ${rleCompressed.originalBytes.toLocaleString()} bytes`);
    console.log(`  -> Dung lượng sau nén:   ${rleCompressed.compressedBytes.toLocaleString()} bytes`);
    console.log(`  -> Tỷ lệ tiết kiệm RLE:  ${Colors.green}${Colors.bright}${rleSavings}%${Colors.reset} (Hệ số nén: ${rleCompressed.metrics.compressionFactor}x)`);
    assert(rleSavings >= 70.0, `RLE thất bại: Tỷ lệ tiết kiệm ${rleSavings}% < 70%`);

    // 1B. Gorilla Delta-of-Delta Test
    console.log(`\n${Colors.bright}[1B] Testing Gorilla Delta-of-Delta Timestamps Compression...${Colors.reset}`);
    const N_TIMESTAMPS = 100000;
    const baseTime = 1704067200000; // 2024-01-01T00:00:00Z
    const timestamps = new Array(N_TIMESTAMPS);
    let curTime = baseTime;

    // Sinh chuỗi timestamps cách nhau trung bình 1,000ms có dao động nhẹ (Jitter +- 5ms)
    for (let i = 0; i < N_TIMESTAMPS; i++) {
      const jitter = (i % 8 === 0) ? ((i % 3) - 1) * 3 : 0;
      curTime += 1000 + jitter;
      timestamps[i] = curTime;
    }

    const gorillaCompressed = ColumnarCompressionEngine.compressDeltaOfDelta(timestamps);
    const gorillaDecompressed = ColumnarCompressionEngine.decompressDeltaOfDelta(gorillaCompressed.buffer);

    assert.strictEqual(gorillaDecompressed.length, timestamps.length, 'Gorilla: Độ dài giải nén không khớp');
    for (let i = 0; i < timestamps.length; i++) {
      if (timestamps[i] !== gorillaDecompressed[i]) {
        throw new Error(`Gorilla: Sai lệch timestamp tại dòng ${i}: gốc ${timestamps[i]} vs giải nén ${gorillaDecompressed[i]}`);
      }
    }
    const gorillaSavings = gorillaCompressed.metrics.savingsPercent;
    console.log(`  -> Dung lượng gốc:       ${gorillaCompressed.originalBytes.toLocaleString()} bytes`);
    console.log(`  -> Dung lượng sau nén:   ${gorillaCompressed.compressedBytes.toLocaleString()} bytes`);
    console.log(`  -> Tỷ lệ tiết kiệm DOD:  ${Colors.green}${Colors.bright}${gorillaSavings}%${Colors.reset} (Hệ số nén: ${gorillaCompressed.metrics.compressionFactor}x)`);
    assert(gorillaSavings >= 70.0, `Gorilla thất bại: Tỷ lệ tiết kiệm ${gorillaSavings}% < 70%`);

    // 1C. Dictionary Encoding Test
    console.log(`\n${Colors.bright}[1C] Testing Dictionary Encoding (Categorical String Column)...${Colors.reset}`);
    const N_STRINGS = 100000;
    const endpoints = [
      '/api/v1/orders/checkout',
      '/api/v1/users/profile',
      '/api/v1/inventory/items',
      '/api/v1/payments/process',
      '/api/v1/auth/refresh-token',
      '/api/v1/analytics/telemetry'
    ];
    const stringData = new Array(N_STRINGS);
    for (let i = 0; i < N_STRINGS; i++) {
      stringData[i] = endpoints[i % endpoints.length];
    }

    const dictCompressed = ColumnarCompressionEngine.compressDictionary(stringData);
    const dictDecompressed = ColumnarCompressionEngine.decompressDictionary(dictCompressed);

    assert.strictEqual(dictDecompressed.length, stringData.length, 'Dictionary: Độ dài giải nén không khớp');
    for (let i = 0; i < stringData.length; i++) {
      if (stringData[i] !== dictDecompressed[i]) {
        throw new Error(`Dictionary: Sai lệch chuỗi tại dòng ${i}`);
      }
    }
    const dictSavings = dictCompressed.metrics.savingsPercent;
    console.log(`  -> Dung lượng gốc:       ${dictCompressed.originalBytes.toLocaleString()} bytes`);
    console.log(`  -> Dung lượng sau nén:   ${dictCompressed.compressedBytes.toLocaleString()} bytes`);
    console.log(`  -> Tỷ lệ tiết kiệm Dict: ${Colors.green}${Colors.bright}${dictSavings}%${Colors.reset} (Hệ số nén: ${dictCompressed.metrics.compressionFactor}x)`);
    assert(dictSavings >= 70.0, `Dictionary thất bại: Tỷ lệ tiết kiệm ${dictSavings}% < 70%`);

    console.log(`\n${Colors.green}${Colors.bright}✓ PASS TEST 1: Tất cả 3 giải thuật nén đạt tỷ lệ nén > 70% và khôi phục Lossless 100%!${Colors.reset}`);
    return true;
  }

  /**
   * TEST 2: Đo lường và so sánh hiệu năng Volcano vs Vectorized Engine trên 1,000,000 dòng
   * Điều kiện đạt: Vectorized Engine nhanh hơn Volcano ít nhất 5x - 10x và cho ra cùng kết quả.
   */
  static runTest2_VectorizedVsVolcano() {
    this.printSubHeader('TEST 2: VECTORIZED ENGINE VS VOLCANO ITERATOR (1,000,000 ROWS)');
    console.log(`${Colors.dim}Tạo 1,000,000 dòng dữ liệu và nạp vào cả 2 mô hình (Row-Store & Column-Store)...${Colors.reset}`);

    const bench = VectorizedExecutionSimulator.benchmark(1000000, 3);

    console.log(`\n${Colors.bright}KẾT QUẢ THỰC THI (EXECUTION RESULTS):${Colors.reset}`);
    console.log(`  Mô hình 1 - Volcano Iterator (Tuple-at-a-time):`);
    console.log(`    - Thời gian chạy (Median):  ${Colors.yellow}${bench.volcano.executionTimeMs} ms${Colors.reset} (Các lượt đo: ${bench.allVolcanoTimes.join(', ')} ms)`);
    console.log(`    - Số hàm ảo lặp:            ${bench.volcano.virtualCalls.toLocaleString()} virtual calls`);
    console.log(`    - Kết quả tính:             SUM = ${bench.volcano.sum.toLocaleString()}, COUNT = ${bench.volcano.count.toLocaleString()}, AVG = ${bench.volcano.avg}`);

    console.log(`  Mô hình 2 - Vectorized Batch (Batch Size = 1024):`);
    console.log(`    - Thời gian chạy (Median):  ${Colors.green}${Colors.bright}${bench.vectorized.executionTimeMs} ms${Colors.reset} (Các lượt đo: ${bench.allVectorizedTimes.join(', ')} ms)`);
    console.log(`    - Batches xử lý:            ${bench.vectorized.batchesProcessed} chunks (Selection Vector + 8x Unrolled Loop)`);
    console.log(`    - Kết quả tính:             SUM = ${bench.vectorized.sum.toLocaleString()}, COUNT = ${bench.vectorized.count.toLocaleString()}, AVG = ${bench.vectorized.avg}`);

    console.log(`\n  Chỉ số Gia tốc (Speedup Factor): ${Colors.cyan}${Colors.bright}${bench.speedupFactor}x FASTER${Colors.reset}`);

    // Kiểm tra tính đúng đắn kết quả
    assert.strictEqual(bench.accuracyCheck.countMatches, true, 'Sai lệch COUNT giữa 2 engine');
    assert.strictEqual(bench.accuracyCheck.sumMatches, true, 'Sai lệch SUM giữa 2 engine');
    assert.strictEqual(bench.accuracyCheck.avgMatches, true, 'Sai lệch AVG giữa 2 engine');

    // Kiểm tra ngưỡng hiệu năng tối thiểu 5x
    assert(bench.speedupFactor >= 5.0, `Hiệu năng Vectorized không đạt ngưỡng: ${bench.speedupFactor}x < 5.0x`);

    console.log(`\n${Colors.green}${Colors.bright}✓ PASS TEST 2: Vectorized Batch vượt trội Volcano ${bench.speedupFactor}x (Đạt chỉ tiêu >= 5x-10x) và bảo toàn tính đúng đắn 100%!${Colors.reset}`);
    return true;
  }

  /**
   * TEST 3: Kiểm thử SCD Type 2 Pipeline bảo toàn lịch sử và truy vấn Point-in-Time
   * Điều kiện đạt: Giữ trọn chuỗi phiên bản, không chồng lấn thời gian, truy vấn As-Of chuẩn xác.
   */
  static runTest3_SCDType2Pipeline() {
    this.printSubHeader('TEST 3: SLOWLY CHANGING DIMENSION TYPE 2 (SCD TYPE 2) PIPELINE');

    const scd = new SCDType2Pipeline('dim_customer');
    const customerId = 'CUST-VN-8801';

    // Mô phỏng dòng thời gian thay đổi của khách hàng
    const timeline = [
      {
        customer_id: customerId,
        name: 'Nguyen Van An',
        email: 'an.nguyen@email.vn',
        tier: 'BRONZE',
        city: 'Hanoi',
        credit_limit: 10000000,
        event_time: 1704067200000 // 2024-01-01T00:00:00Z
      },
      {
        customer_id: customerId,
        name: 'Nguyen Van An',
        email: 'an.nguyen@vip.vn',
        tier: 'SILVER',
        city: 'Hanoi',
        credit_limit: 25000000,
        event_time: 1706745600000 // 2024-02-01T00:00:00Z (Upgraded to Silver)
      },
      {
        customer_id: customerId,
        name: 'Nguyen Van An',
        email: 'an.nguyen@vip.vn',
        tier: 'GOLD',
        city: 'Da Nang',
        credit_limit: 50000000,
        event_time: 1711929600000 // 2024-04-01T00:00:00Z (Moved to Da Nang, Gold Tier)
      },
      {
        customer_id: customerId,
        name: 'Nguyen Van An',
        email: 'an.nguyen@vip.vn',
        tier: 'PLATINUM',
        city: 'Ho Chi Minh',
        credit_limit: 100000000,
        event_time: 1719792000000 // 2024-07-01T00:00:00Z (Moved to HCM, Platinum Tier)
      }
    ];

    console.log(`[3A] Ingesting 4 sequential change events for ${customerId}...`);
    for (const evt of timeline) {
      const res = scd.ingest(evt);
      console.log(`  -> ${res.action}: Version ${res.version || res.record?.version}, Surrogate Key = ${res.surrogate_key || res.new_surrogate_key}`);
    }

    // Kiểm thử Idempotent No-Op: Gửi lại cùng dữ liệu tại thời điểm mới
    const duplicateEvt = {
      customer_id: customerId,
      name: 'Nguyen Van An',
      email: 'an.nguyen@vip.vn',
      tier: 'PLATINUM',
      city: 'Ho Chi Minh',
      credit_limit: 100000000,
      event_time: 1722470400000 // 2024-08-01 (No changes)
    };
    const noopRes = scd.ingest(duplicateEvt);
    assert.strictEqual(noopRes.action, 'NOOP', 'SCD Type 2 phải bỏ qua sự kiện trùng lặp không thay đổi');
    console.log(`  -> ${noopRes.action}: Idempotent verification confirmed (No duplicate version created).`);

    // [3B] Kiểm tra bản ghi hiện tại (Current Record)
    const currentRec = scd.getCurrent(customerId);
    assert.strictEqual(currentRec.is_current, true, 'Bản ghi hiện tại phải có is_current = true');
    assert.strictEqual(currentRec.valid_to, null, 'Bản ghi hiện tại phải có valid_to = null');
    assert.strictEqual(currentRec.tier, 'PLATINUM', 'Tier hiện tại phải là PLATINUM');
    assert.strictEqual(currentRec.city, 'Ho Chi Minh', 'City hiện tại phải là Ho Chi Minh');
    assert.strictEqual(currentRec.version, 4, 'Version hiện tại phải là 4');

    // [3C] Kiểm tra lịch sử (Full Audit Trail)
    const history = scd.getHistory(customerId);
    assert.strictEqual(history.length, 4, 'Tổng số phiên bản lịch sử phải là 4');
    for (let v = 0; v < history.length; v++) {
      assert.strictEqual(history[v].version, v + 1, `Thứ tự version sai tại chỉ mục ${v}`);
      if (v < 3) {
        assert.strictEqual(history[v].is_current, false, `Version ${v + 1} cũ phải có is_current = false`);
        assert.strictEqual(history[v].valid_to, history[v + 1].valid_from, `Khoảng thời gian valid_to của V${v + 1} phải khớp với valid_from của V${v + 2}`);
      }
    }

    // [3D] Kiểm tra truy vấn As-Of (Point-in-Time Queries)
    console.log(`\n[3B] Testing As-Of Point-in-Time Historical Queries:`);
    
    // Ngày 15/01/2024 -> Phải là BRONZE tại Hanoi
    const asOfJan15 = scd.queryAsOf(customerId, 1705276800000);
    assert.strictEqual(asOfJan15.tier, 'BRONZE');
    assert.strictEqual(asOfJan15.city, 'Hanoi');
    console.log(`  -> As-Of 2024-01-15: Tier = ${asOfJan15.tier}, City = ${asOfJan15.city} (OK)`);

    // Ngày 15/02/2024 -> Phải là SILVER tại Hanoi
    const asOfFeb15 = scd.queryAsOf(customerId, 1707955200000);
    assert.strictEqual(asOfFeb15.tier, 'SILVER');
    assert.strictEqual(asOfFeb15.city, 'Hanoi');
    console.log(`  -> As-Of 2024-02-15: Tier = ${asOfFeb15.tier}, City = ${asOfFeb15.city} (OK)`);

    // Ngày 15/05/2024 -> Phải là GOLD tại Da Nang
    const asOfMay15 = scd.queryAsOf(customerId, 1715731200000);
    assert.strictEqual(asOfMay15.tier, 'GOLD');
    assert.strictEqual(asOfMay15.city, 'Da Nang');
    console.log(`  -> As-Of 2024-05-15: Tier = ${asOfMay15.tier}, City = ${asOfMay15.city} (OK)`);

    // Ngày 15/09/2024 -> Phải là PLATINUM tại Ho Chi Minh
    const asOfSep15 = scd.queryAsOf(customerId, 1726358400000);
    assert.strictEqual(asOfSep15.tier, 'PLATINUM');
    assert.strictEqual(asOfSep15.city, 'Ho Chi Minh');
    console.log(`  -> As-Of 2024-09-15: Tier = ${asOfSep15.tier}, City = ${asOfSep15.city} (OK)`);

    // Trước ngày 01/01/2024 -> Chưa có bản ghi nào
    const asOfPreHistory = scd.queryAsOf(customerId, 1700000000000);
    assert.strictEqual(asOfPreHistory, null, 'Thời điểm trước khi khách hàng tồn tại phải trả về null');
    console.log(`  -> As-Of Pre-Registration (2023): null (OK)`);

    const stats = scd.getStatistics();
    console.log(`\n  Thống kê Dimension Table: ${JSON.stringify(stats)}`);

    console.log(`\n${Colors.green}${Colors.bright}✓ PASS TEST 3: SCD Type 2 Pipeline bảo toàn 100% lịch sử biến đổi và truy vấn Point-in-Time chính xác tuyệt đối!${Colors.reset}`);
    return true;
  }

  /**
   * Chạy toàn bộ Test Suite và báo cáo tổng kết
   */
  static runAll() {
    this.printHeader('DATABASE MASTERCLASS: PHÒNG THÍ NGHIỆM LAB 06 - OLAP & COLUMNAR STORAGE');
    console.log(`${Colors.dim}Khởi động bộ kiểm thử tự động (Built-in Automated Verification Suite)...${Colors.reset}\n`);

    const tStart = performance.now();

    try {
      this.runTest1_ColumnarCompression();
      this.runTest2_VectorizedVsVolcano();
      this.runTest3_SCDType2Pipeline();

      const totalDuration = ((performance.now() - tStart) / 1000).toFixed(2);
      this.printHeader(`ALL TESTS PASSED! TỔNG THỜI GIAN HOÀN THÀNH: ${totalDuration}s`);
      console.log(`${Colors.green}${Colors.bright}  100% Tiêu chuẩn Kỹ thuật của Pod 6 đã được kiểm chứng thành công.${Colors.reset}\n`);
    } catch (err) {
      console.error(`\n${Colors.red}${Colors.bright}✗ TEST SUITE FAILED: ${err.message}${Colors.reset}`);
      console.error(err.stack);
      process.exit(1);
    }
  }
}

// ============================================================================
// EXPORT & RUNNER ENTRYPOINT
// ============================================================================

module.exports = {
  BitWriter,
  BitReader,
  ColumnarCompressionEngine,
  VectorizedExecutionSimulator,
  SCDType2Pipeline,
  BuiltInTestSuite
};

// Tự động kích hoạt khi chạy trực tiếp từ Terminal (node lab06_olap_columnar.js)
if (require.main === module) {
  BuiltInTestSuite.runAll();
}
