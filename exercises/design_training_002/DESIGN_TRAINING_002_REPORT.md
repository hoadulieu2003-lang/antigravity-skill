# BÁO CÁO NGHIỆM THU HIỆU CHỈNH: DESIGN_TRAINING_002 (Round 02 Final Repair — Rev 003)
## Module 02: Phân Cấp Thị Giác Theo Nhiệm Vụ Người Dùng (Task-Driven Visual Hierarchy)

* **Mã kiểm duyệt**: `DESIGN_TRAINING_002_REPAIR_002` (Vòng sửa triển khai 2/2 — Final Round)
* **Người thực hiện (`Executor`)**: Antigravity (Senior AI Engineering Agent)
* **Kiểm duyệt kiến trúc (`Reviewer`)**: ChatGPT (Architectural Ideator / Port 9223)
* **Chủ quản tối cao (`Owner`)**: Anh — Lead Architect / Product Owner
* **Nguồn chuẩn mã nguồn (`Canonical Implementation`)**: `index.html` (Đường dẫn tương đối; không nhúng bản sao mã nguồn vào báo cáo để bảo đảm duy nhất một nguồn sự thật).
* **Phụ thuộc tài nguyên mạng**: Google Fonts (`Plus Jakarta Sans`) nạp trong `<head>` của `index.html`. Ngoài ra không dùng bất kỳ thư viện JS/CSS ngoài nào.
* **Ghi chú thẩm định độc lập**: Toàn bộ số đo và trạng thái trong báo cáo này cùng tệp `DOM_MEASUREMENTS_MODULE_002.json` là kết quả tự kiểm nghiệm thực tế của Antigravity qua giao thức Chrome CDP tại DPR = 2; Controller đã xem ảnh và đọc mã nguồn, chưa chạy runtime độc lập.
* **Mốc thời gian giả lập**: `09:00 ngày 14/09/2026` (Nhãn cố định phục vụ demo).

---

## 1. Bảng Khắc Phục Đối Soát Review 002 (Còn Lại 1 & Còn Lại 2)

| Mã Hạng Mục | Yêu cầu hiệu chỉnh từ Review 002 | Kết quả kỹ thuật đã thực hiện | Tệp bằng chứng xác minh |
| :--- | :--- | :--- | :--- |
| **Còn lại 1** *(Triệt tiêu cuộn mượt — Zero Motion)* | Loại bỏ hoàn toàn `behavior: 'smooth'` tại 2 vị trí: `inspectTaskDetail` và nút quay lại đầu trang. Đổi thành cuộn tức thì nhưng vẫn giữ nguyên chức năng đưa chi tiết vào tầm nhìn. | • Tại hàm `inspectTaskDetail(taskId)`: chuyển thành `panel.scrollIntoView({ behavior: 'instant', block: 'start' })`.<br>• Tại hàm `backToTop()`: chuyển thành `window.scrollTo(0, 0)`.<br>• Đảm bảo không còn bất kỳ hiệu ứng chuyển động/animation/transition nào trong toàn bộ ứng dụng (Zero Motion Invariant). | • `index.html` (dòng 1015, dòng 1071)<br>• `DOM_MEASUREMENTS_MODULE_002.json` (ghi nhận cuộn tức thì `scrollY = 1110` và `scrollY = 0`) |
| **Còn lại 2** *(Bằng chứng Bàn phím, Focus & Nhất quán Báo cáo)* | • Tách rõ "phần tử kích hoạt" (`targetedElement`) khỏi "activeElement".<br>• Không gộp chế độ A/B khi chỉ kiểm tra 1 bên; ghi đúng mode và dữ liệu thực tế.<br>• Kiểm tra bằng phím cứng (Tab, Enter, Space):<br>  1. Kích hoạt CTA A bằng Enter, CTA B bằng Space.<br>  2. Mở chi tiết hàng đợi bằng phím Enter.<br>  3. Kích hoạt "Quay lại danh sách": focus chuyển lên `#main-page-heading` không bị sticky header che.<br>  4. Kích hoạt "Đặt lại": focus hoàn trả về đúng CTA tương ứng (`#btn-action-t01` hoặc `#btn-action-t02`). | • Đã triển khai kịch bản kiểm thử bàn phím tự động thực nghiệm qua Puppeteer bàn phím cứng (`page.keyboard.press('Enter')`, `'Space'`).<br>• Cấu trúc log JSON tách biệt rõ ràng: `targetedElement`, `activeElementBefore`, `activeElementAfter`.<br>• Xác nhận 100% các trạng thái focus sau tương tác:<br>  - Sau khi bấm "Đặt lại" bằng phím Enter, focus chuyển về đúng CTA chính đang kích hoạt.<br>  - Sau khi bấm "Quay lại danh sách" bằng phím Enter, trang cuộn tức thì về đầu và focus vào `#main-page-heading` (`tabindex="-1"`), nằm trọn trong viewport (`top: 243.68px`) không bị header che khuất.<br>  - Khi chọn task trong hàng đợi bằng phím Enter, bảng chi tiết hiển thị đúng T01 (`detail-id: T01`, status: "Có thể làm"), cuộn tức thì và nhận focus trực tiếp. | • `DOM_MEASUREMENTS_MODULE_002.json`<br>• `screenshots/option_a_mobile_after_cta.png`<br>• `screenshots/option_b_mobile_after_cta.png`<br>• `screenshots/option_mobile_detail_scrolled.png` |

---

## 2. Nghiên Cứu Có Giới Hạn — 3 Nguyên Tắc Phân Cấp Theo Nhiệm Vụ (Đã Được Duyệt Tại Review 002)

### Nguyên tắc 1: Phân Cụm Tiêu Điểm Không Gian (Spatial Focal Anchoring)
* **Nguồn & Mục gốc**: *Every Layout — "The Stack" ([https://every-layout.dev/layouts/stack/](https://every-layout.dev/layouts/stack/)) & Gestalt Law of Proximity.*
* **Diễn giải bằng lời**: Khi nhiều phần tử thông tin cạnh tranh sự chú ý, mắt người không thể xử lý đồng thời nếu tất cả đều có kích thước và khoảng cách tương đương. Việc cô lập một nhiệm vụ trọng tâm vào một khung Spotlight độc lập phía trên với khoảng đệm không gian vượt trội (`var(--space-l)` và đường viền 2px có chủ đích) tạo ra một mỏ neo thị giác tức thì.
* **Phạm vi áp dụng**: Khối `spotlight-card` ở đầu giao diện dành riêng cho nhiệm vụ số 1 (T01 trong Chế độ A, T02 trong Chế độ B).
* **Ngoại lệ & Ranh giới**: Không áp dụng cấu trúc Spotlight cho danh sách hàng đợi bên dưới để tránh hiện tượng loãng tiêu điểm thị giác (`Focal Dilution`).

---

### Nguyên tắc 2: Phân Cấp Định Vị Theo Nhiệm Vụ Người Dùng (Task-Driven Hierarchy Invariant)
* **Nguồn & Mục gốc**: *Suy luận và áp dụng trực tiếp từ đặc tả bài tập `DESIGN_TRAINING_002_DIRECTIVE.md` (Không gán ép cho các tài liệu typography đo lường dòng đọc).*
* **Diễn giải bằng lời**: Phân cấp thị giác không phải là một thuộc tính tĩnh của dữ liệu, mà biến thiên phụ thuộc vào câu hỏi nhiệm vụ của người dùng. Một thông tin có thể là thứ yếu trong ngữ cảnh này nhưng trở thành tối thượng trong ngữ cảnh khác. Thay vì chỉ đổi màu hoặc đổi nhãn nút, bố cục phải tái cấu trúc lại nhịp điệu: đưa phần tử giải quyết đúng câu hỏi định hướng lên hàng đầu.
* **Phạm vi áp dụng**: Cơ chế chuyển đổi Chế độ A ("Tôi nên bắt đầu việc nào?") và Chế độ B ("Điều gì đang ngăn công việc chạy tiếp?").
* **Ngoại lệ & Ranh giới**: Nhiệm vụ gần hạn nhất (T01) ở Chế độ B không được phép ẩn đi mà vẫn giữ vị trí số 1 trong hàng đợi thứ cấp để người dùng không bỏ quên deadline.

---

### Nguyên tắc 3: Nhận Biết Trạng Thái Đa Kênh (Multi-Modal Status Signposting)
* **Nguồn & Mục gốc**: *W3C WCAG 2.2 — SC 1.4.1 Use of Color & SC 1.4.11 Non-text Contrast ([https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)).*
* **Diễn giải bằng lời**: Trạng thái công việc không bao giờ được truyền tải duy nhất bằng màu sắc. Mọi huy hiệu trạng thái bắt buộc phải có văn bản đi kèm (`Text Label`) với độ tương phản cao, kết hợp cùng viền và hình thái typography để người dùng khiếm thị màu hoặc người dùng quét nhanh đều nhận biết chính xác.
* **Phạm vi áp dụng**: 4 loại huy hiệu trạng thái: `Có thể làm` (Xanh ngọc / Teal), `Bị chặn` (Hổ phách / Amber), `Đang làm` (Xanh dương / Blue), và `Hoàn thành` (Xám mờ / Slate).
* **Độ tương phản sRGB thực tế**:
  - `#0F172A` trên `#FAF9F6`: **16.96:1**
  - `#0F766E` trên `#FAF9F6`: **5.20:1**
  - `#92400E` trên `#FFFBEB`: **6.84:1**
  - Focus Ring: `outline: 3px solid #0F766E; outline-offset: 3px;` là đường viền đơn sắc rõ nét trên nền sáng.

---

## 3. Ý Đồ Thiết Kế & So Sánh Hai Chế Độ

| Chế độ | Thứ nhìn đầu | Thứ nhìn tiếp | Hành động chính | Vì sao |
| :---: | :---: | :---: | :---: | :---: |
| **A** *(Chọn việc bắt đầu)* | **T01** (Thẻ Spotlight viền Teal, nhãn "Có thể làm", hạn 10:00) | **T02** (Bị chặn có viền cảnh báo) và các việc còn lại | **"Bắt đầu việc"** (Nút CTA màu Teal `#0F766E`) | Hạn gần nhất (10:00 hôm nay), có thể làm, còn khoảng 45 phút thực hiện. |
| **B** *(Gỡ việc đang bị chặn)* | **T02** (Thẻ Spotlight viền Amber, nhãn "Bị chặn", lý do thiếu tài khoản & đã chờ 1 ngày) | **T01** (Gần hạn nhất trong hàng đợi) và các việc còn lại | **"Xem cách gỡ chặn"** (Nút CTA màu Hổ phách `#B45309`) | Giải quyết nhiệm vụ đang chưa thể tiếp tục vì thiếu tài khoản thử nghiệm; đã chờ 1 ngày. |

---

## 4. Hai Điểm Đánh Đổi Kiến Trúc (`Trade-offs`)

1. **Đánh đổi 1 — Trọng tâm Spotlight so với Khả năng quét đồng thời**: Dành toàn bộ sự chú ý màn hình đầu cho duy nhất 1 công việc ưu tiên tối cao kèm đầy đủ dữ liệu giúp ra quyết định tức thì, đổi lại các công việc còn lại phải nằm ở hàng đợi bên dưới.
2. **Đánh đổi 2 — Toàn vẹn dữ liệu gốc so với Độ ngắn gọn trên Mobile**: Giữ nguyên 100% dữ liệu gốc trong bảng chi tiết giúp đối chiếu công bằng ở cả 2 chế độ, đổi lại trên mobile người dùng bấm "Xem chi tiết" sẽ được cuộn tức thì đến bảng `#task-detail-panel` thay vì mở popup modal che khuất màn hình.

---

## 5. Kết Quả Kiểm Thử Bàn Phím & Focus Thực Nghiệm Độc Lập (Chrome CDP tại 390×844)

> *Ghi chú: Toàn bộ kịch bản kiểm thử dưới đây được thực hiện bằng sự kiện bàn phím phần cứng thực (`page.keyboard.press`), dữ liệu trích xuất trực tiếp vào tệp `DOM_MEASUREMENTS_MODULE_002.json`.*

| Kịch bản | Mode | Thao tác đầu vào | Phần tử nhắm đến (`targetedElement`) | `activeElementBefore` | `activeElementAfter` | Trạng thái hiển thị & Cuộn | Minh chứng xác minh |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Kích hoạt CTA Mode A** | `a` | Phím `Enter` | `btn-action-t01` | `btn-action-t01` | `btn-action-t01` | Banner phản hồi hiện (`true`), `scrollY = 0`, text: *"Đã chọn T01 để bắt đầu — thao tác mô phỏng"* | `screenshots/option_a_mobile_after_cta.png` |
| **2. Bấm Đặt lại Mode A** | `a` | Phím `Enter` | `btn-reset-feedback` | `btn-reset-feedback` | `btn-action-t01` | Banner ẩn (`false`), focus hoàn trả chính xác về nút CTA `btn-action-t01` | Ghi nhận trong JSON log (`focusSuccessfullyRestored: true`) |
| **3. Kích hoạt CTA Mode B** | `b` | Phím `Space` | `btn-action-t02` | `btn-action-t02` | `btn-action-t02` | Banner phản hồi hiện (`true`), `scrollY = 0`, text: *"Bước tiếp theo: chuẩn bị tài khoản thử nghiệm cho T02 — hướng dẫn mô phỏng"* | `screenshots/option_b_mobile_after_cta.png` |
| **4. Bấm Đặt lại Mode B** | `b` | Phím `Enter` | `btn-reset-feedback` | `btn-reset-feedback` | `btn-action-t02` | Banner ẩn (`false`), focus hoàn trả chính xác về nút CTA `btn-action-t02` | Ghi nhận trong JSON log (`focusSuccessfullyRestored: true`) |
| **5. Chọn việc hàng đợi** | `b` | Phím `Enter` | Thẻ việc đầu tiên trong queue (`T01`) | `LI` | `task-detail-panel` | Cuộn tức thì (`scrollY = 1110`), bảng chi tiết nằm trong viewport (`top: 384.67px`, `bottom: 804.39px`), hiển thị đúng T01 | `screenshots/option_mobile_detail_scrolled.png` |
| **6. Quay lại đầu trang** | `b` | Phím `Enter` | `btn-back-top` | `btn-back-top` | `main-page-heading` | Cuộn tức thì lên đỉnh (`scrollY = 0`), focus đặt vào tiêu đề chính (`top: 243.68px`), không bị sticky header che | Ghi nhận trong JSON log (`isHeadingVisible: true`, `isStickyHeaderObscuring: false`) |

---

## 6. Danh Mục Tệp Trong Gói Nộp (`design_training_002_submission_r03.zip`)

1. `index.html`: Mã nguồn trang chuẩn đã loại bỏ hoàn toàn cuộn mượt (thay bằng `instant` và `window.scrollTo(0,0)`), quản lý focus bàn phím hoàn hảo.
2. `DESIGN_TRAINING_002_REPORT.md`: Báo cáo kỹ thuật đối soát vòng cuối này.
3. `DOM_MEASUREMENTS_MODULE_002.json`: Tệp log kiểm toán bàn phím và focus chi tiết xuất từ thực nghiệm CDP.
4. `screenshots/option_a_desktop_1440x900.png`: Ảnh đầu trang Chế độ A trên Desktop (dùng lại từ r02, bố cục thị giác không đổi).
5. `screenshots/option_b_desktop_1440x900.png`: Ảnh đầu trang Chế độ B trên Desktop (dùng lại từ r02, bố cục thị giác không đổi).
6. `screenshots/option_a_mobile_390x844.png`: Ảnh đầu trang Chế độ A trên Mobile (dùng lại từ r02, bố cục thị giác không đổi).
7. `screenshots/option_b_mobile_390x844.png`: Ảnh đầu trang Chế độ B trên Mobile (dùng lại từ r02, bố cục thị giác không đổi).
8. `screenshots/option_a_mobile_after_cta.png`: Ảnh kiểm toán Mobile Chế độ A sau khi bấm phím Enter kích hoạt CTA.
9. `screenshots/option_b_mobile_after_cta.png`: Ảnh kiểm toán Mobile Chế độ B sau khi bấm phím Space kích hoạt CTA.
10. `screenshots/option_mobile_detail_scrolled.png`: Ảnh kiểm toán Mobile sau khi bấm phím Enter chọn việc trong hàng đợi (cuộn tức thì tới bảng chi tiết và nhận focus).
