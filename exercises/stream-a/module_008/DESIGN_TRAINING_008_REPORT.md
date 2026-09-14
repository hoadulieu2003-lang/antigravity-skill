# DESIGN TRAINING 008 — COMPREHENSIVE COLOR SYSTEM & DISPATCH LEDGER REPORT
## Functional Color System with Measurable Contrast Constraints (TRIPFLOW Dispatch Ledger)

```yaml
REPORT_ID: DESIGN_TRAINING_008_REPORT_R06_AUDIT_CORRECTION_001
MODULE_ID: DESIGN_TRAINING_008
MODULE_NAME: COLOR_SYSTEM
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
CONTROLLER: ChatGPT Architectural Controller (Sol)
EXECUTOR: Antigravity (Senior Engineering Agent)
DELIVERABLE_ARCHIVE: design_training_008_verification_audit_correction_001.zip
SUBMISSION_ID: DESIGN_TRAINING_008_VERIFICATION_AUDIT_CORRECTION_001
VERDICT_PROPOSED: SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_AUDIT
TIMESTAMP: 2026-09-14T07:40:00Z
AUTHORIZATION: DESIGN_TRAINING_008_VERIFICATION_AUDIT_REVIEW_001 (One Final Audit Correction 1/1)
RELATION: ONE_FINAL_AUDIT_CORRECTION_SEPARATE_AUDIT
AUDIT_STATUS: COMPLETED_PENDING_CONTROLLER_VERDICT
```

---

## 0. BÁO CÁO KHẮC PHỤC SỬA ĐỔI & KIỂM TOÁN (REMEDIATION & REPAIR RESOLUTION)

### 0.1. Tuyên Bố Đóng Băng Thẩm Mỹ & Phạm Vi Thị Giác (Visual Frozen Scope)
1. **Hướng Nghệ Thuật & Trực Quan**: Option A Refined (Warm Alabaster) đã được Architectural Controller Sol chính thức chấp nhận (`ACCEPTED_FOR_EXERCISE` tại Review 003 và tái khẳng định tại Audit Review 001). Toàn bộ giao diện trực quan trong `index.html`, `directions/option_a.html`, và 9 ảnh authoritative DPR=2 được đóng băng hoàn toàn (`visual_candidate_hash_unchanged: true`).
2. **Các Gates Nền Tảng Đã Được Thẩm Định**: Sol đã thẩm định và xác nhận đạt cho Gate C02 (Two Directions), Gate C03 (Contrast Inventory 42 roles), Gate C04 (Color Independence & CVD Artifacts), Gate C05 (Focus Indicator trên 3 target IDs), Gate C06 (Responsive Cadence & Caption Block), và Invariant Zero Motion.

---

### 0.2. Báo Cáo Khắc Phục 5 Blocking Findings F01–F05 (Audit Review 001 Resolution)
Căn cứ phán quyết `DESIGN_TRAINING_008_VERIFICATION_AUDIT_REVIEW_001.md`, Antigravity đã hoàn thành trọn vẹn đợt sửa đổi kiểm toán cuối cùng (**One Final Audit Correction 1/1**):

| Mã Finding | Trọng Tâm Chỉ Thị Của Sol | Biện Pháp Triển Khai Kỹ Thuật (Engineering Implementation) | Bằng Chứng Viễn Trắc Thực Tế (`VERIFICATION.json`) | Trạng Thái Tự Kiểm |
|:---:|---|---|---|:---:|
| **F01** | **A01 FSM Native Keyboard Journey**: 11 bước `fsm_focus_sequence[]`, 7 trạng thái `state_timeline[]`, Enter native, duplicate guard, single stable node, no focus stealing, 0 body focus. | Tái thiết kế `auditFsmFocusPreservation()`: Đo đạc đủ 11 bước chuyển dịch focus từ trang sạch. Kích hoạt kịch bản lỗi bằng test hook `dataset.simulateFailure = 'true'` và bấm `Enter` native (xóa bỏ hoàn toàn phím tắt tổ hợp `Shift+Enter`). Bấm `Enter` thử trong trạng thái `SAVING` chứng minh bị chặn (`duplicateBlocked: true`). Duy trì `window.__fsmInitNode === btn` xuyên suốt vòng đời. Kiểm chứng không cướp focus khi hoàn tất (`input-tour-search` được bảo toàn). | `steps_count: 11`; `timeline: IDLE -> VALIDATING -> SAVING -> FAILURE -> VALIDATING_RETRY -> SAVING_RETRY -> CONFIRMED`; `stable_node_identity_verified: true`; `no_steal_verified: true`; `body_focus_events: 0`. | **SELF_CHECK_REMEDIATED (PENDING CONTROLLER AUDIT)** |
| **F02** | **A02 Programmatic Focus Scanner**: Máy quét tĩnh mã nguồn `verify_module_008.js` có positive control fixture (bắt đúng 2 calls) + runtime tracker. Tổng số lệnh gọi lập trình phải bằng 0. | 1. Xây dựng `scanSourceForProgrammaticFocusCalls()` quét tĩnh toàn bộ file harness, loại bỏ comment và bóc tách định nghĩa fixture để không tự đếm chuỗi thử nghiệm. Kết quả phát hiện: **0** calls.<br>2. Xây dựng `runProgrammaticFocusPositiveControl()` với fixture bẩn chứa đúng 2 lệnh `page.focus()` và `btn.focus()`. Bộ phát hiện bắt đúng $2/2$ vi phạm (`passed: true`).<br>3. Runtime hook trong trang ghi nhận **0** lệnh gọi. | `harness_source_programmatic_focus_calls: 0`; `page_runtime_programmatic_focus_calls: 0`; `native_scenario_programmatic_focus_total: 0`; `detector_positive_control_passed: true`. | **SELF_CHECK_REMEDIATED (PENDING CONTROLLER AUDIT)** |
| **F03** | **A03 Structured Contract Parity**: Bổ sung khối `fsm_verification_contract` có cấu trúc vào `COLOR_CONTRACT.yaml` và xây dựng parser + parity comparator trong harness. | 1. Bổ sung khối `fsm_verification_contract` vào `COLOR_CONTRACT.yaml` định nghĩa: selector `#action-btn-tf802`, `initial_state: IDLE`, 5 states, đồ thị `allowed_transitions`, `saving_guard`, và `no_steal_on_async_completion: true`.<br>2. Viết hàm `parseFsmContractBlock()` và `verifyStructuredFsmParity()` đối chiếu có cấu trúc với runtime timeline và focus sequence. | `contract_matches_runtime_fsm: true`; `contract_runtime_mismatches: []`; Không có bất kỳ sai lệch nào giữa hợp đồng và thực thi. | **SELF_CHECK_REMEDIATED (PENDING CONTROLLER AUDIT)** |
| **F04** | **A04/A05 Token Provenance & Classification**: Semantic tokens phải là `var(--primitive-*)` hoặc sentinel (`transparent`, `currentColor`), 0 literal colors. Phân loại đủ 51 component tokens (45 color-bearing, 6 non-color spatial như `icon-size: 14px`). Mọi color token phải phân giải về semantic. Có positive control test fixture. | 1. Gate C01 kiểm toán 38 semantic tokens trong Candidate (114 system-wide across 3 files): 0 literal colors, 0 invalid non-var, 0 unresolved. Tất cả đều trỏ về primitive hoặc sentinel.<br>2. Mở rộng từ khóa `nonColorPropKeywords` bao gồm `icon-size`, `border-width`, `size`, phân loại chính xác: Option A có 40 color + 8 non-color (40/40 resolved); Candidate có 45 color + 6 non-color (45/45 resolved); Option B có 39 color + 7 non-color (39/39 resolved).<br>3. Viết `runTokenDetectorPositiveControl()` với fixture CSS bẩn chứa đúng 5 vi phạm. Bộ phát hiện bắt chính xác $5/5$ vi phạm (`passed: true`). | `token_detector_positive_control_passed: true`; Candidate component tokens: `color_bearing: 45`, `non_color_spatial: 6`, `resolved: 45`, `unresolved: 0`, `component_to_primitive_direct_refs: 0`; Semantic tokens: `total: 38`, `literal_colors: 0`, `invalid_non_var: 0`. C01 PASS. | **SELF_CHECK_REMEDIATED (PENDING CONTROLLER AUDIT)** |
| **F05** | **Gate C07 Evidence Integrity**: Kiểm toán độc lập mã băm nguồn đóng băng, 5 văn bản Controller byte-identical, 9 screenshots nguyên vẹn, quét report governance (0 phán quyết PASS đơn phương, 0 self-closed findings), đồng bộ cross-ledger. | Tích hợp khối kiểm toán C07 độc lập trong `verify_module_008.js`: kiểm tra tự động mã băm của candidate và option A, kiểm tra 5 tệp review của Sol, kiểm tra 9 tệp ảnh, quét nội dung báo cáo bảo đảm không chứa từ khóa phán quyết trái quyền và không có self-closed findings, đối soát các số lượng token/role giữa báo cáo và ledger. | `frozen_hashes_verified: true`; `official_document_hashes_verified: true`; `screenshot_integrity_verified: true`; `report_governance_verified: true`; `report_verification_mismatches: []`; `hardcoded_evidence_booleans: 0`. C07 SELF_CHECK_PASS. | **SELF_CHECK_REMEDIATED (PENDING CONTROLLER AUDIT)** |

---

## 1. MỤC TIÊU & DỮ LIỆU CHUẨN (OBJECTIVE & CANONICAL FIXTURE)

### 1.1. Tuyên Bố Phân Loại Dữ Liệu & Miễn Trừ Trách Nhiệm (Governance & Disclaimer)
Căn cứ chỉ thị tối cao từ `DESIGN_TRAINING_STREAM_A_DIRECTIVE.md` và `DESIGN_TRAINING_008_FINAL_REVIEW_003.md`:

```yaml
DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
REAL_CUSTOMER_DATA: false
BUSINESS_PERFORMANCE_CLAIMS: none
```

* **Tuyên bố minh định về dữ liệu (`Data Provenance Disclaimer`)**: Toàn bộ dữ liệu điều phối, mã hiệu tour (`TF-801` đến `TF-804`), số lượng hành khách, tên điều phối viên và các tình huống nghiệp vụ trong báo cáo này hoàn toàn là **Dữ liệu Huấn luyện Giả lập (`Synthetic Training Fixture`)**, được kiến tạo phục vụ độc quyền cho việc thử nghiệm hệ thống token màu, kiểm chứng thuật toán tương phản quang học và đánh giá khả năng tiếp cận trong bài tập đào tạo nền tảng Module 08.
* **Không đại diện cho thực tế thương mại**: Báo cáo không chứa bất kỳ dữ liệu khách hàng thực tế nào (`Real Customer Data: false`), và không đưa ra bất kỳ khẳng định y sinh học, công thái học lâm sàng hoặc tuyên bố hiệu suất kinh doanh lữ hành thực tế nào (`Business Performance Claims: none`).

### 1.2. Mục Tiêu Cốt Lõi Của Module 08 (Core Objective)
Chuyển hóa màu sắc từ một yếu tố trang trí giao diện ngẫu hứng mang tính cảm tính thành một **Hệ Thống Màu Chức Năng Với Ràng Buộc Tương Phản Đo Lường Được (`Functional Color System with Measurable Contrast Constraints`)**:
1. Có khả năng giải thích nguồn gốc toán học thông qua độ chói tương đối sRGB (`sRGB Relative Luminance`).
2. Có thể kiểm tra viễn trắc tự động (`Programmatic Telemetry Verification`) thông qua công cụ kiểm thử độc lập.
3. Có khả năng thay đổi toàn bộ hướng thẩm mỹ nghệ thuật (`Art Direction`) mà không làm gãy vỡ linh kiện UI hay rò rỉ giá trị màu vật lý vào cấu trúc component.
4. Bảo đảm tính bao hàm (`Inclusive Design`) và khả năng tiếp cận: các cặp màu và chỉ báo được kiểm tra đáp ứng những tiêu chí WCAG được liệt kê trong phạm vi Module 08 (SC 1.4.1, SC 1.4.3, SC 1.4.11), không bao giờ dùng màu sắc làm tín hiệu nhận thức duy nhất.

### 1.3. Bộ Dữ Liệu Chuẩn Bốn Trạng Thái Vận Hành (Canonical Four-Tour Fixture)
Màn hình điều phối TRIPFLOW quản lý danh mục bốn tour tiêu biểu tương ứng với bốn trạng thái thuộc phân loại trạng thái vận hành ngữ nghĩa (`Semantic Operational Status Taxonomy`):
* **TF-801** — *Hạ Long Heritage Luxury Cruise*: `NORMAL` (Bình thường / Vận hành chuẩn).
* **TF-802** — *Tràng An Eco-Spiritual Odyssey*: `ATTENTION` (Cần lưu ý / Quá tải luồng khách bến thuyền).
* **TF-803** — *Sapa Fansipan Cloud Express*: `ERROR` (Khẩn cấp / Sự cố gió lớn tạm dừng cáp treo).
* **TF-804** — *Phong Nha Chasm Deep Expedition*: `SUCCESS` (Hoàn tất / Đã xác thực an toàn địa chất).

---

## 2. BA NGUYÊN TẮC THIẾT KẾ RÀNG BUỘC (THREE BOUNDED PRINCIPLES)

### 2.1. Phân Tách Vai Trò Thương Hiệu Khỏi Trạng Thái Vận Hành (`Brand vs Status Separation`)
* Màu sắc nhận diện thương hiệu chính (`Brand Primary`: Deep Slate Ink `#0F172A` trong Option A hoặc Technical Indigo `#3730A3` trong Option B) được bảo vệ nghiêm ngặt: **chỉ sử dụng cho logo, tiêu đề nhận diện, và nút hành động chính cấp cao nhất (`Primary Dispatch CTA`)**.
* **Tuyệt đối cấm** sử dụng Brand Primary để biểu thị trạng thái vận hành (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`). Trạng thái vận hành phải sử dụng các bảng màu chuyên biệt (`Semantic Palette`) để người điều phối không bao giờ nhầm lẫn giữa cấu trúc ứng dụng và tín hiệu khẩn nguy.

### 2.2. Phân Tách Trạng Thái Vận Hành Khỏi Máy Trạng Thái Tương Tác (`Status vs Interaction FSM Segregation`)
* **Phân loại Trạng thái Vận hành (`Operational Status Taxonomy`)**: Là thuộc tính dữ liệu nghiệp vụ của tour du lịch (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`).
* **Máy Trạng thái Hữu hạn Tương tác (`Interaction Finite State Machine — FSM`)**: Là trạng thái giao diện của hành động điều phối trên linh kiện (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
* Khi nhấn nút xử lý điều phối (ví dụ trên tour TF-802), nút chuyển dịch qua FSM:
  - `IDLE` (Khởi tạo, sẵn sàng tiếp nhận tương tác).
  - `VALIDATING` (Kiểm tra tham số, `aria-disabled="true"`, con trỏ bận).
  - `SAVING` (Đang đồng bộ phân bổ xe/thuyền, `aria-busy="true"`, chặn tương tác lặp).
  - `FAILURE` (Mô phỏng lỗi mạng/hạ tầng, hiển thị nút thử lại `btn-retry`, trả `aria-disabled="false"` mà không giật mất tiêu điểm bàn phím).
  - `CONFIRMED` (Xác nhận thành công, chuyển sang `btn-confirmed`, hiển thị trạng thái hoàn tất).
* Hai hệ thống phân loại này độc lập về mặt ngữ nghĩa và không được chồng chéo token.

### 2.3. Ba Tầng Cảm Quan Đồng Thời Cho Mọi Trạng Thái Vận Hành (`Three Synchronized Sensory Layers`)
Để tuân thủ WCAG 2.2 SC 1.4.1 (Use of Color), không có bất kỳ trạng thái vận hành nào được truyền tải duy nhất qua sắc độ màu sắc. Mỗi nhãn trạng thái (`status badge`) bắt buộc phải hiển thị đồng thời 3 tầng thông tin:
1. **Tầng 1 — Nhãn chữ tiếng Việt tường minh (`status_label`)**: Chữ viết hoa có dấu rõ ràng (`BÌNH THƯỜNG`, `LƯU Ý`, `KHẨN CẤP`, `HOÀN TẤT`).
2. **Tầng 2 — Ký hiệu hình học / SVG độc bản (`status_icon`)**: Hình dạng hình học phi màu sắc khác biệt hoàn toàn:
   - `NORMAL`: Vòng tròn đặc kèm biểu tượng chấm tròn ổn định.
   - `ATTENTION`: Tam giác cảnh báo kèm dấu chấm than.
   - `ERROR`: Hình thoi sắc cạnh kèm dấu X hoặc tia cảnh báo khẩn cấp.
   - `SUCCESS`: Hình khiên bảo vệ kèm dấu kiểm xác thực.
3. **Tầng 3 — Hệ token màu tương phản cao (`status_color`)**: Bộ ba token (nền, viền, chữ) đạt chuẩn tương phản cao trên nền canvas.

---

## 3. PHÂN TÍCH HAI HƯỚNG NGHỆ THUẬT (TWO COLOR DIRECTIONS ANALYSIS)

| Tiêu Chí Đánh Giá | Hướng A — Editorial Warm Dispatch (`directions/option_a.html`) | Hướng B — Technical Slate High-Contrast (`directions/option_b.html`) |
|---|---|---|
| **Luận đề Thị giác (`Visual Thesis`)** | *Sổ cái Điều phối Giấy ngà Trầm ấm*: Lấy cảm hứng từ bảng điều phối giấy thủ công cao cấp kết hợp mực in phiến đá, mang lại cảm giác tĩnh tại, giảm căng thẳng thị giác cho nhân viên điều phối làm việc ca đêm dài. | *Bảng Giám sát Kỹ thuật Tương phản Cao*: Lấy cảm hứng từ màn hình trung tâm kiểm soát bay và giao diện radar hàng hải, tối đa hóa độ sắc nét của ký tự và mã hiệu dưới ánh sáng môi trường mạnh. |
| **Bảng Màu Nền (`Canvas Surface`)** | Nền Alabaster ấm `#FAF9F6`, bề mặt thẻ Trắng ấm `#FFFFFF`. | Nền Ice Slate lạnh `#F8FAFC`, bề mặt thẻ Trắng tinh khiết `#FFFFFF`. |
| **Màu Thương Hiệu (`Brand Primary`)** | Deep Slate Ink `#0F172A` (Mực đá phiến sâu thẳm). | Technical Indigo `#3730A3` (Chàm kỹ thuật điện tử). |
| **Vòng Tiêu Điểm Bàn Phím (`Focus Ring`)** | Amber sáng ấm `#D97706` (Tương phản quang học 3.19:1). | Cobalt điện tử `#2563EB` (Tương phản quang học 4.60:1). |
| **Chiến Lược Huy Hiệu Trạng Thái** | Nền phấn màu nhẹ nhàng (`calm pastel`), độ bão hòa kiểm soát, đường viền thanh lịch 1px. | Màu nền đậm đà rõ khối, đường viền cấu trúc 1.5px nổi bật. |
| **Bóng Đổ Giao Diện (`Elevation Shadow`)** | Mềm mại, khuếch tán rộng `rgba(15, 23, 42, 0.05)`. | Sắc nét, tương phản góc cạnh `rgba(2, 6, 23, 0.08)`. |

---

## 4. HƯỚNG ĐƯỢC CHỌN & PHÂN TÍCH ĐÁNH ĐỔI (SELECTED CANDIDATE: OPTION A REFINED)

### 4.1. Quyết Định Lựa Chọn Hướng Đi
Hướng **Option A Refined (Editorial Warm Dispatch)** được chọn làm ứng viên phát hành chính thức trong `index.html`, và đã được Architectural Controller Sol chính thức chấp thuận (`ACCEPTED_FOR_EXERCISE`).

### 4.2. Đánh Đổi Kỹ Thuật & Thẩm Mỹ (`Engineering & Aesthetic Trade-offs`)
1. **Đánh đổi về cảm giác nhiệt độ màu**: Nền Warm Alabaster (`#FAF9F6`) tạo cảm giác dịu mắt và thoải mái trong ca trực kéo dài, nhưng biên độ tương phản tuyệt đối của một số nhãn chữ phụ thấp hơn một chút so với nền Cool Ice Slate (`#F8FAFC`) của Option B. Tuy nhiên, toàn bộ 42 vai trò đều vượt ngưỡng WCAG 2.2 AA.
2. **Đánh đổi về cấu trúc viền**: Option A sử dụng viền tinh tế 1px để duy trì tính trang nhã, đòi hỏi việc tính toán độ tương phản của chữ bên trong badge phải cao hơn (tất cả đều đạt $ge 4.5:1$, ví dụ Attention Text đạt `4.5097:1`).

---

## 5. BẢNG ĐỐI CHIẾU YÊU CẦU — BẰNG CHỨNG VIỄN TRẮC (REQUIREMENT TO EVIDENCE MAPPING)

| Mã Yêu Cầu | Tên Cổng Kiểm Tra | Ràng Buộc Kỹ Thuật Bắt Buộc | Bằng Chứng Viễn Trắc Thực Tế (`VERIFICATION.json`) | Kết Quả Tự Kiểm |
|:---:|---|---|---|:---:|
| **Invariant** | **Zero Motion Compliance** | 0 transitions, 0 animations, 0 keyframes; đồng hồ đứng yên. | `transition_duration: 0s`; `animation_name: none`; `keyframes: 0`; `clock_frozen: true`. | **SELF_CHECK_PASS** |
| **Gate C01** | **Token Architecture** | Kiến trúc 3 tầng nghiêm ngặt; 0 literal trong semantic tokens; 0 primitive leak; phân loại 51 component tokens. | 38 semantic tokens (0 literal, 0 invalid non-var); 51 component tokens: 45 color-bearing (45/45 resolved) + 6 non-color; 0 primitive refs in selectors; detector positive control passed. | **SELF_CHECK_PASS** |
| **Gate C02** | **Two Directions** | Hai hướng nghệ thuật khác biệt rõ nét trên cùng bộ dữ liệu 4 tour canonical. | Option A (`#FAF9F6`, `#0F172A`) vs Option B (`#F8FAFC`, `#3730A3`); cả hai render đầy đủ 4 tour. | **SELF_CHECK_PASS** |
| **Gate C03** | **Contrast Inventory** | 42/42 vai trò đo đạc từ DOM computed styles; text $ge 4.5:1$ (lớn $ge 3:1$); non-text $ge 3:1$. | Đo đạc đầy đủ 42 vai trò thực tế; 0 fallback; 0 activation fails; mọi vai trò text/non-text đều đạt ngưỡng hoặc miễn trừ hợp lệ. | **SELF_CHECK_PASS** |
| **Gate C04** | **Color Independence** | Đủ 3 tầng cảm quan (chữ + icon + màu); 3 ảnh mô phỏng CVD (Grayscale, Deuteranopia, Protanopia). | 4/4 trạng thái có đủ 3 tầng cảm quan; 3 ảnh CVD artifacts được sinh với ma trận chuẩn và kiểm chứng kích thước. | **SELF_CHECK_PASS** |
| **Gate C05** | **Native Focus Traversal** | Vòng focus $ge 2px$ solid, tương phản $ge 3:1$ trên Primary CTA, Secondary Button, Tour Action. | Primary CTA: 2px solid, 3.0259:1; Secondary: 2px solid, 3.1858:1; Tour Action: 2px solid, 3.1858:1. | **SELF_CHECK_PASS** |
| **Gate C06** | **Responsive Cadence** | Không tràn ngang (`scrollWidth <= innerWidth`) trên 3 viewports; caption block tỷ lệ 1:1. | Desktop (1440px), Tablet (768px), Mobile (390px) đều 0 overflow; caption block tỷ lệ 1.0 không phân mảnh. | **SELF_CHECK_PASS** |
| **Gate C07** | **Evidence Integrity** | Khóa băm nguồn đóng băng; 5 reviews nguyên vẹn; 9 ảnh chuẩn; report governance sạch; đồng bộ viễn trắc. | Frozen hashes verified; 5 official reviews byte-identical; 9 screenshots verified; report governance passed; cross-ledger sync 100%. | **SELF_CHECK_PASS** |

---

## 6. DỮ LIỆU VIỄN TRẮC CHI TIẾT (DETAILED TELEMETRY EVIDENCE)

### 6.1. Bảng Đo Đạc Tương Phản 42 Vai Trò Giao Diện (Gate C03 Role Inventory)

| Mã Role (`role_id`) | Tên Vai Trò Giao Diện | Phân Loại | Màu Chữ (FG) | Màu Nền (BG) | Phương Pháp Đo | Tỷ Lệ Đo Đạc | Ngưỡng Yêu Cầu | Kết Quả Tự Kiểm |
|---|---|---|---|---|---|---|---|:---:|
| `role_canvas_body` | Default Canvas Body Text | `normal_text` | `rgb(15, 23, 42)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **16.9564:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_fixture_notice_text` | Fixture Notice Banner Text | `normal_text` | `rgb(71, 85, 105)` | `rgb(245, 244, 240)` | `runtime_computed_static` | **6.8852:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_fixture_notice_tag` | Fixture Notice Tag Text | `normal_text` | `rgb(255, 255, 255)` | `rgb(15, 23, 42)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_brand_logo` | Brand Identity Logo Link | `large_text` | `rgb(15, 23, 42)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **16.9564:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_brand_direction_tag` | Brand Direction Tag | `normal_text` | `rgb(71, 85, 105)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **7.1973:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_app_headline_h1` | App Header Headline H1 | `large_text` | `rgb(15, 23, 42)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **16.9564:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_live_clock_text` | Live System Clock Text | `normal_text` | `rgb(71, 85, 105)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **7.1973:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_kpi_label` | KPI Metric Label | `normal_text` | `rgb(71, 85, 105)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **7.5777:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_kpi_value` | KPI Metric Value | `large_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_kpi_subtext` | KPI Metric Subtext | `normal_text` | `rgb(100, 116, 139)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **4.7588:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_search_input_text` | Search Input Text | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_search_input_placeholder` | Search Input Placeholder | `normal_text` | `rgb(100, 116, 139)` | `rgb(255, 255, 255)` | `runtime_computed_placeholder` | **4.7588:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_search_input_border` | Search Input Structural Border | `meaningful_non_text` | `rgb(100, 116, 139)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **4.7588:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_filter_tab_inactive` | Filter Tab Inactive | `normal_text` | `rgb(71, 85, 105)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **7.5777:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_filter_tab_active` | Filter Tab Active | `normal_text` | `rgb(255, 255, 255)` | `rgb(15, 23, 42)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_primary_cta_default` | Primary CTA Default Text | `normal_text` | `rgb(255, 255, 255)` | `rgb(15, 23, 42)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_primary_cta_hover` | Primary CTA Hover Text | `normal_text` | `rgb(255, 255, 255)` | `rgb(30, 41, 59)` | `runtime_computed_hover` | **14.6287:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_primary_cta_active` | Primary CTA Active Text | `normal_text` | `rgb(255, 255, 255)` | `rgb(2, 6, 23)` | `runtime_computed_active` | **20.1728:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_secondary_btn_default` | Secondary Action Button Default | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_secondary_btn_hover` | Secondary Action Button Hover | `normal_text` | `rgb(15, 23, 42)` | `rgb(245, 244, 240)` | `runtime_computed_hover` | **16.2212:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_table_caption` | Table Caption Title | `large_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_table_header` | Table Header Column Text | `normal_text` | `rgb(71, 85, 105)` | `rgb(245, 244, 240)` | `runtime_computed_static` | **6.8852:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_title` | Tour Title (.tour-title) | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_note` | Tour Note / Route Context | `normal_text` | `rgb(71, 85, 105)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **7.5777:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_id` | Tour ID Code (.tour-id) | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_subcode` | Tour Subcode (.tour-subcode) | `normal_text` | `rgb(100, 116, 139)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **4.7588:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_pax` | Tour Pax Tabular Number | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_tour_coordinator` | Tour Coordinator Name | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_badge_normal_text` | Badge NORMAL Text | `normal_text` | `rgb(71, 85, 105)` | `rgb(241, 245, 249)` | `runtime_computed_static` | **6.9170:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_badge_attention_text` | Badge ATTENTION Text | `normal_text` | `rgb(180, 83, 9)` | `rgb(254, 243, 199)` | `runtime_computed_static` | **4.5097:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_badge_error_text` | Badge ERROR Text | `normal_text` | `rgb(190, 18, 60)` | `rgb(255, 228, 230)` | `runtime_computed_static` | **5.2352:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_badge_success_text` | Badge SUCCESS Text | `normal_text` | `rgb(21, 128, 61)` | `rgb(220, 252, 231)` | `runtime_computed_static` | **4.5669:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_badge_normal_border` | Badge NORMAL Border | `decorative` | `rgb(203, 213, 225)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **1.4102:1** | Miễn trừ SC 1.4.11 | **SELF_CHECK_PASS (EXEMPT)** |
| `role_badge_attention_border` | Badge ATTENTION Border | `decorative` | `rgb(245, 158, 11)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **2.0399:1** | Miễn trừ SC 1.4.11 | **SELF_CHECK_PASS (EXEMPT)** |
| `role_badge_error_border` | Badge ERROR Border | `decorative` | `rgb(244, 63, 94)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **3.4875:1** | Miễn trừ SC 1.4.11 | **SELF_CHECK_PASS (EXEMPT)** |
| `role_badge_success_border` | Badge SUCCESS Border | `decorative` | `rgb(34, 197, 94)` | `rgb(250, 249, 246)` | `runtime_computed_static` | **2.1642:1** | Miễn trừ SC 1.4.11 | **SELF_CHECK_PASS (EXEMPT)** |
| `role_tour_action_btn` | Tour Action Button (TF-802) | `normal_text` | `rgb(15, 23, 42)` | `rgb(255, 255, 255)` | `runtime_computed_static` | **17.8525:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_emergency_action_default` | Emergency Action Default (TF-803) | `normal_text` | `rgb(190, 18, 60)` | `rgb(255, 228, 230)` | `runtime_computed_static` | **5.2352:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_emergency_action_hover` | Emergency Action Hover (TF-803) | `normal_text` | `rgb(190, 18, 60)` | `rgb(245, 244, 240)` | `runtime_computed_hover` | **5.7108:1** | >= 4.5:1 | **SELF_CHECK_PASS** |
| `role_focus_ring_primary_cta` | Focus Ring Primary CTA | `meaningful_non_text` | `rgb(217, 119, 6)` | `rgb(250, 249, 246)` | `runtime_computed_focus_native_tab` | **3.0259:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_focus_ring_secondary` | Focus Ring Search/Filter | `meaningful_non_text` | `rgb(217, 119, 6)` | `rgb(255, 255, 255)` | `runtime_computed_focus_native_tab` | **3.1858:1** | >= 3:1 | **SELF_CHECK_PASS** |
| `role_focus_ring_tour_action` | Focus Ring Tour Action Button | `meaningful_non_text` | `rgb(217, 119, 6)` | `rgb(255, 255, 255)` | `runtime_computed_focus_native_tab` | **3.1858:1** | >= 3:1 | **SELF_CHECK_PASS** |


---

### 6.2. Bảng Viễn Trắc Hành Trình 11 Bước Bàn Phím FSM (Gate C05 / FSM Telemetry)

| Bước | Tên Bước Viễn Trắc | Phương Thức Nhập Liệu | Active Element ID Thực Tế | ID Kỳ Vọng | Trạng Thái FSM | `aria-disabled` | `aria-busy` | Node Identity Đồng Nhất | Trạng Thái Tự Kiểm |
|:---:|---|---|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | `INITIAL_CLEAN_STATE` | `page_load` | `#BODY` | `#BODY` | `IDLE` | `false` | `false` | `true` | **SELF_CHECK_PASS** |
| 2 | `NAVIGATE_TO_ACTION_BTN` | `native_keyboard_tab_x10` | `#action-btn-tf802` | `#action-btn-tf802` | `IDLE` | `false` | `false` | `true` | **SELF_CHECK_PASS** |
| 3 | `ACTIVATION_1_VALIDATING` | `native_keyboard_enter` | `#action-btn-tf802` | `#action-btn-tf802` | `VALIDATING` | `true` | `true` | `true` | **SELF_CHECK_PASS** |
| 4 | `IN_FLIGHT_SAVING_STATE` | `async_timer` | `#action-btn-tf802` | `#action-btn-tf802` | `SAVING` | `true` | `true` | `true` | **SELF_CHECK_PASS** |
| 5 | `SAVING_DUPLICATE_GUARD_TEST` | `native_keyboard_enter_during_saving` | `#action-btn-tf802` | `#action-btn-tf802` | `SAVING` | `true` | `true` | `true` | **SELF_CHECK_PASS** |
| 6 | `TRANSITION_TO_FAILURE` | `async_timer_completion` | `#action-btn-tf802` | `#action-btn-tf802` | `FAILURE` | `false` | `false` | `true` | **SELF_CHECK_PASS** |
| 7 | `MOVE_FOCUS_AWAY` | `native_shift_tab_x6` | `#input-tour-search` | `#input-tour-search` | `FAILURE` | `false` | `false` | `true` | **SELF_CHECK_PASS** |
| 8 | `RETURN_FOCUS_FOR_RETRY` | `native_tab_x6` | `#action-btn-tf802` | `#action-btn-tf802` | `FAILURE` | `false` | `false` | `true` | **SELF_CHECK_PASS** |
| 9 | `ACTIVATION_2_RETRY_VALIDATING` | `native_keyboard_enter` | `#action-btn-tf802` | `#action-btn-tf802` | `VALIDATING` | `true` | `true` | `true` | **SELF_CHECK_PASS** |
| 10 | `MOVE_FOCUS_DURING_SAVING` | `native_shift_tab_x6` | `#input-tour-search` | `#input-tour-search` | `SAVING` | `true` | `true` | `true` | **SELF_CHECK_PASS** |
| 11 | `CONFIRMED_NO_STEAL_VERIFIED` | `async_timer_completion` | `#input-tour-search` | `#input-tour-search` | `CONFIRMED` | `false` | `false` | `true` | **SELF_CHECK_PASS** |


* **Tóm tắt viễn trắc FSM**:
  - `steps_recorded`: 11 (Tất cả 11 bước đều thỏa mãn assertion kiểm chứng).
  - `state_timeline`: `IDLE -> VALIDATING -> SAVING -> FAILURE -> VALIDATING_RETRY -> SAVING_RETRY -> CONFIRMED`.
  - `stable_node_identity_verified`: `true` (`window.__fsmInitNode === btn` duy trì bất biến).
  - `no_steal_verified`: `true` (Tiêu điểm bàn phím ở lại `input-tour-search` khi tiến trình async hoàn tất).
  - `body_focus_events`: `0`.
  - `harness_source_programmatic_focus_calls`: `0`.
  - `page_runtime_programmatic_focus_calls`: `0`.
  - `native_scenario_programmatic_focus_total`: `0`.
  - `detector_positive_control_passed`: `true`.
  - `contract_matches_runtime_fsm`: `true` (`contract_runtime_mismatches: []`).

---

### 6.3. Bảng Kiểm Tra 9 Tệp Ảnh Authoritative DPR=2 (Gate C07 Screenshots Inventory)

| Tên File Ảnh | Viewport CSS | Độ Phân Giải Pixel Thực Tế (DPR=2) | Dung Lượng File | Mã Băm Toàn Vẹn SHA-256 | Mô Tả Mục Tiêu Thẩm Định |
|---|---|---|---|---|---|
| `option_a_desktop_1440x900.png` | 1440x900 | $2880 \times 1932$ | 328,153 bytes | `86bfc892dcdbd067fa93dd1ce9661588f9f0d02364326111a6f68374e8abe0ad` | Thẩm định hướng nghệ thuật Sổ cái Giấy ngà Alabaster (Desktop 1440x900 DPR=2) |
| `option_b_desktop_1440x900.png` | 1440x900 | $2880 \times 1800$ | 268,167 bytes | `eb0303c67a464057707c188a06195db6c7440a4e6329d811b6a5f4dd8433c05d` | Thẩm định hướng nghệ thuật Bảng Kỹ thuật Tương phản cao (Desktop 1440x900 DPR=2) |
| `final_desktop_1440x900.png` | 1440x900 | $2880 \times 2032$ | 337,684 bytes | `97319ddc3cba097df5e2a533a451a7c4dec30a5d1ca6a5af3f29cab5a96b9faf` | Thẩm định bản Candidate hoàn thiện đầy đủ tính năng (Desktop 1440x900 DPR=2) |
| `final_tablet_768x1024.png` | 768x1024 | $1536 \times 4214$ | 392,218 bytes | `ebb0b88041e7c43dc02b364f1695342a46b779fe450425719432d77ba47407a1` | Thẩm định bố cục co giãn dạng lưới hai cột kèm tiêu đề caption block (Tablet 768x1024 DPR=2) |
| `final_mobile_390x844.png` | 390x844 | $780 \times 5620$ | 396,021 bytes | `a2132ab1c7df5d0e6224f58923e41a0b5f5c885481fcb423e60c8a3dc551b877` | Thẩm định thẻ dọc hiển thị trọn vẹn 6 trường dữ liệu kèm caption block 0 tràn ngang (Mobile 390x844 DPR=2) |
| `final_mobile_first_view_390x844.png` | 390x844 | $780 \times 1688$ | 104,965 bytes | `c65222449e36e73f23eecb3e73e62590260e2a2c888f81e9342fbd4ef6f71654` | Thẩm định màn hình đầu tiên trên mobile chứng minh không bị khoảng trống tìm kiếm (Mobile 390x844 DPR=2) |
| `final_grayscale_desktop_1440x900.png` | 1440x900 | $2880 \times 2032$ | 330,195 bytes | `4556039ef70e7328ef454e5785d9c738f9d4945447ff0595ac2056ae84f394a2` | Thẩm định phân tầng thị giác phi màu sắc khử toàn bộ sắc độ (Grayscale Desktop 1440x900 DPR=2) |
| `final_deuteranopia_desktop_1440x900.png` | 1440x900 | $2880 \times 2032$ | 372,744 bytes | `bbc4cf8026f0bdae7ba358b8fc958aaa4e548bc959bc6d4aee826df8f68b3cad` | Thẩm định phân biệt trạng thái mô phỏng mù xanh lá (MODULE_APPROXIMATION_MATRIX Deuteranopia sRGB) |
| `final_protanopia_desktop_1440x900.png` | 1440x900 | $2880 \times 2032$ | 371,550 bytes | `b1969894b68902be6cd655f67c0af515b890ccd69fbfeaeb22c9efefc449de52` | Thẩm định phân biệt trạng thái mô phỏng mù đỏ (MODULE_APPROXIMATION_MATRIX Protanopia sRGB) |


---

## 7. BỐN GÓC NHÌN TỰ ĐÁNH GIÁ (SELF-CRITIQUE QUADRANT)

### 7.1. Điểm Mạnh Nổi Bật (`STRENGTH`)
1. **Kiến trúc Token 3 Tầng Nghiêm Ngặt**: Phân tách rành mạch Primitive $	o$ Semantic $	o$ Component; 0 rò rỉ primitive tokens trong component selectors; 0 literal colors trong semantic tokens.
2. **Khép Kín Kiểm Chứng Pháp Y Tự Động**: Toàn bộ viễn trắc FSM, tương phản quang học, và kiểm tra tính toàn vẹn được đo đạc tự động từ runtime DOM, không dựa trên bất kỳ hằng số boolean gán sẵn nào.
3. **Tuân Thủ Tiếp Cận Đa Tầng**: 100% trạng thái vận hành đều có đủ 3 tầng cảm quan (chữ, biểu tượng hình học SVG, và màu tương phản cao), bảo đảm khả năng tiếp cận hoàn hảo khi mất màu hoặc suy giảm thị lực.

### 7.2. Điểm Hạn Chế Còn Tồn Tại (`DEFECT`)
1. **Độ Tương Phản Viền Của Một Số Huy Hiệu Chỉ Đạt Mức Khuyến Nghị**: Mặc dù viền huy hiệu trạng thái thuộc diện miễn trừ theo WCAG 2.2 SC 1.4.11 (do đã có nền và chữ đạt chuẩn), viền của badge Normal (1.41:1) và Attention (2.04:1) trong Option A có độ tương phản dưới 3:1 đối với nền thẻ. Trong các phiên bản mở rộng tiếp theo, độ chói của viền có thể được tăng cường để tạo độ tách khối sắc nét hơn.

### 7.3. Điểm Đánh Đổi Thiết Kế (`TRADEOFF`)
1. **Sự Êm Dịu Thị Giác vs Độ Tương Phản Gai Góc**: Việc lựa chọn nền Alabaster `#FAF9F6` giúp giảm mỏi mắt cho người điều phối làm việc ca dài, nhưng đổi lại phải kiểm soát dải màu chữ phụ trong khoảng 4.5:1 – 7.5:1, không thể đạt mức siêu tương phản 18:1 như nền trắng tuyết.

### 7.4. Thiên Hướng Thiết Kế Chủ Quan (`PREFERENCE`)
1. **Ưa Chuộng Phong Cách Editorial**: Antigravity có thiên hướng yêu thích ngôn ngữ thiết kế trang nhã, ấm áp kiểu typography biên tập (`Editorial typography`) với viền mỏng và nền màu ấm hơn là phong cách phần mềm công nghiệp khô cứng (`Raw technical UI`).

---

## 8. KIẾN NGHỊ PHÁN QUYẾT (SUBMISSION VERDICT RECOMMENDATION)

```yaml
VERDICT: SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_AUDIT
MODULE_COMPLETED: PENDING_CONTROLLER_VERDICT
STREAM_STATUS: FOUNDATION_INTEGRITY_AUDIT_CORRECTION_001
REMEDIAL_FINDINGS_STATUS:
  F01_A01_FSM_JOURNEY: SELF_CHECK_REMEDIATED
  F02_A02_PROGRAMMATIC_FOCUS: SELF_CHECK_REMEDIATED
  F03_A03_CONTRACT_PARITY: SELF_CHECK_REMEDIATED
  F04_A04_A05_TOKEN_AUDIT_CLASSIFICATION: SELF_CHECK_REMEDIATED
  F05_C07_EVIDENCE_INTEGRITY: SELF_CHECK_REMEDIATED
HARDCODED_EVIDENCE_BOOLEANS: 0
PROGRAMMATIC_FOCUS_CALLS: 0
CROSS_LEDGER_PARITY: SYNCHRONIZED
PACKAGE_DELIVERABLE: design_training_008_verification_audit_correction_001.zip
```

Toàn bộ hồ sơ kiểm chứng, sổ cái viễn trắc và gói tài liệu nộp chính thức đã được Antigravity hoàn thiện khép kín với đầy đủ bằng chứng thực nghiệm, sẵn sàng trình nộp lên **Architectural Controller Sol** để tiến hành quy trình thẩm định độc lập sau cùng.
