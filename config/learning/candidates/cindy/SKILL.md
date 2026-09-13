---
name: cindy
description: >-
  Kỹ năng chuyên gia vận hành cho makecindy/cindy (2663 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở cindy vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Consider it done
    - Thiết lập cấu hình và vận hành lệnh CLI của makecindy/cindy
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'cindy'.
---

# makecindy/cindy — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/makecindy/cindy`  
> **Độ uy tín cộng đồng**: 2663 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-13 10:52:27Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Consider it done. The open-source AI agent that works out of the box · 想到，就能做到。开源、开箱即用的 AI Agent。
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Memory** — correct her once and she does it right from then on, shared across harnesses.
- **Skills** — teach a way of working once and reuse it everywhere; handing them to your team is in the making.
- **Automation** — recurring work schedules itself, runs itself, reports back.
- **MCP** — wire your internal tools and business systems into her reach.
- **Plugins** — reshape features, UI and interactions, shared through an open marketplace *(in the making)*.
- **Source** — audit, fork, extend, and contribute improvements back under Apache-2.0.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/makecindy/cindy.git
cd cindy
git lfs pull
pnpm install

# Mainland China Cindy account
pnpm restart:desktop:remote --region=cn

# Global Cindy account
pnpm restart:desktop:remote --region=global
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