---
name: dev
description: Step 2 ($dev or $project-delivery) — Plan, partition, produce, self-verify, and integrate an approved product, design, software, AI/data, automation, document, or content deliverable. Operates under strict Developer Self-Verification, Evidence Ledger emission, Scope Drift control, and Loop Budget accounting. Use after scope and acceptance criteria are defined; do not use to invent material requirements or perform final independent verification.
---

# Project Delivery ($dev)

Turn an approved Definition Handoff into an integrated, verifiable release candidate backed by concrete proof. 

> **Core Philosophy**:  
> No evidence, no handoff.  
> Verification depth follows execution risk.  
> Discovered work does not silently become current work.  
> Two failed repair attempts trigger failure diagnosis, not a third blind patch.

---

## 1. Execution Mode & Topology Routing

Delivery topology adapts strictly to the `execution_mode`:
- **`FAST` Delivery**: `READ_ONLY / ADVISORY ONLY`. Chỉ áp dụng cho hỏi đáp lý thuyết, review tài liệu, giải thích kiến trúc hoặc sửa chính tả 1 từ trong comment (`Single-Agent Turbo`). Cấm dùng `FAST` để triển khai logic hoặc sửa code ứng dụng một mình.
- **`STANDARD` Delivery (MẶC ĐỊNH CHO MỌI TÁC VỤ CODE)**: `TEAMWORK_MULTI_AGENT` (Parallel Worker Pods). Bất kể Anh ra lệnh tự nhiên thế nào (không cần gõ nhắc chia agent), hệ thống **100% tự động kích hoạt bầy đa tác tử** qua `invoke_subagent`. Antigravity giữ vai trò Lead Integrator.
- **`CRITICAL` Delivery**: `TEAMWORK_FULL_POD` (Lead Architect + Parallel Delivery Pods + Adversarial Reviewer + Human Gate). Toàn bộ module trọng yếu phải được thi công song song bởi các tác tử chuyên biệt, thẩm định chéo trước khi Lead Integrator tổng hợp.

### 1.1 Autonomous Teamwork Multi-Agent Protocol (Quy chuẩn Đa tác tử Tự Trị Thực thụ)
When executing:
1. **Zero-Prompt Autonomous Dispatch**: Product Owner (Anh) **tuyệt đối KHÔNG BAO GIỜ cần gõ thủ công lệnh `/teamwork-preview` hay prompt nhắc chia đa agent**. Khi nhận yêu cầu viết hoặc sửa code, Lead Integrator tự động phân rã và gọi `invoke_subagent` ngay lập tức.
2. **Cấm Tuyệt Đối Trượt Về Đơn Tác Tử (Zero Single-Agent Fallback Invariant)**:
   - Nghiêm cấm Lead Integrator tự mình viết toàn bộ code từ đầu đến cuối mà không dispatch subagents song song.
   - Bắt buộc phân chia `Work Packages (Gói công việc)` thành các ranh giới file/thư mục độc lập (`Isolated Ownership`), triệt tiêu rủi ro tranh chấp ghi mã nguồn (`Race Condition`).
3. **Mô hình Phân Rã Worker Pods Thích Ứng (`Domain-Adaptive Parallel SWE Pods`)**:
   - 🌐 **Khung 1 — Dự Án Giao Diện / Fullstack (Có UI)**:
     - 🔹 `Worker Pod 1 (Core Logic & Backend)`: Tầng dữ liệu, APIs, models, controllers, business rules.
     - 🔹 `Worker Pod 2 (Visual & Frontend UI)`: Tầng UI, layout components, CSS tokens, responsiveness, animations.
     - 🔹 `Worker Pod 3 (Developer Test Harness)`: Bộ test tích hợp, fixtures, component mocks.
   - ⚡ **Khung 2 — Dự Án Dữ Liệu / Tính Toán / Không UI (`DESIGN_NONE` — Bung 8 Workers)**:
     - 🔹 `Worker Pod 1 (Ingestion & Transport Layer)`: Thu nạp dữ liệu, streaming I/O, cache, chuẩn hóa đầu vào.
     - 🔹 `Worker Pod 2 (Transformation & Compute Engine)`: Giải thuật lõi, tính toán toán học, trích xuất đặc trưng, xử lý mảng bộ nhớ tĩnh.
     - 🔹 `Worker Pod 3 (Policy & Decision Engine)`: Đánh giá sự kiện, máy trạng thái (`State Machine`), logic ra quyết định nghiệp vụ.
     - 🔹 `Worker Pod 4 (Safety, Persistence & Guard)`: Lưu trữ CSDL (atomic write), cơ chế ngắt mạch (`Circuit Breaker`), phòng chống thất thoát dữ liệu.
   - Hoặc điều phối trực tiếp tới cỗ máy gốc: `invoke_subagent(TypeName: "teamwork_preview", Prompt: payload)`.
4. **Giao Thức Biên Nhận Tinh Gọn (`Zero-Contention Receipt Manifest Protocol`)**:
   - Cấm subagents dán toàn bộ code diffs và terminal logs dài dòng vào tin nhắn chat gửi về Lead Integrator.
   - Mỗi subagent hoàn thành tự ghi một file biên nhận riêng: `.antigravity/receipts/wp_{id}.json` (gồm danh sách file tạo/sửa, exit code test, tóm tắt 2 dòng).
   - Subagent chỉ gửi thông báo siêu nhẹ: `{"wp": "wp-id", "receipt": ".antigravity/receipts/wp_id.json"}`, cắt giảm **90% token rác** đổ về chat.
5. **Tích Hợp Cuốn Chiếu Dòng Sự Kiện (`Progressive Streaming Integration`)**:
   - Lead Integrator không đợi rào cản tập trung. Ngay khi nhận biên nhận từ Pod nào xong trước, tiến hành thẩm định diff và merge cuốn chiếu ngay module đó vào nhánh chính qua cơ chế Reactive Wakeup.
6. **Trách nhiệm Tác tử Trưởng (`Lead Integrator & Synthesis Gate`)**:
   - Antigravity đứng ở vai trò Tác tử Trưởng: không tranh viết code chi tiết với Worker Pods, mà chịu trách nhiệm ghép nối (`Merge`), đồng bộ giao diện API, kiểm toán diff đối chiếu với Acceptance Criteria, thực thi Self-Verification và nộp kết quả minh bạch lên Anh.

---

## 2. Developer Self-Verification Contract (Mandatory Exit Gate)

No Work Package may transition to `READY_FOR_INTEGRATION` or `READY_FOR_VERIFICATION` without completing Developer Self-Verification.

### Mode-Aware Verification Profiles
1. **FAST Profile (Targeted & Rapid)**:
   - Syntax / compile check relevant strictly to changed files.
   - Targeted lint on modified scope.
   - Targeted test if directly related.
   - Visual inspection for visible UI modifications.
   - *Never execute the entire repository test suite for local FAST changes.*
2. **STANDARD Profile (Feature-Complete)**:
   - Build relevant module or project.
   - Relevant lint (0 errors, 0 new warnings in affected scope).
   - Targeted unit and integration tests mapped to acceptance criteria.
   - Runtime sanity check (app runs without unhandled exceptions).
3. **CRITICAL Profile (Exhaustive & Defensive)**:
   - Full build and lint.
   - Comprehensive unit, integration, and contract regression checks.
   - Database migration dry-run / rollback verification when applicable.
   - Security and permission sanity check.

### Allowed Status per Verification Item
- `PASS`: Executed and succeeded (exit code 0 or confirmed observation).
- `FAIL`: Executed and failed.
- `N/A`: Not applicable to this work package (accompanied by valid technical rationale).
- `SKIPPED_BLOCKED`: Tooling or environment unavailable (recorded as known residual risk).

**Invariant**: *Never fabricate PASS for unexecuted or unobservable checks.*

---

## 3. Evidence Ledger Emission

Every completed Work Package must emit a structured `evidence_packet`:
```yaml
evidence_packet:
  schema_version: "1.0"
  work_package: WP-XX
  status: READY_FOR_INTEGRATION | BLOCKED | FAILED
  changed_files:
    - path/to/file
  acceptance_mapping:
    AC-01:
      status: PASS | FAIL | NOT_VERIFIED | N/A
      evidence_refs:
        - EV-001
  verification:
    - id: EV-001
      check: build | lint | unit | integration | runtime | visual | contract | other
      method: command | inspection | browser | script | other
      command: "actual shell command executed or null"
      scope: "exact scope tested"
      result: PASS | FAIL | N/A | SKIPPED_BLOCKED
      exit_code: integer | null
      notes: "output snippet or verification summary"
  discovered_issues:
    - id: ISSUE-001
      description: "description of discovered issue"
      required_for_current_acceptance: true | false
      action: FIX_CURRENT_WP | BACKLOG | RECLASSIFY
  repair_budget:
    attempts_used: 0
    max_attempts: 2
  known_risks:
    - "documented limitations"
  final_claim:
    ready: true | false
    reason: "summary of readiness"
```

---

## 4. Scope Drift Control Policy

When a developer discovers an unforeseen issue during implementation:
1. **Ask**: *Is this strictly required to satisfy current acceptance criteria?*
2. **If YES**:
   - Add it to the current Work Package as an authorized task.
   - Document in `discovered_issues` with action `FIX_CURRENT_WP`.
   - Update acceptance criteria and evidence accordingly.
3. **If NO**:
   - Log the issue to the project backlog / discovered list with action `BACKLOG`.
   - **DO NOT TOUCH** the code (strict prohibition against "while I'm here" refactoring).
4. **If MATERIAL RISK**:
   - If the discovery involves auth, security, database schema/migration, or public contracts:
   - **STOP IMMEDIATELY** $\to$ Reclassify to `CRITICAL` $\to$ Update plan $\to$ Request Human Gate.

---

## 5. Loop Budget & Failure Classification Policy

* **Repair Limit**: `MAX_FIX_ATTEMPTS = 2`.
  - An attempt is a distinct code/config modification aimed at fixing the same failed test or criterion.
* **Circuit Breaker on Exhaustion**:
  - After 2 failed attempts, **STOP PATCHING**. Do not attempt a 3rd blind fix.
  - Classify the root cause into one of five canonical failure classes:
    1. `IMPLEMENTATION_DEFECT`: Approach flawed $\to$ Propose alternative design or escalate reasoning model.
    2. `SPEC_DEFECT`: Contradictory or missing requirements $\to$ Return to $plan.
    3. `ARCHITECTURE_DEFECT`: Structural limitation $\to$ Escalate to Lead Architect (Anh).
    4. `ENVIRONMENT_DEFECT`: Toolchain/runtime/permission failure $\to$ Emit diagnostic report.
    5. `EXTERNAL_DEPENDENCY`: Upstream or third-party service outage $\to$ Emit blocked report.
  - Set status to `BLOCKED` or `FAILED` and emit the Failure Report.

---

## 6. Delivery Handoff Verdicts

Use exactly one verdict:
- `READY_FOR_INTEGRATION`: Work package verified with evidence, ready for assembly.
- `READY_FOR_VERIFICATION`: Delivery complete, release candidate baseline frozen.
- `CONDITIONAL_READY_FOR_VERIFICATION`: Complete with documented non-blocking limitations.
- `NOT_READY_FOR_VERIFICATION`: Verification failed or loop budget exhausted.

Do not claim final acceptance; independent verification belongs strictly to Step 3 ($test).
