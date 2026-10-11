---
name: tradingagents-astock
description: >-
  Kỹ năng chuyên gia vận hành cho simonlin1212/TradingAgents-astock (3663 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở tradingagents-astock vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến A股多Agent投研框架 — 适配A股数据源(龙虎榜/游资/解禁等)，7位分析师基于A股规则的辩论决策，基于TradingAgents深度改造，适配大A。A-share multi-agent investment research framework — 7 AI analysts, bull/bear deb
    - Thiết lập cấu hình và vận hành lệnh CLI của simonlin1212/TradingAgents-astock
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'tradingagents-astock'.
---

# simonlin1212/TradingAgents-astock — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/simonlin1212/TradingAgents-astock`  
> **Độ uy tín cộng đồng**: 3663 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-11 13:42:11Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: A股多Agent投研框架 — 适配A股数据源(龙虎榜/游资/解禁等)，7位分析师基于A股规则的辩论决策，基于TradingAgents深度改造，适配大A。A-share multi-agent investment research framework — 7 AI analysts, bull/bear deb...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- `quick_think_llm`：所有 Analyst、Researcher、Trader、Risk Debater
- `deep_think_llm`：Research Manager 和 Portfolio Manager（需要综合全局信息做决策）
- **这不是回测，也不是策略业绩。** 每条记录是「某天做出的判断在固定持有期后的表现」：持有窗口互相重叠、没有仓位管理、未计交易成本与冲击成本，样本还可能有选择偏差。
- **A 股 beta 很强**，跟着大盘涨不代表判断对，所以方向正确率用 alpha 口径判定，看绝对收益容易高估判断力。
- **样本量分开算**：方向正确率只统计有方向的评级，已结算总数够、但有方向的不足 20 条时，报告会单独提示这个指标仍是噪音。
- **样本少于 20 条时报告会自己标注「这些比率基本是噪音」**，不要拿三五条记录下结论。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# Python >= 3.10
git clone https://github.com/simonlin1212/tradingagents-astock.git
cd tradingagents-astock
pip install -e .

# 如需使用 Google Gemini 模型（无 [google] extra，需显式装，见下方 FAQ）：
pip install --no-deps "langchain-google-genai>=4.0.0"
pip install "google-genai>=1.53.0" "httpx>=0.28.1"

# 如需让节点走你个人 Claude Pro/Max 订阅额度而非 API 计费（可选）：
pip install -e ".[agentsdk]"

tradingagents                 # 交互式 CLI
tradingagents analyze         # 同上（默认命令）
tradingagents performance     # 决策绩效统计（见下）
tradingagents --help          # 查看所有选项
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