# IMAGE LANGUAGE MATRIX — TRIPFLOW Daily Departure Brief (Module 12)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng kiến trúc (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm nghiệp vụ (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)`  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: `Anh — Lead Architect / Product Owner`  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: `Em — Senior Engineering Agent / Lead Implementer`  
> **Tác tử thi công (Implementer)**: `worker_p0_p1_replace`  
> **Không gian làm việc (Workspace)**: `design-training/stream-b/module-012/`  
> **Quy chuẩn ma trận**: **6 Vai Trò Tài Sản (6 Asset Roles) × 10 Thuộc Tính Quy Tắc Bắt Buộc (10 Mandatory Attributes)**  

---

## 1. Nguyên Tắc Quản Trị Hệ Thống Hình Ảnh (Image System Governance Principles)

Tuân thủ nghiêm ngặt quy định tại Section 7, Section 8, Section 9 và Section 10 của `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`:
1. **Mục đích Chức năng Vận hành (Operational Functional Purpose)**: Mọi tài nguyên đồ họa (ảnh bối cảnh, ảnh hiện trường, sơ đồ tuyến, avatar, biểu tượng, họa tiết) đều phải phục vụ trực tiếp cho việc nhận thức trạng thái và giải quyết điểm nghẽn của điều phối viên. Không đưa hình ảnh vào giao diện chỉ để trang trí làm đẹp đơn thuần.
2. **Minh bạch Nguồn gốc & Bản quyền (Provenance & Ethics Transparency)**:
   - 100% tài nguyên đồ họa phải được đăng ký đầy đủ trong `ASSET_MANIFEST.yaml` kèm mã băm SHA-256 thực tế, tỷ lệ focal point, chiến lược `alt` và trường tuyên bố minh bạch (`disclosure`).
   - Mọi tài sản do AI tạo ra (`ai_generated`) hoặc do tác giả tự vẽ (`authored_vector`) phải được ghi nhận rõ ràng.
   - Nhân vật điều phối viên **Lan là nhân vật giả lập (Fictional Authored Persona)**; tuyệt đối không dùng ảnh người thật ngoài đời hoặc mạo danh đối tác du lịch thật.
3. **Hiệu suất & Tải Tài nguyên Cục bộ (Zero External Network Requests)**:
   - Toàn bộ tài sản được lưu trữ cục bộ tại thư mục `assets/`, không thực hiện bất kỳ lệnh tải từ xa nào (`remote_runtime_requests: 0`).
   - Dung lượng mỗi tệp raster không vượt quá `600 KB` (`max_single_raster_bytes: 600000`), tổng dung lượng tài sản runtime không vượt quá `3.5 MB`.
4. **Bình đẳng Trạng thái Khi Lỗi Tải Ảnh (Image Failure Parity)**:
   - Khi mạng mất kết nối hoặc ảnh raster bị lỗi (404), giao diện không được vỡ bố cục. Thông tin tour T01, trạng thái vận hành, chuỗi lộ trình và các nút bấm hành động (CTA) vẫn phải đọc được và thao tác hoàn chỉnh qua văn bản thay thế, màu nền fallback và avatar chữ viết tắt.

---

## 2. Ma Trận Ngôn Ngữ Hình Ảnh Chi Tiết: 6 Vai Trò × 10 Thuộc Tính (Detailed Image Language Matrix)

Dưới đây là đặc tả chuẩn hóa của toàn bộ 6 vai trò tài sản theo đúng 10 thuộc tính quy tắc bắt buộc:

### Vai Trò 1: Hero / Context (Hình ảnh Bối cảnh Khởi hành Trọng tâm)
- **Số lượng tối thiểu (Min Assets)**: 1 tài sản (Bối cảnh vịnh Hạ Long / Cảng tàu khách quốc tế Tuần Châu phục vụ tour trọng tâm T01).
- **1. Mục đích nghiệp vụ (`purpose`)**: Định vị tức thời không gian địa lý và bối cảnh chuẩn bị đón khách của tour T01 (khởi hành lúc 07:30 ngày 14/09); giúp điều phối viên liên tưởng ngay tới điều kiện thực tế của địa bàn.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` (Vector địa lý tối giản) hoặc `ai_generated` (Ảnh tư liệu tạo bằng AI có khai báo minh bạch).
- **3. Quy tắc phong cách (`style_rule`)**: Góc nhìn ngang tầm mắt từ bến tàu hoặc bờ vịnh; ánh sáng chiều tà tự nhiên (phù hợp mốc 18:00); tông màu trầm tĩnh, không dùng bộ lọc màu bão hòa sặc sỡ kiểu bưu thiếp du lịch.
- **4. Điều ĐƯỢC làm (`do`)**: Thể hiện khung cảnh bến bãi, tàu thuyền neo đậu chuẩn bị đón khách; bố cục theo quy tắc một phần ba (Rule of Thirds); để lại khoảng trống tĩnh lặng phía trên hoặc góc ảnh cho việc hiển thị nhãn thông tin.
- **5. Điều CẤM làm (`do_not`)**: Cấm dùng ảnh khu nghỉ dưỡng sang trọng (luxury resort); cấm du khách mặc đồ bơi tạo dáng; cấm ảnh hoàng hôn lãng mạn vô thực; cấm chèn chữ chìm (watermark).
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Viewport 1440×900: Tỷ lệ khung hình 16:9 hoặc 21:9 ngang; điểm nhìn trọng tâm (`focal point`) neo tại `{ x: 50%, y: 40% }`; `object-fit: cover`.
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Viewport 390×844: Tỷ lệ 16:9 hoặc 4:3; focal point neo tại `{ x: 50%, y: 45% }`; giới hạn chiều cao tối đa không quá 220px để tránh đẩy bảng dữ liệu snapshot ra khỏi tầm mắt.
- **8. Xử lý màu sắc (`color_treatment`)**: Cân bằng trắng trung tính, giảm 10% độ bão hòa (`saturation`) để tạo cảm giác điềm tĩnh, kiểm soát độ tương phản đạt chuẩn sRGB, không làm chói mắt.
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: W3C Informative image; thẻ HTML: `<img alt="Bối cảnh cảng tàu và vùng vịnh Hạ Long lúc chập tối, địa bàn khởi hành của đoàn T01" loading="lazy" width="640" height="360">`.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Container duy trì kích thước cố định bằng CSS `aspect-ratio`; hiển thị nền màu ghi sáng nhạt (`#F1F5F9`) kèm icon vector địa lý và dòng văn bản: *"Bối cảnh Hạ Long (T01) — Đang cập nhật hình ảnh"*.

---

### Vai Trò 2: Operational Scene (Hình ảnh Hiện trường Công tác Vận hành)
- **Số lượng tối thiểu (Min Assets)**: 2 tài sản (Công tác kiểm tra danh sách phòng khách sạn & Kiểm tra kỹ thuật xe trung chuyển).
- **1. Mục đích nghiệp vụ (`purpose`)**: Phản ánh chân thực các mắt xích công việc chuẩn bị thực tế đằng sau các con số; nhắc nhở đội ngũ về khâu phối hợp với khách sạn và nhà xe đối tác.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` hoặc `ai_generated` (được gắn nhãn minh bạch trong manifest).
- **3. Quy tắc phong cách (`style_rule`)**: Nhiếp ảnh phóng sự tài liệu mang phong cách Magnum Photos; ánh sáng hiện trường tự nhiên (đèn bàn làm việc văn phòng hoặc ánh sáng ngoài bãi đỗ xe); góc máy quan sát khách quan.
- **4. Điều ĐƯỢC làm (`do`)**: Tập trung vào chi tiết hành động: Bàn tay rà soát danh sách kiểm tra trên sổ tay, màn hình máy tính hiển thị xác nhận phòng, hoặc tài xế kiểm tra cửa xe; giữ vẻ đẹp lao động mộc mạc.
- **5. Điều CẤM làm (`do_not`)**: Cấm người mẫu tạo dáng mỉm cười nhìn thẳng vào ống kính; cấm ảnh văn phòng công nghệ cao bóng bẩy; cấm chèn đồ họa số liệu giả tạo vào ảnh.
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Tỷ lệ khung hình 4:3 hoặc 3:2; focal point neo tại tâm `{ x: 50%, y: 50% }` (vùng thao tác chính); `object-fit: cover`.
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Tỷ lệ 1:1 vuông hoặc 4:3; tự động căn theo chủ thể thao tác bàn tay/tài liệu `{ x: 45%, y: 50% }`.
- **8. Xử lý màu sắc (`color_treatment`)**: Tông màu ấm áp tự nhiên (warm paper tones), tương phản nhẹ nhàng, không dùng bộ lọc màu nghệ thuật (vintage / sepia / cyberpunk).
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: W3C Informative image; thẻ HTML: `<img alt="Hiện trường điều phối: Nhân viên đang rà soát biên bản xác nhận dịch vụ phòng khách sạn" loading="lazy" width="400" height="300">`.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Hiển thị thẻ viền nét đứt (`1px dashed #CBD5E1`), nền xám ấm (`#FAF9F6`), hiển thị icon nhật ký cùng đoạn tóm tắt nghiệp vụ dạng text: *"Ghi chú hiện trường: Đang rà soát dịch vụ buồng phòng"*.

---

### Vai Trò 3: Route Diagram (Sơ đồ Chuỗi Lộ trình & Mốc Xác Nhận T01)
- **Số lượng tối thiểu (Min Assets)**: 1 tài sản (Sơ đồ vector chuỗi hành trình đoàn T01 Hạ Long 2N1Đ).
- **1. Mục đích nghiệp vụ (`purpose`)**: Trực quan hóa cấu trúc tuyến hành trình theo thời gian; làm nổi bật điểm nút đứt gãy "Chờ 4 phòng khách sạn" nằm giữa khâu di chuyển và khâu lưu trú trước giờ khởi hành 07:30 ngày 14/09.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` (Pure SVG hoặc Semantic HTML DOM Nodes do tác giả lập trình).
- **3. Quy tắc phong cách (`style_rule`)**: Đường nét hình học dứt khoát, các điểm nút tròn (nodes) có kích thước đồng đều, đường liên kết rõ ràng; nhãn thời gian và địa danh hiển thị bằng text sắc nét, không dùng ảnh chụp sơ đồ dạng bitmap.
- **4. Điều ĐƯỢC làm (`do`)**: Thể hiện đầy đủ 4 mốc: 1. Đón khách Hà Nội (07:30) $\to$ 2. Di chuyển Cao tốc $\to$ 3. Điểm nghẽn Khách sạn Bãi Cháy (Chờ xác nhận 4 phòng) $\to$ 4. Bến tàu Tuần Châu. Đánh dấu nút số 3 bằng màu hổ phách cảnh báo và icon chờ đối tác.
- **5. Điều CẤM làm (`do_not`)**: Cấm xuất sơ đồ ra tệp ảnh PNG/JPG gây vỡ nét; cấm dùng các đường cong uốn lượn rối mắt; cấm cắt cúp làm mất chữ hoặc gãy đoạn đường nối.
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Bố cục dàn hàng ngang (`Horizontal Stepping Pipeline`) trải dài trên toàn bộ chiều rộng thẻ thông tin; viewBox SVG `0 0 800 120` tự động co giãn (`preserveAspectRatio="xMidYMid meet"`).
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Tự động chuyển đổi sang bố cục dọc (`Vertical Stepping Pipeline`) bằng CSS Flexbox/Grid, giúp các nhãn văn bản và giờ giấc giữ nguyên kích thước dễ đọc trên màn hình hẹp 390px.
- **8. Xử lý màu sắc (`color_treatment`)**: Nét ray liên kết xám trung tính (`#CBD5E1`); nút sẵn sàng màu xanh ngọc điềm đạm (`#059669`); nút điểm nghẽn màu vàng hổ phách (`#D97706`) với nền phát tín hiệu nhẹ nhàng.
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: W3C Complex image; thẻ SVG có `role="img"` kèm `aria-labelledby="diagram-title diagram-desc"`; đi kèm một danh sách có thứ tự `<ol class="sr-only route-steps-list">` diễn giải toàn bộ 4 mốc hành trình cho máy đọc màn hình.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Vì sơ đồ được xây dựng bằng SVG inline hoặc Semantic HTML DOM, rủi ro lỗi tải là bằng 0. Nếu CSS bị tắt, danh sách `<ol>` tự động hiển thị tuần tự dưới dạng văn bản có cấu trúc hoàn chỉnh.

---

### Vai Trò 4: Person / Avatar (Hình ảnh Người Phụ Trách — Điều Phối Viên Lan)
- **Số lượng tối thiểu (Min Assets)**: 1 tài sản (Avatar chân dung bán thân của Lan phụ trách đoàn T01).
- **1. Mục đích nghiệp vụ (`purpose`)**: Định danh rõ ràng nhân sự chịu trách nhiệm trực tiếp tháo gỡ điểm nghẽn của đoàn T01; tăng cường tính kết nối và trách nhiệm trong đội ngũ vận hành.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` (Minh họa vector trang nhã) hoặc `ai_generated` (có tuyên bố minh bạch nhân vật giả lập).
- **3. Quy tắc phong cách (`style_rule`)**: Chân dung bán thân nghiêm túc, biểu cảm điềm tĩnh, trang phục công sở lữ hành nhã nhặn; hậu cảnh đơn sắc tối giản; góc nhìn đối thoại thân thiện.
- **4. Điều ĐƯỢC làm (`do`)**: Đặt huy hiệu chú thích rõ ràng bên cạnh: `"Lan — Điều phối viên chính (Nhân vật giả lập)"`; thể hiện thông tin liên hệ nội bộ (máy nhánh điều hành).
- **5. Điều CẤM làm (`do_not`)**: Cấm lấy ảnh chụp của người thật trên mạng xã hội; cấm mạo danh nhân viên có thật của bất kỳ công ty du lịch nào; cấm vẽ theo phong cách truyện tranh hoạt hình phóng đại.
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Khung tròn hoặc bo góc vuông 12px; tỷ lệ 1:1 kích thước chuẩn `48×48 px` hoặc `64×64 px`; focal point neo tại `{ x: 50%, y: 35% }` (vùng mắt và khuôn mặt).
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Giữ nguyên tỷ lệ 1:1, kích thước `44×44 px` bảo đảm vùng chạm và nhận diện thị giác tốt.
- **8. Xử lý màu sắc (`color_treatment`)**: Cân bằng màu da tự nhiên, nền xám ấm nhẹ (`#F1F5F9`), tương phản vòng bo đạt chuẩn WCAG AA so với màu nền thẻ.
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: W3C Informative image; thẻ HTML: `<img alt="Lan, điều phối viên phụ trách tour T01 (Nhân vật giả lập đào tạo)" width="48" height="48">`.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Tự động hiển thị thẻ avatar chữ viết tắt (`Initials Fallback Avatar`): Khối tròn nền màu ghi xanh (`#E2E8F0`), chữ cái `"L"` in hoa đậm nét màu xám than (`#334155`), đảm bảo nhận diện ngay lập tức.

---

### Vai Trò 5: Icon Family (Hệ Thống 6 Biểu Tượng Nghiệp Vụ Chuyên Biệt)
- **Số lượng tối thiểu (Min Assets)**: Đúng 6 biểu tượng chuẩn mực (Khởi hành, Chờ đối tác, Thiếu hồ sơ, Sẵn sàng, Phụ trách, Nhật ký).
- **1. Mục đích nghiệp vụ (`purpose`)**: Tiêu chuẩn hóa ngôn ngữ thị giác cho các trạng thái và hành động cốt lõi của bảng điều phối; DESIGN_INTENT hỗ trợ người vận hành nhận thức phân loại nhanh chóng và trực quan khi quét mắt theo dõi hành trình.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` (Tập tin SVG vector độc lập hoặc Inline SVG do nhóm tác giả kiến tạo).
- **3. Quy tắc phong cách (`style_rule`)**: Hệ lưới hình học thống nhất viewBox `0 0 24 24`; độ dày nét `stroke-width: 1.75px` đồng nhất; bo góc nhẹ (`stroke-linecap="round" stroke-linejoin="round"`); không đổ bóng; không nền đặc che khuất.
- **4. Điều ĐƯỢC làm (`do`)**: Luôn đặt biểu tượng đi kèm nhãn chữ tương ứng; sử dụng thuộc tính `currentColor` để màu biểu tượng kế thừa tự nhiên từ màu ngữ cảnh của thẻ trạng thái.
- **5. Điều CẤM làm (`do_not`)**: Cấm sử dụng emoji của hệ điều hành (Apple/Windows emojis); cấm dùng bộ icon font (FontAwesome) nặng nề; cấm trộn lẫn giữa icon nét mảnh và icon mảng đặc; cấm dùng icon đơn độc mà không có nhãn chữ.
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Kích thước hiển thị chuẩn `20×20 px` hoặc `24×24 px` bên trong bounding box bảo vệ; không bị co méo tỷ lệ.
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Kích thước tối thiểu `18×18 px`, vùng bấm bao quanh (nếu là nút bấm chức năng) luôn đạt tối thiểu `44×44 CSS px`.
- **8. Xử lý màu sắc (`color_treatment`)**: Đồng bộ với màu nhãn: Xanh ngọc (`#059669`) cho Sẵn sàng, Vàng hổ phách (`#D97706`) cho Chờ đối tác, Cam san hô (`#DC2626`) cho Thiếu hồ sơ, Xanh navy (`#2563EB`) cho Khởi hành, Xám than (`#475569`) cho Phụ trách và Nhật ký.
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: Khi đi kèm nhãn văn bản tường minh: Đặt `aria-hidden="true"` và `focusable="false"` trên thẻ SVG để không làm rối trình đọc màn hình. Khi đứng độc lập: Bắt buộc có `<title>` và `aria-label`.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Nhãn văn bản tiếng Việt đi kèm (`text label`) bảo đảm truyền tải 100% ngữ nghĩa nguyên vẹn ngay cả khi trình duyệt không dựng được đồ họa vector.

---

### Vai Trò 6: Texture / Accent (Họa Tiết Bề Mặt & Điểm Nhấn Tinh Tế)
- **Số lượng tối thiểu (Min Assets)**: 1 tài sản (Hạt giấy xúc giác nhẹ cho Hướng A hoặc Lưới tọa độ kỹ thuật mờ cho Hướng B).
- **1. Mục đích nghiệp vụ (`purpose`)**: Định hình cảm xúc thương hiệu tinh tế: Mang lại chất liệu giấy in thực địa ấm áp cho Direction A, hoặc trật tự tọa độ đo lường chuẩn xác cho Direction B.
- **2. Loại nguồn gốc hợp lệ (`source_type`)**: `authored_vector` (Mẫu SVG Pattern lặp) hoặc CSS Generated Pattern thuần túy.
- **3. Quy tắc phong cách (`style_rule`)**: Độ trong suốt vi mô (`micro-opacity: 1.5% – 3%`); không được gây nhiễu loạn thị giác hay làm giảm độ tương phản của chữ đặt bên trên.
- **4. Điều ĐƯỢC làm (`do`)**: Ứng dụng làm nền viền thẻ hoặc dải phân cách; luôn kiểm tra độ tương phản văn bản lớp trên bảo đảm vượt ngưỡng 4.5:1 của WCAG AA.
- **5. Điều CẤM làm (`do_not`)**: Cấm dùng texture sặc sỡ, cấm nổi khối 3D thô thiển, cấm hiệu ứng sóng động hay chuyển động (Zero-Motion Mandate).
- **6. Quy tắc cắt cúp Desktop (`desktop_crop`)**: Lặp lại tự nhiên dạng gạch hoa (`background-repeat: repeat`) hoặc neo cố định theo viền container.
- **7. Quy tắc cắt cúp Mobile (`mobile_crop`)**: Tự động làm mờ hoặc ẩn trên màn hình nhỏ nếu cần ưu tiên tối đa diện tích và hiệu năng render của chip di động.
- **8. Xử lý màu sắc (`color_treatment`)**: Đơn sắc xám trung tính hoặc tông ấm nhẹ (`rgba(15, 23, 42, 0.02)`), hoàn toàn hòa quyện vào màu nền canvas.
- **9. Xử lý tiếp cận & trợ năng (`accessibility_treatment`)**: Thuộc tính thuần trang trí (W3C Decorative); khai báo thông qua CSS `background-image` hoặc thẻ `<svg aria-hidden="true">`.
- **10. Ứng xử khi lỗi tải ảnh (`fallback_behavior`)**: Trở về màu nền trơn (`solid color: #FAF9F6`), hoàn toàn không làm gián đoạn hay ảnh hưởng tới cấu trúc nội dung.

---

## 3. Ma Trận Quy Tắc Cắt Cúp & Trọng Tâm 3 Viewport (3-Viewport Crop & Focal Point Matrix)

Bảng quy định thông số kỹ thuật responsive cho việc hiển thị hình ảnh trên 3 viewport chuẩn mực theo Section 10 của Directive:

| Viewport Chuẩn | Kích Thước (Width × Height) | Tỷ Lệ Cắt Cúp (Aspect Ratio) | Điểm Nhìn Trọng Tâm (Focal Point) | CSS Object-Fit / Position | Chiến Lược Chống Tràn Bố Cục (Layout Shift Prevention) |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Desktop (Chính)** | `1440 × 900 px` (DPR: 2) | `16:9` hoặc `21:9` | `{ x: 50%, y: 40% }` | `object-fit: cover; object-position: 50% 40%;` | Khai báo trước thuộc tính `width="640"` và `height="360"` cùng CSS `aspect-ratio: 16/9;` |
| **Tablet (Thử nghiệm)** | `768 × 1024 px` (DPR: 2) | `16:9` hoặc `4:3` | `{ x: 50%, y: 45% }` | `object-fit: cover; object-position: 50% 45%;` | Tái cấu trúc khung thẻ sang dạng 1 cột, khóa chiều cao tối đa `260px` |
| **Mobile (Thử nghiệm)** | `390 × 844 px` (DPR: 2) | `4:3` hoặc `1:1` | `{ x: 50%, y: 50% }` | `object-fit: cover; object-position: center;` | Chiều cao ảnh tối đa `180px`, không cho phép chiếm quá 25% màn hình; tuyệt đối không sinh scrollbar ngang |

---

## 4. Hợp Đồng Đồ Họa 6 Biểu Tượng Nghiệp Vụ (Iconography Technical Contract)

Bảng kê thông số kỹ thuật vector chi tiết cho 6 biểu tượng bắt buộc thuộc vai trò `Icon Family`:

| Biểu Tượng (Icon Name) | Ý Nghĩa Nghiệp Vụ (Operational Semantic) | Mã Ký Hiệu Hình Học (Geometry Motif) | Thuộc Tính SVG Bắt Buộc (Required SVG Attributes) | Nhãn Văn Bản Đi Kèm (Paired Text Label) |
| :--- | :--- | :--- | :--- | :--- |
| **1. departure** | Giờ xe/tàu lăn bánh khởi hành | Mũi tên góc nghiêng kết hợp đồng hồ mini | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Giờ khởi hành: 07:30"` |
| **2. waiting_partner** | Điểm nghẽn đang chờ đối tác xác nhận | Vòng tròn ngắt đoạn kèm dấu chấm hỏi/chấm than | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Chờ đối tác"` |
| **3. missing_docs** | Thiếu chứng từ, hồ sơ khách (CCCD) | Trang tài liệu góc gập kèm dấu gạch chéo vi mô | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Thiếu hồ sơ"` |
| **4. ready** | Đã sẵn sàng 100% mọi điều kiện | Vòng tròn bao bọc dấu kiểm (checkmark) sắc nét | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Sẵn sàng"` |
| **5. assignee** | Người chịu trách nhiệm chính điều phối | Biểu tượng người bán thân tối giản (bust icon) | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Phụ trách: Lan"` |
| **6. contact_log** | Nhật ký các cuộc gọi và trao đổi nghiệp vụ | Cuốn sổ tay nhỏ có dòng kẻ và bút mini | `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"` | `"Nhật ký liên hệ"` |

---

## 5. Kết Luận & Tiêu Chí Nghiệm Thu (Matrix Verification Criteria)

Tài liệu này xác lập quy chuẩn kỹ thuật cho việc xây dựng tài nguyên trong thư mục `assets/` và thẩm định mã nguồn:
1. **Kiểm tra vai trò (Role Check)**: Đúng đủ 6 vai trò, không thiếu bất kỳ vai trò nào trong danh mục.
2. **Kiểm tra thuộc tính (Attribute Check)**: Mỗi vai trò có đủ 10 thuộc tính quy tắc, không để trống trường nào.
3. **Thẩm định tự động (Automated Verification)**: Bài test `T06` sẽ đo kích thước và focal point thực tế; bài test `T07` sẽ kiểm chứng khả năng chịu lỗi khi mất kết nối ảnh; bài test `T09` sẽ kiểm chứng tính đồng bộ hình học của 6 biểu tượng.
