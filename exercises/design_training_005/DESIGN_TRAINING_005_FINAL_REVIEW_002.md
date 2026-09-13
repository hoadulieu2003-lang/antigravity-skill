DESIGN_TRAINING_005_FINAL_REVIEW_002

Module: 05 — Art Direction, định hướng nghệ thuật và bản sắc thị giác

Submission: DESIGN_TRAINING_005_REPAIR_001

Gói nghiệm thu: design_training_005_submission_r02.zip

SHA-256 đã đối chiếu: 12302f8c948dd48126cb756f20c4e64639642eba8394a0501006c6034c850bf1

VERDICT: PASS

MODULE_COMPLETED: true

Hướng được chấp nhận: B — Hệ thống

Vòng sửa đã sử dụng: 1/2

Không yêu cầu vòng sửa 2/2

1. Phán quyết

Chấp nhận bản r02 trong phạm vi bài tập đã khóa. Các điểm chặn F01–F03 được xử lý đủ để nghiệm thu: bảng mobile phục vụ đọc và đối chiếu, bản mẫu được ghi rõ là tĩnh, những mục contract sai khác đã cập nhật, số liệu tương phản có phép tính thay vì ghi cứng.

Đây là công nhận hoàn thành bài tập định hướng nghệ thuật. Không đồng nghĩa hướng B đã được thử nghiệm với người dùng thật, có bản sắc độc quyền trên thị trường hoặc được Anh phê duyệt cho một sản phẩm thương mại.

2. Bằng chứng đã đối soát

Controller đã:

Giải nén gói và đối chiếu SHA-256 khớp thông tin bàn giao.

Đọc contract, các phần mã responsive/nhãn bản mẫu, hàm tính tương phản và kết quả kiểm chứng liên quan.

Xem bốn ảnh bản cuối: desktop/mobile ở đầu trang và fullpage.

So sánh hai file HTML nháp cùng hai ảnh A/B với r01: cả bốn tệp giống từng byte. Vì vậy giữ nguyên kết quả V02 từ review trước.

Đối chiếu sáu tỷ lệ tương phản trong JSON với kết quả tính độc lập ở Review 001: khớp ở mức làm tròn hai chữ số.

Controller chưa chạy trình duyệt độc lập. Hành vi CTA, bàn phím, font và số đo viewport trong log là bằng chứng tự kiểm của Antigravity. Review khả năng đọc và bố cục dưới đây là nhận định trực tiếp từ ảnh, không được suy ra chỉ từ các cờ PASS.

3. Đóng F01–F03
F01 — PASS: bảng mobile đọc được

Ảnh fullpage mobile thể hiện tên ba tài liệu trên dòng riêng, không còn bị ép thành các cột từ ngắn. Dòng dưới ghép người phụ trách có nhãn với trạng thái đúng của cùng tài liệu. Mã DOC không còn chiếm phần lớn không gian cần cho tên.

Trên desktop, flex được chuyển vào .doc-cell-content; các ô giữ cấu trúc bảng và đường phân cách chạy cùng cao độ. Thay đổi này phục vụ trực tiếp ý đồ đối chiếu, đồng thời giữ ngôn ngữ khung, nhãn và màu của hướng B.

Không nâng kết quả “một dòng ở 390px trong môi trường này” thành yêu cầu mọi tên tài liệu luôn một dòng. Với nội dung dài hơn hoặc font khác, xuống dòng hợp lý vẫn được chấp nhận.

F02 — PASS: bản mẫu và contract nhất quán hơn

H1 và body lead trong contract đã cập nhật thành clamp(2.25rem, 4vw, 3rem) và 1.125rem.

Signature đã khớp MODULE 01: TRACE SPECIMEN cùng nhãn BẢN MẪU TĨNH.

Nhãn ở hero không còn tạo kỳ vọng rằng đang có tiến trình thực thi hoặc dữ liệu thời gian thực.

Quyết định nền sáng được giới hạn theo dự án; không chuyển động được gắn với yêu cầu bài tập.

Font stack được diễn giải là danh sách ứng viên có fallback, không phải bằng chứng Inter/SF Mono chắc chắn được render trên mọi máy.

Chấp nhận contract như mô tả ý đồ và các quyết định chính của bản cuối. Không tuyên bố đã kiểm toán từng giá trị CSS hoặc xác minh font render thực tế.

F03 — PASS: bằng chứng có phương pháp rõ hơn

Script đã có hàm tính độ chói và tỷ lệ tương phản cho sáu cặp màu được chọn. Các tỷ lệ 17.06, 7.24, 17.85, 7.29, 6.37 và 6.38 khớp đối chiếu trước.

Đây là phép tính trên cặp màu token đã khai báo, không phải phép đo mọi điểm ảnh hay mọi trạng thái giao diện. Các nhãn AA/AAA của từng cặp không chứng nhận toàn trang đạt mức đó.

rowHeightAdequate chỉ là số đo có ngưỡng về chiều cao hàng; estimatedLines là ước lượng. Bản nộp đã dành phần kết luận khả năng đọc cho review thị giác, đúng yêu cầu. Controller chấp nhận khả năng đọc từ ảnh thực tế.

Hướng dẫn đã nêu dependency puppeteer-core và giới hạn bằng chứng trong môi trường Chrome CDP. Fallback tìm dependency ở thư mục cũ vẫn tồn tại nhưng không bắt buộc khi dependency thông thường đã cài; không chặn nghiệm thu ứng dụng trong phạm vi bài tập này.

4. Rubric thị giác cuối
Mục	Phán quyết	Căn cứ
Phù hợp brief	ĐẠT	Thông điệp và bản mẫu cùng phục vụ tổ chức bàn giao; nhãn tĩnh trung thực.
Khác biệt có chủ đích	ĐẠT	Giữ kết quả A/B: chữ, cách đóng khung và xử lý bản mẫu khác nhau rõ ràng.
Phân cấp và bố cục	ĐẠT	H1, đoạn dẫn, hai CTA và hình minh họa có vai trò phân biệt.
Nhất quán	ĐẠT	Chữ sans–mono, nền sáng, đường kẻ và bảng dữ liệu duy trì cùng hướng; các sai khác contract trọng yếu đã sửa.
Chuyển sang mobile	ĐẠT	Chuyển cách tổ chức hàng để giữ quan hệ dữ liệu, thay vì ép nguyên bảng desktop vào màn hình hẹp.

Ba thẻ quyết định thiết kế vẫn là hình thức quen thuộc. Điều này không vi phạm brief hoặc rubric, nên không yêu cầu thay đổi chỉ để tạo cảm giác mới lạ.

5. Kết quả V01–V08
Ca	Kết luận
V01 — Nội dung và dữ liệu	PASS trong phạm vi đối soát bài tập
V02 — Khác biệt A/B	PASS, kế thừa review r01 và xác nhận tệp không đổi
V03 — Contract và bản cuối	PASS theo đối soát các quyết định trọng yếu
V04 — CTA có đích	PASS theo mã/log tự kiểm
V05 — Bàn phím	PASS theo bằng chứng tự kiểm đã nộp; chưa chạy lại độc lập
V06 — Responsive và khả năng đọc	PASS qua ảnh và số đo tự kiểm ba viewport
V07 — Ngữ nghĩa và tương phản	PASS trong phạm vi kiểm tra đã nộp; không phải audit trợ năng toàn diện
V08 — Không chuyển động và tái hiện	PASS trong phạm vi ứng dụng cục bộ và dependency được mô tả
6. Ghi nhận kiến thức và chuyển tiếp

Bài học trọng tâm: giữ bản sắc không có nghĩa giữ nguyên hình học desktop. Bản mobile có thể đổi bố cục mà vẫn giữ quan hệ thông tin, giọng chữ, màu và cách phân nhóm của cùng một hướng nghệ thuật.

Các bài học bổ sung:

Ý đồ thiết kế phải được nhìn thấy trong sản phẩm, không chỉ có trong luận điểm.

Contract cần theo kịp những quyết định đã thay đổi khi triển khai.

Nhãn giao diện phải phản ánh đúng bản chất dữ liệu minh họa.

Không tràn ngang chưa đủ để kết luận dễ đọc.

Số đo kỹ thuật, review thị giác và nghiên cứu người dùng là ba loại bằng chứng khác nhau.

Antigravity được cập nhật status của DESIGN_CONTRACT.yaml thành ACCEPTED_FOR_EXERCISE, kèm tham chiếu phán quyết này khi lưu trữ. Không sửa ngược gói ZIP đã nghiệm thu dưới cùng hash; nếu tạo bản lưu mới thì giữ được liên hệ với gói r02 này. Không cần nộp lại chỉ để đổi trạng thái contract.

Module 05 đã đóng. Có thể tiếp tục chương trình mà không dùng vòng sửa 2/2. Gu cuối cùng và quyết định dùng cho sản phẩm thực tế vẫn thuộc Anh.