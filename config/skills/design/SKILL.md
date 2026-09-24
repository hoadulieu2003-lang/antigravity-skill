---
name: design
description: "Master Visual Engine & Design Director ($design) — High-level creative direction, visual governance, aesthetic thesis formulation, and Luminous Light Theme standards. Automatically activate and reference for all web UI design tasks, landing pages, dashboards, major visual overhauls, and creative art direction. DO NOT use for non-visual backend tasks (DESIGN_NONE)."
---

# Master Visual Engine & Design Director ($design)

Transforming design from a capability catalog into a controlled, taste-driven creative decision system.

> **Core Axiom**:  
> Art Direction before components.  
> Capability selection after creative intent.  
> Design Engineer implements; Design Director directs.  
> Rendered screenshot evidence before visual approval.  
> 3D and motion are optional capabilities, never default aesthetics.  
> Luminous Light Theme is the mandatory default — multi-layered luminous surfaces, multi-dimensional soft shadows, zero flat paper monotony; all color spectrums welcome except black/dark theme (dark theme ONLY when explicitly requested by Anh).

---

## 1. Design Impact Classification

Before invoking creative subsystems, classify the task's visual impact:

- **`DESIGN_NONE`**: Backend, CLI, database, internal data logic, non-visual refactor $\to$ **Design Director NOT invoked**. Zero visual overhead.
- **`DESIGN_MAINTENANCE`**: Spacing adjustment, minor bug fix, color token tweak, copy change $\to$ **Reuse existing Design Contract**. No new art direction process.
- **`DESIGN_DIRECTION`**: New product, landing page, major screen family, visual redesign, or brand experience $\to$ **Full Design Director flow mandatory**.

---

## 2. Canonical Phase C Lifecycle for `DESIGN_DIRECTION`

```text
PROJECT CONTEXT & INTENT
          │
          ▼
1. REFERENCE INTELLIGENCE  (Analyze principles, do not copy assets)
          │
          ▼
2. DESIGN DIRECTOR         (Formulate Thesis, Signature Experience, Avoid-list)
          │
          ▼
3. 3 DIVERGENT DIRECTIONS  (Structurally distinct philosophies, not just color tweaks)
          │
          ▼
4. HUMAN ART DIRECTION GATE (Product Owner selects 1 winning direction)
          │
          ▼
5. DESIGN CONTRACT LOCKED  (Generate & freeze DESIGN_CONTRACT.yaml)
          │
          ▼
6. MCP CAPABILITY ROUTING  (Select minimum relevant capabilities <= 5 on demand)
          │
          ▼
7. DESIGN ENGINEER         (Pixel-perfect implementation within Contract boundaries)
          │
          ▼
8. RENDER SCREENSHOT       (Capture real visual evidence via CDP / Browser)
          │
          ▼
9. VISUAL CRITIC           (Evaluate against Contract criteria & Generic-AI risk)
          │
   ┌──────┴──────┐
  PASS          FAIL
   │             │
   ▼             ▼
READY    POLISH (Max 2 cycles) ──(if structural)──> RETURN TO DESIGN DIRECTOR
```

---

## 3. Modular Reference Guides & Design Intelligence

Read only the matching reference for current stage:
- **Design Foundation Research (10 Repos Intelligence)**: [references/DESIGN_FOUNDATION_RESEARCH.md](references/DESIGN_FOUNDATION_RESEARCH.md)
- **Design Foundation Rules (Testable Rules)**: [assets/DESIGN_FOUNDATION_RULES.yaml](assets/DESIGN_FOUNDATION_RULES.yaml)
- **Canonical Design Contract Schema**: [assets/DESIGN_CONTRACT_SCHEMA.yaml](assets/DESIGN_CONTRACT_SCHEMA.yaml)
- **Design Director Protocol**: [references/director-protocol.md](references/director-protocol.md)
- **Reference Intelligence Analysis**: [references/reference-analysis.md](references/reference-analysis.md)
- **Design Contract Lifecycle & Change Policy**: [references/design-contract.md](references/design-contract.md)
- **MCP Capability Routing & Progressive Loading**: [references/capability-routing.md](references/capability-routing.md)
- **Visual Critic & Screenshot Review**: [references/visual-critique.md](references/visual-critique.md)
- **Contract Schema Template**: [assets/DESIGN_CONTRACT_TEMPLATE.yaml](assets/DESIGN_CONTRACT_TEMPLATE.yaml)

---

## 4. Quy Trình 4 Bước Thiết Kế Typography & Bố Cục (4-Phase Typographic & Layout Workflow)

Mọi dự án giao diện thuộc phạm vi `DESIGN_DIRECTION` đều bắt buộc trải qua 4 giai đoạn chuẩn hóa:

```text
GIAI ĐOẠN 1: TRÍCH XUẤT QUY LUẬT (Extract Rules)
- Không sao chép giao diện trực tiếp
- Trích xuất: Fluid Type scale (Utopia), Primitives (Every Layout), Nhịp dọc (Capsize), Tokens (Open Props)
       │
       ▼
GIAI ĐOẠN 2: ĐỊNH HÌNH ART DIRECTION (Formulate Direction)
- Luận đề thị giác (Visual Thesis) + Trải nghiệm dấu ấn (Signature Experience)
- Khóa danh sách bài xích (Avoid-list): Cấm Bento vô tội vạ, cấm gradient tím AI, cấm Dark Theme khi chưa yêu cầu
       │
       ▼
GIAI ĐOẠN 3: KHÓA HỢP ĐỒNG THIẾT KẾ (Lock Design Contract)
- Khởi tạo DESIGN_CONTRACT.yaml theo chuẩn assets/DESIGN_CONTRACT_SCHEMA.yaml
- Khóa cứng: Font pairing, Modular scale clamp(), Spacing tokens, Layout primitives
       │
       ▼
GIAI ĐOẠN 4: THI CÔNG & KIỂM CHỨNG ĐỘC LẬP (Implement & Verify)
- Thi công CSS/React bám sát token, không dùng số ma thuật (magic numbers)
- Chụp ảnh màn hình (Screenshot evidence) và kiểm định qua Bộ quy tắc 6 điểm Tiền chuyển động
```

---

## 5. Bộ Quy Tắc Chống Mẫu AI Đại Trà (Anti-AI-Template Invariants & Defenses)

1. **ANTI-AI-001 (Luminous Light Theme Invariant)**: Mặc định 100% sử dụng chuẩn giao diện sáng đa tầng Luminous (`Luminous Light Theme`). Bắt buộc áp dụng cấu trúc nền sáng đa tầng (`Multi-Layered Surfaces`), bóng đổ đa chiều siêu mịn (`Multi-Dimensional Layered Shadows`), và viền quang học tinh tế (`Luminous Borders`). Nghiêm cấm giao diện phẳng lì, giấy bẹt đơn điệu (`Anti-Flat Paper`). Tuyệt đối cấm tự ý tạo dark theme / nền đen trừ khi Anh yêu cầu tường minh.
2. **ANTI-AI-002 (Cấm Gradient Tím Neon Đại Trà)**: Nghiêm cấm gradient tím/hồng/cyan mặc định (`#6366f1 -> #ec4899`). Bảng màu phải xuất phát từ bản sắc thương hiệu độc bản.
3. **ANTI-AI-003 (Cấm Bento Grid Vô Căn Cứ)**: Không biến mọi section thành ô hộp Bento phân mảnh. Chỉ dùng Bento khi mật độ và hình thái dữ liệu thực sự cần phân hóa kích thước.
4. **ANTI-AI-004 (Phá Vỡ Đối Xứng Đều Đặn 50/50)**: Tạo nhịp điệu biên tập bất đối xứng có chủ đích (tỉ lệ vàng 62/38, typography phóng đại, lùi dòng có ý đồ).
5. **ANTI-AI-005 (Kiểm Soát Độ Dài Dòng Đọc 65ch)**: Không bao giờ để chữ dàn trải toàn màn hình. Văn bản đọc luôn khóa `max-inline-size: 65ch` (45ch - 75ch).
6. **ANTI-AI-006 (Triệt Tiêu Số Ma Thuật - Magic Numbers)**: 100% khoảng cách `padding`, `margin`, `gap` phải dùng biến token có nguồn gốc từ hệ thống `Utopia / Open Props`.

---

## 6. Bộ Kiểm Tra 6 Điểm Tiền Chuyển Động (6-Point Pre-Motion Verification Checklist)

Tuyệt đối **KHÔNG ĐƯỢC PHÉP** bật thư viện chuyển động (`gsap`) hay đồ họa 3D (`r3f-pmndrs` / `threejs`) để che đậy một bố cục yếu. Trang web phải đạt điểm xuất sắc khi tắt hoàn toàn JavaScript theo 6 tiêu chí:

- [ ] **1. Typography Pass**: Chữ có tỉ lệ modular scale rõ ràng qua `clamp()`? Line-height có tỉ lệ nghịch với kích cỡ font không? Chữ hoa có bù trừ letter-spacing không?
- [ ] **2. Spacing Scale Pass**: Tất cả khoảng cách padding, margin, gap có thuộc hệ thống token có logic không? Margin trên của tiêu đề có lớn hơn margin dưới không (Luật Gần gũi Gestalt)?
- [ ] **3. Grid & Measure Pass**: Văn bản đọc có giới hạn ở 65ch không? Lưới card có dùng `repeat(auto-fit, minmax(min(100%, ...), 1fr))` để tự co giãn không vỡ layout không?
- [ ] **4. Visual Hierarchy Pass**: Mắt người nhìn có nhận diện ngay điểm nhấn số 1 trong 3 giây không? Cấp bậc H1, H2, H3, Body có phân tầng rõ rệt không?
- [ ] **5. Responsive Fluidity Pass**: Giao diện co giãn liên tục mượt mà từ 320px đến 1440px+ không bị giật nấc hoặc tràn ngang (horizontal scrollbar) không?
- [ ] **6. Composition Integrity Pass**: Khi tắt 3D Canvas và animation, trang web có đứng vững như một tác phẩm in ấn biên tập chất lượng cao (`Editorial Masterpiece`) không?

---

## 7. Thang Ưu Tiên Công Nghệ Xây Dựng Portfolio (Portfolio Tech Priority Hierarchy)

Khi xây dựng các website trình diễn năng lực nhằm chinh phục khách hàng cao cấp:
1. **Nền tảng Cốt lõi (70% Đẳng cấp)**: **Typography Đỉnh cao + Every Layout Primitives + Light Theme Độc bản**. Thể hiện tư duy thẩm mỹ vững chắc của một Senior Architect, tách biệt hoàn toàn khỏi các template AI rẻ tiền.
2. **Trải nghiệm Tương tác Vi mô (Micro-Interactions)**: Chuyển động CSS thuần túy, tương phản hover/focus tinh tế, căn gióng Cap-Height chính xác.
3. **Chuyển động Kể chuyện (Storytelling Motion)**: Thư viện `gsap` (ScrollTrigger, Flip, SplitText) dẫn dắt câu chuyện thương hiệu mượt mà 60 FPS.
4. **Điểm Nhấn Công Nghệ Cao (High-Tech Wow Factor)**: `r3f-pmndrs` hoặc `threejs` cho 01 Hero Scene 3D hoặc tương tác sản phẩm không gian 3 chiều đỉnh cao.

---

## 8. Key Rules of Engagement

1. **Thẩm quyền Tách bạch**: Design Director quyết định WHAT + WHY; Design Engineer quyết định HOW.
2. **Khóa Hợp đồng**: Khi trạng thái là `ART_DIRECTION_LOCKED`, cấm Design Engineer tự ý đổi font, layout, bảng màu, hoặc triết lý chuyển động. Thay đổi cốt lõi bắt buộc qua `DESIGN_CONTRACT_CHANGE_REQUEST`.
3. **Không Lạm dụng 3D/Motion**: Three.js/WebGL là giải pháp có chọn lọc khi phục vụ câu chuyện sản phẩm, tuyệt đối không dùng 3D làm vỏ bọc cho bố cục yếu.
4. **Bằng chứng Thực nghiệm**: Bắt buộc có ảnh chụp màn hình (`Screenshot`) cho mọi nghiệm thu visual chính.
5. **Giao Diện Màu Sáng Đa Tầng Luminous (`Luminous Light Theme Invariant`)**: Mặc định 100% sử dụng chuẩn giao diện sáng đa tầng Luminous (nền sáng đa tầng, bóng đổ đa chiều, viền quang học, triệt tiêu hoàn toàn giấy bẹt đơn điệu; khai thác toàn bộ các dải màu phong phú khác: trắng, kem, be, pastel, xanh, cam, xám nhạt, v.v., tuyệt đối loại trừ màu đen/dark theme). Chỉ được phép sử dụng giao diện màu đen khi Anh có yêu cầu tường minh.

