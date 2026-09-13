---
name: design
description: Master Visual Engine & Design Director ($design) — High-level creative direction, visual governance, and aesthetic thesis formulation. Activates ONLY when explicitly invoking $design, defining art direction for new products/landing pages (DESIGN_DIRECTION), or executing major visual overhauls. DO NOT use for routine CSS styling, component tweaks, or minor UI bug fixes (use ui-ux-pro-max or local styling instead).
---

# Master Visual Engine & Design Director ($design)

Transforming design from a capability catalog into a controlled, taste-driven creative decision system.

> **Core Axiom**:  
> Art Direction before components.  
> Capability selection after creative intent.  
> Design Engineer implements; Design Director directs.  
> Rendered screenshot evidence before visual approval.  
> 3D and motion are optional capabilities, never default aesthetics.  
> Light Theme is the mandatory default — all color spectrums welcome except black/dark theme; dark theme ONLY when explicitly requested by Anh.

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

## 3. Modular Reference Guides

Read only the matching reference for current stage:
- **Design Director Protocol**: [references/director-protocol.md](references/director-protocol.md)
- **Reference Intelligence Analysis**: [references/reference-analysis.md](references/reference-analysis.md)
- **Design Contract Lifecycle & Change Policy**: [references/design-contract.md](references/design-contract.md)
- **MCP Capability Routing & Progressive Loading**: [references/capability-routing.md](references/capability-routing.md)
- **Visual Critic & Screenshot Review**: [references/visual-critique.md](references/visual-critique.md)
- **Contract Schema Template**: [assets/DESIGN_CONTRACT_TEMPLATE.yaml](assets/DESIGN_CONTRACT_TEMPLATE.yaml)

---

## 4. Key Rules of Engagement

1. **Thẩm quyền Tách bạch**: Design Director quyết định WHAT + WHY; Design Engineer quyết định HOW.
2. **Khóa Hợp đồng**: Khi trạng thái là `ART_DIRECTION_LOCKED`, cấm Design Engineer tự ý đổi font, layout, bảng màu, hoặc triết lý chuyển động. Thay đổi cốt lõi bắt buộc qua `DESIGN_CONTRACT_CHANGE_REQUEST`.
3. **Không Lạm dụng 3D/Motion**: Three.js/WebGL là giải pháp có chọn lọc khi phục vụ câu chuyện sản phẩm, tuyệt đối không dùng 3D làm vỏ bọc cho bố cục yếu.
4. **Bằng chứng Thực nghiệm**: Bắt buộc có ảnh chụp màn hình (`Screenshot`) cho mọi nghiệm thu visual chính.
5. **Giao Diện Màu Sáng Mặc Định (`Light Theme Default Invariant`)**: Mặc định 100% sử dụng giao diện màu sáng (khai thác toàn bộ các dải màu phong phú khác: trắng, kem, be, pastel, xanh, cam, xám nhạt, v.v., tuyệt đối loại trừ màu đen/dark theme). Chỉ được phép sử dụng giao diện màu đen khi Anh có yêu cầu tường minh.
