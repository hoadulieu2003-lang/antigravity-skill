---
name: open-science
description: >-
  Kỹ năng chuyên gia vận hành cho ai4s-research/open-science (2041 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở open-science vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open Science Desktop — local-first, model-agnostic AI research workbench for macOS, Windows & Linux
    - Thiết lập cấu hình và vận hành lệnh CLI của ai4s-research/open-science
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'open-science'.
---

# ai4s-research/open-science — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/ai4s-research/open-science`  
> **Độ uy tín cộng đồng**: 2041 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-26 13:42:17Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open Science Desktop — local-first, model-agnostic AI research workbench for macOS, Windows & Linux. Open-source Claude Science desktop alternative built on ...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Autonomous research agents** — the bundled `ai4s-agent` chains specialist skills
- **Everything traces back** — figures, tables, reports, notebooks, and run outputs
- **Local-first and yours** — sessions, data, provenance, notebooks, and run records
- **Model-agnostic runtime** — the UI talks through `packages/sdk` to a bundled,
- **Reproducible by construction** — local, SSH/Slurm, Modal, and notebook-batch runs
- **Reach it from anywhere** — a built-in, token-authenticated gateway serves the

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
sudo apt install ./Open.Science_*.deb
# or
sudo rpm -i Open.Science-*.rpm

curl -fsSL https://raw.githubusercontent.com/ai4s-research/open-science/master/scripts/install.sh | sh
curl -fsSL https://raw.githubusercontent.com/ai4s-research/open-science/master/scripts/install.sh | sh -s -- --desktop
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