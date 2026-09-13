DESIGN_TRAINING_005_REVIEW_001

Submission: DESIGN_TRAINING_005_SUBMISSION_R01

Gói: design_training_005_submission_r01.zip

SHA-256 đã đối chiếu: 387c4b6ae94d3ed69106c9924764d4b8804676a3f44b07be4a45da3d76f78846

VERDICT: REPAIR_REQUIRED

MODULE_COMPLETED: false

Vòng sửa được giao: 1/2

Hướng tiếp tục: B

1. Kết luận

Hai hướng A/B khác nhau đủ rõ để đạt V02. Hướng A dùng tiêu đề serif, nền ấm và khung tài liệu; hướng B dùng chữ sans đậm, nhãn mono và cách đóng khung phần mềm. Sự khác biệt không chỉ nằm ở bảng màu. Không cần làm lại A/B hoặc đổi sang hướng A.

Bản cuối B có phân cấp hero rõ, hai CTA phân biệt được và ngôn ngữ thị giác nhất quán giữa các phần. Chưa đạt phần chuyển sang mobile: bảng đối chiếu ưu tiên giữ badge một dòng đến mức tên tài liệu bị chia thành nhiều dòng ngắn, làm giảm khả năng đọc và đối chiếu — chính là nhiệm vụ trọng tâm của brief.

Cần sửa ba nhóm bên dưới. Không yêu cầu thêm hiệu ứng, đổi palette hoặc làm trang nổi bật hơn bằng trang trí.

2. Phạm vi bằng chứng

Controller đã giải nén, đối chiếu hash, đọc contract, báo cáo, JSON, các phần mã/script liên quan và xem đủ sáu ảnh. Đã tính lại riêng sáu cặp màu được báo cáo bằng công thức độ chói sRGB. Controller chưa chạy trình duyệt độc lập. Số đo viewport, hash sau CTA và focus trong JSON vẫn là kết quả tự kiểm của Antigravity.

3. Rubric thị giác đã khóa
Mục	Kết quả	Căn cứ nhìn thấy
Phù hợp brief	Cơ bản đạt; sửa nhãn F02	Tiêu đề và bản mẫu truyền đạt tổ chức bàn giao. Nhãn “CHẾ ĐỘ THỰC THI” bên chấm xanh chưa phản ánh đúng bản mẫu tĩnh.
Khác biệt có chủ đích	Đạt	Serif/nền ấm/khung tài liệu ở A khác sans–mono/nền lạnh/khung công cụ ở B. Signature của B có thể nhận ra, chưa có bằng chứng về tính độc quyền hay khác biệt trên thị trường.
Phân cấp và bố cục	Đạt trên desktop	H1 có trọng lượng cao nhất; CTA chính nổi hơn CTA phụ; bản mẫu bổ trợ thông điệp.
Nhất quán	Cần sửa F02	Ngôn ngữ trang tương đối thống nhất, nhưng contract ghi kích thước chữ và nhãn signature khác bản cuối.
Chuyển sang mobile	Cần sửa F01	Tiêu đề và CTA thích ứng tốt; bảng phần 2 ép tên tài liệu thành các dòng quá ngắn, cột người phụ trách cũng chật.

Ba thẻ phần “Quyết định thiết kế” còn quen thuộc về hình thức nhưng không phải điểm chặn. Không bắt đổi card thành kiểu bố cục khác chỉ vì sở thích reviewer.

4. F01 — Bảng mobile phải phục vụ đọc và đối chiếu
Quan sát và nguyên nhân

Trong final_mobile_fullpage.png, “Yêu cầu sản phẩm” và “Bản mẫu đăng nhập” bị chia gần như từng từ thành nhiều tầng. Mã DOC chiếm thêm chiều ngang trong cột đầu; badge trạng thái không xuống dòng. Hệ quả là nội dung tài liệu chịu phần lớn việc co hẹp.

Trong CSS, .col-doc được gắn trực tiếp lên td và đặt display. Trên desktop, ảnh cho thấy đường phân cách cột đầu không chạy cùng cao độ với các cột còn lại. Đây là dấu hiệu cấu trúc hiển thị ô bảng không còn đồng đều, trái với ý đồ đối chiếu theo hàng của hướng B.

Sửa

Nếu giữ table, duy trì td như ô bảng, đưa bố cục flex vào phần tử con.

Trên mobile, chọn cách biểu diễn ưu tiên đọc tên tài liệu: có thể dùng từng mục với tên ở dòng đầu, người/trạng thái ở dòng sau; hoặc phân bổ lại độ rộng, nhãn và khoảng cách của bảng. Không bắt buộc giữ ba cột ngang trên 390px.

Mã DOC là phần hỗ trợ; không để nó lấy phần lớn chiều rộng cần cho tên tài liệu.

Không giảm font để ép vừa bảng, không cắt tên bằng ellipsis và không ẩn dữ liệu chuẩn.

Nghiệm thu

Ở phần “Một nơi để đối chiếu” tại 390×844, đọc trọn tên của cả ba tài liệu và ghép đúng người/trạng thái mà không phải ráp từng từ trên nhiều dòng hẹp. Không có yêu cầu máy móc tên phải đúng một hoặc hai dòng; đánh giá theo khả năng đọc thực tế. Desktop giữ quan hệ hàng/cột và đường phân cách nhất quán.

Chụp lại ảnh fullpage mobile/desktop và ảnh viewport bị ảnh hưởng. Giữ bảng số đo ba viewport; số đo không tràn ngang là điều kiện kỹ thuật, không thay thế review khả năng đọc.

5. F02 — Đồng bộ ý đồ, contract và bản mẫu tĩnh
Các sai khác cụ thể
Contract/báo cáo	Bản cuối
heading_display: clamp(2rem, 3.5vw, 2.75rem)	h1: clamp(2.25rem, 4vw, 3rem)
body_lead: 1.0625rem	Đoạn dẫn hero: 1.125rem
Signature: MODULE 01: HANDOVER MATRIX / ACTIVE VIEW	Hero: MODULE 01: TRACE SPECIMEN / CHẾ ĐỘ THỰC THI
Khẳng định Inter/SF Mono là font thể hiện	Chỉ khai báo font stack; chưa có bằng chứng font thực tế được render

Điều chỉnh bản cuối so với bản nháp là hợp lệ. Cần ghi rõ sự thay đổi và cập nhật contract theo bản cuối có chủ đích; không ép mã trở lại thông số nháp chỉ để khớp tài liệu.

Thay nhãn “CHẾ ĐỘ THỰC THI” bằng nhãn rõ đây là bản mẫu tĩnh, ví dụ “BẢN MẪU TĨNH”. Chấm xanh có thể bỏ hoặc giữ như dấu trang trí phù hợp, nhưng không mô tả là kết nối đang chạy. Nhãn cuối trang hiện có không thay thế việc diễn đạt trung thực ngay tại bản mẫu.

Contract đang gọi nền tối là vi phạm “Light Theme” và nói chuyển động làm giảm tính chuyên nghiệp. Đề chỉ khóa không chuyển động cho bài này, không ban hành quy luật mọi giao diện nền tối hoặc có motion đều kém chuyên nghiệp. Viết lại thành lựa chọn có điều kiện của TRACE.

Giữ font hệ thống nếu muốn offline. Ghi rõ Inter/SF Mono là ứng viên trong stack, có thể fallback; nếu không đo được font render thì ghi chưa xác minh. Không cần bổ sung font mới để đạt gate.

Lợi ích như quét nhanh, nhận diện tức thì và đáng tin là ý đồ/giả thuyết thiết kế, chưa phải kết quả nghiên cứu người dùng.

6. F03 — Chỉnh phép kiểm và số liệu thay vì ghi sẵn PASS
V06: tên biến không chứng minh khả năng đọc

rowsVisible hiện dựa trên rect.height > 20. Nó chỉ cho biết hàng có chiều cao vượt ngưỡng, không xác nhận hàng nằm trong viewport, không bị cắt hoặc chữ dễ đọc. h1Width/h1Height cũng không tự chứng minh tiêu đề không bị cắt.

Đổi tên và diễn giải số đo theo đúng nghĩa, hoặc bổ sung phép đo cụ thể nếu cần. Để đánh giá khả năng đọc là SELF_REVIEW/PENDING_CONTROLLER có ảnh minh chứng; không tự động suy ra PASS thị giác từ chiều cao hàng.

V07: tỷ lệ tương phản được ghi cứng

verify_module_005.js gán trực tiếp các chuỗi tỷ lệ và boolean đạt chuẩn. Đây không phải kết quả hàm đo tương phản. Controller tính lại từ các cặp màu đã nêu, được:

Chữ	Nền	Tỷ lệ tính lại, làm tròn 2 số
#0F172A	#F8FAFC	17.06:1
#475569	#F8FAFC	7.24:1
#FFFFFF	#0F172A	17.85:1
#065F46	#ECFDF5	7.29:1
#92400E	#FEF3C7	6.37:1
#9A3412	#FFEDD5	6.38:1

Các sai số này chưa cho thấy phải đổi màu. Sửa báo cáo, contract và JSON cho đồng bộ. Dùng hàm tính từ cặp màu hoặc ghi rõ đây là phép tính riêng; không gọi số ghi sẵn là số đo runtime. Nếu tiếp tục tuyên bố mức chuẩn, nêu ngưỡng và loại nội dung áp dụng, không suy ra toàn trang đạt chuẩn từ vài cặp màu.

Báo cáo nói trang hiển thị hoàn hảo trên Chrome, Edge, Safari, Firefox nhưng chỉ có bằng chứng CDP. Giới hạn kết luận về môi trường đã kiểm thử; không cần mở thêm một chiến dịch kiểm thử đa trình duyệt.

Hướng dẫn chạy script cần nêu dependency puppeteer-core. Ưu tiên dependency thông thường, không phụ thuộc fallback ../../../cdp_reader trên máy tác giả. Không cần đóng gói node_modules.

7. Tình trạng V01–V08
Ca	Kết luận vòng 1
V01	Nội dung chính và ba dòng dữ liệu quan sát được phù hợp; sửa nhãn bản mẫu ở F02
V02	ĐẠT — không yêu cầu làm lại A/B
V03	CẦN SỬA — đồng bộ contract với bản cuối
V04	Không có điểm chặn từ mã/log đã đối chiếu; chưa chạy lại runtime
V05	Không có điểm chặn từ log; chưa chạy lại bàn phím độc lập
V06	CẦN SỬA — đọc bảng mobile và cách diễn giải số đo
V07	CẦN SỬA BẰNG CHỨNG — số liệu tương phản không đúng như báo cáo
V08	Mã không cho thấy nhu cầu thêm hiệu ứng; bổ sung điều kiện chạy công cụ
8. Gói sửa vòng 1/2

Nộp design_training_005_submission_r02.zip với index.html, directions/, contract, báo cáo, VERIFICATION.json, script nếu sử dụng và screenshots/.

Giữ bản nháp A/B; được kế thừa hai ảnh nháp và ghi rõ nguồn gốc.

Chụp lại bốn ảnh bản cuối sau sửa.

Chạy lại các kiểm tra liên quan nội dung/contract, responsive, ngữ nghĩa/số liệu; kiểm tra nhanh hai CTA và bàn phím nếu thay cấu trúc DOM.

Báo cáo ánh xạ F01–F03 tới thay đổi và bằng chứng, không nhúng lại toàn bộ mã.

Contract vẫn PROPOSED cho đến khi bản cuối được nghiệm thu.

Điều kiện đóng module: bảng mobile đọc được và đối chiếu rõ; contract phản ánh đúng bản cuối; bản mẫu tĩnh được diễn đạt trung thực; số liệu và nhãn kiểm chứng đúng phương pháp. Không thêm tiêu chí thẩm mỹ mới ở vòng tiếp theo.

Sau tối đa hai vòng sửa, nếu còn điểm chặn thì tổng hợp để Anh quyết định. Đây là sửa có phạm vi, không yêu cầu làm lại toàn bộ art direction.