---
name: cua
description: >-
  Kỹ năng chuyên gia vận hành cho trycua/cua (23472 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở cua vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Scale computer-use 2
    - Thiết lập cấu hình và vận hành lệnh CLI của trycua/cua
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'cua'.
---

# trycua/cua — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/trycua/cua`  
> **Độ uy tín cộng đồng**: 23472 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-19 01:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Scale computer-use 2.0 with open-source drivers, cross-OS fleets, and benchmarks for training, evaluation, and data generation.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Cua Fleets:** [Provision a Linux desktop, run a command, and save a screenshot](https://cua.ai/docs/tutorials/your-first-cloud-fleet).
- **Cua Driver:** [Operate Calculator and verify its result](https://cua.ai/docs/tutorials/drive-your-first-app).
- **Lume:** [Create a Tahoe VM and connect over SSH](https://cua.ai/docs/tutorials/create-your-first-lume-vm).
- **Cua Bench:** [Create and verify a simulated task](https://cua.ai/docs/tutorials/your-first-cua-bench-task).

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
/bin/bash -c "$(curl -fsSL https://cua.ai/driver/install.sh)"

irm https://cua.ai/driver/install.ps1 | iex
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