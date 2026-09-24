# 🌟 10 Signature Wow Blocks Library — OpenDesign Studio

Kho thư viện 10 Khối giao diện Độc bản Awwwards / Linear dựng sẵn, chuẩn hóa 100% theo quy chuẩn **`Luminous Light Theme Invariant (Quy chuẩn Giao diện Sáng Đa Tầng Luminous)`** và triết lý Kỹ nghệ Thiết kế Emil Kowalski.

---

## 🏛️ 1. Danh Mục 10 Khối Giao Diện Độc Bản (Blocks Catalog)

| # | Khối Giao Diện (`File`) | Thể Loại | Đặc Tính Nổi Bật & Vi Tương Tác |
|---|---|---|---|
| **01** | [`GlassHudNav.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/GlassHudNav.html) | Navigation | Thanh điều hướng kính mờ đa tầng (`backdrop-filter: blur(16px)`), bộ đếm FPS live qua `requestAnimationFrame`, nút bật/tắt Web Audio haptic, sliding active pill. |
| **02** | [`BentoTelemetryGrid.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/BentoTelemetryGrid.html) | Dashboard / Grid | Lưới Bento 12 cột bất đối xứng, thẻ Acrylic viền quang học, CSS keyframe `edge-stream` xoay chùm tia sáng quanh đường biên card, ticker live. |
| **03** | [`TactileMagneticButton.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/TactileMagneticButton.html) | Interaction | Kiến trúc 2 tầng DOM tách biệt (`magnetic-anchor` bắt tiệm cận chuột + `tactile-core :active scale(0.965)`), bù lề quang học nút Play `+1.5px`, hold-to-confirm. |
| **04** | [`MechanicalOdometerCounter.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/MechanicalOdometerCounter.html) | Data / Counter | Con lăn số lật cơ học (cylindrical tumbler reels), bóng đổ vát gờ detent âm (`inset`), âm thanh click cơ học tổng hợp từ Web Audio API. |
| **05** | [`SpecularSpotlightCard.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/SpecularSpotlightCard.html) | Product / Card | Đèn rọi tiệm cận Euclid (Euclidean Proximity) 2 tầng (viền specular 1px rực sáng ngay dưới trỏ chuột + quầng sáng mặt thẻ dịu nhẹ), viền quang học siêu mảnh. |
| **06** | [`ScrollytellingPinnedStage.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/ScrollytellingPinnedStage.html) | Hero / Scrolly | Sân khấu ghim màn hình (`position: sticky`) tua tiến trình cuộn 60 FPS, chuyển 3 chương biến hình đồ họa AST -> Swarm -> Verification 215/215. |
| **07** | [`SpotlightCommandPalette.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/SpotlightCommandPalette.html) | Command / Modal | Hộp tìm kiếm `Cmd+K` / `Ctrl+K` kiểu Raycast/Spotlight, 0ms keyboard animation latency, phân nhóm kết quả, điều hướng phím mũi tên và âm thanh xúc giác. |
| **08** | [`SonnerLuminousToast.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/SonnerLuminousToast.html) | Feedback / Toast | Hệ thống Toast lò xo xếp chồng chuẩn Emil Kowalski, bung mở dọc khi hover, tự dừng đếm ngược khi đổi tab trình duyệt (`document.hidden`), swipe-to-dismiss. |
| **09** | [`MicroDataVisualizer.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/MicroDataVisualizer.html) | Telemetry / Audio | Biểu đồ sóng âm Canvas 60 FPS đa dải tần kèm bộ phát âm thanh tổng hợp 432 Hz, sparkline tương tác với con trỏ chữ thập từ tính (magnetic crosshair tooltip). |
| **10** | [`LuminousPaletteMorpher.html`](file:///C:/Users/game/.gemini/config/skills/open-design/blocks/LuminousPaletteMorpher.html) | Theme / Tool | Bộ chuyển đổi 6 dải màu sáng đa tầng (Icy Platinum, Ivory Luxury, Warm Alabaster, Emerald Pearl, Rose Quartz, Violet Celestial) kèm copy CSS/Tailwind 1-click. |

---

## ☀️ 2. Tôn Chỉ Luminous Light Theme Invariant

Tất cả các khối trong thư viện đều tuân thủ 100% chuẩn mực giao diện sáng đa tầng:
1. **Nền Sáng Đa Tầng (`Multi-Layered Luminous Surfaces`)**:
   - Canvas nền: Icy Platinum `#F8FAFC`, Ivory `#FDFBF7`, Warm Paper `#FAF9F6`, Alabaster `#F8F9FA`.
   - Bề mặt thẻ: Trắng tinh khiết `#FFFFFF` hoặc kính Acrylic mờ (`rgba(255, 255, 255, 0.85)` + `backdrop-filter: blur(16px)`).
2. **Bóng Đổ Đa Chiều Siêu Mịn (`Multi-Dimensional Layered Shadows`)**:
   - Lớp bóng ambient kết hợp key shadow: `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -2px rgba(15, 23, 42, 0.05)`.
   - Tuyệt đối cấm bóng đen đặc bẹt dính.
3. **Viền Quang Học & Inset Highlight (`Luminous Borders`)**:
   - Viền ngoài siêu mảnh: `1px solid rgba(15, 23, 42, 0.08)`.
   - Viền phản quang trên đỉnh: `inset 0 1px 0 rgba(255, 255, 255, 0.95)`.
4. **Triệt Tiêu Giấy Bẹt Đơn Điệu (`Anti-Flat Monolithic Paper`)**:
   - Không dùng nền trắng bẹt `#FFFFFF` đơn điệu không có độ sâu.

---

## 🚀 3. Hướng Dẫn Tích Hợp Nhanh (Integration Guide)

### 3.1. Dùng Trực Tiếp HTML Thuần / Vanilla JS (0 KB Dependencies)
Mỗi file `.html` trong thư mục `blocks/` là một bản mẫu **hoàn toàn độc lập** (`self-contained`), có thể chạy ngay bằng cách mở trực tiếp trong trình duyệt hoặc nhúng vào ứng dụng web:

```html
<!-- Nhúng component TactileMagneticButton -->
<div class="magnetic-anchor" data-magnetic-pull="0.35">
  <button class="tactile-core" type="button">
    <span>Launch Cluster</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>
</div>
```

### 3.2. Chuyển Đổi Sang Tailwind CSS
Tất cả các khối đều dễ dàng ánh xạ sang các tiện ích của Tailwind CSS:

```html
<!-- Ví dụ thẻ Specular Spotlight Card bằng Tailwind CSS -->
<div class="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-slate-900/10 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_-4px_rgba(15,23,42,0.09)] transition-all duration-200">
  <div class="flex items-center gap-2 mb-3">
    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-600 border border-sky-200">
      Enterprise Tier
    </span>
  </div>
  <h3 class="text-2xl font-extrabold tracking-tight text-slate-900">Antigravity Neural Node</h3>
  <p class="text-sm text-slate-600 mt-2 leading-relaxed">Low-latency agent orchestrator delivering synchronized multi-pod parallel processing.</p>
  <button class="mt-6 w-full py-3 rounded-xl bg-gradient-to-b from-sky-600 to-sky-700 text-white font-semibold shadow-md active:scale-[0.965] transition-transform duration-150">
    Deploy Instance
  </button>
</div>
```

---

## 🔊 4. Tiện Ích Web Audio Haptics Tổng Hợp

Các khối tích hợp bộ tổng hợp âm thanh xúc giác cơ học qua Web Audio API thuần (0 file mp3, 0 độ trễ):
- **Click (`800Hz -> 200Hz`)**: Âm thanh nhấn công tắc cơ học thanh lịch cho nút bấm.
- **Detent Tick (`1200Hz -> 180Hz`)**: Âm thanh nấc xoay bánh cóc cho con lăn số Odometer.
- **Chime (`Triad C6, E6, G6`)**: Âm thanh ngân 3 nốt thánh thót khi hoàn tất tác vụ hoặc bung Toast.
- **Pop (`320Hz -> 840Hz`)**: Âm thanh bong bóng nở khi kích hoạt modal hoặc thẻ thông báo.

---

## ♿ 5. Khả Năng Tiếp Cận (WCAG AA & Accessibility)

- **Semantic HTML**: Sử dụng chuẩn `nav`, `main`, `button[type="button"]`, `role="dialog"`, `aria-modal="true"`.
- **Contrast**: Độ tương phản chữ và nền vượt chuẩn WCAG AA $\ge 4.5:1$ cho văn bản thường và $\ge 3:1$ cho tiêu đề lớn.
- **Focus States**: Hỗ trợ đầy đủ phím Tab, Enter, Escape, Arrow Up/Down.
- **Prefers Reduced Motion**: Sẵn sàng tích hợp `@media (prefers-reduced-motion: reduce)` giảm chuyển động khi người dùng yêu cầu.
