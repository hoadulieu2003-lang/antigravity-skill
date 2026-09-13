# DESIGN_TRAINING_007_REVIEW_001

## 1. Thông tin phán quyết

```yaml
REVIEW_ID: DESIGN_TRAINING_007_REVIEW_001
SUBMISSION_ID: DESIGN_TRAINING_007_SUBMISSION_R01
MODULE: DESIGN_TRAINING_007
STAGE: TRANSFER_TESTING_ON_NEW_BRIEF
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND: 1/2
NEXT_SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_001
```

Controller đã giải nén và đối soát trực tiếp gói `design_training_007_submission_r01.zip`.

SHA-256 của gói được xác nhận khớp với báo cáo:

```text
71c7eb9c8f80801ffb56eb6337709cbb74c6a2311c5c30bc4c947ee83b8d7f57
```

Phán quyết hiện tại là `REPAIR_REQUIRED`, chưa phải thất bại của năng lực chuyển giao. Hướng thị giác đã đạt mức có thể tiếp tục; điểm chặn nằm ở tính đúng đắn của kiến trúc thông tin, hợp đồng tương tác, phạm vi critique và chất lượng bằng chứng tự động.

---

## 2. Phạm vi thẩm định

Controller đã đọc và đối chiếu:

- `baseline/index.html`;
- `directions/option_a.html`;
- `directions/option_b.html`;
- `candidate/pre_critique.html`;
- `candidate/index.html`;
- `DESIGN_CONTRACT.yaml`;
- `DESIGN_TRAINING_007_REPORT.md`;
- `CHANGE_LEDGER.md`;
- `VERIFICATION.json`;
- `verify_module_007.js`;
- 10 ảnh chụp trong `screenshots/`.

Controller xác nhận ba checksum nội bộ sau khớp với hồ sơ nộp:

| Tệp | SHA-256 |
|---|---|
| `baseline/index.html` | `377b4572f62c607c76ac8bad2a771dfe634cb874a0521402005daa518dc75958` |
| `candidate/pre_critique.html` | `a90bbc8c3440bd8461dce45106e6e84336d2a4932d592e833c2818f86ffd17e2` |
| `candidate/index.html` | `5b9672066670df1db8bb5e8dd4ebb051f39d2abd175ed36cc35e6bca4c777913` |

Giới hạn thẩm định: Controller đã đọc mã nguồn, log và xem ảnh; chưa chạy Chrome/CDP độc lập trong môi trường này. Vì vậy số đo runtime của Antigravity chỉ được chấp nhận khi script, assertion và log tạo thành chuỗi bằng chứng có thể kiểm toán.

---

## 3. Kết quả theo Gate

| Gate | Kết quả | Nhận định |
|---|---|---|
| G01 — New-brief integrity | `CONDITIONAL_PASS` | Mã nguồn giữ đúng tám tuple canonical T01–T08 và tạo DNA mới; báo cáo lại mô tả một bộ dữ liệu tour cũ, cần đồng bộ. |
| G02 — Baseline integrity | `PASS` | Baseline có đủ dữ liệu, tìm kiếm/lọc/chi tiết/FSM cơ bản và không bị cố ý làm xấu. |
| G03 — IA transfer | `REPAIR_REQUIRED` | Điều hướng đang trộn nhóm workflow, trạng thái và thời gian vào cùng một hàng “Nhóm”; báo cáo chưa có bản đồ T01–T08 cho cả hai scheme. |
| G04 — Interaction transfer | `FAIL_BLOCKING` | FSM dùng hai nút submit/retry khác nhau; không giữ một phần tử hành động ổn định; success có thể cướp focus; log thiếu bộ đếm bắt buộc. |
| G05 — Art-direction transfer | `PASS` | Hai hướng A/B khác nhau thật trên typography, composition và data treatment; Hướng A phù hợp brief và khác DNA TRACE. |
| G06 — Critique transfer | `REPAIR_REQUIRED` | Báo cáo nói hai thay đổi nhưng diff thực tế có thêm thay đổi; “icon ngữ nghĩa” chưa được triển khai; tuyên bố giảm 40% chưa có số đo. |
| G07 — Accessibility/responsive transfer | `REPAIR_REQUIRED` | Ảnh không cho thấy tràn ngang; nhưng nút `Chi tiết` bị hạ `min-height` xuống 40px và bằng chứng contrast/focus/target-size/zero-motion chưa đủ. |
| G08 — Evidence integrity | `FAIL_BLOCKING` | Script phụ thuộc đường dẫn Windows tuyệt đối, T10/T11/T12/T14 kiểm chưa đúng contract, và biến `allPassed` không tổng hợp toàn bộ T01–T14. |

Module chỉ được hoàn tất khi cả tám Gate đạt `PASS`.

---

## 4. Những phần đã đạt và phải được bảo toàn

### 4.1 Dữ liệu canonical trong mã nguồn

Controller xác nhận `baseline/index.html`, `candidate/pre_critique.html` và `candidate/index.html` chứa đúng tám tour của directive, bao gồm:

- T01 Hạ Long 2N1Đ;
- T02 Ninh Bình 1 ngày;
- T03 Sapa 3N2Đ;
- T04 Đà Nẵng 4N3Đ;
- T05 Hà Giang 3N2Đ;
- T06 Phú Quốc 3N2Đ;
- T07 Mộc Châu 2N1Đ;
- T08 Huế 3N2Đ.

Tập `Cần xử lý = T01, T03, T06` và tập `Trong 48 giờ = T01, T02` cũng đúng trong mã nguồn.

### 4.2 Chất lượng hướng thị giác

- Direction A và Direction B khác nhau có chủ đích, không phải đổi màu bề mặt.
- Candidate Hướng A tạo ngôn ngữ “dispatch ledger” riêng, không lặp lại Structural Precision của Module 05.
- T01 có tiêu điểm rõ nhưng vẫn giữ đường dẫn tới toàn bộ tám tour.
- Bảng ledger trên desktop có trục căn và nhịp hàng tốt.
- Bản tablet/mobile hiện tại dễ đọc, không thấy chồng lấn hay cắt chữ trong ảnh đã nộp.
- Trạng thái có nhãn chữ; màu không phải tín hiệu duy nhất.

Các điểm này không được suy giảm trong vòng sửa.

---

## 5. F01 — Đồng bộ dữ liệu và audit trail

### Phát hiện

Mục “Canonical Data Confirmation” trong `DESIGN_TRAINING_007_REPORT.md` đang ghi một bộ dữ liệu cũ, khác directive và khác chính mã nguồn canonical. Ví dụ:

- T01 bị mô tả thành “Chờ khách sạn xác nhận phòng 204” thay vì “Khách sạn chưa xác nhận 4 phòng”;
- T02 bị đổi ngày, người phụ trách và ghi chú;
- T04–T08 bị đổi tên tour, giờ, người và nội dung;
- trạng thái T03 bị đổi từ “Thiếu hồ sơ” thành “Thiếu thông tin”.

Báo cáo còn dùng liên kết tuyệt đối:

```text
file:///C:/Users/game/.../DESIGN_CONTRACT.yaml
```

Tệp directive đóng trong ZIP không phải bản byte-identical của directive Controller phát hành; nội dung đã bị reflow và mất cấu trúc Markdown gốc.

### Chỉ thị sửa bắt buộc

1. Thay bảng dữ liệu trong báo cáo bằng đúng tám tuple nguyên văn từ directive.
2. Không thay mã nguồn canonical hiện tại nếu tuple đã đúng.
3. Đổi mọi liên kết trong báo cáo sang đường dẫn tương đối, ví dụ `./DESIGN_CONTRACT.yaml`.
4. Đóng lại đúng bản `DESIGN_TRAINING_007_DIRECTIVE.md` gốc do Controller phát hành, không reformat.
5. Cập nhật hash của mọi tệp thay đổi trong báo cáo và `CHANGE_LEDGER.md`.
6. Thêm kiểm thử so sánh sâu từng trường của cả tám tuple, không chỉ kiểm tra sự tồn tại của ID.

### Điều kiện đóng F01

```yaml
canonical_tuple_count: 8
canonical_tuple_deep_equal: true
report_matches_canonical: true
absolute_file_links: 0
directive_original_preserved: true
```

---

## 6. F02 — Tách scheme IA khỏi các bộ lọc thuộc tính

### Phát hiện

Hàng điều khiển mang nhãn “Nhóm” hiện chứa đồng thời:

- `Cần xử lý`: view theo nhu cầu hành động;
- `Sẵn sàng`, `Đã hoàn thành`: trạng thái;
- `Trong 48 giờ`: thuộc tính thời gian.

Đây là tập saved views/faceted filters pha trộn, chưa chứng minh một organization scheme “theo luồng xử lý nghiệp vụ” thuần nhất. Báo cáo cũng chưa ánh xạ T01–T08 vào cả Phương án A và Phương án B, nên chưa thể đối chiếu việc thực thể thông tin thật sự di chuyển giữa hai scheme.

### Chỉ thị sửa bắt buộc

Antigravity phải chọn một trong hai cách sau và triển khai nhất quán:

#### Cách được khuyến nghị

- Dùng điều hướng cấp một thuần workflow, ví dụ:
  - `Cần xử lý`;
  - `Đang chuẩn bị`;
  - `Sẵn sàng`;
  - `Đã hoàn thành`.
- Tách `Trong 48 giờ` thành một bộ lọc thời gian độc lập, có label rõ.
- Giữ `Người phụ trách` là bộ lọc thuộc tính độc lập.
- Search, workflow group, time filter và owner filter kết hợp theo phép giao `AND`.

#### Cách thay thế hợp lệ

- Gọi hàng hiện tại đúng bản chất là `Chế độ xem đã lưu` hoặc `Lối tắt điều phối`;
- đồng thời phải triển khai một scheme điều hướng chính riêng, không trộn với các faceted filters.

### Bằng chứng IA bắt buộc

Bổ sung vào báo cáo:

1. Bảng ánh xạ T01–T08 cho Phương án A.
2. Bảng ánh xạ T01–T08 cho Phương án B.
3. Ba tình huống truy xuất cụ thể và so sánh số bước/điểm mơ hồ giữa hai phương án.
4. Hai trade-off có điều kiện; không dùng các câu như “tối ưu hóa triệt để hiệu suất” khi chưa có nghiên cứu người dùng.
5. Mô tả đúng: đây là design hypothesis phục vụ dispatch operator, chưa phải bằng chứng năng suất thực địa.

### Hồi quy bắt buộc

- `Cần xử lý` vẫn trả T01, T03, T06.
- `Trong 48 giờ` độc lập vẫn trả T01, T02 theo mốc khóa.
- `Cần xử lý AND Huy AND nhaxe` vẫn trả duy nhất T06.
- Reset trả đủ T01–T08 và focus về search.

---

## 7. F03 — Sửa FSM theo hợp đồng phần tử ổn định

### Phát hiện chặn

Candidate hiện có đồng thời:

- `#btn-save-contact-note`;
- `#btn-retry-contact-note`.

Khi lỗi, nút retry riêng được hiện lên và focus chuyển sang nó. Khi retry, code gọi programmatic click lên nút submit khác. Điều này vi phạm trực tiếp invariant đã khóa:

> Một primary action element duy nhất phải tồn tại ổn định trong DOM xuyên suốt editing → saving → error → retry saving.

Ở trạng thái success, code còn gọi `submitBtn.focus()` vô điều kiện; đây có thể cướp focus nếu người dùng đã Tab sang vị trí khác trong khi chờ phản hồi.

### Chỉ thị sửa bắt buộc

1. Chỉ dùng một nút primary action có một ID ổn định trong các trạng thái:
   - editing: `Lưu nhật ký`;
   - saving lần 1: `Đang lưu nhật ký…`;
   - error: `Thử lưu lại`;
   - retry saving: `Đang lưu nhật ký…`.
2. Không tháo nút khỏi DOM, không thay nó bằng nút khác, không dùng nút retry phụ.
3. Khi saving:
   - chặn duplicate submit;
   - giữ focus trên chính nút nếu nó là phần tử kích hoạt;
   - dùng trạng thái disabled/`aria-disabled` nhất quán nhưng không làm focus rơi về `body`.
4. Validation lỗi phải focus textarea; `attemptCount = 0`, `commitCount = 0`.
5. Lần hợp lệ đầu:
   - bắt đầu request: `attemptCount = 1`;
   - sau đúng mô hình trễ 800ms: error;
   - `commitCount = 0`;
   - draft giữ nguyên.
6. Retry:
   - `attemptCount = 2` ngay khi request bắt đầu;
   - success sau 800ms;
   - chỉ tạo đúng một committed activity;
   - `commitCount = 1`.
7. T01 vẫn giữ trạng thái canonical `Chờ đối tác` sau success.
8. Chuyển focus sau success chỉ được thực hiện có điều kiện:
   - nếu focus vẫn ở transaction control, chuyển tới hành động kế nhiệm hợp lý;
   - nếu người dùng đã Tab sang phần tử ổn định khác, giữ focus tại đó.
9. Áp dụng cùng bản sửa chức năng cho baseline, pre-critique và candidate để bảo toàn parity; ghi đây là `COMMON_COMPLIANCE_PATCH`, không tính vào hai thay đổi critique.

### Kịch bản bắt buộc

- Empty submit bằng Enter.
- 161 ký tự bị chặn; sửa còn 160 ký tự được nhận.
- First valid attempt lỗi.
- Pointer click và native Enter bổ sung trong saving không làm tăng counter.
- Retry bằng native keyboard giữ cùng DOM node và cùng ID.
- No-steal test khi người dùng Tab khỏi control trong thời gian chờ.
- Success chỉ có một activity và status T01 không đổi.

---

## 8. F04 — Khóa lại phạm vi critique và tính trung thực của thay đổi

### Phát hiện

Báo cáo công bố “chính xác hai thay đổi”, nhưng diff pre-critique → final thể hiện nhiều phần khác:

- lưới mobile `50px 1fr auto`;
- breakpoint đổi từ 420px sang 480px;
- search chuyển sang xếp dọc;
- thêm `min-width: 0`;
- đổi kích thước/padding một số control;
- đổi typography hộp feedback;
- báo cáo nói thêm icon ngữ nghĩa nhưng candidate chưa thực sự thêm icon vào trạng thái saving/error/success.

Tuyên bố “giảm 40% chiều dài cuộn” không có số đo `scrollHeight` trước/sau cùng điều kiện. Ba learning được gắn `PROVEN` vượt quá sức nặng của bằng chứng hiện có.

### Chỉ thị sửa bắt buộc

1. Trước khi critique, đưa các sửa thuần compliance dùng chung vào baseline, pre-critique và candidate:
   - chống tràn search;
   - target size;
   - FSM stable action;
   - sửa IA bắt buộc.
2. Sau common patch, khóa hash mới của baseline và pre-critique.
3. Diff `pre_critique.html` → `candidate/index.html` chỉ được chứa tối đa hai thay đổi thiết kế liên quan trực tiếp tới một hypothesis.
4. Phương án rõ nhất:
   - Change 1: tái cấu trúc nhịp ledger mobile hai dòng;
   - Change 2: thêm semantic icon + text cho feedback FSM bằng DOM an toàn.
5. Nếu giữ Change 2, phải triển khai icon thật cho saving/error/success; không được chỉ đổi font-weight.
6. Bỏ con số 40% nếu không đo `scrollHeight` pre/final cùng viewport, trạng thái và dữ liệu.
7. Đổi mức tri thức thành `EXERCISE_SUPPORTED`; chỉ dùng mức mạnh hơn nếu có phép đo trực tiếp phù hợp.
8. Thêm ảnh `pre_critique_mobile_390x844.png` vì defect được phát hiện trên mobile.

---

## 9. F05 — Sửa accessibility và verification harness

### 9.1 Target size

Candidate override `.btn-open-detail` thành `min-height: 40px` ở mobile. Mức này thấp hơn invariant 44×44 CSS px của bài tập.

Yêu cầu:

- mọi CTA và control chính đạt ít nhất 44×44 CSS px;
- đo bằng `getBoundingClientRect()` ở 390px;
- không suy ra target size chỉ từ CSS token.

### 9.2 Portability

`verify_module_007.js` đang require Puppeteer bằng đường dẫn Windows tuyệt đối:

```js
require('C:/Users/game/cdp_reader/node_modules/puppeteer-core')
```

Yêu cầu:

- resolve `puppeteer-core` theo dependency cục bộ hoặc fallback có thông báo rõ;
- resolve mọi đường dẫn bằng `__dirname`;
- nhận CDP port từ CLI hoặc `process.env.CDP_PORT`, có default được ghi rõ;
- không còn đường dẫn phụ thuộc máy tác giả.

### 9.3 T10 duplicate guard

Script hiện chỉ gọi một DOM click trong saving rồi kết luận `blocked` từ thuộc tính disabled. Đây chưa chứng minh duplicate guard.

T10 phải:

1. bắt đầu valid submit;
2. trong saving, thử thêm một pointer click thực và một native Enter;
3. ghi `targetedElement`, `activeElementBefore`, `activeElementAfter`;
4. assert `attemptCount === 1`, `commitCount === 0` trong/đến hết lỗi lần đầu.

### 9.4 T11 native keyboard journey

Log phải ghi theo từng bước:

- phím được nhấn;
- phần tử đích;
- `activeElementBefore` và `activeElementAfter`;
- focus có rơi về `body` hay không;
- phần tử quan trọng có nằm trong viewport hay không;
- focus sau Back có trở về đúng nút mở chi tiết.

Không gọi hành trình là “16 bước” nếu log không có đúng và đủ 16 bước xác định.

### 9.5 T12 responsive, contrast, focus và motion

Yêu cầu sửa:

- quét computed style của toàn bộ phần tử, không dùng `slice(0, 100)` rồi báo quét 183/183;
- fail khi phần tử đo contrast không tồn tại; cấm fallback `|| 5`;
- đo đủ các cặp representative:
  - body text/background;
  - muted text/background;
  - CTA text/background;
  - từng status text/background;
  - feedback error/success text/background;
  - focus indicator so với màu liền kề;
- kiểm semantic label/live region/error association bằng assertion cụ thể;
- đo target size của các control chính ở mobile;
- đo overflow tại 1440×900, 768×1024 và 390×844 cho baseline và candidate.

### 9.6 T14 parity

Parity không được chỉ kiểm “cả hai cùng truthy”. Phải so sánh actual outcomes:

- exact ID arrays;
- exact message strings;
- exact counters;
- exact state transitions;
- exact committed activity count/content;
- exact context/focus outcomes;
- safe text rendering;
- kết quả T01–T13 phù hợp phạm vi parity.

### 9.7 Overall verdict

`allPassed` hiện không tổng hợp tất cả assertion T01–T14. Script có thể xuất `PASS` dù một số test riêng lẻ fail.

Yêu cầu duy nhất hợp lệ:

```js
const assertionEntries = Object.values(verificationOutput.assertions);
const allPassed = assertionEntries.every(test => test.pass === true);
```

Có thể tổ chức code khác, nhưng verdict cuối phải là phép hội của toàn bộ T01–T14 và không có fallback làm nhẹ tiêu chí.

---

## 10. Yêu cầu ảnh vòng sửa

Phải chụp lại từ đúng code đã đóng gói:

1. `baseline_desktop_1440x900.png`
2. `baseline_mobile_390x844.png`
3. `direction_a_desktop_1440x900.png`
4. `direction_b_desktop_1440x900.png`
5. `pre_critique_desktop_1440x900.png`
6. `pre_critique_mobile_390x844.png`
7. `candidate_final_desktop_1440x900.png`
8. `candidate_final_tablet_768x1024.png`
9. `candidate_final_mobile_390x844.png`
10. `candidate_t01_error_mobile_390x844.png`
11. `candidate_t01_retry_saving_mobile_390x844.png`
12. `candidate_t01_success_mobile_390x844.png`

Nếu tái sử dụng ảnh Direction A/B vì hai tệp đó không đổi, báo cáo phải ghi rõ `REUSED_UNCHANGED_SOURCE` và xác nhận hash nguồn không đổi.

Ảnh trạng thái lỗi/retry/success phải được tạo bằng tương tác cập nhật input thật, để bộ đếm ký tự trên ảnh khớp nội dung textarea.

---

## 11. Gói nộp vòng sửa

Tên gói bắt buộc:

```text
design_training_007_submission_r02.zip
```

Cấu trúc tối thiểu:

```text
design_training_007_submission_r02.zip
├── baseline/
│   └── index.html
├── directions/
│   ├── option_a.html
│   └── option_b.html
├── candidate/
│   ├── pre_critique.html
│   └── index.html
├── DESIGN_CONTRACT.yaml
├── DESIGN_TRAINING_007_DIRECTIVE.md
├── DESIGN_TRAINING_007_REPORT.md
├── DESIGN_TRAINING_007_REVIEW_001.md
├── CHANGE_LEDGER.md
├── VERIFICATION.json
├── verify_module_007.js
└── screenshots/
    └── ...
```

Quy chuẩn:

- ZIP dùng dấu `/` thuần;
- không chứa đường dẫn tuyệt đối;
- không chứa dependency folder;
- report dẫn tệp bằng đường dẫn tương đối;
- mọi hash được tính lại sau khi khóa gói;
- `VERIFICATION.json` phải được tạo từ script trong chính gói;
- script phải trả exit code khác 0 khi một assertion fail;
- báo cáo không được ghi `PASS` trước khi Controller nghiệm thu.

---

## 12. Mẫu báo cáo bàn giao vòng sửa

```yaml
SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_001
PACKAGE: design_training_007_submission_r02.zip
SHA256: <sha256>

REPAIR_STATUS:
  F01_DATA_AND_AUDIT_TRAIL: CLOSED | OPEN
  F02_IA_SEPARATION: CLOSED | OPEN
  F03_STABLE_ACTION_FSM: CLOSED | OPEN
  F04_CRITIQUE_SCOPE: CLOSED | OPEN
  F05_VERIFICATION_AND_A11Y: CLOSED | OPEN

GATES:
  G01: SELF_CHECK_PASS | FAIL
  G02: SELF_CHECK_PASS | FAIL
  G03: SELF_CHECK_PASS | FAIL
  G04: SELF_CHECK_PASS | FAIL
  G05: SELF_CHECK_PASS | FAIL
  G06: SELF_CHECK_PASS | FAIL
  G07: SELF_CHECK_PASS | FAIL
  G08: SELF_CHECK_PASS | FAIL

ASSERTIONS:
  passed: <n>
  total: 14
  overall: SELF_CHECK_PASS | FAIL

OPEN_RISKS:
  - <risk hoặc none>
```

---

## 13. Điều kiện PASS vòng kế tiếp

Vòng sửa 1/2 chỉ được PASS khi:

1. code và report cùng dùng đúng tám tuple canonical;
2. IA scheme được tách khỏi time/owner filters và có hai bảng mapping thực thể;
3. FSM dùng một primary action element ổn định;
4. focus preservation và no-steal đều có bằng chứng;
5. counter/state/commit được assert đúng;
6. critique chỉ có một hypothesis và tối đa hai thay đổi thật;
7. claim không vượt quá phép đo;
8. target chính đạt 44×44 CSS px;
9. script portable và không dùng đường dẫn máy tác giả;
10. T01–T14 đều là assertion thật;
11. overall verdict là phép hội của toàn bộ T01–T14;
12. ảnh và log được sinh từ đúng source đã đóng gói;
13. không suy giảm art direction đã được ghi nhận;
14. không có blocker mới.

Nếu vòng sửa này chưa đóng đủ các điểm trên, chỉ còn một vòng sửa cuối 2/2 trước khi dừng và báo cáo Lead Architect.

---

## 14. Phán quyết cuối tài liệu

```yaml
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
CAPSTONE_TRANSFER_STAGE: IN_PROGRESS
ART_DIRECTION_A: ACCEPTED_PENDING_REGRESSION
REPAIR_ROUND_USED: 1/2
NEXT_ACTION: SUBMIT_DESIGN_TRAINING_007_REPAIR_001
```

