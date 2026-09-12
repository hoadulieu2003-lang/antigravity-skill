---
name: dsh-desktop-eac
description: >-
  Kỹ năng chuyên gia vận hành cho DSH-EAC/DSH-Desktop-EAC (1634 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở dsh-desktop-eac vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến DeepSeek Harness Desktop (dsh-desktop)
    - Thiết lập cấu hình và vận hành lệnh CLI của DSH-EAC/DSH-Desktop-EAC
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'dsh-desktop-eac'.
---

# DSH-EAC/DSH-Desktop-EAC — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/DSH-EAC/DSH-Desktop-EAC`  
> **Độ uy tín cộng đồng**: 1634 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-12 02:28:25Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: DeepSeek Harness Desktop (dsh-desktop). EAC: Embracing All Creation (揽尽万象). Bundled Node.js runtime with full dsh-CLI kernel, one-click startup, 10 built-in ...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **v1.2.0 要点**：内核对齐官方桌面端 `0.1.3-alpha.2`，插件接口随内核迁移修复，应用图标更换为 WhaleGirl，并移除已确认停用的插件与皮肤。
- **AIO 升级说明**：从旧版 AIO 覆盖安装时，仅继承旧版的会话与供应商配置，不继承旧版插件（内置插件随安装包更新）。
- **客户端本体**：启动后自动检查上游新版本（GitHub Releases 双源回退），经你同意后下载安装；
- **官方 agent（dsh）**：自动检测 `@deepseek-ai/dsh` 新版本，同意后安装到数据目录 overlay，原子切换，新版启动失败可一键回退内置版本。
- **内置运行环境**：完整打包 Node.js、npm CLI、`@deepseek-ai/dsh` 及官方插件，无需额外安装运行时。
- **安装版与便携版**：双击启动并自动选择可用端口；便携版数据跟随程序目录，可直接迁移。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
cd dsh-desktop
npm test                 # node --test test/*.test.ts（pretest 含 tsc 全量类型检查）
node ../gui-smoke.js     # Tauri 壳 GUI 冒烟（18 项，需先 cargo build）
node ../update-smoke.js  # 自更新链路冒烟（mock 发布源 + 目录树交换）
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