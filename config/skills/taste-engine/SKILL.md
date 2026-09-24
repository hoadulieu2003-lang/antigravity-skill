---
name: taste-engine
description: "Siêu Động Cơ Gu Thẩm Mỹ UI/UX & Chống Rác AI (Taste Engine & Anti-AI Slop). Định hình phong cách độc bản cho landing pages, portfolios, SaaS và redesigns. Điều hướng 3 Dial cốt lõi (Variance 8, Motion 6, Density 4), triệt tiêu các đặc trưng khuôn mẫu AI (Anti-AI Tells), tuân thủ nghiêm ngặt chuẩn mực Luminous Light Theme Invariant và độ tương phản WCAG AA."
---

# Taste Engine: Triết Lý Thẩm Mỹ Độc Bản & Bộ Quy Tắc Chống Rác AI (Anti-AI Slop)

> **Mục tiêu chuyên biệt**: Landing pages, portfolios (hồ sơ năng lực), trang giới thiệu sản phẩm SaaS và các dự án thiết kế lại (redesigns). Không áp dụng cho dashboard nội bộ, bảng dữ liệu thuần túy hay biểu mẫu nhiều bước.  
> **Nguồn gốc tri thức (Upstream Heritage)**: Kế thừa và tinh chỉnh sâu rộng từ `Leonxlnx/taste-skill` (https://github.com/Leonxlnx/taste-skill).  
> **Quy tắc ngữ cảnh (Contextual Execution)**: Không tự động kích hoạt máy móc. Luôn luôn đọc vị bối cảnh (Brief Inference) trước khi điều chỉnh các tham số thiết kế.  
> **Quy chuẩn bất biến tối cao**: Mặc định 100% Giao diện Sáng Đa Tầng Luminous (Luminous Light Theme Invariant). Giao diện tối chỉ triển khai khi có yêu cầu tường minh từ Anh.

---

## 0. BRIEF INFERENCE (Đọc Vị Bối Cảnh - Read the Room)

Trước khi viết bất kỳ dòng mã HTML/CSS/Tailwind nào, hệ thống **bắt buộc phải đọc vị chính xác mong muốn thực sự của người dùng**. Hầu hết sản phẩm giao diện do AI tạo ra bị đánh giá thấp vì mô hình nhảy ngay vào một thẩm mỹ mặc định nông cạn thay vì thấu hiểu bối cảnh.

### 0.A Đọc các tín hiệu đầu vào (Read Signals)
1. **Loại trang (Page kind)**: Landing page (SaaS / Tiêu dùng / Agency / Sự kiện), Portfolio (Kỹ sư phần mềm / Nhà thiết kế / Studio sáng tạo), Redesign (Bảo tồn nhận diện cũ vs Đại tu toàn diện), Bài viết / Tạp chí (Editorial).
2. **Từ khóa cảm xúc (Vibe words)**: "Minimalist (Tối giản)", "Calm (Điềm tĩnh)", "Linear-style (Chuẩn Linear)", "Awwwards (Đột phá)", "Brutalist (Thô mộc)", "Apple-y (Tinh tế kiểu Apple)", "Playful (Vui tươi)", "Serious B2B (Doanh nghiệp nghiêm túc)".
3. **Tín hiệu tham chiếu (Reference signals)**: URL được đính kèm, ảnh chụp màn hình mockup, sản phẩm được nhắc tên, thương hiệu cạnh tranh trực tiếp.
4. **Đối tượng khán giả (Audience)**: Hội đồng thẩm định mua hàng B2B vs Người tiêu dùng chú trọng thẩm mỹ vs Nhà tuyển dụng quét portfolio. Đối tượng tiếp nhận quyết định thẩm mỹ, không phải sở thích tùy tiện của AI.
5. **Tài sản thương hiệu hiện có (Brand assets)**: Logo, màu sắc nhận diện, kiểu chữ, ảnh chụp sản phẩm thực tế.
6. **Ràng buộc khắt khe (Quiet constraints)**: Đối tượng cần khả năng tiếp cận cao (Accessibility-first), cơ quan nhà nước, ngành tài chính/pháp lý được kiểm soát chặt chẽ, trang thương mại lấy chữ tín làm đầu. Các ràng buộc này CÓ QUYỀN PHỦ QUYẾT thẩm mỹ cá nhân.

### 0.B Tuyên bố "Đọc Vị Thiết Kế" (Design Read) một dòng trước khi code
Trước khi xuất bất kỳ khối mã nào, xuất ra một câu nhận định chuẩn mực:  
👉 **"Reading this as: <loại trang> for <đối tượng>, with a <phong cách cảm xúc> language, leaning toward <hệ thống thiết kế hoặc trường phái thẩm mỹ>."**

*Ví dụ:*
- *"Reading this as: B2B SaaS landing for technical buyers, with a Linear-style minimalist language, leaning toward Tailwind v4 utilities + Geist + restrained motion."*
- *"Reading this as: solo designer portfolio for hiring managers, with an editorial / kinetic-type language, leaning toward native CSS + scroll-driven animation + custom typography."*

### 0.C Kỷ luật làm rõ khi mơ hồ (Clarification Discipline)
Chỉ đặt đúng **MỘT câu hỏi làm rõ** duy nhất khi hai hướng thẩm mỹ phân kỳ sâu sắc (ví dụ: *"Anh muốn trang này đi theo phong cách Linear-clean tối giản hay phong cách Awwwards-experimental giàu tính thử nghiệm?"*). Nếu ngữ cảnh đã đủ rõ, **tuyệt đối không hỏi**, công bố bản Design Read và bắt tay vào việc ngay.

### 0.D Kỷ luật chống khuôn mẫu mặc định (Anti-Default Discipline)
Tuyệt đối KHÔNG tự động rơi vào các bẫy mặc định của AI:
- Nền đen lưới gradient tím AI (AI-purple gradients on dark mesh).
- Hero căn giữa với 3 thẻ tính năng giống hệt nhau (Centered hero + 3 equal feature cards).
- Hiệu ứng kính mờ (Glassmorphism) vô tội vạ trên mọi khối tử.
- Hoạt ảnh vi mô lặp vô tận trên mọi thẻ (Infinite-loop micro-animations everywhere).
- Font mặc định Inter + Slate-900.

---

## 1. THE THREE DIALS (Bộ Ba Con Số Cấu Hình Cốt Lõi)

Sau khi đưa ra Design Read, thiết lập ngay 3 con số điều hướng. Mọi quyết định về bố cục, chuyển động và mật độ thông tin đều chịu sự chi phối của bộ ba này:

* **`DESIGN_VARIANCE: 8`** (Biên độ biến thiên thiết kế: 1 = Đối xứng tuyệt đối / Cân đối hoàn hảo, 10 = Hỗn loạn nghệ thuật / Phá cách mạnh bạo).
* **`MOTION_INTENSITY: 6`** (Cường độ chuyển động: 1 = Tĩnh lặng hoàn toàn / Static, 10 = Điện ảnh & Vật lý chân thực / Cinematic Physics).
* **`VISUAL_DENSITY: 4`** (Mật độ thị giác: 1 = Phòng triển lãm nghệ thuật / Thoáng đãng, 10 = Buồng lái máy bay / Dữ liệu cô đọng).

**Điểm cơ sở chuẩn mực (Baseline):** `8 / 6 / 4`. Luôn sử dụng bộ chỉ số này làm mặc định trừ khi bản Design Read hoặc Anh yêu cầu ghi đè.

### 1.A Ma trận suy luận Dial từ tín hiệu (Dial Inference Matrix)
| Tín hiệu bối cảnh | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY |
|---|---|---|---|
| "Minimalist / Clean / Calm / Editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "Premium Consumer / Apple-y / Luxury / Brand" | 7-8 | 5-7 | 3-4 |
| "Playful / Wild / Dribbble / Awwwards / Agency" | 9-10 | 8-10 | 3-4 |
| "Landing Page / Portfolio / Marketing Site (Default)" | **8** | **6** | **4** |
| "Trust-first / B2B Regulated / Accessibility-critical" | 3-4 | 2-3 | 4-5 |
| "Redesign - Preserve (Bảo tồn nhận diện cũ)" | Khớp hiện trạng | Hiện trạng + 1 | Khớp hiện trạng |
| "Redesign - Overhaul (Lột xác toàn diện)" | Hiện trạng + 2 | Hiện trạng + 2 | Khớp hiện trạng |

### 1.B Bảng thiết lập mẫu theo bài toán (Use-Case Presets)
| Nghiệp vụ cụ thể | VARIANCE | MOTION | DENSITY | Gợi ý phong cách |
|---|---|---|---|---|
| Landing SaaS đại chúng | 7 | 6 | 4 | Tối giản, tương phản cao, thẻ bất đối xứng |
| Landing Agency / Studio sáng tạo | 9 | 8 | 3 | Kiểu chữ động, scrollytelling, phá vỡ lưới |
| Landing Sản phẩm tiêu dùng cao cấp | 7 | 6 | 3 | Ảnh packshot thực tế, ánh kim loại, nhịp điệu chậm |
| Portfolio Nhà thiết kế / Giám đốc nghệ thuật | 8 | 7 | 3 | Lưới bất đối xứng, zoom ảnh, tương tác con trỏ |
| Portfolio Kỹ sư phần mềm | 6 | 5 | 4 | Khối code sắc nét, micro-interactions tinh tế |
| Tạp chí điện tử / Blog chuyên sâu | 6 | 4 | 3 | Font chữ có chân được tuyển chọn, dàn trang đa cột |
| Dịch vụ công / Hệ thống an toàn cao | 3 | 2 | 5 | Đơn giản, rõ ràng, tuân thủ WCAG AAA |

---

## 2. BRIEF TO DESIGN SYSTEM MAP (Bản Đồ Ánh Xạ Hệ Thống Thiết Kế)

Không tự chế lại CSS cho những thứ đã có thư viện chuẩn hóa. Tuyệt đối không giả mạo một phong trào thẩm mỹ thành một hệ thống chính quy.

### 2.A Khi nào cần tích hợp Hệ Thống Thiết Kế Chính Quy (Official Design Systems)
| Đọc vị bối cảnh… | Thư viện chính quy bắt buộc | Lý do kỹ thuật |
|---|---|---|
| Microsoft / Doanh nghiệp lớn / B2B SaaS | `@fluentui/react-components` | Chuẩn token Microsoft, tích hợp accessibility hoàn chỉnh |
| Hệ sinh thái Google / Material Design | `@material/web` + Material 3 tokens | Chuẩn M3 chính hãng, hỗ trợ theming động |
| B2B Doanh nghiệp kiểu IBM / Phân tích dữ liệu | `@carbon/react` + `@carbon/styles` | Thư viện Carbon hoàn thiện cho mật độ thông tin cao |
| Ứng dụng quản trị Shopify | `@shopify/polaris` | Chuẩn bắt buộc cho Shopify admin UI |
| Quản lý công việc Atlassian / Jira | `@atlaskit/tokens` + components | Đúng chuẩn Atlassian Design System |
| Công cụ lập trình viên kiểu GitHub | `@primer/react-brand` hoặc `@primer/css` | Chuẩn Primer Brand cho marketing kỹ thuật |
| Dịch vụ công Anh / Mỹ | `govuk-frontend` / `uswds` | Bắt buộc theo quy chuẩn nhà nước |
| Nền tảng React hiện đại, chuẩn tiếp cận | `@radix-ui/themes` | Primitives mượt mà kết hợp token chuẩn |
| Ứng dụng SaaS tự làm chủ mã nguồn | `shadcn/ui` (`npx shadcn@latest add ...`) | Sở hữu code trực tiếp, cấm để trạng thái mặc định |
| Trang marketing hiện đại tốc độ cao | Tailwind v4 utilities | Siêu nhẹ, linh hoạt, hỗ trợ container queries |

**Nguyên tắc trung thực**: Khi bối cảnh yêu cầu các hệ thống trên, hãy cài đặt gói chính thức. Không tự viết lại CSS bằng tay. Không trộn lẫn Fluent với Carbon trong cùng một dự án.

### 2.B Khi bối cảnh là một Phong Cách Thẩm Mỹ (Aesthetic), không phải Design System
Các phong cách dưới đây KHÔNG có một gói thư viện chính thức duy nhất. Phải kết hợp Tailwind + CSS thuần + thư viện chuyên trách:
- **Glassmorphism (Kính mờ)**: Dùng `backdrop-filter`, viền phát sáng đa lớp (`border-white/10`), bóng đổ bên trong (`shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`). Luôn có phương án dự phòng nền đặc cho người dùng bật chế độ `prefers-reduced-transparency`.
- **Bento Grid (Lưới Bento dạng khay)**: Sử dụng CSS Grid với các ô kích thước đan xen, tỷ lệ co giãn linh hoạt.
- **Brutalism (Thô mộc hiện đại)**: CSS nguyên bản, font monospace, đường viền đen đậm, bóng cứng không làm mờ (`shadow-[4px_4px_0px_#000]`).
- **Editorial (Báo chí / Tạp chí cao cấp)**: Kiểu chữ serif tuyển chọn, lưới dàn trang bất đối xứng, khoảng trắng hào phóng.
- **Liquid Glass (Kính lỏng Apple)**: Apple chỉ hỗ trợ nền tảng của họ. Trên Web, đây là giải pháp mô phỏng ánh sáng phản xạ và khúc xạ qua `backdrop-filter` và gradient góc cạnh. Cần ghi chú minh bạch trong code.

---

## 3. DEFAULT ARCHITECTURE & CONVENTIONS (Kiến Trúc & Quy Ước Mã Nguồn)

Trừ khi bài toán yêu cầu một thư viện chuyên biệt (Mục 2.A), đây là bộ khung mặc định:

### 3.A Bộ công nghệ chuẩn (Tech Stack)
* **Framework**: React / Next.js. Mặc định tận dụng React Server Components (RSC).
  * **An toàn RSC**: State toàn cục chỉ hoạt động trong Client Components. Wrap provider trong component có `"use client"`.
  * **Cô lập tương tác (Interactivity Isolation)**: Mọi component sử dụng Motion, Scroll listener hoặc Pointer physics BẮT BUỘC phải là lá component (leaf component) được đánh dấu `'use client'` ở dòng đầu tiên. RSC chỉ render khung tĩnh.
* **Styling**: **Tailwind v4** (mặc định). Tránh plugin kiểu cũ trong postcss.config.js; dùng `@tailwindcss/postcss` hoặc Vite plugin.
* **Hoạt ảnh & Chuyển động**: **Motion** (tên gọi hiện tại của Framer Motion). Import từ `motion/react` (`import { motion } from "motion/react"`).
* **Typography**: Mặc định font nội bộ qua `next/font` hoặc tự host qua `@font-face` với `font-display: swap`. Không tải font Google Fonts trực tiếp qua thẻ `<link>` ngoài production.

### 3.B Quản lý trạng thái (State Management)
* `useState` / `useReducer` cục bộ cho UI độc lập.
* State toàn cục (Zustand, Jotai, Context) chỉ dùng khi cần tránh truyền prop quá sâu.
* **TUYỆT ĐỐI KHÔNG dùng `useState` để theo dõi các giá trị biến thiên liên tục** như tọa độ chuột, tiến trình cuộn trang, gia tốc con trỏ. Việc này khiến toàn bộ cây React render lại liên tục và gây giật khung hình trên thiết bị di động. Bắt buộc dùng `useMotionValue`, `useTransform`, `useScroll` của Motion.

### 3.C Thư viện Icon
* **Thứ tự ưu tiên**: `@phosphor-icons/react` $\to$ `hugeicons-react` $\to$ `@radix-ui/react-icons` $\to$ `@tabler/icons-react`.
* Hạn chế `lucide-react` làm mặc định (chỉ dùng khi dự án đã có sẵn hoặc Anh yêu cầu).
* **CẤM TỰ VẼ SVG ICON BẰNG TAY**: Không tự viết path SVG icon thủ công. Hãy dùng gói icon chính thức.
* Chuẩn hóa `strokeWidth` đồng nhất toàn trang (ví dụ: `1.5` hoặc `2.0`).

### 3.D Kỷ luật Emoji
Mặc định KHÔNG dùng emoji trong code, thẻ markup và nội dung hiển thị để làm icon thay thế. Hãy thay bằng icon vector chuẩn. Chỉ dùng emoji khi brief nêu rõ phong cách trò chuyện mạng xã hội (playful chat vibe).

### 3.E Độ ổn định Viewport & Bố cục Responsive
* Chuẩn hóa breakpoints: `sm (640px)`, `md (768px)`, `lg (1024px)`, `xl (1280px)`, `2xl (1536px)`.
* Giới hạn độ rộng container: `max-w-[1400px] mx-auto` hoặc `max-w-7xl`.
* **Độ ổn định Viewport (Viewport Stability)**: TUYỆT ĐỐI KHÔNG dùng `h-screen` cho Hero section vì gây giật layout khi thanh địa chỉ Safari trên mobile ẩn/hiện. BẮT BUỘC dùng `min-h-[100dvh]`.
* **CSS Grid thay vì Flex-Math**: Thay vì tính toán phần trăm phức tạp (`w-[calc(33%-1rem)]`), luôn sử dụng CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`).

---

## 4. DESIGN ENGINEERING DIRECTIVES & BIAS CORRECTION (Chỉ Thị Kỹ Thuật & Khắc Phục Thiên Kiến AI)

Mô hình AI thường mắc các lỗi thẩm mỹ rập khuôn. Dưới đây là các quy tắc điều chỉnh bắt buộc:

### 4.1 Typography (Nghệ thuật Kiểu chữ)
* **Tiêu đề chính (Display / Headlines)**: `text-4xl md:text-6xl tracking-tighter leading-none`.
* **Đoạn văn bản (Body)**: `text-base text-gray-600 leading-relaxed max-w-[65ch]`.
* **Lựa chọn Sans-serif**:
  * Tránh dùng `Inter` làm mặc định vô thức. Hãy ưu tiên `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`.
  * Chỉ dùng Inter khi brief yêu cầu độ trung tính thuần túy kiểu Linear hoặc trang chính phủ.
* **Cặp phông chữ đề xuất**: `Geist` + `Geist Mono`, `Satoshi` + `JetBrains Mono`, `Cabinet Grotesk` + `Inter Tight`.
* **KỶ LUẬT VỚI FONT SERIF (CÓ CHÂN)**:
  * Serif bị hạn chế cao độ làm font mặc định. AI thường nhầm tưởng "hễ sáng tạo, sang trọng là phải dùng Serif".
  * Serif chỉ được chấp nhận khi: brief ghi rõ tên font serif, HOẶC phong cách thuần túy là xuất bản phẩm / sách / di sản xa xỉ và bạn chứng minh được lý do cụ thể.
  * CẤM DÙNG LÀM MẶC ĐỊNH: `Fraunces` và `Instrument_Serif` (hai phông AI ưa thích lạm dụng nhất).
  * Khi nhấn mạnh từ ngữ trong câu tiêu đề: dùng **chữ nghiêng (italic) hoặc chữ đậm (bold) của CÙNG một họ font**. Tuyệt đối không chèn một từ Serif vào giữa câu tiêu đề Sans-serif.
* **KHOẢNG HỞ CHÂN CHỮ NGHIÊNG (Italic Descender Clearance)**:
  * Khi dùng chữ nghiêng ở font display lớn có chứa các chữ cái có đuôi rơi xuống dưới dòng kẻ (`y`, `g`, `j`, `p`, `q`), nếu đặt `leading-none` sẽ làm cụt đuôi chữ.
  * Bắt buộc dùng `leading-[1.1]` tối thiểu và dự trữ `pb-1` hoặc `mb-1` cho phần tử bao ngoài.

### 4.2 Color Calibration & Khóa Bảng Màu (Hiệu Chuẩn Màu Sắc)
* Tối đa 1 màu nhấn (accent color). Độ bão hòa (saturation) < 80% theo mặc định.
* **QUY TẮC LILA (The Lila Rule)**: Cấm tiệt hào quang tím AI (AI purple glow) hoặc gradient neon ngẫu nhiên trên nút bấm. Sử dụng màu nền trung tính (Zinc / Slate / Stone) kết hợp với 1 điểm nhấn tương phản cao (Emerald, Electric Blue, Deep Rose, Burnt Orange).
* **KHÓA ĐỒNG NHẤT MÀU SẮC (Color Consistency Lock)**: Khi đã chọn màu nhấn cho trang, toàn bộ các nút bấm, huy hiệu và liên kết phải tuân thủ nhất quán. Không thể phần đầu màu cam mà footer lại nhảy sang xanh ngọc.
* **PHÂN BIỆT BẢNG MÀU RẬP KHUÔN VS NỀN SÁNG LUMINOUS**:
  * **Cấm bảng màu rập khuôn AI (Muddy Cliché Ban)**: Bẫy nhận diện AI phổ biến là sự kết hợp u tối giữa nền be xỉn màu (`#f5f1ea`) + chữ nâu đen mờ nhạt (`#1a1714`) + điểm nhấn đồng/đất sét xỉn thiếu tương phản.
  * **Khác biệt hoàn toàn với Nền Sáng Đa Tầng Luminous**: Chuẩn mực Luminous Light Theme sử dụng Canvas nền tinh khiết (`Warm Paper #FAF9F6`, `Ivory #FDFBF7`, `Alabaster #F8F9FA`), nâng tầm bằng thẻ trắng tinh khôi (`Elevated Pure White #FFFFFF`), viền quang học siêu mảnh và chữ đen than chì sắc nét (`#0f172a` hoặc `#18181b`) đạt chuẩn tương phản cao WCAG AAA.
  * **Các bảng màu sang trọng độc bản thay thế**:
    - **Cold Luxury (Sang trọng lạnh lùng)**: Xám bạc + chrome + khói sương (kiểu Apple Watch Ultra, Tesla).
    - **Forest (Rừng sâu)**: Xanh rêu đậm + màu xương + điểm nhấn hổ phách.
    - **Cobalt + Cream**: Xanh cobalt sắc nét trên nền sáng trang nhã.
    - **Terracotta + Slate**: Đất nung ấm kết hợp đá phiến lạnh.
    - **Đơn sắc tương phản cao**: Trắng ngà + than chì đậm + 1 vệt màu rực rỡ duy nhất.

### 4.3 Layout Diversification (Đa Dạng Hóa Bố Cục)
* **CHỐNG THIÊN KIẾN CĂN GIỮA (Anti-Center Bias)**: Khi `DESIGN_VARIANCE > 4`, tránh Hero căn giữa truyền thống. Hãy sử dụng bố cục phân tách 50/50 (Split Screen), chữ bên trái - hình bên phải, hoặc bố cục khoảng trắng bất đối xứng.
* Hero căn giữa chỉ chấp nhận cho các thông cáo báo chí, tuyên ngôn (manifesto) mang tính văn bản cao.

### 4.4 Materiality, Shadows & Shape Consistency (Chất Liệu & Hình Khối)
* Chỉ dùng thẻ (cards) khi độ nổi (elevation) truyền tải thứ bậc thực sự. Nếu không, hãy phân tách bằng đường kẻ nhẹ (`border-t`, `divide-y`) hoặc khoảng trắng âm.
* Khi dùng bóng đổ (box-shadow), hãy nhuộm sắc độ bóng theo màu nền (tinted shadow). Tuyệt đối không dùng bóng đen tuyền trên nền màu sáng.
* **KHÓA BÁN KÍNH BO GÓC (Shape Consistency Lock)**: Chọn duy nhất 1 quy chuẩn bo góc cho toàn trang: hoặc toàn bộ góc vuông sắc nét (`radius-none`), hoặc bo mềm (`rounded-xl` / 12-16px), hoặc bo tròn dạng viên thuốc (`rounded-full`). Tránh tình trạng nút bấm bo tròn vo nhưng thẻ bên cạnh lại vuông vức sắc nhọn.

### 4.5 Interactive UI States & Độ Nén Xúc Giác (Trạng Thái Tương Tác)
* Triển khai đầy đủ vòng đời: Loading (khung xương skeleton mô phỏng đúng hình dạng), Empty State (chỉ dẫn rõ cách tạo dữ liệu), Error State (thông báo lỗi trực diện tại vị trí phát sinh).
* **Độ lún xúc giác (Tactile Press Depth)**: Khi người dùng bấm (`:active`), áp dụng `transform: scale(0.965)` kết hợp `transition: transform 140ms ease-out` để tạo cảm giác bấm vật lý chân thực.
* **KIỂM TOÁN TƯƠNG PHẢN NÚT BẤM (Button Contrast Check)**: Mọi nút bấm phải đạt tỷ lệ tương phản tối thiểu WCAG AA (4.5:1 cho chữ thường, 3:1 cho chữ lớn). Nghiêm cấm nút bấm trong suốt không viền trên nền ảnh gây khó đọc.
* **CẤM XUỐNG DÒNG CHỮ TRÊN NÚT CTA (CTA Button Wrap Ban)**: Chữ trên nút CTA chính trên máy tính để bàn (desktop) BẮT BUỘC nằm gọn trên 1 dòng duy nhất (tối đa 2-3 từ). Nút bị vỡ thành 2 dòng là lỗi bố cục nghiêm trọng.
* **CẤM TRÙNG LẶP Ý ĐỊNH NÚT CTA (No Duplicate CTA Intent)**: Không đặt các nút cùng ý định nhưng khác câu chữ trên cùng một trang (ví dụ vừa "Liên hệ ngay", vừa "Trò chuyện với chúng tôi", vừa "Bắt đầu dự án"). Hãy chọn 1 nhãn thống nhất duy nhất cho cùng 1 mục đích chuyển đổi.

### 4.6 Kỷ Luật Dàn Trang & Quy Tắc Viewport Khắt Khe (Layout Discipline)
* **Hero BẮT BUỘC nằm trọn trong Viewport đầu tiên**:
  - Tiêu đề chính tối đa 2 dòng trên màn hình máy tính.
  - Đoạn mô tả phụ (subtext) tối đa **20 từ** và không quá 3-4 dòng.
  - Các nút CTA chính phải nhìn thấy ngay mà không cần cuộn chuột.
* **GIỚI HẠN KHOẢNG ĐỆM ĐỈNH HERO (Hero Top Padding Cap)**: Khoảng đệm trên của Hero tối đa là `pt-24` (khoảng 6rem). Khoảng cách quá lớn sẽ đẩy nội dung trôi xuống giữa màn hình trông như lỗi hiển thị.
* **KỶ LUẬT NGĂN XẾP HERO (Tối đa 4 phần tử văn bản)**:
  1. Nhãn định danh trên đầu (Eyebrow nhỏ) - Tùy chọn.
  2. Tiêu đề chính (Headline - tối đa 2 dòng).
  3. Đoạn mô tả ngắn (Subtext - tối đa 20 từ).
  4. Nút hành động CTA (Tối đa 1 nút chính + 1 nút phụ).
  *CẤM đưa vào Hero*: Danh sách logo khách hàng, bảng giá sơ bộ, avatar mạng xã hội, danh sách tính năng dạng gạch đầu dòng. Những phần tử này thuộc về section ngay bên dưới.
* **Thanh điều hướng (Navigation Bar)**: Chiều cao tối đa 64-80px. Toàn bộ menu nằm trên 1 dòng duy nhất ở desktop.
* **QUY TẮC SỐ Ô LƯỚI BENTO (Bento Cell Count Rule)**: Lưới Bento phải có số ô CHÍNH XÁC bằng số lượng nội dung thực tế. Nếu có 3 ý, thiết kế lưới 3 ô (tỷ lệ 1+2 hoặc 2+1). CẤM tạo một ô trống vô nghĩa ở cuối lưới chỉ để làm tròn lưới 4 ô.
* **ĐA DẠNG HÓA NỀN LƯỚI BENTO**: Trong một lưới Bento 4-6 ô, ít nhất 2 ô phải có điểm khác biệt thị giác (ảnh thực tế, nền chuyển sắc nhẹ, họa tiết hình học, texture), không để toàn bộ các ô là thẻ trắng đơn điệu chứa chữ.
* **CẤM LẶP LẠI BỐ CỤC SECTION**: Mỗi kiểu bố cục (ví dụ: lưới 3 cột, trích dẫn toàn màn hình, chia đôi chữ-ảnh) chỉ xuất hiện tối đa 1 lần trên trang.
* **GIỚI HẠN SECTION CHỮ - ẢNH SO LE (Zigzag Alternation Cap)**: Bố cục so le "ảnh trái - chữ phải" rồi "chữ trái - ảnh phải" chỉ được phép lặp lại tối đa 2 lần liên tiếp. Section thứ 3 phải chuyển sang dạng bento, biểu đồ hoặc toàn màn hình.
* **TIẾT CHẾ NHÃN ĐẦU SECTION (Eyebrow Restraint - Quy tắc 1/3)**:
  - Tối đa 1 nhãn eyebrow (`text-[11px] uppercase tracking-widest`) cho mỗi 3 section.
  - Trang có 6 section chỉ được dùng tối đa 2 eyebrow. Không gắn nhãn in hoa nhỏ lên trên mọi tiêu đề section.
* **CẤM BỐ CỤC TIÊU ĐỀ CHẺ ĐÔI (Split-Header Ban)**: Cấm bố cục tiêu đề to bên trái và một đoạn văn bản nhỏ trôi nổi bấp bênh ở góc trên bên phải. Nếu cần đoạn giải thích, hãy xếp dọc ngay dưới tiêu đề với `max-w-[65ch]`.

### 4.7 Image & Visual Asset Strategy (Chiến Lược Tài Sản Hình Ảnh)
* Trang web hiện đại là sản phẩm thị giác. Một trang web toàn chữ và các khối div mô phỏng giao diện giả là sản phẩm kém chất lượng.
* **Thứ tự ưu tiên tìm kiếm và sinh ảnh**:
  1. **Công cụ sinh ảnh AI sẵn có**: Dùng `generate_image` để tạo ảnh packshot sản phẩm, ảnh chụp thực tế theo đúng tỷ lệ khung hình của section.
  2. **Ảnh chụp chất lượng cao từ web**: Dùng `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` với từ khóa mô tả chuẩn xác nội dung.
  3. **Vị trí giữ chỗ minh bạch**: Nếu không có ảnh, để lại comment giữ chỗ rõ ràng `<!-- TODO: Product Hero Photography, 1600x1200 -->`.
* **CẤM DÙNG KHỐI DIV VẼ MÀN HÌNH SẢN PHẨM GIẢ (Div-based Fake Screenshots)**: Tuyệt đối không dùng các thẻ `<div>` lồng nhau để vẽ giao diện ứng dụng giả, bảng task giả hay cửa sổ dòng lệnh giả. Hãy dùng ảnh chụp thực tế hoặc component chức năng thật sự.
* **Logo đối tác xã hội (Social Proof Logos)**: Dùng SVG chính hãng từ thư viện Simple Icons (`https://cdn.simpleicons.org/{slug}`) hoặc Devicon. Không dùng chữ viết thông thường để giả dạng logo.

### 4.8 Content Density & Tự Kiểm Toán Văn Bản (Copywriting Self-Audit)
* **Trích dẫn và đánh giá (Testimonials)**: Thân đoạn trích dẫn tối đa 3 dòng. Không trích dẫn dài lê thê cả đoạn văn. Phải có tên người + chức danh cụ thể.
* **Bảng thông số kỹ thuật (Spec Sheets)**: Cấm kẻ đường viền `border-b` dưới từng dòng của bảng 10 hàng. Thay bằng lưới thẻ 2 cột, danh sách phân cụm có khoảng cách mềm, hoặc thẻ thông số nổi bật kết hợp nút xem chi tiết.
* **TỰ KIỂM TOÁN VĂN BẢN TRƯỚC KHI XUẤT XƯỞNG (Copy Self-Audit)**: Đọc lại toàn bộ chuỗi văn bản trên trang. Loại bỏ ngay:
  - Những câu từ vô nghĩa do AI bịa đặt hoặc ẩn dụ gượng gạo.
  - Những con số chính xác giả tạo (`99.99%`, `4.1x`, `48k`) không có nguồn gốc từ đề bài.
  - Văn phong sáo rỗng giả dạng thợ thủ công khiêm tốn.

### 4.9 Luminous Light Theme Invariant (Quy Chuẩn Giao Diện Sáng Đa Tầng Tối Cao)
* **Khóa chết 100% Giao diện Sáng Đa Tầng (Luminous Light Theme Default)**: Toàn bộ thành phần thiết kế, màu nền, thẻ card, văn bản đều mặc định chạy trên nền sáng đa tầng tinh xảo. Triệt tiêu hoàn toàn nền đơn sắc phẳng bẹt vô hồn ("giấy bẹt đơn điệu" / `Monolithic Flat Paper`).
* **Kiến trúc Nền Sáng Đa Tầng (Multi-Layered Luminous Surfaces)**:
  - Canvas nền cơ sở (`Base Canvas`): `Warm Paper #FAF9F6`, `Ivory #FDFBF7`, hoặc `Alabaster #F8F9FA`.
  - Bề mặt thẻ nổi (`Elevated Surfaces / Cards`): Sắc trắng tinh khiết `#FFFFFF` hoặc Frosted Glass với `backdrop-filter: blur(12px)`.
  - Viền quang học siêu mảnh (`Luminous Borders`): `1px solid rgba(0, 0, 0, 0.06)` hoặc viền kép phản quang.
* **Bóng đổ Đa chiều & Quang học Tinh xảo (Multi-Dimensional Layered Shadows)**:
  - Tuyệt đối cấm bóng đổ đen đặc bẹt dính (`Hard Black Drop Shadows`).
  - Bắt buộc xếp lớp bóng đổ đa tầng mịn màng kết hợp viền sáng phản quang:
    ```css
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.05), 0 12px 28px -4px rgba(0, 0, 0, 0.04);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
    ```
* **CẤM TỰ Ý DÙNG NỀN ĐEN / DARK THEME**: Chỉ thiết kế Dark Theme khi Anh có chỉ đạo rõ ràng bằng văn bản (Explicit Request Only).
* **Đồng nhất chủ đề toàn trang (Theme Lock)**: Khi trang đã là Light Theme, mọi section đều phải là Light Theme. Tuyệt đối không để section nền đen kẹp ở giữa làm gãy đổ trải nghiệm thị giác.

---

## 5. MOTION DISCIPLINE & CANONICAL GSAP PATTERNS (Kỷ Luật Chuyển Động & Mã Mẫu GSAP)

Chuyển động trong giao diện người dùng phải có lý do tồn tại (Motivated Motion): định hướng phân cấp thị giác, kể câu chuyện sản phẩm, phản hồi thao tác người dùng hoặc chuyển trạng thái mượt mà.

### 5.A Kỷ luật chung về Hoạt Ảnh
* **Quy tắc Marquee**: Băng chuyền chữ chạy ngang vô tận chỉ được xuất hiện TỐI ĐA 1 LẦN trên toàn bộ trang. Việc lặp lại marquee nhiều lần tạo cảm giác lười biếng trong thiết kế.
* **Khai báo chuyển động tương xứng**: Nếu đặt `MOTION_INTENSITY: 6` trở lên, giao diện bắt buộc phải có chuyển động thực tế (hiệu ứng vào của hero, scroll-reveal cho các section, hover physics trên nút). Không thể công bố chỉ số chuyển động cao trên một trang web tĩnh lặng.
* **Hỗ trợ giảm chuyển động (`prefers-reduced-motion`)**: Luôn kiểm tra `window.matchMedia("(prefers-reduced-motion: reduce)").matches` để cung cấp phương án mờ dần nhẹ nhàng thay cho các dịch chuyển không gian lớn.

### 5.B Mã mẫu Chuẩn GSAP Sticky-Stack (Thẻ Xếp Chồng Cuộn Chuẩn Xác)
```tsx
"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = typeof window !== "undefined" && 
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || !containerRef.current) return;
    
    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardElements.forEach((card, index) => {
        if (index === cardElements.length - 1) return;
        
        ScrollTrigger.create({
          trigger: card,
          start: "top top", // Ghim chặt ngay mép trên viewport
          endTrigger: cardElements[cardElements.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: cardElements[index + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center p-6"
        >
          {card}
        </div>
      ))}
    </div>
  );
}
```

### 5.C Mã mẫu Chuẩn GSAP Horizontal-Pan (Trượt Ngang Theo Tiến Trình Cuộn)
```tsx
"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = typeof window !== "undefined" && 
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="overflow-hidden bg-transparent">
      <div ref={trackRef} className="flex flex-nowrap will-change-transform">
        {children}
      </div>
    </div>
  );
}
```

---

## 6. REFERENCE VOCABULARY (Bản Đồ Thuật Ngữ Mô Hình Giao Diện Độc Bản)

Đây là kho thuật ngữ chuẩn để AI Agent tư duy và vận dụng chính xác các mẫu thiết kế:

### 6.1 Mô thức Hero (Hero Paradigms)
* **Asymmetric Split Hero**: Bố cục chữ bên trái, hình ảnh/packshot bên phải, khoảng trắng âm hào phóng.
* **Editorial Manifesto Hero**: Tiêu đề typography khổ lớn, không hình ảnh nền, tựa như trang bìa tạp chí in ấn.
* **Video / Media Mask Hero**: Kiểu chữ khoét rỗng làm mặt nạ hé lộ video nền chuyển động bên dưới.
* **Kinetic-Type Hero**: Kiểu chữ động tương tác là tâm điểm thị giác chính.
* **Curtain-Reveal Hero**: Hero mở cánh màn sang hai bên khi người dùng bắt đầu cuộn trang.
* **Scroll-Pinned Hero**: Hero ghim chặt vị trí trong khi nội dung cuộn trượt bên dưới.

### 6.2 Thanh Điều Hướng & Menu (Navigation & Menus)
* **Mac OS Dock Magnification**: Menu mép màn hình, icon phóng to mượt mà khi di chuột qua.
* **Magnetic Button**: Nút bấm tự hút nhẹ theo tọa độ con trỏ chuột khi đến gần.
* **Dynamic Island**: Khối thuôn bo tròn biến hình linh hoạt để hiển thị trạng thái và thông báo.
* **Contextual Radial Menu**: Menu dạng nan hoa tròn bung tỏa ngay tại vị trí nhấp chuột.
* **Mega Menu Reveal**: Menu thả xuống toàn màn hình với hiệu ứng thác đổ so le (stagger).

### 6.3 Bố Cục & Lưới (Layout & Grids)
* **Bento Grid**: Lưới các ô bất đối xứng phân cấp dữ liệu trực quan theo phong cách Apple Control Center.
* **Masonry Layout**: Lưới so le tự nhiên, các ô không bị ép theo chiều cao hàng cố định.
* **Split-Screen Scroll**: Hai nửa màn hình trượt theo hai hướng ngược chiều nhau khi cuộn.
* **Sticky-Stack Sections**: Các section ghim và xếp chồng lớp vật lý khi cuộn trang.

### 6.4 Thẻ Card & Khối Chứa (Cards & Containers)
* **Parallax Tilt Card**: Thẻ xoay 3D nghiêng theo tọa độ chuột của người dùng.
* **Spotlight Border Card**: Đường viền phát sáng cục bộ di chuyển theo vị trí con trỏ chuột.
* **Glassmorphism Panel**: Thẻ kính mờ tinh xảo với khúc xạ ánh sáng đa tầng.
* **Morphing Modal**: Nút bấm bung nở mượt mà biến hình thành chính hộp thoại dialog.

### 6.5 Hoạt Ảnh Cuộn & Vi Tương Tác (Scroll & Micro-Interactions)
* **Horizontal Scroll Hijack**: Chuyển đổi tiến trình cuộn dọc thành chuyển động trượt ngang.
* **Skeleton Shimmer**: Vệt sáng quét ngang qua khung xương đang tải dữ liệu.
* **Directional Hover-Aware Button**: Màu nền nút tràn vào từ đúng hướng con trỏ chuột di vào.
* **Lens Blur Depth**: Làm mờ nhẹ nền UI để tập trung mắt nhìn vào cửa sổ thao tác phía trước.
* **Phân định Thư viện Hoạt ảnh**: Dùng **Motion (`motion/react`)** cho UI/Bento/trạng thái; dùng **GSAP + ScrollTrigger** cho scrollytelling và scroll-hijack. Tuyệt đối không trộn lẫn GSAP và Motion trong cùng một cây component.

---

## 7. REDESIGN PROTOCOL (Kỷ Luật Nâng Cấp & Thiết Kế Lại)

Kỹ năng này xử lý cả **xây dựng mới từ đầu (Greenfield) VÀ nâng cấp thiết kế lại (Redesign)**. Nhận định sai chế độ là nguyên nhân hàng đầu dẫn đến sản phẩm redesign hỏng hóc.

### 7.A Xác định Chế độ (Detect Mode)
* **Greenfield**: Dự án chưa có giao diện cũ hoặc đã duyệt làm mới toàn diện từ đầu. Sử dụng Dial cơ sở `8 / 6 / 4`.
* **Redesign - Preserve (Bảo tồn)**: Hiện đại hóa mà không làm đứt gãy nhận diện thương hiệu. Kiểm toán trước, trích xuất token, nâng cấp cuốn chiếu.
* **Redesign - Overhaul (Lột xác)**: Ngôn ngữ thị giác hoàn toàn mới trên nền nội dung hiện có. Thiết kế thị giác như mới nhưng giữ trọn nội dung và kiến trúc thông tin.

### 7.B Kiểm Toán Trước Khi Sửa Mã Nguồn (Audit Before Touching)
Khảo sát và ghi nhận hiện trạng trước khi đề xuất bất kỳ thay đổi nào:
1. **Brand tokens**: Màu chính/nhấn, font chữ, logo, bán kính bo góc.
2. **Kiến trúc thông tin (IA)**: Sơ đồ cây trang, thanh điều hướng chính, luồng chuyển đổi cốt lõi.
3. **Khối nội dung**: Những gì đang mang lại giá trị, những gì là nội dung thừa thãi.
4. **Họa tiết cần bảo tồn**: Tương tác mang tính dấu ấn, giọng điệu văn bản (copy voice).
5. **Họa tiết cần loại bỏ**: Rác AI, bố cục vỡ trên di động, liên kết chết, ảnh stock chung chung, bẫy hiệu năng.
6. **Điểm tựa SEO (SEO Baseline)**: Các trang đang có thứ hạng tìm kiếm, thẻ meta title, dữ liệu có cấu trúc. **Di chuyển SEO là rủi ro số 1 trong các dự án Redesign.**

### 7.C Quy Tắc Bảo Tồn Bất Biến (Preservation Rules)
* **Không tự ý thay đổi Kiến trúc Thông tin**: Giữ nguyên đường dẫn URL slug, định danh anchor ID, nhãn điều hướng chính để bảo toàn SEO và thói quen người dùng.
* **Trích xuất màu thương hiệu trước**: Nếu thương hiệu đã có màu nhận diện, hãy bảo tồn và chuẩn hóa sang chuẩn tương phản cao.
* **Bảo tồn giọng điệu văn bản**: Hiện đại hóa thị giác KHÔNG ĐỒNG NGHĨA với việc viết lại nội dung nếu không được yêu cầu.
* **Bảo toàn khả năng tiếp cận (Accessibility)**: Không làm mất trạng thái focus bàn phím, thẻ alt ảnh và độ tương phản vốn có.
* **Tôn trọng mã theo dõi sự kiện (Analytics)**: Không đổi tên button, form fields hoặc section IDs mà các hệ thống tracking phụ thuộc.

### 7.D Bậc Thang Đòn Bẩy Hiện Đại Hóa (Priority Levers)
Thực hiện lần lượt theo thứ tự, dừng lại khi yêu cầu đã được đáp ứng trọn vẹn:
1. **Nâng cấp Typography**: Đem lại bước nhảy vọt thị giác lớn nhất với rủi ro thấp nhất.
2. **Khoảng cách & Nhịp điệu (Spacing & Rhythm)**: Tăng padding section, chuẩn hóa nhịp điệu dọc.
3. **Hiệu chuẩn Màu sắc**: Giảm độ bão hòa, thống nhất màu trung tính, giữ vững màu nhấn thương hiệu.
4. **Lớp Chuyển động**: Thêm vi tương tác phù hợp với `MOTION_INTENSITY` vào component có sẵn.
5. **Tái cấu trúc Hero & Section chủ chốt**: Sắp xếp lại đỉnh phễu chuyển đổi sử dụng kho thuật ngữ Mục 6.
6. **Thay thế khối giao diện toàn diện**: Chỉ tiến hành khi khối cũ hoàn toàn không thể cứu vãn.

### 7.E Những Thứ TUYỆT ĐỐI KHÔNG Thay Đổi Âm Thầm
Không bao giờ sửa đổi khi chưa có lệnh tường minh từ Anh:
* Cấu trúc URL và route slugs.
* Nhãn của thanh điều hướng chính.
* Tên trường hoặc thứ tự trong biểu mẫu form (tránh làm hỏng autofill và analytics).
* Logo hoặc wordmark của thương hiệu.
* Các điều khoản pháp lý, cookie consent và bản quyền.

---

## 8. AI TELLS & FORBIDDEN PATTERNS (Bộ Nhận Diện Rác AI Cấm Tuyệt Đối)

Đây là danh sách đen các dấu hiệu đặc trưng thường thấy ở code AI sinh ra:

### 8.A LỆNH CẤM DẤU GẠCH NGANG DÀI EM-DASH (U+2014) TUYỆT ĐỐI 100%
* Dấu gạch ngang dài Em-Dash là dấu hiệu nhận diện số 1 của văn bản AI.
* **CẤM HOÀN TOÀN** trong tiêu đề, nhãn phụ (eyebrow), đoạn văn bản, trích dẫn, nút bấm và mô tả ảnh.
* Thay thế bằng: dấu gạch nối tiêu chuẩn `-` kèm khoảng trắng (` - `), dấu phẩy, dấu hai chấm hoặc ngắt dòng.
* Không dùng ký tự gạch ngang dài trong phạm vi ngày tháng hay dải số (dùng `2024-2026` với dấu gạch ngang chuẩn, không dùng en-dash hoặc em-dash).

### 8.B Cấm Nhãn Phiên Bản & Đánh Số Thô Thiển
* **CẤM nhãn phiên bản trên Hero**: Không đặt `V0.6`, `v2.0`, `BETA`, `INVITE-ONLY PREVIEW` làm nhãn trên Hero trừ khi đề bài yêu cầu trực tiếp.
* **CẤM đánh số thứ tự trên nhãn Section**: `001 / Capabilities`, `02 · How it works`, `03 / Portfolio` là khuôn mẫu sáo rỗng. Hãy dùng từ ngữ tự nhiên mô tả nội dung section.
* **CẤM nhãn phân trang trên ảnh**: Không viết `01 / 4` lên trên hình ảnh hoặc ô bento.

### 8.C Tiết Chế Dấu Chấm & Đốm Màu Trang Trí
* **Định mức dấu chấm giữa (`·`)**: Tối đa 1 ký tự `·` trên 1 dòng văn bản thông tin. Không dùng nó để ngăn cách mọi cụm từ ("thiết kế · xây dựng · vận hành · tối ưu").
* **CẤM đốm tròn màu trang trí vô nghĩa**: Cấm đặt các chấm tròn xanh/đỏ/tím trước mọi liên kết menu hoặc đầu mục danh sách. Chỉ dùng khi thể hiện trạng thái hoạt động thực tế của máy chủ.

### 8.D Cấm Dữ Liệu & Từ Ngữ Rập Khuôn (Anti-Slop Content)
* **CẤM tên nhân vật vô hồn**: "John Doe", "Jane Doe", "Sarah Chan", "Alex Smith" $\to$ Hãy dùng tên có bản sắc văn hóa thực tế, đáng tin cậy.
* **CẤM tên công ty khởi nghiệp giả tưởng**: "Acme", "Nexus", "SmartFlow", "Cloudly" $\to$ Đặt tên có ngữ cảnh và sắc thái thương hiệu thực thụ.
* **CẤM động từ quảng cáo sáo rỗng**: "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize" $\to$ Thay bằng các động từ hành động cụ thể, chân phương.
* **CẤM nhãn bước giả tạo**: "Stage 1 / Stage 2 / Stage 3" $\to$ Đặt tên bước bằng trực tiếp hành động ("Cài đặt", "Cấu hình", "Triển khai").

### 8.E Cấm Chỉ Dẫn Cuộn & Dải Thời Tiết Ảo
* **CẤM chỉ dẫn cuộn chuột vô nghĩa**: `Scroll`, `↓ scroll`, icon con chuột nhấp nháy ở chân trang Hero. Người dùng lướt web luôn biết cách cuộn chuột, không cần AI phải nhắc.
* **CẤM dải địa danh/thời tiết**: "Tokyo 14:20 · 22°C" hay "Lisbon, Portugal" đặt ở footer hoặc nav của các trang web không liên quan đến du lịch hay mạng lưới văn phòng toàn cầu.

---

## 9. FINAL PRE-FLIGHT VERIFICATION CHECKLIST (Bảng Kiểm Tra Xuất Xưởng Cuối Cùng)

Trước khi gửi kết quả hoàn tất mã nguồn, tự động rà soát qua bảng tiêu chí sau:

1. [ ] **Design Read**: Đã xuất ra câu định hình bối cảnh ở dòng đầu tiên chưa?
2. [ ] **The Three Dials**: Đã xác lập `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4` hoặc giá trị ghi đè hợp lý chưa?
3. [ ] **Luminous Light Theme**: Giao diện có đang vận hành 100% trên nền sáng đa tầng Luminous (Warm Paper / Ivory / Elevated White, bóng đổ đa chiều siêu mịn, viền quang học) không? (Tuyệt đối không tự ý dùng dark theme).
4. [ ] **Hero Viewport**: Tiêu đề có nằm trong 2 dòng, subtext dưới 20 từ, và toàn bộ Hero hiển thị trọn vẹn trong `min-h-[100dvh]` mà không bị tràn màn hình không?
5. [ ] **Hero Top Padding**: Khoảng đệm đỉnh Hero có được khống chế dưới mức `pt-24` không?
6. [ ] **CTA Button 1-Line**: Nhãn chữ trên nút kêu gọi hành động chính ở desktop có nằm trọn vẹn trên 1 dòng duy nhất không?
7. [ ] **Độ Tương Phản WCAG AA**: Nền nút bấm và màu chữ có đạt tỷ lệ tương phản tối thiểu 4.5:1 không?
8. [ ] **Eyebrow Restraint**: Số lượng nhãn in hoa nhỏ trên các section có tuân thủ quy tắc $\le \lceil \text{Tổng số section} / 3 \rceil$ không?
9. [ ] **Bento Cell Match**: Lưới Bento có khớp đúng số lượng nội dung thực, không để lại ô trống thừa thãi không?
10. [ ] **Zero Em-Dash**: Toàn bộ mã nguồn và chuỗi hiển thị có sạch bóng ký tự Em-Dash (U+2014) không?
11. [ ] **Zero Div-Fake-Screenshots**: Không có bất kỳ khối div nào vẽ giả lập màn hình sản phẩm, dùng hình ảnh thật hoặc component thật chưa?
12. [ ] **Tactile Scale(0.965)**: Các nút bấm và phần tử click được có cài đặt độ lún `:active { transform: scale(0.965); }` chưa?
13. [ ] **Redesign Protocol Checked**: Nếu là dự án redesign, đã đối chiếu danh sách bất biến (URL slug, nav labels, analytics IDs, SEO) chưa?
14. [ ] **No Mixed Animation Engines**: Đảm bảo không trộn lẫn GSAP và Motion trong cùng một cây component.
