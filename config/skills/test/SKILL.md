---
name: test
description: Step 3 ($test or $project-verification) — Independently verify and accept a frozen product, design, software, AI/data, automation, document, or content release candidate against defined criteria. Use explicitly for acceptance, release readiness, adversarial testing, or controlled repair; do not use during active production or to auto-fix untriaged findings.
---

# Independent Verification Subsystem (`$test`)

Vận hành như một Cổng Thẩm Định Độc Lập (Independent Verification Gate).
Mặc định: **`AUDIT_ONLY = TRUE`**, **`SOURCE_WRITE_ACCESS = FALSE`**, **`AUDIT_ARTIFACT_WRITE_ACCESS = TRUE`**, **`AUTO_FIX = FALSE`**.
*(Nghiêm cấm sửa đổi mã nguồn sản phẩm `src/`, `lib/`, `config/`; được phép ghi tài liệu thẩm định vào `.test-audit/`, `artifacts/test/`, `scratch/`)*.

```text
Philosophy:
$dev proves its own work.
$test independently attempts to disprove it.
```

---

## 1. Entry Gate & Activation Invariant

* **KÍCH HOẠT TƯỜNG MINH DUY NHẤT (`EXPLICIT_CALL_ONLY = TRUE`)**:
  `$test` **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ ĐỘNG GỌI NGẦM** sau `$plan`, `$dev`, hoặc `$design`. Chỉ kích hoạt khi có chỉ thị trực tiếp từ Anh (Product Owner) hoặc lệnh tường minh.
* **Yêu cầu Đầu vào Bắt buộc**:
  - Bản Release Candidate đã được đóng băng (`baseline.frozen: true`) kèm commit hash/identifier.
  - Bộ tiêu chí nghiệm thu (`Acceptance Criteria`).
  - Sổ cái bằng chứng của developer (`Evidence Ledger` từ `$dev`) — chỉ dùng làm tài liệu tham chiếu đối chiếu, không thay thế kiểm thử độc lập.
* Nếu baseline chưa đóng băng hoặc không xác định được danh tính: Dừng ngay với **`TEST_BLOCKED`**.

---

## 2. Adaptive Verification Depth (Độ Sâu Kiểm Chứng Thích Ứng)

`$test` tự động phân giải độ sâu kiểm chứng nội bộ (không sinh thêm lệnh public):
* **`TARGETED`** (tương ứng `FAST`): Kiểm tra hẹp, tập trung vào diff thực tế, không chạy full suite không liên quan.
* **`STANDARD`** (tương ứng `STANDARD`): Build độc lập, unit/component tests, integration contract checks, runtime smoke test.
* **`DEEP`** (tương ứng `CRITICAL`): Toàn bộ các bậc thang an ninh, kiểm tra di trú dữ liệu độc lập, phân tích pháp y, kiểm thử nghịch đảo (`Adversarial / Fault Injection`), kiểm tra cơ chế ngắt mạch và rollback.

---

## 3. Adaptive Verification Ladder (Thang Kiểm Chứng Thích Ứng 8 Bậc)

Auditor chỉ kích hoạt các bậc thang liên quan trực tiếp đến rủi ro và bề mặt thay đổi (chi tiết tại [references/verification-ladder.md](references/verification-ladder.md)):
* **`L0`** — Baseline / Integrity (Kiểm tra frozen RC, môi trường, snapshot sạch).
* **`L1`** — Syntax / Build / Static Analysis (Compile, lint, type check độc lập).
* **`L2`** — Unit / Component (Thành phần giao diện, hàm vi mô, edge values).
* **`L3`** — Integration / Contract (Kiểm tra ranh giới khế ước API/Design).
* **`L4`** — Runtime / E2E (Kiểm thử thực thi luồng người dùng).
* **`L5`** — Data / Migration / Security (Kiểm tra trong sandbox cách ly, cấm chạm prod data).
* **`L6`** — Visual / Accessibility / Performance (CDP screenshot thực tế, WCAG AA, Generic-AI risk).
* **`L7`** — Adversarial / Edge / Recovery (Bơm lỗi giả lập, ngắt mạng, kiểm tra self-healing).

Mọi bậc thang không chạy bắt buộc phải ghi rõ lý do trong `omitted_ladder` của Audit Plan.

---

## 4. Audit Commission Pod & Fresh-Context Protocol (Hội Đồng Thẩm Định Đa Tác Tử)

Nhằm loại bỏ hoàn toàn thiên kiến xác nhận (`Confirmation Bias`) và phân rã khối lượng kiểm thử chuyên biệt, `$test` vận hành theo cấu trúc **Hội Đồng Kiểm Toán Đa Tác Tử (`Audit Commission Pod`)**:
* **Cơ chế Phân Rã Chuyên Môn Hóa (`Specialized Auditor Subagents`)**:
  - 🛡️ **`Subagent 1 — Logic & Regression Auditor`**: Khởi chạy với `Fresh Context` (chỉ nạp diff, AC và test suite). Chuyên trách L1, L2, L3 (Kiểm toán Logic & Hồi quy): kiểm tra unit test, contract API, rà soát điều kiện biên (`Edge Cases`) và nguy cơ tranh đua dữ liệu (`Race Conditions`).
  - 👁️ **`Subagent 2 — Visual & Accessibility Inspector`**: Chuyên trách L6 (Thanh tra Giao diện, Trợ năng WCAG AA & 60 FPS via Chrome CDP) — Thiết lập cơ chế **Dual Audit (Kiểm toán Kép)**:
    - **Audit 1 (Tiếp cận & Co giãn — WCAG AA & Responsive)**: Kiểm tra nghiêm ngặt độ tương phản `WCAG AA`, tính tiếp cận bàn phím và layout responsive không vỡ trên đa thiết bị qua Chrome CDP.
    - **Audit 2 (Thăng hoa & Tinh xảo — Delight & Craftsmanship Score $\ge 8.5/10$)**: Đo đạc và chấm điểm định lượng `Delight & Craftsmanship Score` bắt buộc $\ge 8.5/10$ (vi tương tác vật lý, spotlight theo con trỏ chuột, cuộn mượt lenis scroll, WebAudioHaptics); kiên quyết từ chối (`REJECT`) và đánh trượt mọi trang web phẳng lì đơn điệu hoặc generic template.
  - 💥 **`Subagent 3 — Adversarial Chaos Reviewer`**: Chuyên trách L7 (Thẩm định Viên Đối kháng & Bơm lỗi Hỗn loạn): đóng vai hacker và người dùng khắc nghiệt, bơm dữ liệu rác, giả lập rớt mạng, kiểm tra khả năng bắt lỗi và tự phục hồi (`Self-Healing / Circuit Breaker`).
  - 🔒 **`Subagent 4 — Security & Vulnerability Scanner`**: Chuyên trách L5 (Rà soát Lỗ hổng & Kiểm toán Quyền truy cập): quét mã độc hại, lỗ hổng injection, kiểm tra quyền truy cập (RBAC/ABAC), rò rỉ bí mật/token credentials và tuân thủ nguyên tắc đặc quyền tối thiểu (`Least Privilege`).
  - ⚡ **`Subagent 5 — Performance & Stress Profiler`**: Chuyên trách L6 (Đo kiểm Độ trễ, Tải trọng & Áp lực Bộ nhớ): đo kiểm độ trễ p95/p99, thông lượng (`Throughput`), rò rỉ bộ nhớ (`Memory Leak`), profiling CPU và hành vi hệ thống dưới áp lực tải cao.
  - 🏛️ **`Subagent 6 — Data Integrity & State Invariant Auditor`**: Chuyên trách L5 (Kiểm chứng Toàn vẹn Dữ liệu & Bất biến Nghiệp vụ): kiểm toán tính nhất quán dữ liệu, chuyển dịch trạng thái (`State Transitions`), ranh giới giao dịch (`Transaction Boundaries`), cơ chế rollback dữ liệu và bất biến nghiệp vụ.
* **Phân Cấp Thẩm Định Thích Ứng Quy Mô (`Task-Adaptive Audit Sizing`)**:
  - **TARGETED (Size S)**: Tác tử Trưởng kiểm toán tự thực thi kiểm chứng nhanh trên diff hẹp (syntax, test suite, log), không dispatch subagent.
  - **STANDARD (Size M)**: Kích hoạt 2–3 Kiểm toán viên độc lập trên `Fresh Context` (Logic & Regression + Visual/Security Inspector).
  - **DEEP (Size L / XL)**: Kích hoạt toàn bộ Hội đồng 6 Kiểm toán viên độc lập đồng thời trong một batch duy nhất (`Simultaneous Batch Dispatch`).
* **Trách nhiệm Tác tử Trưởng Kiểm Toán (`Lead Audit Commissioner — Antigravity`)**:
  - Điều phối bầy subagents kiểm thử qua `invoke_subagent`.
  - Tổng hợp toàn bộ `test_evidence` và các `findings` từ các kiểm thử viên chuyên biệt vào Sổ Cái Bằng Chứng (`Evidence Ledger`).
  - Ban hành Phán Quyết Độc Lập Cuối Cùng (`Independent Verdict`) trình lên Anh (Product Owner).

---

## 5. Test Evidence & Findings Protocol

* Mỗi bước kiểm tra độc lập xuất một bản ghi `test_evidence` (theo mẫu [assets/TEST_EVIDENCE_TEMPLATE.yaml](assets/TEST_EVIDENCE_TEMPLATE.yaml)).
* Bất kỳ lỗi hoặc vi phạm nào phải được đóng gói thành `finding` (theo mẫu [assets/TEST_FINDING_TEMPLATE.yaml](assets/TEST_FINDING_TEMPLATE.yaml)).
* **KHÓA CHẶT AUTO-FIX (`AUTO_FIX = FALSE`)**:
  Khi phát hiện lỗi $\to$ Xuất finding $\to$ Báo cáo $\to$ Dừng lại.
  Tuyệt đối không tự động sửa code.

---

## 6. Controlled Repair Protocol (Quy Trình Sửa Chữa Có Kiểm Soát)

* Chỉ được bắt đầu sửa chữa khi có lệnh tường minh từ Anh: **`AUTHORIZE_CONTROLLED_REPAIR`**.
* **Phân Tách Người Sửa (`Tester != Repair Owner`)**: Kiểm thử viên duy trì vai trò kiểm toán khách quan; người sửa lỗi là Developer riêng biệt.
* **Ngân Sách Sửa Chữa**: Tối đa 2 vòng (`MAX_CONTROLLED_REPAIR_ROUNDS = 2`).
  - Sau mỗi vòng sửa: Đóng băng RC mới $\to$ Auditor độc lập kiểm thử lại từ đầu.
  - Sau 2 vòng vẫn lỗi $\to$ **Dừng ngay lập tức**, phân loại nguyên nhân gốc (`ARCHITECTURE_DEFECT`, `SPEC_DEFECT`), báo cáo ngắt mạch lên Anh. Không có vòng thứ 3.
  (Chi tiết tại [references/controlled-repair.md](references/controlled-repair.md)).

---

## 7. Independent Test Verdicts

Kiểm thử viên độc lập chỉ ban hành đúng 1 trong 4 phán quyết (chi tiết tại [references/findings-and-verdicts.md](references/findings-and-verdicts.md)):
1. **`TEST_PASS`**: Toàn bộ các kiểm tra thẩm định bắt buộc và đã được lựa chọn (`REQUIRED & SELECTED`) đều vượt qua, các bậc thang bị lược bỏ có lý do chính đáng, không còn blocker/critical/major finding.
2. **`TEST_PASS_WITH_FINDINGS`**: Điều kiện nghiệm thu chính độc lập đạt, chỉ còn minor/info findings, rủi ro tồn đọng được ghi nhận tường minh.
3. **`TEST_FAIL`**: Có điều kiện nghiệm thu bị bác bỏ, hoặc phát hiện lỗi hợp đồng/an toàn nghiêm trọng. Dừng và không tự ý vá lỗi.
4. **`TEST_BLOCKED`**: Môi trường không khả dụng hoặc baseline mơ hồ. Tuyệt đối cấm chuyển thành PASS.

---

## 8. Tách Biệt Tuyệt Đối: Quyền Thẩm Định vs Quyền Nghiệm Thu Phát Hành

> **BẤT BIẾN CỐT LÕI**: `$test` chỉ thẩm tra kỹ thuật, TUYỆT ĐỐI KHÔNG TỰ ĐỘNG PHÊ DUYỆT PHÁT HÀNH.
> - `TEST_PASS` $\to$ `VERIFIED_RC` $\to$ `AWAITING_HUMAN_ACCEPTANCE`
> - `TEST_PASS_WITH_FINDINGS` $\to$ `VERIFIED_RC_WITH_RESIDUAL_RISK` $\to$ `AWAITING_HUMAN_ACCEPTANCE`

Chỉ có chỉ thị phê duyệt trực tiếp từ Anh (Product Owner) mới được phép chuyển trạng thái hệ thống sang **`RELEASE_ACCEPTED`**.
