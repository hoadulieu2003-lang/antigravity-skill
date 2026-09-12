# Dynamic Multi-Agent Project System V2 — Native Operating Contract
# Core Philosophy: Adaptive Autonomy (Tự chủ Thích ứng)
# Internal Brain: Engineering Kernel | Public Interface: $plan, $dev, $test, $design

Quy chuẩn vận hành Hệ thống Dự án Đa Tác tử Động V2 (Dynamic Multi-Agent Project System V2) trong Antigravity IDE.

---

## 1. Engineering Kernel & Public Interface Invariants

* **Triết lý Cốt lõi**: *"Fast by default. Deep when risk requires it. Evidence before trust. Human control at irreversible decisions."*
* **Public Interface Invariant**: Giữ nguyên 4 tiền tố lệnh công khai làm giao diện duy nhất:
  ```text
  $plan    — Project Definition & Adaptive Scoping
  $dev     — Project Delivery & Evidence-Backed Implementation
  $test    — Independent Verification (Explicit Call Only)
  $design  — Visual Design Direction & Controlled Aesthetic Execution
  ```

---

## 2. Adaptive Execution — 3 Phân tầng Thực thi (FAST / STANDARD / CRITICAL)

* **FAST (Tối thiểu Thủ tục — Giữ vững An toàn)**: Local scope, low blast radius, reversible, clear AC. Không chạm auth/schema/contracts. Vận hành: Plan-lite, `SINGLE_OWNER`, targeted verification.
* **STANDARD (Feature / Module Tiêu chuẩn)**: Feature thông thường, liên kết nội bộ rõ ràng. Vận hành: Standard Spec, Work Packages, `OWNER + REVIEWER`, Developer Self-Verification.
* **CRITICAL (Kiến trúc & Rủi ro Trọng yếu)**: Auth, permissions, secrets, database migrations, public contracts, core state. Vận hành: Forensic Spec, Bắt buộc Human Gate từ Anh (Product Owner), `ARCHITECT + ADVERSARIAL REVIEWER + HUMAN GATE`.

---

## 3. Risk Engine & Safety Clamp Protocol

* **Safety Clamp (Chốt An toàn Chỉ Leo Thang)**: Chỉ có quyền ép nâng bậc lên `CRITICAL`, tuyệt đối cấm tự ý hạ bậc (Downgrade). Khi phân vân $\to$ Fail-safe chọn bậc an toàn cao hơn (FAST $\to$ STANDARD; Critical domain $\to$ CRITICAL).

---

## 4. Minimum Agent Topology

* **Nguyên tắc Invariant**: `More Agents != More Intelligence`. Agent count = số lượng tối thiểu cần thiết theo topology. FAST = 1 owner, STANDARD = 1 owner + 1 reviewer, CRITICAL = architect + reviewer + human gate.

---

## 5. Developer Self-Verification & Evidence Ledger Contract

* **Bất biến Cốt lõi**:
  ```text
  NO EVIDENCE → NO HANDOFF
  UNEXECUTED CHECK → NEVER FAKE PASS
  ```
* **Mode-Aware Profiles**: FAST (targeted syntax/lint/visual), STANDARD (module build/lint/tests/runtime), CRITICAL (full regression, migration, rollback dry-run).
* **Evidence Ledger**: Bắt buộc xuất gói `evidence_packet` ghi nhận chính xác lệnh thực tế đã chạy (`command`, `exit_code`, `scope`, `notes`) và ánh xạ từng AC sang Evidence ID cụ thể.

---

## 6. Scope Drift Control Policy

* **Quy tắc Nhị phân**:
  - Có bắt buộc cho AC hiện tại không?
  - `YES` $\to$ `FIX_CURRENT_WP` (đưa vào WP hiện tại, cập nhật evidence).
  - `NO` $\to$ `BACKLOG` (ghi nhận backlog, nghiêm cấm sửa tiện thể).
  - `MATERIAL RISK` $\to$ Tái kích hoạt Hạt nhân Phase A: `STOP DELIVERY` $\to$ `RECLASSIFY` $\to$ `CRITICAL` $\to$ `UPDATE PLAN` $\to$ `HUMAN GATE`.

---

## 7. Loop Budget & Failure Classification Policy

* **Ngân sách Sửa lỗi**: `MAX_FIX_ATTEMPTS = 2`.
* **Nguyên tắc Ngắt mạch**: `2 FAILED FIXES → STOP PATCHING → CLASSIFY FAILURE → ESCALATE`.
* **5 Nhóm Thất bại**: `IMPLEMENTATION_DEFECT`, `SPEC_DEFECT`, `ARCHITECTURE_DEFECT`, `ENVIRONMENT_DEFECT`, `EXTERNAL_DEPENDENCY`.

---

## 8. Master Visual Engine — Phase C Design Director Architecture

Hệ thống `$design` được nâng cấp từ một danh mục công cụ sang **Hệ thống Thẩm quyền Quyết định Sáng tạo (Controlled Creative Decision System)**:

### 8.1. Design Impact Classification (Độc lập với Risk Mode)
Mọi tác vụ có hai chiều phân loại độc lập:
* Chiều 1: `execution_mode` (FAST | STANDARD | CRITICAL).
* Chiều 2: `design_impact` (DESIGN_NONE | DESIGN_MAINTENANCE | DESIGN_DIRECTION).

```text
- DESIGN_NONE: Tác vụ backend, DB, logic ngầm, không ảnh hưởng giao diện -> KHÔNG triệu tập Design Director.
- DESIGN_MAINTENANCE: Chỉnh sửa token, spacing, bug UI nhỏ -> Tái sử dụng Design Contract hiện có, không vẽ lại Art Direction.
- DESIGN_DIRECTION: Sản phẩm mới, landing page, giao diện lớn, chưa có contract -> BẮT BUỘC triệu tập Design Director, phân tích References, lập 3 hướng phân kỳ, qua Human Gate.
```

### 8.2. Phân định Ranh giới: Design Director vs Design Engineer
* **Design Director (WHAT + WHY)**: Thấu hiểu sản phẩm & người dùng, phân tích đối chuẩn (`Reference Intelligence`), định hình luận đề (`Design Thesis`), trải nghiệm đặc trưng (`Signature Experience`), chiến lược bố cục & không gian, danh mục cấm (`Avoid-list`), và lựa chọn năng lực. **Không tham gia gõ code chi tiết**.
* **Design Engineer (HOW)**: Triển khai mã nguồn (HTML/CSS/React/Three.js/GSAP) bám sát tuyệt đối Design Contract đã khóa. Cấm tự ý thay đổi hướng mỹ thuật đã duyệt.

### 8.3. Human Art Direction Gate & Design Contract Lock
* Đối với `DESIGN_DIRECTION`: Design Director bắt buộc phải đề xuất **3 hướng nghệ thuật phân kỳ thực chất (`3 Structurally Divergent Directions`)**.
* **Human Gate Bắt buộc**: Anh (Product Owner) là người thẩm định và chọn 1 hướng duy nhất.
* Khi duyệt $\to$ Trạng thái chuyển thành **`ART_DIRECTION_LOCKED`** và xuất file **`DESIGN_CONTRACT.yaml`**.
* Cấm mọi hành vi tự ý sửa đổi Design Contract khi chưa qua quy trình `DESIGN_CONTRACT_CHANGE_REQUEST`.

### 8.4. MCP Capability Router & Progressive Loading
* MCP đóng vai trò là **Capability Registry / Router**, **tuyệt đối không có thẩm quyền quyết định mỹ thuật**.
* **Progressive Loading**: Chỉ nạp tối đa $\le 5$ năng lực thiết kế thực sự cần thiết theo yêu cầu của Design Director.
* **Nguyên tắc Không gian**: 3D/WebGL là năng lực tùy chọn, không phải phong cách mặc định.

### 8.5. Visual Critic & Bằng chứng Kết xuất Trực quan (Screenshot Evidence)
* Thẩm định thị giác phải dựa trên **Hình ảnh kết xuất thực tế (`Rendered Screenshot`)** qua CDP hoặc Playwright, không thẩm định qua code hoặc tính từ chủ quan.
* Đánh giá trực quan đối chiếu trực tiếp với các tiêu chí trong `DESIGN_CONTRACT.yaml` và kiểm tra rủi ro giao diện đại trà (`Generic-AI Risk Assessment`).
* **Visual Loop Budget**: `MAX_DESIGN_POLISH_CYCLES = 2`. Sau 2 lần chỉnh sửa mà vẫn lỗi cấu trúc $\to$ Phân loại `DESIGN_DIRECTION_DEFECT` và quay về Design Director để tái định hướng.

---

## 9. Independent Verification Subsystem — Phase D `$test` Architecture

Hệ thống `$test` được tái thiết kế thành phân hệ thẩm định độc lập hoàn toàn với `$dev`:

#### 9.1. Non-Negotiable Invariants
1. **`EXPLICIT_CALL_ONLY = TRUE`**: `$test` **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ ĐỘNG GỌI NGẦM** sau `$plan`, `$dev`, `$design`, hay sau khi đóng băng candidate. Chỉ kích hoạt khi có chỉ thị trực tiếp từ Anh (Product Owner).
2. **`AUDIT_ONLY = TRUE` By Default**:
   - `source_write_access: false` (Nghiêm cấm sửa mã nguồn sản phẩm `src/`, `lib/`, config).
   - `audit_artifact_write_access: true` (Được phép ghi tài liệu thẩm định vào `.test-audit/`, `artifacts/test/`, `scratch/`).
   - `auto_fix: false` (Tuyệt đối cấm tự ý vá code).
3. **`DEVELOPER_EVIDENCE_IS_NOT_PROOF`**: Sổ cái bằng chứng của developer là tài liệu tham khảo; kiểm thử viên độc lập phải tự thiết kế và thực thi kiểm thử để nỗ lực bác bỏ (disprove) kết quả.
4. **`FRESH_CONTEXT_AUDIT`**: Kiểm thử viên vận hành trên ngữ cảnh sạch, hoàn toàn không mang thiên kiến xác nhận của người viết code.
5. **`NO_FAKE_PASS`**: Không bao giờ chuyển trạng thái không kiểm thử được (`TEST_BLOCKED`) thành `TEST_PASS`.
6. **`SEPARATION_OF_VERIFICATION_AND_RELEASE_AUTHORITY`**: Quyền thẩm định kỹ thuật và quyền phê duyệt phát hành tách biệt tuyệt đối. `$test` không tự động ban hành `RELEASE_ACCEPTED`.

### 9.2. Verification Depth & Adaptive Verification Ladder
* **Độ Sâu Kiểm Chứng Nội Bộ**: Tự động ánh xạ `FAST ➔ TARGETED`, `STANDARD ➔ STANDARD`, `CRITICAL ➔ DEEP`. Chỉ được nâng bậc (`escalate`), cấm tự ý hạ bậc.
* **Nguyên Tắc**: *Độ sâu xác định mức độ kỹ lưỡng, không phải nghi thức cứng nhắc (`Depth determines scrutiny, not ritual`)*.
* **Thang Kiểm Chứng Thích Ứng 8 Bậc (L0 đến L7)**:
  - `L0`: Baseline / Integrity (Kiểm tra frozen RC, môi trường sạch).
  - `L1`: Syntax / Build / Static Analysis (Compile, lint, type check độc lập).
  - `L2`: Unit / Component (Hàm vi mô, linh kiện UI cô lập).
  - `L3`: Integration / Contract (Kiểm tra khế ước API & Design).
  - `L4`: Runtime / E2E (Kiểm thử thực thi luồng người dùng).
  - `L5`: Data / Migration / Security (Sandbox cô lập, cấm chạm prod data).
  - `L6`: Visual / Accessibility / Performance (CDP screenshot, WCAG AA, Generic-AI risk).
  - `L7`: Adversarial / Edge / Recovery (Bơm lỗi, kiểm tra phục hồi).

### 9.3. Findings Model & 4 Independent Test Verdicts
* **Findings Model**: Mọi sai lệch được đóng gói theo `finding` có cấu trúc rõ ràng:
  - `defect_type`: Cái gì bị hỏng (`CONTRACT_VIOLATION` | `REGRESSION` | `RUNTIME_CRASH` | `VISUAL_DEFECT` | `SECURITY_DATA_RISK` | `UNMET_CRITERIA`).
  - `likely_failure_class`: Thuộc tầng nào theo phân loại chuẩn Phase B để phân bổ trách nhiệm (`IMPLEMENTATION_DEFECT` | `SPEC_DEFECT` | `ARCHITECTURE_DEFECT` | `ENVIRONMENT_DEFECT` | `EXTERNAL_DEPENDENCY` | `DESIGN_DIRECTION_DEFECT`).
* **4 Phán Quyết Độc Lập**:
  - **`TEST_PASS`**: Toàn bộ kiểm tra thẩm định **bắt buộc và đã được lựa chọn** (`REQUIRED & SELECTED`) đều vượt qua, mọi bậc thang bị lược bỏ có lý do kỹ thuật chính đáng, không còn finding nghiêm trọng.
  - **`TEST_PASS_WITH_FINDINGS`**: Điều kiện nghiệm thu chính độc lập đạt, chỉ còn minor/info findings, rủi ro tồn đọng được ghi nhận tường minh.
  - **`TEST_FAIL`**: Có điều kiện nghiệm thu bắt buộc bị bác bỏ, hoặc phát hiện lỗi hợp đồng/an toàn nghiêm trọng. Dừng lại (`STOP`), khóa handoff.
  - **`TEST_BLOCKED`**: Môi trường không khả dụng hoặc baseline mơ hồ. Tuyệt đối không fake pass.

### 9.4. Auto-Fix Clamp & Controlled Repair Protocol
* **Khóa Chặt Auto-Fix (`AUTO_FIX = FALSE`)**: Khi phát hiện lỗi $\to$ Xuất finding $\to$ Báo cáo $\to$ Dừng lại. Cấm tự ý sửa code.
* **Controlled Repair Chỉ Khi Được Anh Cấp Phép (`AUTHORIZE_CONTROLLED_REPAIR`)**:
  - **Phân Tách Vai Trò**: `Tester != Repair Owner`. Tester chỉ thẩm định; Repair Owner là Developer riêng biệt.
  - **Ngân Sách Sửa Chữa**: `MAX_CONTROLLED_REPAIR_ROUNDS = 2`.
  - **Quy Trình Thẩm Định Lại (Fresh Re-Audit)**: Phiên thẩm tra lại chạy trên fresh context, coi `RC_n+1` là untrusted.
  - Sau 2 vòng sửa mà vẫn lỗi $\to$ **Dừng ngay lập tức**, phân loại nguyên nhân (`ARCHITECTURE_DEFECT`, `SPEC_DEFECT`), báo cáo ngắt mạch lên Anh. Tuyệt đối không có vòng thứ 3.

### 9.5. Tách Biệt Quyền Thẩm Định & Quyền Phát Hành (Release Authority Separation)
* `$test` chỉ xác nhận trạng thái kỹ thuật (`VERIFIED_RC` hoặc `VERIFIED_RC_WITH_RESIDUAL_RISK`).
* Hệ thống chuyển sang trạng thái chờ con người phê duyệt: `AWAITING_HUMAN_ACCEPTANCE`.
* Chỉ có quyết định trực tiếp từ Anh mới được chuyển thành **`RELEASE_ACCEPTED`**.

---

## 10. Vòng đời Trạng thái V2 Hoàn chỉnh (End-to-End State Machine)

```text
[USER_REQUEST]
      │
      ▼
  [CLASSIFY] ──(Risk Engine & Design Impact)──> (Mode: F/S/C, Design: NONE/MAINT/DIR)
      │
      ├──── if DESIGN_DIRECTION ──> [REFERENCE_INTELLIGENCE]
      │                                    │
      │                                    ▼
      │                             [DESIGN_DIRECTOR] ──> (3 Divergent Directions)
      │                                    │
      │                                    ▼
      │                             [HUMAN_ART_DIRECTION_GATE]
      │                                    │ (Approved)
      │                                    ▼
      │                             [DESIGN_CONTRACT_LOCKED]
      │                                    │
      │                                    ▼
  [PLANNING] ◄────────────────── [MCP_CAPABILITY_ROUTING]
      │
      ▼
[HUMAN_GATE?] ──(Bắt buộc nếu mode == CRITICAL)
      │
      ▼
  [DELIVERY] ──(Design Engineer implements within Contract)
      │
      ▼
[DEV_SELF_VERIFICATION] ──(Mode-aware Profile & Render Screenshot)
      │
      ├── Visual Work? ── YES ──> [VISUAL_CRITIC] ──(Pass)
      │                                  │ (Fail <= 2 cycles)
      │                                  ▼
      │                           [POLISH_OR_RETURN_TO_DIRECTION]
      ▼
[ACCEPTANCE_EVIDENCE_MAPPING] ──(AC ↔ Evidence traceability)
      │
      ▼
[EVIDENCE_LEDGER_EMITTED]
      │
      ▼
[BASELINE_FROZEN]
      │
      ▼
[AWAITING_EXPLICIT_TEST]
      │
      │ Explicit $test command from Anh
      ▼
[INDEPENDENT_AUDIT_PLAN] (AUDIT_ONLY: source_write=false, artifact_write=true)
      │
      ▼
[EXECUTE_LADDER] (Adaptive Depth: TARGETED / STANDARD / DEEP)
      │
      ├────────────────────────┬─────────────────────────┐
      ▼                        ▼                         ▼
 [TEST_PASS]        [PASS_WITH_FINDINGS]         [TEST_FAIL / BLOCKED]
      │                        │                         │
      ▼                        ▼                         ▼
[VERIFIED_RC]    [VERIFIED_RC_WITH_RESIDUAL_RISK]   [REPORT_FINDINGS_AND_STOP]
      │                        │                         │
      └───────────┬────────────┘                         ▼
                  │                            [HUMAN_AUTH_REPAIR?]
                  ▼                                      │ (No: STOP)
     [AWAITING_HUMAN_ACCEPTANCE]                         ▼ (Yes: <= 2 rounds)
                  │                            [SEPARATE_REPAIR_OWNER]
        ┌─────────┴─────────┐                            │ (RC_n+1)
        ▼                   ▼                            ▼
 [APPROVE_BY_HUMAN]   [HOLD / REJECT]          [FRESH_INDEPENDENT_RE_AUDIT]
        │                   │
        │                   ▼
        │            [STOP / REPLAN / ESCALATE]
        │                   │
        └─────────┬─────────┘
                  │ (Both Success & Failure paths captured)
                  ▼
       [LEARNING_SIGNAL_CHECK] (Success: Pattern/Insight | Failure: Defect/Friction)
                  │
                  ├── No Signal ──> [FINISHED]
                  │
                  ▼
       [LEARNING_EVENT_EMITTED] (Sanitized: Secrets & PII removed)
                  │
                  ▼
       [REPETITION_&_SCOPE_ANALYSIS] ──(Weak pattern)──> [ARCHIVE]
                  │
                  ▼ (Heuristic: >= 2-3 contexts triggers review, NOT auto-promotion)
       [LEARNING_CANDIDATE] (Tri-State: RECORD -> ACTIVATE_LOCAL -> PROMOTE_GLOBAL)
                  │
                  ├── Project Scope ──> [RECORD] (Local repo candidate)
                  │
                  ├── Domain Scope ──> [RECORD] ──(Domain Review)──> [ACTIVATE_DOMAIN]
                  │
                  ▼ (If GLOBAL Candidate)
       [READY_FOR_PROMOTION_REVIEW]
                  │
                  ▼
       [HUMAN_PROMOTION_GATE] (Anh: APPROVE / APPROVE_WITH_CHANGES / REJECT)
                  │
             ┌────┴────┐
             ▼         ▼
          [PROMOTE] [REJECT]
             │         │
             ▼         ▼
          [REGISTRY] [ARCHIVED]
```

---

## 11. Phân hệ Tự Học & Tối Ưu Năng Lực Có Kiểm Soát (Governed Continuous Learning Engine)

Vận hành như một phân hệ nội bộ của framework (Internal Engine — **không tạo lệnh public `$learn`**, giữ nguyên 4 lệnh public `$plan`, `$dev`, `$test`, `$design`):

### 11.1. Core Invariants
1. **`INV-E01 — No Autonomous Global Mutation`**: Framework tuyệt đối KHÔNG tự ý chỉnh sửa `user_global`, `dynamic-project-system.md`, global rules, hoặc global skills dựa trên quan sát đơn lẻ. Mọi thăng hạng toàn cục (`GLOBAL`) bắt buộc phải có lệnh chấp thuận tường minh từ Anh (Product Owner).
2. **`INV-E02 — Observation != Rule`**: Một quan sát thành công hay thất bại đơn lẻ KHÔNG PHẢI là quy tắc toàn cục. Bắt buộc phải trải qua kiểm chứng lặp lại (`Repetition >= 2-3 contexts`) và xác thực phản ví dụ (`Counterexample check`).
3. **`INV-E03 — Project Aesthetic Isolation`**: Mỹ cảm và phong cách cụ thể của một dự án (như *Editorial Swiss Specimen*) KHÔNG ĐƯỢC tự động thăng hạng thành quy chuẩn toàn cục cho toàn bộ các dự án khác. Chỉ được trích xuất các nguyên lý quy trình phổ quát (như Art Direction Gate, Signature Specimen requirement, Screenshot validation).
4. **`INV-E04 — Evidence-Backed Learning`**: Mọi đề xuất học hỏi phải gắn liền với Sổ cái Bằng chứng (`Evidence Ledger`), Bằng chứng Thẩm định độc lập (`Test Evidence`), Visual Review, hoặc Quyết định của Con người.
5. **`INV-E05 — Human Promotion Gate`**: Thăng hạng toàn cục bắt buộc phải có quyết định trực tiếp: `APPROVE`, `APPROVE_WITH_CHANGES`, hoặc `REJECT`.
6. **`INV-E06 — Reversible Promotion`**: Mọi quy tắc/kỹ năng được thăng hạng bắt buộc phải có kế hoạch thu hồi (`rollback_plan`), số phiên bản (`version`), và lịch sử bằng chứng (`evidence_history`).
7. **`INV-E07 — Secret Sanitization`**: Tuyệt đối lọc sạch toàn bộ secrets, API tokens, credentials, và dữ liệu cá nhân trước khi ghi vào log sự kiện học hỏi.
8. **`INV-E08 — Dual-Path Signal Capture`**: Tự học không chỉ diễn ra khi thành công (`RELEASE_ACCEPTED`) mà bắt buộc phải thu thập bài học từ cả các luồng thất bại và ma sát (`TEST_FAIL`, `TEST_BLOCKED`, `REJECTED`, `ESCALATED`, `ROLLED_BACK`).

### 11.2. Mô Hình Phân Cấp 4 Tầng Phạm Vi (4-Tier Scope Model)
* **`TASK`**: Ngắn hạn trong 1 micro-sprint, không lưu trữ dài hạn.
* **`PROJECT`**: Lưu trữ tại `.project/learning/` trong repo cục bộ.
* **`DOMAIN`**: Áp dụng cho một nhóm dự án tương đồng (ví dụ: Visual Web, Agent Workflow).
* **`GLOBAL`**: Áp dụng cho toàn bộ Framework V2, chỉ được ban hành khi có Human Gate duyệt.
* **Nguyên Tắc**: *Luôn ưu tiên phạm vi hẹp nhất chính xác với bằng chứng (`Narrowest Valid Scope First`)*.

### 11.3. Chu Trình Ba Trạng Thái: RECORD vs ACTIVATE vs PROMOTE
Hệ thống phân định rạch ròi 3 trạng thái của một thực thể học hỏi:
1. **`RECORD` (Ghi nhận)**: Ghi lại Learning Event hoặc Learning Candidate trong `registry.yaml` ở trạng thái quan sát/đề xuất (`status: CANDIDATE`). Chưa có hiệu lực thi hành.
2. **`ACTIVATE` (Kích hoạt cục bộ)**: Kích hoạt trong phạm vi hẹp (`PROJECT` hoặc `DOMAIN`) sau khi được chủ sở hữu domain kiểm duyệt. **Ứng viên Domain tuyệt đối không tự động kích hoạt chéo domain hoặc toàn cục**.
3. **`PROMOTE` (Thăng hạng toàn cục)**: Nâng cấp thành Invariant/Skill phổ quát toàn hệ thống. **Bắt buộc 100% phải qua Human Promotion Gate của Anh**.

* **Ngưỡng Kích Hoạt Đánh Giá (Heuristic Review Trigger)**: Ngưỡng quan sát 2 projects hoặc 3 contexts chỉ là một **heuristic để đưa ứng viên vào diện xem xét (`READY_FOR_PROMOTION_REVIEW`)**, TUYỆT ĐỐI KHÔNG PHẢI là luật tự động thăng hạng (`No Auto-Promotion Rule`).
* **Skill Extraction vs Long Prompt**: Không tự động tạo kỹ năng mới chỉ vì một prompt dài. Kỹ năng mới đòi hỏi workflow đa bước, công cụ chuyên biệt, và không trùng lặp với các kỹ năng sẵn có.
* **Defect to Test Promotion**: Các lỗi tái hiện lặp lại được chuyển hóa thành các bài kiểm thử hồi quy chuẩn tắc (`Regression Test Promotion`).

### 11.4. Tối Ưu Hóa Định Tuyến Khả Năng (Capability Registry Optimization)
* Ghi nhận lịch sử tương thích giữa công cụ/skill và miền nghiệp vụ (ví dụ: GSAP tối ưu cho scroll choreography nhưng gây dư thừa cho màn hình CRUD tĩnh).
* Đưa ra khuyến nghị mang tính **Cố Vấn (`Advisory Only`)** trong pha `$plan`, không bật/tắt công cụ một cách cưỡng chế.

### 11.5. Xử Lý Mâu Thuẫn & Thu Hồi (Contradiction & Deprecation)
* Khi phát hiện bằng chứng mới xung đột với quy tắc cũ, hệ thống **tuyệt đối không tự ý ghi đè**.
* Đánh dấu cờ mâu thuẫn (`CONTRADICTION_FLAG`), đóng băng cả 2 bằng chứng và trình lên Anh (Product Owner) đưa ra quyết định kiến trúc.


