---
name: lightagent
description: >-
  Kỹ năng chuyên gia vận hành cho wanxingai/LightAgent (1247 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở lightagent vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến LightAgent: Lightweight Python framework for OpenAI-compatible agents with tools, memory, guardrails, tracing, lifecycle hooks, multi-agent collaboration, an
    - Thiết lập cấu hình và vận hành lệnh CLI của wanxingai/LightAgent
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'lightagent'.
---

# wanxingai/LightAgent — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/wanxingai/LightAgent`  
> **Độ uy tín cộng đồng**: 1247 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-15 10:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: LightAgent: Lightweight Python framework for OpenAI-compatible agents with tools, memory, guardrails, tracing, lifecycle hooks, multi-agent collaboration, an...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **Autonomous Learning** 📚️: Each agent possesses autonomous learning capabilities, and admins with permissions can manage each agent.
- **Tool Integration** 🛠️: Support for custom tools (`Tools`) and MCP tool integration, flexible expansion to meet diverse needs.
- **Independent Execution** 🤖: Tasks and tool calls are completed autonomously without human intervention.
- **Streaming API** 🌊: Supports OpenAI streaming format API service output, seamlessly integrates with mainstream chat frameworks, enhancing user experience.
- **Agent Self-Learning** 🧠️: Each agent has its own scene memory capabilities and the ability to self-learn from user conversations.
- `SqliteTaskGraphStore` persists tasks, attempts, graph changes, events, and recovery state. Independent Worker instances can run concurrently.

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
from LightAgent import EvaluationCase, HumanApprovalHook, LightEvaluator

agent.hooks.hooks.append(HumanApprovalHook(tools={"send_payment"}))

report = LightEvaluator().run(agent, [
    EvaluationCase(
        name="payment policy",
        query="Pay invoice 42",
        expected_trace_events=("approval_required",),
        forbidden_tools=("delete_account",),
    ),
])
print(report.to_dict())

pip install --upgrade "git+https://github.com/wanxingai/LightAgent.git@main"
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