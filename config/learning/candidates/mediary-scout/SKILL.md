---
name: mediary-scout
description: >-
  Kỹ năng chuyên gia vận hành cho fancydirty/mediary-scout (1592 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở mediary-scout vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Agent-driven media library for your cloud drives (Quark 夸克 / 115 / 光鸭 GuangYa / 123网盘 / 天翼 Tianyi)
    - Thiết lập cấu hình và vận hành lệnh CLI của fancydirty/mediary-scout
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'mediary-scout'.
---

# fancydirty/mediary-scout — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/fancydirty/mediary-scout`  
> **Độ uy tín cộng đồng**: 1592 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-28 13:42:08Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Agent-driven media library for your cloud drives (Quark 夸克 / 115 / 光鸭 GuangYa / 123网盘 / 天翼 Tianyi)
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **夸克**：分享链转存，PanSou 上资源最多。
- **115**：分享链 + 磁力。
- **123网盘**：分享链 + 磁力，免费账号也能转存，扫码登录。[连接教程](docs/deploy.md#123网盘连接)
- **光鸭云盘**：分享链 + 磁力，粘 token 登录。[连接教程](docs/deploy.md#光鸭云盘guangyapan连接)
- **天翼云盘**：分享链转存，扫码登录，电影资源偏少。[连接教程](docs/deploy.md#天翼云盘连接)

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/fancydirty/mediary-scout && cd mediary-scout
docker compose up -d
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