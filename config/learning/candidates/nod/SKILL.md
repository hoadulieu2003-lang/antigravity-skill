---
name: nod
description: >-
  Kỹ năng chuyên gia vận hành cho n8n-io/nod (2257 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở nod vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến Open source personal agent with its own computer
    - Thiết lập cấu hình và vận hành lệnh CLI của n8n-io/nod
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'nod'.
---

# n8n-io/nod — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/n8n-io/nod`  
> **Độ uy tín cộng đồng**: 2257 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-17 16:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: Open source personal agent with its own computer. It chases invoices, preps your calls and cancels trials on real websites, and asks before it acts. Runs on ...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Runs on your computer or server.** Files, memory, and saved logins stay there. Your model provider gets what each task needs.
- **Uses the model you choose.** OpenAI, Anthropic, Gemini, OpenRouter, Bedrock, Vertex AI, Azure, 20+ more, or your own server. Or sign in with ChatGPT Plus or Pro.
- **Keeps secrets out of the model.** Vault enters passwords, codes, and cards privately on the website.
- **Shows what it did.** Every action and sign-in is in Usage, with costs and a monthly limit on API models.
- **Policy lives in the server, not the prompt.** The trust check, Vault, payments, and spending limits run in the server.
- **Untrusted by default.** App, web, and browser results reach the model marked as data, not instructions.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
git clone https://github.com/n8n-io/nod.git
cd nod
corepack enable
pnpm start
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