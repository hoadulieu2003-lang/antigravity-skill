# DESIGN TRAINING — STREAM A DIRECTIVE

```yaml
DIRECTIVE_ID: DESIGN_TRAINING_STREAM_A
STREAM_NAME: FOUNDATION_INTEGRITY
OWNER: Lead Architect
CONTROLLER: ChatGPT Architectural Controller
EXECUTOR: Antigravity
STATUS: ACTIVE
START_MODULE: DESIGN_TRAINING_008
MODULES:
  - DESIGN_TRAINING_008_COLOR_SYSTEM
  - DESIGN_TRAINING_009_ACCESSIBILITY
  - DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
  - DESIGN_TRAINING_011_CONTENT_DESIGN
FINAL_DEPENDENCY: DESIGN_TRAINING_016_INTEGRATED_CAPSTONE
MAX_REPAIR_ROUNDS_PER_MODULE: 2
```

## 1. Mục tiêu của Stream A

Stream A đào tạo Antigravity xây giao diện có tính hệ thống, dễ đọc, dễ sử dụng và không loại trừ người dùng. Kết quả phải chứng minh được bằng mã nguồn, ảnh thực tế và kiểm thử; không được chỉ trình bày lý thuyết.

Stream A trả lời bốn câu hỏi:

1. Màu sắc có vai trò và quan hệ rõ ràng không?
2. Người dùng có nhu cầu tiếp cận khác nhau có hoàn thành được nhiệm vụ không?
3. Giao diện có bảo toàn cấu trúc khi không gian và điều kiện sử dụng thay đổi không?
4. Nội dung giao diện có giúp người dùng hiểu, quyết định và phục hồi lỗi không?

## 2. Quy tắc thực thi

- Chạy tuần tự trong Stream A: `008 -> 009 -> 010 -> 011`.
- Chỉ `DESIGN_TRAINING_008` được mở ngay khi nhận chỉ thị này.
- Module tiếp theo chỉ được mở sau phán quyết `PASS` của Controller.
- Stream A được phép chạy song song với Stream B vì hai stream có phạm vi kiểm soát khác nhau.
- Không được tự tuyên bố hoàn thành dựa trên self-check.
- Mỗi module tối đa hai vòng sửa; hết ngân sách phải dừng và báo Lead Architect.
- Không đưa kiến thức vào kho dùng chung trước khi có `PROMOTION_STATUS: APPROVED`.

## 3. Bất biến chung

```yaml
INVARIANTS:
  theme: LIGHT_THEME
  viewports:
    - 1440x900
    - 768x1024
    - 390x844
  horizontal_overflow: forbidden
  motion: ZERO_MOTION_UNTIL_STREAM_B_AUTHORIZES
  accessibility_target: WCAG_2_2_AA_BASELINE
  semantic_html: required
  keyboard_operability: required
  user_input_rendering: TEXT_CONTENT_ONLY
  fabricated_research_claims: forbidden
  fabricated_business_data: forbidden
```

## 4. Module 08 — Color System

### Mục tiêu

Biến màu sắc từ lựa chọn trang trí thành hệ thống chức năng có thể giải thích, kiểm tra và thay đổi.

### Bài tập

Thiết kế một màn hình điều phối có tối thiểu bốn trạng thái: bình thường, cần chú ý, lỗi và thành công. Tạo hai hướng màu khác biệt, chọn một hướng và triển khai bản cuối.

### Yêu cầu bắt buộc

- Tách primitive token, semantic token và component token.
- Có màu cho canvas, surface, text, border, action, focus và bốn trạng thái.
- Không dùng màu như tín hiệu duy nhất; phải có text hoặc dấu hiệu hình học đi kèm.
- Kiểm tra tương phản từng cặp màu được sử dụng thực tế.
- Có grayscale inspection để kiểm tra hierarchy không phụ thuộc hoàn toàn vào hue.
- Có ít nhất một thử nghiệm mô phỏng khiếm khuyết nhận biết màu.
- Giải thích rõ màu thương hiệu khác màu trạng thái như thế nào.

### Gate C01–C07

| Gate | Điều kiện PASS |
|---|---|
| C01 | Token ba tầng ánh xạ đúng vào CSS thực tế |
| C02 | Hai hướng màu khác nhau về chiến lược, không chỉ đổi hue |
| C03 | Các cặp text/background đạt mục tiêu tương phản đã khai báo |
| C04 | Trạng thái vẫn nhận biết được khi bỏ màu |
| C05 | Focus indicator đo từ computed style thực tế |
| C06 | Không tràn ngang ở ba viewport |
| C07 | Báo cáo phân biệt số đo, thẩm định thị giác và giả thuyết người dùng |

### Gói nộp Module 08

```text
design_training_008_submission_r01.zip
├── index.html
├── directions/option_a.html
├── directions/option_b.html
├── COLOR_CONTRACT.yaml
├── DESIGN_TRAINING_008_REPORT.md
├── VERIFICATION.json
├── verify_module_008.js
└── screenshots/
```

Ảnh tối thiểu: A/B desktop; final desktop/tablet/mobile; grayscale; color-vision simulation. Mọi ảnh phải ghi đúng viewport và DPR.

## 5. Module 09 — Accessibility

### Mục tiêu

Chứng minh một nhiệm vụ hoàn chỉnh có thể thực hiện bằng bàn phím, công nghệ hỗ trợ và trong các điều kiện cảm giác khác nhau.

### Phạm vi

- Semantic structure và landmark.
- Accessible name, description và error association.
- Tab order, focus visible, focus restoration và no-steal.
- Form validation và recovery.
- Target size, zoom/reflow, contrast, forced-colors và reduced-motion behavior.
- Trạng thái không phụ thuộc riêng vào màu, icon hoặc vị trí.

### Gate A01–A08

PASS yêu cầu: hành trình bàn phím native; không rơi focus về `body`; thông báo trạng thái có cơ chế thông báo phù hợp; lỗi được liên kết đến trường; reflow ở 200% không mất chức năng; target tương tác đạt yêu cầu đã khóa; audit tự động chỉ là bằng chứng bổ trợ, không thay thế review thủ công.

## 6. Module 10 — Responsive & Inclusive Design

### Mục tiêu

Thiết kế theo sự thay đổi của nội dung và không gian, không chỉ thu nhỏ desktop.

### Phạm vi

- Intrinsic layout và content-driven boundary.
- Container behavior và component re-composition.
- Font scaling, spacing scaling và measure.
- 320px stress test, 200% zoom, text expansion 150%.
- Touch, keyboard và pointer parity.
- Long Vietnamese labels, dữ liệu rỗng, dữ liệu dày và lỗi mạng.

### Gate R01–R07

PASS yêu cầu: không mất dữ liệu; không che CTA; không tràn ngang ngoài vùng được thiết kế cuộn có nhãn; thứ tự đọc hợp lý; component thay đổi cấu trúc có lý do; không sử dụng device name làm lập luận duy nhất cho breakpoint.

## 7. Module 11 — Content Design

### Mục tiêu

Viết nội dung giao diện giúp người dùng hiểu trạng thái, thực hiện hành động và sửa sai.

### Phạm vi

- Navigation labels, CTA, hints và progressive disclosure.
- Empty, loading, error, success và destructive confirmation.
- Voice/tone matrix theo mức độ nghiêm trọng.
- Nội dung tiếng Việt rõ, ngắn và có khả năng hành động.
- Không dùng nhãn mơ hồ như “Submit”, “OK” hoặc “Có lỗi xảy ra” khi có thể mô tả cụ thể.

### Gate W01–W07

PASS yêu cầu: nội dung nhất quán với hành vi; không hứa điều hệ thống chưa làm; lỗi nói rõ vấn đề và bước tiếp theo; CTA mô tả kết quả; content hierarchy vẫn rõ trên mobile; có bảng before/after và lý do thay đổi.

## 8. Chuẩn báo cáo mỗi module

Mỗi báo cáo bắt buộc có:

1. Mục tiêu và dữ liệu chuẩn.
2. Ba nguyên tắc có nguồn và phạm vi áp dụng.
3. Hai hướng thử nghiệm thực sự khác nhau.
4. Hướng được chọn và hai đánh đổi.
5. Bảng ánh xạ yêu cầu -> mã nguồn -> bằng chứng.
6. Kết quả kiểm thử và giới hạn bằng chứng.
7. Self-critique phân loại `STRENGTH`, `DEFECT`, `TRADEOFF`, `PREFERENCE`.
8. Đề nghị `PASS`, `CONDITIONAL_PASS` hoặc `FAIL`; Controller quyết định cuối.

## 9. Lệnh bắt đầu

```yaml
ANTI_DIRECTIVE:
  action: START
  task: DESIGN_TRAINING_008_COLOR_SYSTEM
  parallel_stream_allowed: DESIGN_TRAINING_STREAM_B
  next_module_locked: DESIGN_TRAINING_009_ACCESSIBILITY
  required_first_response:
    - RESEARCH_PLAN
    - TWO_COLOR_DIRECTIONS
    - CANONICAL_DATA_PROPOSAL
    - TEST_MATRIX_DRAFT
```

Không bắt đầu Module 09 trước khi Module 08 được Controller ký `MODULE_COMPLETED: true`.
