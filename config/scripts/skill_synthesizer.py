#!/usr/bin/env python3
"""
Autonomous Skill Synthesis Engine (Tầng 2 & Tầng 3)
Part of Google Antigravity Engineering Ecosystem.
Automatically performs:
  Tầng 2: Deep Ingestion (Cào README, tài liệu kiến trúc, API specs từ GitHub)
  Tầng 3: Skill Synthesis (Tự động đóng gói thành SKILL.md chuẩn Intent-First tại candidates/)
Strictly conforms to FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY (Human Gate Promotion).
"""

import os
import sys
import json
import re
import ssl
import urllib.request
from datetime import datetime, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\game\.gemini"
LEARNING_DIR = os.path.join(BASE_DIR, "config", "learning")
REFERENCES_DIR = os.path.join(LEARNING_DIR, "references")
CANDIDATES_DIR = os.path.join(LEARNING_DIR, "candidates")
EVENTS_DIR = os.path.join(LEARNING_DIR, "events")
SKILLS_DIR = os.path.join(BASE_DIR, "config", "skills")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

def get_ssl_context():
    try:
        import truststore
        truststore.inject_into_ssl()
        ctx = ssl.create_default_context()
    except Exception:
        try:
            import certifi
            ctx = ssl.create_default_context(cafile=certifi.where())
        except Exception:
            ctx = ssl._create_unverified_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
    return ctx

def fetch_raw_github_readme(repo_full_name: str) -> tuple[str, str]:
    """Tải nội dung README.md từ GitHub (thử cả nhánh main và master)"""
    ctx = get_ssl_context()
    headers = {"User-Agent": USER_AGENT, "Accept": "text/plain"}
    
    for branch in ["main", "master"]:
        url = f"https://raw.githubusercontent.com/{repo_full_name}/{branch}/README.md"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=12) as res:
                content = res.read().decode("utf-8", errors="ignore")
                if content and len(content.strip()) > 50:
                    return content, url
        except Exception:
            continue
    return "", ""

def sanitize_content_for_storage(text: str) -> str:
    """Lọc sạch các script độc hại hoặc comment CDATA tiềm ẩn trước khi lưu trữ"""
    # Xóa script tags
    text = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', text, flags=re.IGNORECASE)
    # Xóa các tag html nguy hiểm
    text = re.sub(r'<\/?(?:iframe|object|embed|applet)\b[^>]*>', '', text, flags=re.IGNORECASE)
    return text.strip()

def extract_key_sections(readme_text: str) -> dict:
    """Bóc tách các khối thông tin kỹ thuật cốt lõi từ README"""
    features = []
    installation = []
    usage_commands = []
    
    lines = readme_text.splitlines()
    in_code_block = False
    current_code = []
    
    for line in lines:
        if line.strip().startswith("```"):
            if in_code_block:
                in_code_block = False
                block_str = "\n".join(current_code).strip()
                if block_str and any(kw in block_str.lower() for kw in ["install", "run", "npm", "pip", "git", "cli", "python", "cargo", "docker"]):
                    if len(block_str) < 400:
                        usage_commands.append(block_str)
                current_code = []
            else:
                in_code_block = True
                current_code = []
            continue
            
        if in_code_block:
            current_code.append(line)
        else:
            # Thu thập các dòng tính năng
            sline = line.strip()
            if sline.startswith(("- **", "* **", "- `", "* `")) and len(sline) < 180:
                features.append(sline)
                
    return {
        "features": features[:6],
        "usage_commands": usage_commands[:4]
    }

def synthesize_skill_md(repo_full_name: str, stars: int, summary: str, readme_content: str) -> str:
    """Biên soạn file SKILL.md chuẩn mực Antigravity theo Intent-First Standard"""
    repo_slug = repo_full_name.split("/")[-1].lower()
    skill_name = re.sub(r'[^a-z0-9\-]', '-', repo_slug).strip('-')
    
    sections = extract_key_sections(readme_content)
    
    # Tạo mô tả Intent-First (hướng ý định người dùng)
    intents = [
        f"Tự động hóa hoặc tích hợp công cụ mã nguồn mở {skill_name} vào hệ thống",
        f"Giải quyết các tác vụ kỹ thuật chuyên sâu liên quan đến {summary.split('.')[0].strip()}",
        f"Thiết lập cấu hình và vận hành lệnh CLI của {repo_full_name}"
    ]
    
    desc_lines = "\n".join([f"    - {it}" for it in intents])
    
    features_md = "\n".join(sections["features"]) if sections["features"] else "- Khả năng tự động hóa và tích hợp đa nền tảng.\n- Tối ưu hóa hiệu năng và độ ổn định."
    
    commands_md = ""
    if sections["usage_commands"]:
        commands_md = "```bash\n" + "\n\n".join(sections["usage_commands"][:2]) + "\n```"
    else:
        commands_md = f"```bash\n# Tham khảo tài liệu gốc tại GitHub: {repo_full_name}\ngit clone https://github.com/{repo_full_name}.git\n```"

    skill_template = f"""---
name: {skill_name}
description: >-
  Kỹ năng chuyên gia vận hành cho {repo_full_name} ({stars} ⭐).
  Tự động kích hoạt khi người dùng muốn:
{desc_lines}
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật '{skill_name}'.
---

# {repo_full_name} — Cẩm Nang Kỹ Năng Vận Hành Chuyên Sâu

> **Nguồn gốc**: GitHub Repository `https://github.com/{repo_full_name}`  
> **Độ uy tín cộng đồng**: {stars} ⭐  
> **Trạng thái Quản trị**: `CANDIDATE` (Tuân thủ FRAMEWORK_V2_CAPABILITY_AND_LEARNING_REGISTRY)  
> **Tự động đóng gói lúc**: {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")}

---

## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi (Architectural Essence)

* **Mục tiêu cốt lõi**: {summary}
* **Lĩnh vực áp dụng**: Tự động hóa lập trình, Tác tử AI (AI Agents), và Tối ưu hóa quy trình kỹ thuật.
* **Các tính năng nổi bật được trích xuất**:
{features_md}

---

## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh (Specifications & Contracts)

Dưới đây là các cấu trúc lệnh và cấu hình thực thi tiêu chuẩn được trích xuất từ tài liệu chính thức:

{commands_md}

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
"""
    return skill_name, skill_template.strip()

def process_candidate_repo(repo_full_name: str, stars: int, summary: str) -> dict:
    """Xử lý toàn bộ quy trình: Tải tài liệu -> Lưu Reference -> Viết SKILL.md tại candidates/"""
    os.makedirs(REFERENCES_DIR, exist_ok=True)
    os.makedirs(CANDIDATES_DIR, exist_ok=True)
    os.makedirs(EVENTS_DIR, exist_ok=True)
    
    repo_slug = repo_full_name.split("/")[-1].lower()
    skill_name = re.sub(r'[^a-z0-9\-]', '-', repo_slug).strip('-')
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🔍 Bắt đầu đào sâu repo: {repo_full_name} ({stars} ⭐)...")
    
    # 1. Tầng 2: Deep Ingestion - Tải README thô
    readme_content, source_url = fetch_raw_github_readme(repo_full_name)
    if not readme_content:
        print(f"⚠️ Không thể tải README từ {repo_full_name}. Bỏ qua.")
        return {"status": "FAILED", "reason": "README_NOT_FOUND"}
        
    sanitized_readme = sanitize_content_for_storage(readme_content)
    
    # Lưu tài liệu gốc vào references/
    ref_repo_dir = os.path.join(REFERENCES_DIR, skill_name)
    os.makedirs(ref_repo_dir, exist_ok=True)
    ref_readme_path = os.path.join(ref_repo_dir, "README.md")
    with open(ref_readme_path, "w", encoding="utf-8") as f:
        f.write(sanitized_readme)
    print(f"   📁 Đã lưu tài liệu gốc: {ref_readme_path}")
    
    # 2. Tầng 3: Autonomous Skill Synthesis - Đóng gói SKILL.md
    resolved_name, skill_content = synthesize_skill_md(repo_full_name, stars, summary, sanitized_readme)
    
    candidate_skill_dir = os.path.join(CANDIDATES_DIR, resolved_name)
    os.makedirs(candidate_skill_dir, exist_ok=True)
    candidate_skill_file = os.path.join(candidate_skill_dir, "SKILL.md")
    with open(candidate_skill_file, "w", encoding="utf-8") as f:
        f.write(skill_content)
        
    # Tạo CANDIDATE_MANIFEST.yaml
    manifest_path = os.path.join(candidate_skill_dir, "CANDIDATE_MANIFEST.yaml")
    manifest_content = f"""schema_version: "1.0"
skill_name: "{resolved_name}"
source_repo: "{repo_full_name}"
stars: {stars}
status: "CANDIDATE"
created_at: "{datetime.now(timezone.utc).isoformat()}"
human_promotion_required: true
evidence_files:
  - "SKILL.md"
  - "references/{skill_name}/README.md"
"""
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content)
    print(f"   🎯 Đã đóng gói Candidate Skill: {candidate_skill_file}")
    
    # 3. Ghi nhận Sự kiện vào events/
    event_timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    event_file = os.path.join(EVENTS_DIR, f"event_candidate_{event_timestamp}_{resolved_name}.json")
    with open(event_file, "w", encoding="utf-8") as f:
        json.dump({
            "event_type": "CANDIDATE_SKILL_SYNTHESIZED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "skill_name": resolved_name,
            "source_repo": repo_full_name,
            "stars": stars,
            "status": "CANDIDATE",
            "candidate_path": candidate_skill_file,
            "human_promotion_required": True
        }, f, indent=2)
        
    return {
        "status": "SUCCESS",
        "skill_name": resolved_name,
        "candidate_file": candidate_skill_file,
        "manifest_file": manifest_path
    }

def synthesize_from_findings(findings: list[dict], min_stars=1000) -> list[dict]:
    """Quét các phát hiện từ learning loop và tự động đóng gói các repo đủ chuẩn sao"""
    synthesized = []
    for it in findings:
        source = it.get("source", "")
        # Chỉ xử lý GitHub repos
        if "GitHub" in source:
            # Bóc tách số stars: "GitHub (30722 ⭐)"
            match_stars = re.search(r'(\d+)\s*⭐', source)
            stars_val = int(match_stars.group(1)) if match_stars else 0
            
            repo_name = it.get("title", "")
            summary = it.get("snippet", "")
            
            if "/" in repo_name and stars_val >= min_stars:
                # Kiểm tra nếu skill đã tồn tại trong skills/ chính thức thì bỏ qua
                skill_slug = re.sub(r'[^a-z0-9\-]', '-', repo_name.split('/')[-1].lower()).strip('-')
                if os.path.exists(os.path.join(SKILLS_DIR, skill_slug)):
                    print(f"ℹ️ Skill '{skill_slug}' đã tồn tại trong skills chính thức, bỏ qua.")
                    continue
                    
                res = process_candidate_repo(repo_name, stars_val, summary)
                if res.get("status") == "SUCCESS":
                    synthesized.append(res)
    return synthesized

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Autonomous Skill Synthesizer (Tier 2 & 3)")
    parser.add_argument("--repo", help="Tên repo GitHub cần đào sâu (ví dụ: can1357/oh-my-pi)")
    parser.add_argument("--stars", type=int, default=1000, help="Số sao GitHub của repo")
    parser.add_argument("--summary", default="", help="Tóm tắt công năng của repo")
    args = parser.parse_args()
    
    if args.repo:
        summary = args.summary or f"Open-source engineering repository {args.repo}"
        res = process_candidate_repo(args.repo, args.stars, summary)
        print(json.dumps(res, indent=2))
    else:
        print("Vui lòng chỉ định --repo hoặc gọi qua module synthesize_from_findings().")

if __name__ == "__main__":
    main()
