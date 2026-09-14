# DESIGN TRAINING 012 — BRAND & IMAGE DIRECTION

## Chỉ thị đào tạo và đặc tả nghiệm thu cho Stream B

```yaml
directive_id: DESIGN_TRAINING_MODULE_012
stream_id: B
stream_name: EXPRESSIVE_EXPERIENCE
module: 12
title: BRAND_AND_IMAGE_DIRECTION
authority: ChatGPT Controller — Stream B
executor: Antigravity Tab B
product_owner: Anh — Lead Architect / Product Owner
status: ISSUED
issued_date: 2026-09-14
workspace_root: design-training/stream-b/module-012/
previous_gate:
  module: DESIGN_TRAINING_007
  verdict: PASS
  completed: true
next_module:
  module: DESIGN_TRAINING_013_MOTION_FOUNDATION
  status: LOCKED
repair_budget: 2
submission_round: R01
```

---

## 1. Mệnh lệnh thực thi

Antigravity Tab B được phép bắt đầu **Module 12 — Brand & Image Direction** trong thư mục cô lập:

```text
design-training/stream-b/module-012/
```

Không đọc, sửa hoặc ghi vào `design-training/stream-a/`. Không mở Module 13 trước khi Controller Stream B ký:

```yaml
MODULE_COMPLETED: true
VERDICT: PASS
```

Module này chỉ đào tạo **brand direction** và **image direction**. Mọi animation, page transition, parallax, scroll choreography hoặc 3D đều nằm ngoài phạm vi và bị khóa cho Module 13–15.

---

## 2. Mục tiêu học tập

Sau Module 12, Antigravity phải chứng minh được khả năng:

1. chuyển chiến lược thương hiệu thành quyết định thị giác cụ thể;
2. tạo hai art direction khác nhau về logic, không chỉ thay màu;
3. xây một hệ hình ảnh có vai trò, quy tắc và provenance rõ ràng;
4. duy trì cùng một ngôn ngữ qua photography, illustration, diagram và iconography;
5. chọn một hướng bằng tiêu chí gắn với audience và nhiệm vụ;
6. áp dụng hướng đã chọn vào giao diện thật ở ba viewport;
7. phân biệt bằng chứng kỹ thuật với phán đoán nghệ thuật;
8. ghi rõ giới hạn: bài tập không phải nghiên cứu người dùng hoặc kiểm định thị trường.

Module không chấm khả năng tạo một “moodboard đẹp”. Module chấm khả năng biến định vị thành **một hệ thống tái sử dụng được**.

---

## 3. Bài học cốt lõi

### 3.1. Brand không phải logo

Trong phạm vi bài tập này:

```text
Brand direction = lời hứa + tính cách + điều cần tránh + bằng chứng biểu đạt
```

Logo chỉ là một tài sản. Brand direction phải giải thích được vì sao typography, bố cục, màu, ảnh, icon, texture và giọng văn cùng tạo ra một cảm nhận nhất quán.

### 3.2. Image direction không phải bộ sưu tập ảnh đẹp

Một image system đạt yêu cầu phải trả lời được:

- loại hình ảnh nào được dùng cho vai trò nào;
- chủ thể, khoảnh khắc và góc nhìn ưu tiên;
- ánh sáng, màu, độ tương phản và texture;
- cách crop ở desktop, tablet và mobile;
- điểm neo chủ thể khi tỷ lệ khung thay đổi;
- khi nào dùng ảnh, minh họa, sơ đồ hoặc icon;
- ảnh nào mang thông tin, ảnh nào chỉ trang trí;
- nguồn gốc, quyền sử dụng và mức độ hư cấu của tài sản.

### 3.3. Hai hướng chỉ được coi là khác nhau khi khác chiến lược

Đổi palette nhưng giữ cùng grid, type hierarchy, crop, asset role và nhịp bố cục **không phải hai art direction**.

Hai hướng bắt buộc phải khác nhau tối thiểu ở **5/7 trục**:

1. brand personality;
2. composition model;
3. typography behavior;
4. image source/style;
5. crop/perspective;
6. icon/diagram language;
7. surface/texture behavior.

### 3.4. Hình ảnh phải phục vụ nhiệm vụ

Ảnh không được làm biến mất trạng thái vận hành, CTA hoặc thông tin cần xử lý. Một hình ảnh lớn không tự động tạo “premium”. Image prominence phải được giải thích bằng nhiệm vụ, không bằng sở thích.

### 3.5. Sự nhất quán không đồng nghĩa với lặp lại

Hệ thống tốt giữ cùng nguyên tắc nhưng cho phép biến thiên có kiểm soát. Ví dụ: ảnh hero và ảnh card có tỷ lệ khác nhau, nhưng cùng ánh sáng, khoảng cách chủ thể, điểm nhìn và phương pháp xử lý màu.

### 3.6. Nguồn tham khảo nền

- W3C Images Tutorial: phân loại informative, decorative, functional, complex images và text alternative: <https://www.w3.org/WAI/tutorials/images/>
- W3C Alt Decision Tree: quyết định `alt` theo mục đích thực tế của hình ảnh: <https://www.w3.org/WAI/tutorials/images/decision-tree/>
- IBM Carbon icon production guidance: grid, pixel alignment, optical consistency và SVG: <https://v10.carbondesignsystem.com/contributing/contribute-icons/>
- GOV.UK Design System: ví dụ về việc duy trì tính nhất quán xuyên typography, color, image và component: <https://design-system.service.gov.uk/>

Anti phải ghi nguồn đã đọc trong báo cáo. Không được biến nguyên tắc của một design system thành chân lý phổ quát.

---

## 4. Bối cảnh sản phẩm khóa cứng

### 4.1. Sản phẩm

**TRIPFLOW — Bảng điều phối tour khởi hành**

Module 12 tiếp tục trên sản phẩm của Module 07 để đo năng lực phát triển brand mà không thay đổi nghiệp vụ.

### 4.2. Audience chính

Điều phối viên và trưởng nhóm vận hành tại doanh nghiệp du lịch quy mô nhỏ hoặc vừa. Họ:

- theo dõi nhiều đoàn cùng lúc;
- làm việc trong môi trường thường xuyên bị gián đoạn;
- cần phát hiện việc chưa sẵn sàng;
- cần cảm giác bình tĩnh, rõ ràng và có kiểm soát;
- không cần một trải nghiệm “phiêu lưu du lịch” dành cho khách mua tour.

### 4.3. Brand promise khóa cứng

```text
TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành.
```

Đây là **product promise trong bài tập**, không phải tuyên bố hiệu quả đã được nghiên cứu.

### 4.4. Personality seed

Anti được quyền diễn giải nhưng không được xóa bốn thuộc tính nền:

- bình tĩnh;
- chính xác;
- có chuẩn bị;
- gần gũi với người làm vận hành.

### 4.5. Anti-personality khóa cứng

TRIPFLOW không được biểu đạt như:

- hãng du lịch nghỉ dưỡng xa xỉ;
- bảng điều khiển quân sự hoặc phòng chỉ huy;
- sản phẩm AI tím–xanh phát sáng chung chung;
- mạng xã hội khám phá điểm đến;
- giao diện “adventure” dùng hình núi, la bàn và máy bay như họa tiết mặc định;
- dashboard thành tích với số liệu tăng trưởng bịa đặt.

### 4.6. Canonical operational snapshot

Mốc thời gian cố định:

```text
13/09/2026 — 18:00, Asia/Ho_Chi_Minh
```

| ID | Tour | Khởi hành | Phụ trách | Trạng thái | Vấn đề / ghi chú |
|---|---|---|---|---|---|
| T01 | Hạ Long 2N1Đ | 14/09/2026 07:30 | Lan | Chờ đối tác | Khách sạn chưa xác nhận 4 phòng |
| T02 | Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách |
| T03 | Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD |
| T04 | Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn |
| T05 | Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành |
| T06 | Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận |
| T07 | Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng |
| T08 | Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký |

T01 là nội dung ưu tiên. Không sửa tuple, tự tạo khách hàng, doanh thu, giải thưởng, đánh giá hoặc đối tác thật.

---

## 5. Đề bài thiết kế

Tạo một **TRIPFLOW Daily Departure Brief** dùng cùng nội dung và cấu trúc nghĩa cho cả hai hướng.

Màn hình phải gồm:

1. brand header;
2. lời hứa sản phẩm;
3. điểm tập trung T01;
4. operational snapshot cho đủ T01–T08;
5. một route/sequence diagram cho T01;
6. một khu vực “người phụ trách” thể hiện Lan là nhân vật giả lập;
7. một nhóm icon nghiệp vụ;
8. asset disclosure ngắn, có thể mở để xem provenance.

Không biến bài tập thành landing page bán tour. Đây vẫn là sản phẩm vận hành B2B.

---

## 6. Hai art direction bắt buộc

Anti phải đặt tên riêng cho mỗi hướng. Hai hướng dùng cùng nội dung, cùng thứ tự ưu tiên nghiệp vụ và cùng viewport desktop 1440×900.

### Direction A — Human Field Intelligence

Seed, không phải đáp án hoàn chỉnh:

- trọng tâm: con người vận hành trong bối cảnh địa phương;
- composition: editorial/asymmetric, có nhịp đọc và khoảng thở;
- image mode: documentary hoặc documentary-inspired;
- cảm giác: ấm, quan sát, đáng tin, không tô hồng du lịch;
- ảnh phải cho thấy công việc hoặc bối cảnh, không chỉ phong cảnh postcard.

### Direction B — Route Signal System

Seed, không phải đáp án hoàn chỉnh:

- trọng tâm: tuyến, tín hiệu, mốc và sự sẵn sàng;
- composition: systematic/cartographic, grid rõ và nhịp quét cao;
- image mode: diagram, cropped geography, abstracted route evidence;
- cảm giác: chính xác, định hướng, bình tĩnh;
- không được biến thành terminal, radar hoặc military command center.

### Điều kiện khác biệt

Mỗi hướng phải có:

- một thesis 80–140 từ;
- 4 từ personality và 4 từ anti-personality;
- type specimen;
- palette có vai trò semantic;
- composition diagram;
- image contact sheet;
- icon family sample;
- một màn hình desktop hoàn chỉnh;
- bảng ánh xạ ít nhất 8 quyết định thị giác về brand thesis.

Controller không mặc định Direction A hay B thắng. Anti phải chọn bằng rubric tại Mục 15.

---

## 7. Image Language Matrix bắt buộc

Tạo `IMAGE_LANGUAGE_MATRIX.md` với tối thiểu các hàng sau:

| Asset role | Minimum asset | Meaning | Allowed style | Crop rule | Alt strategy | Fallback |
|---|---:|---|---|---|---|---|
| Hero/context | 1 | Bối cảnh tour ưu tiên | Do Anti định nghĩa | Có focal point | Informative hoặc decorative có lý do | Solid/diagram fallback |
| Operational scene | 2 | Công việc chuẩn bị | Do Anti định nghĩa | Có safe zone | Informative | Text summary |
| Route diagram | 1 | Chuỗi mốc T01 | Authored SVG/HTML | Không crop mất nhãn | Complex image + text equivalent | Ordered list |
| Person/avatar | 1 | Lan, nhân vật giả lập | Không giả ảnh người thật | Stable face crop | Alt theo ngữ cảnh | Initials avatar |
| Icon family | 6 icons | Trạng thái/nghiệp vụ | Một hệ hình học | Không crop | Decorative khi có text label | Text label |
| Texture/accent | 1 | Tạo surface character | Nhẹ, không cản đọc | Tile/edge rule | Decorative | None |

Mỗi hàng phải ghi rõ:

- `purpose`;
- `source_type`;
- `style_rule`;
- `do`;
- `do_not`;
- `desktop_crop`;
- `mobile_crop`;
- `color_treatment`;
- `accessibility_treatment`;
- `fallback_behavior`.

---

## 8. Asset provenance và tính trung thực

Tạo `ASSET_MANIFEST.yaml`. Mỗi asset phải có:

```yaml
- asset_id: IMG_001
  file: assets/images/example.webp
  role: hero_context
  origin_type: original | ai_generated | open_license | authored_vector
  source_url: null
  creator: null
  license: null
  generated_with: null
  generated_date: null
  disclosure: "AI-generated training asset" | "Fictional authored asset" | null
  depicts_real_partner: false
  focal_point_percent: { x: 50, y: 45 }
  alt_strategy: informative | decorative | functional | complex
  alt_text: "..."
  sha256: "..."
```

Quy tắc:

- Không hotlink asset từ Internet trong runtime.
- Không đưa ảnh vào ZIP nếu không có quyền phân phối hoặc nguồn gốc hợp lệ.
- Ảnh AI phải ghi `AI-generated training asset` trong manifest và disclosure UI.
- Người, địa điểm, đối tác và dữ liệu trong ảnh giả lập không được trình bày như bằng chứng vận hành thật.
- Không dùng logo hoặc nhãn hiệu của doanh nghiệp thật làm đối tác giả định.
- Không đưa watermark vào candidate.
- Reference moodboard chỉ lưu URL và phân tích; không sao chép file nếu chưa có quyền.

---

## 9. Iconography contract

Tạo tối thiểu sáu icon riêng cho:

1. khởi hành;
2. chờ đối tác;
3. thiếu hồ sơ;
4. sẵn sàng;
5. người phụ trách;
6. nhật ký liên hệ.

Trong `BRAND_IMAGE_CONTRACT.yaml` phải khóa:

- artboard: `24x24` hoặc `32x32`;
- stroke hoặc fill model;
- stroke width nếu dùng stroke;
- corner language;
- terminal/cap style;
- optical size;
- padding/safe area;
- trạng thái active/inactive;
- màu được phép;
- quy tắc ghép với text label.

Không trộn emoji, icon font và SVG custom trong cùng một family. Icon không được là phương tiện duy nhất truyền trạng thái.

---

## 10. Crop, responsive và image failure

Candidate phải chứng minh image system sống được ở:

```yaml
viewports:
  - { width: 1440, height: 900, dpr: 2 }
  - { width: 768, height: 1024, dpr: 2 }
  - { width: 390, height: 844, dpr: 2 }
```

Yêu cầu:

- `object-position` hoặc focal-point token phải giữ chủ thể chính trong khung.
- Không dùng cùng một crop ngẫu nhiên cho mọi tỷ lệ.
- Informative content không được mất nghĩa khi crop.
- Mọi `<img>` có `width` và `height` hoặc `aspect-ratio` hợp lý để tránh layout shift.
- Ảnh ngoài vùng đầu có lazy loading.
- Khi tắt hoặc lỗi ảnh, nội dung và hành động chính vẫn hiểu được.
- Không có horizontal overflow.
- Target tương tác tối thiểu 44×44 CSS px.
- Text và control phải đạt baseline WCAG 2.2 AA.
- Decorative image dùng `alt=""`; informative image có alt theo mục đích; complex route diagram có text equivalent ngoài ảnh.

---

## 11. Khóa ranh giới với Module 13

Trong toàn bộ Module 12:

```yaml
animation: forbidden
transition: forbidden
parallax: forbidden
scroll_linked_effect: forbidden
auto_play_media: forbidden
3d_transform_as_effect: forbidden
```

CSS computed style phải cho thấy không có animation hoặc transition duration khác `0s`. Hover/focus được phép đổi thuộc tính tức thời nhưng không được animate.

Mục đích: đo brand và image direction độc lập, không để motion che điểm yếu thị giác.

---

## 12. Anti-patterns bị cấm

- purple/blue AI gradient;
- glassmorphism hoặc blur card dùng như phong cách mặc định;
- generic SaaS bento grid;
- hero có laptop mockup trôi nổi không phục vụ nhiệm vụ;
- hình máy bay, hộ chiếu, la bàn hoặc núi dùng như cliché trang trí;
- full-bleed luxury destination image làm người dùng hiểu nhầm đây là trang bán tour;
- ngẫu nhiên trộn ảnh thật, 3D clay, flat illustration và icon outline;
- dùng flag, badge hoặc “verified” để tạo uy tín giả;
- số liệu hiệu quả, doanh thu, khách hàng, rating hoặc giải thưởng bịa đặt;
- text nằm trong raster image trừ logo/specimen có lý do;
- ảnh che mất thông tin vận hành trên mobile;
- đánh giá “đẹp”, “premium”, “tin cậy” mà không chỉ ra quyết định thị giác tạo nên nhận định đó.

---

## 13. Quy trình thực thi bắt buộc

### Phase 0 — Integrity setup

1. Tạo đúng workspace Module 12.
2. Đưa bản PASS Module 07 vào `source_snapshot/` hoặc ghi đường dẫn nguồn read-only.
3. Ghi SHA-256 của source snapshot.
4. Tạo `CHANGE_LEDGER.md`; không sửa trực tiếp Module 07.
5. Khóa canonical data tại Mục 4.6.

### Phase 1 — Brand reasoning

Tạo:

- `BRAND_THESIS.md`;
- `REFERENCE_BOARD.md`;
- `IMAGE_LANGUAGE_MATRIX.md`;
- `TEST_MATRIX_DRAFT.md`.

`REFERENCE_BOARD.md` có tối đa 8 reference. Mỗi reference phải ghi:

- URL;
- điều quan sát được;
- nguyên tắc có thể chuyển giao;
- điều không được sao chép;
- mức độ liên quan với TRIPFLOW.

Không được dùng “inspired by X” như lý do đầy đủ.

### Phase 2 — Two-direction prototypes

Tạo hai prototype độc lập:

```text
directions/option_a/index.html
directions/option_b/index.html
```

Cùng nội dung, khác hệ thống. Mỗi prototype phải hoàn chỉnh đủ để Controller đánh giá ở desktop; không phải moodboard tĩnh.

### Phase 3 — Selection gate

Anti tự chấm cả hai hướng theo rubric tại Mục 15, chọn một hướng và ghi:

- 3 lý do chọn;
- 2 đánh đổi chấp nhận;
- 1 strength của hướng không chọn cần lưu trong archive, không trộn vào candidate;
- confidence: `EXERCISE_SUPPORTED`.

### Phase 4 — Final candidate

Tạo:

```text
candidate/pre_critique.html
candidate/index.html
```

Candidate phải áp dụng đầy đủ `BRAND_IMAGE_CONTRACT.yaml` và hoạt động ở ba viewport.

### Phase 5 — Critique

Self-critique gồm 5–7 nhận xét, mỗi nhận xét gắn taxonomy:

- `defect`;
- `tradeoff`;
- `preference`;
- `strength`.

Chọn đúng một giả thuyết sửa. Từ `pre_critique` đến `final` chỉ được có tối đa **hai thay đổi liên quan trực tiếp**. Quyết định cuối là:

- `ADOPT`;
- `KEEP_PRE_CRITIQUE`;
- `INCONCLUSIVE`.

Cả ba có thể PASS nếu bằng chứng trung thực.

### Phase 6 — Verification and packaging

Chạy kiểm thử, chụp ảnh authoritative, tạo report, tạo ZIP và tính SHA-256. Self-check không thay thế nghiệm thu độc lập.

---

## 14. Hợp đồng kỹ thuật

### 14.1. Runtime

- HTML/CSS/JavaScript tĩnh hoặc stack hiện có của Module 07.
- Không thêm framework chỉ để phục vụ bài tập.
- Không phụ thuộc CDN hoặc network ở runtime.
- Font phải là system stack hoặc local asset có license.
- Tất cả đường dẫn trong source, report và script phải tương đối.
- Verification script không chứa đường dẫn riêng của máy tác giả.

### 14.2. Asset budget

```yaml
image_formats_preferred:
  - avif
  - webp
  - svg
max_single_raster_bytes: 600000
max_total_runtime_asset_bytes: 3500000
hero_eager_allowed: true
noncritical_images_lazy: required
explicit_dimensions: required
remote_runtime_requests: 0
```

Nếu vượt budget, Anti phải giải thích và Controller có quyền coi là blocker.

### 14.3. Semantic and accessibility baseline

- Một `h1` rõ ràng.
- Heading order hợp lý.
- Buttons là button thật; links là link thật.
- Focus visible.
- Không trạng thái nào chỉ dùng màu/icon.
- Alt text theo purpose, không mô tả máy móc mọi chi tiết.
- Diagram phức tạp có equivalent text.
- Page vẫn hiểu được khi CSS background images không tải.

### 14.4. Source-of-truth

`BRAND_IMAGE_CONTRACT.yaml` là contract; token thực tế trong CSS phải ánh xạ được tới contract. `ASSET_MANIFEST.yaml` là source-of-truth cho nguồn asset. Không tạo hai bảng mâu thuẫn nhau.

---

## 15. Rubric chọn hướng và chấm điểm

| Nhóm | Điểm tối đa | Câu hỏi |
|---|---:|---|
| Brand–decision mapping | 20 | Quyết định có xuất phát từ promise/personality không? |
| Image system coherence | 20 | Ảnh, diagram, icon và texture có cùng ngôn ngữ không? |
| Direction differentiation | 15 | Hai hướng có khác chiến lược thật không? |
| Task support | 15 | Brand expression có giữ rõ T01 và trạng thái vận hành không? |
| Responsive/crop quality | 10 | Hệ hình ảnh có tái bố cục đúng ở 3 viewport không? |
| Accessibility/fallback | 10 | Alt, text equivalent, focus, contrast và failure mode có đạt không? |
| Provenance/integrity | 5 | Nguồn, license, disclosure và hash có đầy đủ không? |
| Critique quality | 5 | Nhận xét có taxonomy, evidence và trade-off thật không? |
| **Tổng** | **100** | |

Điều kiện điểm:

```yaml
minimum_score: 80
blocking_gate_override: true
```

Điểm ≥80 không thể bù cho một blocking gate bị FAIL.

---

## 16. Eight blocking gates

| Gate | Điều kiện PASS |
|---|---|
| B01 — Strategic divergence | Hai hướng khác tối thiểu 5/7 trục và không chỉ đổi palette |
| B02 — Brand traceability | Promise/personality ánh xạ tới ít nhất 8 quyết định có vị trí source cụ thể |
| B03 — Image system | Matrix, asset thật và candidate nhất quán về role, crop, lighting/color và fallback |
| B04 — Icon consistency | Sáu icon cùng grid/model/optical weight; label vẫn truyền nghĩa |
| B05 — Provenance integrity | 100% asset có manifest, hash, origin/license/disclosure phù hợp; không hotlink |
| B06 — Honest expression | Không claim giả, không mô phỏng đối tác thật, không generic AI/travel cliché bị cấm |
| B07 — Responsive accessibility | Ba viewport không overflow; crop giữ nghĩa; alt/equivalent/focus/target/contrast đạt baseline |
| B08 — Evidence integrity | Test không đổi nội dung khóa cứng; JSON, log, source, report và screenshot nhất quán |

Chỉ cần một gate FAIL thì module chưa hoàn thành.

---

## 17. Locked verification tests T01–T14

`verify_module_012.js` phải xuất `VERIFICATION.json`. Từng test có `precondition`, `method`, `measured`, `assertions`, `pass` và `evidence_paths`.

### T01 — Workspace and source integrity

- Đúng `STREAM_ID: B` và workspace cô lập.
- Có source snapshot/path cùng SHA-256.
- Không ghi file sang Stream A.

### T02 — Canonical content integrity

- Deep-compare đủ tám tuple T01–T08 với fixture độc lập trong harness.
- T01 vẫn là focus; không có claim hoặc business metric ngoài brief.

### T03 — Direction strategic divergence

- So sánh hai hướng trên 7 trục khóa cứng.
- PASS khi khác ≥5 trục và mỗi khác biệt có evidence source/screenshot.
- Không cho PASS chỉ bằng class name hoặc self-declaration.

### T04 — Brand traceability

- Kiểm 8 mapping từ thesis → contract token/rule → DOM/CSS/asset usage.
- Mọi selector/path được dẫn phải tồn tại.

### T05 — Asset manifest integrity

- Mọi runtime image/SVG/font/texture đều có đúng một manifest entry.
- SHA-256 khớp file.
- Không có remote URL trong runtime source.
- License/disclosure field phù hợp `origin_type`.

### T06 — Image role and crop behavior

- Đo bounding box và focal point ở 1440, 768, 390.
- Chủ thể/nhãn informative không bị crop khỏi vùng nhìn.
- Desktop và mobile crop tuân contract.

### T07 — Image failure parity

- Chặn hoặc đổi đường dẫn raster sau khi page load setup.
- Content priority, T01, CTA, route summary và status vẫn hiểu được.
- Không xuất hiện broken-image icon làm vỡ layout.

### T08 — Alternative text semantics

- Decorative image có `alt=""`.
- Informative image có alt theo mục đích.
- Functional icon không dùng filename làm accessible name.
- Route diagram có text equivalent chứa đủ mốc chính.

### T09 — Iconography consistency

- Đủ 6 icon.
- Cùng viewBox/grid, model và stroke/fill policy theo contract.
- Không emoji/icon-font trộn vào family.
- Khi CSS/icon bị ẩn, text label vẫn truyền nghĩa.

### T10 — Responsive and target integrity

- Không horizontal overflow ở cả ba viewport cho directions và candidate.
- Target tương tác ≥44×44 CSS px.
- Heading/CTA không bị che bởi ảnh.
- Không có text clip hoặc overlap.

### T11 — Contrast and non-color meaning

- Text/control contrast đạt WCAG 2.2 AA baseline.
- Focus indicator nhìn thấy.
- Status/selection không truyền bằng màu duy nhất.
- Kết quả đo và cặp màu được ghi vào JSON.

### T12 — Static-module boundary

- Quét computed style toàn DOM.
- `animationDuration` và `transitionDuration` bằng `0s`.
- Không parallax, autoplay, scroll hijack hoặc 3D effect.

### T13 — Asset performance budget

- Kiểm byte size từng asset và tổng asset runtime.
- Mọi raster có dimensions.
- Noncritical image lazy-loaded.
- Runtime remote request count bằng 0.

### T14 — Evidence/package parity

- Screenshot dimensions/DPR, filename và hash khớp manifest.
- Report khớp verdict từng T01–T13.
- `allPassed` là conjunction của đúng T01–T13, không có test bị bỏ.
- ZIP content khớp package manifest.

### Quy tắc harness

- Không được sửa nội dung test khóa cứng để đạt PASS.
- Assertion phải kiểm measured value, không chỉ kiểm cờ Boolean do candidate tự khai báo.
- Visual quality không được tự động tuyên bố PASS chỉ bằng DOM/style test.
- Mọi nhận định nghệ thuật phải nằm trong report và chờ Controller visual review.
- Exit code `0` chỉ khi T01–T14 đều PASS; còn lại exit code khác `0`.

---

## 18. Screenshot authoritative set

Chụp bằng browser runtime thật, không tạo ảnh minh họa thay thế. Tất cả ảnh DPR=2.

```text
screenshots/
├── 01_option_a_desktop_1440x900.png
├── 02_option_b_desktop_1440x900.png
├── 03_candidate_desktop_1440x900.png
├── 04_candidate_tablet_768x1024.png
├── 05_candidate_mobile_390x844.png
├── 06_candidate_t01_detail_desktop.png
├── 07_candidate_t01_detail_mobile.png
├── 08_candidate_image_failure_mobile.png
├── 09_candidate_icon_family.png
└── 10_candidate_asset_disclosure.png
```

Yêu cầu:

- Screenshot phải có SHA-256 trong `SCREENSHOT_MANIFEST.json`.
- Full-page và viewport screenshot phải được ghi rõ, không nhập nhằng.
- Ảnh phải chụp từ đúng file final tương ứng.
- Không chỉnh sửa screenshot sau khi chụp, ngoài crop được khai báo trong manifest; mặc định không crop.
- Screenshot chỉ chứng minh trạng thái nhìn thấy, không chứng minh accessibility hoặc provenance.

---

## 19. Cấu trúc gói nộp

```text
design_training_012_submission_r01.zip
├── DESIGN_TRAINING_MODULE_012_DIRECTIVE.md
├── BRAND_THESIS.md
├── REFERENCE_BOARD.md
├── IMAGE_LANGUAGE_MATRIX.md
├── BRAND_IMAGE_CONTRACT.yaml
├── ASSET_MANIFEST.yaml
├── CHANGE_LEDGER.md
├── TEST_MATRIX_DRAFT.md
├── directions/
│   ├── option_a/index.html
│   └── option_b/index.html
├── candidate/
│   ├── pre_critique.html
│   └── index.html
├── assets/
│   ├── images/
│   ├── icons/
│   ├── diagrams/
│   └── textures/
├── verify_module_012.js
├── VERIFICATION.json
├── SCREENSHOT_MANIFEST.json
├── DESIGN_TRAINING_012_REPORT.md
└── screenshots/
    └── 10 authoritative PNG files
```

ZIP phải:

- dùng dấu `/`;
- không chứa `.git`, `node_modules`, cache, temp, browser profile hoặc file ngoài phạm vi;
- không chứa source của Stream A;
- không chứa path tuyệt đối;
- ghi chính xác filename, byte size và SHA-256 trong submission message.

---

## 20. Report bắt buộc

`DESIGN_TRAINING_012_REPORT.md` phải gồm đúng các phần:

1. Executive summary;
2. Source snapshot và integrity;
3. Canonical brief/data;
4. Brand thesis;
5. Reference analysis;
6. Direction A;
7. Direction B;
8. Seven-axis divergence matrix;
9. Image Language Matrix summary;
10. Asset provenance summary;
11. Selection rubric và quyết định;
12. Final candidate mapping;
13. Responsive crop evidence;
14. Accessibility/fallback evidence;
15. Critique taxonomy, hypothesis và diff;
16. T01–T14 result table;
17. B01–B08 self-assessment;
18. Known limitations;
19. Package manifest;
20. Self-verdict.

Ngôn ngữ bắt buộc:

- `DESIGN_INTENT` cho mục tiêu chưa kiểm chứng với người dùng;
- `MEASURED` cho số liệu được script/runtime đo;
- `VISUAL_REVIEW` cho phán đoán bằng quan sát;
- `EXERCISE_SUPPORTED` cho kết luận của bài tập;
- `USER_RESEARCH` chỉ khi có người dùng thật, protocol và raw record hợp lệ.

Không dùng “user-tested”, “proven”, “tăng hiệu quả”, “nhận ra nhanh hơn” nếu không có nghiên cứu tương ứng.

---

## 21. Acceptance decision

Controller Stream B sẽ ban hành một trong ba phán quyết:

```yaml
PASS:
  module_completed: true
  next_module: eligible_for_issuance

REPAIR_REQUIRED:
  module_completed: false
  repair_round: 1_or_2

FAIL_CLOSED:
  module_completed: false
  repair_budget: closed
  escalation: Lead_Architect
```

Điều kiện PASS:

- B01–B08 đều PASS;
- T01–T14 đều PASS;
- rubric ≥80/100;
- Controller xác nhận chất lượng thị giác, không chỉ harness;
- không có finding nghiêm trọng về provenance, tính trung thực hoặc cô lập stream.

---

## 22. Anti-doom-loop policy

```yaml
max_repair_rounds: 2
scope_per_round: blockers_only
visual_rewrite_after_selection: forbidden_unless_controller_orders
new_features_during_repair: forbidden
test_redefinition_to_make_pass: forbidden
```

Mỗi vòng sửa phải:

1. ánh xạ finding → root cause;
2. sửa tối thiểu cần thiết;
3. giữ nguyên phần đã PASS;
4. chạy targeted verification trước full suite;
5. công khai open risks;
6. không tự mở vòng thứ ba.

---

## 23. Phản hồi đầu tiên bắt buộc từ Antigravity

Trước khi triển khai final candidate, Antigravity gửi Controller một **Checkpoint 12.1** gồm:

```yaml
submission_type: DESIGN_TRAINING_012_CHECKPOINT_12_1
stream_id: B
workspace: design-training/stream-b/module-012/
source_snapshot_sha256: "..."
brand_thesis_draft:
  audience: "..."
  promise: "..."
  personality: ["...", "...", "...", "..."]
  anti_personality: ["...", "...", "...", "..."]
direction_a:
  name: "..."
  strategy: "..."
  five_axis_summary: "..."
direction_b:
  name: "..."
  strategy: "..."
  five_axis_summary: "..."
image_language_roles:
  - hero_context
  - operational_scene
  - route_diagram
  - fictional_person
  - icon_family
  - texture_accent
asset_acquisition_plan: "..."
test_matrix_draft_path: "..."
open_questions: []
```

Kèm theo:

- `BRAND_THESIS.md`;
- `REFERENCE_BOARD.md`;
- `IMAGE_LANGUAGE_MATRIX.md`;
- `TEST_MATRIX_DRAFT.md`.

Checkpoint 12.1 là **reasoning gate**, chưa phải submission R01. Anti được phép nghiên cứu, tạo reference analysis và dựng skeleton; chưa khóa final candidate trước phản hồi của Controller.

---

## 24. Lệnh kích hoạt

```yaml
ANTI_DIRECTIVE:
  authorization: START_NOW
  stream_id: B
  task: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
  allowed_phase:
    - PHASE_0_INTEGRITY_SETUP
    - PHASE_1_BRAND_REASONING
    - PHASE_2_DIRECTION_SKELETON
  first_gate: CHECKPOINT_12_1
  module_013: LOCKED
  cross_stream_write: FORBIDDEN
```

Antigravity Tab B: xác nhận directive, tạo workspace và bắt đầu Checkpoint 12.1. Không hỏi lại những thông tin đã khóa trong tài liệu này. Chỉ chuyển cấp nếu thiếu source PASS của Module 07 hoặc gặp xung đột workspace thực tế.

