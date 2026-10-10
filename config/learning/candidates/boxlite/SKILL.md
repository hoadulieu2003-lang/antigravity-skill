---
name: boxlite
description: >-
  Kỹ năng chuyên gia vận hành cho boxlite-ai/boxlite (2529 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở boxlite vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến The micro-VM for AI agents — light enough to embed on your laptop, elastic enough to power an agentic cloud
    - Thiết lập cấu hình và vận hành lệnh CLI của boxlite-ai/boxlite
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'boxlite'.
---

# boxlite-ai/boxlite — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/boxlite-ai/boxlite`  
> **Độ uy tín cộng đồng**: 2529 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-10 02:48:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: The micro-VM for AI agents — light enough to embed on your laptop, elastic enough to power an agentic cloud.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Real isolation**: its own kernel — stronger than a container, lighter than a full VM. Small footprint, async-first for fleets.
- **Daemonless**: embed as a library — no root, no background service. *(optional server mode)*
- **OCI-native**: run any Docker image unchanged (`python:slim`, `node:alpine`, …).
- **Controlled networking**: restrict egress with `allow_net`; inject real secrets via placeholders.
- **Embed → cloud**: one engine, from your laptop to a multi-tenant cloud.
- **[Databricks Omnigent](https://github.com/omnigent-ai/omnigent)** — sandbox option in their agent meta-harness

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
pip install boxlite

import asyncio
import boxlite

async def main():
    async with boxlite.SimpleBox(image="python:slim") as box:
        result = await box.exec("python", "-c", "print('Hello from BoxLite!')")
        print(result.stdout)

asyncio.run(main())
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