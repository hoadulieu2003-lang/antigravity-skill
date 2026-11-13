---
name: boss-agent-cli
description: >-
  Kỹ năng chuyên gia vận hành cho can4hou6joeng4/boss-agent-cli (2220 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở boss-agent-cli vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🤖 Local-assist BOSS Zhipin CLI for AI agents — search, welfare filtering, shortlist, JSON-envelope output; low-risk & compliant by default
    - Thiết lập cấu hình và vận hành lệnh CLI của can4hou6joeng4/boss-agent-cli
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'boss-agent-cli'.
---

# can4hou6joeng4/boss-agent-cli — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/can4hou6joeng4/boss-agent-cli`  
> **Độ uy tín cộng đồng**: 2220 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-11-13 16:42:13Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🤖 Local-assist BOSS Zhipin CLI for AI agents — search, welfare filtering, shortlist, JSON-envelope output; low-risk & compliant by default.
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **职位发现**：关键词搜索 + 8 维筛选，按编号回看缓存结果 —— `search` `show` `detail`
- **福利筛选（核心差异化）**：`--welfare "双休,五险一金"` 自动翻页补抓、按 AND 逻辑做**真实匹配**，并可 `--sort score` 按本地匹配分排序 —— `search --welfare`
- **HR 活跃度筛选**：`--active 3d` 只留最近活跃的 HR，避免把投递次数浪费在长期不上线的岗位上；`online` 只看列表、请求量与普通搜索相同，其余档位可能要逐个查职位详情，更慢、风控风险更高，低风险场景建议用 `--active online` —— `search --active`
- **纯终端向导**：直接运行 `boss` 或 `boss wizard`，选择角色、平台和目标；同一 workflow 也可用 `--input-json`、run ID 或 MCP 推进和恢复
- **本地候选池与统计**：查看详情后本地保存、读取带有效状态的网页职位收藏并仅同步有效项 / 用标签和备注复盘候选岗位、离线对比、查看漏斗统计 —— `shortlist` `stats` `watch` `preset` `favorites`
- **AI 求职增强 + 本地模型**：JD 分析、简历润色、定向优化、候选池匹配、模拟面试、沟通指导；本地模型权重外置，支持 Ollama/vLLM OpenAI 兼容接口 —— `ai analyze-jd` `ai local configure` `ai local smoke`

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
boss platforms                             # 查看已注册平台与能力状态（当前仅 zhipin）
boss --platform zhipin search "Python"     # --platform 默认即 zhipin，可省略

// 方式一：MCP（推荐）—— Claude Desktop / Cursor 等 MCP 宿主，暴露 79 个已实现工具
{ "mcpServers": { "boss-agent": { "command": "uvx", "args": ["--from", "boss-agent-cli[mcp]", "boss-mcp"] } } }
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