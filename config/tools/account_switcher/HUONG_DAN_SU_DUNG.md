# 🚀 HƯỚNG DẪN BỘ CHUYỂN ĐỔI TÀI KHOẢN ANTIGRAVITY 2.0 ULTRA (1-CLICK HOT-SWAP)

> **Mục tiêu**: Xoay tua 2 Tài khoản Google AI Ultra để nhân đôi hạn mức 5 tiếng (`5-Hour Sliding Window Quota`), loại bỏ triệt để tình trạng đứt gãy luồng công việc khi chạy đa tác tử (`Multi-Agent`).  
> **Cơ chế**: Sử dụng trực tiếp API bảo mật chuẩn của hệ điều hành Windows (`Win32 Credential Manager API: CredReadW / CredWriteW`). Không dùng phần mềm bên thứ 3, không proxy lậu, 100% sạch và chính thống, an toàn tuyệt đối cho tài khoản Google của Anh.

---

## 📂 Vị Trí Thư Mục Công Cụ
Thư mục: `C:\Users\game\.gemini\config\tools\account_switcher\`
* **`Switch-Account.bat`**: Trình điều khiển có menu trực quan (Xem trạng thái, chọn tài khoản, sao lưu).
* **`Quick-Toggle.bat`**: Phím tắt 1-click — tự động hoán đổi giữa Tài khoản 1 và Tài khoản 2 trong **3 giây** không cần bấm phím nào.
* **`AntigravityAccountSwitcher.ps1`**: Động cơ lõi xử lý hoán đổi token an toàn.

---

## 🛠️ BƯỚC 1: THIẾT LẬP BAN ĐẦU (CHỈ LÀM 1 LẦN DUY NHẤT)

### 1. Lưu Tài Khoản Ultra 1 (Hiện tại đang đăng nhập)
1. Mở thư mục `C:\Users\game\.gemini\config\tools\account_switcher\`.
2. Nhấp đúp vào **`Switch-Account.bat`**.
3. Nhập phím **`4`** rồi nhấn **Enter** *(Chụp Snapshot tài khoản hiện tại vào Vault 1)*.
   👉 Màn hình báo: `✅ Đã chụp Snapshot thành công cho Tài khoản Ultra 1!`

### 2. Đăng Nhập & Lưu Tài Khoản Ultra 2
1. Trên ứng dụng **Antigravity 2.0**:
   * Vào **Settings** (Cài đặt) $\to$ Bấm **Sign Out** (Đăng xuất).
   * Bấm **Sign In** (Đăng nhập) và đăng nhập bằng **Tài khoản Google Ultra thứ 2** của Anh qua trình duyệt web như bình thường.
2. Quay lại cửa sổ **`Switch-Account.bat`** (hoặc mở lại nếu đã đóng).
3. Nhập phím **`5`** rồi nhấn **Enter** *(Chụp Snapshot tài khoản hiện tại vào Vault 2)*.
   👉 Màn hình báo: `✅ Đã chụp Snapshot thành công cho Tài khoản Ultra 2!`

🎉 **Chúc mừng Anh! Quá trình thiết lập 2 tài khoản đã hoàn tất 100%!**

---

## ⚡ BƯỚC 2: SỬ DỤNG HÀNG NGÀY (DAILY WORKFLOW)

Kể từ thời điểm này, mỗi khi Anh đang chạy đa tác tử mà tài khoản hiện tại bị chạm hạn mức 5 tiếng (`Rate Limit`):
1. **Cách siêu tốc nhất (Khuyên dùng)**:
   * Nhấp đúp vào file **`Quick-Toggle.bat`**.
   * Hệ thống sẽ tự động:
     * Dừng Antigravity 2.0.
     * Hoán đổi token trong Windows Credential Manager sang tài khoản còn lại.
     * Khởi động lại Antigravity 2.0 chỉ trong **3 giây**!
   * Antigravity mở lại với hạn mức 5h mới tinh 100%, Anh tiếp tục trò chuyện và ra lệnh cho bầy agent mà không phải đăng nhập lại từ đầu.
2. **Cách chủ động chọn tài khoản**:
   * Nhấp đúp vào **`Switch-Account.bat`** $\to$ Chọn **`1`** (Tài khoản 1) hoặc **`2`** (Tài khoản 2).

---

## 💡 Mẹo Tiện Lợi Cho Anh (Tạo Shortcut Ra Màn Hình Desktop)
Anh chỉ cần:
1. Nhấp chuột phải vào file **`Quick-Toggle.bat`** $\to$ Chọn **Show more options** $\to$ Chọn **Send to** $\to$ **Desktop (create shortcut)**.
2. Đổi tên Shortcut ngoài màn hình thành: `⚡ Đổi Tài Khoản Antigravity 2.0`.
👉 Mỗi khi hết quota, chỉ cần nhấp đúp vào icon này trên Desktop là xong ngay!
