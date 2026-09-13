DESIGN_TRAINING_006_REVIEW_001

Submission: DESIGN_TRAINING_006_SUBMISSION_R01

VERDICT: REPAIR_REQUIRED

MODULE_COMPLETED: false

Vòng sửa được giao: 1/2

Phạm vi: sửa độ chính xác của phản biện, phép kiểm và bài học; có thể giữ nguyên candidate.

1. Kết luận của Controller

Candidate thể hiện một lựa chọn nhóm nội dung hợp lý: ba quyết định nằm trong một khung chung, phân cách bằng đường kẻ; trên mobile chúng xếp dọc và vẫn đọc được. Tuy nhiên, mục tiêu Module 06 là phản biện dựa trên bằng chứng. Báo cáo hiện mô tả sai baseline, gọi candidate là cấu trúc mở dù vẫn có khung bao ngoài, và kết luận về sự mỏi mắt vượt quá bằng chứng đang có. Script cũng chưa đủ để chứng minh toàn bộ Q05.

Chưa công nhận hoàn tất Module 06. Đây không phải yêu cầu thiết kế lại theo gu của Controller. Anti có thể giữ ADOPT nếu sửa lập luận đúng với sản phẩm và bổ sung kiểm chứng đã được yêu cầu trong đề bài. KEEP_BASELINE hoặc INCONCLUSIVE cũng hợp lệ nếu có căn cứ.

2. Phạm vi đối soát và những điểm đã đạt

Controller đã đọc báo cáo, directive, mã nguồn baseline/candidate, script và JSON; đối chiếu bốn ảnh fullpage desktop/mobile và nguồn M05 r02. Controller chưa chạy độc lập các thao tác trong trình duyệt. Log CDP là bằng chứng tự kiểm của Antigravity.

SHA-256 gói M06 khớp: 08ea2b45fdd6b36e19702ac6fe807f44be93fed98839054c310bf738ff55adfb.

baseline/index.html khớp từng byte với index của M05 r02.

Contract baseline có cập nhật trạng thái ACCEPTED_FOR_EXERCISE và tham chiếu phán quyết. Đây là cập nhật metadata đã được cho phép; không phải sửa trái phép thiết kế. Báo cáo cần phân biệt nó với mã HTML nguyên bản.

Diff thiết kế tập trung tại Section 03, phù hợp một giả thuyết và tối đa hai nhóm thay đổi liên quan. Thay đổi title để nhận diện candidate là metadata thử nghiệm.

C01 giữ bảng mobile và C03 giữ mẫu vật hero là các quyết định bảo tồn có lý do.

Bộ ảnh hỗ trợ so sánh hai phương án. Chưa thấy hồi quy khả năng đọc ở Section 03 qua ảnh được nộp.

3. F01 — Sửa mô tả thực tế và mức độ chắc chắn của kết luận

Gates liên quan: Q02, Q04, Q06. Blocking.

Báo cáo hiện tại	Đối chiếu mã nguồn	Yêu cầu sửa
Decision cards baseline có bóng đổ riêng, viền kép	.decision-card có nền trắng, một border và radius; không có box-shadow riêng	Bỏ nhận định về bóng đổ/viền kép của các card này
Candidate là ba cột mở, loại bỏ hộp	.decisions-grid có nền trắng, border, radius và thêm box-shadow; các card có divider bên trong	Mô tả đúng: hợp nhất ba hộp riêng thành một khung nhóm chung
Nhãn baseline chỉ là 01., 02., 03.	Baseline đã có [01 // TYPOGRAPHY], [02 // BỐ CỤC], [03 // HÌNH ẢNH]	Thay đổi nằm ở nền, viền, padding và cách trình bày nhãn, không phải nội dung nhãn
Breakpoint là 860px	CSS sử dụng max-width: 900px	Đồng bộ thông số
--space-md đảm bảo 32px	Token là 1.5rem; ở root 16px là 24px	Ghi đúng token; nếu nói khoảng cách giữa nội dung hai cột, đo riêng khoảng cách đó

Các sửa bắt buộc về lập luận:

Đổi “giải quyết triệt để sự mỏi mắt”, “mắt người dùng lướt tự nhiên” và “không có bất kỳ đánh đổi tiêu cực nào” thành nhận xét thị giác có phạm vi. Chưa có dữ liệu người dùng để kết luận giảm mỏi mắt hoặc đọc nhanh hơn.

Phân biệt mức chắc chắn: cao đối với sự tồn tại của border/nhãn; có giới hạn đối với đánh giá nhóm nội dung; chưa kiểm chứng đối với tác động nhận thức của người dùng.

Ghi đúng đánh đổi mới: khung chung tăng tính nhóm, giảm độ tách biệt từng quyết định; nhãn được đóng khung và bóng đổ chung vẫn tạo trọng lượng thị giác. Không mô tả chi phí đã biến mất hoàn toàn.

Có thể kết luận: “ADOPT cho bài tập vì reviewer đánh giá cách nhóm chung phù hợp hướng B và ảnh chưa cho thấy suy giảm khả năng đọc; tác động lên tốc độ đọc và cảm giác mỏi mắt chưa được kiểm chứng.” Đây là ví dụ về mức độ khẳng định, không phải câu bắt buộc sao chép.

C04: bỏ con số 14.8:1 không có cặp màu và phép tính tương ứng. Không cần mở lại audit màu của M05 cho thay đổi này.

C05: mô tả đáp ứng ràng buộc không chuyển động của bài tập. Bỏ cam kết không chóng mặt, giảm GPU hoặc hiệu năng tức thì nếu không có phép đo. Zero Motion không phải quy tắc cho toàn bộ lộ trình có các module motion sau này.

Giữ candidate hiện tại là được. Chỉ sửa giao diện nếu Anti tự quyết định rằng giả thuyết cần một phương án khác; không bắt buộc thêm thử nghiệm thứ hai.

4. F02 — Sửa điều kiện PASS và bổ sung bằng chứng hồi quy đúng phạm vi

Gates liên quan: Q01, Q05. Blocking đối với chất lượng kiểm chứng.

4.1. Phép kiểm nguồn baseline

Script hiện dùng:

baselineExists && (m05ZipHash === expectedHash || m05ZipHash !== '')

Điều kiện này vẫn PASS khi có một hash không rỗng nhưng sai. Controller đã xác nhận nguồn thật đúng trong lần nộp này; lỗi nằm ở phép kiểm, không phải kết luận baseline bị giả mạo.

Yêu cầu:

So sánh hash bằng phép bằng chính xác, bỏ nhánh chấp nhận mọi hash không rỗng.

Đối chiếu baseline/index.html với entry tương ứng của nguồn M05 đã xác minh; hash ZIP nguồn đơn thuần không chứng minh file baseline được sao chép đúng.

Cho phép truyền đường dẫn ZIP nguồn hoặc ghi rõ tiền điều kiện. Nếu thiếu nguồn, ghi NOT_RUN/thiếu bằng chứng, không tự PASS.

Ghi riêng hai thay đổi metadata contract đã được phép; không đòi contract phải byte-identical với bản PROPOSED cũ.

4.2. Phép kiểm hồi quy

Script hiện kiểm sự tồn tại hai CTA, tìm chuỗi trên toàn trang và đo style H1; các phép này không tương đương kiểm hành vi CTA, quan hệ từng hàng dữ liệu hay toàn bộ Zero Motion. Log cũng thiếu viewport 768px theo Q05 đã khóa.

Bổ sung vừa đủ trên candidate cuối:

Đo không tràn ngang ở 1440×900, 768×1024 và 390×844. Lưu clientWidth, scrollWidth và điều kiện assert cho từng viewport.

Xác nhận đúng ba bộ tài liệu/người phụ trách/trạng thái theo từng hàng, giữ nhãn BẢN MẪU TĨNH và nội dung chính. Có thể kết hợp đối chiếu cấu trúc với diff; không chỉ tìm các tên rời rạc trong bodyText.

Kiểm hai CTA bằng click và bằng bàn phím Tab/Enter; ghi phần tử đang focus, hash hoặc đích thực tế sau kích hoạt, và bằng chứng đích được đưa vào tầm nhìn. Không cần đổi cơ chế focus đã được chấp nhận ở M05 chỉ để đáp ứng review này.

Xác nhận không có motion bằng kiểm tra mã thay đổi và các phần tử/liên kết liên quan. Nếu đo computed style, ghi rõ phạm vi; không suy từ H1 ra toàn trang.

Tính verdict từ các assert. Các mục đánh giá thị giác Q02/Q06 phải tiếp tục chờ Controller; khai báo điều kiện chụp hoặc nhận xét thủ công không được trình bày như kết quả assert tự động.

Không cần viết lại cả bộ test M05 hoặc chạy kiểm thử rộng ngoài các invariants đã khóa.

5. F03 — Giới hạn bài học theo đúng bằng chứng

Gate liên quan: Q07. Blocking.

Giữ ba bài học nhưng chỉnh phạm vi:

Bài học 1: bằng chứng hiện hỗ trợ thử nhóm ba quyết định trong một khung chung của TRACE. Nó chưa chứng minh quy luật “từ hai card trở lên phải luân phiên cấu trúc mở”. Các phần tử có tương tác độc lập cũng không bắt buộc phải có viền hộp kín. Đổi thành phương án có điều kiện và nêu ngoại lệ theo nhiệm vụ.

Bài học 2: bảng ba trường của bài tập đọc được với hai tầng trên mobile. Không khẳng định cứ từ năm cột là bắt buộc cuộn ngang và cố định cột đầu. Lựa chọn phụ thuộc nhu cầu so sánh, độ dài dữ liệu và bề rộng thực tế.

Bài học 3: bốn loại phản biện là quy ước hữu ích đã áp dụng trong bài tập/nhóm này. Không suy từ năm nhận xét thành bằng chứng về “đa phần tranh cãi thiết kế” hoặc một quy tắc bắt buộc cho mọi phiên review.

Mỗi bài học tiếp tục có Observation, Rule candidate, Applies when, Exception, Evidence và EXERCISE_SUPPORTED. Nhãn này không thay thế việc viết nội dung có giới hạn.

6. Trạng thái gates
Gate	Kết luận Controller
Q01	Nguồn thực tế xác nhận đúng; sửa script chứng minh nguồn theo F02
Q02	REPAIR — mô tả baseline và phân biệt quan sát/suy luận
Q03	PASS — phạm vi thay đổi phù hợp
Q04	Bộ ảnh đủ để so sánh; sửa diễn giải trước/sau theo F01
Q05	REPAIR — thiếu 768px và bằng chứng hành vi/điều kiện assert
Q06	REPAIR — ADOPT có thể giữ, nhưng lập luận phải đúng mức bằng chứng
Q07	REPAIR — thu hẹp các quy tắc tuyệt đối

Không chấm điểm tổng giả chính xác khi gates bằng chứng còn thiếu.

7. Gói nộp lại — Vòng sửa 1/2

Tên gói: design_training_006_submission_r02.zip.

Bao gồm baseline, candidate, báo cáo Rev 002, VERIFICATION.json, script đã sửa và ảnh minh chứng liên quan. Thêm bảng F01–F03 → thay đổi → bằng chứng.

Nếu không đổi giao diện, được dùng lại bốn ảnh hiện tại và ghi rõ nguồn r01; chỉ bổ sung log hoặc ảnh cần thiết cho phần kiểm mới. Không ghi ảnh cũ là ảnh chụp mới.

Baseline phải tiếp tục giữ nguyên; sửa script/báo cáo không được làm thay đổi nguồn so sánh. Nêu riêng bằng chứng Anti tự chạy và kết quả Controller đã kiểm tra, không gán runtime độc lập cho Controller.

Điều kiện vòng sau: mô tả khớp mã và ảnh; nhận xét không vượt bằng chứng; Q05 đủ phép kiểm đã khóa; ba bài học có phạm vi. Khi đạt, có thể PASS Module 06 mà không cần tăng mức hiệu ứng hay thay đổi gu thiết kế.