# BÁO CÁO BÀN GIAO KHẢO SÁT TOÀN VẸN & DỮ LIỆU GỐC (INTEGRITY & BASELINE HANDOFF REPORT)
## Module 12 — Brand & Image Direction (Stream B: Expressive Experience)
**Tác tử khảo sát (Explorer Agent)**: `explorer_m0_integrity` (Baseline & Integrity Explorer)  
**Mã đàm thoại điều phối (Parent Caller ID)**: `50638c96-0a4d-4b4a-8378-2ac2dd56ec7b`  
**Thời điểm thẩm định (Timestamp)**: 2026-09-14T01:40:00Z (08:40:00 ICT)  
**Trạng thái bàn giao (Handoff Type)**: Hard Handoff (Hoàn tất đầy đủ 100% phạm vi khảo sát)

---

## 1. Quan sát trực tiếp (Observation)

### 1.1. Xác thực toàn vẹn mã băm SHA-256 của Bản PASS Module 07 (Source Snapshot Integrity)
- **Tập tin kiểm tra (Target File)**: `design-training/stream-b/module-012/source_snapshot/design_training_007_submission_r04.zip`
- **Lệnh thực thi kiểm tra (Execution Command)**:
  ```powershell
  Get-FileHash -Algorithm SHA256 "design-training/stream-b/module-012/source_snapshot\design_training_007_submission_r04.zip" | Format-List
  ```
- **Kết quả đo đạc thực tế (Measured Result)**:
  * **Algorithm**: `SHA256`
  * **Measured Hash**: `E76AB08F4D1E72865F4210299594E175B94F471D3F8960C3F0C61D4259283C76`
  * **Lower-case Hash**: `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`
  * **Kỳ vọng tại Chỉ thị & Yêu cầu (Directive & Request Expectation)**: `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`
  * **Đối soát (Verdict)**: **100% KHỚP TỪNG BYTE (EXACT BYTE-FOR-BYTE MATCH)**.
  * **Dung lượng tập tin (File Size)**: `1,855,556 bytes` (1.85 MB).
  * **Mốc thời gian lưu trữ (LastWriteTime)**: `9/13/2026 11:17:00 PM`.

### 1.2. Xác thực mã băm các tài liệu pháp lý đầu vào (Authoritative Input Hashes)
- **Chỉ thị chính thức (Official Directive)**:
  * Đường dẫn: `design-training/stream-b/module-012/DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`
  * Dung lượng: `32,095 bytes`
  * SHA-256: `8f6cc77d13ac3ce376ad7d429bf7f1f6340dc8c57ee1c7785dd8d970a8f35dbb`
- **Yêu cầu người dùng có thẩm quyền (Authoritative User Request)**:
  * Đường dẫn: `design-training/stream-b/module-012/ORIGINAL_REQUEST.md`
  * Dung lượng: `5,574 bytes`
  * SHA-256: `78689ddccb63b72d4f7d6b30be919bc63f9b1044e3efa518c22f25d1d375cfce`

### 1.3. Khảo sát cấu trúc bên trong bản PASS Module 07 (Snapshot Contents Inspection)
Đã thực hiện mở luồng đọc bộ nhớ trong tập tin ZIP (in-memory ZIP stream inspection mà không bung file làm ô nhiễm workspace):
- **Tổng số mục lưu trữ (Total Entries)**: 26 mục (bao gồm 14 tập tin mã nguồn/báo cáo/hợp đồng và 12 ảnh chụp màn hình chứng cứ).
- **Chi tiết bảng mã băm các tập tin cốt lõi (Core Files SHA-256 Table)**:

| Tên tập tin trong ZIP (Relative Path) | Dung lượng (Bytes) | Mã băm SHA-256 (Checksum) | Vai trò kiến trúc (Architectural Role) |
| :--- | :--- | :--- | :--- |
| `baseline/index.html` | 32,042 | `d7725c3129303aaf375b457f246c215281da718cb008b68931dc001b429c5004` | Điểm xuất phát thô ban đầu của Module 07 |
| `directions/option_a.html` | 9,969 | `7ec5170396f7e889194002c979a1da828dccc723a034dbe08de5e7d32703e3df` | Bản mẫu Hướng A (Dispatch Ledger) của M07 |
| `directions/option_b.html` | 7,684 | `5b42961802b88309b16d32cd57e4c72a7bbfeceab85497b2a9c25543f432e372` | Bản mẫu Hướng B (Operational Radar) của M07 |
| `candidate/pre_critique.html` | 37,722 | `0e68156a2f38bf14c8dde210ef96b363d5681900d83837684cf55931be3e655a` | Ứng viên trước vòng phản biện (Pre-Critique) |
| `candidate/index.html` | 38,024 | `ee5294b94f37e2b4945743ab3215af238dde9e3b97af10a357872c1a85506800` | **Bản nộp PASS chính thức Module 07 (Candidate Final)** |
| `DESIGN_CONTRACT.yaml` | 3,879 | `0f1ff7f2e3f415f1ee0cd1f81040164567525ea7b8ec109ad5fc3caffabbc503` | Hợp đồng thiết kế (Design Contract) M07 |
| `DESIGN_TRAINING_007_DIRECTIVE.md` | 25,334 | `0840d95724643b730237444005d20a6097d98ec72bc0b40441e1ee6e8064d7d7` | Chỉ thị đào tạo Module 07 gốc |
| `DESIGN_TRAINING_007_REPORT.md` | 29,263 | `a2735ab50f60e98797b214eccd93c7b717caffac0fe168963404bfb7e157fb6d` | Báo cáo nghiệm thu Module 07 |
| `DESIGN_TRAINING_007_REVIEW_001.md` | 21,530 | `f545d0fb2eb693256066cfdf4a0493a4535e7292ad7c8d4214a87a8c994fdd00` | Biên bản đánh giá vòng 1 từ Controller |
| `DESIGN_TRAINING_007_REVIEW_002.md` | 18,392 | `37a4be75236730287a19ed184cc4ae0bd9a1286a1a01e5d1fc7fc918e0cd51d3` | Biên bản đánh giá vòng 2 từ Controller |
| `DESIGN_TRAINING_007_FINAL_REVIEW_003.md` | 13,368 | `b4cc8704b6fb019262caeb922b2d6b7840ac1e0037dee98393d2a80c0d62fc07` | Biên bản phê duyệt thẩm quyền tối cao R04 |
| `CHANGE_LEDGER.md` | 19,638 | `8a8b55b3cbd090c686bc23d162c50ef29466b656ded264db9ae1240e9578d3b7` | Sổ cái thay đổi Module 07 |
| `VERIFICATION.json` | 21,009 | `966e3cea3078b921eccab80e1c8a7ca2c76ee9faa411a5cd0855f14b777fb5c6` | Bằng chứng kiểm thử tự động Module 07 PASS |
| `verify_module_007.js` | 70,412 | `c3d9a7331bd926e21584a2823c8d59fbca3f5ab2370517dcf783a2bd03e8c3db` | Bộ test tự động 14 tiêu chí của Module 07 |

- **Bản PASS Candidate Final (`candidate/index.html`) mang các đặc tính giao diện & kỹ thuật nền tảng**:
  1. **HTML Structure & Semantic Landmarks**: Sử dụng đầy đủ `<header class="dispatch-header">`, `<main id="screen-list-view">`, `<section class="urgent-focus-module">` cho điểm nóng T01, `<section class="dispatch-controls">` cho thanh tìm kiếm và bộ lọc workflow tabs, `<section class="tours-table-container">` hiển thị danh sách 8 tour, và `<div id="screen-detail-view">` chứa modal form xử lý FSM cho tour T01.
  2. **Zero-Motion Policy (Chính sách Khóa Chuyển Động)**: Toàn bộ CSS cài đặt triệt để:
     ```css
     *, *::before, *::after {
       transition: none !important;
       animation: none !important;
     }
     html { scroll-behavior: auto !important; }
     ```
  3. **Light Theme Invariant (Giao diện Sáng Mặc Định)**:
     - Nền canvas (`canvas_background`): Warm Paper tone `#FAF9F6`
     - Nền thẻ / bảng (`surface_card`): Crisp White `#FFFFFF`
     - Điểm nhấn cảnh báo T01 (`surface_highlight`): Warm Amber `#FFFBEB`
     - Màu chữ chính (`text_primary`): Obsidian `#0F172A` (Tương phản WCAG > 13:1)
     - Đường viền (`border_hairline`): Hairline border `#E2E8F0`
     - Màu viền cảnh báo (`border_urgency`): Amber `#D97706`
  4. **Accessibility (Khả năng tiếp cận)**: Mục tiêu chạm tối thiểu `44×44 CSS px`, vòng nét tập trung bàn phím `:focus-visible { outline: 2px solid #D97706; outline-offset: 2px; }`.

### 1.4. Kiểm tra cô lập không gian làm việc nghiêm ngặt (Strict Workspace Isolation Verification)
- **Kiểm tra tham chiếu chéo (Cross-Reference Search)**: Đã quét toàn bộ thư mục `stream-b/module-012` tìm chuỗi ký tự `stream-a`:
  * Chỉ xuất hiện tại dòng 17 & dòng 38 của `ORIGINAL_REQUEST.md`, dòng 38 của `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, và các file `BRIEFING.md` của các agent ghi lại quy định cấm.
  * **Tuyệt đối không có bất kỳ script, lệnh gọi file hay đường dẫn runtime nào truy cập hoặc ghi sang thư mục `design-training/exercises/stream-a/`**.
  * Không gian làm việc `design-training/stream-b/module-012/` hoàn toàn độc lập và tự chứa (self-contained).

### 1.5. Trích xuất chuẩn xác Bộ Dữ Liệu Điều Phối Chuẩn Mục (Canonical Operational Snapshot)
Trích xuất nguyên văn từ **Mục 4.6 của DESIGN_TRAINING_MODULE_012_DIRECTIVE.md**:
- **Mốc thời gian quy chiếu cố định (Fixed Anchor Timestamp)**:
  👉 **`13/09/2026 — 18:00, Asia/Ho_Chi_Minh`** (18:00 ICT)

- **Bảng dữ liệu 8 tour chuẩn mục T01–T08 (Canonical 8-Tour Table)**:

| ID | Tour | Khởi hành (Departure) | Phụ trách (Assignee) | Trạng thái (Status) | Vấn đề / ghi chú (Issues / Notes) | Nhóm luồng (Workflow Group) & Mức ưu tiên (Priority) |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **T01** | **Hạ Long 2N1Đ** | **14/09/2026 07:30** | **Lan** | **Chờ đối tác** | **Khách sạn chưa xác nhận 4 phòng** | **Điểm nóng khẩn cấp (Focal Point)**; Cần xử lý (`groupAction: true`), Khởi hành <24h (`group48h: true`), Ưu tiên số 1 |
| **T02** | Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách | Sẵn sàng (`groupReady: true`), Khởi hành <24h (`group48h: true`) |
| **T03** | Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD | Cần xử lý (`groupAction: true`), Khởi hành >48h |
| **T04** | Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn | Đang chuẩn bị (`groupPrep: true`) |
| **T05** | Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành | Sẵn sàng (`groupReady: true`) |
| **T06** | Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận | Cần xử lý (`groupAction: true`) |
| **T07** | Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng | Đang chuẩn bị (`groupPrep: true`) |
| **T08** | Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký | Đã hoàn thành (`groupDone: true`, đã khởi hành trong quá khứ so với mốc quy chiếu) |

- **Ràng buộc bất biến về dữ liệu (Data Invariants)**:
  * Tour **T01 là trọng tâm tối cao** (Focal Tour / Urgent Priority). Khởi hành lúc 07:30 ngày 14/09/2026, chỉ còn 13 giờ 30 phút tính từ mốc 18:00 ngày 13/09/2026.
  * Nhân vật phụ trách Lan là nhân vật giả lập (fictional authored persona), không được mạo danh hoặc giả ảnh người thật.
  * Tuyệt đối không thay đổi bộ 8 bộ giá trị (tuples), không tự ý bịa đặt doanh thu, giải thưởng, đối tác thật, hoặc số liệu thị trường giả định.

---

## 2. Chuỗi lập luận logic (Logic Chain)

```
[Khảo sát 1: Tính toán SHA-256 thực tế của file zip snapshot bằng PowerShell Get-FileHash]
   │
   ▼
[Kết quả: e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76]
   │
   ▼
[Khảo sát 2: So sánh trực tiếp với chuỗi băm trong Chỉ thị Directive dòng 12 và Original Request dòng 12]
   │
   ▼
[Suy luận Logic: Snapshot Module 07 đạt 100% độ toàn vẹn, không suy thoái, không bị can thiệp, sẵn sàng làm nguồn kế thừa]
   │
   ▼
[Khảo sát 3: Kiểm tra luồng zip và quét hệ thống file stream-b/module-012]
   │
   ▼
[Suy luận Logic: Xác nhận không có thao tác truy cập hay ghi vào stream-a/. Bảo đảm phân lập tuyệt đối hai stream]
   │
   ▼
[Khảo sát 4: Đối chiếu Section 4.6 của Directive với CANONICAL_TOURS trong candidate/index.html của M07]
   │
   ▼
[Suy luận Logic: Dữ liệu 8 tour T01–T08 khớp hoàn toàn, đảm bảo tính liên tục của bài toán nghiệp vụ B2B khi bước sang Module 12 Brand & Image Direction]
   │
   ▼
[Khảo sát 5: Tổng hợp yêu cầu Phase 0 từ Mục 13, 14, 16, 17, 19 của Directive]
   │
   ▼
[Suy luận Logic: Xác lập khung cấu trúc CHANGE_LEDGER.md, quy tắc bảo tồn baseline, và sổ cái chứng cứ phục vụ các phase tiếp theo]
```

---

## 3. Điểm giới hạn & Giả định (Caveats)

1. **Bản snapshot đóng băng (Read-Only Frozen Snapshot)**: `source_snapshot/design_training_007_submission_r04.zip` là bất biến. Mọi sự phát triển mã nguồn của Module 12 phải diễn ra trong các thư mục riêng (`directions/`, `candidate/`, `assets/`), không được giải nén đè trực tiếp lên thư mục gốc của Module 12.
2. **Kế thừa nghiệp vụ vs. Đổi mới nhận diện (Operational Inheritance vs. Brand Divergence)**: Module 07 đã thiết lập chuẩn mực bố cục kiểu "Sổ điều phối hành trình" (Dispatch Ledger) theo một hướng duy nhất. Sang Module 12, đề bài yêu cầu xây dựng **hai hướng nghệ thuật phân kỳ độc lập (Two Divergent Art Directions)** gồm:
   - **Direction A — Human Field Intelligence**: Tập trung vào con người vận hành thực tế, bố cục bất đối xứng dạng biên tập (editorial/asymmetric), nhiếp ảnh dạng tư liệu tài liệu (documentary-inspired), cảm giác ấm áp và tin cậy.
   - **Direction B — Route Signal System**: Tập trung vào chuỗi tuyến, nhịp quét tín hiệu và tính sẵn sàng, bố cục chặt chẽ dạng bản đồ/hệ thống (systematic/cartographic grid).
   Do đó, mã HTML/CSS của Module 07 chỉ đóng vai trò tham khảo về logic xử lý và token mẫu, chứ không được sao chép nguyên trạng để tránh vi phạm tiêu chí phân kỳ 5/7 trục.
3. **Chính sách Không chuyển động (Zero-Motion Boundary)**: Kế thừa 100% từ Module 07, cấm toàn bộ `animation` và `transition` (thời lượng phải bằng `0s`), cấm parallax, cấm cuộn 3D nhằm đánh giá chất lượng thị giác thuần túy.
4. **Giới hạn bài tập (Exercise-Supported Boundaries)**: Toàn bộ dữ liệu khách hàng, nhân vật Lan, các đối tác khách sạn đều là giả lập cho bài tập đào tạo B2B. Mọi nhận định thị giác phải gắn nhãn `DESIGN_INTENT`, `MEASURED`, `VISUAL_REVIEW` hoặc `EXERCISE_SUPPORTED`, không tự ý dùng nhãn `USER_RESEARCH`.

---

## 4. Kết luận thẩm định (Conclusion)

1. **Về tính toàn vẹn (Integrity Verdict)**: Đạt mức **PASS TUYỆT ĐỐI (100% PASS)**. Mã băm SHA-256 của `source_snapshot/design_training_007_submission_r04.zip` khớp chính xác từng ký tự hex với yêu cầu thẩm quyền.
2. **Về phân lập workspace (Workspace Isolation)**: Đạt chuẩn cô lập 100%. Không có bất kỳ liên kết vi phạm nào tới `stream-a/`.
3. **Về dữ liệu chuẩn mục (Canonical Data)**: Đã khóa cứng 8 tour T01–T08 mốc 18:00 ngày 13/09/2026 ICT với T01 là trọng tâm khẩn cấp.
4. **Sẵn sàng chuyển giao (Handover Readiness)**: Toàn bộ căn cứ kỹ thuật và dữ liệu đầu vào đã được khóa chặt, tạo nền tảng vững chắc để Orchestrator và các explorer/builder pods triển khai Phase 0, Phase 1 (Brand Reasoning), Phase 2 (Two-Direction Prototypes) và đóng gói Checkpoint 12.1.

---

## 5. Đặc tả yêu cầu cho Phase 0 (Phase 0 Detailed Specifications)

### 5.1. Cấu trúc chuẩn mực của `CHANGE_LEDGER.md`
Khi khởi tạo `CHANGE_LEDGER.md` cho Module 12 tại thư mục gốc workspace, tài liệu bắt buộc phải tuân thủ cấu trúc phân tầng sau:

```markdown
# CHANGE LEDGER: DESIGN_TRAINING_MODULE_012 (TRIPFLOW)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành`  
> **Cơ quan thẩm định (Authority)**: `ChatGPT Controller — Stream B`  
> **Chủ quản sản phẩm (PO)**: `Anh — Lead Architect / Product Owner`  
> **Đơn vị thực thi (Executor)**: `Antigravity Tab B`  
> **Trạng thái (Status)**: `PHASE_0_INTEGRITY_SETUP`  

---

## 1. Bảng Đối Soát Mã Băm Căn Bản (Source & Baseline Hash Ledger)
- Bảng SHA-256 của Directive, Original Request và Snapshot ZIP Module 07.
- Bảng SHA-256 các tập tin thành phần trích xuất tham chiếu từ Module 07 PASS.

## 2. Cam Kết Cô Lập Không Gian Làm Việc (Workspace Isolation Affirmation)
- Tuyên bố tuân thủ đường dẫn độc lập `design-training/stream-b/module-012/`.
- Cam kết không đọc/ghi/chuyển giao sang `stream-a/`.

## 3. Khóa Dữ Liệu Nghiệp Vụ Chuẩn Mục (Canonical Data Lock T01–T08)
- Mốc quy chiếu 13/09/2026 18:00 Asia/Ho_Chi_Minh.
- Toàn văn bảng 8 tour chuẩn mục kèm focal tour T01.
- Quy tắc nghiêm cấm bịa đặt số liệu doanh thu/thị trường.

## 4. Các Ranh Giới Kỹ Thuật Bất Biến (Invariant Boundaries)
- Zero-Motion Invariant (`animation: 0s`, `transition: 0s` tuyệt đối).
- Light Theme Default Invariant (Mặc định 100% giao diện sáng, cấm dark theme).
- B2B Operational Identity Invariant (Công cụ điều phối B2B, không phải landing page du lịch).
- Accessible Contrast & Touch Target (WCAG 2.2 AA, Touch target ≥ 44×44px).

## 5. Nhật Ký Biến Đổi & Tiến Trình Theo Giai Đoạn (Evolutionary Stage Log)
- Phase 0: Integrity Setup & Baseline Freeze
- Phase 1: Brand Reasoning Deliverables (BRAND_THESIS, REFERENCE_BOARD, IMAGE_LANGUAGE_MATRIX, TEST_MATRIX_DRAFT)
- Phase 2: Two-Direction Prototypes (Option A & Option B)
- Phase 3: Selection Gate & Checkpoint 12.1 Payload
- Phase 4: Final Candidate Implementation (pre_critique.html & index.html)
- Phase 5: Critique & Controlled Repair Loop (Max 2 repair cycles)
- Phase 6: Automated Verification (T01–T14, B01–B08) & Packaging R01
```

### 5.2. Quy tắc bảo tồn baseline (Baseline Preservation Rules)
1. **Không sửa đổi trực tiếp (No In-Place Modification)**: Snapshot zip Module 07 đặt trong `source_snapshot/` phải giữ nguyên trạng read-only.
2. **Không làm sai lệch nghiệp vụ cốt lõi (No Domain Drift)**: Giữ nguyên vẹn 8 tour T01–T08, các trạng thái nghiệp vụ (Chờ đối tác, Sẵn sàng, Thiếu hồ sơ, Đang chuẩn bị, Hoàn thành), và FSM form giải quyết T01.
3. **Ghi nhận mọi bước tiến hóa (Explicit Delta Tracking)**: Bất kỳ thay đổi hoặc nâng cấp nào từ nền tảng M07 lên M12 đều phải được ghi nhận vào `CHANGE_LEDGER.md` kèm lý do kiến trúc rõ ràng.

### 5.3. Yêu cầu sổ cái chứng cứ (Evidence Ledger Requirements)
- Mọi tài sản hình ảnh tạo ra trong `assets/` phải được lập danh mục trong `ASSET_MANIFEST.yaml` kèm mã băm SHA-256, nguồn gốc (`origin_type`), tỷ lệ focal point, chiến lược `alt`, và nhãn công khai minh bạch (`disclosure: "AI-generated training asset"` hoặc `"Fictional authored asset"`).
- Bộ ảnh chụp màn hình kiểm chứng độc lập gồm đúng 10 ảnh authoritative PNG chụp tại DPR=2 phải được đăng ký trong `SCREENSHOT_MANIFEST.json` kèm mã băm SHA-256.
- Toàn bộ kết quả kiểm thử tự động của 14 bài test T01–T14 phải được ghi nhận vào `VERIFICATION.json`.

---

## 6. Phương pháp kiểm chứng độc lập (Verification Method)

Người kiểm tra độc lập có thể tái kiểm chứng toàn bộ kết quả trên bằng các câu lệnh terminal sau:

1. **Kiểm chứng mã băm SHA-256 của snapshot zip**:
   ```powershell
   Get-FileHash -Algorithm SHA256 "design-training/stream-b/module-012/source_snapshot\design_training_007_submission_r04.zip"
   # Kỳ vọng: E76AB08F4D1E72865F4210299594E175B94F471D3F8960C3F0C61D4259283C76
   ```

2. **Kiểm tra danh mục tập tin bên trong snapshot zip**:
   ```powershell
   powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; `$zip = [System.IO.Compression.ZipFile]::OpenRead('design-training/stream-b/module-012/source_snapshot\design_training_007_submission_r04.zip'); `$zip.Entries | Select-Object FullName, Length | Format-Table; `$zip.Dispose()"
   ```

3. **Kiểm tra tính cô lập (không chạm vào stream-a)**:
   ```powershell
   Select-String -Path "design-training/stream-b/module-012/*.*" -Pattern "stream-a"
   ```

4. **Kiểm chứng tính toàn vẹn của chỉ thị Directive và Original Request**:
   ```powershell
   Get-FileHash -Algorithm SHA256 "design-training/stream-b/module-012/DESIGN_TRAINING_MODULE_012_DIRECTIVE.md", "design-training/stream-b/module-012/ORIGINAL_REQUEST.md"
   ```
