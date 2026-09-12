---
name: gsap
description: "Official GreenSock (GSAP) Animation Engine — 60 FPS performant UI motion, timelines, ScrollTrigger, React useGSAP, and Club plugins (SplitText, MorphSVG, ScrollSmoother, Flip). Activate ONLY for dedicated JavaScript animations, complex timelines, scroll-driven choreographies, or SVG morphing. DO NOT use for standard CSS transitions, routine styling, static UI components, or admin CRUD screens (use native CSS or ui-ux-pro-max instead)."
---

# Master GSAP Animation Engine (`$gsap`)

Kiến trúc sư trưởng chuyển động giao diện chuẩn **60 FPS** dựa trên nền tảng **GreenSock Animation Platform (GSAP)** chính thức. Tích hợp trọn vẹn 8 phân hệ kỹ thuật chuyên sâu, triệt tiêu lỗi rò rỉ bộ nhớ, tối ưu hóa luồng dựng card đồ họa (`GPU Compositor Thread`) và đảm bảo tiêu chuẩn tiếp cận **WCAG AA** (`prefers-reduced-motion`).

> [!IMPORTANT]
> **GSAP Hoàn Toàn Miễn Phí (100% Free)**: Kể từ khi Webflow sáp nhập GSAP, toàn bộ các plugin trước đây thuộc gói trả phí `Club GSAP` (**SplitText**, **MorphSVG**, **ScrollSmoother**, **Flip**, **Inertia**, **ScrambleText**...) nay đều **hoàn toàn miễn phí** cho mọi mục đích thương mại. Chỉ cần cài đặt qua package công khai:
> ```bash
> npm install gsap @gsap/react
> ```
> Tuyệt đối không yêu cầu thẻ thành viên, không cần `.npmrc`, auth token hay private registry.

---

## 1. Năm Quy Tắc Vàng Khi Lập Trình GSAP (The 5 Golden Rules)

### Quy tắc 1: Luôn dùng Transform Aliases (Bí danh Chuyển đổi GPU)
Tuyệt đối không animate các thuộc tính gây `Layout Reflow (Tái tính toán bố cục)` như `top`, `left`, `margin`, `width`, `height`. Luôn ưu tiên bí danh tăng tốc phần cứng (`Hardware Accelerated`):
* `x: 100` / `y: 50` thay vì `left: 100px` / `top: 50px` (đơn vị pixel).
* `xPercent: -50` / `yPercent: -50` cho các chuyển động theo tỉ lệ % hoặc căn giữa (cực tốt cho responsive và SVG).
* `autoAlpha: 0` hoặc `1` thay cho `opacity` thuần: `autoAlpha` tự động kết hợp `opacity` và `visibility: hidden`, giúp loại bỏ phần tử khỏi luồng tương tác/click khi ẩn.

### Quy tắc 2: Đăng ký Plugin Một Lần Duy Nhất (`Register Once`)
Luôn gọi `gsap.registerPlugin(...)` ở cấp cao nhất của ứng dụng (Root / App entrypoint):
```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
```

### Quy tắc 3: Chuẩn Mực React / Next.js với `@gsap/react`
* Sử dụng hook chính thức `useGSAP()` thay cho `useEffect()` thông thường.
* Luôn khai báo `{ scope: containerRef }` để tự động dọn dẹp (`Garbage Collection`), tránh hiện tượng double-animation trong chế độ `React 18 StrictMode`.
```jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function HeroBanner() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from(".hero-title", { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out" });
  }, { scope: container });

  return (
    <div ref={container} className="hero">
      <h1 className="hero-title">Welcome</h1>
    </div>
  );
}
```

### Quy tắc 4: ScrollTrigger & Tái Tính Toán Layout (`Refresh Lifecycle`)
* Khi nội dung DOM thay đổi (tải ảnh, async fetch, thay đổi kích thước container), luôn gọi:
  ```javascript
  ScrollTrigger.refresh();
  ```
* Với chuyển động cuộn nhiều bước, ưu tiên gắn `scrollTrigger` vào một `gsap.timeline()` thay vì tạo rời rạc nhiều tween.

### Quy tắc 5: Tuân Thủ Tiêu Chuẩn Tiếp Cận (`WCAG Accessibility`)
Bắt buộc hỗ trợ người dùng bật chế độ giảm chuyển động (`prefers-reduced-motion`) bằng `gsap.matchMedia()`:
```javascript
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Thực hiện animation 60 FPS đầy đủ
  gsap.to(".card", { y: -10, duration: 0.3 });
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Chỉ đổi màu hoặc fade cực nhẹ, không chuyển dịch tọa độ
  gsap.to(".card", { autoAlpha: 1, duration: 0.1 });
});
```

---

## 2. Mã Mẫu Tiêu Chuẩn Theo Từng Nhu Cầu (`Canonical Code Patterns`)

### Mẫu 1: Timeline Biên Đạo Nhiều Bước (`Choreographed Sequence`)
```javascript
const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });

tl.from(".badge", { scale: 0.8, autoAlpha: 0 })
  .from(".heading", { y: 20, autoAlpha: 0 }, "-=0.3") // Chạy sớm hơn 0.3s
  .from(".description", { y: 15, autoAlpha: 0 }, "-=0.2")
  .from(".cta-button", { y: 10, autoAlpha: 0, stagger: 0.1 }, "-=0.1");
```

### Mẫu 2: Scrollytelling Pin & Scrub (`Ghim Khung Hình & Cuộn Đồng Bộ`)
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".story-section",
    start: "top top",
    end: "+=200%",
    pin: true,       // Ghim màn hình cố định
    scrub: 1,        // Chuyển động mượt trễ 1 giây theo thanh cuộn
    anticipatePin: 1
  }
})
.to(".story-bg", { scale: 1.2 })
.from(".story-caption-1", { autoAlpha: 0, y: 30 })
.to(".story-caption-1", { autoAlpha: 0, y: -30 })
.from(".story-caption-2", { autoAlpha: 0, y: 30 });
```

### Mẫu 3: Tách Chữ Nghệ Thuật (`SplitText Character Reveal`)
```javascript
const split = new SplitText(".headline", { type: "words,chars" });

gsap.from(split.chars, {
  autoAlpha: 0,
  y: 40,
  rotateX: -60,
  stagger: 0.02,
  duration: 0.8,
  ease: "back.out(1.7)"
});

// Cleanup khi unmount: split.revert();
```

### Mẫu 4: Tương Tác Chuột Tốc Độ Cao (`High-Frequency Mouse Tracking`)
Sử dụng `gsap.quickTo()` để khử hiện tượng lag giật / Garbage Collection khi lắng nghe sự kiện `pointermove`:
```javascript
const xTo = gsap.quickTo(".cursor-dot", "x", { duration: 0.2, ease: "power3" });
const yTo = gsap.quickTo(".cursor-dot", "y", { duration: 0.2, ease: "power3" });

window.addEventListener("pointermove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

---

## 3. Bản Đồ Tài Liệu Chuyên Sâu (`Deep Reference Directory`)

Khi cần tra cứu cú pháp chi tiết hoặc giải quyết bài toán phức tạp, đọc các file tài liệu chuyên sâu đặt tại:
`C:\Users\game\.gemini\config\skills\gsap\references\`

1. **[`core.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/core.md)**: Toàn bộ API lõi `to`, `from`, `fromTo`, các hàm `ease`, `stagger`, xử lý `immediateRender`.
2. **[`timeline.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/timeline.md)**: Điều phối chuỗi timeline, các ký hiệu vị trí `+=`, `-=`, `<`, `>`, nhãn `addLabel`.
3. **[`scrolltrigger.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/scrolltrigger.md)**: Toàn tập ScrollTrigger: Pinning, Scrubbing, ToggleActions, tối ưu mobile.
4. **[`react.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/react.md)**: Toàn diện về `@gsap/react`, `useGSAP`, SSR Next.js App Router, dọn sạch ref.
5. **[`plugins.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/plugins.md)**: Hướng dẫn chi tiết tất cả các plugin cao cấp (SplitText, MorphSVG, Flip, ScrollSmoother, Draggable, Inertia, Observer...).
6. **[`performance.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/performance.md)**: Kỹ thuật ép xung 60 FPS, GPU compositing, kiểm soát `will-change`.
7. **[`utils.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/utils.md)**: Tiện ích toán học `clamp`, `mapRange`, `interpolate`, `pipe`, `toArray`.
8. **[`frameworks.md`](file:///C:/Users/game/.gemini/config/skills/gsap/references/frameworks.md)**: Hướng dẫn vòng đời trên Vue 3, Nuxt, Svelte 5, SvelteKit và Astro.
