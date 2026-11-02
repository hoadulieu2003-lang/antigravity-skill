---
name: uniterm
description: >-
  Kỹ năng chuyên gia vận hành cho ys-ll/uniterm (1000 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở uniterm vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến All-in-one terminal covering 30+ protocols — SSH, RDP, SFTP, databases, Kubernetes and more
    - Thiết lập cấu hình và vận hành lệnh CLI của ys-ll/uniterm
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'uniterm'.
---

# ys-ll/uniterm — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/ys-ll/uniterm`  
> **Độ uy tín cộng đồng**: 1000 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-02 13:42:08Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: All-in-one terminal covering 30+ protocols — SSH, RDP, SFTP, databases, Kubernetes and more. With a built-in AI Agent that runs multi-turn shell commands aut...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Local & Serial Terminal** — PowerShell / CMD / Git Bash / WSL plus serial connections with configurable baud rate, data bits, stop bits, parity, and local echo.
- **File Transfer** — SFTP / SCP / FTP / FTPS / SMB / WebDAV / S3 / Zmodem with dual-pane browsing and `rz`/`sz` support in SSH terminals.
- **Remote Desktop** — RDP (Windows Remote Desktop), VNC (Linux remote control), SPICE (KVM/QEMU VMs), X11 (X Window forwarding)
- **Server Monitor** — Real-time CPU, memory, disk, network, processes, ports, and network interfaces.
- **Flexible Execution Modes** — Bypass, dangerous only, dangerous + write, or confirm all — you control how much oversight the AI Agent needs.
- **Skills & Commands** — Reusable skill workflows and prompt-template commands, attached with `/` in the AI input; the AI can also save new skills itself.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/ys-ll/uniterm.git
cd uniTerm
cd frontend && npm install && cd ..
wails3 dev                  # Development
wails3 build                # Production build
```

---

## 3. Quy Trình Vận Hành Chuẩn Mực (Step-by-Step Runbook)

1. **Khảo sát Môi trường**: Kiểm tra runtime tương thích (Python / Node.js / Docker) trên máy trạm Windows.
2. **Cài đặt & Cấu hình**: Nạp biến môi trường và thiết lập tham số an toàn trong ranh giới Sandbox.
3. **Thực thi & Tự Kiểm chứng**: Chạy thử nghiệm lệnh với phạm vi nhỏ nhất (`FAST Mode`) trước khi tích hợp vào luồng chính.
4. **Bàn giao Bằng chứng**: Xuất bằng chứng kiểm chứng (`Evidence Ledger`) xác nhận kết quả trước khi kết thúc tác vụ.

---

## 4. Các Bẫy Lỗi & Ràng Buộc An Toàn (Pitfalls & Guardrails)

* **Ràng buộc Mạng & Token**: Tuân thủ nghiêm ngặt hạn mức API và cơ chế timeout an toàn.
* **Bảo vệ Secret**: Tuyệt đối không lưu trữ khóa API hoặc token riêng tư dưới dạng văn bản thô.
* **Bảo vệ Không Gian Làm Việc**: Không tự ý ghi đè hoặc thay đổi các file cấu hình hệ sinh thái cốt lõi ngoài phạm vi.