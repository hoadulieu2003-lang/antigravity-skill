# TEST MATRIX DRAFT — TRIPFLOW Daily Departure Brief (Module 12)

> **Mã chỉ thị (Directive ID)**: `DESIGN_TRAINING_MODULE_012`  
> **Phân luồng kiến trúc (Stream)**: `Stream B — Expressive Experience`  
> **Sản phẩm nghiệp vụ (Product)**: `TRIPFLOW — Bảng điều phối tour khởi hành (Daily Departure Brief)`  
> **Chủ quản sản phẩm (Product Owner / Lead Architect)**: `Anh — Lead Architect / Product Owner`  
> **Cộng sự kỹ thuật (AI Pair-Programmer)**: `Em — Senior Engineering Agent / Lead Implementer`  
> **Tác tử thi công (Implementer)**: `worker_p0_p1_replace`  
> **Không gian làm việc (Workspace)**: `design-training/stream-b/module-012/`  
> **Khung kiểm thử quy định**: **8 Cổng Chặn Tuyệt Đối (B01–B08) & 14 Bài Kiểm Thử Khóa Cứng (T01–T14)**  

---

## 1. Tổng Quan Kiến Trúc Kiểm Thử (Testing Architecture Overview)

Khung kiểm thử `TEST_MATRIX_DRAFT.md` là bản thiết kế đặc tả chi tiết phục vụ cho việc xây dựng bộ kịch bản kiểm thử tự động `verify_module_012.js` tại Phase 3 (Candidate & Verification). Hệ thống kiểm chứng vận hành theo hai tầng kiểm soát khắt khe:

1. **Tầng 1: 8 Cổng Chặn Tuyệt Đối (8 Blocking Gates B01–B08)**:
   - Các cổng chặn mang tính sống còn (`Fatal Gates`). Nếu bất kỳ cổng nào không đạt (`FAIL`), toàn bộ Module 12 sẽ bị đánh trượt ngay lập tức mà không xét đến điểm số Rubric.
2. **Tầng 2: 14 Bài Kiểm Thử Khóa Cứng (14 Locked Verification Tests T01–T14)**:
   - Đo lường định lượng và định tính các tiêu chí kỹ thuật, giao diện, khả năng tiếp cận, tính toàn vẹn dữ liệu và hiệu suất tài nguyên.
   - Kết quả thực thi được xuất tự động ra tệp `VERIFICATION.json` và được đối soát chéo với 10 ảnh chụp màn hình kiểm chứng chuẩn mực (`Authoritative DPR=2 Screenshots`).

---

## 2. Đặc Tả 8 Cổng Chặn Tuyệt Đối (Detailed Specifications for 8 Blocking Gates B01–B08)

Tuân thủ Section 16 và Section 21 của Directive:

| Cổng Chặn (Blocking Gate) | Tên Cổng Chặn (Gate Title) | Điều Kiện Tiên Quyết (Precondition) | Tiêu Chí Đạt Tuyệt Đối (Mandatory Pass Criteria) | Chế Tài Khi Thất Bại (Failure Consequence) |
| :---: | :--- | :--- | :--- | :--- |
| **B01** | **Strategic Divergence (Phân kỳ Chiến lược)** | Đã xây dựng hoàn tất hai nguyên mẫu `directions/option_a/index.html` và `directions/option_b/index.html`. | Hai hướng bắt buộc phải khác biệt chiến lược trên tối thiểu **5/7 trục**: 1. Personality; 2. Composition; 3. Typography; 4. Image Style; 5. Crop/Perspective; 6. Icon/Diagram; 7. Texture. Không chấp nhận việc chỉ đổi bảng màu mà giữ nguyên hệ lưới. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B02** | **Brand Traceability (Truy vết Thương hiệu)** | File `BRAND_THESIS.md` có đầy đủ 2 thesis statements và bảng ánh xạ 8 quyết định thị giác. | Toàn bộ 8 quyết định thị giác (`VD_01` tới `VD_08`) phải được tìm thấy chính xác trong mã nguồn HTML/CSS (khớp Selector và Design Token) của các bản mẫu. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B03** | **Image System Consistency (Nhất quán Hệ thống Ảnh)** | File `IMAGE_LANGUAGE_MATRIX.md` đầy đủ 6 vai trò và thư mục `assets/` đã sinh tài nguyên. | Tài nguyên thực tế trong `assets/` và hiển thị trên giao diện phải nhất quán 100% về vai trò, tỷ lệ cắt cúp 3 viewport, ánh sáng và cơ chế dự phòng (`Image Failure Parity`). | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B04** | **Iconography Consistency (Nhất quán Biểu tượng)** | Có đủ 6 biểu tượng nghiệp vụ vector trong thư mục `assets/icons/`. | Cả 6 icon tuân thủ chung hệ lưới viewBox 24×24, chung độ dày nét, hình học đồng nhất; nhãn chữ đi kèm bảo đảm hiển thị đầy đủ ngữ nghĩa khi ẩn icon; không dùng emoji/icon font. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B05** | **Provenance & Local Asset Integrity (Toàn vẹn Nguồn gốc)** | Tồn tại tệp khai báo `assets/ASSET_MANIFEST.yaml`. | 100% tài nguyên đồ họa được khai báo trong manifest kèm mã băm SHA-256 thực tế, nguồn gốc hợp pháp, gắn nhãn minh bạch (`disclosure`); số lượng kết nối mạng ra bên ngoài bằng 0 (`remote_runtime_requests: 0`). | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B06** | **Honest Expression & Data Fidelity (Biểu đạt Trung thực)** | Dữ liệu 8 tour được nhúng vào giao diện. | Tuyệt đối không đưa ra tuyên bố thị trường giả tạo; không mạo danh đối tác thật; không xuất hiện 4 anti-personalities bị cấm; dữ liệu 8 tour T01–T08 khớp chính xác 100% với Canonical Snapshot. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B07** | **Responsive Accessibility (Khả năng Tiếp cận Responsive)** | Trang web được render trên trình duyệt tại 3 viewport: 1440×900, 768×1024, 390×844. | Không sinh thanh cuộn ngang (`scrollWidth <= clientWidth`); vùng bấm tương tác tối thiểu `44×44 CSS px`; độ tương phản văn bản đạt chuẩn WCAG 2.2 AA ($\ge 4.5:1$); alt text đầy đủ và có ngữ nghĩa. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |
| **B08** | **Evidence Integrity (Tính Toàn vẹn Của Minh Chứng)** | Hoàn thành bộ kiểm thử tự động, xuất tệp kết quả và ảnh chụp màn hình. | Bộ test không sửa đổi dữ liệu đóng băng; kết quả `VERIFICATION.json`, 10 ảnh screenshot DPR=2, file báo cáo `DESIGN_TRAINING_012_REPORT.md` và file nén submission ZIP khớp nhau 100%. | **TRƯỢT TOÀN BỘ (Module Incomplete)** |

---

## 3. Đặc Tả Chi Tiết 14 Bài Kiểm Thử Khóa Cứng T01–T14 (Detailed Specifications for 14 Locked Tests)

Tuân thủ nghiêm ngặt quy định tại Section 17 của Directive:

### T01 — Workspace & Source Snapshot Integrity
- **Cổng chặn liên kết**: `B05, B08`.
- **Điều kiện tiên quyết (`precondition`)**: Workspace đặt tại `stream-b/module-012/`; tệp zip snapshot Module 07 tồn tại tại `source_snapshot/design_training_007_submission_r04.zip`.
- **Phương pháp kiểm thử (`method`)**:
  - Quét toàn bộ hệ thống file để xác nhận không có bất kỳ thao tác đọc/ghi nào sang `stream-a/`.
  - Tính mã băm SHA-256 thực tế của `source_snapshot/design_training_007_submission_r04.zip` và so sánh với giá trị kỳ vọng.
- **Giá trị đo lường (`measured`)**: Đường dẫn workspace, kết quả đối soát tham chiếu chéo, chuỗi mã băm SHA-256.
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**:
  - `stream-a` cross-reads: `0`.
  - SHA-256 zip match: `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76` (Khớp 100%).
- **Đường dẫn minh chứng (`evidence_paths`)**: `CHANGE_LEDGER.md`, `VERIFICATION.json (test_t01)`.

---

### T02 — Canonical Operational Content Integrity
- **Cổng chặn liên kết**: `B06, B08`.
- **Điều kiện tiên quyết (`precondition`)**: Bản mẫu hoặc ứng viên đang mở hiển thị bảng dữ liệu 8 tour.
- **Phương pháp kiểm thử (`method`)**:
  - Trích xuất dữ liệu của 8 tour từ DOM và so khớp sâu (`deep-compare`) với 8 tuples chuẩn mục tại Section 4.6 của Directive.
  - Kiểm tra tour T01 có đầy đủ các dấu hiệu ưu tiên khẩn cấp: Giờ khởi hành 14/09 07:30, phụ trách Lan, trạng thái "Chờ đối tác", vấn đề "Khách sạn chưa xác nhận 4 phòng".
  - Quét toàn trang tìm kiếm từ khóa cấm: Không có số liệu doanh thu bịa đặt, không có logo khách sạn thật.
- **Giá trị đo lường (`measured`)**: Số tour khớp dữ liệu (8/8), tỷ lệ chính xác của focal tour T01, số từ khóa vi phạm (0).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: 100% khớp dữ liệu 8 tour; T01 là focal tour; 0 từ khóa vi phạm.
- **Đường dẫn minh chứng (`evidence_paths`)**: `candidate/index.html`, `VERIFICATION.json (test_t02)`.

---

### T03 — Direction Strategic Divergence
- **Cổng chặn liên kết**: `B01`.
- **Điều kiện tiên quyết (`precondition`)**: Hai tệp nguyên mẫu `directions/option_a/index.html` và `directions/option_b/index.html` đã được xây dựng hoàn chỉnh.
- **Phương pháp kiểm thử (`method`)**:
  - Trích xuất computed styles, cây DOM, cấu trúc layout grid, tỷ lệ typography, style ảnh, thuộc tính icon và texture của cả hai hướng.
  - Đánh giá sự khác biệt trên 7 trục chiến lược: 1. personality, 2. composition, 3. typography, 4. image source/style, 5. crop/perspective, 6. icon/diagram, 7. texture.
- **Giá trị đo lường (`measured`)**: Số trục chiến lược phân kỳ thực tế (trên thang 7).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Số trục phân kỳ $\ge 5/7$.
- **Đường dẫn minh chứng (`evidence_paths`)**: `directions/option_a/`, `directions/option_b/`, `VERIFICATION.json (test_t03)`.

---

### T04 — Brand Traceability Verification
- **Cổng chặn liên kết**: `B02`.
- **Điều kiện tiên quyết (`precondition`)**: Tệp `BRAND_THESIS.md` có bảng 8 visual decision mappings `VD_01` tới `VD_08`.
- **Phương pháp kiểm thử (`method`)**:
  - Phân tích cú pháp HTML/CSS của các bản mẫu để tìm kiếm sự hiện diện của các DOM selector và Design Token tương ứng với từng quyết định thị giác.
  - Xác nhận rằng mỗi quyết định thị giác đều tồn tại và được render đúng kiểu dáng đã cam kết.
- **Giá trị đo lường (`measured`)**: Số quyết định thị giác tìm thấy và khớp hợp đồng (trên thang 8).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Đạt đúng 8/8 quyết định thị giác có thể truy vết được.
- **Đường dẫn minh chứng (`evidence_paths`)**: `BRAND_THESIS.md`, `candidate/index.html`, `VERIFICATION.json (test_t04)`.

---

### T05 — Asset Manifest & Provenance Integrity
- **Cổng chặn liên kết**: `B05`.
- **Điều kiện tiên quyết (`precondition`)**: Thư mục `assets/` và tệp `assets/ASSET_MANIFEST.yaml` tồn tại.
- **Phương pháp kiểm thử (`method`)**:
  - Quét toàn bộ các thẻ `<img>`, `<svg>`, `<link>`, `@font-face` trong DOM để trích xuất danh sách tài sản runtime.
  - Đối chiếu danh sách này với `ASSET_MANIFEST.yaml`; kiểm tra mã băm SHA-256 thực tế của từng tệp trên ổ cứng.
  - Lắng nghe network requests trong phiên kiểm thử tự động để xác nhận không có bất kỳ request nào ra ngoài localhost.
- **Giá trị đo lường (`measured`)**: Tỷ lệ tài sản có trong manifest (100%), số tệp sai hash (0), số request ra ngoài internet (0).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: 100% manifest match, 0 unlisted assets, 0 remote requests.
- **Đường dẫn minh chứng (`evidence_paths`)**: `assets/ASSET_MANIFEST.yaml`, `VERIFICATION.json (test_t05)`.

---

### T06 — Image Role & Responsive Crop Behavior
- **Cổng chặn liên kết**: `B03, B07`.
- **Điều kiện tiên quyết (`precondition`)**: Trang web được nạp tại 3 viewport chuẩn (1440×900, 768×1024, 390×844).
- **Phương pháp kiểm thử (`method`)**:
  - Đo đạc bounding box, aspect-ratio và computed `object-position` của từng vai trò tài sản hình ảnh trên cả 3 viewport.
  - Xác nhận focal point không bị trôi làm cắt mất chủ thể chính (bến tàu T01, avatar Lan).
  - Kiểm tra xem ảnh có gây xô lệch bố cục hay đẩy các bảng dữ liệu ra khỏi vùng hiển thị hợp lý không.
- **Giá trị đo lường (`measured`)**: Tỷ lệ khung hình và tọa độ focal point thực tế trên từng viewport.
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Cắt cúp đúng thông số ma trận; không che khuất chủ thể; không vỡ layout.
- **Đường dẫn minh chứng (`evidence_paths`)**: `screenshots/` (10 authoritative images), `VERIFICATION.json (test_t06)`.

---

### T07 — Image Failure Parity & Graceful Degradation
- **Cổng chặn liên kết**: `B03, B07`.
- **Điều kiện tiên quyết (`precondition`)**: Thiết lập chế độ chặn toàn bộ request tài nguyên hình ảnh thực tế (bao gồm tất cả các tệp `.svg`, `.png`, `.webp`, `.jpg`), hoặc thay đổi thuộc tính `src` của toàn bộ thẻ `<img>` sang đường dẫn lỗi có chủ đích (`broken-asset.svg`).
- **Phương pháp kiểm thử (`method`)**:
  - Tải lại trang web trong trạng thái toàn bộ ảnh và vector hình ảnh bị lỗi tải; kiểm tra xem các phần tử chứa ảnh (`figure`, `.hero-image-wrap`, `.carto-image-wrap`, `.operator-avatar-wrap`) có giữ nguyên tỷ lệ khung hình (`aspect-ratio`, chiều cao) hay bị sụp đổ bố cục (`zero-height collapse`).
  - Kiểm tra xem văn bản thay thế `alt` có được hiển thị rõ ràng để truyền tải trọn vẹn ngữ cảnh của tour T01 và nhân vật Lan.
  - Xác nhận toàn bộ thông tin nghiệp vụ cốt lõi, bảng Canonical Snapshot T01–T08, chuỗi mốc lộ trình và 100% các nút bấm chức năng CTA tương tác vẫn hoạt động hoàn hảo.
- **Giá trị đo lường (`measured`)**: Chiều cao container khi ảnh lỗi (giữ nguyên > 0px); hiển thị alt fallback text (100%); khả năng thao tác điều phối tour T01 (100%).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Không vỡ bố cục; thông tin điều phối và khả năng tương tác bảo toàn 100%.
- **Đường dẫn minh chứng (`evidence_paths`)**: `screenshots/candidate-image-failure-desktop.png`, `VERIFICATION.json (test_t07)`.

---

### T08 — Alternative Text & Accessibility Semantics
- **Cổng chặn liên kết**: `B03, B07`.
- **Điều kiện tiên quyết (`precondition`)**: Trang web đã nạp đầy đủ DOM.
- **Phương pháp kiểm thử (`method`)**:
  - Duyệt toàn bộ thẻ `<img>` và `<svg>`:
    - Ảnh Informative (Hero, Scene, Avatar) phải có thuộc tính `alt` chứa văn bản mô tả ngữ cảnh có ý nghĩa.
    - Ảnh Decorative hoặc icon có nhãn đi kèm phải có `alt=""` hoặc `aria-hidden="true"`.
    - Route Diagram phải có liên kết hoặc cấu trúc thẻ `<ol>` văn bản tương đương hỗ trợ máy đọc màn hình.
- **Giá trị đo lường (`measured`)**: Số ảnh thiếu alt (0), số ảnh có alt rác/sáo rỗng (0), sự tồn tại của văn bản tương đương cho diagram.
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: 100% tuân thủ W3C Images Tutorial & Alt Decision Tree.
- **Đường dẫn minh chứng (`evidence_paths`)**: `candidate/index.html`, `VERIFICATION.json (test_t08)`.

---

### T09 — Iconography Consistency & Label Pairing
- **Cổng chặn liên kết**: `B04`.
- **Điều kiện tiên quyết (`precondition`)**: 6 biểu tượng nghiệp vụ được hiển thị trên giao diện.
- **Phương pháp kiểm thử (`method`)**:
  - Kiểm tra thuộc tính SVG của cả 6 biểu tượng: viewBox `0 0 24 24`, `stroke-width`, `fill`, `stroke`.
  - Ẩn toàn bộ phần tử SVG bằng CSS (`display: none !important`) và kiểm tra xem nhãn văn bản đi kèm có hiển thị trọn vẹn ngữ nghĩa của 6 trạng thái hay không.
- **Giá trị đo lường (`measured`)**: Số biểu tượng đạt chuẩn viewBox (6/6), độ dày nét đồng nhất, tỷ lệ nhãn văn bản hiển thị đầy đủ (100%).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Đạt chuẩn hình học đồng bộ 100%; không phụ thuộc đơn lẻ vào icon.
- **Đường dẫn minh chứng (`evidence_paths`)**: `assets/icons/`, `VERIFICATION.json (test_t09)`.

---

### T10 — Responsive Layout & Touch Target Integrity
- **Cổng chặn liên kết**: `B07`.
- **Điều kiện tiên quyết (`precondition`)**: Trình duyệt render trang tại Desktop (1440px), Tablet (768px) và Mobile (390px).
- **Phương pháp kiểm thử (`method`)**:
  - Đo đạc `document.documentElement.scrollWidth` so với `window.innerWidth` trên cả 3 viewport để phát hiện hiện tượng tràn màn hình ngang.
  - Đo kích thước bounding box của toàn bộ các phần tử tương tác (`<button>`, `<a>`, `<input>`, thẻ tab): Chiều rộng và chiều cao phải đạt tối thiểu `44 CSS px`.
- **Giá trị đo lường (`measured`)**: Chênh lệch tràn ngang `scrollWidth - innerWidth` (phải bằng 0), kích thước nhỏ nhất của interactive target.
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Không tràn ngang (0px horizontal overflow); mọi touch target $\ge 44 \times 44\text{ px}$.
- **Đường dẫn minh chứng (`evidence_paths`)**: `VERIFICATION.json (test_t10)`.

---

### T11 — Visual Contrast & Non-Color Meaning
- **Cổng chặn liên kết**: `B07`.
- **Điều kiện tiên quyết (`precondition`)**: Toàn bộ văn bản và thẻ trạng thái được hiển thị.
- **Phương pháp kiểm thử (`method`)**:
  - Tính toán tỷ lệ tương phản màu văn bản so với nền theo thuật toán WCAG 2.2 AA.
  - Chuyển toàn bộ trang sang thang độ xám (`grayscale(100%)`) và kiểm tra xem người dùng có còn phân biệt được các trạng thái vận hành qua nhãn chữ và ký hiệu hình học hay không.
- **Giá trị đo lường (`measured`)**: Tỷ lệ tương phản thấp nhất của chữ thường ($\ge 4.5:1$), tỷ lệ tương phản chữ lớn ($\ge 3:1$), số trạng thái chỉ dùng màu đơn thuần (0).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Đạt chuẩn WCAG 2.2 AA trên 100% phần tử; không phụ thuộc màu sắc.
- **Đường dẫn minh chứng (`evidence_paths`)**: `VERIFICATION.json (test_t11)`.

---

### T12 — Absolute Zero-Motion Mandate
- **Cổng chặn liên kết**: `B08`.
- **Điều kiện tiên quyết (`precondition`)**: Trang web nạp đầy đủ CSS và DOM.
- **Phương pháp kiểm thử (`method`)**:
  - Duyệt đệ quy toàn bộ các phần tử trong DOM và đọc `window.getComputedStyle(element)`:
    - Kiểm tra `animation-duration` và `transition-duration` phải bằng `'0s'`.
    - Kiểm tra `animation-name` là `'none'`.
  - Quét mã nguồn JavaScript để xác nhận không có script nào can thiệp vào sự kiện cuộn chuột (`scroll hijack`) hoặc tạo hiệu ứng parallax/3D transform.
- **Giá trị đo lường (`measured`)**: Số phần tử có transition/animation duration khác 0s (0); số hiệu ứng parallax/3D (0).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: 100% phần tử tuân thủ Zero-Motion tuyệt đối.
- **Đường dẫn minh chứng (`evidence_paths`)**: `VERIFICATION.json (test_t12)`.

---

### T13 — Asset Performance Budget & Network Economy
- **Cổng chặn liên kết**: `B05, B07`.
- **Điều kiện tiên quyết (`precondition`)**: Toàn bộ tệp trong thư mục `assets/` đã được tạo lập.
- **Phương pháp kiểm thử (`method`)**:
  - Đo đạc dung lượng từng tệp raster (PNG, WebP, JPG): Không tệp nào được vượt quá `600 KB` (`600,000 bytes`).
  - Tính tổng dung lượng toàn bộ thư mục `assets/`: Không được vượt quá `3.5 MB` (`3,500,000 bytes`).
  - Kiểm tra xem các thẻ `<img>` có thuộc tính `width`, `height` và cờ `loading="lazy"` không.
- **Giá trị đo lường (`measured`)**: Dung lượng tệp lớn nhất, tổng dung lượng runtime asset, số thẻ ảnh thiếu thuộc tính kích thước.
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Tệp đơn lẻ $\le 600\text{ KB}$, tổng dung lượng $\le 3.5\text{ MB}$, đầy đủ width/height/lazy.
- **Đường dẫn minh chứng (`evidence_paths`)**: `ASSET_MANIFEST.yaml`, `VERIFICATION.json (test_t13)`.

---

### T14 — Evidence & Package Parity
- **Cổng chặn liên kết**: `B08`.
- **Điều kiện tiên quyết (`precondition`)**: Hoàn thành kiểm thử tự động, xuất tệp báo cáo và tạo gói nộp ZIP R01.
- **Phương pháp kiểm thử (`method`)**:
  - Kiểm tra danh mục 10 tệp ảnh chụp màn hình kiểm chứng độc lập (DPR=2) trong thư mục `screenshots/`.
  - Đối chiếu mã băm và kết quả trong `VERIFICATION.json` với nội dung báo cáo nghiệm thu `DESIGN_TRAINING_012_REPORT.md` và tệp nộp cuối cùng.
  - Xác nhận không có bất kỳ mâu thuẫn hay sai lệch số liệu nào giữa các tài liệu bằng chứng.
- **Giá trị đo lường (`measured`)**: Số lượng ảnh screenshot hợp lệ (đúng 10 ảnh), tỷ lệ khớp số liệu giữa JSON và Markdown (100%).
- **Tiêu chuẩn Pass/Fail (`pass_threshold`)**: Tính toàn vẹn của bằng chứng đạt 100% tuyệt đối.
- **Đường dẫn minh chứng (`evidence_paths`)**: `SCREENSHOT_MANIFEST.json`, `VERIFICATION.json (test_t14)`.

---

## 4. Kết Luận & Chuyển Giao Cho Bộ Test Tự Động (Test Architecture Handoff Conclusion)

Tài liệu `TEST_MATRIX_DRAFT.md` hoàn thiện khung lý thuyết kiểm thử cho Module 12:
1. Xác lập rõ ràng ranh giới sinh tử của **8 Cổng Chặn Tuyệt Đối (B01–B08)**, ngăn ngừa mọi biểu hiện suy thoái chất lượng hoặc làm giả kết quả.
2. Cung cấp đặc tả đầu vào, thuật toán đo lường và ngưỡng pass/fail cho **14 Bài Kiểm Thử Khóa Cứng (T01–T14)**, tạo điều kiện thuận lợi nhất để QA Implementer lập trình bộ script kiểm thử tự động `verify_module_012.js`.

---

## 5. Bảng Phân Rã Kế Hoạch 79 Khẳng Định Kiểm Thử Vào 14 Bài Test Khóa Cứng (79 Planned Assertions Architecture)

Tài liệu này xác định **khung kế hoạch kiểm thử (Test Plan)** cho Phase 4–6. Toàn bộ 14 bài test T01–T14 và 79 assertions dưới đây hiện ở trạng thái **LẬP KẾ HOẠCH (PLANNED / NOT_RUN)** và sẽ được thực thi trên `candidate/index.html` sau khi vượt qua Checkpoint 12.1 và Selection Gate (Phase 3). 

Tại thời điểm Checkpoint 12.1, các phép đo đã thực thi được ghi nhận độc lập trong tệp máy đọc `CHECKPOINT_VERIFICATION.json`. Các kiểm tra bổ sung (supplemental checks) được gắn nhãn `NON_BLOCKING`.

```yaml
planned_locked_tests: 14
planned_assertions: 79
executed_locked_tests_at_checkpoint: 0
executed_checkpoint_checks: 18
final_verdict: NOT_RUN
```

| Mã Bài Test | Tên Bài Kiểm Thử Khóa Cứng | Số Assertions Dự Kiến | Chi Tiết Phép Đo Khẳng Định Kế Hoạch (Planned Assertions Scope) | Trạng Thái Checkpoint 12.1 |
| :---: | :--- | :---: | :--- | :---: |
| **T01** | Workspace & Source Integrity | **5** | (1) Đúng thư mục cô lập stream-b/module-012/; (2) 0 tệp vi phạm sang stream-a/; (3) Tệp snapshot Module 07 tồn tại; (4) SHA-256 snapshot khớp e76ab08f...c76; (5) CHANGE_LEDGER.md ghi nhận đầy đủ. | **PLANNED** |
| **T02** | Canonical Operational Content | **10** | (1–8) So khớp sâu 8 tour tuples T01–T08 khớp 100% dữ liệu gốc; (9) Tour T01 giữ vị trí tâm điểm khẩn cấp; (10) Không xuất hiện claim doanh thu hay thương hiệu đối tác bịa đặt. | **PLANNED** |
| **T03** | Strategic Divergence (7 Trục) | **7** | (1) Personality phân kỳ; (2) Composition phân kỳ; (3) Typography phân kỳ; (4) Image style phân kỳ; (5) Crop/perspective phân kỳ; (6) Icon/diagram phân kỳ; (7) Surface texture phân kỳ. | **PLANNED** |
| **T04** | Brand Traceability (VD_01–08) | **8** | (1–8) Kiểm tra sự hiện diện thực tế của 8 quyết định thị giác VD_01 tới VD_08 trong cấu trúc CSS và DOM của candidate. | **PLANNED** |
| **T05** | Asset Manifest & Zero-Remote | **15** | (1–14) 14 tệp đồ họa vector/texture trong assets/ khớp mã băm SHA-256; (15) Số lượng yêu cầu mạng ngoại vi bằng 0 (remote_runtime_requests: 0). | **PLANNED** |
| **T06** | Crop & Viewport Behavior | **6** | (1–3) Bảo toàn điểm nhìn trọng tâm focal point trên Option A ở 3 viewports; (4–6) Bảo toàn điểm nhìn trên Option B ở 3 viewports. | **PLANNED** |
| **T07** | Image Failure Parity | **4** | (1) Kích thước container giữ nguyên khi ảnh lỗi; (2) Không sinh biểu tượng broken image vỡ khung; (3) Text fallback hiển thị đầy đủ; (4) Nút bấm CTA và trạng thái vẫn thao tác được. | **PLANNED** |
| **T08** | Alternative Text Semantics | **6** | (1) Ảnh trang trí gắn alt=""; (2) Ảnh informative có alt ngữ nghĩa; (3) Icon chức năng có accessible name; (4) Sơ đồ lộ trình có W3C ol.sr-only; (5) Không dùng tên tệp làm alt; (6) Alt không nhồi nhét từ khóa. | **PLANNED** |
| **T09** | Iconography Consistency | **6** | (1–6) 6 icon khởi hành, chờ đối tác, thiếu hồ sơ, sẵn sàng, người phụ trách, nhật ký liên hệ tuân thủ cùng viewBox 24x24 và cùng độ dày nét vẽ 1.75px. | **PLANNED** |
| **T10** | Responsive & Touch Targets | **4** | (1) 0 tràn ngang ở 1440px; (2) 0 tràn ngang ở 768px; (3) 0 tràn ngang ở 390px; (4) 100% vùng bấm tương tác đạt diện tích tối thiểu 44×44 CSS px. | **PLANNED** |
| **T11** | Contrast & Focus Accessibility | **4** | (1) Tương phản chữ chính đạt WCAG AA; (2) Tương phản chữ phụ đạt WCAG AA; (3) Focus indicator nhìn thấy rõ ràng; (4) Không truyền tải trạng thái duy nhất bằng màu sắc. | **PLANNED** |
| **T12** | Absolute Zero-Motion Mandate | **2** | (1) Toàn bộ phần tử DOM có animationDuration === "0s"; (2) Toàn bộ phần tử DOM có transitionDuration === "0s". | **PLANNED** |
| **T13** | Asset Performance Budget | **4** | (1) Dung lượng từng tệp <= 600 KB; (2) Tổng dung lượng runtime asset <= 3.5 MB; (3) Thẻ ảnh có kích thước tường minh width/height; (4) Ảnh lazy-loaded hợp lý. | **PLANNED** |
| **T14** | Evidence & Package Parity | **2** | (1) Ảnh chụp màn hình DPR=2 khớp danh mục; (2) Toàn bộ kết quả kiểm thử nhất quán 100% giữa JSON, Markdown và file ZIP. | **PLANNED** |
| **TỔNG KẾ HOẠCH** | **14 BÀI KIỂM THỬ KHÓA CỨNG** | **79** | **Kế Hoạch Khóa Cứng Cho Phase 4–6 (FINAL VERDICT: NOT_RUN — CHỜ MỞ KHÓA PHASE 3 & 4)** | **NOT_RUN** |

