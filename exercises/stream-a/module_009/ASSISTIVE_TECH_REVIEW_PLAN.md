# KẾ HOẠCH ĐÁNH GIÁ CÔNG NGHỆ HỖ TRỢ — MODULE 09
## Stream A: Foundation Integrity · TRIPFLOW Support Desk AR-901

- **DOCUMENT_ID**: `ASSISTIVE_TECH_REVIEW_PLAN`
- **MODULE_ID**: `DESIGN_TRAINING_009_ACCESSIBILITY`
- **EXAMINER**: Antigravity (Senior AI Pair-Programmer)
- **TARGET**: `index.html` (Direction A - Candidate)
- **DATE**: `2026-09-14`
- **STATUS**: `MANUAL_REVIEW_PENDING`
- **EVIDENCE_MODE**: `SPECIFICATION_AND_EXPECTED_BEHAVIOR_ONLY`

---

## 1. Mục tiêu và phạm vi đánh giá (Scope & Objectives)

Theo nguyên tắc ranh giới tại Section 7 của Báo cáo, các công cụ kiểm tra tự động (như telemetry, Puppeteer hay snapshot DOM/AX Tree) chỉ kiểm tra được sự hiện diện của role, thuộc tính ARIA và cây trợ năng trong trình duyệt. Các công cụ tự động không thể thay thế cho việc kiểm thử thực nghiệm của người vận hành (`Human Operator`) khi sử dụng bàn phím và công nghệ hỗ trợ (`Assistive Technology`).

Tài liệu này xác lập kế hoạch và kỳ vọng cho quy trình thẩm định công nghệ hỗ trợ:
1. **Tính tự nhiên và chuẩn mực ngữ nghĩa của câu chữ tiếng Việt** (`Linguistic Appropriateness`).
2. **Kỳ vọng thông báo trên trình đọc màn hình theo đặc tả ARIA** (`Expected Announcements Under ARIA APG & SC 4.1.3`).
3. **Quy trình kiểm toán thực tế bằng người thật** (`Human Operator Audit Protocol`).

---

## 2. Đánh giá ngữ nghĩa tiếng Việt (Linguistic Evaluation)

| Nhãn / Chuỗi giao diện | Đánh giá Ngữ nghĩa & Văn cảnh | Đánh giá Mức độ |
| :--- | :--- | :---: |
| `"Ghi nhận yêu cầu hỗ trợ"` | Tiêu đề chính xác, trực diện, thể hiện rõ hành động nghiệp vụ của điều phối viên. | **PHÙ HỢP** |
| `"Lưu yêu cầu hỗ trợ"` / `"Đang lưu yêu cầu hỗ trợ…"` / `"Thử lưu lại"` | Thể hiện rõ ràng 3 trạng thái của máy trạng thái FSM. Tránh dùng từ kỹ thuật trừu tượng như "Submit payload" hay "Gửi dữ liệu". | **PHÙ HỢP** |
| `"Xem hướng dẫn hỗ trợ"` / `"Đóng hướng dẫn"` | Cặp nhãn mở/đóng modal đối xứng, dễ hiểu, định hướng hành vi trực quan. | **PHÙ HỢP** |
| `"Chọn hình thức hỗ trợ cần sắp xếp."` | Câu thông báo lỗi rõ ràng, mang tính hướng dẫn hành động (`Actionable Guidance`) theo SC 3.3.3. | **PHÙ HỢP** |
| `"Chi tiết hỗ trợ không được vượt quá 200 ký tự."` | Nêu rõ giới hạn độ dài cụ thể và vị trí cần chỉnh sửa. | **PHÙ HỢP** |
| `"Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."` | Trấn an người dùng ngay lập tức rằng dữ liệu bản nháp không bị mất, khuyến khích thử lại mà không gây hoảng sợ. | **PHÙ HỢP** |
| `"Đã lưu yêu cầu hỗ trợ cho hồ sơ AR-901."` | Xác nhận thành công kèm mã định danh hồ sơ cụ thể để tiện đối soát. | **PHÙ HỢP** |

---

## 3. Kỳ vọng thông báo trình đọc màn hình theo đặc tả (Expected Announcements)

> [!NOTE]
> Các nội dung dưới đây là **`EXPECTED_ANNOUNCEMENT`** được suy luận từ cấu trúc DOM và đặc tả WAI-ARIA APG, **KHÔNG PHẢI BĂNG GHI ÂM HOẶC BẰNG CHỨNG PHÁT ÂM THỰC TẾ TỪ PHIÊN CHẠY SCREEN READER CỦA NGƯỜI THẬT**.

### 3.1. Kịch bản 1: Mở và Đóng Hộp Thoại Hướng Dẫn
- **Thao tác**: Người dùng nhấn `Tab` đến nút "Xem hướng dẫn hỗ trợ" $\to$ Nhấn `Enter`.
- **Thông báo dự kiến (`EXPECTED_ANNOUNCEMENT`)**:
  - Trình đọc màn hình thông báo nút mở hộp thoại với accessible name: *"Xem hướng dẫn hỗ trợ, nút"*.
  - Khi hộp thoại native `<dialog>` mở qua `showModal()`, focus được dự án chỉ định đưa vào nút đóng `#btn-close-guidance`: *"Xem hướng dẫn hỗ trợ, hộp thoại. Đóng hướng dẫn, nút"*.
  - Khi nhấn `Escape`: Hộp thoại đóng lại, focus được hoàn trả về nút kích hoạt `#btn-open-guidance` vì nút này vẫn tồn tại trong DOM và luồng làm việc tiếp diễn: *"Xem hướng dẫn hỗ trợ, nút"*.
- **Phân tích kỹ thuật**: Hộp thoại giữ bẫy tiêu điểm (`Focus Trap`) hoàn toàn bên trong hộp thoại, ngăn chặn việc con trỏ lọt ra nội dung nền bị che khuất.

### 3.2. Kịch bản 2: Báo Lỗi Nhập Liệu Đơn Nguồn (Single-Source Validation)
- **Thao tác**: Nhấn Submit khi chưa chọn hình thức hỗ trợ và chưa tích xác nhận.
- **Thông báo dự kiến (`EXPECTED_ANNOUNCEMENT`)**:
  - Nhờ kiến trúc Single-Source, thông báo lỗi chỉ phát ra duy nhất từ vùng `#error-summary` (`role="alert"`):
    *"Cảnh báo: Cần hoàn thiện các thông tin sau trước khi lưu. Danh sách 2 mục: Chọn hình thức hỗ trợ cần sắp xếp, liên kết; Xác nhận rằng yêu cầu đã được trao đổi với khách, liên kết."*
  - Vùng `#live-alert-region` giữ nguyên trạng thái rỗng, không phát lặp lại.
  - Con trỏ focus lập tức đáp xuống trường lỗi đầu tiên `#radio-boarding`: *"Hình thức hỗ trợ cần sắp xếp, nhóm. Hỗ trợ lên xuống phương tiện, nút radio, chưa chọn, 1 trên 4."*
- **Phân tích kỹ thuật**: Các thông báo lỗi inline tại từng trường (`#error-support-type`, `#error-confirmation`) chỉ đóng vai trò liên kết ngữ nghĩa qua `aria-describedby` và `aria-invalid="true"`, không cấu hình live region độc lập để tránh gây xung đột âm thanh.

### 3.3. Kịch bản 3: Tiến Trình Lưu & Báo Lỗi Mạng
- **Thao tác**: Điền form hợp lệ $\to$ Nhấn Enter lưu $\to$ Chờ 800ms.
- **Thông báo dự kiến (`EXPECTED_ANNOUNCEMENT`)**:
  - Tại t=0ms: `#live-status-region` (`role="status"`, `polite`) phát: *"Đang lưu yêu cầu hỗ trợ…"*. Nút hiển thị `aria-busy="true"`.
  - Tại t=800ms: `#live-alert-region` (`role="alert"`, `assertive`) phát: *"Cảnh báo: Chưa lưu được yêu cầu hỗ trợ. Nội dung đã nhập vẫn được giữ."*.
  - Con trỏ tiêu điểm không bị cướp (`No Focus Stealing Invariant`); nếu người dùng chuyển focus sang `#btn-open-guidance` trong lúc đang lưu, focus vẫn giữ nguyên tại đó.
  - Thử kích hoạt lại trong lúc đang lưu bị chặn bởi guard logic fail-closed, không làm tăng số lần thử (`attemptCount` duy trì bằng 1).

---

## 4. Quy trình kiểm toán công nghệ hỗ trợ thực tế độc lập (Human Operator Audit Protocol)

Để chuyển trạng thái từ `MANUAL_REVIEW_PENDING` sang `MANUAL_REVIEW_COMPLETED`, cần có một phiên kiểm toán thực nghiệm độc lập tuân thủ đầy đủ các tiêu chuẩn sau:

1. **Người thực hiện (`Operator`)**: Kiểm toán viên con người độc lập (không phải AI tự diễn giải).
2. **Thiết bị & Môi trường**:
   - Hệ điều hành: Windows 11 / macOS Sonoma.
   - Trình duyệt: Google Chrome / Safari phiên bản mới nhất.
   - Trình đọc màn hình: NVDA (Windows) / VoiceOver (macOS / iOS).
3. **Các bước bắt buộc trong nhật ký kiểm toán (`Operator Log`)**:
   - Ghi nhận phiên bản phần mềm chính xác (ví dụ: NVDA 2024.1, Chrome 128).
   - Từng phím nhấn thực tế và dấu thời gian (`Timestamp`).
   - Câu thoại phát âm thực tế (`Observed Speech Output`) được ghi chép từ Speech Viewer của NVDA hoặc caption panel của VoiceOver.
   - Bản ghi âm thanh hoặc video minh chứng đính kèm.

Tài liệu này xác nhận: Toàn bộ các kết luận nghiệm thu tự động chỉ có giá trị đối với các thuộc tính DOM và cây trợ năng được đo đạc bằng telemetry; trải nghiệm phát âm thực tế phụ thuộc vào việc thực thi quy trình kiểm toán trên.
