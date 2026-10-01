# 🏛️ DATABASE MASTERCLASS — PHÂN HỆ 03: GIAO DỊCH, KIỂM SOÁT ĐỒNG THỜI & TÍNH TOÀN VẸN HỆ THỐNG
## (MODULE 03: TRANSACTIONS, CONCURRENCY CONTROL & SYSTEM INTEGRITY)

> **Pod Chuyên Trách**: Pod 3 — Concurrency & Transaction Integrity Engineer  
> **Cấp Độ Tài Liệu**: Deep Engineering Architecture (Kiến Trúc Kỹ Thuật Chuyên Sâu)  
> **Ngôn Ngữ & Chuẩn Mực**: Bilingual Protocol `English (Tiếng Việt)` — Masterclass Reference Standard  

---

## 📑 MỤC LỤC CHI TIẾT (TABLE OF CONTENTS)

1. [Bản Chất ACID & Cơ Chế Phục Hồi Thất Bại (ACID Internals & Crash Recovery)](#1-bản-chất-acid--cơ-chế-phục-hồi-thất-bại-acid-internals--crash-recovery)
   - 1.1 [Bóc Tách 4 Trụ Cột ACID Dưới Góc Nhìn Hệ Thống](#11-bóc-tách-4-trụ-cột-acid-dưới-góc-nhìn-hệ-thống)
   - 1.2 [Write-Ahead Logging (WAL) & Hệ Tiên Đề Write-Before-Flush](#12-write-ahead-logging-wal--hệ-tiên-đề-write-before-flush)
   - 1.3 [Thuật Toán Phục Hồi ARIES (Algorithms for Recovery and Isolation Exploiting Semantics)](#13-thuật-toán-phục-hồi-aries)
   - 1.4 [Cơ Chế Điểm Kiểm Tra (Checkpointing Internals: Non-Fuzzy vs Fuzzy Checkpoints)](#14-cơ-chế-điểm-kiểm-tra-checkpointing-internals)
2. [Kiểm Soát Đồng Thời Đa Phiên Bản (MVCC Internals: PostgreSQL vs MySQL InnoDB)](#2-kiểm-soát-đồng-thời-đa-phiên-bản-mvcc-internals-postgresql-vs-mysql-innodb)
   - 2.1 [Triết Lý Cốt Lõi: Không Khóa Đọc - Không Chặn Ghi](#21-triết-lý-cốt-lõi-không-khóa-đọc---không-chặn-ghi)
   - 2.2 [Kiến Trúc MVCC PostgreSQL: In-Place Heap Tuples & Snapshot Catalog](#22-kiến-trúc-mvcc-postgresql-in-place-heap-tuples--snapshot-catalog)
   - 2.3 [Kiến Trúc MVCC MySQL InnoDB: Clustered Index & Undo Log Chains](#23-kiến-trúc-mvcc-mysql-innodb-clustered-index--undo-log-chains)
   - 2.4 [Bảng So Sánh Đối Đầu Toàn Diện: PostgreSQL vs InnoDB](#24-bảng-so-sánh-đối-đầu-toàn-diện-postgresql-vs-innodb)
3. [Cấp Độ Cô Lập & Dị Thường Dữ Liệu (Isolation Levels & Data Anomalies)](#3-cấp-độ-cô-lập--dị-thường-dữ-liệu-isolation-levels--data-anomalies)
   - 3.1 [Chuẩn ANSI SQL-92 & Bản Phê Phán Lịch Sử Berenson 1995](#31-chuẩn-ansi-sql-92--bản-phê-phán-lịch-sử-berenson-1995)
   - 3.2 [Bảng Ma Trận Phân Loại 7 Dị Thường Dữ Liệu (Data Anomalies Taxonomy)](#32-bảng-ma-trận-phân-loại-7-dị-thường-dữ-liệu-data-anomalies-taxonomy)
   - 3.3 [Ma Trận Đối Chiếu Cấp Độ Cô Lập vs Dị Thường Thực Tế](#33-ma-trận-đối-chiếu-cấp-độ-cô-lập-vs-dị-thường-thực-tế)
   - 3.4 [Giải Phẫu Dị Thường Write Skew & Cơ Chế Serializable Snapshot Isolation (SSI)](#34-giải-phẫu-dị-thường-write-skew--cơ-chế-serializable-snapshot-isolation-ssi)
4. [Cơ Chế Khóa & Phòng Chống Khóa Chết (Locking Protocols & Deadlock Handling)](#4-cơ-chế-khóa--phòng-chống-khóa-chết-locking-protocols--deadlock-handling)
   - 4.1 [Giao Thức Khóa Hai Pha (2PL: Two-Phase Locking Family)](#41-giao-thức-khóa-hai-pha-2pl-two-phase-locking-family)
   - 4.2 [Khóa Đa Mức Hạt & Khóa Dự Định (Multiple Granularity Locking & Intent Locks)](#42-khóa-đa-mức-hạt--khóa-dự-định-multiple-granularity-locking--intent-locks)
   - 4.3 [Cấu Trúc Khóa Chuyên Biệt Trong InnoDB: Record, Gap, Next-Key Locks](#43-cấu-trúc-khóa-chuyên-biệt-trong-innodb-record-gap-next-key-locks)
   - 4.4 [Kiểm Soát Lạc Quan (OCC) vs Khóa Bi quan (Pessimistic Locking: FOR UPDATE, SKIP LOCKED)](#44-kiểm-soát-lạc-quan-occ-vs-khóa-bi-quan-pessimistic-locking)
   - 4.5 [Khóa Chết: Phát Hiện (Wait-For Graph) & Phòng Ngừa (Wait-Die, Wound-Wait)](#45-khóa-chết-phát-hiện-wait-for-graph--phòng-ngừa-wait-die-wound-wait)
5. [Mẫu Thiết Kế Mã Nguồn Chuẩn Production (Production-Grade Implementation Patterns)](#5-mẫu-thiết-kế-mã-nguồn-chuẩn-production-production-grade-implementation-patterns)
   - 5.1 [Vòng Lặp Thử Lại Giao Dịch An Toàn (Safe Transaction Retry Loop with Jitter)](#51-vòng-lặp-thử-lại-giao-dịch-an-toàn-safe-transaction-retry-loop-with-jitter)
   - 5.2 [Hàng Đợi Xử Lý Song Song Thông Lượng Cao với `SELECT FOR UPDATE SKIP LOCKED`](#52-hàng-đợi-xử-lý-song-song-thông-lượng-cao-với-select-for-update-skip-locked)
   - 5.3 [Giao Dịch Số Dư / Tồn Kho An Toàn Bằng OCC & Version Guard](#53-giao-dịch-số-dư--tồn-kho-an-toàn-bằng-occ--version-guard)
   - 5.4 [Bảng Kiểm Tra Chuẩn Vận Hành Kiến Trúc Sư (Architectural Production Checklist)](#54-bảng-kiểm-tra-chuẩn-vận-hành-kiến-trúc-sư-architectural-production-checklist)

---

## 1. BẢN CHẤT ACID & CƠ CHẾ PHỤC HỒI THẤT BẠI (ACID INTERNALS & CRASH RECOVERY)

### 1.1 Bóc Tách 4 Trụ Cột ACID Dưới Góc Nhìn Hệ Thống

Khái niệm `ACID` thường bị hiểu nhầm thành các thuộc tính độc lập đơn giản. Thực chất, trong kỹ thuật cơ sở dữ liệu (`Database Internals`), 4 yếu tố này được bảo đảm bởi các hệ thống con hoàn toàn khác biệt:

```
+--------------------------------------------------------------------------------+
|                             ACID ARCHITECTURE MAP                             |
+--------------------------------------------------------------------------------+
|  A - Atomicity (Tính nguyên tử)      --> Undo Log / Rollback Segments / WAL     |
|  C - Consistency (Tính nhất quán)    --> Application Logic + Constraints + C&I |
|  I - Isolation (Tính cô lập)         --> Concurrency Control (MVCC / Locks)    |
|  D - Durability (Tính bền vững)      --> Redo Log / WAL / fsync / Flush Engine |
+--------------------------------------------------------------------------------+
```

1. **`Atomicity (Tính nguyên tử)`**:
   - **Định nghĩa**: Một `Transaction (Giao dịch)` bao gồm tập hợp nhiều thao tác ghi/đọc. Toàn bộ các thao tác hoặc phải thành công trọn vẹn (`All`), hoặc không có bất kỳ hiệu ứng phụ nào tồn lưu nếu xảy ra lỗi (`Nothing`).
   - **Bản chất thực thi**: Hệ cơ sở dữ liệu không thể ngăn chặn sự cố phần cứng, lỗi nguồn hoặc `OOM (Out-of-Memory)` xảy ra giữa chừng. Do đó, `Atomicity (Tính nguyên tử)` được hiện thực hóa thông qua **khả năng hoàn tác (`Reversibility`)**. Hệ thống ghi lại trạng thái dữ liệu cũ (`Before-Image`) vào `Undo Log (Nhật ký hoàn tác)` trước khi áp dụng thay đổi. Khi abort xảy ra, tiến trình `Rollback (Hoàn tác)` sẽ đảo ngược mọi hiệu ứng chưa hoàn tất.

2. **`Consistency (Tính nhất quán)`**:
   - **Định nghĩa**: Trạng thái của cơ sở dữ liệu luôn chuyển từ một trạng thái hợp lệ (`Valid State`) này sang một trạng thái hợp lệ khác, tuân thủ mọi bất biến (`Invariants`), ràng buộc toàn vẹn (`Integrity Constraints`: `FOREIGN KEY`, `CHECK`, `UNIQUE`) và quy tắc nghiệp vụ (`Business Invariants`).
   - **Bản chất thực thi**: Đây là chữ cái mang tính "lai tạp" nhất. Một nửa phụ thuộc vào engine DBMS (ép buộc schema, khóa ngoại, kiểm tra unique index), nửa còn lại phụ thuộc hoàn toàn vào **tính đúng đắn của logic tầng ứng dụng** (ví dụ: tổng tiền trong hệ thống kép Debit = Credit).

3. **`Isolation (Tính cô lập)`**:
   - **Định nghĩa**: Các giao dịch chạy đồng thời (`Concurrent Transactions`) không được phép can thiệp hoặc nhìn thấy các trạng thái chuyển tiếp dở dang (`Intermediate States`) của nhau.
   - **Bản chất thực thi**: Được kiểm soát bởi bộ máy `Concurrency Control Manager (Bộ quản lý kiểm soát đồng thời)`, thông qua hai trường phái chính: `Pessimistic Concurrency Control (Kiểm soát đồng thời bi quan)` dựa trên cơ chế khóa (`Locking`) hoặc `Optimistic / Multi-Version Concurrency Control (Kiểm soát đa phiên bản - MVCC)`.

4. **`Durability (Tính bền vững)`**:
   - **Định nghĩa**: Một khi giao dịch nhận được tín hiệu `COMMIT` thành công, mọi thay đổi dữ liệu của giao dịch đó được đảm bảo tồn tại vĩnh viễn trên bộ nhớ lưu trữ thứ cấp (`Non-volatile Storage`), ngay cả khi hệ điều hành sập nguồn hoặc phần cứng gặp sự cố ngay lập tức sau đó.
   - **Bản chất thực thi**: Được đảm bảo bởi `Write-Ahead Logging (WAL)` kết hợp lệnh hệ thống `fsync()` đẩy dữ liệu từ cache của hệ điều hành xuống phiến đĩa vật lý trước khi trả về phản hồi client.

---

### 1.2 Write-Ahead Logging (WAL) & Hệ Tiên Đề Write-Before-Flush

Trong các hệ cơ sở dữ liệu quan hệ, dữ liệu được tổ chức thành các `Data Pages (Trang dữ liệu)` (mặc định 8KB trong PostgreSQL, 16KB trong MySQL InnoDB) lưu trên đĩa và được nạp vào bộ nhớ RAM tại `Buffer Pool (Vùng đệm bộ nhớ)`.

Khi một giao dịch thực hiện lệnh `UPDATE` hay `INSERT`, việc ghi trực tiếp toàn bộ trang dữ liệu bị sửa đổi (`Dirty Page - Trang bẩn`) xuống đĩa ngay lập tức là một thảm họa hiệu năng (`Random I/O`). Thay vào đó:
- Trang dữ liệu được sửa đổi trực tiếp trên RAM (`In-Memory Buffer Modification`).
- Một bản ghi mô tả ngắn gọn thay đổi đó (`Log Record / Redo Entry`) được sinh ra và nối tiếp vào đuôi của `Log Buffer (Bộ đệm nhật ký)`.

> ⚠️ **Hệ Tiên Đề Bất Biến WAL (`The WAL Invariant`)**:  
> **1. WAL Record Flush Rule**: Trước khi một trang dữ liệu bị sửa đổi (`Dirty Page`) trong RAM được phép đẩy (`Flush`) xuống đĩa, toàn bộ các bản ghi nhật ký mô tả thay đổi trên trang đó (`Log Records`) BẮT BUỘC phải được ghi xuống đĩa trước (`flushed to non-volatile storage`).  
> **2. Commit Flush Rule**: Một giao dịch chưa được coi là `Committed` cho đến khi tất cả bản ghi log ghi nhận trạng thái Commit của nó đã nằm an toàn trên thiết bị lưu trữ thứ cấp (`fsync completed`).

```
                    LUỒNG GHI WAL CHUẨN MỰC
                    
[Client Transaction] 
         │ (1) UPDATE accounts SET balance = balance - 100 WHERE id = 1
         ▼
[Buffer Pool (RAM)]  ────────────────────────► [Dirty Page in RAM] (PageLSN = 10450)
         │                                               │
         │ (2) Generate Log Record                       │
         ▼                                               │ (4) FLUSH CHECK:
[WAL Buffer (RAM)]                                       │ FlushedLSN (10450) >= PageLSN (10450)
         │                                               │
         │ (3) fsync()                                   ▼
         ▼                                     [Data File on Disk (.ibd / heap)]
[WAL File on Disk (ib_logfile / pg_wal)]                 │
  Log Record LSN: 10450 (COMMIT)                         └── Page written safely!
  FlushedLSN updated to 10450
```

Các con số định danh thứ tự quan trọng:
- `LSN (Log Sequence Number - Số thứ tự nhật ký)`: Một số nguyên 64-bit đơn điệu tăng dần, đại diện cho tọa độ byte tuyệt đối trong chuỗi nhật ký WAL.
- `PageLSN (Số LSN của trang)`: Trường metadata nằm trong header của mỗi Data Page, ghi nhận LSN của bản ghi log cuối cùng làm thay đổi nội dung trang này.
- `FlushedLSN (Số LSN đã xả xuống đĩa)`: Con số LSN lớn nhất đã được `fsync()` thành công xuống đĩa vật lý.
- **Điều kiện đẩy trang (`Page Eviction Invariant`)**:  
  $$\text{FlushedLSN} \ge \text{PageLSN}$$  
  Nếu $\text{FlushedLSN} < \text{PageLSN}$, bộ đệm đĩa (`Buffer Manager`) tuyệt đối không được phép ghi trang bẩn này xuống tệp dữ liệu!

---

### 1.3 Thuật Toán Phục Hồi ARIES (Algorithms for Recovery and Isolation Exploiting Semantics)

`ARIES` do C. Mohan (IBM Research) phát minh năm 1992, là chuẩn mực kinh điển về cơ chế phục hồi cơ sở dữ liệu khi hệ thống gặp sự cố (`Crash Recovery`). ARIES áp dụng nguyên lý:
- **`STEAL Policy`**: Cho phép `Buffer Pool` ghi trang bẩn xuống đĩa ngay cả khi giao dịch làm bẩn trang đó chưa commit (để giải phóng RAM). $\to$ Đòi hỏi cơ chế **`UNDO`** khi crash.
- **`NO-FORCE Policy`**: Khi commit, không bắt buộc phải đẩy các trang dữ liệu bẩn xuống đĩa ngay, chỉ cần đẩy bản ghi log của transaction đó. $\to$ Đòi hỏi cơ chế **`REDO`** khi crash.

```
                    SƠ ĐỒ 3 PHA PHỤC HỒI ARIES
                    
  ==================== TRỤC THỜI GIAN NHẬT KÝ WAL ====================
  ... | Checkpoint | ... Log records ... | Crash Point | (Hệ thống sập)
             ▲                                 ▲
             │                                 │
             └──────── 1. PHA PHÂN TÍCH ───────┘ (Quét xuôi từ Checkpoint)
                       Xác định: DPT (Dirty Page Table) & Transaction Table
                       Tìm điểm: Min(RecLSN)
                                 │
             ┌───────────────────┘
             ▼
     2. PHA LÀM LẠI (REDO - Repeating History)
     Quét xuôi từ Min(RecLSN) đến tận Crash Point.
     Tái hiện lại toàn bộ lịch sử (kể cả transaction của Losers).
                                               │
             ┌─────────────────────────────────┘
             ▼
     3. PHA HOÀN TÁC (UNDO - Rollback Losers)
     Quét ngược từ Crash Point về quá khứ.
     Rollback toàn bộ Loser Transactions, ghi nhật ký bù trừ CLR.
```

#### Chi Tiết 3 Pha Của ARIES:

#### Pha 1: `Analysis Phase (Pha phân tích)`
- **Mục tiêu**: Tái tạo lại trạng thái hệ thống tại thời điểm gặp sự cố crash.
- **Quy trình**:
  1. Đọc bản ghi `Checkpoint` gần nhất trên đĩa.
  2. Nạp `Transaction Table (Bảng giao dịch)` và `Dirty Page Table - DPT (Bảng trang bẩn)` được lưu tại Checkpoint.
  3. Quét xuôi nhật ký WAL từ vị trí Checkpoint đến tận điểm cuối cùng (`End of Log`):
     - Gặp bản ghi mới của một giao dịch: Thêm giao dịch vào `Transaction Table` với trạng thái `Active`.
     - Gặp bản ghi `COMMIT` / `ABORT`: Cập nhật trạng thái giao dịch hoặc xóa khỏi bảng.
     - Gặp bản ghi chỉnh sửa trang $P$: Nếu $P$ chưa có trong `DPT`, thêm $P$ vào với `RecLSN` = LSN của bản ghi hiện tại (`RecLSN` là LSN đầu tiên làm bẩn trang này kể từ lần flush cuối).
- **Kết quả đầu ra**:
  - Danh sách các giao dịch chưa hoàn tất (`Loser Transactions` - cần phải rollback ở Pha 3).
  - Điểm xuất phát của Pha Redo: $\text{RedoLSN} = \min(\text{RecLSN của tất cả các trang trong DPT})$.

#### Pha 2: `Redo Phase (Pha làm lại - Repeating History)`
- **Mục tiêu**: Đưa toàn bộ cơ sở dữ liệu về đúng trạng thái vật lý chính xác tại thời điểm gặp nạn, bao gồm cả việc áp dụng thay đổi của các giao dịch sẽ bị rollback!
- **Nguyên lý cốt lõi**: `Repeating History (Lặp lại lịch sử)`.
- **Quy trình**:
  1. Bắt đầu từ vị trí $\text{RedoLSN}$ quét xuôi đến tận cuối file log.
  2. Với mỗi bản ghi log có thể làm thay đổi trang $P$:
     - Kiểm tra nếu trang $P$ không có trong `DPT` $\to$ Bỏ qua (trang đã được flush sạch sẽ trước checkpoint).
     - Nếu $P$ có trong `DPT` nhưng $\text{RecLSN} > \text{LSN hiện tại}$ $\to$ Bỏ qua (thay đổi này đã được ghi xuống đĩa).
     - Đọc trang $P$ từ đĩa lên RAM. Nếu $\text{Page.PageLSN} \ge \text{LSN hiện tại}$ $\to$ Bỏ qua (trang đã chứa thay đổi này).
     - Nếu $\text{Page.PageLSN} < \text{LSN hiện tại}$ $\to$ **Áp dụng lại thay đổi (`Redo the action`)**, cập nhật $\text{Page.PageLSN} = \text{LSN hiện tại}$.

#### Pha 3: `Undo Phase (Pha hoàn tác)`
- **Mục tiêu**: Đảo ngược (`Rollback`) tất cả các hiệu ứng của các `Loser Transactions` (các giao dịch còn `Active` mà chưa `COMMIT` tại thời điểm crash).
- **Quy trình quét ngược (`Backward Scan`)**:
  - Dùng con trỏ `PrevLSN` trong mỗi WAL record để lần ngược lại các thao tác của Losers.
  - Với mỗi thao tác bị đảo ngược, một bản ghi nhật ký đặc biệt được sinh ra: **`CLR (Compensation Log Record - Bản ghi nhật ký bù trừ)`**.
  - **Cơ chế chống lặp vô hạn (`Crash During Recovery Invariant`)**:
    - `CLR` chứa một con trỏ quan trọng: `UndoNextLSN`. Con trỏ này trỏ thẳng tới LSN tiếp theo cần phải undo của transaction đó, bỏ qua thao tác vừa được đảo ngược.
    - Nếu hệ thống bị sập nguồn lần 2 ngay giữa quá trình Undo: Khi khởi động lại, Pha Redo sẽ redo cả các bản ghi `CLR`, và Pha Undo tiếp theo sẽ đọc `UndoNextLSN` của CLR để tiếp tục công việc dở dang, **tuyệt đối không bao giờ undo lại một thao tác đã được undo**!

---

### 1.4 Cơ Chế Điểm Kiểm Tra (Checkpointing Internals: Non-Fuzzy vs Fuzzy Checkpoints)

Nếu không có cơ chế `Checkpoint (Điểm kiểm tra)`, nhật ký WAL sẽ phình to vô hạn (`Infinite Growth`), và thời gian phục hồi sau sự cố (`Recovery Time Objective - RTO`) có thể mất hàng giờ vì phải phân tích từ đầu lịch sử.

```
                    SO SÁNH CƠ CHẾ CHECKPOINT
                    
[1. Non-Fuzzy Checkpoint (Blocking / Stop-The-World)]
  (1) Pause all transactions  --> (2) Flush all Dirty Pages to Disk --> (3) Write Checkpoint Record --> (4) Resume
  Hệ quả: Gây ra độ trễ đột biến (Latency Spike), tắc nghẽn toàn bộ hệ thống OLTP.

[2. Fuzzy Checkpoint (Non-blocking / Background Engine)]
  (1) Lấy Snapshot danh sách Active Trx & DPT tại thời điểm T1 (Checkpoint Begin)
  (2) KHÔNG ép buộc flush sạch toàn bộ dirty pages ngay lập tức
  (3) Ghi Checkpoint Record (Checkpoint End) chứa DPT và Min(RecLSN)
  (4) Background Flush Thread (Page Cleaner / Checkpointer) xả dirty page từ từ ra đĩa
```

#### Chi Tiết Triển Khai Trong Các Engine:
1. **PostgreSQL Checkpoint**:
   - Tiến trình `checkpointer` định kỳ (cấu hình bởi `checkpoint_timeout`, `max_wal_size`) thu thập danh sách các dirty buffers.
   - Sắp xếp các dirty buffers theo vị trí tệp vật lý để tối ưu `Sequential I/O`.
   - Xả dần dần (`spread checkpoint` qua `checkpoint_completion_target = 0.9`) để tránh gây nghẽn I/O hệ thống.
   - Ghi bản ghi `CHECKPOINT_ONLINE` vào WAL và cập nhật con trỏ trong tệp nhị phân `global/pg_control`.
2. **MySQL InnoDB Fuzzy Checkpoint**:
   - Sử dụng `Doublewrite Buffer (Vùng đệm ghi kép)` để chống lỗi rách trang (`Torn Page / Partial Page Write`).
   - `Master Thread` và `Page Cleaner Threads` thực hiện các loại checkpoint mờ:
     - `Master Thread Checkpoint`: Xả một tỉ lệ trang bẩn từ `Buffer Pool` mỗi giây / 10 giây.
     - `Async/Sync Flush Checkpoint`: Kích hoạt khi không gian file log (`ib_logfile`) chạm ngưỡng `async_watermark` hoặc `sync_watermark` để đảm bảo luôn có khoảng trống cho transaction mới.

---

## 2. KIỂM SOÁT ĐỒNG THỜI ĐA PHIÊN BẢN (MVCC INTERNALS: POSTGRESQL VS MYSQL INNODB)

### 2.1 Triết Lý Cốt Lõi: Không Khóa Đọc - Không Chặn Ghi

Nguyên tắc vàng của `MVCC (Multi-Version Concurrency Control)`:
> **"Readers do not block Writers, and Writers do not block Readers."**  
> *(Người đọc không chặn người ghi, và người ghi không chặn người đọc).*

Khi một hàng (`Row / Tuple`) bị sửa đổi (`UPDATE`), cơ sở dữ liệu không ghi đè trực tiếp lên dữ liệu cũ. Thay vào đó, nó kiến tạo một **phiên bản mới (`New Version`)** của hàng đó. Các câu lệnh đọc (`SELECT`) sẽ dựa vào một `Snapshot (Ảnh chụp trạng thái)` của giao dịch để chỉ nhìn thấy phiên bản dữ liệu hợp lệ đối với nó, bất chấp việc các giao dịch khác đang sửa đổi hoặc chèn mới dữ liệu.

Tuy nhiên, cách tổ chức lưu trữ các phiên bản cũ (`Old Versions / Historical Tuples`) giữa PostgreSQL và MySQL InnoDB là hai trường phái đối lập hoàn toàn về mặt kiến trúc.

---

### 2.2 Kiến Trúc MVCC PostgreSQL: In-Place Heap Tuples & Snapshot Catalog

Trong PostgreSQL, cả phiên bản hàng mới và các phiên bản hàng cũ đều được lưu **trực tiếp trong các trang dữ liệu chính (`Heap Pages`)**.

#### Cấu Trúc Header Của Một Tuple (`HeapTupleHeaderData` - 23 bytes):
Mỗi hàng lưu trong data page có phần header chứa các trường kiểm soát tính khả kiến (`Visibility Fields`):
- `t_xmin`: Transaction ID (32-bit integer) của giao dịch đã thực thi lệnh `INSERT` tạo ra tuple này.
- `t_xmax`: Transaction ID của giao dịch đã `DELETE` hoặc `UPDATE` tuple này. Nếu tuple còn sống và chưa bị xóa/sửa, `t_xmax` bằng 0.
- `t_cid`: Command Identifier (số thứ tự câu lệnh SQL trong cùng một transaction, đảm bảo một câu lệnh nhìn thấy kết quả của câu lệnh trước nó trong cùng transaction).
- `t_ctid`: Item Pointer (`BlockNumber`, `OffsetNumber`) trỏ tới vị trí vật lý của chính tuple này, hoặc nếu tuple này đã bị `UPDATE`, nó trỏ tới **phiên bản kế tiếp (`Next Version`)** trong chuỗi phiên bản.
- `t_infomask`: Tập hợp các bit cờ tối ưu hóa (ví dụ: `HEAP_XMIN_COMMITTED`, `HEAP_XMIN_INVALID`, `HEAP_XMAX_COMMITTED`, `HEAP_HOT_UPDATED`).

```
          POSTGRESQL IN-PLACE HEAP VERSION CHAIN
          
  Heap Page (8KB)
  +-------------------------------------------------------------------------+
  | Offset 1: Tuple Version 1                                               |
  | [xmin: 500, xmax: 502, ctid: (Block 0, Offset 2)] | Data: {"val": 100}  |
  +-------------------------------------------------------------------------+
         │ (Updated by Trx 502)
         ▼
  +-------------------------------------------------------------------------+
  | Offset 2: Tuple Version 2                                               |
  | [xmin: 502, xmax: 505, ctid: (Block 0, Offset 3)] | Data: {"val": 120}  |
  +-------------------------------------------------------------------------+
         │ (Updated by Trx 505)
         ▼
  +-------------------------------------------------------------------------+
  | Offset 3: Tuple Version 3 (Current Active)                              |
  | [xmin: 505, xmax: 0,   ctid: (Block 0, Offset 3)] | Data: {"val": 150}  |
  +-------------------------------------------------------------------------+
```

#### Snapshot Trong PostgreSQL:
Một `Snapshot` được biểu diễn dưới dạng: `xmin:xmax:xip_list`
- `xmin`: Transaction ID nhỏ nhất vẫn đang active tại thời điểm chụp snapshot. Mọi transaction có $\text{XID} < xmin$ đều đã kết thúc (đã commit hoặc abort).
- `xmax`: Transaction ID đầu tiên chưa được cấp phát tại thời điểm snapshot. Mọi transaction có $\text{XID} \ge xmax$ đều sinh ra sau snapshot và **vô hình (`Invisible`)**.
- `xip_list`: Danh sách các transaction đang active (chưa commit) nằm giữa $[xmin, xmax)$.

#### Thuật Toán Kiểm Tra Tính Khả Kiến Của Tuple (`Tuple Visibility Rules`):
1. Nếu `t_infomask` có bit `HEAP_XMIN_COMMITTED` chưa bật: PostgreSQL phải tra cứu bảng `pg_xact` (trước đây là `pg_clog`) trong RAM để kiểm tra trạng thái của `xmin`. Nếu `xmin` đã commit, bật bit gợi ý (`Hint Bit`) để các lần đọc sau không cần tra cứu lại.
2. Một tuple được coi là nhìn thấy được đối với Transaction $T$ khi:
   - `xmin` đã commit và không nằm trong `xip_list` của snapshot.
   - VÀ (`xmax` bằng 0 HOẶC `xmax` bị abort HOẶC `xmax` chưa commit HOẶC `xmax` nằm trong `xip_list` của snapshot).

#### Cơ Chế Tối Ưu Hóa HOT (Heap-Only Tuples):
- **Vấn đề**: Khi một tuple bị `UPDATE`, PostgreSQL tạo ra một tuple mới ở vị trí khác trong Heap. Nếu bảng có 10 Index, việc trỏ lại con trỏ index sẽ đòi hỏi cập nhật cả 10 index, gây ra `Write Amplification (Khuếch đại ghi)` cực lớn.
- **Giải pháp HOT**: Nếu câu lệnh `UPDATE` **không làm thay đổi bất kỳ cột nào có đánh index**, và trang dữ liệu hiện tại còn đủ chỗ trống:
  - Tuple mới được đặt ngay trong cùng một Data Page với tuple cũ.
  - Các index vẫn giữ nguyên con trỏ trỏ tới Tuple cũ (`Root Tuple`).
  - Khi index scan tìm đến Tuple cũ, nó đọc con trỏ `t_ctid` và đi theo chuỗi `HOT Chain` để tìm đến Tuple mới nhất mà không cần chạm vào cấu trúc Index!

#### Vấn Nạn Table Bloat & Hiểm Họa Transaction ID Wraparound:
1. **`Table Bloat (Phình to bảng)`**:
   - Khi các transaction cũ kết thúc, các tuple có `xmax` đã commit trở thành `Dead Tuples (Bộ dữ liệu chết)`.
   - `VACUUM` (hoặc `Autovacuum daemon`) phải quét các trang dữ liệu để dọn dẹp các dead tuples, gom không gian trống (`Free Space Map - FSM`) để tái sử dụng.
   - Nếu có một long-running transaction giữ snapshot quá lâu, `VACUUM` không thể dọn dẹp bất kỳ tuple nào bị xóa sau thời điểm transaction đó bắt đầu!
2. **`Transaction ID Wraparound Crisis (Khủng hoảng tràn số XID)`**:
   - PostgreSQL sử dụng số nguyên 32-bit cho Transaction ID ($2^{32} \approx 4.29$ tỷ XID).
   - Vì phép so sánh trạng thái XID sử dụng số học modulo 2 tỷ ($2^{31}$ quá khứ, $2^{31}$ tương lai): Nếu hệ thống chạy quá 2 tỷ transactions mà không xử lý, các transaction cổ xưa nhất sẽ bị hệ thống hiểu nhầm thành "thuộc về tương lai", dẫn đến việc **toàn bộ dữ liệu lịch sử biến mất hoàn toàn**!
   - **Cơ chế phòng thủ**: `Vacuum Freeze`. PostgreSQL thay thế các `xmin` cũ hơn một ngưỡng nhất định bằng một giá trị đặc biệt: `FrozenTransactionId` (giá trị 2), được quy ước là luôn luôn nhỏ hơn mọi XID bình thường. Nếu hệ thống đến gần ngưỡng nguy hiểm (`autovacuum_freeze_max_age`), PostgreSQL sẽ tự động chuyển sang chế độ `Single-user Mode` và từ chối mọi kết nối mới để ép buộc freeze toàn bộ bảng.

---

### 2.3 Kiến Trúc MVCC MySQL InnoDB: Clustered Index & Undo Log Chains

Ngược lại với PostgreSQL, MySQL InnoDB lưu trữ dữ liệu theo cấu trúc **`Index-Organized Table`**. Phiên bản mới nhất của hàng luôn luôn nằm trực tiếp tại `Leaf Node (Nút lá)` của cây B+Tree mang tên `Clustered Index (Chỉ mục cụm - PRIMARY KEY)`.

#### 3 Trường Ẩn Trong Mỗi Bản Ghi InnoDB (`Hidden Record Fields`):
1. `DB_TRX_ID` (6 bytes): ID của transaction cuối cùng thực hiện thao tác `INSERT`, `UPDATE`, hoặc xóa mềm trên bản ghi này.
2. `DB_ROLL_PTR` (7 bytes): `Roll Pointer` — con trỏ trỏ trực tiếp tới bản ghi `Undo Log` tương ứng trong `Rollback Segment`.
3. `DB_ROW_ID` (6 bytes): Chỉ xuất hiện nếu bảng không có `PRIMARY KEY` và không có `UNIQUE KEY NOT NULL`. InnoDB tự sinh khóa chính ngầm định.

```
          INNODB CLUSTERED INDEX & UNDO LOG CHAIN
          
  Clustered Index Leaf Node (Latest Row Version in Primary Key B+Tree)
  +--------------------------------------------------------------------------+
  | PK: 101 | DB_TRX_ID: 900 | DB_ROLL_PTR: 0x7F0A | Name: "Alice" | Bal: 500 |
  +--------------------------------------------------------------------------+
                                  │
                                  │ Con trỏ DB_ROLL_PTR trỏ tới Undo Tablespace
                                  ▼
  Undo Log Segment (Memory / Disk)
  +--------------------------------------------------------------------------+
  | [Undo Record 1]                                                          |
  | Trx: 850 | Roll_Ptr: 0x4B12 | Delta: Bal = 400                           |
  +--------------------------------------------------------------------------+
         │
         ▼
  +--------------------------------------------------------------------------+
  | [Undo Record 2]                                                          |
  | Trx: 720 | Roll_Ptr: NULL   | Delta: Bal = 300 (Insert record baseline)  |
  +--------------------------------------------------------------------------+
```

#### Cấu Trúc Read View Trong InnoDB:
Khi một transaction thực hiện câu lệnh đọc (`Non-locking Consistent Read`) dưới cấp độ cô lập `Repeatable Read` hoặc `Read Committed`, InnoDB khởi tạo một cấu trúc dữ liệu gọi là `Read View`:
- `m_low_limit_id`: Transaction ID lớn nhất từng được cấp phát cộng thêm 1. Mọi bản ghi có `DB_TRX_ID >= m_low_limit_id` đều sinh ra sau khi tạo Read View $\to$ **Không khả kiến (`Invisible`)**.
- `m_up_limit_id`: Transaction ID nhỏ nhất trong danh sách các transaction đang active chưa commit. Mọi bản ghi có `DB_TRX_ID < m_up_limit_id` đều đã commit trước khi tạo Read View $\to$ **Khả kiến (`Visible`)**.
- `m_ids`: Danh sách các `trx_id` đang active tại thời điểm tạo Read View.
- `m_creator_trx_id`: Transaction ID của chính transaction tạo ra Read View này (luôn luôn được quyền nhìn thấy thay đổi của chính mình).

#### Thuật Toán Duyệt Chuỗi Undo Log (`Traversing the Undo Chain`):
Khi truy vấn đọc một bản ghi:
1. Đọc trực tiếp bản ghi từ `Clustered Index`.
2. Kiểm tra `DB_TRX_ID` của bản ghi với `Read View`:
   - Nếu `DB_TRX_ID == m_creator_trx_id` $\to$ Thấy được.
   - Nếu `DB_TRX_ID < m_up_limit_id` $\to$ Thấy được.
   - Nếu `DB_TRX_ID >= m_low_limit_id` $\to$ Không thấy được.
   - Nếu `DB_TRX_ID` nằm trong `m_ids` $\to$ Đang active chưa commit $\to$ Không thấy được.
3. Nếu bản ghi không thấy được: Sử dụng con trỏ `DB_ROLL_PTR` để nhảy ngược về `Undo Log`, áp dụng các giá trị delta để tái dựng lại trạng thái của hàng tại thời điểm trước đó. Tiếp tục lặp lại kiểm tra trên phiên bản lịch sử này cho đến khi tìm thấy phiên bản hợp lệ, hoặc chạm mốc đầu chuỗi.

#### Tiến Trình Dọn Dẹp Purge Threads:
- Các bản ghi `Undo Log` không thể bị xóa ngay khi transaction commit, vì các transaction khác có thể vẫn cần chúng để tái dựng lại lịch sử thông qua `Read View`.
- `Purge Threads` chạy ngầm định kỳ: Quét qua các `Read View` cũ nhất còn tồn tại trong hệ thống. Nếu một `Undo Record` không còn bất kỳ Read View nào cần tham chiếu đến, nó sẽ được giải phóng hoàn toàn và trang Undo được đánh dấu tái sử dụng.
- **Rủi ro Long-Running Query**: Nếu có một query chạy mất 4 tiếng, nó giữ một Read View cực cũ. Hàng triệu bản ghi Undo log sinh ra trong 4 tiếng đó không thể được purge, khiến `Undo Tablespace` phình to khủng khiếp (`Undo Bloat`) và làm chậm toàn bộ các truy vấn đọc khác do chuỗi Undo Chain quá dài!

---

### 2.4 Bảng So Sánh Đối Đầu Toàn Diện: PostgreSQL vs InnoDB

| Tiêu Chí So Sánh | PostgreSQL (Heap-based MVCC) | MySQL InnoDB (Undo Log-based MVCC) |
| :--- | :--- | :--- |
| **Vị trí lưu phiên bản cũ** | Cùng nằm trực tiếp trên `Data Pages (Heap)` cùng với bản ghi mới. | Bản ghi mới nhất nằm trong `Clustered Index`, bản ghi cũ nằm trong `Undo Log`. |
| **Index Overhead khi UPDATE** | Cao (Tạo tuple mới $\to$ cập nhật index pointer, trừ khi thỏa mãn điều kiện `HOT`). | Cực thấp (Chỉ cập nhật clustered index và append delta vào Undo log; secondary index không bị chạm tới nếu không sửa cột index). |
| **Chi phí khôi phục bản ghi cũ** | Cực thấp (Đọc trực tiếp tuple lịch sử trên Heap page, $O(1)$). | Tăng tuyến tính theo độ dài chuỗi Undo: Phải rollback từng bước từ bản ghi hiện tại, $O(N)$. |
| **Hiện tượng phình to (Bloat)** | `Table Bloat` & `Index Bloat` (Tệp dữ liệu phình to do chứa cả dead tuples). | `Undo Tablespace Bloat` (Bảng chính gọn gàng, nhưng tệp Undo phình to). |
| **Cơ chế thu gom rác (GC)** | `VACUUM` / `Autovacuum` (Quét toàn bộ data pages, có nguy cơ tranh chấp I/O cao). | `Purge Threads` (Chỉ dọn dẹp các phân đoạn Undo Log trong Undo Tablespace, không chạm data page). |
| **Giới hạn Transaction ID** | Bị giới hạn $2^{31}$ XID. Bắt buộc có cơ chế `Vacuum Freeze` để tránh crash hệ thống. | Dùng Transaction ID 64-bit hoặc 48-bit tuần hoàn, không gặp sự cố Wraparound dừng dịch vụ. |
| **Tác động của Long-Running Query** | Autovacuum bị tắc nghẽn, bảng phình to nhanh chóng, nguy cơ chạm trần XID Wraparound. | Purge Threads bị tắc nghẽn, Undo log phình to, truy vấn đọc duyệt Undo chain bị giảm thông lượng. |

---

## 3. CẤP ĐỘ CÔ LẬP & DỊ THƯỜNG DỮ LIỆU (ISOLATION LEVELS & DATA ANOMALIES)

### 3.1 Chuẩn ANSI SQL-92 & Bản Phê Phán Lịch Sử Berenson 1995

Năm 1992, chuẩn ANSI/ISO SQL-92 định nghĩa 4 cấp độ cô lập dựa trên việc ngăn chặn 3 hiện tượng dị thường kinh điển:
1. `Dirty Read (Đọc bẩn)`
2. `Non-repeatable Read (Đọc không lặp lại được)`
3. `Phantom Read (Đọc bóng ma)`

Tuy nhiên, vào năm 1995, các nhà khoa học máy tính hàng đầu (Hal Berenson, Phil Bernstein, Jim Gray, Jim Melton, Elizabeth O'Neil, Patrick O'Neil) đã công bố công trình lịch sử:  
📄 **`"A Critique of ANSI SQL Isolation Levels"`**.

#### Điểm Yếu Cốt Tử Của Chuẩn ANSI SQL-92:
1. **Thiên kiến khóa (`Lock-based Bias`)**: Định nghĩa của ANSI ngầm giả định hệ thống sử dụng cơ chế khóa hai pha (`Strict 2PL`). Nó hoàn toàn thất bại trong việc mô tả chính xác hành vi của các hệ thống cơ sở dữ liệu hiện đại vận hành trên nền tảng **`Snapshot Isolation (SI)`** và `MVCC`.
2. **Bỏ sót các dị thường nghiêm trọng**: ANSI không hề nhắc tới các dị thường tàn khốc trong thực tế như `Lost Update`, `Read Skew`, `Write Skew` và các chu kỳ phụ thuộc tuần tự hóa (`Serialization Graph Cycles`).
3. **Thực tế trớ trêu**: Rất nhiều cơ sở dữ liệu (điển hình là Oracle và PostgreSQL) tuyên bố hỗ trợ cấp độ `Serializable` hoặc `Repeatable Read`, nhưng thực chất lại triển khai `Snapshot Isolation (SI)` — một cấp độ vẫn tồn tại dị thường làm sai lệch dữ liệu!

---

### 3.2 Bảng Ma Trận Phân Loại 7 Dị Thường Dữ Liệu (Data Anomalies Taxonomy)

Dưới đây là bảng phân loại toàn diện 7 dị thường dữ liệu theo chuẩn hình thức toán học (`Berenson Formalism`):

```
+---------------------------------------------------------------------------------------------------+
|                                BẢNG MA TRẬN 7 DỊ THƯỜNG DỮ LIỆU                                  |
+-------------------+-----------------------------+-------------------------------------------------+
| Mã Ký Hiệu Chuẩn  | Tên Dị Thường Kỹ Thuật      | Mô Tả Bản Chất Hiện Tượng Xung Đột             |
+-------------------+-----------------------------+-------------------------------------------------+
| G0 (Dirty Write)  | Ghi Bẩn                     | T1 sửa x, T2 sửa x trước khi T1 commit/abort.   |
| G1a (Dirty Read)  | Đọc Bẩn                     | T1 sửa x, T2 đọc x, sau đó T1 ABORT.            |
| G1b (Fuzzy Read)  | Đọc Không Lặp Lại Được      | T1 đọc x, T2 sửa x và COMMIT, T1 đọc lại thấy x'|
| P3 (Phantom Read) | Đọc Dữ Liệu Bóng Ma         | T1 đọc tập hợp thỏa Predicate P, T2 INSERT thêm |
|                   |                             | hàng thỏa P và COMMIT, T1 đọc lại thấy hàng mới.|
| P4 (Lost Update)  | Mất Dữ Liệu Cập Nhật        | T1 đọc x, T2 đọc x, T1 ghi x+1, T2 ghi x+2.     |
|                   |                             | Cập nhật của T1 bị ghi đè hoàn toàn bởi T2!     |
| G-skew (Read Skew)| Đọc Bị Lệch Ràng Buộc       | T1 đọc x, T2 cập nhật x và y (x+y=C) rồi commit,|
|                   |                             | sau đó T1 đọc y. T1 thấy trạng thái x và y lệch |
| G-skew-write      | Ghi Bị Lệch Ràng Buộc       | T1 đọc x và y, T2 đọc x và y. T1 sửa x dựa trên |
| (Write Skew)      | (Dị thường kinh điển của SI)| y; T2 sửa y dựa trên x. Cả hai vi phạm bất biến!|
+-------------------+-----------------------------+-------------------------------------------------+
```

---

### 3.3 Ma Trận Đối Chiếu Cấp Độ Cô Lập vs Dị Thường Thực Tế

Bảng dưới đây so sánh giữa lý thuyết ANSI SQL và hành vi thực tế của **PostgreSQL** và **MySQL InnoDB**:

| Cấp Độ Cô Lập (Isolation Level) | Dirty Read (G1a) | Non-Repeatable Read (G1b) | Phantom Read (P3) | Lost Update (P4) | Write Skew (G-skew-write) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Read Uncommitted (ANSI)** | ❌ Cho phép | ❌ Cho phép | ❌ Cho phép | ❌ Cho phép | ❌ Cho phép |
| **Read Committed (ANSI)** | ✅ Ngăn chặn | ❌ Cho phép | ❌ Cho phép | ❌ Cho phép | ❌ Cho phép |
| **Repeatable Read (ANSI Spec)** | ✅ Ngăn chặn | ✅ Ngăn chặn | ❌ Cho phép | ❌/⚠️ | ❌ Cho phép |
| **Snapshot Isolation (SI Engine)** | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn* | ❌ **CHO PHÉP** |
| **MySQL InnoDB Repeatable Read** | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn (MVCC & Next-Key Lock)** | ✅ Ngăn chặn (Current Read) | ❌ **CHO PHÉP** |
| **PostgreSQL Repeatable Read** | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn (Bằng Snapshot) | ✅ Ngăn chặn (Throw Error) | ❌ **CHO PHÉP** |
| **Serializable (Strict 2PL / SSI)**| ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn | ✅ Ngăn chặn |

*\* Chú thích Snapshot Isolation*: Ngăn chặn Lost Update nếu hệ thống áp dụng cơ chế `First-Committer-Wins` (nếu hai giao dịch cùng sửa một dòng, giao dịch commit sau sẽ bị abort).  
*\*\* Chú thích MySQL InnoDB*: Ngăn chặn Phantom Read cho các câu lệnh `SELECT` thuần túy thông qua MVCC, và cho các câu lệnh `SELECT FOR UPDATE / UPDATE` thông qua `Next-Key Locking`. Tuy nhiên, nếu T1 đọc MVCC, T2 INSERT dòng mới và commit, sau đó T1 chạy lệnh `UPDATE` trúng dòng mới chèn đó, dòng đó sẽ bị kéo vào transaction của T1 và câu lệnh `SELECT` tiếp theo sẽ thấy bóng ma xuất hiện!

---

### 3.4 Giải Phẫu Dị Thường Write Skew & Cơ Chế Serializable Snapshot Isolation (SSI)

#### Kịch Bản Kinh Điển: Ca Trực Của Bác Sĩ (The On-Call Doctor Problem)
- **Quy tắc bất biến (`Business Invariant`)**: Bệnh viện luôn luôn phải có **ít nhất 1 bác sĩ trực ban (`Count(on_call = TRUE) >= 1`)**.
- **Hiện trạng ban đầu**: Có 2 bác sĩ đang trực: Bác sĩ $A$ và Bác sĩ $B$ (`Count = 2`).

```
             TIMELINE DỊ THƯỜNG WRITE SKEW TRÊN SNAPSHOT ISOLATION
             
  Transaction 1 (Bác sĩ A xin nghỉ)          Transaction 2 (Bác sĩ B xin nghỉ)
  ---------------------------------          ---------------------------------
  BEGIN (Snapshot Isolation)                 BEGIN (Snapshot Isolation)
  
  -- Bước 1: Kiểm tra điều kiện              -- Bước 1: Kiểm tra điều kiện
  SELECT count(*) FROM doctors               SELECT count(*) FROM doctors
  WHERE on_call = TRUE;                      WHERE on_call = TRUE;
  --> Kết quả: 2 (Thỏa mãn >= 2)             --> Kết quả: 2 (Thỏa mãn >= 2)
  
  -- Bước 2: Xin nghỉ (Sửa dòng của mình)    -- Bước 2: Xin nghỉ (Sửa dòng của mình)
  UPDATE doctors SET on_call = FALSE         UPDATE doctors SET on_call = FALSE
  WHERE id = 'Doctor_A';                     WHERE id = 'Doctor_B';
  
  -- Bước 3: Commit                          -- Bước 3: Commit
  COMMIT;                                    COMMIT;
  
  ============================================================================
  KẾT QUẢ CUỐI CÙNG: CẢ HAI BÁC SĨ ĐỀU NGHỈ TRỰC! (Count on_call = 0)
  VI PHẠM BẤT BIẾN NGHIỆP VỤ NGHIÊM TRỌNG!
  ============================================================================
```

#### Tại Sao Snapshot Isolation (SI) Không Ngăn Chặn Được Write Skew?
- Transaction 1 chỉ ghi vào dòng của Bác sĩ $A$.
- Transaction 2 chỉ ghi vào dòng của Bác sĩ $B$.
- **Tập hợp ghi (`Write Sets`) của hai giao dịch hoàn toàn rời nhau (`Disjoint Write Sets`)!**
- Không có bất kỳ xung đột `Write-Write Conflict` nào xảy ra, do đó quy tắc `First-Committer-Wins` không được kích hoạt. Cả hai giao dịch đều commit thành công rực rỡ, nhưng kết quả tạo ra một trạng thái dữ liệu không thể tái hiện bằng bất kỳ lịch trình tuần tự (`Serial Schedule`) nào!

#### Giải Pháp Của PostgreSQL: Serializable Snapshot Isolation (SSI)
PostgreSQL hiện thực hóa cấp độ `SERIALIZABLE` thực thụ (từ bản 9.1) dựa trên bài báo mang tính đột phá của Michael Cahill (2008):  
📄 **`"Serializable Isolation for Snapshot Databases"`**.

```
             CHU KỲ NGUY HIỂM PHỤ THUỘC RW TRONG SSI
             
                 rw-antidependency          rw-antidependency
         [ T1 ] --------------------> [ T2 ] --------------------> [ T3 / T1 ]
          (Đọc x,                      (Sửa x sau khi               (Tạo thành chu kỳ
           chưa ai sửa)                 T1 đã đọc x)                 xung đột - Cycle)
```

1. **`SIREAD Locks (Khóa Đọc Ảo)`**:
   - PostgreSQL không dùng khóa thật để chặn luồng như 2PL. Thay vào đó, nó cấp phát các `SIREAD Locks` (thực chất chỉ là các con trỏ cờ rất nhẹ nằm trong RAM của `Predicate Lock Manager`).
   - Cấp phát theo 3 mức: Tuple, Page, Relation.
2. **Theo dõi cạnh xung đột chống phụ thuộc (`rw-antidependencies`)**:
   - Nếu $T_1$ đọc một tuple thông qua SIREAD lock, và sau đó $T_2$ ghi đè lên tuple đó $\to$ Xuất hiện một cạnh có hướng: $T_1 \xrightarrow{rw} T_2$.
3. **Phát hiện chu kỳ nguy hiểm (`Dangerous Structure Detection`)**:
   - SSI chứng minh rằng: Một lịch trình giao dịch chỉ vi phạm tính tuần tự hóa khi và chỉ khi đồ thị phụ thuộc xuất hiện **hai cạnh $rw$ liên tiếp** tạo thành một chu kỳ nguy hiểm:  
     $$T_{\text{in}} \xrightarrow{rw} T_{\text{pivot}} \xrightarrow{rw} T_{\text{out}}$$
   - Ngay khi phát hiện giao dịch trung gian (`Pivot Transaction`), PostgreSQL sẽ lập tức chủ động **`ABORT`** một trong các giao dịch và ném ra lỗi mã `40001`:  
     `ERROR: could not serialize access due to read/write dependencies among transactions`.
   - Ứng dụng chỉ việc bắt lỗi này và thực hiện **thử lại giao dịch (`Retry Loop`)**.

---

## 4. CƠ CHẾ KHÓA & PHÒNG CHỐNG KHÓA CHẾT (LOCKING PROTOCOLS & DEADLOCK HANDLING)

### 4.1 Giao Thức Khóa Hai Pha (2PL: Two-Phase Locking Family)

`Two-Phase Locking (2PL)` là giao dịch bảo đảm tính tương đương tuần tự (`Conflict Serializability`). Một giao dịch tuân thủ 2PL phải trải qua đúng hai pha tách biệt:
1. **`Growing Phase (Pha tích lũy khóa)`**: Giao dịch chỉ được phép xin thêm khóa mới, **tuyệt đối không được nhả bất kỳ khóa nào**.
2. **`Shrinking Phase (Pha giải phóng khóa)`**: Giao dịch bắt đầu giải phóng khóa, **tuyệt đối không được xin thêm bất kỳ khóa mới nào**.

```
                CÁC BIẾN THỂ CỦA GIAO THỨC 2PL
                
  Số lượng khóa
        ▲
        │          /-------\  <-- Điểm đạt đỉnh khóa (Lock Point)
        │         /         \
        │        /           \      [1. Basic 2PL]
        │       /             \     Có thể bị Cascading Aborts (Hủy theo tầng)!
        │      /               \
        └─────┴─────────────────┴───────────────► Thời gian
              Pha Lớn           Pha Nhỏ
              (Growing)         (Shrinking)
              
        ▲
        │          /--------------------\
        │         /                     | [2. Strict 2PL (S2PL)]
        │        /                      | Giữ toàn bộ Exclusive Locks (X)
        │       /                       | đến tận COMMIT / ROLLBACK!
        └──────┴────────────────────────┴───────► Thời gian
              Growing                   Commit
              
        ▲
        │          /--------------------\
        │         /                     | [3. Rigorous 2PL (SS2PL / Strong Strict)]
        │        /                      | Giữ CẢ Shared (S) VÀ Exclusive (X)
        │       /                       | đến tận COMMIT / ROLLBACK! (Phổ biến nhất)
        └──────┴────────────────────────┴───────► Thời gian
              Growing                   Commit
```

- **`Basic 2PL`**: Rất nguy hiểm vì nếu $T_1$ nhả khóa sớm ở Pha Nhỏ, $T_2$ đọc dữ liệu của $T_1$, sau đó $T_1$ bị sập nguồn abort $\to$ $T_2$ bị buộc phải abort theo (`Cascading Abort`).
- **`Strict 2PL (S2PL)`**: Khắc phục triệt để Cascading Abort bằng cách giữ toàn bộ `X-locks (Khóa độc quyền)` đến cuối giao dịch.
- **`Strong Strict 2PL (SS2PL / Rigorous 2PL)`**: Tiêu chuẩn vàng triển khai thực tế. Mọi khóa (cả đọc lẫn ghi) đều được giữ chặt chẽ cho đến khi giao dịch kết thúc.

---

### 4.2 Khóa Đa Mức Hạt & Khóa Dự Định (Multiple Granularity Locking & Intent Locks)

Để quản lý việc khóa tài nguyên ở các cấp độ khác nhau (`Database` $\to$ `Table` $\to$ `Page` $\to$ `Row`), hệ thống sử dụng cơ chế **`Intent Locks (Khóa dự định)`**.

- **Tại sao cần Intent Locks?**  
  Nếu Transaction $T_1$ đang giữ một khóa dòng `X-lock` ở dòng số 500 của bảng `orders`, mà Transaction $T_2$ muốn xin một khóa độc quyền toàn bảng `X-lock` trên bảng `orders` (ví dụ để chạy `ALTER TABLE`):
  - Nếu không có Intent Lock, $T_2$ sẽ phải quét tuần tự hàng triệu dòng trong bảng để kiểm tra xem có dòng nào đang bị khóa không $\to$ Chi phí $O(N)$ không thể chấp nhận được!
  - Nhờ có Intent Lock: Khi $T_1$ muốn khóa dòng 500, nó bắt buộc phải đặt trước một `IX (Intent Exclusive)` lên bảng `orders`. Khi $T_2$ đến xin khóa bảng `X`, nó chỉ cần nhìn thấy cờ `IX` trên bảng là lập tức biết ngay bên dưới đang có dòng bị khóa $\to$ Chi phí kiểm tra là $O(1)$!

#### Ma Trận Tương Thích Khóa Toàn Diện (`5x5 Lock Compatibility Matrix`):

| Loại Khóa Đang Giữ \ Loại Khóa Xin Thêm | IS (Intent Shared) | IX (Intent Exclusive) | S (Shared) | SIX (Shared Intent Exclusive) | X (Exclusive) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **IS** | ✅ **TƯƠNG THÍCH** | ✅ **TƯƠNG THÍCH** | ✅ **TƯƠNG THÍCH** | ✅ **TƯƠNG THÍCH** | ❌ XUNG ĐỘT |
| **IX** | ✅ **TƯƠNG THÍCH** | ✅ **TƯƠNG THÍCH** | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT |
| **S** | ✅ **TƯƠNG THÍCH** | ❌ XUNG ĐỘT | ✅ **TƯƠNG THÍCH** | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT |
| **SIX** | ✅ **TƯƠNG THÍCH** | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT |
| **X** | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT | ❌ XUNG ĐỘT |

*Ghi chú*:
- `SIX (Shared Intent Exclusive)`: Giao dịch có quyền đọc toàn bộ bảng (S), đồng thời dự định cập nhật một số dòng cụ thể bên dưới (IX).

---

### 4.3 Cấu Trúc Khóa Chuyên Biệt Trong InnoDB: Record, Gap, Next-Key Locks

Trong MySQL InnoDB, khóa dòng thực chất được gắn trên các **bản ghi chỉ mục (`Index Records`)**. Nếu câu lệnh truy vấn không thể sử dụng index, InnoDB buộc phải khóa toàn bộ clustered index của toàn bảng!

```
                TRỤC SỐ BIỂU DIỄN CÁC LOẠI KHÓA INNODB
                
  Giả sử Index có các giá trị hiện hữu: 10, 20, 30
  
  Trục Index:   --------( 10 )-----------------( 20 )-----------------( 30 )-------->
                         ▲                      ▲                      ▲
  1. Record Lock:        [10]                   [20]                   [30]
     Chỉ khóa đúng giá trị của bản ghi (Exact Match).
     
  2. Gap Lock:     (-inf, 10)         (10, 20)               (20, 30)         (30, +inf)
     Khóa khoảng trống giữa các giá trị. Ngăn chặn INSERT của các transaction khác!
     
  3. Next-Key Lock: (-inf, 10]        (10, 20]               (20, 30]         (30, +inf)
     Sự kết hợp: Gap Lock phía trước + Record Lock chính nó. Khoảng nửa mở (Left-open, Right-closed).
```

1. **`Record Lock`**: Khóa chính xác trên một bản ghi index duy nhất. (Ví dụ: `SELECT * FROM users WHERE id = 10 FOR UPDATE;` khi `id` là Unique Key).
2. **`Gap Lock`**:
   - Khóa một khoảng hở giữa các bản ghi index, hoặc khoảng trước bản ghi đầu tiên, hoặc khoảng sau bản ghi cuối cùng (`supremum record`).
   - **Mục đích duy nhất**: Ngăn chặn các transaction khác chèn (`INSERT`) dữ liệu vào khoảng trống này, loại trừ hiện tượng `Phantom Read`.
   - **Đặc tính phi đối kháng**: Hai transaction khác nhau có thể cùng giữ hai `Gap Lock` chồng lấn lên nhau trên cùng một khoảng mà không hề xung đột!
3. **`Next-Key Lock`**:
   - Là cơ chế khóa **mặc định** trong InnoDB ở cấp độ cô lập `Repeatable Read`.
   - Bao phủ một khoảng $(a, b]$: Khóa khoảng trống phía trước $b$ và khóa luôn chính bản ghi $b$.
4. **`Insert Intention Lock (Khóa dự định chèn)`**:
   - Một loại Gap Lock đặc biệt được thiết lập ngầm định trước khi chèn bản ghi mới.
   - Nếu hai transaction muốn chèn vào cùng một gap nhưng ở hai tọa độ khác nhau (ví dụ: chèn 12 và 15 vào gap $(10, 20)$), chúng sẽ không khóa chặn nhau, cho phép thông lượng chèn song song cực lớn.

---

### 4.4 Kiểm Soát Lạc Quan (OCC) vs Khóa Bi quan (Pessimistic Locking)

```
+-----------------------------------------------------------------------------------------+
|                  OCC (OPTIMISTIC) VS PESSIMISTIC LOCKING COMPARISON                     |
+--------------------------+--------------------------------------------------------------+
| Đặc Điểm                 | Optimistic Concurrency Control | Pessimistic Locking        |
+--------------------------+--------------------------------+-----------------------------+
| Triết lý tiếp cận        | Xung đột hiếm khi xảy ra.     | Xung đột rất dễ xảy ra.     |
| Cơ chế kiểm soát         | Version / Timestamp Check      | Lock primitives (X-Lock)    |
| Điểm chặn (Blocking)     | Không chặn luồng (Non-blocking)| Chặn luồng (Thread Waiting) |
| Chi phí tài nguyên       | Chi phí CPU cho Retry Loop     | Chi phí quản lý Lock Memory |
| Phù hợp nhất với         | Read-Heavy, Low Contention     | Write-Heavy, High Contention|
| Ví dụ điển hình          | Giỏ hàng E-commerce, Wiki Docs | Đặt vé máy bay, Flash-Sale  |
+--------------------------+--------------------------------+-----------------------------+
```

#### Phân Tích Kỹ Thuật Pessimistic Primitives:
1. `SELECT ... FOR UPDATE`: Đặt khóa độc quyền `X-lock` lên các dòng được quét. Mọi giao dịch khác muốn đọc bằng locking read hoặc muốn sửa dòng này đều phải chờ.
2. `SELECT ... FOR UPDATE NOWAIT`:
   - Nếu dòng đang bị giữ khóa bởi giao dịch khác, lập tức ném lỗi ngoại lệ (`Fail-Fast`) thay vì bị treo thread chờ đợi timeout.
   - Thích hợp cho các kiến trúc vi dịch vụ (`Microservices`) yêu cầu kiểm soát SLA độ trễ nghiêm ngặt.
3. `SELECT ... FOR UPDATE SKIP LOCKED`:
   - **Vũ khí tối thượng của hệ thống Job Queue**: Cơ sở dữ liệu sẽ tự động bỏ qua các dòng đang bị khóa bởi các worker khác và chỉ khóa/trả về các dòng tự do tiếp theo.
   - Triệt tiêu 100% tình trạng tranh chấp khóa và nghẽn luồng giữa hàng trăm worker chạy song song!

---

### 4.5 Khóa Chết: Phát Hiện (Wait-For Graph) & Phòng Ngừa (Wait-Die, Wound-Wait)

#### Khóa Chết (Deadlock) Là Gì?
Tình huống hai hoặc nhiều giao dịch rơi vào trạng thái chờ đợi lẫn nhau vô hạn để giải phóng tài nguyên:
- $T_1$ giữ Khóa $A$, chờ Khóa $B$.
- $T_2$ giữ Khóa $B$, chờ Khóa $A$.

```
              WAIT-FOR GRAPH (WFG) CYCLE DETECTION
              
                      Holds Lock A, Requests Lock B
                  (T1) --------------------------> (T2)
                   ▲                                 │
                   │                                 │
                   └─────────────────────────────────┘
                      Holds Lock B, Requests Lock A
```

#### Cơ Chế Phát Hiện Khóa Chết (`Deadlock Detection`):
1. **`Wait-For Graph - WFG (Đồ thị chờ)`**:
   - Các đỉnh ($V$): Danh sách các giao dịch đang chạy.
   - Cạnh có hướng ($E$): Cạnh $T_i \to T_j$ biểu thị giao dịch $T_i$ đang chờ tài nguyên do $T_j$ nắm giữ.
2. **Thuật toán tìm chu kỳ**:
   - Định kỳ (ví dụ `innodb_deadlock_detect = ON`, kiểm tra mỗi 50-1000ms), DBMS duyệt đồ thị bằng thuật toán tìm kiếm theo chiều sâu (`DFS`) hoặc thuật toán Tarjan để phát hiện chu trình (`Cycle`).
3. **Xử lý chu trình (`Victim Selection`)**:
   - Khi phát hiện chu trình, DBMS chọn một giao dịch làm "vật tế thần" (`Victim`) để tiến hành abort và rollback.
   - Tiêu chí chọn Victim: Giao dịch có khối lượng thay đổi nhỏ nhất (`Smallest Undo Log Weight`), giao dịch mới khởi tạo, hoặc giao dịch giữ ít khóa nhất để tối thiểu hóa chi phí rollback.

#### Cơ Chế Phòng Ngừa Khóa Chết Bằng Nhãn Thời Gian (`Timestamp-Based Deadlock Prevention`):
Gán nhãn thời gian duy nhất cho mỗi giao dịch khi khởi tạo: $\text{Timestamp}(T)$. Nhãn càng nhỏ nghĩa là giao dịch càng già cỗi (`Older`), nhãn càng lớn nghĩa là giao dịch càng trẻ (`Younger`).

Giả sử $T_1$ yêu cầu một khóa đang do $T_2$ nắm giữ:

1. **Chiến lược `Wait-Die` (Giao thức không ưu tiên kẻ trẻ)**:
   - Nếu $T_1$ GIÀ hơn $T_2$ ($\text{TS}(T_1) < \text{TS}(T_2)$): $T_1$ được phép **CHỜ (`WAIT`)**.
   - Nếu $T_1$ TRẺ hơn $T_2$ ($\text{TS}(T_1) > \text{TS}(T_2)$): $T_1$ lập tức **CHẾT (`DIE` - Abort & Rollback)**.
   - *Quy tắc ghi nhớ*: "Kẻ già được chờ, kẻ trẻ phải chết".

2. **Chiến lược `Wound-Wait` (Giao thức bạo lực ưu tiên kẻ già)**:
   - Nếu $T_1$ GIÀ hơn $T_2$ ($\text{TS}(T_1) < \text{TS}(T_2)$): $T_1$ lập tức **LÀM BỊ THƯƠNG $T_2$ (`WOUND` - Cưỡng chế $T_2$ abort và nhường khóa)**.
   - Nếu $T_1$ TRẺ hơn $T_2$ ($\text{TS}(T_1) > \text{TS}(T_2)$): $T_1$ được phép **CHỜ (`WAIT`)**.
   - *Quy tắc ghi nhớ*: "Kẻ già cướp khóa, kẻ trẻ chờ đợi".

> 💡 **So Sánh Hiệu Quả**:  
> Thuật toán `Wound-Wait` vượt trội hơn nhiều so với `Wait-Die` trong thực tế, vì khi một giao dịch già cần tài nguyên, nó nhanh chóng cướp khóa để về đích mà không phải chờ đợi, đồng thời các giao dịch trẻ bị abort sẽ được khởi tạo lại với timestamp ban đầu, giúp chúng tăng dần "thâm niên" và không bao giờ bị bỏ đói (`Starvation Free`).

---

## 5. MẪU THIẾT KẾ MÃ NGUỒN CHUẨN PRODUCTION (PRODUCTION-GRADE IMPLEMENTATION PATTERNS)

### 5.1 Vòng Lặp Thử Lại Giao Dịch An Toàn (Safe Transaction Retry Loop with Jitter)

Trong bất kỳ hệ thống phân tán hoặc cơ sở dữ liệu có thông lượng cao nào, việc gặp phải `Serialization Failure (Lỗi tuần tự hóa)` hoặc `Deadlock` là điều hoàn toàn bình thường và tất yếu. Ứng dụng chuẩn production **bắt buộc phải có cơ chế Retry tự động với Exponential Backoff và Full Jitter**.

```python
"""
Production-Grade Database Transaction Retry Engine
Engine: PostgreSQL / MySQL Compatible with Psycopg3 / SQLAlchemy
Focus: Exponential Backoff, Full Jitter, Transient Error Filter
"""

import time
import random
import logging
from typing import Callable, TypeVar, Any
from psycopg.errors import SerializationFailure, DeadlockDetected

T = TypeVar("T")
logger = logging.getLogger("transaction_guard")

class TransientTransactionError(Exception):
    """Lỗi giao dịch tạm thời có thể retry an toàn."""
    pass

def execute_with_retry(
    transaction_block: Callable[[], T],
    max_retries: int = 5,
    base_backoff_ms: float = 50.0,
    max_backoff_ms: float = 2000.0
) -> T:
    """
    Thực thi khối giao dịch với thuật toán Full Jitter Backoff.
    Ngăn chặn hiện tượng 'Thundering Herd' làm sập database khi có tranh chấp đồng thời.
    """
    attempt = 0
    while True:
        try:
            # Thực thi khối logic nghiệp vụ của transaction
            return transaction_block()
        except (SerializationFailure, DeadlockDetected) as transient_err:
            attempt += 1
            if attempt > max_retries:
                logger.critical(
                    "Giao dịch thất bại sau %d lần thử lại do xung đột: %s",
                    max_retries, str(transient_err)
                )
                raise transient_err

            # Công thức Full Jitter: Sleep = Random(0, Min(Max_Backoff, Base * 2^attempt))
            calculated_backoff = min(max_backoff_ms, base_backoff_ms * (2 ** (attempt - 1)))
            sleep_duration_seconds = random.uniform(0, calculated_backoff) / 1000.0

            logger.warning(
                "Xung đột đồng thời (Attempt %d/%d). Mã lỗi: %s. Ngủ %.3fs trước khi retry...",
                attempt, max_retries, getattr(transient_err, "pgcode", "DEADLOCK"), sleep_duration_seconds
            )
            time.sleep(sleep_duration_seconds)
```

---

### 5.2 Hàng Đợi Xử Lý Song Song Thông Lượng Cao với `SELECT FOR UPDATE SKIP LOCKED`

Giải pháp xử lý hàng triệu bản ghi nhiệm vụ (`Job Task Worker`) chạy song song trên 50 pods mà không bao giờ bị nghẽn luồng hay trùng lặp task:

```sql
-- Schema định nghĩa hàng đợi
CREATE TABLE task_queue (
    id BIGSERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_task_queue_pending ON task_queue (id) WHERE status = 'PENDING';
```

```sql
-- Mã SQL thực thi nguyên tử lấy 10 task cho Worker mà không chặn các Worker khác
BEGIN;

WITH selected_tasks AS (
    SELECT id
    FROM task_queue
    WHERE status = 'PENDING'
    ORDER BY id ASC
    LIMIT 10
    FOR UPDATE SKIP LOCKED -- Bỏ qua các dòng đã bị worker khác khóa, không phải chờ!
)
UPDATE task_queue t
SET status = 'PROCESSING',
    processed_at = NOW()
FROM selected_tasks s
WHERE t.id = s.id
RETURNING t.id, t.payload;

COMMIT;
```

---

### 5.3 Giao Dịch Số Dư / Tồn Kho An Toàn Bằng OCC & Version Guard

Xử lý giao dịch trừ tiền trong ví điện tử hoặc trừ kho hàng thương mại điện tử bằng kỹ thuật kiểm soát đồng thời lạc quan (`Optimistic Concurrency Control`):

```sql
-- Bảng tài khoản với cột version kiểm soát OCC
CREATE TABLE user_wallets (
    user_id BIGINT PRIMARY KEY,
    balance NUMERIC(15, 2) NOT NULL CHECK (balance >= 0),
    version BIGINT DEFAULT 1 NOT NULL
);
```

```python
"""
Triển khai trừ tiền ví điện tử an toàn tuyệt đối bằng Atomic CAS (Compare-And-Swap)
"""
def deduct_wallet_balance_occ(db_session, user_id: int, amount: float) -> bool:
    max_retries = 3
    for attempt in range(max_retries):
        # Bước 1: Đọc số dư hiện tại và version (Non-locking Read)
        wallet = db_session.execute(
            "SELECT balance, version FROM user_wallets WHERE user_id = :uid",
            {"uid": user_id}
        ).fetchone()

        if not wallet or wallet.balance < amount:
            raise ValueError("Số dư không đủ hoặc tài khoản không tồn tại!")

        current_version = wallet.version
        new_balance = wallet.balance - amount

        # Bước 2: Thực thi cập nhật có điều kiện (Atomic Compare-and-Swap)
        result = db_session.execute(
            """
            UPDATE user_wallets 
            SET balance = :new_balance,
                version = version + 1
            WHERE user_id = :uid AND version = :current_version
            """,
            {
                "new_balance": new_balance,
                "uid": user_id,
                "current_version": current_version
            }
        )
        db_session.commit()

        # Kiểm tra xem có dòng nào được cập nhật không
        if result.rowcount == 1:
            return True # Thành công vượt qua kiểm tra Version Guard!

        # Nếu rowcount == 0 nghĩa là đã có transaction khác sửa trước trong tích tắc
        logger.info("OCC Conflict phát hiện tại user %d, thử lại lần %d...", user_id, attempt + 1)
        time.sleep(0.01 * (attempt + 1))

    raise TransientTransactionError("Hệ thống bận, giao dịch bị xung đột liên tục!")
```

---

### 5.4 Bảng Kiểm Tra Chuẩn Vận Hành Kiến Trúc Sư (Architectural Production Checklist)

```
+-----------------------------------------------------------------------------------------------+
|                       DATABASE CONCURRENCY & TRANSACTION AUDIT CHECKLIST                      |
+-----+--------------------------------------------------------------------------+-------------+
| STT | Hạng Mục Kiểm Tra Kỹ Thuật Chuyên Sâu                                     | Trạng Thái  |
+-----+--------------------------------------------------------------------------+-------------+
| 01  | [PostgreSQL] Autovacuum đã được tinh chỉnh cho các bảng có tần suất ghi cao| [ ] AUDITED |
|     | (giảm autovacuum_vacuum_scale_factor = 0.05, tăng cost_limit)?          |             |
| 02  | [PostgreSQL] Thiết lập giám sát cảnh báo ngưỡng Transaction ID Wraparound  | [ ] AUDITED |
|     | (truy vấn datfrozenxid trong pg_database để cảnh báo khi vượt 1.5 tỷ XID)?|             |
| 03  | [PostgreSQL] Ứng dụng đã xử lý bắt lỗi 40001 (serialization_failure) và    | [ ] AUDITED |
|     | 40P01 (deadlock_detected) bằng cơ chế Retry Loop with Jitter chưa?       |             |
| 04  | [MySQL InnoDB] Không thực hiện truy vấn dài (Long-Running Queries) giữ   | [ ] AUDITED |
|     | Read View trong giờ cao điểm làm phình to Undo Tablespace?              |             |
| 05  | [MySQL InnoDB] Tránh các câu lệnh UPDATE/DELETE không sử dụng Index dẫn   | [ ] AUDITED |
|     | đến việc nâng cấp từ Record Lock lên toàn bộ Table Clustered Lock?      |             |
| 06  | [Logic Code] Thứ tự xin khóa (Lock Ordering Invariant): Mọi transaction    | [ ] AUDITED |
|     | sửa nhiều bảng/dòng đều tuân thủ thứ tự sắp xếp cố định (theo ID tăng dần)| [ ] AUDITED |
|     | để triệt tiêu 100% khả năng xảy ra Deadlock chu kỳ?                     |             |
| 07  | [Job Queue] Tất cả các bảng hàng đợi đều sử dụng SELECT ... FOR UPDATE   | [ ] AUDITED |
|     | SKIP LOCKED thay vì cờ status boolean với optimistic poll thông thường?   | [ ] AUDITED |
| 08  | [Data Integrity] Các cột số dư, tồn kho luôn có CHECK (balance >= 0) ở   | [ ] AUDITED |
|     | tầng Schema làm lớp phòng thủ sâu cuối cùng (Defense-in-Depth)?          |             |
+-----+--------------------------------------------------------------------------+-------------+
```

---
*Tài liệu được biên soạn và bảo chứng bởi **Pod 3: Concurrency & Transaction Integrity Engineer** — Database Masterclass Campaign.*
