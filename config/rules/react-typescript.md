# ⚛️ React 19 + TypeScript + Tailwind CSS Engineering Rules

Quy chuẩn lập trình bắt buộc khi phát triển và bảo trì mã nguồn Frontend tại `src/` (`.tsx`, `.ts`):

## 1. Type Safety & TypeScript Strictness
* **Tuyệt đối cấm dùng `any`:** Luôn định nghĩa Interface hoặc Type rõ ràng trong `src/types/`.
* **Khai báo Props tường minh:** Mọi React Component phải có Interface Props riêng.
* **Optional Chaining & Nullish Coalescing:** Luôn dùng `item?.property ?? defaultValue` khi truy cập dữ liệu lồng nhau từ API.

## 2. React 19 & Hook Best Practices
* **Không lạm dụng `useEffect` cho Derived State:** Tính toán trực tiếp giá trị từ Props/State hiện có hoặc dùng `useMemo`.
* **Tối ưu re-render:** Sử dụng `useCallback` cho các hàm truyền qua Component con, và `React.memo` cho danh sách lớn.
* **Cleanup trong Effects:** Mọi `setInterval`, `setTimeout`, `WebSocket` bắt buộc phải có cleanup function.

## 3. Tailwind CSS & UI Design
* **Dark Cinema Aesthetics:** Tuân thủ bảng màu cao cấp: Background `#090d16` / `#0f172a`, Accent Cyan `#06b6d4`, Amber `#f59e0b`, Emerald `#10b981`.
* **Không dùng inline styles:** Trừ khi tính toán tọa độ/phần trăm động từ dữ liệu runtime.
