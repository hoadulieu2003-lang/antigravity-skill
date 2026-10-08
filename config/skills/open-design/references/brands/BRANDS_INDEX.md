# 🏛️ MASTER BRAND DESIGN SPECIFICATIONS INDEX (9-DIMENSIONAL SPEC)
> **Bộ Đặc Tả Thiết Kế Chuẩn Thương Hiệu 9 Chiều Dành Cho Antigravity 2.0**  
> **Nguyên tắc cốt lõi**: Khóa cứng 100% **Luminous Light Theme Invariant** (Nền sáng đa tầng, thẻ trắng tinh khiết, bóng đổ quang học siêu mịn, triệt tiêu hoàn toàn giao diện tối hoặc giấy bẹt đơn điệu).

---

## 📋 MỤC LỤC HỆ THỐNG THƯƠNG HIỆU
1. [Linear — Technical Precision & Hyper-Productivity](#1-linear--technical-precision--hyper-productivity)
2. [Stripe — Luminous Dimension & Atmospheric Depth](#2-stripe--luminous-dimension--atmospheric-depth)
3. [Apple — Human Interface Guidelines & Frosted Glass Depth](#3-apple--human-interface-guidelines--frosted-glass-depth)
4. [Vercel — Monochrome Contrast, Razor Geometry & Geist Utility](#4-vercel--monochrome-contrast-razor-geometry--geist-utility)
5. [Supabase — Developer Craftsman & Emerald Accents](#5-supabase--developer-craftsman--emerald-accents)

---

## 1. Linear — Technical Precision & Hyper-Productivity

### 1. Visual Theme & Atmosphere (Bản sắc thị giác & không khí)
* **Triết lý**: Tối giản kỹ thuật cơ khí, tốc độ phản hồi tức thì (<50ms), tính chuẩn xác tuyệt đối và mật độ thông tin nén cao dành cho kỹ sư và product builders.
* **Không khí (Atmosphere)**: Tinh gọn, sắc nét, kỷ luật thép. Loại bỏ mọi yếu tố trang trí rườm rà; mỗi pixel, mỗi đường viền 1px đều có mục đích chức năng rõ ràng.
* **Luminous Adaptation**: Chuyển đổi từ giao diện tối mặc định sang **Luminous Light Studio**. Nền canvas xám bạc kỹ thuật kết hợp thẻ nổi trắng tinh thể và viền quang học siêu mảnh 1px (`#E2E8F0`), điểm xuyết ánh sáng tím/indigo đặc trưng của Linear.

### 2. Color Palette & Roles (Bảng màu ngữ nghĩa & vai trò)
* **Canvas Background (Nền tổng thể)**: `#F8F9FA` (Technical Silver / Slate Light)
* **Surface Background (Mặt phẳng thẻ)**: `#FFFFFF` (Pure Crystalline White)
* **Subsurface / Input Well**: `#F1F5F9` (Recessed Muted Gray)
* **Border Primary (Viền chính)**: `#E2E8F0` (Razor 1px Optical Border)
* **Border Subtle (Viền phụ mờ)**: `rgba(0, 0, 0, 0.04)`
* **Text Primary (Chữ chính)**: `#0F172A` (Deep Slate / Near-Black)
* **Text Secondary (Chữ phụ)**: `#475569` (Muted Slate)
* **Text Tertiary (Nhãn vi mô/Placeholder)**: `#94A3B8` (Soft Slate)
* **Brand Accent (Màu điểm nhấn Linear)**: `#5E6AD2` (Linear Indigo)
* **Brand Accent Hover**: `#4F59B8`
* **Brand Accent Tint (Nền huy hiệu)**: `#EEF0FB`
* **Status Colors**:
  * *Success (Hoàn thành)*: `#10B981` (Emerald) / Tint: `#ECFDF5`
  * *Warning (Đang tiến hành)*: `#F59E0B` (Amber) / Tint: `#FFFBEB`
  * *Danger / Canceled (Hủy/Lỗi)*: `#EF4444` (Rose) / Tint: `#FEF2F2`
  * *Backlog / Priority (Mức độ ưu tiên)*: `#64748B` (Neutral Slate)

### 3. Typography Rules (Hệ thống phân cấp kiểu chữ)
* **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
* **Monospace Stack (Mã/ID vé/Phím tắt)**: `SF Mono`, `JetBrains Mono`, `ui-monospace`, `monospace`
* **Phân cấp kiểu chữ (Type Scale)**:
  * `Heading 1 (Tiêu đề trang)`: 20px (`1.25rem`), Weight 600, Line-height 1.3, Tracking `-0.015em`
  * `Heading 2 (Tiêu đề nhóm/Section)`: 15px (`0.9375rem`), Weight 600, Line-height 1.35, Tracking `-0.01em`
  * `Body Regular (Chữ thân)`: 13px (`0.8125rem`), Weight 400, Line-height 1.45, Tracking `normal`
  * `Body Medium (Thao tác/Dòng danh sách)`: 13px (`0.8125rem`), Weight 500, Line-height 1.45
  * `Micro Label (Nhãn thẻ/Trạng thái/Badge)`: 11px (`0.6875rem`), Weight 600, Line-height 1.2, Tracking `+0.02em`, Uppercase tùy chọn
  * `Keyboard Shortcut Badge`: 11px, Monospace, Weight 500
* **Quy chuẩn số liệu**: Sử dụng bắt buộc `font-variant-numeric: tabular-nums` cho số đếm, ngày tháng, mã vé (`ENG-1024`).

### 4. Component Stylings (Kiến trúc linh kiện)
* **Buttons (Nút bấm)**:
  * Chiều cao chuẩn: `28px` (h-7 compact) hoặc `32px` (h-8 standard).
  * Bo góc: `6px` (`rounded-md`).
  * Primary Button: Nền `#5E6AD2`, chữ `#FFFFFF`, viền `1px solid rgba(255,255,255,0.15)`, shadow `0 1px 2px rgba(94,106,210,0.2)`.
  * Secondary Button: Nền `#FFFFFF`, chữ `#0F172A`, viền `1px solid #E2E8F0`, hover `#F8F9FA`.
  * Vi tương tác: Bấm co lún `scale(0.98)`, transition `100ms ease`.
* **Issue Cards / Data Rows (Thẻ công việc/Dòng dữ liệu)**:
  * Thiết kế dạng thanh dẹp (row-based list) hoặc thẻ Kanban phẳng.
  * Chiều cao dòng: `36px` - `40px`.
  * Nền `#FFFFFF`, viền đáy hoặc viền bao `1px solid #E2E8F0`.
  * Hover state: Nền chuyển nhẹ sang `#F8FAFC`, icon hành động nhanh xuất hiện (hover-reveal actions).
* **Inputs & Search (`⌘K Command Palette`)**:
  * Chiều cao `32px`, padding ngang `10px`.
  * Nền `#FFFFFF`, viền `1px solid #CBD5E1`.
  * Focus state: Viền `#5E6AD2`, ring quang học `0 0 0 3px rgba(94,106,210,0.12)`.
* **Badges & Priority Tags**:
  * Chiều cao `20px`, padding `2px 6px`, bo góc `4px`.
  * Icon kích thước `12x12px`.
  * Màu sắc nhạt tinh tế: Nền pastel mờ + chữ màu thương hiệu đậm nét.

### 5. Layout & Spacing Principles (Khoảng cách & nhịp điệu)
* **Hệ thống lưới (Micro Grid)**: Căn chuẩn theo bước nhảy `4px` / `8px`.
* **Mật độ thông tin (Density)**: Siêu nén (`High Density`). Khoảng cách padding trong thẻ thường là `8px 12px`, padding panel chính là `16px 20px`.
* **Thanh điều hướng Sidebar**:
  * Chiều rộng: `220px` (có thể thu gọn còn `48px`).
  * Nền `#F8F9FA` viền phân cách phải `1px solid #E2E8F0`.
  * Phím tắt điều hướng nhanh hiển thị mờ ở cạnh phải của mỗi mục menu (`G then I`, `G then P`).

### 6. Depth & Elevation Stacking (Xếp lớp bóng đổ đa tầng)
* **Level 0 (Canvas Base)**: `#F8F9FA` phẳng.
* **Level 1 (Card / Grid Item)**:
  `background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);`
* **Level 2 (Dropdown / Popover / Tooltip)**:
  `background: #FFFFFF; border: 1px solid #CBD5E1; box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04);`
* **Level 3 (Command Menu / Modal `⌘K`)**:
  `background: #FFFFFF; border: 1px solid #94A3B8; box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06);`

### 7. Do's & Don'ts (Quy tắc thị giác sống còn)
* **DO (Nên làm)**:
  * Luôn hiển thị nhãn phím tắt cạnh nhãn chức năng (`⌘K`, `C`, `Esc`, `Tab`).
  * Duy trì đường viền 1px quang học sắc nét giữa các vùng phân tách.
  * Giữ bảng màu trung tính sạch bóng, chỉ dùng màu rực cho trạng thái/accent.
* **DON'T (Tuyệt đối cấm)**:
  * Không dùng bóng đổ đen to xù sì hoặc hiệu ứng glow mờ ảo thiếu kiểm soát.
  * Không dùng góc bo quá lớn (`rounded-3xl` hay `rounded-full` trên card).
  * Không để khoảng trắng dư thừa làm loãng mật độ dữ liệu chuyên nghiệp.

### 8. Responsive & Touch Targets (Hành vi co giãn & kích thước chạm)
* **Desktop**: Tối ưu tuyệt đối cho chuột, trackpad và phím tắt bàn phím.
* **Mobile & Tablet**:
  * Chuyển đổi danh sách bảng sang danh sách thẻ dọc chạm vuốt.
  * Mở rộng vùng tương tác ảo (`touch target`) lên tối thiểu `38px` - `44px` dù phần tử hiển thị thị giác vẫn giữ `28px` - `32px`.
  * Bảng lệnh `⌘K` biến thành Bottom Sheet trượt mượt mà từ đáy màn hình.

### 9. Agent Prompt Guide (Chỉ dẫn thực chiến cho AI)
```text
Role: Senior Frontend Engineer implementing Linear Design Language.
Aesthetic Invariant: Luminous Light Theme.
Key Tokens:
- Canvas: #F8F9FA, Surface: #FFFFFF, Recessed: #F1F5F9.
- Border: 1px solid #E2E8F0, Accent: #5E6AD2 (Linear Indigo).
- Typography: Inter, 13px base body, 11px micro labels, tabular-nums on stats.
- Component feel: Compact h-7/h-8 buttons, scale(0.98) on active, 6px radius, razor optical dividers.
- Atmosphere: Fast, mechanical precision, zero clutter, high information density.
```

---

## 2. Stripe — Luminous Dimension & Atmospheric Depth

### 1. Visual Theme & Atmosphere (Bản sắc thị giác & không khí)
* **Triết lý**: Chiều sâu không gian đa tầng, tự tin tài chính toàn cầu, đường viền mềm mại, lưới chuyển màu gradient mượt mà và khoảng trắng khoáng đạt.
* **Không khí (Atmosphere)**: Sang trọng, công nghệ cao, đáng tin cậy tuyệt đối, đầy tính khích lệ và năng lượng đổi mới.
* **Luminous Adaptation**: Nền trắng ngà ánh kem (`#FAF9F6`) hoặc xanh mây mờ (`#F6F9FC`), kết hợp các mảng gradient đa tầng pastel (`#635BFF`, `#00D4B2`, `#7A73FF`), bóng đổ phân lớp phức hợp mịn như nhung (`ambient + key shadow`).

### 2. Color Palette & Roles (Bảng màu ngữ nghĩa & vai trò)
* **Canvas Background (Nền chính)**: `#F6F9FC` (Stripe Atmospheric Light Slate)
* **Warm Canvas (Nền ấm tùy chọn)**: `#FAF9F6` (Luminous Warm Paper)
* **Surface Background (Mặt thẻ)**: `#FFFFFF` (Pure Luminous White)
* **Brand Accent Primary**: `#635BFF` (Stripe Blurple)
* **Brand Accent Secondary**: `#00D4B2` (Stripe Neon Aqua/Cyan)
* **Brand Accent Tertiary**: `#7A73FF` (Stripe Lilac Violet)
* **Accent Warm / Energy**: `#FF70A6` (Coral Rose) & `#FFB020` (Amber Gold)
* **Text Dominant (Tiêu đề/Chữ đậm)**: `#0A2540` (Stripe Deep Navy)
* **Text Secondary (Đoạn văn/Mô tả)**: `#425466` (Navy Slate)
* **Text Tertiary (Ghi chú/Thời gian)**: `#6B7C93` (Subtle Muted Navy)
* **Border Standard**: `#E3E8EE` (Soft Optical Gray)
* **Border Focus Glow**: `rgba(99, 91, 255, 0.4)`

### 3. Typography Rules (Hệ thống phân cấp kiểu chữ)
* **Font Family**: `Sohne`, `Ideal Sans`, `Inter`, `-apple-system`, `sans-serif`
* **Phân cấp kiểu chữ (Type Scale)**:
  * `Hero Display (Tiêu đề ấn tượng)`: 48px - 64px (`3rem - 4rem`), Weight 700, Line-height 1.1, Tracking `-0.025em`
  * `Heading 1 (Tiêu đề trang)`: 32px (`2rem`), Weight 700, Line-height 1.2, Tracking `-0.02em`
  * `Heading 2 (Tiêu đề nhóm)`: 22px (`1.375rem`), Weight 600, Line-height 1.3, Tracking `-0.015em`
  * `Body Large (Dẫn nhập)`: 17px (`1.0625rem`), Weight 400, Line-height 1.6, Tracking `normal`
  * `Body Regular`: 15px (`0.9375rem`), Weight 400, Line-height 1.6, Text color `#425466`
  * `Overline / Eyebrow Badge`: 12px, Weight 600, Tracking `+0.06em`, Text transform uppercase, Màu `#635BFF`

### 4. Component Stylings (Kiến trúc linh kiện)
* **Buttons (Nút bấm Stripe)**:
  * Chiều cao: `40px` (standard) hoặc `48px` (hero CTA).
  * Bo góc: `8px` hoặc `rounded-full` (capsule mềm mại).
  * Primary Button: Nền `#635BFF`, chữ `#FFFFFF`, bo góc `8px`, bóng đổ kép:
    `box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);`
    Hover: dịch chuyển nhẹ `transform: translateY(-1px)`, bóng đổ bung rộng:
    `box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);`
* **Floating Cards (Thẻ nổi bồng bềnh)**:
  * Nền `#FFFFFF`, bo góc `12px` - `16px`.
  * Viền mảnh `1px solid rgba(227, 232, 238, 0.6)`.
  * Padding hào phóng: `24px` - `32px`.
  * Bóng đổ đa tầng đặc trưng Stripe (Layered Ambient + Key Shadows).
* **Payment Inputs & Form Fields**:
  * Chiều cao `44px`, bo góc `8px`.
  * Nền `#FFFFFF`, viền `1px solid #E3E8EE`.
  * Bóng đổ inset siêu mịn: `box-shadow: 0 1px 1px rgba(0,0,0,0.03), inset 0 1px 2px rgba(0,0,0,0.02)`.
  * Focus: Viền `#635BFF`, ring `0 0 0 3px rgba(99,91,255,0.15)`.

### 5. Layout & Spacing Principles (Khoảng cách & nhịp điệu)
* **Khoảng thở (Generous Whitespace)**: Nhịp điệu giãn cách `16px`, `24px`, `32px`, `48px`, `64px`.
* **Họa tiết nghiêng (Diagonal Slanted Backdrops)**: Sử dụng các dải gradient nghiêng `transform: skewY(-6deg)` hoặc mesh gradient góc nghiêng `12deg` tạo chiều sâu chuyển động.
* **Bố cục đa cột linh hoạt**: Căn giữa container tối đa `1200px`, padding lề hai bên tối thiểu `24px`.

### 6. Depth & Elevation Stacking (Xếp lớp bóng đổ đa tầng)
* **Stripe Ambient + Key Multi-Shadow Formula**:
  * *Elevation Low (Thẻ danh sách)*:
    `box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.05);`
  * *Elevation Mid (Thẻ tính năng / Form thanh toán)*:
    `box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.08), 0 -6px 16px -6px rgba(0, 0, 0, 0.025);`
  * *Elevation High (Modal / Menu điều hướng bay)*:
    `box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.12);`

### 7. Do's & Don'ts (Quy tắc thị giác sống còn)
* **DO (Nên làm)**:
  * Sử dụng màu chữ Navy sẫm `#0A2540` thay vì màu đen thuần `#000000` để giữ độ dịu mắt và quý phái.
  * Tận dụng các vệt gradient đa sắc mềm hòa quyện trên nền sáng.
  * Tạo cảm giác bay bổng bằng chuyển động lướt nhẹ khi rê chuột (`translateY(-2px)`).
* **DON'T (Tuyệt đối cấm)**:
  * Không dùng viền đen đậm, cứng nhắc.
  * Không dùng bóng đổ đen đặc đục (`rgba(0,0,0,0.5)`).
  * Không để các thành phần nằm chen chúc, chật chội.

### 8. Responsive & Touch Targets (Hành vi co giãn & kích thước chạm)
* **Mobile Standard**: Touch target tối thiểu `44px` cho toàn bộ các nút bấm và trường nhập dữ liệu.
* **Menu điều hướng**: Tự động biến đổi từ Megamenu dạng hover bay trên Desktop thành Accordion đa tầng mượt mà trên Mobile.
* **Fluid Font Scaling**: Sử dụng CSS `clamp()` cho các tiêu đề lớn (`clamp(2rem, 5vw, 3.5rem)`).

### 9. Agent Prompt Guide (Chỉ dẫn thực chiến cho AI)
```text
Role: Senior Design Technologist implementing Stripe Design Aesthetics.
Aesthetic Invariant: Luminous Light Theme with Multi-Layered Atmosphere.
Key Tokens:
- Canvas: #F6F9FC (Atmospheric Slate), Card: #FFFFFF, Accent: #635BFF (Blurple), Secondary: #00D4B2 (Cyan).
- Text: #0A2540 (Primary Navy), #425466 (Secondary Navy).
- Shadows: Complex layered ambient + key: 0 13px 27px -5px rgba(50,50,93,0.1), 0 8px 16px -8px rgba(0,0,0,0.08).
- Radius: 8px on buttons/inputs, 12px-16px on cards.
- Feel: Generous whitespace, luxurious financial confidence, smooth floating cards with soft gradients.
```

---

## 3. Apple — Human Interface Guidelines & Frosted Glass Depth

### 1. Visual Theme & Atmosphere (Bản sắc thị giác & không khí)
* **Triết lý**: Lấy con người làm trung tâm (Human-Centered), trực quan tự nhiên, độ hoàn thiện cơ khí chính xác, sự thuần khiết thị giác và tương tác vật lý sống động.
* **Không khí (Atmosphere)**: Điềm đạm, đẳng cấp, tối giản tuyệt đối, công nghệ hòa tan vào cuộc sống thường nhật.
* **Luminous Adaptation**: Nền sáng bạc ánh ngọc `#F5F5F7`, kính mờ đa tầng **Frosted Glass / Vibrancy** (`backdrop-filter: blur(20px) saturate(180%)`), bo góc siêu mượt dạng hình quả trứng liên tục (**Continuous Squircle**), đường viền phản quang quang học ánh sáng trắng siêu mảnh (`inset highlight`).

### 2. Color Palette & Roles (Bảng màu ngữ nghĩa & vai trò)
* **Canvas Background (Hệ thống)**: `#F5F5F7` (Apple Light Platinum Canvas)
* **Elevated Surface (Thẻ nổi)**: `#FFFFFF` (Pure White Card)
* **Vibrant Glass (Kính mờ)**: `rgba(255, 255, 255, 0.72)` với `backdrop-filter: blur(20px)`
* **Vibrant Glass Header**: `rgba(245, 245, 247, 0.8)`
* **Text Primary (Tiêu đề & Nội dung)**: `#1D1D1F` (Apple Deep Obsidian)
* **Text Secondary (Ghi chú phụ)**: `#86868B` (Apple Neutral Gray)
* **Text Tertiary (Đường dẫn mờ)**: `#6E6E73`
* **Border System (Viền hệ thống)**: `rgba(0, 0, 0, 0.08)` (Subtle Hairline)
* **Glass Specular Highlight (Viền sáng phản quang)**: `inset 0 1px 1px rgba(255, 255, 255, 0.9)`
* **System Interactive Accents**:
  * *Apple Blue (Mặc định tương tác)*: `#0071E3` / Hover: `#0077ED`
  * *Apple Green (Thành công/An toàn)*: `#34C759`
  * *Apple Amber (Cảnh báo)*: `#FF9500`
  * *Apple Red (Lỗi/Xóa)*: `#FF3B30`
  * *Apple Purple (Sáng tạo/AI Siri)*: `#AF52DE`

### 3. Typography Rules (Hệ thống phân cấp kiểu chữ)
* **Font Family**: `SF Pro Display`, `SF Pro Text`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
* **Editorial Pairing (Tùy chọn phong cách tạp chí)**: `New York` (Apple Serif)
* **Phân cấp kiểu chữ (Type Scale)**:
  * `Large Title (Tiêu đề lớn sản phẩm)`: 40px - 48px, Weight 700, Line-height 1.15, Tracking `-0.022em`
  * `Title 1 (Tiêu đề trang)`: 28px (`1.75rem`), Weight 600, Line-height 1.25, Tracking `-0.015em`
  * `Title 2 (Tiêu đề thẻ)`: 22px (`1.375rem`), Weight 600, Line-height 1.3, Tracking `-0.01em`
  * `Title 3 (Phân mục)`: 18px (`1.125rem`), Weight 600, Line-height 1.35
  * `Body Regular`: 15px (`0.9375rem`), Weight 400, Line-height 1.47, Tracking `-0.005em`
  * `Callout`: 14px, Weight 400, Line-height 1.43
  * `Subheadline`: 13px, Weight 400, Line-height 1.38, Color `#86868B`
  * `Footnote / Caption`: 12px, Weight 400, Line-height 1.33, Color `#86868B`

### 4. Component Stylings (Kiến trúc linh kiện)
* **Buttons (Nút bấm chuẩn Apple HIG)**:
  * Chiều cao: `36px` (compact) hoặc `44px` (touch-friendly primary).
  * Bo góc: `rounded-full` (capsule) hoặc `12px` (squircle).
  * Primary Button: Nền `#0071E3`, chữ `#FFFFFF`, font-weight 500.
  * Secondary Glass Button: Nền `rgba(0, 0, 0, 0.05)`, chữ `#0071E3`, hover `rgba(0, 0, 0, 0.08)`.
  * Hiệu ứng xúc giác: Lò xo vật lý `active:scale(0.965)`, transition `transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1)`.
* **Cards & Bento Grid (Thẻ Bento bo góc tròn mượt)**:
  * Bo góc lớn chuẩn Squircle: `18px` - `24px` (`rounded-2xl` đến `rounded-3xl`).
  * Nền `#FFFFFF` hoặc `rgba(255, 255, 255, 0.8)` có backdrop blur.
  * Viền: `1px solid rgba(0, 0, 0, 0.05)`.
  * Padding: `24px` - `36px`.
* **Navigation Bar & Tab Bar (Thanh điều hướng kính nổi)**:
  * Sticky vị trí trên cùng hoặc đáy màn hình.
  * Nền: `rgba(245, 245, 247, 0.72)`.
  * Kính lọc: `backdrop-filter: blur(20px) saturate(180%)`.
  * Viền đáy phân tách: `1px solid rgba(0, 0, 0, 0.08)`.
* **Segmented Controls (Thanh chọn tab trượt)**:
  * Nền lõm: `#E5E5EA` bo góc `9px`, padding `2px`.
  * Tab được chọn: Thẻ trắng `#FFFFFF` nổi nhẹ với bóng `0 1px 3px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.06)`, bo góc `7px`.

### 5. Layout & Spacing Principles (Khoảng cách & nhịp điệu)
* **Khoảng đệm tự nhiên**: Tối ưu thị giác với các khoảng cách chẵn `8px`, `16px`, `24px`, `32px`, `48px`.
* **Bento Grid Layout**: Bố cục ô gạch bất đối xứng (ví dụ: ô 2x2 kết hợp hai ô 1x1 và một ô 2x1), tạo cảm giác phong phú như triển lãm phần cứng.
* **Căn lề lùi quang học**: Chữ và hình ảnh luôn căn lề trong thẻ cách mép tối thiểu `24px`.

### 6. Depth & Elevation Stacking (Xếp lớp bóng đổ đa tầng)
* **Kính mờ + Quang học lồi (Specular + Ambient Shadows)**:
  * *Elevation Level 1 (Thẻ thông tin Bento)*:
    `background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.04); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);`
  * *Elevation Level 2 (Thanh nổi tương tác / Floating Pill)*:
    `background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);`
  * *Elevation Level 3 (Modal Sheet / Cửa sổ cảnh báo)*:
    `box-shadow: 0 24px 64px rgba(0, 0, 0, 0.14), 0 4px 16px rgba(0, 0, 0, 0.06);`

### 7. Do's & Don'ts (Quy tắc thị giác sống còn)
* **DO (Nên làm)**:
  * Sử dụng bo góc lớn dạng squircle mềm mại (`corner-smoothing: continuous` nếu hỗ trợ, hoặc `rounded-2xl` trở lên).
  * Áp dụng hiệu ứng kính mờ `backdrop-filter: blur(20px)` trên thanh điều hướng và menu nổi.
  * Thêm hiệu ứng đàn hồi co lún khi người dùng bấm vào các phần tử tương tác (`scale(0.965)`).
* **DON'T (Tuyệt đối cấm)**:
  * Không dùng các góc nhọn sắc lẹm hoặc góc bo vụng về (ví dụ chỉ bo 2px trên thẻ lớn).
  * Không sử dụng màu sắc chói lọi quá độ không thuộc bảng màu hệ thống Apple HIG.
  * Không tạo ra giao diện dày đặc chữ mà thiếu khoảng thở hình ảnh.

### 8. Responsive & Touch Targets (Hành vi co giãn & kích thước chạm)
* **Kích thước chạm chuẩn mực**: Tối thiểu tuyệt đối `44 x 44 pt` (`44px`) theo đúng quy chuẩn Apple HIG.
* **Cử chỉ vuốt chạm (Gestural Touch)**: Hỗ trợ vuốt trượt đóng thẻ (swipe-to-dismiss), kéo từ đáy lên (bottom sheet).
* **Safe Area Insets**: Luôn tính toán `env(safe-area-inset-top)` và `env(safe-area-inset-bottom)` cho các thiết bị iPhone/iPad.

### 9. Agent Prompt Guide (Chỉ dẫn thực chiến cho AI)
```text
Role: Apple HIG Human Interface Specialist.
Aesthetic Invariant: Luminous Light Theme with Frosted Glass Vibrancy.
Key Tokens:
- Canvas: #F5F5F7, Surface: #FFFFFF, Glass: rgba(255,255,255,0.72) with blur(20px).
- Text: #1D1D1F (Obsidian), #86868B (Subtle Gray), Accent: #0071E3 (Apple Blue).
- Radius: Generous continuous squircle 18px-24px (rounded-2xl to rounded-3xl).
- Motion: Physical spring active:scale(0.965) with cubic-bezier(0.2, 0.8, 0.2, 1).
- Layout: Bento Grid showcases, generous whitespace, pristine typography hierarchy.
```

---

## 4. Vercel — Monochrome Contrast, Razor Geometry & Geist Utility

### 1. Visual Theme & Atmosphere (Bản sắc thị giác & không khí)
* **Triết lý**: Tương phản cao đơn sắc (High-Contrast Monochrome), chủ nghĩa chức năng thuần khiết (Radical Functionalism), hình học sắc bén, tốc độ biên dịch chớp nhoáng của hạ tầng Serverless & Edge.
* **Không khí (Atmosphere)**: Sắc sảo, chuẩn xác như dao cạo, tập trung cao độ vào mã nguồn và hiệu năng thực thi, không màu mè giả tạo.
* **Luminous Adaptation**: Nền trắng sáng băng tuyết (`#FAFAFA` và `#FFFFFF`), viền sắc nét sợi chỉ mảnh 1px (`#EAEAEA`), văn bản đen tuyền tương phản cao độ (`#000000`), điểm xuyết font Geist Mono cho các chỉ số kỹ thuật và terminal.

### 2. Color Palette & Roles (Bảng màu ngữ nghĩa & vai trò)
* **Canvas Background**: `#FAFAFA` (Pure Light Gray Canvas)
* **Surface Background (Thẻ)**: `#FFFFFF` (Solid White Card)
* **Subtle Surface (Khu vực Code/Pre)**: `#F5F5F5` (Neutral Light Well)
* **Border Standard (Viền chuẩn)**: `#EAEAEA` (Vercel Precision Hairline)
* **Border Hover (Viền khi rê chuột)**: `#888888` / `#999999`
* **Text High-Contrast (Chữ chính)**: `#000000` (Pitch Black, tối đa tương phản)
* **Text Secondary (Chữ mô tả)**: `#666666` (Medium Neutral Gray)
* **Text Muted (Placeholder/Ghi chú)**: `#888888` (Light Slate)
* **Brand Accent Blue (Điểm nhấn hạ tầng)**: `#0070F3` (Vercel Electric Blue)
* **Status Colors**:
  * *Success / Ready*: `#0070F3` (Electric Blue) hoặc `#10B981` (Emerald)
  * *Error / Failed*: `#EE0000` (Vercel Razor Crimson)
  * *Building / Queued*: `#F5A623` (Vercel Amber)

### 3. Typography Rules (Hệ thống phân cấp kiểu chữ)
* **Font Family UI**: `Geist Sans`, `Inter`, `-apple-system`, `sans-serif`
* **Font Family Code/Numbers**: `Geist Mono`, `JetBrains Mono`, `monospace`
* **Phân cấp kiểu chữ (Type Scale)**:
  * `Heading 1`: 24px (`1.5rem`), Weight 600, Line-height 1.3, Tracking `-0.02em`
  * `Heading 2`: 18px (`1.125rem`), Weight 600, Line-height 1.35, Tracking `-0.015em`
  * `Heading 3`: 15px (`0.9375rem`), Weight 600, Line-height 1.4, Tracking `-0.01em`
  * `Body Regular`: 14px (`0.875rem`), Weight 400, Line-height 1.5, Text `#000000`
  * `Body Small`: 12px (`0.75rem`), Weight 400, Line-height 1.5, Text `#666666`
  * `Code Snippet / Branch Git Tag`: 12px, Geist Mono, Weight 500, Tracking `normal`

### 4. Component Stylings (Kiến trúc linh kiện)
* **Buttons (Nút bấm Vercel)**:
  * Chiều cao: `32px` (compact) hoặc `40px` (regular).
  * Bo góc: `6px` (`rounded-md`).
  * Primary Button (Solid Black):
    Nền `#000000`, chữ `#FFFFFF`, viền `1px solid #000000`, hover `background: #222222`.
  * Secondary Button (Hairline Outline):
    Nền `#FFFFFF`, chữ `#000000`, viền `1px solid #EAEAEA`, hover `border-color: #000000; background: #FFFFFF;`.
* **Cards & Project Tiles (Thẻ dự án Vercel)**:
  * Nền `#FFFFFF`, bo góc `8px`.
  * Viền: `1px solid #EAEAEA`.
  * Hover Transition: Viền chuyển mượt sang `#000000` hoặc `#999999` trong `150ms ease`, **không làm nhảy layout**.
  * Padding: `20px` - `24px`.
* **Deploy Status Badges (Huy hiệu trạng thái triển khai)**:
  * Bo góc `rounded-full`, padding `2px 8px`, chiều cao `20px`.
  * Trạng thái Ready: Chấm tròn `8x8px` màu xanh dương điện `#0070F3` (hoặc xanh ngọc) với hiệu ứng nhịp thở quang học nhẹ.
* **Code Blocks & Logs Viewer**:
  * Nền `#F5F5F5`, bo góc `6px`, viền `1px solid #EAEAEA`.
  * Font Geist Mono 13px, khoảng cách dòng `1.5`, thanh cuộn siêu mảnh.

### 5. Layout & Spacing Principles (Khoảng cách & nhịp điệu)
* **Lưới hình học chuẩn 8px**: `8px`, `16px`, `24px`, `32px`, `48px`.
* **Họa tiết lưới điểm (Dot Grid Pattern)**: Sử dụng các chấm tròn siêu nhạt trên nền canvas để tạo cảm giác không gian kỹ thuật:
  `background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px); background-size: 16px 16px;`
* **Cấu trúc Tab phẳng gạch chân**: Tabs không bo tròn, chữ đen/xám với thanh trượt gạch chân 2px màu đen tuyền `#000000`.

### 6. Depth & Elevation Stacking (Xếp lớp bóng đổ đa tầng)
* **Triết lý không lạm dụng bóng**: Dùng đường viền hairline `#EAEAEA` làm yếu tố định hình phân cấp không gian chủ đạo.
* **Bóng đổ quang học tối giản**:
  * *Elevation Level 1 (Card Hover)*:
    `box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);`
  * *Elevation Level 2 (Dropdown Menu / Popover)*:
    `background: #FFFFFF; border: 1px solid #EAEAEA; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);`
  * *Elevation Level 3 (Modal Dialog)*:
    `background: #FFFFFF; border: 1px solid #CCCCCC; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);`

### 7. Do's & Don'ts (Quy tắc thị giác sống còn)
* **DO (Nên làm)**:
  * Sử dụng sự tương phản cao độ giữa Đen `#000000` và Trắng `#FFFFFF`.
  * Trình bày Git SHA, domain, thời gian bằng font Geist Mono.
  * Giữ các góc bo khiêm tốn (chỉ `6px` đến `8px`), tạo cảm giác cơ khí lập trình viên.
* **DON'T (Tuyệt đối cấm)**:
  * Không dùng các góc bo tròn hình viên thuốc lớn (`rounded-3xl`) cho thẻ nội dung.
  * Không dùng màu gradient sặc sỡ kiểu kẹo ngọt.
  * Không làm mờ chữ chính dưới mức độ tương phản WCAG AA.

### 8. Responsive & Touch Targets (Hành vi co giãn & kích thước chạm)
* **Bảng điều khiển Desktop**: Mật độ nén cao với các nút bấm 32px.
* **Mobile Viewport**:
  * Kéo dãn các nút hành động full chiều rộng màn hình.
  * Vùng chạm đạt tối thiểu `40px` - `44px`.
  * Bảng Logs và dữ liệu tràn ngang hỗ trợ thanh cuộn cảm ứng tự nhiên mượt mà.

### 9. Agent Prompt Guide (Chỉ dẫn thực chiến cho AI)
```text
Role: Vercel Frontend Engineer & Geist Design Implementer.
Aesthetic Invariant: Luminous Light Theme (Monochrome High-Contrast).
Key Tokens:
- Canvas: #FAFAFA, Surface: #FFFFFF, Recessed Code: #F5F5F5.
- Border: 1px solid #EAEAEA (Razor Hairline), Hover Border: #000000 or #999999.
- Text: #000000 (Primary Black), #666666 (Secondary Gray).
- Accent: #0070F3 (Electric Blue), Geist Mono for metadata/code.
- Component feel: 6px/8px radius, black solid primary buttons, subtle dot grid, no gratuitous shadows.
```

---

## 5. Supabase — Developer Craftsman & Emerald Accents

### 1. Visual Theme & Atmosphere (Bản sắc thị giác & không khí)
* **Triết lý**: Tinh thần thủ công của lập trình viên (Developer Craftsman), nền tảng dữ liệu nguồn mở mạnh mẽ, bảng điều khiển SQL chính xác, kết hợp điểm nhấn xanh ngọc lục bảo (Emerald Green) tràn đầy sinh lực.
* **Không khí (Atmosphere)**: Đáng tin cậy, thông minh, hỗ trợ xử lý dữ liệu phức tạp với cảm giác thoải mái, không gây mỏi mắt.
* **Luminous Adaptation**: Nền canvas ngà dịu `#F8FAFC` kết hợp thẻ trắng tinh thể `#FFFFFF`, viền xám đá `#E2E8F0`, màu xanh ngọc lục bảo thương hiệu `#3ECF8E` rạng rỡ nổi bật trên nền sáng, mang lại cảm giác công nghệ cao mà tươi mát.

### 2. Color Palette & Roles (Bảng màu ngữ nghĩa & vai trò)
* **Canvas Background**: `#F8FAFC` (Slate Muted Canvas)
* **Warm Canvas (Tùy chọn)**: `#FAF9F6` (Luminous Warm)
* **Surface Background (Thẻ / Bảng dữ liệu)**: `#FFFFFF` (Pure Table White)
* **Subsurface / Table Header**: `#F1F5F9` (Slate Soft Tint)
* **Border Standard**: `#E2E8F0` (Precision Gray Border)
* **Border Subtle**: `#F1F5F9` (Divider Hairline)
* **Brand Primary Accent**: `#3ECF8E` (Supabase Emerald Green)
* **Brand Accent Hover**: `#34B27B` (Deeper Emerald)
* **Brand Accent Light Tint**: `#E6F9F1` (Emerald Pastel Glow Nền)
* **Brand Dark Accent (Text on Emerald)**: `#0F172A` (Slate 900 - Đảm bảo tỷ lệ tương phản WCAG AAA > 7:1 trên nền xanh ngọc)
* **Text Primary**: `#0F172A` (Deep Slate Black)
* **Text Secondary**: `#475569` (Muted Slate)
* **Text Tertiary / Muted**: `#94A3B8` (Soft Slate)
* **Database Syntax Colors (Light Mode SQL)**:
  * *SQL Keywords (SELECT, FROM)*: `#2563EB` (Cobalt Blue)
  * *Strings & Literals*: `#059669` (Emerald Dark)
  * *Table Names & Functions*: `#7C3AED` (Purple)
  * *Numbers & Null*: `#D97706` (Amber)

### 3. Typography Rules (Hệ thống phân cấp kiểu chữ)
* **Font Family UI**: `Inter`, `-apple-system`, `sans-serif`
* **Font Family Data Grid & SQL**: `JetBrains Mono`, `Fira Code`, `monospace`
* **Phân cấp kiểu chữ (Type Scale)**:
  * `Heading 1`: 22px (`1.375rem`), Weight 600, Line-height 1.3
  * `Heading 2`: 16px (`1rem`), Weight 600, Line-height 1.35
  * `Table Header (Tiêu đề cột)`: 12px, Weight 600, Line-height 1.2, Text `#475569`, Tracking `+0.02em`, Monospace hoặc Sans
  * `Table Cell (Dữ liệu ô)`: 13px, Weight 400, Line-height 1.4, Tabular nums, Font JetBrains Mono cho IDs/UUIDs
  * `Body Regular`: 14px, Weight 400, Line-height 1.5
  * `Badge / Role Tag`: 11px, Weight 600, Padding `2px 6px`

### 4. Component Stylings (Kiến trúc linh kiện)
* **Buttons (Nút bấm Supabase Emerald)**:
  * Chiều cao: `32px` (compact) hoặc `36px` (standard).
  * Bo góc: `6px` (`rounded-md`).
  * Primary Emerald Button:
    Nền `#3ECF8E`, chữ `#0F172A` (chữ đậm nét tương phản cao), font-weight 600, viền `1px solid rgba(0,0,0,0.08)`.
    Hover: `background: #34B27B`, `transform: translateY(-1px)`.
  * Secondary Outline Button:
    Nền `#FFFFFF`, chữ `#0F172A`, viền `1px solid #E2E8F0`, hover: `border-color: #3ECF8E; background: #E6F9F1;`.
* **Data Grid & Table Engine (Bảng dữ liệu cơ sở dữ liệu)**:
  * Bảng kẻ sọc hoặc lưới ô phẳng, nền `#FFFFFF`, viền ngoài và viền trong `1px solid #E2E8F0`.
  * Header dòng: Nền `#F8FAFC`, phân cách rõ ràng với nội dung.
  * Chiều cao hàng: `36px` (compact density) hoặc `44px` (comfortable).
  * Trạng thái đang chọn ô: Viền bao quang học xanh ngọc `#3ECF8E` 2px.
* **SQL Query Console (Khung soạn thảo SQL)**:
  * Nền `#FAFAFA`, bo góc `8px`, viền `1px solid #CBD5E1`.
  * Gutter hiển thị số dòng rõ ràng, chữ font `JetBrains Mono` 13px.
  * Nút "Run Query" gắn icon tia sét màu xanh ngọc `#3ECF8E`.
* **Status Badges & Connection Indicator**:
  * Chấm tròn xanh ngọc `#3ECF8E` có vòng sóng lan tỏa (ping animation):
    `<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>`

### 5. Layout & Spacing Principles (Khoảng cách & nhịp điệu)
* **Bố cục 3 phân vùng (Three-Pane Layout)**:
  1. *Sidebar biểu tượng nhỏ bên trái cùng*: Chiều rộng `56px`, nền `#FFFFFF`, viền phải `#E2E8F0`.
  2. *Secondary Navigation (Danh sách bảng DB)*: Chiều rộng `240px`, nền `#F8FAFC`, viền phải `#E2E8F0`.
  3. *Main Workbench (Khu vực thao tác dữ liệu/bảng)*: Nền `#FFFFFF` khoáng đạt.
* **Micro Spacing**: Căn chuẩn theo bước `4px` và `8px` để đảm bảo tối ưu hóa diện tích hiển thị hàng nghìn bản ghi dữ liệu.

### 6. Depth & Elevation Stacking (Xếp lớp bóng đổ đa tầng)
* **Đổ bóng quang học xúc giác**:
  * *Elevation Level 1 (Card / Table Container)*:
    `background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02);`
  * *Elevation Level 2 (Record Detail Drawer / Panel mở rộng)*:
    `background: #FFFFFF; border-left: 1px solid #CBD5E1; box-shadow: -4px 0 16px rgba(15, 23, 42, 0.06);`
  * *Elevation Level 3 (Context Menu / Schema Filter Popover)*:
    `background: #FFFFFF; border: 1px solid #CBD5E1; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1);`

### 7. Do's & Don'ts (Quy tắc thị giác sống còn)
* **DO (Nên làm)**:
  * Đặt chữ màu đen `#0F172A` trên nền nút xanh ngọc `#3ECF8E` để đảm bảo tương phản tuyệt đối thay vì dùng chữ trắng (chữ trắng trên nền ngọc lục bảo không đạt chuẩn WCAG AA).
  * Sử dụng JetBrains Mono hoặc font monospace cho toàn bộ các cột dữ liệu ID, Timestamp, Boolean, JSON.
  * Giữ bảng dữ liệu luôn có đường phân cách hàng ngang rõ ràng.
* **DON'T (Tuyệt đối cấm)**:
  * Không lạm dụng màu xanh ngọc tràn lan làm nền thẻ lớn; màu xanh ngọc chỉ đóng vai trò điểm nhấn hành động (accent) và chỉ báo trạng thái.
  * Không làm mờ hay ẩn các đường viền bảng dữ liệu khiến thông tin bị dính chùm.

### 8. Responsive & Touch Targets (Hành vi co giãn & kích thước chạm)
* **Bảng dữ liệu trên Mobile**:
  * Cột khóa chính (ID/Name) được cố định ghim cứng (`sticky left-0`).
  * Các cột còn lại cuộn ngang mượt mà với chỉ báo cuộn trực quan.
* **Chế độ xem bản ghi**: Tự động chuyển đổi thành Drawer kéo từ cạnh phải trên Tablet hoặc Bottom Sheet toàn màn hình trên Mobile để chỉnh sửa từng trường dữ liệu.

### 9. Agent Prompt Guide (Chỉ dẫn thực chiến cho AI)
```text
Role: Senior Full-Stack Engineer implementing Supabase UI/UX.
Aesthetic Invariant: Luminous Light Theme with Emerald Craftsmanship.
Key Tokens:
- Canvas: #F8FAFC, Card/Table: #FFFFFF, Recessed: #F1F5F9.
- Border: 1px solid #E2E8F0, Accent: #3ECF8E (Supabase Emerald).
- Text on Emerald: #0F172A (Deep Slate for WCAG AAA contrast).
- Typography: Inter for UI, JetBrains Mono for Table Cells/SQL/IDs (tabular-nums).
- Component feel: Three-pane layout, crisp data grids, 6px radius, emerald active indicators.
```

---

## 📊 BẢNG SO SÁNH NHANH 5 THƯƠNG HIỆU (COMPARISON MATRIX)

| Tiêu chí | 1. Linear | 2. Stripe | 3. Apple | 4. Vercel | 5. Supabase |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Canvas Light** | `#F8F9FA` | `#F6F9FC` / `#FAF9F6` | `#F5F5F7` | `#FAFAFA` | `#F8FAFC` |
| **Card Surface** | `#FFFFFF` (1px Border) | `#FFFFFF` (Pillowy Float) | `#FFFFFF` / Frosted Glass | `#FFFFFF` (Sharp Hairline) | `#FFFFFF` (Data Grid) |
| **Key Accent** | `#5E6AD2` (Indigo) | `#635BFF` (Blurple) | `#0071E3` (Apple Blue) | `#0070F3` (Electric Blue) | `#3ECF8E` (Emerald) |
| **Text Primary** | `#0F172A` | `#0A2540` | `#1D1D1F` | `#000000` | `#0F172A` |
| **Bo góc (Radius)**| `6px` (`rounded-md`) | `8px` - `16px` | `18px` - `24px` (Squircle) | `6px` - `8px` | `6px` (`rounded-md`) |
| **Bóng đổ (Shadow)**| Nhẹ 1px (`0 1px 2px`) | Phức hợp Key+Ambient | Specular Inset + Ambient | Cực nhẹ / Ưu tiên Hairline | Xúc giác nhẹ (`0 1px 3px`)|
| **Đặc trưng cốt lõi**| Mật độ nén, phím tắt ⌘K | Gradient mượt, bồng bềnh | Kính mờ, lò xo đàn hồi | Tương phản đen trắng, Geist| Bảng dữ liệu SQL, Emerald |

---
*Biên soạn và kiểm chứng độc lập bởi Pod 1 [Brand Design Specs Crafter] — Antigravity 2.0 Enterprise Fleet.*
