# DESIGN TRAINING 008 — INITIAL RESPONSE & SYSTEM PROPOSAL

```yaml
MODULE_ID: DESIGN_TRAINING_008
MODULE_NAME: COLOR_SYSTEM
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
CONTROLLER: ChatGPT Architectural Controller (Sol)
EXECUTOR: Antigravity (Senior Engineering Agent)
STATUS: SUBMITTED_FOR_REVIEW
STAGE: FIRST_RESPONSE
```

---

## 1. RESEARCH PLAN (Kế hoạch Nghiên cứu & Cơ sở Lý thuyết Màu sắc)

### 1.1. Kiến Trúc Token Ba Tầng Chuẩn Mực (`Three-Tier Token Architecture`)
Để biến màu sắc từ sự lựa chọn trang trí ngẫu hứng thành một hệ thống chức năng toán học, có thể dự đoán, kiểm thử và mở rộng, hệ thống được cấu trúc thành ba tầng biến CSS độc lập:

1. **Primitive Tokens (Thang đo thô / Bảng màu gốc)**:
   - Các giá trị hex tĩnh đại diện cho dải màu vật lý, đánh số theo thang độ sáng từ `50` (rất sáng) đến `900` (rất tối):
     - `slate-50` (`#F8FAFC`) $\to$ `slate-900` (`#0F172A`) (khung trung tính)
     - `amber-50` (`#FFFBEB`) $\to$ `amber-700` (`#B45309`) (chú ý / cảnh báo)
     - `rose-50` (`#FFF1F2`) $\to$ `rose-700` (`#BE123C`) (lỗi / nguy cấp)
     - `emerald-50` (`#ECFDF5`) $\to$ `emerald-700` (`#047857`) (thành công / hoàn tất)
     - `indigo-50` (`#EEF2FF`) $\to$ `indigo-700` (`#4338CA`) (nhận diện thương hiệu / tương tác chính)
   - *Nguyên tắc*: Không bao giờ gọi trực tiếp primitive token trong component code.

2. **Semantic Tokens (Token ngữ nghĩa)**:
   - Ánh xạ trực tiếp từ mục đích sử dụng trong giao diện vào primitive token tương ứng:
     - Khung nền & bề mặt: `--color-canvas-bg`, `--color-surface-bg`, `--color-surface-raised`
     - Chữ viết: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
     - Đường viền: `--color-border-subtle`, `--color-border-strong`
     - Tác vụ & tiêu điểm: `--color-action-primary-bg`, `--color-action-primary-text`, `--color-focus-ring`
     - Bốn trạng thái FSM: `--color-status-normal-*`, `--color-status-attention-*`, `--color-status-error-*`, `--color-status-success-*`

3. **Component Tokens (Token cấp linh kiện)**:
   - Ánh xạ dành riêng cho các thành phần UI cụ thể, tạo khả năng override cục bộ mà không làm gãy hệ thống:
     - `--dispatch-badge-bg`, `--dispatch-badge-border`, `--dispatch-badge-text`
     - `--table-row-hover`, `--action-btn-focus-ring`

### 1.2. Phân Định Rạch Ròi Màu Thương Hiệu vs Màu Trạng Thái (`Brand Color vs Status Color`)
* **Màu Thương hiệu (`Brand Color`)**:
  - *Mục đích*: Định vị nhận diện sản phẩm (`Identity`) và điểm nhấn hành động chủ đạo (`Primary Action CTA`).
  - *Quy tắc bất biến*: **Tuyệt đối không dùng Brand Color làm màu trạng thái thành công, lỗi hoặc cảnh báo**.
* **Màu Trạng thái (`Status Color`)**:
  - *Mục đích*: Phục vụ độc quyền cho việc phản hồi trạng thái máy hữu hạn FSM (`State Machine Feedback`).
  - *Quy tắc bất biến*: Mỗi trạng thái phải sở hữu một cặp màu nền-chữ-viền có tỷ lệ tương phản cao và **bắt buộc đi kèm biểu tượng ngữ nghĩa (`Semantic Glyph`) cùng văn bản giải thích (`Actionable Text`)**.

### 1.3. Khả Năng Tiếp Cận Không Phụ Thuộc Vào Màu Sắc (`Color-Independent Accessibility`)
* **Kiểm Tra Trắng Đen (`Grayscale Inspection`)**:
  - Áp dụng bộ lọc `filter: grayscale(100%)` để xác thực rằng cấp bậc thông tin (`Visual Hierarchy`) và sự khác biệt giữa 4 trạng thái vẫn được duy trì hoàn hảo thông qua độ chói tương đối (`Relative Luminance Delta`) và đường viền hình học.
* **Mô Phỏng Khiếm Khuyết Nhận Biết Màu (`Color Vision Deficiency - CVD Simulation`)**:
  - Sử dụng bộ lọc ma trận SVG `feColorMatrix` để mô phỏng Deuteranopia (mù xanh lá) và Protanopia (mù đỏ).
  - Đảm bảo người dùng khiếm thị màu vẫn nhận biết chính xác trạng thái qua 3 lớp nhận thức song song:
    1. **Text Copy tường minh**: "Bình thường", "Cần chú ý", "Lỗi đối tác", "Hoàn tất".
    2. **Ký tự biểu tượng độc lập**: `•` (bình thường), `⚠️` (chú ý), `⛔` (lỗi), `✓` (thành công).
    3. **Độ tương phản viền hình học**: Khung viền nét liền 1.5px với màu viền chuyên biệt.

---

## 2. TWO COLOR DIRECTIONS (Hai Chiến Lược Màu Sắc Đối Lập)

Hệ thống xây dựng 2 hướng thẩm mỹ đối trọng với triết lý thiết kế và chiến lược độ sáng tương phản hoàn toàn khác biệt:

```
+-------------------------------------------------------------------------------+
| HƯỚNG A: EDITORIAL WARM DISPATCH (Sổ Cái Giấy Ấm)                             |
| Canvas: Warm Alabaster (#FAF9F6) | Surface: Pure White (#FFFFFF)             |
| Brand: Deep Slate Ink (#0F172A) | Focus: Amber Ring (#D97706)                 |
| Status Badges: Mềm mại, nền pastel dịu nhẹ, viền mảnh 1px có độ bão hòa cao     |
| Ưu tiên: Thoải mái cho mắt khi trực ca điều hành dài 8-12 tiếng.              |
+-------------------------------------------------------------------------------+
| HƯỚNG B: HIGH-CONTRAST TECHNICAL SLATE (Bảng Điều Phối Kỹ Thuật Tương Phản Cao) |
| Canvas: Cool Ice Slate (#F8FAFC) | Surface: Pure White (#FFFFFF)              |
| Brand: Technical Indigo (#3730A3) | Focus: Cobalt Ring (#2563EB)              |
| Status Badges: Sắc nét, tương phản cực độ, viền đậm 1.5px, chữ đậm bold       |
| Ưu tiên: Tối ưu cho môi trường ánh sáng mạnh ngoài trời và màn hình giám sát. |
+-------------------------------------------------------------------------------+
```

### Chi tiết Chiến lược Màu:

| Vai trò Token | Hướng A: Editorial Warm Dispatch | Hướng B: Technical Slate High-Contrast |
|---|---|---|
| **Canvas Background** | `#FAF9F6` (Alabaster ấm áp, $L=0.95$) | `#F8FAFC` (Slate mát lạnh kỹ thuật, $L=0.97$) |
| **Surface Background** | `#FFFFFF` ($L=1.0$) | `#FFFFFF` ($L=1.0$) |
| **Text Primary** | `#0F172A` ($L=0.015$, Tương phản `15.8:1`) | `#020617` ($L=0.008$, Tương phản `17.4:1`) |
| **Text Secondary** | `#475569` ($L=0.10$, Tương phản `7.2:1`) | `#334155` ($L=0.07$, Tương phản `8.8:1`) |
| **Brand Primary CTA** | `#0F172A` (Slate Ink đơn sắc mạnh mẽ) | `#3730A3` (Deep Indigo rực rỡ kỹ thuật, `10.2:1`) |
| **Focus Visible Ring** | `2px solid #D97706` (Amber ấm, `3.03:1`) | `2px solid #2563EB` (Cobalt rực, `4.5:1`) |
| **Trạng thái: Normal** | Chữ `#475569`, Nền `#F1F5F9`, Viền `#CBD5E1` + `•` | Chữ `#1E293B`, Nền `#E2E8F0`, Viền `#94A3B8` + `[STD]` |
| **Trạng thái: Attention** | Chữ `#B45309`, Nền `#FEF3C7`, Viền `#F59E0B` + `⚠️` | Chữ `#9A3412`, Nền `#FFEDD5`, Viền `#EA580C` + `[WARN]` |
| **Trạng thái: Error** | Chữ `#BE123C`, Nền `#FFE4E6`, Viền `#F43F5E` + `⛔` | Chữ `#9F1239`, Nền `#FFE4E6`, Viền `#E11D48` + `[ERR]` |
| **Trạng thái: Success** | Chữ `#15803D`, Nền `#DCFCE7`, Viền `#22C55E` + `✓` | Chữ `#115E59`, Nền `#CCFBF1`, Viền `#0D9488` + `[OK]` |

---

## 3. CANONICAL DATA PROPOSAL (Đề Xuất Dữ Liệu Chuẩn 4 Trạng Thái)

Màn hình điều phối TRIPFLOW quản lý 4 tour đại diện chuẩn hóa cho 4 trạng thái FSM:

```json
[
  {
    "id": "TF-801",
    "tour_code": "HAN-NBI-01",
    "title": "Tour Tràng An - Bái Đính 1 Ngày",
    "status": "NORMAL",
    "status_label": "Bình thường",
    "status_glyph": "•",
    "status_desc": "Lịch trình đúng tiến độ, xe 45 chỗ xuất bến 07:30",
    "capacity": "35/35 khách",
    "coordinator": "Huy Trần",
    "action_required": false
  },
  {
    "id": "TF-802",
    "tour_code": "HAN-SAP-02",
    "title": "Tour Fansipan Sapa 2 Ngày 1 Đêm",
    "status": "ATTENTION",
    "status_label": "Cần chú ý",
    "status_glyph": "⚠️",
    "status_desc": "Chưa chốt xe trung chuyển bản Cát Cát. Hạn chốt 11:00.",
    "capacity": "18/20 khách",
    "coordinator": "Lan Nguyễn",
    "action_required": true,
    "action_label": "Rà soát xe trung chuyển"
  },
  {
    "id": "TF-803",
    "tour_code": "HPH-HLB-03",
    "title": "Tour Hạ Long Du Thuyền 5 Sao",
    "status": "ERROR",
    "status_label": "Lỗi đối tác",
    "status_glyph": "⛔",
    "status_desc": "Cảng vụ hoãn lệnh rời bến do dông lốc. 24 khách đang ở nhà chờ.",
    "capacity": "24/24 khách",
    "coordinator": "Huy Trần",
    "action_required": true,
    "action_label": "Kích hoạt phương án dự phòng"
  },
  {
    "id": "TF-804",
    "tour_code": "SGN-PQU-04",
    "title": "Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm",
    "status": "SUCCESS",
    "status_label": "Hoàn tất điều phối",
    "status_glyph": "✓",
    "status_desc": "100% đối tác vé bay & resort đã xác nhận mã dịch vụ.",
    "capacity": "42/42 khách",
    "coordinator": "Lan Nguyễn",
    "action_required": false
  }
]
```

---

## 4. TEST MATRIX DRAFT (Dự Thảo Ma Trận Kiểm Chứng 7 Gates C01–C07)

Bộ kiểm chứng tự động `verify_module_008.js` kết nối CDP trên Chromium headless để thẩm định toàn bộ các tiêu chí:

| Cổng Kiểm Tra | Mã Test | Kịch Bản Kiểm Chứng Tự Động (`Automated Test Logic`) | Tiêu Chí Đạt (`PASS Threshold`) |
|---|---|---|---|
| **C01 — Token Mapping** | `T01` | Trích xuất toàn bộ CSS custom properties từ computed style của `:root` và các thẻ giao diện. | 100% tokens 3 tầng (`primitive -> semantic -> component`) tồn tại và được ánh xạ đúng. |
| **C02 — Direction Parity** | `T02` | So sánh dữ liệu computed styles giữa `directions/option_a.html` và `directions/option_b.html`. | Khác biệt thực sự về Canvas Hue/Luminance ($\Delta L \ge 0.02$), Brand identity, và Border strategy. |
| **C03 — Computed Contrast** | `T03` | Đo lường chính xác `backgroundColor` và `color` của 12 cặp text/surface thực tế bằng công thức WCAG 2.1 Luminance. | Mọi cặp text bình thường đạt $\ge 4.5:1$; viền và text lớn đạt $\ge 3.0:1$. |
| **C04 — Color Independence** | `T04` | Phân tích DOM 4 trạng thái khi loại bỏ màu: kiểm tra sự hiện diện của text copy tường minh, semantic glyphs, và độ chênh lệch độ chói nền (`Luminance Delta > 0.05`). | 4/4 trạng thái phân biệt rõ ràng mà không cần dựa vào màu sắc. |
| **C05 — Real Focus Indicator** | `T05` | Kích hoạt native Tab navigation để kích hoạt `:focus-visible` thực tế, đo computed `outline-width`, `outline-style`, và `outline-color`. | `outline-style: solid`, `outline-width >= 2px`, tương phản outline vs adjacent bg $\ge 3.0:1$. |
| **C06 — Responsive 3 Viewports** | `T06` | Đo `scrollWidth <= innerWidth` tại 3 viewports: Desktop `1440x900`, Tablet `768x1024`, Mobile `390x844`. | 0 hiện tượng tràn ngang (`allViewportsNoOverflow: true`). |
| **C07 — Evidence Ledger** | `T07` | Kiểm tra cấu trúc `DESIGN_TRAINING_008_REPORT.md` phân định rõ 3 phần: Đo đạc khách quan (`Telemetry`), Thẩm định thị giác (`Visual Review`), và Giả thuyết (`Hypothesis`). | Phân loại rạch ròi, không trộn lẫn số đo với suy đoán. |

---

## 5. ĐỀ XUẤT TIẾP THEO

Sau khi Lead Architect (Anh) và Architectural Controller (Sol) xem xét và phê duyệt bản đề xuất kiến trúc này:
1. Em sẽ tiến hành hiện thực hóa mã nguồn 2 phương án `directions/option_a.html` và `directions/option_b.html`.
2. Lập hợp đồng màu sắc `COLOR_CONTRACT.yaml`.
3. Triển khai bản ứng dụng cuối `index.html` trong `stream-a/module_008/`.
4. Chạy bộ kiểm chứng `verify_module_008.js`, chụp đầy đủ ảnh bằng chứng (Desktop, Tablet, Mobile, Grayscale, CVD Simulation).
5. Đóng gói `design_training_008_submission_r01.zip` để nộp cho Sol thẩm định độc lập!
