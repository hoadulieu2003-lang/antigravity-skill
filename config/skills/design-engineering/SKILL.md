---
name: design-engineering
description: "Siêu Kỹ Năng Kỹ Thuật Thiết Kế (Design Engineering) theo triết lý Emil Kowalski. Đóng gói chuẩn mực vi tương tác bấm co lún scale(0.965), đường cong cubic-bezier bứt tốc, lề quang học (optical alignment & margins), lò xo vật lý (spring physics), tối ưu hóa GPU transform/opacity và chuẩn mực Sonner Component."
---

# Design Engineering: Triết Lý Tinh Hoa & Kỹ Thuật Giao Diện Emil Kowalski

> **Tôn chỉ cốt lõi**:  
> Gu thẩm mỹ không phải là năng khiếu trời sinh, mà là bản năng được trui rèn qua quan sát và thực hành khắt khe.  
> Chi tiết vô hình cộng hưởng tạo nên sự kỳ diệu ("A thousand barely audible voices all singing in tune").  
> Vẻ đẹp là đòn bẩy kỹ thuật mang tính sống còn để tạo sự khác biệt vượt trội.

---

## 1. TRIẾT LÝ CỐT LÕI (Core Philosophy)

### 1.1 Gu Thẩm Mỹ Được Trui Rèn (Taste is Trained, Not Innate)
Gu thẩm mỹ tốt (Good Taste) không phải là sở thích cá nhân ngẫu hứng. Đó là một phản xạ được rèn luyện: năng lực nhìn thấu những điều hiển nhiên bề mặt để nhận ra chi tiết nâng tầm sản phẩm. Khi xây dựng giao diện UI, không bao giờ dừng lại ở mức "nó chạy được là xong". Hãy nghiên cứu lý do tại sao những sản phẩm hàng đầu lại mang lại cảm giác mượt mà đến vậy, đảo ngược quy trình (reverse engineer) các hoạt ảnh, soi từng khung hình tương tác và giữ trọn sự tò mò kỹ thuật.

### 1.2 Những Chi Tiết Vô Hình Cộng Hưởng (Unseen Details Compound)
Hầu hết các chi tiết tinh xảo người dùng không bao giờ nhận thức một cách có ý thức. Đó chính là đỉnh cao của thiết kế. Khi một tính năng vận hành trơn tru đúng như trực giác người dùng mong đợi, họ lướt qua một cách tự nhiên mà không cần bận tâm suy nghĩ. Đó là mục tiêu tối thượng. Toàn bộ các quy tắc dưới đây tồn tại vì sự tích lũy của những chuẩn xác vô hình tạo nên một giao diện người dùng yêu thích say đắm mà không thể lý giải bằng lời.

### 1.3 Vẻ Đẹp Là Đòn Bẩy Kỹ Thuật (Beauty is Leverage)
Người dùng lựa chọn công cụ dựa trên tổng hòa trải nghiệm cảm xúc, không chỉ đơn thuần là danh sách tính năng. Các giá trị mặc định xuất sắc và chuyển động tinh tế là vũ khí cạnh tranh khác biệt. Vẻ đẹp thị giác là tài nguyên chưa được khai thác đúng mức trong kỹ nghệ phần mềm. Hãy dùng nó làm đòn bẩy để dẫn đầu.

---

## 2. ĐỊNH DẠNG THẨM ĐỊNH MÃ NGUỒN BẮT BUỘC (Required Review Format)

Khi thẩm định hoặc rà soát mã nguồn UI/UX, BẮT BUỘC sử dụng bảng Markdown với 3 cột chuẩn: `| Before (Trước) | After (Sau) | Why (Lý do) |`.  
Tuyệt đối KHÔNG xuất danh sách gạch đầu dòng "Before: ... After: ...".

| Before (Hiện trạng) | After (Chuẩn hóa) | Why (Lý do kỹ thuật) |
|---|---|---|
| `transition: all 300ms` | `transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1)` | Chỉ định chính xác thuộc tính; cấm animate `all` để tránh giật khung hình |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Không có vật thể nào trong thế giới thực xuất hiện từ hư vô |
| `ease-in` trên dropdown | `ease-out` với cubic-bezier bứt tốc | `ease-in` tạo cảm giác trễ nải, ì ạch; `ease-out` phản hồi tức thì |
| Không có `:active` trên nút | `transform: scale(0.965)` trên `:active` | Nút bấm phải có phản hồi xúc giác co lún chân thực khi người dùng nhấn |
| `transform-origin: center` trên popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Popover phải phóng to từ chính nút kích hoạt (chỉ modal mới giữ center) |

---

## 3. KHUNG RA QUYẾT ĐỊNH CHUYỂN ĐỘNG (The Animation Decision Framework)

Trước khi viết bất kỳ dòng mã hoạt ảnh nào, trả lời lần lượt 4 câu hỏi cốt tử sau:

### 3.1 Có nên hoạt ảnh hay không? (Should this animate at all?)
Đo lường tần suất người dùng tiếp xúc với hành động:

| Tần suất tương tác | Phán quyết kỹ thuật | Giải thích & Ví dụ |
|---|---|---|
| **100+ lần / ngày** | **TUYỆT ĐỐI KHÔNG HOẠT ẢNH (Zero Animation)** | Phím tắt, mở bảng lệnh (Command Palette / Raycast), chuyển tab code. Mọi độ trễ đều gây ức chế. |
| **Hàng chục lần / ngày** | **Cắt giảm tối đa hoặc loại bỏ** | Menu điều hướng, di chuột danh sách tập tin. |
| **Thỉnh thoảng** | **Hoạt ảnh tiêu chuẩn mượt mà** | Hộp thoại thông báo (Modal), ngăn kéo (Drawer), thẻ Toast. |
| **Hiếm khi / Lần đầu** | **Tạo cảm giác thích thú (Delight)** | Quy trình làm quen (Onboarding), màn hình chúc mừng, biểu mẫu phản hồi. |

> **Quy tắc vàng**: **Tuyệt đối không bao giờ animate các hành động kích hoạt bằng bàn phím (Keyboard Actions)**. Bàn phím là công cụ của tốc độ phản xạ; thêm hoạt ảnh khiến giao diện trở nên chậm chạp và mất kết nối với thao tác gõ.

### 3.2 Mục đích của chuyển động là gì? (What is the purpose?)
Mọi chuyển động phải trả lời được câu hỏi "Tại sao phần tử này lại di chuyển?":
- **Nhất quán không gian (Spatial consistency)**: Toast xuất hiện từ góc dưới và trượt ra theo đúng chiều đó, giúp cử chỉ vuốt để đóng (swipe-to-dismiss) khớp tự nhiên với trực giác.
- **Báo hiệu trạng thái (State indication)**: Nút phản hồi biến hình thể hiện trạng thái đang gửi dữ liệu.
- **Giải thích trực quan (Explanation)**: Hoạt ảnh minh họa cách vận hành của một tính năng phức tạp.
- **Phản hồi xúc giác (Feedback)**: Nút bấm co lún xuống khi nhấn chuột, xác nhận hệ thống đã nhận lệnh.
- **Ngăn ngừa thay đổi đột ngột (Preventing jarring changes)**: Tránh việc phần tử biến mất giật cục gây chói mắt.

### 3.3 Lựa chọn đường cong gia tốc (Easing)?
- Phần tử xuất hiện hoặc biến mất khỏi màn hình $\to$ **`ease-out`** (bứt tốc nhanh, dừng êm).
- Phần tử di chuyển hoặc biến hình ngay trên màn hình $\to$ **`ease-in-out`** (tăng tốc tự nhiên rồi giảm tốc).
- Tương tác di chuột đổi màu (hover color) $\to$ **`ease`**.
- Chuyển động tuần hoàn liên tục (marquee, progress bar) $\to$ **`linear`**.

### 3.4 Giới hạn thời lượng (Duration Caps)?
- Phản hồi bấm nút: **100-160ms**.
- Tooltip, popover nhỏ: **125-200ms**.
- Menu thả xuống (Dropdown, Select): **150-250ms**.
- Hộp thoại (Modal), ngăn kéo (Drawer): **200-300ms**.
- **Trần tối đa cho UI**: Mọi hoạt ảnh điều hướng giao diện PHẢI DƯỚI **300ms**. Một dropdown trượt xuống trong 180ms mang lại cảm giác nhạy bén hơn rất nhiều so với thời lượng 400ms.

---

## 4. NGHỆ THUẬT ĐƯỜNG CONG CUBIC-BEZIER BỨT TỐC (Accelerated Cubic-Bezier Mastery)

Các đường cong mặc định của CSS (`ease`, `ease-in`) quá yếu ớt và thiếu đi lực nhấn dứt khoát.

```css
/* Đường cong bứt tốc phản hồi tức thì cho tương tác UI (Strong Ease-Out) */
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Đường cong chuyển động tự nhiên trên màn hình (Strong Ease-In-Out) */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

/* Đường cong ngăn kéo kéo vuốt mượt mà chuẩn iOS / Ionic (Drawer Easing) */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);

/* Đường cong đàn hồi kiểu lò xo nẩy nhẹ (Spring-like Easing) */
--ease-spring: cubic-bezier(0.22, 1.61, 0.36, 1.0);
```

### 4.1 LỆNH CẤM EASE-IN CHO HOẠT ẢNH UI
`ease-in` xuất phát cực kỳ chậm chạp. Nó khiến giao diện tạo cảm giác ì ạch và không chịu phản hồi. Một menu thả xuống dùng `ease-in` 300ms mang lại cảm giác chậm hơn hẳn `ease-out` cùng 300ms, bởi vì `ease-in` trì hoãn chuyển động ban đầu - đúng ngay khoảnh khắc người dùng đang dán mắt theo dõi.

### 4.2 Hiệu Năng Nhận Thức (Perceived Performance)
Nhận thức về tốc độ quan trọng không kém tốc độ đo đạc thực tế:
- Một con quay tải (spinner) quay nhanh tạo cảm giác ứng dụng tải nhanh hơn hẳn (dù thời gian chờ như nhau).
- Một bảng chọn 180ms mang lại cảm giác mượt mà và nhạy bén.
- Tooltip mở tức thì (`0ms`) khi di chuột qua các icon kế tiếp tạo cảm giác toàn bộ thanh công cụ cực kỳ tốc độ.

---

## 5. VI TƯƠNG TÁC BẤM CO LÚN scale(0.965) & PHẢN HỒI XÚC GIÁC (Micro-Interactions)

### 5.1 Chuẩn mực bấm co lún scale(0.965)
Mọi nút bấm, thẻ tương tác và phần tử có thể nhấp chuột BẮT BUỘC phải có phản hồi khi người dùng nhấn (`:active`):

```css
.button-tactile {
  transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
}

.button-tactile:active {
  transform: scale(0.965);
}
```

*Độ lún lý tưởng*: `scale(0.965)` tạo độ nén sâu vật lý hoàn hảo, không quá thô bạo nhưng đủ để ngón tay hoặc con trỏ chuột cảm nhận được độ đàn hồi cơ học.

### 5.2 Không bao giờ animate từ scale(0)
Không có bất kỳ vật thể nào trong thế giới vật lý xuất hiện từ hư vô (scale 0). Các phần tử phóng to từ `scale(0)` trông cực kỳ giả tạo và mang đặc trưng AI rẻ tiền.  
👉 Luôn bắt đầu từ `scale(0.95)` kết hợp với `opacity: 0`. Tỷ lệ ban đầu 95% mô phỏng chiếc bong bóng dù xẹp nhưng vẫn có hình hài rõ rệt.

```css
/* SAI - Biểu hiện rác AI */
.modal-enter {
  transform: scale(0);
}

/* ĐÚNG - Chuẩn kỹ sư thiết kế */
.modal-enter {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms ease-out;
}
```

### 5.3 Thời gian bất đối xứng (Asymmetric Enter/Exit Timing)
Thao tác nhấn vào thì cần độ chậm rãi và chủ đích, nhưng khi thả tay ra thì hệ thống phải phản hồi nhanh như chớp:
- Ví dụ nút giữ để xóa (Hold-to-delete): Nhấn giữ thì chạy chậm 2s tuyến tính (`linear`), nhưng khi thả tay thì lập tức hồi về vị trí cũ trong 160ms `ease-out`.

### 5.4 Hiệu ứng làm mờ cầu nối (Blur Bridging)
Khi chuyển đổi chéo giữa hai trạng thái (crossfade) cảm thấy bị sượng hoặc nhìn thấy hai đối tượng đè lên nhau, hãy thêm hiệu ứng làm mờ nhẹ `filter: blur(2px)` trong 150-200ms. Hiệu ứng này đánh lừa thị giác người xem, tạo cảm giác một vật thể duy nhất đang biến đổi mềm mại thay vì hai vật thể tráo đổi cho nhau. (Giữ blur dưới 20px để bảo vệ hiệu năng trình duyệt Safari).

---

## 6. LỀ QUANG HỌC & CĂN CHỈNH THỊ GIÁC (Optical Alignment & Margins)

Tâm hình học toán học (Mathematical Center) KHÔNG đồng nghĩa với tâm thị giác con người (Visual Center).

### 6.1 Bù lề quang học cho Icon Play (Play Button Triangle Offset)
Trọng tâm khối lượng của hình tam giác icon Play dồn về phía đáy rộng bên trái. Nếu căn giữa hình học thuần túy vào tâm vòng tròn, mắt người sẽ cảm thấy icon bị thụt về bên trái.  
👉 **Bù lề quang học bắt buộc**: Dịch icon Play sang phải từ 1px đến 2px (`translate-x-[1.5px]`) để trọng tâm thị giác nằm chính xác tại tâm vòng tròn.

### 6.2 Điểm tựa biến đổi nhận thức vị trí (Transform-Origin Awareness)
- **Menu thả xuống & Popover**: BẮT BUỘC phóng to/thu nhỏ từ chính vị trí nút bấm kích hoạt nó (`transform-origin: var(--radix-popover-content-transform-origin)`). Việc này giúp mắt người theo dõi được dòng chảy thông tin xuất phát từ đâu.
- **Hộp thoại (Modal / Dialog)**: Là ngoại lệ duy nhất giữ `transform-origin: center` vì nó không gắn với một nút cục bộ mà neo vào toàn bộ khung nhìn viewport.

### 6.3 Chuỗi Tooltip nối tiếp không độ trễ (Instant Chained Tooltips)
Tooltip đầu tiên cần độ trễ 400ms để tránh việc lướt chuột qua vô tình kích hoạt. Nhưng một khi tooltip đầu tiên đã hiển thị, nếu người dùng lia chuột sang các icon liền kề trong cùng thanh công cụ, các tooltip tiếp theo BẮT BUỘC hiển thị ngay lập tức với thời gian chuyển đổi `0ms` (`transition-duration: 0ms`). Điều này giúp toàn bộ thanh công cụ mang lại cảm giác sắc sảo, tốc độ.

### 6.4 Khoảng hở chân chữ nghiêng (Descender Clearance)
Khi sử dụng chữ nghiêng ở tiêu đề lớn có các chữ cái có phần đuôi rơi xuống dưới dòng cơ sở (`y`, `g`, `p`, `q`), việc đặt `leading-none` sẽ làm cụt mất phần đuôi chữ. Hãy đặt `leading-[1.1]` tối thiểu và dự trữ `pb-1` cho phần tử chứa.

---

## 7. VẬT LÝ LÒ XO & TÍNH BẢO TOÀN GIA TỐC (Spring Physics & Interruptibility)

Hoạt ảnh lò xo mang lại cảm giác sống động vì mô phỏng chân thực các định luật vật lý cơ học, không có thời lượng nhân tạo gò ép mà tự lắng đọng dựa trên khối lượng và độ cản.

### 7.1 Cấu hình lò xo chuẩn
- **Kiểu Apple (Dễ tư duy và áp dụng)**:
  `{ type: "spring", duration: 0.5, bounce: 0.2 }`
- **Kiểu vật lý cổ điển (Kiểm soát chi tiết)**:
  `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`

*Kỷ luật độ nẩy*: Giữ độ nẩy (bounce) tinh tế từ 0.1 đến 0.3. Tránh hiệu ứng nẩy lò xo quá lố trong các ứng dụng nghiệp vụ chuyên nghiệp.

### 7.2 Lợi thế bảo toàn gia tốc khi ngắt quãng (Interruptibility)
Lò xo giữ nguyên vector gia tốc và vận tốc khi bị ngắt giữa chừng. Trong khi đó, CSS keyframes bị reset về điểm xuất phát 0 gây giật khựng khung hình. Khi người dùng mở một ngăn kéo rồi bất ngờ nhấn phím `Escape` hoặc chạm ra ngoài, hoạt ảnh lò xo sẽ đảo chiều mềm mại từ đúng tọa độ hiện tại.

### 7.3 Tương tác chuột mượt mà với useSpring
Tuyệt đối không gán trực tiếp tọa độ chuột thô vào vị trí phần tử. Hãy dùng `useSpring` trong thư viện Motion để nội suy giá trị, tạo độ trễ quán tính mượt mà như vật thể thực tế trôi theo tay người.

---

## 8. KỸ THUẬT CSS TRANSFORM & CLIP-PATH ĐỈNH CAO (CSS Mastery)

### 8.1 Dịch chuyển translateY theo phần trăm (%)
Giá trị phần trăm trong hàm `translateY()` tính toán dựa trên chính kích thước của phần tử đó. Sử dụng `translateY(100%)` để giấu hoàn toàn một ngăn kéo xuống dưới đáy màn hình, bất kể chiều cao nội dung của nó là bao nhiêu pixel.

### 8.2 Animate trạng thái vào bằng @starting-style
Chuẩn CSS hiện đại cho phép animate phần tử khi vừa xuất hiện vào DOM mà không cần đến React `useEffect`:

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 250ms cubic-bezier(0.23, 1, 0.32, 1), transform 250ms cubic-bezier(0.23, 1, 0.32, 1);

  @starting-style {
    opacity: 0;
    transform: translateY(16px);
  }
}
```

### 8.3 Làm chủ hoạt ảnh bằng clip-path: inset()
`clip-path: inset(top right bottom left)` là công cụ tạo hoạt ảnh mạnh mẽ bậc nhất trong CSS:
- **Đổi màu tab hoàn hảo (Tab Color Swap)**: Nhân bản danh sách tab, tô màu trạng thái active, dùng `clip-path` cắt theo vị trí tab đang chọn. Giải pháp này tạo sự chuyển màu mượt mà tuyệt đối mà việc animate màu sắc từng tab đơn lẻ không bao giờ đạt được.
- **Thao tác giữ để xóa (Hold-to-delete)**: Dùng `clip-path: inset(0 100% 0 0)` trên một lớp phủ màu đỏ. Khi `:active`, chuyển đổi sang `inset(0 0 0 0)` trong 2s linear. Khi thả tay, co về 0 trong 160ms ease-out kết hợp `scale(0.965)`.
- **Hé lộ hình ảnh khi cuộn (Image reveals on scroll)**: Bắt đầu từ `clip-path: inset(0 0 100% 0)` (ẩn từ đáy lên) và mở dần sang `inset(0 0 0 0)` khi cuộn vào viewport.

---

## 9. CỬ CHỈ KÉO VUỐT & VẬT LÝ ĐƯỜNG BIÊN (Gesture & Boundary Physics)

### 9.1 Đóng theo vận tốc vuốt (Velocity-Based Dismissal)
Không bắt người dùng phải kéo vượt qua một khoảng cách cố định. Hãy đo vận tốc vuốt: `velocity = Math.abs(dragDistance) / elapsedTime`.  
Nếu vận tốc vuốt vượt quá ngưỡng `> 0.11`, cho phép đóng phần tử ngay lập tức (a quick flick) bất kể quãng đường kéo được bao xa.

### 9.2 Lực cản giảm chấn tại đường biên (Damping at Boundaries)
Khi người dùng kéo vượt quá giới hạn tự nhiên (ví dụ kéo ngăn kéo lên trên khi đã chạm đỉnh), áp dụng lực cản (friction) tăng dần: người dùng kéo càng xa, phần tử di chuyển càng chậm lại. Tránh việc chặn đứng đột ngột như đâm sầm vào tường.

### 9.3 Khóa con trỏ & Bảo vệ đa điểm chạm (Pointer Capture & Multi-touch)
- Bật `pointer capture` ngay khi bắt đầu kéo để cử chỉ vuốt không bị đứt đoạn kể cả khi con trỏ văng ra khỏi biên phần tử.
- Chặn các điểm chạm phát sinh tiếp theo sau khi cử chỉ kéo đã bắt đầu, tránh tình trạng giao diện nhảy giật vị trí khi người dùng vô tình chạm thêm ngón tay thứ hai.

---

## 10. QUY TẮC HIỆU NĂNG GPU & KHẢ NĂNG TIẾP CẬN (Performance & A11y)

### 10.1 CHỈ animate transform và opacity
Hai thuộc tính này được xử lý trực tiếp trên chip đồ họa (GPU) và bỏ qua hoàn toàn các bước tính toán bố cục (Layout) và quét màu (Paint). Animating `width`, `height`, `padding`, `margin` sẽ kích hoạt lại toàn bộ chu trình render của trình duyệt, gây tụt khung hình thảm hại.

### 10.2 Tránh bẫy kế thừa biến CSS (CSS Variable Trap)
Thay đổi giá trị biến CSS trên phần tử cha sẽ buộc trình duyệt tính toán lại kiểu dáng cho toàn bộ phần tử con cháu. Khi kéo vuốt ngăn kéo chứa hàng trăm phần tử, tuyệt đối không cập nhật `--swipe-amount` lên container cha, hãy gán `element.style.transform = translateY(...)` trực tiếp lên phần tử chuyển động.

### 10.3 Tăng tốc phần cứng trong Motion
Các thuộc tính viết tắt (`x`, `y`, `scale`) trong Motion chạy trên luồng chính thông qua `requestAnimationFrame`. Khi muốn đảm bảo 60 FPS tuyệt đối dưới tải nặng, sử dụng chuỗi thuộc tính đầy đủ:
```jsx
// Chạy trên luồng phụ GPU, không bao giờ giật lag dưới tải nặng
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### 10.4 Tôn trọng chế độ giảm chuyển động & Cảm ứng
```css
/* Tôn trọng người dùng nhạy cảm chuyển động */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none !important;
    transition: opacity 150ms ease !important;
  }
}

/* Lọc bỏ hover giả mạo trên màn hình cảm ứng điện thoại */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    transform: translateY(-1px);
  }
}
```

---

## 11. NGUYÊN TẮC SONNER XÂY DỰNG COMPONENT KINH ĐIỂN (The Sonner Principles)

Được đúc kết từ việc xây dựng Sonner (thư viện Toast đạt hơn 13 triệu lượt tải hàng tuần trên npm):

1. **Trải nghiệm lập trình viên (DX) là số 1**: Không cấu hình hooks phức tạp, không bọc context rối rắm. Chỉ cần đặt `<Toaster />` ở gốc ứng dụng và gọi `toast()` từ bất kỳ đâu.
2. **Giá trị mặc định xuất sắc hơn nhiều tùy chọn**: Tinh chỉnh thời lượng, đường cong gia tốc và bố cục đẹp hoàn hảo ngay khi cài đặt. Hầu hết người dùng không bao giờ cần chỉnh sửa cấu hình.
3. **Đặt tên có linh hồn và bản sắc**: "Sonner" (tiếng Pháp: rung chuông) mang lại cảm giác thanh lịch và dễ nhớ hơn nhiều so với "react-toast-component".
4. **Xử lý các trường hợp biên một cách vô hình**: Tự động tạm dừng thời gian đếm ngược của toast khi người dùng chuyển tab trình duyệt. Lấp đầy khoảng cách giữa các thẻ xếp chồng bằng phần tử giả `::after` để giữ vững trạng thái hover.
5. **Dùng CSS Transitions thay vì Keyframes**: Hỗ trợ chuyển hướng mượt mà khi người dùng kích hoạt liên tục nhiều thông báo.
6. **Kiểm tra lại bằng con mắt mới vào ngày hôm sau**: Xem lại hoạt ảnh ở tốc độ chậm 25% trong tab Animations của Chrome DevTools để soi từng khung hình trước khi bàn giao.

---

## 12. BẢNG KIỂM TRA THẨM ĐỊNH MÃ NGUỒN (Design Engineering Review Checklist)

| Vấn đề phát hiện | Giải pháp chuẩn mực |
|---|---|
| Dùng `transition: all` | Chỉ định thuộc tính cụ thể: `transition: transform 160ms ease-out` |
| Hoạt ảnh xuất hiện từ `scale(0)` | Bắt đầu từ `scale(0.95)` kết hợp `opacity: 0` |
| Sử dụng `ease-in` trên phần tử UI | Chuyển sang `cubic-bezier(0.23, 1, 0.32, 1)` hoặc `ease-out` |
| Nút bấm thiếu phản hồi khi nhấn | Thêm `:active { transform: scale(0.965); }` |
| `transform-origin: center` trên popover | Đặt điểm tựa phóng to từ nút bấm kích hoạt |
| Gán hoạt ảnh cho phím tắt bàn phím | Xóa bỏ hoàn toàn hoạt ảnh (Zero Animation) |
| Thời lượng hoạt ảnh UI $> 300\text{ms}$ | Giảm xuống ngưỡng 150-250ms sắc bén |
| Hover kích hoạt nhầm trên di động | Bọc trong `@media (hover: hover) and (pointer: fine)` |
| Icon Play bị lệch thị giác | Thêm bù lề quang học `translate-x-[1.5px]` sang phải |
| Thiếu hỗ trợ chế độ giảm chuyển động | Tích hợp `@media (prefers-reduced-motion: reduce)` |
