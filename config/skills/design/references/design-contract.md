# Design Contract Lifecycle & Change Protocol

Quy chuẩn vòng đời của Hợp đồng Thiết kế (`DESIGN_CONTRACT.yaml`).

---

## 1. Vòng đời Trạng thái
```text
DRAFT                -> Đang xây dựng bởi Design Director
PROPOSED             -> 3 hướng nghệ thuật trình lên Human Gate
LOCKED               -> Được Product Owner phê duyệt (ART_DIRECTION_LOCKED)
CHANGE_REQUESTED     -> Đề xuất thay đổi kỹ thuật đang chờ duyệt
```

## 2. Ràng buộc Khóa Hợp đồng
Sau khi trạng thái chuyển sang `LOCKED`:
* Design Engineer bắt buộc phải thực thi bám sát các tiêu chí trong Contract.
* Nghiêm cấm tự ý:
  - Đổi cặp font chữ đã khóa.
  - Thêm hiệu ứng kính/glassmorphism nếu nằm trong avoid-list.
  - Thay đổi bảng màu chủ đạo hoặc chuyển sang gradient tím AI.
  - Chèn các khối card grid generic làm hỏng trải nghiệm đặc trưng.

## 3. Quy trình Đề xuất Thay đổi (Change Request)
Nếu trong quá trình code, Design Engineer phát hiện vấn đề kỹ thuật bắt buộc phải thay đổi mỹ thuật:
1. Tạo yêu cầu `DESIGN_CONTRACT_CHANGE_REQUEST`.
2. Nêu rõ: Lý do kỹ thuật, trường bị ảnh hưởng, lợi ích đạt được.
3. Design Director thẩm định.
4. Trình Product Owner (Anh) phê duyệt nếu thay đổi mang tính cốt lõi.
