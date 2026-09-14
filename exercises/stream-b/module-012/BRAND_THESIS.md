# BRAND THESIS — TRIPFLOW Daily Departure Brief (Module 12)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng kiến trúc (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm nghiệp vụ (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)`  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: `Anh — Lead Architect / Product Owner`  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: `Em — Senior Engineering Agent / Lead Implementer`  
> **Không gian làm việc (Workspace)**: `design-training/stream-b/module-012/`  
> **Mốc thời gian quy chiếu (Anchor Timestamp)**: `13/09/2026 18:00 Asia/Ho_Chi_Minh` (ICT)  

---

## 1. Bối cảnh Sản phẩm & Tuyên Bố Bài Tập (Product Framing & Exercise Disclaimer)

### 1.1. Bối cảnh Nghiệp vụ (Business Context)
Hệ thống **TRIPFLOW Daily Departure Brief** là ứng dụng điều phối vận hành B2B (`B2B Operational Dispatch Briefing Tool`) phục vụ các doanh nghiệp du lịch lữ hành vừa và nhỏ (`SMEs`). Hệ thống kế thừa toàn bộ logic nghiệp vụ, 8 bộ dữ liệu tour chuẩn mục và các tương tác cốt lõi từ bản PASS Module 07, đồng thời tái thiết kế và nâng cấp toàn diện ngôn ngữ thương hiệu (`Brand Direction`) và ngôn ngữ hình ảnh (`Image Language`).

### 1.2. Tuyên bố Miễn trừ Bài tập Đào tạo (Exercise-Supported Boundaries Disclaimer)
> ⚠️ **Tuyên bố minh bạch (Transparency Disclosure)**: Mọi định vị thương hiệu, hồ sơ nhân vật điều phối Lan, các đối tác cung cấp dịch vụ và thông số vận hành trong tài liệu này được xây dựng cho **bài tập đào tạo thiết kế chuyên sâu (Design Training Exercise)**. Đây là lời hứa sản phẩm và các giả định vận hành phục vụ đào tạo nội bộ, không phải là tuyên bố thương mại đã qua kiểm nghiệm thực tế thị trường (`Exercise-supported product promise, not an empirically verified market claim`).

---

## 2. Hồ Sơ Người Dùng B2B Mục Tiêu (Audience Persona: B2B Operational Team)

### 2.1. Chân dung Người dùng Cốt lõi (Primary Persona)
- **Chức danh (Roles)**: Điều phối viên tour (`Tour Coordinators`) & Trưởng nhóm vận hành (`Operations Leads / Dispatch Managers`).
- **Môi trường làm việc (Work Environment)**:
  - Văn phòng điều hành nhộn nhịp, điện thoại và tin nhắn Zalo reo liên tục từ tài xế, hướng dẫn viên (`Tour Guides`), khách sạn đối tác và đại diện bến tàu.
  - Phải quản lý đồng thời từ 8 đến 15 đoàn tour khởi hành rải rác trong vòng 24–72 giờ tới.
  - Môi trường làm việc có tính gián đoạn cực cao (`High-interruption operational environment`): Người điều phối thường xuyên bị cắt ngang mạch suy nghĩ để xử lý các phát sinh khẩn cấp.
- **Nhu cầu Nhận thức Cốt lõi (Core Cognitive Needs)**:
  - **Nhận diện điểm nghẽn trong 5 giây (5-Second Bottleneck Spotting)**: Khi mở màn hình, người điều phối phải nhận biết ngay lập tức đoàn nào đang có sự cố, ai phụ trách, và nguyên nhân chưa sẵn sàng là gì mà không cần phải đọc qua các bảng số liệu rườm rà.
  - **Sự bình tâm trong áp lực (Cognitive Calm Under Pressure)**: Giao diện không được làm tăng thêm sự căng thẳng bằng màu sắc chói lọi, nhấp nháy hay bố cục lộn xộn. Hệ thống phải đóng vai trò như một khung tựa nhận thức (`Calm Cognitive Scaffolding`) giúp người điều phối làm chủ tình huống.

---

## 3. Lời Hứa Thương Hiệu Khóa Cứng (Locked Brand Promise)

> ### 🔒 *"TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."*  
> *(TRIPFLOW helps the operations team spot what is unprepared before departure time.)*

### 3.1. Ý nghĩa Biểu đạt Thị giác của Lời hứa (Visual Manifestation of the Promise)
1. **Ưu tiên sự chưa sẵn sàng (Prioritize Unpreparedness)**: Giao diện không cố gắng che giấu khuyết điểm hoặc tô vẽ màu hồng. Điểm nghẽn `Khách sạn chưa xác nhận 4 phòng` của đoàn khẩn cấp **T01 Hạ Long** được đẩy lên vị trí thị giác cao nhất (`Primary Visual Hierarchy`), thu hút sự chú ý tức thời.
2. **Hướng tới hành động khắc phục (Action-Oriented Framing)**: Mỗi cảnh báo chưa sẵn sàng luôn đi kèm người phụ trách cụ thể (Lan), thời gian còn lại (13 giờ 30 phút), và nút hành động trực tiếp (Xử lý xác nhận phòng / Liên hệ đối tác).
3. **Trung thực tuyệt đối (Absolute Operational Honesty)**: Không dùng số liệu làm đẹp giả tạo; trạng thái "Chờ đối tác" và "Thiếu hồ sơ" được thể hiện đàng hoàng, rõ ràng để đội ngũ cùng nhau tháo gỡ.

---

## 4. Bảng Ma Trận Tính Cách Nền Tảng & Thuộc Tính Cấm Kỵ (Personality Seeds vs. Anti-Personalities)

Directive Section 4.4 và 4.5 xác lập bộ 4 hạt giống tính cách (`4 Foundation Personality Seeds`) và 4 thuộc tính cấm kỵ khóa cứng (`4 Locked Anti-Personalities`). Bảng ma trận dưới đây định hình ranh giới thiết kế:

| Hạt Giống Tính Cách Nền Tảng (Personality Seed) | Biểu Đạt Thị Giác Bắt Buộc (Required Visual Expression) | Thuộc Tính Cấm Kỵ Khóa Cứng (Locked Anti-Personality) | Ranh Giới Loại Trừ Triệt Để (Strict Exclusion Boundary) |
| :--- | :--- | :--- | :--- |
| **1. Bình tĩnh (Calm)** | Sử dụng nền sáng ấm áp tự nhiên (`Warm Canvas: #FAF9F6`), khoảng thở hào phóng (`Generous Whitespace`), độ tương phản vừa vặn không gắt gỏng, loại bỏ hoàn toàn các hiệu ứng giật mắt hay chuyển động gây xao nhãng. | **Bảng điều khiển quân sự / Phòng chỉ huy (Military Command Center / Sci-Fi Terminal)** | Tuyệt đối cấm giao diện nền đen radar ma trận, chữ xanh lá dạ quang, đường viền neon, hoặc các ký hiệu tác chiến cơ mật tạo cảm giác chiến tranh, căng thẳng cực đoan. |
| **2. Chính xác (Precise)** | Phân cấp lưới vi mô dứt khoát, typography sắc nét chuẩn tỷ lệ modular, thông số thời gian rõ ràng (ngày, giờ, phút), nhãn trạng thái dùng ký hiệu hình học kép (Icon + Label rõ ràng). | **Sản phẩm AI tím–xanh phát sáng chung chung (Generic Glowing Purple-Blue AI SaaS)** | Tuyệt đối cấm hiệu ứng phát sáng neon (glow), gradient tím-xanh thời thượng vô nghĩa, kính mờ giả tạo (`glassmorphism`), hay các biểu tượng ngôi sao lấp lánh (sparkles) cẩu thả. |
| **3. Có chuẩn bị (Prepared)** | Hiển thị chuỗi hành trình mốc thời gian rõ ràng (`Route Sequence Timeline`), danh mục kiểm tra sẵn sàng (`Readiness Checklist`), dữ liệu dự phòng và trạng thái kết nối đối tác minh bạch. | **Khám phá du lịch / Phiêu lưu mạo hiểm (Adventure Discovery / Travel Postcard)** | Tuyệt đối cấm sử dụng ảnh phong cảnh du lịch brochure thương mại hào nhoáng, cấm hình ảnh núi non, la bàn, vali, máy bay hoạt hình vẽ sẵn kiểu giải trí cá nhân. |
| **4. Gần gũi với người làm vận hành (Approachable / Operator-Centric)** | Tôn vinh con người hiện trường thực tế; thể hiện điều phối viên Lan với avatar minh bạch giả lập; ngôn ngữ nhãn mộc mạc, thực tế và tôn trọng thao tác của người lao động. | **Hãng nghỉ dưỡng xa xỉ / Dashboard thành tích bịa đặt (Luxury Hospitality / Fabricated Vanity Dashboard)** | Tuyệt đối cấm phong cách khách sạn 5 sao hào nhoáng xa rời thực tế điều phối; cấm tự ý bịa đặt biểu đồ doanh thu tăng trưởng hàng triệu đô, giải thưởng giả tưởng. |

---

## 5. Tuyên Ngôn Thương Hiệu Hai Hướng (Two Strategic Thesis Statements)

Cả hai tuyên ngôn đều được kiểm soát độ dài nghiêm ngặt trong khoảng **từ 80 đến 140 từ** theo quy chuẩn tại Section 6 của Directive:

### 5.1. Tuyên ngôn Hướng A — Human Field Intelligence (Trí tuệ Thực địa Nhân văn)
> *"TRIPFLOW Human Field Intelligence định hình trải nghiệm điều phối tour thông qua lăng kính tôn trọng con người vận hành tại hiện trường. Thay vì giấu nhân sự sau các bảng tính khô khan, hệ thống đưa nhân vật điều phối giả lập Lan và đội ngũ hậu cần vào trung tâm của từng quyết định khởi hành. Với bố cục báo chí bất đối xứng, khoảng thở nhịp nhàng và đồ họa vector mô phỏng bối cảnh thực địa, giao diện thể hiện trung thực áp lực chuẩn bị tour mà không tô hồng du lịch. Từng điểm nghẽn của đoàn T01 Hạ Long được nhận diện điềm tĩnh, rõ ràng theo mục tiêu thiết kế DESIGN_INTENT nhằm hỗ trợ người làm vận hành hành động với sự tự tin và chuẩn bị chu đáo trước giờ xuất phát."*  
> 👉 **Số từ (Word Count)**: **133 từ** *(Thỏa mãn nghiêm ngặt tiêu chuẩn [80, 140] từ)*.

### 5.2. Tuyên ngôn Hướng B — Route Signal System (Hệ thống Tín hiệu Lộ trình)
> *"TRIPFLOW Route Signal System biến bảng điều phối thành một hệ thống tín hiệu lộ trình lữ hành chuẩn mực, nơi mọi mốc thời gian và điểm nghẽn vận hành được mã hóa bằng trật tự hình học trắc địa rõ ràng. Định hướng theo nghiệp vụ điều vận vận tải B2B (tuyệt đối không mang tính chất quân sự hay viễn tưởng), thiết kế sử dụng lưới 12 cột, kiểu chữ kỹ thuật sắc sảo và sơ đồ chuỗi mốc trực quan với mục tiêu thiết kế DESIGN_INTENT hỗ trợ người điều phối quét nhanh để khoanh vùng điểm nghẽn. Bằng việc phân tách rõ tín hiệu sẵn sàng và cảnh báo chờ đối tác của đoàn T01, hệ thống mang lại cảm giác kiểm soát bình tĩnh và minh bạch cho người dùng."*  
> 👉 **Số từ (Word Count)**: **132 từ** *(Thỏa mãn nghiêm ngặt tiêu chuẩn [80, 140] từ)*.

---

## 6. Bảng Ánh Xạ 8 Quyết Định Thị Giác (Visual Decision Mappings Table)

Bảng dưới đây liên kết trực tiếp từ luận điểm chiến lược (`Brand Thesis`) sang quyết định thiết kế (`Visual Decision`), lý do kiến trúc (`Rationale`), Token CSS, Phần tử DOM (`Selector`) và Bài kiểm chứng tự động (`Verification Test`) theo yêu cầu tại Section 6, Section 16 (B02) và Section 17 (T04):

| Mã (ID) | Luận Điểm Thương Hiệu (Thesis Mapping) | Quyết Định Thị Giác (Visual Decision) | Lý Do Kiến Trúc & Nghiệp Vụ (Design Rationale) | Thiết Kế Token (Design Token) | Phần Tử DOM Kiểm Chứng (DOM Selector) | Bài Kiểm Thử Liên Quan (Verification Test) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **VD_01** | Hạt giống Tính cách: **Bình tĩnh (Calm)** | Thiết lập nền giao diện màu sáng ấm nhã nhặn (`Warm Canvas Base`) thay cho màu trắng tinh lạnh lẽo hay nền đen. | Giảm căng thẳng thị giác cho điều phối viên khi theo dõi màn hình nhiều giờ liền; chống anti-personality phòng chỉ huy quân sự. | `--color-surface-base: #FAF9F6` | `body`, `.app-container` | **T11, T12** |
| **VD_02** | Hạt giống Tính cách: **Chính xác (Precise)** | Biểu đạt trạng thái vận hành bằng ký hiệu hình học kép: Icon riêng biệt kết hợp nhãn chữ và viền vi mô. | Bảo đảm khả năng tiếp cận WCAG 2.2 AA; không phụ thuộc đơn lẻ vào màu sắc; giúp người mù màu phân biệt chính xác. | `--badge-border-width: 1px`, `--badge-font-weight: 600` | `.status-badge`, `.status-badge__icon` | **T09, T11** |
| **VD_03** | Lời hứa Thương hiệu: **Nhìn thấy điều chưa sẵn sàng** | Khu vực cảnh báo khẩn cấp T01 Hạ Long được nâng bậc thị giác (`Elevated Urgent Hero Card`) với đường viền màu hổ phách ấm. | Đưa điểm nghẽn "Khách sạn chưa xác nhận 4 phòng" vào mắt người vận hành ngay trong 5 giây đầu tiên mà không gây hoảng loạn. | `--color-urgency-border: #D97706`, `--color-urgency-bg: #FFFBEB` | `#tour-focus-t01`, `.urgent-focus-module` | **T04, T06** |
| **VD_04** | Hạt giống Tính cách: **Gần gũi (Approachable)** | Thẻ điều phối viên Lan với avatar chân dung trang nhã kèm huy hiệu công bố minh bạch nhân vật giả lập. | Tôn trọng vai trò con người trong điều hành du lịch; tuân thủ đạo đức minh bạch thông tin; không mạo danh người thật. | `--avatar-size: 48px`, `--avatar-border-radius: 50%` | `.coordinator-card`, `.persona-badge` | **T04, T05** |
| **VD_05** | Hạt giống Tính cách: **Có chuẩn bị (Prepared)** | Sơ đồ chuỗi mốc lộ trình T01 (`Route Sequence Diagram`) thể hiện các điểm tiếp nhận, lưu trú và bến tàu. | Giúp đội ngũ nhìn rõ điểm đứt gãy trong quy trình chuẩn bị trước giờ khởi hành; kèm văn bản tương đương cho trợ thính. | `--diagram-track-stroke: 2px`, `--diagram-node-size: 16px` | `#route-sequence-diagram`, `.route-timeline` | **T04, T08** |
| **VD_06** | Chống Anti-Personality: **Không Xa Xỉ & Không Quân Sự** | Sử dụng hệ thống kiểu chữ không chân trung tính độ nét cao (`Neutral Sans-Serif System Font Stack`). | Truyền tải sự chính xác, mộc mạc, đáng tin cậy của công cụ nghiệp vụ; loại trừ hoàn toàn vẻ kiểu cách xa xỉ hay mã code quân sự. | `--font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | `html`, `.text-display` | **T04, T11** |
| **VD_07** | Chống Anti-Personality: **Không AI Tím-Xanh Phát Sáng** | Hệ biểu tượng vector đơn sắc tối giản 24x24 trên hệ lưới hình học đồng nhất, nét vẽ mảnh dứt khoát. | Loại bỏ hoàn toàn hiệu ứng phát sáng lòe loẹt, gradient tím thời thượng vô nghĩa; giữ trật tự thị giác tĩnh tuyệt đối. | `--icon-stroke-width: 1.75px`, `--icon-size-default: 20px` | `.tripflow-icon`, `.svg-symbol` | **T04, T09** |
| **VD_08** | Chống Anti-Personality: **Không Bịa Đặt Số Liệu / Đối Tác** | Bảng minh bạch nguồn gốc tài nguyên đồ họa (`Asset Provenance & Disclosure Panel`) có thể mở xem chi tiết. | Khẳng định tính trung thực của dữ liệu bài tập; không dùng logo đối tác thật; công khai nguồn gốc ảnh AI/Vector tự vẽ. | `--panel-disclosure-bg: #F1F5F9`, `--disclosure-font-size: 13px` | `#asset-disclosure-details`, `.provenance-section` | **T04, T05** |

---

## 7. Kết luận & Hướng Dẫn Thực Thi (Conclusion & Implementation Directives)

Tài liệu `BRAND_THESIS.md` này đóng vai trò là kim chỉ nam chiến lược bất biến cho toàn bộ Module 12:
1. Mọi thành phần giao diện trong hai bản mẫu nguyên mẫu (`directions/option_a/` và `directions/option_b/`) và bản ứng viên (`candidate/`) đều phải truy nguyên được về ít nhất một luận điểm trong tài liệu này.
2. Hai hướng thiết kế A và B sẽ cụ thể hóa hai lăng kính khác nhau của Brand Thesis (Nhân văn Hiện trường vs. Hệ thống Tín hiệu), nhưng cả hai đều phải tuyệt đối tôn trọng 4 personality seeds và 4 ranh giới cấm kỵ.
3. Bài kiểm thử tự động `T04 (Brand Traceability)` và Cổng chặn `B02` sẽ trực tiếp quét mã nguồn HTML/CSS để xác thực sự tồn tại của 8 quyết định thị giác đã cam kết trong bảng trên.
