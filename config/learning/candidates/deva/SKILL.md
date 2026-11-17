---
name: deva
description: >-
  Kỹ năng chuyên gia vận hành cho sqfcyily/deva (1492 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở deva vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 对话式 AI 助手 · All in Chat - 把 Agent 能力装进对话里，无需复杂配置，像聊天一样使用 Agent。已内置破甲角色「小码酱」，支持国模破甲。
    - Thiết lập cấu hình và vận hành lệnh CLI của sqfcyily/deva
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'deva'.
---

# sqfcyily/deva — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/sqfcyily/deva`  
> **Độ uy tín cộng đồng**: 1492 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-17 10:42:10Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 对话式 AI 助手 · All in Chat - 把 Agent 能力装进对话里，无需复杂配置，像聊天一样使用 Agent。已内置破甲角色「小码酱」，支持国模破甲。
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **破甲** — 越狱与提示词注入研究：多轮绕过、对抗后缀、输出塑形、RAG 攻击等提示词攻防手法；对安全限制 / 伦理注入做静态清除与对抗，恢复模型原本的输出能力；针对国产模型拒答模式做针对性脱壳。
- **逆向** — 二进制 / 软件逆向工程：静态分析定位校验函数、关键跳转与许可证逻辑；反调试、反虚拟机、检测绕过的占位流程与代码片段；本地样本逆向工作流（隔离复制 → 定位 CHECK_FN → 标注 OFFSET / PATCH_BYTE → 重签名 → 验证并保留回滚副本）。
- **按需组队**：工作需要拆分时，主角色自行添加成员、拟定职责并派发任务，无需事先创建。也可以在输入框中 `@` 已有角色请其协助，或输入 `@新建成员` 描述职责，由主角色创建。
- **各自独立**：每位成员拥有独立的会话与上下文，可绑定各自的文件夹（如前端、后端、部署分属不同仓库），并单独选择模型与思考等级。
- **以本人身份回报**：成员完成后以自己的头像和名字在主对话中回复结论。需要汇总时，主角色等全部成员完成后统一总结，期间对话末尾显示完成进度。
- **集中处理请求**：成员需要你回答问题、批准计划、选择文件夹或在网页上登录时，请求出现在主对话末尾，处理后自动收起。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
pnpm install
pnpm dev              # 开发模式
pnpm typecheck        # 类型检查
pnpm package:win      # Windows 安装版与便携版
pnpm package:mac      # macOS
pnpm package:linux    # Linux
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