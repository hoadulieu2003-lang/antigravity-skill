# DESIGN TRAINING 010 — FIRST RESPONSE
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
DATE: 2026-09-14
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
```

---

## 1. RESEARCH_PLAN (Kế hoạch Nghiên cứu & Ranh giới Diễn giải)

Phần nghiên cứu này thiết lập ranh giới diễn giải pháp lý và kỹ thuật giữa các tiêu chuẩn chuẩn mực quốc tế (W3C Normative Recommendations), tài liệu hướng dẫn tham khảo (Informative Understanding Documents), và các ràng buộc bất biến riêng của dự án (Project Invariants).

### 1.1. Bảng đối chiếu ranh giới chuẩn mực và Project Invariants

| Tiêu chí / Chuẩn mực | Khuyến nghị Chuẩn mực (Normative) | Tài liệu Giải thích (Informative Understanding) | Quy chuẩn Dự án (Project Invariant) | Ranh giới Diễn giải & Giới hạn Bằng chứng |
|---|---|---|---|---|
| **SC 1.4.10 Reflow** (Level AA) | Nội dung cuộn 1 chiều ở 320 CSS px (chiều rộng) hoặc 256 CSS px (chiều cao) không mất thông tin. Ngoại lệ: Nội dung đòi hỏi bố cục 2 chiều (ví dụ: data table phức tạp). | Giải thích kỹ thuật tái cấu trúc dạng thẻ, wrap cột, và cơ chế hiển thị linh hoạt. | **Tuyệt đối cấm horizontal scroll** ở cả cấp độ trang (`page-level`) lẫn cấp độ thành phần (`component-level`) trên 320 CSS px. **Không áp dụng ngoại lệ table**. | Reflow 320px cho phép cuộn dọc tự nhiên. Telemetry chỉ đo `scrollWidth <= innerWidth`. Không dùng `overflow-x: hidden` trên body để che lỗi. |
| **SC 1.4.4 Resize Text** (Level AA) | Ngoại trừ phụ đề và ảnh chữ, văn bản có thể phóng lớn đến 200% mà không cần công nghệ trợ năng và không mất nội dung/hành động. | Trình bày các kỹ thuật font linh hoạt, container tương đối (`rem`, `em`, `%`). | Toàn bộ giao diện phải hỗ trợ phóng to text 200% tại viewport 320×800 mà không gây overlap, clip chữ hoặc mất nút hành động. | Đo đạc bằng phương pháp `CSS Text Size Scaling Simulation` (điều chỉnh root font size/rem scaling). **Tuyệt đối không tuyên bố là Native Browser Zoom** vì browser zoom thay đổi cả DPR và layout viewport. |
| **SC 1.4.12 Text Spacing** (Level AA) | Không mất nội dung/chức năng khi áp dụng 4 giá trị override: line-height $\ge 1.5$, paragraph spacing $\ge 2$, letter spacing $\ge 0.12$, word spacing $\ge 0.16$. | Hướng dẫn kiểm tra bằng bookmarklet hoặc CSS injection để đảm bảo container không fixed height. | Hỗ trợ 100% việc người dùng tiêm override 4 thuộc tính trên mà không làm vỡ card, không cắt xén nhãn tab, badge hoặc nút. | Tiêu chuẩn không yêu cầu tác giả đặt mặc định các giá trị này trong stylesheet sản phẩm; chỉ yêu cầu kiến trúc layout không gãy khi người dùng can thiệp override. |
| **SC 1.3.4 Orientation** (Level AA) | Không hạn chế hiển thị hoặc thao tác vào một hướng màn hình (portrait/landscape), trừ khi một hướng cụ thể là thiết yếu (`essential`). | Bàn về việc người dùng gắn thiết bị cố định trên xe lăn hoặc giá đỡ không thể xoay màn hình. | **Tuyệt đối không khoá hướng màn hình**. Cấm toàn bộ overlay/modal/thông báo "Vui lòng xoay thiết bị" trên màn hình dọc hoặc ngang. | Bảng điều phối TRIPFLOW không có ngoại lệ essential. Cả portrait (390×844) và landscape (844×390) đều phải vận hành đầy đủ chức năng. |
| **SC 2.5.8 Target Size (Minimum)** (Level AA) | Vùng kích thước mục tiêu tối thiểu 24×24 CSS px, kèm các ngoại lệ (inline target, spacing offset, user agent control, essential). | Khuyến khích kích thước lớn hơn cho người dùng run tay hoặc thao tác một tay trên màn hình cảm ứng. | **Mọi primary control phải đạt tối thiểu 44×44 CSS px** (nút bấm, trigger, tab filter, action buttons). | Tách bạch rõ ràng: 44×44px là Project Invariant nghiêm ngặt hơn; 24×24px là ngưỡng tối thiểu của WCAG 2.2 SC 2.5.8. Báo cáo đo đạc riêng cả hai chỉ số. |
| **SC 2.4.11 Focus Not Obscured (Minimum)** (Level AA) | Khi một thành phần nhận focus bàn phím, thành phần đó không bị che khuất hoàn toàn bởi nội dung tác giả tạo ra (như fixed/sticky elements). | Cho phép che khuất một phần (partial obscuration) nhưng khuyến khích nhìn thấy toàn bộ. | **Cấm che khuất hoàn toàn** phần tử đang focus. Tận dụng `scroll-padding` hoặc luồng bố cục tự nhiên để đảm bảo tiêu điểm luôn hiển thị rõ ràng. | Telemetry tính toán giao điểm hình học (`bounding rect intersection`) giữa activeElement đang focus và toàn bộ fixed/sticky containers. |

### 1.2. Giới hạn Bằng chứng Đo đạc Tự động (Automated Telemetry Boundaries)
- **Những gì Telemetry được phép kết luận**:
  - Kích thước hình học thực tế (`clientWidth`, `clientHeight`, `scrollWidth`, `scrollHeight`, `getBoundingClientRect`).
  - Giao điểm và tỷ lệ che khuất hình học giữa active element và fixed/sticky overlays.
  - Trình tự focus thực tế (`DOM sequence`, `document.activeElement` sau mỗi bước phím Tab/Shift+Tab).
  - Sự tồn tại và tính chính xác của dữ liệu văn bản, thuộc tính ARIA (`aria-pressed`, `aria-expanded`, `aria-label`).
  - Hash SHA-256, kích thước byte, và cấu trúc tệp tin.
- **Những gì Telemetry TUYỆT ĐỐI KHÔNG ĐƯỢC SUY DIỄN**:
  - Không suy diễn "giao diện trực quan hơn", "giảm tải nhận thức cho điều phối viên".
  - Không tuyên bố "hoàn toàn thân thiện với mọi người khuyết tật" khi chưa có kiểm thử thực tế từ người dùng thật (`Manual Review Pending`).
  - Không tuyên bố "đạt chứng nhận WCAG toàn diện" mà chỉ công bố việc vượt qua các kịch bản kiểm thử tự động trong phạm vi được định nghĩa.

---

## 2. BASELINE_AUDIT_PLAN (Kế hoạch Kiểm toán Bảy Defect của Baseline)

Baseline (`baseline/index.html`) được xây dựng có chủ đích nhằm chứa đúng 7 defect theo đặc tả của Sol. Kế hoạch kiểm toán sau đây phân định rõ: Phương pháp quan sát bằng chứng thực nghiệm (Observed Evidence), Tiêu chí/Rủi ro liên quan (Relevant Criterion/Risk), và Giải pháp kỹ thuật trên Candidate (Candidate Response).

| Defect ID | Tên Defect Khóa cứng | Phương pháp Quan sát Thực nghiệm (Observed Evidence) | Tiêu chí & Rủi ro Liên quan (Relevant Criterion / Risk) | Giải pháp Kỹ thuật trên Candidate (Candidate Response) |
|---|---|---|---|---|
| `DEF-R01` | App shell có `min-width: 1180px`, tạo horizontal overflow ở 320/390px. | Đo đạc tự động: `document.documentElement.scrollWidth > window.innerWidth` tại viewports 320×800px và 390×844px. Kiểm tra CSS computed style: phần tử container mang thuộc tính `min-width: 1180px`. | Vi phạm nghiêm trọng SC 1.4.10 Reflow và Project Invariant. Buộc người dùng mobile phải cuộn hai chiều, gây mất phương hướng và bỏ sót dữ liệu sự cố. | Loại bỏ hoàn toàn `min-width: 1180px`. Áp dụng `width: 100%`, `max-width: 1440px`, CSS Grid/Flexbox co giãn nội tại (`intrinsic sizing`), `box-sizing: border-box`. Đảm bảo `scrollWidth <= innerWidth` trên mọi kích thước. |
| `DEF-R02` | Mobile ẩn cột “Khách” và “Việc tiếp theo”, gây mất thông tin. | Trên viewports 390×844px và 320×800px, bộ chọn CSS `@media (max-width: ...)` áp dụng `display: none` hoặc `visibility: hidden` lên cột Pax và Next Action. | Vi phạm Gate R01 Content Parity và SC 1.3.1 Info and Relationships. Điều phối viên trên điện thoại không biết số lượng khách bị ảnh hưởng và hành động cần làm ngay. | Bảo toàn 100% chín trường dữ liệu canonical trên tất cả các breakpoint. Khi chuyển sang mobile, cấu trúc lại dạng thẻ đa tầng hiển thị đầy đủ nhãn và giá trị: "Khách: 18", "Việc tiếp theo: Xác nhận phương án xe thay thế...". |
| `DEF-R03` | Tên tour và người phụ trách dài bị ellipsis, không có cơ chế xem đầy đủ. | Kiểm tra computed style trên phần tử tên tour (`IR-1005`) và người phụ trách (`Nguyễn Hoàng Minh Anh`): có `text-overflow: ellipsis; white-space: nowrap; overflow: hidden;`. So sánh: `scrollWidth > clientWidth` trong khi không có `title`, dialog, hoặc expanded view để tiếp cận. | Mất thông tin nhận diện sự cố, vi phạm Gate R01 và SC 1.4.4. Người dùng không thể đọc trọn vẹn tên tour dài của `IR-1005` và tên đầy đủ của nhân sự phụ trách. | Cho phép văn bản tự nhiên ngắt dòng (`overflow-wrap: break-word; word-break: break-word; white-space: normal;`). Không dùng ellipsis cắt cụt văn bản mà không có cơ chế xem tiếp. Màn hình chi tiết hiển thị trọn vẹn 100% nội dung. |
| `DEF-R04` | Giao diện hiển thị thông báo yêu cầu xoay ngang trên portrait, hạn chế orientation. | Trên thiết bị dọc (390×844px portrait), màn hình bị chặn bởi overlay `@media (orientation: portrait)` mang thông báo `"Vui lòng xoay ngang thiết bị"` và vô hiệu hóa tương tác bảng. | Vi phạm trực tiếp SC 1.3.4 Orientation. Gây cản trở nghiêm trọng đối với người dùng không thể xoay thiết bị do gắn cố định trên giá đỡ. | Gỡ bỏ hoàn toàn mọi rào cản orientation. Xây dựng bố cục linh hoạt thích ứng cả chiều dọc lẫn chiều ngang mà không yêu cầu người dùng phải xoay màn hình. |
| `DEF-R05` | Sticky action bar che phần tử đang focus khi viewport thấp hoặc text scale 200%. | Khi người dùng dùng phím Tab di chuyển xuống cuối danh sách, sticky bar (`position: sticky; bottom: 0`) đè lên phần tử đang nhận focus (`document.activeElement`), dẫn đến tỷ lệ che phủ hình học đạt 100%. | Vi phạm SC 2.4.11 Focus Not Obscured (Minimum). Người dùng bàn phím bị "mù tiêu điểm", không biết con trỏ đang ở đâu để kích hoạt hành động. | Thiết lập `scroll-padding-bottom` trên container cuộn tương ứng với chiều cao của sticky bar. Trên mobile, đưa action bar vào luồng tài liệu tự nhiên hoặc tính toán offset để phần tử focus luôn nằm ngoài vùng che phủ. |
| `DEF-R06` | Control chính chỉ khoảng 32×32 CSS px và mức chú ý chỉ được phân biệt bằng màu. | Đo `getBoundingClientRect()` của nút "Xem chi tiết", bộ lọc tab và nút acknowledge: chiều rộng/cao chỉ đạt ~32px. Phân tích màu: Badge mức chú ý chỉ đổi `background-color`, không có text nhãn mức chú ý và không có icon hình học đi kèm. | Vi phạm SC 2.5.8 Target Size, Project Invariant 44×44px, và SC 1.4.1 Use of Color. Người khiếm thị màu hoặc người dùng cảm ứng gặp khó khăn khi nhận diện và bấm nút. | Mọi control chính đều có vùng tương tác tối thiểu 44×44 CSS px. Mỗi mức chú ý được thể hiện qua 3 lớp độc lập: (1) Nhãn chữ tiếng Việt tường minh, (2) Biểu tượng hình học SVG đặc thù, (3) Màu sắc tương phản cao theo WCAG AA. |
| `DEF-R07` | Text spacing override làm cắt nhãn tab, nút và nội dung card. | Khi tiêm 4 quy tắc SC 1.4.12, các nút và container mang thuộc tính cố định chiều cao `height: 36px; overflow: hidden;` bị cắt mất 1 phần chữ phía dưới hoặc tràn ra ngoài giao diện. | Vi phạm SC 1.4.12 Text Spacing. Người dùng cần tuỳ chỉnh khoảng cách văn bản để dễ đọc sẽ bị mất nội dung nút hoặc nhãn điều khiển. | Tuyệt đối không dùng `height` cố định cho các phần tử chứa văn bản. Dùng `min-height`, `padding` linh hoạt, và bố cục Flexbox/Grid co giãn tự động theo kích thước khối chữ sau khi giãn dòng. |

---

## 3. TWO_RESPONSIVE_DIRECTIONS (Hai Chiến Lược Bố Cục Thích Ứng & Phân Tích Trade-offs)

Hai chiến lược được xây dựng từ hai triết lý kiến trúc thông tin hoàn toàn khác nhau, vận hành trên cùng bộ fixture dữ liệu canonical 6 tình huống (`IR-1001` đến `IR-1006`).

```
+----------------------------------------------------------------------------------------------------+
|                                    TRIPFLOW DISRUPTION BOARD                                       |
+--------------------------------------------------+-------------------------------------------------+
| DIRECTION A: ADAPTIVE LEDGER                     | DIRECTION B: PRIORITY STACK                     |
| (Triết lý Bảng Dữ liệu Đa tầng)                  | (Triết lý Ngăn xếp Thẻ Thứ bậc)                 |
+--------------------------------------------------+-------------------------------------------------+
| DESKTOP (1440px):                                | DESKTOP (1440px):                               |
| [ Table Grid đa cột: ID | Ưu tiên | Tour |       | [ Intrinsic Priority Cards phân cụm theo        |
|   Khởi hành | Phụ trách | Khách | Sự cố |        |   mức độ khẩn cấp: Thẻ nổi bật CRITICAL ->      |
|   Việc tiếp theo | Chi tiết ]                    |   Lưới 2 cột HIGH/MEDIUM -> Danh sách LOW/RES ] |
+--------------------------------------------------+-------------------------------------------------+
| TABLET (768px):                                  | TABLET (768px):                                 |
| [ Bảng nén gọn cột chính; thông tin phụ          | [ Lưới 2 cột đồng đều giữ nguyên hình thái      |
|   (Phụ trách, Việc tiếp theo) chuyển vào         |   thẻ; thông tin bố trí theo tỷ lệ nhãn-giá trị |
|   sub-row mở rộng hoặc disclosure ]              |   dễ đọc ]                                      |
+--------------------------------------------------+-------------------------------------------------+
| MOBILE (390px / 320px):                          | MOBILE (390px / 320px):                         |
| [ Chuyển đổi cấu trúc thành Card nhiều tầng;     | [ Thu về 1 cột dọc tuyến tính duy nhất;         |
|   giữ nguyên toàn bộ 9 trường dữ liệu và vị trí  |   giữ nguyên hoàn toàn mô hình đọc từ desktop,   |
|   hành động gần tiêu đề/mã sự cố ]               |   ưu tiên tính liên tục nhận thức ]             |
+--------------------------------------------------+-------------------------------------------------+
```

### 3.1. Đặc tả Chi tiết Hai Hướng Thiết Kế

#### Hướng A — Adaptive Ledger (Lưới Dữ Liệu Thích Ứng Đa Tầng)
- **Triết lý Thiết kế**: Lấy tính năng đối chiếu dữ liệu mật độ cao của người điều phối trực ca làm trung tâm.
- **Desktop (>= 1024px)**: Bảng dữ liệu đa cột (tabular ledger) hiển thị song song 6 tình huống. Cho phép điều phối viên quét ngang nhanh chóng để so sánh thời gian khởi hành, quy mô đoàn khách (Pax), và người phụ trách giữa các tour khác nhau.
- **Tablet (768px - 1023px)**: Rút gọn các cột thứ cấp, chuyển `Phụ trách` và `Việc tiếp theo` thành khối thông tin phụ nằm ngay dưới tên tour hoặc trong dòng phụ (sub-row) rõ ràng, bảo toàn toàn bộ dữ liệu mà không gây tràn ngang.
- **Mobile (320px - 767px)**: Tái cấu trúc hoàn toàn hình thái từ bảng sang dạng thẻ đa tầng (`Adaptive Data Card`). Mỗi thẻ phân định rõ:
  - Header: Mã sự cố (`IR-1001`), Mức chú ý (kèm icon và nhãn tiếng Việt), Badge trạng thái.
  - Body: Tên tour, Thời gian khởi hành, Nhân sự phụ trách, Số lượng khách.
  - Callout box: Nội dung sự cố chi tiết và Việc tiếp theo cần xử lý.
  - Footer: Nút hành động "Xem chi tiết" (đạt target 44×44px).
- **Trật tự Đọc DOM & Trật tự Hiển thị**: Tuyệt đối đồng nhất giữa DOM tree và CSS grid. Không sử dụng thuộc tính CSS `order` gây lệch lạc hành trình phím của người khiếm thị.

#### Hướng B — Priority Stack (Ngăn Xếp Thẻ Ưu Tiên Thứ Bậc)
- **Triết lý Thiết kế**: Lấy mức độ khẩn cấp và chu trình xử lý sự cố làm trung tâm. Không lấy bảng desktop làm xuất phát điểm.
- **Desktop (>= 1024px)**: Sử dụng bố cục thẻ phân tầng nội tại (`Intrinsic Priority Layout`). Tình huống `CRITICAL` (`IR-1001`) được đặt ở vị trí tiêu điểm (Spotlight Banner/Hero Card) phía trên; các tình huống `HIGH` và `MEDIUM` xếp thành lưới 2 cột; các tình huống `LOW` và `RESOLVED` xếp ở nhóm bên dưới.
- **Tablet (768px - 1023px)**: Chuyển toàn bộ thành lưới 2 cột hoặc danh sách thẻ xếp tầng có phân cấp visual weight rõ rệt.
- **Mobile (320px - 767px)**: Giữ nguyên 100% mô hình nhận thức dạng ngăn xếp dọc tuyến tính (1 cột). Sự cố khẩn cấp nhất luôn nằm đầu tiên, các thông tin bên trong thẻ được sắp xếp có trật tự thị giác từ quan trọng nhất đến thông tin hỗ trợ.
- **Trật tự Đọc DOM & Trật tự Hiển thị**: Trật tự trong DOM tree tuân thủ nghiêm ngặt mức độ khẩn cấp (`IR-1001` đứng đầu), hoàn toàn trùng khớp với hướng quét mắt của người dùng.

### 3.2. Bảng So Sánh Toàn Diện Năm Chiều Bắt Buộc

| Chiều Đánh Giá | Hướng A — Adaptive Ledger | Hướng B — Priority Stack | Đánh Giá & Điểm Đánh Đổi (Trade-offs) |
|---|---|---|---|
| **1. Tốc độ quét nhiều bản ghi trên Desktop** | **Rất cao (Vượt trội)**. Cấu trúc hàng ngang cho phép mắt đối chiếu tức thì giờ khởi hành và số khách giữa các tour mà không cần cuộn dọc nhiều. | **Trung bình**. Các thẻ chiếm nhiều diện tích dọc, đòi hỏi điều phối viên phải cuộn trang hoặc đảo mắt theo dạng z-pattern để so sánh giữa các tour. | Hướng A tối ưu hơn cho ca trực cần kiểm soát đồng thời nhiều thông số định lượng; Hướng B tối ưu hơn cho ca trực chỉ tập trung vào sự cố báo động đỏ. |
| **2. Khả năng đọc đầy đủ trên 320 CSS px** | **Tốt**. Đạt 100% Content Parity khi chuyển đổi thành thẻ nhiều tầng. Tốn công đoạn chuyển đổi cấu trúc giao diện giữa các breakpoint. | **Rất tốt (Tự nhiên)**. Do mô hình cơ sở vốn là ngăn xếp thẻ dọc, giao diện co giãn về 320px một cách hoàn toàn tự nhiên mà không cần đổi hình thái container. | Hướng B có tính mượt mà và ít rủi ro layout shift hơn khi resize; Hướng A đòi hỏi CSS chặt chẽ hơn để chuyển trạng thái từ table sang card. |
| **3. Hành trình bàn phím (Keyboard Journey)** | Trật tự Tab di chuyển từ trái sang phải qua các cell hoặc nút trong hàng, sau đó xuống hàng tiếp theo. Trên mobile, Tab tuần tự qua từng thẻ. | Trật tự Tab di chuyển tuần tự qua từng thẻ ưu tiên từ trên xuống dưới. Người dùng bàn phím tiếp cận ngay sự cố khẩn cấp nhất. | Hướng B mang lại trải nghiệm bàn phím nhất quán hơn giữa các thiết bị; Hướng A quen thuộc hơn với nhân sự văn phòng quen dùng bảng tính. |
| **4. Rủi ro mất ngữ cảnh khi chuyển đổi View (Context Preservation)** | **Có rủi ro nhận thức nhẹ**. Người dùng chuyển đổi giữa desktop và mobile có thể ngỡ ngàng trước sự thay đổi từ dạng Bảng sang dạng Thẻ. | **Rất thấp (Tính liên tục tối đa)**. Mô hình nhận thức (Mental Model) là các khối thẻ được giữ nguyên vẹn trên cả desktop, tablet lẫn điện thoại di động. | Hướng B vượt trội về tính liên tục của trải nghiệm (`Cognitive Continuity`); Hướng A đòi hỏi người dùng làm quen với hai dạng hiển thị khác nhau. |
| **5. Khả năng chịu tải Text Scale (200%), Spacing & Long Content** | Cần quản lý chặt chẽ độ rộng của các cột trên desktop để không bị xô lệch khi giãn dòng. Khi sang mobile card, khả năng chịu tải rất tốt. | **Rất cao**. Bố cục thẻ độc lập cho phép mỗi khối nội dung tự do giãn nở theo chiều dọc khi áp dụng Text Spacing hoặc Text Scale 200% mà không ảnh hưởng thẻ khác. | Hướng B có biên độ an toàn cơ học (Mechanical Safety Margin) cao hơn khi chịu áp lực nội dung dài như `IR-1005` hay người phụ trách tên dài. |

---

## 4. CANONICAL_CONTENT_AND_INTERACTION_MODEL (Mô Hình Nội Dung & Tương Tác Chuẩn)

### 4.1. Xác nhận Sáu Tuple và Chín Trường Canonical
Hệ thống khóa cứng 6 bản ghi dữ liệu mẫu, tuyệt đối không sửa đổi ID, nội dung, dấu câu, nhân sự hoặc trạng thái:

1. **`IR-1001`**:
   - `disruption_id`: `IR-1001`
   - `attention_level`: `CRITICAL` (Nhãn: `Cần xử lý khẩn cấp`, Ký hiệu: `[!]` Tam giác cảnh báo)
   - `tour_code_and_name`: `TF-802 · Tour Fansipan Sapa 2 Ngày 1 Đêm`
   - `departure_time`: `2026-09-15 06:30 ICT`
   - `assignee`: `Lan Nguyễn`
   - `passenger_count`: `18`
   - `incident_summary`: `Chưa chốt được xe trung chuyển phù hợp cho hành khách sử dụng xe lăn tại điểm đón số 3.`
   - `next_action`: `Xác nhận phương án xe thay thế trước 04:30.`
   - `operational_status`: `Cần xử lý`
2. **`IR-1002`**:
   - `disruption_id`: `IR-1002`
   - `attention_level`: `HIGH` (Nhãn: `Chú ý cao`, Ký hiệu: `[^]` Kim cương cảnh báo)
   - `tour_code_and_name`: `TF-803 · Tour Hạ Long Du Th thuyền 5 Sao`
   - `departure_time`: `2026-09-15 08:00 ICT`
   - `assignee`: `Huy Trần`
   - `passenger_count`: `24`
   - `incident_summary`: `Cảng vụ phát cảnh báo dông lốc; giờ rời bến có thể thay đổi.`
   - `next_action`: `Kiểm tra thông báo cảng vụ lúc 05:30 và cập nhật cho đoàn.`
   - `operational_status`: `Chờ cập nhật`
3. **`IR-1003`**:
   - `disruption_id`: `IR-1003`
   - `attention_level`: `MEDIUM` (Nhãn: `Mức trung bình`, Ký hiệu: `[~]` Hình tròn phối hợp)
   - `tour_code_and_name`: `TF-804 · Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm`
   - `departure_time`: `2026-09-16 09:45 ICT`
   - `assignee`: `Mai Đỗ`
   - `passenger_count`: `42`
   - `incident_summary`: `Hai hành khách cần lối lên xuống ít bậc và vị trí ngồi gần cửa.`
   - `next_action`: `Xác nhận xe đón có bậc hỗ trợ và giữ hai ghế hàng đầu.`
   - `operational_status`: `Đang phối hợp`
4. **`IR-1004`**:
   - `disruption_id`: `IR-1004`
   - `attention_level`: `MEDIUM` (Nhãn: `Mức trung bình`, Ký hiệu: `[~]` Hình tròn phối hợp)
   - `tour_code_and_name`: `TF-805 · Tour Tràng An - Bái Đính 1 Ngày`
   - `departure_time`: `2026-09-16 07:30 ICT`
   - `assignee`: `An Phạm`
   - `passenger_count`: `35`
   - `incident_summary`: `Nhà hàng đề nghị chuyển giờ ăn trưa từ 11:30 sang 12:15.`
   - `next_action`: `Đối chiếu lịch tham quan trước khi chấp thuận thay đổi.`
   - `operational_status`: `Đang phối hợp`
5. **`IR-1005`**:
   - `disruption_id`: `IR-1005`
   - `attention_level`: `LOW` (Nhãn: `Mức thấp`, Ký hiệu: `[-]` Hình vuông theo dõi)
   - `tour_code_and_name`: `TF-806 · Hành trình Di sản miền Trung dành cho nhóm gia đình nhiều thế hệ`
   - `departure_time`: `2026-09-17 05:45 ICT`
   - `assignee`: `Nguyễn Hoàng Minh Anh`
   - `passenger_count`: `31`
   - `incident_summary`: `Danh sách phòng có một tên hành khách dài hơn giới hạn hiển thị dự kiến của bản cũ.`
   - `next_action`: `Giữ nguyên tên đầy đủ; không cắt bằng dấu ba chấm nếu không có cách xem lại.`
   - `operational_status`: `Chờ cập nhật`
6. **`IR-1006`**:
   - `disruption_id`: `IR-1006`
   - `attention_level`: `RESOLVED` (Nhãn: `Đã ổn định`, Ký hiệu: `[v]` Dấu kiểm hoàn tất)
   - `tour_code_and_name`: `TF-807 · Tour Mekong Buổi Sáng`
   - `departure_time`: `2026-09-18 06:00 ICT`
   - `assignee`: `Bình Lê`
   - `passenger_count`: `16`
   - `incident_summary`: `Điểm đón cũ tạm đóng để sửa đường; điểm đón thay thế đã được xác nhận.`
   - `next_action`: `Không cần hành động thêm.`
   - `operational_status`: `Đã ổn định`

### 4.2. Mô Hình Điều Hướng & Tìm Kiếm Phối Hợp (AND Filter Engine)
- **Chuẩn hoá Tìm kiếm**:
  - Chuỗi tìm kiếm được cắt bỏ khoảng trắng đầu/cuối (`trim()`).
  - Không phân biệt hoa/thường (`toLowerCase()`).
  - Hỗ trợ tìm kiếm tiếng Việt không dấu thông qua giải thuật chuẩn hoá NFD (`normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')`).
  - Tìm kiếm quét qua 5 trường: Mã sự cố (`ID`), Tên tour, Nội dung sự cố, Việc tiếp theo, và Người phụ trách.
- **Workflow Navigation Tabs**:
  - `Tất cả`: Khớp toàn bộ `IR-1001` đến `IR-1006`.
  - `Cần xử lý`: Khớp `IR-1001`.
  - `Đang phối hợp`: Khớp `IR-1003`, `IR-1004`.
  - `Chờ cập nhật`: Khớp `IR-1002`, `IR-1005`.
  - `Đã ổn định`: Khớp `IR-1006`.
- **Phép toán Kết hợp**: Áp dụng phép giao `AND`:
  $$\text{Matched Items} = \text{Filter}(\text{Workflow}) \cap \text{Filter}(\text{Search Query})$$
- **Phản hồi Trực quan & Trợ năng**:
  - Khi có kết quả: Hiển thị đúng chuỗi `"1 tình huống"` hoặc `"{count} tình huống"`.
  - Khi không có kết quả: Hiển thị chính xác chuỗi `empty_state`: `"Không có tình huống phù hợp với điều kiện hiện tại."` kèm nút hành động `"Xóa điều kiện"`.
  - Vùng thông báo kết quả sử dụng `aria-live="polite"` và `aria-atomic="true"` để trình đọc màn hình thông báo mà không cướp tiêu điểm bàn phím của người dùng.
  - Bảo mật render: Văn bản tìm kiếm của người dùng và các trường dữ liệu chỉ được gán qua thuộc tính `textContent` hoặc `document.createTextNode()`, nghiêm cấm tuyệt đối việc nội suy biến vào `innerHTML`.

### 4.3. Chu Trình Chi Tiết & Bảo Toàn Ngữ Cảnh (Detail Lifecycle & Context Preservation)
1. **Mở Chi Tiết**: Kích hoạt nút `"Xem chi tiết"` của một tình huống sẽ hiển thị vùng chi tiết (In-page Detail Panel/View) ngay trong cùng một trang web (không dùng popup cửa sổ mới, không chuyển trang URL). Hiển thị đầy đủ 9 trường canonical.
2. **Đánh Dấu Đã Xem (`acknowledge_action`)**:
   - Khi kích hoạt `"Đánh dấu đã xem"`, trạng thái giao diện cục bộ được cập nhật: Text nút chuyển thành `"Đã xem"`, trạng thái ngữ nghĩa `aria-pressed="true"` được kích hoạt, đồng thời hiển thị huy hiệu đã xem bên cạnh tiêu đề.
   - **Quy tắc bất biến cốt lõi**: Trạng thái này chỉ là cờ UI cục bộ của ca trực, **tuyệt đối không làm thay đổi trạng thái tác nghiệp chuẩn (`operational_status`)** của tình huống trong hệ thống (ví dụ: `IR-1001` vẫn giữ nguyên trạng thái tác nghiệp là `Cần xử lý`).
3. **Quay Lại Bảng Xử Lý (`back_action`)**:
   - Khi kích hoạt nút `"Quay lại bảng xử lý"`, giao diện phục hồi chế độ xem bảng mà không làm mất trạng thái trước đó.
   - **Bảo toàn ngữ cảnh 100%**: Từ khoá tìm kiếm, tab workflow đang chọn, danh sách các bản ghi đã lọc, số lượng kết quả đếm được, và vị trí cuộn trang (`scrollY`) được khôi phục chính xác.
   - **Phục hồi tiêu điểm bàn phím (`Focus Restoration`)**: Tiêu điểm bàn phím (`document.activeElement`) được hoàn trả chính xác về nút `"Xem chi tiết"` của chính tình huống vừa đóng, đảm bảo người dùng bàn phím không bị rơi tiêu điểm về đầu trang (`body`).

---

## 5. TEST_MATRIX_DRAFT (Kế Hoạch Kiểm Thử T01–T14 & Detector Boundaries)

Harness kiểm thử tự động `verify_module_010.js` sẽ chạy trên nền Node.js kết nối trực tiếp vào phiên bản Chrome thông qua CDP (port 9223 hoặc chỉ định). Mỗi test case bắt đầu từ một trạng thái tiền điều kiện độc lập (`independent precondition`), tuân thủ nguyên tắc fail-closed nghiêm ngặt.

### 5.1. Ma trận Kịch bản Chi tiết T01 đến T14

| Mã Test | Kịch bản Kiểm thử | Tiền điều kiện & Các bước Thực thi | Kết quả Kỳ vọng (Expected Result) | Cơ chế Kiểm chứng Tự động (Automated Detector) |
|---|---|---|---|---|
| `T01` | **Default State Load** | Nạp trang với trạng thái mặc định không tham số URL. | Hiển thị đủ 6 bản ghi `IR-1001`–`IR-1006`; nhãn số lượng hiển thị đúng `"6 tình huống"`; không có văn bản bị cắt cụt giả tạo. | Trích xuất danh sách ID từ DOM; đối chiếu mảng khớp 100% với canonical fixture; kiểm tra text nội dung số lượng kết quả. |
| `T02` | **Search Whitespace, Case & Diacritics** | Nhập chuỗi `"  XE LAN  "` (có khoảng trắng thừa, chữ in hoa, không dấu tiếng Việt). | Chỉ khớp duy nhất `IR-1001`; số lượng hiển thị `"1 tình huống"`. | Đọc mảng ID hiển thị: `ids === ['IR-1001']`; text đếm kết quả khớp `"1 tình huống"`. |
| `T03` | **Workflow Filter `Đang phối hợp`** | Xoá tìm kiếm; kích hoạt tab/pill `Đang phối hợp`. | Chỉ hiển thị chính xác hai tình huống: `IR-1003` và `IR-1004`; đếm `"2 tình huống"`. | Kiểm tra danh sách hiển thị: `ids.sort() === ['IR-1003', 'IR-1004']`. |
| `T04` | **AND Logic: Workflow + Search** | Chọn tab `Chờ cập nhật`; nhập tìm kiếm `"nguyen hoang minh anh"`. | Chỉ hiển thị duy nhất tình huống `IR-1005`; đếm `"1 tình huống"`. | Kiểm tra danh sách hiển thị: `ids === ['IR-1005']`; kiểm tra tính chính xác của phép giao AND. |
| `T05` | **Empty State & Reset Flow** | Nhập chuỗi tìm kiếm không tồn tại `"chuyen bay huy"`. Nhấn nút `"Xóa điều kiện"`. | Xuất hiện empty state với đúng thông điệp: `"Không có tình huống phù hợp với điều kiện hiện tại."`. Sau khi nhấn reset, khôi phục 6 bản ghi và focus trả về input tìm kiếm. | Kiểm tra hiển thị empty state container; trigger click nút reset; kiểm tra số lượng về 6 và `document.activeElement === searchInput`. |
| `T06` | **Canonical Integrity in Detail View** | Mở chi tiết tình huống `IR-1005` (nơi có tên tour dài và người phụ trách dài). | Hiển thị đầy đủ 9 trường canonical; tên tour đầy đủ và tên người phụ trách không bị cắt xén bằng ellipsis. | Trích xuất toàn bộ 9 trường từ view chi tiết; so sánh chuỗi ký tự byte-identical với fixture; kiểm tra `scrollWidth <= clientWidth` hoặc cho phép wrap dòng tự nhiên. |
| `T07` | **Local Acknowledge FSM & Status Separation** | Trong chi tiết `IR-1001`, kích hoạt nút `"Đánh dấu đã xem"`. | Nút đổi nhãn thành `"Đã xem"`, `aria-pressed="true"`. Trạng thái tác nghiệp canonical vẫn giữ nguyên là `"Cần xử lý"`. | Đọc thuộc tính `aria-pressed` và `textContent` của nút; đọc trường operational status từ DOM đối chiếu vẫn là `"Cần xử lý"`. |
| `T08` | **Back Navigation & Context Preservation** | Từ trạng thái đã lọc (tab `Chờ cập nhật` + query `"nguyen hoang minh anh"`), mở chi tiết `IR-1005`, sau đó nhấn nút `"Quay lại bảng xử lý"`. | Khôi phục nguyên vẹn: ô tìm kiếm vẫn chứa query, tab `Chờ cập nhật` vẫn active, chỉ hiện `IR-1005`, tiêu điểm bàn phím trả về đúng nút trigger `"Xem chi tiết"` của `IR-1005`. | So sánh giá trị input tìm kiếm, active tab class/attribute, danh sách ID, và kiểm tra `document.activeElement.getAttribute('data-incident-id') === 'IR-1005'`. |
| `T09` | **Native Keyboard Navigation Journey** | Chỉ sử dụng sự kiện phím tuần tự (`Tab`, `Shift+Tab`, `Enter`, `Space`); không dùng chuột hay lệnh `.focus()` programmatic. Thực hiện chu trình: Search $\to$ Filter $\to$ Open Detail $\to$ Acknowledge $\to$ Back. | Hoàn thành toàn bộ hành trình tác nghiệp chỉ bằng phím; tiêu điểm không bao giờ bị rơi về thẻ `<body>`; focus indicator hiển thị rõ ràng. | Giám sát sự kiện `focusin`; ghi log toàn bộ hành trình tiêu điểm; assert không có bước nào `activeElement === document.body` ngoài trạng thái ban đầu. |
| `T10` | **Viewport Matrix & 0 Horizontal Overflow** | Thiết lập viewport lần lượt tại: 1440×900, 768×1024, 390×844, 320×800, và 844×390 (landscape). | Mọi thông tin và nút hành động hiển thị đầy đủ; **không có bất kỳ horizontal scroll nào** (`document.documentElement.scrollWidth <= window.innerWidth`). | Tại mỗi viewport: đo `scrollWidth`, `innerWidth`, kiểm tra hiển thị của tất cả các cột/trường bắt buộc. |
| `T11` | **Text Scale 200% Stress at 320×800** | Tại viewport 320×800px, tiêm cấu hình phóng to văn bản lên 200% (`font-size: 200%` trên root element). | Giao diện cho phép cuộn dọc tự nhiên; văn bản tự ngắt dòng; không bị che lấp, chồng lấn (`overlap`), hoặc mất nút thao tác. | Đo đạc bounding rect của các khối chữ kề nhau để đảm bảo không giao cắt; kiểm tra nút hành động vẫn nằm trong viewport hoặc trong vùng cuộn tiếp cận được. |
| `T12` | **Text Spacing Override (SC 1.4.12)** | Tiêm 4 thuộc tính CSS bắt buộc theo SC 1.4.12 lên toàn bộ phần tử: `line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; * { margin-bottom: 2em !important; }`. | Toàn bộ nhãn tab, nút bấm, và thẻ tình huống giãn nở tự nhiên; không bị cắt cụt nội dung (`no text clipping`). | Kiểm tra các container text: `scrollHeight <= clientHeight` hoặc container tự động mở rộng chiều cao; không có phần tử nào bị `overflow: hidden` làm mất chữ. |
| `T13` | **Long-Content & Orientation Parity** | Kiểm tra hiển thị `IR-1005` trên cả hai hướng màn hình di động: Portrait (390×844) và Landscape (844×390). | Hoạt động trơn tru trên cả hai hướng; không có overlay chắn màn hình; tên tour dài 72 ký tự tiếng Việt đọc được trọn vẹn. | Kiểm tra sự vắng mặt của màn hình chặn orientation; đo đạc kích thước và kiểm tra văn bản hiển thị đầy đủ. |
| `T14` | **Inclusive Accessibility & Integrity Audits** | 1. Forced Colors Mode (High Contrast).<br>2. Effective Target Size $\ge 44\times 44$px.<br>3. Focus Obscuration check.<br>4. Positive Controls & Evidence Ledger Sync. | 1. Viền và trạng thái lựa chọn không biến mất.<br>2. Tất cả primary control đạt $\ge 44\times 44$px.<br>3. Focus không bị sticky che khuất.<br>4. Positive controls kích hoạt lỗi thành công; hash ledger đồng bộ tuyệt đối. | Đo đạc kích thước từng nút bấm; tính toán giao diện hình học với sticky bar; chạy kiểm thử positive control cho overflow và missing selector; đối chiếu SHA-256 toàn bộ artifact. |

### 5.2. Ranh giới Detector & Cơ chế Positive Controls Bắt Buộc
Để đảm bảo harness kiểm thử có tính liêm chính cao và không báo "PASS giả", hệ thống tích hợp 4 kịch bản Positive Controls:

1. **Positive Control 1: Overflow Detection Failure Injection**:
   - Tiêm một phần tử giả lập có `width: 9999px` vào DOM.
   - Gọi detector kiểm tra tràn ngang của production.
   - **Kỳ vọng**: Detector bắt buộc phải phát hiện lỗi tràn ngang và trả về kết quả `FAIL`. Nếu detector trả về `PASS`, toàn bộ harness tự động huỷ bỏ với mã lỗi `SELF_CHECK_FAIL`.
2. **Positive Control 2: Missing Required Selector Injection**:
   - Tạm thời gỡ bỏ hoặc đổi tên một bộ chọn CSS bắt buộc (ví dụ: đổi ID của ô tìm kiếm).
   - Gọi detector kiểm tra cấu trúc DOM.
   - **Kỳ vọng**: Detector bắt buộc phải báo lỗi thiếu bộ chọn bắt buộc.
3. **Positive Control 3: Focus Obscuration Injection**:
   - Tiêm một lớp phủ cố định `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;`.
   - Gọi detector kiểm tra tiêu điểm bị che khuất (`Focus Obscured Detector`).
   - **Kỳ vọng**: Detector bắt buộc phải phát hiện tiêu điểm bị che khuất 100% và báo `FAIL`.
4. **Positive Control 4: Hash Ledger Tamper Injection**:
   - Cố ý sửa đổi 1 ký tự trong chuỗi SHA-256 của một tệp tin trong ledger tạm thời.
   - Gọi bộ kiểm toán liêm chính tệp tin (`Integrity Audit Engine`).
   - **Kỳ vọng**: Hệ thống phát hiện sự không đồng nhất và từ chối phát hành báo cáo.

---

## 6. KẾT LUẬN & TRẠNG THÁI DỪNG

Bản First Response này hoàn thành đầy đủ 5 nội dung bắt buộc của Section 14 trong Directive `DESIGN_TRAINING_010`.

```yaml
IMPLEMENTATION_STATUS: BLOCKED_PENDING_CONTROLLER_FIRST_RESPONSE_REVIEW
CODE_WRITTEN_BEFORE_APPROVAL: false
MODULE_009_DEBT_IMPORTED: false
NEXT_ACTION: SUBMIT_FIRST_RESPONSE_TO_CONTROLLER_ON_TAB_A_AND_AWAIT_AUTHORIZATION
```

Antigravity cam kết tuân thủ kỷ luật kiến trúc: Chưa tạo bất kỳ tệp mã nguồn nào (`baseline/`, `directions/`, `index.html`, hay `verify_module_010.js`). Toàn bộ quá trình thi công mã nguồn sẽ chỉ được bắt đầu sau khi nhận được sự phê duyệt chính thức từ Controller Sol trên Tab A.
