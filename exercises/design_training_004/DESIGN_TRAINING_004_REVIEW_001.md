DESIGN_TRAINING_004_REVIEW_001

Submission: DESIGN_TRAINING_004_SUBMISSION_R01

Gói: design_training_004_submission_r01.zip

SHA-256 đã đối chiếu: 6546171d8688c7e79f9f07615237cb333e77f5af88d909a656642b4612fb4909

VERDICT: REPAIR_REQUIRED

MODULE_COMPLETED: false

Chỉ thị sửa: vòng 1/2

1. Kết luận

Mã thể hiện đúng nền tảng của bài: tách nháp/lưu, chụp dữ liệu lần gửi, lỗi lần đầu, thử lại, validation và chặn gửi lặp. Sáu ảnh cho thấy phản hồi trạng thái rõ ràng và đường hành động phù hợp trên mobile. Giữ bố cục hiện tại.

Chưa chấp nhận tuyên bố 10/10 PASS làm căn cứ đóng module: còn một khoảng mất focus ở đường thử lại và script kiểm thử chưa xác lập đúng một số tiền điều kiện. Cần sửa ba nhóm bên dưới, không mở rộng bài tập.

Controller đã giải nén, kiểm tra hash, đọc mã ứng dụng, script, JSON, báo cáo và xem cả sáu ảnh. Controller chưa chạy runtime trình duyệt độc lập. Các nhận xét hành vi dưới đây dựa trên đường thực thi trong mã; số liệu JSON là tự kiểm của Antigravity, không phải số đo độc lập của Controller.

2. Đối chiếu gate
Gate	Kết quả vòng này
IX01 — Dữ liệu và nháp/lưu	Phù hợp qua mã; trạng thái công việc không bị đổi khi giao
IX02 — FSM và bộ lưu	Cơ chế chính phù hợp; cần khôi phục độ tin cậy của bằng chứng qua F02
IX03 — Validation và phục hồi	Thông báo, lỗi trường, giữ nháp phù hợp qua mã/ảnh; thử lại cần F01
IX04 — Bàn phím và focus	Chưa đạt: F01; bằng chứng T10 cần F02
IX05 — Responsive và không chuyển động	Không có điểm chặn từ ảnh/mã đã xem; số đo ba viewport là tự kiểm
IX06 — Tái hiện và bằng chứng	Chưa đạt: F02, F03
3. F01 — Giữ focus trong toàn bộ lần thử lại
Phát hiện

Ở trạng thái error, focus nằm trên btn-retry. Khi kích hoạt nút này, handleRetry() gọi submitAssignment(), chuyển sang saving và renderState() thay toàn bộ formFeedback.innerHTML bằng thông báo chờ. Nút btn-retry đang focus bị xóa. btn-submit được hiện lại nhưng không được nhận focus.

Việc giữ btn-submit trong DOM chỉ bảo vệ đường gửi đầu tiên; chưa bảo vệ đường error → saving. Focus chỉ được đặt lại vào btn-edit-assignment sau phản hồi thành công. Vì thế đoạn chờ 1.200ms của lần thử lại chưa đáp ứng yêu cầu không làm mất focus khi thay phần tử đang giữ focus.

Sửa bắt buộc

Chọn một cách đơn giản:

Giữ một nút hành động ổn định qua các trạng thái, đổi nhãn và trạng thái khóa; hoặc

Chuyển focus có chủ đích sang nút/phần tử ổn định, còn hiển thị, khi nút retry bị thay thế.

Giữ cơ chế chặn gửi lặp trong JavaScript. Không cần modal hay animation.

Khi phản hồi bất đồng bộ về, chỉ chuyển focus nếu phần tử đang giữ focus thực sự bị ẩn/xóa hoặc cần xử lý theo hợp đồng đã giải thích. Nếu người dùng đã Tab sang phần tử ổn định khác trong lúc chờ, không kéo focus trở lại nút hành động một cách vô điều kiện.

Bằng chứng đóng F01

Trong T05/T10, đo activeElement thực tế ngay sau khi kích hoạt retry, trong saving và sau success. Ghi ID, tagName, trạng thái còn gắn vào DOM và vị trí hiển thị. Xác nhận focus không rơi về body trong đoạn chờ. Kiểm tra ngắn trường hợp người dùng đã Tab khỏi nút trong lúc chờ để xác nhận không bị cướp focus khi phản hồi về.

4. F02 — Kiểm thử đúng tiền điều kiện và đúng phương thức tương tác
4.1. T03 để lại saving nhưng T04 reset ngay

T03 kết thúc ở saving, attemptCount=1. Sau đó resetSimulation() chỉ gọi nút reset và chờ 100ms. Ứng dụng chủ động vô hiệu hóa reset trong saving, nên thao tác này không bảo đảm đặt lại. T04 tiếp tục gán giá trị trường và phát DOM event dù trường đang bị khóa.

Do đó T04 có thể quan sát yêu cầu đang chạy từ T03 thay vì tạo yêu cầu mới của chính T04. Kết quả cuối giống mong đợi không đủ chứng minh tiền điều kiện đúng.

Sửa: Chờ trạng thái hết saving bằng điều kiện có timeout, rồi đặt lại và assert editing, hai bộ đếm bằng 0, nháp/lưu rỗng trước ca độc lập. Có thể tải lại trang cho ca độc lập nếu ghi rõ. Giữ T05 tiếp nối T04 đúng đề. Không sửa ứng dụng để cho reset hoạt động trong saving nhằm chiều theo script.

4.2. T10 bỏ qua thời điểm quan trọng và có hỗ trợ DOM

Script hiện bấm retry rồi chờ 1.500ms trước lần đo tiếp theo; không quan sát saving của lần thử lại. Biến activeElement ở bước gửi đầu được lấy trước Enter, không phải sau sự kiện. Điều kiện t10Pass không kiểm tra đầy đủ các cờ focus/viewport đã ghi trong log.

Ngoài ra, script tự dispatch sự kiện change cho select, và dùng page.focus để nhảy đến nút submit. Không được dùng kết quả này làm bằng chứng rằng toàn bộ đường điều hướng đã được hoàn thành chỉ bằng bàn phím.

Sửa: Sau bước chuẩn bị/tải trang, chạy đường tương tác T10 bằng Tab, Shift+Tab, phím mũi tên, Enter/Space và nhập văn bản. Không tự phát change để bù cho hành vi chọn. Ghi cách xác nhận lựa chọn native select phù hợp môi trường. Dùng số bước hoặc timeout hữu hạn cho vòng tìm focus; không để while Tab vô hạn.

Đo activeElement sau sự kiện và tại cả hai lần saving. Đo rect của thông báo và hành động kế tiếp tại trạng thái liên quan, không chỉ kiểm tra nút cuối. Đưa các điều kiện trọng yếu đó vào phép xác định PASS; có số đo nhưng bỏ qua trong verdict là chưa đủ.

4.3. Phân biệt click lập trình và click con trỏ

Nhiều ca dùng element.click() bên trong page.evaluate nhưng báo cáo ghi Pointer Click. Đây là kích hoạt DOM bằng mã, không phải thao tác con trỏ qua Puppeteer.

Sửa: Đổi nhãn phương thức cho đúng ở các ca cho phép kích hoạt lập trình. Riêng T06 dùng click qua page.click hoặc phím thực tế để kích hoạt thêm hai lần trong saving, theo đề; không thay bằng gọi trực tiếp hàm lưu. Ghi attemptCount trước/sau và kết quả cuối. Không cần biến mọi ca thành kiểm thử con trỏ nếu đề không yêu cầu.

Bằng chứng đóng F02

Chạy lại T01–T10 bằng script đã sửa vì lỗi tiền điều kiện có thể ảnh hưởng chuỗi ca hiện tại. Log mới phải phân biệt dữ liệu đo và giá trị mong đợi, phương thức tự động hóa và tự kiểm của Executor. Không kế thừa nhãn PASS cho ca chưa chạy lại.

5. F03 — Gói tái hiện dùng được ngoài máy tác giả

Script require Puppeteer từ C:/Users/game/cdp_reader/node_modules và cố định đường HTML/đầu ra trong thư mục cá nhân. Lệnh node verify_module_004.js trong báo cáo chưa đủ để người nhận chạy lại gói.

Sửa:

Resolve index.html và đầu ra từ thư mục script hoặc tham số; nạp puppeteer-core theo dependency thông thường và ghi cách chuẩn bị dependency.

Cho phép cấu hình địa chỉ CDP, mô tả điều kiện có trình duyệt sẵn và chỉ thao tác tab kiểm thử do script tạo. Không cần tự động cài hay mở trình duyệt của người khác.

Dùng liên kết tương đối trong báo cáo thay các liên kết file:/// trỏ máy cá nhân. Phân biệt ứng dụng offline với dependency của công cụ kiểm thử.

Tạo thư mục đầu ra nếu chưa tồn tại.

Đóng ZIP với đường dẫn screenshots/tên.png. Gói hiện có các tên entry dùng dấu backslash; khi giải nén trên Linux, ảnh thành tên file chứa dấu backslash thay vì nằm trong thư mục screenshots. Controller vẫn đọc được đủ ảnh nên không coi là thiếu ảnh, nhưng cần chuẩn hóa để tái hiện nhất quán.

Không yêu cầu đóng gói node_modules hay framework kiểm thử mới.

6. Ghi chú không chặn nghiệm thu

Bộ đếm ghi chú dùng độ dài chuỗi thô trong khi validation dùng độ dài sau trim. Với khoảng trắng ở đầu/cuối, người dùng có thể thấy bộ đếm báo đỏ dù dữ liệu hợp lệ. Nên đồng nhất bộ đếm theo quy ước bài hoặc giải thích rõ; đây là chỉnh nhỏ cùng lần sửa, không mở thêm gate.

Giữ nhận định tương phản gắn với cặp màu cụ thể nếu đưa số đo. Không dùng một tỷ lệ để khẳng định toàn bộ giao diện đều có cùng tương phản. Không yêu cầu nghiên cứu thêm nguồn hoặc thay palette.

7. Bàn giao vòng sửa 1/2

Nộp design_training_004_submission_r02.zip gồm:

Mã nguồn đã sửa focus.

Script kiểm thử có cấu hình đường dẫn, tiền điều kiện rõ, chờ theo trạng thái và giới hạn vòng lặp.

VERIFICATION.json mới từ lần chạy đã sửa.

Báo cáo Rev 002 có bảng xử lý F01–F03, cách chạy thực tế và giới hạn kiểm chứng.

Sáu ảnh theo đề; chụp lại các trạng thái bị ảnh hưởng. Ảnh không đổi được kế thừa nếu ghi rõ nguồn gốc. Bổ sung một ảnh mobile_retry_saving_390x844.png để thể hiện focus trong đoạn chờ vừa sửa.

Điều kiện PASS vòng tới: focus ổn định qua thử lại; T01–T10 được chạy với tiền điều kiện đúng và kết luận phản ánh phép kiểm tra; gói tái hiện không phụ thuộc đường dẫn cá nhân. Không thêm tiêu chí thẩm mỹ mới.

Module 04 chưa đóng. Đây là vòng sửa 1/2, không phải yêu cầu làm lại bài từ đầu.