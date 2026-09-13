# DESIGN_TRAINING_007_DIRECTIVE

## Transfer Testing on a New Brief — Bài kiểm tra chuyển giao trên đề bài mới

```yaml
directive_id: DESIGN_TRAINING_007
module: 07
stage: FOUNDATION_TRANSFER_CAPSTONE
authority: ChatGPT Architectural Controller
executor: Antigravity
product_owner: Anh — Lead Architect / Product Owner
status: ISSUED
repair_budget: 2
previous_gate:
  module: DESIGN_TRAINING_006
  verdict: PASS
  completed: true
```

## 1. Mục tiêu

Module 07 kiểm tra liệu Antigravity có thể chuyển sáu năng lực đã học sang một sản phẩm và miền nghiệp vụ hoàn toàn mới hay không:

1. Composition;
2. Visual Hierarchy;
3. Information Architecture;
4. Interaction Design;
5. Art Direction;
6. Evidence-based Design Critique.

Đây không phải bài tái tạo TRACE bằng nội dung khác. Kết quả phải có logic thị giác riêng, phù hợp nghiệp vụ mới, đồng thời chứng minh được bằng mã nguồn, hành vi, ảnh và log kiểm thử.

Module đánh giá năng lực **transfer**, không đánh giá khả năng ghi nhớ hình thức của các bài trước.

## 2. Bối cảnh sản phẩm mới

### 2.1. Tên sản phẩm giả định

**TRIPFLOW — Bảng điều phối tour khởi hành**

### 2.2. Đối tượng sử dụng

Điều phối viên tại một doanh nghiệp du lịch quy mô nhỏ hoặc vừa. Người này cần theo dõi nhiều đoàn tour sắp khởi hành, phát hiện hồ sơ chưa sẵn sàng, liên hệ đối tác và ghi lại tiến độ xử lý.

### 2.3. Bối cảnh sử dụng

- Làm việc trên desktop tại văn phòng nhưng đôi khi kiểm tra bằng điện thoại.
- Thường xuyên bị gián đoạn bởi cuộc gọi và tin nhắn.
- Cần tìm lại một tour bằng tên, người phụ trách hoặc vấn đề đang chờ.
- Không cần dashboard biểu diễn thành tích; cần biết việc nào phải xử lý tiếp.

### 2.4. Nhiệm vụ chính

Trong vòng quan sát đầu tiên, giao diện phải giúp người dùng:

1. nhận ra tour khởi hành gần nhưng chưa sẵn sàng;
2. hiểu nguyên nhân đang chờ;
3. mở hồ sơ tour đó;
4. ghi nhận một lần liên hệ đối tác;
5. phục hồi được khi lần lưu đầu tiên thất bại.

Các phát biểu “nhận ra nhanh”, “dễ dùng” hoặc “giảm thời gian” chỉ được gọi là **design intent** nếu chưa có thử nghiệm người dùng.

## 3. Mốc dữ liệu chuẩn

Mốc thời gian giả định cố định của bài tập:

```text
13/09/2026 — 18:00, múi giờ Asia/Ho_Chi_Minh
```

Không dùng thời gian hệ thống hiện tại để thay đổi thứ tự hoặc kết quả kiểm thử.

## 4. Dữ liệu canonical khóa cứng

Baseline và Candidate phải chứa đủ tám bản ghi sau, đúng ID, tiêu đề, thời gian, người phụ trách, trạng thái và vấn đề. Không tự thêm thành tích, số liệu kinh doanh hoặc dữ liệu khách hàng thật.

| ID | Tour | Khởi hành | Phụ trách | Trạng thái | Vấn đề / ghi chú |
|---|---|---|---|---|---|
| T01 | Hạ Long 2N1Đ | 14/09/2026 07:30 | Lan | Chờ đối tác | Khách sạn chưa xác nhận 4 phòng |
| T02 | Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách |
| T03 | Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD |
| T04 | Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn |
| T05 | Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành |
| T06 | Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận |
| T07 | Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng |
| T08 | Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký |

### 4.1. Tập “Cần xử lý” khóa cứng

Khi chọn bộ lọc `Cần xử lý`, kết quả phải là:

```text
T01, T03, T06
```

### 4.2. Tập “Khởi hành trong 48 giờ” khóa cứng

Tính từ mốc giả định tại Mục 3, kết quả phải là:

```text
T01, T02
```

### 4.3. Ưu tiên hiển thị Candidate

Candidate phải ưu tiên T01 vì tour khởi hành trong vòng 24 giờ và đang chờ xác nhận đối tác. Đây là quy tắc của bài tập, không phải kết luận phổ quát cho mọi hệ thống điều phối.

## 5. Hai sơ đồ kiến trúc thông tin bắt buộc

Trước khi chọn cấu trúc Candidate, Anti phải xây hai phương án thực sự khác nhau:

### Phương án A — Theo thời gian khởi hành

Ví dụ nhóm:

- Trong 48 giờ;
- 3–7 ngày;
- Đã hoàn thành.

### Phương án B — Theo luồng xử lý

Ví dụ nhóm:

- Cần xử lý;
- Đang chuẩn bị;
- Sẵn sàng;
- Đã hoàn thành.

Yêu cầu:

- Lập bảng ánh xạ T01–T08 vào cả hai sơ đồ.
- Phân tích tối thiểu ba tình huống truy xuất thực tế.
- Chọn một sơ đồ làm điều hướng chính cho Candidate.
- Sơ đồ không được trộn với bộ lọc thuộc tính. Tìm kiếm, người phụ trách và trạng thái phải có vai trò được giải thích rõ.
- Không được tuyên bố một sơ đồ “tốt hơn” nếu không gắn với nhiệm vụ cụ thể.

## 6. Baseline requirements

Tạo `baseline/index.html` trước Candidate và ghi SHA-256 vào báo cáo.

Baseline là bản tham chiếu trung tính, đầy đủ chức năng; không được cố tình tạo lỗi để Candidate dễ thắng.

Baseline bắt buộc:

- chứa đủ T01–T08;
- có tìm kiếm tiếng Việt không dấu, không phân biệt hoa/thường, tự trim khoảng trắng;
- tìm kiếm trên ID, tên tour, người phụ trách, trạng thái và nội dung vấn đề/ghi chú;
- có bộ lọc `Tất cả`, `Cần xử lý`, `Trong 48 giờ`, `Sẵn sàng`, `Hoàn thành`;
- có bộ lọc người phụ trách;
- hỗ trợ phép giao AND giữa từ khóa và các bộ lọc;
- mở được chi tiết từng tour;
- quay lại danh sách vẫn giữ search/filter và hoàn trả focus về tour vừa mở;
- có interaction ghi nhận liên hệ theo Mục 9;
- đạt semantic HTML cơ bản, bàn phím và focus visible;
- không có tràn ngang và không có motion.

Baseline có thể đơn giản về art direction nhưng phải sử dụng được. Không được gắn nhãn “bad design”, không dùng tương phản thấp, chữ quá nhỏ, lỗi responsive hoặc hành vi giả để tạo đối chứng thiên lệch.

Sau khi baseline được khóa:

- không sửa baseline để làm thay đổi kết quả so sánh;
- nếu phát hiện lỗi chức năng chung, sửa cùng một patch ở cả baseline và Candidate rồi ghi vào change ledger;
- ghi hash trước và sau mọi patch được phép.

## 7. Candidate requirements

Tạo `candidate/index.html` với cùng dữ liệu và cùng kết quả hành vi như baseline, nhưng tổ chức lại bằng sáu năng lực nền tảng.

Candidate phải:

### 7.1. Composition

- Có một điểm tập trung chính trên màn hình đầu tiên.
- T01 được ưu tiên nhưng không làm biến mất T02 và tổng quan danh sách.
- Khoảng trắng, trục căn và mật độ phải có chủ đích.
- Không bắt buộc sử dụng hero marketing.

### 7.2. Visual hierarchy

- Người dùng phân biệt được: tour cần xử lý ngay, vấn đề, thời gian, trạng thái và hành động chính.
- Primary action không cạnh tranh ngang mức với các thao tác phụ.
- Trạng thái không được truyền đạt chỉ bằng màu.

### 7.3. Information architecture

- Thể hiện rõ sơ đồ điều hướng đã chọn.
- Search, group, status và owner filters phải có vai trò riêng.
- Có số lượng kết quả và empty state.
- Có lệnh `Xóa điều kiện` để trở về trạng thái mặc định.
- Chi tiết và quay lại phải bảo toàn ngữ cảnh.

### 7.4. Interaction design

- Có trạng thái editing, invalid, saving, error và success.
- Có phản hồi cụ thể, focus hợp lý và retry không bắt nhập lại.
- Không sinh duplicate commit khi gửi lặp.
- Draft, payload và committed activity phải tách biệt.

### 7.5. Art direction

Xây hai hướng thị giác trước khi chọn Candidate:

- **Direction A — Dispatch Ledger:** cảm giác sổ điều phối, ghi chú tuyến, nhịp biên tập ấm và thực dụng.
- **Direction B — Departure Board:** cảm giác biển khởi hành, biển chỉ dẫn, độ quét cao và chính xác vận hành.

Hai hướng phải khác nhau tối thiểu trên ba trục:

1. typography;
2. composition/grid;
3. visual asset/data treatment.

Chọn một hướng, giải thích hai đánh đổi và tạo `DESIGN_CONTRACT.yaml` ánh xạ được sang token/CSS thật.

### 7.6. Critique

Trước khi khóa Candidate cuối:

- lưu `candidate/pre_critique.html`;
- viết 4–6 nhận xét, mỗi nhận xét thuộc một loại `defect`, `tradeoff`, `preference` hoặc `strength`;
- bắt buộc có ít nhất một strength được giữ;
- chọn đúng một giả thuyết sửa;
- thực hiện tối đa hai thay đổi có quan hệ trực tiếp;
- quyết định `ADOPT`, `KEEP_PRE_CRITIQUE` hoặc `INCONCLUSIVE`;
- cả ba quyết định đều có thể PASS nếu trung thực và có bằng chứng.

## 8. Anti-copy và DNA mới

Candidate không được sao chép hình học TRACE.

Không dùng lại đồng thời các dấu hiệu sau:

- hero chia đôi giống TRACE;
- nhãn `MODULE // SPECIMEN`;
- bảng ma trận ba cột cùng cấu trúc;
- cùng cặp navy/cyan;
- Section 03 ba cột quyết định giống Module 05/06;
- lời văn hoặc tên class mang nhận diện TRACE.

Được tái sử dụng nguyên tắc và utility kỹ thuật phổ quát, nhưng phải tạo ngôn ngữ thị giác phù hợp điều phối tour.

Avoid-list:

- generic SaaS card grid;
- purple AI gradient;
- excessive glassmorphism;
- random illustration/blob;
- dashboard metric tiles không phục vụ nhiệm vụ;
- trang trí bản đồ hoặc máy bay không có giá trị thông tin;
- 3D, parallax và animation trong module này.

## 9. Interaction contract khóa cứng

Interaction áp dụng trong chi tiết T01: **Ghi nhận đã liên hệ khách sạn**.

### 9.1. Dữ liệu biểu mẫu

- Trường ghi chú: bắt buộc, tối đa 160 ký tự sau trim.
- Không dùng `maxlength` để che mất ca kiểm tra 161 ký tự.
- Thông báo thiếu: `Nhập nội dung liên hệ trước khi lưu.`
- Thông báo quá dài: `Ghi chú cần tối đa 160 ký tự.`

### 9.2. Mock persistence xác định

- Độ trễ cố định: 800ms.
- Lần gửi hợp lệ thứ nhất: thất bại.
- Lần gửi hợp lệ thứ hai: thành công.
- Error message: `Chưa lưu được nhật ký liên hệ. Nội dung của bạn vẫn được giữ.`
- Retry action: `Thử lưu lại`.
- Success message: `Đã lưu nhật ký liên hệ cho T01.`

### 9.3. Dữ liệu sau thành công

Không sửa dữ liệu canonical hoặc tự chuyển trạng thái tour. Chỉ thêm một committed activity trong phiên:

```text
Đã liên hệ khách sạn — [nội dung ghi chú]
```

`commitCount` phải bằng 1 sau retry thành công.

### 9.4. Focus contract

- Validation focus trường sai đầu tiên.
- Nút hành động chính phải là phần tử DOM ổn định xuyên editing → saving → error → retry saving.
- Trong saving, focus không rơi về body.
- Error đưa hoặc giữ focus tại nút `Thử lưu lại` theo logic được giải thích.
- Success chỉ chuyển focus có điều kiện nếu người dùng vẫn đang ở luồng submit; không cướp focus nếu họ đã Tab tới phần tử ổn định khác.
- Nút quay lại danh sách hoàn trả focus về thẻ/hàng T01 và giữ toàn bộ điều kiện tìm kiếm/lọc.

### 9.5. Duplicate guard

Hai kích hoạt bổ sung trong lúc saving không được làm tăng `attemptCount` hoặc tạo thêm commit.

## 10. Invariants toàn module

### 10.1. Light Theme Invariant

- Chỉ dùng giao diện sáng.
- Canvas và surface phải sáng, phân tầng rõ.
- Màu được định nghĩa bằng primitive token và semantic token.
- Không dùng nền tối toàn trang hoặc đảo theme.

### 10.2. Responsive Viewports

Phải kiểm:

| Thiết bị | Viewport | DPR |
|---|---:|---:|
| Desktop | 1440×900 | 2 |
| Tablet | 768×1024 | 2 |
| Mobile | 390×844 | 2 |

Ở cả ba kích thước:

- `documentElement.scrollWidth <= documentElement.clientWidth`;
- không cắt tiêu đề, nhãn trạng thái hoặc primary action;
- dữ liệu tour vẫn đọc được;
- chi tiết, form, feedback và nút retry không vượt viewport ngang.

### 10.3. Zero Motion Invariant

- `transition: none`;
- `animation: none`;
- không spinner chuyển động;
- không smooth scroll;
- mọi cuộn lập trình phải tức thì;
- không dùng reduced-motion như lý do để giữ motion mặc định — bài tập này khóa zero motion cho mọi người dùng.

### 10.4. WCAG 2.1 AA — phạm vi kiểm thực hành

- Chữ thường đạt tối thiểu 4.5:1; chữ lớn đạt tối thiểu 3:1.
- Thành phần giao diện và focus indicator đạt tối thiểu 3:1 với màu liền kề.
- Có focus visible cho phần tử tương tác.
- Thứ tự bàn phím hợp lý.
- Form có label; lỗi được liên kết bằng `aria-describedby` hoặc cơ chế tương đương.
- Status/error/success thay đổi động được thông báo bằng live region phù hợp.
- Không dùng màu là kênh duy nhất.
- Landmark, heading, button/link semantics phải đúng.
- Touch target tối thiểu 44×44 CSS px là ràng buộc dự án của Module 07, không được ghi nhầm là chứng nhận toàn bộ WCAG 2.1 AA.

Không được tuyên bố toàn bộ sản phẩm “WCAG certified”. Chỉ báo cáo các tiêu chí và cặp màu đã đo.

### 10.5. Technical invariant

- Một trang HTML độc lập cho từng artifact.
- Vanilla HTML/CSS/JS; không framework.
- Không cần server backend.
- System font hoặc font local có trong gói; không phụ thuộc mạng.
- Không tải thư viện/CDN bên ngoài.
- Dữ liệu người dùng nhập phải render bằng `textContent`/DOM API an toàn, không nội suy vào `innerHTML`.

## 11. Gate thẩm định

### G01 — Transfer Integrity

PASS khi:

- đúng brief TRIPFLOW và dữ liệu T01–T08;
- không sao chép DNA TRACE;
- baseline không bị cố tình làm hỏng;
- baseline được hash và bảo toàn;
- Candidate thể hiện chuyển giao của cả sáu module.

### G02 — Composition & Visual Hierarchy

PASS khi:

- T01 là focus chính có lý do;
- thời gian, vấn đề, trạng thái và hành động có thứ bậc rõ;
- không có CTA cạnh tranh hoặc mật độ vô nghĩa;
- desktop/tablet/mobile đều được Controller thẩm định bằng ảnh.

### G03 — Information Architecture & Findability

PASS khi:

- có hai sơ đồ phân loại thực sự khác nhau và ánh xạ đủ T01–T08;
- lựa chọn Candidate gắn với tình huống truy xuất;
- search/filter AND, empty state, clear conditions hoạt động;
- detail/back bảo toàn ngữ cảnh và focus.

### G04 — Interaction, Feedback & Recovery

PASS khi:

- FSM đúng hợp đồng Mục 9;
- validation, error, retry, success có nội dung cụ thể;
- draft/payload/committed activity tách biệt;
- duplicate submit bị chặn;
- chuỗi bàn phím native hoạt động khép kín.

### G05 — Art Direction & Contract Fidelity

PASS khi:

- hai hướng khác nhau trên ít nhất ba trục;
- hướng chọn phù hợp điều phối tour;
- Design Contract khớp token, DOM và ảnh;
- label giao diện không giả trạng thái real-time hoặc kết nối dữ liệu thật.

### G06 — Evidence-based Critique

PASS khi:

- critique phân loại đúng và giữ ít nhất một strength;
- một hypothesis, tối đa hai thay đổi liên quan;
- baseline của vòng critique là `pre_critique.html` có hash;
- quyết định cuối không vượt quá bằng chứng;
- bài học có Applies/Exception/Evidence/Status.

### G07 — Accessibility, Responsive & Invariants

PASS khi:

- Light Theme, Zero Motion và ba viewport đều đạt;
- contrast, keyboard, focus, live feedback, labels và semantics có log;
- không dùng màu đơn độc;
- không tuyên bố chứng nhận rộng hơn phép kiểm.

### G08 — Reproducibility & Evidence Integrity

PASS khi:

- gói chạy được ngoài máy tác giả;
- script dùng đường dẫn tương đối và cổng CDP cấu hình được;
- phân biệt pointer, native keyboard và DOM programmatic;
- JSON verdict được tính từ assert, không hardcode PASS;
- báo cáo phân biệt self-test của Anti với review độc lập của Controller;
- ảnh, JSON, report và code không mâu thuẫn.

## 12. Bộ kịch bản kiểm thử khóa cứng

Chạy cùng core scenarios trên baseline và Candidate, trừ các test art direction chỉ áp dụng Candidate.

### T01 — Initial data integrity

- Hiển thị đủ T01–T08.
- Mặc định không làm mất T08.
- Candidate ưu tiên T01 và vẫn cho thấy đường tới toàn bộ danh sách.

### T02 — Vietnamese search

Nhập:

```text
  KHACH SAN  
```

Kết quả chính xác: `T01`.

### T03 — Filter intersection

- Chọn `Cần xử lý` → `T01, T03, T06`.
- Kết hợp owner `Huy` → `T03, T06`.
- Thêm query `nha xe` → `T06`.

### T04 — Time filter

Chọn `Trong 48 giờ` → `T01, T02` dựa trên mốc cố định, không dựa vào đồng hồ máy.

### T05 — Empty and reset

- Query `tour không tồn tại xyz` → 0 kết quả và empty state.
- `Xóa điều kiện` → khôi phục đủ T01–T08 và focus về search input hoặc điểm được giải thích hợp lý.

### T06 — Detail context preservation

- Từ một trạng thái filter/search, mở T03 bằng bàn phím.
- Quay lại danh sách.
- Search/filter/count giữ nguyên.
- Focus trở về đúng trigger T03.

### T07 — Validation

- Gửi trống → đúng lỗi, focus ghi chú, attemptCount = 0.
- Gửi 161 ký tự → lỗi tối đa 160, attemptCount = 0.
- Sửa còn 160 ký tự → lỗi được xóa hoặc cập nhật đúng lúc được mô tả.

### T08 — First valid submit fails

- Gửi hợp lệ lần một → saving trong 800ms.
- Trường/nút khóa theo contract; duplicate blocked.
- Sau 800ms → error đúng nội dung.
- Draft nguyên vẹn; commitCount = 0; attemptCount = 1.

### T09 — Retry succeeds

- Kích hoạt `Thử lưu lại`.
- Trong retry saving, focus không rơi về body.
- Sau 800ms → success.
- Committed activity khớp draft; attemptCount = 2; commitCount = 1.
- Canonical status T01 vẫn là `Chờ đối tác`.

### T10 — Duplicate guard

Trong saving lần đầu, gửi thêm bằng pointer và Enter. `attemptCount` vẫn bằng 1 và `commitCount` vẫn bằng 0 khi lỗi trả về.

### T11 — Native keyboard journey

Trên mobile 390×844, dùng `page.keyboard`, không dùng `.focus()`/`.click()` thay thế:

- đi tới search;
- tìm T01;
- mở chi tiết;
- tới textarea;
- nhập ghi chú;
- submit;
- retry;
- quay lại danh sách.

Ghi `targetedElement`, `activeElementBefore`, `activeElementAfter`, scroll position và phần tử có trong viewport cho từng bước quan trọng.

### T12 — Responsive, contrast and zero motion

- Không tràn ngang ở 1440/768/390.
- Đo các cặp màu đại diện thực tế bằng sRGB relative luminance.
- Quét CSS/runtime cho motion trong phạm vi toàn trang.
- Kiểm focus indicator và target size.

### T13 — Safe rendering

Nhập ghi chú:

```text
<b>Đã gọi & "xác nhận"</b>
```

Nội dung committed phải hiển thị nguyên văn, không sinh thẻ lạ và không thực thi HTML.

### T14 — Baseline/Candidate parity

So sánh kết quả T01–T13 giữa baseline và Candidate. Khác biệt trình bày được phép; dữ liệu, outcome và error messages phải tương đương.

## 13. Evidence requirements

### 13.1. Ảnh bắt buộc

Tối thiểu:

1. `baseline_desktop_1440x900.png`;
2. `baseline_mobile_390x844.png`;
3. `direction_a_desktop_1440x900.png`;
4. `direction_b_desktop_1440x900.png`;
5. `candidate_pre_critique_desktop_1440x900.png`;
6. `candidate_final_desktop_1440x900.png`;
7. `candidate_final_tablet_768x1024.png`;
8. `candidate_final_mobile_390x844.png`;
9. `candidate_mobile_error_390x844.png`;
10. `candidate_mobile_success_390x844.png`.

Ảnh phải chụp từ tệp thực tế trong gói, ghi viewport, DPR và trạng thái. Không dùng ảnh dựng tay thay bằng chứng runtime.

### 13.2. Log

`VERIFICATION.json` phải chứa:

- môi trường và timestamp;
- hash baseline/pre-critique/final;
- T01–T14 với precondition, method, measured values, assertions, pass/fail;
- viewport measurements;
- contrast pairs;
- focus sequences;
- attemptCount/commitCount/draft/payload/committed state;
- tổng verdict được tính từ assertions.

### 13.3. Báo cáo

`DESIGN_TRAINING_007_REPORT.md` phải có:

1. Executive summary;
2. Source and hash ledger;
3. Canonical data confirmation;
4. IA comparison and decision;
5. Art Direction A/B and decision;
6. Design Contract mapping;
7. Baseline → pre-critique → final change ledger;
8. Critique observations and hypothesis;
9. Interaction/FSM model;
10. Accessibility and responsive evidence;
11. T01–T14 result table;
12. Trade-offs and limitations;
13. Three bounded learnings;
14. Self-verdict: `READY_FOR_CONTROLLER_REVIEW` or `NOT_READY`.

Không nhúng toàn bộ mã nguồn vào report. Dẫn đường dẫn tương đối tới file canonical.

## 14. Quy chuẩn đóng gói

Tên gói vòng đầu:

```text
design_training_007_submission_r01.zip
```

Cấu trúc:

```text
design_training_007_submission_r01.zip
├── baseline/
│   └── index.html
├── directions/
│   ├── option_a.html
│   └── option_b.html
├── candidate/
│   ├── pre_critique.html
│   └── index.html
├── DESIGN_CONTRACT.yaml
├── DESIGN_TRAINING_007_DIRECTIVE.md
├── DESIGN_TRAINING_007_REPORT.md
├── CHANGE_LEDGER.md
├── VERIFICATION.json
├── verify_module_007.js
└── screenshots/
    └── ...
```

Quy tắc:

- đường dẫn ZIP dùng `/`;
- không chứa absolute path, credentials, cache hoặc `node_modules`;
- script resolve file tương đối từ `__dirname`;
- cổng CDP nhận qua CLI/env, có giá trị mặc định được ghi rõ;
- toàn bộ tài sản cần thiết hoạt động offline;
- báo SHA-256 của ZIP khi nộp.

## 15. Định dạng bàn giao

Antigravity gửi message:

```text
BÀN GIAO NGHIỆM THU: DESIGN_TRAINING_007 — Rev 001
Mã nộp: DESIGN_TRAINING_007_SUBMISSION_R01
Gói nộp: design_training_007_submission_r01.zip
SHA-256: <hash>

1. Hướng IA đã chọn và lý do
2. Hướng Art Direction đã chọn và hai đánh đổi
3. Kết quả critique: hypothesis, hai thay đổi tối đa, quyết định
4. Kết quả T01–T14
5. Điểm chưa chắc chắn / giới hạn bằng chứng
6. Danh sách tài sản trong ZIP
```

Không chỉ gửi lời tuyên bố PASS. Controller sẽ đọc file, ảnh, code và log trước khi quyết định.

## 16. Phán quyết và chống doom loop

Controller sử dụng một trong ba kết quả:

```yaml
VERDICT: PASS | REPAIR_REQUIRED | FAIL_ESCALATE
MODULE_COMPLETED: true | false
```

- Tối đa hai vòng sửa.
- Mỗi review chỉ được yêu cầu sửa lỗi thuộc gates đã khóa trong directive này.
- Không phát sinh gu thẩm mỹ mới ở vòng sửa nếu Candidate đã đáp ứng contract.
- Không bắt buộc Candidate thắng Baseline về mọi mặt.
- Nếu quyết định critique là KEEP_PRE_CRITIQUE hoặc INCONCLUSIVE nhưng lập luận đúng và invariants đạt, Module vẫn có thể PASS.
- Hết hai vòng mà blocker vẫn còn: dừng và chuyển Lead Architect quyết định.

## 17. Điều kiện hoàn tất

Module 07 chỉ hoàn tất khi:

```yaml
all_gates: G01-G08 PASS
locked_tests: T01-T14 PASS
open_blockers: 0
controller_verdict: PASS
module_completed: true
transfer_result: DEMONSTRATED
```

Sau Module 07, lộ trình chuyển sang Module 08 — Color Systems. Không đưa màu sắc nâng cao, motion hoặc 3D vào bài này ngoài các invariant tối thiểu đã khóa.
