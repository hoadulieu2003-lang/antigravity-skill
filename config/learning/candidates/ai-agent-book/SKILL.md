---
name: ai-agent-book
description: >-
  Kỹ năng chuyên gia vận hành cho bojieli/ai-agent-book (50275 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa hoặc tích hợp công cụ mã nguồn mở ai-agent-book vào hệ thống
    - Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến 《深入理解 AI Agent：设计原理与工程实践》（李博杰 著）开源主仓库：全书正文、编译版 PDF 与按章配套代码
    - Thiết lập cấu hình và vận hành lệnh CLI của bojieli/ai-agent-book
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'ai-agent-book'.
---

# bojieli/ai-agent-book — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/bojieli/ai-agent-book`  
> **Độ uy tín cộng đồng**: 50275 ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: 2026-09-23 10:42:12Z

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: 《深入理解 AI Agent：设计原理与工程实践》（李博杰 著）开源主仓库：全书正文、编译版 PDF 与按章配套代码
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
- **EPUB**：使用统一的构建脚本，详情请参阅 [EPUB 构建说明](EPUB.md)
- **正文源码**：`book/introduction.md`（引言）、`book/chapter1.md` ~ `book/chapter10.md`（第一至第十章）、`book/afterword.md`（后记）
- **编译**：安装 pandoc、xelatex、ElegantBook 文档类与相关字体后，运行
- `uv` 安装方法见 [官方文档](https://docs.astral.sh/uv/getting-started/installation/)；`pip` 仍受支持，但不会使用锁文件。

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

```bash
# 推荐：使用提交到仓库的 uv.lock，获得可复现的章节环境
uv sync --locked --extra ch1

# 未安装 uv 时：使用 pip 从 pyproject.toml 重新解析
python -m pip install -e ".[ch1]"

uv run python chapter1/context/main.py
# 使用 pip 安装时也可直接运行：python chapter1/context/main.py
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