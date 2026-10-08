---
name: design-engineering
description: "Siêu Kỹ Năng Kỹ Thuật Thiết Kế (Design Engineering) theo triết lý Emil Kowalski & 6 Repo GitHub Đỉnh Cao (Vaul, Magic UI, Motion-Primitives, Lenis, Cmdk, Craft). Đóng gói chuẩn mực vi tương tác bấm co lún scale(0.965), đường cong cubic-bezier bứt tốc, lề quang học, lò xo vật lý, tối ưu hóa GPU, nguyên tắc Sonner và 5 Trụ Cột Tương Tác Cảm Ứng Xúc Giác Di Động & iPadOS Touch (Sticky-hover elimination, Gestural drawer, Sliding pill indicator, Dual haptic engine, 120Hz ProMotion momentum scroll)."
---

# Design Engineering: Triết Lý Tinh Hoa & Kỹ Thuật Giao Diện Emil Kowalski

> **Tôn chỉ cốt lõi**:  
> Gu thẩm mỹ không phải là năng khiếu trời sinh, mà là bản năng được trui rèn qua quan sát và thực hành khắt khe.  
> Chi tiết vô hình cộng hưởng tạo nên sự kỳ diệu ("A thousand barely audible voices all singing in tune").  
> Vẻ đẹp là đòn bẩy kỹ thuật mang tính sống còn để tạo sự khác biệt vượt trội.  
> **Nguồn gốc tri thức (Upstream Heritage)**: Kế thừa từ triết lý Kỹ nghệ Thiết kế của Emil Kowalski (https://animations.dev/ và https://github.com/emilkowalski/skills).

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
`ease-in` xuất phát cực kỳ chậm chạp. Nó khiến giao diện tạo cảm giác ì ạch và không chịu phản hồi. Một menu thả xuống dùng `ease-in` 300ms mang lại cảm giác chậm hơn hẳn `ease-out` cùng 300ms, bởi vì `ease-in` trì hoãn chuyển động ban đầu, đúng ngay khoảnh khắc người dùng đang dán mắt theo dõi.

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

## 9. HIỆU ỨNG THÁC ĐỔ SO LE (Stagger Animations)

Khi nhiều phần tử cùng xuất hiện đồng thời (danh sách thẻ, menu items, badges), việc cho tất cả cùng hiện ra cùng lúc tạo cảm giác thô cứng. Hãy áp dụng hoạt ảnh thác đổ so le (Stagger):

```css
.stagger-item {
  opacity: 0;
  transform: translateY(8px);
  animation: staggerIn 250ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 40ms; }
.stagger-item:nth-child(3) { animation-delay: 80ms; }
.stagger-item:nth-child(4) { animation-delay: 120ms; }

@keyframes staggerIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

* **Khoảng trễ lý tưởng (Stagger Delay)**: Giữ khoảng cách giữa các phần tử cực ngắn từ **30ms đến 60ms** (tối đa 80ms). Khoảng trễ quá dài khiến giao diện tạo cảm giác chậm chạp và làm phiền người dùng.
* **Quy tắc bất biến không chặn tương tác (Non-Blocking Invariant)**: Hoạt ảnh thác đổ chỉ mang tính chất trang trí thẩm mỹ. TUYỆT ĐỐI KHÔNG khóa con trỏ hoặc vô hiệu hóa hành động bấm nút của người dùng trong lúc hoạt ảnh stagger đang chạy.

---

## 10. CỬ CHỈ KÉO VUỐT & VẬT LÝ ĐƯỜNG BIÊN (Gesture & Boundary Physics)

### 10.1 Đóng theo vận tốc vuốt (Velocity-Based Dismissal)
Không bắt người dùng phải kéo vượt qua một khoảng cách cố định. Hãy đo vận tốc vuốt: `velocity = Math.abs(dragDistance) / elapsedTime`.  
Nếu vận tốc vuốt vượt quá ngưỡng `> 0.11`, cho phép đóng phần tử ngay lập tức (a quick flick) bất kể quãng đường kéo được bao xa.

### 10.2 Lực cản giảm chấn tại đường biên (Damping at Boundaries)
Khi người dùng kéo vượt quá giới hạn tự nhiên (ví dụ kéo ngăn kéo lên trên khi đã chạm đỉnh), áp dụng lực cản (friction) tăng dần: người dùng kéo càng xa, phần tử di chuyển càng chậm lại. Tránh việc chặn đứng đột ngột như đâm sầm vào tường.

### 10.3 Khóa con trỏ & Bảo vệ đa điểm chạm (Pointer Capture & Multi-touch)
- Bật `pointer capture` ngay khi bắt đầu kéo để cử chỉ vuốt không bị đứt đoạn kể cả khi con trỏ văng ra khỏi biên phần tử.
- Chặn các điểm chạm phát sinh tiếp theo sau khi cử chỉ kéo đã bắt đầu, tránh tình trạng giao diện nhảy giật vị trí khi người dùng vô tình chạm thêm ngón tay thứ hai.

---

## 11. QUY TẮC HIỆU NĂNG GPU & KHẢ NĂNG TIẾP CẬN (Performance & A11y)

### 11.1 CHỈ animate transform và opacity
Hai thuộc tính này được xử lý trực tiếp trên chip đồ họa (GPU) và bỏ qua hoàn toàn các bước tính toán bố cục (Layout) và quét màu (Paint). Animating `width`, `height`, `padding`, `margin` sẽ kích hoạt lại toàn bộ chu trình render của trình duyệt, gây tụt khung hình thảm hại.

### 11.2 Tránh bẫy kế thừa biến CSS (CSS Variable Trap)
Thay đổi giá trị biến CSS trên phần tử cha sẽ buộc trình duyệt tính toán lại kiểu dáng cho toàn bộ phần tử con cháu. Khi kéo vuốt ngăn kéo chứa hàng trăm phần tử, tuyệt đối không cập nhật `--swipe-amount` lên container cha, hãy gán `element.style.transform = translateY(...)` trực tiếp lên phần tử chuyển động.

### 11.3 Tăng tốc phần hardware trong Motion
Các thuộc tính viết tắt (`x`, `y`, `scale`) trong Motion chạy trên luồng chính thông qua `requestAnimationFrame`. Khi muốn đảm bảo 60 FPS tuyệt đối dưới tải nặng, sử dụng chuỗi thuộc tính đầy đủ:
```jsx
// Chạy trên luồng phụ GPU, không bao giờ giật lag dưới tải nặng
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### 11.4 Tôn trọng chế độ giảm chuyển động & Cảm ứng
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

## 12. NGUYÊN TẮC SONNER XÂY DỰNG COMPONENT KINH ĐIỂN (The Sonner Principles)

Được đúc kết từ việc xây dựng Sonner (thư viện Toast đạt hơn 13 triệu lượt tải hàng tuần trên npm):

1. **Trải nghiệm lập trình viên (DX) là số 1**: Không cấu hình hooks phức tạp, không bọc context rối rắm. Chỉ cần đặt `<Toaster />` ở gốc ứng dụng và gọi `toast()` từ bất kỳ đâu.
2. **Giá trị mặc định xuất sắc hơn nhiều tùy chọn**: Tinh chỉnh thời lượng, đường cong gia tốc và bố cục đẹp hoàn hảo ngay khi cài đặt. Hầu hết người dùng không bao giờ cần chỉnh sửa cấu hình.
3. **Đặt tên có linh hồn và bản sắc**: "Sonner" (tiếng Pháp: rung chuông) mang lại cảm giác thanh lịch và dễ nhớ hơn nhiều so với "react-toast-component".
4. **Xử lý các trường hợp biên một cách vô hình**: Tự động tạm dừng thời gian đếm ngược của toast khi người dùng chuyển tab trình duyệt. Lấp đầy khoảng cách giữa các thẻ xếp chồng bằng phần tử giả `::after` để giữ vững trạng thái hover.
5. **Dùng CSS Transitions thay vì Keyframes**: Hỗ trợ chuyển hướng mượt mà khi người dùng kích hoạt liên tục nhiều thông báo.
6. **Kiểm tra lại bằng con mắt mới vào ngày hôm sau**: Xem lại hoạt ảnh ở tốc độ chậm 25% trong tab Animations của Chrome DevTools để soi từng khung hình trước khi bàn giao.

---

## 13. QUY TRÌNH GỠ LỖI & GIÁM ĐỊNH CHUYỂN ĐỘNG (Animation Debugging & Inspection)

### 13.1 Kiểm tra ở tốc độ chậm (Slow-Motion Testing)
Chạy hoạt ảnh ở tốc độ giảm (25% - 50% hoặc thời lượng tăng 2-5x) trong bảng Animations của Chrome DevTools để phát hiện các lỗi vô hình ở tốc độ thông thường:
- Màu sắc có chuyển đổi mềm mại không, hay có hai trạng thái đè chéo lên nhau làm lộ mép?
- Điểm tựa phóng to (`transform-origin`) có chuẩn xác từ vị trí kích hoạt không?
- Các thuộc tính hoạt ảnh đồng thời (opacity, transform) có kết thúc ăn khớp nhịp nhàng không?

### 13.2 Soi từng khung hình (Frame-by-Frame Inspection)
Tua từng bước khung hình để kiểm tra tính liên tục của chuyển động và đảm bảo không có khung hình trắng hoặc giật khựng vị trí.

### 13.3 Kiểm thử trên thiết bị phần cứng thực tế (Real Device Testing)
Các thao tác kéo vuốt cử chỉ (drag, swipe, pull-down) bắt buộc phải kiểm tra trên màn hình cảm ứng điện thoại thực tế hoặc giả lập DevTools touch events, không thể kết luận chỉ bằng chuột máy tính bàn.

---

## 14. BẢNG KIỂM TRA THẨM ĐỊNH MÃ NGUỒN (Design Engineering Review Checklist)

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
| Nhiều phần tử xuất hiện cùng lúc | Áp dụng hoạt ảnh thác đổ so le (Stagger) 30-60ms |
| Chưa kiểm tra hoạt ảnh ở tốc độ chậm | Soi kỹ lưỡng ở tốc độ 25% trong DevTools Animations |
| Hover bị kẹt dính vĩnh viễn trên iOS/iPadOS | Phân lập `@media (hover: hover) and (pointer: fine)`, dùng `:active` trên cảm ứng |
| Drawer đóng cứng đờ khi kéo ngược | Áp dụng giảm chấn cao su logarit `rubber-banding` |
| Drawer bắt buộc kéo hết chiều cao | Áp dụng ngưỡng đóng kép: vận tốc $> 0.12\text{ px/ms}$ hoặc quãng đường $> 25\%$ |
| Tab active giật nháy khi chuyển | Dùng phần tử nền trượt duy nhất (Sliding Pill Indicator) 180-240ms |
| Âm thanh xúc giác bị chặn trên iOS | Mở khóa `AudioContext` tại `touchstart` đầu tiên + phát sóng sin thuần |
| Rung xúc giác quá mạnh gây phiền | Giới hạn xung rung cơ học siêu ngắn `navigator.vibrate(8)` (8ms) |
| Neo trang bị TopBar che khuất | Trừ chiều cao header động + padding an toàn: `offset = top - headerHeight - 16` |
| Cuộn giật khựng trên iPad 120Hz | Đồng bộ rAF, nội suy quán tính lerp 120Hz ProMotion chuẩn Lenis |

---

## 15. CHUẨN MỰC TƯƠNG TÁC XÚC GIÁC CẢM ỨNG DI ĐỘNG & iPadOS (Touch-First & Gestural Interaction Standards)

Được đúc kết từ quá trình khảo sát thực chiến 6 thư viện và sản phẩm tương tác hàng đầu GitHub (`vaul`, `craft.rauno.me`, `cmdk`, `magicui`, `motion-primitives`, `lenis`), đóng gói trọn vẹn 5 trụ cột kỹ thuật tương tác cảm ứng xúc giác đỉnh cao cho Web & iPadOS Touch:

### 15.1 Trụ Cột 1 — Sticky-Hover Elimination (Quy Chuẩn Triệt Tiêu Bẫy Dính Hover trên Safari iOS/iPadOS)
* **Nguyên nhân gốc rễ (Root Cause)**: Trên các thiết bị cảm ứng (đặc biệt là WebKit Safari trên iOS và iPadOS), khi người dùng chạm ngón tay vào một phần tử có pseudo-class `:hover`, trình duyệt sẽ kích hoạt style `:hover` và giữ nguyên trạng thái đó vĩnh viễn ("Sticky-Hover"). Trạng thái này chỉ bị hủy khi người dùng chạm vào một phần tử tương tác khác. Hậu quả là các nút bấm bị kẹt màu, tooltip mở lơ lửng không chịu đóng, và giao diện trở nên luộm thuộm.
* **Quy chuẩn Cách ly Bắt buộc (Strict Isolation Rule)**: Toàn bộ hiệu ứng hover thị giác BẮT BUỘC phải được bọc trong media query kép:
  ```css
  /* CHỈ kích hoạt hiệu ứng hover trên thiết bị có chuột / con trỏ chuẩn xác */
  @media (hover: hover) and (pointer: fine) {
    .interactive-element:hover {
      background-color: var(--color-surface-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  }

  /* Trên thiết bị cảm ứng: Phản hồi thuần túy bằng vi tương tác co lún khi chạm */
  .interactive-element:active {
    transform: scale(0.965);
    transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  ```
* **Kỷ luật Tailwind CSS**: Tuyệt đối không dùng class `hover:...` đơn độc cho các hiệu ứng trạng thái nếu không có cơ chế cách ly con trỏ chuột chuẩn xác, ngăn ngừa triệt để lỗi kẹt màu trên iPadOS.

### 15.2 Trụ Cột 2 — Gestural Drawer & Swipe-to-Dismiss (Ngăn Kéo Cử Chỉ & Vuốt Để Đóng — Vaul Pattern)
Kế thừa tinh hoa từ kiến trúc của Emil Kowalski trong thư viện `vaul`:
* **Thanh Kéo Vuốt (Drag Handle)**:
  - Bố trí tại mép trên của ngăn kéo với kích thước chuẩn: `w-12 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600`.
  - Khóa hành vi cuộn mặc định của trình duyệt tại khu vực kéo: `touch-action: none;`.
  - Dự trữ vùng chạm quang học an toàn (`touch-target` $\ge 44\text{px}$) bằng đệm padding vô hình xung quanh thanh kéo.
* **Theo Dõi Dịch Chuyển & Giảm Chấn Cao Su (Rubber-Banding / Damping)**:
  - Khi người dùng chạm và kéo ngón tay theo trục Y (`deltaY = currentTouchY - initialTouchY`):
    - Khi kéo xuống (`deltaY > 0`): Dịch chuyển ngăn kéo theo tỷ lệ 1:1: `transform: translateY(${deltaY}px)`.
    - Khi kéo ngược lên trên đường biên tự nhiên (`deltaY < 0`): Tuyệt đối không chặn cứng đờ. Bắt buộc áp dụng công thức giảm chấn cao su logarit:
      $$\text{dampedDelta} = -(\left|\text{deltaY}\right|^{0.75}) \times 1.2$$
      hoặc hệ số ma sát $\text{deltaY} \times 0.25$, tạo cảm giác như kéo dãn một sợi dây cao su chân thực.
* **Ngưỡng Đóng Kép (Dual Dismiss Thresholds)**:
  Ngăn kéo tự động trượt xuống đóng khi thỏa mãn **MỘT TRONG HAI** điều kiện:
  1. *Ngưỡng Quãng Đường (Distance Threshold)*: $\text{deltaY} > 120\text{px}$ hoặc $\ge 25\%$ chiều cao toàn phần của drawer.
  2. *Ngưỡng Vận Tốc Vuốt Nhanh (Velocity / Flick Threshold)*: $\text{velocity} = \frac{\left|\text{deltaY}\right|}{\Delta t} > 0.12\text{ px/ms}$ theo hướng đi xuống.
  - Nếu không đạt ngưỡng đóng: Ngăn kéo tự động bật nảy (snap back) về vị trí mở ban đầu bằng đường cong lò xo `--ease-spring: cubic-bezier(0.22, 1.61, 0.36, 1.0)`.

### 15.3 Trụ Cột 3 — Sliding Pill Active Indicator (Viên Thuốc Trượt Sáng Theo Dấu — Magic UI & Motion-Primitives Pattern)
* **Bản chất Kiến trúc (Architectural Insight)**:
  Thay vì thay đổi nền và màu chữ độc lập cho từng tab khiến mắt người phải nhận thức nhiều điểm nhấp nháy rời rạc, cơ chế "Sliding Pill" sử dụng duy nhất **MỘT phần tử nền động (Sliding Backdrop Pill)** trượt êm phía sau các nhãn tab:
  ```tsx
  // Đo đạc hình học vị trí chính xác của Tab đang kích hoạt
  const activeTabEl = tabRefs.current[activeTabId];
  if (activeTabEl && pillRef.current) {
    const { offsetLeft, offsetWidth, offsetHeight } = activeTabEl;
    pillRef.current.style.transform = `translateX(${offsetLeft}px)`;
    pillRef.current.style.width = `${offsetWidth}px`;
    pillRef.current.style.height = `${offsetHeight}px`;
  }
  ```
* **Động Lực Học Đường Cong (Easing Dynamics)**:
  - Áp dụng đường cong bứt tốc dứt khoát: `transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1), width 220ms cubic-bezier(0.23, 1, 0.32, 1);`.
  - Giữ thời lượng trong khoảng vàng 180ms - 240ms, vừa đủ để mắt người nhận diện hướng di chuyển của "viên thuốc", vừa không gây trễ thao tác chuyển đổi ngữ cảnh.
* **Đảo Màu Quang Học (Contrast Bridging)**:
  - Nhãn tab sử dụng `relative z-10`, trong khi viên thuốc trượt nằm ở `absolute inset-y-1 z-0 rounded-full bg-white dark:bg-stone-800 shadow-sm`.
  - Kết hợp chuyển đổi màu chữ `transition-colors duration-200` để chữ trở nên đậm nét và tương phản tuyệt đối khi viên thuốc trượt tới.

### 15.4 Trụ Cột 4 — Dual Haptic Tactile Engine (Động Cơ Xúc Giác Kép — Web Audio API + Vibration API)
* **Vấn Đề Phần Cứng Di Động (Mobile Hardware Constraints)**:
  - iOS/iPadOS WebKit khóa hoàn toàn `AudioContext` cho đến khi có cử chỉ tương tác đầu tiên của người dùng (`user gesture policy`), đồng thời **không hỗ trợ** `navigator.vibrate()`.
  - Android hỗ trợ `navigator.vibrate()`, nhưng nếu dùng tệp âm thanh tải qua mạng (`.mp3`, `.wav`) sẽ gặp độ trễ tải về (network lag), làm mất tính đồng bộ giữa cú chạm ngón tay và âm thanh phát ra.
* **Cơ Chế Động Cơ Kép Tự Trị (Autonomous Dual Haptic Engine)**:
  1. **Mở khóa AudioContext Ngay Lập Tức**: Bắt sự kiện `touchstart` hoặc `pointerdown` đầu tiên trên toàn `window` để đánh thức `AudioContext`:
     ```typescript
     const unlockAudioContext = () => {
       if (audioCtx && audioCtx.state === 'suspended') {
         audioCtx.resume();
       }
       window.removeEventListener('touchstart', unlockAudioContext);
       window.removeEventListener('pointerdown', unlockAudioContext);
     };
     window.addEventListener('touchstart', unlockAudioContext, { passive: true });
     window.addEventListener('pointerdown', unlockAudioContext, { passive: true });
     ```
  2. **Tự Tổng Hợp Sóng Âm Thuần (Zero-Asset Synthetic Waveforms)**:
     Không tải tệp âm thanh ngoài. Sử dụng `OscillatorNode` và `GainNode` để tạo xung âm click cơ học trong 12-18ms:
     ```typescript
     export function playTactileTick(frequency = 800, duration = 0.015) {
       if (!audioCtx) return;
       const osc = audioCtx.createOscillator();
       const gain = audioCtx.createGain();
       osc.type = 'sine';
       osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
       osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + duration);
       gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
       gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
       osc.connect(gain);
       gain.connect(audioCtx.destination);
       osc.start();
       osc.stop(audioCtx.currentTime + duration);
     }
     ```
  3. **Rung Cơ Học Siêu Nhẹ (Micro-Haptic Pulse)**:
     Trên thiết bị hỗ trợ `navigator.vibrate`, kích hoạt xung rung siêu ngắn:
     ```typescript
     if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
       navigator.vibrate(8); // 8ms: cảm giác như một khấc bi cơ học, không rung bần bật
     }
     ```

### 15.5 Trụ Cột 5 — 120Hz ProMotion Momentum Smooth Scroll (Cuộn Mượt Quán Tính 120Hz — Lenis Pattern)
* **Đặc Thù Màn Hình iPadOS ProMotion (120Hz Display Refresh Rate)**:
  Màn hình ProMotion của iPad Pro và iPhone có tần số quét 120Hz (mỗi khung hình chỉ kéo dài ~8.33ms). Các thư viện cuộn cũ sử dụng `setInterval` hoặc bước nhảy 16.6ms (chuẩn 60Hz) sẽ gây hiện tượng xé hình (stutter/jitter) thảm hại trên màn hình cảm ứng cao cấp.
* **Cơ Chế Nội Suy Quán Tính Liên Tục (Continuous Momentum Lerp)**:
  - Đồng bộ chặt chẽ với `requestAnimationFrame`:
    $$\text{currentScroll} = \text{lerp}(\text{currentScroll}, \text{targetScroll}, 0.1)$$
  - Duy trì vận tốc quán tính tự nhiên của ngón tay, tạo cảm giác lướt êm như mặt băng.
* **Tính Toán Offset Thông Minh Cho Thanh Điều Hướng (Smart Anchor Offset)**:
  Khi cuộn tới một phân mục qua liên kết neo (Anchor Link), BẮT BUỘC phải trừ đi chiều cao thực tế của thanh điều hướng (Dynamic Island / TopBar) cộng với khoảng đệm an toàn (`safe-area-inset-top`):
  ```typescript
  export function scrollToSection(targetId: string, headerSelector = '.dynamic-island-topbar') {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    const headerEl = document.querySelector(headerSelector);
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 64;
    const safePadding = 16;
    const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - safePadding;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  ```
  Ngăn chặn triệt để lỗi tiêu đề phân mục bị thanh điều hướng che khuất trên màn hình iPad và thiết bị di động.

---

## 16. MA TRẬN BÙ LỀ QUANG HỌC NGUYÊN TỬ (Atomic Optical Alignment Matrix)

Kế thừa các chuẩn mực căn chỉnh vi mô từ `ibelick/ui-skills` và `jakubkrehel/skills`:  
Tâm toán học của khung viền bounding box (Mathematical Center) hầu như không bao giờ trùng với trọng tâm thị giác của con người (Perceptual Visual Center). Việc căn giữa thuần túy bằng `flex items-center justify-center` sẽ tạo ra ảo giác thị giác bị xô lệch, khiến giao diện trở nên nghiệp dư và thiếu độ tinh xảo.

### 16.1 Ma Trận Bù Dịch Tọa Độ Cho Icons Phổ Biến (Atomic Icon Offset Matrix)

| Icon / Thành phần | Độ lệch hình học gốc | Lớp bù lề Tailwind CSS | Nguyên lý thị giác quang học |
|---|---|---|---|
| **Play Triangle** | Khối lượng dồn về đáy tam giác bên trái | `translate-x-[1.5px]` | Dịch sang phải để trọng tâm diện tích tam giác trùng với tâm vòng tròn bao ngoài. |
| **Chevron Down** | Trọng tâm mũi tên nhọn chúc xuống thấp | `translate-y-[0.5px]` | Cân bằng trọng tâm ký tự với dòng cơ sở `baseline` của nhãn chữ đi kèm. |
| **Checkmark** | Nét vát chéo ngắn bên trái kéo lệch trục | `translate-x-[0.5px] translate-y-[-0.5px]` | Bù góc nhọn lệch trục, giúp dấu kiểm định vị vững chãi giữa ô checkbox hoặc badge. |
| **Search (Kính lúp)** | Cán kính chéo góc $45^\circ$ kéo nặng góc dưới phải | `translate-x-[0.5px] translate-y-[-0.5px]` | Cân bằng khối lượng thấu kính tròn so với cán cầm chéo. |
| **Close (X)** | Nét chéo giao nhau đối xứng | Không dịch (`translate-x-0`) | Trọng tâm quang học trùng hoàn hảo với tâm hình học. |

```tsx
// Ví dụ Button tích hợp Icon bù lề quang học chuẩn mực
export function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition-transform duration-140 active:scale-[0.965] hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
      aria-label="Phát video"
    >
      {/* Bù lề quang học 1.5px sang phải cho tam giác Play */}
      <PlayIcon className="h-4 w-4 translate-x-[1.5px] fill-current" />
    </button>
  );
}
```

### 16.2 Kỹ Thuật Thụt Lề Dấu Trích Dẫn Quang Học (Hanging Punctuation in Typography)
* **Vấn đề thị giác**: Dấu ngoặc kép mở (`"`, `“`) có diện tích quang học rất mỏng manh so với thân ký tự chữ cái thẳng đứng. Khi đặt ở đầu đoạn văn, nó đẩy toàn bộ lề trái thụt vào trong, tạo cảm giác cạnh trái đoạn văn bị thụt thò gãy khúc.
* **Quy chuẩn bù lề âm quang học (Optical Negative Margin)**:
  ```css
  /* Chuẩn CSS hiện đại cho trình duyệt hỗ trợ */
  .quote-text {
    hanging-punctuation: first allow-end;
  }

  /* Fallback dự phòng tương thích mọi trình duyệt */
  .quote-leading-mark {
    display: inline-block;
    margin-left: -0.4em; /* Bù lề âm đưa dấu ngoặc ra ngoài lề thẳng hàng */
  }
  ```
  Nhờ bù lề âm `-0.4em`, lề trái của các chữ cái đầu tiên trong trích dẫn tạo thành một đường thẳng đứng thẳng tắp với tiêu đề và lề khối văn bản.

### 16.3 Nhãn Chữ Hoa Toàn Bộ & Giãn Cách Ký Tự (All-Caps Badges & Tracking Discipline)
* **Vấn đề thị giác**: Ký tự in hoa toàn bộ (`uppercase`) có chiều cao x-height bằng chiều cao chữ hoa đỉnh đầu (`cap-height`), tạo cảm giác hình khối hình học đặc quánh, nặng nề và lấn át các tiêu đề xung quanh nếu giữ nguyên kích thước mặc định.
* **Quy tắc bù trừ quang học bắt buộc**:
  - Giảm `font-size` 1px: Sử dụng `text-[11px]` thay vì `text-xs (12px)` hoặc `text-[10px]` thay vì `text-[11px]`.
  - Mở rộng khoảng cách ký tự (`Tracking`): BẮT BUỘC bù `letter-spacing: 0.05em` (`tracking-wider` trong Tailwind) hoặc `letter-spacing: 0.08em` (`tracking-widest`).
  ```tsx
  // Chuẩn mực Badge nhãn chữ hoa tinh tế
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200/80">
    Verified
  </span>
  ```

---

## 17. KHOA HỌC MÀU SẮC NHẬN THỨC OKLCH & TIẾP CẬN NGUYÊN TỬ (OKLCH Perceptual Uniformity & Primitive Strictness)

Kế thừa tiêu chuẩn công nghệ từ `ibelick/ui-skills` và các khuyến nghị kiến trúc giao diện tương tác:

### 17.1 Khoa Học Màu Sắc Nhận Thức OKLCH (Perceptual Color Uniformity)
* **Sự Thất Bại của Không Gian Màu HSL (Why HSL Fails)**:
  Không gian màu HSL (`Hue, Saturation, Lightness`) được thiết kế trên mô hình toán học đơn giản của thập niên 1970 và hoàn toàn **không phản ánh cách mắt người nhận thức ánh sáng** (`Perceptual Non-uniformity`):
  - Ở cùng giá trị `Lightness: 50%`, màu Vàng (`hsl(60, 100%, 50%)`) có độ chói nhận thức thực tế gấp 3 lần so với màu Xanh lam (`hsl(240, 100%, 50%)`).
  - Khi xoay góc sắc độ `Hue` trong HSL để tạo bảng màu trạng thái (`Success`, `Warning`, `Error`, `Info`), tỷ lệ tương phản so với màu nền bị biến thiên hỗn loạn, dẫn đến việc chữ trắng đọc rõ trên nền xanh nhưng mờ căm trên nền vàng.
* **Sự Vượt Trội Tuyệt Đối của OKLCH**:
  - `OKLCH` phân tách không gian màu theo 3 trục: `L` (Lightness - Độ sáng nhận thức thực tế từ `0` đến `1` hoặc `0%` đến `100%`), `C` (Chroma - Độ bão hòa/độ tinh khiết sắc tố từ `0` đến `0.4`), và `H` (Hue - Góc sắc độ từ `0` đến `360`).
  - **Đồng nhất nhận thức (Perceptual Uniformity)**: Bất kỳ màu nào có cùng giá trị `L = 0.65` đều mang lại cảm giác sáng ngang nhau cho võng mạc con người. Điều này cho phép tạo các bảng màu trạng thái cân bằng tuyệt đối:
  ```css
  :root {
    /* Semantic Status Tokens với Perceptual Lightness đồng nhất 65% trên Luminous Light Theme */
    --color-primary: oklch(0.55 0.18 250);   /* Xanh hoàng gia */
    --color-success: oklch(0.65 0.16 145);   /* Xanh lá ngọc */
    --color-warning: oklch(0.65 0.16 80);    /* Hổ phách ấm */
    --color-error:   oklch(0.65 0.18 28);    /* Đỏ san hô */
    --color-info:    oklch(0.65 0.15 220);   /* Lam thiên thanh */

    /* Bề mặt sáng Luminous Surfaces */
    --surface-canvas: oklch(0.985 0.003 95);  /* Warm Paper #FAF9F6 */
    --surface-card:   oklch(1.000 0.000 0);   /* Pure White */
    --border-subtle:  oklch(0.920 0.005 95);  /* Viền siêu mỏng */
    --text-primary:   oklch(0.200 0.010 60);  /* Chữ chính tương phản cao */
    --text-secondary: oklch(0.480 0.015 60);  /* Chữ phụ WCAG AA */
  }
  ```

### 17.2 Chuẩn Mực Tương Phản WCAG 2.2 & Thuật Toán APCA (Accessibility Standards)
* **Kỷ luật WCAG 2.2 AA (Tối thiểu bắt buộc)**:
  - Văn bản thường (`body text` $< 18\text{pt}$ / $24\text{px}$): Tỷ lệ tương phản $4.5:1$ tối thiểu so với bề mặt nền.
  - Văn bản lớn ($\ge 18\text{pt}$ hoặc $14\text{pt}$ in đậm) và Thành phần điều khiển UI (`interactive boundaries`, `icons`): Tỷ lệ tương phản $3:1$ tối thiểu.
* **Tiêu chuẩn Thế hệ Mới APCA (Accessible Perceptual Contrast Algorithm - WCAG 3)**:
  - Khác với WCAG 2.2 tính toán tỷ lệ thuần túy, APCA tính toán độ tương phản cảm nhận dựa trên kích thước font chữ, độ đậm nét (`font-weight`) và phân cực màu sắc (`Color Polarity`):
    - *Positive Polarity (Nền sáng chữ tối - Luminous Light Theme)*: Đòi hỏi ngưỡng tương phản quang học khắt khe để tránh mờ chữ:
      - Body Text ($\ge 15\text{px}$, Regular): Ngưỡng tương phản nhận thức $L^c \ge 60$.
      - Small Text / Footnote ($12\text{px} - 14\text{px}$): Ngưỡng tương phản nhận thức $L^c \ge 75$.
      - Headline / Bold Display: Ngưỡng tương phản nhận thức $L^c \ge 45$.

### 17.3 Kỷ Luật Khắt Khe Cho Thành Phần Nguyên Tử (Primitive Components Strictness)
Kế thừa kiến trúc từ Radix UI, Base UI và React Aria:

1. **Bắt Buộc Bẫy Tiêu Điểm & Hoàn Trả Tiêu Điểm (Focus Trap & Focus Restoration Invariant)**:
   - Mọi hộp thoại (`Dialog / Modal`), menu thả xuống (`Dropdown Menu`), và bảng thông tin (`Popover`) BẮT BUỘC phải giam tiêu điểm bàn phím (`Focus Trap`) bên trong vùng nội dung khi đang mở, ngăn phím `Tab` nhảy ra các phần tử nền bên ngoài.
   - Khi đóng hộp thoại (bằng phím `Escape`, nút Close hoặc click ra ngoài), BẮT BUỘC hoàn trả tiêu điểm (`Return Focus`) về chính phần tử kích hoạt ban đầu (`trigger element`).
2. **Kỷ Luật Viền Tập Trung Bàn Phím Toàn Cầu (Global Focus-Visible Protocol)**:
   - Tuyệt đối CẤM sử dụng `outline: none` đơn độc làm biến mất dấu hiệu nhận biết của bàn phím.
   - MỌI phần tử tương tác (`<button>`, `<a>`, `<input>`, `<select>`, `<summary>`, tabs) BẮT BUỘC phải có lớp tương tác bàn phím rõ nét:
     ```css
     /* Lớp chuẩn Tailwind CSS cho mọi interactive primitive */
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-stone-900
     ```
   - Sử dụng `:focus-visible` thay vì `:focus` để người dùng chuột không bị khó chịu bởi viền bao ngoài, trong khi người dùng bàn phím luôn thấy rõ điểm focus.
3. **Lệnh Cấm onClick Trên Thẻ Div/Span Không Semantic (Zero Non-Semantic Clickables)**:
   - CẤM TUYỆT ĐỐI gắn sự kiện `onClick` trực tiếp trên thẻ `<div>` hoặc `<span>` mà không có các thuộc tính ngữ nghĩa trợ năng.
   - **Quy tắc ưu tiên số 1**: Luôn luôn sử dụng thẻ `<button type="button">` gốc HTML cho mọi phần tử kích hoạt hành động.
   - **Quy tắc xử lý bắt buộc (khi buộc phải dùng thẻ tùy biến)**: Phải trang bị đầy đủ 3 yếu tố:
     1. Khai báo vai trò: `role="button"`.
     2. Đưa vào thứ tự duyệt phím: `tabIndex={0}`.
     3. Bắt sự kiện phím bàn phím: Xử lý phím `Enter` và phím cách `Space` (`onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAction(); } }}`).
```tsx
// SAI - Lỗi trợ năng nghiêm trọng, bị từ chối khi audit
<div onClick={handleOpen}>Mở cài đặt</div>

// ĐÚNG - Chuẩn Semantic HTML nguyên tử
<button
  type="button"
  onClick={handleOpen}
  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100 active:scale-[0.965] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
>
  <GearIcon className="h-4 w-4" />
  <span>Mở cài đặt</span>
</button>
```
