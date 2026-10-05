---
name: magic-ui-vault
description: "Đại Kho Vũ Khí Kỹ Nghệ Giao Diện Magic UI 80+ Components & Visual Effects cho Antigravity 2.0. Đóng gói đầy đủ 6 phân khu: AI & Copilot Interfaces, Bento Cards, Atmospheric Backgrounds, Typography & Text FX, Data/Code/3D Visuals, Navigation & Mockups. Chuẩn hóa 100% Luminous Light Theme Invariant kết hợp WebAudioHaptics và vi tương tác co lún scale(0.965)."
---

# 🪄 Magic UI Vault: Đại Kho Vũ Khí Kỹ Nghệ Giao Diện 80+ Components & Visual Effects

> **Tôn chỉ Kỹ nghệ (Engineering Creed)**:  
> Giao diện phần mềm không đơn thuần là nơi chứa dữ liệu, mà là sân khấu biểu diễn của cảm xúc và công nghệ.  
> Biến những cấu trúc kỹ thuật thô mộc thành trải nghiệm ma thuật sống động (*Magical UI Engineering*).  
> Kế thừa toàn diện tinh hoa từ **Magic UI** (MIT License), nâng cấp toàn diện lên chuẩn mực **Antigravity 2.0**:  
> 100% tuân thủ **Luminous Light Theme Invariant (Quy chuẩn Giao diện Sáng Đa Tầng)**, tích hợp **WebAudioHaptics (Phản hồi Xúc giác Âm thanh)** và **Vi tương tác co lún `scale(0.965)`**.

---

## 🏛️ 1. TÔN CHỈ & ĐỊNH HƯỚNG NÂNG CẤP ANTIGRAVITY 2.0

### 1.1 Khắc Phục Điểm Yếu Của Thư Viện Nguyên Bản (Addressing Upstream Limitations)
Bản gốc Magic UI được thiết kế phần lớn ưu tiên phong cách nền đen huyền bí (*Dark Mode by default*). Khi đưa vào môi trường doanh nghiệp cao cấp và chuẩn thiết kế của Antigravity:
1. **Triệt tiêu Nền Đen Đơn Điệu (*Anti-Dark Mode Bias*)**: Tái cấu trúc 100% linh kiện sang nền sáng quang học đa tầng (*Multi-Layered Luminous Surfaces*), loại bỏ hiện tượng đen xì bẹt dính (*Muddy Black Void*).
2. **Khóa Cứng Zero-Jank 60 FPS (*Zero-Jank Invariant*)**: Sử dụng độc quyền `transform`, `opacity` và GPU Compositor Layers (`will-change: transform`). Tuyệt đối không animate các thuộc tính gây Layout Thrashing như `width`, `height`, `top`, `margin`.
3. **Phản Hồi Xúc Giác Tự Nhiên (*Haptic Resonance*)**: Mỗi thao tác nhấp chuột (*Click*) hoặc tương tác mở rộng đều được nạp vi tương tác co lún vật lý `transform: scale(0.965)` kết hợp bộ gõ sóng âm tần số cao 12ms (*WebAudioHaptics*).

---

## 🗺️ 2. BẢN ĐỒ TOÀN DIỆN 80+ COMPONENTS (6 ĐẠI PHÂN KHU)

```
MAGIC UI VAULT (80+ COMPONENTS)
├── 1. AI & Copilot Interfaces (15 Components)
│   ├── Animated Beam               ├── Border Beam                 ├── Shine Border
│   ├── Shimmer Button              ├── Shiny Button                ├── Interactive Hover Button
│   ├── Ripple Button               ├── Pulsing / Ripple            ├── Cool Mode
│   ├── Confetti                    ├── Scratch To Reveal           ├── Animated List
│   ├── Orbiting Circles            ├── Sparkles Text               └── Terminal Streamer
│
├── 2. Cards & Bento Layouts (14 Components)
│   ├── Bento Grid & Card           ├── Magic Card (Spotlight)      ├── Neon Gradient Card
│   ├── Warp Background             ├── Lens Magnifier              ├── Pointer (Live Cursors)
│   ├── Smooth Cursor (Spring)      ├── Progressive Blur            ├── Hero Video Dialog
│   ├── Tilt Card (3D Parallax)     ├── Direction Aware Hover       ├── Noise Card (Tactile)
│   ├── Card Spotlight              └── 3D Pin Card
│
├── 3. Atmospheric Backgrounds (13 Components)
│   ├── Retro Grid 3D               ├── Interactive Grid Pattern    ├── Dot Pattern
│   ├── Grid Pattern                ├── Striped Pattern             ├── Flickering Grid
│   ├── Meteors Shower              ├── Light Rays (Sunbeams)       ├── Ripple Background
│   ├── Aurora Background           ├── Particles Canvas (Network)  ├── Waves Canvas
│   └── Background Beams
│
├── 4. Typography & Text FX (16 Components)
│   ├── Aurora Text                 ├── Line Shadow Text            ├── Morphing Text
│   ├── Number Ticker               ├── Animated Shiny Text         ├── Blur In Text
│   ├── Text Reveal (Scroll)        ├── Flip Text 3D                ├── Hyper Text (Hacker Decode)
│   ├── Word Rotate                 ├── Velocity Scroll (Marquee)   ├── Word Pull Up
│   ├── Letter Pull Up              ├── Typing Animation            ├── Gradual Spacing
│   └── Box Reveal
│
├── 5. Data, Code & 3D Visuals (12 Components)
│   ├── Code Comparison Slider      ├── File Tree Navigator         ├── Globe 3D (WebGL)
│   ├── Icon Cloud 3D (Sphere)      ├── Animated Circular Progress  ├── Avatar Circles
│   ├── Interactive Calendar        ├── Radial Progress             ├── Sparkles Overlay
│   ├── Gauge Metric                ├── Matrix Stream               └── Chart Spotlight
│
└── 6. Navigation & Mockups (10 Components)
    ├── Dock (macOS Magnification)  ├── Scroll Progress Bar         ├── Marquee Horizontal
    ├── Marquee Vertical            ├── Safari Browser Mockup       ├── iPhone Apple Mockup
    ├── Android Device Mockup       ├── Animated Sliding Tabs       ├── Breadcrumb Dynamic
    └── Floating Action Pill
```

---

## ☀️ 3. QUY CHUẨN LUMINOUS LIGHT THEME INVARIANT

Mọi linh kiện trong Magic UI Vault khi đưa vào ứng dụng bắt buộc phải tuân theo bảng ánh xạ màu sắc quang học sáng sau đây:

### 3.1 Bảng Quy Đổi Token Màu Sắc (Color Token Mapping Matrix)

| Thành phần giao diện | Magic UI Gốc (Dark Mode) | Luminous Light Theme (Antigravity 2.0) | Mục đích thị giác (Visual Purpose) |
|---|---|---|---|
| **Canvas Background** | `#000000` / `#09090b` | `#FAF9F6` (Warm Paper) / `#FDFBF7` (Ivory) | Tạo nền ấm áp, triệt tiêu chói lóa mắt |
| **Card Surface** | `#18181b` / `#121212` | `#FFFFFF` (Pure White) hoặc `rgba(255,255,255,0.85)` | Thẻ nổi khối, tôn vinh nội dung |
| **Border / Stroke** | `rgba(255,255,255,0.1)` | `rgba(0, 0, 0, 0.08)` hoặc `rgba(226, 232, 240, 0.8)` | Viền quang học siêu mảnh, thanh thoát |
| **Spotlight / Glow** | `rgba(255, 255, 255, 0.15)` | `rgba(59, 130, 246, 0.12)` hoặc `rgba(245, 158, 11, 0.1)` | Vệt sáng màu ngọc / hổ phách ấm |
| **Beam Gradient** | `#ffaa40` $\to$ `#9c40ff` | `#3B82F6` (Cobalt) $\to$ `#8B5CF6` (Violet) | Luồng tín hiệu năng lượng tươi mới |
| **Inset Highlight** | Không có | `inset 0 1px 0 rgba(255, 255, 255, 0.9)` | Mép kính phản quang tạo độ sắc sảo |
| **Text Primary** | `#FFFFFF` | `#0F172A` (Slate 900) | Tương phản cực đại WCAG AAA |
| **Text Muted** | `#A1A1AA` | `#64748B` (Slate 500) | Thông tin thứ cấp rõ ràng, dịu mắt |

### 3.2 Hệ Thống Bóng Đổ Xếp Lớp Đa Tầng (Layered Ambient + Key Shadows)
Tuyệt đối cấm sử dụng bóng đổ đen bệt đơn lớp `box-shadow: 0 4px 6px rgba(0,0,0,0.3)`. Thay vào đó, áp dụng công thức 2 tầng quang học:
```css
/* Trạng thái nghỉ (Resting Card) */
box-shadow: 
  0 1px 2px 0 rgba(0, 0, 0, 0.04),
  0 4px 12px -2px rgba(0, 0, 0, 0.05);

/* Trạng thái di chuột (Hover Elevated) */
box-shadow: 
  0 4px 6px -1px rgba(0, 0, 0, 0.03),
  0 12px 24px -4px rgba(0, 0, 0, 0.07),
  0 0 0 1px rgba(59, 130, 246, 0.15); /* Viền sáng phản hồi */
```

---

## 📳 4. TÍCH HỢP PHẢN HỒI XÚC GIÁC & VI TƯƠNG TÁC VẬT LÝ

### 4.1 Động Cơ Âm Thanh Xúc Giác WebAudioHaptics (12ms Zero-Latency Engine)
Không cần tải tệp âm thanh `.mp3` bên ngoài gây trễ mạng (*Network Latency*). Tự động sinh xung sóng âm hình sin (*Sine Wave Pulse*) 12ms siêu gọn bằng Web Audio API thuần:

```typescript
// WebAudioHaptics.ts — Động cơ phản hồi xúc giác âm thanh siêu tốc
class WebAudioHaptics {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  // Tiếng nhấp cơ học cực nhẹ 12ms (Tactile Click)
  public triggerClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(820, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.012);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.012);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.012);
    } catch {
      // Bỏ qua nếu trình duyệt chặn audio policy
    }
  }

  // Âm thanh vút sáng năng lượng 35ms (Beam / Magic Shine Pulse)
  public triggerShine() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {
      // Silent catch
    }
  }
}

export const haptics = new WebAudioHaptics();
```

### 4.2 Vi Tương Tác Bấm Co Lún (Spring Compression Feedback)
Mọi nút bấm, thẻ tương tác (*Interactive Cards*) đều phải có thuộc tính co lún lò xo khi `:active`:

```css
/* Vi tương tác co lún chuẩn mực Emil Kowalski */
.magic-pressable {
  transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 160ms ease-out;
  will-change: transform;
}

.magic-pressable:active {
  transform: scale(0.965);
}
```

---

## ⚡ 5. BỘ MÃ MẪU THỰC CHIẾN (CLEAN CODE RECIPES)

Cung cấp đầy đủ mã nguồn chuẩn mực, độc lập (*Self-Contained*), có thể sao chép và triển khai trực tiếp cho các linh kiện AI đỉnh cao nhất.

---

### RECIPE 1: ANIMATED BEAM (Chùm Tia Kết Nối Đa Nút AI)
Linh kiện kinh điển biểu diễn luồng dữ liệu giữa các Model AI (Gemini, Claude, GPT) và Cơ sở dữ liệu Vector.

#### A. Phiên bản React + Tailwind + SVG Path Calculation
```tsx
import React, { useEffect, useId, useState } from "react";

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "rgba(148, 163, 184, 0.25)", // Slate 400 mờ
  pathWidth = 2,
  pathOpacity = 0.6,
  gradientStartColor = "#3B82F6", // Blue 500
  gradientStopColor = "#8B5CF6", // Purple 500
  delay = 0,
  duration = 2.4,
}) => {
  const id = useId();
  const [d, setD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      setSvgDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });

      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;

      const controlY = startY - curvature;
      const pathD = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
      setD(pathD);
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    return () => window.removeEventListener("resize", updatePath);
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute left-0 top-0 transform-gpu stroke-2"
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      {/* Đường dẫn tĩnh nền sáng */}
      <path
        d={d}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {/* Tia sáng chuyển động */}
      <path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth * 1.5}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} stopOpacity="1" />
          <stop offset="32.5%" stopColor={gradientStopColor} stopOpacity="1" />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
          <animate
            attributeName="x1"
            from={reverse ? "100%" : "-100%"}
            to={reverse ? "-100%" : "100%"}
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from={reverse ? "200%" : "0%"}
            to={reverse ? "0%" : "200%"}
            dur={`${duration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
```

---

### RECIPE 2: BORDER BEAM (Chùm Sáng Chạy Quanh Viền Thẻ)
Tia sáng vút nhanh quanh mép viền bo tròn, tạo điểm nhấn cao cấp cho các thẻ giá gói Pro, thẻ Agent đang xử lý.

#### A. Phiên bản CSS Thuần / Tailwind (Không cần thư viện ngoài)
```html
<!-- Cấu trúc thẻ Luminous với Border Beam -->
<div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
  <!-- Tia sáng Border Beam chạy vòng quanh -->
  <div 
    class="pointer-events-none absolute -inset-[100%] animate-[spin_4s_linear_infinite]"
    style="background: conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, #3b82f6 340deg, #8b5cf6 360deg);"
  ></div>

  <!-- Lớp phủ ruột thẻ tạo hiệu ứng viền mỏng 1.5px -->
  <div class="absolute inset-[1.5px] rounded-[14.5px] bg-white"></div>

  <!-- Nội dung thực tế của thẻ -->
  <div class="relative z-10 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        <span class="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        AI Inference Active
      </span>
      <span class="text-xs text-slate-400">12ms latency</span>
    </div>
    <h3 class="text-base font-semibold text-slate-900">Gemini 3.8 Super-Engine</h3>
    <p class="text-sm text-slate-600 leading-relaxed">
      Tự động hóa luồng suy luận kịch trần với ngân sách token mở rộng 131,072 tokens.
    </p>
  </div>
</div>
```

#### B. Phiên bản React Component Linh Hoạt
```tsx
import React from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = "",
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#3b82f6",
  colorTo = "#a855f7",
  delay = 0,
}) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-[border-beam_calc(var(--duration)*1s)_infinite_linear] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))] ${className}`}
    />
  );
};
```

---

### RECIPE 3: SHIMMER BUTTON (Nút Bấm Vầng Sáng Lấp Lánh Phản Quang)
Nút bấm hành động chính (*Call-to-Action*) cao cấp với dải quang phổ lướt qua bề mặt nút, kết hợp âm thanh click xúc giác.

```tsx
import React from "react";
import { haptics } from "./WebAudioHaptics";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  children: React.ReactNode;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  shimmerColor = "rgba(59, 130, 246, 0.35)", // Ánh xanh Cobalt
  shimmerSize = "0.08em",
  shimmerDuration = "2.8s",
  children,
  className = "",
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    haptics.triggerClick();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 active:scale-[0.965] hover:border-blue-400 hover:shadow-[0_4px_16px_rgba(59,130,246,0.12)] ${className}`}
      {...props}
    >
      {/* Vầng sáng quét ngang (Shimmer Sweep) */}
      <div
        className="absolute -inset-full animate-[shimmer-slide_3s_ease-in-out_infinite] opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(110deg, transparent 35%, ${shimmerColor} 50%, transparent 65%)`,
        }}
      />

      {/* Đường viền mép trên bắt sáng (Inset Highlight) */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Nội dung nút */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};
```

---

### RECIPE 4: ORBITING CIRCLES (Vệ Tinh Xoay Quanh Hạt Nhân AI)
Hiển thị mô hình trung tâm (như Core Agent Antigravity) và các tác tử vệ tinh xoay quanh theo quỹ đạo tròn đồng tâm.

```tsx
import React from "react";

interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

export const OrbitingCircles: React.FC<OrbitingCirclesProps> = ({
  className = "",
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 120,
  path = true,
}) => {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-slate-200/70"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
        </svg>
      )}

      <div
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": `-${delay}s`,
          } as React.CSSProperties
        }
        className={`absolute flex size-10 transform-gpu animate-[orbit_calc(var(--duration)*1s)_linear_infinite] items-center justify-center rounded-full border border-slate-200/80 bg-white p-2 shadow-sm ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};
```

#### CSS Keyframes Bổ Trợ cho Orbiting Circles:
```css
@keyframes orbit {
  0% {
    transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg);
  }
}
```

---

### RECIPE 5: BENTO GRID (Lưới Thẻ Bento Luminous Đa Tỷ Lệ)
Cấu trúc bố cục hiện đại theo phong cách Apple và Linear, tổ chức dữ liệu trực quan với hiệu ứng Spotlight rọi sáng theo con trỏ chuột.

```tsx
import React, { useRef, useState } from "react";

interface BentoCardProps {
  title: string;
  description: string;
  headerGraphic: React.ReactNode;
  badge?: string;
  colSpan?: string; // Ví dụ: "col-span-1", "col-span-2", "md:col-span-2"
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  headerGraphic,
  badge,
  colSpan = "col-span-1",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] active:scale-[0.99] ${colSpan}`}
    >
      {/* Spotlight rọi theo con trỏ chuột */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 70%)`,
        }}
      />

      {/* Inset highlight phản quang mép kính */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      {/* Khu vực đồ họa minh họa (Graphic Canvas) */}
      <div className="relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50/80 border border-slate-100">
        {headerGraphic}
      </div>

      {/* Tiêu đề & Nội dung */}
      <div className="relative z-10 flex flex-col gap-1.5">
        {badge && (
          <span className="w-fit rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {badge}
          </span>
        )}
        <h4 className="text-base font-semibold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
```

---

### RECIPE 6: MORPHING TEXT (Biến Đổi Chữ Mượt Mà Bằng SVG Blur Filter)
Kỹ thuật biến hình ký tự liền mạch giữa các danh từ mô tả tính năng mà không giật cục:

```tsx
import React, { useEffect, useRef } from "react";

const texts = [
  "Antigravity 2.0",
  "Magic UI Vault",
  "80+ Components",
  "Luminous Surfaces",
  "60 FPS Motion",
];

const morphTime = 1.4;
const cooldownTime = 0.6;

export const MorphingText: React.FC = () => {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let animationFrameId: number;

    const el1 = text1Ref.current;
    const el2 = text2Ref.current;
    if (!el1 || !el2) return;

    el1.textContent = texts[textIndex % texts.length];
    el2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(fraction: number) {
      if (!el1 || !el2) return;
      el2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      el1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    }

    function doCooldown() {
      morph = 0;
      if (!el1 || !el2) return;
      el2.style.filter = "";
      el2.style.opacity = "100%";
      el1.style.filter = "";
      el1.style.opacity = "0%";
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
          if (el1 && el2) {
            el1.textContent = texts[textIndex % texts.length];
            el2.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        morph += dt;
        let fraction = morph / morphTime;
        if (fraction > 1) {
          cooldown = cooldownTime;
          fraction = 1;
        }
        setMorph(fraction);
      } else {
        doCooldown();
      }
    }

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative flex h-16 w-full items-center justify-center font-bold text-3xl tracking-tight text-slate-900">
      <span ref={text1Ref} className="absolute inline-block select-none" />
      <span ref={text2Ref} className="absolute inline-block select-none" />

      {/* SVG Filter cho hiệu ứng làm mờ quang học */}
      <svg className="hidden">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
```

---

## 📋 6. DANH MỤC THẨM ĐỊNH MÃ NGUỒN UI (AUDIT CHECKLIST)

Khi tích hợp bất kỳ linh kiện nào từ Magic UI Vault vào dự án của Anh, tự kiểm toán khắt khe theo các tiêu chí:

| Tiêu chuẩn kiểm toán (Audit Criterion) | Chuẩn Đạt (Pass) | Cấm Vi Phạm (Fail / Rejection) |
|---|---|---|
| **Theme Invariant** | Nền ấm `#FAF9F6`, Card trắng `#FFFFFF`, viền mỏng | Nền đen đặc `#000000` (trừ khi Anh yêu cầu tường minh) |
| **Motion Budget** | 60 FPS mượt mà, chỉ animate `transform` và `opacity` | Animate `all`, đổi kích thước `width/height` gây drop frame |
| **Haptic & Sound** | WebAudioHaptics 12ms nhẹ nhàng, `:active` co lún `scale(0.965)` | Nút bấm đơ cứng không phản hồi, không có độ lún |
| **Bóng đổ quang học** | Xếp lớp 2 tầng `rgba(0,0,0,0.04)` + `rgba(0,0,0,0.05)` | Bóng đổ đen sì đặc quánh một lớp `rgba(0,0,0,0.35)` |
| **Độ tương phản** | Đạt chuẩn WCAG AA / AAA, văn bản Slate 900 / 600 | Chữ xám nhờ nhờ trên nền trắng gây mỏi mắt khó đọc |
| **Thuật ngữ giao tiếp** | Song ngữ chuẩn `English (Tiếng Việt)` trong trao đổi | Dùng tiếng lóng hoặc bỏ sót giải nghĩa tiếng Việt |
