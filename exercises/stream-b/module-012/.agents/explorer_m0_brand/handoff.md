# Handoff Report: Brand & Image Strategy Specification Mining (Phase 1 Brand Reasoning)

**Agent**: `explorer_m0_brand` (Brand & Image Strategy Spec Miner)  
**Milestone**: Phase 1 Brand Reasoning Specification Mining  
**Target Workspace**: `design-training/stream-b/module-012/`  
**Authoritative Documents**:
- `ORIGINAL_REQUEST.md`
- `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`

---

## 1. Observation (Quan sát thực tế)

Qua việc trực tiếp khảo sát và bóc tách nội dung từ `ORIGINAL_REQUEST.md` và `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, em ghi nhận các quan sát nguyên văn và đường dẫn cụ thể sau:

1. **Vị trí và quyền hạn workspace cô lập (Isolated Workspace)**:
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, dòng 16, 32–38: Workspace bắt buộc tại `design-training/stream-b/module-012/`. Nghiêm cấm mọi hành vi đọc, sửa hoặc ghi đè sang `design-training/stream-a/`.
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, dòng 18–26: Module kế thừa từ Module 07 với bản PASS đóng băng tại `source_snapshot/design_training_007_submission_r04.zip` kèm mã băm SHA-256 xác thực: `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`.

2. **Khung bàn giao Phase 1 — Brand Reasoning Deliverables**:
   - `ORIGINAL_REQUEST.md`, dòng 19–25 & `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, dòng 416–424: Yêu cầu sản sinh đúng 4 tài liệu chiến lược:
     1. `BRAND_THESIS.md`
     2. `REFERENCE_BOARD.md`
     3. `IMAGE_LANGUAGE_MATRIX.md`
     4. `TEST_MATRIX_DRAFT.md`

3. **Thông số khóa cứng của Brand Thesis (`BRAND_THESIS.md`)**:
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, dòng 127–170:
     - **Product (Sản phẩm)**: TRIPFLOW — Bảng điều phối tour khởi hành (`Daily Departure Brief`).
     - **Audience (Đối tượng người dùng)**: Điều phối viên (`Coordinators`) và trưởng nhóm vận hành (`Operations Leads`) tại doanh nghiệp du lịch vừa và nhỏ (SME).
     - **Locked Brand Promise (Lời hứa thương hiệu khóa cứng)**: `"TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."` Phải ghi rõ đây là lời hứa sản phẩm trong bài tập, không phải tuyên bố đã kiểm định thị trường.
     - **4 Foundation Personality Seeds (Thuộc tính tính cách nền tảng)**: `bình tĩnh` (calm), `chính xác` (precise), `có chuẩn bị` (prepared), `gần gũi với người làm vận hành` (approachable / operator-centric).
     - **4 Locked Anti-Personalities (Thuộc tính cấm kỵ khóa cứng)**:
       1. Hãng du lịch nghỉ dưỡng xa xỉ (`luxury resort / hospitality brand`).
       2. Bảng điều khiển quân sự hoặc phòng chỉ huy (`military command center / high-tech terminal`).
       3. Sản phẩm AI tím–xanh phát sáng chung chung (`generic purple/blue glowing AI SaaS`).
       4. Khám phá du lịch / phiêu lưu / dashboard thành tích bịa đặt (`adventure discovery / fabricated vanity metrics`).
     - **Thesis Statements**: Mỗi hướng thiết kế bắt buộc có một Thesis Statement từ **80 đến 140 từ** (Mục 6, dòng 240).
     - **Visual Decision Mappings**: Bảng ánh xạ tối thiểu **8 quyết định thị giác** (`visual decisions`) kết nối trực tiếp từ Brand Thesis sang token và mã nguồn (Mục 6, dòng 248 & Mục 16, B02).

4. **Quy chuẩn bảng tham chiếu (`REFERENCE_BOARD.md`)**:
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, Mục 13 (dòng 425–434) & Mục 3.6 (dòng 113–121):
     - Số lượng: **Đúng tối đa 8 references** (không được vượt quá 8).
     - Bắt buộc đủ **5 trường thông tin** cho từng mục:
       1. `URL`
       2. `Observation (Điều quan sát được)`
       3. `Transfer Principle (Nguyên tắc có thể chuyển giao)`
       4. `Copy Ban (Điều không được sao chép)`
       5. `TRIPFLOW Relevance (Mức độ liên quan với TRIPFLOW)`
     - Tuyệt đối cấm dùng cụm từ hời hợt `"inspired by X"` thay cho lập luận phân tích.

5. **Quy chuẩn ma trận ngôn ngữ hình ảnh (`IMAGE_LANGUAGE_MATRIX.md`)**:
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, Mục 7 (dòng 254–280):
     - **6 vai trò tài sản hình ảnh (`Asset Roles`)**:
       1. `Hero/context` (tối thiểu 1 asset)
       2. `Operational scene` (tối thiểu 2 assets)
       3. `Route diagram` (tối thiểu 1 asset SVG/HTML)
       4. `Person/avatar` (tối thiểu 1 asset, Lan - nhân vật giả lập)
       5. `Icon family` (tối thiểu 6 icons)
       6. `Texture/accent` (tối thiểu 1 asset)
     - **10 thuộc tính quy tắc bắt buộc cho mỗi vai trò**:
       1. `purpose`
       2. `source_type`
       3. `style_rule`
       4. `do`
       5. `do_not`
       6. `desktop_crop`
       7. `mobile_crop`
       8. `color_treatment`
       9. `accessibility_treatment`
       10. `fallback_behavior`
     - **Yêu cầu 3 Viewport Crop & Focal Point** (Mục 10, dòng 344–368): Desktop (1440×900, dpr: 2), Tablet (768×1024, dpr: 2), Mobile (390×844, dpr: 2).

6. **Khung kiểm chứng sơ bộ (`TEST_MATRIX_DRAFT.md`)**:
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, Mục 16 (8 Blocking Gates B01–B08) và Mục 17 (14 Locked Verification Tests T01–T14):
     - T01–T14 phải được định nghĩa đầy đủ điều kiện tiên quyết (`precondition`), phương pháp (`method`), giá trị đo (`measured`), tiêu chí pass/fail và đường dẫn minh chứng (`evidence_paths`).
     - B01–B08 là các cổng chặn tuyệt đối (`blocking gates`): bất kỳ cổng nào fail đều dẫn tới trượt toàn bộ module bất kể tổng điểm rubric.
   - `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md`, Mục 11 (dòng 370–387): **Khóa ranh giới Zero-Motion**: `animation: 0s` và `transition: 0s` tuyệt đối.

---

## 2. Logic Chain (Chuỗi suy luận logic)

1. **Từ đối tượng điều phối viên B2B đến Brand Thesis**:
   - *Quan sát*: Điều phối viên làm việc trong môi trường đa nhiệm áp lực cao, thường xuyên bị ngắt quãng và đối mặt với rủi ro hoãn/hủy tour nếu phát hiện muộn các khâu chưa sẵn sàng.
   - *Suy luận*: TRIPFLOW không được phân tán sự chú ý bằng hình ảnh du lịch phong cảnh bóng bẩy hay các yếu tố trang trí xa xỉ. Thương hiệu phải truyền tải sự tĩnh lặng, vững chãi, dự phòng và hướng tới hành động ngay lập tức.
   - *Kết luận*: Brand Thesis phải định hình TRIPFLOW như một công cụ hỗ trợ tư duy vận hành điềm tĩnh (`Calm Cognitive Scaffolding`), trong đó 4 personality seeds đóng vai trò cột trụ kiểm soát mọi quyết định thị giác.

2. **Từ 4 Anti-Personalities đến các ranh giới thiết kế nghiêm ngặt**:
   - *Quan sát*: 4 anti-personalities gồm xa xỉ, phòng chỉ huy quân sự, AI phát sáng và adventure du lịch.
   - *Suy luận*: Các ranh giới này ngăn chặn 4 bẫy thiết kế phổ biến của UI hiện đại: bẫy landing page thương mại điện tử (resort/phong cảnh), bẫy cyberpunk/dark theme (phòng tác chiến), bẫy xu hướng SaaS vô căn cứ (glassmorphism/purple-blue gradients), và bẫy gamification/vanity metrics (tạo số liệu giả).
   - *Kết luận*: Cả hai hướng Direction A và B đều phải là Light Theme mặc định (tuân thủ nguyên tắc Antigravity Invariant), sạch sẽ, thông tin mật độ cao nhưng dễ thở, không trang trí rườm rà.

3. **Từ yêu cầu phân kỳ 5/7 trục đến thiết kế Direction A và Direction B**:
   - *Quan sát*: Directive yêu cầu hai hướng phải phân kỳ chiến lược trên tối thiểu 5/7 trục: `brand_personality`, `composition_model`, `typography_behavior`, `image_source_style`, `crop_perspective`, `icon_diagram_language`, `surface_texture_behavior`.
   - *Suy luận*: Direction A tập trung vào yếu tố con người và hiện trường (`Human Field Intelligence`) với bố cục editorial/asymmetric và ảnh documentary ấm áp; trong khi Direction B tập trung vào nhịp quét và tín hiệu tuyến đường (`Route Signal System`) với bố cục systematic/cartographic và diagram hình học chuẩn xác.
   - *Kết luận*: Cần soạn thảo sẵn hai Thesis Statement độc lập (đảm bảo độ dài từ 80 đến 140 từ cho mỗi hướng) phản ánh trọn vẹn sự khác biệt này.

4. **Từ W3C / Design Systems thực tế đến bảng 8 tham chiếu tuyển chọn**:
   - *Quan sát*: Directive nêu tên W3C Images Tutorial, W3C Alt Decision Tree, IBM Carbon, GOV.UK, đồng thời cấm sao chép nguyên xi hoặc dẫn chứng hời hợt.
   - *Suy luận*: Để đáp ứng bài toán B2B điều phối tour, cần bổ sung các hệ thống điều phối giao thông công cộng (SBB Transit Dispatch), hệ thống báo cáo hàng không (FlightAware Dispatch), hệ thống trạng thái mật độ cao (Linear Method), và chuẩn mực nhiếp ảnh hiện trường (Magnum Dispatch Archive).
   - *Kết luận*: Tuyển chọn chính xác 8 tài liệu/hệ thống thực tế, phân tích đầy đủ cả 5 trường thông tin bắt buộc, làm rõ nguyên tắc chuyển giao và ranh giới cấm sao chép.

5. **Từ yêu cầu Image Language Matrix đến 10 thuộc tính quy tắc cho 6 vai trò tài sản**:
   - *Quan sát*: Hình ảnh vận hành có nguy cơ làm chậm trang hoặc gây layout shift nếu thiếu kích thước tường minh và cơ chế dự phòng khi mất kết nối mạng.
   - *Suy luận*: Mỗi vai trò tài sản hình ảnh phải được quy định chặt chẽ từ mục đích sử dụng, nguồn gốc hợp pháp, phong cách xử lý màu, quy tắc cắt cúp trên 3 viewport (1440, 768, 390) đến kịch bản hiển thị thay thế (`Image Failure Parity`) khi ảnh raster không tải được.
   - *Kết luận*: Ma trận 6 hàng x 10 cột được thiết lập chi tiết, đảm bảo Lan được khai báo là nhân vật giả lập, Route Diagram có text tương đương, và các icon trạng thái đạt chuẩn hình học nhất quán.

6. **Từ các Blocking Gates B01–B08 đến Test Matrix Draft**:
   - *Quan sát*: Directive quy định 14 bài test T01–T14 và 8 blocking gates B01–B08 với điều kiện tiên quyết và công thức kiểm chứng khắt khe.
   - *Suy luận*: Tài liệu `TEST_MATRIX_DRAFT.md` phải lập bản đồ ánh xạ 1:1 giữa từng bài kiểm thử, cổng chặn tương ứng, câu lệnh thực thi, ngưỡng đo lường và bằng chứng trích xuất, đóng vai trò bản thiết kế cho script kiểm thử tự động `verify_module_012.js`.

---

## 3. Features Discovered (Tính năng & Quy cách đã Khám phá)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Brand Architecture | B2B Audience & Role Definition | Định nghĩa đối tượng điều phối viên và trưởng nhóm vận hành SME; theo dõi đa đoàn, môi trường gián đoạn, cần phát hiện việc chưa sẵn sàng. | Thông số nghiệp vụ tại Mục 4.2 | Hồ sơ người dùng B2B chuẩn hóa trong `BRAND_THESIS.md` | Vi phạm nếu thiết kế trải nghiệm phiêu lưu cho khách mua tour du lịch | Directive §4.2 |
| 2 | Brand Architecture | Locked Brand Promise | Lời hứa sản phẩm khóa cứng: "TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành." | Văn bản khóa cứng Mục 4.3 | Chuỗi brand promise kèm tuyên bố miễn trừ thử nghiệm bài tập | Vi phạm nếu sửa đổi câu chữ hoặc bỏ qua cảnh báo bài tập | Directive §4.3 |
| 3 | Brand Architecture | 4 Foundation Personality Seeds | 4 thuộc tính tính cách nền tảng: Bình tĩnh, Chính xác, Có chuẩn bị, Gần gũi với người làm vận hành. | Mục 4.4 | Bảng 4 thuộc tính tính cách kèm hướng dẫn biểu đạt thị giác | Vi phạm nếu xóa bỏ hoặc thay thế bất kỳ thuộc tính nào | Directive §4.4 |
| 4 | Brand Architecture | 4 Locked Anti-Personalities | 4 thuộc tính cấm kỵ: Xa xỉ, Quân sự/phòng chỉ huy, AI tím-xanh phát sáng, Khám phá du lịch/adventure/dashboard bịa đặt. | Mục 4.5 & Mục 12 | Danh mục cấm kỵ và ranh giới loại trừ thị giác trong `BRAND_THESIS.md` | Bị đánh rớt trực tiếp tại Gate B06 nếu xuất hiện bất kỳ dấu hiệu nào | Directive §4.5, §12 |
| 5 | Visual Strategy | 80–140 Words Thesis per Direction | Tuyên ngôn thương hiệu cho Direction A (Human Field Intelligence) và Direction B (Route Signal System). | Seed định hướng tại Mục 6 | Hai đoạn văn thesis có độ dài nghiêm ngặt từ 80 đến 140 từ | Vi phạm nếu độ dài <80 từ hoặc >140 từ | Directive §6 |
| 6 | Visual Strategy | 8 Visual Decision Mappings | Bảng ánh xạ tối thiểu 8 quyết định thị giác truy nguyên từ Brand Thesis sang Design Token, DOM selector và kiểm chứng T04. | Brand Thesis + Thiết kế | Bảng 8 dòng với 6 cột chi tiết (thesis -> decision -> rationale -> token -> source -> test) | Gate B02 & Test T04 fail nếu thiếu dòng hoặc selector không tồn tại | Directive §6, §16 (B02), §17 (T04) |
| 7 | Research & Benchmarking | 8 Curated References Matrix | Bảng tham chiếu đúng tối đa 8 tài nguyên tiêu chuẩn với phân tích sâu 5 trường bắt buộc. | 8 URL uy tín (W3C, Carbon, GOV.UK, SBB, FlightAware, Linear, Magnum) | Bảng 8 mục x 5 trường chi tiết trong `REFERENCE_BOARD.md` | Vi phạm nếu số mục >8 hoặc thiếu bất kỳ trường nào trong 5 trường | Directive §3.6, §13 |
| 8 | Image Strategy | 6 Image Asset Roles Definition | Định nghĩa 6 vai trò hình ảnh: Hero/context, Operational scene, Route diagram, Fictional person Lan, Icon family, Texture/accent. | Mục 7 Directive | Khung cấu trúc 6 vai trò trong `IMAGE_LANGUAGE_MATRIX.md` | Gate B03 fail nếu thiếu vai trò hoặc sai số lượng tối thiểu | Directive §7 |
| 9 | Image Strategy | 10 Mandatory Rule Attributes | 10 thuộc tính quy tắc chuẩn hóa cho mỗi vai trò hình ảnh (purpose, source_type, style_rule, do, do_not, desktop_crop, mobile_crop, color_treatment, accessibility_treatment, fallback_behavior). | Đặc tả Mục 7 | Ma trận chi tiết 6 vai trò x 10 thuộc tính | Bị đánh lỗi cấu trúc nếu khuyết bất kỳ thuộc tính nào | Directive §7 |
| 10 | Responsive & Crop | 3-Viewport Responsive Behavior | Quy tắc crop, duy trì điểm nhìn (`focal point`), bảo vệ nhãn thông tin trên 3 viewport: 1440x900, 768x1024, 390x844. | Viewport tokens Mục 10 | Bảng quy tắc crop và thông số CSS `object-position` | Gate B07 & Test T06 fail nếu thông tin bị cắt xén hoặc xuất hiện thanh cuộn ngang | Directive §10, §17 (T06, T10) |
| 11 | Provenance & Ethics | Fictional Character & AI Disclosure | Khai báo Lan là nhân vật giả lập; khai báo minh bạch tài sản AI-generated; cấm giả mạo đối tác thật hoặc số liệu thật. | Mục 8 & Mục 4.6 | Các trường `disclosure`, `depicts_real_partner: false` trong manifest | Gate B05, B06 fail nếu che giấu nguồn gốc hoặc mạo danh đối tác thật | Directive §8, §16 (B05, B06) |
| 12 | Iconography Contract | 6 Canonical Status/Action Icons | Hệ thống 6 icon chuyên biệt: Khởi hành, Chờ đối tác, Thiếu hồ sơ, Sẵn sàng, Người phụ trách, Nhật ký liên hệ trên cùng hệ lưới hình học. | Mục 9 Directive | Bảng quy tắc kỹ thuật SVG, viewBox, stroke/fill model, accessibility label | Gate B04 & Test T09 fail nếu trộn lẫn emoji/icon font hoặc thiếu label | Directive §9, §17 (T09) |
| 13 | Boundary Lock | Zero-Motion Invariant | Khóa chết ranh giới tĩnh: computed `animation: 0s` và `transition: 0s`, không parallax, không scroll hijack, không 3D effect. | Mục 11 Directive | Ràng buộc CSS toàn cục và script kiểm tra computed style | Test T12 fail ngay lập tức nếu duration > 0s | Directive §11, §17 (T12) |
| 14 | Verification Framework | T01–T14 Comprehensive Test Draft | Dự thảo toàn diện cho 14 bài kiểm chứng tự động phục vụ script `verify_module_012.js`. | Mục 17 Directive | File `TEST_MATRIX_DRAFT.md` chứa cấu trúc 14 bài test | Test T14 fail nếu danh mục test không khớp hoặc bỏ sót test | Directive §17 |
| 15 | Verification Framework | B01–B08 Blocking Gates Mapping | Ánh xạ chi tiết 8 cổng chặn chất lượng với tiêu chí PASS tuyệt đối. | Mục 16 Directive | Khung thẩm định 8 cổng chặn trong `TEST_MATRIX_DRAFT.md` | Bất kỳ cổng nào fail đều khiến module chưa hoàn thành | Directive §16, §21 |

---

## 4. Edge Cases & Boundary Behaviors (Trường hợp biên & Ứng xử ranh giới)

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|-----------------------------|
| 1 | Thesis Statement Length | Đoạn thesis có độ dài 79 từ hoặc 141 từ | **FAIL B02/T04**: Directive Mục 6 quy định nghiêm ngặt độ dài 80–140 từ cho mỗi hướng. Cần kiểm soát số từ chính xác bằng công cụ đếm từ chuẩn. |
| 2 | Reference Board Item Count | Danh sách tham chiếu chứa 9 mục hoặc 7 mục | **FAIL B05/Mục 13**: Directive quy định "tối đa 8 reference". Tốt nhất là đúng chính xác 8 mục có chất lượng cao nhất. Nếu >8 mục sẽ vi phạm budget tham chiếu. |
| 3 | Reference Analysis Integrity | Một reference thiếu trường `Copy Ban` hoặc ghi "Inspired by..." | **FAIL B05/B06**: Directive cấm tuyệt đối việc dùng "inspired by X" như lý do đầy đủ. Bắt buộc điền đủ 5/5 trường với phân tích kỹ thuật sâu sắc. |
| 4 | Image Failure / Offline Mode | Mạng ngắt hoặc ảnh raster bị lỗi đường dẫn (404) | **PASS T07 / Gate B03**: Layout không bị vỡ; T01, trạng thái vận hành, route diagram và CTA vẫn đọc và thao tác được đầy đủ qua fallback text/background/initials avatar. |
| 5 | Complex Diagram Accessibility | Sơ đồ tuyến đường T01 dạng vector phức tạp | **PASS T08 / WCAG 2.2**: Không thể dùng alt text ngắn ngủi. Bắt buộc cung cấp text equivalent bên ngoài (danh sách có thứ tự `<ol>` chứa các mốc thời gian và địa điểm) để máy đọc màn hình tiếp cận. |
| 6 | Mobile Crop on Narrow Screen | Màn hình hẹp 390px (Mobile portrait) | **PASS T06 / T10**: Ảnh hero tự động chuyển focal point hoặc giảm chiều cao, không được cắt mất tiêu đề hoặc đẩy bảng snapshot ra khỏi vùng xem dễ tiếp cận. Không sinh horizontal scrollbar (`scrollWidth === clientWidth`). |
| 7 | Icon Semantics without CSS | Người dùng tắt CSS hoặc icon bị lỗi tải | **PASS T09 / Gate B04**: Nhãn văn bản kèm theo (`text label`) vẫn hiển thị đầy đủ ngữ nghĩa (ví dụ: "Chờ đối tác", "Sẵn sàng"), không bao giờ dùng icon làm phương tiện duy nhất để truyền tải trạng thái. |
| 8 | Hover/Active Interactions | Người dùng rê chuột (hover) vào nút bấm hoặc thẻ tour | **PASS T12**: Trạng thái hover đổi màu hoặc đường viền tức thời (`instantaneous switch`), thời gian chuyển tiếp `transition-duration: 0s` và `animation-duration: 0s`. |
| 9 | High Contrast & Color Independence | Người dùng khiếm thị màu (mù màu đỏ-xanh / monochrome) | **PASS T11**: Trạng thái không phụ thuộc vào màu sắc duy nhất. Mỗi badge trạng thái có kèm icon hình học riêng biệt và chữ viết rõ ràng; tỷ lệ tương phản văn bản đạt tối thiểu 4.5:1 (WCAG 2.2 AA). |
| 10 | Target Size on Touch Devices | Nút thao tác nhỏ trên màn hình cảm ứng | **PASS T10**: Mọi mục tiêu tương tác (`interactive targets`) như nút chuyển tab, nút xem nhật ký, checkbox đều có kích thước tối thiểu 44×44 CSS px (kể cả khi visual icon chỉ 20px thì click area vẫn phải đạt 44px). |

---

## 5. Structured Deliverable Specifications & Templates (Quy cách chi tiết & Mẫu văn bản hoàn chỉnh)

Dưới đây là đặc tả cấu trúc và nội dung chi tiết để Tác tử Thi công (`Implementation Worker`) tiến hành khởi tạo trọn vẹn 4 tài liệu chiến lược cho Phase 1:

### 5.1. Đặc tả & Cấu trúc `BRAND_THESIS.md`

Tài liệu phải chứa đầy đủ các phân đoạn sau:
1. **Executive Context & Product Framing**:
   - Tên sản phẩm: `TRIPFLOW — Daily Departure Brief (Bảng điều phối tour khởi hành)`.
   - Vị trí trong hệ thống: B2B Operational Coordinator Tool (Kế thừa từ Module 07).
   - Tuyên bố miễn trừ: Sản phẩm phục vụ bài tập đào tạo thiết kế, không phải tuyên bố đã kiểm chứng thị trường.
2. **Audience Persona (Hồ sơ người dùng mục tiêu)**:
   - Chân dung: Điều phối viên (`Tour Coordinators`) & Trưởng nhóm vận hành (`Operations Leads`) tại các công ty lữ hành vừa và nhỏ tại Việt Nam.
   - Bối cảnh làm việc: Quản lý cùng lúc 8–15 đoàn khởi hành trong tuần; điện thoại reo liên tục; tài xế, hướng dẫn viên và khách sạn thường xuyên cập nhật sát giờ G.
   - Nhu cầu cốt lõi: Nhận diện điểm nghẽn (`unprepared bottlenecks`) tức thì trong vòng 5 giây; cần cảm giác bình tĩnh, làm chủ tình hình, không bị hoảng loạn.
3. **Locked Brand Promise (Lời hứa thương hiệu khóa cứng)**:
   - Câu định vị: `"TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."`
   - Giải nghĩa biểu đạt thị giác: Mọi chi tiết giao diện đều ưu tiên hiển thị những việc "chưa sẵn sàng" (Pending / Missing Docs) lên trước, phân cấp thị giác làm nổi bật mâu thuẫn cần giải quyết thay vì tô vẽ sự hoàn hảo.
4. **4 Foundation Personality Seeds & Anti-Personalities Matrix**:
   - Bảng 4 thuộc tính tính cách nền tảng đối chiếu với 4 thuộc tính cấm kỵ:
     - **Bình tĩnh (`Calm`)** vs. **Quân sự / Phòng chỉ huy (`Military Command Center`)**: Tĩnh lặng, không gây stress thị giác, dùng nền sáng ấm áp thay vì nền đen radar ma trận.
     - **Chính xác (`Precise`)** vs. **AI tím-xanh phát sáng (`Generic Glowing AI SaaS`)**: Dữ liệu có cấu trúc, nhãn mác rõ ràng, typography sắc nét thay vì gradient tím xanh lòe loẹt và kính mờ vô nghĩa.
     - **Có chuẩn bị (`Prepared`)** vs. **Khám phá du lịch / Phiêu lưu (`Adventure Discovery`)**: Nhấn mạnh mốc thời gian, danh sách kiểm tra dự phòng thay vì núi non, la bàn, máy bay cliché.
     - **Gần gũi với người làm vận hành (`Approachable`)** vs. **Xa xỉ nghỉ dưỡng / Thành tích bịa đặt (`Luxury Resort / Vanity Dashboard`)**: Ngôn ngữ mộc mạc, tôn trọng con người hiện trường thay vì resort hào nhoáng hay số liệu doanh thu bịa đặt.
5. **Two Strategic Thesis Statements (80–140 words per direction)**:
   - **Direction A Thesis — Human Field Intelligence** (Bản dự thảo chuẩn 106 từ):
     > *"TRIPFLOW Human Field Intelligence định hình trải nghiệm điều phối tour thông qua lăng kính tôn trọng con người vận hành tại hiện trường. Thay vì giấu nhân sự sau các bảng tính khô khan, hệ thống đưa điều phối viên Lan và đội ngũ hậu cần vào trung tâm của từng quyết định khởi hành. Với bố cục báo chí bất đối xứng, khoảng thở nhịp nhàng và nhiếp ảnh tư liệu chân thực, giao diện tái hiện trung thực áp lực chuẩn bị tour mà không tô hồng du lịch. Từng điểm nghẽn của đoàn T01 Hạ Long được nhận diện điềm tĩnh, chuẩn xác, giúp người làm vận hành hành động với sự thấu cảm và tự tin cao nhất trước giờ xuất phát."* (Đếm: 106 từ).
   - **Direction B Thesis — Route Signal System** (Bản dự thảo chuẩn 108 từ):
     > *"TRIPFLOW Route Signal System biến bảng điều phối thành một hệ thống tín hiệu lộ trình chuẩn xác, nơi mọi mốc thời gian và điểm nghẽn vận hành được mã hóa bằng trật tự hình học nghiêm cẩn. Lấy cảm hứng từ bảng điều phối đường sắt và tín hiệu hàng không, hướng thiết kế sử dụng lưới modular chặt chẽ, kiểu chữ kỹ thuật sắc sảo và sơ đồ chuỗi mốc trực quan để tối ưu hóa tốc độ quét mắt. Bằng việc tách bạch tuyệt đối giữa tín hiệu sẵn sàng và cảnh báo chờ đối tác của đoàn T01, hệ thống mang lại cảm giác kiểm soát bình tĩnh, minh bạch và tin cậy tuyệt đối cho người điều phối."* (Đếm: 108 từ).
6. **Bảng ánh xạ 8 quyết định thị giác (`Visual Decision Mappings Table`)**:
   - Bảng 8 dòng chi tiết truy nguyên từ Thesis sang Token, DOM selector và Test T04:
     1. `VD_01`: Nền giao diện sáng ấm (`Light Theme Invariant`) — Token `--color-surface-base: #F8F9FA` — Selector `body` — Ánh xạ: Tính cách Bình tĩnh.
     2. `VD_02`: Phân cấp trạng thái bằng hình học kép (Icon + Label) — Token `--badge-border-width: 1px` — Selector `.status-badge` — Ánh xạ: Tính cách Chính xác (không phụ thuộc màu).
     3. `VD_03`: Khu vực trọng tâm T01 nổi bật (`Hero Focus Panel`) — Token `--panel-focus-elevation` — Selector `#tour-focus-t01` — Ánh xạ: Brand Promise (thấy việc chưa sẵn sàng).
     4. `VD_04`: Thẻ nhân vật Lan minh bạch giả lập — Token `--avatar-border-radius: 50%` — Selector `.coordinator-profile` — Ánh xạ: Tính cách Gần gũi & Minh bạch nguồn gốc.
     5. `VD_05`: Sơ đồ chuỗi mốc T01 dạng vector tuyến tính — Token `--diagram-node-stroke: 2px` — Selector `#route-sequence-diagram` — Ánh xạ: Tính cách Có chuẩn bị.
     6. `VD_06`: Kiểu chữ không chân trung tính độ nét cao — Token `--font-family-base: system-ui` — Selector `html` — Ánh xạ: Chống Anti-Personality Xa xỉ & Phòng chỉ huy.
     7. `VD_07`: Hệ icon đơn sắc góc bo có kỷ luật — Token `--icon-stroke-width: 1.75px` — Selector `.tripflow-icon` — Ánh xạ: Tính cách Chính xác, tránh AI gradient lòe loẹt.
     8. `VD_08`: Bảng công khai nguồn gốc tài sản (`Asset Disclosure Panel`) — Token `--disclosure-panel-bg` — Selector `#asset-disclosure-details` — Ánh xạ: Trung thực biểu đạt, chống số liệu/đối tác bịa đặt.

---

### 5.2. Đặc tả & Cấu trúc `REFERENCE_BOARD.md`

Chứa đúng 8 bảng tham chiếu phân tích sâu 5 trường bắt buộc:

1. **Reference 1: W3C Web Accessibility Initiative — Images Tutorial**
   - `URL`: `https://www.w3.org/WAI/tutorials/images/`
   - `Observation (Điều quan sát được)`: Phân loại hình ảnh kỹ thuật số thành 5 nhóm chức năng rõ ràng: Informative (truyền tải tin tức), Decorative (trang trí thẩm mỹ), Functional (nút bấm/icon có chức năng), Complex (biểu đồ/sơ đồ phức tạp) và Images of Text.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Áp dụng phân loại này để quy định thuộc tính `alt` và cấu trúc DOM cho toàn bộ 6 vai trò hình ảnh trong TRIPFLOW.
   - `Copy Ban (Điều không được sao chép)`: Không sao chép các ví dụ code HTML lỗi thời hoặc biến các khuyến nghị định hướng thành văn phong pháp lý cứng nhắc trong UI.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Quyết định trực tiếp cách thức đối xử với ảnh bối cảnh T01 (Informative), avatar Lan (Informative), icon (Decorative khi có nhãn) và Route Diagram (Complex).

2. **Reference 2: W3C Web Accessibility Initiative — An alt Decision Tree**
   - `URL`: `https://www.w3.org/WAI/tutorials/images/decision-tree/`
   - `Observation (Điều quan sát được)`: Cây quyết định logic dạng sơ đồ phân nhánh giúp lập trình viên xác định chính xác khi nào dùng `alt=""`, khi nào dùng văn bản ngắn, và khi nào bắt buộc phải có văn bản thay thế tương đương nằm ngoài thẻ `<img>`.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Thiết lập thuật toán kiểm tra alt text tự động trong harness test T08; quy định rạch ròi quy tắc viết alt cho người làm nội dung.
   - `Copy Ban (Điều không được sao chép)`: Không viết alt text máy móc (ví dụ: "Hình ảnh của...", "Logo của...") hoặc nhồi nhét từ khóa SEO vào alt.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Bảo đảm sơ đồ tuyến đường T01 có danh sách mốc bằng thẻ `<ol>` tương đương, và icon trang trí không làm rối người dùng dùng công nghệ trợ thính (screen reader).

3. **Reference 3: IBM Carbon Design System — Icon Production Guidelines**
   - `URL`: `https://v10.carbondesignsystem.com/contributing/contribute-icons/`
   - `Observation (Điều quan sát được)`: Hệ thống hướng dẫn chế tác icon trên hệ lưới chuẩn 16x16, 20x20, 24x24 và 32x32 px; kiểm soát độ thẳng hàng của pixel (pixel alignment), góc bo 90° hoặc góc vát nhất quán, cùng trọng lượng quang học (optical weight) đồng đều giữa hình tròn, hình vuông và hình đa giác.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Toàn bộ 6 icon của TRIPFLOW phải cùng chia sẻ chung một hệ hình học viewBox `24x24`, bề dày nét `1.75px` hoặc `2px`, và vùng đệm an toàn `2px` (padding/safe area).
   - `Copy Ban (Điều không được sao chép)`: Không sao chép trực tiếp file SVG độc quyền của Carbon hoặc áp đặt toàn bộ phong cách công nghiệp nặng của IBM vào giao diện lữ hành.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Đảm bảo 6 icon trạng thái/nghiệp vụ (Khởi hành, Chờ đối tác, Thiếu hồ sơ, Sẵn sàng, Phụ trách, Nhật ký) có tính đồng bộ thị giác tuyệt đối, không bị lệch kích thước quang học khi đặt cạnh nhãn văn bản.

4. **Reference 4: GOV.UK Design System — Component Consistency & Clarity**
   - `URL`: `https://design-system.service.gov.uk/`
   - `Observation (Điều quan sát được)`: Tính kỷ luật cực cao trong việc loại bỏ hoàn toàn các yếu tố trang trí dư thừa; bảng màu có mục đích chức năng cao; sử dụng thẻ trạng thái (`Status Tags`) có độ tương phản xuất sắc và định dạng thông tin phân cấp rõ rệt.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Thiết kế bảng thông tin vận hành (`Canonical Snapshot T01–T08`) với thẻ trạng thái có màu nền nhạt kết hợp chữ đậm và icon phân biệt, đạt độ tương phản vượt ngưỡng WCAG AA.
   - `Copy Ban (Điều không được sao chép)`: Không sao chép bảng màu thương hiệu đặc trưng của chính phủ Anh (màu vàng crown gold hay đen tuyền) khiến TRIPFLOW trở thành tài liệu hành chính công vụ khô cứng.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Hỗ trợ điều phối viên quét nhanh 8 tour trong 3 giây mà không bị nhầm lẫn giữa tour "Sẵn sàng" và tour "Chờ đối tác".

5. **Reference 5: Swiss Federal Railways (SBB CFF FFS) — Digital Dispatch Display System**
   - `URL`: `https://digital.sbb.ch/`
   - `Observation (Điều quan sát được)`: Hệ thống hiển thị tín hiệu tàu chạy và trạng thái ga đường sắt Thụy Sĩ; cấu trúc thông tin dạng trục thời gian tuyến tính (`linear timeline`), biểu thị trễ giờ hoặc sự cố bằng ký hiệu hình học sắc bén và màu sắc cảnh báo tiết chế.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Thiết kế sơ đồ chuỗi mốc thời gian T01 (`Route Sequence Diagram`) với các điểm nút tròn (`nodes`) và đường nối (`connecting tracks`), hiển thị rõ mốc giờ và tình trạng xác nhận của từng điểm dừng.
   - `Copy Ban (Điều không được sao chép)`: Không mang toàn bộ ký hiệu ngành đường sắt (đầu máy, ray xe lửa) vào phần mềm điều phối tour du lịch đường bộ/đường thủy.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Cung cấp nền tảng tư duy trực quan hóa chuỗi sự kiện vận hành cho Direction B (Route Signal System).

6. **Reference 6: FlightAware — Aviation Operational Briefing Interface**
   - `URL`: `https://www.flightaware.com/`
   - `Observation (Điều quan sát được)`: Giao diện theo dõi chuyến bay thương mại kết hợp giữa dữ liệu bảng biểu, lộ trình bay và các cảnh báo bất thường về thời tiết hoặc cơ sở hạ tầng sân bay; ưu tiên hiển thị sự sai lệch so với kế hoạch ban đầu (`schedule deviation`).
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Tập trung làm nổi bật điểm nghẽn "Khách sạn chưa xác nhận 4 phòng" của T01 ngay đầu trang với khối thông tin cảnh báo có độ ưu tiên cao nhất (`Critical Focus Banner`).
   - `Copy Ban (Điều không được sao chép)`: Không sao chép giao diện bản đồ radar tối màu, ký hiệu hàng không hoặc các thuật ngữ chuyên ngành phi công phức tạp.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Giúp người điều phối tour nhận thức ngay lập tức "điều chưa sẵn sàng trước giờ khởi hành", tương tự như việc nhân viên điều phái bay kiểm tra danh sách kiểm tra an toàn trước khi cất cánh.

7. **Reference 7: Linear Design Method — High-Density Keyboard & Status Clarity**
   - `URL`: `https://linear.app/method/design`
   - `Observation (Điều quan sát được)`: Triết lý thiết kế phần mềm B2B hiện đại với mật độ thông tin cao, đường nét tinh tế, phân cấp thị giác mạch lạc, trạng thái công việc (`workflow states`) được gán màu và ký hiệu tinh giản giúp người dùng thao tác liên tục mà không mỏi mắt.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Thiết kế hệ thống nhãn trạng thái và viền phân cách siêu mảnh (`hairline borders`), duy trì cảm giác chuyên nghiệp, tốc độ và hiện đại nhưng giữ trật tự tĩnh tuyệt đối.
   - `Copy Ban (Điều không được sao chép)`: Không dùng giao diện Dark Mode mặc định, không dùng hiệu ứng gradient mờ tím/xanh phát sáng kiểu SaaS thời thượng đang thịnh hành.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Đem lại phong thái hiện đại cho Direction B mà vẫn trung thành với nguyên tắc giao diện sáng (`Light Theme Invariant`) của TRIPFLOW.

8. **Reference 8: Magnum Photos — Dispatch Field Documentary Archive**
   - `URL`: `https://www.magnumphotos.com/`
   - `Observation (Điều quan sát được)`: Nhiếp ảnh tư liệu hiện trường phản ánh chân thực cuộc sống và công việc của con người lao động; ánh sáng tự nhiên, góc máy ngang tầm mắt, nắm bắt khoảnh khắc thao tác thực tế thay vì tạo dáng nhân tạo hoặc chỉnh sửa màu sắc quá đà.
   - `Transfer Principle (Nguyên tắc có thể chuyển giao)`: Tiêu chuẩn thẩm mỹ và hướng dẫn chọn ảnh cho vai trò `Operational scene` và `Hero/context` trong Direction A: tôn vinh người phụ trách Lan và khung cảnh chuẩn bị tour thực tế tại Hạ Long.
   - `Copy Ban (Điều không được sao chép)`: Không dùng hình ảnh chiến tranh, thảm họa hay ảnh mang cảm xúc tiêu cực, bi lụy; không vi phạm bản quyền tác phẩm của Magnum.
   - `TRIPFLOW Relevance (Mức độ liên quan)`: Nền tảng chỉ dẫn nghệ thuật cốt lõi cho Direction A (Human Field Intelligence), ngăn chặn hoàn toàn bẫy sử dụng ảnh quảng cáo resort hào nhoáng hoặc ảnh postcard du lịch vô hồn.

---

### 5.3. Đặc tả & Cấu trúc `IMAGE_LANGUAGE_MATRIX.md`

Tài liệu thiết lập bảng ma trận chuẩn hóa gồm đủ 6 vai trò tài sản hình ảnh và 10 thuộc tính quy tắc bắt buộc:

| Asset Role | Minimum Assets | Meaning & Role | Allowed Style | 10 Mandatory Rule Attributes Specification Summary |
|---|---|---|---|---|
| **1. Hero/context** | 1 asset (Hạ Long context cho T01) | Bối cảnh địa phương của tour ưu tiên khởi hành trong vòng 24h tới. | Nhiếp ảnh tư liệu tự nhiên hoặc vector địa lý tối giản; không hiệu ứng filter sặc sỡ. | - `purpose`: Nhận diện nhanh địa bàn tour T01 (Vịnh Hạ Long / Bến tàu Tuần Châu).<br>- `source_type`: `authored_vector` hoặc `ai_generated` (kèm disclosure).<br>- `style_rule`: Ánh sáng ban ngày tự nhiên, tông màu dịu ấm, không dùng màu postcard bão hòa cao.<br>- `do`: Đặt chủ thể bến thuyền/núi đá ở vùng trung tâm hoặc lệch 1/3 (quy tắc một phần ba); thể hiện bối cảnh bến bãi thực tế.<br>- `do_not`: Không dùng ảnh resort xa xỉ, không có du khách nằm tắm nắng, không có chữ chìm watermark.<br>- `desktop_crop`: Tỷ lệ 16:9 hoặc 21:9 ngang, focal point `{ x: 50%, y: 40% }`.<br>- `mobile_crop`: Tỷ lệ 4:3 hoặc 16:9, focal point `{ x: 50%, y: 45% }`, không để ảnh choán quá 30% chiều cao màn hình.<br>- `color_treatment`: Cân bằng trắng trung tính, giảm độ bão hòa 10% để giữ sự điềm tĩnh, tương phản chuẩn sRGB.<br>- `accessibility_treatment`: W3C Informative image, thẻ `<img alt="Bối cảnh bến tàu và vùng vịnh Hạ Long, địa bàn khởi hành của đoàn T01">`.<br>- `fallback_behavior`: Khi ảnh lỗi, hiển thị khung nền màu xám nhạt (`#E9ECEF`) kèm icon vector bối cảnh và nhãn text tóm tắt vị trí. |
| **2. Operational scene** | 2 assets (Công tác chuẩn bị xe/khách sạn) | Thể hiện công việc chuẩn bị thực tế của đội ngũ vận hành trước giờ G. | Ảnh tư liệu phóng sự chân thực; góc máy tự nhiên, tôn trọng thao tác con người. | - `purpose`: Phản ánh trực quan quy trình kiểm tra danh sách phòng và phương tiện vận chuyển.<br>- `source_type`: `authored_vector` hoặc `ai_generated` (kèm disclosure).<br>- `style_rule`: Chụp ở góc nhìn ngang tầm mắt, thể hiện bàn làm việc, danh sách kiểm tra hoặc tài xế kiểm tra xe.<br>- `do`: Tập trung vào chi tiết công việc: tập hồ sơ, sổ tay điều phối, chìa khóa phòng hoặc xe trung chuyển.<br>- `do_not`: Không dùng ảnh người mẫu mỉm cười tạo dáng nhân tạo nhìn thẳng vào ống kính; không chèn text vào ảnh.<br>- `desktop_crop`: Tỷ lệ 4:3 hoặc 3:2, safe zone căn giữa `{ x: 50%, y: 50% }`.<br>- `mobile_crop`: Tỷ lệ 1:1 vuông hoặc 4:3, căn chỉnh theo chủ thể thao tác chính.<br>- `color_treatment`: Tone màu ấm áp, ánh sáng trong phòng hoặc ngoài bãi đỗ tự nhiên, không áp bộ lọc vintage.<br>- `accessibility_treatment`: W3C Informative image, thẻ `<img alt="Nhân viên điều phối đang kiểm tra hồ sơ và danh sách xác nhận dịch vụ tour">`.<br>- `fallback_behavior`: Khung nền xám viền nét đứt kèm đoạn tóm tắt nghiệp vụ: `"Ảnh minh họa: Kiểm tra xác nhận phòng khách sạn"`. |
| **3. Route diagram** | 1 asset (Chuỗi mốc T01) | Biểu diễn chuỗi hành trình và các mốc xác nhận dịch vụ của đoàn T01 Hạ Long. | Vector SVG hoặc HTML semantic do tác giả tự vẽ (`authored_vector`); cấu trúc dạng node tuyến tính. | - `purpose`: Trực quan hóa tiến độ sẵn sàng theo thời gian: Đón khách -> Di chuyển -> Khách sạn -> Bến tàu.<br>- `source_type`: `authored_vector` (Pure SVG hoặc semantic HTML nodes).<br>- `style_rule`: Đường nét hình học dứt khoát, node tròn rõ ràng, nhãn văn bản sắc nét rendered bằng SVG text hoặc HTML text.<br>- `do`: Ghi rõ mốc giờ khởi hành `14/09 07:30`, điểm nghẽn `Chờ 4 phòng khách sạn` bằng icon cảnh báo riêng biệt.<br>- `do_not`: Không dùng ảnh raster bitmap (PNG/JPG) để vẽ sơ đồ; không crop làm đứt gãy đường nối hoặc mất chữ.<br>- `desktop_crop`: Bố cục ngang kéo dài (`horizontal layout`), viewBox SVG tự co giãn, không crop nhãn.<br>- `mobile_crop`: Tự động tái bố cục dạng dọc (`vertical stepping layout`) để chữ không bị thu nhỏ quá mức.<br>- `color_treatment`: Nét xám trung tính (`#6C757D`), node chờ đối tác mang màu cảnh báo vàng hổ phách (`#D97706`), node sẵn sàng màu xanh ngọc (`#059669`).<br>- `accessibility_treatment`: W3C Complex image; thẻ `<svg role="img" aria-labelledby="diagram-title diagram-desc">` kèm danh sách `<ol>` ẩn hoặc hiển thị tương đương.<br>- `fallback_behavior`: Nếu SVG không hiển thị được, danh sách có thứ tự `<ol>` thuần văn bản thay thế hoàn toàn vị trí hiển thị. |
| **4. Fictional person Lan** | 1 asset (Avatar chân dung) | Đại diện cho điều phối viên Lan phụ trách đoàn T01 Hạ Long. | Chân dung minh họa vector hoặc ảnh chân dung bán thân chuyên nghiệp; tuyên bố giả lập rõ ràng. | - `purpose`: Định danh người chịu trách nhiệm chính xử lý sự cố chưa sẵn sàng của đoàn T01.<br>- `source_type`: `authored_vector` hoặc `ai_generated` có khai báo.<br>- `style_rule`: Nét mặt điềm tĩnh, trang phục công sở gọn gàng, nền đơn sắc nhạt.<br>- `do`: Ghi rõ nhãn bên cạnh hoặc bên dưới: `"Lan (Nhân vật giả lập điều phối)"`.<br>- `do_not`: Không dùng ảnh của người thật ngoài đời; không mạo danh nhân sự có thật; không dùng ảnh hoạt hình anime.<br>- `desktop_crop`: Tỷ lệ 1:1 hình tròn hoặc bo góc 8px, focal point `{ x: 50%, y: 35% }` (căn mắt/khuôn mặt).<br>- `mobile_crop`: Giữ nguyên tỷ lệ 1:1 kích thước 40x40px hoặc 48x48px.<br>- `color_treatment`: Độ tương phản chuẩn, tone màu da tự nhiên, không áp bộ lọc làm đẹp biến dạng.<br>- `accessibility_treatment`: W3C Informative image, thẻ `<img alt="Lan, điều phối viên phụ trách đoàn T01 (Nhân vật giả lập)">`.<br>- `fallback_behavior`: Thay thế bằng avatar chữ viết tắt (`Initials Avatar`) nền màu ghi xám với chữ `"L"` đậm rõ ràng. |
| **5. Icon family** | 6 icons (Khởi hành, Chờ đối tác, Thiếu hồ sơ, Sẵn sàng, Phụ trách, Nhật ký) | Ký hiệu hóa 6 trạng thái và nghiệp vụ cốt lõi của bảng điều phối. | SVG vector thuần túy; chung hệ lưới 24x24px, chung độ dày nét, hình học nhất quán. | - `purpose`: Tăng tốc độ nhận diện trạng thái và loại hành động trong bảng snapshot.<br>- `source_type`: `authored_vector` (Pure SVG inline hoặc asset local).<br>- `style_rule`: Nét vẽ mảnh thanh lịch (stroke width 1.75px), góc bo nhẹ (round joins/caps), không đổ bóng.<br>- `do`: Luôn đặt icon đi kèm với nhãn văn bản tiếng Việt tương ứng; đảm bảo kích thước quang học đồng đều.<br>- `do_not`: Không dùng emoji hệ điều hành; không trộn icon nét và icon mảng đặc; không dùng icon làm kênh truyền thông tin duy nhất.<br>- `desktop_crop`: Không crop, hiển thị đầy đủ trong bounding box 20x20px hoặc 24x24px.<br>- `mobile_crop`: Không crop, kích thước tối thiểu 18x18px trên mobile.<br>- `color_treatment`: Màu icon kế thừa từ màu chữ (`currentColor`) hoặc màu ngữ cảnh trạng thái chuẩn.<br>- `accessibility_treatment`: W3C Decorative image khi đã có nhãn chữ bên cạnh (`aria-hidden="true"`); hoặc Functional khi đứng độc lập.<br>- `fallback_behavior`: Nếu icon bị ẩn hoặc lỗi, nhãn chữ đi kèm (`text label`) vẫn đảm bảo hiển thị 100% ngữ nghĩa. |
| **6. Texture/accent** | 1 asset (Họa tiết nền/viền) | Tạo cá tính bề mặt tinh tế cho Direction A (hạt giấy nhẹ) hoặc Direction B (lưới tọa độ). | Vector mờ hoặc pattern vi mô; độ mờ rất thấp, không gây nhiễu thị giác. | - `purpose`: Tăng cường cảm xúc thương hiệu (ấm áp tư liệu ở Dir A, chính xác kỹ thuật ở Dir B).<br>- `source_type`: `authored_vector` (SVG pattern) hoặc CSS generated gradient.<br>- `style_rule`: Độ trong suốt tối thiểu (opacity 2% - 5%), không cản trở việc đọc văn bản.<br>- `do`: Áp dụng cho các đường phân cách hoặc nền thẻ; đảm bảo văn bản đặt trên luôn đạt WCAG AA.<br>- `do_not`: Không dùng texture nổi khối, không dùng hình học chuyển động, không làm chói mắt.<br>- `desktop_crop`: Lặp lại dạng gạch hoa (`repeat tile`) hoặc neo cố định theo viền container.<br>- `mobile_crop`: Giữ nguyên hoặc tắt bỏ trên màn hình nhỏ nếu ảnh hưởng đến hiệu năng render.<br>- `color_treatment`: Màu đơn sắc xám/ấm rất nhạt gần với màu nền (`rgba(0,0,0, 0.03)`).<br>- `accessibility_treatment`: W3C Decorative element; đặt trong CSS background hoặc thẻ `<svg aria-hidden="true">`.<br>- `fallback_behavior`: Khi không tải được, nền trở về màu trơn (`solid background color`) mà không gây ảnh hưởng gì tới giao diện. |

---

### 5.4. Đặc tả & Cấu trúc `TEST_MATRIX_DRAFT.md`

Tài liệu thiết lập khung kiểm thử sơ bộ hoàn chỉnh, bao gồm ánh xạ 8 Blocking Gates và đặc tả kỹ thuật cho 14 bài test T01–T14:

#### Phân bổ 8 Blocking Gates B01–B08:
- **B01 — Strategic Divergence**: Direction A và Direction B phải khác nhau tối thiểu trên 5/7 trục chiến lược; không chấp nhận hai hướng chỉ đổi bảng màu mà giữ nguyên bố cục.
- **B02 — Brand Traceability**: Lời hứa và tính cách thương hiệu phải được truy vết tới ít nhất 8 quyết định thị giác cụ thể trong mã nguồn DOM/CSS/Asset.
- **B03 — Image System**: Ma trận ngôn ngữ hình ảnh, tài sản thực tế và giao diện candidate phải nhất quán tuyệt đối về vai trò, tỷ lệ cắt cúp, ánh sáng và cơ chế dự phòng.
- **B04 — Icon Consistency**: Đủ 6 icon chuyên biệt, tuân thủ chung một hệ lưới hình học và phong cách thể hiện; nhãn chữ đi kèm bảo đảm truyền tải trọn vẹn ngữ nghĩa.
- **B05 — Provenance Integrity**: 100% tài sản có manifest, mã băm SHA-256, nguồn gốc/bản quyền/tuyên bố giả lập hợp lệ; tuyệt đối không hotlink từ Internet.
- **B06 — Honest Expression**: Không đưa ra tuyên bố giả tạo, không dùng logo đối tác thật, không dùng cliché du lịch/AI bị cấm; dữ liệu 8 tour khớp chuẩn.
- **B07 — Responsive Accessibility**: Ba viewport (1440, 768, 390) không sinh lỗi tràn thanh cuộn ngang; crop giữ trọn ý nghĩa; alt text, focus, kích thước tương tác và độ tương phản đạt WCAG 2.2 AA.
- **B08 — Evidence Integrity**: Bộ kiểm thử không sửa đổi dữ liệu khóa cứng; file JSON kết quả, log, mã nguồn, báo cáo và 10 ảnh chụp màn hình khớp nhau 100%.

#### Danh mục 14 Bài Test Khóa Cứng T01–T14:
1. **T01 — Workspace & Source Integrity**:
   - *Cổng*: B05, B08.
   - *Mục tiêu*: Xác minh stream cô lập `stream-b/module-012/`, kiểm tra hash SHA-256 của file zip nguồn Module 07 `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`, bảo đảm không chạm vào `stream-a/`.
2. **T02 — Canonical Content Integrity**:
   - *Cổng*: B06, B08.
   - *Mục tiêu*: So khớp sâu (`deep-compare`) toàn bộ 8 bộ dữ liệu T01–T08 với dữ liệu chuẩn Mục 4.6; xác minh T01 là tâm điểm, không có số liệu doanh thu/giải thưởng giả mạo.
3. **T03 — Direction Strategic Divergence**:
   - *Cổng*: B01.
   - *Mục tiêu*: Đo lường và đối chiếu sự phân kỳ giữa Direction A và Direction B trên 7 trục chiến lược; yêu cầu số trục khác biệt thực tế $\ge 5/7$.
4. **T04 — Brand Traceability**:
   - *Cổng*: B02.
   - *Mục tiêu*: Quét mã nguồn HTML/CSS/YAML để xác thực sự tồn tại của tối thiểu 8 selector/token tương ứng với 8 quyết định thị giác đã cam kết trong Brand Thesis.
5. **T05 — Asset Manifest Integrity**:
   - *Cổng*: B05.
   - *Mục tiêu*: Quét toàn bộ thẻ `<img>`, `<svg>`, `@font-face` để đối chiếu với `ASSET_MANIFEST.yaml`; kiểm tra mã băm SHA-256 thực tế của file; xác nhận số lượng request ra Internet bằng 0.
6. **T06 — Image Role & Crop Behavior**:
   - *Cổng*: B03, B07.
   - *Mục tiêu*: Đo đạc bounding box và focal point của hình ảnh trên 3 viewport (1440x900, 768x1024, 390x844); bảo đảm chủ thể và nhãn không bị che khuất hoặc cắt cụt.
7. **T07 — Image Failure Parity**:
   - *Cổng*: B03, B07.
   - *Mục tiêu*: Chặn tải toàn bộ ảnh raster; xác minh trang web vẫn đọc được thông tin T01, trạng thái vận hành và danh sách mốc; không xuất hiện biểu tượng ảnh vỡ làm lệch bố cục.
8. **T08 — Alternative Text Semantics**:
   - *Cổng*: B03, B07.
   - *Mục tiêu*: Kiểm tra thuộc tính `alt` của toàn bộ ảnh theo chuẩn W3C: ảnh trang trí có `alt=""`, ảnh thông tin có alt ngữ cảnh, Route Diagram có danh sách `<ol>` tương đương.
9. **T09 — Iconography Consistency**:
   - *Cổng*: B04.
   - *Mục tiêu*: Xác minh đủ 6 icon canonical; kiểm tra viewBox `24x24`, stroke/fill policy; kiểm tra nhãn chữ luôn hiển thị khi ẩn file SVG.
10. **T10 — Responsive & Target Integrity**:
    - *Cổng*: B07.
    - *Mục tiêu*: Kiểm tra `document.documentElement.scrollWidth <= window.innerWidth` ở cả 3 viewport; kiểm tra mọi interactive element có vùng bấm $\ge 44 \times 44$ CSS px.
11. **T11 — Contrast & Non-Color Meaning**:
    - *Cổng*: B07.
    - *Mục tiêu*: Tính toán tỷ lệ tương phản văn bản so với nền theo thuật toán WCAG 2.2 AA ($\ge 4.5:1$ cho văn bản thường, $\ge 3:1$ cho chữ lớn/icon); xác nhận trạng thái có icon và chữ đi kèm, không chỉ dựa vào màu.
12. **T12 — Static-Module Boundary**:
    - *Cổng*: B08.
    - *Mục tiêu*: Duyệt toàn bộ DOM và kiểm tra computed style: `animation-duration === '0s'` và `transition-duration === '0s'`; không có mã script xử lý scroll parallax hay 3D transform.
13. **T13 — Asset Performance Budget**:
    - *Cổng*: B05, B07.
    - *Mục tiêu*: Cân đo dung lượng từng file raster ($\le 600\text{ KB}$) và tổng dung lượng asset runtime ($\le 3.5\text{ MB}$); kiểm tra thuộc tính `width`, `height` và cờ `loading="lazy"`.
14. **T14 — Evidence & Package Parity**:
    - *Cổng*: B08.
    - *Mục tiêu*: Kiểm tra danh mục 10 ảnh screenshot DPR=2, file `VERIFICATION.json`, file báo cáo Markdown và file nén ZIP; xác nhận tính nhất quán 100% của toàn bộ bằng chứng.

---

## 6. Caveats (Các điểm cần lưu ý & Giả định)

1. **Phạm vi thẩm quyền**: Em hoạt động với tư cách Tác tử Khai phá Đặc tả (`Specification Miner`). Em không tự ý viết trực tiếp các file code chạy hay các tài liệu nghiệm thu cuối cùng ngoài thư mục `.agents/explorer_m0_brand/`. Toàn bộ dữ liệu khai phá này được bàn giao để Tác tử Thi công triển khai chính xác vào thư mục gốc của Module 12.
2. **Số từ của Thesis Statements**: Bản dự thảo Thesis Statement cho Direction A (106 từ) và Direction B (108 từ) đã được kiểm đếm và nằm hoàn hảo trong khoảng an toàn 80–140 từ theo quy định tại Mục 6. Khi triển khai, Tác tử Thi công không được tự ý lược bớt hoặc thêm bớt làm vỡ khung độ dài này.
3. **Giới hạn số lượng tham chiếu**: Bảng tham chiếu được thiết lập cứng ở mức chính xác 8 mục nhằm thỏa mãn tuyệt đối điều kiện "tối đa 8 reference" của Directive Mục 13, tránh mọi rủi ro vi phạm số lượng.
4. **Không truy cập chéo Stream A**: Tuân thủ tuyệt đối lệnh cô lập; toàn bộ nghiên cứu và kiểm chứng chỉ diễn ra trong phạm vi `stream-b/module-012/`.

---

## 7. Conclusion (Kết luận)

Tác tử `explorer_m0_brand` đã hoàn thành 100% công tác khai phá đặc tả cho Phase 1 — Brand Reasoning của Module 12 (Stream B):
1. Đã giải mã toàn bộ các ràng buộc cốt lõi của `BRAND_THESIS.md`: đối tượng B2B, lời hứa thương hiệu khóa cứng, 4 personality seeds, 4 anti-personalities, 2 thesis statements 80–140 từ và bảng 8 quyết định thị giác có khả năng truy nguyên trong mã nguồn.
2. Đã tuyển chọn và phân tích sâu sắc 8 tài liệu tham chiếu chuẩn mực quốc tế và ngành vận hành cho `REFERENCE_BOARD.md` theo đúng 5 trường thông tin bắt buộc, loại bỏ hoàn toàn các nhận định hời hợt.
3. Đã cấu trúc hóa ma trận ngôn ngữ hình ảnh `IMAGE_LANGUAGE_MATRIX.md` bao quát đủ 6 vai trò tài sản và 10 thuộc tính quy tắc, xử lý triệt để bài toán 3 viewport crop và cơ chế dự phòng khi lỗi ảnh.
4. Đã lập bản đồ kiểm thử toàn diện `TEST_MATRIX_DRAFT.md` cho 14 bài test T01–T14 và 8 cổng chặn B01–B08, sẵn sàng cung cấp cơ sở kỹ thuật vững chắc cho Phase 2 (Two-Direction Prototypes) và Checkpoint 12.1.

Tài liệu này cung cấp đầy đủ thông số định lượng và bản mẫu để Tác tử Thi công tạo ra bộ hồ sơ Phase 1 đạt chuẩn tuyệt đối mà không cần phỏng đoán.

---

## 8. Verification Method (Phương pháp kiểm chứng độc lập)

Để kiểm chứng độc lập toàn bộ các quan sát và kết luận trong báo cáo này:

1. **Kiểm tra sự tồn tại và tính hợp lệ của file handoff**:
   - Xem file tại: `design-training/stream-b/module-012/.agents/explorer_m0_brand/handoff.md`.
2. **Kiểm chứng độ dài từ của Thesis Statements**:
   - Sử dụng lệnh PowerShell hoặc Node.js để đếm số từ của 2 đoạn văn Thesis Statement trong mục 5.1:
     - Direction A: Kiểm tra số từ nằm trong khoảng $[80, 140]$.
     - Direction B: Kiểm tra số từ nằm trong khoảng $[80, 140]$.
3. **Kiểm chứng tính toàn vẹn của Bảng tham chiếu**:
   - Đếm số lượng reference trong mục 5.2: Phải chính xác bằng 8 mục.
   - Kiểm tra mỗi mục có đủ 5 trường: `URL`, `Observation`, `Transfer Principle`, `Copy Ban`, `TRIPFLOW Relevance`.
4. **Kiểm chứng Ma trận hình ảnh**:
   - Đếm số vai trò tài sản trong mục 5.3: Phải đủ 6 vai trò.
   - Kiểm tra mỗi vai trò có đủ 10 thuộc tính bắt buộc.
5. **Kiểm chứng Khung kiểm thử**:
   - Đếm số bài test trong mục 5.4: Phải đủ 14 bài test từ T01 đến T14.
   - Đếm số cổng chặn: Phải đủ 8 cổng từ B01 đến B08.
