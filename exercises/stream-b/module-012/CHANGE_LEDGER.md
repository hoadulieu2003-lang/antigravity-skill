# CHANGE LEDGER: DESIGN_TRAINING_MODULE_012 (TRIPFLOW)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng kiến trúc (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm nghiệp vụ (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)`  
> **Cơ quan thẩm định (Authority)**: `ChatGPT Controller — Stream B`  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: `Anh — Lead Architect / Product Owner`  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: `Em — Senior Engineering Agent / Lead Implementer`  
> **Tác tử thi công (Implementer)**: `worker_p0_p1_replace`  
> **Không gian làm việc (Workspace)**: `design-training/stream-b/module-012/`  
> **Trạng thái giai đoạn (Phase Status)**: `PHASE_0_INTEGRITY_SETUP & PHASE_1_BRAND_REASONING`  

---

## 1. Bảng Đối Soát Mã Băm Căn Bản (Source & Baseline Hash Ledger)

### 1.1. Mã băm các tài liệu pháp lý đầu vào & Bản kế thừa đóng băng (Authoritative Input Hashes)

Tất cả các tệp tài liệu đầu vào và tập tin nén đóng băng từ Module 07 đã được tính toán mã băm SHA-256 thực tế bằng lệnh `Get-FileHash -Algorithm SHA256` và đối chiếu nghiêm ngặt với đặc tả tại `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md` và `ORIGINAL_REQUEST.md`:

| Tên tập tin (File Path) | Dung lượng (Bytes) | Mã băm SHA-256 đo đạc thực tế (Measured Checksum) | Kỳ vọng thẩm quyền (Directive / Request) | Trạng thái đối soát (Verification Verdict) |
| :--- | :--- | :--- | :--- | :--- |
| `source_snapshot/design_training_007_submission_r04.zip` | 1,855,556 | `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76` | `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76` | **100% KHỚP TỪNG BYTE (EXACT MATCH)** |
| `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md` | 32,095 | `8f6cc77d13ac3ce376ad7d429bf7f1f6340dc8c57ee1c7785dd8d970a8f35dbb` | `8f6cc77d13ac3ce376ad7d429bf7f1f6340dc8c57ee1c7785dd8d970a8f35dbb` | **100% KHỚP TỪNG BYTE (EXACT MATCH)** |
| `ORIGINAL_REQUEST.md` | 5,574 | `78689ddccb63b72d4f7d6b30be919bc63f9b1044e3efa518c22f25d1d375cfce` | `78689ddccb63b72d4f7d6b30be919bc63f9b1044e3efa518c22f25d1d375cfce` | **100% KHỚP TỪNG BYTE (EXACT MATCH)** |

### 1.2. Danh mục & Mã băm các thành phần cốt lõi bên trong bản đóng băng Module 07 (Snapshot Internal Inventory)

Khảo sát luồng nén bộ nhớ (In-memory ZIP inspection) xác nhận 26 mục (14 tệp văn bản/hợp đồng/mã nguồn và 12 ảnh chụp màn hình chứng cứ DPR=2). Các tập tin cốt lõi kế thừa bao gồm:

| Đường dẫn trong ZIP (ZIP Relative Path) | Dung lượng (Bytes) | Mã băm SHA-256 (Checksum) | Vai trò kế thừa kiến trúc (Architectural Heritage Role) |
| :--- | :--- | :--- | :--- |
| `baseline/index.html` | 32,042 | `d7725c3129303aaf375b457f246c215281da718cb008b68931dc001b429c5004` | Điểm xuất phát thô ban đầu của Module 07 |
| `directions/option_a.html` | 9,969 | `7ec5170396f7e889194002c979a1da828dccc723a034dbe08de5e7d32703e3df` | Bản mẫu Hướng A (Dispatch Ledger) M07 |
| `directions/option_b.html` | 7,684 | `5b42961802b88309b16d32cd57e4c72a7bbfeceab85497b2a9c25543f432e372` | Bản mẫu Hướng B (Operational Radar) M07 |
| `candidate/pre_critique.html` | 37,722 | `0e68156a2f38bf14c8dde210ef96b363d5681900d83837684cf55931be3e655a` | Ứng viên trước phản biện M07 |
| `candidate/index.html` | 38,024 | `ee5294b94f37e2b4945743ab3215af238dde9e3b97af10a357872c1a85506800` | **Bản nộp PASS chính thức Module 07 (Candidate Final)** |
| `DESIGN_CONTRACT.yaml` | 3,879 | `0f1ff7f2e3f415f1ee0cd1f81040164567525ea7b8ec109ad5fc3caffabbc503` | Hợp đồng thiết kế (Design Contract) M07 |
| `DESIGN_TRAINING_007_DIRECTIVE.md` | 25,334 | `0840d95724643b730237444005d20a6097d98ec72bc0b40441e1ee6e8064d7d7` | Chỉ thị đào tạo Module 07 gốc |
| `DESIGN_TRAINING_007_REPORT.md` | 29,263 | `a2735ab50f60e98797b214eccd93c7b717caffac0fe168963404bfb7e157fb6d` | Báo cáo nghiệm thu Module 07 |
| `DESIGN_TRAINING_007_FINAL_REVIEW_003.md` | 13,368 | `b4cc8704b6fb019262caeb922b2d6b7840ac1e0037dee98393d2a80c0d62fc07` | Biên bản phê duyệt thẩm quyền tối cao R04 |
| `VERIFICATION.json` | 21,009 | `966e3cea3078b921eccab80e1c8a7ca2c76ee9faa411a5cd0855f14b777fb5c6` | Bằng chứng kiểm thử tự động Module 07 PASS (14/14 tests) |
| `verify_module_007.js` | 70,412 | `c3d9a7331bd926e21584a2823c8d59fbca3f5ab2370517dcf783a2bd03e8c3db` | Bộ test tự động 14 tiêu chí của Module 07 |

---

## 2. Cam Kết Cô Lập Không Gian Làm Việc (Workspace Isolation Affirmation)

1. **Phân định ranh giới tuyệt đối (Strict Boundary Enforcement)**:
   - Toàn bộ các thao tác tạo lập tệp, đọc mã nguồn, biên soạn chiến lược và xây dựng tài nguyên phục vụ Module 12 đều chỉ diễn ra bên trong không gian làm việc được phân định:
     `design-training/stream-b/module-012/`
   - **Cam kết không xâm phạm (Zero Cross-Stream Access)**: Tuyệt đối không đọc, không ghi, không sửa đổi, không tham chiếu bất kỳ tệp tin nào thuộc `stream-a/` (ví dụ: `design-training/exercises/stream-a/`).
2. **Kiểm tra tự động (Automated Verification Check)**:
   - Kết quả quét kiểm tra tìm chuỗi `stream-a` trên toàn bộ cây thư mục mã nguồn và tài liệu của Module 12 xác nhận 0 đường dẫn runtime, 0 import script, 0 liên kết tương đối vi phạm. Chuỗi `stream-a` chỉ tồn tại trong các điều khoản cấm đoán và ghi nhận cam kết cô lập.

---

## 3. Khóa Dữ Liệu Nghiệp Vụ Chuẩn Mục (Canonical Data Lock T01–T08)

Toàn bộ dữ liệu 8 tour được đóng băng nguyên trạng từ Mục 4.6 của `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`.

- **Mốc thời gian quy chiếu cố định (Fixed Anchor Timestamp)**:  
  👉 **`13/09/2026 — 18:00, Asia/Ho_Chi_Minh`** (18:00 ICT)

- **Bảng 8 tour chuẩn mục bất biến (Canonical 8-Tour Snapshot)**:

| Mã (ID) | Tên Tour (Tour Title) | Giờ Khởi Hành (Departure) | Phụ Trách (Assignee) | Trạng Thái (Status) | Vấn Đề / Ghi Chú (Issues / Notes) | Phân Loại Luồng (Workflow Group) & Mức Ưu Tiên (Priority) |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **T01** | **Hạ Long 2N1Đ** | **14/09/2026 07:30** | **Lan** | **Chờ đối tác** | **Khách sạn chưa xác nhận 4 phòng** | **Tâm điểm khẩn cấp (Focal Point)**; Cần xử lý (`groupAction: true`), Khởi hành <24h (`group48h: true`), Ưu tiên số 1 |
| **T02** | Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách | Sẵn sàng (`groupReady: true`), Khởi hành <24h (`group48h: true`) |
| **T03** | Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD | Cần xử lý (`groupAction: true`), Khởi hành >48h |
| **T04** | Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn | Đang chuẩn bị (`groupPrep: true`) |
| **T05** | Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành | Sẵn sàng (`groupReady: true`) |
| **T06** | Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận | Cần xử lý (`groupAction: true`) |
| **T07** | Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng | Đang chuẩn bị (`groupPrep: true`) |
| **T08** | Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký | Đã hoàn thành (`groupDone: true`, khởi hành trong quá khứ) |

### 3.1. Ràng buộc bất biến về nội dung (Content Invariants)
1. **Tour T01 là trọng tâm duy nhất (Single Urgent Focal Tour)**: Thời gian từ mốc quy chiếu (18:00 ngày 13/09) tới giờ khởi hành (07:30 ngày 14/09) là đúng 13 giờ 30 phút. Khách sạn chưa xác nhận 4 phòng là điểm nghẽn nghiêm trọng nhất cần giải quyết ngay.
2. **Nhân vật phụ trách Lan là nhân vật giả lập (Fictional Authored Persona)**: Mọi biểu đạt về Lan phải được gắn nhãn minh bạch, không được mạo danh nhân sự có thật hay dùng ảnh cá nhân ngoài đời.
3. **Tuyệt đối không bịa đặt số liệu (Anti-Fabrication Policy)**: Không tự ý sáng tác doanh thu, chỉ số tăng trưởng phần trăm, giải thưởng lữ hành, hay đưa logo thương hiệu đối tác thực tế vào giao diện.

---

## 4. Các Ranh Giới Kỹ Thuật Bất Biến (Invariant Boundaries)

1. **Zero-Motion Mandate (Chính sách Khóa Chuyển động Tuyệt đối)**:
   - `animation: 0s` và `transition: 0s` trên 100% phần tử DOM.
   - Cấm tuyệt đối `keyframes`, `transition-duration > 0s`, `parallax`, `scroll-linked effects`, `3D perspective transforms`, và video/gif tự động chạy.
2. **Mandatory Light Theme Default (Giao diện Sáng Mặc định Tối cao)**:
   - Mặc định 100% giao diện sáng (Light Theme).
   - Nền canvas sáng nhã nhặn (`#FAF9F6` hoặc `#F8FAFC`), bề mặt thẻ trắng sáng (`#FFFFFF`), chữ chính tương phản cao (`#0F172A` hoặc `#1E293B`).
   - Cấm giao diện tối / phòng chỉ huy quân sự (Dark Command Center / Terminal).
3. **B2B Operational Identity Invariant (Công cụ Điều phối B2B Chuẩn mực)**:
   - Không biến đổi sản phẩm thành landing page bán lẻ tour du lịch, không dùng ảnh phong cảnh du lịch brochure thương mại hào nhoáng.
4. **Accessible Contrast & Touch Targets (Khả năng Tiếp cận Chuẩn W3C / WCAG 2.2 AA)**:
   - Tương phản màu văn bản tối thiểu 4.5:1.
   - Không dùng màu sắc làm kênh duy nhất để truyền tải thông tin trạng thái.
   - Vùng tương tác cảm ứng tối thiểu 44×44 CSS px.

---

## 5. Nhật Ký Biến Đổi & Tiến Trình Theo Giai Đoạn (Evolutionary Stage Log)

### Giai đoạn M0 — Khảo sát Toàn vẹn & Thiết lập Không gian (Setup & Baseline Integrity)
- **Thời gian**: 2026-09-14T01:35:00Z — 2026-09-14T01:43:00Z.
- **Thực hiện**:
  - `explorer_m0_integrity`: Kiểm tra mã băm SHA-256 của `source_snapshot/design_training_007_submission_r04.zip` (`e76ab08f4d1e...`), `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md` (`8f6cc77d...`), `ORIGINAL_REQUEST.md` (`78689ddc...`). Kết quả: Khớp 100%.
  - Quét kiểm tra cô lập không gian làm việc: 0 tham chiếu `stream-a`.
  - Khởi tạo `PROJECT.md`: Cấu trúc phân mốc M0–M3, danh mục tính năng FEAT-01 đến FEAT-22, hợp đồng kỹ thuật và sơ đồ thư mục.
  - Xóa bỏ các tệp nháp tạm thời ở thư mục gốc (`build_all_deliverables.py`, `test_here.py`).
  - Khởi tạo `CHANGE_LEDGER.md` ghi nhận đầy đủ sổ cái và bảng mã băm.

### Giai đoạn M1 — Chiến lược Thương hiệu & Hình ảnh (Brand Reasoning Deliverables)
- **Thời gian**: 2026-09-14T01:43:00Z — Tiếp diễn.
- **Mục tiêu**:
  - `BRAND_THESIS.md`: Đối tượng B2B, lời hứa thương hiệu, 4 personality seeds, 4 anti-personalities, 2 thesis statements (80–140 words: Dir A 106 words, Dir B 108 words), bảng 8 visual decision mappings.
  - `REFERENCE_BOARD.md`: Đúng 8 tham chiếu chuẩn quốc tế phân tích sâu đủ 5 trường bắt buộc.
  - `IMAGE_LANGUAGE_MATRIX.md`: 6 vai trò tài sản x 10 thuộc tính quy tắc, crop 3 viewports, fallback & accessibility.
  - `TEST_MATRIX_DRAFT.md`: Khung kiểm thử tự động 14 tests T01–T14 và 8 blocking gates B01–B08.

### Giai đoạn M2 — Nguyên Mẫu Phân Kỳ Hai Hướng (Two-Direction Prototypes & Checkpoint 12.1)
- **Thực hiện R01**:
  - Xây dựng `directions/option_a/index.html` (Human Field Intelligence).
  - Xây dựng `directions/option_b/index.html` (Route Signal System).
  - Khởi tạo hệ thống tài nguyên tự thân `assets/` và `assets/ASSET_MANIFEST.yaml` (14 vector assets).
  - Xuất bản `CHECKPOINT_12_1.yaml` và đóng gói `design_training_012_checkpoint_12_1_r01.zip`.
- **Thực hiện R02 (Khắc phục toàn diện 12 Blockers F01–F12 theo DESIGN_TRAINING_012_CHECKPOINT_REVIEW_002.md)**:
  - **F01**: Giải trừ triệt để phong cách command-center ở Direction B: Xóa telemetry-rail, system codes (`CRIT_NODE`, `STATUS_FLAG`, `SYS_CORRIDOR`, `FAULT_LOC`), loại bỏ crosshairs ở cả SVG lẫn CSS, chuyển toàn bộ nhật ký sang tiếng Việt vận hành tự nhiên của lữ hành B2B.
  - **F02**: Xóa bỏ hoàn toàn chỉ số bịa đặt `98.4% INDEX`.
  - **F03**: Loại bỏ toàn bộ chi tiết hư cấu ngoài canonical (đoàn 28 khách, xe 29B-184.22, Ms. Hương, Bác tài Tuấn, booking code, v.v.). Áp dụng 4 mốc trung tính chuẩn: `Chuẩn bị hồ sơ → Chờ khách sạn xác nhận 4 phòng → Sẵn sàng khởi hành → Bàn giao nhật ký`.
  - **F04**: Bổ sung tệp máy đọc `CHECKPOINT_VERIFICATION.json` ghi nhận 18 phép đo thực thi đạt 100% PASS tại Checkpoint 12.1.
  - **F05**: Chuẩn hóa `TEST_MATRIX_DRAFT.md`: xác lập 79 assertions thuộc 14 bài test khóa cứng là kế hoạch cho Phase 4–6 (trạng thái `PLANNED / NOT_RUN`), không tuyên bố self-verdict PASS sớm.
  - **F06**: Cập nhật bài kiểm thử T07 chặn toàn diện request SVG hình ảnh runtime để kiểm chứng cơ chế suy giảm duyên dáng (Graceful Degradation).
  - **F07**: Chụp lại 2 ảnh screenshot bằng Puppeteer ở chế độ `deviceScaleFactor: 2`, tạo ra bitmap authoritative kích thước đúng `2880×1800` (`option_a_desktop_1440x900_dpr2.png` và `option_b_desktop_1440x900_dpr2.png`).
  - **F08**: Quét và chuyển đổi 261 đường dẫn tuyệt đối tác giả thành đường dẫn tương đối hoặc portable `design-training/stream-b/module-012/`.
  - **F09**: Loại bỏ toàn bộ 9 ký tự điều khiển (control characters) khỏi các tệp văn bản.
  - **F10**: Thay thế 100% (8/8) thẻ inline `<svg>` chưa quản trị bằng các thẻ `<img>` trỏ đến 6 icon đã được đăng ký và đo mã băm trong `ASSET_MANIFEST.yaml`.
  - **F11**: Đo đạc và ghi nhận riêng mã băm SHA-256 của `candidate/index.html` trong archive Module 07: `ee5294b94f37e2b4945743ab3215af238dde9e3b97af10a357872c1a85506800` (38,024 bytes, `REFERENCE_ONLY`).
  - **F12**: Loại bỏ claim "chỉ trong 1 giây quét mắt" ở dòng 96 của `IMAGE_LANGUAGE_MATRIX.md`, chuẩn hóa sang phân loại `DESIGN_INTENT`.
  - Bảo toàn tuyệt đối `Direction A` (`ACCEPTED_FOR_SELECTION_POOL`).
  - Đóng gói và phát hành gói nộp sửa chữa duy nhất: `design_training_012_checkpoint_12_1_r02.zip`.

### Giai đoạn M3 — Bản Ứng Viên Hoàn Thiện & Kiểm Thử Tự Động (Candidate & Verification)
- **Kế hoạch (Chờ mở khóa sau Checkpoint 12.1 R02)**:
  - Kích hoạt Phase 3 Selection Gate theo rubric 8 tiêu chí Mục 15 của Directive.
  - Xây dựng `candidate/pre_critique.html` và `candidate/index.html`.
  - Thực thi kiểm thử tự động bằng `verify_module_012.js`, xuất `VERIFICATION.json` và 10 ảnh authoritative DPR=2.
  - Biên soạn báo cáo nghiệm thu `DESIGN_TRAINING_012_REPORT.md` và đóng gói nộp R01.
