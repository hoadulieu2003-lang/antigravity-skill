# MODULE 06: KIẾN TRÚC OLAP, BỘ LƯU TRỮ DẠNG CỘT & ĐỘNG CƠ PHÂN TÍCH HIỆN ĐẠI
## (OLAP, Columnar Storage & Modern Analytical Engines)

> **Thuộc Chuỗi Bài Hướng Dẫn Kỹ Thuật (Masterclass Series)**: *Deep-Dive Database Engineering & High-Performance Storage Architecture*  
> **Chuyên gia Chủ quản**: *Pod 6 — Lead OLAP, Columnar Storage & Analytics Architect*  
> **Mục tiêu**: Bóc tách toàn diện từ bản chất cơ học phần cứng của Tầng Lưu trữ Dạng Cột (Columnar Storage), Cơ chế Thực thi Vector hóa (Vectorized Execution), Các giải thuật nén dữ liệu bit-level chuyên sâu, đến Thiết kế Hệ thống Thực chiến trên ClickHouse, DuckDB, Apache Iceberg / Delta Lake và Mô hình hóa Chiều (Dimensional Data Modeling).

---

## MỤC LỤC TỔNG QUAN (TABLE OF CONTENTS)

1. [ĐỐI CHIẾU HỆ QUY CHIẾU: OLTP (ROW-ORIENTED) VS OLAP (COLUMN-ORIENTED)](#1-đối-chiếu-hệ-quy-chiếu-oltp-row-oriented-vs-olap-column-oriented)
   - 1.1. Triết lý Thiết kế & Bản chất Hoạt động (Core Philosophy & Workload Characteristics)
   - 1.2. Mẫu hình Truy vấn: Point Queries vs Large Range Aggregations
   - 1.3. Cơ học Phần cứng: IOPS vs Throughput & Cache Line Locality
   - 1.4. Hiện tượng Phóng đại I/O (I/O Amplification Factor Analysis)
   - 1.5. Bảng Đối chiếu Toàn diện 15 Tiêu chí Kỹ thuật: Row-Store vs Column-Store
2. [BẢN CHẤT TẦNG VẬT LÝ LƯU TRỮ CỘT (COLUMNAR STORAGE INTERNALS)](#2-bản-chất-tầng-vật-lý-lưu-trữ-cột-columnar-storage-internals)
   - 2.1. Cấu trúc Phân đoạn Vật lý: Block, Segment, Chunk, Row Group & Granule
   - 2.2. Động cơ Thực thi Vector hóa (Vectorized Execution Engine) & Tập lệnh SIMD (AVX-512)
   - 2.3. So sánh: Volcano Iterator Model vs Vectorized Execution vs JIT Compilation (LLVM)
   - 2.4. Khảo sát Chuyên sâu Các Giải thuật Nén Dữ liệu Cột (Columnar Compression Algorithms):
     - Run-Length Encoding (RLE)
     - Bit-Packing & Frame of Reference (FoR)
     - Delta-of-Delta & Gorilla Compression (IEEE 754 Floats & Timestamps)
     - Dictionary Encoding (Từ điển Mã hóa Cục bộ & Toàn cục)
     - General-Purpose Block Compressors: LZ4 vs Zstandard (ZSTD)
     - Roaring Bitmaps cho Lọc Dữ liệu Siêu Tốc
3. [KIẾN TRÚC ĐỘNG CƠ OLAP HIỆN ĐẠI THỰC CHIẾN (MODERN OLAP ENGINES IN-DEPTH)](#3-kiến-trúc-động-cơ-olap-hiện-đại-thực-chiến-modern-olap-engines-in-depth)
   - 3.1. ClickHouse: Tượng đài Động cơ Phân tích Phân tán (Distributed Columnar Engine)
     - Họ động cơ MergeTree (`MergeTree`, `ReplacingMergeTree`, `AggregatingMergeTree`, `SummingMergeTree`)
     - Cấu trúc Chỉ mục Thưa (Sparse Index): `primary.idx`, file Marks (`.mrk2`), và Blocks nén (`.bin`)
     - Ranh giới Sinh tử: `ORDER BY` (Sorting Key) vs `PRIMARY KEY`
     - Vòng đời Data Part: Cơ chế Ghép nền (Background Merges), Mutations vs Lightweight Deletes
   - 3.2. DuckDB: "SQLite cho Phân tích" (In-Process Vectorized OLAP)
     - Kiến trúc In-Process & Bộ điều phối Morsel-Driven Parallelism
     - Cấu trúc Vector & DataChunk (2048 Tuples Buffer)
     - Tích hợp Không Sao Chép Dữ liệu (Zero-Copy Integration) với Apache Arrow, Pandas & Polars
     - Cơ chế Xử lý Vượt Bộ nhớ (Out-of-Core Processing & Disk Spilling)
   - 3.3. Định dạng Bảng Hồ Dữ liệu (Data Lakehouse Table Formats): Apache Iceberg & Delta Lake
     - Thoát ly Hive Metastore: Cây Siêu dữ liệu Bất biến (Immutable Metadata Tree)
     - Giao dịch ACID & Snapshot Isolation trên Object Storage (S3 / GCS / Azure Blob)
     - Phân vùng Ẩn (Hidden Partitioning) & Tiến hóa Phân vùng (Partition Evolution)
     - Chiến lược Xóa & Ghi: Copy-on-Write (CoW) vs Merge-on-Read (MoR)
4. [MÔ HÌNH HÓA DỮ LIỆU PHÂN TÍCH (DIMENSIONAL DATA MODELING)](#4-mô-hình-hóa-dữ-liệu-phân-tích-dimensional-data-modeling)
   - 4.1. Lược đồ Hình sao (Star Schema) vs Lược đồ Bông tuyết (Snowflake Schema) vs Bảng Phẳng Rộng (One Big Table - OBT)
   - 4.2. Bảng Sự kiện (Fact Tables) & Bảng Chiều (Dimension Tables)
     - Phân loại Fact: Transaction Fact, Periodic Snapshot Fact, Accumulating Snapshot Fact
     - Phân loại Dimension: Conformed, Degenerate, Outrigger, Junk Dimensions
   - 4.3. Xử lý Chiều Thay đổi Chậm (Slowly Changing Dimensions - SCD Type 0, 1, 2, 3, 4, 6)
     - Thiết kế Thực chiến SCD Type 2 với SQL Merge / Window Functions
5. [BẢNG SO SÁNH ĐA TRỤC & CẨM NANG VẬN HÀNH SẢN XUẤT (PRODUCTION PLAYBOOK)](#5-bảng-so-sánh-đa-trục--cẩm-nang-vận-hành-sản-xuất-production-playbook)
   - 5.1. Ma trận Đối đầu Toàn diện: PostgreSQL vs ClickHouse vs DuckDB vs Apache Iceberg
   - 5.2. Các Lỗi Chí Mạng (Anti-Patterns) & Phương thức Phòng chống
   - 5.3. Checklist Tối ưu Hóa Dành cho Kỹ sư Kiến trúc Trưởng (Architect's Production Checklist)

---

## 1. ĐỐI CHIẾU HỆ QUY CHIẾU: OLTP (ROW-ORIENTED) VS OLAP (COLUMN-ORIENTED)

### 1.1. Triết lý Thiết kế & Bản chất Hoạt động (Core Philosophy & Workload Characteristics)

Trong lịch sử kiến trúc cơ sở dữ liệu, sự rẽ nhánh giữa **OLTP (Online Transaction Processing - Xử lý Giao dịch Trực tuyến)** và **OLAP (Online Analytical Processing - Xử lý Phân tích Trực tuyến)** xuất phát từ hai bài toán hoàn toàn đối nghịch về cơ học phần cứng và mô hình truy cập dữ liệu:

```
MÔ HÌNH LƯU TRỮ THEO HÀNG (ROW-STORE / OLTP):
Bộ nhớ / Đĩa: [Row 1: ID, Date, User, Amount, Status] [Row 2: ID, Date, User, Amount, Status] ...
Mục tiêu: Đọc / Ghi trọn vẹn 1 Tuple (bản ghi) trong 1 I/O operation.

MÔ HÌNH LƯU TRỮ THEO CỘT (COLUMN-STORE / OLAP):
File Cột ID:     [ID 1, ID 2, ID 3, ID 4, ... ID N]
File Cột Date:   [Date 1, Date 2, Date 3, ... Date N]
File Cột Amount: [Amt 1, Amt 2, Amt 3, ... Amt N]
File Cột Status: [Sts 1, Sts 2, Sts 3, ... Sts N]
Mục tiêu: Đọc liên tục hàng triệu giá trị của 1 thuộc tính duy nhất trên đĩa/RAM mà không nạp các thuộc tính thừa.
```

- **OLTP (Row-Oriented Engine)**:
  - Điển hình: PostgreSQL, MySQL (InnoDB), Oracle, SQL Server.
  - Tối ưu cho các giao dịch ACID vi mô: `INSERT`, `UPDATE`, `DELETE` trên từng bản ghi độc lập.
  - Dữ liệu của cùng một hàng (tuple) được đặt liền kề nhau trong một trang đĩa vật lý (Database Page / Block, ví dụ `8KB` trong PostgreSQL, `16KB` trong InnoDB).
  - Ưu thế tuyệt đối: Thao tác ghi một hàng chỉ cần khóa và cập nhật một trang dữ liệu duy nhất kèm Write-Ahead Log (WAL).

- **OLAP (Column-Oriented Engine)**:
  - Điển hình: ClickHouse, DuckDB, Snowflake, Google BigQuery, Apache Doris, Amazon Redshift.
  - Tối ưu cho các truy vấn quét dải dữ liệu khổng lồ (Large Range Scans) và tính toán tổng hợp (`SUM`, `AVG`, `COUNT`, `GROUP BY`, `APPROX_COUNT_DISTINCT`) trên hàng triệu đến hàng tỷ dòng, nhưng chỉ chạm vào một tập con nhỏ các cột (thường từ 2 đến 10 cột trong bảng chứa hàng trăm cột).
  - Giá trị của cùng một cột trên nhiều hàng liên tiếp được gom cụm và lưu trữ liên tục trong các khối nhớ hoặc tập tin riêng biệt.

---

### 1.2. Mẫu hình Truy vấn: Point Queries vs Large Range Aggregations

Sự khác biệt về hiệu năng giữa Row-Store và Column-Store xuất phát từ sự tương thích giữa mô hình tổ chức vật lý và bản chất câu truy vấn:

#### A. Truy vấn Điểm (Point Queries / Transactional Reads)
```sql
-- Tìm kiếm bản ghi đơn lẻ theo Khóa chính (Primary Key)
SELECT id, customer_id, order_date, total_amount, shipping_address, payment_status
FROM orders
WHERE id = 98765432;
```
- **Trên Row-Store**:
  - Động cơ sử dụng chỉ mục B+Tree (`B-Tree Index`) duyệt qua $\approx 3 - 4$ tầng cây, xác định chính xác địa chỉ vật lý `(Page_ID, Slot_Offset)`.
  - Thực hiện đúng **1 lần đọc trang đĩa (Single Page Read)** kích thước 8KB. Toàn bộ thông tin của dòng `98765432` đã nằm trọn vẹn trong trang này.
  - Độ trễ (Latency): Dưới $0.5 \text{ ms}$.
- **Trên Column-Store**:
  - Bảng có 50 cột, đồng nghĩa 50 file/phân đoạn cột vật lý độc lập.
  - Để tái cấu trúc (Reconstruct) lại toàn bộ dòng `98765432`, hệ thống phải thực hiện 50 thao tác đọc đĩa ngẫu nhiên (Seek) trên 50 vị trí khác nhau để nhặt từng thuộc tính ghép lại thành 1 tuple.
  - Hiện tượng này gọi là **Tuple Reconstruction Penalty (Chi phí Tái tạo Bộ dữ liệu)**.
  - Hiệu năng: Kém hơn Row-store từ $10\times$ đến $100\times$.

#### B. Truy vấn Quét Dải Lớn & Tổng hợp (Large Analytical Aggregations)
```sql
-- Phân tích doanh thu theo quý trên 500 triệu đơn hàng
SELECT 
    EXTRACT(YEAR FROM order_date) AS yr,
    payment_status,
    SUM(total_amount) AS revenue,
    COUNT(id) AS total_orders
FROM orders
WHERE order_date >= '2025-01-01'
GROUP BY yr, payment_status;
```
- Giả sử bảng `orders` có 60 cột, kích thước trung bình 1 hàng là `500 bytes`.
  - Tổng dung lượng bảng: $500 \text{ triệu dòng} \times 500 \text{ bytes} \approx 250 \text{ GB}$.
  - Cột `order_date` (`4 bytes`), `payment_status` (`2 bytes` dạng enum/int8), `total_amount` (`8 bytes`), `id` (`8 bytes`). Tổng kích thước 4 cột: $22 \text{ bytes}$.
- **Trên Row-Store (PostgreSQL)**:
  - Động cơ phải thực hiện **Full Table Scan (Quét toàn bộ bảng)** nếu không có index bao phủ thích hợp.
  - Kích thước dữ liệu bắt buộc phải đọc từ đĩa qua hệ thống bộ nhớ đệm: **250 GB**.
  - $95.6\%$ lượng I/O tiêu thụ (239 GB) dùng để đọc các cột thừa như `shipping_address`, `customer_notes`, `tracking_code` rồi vứt bỏ ngay trên CPU!
- **Trên Column-Store (ClickHouse / DuckDB)**:
  - Động cơ chỉ đọc duy nhất 4 file cột liên quan: $500 \text{ triệu dòng} \times 22 \text{ bytes} \approx 11 \text{ GB}$ (chưa nén).
  - Nhờ các giải thuật nén dữ liệu đặc thù cho cột đồng nhất (RLE, Bit-packing, FoR), kích thước trên đĩa giảm $5\times - 10\times$, chỉ còn $\approx 1.5 - 2 \text{ GB}$.
  - Lượng I/O thực tế cần đọc: **$1.5 \text{ GB}$ so với $250 \text{ GB}$** (Giảm hơn **$160\times$** khối lượng I/O).

---

### 1.3. Cơ học Phần cứng: IOPS vs Throughput & Cache Line Locality

Hiệu năng của hệ cơ sở dữ liệu bị chi phối bởi các giới hạn vật lý của kiến trúc máy tính hiện đại (Von Neumann & Memory Wall):

```
+-------------------------------------------------------------------------+
| HỆ THỐNG PHÂN CẤP BỘ NHỚ & ĐỘ TRỄ TRUY CẬP (HARDWARE MEMORY HIERARCHY)  |
+-------------------------------------------------------------------------+
| CPU Registers     | 64-bit / 512-bit (AVX-512) | ~ 0.5 ns               |
| L1 Data Cache     | 32 KB - 64 KB per core     | ~ 1 ns (1-4 cycles)    |
| L2 Cache          | 512 KB - 1 MB per core     | ~ 3-4 ns (10-14 cycles)|
| L3 Cache (Shared) | 16 MB - 128 MB             | ~ 10-20 ns (40-60 cyc) |
| DRAM (Main Memory)| 32 GB - 1 TB               | ~ 60-100 ns            |
| NVMe SSD (PCIe 4) | Throughput: 7 GB/s         | ~ 10-30 µs             |
| HDD Cơ học        | Throughput: 150-250 MB/s   | ~ 5-10 ms              |
+-------------------------------------------------------------------------+
```

#### A. IOPS (Input/Output Operations Per Second) vs Throughput (Băng thông Truyền dẫn)
- **Hệ thống OLTP sống bằng IOPS**:
  - Truy vấn giao dịch bao gồm hàng nghìn phiên đồng thời thực hiện các thao tác ghi/đọc ngẫu nhiên (Random Access) kích thước nhỏ ($4\text{KB} - 16\text{KB}$).
  - Thước đo hiệu năng tối thượng: Số lượng thao tác I/O ngẫu nhiên mà ổ đĩa hoặc bộ đệm xử lý được trong 1 giây (ví dụ: `100,000 IOPS`).
- **Hệ thống OLAP sống bằng Sequential Throughput (Thông lượng Tuần tự)**:
  - Truy vấn phân tích bao gồm các thao tác quét tuần tự các dải block khổng lồ liên tục trên ổ cứng.
  - Thước đo hiệu năng tối thượng: Dung lượng dữ liệu được nạp vào kênh nhớ CPU trên đơn vị thời gian (ví dụ: `5 GB/s` từ NVMe array hoặc `50 GB/s` từ băng thông RAM DDR5 đa kênh).

#### B. Cache Line Locality & Hiện tượng Cache Pollution
Mỗi khi CPU nạp dữ liệu từ RAM, nó không nạp từng byte đơn lẻ mà luôn nạp nguyên một khối **CPU Cache Line kích thước chuẩn 64 Bytes**:

```
ROW-STORE: Nạp Cache Line 64 Bytes (Lãng phí do dữ liệu không đồng nhất)
+---------------------------------------------------------------------+
| ID (4B) | Name (20B) | Address (24B) | Status (8B) | Amount (8B)    |
+---------------------------------------------------------------------+
=> Khi tính SUM(Amount), CPU chỉ dùng 8 bytes cuối cùng. 
   56 bytes còn lại (87.5% Cache Line) chiếm chỗ vô ích trong L1 Data Cache!
=> Gây ra Cache Pollution (Ô nhiễm bộ đệm) và hàng loạt Cache Misses liên tục.

COLUMN-STORE: Nạp Cache Line 64 Bytes (Mật độ hữu ích tuyệt đối 100%)
+---------------------------------------------------------------------+
| Amt 1 | Amt 2 | Amt 3 | Amt 4 | Amt 5 | Amt 6 | Amt 7 | Amt 8       |
| (8B)  | (8B)  | (8B)  | (8B)  | (8B)  | (8B)  | (8B)  | (8B)        |
+---------------------------------------------------------------------+
=> Khi tính SUM(Amount), trọn vẹn 64 bytes của Cache Line đều là dữ liệu cần tính.
=> Tỷ lệ L1/L2 Cache Hit tiệm cận 100%. CPU Prefetcher dự đoán nạp trước hoàn hảo.
```

---

### 1.4. Hiện tượng Phóng đại I/O (I/O Amplification Factor Analysis)

Hệ số Phóng đại Đọc I/O ($A_{\text{read}}$) phản ánh mức độ lãng phí tài nguyên đọc giữa lượng dữ liệu đĩa thực tế phải đọc ($D_{\text{disk}}$) so với lượng dữ liệu nghiệp vụ thực sự được sử dụng ($D_{\text{useful}}$):

$$A_{\text{read}} = \frac{D_{\text{disk}}}{D_{\text{useful}}}$$

Giả sử bảng dữ liệu có $M$ cột, mỗi cột có độ rộng trung bình $W$ bytes. Câu truy vấn tổng hợp cần truy cập $k$ cột ($k \ll M$):

- **Đối với Row-Store**:
  Mỗi khi đọc một hàng để lấy $k$ thuộc tính, hệ thống buộc phải nạp toàn bộ $M$ thuộc tính của hàng đó:
  $$D_{\text{disk, row}} = N \times \sum_{i=1}^{M} W_i$$
  $$D_{\text{useful}} = N \times \sum_{j=1}^{k} W_j$$
  $$A_{\text{read, row}} \approx \frac{M}{k}$$
  *Ví dụ: Với bảng $M = 100$ cột, truy vấn phân tích chỉ cần $k = 2$ cột (`user_id`, `amount`) $\to A_{\text{read, row}} \approx \frac{100}{2} = 50\times$. Động cơ đọc thừa gấp 50 lần lượng dữ liệu cần thiết!*

- **Đối với Column-Store có Nén**:
  Hệ thống chỉ đọc đúng $k$ cột được chỉ định trong câu lệnh `SELECT` và `WHERE` (Hiện tượng này gọi là **Projection Pruning**):
  $$D_{\text{disk, col}} = N \times \sum_{j=1}^{k} \frac{W_j}{C_j}$$
  *(Trong đó $C_j$ là Hệ số nén (Compression Ratio) của cột $j$, thông thường $C_j \in [3, 15]$)*.
  $$A_{\text{read, col}} = \frac{\sum_{j=1}^{k} \frac{W_j}{C_j}}{\sum_{j=1}^{k} W_j} = \frac{1}{\bar{C}} < 1$$
  *Hệ số I/O Amplification của Column-store nhỏ hơn 1 (thậm chí đạt $0.1\times$), nghĩa là số byte đọc từ đĩa vật lý ít hơn cả kích thước nguyên thủy của dữ liệu trong bộ nhớ nhờ khả năng giải nén tốc độ cao trên CPU!*

---

### 1.5. Bảng Đối chiếu Toàn diện 15 Tiêu chí Kỹ thuật: Row-Store vs Column-Store

| STT | Tiêu chí Kiến trúc | OLTP (Row-Oriented Engine) | OLAP (Column-Oriented Engine) |
| :--- | :--- | :--- | :--- |
| **1** | **Bố cục Bộ nhớ/Đĩa** | N-ary Storage Model (NSM) - Xếp theo hàng | Decomposition Storage Model (DSM) - Xếp theo cột |
| **2** | **Thao tác Ghi (Writes)** | Ghi trực tiếp In-place, chi phí cực thấp cho từng dòng đơn lẻ | Ghi theo lô lớn (Bulk Inserts), chi phí cao nếu ghi lẻ tẻ (Part Explosion) |
| **3** | **Cập nhật & Xóa (Updates/Deletes)** | Cập nhật tại chỗ hoặc MVCC Append trực tiếp trong trang | Bất biến (Immutable Data Parts); sử dụng Merge-on-Read hoặc Copy-on-Write |
| **4** | **Hiệu suất Truy vấn Điểm** | Cực nhanh ($< 1 \text{ ms}$) nhờ B-Tree Point Lookups | Kém ($10\text{ ms} - 100\text{ ms}$) do chi phí Tuple Reconstruction |
| **5** | **Hiệu suất Quét Tổng hợp** | Rất chậm trên dải dữ liệu lớn do I/O Amplification | Cực nhanh, quét hàng chục triệu dòng/giây/core |
| **6** | **Tỷ lệ Nén Dữ liệu** | Kém ($1.5\times - 2.5\times$) do các kiểu dữ liệu dị loại nằm xen kẽ | Xuất sắc ($5\times - 15\times$) do kiểu dữ liệu đồng nhất, entropy thấp |
| **7** | **Động cơ Thực thi CPU** | Volcano Iterator Model (`next()` từng tuple ảo) | Vectorized Engine (Xử lý mảng SIMD) hoặc LLVM Codegen |
| **8** | **Mức độ Tiêu thụ Bộ nhớ Cache** | Kém; Cache Pollution do nạp các trường dữ liệu thừa | Tối ưu 100%; toàn bộ 64B Cache Line đều phục vụ tính toán |
| **9** | **Cấu trúc Chỉ mục Chủ đạo** | Chỉ mục Dày (Dense Index): B+Tree, Hash Index, GiST, GIN | Chỉ mục Thưa (Sparse Index), Min/Max Zone Maps, Roaring Bitmaps |
| **10** | **Khả năng Mở rộng Quy mô** | Scale-Up (Dọc) là chủ đạo; Sharding phức tạp (2PC) | Tự nhiên hỗ trợ Scale-Out (Ngang), Massively Parallel Processing (MPP) |
| **11** | **Chi phí Thao tác JOIN** | Hiệu quả cao với Nested Loop & Index Scan trên tập nhỏ | Tốn kém; ưu tiên Hash Join phân tán hoặc mô hình Denormalized (OBT) |
| **12** | **Mô hình Khóa & Đồng thời** | Pessimistic Locking (Row-level Locks), MVCC chi tiết | Optimistic Concurrency Control, Snapshot Isolation, Append-Only |
| **13** | **Thước đo Băng thông** | Đo lường bằng IOPS ngẫu nhiên | Đo lường bằng Băng thông Tuần tự (GB/s Throughput) |
| **14** | **Phù hợp Nghiệp vụ** | ERP, Core Banking, E-Commerce Checkout, CRM | Data Warehouse, Clickstream Analytics, Telemetry, BI Dashboard |
| **15** | **Đại diện Tiêu biểu** | PostgreSQL, MySQL, Oracle, CockroachDB | ClickHouse, DuckDB, Snowflake, Apache Iceberg, BigQuery |

---

## 2. BẢN CHẤT TẦNG VẬT LÝ LƯU TRỮ CỘT (COLUMNAR STORAGE INTERNALS)

### 2.1. Cấu trúc Phân đoạn Vật lý: Block, Segment, Chunk, Row Group & Granule

Mặc dù lưu trữ dữ liệu dạng cột, nhưng một hệ thống không thể lưu trữ toàn bộ một cột hàng tỷ dòng vào một mảng liên tục vô tận trên đĩa (vì không đủ RAM để thao tác, không thể phân vùng song song và khó nén). Thay vào đó, tất cả các hệ thống lưu trữ cột hiện đại đều áp dụng kiến trúc **Lưu trữ Cột theo Khối Hàng (Hybrid Pax / Chunked Columnar Layout)**:

```
+-----------------------------------------------------------------------------------------------+
| TOÀN BỘ BẢNG DỮ LIỆU (TABLE - 100 TRIỆU HÀNG)                                                 |
+-----------------------------------------------------------------------------------------------+
  |
  +---> ROW GROUP 1 (Hàng 1 -> Hàng 1,000,000)
  |       |
  |       +---> Column Chunk "Timestamp"  [Min: 2026-01-01, Max: 2026-01-05] -> Nén Gorilla
  |       +---> Column Chunk "User_ID"    [Min: 100,        Max: 999999]     -> Nén Bit-pack
  |       +---> Column Chunk "Action"     [Dictionary: Click, Buy, View]     -> Nén Dict (2 bits)
  |       +---> Column Chunk "Revenue"    [Min: 0.0,        Max: 4500.0]     -> Nén ZSTD
  |
  +---> ROW GROUP 2 (Hàng 1,000,001 -> Hàng 2,000,000)
  |       |
  |       +---> Column Chunk "Timestamp"  [Min: 2026-01-06, Max: 2026-01-10] ...
  |       +---> Column Chunk "User_ID"    ...
  |
  +---> ROW GROUP K (...)
```

#### A. Phân định Cấp bậc Vật lý trong Các Định dạng Chuẩn

1. **Apache Parquet (Chuẩn lưu trữ Lakehouse / Big Data)**:
   - **File**: Chứa Header nhận dạng `PAR1`, một hoặc nhiều Row Groups, và File Metadata nằm ở cuối file (Footer).
   - **Row Group**: Đại diện cho một tập con các hàng logic (khuyến nghị kích thước từ $512 \text{ MB} - 1 \text{ GB}$ trên bộ nhớ, chứa $\approx 1 - 10 \text{ triệu dòng}$).
   - **Column Chunk**: Dữ liệu của một cột cụ thể nằm trong một Row Group.
   - **Data Page**: Đơn vị nén và mã hóa nhỏ nhất bên trong Column Chunk (kích thước chuẩn $\approx 1 \text{ MB}$). Động cơ giải nén theo từng Page.
   - **Dictionary Page**: Chứa bảng tra cứu từ điển của cột đó nếu áp dụng mã hóa từ điển.

2. **ClickHouse (Động cơ MergeTree)**:
   - **Data Part**: Mỗi thao tác `INSERT` hoặc quá trình ghép nền (Merge) tạo ra một thư mục vật lý độc lập (Data Part).
   - **Column Files (`[column].bin`)**: Dữ liệu của từng cột được lưu trong một file nhị phân riêng biệt, chia thành các Compressed Blocks ($64 \text{ KB} - 1 \text{ MB}$).
   - **Mark Files (`[column].mrk2`)**: Cầu nối giữa Sparse Index và vị trí byte vật lý trong file `.bin`.
   - **Granule**: Đơn vị tính toán logic cơ bản, mặc định gồm **8,192 hàng**. Mỗi Granule tương ứng với đúng 1 điểm chỉ mục trong Sparse Index.

3. **DuckDB (In-Process Storage)**:
   - **Block**: Đơn vị vật lý cấp phát trên đĩa, kích thước cố định $256 \text{ KB}$.
   - **Row Group**: Đại diện cho khối dữ liệu gồm **122,880 hàng** (bội số của 64 và 2048 để tối ưu SIMD vector).
   - **Column Segment**: Một đoạn cột bên trong Row Group, bao gồm một hoặc nhiều đĩa Block liên kết.

#### B. Zone Maps & Kỹ thuật Loại trừ Khối (Block/Row-Group Skipping)
Mỗi Row Group hoặc Data Page luôn lưu trữ **Metadata thống kê cực tiểu**:
- `min_value`, `max_value`
- `null_count`
- Bloom Filter (tùy chọn)

Khi thực thi câu truy vấn có điều kiện:
```sql
SELECT count(*) FROM telemetry WHERE temperature > 100.0;
```
Bộ tối ưu hóa truy vấn kiểm tra Zone Map của từng Row Group: Nếu `max_value <= 100.0`, toàn bộ Row Group (hàng triệu dòng) bị **bỏ qua ngay lập tức ở cấp độ Metadata mà không cần chạm vào ổ đĩa**! Kỹ thuật này gọi là **Predicate Pushdown / Data Pruning**.

---

### 2.2. Động cơ Thực thi Vector hóa (Vectorized Execution Engine) & Tập lệnh SIMD (AVX-512)

#### A. Giới hạn của Mô hình Truyền thống Volcano Iterator Model
Trong các hệ thống RDBMS truyền thống (PostgreSQL, SQLite), câu truy vấn được biên dịch thành một cây các toán tử (Plan Operators). Mỗi toán tử giao tiếp thông qua giao diện Iterator:

```cpp
// Mô hình Volcano (Tuple-at-a-time)
class Operator {
public:
    virtual Tuple* next() = 0; // Trả về từng dòng đơn lẻ
};
```

```
CÂY TOÁN TỬ TRUY VẤN (VOLCANO MODEL):
[Filter: amount > 100]  <--- Gọi next() 1,000,000,000 lần!
         ^
         |
[SeqScan: orders]
```

**Các nút thắt phần cứng chí mạng của Volcano Model:**
1. **Dynamic Dispatch Overhead (Chi phí Lệnh gọi Hàm Ảo)**: Với $1 \text{ tỷ bản ghi}$, hệ thống phải thực hiện hàng tỷ lệnh gọi `call virtual next()`. CPU không thể inline hàm này, phá vỡ pipeline của CPU.
2. **Branch Misprediction (Dự đoán Nhánh Sai)**: Bên trong vòng lặp của toán tử Filter, câu lệnh `if (tuple->amount > 100)` liên tục rẽ nhánh ngẫu nhiên. Khi tỷ lệ rẽ nhánh khó đoán, CPU Branch Predictor thất bại, xóa sạch Pipeline instruction dẫn đến lãng phí 15 - 20 chu kỳ CPU cho mỗi lần đoán sai.
3. **Không thể tận dụng SIMD**: Việc xử lý từng con trỏ `Tuple*` với cấu trúc bộ nhớ phân mảnh khiến CPU không thể nạp dữ liệu vào thanh ghi vector.

#### B. Mô hình Thực thi Vector hóa (Vectorized / Block-at-a-time Model)
Được tiên phong bởi Peter Boncz trong dự án **MonetDB/X100 (VectorWise)**, động cơ chuyển từ xử lý 1 tuple sang xử lý một mảng liên tục các giá trị (Vector / Batch, thường gồm $1024, 2048$ hoặc $8192$ phần tử):

```cpp
// Mô hình Vectorized Execution (Vector-at-a-time)
class VectorizedOperator {
public:
    virtual VectorBatch* next_batch() = 0; // Trả về 1 mảng 2048 phần tử
};
```

Bên trong toán tử Filter, động cơ sử dụng một vòng lặp phẳng trên mảng dữ liệu nguyên thủy (Primitive Array):

```c
// Vòng lặp Vectorized Filter phẳng, dễ dàng vector hóa
void filter_greater_than_int32(
    const int32_t* __restrict src, 
    uint8_t* __restrict selection_vector, 
    int32_t threshold, 
    size_t n
) {
    #pragma clang loop vectorize(enable)
    for (size_t i = 0; i < n; ++i) {
        selection_vector[i] = (src[i] > threshold) ? 1 : 0;
    }
}
```

#### C. Khai thác Tập lệnh SIMD (Single Instruction, Multiple Data) & AVX-512
Các bộ vi xử lý hiện đại (Intel Xeon, AMD EPYC) trang bị các thanh ghi vector độ rộng **512 bits (ZMM0 - ZMM31)**:
- Một thanh ghi 512-bit chứa được: $16 \text{ số nguyên 32-bit (int32)}$ hoặc $8 \text{ số thực 64-bit (double)}$.
- Một lệnh assembly duy nhất của AVX-512 có thể thực thi phép so sánh hoặc phép cộng trên toàn bộ 16 phần tử này trong đúng **1 chu kỳ xung nhịp CPU**!

```
LỆNH SO SÁNH AVX-512 (VPCMPGTD - Vector Compare Greater Than Dword):

Thanh ghi ZMM1: [ 120 |  45 | 300 |  89 | 500 |  12 | 150 | 200 | ... 16 values ]
Thanh ghi ZMM2: [ 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | ... 16 values ]
                          || (Thực thi trong 1 chu kỳ CPU duy nhất)
Bitmask K1:     [  1  |  0  |  1  |  0  |  1  |  0  |  1  |  1  | ... 16 bits   ]
```

Kết quả trả về không phải là việc sao chép lại dữ liệu mà là một **Bitmask (Mặt nạ bit)** hoặc **Selection Vector (Vector lựa chọn)**. Các toán tử tiếp theo chỉ cần dựa vào mặt nạ này để tính toán tổng hợp, đạt tốc độ xử lý hàng tỷ bản ghi mỗi giây trên một nhân CPU duy nhất.

---

### 2.3. So sánh: Volcano Iterator Model vs Vectorized Execution vs JIT Compilation (LLVM)

Trong thế giới động cơ phân tích hiện đại, có hai trường phái đối nghịch cạnh tranh với Volcano Model: **Vectorization (DuckDB, ClickHouse)** và **Compilation-based / JIT (HyPer, SingleStore, Spark Tungsten)**:

| Tiêu chuẩn Kiến trúc | Volcano Iterator Model | Vectorized Execution (MonetDB/X100) | JIT Compilation (HyPer / LLVM) |
| :--- | :--- | :--- | :--- |
| **Đơn vị xử lý** | 1 Tuple mỗi lượt | 1 Batch / Vector ($1024 - 8192$ giá trị) | Toàn bộ Pipeline dữ liệu được gộp lại |
| **Cơ chế tối ưu CPU** | Không có (Phụ thuộc Compiler mặc định) | SIMD Hardware Instructions (AVX-2, AVX-512, Neon) | Data-centric, giữ dữ liệu trong CPU Registers tối đa |
| **Chi phí Lệnh gọi Ảo** | Cực kỳ cao ($N$ lần gọi hàm ảo) | Rất thấp (Giảm $1000\times - 8000\times$ số lần gọi) | Triệt tiêu hoàn toàn (Inline code hoàn toàn) |
| **Thời gian Biên dịch** | $0 \text{ ms}$ (Thông dịch ngay) | $0 \text{ ms}$ (Thông dịch vector ngay lập tức) | Tốn từ $10\text{ ms} - 200\text{ ms}$ để LLVM sinh mã máy |
| **Độ phức tạp Hệ thống** | Đơn giản, dễ bảo trì | Trung bình; phụ thuộc cấu trúc Vector & Cache | Cực kỳ phức tạp; khó debug mã máy sinh ra tại runtime |
| **Ưu thế tuyệt đối** | Truy vấn OLTP ngắn, phản hồi microsecond | Truy vấn OLAP quét dữ liệu lớn, Interactive BI | Truy vấn nặng tính toán toán học phức tạp, CPU-bound |
| **Đại diện tiêu biểu** | PostgreSQL, SQLite, MySQL | ClickHouse, DuckDB, Snowflake | HyPer (Tableau), SingleStore, Databricks Photon |

---

### 2.4. Khảo sát Chuyên sâu Các Giải thuật Nén Dữ liệu Cột (Columnar Compression Algorithms)

Do dữ liệu trong cùng một cột có cùng kiểu dữ liệu và thường có tính chất lặp lại hoặc biến thiên có quy luật (Entropy thấp), hệ thống OLAP áp dụng các giải thuật nén chuyên biệt trước khi áp dụng các bộ nén khối tổng quát.

#### A. Run-Length Encoding (RLE - Mã hóa Độ dài Chạy)
- **Bản chất**: Thay thế chuỗi các phần tử giống nhau liên tiếp bằng một cặp giá trị: `(giá trị, số lần lặp lại)`.
- **Yêu cầu**: Dữ liệu phải có Cardinality thấp (số lượng giá trị phân biệt ít) hoặc đã được sắp xếp (`SORTED`).

```
Chuỗi gốc (12 phần tử int32 = 48 bytes):
[ "VN", "VN", "VN", "VN", "VN", "SG", "SG", "SG", "US", "US", "US", "US" ]

Áp dụng RLE (3 cặp struct {value, count} = 3 x (2B + 4B) = 18 bytes):
[ ("VN", 5), ("SG", 3), ("US", 4) ]

=> Tỷ lệ nén: 2.67x.
=> Điểm vượt trội: Khi thực thi WHERE country = 'VN', CPU chỉ cần kiểm tra 1 phép so sánh
   và biết ngay 5 dòng đầu tiên thỏa mãn mà không cần quét qua từng dòng!
```

#### B. Bit-Packing & Frame of Reference (FoR)
- **Bản chất**: Kiểu số nguyên `int64` tiêu tốn 8 bytes (64 bits), nhưng trong thực tế các giá trị nghiệp vụ thường chỉ dao động trong một khoảng hẹp quanh một giá trị cơ sở (Base/Frame).
- **Cơ chế**:
  1. Tìm giá trị nhỏ nhất trong Block: $Min = \text{Frame of Reference}$.
  2. Tính độ lệch của từng phần tử: $\Delta_i = X_i - Min$.
  3. Tìm giá trị $\Delta_{max}$. Số bit tối thiểu cần thiết để chứa $\Delta_{max}$ là:
     $$b = \lceil \log_2(\Delta_{max} + 1) \rceil$$
  4. Đóng gói (Pack) toàn bộ các giá trị $\Delta_i$ vào đúng $b$ bits thay vì 64 bits.

```
Dữ liệu năm sinh khách hàng (int32 - 4 bytes/giá trị):
[ 1995, 1998, 1996, 2002, 1995, 1999, 2001, 1996 ]

1. Frame of Reference (Min) = 1995
2. Chuỗi Delta: [ 0, 3, 1, 7, 0, 4, 6, 1 ]
3. Delta lớn nhất = 7. Cần đúng 3 bits để biểu diễn (2^3 = 8 > 7).
4. Bit-packing:
   Thay vì tốn 8 * 32 bits = 256 bits, ta chỉ tốn 8 * 3 bits = 24 bits!
   
=> Tiết kiệm 90.6% dung lượng bộ nhớ.
```

#### C. Delta-of-Delta & Gorilla Compression (Nén Timestamps & Floats IEEE 754)
Được phát triển bởi Facebook trong hệ thống Time-Series **Gorilla (2015)**, hiện được ClickHouse, Chariot, InfluxDB và Prometheus sử dụng làm chuẩn mực:

1. **Nén Timestamp (Delta-of-Delta)**:
   - Các bản ghi log/telemetry thường được ghi nhận theo chu kỳ đều đặn (ví dụ: mỗi 10 giây).
   - Timestamp gốc: $T_0, T_1, T_2, T_3, \dots$
   - Delta bậc 1: $D_i = T_i - T_{i-1}$
   - Delta-of-Delta (Độ biến thiên gia tốc): $\Delta D_i = D_i - D_{i-1}$
   - Nếu dữ liệu đến đúng chu kỳ: $\Delta D_i = 0 \to Chỉ cần biểu thị bằng **1 bit duy nhất `0`**!
   - Nếu $\Delta D_i \neq 0$: Dùng mã tiền tố biến thiên (Variable-length prefix code) từ 2 đến 36 bits.

2. **Nén Số thực (Floating-Point XOR Compression)**:
   - Số thực dấu phẩy động 64-bit IEEE 754: 1 bit dấu, 11 bits mũ (exponent), 52 bits định trị (mantissa).
   - Khi đo đạc nhiệt độ hoặc giá cổ phiếu biến thiên nhỏ, phần lớn các bit biểu diễn giữa hai giá trị liên tiếp là giống hệt nhau.
   - Thuật toán:
     - Lấy $XOR = Value_i \oplus Value_{i-1}$.
     - Nếu $XOR = 0$ (giá trị không đổi): Lưu 1 bit `0`.
     - Nếu $XOR \neq 0$: Đếm số lượng bit `0` dẫn đầu (Leading Zeros) và bit `0` kết thúc (Trailing Zeros), chỉ lưu các bit có ý nghĩa ở giữa (Meaningful bits).

#### D. Dictionary Encoding (Từ điển Mã hóa)
- **Bản chất**: Thay thế các chuỗi ký tự dài (Strings/VARCHAR) có tần suất lặp lại cao bằng các mã định danh số nguyên ngắn (Integer Surrogate IDs).
- **Cấu trúc**:
  - **Dictionary Table (Bảng tra cứu)**: Lưu danh sách các chuỗi duy nhất: `{0: "PENDING", 1: "PROCESSING", 2: "COMPLETED", 3: "FAILED"}`.
  - **Data Array (Mảng dữ liệu)**: Chỉ lưu các ID số nguyên. Do chỉ có 4 trạng thái, mỗi ID chỉ tốn $2 \text{ bits}$ (Bit-packed) thay vì $10 - 30 \text{ bytes}$ cho mỗi chuỗi string UTF-8.

#### E. General-Purpose Block Compressors: LZ4 vs Zstandard (ZSTD)
Sau khi dữ liệu cột đã được mã hóa bằng RLE, Bit-packing hoặc Dictionary, nó được đưa qua bộ nén khối tổng quát cấp độ byte:

```
+-----------------------------------------------------------------------------------+
| BỘ NÉN        | TỐC ĐỘ GIẢI NÉN (DECOMPRESSION) | TỐC ĐỘ NÉN   | TỶ LỆ NÉN (RATIO)|
+-----------------------------------------------------------------------------------+
| LZ4           | Cực nhanh (> 3 - 5 GB/s / core) | Rất nhanh    | Trung bình (~2x) |
| ZSTD (Level 1)| Nhanh (~ 1.5 - 2 GB/s / core)   | Nhanh        | Tốt (~3.5x)      |
| ZSTD (Level 19| Chậm (~ 800 MB/s / core)        | Cực chậm     | Xuất sắc (> 5x)  |
| GZIP / Snappy | Lạc hậu, không tối ưu cho OLAP hiện đại                           |
+-----------------------------------------------------------------------------------+
```
- **Chiến lược Sản xuất trong ClickHouse / DuckDB**:
  - Sử dụng **LZ4** làm mặc định cho dữ liệu nóng/ấm (Hot/Warm data) vì tốc độ giải nén của LZ4 nhanh hơn tốc độ đọc của đĩa NVMe, giúp giải phóng băng thông CPU tối đa.
  - Sử dụng **ZSTD (Level 3 - 7)** cho dữ liệu lạnh (Cold historical data) nhằm tối ưu hóa chi phí lưu trữ trên S3/Object Storage.

#### F. Roaring Bitmaps (Bitmap Tinh gọn)
- Kỹ thuật nén tập hợp số nguyên không âm thành các cấu trúc Container động (Array Container cho tập thưa, Bitmap Container 8KB cho tập dày, Run Container cho chuỗi liên tiếp).
- Cho phép thực hiện các phép toán đại số tập hợp `AND`, `OR`, `XOR`, `ANDNOT` trên hàng trăm triệu ID người dùng chỉ trong vài microsecond bằng tập lệnh SIMD bitwise.

---

## 3. KIẾN TRÚC ĐỘNG CƠ OLAP HIỆN ĐẠI THỰC CHIẾN (MODERN OLAP ENGINES IN-DEPTH)

### 3.1. ClickHouse: Tượng đài Động cơ Phân tích Phân tán (Distributed Columnar Engine)

ClickHouse (ban đầu do Yandex phát triển cho hệ thống Yandex.Metrica) là hệ quản trị cơ sở dữ liệu hướng cột có tốc độ truy vấn tổng hợp nhanh bậc nhất hiện nay, được thiết kế theo tư duy *phần cứng tối thượng* (Hardware-First Philosophy).

```
KIẾN TRÚC LƯU TRỮ VẬT LÝ CLICKHOUSE MERGETREE PART:
Thư mục: /var/lib/clickhouse/data/default/events/202601_1_15_3/
├── checksums.txt            # Checksum toàn vẹn dữ liệu
├── columns.txt              # Danh sách định nghĩa các cột & kiểu dữ liệu
├── count.txt                # Tổng số dòng trong part (vd: 120,000)
├── primary.idx              # Sparse Index (Index entries cho mỗi granule)
├── event_time.bin           # Dữ liệu nén (Compressed blocks) của cột event_time
├── event_time.mrk2          # Mark file trỏ vị trí byte trong event_time.bin
├── user_id.bin              # Dữ liệu nén của cột user_id
├── user_id.mrk2             # Mark file trỏ vị trí byte trong user_id.bin
└── default_compression_codec.txt
```

#### A. Họ Động cơ MergeTree (The MergeTree Engine Family)
Trái tim của ClickHouse là dòng động cơ `MergeTree`, vận hành theo nguyên lý tương tự như **Log-Structured Merge-tree (LSM-Tree)** nhưng được tối ưu hóa cho dữ liệu dạng cột bất biến:

1. **`MergeTree`**: Động cơ nền tảng cơ bản nhất. Dữ liệu ghi vào được gom thành các Part bất biến và được ghép nền liên tục.
2. **`ReplacingMergeTree`**:
   - Tự động khử trùng lặp (Deduplication) các bản ghi có cùng Sorting Key trong quá trình Merge nền.
   - Hỗ trợ cơ chế Versioning qua cột `ver`: Chỉ giữ lại bản ghi có phiên bản lớn nhất.
   - *Cảnh báo Kiến trúc*: Quá trình khử trùng lặp diễn ra bất đồng bộ trong background. Truy vấn tức thời vẫn có thể thấy dữ liệu trùng lặp nếu chưa merge xong, trừ khi sử dụng mệnh đề `FINAL` (gây suy giảm hiệu năng nặng nề) hoặc tái cấu trúc truy vấn với `argMax()`.
3. **`AggregatingMergeTree`**:
   - Thay thế việc lưu trữ chi tiết bằng việc lưu trữ các trạng thái tổng hợp trung gian (`AggregateFunctionState`).
   - Kết hợp hoàn hảo với **Materialized Views**: Tự động tính toán trước các chỉ số thống kê (`uniqExactState`, `sumState`, `quantilesExactWeightedState`) ngay khi ghi dữ liệu.
4. **`SummingMergeTree`**: Tự động cộng dồn các cột số (numeric metrics) của tất cả các dòng có cùng khóa phân loại trong quá trình Merge.
5. **`CollapsingMergeTree` & `VersionedCollapsingMergeTree`**: Xóa hoặc cập nhật bản ghi thông qua cơ chế cặp dòng đối ngẫu (Sign column: `1` cho Insert, `-1` cho Cancel/Delete), triệt tiêu hoàn toàn chi phí cập nhật tại chỗ.

#### B. Cấu trúc Chỉ mục Thưa (Sparse Index) & Cơ chế Granule
Khác với B-Tree của PostgreSQL lưu con trỏ đến *từng dòng dữ liệu đơn lẻ* (Dense Index), ClickHouse sử dụng **Sparse Index (Chỉ mục thưa)**:

```
PRIMARY KEY / ORDER BY (UserID, EventTime)
Chỉ mục Thưa: Chỉ lấy 1 giá trị đại diện sau mỗi 8,192 dòng (1 Granule)

Granule 0 (Rows 0-8191)       Granule 1 (Rows 8192-16383)   Granule 2 (Rows 16384-24575)
Index Entry: (ID: 100, 10:00) Index Entry: (ID: 100, 10:05) Index Entry: (ID: 250, 08:00)
       |                             |                             |
       v                             v                             v
[primary.idx]: [ (100, 10:00) ]              [ (100, 10:05) ]              [ (250, 08:00) ]
       |                             |                             |
       v (Tra cứu qua Mark file)     v                             v
[user_id.mrk2]: (Offset_Bin, Offset_Uncompressed)
       |
       v (Nạp trực tiếp Compressed Block tương ứng)
[user_id.bin]: [ Compressed Block 64KB -> Giải nén ra đúng Granule cần đọc ]
```

- **Đặc tính Kỹ thuật**:
  - `primary.idx` có kích thước siêu nhỏ, được nạp toàn bộ vào RAM ngay khi khởi động node.
  - Khi thực hiện `WHERE UserID = 100 AND EventTime >= '10:02'`: Động cơ thực hiện Binary Search trên `primary.idx` trong RAM, xác định chính xác chỉ cần quét `Granule 0` và `Granule 1`, loại bỏ hoàn toàn `Granule 2` và hàng triệu Granules khác.
  - Mark file (`.mrk2`) chứa con trỏ kép: Vị trí bắt đầu của Compressed Block trong file `.bin` và độ lệch (Offset) của Granule đó bên trong Block sau khi giải nén.

#### C. Ranh giới Sinh tử: `ORDER BY` vs `PRIMARY KEY`
- Trong ClickHouse, mệnh đề bắt buộc là **`ORDER BY` (Sorting Key)**: Xác định trật tự sắp xếp vật lý của dữ liệu trên đĩa. Trật tự này quyết định trực tiếp đến hiệu quả nén dữ liệu của các thuật toán RLE/Bit-packing.
- Mệnh đề `PRIMARY KEY` là tập con tiền tố của `ORDER BY`. Nếu không khai báo riêng, `PRIMARY KEY` mặc định giống hệt `ORDER BY`.
- **Quy tắc Vàng thiết kế Sorting Key**:
  1. Đặt các cột có **Cardinality thấp (ít giá trị phân biệt)** lên đầu để tối ưu hóa nén và thu hẹp không gian tìm kiếm nhị phân nhanh nhất (ví dụ: `tenant_id`, `status`).
  2. Đặt các cột có khoảng dải quét liên tục theo sau (ví dụ: `event_date`, `timestamp`).
  3. Cột có Cardinality cực cao (ví dụ: `uuid`, `raw_payload`) tuyệt đối không đưa lên đầu khóa `ORDER BY` vì sẽ phá hủy toàn bộ tính liền mạch của các cột còn lại.

#### D. Vòng đời Data Part: Cơ chế Ghép nền (Background Merges) & Xử lý Dữ liệu
- Mỗi câu lệnh `INSERT` tạo ra một Part mới hoàn toàn độc lập (chứa đầy đủ các file `.bin`, `.mrk2`, `primary.idx`).
- Nếu ứng dụng thực hiện ghi từng dòng lẻ tẻ (Micro-batches / 1 dòng mỗi request), hệ số tạo Part sẽ vượt quá tốc độ ghép nền của ClickHouse, dẫn đến lỗi kinh điển:
  `DB::Exception: Too many parts in all data parts in table (200). Merges are processing significantly slower than inserts.`
- **Cơ chế Xóa/Sửa**:
  - `ALTER TABLE ... UPDATE/DELETE`: Thực hiện **Heavy Mutation**, viết lại toàn bộ Part trên đĩa, tốn I/O cực lớn.
  - **Lightweight Deletes (`DELETE FROM ... WHERE`)**: Sử dụng file ẩn `_row_exists` (Bitmap) để đánh dấu dòng đã bị xóa mà không cần viết lại dữ liệu ngay lập tức.

#### E. Code DDL Chuẩn Sản xuất cho ClickHouse
```sql
-- Thiết kế Bảng Sự kiện Clickstream Tối ưu Hóa Cho Hàng Tỷ Bản Ghi
CREATE TABLE analytics.user_events_local ON CLUSTER production_cluster
(
    event_date Date CODEC(DoubleDelta, LZ4),
    event_time DateTime64(3, 'UTC') CODEC(DoubleDelta, LZ4),
    tenant_id UInt32 CODEC(T64, ZSTD(1)),
    environment LowCardinality(String), -- Tự động áp dụng Dictionary Encoding
    event_type LowCardinality(String),
    user_id UInt64 CODEC(T64, ZSTD(1)),
    session_id UUID,
    url_path String CODEC(ZSTD(3)),
    response_time_ms UInt32 CODEC(T64, LZ4),
    revenue Decimal64(4) CODEC(T64, LZ4),
    properties Map(String, String) CODEC(ZSTD(3))
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{shard}/user_events', '{replica}')
PARTITION BY toYYYYMM(event_date)
PRIMARY KEY (tenant_id, event_type, event_date)
ORDER BY (tenant_id, event_type, event_date, user_id, event_time)
SETTINGS 
    index_granularity = 8192,
    parts_to_throw_insert = 300,
    max_part_removal_threads = 8;
```

---

### 3.2. DuckDB: "SQLite cho Phân tích" (In-Process Vectorized OLAP)

DuckDB là động cơ phân tích nhúng chạy trong cùng không gian tiến trình (In-Process OLAP Engine), loại bỏ hoàn toàn chi phí truyền dẫn mạng (Network Overhead) và giao thức Client-Server IPC.

```
MÔ HÌNH NHÚNG (IN-PROCESS) CỦA DUCKDB:
+--------------------------------------------------------------------------+
| TIẾN TRÌNH ỨNG DỤNG (PYTHON / R / NODE.JS / C++ PROCESS RUNTIME)          |
|                                                                          |
|  +--------------------+         Zero-Copy (Con trỏ RAM) +-------------+  |
|  | Python Runtime     | <=============================> | DuckDB Core |  |
|  | (Pandas / Polars / |       Apache Arrow IPC /        | (Vectorized |  |
|  |  PyArrow Table)    |       C Data Interface          |  Execution) |  |
|  +--------------------+                                 +-------------+  |
+--------------------------------------------------------------------------+
                                                                 |
                                       Đọc trực tiếp đa luồng    v
                                                 +----------------------+
                                                 | S3 / Parquet / Iceberg|
                                                 +----------------------+
```

#### A. Kiến trúc Điều phối Song song Morsel-Driven Parallelism
DuckDB loại bỏ mô hình phân chia luồng tĩnh theo cây truy vấn. Thay vào đó, nó ứng dụng kiến trúc **Morsel-Driven Parallelism** (phát triển bởi Đại học Kỹ thuật München - TUM):
- Dữ liệu đầu vào được chia thành các phần nhỏ gọi là **Morsels** ($\approx 10,000 - 100,000$ hàng).
- Một **Thread Pool** tương ứng với số lõi CPU vật lý liên tục nhận các Morsel sẵn sàng từ hàng đợi tác vụ.
- Đảm bảo **Khả năng co giãn tuyến tính (Linear Scalability)** và tránh hoàn toàn hiện tượng thắt cổ chai do phân bổ tải không đồng đều giữa các luồng (Work Inbalance).

#### B. Cấu trúc Vector & DataChunk (2048 Tuples Buffer)
- Đơn vị trao đổi dữ liệu trung tâm bên trong DuckDB là `DataChunk`, bao gồm một mảng các đối tượng `Vector`.
- Mỗi `Vector` chứa tối đa **2048 giá trị** thuộc cùng một kiểu dữ liệu.
- Cơ chế **Selection Vector**: Khi thực hiện bộ lọc `WHERE`, DuckDB không sao chép dữ liệu của các hàng thỏa mãn ra mảng mới. Nó chỉ khởi tạo một mảng chỉ mục 16-bit (`sel_t sel_vector[]`) chứa các vị trí `[0, 5, 12, 2047]`. Mọi phép toán tiếp theo chỉ đọc các chỉ mục này, đạt hiệu năng xử lý bộ nhớ bằng không (Zero-allocation).

#### C. Tích hợp Không Sao Chép Dữ liệu (Zero-Copy Integration) với Apache Arrow
DuckDB cài đặt chuẩn **Arrow C Data Interface**:
- Chia sẻ trực tiếp các con trỏ bộ nhớ đệm (Buffer Pointers) của mảng Arrow giữa tiến trình Python/Polars và DuckDB mà không xảy ra bất kỳ thao tác Serialization hay Deserialization nào.
- Có khả năng truy vấn trực tiếp trên DataFrame hàng chục triệu dòng của Pandas/Polars với tốc độ tương đương C++.

#### D. Cơ chế Xử lý Vượt Bộ nhớ (Out-of-Core Processing & Disk Spilling)
Khi câu lệnh truy vấn tổng hợp (`GROUP BY`, `ORDER BY`, `WINDOW`) đòi hỏi không gian bộ nhớ vượt quá giới hạn RAM vật lý:
- DuckDB tự động kích hoạt **External Streaming Aggregation / External Sorting**.
- Dữ liệu tạm thời được mã hóa nhẹ và đẩy xuống các file phân vùng trên ổ cứng tạm (Disk Spill).
- Cho phép một máy tính xách tay với 16GB RAM có thể phân tích trọn vẹn tập dữ liệu 200GB Parquet mà không bao giờ bị lỗi `Out of Memory (OOM)`.

#### E. Code Thực thi DuckDB Python Phân tích Parquet từ xa trên S3
```python
import duckdb

# Khởi tạo kết nối in-process với cấu hình bộ nhớ và ổ đĩa tràn (Disk Spill)
con = duckdb.connect(database=':memory:')

# Cấu hình tài nguyên phần cứng
con.execute("""
    SET memory_limit = '8GB';
    SET threads = 8;
    SET preserve_insertion_order = false;
    SET temp_directory = '/tmp/duckdb_spill';
""")

# Cài đặt extension hỗ trợ đọc Cloud Object Storage trực tiếp
con.execute("INSTALL httpfs; LOAD httpfs;")
con.execute("""
    SET s3_region = 'ap-southeast-1';
    SET s3_endpoint = 's3.ap-southeast-1.amazonaws.com';
    SET s3_use_ssl = true;
""")

# Truy vấn trực tiếp hàng trăm file Parquet trên S3 với Predicate Pushdown và Projection Pruning
query = """
    SELECT 
        vendor_id,
        to_year(tpep_pickup_datetime) AS pickup_year,
        passenger_count,
        count(*) AS total_trips,
        round(avg(total_amount), 2) AS avg_fare,
        approx_count_distinct(payment_type) AS distinct_payment_methods
    FROM read_parquet('s3://nyc-tlc-data/trip_data/*.parquet')
    WHERE tpep_pickup_datetime >= '2024-01-01'
      AND passenger_count > 0
    GROUP BY vendor_id, pickup_year, passenger_count
    HAVING total_trips > 1000
    ORDER BY total_trips DESC;
"""

# Xuất kết quả trực tiếp sang Apache Arrow Table (Zero-Copy)
arrow_table = con.execute(query).arrow()
print(f"Hoàn tất xử lý: {arrow_table.num_rows} nhóm tổng hợp.")
```

---

### 3.3. Định dạng Bảng Hồ Dữ liệu (Data Lakehouse Table Formats): Apache Iceberg & Delta Lake

Trước khi Table Formats ra đời, kiến trúc Data Lake dựa trên **Apache Hive** gặp phải các giới hạn chết người:
- Phân vùng gắn chặt với cấu trúc thư mục ổ đĩa vật lý: `/table/date=2026-01-01/part-000.parquet`.
- Không có giao dịch nguyên tử (Atomic Transactions): Ghi nửa chừng bị lỗi làm rách dữ liệu (Corrupted Data).
- Thao tác liệt kê file (Listing files trên S3) tốn hàng giờ đồng hồ do giới hạn API Rate Limit của Cloud Object Storage.

```
KIẾN TRÚC PHÂN TẦNG METADATA CỦA APACHE ICEBERG:
+-----------------------------------------------------------------------------+
| CATALOG (Snowflake, AWS Glue, Nessie, REST, Postgres)                       |
|   Trỏ tới Metadata File hiện tại: "s3://lake/table/metadata/v3.metadata.json"|
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| ICEBERG METADATA FILE (v3.metadata.json)                                    |
|   - Định nghĩa Schema hiện tại & lịch sử thay đổi                           |
|   - Cấu trúc Phân vùng (Partition Spec)                                     |
|   - Danh sách các Snapshots (Lịch sử Commit)                                |
|   - Current Snapshot ID: 1092837465819                                      |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| MANIFEST LIST (snap-1092837465819.avro)                                     |
|   - Danh sách các Manifest Files cấu thành Snapshot                         |
|   - Partition Summaries (Min/Max values của các phân vùng để Pruning)       |
+-----------------------------------------------------------------------------+
                                       |
                     +-----------------+-----------------+
                     v                                   v
+------------------------------------+  +------------------------------------+
| MANIFEST FILE A (manifest-1.avro)  |  | MANIFEST FILE B (manifest-2.avro)  |
|   - File Status: ADDED / EXISTING  |  |   - File Status: DELETED           |
|   - File Path: s3://.../part-1.pqt |  |   - File Path: s3://.../part-2.pqt |
|   - Cột Min/Max, Null counts       |  |   - Cột Min/Max, Null counts       |
+------------------------------------+  +------------------------------------+
                     |                                   |
                     v                                   v
         [ PARQUET DATA FILES ]              [ DELETE FILES (Positional) ]
```

#### A. Trừu tượng hóa Trạng thái Bảng qua Cây Siêu dữ liệu Bất biến (Immutable Metadata Tree)
- Mỗi khi bảng Iceberg nhận một thao tác ghi, cập nhật hoặc xóa: **Hệ thống không chỉnh sửa bất kỳ file dữ liệu cũ nào**.
- Một Snapshot mới được sinh ra với một cây Metadata độc lập.
- Thao tác Commit bản chất là một thao tác **Atomic Pointer Swap (Hoán đổi Con trỏ Nguyên tử)** trong Catalog (sử dụng cơ chế `Compare-And-Swap` - CAS).

#### B. Giao dịch ACID & Snapshot Isolation trên Object Storage
- Độc giả (Readers) luôn đọc một Snapshot bất biến đã hoàn tất commit. Không bao giờ bị ảnh hưởng bởi các thao tác ghi dở dang của Writers (Đạt chuẩn **Snapshot Isolation**).
- Hỗ trợ **Time Travel**: Cho phép truy vấn ngược dữ liệu ở bất kỳ thời điểm nào trong quá khứ:
  ```sql
  SELECT * FROM lakehouse.events FOR SYSTEM_TIME AS OF '2026-01-01 00:00:00 UTC';
  ```

#### C. Phân vùng Ẩn (Hidden Partitioning) & Tiến hóa Phân vùng (Partition Evolution)
- Trong Hive truyền thống, người dùng phải biết cấu trúc thư mục phân vùng để tránh Full Table Scan:
  `WHERE date = '2026-01-01'` (nếu người dùng viết `WHERE timestamp >= ...` thì hệ thống sẽ quét toàn bộ hồ).
- Trong Iceberg: Phân vùng được định nghĩa dưới dạng một hàm biến đổi ẩn (Partition Transform):
  `partitioned_by(days(event_time))`
- Người dùng chỉ cần viết truy vấn tự nhiên: `WHERE event_time >= '2026-01-01 10:00:00'`. Iceberg tự động dịch điều kiện này sang việc loại trừ các Manifest Files chứa các ngày nằm ngoài khoảng.
- **Partition Evolution**: Doanh nghiệp có thể chuyển đổi phân vùng từ `years(ts)` sang `months(ts)` sang `days(ts)` theo quy mô tăng trưởng dữ liệu mà **không cần viết lại dữ liệu cũ hay làm gãy bất kỳ câu truy vấn sẵn có nào**.

#### D. Chiến lược Xóa & Ghi: Copy-on-Write (CoW) vs Merge-on-Read (MoR)
1. **Copy-on-Write (CoW)**:
   - Khi 1 dòng trong file Parquet $100 \text{ MB}$ bị sửa đổi hoặc xóa: Iceberg đọc file Parquet đó, viết ra một file Parquet mới $100 \text{ MB}$ đã loại trừ dòng đó, và trỏ Snapshot mới sang file mới.
   - Ưu điểm: Hiệu năng đọc tối thượng (100% dữ liệu nằm trong file thuần nhất).
   - Nhược điểm: Chi phí ghi cực lớn (Write Amplification). Phù hợp cho bảng đọc nhiều, sửa ít.
2. **Merge-on-Read (MoR)**:
   - Khi xóa dòng: File Parquet gốc được giữ nguyên. Iceberg chỉ ghi một file **Delete File** kích thước siêu nhỏ (chứa danh sách các dòng bị xóa - Positional Deletes, hoặc điều kiện xóa - Equality Deletes).
   - Ưu điểm: Ghi chép cực nhanh, chi phí I/O ghi thấp.
   - Nhược điểm: Khi đọc, engine phải thực hiện phép loại suy (Antijoin / Merge) giữa Data File và Delete File tại runtime, gây suy giảm tốc độ truy vấn đọc.
   - Giải pháp: Thực thi tiến trình bảo trì gom khối tự động (**Compaction**) định kỳ để gộp các Delete Files vào Data Files mới.

---

## 4. MÔ HÌNH HÓA DỮ LIỆU PHÂN TÍCH (DIMENSIONAL DATA MODELING)

Mặc dù năng lực tính toán của các động cơ Columnar hiện đại đã vượt bậc, việc thiết kế mô hình dữ liệu (Data Modeling) khoa học theo trường phái **Ralph Kimball** vẫn là yếu tố sống còn quyết định sự thành bại và chi phí hạ tầng của kho dữ liệu doanh nghiệp.

### 4.1. Star Schema vs Snowflake Schema vs One Big Table (OBT)

```
LƯỢC ĐỒ HÌNH SAO (STAR SCHEMA):
         [ Dim Customer ]
                |
                v
[ Dim Date ] -> [ FACT SALES ] <- [ Dim Store ]
                ^
                |
         [ Dim Product ]

LƯỢC ĐỒ BÔNG TUYẾT (SNOWFLAKE SCHEMA):
                            [ Dim Brand ]
                                  |
                                  v
[ Dim Date ] -> [ FACT SALES ] <- [ Dim Product ] -> [ Dim SubCategory ] -> [ Dim Category ]
```

#### A. Star Schema (Lược đồ Hình sao)
- **Cấu trúc**: Bảng Sự kiện (Fact Table) nằm ở trung tâm, bao quanh bởi các Bảng Chiều (Dimension Tables) đã được **phi chuẩn hóa ở mức vừa phải (Denormalized)**.
- Khóa ngoại của các Dimension kết nối trực tiếp với Khóa chính của Fact.
- **Ưu thế**: Truy vấn đơn giản, các thao tác JOIN chỉ diễn ra đúng 1 cấp (1-Hop Joins), tối ưu hóa bộ nhớ đệm cho các thuật toán Hash Join.

#### B. Snowflake Schema (Lược đồ Bông tuyết)
- **Cấu trúc**: Các Bảng Chiều được **chuẩn hóa triệt để (Normalized)** thành nhiều bảng phân cấp nhỏ hơn (ví dụ: `dim_product` tách thành `dim_subcategory`, `dim_category`, `dim_brand`).
- **Nguồn gốc**: Ra đời trong thời kỳ dung lượng đĩa đắt đỏ (thập niên 1980 - 1990) nhằm triệt tiêu dữ liệu chuỗi trùng lặp.
- **Khuyết điểm chí mạng trong Kỷ nguyên Columnar**:
  - Gây ra hiện tượng nổ phép nối (Join Explosion). Truy vấn phân tích đòi hỏi 5 - 10 phép JOIN lồng nhau.
  - Trong kiến trúc tính toán phân tán (MPP), mỗi phép JOIN yêu cầu tái phân bổ dữ liệu qua mạng (Network Data Shuffle), biến mạng nội bộ thành nút thắt cổ chai.
  - *Kết luận*: Hạn chế tối đa Snowflake Schema trong thiết kế Data Warehouse / Lakehouse hiện đại.

#### C. One Big Table (OBT - Bảng Phẳng Rộng Duy Nhất)
- **Cấu trúc**: Toàn bộ dữ liệu của Fact và tất cả Dimension được phi chuẩn hóa 100%, gộp chung vào đúng một bảng duy nhất có từ 100 đến 500 cột.
- **Ưu thế tuyệt đối**: **$0 \text{ JOIN}$**. Hiệu năng truy vấn nhanh gấp $3\times - 10\times$ so với Star Schema trên ClickHouse / BigQuery.
- **Lý do khả thi**: Nhờ cơ chế Columnar Storage, việc trùng lặp hàng tỷ lần giá trị chuỗi `"Smartphone"` trong cột `category_name` hoàn toàn không làm tốn dung lượng đĩa vì đã bị giải thuật **Dictionary Encoding & RLE triệt tiêu thành các bit 0/1**.
- **Điểm đánh đổi**: Quy trình ETL/ELT phức tạp, chi phí tính toán cập nhật dữ liệu khi thông tin Dimension thay đổi rất cao.

---

### 4.2. Bảng Sự kiện (Fact Tables) & Bảng Chiều (Dimension Tables)

#### A. Phân loại 3 Dạng Bảng Sự kiện Kinh điển (Fact Tables)

1. **Transaction Fact Table (Bảng Sự kiện Giao dịch)**:
   - Thể hiện sự kiện diễn ra tại một thời điểm cụ thể (Point in Time).
   - Độ chi tiết (Grain): Nhỏ nhất, cấp độ nguyên tử (ví dụ: từng dòng hàng trong hóa đơn, từng click trên web).
   - Đặc tính: Chỉ thêm mới (Append-Only), không bao giờ cập nhật. Kích thước lớn nhất hệ thống.

2. **Periodic Snapshot Fact Table (Bảng Sự kiện Ảnh chụp Định kỳ)**:
   - Đo lường trạng thái của một thực thể tại các khoảng thời gian cố định lặp lại (cuối ngày, cuối tuần, cuối tháng).
   - Ví dụ: Số dư tài khoản ngân hàng lúc 23:59:59 hàng ngày, số lượng tồn kho từng mặt hàng vào ngày Chủ nhật.
   - Giúp trả lời các câu hỏi: "Biến thiên số dư trung bình theo tháng là bao nhiêu?" mà không cần tính toán lại toàn bộ lịch sử giao dịch từ đầu.

3. **Accumulating Snapshot Fact Table (Bảng Sự kiện Ảnh chụp Tích lũy)**:
   - Theo dõi toàn bộ vòng đời của một quy trình nghiệp vụ có điểm bắt đầu và điểm kết thúc xác định qua nhiều chặng (Milestones).
   - Ví dụ: Vòng đời xử lý đơn hàng Thương mại điện tử:
     `Placed_Date` $\to$ `Payment_Approved_Date` $\to$ `Packed_Date` $\to$ `Shipped_Date` $\to$ `Delivered_Date`.
   - Đặc tính: Có số lượng dòng bằng số thực thể, nhưng các cột ngày tháng liên tục được **cập nhật (In-place Updates)** khi thực thể bước qua chặng mới.

```
+-----------------------------------------------------------------------------------------------+
| SO SÁNH 3 DẠNG FACT TABLES CHỦ ĐẠO                                                            |
+-----------------------------------------------------------------------------------------------+
| ĐẶC TÍNH            | TRANSACTION FACT        | PERIODIC SNAPSHOT       | ACCUMULATING SNAPSHOT |
+---------------------+-------------------------+-------------------------+-----------------------+
| Mức độ hạt (Grain)  | 1 dòng = 1 giao dịch    | 1 dòng = 1 thực thể/kỳ  | 1 dòng = 1 vòng đời   |
| Thao tác ghi        | Pure Append             | Định kỳ Append khối     | Update liên tục       |
| Khung thời gian     | Thời điểm rời rạc       | Khoảng thời gian đều    | Toàn bộ tiến trình    |
| Số lượng cột ngày   | 1 - 2 cột               | 1 cột (Snapshot Date)   | Nhiều cột mốc (5-10)  |
+-----------------------------------------------------------------------------------------------+
```

#### B. Phân loại Bảng Chiều (Dimension Tables Đặc thù)
- **Conformed Dimension (Chiều Chuẩn Hóa Nhất Quán)**: Bảng chiều được chia sẻ dùng chung giữa nhiều Fact Table khác nhau trong toàn doanh nghiệp (ví dụ: `dim_customer`, `dim_date`). Đảm bảo tính toàn vẹn và đồng nhất của các báo cáo Cross-Department.
- **Degenerate Dimension (Chiều Suy Biến)**: Các thuộc tính định danh không có bảng tham chiếu riêng, nằm trực tiếp trong bảng Fact (ví dụ: `invoice_number`, `tracking_code`).
- **Outrigger Dimension (Chiều Vệ Tinh)**: Bảng chiều tham chiếu tới một bảng chiều khác trong trường hợp hãn hữu để tránh kích thước bảng chiều chính phình quá lớn.
- **Junk Dimension (Chiều Gom Cụm)**: Gom toàn bộ các cờ trạng thái, boolean, enum linh tinh (`payment_success`, `is_gift_wrapped`, `is_first_order`) vào một bảng duy nhất để tránh việc bảng Fact có hàng chục cột cờ rời rạc.

---

### 4.3. Xử lý Chiều Thay đổi Chậm (Slowly Changing Dimensions - SCD Patterns)

Dữ liệu chiều không bất biến mà luôn biến động theo thời gian (ví dụ: Khách hàng thay đổi địa chỉ cư trú, Nhân viên chuyển phòng ban, Sản phẩm đổi mức giá cơ sở).

#### Tổng quan 6 Phương pháp Xử lý SCD:
- **SCD Type 0 (Retain Original)**: Giữ nguyên giá trị gốc lịch sử, không bao giờ cập nhật (ví dụ: Ngày sinh, Ngày tạo tài khoản).
- **SCD Type 1 (Overwrite)**: Ghi đè giá trị mới lên giá trị cũ. Không lưu vết lịch sử. Mọi báo cáo lịch sử đều bị quy đổi sang trạng thái mới nhất.
- **SCD Type 2 (Add New Row)**: **Chuẩn mực công nghiệp**. Giữ nguyên dòng cũ, thêm một dòng mới đại diện cho phiên bản mới với các cột quản trị thời gian hiệu lực (`valid_from`, `valid_to`, `is_current`).
- **SCD Type 3 (Add New Attribute)**: Thêm cột `previous_value` vào cùng dòng để chỉ theo dõi 1 bước thay đổi gần nhất.
- **SCD Type 4 (History Table)**: Bảng chính chỉ lưu giá trị hiện tại (Type 1), toàn bộ lịch sử được ghi vào một bảng audit riêng biệt.
- **SCD Type 6 (Hybrid: 1 + 2 + 3)**: Kết hợp cả tạo dòng mới (Type 2) và cập nhật thuộc tính hiện tại vào toàn bộ các dòng cũ (Type 1) để báo cáo có thể nhóm theo cả giá trị lịch sử lẫn giá trị đương thời.

#### Thiết kế Thực chiến SCD Type 2 Chuẩn Doanh nghiệp

```sql
-- DDL Bảng Chiều Khách hàng SCD Type 2
CREATE TABLE dwh.dim_customer
(
    customer_sk BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Surrogate Key (Khóa nhân tạo)
    customer_id INT NOT NULL,                                     -- Natural Key / Business Key
    full_name VARCHAR(150) NOT NULL,
    tier_level VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    
    -- Metadata Quản trị Thời gian Hiệu lực
    effective_from_date TIMESTAMP WITH TIME ZONE NOT NULL,
    effective_to_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '9999-12-31 23:59:59+00',
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    row_hash CHAR(64) NOT NULL                                    -- SHA-256 Hash phát hiện biến đổi thuộc tính
);

-- Chỉ mục tối ưu hóa tìm kiếm phiên bản hiện tại và Point-in-Time Join
CREATE INDEX idx_dim_customer_lookup ON dwh.dim_customer(customer_id, is_current);
CREATE INDEX idx_dim_customer_temporal ON dwh.dim_customer(customer_id, effective_from_date, effective_to_date);
```

#### Kịch bản Xử lý Upsert SCD Type 2 Bằng SQL Standard (Dùng trong Pipeline dbt / Airflow)
```sql
-- Bước 1: Khởi tạo bảng Stage chứa dữ liệu mới nhất từ hệ thống nguồn
-- Bước 2: Đóng phiên bản cũ (Inactivation) và Chèn phiên bản mới (Insertion)
WITH source_data AS (
    SELECT 
        customer_id,
        full_name,
        tier_level,
        city,
        country,
        updated_at,
        SHA256(CONCAT(full_name, '|', tier_level, '|', city, '|', country)) AS current_hash
    FROM staging.stg_customers
),
records_to_close AS (
    -- Xác định các bản ghi đã tồn tại nhưng có sự biến đổi thuộc tính
    SELECT 
        target.customer_sk,
        source.updated_at AS close_timestamp
    FROM dwh.dim_customer target
    INNER JOIN source_data source 
        ON target.customer_id = source.customer_id
    WHERE target.is_current = TRUE
      AND target.row_hash <> source.current_hash
)
-- 2A. Cập nhật đóng các bản ghi cũ
UPDATE dwh.dim_customer
SET 
    effective_to_date = records_to_close.close_timestamp - INTERVAL '1 millisecond',
    is_current = FALSE
FROM records_to_close
WHERE dwh.dim_customer.customer_sk = records_to_close.customer_sk;

-- 2B. Thêm mới các phiên bản tiếp theo hoặc khách hàng mới
INSERT INTO dwh.dim_customer 
(
    customer_id, full_name, tier_level, city, country, 
    effective_from_date, effective_to_date, is_current, row_hash
)
SELECT 
    source.customer_id,
    source.full_name,
    source.tier_level,
    source.city,
    source.country,
    COALESE(target.close_timestamp, source.updated_at),
    '9999-12-31 23:59:59+00',
    TRUE,
    source.current_hash
FROM source_data source
LEFT JOIN records_to_close target 
    ON source.customer_id = target.customer_id
WHERE target.customer_sk IS NOT NULL -- Khách hàng cũ đổi thông tin
   OR NOT EXISTS (                   -- Khách hàng mới hoàn toàn
       SELECT 1 FROM dwh.dim_customer exist 
       WHERE exist.customer_id = source.customer_id
   );
```

---

## 5. BẢNG SO SÁNH ĐA TRỤC & CẨM NANG VẬN HÀNH SẢN XUẤT (PRODUCTION PLAYBOOK)

### 5.1. Ma trận Đối đầu Toàn diện: PostgreSQL vs ClickHouse vs DuckDB vs Apache Iceberg

| Trục Đánh Giá | PostgreSQL 16 (Row-Store OLTP) | ClickHouse 24 (Distributed OLAP) | DuckDB 1.0 (In-Process OLAP) | Apache Iceberg (Lakehouse Table Format) |
| :--- | :--- | :--- | :--- | :--- |
| **Bản chất Kiến trúc** | Client-Server RDBMS Truyền thống | Distributed MPP Shared-Nothing Database | In-Process Embedded Database Library | Open Table Format trên Object Storage |
| **Tầng Lưu trữ Vật lý** | Trang đĩa 8KB (Slotted Page NSM) | Granule (8192 dòng) nén chia cột theo Part | Block 256KB, Row Groups chia cột nhúng | File Parquet/ORC kèm cây Metadata Avro |
| **Băng thông Quét Dữ liệu** | $200 \text{ MB} - 1.5 \text{ GB/s}$ | $10 \text{ GB} - 50 \text{ GB/s}$ mỗi node | $5 \text{ GB} - 25 \text{ GB/s}$ (Băng thông RAM) | Phụ thuộc Engine tính toán (Trino/Spark) |
| **Tốc độ Truy vấn Điểm** | $\mathbf{< 1 \text{ ms}}$ (Xuất sắc) | $15 - 50 \text{ ms}$ (Trung bình) | $5 - 20 \text{ ms}$ (Trung bình) | $> 500 \text{ ms}$ (Kém, do chi phí Catalog) |
| **Hỗ trợ ACID & Giao dịch** | Serializable, Snapshot, 2PC hoàn chỉnh | Hỗ trợ cấp Part; Không hỗ trợ giao dịch phân tán | ACID hoàn chỉnh trên 1 file đơn | Snapshot Isolation cấp độ bảng qua Catalog |
| **Kỹ thuật Thực thi** | Volcano Iterator Model | Vectorized SIMD (AVX-512) + JIT LLVM | Vectorized SIMD + Morsel Parallelism | Ủy quyền hoàn toàn cho Query Engines |
| **Cơ chế Mở rộng (Scaling)** | Chủ yếu Scale-Up; Citus/Sharding | Scale-Out Ngang tới hàng trăm Shards | Scale-Up đa luồng trên máy đơn | Mở rộng vô hạn trên S3/GCS Object Storage |
| **Chi phí Hạ tầng** | Trung bình | Tối ưu hóa năng lực phần cứng cực cao | $0 (Nhúng trực tiếp trong ứng dụng) | Siêu rẻ trên Object Storage, tách rời Compute |
| **Điểm Yếu Cốt Tử** | Nghẽn I/O khi quét dải bảng lớn | Chống chỉ định ghi đơn dòng; cấu hình phức tạp | Không thiết kế cho truy cập ghi đồng thời | Độ trễ cao, phụ thuộc tiến trình Compaction |

---

### 5.2. Các Lỗi Chí Mạng (Anti-Patterns) & Phương thức Phòng chống

#### Anti-Pattern 1: "Biến OLAP thành Hàng đợi Queue" & Ghi Từng Dòng Đơn Lẻ (Single-Row Micro-Inserts)
- **Hành vi**: Ứng dụng Backend ghi log trực tiếp bằng lệnh `INSERT INTO clickhouse VALUES (...)` mỗi khi người dùng thực hiện một hành động (hàng nghìn lệnh/giây).
- **Hậu quả**: Bùng nổ số lượng Part trên đĩa (`Part Explosion`). ClickHouse sập toàn bộ luồng Merge nền, ném lỗi `Too many parts` và từ chối mọi truy vấn ghi.
- **Giải pháp**:
  - Bắt buộc gom lô (Batching) tại tầng Gateway: Tối thiểu $10,000 - 100,000$ dòng mỗi lần `INSERT`, hoặc giãn cách thời gian commit mỗi $2 - 5$ giây.
  - Sử dụng hàng đợi đệm trung gian: Apache Kafka kết hợp ClickHouse Kafka Engine, hoặc Vector/Fluentbit Buffer.
  - Sử dụng cơ chế `Buffer Table Engine` của ClickHouse nếu bắt buộc phải nhận dữ liệu từ ứng dụng trực tiếp.

#### Anti-Pattern 2: Thiết kế Sorting Key Sai Trật tự Cardinality
- **Hành vi**: Khai báo `ORDER BY (transaction_uuid, event_date)` trên bảng sự kiện.
- **Hậu quả**: Cột `transaction_uuid` có độ phân biệt hoàn toàn ngẫu nhiên và rời rạc (High Cardinality). Dữ liệu bị xáo trộn hỗn loạn, thuật toán nén RLE và Bit-packing hoàn toàn vô hiệu hóa; Sparse Index không thể lọc được theo dải thời gian `event_date`.
- **Giải pháp**: Tuân thủ quy tắc hình phễu: Cột có Cardinality thấp nhất đặt trước, cột dải quét thời gian ở giữa, các thuộc tính chi tiết đặt ở cuối.

#### Anti-Pattern 3: Lạm dụng `SELECT *` và Bẫy Chi phí Phục hồi Tuple (Tuple Reconstruction Trap)
- **Hành vi**: Viết truy vấn `SELECT * FROM events WHERE event_date = '2026-01-01' LIMIT 10` trên bảng có 200 cột.
- **Hậu quả**: Động cơ Columnar bị ép buộc phải mở 200 file nhị phân, giải nén 200 khối dữ liệu và nhặt từng thuộc tính để ghép lại 10 hàng.
- **Giải pháp**: Luôn luôn chỉ định chính xác các cột cần lấy (`SELECT user_id, amount`). Thiết lập cảnh báo hệ thống (Linting / Query Guardrails) ngăn chặn `SELECT *` trong môi trường sản xuất.

#### Anti-Pattern 4: Lạm dụng Snowflake Schema Nhiều Cấp Gây Bùng Nổ Network Shuffle JOIN
- **Hành vi**: Tách nhỏ bảng chiều thành 5 tầng quan hệ chuẩn hóa để tiết kiệm vài megabyte lưu trữ.
- **Hậu quả**: Khi truy vấn trên cụm phân tán MPP, toàn bộ các bảng phải trải qua tiến trình **Broadcast Join** hoặc **Distributed Hash Shuffle** qua mạng LAN/VPC, làm tăng độ trễ truy vấn từ $100 \text{ ms}$ lên $30 \text{ giây}$.
- **Giải pháp**: Phi chuẩn hóa dữ liệu thành Star Schema hoặc One Big Table (OBT). Dung lượng đĩa tăng thêm là không đáng kể nhờ hiệu quả nén cột.

---

### 5.3. Checklist Tối ưu Hóa Dành cho Kỹ sư Kiến trúc Trưởng (Architect's Production Checklist)

```markdown
[ ] 1. KIỂM TOÁN TẦNG LƯU TRỮ VẬT LÝ (STORAGE AUDIT)
    [ ] Các cột dạng chuỗi có độ lặp lại cao đã được chuyển sang LowCardinality / Dictionary chưa?
    [ ] Đã cấu hình Compression Codec đặc thù (DoubleDelta/Gorilla cho Timestamps, T64 cho Integers, ZSTD cho Text)?
    [ ] Tỷ lệ nén thực tế trên đĩa đã đạt ngưỡng mục tiêu (tối thiểu 4x - 8x)?

[ ] 2. KIỂM TOÁN KHÓA CHỈ MỤC & PHÂN VÙNG (INDEXING & PARTITIONING)
    [ ] Trật tự Sorting Key tuân thủ nguyên tắc phễu: Cardinality Thấp -> Cardinality Cao?
    [ ] Kích thước phân vùng (Partition Size) có nằm trong khoảng lý tưởng (10 triệu - 100 triệu dòng / Part)?
    [ ] Tránh phân vùng quá nhỏ (Over-partitioning theo từng giờ) gây cạn kiệt Inode và File Descriptors?

[ ] 3. TỐI ƯU HÓA ĐƯỜNG ỐNG NẠP DỮ LIỆU (INGESTION PIPELINE)
    [ ] 100% dữ liệu nạp vào được xử lý qua cơ chế Bulk Batching (>= 10,000 rows/batch)?
    [ ] Có cơ chế giám sát số lượng Active Parts trên từng Shard (cảnh báo khi > 150 parts)?
    [ ] Các thao tác xóa dữ liệu định kỳ được chuyển dịch sang TTL (Time-To-Live) tự động thay vì DELETE thủ công?

[ ] 4. BẢO TRÌ ĐỊNH KỲ DATA LAKEHOUSE (ICEBERG / DELTA LAKE)
    [ ] Đã kích hoạt Job định kỳ thực hiện Compaction (gộp các file Parquet nhỏ thành file 512MB)?
    [ ] Đã lên lịch dọn dẹp Snapshot mồ côi (Expire Snapshots) để thu hồi dung lượng Object Storage?
    [ ] Đã dọn dẹp các Positional/Equality Delete Files bằng cơ chế Rewrite Data Files?
```

---

## TỔNG KẾT BÀI HỌC (ARCHITECTURAL TAKEAWAYS)

1. **Bản chất của hiệu năng OLAP** không nằm ở "phép thuật" phần mềm, mà nằm ở việc **sắp xếp dữ liệu tương thích hoàn hảo với cơ học phần cứng hiện đại**: tận dụng tối đa băng thông tuần tự, xóa bỏ Cache Misses của L1/L2 Cache thông qua bố cục cột và giải phóng sức mạnh tính toán song song đa lõi bằng các tập lệnh vector SIMD (AVX-512).
2. **Chi phí nén dữ liệu bằng 0**: Trong hệ thống phân tích hiện đại, tốc độ giải nén của các giải thuật chuyên biệt (RLE, Gorilla, LZ4) nhanh hơn tốc độ đọc của bus phần cứng. Do đó, nén dữ liệu vừa giúp giảm chi phí lưu trữ, vừa trực tiếp làm tăng thông lượng truy vấn của toàn bộ hệ thống.
3. **Phân định rõ ranh giới công cụ**:
   - Sử dụng **PostgreSQL / OLTP** cho các giao dịch ACID ngắn, đòi hỏi độ trễ microsecond.
   - Sử dụng **ClickHouse** cho các bài toán phân tích quy mô lớn, dữ liệu chuỗi thời gian, log, telemetry với yêu cầu phản hồi tức thì dưới $100 \text{ ms}$ cho hàng tỷ dòng.
   - Sử dụng **DuckDB** cho các ứng dụng nhúng, xử lý dữ liệu khoa học, phân tích cục bộ và làm cầu nối Zero-copy hiệu năng cao với hệ sinh thái Python / Arrow.
   - Sử dụng **Apache Iceberg / Delta Lake** để xây dựng nền móng Data Lakehouse dài hạn, bảo đảm tính nhất quán ACID trên hạ tầng lưu trữ đám mây giá rẻ.
