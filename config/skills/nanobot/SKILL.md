---
name: nanobot
description: >-
  Kỹ năng chuyên gia vận hành cho HKUDS/nanobot (48.047 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Triển khai và vận hành khung làm việc tác tử AI cá nhân siêu nhẹ (Ultra-lightweight Personal AI Agent Framework) viết bằng Python
    - Tự lưu trữ (Self-hosted) WebUI, Memory (Ký ức dài hạn), MCP, Tự động hóa đa kênh (Telegram, Slack, Discord, Email) và Multi-Agent Workflows
    - Thiết lập cấu hình và vận hành lệnh CLI của HKUDS/nanobot
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'nanobot'.
---

# ⚡ NANOBOT — ULTRA-LIGHTWEIGHT SELF-HOSTED PERSONAL AI AGENT FRAMEWORK

> **Nguồn gốc (Origin)**: Kho lưu trữ mã nguồn mở `HKUDS/nanobot` (48.047 ⭐)  
> **Sứ mệnh cốt lõi (Mission)**: Khung làm việc tác tử cá nhân tự lưu trữ siêu nhẹ viết bằng Python, đầy đủ WebUI, MCP, bộ nhớ và đa kênh  
> **Nguyên tắc vận hành**: Chuẩn song ngữ `English (Tiếng Việt)`, tuân thủ `Luminous Light Theme Invariant`.

---

## 🏛️ 1. TỔNG QUAN KIẾN TRÚC & ĐẶC TÍNH NỔI BẬT (CORE CAPABILITIES)

Nanobot hướng tới mục tiêu tối giản tài nguyên phần cứng nhưng tối đa hóa tính tự trị:
1. **Lõi Tối Giản, Dễ Tùy Biến (`Small Readable Core`)**: Mã nguồn Python tinh gọn, dễ đọc, tích hợp sẵn giao thức `Model Context Protocol (MCP)`, bộ nhớ dài hạn và công cụ tự động hóa.
2. **Ký Ức & Quy Trình Bền Bỉ (`Persistent Memory & Workflows`)**: Duy trì mục tiêu (`Goals`), bộ nhớ (`Memory`), công cụ (`Tools`) và ngữ cảnh đối thoại xuyên suốt các tác vụ chạy ngầm dài hạn.
3. **Phủ Sóng Đa Kênh Giao Tiếp (`Omnichannel Integration`)**: Kết nối bản xứ tới WebUI, Terminal CLI, Telegram, Slack, Discord, Teams, Mattermost và Email.
4. **Hiển Thị Tiến Trình Nén Ngữ Cảnh Trực Quan (`Visible Context-Compaction`)**: Báo cáo trực tiếp tỷ lệ nén bộ nhớ đệm ngay trên giao diện WebUI và kênh chat.

---

## 🛠️ 2. CÚ PHÁP CÀI ĐẶT & KHỞI CHẠY (CLI RUNBOOK)

```powershell
# Cài đặt nhanh qua PowerShell trên Windows:
irm https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.ps1 | iex

# Khởi chạy giao diện WebUI cục bộ:
nanobot start --webui --port 8080
```

---

## 🛡️ 3. CÁC NGUYÊN TẮC AN TOÀN BẤT BIẾN (INVARIANTS)

1. **Bảo Mật Biến Môi Trường (`Credential Safety Sandbox`)**:
   * Tuyệt đối không lưu khóa API trong tệp cấu hình chia sẻ; nạp an toàn từ file môi trường `.env` cách ly.
2. **Kỷ Luật Thuật Ngữ Song Ngữ (`Bilingual Terminology Protocol`)**:
   * Toàn bộ tài liệu kỹ thuật và giải thích phải tuân thủ chuẩn: **`English (Tiếng Việt)`** *(Ví dụ: `Context Window (Cửa Sổ Ngữ Cảnh)`, `Rate Limiting (Giới Hạn Tần Suất Gọi API)`)*.
3. **Quy Chuẩn Giao Diện Sáng Đa Tầng Luminous (`Luminous Light Theme Invariant`)**:
   * Giao diện WebUI hoặc bảng điều khiển sinh ra bởi Nanobot mặc định sử dụng phong cách sáng đa tầng Luminous, bảo đảm độ tương phản chữ đạt chuẩn WCAG AA.
