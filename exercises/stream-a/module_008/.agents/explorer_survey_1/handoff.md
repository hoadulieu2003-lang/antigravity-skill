# Handoff Report: Codebase, Environment & Canonical Data Survey (Báo Cáo Khảo Sát Hệ Thống Mã Nguồn, Môi Trường & Dữ Liệu Chuẩn Tắc)

**Tác tử khảo sát (Explorer Subagent)**: `explorer_survey_1`  
**Thư mục làm việc (Working Directory)**: `C:\Users\game\.gemini\exercises\stream-a\module_008\.agents\explorer_survey_1`  
**Tác tử chủ quản (Parent Orchestrator)**: `orchestrator_1` (Conversation ID: `ddadc42f-4bd4-4349-9f2a-586f51c6b758`)  
**Thời gian khảo sát (Timestamp)**: 2026-09-14T01:34:00Z  

---

## 1. Observation (Quan Sát Thực Tế & Căn Cứ Thực Nghiệm)

### 1.1. Khảo Sát Cấu Trúc File & Module Hiện Tại (`Codebase & Sibling Modules`)
- **Tại thư mục mục tiêu `C:\Users\game\.gemini\exercises\stream-a\module_008`**:
  - Tồn tại 3 file đặc tả gốc:
    - `ORIGINAL_REQUEST.md` (5,976 bytes, 76 dòng): Định nghĩa yêu cầu R1–R5, Acceptance Criteria cho 7 Gates C01–C07.
    - `DESIGN_TRAINING_STREAM_A_DIRECTIVE.md` (8,111 bytes, 193 dòng): Chỉ thị khởi động Stream A (`FOUNDATION_INTEGRITY`), quy tắc bất biến (`LIGHT_THEME`, không motion, không tràn ngang ở 3 viewports).
    - `DESIGN_TRAINING_008_INITIAL_REVIEW_001.md` (11,363 bytes, 306 dòng): Phán quyết `AUTHORIZE_IMPLEMENTATION_WITH_LOCKED_CORRECTIONS` của Architectural Controller Sol, khóa chặt 7 hiệu chỉnh P01–P07.
  - Tồn tại 3 thư mục:
    - `directions/` (Hiện tại trống, là nơi tiếp nhận `option_a.html` và `option_b.html`).
    - `screenshots/` (Hiện tại trống, là nơi tiếp nhận 8 ảnh authoritative DPR=2).
    - `.agents/` (Chứa không gian làm việc của các tác tử: `explorer_survey_1`, `explorer_survey_2`, `spec_miner_survey_1`, `orchestrator_1`, `sentinel`).
  - Chưa tồn tại mã nguồn ứng dụng (`index.html`), hợp đồng màu sắc (`COLOR_CONTRACT.yaml`), file kiểm chứng (`verify_module_008.js`), dữ liệu kết quả (`VERIFICATION.json`), báo cáo (`DESIGN_TRAINING_008_REPORT.md`), và file nén (`design_training_008_submission_r01.zip`).

- **Tại thư mục mẹ `C:\Users\game\.gemini\exercises\stream-a`**:
  - Chứa `DESIGN_TRAINING_008_CONTROLLER_FEEDBACK.md` (1,109 bytes): Xác nhận Controller chấp thuận thi công với 7 hiệu chỉnh đã khóa P01–P07.
  - Chứa `DESIGN_TRAINING_008_PROPOSAL.md` (12,451 bytes, 185 dòng): Đề xuất kỹ thuật ban đầu của Antigravity, chứa bảng màu chi tiết, fixture 4 tour và dự thảo ma trận C01–C07.

- **Tại các module tiền nhiệm trong `C:\Users\game\.gemini\exercises\` (`design_training_001` đến `design_training_007`)**:
  - `design_training_007/verify_module_007.js` (70,412 bytes, 1,425 dòng): Bộ kiểm chứng mẫu dựa trên Node.js và `puppeteer-core`. Kiểm tra sRGB luminance, contrast ratio, viewport overflow, focus ring, DOM assertions và xuất ảnh DPR=2 (`deviceScaleFactor: 2`).
  - `design_training_007/package_zip_007.py` (1,886 bytes): Script Python chuẩn hóa đóng gói file zip với thuần dấu gạch chéo xuôi `/` (`pure forward slashes`), kiểm tra tính toàn vẹn SHA-256 và rà soát triệt để không có dấu gạch chéo ngược Windows `\`.
  - `design_training_006/verify_module_006.js` (14,636 bytes): Có cơ chế dự phòng nạp module `puppeteer-core` từ đường dẫn fallback `C:/Users/game/cdp_reader/node_modules/puppeteer-core`.

---

### 1.2. Khảo Sát Môi Trường Runtime, Node.js & Trình Duyệt (`Runtime & Browser Capabilities`)
Thực thi kiểm tra trực tiếp trên hệ thống qua lệnh terminal:
1. **Node.js**:
   - Phiên bản: `v24.18.0`.
   - Vị trí thực thi: Sẵn sàng trên System PATH.
2. **npm**:
   - Phiên bản: `11.16.0`.
3. **Python**:
   - Phiên bản: `Python 3.14.6`. Sẵn sàng chạy các tác vụ đóng gói zip và xử lý dữ liệu.
4. **Google Chrome / Chromium**:
   - Vị trí tệp thực thi (`Executable Path`): `C:\Program Files\Google\Chrome\Application\chrome.exe` (Đã kiểm tra `Test-Path` $\to$ `True`).
   - Các tiến trình Chrome nền đang hoạt động và mở cổng CDP:
     - Cổng `9222`: Trạng thái `LISTENING` (PID 17516).
     - Cổng `9223`: Trạng thái `LISTENING` (PID 18516).
5. **Thư viện Puppeteer (`Puppeteer Availability`)**:
   - Thư mục `C:\Users\game\cdp_reader\node_modules\puppeteer-core` tồn tại phiên bản: `puppeteer-core@25.7.0`.
   - Kiểm nghiệm thực tế với Node.js:
     - Kết nối CDP cổng 9222 có thể bị từ chối hoặc bận nếu tiến trình Chrome hiện hữu gắn với session khác:
       `CDP connect error: Failed to fetch browser webSocket URL from http://127.0.0.1:9222/json/version: fetch failed`.
     - Tuy nhiên, khi khởi chạy độc lập bằng `puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })`:
       $\to$ **Khởi chạy thành công 100% không có bất kỳ lỗi nào (`Puppeteer launch successful!`)**.
   - Kiểm nghiệm nạp qua biến môi trường `NODE_PATH`:
     - Lệnh `$env:NODE_PATH = 'C:\Users\game\cdp_reader\node_modules'; node -e "const p = require('puppeteer-core'); console.log(typeof p.launch)"` trả về `function`.

---

### 1.3. Khảo Sát Tập Dữ Liệu Chuẩn Tắc Synthetic Canonical Fixture TF-801 đến TF-804
Theo `DESIGN_TRAINING_008_PROPOSAL.md` và `DESIGN_TRAINING_008_INITIAL_REVIEW_001.md` (Mục 4 & P01–P07):
1. **Phân loại dữ liệu (`Data Classification`)**:
   - Bắt buộc khai báo rõ:
     ```yaml
     DATA_CLASSIFICATION: SYNTHETIC_TRAINING_FIXTURE
     REAL_CUSTOMER_DATA: false
     BUSINESS_PERFORMANCE_CLAIMS: none
     ```
   - Không được trình bày như dữ liệu khách hàng thực tế của một doanh nghiệp thương mại.
2. **Chi tiết 4 bản ghi nghiệp vụ chuẩn hóa**:
   - **`TF-801`**:
     - `tour_code`: `"HAN-NBI-01"`
     - `title`: `"Tour Tràng An - Bái Đính 1 Ngày"`
     - `status`: `"NORMAL"`
     - `status_label`: `"Bình thường"`
     - `status_desc`: `"Lịch trình đúng tiến độ, xe 45 chỗ xuất bến 07:30"`
     - `capacity`: `"35/35 khách"`
     - `coordinator`: `"Huy Trần"`
     - `action_required`: `false`
   - **`TF-802`**:
     - `tour_code`: `"HAN-SAP-02"`
     - `title`: `"Tour Fansipan Sapa 2 Ngày 1 Đêm"`
     - `status`: `"ATTENTION"`
     - `status_label`: `"Cần chú ý"`
     - `status_desc`: `"Chưa chốt xe trung chuyển bản Cát Cát. Hạn chốt 11:00."`
     - `capacity`: `"18/20 khách"`
     - `coordinator`: `"Lan Nguyễn"`
     - `action_required`: `true`
     - `action_label`: `"Rà soát xe trung chuyển"`
   - **`TF-803`**:
     - `tour_code`: `"HPH-HLB-03"`
     - `title`: `"Tour Hạ Long Du Thuyền 5 Sao"`
     - `status`: `"ERROR"`
     - `status_label`: `"Lỗi đối tác"`
     - `status_desc`: `"Cảng vụ hoãn lệnh rời bến do dông lốc. 24 khách đang ở nhà chờ."`
     - `capacity`: `"24/24 khách"`
     - `coordinator`: `"Huy Trần"`
     - `action_required`: `true`
     - `action_label`: `"Kích hoạt phương án dự phòng"`
   - **`TF-804`**:
     - `tour_code`: `"SGN-PQU-04"`
     - `title`: `"Tour Đảo Phú Quốc Sunset 3 Ngày 2 Đêm"`
     - `status`: `"SUCCESS"`
     - `status_label`: `"Hoàn tất điều phối"`
     - `status_desc`: `"100% đối tác vé bay & resort đã xác nhận mã dịch vụ."`
     - `capacity`: `"42/42 khách"`
     - `coordinator`: `"Lan Nguyễn"`
     - `action_required`: `false`
3. **Phân tách trạng thái bắt buộc theo P01**:
   - `OPERATIONAL_STATUS`: Taxonomy phản ánh tình trạng tour vận hành (`NORMAL`, `ATTENTION`, `ERROR`, `SUCCESS`).
   - `INTERACTION_STATE`: Máy trạng thái hữu hạn cho luồng thao tác bất đồng bộ của điều phối viên (`IDLE`, `VALIDATING`, `SAVING`, `FAILURE`, `CONFIRMED`).
   - Tuyệt đối không dùng chung một biến trạng thái duy nhất cho cả hai khái niệm.
4. **Ba tầng cảm quan đồng bộ theo P06 (`Three Synchronized Sensory Layers`)**:
   - Tầng 1: Văn bản tiếng Việt tường minh (`status_label`).
   - Tầng 2: Biểu tượng hình học SVG hoặc glyph có `aria-hidden="true"` (Không dựa vào emoji đơn độc phụ thuộc OS).
   - Tầng 3: Token màu ngữ nghĩa độ tương phản cao (nền, chữ, viền).

---

### 1.4. Khảo Sát Các Giới Hạn & Ràng Buộc Kỹ Thuật (`System Constraints`)
1. **Quy chuẩn hệ điều hành Windows & Dấu gạch chéo đường dẫn (`Path Separators`)**:
   - File zip nộp bài `design_training_008_submission_r01.zip` bắt buộc chứa các đường dẫn lưu trữ dùng thuần dấu `/` (`pure forward slashes`), tuyệt đối không chứa dấu `\`.
   - Các đường dẫn ảnh trong tài liệu Markdown bắt buộc dùng dấu `/` để tương thích trình phân giải nội bộ Antigravity Webview.
   - Thư mục `.agents/` chỉ chứa metadata của tác tử; không bao giờ được đặt mã nguồn, test script hoặc ảnh sản phẩm tại đây.
2. **Quy chuẩn Light Theme & Viewports của Stream A**:
   - Mặc định 100% giao diện sáng (`LIGHT_THEME`). Không dùng Dark Theme.
   - Ba viewports chuẩn đo lường: `1440x900` (Desktop), `768x1024` (Tablet), `390x844` (Mobile).
   - Cấm hoàn toàn hiện tượng tràn ngang: `scrollWidth <= innerWidth`.
3. **Quy chuẩn Tỷ Lệ Tương Phản Toán Học (Đã Khóa P03)**:
   - Text thông thường / nền: $\ge 4.5:1$ (WCAG 2.2 AA).
   - Text lớn và đường viền non-text / focus indicator: $\ge 3.0:1$.
   - Đo lường trực tiếp từ computed style trên DOM thực tế, không đọc tĩnh từ bảng màu YAML.
4. **Quy chuẩn Thẩm Định Focus Ring Bàn Phím (Đã Khóa P07)**:
   - Viền nét liền $\ge 2\text{px solid}$.
   - Đo tương phản đối với nền tiếp giáp (`adjacent background`) trên 3 ngữ cảnh:
     1. Primary Action CTA (`Kích hoạt phương án dự phòng` / `Rà soát xe trung chuyển`).
     2. Secondary Action / Bộ lọc tour (`Lọc tất cả / Cần chú ý / Lỗi`).
     3. Thẻ/Hàng tour tương tác (`Tour Card / Interactive Row`).

---

## 2. Logic Chain (Chuỗi Lập Luận Logic Từ Quan Sát Đến Giải Pháp)

```
[Môi trường: Chrome có sẵn, puppeteer-core tại cdp_reader, Node v24.18]
                                 │
                                 ▼
[Chiến lược Engine verify_module_008.js]:
   - Dùng puppeteer.launch trực tiếp executablePath Chrome thay vì phụ thuộc CDP port 9222
   - Thêm fallback nạp puppeteer-core tự động
                                 │
                                 ▼
[Cấu trúc Dữ liệu TF-801..TF-804 & P01]:
   - Tách taxonomy nghiệp vụ (4 status) khỏi FSM bất đồng bộ (5 states)
   - Thiết lập aria-disabled thay vì HTML disabled để ngăn Focus Eviction
                                 │
                                 ▼
[Định hình Cấu trúc Token 3 Tầng & Hợp đồng (P04)]:
   - COLOR_CONTRACT.yaml làm trung tâm
   - Primitive -> Semantic -> Component
   - 0 primitive token trong component selectors
                                 │
                                 ▼
[Quy chuẩn Kiểm Chứng & Đóng Gói (R4 & R5)]:
   - Script verify_module_008.js xuất toàn bộ số đo thô ra VERIFICATION.json
   - Script Python package_zip_008.py đóng gói zip với pure forward slash '/'
```

1. **Từ Quan sát 1.2 $\to$ Quyết định Kiến trúc Kiểm chứng**: Việc kết nối tới cổng CDP `9222` thông qua `puppeteer.connect` có nguy cơ thất bại do cổng này đang phục vụ một instance Chrome khác trên máy của Anh hoặc bị chặn socket URL fetch. Ngược lại, phương thức `puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] })` khởi tạo một Chromium process độc lập, hoàn toàn cô lập, chạy với tốc độ cao và không bị xung đột tiến trình. Do đó, `verify_module_008.js` nên ưu tiên `puppeteer.launch` (kèm cờ CLI nhận cổng CDP nếu người dùng muốn debug thủ công).
2. **Từ Quan sát 1.1 $\to$ Khả năng Tái Sử Dụng Pattern**: Mã nguồn của `design_training_007` cung cấp các hàm tính toán sRGB Relative Luminance và Contrast Ratio đã được Sol (ChatGPT Controller) chấp thuận và nghiệm thu `PASS`. Việc tái sử dụng chuẩn mực toán học này trong `verify_module_008.js` đảm bảo độ chính xác tuyệt đối, tránh sai lệch thuật toán.
3. **Từ Quan sát 1.3 & P01, P06 $\to$ Yêu cầu Thiết kế Component**: Mỗi tour card trong `index.html` và hai hướng `option_a.html`, `option_b.html` phải kết xuất huy hiệu trạng thái (`status badge`) với 3 lớp: chữ tiếng Việt, icon SVG hình học có `aria-hidden="true"`, và token màu nền/viền/chữ. Nút tác vụ tương tác khi click sẽ chuyển đổi FSM (`IDLE` $\to$ `VALIDATING` $\to$ `SAVING` $\to$ `CONFIRMED` hoặc `FAILURE`) và sử dụng `aria-disabled="true"` để không làm mất tiêu điểm bàn phím (`Focus Eviction`).
4. **Từ Quan sát 1.4 $\to$ Script Đóng Gói Chuẩn Xác**: Tận dụng script Python mẫu `package_zip_007.py` để tạo `package_zip_008.py`, đảm bảo tự động chuyển đổi mọi dấu `\` thành `/`, kiểm tra SHA-256 và kích thước file, loại bỏ hoàn toàn nguy cơ vi phạm định dạng zip trên Windows.

---

## 3. Caveats (Lưu Ý & Giới Hạn)

1. **Phạm vi Trách Nhiệm Khảo Sát Của Subagent**:
   - Tác tử này (`explorer_survey_1`) thực hiện điều tra kỹ thuật ở chế độ Chỉ Đọc (`Read-Only`). Tuyệt đối không tự ý viết hoặc chỉnh sửa mã nguồn của dự án trong các thư mục chính (`module_008/index.html`, `verify_module_008.js`, v.v.).
   - Mọi đề xuất mã nguồn hoặc cấu trúc được ghi lại trong tài liệu này để phục vụ tác tử Lead Orchestrator và các Implementer.
2. **Vấn đề Nạp Thư Viện Node.js**:
   - Thư mục `module_008` không có `package.json` và `node_modules` nội bộ.
   - Để `verify_module_008.js` thực thi mượt mà khi chạy `node verify_module_008.js`, file cần có cấu trúc nạp module linh hoạt:
     ```javascript
     let puppeteer;
     try {
       puppeteer = require('puppeteer-core');
     } catch (e) {
       puppeteer = require('C:/Users/game/cdp_reader/node_modules/puppeteer-core');
     }
     ```
     hoặc thiết lập `$env:NODE_PATH = 'C:\Users\game\cdp_reader\node_modules'`.
3. **Tránh Nhầm Lẫn Giữa Mock và Dữ Liệu Nghiệp Vụ**:
   - Tập dữ liệu TF-801..TF-804 là synthetic training fixture. Không được tự ý mở rộng thêm thuộc tính kinh doanh hay sửa đổi tên tour/điều phối viên ngoài tài liệu quy chuẩn.

---

## 4. Conclusion (Kết Luận Khảo Sát & Khuyến Nghị Hành Động)

1. **Môi Trường & Hạ Tầng Kỹ Thuật Đã Sẵn Sàng 100%**:
   - Node.js v24.18.0, Python 3.14.6, Chrome (Application/chrome.exe) và `puppeteer-core` v25.7.0 đã được xác nhận hoạt động hoàn hảo.
   - Cơ chế khởi chạy headless độc lập đã được kiểm chứng không phát sinh lỗi.
2. **Định Hướng Thực Thi Cho Giai Đoạn Tiếp Theo (Implementation Phase)**:
   - **Milestone 1 (Hợp đồng màu sắc)**: Soạn thảo `COLOR_CONTRACT.yaml` định nghĩa đầy đủ 3 tầng token (`Primitive`, `Semantic`, `Component`), phân định rõ Brand Primary và Operational Status.
   - **Milestone 2 (Hai hướng nghệ thuật)**: Xây dựng `directions/option_a.html` (Editorial Warm Dispatch) và `directions/option_b.html` (Technical Slate High-Contrast) trên cùng fixture TF-801..TF-804.
   - **Milestone 3 (Bản Candidate chính thức)**: Xây dựng `index.html` với đầy đủ 3 tầng cảm quan phi màu sắc, accessibility WCAG 2.2 AA, bàn phím native và FSM tương tác bất đồng bộ không gây Focus Eviction.
   - **Milestone 4 (Bộ kiểm chứng tự động & Ảnh DPR=2)**: Xây dựng `verify_module_008.js` đo đạc 7 Gates C01–C07, chụp 8 ảnh bằng chứng (DPR=2) lưu vào `screenshots/` và xuất dữ liệu thô vào `VERIFICATION.json`.
   - **Milestone 5 (Báo cáo & Đóng gói)**: Soạn thảo `DESIGN_TRAINING_008_REPORT.md` (8 mục chuẩn Sol) và script đóng gói `package_zip_008.py` tạo `design_training_008_submission_r01.zip`.

---

## 5. Verification Method (Phương Pháp Kiểm Chứng Độc Lập)

Bất kỳ tác tử nào tiếp nhận hoặc kiểm toán viên độc lập đều có thể kiểm chứng lại kết quả khảo sát này bằng các lệnh terminal cụ thể sau:

1. **Kiểm tra Node.js, Python và Chrome Binary**:
   ```powershell
   node -v
   python --version
   Test-Path 'C:\Program Files\Google\Chrome\Application\chrome.exe'
   ```
   *Kỳ vọng*: Node >= 20.x (thực tế v24.18.0), Python >= 3.10 (thực tế 3.14.6), trả về `True`.

2. **Kiểm tra Khả Năng Nạp Thư Viện Puppeteer & Khởi Chạy Chrome Headless**:
   ```powershell
   $env:NODE_PATH = 'C:\Users\game\cdp_reader\node_modules'
   node -e "const p = require('puppeteer-core'); (async () => { const b = await p.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] }); console.log('LAUNCH_SUCCESS:', !!b); await b.close(); })();"
   ```
   *Kỳ vọng*: Xuất dòng `LAUNCH_SUCCESS: true`.

3. **Kiểm tra Tính Toàn Vẹn Của Các File Chỉ Thị**:
   ```powershell
   Test-Path 'C:\Users\game\.gemini\exercises\stream-a\module_008\ORIGINAL_REQUEST.md'
   Test-Path 'C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_STREAM_A_DIRECTIVE.md'
   Test-Path 'C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_INITIAL_REVIEW_001.md'
   Test-Path 'C:\Users\game\.gemini\exercises\stream-a\DESIGN_TRAINING_008_PROPOSAL.md'
   ```
   *Kỳ vọng*: Tất cả 4 tệp đều trả về `True`.
