---
name: plan
description: Step 1 ($plan or $project-definition) — Define and scope a new product, feature, technical module, service, AI/data pipeline, automation, or document/content deliverable with Adaptive Planning Depth (FAST / STANDARD / CRITICAL) before execution. Use when deciding what should exist, why it is needed, its boundaries, and its acceptance conditions; do not use to implement or perform final verification.
---

# Project Definition (Adaptive $plan)

Create an evidence-aware Definition Handoff that Step 2 ($dev) can execute without inventing requirements. The planning depth and ceremony automatically adapt to the resolved Execution Mode (`FAST`, `STANDARD`, or `CRITICAL`).

---

## 1. Classify Execution Mode & Risk First

Before writing the plan, the Engineering Kernel resolves the task into one of three execution tiers:

1. **FAST**: Local, reversible, low blast radius, no contract/security/migration impact.
2. **STANDARD**: Normal feature, module, internal endpoint, or bounded refactor.
3. **CRITICAL**: Architecture, authentication, security, database migration, public contracts, or irreversible changes.

*Safety Clamp Invariant*: If any critical risk signal is detected, the plan MUST escalate to `CRITICAL`. If uncertain between FAST and STANDARD, default to `STANDARD`.

### 1.1 Multi-Perspective Strategic Board Protocol (Hội Đồng Đa Tác Tử Tự Trị Cho $plan)
Khi lập kế hoạch cho các bài toán chiến lược, module mới, tối ưu hóa sức mạnh, nâng cấp thuật toán, hoặc luồng dữ liệu (mức `STANDARD` & `CRITICAL`):
* **Zero-Prompt Autonomous Dispatch**: Anh **tuyệt đối không cần nhắc chia subagent** trong prompt. Tác tử Trưởng tự động 100% kích hoạt bầy tác tử qua `invoke_subagent`.
* **Cấm Đơn Tác Tử Độc Thoại (`Zero Single-Agent Monologue`)**: Tuyệt đối không để một tác tử duy nhất tự đọc file và tự kết luận kế hoạch theo góc nhìn một chiều (`Tunnel Vision`).
* **Kích hoạt Hội Đồng Đa Tác Tử Đồng Thời (`Multi-Perspective Pod via invoke_subagent`)**:
  - 🕵️ **`Subagent 1 — Forensic Investigator`**: Quét mã nguồn hiện tại, bóc tách cấu hình, chạy benchmark và tìm ra điểm nghẽn thực tế (`Current Bottlenecks`).
  - 💡 **`Subagent 2 — Optimization Strategist`**: Nghiên cứu các giải pháp kỹ thuật đột phá, đề xuất thuật toán mới nhằm khai phóng tối đa sức mạnh (`Max Potential`).
  - 🛡️ **`Subagent 3 — Adversarial Architect / Risk Reviewer`**: Đóng vai trò phản biện đối kháng, tìm ra các rủi ro tiềm ẩn, bẫy rủi ro (drawdown, overfit, latency, memory leak) và điểm đánh đổi (`Trade-offs`).
* **Lead Architect Gate (Antigravity)**: Thu thập toàn bộ phân tích từ 3 tác tử, tổng hợp và đề xuất **2 phương án phân kỳ (Option A vs Option B)** kèm bảng đánh đổi rõ ràng để trình Anh (Product Owner) quyết định.
* **Khóa Khế Ước Kiểu Dữ Liệu Cứng (`AST Type Contract Lock Protocol`)**:
  - Trước khi chuyển giao sang Bước 2 (`$dev`), Tác tử Trưởng chịu trách nhiệm biên soạn và đóng băng file định nghĩa kiểu dữ liệu duy nhất (ví dụ: `types/contract.ts` hoặc các Interface dùng chung).
  - Khóa quyền ghi (`Read-Only Lock`) với file contract này: Toàn bộ các Parallel SWE Pods ở `$dev` chỉ được phép `import` sử dụng, tuyệt đối cấm tự ý sửa đổi contract, triệt tiêu 100% rủi ro xung đột mã nguồn (`Merge Conflicts`).

---

## 2. Adaptive Planning Templates

Select the matching depth template based on the resolved mode:

### Template 1: FAST PLAN (Tinh gọn — Tối thiểu Thủ tục)
Use for small, local, reversible changes. Keep concise (under 25 lines):
```markdown
# [Task Title]

- **Execution Mode**: FAST
- **Intent**: What needs to be changed and why.
- **Affected Scope**: Exact files and functions impacted.
- **Acceptance Criteria**: Concrete verifiable conditions for completion.
- **Primary Risk**: Main failure mode and quick rollback method.
- **Proposed Topology**: SINGLE_OWNER
```

### Template 2: STANDARD PLAN (Tiêu chuẩn Tính năng)
Use for standard features and modules:
```markdown
# [Feature Title]

- **Execution Mode**: STANDARD
- **Problem & Objective**: Detailed problem statement and target outcome.
- **Scope & Non-Goals**: Explicit boundaries of what is in and out of scope.
- **Current Context**: Analysis of existing implementation and interfaces.
- **Dependencies & Integration**: Points of connection with other components.
- **Acceptance Criteria**: Requirement-traceable criteria (AC-01, AC-02...).
- **Work Boundaries**: Module ownership and do-not-touch boundaries.
- **Proposed Topology**: TEAMWORK_POD (Autonomous Multi-Agent delegation via invoke_subagent)
```

### Template 3: CRITICAL PLAN (Pháp y Kiến trúc Chuyên sâu)
Use for architecture, security, database, contracts, or high-risk tasks:
```markdown
# [Architecture / Migration Title]

- **Execution Mode**: CRITICAL
- **Problem & Forensic Analysis**: Deep dive into current state, code forensic, and historical context.
- **Scope & Strict Non-Goals**: Rigid containment boundaries.
- **Risk Surface & Threat Model**: Security, data integrity, and blast radius analysis.
- **Alternative Approaches & Trade-offs**: Evaluation of option A vs option B with explicit trade-offs.
- **System & API Contracts**: Formal contract specifications and backward compatibility guarantees.
- **Failure Modes & Degradation**: Behavior under partition, failure, or timeout.
- **Rollback & Disaster Recovery**: Step-by-step recovery procedure if deployment fails.
- **Security & Data Concerns**: Credentials, privacy, and migration safeguards.
- **Acceptance Criteria**: Strict verification requirements.
- **Human Decisions Required**: Explicit choices that require Product Owner (Anh) sign-off.
- **Proposed Topology**: TEAMWORK_FULL_POD (Architect + Parallel Implementers + Adversarial Reviewer + Human Gate)
```

---

## 3. Work Protocol

1. **Inspect First**: Inspect existing code/artifacts before drafting.
2. **Select Depth**: Apply FAST, STANDARD, or CRITICAL template based on Kernel classification.
3. **Draft Plan**: Fill all required fields of the selected template. Do not invent facts; mark unknowns as `ASSUMPTION`.
4. **Gate Evaluation**:
   - `READY_FOR_DELIVERY`: Scope and acceptance criteria are actionable.
   - `CONDITIONAL_READY`: Planning may proceed, but list pending decisions.
   - `NOT_READY_FOR_DELIVERY`: Material ambiguity or unresolved critical risk prevents execution.
5. **Human Gate Enforcement**: If mode is `CRITICAL`, stop and obtain explicit sign-off from Product Owner (Anh) before transitioning to `$dev`.

Do not implement code in this skill. Conclude with the next authorized action.
