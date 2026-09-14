# REFERENCE BOARD — TRIPFLOW Daily Departure Brief (Module 12)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng kiến trúc (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm nghiệp vụ (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)`  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: `Anh — Lead Architect / Product Owner`  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: `Em — Senior Engineering Agent / Lead Implementer`  
> **Tác tử thi công (Implementer)**: `worker_p0_p1_replace`  
> **Không gian làm việc (Workspace)**: `design-training/stream-b/module-012/`  
> **Quy chuẩn danh mục (Benchmark Count)**: **Đúng 8 tài liệu tham chiếu chuyên sâu (Exactly 8 Curated References)**  

---

## 1. Nguyên Tắc Quản Trị Tham Chiếu (Reference Governance Principles)

Tuân thủ nghiêm ngặt quy định tại Section 3.6 và Section 13 của `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`:
1. **Số lượng giới hạn tối đa (Strict Budget)**: Toàn bộ bảng chỉ gồm đúng 8 tài nguyên tham chiếu thực tế chất lượng cao nhất, không mở rộng tràn lan làm loãng trọng tâm.
2. **5 Trường thông tin bắt buộc (5 Mandatory Evaluation Fields)**: Mỗi tham chiếu bắt buộc phải có đầy đủ:
   - `URL (Đường dẫn gốc)`
   - `Observation (Điều quan sát được thực tế)`
   - `Transfer Principle (Nguyên tắc kỹ thuật / thiết kế có thể chuyển giao)`
   - `Copy Ban (Điều cấm tuyệt đối không được sao chép)`
   - `TRIPFLOW Relevance (Mức độ liên quan & Giá trị ứng dụng với TRIPFLOW)`
3. **Cấm suy diễn hời hợt (No Superficial Rationalization)**: Tuyệt đối cấm sử dụng các lời giải thích sáo rỗng kiểu `"inspired by X"` hoặc ca ngợi chung chung. Mọi phân tích phải mang tính kỹ thuật, cấu trúc và gắn chặt với bài toán điều phối tour B2B.

---

## 2. Bảng Phân Tích Chi Tiết 8 Tham Chiếu Chuẩn Mực (Deep Analysis of 8 Curated References)

### Tham Chiếu 1: W3C Web Accessibility Initiative — Images Tutorial
- **URL**: `https://www.w3.org/WAI/tutorials/images/`
- **Observation (Điều quan sát được thực tế)**:
  Tài liệu chuẩn mực của W3C phân loại toàn diện hình ảnh kỹ thuật số trên web thành 5 nhóm chức năng chuyên biệt:
  1. *Informative Images (Hình ảnh mang thông tin)*: Truyền đạt ý tưởng, mô tả đối tượng hoặc bối cảnh trực tiếp.
  2. *Decorative Images (Hình ảnh trang trí)*: Chỉ phục vụ mục đích thẩm mỹ bố cục, không cung cấp thông tin mới.
  3. *Functional Images (Hình ảnh chức năng)*: Đóng vai trò là nút bấm, liên kết kích hoạt hành động.
  4. *Complex Images (Hình ảnh phức tạp)*: Sơ đồ, biểu đồ, bản đồ chứa lượng dữ liệu chi tiết vượt quá khả năng tóm tắt của một thuộc tính `alt` ngắn.
  5. *Images of Text (Hình ảnh chứa văn bản)*: Văn bản được vẽ dưới dạng raster (khuyến nghị tránh dùng).
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Áp dụng phân loại W3C để phân định rõ ràng 6 vai trò tài sản của TRIPFLOW:
  - Ảnh bối cảnh T01 Hạ Long và Ảnh hiện trường vận hành thuộc nhóm *Informative Images* (cần `alt` mô tả ngữ cảnh chân thực).
  - Avatar chân dung Lan thuộc nhóm *Informative Images* (kèm ghi chú nhân vật giả lập).
  - Sơ đồ chuỗi mốc T01 thuộc nhóm *Complex Images* (bắt buộc cung cấp cấu trúc văn bản tương đương `<ol>` bên ngoài).
  - Các icon trạng thái khi đi kèm nhãn văn bản thuộc nhóm *Decorative Images* (`aria-hidden="true"` để tránh đọc lặp âm vô ích).
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sao chép các ví dụ mã nguồn HTML/CSS cũ kỹ thiếu responsive; không biến các khuyến nghị trợ năng thành những đoạn văn bản quy phạm khô khan làm rườm rà giao diện người dùng.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Thiết lập cơ sở lý luận vững chắc cho tài liệu `IMAGE_LANGUAGE_MATRIX.md` và bài kiểm thử tự động `T08 (Alternative Text Semantics)`, bảo đảm công cụ điều phối đạt chuẩn tiếp cận toàn cầu WCAG 2.2 AA.

---

### Tham Chiếu 2: W3C Web Accessibility Initiative — An alt Decision Tree
- **URL**: `https://www.w3.org/WAI/tutorials/images/decision-tree/`
- **Observation (Điều quan sát được thực tế)**:
  Cây quyết định dạng sơ đồ dòng chảy (flowchart logic) hướng dẫn lập trình viên từng bước xác định chính xác cách xử lý thuộc tính `alt` cho từng phần tử đồ họa:
  - Nếu ảnh là trang trí thuần túy $\to$ đặt `alt=""`.
  - Nếu ảnh là liên kết/nút bấm $\to$ `alt` phải mô tả hành động đích chứ không mô tả hình ảnh.
  - Nếu ảnh chứa thông tin phức tạp $\to$ cần `alt` ngắn tóm tắt vị trí kèm liên kết hoặc vùng văn bản mở rộng chi tiết.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Quy đổi logic phân nhánh của W3C Alt Decision Tree thành thuật toán kiểm tra tự động trong bộ test `T08` của script `verify_module_012.js`: Mọi thẻ `<img>` không bao giờ được thiếu thuộc tính `alt`, và giá trị `alt` không được rỗng ngoại trừ khi phần tử đã được xác định là trang trí thuần túy hoặc đã được ẩn qua `aria-hidden="true"`.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không viết văn bản `alt` theo kiểu máy móc sáo rỗng như `"Hình ảnh của...", "Ảnh chụp...", "Logo của..."`; không nhồi nhét từ khóa SEO không liên quan vào văn bản trợ năng.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Bảo đảm rằng khi điều phối viên sử dụng trình đọc màn hình (`Screen Reader`) trong môi trường vận hành bận rộn, họ sẽ nhận được thông tin cô đọng, chính xác về tình trạng tour và mốc lộ trình mà không bị quấy nhiễu bởi các mô tả vô bổ.

---

### Tham Chiếu 3: IBM Carbon Design System — Icon Production Guidelines
- **URL**: `https://v10.carbondesignsystem.com/contributing/contribute-icons/`
- **Observation (Điều quan sát được thực tế)**:
  Quy chuẩn chế tác biểu tượng công nghiệp khắt khe của IBM với hệ lưới chuẩn hóa đa kích thước (16×16, 20×20, 24×24, 32×32 px):
  - Kiểm soát độ thẳng hàng của pixel (`Pixel Grid Alignment`) giúp đường nét hiển thị sắc sảo, không bị mờ nhòe răng cưa ở màn hình mật độ điểm ảnh thấp.
  - Giữ vững trọng lượng quang học tương đương (`Optical Weight Consistency`) giữa các hình khối hình học khác nhau (hình tròn có diện tích quang học khác hình vuông, cần căn chỉnh đường kính tương ứng).
  - Góc bo và góc vát tuân theo kỷ luật hình học 90° hoặc góc tròn nhất quán.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Toàn bộ 6 biểu tượng nghiệp vụ của TRIPFLOW (Khởi hành, Chờ đối tác, Thiếu hồ sơ, Sẵn sàng, Phụ trách, Nhật ký) phải được xây dựng chung trên hệ lưới viewBox `24x24`, độ dày nét `stroke-width: 1.75px` hoặc `2px`, vùng đệm an toàn (`padding safe zone`) 2px xung quanh viền để triệt tiêu hiện tượng lệch quang học khi đứng cạnh nhãn văn bản.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không tải về và sao chép trực tiếp file SVG độc quyền của Carbon Design System; không bê nguyên phong cách công nghiệp nặng nề của máy chủ doanh nghiệp vào môi trường điều phối dịch vụ du lịch lữ hành.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Giải quyết bài toán đồng bộ hóa thị giác tuyệt đối cho Cổng chặn `B04` và Bài kiểm thử `T09 (Iconography Consistency)`, bảo đảm các biểu tượng trạng thái hiển thị sắc nét, chuyên nghiệp và có cùng ngôn ngữ hình học trên mọi màn hình.

---

### Tham Chiếu 4: GOV.UK Design System — Component Consistency & Clarity
- **URL**: `https://design-system.service.gov.uk/`
- **Observation (Điều quan sát được thực tế)**:
  Hệ thống thiết kế công vụ hàng đầu thế giới với sự kỷ luật cực đoan về tính rõ ràng:
  - Loại bỏ 100% các yếu tố trang trí rườm rà, hiệu ứng đổ bóng ảo hoặc chuyển động phân tán.
  - Sử dụng các thẻ trạng thái (`Status Tags`) có độ tương phản văn bản rất cao so với màu nền nhạt, kết hợp cấu trúc phân cấp thông tin mạch lạc, rành mạch.
  - Văn phong hướng dẫn hành động ngắn gọn, trực diện, không dùng thuật ngữ hoa mỹ.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Vận dụng nguyên lý thiết kế thẻ trạng thái của GOV.UK vào bảng điều phối 8 tour `T01–T08`: Thẻ trạng thái dùng nền màu nhạt có sắc độ nhẹ (`tinted background`) kết hợp chữ đậm màu tương phản cao và đường viền vi mô (`micro-border`), bảo đảm khả năng quét nhanh thông tin trong 3 giây mà không gây chói mắt.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sao chép bảng màu thương hiệu đặc trưng của chính phủ Hoàng gia Anh (màu vàng crown gold, xanh navy công vụ hay nền đen tuyền) khiến TRIPFLOW trở thành tài liệu hành chính nhà nước khô cứng, thiếu sức sống của ngành dịch vụ.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Cung cấp chuẩn mực phân cấp thông tin cho bảng dữ liệu vận hành `Canonical Operational Snapshot`, giúp người điều phối phân biệt tức thời giữa tour đã "Sẵn sàng" và tour "Chờ đối tác" mà không mất thời gian xử lý nhận thức.

---

### Tham Chiếu 5: Swiss Federal Railways (SBB CFF FFS) — Digital Dispatch Display System
- **URL**: `https://digital.sbb.ch/`
- **Observation (Điều quan sát được thực tế)**:
  Hệ thống hiển thị điều phối và tín hiệu vận tải đường sắt quốc gia Thụy Sĩ:
  - Biểu diễn hành trình phức tạp bằng trục thời gian tuyến tính (`Linear Spatial-Temporal Timeline`) cực kỳ trực quan: Các ga dừng là các điểm nút (`nodes`), đoạn di chuyển là đường nối (`tracks`).
  - Sự cố chậm giờ hoặc thay đổi đường ray được mã hóa bằng ký hiệu hình học sắc bén và màu cảnh báo tiết chế (vàng hổ phách hoặc đỏ cam nhẹ), đặt ngay tại điểm nút phát sinh vấn đề.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Mô hình hóa chuỗi mốc lộ trình của đoàn T01 Hạ Long (`Route Sequence Diagram`) thành một sơ đồ tuyến tính trực quan: Thể hiện rõ 4 mốc: Đón khách (Hà Nội) $\to$ Đi chuyển $\to$ Lưu trú (Hạ Long) $\to$ Bến tàu Tuần Châu. Đặt ký hiệu cảnh báo "Chờ xác nhận 4 phòng" chính xác tại điểm nút Lưu trú để người điều phối nhận thức ngay vị trí xảy ra đứt gãy.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sao chép các biểu tượng chuyên ngành đường sắt (đầu máy xe lửa, đường ray, ký hiệu điện cao thế); không làm cho giao diện điều phối tour đường bộ/đường thủy trở thành bảng tín hiệu điều độ tàu hỏa kỹ thuật số.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Là nguồn cảm hứng cấu trúc nền tảng cho **Direction B (Route Signal System)** và sơ đồ chuỗi lộ trình T01, đem lại trật tự hình học nghiêm cẩn và khả năng định vị điểm nghẽn vượt trội.

---

### Tham Chiếu 6: FlightAware — Aviation Operational Briefing Interface
- **URL**: `https://www.flightaware.com/`
- **Observation (Điều quan sát được thực tế)**:
  Giao diện tóm tắt và theo dõi chuyến bay thương mại kết hợp giữa dữ liệu bảng biểu, lộ trình đường bay và các cảnh báo bất thường thời tiết/sân bay:
  - Cực kỳ chú trọng vào việc làm nổi bật độ lệch so với kế hoạch ban đầu (`Schedule Deviation / Operational Exceptions`).
  - Khối thông tin quan trọng nhất luôn được ghim hoặc nâng bậc hiển thị ở góc nhìn trung tâm, đi kèm bộ đếm lùi thời gian đến giờ khởi hành (`Time to Departure`).
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Áp dụng nguyên tắc "Tập trung vào ngoại lệ vận hành" (`Operational Exception Focus`): Đưa khối thông tin đoàn **T01 Hạ Long** lên thành một Banner Ưu tiên Khẩn cấp (`Urgent Priority Hero Module`) đặt ở vị trí thị giác cao nhất, hiển thị rõ số giờ còn lại (13 giờ 30 phút) và nguyên nhân tắc nghẽn dịch vụ.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sao chép bản đồ radar đen tối màu, các đường bay trắc địa cầu học hay thuật ngữ chuyên ngành hàng không phức tạp (METAR, NOTAM, waypoint) không thuộc ngữ cảnh lữ hành nội địa.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Hiện thực hóa trực tiếp lời hứa thương hiệu *"TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành"*, tương tự như cách nhân viên điều phái bay kiểm soát checklist kỹ thuật trước khi cấp phép cất cánh.

---

### Tham Chiếu 7: Linear Design Method — High-Density Keyboard & Status Clarity
- **URL**: `https://linear.app/method/design`
- **Observation (Điều quan sát được thực tế)**:
  Triết lý thiết kế phần mềm năng suất B2B hiện đại nổi tiếng với:
  - Mật độ thông tin cao (`High Information Density`) nhưng vẫn tạo cảm giác thông thoáng nhờ viền phân cách siêu mảnh (`Hairline Borders: 1px solid #E2E8F0`) và khoảng đệm vi mô chuẩn xác.
  - Hệ thống trạng thái công việc (`Workflow State Machine`) được gán màu và ký hiệu tinh giản, hỗ trợ thao tác liên tục bằng bàn phím mà không gây mỏi mắt.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Thiết lập ngôn ngữ bề mặt sắc sảo và kỷ luật phân tách thông tin: Sử dụng các đường viền siêu mảnh, typography tỷ lệ chuẩn, phân nhóm tour theo luồng xử lý (Cần xử lý, Đang chuẩn bị, Sẵn sàng, Hoàn thành), duy trì cảm giác chuyên nghiệp, tốc độ và hiện đại.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sử dụng chế độ nền đen (Dark Mode) mặc định của Linear; không dùng các hiệu ứng gradient tím/xanh phát sáng lấp lánh (vi phạm anti-personality); không lạm dụng các phím tắt ngầm gây khó khăn cho người dùng phổ thông.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Định hình phong thái kỹ thuật hiện đại cho bảng snapshot điều phối mà vẫn trung thành với nguyên tắc Giao diện Sáng Bất biến (`Light Theme Invariant`) của TRIPFLOW.

---

### Tham Chiếu 8: Magnum Photos — Dispatch Field Documentary Archive
- **URL**: `https://www.magnumphotos.com/`
- **Observation (Điều quan sát được thực tế)**:
  Kho lưu trữ ảnh tư liệu phóng sự hiện trường kinh điển thế giới:
  - Ghi nhận chân thực cuộc sống và công việc của con người lao động trong đời sống thực tế; sử dụng ánh sáng tự nhiên, góc máy ngang tầm mắt của người quan sát điềm tĩnh.
  - Tôn vinh vẻ đẹp của sự lao động, thao tác hiện trường mộc mạc thay vì tạo dáng nhân tạo hoặc chỉnh sửa màu sắc bão hòa quá đà.
- **Transfer Principle (Nguyên tắc có thể chuyển giao)**:
  Thiết lập tiêu chuẩn chỉ đạo nghệ thuật (`Art Direction Guidelines`) cho toàn bộ hình ảnh thuộc nhóm `Operational scene` và `Hero/context` trong **Direction A (Human Field Intelligence)**:
  - Thể hiện chân dung điều phối viên Lan và khung cảnh kiểm tra danh sách phòng, bến tàu Hạ Long lúc chập tối với ánh sáng chân thực, ấm áp.
  - Tuyệt đối loại bỏ ảnh người mẫu tươi cười giả tạo nhìn vào camera.
- **Copy Ban (Điều cấm tuyệt đối không sao chép)**:
  Không sử dụng hình ảnh chiến tranh, thảm họa, nghèo đói hay mang cảm xúc bi lụy, tiêu cực; không vi phạm bản quyền tác phẩm nghệ thuật của Magnum Photos.
- **TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)**:
  Là trụ cột nghệ thuật cốt lõi giúp Direction A truyền tải trọn vẹn sự thấu cảm nhân văn và tính chân thực của công việc điều phối lữ hành, tránh xa cái bẫy sử dụng ảnh brochure phong cảnh du lịch sáo rỗng.

---

## 3. Tổng Hợp Ma Trận Ánh Xạ Tham Chiếu Vào Module 12 (Reference Synthesis Matrix)

| Tham Chiếu (Reference) | Trục Chiến Lược Thụ Hưởng (Target Strategic Axis) | Vai Trò Trong Hai Hướng (Role in Directions) | Đóng Góp Vào Cổng Kiểm Soát (Gate Contribution) |
| :--- | :--- | :--- | :--- |
| **1. W3C Images Tutorial** | Accessibility & Image Semantics | Cả hai hướng (Dir A & Dir B) | **B03, B07, T08** |
| **2. W3C alt Decision Tree** | Text Equivalent & Screen Reader Logic | Cả hai hướng (Dir A & Dir B) | **B03, B07, T08** |
| **3. IBM Carbon Icon System** | Icon Geometry & 24x24 System Grid | Cả hai hướng (Dir A & Dir B) | **B04, T09** |
| **4. GOV.UK Design System** | Information Hierarchy & Contrast Tags | Cả hai hướng (Dir A & Dir B) | **B07, T11** |
| **5. SBB Dispatch System** | Cartographic Grid & Sequence Nodes | Trọng tâm **Direction B** | **B01, B03, T03** |
| **6. FlightAware Briefing** | Urgent Bottleneck Hero Placement | Cả hai hướng (Dir A & Dir B) | **B02, T04** |
| **7. Linear Design Method** | Modular Surface & Hairline Structure | Trọng tâm **Direction B** | **B01, B02, T03** |
| **8. Magnum Photos Archive** | Documentary Photography & Humanity | Trọng tâm **Direction A** | **B01, B03, T03** |

---

## 4. Kết Luận Bàn Giao (Handoff Conclusion)

Bảng 8 tham chiếu chuẩn mực trên đáp ứng 100% các tiêu chuẩn khắt khe nhất của Directive:
1. Đảm bảo đúng số lượng giới hạn: **Chính xác 8 mục tham chiếu**.
2. Phân tích sâu sắc, đa chiều, đầy đủ 5/5 trường dữ liệu bắt buộc cho từng mục.
3. Liên kết trực tiếp giữa nghiên cứu chuẩn mực quốc tế với bài toán điều phối tour B2B thực tế của TRIPFLOW, làm bệ phóng vững chắc cho Phase 2 (Two-Direction Prototypes).
