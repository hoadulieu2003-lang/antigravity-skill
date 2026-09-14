# DESIGN TRAINING 010 — INTAKE HOLD 001
## Responsive & Inclusive Design · TRIPFLOW Disruption Response Board

```yaml
DOCUMENT_ID: DESIGN_TRAINING_010_INTAKE_HOLD_001
DIRECTIVE_ID: DESIGN_TRAINING_010
MODULE_ID: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: "Anh — Lead Architect / Product Owner"
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
EXECUTOR: "Antigravity"
REVIEW_DATE: 2026-09-14
REVIEWED_ATTACHMENT: "Pasted markdown(20260914-182742).md"
REVIEWED_ATTACHMENT_SHA256: 0f8d6f885745c18aec733406cdfe4c186bed2f02c892060e43aa1c5197ca1ce7
DECLARED_PACKAGE: design_training_010_submission_r01.zip
PACKAGE_PRESENT_IN_CONTROLLER_WORKSPACE: false
INTAKE_STATUS: HOLD
CONTROLLER_VERDICT: NOT_ISSUED
MODULE_COMPLETED: false
REPAIR_BUDGET_CONSUMED: 0/2
```

---

## 1. Kết luận điều hành

Controller chưa thể tiếp nhận `DESIGN_TRAINING_010_SUBMISSION_R01` vào vòng review sản phẩm.

Lý do đầu tiên là chỉ có một tệp Markdown chứa báo cáo; archive vật lý `design_training_010_submission_r01.zip` không được đính kèm. Ngoài ra, chính báo cáo đang thay đổi canonical fixture, thay đổi prescribed baseline defects và chứa số đo tương phản sai. Vì vậy đây là **Intake Hold**, không phải Repair Round 1 và chưa tiêu thụ ngân sách sửa chữa.

---

## 2. Blocking findings trước khi intake

### H01 — Thiếu archive vật lý

Controller chỉ nhận được:

- `Pasted markdown(20260914-182742).md`;
- khai báo về package, kích thước, SHA-256, manifest, source, JSON và screenshots nằm bên trong báo cáo.

Controller không nhận được `design_training_010_submission_r01.zip`, do đó không thể:

- xác minh SHA-256 `4ac5ac7cfe854090c4fd57e4f8ef466230c7a3227ad16ceb3ed2657526876705`;
- giải nén và kiểm tra source;
- chạy `verify_module_010.js`;
- đọc `VERIFICATION.json`;
- đối chiếu 14 ảnh;
- xác nhận manifest, path separator hoặc exit code.

Yêu cầu: đính kèm archive vật lý. Chỉ gửi lại báo cáo hoặc file citation của Markdown không đủ điều kiện intake.

### H02 — Canonical fixture đã bị thay toàn bộ

Mục 2 của báo cáo không dùng fixture khóa tại `DESIGN_TRAINING_010_DIRECTIVE.md`. Ví dụ:

| Trường | Directive khóa | Báo cáo gửi lên |
|---|---|---|
| `IR-1001` tour | `TF-802 · Tour Fansipan Sapa 2 Ngày 1 Đêm` | `TF-801 · Khách đoàn Tây Bắc Mù Cang Chải` |
| `IR-1001` assignee | `Lan Nguyễn` | `Nguyễn Hoàng Minh Anh` |
| `IR-1001` passengers | `18` | `32 khách` |
| `IR-1002` assignee | `Huy Trần` | `Trần Gia Huy` |
| `IR-1003` attention | `MEDIUM` | `HIGH` |
| `IR-1006` status | `Đã ổn định` | `ĐÃ GIẢI QUYẾT` |

Các tour, thời gian, người phụ trách, số khách, incident copy, next action và status của nhiều record đều bị đổi. Đây không phải lỗi trình bày; đây là vi phạm trực tiếp Gate R01.

Yêu cầu:

1. khôi phục đúng sáu tuple và chín trường từ Directive;
2. không thêm đơn vị `khách`, đổi định dạng ngày hoặc viết hoa status trong canonical values;
3. fixture độc lập của harness phải là bản sao chính xác từ Directive và so sánh `String(expected) === actualText` không normalize;
4. baseline, hai directions, candidate và report phải cùng fixture đó.

### H03 — Bảy baseline defects không đúng bộ khóa

Bảng baseline audit trong báo cáo đã thay đổi nội dung của các defect:

| ID | Defect khóa trong Directive | Defect trong báo cáo |
|---|---|---|
| `DEF-R01` | App shell `min-width: 1180px` | Table `min-width: 960px` |
| `DEF-R02` | Mobile ẩn “Khách” và “Việc tiếp theo” | Dùng đơn vị font `px` |
| `DEF-R03` | Tên tour/assignee bị ellipsis | Table container `overflow: hidden` khi text scale |
| `DEF-R04` | Rotate-device overlay trên portrait | Text-spacing bị chồng chữ |
| `DEF-R05` | Sticky bar che hoàn toàn phần tử đang focus | Mô tả che hai dòng cuối, chưa khóa focus target |
| `DEF-R06` | Target khoảng 32×32 và color-only attention | Chỉ báo cáo target `32×28`; thiếu observed color-only evidence |
| `DEF-R07` | Text-spacing làm clip label/button/card | Transition và hiệu ứng motion |

Yêu cầu: baseline phải chứa đúng bảy prescribed defects của Directive, không thay defect bằng lỗi khác dù lỗi mới cũng có giá trị kiểm thử. Zero Motion là candidate invariant, không được dùng để thay thế `DEF-R07`.

### H04 — Tỷ lệ tương phản cấu trúc được báo sai

Báo cáo ghi:

> Viền `#CBD5E1` trên `#FAF9F6`: `3.12:1`

Tính theo sRGB relative luminance, tỷ lệ đúng xấp xỉ:

```yaml
foreground: "#CBD5E1"
background: "#FAF9F6"
contrast_ratio: 1.4102:1
```

Trên nền trắng, tỷ lệ chỉ khoảng `1.4847:1`. Vì vậy không thể dùng cặp này để chứng minh ngưỡng non-text `3:1` cho ranh giới bắt buộc nhận biết.

Yêu cầu:

- sửa token viền thiết yếu hoặc phân loại đúng là decorative;
- đo màu từ live computed styles thay vì đưa số cố định vào report;
- fail closed khi parse màu, selector hoặc background chain không phân giải;
- đồng bộ số đo giữa source, `VERIFICATION.json` và report.

### H05 — Báo cáo vẫn chứa tuyên bố vượt bằng chứng

Các cụm như “mượt mà”, “vượt trội”, “cấp độ Enterprise”, “truyền tải tâm lý ổn định”, “không gây nhức mắt”, “tối ưu nhất”, “ngăn chặn hoàn toàn” không được hỗ trợ bởi telemetry hoặc nghiên cứu người dùng.

Yêu cầu phân loại lại:

- số đo runtime: `MEASURED_TELEMETRY`;
- nhận xét hình ảnh của Anti: `SELF_VISUAL_REVIEW_PENDING_CONTROLLER`;
- nhận định về nhận thức/hiệu suất: `DESIGN_HYPOTHESIS`;
- thiết bị/người dùng chưa thử: `MANUAL_REVIEW_PENDING`.

Không dùng các nhận định trên làm điều kiện Gate PASS.

### H06 — Evidence claims chưa được xem là bằng chứng

Các bảng 14/14 tests, 25/25 reflow cells, 7/7 positive controls, 14 screenshots và hash ledger hiện chỉ là claim trong Markdown. Chúng chưa được Controller xác minh vì thiếu archive.

Đặc biệt, khi nộp lại cần đối chiếu:

- số lượng target theo từng rendered state, không chỉ một con số `14/14` tổng hợp;
- forced-colors capability preflight thực sự và trạng thái fail-closed nếu unsupported;
- focus contrast lấy từ live `:focus-visible` state và adjacent background thực tế;
- PC1 không dựa vào một phần tử “ẩn” nếu production detector không chứng minh phần tử đó tham gia layout;
- PC2 phải làm một required selector thực sự bị thiếu rồi gọi production detector, không chỉ query `#non-existent-selector`;
- PC4 phải sửa ledger entry mà production integrity checker thực sự tiêu thụ;
- PC5–PC7 phải nằm trong final conjunction, không chỉ xuất hiện trong bảng báo cáo.

---

## 3. Điều kiện dỡ Intake Hold

Anti nộp lại cùng submission identity `DESIGN_TRAINING_010_SUBMISSION_R01`; không đổi thành Repair 001.

Hồ sơ tối thiểu:

1. archive vật lý `design_training_010_submission_r01.zip`;
2. canonical fixture đã khôi phục đúng Directive trên mọi artifact;
3. baseline có đúng `DEF-R01`–`DEF-R07`;
4. contrast inventory đã sửa;
5. report đã thu hẹp claim;
6. source, contract, verification, dependency/replay instructions và đúng 14 screenshots;
7. package SHA-256 mới được khai báo theo bytes thực tế sau khi đóng gói lại.

Sau khi archive hiện diện, Controller sẽ kiểm tra intake metadata, giải nén an toàn và bắt đầu Review 001. Nếu các lỗi nội dung trên vẫn tồn tại trong archive, khi đó chúng sẽ trở thành findings của Repair Round 1.

---

## 4. Trạng thái chính thức

```yaml
SUBMISSION_R01_REPORT: RECEIVED
SUBMISSION_R01_ARCHIVE: MISSING
INTAKE_HOLD: ACTIVE
CONTROLLER_REVIEW_STARTED: false
CONTROLLER_VERDICT: NOT_ISSUED
MODULE_COMPLETED: false
REPAIR_BUDGET_CONSUMED: 0/2
NEXT_ACTION: ATTACH_CORRECTED_PHYSICAL_ARCHIVE_AND_RELEASE_HOLD
```

