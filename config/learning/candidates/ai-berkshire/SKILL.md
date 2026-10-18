---
name: ai-berkshire
description: >-
  Kỹ năng chuyên gia vận hành cho xbtlin/ai-berkshire (16781 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở ai-berkshire vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến AI 时代的伯克希尔：基于 Claude Code / Codex 的价值投资研究框架。巴菲特·芒格·段永平·李录四大师方法论 + 多Agent并行研究。| AI-era Berkshire: a value investing research framework built for Claude Code /
    - Thiết lập cấu hình và vận hành lệnh CLI của xbtlin/ai-berkshire
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'ai-berkshire'.
---

# xbtlin/ai-berkshire — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/xbtlin/ai-berkshire`  
> **Độ uy tín cộng đồng**: 16781 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-10-18 16:42:08Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: AI 时代的伯克希尔：基于 Claude Code / Codex 的价值投资研究框架。巴菲特·芒格·段永平·李录四大师方法论 + 多Agent并行研究。| AI-era Berkshire: a value investing research framework built for Claude Code /...
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **段永平**（商业模式）：好生意，C2M模式难以复制 → 评分 3.7/5
- **巴菲特**（财务估值）：扣现金PE仅6.3x，印钞机 → 评分 4.4/5
- **芒格**（逆向思考）：护城河比想象中浅，抖音3年做到4万亿GMV → 评分 3.5/5
- **李录**（长期确定性）：管理层文化有隐患，10年后不确定 → 评分 2.0/5
- **Skill 层**：把"你要做什么"抽象成 20 个明确入口——深度研究、财报分析、行业筛选、持仓管理、思维工具，按场景选用
- **Agent 层**：团队型 skill（如 `/investment-team`、`/earnings-team`）由 Team Lead 并行调度 4 个大师视角 Agent——各自独立搜索、独立判断、互相挑战，最后综合研判；轻量 skill 不经过这一层，直连工具快进快出

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# 市值手算校验：股价 × 总股本，与报告数据对比
python3 tools/financial_rigor.py verify-market-cap \
  --price 510 --shares 9.11e9 --reported 4.65e12 --currency HKD
# ✅ 验证通过, 偏差仅 0.08%

npm install -g @anthropic-ai/claude-code
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