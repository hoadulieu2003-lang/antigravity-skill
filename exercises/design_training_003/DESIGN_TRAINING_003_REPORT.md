# BÁO CÁO NGHIỆM THU HIỆU CHỈNH: DESIGN_TRAINING_003 (Round 01 Repair — Rev 002)
## Module 03: Kiến Trúc Thông Tin & Khả Năng Tìm Lại (Information Architecture & Findability)

* **Mã kiểm duyệt**: `DESIGN_TRAINING_003_REPAIR_001` (Vòng sửa triển khai 1/2)
* **Người thực hiện (`Executor`)**: Antigravity (Senior AI Engineering Agent)
* **Kiểm duyệt kiến trúc (`Reviewer`)**: ChatGPT (Architectural Ideator / Port 9223)
* **Chủ quản tối cao (`Owner`)**: Anh — Lead Architect / Product Owner
* **Nguồn chuẩn mã nguồn (`Canonical Implementation`)**: `index.html` (Đường dẫn tương đối; không nhúng bản sao mã nguồn vào báo cáo để bảo đảm duy nhất một nguồn sự thật).
* **Phụ thuộc tài nguyên mạng**: Google Fonts (`Plus Jakarta Sans`) nạp trong `<head>` của `index.html`. Ngoài ra không dùng bất kỳ thư viện JS/CSS ngoài nào.
* **Ghi chú thẩm định tự kiểm**: Toàn bộ số đo, ảnh chụp màn hình và nhật ký kiểm thử trong báo cáo này cùng tệp `VERIFICATION.json` là kết quả tự kiểm nghiệm thực tế của Antigravity qua giao thức Chrome CDP / Puppeteer (sử dụng API bàn phím tự động hóa `page.keyboard`, không gọi là bàn phím vật lý của người dùng); Controller xem xét mã nguồn, xem ảnh và thực thi riêng hàm lọc để đối chiếu logic, chưa chạy lại runtime trình duyệt độc lập.

---

## 1. Bảng Khắc Phục Đối Soát F01 – F03 (Review 001 Findings Matrix)

| Mã Finding | Yêu cầu hiệu chỉnh từ Review 001 | Kết quả kỹ thuật đã thực hiện | Tệp bằng chứng xác minh |
| :--- | :--- | :--- | :--- |
| **F01** *(Hiển thị từ khóa dạng văn bản thuần)* | Trong `render()`, không nội suy trực tiếp `state.searchQuery` vào HTML string qua `innerHTML`. Dùng DOM API, gán nội dung bằng `textContent` để tránh HTML injection và hiển thị nguyên văn ký tự đặc biệt. | • Tái cấu trúc hàm hiển thị chip trong `render()` sang hàm `appendChip()` sử dụng DOM API chuẩn: `document.createElement('span')`, `document.createTextNode()`, và gán giá trị bằng `strong.textContent = valueText`.<br>• Bổ sung ca kiểm thử văn bản thuần với từ khóa chứa ký hiệu HTML đặc biệt: `<bản mẫu & "test">`. Kết quả xác nhận `textContent` hiển thị nguyên vẹn `"<bản mẫu & \"test\">"`, mã nguồn DOM mã hóa an toàn `&lt;bản mẫu &amp; "test"&gt;`, không sinh thẻ lạ. | • `index.html` (dòng 1083–1105)<br>• `VERIFICATION.json` (`f01_plain_text_check`) |
| **F02** *(Làm rõ hai phương án kiến trúc & Chuẩn hóa nguồn)* | • Bổ sung phương án đối chiếu thực sự khác biệt về cấu trúc phân nhóm (có tài liệu đổi nhóm thực tế), phân tích tác động tới 4 tình huống.<br>• Bỏ khẳng định tuyệt đối hóa quy tắc ("từ 10 tài liệu... bắt buộc").<br>• Dẫn chuẩn xác ấn bản sách 4th Edition, Chương 6: Organization Systems (Morville, Rosenfeld, Arango).<br>• Phân định rõ SC 2.4.5 là nguồn cảm hứng cho danh mục, không ép buộc mọi bản ghi SPA phải có nhiều đường vào. | • Đã xây dựng Phương án A thực sự khác biệt (Phân nhóm theo Vai trò / Đối tượng sử dụng `Audience-Based`) làm đối trọng với Phương án B (Miền công việc / Dòng chảy `Workflow-Based`). Trong đó các tài liệu `D02`, `D08`, `D09`, `D10` đổi nhóm hoàn toàn so với Phương án B.<br>• Nguồn sách trích dẫn chính xác: *Peter Morville, Louis Rosenfeld, Jorge Arango — "Information Architecture: For the Web and Beyond", 4th Edition (O'Reilly, 2015), Chapter 6: Organization Systems*.<br>• Bỏ các khẳng định tuyệt đối hóa con số; giới hạn áp dụng được làm rõ theo ngữ cảnh bài toán. | • `DESIGN_TRAINING_003_REPORT.md` (mục 2 & mục 4) |
| **F03** *(Bổ sung bằng chứng T09 & Đo đạc 768px)* | • Bổ sung ca T09: Nhóm Tất cả, lưu trữ tắt, từ khóa "dang nhap" $\to$ chọn "Đang soạn" (mong đợi D04) $\to$ đổi "Hiện hành" (mong đợi D05, D06) $\to$ Xóa điều kiện (D01–D10).<br>• Bổ sung số đo tại viewport tablet 768×1024: clientWidth, scrollWidth, body.scrollWidth, DPR, font, tràn ngang và khả năng tiếp cận bàn phím tới tab cuối.<br>• Chạy lại T02 và T07 để xác nhận không có hồi quy. | • Đã bổ sung ca kiểm thử tự động **T09** trong `VERIFICATION.json` gồm 4 bước hoàn chỉnh, ghi nhận rõ `targetedElement`, `activeElementBefore/After`. Cả 4 bước đều đạt kết quả mong đợi chính xác.<br>• Đo đạc thực tế tại Tablet 768×1024: `clientWidth = 753px`, `scrollWidth = 753px`, `bodyScrollWidth = 753px` $\to$ không tràn ngang toàn trang (`horizontalOverflow: false`). Tab cuối (`tab-ops`) nằm trọn trong viewport và tiếp cận focus bằng bàn phím hoàn hảo (`isTabOpsAccessibleByKeyboard: true`).<br>• Chạy lại T02 (D04, D05, D06) và T07 (focus hoàn trả D05) đều đạt PASS 100%. | • `VERIFICATION.json` (`t09_status_filter_check`, `tablet_768px_measurements`, `rerun_checks`) |

---

## 2. So Sánh Hai Phương Án Kiến Trúc Thông Tin & Quyết Định Lựa Chọn (Hiệu Chỉnh F02)

> *Ghi nhận thẩm định: Tại lần nộp r01, bảng so sánh hai phương án có cùng tập thành viên giữa các nhóm, chỉ khác tên gọi nhãn. Tại bản r02 này, Antigravity đối soát một Phương án A thực sự khác biệt về bản chất tổ chức dữ liệu (Phân nhóm theo Vai trò người dùng).*

### 2.1. Đối chiếu chi tiết Phương án A và Phương án B

| Tiêu chí so sánh | Phương án A: Phân nhóm theo Đối tượng người dùng & Vai trò (`Audience / Role-Based Schemes`) | Phương án B: Phân nhóm theo Miền công việc & Dòng chảy (`Domain / Workflow-Based Schemes` — **Được chọn**) |
| :--- | :--- | :--- |
| **Nguyên tắc tổ chức cốt lõi** | Phân nhóm dựa trên câu hỏi: *"Tài liệu này phục vụ đối tượng / vai trò nào trong dự án?"* | Phân nhóm dựa trên câu hỏi: *"Người dùng đang cần giải quyết công việc thuộc phân hệ nào?"* |
| **Cơ cấu 4 nhóm chính** | 1. **Quản lý & Nghiệm thu**: `D01, D09, D10, D11` (4 docs)<br>2. **Kỹ thuật & Kiến trúc**: `D02, D08` (2 docs)<br>3. **Thiết kế & Bản mẫu**: `D03, D04, D12` (3 docs)<br>4. **Kiểm thử & Sử dụng**: `D05, D06, D07` (3 docs) | 1. **Yêu cầu & Đặc tả**: `D01, D02, D11` (3 docs)<br>2. **Giao diện & Trải nghiệm**: `D03, D04, D12` (3 docs)<br>3. **Chất lượng & Kiểm thử**: `D05, D06` (2 docs)<br>4. **Vận hành & Dự án**: `D07, D08, D09, D10` (4 docs) |
| **Các tài liệu thay đổi nhóm thực tế** | • `D02` (Luồng tạo tài khoản): Chuyển từ "Đặc tả" sang nhóm "Kỹ thuật & Kiến trúc" vì là luồng kỹ thuật chi tiết dành cho kỹ sư.<br>• `D08` (Hướng dẫn triển khai): Nằm ở nhóm "Kỹ thuật & Kiến trúc" thay vì "Vận hành".<br>• `D09` (Biên bản bàn giao) & `D10` (Biên bản họp khởi động): Đưa vào nhóm "Quản lý & Nghiệm thu" cùng với `D01`.<br>• `D07` (Hướng dẫn sử dụng): Đưa vào nhóm người dùng cuối cùng với bộ kiểm thử. | • `D02` đi cùng `D01, D11` trong nhóm Yêu cầu cốt lõi.<br>• `D07, D08, D09, D10` đi cùng nhau trong nhóm Vận hành & Dự án, phản ánh mốc bàn giao thực tế.<br>• Giữ cấu trúc theo miền công việc nhất quán. |
| **Tác động đến 4 tình huống tìm kiếm** | • **Tình huống 1** (kiểm tra đăng nhập): Cả 2 đều tìm thấy `D05` trong nhóm Kiểm thử.<br>• **Tình huống 2** (hướng dẫn triển khai bàn giao): Ở PA A, người dùng phải suy luận đây là tài liệu của vai trò "Kỹ thuật & Kiến trúc" chứ không phải nhóm Vận hành. Nếu người tìm là nhân viên hỗ trợ triển khai, họ có thể phân vân vai trò.<br>• **Tình huống 3** (xem yêu cầu sản phẩm): Ở PA A, `D01` nằm chung với các biên bản họp `D09, D10` khiến danh sách bị phân tán giữa đặc tả chức năng và thủ tục hành chính.<br>• **Tình huống 4** (bản mẫu cũ): Cả 2 đều tìm thấy `D12` trong nhóm Thiết kế khi bật lưu trữ. | • **Tình huống 1**: Tìm thấy `D05` trong nhóm "Chất lượng & Kiểm thử".<br>• **Tình huống 2**: Tìm thấy `D08` ngay tại nhóm "Vận hành & Dự án" rất tự nhiên, không cần đoán xem mình thuộc vai trò gì.<br>• **Tình huống 3**: `D01` nằm thuần túy trong nhóm "Yêu cầu & Đặc tả", không bị lẫn biên bản.<br>• **Tình huống 4**: `D12` hiển thị rõ trong "Giao diện & Trải nghiệm". |

### 2.2. Lý do lựa chọn Phương án B và Hai điểm đánh đổi (`Trade-offs`)
Antigravity quyết định giữ **Phương án B** làm bản triển khai thực tế vì trong bối cảnh một dự án phần mềm có quy mô tập trung (Dự án Mẫu), người dùng có xu hướng tư duy theo miền bài toán ("Tôi cần tìm tài liệu vận hành / đặc tả") thay vì phải tự xác định bản thân đang đóng vai trò nào trong dự án.

* **Đánh đổi 1 — Trừu tượng hóa nhãn nhóm so với nhãn loại văn bản gốc**: Nhóm "Vận hành & Dự án" gom cả Hướng dẫn triển khai/sử dụng (`D07, D08`) và Biên bản mốc dự án (`D09, D10`). Điều này giúp giao diện tinh gọn (đáp ứng giới hạn tối đa 4 nhóm chính), đổi lại người mới vào dự án cần đọc lướt qua tóm tắt để hiểu biên bản bàn giao nằm tại nhóm này.
* **Đánh đổi 2 — Bố cục danh sách phẳng có chỉ báo miền so với Cấu trúc cây thư mục phân cấp**: Để tuân thủ giới hạn bài tập (không quá 1 cấp nhóm trong giao diện), hệ thống tổ chức danh sách phẳng có thẻ nhóm trực quan thay vì cây thư mục lồng nhau (`nested folder tree`). Đổi lại, việc tìm kiếm nhanh phụ thuộc vào tab điều hướng và thanh tìm kiếm từ khóa.

---

## 3. Bảng Ánh Xạ Nhóm Điều Hướng → 12 ID Tài Liệu (Phương Án B Đang Triển Khai)

| Nhóm Điều Hướng (Tab) | Danh sách ID Tài liệu | Số lượng | Chi tiết trạng thái |
| :--- | :--- | :---: | :--- |
| **Tất cả (`all`)** | `D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12` | **12** | Mặc định hiển thị D01–D10 (10 tài liệu); ẩn D11 & D12 (Lưu trữ) |
| **Yêu cầu & Đặc tả (`req`)** | `D01, D02, D11` | **3** | D01 (Hiện hành), D02 (Hiện hành), D11 (Lưu trữ) |
| **Giao diện & Trải nghiệm (`ui`)** | `D03, D04, D12` | **3** | D03 (Hiện hành), D04 (Đang soạn), D12 (Lưu trữ) |
| **Chất lượng & Kiểm thử (`qa`)** | `D05, D06` | **2** | D05 (Hiện hành), D06 (Hiện hành) |
| **Vận hành & Dự án (`ops`)** | `D07, D08, D09, D10` | **4** | D07 (Hiện hành), D08 (Hiện hành), D09 (Đang soạn), D10 (Hiện hành) |

### 3.1. Phân định Điều hướng, Bộ lọc và Trạng thái Mặc định
* **Thuộc tính Điều hướng chính (`Navigation Facet`)**: Tab 1 cấp gồm `Tất cả`, `Yêu cầu & Đặc tả`, `Giao diện & Trải nghiệm`, `Chất lượng & Kiểm thử`, `Vận hành & Dự án`. Mặc định chọn: `Tất cả`.
* **Thuộc tính Bộ lọc phụ (`Secondary Filters` — đúng 2 bộ lọc theo giới hạn đề bài)**:
  1. *Lọc Trạng thái (`#filter-status`)*: Giá trị gồm `all` (Tất cả trạng thái), `Hiện hành`, `Đang soạn`. Mặc định: `all`.
  2. *Hộp kiểm Lưu trữ (`#filter-archive`)*: Giá trị boolean. **Mặc định: Bỏ chọn (`false`)** $\to$ ẩn các tài liệu có trạng thái "Lưu trữ" (D11, D12).
* **Ô Tìm kiếm (`#search-input`)**: Tìm kiếm toàn văn không dấu trên cả `Tiêu đề` và `Tóm tắt`.
* **Quy tắc Phép giao (`Conjunction AND Invariant`)**: Kết quả trả về là tập giao đồng thời: `matchesGroup AND matchesStatus AND matchesArchive AND matchesKeyword`.

---

## 4. Nghiên Cứu Có Giới Hạn — 3 Nguyên Tắc Kiến Trúc Thông Tin & Khả Năng Tìm Lại (Chuẩn Hóa F02)

### Nguyên tắc 1: Phân Tách Chiều Điều Hướng và Chiều Thuộc Tính Lọc (Facet Decoupling)
* **Nguồn & Mục gốc**: *Peter Morville, Louis Rosenfeld, Jorge Arango — "Information Architecture: For the Web and Beyond", 4th Edition (O'Reilly Media, 2015), Chapter 6: "Organization Systems" (Mục "Organization Schemes" và "Task-based Schemes", [https://www.oreilly.com/library/view/information-architecture-4th/9781491913529/ch06.html](https://www.oreilly.com/library/view/information-architecture-4th/9781491913529/ch06.html)).*
* **Diễn giải bằng lời**: Trong thiết kế kiến trúc thông tin, việc cố gắng nhồi nhét mọi chiều dữ liệu (ví dụ: Miền công việc × Thể loại văn bản × Vòng đời trạng thái) vào một cây phân cấp duy nhất sẽ dẫn đến hiện tượng phân mảnh cấu trúc (`Hierarchical Proliferation`), khiến người dùng bị lạc trong các thư mục con rườm rà. Thay vào đó, Morville & Rosenfeld khuyến nghị phân tách: sử dụng một hệ thống phân loại chủ đạo làm trục điều hướng chính (trong bài này là Miền công việc), và phân tách các thuộc tính trực giao (như Trạng thái hay Lưu trữ) thành các bộ lọc thuộc tính độc lập (`Faceted Filtering`).
* **Phạm vi áp dụng**: 4 nhóm miền công việc đóng vai trò là tab điều hướng chính; trạng thái `Hiện hành` / `Đang soạn` và hộp kiểm `Lưu trữ` là các bộ lọc kết hợp theo phép giao AND.
* **Ngoại lệ & Ranh giới**: Điều kiện áp dụng dựa trên nhiệm vụ tìm kiếm và các chiều thuộc tính có sẵn của dữ liệu, không coi con số 12 tài liệu là một ngưỡng phổ quát. Khi tập dữ liệu cực nhỏ (< 4 mục) hoặc dữ liệu không có các thuộc tính trực giao, việc phân tách facet có thể tạo thêm thao tác thừa cho người dùng.

---

### Nguyên tắc 2: Đa Lối Tiếp Cận Thông Tin Trong Danh Mục (Multiple Retrieval Pathways)
* **Nguồn & Mục gốc**: *Được gợi cảm hứng từ nguyên lý định vị của W3C WCAG 2.2 — Success Criterion 2.4.5 "Multiple Ways" (Level AA) ([https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html)).*
* **Diễn giải bằng lời**: Người dùng có các thói quen tìm kiếm thông tin rất khác nhau tùy thuộc vào lượng thông tin họ nắm giữ trong đầu. Có người nhớ chính xác tên (dùng ô tìm kiếm), có người chỉ nhớ nhiệm vụ/giai đoạn (duyệt theo tab nhóm), có người cần lọc theo trạng thái nghiệm thu (dùng dropdown trạng thái). Nguyên tắc đa lối tiếp cận trong danh mục khuyến khích cung cấp nhiều hơn một cơ chế định vị để người dùng tiếp cận được cùng một tài liệu mà không bị trói buộc vào một đường dẫn duy nhất.
* **Phạm vi áp dụng**: Tài liệu `D05` có thể được tìm thấy bằng cách gõ từ khóa "kịch bản", hoặc chuyển tab sang "Chất lượng & Kiểm thử", hoặc chọn lọc trạng thái "Hiện hành".
* **Ngoại lệ & Ranh giới**: SC 2.4.5 gốc trong WCAG áp dụng cho việc tìm một trang web trong một tập hợp các trang (với ngoại lệ cho các bước quy trình tuyến tính). Ở đây, ta áp dụng tinh thần nguyên lý này vào giao diện danh mục SPA; điều này **không có nghĩa là mọi bản ghi trong một ứng dụng đều bắt buộc phải có nhiều đường vào**, đặc biệt với các dữ liệu mang tính bảo mật hoặc quy trình bắt buộc tuần tự.

---

### Nguyên tắc 3: Toàn Vẹn Ngữ Cảnh & Hoàn Trả Focus Khi Quay Lại (Context Preservation & Focus Restoration)
* **Nguồn & Mục gốc**: *Suy luận và áp dụng trực tiếp từ đặc tả bài tập `DESIGN_TRAINING_003_DIRECTIVE.md` kết hợp cùng lập luận thiết kế trợ năng tương tác.*
* **Diễn giải bằng lời**: Khả năng tìm lại (`Findability`) là một hành trình khép kín gồm: Tìm kiếm $\to$ Mở chi tiết $\to$ Quay lại danh sách để tiếp tục đối chiếu. Nếu thao tác quay lại làm mất toàn bộ từ khóa, đưa bộ lọc về rỗng, làm nhảy vị trí cuộn và để focus rơi tự do về đỉnh trang, người dùng sẽ bị đứt gãy mạch nhận thức (`Cognitive Disruption`) và phải thao tác lại từ đầu.
* **Phạm vi áp dụng**: Khi bấm nút "Quay lại danh sách" (hoặc nhấn phím `Escape`), hệ thống bảo lưu nguyên vẹn từ khóa tìm kiếm, tab nhóm đang chọn, trạng thái bộ lọc, số lượng kết quả, cuộn trang tức thì về vị trí cũ và hoàn trả focus chuẩn xác về thẻ tài liệu vừa mở (`#doc-card-${id}`).
* **Ngoại lệ & Ranh giới**: Phân biệt rành mạch giữa yêu cầu bảo toàn ngữ cảnh/focus hoàn trả này với tiêu chí WCAG SC 2.4.7 ("Focus Visible" — chỉ yêu cầu focus có chỉ báo nhìn thấy được). Ngữ cảnh chỉ được xóa khi người dùng chủ động nhấn nút "Xóa điều kiện".

---

## 5. Đường Đi & Trải Nghiệm Của 4 Tình Huống Tìm Thông Tin

| Tình huống thực tế của người dùng | Điểm bắt đầu tối ưu | Đường đi thao tác | Kết quả đạt được & Lý do không nhầm lẫn |
| :--- | :--- | :--- | :--- |
| **1. "Tôi cần biết phải kiểm tra đăng nhập như thế nào"** | Ô tìm kiếm hoặc Tab "Chất lượng & Kiểm thử" | Gõ `"kiem tra dang nhap"` hoặc chọn tab Chất lượng $\to$ kết quả hiển thị duy nhất **D05** (`Kịch bản kiểm thử đăng nhập`). | **Đúng D05**: D05 chứa các tình huống kiểm tra và kết quả mong đợi. Phân biệt rành mạch với **D06** (`Báo cáo kiểm thử đăng nhập`) là báo cáo ghi nhận lỗi sau khi đã chạy xong. |
| **2. "Tôi cần hướng dẫn đưa bản bàn giao lên môi trường chạy"** | Ô tìm kiếm hoặc Tab "Vận hành & Dự án" | Gõ `"trien khai"` hoặc chọn tab Vận hành & Dự án $\to$ kết quả hiển thị **D08** (`Hướng dẫn triển khai`). | **Đúng D08**: Tóm tắt ghi rõ "Các bước chuẩn bị môi trường và triển khai bản bàn giao". Không nhầm lẫn với **D07** (`Hướng dẫn sử dụng`) dành riêng cho người thao tác chức năng sản phẩm. |
| **3. "Tôi cần xem yêu cầu sản phẩm đang dùng"** | Tab "Yêu cầu & Đặc tả" hoặc Ô tìm kiếm | Tab mặc định (không bật lưu trữ), gõ `"yeu cau san pham"` $\to$ hiển thị duy nhất **D01** (`Yêu cầu sản phẩm`). | **Đúng D01**: D01 có trạng thái "Hiện hành" phục vụ nghiệm thu hiện tại. Không nhầm lẫn với **D11** (`Yêu cầu sản phẩm bản cũ`) vì D11 là tài liệu Lưu trữ và mặc định bị ẩn. |
| **4. "Tôi cần tìm lại bản mẫu đăng nhập trước đây"** | Ô tìm kiếm + Hộp kiểm Lưu trữ | Bật checkbox `"Bao gồm tài liệu lưu trữ"`, gõ `"ban cu"` hoặc `"dang nhap"` $\to$ kết quả hiển thị **D12** (`Bản mẫu màn hình đăng nhập bản cũ`). | **Đúng D12**: D12 có huy hiệu trạng thái "Lưu trữ" và banner cảnh báo màu hổ phách, tóm tắt ghi rõ "được giữ để tham khảo lịch sử". Người dùng nhận biết ngay đây là bản mẫu lịch sử. |

---

## 6. Bảng Kết Quả Kiểm Thử Thực Nghiệm Độc Lập (T01 – T09 & Đo Đạc 768px)

> *Ghi chú: Toàn bộ các ca kiểm tra dưới đây được thực thi tự động khép kín qua Chrome CDP / Puppeteer (sử dụng API bàn phím tự động hóa `page.keyboard`), kết quả được ghi nhận đồng bộ vào tệp `VERIFICATION.json`.*

### 6.1. Bảng kết quả các ca kiểm thử T01 – T09

| Mã Ca | Trạng thái ca | Điều kiện & Thao tác thực hiện | Phần tử kích hoạt & Phương thức | `activeElement` trước / sau | Kết quả mong đợi vs Thực tế | Phán quyết |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **T01** | *Kế thừa r01* | Mở mới ban đầu (Tất cả, không lưu trữ) | Điều hướng trang | `none` $\to$ `none` | Mong đợi: D01–D10 (10 tài liệu).<br>Thực tế: D01–D10 (10 tài liệu). | **PASS** |
| **T02** | *Chạy lại r02* | Nhập chuỗi `"  DANG NHAP  "` | `search-input` (keyboard.type) | `none` $\to$ `search-input` | Mong đợi: D04, D05, D06 (3 tài liệu).<br>Thực tế: D04, D05, D06 (3 tài liệu). Chip hiển thị chuẩn qua textContent. | **PASS** |
| **T03** | *Kế thừa r01* | Giữ từ khóa T02, bật hộp kiểm Lưu trữ | `filter-archive` (Checkbox Toggle) | `search-input` $\to$ `search-input` | Mong đợi: D04, D05, D06, D12 (4 tài liệu).<br>Thực tế: D04, D05, D06, D12 (4 tài liệu). | **PASS** |
| **T04** | *Kế thừa r01* | Chọn tab `tab-qa`, gõ `"kịch bản"` | `tab-qa` (Click) + `search-input` (type) | `tab-qa` $\to$ `search-input` | Mong đợi: D05 (1 tài liệu).<br>Thực tế: D05 (1 tài liệu). | **PASS** |
| **T05** | *Kế thừa r01* | Tìm `"không có tài liệu xyz"` | `search-input` (keyboard.type) | `search-input` $\to$ `search-input` | Mong đợi: 0 tài liệu, hiện thẻ `#empty-state` và nút xóa.<br>Thực tế: 0 tài liệu, empty-state hiển thị rõ ràng. | **PASS** |
| **T06** | *Kế thừa r01* | Bấm nút "Xóa điều kiện" từ T05 | `btn-empty-clear` (UI Click) | `search-input` $\to$ `search-input` | Mong đợi: Khôi phục về T01 (10 tài liệu D01–D10).<br>Thực tế: D01–D10, từ khóa rỗng, tab Tất cả. | **PASS** |
| **T07** | *Chạy lại r02* | Mở D05 $\to$ Bấm nút Quay lại | `doc-card-D05` $\to$ `btn-back-to-list` (Enter) | `doc-card-D05` $\to$ `btn-back-to-list` $\to$ `doc-card-D05` | Mong đợi: Giữ nguyên từ khóa, 3 kết quả, focus trả về `doc-card-D05`.<br>Thực tế: Focus hoàn trả chuẩn xác về `doc-card-D05`! | **PASS** |
| **T08** | *Kế thừa r01* | Bật lưu trữ, tìm `"bản cũ"`, Enter mở D12 | `search-input` $\to$ `doc-card-D12` (Enter) | `search-input` $\to$ `btn-back-to-list` | Mong đợi: Danh sách gồm D11, D12; chi tiết D12 có nhãn Lưu trữ & banner cảnh báo.<br>Thực tế: Đúng D12, có nhãn Lưu trữ và banner cảnh báo. | **PASS** |
| **T09** | **Mới bổ sung (F03)** | • Bước 1: Tất cả, không lưu trữ, từ khóa `dang nhap` $\to$ D04, D05, D06.<br>• Bước 2: Chọn `#filter-status` = "Đang soạn" $\to$ duy nhất D04.<br>• Bước 3: Đổi `#filter-status` = "Hiện hành" $\to$ D05, D06.<br>• Bước 4: Bấm `#btn-clear-filters` $\to$ D01–D10. | `#filter-status` (bàn phím/select) + `#btn-clear-filters` (click) | Bước 2: `filter-status` $\to$ `filter-status`<br>Bước 3: `filter-status` $\to$ `filter-status`<br>Bước 4: `filter-status` $\to$ `search-input` | Mong đợi:<br>B2: D04 (1 doc)<br>B3: D05, D06 (2 docs)<br>B4: D01–D10 (10 docs).<br>Thực tế: Khớp 100% từng bước! | **PASS** |

### 6.2. Kiểm tra văn bản thuần F01 (Plain Text Chip Rendering)
* **Từ khóa đầu vào**: `<bản mẫu & "test">` (chứa ký tự nhạy cảm HTML).
* **Nội dung `textContent` thực tế trong chip**: `"<bản mẫu & "test">"` (khớp chính xác chuỗi nhập).
* **Mã nguồn HTML sinh ra**: `<span class="filter-chip">Từ khóa: <strong>"&lt;bản mẫu &amp; "test"&gt;"</strong></span>`.
* **Phán quyết F01**: **PASS** — Không có thẻ HTML lạ được tạo ra trong DOM (`hasInjectedTags: false`).

### 6.3. Đo đạc nhanh tại Tablet Viewport 768×1024 (F03)
* **Kích thước đo đạc**:
  - `innerWidth`: `768px`
  - `documentElement.clientWidth`: `753px` (sau khi trừ thanh cuộn dọc mặc định)
  - `documentElement.scrollWidth`: `753px`
  - `body.scrollWidth`: `753px`
  - `horizontalOverflow`: `false` (`scrollWidth <= clientWidth`, hoàn toàn không tràn ngang).
* **Khả năng tiếp cận thanh tab điều hướng**:
  - Tab cuối cùng (`tab-ops`: "Vận hành & Dự án") nhận focus bằng bàn phím thành công (`isTabOpsAccessibleByKeyboard: true`).
  - Toàn bộ tab nằm trọn trong màn hình nhìn thấy (`isTabOpsInViewport: true`).
* **Trạng thái Font chữ**: `document.fonts.check('16px "Plus Jakarta Sans"') === true`.
* **Phán quyết 768px**: **PASS**.

---

## 7. Danh Mục Tệp Trong Gói Nộp (`design_training_003_submission_r02.zip`)

1. `index.html`: Mã nguồn canonical trang đơn độc lập, đã cập nhật `textContent` DOM API an toàn cho bộ lọc (F01).
2. `DESIGN_TRAINING_003_REPORT.md`: Báo cáo kỹ thuật hiệu chỉnh đối soát vòng 1/2 này.
3. `VERIFICATION.json`: Tệp log kiểm thử mở rộng gồm toàn bộ T01–T08 kế thừa, T09 mới, kiểm tra F01 văn bản thuần và số đo Tablet 768px.
4. `screenshots/`: Thư mục 5 ảnh chụp chuẩn DPR = 2 kế thừa từ r01 (bố cục thị giác không đổi):
   - `desktop_default_1440x900.png` (Kế thừa r01)
   - `mobile_default_390x844.png` (Kế thừa r01)
   - `desktop_search_dang_nhap_1440x900.png` (Kế thừa r01)
   - `mobile_zero_results_390x844.png` (Kế thừa r01)
   - `mobile_detail_d12_390x844.png` (Kế thừa r01)
