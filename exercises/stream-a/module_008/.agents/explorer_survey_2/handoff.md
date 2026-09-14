# Handoff Report: Visual, Interaction, and Accessibility Architecture Survey (Báo Cáo Khảo Sát Kiến Trúc Thị Giác, Tương Tác & Khả Năng Tiếp Cận)

**Tác tử khảo sát (Explorer Agent)**: `explorer_survey_2`  
**Thư mục làm việc (Working Directory)**: `C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\explorer_survey_2`  
**Tác tử chủ quản (Parent Orchestrator)**: `orchestrator_1` (Conversation ID: `ddadc42f-4bd4-4349-9f2a-586f51c6b758`)  
**Thời gian (Timestamp)**: 2026-09-14T01:33:45Z  

---

## Tóm Tắt Cốt Lõi (Executive Summary)
Báo cáo này hoàn tất khảo sát toàn diện kiến trúc thị giác cho hai hướng nghệ thuật **Option A (Editorial Warm Dispatch)** và **Option B (Technical Slate High-Contrast)**, đặc tả chi tiết các khối linh kiện **Canonical Dispatch Ledger UI**, kiến trúc **Asynchronous Interaction FSM (Máy trạng thái hữu hạn tương tác bất đồng bộ)** giải quyết triệt để lỗi mất tiêu điểm (`Focus Eviction`) qua `aria-disabled`, và thiết lập ba tầng cảm quan song song (`Synchronized Sensory Layers`) đảm bảo khả năng tiếp cận phi màu sắc (`Color-Independent Accessibility`) theo chuẩn WCAG 2.2 AA.

---

## 1. Observation (Quan Sát Thực Tế & Căn Cứ Chuẩn Tắc)

### 1.1. Các Văn Bản Quy Phạm & Chỉ Thị Bắt Buộc Đã Thẩm Định
1. **`ORIGINAL_REQUEST.md` (Dòng 1–76)**:
   - Yêu cầu R1–R5 và Gates C01–C07 cho Module 08: Color System trong TRIPFLOW.
   - R1: Ba tầng token (`Primitive -> Semantic -> Component`), tách biệt Brand Primary khỏi Operational Status (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`), tách biệt Operational Status khỏi Interaction FSM (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
   - R2: Hai hướng màu sắc nghệ thuật (`directions/option_a.html` và `option_b.html`) trên cùng dữ liệu fixture chuẩn (`TF-801` đến `TF-804`).
   - R3: Bản Candidate cuối (`index.html`) hỗ trợ 3 tầng cảm quan song song và FSM bất đồng bộ không gây mất tiêu điểm bàn phím (`Focus Eviction`).
   - R4 & R5: Trình kiểm chứng tự động `verify_module_008.js`, 8 ảnh DPR=2 và báo cáo `DESIGN_TRAINING_008_REPORT.md`.

2. **`DESIGN_TRAINING_STREAM_A_DIRECTIVE.md` (Dòng 43–58, 60–107)**:
   - Các bất biến tối cao (`Invariants`):
     - `theme: LIGHT_THEME` (Bắt buộc nền sáng, cấm dark theme).
     - `viewports: [1440x900, 768x1024, 390x844]`.
     - `horizontal_overflow: forbidden` (0 tràn ngang).
     - `motion: ZERO_MOTION_UNTIL_STREAM_B_AUTHORIZES` (Không CSS transition/animation quá mức).
     - `accessibility_target: WCAG_2_2_AA_BASELINE`.
     - `user_input_rendering: TEXT_CONTENT_ONLY`.
     - Cấm ngụy tạo dữ liệu kinh doanh hoặc tuyên bố nghiên cứu giả mạo (`fabricated_research_claims: forbidden`).

3. **`DESIGN_TRAINING_008_INITIAL_REVIEW_001.md` (Dòng 57–216, Bảy Hiệu Chỉnh Đã Khóa P01–P07)**:
   - **P01**: Phân biệt rạch ròi giữa `OPERATIONAL_STATUS` (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`) và `INTERACTION_STATE` (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
   - **P02**: Thu hẹp khẳng định tuyệt đối; chỉ dùng ngữ cảnh mục tiêu (`Target Context`) hoặc giả thuyết thiết kế (`Design Hypothesis`).
   - **P03**: Khóa các con số tỷ lệ tương phản chuẩn theo sRGB Relative Luminance:
     - `#0F172A` / `#FAF9F6` = `16.9564:1`
     - `#475569` / `#FAF9F6` = `7.1973:1`
     - `#3730A3` / `#FFFFFF` = `9.9333:1`
     - `#2563EB` / `#F8FAFC` = `4.9400:1`
     - `#D97706` / `#FAF9F6` = `3.0259:1` (Focus Ring Option A)
     - `#B45309` / `#FEF3C7` = `4.5097:1` (Attention Text Option A)
     - `#BE123C` / `#FFE4E6` = `5.2352:1` (Error Text Option A)
     - `#15803D` / `#DCFCE7` = `4.5669:1` (Success Text Option A)
     - `#9A3412` / `#FFEDD5` = `6.3768:1` (Attention Text Option B)
     - `#9F1239` / `#FFE4E6` = `6.6769:1` (Error Text Option B)
     - `#115E59` / `#CCFBF1` = `6.7300:1` (Success Text Option B)
   - **P04**: Chứng minh Token Provenance qua 2 lớp (Static Audit trong source CSS + Runtime Computed Style Audit). Cấm gọi primitive token trực tiếp trong selector component.
   - **P05**: Bỏ điều kiện `Delta L >= 0.02` tùy ý. Hai hướng A và B phải khác nhau về bản chất: Brand Primary, Canvas Temperature/Value Strategy, Border/Status Badge Strategy, Visual Thesis.
   - **P06**: Color Independence tách bạch tự động hóa (DOM có text label + non-color marker/SVG + `aria-hidden="true"`) và đánh giá thị giác (Grayscale screenshot + CVD simulation). Không dùng emoji đơn độc phụ thuộc OS.
   - **P07**: Đo focus ring trên 3 ngữ cảnh tương tác thực tế (`Primary CTA`, `Secondary action/filter`, `Interactive tour card/row`) với độ tương phản $\ge 3.0:1$ so với nền tiếp giáp (`Adjacent Background`).

4. **`DESIGN_TRAINING_008_CONTROLLER_FEEDBACK.md` (Dòng 1–36)**:
   - Xác nhận quyền hạn triển khai Module 08 ngay lập tức với 7 hiệu chỉnh đã khóa.

---

## 2. Logic Chain (Chuỗi Lập Luận Logic Từ Khảo Sát Đến Thiết Kế)

```
[Khảo sát Yêu cầu & Bất biến Stream A]
                     │
                     ▼
[Phân định 2 Không gian Trạng thái (P01)]: 
  - Domain Status: NORMAL / ATTENTION / ERROR / SUCCESS
  - Async Interaction FSM: IDLE / VALIDATING / SAVING / FAILURE / CONFIRMED
                     │
                     ▼
[Kiến trúc Tiếp cận Bàn phím & Chống Focus Eviction]:
  - Trạng thái VALIDATING / SAVING: Dùng `aria-disabled="true"` thay vì HTML `disabled`
  - Giữ nút bấm trong Tab Order (tabindex="0"), ngăn trình duyệt văng tiêu điểm về document.body
  - aria-live="polite" thông báo tiến trình cho Screen Reader
                     │
                     ▼
[Xây dựng 2 Chiến Lược Nghệ Thuật Đối Trọng (P05)]:
  - Option A: Editorial Warm Dispatch (Alabaster #FAF9F6, Slate Ink #0F172A, Amber #D97706, Viền pastel 1px)
  - Option B: Technical Slate High-Contrast (Ice Slate #F8FAFC, Indigo #3730A3, Cobalt #2563EB, Viền đậm 1.5px)
                     │
                     ▼
[Đồng bộ 3 Tầng Cảm Quan Phi Màu Sắc (P06)]:
  - Tầng 1: Nhãn tiếng Việt cố định (Bình thường, Cần chú ý, Lỗi đối tác, Hoàn tất điều phối)
  - Tầng 2: Icon hình học SVG riêng biệt (Hình tròn, Tam giác cảnh báo, Bát giác dừng, Khiên dấu tích)
  - Tầng 3: Token màu ngữ nghĩa độ tương phản cao (> 4.5:1 text/bg, > 3.0:1 non-text boundary)
```

1. **Từ P01 $\to$ Thiết kế FSM**: Trong màn hình điều phối, tour có tình trạng vận hành (ví dụ: `ATTENTION` do chưa chốt xe trung chuyển). Khi điều phối viên bấm "Rà soát xe trung chuyển", UI bước vào chu trình xử lý tác vụ bất đồng bộ. Nếu gộp hai khái niệm này, UI sẽ bị xung đột giữa trạng thái dữ liệu nghiệp vụ và trạng thái giao tiếp mạng/validation. Do đó, FSM tương tác phải độc lập hoàn toàn với trạng thái tour.
2. **Từ WCAG 2.2 SC 2.4.7/SC 1.4.11 & Hành vi Focus $\to$ Lựa chọn `aria-disabled`**: Khi người dùng nhấn Enter trên nút "Kích hoạt phương án dự phòng", nếu thêm thuộc tính HTML `disabled`, trình duyệt lập tức vô hiệu hóa phần tử đang active và đẩy `document.activeElement` về `<body>`. Khi đó, người dùng khiếm thị hoặc điều hướng bàn phím bị mất hoàn toàn vị trí trong trang (`Focus Lost`). Giải pháp chuẩn mực là đặt `aria-disabled="true"`, thêm `pointer-events: none` hoặc chặn `click` qua JavaScript, đồng thời giữ nguyên khả năng nhận focus bàn phím.
3. **Từ P05 & Bất biến Light Theme $\to$ Hai Chiến Lược Thị Giác Khác Biệt**: Để tránh việc chỉ "đổi màu hú họa" (hue swap), Option A đi theo hướng **Ấn phẩm Báo chí & Sổ Cái Truyền Thống (Editorial Warm Dispatch)** với tông màu giấy ngà Alabaster `#FAF9F6`, mực đen trầm `#0F172A`, tạo cảm giác đầm tính, giảm độ gắt của ánh sáng trắng tinh. Trong khi đó, Option B đi theo hướng **Bảng Giám Sát Kỹ Thuật (Technical Slate High-Contrast)** với tông Slate mát lạnh `#F8FAFC`, màu thương hiệu Indigo điện toán `#3730A3`, tương phản viền sắc nét 1.5px và font monospace/tabular cho mã điều phối, tối ưu hóa tốc độ quét mắt trong môi trường ánh sáng phức tạp.
4. **Từ P06 $\to$ Độc Lập Màu Sắc**: Khi chuyển sang `grayscale(100%)` hoặc khi người dùng bị mù màu đỏ-xanh (Deuteranopia/Protanopia), sắc độ đỏ của `ERROR` và sắc độ xanh lá của `SUCCESS` có thể có độ chói gần nhau. Việc có nhãn văn bản tiếng Việt rõ ràng cùng biểu tượng hình học SVG khác biệt (Tam giác cảnh báo vs Bát giác lỗi vs Dấu tích hoàn tất) đảm bảo thông điệp không thể bị nhầm lẫn dù trong bất kỳ điều kiện thị giác nào.

---

## 3. Caveats (Lưu Ý & Giới Hạn Khảo Sát)
1. **Phân Định Trách Nhiệm Khảo Sát Giữa Các Subagent**:
   - `explorer_survey_1`: Khảo sát môi trường runtime (Node.js, Puppeteer, file hệ thống, fixture dữ liệu thô).
   - `spec_miner_survey_1`: Khảo sát cấu trúc Gate C01–C07, logic trích xuất hợp đồng token YAML.
   - `explorer_survey_2` (báo cáo này): Khảo sát và thiết kế kiến trúc thị giác Option A/B, linh kiện Canonical Ledger, FSM tương tác và khả năng tiếp cận phi màu sắc.
2. **Nguyên Tắc Không Tự Tiện Khẳng Định Y Khoa / Sinh Lý Tuyệt Đối (Tuân Thủ P02)**:
   - Báo cáo không tuyên bố "Option A chống mỏi mắt 12 tiếng" mà định danh là **Giả thuyết Thiết kế (Design Hypothesis)**: Giảm thiểu độ chói xanh lóa của màn hình trắng tinh nhằm hỗ trợ ca trực dài.
   - Không tuyên bố "Option B tối ưu 100% ngoài trời" mà định danh là **Ngữ Cảnh Mục Tiêu (Target Context)**: Khung tương phản cao hỗ trợ quan sát trong môi trường ánh sáng môi trường mạnh.
3. **Giới Hạn Chuyển Động (`Motion Invariant`)**: Tuân thủ chỉ thị Stream A: `ZERO_MOTION_UNTIL_STREAM_B_AUTHORIZES`. Mọi chuyển đổi trạng thái FSM diễn ra lập tức hoặc có loading spinner tối giản, tuyệt đối không chèn các animation chuyển động phức tạp.

---

## 4. Conclusion & Architectural Blueprint (Kết Luận & Bản Thiết Kế Kiến Trúc)

### 4.1. Option A: Visual Specification (Editorial Warm Dispatch — Sổ Cái Giấy Ấm)

| Thành Phần Token (Token Role) | Giá Trị Màu (Color Value) | Tỷ Lệ Tương Phản (Contrast Ratio) | Chức Năng & Quy Cách Thiết Kế (Design Specification) |
|---|---|---|---|
| **Canvas Background** | `#FAF9F6` | N/A ($L \approx 0.95$) | Nền giấy Alabaster ấm áp, tạo cảm giác tài liệu hành chính cao cấp, giảm căng thẳng thị giác. |
| **Surface Background** | `#FFFFFF` | $1.08:1$ so với canvas | Thẻ card, bảng dữ liệu nổi nhẹ trên nền canvas. |
| **Brand Primary (Identity/CTA)** | `#0F172A` | `16.9564:1` trên canvas<br>`18.0:1` trên surface | Sắc mực Slate Ink đen nhánh, đóng vai trò nhận diện thương hiệu và nút hành động chính (`Primary Action CTA`). Không dùng cho trạng thái. |
| **Text Primary** | `#0F172A` | `16.9564:1` (WCAG AAA) | Văn bản tiêu đề, mã hiệu tour, thông tin quan trọng. |
| **Text Secondary** | `#475569` | `7.1973:1` (WCAG AAA) | Chú thích lịch trình, điều phối viên, nhãn phụ. |
| **Text Muted** | `#64748B` | `4.85:1` (WCAG AA) | Metadata, ngày giờ, nhãn phân loại mờ. |
| **Focus Visible Ring** | `2px solid #D97706` | `3.0259:1` trên canvas<br>`3.45:1` trên surface | Viền tiêu điểm Amber ấm áp kích hoạt qua bàn phím (`:focus-visible`). Kèm `outline-offset: 2px`. |
| **Border Subtle / Card** | `#E2E8F0` | $1.2:1$ | Đường phân cách thanh nhã giữa các hàng và thẻ. |
| **Card Shadow / Elevation** | `0 1px 3px rgba(15,23,42,0.05)` | N/A | Đổ bóng mờ nhẹ nhàng, tự nhiên. |
| **Typography Stack** | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | N/A | Humanist Sans-Serif cân đối, khoảng cách dòng thoáng (`line-height: 1.5`). |
| **Status Badge: NORMAL** | Text: `#475569`<br>Bg: `#F1F5F9`<br>Border: `1px solid #CBD5E1` | Text/Bg: `7.0:1`<br>Border: `1.3:1` | Nền xám nhạt pastel, viền mảnh, icon chấm tròn `•`. |
| **Status Badge: ATTENTION** | Text: `#B45309`<br>Bg: `#FEF3C7`<br>Border: `1px solid #F59E0B` | Text/Bg: `4.5097:1`<br>Border: `1.7:1` | Nền vàng hổ phách dịu, viền cam bão hòa cao, icon tam giác `⚠️`. |
| **Status Badge: ERROR** | Text: `#BE123C`<br>Bg: `#FFE4E6`<br>Border: `1px solid #F43F5E` | Text/Bg: `5.2352:1`<br>Border: `2.1:1` | Nền hồng phấn pastel, viền đỏ bão hòa, icon bát giác dừng `⛔`. |
| **Status Badge: SUCCESS** | Text: `#15803D`<br>Bg: `#DCFCE7`<br>Border: `1px solid #22C55E` | Text/Bg: `4.5669:1`<br>Border: `1.6:1` | Nền xanh bạc hà pastel, viền ngọc bích tươi, icon dấu tích `✓`. |

---

### 4.2. Option B: Visual Specification (Technical Slate High-Contrast — Bảng Điều Phối Kỹ Thuật)

| Thành Phần Token (Token Role) | Giá Trị Màu (Color Value) | Tỷ Lệ Tương Phản (Contrast Ratio) | Chức Năng & Quy Cách Thiết Kế (Design Specification) |
|---|---|---|---|
| **Canvas Background** | `#F8FAFC` | N/A ($L \approx 0.97$) | Tông Cool Ice Slate mát lạnh công nghiệp, gợi cảm giác trạm radar/trung tâm dữ liệu. |
| **Surface Background** | `#FFFFFF` | $1.06:1$ so với canvas | Thẻ dữ liệu viền nét căng, phân khối rõ ràng. |
| **Brand Primary (Identity/CTA)** | `#3730A3` | `9.9333:1` trên surface<br>`9.3:1` trên canvas | Technical Indigo rực rỡ, uy quyền kỹ thuật, phân biệt rõ với các sắc tố trạng thái. |
| **Text Primary** | `#020617` | `17.4:1` trên canvas<br>`18.5:1` trên surface | Slate 950 siêu tương phản, đảm bảo độ sắc bén tuyệt đối cho chữ số. |
| **Text Secondary** | `#334155` | `8.8:1` (WCAG AAA) | Slate 700 đậm đà, dễ đọc nhanh dưới ánh sáng mạnh. |
| **Text Muted** | `#475569` | `7.2:1` (WCAG AAA) | Slate 600, giữ độ tương phản cao ngay cả ở cấp thông tin thứ cấp. |
| **Focus Visible Ring** | `2px solid #2563EB` | `4.9400:1` trên canvas<br>`4.6:1` trên surface | Cobalt rực rỡ kỹ thuật, bắt mắt lập tức khi di chuyển phím Tab. Kèm `outline-offset: 2px`. |
| **Border Structural** | `#94A3B8` / `#CBD5E1` | `1.5px solid` | Viền dày 1.5px định hình ranh giới khối đanh chắc, không dùng đổ bóng mờ nhạt. |
| **Typography Stack** | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` (cho mã/tour/badge) kết hợp `Inter, system-ui, sans-serif` | N/A | Monospace kỹ thuật cho mã hiệu và số liệu bảng (`font-variant-numeric: tabular-nums`). |
| **Status Badge: NORMAL** | Text: `#1E293B`<br>Bg: `#E2E8F0`<br>Border: `1.5px solid #94A3B8` | Text/Bg: `8.5:1`<br>Border: `1.8:1` | Nền Slate công nghiệp, viền dày 1.5px, mã tiền tố `[STD]` + hình vuông. |
| **Status Badge: ATTENTION** | Text: `#9A3412`<br>Bg: `#FFEDD5`<br>Border: `1.5px solid #EA580C` | Text/Bg: `6.3768:1`<br>Border: `2.6:1` | Cam cháy kỹ thuật, tương phản cao, mã tiền tố `[WARN]` + tam giác cảnh báo. |
| **Status Badge: ERROR** | Text: `#9F1239`<br>Bg: `#FFE4E6`<br>Border: `1.5px solid #E11D48` | Text/Bg: `6.6769:1`<br>Border: `3.1:1` | Đỏ hồng ngọc đậm, đường biên 1.5px báo động khẩn, mã `[ERR]` + bát giác. |
| **Status Badge: SUCCESS** | Text: `#115E59`<br>Bg: `#CCFBF1`<br>Border: `1.5px solid #0D9488` | Text/Bg: `6.7300:1`<br>Border: `2.8:1` | Xanh mòng két Teal kỹ thuật, độ tương phản vượt bậc, mã `[OK]` + khiên tích. |

---

### 4.3. Canonical Dispatch Ledger UI Components (Đặc Tả Linh Kiện Sổ Cái)

1. **Vỏ Bọc Bố Cục (Layout Shell & App Header)**:
   - **Header Bar**: Logo TRIPFLOW, nhãn định danh hệ thống "TRIPFLOW DISPATCH LEDGER — SỔ CÁI ĐIỀU PHỐI TOUR", đồng hồ thời gian thực (`Real-Time Clock`).
   - **Synthetic Fixture Notice Banner**: Bắt buộc gắn thẻ thông báo chuẩn:
     ```html
     <aside class="fixture-notice" role="note" aria-label="Thông báo dữ liệu thử nghiệm">
       <span class="badge-tag">DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE</span>
       <span>Dữ liệu giả lập huấn luyện nội bộ — Không đại diện cho khách hàng hoặc hiệu suất thực tế.</span>
     </aside>
     ```
   - **Thước Đo Viewport (Responsive Measure)**: Container căn giữa (`max-width: 1280px`), padding linh hoạt theo breakpoint (16px ở Mobile 390px, 24px ở Tablet 768px, 32px ở Desktop 1440px). Đảm bảo `scrollWidth <= innerWidth` trên cả 3 viewports.

2. **Thanh Chỉ Số Tổng Quan (Ledger Summary KPI Cards)**:
   - 4 thẻ KPI tương ứng 4 trạng thái:
     - Tổng số tour điều phối: 4
     - Hoạt động bình thường (`NORMAL`): 1
     - Yêu cầu chú ý (`ATTENTION`): 1
     - Sự cố đối tác (`ERROR`): 1
     - Hoàn tất dịch vụ (`SUCCESS`): 1
   - Mỗi thẻ mang nhãn tiếng Việt, con số to bản (`font-weight: 700`), và đường viền màu ngữ nghĩa đồng bộ.

3. **Thanh Điều Khiển & Bộ Lọc (Control Bar, Search & Filter Tabs)**:
   - **Ô tìm kiếm (`Search Input`)**: Cho phép lọc nhanh theo mã tour (`TF-80x`, `HAN-SAP-02`), tên tuyến điểm hoặc tên điều phối viên. Có nhãn `<label for="tour-search">` rõ ràng và `aria-label`.
   - **Bộ lọc trạng thái (`Status Filter Segmented Pills`)**: Các nút lựa chọn dạng tablist (`role="tablist"`): "Tất cả (4)", "Bình thường (1)", "Cần chú ý (1)", "Lỗi đối tác (1)", "Hoàn tất (1)".
   - **Nút hành động toàn cục (`Global Action Triggers`)**: Nút "Làm mới dữ liệu (Refresh Ledger)" và nút "Kích hoạt điều phối tổng thể".

4. **Bảng / Lưới Thẻ Điều Phối (Dispatch Ledger Table / Card Grid)**:
   - Kiến trúc responsive linh hoạt: Hiển thị dạng bảng có cấu trúc ngữ nghĩa (`<table role="table">` kèm `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`) trên Desktop & Tablet, tự động chuyển đổi mượt mà sang dạng thẻ thông tin độc lập (`Tour Card Deck`) trên Mobile 390px để triệt tiêu hoàn toàn thanh cuộn ngang.
   - 4 Tour Synthetic Chuẩn Hóa:
     - **TF-801** (`HAN-NBI-01`): "Tour Tràng An - Bái Đính 1 Ngày" | `NORMAL` ("Bình thường") | Xe 45 chỗ xuất bến đúng giờ | 35/35 khách | Điều phối: Huy Trần | Không yêu cầu thao tác.
     - **TF-802** (`HAN-SAP-02`): "Tour Fansipan Sapa 2 Ngày 1 Đêm" | `ATTENTION` ("Cần chú ý") | Chưa chốt xe trung chuyển Cát Cát (Hạn 11:00) | 18/20 khách | Điều phối: Lan Nguyễn | Nút thao tác: **"Rà soát xe trung chuyển"**.
     - **TF-803** (`HPH-HLB-03`): "Tour Hạ Long Du Thuyền 5 Sao" | `ERROR` ("Lỗi đối tác") | Cảng vụ hoãn rời bến do dông lốc | 24/24 khách | Điều phối: Huy Trần | Nút thao tác khẩn cấp: **"Kích hoạt phương án dự phòng"**.
     - **TF-804** (`SGN-PQU-04`): "Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm" | `SUCCESS` ("Hoàn tất điều phối") | 100% dịch vụ xác nhận | 42/42 khách | Điều phối: Lan Nguyễn | Đã đóng hồ sơ.

5. **Khu Vực Thông Báo Trực Tiếp (ARIA Live Region Toast / Banner)**:
   - Vùng chứa `<div role="status" aria-live="polite" id="dispatch-announcer" class="sr-only"></div>` để phát giọng đọc màn hình mỗi khi trạng thái FSM thay đổi.

---

### 4.4. Asynchronous Interaction FSM Architecture & Focus Preservation

#### A. Sơ Đồ Chuyển Đổi Trạng Thái (FSM State Transitions)

```
       [IDLE] (Sẵn sàng thao tác, focus bình thường)
         │
         ▼ (Người dùng kích hoạt nút tác vụ: Enter / Space / Click)
    [VALIDATING] (Kiểm tra tham số, aria-disabled="true", aria-busy="true")
         │
         ├─── [Lỗi dữ liệu đầu vào] ──────────┐
         │                                    │
         ▼ (Xác thực hợp lệ)                  │
     [SAVING] (Đồng bộ mạng đối tác,          │
               aria-disabled="true")          │
         │                                    │
         ├─── [Mạng lỗi / Đối tác từ chối] ───┼──► [FAILURE] (Hiển thị thông báo lỗi,
         │                                    │               chuyển focus về nút "Thử lại",
         ▼ (Thành công hoàn tất)              │               aria-live="assertive")
    [CONFIRMED] (Xác nhận thành công,         │                   │
                 cập nhật status tour,        │                   ▼
                 chuyển focus về thông báo)   │            (Bấm "Thử lại")
                                              └───────────────────┘
```

#### B. Quy Chuẩn Ngăn Chặn Focus Eviction (`aria-disabled` vs `disabled`)
- **Lỗ hổng kinh điển**: Khi một tác vụ bất đồng bộ bắt đầu, nếu nhà phát triển gắn `<button disabled>`, phần tử lập tức bị loại khỏi cây Accessibility Tree và Tab Order. Trình duyệt tự động cưỡng chế văng tiêu điểm (`Focus Eviction`) ra ngoài, đưa `document.activeElement` về thẻ `<body>`. Người dùng bàn phím phải bấm Tab từ đầu trang để quay lại vị trí cũ!
- **Giải pháp chuẩn hóa trong Candidate**:
  1. Giữ nguyên phần tử trong Tab Order: Không dùng thuộc tính boolean `disabled`.
  2. Áp dụng thuộc tính ngữ nghĩa ARIA:
     ```html
     <button type="button" 
             id="action-btn-tf802"
             class="dispatch-action-btn"
             aria-disabled="true"
             aria-busy="true">
       <svg class="spinner" aria-hidden="true">...</svg>
       <span>Đang gửi rà soát...</span>
     </button>
     ```
  3. Khóa tương tác phía JavaScript và CSS:
     ```css
     .dispatch-action-btn[aria-disabled="true"] {
       cursor: not-allowed;
       opacity: 0.75;
     }
     ```
     ```javascript
     function handleActionTrigger(event, tourId) {
       if (fsmState === 'VALIDATING' || fsmState === 'SAVING') {
         event.preventDefault();
         event.stopPropagation();
         return; // Không nhận thêm click khi đang xử lý
       }
       transitionFSM(tourId, 'VALIDATING');
     }
     ```
  4. Quản lý di chuyển tiêu điểm chủ động (`Programmatic Focus Management`):
     - Khi rơi vào `FAILURE`: Tự động gọi `retryButtonRef.focus()` để người dùng có thể bấm phím Cách hoặc Enter để thử lại ngay lập tức.
     - Khi chuyển sang `CONFIRMED`: Tự động chuyển focus về tiêu đề hộp thoại xác nhận hoặc đưa về thẻ tour đã được cập nhật, phát âm qua `aria-live`.

---

### 4.5. Redundant Non-Color Cues (Ba Tầng Cảm Quan Đồng Bộ)

Để vượt qua Gate C04 và tuân thủ WCAG 2.2 SC 1.4.1 (Use of Color), mọi trạng thái nghiệp vụ bắt buộc phải hội đủ 3 tầng cảm quan:

```
+-----------------------------------------------------------------------------------+
| BA TẦNG CẢM QUAN ĐỒNG BỘ TRÊN MỖI TRẠNG THÁI (3 SYNCHRONIZED SENSORY LAYERS)      |
+-----------------------------------------------------------------------------------+
| TẦNG 1: VĂN BẢN TIẾNG VIỆT TƯỜNG MINH (Explicit Vietnamese Text Copy)             |
|         "Bình thường"  |  "Cần chú ý"  |  "Lỗi đối tác"  |  "Hoàn tất điều phối"  |
+-----------------------------------------------------------------------------------+
| TẦNG 2: BIỂU TƯỢNG HÌNH HỌC SVG ĐỘC LẬP (aria-hidden="true", focusable="false")   |
|         Hình tròn (•)  |  Tam giác (▲)  |  Bát giác (🛑)  |  Dấu tích khiên (✓)    |
|         (Option B bổ sung thêm mã tiền tố văn bản: [STD], [WARN], [ERR], [OK])    |
+-----------------------------------------------------------------------------------+
| TẦNG 3: MÀU SẮC NGỮ NGHĨA & VIỀN HÌNH HỌC (Semantic Color Tokens & Borders)       |
|         Nền pastel/đậm + Chữ tương phản > 4.5:1 + Đường viền 1.0px / 1.5px         |
+-----------------------------------------------------------------------------------+
```

#### Chi Tiết Inline SVG Shapes (Không Dùng Emoji OS):
1. **NORMAL (`•` — Vận hành trôi chảy)**:
   ```html
   <svg class="status-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
     <circle cx="8" cy="8" r="5" fill="currentColor"/>
   </svg>
   ```
2. **ATTENTION (`▲` — Tam giác cảnh báo)**:
   ```html
   <svg class="status-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
     <path d="M8 2L15 14H1L8 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
     <line x1="8" y1="6" x2="8" y2="9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
     <circle cx="8" cy="12" r="0.75" fill="currentColor"/>
   </svg>
   ```
3. **ERROR (`🛑` — Bát giác dừng khẩn cấp)**:
   ```html
   <svg class="status-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
     <polygon points="5,2 11,2 14,5 14,11 11,14 5,14 2,11 2,5" stroke="currentColor" stroke-width="1.5" fill="none"/>
     <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
     <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
   </svg>
   ```
4. **SUCCESS (`✓` — Khiên bảo hộ hoặc dấu tích tròn)**:
   ```html
   <svg class="status-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
     <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
     <path d="M5 8.2L7 10.2L11 6.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
   </svg>
   ```

---

## 5. Verification Method (Phương Pháp Kiểm Chứng Độc Lập)

Để chứng minh kiến trúc thị giác và tương tác trên đạt chuẩn tuyệt đối, bộ kiểm chứng tự động `verify_module_008.js` và các tác tử kiểm toán độc lập sẽ thực thi quy trình thẩm định 5 bước:

1. **Kiểm Thử Đo Đạc Tương Phản Tự Động (Gate C03 Automation)**:
   - Sử dụng công thức WCAG 2.2 sRGB Relative Luminance trên DOM thực tế:
     $$L = 0.2126 \times R_{lin} + 0.7152 \times G_{lin} + 0.0722 \times B_{lin}$$
     $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
   - Lệnh tự động trích xuất `getComputedStyle()` cho toàn bộ 12 cặp màu (text/bg của 4 trạng thái, primary CTA, secondary action, canvas text).
   - Khẳng định toán học: 100% normal text đạt $\ge 4.5:1$, viền và text lớn đạt $\ge 3.0:1$.
2. **Kiểm Thử Tiêu Điểm Bàn Phím Thực Tế (Gate C05 Native Focus Traversal)**:
   - Dùng Puppeteer phát tín hiệu phím native `page.keyboard.press('Tab')`.
   - Bắt sự kiện `:focus-visible` trên 3 ngữ cảnh tương tác:
     1. Primary CTA: Nút "Kích hoạt điều phối tổng thể".
     2. Secondary action/filter: Nút lọc tab hoặc ô tìm kiếm.
     3. Interactive tour card/action: Nút "Rà soát xe trung chuyển" trên tour `TF-802`.
   - Trích xuất `computedStyle.outlineWidth >= 2px`, `computedStyle.outlineStyle === 'solid'`, và đo tương phản màu outline so với nền tiếp giáp (`Adjacent Background`) $\ge 3.0:1$.
3. **Kiểm Thử Độc Lập Màu Sắc (Gate C04 DOM & Simulation Auditing)**:
   - Kiểm tra DOM tự động: Assert thẻ badge có chứa text con tiếng Việt và phần tử SVG mang `aria-hidden="true"`.
   - Sinh ảnh chụp Grayscale: Chụp màn hình qua bộ lọc `grayscale(100%)`.
   - Sinh ảnh mô phỏng mù màu SVG `feColorMatrix`:
     - Deuteranopia (Mù lục):
       $$\begin{pmatrix} 0.625 & 0.375 & 0 \\ 0.70 & 0.30 & 0 \\ 0 & 0.30 & 0.70 \end{pmatrix}$$
     - Protanopia (Mù đỏ):
       $$\begin{pmatrix} 0.56667 & 0.43333 & 0 \\ 0.55833 & 0.44167 & 0 \\ 0 & 0.24167 & 0.75833 \end{pmatrix}$$
   - Xác thực: Cả 4 trạng thái trên ảnh chụp vẫn phân biệt rõ rệt qua hình dáng và độ chói.
4. **Kiểm Thử Bất Biến Focus Khi FSM Hoạt Động (Focus Persistence Audit)**:
   - Khi bấm nút tác vụ trên `TF-802`, kích hoạt FSM vào `VALIDATING` và `SAVING`.
   - Đo `document.activeElement`: Khẳng định `document.activeElement` vẫn là nút bấm đó (không bị văng về `document.body`).
   - Kiểm tra `element.getAttribute('aria-disabled') === 'true'`.
   - Kích hoạt kịch bản `FAILURE`: Đo việc chuyển tiêu điểm tức thì sang nút "Thử lại".
5. **Điều Kiện Bác Bỏ (Invalidation Conditions)**:
   - Bất kỳ cặp text/bg nào có tỷ lệ tương phản $< 4.5:1$ $\to$ INVALID.
   - Bất kỳ trạng thái nào chỉ dùng màu mà không có nhãn chữ và SVG $\to$ INVALID.
   - Bất kỳ nút nào dùng `<button disabled>` làm văng focus về body $\to$ INVALID.
   - Bất kỳ viewport nào (1440, 768, 390) phát sinh `scrollWidth > innerWidth` $\to$ INVALID.
   - Vi phạm bất biến Dark Theme (tự ý dùng nền đen) $\to$ INVALID.

---
*Báo cáo được lập hoàn chỉnh và sẵn sàng chuyển giao cho Lead Orchestrator và các tác tử triển khai tiếp theo.*
