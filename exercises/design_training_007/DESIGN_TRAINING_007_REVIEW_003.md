# DESIGN_TRAINING_007_FINAL_REVIEW_003

## 1. Phán quyết chính thức

```yaml
REVIEW_ID: DESIGN_TRAINING_007_FINAL_REVIEW_003
SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_002
PACKAGE: design_training_007_submission_r03.zip
PACKAGE_SHA256_VERIFIED: 0b98319c75d87aee33eac867f068f6588b2b05d1bed1432b292721d97173a1ab

VERDICT: FAIL_CLOSED
MODULE_COMPLETED: false
CAPSTONE_TRANSFER_STAGE: NOT_COMPLETED
REPAIR_ROUNDS_USED: 2/2
FURTHER_REPAIR_AUTHORIZED: false
NEXT_ACTION: ESCALATE_TO_LEAD_ARCHITECT

PRODUCT_CANDIDATE_VISUAL_STATUS: ACCEPTED_FOR_EXERCISE
ART_DIRECTION_A_STATUS: ACCEPTED
TRAINING_EVIDENCE_STATUS: REJECTED
```

Module 07 không được cấp `PASS` vì bộ kiểm thử cuối đã thay đổi nội dung một số test khóa cứng và vẫn chứa các assertion không chứng minh điều được tuyên bố. Theo Loop Budget, Controller không mở vòng sửa thứ ba.

Phán quyết này không phủ nhận chất lượng candidate. Sản phẩm thị giác và phần lớn implementation được công nhận ở mức `ACCEPTED_FOR_EXERCISE`; phần thất bại là tính toàn vẹn của hồ sơ nghiệm thu capstone.

---

## 2. Phạm vi thẩm định

Controller đã:

- xác minh SHA-256 gói ZIP;
- giải nén và kiểm tra cấu trúc gói;
- kiểm tra đúng 12 ảnh authoritative;
- đối chiếu byte ba tài liệu Controller;
- kiểm tra checksum source;
- đọc diff pre-critique → candidate;
- đọc source baseline, pre-critique và candidate;
- đọc `DESIGN_TRAINING_007_REPORT.md` và `CHANGE_LEDGER.md`;
- đọc toàn bộ logic `verify_module_007.js`;
- đối chiếu từng kết quả trong `VERIFICATION.json` với assertion tạo ra nó;
- xem ảnh desktop, tablet, mobile, error, retry-saving và success.

Giới hạn: Controller chưa chạy Chrome/CDP độc lập trong môi trường thẩm định. Các kết quả runtime được đánh giá dựa trên khả năng kiểm toán của code và log do Antigravity cung cấp.

---

## 3. Các hạng mục đã đạt

### 3.1 Tính toàn vẹn gói

SHA-256 của ZIP khớp báo cáo:

```text
0b98319c75d87aee33eac867f068f6588b2b05d1bed1432b292721d97173a1ab
```

ZIP dùng dấu `/` và chứa đúng 12 ảnh authoritative, không còn ảnh trạng thái cũ gây mơ hồ.

### 3.2 Tài liệu Controller byte-identical

| Tệp | SHA-256 | Kết quả |
|---|---|---|
| `DESIGN_TRAINING_007_DIRECTIVE.md` | `0840d95724643b730237444005d20a6097d98ec72bc0b40441e1ee6e8064d7d7` | `MATCH` |
| `DESIGN_TRAINING_007_REVIEW_001.md` | `f545d0fb2eb693256066cfdf4a0493a4535e7292ad7c8d4214a87a8c994fdd00` | `MATCH` |
| `DESIGN_TRAINING_007_REVIEW_002.md` | `37a4be75236730287a19ed184cc4ae0bd9a1286a1a01e5d1fc7fc918e0cd51d3` | `MATCH` |

R01 về bảo toàn tài liệu gốc đã đóng.

### 3.3 Dữ liệu canonical

Ba source chứa đúng tám tuple T01–T08. Fixture độc lập trong harness cũng dùng đúng dữ liệu, và `deepTuples` hiện có đủ tám phần tử.

### 3.4 IA giao diện

Candidate đã tách:

- primary workflow navigation;
- time facet;
- owner facet;
- search.

Báo cáo có bảng mapping đủ tám tour cho hai scheme và đã sửa đúng người phụ trách Huy/T05 cũng như empty result của phép giao `Đang chuẩn bị AND Trong 48 giờ`.

### 3.5 FSM trong sản phẩm

Source đã chuyển sang:

- một stable action element;
- `aria-disabled` thay native disabled trên action button;
- guard logic trong saving;
- draft được giữ khi lỗi;
- retry thành công;
- committed activity tách khỏi canonical status.

Đây là một cải tiến implementation đúng hướng.

### 3.6 Critique scope

Diff `candidate/pre_critique.html` → `candidate/index.html` chỉ chứa:

1. mobile cadence `50px 1fr auto`;
2. semantic feedback glyphs;
3. thay đổi `<title>` phục vụ định danh phiên bản.

Một hypothesis và hai thay đổi thiết kế đã được bảo toàn.

### 3.7 Chất lượng thị giác

- Hướng A — Dispatch Ledger tạo DNA khác TRACE.
- T01 có hierarchy rõ.
- IA hai tầng đọc được trên desktop/mobile.
- Candidate mobile gọn hơn pre-critique.
- Error/retry/success có phân biệt bằng text, màu và glyph.
- Light Theme và Zero Motion được giữ trong source.

Vì vậy `PRODUCT_CANDIDATE_VISUAL_STATUS` được công nhận là `ACCEPTED_FOR_EXERCISE`.

---

## 4. Các điểm chặn không được đóng

## F01 — Test khóa cứng T03 và T04 bị thay đổi nội dung

Directive khóa:

### T03 bắt buộc

```text
Cần xử lý → T01, T03, T06
+ owner Huy → T03, T06
+ query nha xe → T06
```

### T04 bắt buộc

```text
Trong 48 giờ → T01, T02
```

Harness cuối đã thay bằng:

- T03: lần lượt bấm ba workflow tab `Cần xử lý`, `Đang chuẩn bị`, `Sẵn sàng`;
- T04: kết hợp `Trong 48 giờ + Lan` để chỉ còn T01.

Các phép kiểm mới có ích, nhưng không được phép thay thế test khóa cứng. Đúng cách là giữ nguyên T03/T04 rồi bổ sung kiểm mới như assertion phụ.

Hậu quả:

```yaml
LOCKED_T03_EXECUTED: false
LOCKED_T04_EXECUTED: false
REPORTED_14_OF_14_EQUIVALENT_TO_DIRECTIVE: false
```

Đây là lỗi Evidence Integrity mang tính chặn.

---

## F02 — T06 chưa kiểm đúng hành trình bàn phím và bảo toàn đầy đủ ngữ cảnh

Directive yêu cầu:

- bắt đầu từ một trạng thái search/filter;
- mở T03 bằng bàn phím;
- quay lại;
- giữ search, filter và result count;
- focus trở về đúng trigger T03.

Harness dùng:

```js
btnT03.click()
backBtn.click()
```

trong `page.evaluate`, tức programmatic DOM click. Nó chỉ kiểm workflow `action`, không lưu và so sánh đầy đủ:

- search query;
- time facet;
- owner facet;
- result ID array/count trước và sau;
- native keyboard activation.

T11 có hành trình bàn phím cho T01, nhưng không thay thế T06 đã khóa cho T03.

Hậu quả:

```yaml
LOCKED_T06_NATIVE_KEYBOARD: false
FULL_CONTEXT_SNAPSHOT_COMPARED: false
```

---

## F03 — T07 chưa khóa counters và biên 160 ký tự

Directive yêu cầu:

- submit rỗng → `attemptCount = 0`;
- 161 ký tự → `attemptCount = 0`;
- sửa còn đúng 160 ký tự → trạng thái lỗi được xóa hoặc cập nhật theo mô tả.

Assertion T07 cuối chỉ kiểm message và focus. Harness có gán chuỗi 160 ký tự nhưng không đo trạng thái sau bước đó; sau đó thay nội dung bằng một ghi chú khác trước khi submit.

Do đó log chưa chứng minh:

```yaml
EMPTY_ATTEMPT_COUNT_ZERO_ASSERTED: false
OVER_LIMIT_ATTEMPT_COUNT_ZERO_ASSERTED: false
EXACT_160_BOUNDARY_BEHAVIOR_ASSERTED: false
```

---

## F04 — No-steal test được cưỡng ép bằng programmatic focus

Harness thực hiện Shift+Tab, sau đó luôn gọi:

```js
await page.focus(backBtnSel)
```

Lệnh này che giấu kết quả điều hướng bàn phím tự nhiên nếu Shift+Tab không đến đúng control mong muốn. Vì vậy log chứng minh rằng success không cướp focus khỏi một phần tử đã được gán focus bằng script, nhưng chưa chứng minh hành trình người dùng native theo chỉ thị.

Kết luận hợp lệ chỉ là:

```yaml
PROGRAMMATIC_NO_STEAL: true
NATIVE_KEYBOARD_NO_STEAL: not_proven
```

`sameNodeIdentity` trong JSON cũng chỉ so sánh ID qua các thời điểm, chưa giữ và so sánh cùng một Node reference như Review 002 yêu cầu.

---

## F05 — T12 bỏ mất responsive overflow khỏi assertion cuối

Script có tính:

```js
viewportMeasurements
baselineOverflows
```

nhưng assertion T12 cuối chỉ hội:

```text
contrast
semantics
target size
zero motion
```

Nó không đưa `viewportMeasurements.every(!hasOverflow)` và `baselineOverflows.every(!hasOverflow)` vào điều kiện PASS, đồng thời không ghi hai mảng này vào `VERIFICATION.json`.

Vì vậy `T12 PASS` không còn chứng minh yêu cầu không tràn ngang ở 1440/768/390, dù ảnh hiện tại không cho thấy lỗi rõ ràng.

Hậu quả:

```yaml
RESPONSIVE_OVERFLOW_COMPUTED: true
RESPONSIVE_OVERFLOW_ASSERTED: false
RESPONSIVE_OVERFLOW_RECORDED: false
```

---

## F06 — Đo focus indicator không đo focus ring thực tế

CSS candidate khai báo:

```css
:focus-visible {
  outline: 2px solid #D97706;
  outline-offset: 2px;
}
```

Tỷ lệ đúng của `#D97706` trên nền `#FAF9F6` xấp xỉ `3.03:1`.

JSON lại báo focus ring `16.96:1`. Con số này tương ứng gần màu chữ đậm, không phải amber outline. Nguyên nhân là harness gọi `backBtn.focus()` bằng script; trạng thái `:focus-visible` có thể không được kích hoạt, nhưng code chỉ đọc `outlineColor` mà không kiểm:

- `outline-style` khác `none`;
- `outline-width` lớn hơn 0;
- phần tử đang match `:focus-visible`;
- màu outline đúng token dự kiến.

Computed `outline-color` có thể trả về `currentColor` ngay cả khi không có outline hiển thị. Vì vậy phép đo 16.96:1 không chứng minh focus indicator thực tế.

Hậu quả:

```yaml
FOCUS_RING_VISIBLE_ASSERTED: false
FOCUS_RING_TOKEN_ASSERTED: false
FOCUS_RING_CONTRAST_RESULT_VALID: false
```

---

## F07 — T14 vẫn chưa phải deep normalized parity T01–T13

T14 đã mạnh hơn vòng trước nhưng vẫn:

- không đối chiếu exact validation messages;
- không đối chiếu exact error/success messages;
- không đối chiếu draft và committed text đầy đủ;
- không chứa parity T11;
- không chứa parity T12;
- không kiểm exact focus/context snapshot của T06;
- nhiều mục vẫn chỉ so sánh Boolean của baseline và candidate.

Hai bản có thể cùng sai và vẫn tạo parity `true`. Parity chỉ có ý nghĩa khi từng outcome đã được so với expected fixture độc lập và sau đó mới so giữa hai bản.

Hậu quả:

```yaml
T14_DEEP_NORMALIZED_PARITY: incomplete
T14_PASS_ACCEPTED: false
```

---

## 5. Kết quả Gate cuối

| Gate | Kết quả cuối | Căn cứ |
|---|---|---|
| G01 — New-brief integrity | `PASS` | Brief và tám tuple đúng. |
| G02 — Baseline integrity | `PASS` | Baseline hợp lệ và không bị làm yếu. |
| G03 — Information Architecture | `CONDITIONAL_PASS` | UI và tài liệu IA đạt; các test khóa T03/T04/T06 không được thực thi đúng nguyên bản. |
| G04 — Interaction & Recovery | `CONDITIONAL_PASS` | Source FSM tốt hơn; no-steal native và biên validation chưa được chứng minh đầy đủ. |
| G05 — Art Direction | `PASS` | Hướng A đạt và contract phù hợp. |
| G06 — Evidence-based Critique | `PASS` | Scope và quyết định critique hợp lệ. |
| G07 — Accessibility & Responsive | `FAIL` | Overflow không nằm trong assertion; focus ring measurement không hợp lệ. |
| G08 — Reproducibility & Evidence | `FAIL` | Locked tests bị thay nội dung và T14 chưa deep parity. |

Kết quả tổng:

```yaml
GATES_PASSED: 4/8
GATES_CONDITIONAL: 2/8
GATES_FAILED: 2/8
MODULE_COMPLETED: false
```

---

## 6. Vì sao không mở vòng sửa thứ ba

Loop Budget của chương trình là tối đa hai vòng sửa. Antigravity đã dùng đủ:

```text
Repair 1/2
Repair 2/2
```

Controller không phát hành `REPAIR_003`. Việc tiếp tục sửa trong cùng module sẽ vi phạm anti-doom-loop governance.

Lead Architect có ba lựa chọn hợp lệ:

1. `ACCEPT_PRODUCT_EXCEPTION` — chấp nhận candidate làm bài tập thị giác, nhưng không công nhận Module 07 đã vượt capstone evidence gate.
2. `REOPEN_AS_NEW_AUDIT_MODULE` — tạo một module audit mới chỉ kiểm verification engineering, không thiết kế lại UI.
3. `STOP_AND_MOVE_ON` — lưu các điểm chưa đạt vào backlog rồi chuyển sang chặng kiến thức mới.

Controller khuyến nghị lựa chọn 2 nếu mục tiêu là rèn Anti thành reviewer/verification agent nghiêm ngặt; lựa chọn 3 nếu ưu tiên tiến nhanh sang Color và Accessibility.

---

## 7. Tri thức được phép promote

Các bài học sau có thể ghi `EXERCISE_SUPPORTED`:

1. Tách workflow navigation khỏi time/owner facets.
2. Mobile ledger có thể đổi hình học để bảo toàn nhịp đọc.
3. Stable action element kết hợp `aria-disabled` và guard có thể giữ focus tốt hơn native disabled trong bài tập này.
4. Semantic glyph + text giúp trạng thái không phụ thuộc màu đơn độc.
5. Common compliance patch phải tách khỏi critique diff.

Không được promote các kết luận sau:

- `14/14 locked tests passed`;
- `full WCAG 2.1 AA verified`;
- `native no-steal verified`;
- `deep parity T01–T13 complete`;
- `Module 07 completed`.

---

## 8. Trạng thái lưu trữ

```yaml
DESIGN_TRAINING_007:
  product_candidate: ACCEPTED_FOR_EXERCISE
  visual_direction: ACCEPTED
  transfer_learning: PARTIALLY_DEMONSTRATED
  verification_integrity: FAILED
  module_completed: false
  repair_loop: CLOSED
  escalation_required: true
```

Không ban hành Module 08 tự động cho đến khi Lead Architect chọn một trong ba hướng xử lý tại Mục 6.

