# Handoff Report: Option A (Editorial Warm Dispatch) Prototype Implementation
**Module**: DESIGN_TRAINING_008 (Color System) — Milestone 2 (R2 - Option A)  
**Agent**: `worker_m2_option_a`  
**Parent Orchestrator ID**: `ddadc42f-4bd4-4349-9f2a-586f51c6b758`  
**Working Directory**: `C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\worker_m2_option_a`  
**Deliverable File**: `C:\Users\game\.gemini\exercises\stream-a\module_008\directions\option_a.html`  
**Timestamp**: 2026-09-14T01:45:00Z  

---

## 1. Observation (Quan Sát Thực Tế & Căn Cứ Chuẩn Tắc)

1. **Văn bản quy phạm đã thẩm định**:
   - `ORIGINAL_REQUEST.md` (Dòng 22–27, Yêu cầu R2): Đặc tả Option A (Editorial Warm Dispatch): Nền giấy ngà Alabaster `#FAF9F6`, Màu nhận diện thương hiệu Deep Slate Ink `#0F172A`, Viền tiêu điểm bàn phím Amber `#D97706`, Badge trạng thái pastel với viền bão hòa cao thanh nhã 1.0px.
   - `COLOR_CONTRACT.yaml` (Dòng 504–560, `theme_profiles.option_a`):
     - Canvas Background: `--color-canvas-bg: var(--primitive-warm-neutral-50)` (`#FAF9F6`).
     - Surface Background: `--color-surface-bg: var(--primitive-static-white)` (`#FFFFFF`).
     - Brand Primary: `--color-brand-primary: var(--primitive-slate-900)` (`#0F172A`, 16.9564:1 trên canvas).
     - Focus Ring: `--color-focus-ring: var(--primitive-amber-600)` (`#D97706`, 3.0259:1 trên canvas, 3.1858:1 trên surface).
     - Status Normal: Text `#475569`, Bg `#F1F5F9`, Border `#CBD5E1` (6.9170:1).
     - Status Attention: Text `#B45309`, Bg `#FEF3C7`, Border `#F59E0B` (4.5097:1).
     - Status Error: Text `#BE123C`, Bg `#FFE4E6`, Border `#F43F5E` (5.2352:1).
     - Status Success: Text `#15803D`, Bg `#DCFCE7`, Border `#22C55E` (4.5669:1).
   - `DESIGN_TRAINING_008_INITIAL_REVIEW_001.md` (Dòng 57–216, Bảy Hiệu Chỉnh Đã Khóa P01–P07):
     - P01: Phân tách rạch ròi trạng thái vận hành (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`) và FSM tương tác (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
     - P03: Khóa các tỷ lệ tương phản sRGB chuẩn xác.
     - P04: Token Provenance 3 tầng, cấm component selector gọi trực tiếp `--primitive-*`.
     - P06: Ba tầng cảm quan đồng bộ (nhãn tiếng Việt + SVG shape `aria-hidden="true"` + màu ngữ nghĩa).
   - `verify_module_008.js` (Dòng 265–307, 372–471):
     - Gate C01 regex audit: quét các khối `<style>` tìm `var(--primitive-*)` bên ngoài `:root`.
     - Gate C02 direction telemetry: trích xuất `canvasBg`, `fontFamily`, `brandPrimary`, `focusRingToken`, `badgeBorderWidth`, và kiểm tra hiện diện đủ 4 tour synthetic (`TF-801` đến `TF-804`).

2. **Dữ liệu đo đạc thực nghiệm từ Headless Chrome / Puppeteer**:
   - `canvasBg`: `rgb(250, 249, 246)` (Khớp chính xác `#FAF9F6`).
   - `fontFamily`: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
   - `brandPrimary`: `rgb(15, 23, 42)` (Khớp chính xác `#0F172A`).
   - `focusRingToken`: `#D97706` (Màu Amber 600, outline 2px solid).
   - `badgeBorderWidth`: `1px` (solid).
   - `allFixturesPresent`: `true` (Cả 4 mã `TF-801`, `TF-802`, `TF-803`, `TF-804` đều hiển thị đầy đủ).
   - Tương phản 4 huy hiệu trạng thái:
     - `NORMAL`: FG `rgb(71, 85, 105)`, BG `rgb(241, 245, 249)` $\to$ `6.9170:1` (Vượt ngưỡng 4.5:1).
     - `ATTENTION`: FG `rgb(180, 83, 9)`, BG `rgb(254, 243, 199)` $\to$ `4.5097:1` (Vượt ngưỡng 4.5:1).
     - `ERROR`: FG `rgb(190, 18, 60)`, BG `rgb(255, 228, 230)` $\to$ `5.2352:1` (Vượt ngưỡng 4.5:1).
     - `SUCCESS`: FG `rgb(21, 128, 61)`, BG `rgb(220, 252, 231)` $\to$ `4.5669:1` (Vượt ngưỡng 4.5:1).
   - Responsive Cadence:
     - Desktop 1440x900: `scrollWidth = 1440px`, `innerWidth = 1440px`, `overflow = 0px` (PASS).
     - Tablet 768x1024: `scrollWidth = 768px`, `innerWidth = 768px`, `overflow = 0px` (PASS).
     - Mobile 390x844: `scrollWidth = 390px`, `innerWidth = 390px`, `overflow = 0px` (PASS).
   - Thử nghiệm FSM & Focus Preservation:
     - Trước thao tác: `activeElement` là `action-btn-tf802`.
     - Trạng thái VALIDATING: `aria-disabled="true"`, `aria-busy="true"`, `activeElement` vẫn giữ nguyên trên button.
     - Trạng thái SAVING: `aria-disabled="true"`, `aria-busy="true"`, `activeElement` vẫn giữ nguyên trên button.
     - Trạng thái CONFIRMED: `aria-disabled="false"`, `aria-busy="false"`, `activeElement` vẫn giữ nguyên trên button.
     - Không có thuộc tính HTML `disabled` nào được sử dụng $\to$ 0 sự kiện focus eviction về `document.body`.

---

## 2. Logic Chain (Chuỗi Lập Luận Logic Từ Quan Sát Đến Giải Pháp)

1. **Từ Yêu cầu Gate C01 (Token Provenance)**:
   - Trong khối `<style>`, `:root` định nghĩa toàn bộ 3 tầng: (1) Primitive tokens (`--primitive-*`), (2) Semantic tokens (`--color-*`) tham chiếu Primitive tokens, và (3) Component tokens (`--dispatch-*`) tham chiếu Semantic tokens.
   - Mọi quy tắc CSS cho component (`body`, `.dispatch-table`, `.status-badge`, `.btn-primary`, v.v.) chỉ tham chiếu `--color-*` hoặc `--dispatch-*`.
   - Kết quả kiểm tra regex độc lập: `primitive_calls_in_component_selectors: 0`, đảm bảo 100% đạt chuẩn Gate C01.

2. **Từ Yêu cầu Gate C02 & P05 (Khác Biệt Chiến Lược Nghệ Thuật Option A)**:
   - Option A không đơn thuần đổi hue mà thiết lập một luận đề thẩm mỹ hoàn chỉnh: **Editorial Warm Dispatch (Sổ Cái Giấy Ấm)**.
   - Sử dụng nền Alabaster `#FAF9F6` với nhiệt độ ấm dịu, bề mặt thẻ trắng `#FFFFFF`, kiểu chữ Humanist Sans-Serif cân đối cho các tác vụ hành chính điều phối dài giờ.
   - Nhận diện thương hiệu dùng sắc mực Slate Ink `#0F172A` thanh lịch cho logo và nút chính, hoàn toàn tách biệt khỏi 4 màu trạng thái vận hành.

3. **Từ Yêu cầu P06 & Gate C04 (Ba Tầng Cảm Quan Phi Màu Sắc)**:
   - Mỗi trạng thái vận hành trong bảng điều phối đều được tích hợp song song 3 lớp:
     1. Văn bản tiếng Việt cố định: "Bình thường", "Cần chú ý", "Lỗi đối tác", "Hoàn tất điều phối".
     2. Biểu tượng hình học SVG độc lập (`aria-hidden="true"`, `focusable="false"`): Hình tròn (Normal), Tam giác cảnh báo (Attention), Bát giác dừng khẩn cấp (Error), Dấu tích vòng tròn (Success).
     3. Màu sắc ngữ nghĩa đạt chuẩn WCAG 2.2 AA.

4. **Từ Yêu cầu P01 & Chống Mất Tiêu Điểm Bàn Phím (Focus Eviction)**:
   - Khi người dùng tương tác với nút "Rà soát xe trung chuyển" hoặc "Kích hoạt phương án dự phòng", giao diện kích hoạt FSM bất đồng bộ.
   - Thay vì dùng `disabled` (vốn làm trình duyệt tước quyền focus và cưỡng chế văng tiêu điểm ra `<body>`), component áp dụng `aria-disabled="true"`, khóa click qua logic JavaScript và cập nhật thông điệp qua vùng đọc màn hình `aria-live="polite"`. Tiêu điểm bàn phím được bảo toàn trọn vẹn.

5. **Từ Yêu cầu Tránh Xung Đột Selector (Self-Critique & Remediation)**:
   - Trong quá trình kiểm thử ban đầu, nhận thấy thuộc tính `data-status` trên thẻ `<tr>` làm cho bộ chọn `document.querySelector('[data-status="..."]')` bắt nhầm hàng bảng thay vì huy hiệu badge.
   - Đã chủ động tái cấu trúc: `<tr>` sử dụng `data-row-status`, dành riêng `data-status` cho `.status-badge`. Nhờ đó, bài kiểm tra tương phản và trích xuất style của test suite chạy hoàn hảo 100%.

---

## 3. Caveats (Lưu Ý & Giới Hạn)

- Báo cáo này áp dụng riêng cho bản mẫu đơn độc **Option A (Editorial Warm Dispatch)** trong `directions/option_a.html`.
- Các file `directions/option_b.html` (Option B), `index.html` (Release Candidate) và `VERIFICATION.json` do các tác tử chuyên trách khác sở hữu và hoàn thiện theo phân công của Orchestrator.
- Khẳng định thị giác của Option A được ghi nhận theo đúng quy chuẩn P02 là **Giả thuyết Thiết kế (Design Hypothesis)** cho môi trường làm việc văn phòng, không đưa ra tuyên bố y khoa tuyệt đối.

---

## 4. Conclusion (Kết Luận)

Bản mẫu `directions/option_a.html` đã được xây dựng hoàn thiện đạt chuẩn chất lượng xuất xưởng (Production-Grade):
- Tuân thủ 100% Hợp đồng Màu sắc `COLOR_CONTRACT.yaml`.
- Đạt 100% các tiêu chí kỹ thuật của Gate C01, Gate C02, Gate C03, Gate C04, Gate C05, Gate C06.
- 0 lỗi tràn ngang trên cả 3 kích thước màn hình (1440x900, 768x1024, 390x844).
- Bảo toàn tiêu điểm bàn phím hoàn hảo qua FSM bất đồng bộ.

---

## 5. Verification Method (Phương Pháp Tái Hiện Kiểm Chứng Độc Lập)

Bất kỳ kiểm toán viên hoặc tác tử thẩm định độc lập nào đều có thể xác minh kết quả thông qua các bước lệnh sau:

1. **Kiểm tra cú pháp Token tĩnh (Gate C01)**:
   ```bash
   node -e "
   const fs = require('fs');
   const content = fs.readFileSync('directions/option_a.html', 'utf8');
   const style = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i)[1];
   const rules = style.split('}');
   let bad = 0;
   for (const r of rules) {
     const [sel, dec] = r.split('{');
     if (!sel || sel.includes(':root') || sel.trim().startsWith('@')) continue;
     if (/var\(--primitive-/.test(dec)) { bad++; console.log('Violation in:', sel.trim()); }
   }
   console.log('Total violations:', bad);
   process.exit(bad === 0 ? 0 : 1);
   "
   ```

2. **Kiểm tra DOM & Tương phản & Tràn ngang qua Puppeteer**:
   Mở trình duyệt truy cập `file:///C:/Users/game/.gemini/exercises/stream-a/module_008/directions/option_a.html` và chạy các phép đo telemetry (như đã ghi nhận trong phần Observation).

3. **Điều kiện Bác bỏ (Invalidation Conditions)**:
   - Nếu phát hiện bất kỳ selector component nào chứa `var(--primitive-*)` $\to$ INVALID.
   - Nếu nền canvas khác `#FAF9F6` hoặc màu nhận diện thương hiệu khác `#0F172A` $\to$ INVALID.
   - Nếu bất kỳ huy hiệu trạng thái nào có độ tương phản text/bg $< 4.5:1$ $\to$ INVALID.
   - Nếu phát sinh thanh cuộn ngang (`scrollWidth > innerWidth`) ở các kích thước 1440, 768 hoặc 390 $\to$ INVALID.
   - Nếu nút thao tác dùng `<button disabled>` làm văng tiêu điểm ra `<body>` $\to$ INVALID.
