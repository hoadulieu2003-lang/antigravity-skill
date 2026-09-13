# DESIGN_TRAINING_003 — Kiến trúc thông tin và khả năng tìm lại

```yaml
module: DESIGN_TRAINING_003
previous_module: DESIGN_TRAINING_002
previous_module_status: COMPLETED
status: AUTHORIZED
executor: Antigravity
reviewer: ChatGPT
owner: Anh
focus: INFORMATION_ARCHITECTURE_AND_FINDABILITY
agent_count: 1
max_implementation_repair_rounds: 2
next_action: EXECUTE_AND_SUBMIT
```

## 1. Mục tiêu

Module 02 trả lời “Nhìn việc nào trước?”. Module 03 trả lời “Thông tin nằm ở đâu và tìm lại bằng cách nào?”. Thiết kế một thư viện tài liệu dự án giả lập, giúp người dùng tìm đúng tài liệu theo mục đích, trạng thái và tên gọi mà không phải nhớ đường dẫn nội bộ.

Bài học trọng tâm: phân biệt danh tính tài liệu, nhóm nội dung, thuộc tính lọc và trạng thái; không biến tất cả thành menu hoặc thư mục. Có thể tái sử dụng token và kỹ thuật đã học, nhưng làm trong thư mục bài tập mới, không sửa hai module đã nghiệm thu.

## 2. Phạm vi

Trang đơn “Tài liệu dự án”, chỉ một dự án giả lập: **Dự án Mẫu**. Không đăng nhập, phân quyền, upload, chỉnh sửa tài liệu, backend, kết nối Drive hoặc gửi thông tin ra ngoài.

Tạo đúng một bản triển khai. Trước khi code, so sánh hai cách tổ chức thông tin trong báo cáo, chọn một và giải thích. Không cần code hai bản rồi tự tạo thêm vòng review.

Dùng HTML/CSS/JS hoặc nền tảng đơn giản sẵn có. Không có yêu cầu cài thêm thư viện. Một agent là mặc định.

## 3. Dữ liệu cố định

Giữ đúng ID, tiêu đề, loại và trạng thái ở bảng sau. Một ID biểu diễn một tài liệu; xuất hiện trong kết quả tìm kiếm hay nhóm khác vẫn là cùng tài liệu. Các nhóm điều hướng do Anti đề xuất, không phải dữ liệu gốc phải tự thêm vào bảng.

| ID | Tiêu đề | Loại | Trạng thái | Tóm tắt |
| --- | --- | --- | --- | --- |
| D01 | Yêu cầu sản phẩm | Đặc tả | Hiện hành | Mục tiêu, phạm vi và điều kiện nghiệm thu sản phẩm. |
| D02 | Luồng tạo tài khoản | Đặc tả | Hiện hành | Các bước đăng ký tài khoản và xác nhận thông tin. |
| D03 | Quy chuẩn màu và chữ | Thiết kế | Hiện hành | Màu, kiểu chữ và nguyên tắc trình bày giao diện. |
| D04 | Bản mẫu màn hình đăng nhập | Thiết kế | Đang soạn | Bản mẫu giao diện đăng nhập chưa được chốt. |
| D05 | Kịch bản kiểm thử đăng nhập | Kiểm thử | Hiện hành | Các tình huống kiểm tra đăng nhập và kết quả mong đợi. |
| D06 | Báo cáo kiểm thử đăng nhập | Kiểm thử | Hiện hành | Kết quả chạy các tình huống đăng nhập và lỗi đã ghi nhận. |
| D07 | Hướng dẫn sử dụng | Hướng dẫn | Hiện hành | Chỉ dẫn thao tác dành cho người sử dụng sản phẩm. |
| D08 | Hướng dẫn triển khai | Hướng dẫn | Hiện hành | Các bước chuẩn bị môi trường và triển khai bản bàn giao. |
| D09 | Biên bản bàn giao | Biên bản | Đang soạn | Danh sách hạng mục và xác nhận bàn giao đang chuẩn bị. |
| D10 | Biên bản họp khởi động | Biên bản | Hiện hành | Mục tiêu và thống nhất ban đầu của dự án. |
| D11 | Yêu cầu sản phẩm bản cũ | Đặc tả | Lưu trữ | Bản yêu cầu trước đây, không dùng làm căn cứ hiện hành. |
| D12 | Bản mẫu màn hình đăng nhập bản cũ | Thiết kế | Lưu trữ | Bản mẫu trước đây, được giữ để tham khảo lịch sử. |

Dữ liệu hoàn toàn giả lập. Không tự thêm khách hàng, người phê duyệt, ngày cập nhật hoặc mức độ ưu tiên. Không suy rằng hai tài liệu cùng loại thì có cùng mục đích.

## 4. Quyết định kiến trúc phải giải thích trước khi code

Trong DESIGN_TRAINING_003_REPORT.md, ghi ngắn:

1. Hai phương án tổ chức, ví dụ theo loại tài liệu hoặc theo công việc người dùng muốn làm. Không bắt buộc dùng hai ví dụ này.
2. Phương án chọn và hai đánh đổi. Nhãn nhóm phải dễ hiểu với người mới vào dự án.
3. Bảng nhóm → ID tài liệu, cho thấy đủ 12 ID, không mất tài liệu. Nếu một tài liệu được truy cập từ nhiều nhóm, giải thích cơ chế dùng chung ID.
4. Các thuộc tính nào là điều hướng, thuộc tính nào là bộ lọc, trạng thái nào là mặc định. Không biến mọi kết hợp loại × trạng thái thành thư mục riêng.

Giới hạn để giữ bài nhỏ: tối đa bốn nhóm điều hướng chính, ngoài “Tất cả”; không quá một cấp nhóm trong giao diện. Tối đa hai bộ lọc thuộc tính ngoài ô tìm kiếm. Đây là giới hạn bài tập, không phải quy luật thiết kế phổ quát.

## 5. Hành vi đã khóa

### Danh sách và tìm kiếm

- Mặc định hiển thị D01–D10, không gồm tài liệu lưu trữ. Có cách rõ ràng để đưa D11–D12 vào kết quả.
- Tìm kiếm trên tiêu đề và tóm tắt; không phân biệt chữ hoa/thường và có dấu/không dấu tiếng Việt. “dang nhap” phải tìm được các tài liệu có “đăng nhập”. Xử lý cả chữ đ/Đ và khoảng trắng thừa.
- Nhóm đang chọn, từ khóa và bộ lọc phải cùng có hiệu lực theo phép giao. Không tự bỏ một điều kiện khi người dùng thêm điều kiện khác.
- Hiển thị điều kiện đang áp dụng và số kết quả. Có hành động “Xóa điều kiện” đưa về Tất cả, từ khóa rỗng, bỏ các lọc khác và mặc định không gồm lưu trữ.
- Không kết quả: giữ nguyên điều kiện, nói rõ không có tài liệu khớp và cho phép xóa điều kiện. Không âm thầm trả toàn bộ tài liệu.

### Chi tiết và quay lại

- Chọn kết quả mở chi tiết có đúng ID, tiêu đề, loại, trạng thái và tóm tắt từ bảng.
- Lưu trữ phải có nhãn chữ dễ nhận biết trong danh sách và chi tiết; không trình bày như bản hiện hành.
- Quay lại kết quả giữ nguyên từ khóa/nhóm/bộ lọc, số kết quả và vị trí cuộn hợp lý; focus trở về tài liệu đã mở hoặc điều khiển tương đương nhìn thấy được.
- Không cần nội dung tài liệu dài, tải file hoặc giả lập trình soạn thảo. Panel, vùng riêng trên trang hoặc dialog đều được nếu quản lý bàn phím rõ ràng.

## 6. Bốn tình huống tìm thông tin

Anti tự thử các tình huống sau và giải thích người dùng sẽ bắt đầu ở đâu. Đây là tự kiểm theo kịch bản, không gọi là nghiên cứu người dùng.

| Tình huống | Kết quả đúng |
| --- | --- |
| Tôi cần biết phải kiểm tra đăng nhập như thế nào | D05; phân biệt được với D06 là báo cáo kết quả |
| Tôi cần hướng dẫn đưa bản bàn giao lên môi trường chạy | D08; không nhầm D07 |
| Tôi cần xem yêu cầu sản phẩm đang dùng | D01; không nhầm D11 |
| Tôi cần tìm lại bản mẫu đăng nhập trước đây | D12; tìm được qua cách đưa lưu trữ vào kết quả |

Không áp mục tiêu số giây hoặc số click chưa được nghiên cứu. Đánh giá đường đi hợp lý, nhãn có nghĩa và kết quả đúng.

## 7. Các ca kiểm tra xác định

| ID | Thiết lập và thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| T01 | Mở mới, Tất cả, không từ khóa/lọc khác | Đúng 10 tài liệu D01–D10 |
| T02 | Tất cả, mặc định không lưu trữ, nhập “  DANG NHAP  ” | Đúng D04, D05, D06 |
| T03 | Giữ từ khóa T02, đưa lưu trữ vào cùng kết quả | Đúng D04, D05, D06, D12 |
| T04 | Không lưu trữ, chọn một nhóm chứa D05; tìm “kịch bản” | D05; chứng minh nhóm và từ khóa cùng có hiệu lực |
| T05 | Tất cả, tìm “không có tài liệu xyz” | 0 kết quả, có cách xóa điều kiện |
| T06 | Từ T05 bấm “Xóa điều kiện” | Trở lại đúng trạng thái T01 |
| T07 | Từ T02 mở D05 rồi quay lại | Giữ điều kiện T02, đúng ba kết quả; focus quay về kết quả D05 hoặc điều khiển tương đương rõ ràng |
| T08 | Bật lưu trữ và tìm “bản cũ”, mở D12 | Kết quả D11/D12; chi tiết D12 có nhãn Lưu trữ |

Nếu chọn bộ lọc thứ hai, thêm đúng một ca chứng minh nó kết hợp với tìm kiếm, không cần kiểm mọi tổ hợp có thể.

## 8. Ràng buộc hình thức và tiếp cận

- Kế thừa hệ chữ/màu/khoảng cách đã có, không cần tạo thương hiệu mới.
- Không chuyển động: không animation, CSS transition, cuộn mượt hoặc hiệu ứng phóng nút. Cuộn và đổi trạng thái tức thì.
- Desktop 1440×900, mobile 390×844; kiểm tra nhanh 768px. Nội dung danh sách được phép cuộn.
- Tìm kiếm, nhãn nhóm và cách tiếp cận bộ lọc phải rõ từ màn hình đầu. Không buộc hiện cả 12 tài liệu ngay.
- Bàn phím thực hiện được tìm kiếm, đổi điều kiện, mở/đóng chi tiết và quay lại. Không để focus nằm trong nội dung bị ẩn hoặc bị header che.
- Nhãn loại/trạng thái dùng chữ, không chỉ màu. Không yêu cầu chứng nhận WCAG toàn diện cho bài tập.

## 9. Nghiên cứu có giới hạn

Tối đa hai nguồn gốc, có thể tái sử dụng nguồn đã đọc nếu phù hợp. Trích đúng mục thực sự hỗ trợ quyết định về tổ chức, đặt tên hoặc tìm thông tin; không gán nguồn typography cho mọi quyết định UX.

Rút ra ba nguyên tắc có phạm vi và ngoại lệ. Phân biệt kiến thức từ nguồn với suy luận từ đề bài. Không cần tải hàng loạt repo hoặc viết bộ máy kiến thức mới.

## 10. Tiêu chí nghiệm thu

| ID | Tiêu chí | Căn cứ |
| --- | --- | --- |
| IA01 | Dữ liệu đủ, đúng, dùng ID ổn định | Bảng dữ liệu và nguồn |
| IA02 | Nhãn nhóm có ý nghĩa, ánh xạ đủ; giải thích được hai phương án và đánh đổi | Báo cáo, bốn tình huống tìm thông tin |
| IA03 | Tìm kiếm, lọc, lưu trữ, không kết quả đúng hợp đồng | T01–T06, T08 |
| IA04 | Chi tiết đúng tài liệu; quay lại bảo toàn ngữ cảnh và focus | T07 và kiểm tra bàn phím |
| IA05 | Bố cục sử dụng được ở ba chiều rộng, không cắt nội dung quan trọng, không chuyển động | Ảnh và kiểm tra có giới hạn |
| IA06 | Nguồn, báo cáo, log cùng phiên bản và mô tả đúng mức xác minh | Gói bàn giao |

Chỉ đánh giá trong phạm vi trên. Không thêm yêu cầu quản trị tài liệu doanh nghiệp, AI tìm kiếm hoặc tài khoản nhiều vai trò sau mỗi lần review.

## 11. Gói bàn giao đầu tiên

Tên ZIP: design_training_003_submission_r01.zip.

Gồm:

- Mã nguồn, dữ liệu và asset cục bộ cần chạy; hướng dẫn chạy ngắn, ghi Google Fonts/phụ thuộc mạng nếu có.
- DESIGN_TRAINING_003_REPORT.md: kiến trúc nhóm, hai phương án, quyết định, ba nguyên tắc, hai đánh đổi, đường đi của bốn tình huống, giới hạn tự kiểm. Dẫn file nguồn tương đối, không nhúng bản sao code.
- VERIFICATION.json: các ca T01–T08 với điều kiện trước, thao tác, ID kết quả mong đợi/thực tế và phương pháp kiểm tra. Bản ghi bàn phím ghi phần tử kích hoạt và activeElement trước/sau riêng biệt; Puppeteer là bàn phím tự động hóa, không gọi là bàn phím vật lý.
- Năm ảnh: desktop mặc định, mobile mặc định, desktop tìm “dang nhap”, mobile không kết quả, mobile chi tiết D12. Ghi rõ viewport CSS, DPR và trạng thái ảnh. Các trạng thái quay lại/focus có thể chứng minh bằng log hoặc video ngắn, không bắt buộc thêm ảnh hàng loạt.

Trước khi gửi, mở ZIP kiểm tra file bên trong đúng phiên bản. Các lần tiếp theo tăng r02/r03, không ghi đè tên cũ khi bàn giao.

## 12. Giới hạn sửa và mức công nhận kiến thức

Lần nộp đầu chưa tính là vòng sửa. Tối đa hai vòng sửa triển khai sau finding có bằng chứng; bổ sung tệp truyền thiếu không tự tính là vòng sửa. Giữ các tiêu chí đã đóng trừ khi có hồi quy thực tế.

Hết hai vòng còn lỗi chặn thì dừng và báo Anh, không tự làm vòng ba. PASS là hoàn thành bài tập có kiểm soát, không phải chứng nhận kỹ năng cho mọi sản phẩm hoặc cho phép áp dụng máy móc các giới hạn bốn nhóm/hai bộ lọc.

Antigravity bắt đầu thực hiện theo đề bài này; các lựa chọn thường lệ trong phạm vi đã được cho phép, không cần gửi lời xin nhận bài thêm lần nữa.
