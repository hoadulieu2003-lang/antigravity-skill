---
name: atomic-agent
description: >-
  Kỹ năng chuyên gia vận hành cho AtomicBot-ai/atomic-agent (2798 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở atomic-agent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Atomic Agent is a local-first AI agent
    - Thiết lập cấu hình và vận hành lệnh CLI của AtomicBot-ai/atomic-agent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'atomic-agent'.
---

# AtomicBot-ai/atomic-agent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/AtomicBot-ai/atomic-agent`  
> **Độ uy tín cộng đồng**: 2798 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-05 19:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Atomic Agent is a local-first AI agent. Runs open-weight models on your own machine via llama.cpp.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Nothing is hidden.** Inspect the prompt, replay trace drift, edit skills, and swap parts without waiting for a vendor. Plain local models, SQLite files, and NDJSON traces.
- **Runs on your hardware.** Small quantized models run on everyday consumer GPUs and CPUs, no datacenter needed.
- **TurboQuant weights:** Lloyd-Max weight quantization with WHT rotation and fused Metal/Vulkan kernels keeps quality usable while small models fit on consumer hardware.
- **Custom speculative decoding:** purpose-built Gemma 4 MTP and Qwen 3.6 NextN heads reuse the loaded model (no second context, tokenizer, or model load) for +30-50% throughput.
- **Curated quantized models:** hand-picked GGUF quants that keep quality usable while fitting real VRAM budgets.
- **Bounded tail:** conversation, memory, world state, recalled notes, lessons, procedures, and loaded skill bodies are clipped into a predictable prompt budget.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://atomicagent.io/install | sh

irm https://atomicagent.io/install.ps1 | iex
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