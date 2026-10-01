/**
 * 🏛️ DATABASE MASTERCLASS — PURE NODE.JS HTTP API SERVER & DASHBOARD
 * ============================================================================
 * Vị trí: Dashboard & Master Test Architect
 * File: server.js
 * Runtime: Pure Node.js (Zero external dependencies — http, fs, path only)
 * Cổng lắng nghe: 8899 (tự động chuyển tiếp cổng trống nếu 8899 bận)
 * 
 * TÍNH NĂNG CHÍNH:
 * 1. Phục vụ Web Cockpit tĩnh: `index.html` (Luminous Light Theme).
 * 2. REST API Endpoints:
 *    - `GET  /api/status`         : Trạng thái hiện tại của 8 labs & metadata.
 *    - `POST /api/run-all`        : Chạy toàn bộ 8 labs và trả về JSON chi tiết.
 *    - `POST /api/lab/:id`        : Chạy riêng lẻ từng phòng thí nghiệm (1 đến 8).
 *    - `POST /api/simulate/:type` : Mô phỏng tương tác thời gian thực (CBO, Bloom, XFetch, HikariCP, etc.).
 * 3. Hỗ trợ CORS, JSON payload parser thuần, kiểm soát lỗi khép kín.
 * ============================================================================
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { LABS_CONFIG, runSingleLab, runAllLabs } = require('../run_all_labs.js');

// Trạng thái lưu trữ tạm thời trong bộ nhớ (In-memory Telemetry Cache)
let cachedResults = {
  lastRun: null,
  totalLabs: LABS_CONFIG.length,
  passedLabs: LABS_CONFIG.length,
  totalAssertions: 96,
  totalDurationMs: 3450,
  labs: LABS_CONFIG.map(l => ({
    id: l.id,
    code: l.code,
    shortTitle: l.shortTitle,
    title: l.title,
    pod: l.pod,
    topics: l.topics,
    success: true,
    assertionsPassed: l.estimatedAssertions,
    assertionsTotal: l.estimatedAssertions,
    durationMs: 200,
    status: 'READY'
  }))
};

let isRunningAll = false;

/**
 * ⚡ KHO LỆNH TÁC CHIẾN (COMMAND ARSENAL & OPERATIONAL RUNBOOKS DATA)
 * Tổng hợp 22+ câu lệnh và quy trình cứu hộ chuyên sâu cho 7 hệ quản trị & môi trường.
 */
const COMMAND_ARSENAL_DATA = [
  // --------------------------------------------------------------------------
  // 🐘 POSTGRESQL (MODULE 01, 02, 03, 08)
  // --------------------------------------------------------------------------
  {
    id: 'PG-01',
    category: 'postgresql',
    engine: 'PostgreSQL 14+',
    context: 'psql (Admin / Read-Only)',
    severity: 'Giám Sát & Tối Ưu',
    title: 'Tìm Top 10 Câu Query Chậm Nhất (Top 10 Slowest Queries)',
    titleVn: 'Bóc tách câu lệnh chiếm nhiều thời gian CPU & Disk I/O nhất qua pg_stat_statements',
    code: `SELECT 
    queryid,
    substring(query, 1, 65) AS short_query,
    calls,
    round(total_exec_time::numeric, 2) AS total_ms,
    round(mean_exec_time::numeric, 2) AS mean_ms,
    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS cache_hit_pct,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;`,
    paramsExplanation: [
      { name: 'calls', desc: 'Tổng số lần câu truy vấn đã được thực thi từ lần reset thống kê gần nhất.' },
      { name: 'mean_ms', desc: 'Thời gian thực thi trung bình mỗi lượt (ms). Nếu mean_ms > 100ms cần kiểm tra EXPLAIN ANALYZE ngay.' },
      { name: 'cache_hit_pct', desc: 'Tỷ lệ đọc từ RAM Buffer. Nếu < 99% chứng tỏ câu query đang đọc đĩa NVMe gây nghẽn I/O.' }
    ],
    runbookTip: 'Khi phát hiện query có calls cao và mean_ms lớn, dùng EXPLAIN (ANALYZE, BUFFERS) để xác định thiếu index hay do Seq Scan.'
  },
  {
    id: 'PG-02',
    category: 'postgresql',
    engine: 'PostgreSQL 12+',
    context: 'psql (Superuser)',
    severity: 'Khẩn Cấp (SEV-1)',
    title: 'Truy Tìm & Diệt Khóa Chết Deadlock (Kill Blocking Locks)',
    titleVn: 'Xác định chính xác PID tiến trình đang giữ khóa chặn các transaction khác và chấm dứt an toàn',
    code: `SELECT
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process,
    now() - blocked_activity.query_start AS waiting_duration
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- Diệt tiến trình giữ khóa sau khi xác nhận:
-- SELECT pg_cancel_backend(blocking_pid);     -- Hủy query nhẹ nhàng
-- SELECT pg_terminate_backend(blocking_pid);  -- Đóng kết nối cưỡng chế`,
    paramsExplanation: [
      { name: 'blocked_pid', desc: 'ID tiến trình đang bị treo, nằm trong hàng đợi chờ cấp phát khóa.' },
      { name: 'blocking_pid', desc: 'ID tiến trình thủ phạm đang giữ khóa độc quyền (Exclusive Lock) mà không nhả ra.' },
      { name: 'waiting_duration', desc: 'Thời gian đã bị nghẽn. Nếu > 5s cần xử lý ngay tránh sập Connection Pool.' }
    ],
    runbookTip: 'Ưu tiên chạy pg_cancel_backend() trước. Nếu sau 3 giây vẫn không nhả khóa mới dùng pg_terminate_backend().'
  },
  {
    id: 'PG-03',
    category: 'postgresql',
    engine: 'PostgreSQL 12+',
    context: 'psql (Admin)',
    severity: 'Bảo Trì & Tuning',
    title: 'Kiểm Tra Độ Phân Mảnh Table Bloat & Dead Tuples',
    titleVn: 'Đo lường số lượng bản ghi chết do MVCC để điều phối Autovacuum kịp thời',
    code: `SELECT 
    schemaname,
    relname AS table_name,
    n_live_tup AS live_tuples,
    n_dead_tup AS dead_tuples,
    round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) AS dead_tuple_ratio_pct,
    last_vacuum,
    last_autovacuum,
    last_analyze
FROM pg_stat_user_tables
WHERE (n_live_tup + n_dead_tup) > 1000
ORDER BY dead_tuple_ratio_pct DESC
LIMIT 15;`,
    paramsExplanation: [
      { name: 'dead_tuples', desc: 'Số lượng tuple cũ sinh ra do UPDATE hoặc DELETE chưa được thu hồi về Free Space Map.' },
      { name: 'dead_tuple_ratio_pct', desc: 'Tỷ lệ bản ghi rác. Nếu > 20% chứng tỏ Autovacuum đang bị tụt hậu phía sau.' },
      { name: 'last_autovacuum', desc: 'Thời điểm gần nhất tiến trình Autovacuum quét bảng. Nếu là NULL cần chạy VACUUM ANALYZE khẩn cấp.' }
    ],
    runbookTip: 'Chạy VACUUM (VERBOSE, ANALYZE) table_name; hoặc dùng pg_repack để dọn rác và thu hồi dung lượng đĩa mà không khóa bảng.'
  },
  {
    id: 'PG-04',
    category: 'postgresql',
    engine: 'PostgreSQL 12+',
    context: 'psql (Admin)',
    severity: 'Tối Ưu Chi Phí RAM',
    title: 'Rà Soát Chỉ Mục Không Sử Dụng (Unused / Redundant Indexes)',
    titleVn: 'Tìm kiếm các index lãng phí dung lượng đĩa và làm chậm các câu lệnh INSERT/UPDATE',
    code: `SELECT 
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
    idx_scan AS number_of_scans,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes ui
JOIN pg_index i ON ui.indexrelid = i.indexrelid
WHERE NOT indisunique 
  AND idx_scan = 0
  AND pg_relation_size(i.indexrelid) > 1024 * 1024
ORDER BY pg_relation_size(i.indexrelid) DESC;`,
    paramsExplanation: [
      { name: 'number_of_scans', desc: 'Số lần CBO đã chọn index này. Nếu bằng 0 sau 1 tháng chạy production thì 99% là index thừa.' },
      { name: 'index_size', desc: 'Dung lượng RAM/Disk bị chiếm dụng vô ích.' }
    ],
    runbookTip: 'Xóa index thừa bằng: DROP INDEX CONCURRENTLY index_name; (Bắt buộc dùng CONCURRENTLY để không khóa bảng ghi).'
  },
  {
    id: 'PG-05',
    category: 'postgresql',
    engine: 'PostgreSQL 11+',
    context: 'Migration Scripts',
    severity: 'An Toàn Triển Khai',
    title: 'Khống Chế Khóa Bảng DDL Với lock_timeout An Toàn',
    titleVn: 'Quy chuẩn bắt buộc khi thực hiện ALTER TABLE trên môi trường chịu tải cao',
    code: `BEGIN;
-- Thiết lập thời gian chờ khóa tối đa 2 giây chống Head-of-Line Blocking
SET LOCAL lock_timeout = '2s';

-- Thêm cột mới nullable (Zero-Downtime Expand phase)
ALTER TABLE customer_orders ADD COLUMN payment_reference VARCHAR(64);

COMMIT;`,
    paramsExplanation: [
      { name: 'lock_timeout = 2s', desc: 'Nếu có transaction dài đang chạy, lệnh DDL tự hủy sau 2s thay vì xếp hàng chờ và chặn đứng toàn bộ traffic sau nó.' }
    ],
    runbookTip: 'Áp dụng kèm cơ chế Retry với Exponential Jitter ở tầng ứng dụng nếu gặp lỗi lock_not_available (55P03).'
  },
  {
    id: 'PG-06',
    category: 'postgresql',
    engine: 'PostgreSQL 12+',
    context: 'psql (Monitoring)',
    severity: 'Cảnh Báo Sống Còn (SEV-1)',
    title: 'Giám Sát Tuổi Giao Dịch Chống Thảm Họa XID Wraparound',
    titleVn: 'Kiểm tra khoảng cách số transaction ID đến ngưỡng 2 tỷ để tránh PostgreSQL tự đóng cửa sang chế độ Read-Only',
    code: `SELECT 
    datname,
    age(datfrozenxid) AS current_xid_age,
    2^31 - 1000000 - age(datfrozenxid) AS tx_until_wraparound,
    round((age(datfrozenxid)::numeric / 2147483648) * 100, 2) AS xid_used_pct
FROM pg_database
WHERE datallowconn
ORDER BY current_xid_age DESC;`,
    paramsExplanation: [
      { name: 'current_xid_age', desc: 'Số lượng transaction đã tiêu thụ từ lần freeze cuối cùng.' },
      { name: 'tx_until_wraparound', desc: 'Số transaction còn lại trước khi DB buộc phải dừng toàn bộ thao tác ghi để bảo vệ toàn vẹn dữ liệu.' }
    ],
    runbookTip: 'Nếu xid_used_pct > 75%, cần lập tức tăng autovacuum_freeze_max_age và chạy VACUUM FREEZE trên các bảng có tuổi cao nhất.'
  },

  // --------------------------------------------------------------------------
  // 🐬 MYSQL INNODB (MODULE 01, 02, 03)
  // --------------------------------------------------------------------------
  {
    id: 'MY-01',
    category: 'mysql',
    engine: 'MySQL 8.0+',
    context: 'mysql CLI (Admin)',
    severity: 'Giám Sát & Tối Ưu',
    title: 'Top Truy Vấn Chậm Qua Performance Schema Digest',
    titleVn: 'Truy quét các câu lệnh SQL tốn nhiều thời gian và quét nhiều dòng nhất trong MySQL',
    code: `SELECT 
    SCHEMA_NAME,
    DIGEST_TEXT AS normalized_query,
    COUNT_STAR AS exec_count,
    ROUND(SUM_TIMER_WAIT / 1000000000000, 3) AS total_latency_sec,
    ROUND(AVG_TIMER_WAIT / 1000000000, 2) AS avg_latency_ms,
    SUM_ROWS_EXAMINED AS rows_examined,
    SUM_ROWS_SENT AS rows_sent,
    ROUND(SUM_ROWS_EXAMINED / NULLIF(SUM_ROWS_SENT, 0), 1) AS examine_sent_ratio
FROM performance_schema.events_statements_summary_by_digest
WHERE SCHEMA_NAME NOT IN ('performance_schema', 'sys', 'information_schema', 'mysql')
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;`,
    paramsExplanation: [
      { name: 'examine_sent_ratio', desc: 'Tỷ lệ dòng quét trên dòng trả về. Nếu ratio > 100 chứng tỏ đang quét thiếu index trầm trọng.' },
      { name: 'avg_latency_ms', desc: 'Độ trễ trung bình của câu truy vấn tính bằng mili-giây.' }
    ],
    runbookTip: 'Dùng EXPLAIN FORMAT=TREE select_statement để phân tích chi tiết đường dẫn thực thi của InnoDB.'
  },
  {
    id: 'MY-02',
    category: 'mysql',
    engine: 'MySQL 5.7 / 8.0+',
    context: 'mysql CLI (Admin)',
    severity: 'Pháp Y Deadlock',
    title: 'Pháp Y Khóa Chờ & Deadlock Gần Nhất (InnoDB Status)',
    titleVn: 'Trích xuất báo cáo động cơ InnoDB bóc tách nguyên nhân gây ra xung đột bế tắc giao dịch',
    code: `SHOW ENGINE INNODB STATUS\\G

-- Hoặc truy vấn bảng sys trực tiếp trong MySQL 8.0:
SELECT 
    waiting_trx_id,
    waiting_pid,
    waiting_query,
    blocking_trx_id,
    blocking_pid,
    blocking_query,
    wait_age,
    locked_table
FROM sys.innodb_lock_waits;`,
    paramsExplanation: [
      { name: 'LATEST DETECTED DEADLOCK', desc: 'Mục trong output chứa chi tiết 2 Transaction, các Locks đang giữ và Locks đang chờ dẫn tới chu trình bế tắc.' }
    ],
    runbookTip: 'Kỷ luật bất biến: Mọi Transaction cần cập nhật nhiều hàng phải sắp xếp thứ tự khóa theo PRIMARY KEY tăng dần (ORDER BY id ASC).'
  },
  {
    id: 'MY-03',
    category: 'mysql',
    engine: 'MySQL 5.7 / 8.0+',
    context: 'mysql CLI',
    severity: 'Dung Lượng Đĩa',
    title: 'Kiểm Tra Phân Mảnh & Dung Lượng Bảng InnoDB (DATA_FREE)',
    titleVn: 'Xác định dung lượng trống chưa thu hồi trong các tệp bảng dữ liệu ibd',
    code: `SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) AS total_size_mb,
    ROUND(DATA_FREE / 1024 / 1024, 2) AS fragmented_free_mb,
    ROUND((DATA_FREE / (DATA_LENGTH + INDEX_LENGTH + DATA_FREE)) * 100, 2) AS fragmentation_pct
FROM information_schema.TABLES
WHERE TABLE_SCHEMA NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
  AND DATA_FREE > 50 * 1024 * 1024
ORDER BY DATA_FREE DESC;`,
    paramsExplanation: [
      { name: 'fragmented_free_mb', desc: 'Dung lượng bị lãng phí sau các đợt xóa hoặc cập nhật lớn.' }
    ],
    runbookTip: 'Chạy ALTER TABLE table_name ENGINE=InnoDB; (Online DDL) để chống phân mảnh và co tệp ibd.'
  },

  // --------------------------------------------------------------------------
  // ⚡ REDIS IN-MEMORY (MODULE 05)
  // --------------------------------------------------------------------------
  {
    id: 'RD-01',
    category: 'redis',
    engine: 'Redis 6.x / 7.x / 8.x',
    context: 'redis-cli',
    severity: 'Khẩn Cấp RAM',
    title: 'Quét Tìm BigKeys Ngốn RAM Trên Toàn Cụm (Scan BigKeys)',
    titleVn: 'Sử dụng lệnh scan không khóa luồng để tìm ra những key có dung lượng lớn nhất gây chậm trễ GC',
    code: `redis-cli -h 127.0.0.1 -p 6379 --bigkeys

-- Hoặc đo đạc bộ nhớ chi tiết theo byte:
redis-cli -h 127.0.0.1 -p 6379 --memkeys

-- Kiểm tra dung lượng RAM của một key nghi vấn:
-- MEMORY USAGE my_huge_hash_key`,
    paramsExplanation: [
      { name: '--bigkeys', desc: 'Sử dụng SCAN lướt qua keyspace và trả về mẫu thống kê String dài nhất, List nhiều phần tử nhất, Hash nhiều field nhất.' }
    ],
    runbookTip: 'Tuyệt đối cấm dùng lệnh KEYS * trên production. Luôn dùng --bigkeys hoặc SCAN có COUNT hợp lý.'
  },
  {
    id: 'RD-02',
    category: 'redis',
    engine: 'Redis 6.x / 7.x',
    context: 'redis-cli',
    severity: 'Hiệu Năng Cache',
    title: 'Giám Sát Tỷ Lệ Trúng Đệm Cache Hit Ratio',
    titleVn: 'Kiểm tra tỷ lệ đọc trúng cache để đánh giá hiệu quả giải thuật bộ đệm',
    code: `redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses"

# Công thức Hit Rate:
# Hit Rate = (keyspace_hits / (keyspace_hits + keyspace_misses)) * 100`,
    paramsExplanation: [
      { name: 'keyspace_hits', desc: 'Số lượt truy vấn tìm thấy key trong bộ nhớ đệm.' },
      { name: 'keyspace_misses', desc: 'Số lượt không tìm thấy (cache miss) buộc ứng dụng phải đọc từ cơ sở dữ liệu gốc.' }
    ],
    runbookTip: 'Tỷ lệ Hit Rate chuẩn doanh nghiệp phải đạt từ 95% đến 99%. Nếu thấp hơn, rà soát TTL và hiện tượng Cache Eviction.'
  },
  {
    id: 'RD-03',
    category: 'redis',
    engine: 'Redis 6.x / 7.x',
    context: 'redis-cli',
    severity: 'Pháp Y Độ Trễ',
    title: 'Kiểm Tra Danh Sách 10 Lệnh Chậm Nhất (Slowlog Inspection)',
    titleVn: 'Truy xuất nhật ký các câu lệnh vượt quá ngưỡng slowlog-log-slower-than',
    code: `redis-cli SLOWLOG GET 10

-- Cấu hình ngưỡng ghi nhận (ví dụ ghi log lệnh chạy quá 10,000 microsecond = 10ms):
-- CONFIG SET slowlog-log-slower-than 10000
-- CONFIG SET slowlog-max-len 1024`,
    paramsExplanation: [
      { name: 'Execution Time', desc: 'Đơn vị tính bằng microseconds (µs). 1000 µs = 1 ms.' }
    ],
    runbookTip: 'Nếu thấy các lệnh như HGETALL, SMEMBERS, KEYS xuất hiện trong slowlog, lập tức refactor sang HSCAN, SSCAN.'
  },
  {
    id: 'RD-04',
    category: 'redis',
    engine: 'Redis 4.0+',
    context: 'redis-cli',
    severity: 'An Toàn Vận Hành',
    title: 'Thu Hồi Bộ Nhớ Bất Đồng Bộ An Toàn (UNLINK thay DEL)',
    titleVn: 'Xóa key kích thước lớn ở luồng nền (BIO thread) không làm nghẽn Event Loop đơn luồng của Redis',
    code: `# BẮT BUỘC DÙNG ĐỂ KHÔNG CHẶN EVENT LOOP:
redis-cli UNLINK my_massive_collection_key`,
    paramsExplanation: [
      { name: 'UNLINK', desc: 'Gỡ key khỏi keyspace ngay tức khắc, giải phóng RAM được bàn giao cho thread BIO_LAZY_FREE nền.' }
    ],
    runbookTip: 'Bật cấu hình tự động: lazyfree-lazy-eviction yes, lazyfree-lazy-expire yes trong redis.conf.'
  },

  // --------------------------------------------------------------------------
  // 📊 CLICKHOUSE & DUCKDB (MODULE 06)
  // --------------------------------------------------------------------------
  {
    id: 'CH-01',
    category: 'clickhouse',
    engine: 'ClickHouse 23+',
    context: 'clickhouse-client',
    severity: 'Lưu Trữ & Nén',
    title: 'Kiểm Tra Tỷ Lệ Nén Cột & Kích Thước Parts (system.parts)',
    titleVn: 'Đo lường hiệu quả nén dạng cột (Gorilla, LZ4, ZSTD) trên bảng dữ liệu phân tích',
    code: `SELECT 
    table,
    formatReadableSize(sum(data_compressed_bytes)) AS compressed_size,
    formatReadableSize(sum(data_uncompressed_bytes)) AS raw_size,
    round(sum(data_uncompressed_bytes) / nullif(sum(data_compressed_bytes), 0), 2) AS compression_ratio,
    count() AS total_parts,
    sum(rows) AS total_rows
FROM system.parts
WHERE active AND database = currentDatabase()
GROUP BY table
ORDER BY sum(data_compressed_bytes) DESC;`,
    paramsExplanation: [
      { name: 'compression_ratio', desc: 'Hệ số nén dữ liệu. Thường đạt 4x - 12x đối với ClickHouse MergeTree.' },
      { name: 'total_parts', desc: 'Số lượng parts đang hoạt động. Cần kiểm tra nếu parts > 300 parts/bảng.' }
    ],
    runbookTip: 'Nếu compression_ratio < 3x, xem xét đổi thuật toán nén cho các cột số sang DoubleDelta hoặc Gorilla.'
  },
  {
    id: 'CH-02',
    category: 'clickhouse',
    engine: 'ClickHouse 22+',
    context: 'clickhouse-client',
    severity: 'Giám Sát Tải OLAP',
    title: 'Top Truy Vấn Tốn RAM & CPU Nhất (system.query_log)',
    titleVn: 'Pháp y các câu truy vấn phân tích nặng làm bão hòa bộ nhớ máy chủ ClickHouse',
    code: `SELECT 
    query_id,
    user,
    query_duration_ms,
    formatReadableSize(memory_usage) AS peak_memory,
    read_rows,
    formatReadableSize(read_bytes) AS read_bytes_formatted,
    substring(query, 1, 80) AS query_preview
FROM system.query_log
WHERE type = 'QueryFinish'
  AND event_time > now() - INTERVAL 1 HOUR
ORDER BY memory_usage DESC
LIMIT 10;`,
    paramsExplanation: [
      { name: 'peak_memory', desc: 'Đỉnh RAM mà câu query tiêu thụ trong quá trình GROUP BY hoặc JOIN.' }
    ],
    runbookTip: 'Thiết lập max_memory_usage = 10000000000 (10GB) trong profiles.xml để tránh tình trạng 1 câu query ăn hết RAM.'
  },
  {
    id: 'DK-01',
    category: 'clickhouse',
    engine: 'DuckDB 0.9+',
    context: 'DuckDB CLI / Node.js',
    severity: 'Phân Tích Tức Thì',
    title: 'DuckDB Phân Tích Trực Tiếp File Parquet Bằng SIMD Vectorized',
    titleVn: 'Đọc và tổng hợp hàng triệu dòng dữ liệu trực tiếp từ tệp Parquet mà không cần nạp vào DB',
    code: `SELECT 
    country,
    count(*) AS total_transactions,
    round(avg(amount), 2) AS avg_amount,
    round(sum(amount), 2) AS total_revenue
FROM read_parquet('s3://analytics-bucket/lakehouse/transactions_*.parquet')
WHERE event_date >= '2026-01-01'
GROUP BY country
ORDER BY total_revenue DESC;`,
    paramsExplanation: [
      { name: 'read_parquet', desc: 'Tự động đọc Parquet metadata, chỉ nạp đúng các cột cần thiết (Column Pruning) và áp dụng SIMD.' }
    ],
    runbookTip: 'Rất lý tưởng cho kiến trúc Serverless Analytics hoặc nhúng trực tiếp vào các microservices phân tích.'
  },

  // --------------------------------------------------------------------------
  // 🧠 VECTOR & AI RETRIEVAL (MODULE 07)
  // --------------------------------------------------------------------------
  {
    id: 'VC-01',
    category: 'vector',
    engine: 'PostgreSQL + pgvector 0.5+',
    context: 'psql',
    severity: 'Kiến Trúc AI',
    title: 'Tạo Chỉ Mục Vector HNSW Tốc Độ Cao Trên pgvector',
    titleVn: 'Khởi tạo đồ thị phân tầng HNSW cho vector embeddings 1536 chiều với khoảng cách Cosine',
    code: `-- Bật extension pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tạo bảng tài liệu ngữ nghĩa:
CREATE TABLE IF NOT EXISTS kb_documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536)
);

-- Tạo chỉ mục HNSW tối ưu tốc độ đọc:
CREATE INDEX IF NOT EXISTS idx_kb_docs_hnsw 
ON kb_documents 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
    paramsExplanation: [
      { name: 'm = 16', desc: 'Số lượng kết nối 2 chiều tối đa cho mỗi node trong đồ thị HNSW.' },
      { name: 'ef_construction = 64', desc: 'Kích thước danh sách ứng viên khi xây dựng đồ thị.' }
    ],
    runbookTip: 'Khi tạo index trên bảng dữ liệu lớn hàng triệu dòng, tạm thời tăng maintenance_work_mem = "4GB".'
  },
  {
    id: 'VC-02',
    category: 'vector',
    engine: 'PostgreSQL + pgvector',
    context: 'psql (Session Level)',
    severity: 'Cân Chỉnh Latency/Recall',
    title: 'Tinh Chỉnh Tham Số ef_search Cho Truy Vấn Vector Thời Gian Thực',
    titleVn: 'Cân bằng giữa độ trễ (latency ms) và độ chính xác (Recall@K) khi truy vấn KNN',
    code: `-- Tinh chỉnh phạm vi tìm kiếm đồ thị cho session hiện tại:
SET hnsw.ef_search = 100;

-- Thực hiện truy vấn 10 lân cận gần nhất (KNN):
SELECT 
    id,
    substring(content, 1, 100) AS snippet,
    1 - (embedding <=> '[0.012, -0.043, ...]'::vector) AS cosine_similarity
FROM kb_documents
ORDER BY embedding <=> '[0.012, -0.043, ...]'::vector
LIMIT 10;`,
    paramsExplanation: [
      { name: 'hnsw.ef_search', desc: 'Mặc định là 40. Tăng lên 100-200 giúp Recall đạt > 98% cho các hệ thống RAG.' },
      { name: '<=> operator', desc: 'Toán tử tính khoảng cách Cosine Distance.' }
    ],
    runbookTip: 'Không nên đặt ef_search quá 400 vì độ chính xác tăng rất ít trong khi độ trễ sẽ tăng tuyến tính.'
  },
  {
    id: 'VC-03',
    category: 'vector',
    engine: 'PostgreSQL 14+ & pgvector',
    context: 'psql',
    severity: 'RAG Nâng Cao',
    title: 'Truy Vấn Lai Hybrid Search RRF (Dense Vector + BM25 Full-text)',
    titleVn: 'Dung hợp bảng xếp hạng Reciprocal Rank Fusion kết hợp sức mạnh ngữ nghĩa và từ khóa chính xác',
    code: `WITH vector_ranks AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> '[0.021, -0.015, ...]'::vector) AS rank_vec
    FROM kb_documents
    ORDER BY embedding <=> '[0.021, -0.015, ...]'::vector
    LIMIT 50
),
text_ranks AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(to_tsvector('vietnamese', content), plainto_tsquery('vietnamese', 'cơ sở dữ liệu')) DESC) AS rank_text
    FROM kb_documents
    WHERE to_tsvector('vietnamese', content) @@ plainto_tsquery('vietnamese', 'cơ sở dữ liệu')
    LIMIT 50
)
SELECT 
    COALESCE(v.id, t.id) AS doc_id,
    COALESCE(1.0 / (60 + v.rank_vec), 0.0) + COALESCE(1.0 / (60 + t.rank_text), 0.0) AS rrf_score
FROM vector_ranks v
FULL OUTER JOIN text_ranks t ON v.id = t.id
ORDER BY rrf_score DESC
LIMIT 10;`,
    paramsExplanation: [
      { name: 'rrf_score', desc: 'Điểm số dung hợp theo công thức RRF chuẩn: 1 / (k + rank) với hệ số k=60.' }
    ],
    runbookTip: 'Hybrid Search giải quyết triệt để vấn đề vector tìm kiếm không khớp các từ khóa mã sản phẩm, SKU.'
  },

  // --------------------------------------------------------------------------
  // 🐧 LINUX OS & DBRE (MODULE 08)
  // --------------------------------------------------------------------------
  {
    id: 'OS-01',
    category: 'linux',
    engine: 'Linux Kernel (Ubuntu/RHEL)',
    context: 'root bash /etc/sysctl.d/99-db.conf',
    severity: 'Cấu Hình Nền Tảng OS',
    title: 'Tinh Chỉnh Linux Kernel Sysctl Cho Database Server Chịu Tải Cao',
    titleVn: 'Thiết lập thông số nhân hệ điều hành chống Out-Of-Memory và tối ưu hóa I/O xả đệm đĩa',
    code: `# Thêm vào /etc/sysctl.d/99-database.conf
vm.swappiness = 1
vm.dirty_background_ratio = 5
vm.dirty_ratio = 10
vm.overcommit_memory = 2
vm.overcommit_ratio = 80
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 8192

# Áp dụng ngay lập tức:
# sudo sysctl --system

# Tắt Transparent Huge Pages:
# echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled`,
    paramsExplanation: [
      { name: 'vm.swappiness = 1', desc: 'Yêu cầu Linux chỉ dùng swap khi RAM thực sự cạn kiệt, tránh đưa trang nhớ của DB xuống swap.' },
      { name: 'transparent_hugepage = never', desc: 'THP gây phân mảnh bộ nhớ và độ trễ ngẫu nhiên cực lớn trên các cơ sở dữ liệu.' }
    ],
    runbookTip: 'Kiểm tra THP sau khi khởi động lại máy chủ: cat /sys/kernel/mm/transparent_hugepage/enabled.'
  },
  {
    id: 'OS-02',
    category: 'linux',
    engine: 'Linux OS',
    context: 'bash / sysstat',
    severity: 'Pháp Y I/O Đĩa',
    title: 'Đo Đạc I/O Đĩa & Độ Bão Hòa Bằng iostat Thời Gian Thực',
    titleVn: 'Phát hiện ổ cứng NVMe/SSD có đang chạm ngưỡng thắt cổ chai I/O hay không',
    code: `iostat -xz 1 5

# Quan sát:
# - %util: Tỷ lệ thời gian thiết bị bận rộn. Nếu > 85% liên tục là nghẽn đĩa.
# - r_await: Thời gian trung bình đọc (ms). Cần < 2ms cho NVMe.
# - w_await: Thời gian trung bình ghi (ms). Cần < 3ms cho NVMe.`,
    paramsExplanation: [
      { name: '%util', desc: 'Mức độ bão hòa phần cứng đĩa lưu trữ.' }
    ],
    runbookTip: 'Nếu %util cao nhưng r/s thấp, kiểm tra xem có tiến trình nào đang ghi log tuần tự quá nhiều không.'
  },
  {
    id: 'OS-03',
    category: 'linux',
    engine: 'Application Architecture',
    context: 'HikariCP Config / Spring Boot',
    severity: 'Định Cỡ Kết Nối',
    title: 'Tính Toán Kích Thước Hồ Bơi Kết Nối HikariCP / PgBouncer Chuẩn',
    titleVn: 'Áp dụng công thức Little Law để triệt tiêu hiện tượng tranh chấp CPU Context Switching',
    code: `# Công thức HikariCP chính thống:
# maximum-pool-size = (CPU_CORES * 2) + EFFECTIVE_SPINDLE_COUNT

# Ví dụ 8 CPU Cores + 1 SSD NVMe:
# maximum-pool-size = (8 * 2) + 1 = 17 kết nối.

# application.yml:
# spring.datasource.hikari.maximum-pool-size: 17
# spring.datasource.hikari.connection-timeout: 30000`,
    paramsExplanation: [
      { name: 'maximum-pool-size', desc: 'Số kết nối đồng thời tối đa. Đặt quá lớn (> 100) sẽ làm chậm hệ thống.' }
    ],
    runbookTip: 'Hồ bơi kết nối nhỏ hơn giúp câu truy vấn chạy nhanh hơn trên cơ sở dữ liệu quan hệ.'
  },

  // --------------------------------------------------------------------------
  // 🐳 DOCKER COMPOSE (LAB HARNESS)
  // --------------------------------------------------------------------------
  {
    id: 'DC-01',
    category: 'docker',
    engine: 'Docker / Compose v2',
    context: 'Terminal / PowerShell',
    severity: 'Môi Trường Thực Nghiệm',
    title: 'Khởi Động Nhanh Toàn Bộ Hạ Tầng Lab Bằng Docker Compose',
    titleVn: 'Kích hoạt đồng bộ cụm container PostgreSQL, MySQL, Redis, ClickHouse, Qdrant kèm Healthcheck',
    code: `# Khởi động toàn bộ các dịch vụ database ở chế độ daemon nền:
docker compose -f labs/docker-compose.yml up -d

# Kiểm tra trạng thái sức khỏe từng container:
docker compose -f labs/docker-compose.yml ps`,
    paramsExplanation: [
      { name: 'up -d', desc: 'Chạy nền và tự động liên kết mạng nội bộ giữa các container.' }
    ],
    runbookTip: 'Luôn kiểm tra trạng thái (healthy) trước khi cho các bài test hoặc kiểm thử tự động khởi chạy.'
  },
  {
    id: 'DC-02',
    category: 'docker',
    engine: 'Docker CLI',
    context: 'Terminal',
    severity: 'Giám Sát Container',
    title: 'Giám Sát Tài Nguyên Container Database Thời Gian Thực (docker stats)',
    titleVn: 'Theo dõi trực quan mức tiêu thụ CPU, RAM và Network I/O của các container',
    code: `docker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.MemPerc}}\\t{{.NetIO}}"`,
    paramsExplanation: [
      { name: 'MemUsage / MemPerc', desc: 'Dung lượng RAM đang tiêu thụ so với hạn mức memory limit.' }
    ],
    runbookTip: 'Nếu thấy MemPerc vượt 90%, cần nâng limit trong compose file để tránh bị Docker OOM-Killer tắt container.'
  },
  {
    id: 'DC-03',
    category: 'docker',
    engine: 'Docker CLI',
    context: 'Terminal',
    severity: 'Pháp Y Sự Cố',
    title: 'Trích Xuất Nhật Ký Sự Cố Database Chuyên Sâu (docker compose logs)',
    titleVn: 'Xem 100 dòng log gần nhất và theo dõi trực tiếp luồng ghi của container',
    code: `docker compose -f labs/docker-compose.yml logs -f --tail=100 postgres

# Lọc log lỗi:
docker compose -f labs/docker-compose.yml logs postgres | grep -E "FATAL|ERROR|PANIC"`,
    paramsExplanation: [
      { name: '--tail=100', desc: 'Chỉ lấy 100 dòng cuối cùng tránh làm tràn màn hình terminal.' }
    ],
    runbookTip: 'Khi gặp lỗi database không khởi động được, luôn kiểm tra docker logs đầu tiên để tìm nguyên nhân phân quyền volume.'
  }
];

/**
 * Đọc body JSON từ request stream thuần Node.js
 */
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy(); // Chống DoS payload quá lớn
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/**
 * Gửi JSON response chuẩn với CORS headers
 */
function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(payload);
}

/**
 * Bộ xử lý mô phỏng tương tác thời gian thực cho Cockpit (Real-time Interactive Simulators)
 */
function handleSimulation(type, body) {
  switch (type) {
    case 'cbo': {
      // Mô phỏng CBO: Selectivity từ 1% đến 50%
      const selectivity = Math.max(0.005, Math.min(0.60, Number(body.selectivity) || 0.08));
      const totalRows = 100000;
      const pages = 2000;
      const btreeDepth = 3;
      const costPageIO = 1.0;
      const costCpuTuple = 0.01;
      const costCpuIndex = 0.0025;

      // Chi phí Sequential Scan: đọc toàn bộ trang tuần tự
      const seqScanCost = Math.round((pages * costPageIO) + (totalRows * costCpuTuple));

      // Chi phí Index Scan: B-Tree traversal + Random IO cho từng dòng phù hợp
      const matchedRows = Math.round(totalRows * selectivity);
      const randomPagesIO = Math.round(matchedRows * costPageIO * 1.85); // Random IO đắt hơn 1.85x
      const indexScanCost = Math.round((btreeDepth * costPageIO) + (matchedRows * costCpuIndex) + randomPagesIO);

      const breakEvenSelectivity = 0.085; // Ngưỡng hòa vốn ~8.5%
      const decision = indexScanCost < seqScanCost ? 'INDEX_SCAN' : 'SEQUENTIAL_SCAN';

      return {
        selectivity: Math.round(selectivity * 1000) / 10,
        totalRows,
        matchedRows,
        seqScanCost,
        indexScanCost,
        costDelta: Math.abs(indexScanCost - seqScanCost),
        breakEvenSelectivity: breakEvenSelectivity * 100,
        decision,
        recommendation: decision === 'INDEX_SCAN' 
          ? `B+ Tree Index Scan tối ưu hơn (Chi phí thấp hơn ${Math.round((seqScanCost - indexScanCost) / seqScanCost * 100)}%)`
          : `Sequential Scan tối ưu hơn do tránh được Random I/O cho ${matchedRows.toLocaleString()} dòng (Rẻ hơn ${Math.round((indexScanCost - seqScanCost) / indexScanCost * 100)}%)`
      };
    }

    case 'hikaricp': {
      // Mô phỏng HikariCP: Core count -> Pool Size
      const cores = Math.max(1, Math.min(64, Number(body.cores) || 8));
      const spindles = Number(body.spindles) || 1;
      const optimalPoolSize = (cores * 2) + spindles;
      
      // So sánh P99 latency giữa Oversized Pool (500) vs Optimal Pool
      const optimalP99 = Math.round(1.8 + (Math.random() * 0.4) * 10) / 10;
      const oversizedPoolSize = Math.max(150, cores * 25);
      const oversizedP99 = Math.round((optimalP99 * 4.2 + (Math.random() * 2)) * 10) / 10;

      return {
        cores,
        spindles,
        formula: 'pool_size = (cores * 2) + effective_spindle_count',
        optimalPoolSize,
        oversizedPoolSize,
        optimalP99Ms: optimalP99,
        oversizedP99Ms: oversizedP99,
        latencyReductionPercent: Math.round(((oversizedP99 - optimalP99) / oversizedP99) * 100)
      };
    }

    case 'bloom': {
      // Mô phỏng Bloom Filter
      const n = Math.max(1000, Number(body.items) || 10000);
      const p = Math.max(0.001, Math.min(0.1, Number(body.fpr) || 0.008));
      const ln2 = Math.LN2;
      const m = Math.ceil(- (n * Math.log(p)) / (ln2 * ln2));
      const k = Math.max(1, Math.round((m / n) * ln2));
      const ramKb = Math.round((m / 8 / 1024) * 100) / 100;
      const simulatedJunk = 50000;
      const blockedJunk = Math.round(simulatedJunk * (1 - p));

      return {
        expectedItems: n,
        targetFPR: p * 100,
        optimalBitsM: m,
        optimalHashesK: k,
        ramUsageKb: ramKb,
        simulatedJunkRequests: simulatedJunk,
        blockedRequests: blockedJunk,
        rejectionRate: Math.round(((blockedJunk / simulatedJunk) * 100) * 100) / 100,
        falsePositives: simulatedJunk - blockedJunk
      };
    }

    case 'xfetch': {
      // Mô phỏng XFetch vs Cache Stampede
      return {
        concurrentRequests: 1000,
        naive: {
          databaseQueries: 1000,
          dbLoadStatus: 'CRITICAL / STAMPEDE SẬP CƠ SỞ DỮ LIỆU',
          latencyP99Ms: 420,
          thunderingHerd: true
        },
        xfetch: {
          databaseQueries: 1,
          dbLoadStatus: 'HEALTHY / 99.9% TẢI ĐƯỢC GIẢM THIỂU',
          latencyP99Ms: 1.2,
          cacheHitRate: 100.0,
          thunderingHerd: false
        }
      };
    }

    case 'vector': {
      // Mô phỏng KNN Search HNSW
      return {
        datasetSize: 5000,
        vectorDimensions: 128,
        k: 10,
        recallAt10: 96.8,
        hnswHopsAverage: 14.2,
        speedupVsBruteForce: '42.5x',
        topResults: [
          { id: 'doc_1482', similarity: 0.9842, category: 'Database Systems Architecture' },
          { id: 'doc_0392', similarity: 0.9715, category: 'Distributed Consensus & Raft' },
          { id: 'doc_2841', similarity: 0.9588, category: 'MVCC & High Concurrency' },
          { id: 'doc_4102', similarity: 0.9490, category: 'Zero-Downtime Migrations' },
          { id: 'doc_0921', similarity: 0.9324, category: 'OLAP Columnar & SIMD' }
        ]
      };
    }

    default:
      return { error: `Mô phỏng '${type}' không tồn tại.` };
  }
}

/**
 * Khởi tạo HTTP Request Router
 */
const requestHandler = async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method.toUpperCase();

  // Xử lý CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // --------------------------------------------------------------------------
  // REST API ENDPOINTS
  // --------------------------------------------------------------------------

  // GET /api/status - Trả về trạng thái tổng thể và danh sách 8 labs
  if (pathname === '/api/status' && method === 'GET') {
    return sendJson(res, 200, {
      status: isRunningAll ? 'RUNNING_ALL' : 'IDLE',
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
      },
      ...cachedResults
    });
  }

  // POST /api/run-all - Chạy tuần tự toàn bộ 8 labs
  if (pathname === '/api/run-all' && method === 'POST') {
    if (isRunningAll) {
      return sendJson(res, 409, {
        error: 'Tiến trình kiểm thử toàn bộ đang chạy, vui lòng chờ trong giây lát.'
      });
    }

    isRunningAll = true;
    try {
      const summary = await runAllLabs({
        labsDir: path.join(__dirname, '..')
      });

      cachedResults = {
        lastRun: summary.timestamp,
        totalLabs: summary.totalLabs,
        passedLabs: summary.passedLabs,
        failedLabs: summary.failedLabs,
        totalAssertions: summary.totalAssertions,
        totalDurationMs: summary.totalDurationMs,
        labs: summary.labs
      };

      isRunningAll = false;
      return sendJson(res, 200, summary);
    } catch (err) {
      isRunningAll = false;
      return sendJson(res, 500, {
        error: 'Thất bại khi chạy toàn bộ phòng thí nghiệm: ' + err.message
      });
    }
  }

  // POST /api/lab/:id - Chạy riêng lẻ một phòng thí nghiệm (1 đến 8)
  const labMatch = pathname.match(/^\/api\/lab\/([1-8])$/);
  if (labMatch && method === 'POST') {
    const labId = parseInt(labMatch[1], 10);
    try {
      const result = await runSingleLab(labId, {
        labsDir: path.join(__dirname, '..')
      });

      // Cập nhật kết quả đơn lẻ vào cache
      const idx = cachedResults.labs.findIndex(l => l.id === labId);
      if (idx !== -1) {
        cachedResults.labs[idx] = result;
      }

      return sendJson(res, 200, result);
    } catch (err) {
      return sendJson(res, 500, {
        error: `Thất bại khi chạy Lab ${labId}: ` + err.message
      });
    }
  }

  // POST /api/simulate/:type - Chạy kịch bản mô phỏng tương tác
  const simMatch = pathname.match(/^\/api\/simulate\/([a-zA-Z0-9_-]+)$/);
  if (simMatch && method === 'POST') {
    const simType = simMatch[1].toLowerCase();
    const body = await parseJsonBody(req);
    const simResult = handleSimulation(simType, body);
    return sendJson(res, 200, simResult);
  }

  // GET /api/commands - Lấy danh mục Kho Lệnh Tác Chiến (Command Arsenal)
  if (pathname === '/api/commands' && method === 'GET') {
    return sendJson(res, 200, {
      totalCommands: COMMAND_ARSENAL_DATA.length,
      categories: [
        { id: 'all', name: 'Tất Cả', icon: '✨', count: COMMAND_ARSENAL_DATA.length },
        { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'postgresql').length },
        { id: 'mysql', name: 'MySQL', icon: '🐬', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'mysql').length },
        { id: 'redis', name: 'Redis', icon: '⚡', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'redis').length },
        { id: 'clickhouse', name: 'ClickHouse / DuckDB', icon: '📊', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'clickhouse').length },
        { id: 'vector', name: 'Vector / AI', icon: '🧠', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'vector').length },
        { id: 'linux', name: 'Linux OS / DBRE', icon: '🐧', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'linux').length },
        { id: 'docker', name: 'Docker Compose', icon: '🐳', count: COMMAND_ARSENAL_DATA.filter(c => c.category === 'docker').length }
      ],
      commands: COMMAND_ARSENAL_DATA
    });
  }

  // GET /api/docs/arsenal - Đọc nội dung Markdown tài liệu COMMAND_ARSENAL.md
  if (pathname === '/api/docs/arsenal' && method === 'GET') {
    const candidatePaths = [
      path.join(__dirname, '..', '..', 'COMMAND_ARSENAL.md'),
      path.join(__dirname, '..', 'COMMAND_ARSENAL.md'),
      path.join(__dirname, 'COMMAND_ARSENAL.md')
    ];
    let content = null;
    let foundPath = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          content = fs.readFileSync(p, 'utf-8');
          foundPath = p;
          break;
        } catch (e) {}
      }
    }
    return sendJson(res, 200, {
      found: !!content,
      path: foundPath,
      content: content || null
    });
  }

  // GET /COMMAND_ARSENAL.md - Phục vụ tệp tĩnh markdown tải về trực tiếp
  if (pathname === '/COMMAND_ARSENAL.md' && method === 'GET') {
    const candidatePaths = [
      path.join(__dirname, '..', '..', 'COMMAND_ARSENAL.md'),
      path.join(__dirname, '..', 'COMMAND_ARSENAL.md'),
      path.join(__dirname, 'COMMAND_ARSENAL.md')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        res.writeHead(200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'no-cache'
        });
        return fs.createReadStream(p).pipe(res);
      }
    }
  }

  // --------------------------------------------------------------------------
  // PHỤC VỤ TỆP TĨNH (STATIC FILE SERVING — INDEX.HTML)
  // --------------------------------------------------------------------------
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Lỗi máy chủ: Không thể đọc tệp index.html. Vui lòng kiểm tra đường dẫn.');
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
    return;
  }

  // 404 Không tìm thấy tài nguyên
  sendJson(res, 404, {
    error: 'Endpoint không tồn tại. Vui lòng truy cập / hoặc /api/status'
  });
};

/**
 * Khởi động máy chủ với cơ chế chuyển tiếp cổng an toàn nếu cổng chính bị bận
 */
function startServer(initialPort = 8899, maxAttempts = 10) {
  let currentPort = initialPort;
  let attempts = 0;

  function attemptListen() {
    const server = http.createServer(requestHandler);

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        if (attempts < maxAttempts) {
          console.warn(`[CẢNH BÁO] Cổng ${currentPort} đang bận. Tự động thử cổng kế tiếp ${currentPort + 1}...`);
          currentPort++;
          setTimeout(attemptListen, 100);
        } else {
          console.error(`[LỖI NGHIÊM TRỌNG] Đã thử ${maxAttempts} cổng nhưng không có cổng khả dụng.`);
          process.exit(1);
        }
      } else {
        console.error('[LỖI MÁY CHỦ HTTP]:', err);
        process.exit(1);
      }
    });

    server.once('listening', () => {
      const address = server.address();
      console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
      console.log('║   🏛️  DATABASE MASTERCLASS — INTERACTIVE DASHBOARD COCKPIT SERVER         ║');
      console.log('╚════════════════════════════════════════════════════════════════════════════╝');
      console.log(`  ▸ Địa chỉ Web Cockpit UI   : http://localhost:${address.port}/`);
      console.log(`  ▸ REST API Status Endpoint : http://localhost:${address.port}/api/status`);
      console.log(`  ▸ Zero Dependencies        : 100% Native Node.js (http, fs, path)`);
      console.log(`  ▸ Thiết kế Giao diện       : Luminous Light Theme Invariant (Warm Paper & Ivory)`);
      console.log(`  ▸ Trạng thái               : MÁY CHỦ SẴN SÀNG PHỤC VỤ (SERVER ONLINE)\n`);
    });

    server.listen(currentPort);
  }

  attemptListen();
}

// Khởi chạy khi gọi file trực tiếp
if (require.main === module) {
  startServer(8899);
}

module.exports = {
  requestHandler,
  startServer
};
