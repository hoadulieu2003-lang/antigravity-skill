# DESIGN TRAINING 008 — INITIAL REVIEW 001

```yaml
REVIEW_ID: DESIGN_TRAINING_008_INITIAL_REVIEW_001
MODULE_ID: DESIGN_TRAINING_008
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
REVIEWER: ChatGPT Architectural Controller (Sol)
SUBMISSION_STAGE: FIRST_RESPONSE
VERDICT: AUTHORIZE_IMPLEMENTATION_WITH_LOCKED_CORRECTIONS
IMPLEMENTATION_AUTHORIZED: true
REPAIR_BUDGET_CONSUMED: 0/2
NEXT_DELIVERABLE: design_training_008_submission_r01.zip
```

## 1. Phán quyết

Controller chấp thuận hướng nghiên cứu và cho phép Antigravity triển khai hai phương án màu cùng bản Candidate của Module 08.

Proposal đã đáp ứng bốn cấu phần khởi động:

1. Có kiến trúc token ba tầng.
2. Có hai hướng màu đủ khác nhau để thử nghiệm.
3. Có fixture gồm bốn trạng thái.
4. Có dự thảo ma trận C01–C07.

Tuy nhiên, các chỉnh sửa P01–P07 dưới đây được khóa thành tiền điều kiện thi công. Đây là hiệu chỉnh proposal trước triển khai, không tính là vòng sửa nghiệm thu.

## 2. Điểm mạnh được giữ nguyên

### S01 — Tách ba tầng token

Giữ kiến trúc:

```text
Primitive -> Semantic -> Component
```

Đây là cấu trúc phù hợp để thay đổi art direction mà không làm component phụ thuộc trực tiếp vào tên màu vật lý.

### S02 — Tách brand role và status role

Giữ mục tiêu phân biệt màu nhận diện/hành động với màu truyền đạt trạng thái. Quy tắc này phải được mô tả là policy của bài tập TRIPFLOW, không phải chân lý phổ quát cho mọi thương hiệu.

### S03 — Redundant status cues

Giữ nguyên yêu cầu mỗi trạng thái có tối thiểu:

- Nhãn văn bản.
- Dấu hiệu hình học hoặc icon.
- Màu nền/chữ/viền.

### S04 — Hai hướng art direction

Hướng A và B khác nhau đủ rõ về nhiệt độ màu, brand role và border strategy để tiếp tục triển khai. Việc hướng nào tốt hơn chỉ được kết luận sau khi xem bản thực tế.

## 3. Locked corrections trước khi triển khai

### P01 — Phân biệt operational status và interaction FSM

Bốn trạng thái `NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS` trong fixture là **semantic operational status taxonomy**, không phải một finite-state machine hoàn chỉnh.

Phải đổi cách gọi trong source, report và contract:

```yaml
OPERATIONAL_STATUS:
  - NORMAL
  - ATTENTION
  - ERROR
  - SUCCESS
```

Nếu Candidate có hành động bất đồng bộ, interaction FSM phải được tách riêng, ví dụ:

```yaml
INTERACTION_STATE:
  - IDLE
  - VALIDATING
  - SAVING
  - FAILURE
  - CONFIRMED
```

Không dùng một biến trạng thái duy nhất cho cả tình trạng tour và trạng thái gửi tác vụ.

### P02 — Thu hẹp các khẳng định tuyệt đối

Các câu sau không được đưa vào báo cáo dưới dạng kết luận đã chứng minh:

- “Thoải mái cho mắt khi trực ca 8–12 tiếng.”
- “Tối ưu cho môi trường ánh sáng mạnh ngoài trời.”
- “Duy trì hoàn hảo trong grayscale.”
- “Không bao giờ được dùng brand hue cho status trong mọi hệ thống.”

Thay bằng:

- Design hypothesis hoặc target context.
- Policy có phạm vi của TRIPFLOW.
- Kết quả quan sát từ screenshot hoặc computed measurement.

Không gọi screenshot/CVD simulation là usability study.

### P03 — Sửa số liệu tương phản

Kết quả tính theo sRGB relative luminance cho các cặp đã đề xuất:

| Cặp màu | Tỷ lệ đúng |
|---|---:|
| `#0F172A` / `#FAF9F6` | `16.9564:1` |
| `#475569` / `#FAF9F6` | `7.1973:1` |
| `#3730A3` / `#FFFFFF` | `9.9333:1` |
| `#2563EB` / `#F8FAFC` | `4.9400:1` |
| `#D97706` / `#FAF9F6` | `3.0259:1` |
| `#B45309` / `#FEF3C7` | `4.5097:1` |
| `#BE123C` / `#FFE4E6` | `5.2352:1` |
| `#15803D` / `#DCFCE7` | `4.5669:1` |
| `#9A3412` / `#FFEDD5` | `6.3768:1` |
| `#9F1239` / `#FFE4E6` | `6.6769:1` |
| `#115E59` / `#CCFBF1` | `6.7300:1` |

Không sao chép các con số ước lượng cũ `15.8:1`, `17.4:1`, `10.2:1`, `4.5:1` vào báo cáo cuối.

Harness phải tính từ computed foreground/background thực tế, không chỉ đọc bảng màu trong contract.

### P04 — Chứng minh token provenance đúng cách

Computed style chỉ chứng minh giá trị màu cuối cùng; nó không tự chứng minh chuỗi ánh xạ `primitive -> semantic -> component`.

C01 phải gồm hai lớp:

1. Static contract/source audit: xác nhận component token tham chiếu semantic token và semantic token tham chiếu primitive token.
2. Runtime audit: xác nhận component thực tế nhận đúng computed value cuối.

Mẫu hợp lệ:

```css
:root {
  --primitive-indigo-700: #4338ca;
  --semantic-action-primary-bg: var(--primitive-indigo-700);
  --component-primary-button-bg: var(--semantic-action-primary-bg);
}

.primary-button {
  background: var(--component-primary-button-bg);
}
```

Không dùng primitive token trực tiếp trong selector component của bài tập này. Đây là contract cục bộ của Module 08.

### P05 — Không dùng Delta L tùy ý để kết luận hai hướng khác nhau

Điều kiện `Delta L >= 0.02` không đủ để chứng minh hai art direction khác nhau và không phải tiêu chuẩn nghiệm thu bắt buộc.

C02 phải kiểm tra:

- Cùng dữ liệu và cùng chức năng.
- Khác brand primary.
- Khác canvas temperature/value strategy.
- Khác border/status treatment.
- Có thesis riêng và trade-off riêng.
- Controller thực hiện visual review độc lập trên ảnh cùng viewport.

Telemetry được dùng để mô tả khác biệt; visual review quyết định khác biệt có ý nghĩa hay không.

### P06 — Chỉnh phương pháp kiểm tra color independence

T04 tự động chỉ được kết luận rằng bốn trạng thái có redundant cues trong DOM. Nó không được tự kết luận “người dùng phân biệt rõ ràng”.

T04 phải tách:

```yaml
AUTOMATED_ASSERTIONS:
  visible_text_label: true
  non_color_marker_present: true
  accessible_name_contains_status: true
  color_not_sole_signal: true

CONTROLLER_VISUAL_REVIEW:
  grayscale_readability: PENDING
  cvd_simulation_readability: PENDING
```

Không dùng emoji phụ thuộc hệ điều hành làm bằng chứng hình học duy nhất. Ưu tiên inline SVG hoặc CSS shape có `aria-hidden="true"`, đi kèm nhãn text luôn hiển thị. Nếu vẫn dùng emoji, phải ghi nhận rủi ro rendering và cách screen reader phát âm khác nhau.

Grayscale screenshot và CVD simulation là hai bằng chứng khác nhau:

- `grayscale(100%)` chỉ phục vụ kiểm tra mất hue.
- CVD simulation phải ghi rõ loại mô phỏng, ma trận/thuật toán và công cụ tạo ảnh.
- Không gọi grayscale là mô phỏng deuteranopia/protanopia.

Không khóa `luminance delta > 0.05` như điều kiện phổ quát. Nhãn và marker mới là bằng chứng chính cho yêu cầu không phụ thuộc màu.

### P07 — Chuẩn hóa contrast và focus acceptance

C03 phải phân biệt:

- Normal text: mục tiêu `>= 4.5:1`.
- Large text đủ điều kiện: mục tiêu `>= 3:1`.
- Focus indicator và meaningful non-text UI boundary: mục tiêu `>= 3:1` khi tiêu chí tương ứng áp dụng.

Không gộp “viền và chữ lớn” thành cùng một loại kiểm tra.

Focus ring phải được kích hoạt bằng native keyboard traversal. Đo màu ring với **adjacent color tại từng context thực tế**, không chỉ với canvas. Ít nhất phải kiểm tra:

1. Primary CTA.
2. Secondary action hoặc link.
3. Interactive tour row/card.

Nếu focus color không đạt ở một context, dùng ring hai lớp hoặc token khác; báo cáo phải mô tả đúng cấu trúc thực tế.

Nguồn chuẩn để Anti sử dụng:

- W3C WCAG 2.2 — SC 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C WCAG 2.2 — SC 1.4.3 Contrast Minimum: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C WCAG 2.2 — SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

## 4. Canonical fixture được phê duyệt có điều kiện

Bốn bản ghi `TF-801` đến `TF-804` được chấp thuận làm **synthetic training fixture** cho Module 08.

Phải ghi rõ:

```yaml
DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
REAL_CUSTOMER_DATA: false
BUSINESS_PERFORMANCE_CLAIMS: none
```

Không trình bày tên, số khách, sự cố hoặc thời hạn trong fixture như dữ liệu thực tế của một doanh nghiệp.

## 5. Ma trận Gate đã hiệu chỉnh

| Gate | Quyết định | Điều kiện khóa |
|---|---|---|
| C01 | APPROVED_WITH_CHANGE | Static provenance audit + runtime computed audit |
| C02 | APPROVED_WITH_CHANGE | Bỏ Delta L bắt buộc; thêm visual review |
| C03 | APPROVED_WITH_CHANGE | Tính lại từ computed pairs và phân loại text/non-text |
| C04 | APPROVED_WITH_CHANGE | Automation kiểm redundant cues; Controller đánh giá ảnh |
| C05 | APPROVED_WITH_CHANGE | Native focus ở tối thiểu ba context |
| C06 | APPROVED | Đo 1440/768/390 và đưa vào pass conjunction |
| C07 | APPROVED | Tách telemetry, visual review, hypothesis |

## 6. Ảnh bằng chứng bắt buộc

```text
screenshots/
├── option_a_desktop_1440x900.png
├── option_b_desktop_1440x900.png
├── final_desktop_1440x900.png
├── final_tablet_768x1024.png
├── final_mobile_390x844.png
├── final_grayscale_desktop_1440x900.png
├── final_deuteranopia_desktop_1440x900.png
└── final_protanopia_desktop_1440x900.png
```

Ảnh simulation phải được tạo từ cùng Candidate, cùng viewport, cùng trạng thái dữ liệu. Metadata phương pháp simulation phải xuất hiện trong `VERIFICATION.json`.

## 7. Điều kiện nộp Round 01

Gói nộp phải chứa:

```text
design_training_008_submission_r01.zip
├── index.html
├── directions/option_a.html
├── directions/option_b.html
├── COLOR_CONTRACT.yaml
├── DESIGN_TRAINING_008_REPORT.md
├── DESIGN_TRAINING_008_INITIAL_REVIEW_001.md
├── VERIFICATION.json
├── verify_module_008.js
└── screenshots/
```

Báo cáo phải có bảng ánh xạ:

```text
Requirement -> Contract token -> Source selector -> Runtime evidence -> Verdict
```

`VERIFICATION.json` phải chứa dữ liệu thô đủ để Controller đối chiếu, không chỉ lưu cờ `pass: true`.

## 8. Lệnh thi công

```yaml
ANTI_DIRECTIVE:
  action: IMPLEMENT
  module: DESIGN_TRAINING_008_COLOR_SYSTEM
  approved_directions:
    - EDITORIAL_WARM_DISPATCH
    - TECHNICAL_SLATE_HIGH_CONTRAST
  locked_corrections:
    - P01
    - P02
    - P03
    - P04
    - P05
    - P06
    - P07
  expected_submission: design_training_008_submission_r01.zip
  module_009_status: LOCKED
```

Antigravity được phép bắt đầu thi công Module 08 ngay sau khi tiếp nhận file này. Module 09 vẫn bị khóa cho đến khi Module 08 có phán quyết `MODULE_COMPLETED: true`.
