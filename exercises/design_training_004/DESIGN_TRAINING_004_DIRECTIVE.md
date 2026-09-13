DESIGN_TRAINING_004_DIRECTIVE

Module 04: Thiết kế tương tác — trạng thái, phản hồi và phục hồi lỗi

Trạng thái: AUTHORIZED / SPEC_LOCKED

Điều kiện đầu vào: Module 03 đã PASS

Executor: Antigravity

Reviewer: ChatGPT Controller

Product Owner: Anh — Lead Architect

Mã nộp đầu tiên: DESIGN_TRAINING_004_SUBMISSION_R01

Ngân sách sửa: tối đa 2 vòng sau lần nộp đầu

1. Mục tiêu học tập

Thiết kế một luồng giao việc mô phỏng mà người dùng luôn trả lời được: Tôi đang làm gì? Hệ thống đã nhận thao tác chưa? Dữ liệu đã lưu chưa? Nếu lỗi thì làm tiếp thế nào?

Module này tập trung vào hành vi qua nhiều trạng thái. Chỉ cần một phương án giao diện được triển khai; không yêu cầu dựng A/B hay thêm dashboard. Kế thừa typography, phân cấp và kỷ luật bằng chứng đã học.

2. Bài tập và dữ liệu cố định

Xây một trang “Giao người xử lý” cho công việc giả lập sau:

Trường	Giá trị chuẩn
Mã công việc	W01
Tiêu đề	Kiểm tra luồng đăng nhập
Mô tả	Đối chiếu bản mẫu với kịch bản kiểm thử trước khi bàn giao.
Trạng thái công việc	Chưa bắt đầu
Người xử lý ban đầu	Chưa giao
Ghi chú ban đầu	Rỗng

Biểu mẫu gồm đúng hai trường:

Người xử lý: select có lựa chọn mặc định “Chọn người xử lý”, P01 — An, P02 — Bình, P03 — Chi. Bắt buộc chọn một người.

Ghi chú: textarea tùy chọn, tối đa 200 ký tự theo JavaScript string.length sau trim. Đây là quy ước kỹ thuật của bài tập, không phải quy tắc đếm ký tự phổ quát. Để có thể kiểm thử lỗi quá dài, không chặn nhập bằng maxlength.

Dữ liệu kiểm thử hợp lệ: P02 — Bình; ghi chú “Đối chiếu các tình huống đăng nhập trước khi bàn giao.”

Phân biệt bản nháp trong biểu mẫu với bản đã lưu. Khu vực “Thông tin đã lưu” ban đầu hiển thị Chưa giao; chỉ đổi sau phản hồi thành công. Việc giao người không đổi trạng thái công việc thành Đang làm.

3. Phạm vi triển khai

HTML, CSS, JavaScript; index.html là nguồn chuẩn. Có thể tách file cục bộ nếu cần và ghi rõ cách chạy.

Backend giả lập trong bộ nhớ, không gửi dữ liệu ra dịch vụ ngoài. Tải lại trang khôi phục trạng thái ban đầu.

Dùng font hệ thống, không phụ thuộc tài nguyên mạng; không cần ảnh.

Không đăng nhập, phân quyền, lưu trữ thật, upload, tìm kiếm, modal xác nhận, undo hoặc hủy yêu cầu đang gửi.

Không animation, transition, spinner quay hay smooth scroll. Độ trễ phản hồi giả lập là trạng thái chờ có chủ đích, không phải hiệu ứng chuyển động.

Bố trí một khu vực riêng “Điều khiển bài tập” với nút “Đặt lại mô phỏng”. Đây là công cụ thử nghiệm, không được giả thành chức năng nghiệp vụ.

4. Mô hình trạng thái bắt buộc

Trước khi code, lập bảng trạng thái và sự kiện trong báo cáo. Có thể dùng tên nội bộ khác nếu ánh xạ rõ với bảng này.

Trạng thái	Sự kiện	Kết quả bắt buộc
editing	Gửi dữ liệu không hợp lệ	invalid; không gọi bộ lưu giả lập
invalid	Chỉnh trường	Giữ bản nháp; cập nhật lỗi đã hiển thị cho trường đó
editing hoặc invalid	Gửi dữ liệu hợp lệ	saving; chụp bản dữ liệu của lần gửi
saving	Phản hồi thất bại	error; bản đã lưu không đổi; giữ bản nháp
error	Thử lại	saving với cùng bản nháp, không bắt nhập lại
error	Chỉnh dữ liệu	editing; bỏ thông báo lỗi gửi đã lỗi thời
saving	Phản hồi thành công	success; cập nhật bản đã lưu đúng một lần
success	Sửa phân công	editing, điền sẵn dữ liệu đã lưu
Bất kỳ trạng thái trừ saving	Đặt lại mô phỏng	editing; xóa nháp, lỗi, dữ liệu lưu và bộ đếm

Trong saving, khóa chỉnh trường và mọi đường gửi thêm; nút đặt lại cũng không hoạt động. Khi success, không còn hành động gửi cùng phân công; chỉ có “Sửa phân công”.

Bộ lưu giả lập có kết quả xác định

Mỗi lần gửi hợp lệ chờ 1.200ms trước khi trả kết quả; test chờ theo trạng thái với timeout hợp lý, không yêu cầu thời gian thực thi chính xác từng mili giây.

Lần gửi hợp lệ đầu tiên kể từ đặt lại luôn thất bại.

Lần gửi hợp lệ thứ hai và các lần hợp lệ sau luôn thành công.

Submit không hợp lệ và thao tác gửi lặp trong saving không tăng số lần gọi.

Ghi nhận attemptCount và commitCount trong đối tượng chẩn đoán có thể đọc khi test. Không cần hiển thị bộ đếm trên giao diện nghiệp vụ.

Đặt lại mô phỏng đưa cả hai bộ đếm về 0.

5. Nội dung và phản hồi

Dùng các nhãn nghiệp vụ sau để kiểm thử thống nhất:

Trạng thái/hành động	Nội dung
Submit	Lưu phân công
Thiếu người xử lý	Chọn người xử lý trước khi lưu.
Ghi chú quá dài	Ghi chú cần tối đa 200 ký tự.
Đang gửi	Đang lưu phân công…
Gửi thất bại	Chưa lưu được phân công. Dữ liệu bạn nhập vẫn được giữ. Hãy thử lại.
Thử lại	Thử lưu lại
Thành công với Bình	Đã giao W01 cho Bình — kết quả mô phỏng.
Sửa sau thành công	Sửa phân công

Hiển thị rõ “Bài tập mô phỏng — dữ liệu không được lưu sau khi tải lại trang”. Không tự nhận đã gửi thông báo cho người được giao.

Không dùng màu làm dấu hiệu trạng thái duy nhất. Lỗi trường nằm cạnh trường; lỗi gửi nằm gần thao tác gửi và có đường thử lại. Phản hồi không tự biến mất theo thời gian.

6. Bàn phím, focus và viewport

Dùng form, label, select, textarea và button có ngữ nghĩa phù hợp. Nếu dùng validation tùy chỉnh, bảo đảm thông báo của trình duyệt không chặn luồng lỗi đã đặc tả.

Trường sai có aria-invalid và liên kết đến lỗi bằng aria-describedby; xóa trạng thái sai khi đã sửa hợp lệ.

Submit không hợp lệ đưa focus về trường sai đầu tiên theo thứ tự Người xử lý → Ghi chú.

Khi bắt đầu saving, không để focus rơi về body do xóa hoặc vô hiệu hóa phần tử đang focus. Có thể giữ nút trong DOM bằng aria-disabled cùng chặn sự kiện, hoặc chọn cách quản lý focus tương đương và ghi rõ.

Phản hồi chờ, lỗi gửi, thành công có cơ chế thông báo ngữ nghĩa thích hợp. Không chuyển focus tùy tiện khi phản hồi bất đồng bộ xuất hiện; nếu thay phần tử đang focus, phải chuyển sang vị trí hữu ích có giải thích.

“Sửa phân công” và “Đặt lại mô phỏng” đưa focus về select người xử lý.

Người dùng bàn phím phải thực hiện được toàn bộ chuỗi nhập → lỗi → sửa → gửi → thử lại → thành công.

Tại 390×844, sau mỗi phản hồi, thông báo và hành động tiếp theo phải tiếp cận được. Được cuộn tức thì khi cần; không bắt buộc scrollY = 0 hay toàn trang nằm trên màn hình đầu. Khi validation lỗi, ưu tiên đưa trường lỗi đầu tiên và thông báo liên quan vào tầm nhìn.

Không tràn ngang toàn trang tại 1440×900, 768×1024 và 390×844. Không có sticky header che focus.

Đây là hợp đồng tương tác của bài tập, không phải tuyên bố rằng chỉ thêm ARIA là đạt toàn bộ WCAG.

7. Nghiên cứu có giới hạn

Đọc hai nguồn gốc sau; trích xuất đúng ba nguyên tắc, mỗi nguyên tắc có: nguồn/mục thực sự đọc, diễn giải, áp dụng trong bài và ngoại lệ. Không cần nghiên cứu thêm thư viện.

W3C WAI — User Notifications: tham khảo phản hồi tổng thể và lỗi cạnh trường. Tài liệu hướng dẫn phản hồi kết quả gửi biểu mẫu và cách diễn đạt lỗi có hướng khắc phục.

W3C — Understanding Status Messages: phân biệt thông báo trạng thái được công nghệ hỗ trợ nhận biết với việc chủ động chuyển focus.

Các quy định 1.200ms, lần đầu lỗi, giới hạn ghi chú và đường focus cụ thể ở đây do Controller đặt cho bài tập. Không gán chúng thành yêu cầu của W3C. Không tự nhận đã kiểm thử trình đọc màn hình nếu chỉ kiểm tra DOM.

8. Bộ kiểm thử khóa T01–T10

Mỗi ca độc lập bắt đầu bằng đặt lại mô phỏng, trừ ca ghi rõ tiếp nối. Dùng cùng dữ liệu hợp lệ đã chốt.

Ca	Thao tác	Kết quả cần chứng minh
T01	Mở mới	editing; Chưa giao; hai trường mặc định; attemptCount=0, commitCount=0; chưa có lỗi
T02	Gửi khi chưa chọn người	invalid; lỗi đúng nội dung; focus select; attemptCount=0; dữ liệu lưu không đổi
T03	Chọn Bình, nhập 201 chữ a, gửi; sửa thành 200 chữ a	Quá dài bị từ chối, focus textarea, attemptCount=0; sau sửa lỗi trường được xóa; chuỗi 200 ký tự hợp lệ khi gửi
T04	Nhập dữ liệu hợp lệ và gửi lần đầu	Trong saving: trạng thái chờ hiện, trường bị khóa, dữ liệu lưu vẫn Chưa giao; sau phản hồi: error, attemptCount=1, commitCount=0, nháp nguyên vẹn
T05	Tiếp nối T04, bấm Thử lưu lại	saving → success; attemptCount=2, commitCount=1; Bình và ghi chú đã lưu khớp; thông báo đúng
T06	Gửi hợp lệ rồi kích hoạt gửi thêm hai lần trong lúc saving	Chỉ một lần gọi; attemptCount=1; kết thúc error; commitCount=0. Ghi rõ dùng click hay phím, không chỉ gọi trực tiếp hàm lưu
T07	Từ lỗi gửi, đổi Bình thành Chi rồi lưu	Lỗi gửi cũ được bỏ khi chỉnh; lần hợp lệ tiếp theo thành công với Chi; commitCount=1; không lưu nhầm bản nháp Bình
T08	Từ success, bấm Sửa phân công	editing; focus select; dữ liệu điền sẵn; bản đã lưu giữ nguyên trong lúc chỉnh; chưa phát sinh lần gọi mới
T09	Từ success, đặt lại mô phỏng; gửi hợp lệ lại	Đặt lại xóa toàn bộ trạng thái/bộ đếm, focus select; lần hợp lệ mới lại thất bại, attemptCount=1, commitCount=0
T10	Tại 390×844, chạy chuỗi T02 → sửa hợp lệ → T04 → T05 bằng bàn phím	Ghi phím thực tế, activeElement trước/sau, trạng thái, vị trí thông báo/hành động; không mất focus, không cần chuột để hoàn thành

T03 chỉ yêu cầu chứng minh chuỗi 200 ký tự được nhận vào saving, không yêu cầu lưu thành công ngay vì quy tắc lần đầu thất bại vẫn áp dụng. Textarea Enter là xuống dòng; kích hoạt submit bằng nút khi focus ở nút.

Thêm bảng đo nhanh ba viewport với innerWidth, clientWidth, scrollWidth, bodyScrollWidth và DPR. Không yêu cầu mở rộng thêm bộ test ngoài T01–T10 nếu không có rủi ro mới do cách triển khai.

9. Bằng chứng và gói nộp

Nộp design_training_004_submission_r01.zip gồm:

index.html và mọi file cục bộ cần để tái hiện.

DESIGN_TRAINING_004_REPORT.md: cách chạy; bảng trạng thái/sự kiện; ba nguyên tắc; hai đánh đổi thiết kế tương tác; bảng T01–T10; tự phản biện và giới hạn. Không nhúng lại toàn bộ code.

VERIFICATION.json: từng ca ghi tiền điều kiện, hành động, phương thức nhập, expected/actual, state trước/sau, attemptCount/commitCount, dữ liệu nháp/đã lưu liên quan, focus và phán quyết. Đo hình học cho T10 và ba viewport.

screenshots/: đúng sáu ảnh bằng chứng: desktop_initial_1440x900.png; mobile_initial_390x844.png; mobile_validation_390x844.png; mobile_saving_390x844.png; mobile_error_390x844.png; mobile_success_390x844.png. Chụp tại trạng thái thực, không sửa ảnh để tạo kết quả.

Ảnh mobile saving/error/success lấy từ chuỗi Bình + ghi chú hợp lệ. Nếu có script tự động hóa đã dùng, kèm script và cách chạy để dễ tái hiện; không phải xây framework test mới.

Phân biệt tự kiểm của Antigravity với kiểm tra độc lập của Controller. Nếu công cụ không chạy được một ca, ghi NOT_RUN và lý do; không thay bằng PASS suy ra từ mã.

10. Gate nghiệm thu
Gate	Điều kiện
IX01	Dữ liệu chuẩn; bản nháp và bản lưu tách biệt; không đổi trạng thái công việc ngoài đề
IX02	Trạng thái/sự kiện khớp bảng; đúng cơ chế lỗi lần đầu; chặn gửi lặp
IX03	Validation cụ thể; giữ dữ liệu khi lỗi; thử lại thành công; thông báo trung thực
IX04	Bàn phím và focus khép kín; phản hồi tiếp cận được trên mobile
IX05	Responsive ba kích thước, không chuyển động và không phụ thuộc mạng
IX06	Gói tái hiện đầy đủ; mã, ảnh và log thống nhất; nguồn và giới hạn chính xác

PASS khi các gate đạt trong phạm vi trên. Lỗi ảnh hưởng luồng, dữ liệu, focus hoặc khả năng tái hiện là điểm chặn. Nhận xét thẩm mỹ nhỏ hoặc cách diễn đạt không làm sai hành vi được ghi nhận riêng; không dùng để kéo dài vòng sửa.

11. Cách thực hiện và giới hạn vòng sửa

Đọc hai nguồn và viết bảng trạng thái.

Chốt một bố cục, ghi hai đánh đổi; triển khai luồng.

Chạy T01–T10, đo viewport và chụp ảnh.

Tự phản biện rồi nộp gói thực tế, không chỉ báo cáo “hoàn thành”.

Không cần xin duyệt giữa các bước. Sau review, tối đa hai vòng sửa triển khai; nếu vẫn còn điểm chặn thì tổng hợp để Anh quyết định. Không tự tuyên bố MODULE_COMPLETED trước phán quyết Controller.