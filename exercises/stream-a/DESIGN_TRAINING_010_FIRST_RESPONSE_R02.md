# DESIGN TRAINING 010 — FIRST RESPONSE R02
## Responsive & Inclusive Design · TRIPFLOW Disruption Response Board

```yaml
DIRECTIVE_ID: DESIGN_TRAINING_010
MODULE_ID: DESIGN_TRAINING_010_RESPONSIVE_INCLUSIVE_DESIGN
MODULE_NAME: RESPONSIVE_INCLUSIVE_DESIGN
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
OWNER: "Anh — Lead Architect / Product Owner"
CONTROLLER: "ChatGPT Architectural Controller (Sol)"
EXECUTOR: "Antigravity"
DATE: 2026-09-15
REVISION: R02
SUPERSEDES: DESIGN_TRAINING_010_FIRST_RESPONSE_R01
CONTROLLER_REVIEW_REFERENCED: DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_001.md
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_R02_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
PLANNING_FINDINGS_ADDRESSED: P01-P07
VISUAL_DIRECTION_SELECTION: DEFERRED_PENDING_CONTROLLER_APPROVAL
```

---

## 1. BẢNG ĐỐI CHIẾU XỬ LÝ 7 PLANNING FINDINGS (P01–P07)

Bản First Response R02 này xử lý triệt để toàn bộ bảy yêu cầu điều chỉnh do Controller Sol ban hành tại `DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_001.md`:

| Finding ID | Phân loại Lỗi | Yêu cầu của Controller Sol | Hành động Khắc phục trong First Response R02 | Vị trí Thể hiện trong R02 |
|---|---|---|---|---|
| **`P01`** | **Canonical Fixture Typo & Equality Contract** | Sửa lỗi chính tả trong `IR-1002` (`"Du Th thuyền"` $\to$ `"Du Thuyền"`). Xây dựng cơ chế so sánh deep equality cho cả sáu tuple (chín trường/tuple). Không dùng từ "byte-identical" cho văn bản DOM; dùng exact string/code-point equality sau khi đọc `textContent`. | Đã sửa chính xác nguyên văn `"TF-803 · Tour Hạ Long Du Thuyền 5 Sao"`. Khóa cứng thuật toán so sánh exact string/code-point equality không qua chuẩn hoá canonical. | **Mục 2** |
| **`P02`** | **Separation of Geometry & Hypothesis** | Hạ toàn bộ các nhận định về tốc độ, tải nhận thức, thói quen bảng tính, và tính tự nhiên thành `DESIGN_HYPOTHESIS`. Giữ các nhận định hình học có thể chứng minh bằng telemetry. Không tự chọn candidate direction trong R02. | Phân định rõ 2 tầng: (1) Telemetry-verifiable geometric facts và (2) `DESIGN_HYPOTHESIS`. Trì hoãn việc chọn candidate (`VISUAL_DIRECTION_SELECTION: DEFERRED`). | **Mục 3** |
| **`P03`** | **Baseline Evidence Boundaries & Banner** | Đổi trạng thái defect trước triển khai thành `PRESCRIBED_DEFECT / POTENTIAL_FAILURE`. Không tự gán là confirmed WCAG failure trước khi chạy detector. Bổ sung nguyên văn banner baseline bắt buộc. | Đổi toàn bộ trạng thái baseline sang `PRESCRIBED_DEFECT / POTENTIAL_FAILURE`. Bổ sung nguyên văn banner cảnh báo khóa cứng của Sol vào kế hoạch. | **Mục 4** |
| **`P04`** | **Reflow Matrix: Multi-State & Local Scrollers** | Mở rộng kiểm tra Reflow trên 5 viewports × 5 states (`initial`, `filtered`, `empty`, `detail`, `acknowledged`). Kiểm tra tràn ngang ở cả cấp độ trang lẫn toàn bộ local containers (shell, search/filter, table/card, detail). Cấm `overflow-x: hidden`. Positive control phải gọi đúng production detector. | Khóa ma trận 25 tổ hợp kiểm thử. Detector quét đệ quy từng container. Cấm triệt để `overflow-x: hidden`. Positive control tiêm tràn ngang cục bộ và toàn cục. | **Mục 5** |
| **`P05`** | **Text Spacing Injection Accuracy** | Loại bỏ `* { margin-bottom: 2em !important; }`. Áp dụng 4 thuộc tính đúng vai trò SC 1.4.12: line-height $\ge 1.5$, paragraph spacing $\ge 2$ (chỉ áp dụng cho block đoạn văn `<p>`), letter-spacing $\ge 0.12$, word-spacing $\ge 0.16$. Cho phép cuộn dọc. | Thiết lập bộ chọn CSS tiêm có giới hạn: line/letter/word spacing cho text-bearing elements; paragraph spacing chỉ cho `<p>` và block tương đương. | **Mục 6** |
| **`P06`** | **Clipping & Overlap Inventory with Dirty Fixtures** | Khóa danh mục bắt buộc (required selectors/fields/actions) cho list, empty, và detail. Định nghĩa clipping chuẩn dựa trên geometric containment và scroll/client dimensions. Loại trừ parent-child khỏi va chạm overlap. Thêm dirty fixtures riêng. Fail-closed nếu thiếu selector. | Lập bảng inventory chi tiết 100% selectors bắt buộc. Định nghĩa giải thuật phát hiện clip/overlap giữa các phần tử đồng cấp (siblings). Thiết kế 2 dirty fixtures độc lập. | **Mục 7** |
| **`P07`** | **Full Boolean Conjunction & Evidence Ledger Sync** | Tích hợp Zero Motion audit, forced-colors capability preflight, target inventory 5 states (tách WCAG 24×24 khỏi Project 44×44), focus obscuration từng focus stop, và dynamic evidence ledger sync vào công thức nghiệm thu fail-closed cuối cùng. | Khóa công thức phép hội Boolean Conjunction: Bất kỳ vi phạm motion, target, focus obscuration, missing selector, hoặc hash mismatch đều exit code 1. | **Mục 8** |

---

## 2. CANONICAL FIXTURE CHÍNH XÁC & CƠ CHẾ EXACT STRING EQUALITY (P01)

### 2.1. Toàn văn Sáu Tuple Canonical Đã Khắc Phục Lỗi Chính Tả
Mốc thời gian quy chiếu: `reference_time: "2026-09-14 18:00 ICT"`.

```yaml
CANONICAL_FIXTURE_RECORDS:
  - disruption_id: "IR-1001"
    attention_level: "CRITICAL"
    attention_label: "Cần xử lý khẩn cấp"
    attention_marker: "CRITICAL_TRIANGLE_ICON"
    tour_code_and_name: "TF-802 · Tour Fansipan Sapa 2 Ngày 1 Đêm"
    departure_time: "2026-09-15 06:30 ICT"
    assignee: "Lan Nguyễn"
    passenger_count: 18
    incident_summary: "Chưa chốt được xe trung chuyển phù hợp cho hành khách sử dụng xe lăn tại điểm đón số 3."
    next_action: "Xác nhận phương án xe thay thế trước 04:30."
    operational_status: "Cần xử lý"

  - disruption_id: "IR-1002"
    attention_level: "HIGH"
    attention_label: "Chú ý cao"
    attention_marker: "HIGH_DIAMOND_ICON"
    tour_code_and_name: "TF-803 · Tour Hạ Long Du Thuyền 5 Sao" # ĐÃ SỬA CHÍNH XÁC: "Du Thuyền", KHÔNG CÒN "Du Th thuyền"
    departure_time: "2026-09-15 08:00 ICT"
    assignee: "Huy Trần"
    passenger_count: 24
    incident_summary: "Cảng vụ phát cảnh báo dông lốc; giờ rời bến có thể thay đổi."
    next_action: "Kiểm tra thông báo cảng vụ lúc 05:30 và cập nhật cho đoàn."
    operational_status: "Chờ cập nhật"

  - disruption_id: "IR-1003"
    attention_level: "MEDIUM"
    attention_label: "Mức trung bình"
    attention_marker: "MEDIUM_CIRCLE_ICON"
    tour_code_and_name: "TF-804 · Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm"
    departure_time: "2026-09-16 09:45 ICT"
    assignee: "Mai Đỗ"
    passenger_count: 42
    incident_summary: "Hai hành khách cần lối lên xuống ít bậc và vị trí ngồi gần cửa."
    next_action: "Xác nhận xe đón có bậc hỗ trợ và giữ hai ghế hàng đầu."
    operational_status: "Đang phối hợp"

  - disruption_id: "IR-1004"
    attention_level: "MEDIUM"
    attention_label: "Mức trung bình"
    attention_marker: "MEDIUM_CIRCLE_ICON"
    tour_code_and_name: "TF-805 · Tour Tràng An - Bái Đính 1 Ngày"
    departure_time: "2026-09-16 07:30 ICT"
    assignee: "An Phạm"
    passenger_count: 35
    incident_summary: "Nhà hàng đề nghị chuyển giờ ăn trưa từ 11:30 sang 12:15."
    next_action: "Đối chiếu lịch tham quan trước khi chấp thuận thay đổi."
    operational_status: "Đang phối hợp"

  - disruption_id: "IR-1005"
    attention_level: "LOW"
    attention_label: "Mức thấp"
    attention_marker: "LOW_SQUARE_ICON"
    tour_code_and_name: "TF-806 · Hành trình Di sản miền Trung dành cho nhóm gia đình nhiều thế hệ"
    departure_time: "2026-09-17 05:45 ICT"
    assignee: "Nguyễn Hoàng Minh Anh"
    passenger_count: 31
    incident_summary: "Danh sách phòng có một tên hành khách dài hơn giới hạn hiển thị dự kiến của bản cũ."
    next_action: "Giữ nguyên tên đầy đủ; không cắt bằng dấu ba chấm nếu không có cách xem lại."
    operational_status: "Chờ cập nhật"

  - disruption_id: "IR-1006"
    attention_level: "RESOLVED"
    attention_label: "Đã ổn định"
    attention_marker: "RESOLVED_CHECK_ICON"
    tour_code_and_name: "TF-807 · Tour Mekong Buổi Sáng"
    departure_time: "2026-09-18 06:00 ICT"
    assignee: "Bình Lê"
    passenger_count: 16
    incident_summary: "Điểm đón cũ tạm đóng để sửa đường; điểm đón thay thế đã được xác nhận."
    next_action: "Không cần hành động thêm."
    operational_status: "Đã ổn định"
```

### 2.2. Cơ Chế Kiểm Tra Exact String & Code-Point Equality (Không Dùng Từ "Byte-Identical")
Trong môi trường DOM, các chuỗi ký tự được lưu trữ dưới dạng UTF-16 code units. Việc dùng từ "byte-identical" khi so sánh DOM text là không chuẩn xác về mặt kỹ thuật. Harness sẽ áp dụng thuật toán **Exact String & Code-Point Equality**:
1. Đọc văn bản từ phần tử DOM bằng `element.textContent`.
2. **Tuyệt đối không áp dụng normalization (như trim, strip diacritics, lowercase) lên dữ liệu canonical** khi thực hiện assertion Gate R01.
3. So sánh trực tiếp:
   ```javascript
   function assertCanonicalFieldExact(actualDomText, expectedCanonicalText, fieldName, recordId) {
     if (actualDomText !== expectedCanonicalText) {
       // Kiểm tra chi tiết từng code point để xác định vị trí sai khác
       const actualCodes = Array.from(actualDomText).map(c => c.codePointAt(0).toString(16));
       const expectedCodes = Array.from(expectedCanonicalText).map(c => c.codePointAt(0).toString(16));
       throw new Error(`CANONICAL_FIELD_MISMATCH in ${recordId} field ${fieldName}:
         Expected: "${expectedCanonicalText}" [${expectedCodes.join(' ')}]
         Actual:   "${actualDomText}" [${actualCodes.join(' ')}]`);
     }
   }
   ```
4. Thực hiện deep equality trên toàn bộ sáu tuple, chín trường/tuple ở cả list view (nơi hiển thị summary) và detail view (nơi hiển thị trọn vẹn 100% dữ liệu).

---

## 3. SO SÁNH HAI HƯỚNG THIẾT KẾ: PHÂN ĐỊNH HÌNH HỌC VÀ DESIGN HYPOTHESIS (P02)

### 3.1. Phân Tách Tuyệt Đối Giữa Đo Đạc Hình Học và Giả Thuyết Thiết Kế
Nhằm khắc phục triệt để `P02`, toàn bộ nhận định về trải nghiệm người dùng, tốc độ, thói quen và nhận thức được chuyển hoàn toàn thành `DESIGN_HYPOTHESIS`. Bảng sau phân định rõ ràng giữa các sự thật hình học có thể kiểm chứng bằng Telemetry (`GEOMETRIC_TELEMETRY_FACT`) và các giả thuyết thiết kế (`DESIGN_HYPOTHESIS`):

| Chiều Đánh Giá | Hướng A — Adaptive Ledger | Hướng B — Priority Stack | Ranh Giới Giữa Sự Thật Đo Đạc và Giả Thuyết |
|---|---|---|---|
| **1. Tỷ lệ mật độ thông tin & Diện tích chiếm dụng trên Desktop (1440px)** | **GEOMETRIC_TELEMETRY_FACT**: 6 bản ghi hiển thị trên 1 viewport desktop 1440×900 mà `window.scrollY === 0`. Mỗi bản ghi chiếm chiều cao trung bình ~48px-64px.<br><br>**DESIGN_HYPOTHESIS (DH-01)**: Giả thuyết rằng việc hiển thị đồng thời toàn bộ 6 hàng trên cùng một màn hình có thể giúp người vận hành đối chiếu số lượng khách và giờ khởi hành giữa các tour với ít thao tác cuộn hơn. | **GEOMETRIC_TELEMETRY_FACT**: 6 bản ghi dạng thẻ phân tầng chiếm tổng chiều cao vượt quá 900px, đòi hỏi `document.documentElement.scrollHeight > 900px`.<br><br>**DESIGN_HYPOTHESIS (DH-02)**: Giả thuyết rằng việc nhóm sự cố khẩn cấp `IR-1001` vào vị trí Spotlight phía trên giúp hướng sự chú ý đầu tiên của người dùng vào sự cố có rủi ro cao nhất. | Telemetry đo đạc chính xác diện tích bounding box (`width`, `height`, `offsetTop`) và tỷ lệ lấp đầy viewport. Việc "nhanh hơn" hay "giảm tải nhận thức" chỉ là giả thuyết thiết kế chưa kiểm chứng người dùng thật. |
| **2. Hình thái chuyển đổi khi co về 320 CSS px** | **GEOMETRIC_TELEMETRY_FACT**: Tại breakpoint $\le 767$px, CSS `@media` chuyển đổi container `display: table` thành `display: flex/grid` đa tầng. `scrollWidth <= 320px` tại mọi state.<br><br>**DESIGN_HYPOTHESIS (DH-03)**: Giả thuyết rằng sự chuyển đổi hình thái từ bảng sang thẻ vẫn giữ được sự rõ ràng giữa nhãn trường và giá trị trường. | **GEOMETRIC_TELEMETRY_FACT**: Thẻ giữ nguyên cấu trúc container 1 cột dọc từ desktop xuống mobile (`width: 100%`). `scrollWidth <= 320px` tại mọi state.<br><br>**DESIGN_HYPOTHESIS (DH-04)**: Giả thuyết rằng mô hình thẻ dọc đồng nhất trên mọi kích thước giúp giảm bớt sự thay đổi về mặt bố cục thị giác. | Cả hai hướng đều được chứng minh không tràn ngang bằng telemetry (`scrollWidth <= innerWidth`). Tác động nhận thức của việc chuyển đổi hình thái được ghi nhận là giả thuyết. |
| **3. Cấu trúc Tab Index & Hành trình Bàn phím** | **GEOMETRIC_TELEMETRY_FACT**: Trật tự DOM di chuyển tuần tự: Header Controls $\to$ Row 1 Actions $\to$ Row 2 Actions $\to \dots \to$ Row 6 Actions. Focus indicator có viền tối thiểu 2px solid.<br><br>**DESIGN_HYPOTHESIS (DH-05)**: Giả thuyết rằng hành trình Tab qua từng hàng dữ liệu là luồng tuần tự dễ dự đoán đối với người sử dụng phím Tab. | **GEOMETRIC_TELEMETRY_FACT**: Trật tự DOM đi từ: Header Controls $\to$ Spotlight Card Action $\to$ High Card Action $\to \dots \to$ Resolved Card Action.<br><br>**DESIGN_HYPOTHESIS (DH-06)**: Giả thuyết rằng việc tiếp cận trực tiếp sự cố khẩn cấp nhất ở điểm dừng phím đầu tiên là tiện ích cho quy trình điều phối. | Telemetry kiểm chứng chuỗi sự kiện `focusin` và toạ độ `activeElement`. Mức độ thân thiện của từng luồng phím là giả thuyết thiết kế. |
| **4. Tính liên tục của cấu trúc thị giác (Layout Continuity)** | **GEOMETRIC_TELEMETRY_FACT**: Tỷ lệ co giãn chiều rộng của container chính từ 1440px xuống 320px (giảm 77.7%). Hướng A có sự thay đổi quy tắc hiển thị (bảng $\to$ thẻ).<br><br>**DESIGN_HYPOTHESIS (DH-07)**: Giả thuyết rằng việc cung cấp giao diện dạng thẻ trên mobile là giải pháp bắt buộc để bảo toàn thông tin mà không gây cuộn ngang. | **GEOMETRIC_TELEMETRY_FACT**: Hướng B giữ nguyên mô hình phân cấp thẻ (Hero card $\to$ standard cards) trên mọi breakpoint, chỉ thay đổi số lượng cột lưới từ 2 cột thành 1 cột.<br><br>**DESIGN_HYPOTHESIS (DH-08)**: Giả thuyết rằng tính đồng dạng kiến trúc giữa các kích thước giúp trải nghiệm quen thuộc hơn khi đổi thiết bị. | Sự thay đổi cấu trúc CSS là dữ kiện kỹ thuật đo đạc được; cảm nhận của người dùng về tính liên tục là giả thuyết. |
| **5. Ứng suất cơ học khi giãn dòng và nội dung dài (Stress Margin)** | **GEOMETRIC_TELEMETRY_FACT**: Dưới tác động của Text Spacing (SC 1.4.12) và text scale 200%, chiều cao của từng hàng bảng tăng ~80%-120%. Không có phần tử nào bị `overflow: hidden` cắt chữ.<br><br>**DESIGN_HYPOTHESIS (DH-09)**: Giả thuyết rằng việc dùng `min-height` và `padding` tự do là đủ để ngăn chặn sự biến dạng bố cục. | **GEOMETRIC_TELEMETRY_FACT**: Dưới tác động của Text Spacing, các khối thẻ độc lập giãn nở chiều dọc tự nhiên trong luồng tài liệu. Khoảng cách giữa các thẻ tự động tịnh tiến mà không va chạm.<br><br>**DESIGN_HYPOTHESIS (DH-10)**: Giả thuyết rằng các thẻ độc lập có biên độ an toàn cơ học cao hơn khi nội dung bị phóng to cực đại. | Khả năng chứa văn bản không bị cắt chữ được đo đạc bằng detector clipping. Mức độ bền vững dài hạn là giả thuyết kiến trúc. |

### 3.2. Trì Hoãn Lựa Chọn Candidate Direction
Tuân thủ nghiêm ngặt chỉ thị của Sol tại `P02`: **Antigravity không tự ý chọn Direction A hay Direction B trong bản First Response R02 này**.
```yaml
VISUAL_DIRECTION_SELECTION: DEFERRED_PENDING_CONTROLLER_APPROVAL
```
Quyết định lựa chọn hướng thiết kế cho candidate (`index.html`) sẽ hoàn toàn do Controller Sol chỉ định khi ban hành văn bản phê duyệt First Response R02.

---

## 4. BASELINE AUDIT PLAN VỚI RANH GIỚI BẰNG CHỨNG & BANNER KHÓA CỨNG (P03)

### 4.1. Nguyên Văn Banner Baseline Bắt Buộc
Tệp `baseline/index.html` sẽ chứa nguyên văn banner khóa cứng do Sol quy định, đặt ở vị trí nổi bật ngay đầu trang:

> **Bản mẫu baseline có lỗi responsive và inclusive có chủ đích — không dùng trong sản phẩm thật.**

Mã HTML dự kiến:
```html
<aside class="baseline-disclaimer-banner" role="note" aria-label="Cảnh báo bản mẫu baseline">
  <p>Bản mẫu baseline có lỗi responsive và inclusive có chủ đích — không dùng trong sản phẩm thật.</p>
</aside>
```

### 4.2. Bảng Phân Loại Bảy Defect Trước Khi Chạy Audit
Khắc phục triệt để `P03`, bảng kế hoạch audit chuyển toàn bộ trạng thái trước khi thực thi thành `PRESCRIBED_DEFECT / POTENTIAL_FAILURE`. Trạng thái này chỉ được nâng cấp thành `OBSERVED_FAILURE` sau khi harness `verify_module_010.js` thực sự chạy trên `baseline/index.html` và thu thập được bằng chứng số đo/DOM cụ thể.

| Mã Defect | Tên Defect Theo Chỉ Thị | Phân Loại Trước Kiểm Toán | Bằng Chứng Quan Sát Cần Đo (Telemetry Target) | Tiêu Chí Chuẩn / Rủi Ro Liên Quan (Criterion / Risk) | Phản Hồi Kiến Trúc Trên Candidate (Candidate Response) |
|---|---|---|---|---|---|
| `DEF-R01` | App shell có `min-width: 1180px`, tạo horizontal overflow ở 320/390px. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: `document.documentElement.scrollWidth > window.innerWidth` tại 320×800 và 390×844; trích xuất computed style `min-width: 1180px` trên `#app-shell`. | Rủi ro vi phạm SC 1.4.10 Reflow và Project Invariant. Nguy cơ buộc người dùng mobile cuộn hai chiều. | Loại bỏ hoàn toàn `min-width: 1180px`. Áp dụng `width: 100%`, `max-width: 1440px`, CSS Grid co giãn tự động. Đảm bảo `scrollWidth <= innerWidth`. |
| `DEF-R02` | Mobile ẩn cột “Khách” và “Việc tiếp theo”, gây mất thông tin. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Sự vắng mặt của các nút/vùng chứa văn bản có nội dung tương ứng `pax` và `next_action` trong cây DOM hiển thị tại 390×844 (computed style `display: none` hoặc `visibility: hidden`). | Rủi ro vi phạm Gate R01 Content Parity và SC 1.3.1 Info and Relationships. Nguy cơ thiếu thông tin tác nghiệp cốt lõi trên màn hình nhỏ. | Duy trì 100% sự hiện diện của 9 trường canonical trên tất cả các breakpoint. Chuyển thành hàng dữ liệu nhãn-giá trị rõ ràng khi ở mobile view. |
| `DEF-R03` | Tên tour và người phụ trách dài bị ellipsis, không có cơ chế xem đầy đủ. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Computed style `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;` kèm điều kiện `scrollWidth > clientWidth` mà không có cơ chế disclosure/expanded. | Rủi ro vi phạm Gate R01 và SC 1.4.4. Nguy cơ cắt cụt tên sự cố dài (`IR-1005`) và tên người phụ trách. | Áp dụng `overflow-wrap: break-word; white-space: normal;` cho phép bẻ dòng tự nhiên. Màn hình chi tiết hiển thị đầy đủ không dùng ellipsis cắt cụt. |
| `DEF-R04` | Giao diện hiển thị thông báo yêu cầu xoay ngang trên portrait, hạn chế orientation. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Sự xuất hiện của phần tử mang nội dung `"Vui lòng xoay ngang thiết bị"` và trạng thái che khuất/vô hiệu hóa tương tác bảng tại viewport 390×844 portrait. | Rủi ro vi phạm SC 1.3.4 Orientation. Nguy cơ cản trở người dùng không thể xoay thiết bị. | Không tạo bất kỳ rào cản xoay thiết bị nào. Xây dựng bố cục thích ứng tự nhiên với cả hướng dọc (portrait) và hướng ngang (landscape). |
| `DEF-R05` | Sticky action bar che phần tử đang focus khi viewport thấp hoặc text scale 200%. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Tọa độ hình học `getBoundingClientRect()` của `document.activeElement` giao cắt hoàn toàn với bounding rect của phần tử sticky bar (`intersectionArea / elementArea === 1.0`). | Rủi ro vi phạm SC 2.4.11 Focus Not Obscured (Minimum). Nguy cơ làm người dùng bàn phím mất dấu tiêu điểm. | Cấu hình `scroll-padding-bottom` tương ứng với chiều cao sticky bar hoặc đưa các nút hành động vào luồng tài liệu tự nhiên ở mobile. |
| `DEF-R06` | Control chính chỉ khoảng 32×32 CSS px và mức chú ý chỉ được phân biệt bằng màu. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Bounding rect của nút "Xem chi tiết", tab filter đo được $\le 32\times 32$px; Badge mức chú ý chỉ có sự thay đổi về thuộc tính màu, thiếu nhãn văn bản và biểu tượng hình học. | Rủi ro vi phạm SC 2.5.8 Target Size, Project Invariant 44×44px, và SC 1.4.1 Use of Color. Nguy cơ khó thao tác cảm ứng và mất thông tin với người khiếm thị màu. | Đảm bảo kích thước tương tác thực tế $\ge 44\times 44$ CSS px. Mỗi mức chú ý có đủ 3 kênh: Nhãn chữ tiếng Việt, ký hiệu hình học SVG, và màu sắc tương phản cao. |
| `DEF-R07` | Text spacing override làm cắt nhãn tab, nút và nội dung card. | `PRESCRIBED_DEFECT / POTENTIAL_FAILURE` | Cần đo: Khi tiêm 4 quy tắc SC 1.4.12, các phần tử có cố định `height` dẫn đến `scrollHeight > clientHeight` và `overflow: hidden`, gây mất một phần chữ. | Rủi ro vi phạm SC 1.4.12 Text Spacing. Nguy cơ vỡ layout và mất chữ khi người dùng tùy chỉnh khoảng cách văn bản. | Tuyệt đối không dùng `height` cố định cho các container văn bản. Sử dụng `min-height`, `padding` linh hoạt, cho phép container mở rộng theo nội dung. |

---

## 5. MA TRẬN REFLOW TOÀN DIỆN VÀ KIỂM SOÁT LOCAL OVERFLOW (P04)

### 5.1. Ma Trận Khóa Cứng: 5 Viewports × 5 States = 25 Tổ Hợp
Khắc phục triệt để `P04`, kiểm thử Reflow không chỉ đo `documentElement` mà được mở rộng thành ma trận 25 trạng thái độc lập:

- **5 Viewports Khóa Cứng**:
  1. `1440×900` (Desktop chuẩn)
  2. `768×1024` (Tablet chuẩn)
  3. `390×844` (Mobile portrait chuẩn)
  4. `320×800` (Reflow breakpoint khắt khe nhất theo SC 1.4.10)
  5. `844×390` (Mobile landscape chuẩn)
- **5 Trạng Thái Giao Diện (States)**:
  1. `initial`: Vừa tải trang mặc định (6 bản ghi hiển thị).
  2. `filtered`: Đã chọn tab `Chờ cập nhật` và tìm kiếm `"nguyen hoang minh anh"` (1 bản ghi `IR-1005`).
  3. `empty`: Tìm kiếm từ khóa không khớp `"khong-tim-thay"` (0 bản ghi, hiển thị empty state).
  4. `detail`: Đang mở xem chi tiết tình huống `IR-1005` (hiển thị đủ 9 trường).
  5. `acknowledged`: Đã kích hoạt nút `"Đánh dấu đã xem"` trên tình huống đang mở.

### 5.2. Danh Mục Các Phân Vùng Kiểm Tra Tràn Ngang Cục Bộ (Local Overflow Inventory)
Detector Reflow sẽ duyệt qua toàn bộ danh mục phân vùng sau tại mỗi tổ hợp trong 25 trạng thái:
1. `document.documentElement` (Page-level viewport overflow)
2. `document.body` (Body container overflow)
3. `#app-shell` / `.app-container` (Vỏ bọc ứng dụng ngoài cùng)
4. `.search-filter-section` (Khu vực thanh tìm kiếm và các tab bộ lọc workflow)
5. `.disruption-records-container` (Lưới bảng hoặc danh sách thẻ chứa các sự cố)
6. Từng dòng bảng `.table-row` hoặc từng thẻ sự cố `.incident-card` độc lập
7. `.detail-panel` / `#detail-view` (Vùng hiển thị chi tiết sự cố)

### 5.3. Điều Kiện Kiểm Chứng & Lệnh Cấm Triệt Để `overflow-x: hidden`
- **Quy tắc bất biến cốt lõi**:
  ```javascript
  // 1. Kiểm tra tràn ngang toàn cục
  const globalOverflow = document.documentElement.scrollWidth > window.innerWidth;

  // 2. Kiểm tra tràn ngang cục bộ (Local Horizontal Scroller)
  // Duyệt qua từng phần tử trong inventory:
  const localOverflow = element.scrollWidth > element.clientWidth + 1; // Dung sai 1px subpixel

  // 3. LỆNH CẤM TRIỆT ĐỂ: Không được dùng overflow-x: hidden trên body hoặc app-shell để che giấu lỗi tràn ngang
  const bodyComputed = window.getComputedStyle(document.body);
  const shellComputed = window.getComputedStyle(appShellElement);
  const isHidingOverflow = bodyComputed.overflowX === 'hidden' || shellComputed.overflowX === 'hidden';

  // Điều kiện PASS cho mỗi tổ hợp:
  const isReflowPass = (!globalOverflow) && (!localOverflow) && (!isHidingOverflow);
  ```
- Nếu `isHidingOverflow === true`, harness lập tức kích hoạt lỗi **`FORBIDDEN_OVERFLOW_MASKING`** và ghi nhận FAIL.

### 5.4. Cơ Chế Positive Control Cho Reflow Overflow
Harness tích hợp kịch bản Positive Control kiểm tra độ nhạy của detector Reflow:
- Tiêm một phần tử con nhân tạo vào trong một thẻ sự cố:
  ```html
  <div id="positive-control-overflow-injector" style="width: 9999px; height: 1px; visibility: hidden;"></div>
  ```
- Gọi trực tiếp chính hàm detector production `detectReflowAndLocalOverflow()`.
- **Kỳ vọng**: Detector bắt buộc phải phát hiện `localOverflow === true` và trả về `FAIL`. Nếu detector báo `PASS`, harness lập tức dừng với mã lỗi `SELF_CHECK_FAIL`. Sau khi kiểm tra xong, phần tử tiêm được gỡ bỏ hoàn toàn.

---

## 6. ĐẶC TẢ TIÊM THỬ NGHIỆM TEXT SPACING CHUẨN SC 1.4.12 (P05)

### 6.1. Khắc Phục Bộ Chọn Toàn Thể: Loại Bỏ `* { margin-bottom: 2em !important; }`
Khắc phục triệt để `P05`, việc áp dụng `margin-bottom: 2em` lên toàn bộ mọi phần tử bằng `*` là sai lệch so với tinh thần của SC 1.4.12 và có thể phá hỏng các layout container hoặc control inputs.

Theo WCAG 2.2 SC 1.4.12, 4 thuộc tính được áp dụng đúng vai trò ngữ nghĩa của chúng:
1. **Line height (Dòng)**: Ít nhất `1.5` lần cỡ chữ (`font-size`).
2. **Spacing following paragraphs (Khoảng cách sau đoạn văn)**: Ít nhất `2` lần cỡ chữ (`font-size`). **Chỉ áp dụng cho các khối đoạn văn bản thực sự (`<p>`, `.paragraph-text`)**, tuyệt đối không áp dụng lên `button`, `input`, `badge`, hoặc layout flex containers.
3. **Letter spacing (Khoảng cách ký tự)**: Ít nhất `0.12` lần cỡ chữ (`font-size`).
4. **Word spacing (Khoảng cách từ)**: Ít nhất `0.16` lần cỡ chữ (`font-size`).

### 6.2. Đoạn CSS Tiêm Thử Nghiệm Chuẩn Hóa
Harness sẽ tiêm đoạn CSS có phạm vi chọn lọc nghiêm ngặt như sau:
```css
/* Áp dụng line-height, letter-spacing, word-spacing cho toàn bộ các phần tử chứa văn bản */
body, h1, h2, h3, h4, h5, h6, p, span, a, button, input, label, th, td, div {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

/* CHỈ áp dụng khoảng cách sau đoạn văn cho các khối đoạn văn bản thực thụ */
p, .incident-summary-text, .next-action-text, .detail-description-text {
  margin-bottom: 2em !important;
}
```

### 6.3. Tiêu Chí Đánh Giá Cho Phép Cuộn Dọc Tự Nhiên
- **Được phép**: Khi tiêm Text Spacing, chiều cao tổng thể của trang và các thẻ sự cố được phép giãn nở theo chiều dọc, người dùng cuộn dọc tự nhiên để đọc đầy đủ.
- **Bắt buộc FAIL khi**:
  1. Xảy ra hiện tượng cắt cụt chữ (`text clipping`): `scrollHeight > clientHeight` trong container có `overflow: hidden`.
  2. Xảy ra hiện tượng chữ đè lên nhau (`text overlap`): Bounding box của các khối chữ kề nhau bị giao cắt làm mất khả năng đọc.
  3. Mất chức năng (`lost function`): Nút hành động hoặc ô nhập liệu bị đẩy ra ngoài vùng cuộn hoặc bị che khuất hoàn toàn.

---

## 7. REQUIRED INVENTORY, THUẬT TOÁN CLIPPING/OVERLAP VÀ DIRTY FIXTURES (P06)

### 7.1. Bảng Danh Mục Các Selector / Trường Bắt Buộc (Required Inventory)
Harness khóa cứng danh mục các selector cần đo đạc, đảm bảo fail-closed nếu thiếu bất kỳ selector nào:

| Khu Vực Giao Diện | Tên Trường / Thành Phần | Selector Dự Kiến Khóa Cứng | Vai Trò Ngữ Nghĩa |
|---|---|---|---|
| **App Header** | Tiêu đề trang | `h1#page-heading` | Cung cấp tên bảng điều phối chuẩn |
| **App Header** | Mô tả trang | `#page-description` | Hướng dẫn vận hành |
| **Controls** | Ô nhập tìm kiếm | `input#search-input` | Tìm kiếm theo từ khóa |
| **Controls** | Tab bộ lọc Tất cả | `button[data-workflow="ALL"]` | Hiển thị 6 tình huống |
| **Controls** | Tab bộ lọc Cần xử lý | `button[data-workflow="ACTION_NEEDED"]` | Hiển thị `IR-1001` |
| **Controls** | Tab bộ lọc Đang phối hợp | `button[data-workflow="COORDINATING"]` | Hiển thị `IR-1003`, `IR-1004` |
| **Controls** | Tab bộ lọc Chờ cập nhật | `button[data-workflow="WAITING_UPDATE"]` | Hiển thị `IR-1002`, `IR-1005` |
| **Controls** | Tab bộ lọc Đã ổn định | `button[data-workflow="STABILIZED"]` | Hiển thị `IR-1006` |
| **Controls** | Nhãn số lượng kết quả | `#results-count` | `aria-live="polite"` feedback |
| **List Records** | Container danh sách sự cố | `#disruption-records` | Vùng chứa bảng hoặc danh sách thẻ |
| **Record Fields** | Mã sự cố | `[data-field="disruption-id"]` | Mã nhận diện canonical |
| **Record Fields** | Huy hiệu mức chú ý | `[data-field="attention-level"]` | Chứa text label + SVG icon |
| **Record Fields** | Tên và mã tour | `[data-field="tour-code-name"]` | Tên tour canonical |
| **Record Fields** | Thời gian khởi hành | `[data-field="departure-time"]` | Giờ khởi hành canonical |
| **Record Fields** | Người phụ trách | `[data-field="assignee"]` | Tên nhân sự phụ trách |
| **Record Fields** | Số lượng khách | `[data-field="passenger-count"]` | Số khách bị ảnh hưởng |
| **Record Fields** | Tóm tắt sự cố | `[data-field="incident-summary"]` | Nội dung sự cố chi tiết |
| **Record Fields** | Việc tiếp theo | `[data-field="next-action"]` | Hành động xử lý tiếp theo |
| **Record Fields** | Trạng thái tác nghiệp | `[data-field="operational-status"]` | Trạng thái canonical |
| **Record Actions** | Nút Xem chi tiết | `button[data-action="view-detail"]` | Mở detail view của bản ghi |
| **Detail View** | Bảng chi tiết toàn trang | `#incident-detail-view` | In-page panel hiển thị 9 trường |
| **Detail Actions** | Nút Đánh dấu đã xem | `button#acknowledge-button` | Toggle trạng thái `aria-pressed` |
| **Detail Actions** | Nút Quay lại bảng xử lý | `button#back-to-board-button` | Phục hồi filter & focus trigger |
| **Empty State** | Vùng thông báo rỗng | `#empty-state-container` | Thông báo không có kết quả |
| **Empty State** | Nút Xóa điều kiện | `button#clear-filters-button` | Reset bộ lọc về mặc định |

Nếu bất kỳ selector nào trong danh mục trên vắng mặt khi chạy kiểm thử tại trạng thái tương ứng, harness lập tức thoát với lỗi **`REQUIRED_SELECTOR_MISSING`** (exit code 1).

### 7.2. Định Nghĩa Thuật Toán Phát Hiện Clipping & Overlap Chính Xác
1. **Thuật toán Phát hiện Clipping (`Text Clipping Detection`)**:
   - Một phần tử bị coi là bị cắt xén (clip) khi và chỉ khi thỏa mãn đồng thời:
     $$\text{isClipped} = (\text{scrollWidth} > \text{clientWidth} + 1 \lor \text{scrollHeight} > \text{clientHeight} + 1) \land (\text{overflowMode} \in \{\text{'hidden'}, \text{'clip'}\})$$
   - Ngoài ra, kiểm tra toạ độ hình học: Bounding rect của phần tử văn bản phải nằm trọn vẹn bên trong bounding rect của container chứa nó (`geometric containment`).
2. **Thuật toán Phát hiện Overlap Va Chạm (`Non-Parent-Child Overlap Detection`)**:
   - Tránh báo sai giữa phần tử cha và phần tử con: **Tuyệt đối loại trừ các cặp phần tử có quan hệ `parentElement.contains(childElement)`**.
   - Tránh báo sai giữa các phần tử khác nhánh cây DOM: Chỉ kiểm tra va chạm giữa các phần tử đồng cấp (siblings) hoặc các khối hộp nội dung độc lập trong cùng một container.
   - Công thức giao cắt hình học giữa Box A và Box B:
     $$\text{Overlap} = \max(0, \min(A.\text{right}, B.\text{right}) - \max(A.\text{left}, B.\text{left})) \times \max(0, \min(A.\text{bottom}, B.\text{bottom}) - \max(A.\text{top}, B.\text{top}))$$
   - Nếu $\text{Overlap} > 0$ và cả hai phần tử đều chứa văn bản nhìn thấy (`visible text`), ghi nhận lỗi `TEXT_OVERLAP_COLLISION`.

### 7.3. Dirty Fixtures Độc Lập Cho Clipping và Overlap
Harness sẽ duy trì 2 dirty fixtures độc lập nhằm xác thực rằng detector thực sự có khả năng bắt lỗi:
1. **`dirty_clipping_fixture.html`**:
   - Chứa một thẻ sự cố với container có `height: 30px; overflow: hidden;` chứa chuỗi văn bản dài của `IR-1005`.
   - Khi chạy detector `detectTextClipping()` trên fixture này, kết quả bắt buộc phải là `DETECTED_CLIPPING` (Positive control pass).
2. **`dirty_overlap_fixture.html`**:
   - Chứa hai khối chữ đồng cấp được đặt CSS âm: `margin-top: -40px;` khiến văn bản của hai khối đè trực tiếp lên nhau.
   - Khi chạy detector `detectTextOverlap()` trên fixture này, kết quả bắt buộc phải là `DETECTED_OVERLAP` (Positive control pass).

---

## 8. PHÉP HỘI TOÀN DIỆN (FULL BOOLEAN CONJUNCTION) VÀ EVIDENCE LEDGER (P07)

### 8.1. Kiểm Toán Bất Biến Zero Motion Tuyệt Đối
Hệ thống sẽ thực thi hàm `auditZeroMotionCompliance()` kiểm tra toàn bộ stylesheet và DOM:
1. Quét CSS computed styles trên toàn bộ phần tử trong DOM:
   - `transition-duration`: Phải là `0s` hoặc rỗng.
   - `animation-duration`: Phải là `0s` hoặc rỗng.
   - `animation-name`: Phải là `none` hoặc rỗng.
2. Quét toàn bộ nội dung `<style>` và CSS rules:
   - Nghiêm cấm sự xuất hiện của quy tắc `@keyframes`.
   - Nghiêm cấm thuộc tính `scroll-behavior: smooth`.
3. Kiểm tra JavaScript runtime: Không có bộ đếm thời gian `setInterval` hoặc `requestAnimationFrame` nào thực hiện việc tự động xoay chuyển nội dung (`auto-rotating content`).

### 8.2. Tiền Kiểm Tra Forced Colors Mode (High Contrast Preflight)
Harness kích hoạt giả lập môi trường độ tương phản cao thông qua giao thức CDP:
```javascript
await client.send('Emulation.setEmulatedMedia', {
  media: 'screen',
  features: [{ name: 'forced-colors', value: 'active' }]
});
```
- Kiểm tra tính sẵn sàng của môi trường giả lập (`preflight check`). Nếu trình duyệt không hỗ trợ hoặc tính năng không được thực thi (`NOT_EXECUTED`), harness **tuyệt đối không được gán PASS giả tạo**, mà phải ghi nhận `UNSUPPORTED_ENVIRONMENT_FLAG` và dừng kiểm toán.
- Khi Forced Colors kích hoạt: Kiểm tra các đường viền phân tách (`border-color`), trạng thái active của tab, và đường viền tiêu điểm (`focus-visible`) không bị biến mất hoàn toàn.

### 8.3. Danh Mục Target Size Đa Trạng Thái: Phân Định Dự Án 44×44px vs WCAG 24×24px
Harness lập danh mục kiểm toán kích thước mục tiêu tương tác trên toàn bộ 5 trạng thái (`initial`, `filtered`, `empty`, `detail`, `acknowledged`):
- **Phân định rõ ràng trong báo cáo**:
  1. `WCAG_SC_2_5_8_PASS`: Đo đạc theo ngưỡng chuẩn mực 24×24 CSS px (kèm ghi nhận các ngoại lệ nếu có).
  2. `PROJECT_INVARIANT_44x44_PASS`: Đo đạc theo quy chuẩn dự án khắt khe hơn: Mọi primary control (nút Xem chi tiết, tab filter, nút Đánh dấu đã xem, nút Quay lại, nút Xóa điều kiện) đều phải có effective target $\ge 44\times 44$ CSS px.

### 8.4. Kiểm Tra Focus Obscuration Trên Từng Stop Bàn Phím Native
Trong kịch bản kiểm thử bàn phím native `T09`, harness sẽ lắng nghe sự kiện `focusin` trên từng bước nhấn phím `Tab`/`Shift+Tab`:
- Tại mỗi điểm dừng tiêu điểm (`focus stop`):
  1. Lấy bounding box của `document.activeElement`.
  2. Lấy danh sách toàn bộ các phần tử tác giả có `position: fixed` hoặc `position: sticky` (ví dụ: header hoặc bottom bar).
  3. Tính toán tỷ lệ che phủ hình học:
     $$\text{Obscuration Ratio} = \frac{\text{Area}(\text{activeElement} \cap \text{stickyElement})}{\text{Area}(\text{activeElement})}$$
  4. Nếu $\text{Obscuration Ratio} === 1.0$ (phần tử bị che khuất 100%), lập tức ghi nhận vi phạm **`SC_2_4_11_FOCUS_FULLY_OBSCURED`** và kết luận FAIL.

### 8.5. Đồng Bộ Động Evidence Ledger và Điều Kiện Fail-Closed Nghiêm Ngặt
Harness kiểm thử sẽ tính toán động và ghi nhận toàn bộ bằng chứng vào `VERIFICATION.json`:
- Exact SHA-256 hash của từng tệp tin (`baseline/index.html`, `directions/option_a.html`, `directions/option_b.html`, `index.html`, `RESPONSIVE_CONTRACT.yaml`, v.v.).
- Kích thước pixel thực tế (width × height), byte size, và hash của toàn bộ 14 authoritative screenshots.
- **Công thức Nghiệm thu Phép hội Boolean (Full Boolean Conjunction)**:
  $$\text{FINAL\_VERDICT} = \bigwedge_{i=1}^{7} \text{Gate}_{R0i} \land \bigwedge_{j=1}^{14} \text{Test}_{Tj} \land \bigwedge_{k=1}^{4} \text{PositiveControl}_{k} \land \text{ZeroMotion} \land \text{LedgerSync}$$
  Chỉ cần một biến bất kỳ có giá trị `false`, hoặc phát hiện thiếu selector/artifact, harness lập tức thoát với `exit code 1` và từ chối phát hành báo cáo hoàn thành.

---

## 9. KẾT LUẬN & TRẠNG THÁI KHÓA CỨNG

Bản First Response R02 này giải quyết hoàn chỉnh 100% các điểm đánh giá của Controller Sol tại `DESIGN_TRAINING_010_FIRST_RESPONSE_REVIEW_001.md`.

```yaml
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_R02_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
PLANNING_FINDINGS_ADDRESSED: P01-P07
VISUAL_DIRECTION_SELECTION: DEFERRED_PENDING_CONTROLLER_APPROVAL
NEXT_ACTION: SUBMIT_R02_TO_CONTROLLER_ON_TAB_A_AND_AWAIT_AUTHORIZATION
```

Antigravity xác nhận: Chưa có bất kỳ tệp mã nguồn nào (`baseline/`, `directions/`, `index.html`, `verify_module_010.js`, ảnh authoritative, hoặc tệp ZIP) được tạo ra. Toàn bộ quá trình lập trình sẽ chỉ được bắt đầu sau khi Controller Sol phê duyệt bản R02 này và ban hành `IMPLEMENTATION_AUTHORIZATION: GRANTED`.
