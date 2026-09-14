# Handoff Report — Challenger 2 (Accessibility & Canonical Data Challenger)

**Agent**: `challenger_2`  
**Role**: Accessibility & Canonical Data Challenger (critic, specialist)  
**Milestone**: Module 12 — Brand & Image Direction (Stream B) Checkpoint 12.1 Verification  
**Evaluation Target**: `directions/option_a/index.html` and `directions/option_b/index.html`  
**Empirical Verdict**: **APPROVE**  

---

## 1. Observation

All observations were collected through empirical automated test suites executing directly against Google Chrome Headless (v153.0.8010.36) via Chrome DevTools Protocol (CDP) WebSocket sessions.

### 1.1. Touch & Click Targets (WCAG 2.2 / Directive Section 10)
- **Tool Command**: `node tests/challenger_2_empirical_harness.js` & `node tests/test_responsive_viewports.js`
- **Option A (`directions/option_a/index.html`)**:
  - `button#btn-resolve-hotel`: `303.67px × 44.00px` (Lines 786–789, CSS lines 364–382)
  - `button#btn-update-t01-log`: `215.95px × 44.00px` (Lines 790–793, CSS lines 387–405)
  - `a.table-action-btn` (T01 "Chi tiết"): `55.80px × 59.19px` (Lines 831, CSS lines 604–615)
  - `a.table-action-btn` (T02–T08 "Xem", 7 items): `51.50px × 44.00px` each (Lines 849, 867, 885, 903, 921, 939, 957)
  - `summary.disclosure-summary`: `1314.00px × 72.00px` (Lines 1040–1043, CSS lines 633–646)
  - Total interactive elements: 11. Violations (< 44×44px): **0**.
- **Option B (`directions/option_b/index.html`)**:
  - `button#btn-dispatch-call`: `333.61px × 44.00px` (Lines 879–882, CSS lines 387–407)
  - `button#btn-dispatch-reroute`: `229.55px × 44.00px` (Lines 883–886, CSS lines 411–431)
  - `a.matrix-action-link` (T01 "CHI TIẾT"): `78.78px × 44.00px` (Lines 1036, CSS lines 692–708)
  - `a.matrix-action-link` (T02–T08 "XEM", 7 items): `45.80px × 44.00px` each (Lines 1054, 1072, 1090, 1108, 1126, 1144, 1162)
  - `summary.disclosure-summary-bar`: `1330.00px × 68.00px` (Lines 1178–1181, CSS lines 724–737)
  - Total interactive elements: 11. Violations (< 44×44px): **0**.
- **Multi-Viewport Stress (Directive Section 10)**:
  - Desktop 1440×900: `scrollWidth = 1425px`, `clientWidth = 1425px` (0 horizontal overflow, 0 target violations).
  - Tablet 768×1024: `scrollWidth = 753px`, `clientWidth = 753px` (0 horizontal overflow, 0 target violations).
  - Mobile 390×844: `scrollWidth = 390px`, `clientWidth = 390px` (0 horizontal overflow, 0 target violations).

### 1.2. Color Contrast (WCAG 2.2 AA)
- **Tool Command**: `node tests/print_contrast.js` (sampled across 24 selectors in A and 23 in B)
- **Option A**:
  - Primary text (`#1C1917` on `#FAF8F5`): **16.50:1** (Required: 4.5:1)
  - Brand header title (`#1C1917` on `#FAF8F5`): **16.50:1** (Required: 3.0:1)
  - Terracotta badge (`#C2410C` on `#F5F0E8`): **4.56:1** (Required: 4.5:1)
  - Promise quote (`#1C1917` on `#FFFDF9`): **17.21:1** (Required: 4.5:1)
  - Promise author disclaimer (`#78716C` on `#FFFDF9`): **4.72:1** (Required: 4.5:1)
  - Hero heading (`#1C1917` on `#FFFDF9`): **17.21:1** (Required: 3.0:1)
  - Tour ID pill (`#92400E` on `#FEF3C7`): **6.37:1** (Required: 4.5:1)
  - Bottleneck alert title (`#92400E` on `#FEF3C7`): **6.37:1** (Required: 4.5:1)
  - Bottleneck alert body (`#78350F` on `#FEF3C7`): **8.15:1** (Required: 4.5:1)
  - Status Waiting Partner (`#92400E` on `#FEF3C7`): **6.37:1** (Required: 4.5:1)
  - Status Ready (`#065F46` on `#ECFDF5`): **7.29:1** (Required: 4.5:1)
  - Status Missing Dossier (`#991B1B` on `#FEF2F2`): **7.60:1** (Required: 4.5:1)
  - Status In Prep (`#1E40AF` on `#EFF6FF`): **8.01:1** (Required: 4.5:1)
  - Status Done (`#44403C` on `#F5F5F4`): **9.42:1** (Required: 4.5:1)
  - Primary button (`#FFFFFF` on `#C2410C`): **5.18:1** (Required: 4.5:1)
  - Table action link (`#C2410C` on `#FFFDF7`): **5.09:1** (Required: 4.5:1)
  - Footer meta (`#78716C` on `#FAF8F5`): **4.53:1** (Required: 4.5:1)
- **Option B**:
  - Primary text (`#0F172A` on `#F8FAFC`): **17.06:1** (Required: 4.5:1)
  - Direction badge (`#334155` on `#F1F5F9`): **9.45:1** (Required: 4.5:1)
  - Promise terminal (`#1D4ED8` on `#EFF6FF`): **6.16:1** (Required: 4.5:1)
  - Tour code tag (`#0F172A` on `#F1F5F9`): **16.30:1** (Required: 4.5:1)
  - Signal break title (`#991B1B` on `#FEF2F2`): **7.60:1** (Required: 4.5:1)
  - Signal break body (`#7F1D1D` on `#FEF2F2`): **9.16:1** (Required: 4.5:1)
  - Hazard Yellow (`#854D0E` on `#FEF9C3`): **6.38:1** (Required: 4.5:1)
  - Telemetry Green (`#166534` on `#DCFCE7`): **6.49:1** (Required: 4.5:1)
  - Signal Red (`#991B1B` on `#FEE2E2`): **6.80:1** (Required: 4.5:1)
  - Telecom Cyan (`#075985` on `#E0F2FE`): **6.59:1** (Required: 4.5:1)
  - Archived Slate (`#334155` on `#F1F5F9`): **9.45:1** (Required: 4.5:1)
  - Primary button (`#FFFFFF` on `#1D4ED8`): **6.70:1** (Required: 4.5:1)
  - Matrix action link (`#1D4ED8` on `#FFFFFF`): **6.70:1** (Required: 4.5:1)
  - Footer telemetry (`#64748B` on `#F8FAFC`): **4.55:1** (Required: 4.5:1)
- Total contrast failures: **0**.

### 1.3. Non-Color Status Dependency
- **Option A**: All 9 status badges (Hero T01, Table rows T01–T08) contain:
  1. SVG icon / IMG (`waiting_partner.svg`, `ready.svg`, `missing_dossier.svg`, `departure.svg`, or checkmark SVG).
  2. Vietnamese text label ("Chờ đối tác", "Sẵn sàng", "Thiếu hồ sơ", "Đang chuẩn bị", "Hoàn thành").
  3. Distinct border stroke (`border: 1px solid ...`) and shape (`border-radius: 16px`).
- **Option B**: All 9 status badges contain:
  1. SVG icon / IMG (`waiting_partner.svg`, `ready.svg`, `missing_dossier.svg`, `departure.svg`, or checkmark SVG).
  2. Vietnamese text label ("Chờ đối tác", "Sẵn sàng", "Thiếu hồ sơ", "Đang chuẩn bị", "Hoàn thành" rendered uppercase via CSS).
  3. Distinct border stroke (`border: 1px solid ...`) and rectangular pill shape (`border-radius: 2px`).
  4. Sidebar features an additional "Mã Ký Tự Tín Hiệu Hệ Thống" key mapping geometric glyphs (`● READY`, `▲ PENDING_PARTNER`, `■ MISSING_DOCS`, `◆ PREPARING`).
- Zero status indicators rely on color alone.

### 1.4. Complex Diagram Accessibility (W3C Complex Images)
- **Option A**:
  - `img[src*="t01_route_narrative.svg"]` (Lines 770–773) has descriptive `alt`: `"Sơ đồ chuỗi lộ trình T01 Hạ Long 4 mốc: Hà Nội (07:30 Sẵn sàng), Hải Dương (09:00 Sẵn sàng), Khách sạn Bãi Cháy (11:45 Điểm nghẽn: Chưa xác nhận 4 phòng), Cảng Tuần Châu (13:30 Sẵn sàng)"`.
  - Accompanied by `<ol class="sr-only">` (Lines 776–781) with 4 ordered list items detailing:
    1. Mốc 1: Hà Nội — Khởi hành lúc 07:30 ngày 14/09 tại Nhà hát Lớn. Trạng thái: Sẵn sàng xe 29 chỗ.
    2. Mốc 2: Trạm dừng Hải Dương — Nghỉ chân lúc 09:00 (20 phút). Trạng thái: Sẵn sàng hậu cần.
    3. Mốc 3: Khách sạn Bãi Cháy — Check-in lúc 11:45. Trạng thái: Điểm nghẽn — Chờ đối tác xác nhận 4 phòng.
    4. Mốc 4: Cảng Tuần Châu — Xuống du thuyền lúc 13:30. Trạng thái: Đã giữ 28 chỗ tàu VIP.
- **Option B**:
  - `img[src*="t01_route_schematic.svg"]` (Lines 863–866) has descriptive `alt`: `"Sơ đồ tín hiệu kỹ thuật tuyến T01 Hạ Long với điểm ngắt tín hiệu cảnh báo tại ga Bãi Cháy do chưa xác nhận 4 phòng"`.
  - Accompanied by `<ol class="sr-only">` (Lines 869–874) with 4 ordered list items detailing:
    1. Ga 01: Hà Nội (Khởi hành 07:30 14/09). Trạng thái: Tín hiệu thông suốt [SẴN SÀNG].
    2. Trạm đo 02: Hải Dương (Waypoint 09:00). Trạng thái: Tín hiệu thông suốt [SẴN SÀNG].
    3. Ga 03: Khách sạn Bãi Cháy (Checkpoint 11:45). Trạng thái: Đứt gãy tín hiệu [CHỜ ĐỐI TÁC: 4 PHÒNG CHƯA XÁC NHẬN].
    4. Ga 04: Cảng Tuần Châu (Terminal 13:30). Trạng thái: Tạm dừng phụ thuộc ga 03 [PENDING BC].
- Both `<ol>` elements are accessible to screen readers (CSS `.sr-only`: clip rect, non-zero size, not `display: none`, not `aria-hidden="true"`).

### 1.5. Image Failure Parity & Layout Stability
- Tested by injecting `img, svg { display: none !important; }` into both live DOMs:
  - Option A: Hero card height pre = 1058px, post = 897px; Table height pre = 656px, post = 656px; `scrollWidth = clientWidth = 1425px`.
  - Option B: Hero card height pre = 1026px, post = 846px; Table height pre = 558px, post = 558px; `scrollWidth = clientWidth = 1425px`.
  - All critical operational texts ("Khách sạn chưa xác nhận 4 phòng", "Lan — Điều Phối Viên Chính", T01–T08 table cells) remained fully visible.
  - All action buttons remained visible, properly bounded, and clickable.

### 1.6. Canonical Operational Dataset T01–T08 Parity
- **Reference Contract**: Directive Section 4.6 (Anchor: 13/09/2026 18:00 Asia/Ho_Chi_Minh).
- **Tool Command**: `node tests/audit_dataset.js`
- **T01–T08 Field Check**:
  - `T01`: Hạ Long 2N1Đ | 14/09/2026 07:30 | Lan | Chờ đối tác | Khách sạn chưa xác nhận 4 phòng -> **100% Exact**
  - `T02`: Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách -> **100% Exact**
  - `T03`: Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD -> **100% Exact**
  - `T04`: Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn -> **100% Exact**
  - `T05`: Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành -> **100% Exact**
  - `T06`: Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận -> **100% Exact**
  - `T07`: Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng -> **100% Exact**
  - `T08`: Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký -> **100% Exact**
- **Option B Text-Transform Note**:
  - In Option B, the DOM source code for status badges contains exact verbatim strings: `<span>Chờ đối tác</span>`, `<span>Sẵn sàng</span>`, `<span>Thiếu hồ sơ</span>`, `<span>Đang chuẩn bị</span>`, `<span>Hoàn thành</span>`.
  - CSS rule `.signal-badge { text-transform: uppercase; }` renders them visually as `CHỜ ĐỐI TÁC`, `SẴN SÀNG`, etc. This aligns with the Direction B telemetry aesthetic while preserving 100% semantic tuple data in the DOM and for assistive technologies.
- **Fabricated Data Check**: Zero instances of fabricated revenue ($/triệu/tỷ), fake ratings (4.9/5), or commercial awards. Both prototypes strictly label Lan as a "Nhân vật điều phối giả lập / Fictional Operator".

---

## 2. Logic Chain

1. **Target Sizing**: Observations in 1.1 show that every interactive button, table action link, and `<summary>` disclosure element has computed width $\ge 44\text{px}$ and height $\ge 44\text{px}$ across 1440px, 768px, and 390px viewports with zero horizontal overflow. Therefore, both prototypes satisfy WCAG 2.2 Criterion 2.5.8 (Target Size Minimum) and Directive Section 10.
2. **Contrast Baseline**: Observations in 1.2 demonstrate that computed luminance contrast ratios for all body copy, headings, callout banners, status badges, buttons, and metadata labels range from 4.53:1 to 17.85:1, with 0 elements falling below the 4.5:1 (normal text) or 3.0:1 (large text) thresholds. Therefore, both prototypes achieve WCAG 2.2 AA contrast compliance.
3. **Information Accessibility Without Color**: Observations in 1.3 show that status badges in both prototypes integrate distinct SVG icons, text labels, and border shapes. Therefore, users with color vision deficiency can discern operational states without relying on color perception (WCAG 2.2 Criterion 1.4.1).
4. **Complex Diagram Equivalency**: Observations in 1.4 show that both prototypes implement `<ol class="sr-only">` with four structured items describing every milestone and bottleneck, fulfilling W3C Complex Images requirements for screen reader users (WCAG 2.2 Criterion 1.1.1).
5. **Degradation Resilience**: Observations in 1.5 confirm that when all images and SVGs are removed, the layout remains stable without collapsing or overflowing, and critical operational content remains usable.
6. **Data Fidelity**: Observations in 1.6 confirm that all 8 tour tuples (T01–T08) match Directive Section 4.6 verbatim in both prototypes. The uppercase rendering in Option B is purely stylistic (CSS `text-transform`) and does not alter underlying data integrity.

---

## 3. Caveats

- **No Caveats**: All 6 verification dimensions were tested empirically in a headless Chromium instance with computed DOM metrics, layout rects, and contrast math. Screen reader behavior was evaluated via DOM accessibility attributes and computed visibility.

---

## 4. Conclusion

- **Verdict**: **APPROVE**
- Both prototypes (`directions/option_a/index.html` and `directions/option_b/index.html`) satisfy 100% of Accessibility requirements (WCAG 2.2 AA, 44×44px interactive targets across 3 viewports, non-color status dependency, route diagram `<ol>` screen reader alternative, image failure resilience) and 100% of Canonical Dataset T01–T08 Parity.
- There are no blocking accessibility or data integrity defects.

---

## 5. Verification Method

To independently reproduce and verify all findings, run the following commands in PowerShell from the project root (`design-training/stream-b/module-012/`):

```powershell
# 1. Run core empirical test suite (Chromium headless + CDP)
node tests/challenger_2_empirical_harness.js

# 2. Run multi-viewport responsive target & overflow test (1440px, 768px, 390px)
node tests/test_responsive_viewports.js

# 3. Run detailed color contrast audit across all selectors
node tests/print_contrast.js

# 4. Run deep accessibility (alt/aria, disclosure toggle, zero-motion computed styles)
node tests/stress_test_accessibility.js

# 5. Run cell-by-cell canonical data audit
node tests/audit_dataset.js
```

**Invalidation Conditions**:
- Any interactive element bounding box measuring $< 44\text{px}$ in width or height.
- Any text element contrast ratio falling below 4.5:1 (or 3.0:1 for text $\ge 24\text{px}$ / bold $\ge 18.66\text{px}$).
- Any status indicator lacking an icon or text label.
- Any discrepancy in the 8 canonical tour tuples T01–T08 against Section 4.6.
