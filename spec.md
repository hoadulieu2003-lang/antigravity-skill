# SPECIFICATION & MASTER ARCHITECTURE: KRONOS-01
## Flagship Autonomous AI Agent Orchestration Deck (Landing Page)
**Step 1 ($plan + $design) — Universal Definition Handoff**
**Document Version:** 1.0.0-PROD
**Status:** `READY_FOR_DELIVERY`
**Architect / Owner:** Anh — Lead Architect / Product Owner
**Engineering Agent:** Em — AI Pair-Programmer / Senior Engineering Agent

---

## 1. PROJECT & DELIVERABLE TYPE (LOẠI DỰ ÁN & SẢN PHẨM BÀN GIAO)
* **Project Name (Tên dự án):** KRONOS-01 // Autonomous AI Agent Orchestration Deck.
* **Deliverable Type (Loại sản phẩm bàn giao):** Flagship Interactive Web Application / High-Converting Landing Page (Trang đích tương tác đỉnh cao chuyển đổi cao).
* **Target Industry (Ngành công nghiệp mục tiêu):** AI Infrastructure (Hạ tầng Trí tuệ Nhân tạo), Tactile Hardware & Developer Tools (Phần cứng xúc giác & Công cụ lập trình viên), Autonomous Agent Swarms (Bầy tác tử AI tự trị).
* **Aesthetic Direction (Định hướng thẩm mỹ):** Giao thoa giữa **Teenage Engineering** (Tactile Industrial Hardware / Phần cứng công nghiệp xúc giác), **Linear App** (Dark-Mode Minimalism / Tối giản nền tối chuẩn xác), và **Apple Keynote / Awwwards** (Cinematic Scrollytelling / Trình diễn điện ảnh qua cuộn trang).

---

## 2. PROBLEM & INTENDED OUTCOME (BÀI TOÁN & KẾT QUẢ KỲ VỌNG)
### 2.1. The Core Problem (Bài toán cốt lõi)
* Hiện nay, việc giám sát và điều phối `Multi-Agent Systems (Hệ thống đa tác tử)` phần lớn dựa vào giao diện web dashboard phẳng (`Flat SaaS Dashboards`), gây ra hiện tượng `Browser Tab Fatigue (Kiệt sức vì mở quá nhiều tab trình duyệt)`, thiếu phản hồi vật lý (`Physical Haptic Feedback`), và không mang lại cảm giác làm chủ tức thì (`Real-time Agency & Command`) đối với các bầy AI tự hành có thông lượng xử lý hàng triệu token mỗi giây.

### 2.2. The Intended Outcome (Kết quả kỳ vọng)
* Xây dựng trang đích tương tác hàng đầu thế giới giới thiệu **KRONOS-01** — chiếc console phần cứng xúc giác đầu tiên chuyên dụng để điều khiển và đo đạc `AI Swarm Telemetry (Đo từ xa bầy tác tử AI)`.
* Trực quan hóa trải nghiệm sản phẩm ở đẳng cấp Awwwards Site of the Day:
  1. Thuyết phục khách hàng mục tiêu về sự cần thiết của điều khiển vật lý đối với kỷ nguyên `Autonomous AI (AI tự trị)`.
  2. Mang lại trải nghiệm tương tác trực tiếp (`Interactive Sandbox`) ngay trên trình duyệt, cho phép người dùng click, vặn núm xoay vô cấp (`Rotary Knobs`) và gạt công tắc cơ học (`Mechanical Toggles`) để mô phỏng điều phối bầy tác tử theo thời gian thực.
  3. Đạt chuẩn hiệu năng mượt mà `60 FPS (Khung hình trên giây)` thông qua động cơ chuyển động `GSAP (GreenSock Animation Platform)`.
  4. Tuân thủ nghiêm ngặt tiêu chuẩn tiếp cận `WCAG AA (Tiêu chuẩn Khả năng Tiếp cận Nội dung Web cấp độ AA)` với độ tương phản $\ge 4.5:1$.

---

## 3. CONSUMERS & STAKEHOLDERS (ĐỐI TƯỢNG NGƯỜI DÙNG & BÊN LIÊN QUAN)
1. **AI Infrastructure Architects & Engineers (Kiến trúc sư & Kỹ sư hạ tầng AI):** Những người xây dựng và duy trì hệ thống multi-agent quy mô lớn, cần công cụ giám sát trực quan, độ trễ cực thấp (`Sub-millisecond Latency`).
2. **Founders & Tech Leaders (Nhà sáng lập & Lãnh đạo công nghệ):** Những người tìm kiếm giải pháp điều hành trung tâm chỉ huy (`Mission Control Command Deck`) đẳng cấp để trưng bày tại văn phòng và điều phối hạ tầng cốt lõi.
3. **Hardware & Design Enthusiasts (Người đam mê thiết kế phần cứng cao cấp):** Tệp khách hàng yêu chuộng triết lý thiết kế của Teenage Engineering, Dieter Rams (Braun), và Apple.

---

## 4. CURRENT-STATE EVIDENCE & RESEARCH BASELINE (BẰNG CHỨNG HIỆN TRẠNG & CĂN CỨ THIẾT KẾ)
* **OpenDesign Intelligence:** Kế thừa hệ thống token từ `linear-app` (`#08090a` dark canvas, whisper-thin borders `rgba(255,255,255,0.08)`, font-feature-settings `"cv01", "ss03"`).
* **UI-UX-Pro-Max Intelligence:**
  - Style IDs: `hud-sci-fi-fui` (Heads-up display kỹ thuật cao), `tactile-digital-deformable-ui` (Phản hồi xúc giác vật lý), `bento-box-grid` (Bố cục Bento hiện đại), `dark-mode-oled` (Tối ưu màn hình OLED).
  - Typography Tri-stack: Space Grotesk (Display / Headings) + Inter (Body / UI) + JetBrains Mono (Telemetry / Metrics / Code).
* **Packshot Studio Engine:** Chuẩn studio tối `#1a1a1a` cho các khối visual sản phẩm trung tâm (Hardware Console Hero), loại bỏ hoàn toàn ảnh placeholder rỗng.
* **GSAP Motion Engine:** Áp dụng 5 quy tắc vàng: Ép xung GPU qua `transform aliases` (`x`, `y`, `autoAlpha`), dọn dẹp bộ nhớ với `@gsap/react` / `useGSAP`, điều khiển chuột tốc độ cao bằng `gsap.quickTo()`, và tôn trọng chế độ giảm chuyển động `prefers-reduced-motion`.

---

## 5. SCOPE DEFINITION (PHẠM VI DỰ ÁN)

### 5.1. In-Scope (Thuộc phạm vi triển khai)
* **Section 01: Global Telemetry HUD & Navigation Bar**
  - Thanh điều hướng kính mờ (`Glassmorphism Bar`) gắn cố định (`Sticky HUD`).
  - Hiển thị trạng thái kết nối phần cứng ảo: `KRONOS-01 // CONNECTED`, nhịp tim đo đạc `SWARM: 128 ACTIVE NODES`, thông lượng `THROUGHPUT: 4.8k TOKENS/S`.
  - Các nút điều hướng nhanh đến: Anatomy, Telemetry Bento, Live Sandbox, Specs, và nút CTA chính `Acquire Console (Đặt mua Console)`.
* **Section 02: Cinematic Hero Stage & Scrollytelling Presentation**
  - Bố cục sân khấu tối đẳng cấp `#0a0b0d` kết hợp hiệu ứng ánh sáng cục bộ (`Ambient Radial Glow`).
  - Chữ tiêu đề Kinetic Reveal với `SplitText`: *"PHYSICAL MASTERY OVER AUTONOMOUS SWARMS."*
  - Khung hình Scrollytelling ghim cố định (`Pinned ScrollTrigger Stage`):
    * Stage 1: Góc nhìn phối cảnh 3D console hoàn chỉnh.
    * Stage 2: Phân rã từng lớp phần cứng (`Exploded Assembly View`) — Khung nhôm CNC, bảng mạch neural FPGA, cụm núm xoay Hall-effect.
    * Stage 3: Kích hoạt luồng sáng tín hiệu telemetry kết nối console với đám mây tác tử.
  - Con trỏ kính ngắm HUD tương tác (`Interactive Crosshair Reticle`) điều khiển bằng `gsap.quickTo()`.
* **Section 03: Tactile Hardware Anatomy (Chi tiết Phần cứng Xúc giác)**
  - Trình bày 4 phân vùng điều khiển vật lý độc quyền:
    1. **Rotary Encoders Alpha (Cụm núm xoay vô cấp):** Điều chỉnh `Temperature (Độ ngẫu nhiên)`, `Concurrency (Độ đồng thời)`, `Context Window (Ngân sách ngữ cảnh)`.
    2. **Cherry MX Mechanical Switches Beta (Hàng công tắc cơ học):** Đảo mạch `Topology (Cấu trúc liên kết)` giữa Leader-Worker, Peer Consensus, và Sequential Chain.
    3. **Micro-OLED Display Strip Gamma (Dải màn hình vi OLED):** Hiển thị trạng thái từng worker subagent theo thời gian thực.
    4. **Safety Interlock E-Stop Delta (Cần gạt ngắt khẩn cấp):** Phím cơ học có nắp che bảo vệ giúp kill toàn bộ tác tử ngay tức khắc (`Hard Swarm Interruption`).
* **Section 04: Swarm Telemetry Deck (Bento Grid 4 Khối)**
  - Lưới Bento bất đối xứng (`Asymmetric Bento Grid`):
    * **Tile 1 (2x2):** Multi-Agent Swarm Topology Graph (Đồ thị trực quan hóa luồng giao tiếp giữa các tác tử).
    * **Tile 2 (1x1):** Live Token Velocity & Latency Metrics (Đồng hồ đo vận tốc token và độ trễ).
    * **Tile 3 (1x1):** Self-Healing & Error Recovery Rate (Chỉ số tự phục hồi lỗi đạt 99.8%).
    * **Tile 4 (2x1):** Hardware Co-Processor Specifications (Thông số chip xử lý cục bộ KRONOS Neural Engine).
* **Section 05: Live Virtual Sandbox (Mô phỏng Bàn điều khiển Tương tác)**
  - Cho phép người dùng vặn các núm xoay ảo (kéo thả chuột / drag rotation) và gạt các công tắc để thấy thông số đo đạc AI trên màn hình thay đổi tức thời.
  - Phản hồi âm thanh click vi mô (`Tactile Audio Simulation / Synthesized Web Audio API clicks` - có tùy chọn mute).
* **Section 06: Architecture Comparison Matrix (Bảng So sánh Ưu thế)**
  - So sánh KRONOS-01 Hardware Console với Legacy Cloud Dashboards & Pure Software UIs.
  - Thang điểm: Quyết định khẩn cấp (0.02s vs 4.8s), Mất tập trung đa tab (0 tab vs 24 tabs), Trực giác xúc giác (Vật lý vs Click chuột ảo).
* **Section 07: Technical Specifications & Pre-Order Checkout Drawer**
  - Chi tiết kỹ thuật vật liệu: Nhôm nguyên khối Anodized 6061 Aluminum, phím cơ học Hotswap, kết nối USB-C Braided + WiFi 6E + BLE 5.3, tương thích SDK Python / Node.js / Rust / Go.
  - Form đặt hàng sớm (`Priority Reservation Drawer`) kèm lựa chọn phiên bản: Standard Blackout vs Industrial Amber Edition.
* **Section 08: Industrial Micro-Terminal Footer**
  - Dòng trạng thái nhịp tim máy chủ `PING: 12ms`, liên kết tài liệu API SDK, GitHub, Discord cộng đồng, và bản quyền thương hiệu.

### 5.2. Out-of-Scope (Ngoại vi phạm vi)
* Tích hợp cổng thanh toán thực tế (Stripe Payment Gateway live transactions) — MVP chỉ xử lý mô phỏng xác nhận đặt trước (`Simulated Reservation Confirmation`).
* Sản xuất phần cứng vật lý thực tế hoặc firmware flashing qua WebUSB — MVP tập trung vào giao diện số và mô phỏng giao thức.
* Backend streaming dữ liệu thực từ cụm Kubernetes thật — Sử dụng `Telemetry Simulation Engine (Động cơ sinh dữ liệu đo đạc giả lập chân thực)`.

---

## 6. DATA MODELS & STATE CONTRACTS (MÔ HÌNH DỮ LIỆU & GIAO ƯỚC TRẠNG THÁI)

### 6.1. Swarm Telemetry State Model (Mô hình trạng thái đo đạc bầy tác tử)
```typescript
interface SwarmTelemetryState {
  systemStatus: 'ONLINE' | 'STANDBY' | 'E_STOPPED' | 'RECONFIGURING';
  totalActiveNodes: number;
  tokensPerSecond: number;
  averageLatencyMs: number;
  activeTopology: 'LEADER_WORKER' | 'SWARM_CONSENSUS' | 'SEQUENTIAL_PIPELINE' | 'AUTONOMOUS_MESH';
  hardwareControls: {
    knobTemperature: number;     // Range: 0.00 to 2.00 (Default: 0.70)
    knobConcurrency: number;     // Range: 1 to 64 (Default: 16)
    knobContextBudget: number;   // Range: 4k to 2M tokens (Default: 128k)
    toggleEStopGuarded: boolean; // True = Armed, False = Engaged (Kill Swarm)
    toggleVerboseLog: boolean;   // True = Debug HUD enabled
  };
  agentNodes: Array<{
    id: string;                  // e.g., "AGENT-ALPHA-01"
    role: string;                // e.g., "Lead Orchestrator", "Code Auditor", "Vulnerability Scanner"
    status: 'IDLE' | 'PROCESSING' | 'STREAMING' | 'ERROR';
    tokensProcessed: number;
    latencyMs: number;
  }>;
}
```

### 6.2. Interactive Console Event Bus (Kênh truyền sự kiện bàn điều khiển)
```typescript
type ConsoleAction =
  | { type: 'ROTATE_KNOB'; target: 'temperature' | 'concurrency' | 'budget'; delta: number }
  | { type: 'FLIP_SWITCH'; target: 'topology' | 'failover' | 'debug'; value: boolean }
  | { type: 'TRIGGER_E_STOP' }
  | { type: 'RESET_SYSTEM' };
```

---

## 7. MASTER VISUAL DESIGN ARCHITECTURE ($design ENGINE)

### 7.1. OpenDesign & UI-UX-Pro-Max Design Tokens (Hệ thống thẻ thiết kế)
Được định nghĩa trực tiếp vào CSS Variables tại `:root`:
```css
:root {
  /* Surface & Background Hierarchy (Linear & OLED Native) */
  --bg-deep: #050506;              /* Marketing Black Canvas */
  --bg-stage: #0a0b0d;             /* Elevated Hero Stage */
  --bg-panel: #101114;             /* Surface Container */
  --bg-card: rgba(255, 255, 255, 0.025); /* Translucent Frosted Glass */
  --bg-card-hover: rgba(255, 255, 255, 0.05);

  /* Linear Whisper Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-standard: rgba(255, 255, 255, 0.09);
  --border-highlight: rgba(255, 255, 255, 0.18);

  /* Accent Color System (Teenage Engineering & Swarm Telemetry) */
  --accent-amber: #FF6B00;         /* Teenage Engineering signature orange */
  --accent-amber-glow: rgba(255, 107, 0, 0.35);
  --accent-cyan: #00F0FF;          /* High-tech HUD cyan */
  --accent-cyan-glow: rgba(0, 240, 255, 0.3);
  --status-emerald: #10B981;       /* Operational active */
  --status-emerald-glow: rgba(16, 185, 129, 0.25);
  --status-danger: #EF4444;        /* E-Stop alert */

  /* Text Luminance Scale (Linear Standard cv01/ss03) */
  --text-primary: #F7F8F8;         /* Near-white, anti-fatigue */
  --text-secondary: #D0D6E0;       /* Cool silver-gray */
  --text-muted: #8A8F98;           /* Muted telemetry labels */
  --text-faint: #555A64;           /* Metadata & grid coordinates */

  /* Typography Tri-Stack */
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Elevation & Shadows */
  --shadow-inset-panel: inset 0 0 16px rgba(0, 0, 0, 0.6);
  --shadow-glow-amber: 0 0 24px rgba(255, 107, 0, 0.2);
  --shadow-glow-cyan: 0 0 24px rgba(0, 240, 255, 0.18);
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

### 7.2. Typography Hierarchy & Rules (Quy tắc bậc thang nghệ thuật chữ)
| Bậc chữ (Role) | Kiểu chữ (Font) | Kích cỡ (Size) | Độ đậm (Weight) | Giãn dòng (Line Height) | Giãn ký tự (Tracking) | Chú giải sử dụng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display XL** | Space Grotesk | 72px (4.5rem) | 700 (Bold) | 1.05 | -1.8px | Hero Headline chính |
| **Display L** | Space Grotesk | 48px (3.0rem) | 600 (Semibold) | 1.15 | -1.2px | Tiêu đề từng Section |
| **Heading 1** | Space Grotesk | 32px (2.0rem) | 600 (Semibold) | 1.25 | -0.6px | Tiêu đề khối Bento & Anatomy |
| **Heading 2** | Inter | 20px (1.25rem) | 590 (Semi) | 1.40 | -0.2px | Tiêu đề tính năng thẻ |
| **Body Large** | Inter | 18px (1.125rem) | 400 (Regular) | 1.60 | normal | Đoạn văn giới thiệu |
| **Body Regular** | Inter | 15px (0.9375rem) | 400 (Regular) | 1.55 | normal | Văn bản mô tả chung |
| **UI Medium** | Inter | 14px (0.875rem) | 510 (Medium) | 1.40 | normal | Nhãn nút, liên kết điều hướng |
| **Mono Data** | JetBrains Mono | 13px (0.8125rem) | 500 (Medium) | 1.50 | normal | Thông số đo đạc, log tác tử |
| **Micro Tech** | JetBrains Mono | 11px (0.6875rem) | 500 (Medium) | 1.30 | +1.5px | Tọa độ HUD, nhãn chip in hoa |

### 7.3. Packshot Studio Hero Guidelines (Chuẩn studio chụp ảnh sản phẩm)
* Nền sân khấu: `#0a0b0d` đến `#1a1a1a` gradient tỏa tròn (`radial-gradient(ellipse at 50% 30%, #1a1c23 0%, #050506 75%)`).
* Đường viền sáng viền cạnh (`Rim Lighting / Edge Highlight`): Phản xạ dải sáng siêu mỏng `1px` trên bề mặt nhôm anot hóa của console, mang lại cảm nhận chiều sâu 3D đẳng cấp.
* Đổ bóng chân đế mềm tự nhiên (`Ambient Occlusion Ground Shadow`): `rgba(0, 0, 0, 0.75)` loang 60px bên dưới khung máy.

---

## 8. GSAP 60 FPS MOTION SPECIFICATIONS (ĐẶC TẢ CHUYỂN ĐỘNG GSAP)

### 8.1. Plugin Initialization & GPU Optimization (Khởi tạo & Tối ưu GPU)
* Đăng ký plugin tại root: `gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVG)`.
* Ép GPU compositing: Toàn bộ chuyển động vị trí sử dụng `x`, `y`, `xPercent`, `yPercent`, `scale`, và `autoAlpha` (tuyệt đối cấm `left`, `top`, `margin`, `width`).

### 8.2. Scrollytelling Pinned Sequence (Chuỗi kể chuyện ghim cuộn)
```javascript
const heroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero-stage",
    start: "top top",
    end: "+=250%",
    pin: true,
    scrub: 1.2,
    anticipatePin: 1
  }
});

// Stage 1 -> 2: Exploded Assembly
heroTimeline
  .to(".console-top-plate", { yPercent: -40, rotateX: 12, ease: "power2.inOut" }, 0)
  .to(".console-circuit-board", { yPercent: -10, autoAlpha: 1, ease: "power2.inOut" }, 0.2)
  .to(".console-chassis-base", { yPercent: 20, ease: "power2.inOut" }, 0)
  .fromTo(".telemetry-beam", { scaleY: 0, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, stagger: 0.1 }, 0.5)
  .to(".assembly-caption-1", { autoAlpha: 0, y: -20 }, 0.4)
  .fromTo(".assembly-caption-2", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0 }, 0.6);
```

### 8.3. SplitText Kinetic Typography Reveal
```javascript
const headlineSplit = new SplitText(".hero-headline", { type: "chars,words" });
gsap.from(headlineSplit.chars, {
  autoAlpha: 0,
  y: 35,
  rotateX: -45,
  stagger: 0.015,
  duration: 0.9,
  ease: "back.out(1.6)",
  delay: 0.2
});
```

### 8.4. High-Frequency Cursor HUD Reticle (`gsap.quickTo`)
```javascript
const crosshairX = gsap.quickTo(".hud-reticle", "x", { duration: 0.15, ease: "power3" });
const crosshairY = gsap.quickTo(".hud-reticle", "y", { duration: 0.15, ease: "power3" });

window.addEventListener("pointermove", (e) => {
  crosshairX(e.clientX);
  crosshairY(e.clientY);
});
```

### 8.5. WCAG AA Reduced Motion Accessibility Guard
```javascript
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  // Bỏ toàn bộ hiệu ứng di chuyển tọa độ, chỉ giữ fade chuyển trạng thái tức thì
  gsap.set(".console-top-plate, .console-circuit-board, .console-chassis-base", { clearProps: "all" });
  gsap.to(".assembly-caption-2", { autoAlpha: 1, duration: 0.1 });
});
```

---

## 9. STEP 2 WORK PACKAGES PARTITION (PHÂN RÃ GÓI CÔNG VIỆC CHO BƯỚC 2)
Để đảm bảo triển khai theo mô hình `HYBRID / PARALLEL` với ranh giới quyền sở hữu (`Ownership Boundaries`) rõ ràng:

1. **WP-01: Core Architecture, Layout Shell & Tokens (Integrator Owner)**
   - Khởi tạo khung dự án (Vite + React / Tailwind CSS hoặc Native HTML5 / Modern CSS Modules).
   - Thiết lập CSS Variables, Reset, Typography scale, và Root Layout Container.
   - Bàn giao: `index.html`, `src/styles/tokens.css`, `src/components/layout/Shell.tsx`.

2. **WP-02: Hero Stage & Scrollytelling GSAP Engine (Visual / Motion Worker)**
   - Triển khai `HeroStage.tsx`, tích hợp ScrollTrigger pin, SplitText reveal, và Packshot console visual.
   - Bàn giao: `src/components/hero/HeroStage.tsx`, `src/hooks/useHeroAnimation.ts`.

3. **WP-03: Tactile Anatomy & Interactive Console Sandbox (Hardware UI Worker)**
   - Xây dựng 4 phân vùng phần cứng: Rotary Knobs, Toggle Switches, Micro-OLED indicators, E-Stop switch.
   - Bàn giao: `src/components/console/TactileDeck.tsx`, `src/components/console/RotaryKnob.tsx`.

4. **WP-04: Swarm Telemetry Bento Grid & Spec Drawer (Telemetry / Data Worker)**
   - Xây dựng lưới Bento 4 card: Graph topology, Metrics speedometer, Co-processor specs sheet, Drawer preorder.
   - Bàn giao: `src/components/telemetry/BentoGrid.tsx`, `src/components/specs/PreorderDrawer.tsx`.

---

## 10. ACCEPTANCE CRITERIA & EVIDENCE CHECKLIST (TIÊU CHUẨN NGHIỆM THU & BẰNG CHỨNG KIỂM CHỨNG)
* [ ] **AC-01 (Visual Fidelity & Theme):** Giao diện đạt chuẩn tối cao cấp (`#050506`), tương phản WCAG AA $\ge 4.5:1$, đúng tri-stack font (Space Grotesk + Inter + JetBrains Mono).
* [ ] **AC-02 (Zero-Placeholder Asset Standard):** Toàn bộ hình ảnh console và linh kiện phần cứng hiển thị chuẩn studio `#1a1a1a`, không tồn tại bất kỳ placeholder xám nào.
* [ ] **AC-03 (Scrollytelling 60 FPS):** Cuộn trang trên Hero kích hoạt ghim màn hình (`Pinned ScrollTrigger`) chuyển động phân rã linh kiện mượt mà, không giật lag (`Jank-free`).
* [ ] **AC-04 (Tactile Interaction):** Người dùng có thể kéo xoay núm vặn vô cấp, gạt công tắc cơ học, và thấy các chỉ số telemetry phản hồi tức thì.
* [ ] **AC-05 (Accessibility & Responsive):** Hoạt động hoàn hảo trên mọi kích thước màn hình từ Desktop (1440px), Laptop (1024px), đến Mobile (375px). Hỗ trợ đầy đủ `prefers-reduced-motion`.

---

## 11. DEFINITION GATE VERDICT (KẾT LUẬN CỔNG ĐẶC TẢ)
> ### **VERDICT: `READY_FOR_DELIVERY`**
> Toàn bộ phạm vi (`In-Scope`), ranh giới ngoài (`Out-of-Scope`), mô hình trạng thái (`Data Models`), hệ thống thẻ thiết kế (`Design Tokens`), đặc tả chuyển động (`GSAP 60 FPS Specifications`) và tiêu chuẩn nghiệm thu (`Acceptance Criteria`) đã được đặc tả hoàn chỉnh, tường minh và sẵn sàng để kích hoạt **Step 2 ($dev / Project Delivery)** mà không cần tự suy diễn thêm bất kỳ yêu cầu nào.
