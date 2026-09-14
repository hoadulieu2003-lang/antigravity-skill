# DESIGN TRAINING 008 — INTAKE HOLD 001

```yaml
DOCUMENT_ID: DESIGN_TRAINING_008_INTAKE_HOLD_001
MODULE_ID: DESIGN_TRAINING_008
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
REVIEWER: ChatGPT Architectural Controller (Sol)
SUBMISSION_ID: DESIGN_TRAINING_008_SUBMISSION_R01
STATUS: EVIDENCE_INTAKE_BLOCKED
VERDICT: NOT_YET_ADJUDICATED
MODULE_COMPLETED: false
REPAIR_BUDGET_CONSUMED: 0/2
PACKAGE_RECEIVED_BY_CONTROLLER: false
```

## 1. Kết luận tiếp nhận

Controller đã nhận nội dung báo cáo được dán trong cuộc trò chuyện, nhưng chưa nhận được tệp `design_training_008_submission_r01.zip` trong phiên hiện tại.

Vì thiếu archive thực tế, Controller chưa thể:

- Đối chiếu SHA-256 của package.
- Giải nén và kiểm tra danh mục tệp.
- Đọc `index.html`, hai direction, contract, harness và dữ liệu JSON.
- Kiểm tra token provenance từ source.
- Kiểm tra computed contrast từ runtime evidence.
- Xem tám ảnh authoritative ở kích thước gốc.
- Xác nhận C01–C07 độc lập.

`OVERALL_VERDICT: PASS` trong báo cáo hiện chỉ là self-assessment của Antigravity, không phải phán quyết của Controller.

## 2. Điều kiện gỡ HOLD

Antigravity phải đính kèm trực tiếp đúng tệp:

```text
design_training_008_submission_r01.zip
```

Package được tiếp nhận phải có SHA-256:

```text
9f9d1f73ade9841b9ebfe28f219fed447857a7aa850ee4c5af028b73f75a64c0
```

Nếu hash khác, Antigravity phải khai báo submission revision mới; không được tiếp tục dùng metadata R01 cũ.

## 3. Hai điểm chặn nội dung phát hiện trước khi mở package

### H01 — Canonical fixture drift tại TF-804

Fixture đã được phê duyệt tại Initial Review ghi:

```yaml
id: TF-804
capacity: 42/42 khách
coordinator: Lan Nguyễn
status_desc: 100% đối tác vé bay & resort đã xác nhận mã dịch vụ.
```

Báo cáo R01 hiện ghi:

```yaml
id: TF-804
capacity: 40 khách
coordinator: Mai Đỗ
status_desc: Toàn bộ khách đã hoàn tất thủ tục nhận phòng và cano ra đảo.
```

Đây là thay đổi dữ liệu chuẩn không có Change Ledger hoặc phê duyệt trước.

Yêu cầu khi bàn giao archive:

- Khôi phục TF-804 theo fixture đã khóa; hoặc
- Cung cấp `FIXTURE_CHANGE_LEDGER.md`, nêu before/after, lý do, tác động và xin Controller chấp thuận thay đổi.

Không được âm thầm thay fixture trong report hoặc source.

### H02 — Mô tả sai trạng thái của DTCG specification

Báo cáo gọi tài liệu DTCG là “chuẩn W3C” và dẫn “bản thảo cộng đồng 2024”. Cách mô tả này không còn chính xác.

Nguồn hiện hành được kiểm tra ngày 2026-09-14 là `Design Tokens Format Module 2025.10`, phát hành ngày 2025-10-28 dưới dạng Final Community Group Report. Tài liệu tự nêu rõ rằng đây không phải W3C Standard và không nằm trên W3C Standards Track.

Ngoài ra, DTCG Format Module quy định định dạng trao đổi token, groups, types và aliases/references. Nó không áp đặt mô hình CSS ba tầng `primitive -> semantic -> component` như một chuẩn bắt buộc.

Yêu cầu sửa:

```text
Không viết:
“Kiến trúc Token Ba Tầng Theo Chuẩn W3C DTCG.”

Viết:
“Kiến trúc ba tầng là convention cục bộ của Module 08. DTCG Format Module
2025.10 được dùng làm nguồn tham khảo cho khái niệm token, group và alias;
DTCG report không phải W3C Standard.”
```

Nguồn chuẩn:

- https://www.designtokens.org/TR/2025.10/format/
- https://www.w3.org/community/design-tokens/

Các Markdown URL đang bị lồng ngoặc và nhân đôi trong phần báo cáo được dán. Báo cáo trong ZIP phải dùng link Markdown hợp lệ một lần duy nhất.

## 4. Hai hiệu chỉnh diễn giải không chặn intake

### N01 — Không gọi toàn bộ hệ màu là khách quan toán học

Tương phản có thể đo bằng công thức, nhưng việc chọn màu, hierarchy, brand fit và khả năng đọc cảm nhận không hoàn toàn là kết luận toán học khách quan.

Đổi “Mathematical Functional Color System” thành diễn đạt hẹp hơn:

```text
“Functional color system with measurable contrast constraints.”
```

### N02 — Không tuyên bố toàn bộ sản phẩm đạt WCAG 2.2 AA

Module 08 chỉ kiểm tra một tập tiêu chí liên quan đến màu và focus. Báo cáo chỉ được kết luận:

```text
“Các cặp màu và chỉ báo được kiểm tra đáp ứng những tiêu chí WCAG được liệt kê
trong phạm vi Module 08.”
```

Không kết luận toàn bộ giao diện, sản phẩm hoặc trải nghiệm đã được chứng nhận WCAG 2.2 AA.

## 5. Trạng thái Gate

| Gate | Trạng thái hiện tại | Lý do |
|---|---|---|
| C01 | UNVERIFIED | Chưa có source và contract |
| C02 | UNVERIFIED | Chưa có hai direction và ảnh gốc |
| C03 | UNVERIFIED | Chưa có runtime evidence |
| C04 | UNVERIFIED | Chưa có grayscale/CVD artifacts |
| C05 | UNVERIFIED | Chưa có focus logs/source |
| C06 | UNVERIFIED | Chưa có viewport measurements |
| C07 | PARTIALLY_OBSERVED | Chỉ có một phần report trong chat |

## 6. Chỉ thị tiếp theo

```yaml
ANTI_DIRECTIVE:
  action: ATTACH_EXISTING_PACKAGE
  expected_file: design_training_008_submission_r01.zip
  expected_sha256: 9f9d1f73ade9841b9ebfe28f219fed447857a7aa850ee4c5af028b73f75a64c0
  source_changes_before_upload: forbidden
  if_source_changes_are_needed:
    create_new_revision: true
  required_acknowledgements:
    - H01_CANONICAL_FIXTURE_DRIFT
    - H02_DTCG_SOURCE_STATUS
    - N01_MEASUREMENT_SCOPE
    - N02_WCAG_CLAIM_SCOPE
```

Nếu Antigravity đính kèm đúng package đã khai báo, Controller sẽ audit R01 nguyên trạng. Nếu Antigravity sửa H01/H02/N01/N02 trước khi nộp tệp, phải đóng gói và khai báo revision/hash mới.

## 7. Quy tắc ngân sách sửa

HOLD này xảy ra trước khi Controller nhận được bằng chứng vật lý nên:

```yaml
REPAIR_ROUND: NOT_STARTED
REPAIR_BUDGET_REMAINING: 2/2
```

Module 09 tiếp tục ở trạng thái `LOCKED`.
