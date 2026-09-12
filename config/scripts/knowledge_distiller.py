#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
KNOWLEDGE DISTILLATION ENGINE (Động cơ Tiêu hóa Tri thức Kiến trúc Đa Nguồn)
=============================================================================
Nhiệm vụ:
  1. Bóc tách các bài nghiên cứu kỹ thuật từ Google Research, DeepMind,
     Hugging Face Daily Papers và ArXiv AI.
  2. Tổng hợp thành các Cẩm nang Kiến trúc (Architectural Pattern Cards)
     tại `knowledge/architecture_patterns/`.
  3. Trích xuất bẫy lỗi và kinh nghiệm thực chiến vào `knowledge/pitfalls_and_antipatterns.md`.
  4. Cập nhật chỉ mục tri thức để Anti sử dụng trong quá trình pair-programming.
=============================================================================
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
from pathlib import Path

# Đảm bảo terminal console Windows luôn xuất Unicode UTF-8 chuẩn xác
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
PATTERNS_DIR = KNOWLEDGE_DIR / "architecture_patterns"
PITFALLS_FILE = KNOWLEDGE_DIR / "pitfalls_and_antipatterns.md"
EVENTS_DIR = BASE_DIR / "config" / "learning" / "events"

def slugify(text: str) -> str:
    """Chuyển tiêu đề thành slug tên file chuẩn an toàn"""
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', text).strip().lower()
    return re.sub(r'[\s-]+', '_', clean)[:60]

def ensure_knowledge_directories():
    """Tạo sẵn các thư mục lưu trữ tri thức"""
    PATTERNS_DIR.mkdir(parents=True, exist_ok=True)
    EVENTS_DIR.mkdir(parents=True, exist_ok=True)

def distill_architectural_card(item: dict) -> dict | None:
    """
    Tiêu hóa một bài nghiên cứu kỹ thuật thành Architectural Pattern Card hoàn chỉnh.
    """
    title = item.get("title", "").strip()
    link = item.get("link", "").strip()
    source = item.get("source", "Unknown Source")
    raw_summary = item.get("snippet", "").strip()

    if not title or len(raw_summary) < 40:
        return None

    card_slug = slugify(title)
    card_file = PATTERNS_DIR / f"{card_slug}.md"

    # Nếu pattern này đã từng được phân tích, bỏ qua để tránh trùng lặp
    if card_file.exists():
        return None

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Phân tích các khối giá trị kỹ thuật
    sentences = [s.strip() for s in re.split(r'\. |\n', raw_summary) if len(s.strip()) > 20]
    core_problem = sentences[0] if sentences else "Giải quyết bài toán tối ưu hóa mô hình và tự động hóa tác tử AI."
    mechanism = sentences[1] if len(sentences) > 1 else "Áp dụng cơ chế suy luận tăng cường và kiến trúc module phân tán."
    trade_off = sentences[2] if len(sentences) > 2 else "Đánh đổi giữa chi phí tính toán (Compute Overhead) và độ chính xác đầu ra."

    card_content = f"""# 🏛️ Architectural Pattern: {title}

> **Nguồn nghiên cứu (`Source`)**: {source}  
> **Đường dẫn gốc (`Reference Link`)**: [{title}]({link})  
> **Thời điểm tiêu hóa (`Distilled At`)**: {now_iso}  
> **Phân loại (`Taxonomy`)**: AI Architecture / Systems Engineering / Agent Topology

---

## 1. Bản chất Vấn đề & Động lực Kỹ thuật (`Problem & Motivation`)
{core_problem}.

---

## 2. Cơ chế Kiến trúc Cốt lõi (`Core Architectural Mechanism`)
* **Nguyên lý vận hành**:
  {mechanism}.
* **Luồng xử lý dữ liệu (`Data Flow`)**:
  `Input Context` $\\to$ `Representation Mapping` $\\to$ `Constrained Reasoning` $\\to$ `Verified Output`.

---

## 3. Điểm Đánh Đổi & Ràng Buộc Hệ Thống (`Trade-offs & Constraints`)
* **Hiệu năng & Chi phí**: {trade_off}.
* **Rủi ro tiềm ẩn (`Risk Matrix`)**: Có thể tăng độ trễ mạng nếu không có cơ chế cache đệm thích hợp.

---

## 4. Ứng dụng Thực Chiến Cho Anti (`Actionable Guidance for Pair-Programming`)
1. **Áp dụng khi thiết kế hệ thống**: Ưu tiên kiểm chứng đa bước khép kín và tái sử dụng bộ nhớ cache.
2. **Nguyên tắc triển khai (`Rule of Thumb`)**: Giới hạn phạm vi diff nhỏ nhất và tự kiểm toán đối kháng trước khi xuất kết quả cho Anh.

---
*Tài liệu này được tự động tiêu hóa bởi Anti Knowledge Distillation Engine.*
"""

    with open(card_file, "w", encoding="utf-8") as f:
        f.write(card_content)

    # Ghi nhận sự kiện
    event_timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    event_file = EVENTS_DIR / f"event_pattern_{event_timestamp}_{card_slug[:30]}.json"
    with open(event_file, "w", encoding="utf-8") as ef:
        json.dump({
            "event_type": "ARCHITECTURAL_PATTERN_DISTILLED",
            "title": title,
            "source": source,
            "pattern_file": str(card_file),
            "timestamp": now_iso
        }, ef, indent=2, ensure_ascii=False)

    return {
        "slug": card_slug,
        "title": title,
        "file": str(card_file)
    }

def update_pitfalls_ledger(finding: dict):
    """
    Trích xuất bẫy lỗi hoặc antipatterns phát hiện được vào sổ tay pitfalls_and_antipatterns.md.
    """
    title = finding.get("title", "")
    snippet = finding.get("snippet", "")
    link = finding.get("link", "")
    source = finding.get("source", "")

    # Kiểm tra xem nội dung có chứa các tín hiệu cảnh báo bẫy lỗi không
    hazard_keywords = ["leak", "vulnerability", "failure", "pitfall", "bottleneck", "race condition", "bug", "crash", "attack"]
    combined = f"{title} {snippet}".lower()
    if not any(k in combined for k in hazard_keywords):
        return

    # Khởi tạo file nếu chưa có
    if not PITFALLS_FILE.exists():
        header = """# ⚠️ SỔ TAY BẪY LỖI & KINH NGHIỆM THỰC CHIẾN (PITFALLS & ANTIPATTERNS LEDGER)
> **Mục tiêu**: Tập hợp các bài học sự cố hệ thống, rò rỉ bộ nhớ, race conditions và các lỗ hổng thực tế.  
> **Nguyên tắc**: Anti luôn đối chiếu sổ tay này trước khi triển khai code cho Anh để phòng tránh rủi ro từ trong trứng nước.

---

"""
        with open(PITFALLS_FILE, "w", encoding="utf-8") as pf:
            pf.write(header)

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    entry = f"""### 🚨 [{now_str}] {title}
* **Nguồn cảnh báo**: {source} | [Chi tiết bài viết]({link})
* **Bài học nhận thức**: {snippet}
* **Biện pháp phòng ngừa cho Anti**: Kiểm toán bộ nhớ, thêm try-catch có timeout và kiểm tra điều kiện biên chặt chẽ.

---
"""
    with open(PITFALLS_FILE, "a", encoding="utf-8") as pf:
        pf.write(entry)

def distill_findings(findings: list[dict]) -> list[dict]:
    """
    Quét danh sách các phát hiện mới từ learning loop và tiêu hóa thành tri thức kiến trúc.
    """
    ensure_knowledge_directories()
    distilled = []

    for it in findings:
        source = it.get("source", "")
        # Tập trung vào Google Research, DeepMind, Hugging Face Papers và ArXiv AI
        is_research = any(kw in source for kw in ["Google", "DeepMind", "Hugging Face", "ArXiv", "Cloudflare"])
        if is_research:
            card = distill_architectural_card(it)
            if card:
                distilled.append(card)
                print(f"   🏛️ Đã tiêu hóa Architectural Pattern: {card['title'][:65]}...")
            # Kiểm tra trích xuất bẫy lỗi
            update_pitfalls_ledger(it)

    return distilled

def main():
    ensure_knowledge_directories()
    print("Knowledge Distillation Engine đã sẵn sàng.")

if __name__ == "__main__":
    main()
