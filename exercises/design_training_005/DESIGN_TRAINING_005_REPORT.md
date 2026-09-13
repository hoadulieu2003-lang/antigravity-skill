# BÁO CÁO NGHIỆM THU VÒNG SỬA 1/2: MODULE 05 (DESIGN_TRAINING_005 — Art Direction)

**Mã nộp**: `DESIGN_TRAINING_005_REPAIR_001` (Lần nộp Rev 002)  
**Gói nộp**: `design_training_005_submission_r02.zip`  
**Dự án**: TRACE — Không gian theo dõi bàn giao  
**Thực thi**: Antigravity (Senior Engineering Agent)  
**Thẩm định**: ChatGPT Controller  
**Quyền phê duyệt cao nhất**: Anh — Lead Architect / Product Owner  

---

## 1. Bảng Xử Lý Triệt Để Các Phát Hiện F01–F03 Từ Review 001

| Mã phát hiện | Yêu cầu từ Review 001 | Giải pháp kỹ thuật đã triển khai (Rev 002) | Bằng chứng kiểm chứng |
| :---: | :--- | :--- | :--- |
| **F01** | Bảng mobile ép tên tài liệu thành nhiều dòng hẹp; trên desktop đường phân cách hàng bị lệch cao độ do `display: flex` gắn trực tiếp lên `td`. | - **Mobile (390px)**: Chuyển cấu trúc hàng `<tr>` thành bố cục flex hai tầng thích ứng: Tầng 1 là Tên tài liệu chiếm trọn 100% bề ngang; Tầng 2 hiển thị song song Người phụ trách (`Phụ trách: An`) và Badge trạng thái.<br>- **Desktop**: Giữ nguyên `display: table-cell` cho mọi `td`, chuyển flex vào thẻ con `.doc-cell-content` để các đường viền phân cách hàng chạy phẳng tắp, cùng cao độ. | - Đo đạc thực tế: Cả 3 tiêu đề đạt `estimatedLines = 1` trên mobile 390px.<br>- Ảnh chụp mới: `screenshots/final_mobile_390x844.png` và `screenshots/final_mobile_fullpage.png`. |
| **F02** | Sai lệch kích thước font giữa Contract và bản cuối; nhãn “CHẾ ĐỘ THỰC THI” chưa phản ánh bản mẫu tĩnh; tuyên bố nền tối/motion cần gắn với ngữ cảnh bài tập. | - Đồng bộ Contract với bản cuối: `heading_display: clamp(2.25rem, 4vw, 3rem)`, `body_lead: 1.125rem`.<br>- Sửa nhãn bản mẫu Hero thành `BẢN MẪU TĨNH` trung thực.<br>- Cập nhật `signature_decision` trong Contract khớp tiêu đề `MODULE 01: TRACE SPECIMEN` và nhãn `BẢN MẪU TĨNH`.<br>- Viết lại mục `avoid` thành lựa chọn có điều kiện của riêng TRACE (phục vụ đối tượng vận hành, tuân thủ yêu cầu đề bài), không khái quát hóa thành định luật phổ quát. | - `DESIGN_CONTRACT.yaml` đã cập nhật.<br>- `index.html` đã sửa nhãn.<br>- Báo cáo thể hiện đúng tính chất bản mẫu tĩnh. |
| **F03** | Tên biến `rowsVisible` chưa chứng minh khả năng đọc; tỷ lệ tương phản ghi sẵn cần thay bằng phép tính thuật toán sRGB chuẩn. | - Đổi tên biến kỹ thuật thành `rowHeightAdequate`, bổ sung mảng đo `docTitleMetrics`, gán đánh giá khả năng đọc là `SELF_REVIEW_PENDING_CONTROLLER` dựa trên ảnh chụp thực tế.<br>- Viết hàm Relative Luminance theo WCAG 2.1 tính toán trực tiếp: 17.06:1, 7.24:1, 17.85:1, 7.29:1, 6.37:1, 6.38:1 khớp 100% phép tính độc lập của Controller.<br>- Giới hạn phạm vi báo cáo vào môi trường thực tế kiểm thử qua Chrome CDP; thông báo rõ ràng dependency `puppeteer-core`. | - Thuật toán tính độ chói trong `verify_module_005.js`.<br>- Dữ liệu số đo trong `VERIFICATION.json`. |

---

## 2. Cách Chạy & Tái Hiện Kiểm Thử

Dự án hoàn toàn tự chứa (self-contained), hoạt động offline trên nền trình duyệt chuẩn, không phụ thuộc thư viện UI ngoài:

1. **Xem trực tiếp mã nguồn giao diện**:
   - Bản hoàn thiện cuối cùng: Mở tệp `./index.html` trên trình duyệt.
   - Bản nháp Hướng A (Biên tập): Mở tệp `./directions/option_a.html`.
   - Bản nháp Hướng B (Hệ thống): Mở tệp `./directions/option_b.html`.
2. **Chạy kịch bản tự động kiểm chứng & chụp ảnh**:
   - Môi trường yêu cầu: Node.js (cần cài đặt `npm install puppeteer-core` nếu chạy ở môi trường mới) và một phiên bản Chrome đang mở cổng CDP (mặc định cổng `9222`, hỗ trợ cấu hình linh hoạt qua biến môi trường `CDP_PORT`).
   - Lệnh chạy:
     ```bash
     node verify_module_005.js
     ```
   - Kết quả xuất ra: Toàn bộ số đo kỹ thuật ghi nhận tại `./VERIFICATION.json` và 4 bức ảnh nghiệm thu bản cuối lưu tại thư mục `./screenshots/`.

---

## 3. Hai Luận Điểm Thiết Kế & Bảng So Sánh Khác Biệt (V02 Đã ĐẠT)

*(Kế thừa nguyên vẹn kết luận ĐẠT từ Review 001 của Controller)*

* **Hướng A — Biên tập (Editorial)**:  
  *"Đặt trọng tâm vào nhịp điệu đọc văn bản và khoảng trắng tự nhiên; sử dụng kiểu chữ Serif thanh lịch cho tiêu đề kết hợp cột nội dung hẹp và bản mẫu dạng trích đoạn tài liệu nghiên cứu có chú thích lề, giúp người xem tiếp cận dự án như một bài viết chuyên khảo sâu sắc về quản trị sản phẩm."* *(62 từ)*
* **Hướng B — Hệ thống (Structural Precision)**:  
  *"Sử dụng trục căn lề trái nghiêm ngặt kết hợp cặp phông Sans-serif mô-đun và Monospace kỹ thuật nhằm biến thông tin bàn giao thành các khối dữ liệu đối chiếu chuẩn xác, giúp người phụ trách sản phẩm nhận diện tức thì tình trạng công việc mà không bị phân tán thị giác."* *(53 từ)*

### Bảng so sánh 3 trục đối chiếu trên ảnh thực tế:
1. **Typography**: Hướng A dùng Serif (Georgia/Times) cho H1/H2 $\leftrightarrow$ Hướng B dùng Neo-grotesque Sans-serif (Inter 800) kết hợp Monospace kỹ thuật cho nhãn bối cảnh và mã định danh.
2. **Bố cục (Composition)**: Hướng A dùng lưới bất đối xứng biên tập (1.15fr / 0.85fr) với khoảng trắng thoáng đãng $\leftrightarrow$ Hướng B dùng lưới mô-đun cân đối, trục căn lề trái nghiêm ngặt khóa chặt tiêu đề và các khối bảng thẻ qua đường kẻ hairline `#E2E8F0`.
3. **Xử lý tài sản (Image Treatment)**: Hướng A đóng khung trang tài liệu nghiên cứu giấy có chú thích lề $\leftrightarrow$ Hướng B đóng khung giao diện công cụ thực tế (`MODULE 01: TRACE SPECIMEN // BẢN MẪU TĨNH`) với bảng đối chiếu ma trận và badge trạng thái có dot marker hình học.

---

## 4. Lý Do Chọn Hướng B & Hai Đánh Đổi Kiến Trúc

### Căn cứ lựa chọn:
Đối tượng xem mục tiêu là người phụ trách sản phẩm (Product Owner) hoặc người phụ trách vận hành tại doanh nghiệp nhỏ. Với nhóm người xem này, khả năng quét nhanh (scanability) và tính trật tự của dữ liệu bàn giao là yếu tố then chốt. Hướng B mang lại bản sắc của một công cụ quản lý sản phẩm chuyên nghiệp, giúp người xem đối chiếu tức thì 3 cột thông tin (Tài liệu - Người phụ trách - Trạng thái) trong cùng một ngữ cảnh.

### Hai đánh đổi (Trade-offs):
1. **Tính Kỷ Luật Kỹ Thuật (Technical Rigor) vs. Tính Truyền Cảm Nghệ Thuật (Artistic Warmth)**:
   - *Được gì*: Tạo cảm giác chuẩn xác, có tổ chức và độ tin cậy cao về năng lực quản trị hệ thống.
   - *Mất gì*: Thiếu vắng cảm xúc ấm áp, tính phóng khoáng cá nhân của phong cách biên tập Serif truyền thống.
   - *Khi nào không còn phù hợp*: Khi TRACE chuyển đổi thành ấn phẩm xuất bản sáng tạo, blog kiến trúc nghệ thuật hoặc portfolio đồ họa thị giác tự do.
2. **Mật Độ Thông Tin Ma Trận (Matrix Density) vs. Độ Tối Giản Di Động (Mobile Simplicity)**:
   - *Được gì*: Giữ nguyên vẹn 3 trường dữ liệu đối chiếu trong cùng một ngữ cảnh mà không phải cắt xén thông tin trên bất kỳ thiết bị nào.
   - *Mất gì*: Chiếm dụng thêm một phần không gian cuộn dọc trên màn hình hẹp so với danh sách văn bản thuần túy.
   - *Khi nào không còn phù hợp*: Khi người dùng là nhân viên hiện trường chỉ cần danh sách thao tác một chạm (single-tap checklist) dạng phẳng.

---

## 5. Tự Phản Biện Dựa Trên Ảnh Thực Tế & Thay Đổi Cụ Thể (F01 & F02)

### Ba nhận xét tự phản biện:
1. **Tại thanh tiêu đề Specimen trong Hero (`screenshots/final_desktop_1440x900.png`)**:
   - *Quan sát ở r01*: Nhãn “CHẾ ĐỘ THỰC THI” có thể gây ngộ nhận rằng đây là ứng dụng đang kết nối socket thật.
   - *Đã xử lý ở r02*: Đổi thành nhãn trung thực `BẢN MẪU TĨNH`, loại bỏ mọi ấn tượng mơ hồ về dữ liệu thời gian thực.
2. **Tại bảng ma trận Section 02 trên Mobile (`screenshots/final_mobile_390x844.png`)**:
   - *Quan sát ở r01*: Việc ép bảng 3 cột ngang cùng với `nowrap` ở badge trạng thái đã đẩy toàn bộ việc co hẹp vào tên tài liệu, khiến "Yêu cầu sản phẩm" và "Bản mẫu đăng nhập" bị chia thành 3–4 tầng hẹp từng từ một.
   - *Đã xử lý ở r02 (F01)*: Tái cấu trúc thành bố cục hàng hai tầng trên mobile: Dòng 1 dành trọn 100% bề ngang cho tên tài liệu (đo đạc thực tế: `estimatedLines = 1`, không bị bẻ từ). Dòng 2 đặt Người phụ trách và Badge trạng thái song song gọn gàng.
3. **Tại đường phân cách hàng Section 02 trên Desktop (`screenshots/final_desktop_1440x900.png`)**:
   - *Quan sát ở r01*: Thuộc tính `display: flex` gắn trực tiếp lên `td.col-doc` làm đường phân cách hàng bị lệch cao độ so với các cột bên cạnh.
   - *Đã xử lý ở r02 (F01)*: Giữ nguyên `display: table-cell` cho mọi ô `td` trên desktop, chuyển flex vào thẻ con `.doc-cell-content`. Đường kẻ `border-bottom` giữa các hàng giờ đây chạy phẳng tắp, đồng nhất cao độ xuyên suốt cả 3 cột.

---

## 6. Tổng Hợp Kết Quả Đo Đạc Kỹ Thuật Bộ Kiểm Tra Khóa V01–V08

| Mã ca | Nội dung kiểm tra | Kết quả đo đạc thực tế tại Rev 002 | Kết luận |
| :---: | :--- | :--- | :---: |
| **V01** | Nội dung chuẩn & nhãn bản mẫu tĩnh | Khớp 100% nguyên văn tiêu đề, đoạn văn bản, 2 CTA, 3 dòng dữ liệu (An/Bình/Chi). Nhãn bản mẫu là `BẢN MẪU TĨNH` trung thực. Danh sách từ ngữ cấm phát hiện: `[]` (0 từ bịa đặt). | **PASS** |
| **V02** | Khác biệt A/B | Hai ảnh nháp `./screenshots/option_a_desktop_1440x900.png` và `./screenshots/option_b_desktop_1440x900.png` được kế thừa, thể hiện sự khác biệt rõ rệt trên 3 trục đã được Controller chấp thuận ở Review 001. | **ĐẠT (Review 001)** |
| **V03** | Nhất quán Contract & Bản cuối | `DESIGN_CONTRACT.yaml` đã đồng bộ hoàn toàn với `index.html` về kích thước phông (`clamp(2.25rem, 4vw, 3rem)`, `1.125rem`), nhãn signature `MODULE 01: TRACE SPECIMEN // BẢN MẪU TĨNH`, và các giả thuyết thiết kế. | **SELF_REVIEW_PENDING_CONTROLLER** |
| **V04** | CTA có đích thật | Click `#cta-organization` cuộn tức thì đến `#section-organization` (hash: `#section-organization`). Click `#cta-decisions` cuộn tức thì đến `#section-decisions` (hash: `#section-decisions`). | **PASS** |
| **V05** | Bàn phím trên bản cuối | Phím Tab định vị chuẩn xác tới 2 CTA; phím Enter kích hoạt cuộn tức thì. Tiêu điểm bàn phím: `outline: 2px solid rgb(2, 132, 199); outline-offset: 2px;` hiển thị rõ ràng. | **PASS** |
| **V06** | Responsive & Khả năng đọc mobile | - **Desktop (1440x900)**: `scrollWidth = 1425 <= clientWidth = 1425`, `rowHeightAdequate = true`.<br>- **Tablet (768x1024)**: `scrollWidth = 753 <= clientWidth = 753`, `rowHeightAdequate = true`.<br>- **Mobile (390x844)**: `scrollWidth = 375 <= clientWidth = 375`, không tràn ngang.<br>- **Khả năng đọc mobile (F01)**: Cả 3 tiêu đề tài liệu hiển thị phẳng phiu trên 1 dòng đơn (`estimatedLines = 1`):<br>  • *Yêu cầu sản phẩm*: width 133.97px / 375px (1 dòng)<br>  • *Bản mẫu đăng nhập*: width 150.89px / 375px (1 dòng)<br>  • *Biên bản bàn giao*: width 135.50px / 375px (1 dòng)<br>Người phụ trách và badge trạng thái ghép đôi chuẩn xác ở dòng dưới. | **PASS** *(Kỹ thuật)*<br>*(Khả năng đọc chờ Controller đối soát ảnh)* |
| **V07** | Ngữ nghĩa & Tương phản sRGB (F03) | Đúng duy nhất 1 thẻ `<h1>`, 2 thẻ `<h2>`, 3 thẻ `<h3>`. Có đủ `<nav>`, `<main>`, `<section>`, `<footer>`.<br>**Tỷ lệ tương phản sRGB tính bằng thuật toán chuẩn WCAG 2.1**:<br>- Chữ chính `#0F172A` trên nền `#F8FAFC`: **17.06:1** (vượt chuẩn AAA 7.0:1)<br>- Chữ phụ `#475569` trên nền `#F8FAFC`: **7.24:1** (vượt chuẩn AAA 7.0:1)<br>- Nút chính `#FFFFFF` trên `#0F172A`: **17.85:1** (vượt chuẩn AAA 7.0:1)<br>- Badge Hiện hành `#065F46` trên `#ECFDF5`: **7.29:1** (vượt chuẩn AAA 7.0:1)<br>- Badge Đang soạn `#92400E` trên `#FEF3C7`: **6.37:1** (vượt chuẩn AA 4.5:1)<br>- Badge Chờ xác nhận `#9A3412` trên `#FFEDD5`: **6.38:1** (vượt chuẩn AA 4.5:1)<br>Badge có cả chữ và chấm marker hình học, không dùng màu đơn độc. | **PASS** |
| **V08** | Zero Motion & Gói tái hiện | `transitionDuration: 0s`, `animationName: none`, `scrollBehavior: auto`. Phông chữ hệ thống tiêu chuẩn (`Inter`, `-apple-system`, `SF Mono`), hoạt động offline 100%. Script `verify_module_005.js` sử dụng đường dẫn tương đối và thông báo lỗi rõ ràng nếu thiếu dependency. | **PASS** |

---

## 7. Giới Hạn Nghiệm Thu

1. **Phạm vi kiểm thử thực tế**: Bằng chứng kỹ thuật được thu thập trực tiếp trên môi trường Google Chrome qua kết nối Chrome DevTools Protocol (CDP); mã nguồn tuân thủ tiêu chuẩn W3C HTML5/CSS3 chuẩn hóa.
2. **Thẩm định thị giác**: Các đánh giá về sự hài hòa thị giác và tính chân thực của bản mẫu được nghiệm thu qua 4 ảnh chụp mới và phán quyết của ChatGPT Controller cùng sự phê duyệt của Anh (Lead Architect).
3. **Quy ước dự án**: Các quyết định thiết kế ở đây phục vụ bài toán cụ thể của dự án giả lập TRACE, không tự ý nâng thành quy chuẩn bắt buộc cho mọi sản phẩm phần mềm khác.
