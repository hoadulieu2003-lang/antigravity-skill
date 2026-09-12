# 🎨 CẨM NANG THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM THỰC CHIẾN 2026
## Master Visual Engine & High-Craft Design Playbook

> **Chủ quản (Owner)**: Anh — Lead Architect / Product Owner  
> **Cộng sự AI (Pair-Programmer)**: Em — Senior Engineering Agent  
> **Hệ thống áp dụng**: Toàn bộ hệ sinh thái giao diện, Web Apps, Dashboards, Landing Pages và Slides  
> **Trạng thái**: `PRODUCTION_READY_V2026`  
> **Cập nhật**: 2026-09-12

---

## 🏛️ 1. Triết Lý Thiết Kế Cốt Lõi (`Design Philosophy & Core Axioms`)

Thế hệ giao diện 2026 chuyển dịch từ "Flat Generic SaaS" sang **"High-Craft Tactile Engineering" (Kỹ nghệ xúc giác thủ công cao cấp)** — nơi mỗi pixel, mỗi đường viền (`border`), mỗi độ trễ chuyển động (`motion curve`) đều được tính toán như một linh kiện cơ khí chính xác:

1. **Dark-Mode-First / Deep Void Canvas (`Không gian nền tối sâu`)**:
   - Nền tối không phải là lớp màu phủ lên nền sáng, mà là **Native Medium (Môi trường tự nhiên)**.
   - Màu nền sâu nhất: `#08090a` (Linear marketing canvas) hoặc `#07080a` (Raycast obsidian void) có undertone xanh lạnh vi mô, triệt tiêu cảm giác chói mắt và tôn vinh độ sáng nội dung.
2. **Luminance Hierarchy over Color Noise (`Hệ phân cấp độ sáng thay vì loạn sắc màu`)**:
   - Phân cấp giao diện bằng độ mờ đục của màu trắng (`Alpha Translucency: 5%, 8%, 15%, 40%, 70%, 100%`) trên bề mặt tối thay vì dùng quá nhiều dải màu rực rỡ.
   - Khắc cốt ghi tâm nguyên tắc: **1 Accent Color duy nhất** cho toàn bộ thương hiệu (ví dụ Linear Indigo-Violet `#5e6ad2` / `#7170ff` hoặc Raycast Red `#FF6363`), chỉ sử dụng có chủ đích ở Call-to-Action (Nút kêu gọi hành động) và trạng thái tương tác.
3. **Tactile Hardware Precision (`Độ chuẩn xác phần cứng xúc giác`)**:
   - Lấy cảm hứng từ ngôn ngữ thiết kế của Teenage Engineering, Apple Pro Hardware và macOS Window Chrome: phím tắt `KBD` nổi khối, đường viền moonlight `rgba(255, 255, 255, 0.06 - 0.08)`, bóng đổ đa tầng (`multi-layered inset shadows`).
4. **Motion Discipline 60 FPS (`Kỷ luật chuyển động 60 khung hình/giây`)**:
   - Chuyển động là phản hồi xúc giác (`haptic feedback`), không bao giờ là vật trang trí gây trễ.
   - Chỉ can thiệp vào các thuộc tính tổng hợp phần cứng GPU (`Composite-only Properties`): `transform` và `opacity`. Tuyệt đối không gây `Layout Reflow (Tái tính toán bố cục)`.
5. **Zero-Placeholder Discipline (`Kỷ luật không dùng dữ liệu giả lập cẩu thả`)**:
   - Tuyệt đối không dùng văn bản `Lorem Ipsum` vô nghĩa. Mọi bản mẫu giao diện đều sử dụng dữ liệu thực tế, ngữ cảnh sản phẩm chính xác và nhãn ngữ nghĩa chuẩn mực.

---

## 🎨 2. Hệ Thống Token Thiết Kế Chuẩn Mực (`Design Tokens Contract`)

### 2.1. Bảng Màu Ngữ Nghĩa (`Semantic Color Palette`)

```css
:root {
  /* Surface Layers (Bề mặt phân tầng từ sâu đến nổi) */
  --surface-void: #08090a;          /* Nền tổng thể sâu nhất (Background Canvas) */
  --surface-panel: #0f1011;         /* Nền sidebar & bảng điều khiển (Panel/Sidebar) */
  --surface-card: #141517;          /* Bề mặt thẻ card tiêu chuẩn (Standard Card) */
  --surface-card-elevated: #1a1b1e; /* Thẻ nổi khi hover hoặc modal (Elevated Card) */
  --surface-subtle: #222327;        /* Bề mặt phụ & container nhúng (Subtle Container) */

  /* Text & Luminance Hierarchy (Phân tầng độ sáng chữ) */
  --text-primary: #f7f8f8;          /* Văn bản chính - Trắng ngà dịu mắt (Primary Text) */
  --text-secondary: #d0d6e0;        /* Văn bản phụ & mô tả (Secondary/Body Text) */
  --text-tertiary: #8a8f98;         /* Chú thích, nhãn mác (Muted/Caption Text) */
  --text-quaternary: #62666d;       /* Dấu thời gian, phím tắt mờ (Disabled/Subtle) */

  /* Brand Accents (Màu nhấn định danh) */
  --accent-primary: #5e6ad2;        /* Linear Indigo - Nền nút bấm & icon chính */
  --accent-interactive: #7170ff;    /* Violet sáng - Trạng thái Active/Focus/Link */
  --accent-hover: #828fff;          /* Violet rực - Trạng thái Hover tương tác */
  --accent-glow: rgba(113, 112, 255, 0.15); /* Quầng sáng vầng quang vi mô */

  /* Border & Separation (Đường viền & vách ngăn mờ sương) */
  --border-subtle: rgba(255, 255, 255, 0.05);   /* Viền mỏng siêu nhẹ (Default Outline) */
  --border-standard: rgba(255, 255, 255, 0.08); /* Viền card, input, bảng phân cách */
  --border-highlight: rgba(255, 255, 255, 0.15);/* Viền khi active hoặc hover */

  /* Status Colors (Màu trạng thái hệ thống) */
  --status-success: #27a644;        /* Hoàn tất / Xanh hoạt động (Success Emerald) */
  --status-warning: #ffbc33;        /* Cảnh báo / Đang chờ (Warning Amber) */
  --status-danger: #ff6363;         /* Thất bại / Lỗi nghiêm trọng (Error Red) */
  --status-info: #55b3ff;           /* Thông tin hệ thống (System Info Blue) */
}
```

### 2.2. Nghệ Thuật Kiểu Chữ 3 Tầng (`Tri-Stack Typography Hierarchy`)

| Cấp bậc (`Hierarchy`) | Phông chữ (`Font Family`) | Kích thước (`Size`) | Độ đậm (`Weight`) | Khoảng cách chữ (`Tracking`) | Công năng thực chiến |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `Inter Variable` (`cv01, ss03`) | 56px – 72px | 510 – 600 | `-1.58px` (Siêu nén) | Tiêu đề trang chủ, số liệu đột phá |
| **Heading 1 / 2** | `Inter Variable` | 24px – 32px | 510 (Medium) | `-0.70px` (Nén nhẹ) | Tiêu đề phân đoạn, Module Bento |
| **Heading 3** | `Inter Variable` | 18px – 20px | 590 (Semibold) | `-0.24px` | Tiêu đề thẻ tính năng, widget |
| **Body Standard** | `Inter Variable` | 15px – 16px | 400 (Regular) | `normal` (1.5 line-height) | Đoạn văn bản mô tả kỹ thuật |
| **Caption / Label**| `Inter Variable` | 12px – 13px | 510 | `+0.20px` (Mở rộng) | Nhãn danh mục, tag, pill badge |
| **Telemetry / Code**| `GeistMono` / `Berkeley Mono` | 13px – 14px | 400 – 500 | `normal` | Mã nguồn, thông số hệ thống, KBD |

> 💡 **Bí quyết công nghệ**: Kích hoạt bộ ký tự hình học cao cấp của Inter trong CSS bằng thuộc tính:  
> `font-feature-settings: "cv01" on, "ss03" on;`  
> Giúp chữ cái `a` dạng đơn và các đường cong số trở nên vuông vắn, mang hơi hướng công nghệ vi điện tử (`Hi-Tech Engineering Aesthetic`).

---

## 🍱 3. Bố Cục Bento Grid Đột Phá (`Asymmetric Bento Grid Architecture`)

Cấu trúc Bento Grid 2026 không phải là lưới chia ô bằng nhau đơn điệu, mà là **Bố cục bất đối xứng có trọng tâm thị giác (`Asymmetric Focal Rhythm`)**:

```
┌───────────────────────────────────────────────┬───────────────────────────┐
│ 🌟 Hero Focus Card (Span 8 Cols)             │ ⚡ Live Metric (Span 4)   │
│   - Visual Interactive Stage / Preview        │   - Real-time telemetry   │
│   - Glassmorphism Highlight Layer             │   - Micro Sparkline Glow  │
├───────────────────────┬───────────────────────┼───────────────────────────┤
│ 🛠️ Feature Card A    │ 🧭 Feature Card B     │ ⌨️ Tactile KBD Shortcuts  │
│   - Span 4 Cols       │   - Span 4 Cols       │   - Span 4 Cols           │
│   - Subtle Icon Glow  │   - Progressive Flow  │   - Hardware feel keys    │
└───────────────────────┴───────────────────────┴───────────────────────────┘
```

### 📌 Mẫu CSS Bento Grid Hiện Đại:
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.bento-card {
  background: var(--surface-card);
  border: 1px solid var(--border-standard);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 200ms ease,
              box-shadow 200ms ease;
}

.bento-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-highlight);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5),
              0 0 0 1px var(--border-highlight);
}

/* Hiệu ứng ánh sáng quét góc (Radial Cursor Spotlight) */
.bento-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
}
```

---

## ⌨️ 4. Chi Tiết Phần Cứng & Phím Tắt Xúc Giác (`Tactile KBD & Micro-Interactions`)

Lấy cảm hứng từ Raycast và bàn phím cơ khí cao cấp, phím tắt hỗ trợ người dùng vận hành sản phẩm với tốc độ cực đại:

```css
/* Phím tắt nổi khối (Tactile Keycap) */
kbd, .kbd-shortcut {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 20px;
  padding: 0 5px;
  font-family: 'GeistMono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  background: linear-gradient(180deg, #1c1d21 0%, #111215 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom-color: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 1px 2px rgba(0, 0, 0, 0.4);
  user-select: none;
}
```

---

## 🎬 5. Động Cơ Chuyển Động Siêu Mượt 60 FPS (`GSAP Motion Choreography`)

### 5.1. 3 Quy Tắc Bất Biến Về Chuyển Động (`Motion Invariants`)
1. **Composite-Only**: Chỉ chuyển động `transform: translate3d(x, y, 0)`, `scale()` và `opacity`. Tuyệt đối cấm animate `width`, `height`, `margin`, `top`, `left`.
2. **Sub-pixel Anti-aliasing (`Khử răng cưa dưới pixel`)**: Thêm `force3D: true, z: 0.01` vào phần tử GSAP để GPU luôn kích hoạt bộ xử lý 3D riêng biệt mà không bị mờ chữ (`fuzzy fonts`).
3. **Cubic Easing Tự nhiên**:
   - Xuất hiện (`Entrance`): `cubic-bezier(0.16, 1, 0.3, 1)` (Mở ra nhanh, phanh gấp siêu êm).
   - Biến mất (`Exit`): `cubic-bezier(0.7, 0, 0.84, 0)` (Tăng tốc biến mất tức thì).

### 5.2. Mẫu Code GSAP Card Stagger & ScrollTrigger:
```javascript
// Hiệu ứng xuất hiện so le (Staggered Bento Entrance)
gsap.from(".bento-card", {
  y: 30,
  opacity: 0,
  duration: 0.7,
  stagger: 0.08,
  ease: "power3.out",
  force3D: true
});

// Hiệu ứng cuộn ghim sân khấu (Pinned Stage Scrollytelling)
gsap.timeline({
  scrollTrigger: {
    trigger: ".showcase-stage",
    pin: true,
    start: "top top",
    end: "+=250%",
    scrub: 0.8
  }
})
.to(".showcase-screen-1", { opacity: 0, scale: 0.95, y: -20, duration: 1 })
.from(".showcase-screen-2", { opacity: 0, scale: 1.05, y: 30, duration: 1 }, "-=0.4");
```

---

## ♿ 6. Tiêu Chuẩn Tiếp Cận & Khả Dụng WCAG AA (`Accessibility & UX Guardrails`)

- **Tỉ lệ tương phản màu (`Color Contrast Ratio`)**: Đảm bảo tối thiểu `4.5:1` cho văn bản thông thường và `3:1` cho văn bản lớn (18pt+ / 24px) theo WCAG 2.2 AA.
- **Kích thước vùng chạm cảm ứng (`Touch Targets`)**: Tối thiểu `44 × 44px` trên thiết bị di động cho mọi nút bấm, biểu tượng, dropdown toggle.
- **Tập trung bàn phím trực quan (`Visible Focus Ring`)**:  
  `outline: 2px solid var(--accent-interactive); outline-offset: 2px;`  
  Không bao giờ đặt `outline: none` mà không có trạng thái focus thay thế rõ ràng.
- **Tôn trọng chế độ giảm chuyển động (`Reduced Motion`)**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 🛠️ 7. Quy Trình Vận Hành Thiết Kế 4 Bước Cùng Anh ($design Flow)

Khi Anh đưa ra bài toán thiết kế:
1. **Phân loại tác vụ (`Impact Classification`)**:
   - `DESIGN_DIRECTION`: Sản phẩm mới / Màn hình mới $	o$ Em chủ động đề xuất **3 định hướng thiết kế bất đồng quy (`3 Divergent Directions`)** kèm ưu/nhược điểm để Anh chọn.
   - `DESIGN_MAINTENANCE`: Tinh chỉnh CSS / Spacing $	o$ Tái sử dụng Token Contract có sẵn.
2. **Khóa Hợp đồng Thiết kế (`Lock DESIGN_CONTRACT.yaml`)**:
   - Cố định bảng màu, font chữ, bố cục và không tự ý thay đổi khi chưa có chỉ thị của Anh.
3. **Hiện thực hóa Trọn gói Pixel-Perfect (`Single File Artifact or Clean Modules`)**:
   - Viết mã nguồn hoàn chỉnh với đầy đủ Tokens, CSS Variables và logic tương tác.
4. **Kiểm chứng Trực quan bằng Bằng chứng Thực tế (`Visual Verification via Screenshot`)**:
   - Kích hoạt Chrome CDP chụp ảnh màn hình (`Screenshot`) gửi trực tiếp vào giao diện làm việc để Anh kiểm duyệt thị giác trước khi đóng gói nghiệm thu.

---
*Cẩm nang này là tài sản kiến thức độc quyền của hệ sinh thái Antigravity, sẵn sàng kích hoạt tức thì cho mọi tác vụ thiết kế của Anh.*
