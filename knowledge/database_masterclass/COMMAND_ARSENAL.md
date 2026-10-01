# 🚀 DATABASE MASTERCLASS: COMMAND ARSENAL & PRODUCTION RUNBOOK
## 📖 Sổ Tay Tác Chiến & Cứu Hỏa Cơ Sở Dữ Liệu Tầng Sâu Dành Cho DBRE & Backend Engineers

> **Tiêu chuẩn Biên soạn**: 100% Thực chiến (`Battle-Tested`), Sẵn sàng sao chép (`Copy-Paste Ready`), Chú giải Song ngữ `English (Tiếng Việt)`.  
> **Phạm vi Bao phủ**: PostgreSQL 16+, MySQL 8.0+ InnoDB, Redis 7.x/8.x, ClickHouse 24 LTS, DuckDB 1.0+, pgvector & Qdrant, Linux OS Kernel Optimization, DBRE Backup/PITR, All-in-One Compose.

---

# MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)
- [1. 🐘 Phân Hệ PostgreSQL: Bộ Lệnh Cứu Hỏa & Chẩn Đoán Sâu (Top 25 Queries)](#1--phân-hệ-postgresql-bộ-lệnh-cứu-hỏa--chẩn-đoán-sâu-top-25-queries)
- [2. 🐬 Phân Hệ MySQL 8.0+ InnoDB: Bộ Lệnh Chẩn Đoán Tầng Sâu (Top 15 Queries)](#2--phân-hệ-mysql-80-innodb-bộ-lệnh-chẩn-đoán-tầng-sâu-top-15-queries)
- [3. ⚡ Phân Hệ Redis 7.x/8.x: Sổ Tay CLI Quản Trị Bộ Nhớ & Tốc Độ (Top 15 Commands)](#3--phân-hệ-redis-7x8x-sổ-tay-cli-quản-trị-bộ-nhớ--tốc-độ-top-15-commands)
- [4. 📊 Phân Hệ ClickHouse & DuckDB: Sổ Tay Quản Trị Phân Tích (Top 15 Commands)](#4--phân-hệ-clickhouse--duckdb-sổ-tay-quản-trị-phân-tích-top-15-commands)
- [5. 🧠 Phân Hệ Vector Database & AI Retrieval: SQL & CLI Thực Chiến (Top 10 Commands)](#5--phân-hệ-vector-database--ai-retrieval-sql--cli-thực-chiến-top-10-commands)
- [6. 🛡️ Phân Hệ DBRE, Sao Lưu & Khôi Phục Thảm Họa (Top 10 Commands)](#6-️-phân-hệ-dbre-sao-lưu--khôi-phục-thảm-họa-top-10-commands)
- [7. 🐧 Phân Hệ Linux OS & Kernel Tuning Cho Database Server (Top 10 One-Liners)](#7--phân-hệ-linux-os--kernel-tuning-cho-database-server-top-10-one-liners)
- [8. 🐳 Kịch Bản Khởi Tạo Môi Trường Đa Cơ Sở Dữ Liệu Sẵn Dùng (All-in-One Docker Compose)](#8--kịch-bản-khởi-tạo-môi-trường-đa-cơ-sở-dữ-liệu-sẵn-dùng-all-in-one-docker-compose)

---

# 1. 🐘 Phân Hệ PostgreSQL: Bộ Lệnh Cứu Hỏa & Chẩn Đoán Sâu (Top 25 Queries)

### Query 01: Top 10 Câu Truy Vấn Chiếm Nhiều Thời Gian Thực Thi Nhất (`Top Slow Queries by Total Time`)
> **Mục đích**: Tìm các câu truy vấn làm nghẽn CPU và chiếm dụng tài nguyên tổng thể lớn nhất hệ thống qua extension `pg_stat_statements`.

```sql
SELECT 
    round(total_exec_time::numeric, 2) AS total_time_ms,
    calls,
    round(mean_exec_time::numeric, 2) AS mean_time_ms,
    round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS pct_total_time,
    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS cache_hit_ratio,
    substr(query, 1, 120) AS query_preview
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```
* **Ý nghĩa chỉ số**:
  * `total_exec_time`: Tổng thời gian thực thi tích lũy (`Accumulated Execution Time`).
  * `cache_hit_ratio`: Tỷ lệ trúng bộ đệm RAM (`Cache Hit Ratio`). Nếu $< 99\%$, câu query đang gây áp lực đọc đĩa (`Disk I/O`).

---

### Query 02: Top Truy Vấn Có Thời Gian Phản Hồi Trung Bình Cao Nhất (`Top Mean Execution Latency`)
> **Mục đích**: Bắt các câu query cực chậm trên từng lần gọi (`Latency Spikes`), gây nghẽn luồng xử lý ứng dụng.

```sql
SELECT 
    round(mean_exec_time::numeric, 2) AS mean_time_ms,
    round(stddev_exec_time::numeric, 2) AS stddev_ms,
    round(min_exec_time::numeric, 2) AS min_ms,
    round(max_exec_time::numeric, 2) AS max_ms,
    calls,
    substr(query, 1, 120) AS query_snippet
FROM pg_stat_statements
WHERE calls >= 10 -- Lọc bỏ các truy vấn hiếm gặp / DDL 1 lần
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

### Query 03: Top Truy Vấn Gây Đọc Đĩa Vật Lý Nhiều Nhất (`Highest Physical Disk Reads`)
> **Mục đích**: Phát hiện các truy vấn quét cạn (`Full Table Scans`) gây tốn băng thông I/O lưu trữ (`Disk Read Saturation`).

```sql
SELECT 
    shared_blks_read,
    shared_blks_hit,
    round((100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0))::numeric, 2) AS hit_percent,
    calls,
    round((shared_blks_read / calls)::numeric, 1) AS avg_blocks_read_per_call,
    substr(query, 1, 100) AS query_text
FROM pg_stat_statements
WHERE shared_blks_read > 0
ORDER BY shared_blks_read DESC
LIMIT 10;
```

---

### Query 04: Dựng Cây Khóa Đang Tranh Chấp & Tiến Trình Gây Nghẽn (`Live Lock Tree & Blocker PIDs`)
> **Mục đích**: Phát hiện chính xác PID đang giữ khóa (`Blocking PID`) và danh sách các PID đang bị chặn (`Blocked PIDs`).

```sql
WITH RECURSIVE lock_tree AS (
    SELECT 
        blocked_locks.pid AS blocked_pid,
        blocking_locks.pid AS blocking_pid,
        blocked_activity.usename AS blocked_user,
        blocking_activity.usename AS blocking_user,
        blocked_activity.query AS blocked_statement,
        blocking_activity.query AS current_statement_in_blocking_process
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
    WHERE NOT blocked_locks.granted
)
SELECT 
    blocking_pid,
    blocking_user,
    blocked_pid,
    blocked_user,
    substr(blocked_statement, 1, 100) AS blocked_query,
    substr(current_statement_in_blocking_process, 1, 100) AS blocker_query
FROM lock_tree;
```

---

### Query 05: Thống Kê Chi Tiết Khóa Đang Giữ Theo Quan Hệ (`Locks by Relation and Mode`)
> **Mục đích**: Xem các bảng nào đang bị khóa độc quyền (`ExclusiveLock`) làm tê liệt tiến trình đọc/ghi.

```sql
SELECT 
    pg_class.relname AS relation_name,
    pg_locks.mode AS lock_mode,
    pg_locks.granted,
    count(*) AS lock_count,
    array_agg(pg_locks.pid) AS holder_pids
FROM pg_locks
JOIN pg_class ON pg_locks.relation = pg_class.oid
WHERE pg_class.relnamespace NOT IN (SELECT oid FROM pg_namespace WHERE nspname LIKE 'pg_%')
GROUP BY pg_class.relname, pg_locks.mode, pg_locks.granted
ORDER BY pg_class.relname, pg_locks.mode;
```

---

### Query 06: Truy Tìm Các Phiên `idle in transaction` Kéo Dài Gây Kẹt Xmin Horizon
> **Mục đích**: `idle in transaction` ngăn cản Autovacuum thu dọn tuple rác (`Dead Tuples`), gây phình to bảng (`Table Bloat`) nghiêm trọng.

```sql
SELECT 
    pid,
    usename,
    client_addr,
    application_name,
    state,
    backend_xmin,
    round(EXTRACT(EPOCH FROM (now() - state_change))::numeric, 1) AS idle_duration_sec,
    round(EXTRACT(EPOCH FROM (now() - xact_start))::numeric, 1) AS transaction_age_sec,
    query AS last_query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND (now() - state_change) > interval '60 seconds'
ORDER BY state_change ASC;
```

---

### Query 07: Cưỡng Chế Ngắt (Kill) Toàn Bộ Phiên `idle in transaction` Quá 5 Phút
> **Mục đích**: Giải phóng xmin horizon ngay lập tức bằng `pg_terminate_backend`.

```sql
SELECT 
    pid,
    usename,
    pg_terminate_backend(pid) AS terminated,
    (now() - state_change) AS idle_time,
    query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND (now() - state_change) > interval '5 minutes'
  AND pid <> pg_backend_pid();
```

---

### Query 08: Hủy Truy Vấn An Toàn (`Cancel Query`) vs Ngắt Kết Nối Cưỡng Bức (`Terminate Session`)
> **Mục đích**: Phân biệt giữa gửi tín hiệu `SIGINT` (dừng truy vấn, giữ kết nối) và `SIGTERM` (đóng hẳn kết nối socket).

```sql
-- 1. Hủy truy vấn an toàn (Graceful Cancel - Tương đương Ctrl+C, gửi SIGINT)
SELECT pg_cancel_backend(12345);

-- 2. Ngắt hẳn phiên kết nối (Force Kill - Gửi SIGTERM, đóng connection)
SELECT pg_terminate_backend(12345);

-- 3. Ngắt tất cả các truy vấn chạy quá 10 phút (ngoại trừ chính phiên đang chạy)
SELECT 
    pid, 
    pg_terminate_backend(pid) AS killed,
    round(EXTRACT(EPOCH FROM (now() - query_start))::numeric, 1) AS runtime_sec,
    query
FROM pg_stat_activity
WHERE state = 'active'
  AND (now() - query_start) > interval '10 minutes'
  AND pid <> pg_backend_pid();
```

---

### Query 09: Ước Tính Độ Phình To Bảng (`Table Bloat & Dead Tuples Ratio`)
> **Mục đích**: Nhận diện các bảng chứa tỷ lệ rác cao cần Autovacuum gấp hoặc Repack.

```sql
SELECT 
    schemaname,
    relname AS table_name,
    n_live_tup AS live_tuples,
    n_dead_tup AS dead_tuples,
    round((100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0))::numeric, 2) AS dead_tuple_ratio_pct,
    last_vacuum,
    last_autovacuum,
    last_analyze
FROM pg_stat_user_tables
WHERE (n_live_tup + n_dead_tup) > 1000
ORDER BY dead_tuple_ratio_pct DESC
LIMIT 15;
```

---

### Query 10: Ước Tính Dung Lượng Phình To Bảng & Index Không Cần Khóa Bảng (`Bloat Estimation`)
> **Mục đích**: Tính toán dung lượng lãng phí thực tế tính bằng Megabytes mà không gây ảnh hưởng hiệu năng.

```sql
SELECT
    schemaname || '.' || relname AS table_full_name,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS indexes_size,
    n_dead_tup AS dead_records,
    round(n_dead_tup * 100.0 / nullif(n_live_tup + n_dead_tup, 0), 1) AS dead_pct,
    autovacuum_count
FROM pg_stat_user_tables
ORDER BY pg_relation_size(relid) DESC
LIMIT 15;
```

---

### Query 11: Phát Hiện Toàn Bộ Chỉ Mục Không Bao Giờ Được Dùng (`Unused Indexes`)
> **Mục đích**: Xóa bớt các chỉ mục thừa để tăng tốc ghi (`INSERT/UPDATE/DELETE`) và tiết kiệm RAM `shared_buffers`.

```sql
SELECT 
    schemaname || '.' || relname AS table_name,
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
    idx_scan AS number_of_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes i
JOIN pg_index USING (indexrelid)
WHERE idx_scan = 0
  AND indisunique IS FALSE
  AND indisprimary IS FALSE
ORDER BY pg_relation_size(i.indexrelid) DESC;
```
> [!WARNING]
> Không xóa index trên bảng mới tạo hoặc partition vừa khởi tạo chưa qua chu kỳ tải đỉnh (`Peak Load Cycle`).

---

### Query 12: Phát Hiện Chỉ Mục Trùng Lặp & Bao Trùm Dư Thừa (`Duplicate & Redundant Indexes`)
> **Mục đích**: Phát hiện các chỉ mục có chung tập cột dẫn đầu (`Leading Columns`).

```sql
SELECT
    indrelid::regclass AS table_name,
    indexrelid::regclass AS redundant_index,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    pg_get_indexdef(indexrelid) AS redundant_index_def
FROM pg_index
WHERE indisvalid
  AND indisprimary IS FALSE
  AND EXISTS (
      SELECT 1 FROM pg_index i2
      WHERE i2.indrelid = pg_index.indrelid
        AND i2.indexrelid != pg_index.indexrelid
        AND i2.indisvalid
        AND (
            pg_index.indkey[0:array_length(pg_index.indkey, 1)] <@ i2.indkey[0:array_length(i2.indkey, 1)]
            OR pg_get_expr(pg_index.indexprs, pg_index.indrelid) = pg_get_expr(i2.indexprs, i2.indrelid)
        )
  )
ORDER BY table_name;
```

---

### Query 13: Đo Nguy Cơ Tràn Định Danh Giao Dịch (`Transaction ID Wraparound Horizon`)
> **Mục đích**: Đảm bảo khoảng cách tới mốc 2 tỷ transaction an toàn tuyệt đối. Nếu chạm ngưỡng, PostgreSQL sẽ cưỡng chế chuyển sang chế độ `read-only`.

```sql
SELECT 
    datname,
    age(datfrozenxid) AS xid_age,
    2147483648 - age(datfrozenxid) AS tx_until_wraparound,
    round(100.0 * age(datfrozenxid) / 2147483648, 2) AS wraparound_consumed_pct,
    current_setting('autovacuum_freeze_max_age')::bigint AS freeze_max_age
FROM pg_database
WHERE datallowconn
ORDER BY xid_age DESC;
```

---

### Query 14: Đo Tuổi Thọ Multixact ID (`Multixact ID Wraparound Horizon`)
> **Mục đích**: Tránh cạn kiệt Multixact IDs sinh ra khi nhiều transaction cùng giữ khóa chia sẻ (`SHARE locks / FOR SHARE`).

```sql
SELECT 
    datname,
    mxid_age(datminmxid) AS mxid_age,
    4294967295 - mxid_age(datminmxid) AS mxid_until_wraparound,
    round(100.0 * mxid_age(datminmxid) / 2147483648, 2) AS mxid_consumed_pct
FROM pg_database
WHERE datallowconn
ORDER BY mxid_age DESC;
```

---

### Query 15: Kiểm Tra Tỷ Lệ Trúng Bộ Đệm Toàn Hệ Thống (`Buffer Cache Hit Ratio`)
> **Mục đích**: Đo lường PostgreSQL đang phục vụ truy vấn từ RAM hay phải đọc từ ổ cứng. Chuẩn production khuyến nghị $\ge 99\%$.

```sql
SELECT 
    sum(blks_hit) AS disk_blocks_hit,
    sum(blks_read) AS disk_blocks_read,
    round((100.0 * sum(blks_hit) / nullif(sum(blks_hit) + sum(blks_read), 0))::numeric, 3) AS global_cache_hit_pct
FROM pg_stat_database;
```

---

### Query 16: Kiểm Tra Cache Hit Ratio Từng Bảng Cụ Thể (`Table-Level Cache Hit Ratio`)
> **Mục đích**: Định vị bảng nào có kích thước vượt quá bộ nhớ `shared_buffers` khiến dữ liệu liên tục bị đẩy ra đĩa (`Cache Thrashing`).

```sql
SELECT 
    relname AS table_name,
    heap_blks_read AS disk_reads,
    heap_blks_hit AS ram_hits,
    round((100.0 * heap_blks_hit / nullif(heap_blks_hit + heap_blks_read, 0))::numeric, 2) AS cache_hit_pct
FROM pg_statio_user_tables
WHERE (heap_blks_read + heap_blks_hit) > 5000
ORDER BY disk_reads DESC
LIMIT 15;
```

---

### Query 17: Giám Sát Độ Trễ Nhân Bản Vật Lý (`Physical Replication Lag in Bytes & LSN`)
> **Mục đích**: Kiểm tra khoảng cách LSN và độ trễ thời gian giữa Master và các Standby Replicas.

```sql
SELECT 
    application_name,
    client_addr,
    state,
    sync_state,
    round(EXTRACT(EPOCH FROM (now() - replay_lsn_timestamp))::numeric, 2) AS replay_lag_seconds,
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn)) AS sent_lag_bytes,
    pg_size_pretty(pg_wal_lsn_diff(sent_lsn, write_lsn)) AS write_lag_bytes,
    pg_size_pretty(pg_wal_lsn_diff(write_lsn, flush_lsn)) AS flush_lag_bytes,
    pg_size_pretty(pg_wal_lsn_diff(flush_lsn, replay_lsn)) AS replay_lag_bytes,
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) AS total_lag_bytes
FROM pg_stat_replication;
```

---

### Query 18: Kiểm Tra Replication Slot Lag & WAL Retention Risk
> **Mục đích**: Ngăn ngừa trường hợp Replication Slot bị ngắt kết nối nhưng vẫn giữ chân WAL files làm đầy ổ cứng 100%.

```sql
SELECT 
    slot_name,
    plugin,
    slot_type,
    active,
    wal_status,
    pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal_bytes
FROM pg_replication_slots;
```

---

### Query 19: Tạo Index Không Khóa Bảng & Xử Lý Index Bị Lỗi (`CREATE INDEX CONCURRENTLY`)
> **Mục đích**: Tạo chỉ mục trên bảng hàng trăm triệu dòng mà không chặn luồng `INSERT/UPDATE/DELETE`.

```sql
-- 1. Tạo index đồng thời (Non-blocking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_created 
ON orders (user_id, created_at DESC);

-- 2. Kiểm tra các index bị invalid do quá trình concurrent bị đứt quãng
SELECT 
    indrelid::regclass AS table_name,
    indexrelid::regclass AS index_name,
    indisvalid
FROM pg_index
WHERE indisvalid IS FALSE;

-- 3. Xử lý index bị invalid (Phải xóa CONCURRENTLY rồi tạo lại)
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_user_created;
```

---

### Query 20: Hủy Chỉ Mục Không Khóa Bảng (`DROP INDEX CONCURRENTLY`)
> **Mục đích**: Hủy bỏ chỉ mục thừa mà không chiếm độc quyền `AccessExclusiveLock`.

```sql
-- Chạy độc lập ngoài transaction block (Autocommit mode)
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_legacy_flag;
```

---

### Query 21: Chạy `pg_repack` Tái Cấu Trúc Bảng Trực Tuyến Trả Dung Lượng Đĩa Cho OS
> **Mục đích**: Thay thế `VACUUM FULL` (vốn khóa chặt bảng `AccessExclusiveLock`) bằng `pg_repack` chạy song song không gián đoạn dịch vụ.

```bash
# Cài đặt extension trên database trước
# psql -d production_db -c "CREATE EXTENSION IF NOT EXISTS pg_repack;"

# Chạy repack trên 1 bảng đơn lẻ (Tối ưu I/O)
pg_repack -h localhost -p 5432 -U postgres -d production_db --table public.audit_logs

# Chạy repack trên toàn bộ database với 4 workers song song
pg_repack -h localhost -p 5432 -U postgres -d production_db -j 4
```

---

### Query 22: Giám Sát Tiến Trình Chạy Autovacuum Real-time (`pg_stat_progress_vacuum`)
> **Mục đích**: Xem Autovacuum đang chạy ở pha nào, quét được bao nhiêu phần trăm dung lượng.

```sql
SELECT 
    p.pid,
    c.relname AS table_name,
    p.phase,
    round(100.0 * p.heap_blks_scanned / nullif(p.heap_blks_total, 0), 2) AS scan_progress_pct,
    round(100.0 * p.heap_blks_vacuumed / nullif(p.heap_blks_total, 0), 2) AS vacuum_progress_pct,
    p.num_dead_tuples,
    p.max_dead_tuples
FROM pg_stat_progress_vacuum p
JOIN pg_class c ON p.relid = c.oid;
```

---

### Query 23: Giám Sát Ghi File Tạm Do Cạn Kiệt `work_mem` (`Temporary Files Usage`)
> **Mục đích**: Truy tìm các câu lệnh thực hiện `SORT` hoặc `HASH JOIN` tràn bộ nhớ phải ghi xuống ổ đĩa (`Spill to disk`).

```sql
SELECT 
    datname,
    temp_files AS total_temp_files_created,
    pg_size_pretty(temp_bytes) AS total_temp_bytes_spilled
FROM pg_stat_database
ORDER BY temp_bytes DESC;

-- Kiểm tra truy vấn cụ thể trong pg_stat_statements tạo nhiều temp files nhất
SELECT 
    query,
    temp_blks_written,
    calls,
    round((temp_blks_written * 8192 / nullif(calls, 0) / 1024 / 1024)::numeric, 2) AS avg_mb_spilled_per_call
FROM pg_stat_statements
WHERE temp_blks_written > 0
ORDER BY temp_blks_written DESC
LIMIT 10;
```

---

### Query 24: Kiểm Tra Nguy Cơ Tràn Số Của Kiểu Dữ Liệu Khóa Chính (`Sequence Integer Overflow`)
> **Mục đích**: Bắt kịp thời điểm cột `INT4` (2.14 tỷ) sắp cạn kiệt trước khi gây sập hệ thống ghi.

```sql
SELECT 
    schemaname,
    sequencename,
    data_type,
    last_value,
    max_value,
    round((100.0 * last_value / nullif(max_value, 0))::numeric, 2) AS usage_percent
FROM pg_sequences
WHERE max_value IS NOT NULL
  AND round((100.0 * last_value / nullif(max_value, 0))::numeric, 2) > 75.0
ORDER BY usage_percent DESC;
```

---

### Query 25: Phân Tích Trạng Thái Hồ Bơi Kết Nối (`Connection State & Saturation`)
> **Mục đích**: Đánh giá độ bão hòa kết nối so với `max_connections`.

```sql
SELECT 
    state,
    count(*) AS connection_count,
    round((100.0 * count(*) / current_setting('max_connections')::numeric), 2) AS pct_of_max_conn
FROM pg_stat_activity
GROUP BY state;
```

---

# 2. 🐬 Phân Hệ MySQL 8.0+ InnoDB: Bộ Lệnh Chẩn Đoán Tầng Sâu (Top 15 Queries)

### Query 26: Trích Xuất & Bóc Tách Deadlock Từ `SHOW ENGINE INNODB STATUS`
> **Mục đích**: Phân tích khối `LATEST DETECTED DEADLOCK` và `TRANSACTIONS` để chỉ ra đúng câu lệnh và bản ghi gây xung đột.

```sql
-- Xuất trạng thái chi tiết của InnoDB Engine
SHOW ENGINE INNODB STATUS\G

-- Kích hoạt ghi nhận toàn bộ Deadlock vào MySQL Error Log
SET GLOBAL innodb_print_all_deadlocks = ON;
```
* **Bóc tách khối trọng yếu cần soi**:
  1. `LATEST DETECTED DEADLOCK`: Xem 2 transaction (Transaction 1 và Transaction 2), câu SQL cuối cùng thực thi, loại khóa đòi giữ (`lock_mode X waiting`), và transaction nào bị `ROLLBACK` làm nạn nhân (`victim`).
  2. `TRANSACTIONS`: Xem `History list length` (HLL), transaction active bao nhiêu giây.
  3. `SEMAPHORES`: Kiểm tra `OS WAIT ARRAY INFO` xem có luồng nào chờ Mutex $> 240$ giây không.

---

### Query 27: Top Truy Vấn Chậm Theo Tổng Thời Gian Chờ (`sys.statement_analysis`)
> **Mục đích**: Khai thác `sys schema` của MySQL 8.0 để tìm các câu lệnh chiếm dụng CPU cao nhất.

```sql
SELECT 
    query,
    exec_count,
    total_latency,
    avg_latency,
    rows_sent,
    rows_examined,
    round(rows_examined / nullif(rows_sent, 0), 1) AS examined_per_sent_ratio,
    full_scan
FROM sys.statement_analysis
ORDER BY total_latency DESC
LIMIT 10;
```

---

### Query 28: Phát Hiện Các Truy Vấn Quét Toàn Bảng (`sys.statements_with_full_table_scans`)
> **Mục đích**: Nhận diện các câu SQL thiếu Index dẫn đến việc quét toàn bộ triệu dòng dữ liệu.

```sql
SELECT 
    query,
    db,
    exec_count,
    total_latency,
    no_index_used_count,
    no_good_index_used_count,
    round(rows_examined / exec_count, 0) AS avg_rows_scanned
FROM sys.statements_with_full_table_scans
WHERE db NOT IN ('sys', 'mysql', 'performance_schema', 'information_schema')
ORDER BY total_latency DESC
LIMIT 10;
```

---

### Query 29: Phát Hiện Chỉ Mục Không Được Sử Dụng Trên MySQL (`sys.schema_unused_indexes`)
> **Mục đích**: Dọn dẹp index thừa trên MySQL để giải phóng không gian bộ nhớ đệm Buffer Pool.

```sql
SELECT 
    object_schema AS schema_name,
    object_name AS table_name,
    index_name
FROM sys.schema_unused_indexes
WHERE object_schema NOT IN ('mysql', 'sys')
ORDER BY object_schema, object_name;
```

---

### Query 30: Phát Hiện Chỉ Mục Dư Thừa & Trùng Lặp Cột Đầu (`sys.schema_redundant_indexes`)
> **Mục đích**: Phát hiện Index A dư thừa vì đã có Index B bao trùm.

```sql
SELECT 
    table_schema,
    table_name,
    redundant_index_name,
    redundant_index_columns,
    dominant_index_name,
    dominant_index_columns,
    subpart_exists,
    sql_drop_index
FROM sys.schema_redundant_indexes;
```

---

### Query 31: Truy Tìm Metadata Lock (MDL) Đang Chặn DDL (`Blocking Metadata Locks`)
> **Mục đích**: Khi chạy `ALTER TABLE` bị treo ở trạng thái `Waiting for table metadata lock`, tìm chính xác thread đang giữ khóa để tiêu diệt.

```sql
SELECT 
    ml.OBJECT_SCHEMA,
    ml.OBJECT_NAME,
    ml.LOCK_TYPE,
    ml.LOCK_DURATION,
    ml.LOCK_STATUS,
    t.PROCESSLIST_ID AS blocking_thread_id,
    t.PROCESSLIST_USER AS blocking_user,
    t.PROCESSLIST_HOST AS blocking_host,
    t.PROCESSLIST_INFO AS current_statement
FROM performance_schema.metadata_locks ml
JOIN performance_schema.threads t ON ml.OWNER_THREAD_ID = t.THREAD_ID
WHERE ml.OBJECT_TYPE = 'TABLE'
  AND ml.LOCK_STATUS = 'GRANTED'
  AND ml.OBJECT_SCHEMA NOT IN ('mysql', 'performance_schema', 'sys');
```

---

### Query 32: Giám Sát Chiều Dài Undo Log & Lịch Sử Purge (`History List Length - HLL`)
> **Mục đích**: Kiểm tra độ phình của Undo Log do các giao dịch đọc dài hạn (`Long-running Read Transactions`) gây ra.

```sql
SELECT 
    NAME, 
    COUNT 
FROM information_schema.innodb_metrics 
WHERE NAME = 'trx_rseg_history_len';
```
> [!IMPORTANT]
> Nếu `trx_rseg_history_len` $> 1,000,000$, hiệu năng của toàn bộ cụm MySQL sẽ tụt dốc thảm hại do quá trình tìm kiếm phiên bản cũ (`MVCC Read View Traversal`) phải duyệt qua hàng triệu bản ghi trong Undo Log.

---

### Query 33: Tỷ Lệ Trang Bẩn Trong Buffer Pool & Tốc Độ Đẩy Xuống Đĩa (`Dirty Pages Ratio`)
> **Mục đích**: Đánh giá sức ép ghi đĩa của tiến trình `page cleaner` trong InnoDB.

```sql
SELECT 
    VARIABLE_NAME, 
    VARIABLE_VALUE 
FROM performance_schema.global_status 
WHERE VARIABLE_NAME IN (
    'Innodb_buffer_pool_pages_total',
    'Innodb_buffer_pool_pages_dirty',
    'Innodb_buffer_pool_pages_flushed',
    'Innodb_buffer_pool_wait_free'
);

-- Tính tỷ lệ phần trăm trang bẩn (Dirty Page Pct)
SELECT 
    ROUND(dirty.val / total.val * 100, 2) AS dirty_page_ratio_pct
FROM 
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_dirty') dirty,
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_total') total;
```

---

### Query 34: Tỷ Lệ Trúng Bộ Đệm InnoDB Buffer Pool (`Buffer Pool Hit Rate`)
> **Mục đích**: Đảm bảo bộ nhớ RAM cấp cho InnoDB đủ lớn để chứa hot data.

```sql
SELECT 
    ROUND(
        (1 - (reads.val / reads_req.val)) * 100, 
        3
    ) AS buffer_pool_hit_rate_pct
FROM 
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads') reads,
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests') reads_req;
```

---

### Query 35: Truy Vấn Các Giao Dịch Đang Chạy Quá Lâu Trong InnoDB (`Long Active Transactions`)
> **Mục đích**: Định vị chính xác thời điểm bắt đầu giao dịch và số lượng dòng đã bị khóa.

```sql
SELECT 
    trx.trx_id,
    trx.trx_state,
    trx.trx_started,
    TIMESTAMPDIFF(SECOND, trx.trx_started, NOW()) AS duration_sec,
    trx.trx_rows_locked,
    trx.trx_rows_modified,
    trx.trx_mysql_thread_id,
    ps.processlist_user,
    ps.processlist_host,
    ps.processlist_info AS current_query
FROM information_schema.innodb_trx trx
JOIN performance_schema.threads th ON trx.trx_mysql_thread_id = th.processlist_id
LEFT JOIN performance_schema.processlist ps ON th.processlist_id = ps.id
ORDER BY trx.trx_started ASC;
```

---

### Query 36: Tiêu Diệt Truy Vấn Hoặc Kết Nối Nghẽn (`KILL QUERY vs KILL CONNECTION`)
> **Mục đích**: Hủy nhanh phiên làm việc theo `processlist_id`.

```sql
-- 1. Hủy chỉ riêng câu truy vấn đang chạy (Kết nối TCP vẫn giữ nguyên)
KILL QUERY 10452;

-- 2. Đóng hẳn kết nối TCP socket và rollback toàn bộ giao dịch đang dở dang
KILL 10452;
```

---

### Query 37: Kiểm Tra Độ Trễ Nhân Bản & Khoảng Lùi GTID (`Replication Lag & GTID Gaps`)
> **Mục đích**: Giám sát Replica trong cụm MySQL Replication.

```sql
-- Dành cho MySQL 8.0.22+
SHOW REPLICA STATUS\G

-- Kiểm tra độ lệch GTID giữa Source và Replica
SELECT 
    SERVICE_STATE, 
    LAST_ERROR_NUMBER, 
    LAST_ERROR_MESSAGE, 
    COUNT_TRANSACTIONS_RETRIEVED, 
    COUNT_TRANSACTIONS_IN_QUEUE 
FROM performance_schema.replication_applier_status_by_worker;
```

---

### Query 38: Kiểm Tra Hàng Đợi Chờ Khóa Bảng Trong InnoDB (`InnoDB Lock Waits`)
> **Mục đích**: Xem thời gian chờ khóa của từng câu truy vấn và ID đối tượng bị tranh chấp.

```sql
SELECT 
    r.trx_id AS waiting_trx_id,
    r.trx_mysql_thread_id AS waiting_thread,
    r.trx_query AS waiting_query,
    b.trx_id AS blocking_trx_id,
    b.trx_mysql_thread_id AS blocking_thread,
    b.trx_query AS blocking_query
FROM sys.innodb_lock_waits;
```

---

### Query 39: Tỷ Lệ Tạo Bảng Tạm Trên Ổ Đĩa (`Disk Temporary Tables Ratio`)
> **Mục đích**: Xem các phép toán `GROUP BY`, `DISTINCT`, `UNION` có bị tràn RAM `tmp_table_size` / `max_heap_table_size` hay không.

```sql
SELECT 
    disk.val AS created_tmp_disk_tables,
    total.val AS created_tmp_tables,
    ROUND((disk.val / total.val) * 100, 2) AS disk_temp_table_pct
FROM 
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Created_tmp_disk_tables') disk,
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Created_tmp_tables') total;
```

---

### Query 40: Tỷ Lệ Bão Hòa Kết Nối Máy Chủ MySQL (`Max Connections Saturation`)
> **Mục đích**: Đánh giá áp lực kết nối để cấu hình hồ bơi kết nối (`Connection Pooling`).

```sql
SELECT 
    max_used.val AS max_used_connections,
    max_conf.val AS max_configured_connections,
    ROUND((max_used.val / max_conf.val) * 100, 2) AS connection_saturation_pct
FROM 
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_status WHERE VARIABLE_NAME = 'Max_used_connections') max_used,
    (SELECT VARIABLE_VALUE AS val FROM performance_schema.global_variables WHERE VARIABLE_NAME = 'max_connections') max_conf;
```

---

# 3. ⚡ Phân Hệ Redis 7.x/8.x: Sổ Tay CLI Quản Trị Bộ Nhớ & Tốc Độ (Top 15 Commands)

### Command 41: Quét Tìm Khóa Chiếm Dung Lượng Lớn Nhất An Toàn (`Safe Bigkeys Scan`)
> **Mục đích**: Dùng lệnh `SCAN` chạy nền với độ trễ điều tiết (`throttled sleep`) để tìm key khổng lồ mà không khóa luồng đơn (`Single-Thread Event Loop`).

```bash
# Quét tìm big keys, mỗi đợt dừng 10ms để tránh tăng độ trễ server
redis-cli -h 127.0.0.1 -p 6379 -a "StrongAuthPass" --bigkeys -i 0.01
```

---

### Command 42: Quét Tìm Khóa Ngốn Bộ Nhớ RAM Thực Tế Nhất (`Safe Memkeys Scan`)
> **Mục đích**: Tương tự `--bigkeys` nhưng đo đạc trực tiếp số bytes bộ nhớ thực tế (`allocations`) thay vì chỉ đếm số lượng phần tử.

```bash
redis-cli -h 127.0.0.1 -p 6379 -a "StrongAuthPass" --memkeys -i 0.01
```

---

### Command 43: Giám Sát Khóa Nóng Được Truy Cập Nhiều Nhất (`Real-Time Hotkeys Monitor`)
> **Mục đích**: Tìm các khóa chịu tải read/write cực lớn gây mất cân bằng cụm (`Cluster Hotspot`). Cần bật LFU eviction policy trước.

```bash
# Yêu cầu redis.conf cấu hình maxmemory-policy allkeys-lfu hoặc volatile-lfu
redis-cli -h 127.0.0.1 -p 6379 -a "StrongAuthPass" --hotkeys -i 0.01
```

---

### Command 44: Phân Tích Kích Thước Bộ Nhớ Chi Tiết Của Một Khóa (`Deep Key Memory Usage`)
> **Mục đích**: Đo chính xác dung lượng RAM phân bổ cho 1 key cùng các metadata overhead.

```bash
# Lấy dung lượng chính xác với 5 mẫu ngẫu nhiên cho cấu trúc lồng nhau
redis-cli MEMORY USAGE "user:session:104992" SAMPLES 5
```

---

### Command 45: Chẩn Đoán Sức Khỏe Bộ Nhớ Tự Động (`MEMORY DOCTOR`)
> **Mục đích**: Để Redis tự phân tích hiện trạng phân mảnh bộ nhớ (`Memory Fragmentation`) và đề xuất giải pháp.

```bash
redis-cli MEMORY DOCTOR
```

---

### Command 46: Giải Phóng Bộ Nhớ Phân Mảnh Ngay Lập Tức (`MEMORY PURGE & Active Defrag`)
> **Mục đích**: Yêu cầu bộ cấp phát `jemalloc` trả lại các trang bộ nhớ chưa sử dụng về lại cho Kernel OS.

```bash
# 1. Ép jemalloc giải phóng trang nhớ
redis-cli MEMORY PURGE

# 2. Bật tính năng chống phân mảnh chủ động trực tuyến
redis-cli CONFIG SET activedefrag yes
redis-cli CONFIG SET active-defrag-ignore-bytes 100mb
redis-cli CONFIG SET active-defrag-threshold-lower 10
redis-cli CONFIG SET active-defrag-threshold-upper 30
```

---

### Command 47: Báo Cáo Thống Kê Bộ Nhớ Toàn Diện (`MEMORY STATS`)
> **Mục đích**: Bóc tách tỉ mỉ bao nhiêu byte dành cho data, allocator fragmentation, lua cache, repl-backlog.

```bash
redis-cli MEMORY STATS
```

---

### Command 48: Đọc Danh Sách Các Lệnh Chậm Gần Nhất (`SLOWLOG Inspection`)
> **Mục đích**: Phát hiện các lệnh O(N) như `KEYS *`, `HGETALL` khổng lồ gây tắc nghẽn luồng xử lý.

```bash
# 1. Đặt ngưỡng bắt slowlog: câu lệnh chạy quá 10,000 microseconds (10ms)
redis-cli CONFIG SET slowlog-log-slower-than 10000

# 2. Đặt dung lượng hàng đợi lưu 500 lệnh
redis-cli CONFIG SET slowlog-max-len 500

# 3. Lấy ra 25 câu lệnh chậm nhất gần đây
redis-cli SLOWLOG GET 25

# 4. Kiểm tra độ dài hàng đợi slowlog hiện tại
redis-cli SLOWLOG LEN
```

---

### Command 49: Báo Cáo Chẩn Đoán Độ Trễ Đột Biến (`LATENCY DOCTOR & LATEST`)
> **Mục đích**: Bắt các nguyên nhân sinh ra trễ đột biến (`Fork latency`, `AOF rewrite`, `Slow command`).

```bash
# Kiểm tra độ trễ gần nhất theo từng nhóm sự kiện
redis-cli LATENCY LATEST

# Lấy hướng dẫn chẩn đoán tổng quan
redis-cli LATENCY DOCTOR
```

---

### Command 50: Đo Độ Trễ Liên Tục Qua Mạng CLI (`Continuous Latency Monitoring`)
> **Mục đích**: Đo kiểm độ trễ mạng thực tế giữa máy trạm ứng dụng và Redis Server.

```bash
# Đo độ trễ trung bình, lấy mẫu liên tục (Ctrl+C để dừng)
redis-cli --latency -h 127.0.0.1 -p 6379

# Đo độ trễ kèm lịch sử biến động theo từng đợt 15 giây
redis-cli --latency-history -i 15
```

---

### Command 51: Liệt Kê Kết Nối Tiêu Tốn Bộ Nhệm RAM Lớn Nhất (`Client Memory Consumer`)
> **Mục đích**: Tìm các ứng dụng đọc chậm (`Slow Consumer`) khiến bộ đệm đầu ra (`Output Buffer - obl/omem`) phình to gigabytes RAM.

```bash
# Liệt kê client và lọc theo dung lượng bộ đệm đầu ra omem > 0
redis-cli CLIENT LIST TYPE normal
```

---

### Command 52: Tiêu Diệt Kết Nối Nguy Hiểm Hoặc Chờ Quá Lâu (`CLIENT KILL`)
> **Mục đích**: Ngắt kết nối của các client gây quá tải.

```bash
# 1. Kill client theo ID cụ thể
redis-cli CLIENT KILL ID 84920

# 2. Kill toàn bộ client thuộc nhóm Pub/Sub
redis-cli CLIENT KILL TYPE pubsub

# 3. Kill client theo địa chỉ IP cụ thể
redis-cli CLIENT KILL ADDR 192.168.1.150:49200
```

---

### Command 53: Tạm Dừng Lưu Lượng Ghi Cho Bảo Trì / Chuyển Vùng Cụm (`CLIENT PAUSE`)
> **Mục đích**: Đóng băng toàn bộ lệnh ghi trong vòng 5 giây để thực hiện chuyển giao Master/Replica không mất dữ liệu.

```bash
# Tạm dừng các lệnh WRITE trong 5000 milliseconds (5 giây)
redis-cli CLIENT PAUSE 5000 WRITE
```

---

### Command 54: Kiểm Tra Tính Toàn Vẹn Cụm Redis & Tự Cân Bằng Slot (`Cluster Check & Rebalance`)
> **Mục đích**: Đảm bảo toàn bộ 16384 hash slots đều được phân bổ đầy đủ và cân đối giữa các Master nodes.

```bash
# 1. Kiểm tra trạng thái toàn bộ cụm
redis-cli --cluster check 10.0.0.1:6379

# 2. Tự động tái cân bằng phân bổ slot giữa các node theo trọng số
redis-cli --cluster rebalance 10.0.0.1:6379 --cluster-use-empty-masters
```

---

### Command 55: Chuyển Dịch Hash Slot Trực Tuyến Không Gián Đoạn (`Cluster Online Resharding`)
> **Mục đích**: Mở rộng cụm (`Scale-out`) bằng cách chuyển 1000 slots từ Node A sang Node B.

```bash
redis-cli --cluster reshard 10.0.0.1:6379 \
  --cluster-from <SOURCE_NODE_ID> \
  --cluster-to <TARGET_NODE_ID> \
  --cluster-slots 1000 \
  --cluster-yes
```

---

# 4. 📊 Phân Hệ ClickHouse & DuckDB: Sổ Tay Quản Trị Phân Tích (Top 15 Commands)

### Command 56: ClickHouse — Giám Sát Tiến Trình Nén Ghép Phần Dữ Liệu Nền (`system.merges`)
> **Mục đích**: Kiểm tra tốc độ gộp Part (`Part Merging`) của động cơ `MergeTree` để ngăn lỗi `Too many parts in all data parts in table`.

```sql
SELECT 
    table,
    round(elapsed, 1) AS elapsed_sec,
    round(progress, 2) AS progress_ratio,
    num_parts AS source_parts_count,
    formatReadableSize(total_size_bytes_compressed) AS total_size,
    formatReadableSize(bytes_read_uncompressed) AS bytes_read,
    formatReadableSize(bytes_written_uncompressed) AS bytes_written,
    round(bytes_written_uncompressed / nullif(elapsed, 0) / 1024 / 1024, 2) AS write_speed_mb_s
FROM system.merges;
```

---

### Command 57: ClickHouse — Thống Kê Số Lượng & Trạng Thái Data Parts (`system.parts`)
> **Mục đích**: Đánh giá sức khỏe của phân vùng bảng (`Partition Parts Health`).

```sql
SELECT 
    database,
    table,
    active,
    count() AS parts_count,
    formatReadableSize(sum(bytes_on_disk)) AS disk_size,
    sum(rows) AS total_rows
FROM system.parts
WHERE database NOT IN ('system', 'information_schema')
GROUP BY database, table, active
ORDER BY parts_count DESC;
```
> [!CAUTION]
> Nếu số lượng `active parts` trên 1 bảng vượt quá 300, nguy cơ gãy tiến trình ghi (`Insert Failures`) là rất cao. Cần điều chỉnh lại chiến lược Partition Key.

---

### Command 58: ClickHouse — Giám Sát Tiến Trình Chạy Mutation Đang Nặng (`system.mutations`)
> **Mục đích**: Đột biến (`ALTER TABLE UPDATE/DELETE`) trong ClickHouse viết lại toàn bộ Part. Lệnh này kiểm tra tiến độ của chúng.

```sql
SELECT 
    mutation_id,
    command,
    table,
    create_time,
    is_done,
    parts_to_do,
    latest_fail_reason
FROM system.mutations
WHERE is_done = 0
ORDER BY create_time ASC;
```

---

### Command 59: ClickHouse — Hủy Khẩn Cấp Một Mutation Đang Làm Nghẽn Đĩa (`KILL MUTATION`)
> **Mục đích**: Dừng ngay lập tức một tác vụ Update/Delete diện rộng gây quá tải I/O.

```sql
-- Hủy một mutation cụ thể
KILL MUTATION WHERE database = 'analytics' AND table = 'events' AND mutation_id = 'mutation_12948.txt';
```

---

### Command 60: ClickHouse — Truy Tìm Các Câu Truy Vấn Ngốn Bộ Nhớ RAM Nhiều Nhất (`system.processes`)
> **Mục đích**: Bắt các câu query phân tích khổng lồ có nguy cơ gây OOM (`Out of Memory`).

```sql
SELECT 
    query_id,
    user,
    elapsed,
    formatReadableSize(memory_usage) AS current_ram_usage,
    read_rows,
    formatReadableSize(read_bytes) AS bytes_scanned,
    substr(query, 1, 120) AS query_preview
FROM system.processes
ORDER BY memory_usage DESC
LIMIT 10;
```

---

### Command 61: ClickHouse — Thống Kê Dung Lượng Chi Tiết Từng Bảng Và Ổ Đĩa (`Disk Space Allocation`)
> **Mục đích**: Quản trị hạn mức dung lượng đĩa NVMe / JBOD / S3 Tiering.

```sql
SELECT 
    database,
    table,
    disk_name,
    formatReadableSize(sum(data_compressed_bytes)) AS compressed_size,
    formatReadableSize(sum(data_uncompressed_bytes)) AS uncompressed_size,
    round(sum(data_uncompressed_bytes) / nullif(sum(data_compressed_bytes), 0), 2) AS compression_ratio,
    sum(rows) AS total_records
FROM system.parts
WHERE active = 1 AND database NOT IN ('system')
GROUP BY database, table, disk_name
ORDER BY sum(data_compressed_bytes) DESC;
```

---

### Command 62: ClickHouse — Tiêu Diệt Truy Vấn Tắc Nghẽn Đồng Bộ (`KILL QUERY SYNC`)
> **Mục đích**: Dừng truy vấn ngay lập tức và đợi giải phóng RAM xong mới trả kết quả.

```sql
KILL QUERY WHERE query_id = 'c8b9d0e1-4567-89ab-cdef-0123456789ab' SYNC;
```

---

### Command 63: ClickHouse — Kiểm Tra Bộ Đệm Ghi Bất Đồng Bộ (`system.asynchronous_inserts`)
> **Mục đích**: Giám sát hiệu quả gom mẻ (`Batching`) của tính năng `async_insert = 1`.

```sql
SELECT 
    database,
    table,
    formatReadableSize(bytes) AS buffer_bytes,
    entries AS buffered_entries,
    first_update,
    timeout_ms
FROM system.asynchronous_inserts;
```

---

### Command 64: DuckDB — Truy Vấn Trực Tiếp Tệp Parquet / S3 / CSV Không Cần Nạp (`Zero-Copy Ingestion`)
> **Mục đích**: Phân tích tức thì dữ liệu hồ dữ liệu (`Data Lake`) mà không tốn thời gian ETL.

```sql
-- Cài đặt và nạp extension HTTPFS để truy vấn AWS S3 / Cloudflare R2
INSTALL httpfs;
LOAD httpfs;

-- Cấu hình bí mật kết nối S3
SET s3_region = 'ap-southeast-1';
SET s3_access_key_id = 'YOUR_ACCESS_KEY';
SET s3_secret_access_key = 'YOUR_SECRET_KEY';

-- Truy vấn trực tiếp hàng triệu dòng Parquet qua Glob Pattern
SELECT 
    date_trunc('day', timestamp) AS event_date,
    event_type,
    count(*) AS total_events,
    round(avg(response_time_ms), 2) AS avg_latency
FROM read_parquet('s3://my-lakehouse-bucket/events/year=2026/month=10/*.parquet')
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;
```

---

### Command 65: DuckDB — Xuất Dữ Liệu Tốc Độ Cực Cao Sang Parquet Nén ZSTD Có Phân Vùng
> **Mục đích**: ETL siêu tốc dữ liệu lớn ra định dạng lưu trữ tối ưu nhất.

```sql
COPY (
    SELECT 
        user_id,
        country,
        action,
        device_os,
        created_at
    FROM raw_events_table
) TO 's3://my-lakehouse-bucket/gold/users_partitioned/' (
    FORMAT PARQUET,
    COMPRESSION ZSTD,
    COMPRESSION_LEVEL 7,
    PARTITION_BY (country, device_os),
    OVERWRITE_OR_IGNORE 1
);
```

---

### Command 66: DuckDB — Thiết Lập Hạn Mức RAM Và Thư Mục Xả Đĩa (`Spill-to-Disk Tuning`)
> **Mục đích**: Đảm bảo DuckDB không làm tràn RAM của máy chủ khi xử lý dữ liệu lớn hơn RAM (`Out-of-Core Processing`).

```sql
-- Giới hạn DuckDB chỉ dùng tối đa 16GB RAM
SET memory_limit = '16GB';

-- Giới hạn số luồng tính toán song song
SET threads = 8;

-- Chỉ định thư mục trên ổ cứng NVMe để xả bộ nhớ khi cần
SET temp_directory = '/mnt/fast_nvme/duckdb_temp';
```

---

### Command 67: DuckDB — Gắn Kết Đa Cơ Sở Dữ Liệu Truy Vấn Chéo (`Cross-Database Attach`)
> **Mục đích**: Nối trực tiếp DuckDB với SQLite, PostgreSQL và file nội bộ trong cùng 1 câu SQL.

```sql
INSTALL postgres;
LOAD postgres;
INSTALL sqlite;
LOAD sqlite;

-- Gắn kết PostgreSQL và SQLite
ATTACH 'dbname=production_app user=postgres host=127.0.0.1' AS pg_db (TYPE POSTGRES);
ATTACH '/data/legacy_app.db' AS sqlite_db (TYPE SQLITE);

-- Phép join xuyên hệ quản trị cơ sở dữ liệu
SELECT 
    pg.user_id,
    pg.email,
    sl.total_orders_lifetime
FROM pg_db.users pg
JOIN sqlite_db.order_summary sl ON pg.user_id = sl.customer_id
WHERE pg.is_active = true;
```

---

### Command 68: DuckDB — Phân Tích Thống Kê Cột & Thuật Toán Nén Từng Khối (`PRAGMA storage_info`)
> **Mục đích**: Kiểm tra thuật toán nén (Dictionary, RLE, BitPacking, Chimp) đang được áp dụng.

```sql
PRAGMA storage_info('raw_events_table');
```

---

### Command 69: DuckDB — Xây Dựng Chỉ Mục Tìm Kiếm Toàn Văn Bản Chuẩn BM25 (`Full-Text Search Index`)
> **Mục đích**: Thực hiện tìm kiếm văn bản tốc độ cao không cần Elasticsearch.

```sql
INSTALL fts;
LOAD fts;

-- Tạo index BM25 trên bảng tài liệu
PRAGMA create_fts_index('articles_table', 'article_id', 'title', 'content_body');

-- Thực hiện tìm kiếm với điểm tương đồng BM25
SELECT 
    article_id,
    title,
    score
FROM (
    SELECT *, fts_main_articles_table.match_bm25(article_id, 'database performance tuning') AS score
    FROM articles_table
)
WHERE score IS NOT NULL
ORDER BY score DESC
LIMIT 10;
```

---

### Command 70: DuckDB — Phép Nối Theo Dòng Thời Gian Xấp Xỉ (`Asof Join`) Cho Dữ Liệu Giao Dịch
> **Mục đích**: Nối giá cổ phiếu gần nhất với thời điểm đặt lệnh mua mà không bị lệch thời gian.

```sql
SELECT 
    t.trade_time,
    t.symbol,
    t.volume,
    q.bid_price,
    q.ask_price
FROM trades t
ASOF JOIN quotes q
  ON t.symbol = q.symbol
 AND t.trade_time >= q.quote_time;
```

---

# 5. 🧠 Phân Hệ Vector Database & AI Retrieval: SQL & CLI Thực Chiến (Top 10 Commands)

### Command 71: pgvector — Cấu Hình Bộ Nhớ Dành Riêng Để Build HNSW Index Tốc Độ Cao
> **Mục đích**: Tạo chỉ mục HNSW trên hàng triệu vector đòi hỏi bộ nhớ `maintenance_work_mem` lớn và đa luồng CPU để không bị nghẽn.

```sql
-- Cấu hình phiên làm việc trước khi chạy CREATE INDEX
SET maintenance_work_mem = '4GB';
SET max_parallel_maintenance_workers = 8;
SET max_parallel_workers = 8;
```

---

### Command 72: pgvector — Tạo Chỉ Mục HNSW Cosine Chuẩn Production (`High-Performance HNSW Index`)
> **Mục đích**: Xây dựng đồ thị HNSW với thông số cân bằng giữa tốc độ tìm kiếm và độ chính xác (`Recall`).

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_embedding_hnsw_cosine 
ON items 
USING hnsw (embedding vector_cosine_ops)
WITH (
    m = 16,                -- Số lượng liên kết tối đa trên mỗi node đồ thị (16-64)
    ef_construction = 128  -- Kích thước danh sách ứng viên trong lúc build (64-256)
);
```

---

### Command 73: pgvector — 3 Toán Tử Truy Vấn K-Nearest Neighbors (KNN) Chuẩn Mực
> **Mục đích**: Khai thác đúng toán tử khoảng cách tương ứng với mô hình nhúng (`Embedding Model`).

```sql
-- 1. Toán tử <=> : Cosine Distance (Thích hợp cho OpenAI text-embedding-3, Cohere)
SELECT id, title, (embedding <=> '[0.012, -0.045, 0.089, ...]'::vector) AS distance
FROM items
ORDER BY embedding <=> '[0.012, -0.045, 0.089, ...]'::vector ASC
LIMIT 10;

-- 2. Toán tử <-> : Euclidean / L2 Distance
SELECT id, title, (embedding <-> '[0.012, -0.045, 0.089, ...]'::vector) AS distance
FROM items
ORDER BY embedding <-> '[0.012, -0.045, 0.089, ...]'::vector ASC
LIMIT 10;

-- 3. Toán tử <#> : Negative Inner Product (Dành cho vector đã chuẩn hóa đơn vị Unit Vectors)
SELECT id, title, ((embedding <#> '[0.012, -0.045, 0.089, ...]'::vector) * -1) AS similarity
FROM items
ORDER BY embedding <#> '[0.012, -0.045, 0.089, ...]'::vector ASC
LIMIT 10;
```

---

### Command 74: pgvector — Tạo Chỉ Mục IVFFlat & Điều Chỉnh Số Lượng Probes Lúc Truy Vấn
> **Mục đích**: Sử dụng kiến trúc đảo phân cụm (`Inverted File`) khi cần tiết kiệm RAM hơn HNSW.

```sql
-- 1. Tạo chỉ mục IVFFlat với 1000 danh sách phân cụm (centroids)
CREATE INDEX CONCURRENTLY idx_items_embedding_ivfflat 
ON items 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 1000);

-- 2. Thiết lập số cụm được quét trong thời gian truy vấn (Tăng probes = Tăng recall, tăng latency)
SET ivfflat.probes = 20;
```

---

### Command 75: pgvector — Điều Chỉnh Động Tham Số `ef_search` Cho HNSW Runtime
> **Mục đích**: Tùy biến độ chính xác (`Recall vs Latency trade-off`) theo từng loại truy vấn.

```sql
-- Tăng kích thước dynamic candidate list lúc query (Mặc định 40)
SET hnsw.ef_search = 100;
```

---

### Command 76: pgvector — Hàm Tìm Kiếm Lai (Hybrid Search) Kết Hợp Dense Vector + Sparse BM25 Bằng Reciprocal Rank Fusion (RRF)
> **Mục đích**: Thuật toán xếp hạng lai chuẩn State-of-the-Art viết bằng PL/pgSQL thuần, không cần dịch vụ ngoài.

```sql
CREATE OR REPLACE FUNCTION hybrid_search_rrf(
    query_text TEXT,
    query_vector vector(1536),
    match_limit INT,
    k_rrf INT DEFAULT 60
)
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    dense_rank BIGINT,
    sparse_rank BIGINT,
    combined_score NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH dense_search AS (
        SELECT 
            i.id,
            ROW_NUMBER() OVER (ORDER BY i.embedding <=> query_vector ASC) AS rank
        FROM items i
        ORDER BY i.embedding <=> query_vector ASC
        LIMIT 50
    ),
    sparse_search AS (
        SELECT 
            i.id,
            ROW_NUMBER() OVER (ORDER BY ts_rank_cd(i.text_search_vector, plainto_tsquery('english', query_text)) DESC) AS rank
        FROM items i
        WHERE i.text_search_vector @@ plainto_tsquery('english', query_text)
        ORDER BY rank ASC
        LIMIT 50
    )
    SELECT 
        coalesce(d.id, s.id) AS id,
        item.title,
        d.rank AS dense_rank,
        s.rank AS sparse_rank,
        round(
            (coalesce(1.0 / (k_rrf + d.rank), 0.0) + 
             coalesce(1.0 / (k_rrf + s.rank), 0.0))::numeric, 
            6
        ) AS combined_score
    FROM dense_search d
    FULL OUTER JOIN sparse_search s ON d.id = s.id
    JOIN items item ON item.id = coalesce(d.id, s.id)
    ORDER BY combined_score DESC
    LIMIT match_limit;
END;
$$;
```

---

### Command 77: pgvector — Nén Vector Bằng Lượng Tử Hóa Nửa Độ Chính Xác (`halfvec` FP16)
> **Mục đích**: Giảm 50% dung lượng RAM và đĩa cho vector 1536 chiều bằng pgvector 0.7+.

```sql
-- Chuyển đổi cột vector sang halfvec (16-bit floating point)
ALTER TABLE items ADD COLUMN embedding_fp16 halfvec(1536);
UPDATE items SET embedding_fp16 = embedding::halfvec(1536);

-- Tạo HNSW trên halfvec
CREATE INDEX idx_items_halfvec_hnsw 
ON items 
USING hnsw (embedding_fp16 halfvec_cosine_ops);
```

---

### Command 78: Qdrant — Tạo Collection Với HNSW & Scalar Quantization Qua cURL
> **Mục đích**: Khởi tạo kho lưu trữ vector tốc độ cao, bật nén bộ nhớ xuống 4 lần (`INT8 Quantization`).

```bash
curl -X PUT "http://localhost:6333/collections/knowledge_base" \
  -H "Content-Type: application/json" \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    },
    "hnsw_config": {
      "m": 16,
      "ef_construct": 128,
      "full_scan_threshold": 10000
    },
    "quantization_config": {
      "scalar": {
        "type": "int8",
        "quantile": 0.99,
        "always_ram": true
      }
    }
  }'
```

---

### Command 79: Qdrant — Truy Vấn Vector Kèm Bộ Lọc Điều Kiện (`Payload Filtering + Vector Search`)
> **Mục đích**: Tìm kiếm vector tương đồng chỉ trong phạm vi người dùng hoặc thư mục được ủy quyền.

```bash
curl -X POST "http://localhost:6333/collections/knowledge_base/points/search" \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.012, -0.045, 0.089, 0.001],
    "filter": {
      "must": [
        { "key": "organization_id", "match": { "value": "org_enterprise_99" } },
        { "key": "is_published", "match": { "value": true } }
      ]
    },
    "limit": 5,
    "with_payload": true,
    "params": {
      "hnsw_ef": 64,
      "exact": false
    }
  }'
```

---

### Command 80: Qdrant — Tạo Bản Snapshot Lưu Trữ & Khôi Phục Khẩn Cấp (`Snapshot Management`)
> **Mục đích**: Sao lưu trạng thái của Vector Collection phục vụ khôi phục sau thảm họa.

```bash
# 1. Tạo snapshot của collection
curl -X POST "http://localhost:6333/collections/knowledge_base/snapshots"

# 2. Tải snapshot về máy chủ lưu trữ dự phòng
curl -O "http://localhost:6333/collections/knowledge_base/snapshots/knowledge_base-2026-10-01.snapshot"

# 3. Phục hồi collection từ file snapshot
curl -X POST "http://localhost:6333/collections/knowledge_base/snapshots/upload?priority=snapshot" \
  -H "Content-Type: multipart/form-data" \
  -F "snapshot=@knowledge_base-2026-10-01.snapshot"
```

---

# 6. 🛡️ Phân Hệ DBRE, Sao Lưu & Khôi Phục Thảm Họa (Top 10 Commands)

### Command 81: Sao Lưu Vật Lý Trực Tuyến Đầy Đủ Với `pg_basebackup` Chuẩn Nén Tar.gz
> **Mục đích**: Tạo bản backup vật lý nhất quán (`Physical Base Backup`) có đầy đủ WAL để khôi phục ngay.

```bash
pg_basebackup -h 127.0.0.1 -p 5432 -U replicator -D /mnt/backup/pg_base_$(date +%F_%H%M) \
  -Ft -z -P -R -X stream -v
```
* **Giải thích cờ lệnh**:
  * `-Ft`: Xuất định dạng file nén Tar (`Tar format`).
  * `-z`: Nén bằng gzip để giảm dung lượng mạng/ổ cứng.
  * `-P`: Hiển thị thanh tiến trình thực tế (`Progress bar`).
  * `-R`: Tự động tạo cấu hình khôi phục `standby.signal` để sẵn sàng làm replica.
  * `-X stream`: Kéo toàn bộ WAL song song trong suốt thời gian backup.

---

### Command 82: Cấu Hình Lưu Trữ WAL Liên Tục (`WAL Archiving Configuration`)
> **Mục đích**: Cấu hình trong `postgresql.conf` đảm bảo không bao giờ mất giao dịch trước khi gửi lên kho lưu trữ lạnh.

```ini
# Thêm vào postgresql.conf
wal_level = replica
archive_mode = on
archive_timeout = 300 # Ép đổi file WAL sau mỗi 5 phút nếu ít ghi
archive_command = 'test ! -f /mnt/wal_archive/%f && cp %p /mnt/wal_archive/%f'
```

---

### Command 83: Kích Hoạt Khôi Phục Về Mốc Thời Gian Chính Xác (`Point-In-Time Recovery - PITR`)
> **Mục đích**: Đưa cơ sở dữ liệu về thời điểm ngay trước khi lập trình viên lỡ tay chạy nhầm lệnh `DROP TABLE`.

```bash
# 1. Dừng cụm PostgreSQL hiện tại
pg_ctl -D /var/lib/postgresql/data stop

# 2. Xóa sạch thư mục data cũ (Giữ lại pg_wal nếu cần kiểm tra)
rm -rf /var/lib/postgresql/data/*

# 3. Bung file pg_basebackup vào thư mục data
tar -xzvf /mnt/backup/base.tar.gz -C /var/lib/postgresql/data/

# 4. Tạo tệp báo hiệu khôi phục
touch /var/lib/postgresql/data/recovery.signal

# 5. Cấu hình đích khôi phục trong /var/lib/postgresql/data/postgresql.auto.conf
restore_command = 'cp /mnt/wal_archive/%f %p'
recovery_target_time = '2026-10-01 14:25:00 UTC'
recovery_target_action = 'promote' # Tự động mở cờ ghi (Read-Write) khi chạm mốc đích
```

---

### Command 84: pgBackRest — Kiểm Tra Tính Toàn Vẹn Stanza & Tạo Bản Backup Đa Luồng
> **Mục đích**: Công cụ DBRE tiêu chuẩn doanh nghiệp hỗ trợ sao lưu gia tăng (`Incremental`), giải nén nén song song.

```bash
# 1. Kiểm tra cấu hình kết nối và quyền lưu trữ của stanza
pgbackrest --stanza=db-prod check

# 2. Thực hiện sao lưu đầy đủ (Full Backup) với 8 luồng nén ZSTD
pgbackrest --stanza=db-prod --type=full --process-max=8 backup

# 3. Xem danh sách và báo cáo tính toàn vẹn của các bản backup
pgbackrest --stanza=db-prod info
```

---

### Command 85: Điều Tra Pháp Y Tệp Nhật Ký Giao Dịch Với `pg_waldump`
> **Mục đích**: Soi vào ruột file WAL để tìm ra transaction nào đã làm phình to đĩa hoặc gây sập hệ thống.

```bash
# Đọc 1000 bản ghi WAL gần nhất từ LSN cụ thể
pg_waldump -p /var/lib/postgresql/data/pg_wal -s 0/1A000000 -n 1000

# Thống kê tổng lượng dữ liệu ghi theo Resource Manager (Heap, Btree, Transaction)
pg_waldump -p /var/lib/postgresql/data/pg_wal 00000001000000000000001A --stats=rmgr
```

---

### Command 86: Sao Lưu Logic Tốc Độ Cao Đa Luồng (`pg_dump -j 8`)
> **Mục đích**: Xuất dữ liệu bảng ra file nhị phân nén Directory format với 8 CPU cores song song.

```bash
pg_dump -h localhost -p 5432 -U postgres -d production_db \
  -Fd -j 8 -Z 6 -f /mnt/backup/dump_production_$(date +%F)
```

---

### Command 87: Phục Hồi Dữ Liệu Đa Luồng Siêu Tốc (`pg_restore -j 8`)
> **Mục đích**: Nạp lại dữ liệu song song 8 luồng, tự động tạo index sau khi nạp bảng.

```bash
pg_restore -h localhost -p 5432 -U postgres -d production_db_restored \
  -j 8 --clean --if-exists --no-owner --no-privileges \
  /mnt/backup/dump_production_2026-10-01
```

---

### Command 88: MySQL 8.0 — Sao Lưu Vật Lý Không Dừng Server Với Percona XtraBackup
> **Mục đích**: Hot physical backup bảng InnoDB mà không khóa các tác vụ ghi của khách hàng.

```bash
xtrabackup --backup --user=backup_user --password="SecretPassword" \
  --target-dir=/mnt/backup/mysql_base_$(date +%F) \
  --parallel=4 --compress --compress-threads=4
```

---

### Command 89: MySQL 8.0 — Chuẩn Bị Bản Backup XtraBackup Sẵn Sàng Khôi Phục (`--prepare`)
> **Mục đích**: Áp dụng Redo Log vào Data files để đạt trạng thái nhất quán dữ liệu trước khi nạp lại.

```bash
# Thực hiện Roll-forward và Rollback các uncommitted transactions
xtrabackup --prepare --target-dir=/mnt/backup/mysql_base_2026-10-01
```

---

### Command 90: Kiểm Tra Mã Checksum Chống Thối Dữ Liệu Ổ Đĩa (`pg_checksums`)
> **Mục đích**: Quét ngoại tuyến toàn bộ data directory để phát hiện các khối dữ liệu bị lỗi vật lý (`Bit Rot / Silent Corruption`).

```bash
# Yêu cầu dừng cụm Postgres trước khi chạy
pg_ctl -D /var/lib/postgresql/data stop

# Kích hoạt hoặc kiểm tra tính toàn vẹn checksums
pg_checksums -c -D /var/lib/postgresql/data
```

---

# 7. 🐧 Phân Hệ Linux OS & Kernel Tuning Cho Database Server (Top 10 One-Liners)

### One-Liner 91: Tinh Chỉnh Cấu Hình Quản Lý Bộ Nhớ Kernel Trong `/etc/sysctl.d/99-database.conf`
> **Mục đích**: Ngăn chặn Kernel OOM-Killer giết nhầm Database process, triệt tiêu swap trễ, và điều tiết xả đĩa mượt mà.

```bash
cat << 'EOF' | sudo tee /etc/sysctl.d/99-database.conf
# Cho phép ứng dụng cấp phát bộ nhớ ảo linh hoạt (Đặc biệt bắt buộc cho Redis)
vm.overcommit_memory = 1

# Hạn chế tối đa việc đẩy bộ nhớ xuống SWAP (Chỉ swap khi thực sự cạn kiệt)
vm.swappiness = 1

# Bắt đầu ghi nền dữ liệu bẩn xuống ổ đĩa khi đạt 5% RAM
vm.dirty_background_ratio = 5

# Buộc tiến trình ghi phải đợi xả đĩa khi trang bẩn đạt 10% RAM (Tránh I/O Spike)
vm.dirty_ratio = 10

# Tăng hạn mức dung lượng hàng đợi kết nối mạng
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
EOF

sudo sysctl --system
```

---

### One-Liner 92: Vô Hiệu Hóa Vĩnh Viễn Transparent Huge Pages (THP)
> **Mục đích**: THP gây ra phân mảnh bộ nhớ và độ trễ CoW (`Copy-on-Write`) kinh hoàng trên Redis và PostgreSQL.

```bash
# 1. Tạo script Systemd tắt THP lúc khởi động
cat << 'EOF' | sudo tee /etc/systemd/system/disable-thp.service
[Unit]
Description=Disable Transparent Huge Pages (THP)
DefaultDependencies=no
After=sysinit.target local-fs.target
Before=mongod.service redis.service postgresql.service

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo never > /sys/kernel/mm/transparent_hugepage/enabled && echo never > /sys/kernel/mm/transparent_hugepage/defrag'

[Install]
WantedBy=basic.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now disable-thp.service
```

---

### One-Liner 93: Cấu Hình Thuật Toán Điều Phối I/O Ổ Đĩa NVMe (`I/O Scheduler`)
> **Mục đích**: Với ổ cứng NVMe hiện đại, chuyển sang thuật toán `none` để loại bỏ tầng trung gian dư thừa của CPU.

```bash
echo none | sudo tee /sys/block/nvme0n1/queue/scheduler
```

---

### One-Liner 94: Mở Rộng Hạn Mức Tệp Mở & Tiến Trình Cho Người Dùng Database (`File Descriptors Limits`)
> **Mục đích**: Ngăn ngừa lỗi kinh điển `Too many open files` khi lượng kết nối đồng thời tăng cao.

```bash
cat << 'EOF' | sudo tee /etc/security/limits.d/99-database.conf
postgres    soft    nofile    1048576
postgres    hard    nofile    1048576
postgres    soft    nproc     65536
postgres    hard    nproc     65536
mysql       soft    nofile    1048576
mysql       hard    nofile    1048576
redis       soft    nofile    1048576
redis       hard    nofile    1048576
EOF
```

---

### One-Liner 95: Đo Đạc Chuẩn Xác IOPS & Độ Trễ Đọc Ngẫu Nhiên Ổ Đĩa NVMe Với `fio`
> **Mục đích**: Kiểm tra năng lực phần cứng thực tế trước khi đưa cơ sở dữ liệu lên chạy production.

```bash
fio --name=random-read-test --ioengine=libaio --direct=1 --rw=randread \
    --bs=8k --size=10G --numjobs=4 --iodepth=32 --runtime=60 \
    --time_based --group_reporting --filename=/mnt/database/fio_test_file
```

---

### One-Liner 96: Soi Độ Bão Hòa & Độ Trễ Đĩa Thời Gian Thực Với `iostat`
> **Mục đích**: Phát hiện ổ đĩa chạm trần công suất (`%util` tiến sát 100%) hoặc thời gian đáp ứng `await` quá lớn ($> 5\text{ms}$).

```bash
# Đo đạc mỗi giây 1 lần, bỏ qua lần in đầu tiên
iostat -xz 1
```

---

### One-Liner 97: Khóa CPU Ở Chế Độ Hiệu Năng Tối Đa (`Performance Governor`)
> **Mục đích**: Ngăn chặn CPU tự động tụt xung nhịp tiết kiệm điện làm tăng đột biến độ trễ câu truy vấn.

```bash
sudo apt-get install -y linux-cpupower && sudo cpupower frequency-set -g performance
```

---

### One-Liner 98: Tối Ưu Cân Bằng Bộ Nhớ NUMA Trên Máy Chủ Đa Socket (`NUMA Interleaving`)
> **Mục đích**: Tránh việc 1 socket CPU cạn kiệt RAM cục bộ trong khi socket khác còn dư, gây ra độ trễ truy cập chéo bus.

```bash
# Chạy Database service dưới chế độ phân bổ đều trên toàn bộ NUMA nodes
numactl --interleave=all /usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/data
```

---

### One-Liner 99: Tối Ưu Hóa Buffer Mạng Cho Kết Nối Băng Thông Siêu Lớn (10GbE / 40GbE)
> **Mục đích**: Tối ưu hóa chuyển tải khối lượng lớn dữ liệu nhân bản và phân tích.

```bash
cat << 'EOF' | sudo tee -a /etc/sysctl.d/99-database.conf
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
EOF
sudo sysctl --system
```

---

### One-Liner 100: Kiểm Tra Áp Lực Bộ Nhớ & Trang Nhân Bản Trong Thời Gian Thực
> **Mục đích**: Xem số lượng trang bộ nhớ bị dirty hoặc writeback liên tục qua `vmstat`.

```bash
vmstat -w 1 30
```

---

# 8. 🐳 Kịch Bản Khởi Tạo Môi Trường Đa Cơ Sở Dữ Liệu Sẵn Dùng (All-in-One Docker Compose)

Tệp cấu hình dưới đây tích hợp trọn vẹn cụm 5 hệ quản trị cơ sở dữ liệu mạnh nhất hiện nay:
1. **PostgreSQL 16** (Đã kích hoạt sẵn extension `pgvector` & `pg_stat_statements`).
2. **PgBouncer** (Hồ bơi kết nối tải cao, chạy ở chế độ Transaction Pooling).
3. **Redis 7.2** (Cấu hình song song AOF + RDB, giới hạn RAM an toàn kèm LRU eviction).
4. **ClickHouse 24 LTS** (Máy chủ phân tích OLAP cột siêu tốc).
5. **Qdrant 1.9** (Vector Engine chuyên dụng hỗ trợ HNSW & Quantization).

### Tệp Cấu Hình: `docker-compose.yml`

```yaml
version: '3.8'

networks:
  db-arsenal-net:
    driver: bridge

volumes:
  pg_data:
  redis_data:
  clickhouse_data:
  clickhouse_logs:
  qdrant_data:

services:
  # ============================================================================
  # 1. PostgreSQL 16 with pgvector & pg_stat_statements
  # ============================================================================
  postgres-primary:
    image: pgvector/pgvector:pg16
    container_name: arsenal-postgres
    restart: always
    environment:
      POSTGRES_DB: masterclass_db
      POSTGRES_USER: dba_admin
      POSTGRES_PASSWORD: MasterclassSecure2026!
    command: >
      postgres 
        -c shared_buffers=1GB 
        -c work_mem=32MB 
        -c maintenance_work_mem=256MB 
        -c effective_cache_size=3GB 
        -c shared_preload_libraries='pg_stat_statements' 
        -c pg_stat_statements.track=all 
        -c max_connections=200 
        -c wal_level=replica 
        -c max_wal_size=4GB 
        -c min_wal_size=512MB 
        -c checkpoint_completion_target=0.9
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dba_admin -d masterclass_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - db-arsenal-net

  # ============================================================================
  # 2. PgBouncer Connection Pooler
  # ============================================================================
  pgbouncer:
    image: edoburu/pgbouncer:v1.22.1
    container_name: arsenal-pgbouncer
    restart: always
    depends_on:
      postgres-primary:
        condition: service_healthy
    environment:
      DB_HOST: postgres-primary
      DB_PORT: 5432
      DB_USER: dba_admin
      DB_PASSWORD: MasterclassSecure2026!
      DB_NAME: masterclass_db
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 1000
      DEFAULT_POOL_SIZE: 50
      MIN_POOL_SIZE: 10
      RESERVE_POOL_SIZE: 5
      AUTH_TYPE: md5
    ports:
      - "6432:5432"
    networks:
      - db-arsenal-net

  # ============================================================================
  # 3. Redis 7.2 In-Memory Data Store (AOF + RDB Enabled)
  # ============================================================================
  redis:
    image: redis:7.2-alpine
    container_name: arsenal-redis
    restart: always
    command: >
      redis-server 
        --requirepass "RedisArsenalAuth2026!" 
        --maxmemory 1gb 
        --maxmemory-policy allkeys-lru 
        --appendonly yes 
        --appendfsync everysec 
        --save 900 1 
        --save 300 10 
        --save 60 10000 
        --slowlog-log-slower-than 10000 
        --slowlog-max-len 500
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "RedisArsenalAuth2026!", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - db-arsenal-net

  # ============================================================================
  # 4. ClickHouse 24 LTS High-Performance Analytical Server
  # ============================================================================
  clickhouse:
    image: clickhouse/clickhouse-server:24.3-alpine
    container_name: arsenal-clickhouse
    restart: always
    environment:
      CLICKHOUSE_DB: default
      CLICKHOUSE_USER: clickhouse_admin
      CLICKHOUSE_PASSWORD: ClickhouseAuth2026!
      CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT: 1
    ports:
      - "8123:8123" # HTTP Interface
      - "9000:9000" # Native Client Interface
    volumes:
      - clickhouse_data:/var/lib/clickhouse
      - clickhouse_logs:/var/log/clickhouse-server
    ulimits:
      nofile:
        soft: 262144
        hard: 262144
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://localhost:8123/ping || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - db-arsenal-net

  # ============================================================================
  # 5. Qdrant Vector Search Engine
  # ============================================================================
  qdrant:
    image: qdrant/qdrant:v1.9.0
    container_name: arsenal-qdrant
    restart: always
    environment:
      QDRANT__TELEMETRY_DISABLED: "true"
      QDRANT__STORAGE__PERFORMANCE__MAX_SEARCH_THREADS: 4
    ports:
      - "6333:6333" # HTTP REST API
      - "6334:6334" # gRPC API
    volumes:
      - qdrant_data:/qdrant/storage
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:6333/healthz || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - db-arsenal-net
```

---

### Kịch Bản Kiểm Tra Khói Tức Thì Trong 30 Giây (`30-Second Smoke Test Script`)

Lưu kịch bản sau vào `smoke_test.sh` và thực thi:

```bash
#!/usr/bin/env bash
set -e

echo "=== [1/5] Testing PostgreSQL 16 & pgvector ==="
docker exec -i arsenal-postgres psql -U dba_admin -d masterclass_db -c "
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS test_vectors (id serial PRIMARY KEY, embedding vector(3));
INSERT INTO test_vectors (embedding) VALUES ('[1.0, 2.0, 3.0]'), ('[4.0, 5.0, 6.0]');
SELECT id, embedding, embedding <=> '[1.0, 2.0, 3.5]' AS distance FROM test_vectors;
"

echo "=== [2/5] Testing PgBouncer Connection ==="
docker exec -i arsenal-postgres psql -h arsenal-pgbouncer -p 5432 -U dba_admin -d masterclass_db -c "
SHOW pools;
"

echo "=== [3/5] Testing Redis 7.2 Persistence & Auth ==="
docker exec -i arsenal-redis redis-cli -a "RedisArsenalAuth2026!" ping
docker exec -i arsenal-redis redis-cli -a "RedisArsenalAuth2026!" set masterclass_test "PASSED"
docker exec -i arsenal-redis redis-cli -a "RedisArsenalAuth2026!" get masterclass_test

echo "=== [4/5] Testing ClickHouse 24 OLAP Query ==="
docker exec -i arsenal-clickhouse clickhouse-client -u clickhouse_admin --password "ClickhouseAuth2026!" --query "
SELECT version(), currentDatabase(), count() FROM system.parts;
"

echo "=== [5/5] Testing Qdrant Vector Engine ==="
docker exec -i arsenal-qdrant curl -s http://localhost:6333/healthz

echo -e "\n🎉 TOÀN BỘ 5 CƠ SỞ DỮ LIỆU ĐÃ VẬN HÀNH HOÀN HẢO!"
```

---

*Tài liệu được biên soạn và bảo chứng bởi **Command Arsenal Architect** trong Chiến dịch Database Masterclass.*
