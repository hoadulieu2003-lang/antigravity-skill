# DESIGN TRAINING 009 — FIRST RESPONSE REVIEW 001

## Accessibility Task Completion — Stream A / Foundation Integrity

```yaml
REVIEW_ID: DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
CONTROLLER: ChatGPT Architectural Controller (Sol)
EXECUTOR: Antigravity
STAGE: PRE_IMPLEMENTATION_RESEARCH_REVIEW
VERDICT: REVISION_REQUIRED_BEFORE_IMPLEMENTATION
FIRST_RESPONSE_APPROVED: false
IMPLEMENTATION_STATUS: BLOCKED
REPAIR_BUDGET_CONSUMED: 0/2
NEXT_SUBMISSION: DESIGN_TRAINING_009_FIRST_RESPONSE_R02
```

## 1. Kết luận

First Response R01 đã bao phủ đủ năm phần bắt buộc, chọn Direction A hợp lý và thể hiện hiểu biết tốt về native controls, error association, live regions, focus restoration và bounded evidence.

Tuy nhiên, Controller chưa mở `$dev` vì bảy điểm cần khóa lại trước khi code. Đây là vòng hiệu chỉnh kế hoạch, không tính vào hai repair rounds của sản phẩm.

## 2. Phần được chấp nhận

- Fixture AR-901 và locked copy: chấp nhận.
- Privacy boundary không thu thập chẩn đoán y tế: chấp nhận.
- Direction A/B khác nhau về cấu trúc nhiệm vụ: chấp nhận.
- Chọn Direction A cho Candidate: chấp nhận có điều kiện.
- Native `fieldset`/`legend`, label hiển thị, error summary, stable action và live regions: đúng hướng.
- Baseline tám defect: đủ phạm vi, cần sửa cách gán tiêu chuẩn tại P06.
- T01–T12: khung kiểm thử phù hợp, cần sửa các phương pháp tại P03–P05.

## 3. Planning Findings bắt buộc sửa

### P01 — Sửa cách diễn giải Dialog APG

R01 đang mô tả APG như sau:

> Vùng nền phải được gán `inert` hoặc `aria-hidden="true"`.

Đây là diễn giải quá tuyệt đối. Modal behavior phải ngăn người dùng tương tác với nội dung bên ngoài; native `<dialog>.showModal()` đã cung cấp hành vi modal/inert ở trình duyệt hỗ trợ. Không được mặc định gắn `aria-hidden="true"` lên vùng tổ tiên có chứa dialog vì có thể che chính dialog khỏi accessibility tree.

#### Yêu cầu R02

- Dùng native `<dialog id="support-guidance-dialog">` và `showModal()` nếu chọn native strategy.
- Không tự gán `aria-hidden` cho toàn bộ application shell khi dialog nằm bên trong shell đó.
- Chỉ bổ sung inert/fallback khi có lý do tương thích được kiểm chứng.
- `aria-haspopup="dialog"` có thể dùng; `aria-expanded` không phải yêu cầu bắt buộc của dialog trigger. Nếu giữ `aria-expanded`, phải đồng bộ chính xác nhưng không được trình bày như quy định bắt buộc của APG.
- Initial focus vào nút đóng được chấp nhận cho dialog ngắn; giải thích đây là quyết định của bài, không phải lựa chọn duy nhất của APG.

### P02 — Tránh thông báo validation trùng lặp

R01 đồng thời đề xuất:

- `#error-summary` có `role="alert"`; và
- `#live-alert-region` thông báo validation errors.

Hai vùng assertive có thể đọc cùng lỗi hai lần. Điều này làm tăng nhiễu cho người dùng screen reader.

#### Yêu cầu R02

Khóa một chiến lược duy nhất:

```yaml
validation_errors:
  announcement_source: error_summary
  error_summary_role: alert
  live_alert_region_repeats_validation: false
network_error:
  announcement_source: live_alert_region
  role: alert
saving_and_success:
  announcement_source: live_status_region
  role: status
```

Inline errors vẫn liên kết tới control nhưng không tạo thêm live announcement độc lập.

### P03 — Sửa phương pháp text resize/reflow

R01 đề xuất:

```text
scrollHeight <= clientHeight
```

để chứng minh không clip ở text resize 200%. Điều kiện này sai: cuộn dọc là hợp lệ và thường cần thiết khi chữ phóng lớn. Nó có thể làm một giao diện tiếp cận tốt bị đánh FAIL chỉ vì trang dài hơn viewport.

Inject `html { font-size: 200% }` cũng chỉ là mô phỏng text scaling của bài tập, không được mô tả tương đương hoàn toàn browser zoom 200%.

#### Yêu cầu R02

T10 phải đo:

- `document.documentElement.scrollWidth <= clientWidth`;
- không có local horizontal scroller ngoài vùng được thiết kế rõ;
- tất cả label, error, CTA và dialog content có rect dương, không bị clipping/overlap;
- người dùng vẫn hoàn thành T03–T07 trong stress mode;
- cuộn dọc được phép;
- ảnh 200% ghi nhãn `TEXT_SCALE_SIMULATION`, không ghi `BROWSER_ZOOM_CERTIFICATION`.

Nếu muốn kiểm tra browser zoom thật, phải mô tả đúng API/môi trường và tách khỏi text-scale simulation.

### P04 — T09 không dùng textarea làm đích no-steal trong lúc saving

R01 chọn textarea làm nơi người dùng chuyển focus trong lúc request đang saving. Nếu textarea vẫn editable, người dùng có thể sửa draft sau khi payload đã chụp, gây race giữa:

```text
Draft Input
Payload Snapshot
Committed Data
```

Nếu textarea bị native-disabled thì nó lại không thể nhận focus.

#### Yêu cầu R02

- No-steal target phải là phần tử ổn định ngoài các field đang giao dịch, ưu tiên `#btn-open-guidance` hoặc một link điều hướng ổn định.
- Contract phải khai rõ fields trong saving là editable hay locked.
- Nếu editable: payload phải snapshot tại submit và success summary phải phản ánh payload, không âm thầm lấy draft mới.
- Nếu locked: dùng cơ chế không làm rơi focus hiện có và không đưa control bị khóa làm no-steal target.
- T06/T07 phải kiểm tra tách biệt draft, payload và committed data.

### P05 — Forced-colors phải có capability preflight

R01 ghi `emulateMediaFeatures([{ name: 'forced-colors', value: 'active' }])`. Hỗ trợ API có thể khác nhau giữa Puppeteer/Chromium. Harness không được fallback sang kết luận PASS nếu emulation không được trình duyệt chấp nhận.

#### Yêu cầu R02

- Dùng CDP `Emulation.setEmulatedMedia` hoặc API tương đương đã chạy được trong môi trường thực tế.
- Ghi `forced_colors_emulation_supported: true/false`.
- Assert `matchMedia('(forced-colors: active)').matches === true` trước khi đo.
- Nếu false: automated subtest là `NOT_EXECUTED`, không phải PASS; cung cấp manual evidence riêng hoặc dừng gate.
- Screenshot phải ghi engine/version, API và limitation.

### P06 — Thu hẹp các tuyên bố WCAG của baseline defects

Một số defect có khả năng gây failure nhưng không tự động cấu thành kết luận vi phạm chỉ từ mô tả:

- Native `disabled` trong saving không mặc nhiên vi phạm SC 2.4.3; vấn đề là kết quả focus cụ thể của luồng.
- Radio/checkbox 20×20 chưa chắc thất bại SC 2.5.8 nếu associated label tạo effective target hoặc thuộc ngoại lệ spacing/equivalent.
- `aria-describedby` và `aria-invalid` là kỹ thuật triển khai hữu ích; SC 3.3.1 không bắt buộc đúng hai attribute này bằng nguyên văn.

#### Yêu cầu R02

Tách ba cột:

```text
Observed Defect
Relevant Criterion / Risk
Candidate Technique
```

Chỉ ghi `WCAG_FAILURE_CONFIRMED` khi test đã chứng minh đủ điều kiện. Trước triển khai dùng `POTENTIAL_FAILURE` hoặc `PROJECT_INVARIANT_FAILURE`.

Đối với target 44×44:

- ghi rõ đây là project invariant;
- đo effective clickable target gồm associated label;
- không gọi 44×44 là ngưỡng nguyên văn SC 2.5.8.

### P07 — Làm rõ error focus và group association

R01 nói error summary có `tabindex="-1"` nhưng đồng thời focus chuyển thẳng tới field lỗi đầu tiên. Đây là hai chiến lược khác nhau; cần khóa một hành vi nhất quán.

Đối với radio group, lỗi thuộc toàn nhóm chứ không chỉ riêng `#radio-boarding`.

#### Yêu cầu R02

Khóa hành vi:

```yaml
invalid_submit_focus:
  destination: first_invalid_control
  error_summary_focusable: true
  error_summary_auto_focused: false
  error_summary_links: true
radio_group_error:
  semantic_owner: fieldset
  description_relation: group_and_first_focusable_radio
  focus_target: first_radio
```

Error summary có thể giữ `tabindex="-1"` để làm target cho link/logic khác, nhưng T04 phải assert focus thực tế vào first invalid control theo contract.

## 4. Điều chỉnh Direction A/B

Các nhận định như “tối ưu vượt trội”, “cao tuyệt đối” và số Tab `12–14`/`20–22` hiện mới là giả thuyết. R02 phải đổi thành:

- `ESTIMATED_TAB_STOPS` trước triển khai;
- `DESIGN_HYPOTHESIS` đối với tải ghi nhớ và tốc độ;
- số đo thực tế chỉ xuất hiện sau khi DOM hoàn chỉnh;
- không suy luận trải nghiệm người dùng thật từ số lượng Tab.

Direction A tiếp tục là hướng ứng viên được chấp nhận về mặt kế hoạch.

## 5. First Response R02 bắt buộc

Không cần viết lại toàn bộ nội dung. Nộp một addendum `.md` đóng P01–P07, tối thiểu gồm:

1. corrected dialog behavior;
2. single-source announcement matrix;
3. corrected resize/reflow assertions;
4. draft/payload/committed model và no-steal target;
5. forced-colors capability preflight;
6. bounded WCAG mapping của baseline;
7. exact invalid-submit focus contract;
8. cập nhật T03, T04, T06–T11;
9. xác nhận mọi số bước trước triển khai chỉ là estimate.

## 6. Acceptance để mở implementation

```yaml
P01_DIALOG_SCOPE: corrected
P02_DUPLICATE_ANNOUNCEMENT: eliminated
P03_VERTICAL_SCROLL: allowed
P03_TEXT_SCALE_CLAIM: bounded
P04_TRANSACTION_DATA_LAYERS: explicit
P04_NO_STEAL_TARGET: stable_non_transaction_control
P05_FORCED_COLORS_PREFLIGHT: fail_closed
P06_WCAG_MAPPING: bounded
P07_ERROR_FOCUS_CONTRACT: unambiguous
IMPLEMENTATION_AUTHORIZATION: pending_controller_r02_review
```

## 7. Phán quyết

```yaml
VERDICT: REVISION_REQUIRED_BEFORE_IMPLEMENTATION
IMPLEMENTATION_STATUS: BLOCKED
MODULE_REPAIR_ROUNDS_CONSUMED: 0/2
NEXT_ACTION: SUBMIT_DESIGN_TRAINING_009_FIRST_RESPONSE_R02_ADDENDUM
```

