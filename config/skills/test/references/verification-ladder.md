> **Nguyên Tắc Cốt Lõi**: Độ sâu xác định mức độ kỹ lưỡng, không phải nghi thức cứng nhắc (`Depth determines scrutiny, not ritual`).
> `TEST_PASS` được cấp khi:
> 1. Toàn bộ kiểm tra **bắt buộc và đã được lựa chọn** (`REQUIRED & SELECTED`) đều vượt qua.
> 2. Mọi bậc thang bị lược bỏ đều có lý do kỹ thuật chính đáng và được tài liệu hóa (`valid justification`).
> 3. Không còn finding nghiêm trọng nào tồn đọng.

Không phải mọi bậc thang đều bắt buộc cho mọi nhiệm vụ. Ví dụ: tác vụ FAST/TARGETED (chỉnh sửa giao diện nhỏ, tài liệu) có thể lược bỏ chính đáng L5 (Data) và L7 (Recovery) mà vẫn đạt `TEST_PASS` hợp lệ. Ngược lại, tác vụ CRITICAL/DEEP (Auth, Database) bắt buộc kích hoạt L5 và L7.

## 8 Bậc Thang Kiểm Chứng Thích Ứng

### L0 — Baseline / Integrity (Tính Toàn Vẹn Của Bản Đóng Băng)
- Xác nhận bản Release Candidate đã được đóng băng (`baseline.frozen: true`), có commit hash hoặc snapshot rõ ràng.
- Kiểm tra môi trường sạch, diff sạch, hợp đồng thiết kế/kỹ thuật không bị đột biến ngầm.
- *Nếu baseline mơ hồ $\to$ Dừng ngay với `TEST_BLOCKED`*.

### L1 — Syntax / Build / Static Analysis (Cú Pháp, Biên Dịch & Phân Tích Tĩnh)
- Chạy độc lập `npm run build`, `tsc`, linters, type checkers.
- Nghiêm cấm tin vào log cũ của developer; tester bắt buộc phải tự chạy lại và đo lường exit code.

### L2 — Unit / Component (Hàm Vi Mô & Thành Phần Giao Diện Độc Lập)
- Chạy các bộ unit test độc lập, cô lập state và mock các service bên ngoài.
- Thử nghiệm các giá trị biên (null, undefined, max integer, empty string).

### L3 — Integration / Contract (Tích Hợp & Ranh Giới Khế Ước)
- Kiểm tra các điểm kết nối giữa các module, schema validation (Zod, TypeScript interfaces, YAML schemas).
- Đối chiếu với các hợp đồng công khai (`API_CONTRACT`, `DESIGN_CONTRACT`).

### L4 — Runtime / E2E (Kiểm Thử Thực Thi & Đầu Cuối)
- Khởi động service trong môi trường thử nghiệm độc lập.
- Thao tác giả lập người dùng, kiểm tra luồng nghiệp vụ end-to-end.

### L5 — Data / Migration / Security (Dữ Liệu, Di Trú & An Ninh)
- Bắt buộc thực hiện trong môi trường test/sandbox cách ly an toàn.
- Nghiêm cấm chạy các lệnh phá hủy (`DROP`, `DELETE`, `TRUNCATE`) hoặc migration trên dữ liệu production.
- Kiểm tra khả năng rollback di trú (`dry-run rollback`).

### L6 — Visual / Accessibility / Performance (Trực Quan, Tiếp Cận WCAG & Hiệu Năng)
- Sử dụng ảnh chụp màn hình thực tế qua CDP/Playwright tại các viewport chuẩn (Desktop 1440x900, Mobile 390x844).
- Đo lường độ tương phản WCAG AA/AAA, kiểm tra rủi ro `Generic-AI Risk`, đo lường 60 FPS frame rate.

### L7 — Adversarial / Edge-Case / Recovery (Nghịch Đảo, Sự Cố & Phục Hồi)
- Bơm lỗi giả lập (fault injection), ngắt mạng giữa chừng, gửi payload bất thường.
- Đánh giá khả năng tự phục hồi của hệ thống và các mạch ngắt (`Circuit Breakers`).
