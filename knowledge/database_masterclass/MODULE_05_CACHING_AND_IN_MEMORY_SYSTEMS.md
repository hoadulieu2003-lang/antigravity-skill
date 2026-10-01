# DATABASE MASTERCLASS — MODULE 05: CACHING & IN-MEMORY SYSTEMS
**Kiến Trúc Bộ Nhớ Đệm, Hệ Thống Lưu Trữ Trong Bộ Nhớ & Tác Chiến Phân Tán Tốc Độ Cao**

---

> **Chủ quản (Owner)**: Anh — Lead Architect / Product Owner  
> **Cộng sự AI (Pair-Programmer)**: Em — Senior Engineering Agent (Pod 5: In-Memory & Caching Systems Specialist)  
> **Trạng thái**: Production Ready — Tiêu Chuẩn Kiến Trúc Cấp Doanh Nghiệp (Enterprise Architectural Standard)  
> **Hệ quy chiếu thuật ngữ**: Song ngữ kỹ thuật bắt buộc `English (Tiếng Việt)`

---

## MỤC LỤC CHIẾN LƯỢC (STRATEGIC TABLE OF CONTENTS)

1. [CHƯƠNG 1: KIẾN TRÚC HỆ THỐNG LƯU TRỮ TRONG BỘ NHỚ (IN-MEMORY ARCHITECTURE)](#chương-1-kiến-trúc-hệ-thống-lưu-trữ-trong-bộ-nhớ-in-memory-architecture)
   - 1.1. Single-Threaded Event Loop (Vòng lặp sự kiện đơn luồng) của Redis vs. Multi-Threaded Engines (Memcached, KeyDB, Dragonfly)
   - 1.2. I/O Multiplexing & Tiến hóa Threaded I/O trong Redis 6.0/7.0
   - 1.3. Cấu trúc dữ liệu nội tại & Phân bổ bộ nhớ (Internal Data Structures & Memory Layouts)
     - `redisObject` Header & Chi phí bộ nhớ ẩn
     - SDS (Simple Dynamic Strings) vs. C-Style Strings
     - Dict / Hash Table & Cơ chế Incremental Rehashing (Tái băm gia tăng)
     - SkipList (Bảng nhảy) trong Sorted Sets (ZSet) vs. Cây Đỏ Đen (Red-Black Tree)
     - Quá trình tiến hóa: ZipList $\to$ QuickList $\to$ ListPack
     - Các kiểu dữ liệu xác suất và đặc biệt: HyperLogLog, Bitmaps, Streams
2. [CHƯƠNG 2: CÁC CHIẾN LƯỢC LƯU BỘ NHỚ ĐỆM (CACHING PATTERNS & STRATEGIES)](#chương-2-các-chiến-lược-lưu-bộ-nhớ-đệm-caching-patterns--strategies)
   - 2.1. Cache-Aside (Lazy Loading / Tải lười)
   - 2.2. Read-Through Cache (Đọc xuyên thấu)
   - 2.3. Write-Through Cache (Ghi xuyên thấu)
   - 2.4. Write-Behind / Write-Back (Ghi trì hoãn bất đồng bộ)
   - 2.5. Refresh-Ahead Cache (Làm mới đón đầu)
   - 2.6. Ma trận quyết định kiến trúc Caching Patterns
3. [CHƯƠNG 3: TÁC CHIẾN PHÒNG THỦ SỰ CỐ CACHE TRÊN SẢN XUẤT (PRODUCTION CACHE PITFALLS & MITIGATIONS)](#chương-3-tác-chiến-phòng-thủ-sự-cố-cache-trên-sản-xuất-production-cache-pitfalls--mitigations)
   - 3.1. Cache Stampede / Thundering Herd (Hiệu ứng dồn dập / Đàn bò giẫm đạp)
     - Giải pháp Mutex Lock (Khóa loại trừ lẫn nhau)
     - Probabilistic Early Expiration (Hết hạn sớm theo xác suất) — Thuật toán XFetch
   - 3.2. Cache Penetration (Xuyên thủng bộ nhớ đệm)
     - Null Value Caching & Tombstone TTL
     - Bloom Filter & Cuckoo Filter: Nguyên lý toán học & Triển khai thực tế
   - 3.3. Cache Avalanche (Sụp đổ tuyết lở)
     - Jittered TTL (Phân tán thời gian sống ngẫu nhiên)
     - Multi-Tiered Resiliency (Phòng thủ đa tầng) & Circuit Breaker (Bộ ngắt mạch)
   - 3.4. Cache Breakdown (Điểm nóng hết hạn / Hotspot Key Invalidation)
     - Logical Expiration (Hết hạn logic) vs. Physical TTL
4. [CHƯƠNG 4: THUẬT TOÁN GIẢI PHÓNG BỘ NHỚ (EVICTION POLICIES & MEMORY GOVERNANCE)](#chương-4-thuật-toán-giải-phóng-bộ-nhớ-eviction-policies--memory-governance)
   - 4.1. Phân loại Eviction Policies trong Redis
   - 4.2. Classical LRU vs. Approximated LRU (LRU xấp xỉ trong Redis)
   - 4.3. LFU (Least Frequently Used) & Logistic Counter Dynamics
   - 4.4. Chu trình thanh lọc TTL: Active Expiration vs. Passive Expiration
5. [CHƯƠNG 5: KHÓA PHÂN TÁN & TÍNH NHẤT QUÁN DỮ LIỆU (DISTRIBUTED LOCKS & DUAL-WRITE CONSISTENCY)](#chương-5-khóa-phân-tán--tính-nhất-quán-dữ-liệu-distributed-locks--dual-write-consistency)
   - 5.1. Khóa phân tán Redlock Protocol & Đại chiến học thuật: Martin Kleppmann vs. Salvatore Sanfilippo (Antirez)
   - 5.2. Giải pháp Fencing Tokens (Thẻ phân xử tăng đơn điệu)
   - 5.3. Bài toán Ghi hai nơi (Dual-Write Problem: DB vs. Cache)
   - 5.4. Kiến trúc giải pháp CDC-based Invalidation (Debezium + Kafka + Redis)
6. [CHƯƠNG 6: SỔ TAY VẬN HÀNH SẢN XUẤT (PRODUCTION ENGINEERING PLAYBOOK)](#chương-6-sổ-tay-vận-hành-sản-xuất-production-engineering-playbook)
   - 6.1. Tinh chỉnh Kernel Linux cho In-Memory Cache Cực Hạn
   - 6.2. File cấu hình chuẩn mẫu `redis.conf` Production Hardened

---

# CHƯƠNG 1: KIẾN TRÚC HỆ THỐNG LƯU TRỮ TRONG BỘ NHỚ (IN-MEMORY ARCHITECTURE)

## 1.1. Single-Threaded Event Loop của Redis vs. Multi-Threaded Engines

Trong thiết kế hệ thống phân tán và lưu trữ dữ liệu, việc lựa chọn mô hình thực thi luồng là một trong những quyết định kiến trúc mang tính cốt lõi. Trong suốt hơn một thập kỷ, Redis trung thành với triết lý **Single-Threaded Event Loop (Vòng lặp sự kiện đơn luồng)**, trong khi các công cụ như Memcached, KeyDB và Dragonfly lại lựa chọn các biến thể **Multi-Threaded (Đa luồng)**.

```
+-----------------------------------------------------------------------------------+
|                        SO SÁNH MÔ HÌNH THỰC THI LUỒNG                             |
+-----------------------------------------------------------------------------------+
|  [Redis Classic (Single-Threaded Reactor)]                                        |
|   Network Socket -> [epoll/kqueue] -> File Event Loop (Single Thread) -> Memory   |
|   (Không Lock, Không Context Switch, Atomic tuyệt đối trên từng Command)          |
+-----------------------------------------------------------------------------------+
|  [Memcached (Multi-Threaded Global/Fine-Grained Locks)]                           |
|   Network Sockets -> Dispatcher Thread -> Worker Threads -> [Item Locks] -> Slab  |
|   (Tận dụng Multi-core, nhưng chịu chi phí Lock Contention khi Hot Key)           |
+-----------------------------------------------------------------------------------+
|  [Dragonfly (Shared-Nothing / Thread-per-Core + io_uring)]                        |
|   Core 0 [Event Loop 0 + Shard 0] | Core 1 [Event Loop 1 + Shard 1] (No Mutex)    |
|   (Thông lượng bứt phá, tận dụng triệt để NUMA & VCache)                          |
+-----------------------------------------------------------------------------------+
```

### Tại sao Salvatore Sanfilippo (Antirez) chọn Single-Threaded cho Redis?

1. **CPU không phải là điểm nghẽn (CPU is rarely the bottleneck)**:
   Đối với các hệ thống In-Memory Cache thuần túy, điểm nghẽn cốt lõi (`Bottleneck`) hầu như luôn nằm ở **Băng thông Mạng (`Network Bandwidth`)** hoặc **Băng thông Bộ nhớ (`Memory Bus Bandwidth`)**, thay vì chu kỳ xung nhịp CPU. Một tiến trình Redis chạy đơn luồng trên CPU x86 hiện đại có thể xử lý dễ dàng từ 100.000 đến 150.000 requests/giây (`OPS`).
2. **Triệt tiêu chi phí Chuyển đổi Ngữ cảnh (Context Switching Elimination)**:
   Khi hàng ngàn luồng (`Threads`) tranh chấp tài nguyên, hệ điều hành phải liên tục lưu trữ và phục hồi thanh ghi (`Registers`), `Program Counter`, và làm mất hiệu lực dòng nhớ đệm CPU (`CPU Cache Line Invalidation - L1/L2/L3 Thrashing`). Single-thread giúp tận dụng tối đa `L1/L2 Cache Locality`.
3. **Tuyệt đối không có Khóa Tranh Chấp (Lock-Free Simplicity)**:
   Không có `Mutex`, `Spinlock`, hay `Read-Write Lock`. Điều này loại bỏ hoàn toàn nguy cơ `Deadlock (Bế tắc)`, `Race Condition (Điều kiện chạy đua)`, và giảm độ trễ biến thiên (`Tail Latency p99/p999`).
4. **Bảo toàn tính Nguyên tử Tự nhiên (Natural Atomicity)**:
   Mọi lệnh thực thi (`SET`, `HSET`, `LPUSH`) cũng như các khối lệnh phức tạp (`MULTI`/`EXEC`, Lua Scripts) đều được đảm bảo nguyên tử hóa (`Atomic`) 100% mà không cần cơ chế phân xử phức tạp.

---

### Bảng So Sánh Đối Đầu: Redis vs. Memcached vs. KeyDB vs. Dragonfly

| Tiêu Chí Kiến Trúc | Redis (7.x / 8.x) | Memcached (1.6+) | KeyDB (Multithreaded) | Dragonfly (Next-Gen) |
| :--- | :--- | :--- | :--- | :--- |
| **Mô hình Xử lý Luồng (Threading Model)** | Single-Threaded Core + Multi-Threaded I/O | Multi-Threaded (Worker Pool + Item Locks) | Multi-Threaded (Shared Shared-Memory Dict) | Thread-per-Core (Shared-Nothing / Lock-Free) |
| **I/O Multiplexing Engine** | `epoll`, `kqueue`, `evport` | `libevent` (`epoll`) | `epoll` tùy biến | Linux `io_uring` + epoll fallback |
| **Cấu trúc Dữ liệu Hỗ trợ** | Đa dạng: String, Hash, List, ZSet, Stream, Bitmap, HLL | Chỉ duy nhất Raw String / Blob | Tương thích 100% Redis API | Tương thích Redis/Memcached API |
| **Quản lý Bộ nhớ (Memory Allocator)** | `jemalloc` / `libc malloc` | `Slab Allocator` (Chống phân mảnh bộ nhớ) | `jemalloc` | `Custom VCache` + Dash Table |
| **Snapshots / Tính Bền Vững (Persistence)** | RDB (`fork()`), AOF, AOF Rewrite | Không có (Thuần Cache RAM) | RDB, AOF, Multi-master replication | Forkless Snapshotting (Không nhân đôi RAM) |
| **Thông lượng Cực đại (Max Throughput)** | ~100K - 300K OPS / node | ~1M+ OPS / multi-core | ~500K - 800K OPS / multi-core | ~3M - 5M OPS / node (Multi-core) |
| **Hiện tượng Spike do Fork()** | Có (Copy-on-Write memory ballooning) | Không | Có | **Hoàn toàn Không (Forkless Engine)** |

---

## 1.2. I/O Multiplexing & Tiến Hóa Threaded I/O trong Redis 6.0/7.0

Mặc dù lõi thực thi lệnh (`Command Execution Engine`) của Redis là đơn luồng, nhưng trong môi trường mạng tốc độ cao (10GbE, 40GbE, 100GbE), việc **Đọc dữ liệu từ Socket mạng (`Socket Read`)**, **Phân tích giao thức (`RESP Parsing`)** và **Ghi trả kết quả xuống Socket (`Socket Write`)** tiêu tốn tới 50% - 60% tổng thời gian xử lý CPU.

### Cơ chế I/O Multiplexing thuần túy (ae.c)

Redis cài đặt thư viện quản lý sự kiện riêng tối giản mang tên `ae.c` (Antirez Event). Nó trừu tượng hóa các API điều khiển I/O Multiplexing của từng hệ điều hành:
* Linux: `epoll` (`ae_epoll.c`)
* BSD / macOS: `kqueue` (`ae_kqueue.c`)
* Solaris: `evport` (`ae_evport.c`)
* POSIX Fallback: `select` (`ae_select.c`)

Vòng lặp sự kiện đăng ký lắng nghe hai nhóm sự kiện:
1. **File Events (`Sự kiện tệp/socket`)**: Nhận diện khi nào socket của client sẵn sàng để đọc (`AE_READABLE`) hoặc ghi (`AE_WRITABLE`).
2. **Time Events (`Sự kiện thời gian`)**: Quản lý các tác vụ nền định kỳ thông qua hàm `serverCron()` (quét dọn key hết hạn, rehash, thu gom thống kê).

### Bước ngoặt Redis 6.0+: Threaded I/O (I/O Đa Luồng)

Nhằm phá vỡ giới hạn băng thông mạng mà không đánh mất tính toàn vẹn nguyên tử của logic nghiệp vụ, Redis 6.0 giới thiệu kiến trúc **Threaded I/O (Multi-Threaded Network I/O)**:

```
[MẠNG CLIENTS]
     │   │   │
     ▼   ▼   ▼ (Đọc đồng thời từ hàng ngàn socket)
+─────────────────────────────────────────────────────────────+
| THREADED I/O WORKERS (Đa luồng đọc/phân tích RESP)         |
|  - Worker Thread 1: Đọc Socket 1..N -> Parse command buffer |
|  - Worker Thread 2: Đọc Socket N..M -> Parse command buffer |
+─────────────────────────────────────────────────────────────+
                             │
                             ▼ (Hàng đợi lệnh đã phân tích xong)
+─────────────────────────────────────────────────────────────+
| MAIN THREAD (LÕI ĐƠN LUỒNG - COMMAND EXECUTION ENGINE)       |
|  - Thực thi tuần tự từng lệnh trên Bộ nhớ RAM (Atomic)     |
|  - Không xảy ra Data Race, Không cần Lock trên Keyspace     |
+─────────────────────────────────────────────────────────────+
                             │
                             ▼ (Đẩy kết quả vào buffer phản hồi)
+─────────────────────────────────────────────────────────────+
| THREADED I/O WORKERS (Đa luồng ghi dữ liệu phản hồi)        |
|  - Worker Thread 1: Encode RESP -> Ghi Socket 1..N          |
|  - Worker Thread 2: Encode RESP -> Ghi Socket N..M          |
+─────────────────────────────────────────────────────────────+
```

* **Quy chuẩn vận hành Threaded I/O**:
  * Các luồng phụ (`I/O Threads`) **chỉ** thực hiện đọc socket, giải mã giao thức RESP (`Protocol Parsing`) và ghi buffer phản hồi xuống socket.
  * Việc truy cập, chỉnh sửa cây dữ liệu trên RAM **chỉ duy nhất Luồng chính (`Main Thread`)** đảm nhiệm.
  * Cấu hình tối ưu trong `redis.conf`:
    ```text
    io-threads 4              # Thường set bằng 75% số CPU cores (ví dụ 4 cores -> 3 hoặc 4 threads)
    io-threads-do-reads yes   # Mặc định Redis chỉ multi-thread cho Writes; bật 'yes' để multi-thread cả Reads
    ```

---

## 1.3. Cấu Trúc Dữ Liệu Nội Tại & Phân Bổ Bộ Nhớ (Internal Data Structures)

Hiệu năng và mức độ tiêu thụ bộ nhớ của Redis phụ thuộc hoàn toàn vào cấu trúc dữ liệu tầng thấp (`C Data Structures`). Hiểu rõ các cấu trúc này là chìa khóa để thiết kế hệ thống tối ưu dung lượng RAM (Memory-Efficient Engineering).

### 1.3.1. `redisObject` Header & Chi Phí Bộ Nhớ Ẩn

Mọi cặp Key-Value trong Redis không bao giờ được lưu trữ như con trỏ thô mà luôn được bao bọc trong một đối tượng chuẩn hóa gọi là `redisObject` (định nghĩa tại `server.h`):

```c
struct redisObject {
    unsigned type:4;       /* Loại kiểu dữ liệu: OBJ_STRING, OBJ_HASH, OBJ_LIST, OBJ_SET, OBJ_ZSET (4 bits) */
    unsigned encoding:4;   /* Cơ chế mã hóa nội tại: OBJ_ENCODING_RAW, OBJ_ENCODING_EMBSTR, v.v. (4 bits) */
    unsigned lru:24;       /* Thông tin LRU (thời gian truy cập cuối) hoặc LFU (tần suất) (24 bits = 3 bytes) */
    int refcount;          /* Số lượng tham chiếu phục vụ Memory Sharing (4 bytes) */
    void *ptr;             /* Con trỏ 64-bit trỏ tới cấu trúc dữ liệu thực tế (8 bytes) */
};
```

* **Phân tích Chi phí Bộ nhớ (`Memory Overhead`)**:
  * $4\text{ bits} + 4\text{ bits} + 24\text{ bits} = 32\text{ bits} = 4\text{ bytes}$.
  * $4\text{ bytes (refcount)} + 8\text{ bytes (ptr)} = 12\text{ bytes}$.
  * **Tổng cộng**: Mỗi `redisObject` tiêu tốn **16 bytes RAM cố định** dù giá trị lưu bên trong chỉ là 1 byte!
  * Ngoài ra, mỗi entry trong bảng băm của Redis (`dictEntry`) tiêu tốn thêm 24-32 bytes (con trỏ `next`, con trỏ `key`, con trỏ `val`). Do đó, việc lưu trữ hàng trăm triệu key nhỏ lẻ dạng `key: "1", val: "a"` sẽ gây lãng phí bộ nhớ khủng khiếp.

---

### 1.3.2. SDS (Simple Dynamic Strings) vs. C-Style Strings

Ngôn ngữ C quy ước chuỗi ký tự kết thúc bằng byte null `\0` (`char*`). Salvatore Sanfilippo đã từ chối sử dụng C-String truyền thống và phát minh ra **SDS (Simple Dynamic String)** vì 4 lý do chí mạng:

1. **Lấy độ dài chuỗi tức thời ($O(1)$ vs $O(N)$)**: C-string phải quét toàn bộ mảng cho đến khi gặp `\0`. SDS lưu độ dài trực tiếp trong trường `len`.
2. **An toàn nhị phân tuyệt đối (`Binary-Safe`)**: C-string không thể lưu trữ các tệp nhị phân, hình ảnh nén, hoặc serialized Protobuf có chứa byte `\0`. SDS dựa vào độ dài `len` chứ không dựa vào `\0`.
3. **Chống Tràn Bộ Đệm (`Buffer Overflow Prevention`)**: SDS tự động kiểm tra dung lượng còn trống (`alloc - len`) trước khi thực hiện nối chuỗi (`sdscat`). Nếu không đủ, nó tự động cấp phát lại bộ nhớ (`realloc`).
4. **Chiến lược Tối ưu hóa Bộ nhớ thông qua SDS Header phân cấp**:
   Redis phân loại SDS thành 5 loại header khác nhau tùy thuộc độ dài chuỗi để tiết kiệm từng byte (`sds.h`):

```c
/* Ví dụ về cấu trúc sdshdr8 dành cho chuỗi dài tối đa 255 bytes */
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len;         /* Độ dài chuỗi hiện tại (1 byte, giá trị 0-255) */
    uint8_t alloc;       /* Tổng dung lượng bộ nhớ đã cấp phát (1 byte) */
    unsigned char flags; /* 3 bits thấp chứa loại SDS (sdshdr5/8/16/32/64) */
    char buf[];          /* Mảng ký tự thực tế + kết thúc bằng '\0' */
};
```
> **Từ khóa `__attribute__ ((__packed__))`**: Yêu cầu trình biên dịch GCC/Clang không chèn byte căn chỉnh lề nhớ (`Memory Alignment Padding`), ép kích thước header đạt mức tối thiểu tuyệt đối.

* **Cơ chế cấp phát trước (Pre-allocation Strategy)**:
  * Nếu chuỗi sau khi mở rộng có kích thước $< 1\text{ MB}$: Redis cấp phát gấp đôi dung lượng cần thiết (`alloc = 2 * len`).
  * Nếu kích thước $\ge 1\text{ MB}$: Redis chỉ cấp phát thêm đúng $1\text{ MB}$ dư thừa để chống lãng phí RAM.
* **Mã hóa `embstr` vs `raw`**:
  * Khi chuỗi String có kích thước $\le 44\text{ bytes}$: Redis dùng mã hóa `embstr`. `redisObject` (16 bytes) và `sdshdr8` + nội dung chuỗi được cấp phát trong **CÙNG MỘT KHỐI BỘ NHỚ LIÊN TỤC** qua 1 lần gọi `malloc(64 bytes)`.
  * Khi $> 44\text{ bytes}$: Redis dùng mã hóa `raw`, tách thành 2 khối bộ nhớ rời rạc (1 cho `redisObject`, 1 cho `sds`), dẫn đến 2 lần gọi `malloc` và tăng độ phân mảnh bộ nhớ (`Memory Fragmentation`).

---

### 1.3.3. Dict / Hash Table & Cơ Chế Incremental Rehashing (Tái Băm Gia Tăng)

Bảng từ điển (`dict`) là xương sống quản trị toàn bộ Keyspace và kiểu dữ liệu Hash/Set trong Redis. Mỗi `dict` chứa hai bảng băm con: `ht[0]` (bảng chính đang sử dụng) và `ht[1]` (bảng phụ phục vụ giãn nở hoặc thu hẹp).

```c
typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];        /* 2 bảng băm phục vụ rehashing */
    long rehashidx;      /* Chỉ số rehash hiện tại. Nếu bằng -1 nghĩa là không rehash */
    int16_t pauserehash; /* Trạng thái tạm dừng rehash */
} dict;
```

#### Thuật toán Incremental Rehashing (Tái băm gia tăng) hoạt động thế nào?

Nếu một bảng băm có 50 triệu keys, việc cấp phát bảng mới và dịch chuyển toàn bộ 50 triệu phần tử trong một lần (`Stop-The-World Rehash`) sẽ làm tê liệt CPU trong hàng trăm mili-giây, dẫn đến timeout toàn bộ hệ thống. Redis giải quyết triệt để vấn đề này bằng cách:

1. Thiết lập `rehashidx = 0`, cấp phát `ht[1]` với dung lượng là lũy thừa của 2 thỏa mãn yêu cầu kích thước mới.
2. **Rehash lồng ghép theo từng tác vụ (`Passive Incremental Rehash`)**: Mỗi khi client gửi bất kỳ lệnh đọc/ghi nào (`GET`, `SET`, `HGET`, `HDEL`), Redis nhân cơ hội đó di chuyển dữ liệu của đúng **1 bucket (hoặc slot)** tại vị trí `rehashidx` từ `ht[0]` sang `ht[1]`, sau đó tăng `rehashidx++`.
3. **Rehash theo thời gian định kỳ (`Active Time-based Rehash`)**: Trong hàm định kỳ `serverCron()`, Redis dành ra tối đa **1 mili-giây** mỗi chu kỳ để chủ động lặp và di chuyển các bucket còn lại sang bảng mới.
4. Khi toàn bộ dữ liệu từ `ht[0]` đã chuyển hết sang `ht[1]`: Redis tráo đổi con trỏ `ht[0] = ht[1]`, giải phóng bộ nhớ của bảng cũ và đặt lại `rehashidx = -1`.

---

### 1.3.4. SkipList (Bảng Nhảy) trong Sorted Sets (ZSet) vs. Cây Đỏ Đen (Red-Black Tree)

Sorted Set (`ZSet`) trong Redis duy trì các phần tử được sắp xếp theo điểm số (`score`). Cấu trúc nền tảng của nó là sự kết hợp giữa **Bảng băm (`dict`)** và **Bảng nhảy (`SkipList - zskiplist`)**.

```
[Level 3] ─────────────────────────────> [Node 7 (Score 90)] ───────────────> NIL
[Level 2] ───────────> [Node 3 (Score 40)] ──> [Node 7 (Score 90)] ───────────────> NIL
[Level 1] ──> [Node 1] ─> [Node 3 (Score 40)] ──> [Node 5 (Score 75)] ──> [Node 7] ─> NIL
               (Score 10)
```

* **Tại sao Antirez chọn SkipList thay vì Cây Đỏ Đen (Red-Black Tree / AVL Tree)?**
  1. **Hiệu năng Truy vấn theo Dải (`Range Queries`)**: Với các lệnh như `ZRANGEBYSCORE` hoặc `ZREVRANGEBYSCORE`, sau khi tìm thấy node đầu tiên qua tìm kiếm nhị phân $O(\log N)$, SkipList chỉ cần duyệt tuyến tính qua con trỏ xuôi (`forward pointer`) ở tầng 0. Cây Đỏ Đen đòi hỏi phép duyệt trung thứ tự (`In-order traversal`) phức tạp và tiêu tốn nhiều bước nhảy bộ nhớ.
  2. **Dễ dàng cài đặt và tối ưu hóa**: Cây Đỏ Đen yêu cầu các phép xoay cây (`Tree Rotations`) cực kỳ phức tạp để tái cân bằng khi chèn hoặc xóa node, tiềm ẩn rủi ro lỗi phần mềm. SkipList duy trì cấu trúc cân bằng thông qua xác suất ngẫu nhiên (`Probabilistic Balancing`).
  3. **Khả năng phân đoạn (Span) phục vụ Rank $O(\log N)$**: Mỗi con trỏ cấp độ trong SkipList của Redis được gắn kèm thuộc tính `span` (số lượng node mà con trỏ nhảy qua). Nhờ vậy, lệnh tìm kiếm thứ hạng `ZRANK` và `ZREVRANK` đạt độ phức tạp $O(\log N)$ tuyệt đối.

---

### 1.3.5. Tiến Hóa Cấu Trúc Nén: ZipList $\to$ QuickList $\to$ ListPack

Khi lưu trữ các danh sách (`List`), bảng băm (`Hash`), hoặc Sorted Set có kích thước nhỏ, việc dùng danh sách liên kết đôi (`Linked List`) truyền thống sẽ gây lãng phí bộ nhớ cực lớn do hai con trỏ `prev` và `next` (tiêu tốn $2 \times 8 = 16\text{ bytes}$ cho mỗi phần tử, chưa kể lề nhớ và metadata).

#### 1. ZipList (Danh sách nén liền khối)
ZipList là một mảng byte liên tục trong bộ nhớ RAM:
`[zlbytes (4B)] [zltail (4B)] [zllen (2B)] [entry 1] [entry 2] ... [entry N] [zlend (1B)]`
* Mỗi `entry` chứa: `prevrawlen` (độ dài entry đứng trước), `encoding`, và `content`.
* **Lỗ hổng chí mạng: Hiệu ứng Cập nhật Xếp tầng (Cascading Updates)**:
  Nếu một loạt entry có kích thước mấp mé 254 bytes. Khi chèn một phần tử lớn hơn vào đầu, `prevrawlen` của phần tử kế tiếp phải giãn nở từ 1 byte lên 5 bytes. Sự gia tăng 4 bytes này lại khiến phần tử kế tiếp vượt ngưỡng 254 bytes, kích hoạt phản ứng dây chuyền tái cấp phát toàn bộ mảng với độ phức tạp tồi tệ nhất lên tới $O(N^2)$.

#### 2. QuickList (Redis 3.2+)
Kết hợp Danh sách liên kết đôi và ZipList. QuickList là một Linked List mà trong đó **mỗi Node là một ZipList**. Điều này khống chế độ dài của ZipList trong giới hạn an toàn (ví dụ 8KB), hạn chế phạm vi của hiện tượng Cascading Updates.

#### 3. ListPack (Redis 5.0+ thử nghiệm, Redis 7.0+ thay thế hoàn toàn ZipList)
ListPack được thiết kế bởi Salvatore Sanfilippo để **triệt tiêu vĩnh viễn Cascading Updates**:
* Cấu trúc mỗi `entry` trong ListPack:
  `[encoding-type] [element-data] [element-tot-len]`
* Khác biệt bản chất: ListPack **không lưu độ dài của phần tử phía trước (`prevlen`)**, mà lưu độ dài của **chính phần tử đó ở cuối mỗi entry (`element-tot-len`)**.
* Khi cần duyệt ngược (`Backwards Traversal`), Redis chỉ việc đọc `element-tot-len` ở cuối entry hiện tại để tính toán bước nhảy về đầu entry trước đó. Không còn `prevlen` $\implies$ Hoàn toàn triệt tiêu Cascading Updates.

---

### 1.3.6. Các Kiểu Dữ Liệu Chuyên Biệt: HyperLogLog, Bitmaps, Streams

```
+────────────────────────────────────────────────────────────────────────────────────────+
| KIỂU DỮ LIỆU | CƠ CHẾ NỘI TẠI                   | BỘ NHỚ TIÊU THỤ     | ĐỘ PHỨC TẠP    |
+────────────────────────────────────────────────────────────────────────────────────────+
| HyperLogLog  | 16,384 thanh ghi x 6 bits        | Cố định ~12 KB      | O(1) Add/Count |
| Bitmaps      | Thao tác bit trên SDS String     | 1 bit / 1 boolean   | O(1) Get/Set   |
| Streams      | Radix Tree (Rax) + ListPack Node | Co giãn theo lượng tin| O(1) Append    |
+────────────────────────────────────────────────────────────────────────────────────────+
```

* **HyperLogLog**:
  * Thuật toán xác suất đếm số lượng phần tử duy nhất (`Cardinality Estimation` / Unique Visitors - UV).
  * Thay vì lưu toàn bộ chuỗi UserID (tiêu tốn gigabytes), HyperLogLog băm giá trị và quan sát vị trí xuất hiện của bit `1` đầu tiên từ phải sang trái.
  * Sai số chuẩn: $\text{Error} \approx \frac{1.04}{\sqrt{m}} = \frac{1.04}{\sqrt{16384}} \approx 0.81\%$.
  * Dung lượng: Cố định tối đa **12KB** để đếm từ 1 người dùng đến hàng tỷ người dùng.
* **Bitmaps**:
  * Không phải kiểu dữ liệu độc lập mà là các toán tử thao tác bit (`SETBIT`, `GETBIT`, `BITCOUNT`, `BITOP`) trên chuỗi SDS String.
  * Phục vụ theo dõi trạng thái điểm danh, hoạt động người dùng theo ngày: 100 triệu người dùng chỉ tiêu tốn:
    $$\frac{100,000,000\text{ bits}}{8 \times 1024 \times 1024} \approx 11.92\text{ MB RAM}$$
* **Streams (Nhật ký tuần tự Append-Only)**:
  * Được lưu trữ dưới dạng cây **Radix Tree (Rax Tree)** kết hợp các node ListPack nén.
  * Hỗ trợ đầy đủ ngữ nghĩa của hàng đợi tin nhắn hiện đại: `Consumer Groups`, `XACK (Xác nhận tin)`, `PEL (Pending Entries List - Danh sách tin chờ xử lý)` nhằm giải quyết các bài toán phân tán tương tự Apache Kafka ở quy mô siêu nhẹ.

---

# CHƯƠNG 2: CÁC CHIẾN LƯỢC LƯU BỘ NHỚ ĐỆM (CACHING PATTERNS & STRATEGIES)

Trong kiến trúc hệ thống phân tán, việc lựa chọn chiến lược nạp và đẩy dữ liệu giữa Bộ nhớ đệm (`Cache Layer`) và Cơ sở dữ liệu gốc (`Persistent Store`) quyết định trực tiếp đến tính nhất quán, độ trễ và khả năng phục hồi của ứng dụng.

```
+---------------------------------------------------------------------------------------+
|                              CACHING PATTERNS OVERVIEW                                |
+---------------------------------------------------------------------------------------+
| 1. Cache-Aside  : App tự quản lý (App -> Cache Miss -> App -> DB -> App -> Cache)   |
| 2. Read-Through : App chỉ gọi Cache Proxy -> Cache Proxy tự tải DB khi Miss           |
| 3. Write-Through: App ghi Cache -> Cache ghi đồng bộ xuống DB                         |
| 4. Write-Behind : App ghi Cache -> Cache phản hồi ngay -> Flush bất đồng bộ xuống DB |
| 5. Refresh-Ahead: Background Thread tự động nạp lại Cache trước khi Key hết hạn TTL   |
+---------------------------------------------------------------------------------------+
```

---

## 2.1. Cache-Aside (Lazy Loading / Tải Lười)

Đây là mẫu hình phổ biến và linh hoạt nhất trong các kiến trúc Microservices và Web Applications. Ứng dụng điều phối trực tiếp luồng dữ liệu giữa Cache và Database.

### Sơ đồ luồng dữ liệu (Data Flow)

```
[LUỒNG ĐỌC - READ PATH]
Client ──(1) Get User ──> Application ──(2) Check Key ──> [ REDIS CACHE ]
                                │                               │
                                │ (Cache Miss)                  │ (Cache Hit)
                                ▼                               ▼
                         [ DATABASE ] <──── Fetch Data ──── Return Value
                                │
                                └───(3) Set Key + TTL ──> [ REDIS CACHE ]

[LUỒNG GHI - WRITE PATH]
Client ──(1) Update ────> Application ──(2) Write Data ─> [ DATABASE ]
                                │
                                └───(3) DEL Key ────────> [ REDIS CACHE ]
```

* **Tại sao trong luồng Ghi phải XÓA (`Invalidate/DEL`) Cache mà không CẬP NHẬT (`Update/SET`)?**
  1. **Tránh lãng phí tài nguyên tính toán**: Nếu một key có chi phí tính toán phức tạp (Aggregated Query, Join nhiều bảng) nhưng sau khi cập nhật lại không có ai đọc đến, việc tính toán để update cache là lãng phí. Xóa cache giúp đảm bảo dữ liệu chỉ được tính toán lại khi có request đọc thực tế (`Lazy Loading`).
  2. **Ngăn chặn Race Condition (Điều kiện chạy đua luồng ghi)**:
     Xét 2 luồng ghi đồng thời: Luồng A và Luồng B.
     * Thứ tự mong muốn: Luồng A ghi DB $\to$ Luồng B ghi DB.
     * Nhưng do độ trễ mạng: Luồng B ghi Cache trước $\to$ Luồng A ghi Cache sau.
     * Kết quả: Database mang giá trị của B, nhưng Cache mang giá trị của A $\implies$ **Dữ liệu trong Cache bị bẩn vĩnh viễn (Stale Data)** cho đến khi hết hạn TTL! Nếu dùng lệnh xóa (`DEL`), cả hai luồng đều xóa cache, triệt tiêu nguy cơ này.

---

## 2.2. Read-Through Cache (Đọc Xuyên Thấu)

Trong mô hình Read-Through, ứng dụng coi Cache là kho lưu trữ dữ liệu chính duy nhất. Ứng dụng không duy trì logic kết nối cơ sở dữ liệu để fallback khi miss. Thay vào đó, lớp Cache Provider (ví dụ AWS DynamoDB Accelerator - DAX, NCache, Hazelcast) tự chịu trách nhiệm kết nối xuống DB để nạp dữ liệu.

* **Ưu điểm**:
  * Tách rời hoàn toàn mã nguồn nghiệp vụ khỏi logic caching (`Separation of Concerns`).
  * Tránh lặp lại mã nguồn kiểm tra cache miss ở hàng trăm microservices khác nhau.
* **Nhược điểm**:
  * Mô hình dữ liệu trong Cache bắt buộc phải tương thích 1-1 với mô hình bảng biểu trong DB, rất khó lưu trữ các đối tượng dữ liệu đã qua xử lý tổng hợp đa nguồn (`Aggregated DTOs`).

---

## 2.3. Write-Through Cache (Ghi Xuyên Thấu)

Khi có thao tác cập nhật dữ liệu, ứng dụng gửi lệnh ghi đến lớp Cache. Cache lập tức ghi đồng bộ (`Synchronously`) xuống Database. Khi cả hai tầng ghi thành công, Cache mới trả kết quả thành công về cho ứng dụng.

```
Application ──(1) Write Data──> [ CACHE LAYER ]
                                       │
                                       └──(2) Synchronous Write──> [ DATABASE ]
```

* **Ưu điểm**:
  * Dữ liệu trong Cache luôn luôn tươi mới và đồng nhất tuyệt đối với Database.
  * Không bao giờ xảy ra tình trạng Cache Miss ngay sau khi vừa thực hiện ghi dữ liệu.
* **Nhược điểm**:
  * **Độ trễ ghi tăng gấp đôi (`High Write Latency`)**: Ứng dụng phải chờ tổng thời gian hoàn tất của cả 2 thao tác ghi (RAM latency + Disk I/O latency).
  * **Lãng phí bộ nhớ (`Cache Pollution`)**: Nhiều bản ghi được ghi xuống DB nhưng không bao giờ được truy vấn lại, làm tràn bộ nhớ và đẩy các key nóng khác ra ngoài (`Premature Eviction`).

---

## 2.4. Write-Behind / Write-Back (Ghi Trì Hoãn Bất Đồng Bộ)

Trong mô hình Write-Behind, ứng dụng ghi dữ liệu vào Cache và nhận được phản hồi thành công ngay lập tức ($<1\text{ ms}$). Cache gom các bản ghi vào một hàng đợi nội bộ (`Memory Queue`) và định kỳ xả mẻ (`Batch Asynchronous Flush`) xuống Database.

* **Ưu điểm**:
  * **Thông lượng ghi vô song (`Ultra-High Write Throughput`)**: Phù hợp tuyệt đối cho các hệ thống đếm lượt xem (View Counts), trạng thái sensor IoT, telemetry thời gian thực, bảng xếp hạng game.
  * **Giảm tải triệt để cho Database**: Hàng ngàn thao tác tăng số đếm `INCR key` trong 1 giây được gom lại thành 1 lệnh duy nhất: `UPDATE counters SET val = val + 1000 WHERE id = 1`.
* **Rủi ro chí mạng**:
  * **Mất mát dữ liệu (`Data Loss`)**: Nếu node Cache bị mất điện đột ngột hoặc sập OS trước khi kịp flush dữ liệu xuống đĩa, toàn bộ dữ liệu trong hàng đợi RAM sẽ bốc hơi vĩnh viễn.

---

## 2.5. Refresh-Ahead Cache (Làm Mới Đón Đầu)

Mô hình này theo dõi hành vi truy cập của người dùng. Nếu một key được truy cập thường xuyên và thời gian sống còn lại của nó giảm xuống dưới một ngưỡng xác định (ví dụ còn 20% TTL), hệ thống sẽ ngầm khởi chạy một tiến trình nền (`Background Asynchronous Worker`) để truy vấn DB và làm mới dữ liệu trong Cache trước khi nó kịp hết hạn.

* **Ưu điểm**:
  * Triệt tiêu hoàn toàn độ trễ Cache Miss cho các đối tượng dữ liệu hot.
* **Nhược điểm**:
  * Nếu thuật toán dự đoán không chính xác, hệ thống sẽ liên tục làm mới những key không còn ai quan tâm, gây lãng phí tài nguyên CPU và kết nối DB.

---

## 2.6. Ma Trận Quyết Định Kiến Trúc Caching Patterns

| Tiêu Chí | Cache-Aside | Read-Through | Write-Through | Write-Behind | Refresh-Ahead |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Độ phức tạp tích hợp** | Thấp (Mã nguồn tự quản lý) | Trung bình (Yêu cầu Provider) | Trung bình | Rất cao (Quản lý hàng đợi flush) | Cao (Thuật toán theo dõi truy cập) |
| **Độ trễ Ghi (Write Latency)** | Thấp | Thấp | Cao (Ghi đồng bộ cả 2) | Cực thấp ($<1\text{ ms}$) | Không áp dụng |
| **Độ trễ Đọc (Read Latency)** | Thấp khi Hit, Cao khi Miss | Thấp khi Hit, Cao khi Miss | Luôn cực thấp | Luôn cực thấp | Luôn cực thấp (Gần như không Miss) |
| **Mức độ Nhất quán Dữ liệu** | Trung bình (Chấp nhận Eventual) | Cao | Rất cao | Thấp (Eventual Consistency trễ) | Cao |
| **Nguy cơ Mất dữ liệu** | Không | Không | Không | **Rất cao (Khi Cache Crash)** | Không |
| **Trường hợp Sử dụng Tối ưu** | Đọc nhiều/Ghi ít, Web, E-commerce | Doanh nghiệp chuẩn hóa Data Layer | Giao dịch tài chính, Profile user | IoT, Gaming Leaderboard, Metrics | Bảng tin tức lớn, Hot Products |

---

# CHƯƠNG 3: TÁC CHIẾN PHÒNG THỦ SỰ CỐ CACHE TRÊN SẢN XUẤT (PRODUCTION CACHE PITFALLS & MITIGATIONS)

Khi vận hành hệ thống ở quy mô lớn, các sự cố liên quan đến bộ nhớ đệm có thể làm tê liệt toàn bộ hạ tầng cơ sở dữ liệu chỉ trong vài giây. Đây là 4 đại nạn kinh điển và các giải pháp phòng thủ cấp độ quân sự.

```
+───────────────────────────────────────────────────────────────────────────────────────+
|                           4 ĐẠI NẠN CACHE TRÊN SẢN XUẤT                               |
+───────────────────────────────────────────────────────────────────────────────────────+
| 1. Cache Stampede  : 1 hoặc nhiều Key nóng hết hạn -> Hàng vạn request đánh sập DB    |
| 2. Cache Penetration: Truy vấn Key KHÔNG TỒN TẠI -> Request chọc thẳng xuống DB       |
| 3. Cache Avalanche : Toàn bộ Cache Cluster sập HOẶC vạn Key hết hạn cùng thời điểm   |
| 4. Cache Breakdown : Đúng 1 Key SIÊU NÓNG hết hạn đột ngột                            |
+───────────────────────────────────────────────────────────────────────────────────────+
```

---

## 3.1. Cache Stampede / Thundering Herd (Hiệu Ứng Dồn Dập)

Hiện tượng xảy ra khi một tập hợp key có lượng truy cập cực lớn đột ngột hết hạn TTL. Hàng chục ngàn luồng truy vấn đồng thời nhận về kết quả Cache Miss và cùng lúc lao xuống Database để thực thi các truy vấn nặng, làm cạn kiệt Connection Pool và khiến DB sập do quá tải CPU.

### Giải pháp 1: Khóa Loại Trừ Lẫn Nhau (Mutex Lock / Singleflight Pattern)

Chỉ cho phép **DUY NHẤT MỘT** luồng thực thi truy vấn cơ sở dữ liệu và nạp cache. Tất cả các luồng khác phải chờ đợi hoặc nhận dữ liệu tạm thời.

```go
// Triển khai Mutex Lock sử dụng Redis SET NX PX trong Go
func GetDataWithMutex(ctx context.Context, rdb *redis.Client, db *sql.DB, key string) (string, error) {
    val, err := rdb.Get(ctx, key).Result()
    if err == nil {
        return val, nil // Cache Hit
    }

    lockKey := "lock:" + key
    lockTTL := 5 * time.Second

    // Cố gắng chiếm Lock với cờ NX (Not Exists) và TTL an toàn
    acquired, err := rdb.SetNX(ctx, lockKey, "1", lockTTL).Result()
    if err != nil {
        return "", err
    }

    if acquired {
        // Luồng chiến thắng chiếm được Lock: Chịu trách nhiệm query DB
        defer rdb.Del(ctx, lockKey)

        dataFromDB := queryDatabase(db, key)
        rdb.Set(ctx, key, dataFromDB, 30*time.Minute)
        return dataFromDB, nil
    } else {
        // Luồng thua cuộc: Tạm ngủ 50ms rồi thử đọc lại từ Cache
        time.Sleep(50 * time.Millisecond)
        return GetDataWithMutex(ctx, rdb, db, key)
    }
}
```

---

### Giải pháp 2: Thuật Toán Xác Suất Hết Hạn Sớm (Probabilistic Early Expiration — XFetch Algorithm)

Thuật toán XFetch (được công bố trong bài báo nghiên cứu *"Optimal Probabilistic Cache Stampede Prevention"* của Vattani et al., Đại học Columbia) là giải pháp tối thượng không cần dùng Lock phân tán.

#### Công thức Toán học Cốt lõi:
Client sẽ chủ động tính toán lại dữ liệu và nạp vào Cache TRƯỚC khi key thực sự hết hạn nếu biểu thức sau thỏa mãn:

$$-\beta \times \Delta \times \ln(\text{rand}()) > \text{TTL}_{\text{remaining}}$$

Trong đó:
* $\Delta$ (`delta`): Thời gian thực tế tiêu tốn để tính toán/truy vấn dữ liệu từ DB (tính bằng giây).
* $\beta$ (`beta`): Hệ số điều chỉnh độ xông xáo (mặc định $\beta = 1.0$). Khi $\beta > 1$, việc tính toán lại diễn ra sớm hơn.
* $\text{rand}()$: Giá trị phân phối ngẫu nhiên đều trong khoảng $(0, 1]$. Do $\ln(\text{rand}())$ luôn âm, $-\ln(\text{rand}())$ luôn dương với phân phối mũ (`Exponential Distribution`).
* $\text{TTL}_{\text{remaining}}$: Thời gian sống thực tế còn lại của key trong Cache.

```
Xác suất tính toán lại (Recompute Probability)
100% ^                                                 /
     |                                                /
     |                                              /
     |                                           /
     |                                        /
     |                             __________/
  0% +────────────────────────────+──────────────────> Thời gian (Time)
     Key vừa tạo                  Tiệm cận TTL         TTL = 0
```

#### Triển khai Thuật toán XFetch bằng Python chuẩn Production:

```python
import time
import math
import random
import json

def xfetch_read(redis_client, db_conn, key, ttl=1800, beta=1.0):
    """
    Triển khai thuật toán XFetch phòng ngừa Cache Stampede
    Value trong Redis được lưu dưới dạng JSON: {"data": ..., "delta": ..., "expire_at": ...}
    """
    raw_data = redis_client.get(key)
    now = time.time()
    
    if raw_data:
        payload = json.loads(raw_data)
        value = payload["data"]
        delta = payload["delta"]
        expire_at = payload["expire_at"]
        
        # Kiểm tra điều kiện ngẫu nhiên sớm: - beta * delta * ln(rand) > TTL_remaining
        time_to_live = expire_at - now
        if time_to_live > 0:
            probabilistic_threshold = -beta * delta * math.log(random.random())
            if probabilistic_threshold <= time_to_live:
                return value # Cache Hit hợp lệ, chưa cần tính toán lại
            
            # Nếu vượt ngưỡng, tiến hành tính toán lại ngay trong luồng này
            # (Xác suất đồng thời rơi vào nhiều client là cực kỳ thấp)

    # Thực hiện truy vấn DB và đo lường thời gian delta
    start_time = time.time()
    fresh_data = db_conn.query_expensive_data(key)
    delta = time.time() - start_time
    
    # Lưu vào Redis với metadata phục vụ XFetch
    payload = {
        "data": fresh_data,
        "delta": delta,
        "expire_at": now + ttl
    }
    redis_client.setex(key, ttl, json.dumps(payload))
    return fresh_data
```

---

## 3.2. Cache Penetration (Xuyên Thủng Bộ Nhớ Đệm)

Hiện tượng xảy ra khi hacker hoặc các bot độc hại liên tục gửi các truy vấn với các khóa **hoàn toàn không tồn tại** trong cả Cache lẫn Database (ví dụ: `GET /users/-9999999` hoặc quét UUID ngẫu nhiên). Vì dữ liệu không có trong Cache, toàn bộ request bị xuyên thủng và đánh thẳng xuống Database.

### Giải pháp 1: Null Value Caching (Lưu Trữ Giá Trị Rỗng / Tombstone)

Khi DB trả về kết quả rỗng (`Record Not Found`), ứng dụng lập tức lưu một giá trị đại diện rỗng (`"NULL"` hoặc `"{}"`) vào Cache với **TTL cực ngắn (30 đến 60 giây)**.
* **Hạn chế**: Nếu kẻ tấn công liên tục sinh ra hàng triệu key ngẫu nhiên khác nhau không trùng lặp, bộ nhớ Redis sẽ bị làm rác bởi hàng triệu key rỗng này.

---

### Giải pháp 2: Bloom Filter (Bộ Lọc Bloom) & Cuckoo Filter

Bloom Filter là cấu trúc dữ liệu xác suất tối ưu không gian (`Space-Efficient Probabilistic Data Structure`) dùng để kiểm tra xem một phần tử có thuộc một tập hợp hay không.

```
                         [ MẢNG BIT CỦA BLOOM FILTER ]
                     Index: 0  1  2  3  4  5  6  7  8  9
                           [0][1][0][1][0][0][1][0][1][0]
                               ▲        ▲           ▲
                               │        │           │
       Hash 1("user_101") ─────┘        │           │
       Hash 2("user_101") ──────────────┘           │
       Hash 3("user_101") ──────────────────────────┘
```

#### Định lý Bất Biến của Bloom Filter:
1. Nếu Bloom Filter trả về **FALSE**: Phần tử đó **CHẮC CHẮN 100% KHÔNG TỒN TẠI** trong hệ thống. Request bị chặn đứng ngay lập tức, không cho phép chạm tới DB!
2. Nếu Bloom Filter trả về **TRUE**: Phần tử đó **CÓ THỂ** tồn tại trong hệ thống (Tồn tại một tỷ lệ dương tính giả nhỏ - `False Positive Rate`).

#### Công thức Toán học Xác định Kích thước và Hàm Băm:
Với số lượng phần tử dự kiến $n$ và tỷ lệ dương tính giả mong muốn $p$:
* Dung lượng mảng bit $m$:
  $$m = -\frac{n \times \ln(p)}{(\ln 2)^2}$$
* Số lượng hàm băm tối ưu $k$:
  $$k = \frac{m}{n} \times \ln 2$$

*Ví dụ thực tế*: Với $10,000,000$ users và tỷ lệ sai số $p = 0.01$ (1%):
Cần mảng bit $m \approx 95,850,583\text{ bits} \approx 11.42\text{ MB RAM}$ và $k = 7$ hàm băm độc lập. Một con số siêu nhỏ để bảo vệ toàn diện 10 triệu bản ghi!

* **Cuckoo Filter vs. Bloom Filter**:
  * Bloom Filter **không thể xóa** phần tử đã thêm vào (trừ khi dùng Counting Bloom Filter tiêu tốn gấp 4 lần RAM).
  * Cuckoo Filter (dựa trên thuật toán Cuckoo Hashing) hỗ trợ **xóa phần tử động (`Dynamic Deletion`)** và cho thông lượng tìm kiếm tốt hơn khi tỷ lệ lấp đầy cao.

---

## 3.3. Cache Avalanche (Sụp Đổ Tuyết Lở)

Sự cố kinh hoàng này xảy ra khi một lượng khổng lồ các key trong Cache được cài đặt **cùng một thời gian hết hạn TTL** và đồng loạt biến mất tại cùng một thời điểm, HOẶC toàn bộ cụm node Cache bị sập đột ngột (Network Partition / OOM Crash). Toàn bộ lưu lượng truy cập khổng lồ chuyển hướng trực tiếp xuống DB, gây sập đổ toàn bộ hệ thống như tuyết lở.

```
[ BÌNH THƯỜNG ]
100,000 Req/s ───> [ REDIS CACHE ] (99% Hit) ───> 1,000 Req/s ───> [ DATABASE ] (Khỏe mạnh)

[ TUYẾT LỞ - TOÀN BỘ KEYS CÙNG HẾT HẠN LÚC 00:00:00 ]
100,000 Req/s ───> [ REDIS CACHE ] (0% Hit)   ───> 100,000 Req/s ──> [ DATABASE ] (CRASH NGAY LẬP TỨC!)
```

### Giải pháp 1: Jittered TTL (Phân Tán Thời Gian Sống Ngẫu Nhiên)

Tuyệt đối không bao giờ cấu hình TTL cứng (ví dụ `EXPIRE key 86400`). Bắt buộc phải cộng thêm một độ lệch ngẫu nhiên (`Random Entropy / Jitter`):

```python
import random

def calculate_jittered_ttl(base_ttl_seconds=3600, jitter_percentage=0.2):
    """
    Tạo TTL có độ lệch ngẫu nhiên: Ví dụ Base = 3600s, Jitter = 20%
    Kết quả trả về nằm trong dải: [2880s, 4320s]
    """
    min_ttl = int(base_ttl_seconds * (1 - jitter_percentage))
    max_ttl = int(base_ttl_seconds * (1 + jitter_percentage))
    return random.randint(min_ttl, max_ttl)
```

### Giải pháp 2: Multi-Tier Caching & Circuit Breaker

```
Client ──> [ L1 CACHE: In-Memory Local (Caffeine/Ristretto) ] (~100 Nanoseconds)
                  │ (Miss)
                  ▼
           [ L2 CACHE: Distributed Redis Cluster ] (~1 Millisecond)
                  │ (Miss)
                  ▼
           [ CIRCUIT BREAKER (Resilience4j / Envoy) ]
                  │ (Đóng mạch: Cho phép truy vấn)
                  ▼
           [ DATABASE (RDBMS / Sharded DB) ] (~10-50 Milliseconds)
```

Khi Database bị nghẽn, Circuit Breaker lập tức chuyển trạng thái sang `OPEN (Hở mạch)`, ngắt hoàn toàn các kết nối xuống DB và lập tức trả về dữ liệu dự phòng (`Fallback / Degraded Response`) hoặc thông báo hệ thống bận, bảo vệ DB không bị chết hẳn.

---

## 3.4. Cache Breakdown (Điểm Nóng Hết Hạn / Hotspot Key Invalidation)

Khác với Cache Avalanche (xảy ra trên diện rộng với hàng vạn key), Cache Breakdown tập trung vào **ĐÚNG MỘT KEY DUY NHẤT** nhưng có lưu lượng truy cập siêu khổng lồ (ví dụ: Thông tin về chương trình Flash Sale iPhone giá 1$, tin tức nóng về sự kiện thế giới). Khi key này hết hạn, hàng trăm nghìn request đổ dồn vào đúng 1 bản ghi DB.

### Giải pháp: Logical Expiration (Hết Hạn Logic)

Trong Redis, key được cấu hình **KHÔNG BAO GIỜ HẾT HẠN VỀ MẶT VẬT LÝ (`TTL = Infinity` hoặc không set EXPIRE)**. Thay vào đó, thời gian hết hạn được nhúng thẳng vào cấu trúc dữ liệu JSON (`Logical Expiration Timestamp`).

```
Request ──> Check Logical Expire
                 │
                 ├── [ Chưa hết hạn ] ──────────> Trả dữ liệu ngay
                 │
                 └── [ Đã hết hạn logic ] ──────> (1) Trả NGAY dữ liệu cũ (Stale Data)
                                                  (2) Spawn Goroutine / Background Thread
                                                          │
                                                          ▼
                                                  Lấy Lock -> Update DB -> Update Cache
```

* **Ưu điểm**: Người dùng không bao giờ phải chịu độ trễ chờ đợi truy vấn DB. Dữ liệu cũ được trả về ngay lập tức, trong khi dữ liệu mới được âm thầm cập nhật ở chế độ nền.

---

# CHƯƠNG 4: THUẬT TOÁN GIẢI PHÓNG BỘ NHỚ (EVICTION POLICIES & MEMORY GOVERNANCE)

Khi dung lượng bộ nhớ sử dụng của Redis chạm ngưỡng cấu hình `maxmemory`, hệ thống bắt buộc phải giải phóng dữ liệu theo một chính sách định sẵn để lấy chỗ cho dữ liệu mới.

## 4.1. Phân Loại Eviction Policies trong Redis

Redis hỗ trợ 8 chính sách thanh lọc bộ nhớ chính:

```
                          CÁC CHÍNH SÁCH MAXMEMORY-POLICY
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
[ ÁP DỤNG TRÊN TẤT CẢ KEYS ]                            [ CHỈ ÁP DỤNG TRÊN KEYS CÓ TTL ]
- allkeys-lru   : Xóa key ít dùng gần đây nhất           - volatile-lru   : Xóa key có TTL ít dùng gần đây
- allkeys-lfu   : Xóa key tần suất dùng thấp nhất        - volatile-lfu   : Xóa key có TTL tần suất thấp
- allkeys-random: Xóa ngẫu nhiên bất kỳ key nào          - volatile-random: Xóa ngẫu nhiên key có TTL
                                                        - volatile-ttl   : Xóa key có thời gian sống ngắn nhất
        ▼
[ NOEVICTION ] (Mặc định): Không xóa gì cả, trả lỗi OOM cho mọi lệnh ghi mới (ngoại trừ lệnh đọc DEL/GET)
```

---

## 4.2. Classical LRU vs. Approximated LRU (LRU Xấp Xỉ trong Redis)

### Thuật toán Classical LRU (LRU Lý Thuyết)
Cài đặt kinh điển sử dụng **Bảng băm (`Hash Map`) kết hợp Danh sách liên kết đôi (`Doubly Linked List`)**:
* Khi một key được đọc hoặc ghi: Di chuyển node đó lên đầu danh sách $O(1)$.
* Khi cần giải phóng bộ nhớ: Xóa node ở đuôi danh sách $O(1)$.
* **Tại sao Redis từ chối Classical LRU?**
  1. Chi phí bộ nhớ: Mỗi node phải lưu 2 con trỏ 64-bit (`prev` và `next`), tiêu tốn thêm 16 bytes RAM cho mỗi key. Với 100 triệu key, chi phí này là $1.6\text{ GB RAM}$ chỉ để duy trì danh sách liên kết!
  2. Tranh chấp khóa: Trong môi trường đa luồng hoặc khi cập nhật liên tục, việc dịch chuyển node trong linked list gây lock contention và phân mảnh bộ nhớ nghiêm trọng.

---

### Approximated LRU (Thuật Toán LRU Xấp Xỉ của Redis)

Redis tiếp cận bài toán theo góc nhìn kỹ thuật thực dụng: **Lấy mẫu ngẫu nhiên (`Random Sampling`)**:

```
[ TOÀN BỘ KEYSPACE ] ── Lấy mẫu ngẫu nhiên N keys ──> [ CANDIDATE POOL (16 slots) ]
                                                                 │
                                                       Sắp xếp theo Idle Time
                                                                 │
                                                                 ▼
                                                       Xóa Key có Idle Time lớn nhất
```

1. Mỗi `redisObject` chứa trường `lru:24` lưu giữ timestamp thời điểm truy cập cuối cùng (độ phân giải 1 giây).
2. Khi bộ nhớ vượt ngưỡng `maxmemory`, Redis không duyệt toàn bộ keyspace mà chỉ bốc ngẫu nhiên $N$ keys (cấu hình qua `maxmemory-samples`, mặc định là 5).
3. Đưa các key này vào một **Hồ bơi ứng viên (`Eviction Pool`)** có kích thước cố định 16 phần tử, luôn được sắp xếp theo thời gian không hoạt động (`Idle Time`).
4. Key nào có thời gian không hoạt động lớn nhất ở đầu pool sẽ bị tiêu diệt (`Evicted`).

```
KẾT QUẢ THỬ NGHIỆM ĐỘ CHÍNH XÁC CỦA APPROXIMATED LRU SO VỚI TRUE LRU:
- Với maxmemory-samples = 5 : Đạt độ chính xác xấp xỉ 85% so với True LRU lý thuyết.
- Với maxmemory-samples = 10: Đạt độ chính xác >98%, đường cong loại bỏ gần như trùng khít với True LRU
                              nhưng chi phí CPU vẫn cực thấp và tốn 0 byte chi phí con trỏ liên kết!
```

---

## 4.3. LFU (Least Frequently Used) & Logistic Counter Dynamics

Ra mắt từ Redis 4.0, LFU giải quyết nhược điểm của LRU: Một key vốn dĩ rất hiếm khi được dùng, nhưng vừa được truy cập 1 giây trước, sẽ không bị LRU xóa; trong khi một key được truy cập hàng triệu lần trong quá khứ nhưng tạm nghỉ vài phút lại bị LRU tiêu diệt.

Redis tận dụng chính **24 bits** của trường `lru` trong `redisObject` để chia thành 2 trường thông tin:

```
+──────────────────────────┬──────────────────────────+
| LDT: Last Decrement Time | LOG_C: Logistic Counter  |
|         (16 bits)        |         (8 bits)         |
+──────────────────────────┴──────────────────────────+
```

1. **LDT (16 bits)**: Lưu timestamp thời gian giảm counter lần cuối (độ phân giải theo phút).
2. **LOG_C (8 bits)**: Bộ đếm tần suất truy cập logarit (Giá trị chỉ từ 0 đến 255).

### Cơ chế Tăng Bộ Đếm Logarit (Counter Increment)
Bộ đếm không tăng tuyến tính $1, 2, 3...$ (vì 8 bits chỉ đếm được tối đa 255). Thay vào đó, nó tăng theo **xác suất nghịch đảo**:

$$P = \frac{1}{\text{LOG\_C} \times \text{lfu-log-factor} + 1}$$

Khi counter càng lớn, xác suất để nó được tăng thêm 1 đơn vị càng nhỏ. Nhờ vậy, chỉ với 8 bits, LOG_C có thể đại diện cho hàng triệu lượt truy cập!

### Cơ chế Suy Giảm Tự Động Theo Thời Gian (Decay Time)
Nếu một key cực hot trong quá khứ nhưng hiện tại không còn ai đọc, bộ đếm LOG_C phải tự động giảm dần. Khi một key được truy cập, Redis tính toán khoảng thời gian đã trôi qua kể từ `LDT` và trừ điểm của `LOG_C` dựa trên thông số cấu hình:
`lfu-decay-time` (tính bằng phút). Nếu `lfu-decay-time = 1`, mỗi phút không được truy cập, `LOG_C` sẽ bị giảm đi 1 đơn vị.

---

## 4.4. Chu Trình Thanh Lọc TTL: Active Expiration vs. Passive Expiration

Redis áp dụng chiến thuật song kiếm hợp bích để giải phóng các key đã hết hạn thời gian sống (`Expired Keys`):

1. **Passive Expiration (Thanh lọc thụ động / Lazy Invalidation)**:
   Khi client gửi request truy vấn một key (`GET key`), Redis kiểm tra timestamp hết hạn. Nếu đã quá hạn, Redis lập tức xóa key đó, giải phóng RAM và trả kết quả `NIL` về cho client.
2. **Active Expiration (Thanh lọc chủ động / Periodic Daemon Cycle)**:
   Nếu hàng triệu key hết hạn nhưng không có client nào gửi lệnh truy vấn đến chúng, cơ chế Passive sẽ bị vô hiệu hóa. Do đó, hàm `serverCron()` kích hoạt chu trình quét định kỳ (10 lần/giây):
   * Bốc ngẫu nhiên 20 keys có cài đặt TTL từ từ điển `expires`.
   * Xóa tất cả các key đã hết hạn trong số 20 keys này.
   * **Quy tắc phanh khẩn cấp**: Nếu số key hết hạn vượt quá **25%** (nghĩa là $> 5$ keys trong mẫu 20 keys), Redis sẽ lặp lại vòng quét ngay lập tức vì nhận định bộ nhớ đang chứa quá nhiều rác cần dọn dẹp khẩn cấp. Để không làm treo hệ thống, tổng thời gian của vòng lặp này bị giới hạn cứng không vượt quá **25 mili-giây**.

---

# CHƯƠNG 5: KHÓA PHÂN TÁN & TÍNH NHẤT QUÁN DỮ LIỆU (DISTRIBUTED LOCKS & DUAL-WRITE CONSISTENCY)

## 5.1. Khóa Phân Tán Redlock Protocol & Đại Chiến Học Thuật

Khóa phân tán (`Distributed Lock`) là cơ chế sống còn để đảm bảo chỉ duy nhất một tiến trình được thực thi tài nguyên quan trọng trong hệ thống phân tán.

### Thuật toán Redlock của Antirez (Salvatore Sanfilippo)
Để tránh điểm sập duy nhất (`Single Point of Failure - SPOF`) khi Redis Master sập mà chưa kịp nhân bản lock sang Replica, Antirez đề xuất Redlock hoạt động trên $N$ node Redis Master hoàn toàn độc lập (thường $N=5$):

```
Client ─── Thử chiếm lock đồng thời trên 5 Master độc lập ───> [Node 1] [Node 2] [Node 3] [Node 4] [Node 5]
                 │
                 ▼
Điều kiện chiếm Lock thành công:
1. Chiếm được tối thiểu quá bán: (N / 2 + 1) nodes (>= 3 / 5 nodes).
2. Tổng thời gian chiếm lock < Lock Validity Time (Độ trôi đồng hồ không vượt ngưỡng).
```

---

### Cuộc Phản Biện Chấn Động của Martin Kleppmann ("How to do distributed locking")

Chuyên gia hệ thống phân tán Martin Kleppmann (Tác giả cuốn sách kinh điển *Designing Data-Intensive Applications*) đã công bố bài viết chỉ ra rằng **Redlock không an toàn cho cả hai mục đích: Hiệu năng lẫn Tính đúng đắn tuyệt đối**.

```
[ KỊCH BẢN CHÍ MẠNG DO STOP-THE-WORLD GC PAUSE / PROCESS PAUSE ]

Client 1                     Redis Masters                   Storage / DB
   │                               │                              │
   ├──(1) Chiếm Lock thành công───>│                              │
   │   (Valid 10s trên 3/5 nodes)  │                              │
   │                               │                              │
   ├──[ GC PAUSE 15 GIÂY! ]────────┼──────────────────────────────┤
   │  (Client 1 bị đơ hoàn toàn)   │                              │
   │                               ├──(2) Lock hết hạn trên Redis │
   │                               │      Client 2 xin chiếm Lock │
   │                               │<──Client 2 lấy Lock mới──────┤
   │                               │                              ├──(3) Client 2 ghi DB
   ├──[ Tỉnh dậy sau GC Pause ]────┼──────────────────────────────┤
   │  (Nghĩ mình vẫn còn Lock!)    │                              │
   └──(4) Ghi đè dữ liệu lên DB────┼─────────────────────────────>├── GHI ĐÈ / CORRUPT DATA!
```

Martin Kleppmann chứng minh rằng trong mô hình mạng bất đồng bộ (`Asynchronous Network`), hệ thống phải đối mặt với:
1. **Dừng tiến trình không dự đoán được (`Process Pauses / Stop-The-World GC`)**.
2. **Độ trễ mạng mất kiểm soát (`Packet Delays`)**.
3. **Hiện tượng nhảy vọt đồng hồ vật lý (`Clock Drift / NTP Jumps`)**.

Do đó, không một thuật toán khóa nào dựa trên thời gian thực (`Physical Time`) có thể đảm bảo tính an toàn nếu tầng lưu trữ phía dưới không có cơ chế tự bảo vệ!

---

## 5.2. Giải Pháp Fencing Tokens (Thẻ Phân Xử Tăng Đơn Điệu)

Martin Kleppmann khẳng định: Nếu cần tính đúng đắn tuyệt đối (`Safety/Correctness`), hệ thống bắt buộc phải sử dụng **Fencing Tokens**:

```
Client 1 ──> Lấy Lock ──> Được cấp Token: 33 (STW Pause...)
Client 2 ──> Lấy Lock ──> Được cấp Token: 34 ──> Ghi DB với Token 34 ──> DB chấp nhận (Current Max: 34)

Client 1 ──> Tỉnh dậy sau Pause ──> Gửi lệnh ghi kèm Token 33 xuống DB
                                                │
                                                ▼
                                   [ DATABASE PHÂN XỬ ]
                   "Token 33 < Current Max 34 -> TỪ CHỐI GHI NGAY LẬP TỨC!"
```

* **Kết luận kỹ thuật**:
  * Nếu dùng Lock để tối ưu hiệu năng (chống trùng lặp công việc, gửi email 2 lần): Dùng Redis đơn lẻ hoặc Redlock là đủ tốt, chi phí rẻ, tốc độ cao.
  * Nếu dùng Lock cho an toàn tài chính, tính đúng đắn dữ liệu: Bắt buộc dùng hệ đồng thuận mạnh dựa trên Paxos/Raft (như **etcd**, **Apache ZooKeeper**) kết hợp kiểm tra **Fencing Tokens** ở tầng Database.

---

## 5.3. Bài Toán Ghi Hai Nơi (Dual-Write Problem: DB vs. Cache)

Khi có một thao tác cập nhật dữ liệu, ứng dụng phải sửa đổi ở cả hai nơi: Cơ sở dữ liệu (`Database`) và Bộ nhớ đệm (`Cache`). Vì không thể thực thi giao dịch phân tán 2 pha (`2-Phase Commit - 2PC`) giữa RDBMS và NoSQL Cache do hiệu năng quá kém, các tình huống tranh chấp dữ liệu kinh điển sẽ xảy ra:

```
[ TRANH CHẤP TRONG MÔ HÌNH: UPDATE DB TRƯỚC -> UPDATE CACHE SAU ]

Thread A ──────(1) Update DB = 10 ─────────────────────────────────────────┐
Thread B ─────────────────────────(2) Update DB = 20 ──(3) Update Cache = 20│
Thread A ──────────────────────────────────────────────────────────────────┴─(4) Update Cache = 10!

KẾT QUẢ: Database lưu giá trị mới (20), nhưng Cache lưu giá trị cũ (10) -> BẤT ĐỒNG BỘ VĨNH VIỄN!
```

```
[ TRANH CHẤP TRONG MÔ HÌNH: XÓA CACHE TRƯỚC -> UPDATE DB SAU ]

Thread A (Ghi) ──(1) Xóa Cache ──────────────(3) Update DB = 20 ─────────────┐
Thread B (Đọc) ───────────────(2) Cache Miss!                               │
                              Đọc DB (giá trị cũ = 10)                      │
                              Nạp Cache = 10 ───────────────────────────────┘

KẾT QUẢ: Cache lại bị nạp giá trị cũ (10) trong khi DB đã cập nhật thành công (20)!
```

### Phương án Tối ưu Cấp Ứng dụng: Cache-Aside Chuẩn (Ghi DB Trước $\to$ Xóa Cache Sau)
Tại sao mô hình này an toàn nhất trong các giải pháp thuần code ứng dụng?
Vì về mặt vật lý, **tốc độ ghi một bản ghi xuống đĩa trong Database (vài mili-giây)** chậm hơn rất nhiều so với **tốc độ đọc bản ghi từ Database (vài micro-giây)**. Xác suất để một luồng đọc chen ngang vào giữa khoảnh khắc DB vừa ghi xong và trước khi lệnh `DEL cache` kịp phát ra là cực kỳ hiếm hoi. Tuy nhiên, nếu lệnh `DEL cache` bị lỗi mạng giữa chừng, rủi ro stale data vẫn còn hiện hữu!

---

## 5.4. Kiến Trúc Giải Pháp CDC-Based Invalidation (Debezium + Kafka + Redis)

Để triệt tiêu hoàn toàn sự phụ thuộc vào logic ứng dụng và giải quyết triệt để Dual-Write Problem, các tập đoàn công nghệ hàng đầu áp dụng kiến trúc **Change Data Capture (CDC)**:

```
                  KIẾN TRÚC THOÁT LY GHI HAI NƠI (CDC ARCHITECTURE)
                  
Application ──(1) Ghi dữ liệu DUY NHẤT một nơi──> [ DATABASE (PostgreSQL / MySQL) ]
                                                            │
                                              Ghi nhật ký thay đổi nội bộ
                                                            │
                                                            ▼
                                              [ TRANSACTION LOG (WAL / Binlog) ]
                                                            │
                                        Lắng nghe streaming từng byte thay đổi
                                                            │
                                                            ▼
                                              [ DEBEZIUM CONNECTOR ]
                                                            │
                                            Xuất message sự kiện thay đổi
                                                            │
                                                            ▼
                                              [ APACHE KAFKA CLUSTER ]
                                                            │
                                            Phân phối sự kiện tin cậy
                                                            │
                                                            ▼
                                              [ CACHE INVALIDATION WORKER ]
                                                            │
                                            Thực thi lệnh DEL Key an toàn
                                                            │
                                                            ▼
                                              [ REDIS CACHE CLUSTER ]
```

### Tại sao CDC là Tiêu chuẩn Vàng (Gold Standard)?
1. **Nguồn Chân Lý Duy Nhất (`Single Source of Truth`)**: Ứng dụng chỉ ghi vào DB. Nếu DB commit thành công $\to$ Dữ liệu chắc chắn được ghi. Nếu DB rollback $\to$ Không có gì xảy ra.
2. **Không có Race Condition**: Các thay đổi trong Transaction Log (`WAL/Binlog`) được sắp xếp theo thứ tự thời gian tuần tự tuyệt đối (`Monotonically Sequenced by LSN / Log Sequence Number`).
3. **Độ Bền Vững Tuyệt Đối (`At-Least-Once Delivery`)**: Nếu Redis tạm thời mất kết nối hoặc Invalidation Worker bị crash, tin nhắn xóa cache vẫn được giữ an toàn trên Kafka. Khi worker sống lại, nó tiếp tục tiêu thụ tin nhắn và xóa cache, đảm bảo tính nhất quán cuối cùng (`Eventual Consistency`).

---

# CHƯƠNG 6: SỔ TAY VẬN HÀNH SẢN XUẤT (PRODUCTION ENGINEERING PLAYBOOK)

Để đạt được hiệu năng hàng trăm ngàn OPS với độ trễ dưới 1 mili-giây, việc cấu hình Redis tách rời khỏi việc tinh chỉnh Nhân Linux (`Kernel Tuning`) là một sai lầm chết người.

## 6.1. Tinh Chỉnh Kernel Linux cho In-Memory Cache Cực Hạn

Cấu hình trực tiếp trong tệp `/etc/sysctl.conf` trên các máy chủ chạy In-Memory Database:

```ini
# 1. Cho phép phân bổ bộ nhớ vượt ngưỡng (Overcommit Memory)
# Tránh lỗi fork() thất bại khi chạy BGSAVE hoặc BGREWRITEAOF dù máy chủ vẫn còn RAM trống.
vm.overcommit_memory = 1

# 2. Mở rộng hàng đợi kết nối Socket TCP (TCP Backlog & SOMAXCONN)
# Mặc định Linux chỉ cho phép hàng đợi 128 kết nối, gây drop packet khi có bùng nổ lưu lượng.
net.core.somaxconn = 65535

# 3. Kích hoạt tái sử dụng TCP Time-Wait Sockets cho các kết nối nội bộ
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# 4. Mở rộng dải Local Port phục vụ hàng chục ngàn kết nối đồng thời
net.ipv4.ip_local_port_range = 1024 65535

# 5. Tắt hoàn toàn việc hoán đổi RAM sang Đĩa (Swappiness)
# Tránh tình trạng hệ điều hành đẩy các trang nhớ của Redis xuống Swap disk gây đơ hệ thống
vm.swappiness = 1
```

> [!CRITICAL]
> **VÔ HIỆU HÓA TRANSPARENT HUGE PAGES (THP)**  
> Tính năng Transparent Huge Pages của Linux gộp các trang nhớ 4KB thành 2MB để giảm tải TLB. Tuy nhiên, khi Redis thực hiện `fork()` để snapshot dữ liệu, cơ chế Copy-on-Write (CoW) của Linux sẽ buộc phải sao chép toàn bộ khối 2MB mỗi khi chỉ có 1 byte thay đổi, dẫn đến mức tiêu thụ RAM tăng vọt gấp hàng chục lần và gây spike độ trễ p99!  
> Lệnh tắt THP vĩnh viễn:
> ```bash
> echo never > /sys/kernel/mm/transparent_hugepage/enabled
> echo never > /sys/kernel/mm/transparent_hugepage/defrag
> ```

---

## 6.2. File Cấu Hình Chuẩn Mẫu `redis.conf` Production Hardened

Bản cấu hình mẫu được tối ưu hóa cho môi trường chịu tải cao với bộ nhớ 16GB RAM:

```text
################################## BẢO MẬT & MẠNG ##################################
bind 0.0.0.0
port 6379
protected-mode yes
requirepass "Chon_Mat_Khau_Sieu_Manh_Toi_Thieu_32_Ky_Tu_Random"
tcp-backlog 65535
timeout 0
tcp-keepalive 300

################################## THREADED I/O ####################################
# Cấu hình cho máy chủ 8 Cores (Dành 4-6 threads cho Network I/O)
io-threads 4
io-threads-do-reads yes

################################## BỘ NHỚ & THANH LỌC ###############################
# Đặt giới hạn bộ nhớ tối đa (thường chiếm 75% tổng RAM của máy chủ để chừa RAM cho fork CoW)
maxmemory 12gb
maxmemory-policy allkeys-lru
maxmemory-samples 10

# Tối ưu hóa bộ nhớ cho kiểu dữ liệu nhỏ (ListPack & Hash)
hash-max-listpack-entries 512
hash-max-listpack-value 64
zset-max-listpack-entries 128
zset-max-listpack-value 64

################################## TÍNH BỀN VỮNG (PERSISTENCE) #####################
# Tắt chế độ Snapshot RDB tự động nếu chỉ dùng làm thuần Cache
save ""

# Hoặc nếu cần lưu trữ dữ liệu an toàn (AOF kết hợp RDB Preamble):
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite yes
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-use-rdb-preamble yes

################################## LAZY FREEING (GIẢI PHÓNG BỘ NHỚ BẤT ĐỒNG BỘ) ######
# Đẩy việc xóa các key khổng lồ (BigKeys) sang luồng phụ nền để không chặn Event Loop
lazyfree-lazy-eviction yes
lazyfree-lazy-expire yes
lazyfree-lazy-server-del yes
replica-lazy-flush yes

################################## GIÁM SÁT ĐỘ TRỄ (LATENCY MONITOR) ################
slowlog-log-slower-than 10000     # Ghi lại các lệnh thực thi chậm hơn 10 mili-giây (10,000 microseconds)
slowlog-max-len 1024
latency-monitor-threshold 20      # Cảnh báo các sự kiện gây trễ trên 20 mili-giây
```

---

## 6.3. Bảng Kiểm Tra Sẵn Sàng Vận Hành Sản Xuất (Production Readiness Checklist)

- [x] **Tránh BigKeys**: Đảm bảo không có key nào chứa quá 5,000 phần tử hoặc dung lượng vượt quá $1\text{ MB}$. Quét định kỳ bằng lệnh `redis-cli --bigkeys` hoặc `redis-cli --memkeys`.
- [x] **Vô hiệu hóa các lệnh nguy hiểm**: Đổi tên hoặc block hoàn toàn `FLUSHALL`, `FLUSHDB`, `KEYS *`, `CONFIG`, `EVAL` không kiểm soát thông qua chỉ thị `rename-command` trong `redis.conf`.
- [x] **Cấu hình Connection Pooling**: Luôn thiết lập giới hạn `max_active`, `max_idle`, `idle_timeout` phía Client SDK (Jedis, Lettuce, go-redis) để triệt tiêu chi phí bắt tay TCP Three-Way Handshake.
- [x] **Thiết lập Giám sát Tỷ lệ Trúng Cache (`Cache Hit Ratio`)**:
  $$\text{Hit Ratio} = \frac{\text{keyspace\_hits}}{\text{keyspace\_hits} + \text{keyspace\_misses}} \times 100\%$$
  Nếu tỷ lệ này giảm xuống dưới **80%**, hệ thống đang gặp sự cố về thiết kế TTL, Cache Penetration, hoặc dung lượng Maxmemory không đủ.
- [x] **Phòng ngừa OOM Killer**: Không bao giờ set `maxmemory` bằng 100% dung lượng RAM thực của máy chủ. Luôn dự trữ tối thiểu 20-25% RAM vật lý cho OS buffer cache, redis-server heap, và chi phí nhân bản trang nhớ CoW khi background rewrite AOF/RDB.

---
*Tài liệu được biên soạn độc quyền bởi Pod 5: In-Memory & Caching Systems Specialist thuộc Chiến dịch Database Masterclass.*
