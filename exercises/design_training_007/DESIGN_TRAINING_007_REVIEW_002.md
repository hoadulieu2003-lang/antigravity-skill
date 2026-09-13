# DESIGN_TRAINING_007_REVIEW_002

## 1. Phán quyết

```yaml
REVIEW_ID: DESIGN_TRAINING_007_REVIEW_002
SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_001
PACKAGE: design_training_007_submission_r02.zip
PACKAGE_SHA256_VERIFIED: 73201ed564fe14a3f02691303108aa0bd399556184b7b94132baa8a70dedc2d2
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND: 2/2
FINAL_REPAIR_ROUND: true
NEXT_SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_002
```

Vòng sửa 1 đã đóng được phần lớn lỗi sản phẩm và chứng minh năng lực chuyển giao về mặt thiết kế. Tuy nhiên, kết quả `14/14 PASS` trong `VERIFICATION.json` chưa đạt chuẩn bằng chứng vì một số phép kiểm vẫn có thể báo đạt khi dữ liệu đo rỗng, focus đã rơi về `BODY`, hoặc assertion chưa kiểm đúng yêu cầu.

Đây là vòng sửa cuối 2/2. Không được đổi art direction hoặc mở rộng chức năng.

---

## 2. Phạm vi Controller đã đối soát

Controller đã kiểm tra:

- SHA-256 gói ZIP;
- cấu trúc và dấu phân cách đường dẫn ZIP;
- checksum baseline, pre-critique và candidate;
- diff `candidate/pre_critique.html` → `candidate/index.html`;
- dữ liệu canonical trong ba source;
- IA trong source và báo cáo;
- FSM trong baseline/candidate;
- `verify_module_007.js` và toàn bộ `VERIFICATION.json`;
- ảnh desktop, tablet, mobile và ba trạng thái FSM.

Giới hạn: Controller chưa chạy Chrome/CDP độc lập trong môi trường thẩm định này. Phán quyết dựa trên mã nguồn, ảnh và tính kiểm toán được của harness do Antigravity nộp.

---

## 3. Những điểm đã đóng thành công

### 3.1 F01 — Dữ liệu source và liên kết báo cáo

- `baseline/index.html`, `candidate/pre_critique.html` và `candidate/index.html` dùng đúng tám tuple canonical.
- Bảng canonical trong báo cáo đã được sửa đúng.
- Liên kết `DESIGN_CONTRACT.yaml` trong báo cáo đã chuyển sang đường dẫn tương đối.

### 3.2 F02 — Phân tầng IA trong giao diện

Giao diện đã tách đúng:

- tầng điều hướng workflow: Tất cả, Cần xử lý, Đang chuẩn bị, Sẵn sàng, Đã hoàn thành;
- bộ lọc thời gian riêng;
- bộ lọc người phụ trách riêng;
- search kết hợp theo phép giao `AND`.

### 3.3 F03 — Một nút hành động trong DOM

- Candidate chỉ còn `#btn-save-contact-note` cho toàn bộ chu trình.
- Baseline chỉ còn `#btn-submit-contact`.
- Nút đổi nhãn tại chỗ qua saving → error → retry → success.
- T01 vẫn giữ trạng thái `Chờ đối tác` sau khi ghi nhật ký.

### 3.4 F04 — Phạm vi critique

Diff pre-critique → candidate final hiện chỉ chứa hai thay đổi thiết kế thật:

1. grid mobile `50px 1fr auto`;
2. icon ngữ nghĩa trong feedback.

Thay đổi `<title>` chỉ là metadata phiên bản, không tính là quyết định thiết kế.

Phép đo chiều cao 2950px → 2480px cho cùng viewport đã đủ để giữ kết luận `EXERCISE_SUPPORTED`, với điều kiện không suy diễn thành kết quả nghiên cứu người dùng.

### 3.5 F05 — Visual direction

- Art Direction A tiếp tục được chấp nhận.
- Bố cục mobile mới gọn hơn pre-critique.
- Ảnh error, retry-saving và success thể hiện rõ trạng thái.
- Bộ đếm ký tự trong ảnh error đã khớp nội dung nhập.

Các điểm trên được khóa và không cần thiết kế lại.

---

## 4. Kết quả Gate sau vòng sửa 1

| Gate | Kết quả | Nhận định |
|---|---|---|
| G01 — New-brief integrity | `PASS` | Source và report đã dùng đúng dữ liệu TRIPFLOW. |
| G02 — Baseline integrity | `PASS` | Baseline hợp lệ và được common-patch thay vì làm yếu. |
| G03 — IA transfer | `CONDITIONAL_PASS` | UI phân tầng đúng; hồ sơ so sánh scheme còn thiếu mapping đầy đủ và có hai kết luận sai dữ liệu. |
| G04 — Interaction transfer | `FAIL_BLOCKING` | Nút DOM ổn định nhưng focus vẫn rơi về `BODY` trong saving; no-steal chưa được kiểm. |
| G05 — Art-direction transfer | `PASS` | Hai hướng khác biệt thật; Hướng A được giữ. |
| G06 — Critique transfer | `PASS` | Một hypothesis, hai thay đổi và phép đo có giới hạn hợp lệ. |
| G07 — Accessibility/responsive | `FAIL_BLOCKING` | T11 ghi focus ngoài viewport; T12 thiếu các cặp contrast/focus/semantics bắt buộc. |
| G08 — Evidence integrity | `FAIL_BLOCKING` | Deep tuples rỗng, T10 không dùng pointer thật, T14 chưa deep parity và script còn đường dẫn máy tác giả. |

---

## 5. R01 — Hoàn tất hồ sơ IA và bảo toàn tài liệu gốc

### 5.1 Tài liệu phát hành chưa byte-identical

Hai tệp đóng trong ZIP chưa phải bản nguyên gốc Controller đã phát hành.

| Tệp | SHA-256 bản Controller | SHA-256 trong gói R02 |
|---|---|---|
| `DESIGN_TRAINING_007_DIRECTIVE.md` | `0840d95724643b730237444005d20a6097d98ec72bc0b40441e1ee6e8064d7d7` | `7bc7dbd5d6e304c06d540327e6b7df29100e02484fdc0e3ef326ace85eec1777` |
| `DESIGN_TRAINING_007_REVIEW_001.md` | `f545d0fb2eb693256066cfdf4a0493a4535e7292ad7c8d4214a87a8c994fdd00` | `b234307aed224335ea3b9fb5a8faeb1f411c61237da76b5efc18c4c0fee8271e` |

Yêu cầu:

1. Đưa đúng bytes của hai tệp Controller vào gói cuối.
2. Không reflow, đổi heading, xóa code fence hoặc tái xuất Markdown.
3. Ghi checksum hai tệp vào audit ledger.

### 5.2 Bảng mapping IA chưa đủ

Review 001 yêu cầu hai bảng ánh xạ T01–T08 cho cả Scheme A và Scheme B. Báo cáo mới có bảng so sánh tiêu chí chung và bảng canonical mang nhóm của Scheme B; chưa có bảng mapping đầy đủ cho Scheme A.

Yêu cầu thêm một bảng duy nhất:

| Tour | Scheme A — nhóm thời gian | Scheme B — nhóm workflow | Time facet | Owner facet |
|---|---|---|---|---|
| T01 | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |
| T08 | ... | ... | ... | ... |

Không thay đổi UI để phục vụ bảng tài liệu này.

### 5.3 Sửa ba kết luận sai hoặc vượt bằng chứng

- Huy chỉ phụ trách `T03` và `T06`; báo cáo hiện ghi thêm `T05`, trong khi T05 thuộc Minh.
- `Đang chuẩn bị AND Trong 48 giờ` trả về `0` tour theo dữ liệu canonical; phải ghi rõ empty result hoặc chọn kịch bản khác có kết quả.
- Các cụm “hoàn hảo”, “vượt trội”, “0 bỏ sót”, “giảm 66%” chỉ được giữ nếu ghi rõ đây là phép đếm thao tác theo mô hình bài tập, không phải kết quả usability study.

Điều kiện đóng R01:

```yaml
ORIGINAL_DIRECTIVE_HASH_MATCH: true
ORIGINAL_REVIEW_001_HASH_MATCH: true
IA_MAPPING_ROWS: 8
IA_SCENARIOS_FACTUALLY_CORRECT: true
USER_RESEARCH_CLAIMED: false
```

---

## 6. R02 — Giữ focus thật sự xuyên suốt saving và chứng minh no-steal

### 6.1 Bằng chứng hiện tại tự phủ định kết luận PASS

`VERIFICATION.json` ghi tại T10:

```json
{
  "btnStillDisabled": true,
  "activeTag": "BODY"
}
```

Như vậy phần tử DOM vẫn tồn tại nhưng focus đã rơi khỏi nút trong trạng thái saving. Nguyên nhân là code dùng `actionBtn.disabled = true`; trình duyệt có thể loại phần tử disabled khỏi focus order.

Đây vẫn là vi phạm invariant của Module 04 và Directive 007.

### 6.2 Sửa bắt buộc

1. Giữ một nút duy nhất như hiện tại.
2. Không dùng native `disabled=true` cho nút đang cần giữ focus.
3. Dùng:
   - `aria-disabled="true"`;
   - class trạng thái để tạo visual disabled;
   - guard `isSavingActive`/`isSaving` trong handler để chặn click và Enter.
4. Textarea có thể bị khóa trong saving, nhưng nút kích hoạt phải tiếp tục là `document.activeElement` nếu người dùng chưa rời đi.
5. Khi error, giữ focus trên cùng node; không gọi focus để che giấu việc focus đã rơi trước đó.
6. Khi retry saving, vẫn giữ cùng node và ID.
7. Khi success:
   - nếu focus vẫn ở action button, giữ focus hoặc chuyển theo contract đã ghi;
   - nếu người dùng đã Tab/Shift+Tab sang control ổn định khác, tuyệt đối không kéo focus về action button.

### 6.3 Hai ca kiểm bắt buộc

#### Focus preservation

```yaml
active_before_submit: <stable-action-id>
active_during_saving: <same-stable-action-id>
active_after_error: <same-stable-action-id>
active_during_retry_saving: <same-stable-action-id>
same_node_identity: true
body_focus_events: 0
```

`same_node_identity` phải được kiểm bằng reference giữ trong cùng `page.evaluate`, hoặc một định danh node ổn định có phép kiểm rõ; không chỉ so sánh text label.

#### No-steal

1. Bắt đầu retry bằng bàn phím.
2. Trong 800ms, Tab hoặc Shift+Tab sang một control ổn định khác.
3. Ghi `activeElementBeforeSuccess`.
4. Chờ success.
5. Assert `activeElementAfterSuccess === activeElementBeforeSuccess`.

Áp dụng cùng bản sửa cho baseline, pre-critique và candidate; ghi `COMMON_COMPLIANCE_PATCH`, không tính vào critique diff.

---

## 7. R03 — Sửa verification harness để PASS có nghĩa

### 7.1 Portability vẫn chưa đóng

Script còn fallback tuyệt đối:

```js
require('C:/Users/game/cdp_reader/node_modules/puppeteer-core')
```

Phải xóa hoàn toàn. Nếu `require('puppeteer-core')` thất bại, script phải in hướng dẫn cài dependency rồi exit khác 0. Không được truy cập đường dẫn riêng của máy tác giả.

### 7.2 T01 deep tuple đang kiểm mảng rỗng

`VERIFICATION.json` hiện ghi:

```json
"deepTuples": []
```

Nguyên nhân: top-level `const CANONICAL_TOURS` không tự trở thành `window.CANONICAL_TOURS`.

Sửa truy xuất bằng lexical binding trong page context, ví dụ theo nguyên tắc:

```js
const source = typeof CANONICAL_TOURS !== 'undefined' ? CANONICAL_TOURS : null;
```

T01 chỉ PASS khi:

- source tồn tại;
- `deepTuples.length === 8`;
- từng trường của từng tuple deep-equal với fixture canonical độc lập nằm trong test harness;
- rendered rows cũng khớp tám tuple.

Fixture expected phải được định nghĩa độc lập trong `verify_module_007.js`; không được lấy expected từ chính source cần kiểm.

### 7.3 T10 chưa phải pointer + keyboard test

Hiện tại “pointer click” là `btn.click()` trong `page.evaluate`; đây là programmatic DOM click. “Form submit” là `dispatchEvent`, cũng không phải người dùng thật. Native Enter được gửi khi `activeTag` đã là `BODY`.

T10 phải dùng:

- `page.click(selector)` cho pointer attempt;
- focus nút bằng natural Tab hoặc kiểm chính xác `document.activeElement` rồi `page.keyboard.press('Enter')` cho keyboard attempt;
- log riêng `pointer_method`, `keyboard_method`, target, active before/after;
- assert counters sau từng attempt, không chỉ sau khi error.

Cấm fallback số giả như:

```js
window.attemptCount || 1
window.commitCount || 0
```

Nếu counter không truy cập được thì test phải fail.

### 7.4 T11 bỏ sót viewport failure

Log T11 bước 12 ghi:

```json
{
  "id": "btn-back-to-ledger",
  "inViewport": false
}
```

Nhưng `t11_pass` không kiểm `inViewport`, nên vẫn báo PASS.

Yêu cầu:

- khi mở detail, định vị tức thì vùng bắt đầu detail hoặc control nhận focus vào viewport;
- không dùng smooth scroll;
- mọi bước trọng yếu phải có `inViewport: true`;
- assertion T11 phải kiểm cả expected ID/tag lẫn viewport và `focusInBody === false`;
- hàm `recordStep` phải thật sự so sánh `expectedTag`/expected ID, không nhận tham số rồi bỏ qua.

### 7.5 T12 chưa đủ phạm vi đã khóa

Hiện T12 chỉ đo tám cặp chữ/status. Nó chưa đo:

- CTA text/background;
- feedback saving/error/success;
- focus indicator với màu liền kề;
- semantic live region/error association;
- chi tiết từng target size và expected count.

Sửa bắt buộc:

1. Khai báo danh sách cặp contrast bắt buộc với selector, foreground, background và threshold.
2. Mọi selector thiếu phải tạo failure; `Object.values({}).every(...)` không được phép PASS.
3. Focus ring kiểm theo ngưỡng non-text 3:1 với nền liền kề.
4. Trạng thái feedback phải được đưa lần lượt vào saving/error/success trước khi đo.
5. Log toàn bộ target-size records, không chỉ Boolean tổng.
6. Assert expected target count và các control trọng yếu, bao gồm search, reset, workflow buttons, selects, detail buttons, action và Back.
7. Kiểm `role="status"`, `aria-live`, `aria-describedby` và association lỗi bằng assertion cụ thể.

### 7.6 T14 chưa phải deep parity T01–T13

T14 hiện:

- không có parity T11 và T12;
- nhiều mục chỉ so sánh hai Boolean;
- không so exact messages;
- không so full state/counter/focus outcomes;
- T01 parity đang so hai mảng rỗng.

Yêu cầu T14 so sánh normalized outcome object của baseline và candidate, gồm:

- tám canonical tuples;
- exact result ID arrays của search/filter;
- empty/reset state;
- detail context và focus;
- validation message + focus + counters;
- error/success message + counters + draft/commit;
- stable-node/focus/no-steal;
- safe rendering;
- responsive/keyboard/accessibility invariants thuộc phạm vi dùng chung.

Không yêu cầu hai bản có cùng CSS hoặc art direction.

### 7.7 Verdict và log

Công thức conjunction hiện đã đúng về cấu trúc và được giữ lại. Tuy nhiên từng assertion con phải được sửa như trên; conjunction của các phép kiểm yếu vẫn không tạo bằng chứng mạnh.

Script phải:

- exit `0` chỉ khi T01–T14 đều pass;
- exit khác `0` nếu selector/fixture/counter thiếu;
- ghi phương thức tương tác trung thực;
- tạo lại `VERIFICATION.json` từ chính script trong gói cuối.

---

## 8. R04 — Dọn gói và đồng bộ báo cáo

Gói hiện có 15 ảnh trong khi báo cáo nói 12, bao gồm các tên cũ trùng mục đích:

- `candidate_mobile_error_390x844.png`;
- `candidate_mobile_success_390x844.png`;
- các ảnh canonical mới có prefix `candidate_t01_...`.

Yêu cầu:

1. Gói cuối chỉ giữ đúng bộ ảnh authoritative được liệt kê trong report.
2. Không để ảnh cũ gây mơ hồ provenance.
3. Chụp lại ảnh bị ảnh hưởng bởi common focus patch.
4. Cập nhật hash baseline/pre/candidate sau common patch.
5. Không ghi `PASS` như phán quyết Controller; chỉ ghi `SELF_CHECK_PASS`.

---

## 9. Không được thay đổi trong vòng cuối

- Không đổi Hướng A — Dispatch Ledger.
- Không thêm animation, transition, 3D hoặc dark theme.
- Không thêm chức năng ngoài brief.
- Không thay tám tuple canonical.
- Không mở rộng critique quá hai thay đổi đã khóa.
- Không sửa UI chỉ để làm test pass nếu hành vi người dùng vẫn sai.

---

## 10. Bộ ảnh authoritative vòng cuối

Gói cuối giữ đúng 12 ảnh:

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

Direction images được phép tái sử dụng nếu source hash không đổi và report ghi `REUSED_UNCHANGED_SOURCE`.

---

## 11. Gói nộp cuối

```text
design_training_007_submission_r03.zip
├── baseline/index.html
├── directions/option_a.html
├── directions/option_b.html
├── candidate/pre_critique.html
├── candidate/index.html
├── DESIGN_CONTRACT.yaml
├── DESIGN_TRAINING_007_DIRECTIVE.md
├── DESIGN_TRAINING_007_REPORT.md
├── DESIGN_TRAINING_007_REVIEW_001.md
├── DESIGN_TRAINING_007_REVIEW_002.md
├── CHANGE_LEDGER.md
├── VERIFICATION.json
├── verify_module_007.js
└── screenshots/...
```

Yêu cầu bàn giao:

```yaml
SUBMISSION_ID: DESIGN_TRAINING_007_REPAIR_002
PACKAGE: design_training_007_submission_r03.zip
SHA256: <sha256>

FINAL_REPAIR_STATUS:
  R01_IA_AND_ORIGINAL_DOCS: CLOSED | OPEN
  R02_FOCUS_PRESERVATION_NO_STEAL: CLOSED | OPEN
  R03_VERIFICATION_HARNESS: CLOSED | OPEN
  R04_PACKAGE_CLEANUP: CLOSED | OPEN

ASSERTIONS:
  passed: <n>
  total: 14
  overall: SELF_CHECK_PASS | FAIL

FOCUS_INVARIANTS:
  active_during_first_saving: <id>
  active_during_retry_saving: <id>
  body_focus_events: <n>
  no_steal: true | false

OPEN_RISKS:
  - <risk hoặc none>
```

---

## 12. Điều kiện nghiệm thu cuối

Module 07 chỉ được `PASS` khi đồng thời:

1. hai tài liệu Controller khớp đúng checksum;
2. IA mapping đủ tám dòng và ba scenario đúng dữ liệu;
3. active element không rơi về `BODY` trong cả hai saving state;
4. no-steal test có thật và pass;
5. T01 deep-equal tám tuple với fixture độc lập;
6. T10 dùng pointer và native keyboard thật;
7. T11 kiểm focus, expected target và viewport;
8. T12 đo đủ contrast/focus/semantics/target size;
9. T14 deep parity T01–T13;
10. không còn đường dẫn máy tác giả;
11. đúng 12 ảnh authoritative;
12. 14/14 assertion mạnh đều pass;
13. visual direction không hồi quy;
14. không phát sinh blocker mới.

Nếu vòng cuối không đạt, Controller sẽ dừng Module 07 và báo cáo Lead Architect thay vì mở vòng sửa thứ ba.

---

## 13. Trạng thái cuối tài liệu

```yaml
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
CAPSTONE_TRANSFER_STAGE: IN_PROGRESS
ART_DIRECTION_A: ACCEPTED_AND_LOCKED
REPAIR_ROUND_USED: 2/2
NEXT_ACTION: SUBMIT_DESIGN_TRAINING_007_REPAIR_002
```

