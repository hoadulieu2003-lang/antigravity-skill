---
name: anymodelbot
description: >-
  Kỹ năng chuyên gia vận hành cho modelflare-ai/AnyModelBot (2741 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở anymodelbot vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🤖 Open-source, local-first alternative to Grok Bot, OpenAI dots and Claude Duet
    - Thiết lập cấu hình và vận hành lệnh CLI của modelflare-ai/AnyModelBot
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'anymodelbot'.
---

# modelflare-ai/AnyModelBot — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/modelflare-ai/AnyModelBot`  
> **Độ uy tín cộng đồng**: 2741 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-08 13:42:13Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🤖 Open-source, local-first alternative to Grok Bot, OpenAI dots and Claude Duet. Your own AI bots on any model: GPT, Claude, Gemini, Grok, DeepSeek, Kimi, GL...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **登录一次就行。** 首次启动会打开浏览器，登录（或注册）Modelflare。之后应用自己把这台设备连上，不用复制 Key。在 Docker 或服务器上运行？在任意设备的浏览器里登录，再把登录后的链接贴回应用。
- **所有模型，一个选择器。** 你的 Modelflare 模型会自动列出，每个模型旁边都有上下文长度、能力标记和参考价。
- **用多少付多少。** 余额、低余额提醒和每日用量都在应用里看。选模型之前，先看公开价格表，和官方价格对比一下。
- **想建几个就建几个**，每个都有自己的人设、模型、工作区和头像。
- **它是谁由你写。** 人设就是一段话，模板只是起点，每个字都能改；六个头像只管长相，不决定它能做什么。
- **真正的文件操作。** 机器人能读写文件、在沙箱里执行命令，并把结果作为文件发回聊天。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
docker run -d --name amb -p 3600:3600 -v amb-data:/data ghcr.io/modelflare-ai/anymodel-bot
docker exec amb cat /data/ui-token   # 然后打开 http://<主机>:3600/?token=<令牌>

git clone https://github.com/modelflare-ai/AnyModelBot.git
cd AnyModelBot
npm install
npm run setup      # 拉取并编译内置网关
npm start          # 本地管理界面：http://127.0.0.1:3600/
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