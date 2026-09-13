# Design Foundation Research: Typography + Layout Intelligence

> Tổng hợp tri thức kiến trúc từ 10 kho mã nguồn mở hàng đầu thế giới (Tier A: Utopia Core, Every Layout, Capsize, Open Props; Tier B: Pollen, Carbon Design System, Remarque, WebTypography, Fontsource, Radix Themes).
> **Nguyên tắc cốt tử**: Không sao chép style bề mặt. Bóc tách quy luật toán học, cơ chế thị giác và chuyển hóa thành hệ thống quy tắc có thể kiểm chứng (`Testable Design Rules`).

---

## 1. Trả Lời 8 Câu Hỏi Kiến Trúc Cốt Lõi (The 8 Core Architectural Questions)

### Câu hỏi 1: Typography scale được hình thành như thế nào?
* **Nguồn tham chiếu**: Utopia Core, WebTypography, Pollen, Carbon.
* **Bản chất kiến trúc**: Typography scale không phải là tập hợp các con số ngẫu nhiên (`14px, 16px, 20px, 35px`), mà được hình thành dựa trên **Tỉ Lệ Toán Học Mô-đun (`Modular Scale Ratio - r`)** bắt đầu từ một bước chuẩn (`Base Font Size - f0`, thường là `1rem = 16px`):
  $$f_n = f_0 	imes r^n \quad (n \in \{-2, -1, 0, 1, 2, 3, 4, 5\})$$
* **Sự khác biệt giữa Mobile và Desktop**:
  - Trên màn hình hẹp (Mobile), trường nhìn (`Viewport`) nhỏ, tỉ lệ bước nhảy cần hẹp hơn để tránh vỡ chữ: dùng **Minor Third (1.200)** hoặc **Major Second (1.125)**.
  - Trên màn hình rộng (Desktop), khoảng cách mắt nhìn xa hơn và không gian rộng hơn: dùng **Major Third (1.250)** hoặc **Perfect Fourth (1.333)**, hay **Augmented Fourth (1.414)** cho tiêu đề áp phích.
* **Quy luật hình thành**: Bắt buộc mọi cấp bậc hiển thị (`Display, H1, H2, H3, Body, Caption`) phải là một nấc (`Step`) trong chuỗi số mô-đun đã khóa trước, loại bỏ 100% các giá trị font-size tùy tiện.

---

### Câu hỏi 2: Spacing scale liên kết với typography như thế nào?
* **Nguồn tham chiếu**: Utopia Core, Open Props, Carbon 2x Grid.
* **Bản chất kiến trúc**: Khoảng trắng (`Spacing`) không tồn tại độc lập mà là **khoảng đệm thở của con chữ**.
* **Mối liên kết hữu cơ**:
  - Đơn vị cơ sở (`Base Space Unit - s0`) luôn đồng bộ với chiều cao dòng cơ bản (`Base Line-Height`) hoặc nửa bước dòng (`Half-Leading`).
  - Khi kích thước chữ co giãn linh hoạt theo viewport (`Fluid Typography`), khoảng cách padding và gap giữa các khối cũng co giãn tương ứng theo cặp bước Utopia:
    $$	ext{space-s-m} = 	ext{clamp}(	ext{min\_space}, \; 	ext{preferred\_space}, \; 	ext{max\_space})$$
  - Khoảng cách giữa các đoạn văn bản liền kề (`Paragraph Gap`) luôn tỉ lệ thuận với `line-height` của đoạn văn đó (thường bằng `0.75em - 1.25em`). Khoảng cách giữa tiêu đề và đoạn văn sau nó phải nhỏ hơn khoảng cách từ đoạn văn trước tới tiêu đề đó (Áp dụng **Quy luật Gần gũi - Law of Proximity** của Gestalt).

---

### Câu hỏi 3: Khi nào dùng Fluid Sizing? Khi nào cần Breakpoint?
* **Nguồn tham chiếu**: Utopia Core, Every Layout.
* **Quy tắc vàng phân định**:
  - **DÙNG FLUID SIZING CHO KÍCH THƯỚC PHẦN TỬ VÀ KHOẢNG TRẮNG (`Sizing & Spacing`)**:
    - `font-size`, `line-height`, `gap`, `padding`, `margin` **mặc định 100% dùng fluid scale** qua hàm CSS `clamp(min, calc(...), max)`. Điều này giúp giao diện chuyển tiếp mượt mà trên mọi độ phân giải từ iPhone SE (320px) đến UltraWide (2560px) mà không bị giật nấc.
  - **DÙNG BREAKPOINT CHO THAY ĐỔI CẤU TRÚC BỐ CỤC (`Layout Topology Shifting`)**:
    - Breakpoint **CHỈ ĐƯỢC PHÉP DÙNG** khi cấu trúc không gian thay đổi bản chất: ví dụ từ dạng hàng ngang (`Row`) sang cột dọc (`Column`), hoặc khi một thanh Sidebar cần ẩn vào Navigation Drawer.
    - Tuyệt đối không dùng `@media (min-width: 768px)` chỉ để đổi `font-size: 16px` thành `24px` (đây là anti-pattern; hãy để `clamp()` tự tính toán).

---

### Câu hỏi 4: Những primitive layout nào có thể tái sử dụng?
* **Nguồn tham chiếu**: Every Layout (Heydon Pickering & Andy Bell).
* **Hệ thống 8 Khối Bố Cục Nguyên Bản (`Layout Primitives`)**:
  1. **`Stack`**: Bố cục xếp chồng dọc, giải quyết dòng chảy nội dung với `gap` hoặc selector `* + *`, triệt tiêu margin sụp đổ.
  2. **`Cluster`**: Bố cục gom cụm ngang linh hoạt tự xuống dòng (Tag list, Button group, Metadata chip) với `flex-wrap: wrap; gap: var(--space)`.
  3. **`Sidebar`**: Bố cục chia đôi bất đối xứng (1 cột cố định min/max width, 1 cột co giãn lấp đầy không gian), tự động rớt dòng khi container hẹp.
  4. **`Switcher`**: Tự động chuyển đổi từ hàng ngang sang cột dọc khi kích thước container rơi xuống dưới một ngưỡng (`threshold`) mà không cần Media Query.
  5. **`Cover`**: Khung bao toàn màn hình hoặc toàn card, ghim phần tử chính vào tâm và đẩy header/footer ra hai đầu (`min-block-size: 100vh; flex-direction: column`).
  6. **`Center`**: Khung căn giữa trang theo trục ngang với độ rộng giới hạn `max-inline-size: var(--measure)` và padding biên tự nhiên.
  7. **`Grid` (Auto-fit/Auto-fill)**: Lưới tự thích ứng số cột dựa trên độ rộng tối thiểu của thẻ con: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`.
  8. **`Frame`**: Khung giữ tỉ lệ cố định cho hình ảnh/video (`aspect-ratio: 16/9`), chống hiện tượng giật giật layout (`CLS - Cumulative Layout Shift`).

---

### Câu hỏi 5: Grid và Content Width được xác định theo logic nào?
* **Nguồn tham chiếu**: Remarque, WebTypography, Carbon Design System.
* **Logic xác định độ rộng dòng đọc (`The Measure / Line Length`)**:
  - Mắt người đọc thoải mái nhất khi một dòng văn bản chứa từ **45 đến 75 ký tự** (lý tưởng là **65 ký tự** bao gồm cả khoảng trắng).
  - Quy đổi CSS: `max-inline-size: 65ch` hoặc `max-width: 42rem - 48rem` cho khối văn bản đọc hiểu.
  - Vượt quá 80ch sẽ gây mỏi mắt khi chuyển dòng; ngắn hơn 40ch sẽ làm đứt gãy luồng tư duy.
* **Logic xác định độ rộng trang (`Page Grid Constraints`)**:
  - `Content Width (Độ rộng nội dung đọc)`: Giới hạn nghiêm ngặt ở `65ch - 75ch`.
  - `Container Width (Độ rộng khung chứa ứng dụng)`: Cố định theo các cấp bậc ngữ nghĩa: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1440px`.
  - `Bleed / Breakout Width`: Dành riêng cho hình ảnh toàn cảnh, bảng dữ liệu lớn hoặc Canvas 3D mở rộng vượt ra ngoài khung đọc chuẩn.

---

### Câu hỏi 6: Làm sao giữ Vertical Rhythm (Nhịp điệu chiều dọc)?
* **Nguồn tham chiếu**: Capsize, WebTypography.
* **Bản chất vấn đề**: Các phông chữ trên web luôn có khoảng đệm vô hình phía trên chiều cao chữ hoa (`Cap Height`) và phía dưới đường gióng (`Baseline`), khiến việc đặt `margin/padding` bằng pixel không bao giờ thẳng hàng thật với hình ảnh hay đường kẻ cạnh bên.
* **Giải pháp chuẩn hóa**:
  1. Sử dụng công cụ **Capsize** để triệt tiêu phần thừa (`Trim Font Leading`), căn mép đỉnh chữ và chân chữ chuẩn xác đến từng sub-pixel.
  2. Toàn bộ `line-height`, khoảng cách margin dọc của tiêu đề, đoạn văn và blockQuote phải là bội số của một nhịp chuẩn (`Base Rhythm Unit`, ví dụ 4px hoặc 8px).
  3. Tiêu đề luôn có `margin-top` lớn hơn `margin-bottom` (tỉ lệ 2:1 hoặc 3:1) để thị giác nhận biết tiêu đề thuộc về đoạn văn bên dưới chứ không lơ lửng giữa chừng.

---

### Câu hỏi 7: Làm sao tránh layout mang cảm giác "AI / Generic Template"?
* **Nguồn tham chiếu**: Editorial Design, Remarque, Open Props.
* **Quy luật triệt tiêu dấu vết AI Template**:
  1. **Phá vỡ tính đối xứng tuyệt đối**: Đưa vào tỉ lệ bất đối xứng có chủ đích (ví dụ tỉ lệ vàng 62/38 thay vì 50/50 đều đặn).
  2. **Cắt đứt thói quen "Hero + 3 Card đồng dạng"**: Thay các thẻ Card hộp kín bằng danh sách typographic tối giản, phân chia bằng đường kẻ mảnh hoặc khoảng trắng âm.
  3. **Không lạm dụng Bento Grid vô tội vạ**: Chỉ dùng Bento Grid khi các khối dữ liệu thực sự có mức độ ưu tiên thông tin và hình thái khác nhau (1 khối to chứa biểu đồ, 2 khối nhỏ chứa chỉ số).
  4. **Cấm kỵ gradient màu tím/xanh AI mặc định**: Áp dụng triết lý màu sáng độc bản (`Light Theme Invariant`), tôn vinh màu giấy (`Warm Paper`), màu kem ngà (`Ivory`), tương phản typographic sắc nét.
  5. **Typography mang cá tính mạnh mẽ**: Kết hợp font Serif cổ điển với Sans-serif hình học hiện đại hoặc Monospace kỹ thuật, không mặc định dùng Inter cho mọi nơi.

---

### Câu hỏi 8: Phân loại Font theo Bản sắc Thương hiệu (`Fontsource Taxonomy`)
* **Nguồn tham chiếu**: Fontsource.
* **Phân loại ứng dụng theo Art Direction**:
  - **Grotesk / Neo-Grotesk** (Inter, Roboto, Space Grotesk): Khách quan, hiện đại, trung tính, công nghệ cao.
  - **Geometric Sans** (Plus Jakarta Sans, Outfit, Montserrat): Tươi mới, startup, thân thiện, kiến trúc.
  - **Humanist Sans** (Fira Sans, Cabin, Open Sans): Ấm áp, gần gũi, đọc sách dài.
  - **Transitional / Editorial Serif** (Newsreader, Playfair, Lora, Fraunces): Tạp chí cao cấp, thanh lịch, di sản, nghệ thuật.
  - **Monospace** (JetBrains Mono, Fira Code, Space Mono): Kỹ thuật, lập trình, dữ liệu tài chính chính xác.
  - **Display / Expressive** (Syne, Clash Display, Cabinet Grotesk): Tiêu đề dấu ấn, thời trang, phá cách.
