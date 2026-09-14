# Original User Request

## 2026-09-14T01:32:33Z

Triển khai hoàn tất Phase 0 (Integrity Setup), Phase 1 (Brand Reasoning), Phase 2 (Two-Direction Prototypes) và chuẩn bị payload Checkpoint 12.1 cho Module 12 — Brand & Image Direction (Stream B) thuộc hệ thống TRIPFLOW Daily Departure Brief, tuân thủ 100% tài liệu chỉ thị chính thức DESIGN_TRAINING_MODULE_012_DIRECTIVE.md.

Working directory: design-training/stream-b/module-012/
Integrity mode: development

Tài liệu chỉ thị gốc đã được lưu sẵn tại:
- design-training/stream-b/module-012/DESIGN_TRAINING_MODULE_012_DIRECTIVE.md
- Bản PASS Module 07 đã được nạp tại: design-training/stream-b/module-012/source_snapshot/design_training_007_submission_r04.zip (SHA-256: e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76).

## Requirements

### R1. Phase 0 Integrity Setup & Ledger
Thiết lập workspace cô lập tại `design-training/stream-b/module-012/` (tuyệt đối không đọc/ghi sang `stream-a/`). Đóng băng bản PASS Module 07 tại `source_snapshot/design_training_007_submission_r04.zip` kèm mã băm SHA-256 xác thực `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`. Khởi tạo `CHANGE_LEDGER.md` và khóa cứng bộ dữ liệu canonical T01–T08 mốc 13/09/2026 18:00 Asia/Ho_Chi_Minh.

### R2. Phase 1 Brand Reasoning Deliverables
Biên soạn đầy đủ 4 tài liệu chiến lược theo đặc tả Directive:
1. `BRAND_THESIS.md`: Định vị đối tượng điều phối viên B2B, lời hứa sản phẩm ("TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành"), 4 personality nền tảng (bình tĩnh, chính xác, có chuẩn bị, gần gũi), và 4 anti-personality khóa cứng.
2. `REFERENCE_BOARD.md`: Tối đa 8 references phân tích sâu 5 trường (URL, quan sát, nguyên tắc chuyển giao, điều cấm sao chép, độ liên quan với TRIPFLOW).
3. `IMAGE_LANGUAGE_MATRIX.md`: 6 vai trò hình ảnh (Hero/context, Operational scene, Route diagram, Person Lan giả lập, Icon family 6 icons, Texture/accent) kèm 10 thuộc tính quy tắc (purpose, source_type, style_rule, do, do_not, desktop_crop, mobile_crop, color_treatment, accessibility_treatment, fallback_behavior).
4. `TEST_MATRIX_DRAFT.md`: Khung kiểm thử sơ bộ chuẩn bị cho bộ kiểm chứng T01–T14 và 8 blocking gates B01–B08.

### R3. Phase 2 Two-Direction Prototypes
Xây dựng hai bản mẫu giao diện hoàn chỉnh, độc lập và chạy được trực tiếp trên trình duyệt ở viewport desktop 1440×900:
- `directions/option_a/index.html` (Hướng A — Human Field Intelligence: bố cục editorial/asymmetric, ảnh documentary, cảm giác ấm áp, tin cậy, tập trung vào con người vận hành thực tế).
- `directions/option_b/index.html` (Hướng B — Route Signal System: bố cục systematic/cartographic, grid chặt chẽ, nhịp quét tín hiệu cao, nhấn mạnh chuỗi mốc và độ sẵn sàng).
Hai hướng bắt buộc phân kỳ chiến lược trên tối thiểu 5/7 trục (brand personality, composition model, typography behavior, image source/style, crop/perspective, icon/diagram language, surface/texture behavior). Cả hai đều khóa chết ranh giới Zero-Motion: `animation: 0s` và `transition: 0s` tuyệt đối.

### R4. Checkpoint 12.1 Reasoning Gate Payload
Tổng hợp và xuất bản thông điệp bàn giao Checkpoint 12.1 theo đúng cấu trúc YAML quy định tại Mục 23 của Directive, đóng gói sẵn sàng để gửi sang Controller Stream B (ChatGPT Tab B) thẩm định trước khi mở khóa giai đoạn lựa chọn và xây dựng final candidate.

## Acceptance Criteria

### Integrity & Canonical Data
- [ ] Không có bất kỳ thay đổi hoặc truy cập trái phép nào vào thư mục `design-training/stream-a/`.
- [ ] `source_snapshot/design_training_007_submission_r04.zip` khớp chính xác mã SHA-256 `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76`.
- [ ] Dữ liệu 8 tour T01–T08 khớp chính xác 100% với Canonical Operational Snapshot Mục 4.6 (T01 là trọng tâm, không bịa đặt số liệu doanh thu/đối tác).

### Brand & Image Strategy
- [ ] `BRAND_THESIS.md` có đầy đủ thesis statement (80–140 từ cho mỗi hướng), bảng 4 thuộc tính và 8 mapping quyết định thị giác.
- [ ] `REFERENCE_BOARD.md` chứa đúng tối đa 8 mục tham chiếu phân tích nghiêm túc, không có dẫn chứng hời hợt.
- [ ] `IMAGE_LANGUAGE_MATRIX.md` đủ 6 vai trò tài sản hình ảnh với quy tắc crop 3 viewports và chiến lược alt/fallback rõ ràng.

### Prototypes & Visual Divergence
- [ ] Cả `directions/option_a/index.html` và `directions/option_b/index.html` mở được độc lập, render sạch đẹp không lỗi console ở 1440x900.
- [ ] Hai hướng khác biệt nhau rõ rệt trên ít nhất 5/7 trục chiến lược, không phải chỉ đổi màu sắc (palette).
- [ ] 100% CSS trên cả 2 prototype tuân thủ quy tắc tĩnh (Zero-Motion: không animation, không transition duration > 0s).
- [ ] Target tương tác tối thiểu 44x44px và tương phản WCAG 2.2 AA cho văn bản/icon chính.

### Checkpoint Payload
- [ ] File payload `CHECKPOINT_12_1.yaml` khớp định dạng Mục 23 của Directive sẵn sàng nộp Controller.
