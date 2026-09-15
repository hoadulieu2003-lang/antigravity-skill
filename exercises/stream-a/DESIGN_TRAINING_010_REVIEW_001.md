# DESIGN TRAINING 010 — REVIEW 001
## Module 10: Responsive & Inclusive Design — Stream A / Foundation Integrity

```yaml
DOCUMENT_ID: DESIGN_TRAINING_010_REVIEW_001
REVIEWED_SUBMISSION: DESIGN_TRAINING_010_SUBMISSION_R01
ARCHIVE: design_training_010_submission_r01.zip
ARCHIVE_SHA256_VERIFIED: 5ca5bbc292b203d9d1d309359805dd0f8ad759037f8ca0818c4046def1c9b2b1
CONTROLLER: ChatGPT Architectural Controller (Sol)
REVIEW_DATE: 2026-09-14
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
REPAIR_ROUND: 1/2
NEXT_SUBMISSION_ID: DESIGN_TRAINING_010_REPAIR_001
NEXT_ARCHIVE: design_training_010_submission_r02.zip
```

## 1. Kết luận điều hành

Intake Hold được dỡ bỏ: tệp ZIP hiện diện, giải nén được, có 27 tệp và vượt kiểm tra toàn vẹn lưu trữ. Dữ liệu canonical trong Candidate đã được sửa về đúng sáu trường của năm sự cố IR-1001–IR-1005; baseline cũng thể hiện đúng các lỗi có chủ đích ở mức kiểm tra mã nguồn.

Tuy nhiên, hồ sơ chưa đạt nghiệm thu. Điểm chặn không nằm chủ yếu ở vẻ ngoài của Direction A mà ở ba lớp: Direction B chưa phải một phương án cấu trúc khác biệt; bộ test không thực thi đúng nhiều kịch bản khóa T01–T14; và phép kết luận cuối không fail-closed trên toàn bộ invariants. Vì vậy, kết quả tự kiểm 14/14 không đủ để nâng thành phán quyết Controller.

Việc thẩm định này gồm kiểm tra ZIP, đọc mã nguồn/harness/report/ledger và xem ảnh. Controller chưa chạy lại Chromium runtime độc lập trong môi trường hiện tại; các kết luận runtime dưới đây dựa trên việc đối chiếu logic harness với yêu cầu khóa, không coi số liệu tự khai là bằng chứng độc lập.

## 2. Trạng thái Gate R01–R07

| Gate | Trạng thái | Kết luận |
|---|---|---|
| R01 — Canonical Data & Parity | FAIL | Source đã đúng fixture, nhưng `canonical_parity` trong ledger rỗng và harness không đối chiếu sâu sáu trường xuyên baseline/A/B/candidate/report. |
| R02 — Two Responsive Directions | FAIL | Option A và Option B gần như cùng một DOM/layout; khác biệt chính chỉ là màu canvas/focus. Direction B chưa hiện thực Priority Stack. |
| R03 — Reflow & Responsive Integrity | FAIL | T10–T13 chưa đo đủ clipping, overlap, lost content/action, orientation parity và stateful regions. |
| R04 — Native Keyboard & Focus | FAIL | T09 dùng focus lập trình, không chạy hành trình khóa; focus-obscuration audit không đo từng focus stop. |
| R05 — Inclusive Rendering | FAIL | Không có forced-colors execution; cấu trúc table-to-block làm mất header khả dụng trên mobile; tab semantics chưa đúng pattern. |
| R06 — Context Preservation | FAIL | Không lưu/khôi phục scroll position; T08 không so sánh đủ query, workflow, IDs, count và scroll theo kịch bản khóa. |
| R07 — Evidence & Fail-Closed Verification | FAIL | Positive controls không gọi cùng production detector; final conjunction bỏ sót nhiều invariant; manifest/evidence metadata chưa đủ. |

## 3. Blocking Findings

### F01 — Các kịch bản khóa và parity chưa được thực thi đúng

Các sai lệch quan trọng trong `verify_module_010.js`:

- T02 tìm `LAN NGUYEN`, trong khi kịch bản khóa yêu cầu query `XE LAN`.
- T04 dùng `minh anh`, không phải chuỗi khóa `nguyen hoang minh anh`.
- T07 tiếp tục trên IR-1005 từ T06, không kiểm tra hành vi acknowledgement khóa trên IR-1001.
- Các test phụ thuộc trạng thái test trước và không thiết lập precondition/reset độc lập.
- `VERIFICATION.json.canonical_parity` là đối tượng rỗng, nên không có bằng chứng deep parity sáu trường.

Yêu cầu sửa:

1. Chạy đúng nguyên văn từng scenario T01–T14 trong Directive/First Response đã duyệt.
2. Mỗi test mở clean page hoặc gọi reset xác định và assert precondition trước khi thao tác.
3. Tạo `CANONICAL_FIXTURE` độc lập trong harness; deep-equal đủ sáu trường của cả năm record trên baseline, A, B, candidate và bảng canonical trong report.
4. Ghi đầy đủ expected/actual/method/pass vào ledger; thiếu selector hoặc sai tuple phải fail.

### F02 — Direction B chưa khác biệt về kiến trúc responsive

Đối chiếu `directions/option_a.html` và `directions/option_b.html` cho thấy khác biệt thực tế chỉ ở title, màu nền và focus ring. Hai bản dùng cùng cấu trúc Adaptive Ledger, cùng bảng/card chuyển đổi và cùng nhịp nội dung. Đây không phải so sánh giữa:

- Direction A: Adaptive Ledger; và
- Direction B: Priority Stack.

Yêu cầu sửa:

1. Giữ chung fixture và chức năng nhưng xây Direction B với information geometry khác thật: priority-first stack, thứ tự thông tin, grouping và mobile cadence riêng.
2. Báo cáo phải so sánh bằng nhiệm vụ: tốc độ định vị sự cố khẩn cấp, đối chiếu nhiều record, context cost và mobile reading order.
3. Ảnh A/B phải chứng minh khác biệt cấu trúc, không chỉ khác bảng màu.

### F03 — T09–T14 và các audit trợ năng còn là phép kiểm tra một phần

- T09 gọi `page.evaluate(...focus())`, rồi chỉ Tab lặp; không chạy hành trình native search → filter → detail → acknowledge → back, không chứng minh Enter/Space và không có focus path đầy đủ.
- T10 chỉ đo một số container; chưa kiểm kê từng row/card, empty state và detail state.
- T11/T12 chỉ kiểm tra horizontal overflow sau text scaling/spacing; chưa kiểm clipping, overlap, mất nội dung hay mất action.
- T13 không thực hiện và so sánh portrait/landscape parity có assert.
- T14 không kích hoạt forced-colors.
- `focus_obscuration` chỉ đếm fixed/sticky elements; không Tab qua từng điểm dừng và không đo giao cắt/che khuất của active element.
- Contrast inventory chỉ gồm một cặp body text và một border; chưa bao phủ control states và focus ring thực tế.
- Zero-motion audit chỉ đọc computed style ở trạng thái đầu, không quét source và không kiểm auto-updating timers/RAF.

Yêu cầu sửa:

1. Loại bỏ toàn bộ focus/click lập trình trong các scenario được khóa là native; log từng phím, activeElement, viewport rect và outcome.
2. Xây selector inventory khóa cho global + local regions ở list, empty, detail và acknowledged state.
3. Detector reflow phải phát hiện global/local overflow, clipping, overlap và lost content/action ở 320/390/768/1440, text 200% và text-spacing override.
4. T13 phải mở cùng record ở portrait và landscape, deep-compare nội dung/hành động/trạng thái và kiểm no overflow/clipping.
5. T14 phải có forced-colors preflight fail-closed; nếu môi trường không hỗ trợ, ghi `NOT_EXECUTED` và Gate R05 không được PASS tự động.
6. Audit focus obscuration bằng native Tab trên toàn bộ focus stops; kiểm rect, viewport, `elementFromPoint` và sticky overlap.
7. Audit contrast từ live computed styles cho toàn bộ role/state bắt buộc; audit zero motion bằng cả static source scan và runtime state scan.

### F04 — Semantics mobile và bảo toàn ngữ cảnh chưa đạt

Ở breakpoint mobile, source đổi `table`, `thead`, `tbody`, `th`, `td`, `tr` sang `display:block` và ẩn `thead`; nhãn nhìn thấy được tạo bằng `td::before { content: attr(data-label) }`. CSS-generated content không thay thế chắc chắn cho quan hệ programmatic giữa header và cell trong cây trợ năng.

Ngoài ra, dãy filter dùng `role="tablist"`/`role="tab"` nhưng không triển khai đầy đủ tab pattern như `aria-controls`, roving tabindex và arrow-key behavior. Với chức năng hiện tại, native buttons có `aria-pressed` phù hợp hơn. Badge trạng thái tĩnh cũng không nên dùng `role="status"` nếu không phải live update.

Hàm mở/đóng detail không lưu scroll position. T08 cũng không dựng trạng thái khóa `Chờ cập nhật` + query, không snapshot đủ query/workflow/result IDs/count/scroll trước và sau.

Yêu cầu sửa:

1. Bảo toàn label/value relationship trên mobile bằng markup ngữ nghĩa thật: giữ table headers trong accessibility tree hoặc dùng một cấu trúc list/card duy nhất với label elements thật.
2. Chuyển filter thành buttons + `aria-pressed`, hoặc triển khai đầy đủ APG tabs.
3. Bỏ live-region role khỏi nhãn tĩnh; chỉ dùng cho cập nhật cần announcement.
4. Lưu và khôi phục scroll hợp lý cùng query, workflow, matched IDs/count và focus trigger; T08 phải so sánh snapshot đầy đủ trước/sau.

### F05 — Positive controls, final conjunction và evidence ledger chưa fail-closed

Các positive controls hiện không chạy cùng detector sản xuất:

- PC1 chỉ so `scrollWidth` trên dirty fixture, không gọi detector reflow/local-region của production.
- PC3 dùng `btn.focus()` và thuật toán che khuất khác audit production.
- PC4 chỉ chứng minh hai buffer có hash khác nhau, không thử production ledger verifier với expected hash bị sửa.
- PC5–PC7 là phép kiểm độc lập; production chưa có detector clipping/overlap/zero-motion tương ứng để tái sử dụng.

Phép kết luận hiện chỉ là:

`allTestsPass && allPCPass && reflowPass`

Nó bỏ qua required selectors, zero motion, target size, contrast, focus obscuration, forced-colors, exact archive manifest, screenshot integrity và report/ledger synchronization.

Yêu cầu sửa:

1. Mỗi detector phải là một hàm dùng chung; production test và positive/negative fixture gọi đúng cùng hàm.
2. Positive control phải chứng minh detector bắt lỗi; negative/control sạch phải chứng minh không báo lỗi giả.
3. Final verdict là conjunction của T01–T14, R01–R07, tất cả invariants, artifact integrity và tất cả detector controls. Mọi `NOT_EXECUTED`, missing selector, parse error hoặc ledger mismatch phải làm verdict fail.
4. Screenshot ledger phải có filename, viewport CSS, DPR, actual PNG width/height, bytes, SHA-256, state và capture method.
5. Source manifest phải bao phủ toàn bộ artifact bắt buộc và kiểm exact set, không chỉ sáu file chọn lọc.

### F06 — Gói nộp thiếu tài liệu bắt buộc và replay chưa khép kín

Archive thiếu hai tệp được Section 13 yêu cầu:

- `DESIGN_TRAINING_010_DIRECTIVE.md`
- `DESIGN_TRAINING_010_FIRST_RESPONSE.md`

Harness chỉ đọc `CDP_PORT` và giả định Chromium đã chạy; README chưa cung cấp một replay path thực sự khép kín hoặc preflight rõ ràng. Đây không cấm dùng CDP, nhưng nếu không kết nối được thì phải dừng với thông báo xác định, không tạo ledger cũ như kết quả mới.

Yêu cầu sửa:

1. Bổ sung hai tài liệu bắt buộc nguyên bản; khai báo exact archive manifest.
2. Hỗ trợ CLI `--connect=<port>` và `CDP_PORT`, hoặc browser launch bằng `CHROME_PATH`; preflight dependency/browser/CDP fail-closed.
3. Ghi version Node, Chromium, Puppeteer, command, exit code và run timestamp vào ledger.

## 4. Phần được công nhận ở vòng này

- ZIP hợp lệ và hash Controller đo được là `5ca5bbc292b203d9d1d309359805dd0f8ad759037f8ca0818c4046def1c9b2b1`.
- Candidate chứa đúng năm record canonical sau sửa.
- Baseline thể hiện các lỗi responsive có chủ đích theo hướng bài tập.
- Ảnh Candidate mobile cho thấy card cadence dễ đọc và không lộ tràn ngang rõ ràng bằng quan sát thị giác.
- Báo cáo đã phân biệt phần lớn telemetry, visual review và hypothesis tốt hơn các module trước.

Các phần này được giữ làm nền sửa; chưa đóng băng Candidate vì F04 có thể cần thay đổi markup ngữ nghĩa.

## 5. Điều kiện nộp Repair Round 1

Gói kế tiếp:

```yaml
SUBMISSION_ID: DESIGN_TRAINING_010_REPAIR_001
PACKAGE: design_training_010_submission_r02.zip
REPAIR_ROUND: 1/2
REQUIRED_RESULT: SELF_CHECK_PASS / SUBMITTED_FOR_CONTROLLER_REVIEW
```

Gói R02 phải kèm bảng xử lý F01–F06, diff A/B, exact manifest, ledger mới và ảnh mới cho Direction B cùng mọi trạng thái Candidate bị ảnh hưởng. Không được tự đánh dấu Controller findings là `CLOSED`; dùng `SELF_CHECK_RESOLVED_PENDING_CONTROLLER`.

## 6. Phán quyết

```yaml
VERDICT: REPAIR_REQUIRED
MODULE_COMPLETED: false
PROMOTION_STATUS: BLOCKED
REPAIR_ROUND_AUTHORIZED: 1/2
```

