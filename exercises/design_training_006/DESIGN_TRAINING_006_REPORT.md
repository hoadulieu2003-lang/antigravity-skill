# BÁO CÁO NGHIỆM THU MODULE 06: DESIGN CRITIQUE (REV 003 — FINAL)
**Phản biện thiết kế dựa trên bằng chứng & Thử nghiệm cải tiến có giới hạn**

- **Mã nộp bài (Submission Code)**: `DESIGN_TRAINING_006_REPAIR_002` (Rev 003 Final Submission)
- **Mã Module**: `DESIGN_TRAINING_006` (Design Critique — Phản biện thiết kế dựa trên bằng chứng)
- **Executor (Tác tử thi hành)**: Antigravity (Senior AI Pair-Programmer)
- **Reviewer (Bộ điều khiển kiến trúc)**: ChatGPT Controller
- **Product Owner / Taste Authority**: Anh — Lead Architect / Product Owner
- **Trạng thái (Status)**: `READY_FOR_FINAL_CLOSURE`
- **Ngân sách sửa (Repair Budget)**: Vòng 2 / 2 — FINAL ROUND

---

## 0. Bảng khắc phục sai lệch R01 theo Review 002

| Hạng mục | Vấn đề Controller chỉ ra tại Review 002 | Giải pháp khắc phục thực tế | Bằng chứng kiểm chứng |
| :--- | :--- | :--- | :--- |
| **R01**<br>*(Bằng chứng bàn phím Native)* | Script Rev 002 sử dụng `cta2.focus()` và `cta2.click()` lập trình bên trong `page.evaluate()`. Lệnh này chỉ chứng minh anchor hoạt động khi được gọi DOM API, không chứng minh thứ tự Tab tự nhiên, khả năng duyệt bằng phím Tab và kích hoạt bằng phím Enter thực nghiệm. | - Mở Candidate ở trạng thái sạch (`await page.goto(url)`).<br>- Sử dụng thao tác bàn phím thực thụ qua Puppeteer: `await page.keyboard.press('Tab')` lặp tự nhiên.<br>- Ghi nhận chuỗi tiêu điểm (`focusSequence`): Tab 1 tới `<A id="cta-organization">`, Tab 2 tới `<A id="cta-decisions">`.<br>- Assert chính xác phần tử đang focus trước khi kích hoạt: `document.activeElement.id === 'cta-decisions'`.<br>- Kích hoạt bằng phím Enter thực: `await page.keyboard.press('Enter')`.<br>- Kiểm thử con trỏ bằng thao tác chuột thực: `await page.click('#cta-organization')`. | - Tệp `verify_module_006.js` đã cập nhật.<br>- `VERIFICATION.json` (R03) ghi nhận chi tiết `focusSequence` (2 bước Tab), `activeElementBeforeEnter: "cta-decisions"`, `hashAfterEnter: "#section-decisions"`, `targetInView: true`.<br>- Cả hai phép kiểm pointer và native keyboard đều đạt `pass: true`. |

---

## 1. Nguồn gốc & Tính xác thực của Baseline (Q01 — ĐÃ PASS TẠI REVIEW 002)

Bài tập Module 06 sử dụng bản sao chính xác từ kết quả nghiệm thu **Module 05 Rev 002**:
- **Gói nộp nguồn gốc (Source Archive)**: `exercises/design_training_005/design_training_005_submission_r02.zip`
- **Mã băm SHA-256 nguồn**: `12302f8c948dd48126cb756f20c4e64639642eba8394a0501006c6034c850bf1`
- **Mã băm SHA-256 tệp baseline/index.html**: `efeebf49335fc0ea8bb0b3fad79d60e2ff5c4c2f231047b7da81766ee0656759` (Controller đã đối chiếu độc lập và xác nhận khớp từng byte với M05 r02).
- **Phép kiểm băm nghiêm ngặt**: So sánh bằng chính xác (`m05ZipHash === expectedHash`), `byte_identical: true`.
- **Tình trạng Metadata Hợp đồng**: Tệp `baseline/DESIGN_CONTRACT.yaml` cập nhật trường `status: ACCEPTED_FOR_EXERCISE` theo phán quyết `DESIGN_TRAINING_005_FINAL_REVIEW_002.md` (Controller đã xác nhận là cập nhật metadata hợp lệ sau PASS M05).

---

## 2. Vòng quan sát ban đầu — Bảng nhận xét phân loại (Q02 — ĐÃ PASS TẠI REVIEW 002)

Dưới đây là 5 nhận xét được chuẩn hóa và công nhận tại Review 002:

### C01: [STRENGTH] Hiển thị bảng thích ứng 2 dòng trên màn hình di động
- **id**: `C01`
- **location**: Section 02 Data Matrix trên Mobile (390×844), file `baseline/index.html` dòng 590–630; minh chứng tại `screenshots/baseline_mobile_fullpage.png`.
- **observation**: Cấu trúc bảng trên màn hình hẹp (<600px) tự động chuyển sang dạng thẻ danh sách 2 dòng: Dòng 1 hiển thị đầy đủ tên tài liệu; Dòng 2 bố trí người phụ trách bên trái và huy hiệu trạng thái bên phải.
- **interpretation**: Giúp người dùng lướt nhanh tình trạng 3 tài liệu mà không cần thao tác cuộn ngang và không bị chồng chéo nhãn.
- **classification**: `strength`
- **user_task**: "Kiểm tra nhanh tình trạng và quyền sở hữu tài liệu khi truy cập trên thiết bị di động".
- **evidence**: kind: `visual`, reference: `screenshots/baseline_mobile_fullpage.png`
- **confidence**: `high`
- **recommendation**: `keep`
- **reason**: Giải pháp từ Module 05 giải quyết triệt để lỗi hiển thị bảng trên mobile, duy trì khả năng đọc ổn định và cần được bảo toàn nguyên vẹn.

---

### C02: [TRADEOFF] Ba thẻ card độc lập tại Section 03 trên Desktop
- **id**: `C02`
- **location**: Section 03 ('Quyết định thiết kế') trên Desktop (1440×900), file `baseline/index.html` dòng 450–480; minh chứng tại `screenshots/baseline_desktop_fullpage.png`.
- **observation**: Ba khối thẻ card độc lập (`.decision-card`) đều có nền trắng (`--color-surface`), bo góc 4px, viền 1px, không có bóng đổ riêng, xếp cạnh nhau trên nền xám nhạt (`--color-bg: #F8FAFC`).
- **interpretation**: Việc đặt 3 chiếc hộp độc lập liền kề sau khối Hero Preview và Section 02 Data Matrix Table tạo cảm giác phân mảnh thị giác giữa 3 quyết định vốn thuộc cùng một nhóm đặc tả kiến trúc.
- **classification**: `tradeoff`
- **user_task**: "Đọc hiểu 3 nguyên tắc thiết kế của hệ thống TRACE như một khối kiến trúc thống nhất".
- **evidence**: kind: `visual`, reference: `screenshots/baseline_desktop_fullpage.png`
- **confidence**: `medium`
- **recommendation**: `experiment`
- **reason**: Hợp nhất 3 thẻ card riêng thành một khung nhóm chung, sử dụng đường kẻ phân cách hairline dọc bên trong nhằm tăng tính liên kết nhóm giữa 3 quyết định thiết kế.

---

### C03: [TRADEOFF] Mẫu vật tài liệu thu nhỏ tại Hero lặp lại 3 tài liệu của Section 02
- **id**: `C03`
- **location**: Hero Section Specimen Card, file `baseline/index.html` dòng 210–265; minh chứng tại `screenshots/baseline_desktop_fullpage.png`.
- **observation**: Khung xem trước trong Hero hiển thị 3 hàng tài liệu thu nhỏ, lặp lại 3 đối tượng tài liệu được trình bày đầy đủ ở Section 02 Data Matrix Table ngay bên dưới.
- **interpretation**: Đánh đổi tính cô đọng dữ liệu để lấy bằng chứng trực quan tức thì ngay màn hình đầu tiên (above the fold), giúp người xem nắm bắt ngay công năng của công cụ.
- **classification**: `tradeoff`
- **user_task**: "Hiểu ngay công năng và giao diện của TRACE ngay khi vừa truy cập trang web".
- **evidence**: kind: `visual`, reference: `screenshots/baseline_desktop_fullpage.png`
- **confidence**: `medium`
- **recommendation**: `keep`
- **reason**: Đánh đổi có chủ đích mang lại giá trị định hướng trực quan ban đầu; việc loại bỏ mẫu vật sẽ làm giảm tính thuyết phục của màn hình Hero.

---

### C04: [PREFERENCE] Tông nền Slate-50 xám lạnh
- **id**: `C04`
- **location**: Biến màu nền toàn trang `--color-bg: #F8FAFC` (Slate-50), file `baseline/index.html` dòng 34.
- **observation**: Trang sử dụng nền xám ánh lam lạnh (Slate-50) kết hợp viền Slate-200.
- **interpretation**: Lựa chọn thẩm mỹ định hướng công cụ hạ tầng kỹ thuật (Developer Tooling / Console) thay vì tông kem ấm hay trung tính hoàn toàn.
- **classification**: `preference`
- **user_task**: "Cảm nhận bản sắc thương hiệu và độ tin cậy của hệ thống công cụ".
- **evidence**: kind: `code`, reference: `baseline/index.html:L34`
- **confidence**: `medium`
- **recommendation**: `keep`
- **reason**: Lựa chọn màu sắc phù hợp với bản sắc công cụ vận hành kỹ thuật TRACE; không có khiếm khuyết chức năng đòi hỏi phải thay đổi.

---

### C05: [STRENGTH] Tuân thủ ràng buộc Zero Motion & Cuộn tức thì
- **id**: `C05`
- **location**: CSS Toàn trang, file `baseline/index.html` dòng 24–28 (`scroll-behavior: auto !important`), transition: 0s, animation: none.
- **observation**: Toàn bộ hệ thống giao diện không có hiệu ứng chuyển cảnh, chuyển động hay animation tự động khi tương tác hoặc tải trang.
- **interpretation**: Đáp ứng 100% ràng buộc thiết kế tĩnh (Zero Motion) của bài tập TRACE.
- **classification**: `strength`
- **user_task**: "Điều hướng và tra cứu thông tin tĩnh mà không bị xao nhãng bởi chuyển động thừa".
- **evidence**: kind: `runtime`, reference: `VERIFICATION.json` (`zero_motion_comprehensive.allZero: true`)
- **confidence**: `high`
- **recommendation**: `keep`
- **reason**: Tuân thủ triệt để tiêu chí kỹ thuật đã khóa của bài tập; được bảo toàn nguyên vẹn trong bản thử nghiệm.

---

## 3. Kế hoạch thử nghiệm: Một giả thuyết & Tối đa hai thay đổi (Q03 — ĐÃ PASS TẠI REVIEW 002)

### 3.1. Giả thuyết khoa học (Single Hypothesis)
> *"Tại Section 03 ('Quyết định thiết kế'), việc hợp nhất 3 thẻ card đóng hộp độc lập thành một khung nhóm chung (Unified Grouped Container) phân cách bằng đường hairline dọc siêu mảnh trên desktop kết hợp thẻ nhãn kỹ thuật monospace sẽ tăng tính liên kết nhóm và độ thanh lịch của nhịp trang, trong khi vẫn bảo toàn 100% nội dung văn bản và cấu trúc hiển thị dọc trên mobile."*

### 3.2. Bằng chứng ban đầu & Ràng buộc bảo toàn
- Bằng chứng ban đầu: Quan sát C02 tại `screenshots/baseline_desktop_fullpage.png` cho thấy 3 thẻ card độc lập nằm cạnh nhau tạo cảm giác phân mảnh giữa các quyết định thuộc cùng một tài liệu đặc tả.
- Ràng buộc bảo toàn: 100% nội dung văn bản gốc; 3 hàng dữ liệu chuẩn, chủ sở hữu, trạng thái và nhãn "BẢN MẪU TĨNH"; 2 liên kết CTA điều hướng; Zero Motion trên toàn bộ trang; không tràn ngang ở 1440px, 768px, 390px.

### 3.3. Mô tả chi tiết tối đa hai thay đổi thực tế
- **Thay đổi 1 (Bố cục Section 03 Desktop — Khung nhóm chung phân cách hairline)**:
  - *Baseline*: `.decisions-grid` chứa 3 khối `.decision-card` riêng biệt; mỗi card có nền trắng riêng, viền riêng 1px, bo góc 4px, không có shadow riêng.
  - *Candidate*: Hợp nhất thành một khung nhóm chung `.decisions-grid` có nền trắng, viền 1px, bo góc 4px và bóng đổ nhẹ (`box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03)`). Bên trong, 3 cột được phân cách bằng đường kẻ hairline dọc siêu mảnh (`.decision-card: border-right: 1px solid var(--color-border)` cho 2 cột đầu; cột cuối cùng không viền).
- **Thay đổi 2 (Định hình nhãn kỹ thuật & Thích ứng Mobile)**:
  - *Baseline*: Nội dung nhãn có sẵn chữ `[01 // TYPOGRAPHY]`, `[02 // BỐ CỤC]`, `[03 // HÌNH ẢNH]` dạng text thông thường.
  - *Candidate*: Đóng khung nhãn thành thẻ kỹ thuật monospace (`.decision-num`: font-family monospace, nền nhẹ `var(--color-surface-subtle)`, viền mảnh 1px, padding gọn 0.25rem 0.5rem). Trên màn hình hẹp (`@media (max-width: 900px)`), lưới chuyển thành cột đơn xếp dọc và các cột được phân cách nội bộ bằng đường hairline ngang (`border-bottom: 1px solid var(--color-border)`).

---

## 4. Ma trận so sánh công bằng trước / sau (Q04 — ĐÃ PASS TẠI REVIEW 002)

Đối chiếu trực tiếp giữa `baseline/` và `candidate/` trong cùng điều kiện hiển thị (DPR = 2, cùng nội dung chuẩn, cùng font hệ thống):

| STT | Câu hỏi thẩm định | Quan sát Baseline | Quan sát Candidate | Kết luận & Bằng chứng kiểm chứng |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Nhiệm vụ mục tiêu được hỗ trợ thế nào?** | Người dùng đọc 3 quyết định qua 3 hộp riêng lẻ; cảm giác phân mảnh giữa các mục thông tin đồng cấp. | Ba quyết định nằm trong cùng một khung nhóm; nhịp đọc chuyển giữa các cột tự nhiên hơn qua đường hairline phân cách. Chưa có dữ liệu đo lường về tốc độ đọc hay mức độ ghi nhớ. | **TĂNG TÍNH LIÊN KẾT NHÓM** *(Đã được Controller xác nhận tại Review 002)*. |
| **2** | **Điểm mạnh đã xác định (C01, C05) có được giữ?** | C01 (bảng 2 dòng mobile) và C05 (zero motion) hoạt động ổn định. | C01 và C05 được bảo toàn nguyên vẹn 100%, không bị tác động. | **CÓ — BẢO TOÀN NGUYÊN VẸN** *(Minh chứng: `VERIFICATION.json`)*. |
| **3** | **Desktop và Mobile cùng được xét chưa?** | Desktop có 3 card riêng; mobile có 3 card xếp dọc riêng biệt. | Desktop hiển thị khung 3 cột hairline dọc; tablet 768px và mobile 390px hiển thị khung nhóm xếp dọc hairline ngang (`max-width: 900px`). | **ĐÃ XÉT ĐỒNG BỘ** *(Minh chứng: Bộ 5 ảnh fullpage 1440px, 768px, 390px)*. |
| **4** | **Cái giá mới phát sinh (New Tradeoff) là gì?** | Ba card độc lập giúp nhận diện ranh giới từng mục cực kỳ rõ ràng từ xa. | Khung chung làm tăng tính nhóm nhưng làm giảm độ tách biệt của từng quyết định riêng lẻ; khung bao và bóng đổ chung vẫn tạo trọng lượng thị giác nhất định. Khoảng đệm `--space-md` (1.5rem = 24px) giúp duy trì khoảng cách nội dung an toàn. | **ĐÁNH ĐỔI ĐÃ NHẬN DIỆN & KIỂM SOÁT** *(Đã được Controller xác nhận tại Review 002)*. |

---

## 5. Quyết định cuối cùng & Đánh đổi kiến trúc (Q06 — ĐÃ ĐƯỢC CÔNG NHẬN TẠI REVIEW 002)

### Phán quyết: `ADOPT`
**Trạng thái thẩm định của Controller**: `ADOPT_ACCEPTED_FOR_EXERCISE` (Có hiệu lực khi đóng R01).

### Lập luận đánh giá có căn cứ & đúng mức độ bằng chứng:
1. **Lợi ích thị giác đã xác minh qua ảnh**: Khung nhóm chung với hairline phân cách giúp gắn kết 3 quyết định thiết kế vào một tài liệu kiến trúc mạch lạc, phù hợp với tinh thần tối giản và có trật tự của công cụ TRACE (hướng B).
2. **Khả năng đọc và toàn vẹn chức năng**: Bộ ảnh kiểm chứng ở 1440px, 768px và 390px cho thấy không có sự suy giảm khả năng đọc. Toàn bộ 100% văn bản, dữ liệu bảng và liên kết điều hướng được bảo toàn.
3. **Thừa nhận đánh đổi mới**: Việc hợp nhất làm giảm độ độc lập thị giác của từng quyết định riêng lẻ so với 3 chiếc hộp độc lập của Baseline. Đánh đổi này được chấp nhận vì mục tiêu chính của Section 03 là trình bày một hệ thống nguyên tắc đồng bộ.
4. **Giới hạn kết luận**: Các nhận định về "cải thiện nhịp thở" là đánh giá thị giác từ phía người làm và reviewer dựa trên ảnh chụp; tác động thực tế lên tốc độ đọc hiểu hoặc cảm xúc mỏi mắt của người dùng cần có nghiên cứu người dùng định lượng để kết luận.

---

## 6. Kiểm chứng vừa đủ — Bảng kiểm soát Q01–Q07 (Q05 ĐÃ ĐÓNG R01)

| Ca kiểm tra | Nội dung kiểm tra | Phương thức & Tiêu chí assert | Kết quả đo đạc thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Q01** | Baseline đúng nguồn và không sửa đổi | So sánh băm `===` với ZIP M05 r02 & đối chiếu byte-identical tệp HTML | `sha256: 12302f8c...` (khớp 100%), `byte_identical: true`, metadata contract ghi nhận đúng | **PASS** *(Review 002 confirmed)* |
| **Q02** | Nhận xét phân loại đúng, có vị trí và bằng chứng | Đối chiếu schema 5 quan sát C01–C05, sửa mô tả khớp thực tế | Đầy đủ 4 loại; mô tả baseline/candidate chính xác, phân biệt quan sát với suy luận | **PASS** *(Review 002 confirmed)* |
| **Q03** | Một giả thuyết, tối đa 2 thay đổi | Đối chiếu diff tập trung tại Section 03 | 2 thay đổi liên quan: (1) Khung nhóm 3 cột hairline desktop, (2) Nhãn mono & hairline ngang mobile | **PASS** *(Review 002 confirmed)* |
| **Q04** | So sánh trước / sau công bằng | Chụp ảnh CDP cùng điều kiện (1440, 768, 390, DPR=2, cùng font/nội dung) | Bộ 5 ảnh fullpage (tái sử dụng từ r02 theo chỉ thị vì giao diện Candidate giữ nguyên) | **PASS** *(Review 002 confirmed)* |
| **Q05** | Không làm hỏng điều đã đạt & Thao tác bàn phím Native (R01 Remediated) | - Không tràn ngang ở 1440, 768, 390.<br>- 3 hàng dữ liệu đúng bộ, nhãn tĩnh có mặt.<br>- Pointer click qua `page.click(#cta-organization)`.<br>- **Native Keyboard**: duyệt tuần tự bằng `page.keyboard.press('Tab')` tới `#cta-decisions` và kích hoạt bằng `page.keyboard.press('Enter')`.<br>- ComputedStyle Transition/Animation 9 phần tử = 0s/none. | - 1440: cw=1425, sw=1425; 768: cw=753, sw=753; 390: cw=375, sw=375 (100% overflow=false).<br>- 3/3 hàng dữ liệu chuẩn xác từng tuple; static label = true.<br>- Pointer CTA: hash đổi `#section-organization`, inView=true (`pass: true`).<br>- **Native Keyboard CTA**: Tab 1 tới cta-organization, Tab 2 tới cta-decisions; `activeElementBeforeEnter: "cta-decisions"`; `hashAfterEnter: "#section-decisions"`; `targetInView: true` (`pass: true`).<br>- 9/9 phần tử đạt Zero Motion. | **PASS** *(R01 CLOSED)* |
| **Q06** | Quyết định có căn cứ và có xét cái giá | Lập luận ADOPT có chừng mực, nêu rõ đánh đổi mới và giới hạn bằng chứng | Khớp với kết quả kiểm chứng ảnh và mã nguồn | **PASS** *(Review 002 confirmed)* |
| **Q07** | Bài học có phạm vi và ngoại lệ | 3 bài học thu hẹp trong bối cảnh bài tập TRACE | Có đầy đủ 6 trường theo schema, loại bỏ mọi phát biểu tuyệt đối | **PASS** *(Review 002 confirmed)* |

---

## 7. Ba bài học có giới hạn phạm vi (Bounded Learnings) (Q07 — ĐÃ PASS TẠI REVIEW 002)

### Bài học 1: Nhóm thông tin đồng cấp vào một khung chia hairline (Grouped Container with Internal Hairlines)
- **Observation**: Trong bài tập TRACE, việc gom 3 quyết định thiết kế từ 3 thẻ card riêng biệt vào một khung nhóm chung có đường hairline dọc ngăn cách giúp cấu trúc khối gọn gàng hơn và tăng tính liên kết giữa các đoạn đặc tả đồng cấp.
- **Rule candidate**: Khi cần trình bày một nhóm thông tin đồng cấp có tính gắn kết nội dung cao trong một giao diện công cụ kỹ thuật, có thể thử nghiệm phương án khung nhóm chung phân cách bằng hairline thay vì chia thành các hộp card hoàn toàn riêng biệt.
- **Applies when**: Các khối nội dung có vai trò bổ trợ lẫn nhau trong cùng một chủ đề (như các phần của một tài liệu đặc tả hoặc các bước hướng dẫn đọc tuần tự).
- **Exception**: Khi các thành phần con cần được kéo thả độc lập, chọn lọc riêng lẻ qua checkbox, hoặc có trạng thái đóng/mở (accordion) riêng, giải pháp hộp độc lập hoặc ranh giới tương tác rõ ràng vẫn là cần thiết.
- **Evidence**: Đối chiếu Section 03 giữa `screenshots/baseline_desktop_fullpage.png` và `screenshots/candidate_desktop_fullpage.png`.
- **Status**: `EXERCISE_SUPPORTED`

---

### Bài học 2: Phân tầng hai dòng cho bảng dữ liệu nhỏ trên di động (2-Line Row Layout for Compact Mobile Tables)
- **Observation**: Với bảng dữ liệu 3 cột của TRACE (Tên tài liệu, Người phụ trách, Trạng thái), chuyển đổi mỗi hàng thành 2 dòng trên màn hình 390px (Dòng 1: Tiêu đề; Dòng 2: Người phụ trách + Huy hiệu) giúp tên tài liệu không bị bẻ vụn và không phát sinh cuộn ngang.
- **Rule candidate**: Đối với các bảng dữ liệu nhỏ (khoảng 3–4 trường ngắn, có một trường tên chính và metadata phụ) trên màn hình hẹp, bố cục phân dòng theo cặp là một giải pháp hữu hiệu để duy trì khả năng đọc mà không cần cuộn ngang.
- **Applies when**: Danh sách thực thể trên màn hình di động (<600px) có tiêu đề cần đọc phẳng và một số thuộc tính trạng thái đi kèm.
- **Exception**: Không áp dụng khi người dùng có nhiệm vụ cốt lõi là so sánh đối chiếu giá trị số học theo cột dọc (ví dụ bảng báo cáo tài chính nhiều cột), lúc này bảng dạng lưới kèm cuộn ngang hoặc cố định cột (sticky) phù hợp hơn.
- **Evidence**: Nhận xét C01 và kết quả đo `hasHorizontalOverflow: false` ở 390px trong `VERIFICATION.json`.
- **Status**: `EXERCISE_SUPPORTED`

---

### Bài học 3: Quy ước phân loại bốn danh mục trong phản biện thiết kế (Four-Category Critique Taxonomy Convention)
- **Observation**: Việc phân định rõ ràng các nhận xét thành 4 nhóm (`defect`, `tradeoff`, `preference`, `strength`) trong bài tập này giúp tách biệt rạch ròi giữa việc sửa lỗi bắt buộc và việc thử nghiệm cải tiến có đánh đổi.
- **Rule candidate**: Trong các quy trình phản biện thiết kế nội bộ, việc áp dụng khung phân loại 4 nhóm kèm yêu cầu bằng chứng cụ thể giúp cuộc thảo luận tập trung vào nhiệm vụ người dùng thay vì tranh cãi về sở thích thị giác.
- **Applies when**: Các phiên review thiết kế kỹ thuật, kiểm toán chất lượng giao diện hoặc chuyển giao giữa thiết kế và lập trình.
- **Exception**: Ở giai đoạn khám phá ý tưởng ban đầu (brainstorming / moodboarding), việc áp đặt khung phân loại quá khắt khe có thể làm giảm tốc độ sáng tạo tự do.
- **Evidence**: Bảng nhận xét C01–C05 và ma trận đối chiếu 4 câu hỏi trong báo cáo này.
- **Status**: `EXERCISE_SUPPORTED`

---

## 8. Giới hạn nghiên cứu & Tính trung thực của bằng chứng (Limitations)

1. **Phân định bằng chứng**: Toàn bộ dữ liệu trong `VERIFICATION.json` là kết quả đo đạc kỹ thuật tự động do Antigravity thực hiện qua Chrome DevTools Protocol. Bằng chứng bàn phím đã được nâng cấp lên thao tác bàn phím thực nghiệm qua `page.keyboard.press('Tab')` và `page.keyboard.press('Enter')`.
2. **Thiếu dữ liệu người dùng định lượng**: Các kết luận về tính thẩm mỹ và nhịp thở mở là giả thuyết thiết kế được kiểm chứng về mặt hiển thị không lỗi; chưa có dữ liệu đo đạc thời gian hoàn thành tác vụ hay phỏng vấn người dùng thực tế.
