---
name: clawpanel
description: >-
  Kỹ năng chuyên gia vận hành cho qingchencloud/clawpanel (2933 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở clawpanel vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🦞 OpenClaw & Hermes Agent 多引擎 AI 管理面板 — 内置 AI 助手（工具调用 + 图片识别 + 多模态），一键安装 | Tauri v2 跨平台桌面应用 | 11 种语言
    - Thiết lập cấu hình và vận hành lệnh CLI của qingchencloud/clawpanel
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'clawpanel'.
---

# qingchencloud/clawpanel — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/qingchencloud/clawpanel`  
> **Độ uy tín cộng đồng**: 2933 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-16 13:42:09Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🦞 OpenClaw & Hermes Agent 多引擎 AI 管理面板 — 内置 AI 助手（工具调用 + 图片识别 + 多模态），一键安装 | Tauri v2 跨平台桌面应用 | 11 种语言
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **受管运行时** — 在“运行与配置”页面安装、启动、停止和卸载固定验收版本，不污染全局 npm 环境；稳定版默认使用 `0.2.0-rc.2`，可显式安装 `0.2.1-alpha.2` Alpha 候选版并随时切回稳定版。
- **独立工作台** — 通过左侧“工作台”进入完整 DSH Web 界面，直接对话、选择工作区、切换模型和管理会话。
- **统一模型渠道** — 将 Provider、API Key、上下文窗口、输出上限和默认模型从 ClawPanel 同步到 DSH，并回读确认结果。
- **Web/headless 安全内嵌** — DSH 保持回环监听，远程 Web 版通过短期令牌和沙箱代理使用完整界面，无需额外开放公网端口。
- **长期记忆可视化** — 在线编辑 Notes、User Profile、Soul，让事实、偏好与人格持续沉淀。
- **会话可运营** — 统一查看对话、消息流、运行状态和工具调用细节。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
curl -fsSL https://raw.githubusercontent.com/qingchencloud/clawpanel/main/scripts/linux-deploy.sh | bash

docker run -d --name clawpanel --restart unless-stopped \
  -p 1420:1420 -v clawpanel-data:/root/.openclaw \
  node:24.16.0-slim \
  sh -c "apt-get update && apt-get install -y git && \
    npm install -g openclaw@2026.10.4 --registry https://registry.npmmirror.com && \
    git clone https://github.com/qingchencloud/clawpanel.git /app && \
    cd /app && npm ci && npm run build && npm run serve"
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