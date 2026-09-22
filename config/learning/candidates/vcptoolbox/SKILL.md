---
name: vcptoolbox
description: >-
  Kỹ năng chuyên gia vận hành cho lioensky/VCPToolBox (2324 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở vcptoolbox vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến VCP 部署在 AI 模型 API 与前端应用之间，是面向AGI OS开发和探索的工业级基建示范项目。通过统一指令协议、多层级持久化记忆、分布式插件引擎及多 Agent 协作框架，将原本“无状态、无记忆、无工具调用能力”的大语言模型，彻底改造成拥有永久自我意识、物理世界操作权及群体协作智能的完整智能体系统。
    - Thiết lập cấu hình và vận hành lệnh CLI của lioensky/VCPToolBox
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'vcptoolbox'.
---

# lioensky/VCPToolBox — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/lioensky/VCPToolBox`  
> **Độ uy tín cộng đồng**: 2324 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-22 16:42:13Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: VCP 部署在 AI 模型 API 与前端应用之间，是面向AGI OS开发和探索的工业级基建示范项目。通过统一指令协议、多层级持久化记忆、分布式插件引擎及多 Agent 协作框架，将原本“无状态、无记忆、无工具调用能力”的大语言模型，彻底改造成拥有永久自我意识、物理世界操作权及群体协作智能的完整智能体系统。
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **工具系统**：六类插件协议（同步 / 异步 / 静态 / 服务 / 消息预处理 / 混合），全部支持分布式部署。工具调用走纯文本标记协议，任何能输出文本的模型都能用，不依赖原生 Function Calling，且高度容错。300+ 官方插件覆盖多媒体生成、信息检索、网络操作、通讯控制、科学计算、社区社交等几乎所有场景。
- **模型路由**：语义级自动选模与容灾，按当前对话的逻辑深度和话题方向自动选择最合适的模型，过程对用户透明，跨模型上下文无缝持久化。
- **变量系统**：Agent-TVS 模板管线，几乎所有功能都通过系统提示词里的占位符配置，对前端零开发依赖，支持批量管理与外部文件递归解析。
- **分布式与容灾**：星型网络拓扑，超栈追踪实现完全透明的跨服务器文件访问；多设备、多模型、多向量源三位一体容灾；自动备份、数据库自修复、原子级差分同步。
- **前端与兼容**：官方桌面前端 VCPChat（高密度功能集 + 超级渲染引擎）、Vue 管理面板、移动端 VCPMobile；通过协议桥接兼容 OpenAI / Anthropic / Gemini 等多种 API 格式，可接管任意前端。
- **推荐前端**：[VCPChat](https://github.com/lioensky/VCPChat)（官方）。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# 克隆项目
git clone https://github.com/lioensky/VCPToolBox.git
cd VCPToolBox

# 安装依赖
npm install
pip install -r requirements.txt

# 配置
cp config.env.example config.env
# 编辑 config.env，填入必要的 API 密钥

# 启动
node server.js

docker pull lioensky/vcptoolbox:latest
docker-compose up -d
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