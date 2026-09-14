# PROJECT — TRIPFLOW Daily Departure Brief (Module 12: Brand & Image Direction)

> **Mã chỉ thị (Directive ID)**: DESIGN_TRAINING_MODULE_012  
> **Phân luồng kiến trúc (Stream)**: Stream B — Expressive Experience  
> **Sản phẩm nghiệp vụ (Product)**: TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: Anh — Lead Architect / Product Owner  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: Em — Senior Engineering Agent / Lead Implementer  
> **Không gian làm việc (Workspace)**: design-training/stream-b/module-012/  
> **Phiên bản nền tảng (Baseline Version)**: Module 07 Submission R04 (SHA-256: e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76)  

---

## 1. Tổng quan Kiến trúc (Architecture Overview)

### 1.1. Bối cảnh Hệ thống (System Context)
Hệ thống **TRIPFLOW Daily Departure Brief** là ứng dụng web điều phối nghiệp vụ B2B (B2B Operational Dispatch Tool) dành cho các doanh nghiệp du lịch lữ hành vừa và nhỏ (SMEs). Hệ thống được thiết kế để giải quyết bài toán căng thẳng nhất trong ngày của đội ngũ vận hành: **kiểm soát và nhận diện các điểm nghẽn chưa sẵn sàng trước giờ khởi hành (Spotting unprepared bottlenecks before departure)**.

Module 12 thuộc **Stream B (Expressive Experience)**, kế thừa toàn vẹn dữ liệu nghiệp vụ và các bài học tương tác từ bản PASS Module 07, đồng thời nâng cấp toàn diện ngôn ngữ thương hiệu (Brand Direction) và ngôn ngữ hình ảnh (Image Language) theo 2 hướng phân kỳ chiến lược (Two Divergent Art Directions):
1. **Direction A — Human Field Intelligence (Trí tuệ Thực địa Nhân văn)**: Nhìn nhận vận hành qua lăng kính con người, sự thấu cảm và nhịp điệu hiện trường chân thực.
2. **Direction B — Route Signal System (Hệ thống Tín hiệu Lộ trình)**: Nhìn nhận vận hành qua lăng kính trật tự hình học, tín hiệu đo lường viễn thám và chuỗi lộ trình chuẩn xác.

### 1.2. Các Trụ cột Kiến trúc Bất biến (Architectural Invariants)
- **Zero-Motion Mandate (Chính sách Khóa Chuyển động Tuyệt đối)**: nimation: 0s và 	ransition: 0s trên 100% phần tử DOM. Loại bỏ hoàn toàn parallax, hiệu ứng cuộn 3D nhằm bảo đảm tính tĩnh tại tối đa cho việc đánh giá chất lượng thị giác.
- **Mandatory Light Theme Default (Giao diện Sáng Mặc định Tối cao)**: Mặc định 100% giao diện sáng (Light Theme). Tuyệt đối không tự ý dùng giao diện tối / phòng chỉ huy quân sự (Military Dark Command Terminal).
- **Canonical Dataset Lock (Khóa Dữ liệu Chuẩn mục)**: Cố định 8 tour T01–T08 tại mốc thời gian quy chiếu 13/09/2026 18:00 Asia/Ho_Chi_Minh với tour T01 (Hạ Long 2N1Đ) là tâm điểm khẩn cấp (Focal Tour).
- **W3C Semantic Accessibility & WCAG 2.2 AA**: Tỷ lệ tương phản văn bản tối thiểu 4.5:1, không biểu thị trạng thái duy nhất bằng màu sắc, vùng chạm tương tác tối thiểu 44×44 CSS px.
- **Strict Workspace Isolation (Cô lập Không gian Tuyệt đối)**: Phân lập 100% giữa stream-b/module-012/ và stream-a/. Không có bất kỳ lệnh đọc hoặc ghi nào vượt ra ngoài biên giới phân luồng.

---

## 2. Danh mục Tính năng Hệ thống (Feature Inventory)

Toàn bộ các tính năng và quy cách kỹ thuật được phát hiện và bóc tách bởi các Explorer Agents được phân bổ theo 4 mốc tiến độ M0, M1, M2, M3:

| Mã Tính Năng (Feature ID) | Nhóm (Category) | Tên Tính Năng & Quy Cách (Feature & Specification) | Mốc Thực Hiện (Milestone) | Đầu Vào (Inputs) | Đầu Ra Kỹ Thuật (Outputs) | Trạng Thái (Status) |
|---|---|---|---|---|---|---|
| FEAT-01 | Baseline Integrity | Khóa & Kiểm chứng SHA-256 Snapshot Module 07 | **M0** (Setup) | File zip design_training_007_submission_r04.zip | Checksum e76ab08f... đối soát byte-for-byte trong CHANGE_LEDGER.md | Hoàn thành (Verified) |
| FEAT-02 | Baseline Integrity | Khóa & Kiểm chứng SHA-256 Directive & Request | **M0** (Setup) | DESIGN_TRAINING_MODULE_012_DIRECTIVE.md, ORIGINAL_REQUEST.md | Bảng mã băm trong CHANGE_LEDGER.md | Hoàn thành (Verified) |
| FEAT-03 | Operational Data | Đóng băng Bộ Dữ liệu Chuẩn mục T01–T08 | **M0** (Setup) | Directive §4.6 (Mốc 13/09/2026 18:00 ICT) | 8 bộ tuples chuẩn mục với T01 là focal tour trong CHANGE_LEDGER.md | Hoàn thành (Frozen) |
| FEAT-04 | Workspace Isolation | Cơ chế Cô lập Tuyệt đối Stream B (0 cross-reads) | **M0** (Setup) | Cấu trúc thư mục stream-b/module-012 | Cam kết cô lập 0 tham chiếu stream-a trong CHANGE_LEDGER.md | Hoàn thành (Verified) |
| FEAT-05 | Brand Strategy | Định nghĩa Đối tượng Người dùng B2B (Audience Persona) | **M1** (Brand Reasoning) | Directive §4.2 | Hồ sơ điều phối viên & trưởng nhóm vận hành trong BRAND_THESIS.md | Đang triển khai (In Progress) |
| FEAT-06 | Brand Strategy | Lời hứa Thương hiệu Khóa cứng (Locked Brand Promise) | **M1** (Brand Reasoning) | Directive §4.3 | Tuyên ngôn sản phẩm kèm disclaimer bài tập trong BRAND_THESIS.md | Đang triển khai (In Progress) |
| FEAT-07 | Brand Strategy | 4 Hạt giống Tính cách & 4 Thuộc tính Cấm kỵ | **M1** (Brand Reasoning) | Directive §4.4, §4.5 | Ma trận 4 seeds vs. 4 anti-personalities trong BRAND_THESIS.md | Đang triển khai (In Progress) |
| FEAT-08 | Brand Strategy | Tuyên ngôn Thương hiệu 2 Hướng (80–140 words Thesis) | **M1** (Brand Reasoning) | Directive §6 | Đoạn văn Dir A (106 từ) và Dir B (108 từ) trong BRAND_THESIS.md | Đang triển khai (In Progress) |
| FEAT-09 | Brand Strategy | Bảng Ánh xạ 8 Quyết định Thị giác (Visual Decision Mappings) | **M1** (Brand Reasoning) | Directive §6, §16 (B02) | Bảng 8 dòng liên kết thesis -> token -> selector -> test trong BRAND_THESIS.md | Đang triển khai (In Progress) |
| FEAT-10 | Research & Benchmarks | Bảng 8 Tham chiếu Chuẩn mực (Reference Board) | **M1** (Brand Reasoning) | Directive §3.6, §13 | Bảng 8 mục đủ 5 trường phân tích sâu trong REFERENCE_BOARD.md | Đang triển khai (In Progress) |
| FEAT-11 | Image Strategy | Định nghĩa 6 Vai trò Tài sản Hình ảnh (Asset Roles) | **M1** (Brand Reasoning) | Directive §7 | Khung 6 vai trò tài sản trong IMAGE_LANGUAGE_MATRIX.md | Đang triển khai (In Progress) |
| FEAT-12 | Image Strategy | 10 Thuộc tính Quy tắc Chuẩn hóa cho Hình ảnh | **M1** (Brand Reasoning) | Directive §7 | Ma trận 6 vai trò x 10 thuộc tính trong IMAGE_LANGUAGE_MATRIX.md | Đang triển khai (In Progress) |
| FEAT-13 | Responsive Strategy | Quy tắc Cắt cúp & Trọng tâm 3 Viewport (1440, 768, 390) | **M1** (Brand Reasoning) | Directive §10 | Bảng quy tắc crop, focal points, layout shift trong IMAGE_LANGUAGE_MATRIX.md | Đang triển khai (In Progress) |
| FEAT-14 | Iconography System | Hợp đồng Biểu tượng 6 SVG Icons Chuyên biệt | **M1** (Brand Reasoning) | Directive §9 | Đặc tả viewBox 24x24, stroke model, text labels trong IMAGE_LANGUAGE_MATRIX.md | Đang triển khai (In Progress) |
| FEAT-15 | Verification Framework | Khung Kiểm thử Toàn diện T01–T14 & Cổng chặn B01–B08 | **M1** (Brand Reasoning) | Directive §16, §17 | Tài liệu thiết kế kiểm thử tự động TEST_MATRIX_DRAFT.md | Đang triển khai (In Progress) |
| FEAT-16 | Prototype A | Nguyên mẫu Hướng A: Human Field Intelligence | **M2** (Prototypes) | Brand Thesis Dir A + Asset Catalog | Trang web hoàn chỉnh directions/option_a/index.html | Dự kiến (Planned) |
| FEAT-17 | Prototype B | Nguyên mẫu Hướng B: Route Signal System | **M2** (Prototypes) | Brand Thesis Dir B + Asset Catalog | Trang web hoàn chỉnh directions/option_b/index.html | Dự kiến (Planned) |
| FEAT-18 | Asset Pipeline | Hệ thống Tài nguyên Đồ họa Tự thân (ssets/) | **M2** (Prototypes) | Image Matrix + Icon Contract | Thư mục ssets/ gồm icons, diagrams, images, textures, manifest | Dự kiến (Planned) |
| FEAT-19 | Reasoning Gate | Hồ sơ Cổng Thẩm định Lập luận Checkpoint 12.1 | **M2** (Prototypes) | Directive §23 | Đóng gói đệ trình Checkpoint 12.1 Payload | Dự kiến (Planned) |
| FEAT-20 | Selection & Candidate | Lựa chọn Hướng & Bản ứng viên Hoàn thiện (candidate/) | **M3** (Candidate & Verification) | Quyết định tuyển chọn theo Rubric | candidate/pre_critique.html và candidate/index.html | Dự kiến (Planned) |
| FEAT-21 | Automated Verification | Bộ Script Kiểm thử Tự động erify_module_012.js | **M3** (Candidate & Verification) | TEST_MATRIX_DRAFT.md | Thực thi kiểm thử 14 test, xuất VERIFICATION.json và 10 screenshots | Dự kiến (Planned) |
| FEAT-22 | Final Package | Báo cáo Nghiệm thu & Gói nộp Hoàn chỉnh R01 | **M3** (Candidate & Verification) | Directive §18, §19 | DESIGN_TRAINING_012_REPORT.md và file nén submission R01 | Dự kiến (Planned) |

---

## 3. Bảng Mốc Thực Hiện (Milestones Table)

| Mốc (Milestone) | Tên Giai Đoạn (Stage Name) | Mục Tiêu Cốt Lõi (Key Objectives) | Sản Phẩm Bàn Giao (Key Deliverables) | Cổng Kiểm Soát (Control Gates) | Trách Nhiệm (Owner) |
|---|---|---|---|---|---|
| **M0** | Baseline & Integrity Setup | Khảo sát mã băm, khóa dữ liệu 8 tour, thiết lập không gian cô lập | CHANGE_LEDGER.md, PROJECT.md | Hash match 100%, 0 stream-a reads | worker_p0_p1 |
| **M1** | Brand Reasoning Strategy | Thiết lập chiến lược thương hiệu, bảng tham chiếu, ma trận ảnh, khung test | BRAND_THESIS.md, REFERENCE_BOARD.md, IMAGE_LANGUAGE_MATRIX.md, TEST_MATRIX_DRAFT.md | Word counts [80, 140], 8 refs x 5 fields, 6 roles x 10 attrs | worker_p0_p1 |
| **M2** | Two-Direction Prototypes | Thi công 2 nguyên mẫu phân kỳ 7/7 trục, tạo tài sản local, chuẩn bị Checkpoint 12.1 | directions/option_a/, directions/option_b/, ssets/, ASSET_MANIFEST.yaml | Phân kỳ $\ge 5/7$ trục (B01), Zero-motion (T12), Checkpoint 12.1 | worker_p2 / Orchestrator |
| **M3** | Candidate, Verification & Package | Tuyển chọn hướng, xây dựng candidate, kiểm thử tự động 14 tests, đóng gói R01 | candidate/index.html, erify_module_012.js, VERIFICATION.json, 10 screenshots, report, submission ZIP | B01–B08 PASS tuyệt đối, T01–T14 100% PASS | worker_p3 / QA Auditor |

---

## 4. Hợp Đồng Giao Diện Kỹ Thuật (Interface Contracts)

### 4.1. Hợp đồng Dữ liệu Đầu vào (Input Interface Contracts)
1. **Chỉ thị Chính thức**: DESIGN_TRAINING_MODULE_012_DIRECTIVE.md (SHA-256: 8f6cc77d13ac3ce376ad7d429bf7f1f6340dc8c57ee1c7785dd8d970a8f35dbb).
2. **Yêu cầu Người dùng**: ORIGINAL_REQUEST.md (SHA-256: 78689ddccb63b72d4f7d6b30be919bc63f9b1044e3efa518c22f25d1d375cfce).
3. **Bản Nguồn Đóng băng**: source_snapshot/design_training_007_submission_r04.zip (SHA-256: e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76).
4. **Bộ Dữ liệu Điều phối 8 Tour**: 8 tuples T01–T08 cố định tại 13/09/2026 18:00 ICT.

### 4.2. Hợp đồng Sản phẩm Đầu ra (Output Interface Contracts)
1. **Chiến lược Thương hiệu (BRAND_THESIS.md)**:
   - Chứa hồ sơ B2B coordinator, lời hứa thương hiệu khóa cứng, 4 seeds, 4 anti-personalities.
   - Chứa đúng 2 Thesis Statements với độ dài mỗi đoạn nghiêm ngặt từ 80 đến 140 từ.
   - Bảng 8 Visual Decision Mappings liên kết trực tiếp sang token và DOM selector.
2. **Bảng Tham chiếu (REFERENCE_BOARD.md)**:
   - Đúng chính xác 8 mục tham chiếu uy tín quốc tế và ngành vận hành.
   - Đủ 5 trường bắt buộc: URL, Observation, Transfer Principle, Copy Ban, TRIPFLOW Relevance.
3. **Ma trận Ngôn ngữ Hình ảnh (IMAGE_LANGUAGE_MATRIX.md)**:
   - Đúng đủ 6 vai trò tài sản: Hero/context, Operational scene, Route diagram, Fictional person Lan, Icon family, Texture/accent.
   - Đúng đủ 10 thuộc tính quy tắc cho từng vai trò; xử lý 3 viewport crop và fallback behavior khi lỗi tải ảnh.
4. **Khung Kiểm thử Sơ bộ (TEST_MATRIX_DRAFT.md)**:
   - Định nghĩa toàn diện điều kiện tiên quyết, phương pháp, giá trị đo, ngưỡng pass/fail cho 14 bài test T01–T14 và 8 cổng chặn B01–B08.
5. **Sổ cái Thay đổi (CHANGE_LEDGER.md)**:
   - Ghi nhận đầy đủ bảng mã băm, cam kết cô lập, dữ liệu khóa cứng và tiến trình biến đổi từng giai đoạn.

---

## 5. Bố Trí Thư Mục Mã Nguồn (Code Layout)

`
design-training/stream-b/module-012/
├── .agents/                                    # Thư mục siêu dữ liệu tác tử (Metadata only - CẤM chứa code/asset)
│   ├── explorer_m0_integrity/                  # Báo cáo khảo sát tính toàn vẹn và dữ liệu gốc
│   ├── explorer_m0_brand/                      # Báo cáo khai phá đặc tả chiến lược thương hiệu
│   ├── explorer_m0_prototypes/                 # Báo cáo kiến trúc hai hướng nguyên mẫu
│   └── worker_p0_p1/                           # Không gian làm việc của Tác tử Thi công Phase 0 & 1
│       ├── DISPATCH.md                         # Lịch sử điều phối nhiệm vụ
│       ├── BRIEFING.md                         # Bộ nhớ ngữ cảnh liên tục
│       ├── progress.md                         # Nhịp tim tiến độ (Liveness heartbeat)
│       └── handoff.md                          # Báo cáo bàn giao nghiệm thu Phase 0 & 1
├── assets/                                     # Thư mục tài nguyên đồ họa tự thân (Local assets)
│   ├── diagrams/                               # Sơ đồ vector chuỗi hành trình T01
│   ├── icons/                                  # 6 SVG icons chuyên biệt chuẩn hóa hệ lưới 24x24
│   ├── images/                                 # Ảnh bối cảnh và hiện trường WebP tối ưu hóa
│   ├── textures/                               # Họa tiết nền xúc giác nhẹ
│   └── ASSET_MANIFEST.yaml                     # Danh mục khai báo nguồn gốc, mã băm SHA-256, bản quyền
├── candidate/                                  # Ứng viên phát hành chính thức Module 12
│   ├── index.html                              # Trang web ứng viên hoàn thiện sau kiểm toán
│   └── pre_critique.html                       # Ứng viên trước vòng phản biện
├── directions/                                 # Hai hướng nghệ thuật nguyên mẫu phân kỳ
│   ├── option_a/                               # Hướng A: Human Field Intelligence
│   │   └── index.html                          # Bản mẫu Hướng A
│   └── option_b/                               # Hướng B: Route Signal System
│       └── index.html                          # Bản mẫu Hướng B
├── source_snapshot/                            # Nguồn kế thừa đóng băng từ Module 07
│   └── design_training_007_submission_r04.zip  # File zip nguyên bản (SHA-256: e76ab08f...)
├── BRAND_THESIS.md                             # Tài liệu định vị chiến lược thương hiệu và ánh xạ thị giác
├── CHANGE_LEDGER.md                            # Sổ cái toàn vẹn, cam kết cô lập và nhật ký giai đoạn
├── DESIGN_TRAINING_MODULE_012_DIRECTIVE.md     # Chỉ thị chính thức có hiệu lực pháp lý cao nhất
├── IMAGE_LANGUAGE_MATRIX.md                    # Ma trận 6 vai trò hình ảnh x 10 thuộc tính quy tắc
├── ORIGINAL_REQUEST.md                         # Văn bản yêu cầu gốc từ người dùng
├── PROJECT.md                                  # Tài liệu kiến trúc dự án, danh mục tính năng và mốc thực hiện
├── REFERENCE_BOARD.md                          # Bảng 8 tham chiếu chuẩn mực phân tích sâu 5 trường
└── TEST_MATRIX_DRAFT.md                        # Bản thiết kế kiểm thử tự động 14 tests & 8 blocking gates
`

---
*Tài liệu này là hợp đồng kiến trúc chuẩn mực được khởi tạo bởi worker_p0_p1 cho Module 12 Stream B.*
