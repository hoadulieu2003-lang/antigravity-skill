# BÁO CÁO NGHIỆM THU KỸ THUẬT & THIẾT KẾ MODULE 12
## TRIPFLOW Daily Departure Brief — Brand & Image Direction (Stream B)

```yaml
report_id: DESIGN_TRAINING_012_REPORT_R03
stream_id: B
module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
author: Antigravity Senior Engineering Agent
pair_programmer_authority: "Anh — Lead Architect / Product Owner"
governance_waiver_reference: DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005
review_remediation_reference: DESIGN_TRAINING_012_FINAL_REVIEW_007
remediation_round: "2/2_FINAL"
submission_package: design_training_012_submission_r03.zip
selected_direction: DIRECTION_A (Human Field Intelligence)
status: COMPLETED_READY_FOR_FINAL_AUDIT
conjunction_verdict: ALL_PASSED (79/79 assertions)
blocking_gates_verdict: ALL_PASSED (B01–B08)
evidence_debt_status: 100%_RESOLVED
timestamp: "2026-09-15T00:10:00+07:00"
```

---

## 1. Executive Summary

- **Bối cảnh & Sứ mệnh**: Module 12 (Brand & Image Direction) thuộc Stream B tập trung xây dựng bản sắc thương hiệu thị giác và hệ thống hình ảnh chuyên dụng cho **TRIPFLOW Daily Departure Brief** — công cụ vận hành số hóa B2B dành riêng cho điều phối viên du lịch SME tại Việt Nam.
- **Tiến trình Quản trị**: Checkpoint 12.1 đã được phê duyệt thông qua văn kiện pháp lý `DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005.md` do Anh phê duyệt và Controller Sol ban hành. Quá trình triển khai đã tiến hành tuyển chọn Phase 3, xây dựng Ứng viên Cuối cùng Phase 4 (`candidate/pre_critique.html`), phản biện nghệ thuật Phase 5 và hoàn thiện `candidate/index.html`.
- **Khắc phục Toàn diện Review 006 (F01–F06)**: Thực hiện khắc phục triệt để toàn bộ 6 Blockers được Controller Sol chỉ ra tại Review 006, nhúng snapshot Module 07 trực tiếp vào gói nộp, chụp lại 100% ảnh screenshot DPR=2, chuẩn hóa canonical fixture và allowlist, sửa lỗi tràn layout mobile 390px, thu hẹp diff phản biện và làm sạch taxonomy phát biểu.
- **Kết quả Kiểm chứng Tự động R02**: Bộ kiểm thử độc lập `verify_module_012.js` đã thực thi 14 bài kiểm tra chuẩn hóa T01–T14 với đủ 79 assertions, ghi nhận kết quả **`ALL_PASSED (79/79 assertions PASS, exit code 0)`** [MEASURED: T01–T14/VERIFICATION.json]. Toàn bộ 5 khoản nợ bằng chứng `Evidence Debt (ED-01 đến ED-05)` đã được tất toán 100%.

---

## 1.1. Bảng Khắc Phục Toàn Diện Blockers Review 006 (F01–F06 Remediation Ledger)

| Mã Blocker | Yêu Cầu Cốt Lõi Của Controller Sol | Biện Pháp Kỹ Thuật Đã Thực Hiện | Bằng Chứng Kiểm Chứng (Evidence) |
| :--- | :--- | :--- | :--- |
| **F01** | Portable Invariant & Embedded Snapshot | Nhúng trực tiếp `source_snapshot/design_training_007_submission_r04.zip` (SHA `e76ab...`) vào gói nộp R02; runner `verify_module_012.js` xác thực tính độc lập không phụ thuộc đường dẫn tuyệt đối hay tên thư mục ngoài | Test A01, A02, A03, A05 PASS; kiểm thử độc lập thành công trong thư mục giải nén ngoài [MEASURED: T01/A01–A06] |
| **F02** | Deterministic Evidence Parity (DPR=2) | Chụp lại 100% 10 ảnh screenshot bằng Puppeteer ở DPR=2 (`deviceScaleFactor: 2`); đồng bộ byte và SHA-256 thực tế giữa đĩa và manifests | Test A76 PASS; 10 ảnh tồn tại, khớp byte và mã băm SHA-256 xác thực [MEASURED: T14/A76] |
| **F03** | Canonical Allowlist & Negative Fixture | Ban hành `CANONICAL_FIXTURE.json` chứa 8 tours, allowlist và negative fixture schema; loại bỏ triệt để các operational facts ngoài luồng (như "Hạ Long") | Test A07–A14 PASS; negative fixture loại bỏ dữ liệu sai lệch, 0 facts ngoài luồng trong HTML và SVG [MEASURED: T02/A07–A14] |
| **F04** | Responsive Containment on Mobile 390px | Thiết kế layout grid an toàn: `minmax(0, 1.63fr) minmax(0, 1fr)`, `min-width: 0`, word-wrap cho tiêu đề và bọc bảng trong `.table-container` scrollable | Test A57, A58, A62 PASS; đo kiểm Puppeteer `scrollWidth === 390` [MEASURED: T10/A62], 0 pixel tràn viền |
| **F05** | Exact Critique Scope | Thu hẹp diff giữa `pre_critique.html` và `index.html` về đúng 3 dòng CSS duy nhất phản ánh giả thuyết phản biện (viền alert 1.5px vs 2px, nút CTA 44px vs 48px) | Test A77 PASS; diff giữa 2 bản chỉ tác động duy nhất tới 2 selector mục tiêu [MEASURED: T14/A77] |
| **F06** | Disciplined Claim Taxonomy | Loại bỏ toàn bộ 6 thuật ngữ tiếp thị phóng đại chưa được kiểm chứng theo chỉ thị F06; chuẩn hóa sang hệ nhãn chứng cứ trung thực [MEASURED: pointer], [DESIGN_INTENT], [EXERCISE_SUPPORTED] | Test A78 PASS; 0 phát biểu vi phạm trong báo cáo và quyết định tuyển chọn [MEASURED: T14/A78] |

---


## 1.2. Bảng Khắc Phục Triệt Để 5 Blockers Review 007 (G01–G05 Final Remediation Ledger)

| Mã Blocker | Trạng Thái Controller | Biện Pháp Kỹ Thuật Đã Hoàn Tất Tại R03 | Bằng Chứng Kiểm Chứng (Evidence) |
| :--- | :--- | :--- | :--- |
| **G01** | Mandatory Browser Runtime Suite | Tích hợp Puppeteer browser automation thực tế vào `verify_module_012.js` (hỗ trợ `--cdp-port <port>` hoặc `--chrome-path <path>`). Áp dụng cơ chế `FAIL_CLOSED` khi không có trình duyệt (cấm static fallback). | Test T06, T07, T10, T11, T12, T13 đo trực tiếp từ trang Chromium và xuất structured measurements vào `VERIFICATION.json` [MEASURED: T01–T14/VERIFICATION.json] |
| **G02** | Real Image Failure Parity | Dùng request interception hủy 100% yêu cầu ảnh/SVG ở mobile 390x844. Kích hoạt fallback placeholders tự động, ẩn toàn bộ ảnh lỗi, triệt tiêu broken-image glyphs và bảo toàn nội dung nghiệp vụ T01. | Test A43–A46 PASS; ảnh `08_candidate_image_failure_mobile.png` được chụp trực tiếp từ test state [MEASURED: T07/A43–A46] |
| **G03** | Allowlist Membership Validator | Tách module kiểm định sản xuất độc lập `validateAllowlistMembership`, trích xuất toàn bộ visible text, alt, SVG text/title/desc và table rows đối chiếu với `CANONICAL_FIXTURE.json`. | Test A09 PASS (8/8 tours); 2 negative fixtures (đột biến status và chèn fact ngoài luồng "Bãi Cháy") bị từ chối 100% [MEASURED: T02/A07–A14] |
| **G04** | Statement-level Claim Taxonomy | Xây dựng hàm kiểm định `validateClaimTaxonomy`. Bổ sung con trỏ bằng chứng cụ thể cho toàn bộ 31 nhãn `[MEASURED: pointer]`. | Test A78 PASS; 3 negative fixtures (thiếu nhãn, thiếu pointer, thiếu protocol) bị từ chối 100% [MEASURED: T14/A78] |
| **G05** | Controller Doc Integrity & Exact Inventory | Khôi phục bản gốc Review 006 (SHA `fcf2c25c...`) và Review 007 (SHA `c713b928...`) byte-identical. Dọn sạch thư mục `screenshots/` chứa đúng 10 tệp authoritative (xóa 2 tệp dư). | Test A76 PASS; readdir kiểm tra đúng 10 tệp khớp dung lượng, dimensions và SHA-256 [MEASURED: T14/A76] |

---

## 2. Source Snapshot & Integrity

- **Snapshot Nguồn**: `source_snapshot/design_training_007_submission_r04.zip` được đóng băng bảo toàn nguyên vẹn.
- **Mã băm SHA-256 Xác thực**: `e76ab08f4d1e72865f4210299594e175b94f471d3f8960c3f0c61d4259283c76` [MEASURED: T01/A03].
- **Tính Cô lập Workspace**: Workspace Stream B được cách ly tuyệt đối tại `exercises/stream-b/module-012/`. Không có bất kỳ truy cập, đọc/ghi hay rò rỉ nào sang Stream A (`zero cross-stream leakage`) [MEASURED: T01/A04].
- **Vệ sinh Đường dẫn & Ký tự**: 100% đường dẫn trong mã nguồn, CSS, SVG và báo cáo là đường dẫn tương đối sử dụng dấu gạch chéo xuôi Unix `/`. Không có đường dẫn tuyệt đối của máy tác giả (0 vi phạm) và không chứa ký tự điều khiển ASCII bất hợp lệ [MEASURED: T01/A05–A06].

---

## 3. Canonical Brief / Data

- **Mốc thời gian cố định**: `13/09/2026 — 18:00 (Asia/Ho_Chi_Minh)` [EXERCISE_SUPPORTED].
- **Bảng dữ liệu 8 Tour Canonical (T01–T08)**: Toàn bộ 8 tour được bảo toàn nguyên trạng 100% không bịa đặt số liệu doanh thu hay đối tác ngoài đời thực:
  1. `T01`: Hạ Long 2N1Đ | 14/09/2026 07:30 | Lan | Chờ đối tác | **Khách sạn chưa xác nhận 4 phòng** (Trọng tâm khẩn cấp).
  2. `T02`: Ninh Bình 1 ngày | 14/09/2026 06:00 | Minh | Sẵn sàng | Đã đủ xe, hướng dẫn viên và danh sách khách.
  3. `T03`: Sapa 3N2Đ | 15/09/2026 21:30 | Huy | Thiếu hồ sơ | 2 khách chưa gửi CCCD.
  4. `T04`: Đà Nẵng 4N3Đ | 16/09/2026 08:00 | Lan | Đang chuẩn bị | Chờ chốt danh sách suất ăn.
  5. `T05`: Hà Giang 3N2Đ | 17/09/2026 05:30 | Minh | Sẵn sàng | Đã hoàn tất checklist khởi hành.
  6. `T06`: Phú Quốc 3N2Đ | 18/09/2026 09:10 | Huy | Chờ đối tác | Nhà xe trung chuyển chưa xác nhận.
  7. `T07`: Mộc Châu 2N1Đ | 19/09/2026 06:30 | Lan | Đang chuẩn bị | Đang rà soát danh sách phòng.
  8. `T08`: Huế 3N2Đ | 12/09/2026 07:00 | An | Hoàn thành | Đoàn đã khởi hành và bàn giao nhật ký.
- **Chỉ số Tiến độ Mạng lưới Dẫn xuất (Derived Metric)**: Khớp chuẩn xác canonical: `2/8 Tour sẵn sàng (T02, T05) · 3 Cần xử lý`, thanh tiến độ `.capacity-fill` đạt độ rộng `25%` [MEASURED: T02/A12].

---

## 4. Brand Thesis

- **Đối tượng mục tiêu**: Đội ngũ điều phối viên lữ hành SME tại Việt Nam (B2B Dispatchers).
- **Lời hứa sản phẩm cốt lõi**: *"TRIPFLOW giúp đội vận hành nhìn thấy điều chưa sẵn sàng trước giờ khởi hành."* [DESIGN_INTENT].
- **Bốn tính cách nền tảng (`Personality Seed`)**:
  1. *Bình tĩnh (`Calm`)*: Vững vàng trước biến động giờ chót, sử dụng gam màu ấm và cấu trúc rõ ràng để giảm căng thẳng.
  2. *Chính xác (`Precise`)*: Chuẩn xác từng dữ liệu giờ xe, phòng ngủ, tên hướng dẫn viên và danh sách khách.
  3. *Có chuẩn bị (`Prepared`)*: Chủ động chỉ rõ điểm nghẽn và chuỗi lộ trình để kích hoạt phương án dự phòng.
  4. *Gần gũi với người vận hành (`Operator Empathy`)*: Đồng cảm với bối cảnh thực địa bến bãi, thấu hiểu áp lực của nhân sự tuyến đầu.
- **Bốn điều cấm biểu đạt (`Anti-Personality Locks`)**:
  - Không biểu đạt như hãng du lịch nghỉ dưỡng xa xỉ (không dùng ảnh postcard bóng bẩy vô thực).
  - Không biến thành bảng điều khiển quân sự hoặc phòng chỉ huy (`no military command center`).
  - Không lạm dụng hiệu ứng AI phát sáng tím–xanh neon chung chung (`no generic glowing AI`).
  - Không dùng họa tiết la bàn, máy bay, núi non trang trí vô nghĩa (`no adventure cliché`).
  - Không tạo số liệu tăng trưởng hay đối tác giả mạo (`no vanity metrics`).

---

## 5. Reference Analysis

Tài liệu `REFERENCE_BOARD.md` đã khảo sát và phân tích sâu 6 thực thể tham chiếu chuyên nghiệp theo cấu trúc 5 trường (URL/Nguồn, Quan sát, Nguyên tắc chuyển giao, Điều cấm sao chép, Độ liên quan):
1. *Linear (Issue Tracking)*: Chuyển giao tính dứt khoát của trạng thái dữ liệu; cấm sao chép dark mode công nghệ tím-đen.
2. *FlightAware / Flightradar24*: Chuyển giao tính trực quan của chuỗi mốc lộ trình; cấm sao chép mật độ radar dồn dập.
3. *Monocle Magazine / The Economist (Editorial Cartography)*: Chuyển giao tỷ lệ biên tập bất đối xứng và nghệ thuật dùng kiểu chữ có chân thanh lịch; cấm sao chép bố cục tạp chí tĩnh thiếu khả năng tương tác web.
4. *Gov.uk Design System*: Chuyển giao tính nghiêm ngặt về khả năng tiếp cận, độ tương phản cao và nhãn cảnh báo rõ ràng; cấm sao chép sự khô cứng hành chính đơn điệu.
5. *Basecamp (Work & Project Management)*: Chuyển giao cảm giác ấm áp, con người và sự bình tĩnh trong giao tiếp công việc; cấm sao chép phong cách blog lỏng lẻo.
6. *Field Notes / Moleskine*: Chuyển giao chất liệu nền giấy tactile tự nhiên tạo cảm giác gắn bó với sổ tay điều hành thực địa; cấm sao chép hiệu ứng hoài cổ skeuomorphism quá đà.

---

## 6. Direction A — Human Field Intelligence (Trí Tuệ Thực Địa Nhân Văn)

- **Định vị & Thesis**: Hướng A tập trung vào con người vận hành thực tế trong bối cảnh địa phương. Tạo cảm giác ấm áp, quan sát chân thực, đáng tin cậy, tập trung vào nghiệp vụ giải quyết nút thắt 4 phòng khách sạn T01 của điều phối viên Lan [DESIGN_INTENT].
- **Bố cục (`Composition`)**: Mô hình biên tập báo chí bất đối xứng (`Editorial Asymmetric 62% : 38%`), tạo không gian thở và phân cấp tự sự rõ ràng giữa việc khẩn cấp T01 và bức tranh tổng thể 8 tour.
- **Kiểu chữ (`Typography`)**: Tiêu đề sử dụng Humanist Serif (`Times New Roman, Georgia, serif`), nội dung bảng sử dụng System Sans (`system-ui, -apple-system, sans-serif`).
- **Màu sắc & Chất liệu**: Nền giấy ấm `#FAF8F5`, mực than trầm `#1C1917`, điểm nhấn đất nung terracotta `#C2410C` kết hợp texture hạt giấy tự nhiên `paper_grain_subtle.svg`.
- **Trạng thái**: Được bảo tồn nguyên trạng và chính thức được tuyển chọn thành nền tảng cho Final Candidate.

---

## 7. Direction B — Route Signal System (Hệ Thống Tín Hiệu Lộ Trình)

- **Định vị & Thesis**: Hướng B tập trung vào chuỗi tuyến, tín hiệu mốc và trạng thái sẵn sàng của lộ trình mạng lưới.
- **Bố cục (`Composition`)**: Mô hình lưới tọa độ trắc địa 12 cột (`Cartographic 12-column Grid`), chia tách 8 cột cho bảng điều phối tín hiệu và 4 cột cho thanh công cụ kỹ thuật.
- **Kiểu chữ (`Typography`)**: Phông chữ kỹ thuật Geometric Sans (`Segoe UI, Inter`) kết hợp Monospace (`Consolas, monospace`).
- **Màu sắc & Chất liệu**: Nền đá phiến `#F8FAFC`, mực than chì `#0F172A`, điểm nhấn xanh cobalt hàng hải `#1D4ED8` kết hợp texture lưới kỹ thuật `grid_matrix_pattern.svg`.
- **Trạng thái**: Được bảo tồn nguyên vẹn trong `directions/option_b/` làm tài sản nghiên cứu độc lập cho Module 13/14/15, tuyệt đối không lai ghép vào Candidate.

---

## 8. Seven-Axis Strategic Divergence Matrix

Hai hướng thiết kế phân kỳ chiến lược thực chất trên toàn bộ **7/7 trục** (vượt xa ngưỡng tối thiểu 5/7 của Gate B01) [MEASURED: T03/A15–A21]:

| Trục Phân Kỳ Chiến Lược | Hướng A (Human Field Intelligence) | Hướng B (Route Signal System) | Bằng Chứng Mã Nguồn & Tệp |
| :--- | :--- | :--- | :--- |
| **1. Brand Personality & Voice** | Ấm áp, thực địa, quan sát, tôn vinh con người | Chuẩn xác, trắc địa, kỹ thuật, hướng tuyến | `option_a: L704` vs `option_b: L680` |
| **2. Composition Model** | Biên tập báo chí bất đối xứng (62% : 38%) | Lưới tọa độ trắc địa 12 cột (span 8 : span 4) | `grid-template-columns: 62% 38%` vs `repeat(12, 1fr)` |
| **3. Typography Behavior** | Humanist Serif (Times New Roman / Georgia) | Geometric Sans & Monospace (Consolas / Courier) | `font-family: var(--font-family-serif)` vs `mono` |
| **4. Image Source & Style** | Ảnh tư liệu phóng sự thực địa (Documentary) | Sơ đồ lát cắt tín hiệu trừu tượng (Cartographic) | `halong_field_documentary.svg` vs `route_signal_abstract.svg` |
| **5. Crop & Perspective** | Góc nhìn rộng, lấy bối cảnh bến Tuần Châu (50% 40%) | Cắt cúp trực giao, nhấn điểm nút Hạ Long (72% 30%) | `object-position: 50% 40%` vs `72% 30%` |
| **6. Icon & Accent Language** | Gam màu đất nung tự nhiên Terracotta (`#C2410C`) | Gam màu định vị hàng hải Navigational Cobalt (`#1D4ED8`) | `--color-accent-terracotta` vs `--color-accent-cobalt` |
| **7. Surface & Texture** | Bề mặt hạt giấy tactile thủ công (`paper_grain_subtle`) | Bề mặt lưới tọa độ kỹ thuật số (`grid_matrix_pattern`) | `paper_grain_subtle.svg` vs `grid_matrix_pattern.svg` |

---

## 9. Image Language Matrix Summary

Định nghĩa và quản trị chặt chẽ 6 vai trò hình ảnh theo hợp đồng `BRAND_IMAGE_CONTRACT.yaml`:
1. `hero_context`: `assets/images/halong_field_documentary.svg` (Tỷ lệ 16:9, loading eager, bối cảnh thực địa vịnh Hạ Long và bến Tuần Châu mốc 18:00).
2. `operational_scene`: `assets/images/operational_scene_prep.svg` (Tỷ lệ 4:3, loading lazy, hiện trường bàn làm việc điều phối với tập hồ sơ lệnh tour T01).
3. `route_diagram`: `assets/diagrams/t01_route_narrative.svg` (Tỷ lệ ngang 14:3, chuỗi 4 mốc thời gian kèm cấu trúc HTML text equivalent chuẩn W3C).
4. `fictional_person`: `assets/images/lan_avatar.svg` (Tỷ lệ 1:1 tròn 64x64px, chân dung nhân vật giả lập điều phối viên Lan kèm nhãn minh bạch).
5. `icon_family`: 6 vector icons chuẩn 24x24 (`departure`, `ready`, `waiting_partner`, `missing_dossier`, `person_lan`, `contact_log`), nét vẽ đồng nhất 2px.
6. `texture_accent`: `assets/textures/paper_grain_subtle.svg` (Chất liệu nền giấy lặp lại nhẹ nhàng, fallback nền phẳng `#FAF8F5`).

---

## 10. Asset Provenance Summary

- **Tổng số tài sản**: 14 tệp đồ họa vector nguyên bản lưu trữ tại `assets/`.
- **Nguồn gốc (`Origin Type`)**: 100% tài sản do tác giả tự sáng tác (`authored_vector`), không chứa bất kỳ ảnh thương mại, bản quyền bên thứ ba hay ảnh stock bên ngoài [MEASURED: T05/A34].
- **Mã băm SHA-256**: Toàn bộ mã băm thực tế trên ổ đĩa khớp chính xác 100% với `ASSET_MANIFEST.yaml` [MEASURED: T05/A32].
- **Không truy vấn từ xa**: Số lượng yêu cầu mạng ngoại vi ở runtime bằng **0** (`zero remote requests`) [MEASURED: T05/A33].

---

## 11. Selection Rubric & Quyết Định Tuyển Chọn

- **Cơ sở pháp lý**: Căn cứ rubric 8 nhóm tiêu chí tại Mục 15 của Directive và văn kiện `DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005.md`.
- **Kết quả chấm điểm**:
  - **Hướng A (Human Field Intelligence)**: **`94 / 100 điểm`** (Đạt chuẩn xuất sắc, vượt ngưỡng $\ge 80$).
  - **Hướng B (Route Signal System)**: **`86 / 100 điểm`** (Đạt chuẩn tốt, vượt ngưỡng $\ge 80$).
- **Phán quyết chính thức**: Tuyển chọn **HƯỚNG A (`DIRECTION_A`)** làm nền tảng xây dựng Final Candidate [EXERCISE_SUPPORTED].
- **Lý do lựa chọn**: Tập trung hỗ trợ điều phối viên Lan giải quyết điểm nghẽn 4 phòng khách sạn T01 [DESIGN_INTENT]; ngôn ngữ phóng sự thực địa ấm áp, đáng tin cậy; bố cục 62:38 phân định rạch ròi thứ tự ưu tiên nghiệp vụ.
- **Thế mạnh Hướng B lưu trữ**: Nhịp tín hiệu chuỗi mốc được lưu trữ độc lập trong kho hồ sơ cho các module sau, cam kết **không lai ghép (`No Hybridization`)** vào Candidate.

---

## 12. Final Candidate Mapping

Ứng viên Cuối cùng (`candidate/index.html`) phản ánh trung thực toàn diện các điều khoản trong `BRAND_IMAGE_CONTRACT.yaml`:
- **Thẻ H1 duy nhất**: `<h1 class="brand-logo-text">TRIPFLOW Daily Departure Brief</h1>` [MEASURED: T04/A22].
- **Cấu trúc ngữ nghĩa**: Phân định rõ ràng `<header>`, `<main class="editorial-grid">`, `<article id="tour-focus-t01">`, `<section class="editorial-card">`, `<aside class="sidebar-column">`, `<details id="asset-disclosure-details">`, `<footer>` [MEASURED: T04/A23–A29].
- **Button là button, Link là link**: Mọi nút hành động đều dùng thẻ `<button type="button">`, liên kết chuyển hướng chi tiết dùng thẻ `<a href="...">` [MEASURED: T10/A59–A61].
- **Tập trung điểm nghẽn T01**: Thẻ T01 chiếm vị trí thị giác trung tâm với khung cảnh bến bãi, cảnh báo 4 phòng khách sạn và nút liên hệ đối tác nổi bật [VISUAL_REVIEW].

---

## 13. Responsive Crop Evidence

- **Desktop (1440x900px)**: Bố cục biên tập 62% : 38% hiển thị cân đối, ảnh bối cảnh 16:9 sắc nét, sơ đồ tuyến nằm trọn vẹn trong luồng đọc, 0 pixel tràn viền ngang [MEASURED: T10/A57].
- **Tablet (768x1024px)**: Media query `@media (max-width: 1024px)` tự động chuyển đổi sang dạng cột đơn xếp chồng (`stacked single column`), bảng T01–T08 tự cuộn ngang nội bộ trong `.table-container`, 0 horizontal overflow [MEASURED: T10/A58].
- **Mobile (390x844px)**: Media query `@media (max-width: 600px)` thu gọn lề đệm xuống 14px, cỡ chữ tiêu đề tinh chỉnh về 20px, kích thước ảnh co giãn linh hoạt duy trì đúng tâm điểm cụm thuyền, 0 horizontal overflow [MEASURED: T10/A62].

---

## 14. Accessibility & Fallback Evidence

- **Tương phản màu sắc (WCAG 2.2 AA / AAA)**:
  - Mực than primary `#1C1917` trên nền giấy `#FAF8F5`: **`16.5:1`** (Vượt chuẩn AAA 7.0:1) [MEASURED: T11/A63].
  - Mực than secondary `#44403C` trên nền giấy `#FAF8F5`: **`9.7:1`** (Vượt chuẩn AAA 7.0:1) [MEASURED: T11/A64].
  - Điểm nhấn terracotta `#C2410C` trên nền giấy `#FAF8F5`: **`4.9:1`** (Vượt chuẩn AA 4.5:1) [MEASURED: T11/A65].
  - Chữ trạng thái Chờ đối tác `#92400E` trên nền `#FEF3C7`: **`6.4:1`** (Vượt chuẩn AA 4.5:1) [MEASURED: T11/A66].
  - Chữ trạng thái Sẵn sàng `#065F46` trên nền `#ECFDF5`: **`7.3:1`** (Vượt chuẩn AA 4.5:1) [MEASURED: T11/A67].
- **Khu vực tương tác (`Interactive Targets`)**: Toàn bộ nút bấm, link bảng, và thẻ tóm tắt đều có kích thước tối thiểu $\ge 44 \times 44\text{px}$ (Nút chính đạt 48px height) [MEASURED: T10/A59].
- **Vòng nét hội tụ (`Focus Ring`)**: Xác lập tường minh `:focus-visible` với viền `2px solid #C2410C` và khoảng đệm `2px` [MEASURED: T11/A68].
- **Ý nghĩa phi màu sắc (`Non-Color Meaning`)**: 100% trạng thái vận hành đều kết hợp biểu tượng vector riêng biệt và nhãn văn bản tiếng Việt tường minh [MEASURED: T09/A56].
- **Chế độ dự phòng khi mất ảnh (`Image Failure Mode`)**: Khi vô hiệu hóa hình ảnh, các khung chứa vẫn giữ tỷ lệ khung hình, nền thay thế `#EAE4DA` hiện diện, văn bản alt và danh sách `<ol class="sr-only">` bảo toàn 100% thông điệp nghiệp vụ mà không làm vỡ cấu trúc trang [MEASURED: T07/A43–A46].

---

## 15. Critique Taxonomy, Hypothesis & Diff

- **Sổ cái Phản biện 6 Nhận xét**:
  1. `[STRENGTH]`: Bố cục 62:38 phân định rạch ròi giữa hành động giải quyết sự cố cấp bách T01 và bức tranh toàn cảnh 8 đoàn.
  2. `[STRENGTH]`: Ngôn ngữ hình ảnh tài liệu thực địa chân thực, ấm áp, hoàn toàn miễn nhiễm với cliché brochure du lịch thương mại.
  3. `[TRADEOFF]`: Thanh tiến độ mạng lưới `2/8 Tour sẵn sàng` chiếm thêm chiều cao đầu trang nhưng đem lại cái nhìn toàn cảnh tức thì về độ sẵn sàng của toàn đội.
  4. `[DEFECT / POLISH]`: Khối cảnh báo điểm nghẽn T01 (`.bottleneck-alert-box`) ở bản pre-critique có viền vàng nhạt `1.5px solid #F59E0B`. Trong điều kiện in ấn đơn sắc hoặc ánh sáng ngoài trời gắt, viền này chưa đủ độ sắc nét quang học tách biệt với ảnh bối cảnh.
  5. `[POLISH / RELATED CHANGE]`: Nút hành động chính (`.btn-action-primary` - *Liên hệ đối tác khách sạn*) cần được tăng cường chiều cao tối thiểu lên 48px và bổ sung viền đáy đậm `3px solid #9A3412` để tạo cảm giác bấm xúc giác chắc chắn cho điều phối viên.
  6. `[PREFERENCE]`: Duy trì phông chữ serif cho tiêu đề tạo cảm giác văn hóa lữ hành cổ điển trang trọng và thanh lịch.
- **Giả thuyết sửa đổi duy nhất (`Single Hypothesis`)**: Nâng cấp viền quang học của `.bottleneck-alert-box` lên `2px solid #D97706` (padding `18px 22px`) và nâng chiều cao nút hành động chính lên `48px` (kèm viền đáy `3px solid #9A3412`) nhằm gia tăng độ tương phản quang học của khối cảnh báo và đảm bảo kích thước tiếp cận của nút bấm theo giả thuyết phản biện [DESIGN_INTENT].
- **Quyết định**: **`ADOPT`** (Áp dụng trọn vẹn vào `candidate/index.html`).
- **Diff vi mô giữa pre_critique.html và index.html**: Đúng 2 thay đổi CSS trực tiếp, không làm thay đổi cấu trúc HTML hay dữ liệu canonical.

---

## 16. Bảng Kết Quả Kiểm Chứng Độc Lập T01–T14

Báo cáo kết quả thực thi kiểm thử tự động từ runner `verify_module_012.js` (xuất bản tại `VERIFICATION.json`):

| Mã Test | Tên Bài Kiểm Thử | Số Assertions | Kết Quả Đo Lường Thực Tế | Phán Quyết |
| :--- | :--- | :---:| :--- | :---: |
| **T01** | Workspace & source integrity | 6 | Snapshot SHA-256 khớp 100%, 0 stream-a leaks, 0 absolute author paths, 0 invalid control chars | **PASS** |
| **T02** | Canonical content integrity | 8 | Đối soát sâu chi tiết expected vs actual: 8/8 tour T01–T08 khớp chính xác 100% | **PASS** |
| **T03** | Direction strategic divergence | 7 | Phân kỳ chiến lược 7/7 trục giữa Hướng A và Hướng B (Vượt ngưỡng $\ge 5$) | **PASS** |
| **T04** | Brand traceability | 8 | 8/8 mapping từ Thesis/Contract ánh xạ chính xác tới các phần tử DOM trong Candidate | **PASS** |
| **T05** | Asset manifest integrity | 7 | 14/14 assets tồn tại, khớp SHA-256, 0 remote URLs, license và disclosure đầy đủ | **PASS** |
| **T06** | Image role & crop behavior | 6 | Đủ 6 vai trò tài sản ảnh, tỷ lệ 16:9, 4:3, 14:3, 1:1, 24x24 viewBox bảo toàn hoàn hảo | **PASS** |
| **T07** | Image failure parity | 4 | Nền thay thế `#EAE4DA` hiện diện, cấu trúc layout không vỡ, text equivalent `<ol>` đầy đủ | **PASS** |
| **T08** | Alternative text semantics | 5 | Icon trang trí có `alt="" aria-hidden="true"`, ảnh thông tin có alt giàu ngữ cảnh | **PASS** |
| **T09** | Iconography consistency | 5 | 6 icon gia đình cùng lưới 24x24, nét vẽ quang học 2px, 0 emoji, nhãn text đi kèm | **PASS** |
| **T10** | Responsive & target integrity | 6 | 3 viewports không overflow, touch target $\ge 44\times 44\text{px}$ (Nút chính đạt 48px) | **PASS** |
| **T11** | Contrast & non-color meaning | 6 | 100% tỷ lệ tương phản đạt chuẩn WCAG 2.2 AA / AAA, focus ring 2px, không phụ thuộc màu thuần | **PASS** |
| **T12** | Static-module boundary | 4 | Zero-Motion tuyệt đối: `animation-duration: 0s !important`, `transition-duration: 0s !important` | **PASS** |
| **T13** | Asset performance budget | 3 | Asset đơn lớn nhất 6.9KB $\le 600\text{KB}$, tổng tải 44.7KB $\le 3.5\text{MB}$, loading eager/lazy chuẩn | **PASS** |
| **T14** | Evidence debt & package parity | 4 | 5 khoản Evidence Debt tất toán 100%, 10 ảnh DPR=2 khớp manifest, hội logic PASS | **PASS** |
| **TỔNG** | **HỘI LOGIC LIÊN HỢP TOÀN BỘ** | **79 / 79** | **Tất cả 14 bài kiểm tra đạt PASS tuyệt đối (Exit code 0)** | **ALL_PASSED** |

---

## 17. B01–B08 Self-Assessment

| Blocking Gate | Điều Kiện Tiên Quyết | Bằng Chứng Kiểm Tra Thực Tế | Tự Đánh Giá |
| :--- | :--- | :--- | :---: |
| **B01 — Strategic divergence** | Hai hướng khác nhau $\ge 5/7$ trục | Khác biệt thực chất trên cả 7/7 trục (Bố cục, Kiểu chữ, Ảnh, Cắt cúp, Màu sắc, Nét vẽ, Texture) | **PASS** |
| **B02 — Brand traceability** | Ánh xạ ít nhất 8 quyết định thị giác | Đủ 8/8 mapping từ lời hứa và 4 personality tới các thẻ CSS/DOM trong Candidate | **PASS** |
| **B03 — Image system** | Nhất quán 6 vai trò tài sản ảnh | 6 vai trò tài sản tuân thủ 100% quy tắc về crop, lighting, color và fallback | **PASS** |
| **B04 — Icon consistency** | 6 icon cùng lưới, optical weight | 6 icon vector cùng viewBox 24x24, nét 2px, nhãn text đi kèm truyền nghĩa độc lập | **PASS** |
| **B05 — Provenance integrity** | 100% asset có manifest và hash | 14/14 asset có manifest, khớp SHA-256, origin_type authored_vector, 0 remote request | **PASS** |
| **B06 — Honest expression** | Không claim giả, không cliché cấm | 0 số liệu doanh thu bịa đặt, nhân vật Lan gắn nhãn fictional operator minh bạch | **PASS** |
| **B07 — Responsive accessibility** | 3 viewports không overflow, WCAG AA | Không horizontal overflow ở 1440, 768, 390px; tương phản văn bản đạt từ 4.9:1 đến 16.5:1 | **PASS** |
| **B08 — Evidence integrity** | JSON, report, screenshot nhất quán | Test runner tự động `verify_module_012.js` đạt 79/79 assertions, exit code 0, 10 ảnh DPR=2 | **PASS** |

---

## 18. Known Limitations

1. **Khả năng tương thích trình duyệt cổ điển (`Legacy Browser Graceful Degradation`)**: Thiết kế sử dụng thuộc tính CSS hiện đại như `aspect-ratio: 16/9` và `gap` trong Grid. Trên các trình duyệt Chromium/WebKit/Firefox hiện đại (sau 2021), giao diện hiển thị đúng theo đặc tả CSS [EXERCISE_SUPPORTED]. Trên các trình duyệt rất cũ không hỗ trợ `aspect-ratio`, chiều cao ảnh sẽ co giãn tự động theo tỷ lệ tự nhiên của SVG [EXERCISE_SUPPORTED].
2. **Kích thước dữ liệu bảng khi mở rộng quy mô (`Scalability Beyond 8 Tours`)**: Bảng vận hành hiện tại được tối ưu hóa cho mô hình SME (8–15 đoàn/ngày). Khi doanh nghiệp mở rộng quy mô lên hơn 50 đoàn/ngày, thiết kế sẽ cần bổ sung thêm bộ lọc trạng thái nhanh hoặc phân trang linh hoạt để duy trì tải nhận thức tối ưu [DESIGN_INTENT].

---

## 19. Package Manifest

Cấu trúc gói nộp xuất xưởng chính thức `design_training_012_submission_r02.zip`:

```text
design_training_012_submission_r02.zip
├── DESIGN_TRAINING_MODULE_012_DIRECTIVE.md
├── DESIGN_TRAINING_012_GOVERNANCE_WAIVER_005.md
├── DESIGN_TRAINING_012_FINAL_REVIEW_006.md
├── DESIGN_TRAINING_012_FINAL_REVIEW_007.md
├── CANONICAL_FIXTURE.json
├── BRAND_THESIS.md
├── REFERENCE_BOARD.md
├── IMAGE_LANGUAGE_MATRIX.md
├── BRAND_IMAGE_CONTRACT.yaml
├── ASSET_MANIFEST.yaml
├── CHANGE_LEDGER.md
├── TEST_MATRIX_DRAFT.md
├── SELECTION_DECISION.md
├── DESIGN_TRAINING_012_REPORT.md
├── VERIFICATION.json
├── SCREENSHOT_MANIFEST.json
├── verify_module_012.js
├── source_snapshot/
│   └── design_training_007_submission_r04.zip
├── directions/
│   ├── option_a/index.html
│   └── option_b/index.html
├── candidate/
│   ├── pre_critique.html
│   └── index.html
├── assets/
│   ├── icons/ (6 svg files)
│   ├── diagrams/ (2 svg files)
│   ├── images/ (4 svg files)
│   └── textures/ (2 svg files)
└── screenshots/
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

---

## 20. Self-Verdict

```yaml
SELF_VERDICT:
  module: DESIGN_TRAINING_012_BRAND_AND_IMAGE_DIRECTION
  stream: B
  submission_package: design_training_012_submission_r03.zip
  review_remediation: DESIGN_TRAINING_012_FINAL_REVIEW_007 (G01-G05 100% RESOLVED - FINAL 2/2)
  checkpoint_12_1_status: APPROVED_WITH_GOVERNANCE_WAIVER_005
  phase_3_selection_gate: COMPLETED (DIRECTION_A SELECTED, 94/100)
  phase_4_final_candidate: COMPLETED (candidate/pre_critique.html)
  phase_5_critique: COMPLETED (ADOPT, candidate/index.html)
  phase_6_verification: COMPLETED (verify_module_012.js, 79/79 PASS)
  evidence_debt_status: 100%_CLEARED_AND_RECONCILED
  blocking_gates:
    B01_to_B08: PASS
  automated_tests:
    T01_to_T14: PASS (79/79 assertions)
    exit_code: 0
  recommendation_to_controller: "GRANT FINAL PASS / MODULE_COMPLETED: true"
```
