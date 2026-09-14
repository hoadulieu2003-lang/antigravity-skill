# Architectural Exploration & Prototypes Specification Handoff Report
## Module 12 — Brand & Image Direction (Stream B): Two-Direction Prototypes & Art Direction Architecture

**Author**: `explorer_m0_prototypes` (Art Direction & Prototypes Architecture Explorer)  
**Recipient**: `orchestrator` (Lead Orchestrator)  
**Working Directory**: `design-training/stream-b/module-012/.agents/explorer_m0_prototypes`  
**Date**: 2026-09-14 (Anchor Time: 13/09/2026 18:00 Asia/Ho_Chi_Minh)  
**Status**: COMPLETE (Hard Handoff)

---

## 1. Observation (Quan sát Thực tế)

Qua khảo sát trực tiếp mã nguồn, tài liệu chỉ thị và hệ thống thư mục tại workspace `design-training/stream-b/module-012/`, các dữ kiện quan sát nguyên văn bao gồm:

### 1.1. Yêu cầu Nhiệm vụ và Trạng thái Thư mục Thực tế
- **Tệp chỉ thị chính thức**: `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md` (898 dòng, 32,095 bytes, SHA-256 xác thực).
- **Tệp yêu cầu gốc**: `ORIGINAL_REQUEST.md` (55 dòng, 5,574 bytes), xác lập 4 yêu cầu R1 (Integrity Setup), R2 (Brand Reasoning), R3 (Two-Direction Prototypes), R4 (Checkpoint 12.1 Payload).
- **Thư mục nguyên mẫu**: `directions/option_a/` và `directions/option_b/` hiện đang rỗng (Empty directory), chưa có mã nguồn HTML/CSS/JS.
- **Thư mục tài nguyên đồ họa**: `assets/icons/`, `assets/diagrams/`, `assets/images/`, `assets/textures/` hiện đang rỗng (Empty directory), sẵn sàng cho việc kiến trúc hóa và khởi tạo tài nguyên tự thân (self-contained local assets).
- **Bộ snapshot nền tảng**: `source_snapshot/design_training_007_submission_r04.zip` (1,855,556 bytes) đã được đặt tại chỗ với mã băm xác thực `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`.

### 1.2. Trích dẫn Nguyên văn Các Ràng buộc Cốt lõi từ Directive

1. **Section 3.3 (Dòng 91–103)**:
   > "Hai hướng chỉ được coi là khác nhau khi khác chiến lược. Đổi palette nhưng giữ cùng grid, type hierarchy, crop, asset role và nhịp bố cục không phải hai art direction. Hai hướng bắt buộc phải khác nhau tối thiểu ở 5/7 trục: 1. brand personality; 2. composition model; 3. typography behavior; 4. image source/style; 5. crop/perspective; 6. icon/diagram language; 7. surface/texture behavior."

2. **Section 4.3 & 4.4 (Dòng 142–158)**:
   > "Brand promise khóa cứng: TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."
   > "Personality seed: bình tĩnh; chính xác; có chuẩn bị; gần gũi với người làm vận hành."

3. **Section 4.5 (Dòng 159–169) — Anti-personality khóa cứng**:
   > "TRIPFLOW không được biểu đạt như: hãng du lịch nghỉ dưỡng xa xỉ; bảng điều khiển quân sự hoặc phòng chỉ huy; sản phẩm AI tím–xanh phát sáng chung chung; mạng xã hội khám phá điểm đến; giao diện 'adventure' dùng hình núi, la bàn và máy bay như họa tiết mặc định; dashboard thành tích với số liệu tăng trưởng bịa đặt."

4. **Section 4.6 (Dòng 170–190) — Bộ Dữ liệu Vận hành Chuẩn (Canonical Operational Snapshot)**:
   Mốc thời gian cố định: `13/09/2026 — 18:00, Asia/Ho_Chi_Minh`.
   - `T01`: Hạ Long 2N1Đ | Khởi hành: 14/09/2026 07:30 | Phụ trách: Lan | Trạng thái: Chờ đối tác | Ghi chú: Khách sạn chưa xác nhận 4 phòng (*Trọng tâm ưu tiên*).
   - `T02`: Ninh Bình 1 ngày | Khởi hành: 14/09/2026 06:00 | Phụ trách: Minh | Trạng thái: Sẵn sàng | Ghi chú: Đã đủ xe, hướng dẫn viên và danh sách khách.
   - `T03`: Sapa 3N2Đ | Khởi hành: 15/09/2026 21:30 | Phụ trách: Huy | Trạng thái: Thiếu hồ sơ | Ghi chú: 2 khách chưa gửi CCCD.
   - `T04`: Đà Nẵng 4N3Đ | Khởi hành: 16/09/2026 08:00 | Phụ trách: Lan | Trạng thái: Đang chuẩn bị | Ghi chú: Chờ chốt danh sách suất ăn.
   - `T05`: Hà Giang 3N2Đ | Khởi hành: 17/09/2026 05:30 | Phụ trách: Minh | Trạng thái: Sẵn sàng | Ghi chú: Đã hoàn tất checklist khởi hành.
   - `T06`: Phú Quốc 3N2Đ | Khởi hành: 18/09/2026 09:10 | Phụ trách: Huy | Trạng thái: Chờ đối tác | Ghi chú: Nhà xe trung chuyển chưa xác nhận.
   - `T07`: Mộc Châu 2N1Đ | Khởi hành: 19/09/2026 06:30 | Phụ trách: Lan | Trạng thái: Đang chuẩn bị | Ghi chú: Đang rà soát danh sách phòng.
   - `T08`: Huế 3N2Đ | Khởi hành: 12/09/2026 07:00 | Phụ trách: An | Trạng thái: Hoàn thành | Ghi chú: Đoàn đã khởi hành và bàn giao nhật ký.

5. **Section 5 (Dòng 193–210) — Các Thành phần Bắt buộc của Màn hình**:
   > "Màn hình phải gồm: 1. brand header; 2. lời hứa sản phẩm; 3. điểm tập trung T01; 4. operational snapshot cho đủ T01–T08; 5. một route/sequence diagram cho T01; 6. một khu vực 'người phụ trách' thể hiện Lan là nhân vật giả lập; 7. một nhóm icon nghiệp vụ; 8. asset disclosure ngắn, có thể mở để xem provenance. Không biến bài tập thành landing page bán tour."

6. **Section 6 (Dòng 212–252) — Hai Art Direction bắt buộc**:
   - **Direction A — Human Field Intelligence (Trí tuệ Thực địa Nhân văn)**: Trọng tâm con người vận hành trong bối cảnh địa phương; bố cục editorial/asymmetric; ảnh phóng sự tài liệu (documentary-inspired); ấm áp, quan sát, đáng tin cậy.
   - **Direction B — Route Signal System (Hệ thống Tín hiệu Lộ trình)**: Trọng tâm tuyến, tín hiệu, mốc và sự sẵn sàng; bố cục systematic/cartographic grid; ảnh diagram/địa lý trừu tượng; chính xác, định hướng, bình tĩnh; không biến thành military/sci-fi terminal.

7. **Section 9 (Dòng 316–342) — Hợp đồng Biểu tượng (Iconography Contract)**:
   > "Tối thiểu sáu icon riêng cho: 1. khởi hành; 2. chờ đối tác; 3. thiếu hồ sơ; 4. sẵn sàng; 5. người phụ trách; 6. nhật ký liên hệ. Artboard 24x24 hoặc 32x32, stroke hoặc fill model đồng nhất, không trộn emoji/icon font."

8. **Section 11 & Test T12 (Dòng 370–386, 649–654) — Khóa Ranh giới Tĩnh Tuyệt đối (Absolute Zero-Motion Invariant)**:
   > "animation: forbidden, transition: forbidden, parallax: forbidden, scroll_linked_effect: forbidden, auto_play_media: forbidden, 3d_transform_as_effect: forbidden. CSS computed style phải cho thấy không có animation hoặc transition duration khác 0s."

9. **Section 14.2 & 14.3 (Dòng 500–528) — Ngân sách Tài nguyên & Semantic Accessibility**:
   > "max_single_raster_bytes: 600000 (600KB), max_total_runtime_asset_bytes: 3500000 (3.5MB), remote_runtime_requests: 0. Buttons là button thật, links là link thật, focus visible, target tương tác tối thiểu 44x44px, WCAG 2.2 AA baseline."

---

## 2. Logic Chain (Chuỗi Lập luận Kiến trúc & Phân tích Chuyên sâu)

### 2.1. Phân tích Bản chất Nghiệp vụ & Kiến trúc Hai Hướng Nguyên mẫu (Phase 2 Prototypes Architecture)

Cả hai nguyên mẫu đều phục vụ **TRIPFLOW Daily Departure Brief** tại viewport chuẩn Desktop `1440 × 900`, mang cùng dữ liệu nghiệp vụ chuẩn xác T01–T08, nhưng đại diện cho hai triết lý giải quyết vấn đề hoàn toàn khác biệt:

```
                               ┌─────────────────────────────────────────────────────────────┐
                               │                 TRIPFLOW OPERATIONAL MISSION                │
                               │ "Giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ G" │
                               └──────────────────────────────┬──────────────────────────────┘
                                                              │
                                ┌─────────────────────────────┴─────────────────────────────┐
                                ▼                                                           ▼
                ┌───────────────────────────────┐                           ┌───────────────────────────────┐
                │          DIRECTION A          │                           │          DIRECTION B          │
                │   Human Field Intelligence    │                           │      Route Signal System      │
                ├───────────────────────────────┤                           ├───────────────────────────────┤
                │ Triết lý: Vận hành là con     │                           │ Triết lý: Vận hành là chuỗi   │
                │ người, mối quan hệ và hiện    │                           │ trạng thái, tọa độ, trạm mốc  │
                │ trường thực địa.              │                           │ và tín hiệu kiểm soát.        │
                │                               │                           │                               │
                │ Bố cục: Tạp chí Biên tập      │                           │ Bố cục: Lưới Bản đồ Đo lường  │
                │ (Editorial / Asymmetric)      │                           │ (Cartographic / Modular Grid) │
                │                               │                           │                               │
                │ Thẩm mỹ: Ấm áp, xúc giác,     │                           │ Thẩm mỹ: Chính xác, cấu trúc, │
                │ giấy in thực địa, trầm tĩnh.  │                           │ phẳng kỹ thuật, định hướng.   │
                └───────────────────────────────┘                           └───────────────────────────────┘
```

#### A. Kiến trúc Chi tiết Direction A: Human Field Intelligence (`directions/option_a/index.html`)
1. **Triết lý Cốt lõi**:
   - Hướng tiếp cận đặt con người điều phối (Dispatcher) và đối tác địa phương (Local partners) vào trung tâm. Điều phối tour không chỉ là những dòng dữ liệu vô cảm, mà là sự phối hợp giữa người với người (Lan gọi điện thoại, tài xế kiểm tra xe, khách sạn chuẩn bị buồng phòng).
2. **Cấu trúc Bố cục (Layout Architecture)**:
   - Sử dụng mô hình **Editorial Asymmetric Grid (Lưới Báo chí Bất đối xứng)**: Phân tách không gian thành 2 khối chính tỷ lệ vàng hoặc 7:5 (Primary Content 62% : Field Intelligence Sidebar 38%).
   - Cột trái (Primary Narrative): Header thương hiệu tinh tế, lời hứa sản phẩm dạng câu trích dẫn biên tập, Banner nổi bật T01 với hình ảnh tài liệu hiện trường vịnh Hạ Long lúc chập tối chuẩn bị đón đoàn, khối chi tiết nghẽn 4 phòng khách sạn kèm sơ đồ lộ trình dạng mốc dòng thời gian câu chuyện (Narrative timeline).
   - Cột phải (Field Intelligence Sidebar): Thẻ nhân sự Lan (kèm huy hiệu công bố minh bạch "Fictional Operator"), nhật ký phối hợp (Contact Log), và bảng tổng hợp 7 tour còn lại (T02–T08) theo nhịp thẻ biên tập có khoảng thở rộng rãi (Generous whitespace).
3. **Màu sắc & Thị giác (Visual & Semantic Palette)**:
   - Màu nền bề mặt: Giấy in xúc giác ấm áp (`Warm Paper Substrate` `#FAF8F5`, `#F3EFEA`).
   - Màu chữ chính: Mực in trầm ấm (`Deep Charcoal Ink` `#1C1917`, `#292524`).
   - Màu nhấn nhận diện: Đất nung thực địa (`Terracotta / Ochre Earth` `#C2410C`, `#9A3412`).
   - Màu trạng thái ngữ nghĩa (Semantic status colors):
     * Chờ đối tác: Hổ phách ấm (`Warm Amber` nền `#FEF3C7`, chữ `#92400E`, viền `#FDE68A`).
     * Sẵn sàng: Xanh rêu ngọc trầm (`Muted Pine / Sage` nền `#ECFDF5`, chữ `#065F46`, viền `#A7F3D0`).
     * Thiếu hồ sơ: Đất đỏ gạch (`Brick Red` nền `#FEF2F2`, chữ `#991B1B`, viền `#FECACA`).
     * Đang chuẩn bị: Xanh lam khói (`Muted Slate Blue` nền `#EFF6FF`, chữ `#1E40AF`, viền `#BFDBFE`).

#### B. Kiến trúc Chi tiết Direction B: Route Signal System (`directions/option_b/index.html`)
1. **Triết lý Cốt lõi**:
   - Hướng tiếp cận xem toàn bộ chuyến đi là một **hệ thống tín hiệu liên tục (Continuous signal flow)**. Người điều phối cần quét mắt cực nhanh (High-speed scanning), nhận diện ngay lập tức điểm nghẽn tại từng mắt xích địa lý và trạng thái sẵn sàng (Readiness score / Status flags).
2. **Cấu trúc Bố cục (Layout Architecture)**:
   - Sử dụng mô hình **Cartographic Modular Grid (Lưới Bản đồ Học 12 cột)**: Bố cục module chặt chẽ, chia khối sắc nét theo các dải đo lường ngang và dọc (Horizontal signal rails & Vertical telemetry columns).
   - Dải tín hiệu đỉnh (Top Telemetry Rail): Đồng hồ neo thời gian `13/09/2026 18:00 Asia/Ho_Chi_Minh`, chỉ số sẵn sàng tổng thể (Overall Readiness: 5/8 tour Ready/In-progress, 2 Waiting Partner, 1 Missing Docs).
   - Khối trung tâm T01 (Focal Node): Thẻ đo lường kỹ thuật cao, ảnh địa lý cắt cúp sắc cạnh kèm lưới tọa độ tượng trưng, sơ đồ chuỗi hành trình dạng mạch tín hiệu giao thông (Schematic transit-style route diagram), hiển thị rõ điểm đứt gãy tại Khách sạn Bãi Cháy (Nút đỏ cảnh báo: 4 phòng thiếu).
   - Khối lưới ma trận T01–T08 (Data Matrix Grid): Bảng tín hiệu đa cột có phân cách kỹ thuật sắc nét (`1px solid #CBD5E1`), số hiệu tour dạng monospace, mã trạng thái có nhãn văn bản và biểu tượng hình học đồng bộ.
   - Thẻ điều phối viên Lan: Dạng thẻ định danh kỹ thuật số (Operational Operator Badge) với khung thông số, chỉ số tải công việc (Workload capacity: 3 active tours).
3. **Màu sắc & Thị giác (Visual & Semantic Palette)**:
   - Màu nền bề mặt: Bảng điều khiển kỹ thuật sáng (`Crisp Instrument Slate` `#F8FAFC`, `#F1F5F9`).
   - Màu chữ chính: Than chì kỹ thuật (`Technical Graphite` `#0F172A`, `#1E293B`).
   - Màu nhấn nhận diện: Xanh hải quân định hướng (`Navigational Cobalt / International Blue` `#1D4ED8`, `#1E40AF`).
   - Màu trạng thái ngữ nghĩa:
     * Chờ đối tác: Vàng cảnh báo kỹ thuật (`Industrial Hazard Yellow` nền `#FEF9C3`, chữ `#854D0E`, viền `#EAB308`).
     * Sẵn sàng: Xanh lục tín hiệu chuẩn (`Telemetry Green` nền `#DCFCE7`, chữ `#166534`, viền `#22C55E`).
     * Thiếu hồ sơ: Đỏ dừng khẩn cấp (`Signal Red` nền `#FEE2E2`, chữ `#991B1B`, viền `#EF4444`).
     * Đang chuẩn bị: Xanh viễn thông (`Telecom Cyan` nền `#E0F2FE`, chữ `#075985`, viền `#0EA5E9`).

---

### 2.2. Ma trận Phân kỳ Chiến lược Tuyệt đối trên 7 Trục (7-Axis Strategic Divergence Matrix)

Để vượt qua tiêu chí của Chỉ thị (Directive) yêu cầu khác biệt trên tối thiểu **5/7 trục**, kiến trúc đề xuất đạt mức phân kỳ toàn diện trên **cả 7/7 trục** mà không chỉ là sự thay đổi bảng màu (Palette change). Bảng phân tích đối sánh chi tiết như sau:

| Trục Chiến Lược (Strategic Axis) | Hướng A: Human Field Intelligence | Hướng B: Route Signal System | Bản chất Khác biệt Kỹ thuật & Thị giác (Concrete Divergence Evidence) |
|---|---|---|---|
| **1. Brand Personality** *(Cá tính Thương hiệu)* | **Ấm áp, thấu cảm, quan sát thực địa, kiên nhẫn** (`Observational, Empathetic, Grounded, Reassuring`). | **Kỷ luật, định hướng, chính xác, phân tích** (`Navigational, Analytical, Rigorous, Systematic`). | Hướng A dùng giọng văn ghi chép nhật ký hiện trường, nhấn mạnh vai trò hỗ trợ đối tác; Hướng B dùng văn phong đo lường viễn thám, chỉ số sẵn sàng và tọa độ mốc. |
| **2. Composition Model** *(Mô hình Bố cục)* | **Báo chí Biên tập Bất đối xứng (Editorial Asymmetric)**: Cột chính 62% + Cột bên 38%, nhịp đọc dọc thư thái, tỷ lệ khoảng trống (`whitespace`) rộng thoáng (24px–32px gaps). | **Lưới Bản đồ Đo lường 12 Cột (Cartographic Modular Grid)**: Phân chia module khối hộp sắc nét, dải telemetry ngang, mật độ tín hiệu cao, khoảng cách compact (12px–16px gaps). | Hướng A phá vỡ sự đối xứng để dẫn dắt câu chuyện qua các khối thẻ mềm mại; Hướng B khóa cứng cấu trúc theo trục tọa độ x/y, tối ưu hóa tốc độ quét mắt của điều phối viên. |
| **3. Typography Behavior** *(Hành vi Kiểu chữ)* | **Humanist Serif kết hợp Humanist Sans**: Tiêu đề dùng font Serif trang nhã (`Georgia, 'Times New Roman', serif`), nội dung dùng Sans ấm áp (`system-ui, -apple-system, sans-serif`), tỷ lệ `line-height: 1.6`, theo nhịp đọc văn xuôi. | **Geometric Sans kết hợp Tabular Monospace**: Tiêu đề và giao diện dùng Geometric Sans sắc sảo (`Segoe UI, Inter, sans-serif`), mã tour, thời gian, số liệu dùng Monospace (`Consolas, 'Courier New', monospace`), `line-height: 1.35`, micro-caps. | Hướng A tạo cảm giác tài liệu xuất bản tin cậy; Hướng B tạo cảm giác trạm điều hành chuẩn xác, các con số thẳng cột tuyệt đối (tabular figures). |
| **4. Image Source / Style** *(Nguồn gốc & Phong cách Hình ảnh)* | **Nhiếp ảnh Phóng sự Tài liệu Thực tế (Documentary Photography)**: Ánh sáng tự nhiên, góc máy ngang tầm mắt, ghi lại khoảnh khắc nhân viên soát vé, tài xế kiểm xe tại bến Tuần Châu; màu sắc ấm, độ bão hòa dịu. | **Hình ảnh Bản đồ & Sơ đồ Kỹ thuật (Cartographic & Diagrammatic Imagery)**: Ảnh viễn thám địa hình cắt cúp vi mô, đồ họa vector luồng tuyến, xử lý sắc thái đơn sắc lạnh (cool duotone/desaturated), phủ lưới tọa độ. | Hướng A tôn vinh con người và bối cảnh địa phương; Hướng B trừu tượng hóa không gian thành các vector lộ trình và điểm đo đạc. |
| **5. Crop / Perspective** *(Cắt cúp & Góc nhìn)* | **Góc nhìn Ngang Tầm mắt (Eye-Level / Mid-Shot Perspective)**: Cắt cúp khung hình 4:3 và 3:2, bảo toàn không gian thở xung quanh chủ thể con người, focal point tập trung vào hành động làm việc. | **Góc nhìn Trực giao Trên cao (Orthogonal / Top-down / Technical Crop)**: Cắt cúp khung hình 16:9 toàn cảnh hoặc 1:1 kỹ thuật, đóng khung bounding box với các dấu chữ thập ngắm (crosshair marks) ở 4 góc. | Hướng A đưa người xem vào cùng không gian làm việc với Lan; Hướng B đặt người xem ở vị trí tổng quan giám sát toàn tuyến từ trên cao. |
| **6. Icon & Diagram Language** *(Ngôn ngữ Biểu tượng & Sơ đồ)* | **Nét Vẽ Nhân văn Bo Mềm (Humanist Organic Strokes)**: Biểu tượng 24x24 nét dày 1.75px, đầu nét bo tròn mềm (`stroke-linecap="round"`), sơ đồ T01 dạng chuỗi hạt thời gian hữu cơ uốn lượn nhẹ. | **Hình học Kỹ thuật Góc Sắc (Crisp Geometric Precision)**: Biểu tượng 24x24 nét dày 2px, góc vuông sắc nét (`stroke-linejoin="miter"` hoặc vát nhẹ), sơ đồ T01 dạng sơ đồ mạch điện/tàu điện ngầm thẳng tắp với các cổng logic. | Cùng thể hiện 6 trạng thái nghiệp vụ và hành trình T01 nhưng ngôn ngữ tạo hình phân kỳ triệt để giữa "hữu cơ/con người" và "cơ khí/kỹ thuật". |
| **7. Surface & Texture Behavior** *(Hành vi Bề mặt & Chất liệu)* | **Bề mặt Giấy Xúc giác Ấm (Tactile Warm Paper Substrate)**: Nền ngả kem (`#FAF8F5`), viền thẻ màu be dịu (`border: 1px solid #E7E2DA`), đổ bóng phân tán mềm không viền (`box-shadow: 0 2px 8px rgba(44,38,30,0.04)`), hoa văn sợi giấy vi mô. | **Bề mặt Bảng Điều khiển Kim loại/Thủy tinh Phẳng (Technical Instrument Substrate)**: Nền xám xanh sáng (`#F8FAFC`), viền kỹ thuật sắc mảnh (`border: 1px solid #CBD5E1`), không bóng đổ mờ, phân tầng bằng màu nền và vạch chia millimeter. | Hướng A mang lại cảm giác cầm cuốn sổ tay điều hành thực địa; Hướng B mang lại cảm giác bảng công cụ định vị chuẩn xác. |

---

### 2.3. Ràng buộc Kỹ thuật Bất biến & Quy chuẩn Khắt khe (Strict Technical Constraints Architecture)

#### 1. Bất biến Không Chuyển động Tuyệt đối (Absolute Zero-Motion Invariant)
- **Cơ chế Triển khai**:
  Khóa cứng toàn bộ các thuộc tính chuyển động bằng khối CSS cưỡng chế toàn cục đặt ở đầu thẻ `<style>` của cả hai nguyên mẫu:
  ```css
  /* ==========================================================================
     STRICT STATIC INVARIANT (ZERO-MOTION MANDATE)
     Module 12 Directive Sections 11 & 17 (Test T12)
     ========================================================================== */
  *,
  *::before,
  *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    animation-name: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    transition-property: none !important;
    scroll-behavior: auto !important;
  }
  ```
- **Kiểm chứng Computed Style**:
  Đảm bảo hàm kiểm thử của Directive (Test T12) khi duyệt qua 100% phần tử trong DOM (`document.querySelectorAll('*')`):
  `window.getComputedStyle(el).animationDuration === '0s'` và `window.getComputedStyle(el).transitionDuration === '0s'`.
- **Trạng thái Tương tác (Interactive Hover/Focus States)**:
  Mọi trạng thái hover hoặc focus của button, thẻ, liên kết đều **chuyển đổi trạng thái tức thời (instantaneous step change)**, tuyệt đối không có hiệu ứng làm mờ dần (fade-in), trượt (slide) hay phóng to dần (scale animation).

#### 2. Hiển thị Sạch tại Viewport Desktop 1440x900 (Desktop Viewport Clean Render)
- Kích thước canvas cố định: `width: 1440px`, tối ưu hóa cho màn hình 1440x900 ở Device Pixel Ratio (DPR) = 2.
- Ràng buộc tràn ngang: `overflow-x: hidden;` ở cấp độ thẻ `<html>` và `<body>`, đảm bảo `document.documentElement.scrollWidth <= 1440`.
- Ràng buộc bảng điều khiển (Console Cleanliness): Tuyệt đối không có bất kỳ lỗi console nào (`0 uncaught errors`, `0 missing asset 404s`, `0 warning messages`).

#### 3. Tuân thủ Độ tương phản WCAG 2.2 AA (WCAG 2.2 AA Contrast Compliance)
- Mọi văn bản thông thường (Normal body text, size < 18pt / 24px hoặc < 14pt / 18.66px bold) đạt tỷ lệ tương phản tối thiểu **4.5:1** so với màu nền.
- Mọi tiêu đề lớn (Large text) đạt tỷ lệ tương phản tối thiểu **3.0:1**.
- Mọi viền điều khiển giao diện (UI components / input borders / active states) đạt tối thiểu **3.0:1**.
- **Nguyên tắc phi màu sắc (Non-color dependency)**: Không bao giờ truyền đạt trạng thái duy nhất bằng màu sắc. Mọi badge trạng thái (Chờ đối tác, Sẵn sàng, Thiếu hồ sơ) phải bao gồm cả 3 yếu tố:
  1. Nhãn chữ tường minh (Explicit text label: "Chờ đối tác");
  2. Biểu tượng hình học đặc trưng (Distinct custom SVG icon);
  3. Màu nền và viền đạt tương phản chuẩn WCAG AA.

#### 4. Kích thước Mục tiêu Tương tác Tối thiểu 44x44px (Minimum 44x44px Touch Targets)
- Toàn bộ các phần tử có thể tương tác (Nút bấm xem chi tiết, Thẻ mở rộng Disclosure `<summary>`, Bộ lọc Tab, Nút tải lại):
  ```css
  .interactive-target {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  ```
- Các nút nhỏ gọn trong bảng dữ liệu được bổ sung vùng đệm trong suốt (Transparent padding touch target extension) để diện tích bấm đo được trong DOM luôn đạt $\ge 44 \times 44$ CSS pixels.

#### 5. Tích hợp Dữ liệu Chuẩn Canonical T01–T08 (Canonical Operational Dataset Integration)
- Đồng nhất 100% nội dung nghiệp vụ giữa Direction A và Direction B: Cùng 8 tour, cùng thời gian khởi hành, cùng người phụ trách, cùng vấn đề ghi chú.
- Tour T01 (Hạ Long 2N1Đ) giữ vị trí trung tâm nổi bật nhất, thể hiện rõ nút thắt: "Khách sạn chưa xác nhận 4 phòng".
- Tuyệt đối không tự ý bịa đặt số liệu doanh thu, tỷ lệ hoàn thành phần trăm giả lập, hoặc đưa các thông tin ngoài brief.

---

### 2.4. Khảo sát & Quy chuẩn Hệ thống Tài sản Đồ họa (`assets/`)

Tất cả các tài sản đồ họa phục vụ cho Phase 2 Two-Direction Prototypes được phân loại và thiết lập quy chuẩn nghiêm ngặt như sau:

```
assets/
├── icons/                  # 6 SVG custom icons tuân thủ 100% Iconography Contract
│   ├── ic_departure.svg            # Khởi hành (Lịch trình / Đồng hồ mốc)
│   ├── ic_waiting_partner.svg      # Chờ đối tác (Bắt tay / Đồng hồ chờ)
│   ├── ic_missing_docs.svg         # Thiếu hồ sơ (Tài liệu / Dấu chấm than cảnh báo)
│   ├── ic_ready.svg                # Sẵn sàng (Dấu tích kiểm tra tròn hoàn tất)
│   ├── ic_person_in_charge.svg     # Người phụ trách (Chân dung biểu trưng điều phối)
│   └── ic_contact_log.svg          # Nhật ký liên hệ (Cuốn sổ ghi chép / Cuộc gọi)
├── diagrams/               # Sơ đồ chuỗi lộ trình T01 tác quyền vector
│   └── diagram_t01_route.svg       # Chuỗi 4 mốc: Hà Nội -> Hải Dương -> Tuần Châu -> Bãi Cháy
├── images/                 # Hình ảnh hiện trường và chân dung giả lập
│   ├── hero_halong_context.webp    # Bối cảnh cảng tàu Tuần Châu / Hạ Long lúc chập tối
│   ├── op_scene_manifest.webp      # Hiện trường điều phối kiểm tra danh sách hành khách
│   ├── op_scene_dock.webp          # Hiện trường bến cảng đón đoàn và hành lý
│   └── avatar_lan.svg              # Minh họa chân dung nhân vật giả lập Lan (Authored vector)
└── textures/               # Chất liệu bề mặt tinh tế
    ├── paper_grain_light.svg       # Hạt giấy tự nhiên cho Hướng A
    └── carto_grid_pattern.svg      # Lưới tọa độ vi mô cho Hướng B
```

#### A. Hợp đồng Biểu tượng 6 SVG Icons (Iconography Contract)
- **Artboard chuẩn**: `viewBox="0 0 24 24"`, kích thước hiển thị `24 × 24px` (hoặc `20 × 20px` nhúng trong badge).
- **Mô hình dựng hình (Stroke Model)**:
  * Nét vẽ đơn sắc `stroke="currentColor"`, `fill="none"`.
  * Độ dày nét: Hướng A dùng `1.75px` với đầu nét tròn `stroke-linecap="round"` `stroke-linejoin="round"`. Hướng B dùng `2px` với đầu nét góc cạnh chính xác `stroke-linecap="square"` `stroke-linejoin="miter"`.
  * Vùng an toàn quang học (Optical safe area): 2px padding xung quanh viền artboard.
  * Quy tắc tiếp cận (Accessibility): Tất cả SVG icon đều gắn `aria-hidden="true"` khi đứng cạnh nhãn chữ hiển thị, hoặc có `<title>` và `role="img"` khi đứng độc lập.

#### B. Sơ đồ Chuỗi Hành trình T01 (T01 Route Sequence Diagram)
- **Nội dung chuỗi mốc hành trình**:
  1. Mốc 1: `Hà Nội (Điểm tập trung)` — Khởi hành 07:30 ngày 14/09 (Trạng thái: Sẵn sàng).
  2. Mốc 2: `Trạm dừng Hải Dương` — Nghỉ chân 09:00 (Trạng thái: Sẵn sàng).
  3. Mốc 3: `Cảng Tuần Châu (Hạ Long)` — Check-in lên tàu 11:30 (Trạng thái: Xe & Hướng dẫn viên đã chốt).
  4. Mốc 4: `Khách sạn Bãi Cháy` — Nhận phòng 14:00 (**ĐIỂM NGHẼN**: Khách sạn chưa xác nhận 4 phòng).
- **Yêu cầu W3C Complex Images**:
  Bên cạnh hình ảnh đồ họa vector trực quan, bắt buộc phải có một cấu trúc HTML tương đương dạng văn bản `<ol class="sr-only route-milestone-list">` mô tả đầy đủ từng mốc, thời gian và trạng thái sự cố cho trình đọc màn hình.

#### C. Chân dung Nhân vật Giả lập Lan (Fictional Operator Avatar)
- **Nguyên tắc Đạo đức & Minh bạch**: Tuyệt đối không dùng ảnh người thật chụp studio hoặc ảnh AI siêu thực lừa dối người dùng (No photorealistic fake staff).
- **Giải pháp**: Thiết kế chân dung dạng minh họa vector cách điệu (Stylized vector portrait) hoặc hình vẽ tối giản trang nhã, kèm nhãn công bố rõ ràng:
  `"Lan — Điều phối viên tour T01 [Nhân vật giả lập trong kịch bản đào tạo / Fictional persona]"` và avatar chữ cái thay thế (`Initials Avatar: "L"`) khi chế độ tải ảnh bị ngắt.

#### D. Hình ảnh Bối cảnh & Hiện trường Vận hành (Operational & Context Images)
- Được nén định dạng WebP hiện đại, kích thước dưới `600KB` mỗi ảnh, tổng dung lượng runtime dưới `3.5MB`.
- Có khai báo thuộc tính `width`, `height` và `loading="lazy"` (đối với ảnh ngoài màn hình đầu tiên) để chống hiện tượng nhảy bố cục (Layout shift / CLS).
- Điểm neo trọng tâm (Focal points) được xác lập rõ ràng trong CSS (`object-fit: cover; object-position: 50% 40%;`).

---

### 2.5. Phân tích Cấu trúc Checkpoint 12.1 Reasoning Gate Payload (Section 23 Directive)

Mục 23 của Chỉ thị xác lập Checkpoint 12.1 là **Cổng Thẩm định Lập luận (Reasoning Gate)** bắt buộc phải đệ trình lên Controller Stream B trước khi được phép tiến hành giai đoạn xây dựng ứng viên cuối cùng (Final Candidate). Cấu trúc payload YAML chuẩn mực cần được chuẩn bị sẵn bao gồm:

```yaml
submission_type: DESIGN_TRAINING_012_CHECKPOINT_12_1
stream_id: B
workspace: design-training/stream-b/module-012/
source_snapshot_sha256: "e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76"
brand_thesis_draft:
  audience: "Điều phối viên và trưởng nhóm vận hành tại doanh nghiệp du lịch quy mô vừa và nhỏ (SME), phụ trách quản lý nhiều đoàn tour khởi hành cùng lúc trong môi trường áp lực cao, thường xuyên bị gián đoạn."
  promise: "TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."
  personality:
    - "Bình tĩnh (Calm)"
    - "Chính xác (Precise)"
    - "Có chuẩn bị (Prepared)"
    - "Gần gũi với người làm vận hành (Grounded & Human)"
  anti_personality:
    - "Hãng du lịch nghỉ dưỡng xa xỉ (Luxury resort traveler vibe)"
    - "Bảng điều khiển quân sự / phòng chỉ huy (Military command / terminal sci-fi)"
    - "Sản phẩm AI tím–xanh phát sáng chung chung (Generic purple-blue glowing AI)"
    - "Dashboard thành tích với số liệu tăng trưởng bịa đặt (Growth metric vanity dashboard)"
direction_a:
  name: "Human Field Intelligence (Trí tuệ Thực địa Nhân văn)"
  strategy: "Tiếp cận vấn đề vận hành từ góc nhìn con người tại thực địa. Bố cục dạng tạp chí biên tập (editorial layout), typography serif ấm áp kết hợp sans-serif nhân văn, hình ảnh phóng sự tài liệu ghi lại nhịp điệu công việc chuẩn bị thực tế, tạo cảm giác an tâm, đáng tin cậy và gần gũi."
  five_axis_summary: "Khác biệt trên cả 7 trục: (1) Personality ấm áp & quan sát thực địa; (2) Composition biên tập bất đối xứng 2 cột nhịp nhàng; (3) Typography kết hợp Serif tiêu đề & Humanist Sans nội dung; (4) Image phong cách phóng sự tài liệu ánh sáng tự nhiên; (5) Crop ngang tầm mắt chân thực; (6) Icon nét bo tròn mềm mại; (7) Surface chất liệu giấy xúc giác ấm áp."
direction_b:
  name: "Route Signal System (Hệ thống Tín hiệu Lộ trình)"
  strategy: "Tiếp cận vấn đề vận hành dưới góc độ chuỗi tín hiệu và lộ trình chuyển động. Bố cục dạng lưới bản đồ kỹ thuật (cartographic grid) 12 cột chuẩn xác, typography sans hình học kết hợp monospace hiển thị mốc thời gian, hình ảnh địa lý trừu tượng và sơ đồ mạch tín hiệu trực quan, tối ưu hóa tốc độ quét và nhận diện điểm nghẽn."
  five_axis_summary: "Khác biệt trên cả 7 trục: (1) Personality kỷ luật & độ chính xác tín hiệu; (2) Composition lưới bản đồ 12 cột module hóa dày đặc; (3) Typography Sans hình học kỹ thuật kết hợp Monospace biểu diễn số liệu; (4) Image ảnh địa lý cắt cúp và sơ đồ kỹ thuật; (5) Crop trực giao thẳng đứng có khung tọa độ; (6) Icon hình học sắc cạnh góc chuẩn; (7) Surface bảng đồng hồ kỹ thuật phân tầng rõ rệt."
image_language_roles:
  - hero_context
  - operational_scene
  - route_diagram
  - fictional_person
  - icon_family
  - texture_accent
asset_acquisition_plan: "Sản xuất vector SVG nguyên bản cho 6 icons, sơ đồ lộ trình T01, avatar Lan cách điệu và hoa văn nền; tạo ảnh WebP/AVIF tối ưu hóa kích thước cho ảnh bối cảnh và hiện trường có ghi rõ nhãn hư cấu AI-generated training asset."
test_matrix_draft_path: "TEST_MATRIX_DRAFT.md"
open_questions: []
```

---

## 3. Caveats (Khu vực Chưa Khảo sát & Giới hạn Giả định)

1. **Giới hạn Môi trường Khảo sát Tĩnh (Static Exploration Boundary)**:
   - Các nguyên mẫu `directions/option_a/index.html` và `directions/option_b/index.html` hiện tại chưa được tạo mã HTML; báo cáo này đóng vai trò là **Bản thiết kế Kiến trúc & Hướng dẫn Thi công (Architectural Blueprint)** cho worker pod triển khai trong Phase 2.
2. **Giới hạn Công cụ Lệnh CLI trên Môi trường Windows**:
   - Lệnh `run_command` gặp rào cản phân quyền bảo mật truy cập ổ đĩa `C:\`, do đó việc giải nén snapshot zip hoặc chạy script kiểm thử bằng Node.js trong môi trường subagent cần được ủy nhiệm cho worker hoặc agent có quyền thực thi thích hợp.
3. **Quyền Phán quyết Lựa chọn Hướng Cuối cùng (Selection Gate Authority)**:
   - Cả hai hướng A và B đều được thiết kế độc lập với chất lượng ngang nhau. Theo Mục 6 của Directive: "Controller không mặc định Direction A hay B thắng. Anti phải chọn bằng rubric tại Mục 15". Quyết định chọn hướng nào sẽ được thực hiện tại Phase 3 dựa trên điểm chấm thực tế của 8 nhóm tiêu chí rubric.

---

## 4. Conclusion (Kết luận Đánh giá & Khuyến nghị Hành động)

1. **Tính khả thi & Độ sẵn sàng Cao**: Toàn bộ yêu cầu của Phase 2 (Two-Direction Prototypes) đã được bóc tách chi tiết thành các thông số kỹ thuật, cấu trúc DOM, lớp CSS và tài sản đồ họa cụ thể.
2. **Phân kỳ Chiến lược Tuyệt đối (Real Strategic Divergence)**: Hai hướng A và B phân kỳ trên toàn bộ **7/7 trục** (vượt xa mức tối thiểu 5/7 trục), giải quyết triệt để nguy cơ vi phạm lỗi "chỉ đổi bảng màu" (palette-only variation).
3. **Bảo vệ Bất biến Kỹ thuật Cốt lõi**: Các quy tắc Zero-Motion (`animation: 0s`, `transition: 0s`), WCAG 2.2 AA (tương phản $\ge 4.5:1$, không phụ thuộc màu), kích thước nút tương tác ($\ge 44 \times 44\text{px}$) và dữ liệu chuẩn T01–T08 đã được quy định nhất quán và sẵn sàng để mã hóa.
4. **Đề xuất Bước tiếp theo**:
   - Bàn giao báo cáo này cho `orchestrator` để chỉ đạo Worker Pods triển khai đồng thời 2 file nguyên mẫu `directions/option_a/index.html` và `directions/option_b/index.html` cùng hệ tài nguyên `assets/`.

---

## 5. Verification Method (Phương pháp Kiểm chứng Độc lập)

Để độc lập thẩm định tính đúng đắn của các phân tích và kiến trúc trong báo cáo này:

1. **Kiểm chứng Sự tồn tại & Trạng thái File**:
   - Kiểm tra `directions/option_a/` và `directions/option_b/` bằng `list_dir`.
   - Kiểm tra các phần tương ứng trong `DESIGN_TRAINING_MODULE_012_DIRECTIVE.md` (Mục 3.3, 4.6, 5, 6, 9, 11, 14, 17, 23).
2. **Kiểm chứng Bộ Dữ liệu Chuẩn (Canonical Operational Snapshot)**:
   - Đối chiếu từng tuple trong bảng dữ liệu của Hướng A và Hướng B với Mục 4.6 của Directive:
     * T01: Hạ Long 2N1Đ, Lan, Chờ đối tác, Khách sạn chưa xác nhận 4 phòng.
     * T02–T08: Ninh Bình, Sapa, Đà Nẵng, Hà Giang, Phú Quốc, Mộc Châu, Huế khớp 100%.
3. **Kiểm chứng Bất biến Zero-Motion trên Trình duyệt**:
   - Chạy script kiểm tra computed style trên console của trình duyệt ở cả 2 hướng:
     ```javascript
     const nonZero = Array.from(document.querySelectorAll('*')).filter(el => {
       const cs = window.getComputedStyle(el);
       return (cs.animationDuration !== '0s' && cs.animationDuration !== '') ||
              (cs.transitionDuration !== '0s' && cs.transitionDuration !== '');
     });
     console.log('Violating Zero-Motion elements count:', nonZero.length); // Phải bằng 0
     ```
4. **Kiểm chứng Kích thước Target và Tương phản**:
   - Đo kích thước bounding box của tất cả thẻ bấm: `Math.min(el.offsetWidth, el.offsetHeight) >= 44`.
   - Kiểm tra tỷ lệ tương phản văn bản qua Lighthouse hoặc Axe Accessibility Auditor đạt điểm 100% WCAG AA.
5. **Điều kiện Vô hiệu hóa (Invalidation Conditions)**:
   - Nếu bất kỳ thuộc tính chuyển động nào có `duration > 0s` $\implies$ Toàn bộ module bị FAIL (Vi phạm Test T12).
   - Nếu hai hướng A và B chỉ khác nhau về màu sắc nhưng dùng chung cấu trúc grid và typography $\implies$ Vi phạm Blocking Gate B01.
   - Nếu dữ liệu T01–T08 bị thay đổi hoặc thêm bớt các chỉ số doanh thu giả lập $\implies$ Vi phạm Blocking Gate B06 & B08.

---
*Báo cáo được hoàn thành bởi `explorer_m0_prototypes` theo đúng chuẩn giao tiếp Handoff Protocol và Bilingual Terminology Protocol.*
