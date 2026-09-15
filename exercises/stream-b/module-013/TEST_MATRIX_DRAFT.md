# TEST MATRIX DRAFT — MODULE 13

Trạng thái ban đầu: `PLANNED / NOT_RUN`.
Bộ test độc lập được thiết kế mới hoàn toàn cho Module 13 (Không kế thừa harness hay kết quả từ Module 12).

| Test ID | Tên Bài Kiểm Thử | Số Assertions | Runtime Bắt Buộc | Mục Tiêu Kiểm Chứng Chi Tiết | Trạng Thái |
|---|---|---:|---|---|---|
| **T01** | Package, stream, immutable source | 6 | Node + filesystem | Xác thực Stream B, workspace cô lập, mã băm SHA-256 của snapshot zip `8b7beb...`, 27 files trong manifest, tính bất biến của baseline/assets/governance, không import runner Module 12 | PLANNED |
| **T02** | Canonical and visual invariants | 6 | Chromium runtime | Đối soát sâu 8 tuples dữ liệu canonical T01–T08, T01 priority, canvas sáng `#FAF8F5`, Direction A editorial typography, không dark theme, bảo toàn 3 critique declarations | PLANNED |
| **T03** | Contract and token usage | 7 | Node + Chromium | Kiểm tra schema `MOTION_CONTRACT.yaml`, giá trị token nằm trong budget (<= 300ms, <= 8px, <= 1.02 scale), không có magic number, delay 0, không có forbidden properties | PLANNED |
| **T04** | Study divergence and selection | 5 | Chromium runtime | Đo đạc 2 motion studies khác biệt trên ít nhất 4/6 trục chiến lược, giữ nguyên visual baseline và nội dung ngữ nghĩa, rubric đủ 8 nhóm | PLANNED |
| **T05** | P1 disclosure lifecycle | 7 | Chromium pointer + keyboard | Vận hành mở/đóng bằng click chuột và phím Enter/Space, cập nhật aria-expanded đúng, nội dung không bị cắt xén, focus hợp lệ, dọn sạch inline styles | PLANNED |
| **T06** | P2 action FSM | 9 | Chromium input | Vận hành đủ chu trình idle -> pending -> success và idle -> pending -> error -> retry -> success; giữ nguyên nút DOM duy nhất, guard kích hoạt kép, live-region đúng | PLANNED |
| **T07** | P3 attention safety | 5 | Chromium animation | Kích hoạt có chủ đích (không autoplay), không lặp chu kỳ, chuyển vị <= 8px, scale <= 1.02, settle về trạng thái ban đầu | PLANNED |
| **T08** | Duration/easing fidelity | 6 | Web Animations API | Đo đạc `getAnimations()` và computed timing cho P1-P3; duration và easing khớp chính xác với contract tokens, finished promises settle sạch | PLANNED |
| **T09** | Interruption/reversal stress | 7 | Chromium stress input | 10 lần click dồn dập (stress clicks); không tồn tại animation queue; settle đúng theo số lần kích hoạt chẵn/lẻ; không duplicate side-effects | PLANNED |
| **T10** | Reduced-motion equivalence | 8 | Media emulation | Giả lập `prefers-reduced-motion: reduce`; media query match true; kết quả P1-P3 đồng nhất; chuyển vị 0px; duration <= 1ms; thông báo live-region giữ nguyên | PLANNED |
| **T11** | Keyboard/focus/announcements | 7 | Native keyboard | Phím Tab duyệt thật qua từng trigger; `:focus-visible` hiển thị rõ; Enter/Space parity; focus không bị văng ra `body`; live-region không lặp thông điệp | PLANNED |
| **T12** | Responsive containment | 6 | 3 viewports × 2 modes | Kiểm tra ở 1440x900, 768x1024, 390x844 cho cả normal và reduced mode; không xuất hiện thanh cuộn ngang ngoài ý muốn; target >= 44x44px | PLANNED |
| **T13** | Performance/layout stability | 6 | PerformanceObserver | Layout-shift (CLS) = 0 trong suốt quá trình chạy animation; anchor elements giữ nguyên vị trí; concurrent animations <= 2; long tasks > 50ms = 0 | PLANNED |
| **T14** | Safety boundary | 4 | DOM/computed audit | Không autoplay; không hiệu ứng chớp nháy (flashing); không parallax/scroll-linked; không biến đổi 3D/perspective | PLANNED |
| **T15** | Critique scope | 4 | Parser + diff | 5–7 nhận xét critique có taxonomy rõ ràng; chọn đúng 1 giả thuyết; diff giữa pre_critique và candidate không quá 2 thay đổi liên quan | PLANNED |
| **T16** | Evidence/package parity | 7 | Clean unpack | Chính xác 12 ảnh PNG authoritative DPR=2; kích thước và metadata khớp; clean unpack runner PASS; ZIP inventory khớp manifest 100% | PLANNED |
| **Tổng** | **Toàn Bộ Bài Đo Đạc** | **96** | **Authoritative Browser** | **Tất cả 96 assertions đều dựa trên primitive measurements thực tế** | **PLANNED** |

---

## Nguyên Tắc Đo Đạc & Thu Thập Bằng Chứng
- Không tự chấm PASS bằng cờ boolean tĩnh; mọi kết luận phải trích xuất từ giá trị đo đạc thực tế (`primitive measurements`).
- Tất cả các bài test bàn phím phải dùng `page.keyboard.press()`, không dùng JavaScript synthetic focus/click.
- Mọi trường dữ liệu khẳng định trong báo cáo phải đi kèm nhãn taxonomy: `[MEASURED]`, `[VISUAL_REVIEW]`, hoặc `[DESIGN_INTENT]`.
