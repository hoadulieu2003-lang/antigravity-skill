---
name: auto-empirical-research-skills
description: >-
  Kỹ năng chuyên gia vận hành cho brycewang-stanford/Auto-Empirical-Research-Skills (4377 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở auto-empirical-research-skills vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 🔬 A curated collection of 23,000+ agent skills for empirical research across 8 social science disciplines
    - Thiết lập cấu hình và vận hành lệnh CLI của brycewang-stanford/Auto-Empirical-Research-Skills
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'auto-empirical-research-skills'.
---

# brycewang-stanford/Auto-Empirical-Research-Skills — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/brycewang-stanford/Auto-Empirical-Research-Skills`  
> **Độ uy tín cộng đồng**: 4377 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-26 04:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 🔬 A curated collection of 23,000+ agent skills for empirical research across 8 social science disciplines. | 精选 23,000+ AI Agent 技能库，覆盖8大社会科学学科的实证研究。CoPaper....
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **本文件（README.md，GitHub 默认入口）**：banner、badges、信任面、9 阶段流水线速览、77 行合集总表。
- **[`docs/CONTENT_ZH.md`](docs/CONTENT_ZH.md)（扩展正文）**：每个合集的完整描述（`#skill-NN` 锚点）、按用途分组、精确数字、2 分钟验证、三层信任、旗舰流水线详解、贡献与引用。总表行内的 `→` 直接跳到对应锚点。
- **其他语言**：[`README-en.md`](README-en.md) · [`README-zh-TW.md`](README-zh-TW.md) · [`README-ja.md`](README-ja.md) · [`README-ko.md`](README-ko.md)

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
帮我安装 https://github.com/brycewang-stanford/Auto-Empirical-Research-Skills
装到「全局」（~/.claude/skills/），我想在所有项目里都能用

git clone --recurse-submodules https://github.com/brycewang-stanford/Auto-Empirical-Research-Skills.git
cd Auto-Empirical-Research-Skills

cp -R skills/00.1-Full-empirical-analysis-skill_Python  .claude/skills/   # 项目级
cp -R skills/00.1-Full-empirical-analysis-skill_Python  ~/.claude/skills/ # 全局
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