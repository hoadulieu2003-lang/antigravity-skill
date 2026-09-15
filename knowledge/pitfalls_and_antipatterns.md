# ⚠️ SỔ TAY BẪY LỖI & KINH NGHIỆM THỰC CHIẾN (PITFALLS & ANTIPATTERNS LEDGER)
> **Mục tiêu**: Tập hợp các bài học sự cố hệ thống, rò rỉ bộ nhớ, race conditions và các lỗ hổng thực tế.  
> **Nguyên tắc**: Anti luôn đối chiếu sổ tay này trước khi triển khai code cho Anh để phòng tránh rủi ro từ trong trứng nước.

---

### 🚨 [2026-09-15 20:42] Give every teammate and agent the right level of access to your Workers
* **Nguồn cảnh báo**: Cloudflare Engineering | [Chi tiết bài viết](https://blog.cloudflare.com/workers-granular-authorization/)
* **Bài học nhận thức**: You can now scope access to individual Workers and assign narrower Developer Platform roles, so teammates, CI tokens, and agents get only the access they need to debug, deploy, or monitor safely.
* **Biện pháp phòng ngừa cho Anti**: Kiểm toán bộ nhớ, thêm try-catch có timeout và kiểm tra điều kiện biên chặt chẽ.

---
