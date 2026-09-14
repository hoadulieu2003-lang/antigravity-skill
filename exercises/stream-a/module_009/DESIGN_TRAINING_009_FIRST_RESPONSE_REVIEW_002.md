# DESIGN TRAINING 009 — FIRST RESPONSE REVIEW 002
## Phê duyệt phụ lục R02 và mở khóa triển khai

```yaml
REVIEW_ID: DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
REVIEW_STAGE: PRE_IMPLEMENTATION_R02
REFERENCE_SUBMISSION: DESIGN_TRAINING_009_FIRST_RESPONSE_R02
REFERENCE_REVIEW: DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
OWNER: "Anh — Lead Architect / Product Owner"
EXECUTOR: "Antigravity"
VERDICT: FIRST_RESPONSE_APPROVED
IMPLEMENTATION_AUTHORIZATION: GRANTED
IMPLEMENTATION_STATUS: UNBLOCKED
REPAIR_BUDGET_CONSUMED: 0/2
NEXT_DELIVERABLE: DESIGN_TRAINING_009_SUBMISSION_R01
```

---

## 1. Phán quyết

Phụ lục R02 đã xử lý đầy đủ bảy điểm lập kế hoạch P01–P07 của Review 001. Không còn mâu thuẫn ở cấp đặc tả đủ nghiêm trọng để tiếp tục chặn triển khai.

Antigravity được phép bắt đầu giai đoạn thi công Module 09, bao gồm:

1. `baseline/index.html` với đúng tám khuyết tật huấn luyện đã khai báo và banner cảnh báo bắt buộc;
2. `directions/option_a.html` và `directions/option_b.html`;
3. Candidate chính thức `index.html` theo Direction A;
4. máy trạng thái lưu yêu cầu, dialog hướng dẫn và hệ thống xử lý lỗi;
5. `verify_module_009.js`, `VERIFICATION.json`, báo cáo và bộ ảnh bằng chứng.

Đây là phê duyệt kế hoạch trước triển khai, không phải phán quyết nghiệm thu sản phẩm. Mọi gate chỉ được ghi `SELF_CHECK_PASS` sau khi được thực thi; quyền ban hành kết quả nghiệm thu chính thức vẫn thuộc Controller.

---

## 2. Đối soát P01–P07

| Mã | Kết quả thẩm định R02 | Trạng thái |
|---|---|---|
| P01 | Native `<dialog>` dùng `showModal()`; không gán `aria-hidden` lên tổ tiên chứa dialog; vị trí focus ban đầu được mô tả đúng là quyết định của dự án. | ACCEPTED |
| P02 | Validation chỉ phát từ `#error-summary`; lỗi mạng phát từ vùng alert; saving/success phát từ vùng status; inline error không tự phát live. | ACCEPTED |
| P03 | Bỏ điều kiện cấm cuộn dọc; khóa kiểm tra chống tràn ngang, clipping và overlap; phân biệt mô phỏng scale chữ với browser zoom. | ACCEPTED |
| P04 | Tách Draft, Payload Snapshot và Committed Data; đổi mục tiêu no-steal sang control ổn định ngoài giao dịch. | ACCEPTED |
| P05 | Forced-colors có preflight runtime và kết quả `NOT_EXECUTED` nếu môi trường không hỗ trợ; không được suy diễn thành PASS. | ACCEPTED |
| P06 | Baseline audit phân biệt quan sát, nguy cơ tiêu chí và kỹ thuật sửa; 44×44 là invariant dự án, không phải nguyên văn SC 2.5.8. | ACCEPTED |
| P07 | Invalid submit đưa focus tới control lỗi đầu tiên; error summary phát thông báo nhưng không chiếm focus; lỗi nhóm radio được gắn với fieldset/legend. | ACCEPTED |

---

## 3. Điều kiện bắt buộc trong triển khai

### 3.1. Điều kiện K01 — `aria-disabled` không tự khóa hành vi

`aria-disabled="true"` chỉ truyền đạt trạng thái trợ năng; nó không tự ngăn click, Enter, Space hoặc chỉnh sửa control. Vì vậy:

- nút submit phải có guard logic fail-closed khi `isSaving === true`;
- duplicate activation không được tăng `attemptCount`;
- không được dựa vào riêng thuộc tính ARIA để khóa hành vi;
- nếu các trường nhập vẫn cho phép chỉnh sửa khi saving, Payload Snapshot đã tạo tại `t=0` phải bất biến và kết quả commit phải khớp snapshot đó;
- nếu dự án chủ động khóa chỉnh sửa, cách khóa phải không làm mất node, không làm focus rơi về `body`, và phải được kiểm thử bằng thao tác native.

### 3.2. Điều kiện K02 — No-steal không được làm sai modal contract

`#btn-open-guidance` được chấp nhận làm đích kiểm tra no-steal. Nếu người dùng kích hoạt nút này trong khi request đang chạy, dialog vẫn phải tuân thủ vòng đời focus của modal. Test no-steal chỉ xác nhận phản hồi bất đồng bộ không tự kéo focus khỏi vị trí hợp lệ hiện tại; nó không được ngăn dialog quản lý focus khi chính người dùng mở hoặc đóng dialog.

### 3.3. Điều kiện K03 — Error announcement phải đo theo sự kiện

Harness phải chứng minh mỗi chu kỳ validation chỉ tạo một nguồn thông báo live chủ đạo. Không được kết luận “không đọc lặp” chỉ bằng việc đếm attribute tĩnh. Tối thiểu phải ghi nhận:

- nội dung trước và sau khi submit;
- vùng nào thay đổi text;
- vùng nào không thay đổi;
- inline error có tồn tại để liên kết nhưng không được cấu hình thành live region độc lập.

Trải nghiệm phát âm thực tế trên NVDA/VoiceOver vẫn thuộc manual review; telemetry DOM không thay thế kiểm thử screen reader thật.

### 3.4. Điều kiện K04 — Reflow và scale chữ

Ở 320 CSS px và trong `TEXT_SCALE_SIMULATION`:

- không có horizontal overflow toàn trang hoặc vùng tương tác cục bộ;
- cuộn dọc được phép;
- không có text hoặc control bị clip;
- không có overlap che mất nội dung hay mục tiêu tương tác;
- các phép kiểm hình học phải fail-closed khi selector thiếu hoặc rect không đo được.

Không được gọi CSS font-size injection là bằng chứng browser zoom 200%.

### 3.5. Điều kiện K05 — Forced-colors

Kết quả forced-colors phải có một trong hai trạng thái:

1. `EXECUTED_PASS` hoặc `EXECUTED_FAIL` khi preflight xác nhận hỗ trợ;
2. `NOT_EXECUTED_ENVIRONMENT_UNSUPPORTED` khi preflight thất bại.

Trạng thái thứ hai không được tính vào tổng số test tự động đã PASS. Muốn đóng gate tương ứng phải cung cấp bằng chứng thủ công tách biệt hoặc môi trường hỗ trợ.

### 3.6. Điều kiện K06 — Target size

Harness phải báo cáo riêng:

- yêu cầu WCAG 2.2 SC 2.5.8: tối thiểu 24×24 CSS px hoặc thỏa ngoại lệ hợp lệ;
- invariant dự án TRIPFLOW: mục tiêu hiệu dụng tối thiểu 44×44 CSS px.

Không gộp hai ngưỡng thành một tuyên bố tuân thủ duy nhất. Theo tài liệu W3C, SC 2.5.8 Level AA đặt mốc 24×24 CSS px và có các ngoại lệ đã định nghĩa; 44×44 là yêu cầu nghiêm ngặt hơn của bài tập.

---

## 4. Yêu cầu bằng chứng cho Submission R01

Gói nộp tối thiểu phải chứa:

```text
design_training_009_submission_r01.zip
├── baseline/index.html
├── directions/option_a.html
├── directions/option_b.html
├── index.html
├── ACCESSIBILITY_CONTRACT.yaml
├── DESIGN_TRAINING_009_DIRECTIVE.md
├── DESIGN_TRAINING_009_FIRST_RESPONSE.md
├── DESIGN_TRAINING_009_FIRST_RESPONSE_R02.md
├── DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md
├── DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002.md
├── DESIGN_TRAINING_009_REPORT.md
├── VERIFICATION.json
├── verify_module_009.js
└── screenshots/
```

Các văn bản do Controller phát hành phải được giữ byte-identical. Đường dẫn trong báo cáo phải là đường dẫn tương đối và toàn bộ entry trong ZIP dùng dấu `/`.

`VERIFICATION.json` phải phân biệt tối thiểu:

- `EXECUTED_PASS`;
- `EXECUTED_FAIL`;
- `NOT_EXECUTED`;
- `MANUAL_REVIEW_PENDING`.

Không được chuyển `NOT_EXECUTED` hoặc `MANUAL_REVIEW_PENDING` thành `PASS` trong phép hội tổng.

---

## 5. Trạng thái chính thức

```yaml
P01_DIALOG_SCOPE: ACCEPTED
P02_ANNOUNCEMENT_MATRIX: ACCEPTED
P03_REFLOW_AND_TEXT_SCALE: ACCEPTED
P04_DATA_AND_NO_STEAL: ACCEPTED
P05_FORCED_COLORS_PREFLIGHT: ACCEPTED
P06_BOUNDED_WCAG_MAPPING: ACCEPTED
P07_INVALID_FOCUS_CONTRACT: ACCEPTED

FIRST_RESPONSE_APPROVED: true
IMPLEMENTATION_AUTHORIZATION: GRANTED
IMPLEMENTATION_MAY_BEGIN: true
REPAIR_BUDGET_CONSUMED: 0/2
```

Antigravity được phép triển khai ngay. Submission tiếp theo phải là gói sản phẩm R01; không cần nộp thêm một vòng kế hoạch nếu không phát hiện thay đổi phạm vi.

---

## 6. Nguồn chuẩn được Controller đối chiếu

- W3C WAI, WCAG 2.2 Understanding SC 2.5.8 — Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- W3C WAI-ARIA APG — Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C WAI, WCAG 2.2 Understanding SC 1.4.4 — Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html

