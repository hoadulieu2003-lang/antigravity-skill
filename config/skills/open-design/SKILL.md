---
name: open-design
description: "Curated Brand Design Systems & Interactive Templates library (153 brand styles like Linear, Stripe, Apple, Vercel, Supabase; 114 templates including Magazine Decks / guizang-ppt, live dashboards, SaaS landing prototypes). Automatically activate and reference for all web UI design, landing page, dashboard, and interactive prototyping tasks to apply world-class visual aesthetics and tokens. DO NOT use for non-visual backend tasks (DESIGN_NONE)."
---

# OpenDesign — Vibe Design & Brand Studio Engine

Hệ thống thiết kế và mẫu giao diện chuẩn Brand đẳng cấp thế giới, tích hợp trực tiếp vào Antigravity IDE.

## Kho Tài Nguyên Có Sẵn

- **153 Brand Design Systems** (`design-systems/`): Linear, Stripe, Apple, Vercel, Supabase, OpenAI, Perplexity, Airbnb, Raycast, Figma, Framer, Duolingo, BMW, Porsche, v.v. Mỗi hệ thống đều có `DESIGN.md` (đặc tả quy tắc), `tokens.css` (CSS variables chuẩn), và `components.html`.
- **114 Design Templates** (`design-templates/`):
  - **Slide Decks & Presentations**: `guizang-ppt` (Magazine Deck đỉnh cao), `html-ppt-*` (36 phong cách trình chiếu), `pitch-deck`.
  - **Live Dashboards & BI**: `live-dashboard` (kèm tweaks panel), `flowai-live-dashboard-template`, `trading-analysis-dashboard-template`, `github-dashboard`.
  - **Prototypes & Web Apps**: `saas-landing`, `pricing-page`, `waitlist-page`, `gamified-app`, `mobile-app`, `kanban-board`.
  - **Motion Graphics**: `hyperframes` (agent-native code animation sang video).
- **Wow Engine Suite** (`scripts/wow_engine.js`): Module tương tác Vanilla JS thuần siêu nhẹ (0 KB external assets): Đèn rọi Spotlight (`initSpotlight`), Thẻ nghiêng 3D Parallax lò xo (`initParallaxTilt`), Âm thanh xúc giác Web Audio API thuần K18 (`WebAudioHaptics`), và Cuộn quán tính Lenis standalone (`initSmoothScroll`).
- **162 Specialized Skills** (`skills/`): `emilkowalski-motion`, `gsap-scrolltrigger`, `pptx-generator`, `threejs`, `shadcn-ui`, `deck-guizang-editorial`, v.v. (Trong đó 2 siêu kỹ năng tinh hoa đã được thăng hạng First-Class Skills tại `config/skills/`: [`taste-engine`](file:///C:/Users/game/.gemini/config/skills/taste-engine/SKILL.md) và [`design-engineering`](file:///C:/Users/game/.gemini/config/skills/design-engineering/SKILL.md)).

---

## Khi Nào Sử Dụng Skill Này

Tự động kích hoạt & tham khảo cho mọi tác vụ thiết kế web UI, landing page, dashboard, presentation deck, hoặc khi cần áp dụng ngôn ngữ thiết kế thương hiệu đẳng cấp thế giới:
1. **Thiết kế giao diện theo phong cách một thương hiệu lớn** (vd: "làm theo phong cách Linear / Stripe / Apple / Vercel").
2. **Làm bộ slide thuyết trình dạng tạp chí (Magazine Deck / Pitch Deck)** (vd: `guizang-ppt` hoặc `html-ppt`).
3. **Xây dựng Dashboard trực quan hoặc Web Prototype chất lượng cao**.
4. **Tạo hiệu ứng chuyển động mượt mà (Motion / GSAP / Wow Engine)**.

> ☀️ **Kỷ Luật Luminous Light Theme Invariant Bắt Buộc Khi Nạp Brands**:  
> Mọi hệ thống thiết kế thương hiệu (kể cả các thương hiệu có bản sắc nhận diện tối như Linear, Raycast) **BẮT BUỘC** phải được chuyển đổi và nạp theo chuẩn **Giao Diện Sáng Đa Tầng Luminous (`Luminous Light Theme`)**:
> - **Nền sáng đa tầng (`Multi-Layered Luminous Surfaces`)**: Base canvas (`#FAF9F6`, `#FDFBF7`, `#F8F9FA`), elevated cards (`#FFFFFF` hoặc frosted glass với viền sáng `inset highlight`).
> - **Bóng đổ đa chiều siêu mịn (`Multi-Dimensional Layered Shadows`)**: Tầng bóng ambient + key shadow tinh xảo (`box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.05), 0 12px 28px -4px rgba(0,0,0,0.04)`), viền quang học siêu mảnh (`1px solid rgba(0,0,0,0.06)`).
> - **Triệt tiêu giấy bẹt đơn điệu (`Anti-Flat Monolithic Paper`)**: Nghiêm cấm nền trắng bẹt `#FFFFFF` đơn sắc không đổ bóng, không phân tầng độ cao.
> - **Ngoại lệ duy nhất**: Chỉ dùng Dark Theme khi Anh yêu cầu tường minh (`Explicit Request Only`).


---

## Công Cụ Tra Cứu Nhanh (Fast Search CLI)

Sử dụng script tra cứu siêu tốc có sẵn trong skill (0 dependencies):

```bash
# Tra cứu tất cả theo từ khóa:
python "C:\Users\game\.gemini\config\skills\open-design\scripts\search_od.py" "<từ_khóa>"

# Tra cứu riêng Brand Design Systems:
python "C:\Users\game\.gemini\config\skills\open-design\scripts\search_od.py" "<tên_brand>" --systems

# Tra cứu riêng Templates (slide, dashboard, landing):
python "C:\Users\game\.gemini\config\skills\open-design\scripts\search_od.py" "<loại_template>" --templates

# Tra cứu kỹ năng bổ trợ (GSAP, 3D, animation, export):
python "C:\Users\game\.gemini\config\skills\open-design\scripts\search_od.py" "<kỹ_năng>" --skills
```

---

## Quy Trình Phối Hợp Đỉnh Cao: `open-design` + `ui-ux-pro-max`

Để sinh ra sản phẩm hoàn hảo nhất mà không cần mở bất kỳ phần mềm ngoài nào:

1. **Khảo sát Brand & Template**:
   - Chạy `search_od.py` hoặc đọc trực tiếp file `design-systems/<brand>/DESIGN.md` và `tokens.css`.
   - Lấy chính xác mã màu, typography, shadow, border radius của thương hiệu và chuyển ngữ sang hệ token Luminous Light Theme (nền sáng đa tầng, bóng đổ đa chiều).
2. **Đối soát với `ui-ux-pro-max`**:
   - Kiểm tra tương phản màu (WCAG Contrast 4.5:1+).
   - Kiểm tra touch targets tối thiểu (44×44px trên mobile).
   - Spacing nhịp điệu (8pt grid system).
3. **Sinh Artifact HTML/CSS/JS độc lập**:
   - Viết trọn gói vào 1 file HTML duy nhất hoặc module sạch.
   - Nhúng CSS Tokens chuẩn của thương hiệu ở `:root`.
4. **Kiểm Chứng & Trình Chiếu Trực Quan**:
   - Dùng Browser Subagent để render và chụp ảnh screenshot gửi ngay cho Anh nghiệm thu.
