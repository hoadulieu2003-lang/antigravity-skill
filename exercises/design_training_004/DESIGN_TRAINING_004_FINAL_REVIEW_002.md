DESIGN_TRAINING_004_FINAL_REVIEW_002

Module: 04 — Thiết kế tương tác, trạng thái, phản hồi và phục hồi lỗi

Submission: DESIGN_TRAINING_004_REPAIR_001

Gói nghiệm thu: design_training_004_submission_r02.zip

SHA-256 đã đối chiếu: 409f2fa04a1386b2bccbf3d5976dc01f60f810b41a186e230d49a568f3952a29

VERDICT: PASS

MODULE_COMPLETED: true

Vòng sửa đã sử dụng: 1/2

Không yêu cầu vòng sửa 2/2

1. Phán quyết và phạm vi

Chấp nhận Module 04 trong phạm vi bài tập đã khóa. Vấn đề mất focus trên đường thử lại đã được giải quyết trong mã. Script đã xử lý nguyên nhân T04 bị ảnh hưởng bởi yêu cầu còn chạy của T03, và có bằng chứng mới cho trạng thái chờ của lần thử lại.

Phán quyết dựa trên đối soát mã, log và ảnh, không phải sự xác nhận độc lập rằng mọi khẳng định trong báo cáo đều đúng. Các điểm giới hạn tại mục 4 là một phần của phán quyết này.

Controller đã giải nén, đối chiếu hash, đọc mã ứng dụng, script kiểm thử, báo cáo và log T10; xem trực tiếp ảnh mobile_error, mobile_retry_saving và mobile_success của bản r02. Gói chứa đủ bảy ảnh ở đường dẫn screenshots/ chuẩn. Controller chưa chạy lại trình duyệt độc lập và không nhận kết quả tự kiểm của Antigravity là số đo của mình.

2. Kết quả F01–F03
Finding	Kết quả	Căn cứ
F01 — Focus khi thử lại	Đóng	btn-submit giữ nguyên phần tử qua editing/invalid/saving/error. Chuyển success chỉ đưa focus sang nút sửa nếu trước phản hồi focus đang ở submit.
F02 — Tiền điều kiện và bằng chứng	Đủ để nghiệm thu bài tập, có giới hạn	Helper chờ thoát saving với timeout rồi reset; T10 không còn tự phát change cho select trong chuỗi nhập chính; có đo focus trong lần retry; log và ảnh thể hiện phản hồi nhìn thấy được.
F03 — Khả năng tái hiện	Đủ với dependency được chuẩn bị	Đường HTML và đầu ra dựa trên __dirname; hỗ trợ cổng CDP; ZIP dùng dấu /; báo cáo dùng liên kết tương đối. Script vẫn có fallback cá nhân, xem mục 4.
F01: sửa đúng nguyên nhân

Nút retry không còn bị xóa khi chuyển sang saving. Mã chỉ thay nội dung và thuộc tính khóa của cùng btn-submit; cơ chế chặn sự kiện gửi lặp vẫn tồn tại.

Log T10 ghi nhận:

Lần gửi đầu đang chờ: activeElementDuringFirstSaving = btn-submit.

Sau lỗi: activeElementAfterError = btn-submit.

Lần thử lại đang chờ: activeElementDuringRetrySaving = btn-submit, isButtonConnected = true, buttonAriaDisabled = true.

Sau thành công: activeElementAfterSuccess = btn-edit-assignment.

Ảnh mobile_retry_saving thể hiện nút chờ có focus và thông báo chờ trong tầm nhìn. Ảnh lỗi và thành công cũng thể hiện thông báo cùng hành động tiếp theo. Đây là bằng chứng phù hợp với cách sửa, không phải chứng nhận mọi đường focus có thể có.

F02: tiền điều kiện chính đã sửa

waitForIdleAndReset() chờ state khác saving trước khi reset, rồi kiểm tra editing và hai bộ đếm bằng 0. Việc reset không còn bị gọi ngay trong saving như r01. Quy định khóa reset trong lúc lưu của ứng dụng được giữ nguyên.

T10 có chuỗi nhập chính dùng page.keyboard, đo thêm thời điểm retry saving. Log cho biết các cờ hiển thị lỗi, nút retry, nút sửa và thông báo kết quả đều true. Controller đã đối chiếu thủ công các giá trị này với ảnh, thay vì chỉ dựa vào nhãn PASS của script.

F03: gói đã dễ tái hiện hơn

index.html chạy cục bộ, không cần thư viện ngoài cho ứng dụng. Công cụ kiểm thử cần Node, puppeteer-core được cài để require('puppeteer-core') hoạt động và một Chrome có CDP đang chạy ở cổng được chọn. Đây là điều kiện chạy công cụ, không phải dependency mạng của giao diện.

Các entry ZIP đã ở dạng screenshots/tên.png, không còn tên file chứa dấu backslash khi giải nén trên Linux.

3. IX01–IX06
Gate	Kết luận trong phạm vi thẩm định
IX01 — Dữ liệu, nháp và bản lưu	PASS qua mã; W01 vẫn Chưa bắt đầu
IX02 — Trạng thái và bộ lưu xác định	PASS qua mã và log tự kiểm
IX03 — Validation, phản hồi và phục hồi	PASS qua mã, log và ảnh
IX04 — Focus và bàn phím	PASS cho luồng bài tập, với giới hạn kiểm thử tại mục 4
IX05 — Responsive và không chuyển động	PASS theo bằng chứng đã nộp; không yêu cầu thay bố cục
IX06 — Bàn giao và tái hiện	PASS với điều kiện dependency và các đính chính bên dưới

Bộ đếm ghi chú đã dùng trim().length, đồng nhất với quy tắc validation của đề.

4. Đính chính để tránh học sai từ báo cáo

Các điểm này không mở thêm vòng sửa triển khai. Khi tái sử dụng script/báo cáo, cần mang theo đúng giới hạn sau:

Không phải mọi cờ viewport đều được đưa vào t10Pass. Script có đo feedbackVisibleInViewport ở lỗi và thành công, cùng buttonVisibleInViewport khi retry, nhưng chưa đưa hết các cờ này vào phép kết luận. Các giá trị trong log lần này đều true và ảnh hỗ trợ kết quả, nên Controller có thể đối soát thủ công để nghiệm thu lần nộp này. Không mô tả script là đã tự động bảo đảm đầy đủ các điều kiện đó cho lần chạy tương lai.

Kiểm tra không cướp focus dùng page.focus, không phải Tab. f01NoStealCheck chủ động đặt focus vào banner-notice bằng API rồi quan sát phản hồi lần đầu thất bại. Nó chứng minh giữ một vị trí focus ngoài nút trong trường hợp đó; không chứng minh đường Tab native tới banner, cũng không trực tiếp kiểm thử nhánh thành công khi focus ở ngoài nút. Mã có điều kiện wasFocusedOnSubmit ở cả hai nhánh, nên không phát hiện điểm chặn từ cách triển khai. Tách kiểm tra bổ sung này khỏi nhãn “toàn bộ bằng bàn phím” của chuỗi T10 chính.

Helper reset chưa assert dữ liệu rỗng đầy đủ. Nó đọc các trường nháp/lưu nhưng điều kiện throw hiện chỉ kiểm tra state và bộ đếm. Đường reset trong mã có xóa cả hai bản dữ liệu; không còn nguyên nhân gây nhiễm T03/T04. Không ghi rằng helper đã assert các trường mà nó chỉ thu thập.

Fallback đường dẫn cá nhân vẫn còn. Sau require('puppeteer-core'), catch vẫn thử C:/Users/game/cdp_reader/node_modules/puppeteer-core. Nhánh chính dùng được khi dependency đã cài, nên không chặn mở ứng dụng hoặc chạy trong môi trường đã chuẩn bị. Khi tái dùng công cụ, bỏ fallback cá nhân, báo thiếu dependency rõ ràng và dùng URL file được tạo từ đường dẫn một cách chuẩn để hỗ trợ thư mục có ký tự đặc biệt. Hướng dẫn hiện tại cần được hiểu cùng các tiền điều kiện ở mục 2.

PASS của Controller không nâng các mô tả quá mức này thành sự thật. Đây là nghiệm thu bài tập có kiểm tra thủ công bổ sung, không phải xác nhận script đã trở thành bộ kiểm chuẩn hoàn chỉnh.

5. Bài học được ghi nhận

Tính ổn định của phần tử DOM giúp giữ liên tục tương tác khi trạng thái thay đổi.

Giữ focus và chủ động chuyển focus là hai quyết định khác nhau; chỉ chuyển khi có lý do gắn với phần tử hiện tại.

Bản nháp, dữ liệu của lần gửi và bản đã lưu phải được phân biệt.

Một ca kiểm thử chỉ đáng tin khi bắt đầu đúng tiền điều kiện; chờ theo trạng thái giải quyết vấn đề mà chờ một khoảng ngắn tùy ý không bảo đảm được.

Thu thập một giá trị không đồng nghĩa đã kiểm tra giá trị đó; tên phương thức trong báo cáo phải khớp API thực tế.

Module 04 đã hoàn thành. Antigravity lưu phán quyết này cùng gói r02 và có thể tiếp tục chương trình; không cần nộp lại gói chỉ để đóng module. Những bài học ở đây được ghi nhận ở mức bài tập, chưa tự động thành quy tắc bắt buộc cho mọi sản phẩm.