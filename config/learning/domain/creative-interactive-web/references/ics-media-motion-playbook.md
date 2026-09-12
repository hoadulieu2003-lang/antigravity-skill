# ICS Media Motion & WebGPU Playbook — Creative Front-end Engineering

> **Quản trị Miền (Domain Governance)**:
> - **Phạm vi (Scope)**: `DOMAIN: CREATIVE_INTERACTIVE_WEB`
> - **Nguồn gốc (Source)**: Nghiên cứu từ [ICS Media](https://ics.media/en/) & [ICS Three.js Tutorial](https://ics.media/tutorial-three/) (Sáng lập: IKEDA Yasunobu / ICS Inc. Japan)
> - **Trạng thái (Lifecycle State)**: `ACTIVATED_DOMAIN_REFERENCE` (Đã được kích hoạt và sẵn sàng tham chiếu trong miền Web Sáng tạo)
> - **Bất biến Tuân thủ**: `INV-E03` (Cô lập trong miền thiết kế tương tác, không áp đặt thành luật toàn cục `GLOBAL`)

---

## 1. Triết lý Thiết kế Tương tác Nhật Bản (ICS Design Engineering Axiom)

1. **Hiệu năng là Mỹ cảm (Performance is Aesthetics)**: Chuyển động dù đẹp đến đâu nếu tụt dưới 60 FPS đều là thất bại. Tối ưu hóa chuyển động để chạy trên luồng `Compositor Thread (Luồng kết hợp hiển thị)` của trình duyệt thay vì làm nghẽn `Main Thread (Luồng thực thi chính)`.
2. **CSS-First Motion (Ưu tiên Chuyển động bằng CSS thuần)**: Nếu CSS hiện đại (Scroll-driven, `linear()`, `@starting-style`) có thể giải quyết được, tuyệt đối không dùng thư viện JavaScript cồng kềnh.
3. **Vi tương tác Xúc giác (Tactile Microinteractions)**: Phản hồi của giao diện phải có cảm giác vật lý tự nhiên (Spring Physics, Safe Navigation, Ripple) ngay khi người dùng chạm hoặc di chuột.
4. **Kiến trúc WebGPU Thế hệ mới**: Đón đầu chuẩn WebGPU với Three.js r182+ và TSL (`Three.js Shading Language`), tận dụng triệt để năng lực tính toán song song của phần cứng GPU.

---

## 2. Trụ Cột 1: Next-Gen WebGPU & Modern Three.js (r182+)

### 2.1. Bộ Khởi tạo Chuẩn WebGPU Renderer (với Fallback WebGL)
Three.js từ phiên bản r182 đã cung cấp `WebGPURenderer` hợp nhất có khả năng tự động fallback về WebGL 2 nếu phần cứng hoặc trình duyệt chưa hỗ trợ WebGPU.

```javascript
import * as THREE from 'three';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

export async function createNextGenRenderer(container) {
  // Khởi tạo WebGPURenderer thế hệ mới
  const renderer = new WebGPURenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Chống hao pin màn Retina
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Chuẩn màu điện ảnh
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  await renderer.init(); // Bắt buộc await khởi tạo WebGPU adapter
  container.appendChild(renderer.domElement);

  return renderer;
}
```

### 2.2. TSL (Three.js Shading Language) — Viết Shader Không Dùng GLSL Cổ Điển
TSL cho phép định nghĩa các node shader trực tiếp bằng JavaScript/TypeScript mà không cần ghép chuỗi GLSL, biên dịch mượt mà trên cả WebGL (GLSL) và WebGPU (WGSL).

```javascript
import { color, positionLocal, time, sin, vec3 } from 'three/tsl';
import * as THREE from 'three';

// Tạo vật liệu NodeMaterial với hiệu ứng sóng biển (Wave displacement)
const material = new THREE.MeshStandardNodeMaterial();

// Tính toán biến dạng tọa độ đỉnh (Vertex Displacement) theo thời gian
const waveOffset = sin(positionLocal.x.mul(3.0).add(time.mul(2.0))).mul(0.2);
material.positionNode = positionLocal.add(vec3(0, waveOffset, 0));

// Tính toán đổi màu theo tọa độ độ cao (Height Gradient Color)
const topColor = color(0x00ffff);
const bottomColor = color(0x000033);
material.colorNode = topColor.mix(bottomColor, positionLocal.y.add(0.5));
```

### 2.3. Kiến trúc Độc Lập Khung Hình với OffscreenCanvas & Web Worker
Để đảm bảo website tương tác nặng không bao giờ giật lag khung hình 3D:
1. Giao diện DOM HTML (Main Thread) nắm giữ thẻ `<canvas>`.
2. Chuyển quyền điều khiển: `const offscreen = canvas.transferControlToOffscreen();`.
3. Gửi `offscreen` sang `three.worker.js` bằng `worker.postMessage({ canvas: offscreen }, [offscreen]);`.
4. Toàn bộ tính toán Three.js, particle physics, và render loop chạy 100% trong Worker, Main Thread hoàn toàn rảnh tay để phản hồi scroll và click.

---

## 3. Trụ Cột 2: CSS-First Motion & Spring Physics

### 3.1. Scroll-Driven Animations (Chuyển động Dẫn dắt bởi Cuộn thuần CSS)
Không cần cài đặt GSAP ScrollTrigger hay thư viện cuộn JS cho các hiệu ứng cơ bản. Trình duyệt thực thi trực tiếp trên GPU compositor thread.

```css
/* Thanh tiến trình đọc (Scroll Progress Bar) không tốn 1 dòng JS */
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  transform-origin: left;
  animation: scale-progress linear;
  animation-timeline: scroll(root block); /* Khóa theo thanh cuộn toàn trang */
}

@keyframes scale-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Hiệu ứng Fade & Phóng to thẻ khi lọt vào màn hình (View-driven) */
.reveal-card {
  animation: card-appear ease-out both;
  animation-timeline: view();
  animation-range: entry 10% cover 40%; /* Kích hoạt khi phần tử vào 10% và đạt đỉnh ở 40% */
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### 3.2. Đường Cong Vật Lý Lò Xo với CSS `linear()` Spring Physics
Thay vì `ease-in-out` đơn điệu, mô phỏng cảm giác nảy đàn hồi tự nhiên (Spring Physics) của Apple iOS / macOS bằng cách lấy mẫu hàm lò xo vào `linear()`:

```css
:root {
  /* Đường cong lò xo nảy tự nhiên (Damped Spring Curve) */
  --spring-bounce: linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
    0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50.1%, 1.015 55%, 1.017 60.5%,
    1.014 67.1%, 1.001 82.2%, 1
  );
  --spring-duration: 650ms;
}

.interactive-card {
  transition: transform var(--spring-duration) var(--spring-bounce);
}

.interactive-card:hover {
  transform: translateY(-8px) scale(1.02);
}
```

### 3.3. Entry/Exit Lifecycle Mượt mà với `@starting-style`
Xóa bỏ vĩnh viễn tình trạng giật cục khi mở popup / modal / menu dropdown:

```css
dialog[open] {
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms ease, transform 300ms var(--spring-bounce), display 300ms allow-discrete;
}

/* Định nghĩa trạng thái xuất phát điểm trước khi DOM hiển thị */
@starting-style {
  dialog[open] {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

---

## 4. Trụ Cột 3: Vi Tương Tác Tinh Tế Chuẩn Nhật Bản (Japanese Precision UI)

### 4.1. Kỹ Thuật "Tam Giác An Toàn" (CSS Safe Triangle cho Dropdown Menu)
* **Vấn đề**: Khi di chuyển chuột từ danh mục menu cha sang menu con theo đường chéo, con trỏ chuột dễ bị lọt ra vùng trống làm menu con bị đóng đột ngột (rất khó chịu).
* **Giải pháp ICS Media**: Dựng một vùng đệm đa giác vô hình (`polygon`) kết nối con trỏ chuột với góc menu con.

```html
<nav class="nav-container">
  <div class="nav-item">
    <button class="nav-trigger">Sản Phẩm</button>
    <!-- Tam giác an toàn đệm vô hình -->
    <div class="safe-triangle-hitbox"></div>
    <div class="submenu-panel">
      <a href="#link1">Tính Năng 1</a>
      <a href="#link2">Tính Năng 2</a>
    </div>
  </div>
</nav>
```

```css
.nav-item {
  position: relative;
}

.nav-item .submenu-panel {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 240px;
  background: #18181b;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Vùng đệm hitbox tam giác kết nối */
.nav-item .safe-triangle-hitbox {
  display: none;
  position: absolute;
  top: 100%;
  left: -20px;
  width: calc(100% + 40px);
  height: 20px; /* Khoảng cách đệm giữa trigger và menu */
  background: transparent;
}

.nav-item:hover .submenu-panel,
.nav-item:hover .safe-triangle-hitbox {
  display: block;
}
```

### 4.2. Hiệu ứng Nút Bấm Sóng Nước Phản Hồi Xúc Giác (Tactile Ripple Effect)
Tận dụng CSS Custom Properties kết hợp click coordinate để tạo sóng nước mượt mà không làm vỡ DOM:

```javascript
document.querySelectorAll('.tactile-btn').forEach(button => {
  button.addEventListener('pointerdown', e => {
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    button.style.setProperty('--ripple-x', `${x}%`);
    button.style.setProperty('--ripple-y', `${y}%`);
    button.classList.remove('is-active');
    void button.offsetWidth; // Buộc reflow để reset animation
    button.classList.add('is-active');
  });
});
```

```css
.tactile-btn {
  position: relative;
  overflow: hidden;
  --ripple-x: 50%;
  --ripple-y: 50%;
}

.tactile-btn::after {
  content: '';
  position: absolute;
  top: var(--ripple-y);
  left: var(--ripple-x);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  pointer-events: none;
}

.tactile-btn.is-active::after {
  animation: ripple-wave 500ms ease-out forwards;
}

@keyframes ripple-wave {
  to {
    transform: translate(-50%, -50%) scale(25);
    opacity: 0;
  }
}
```

---

## 5. Trụ Cột 4: Ngân Sách Khung Hình & Tối Ưu Hóa 60 FPS (Frame Budgeting)

### 5.1. Quy tắc Ngân Sách 16.6ms
Để đạt chuẩn mượt 60 FPS (hoặc 8.3ms cho màn hình 120Hz ProMotion):
1. **Chỉ animate `transform` và `opacity`**: Tuyệt đối tránh animate `width`, `height`, `top`, `left`, `margin`, `padding` vì sẽ gây ra `Layout Thrashing (Tái bố cục dồn dập)` làm sụt khung hình.
2. **Quản lý `will-change` chặt chẽ**:
   - Chỉ bật `will-change: transform` trước khi bắt đầu chuyển động (hoặc khi `:hover`).
   - Gỡ bỏ `will-change` sau khi hoàn thành animation để giải phóng `GPU VRAM (Bộ nhớ đồ họa)`.

### 5.2. Đường Ống Tài Nguyên Siêu Nhẹ (Asset Pipeline)
- **Ảnh tĩnh**: Chuẩn hóa chuyển dịch sang AVIF (nén tốt hơn WebP 20-30%), fallback WebP.
- **Mô hình 3D**: Sử dụng định dạng `.glb` nén bằng **Draco Geometry** và **KTX2 / Basis Universal** texture compression. Giảm kích thước file từ 20MB xuống dưới 2MB mà không mất chi tiết.

---

## 6. Hướng Dẫn Tích Hợp vào $design & Dynamic Project System

Khi triển khai các dự án thuộc miền `CREATIVE_INTERACTIVE_WEB` (Portfolio, Landing Page, Brand Experience):
1. **Art Direction Gate**: Sử dụng phong cách chuyển động từ cẩm nang này trong mục `MOTION_PRINCIPLES` của `DESIGN_CONTRACT.yaml`.
2. **Phối hợp Năng lực (Capability Coordination)**:
   - Hiệu ứng cuộn trang cơ bản: Dùng **CSS Scroll-driven**.
   - Hiệu ứng phức tạp có Timeline đồng bộ âm thanh / SVG: Điều phối sang **GSAP**.
   - Không gian 3D, hạt vi mô, shader: Điều phối sang **Three.js WebGPU**.
