# MOTION SAFETY MATRIX — MODULE 13

```yaml
system: TRIPFLOW Daily Departure Brief
stream: B (Expressive Experience)
governance: W3C WCAG 2.2 Guideline 2.3 & 2.2
audit_mode: BROWSER_AUTOMATED
```

---

| Mã Rủi Ro (Risk ID) | Nguy Cơ Tiềm Ẩn (Potential Risk) | Điều Kiện Kích Hoạt (Trigger) | Cơ Chế Bảo Vệ Chế Độ Thường (Normal Mode) | Cơ Chế Bảo Vệ Chế Độ Giảm Chuyển Động (Reduced Mode) | Phương Pháp Kiểm Chứng (Verification Method) |
|---|---|---|---|---|---|
| **RSK-01** | **Vestibular Displacement** (Rối loạn tiền đình do dịch chuyển lớn) | Mở panel P1, nhấn mạnh P3, rung lỗi P2 | Giới hạn chuyển vị không gian tối đa ≤ 4px (thấp hơn trần 8px của chỉ thị); scale ≤ 1.02 | Toàn bộ chuyển vị dịch chuyển đưa về chính xác **0px**; scale = 1.0 | Đo đạc bounding box bằng Puppeteer tại runtime |
| **RSK-02** | **Repeated Motion & Flashing** (Co giật do nhấp nháy hoặc lặp liên tục) | Điểm nghẽn T01 cần chú ý, thông báo trạng thái | Không lặp vô hạn; không autoplay; chỉ chạy 1 chu kỳ; tần số đổi màu < 3 lần/giây | Hiển thị viền màu tĩnh tức thời; không hiệu ứng chuyển tiếp động | Kiểm toán timeline hoạt ảnh; đếm số lần đổi frame |
| **RSK-03** | **Focus Loss / Trapping** (Mất tiêu điểm bàn phím khi hoạt ảnh kết thúc) | Nút P2 chuyển sang pending/success; panel P1 mở/đóng | Dùng `aria-disabled="true"` thay vì `disabled`; tiêu điểm được giữ nguyên vẹn tại cùng phần tử DOM | Tiêu điểm giữ nguyên vẹn tại cùng phần tử DOM | Kiểm tra `document.activeElement === actionBtn` sau settle |
| **RSK-04** | **Rapid Input Queuing** (Tràn hàng đợi hoạt ảnh khi click dồn dập) | Người dùng click 10 lần liên tiếp vào nút P2 hoặc summary P1 | Hủy hoạt ảnh cũ ngay lập tức; không tạo queue (`queue length = 0`); khóa kích hoạt kép | Hủy hoạt ảnh ngay lập tức; chuyển trạng thái tức thì | Kịch bản stress test: 10 lần click với khoảng cách 20ms |
| **RSK-05** | **Layout Instability & Shift** (Giật layout làm xô lệch các phần tử khác) | Panel P1 mở rộng, card T01 phóng to nhấn mạnh | Không animate thuộc tính layout (`width`, `height`, `top`, `left`); chỉ animate `transform` và `opacity` | Không có bất kỳ chuyển vị nào | Ghi nhận `layout-shift` thông qua `PerformanceObserver` (CLS = 0) |
| **RSK-06** | **Screen Reader Desynchronization** (Mất đồng bộ giữa hình ảnh và bộ đọc màn hình) | Nút P2 chuyển từ idle sang pending, success hoặc error | Trạng thái hiển thị đồng bộ tức thì với vùng `aria-live="polite"`; không công bố trạng thái rác | Vùng `aria-live="polite"` công bố nội dung tương đương 100% | Đọc chuỗi thông điệp trong vùng live-region ở mỗi state |

---

## Cam Kết Tuân Thủ Tiêu Chuẩn Quốc Tế
1. **W3C WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions)**: Motion triggered by user interaction can be disabled unless the motion is essential to the functionality or information being conveyed. TRIPFLOW hỗ trợ đầy đủ `prefers-reduced-motion: reduce` và dev toggle tương đương.
2. **W3C WCAG 2.2 Success Criterion 2.2.2 (Pause, Stop, Hide)**: Không có bất kỳ hoạt ảnh nền nào tự động chạy lâu hơn 5 giây hoặc lặp vô tận.
3. **Zero Layout Shift Mandate**: Đảm bảo trải nghiệm đọc văn bản của điều phối viên hoàn toàn ổn định khi tương tác với các component có chuyển động.
