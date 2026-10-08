# 🧠 QUANTITATIVE COGNITIVE UX HEURISTICS AUDIT SPECIFICATION
## Bảng Kiểm Toán Tâm Lý Học Nhận Thức Định Lượng Cho Phân Hệ Thẩm Định `$test`

> **Thuộc phân hệ**: `$test` (Step 3 — Independent Verification Gate)  
> **Chuyên trách**: Pod 3 — `Cognitive UX Heuristics Auditor` (Tích hợp trong **Audit 2: Delight & Craftsmanship** của `Subagent 2 — Visual & Accessibility Inspector`)  
> **Nguồn cảm hứng & Chuẩn hóa**: Tổng hợp tinh hoa từ `darelova/Awesome-Design-Resources-List`, `awesome-ux` (Laws of UX, Nielsen Norman Group, Human Interface Guidelines, Material Design 3) kết hợp nghiêm ngặt cùng **Luminous Light Theme Invariant** và **Delight & Craftsmanship Score $\ge 8.5/10$**.

---

## 🏛️ 1. Triết Lý & Mục Tiêu Đo Lường Nhận Thức (`Cognitive UX Philosophy`)

Trong quy chuẩn phát triển phần mềm Antigravity Enterprise, trải nghiệm người dùng không chỉ dừng lại ở tính thẩm mỹ trực quan mà phải được giải phẫu dựa trên **Tâm lý học Nhận thức Định lượng (`Quantitative Cognitive Psychology`)**. 

Mọi giao diện phần mềm đều tác động trực tiếp lên 3 loại tải trọng nhận thức (`Cognitive Load`):
1. **Tải trọng Nội tại (`Intrinsic Cognitive Load`)**: Độ khó tự nhiên của bài toán nghiệp vụ người dùng đang xử lý.
2. **Tải trọng Ngoại lai (`Extraneous Cognitive Load`)**: Năng lượng trí não bị lãng phí do bố cục lộn xộn, điều hướng rối rắm, mục tiêu chạm quá nhỏ, hoặc thiếu phân nhóm thông tin. **Mục tiêu của Kiểm toán Nhận thức là triệt tiêu tối đa tải trọng ngoại lai này về 0**.
3. **Tải trọng Hữu ích (`Germane Cognitive Load`)**: Không gian tư duy được giải phóng để người dùng hình thành mô hình tâm trí (`Mental Models`) và thấu cảm sâu sắc giá trị sản phẩm.

```text
+-----------------------------------------------------------------------------------+
|                        COGNITIVE LOAD REDUCTION PIPELINE                          |
|                                                                                   |
|  [Rối rắm / Phẳng bẹt] ---> [6 ĐỊNH LUẬT TÂM LÝ NHẬN THỨC] ---> [Thăng hoa 60FPS] |
|  - Mục tiêu bấm nhỏ         - Fitts's Law (>=44px touch)         - Tự nhiên, êm ái|
|  - Quá nhiều lựa chọn       - Hick's Law (<=7 items)             - Không mỏi não  |
|  - Dữ liệu dài ngoằng       - Miller's Law (Chunking 7±2)        - Thấu hiểu tức thì|
|  - CTA chìm lấp             - Von Restorff (Contrast 3:1)        - Định hướng rõ ràng|
|  - Trái thói quen           - Jakob's Law (Mental Models)        - Quen thuộc 100%|
|  - Đích đến cụt ngủn        - Peak-End Rule (Celebration)        - Cảm xúc tích cực|
+-----------------------------------------------------------------------------------+
```

---

## 📐 2. Bảng Kiểm Toán 6 Định Luật Tâm Lý Nhận Thức Cốt Lõi

---

### 🟢 2.1. Định Luật Fitts (`Fitts's Law`) — Động Học Chạm & Cự Ly Thao Tác
*Mô hình hóa thời gian cần thiết để di chuyển nhanh chóng tới một mục tiêu đích phụ thuộc vào khoảng cách tới mục tiêu và độ rộng của mục tiêu.*

$$\text{MT} = a + b \log_2 \left( 1 + \frac{D}{W} \right)$$
*(Trong đó: $\text{MT}$ là thời gian di chuyển, $D$ là khoảng cách tới mục tiêu, $W$ là kích thước vùng chạm hiệu dụng).*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Kích thước Mục tiêu Di động (`Mobile Touch Target`)**:
  - Tối thiểu: **$\ge 44 \times 44\text{ px}$** (Chuẩn Apple Human Interface Guidelines / WCAG 2.5.5 Level AAA).
  - Tối ưu khuyên nghị: **$\ge 48 \times 48\text{ px}$** (Chuẩn Google Android Material Design).
  - Khoảng đệm an toàn giữa hai tâm điểm chạm kế cận (`Touch Target Center-to-Center Spacing`): **$\ge 8\text{ px}$** để triệt tiêu lỗi bấm nhầm ngón tay cái (`Fat-Finger Error`).
* **Kích thước Nút bấm Máy tính (`Desktop Click Target`)**:
  - Tối thiểu: **$\ge 36 \times 36\text{ px}$** cho icon button, hoặc chiều cao $\ge 36\text{ px}$ với padding ngang $\ge 16\text{ px}$ cho text button.
* **Vùng Ngón Cái Di Động (`Mobile Thumb Zone`)**:
  - Toàn bộ các nút hành động cốt lõi (`Primary Flow Actions`), nút chuyển tiếp (`Continue / Submit / Checkout`) bắt buộc phải neo ở vùng **Thuận Ngón Cái Tự Nhiên (`Natural Thumb Zone` — 1/3 dưới cùng màn hình)** hoặc sử dụng `Sticky Bottom Navigation / Bottom Sheet`.
* **Tận dụng Ranh giới Vô hạn (`Infinite Edge Utility`)**:
  - Trên desktop, các phần tử neo mép màn hình (Top Header, Fixed Sidebar, Floating Dock) có kích thước mục tiêu $W \to \infty$ do con trỏ chuột không thể trượt quá mép màn hình vật lý.

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Trích xuất và đo đạc tất cả các phần tử tương tác
const touchElements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]'));
const fittsViolations = touchElements.map(el => {
  const rect = el.getBoundingClientRect();
  const computed = window.getComputedStyle(el);
  if (computed.display === 'none' || computed.visibility === 'hidden' || rect.width === 0) return null;
  const isMobile = window.innerWidth <= 768;
  const minSize = isMobile ? 44 : 36;
  if (rect.width < minSize || rect.height < minSize) {
    return {
      element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ').join('.') : ''),
      width: rect.width,
      height: rect.height,
      required: minSize,
      text: el.innerText?.trim()?.slice(0, 20)
    };
  }
  return null;
}).filter(Boolean);
console.table(fittsViolations);
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Blocker)**: Bất kỳ nút CTA thanh toán, submit form nào trên mobile có chiều cao $< 40\text{ px}$ hoặc nằm ở góc chết trên cùng bên trái ngoài tầm với ngón tay cái mà không có phương án thay thế.
* ⚠️ **WARN (Minor)**: Nút phụ (`Tertiary link / inline icon`) có kích thước $< 44\text{ px}$ nhưng vùng chạm mở rộng `::after` (`pseudo-element click area`) đạt $\ge 44\text{ px}$.
* ✅ **PASS**: 100% interactive elements đạt chuẩn kích thước và nằm trong vùng tương tác công thái học.

---

### 🟡 2.2. Định Luật Hick-Hyman (`Hick-Hyman Law`) — Thời Gian Quyết Định & Tiết Lộ Lũy Tiến
*Thời gian đưa ra quyết định tăng theo hàm logarit theo số lượng và độ phức tạp của các lựa chọn khả dĩ.*

$$T = b \log_2(n + 1)$$
*(Trong đó: $T$ là thời gian phản hồi, $n$ là số lựa chọn tương đương).*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Menu Điều hướng Cấp 1 (`Main Navigation Items`)**:
  - Tối đa: **$\le 5 - 7\text{ mục}$** hiển thị trực diện trên thanh header/navbar.
  - Vượt quá 7 mục bắt buộc phải phân nhóm thứ cấp (`Grouped Mega Menu / Sub-navigation`) hoặc sử dụng ngăn kéo danh mục (`Drawer Menu`).
* **Số lượng Thẻ Giá / Gói Dịch vụ (`Pricing Tier Cards`)**:
  - Tối ưu: **3 gói** (ví dụ: Starter — Pro — Enterprise), tối đa không quá **4 gói**.
  - Luôn định hình 1 gói trung tâm là "Khuyên dùng (`Recommended / Popular`)" để giảm chi phí so sánh của não bộ.
* **Tiết lộ Lũy tiến Cho Biểu Mẫu Phức Tạp (`Progressive Disclosure Form`)**:
  - Không bao giờ hiển thị đồng thời quá **5 - 7 trường dữ liệu** trong một khung nhìn duy nhất.
  - Đối với biểu mẫu $> 8$ trường: Bắt buộc phân tách thành **Trình hướng dẫn từng bước (`Multi-step Stepper / Wizard`)** hoặc **Ngăn xếp Accordion**.
  - Ẩn các trường nâng cao (`Advanced Settings`) phía sau toggle hoặc nút mở rộng, chỉ tiết lộ khi người dùng chủ động yêu cầu.

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Kiểm tra số lượng mục menu và số trường trong form
const navMenus = Array.from(document.querySelectorAll('nav, header ul, [role="menubar"]'));
const navAudit = navMenus.map(menu => {
  const directItems = menu.querySelectorAll(':scope > li, :scope > a, :scope > div > a');
  return {
    menu: menu.tagName + (menu.id ? '#' + menu.id : ''),
    itemCount: directItems.length,
    status: directItems.length <= 7 ? 'PASS' : 'VIOLATION_HICK_LAW'
  };
});

const forms = Array.from(document.querySelectorAll('form'));
const formAudit = forms.map(f => {
  const inputs = f.querySelectorAll('input:not([type="hidden"]), select, textarea');
  const steppers = f.querySelectorAll('[data-step], .step, .wizard-pane');
  return {
    formId: f.id || '(anonymous)',
    totalInputs: inputs.length,
    hasProgressiveDisclosure: steppers.length > 0 || inputs.length <= 7,
    status: (inputs.length <= 7 || steppers.length > 0) ? 'PASS' : 'VIOLATION_COGNITIVE_OVERLOAD'
  };
});
console.table(navAudit);
console.table(formAudit);
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Major)**: Header điều hướng phơi bày trực tiếp $> 8$ nút bấm song song không phân cấp; hoặc form đăng ký/checkout dài $> 10$ inputs tuôn trào trên 1 màn hình đơn độc không có phân đoạn.
* ✅ **PASS**: Hệ thống điều hướng tinh gọn $\le 6$ mục; form phức tạp được chia bước rõ ràng với thanh tiến độ (`Progress Bar`) trực quan.

---

### 🔵 2.3. Định Luật Miller (`Miller's Law`) — Phân Cụm Dữ Liệu (`Chunking Principle`)
*Dung lượng bộ nhớ ngắn hạn của một người trưởng thành trung bình chỉ có thể lưu giữ $7 \pm 2$ mẩu thông tin (`Chunks`) cùng một lúc.*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Nguyên Tắc Phân Cụm Thông Tin (`Data Chunking`)**:
  - Dữ liệu chuỗi ký tự số (Số điện thoại, Số thẻ tín dụng, Số tài khoản ngân hàng, Mã căn cước/MST, Mã OTP) **bắt buộc tự động định dạng ngắt quãng** thành từng cụm $3 - 4$ ký tự qua khoảng trắng hoặc dấu gạch nối:
    - *Số điện thoại*: `0912 345 678` (thay vì `0912345678`).
    - *Số thẻ*: `4111 2222 3333 4444` (thay vì `4111222233334444`).
    - *Mã xác thực OTP*: Chia thành các ô input độc lập 4 số hoặc 6 số `[ - ] [ - ] [ - ] [ - ]`.
* **Phân Tách Thẻ Bảng Điều Khiển (`Dashboard Bento Grid Chunking`)**:
  - Một màn hình tổng quan (`Executive Dashboard`) chỉ được chứa tối đa **4 - 6 thẻ chỉ số chính (`Key Metric KPI Cards`)**.
  - Khoảng cách phân tách quang học giữa các cụm (`Negative Space Separation`): Tối thiểu **$\ge 16 - 24\text{ px}$**, sử dụng đường viền phát quang siêu mảnh `border: 1px solid rgba(0,0,0,0.06)` và bóng đổ đa tầng mịn (`Luminous Layered Shadows`).
* **Danh sách Liệt kê (`Lists & Tables`)**:
  - Không để danh sách dài quá 7 dòng mà không có ngắt dòng (`Zebra striping`), ngắt phân trang (`Pagination`), hoặc nhóm theo danh mục (`Group headers`).

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Rà soát định dạng số thẻ tín dụng / số điện thoại / cụm dashboard
const textNodes = Array.from(document.querySelectorAll('p, span, td, .metric-value, .phone, .card-number'));
const unchunkedNumbers = textNodes.filter(n => {
  const text = n.innerText?.trim();
  // Bắt các chuỗi số dài >= 9 ký tự dính liền nhau
  return text && /^\d{9,19}$/.test(text.replace(/\s+/g, ''));
}).map(n => ({ text: n.innerText.trim(), tag: n.tagName, parent: n.parentElement?.className }));
console.log('Phát hiện chuỗi số chưa Chunking (Miller violation):', unchunkedNumbers);
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Major)**: Nhập hoặc hiển thị số thẻ thanh toán / CCCD / SĐT liền tù tì không có mask format; dashboard hiển thị $> 8$ metric cards nằm chen chúc không có cấu trúc phân cấp thị giác.
* ✅ **PASS**: Toàn bộ dữ liệu số dài được định dạng ngắt cụm chuẩn; giao diện phân cụm thông tin rành mạch, dễ quét bằng mắt (`Scannable Layout`).

---

### 🟣 2.4. Hiệu Ứng Von Restorff (`Isolation Effect & Prominence Ratio`) — Lực Hút Thị Giác
*Khi nhiều đối tượng đồng nhất cùng xuất hiện, đối tượng có sự khác biệt rõ rệt nhất so với các đối tượng còn lại sẽ được ghi nhớ và tác động mạnh mẽ nhất.*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Tỷ Lệ Nổi Bật Thị Giác (`Prominence Ratio`)**:
  - Nút kêu gọi hành động cốt lõi (`Primary CTA Button`) bắt buộc phải có tỷ lệ tương phản thị giác **tối thiểu 3:1** so với các nút phụ kế cận (`Secondary / Ghost CTA Button`).
  - *Phương pháp tính Perceived Visual Weight*:
    $$\text{Prominence Score} = (\text{Luminance Delta}) \times (\text{Area Ratio}) \times (\text{Font Weight Factor}) \times (\text{Elevation Weight})$$
* **Quy Tắc Một Điểm Nhấn Duy Nhất (`Single Primary Anchor Rule`)**:
  - Trong mỗi khung nhìn (`Viewport`) hoặc mỗi thẻ tương tác (`Action Card / Dialog`), **CHỈ ĐƯỢC PHÉP CÓ DUY NHẤT 1 NÚT PRIMARY CTA**.
  - Các nút khác bắt buộc dùng dạng `Outline`, `Ghost`, hoặc `Text Link`. Cấm tuyệt đối đặt 2 nút Primary cùng màu nền đặc rực rỡ cạnh nhau làm tê liệt quyết định của người dùng (`Choice Paralysis`).
* **Hiệu Ứng Ánh Sáng Phản Quang Luminous (`Luminous Ambient Glow`)**:
  - Nút Primary trong Luminous Light Theme phải sở hữu lớp bóng đổ vi quang học tương ứng với màu thương hiệu (ví dụ: `box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.25)`), tạo chiều sâu 3D sang trọng vượt trội so với các nút phụ phẳng.

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Kiểm tra cạnh tranh nút bấm trong cùng container
const buttonContainers = Array.from(document.querySelectorAll('form, .btn-group, .actions, .card-footer, header, dialog'));
const ctaViolations = buttonContainers.map(container => {
  const buttons = Array.from(container.querySelectorAll('button, a.btn, [role="button"]'));
  // Đếm số nút có style primary (nền đặc màu đậm, contrast cao)
  const primaryButtons = buttons.filter(b => {
    const style = window.getComputedStyle(b);
    const bg = style.backgroundColor;
    // Kiểm tra không phải nền trong suốt hoặc trắng nhạt
    return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && style.fontWeight >= 600;
  });
  if (primaryButtons.length > 1) {
    return {
      container: container.className || container.tagName,
      primaryCount: primaryButtons.length,
      buttons: primaryButtons.map(b => b.innerText?.trim())
    };
  }
  return null;
}).filter(Boolean);
console.table(ctaViolations);
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Critical/Major)**: Xuất hiện 2 nút Primary CTA cùng màu nổi bật trong cùng 1 modal dialog (ví dụ: cả nút "Xóa vĩnh viễn" và "Hủy" đều tô nền đỏ đặc hoặc xanh đặc giống hệt nhau).
* ❌ **FAIL (Major)**: Nút hành động chính bị chìm màu vào background (Contrast ratio nút so với nền trang $< 3:1$).
* ✅ **PASS**: Hệ thống phân cấp nút bấm 3 tầng nghiêm ngặt (`Primary Accent` $\to$ `Secondary Outline` $\to$ `Tertiary Ghost/Text`).

---

### 🟠 2.5. Định Luật Jakob (`Jakob's Law`) — Mô Hình Tâm Trí Chuẩn Mực (`Universal Mental Models`)
*Người dùng dành phần lớn thời gian trên các trang web và ứng dụng khác. Điều này có nghĩa là người dùng muốn trang web của bạn hoạt động theo cùng một cách như tất cả các trang web khác mà họ đã biết.*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Tọa Độ Neo Bất Biến Của Các Thành Phần Cốt Lõi (`Canonical Placement Invariants`)**:
  - **Logo Thương hiệu / Nút Về Trang Chủ**: Bắt buộc neo tại **Góc trên bên trái (`Top-Left Header`)**, click vào luôn điều hướng về trang chủ (`/`).
  - **Giỏ Hàng (`Cart Icon`) / Tài Khoản Cá Nhân (`Profile Avatar`) / Thông Báo (`Notification Bell`)**: Bắt buộc neo tại **Góc trên bên phải (`Top-Right Header`)**.
  - **Thanh Tìm Kiếm Toàn Cục (`Global Search`)**: Neo tại **Trung tâm Header** hoặc cung cấp phím tắt kinh điển **`Cmd + K / Ctrl + K`**.
  - **Thao tác Hủy Bỏ / Đóng Khung Thoát (`Cancel / Close Dialog`)**:
    - Nút đóng `✕` luôn neo tại **Góc trên bên phải của Modal / Drawer / Banner**.
    - **Phím `Escape (Esc)`** trên bàn phím bắt buộc phải đóng ngay lập tức bất kỳ Popup, Modal, Drawer, Lightbox đang mở.
    - Click vào lớp phủ mờ (`Backdrop Click`) phải đóng modal (trừ trường hợp dialog xác nhận hành động nguy hiểm có dirty form data).
  - **Thanh Điều Hướng Bánh Mì Vụn (`Breadcrumbs`)**: Neo ngay dưới thanh điều hướng chính, phía trên tiêu đề `H1` của trang.
* **Liên kết Mở Tab Mới (`External Links`)**:
  - Phải có biểu tượng mũi tên chéo `↗` hoặc thuộc tính trợ năng thông báo mở cửa sổ mới để không làm đứt đoạn mô hình điều hướng quay lại (`Back button expectation`).

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Kiểm tra vị trí Logo, Giỏ hàng và tính năng phím Escape của Modal
const header = document.querySelector('header');
const headerRect = header ? header.getBoundingClientRect() : null;

// Kiểm tra Logo nằm nửa trái
const logo = document.querySelector('header a[href="/"], header .logo, header img');
const isLogoLeft = logo ? logo.getBoundingClientRect().left < (window.innerWidth / 2) : false;

// Kiểm tra Cart / User nằm nửa phải
const cartOrUser = document.querySelector('header .cart, header .user-menu, header [aria-label*="cart"], header [aria-label*="profile"]');
const isCartRight = cartOrUser ? cartOrUser.getBoundingClientRect().right > (window.innerWidth / 2) : true;

// Kiểm tra phím Escape trên modal đang mở
const openModal = document.querySelector('[role="dialog"], .modal.open, dialog[open]');
let escHandlerActive = false;
if (openModal) {
  // Bắn sự kiện phím Escape giả lập
  const event = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true });
  document.dispatchEvent(event);
  escHandlerActive = !document.querySelector('[role="dialog"]:not([style*="display: none"]), dialog[open]');
}

console.log({ isLogoLeft, isCartRight, escHandlerActive });
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Blocker)**: Modal pop-up không phản hồi với phím `Esc` hoặc không có nút đóng `✕` ở góc trên bên phải.
* ❌ **FAIL (Major)**: Logo thương hiệu đặt lệch lạc ở góc phải hoặc footer mà không có logo ở header; giỏ hàng đặt bất thường bên lề trái.
* ✅ **PASS**: 100% tuân thủ mô hình tâm trí phổ quát của web hiện đại.

---

### 🔴 2.6. Hiệu Ứng Đỉnh - Kết (`Peak-End Rule`) — Khoảnh Khắc Thăng Hoa & Xoa Dịu Ma Sát
*Con người đánh giá một trải nghiệm phần lớn dựa trên cách họ cảm nhận ở điểm cao trào nhất (`Peak`) và ở điểm kết thúc (`End`), thay vì dựa trên tổng thể hoặc giá trị trung bình của toàn bộ trải nghiệm.*

#### 1. Chỉ số Kỹ thuật Định lượng Bắt buộc (`Quantitative Metrics`)
* **Khoảnh Khắc Đích Đến Luồng Nghiệp Vụ (`Flow Completion Destination`)**:
  - Áp dụng cho các trang xác nhận cốt lõi: Hoàn tất đơn hàng (`Order Success`), Đăng ký thành công (`Sign-up Complete`), Nộp hồ sơ (`Application Submitted`), Đạt mốc học tập (`Achievement Unlocked`).
  - **Bắt buộc triển khai Khoảnh Khắc Thăng Hoa Vi Mô (`Micro-Celebration Moment`)**:
    1. **Hiệu ứng Hạt Pháo Hoa (`Canvas Confetti Particles`)**: Bắn pháo hoa giấy đa sắc nhẹ nhàng trong $2.0 - 2.5\text{s}$ (không giật lag, đạt chuẩn 60 FPS).
    2. **Biểu tượng Thành công Đàn hồi (`Spring Checkmark`)**: Icon tích xanh nảy bung với đường cong lò xo vật lý `cubic-bezier(0.34, 1.56, 0.64, 1)`.
    3. **Âm thanh Xúc giác Kỹ thuật số (`WebAudioHaptics Chime`)**: Tần số nốt thăng vui tươi nhẹ nhàng ($587\text{Hz} \to 880\text{Hz}$) kèm độ rung nhẹ trên thiết bị hỗ trợ `navigator.vibrate([15, 30, 20])`.
    4. **Lộ Trình Tiếp Theo Rõ Ràng (`Clear Next Step Path`)**: Cung cấp ngay mã đơn hàng, nút "Xem chi tiết đơn", "Tiếp tục khám phá" hoặc "Tải hóa đơn PDF" — không bao giờ để người dùng rơi vào ngõ cụt (`Dead End`).
* **Xoa Dịu Đỉnh Tiêu Cực (`Negative Peak Mitigation`)**:
  - **Trang Lỗi 404 & 500**: Tuyệt đối không dùng thông báo lỗi kỹ thuật thô ráp (`Exception stack trace`). Phải sử dụng hình ảnh minh họa ấm áp, ngôn từ xoa dịu đồng cảm, kèm nút cứu hộ: `[Quay về Trang chủ]` và `[Tìm kiếm lại]`.
  - **Validation Báo Lỗi Form**: Thông báo lỗi hiển thị ngay cạnh trường nhập liệu (`Inline Inline Validation`), hướng dẫn cách sửa cụ thể (thay vì câu chung chung "Dữ liệu không hợp lệ").

#### 2. Kịch bản Đo đạc Tự động (`Automated CDP / DOM Script`)
```javascript
// Kiểm tra sự hiện diện của Micro-Celebration và Next Step trên trang Success
const isSuccessPage = /success|thank-you|complete|confirmed/i.test(window.location.pathname + document.title);
if (isSuccessPage) {
  const hasConfetti = !!document.querySelector('canvas.confetti, #confetti-canvas, [data-confetti]');
  const hasSuccessIcon = !!document.querySelector('.success-checkmark, svg[class*="check"], [data-icon="success"]');
  const hasNextStepCta = Array.from(document.querySelectorAll('a, button')).some(b => 
    /tiếp tục|xem đơn|về trang chủ|download|hoàn tất/i.test(b.innerText)
  );
  console.log('Peak-End Audit Result:', {
    isSuccessPage,
    hasConfetti,
    hasSuccessIcon,
    hasNextStepCta,
    delightScorePass: (hasSuccessIcon && hasNextStepCta)
  });
}
```

#### 3. Tiêu chí Đạt / Không đạt (`Pass/Fail Rubric`)
* ❌ **FAIL (Major)**: Sau khi thanh toán/gửi form thành công, trang màn hình chỉ hiện một dòng chữ đơn điệu hoặc reload trắng bệch không có trạng thái chúc mừng; hoặc đưa người dùng vào ngõ cụt không có nút thoát.
* ⚠️ **WARN (Delight Penalty)**: Trang thành công có nội dung nhưng không có hiệu ứng chuyển động thăng hoa (trừ $-0.5$ điểm vào `Delight & Craftsmanship Score`).
* ✅ **PASS**: Đạt trọn vẹn điểm thăng hoa cảm xúc với animation mượt mà, âm thanh xúc giác tinh tế và đường dẫn kế tiếp rõ ràng.

---

## 📊 3. Bảng Chấm Điểm Nhận Thức Định Lượng (`Cognitive UX Scorecard - 100 Điểm`)

Hội đồng thẩm định `$test` (Pod 3) áp dụng bảng phân bổ điểm số sau để tính điểm thành phần Nhận thức (`Cognitive Sub-score`):

| STT | Định Luật Nhận Thức | Trọng Số Điểm | Tiêu Chí Đo Lường Cốt Lõi | Mức Phạt Tối Đa Khi Vi Phạm |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Fitts's Law** | **20 điểm** | Mục tiêu chạm mobile $\ge 44\text{px}$, desktop $\ge 36\text{px}$; CTA neo trong Thumb Zone | -5 điểm / vi phạm kích thước; -10 điểm nếu CTA ngoài tầm với |
| **2** | **Hick-Hyman Law** | **15 điểm** | Menu chính $\le 7$ mục; form phức tạp có Progressive Disclosure chia bước wizard | -5 điểm nếu menu $>7$; -10 điểm nếu form $>8$ inputs không chia bước |
| **3** | **Miller's Law** | **15 điểm** | Tự động phân cụm số thẻ, CCCD, SĐT; Dashboard $\le 6$ thẻ KPI với khoảng cách $\ge 16\text{px}$ | -5 điểm nếu số dài không chunking; -5 điểm nếu dashboard quá tải |
| **4** | **Von Restorff** | **20 điểm** | Primary CTA duy nhất mỗi viewport; tương phản thị giác $\ge 3:1$ so với nút phụ | -10 điểm nếu 2 nút Primary tranh chấp; -10 điểm nếu CTA chìm |
| **5** | **Jakob's Law** | **15 điểm** | Logo trên-trái, Giỏ hàng trên-phải; Modal đóng bằng phím `Esc` và click backdrop | -10 điểm nếu phím Esc không đóng modal; -5 điểm nếu vị trí nghịch thói quen |
| **6** | **Peak-End Rule** | **15 điểm** | Micro-celebration (confetti, spring checkmark, chime) tại điểm đích; 404 xoa dịu | -5 điểm nếu thiếu celebration; -10 điểm nếu trang đích là ngõ cụt |
| **Σ** | **TỔNG CỘNG** | **100 điểm** | **Yêu cầu nghiệm thu tối thiểu**: **$\ge 85 / 100\text{ điểm}$** (Tương đương $\ge 8.5/10$) | |

---

## ⚙️ 4. Kịch Bản Đo Kiểm Tự Động Hóa Toàn Diện (`Comprehensive Automated Headless Audit Script`)

Kiểm toán viên độc lập hoặc test runner có thể chạy trực tiếp kịch bản sau qua công cụ Chrome DevTools Protocol (`cdp_evaluate_script`) hoặc Playwright/Puppeteer để tự động chấm điểm:

```javascript
(async function runCognitiveUXAudit() {
  const report = {
    timestamp: new Date().toISOString(),
    score: 100,
    findings: [],
    details: {}
  };

  // 1. FITTS'S LAW AUDIT
  const interactiveEls = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]'));
  const isMobile = window.innerWidth <= 768;
  const minTarget = isMobile ? 44 : 36;
  let fittsErrors = 0;

  interactiveEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0) {
      if (r.width < minTarget || r.height < minTarget) {
        fittsErrors++;
        if (fittsErrors <= 3) {
          report.findings.push({ law: "Fitts's Law", severity: "MAJOR", message: `Mục tiêu chạm bé [${Math.round(r.width)}x${Math.round(r.height)}px < ${minTarget}px]: ${el.innerText?.slice(0, 15) || el.tagName}` });
        }
      }
    }
  });
  if (fittsErrors > 0) {
    report.score -= Math.min(20, fittsErrors * 4);
  }
  report.details.fitts = { totalChecked: interactiveEls.length, violations: fittsErrors };

  // 2. HICK'S LAW AUDIT
  const navItems = document.querySelectorAll('header nav > ul > li, header nav > a, [role="menubar"] > [role="menuitem"]');
  if (navItems.length > 7) {
    report.score -= 5;
    report.findings.push({ law: "Hick's Law", severity: "MAJOR", message: `Thanh điều hướng chính có ${navItems.length} mục (> 7 mục tối đa)` });
  }
  const unsteppedForms = Array.from(document.querySelectorAll('form')).filter(f => {
    const inputs = f.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const steppers = f.querySelectorAll('[data-step], .step, .wizard-pane');
    return inputs.length > 8 && steppers.length === 0;
  });
  if (unsteppedForms.length > 0) {
    report.score -= 10;
    report.findings.push({ law: "Hick's Law", severity: "CRITICAL", message: `Form phức tạp có ${unsteppedForms.length} biểu mẫu > 8 trường mà không có Progressive Disclosure (chia bước wizard)` });
  }

  // 3. MILLER'S LAW AUDIT
  const rawNumbers = Array.from(document.querySelectorAll('p, span, td, .card-number')).filter(el => {
    const txt = el.innerText?.trim();
    return txt && /^\d{10,19}$/.test(txt);
  });
  if (rawNumbers.length > 0) {
    report.score -= 5;
    report.findings.push({ law: "Miller's Law", severity: "MAJOR", message: `Phát hiện ${rawNumbers.length} chuỗi số dài không được Chunking phân cụm (ví dụ: ${rawNumbers[0].innerText.slice(0, 12)}...)` });
  }

  // 4. VON RESTORFF AUDIT
  const actionGroups = Array.from(document.querySelectorAll('.actions, .btn-group, .card-footer, dialog, form'));
  let duplicatePrimaryCount = 0;
  actionGroups.forEach(grp => {
    const btns = Array.from(grp.querySelectorAll('button, a.btn, [role="button"]'));
    const primaries = btns.filter(b => {
      const st = window.getComputedStyle(b);
      return st.backgroundColor !== 'rgba(0, 0, 0, 0)' && st.backgroundColor !== 'transparent' && st.fontWeight >= 600;
    });
    if (primaries.length > 1) {
      duplicatePrimaryCount++;
    }
  });
  if (duplicatePrimaryCount > 0) {
    report.score -= 10;
    report.findings.push({ law: "Von Restorff", severity: "MAJOR", message: `Phát hiện ${duplicatePrimaryCount} cụm nút có nhiều hơn 1 Primary CTA tranh chấp thị giác` });
  }

  // 5. JAKOB'S LAW AUDIT
  const logo = document.querySelector('header a[href="/"], header .logo, header img');
  if (logo && logo.getBoundingClientRect().left > (window.innerWidth / 2)) {
    report.score -= 5;
    report.findings.push({ law: "Jakob's Law", severity: "MINOR", message: "Logo trang chủ bị đặt ở nửa phải màn hình (vi phạm thói quen người dùng)" });
  }

  // 6. TỔNG KẾT
  report.score = Math.max(0, report.score);
  report.verdict = report.score >= 85 ? "COGNITIVE_UX_PASS" : "COGNITIVE_UX_REJECT";
  return report;
})();
```

---

## 🔗 5. Tích Hợp Vào Báo Cáo Sổ Cái Bằng Chứng (`Evidence Ledger Integration`)

Khi `Subagent 2 — Visual & Accessibility Inspector` thực hiện thẩm định giao diện, mục **Audit 2 (Thăng hoa & Tinh xảo — Delight & Craftsmanship)** bắt buộc phải xuất trình mục con:

```yaml
cognitive_ux_audit:
  score: 92 # Trên thang 100
  verdict: "COGNITIVE_UX_PASS" # COGNITIVE_UX_PASS | COGNITIVE_UX_REJECT
  fitts_compliance: true # 100% interactive elements >= 44x44px mobile
  hick_compliance: true # Menu <= 6 items, progressive disclosure form verified
  miller_chunking_verified: true # Credit cards, OTP, phone numbers cleanly formatted
  von_restorff_prominence_ratio: 3.4 # Ratio >= 3:1 achieved
  jakob_universal_conventions: true # Logo top-left, cart top-right, Esc modal verified
  peak_end_delight_verified: true # Confetti and spring checkmark trigger on success
  findings: []
```

Nếu `cognitive_ux_audit.score < 85`:
$\to$ Toàn bộ `Delight & Craftsmanship Score` bị đánh tụt xuống dưới ngưỡng tiêu chuẩn ($< 8.5/10$).
$\to$ Ban hành phán quyết **`TEST_FAIL`** hoặc **`TEST_PASS_WITH_FINDINGS`**, yêu cầu Developer tái cấu trúc trải nghiệm nhận thức trước khi xin lệnh phát hành từ Anh.
