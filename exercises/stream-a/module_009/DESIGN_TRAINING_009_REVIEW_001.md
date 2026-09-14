# DESIGN TRAINING 009 — REVIEW 001
## Thẩm định Submission R01 · Accessibility Task Completion

```yaml
REVIEW_ID: DESIGN_TRAINING_009_REVIEW_001
MODULE_ID: DESIGN_TRAINING_009_ACCESSIBILITY
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
SUBMISSION_ID: DESIGN_TRAINING_009_SUBMISSION_R01
PACKAGE_REVIEWED: design_training_009_submission_r01.zip
DECLARED_SHA256: bfbe7d52273fffa357c0daa24b5e432d6a984c4ccceafa166c5cf48f735373b9
OBSERVED_SHA256: bfbe7d52273fffa357c0daa24b5e432d6a984c4ccceafa166c5cf48f735373b9
PACKAGE_BYTES: 2074332
PACKAGE_ENTRIES: 26
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
OWNER: "Anh — Lead Architect / Product Owner"
EXECUTOR: "Antigravity"
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND: 1/2
REPAIR_BUDGET_REMAINING: 1
VISUAL_DIRECTION: ACCEPTED_FOR_REPAIR
NEXT_SUBMISSION: DESIGN_TRAINING_009_REPAIR_001
```

---

## 1. Kết luận điều hành

Gói nộp hợp lệ về mặt vật lý: SHA-256, dung lượng và số lượng 26 entry khớp bản khai; đường dẫn trong ZIP dùng dấu `/`, không có path traversal hoặc entry trùng. Candidate có bố cục sáng, rõ, thứ bậc nội dung hợp lý và cấu trúc native-first đúng hướng.

Tuy nhiên, Module 09 chưa thể nghiệm thu. Controller xác định tám điểm chặn thực thi và kiểm chứng. Ba điểm nghiêm trọng nhất là:

1. ba thông báo lỗi inline đang hiển thị ngay từ trạng thái mở mới do CSS ghi đè thuộc tính `hidden`;
2. các test tự gọi là “native” vẫn dùng `page.focus()` hoặc `element.click()` lập trình;
3. harness không fail-closed: forced-colors không tham gia điều kiện PASS, lỗi runtime không tạo exit code thất bại, và `overall_status` được khởi tạo sẵn là SELF_CHECK_PASS.

Đây là vòng sửa 1/2. Không yêu cầu thay đổi hướng thị giác hoặc kiến trúc Direction A; chỉ sửa đúng các finding dưới đây và tái tạo toàn bộ telemetry/ảnh bị ảnh hưởng.

---

## 2. Phạm vi kiểm tra độc lập

Controller đã thực hiện:

- tính lại SHA-256 và dung lượng archive;
- kiểm tra 26 entry, path traversal, separator và duplicate entry;
- giải nén và đọc `index.html`, baseline, hai direction, contract, report, manual review, AX tree, verification và harness;
- kiểm tra cú pháp JavaScript và JSON;
- đối chiếu SHA-256 của năm source file cùng mười một screenshots với `VERIFICATION.json`;
- đối chiếu byte của các văn bản Controller trong package với bản chính thức;
- xem trực quan ảnh desktop, mobile, validation, text-scale và forced-colors;
- kiểm tra khả năng tái chạy harness trong môi trường Controller.

Controller chưa tái chạy được Chromium session vì gói không cung cấp dependency cục bộ, môi trường hiện tại không có `puppeteer-core`, không có Chromium executable và không có CDP endpoint tại cổng 9223. Dù vậy, các finding dưới đây được chứng minh trực tiếp từ source, ảnh và logic harness; không phụ thuộc việc tin vào telemetry tự khai.

---

## 3. Ma trận gate

| Gate | Phán quyết Controller | Lý do chính |
|---|---|---|
| A01 — Structure | PASS_WITH_SCOPE | Landmarks, một H1 và skip link hiện diện; chưa có phát hiện chặn ở cấu trúc cấp cao. |
| A02 — Name/ARIA graph | PARTIAL | Không có duplicate/orphan theo scanner, nhưng scanner là heuristic DOM, chưa đối chiếu đầy đủ accessible name từ AX tree. |
| A03 — Native keyboard/dialog | FAIL | T03 dùng `page.focus()` và không đưa kết quả focus trap vào phép PASS. |
| A04 — Validation/FSM | FAIL | Error inline hiển thị từ trạng thái mở mới; evidence payload và trạng thái khởi tạo chưa đủ. |
| A05 — Announcement/no-steal | FAIL | T08 dùng DOM click; T09 dùng programmatic focus; chưa kiểm tra node identity/body focus. |
| A06 — Reflow/text scaling | FAIL | Overflow bị che bởi CSS; scale 200% chạy ở 1440px; không đo clipping/overlap như báo cáo. |
| A07 — Forced-colors/targets/contrast | FAIL | Forced-colors không nằm trong conjunction; target inventory thiếu control thật; contrast chỉ đo ba cặp. |
| A08 — Evidence integrity | FAIL | Tài liệu Controller không byte-identical; T12 chỉ đếm artifact; harness không fail-closed. |

---

## 4. Blocking findings

### F01 — Trạng thái mở mới hiển thị lỗi giả

**Bằng chứng**

- Markup đặt `hidden` trên `#error-support-type`, `#error-details-limit` và `#error-confirmation`.
- CSS `.inline-error { display: flex; }` ghi đè cách hiển thị mặc định của `[hidden]`.
- Hai ảnh `final_desktop_1440x900.png` và `final_mobile_390x844.png` cho thấy cả ba lỗi xuất hiện khi form chưa được submit.
- T01/T04 không assert rằng trạng thái mở mới không có lỗi.

**Tác động**

Người dùng nhìn thấy thông báo lỗi trước khi thực hiện hành động; các phần tử được liên kết bằng `aria-describedby` có nguy cơ đưa lỗi giả vào accessible description ngay từ đầu.

**Yêu cầu sửa**

1. Bảo đảm mọi phần tử có `hidden` thực sự không được render, ví dụ dùng quy tắc toàn cục `[hidden] { display: none !important; }` hoặc chỉ áp dụng flex ở `.inline-error:not([hidden])`.
2. Thêm precondition test từ clean page state:
   - ba inline error không visible;
   - error summary hidden;
   - không có `aria-invalid="true"`;
   - attempts=0, commits=0;
   - live regions rỗng.
3. Chụp lại toàn bộ ảnh initial và các ảnh trạng thái chịu ảnh hưởng.

### F02 — “Native keyboard” chưa phải thao tác native và dialog trap chưa được assert

**Bằng chứng**

- T03 gọi `await page.focus('#btn-open-guidance')` trước Enter.
- T08 gọi `btn.click()` hai lần trong `page.evaluate()` dù comment và report mô tả pointer click + Enter.
- T09 gọi `await page.focus('#btn-open-guidance')` trong lúc saving.
- T03 thu `trapState1` và `trapState2` nhưng không đưa hai giá trị này vào `t03Pass` hoặc `VERIFICATION.json`.

**Yêu cầu sửa**

1. T03 phải bắt đầu từ clean page state, duyệt bằng `page.keyboard.press('Tab')` theo thứ tự DOM tự nhiên, xác nhận trigger đang active trước Enter, mở modal, ghi focus sequence, kiểm tra Tab và Shift+Tab không thoát dialog, Escape đóng và focus về trigger.
2. T08 phải dùng input thật: một pointer `page.click()` và một native `page.keyboard.press('Enter')` trong cùng saving window; assert attempts vẫn bằng 1.
3. T09 phải chuyển focus bằng Tab/Shift+Tab tự nhiên; cấm `page.focus()`, `HTMLElement.focus()` và DOM `click()` trong kịch bản được gắn nhãn native.
4. Ghi và assert `body_focus_events: 0` cùng strict node identity của `#btn-save-support` xuyên suốt idle → saving → failure → retry → success.
5. Thêm static scan giới hạn cho các scenario native; nếu phát hiện lệnh programmatic focus/click thì gate liên quan phải fail.

Lưu ý: Các lệnh `.focus()` trong chính ứng dụng có thể hợp lệ cho dialog lifecycle, invalid-submit focus và edit workflow. Finding này áp dụng cho harness đang tuyên bố mô phỏng input người dùng native.

### F03 — Gate reflow/text scaling không kiểm tra đúng claim

**Bằng chứng**

- Candidate đặt `body { overflow-x: hidden; }`, có thể che overflow thay vì chứng minh layout không tràn.
- T10 kiểm tra 320px ở font mặc định, sau đó đổi viewport sang 1440px mới inject `font-size: 200%`.
- T10 chỉ đếm rect có kích thước dương; không đo cạnh ngoài viewport, clipping, overlap hoặc local horizontal scroller.
- Report kết luận “0 text clipping” dù harness không thực hiện phép kiểm đó.

**Yêu cầu sửa**

1. Gỡ `overflow-x: hidden` khỏi candidate và directions; sửa nguyên nhân hình học nếu có.
2. Chạy ma trận tối thiểu:
   - 320×800, font mặc định;
   - 320×800, `TEXT_SCALE_SIMULATION` 200%;
   - 390×844, font mặc định;
   - 768×1024 và 1440×900 để chống hồi quy.
3. Đo `documentElement`, body và các vùng trọng yếu; assert không có global/local horizontal scrolling.
4. Đo text/control clipping và overlap bằng bounding rect/collision rules có selector inventory rõ ràng; selector thiếu hoặc phép đo không hợp lệ phải fail.
5. Cho phép vertical scrolling và tiếp tục ghi rõ đây là mô phỏng scale chữ, không phải browser zoom.

### F04 — Gate A07 không fail-closed và inventory không đầy đủ

**Bằng chứng**

- `t11Pass` chỉ là `targetProjectPass && contrastAllPass && zeroMotionPass`; không chứa điều kiện forced-colors.
- Nếu forced-colors preflight không được hỗ trợ, T11 vẫn có thể PASS.
- Target audit chỉ query `button, a.skip-link, .target-container`; không trực tiếp bao phủ textarea và không lập ánh xạ control → effective target.
- Contrast audit chỉ đo ba cặp text, không đo error text, control border, focus indicator hoặc các trạng thái tương tác liên quan.
- Hàm parse màu trả `[0,0,0]` khi parse thất bại thay vì fail.

**Yêu cầu sửa**

1. Forced-colors phải cho kết quả `EXECUTED_PASS`, `EXECUTED_FAIL` hoặc `NOT_EXECUTED_ENVIRONMENT_UNSUPPORTED`; trạng thái cuối không được đóng A07 tự động.
2. A07 conjunction phải chứa kết quả forced-colors hoặc một manual evidence record riêng được Controller có thể kiểm tra.
3. Xây inventory toàn bộ target thật. Với radio/checkbox, ghi rõ effective target là label/container liên kết; với textarea/button/link, đo chính phần tử tương tác.
4. Báo riêng ngưỡng WCAG 24px và invariant dự án 44px.
5. Mở rộng contrast inventory tối thiểu cho primary/secondary text, error text, button text, structural borders, focus indicators và trạng thái tương tác thực tế. Parse thất bại, selector thiếu hoặc màu trong suốt không giải được phải fail-closed.
6. Zero-motion audit phải quét toàn bộ rendered DOM cần thiết, không chỉ `button, input, textarea, a`.

### F05 — Evidence integrity và exit behavior không fail-closed

**Bằng chứng**

- Hai review trong package không byte-identical:
  - Review 001 official: `ac7d03ebabf35e9faab61d5454d6c463629161d29bd14f65971ce78963508046`; package: `3e0b5641065aed02d676564ce1c0f805a5247fe43362975981c6a668b11eaa70`.
  - Review 002 official: `e72022bc363eff194713ff5ba51a2f62d7123f3639fae386e62022212bff8577`; package: `426e03bb7d8f6b6f59e681023eac6e1098405a4300b45e63522c1fd94ed6107b`.
- Directive trong package cũng khác bản Controller đang lưu.
- T12 chỉ yêu cầu AX nodes > 0 và số screenshot ≥ 11; không so sánh authoritative hashes, kích thước ảnh, review hashes hoặc report-ledger synchronization.
- `overall_status` được khởi tạo trước là `SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW` và không đổi khi gate fail.
- Harness chỉ `process.exit(1)` khi không kết nối CDP; lỗi trong main `catch` chỉ log, và gate failure không đặt exit code khác 0.

**Yêu cầu sửa**

1. Thay ba văn bản Controller bằng bản tải trực tiếp, byte-identical; không copy từ giao diện đã mất Markdown.
2. C07/A08 phải kiểm tra động hash của official documents, source, AX tree và toàn bộ authoritative screenshots; kiểm tra pixel dimensions, byte sizes và cross-ledger consistency.
3. Không khởi tạo trạng thái tổng là PASS. Chỉ tính sau cùng từ conjunction của tất cả gate bắt buộc.
4. Mọi uncaught error, missing selector, missing artifact, hash mismatch, `EXECUTED_FAIL`, hoặc gate false phải tạo `SELF_CHECK_FAIL` và process exit code 1.
5. `NOT_EXECUTED` và `MANUAL_REVIEW_PENDING` không được quy đổi thành PASS.

### F06 — Manual accessibility review tự nhận bằng chứng không tồn tại

**Bằng chứng**

`MANUAL_ACCESSIBILITY_REVIEW.md` tự ghi `MANUAL_REVIEW_COMPLETED`, mô tả “VoiceOver/NVDA Emulation” và đưa ra câu phát âm cụ thể như thể đã nghe screen reader thực tế. Hồ sơ không chứa môi trường, phiên bản, recording, operator log hoặc bằng chứng chạy NVDA/VoiceOver. Antigravity cũng tự xếp hạng nội dung “XUẤT SẮC” và kết luận trải nghiệm “hoàn hảo”.

**Yêu cầu sửa**

1. Đổi tài liệu thành `ASSISTIVE_TECH_REVIEW_PLAN.md` hoặc trạng thái `MANUAL_REVIEW_PENDING` nếu chưa có người thật chạy screen reader.
2. Các câu dự đoán phải ghi `EXPECTED_ANNOUNCEMENT`, không được gọi là âm thanh thực tế.
3. Chỉ ghi `MANUAL_REVIEW_COMPLETED` khi có operator, thiết bị/hệ điều hành, browser, screen reader + version, từng bước thao tác, observed output và timestamp.
4. Loại bỏ các từ tự chứng nhận như “xuất sắc”, “hoàn hảo”, “tuyệt đối ổn định”.
5. Không dùng cụm “công nghệ trợ thính” để chỉ screen reader; dùng “công nghệ hỗ trợ” hoặc “trình đọc màn hình”.

W3C SC 4.1.3 yêu cầu status message có thể được công nghệ hỗ trợ xác định mà không nhận focus; telemetry DOM có thể kiểm tra role/property, nhưng không chứng minh chính xác câu đọc trên từng screen reader.

### F07 — Claim WCAG/APG vượt bằng chứng

**Bằng chứng**

- Footer hiển thị “Hệ thống Hỗ trợ Hành khách Tiêu chuẩn WCAG 2.2 AA”, tạo ấn tượng toàn bộ giao diện đã đạt chuẩn.
- Báo cáo nói focus sau dialog “bắt buộc” luôn về trigger; APG có ngoại lệ khi invoker không còn tồn tại hoặc workflow hợp lý chuyển đến phần tử khác.
- Report tuyên bố 0 clipping, 100% control targets và native journey dù harness chưa chứng minh các claim đó.

**Yêu cầu sửa**

1. Đổi footer thành claim có phạm vi, ví dụ: “Bản mẫu huấn luyện khả năng tiếp cận — đang chờ thẩm định”.
2. Mô tả focus return theo APG đúng điều kiện và ghi rõ candidate này chọn trả về trigger vì trigger còn tồn tại, workflow không thay đổi.
3. Đồng bộ report theo telemetry thực tế; không nâng claim từ một số cặp đo sang toàn giao diện.

### F08 — Gói kiểm chứng chưa tái chạy độc lập

**Bằng chứng**

- `verify_module_009.js` gọi trực tiếp `require('puppeteer-core')`, nhưng gói không chứa dependency manifest hoặc hướng dẫn cài đặt.
- Script khóa cứng `http://127.0.0.1:9223`, không nhận CLI argument hoặc `CDP_PORT`.
- Trong môi trường Controller, chạy resolve dependency trả `Cannot find module 'puppeteer-core'`; không có endpoint tại 9223.

**Yêu cầu sửa**

1. Thêm hướng dẫn tái hiện và dependency manifest tối thiểu hoặc cơ chế resolve dependency được mô tả rõ.
2. Hỗ trợ cổng CDP qua CLI/`CDP_PORT`; không khóa riêng máy tác giả.
3. Ghi rõ harness kết nối browser có sẵn hay tự launch; nếu tự launch, hỗ trợ `CHROME_PATH` và fail rõ khi executable thiếu.
4. Không ghi “independent automated harness” nếu gói không đủ hướng dẫn để một môi trường khác chạy lại.

---

## 5. Điểm được giữ nguyên

Không cần thiết kế lại các phần sau:

- Direction A inline form;
- fixture AR-901 và locked copy;
- cấu trúc landmark cấp cao;
- native fieldset/legend/label/button/dialog;
- mô hình Draft → Payload Snapshot → Committed Data;
- visual language sáng, tương phản cao;
- hướng tổ chức error summary và live regions đơn nguồn;
- mock network attempt 1 fail, attempt 2 success.

Candidate và Direction A hiện byte-identical; điều này được chấp nhận nếu báo cáo nói rõ Candidate chọn nguyên bản Direction A, không giả lập có refinement riêng.

---

## 6. Acceptance criteria cho Repair 001

Repair 001 chỉ được xem xét PASS khi đồng thời thỏa:

```yaml
R01_INITIAL_STATE_ERRORS_HIDDEN: true
R02_NATIVE_DIALOG_SEQUENCE_RECORDED: true
R03_DIALOG_TRAP_ASSERTED: true
R04_NATIVE_DUPLICATE_GUARD: true
R05_NATIVE_NO_STEAL_AND_NODE_IDENTITY: true
R06_REFLOW_MATRIX_320_390_768_1440: true
R07_TEXT_SCALE_200_AT_320: true
R08_NO_OVERFLOW_MASKING: true
R09_CLIPPING_AND_OVERLAP_MEASURED: true
R10_FORCED_COLORS_IN_GATE_CONJUNCTION: true
R11_COMPLETE_TARGET_AND_CONTRAST_INVENTORY: true
R12_OFFICIAL_DOCS_BYTE_IDENTICAL: true
R13_A08_DYNAMIC_INTEGRITY_AUDIT: true
R14_FAIL_CLOSED_EXIT_BEHAVIOR: true
R15_MANUAL_CLAIMS_BOUNDED: true
R16_WCAG_PRODUCT_CLAIM_REMOVED: true
R17_PORTABLE_REPLAY_INSTRUCTIONS: true
```

Harness phải có negative/positive controls tối thiểu cho các detector mới: một fixture cố ý tạo overflow/clipping hoặc hash mismatch phải làm gate fail; forced-colors unsupported phải không thể tạo PASS; một test giả `false` phải khiến overall status là FAIL và exit code 1.

---

## 7. Gói nộp Repair 001

Tên đề nghị:

`design_training_009_submission_r02.zip`

Gói phải chứa source đã sửa, contract, report, verification, AX tree, harness, bằng chứng ảnh mới và bản chính thức byte-identical của:

- `DESIGN_TRAINING_009_DIRECTIVE.md`;
- `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_001.md`;
- `DESIGN_TRAINING_009_FIRST_RESPONSE_REVIEW_002.md`;
- `DESIGN_TRAINING_009_REVIEW_001.md`.

Antigravity phải báo cáo trung thực phương thức của từng test: native keyboard, pointer, programmatic DOM inspection hoặc manual review. Không được dùng một phương thức nhưng đặt nhãn phương thức khác.

---

## 8. Nguồn chuẩn

- W3C WAI-ARIA APG — Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C WAI — Understanding SC 4.1.3 Status Messages: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- W3C WAI — Understanding SC 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- W3C WAI — Understanding SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum

---

## 9. Phán quyết chính thức

```yaml
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND: 1/2
REPAIR_BUDGET_REMAINING: 1
IMPLEMENTATION_MAY_CONTINUE: true
SCOPE: TARGETED_REPAIR_ONLY
NEXT_SUBMISSION: DESIGN_TRAINING_009_REPAIR_001
```

