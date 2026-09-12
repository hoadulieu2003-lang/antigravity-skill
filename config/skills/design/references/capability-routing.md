# MCP Capability Routing & Progressive Loading

Quy chuẩn điều phối năng lực thiết kế qua giao thức MCP (Model Context Protocol).

---

## 1. Vai trò của MCP trong Thiết kế
* MCP đóng vai trò là **Capability Registry / Router** (Kho lưu trữ và Định tuyến Năng lực).
* **Nghiêm cấm**: MCP không có quyền quyết định thẩm mỹ, không chọn Art Direction, không ép dùng 3D chỉ vì có sẵn thư viện Three.js.

## 2. Quy trình Định tuyến
1. Design Director xác định các năng lực cần thiết (`needs`: e.g. `gsap_scroll`, `spatial_webgl`, `typography`).
2. Gửi yêu cầu `capability_request` tới MCP router.
3. MCP tra cứu và trả về các ứng viên khả thi (`capability_candidates`).
4. Design Director chọn bộ năng lực tối thiểu cần thiết ($\le 5$ active skills).
5. Chỉ nạp đúng các tài liệu hướng dẫn của kỹ năng được chọn vào context window (`Progressive Loading`).
