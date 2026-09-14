# Specification Mining Handoff Report — Module 08: Color System

```yaml
MODULE_ID: DESIGN_TRAINING_008
MODULE_NAME: COLOR_SYSTEM
STREAM_ID: FOUNDATION_INTEGRITY
BRANCH_ID: TAB_A
ARCHETYPE: SPECIFICATION_MINER
STAGE: DISCOVERY_AND_SPECIFICATION_SURVEY
REPORT_DATE: 2026-09-14
TARGET_WORKSPACE: C:\Users\game\.gemini\exercises\stream-a\module_008
TARGET_DELIVERABLE: design_training_008_submission_r01.zip
```

---

## 1. Observation (Quan Sát Trực Tiếp Từ Nguồn Đặc Tả)

Qua việc khảo sát toàn diện 5 tài liệu đặc tả thẩm quyền:
1. `ORIGINAL_REQUEST.md` (Module 08 prompt & Acceptance criteria)
2. `DESIGN_TRAINING_STREAM_A_DIRECTIVE.md` (Chỉ thị Stream A từ Lead Architect & Controller)
3. `DESIGN_TRAINING_008_INITIAL_REVIEW_001.md` (Phán quyết của Architectural Controller Sol với 7 locked corrections P01–P07)
4. `DESIGN_TRAINING_008_PROPOSAL.md` (Đề xuất hệ thống ban đầu của Antigravity)
5. `DESIGN_TRAINING_008_CONTROLLER_FEEDBACK.md` (Tóm tắt phán quyết duyệt thi công của Controller)

Các quan sát trực tiếp và trích dẫn chuẩn mực được ghi nhận như sau:

### 1.1. Mục Tiêu & Bản Chất Hệ Thống
- **Mục tiêu tối thượng**: Chuyển hóa màu sắc từ lựa chọn trang trí ngẫu hứng thành một **hệ thống chức năng toán học (`Mathematical Functional System`)**, có thể giải thích, kiểm tra định lượng và thay đổi mà không gây đứt gãy component (`STREAM_A_DIRECTIVE.md:62-64`).
- **Phạm vi bài tập**: Thiết kế màn hình điều phối TRIPFLOW (`Dispatch Ledger`) quản lý bộ dữ liệu huấn luyện giả lập gồm 4 tour (`TF-801` đến `TF-804`) đại diện cho 4 trạng thái vận hành; triển khai 2 hướng thị giác độc lập (`directions/option_a.html` và `directions/option_b.html`), chọn 1 hướng để xây dựng ứng dụng hoàn chỉnh (`index.html`), kiểm chứng tự động qua `verify_module_008.js` xuất `VERIFICATION.json` và đóng gói nộp `design_training_008_submission_r01.zip`.

### 1.2. Các Điều Khoản Khóa Chặt Bắt Buộc (Locked Corrections P01–P07)
Trích trực tiếp từ `DESIGN_TRAINING_008_INITIAL_REVIEW_001.md`:
- **P01 — Phân biệt Operational Status và Interaction FSM**:
  - `NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS` là **Semantic Operational Status Taxonomy (Phân loại trạng thái vận hành ngữ nghĩa)** của đối tượng tour, tuyệt đối không phải là một finite-state machine hoàn chỉnh (`Lines 59-65`).
  - Phải tách riêng **Interaction FSM (Máy trạng thái tương tác)** cho các tác vụ bất đồng bộ của người dùng: `IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED` (`Lines 73-85`). Không dùng một biến duy nhất cho cả tình trạng tour và trạng thái gửi tác vụ.
- **P02 — Thu hẹp các khẳng định tuyệt đối (Bounded Language & No Pseudo-Science)**:
  - Cấm tuyệt đối các tuyên bố võ đoán chưa có nghiên cứu người dùng thực nghiệm như: *"Thoải mái cho mắt khi trực ca 8–12 tiếng"*, *"Tối ưu cho môi trường ánh sáng mạnh ngoài trời"*, *"Duy trì hoàn hảo trong grayscale"*, *"Không bao giờ được dùng brand hue cho status trong mọi hệ thống"* (`Lines 86-94`).
  - Thay bằng: **Design Hypothesis (Giả thuyết thiết kế)**, **Target Context (Ngữ cảnh mục tiêu)**, hoặc **TRIPFLOW Policy (Chính sách nội bộ TRIPFLOW)**.
  - Phải gắn nhãn rõ ràng cho dữ liệu:
    ```yaml
    DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
    REAL_CUSTOMER_DATA: false
    BUSINESS_PERFORMANCE_CLAIMS: none
    ```
- **P03 — Sửa số liệu tương phản toán học chính xác**:
  - Nghiêm cấm sao chép số ước lượng làm tròn (`15.8:1`, `17.4:1`, `10.2:1`, `4.5:1`). Toàn bộ tỷ lệ tương phản phải được tính chính xác từ công thức Relative Luminance sRGB WCAG 2.2 trên DOM computed styles thực tế (`Lines 103-124`).
- **P04 — Chứng minh Token Provenance đúng cách**:
  - C01 bắt buộc kiểm toán 2 tầng:
    1. Static source audit: xác nhận `Component Token -> Semantic Token -> Primitive Token`. Cấm 100% việc gọi trực tiếp primitive token trong component selector CSS.
    2. Runtime audit: xác nhận giá trị computed style cuối cùng khớp với token đã khai báo (`Lines 125-149`).
- **P05 — Bỏ ngưỡng Delta L tùy ý (No Arbitrary Delta L Cutoff)**:
  - Loại bỏ hoàn toàn điều kiện tự động `Delta L >= 0.02`. C02 được đánh giá qua sự khác biệt thực chất: Canvas temperature, Brand primary role, Border & status treatment, kết hợp Visual Review độc lập của Controller (`Lines 150-164`).
- **P06 — Chỉnh phương pháp kiểm tra Color Independence**:
  - Tách bạch rõ: Automation chỉ khẳng định sự tồn tại của redundant cues (nhãn text tiếng Việt, icon SVG hình học `aria-hidden="true"`). Không tự động kết luận "người dùng phân biệt rõ ràng". Grayscale screenshot và CVD simulations (Deuteranopia, Protanopia qua `feColorMatrix`) là bằng chứng cho Controller thẩm định thị giác (`Lines 165-192`).
- **P07 — Chuẩn hóa Contrast & Focus Acceptance**:
  - Phân loại rõ: Normal text $\ge 4.5:1$, Large text $\ge 3.0:1$, Focus indicator & UI boundary $\ge 3.0:1$.
  - Focus ring phải được kích hoạt bằng native keyboard Tab navigation và đo tương phản với màu nền tiếp giáp (`adjacent color`) tại tối thiểu 3 ngữ cảnh tương tác: Primary CTA, Secondary action/filter, và Interactive tour card (`Lines 193-216`).

---

## 2. Logic Chain (Chuỗi Lập Luận Suy Luận Từ Đặc Tả Đến Kiến Trúc)

1. **Từ Chỉ Thị Stream A $\to$ Tính Bắt Buộc Của Kiểm Chứng Bằng Chứng (`Evidence-Based Delivery`)**:
   - `STREAM_A_DIRECTIVE.md` nhấn mạnh: *"Không được tự tuyên bố hoàn thành dựa trên self-check. Kết quả phải chứng minh được bằng mã nguồn, ảnh thực tế và kiểm thử"*. Do đó, toàn bộ quy trình phát triển Module 08 không chỉ là viết HTML/CSS mà là xây dựng một **Forensic Verification Engine (Cỗ máy kiểm chứng pháp y)** với dữ liệu đo đạc khách quan ghi nhận trong `VERIFICATION.json`.

2. **Từ Yêu Cầu Token 3 Tầng $\to$ Cấu Trúc CSS & Contract Phân Lập Tuyệt Đối**:
   - Để thỏa mãn Gate C01 và locked correction P04, CSS `:root` và file `COLOR_CONTRACT.yaml` phải định nghĩa 3 lớp token tuần tự:
     - Tầng 1: `--primitive-*` (bảng mã hex tĩnh).
     - Tầng 2: `--semantic-*` trỏ tới `var(--primitive-*)`.
     - Tầng 3: `--component-*` trỏ tới `var(--semantic-*)`.
   - Mọi class selector UI (như `.dispatch-card`, `.badge-status`, `.btn-primary`) **CHỈ ĐƯỢC PHÉP** gọi `var(--component-*)`. Việc xuất hiện bất kỳ chuỗi `var(--primitive-*)` nào trong body của CSS rule selector sẽ lập tức làm rớt Gate C01.

3. **Từ Nguyên Tắc Phân Định Vai Trò Màu $\to$ Kiến Trúc Không Mâu Thuẫn Ngữ Nghĩa**:
   - Brand Primary đại diện cho nhận diện thương hiệu và điểm nhấn hành động (`Primary CTA`).
   - Nếu Brand Primary (ví dụ Deep Indigo hoặc Deep Slate) bị dùng làm màu cho trạng thái (ví dụ gán màu brand cho badge SUCCESS hoặc NORMAL), người dùng sẽ nhầm lẫn giữa nút bấm tương tác và nhãn thông tin tĩnh, đồng thời làm mất tính quy chuẩn quốc tế về màu trạng thái (xanh lá = thành công, vàng/cam = chú ý, đỏ = lỗi). Vì vậy, hệ thống bắt buộc phân lập 100% token Brand Primary khỏi các token Operational Status.

4. **Từ Bất Biến Khả Năng Tiếp Cận WCAG 2.2 $\to$ 3 Lớp Nhận Thức Đồng Thời**:
   - Khoảng 8% nam giới và 0.5% nữ giới gặp khiếm khuyết nhận biết màu sắc (CVD). Nếu một badge chỉ hiển thị một chấm tròn màu xanh hoặc đỏ mà không có nhãn text, người mù màu đỏ-xanh lá (Deuteranopia/Protanopia) hoặc người xem trên màn hình đơn sắc sẽ hoàn toàn mất khả năng nhận diện rủi ro.
   - Do đó, quy chuẩn bắt buộc mỗi status badge phải bao gồm đồng thời: (1) Nhãn text tiếng Việt hiển thị, (2) Icon SVG hình học ngữ nghĩa riêng biệt với `aria-hidden="true"`, và (3) Màu nền/chữ/viền có tương phản $\ge 4.5:1$.

5. **Từ Yêu Cầu Tương Tác Bất Đồng Bộ $\to$ Tách Biệt Taxonomy và Interaction FSM**:
   - Một tour có thể có tình trạng vận hành là `ATTENTION` (chưa chốt xe trung chuyển). Khi điều phối viên bấm nút "Rà soát xe trung chuyển", nút bấm đó chuyển trạng thái từ `IDLE` sang `VALIDATING` $\to$ `SAVING` $\to$ `CONFIRMED` (hoặc `FAILURE`).
   - Tình trạng của tour và trạng thái của nút bấm là hai thực thể logic độc lập. Nếu gộp chung, trạng thái tour sẽ bị ghi đè thành `SAVING`, làm méo mó bản chất nghiệp vụ. Việc phân lập taxonomy và FSM là giải pháp kiến trúc chính xác.

6. **Từ Ràng Buộc Bàn Phím Trợ Năng $\to$ Cơ Chế `aria-disabled` Không Cướp Tiêu Điểm**:
   - Trong quá trình gửi tác vụ (`SAVING`), nếu nút bấm bị gán thuộc tính HTML `disabled`, trình duyệt sẽ ngay lập tức tước quyền focus và đẩy tiêu điểm (`Focus Eviction`) về thẻ `<body>`, khiến người dùng điều hướng bằng bàn phím bị lạc hướng hoàn toàn.
   - Giải pháp bắt buộc: Dùng `aria-disabled="true"`, duy trì `tabindex="0"`, chặn sự kiện click bằng JavaScript và cập nhật trực quan bằng CSS `:not([aria-disabled="true"])`.

---

## 3. Caveats (Các Điểm Giới Hạn, Giả Định & Phạm Vi Kiểm Soát)

1. **Dữ Liệu Giả Lập Huấn Luyện (`Synthetic Fixture Only`)**:
   - Dữ liệu 4 tour `TF-801` đến `TF-804` là dữ liệu giả lập cho bài tập huấn luyện, không đại diện cho số liệu vận hành hay hiệu suất kinh doanh thực tế của bất kỳ doanh nghiệp lữ hành nào. Mọi giả thuyết về ca trực 8-12 tiếng chỉ là ngữ cảnh thiết kế giả định (`Design Context Hypothesis`).
2. **Giới Hạn Của Kiểm Thử Tự Động So Với Thẩm Định Con Người**:
   - Kiểm thử tự động qua Puppeteer (`verify_module_008.js`) chỉ kiểm tra được sự hiện diện của DOM elements, giá trị thuộc tính, chuỗi token, kích thước pixel và tỷ lệ tương phản toán học.
   - Script tự động **không thể** đo lường cảm xúc thẩm mỹ hay khả năng nhận biết chủ quan của người dùng. Grayscale inspection và CVD simulation bắt buộc phải qua bước thẩm định thị giác độc lập (`Independent Visual Review`) của Architectural Controller (Sol).
3. **Môi Trường Trình Duyệt Thực Thi**:
   - Cần đảm bảo script `verify_module_008.js` có thể thực thi với Chromium hoặc Google Chrome có sẵn trên hệ điều hành Windows (`C:\Program Files\Google\Chrome\Application\chrome.exe`) với cờ `--headless=new` và `--no-sandbox`.
4. **Phạm Vi Module 08 vs Module 09**:
   - Module 08 tập trung cốt lõi vào **Hệ Thống Màu Sắc (`Color System`)**, độ tương phản, token và chỉ báo không phụ thuộc màu. Các tính năng trợ năng nâng cao như Screen Reader live regions phức tạp, ARIA landmarks toàn diện và Focus Restoration đa tầng sẽ được mở rộng chuyên sâu tại Module 09 (Accessibility).

---

## 4. Conclusion (Kết Luận & Bản Hợp Đồng Kiến Trúc Khóa Chặt)

Hệ thống Module 08 Color System được định hình đầy đủ và chuẩn xác theo 5 trụ cột kỹ thuật:
1. **Kiến Trúc Token Ba Tầng**: Hoàn thiện ánh xạ `Primitive -> Semantic -> Component` trong `COLOR_CONTRACT.yaml` và CSS `:root`.
2. **Hai Hướng Thị Giác Đối Lập Thật Sự**:
   - **Hướng A (Editorial Warm Dispatch)**: Nền giấy Alabaster ấm `#FAF9F6`, Brand Primary Slate Ink `#0F172A`, Focus Amber `#D97706`, Badge dịu nhẹ viền bão hòa cao.
   - **Hướng B (Technical Slate High-Contrast)**: Nền Slate mát lạnh `#F8FAFC`, Brand Primary Technical Indigo `#3730A3`, Focus Cobalt `#2563EB`, Badge viền đậm 1.5px tương phản cao.
3. **Bản Ứng Dụng Hoàn Chỉnh (`index.html`)**: Quản lý 4 tour chuẩn hóa, hỗ trợ FSM tương tác bất đồng bộ không rơi focus, đầy đủ 3 lớp nhận thức thị giác đồng bộ cho mọi trạng thái.
4. **Hệ Thống Kiểm Chứng Tự Động (`verify_module_008.js` & `VERIFICATION.json`)**: Đánh giá toàn diện 7 Gates C01–C07 bằng toán học sRGB Relative Luminance thực tế, chụp ma trận 8 ảnh authoritative DPR=2.
5. **Báo Cáo Chuẩn Mực 8 Phần Của Sol & Gói Nộp Chuẩn**: Phân tách rạch ròi Telemetry, Visual Review và Hypothesis; đóng gói zip với đường dẫn `/` chuẩn Unix.

---

## 5. Verification Method (Phương Pháp Kiểm Chứng Độc Lập)

Bất kỳ kiểm toán viên hoặc subagent kế tiếp nào cũng có thể kiểm chứng tính toàn vẹn của đặc tả và sản phẩm qua các bước sau:

1. **Kiểm tra file hợp đồng & CSS**:
   - Mở `COLOR_CONTRACT.yaml` và file stylesheet của `index.html`, `option_a.html`, `option_b.html`.
   - Tìm kiếm regex: `var\(--primitive-[^)]+\)` bên ngoài phạm vi `:root`.
   - Kết quả kỳ vọng: **0 matches** (không có primitive token nào xuất hiện trong component selectors).
2. **Khởi chạy script kiểm chứng tự động**:
   ```bash
   node verify_module_008.js
   ```
   - Kiểm tra `VERIFICATION.json` xuất ra có đủ 7 gates C01–C07 với trạng thái `passed: true`.
   - Kiểm tra thư mục `screenshots/` có đủ 8 file ảnh PNG đúng kích thước và DPR=2.
3. **Kiểm tra tính hợp lệ của gói nộp zip**:
   ```powershell
   powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::OpenRead('design_training_008_submission_r01.zip').Entries | Select-Object FullName"
   ```
   - Xác nhận tất cả đường dẫn bên trong archive dùng dấu gạch chéo xuôi `/`, không chứa dấu `\`.

---

## Features Discovered (Danh Mục Tính Năng Được Phát Hiện)

| # | Category (Phân loại) | Feature (Tính năng) | Description (Mô tả chi tiết) | Inputs (Đầu vào) | Outputs (Đầu ra) | Error Behavior (Xử lý lỗi) | Discovered Via (Nguồn phát hiện) |
|---|---|---|---|---|---|---|---|
| 1 | Token Architecture | Primitive Layer (`--primitive-*`) | Dải mã hex màu tĩnh thô đánh số theo cấp độ sáng 50-900 cho Slate, Amber, Rose, Emerald, Teal, Indigo | Mã định danh màu vật lý (hex) | Biến CSS Custom Properties tĩnh trên `:root` | Báo lỗi nếu component selector gọi trực tiếp primitive token | `INITIAL_REVIEW_001.md:125-149`, `PROPOSAL.md:21-29` |
| 2 | Token Architecture | Semantic Layer (`--color-*`) | Ánh xạ vai trò ngữ nghĩa của giao diện (canvas, surface, text, border, action, status) vào primitive tokens | Tham chiếu `var(--primitive-*)` | Biến CSS ngữ nghĩa chuẩn hóa | Báo lỗi nếu thiếu vai trò ngữ nghĩa cốt lõi | `INITIAL_REVIEW_001.md:125-149`, `PROPOSAL.md:30-37` |
| 3 | Token Architecture | Component Layer (`--dispatch-*`) | Token trừu tượng cấp linh kiện UI, cho phép override cục bộ và gắn chặt với selector component | Tham chiếu `var(--color-*)` | Biến CSS cục bộ cho từng component | Báo lỗi nếu component selector sử dụng trực tiếp primitive token | `INITIAL_REVIEW_001.md:125-149`, `PROPOSAL.md:38-42` |
| 4 | Token Architecture | Token YAML Contract | Tệp hợp đồng `COLOR_CONTRACT.yaml` định nghĩa cấu trúc phân tầng token, quan hệ phụ thuộc và tỷ lệ tương phản dự kiến | Cấu trúc YAML 3 tầng | Tài liệu máy đọc được phục vụ static audit | Script kiểm chứng báo rớt C01 nếu sai lệch phân tầng | `ORIGINAL_REQUEST.md:19-20`, `STREAM_A_DIRECTIVE.md:99` |
| 5 | Visual Directions | Direction A: Editorial Warm Dispatch | Giao diện điều phối phong cách sổ cái ấm áp, nền Alabaster (#FAF9F6), Brand Deep Slate Ink (#0F172A), Focus Amber (#D97706), badge pastel viền mảnh | Canonical fixture data | `directions/option_a.html` | Báo lỗi nếu thiếu 1 trong 4 trạng thái hoặc sai lệch dữ liệu | `ORIGINAL_REQUEST.md:24`, `PROPOSAL.md:69-74` |
| 6 | Visual Directions | Direction B: Technical Slate High-Contrast | Giao diện điều phối kỹ thuật lạnh, nền Ice Slate (#F8FAFC), Brand Technical Indigo (#3730A3), Focus Cobalt (#2563EB), badge đậm viền 1.5px | Canonical fixture data | `directions/option_b.html` | Báo lỗi nếu thiếu 1 trong 4 trạng thái hoặc sai lệch dữ liệu | `ORIGINAL_REQUEST.md:25`, `PROPOSAL.md:75-80` |
| 7 | Candidate Release | Final Application Candidate | Bản ứng dụng cuối cùng (`index.html`) được lựa chọn và hoàn thiện đầy đủ tương tác trên dữ liệu 4 tour | Hướng A hoặc B được chọn | `index.html` với đầy đủ tính năng | Báo lỗi nếu không đồng bộ với token contract | `ORIGINAL_REQUEST.md:28-34`, `STREAM_A_DIRECTIVE.md:96` |
| 8 | Role Segregation | Brand vs Operational Status Segregation | Phân lập tuyệt đối giữa màu nhận diện thương hiệu/CTA chính và 4 màu trạng thái vận hành | Biến brand vs biến status | Các token riêng biệt, không trùng màu | Cảnh báo kiến trúc nếu dùng màu brand cho status | `INITIAL_REVIEW_001.md:41-44`, `PROPOSAL.md:43-50` |
| 9 | State Segregation | Operational Status Taxonomy Segregation | Tách bạch danh mục phân loại trạng thái vận hành (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`) khỏi FSM tương tác | Trạng thái tour vận hành | Thuộc tính `data-status` trên tour card | Cấm dùng chung biến trạng thái tour với FSM nút bấm | `INITIAL_REVIEW_001.md:59-85 (P01)` |
| 10 | Interaction FSM | Asynchronous Task Submission FSM | Máy trạng thái hữu hạn cho tác vụ tương tác: `IDLE` -> `VALIDATING` -> `SAVING` -> `CONFIRMED` / `FAILURE` | Tác vụ bấm nút của người dùng | Thuộc tính `data-fsm-state` trên interactive button | Chuyển sang FAILURE nếu giả lập lỗi mạng; hỗ trợ retry | `INITIAL_REVIEW_001.md:73-85`, `ORIGINAL_REQUEST.md:33` |
| 11 | Accessibility | Keyboard Focus Retain on Action | Dùng `aria-disabled="true"` thay vì thuộc tính `disabled` khi nút ở trạng thái `SAVING` để không cướp focus | Phím Tab / Enter / Space | Giữ nguyên outline focus trên nút | Rớt tiêu chí trợ năng nếu focus bị đẩy về `document.body` | `ORIGINAL_REQUEST.md:33`, `STREAM_A_DIRECTIVE.md:118` |
| 12 | Color Independence | Three Redundant Sensory Layers | Mỗi status badge hiển thị đồng bộ 3 lớp: (1) Nhãn text tiếng Việt, (2) Icon SVG hình học với `aria-hidden="true"`, (3) Màu sắc | Dữ liệu trạng thái tour | DOM cấu trúc 3 lớp trên từng badge | Rớt Gate C04 nếu chỉ dựa vào màu hoặc chỉ có icon | `ORIGINAL_REQUEST.md:29-32`, `INITIAL_REVIEW_001.md:165-192` |
| 13 | Contrast Math | WCAG 2.2 Mathematical Contrast Engine | Tính toán chính xác tỷ lệ tương phản sRGB relative luminance trên live DOM computed styles | Cặp màu foreground & background | Tỷ lệ tương phản số học (ví dụ: `16.96:1`) | Báo rớt C03 nếu normal text < 4.5:1 hoặc UI/focus < 3.0:1 | `INITIAL_REVIEW_001.md:103-124 (P03), 193-216 (P07)` |
| 14 | Focus Measurement | Multi-Context Focus Indicator Verification | Đo lường `outline-style: solid`, `outline-width >= 2px`, và contrast $\ge 3.0:1$ tại 3 ngữ cảnh tương tác | Phím native keyboard `Tab` | Computed styles của `:focus-visible` | Rớt Gate C05 nếu tương phản outline < 3.0:1 hoặc width < 2px | `INITIAL_REVIEW_001.md:201-210 (P07)` |
| 15 | Responsive Cadence | Zero Horizontal Overflow Check | Đo lường `document.documentElement.scrollWidth <= window.innerWidth` tại 3 viewports (1440x900, 768x1024, 390x844) | Viewports 1440, 768, 390 | Boolean `allViewportsNoOverflow: true` | Rớt Gate C06 nếu phát sinh thanh cuộn ngang | `STREAM_A_DIRECTIVE.md:46-50`, `INITIAL_REVIEW_001.md:240` |
| 16 | Image Artifacts | 8 Authoritative Screenshots Capture | Chụp 8 ảnh định dạng PNG chuẩn xác tại DPR=2 phục vụ thẩm định độc lập | Viewports và bộ lọc đồ họa | 8 file ảnh trong thư mục `screenshots/` | Báo rớt nếu thiếu ảnh hoặc sai tỷ lệ DPR/kích thước | `INITIAL_REVIEW_001.md:246-258`, `ORIGINAL_REQUEST.md:41` |
| 17 | Simulation | Grayscale Inspection Capture | Chụp ảnh với CSS filter `grayscale(100%)` để thẩm định cấp bậc thị giác khi hoàn toàn mất thông tin sắc độ | Candidate tại 1440x900 | `final_grayscale_desktop_1440x900.png` | Rớt visual review nếu hierarchy bị biến mất khi mất hue | `INITIAL_REVIEW_001.md:185-190`, `PROPOSAL.md:52-54` |
| 18 | Simulation | Color Vision Deficiency (CVD) Simulations | Mô phỏng khiếm khuyết thị giác Deuteranopia và Protanopia bằng bộ lọc SVG `feColorMatrix` | Candidate tại 1440x900 | 2 file ảnh mô phỏng CVD trong `screenshots/` | Không được nhầm lẫn giữa CVD simulation và grayscale | `INITIAL_REVIEW_001.md:185-192`, `PROPOSAL.md:55-60` |
| 19 | Forensic Engine | Standalone Verification Engine | Script Node.js `verify_module_008.js` sử dụng Puppeteer để đo đạc và kiểm tra độc lập 7 gates | Source code HTML/CSS/YAML | File báo cáo máy đọc được `VERIFICATION.json` | Thoát với exit code 1 nếu có bất kỳ gate nào thất bại | `ORIGINAL_REQUEST.md:35-43`, `STREAM_A_DIRECTIVE.md:101` |
| 20 | Evidence Report | Sol's 8-Section Comprehensive Report | Báo cáo `DESIGN_TRAINING_008_REPORT.md` tuân thủ nghiêm ngặt 8 phần, phân tách rõ Telemetry, Visual Review, Hypothesis | Kết quả kiểm thử & phân tích | Tài liệu Markdown hoàn chỉnh | Rớt Gate C07 nếu trộn lẫn số đo với suy đoán chủ quan | `STREAM_A_DIRECTIVE.md:165-176`, `INITIAL_REVIEW_001.md:269-283` |
| 21 | Packaging | Portable Submission Archive | Đóng gói toàn bộ mã nguồn, ảnh, báo cáo, hợp đồng vào `design_training_008_submission_r01.zip` theo chuẩn `/` | Danh sách 8 tệp/thư mục bắt buộc | Tệp zip hoàn chỉnh, sẵn sàng nộp | Rớt nếu dùng backslash `\` trong đường dẫn nén zip | `STREAM_A_DIRECTIVE.md:94-104`, `INITIAL_REVIEW_001.md:261-275` |

---

## Edge Cases (Các Tình Huống Biên & Hành Vi Quan Sát Được)

| # | Feature (Tính năng) | Input (Kịch bản / Dữ liệu đầu vào) | Observed Behavior & Contract Requirement (Hành vi & Quy chuẩn bắt buộc) |
|---|---|---|---|
| 1 | Focus Ring Contrast | Focus ring màu Amber (`#D97706`) hiển thị trên nền card trắng (`#FFFFFF`) vs nền card nhạt (`#FAF9F6`) | Tỷ lệ tương phản của `#D97706` trên `#FAF9F6` là `3.0259:1` (đạt ngưỡng tối thiểu `3.0:1`). Tuy nhiên trên nền trắng `#FFFFFF`, tương phản đạt `3.15:1`. Nếu trên một bề mặt tối hơn, Amber có thể rơi dưới `3.0:1`. Khi đó bắt buộc phải sử dụng vòng focus kép 2 lớp (`two-layer ring: white offset + amber ring`) hoặc token focus riêng biệt cho ngữ cảnh đó. |
| 2 | Screen Reader & Non-color Markers | Sử dụng Emoji hệ điều hành (như `⚠️`, `⛔`) làm biểu tượng duy nhất trên badge | Emoji hiển thị khác nhau giữa Windows (Segoe UI Emoji), macOS (Apple Color Emoji), Linux và Android. Hơn nữa, Screen Reader có thể đọc toàn bộ tên emoji (ví dụ "biển báo cảnh báo nguy hiểm màu vàng tam giác"), gây nhiễu loạn luồng đọc. Quy chuẩn bắt buộc: Phải dùng **Inline SVG hình học** với thuộc tính `aria-hidden="true"`, đi kèm nhãn text tiếng Việt tường minh hiển thị rõ ràng. |
| 3 | Focus Eviction on Async Action | Người dùng kích hoạt nút bấm "Rà soát xe trung chuyển", nút chuyển sang FSM state `SAVING` và bị gán thuộc tính `disabled` | Khi phần tử nhận focus nhận thuộc tính HTML `disabled`, trình duyệt lập tức tước quyền focus và ném tiêu điểm về thẻ `<body>`. Người dùng bàn phím bị mất vị trí tương tác và phải bấm Tab lại từ đầu trang. **Quy tắc bất biến**: Sử dụng `aria-disabled="true"`, giữ nguyên `tabindex="0"`, vô hiệu hóa tương tác click bằng CSS `pointer-events: none` hoặc JavaScript listener guard. |
| 4 | Grayscale vs Color Vision Deficiency (CVD) | Báo cáo đồng nhất ảnh chụp `filter: grayscale(100%)` với mô phỏng Deuteranopia hoặc Protanopia | Grayscale loại bỏ 100% sắc độ (Hue) để kiểm tra độ chênh lệch độ chói tương đối (Relative Luminance Delta). Trong khi đó, Deuteranopia (mù xanh lá) và Protanopia (mù đỏ) là sự suy giảm tế bào nón thị giác trong mắt người, vẫn giữ lại các kênh sắc độ xanh dương/vàng. Đánh đồng hai khái niệm này là sai lệch kiến thức khoa học thị giác. Bắt buộc tách thành 2 loại bằng chứng riêng biệt với ma trận SVG `feColorMatrix` xác thực. |
| 5 | Contrast Ratio for Small vs Large Text | Nhãn badge kích thước 12px (hoặc 0.75rem / 0.875rem) in đậm có tỷ lệ tương phản `3.5:1` | Theo WCAG 2.2 SC 1.4.3, chữ được coi là "Large Text" khi đạt tối thiểu `18pt` (`24px`) dạng thường hoặc `14pt` (`18.66px`) dạng đậm. Text của status badge (thường 12px-14px) là **Normal Text**, bắt buộc phải đạt tỷ lệ tương phản tối thiểu **$\ge 4.5:1$**. Tỷ lệ `3.0:1` chỉ áp dụng cho Large Text và Non-text UI boundaries / focus indicators. |
| 6 | Mobile Viewport Layout Containment | Viewport hẹp 390x844 (Mobile) với bảng dữ liệu nhiều cột (Mã tour, Tên tour, Trạng thái, Điều phối viên, Tác vụ) | Nếu giữ nguyên bảng `<table>` cố định chiều rộng, trang web sẽ bị tràn ngang và xuất hiện thanh cuộn ngang màn hình, vi phạm trực tiếp Gate C06 (`scrollWidth <= innerWidth`). Quy tắc thích ứng: Tại breakpoint nhỏ hơn 768px, bảng dữ liệu phải chuyển đổi linh hoạt (`re-compose`) thành dạng thẻ xếp chồng (`Stacked Tour Cards`), đảm bảo `scrollWidth == innerWidth` tuyệt đối. |
| 7 | Static Token Provenance Violation | Lập trình viên viết CSS: `.btn-primary { background: var(--primitive-indigo-700); }` | Mặc dù màu hiển thị trên màn hình vẫn đúng mã hex, nhưng việc component selector tham chiếu trực tiếp primitive token vi phạm quy chuẩn kiến trúc token 3 tầng. Script kiểm chứng tĩnh sẽ phát hiện chuỗi regex `--primitive-` trong CSS selector của component và đánh rớt ngay lập tức Gate C01. |
| 8 | FSM Retry Resilience on Network Failure | Giả lập lỗi kết nối khi điều phối viên bấm gửi tác vụ khẩn cấp ("Kích hoạt phương án dự phòng") | Nút bấm hoặc component card không được treo vô tận ở trạng thái `SAVING`. FSM phải chuyển sang `FAILURE`, hiển thị thông báo lỗi cục bộ, khôi phục trạng thái có thể tương tác (`aria-disabled="false"`), và cung cấp nút "Thử lại" (`Retry`) để phục hồi lỗi mà không cần tải lại toàn bộ trang. |

---

## Chi Tiết Đặc Tả Kỹ Thuật Chuyên Sâu

### A. Chi Tiết Ma Trận 7 Gates C01 Đến C07

#### Gate C01: Token Provenance & Architecture
- **Phương pháp thẩm định**: Kiểm toán 2 tầng (Static Source Audit + Runtime Computed Audit).
- **Quy chuẩn Static**:
  - `COLOR_CONTRACT.yaml` và stylesheet `:root` định nghĩa đúng quan hệ:
    ```
    Primitive Token (hex) -> Semantic Token (vai trò) -> Component Token (linh kiện)
    ```
  - Trong các CSS rule áp dụng cho class giao diện (ví dụ `.dispatch-card`, `.badge`, `.btn`), số lượng tham chiếu trực tiếp đến `--primitive-*` phải bằng đúng **0**.
- **Quy chuẩn Runtime**:
  - Tại runtime trên trình duyệt, các thuộc tính CSS computed của component (ví dụ `background-color`, `color`, `border-color`) phải phản ánh chính xác giá trị hex được định tuyến qua chuỗi token.

#### Gate C02: Strategic Color Directions
- **Phương pháp thẩm định**: So sánh định lượng và thẩm định thị giác độc lập.
- **Dữ liệu đối sánh**: `directions/option_a.html` và `directions/option_b.html` cùng render đúng 4 tour của canonical fixture (`TF-801` đến `TF-804`).
- **Khác biệt chiến lược bắt buộc**:
  - Canvas: Option A ấm (#FAF9F6), Option B lạnh (#F8FAFC).
  - Brand Primary: Option A là Slate Ink (#0F172A), Option B là Technical Indigo (#3730A3).
  - Focus Ring: Option A là Amber (#D97706), Option B là Cobalt (#2563EB).
  - Badge: Option A pastel viền mảnh, Option B tương phản cao viền 1.5px.
  - Lưu ý: Không dùng ngưỡng cắt `Delta L >= 0.02` làm điều kiện tự động.

#### Gate C03: Mathematical Contrast Compliance
- **Công thức tính toán chuẩn mực (W3C WCAG 2.2)**:
  - Cho mỗi kênh $C \in \{R, G, B\}$ chuẩn hóa $[0, 1]$:
    $$\text{Nếu } C_{srgb} \le 0.04045 \implies C_{linear} = \frac{C_{srgb}}{12.92}$$
    $$\text{Ngược lại } C_{linear} = \left(\frac{C_{srgb} + 0.055}{1.055}\right)^{2.4}$$
  - Độ chói tương đối (Relative Luminance):
    $$L = 0.2126 \times R_{linear} + 0.7152 \times G_{linear} + 0.0722 \times B_{linear}$$
  - Tỷ lệ tương phản (Contrast Ratio):
    $$CR = \frac{L_1 + 0.05}{L_2 + 0.05} \quad (\text{với } L_1 \ge L_2)$$
- **Ngưỡng bắt buộc**:
  - Normal text / badge label: **$\ge 4.5:1$**.
  - Large text / header: **$\ge 3.0:1$**.
  - Focus indicator / non-text boundary: **$\ge 3.0:1$**.
- **Bảng số liệu chuẩn mực đã được xác thực (P03)**:
  - `#0F172A` / `#FAF9F6`: `16.9564:1` (PASS $\ge 4.5$)
  - `#475569` / `#FAF9F6`: `7.1973:1` (PASS $\ge 4.5$)
  - `#3730A3` / `#FFFFFF`: `9.9333:1` (PASS $\ge 4.5$)
  - `#2563EB` / `#F8FAFC`: `4.9400:1` (PASS $\ge 4.5$)
  - `#D97706` / `#FAF9F6`: `3.0259:1` (PASS $\ge 3.0$)
  - `#B45309` / `#FEF3C7`: `4.5097:1` (PASS $\ge 4.5$)
  - `#BE123C` / `#FFE4E6`: `5.2352:1` (PASS $\ge 4.5$)
  - `#15803D` / `#DCFCE7`: `4.5669:1` (PASS $\ge 4.5$)
  - `#9A3412` / `#FFEDD5`: `6.3768:1` (PASS $\ge 4.5$)
  - `#9F1239` / `#FFE4E6`: `6.6769:1` (PASS $\ge 4.5$)
  - `#115E59` / `#CCFBF1`: `6.7300:1` (PASS $\ge 4.5$)

#### Gate C04: Color-Independent Usability
- **Phương pháp thẩm định**: Kết hợp tự động hóa DOM + Thẩm định ảnh độc lập.
- **Tiêu chí tự động hóa**:
  - `visible_text_label: true` (Nhãn text tiếng Việt luôn hiển thị).
  - `non_color_marker_present: true` (Icon SVG ngữ nghĩa có mặt).
  - `accessible_name_contains_status: true` (Tên tiếp cận chứa trạng thái).
  - `color_not_sole_signal: true` (Màu không phải tín hiệu duy nhất).
- **Tiêu chí thị giác**:
  - Ảnh Grayscale chứng minh cấp bậc không bị đổ vỡ khi mất màu.
  - Ảnh Deuteranopia và Protanopia mô phỏng chính xác trạng thái thị giác của người khiếm thị màu.

#### Gate C05: Real Focus Indicator
- **Phương pháp thẩm định**: Mô phỏng native keyboard Tab navigation qua Puppeteer.
- **Tiêu chí kỹ thuật**:
  - `:focus-visible` outline kích hoạt với `outline-style: solid` và `outline-width >= 2px`.
  - Tỷ lệ tương phản của outline color so với nền tiếp giáp $\ge 3.0:1$.
  - Đo lường tối thiểu tại 3 ngữ cảnh: (1) Nút hành động chính Primary CTA, (2) Nút lọc/hành động phụ Secondary button, (3) Thẻ/hàng tour tương tác.

#### Gate C06: Responsive Cadence
- **Phương pháp thẩm định**: Duyệt qua 3 kích thước viewport chuẩn của Stream A:
  - Desktop: `1440x900`
  - Tablet: `768x1024`
  - Mobile: `390x844`
- **Công thức Pass**: `document.documentElement.scrollWidth <= window.innerWidth` tại cả 3 viewports. Không có thanh cuộn ngang nào xuất hiện.

#### Gate C07: Evidence Ledger & Report Segregation
- **Cấu trúc dữ liệu**: `VERIFICATION.json` lưu trữ đầy đủ dữ liệu thô (raw measurements) gồm danh sách màu computed, tỷ lệ tương phản, thông số focus outline, kích thước viewport và metadata mô phỏng CVD.
- **Cấu trúc báo cáo**: `DESIGN_TRAINING_008_REPORT.md` phân định tuyệt đối giữa:
  - **Telemetry (Số đo viễn trắc khách quan)**
  - **Visual Review (Thẩm định thị giác)**
  - **Design Hypotheses (Giả thuyết thiết kế)**

---

### B. Cấu Trúc 8 Phần Bắt Buộc Trong DESIGN_TRAINING_008_REPORT.md

1. **Mục Tiêu & Thông Cáo Dữ Liệu Chuẩn (`Objective & Synthetic Data Notice`)**:
   - Mục đích môn học Module 08.
   - Cam kết dữ liệu tổng hợp (`DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE`, `REAL_CUSTOMER_DATA: false`, `BUSINESS_PERFORMANCE_CLAIMS: none`).
   - Bảng thông số 4 tour `TF-801` đến `TF-804`.
2. **Ba Nguyên Tắc Có Nguồn & Phạm Vi Áp Dụng (`Three Bounded Principles`)**:
   - Nguyên tắc 1: Kiến trúc Token 3 Tầng & Nguồn gốc (W3C Design Tokens CG).
   - Nguyên tắc 2: Tín hiệu dự phòng không phụ thuộc màu (W3C WCAG 2.2 SC 1.4.1 Use of Color).
   - Nguyên tắc 3: Tương phản toán học & Focus theo ngữ cảnh (W3C WCAG 2.2 SC 1.4.3 & SC 1.4.11).
3. **Phân Tích Hai Hướng Thử Nghiệm Thực Sự Khác Nhau (`Two Directions Analysis`)**:
   - Phân tích sâu Direction A (Editorial Warm Dispatch) vs Direction B (Technical Slate High-Contrast).
   - Bảng so sánh canvas temperature, brand primary, focus indicator, border strategy, badge density.
4. **Hướng Được Chọn & Hai Đánh Đổi Kỹ Thuật (`Selected Direction & Two Trade-offs`)**:
   - Tuyên bố hướng được chọn cho `index.html`.
   - Phân tích chi tiết ít nhất 2 điểm đánh đổi kỹ thuật (`Trade-offs`).
5. **Bảng Ánh Xạ Toàn Diện Yêu Cầu $\to$ Mã Nguồn $\to$ Bằng Chứng (`Mapping Table`)**:
   - Cột bắt buộc:
     `| Requirement | Contract Token | Source Selector | Runtime Evidence | Verdict |`
6. **Kết Quả Kiểm Thử & Giới Hạn Bằng Chứng (`Test Results & Evidence Limits`)**:
   - Dữ liệu chi tiết từ `VERIFICATION.json`.
   - Phân chia 3 mục: Telemetry, Visual Review, Design Hypotheses.
   - Nêu rõ giới hạn bằng chứng (không phải nghiên cứu người dùng thực nghiệm).
7. **Tự Phê Bình Phân Loại Bốn Nhóm (`Self-Critique Matrix`)**:
   - `STRENGTH`: Điểm mạnh kiến trúc đã kiểm chứng.
   - `DEFECT`: Khuyết điểm hoặc hạn chế trường hợp biên đã nhận diện.
   - `TRADEOFF`: Sự thỏa hiệp có chủ đích.
   - `PREFERENCE`: Sở thích thẩm mỹ chủ quan phân biệt khỏi chỉ số chức năng.
8. **Đề Nghị Phán Quyết (`Verdict Recommendation`)**:
   - Đề xuất: `PASS`, `CONDITIONAL_PASS`, hoặc `FAIL`.
   - Ghi nhận quyền quyết định cuối cùng thuộc về Architectural Controller (Sol).

---

### C. Quy Chuẩn Đóng Gói Thành Phẩm (`Submission Packaging Rules`)

- **Tên tệp nén**: `design_training_008_submission_r01.zip`
- **Định dạng đường dẫn**: Sử dụng dấu gạch chéo xuôi Unix `/` tuyệt đối cho toàn bộ entry trong zip (cấm backslash `\`).
- **Cây thư mục bắt buộc**:
  ```text
  design_training_008_submission_r01.zip
  ├── index.html
  ├── directions/
  │   ├── option_a.html
  │   └── option_b.html
  ├── COLOR_CONTRACT.yaml
  ├── DESIGN_TRAINING_008_REPORT.md
  ├── DESIGN_TRAINING_008_INITIAL_REVIEW_001.md
  ├── VERIFICATION.json
  ├── verify_module_008.js
  └── screenshots/
      ├── option_a_desktop_1440x900.png
      ├── option_b_desktop_1440x900.png
      ├── final_desktop_1440x900.png
      ├── final_tablet_768x1024.png
      ├── final_mobile_390x844.png
      ├── final_grayscale_desktop_1440x900.png
      ├── final_deuteranopia_desktop_1440x900.png
      └── final_protanopia_desktop_1440x900.png
  ```
- **Quy chuẩn ảnh authoritative**: Toàn bộ 8 ảnh chụp phải được chụp ở tỷ lệ màn hình thực tế DPR=2 (`devicePixelRatio: 2`), sắc nét, không bị nhòe vỡ, đúng kích thước pixel định dạng PNG.
