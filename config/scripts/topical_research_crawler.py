#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
TOPICAL RESEARCH CRAWLER (Động cơ Đào sâu Chuyên đề Kỹ thuật Trọng tâm)
=============================================================================
Nhiệm vụ:
  Chủ động đào sâu và cập nhật 4 Cẩm nang Thực chiến (Domain Playbooks)
  tại `knowledge/domain_playbooks/`:
    1. gsap-motion-60fps.md           : Kỹ thuật đồ họa, animation 60 FPS, GSAP timeline
    2. media-pipeline-automation.md   : Tự động hóa video, FFmpeg recipe, Veo 3.1 rendering
    3. agent-orchestration.md         : Thiết kế đa tác tử, routing công cụ, topology
    4. web-performance-accessibility.md: Chuẩn WCAG AA, React 19 / Cloudflare Workers
=============================================================================
"""

import os
import sys
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

# Đảm bảo terminal console Windows luôn xuất Unicode UTF-8 chuẩn xác
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
PLAYBOOKS_DIR = KNOWLEDGE_DIR / "domain_playbooks"

# Cấu hình 4 Cẩm nang Thực chiến Trọng tâm của Công ty Anh
TOPICAL_DOMAINS = {
    "gsap-motion-60fps": {
        "title": "Cẩm Nang Đồ Họa & Chuyển Động Siêu Mượt 60 FPS (GSAP Motion Playbook)",
        "tech_stack": "GSAP 3.12+, ScrollTrigger, SplitText, Flip, React useGSAP, WebGL Canvas",
        "core_invariants": [
            "Khóa cứng tốc độ khung hình 60 FPS bằng cách chỉ can thiệp vào thuộc tính `transform (x, y, scale, rotation)` và `opacity` (Composite-only properties).",
            "Luôn dọn dẹp bộ nhớ với `gsap.context()` hoặc `useGSAP({ revertOnUpdate: true })` trong React để triệt tiêu triệt để rò rỉ bộ nhớ (Memory Leaks).",
            "Sử dụng `will-change: transform` thận trọng trên các phần tử nặng để ép GPU tăng tốc phần cứng mà không làm tràn bộ nhớ VRAM."
        ],
        "curated_patterns": [
            {
                "name": "Scrollytelling Pinned Stage Pattern",
                "code": "gsap.timeline({ scrollTrigger: { trigger: '.stage', pin: true, scrub: 0.8, start: 'top top', end: '+=300%' } })"
            },
            {
                "name": "Sub-pixel Antialiasing & Aliases",
                "code": "gsap.set(element, { force3D: true, z: 0.01, backfaceVisibility: 'hidden' })"
            }
        ]
    },
    "media-pipeline-automation": {
        "title": "Cẩm Nang Tự Động Hóa Xưởng Video & Xử Lý Đa Phương Tiện (Media Pipeline Playbook)",
        "tech_stack": "FFmpeg Master Stitcher, Google Flow Veo 3.1 CDP, Video/Audio Synchronization",
        "core_invariants": [
            "Sử dụng codec copy (`-c copy`) khi ghép video có cùng thông số bitrate/fps để tăng tốc xuất xưởng tức thì không tốn CPU re-encode.",
            "Chuẩn hóa âm thanh LUFS tích hợp (`-af loudnorm=I=-16:TP=-1.5:LRA=11`) cho mọi video đầu ra để đảm bảo âm lượng đồng nhất trên mọi thiết bị.",
            "Phân tách luồng render Veo 3.1 qua CDP sang cổng riêng (9223) để không chiếm dụng tab ChatGPT (cổng 9222)."
        ],
        "curated_patterns": [
            {
                "name": "Lossless Video Concat with Transition",
                "code": "ffmpeg -f concat -safe 0 -i filelist.txt -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k output.mp4"
            },
            {
                "name": "Silence Stripper & Pacing Tightener",
                "code": "ffmpeg -i input.wav -af silenceremove=start_periods=1:start_duration=0.1:start_threshold=-50dB output.wav"
            }
        ]
    },
    "agent-orchestration": {
        "title": "Cẩm Nang Thiết Kế Kiến Trúc Đa Tác Tử Động (Multi-Agent Orchestration Playbook)",
        "tech_stack": "Antigravity Dynamic Project System V2, Spec-Driven Development, Human Gate",
        "core_invariants": [
            "Nguyên tắc Bất biến: Antigravity là Lead Engine kiêm Integrator duy nhất, chịu trách nhiệm tích hợp toàn bộ output từ các tác tử phụ.",
            "Áp dụng quy tắc 2-Strike nghiêm ngặt: Khi gặp lỗi lần 2 phải dừng lập tức, rollback về checkpoint an toàn và báo cáo nguyên nhân gốc rễ.",
            "Khóa chết hạn mức đầu ra 128K Token (131,072 tokens) và Always-On Max Reasoning cho mọi quyết định kiến trúc."
        ],
        "curated_patterns": [
            {
                "name": "Spec-First Handoff Pattern",
                "code": "$plan (Definition) -> $dev (Partition & Verify) -> $test (Explicit Independent Audit)"
            },
            {
                "name": "Adversarial Code Review Scaffold",
                "code": "Self-Reflection Prompt: 'Find at least 2 residual risks, security loopholes, or trade-offs before output.'"
            }
        ]
    },
    "web-performance-accessibility": {
        "title": "Cẩm Nang Tối Ưu Hiệu Năng Web & Chuẩn Trợ Năng (Web Performance & WCAG AA Playbook)",
        "tech_stack": "Next.js App Router, React 19 Server Components, Cloudflare Workers, Tailwind CSS",
        "core_invariants": [
            "Tương phản màu sắc bắt buộc đạt chuẩn WCAG AA: Tối thiểu 4.5:1 cho văn bản thông thường và 3:1 cho văn bản kích thước lớn/tiêu đề.",
            "Tất cả các thành phần tương tác (Sliders, Knobs, Drawers) bắt buộc hỗ trợ đầy đủ bàn phím (`ArrowUp`, `ArrowDown`, `Home`, `End`, `Escape`).",
            "Zero Cumulative Layout Shift (CLS = 0): Mọi hình ảnh và iframe bắt buộc định nghĩa rõ `aspect-ratio` hoặc kích thước `width/height` trước khi render."
        ],
        "curated_patterns": [
            {
                "name": "Keyboard Accessible Custom Control",
                "code": "role='slider' aria-valuenow={val} tabIndex={0} onKeyDown={(e) => handleKeyNavigation(e)}"
            },
            {
                "name": "Cloudflare Workers Edge Caching Header",
                "code": "headers.set('Cache-Control', 'public, max-age=31536000, immutable, s-maxage=31536000')"
            }
        ]
    }
}

def sync_domain_playbooks():
    """
    Biên soạn và đồng bộ 4 cẩm nang thực chiến vào knowledge/domain_playbooks/.
    """
    PLAYBOOKS_DIR.mkdir(parents=True, exist_ok=True)
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    updated = []

    for domain_id, domain_info in TOPICAL_DOMAINS.items():
        playbook_file = PLAYBOOKS_DIR / f"{domain_id}.md"

        invariants_md = "\n".join([f"- **INV-{idx+1:02d}**: {inv}" for idx, inv in enumerate(domain_info["core_invariants"])])
        patterns_md = ""
        for pat in domain_info["curated_patterns"]:
            patterns_md += f"### 📌 {pat['name']}\n```bash\n{pat['code']}\n```\n\n"

        content = f"""# 📘 {domain_info['title']}

> **Chủ quản**: Anh — Lead Architect / Product Owner  
> **Hệ thống áp dụng**: Anti AI Pair-Programmer  
> **Hệ sinh thái công nghệ**: `{domain_info['tech_stack']}`  
> **Cập nhật lần cuối**: {now_iso}

---

## 1. Các Quy Tắc Bất Biến Cốt Lõi (`Core Engineering Invariants`)
{invariants_md}

---

## 2. Các Mẫu Lệnh & Code Thực Chiến (`Production Code Patterns`)
{patterns_md}

---

## 3. Quy Chuẩn Kiểm Chứng Độc Lập (`Verification Criteria`)
* Mọi giải pháp mã nguồn thuộc lĩnh vực này đều phải chạy kiểm thử cú pháp và đo lường số liệu thực tế trước khi xuất xưởng.
* Luôn tự kiểm toán bẫy lỗi biên (`Edge Cases`) để bảo toàn hiệu năng cao nhất.

---
*Cẩm nang này là tài sản kiến thức độc quyền, được duy trì tự động bởi Topical Research Crawler.*
"""

        with open(playbook_file, "w", encoding="utf-8") as f:
            f.write(content)
        updated.append(domain_id)
        print(f"   📘 Đã cập nhật Cẩm nang Thực chiến: {domain_id}.md")

    return updated

def main():
    print("[*] Bắt đầu đồng bộ Cẩm nang Thực chiến Chuyên đề...")
    updated = sync_domain_playbooks()
    print(f"[V] Hoàn tất cập nhật {len(updated)} cẩm nang thực chiến tại: {PLAYBOOKS_DIR}")

if __name__ == "__main__":
    main()
