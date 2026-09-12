#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
CANDIDATE BENCHMARK SCORING ENGINE (Động cơ Chấm Điểm Benchmark Ứng Viên)
=============================================================================
Đánh giá định lượng (Quantitative Scoring - Thang điểm 0-10) cho các
Candidate Skills trong config/learning/candidates/ trước khi thăng hạng:

  1. Cấu trúc & Metadata hợp lệ (SKILL.md frontmatter, Intent-First)       [2.5 điểm]
  2. Cú pháp mã nguồn / CLI command validity (lệnh an toàn, không phá hoại) [2.5 điểm]
  3. Độ bao phủ tài liệu tham chiếu (references/<skill>/README.md)         [2.5 điểm]
  4. Độ tương thích hệ sinh thái Antigravity (AGENTS.md, Rule 14, 2-strike) [2.5 điểm]

Ngưỡng khuyến nghị:
  - Điểm >= 7.5: RECOMMENDED (Khuyến nghị phê duyệt thăng hạng)
  - Điểm <  7.5: NEEDS_REVIEW (Cần hoàn thiện thêm tài liệu hoặc cú pháp)
=============================================================================
"""

import os
import sys
import re
import yaml
import json
from datetime import datetime, timezone

# Đảm bảo UTF-8 trên Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = r"C:\Users\game\.gemini"
LEARNING_DIR = os.path.join(BASE_DIR, "config", "learning")
CANDIDATES_DIR = os.path.join(LEARNING_DIR, "candidates")
REFERENCES_DIR = os.path.join(LEARNING_DIR, "references")

# Mẫu lệnh phá hoại nguy hiểm (Destructive Command Patterns)
DESTRUCTIVE_PATTERNS = [
    (r"\brm\s+(?:-[a-zA-Z0-9_-]+\s+)*(?:/[*]?|~|\*)", "Lệnh xóa đệ quy gốc hoặc wildcard nguy hiểm (rm -rf /)"),
    (r"\bformat\s+[a-zA-Z]:", "Lệnh format ổ đĩa Windows (format C:)"),
    (r"\bdel\s+(?:/[a-zA-Z]+\s+)*(?:[a-zA-Z]:\\?|[\*\\])", "Lệnh xóa hàng loạt nguy hiểm trên Windows (del /f /s /q)"),
    (r"\b(?:rd|rmdir)\s+(?:/[a-zA-Z]+\s+)*(?:[a-zA-Z]:\\?|/)", "Lệnh xóa sạch thư mục gốc Windows (rd /s /q)"),
    (r"\bmkfs\b", "Lệnh format filesystem Linux (mkfs)"),
    (r"\bdd\s+if=.*of=/dev/", "Lệnh ghi đè block device trực tiếp (dd)"),
    (r":\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:", "Fork bomb gây tê liệt hệ thống"),
    (r"\bgit\s+clean\s+-(?:[a-zA-Z]*f[a-zA-Z]*d|fd|fdx|df|dfx)\b", "Lệnh dọn sạch file không theo dõi mà không có kiểm duyệt (git clean -fdx)"),
    (r"\bgit\s+reset\s+--hard\b", "Lệnh ghi đè thô bạo commit lịch sử (git reset --hard)"),
    (r"\bgit\s+checkout\s+\.(?:\s|$)", "Lệnh hủy bỏ mọi thay đổi làm mất dữ liệu (git checkout .)"),
    (r"\bgit\s+push\s+.*(?:--force\b|-f\b|--force-with-lease\b)", "Lệnh ép đẩy phá hoại remote branch (git push --force)"),
    (r"\bchmod\s+-R\s+777\s+/", "Lệnh mở toang quyền hệ thống (chmod -R 777 /)")
]

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Bóc tách frontmatter YAML và phần thân markdown của file SKILL.md"""
    if not isinstance(content, str) or not content.startswith("---"):
        return {}, content if isinstance(content, str) else ""
    parts = content.split("---", 2)
    if len(parts) >= 3:
        try:
            fm_data = yaml.safe_load(parts[1])
            if isinstance(fm_data, dict):
                return fm_data, parts[2].strip()
            return {}, parts[2].strip()
        except Exception:
            return {}, parts[2].strip() if len(parts) > 2 else content
    return {}, content

def check_for_raw_secrets(text: str) -> list[str]:
    """Kiểm toán không có khóa bí mật (Secrets/API Tokens) thô theo Rule 14 & INV-E07"""
    found_secrets = []
    # OpenAI / generic sk- keys
    sk_keys = [k for k in re.findall(r'sk-[a-zA-Z0-9_\-\.]{16,}', text) if not k.startswith("REDACTED")]
    if sk_keys:
        found_secrets.append(f"Khóa API sk- thô ({len(sk_keys)} khóa)")
    # Bearer tokens
    bearer = re.findall(r'Bearer\s+[a-zA-Z0-9_\-\.]{20,}', text, flags=re.IGNORECASE)
    if bearer:
        found_secrets.append("Bearer Token thô")
    # GitHub personal tokens
    gh_tokens = re.findall(r'\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}\b', text)
    if gh_tokens:
        found_secrets.append("GitHub Personal Access Token thô")
    # Telegram bot tokens
    tg_tokens = re.findall(r'\b\d{8,10}:[a-zA-Z0-9_-]{35}\b', text)
    if tg_tokens:
        found_secrets.append("Telegram Bot Token thô")
    # AWS Access Key IDs
    aws_keys = re.findall(r'\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b', text)
    if aws_keys:
        found_secrets.append("AWS Access Key ID thô")
    return found_secrets

def evaluate_structure_metadata(skill_md_content: str, skill_name: str) -> tuple[float, list[str]]:
    """Đánh giá Tiêu chí 1: Cấu trúc & Metadata hợp lệ [0 - 2.5 điểm]"""
    score = 0.0
    notes = []
    
    if not skill_md_content.strip():
        return 0.0, ["File SKILL.md rỗng hoặc không tồn tại (0/2.5)"]
        
    fm, body = parse_frontmatter(skill_md_content)
    if not isinstance(fm, dict):
        fm = {}
    
    # 1. Frontmatter YAML tồn tại (+0.5đ)
    if fm:
        score += 0.5
        notes.append("Frontmatter YAML hợp lệ (+0.5)")
    else:
        notes.append("Thiếu Frontmatter YAML (-0.5)")
        
    # 2. Tên kỹ năng trong Frontmatter khớp định danh (+0.5đ)
    name_field = fm.get("name", "")
    if name_field and (name_field == skill_name or skill_name.startswith(name_field) or name_field in skill_name):
        score += 0.5
        notes.append(f"Tên kỹ năng '{name_field}' khớp thư mục (+0.5)")
    elif name_field:
        score += 0.3
        notes.append(f"Tên kỹ năng '{name_field}' có sẵn nhưng chưa khớp hoàn toàn (+0.3)")
    else:
        notes.append("Thiếu trường 'name' trong Frontmatter (-0.5)")
        
    # 3. Định dạng Intent-First trong description (+1.0đ)
    desc = str(fm.get("description", ""))
    intent_score = 0.0
    if "Tự động kích hoạt khi" in desc or "kích hoạt khi" in desc.lower():
        intent_score += 0.4
    intent_bullets = re.findall(r'-\s+[^\n]+', desc)
    if len(intent_bullets) >= 2:
        intent_score += 0.4
    elif len(intent_bullets) == 1:
        intent_score += 0.2
    if "KHÔNG CẦN người dùng phải nhớ" in desc:
        intent_score += 0.2
        
    score += intent_score
    notes.append(f"Đặc tả Intent-First chuẩn mực (+{intent_score:.1f}/1.0)")
    
    # 4. Phân đoạn Markdown cấu trúc chuẩn (+0.5đ)
    sections_found = 0
    if re.search(r'#\s+.+', body):
        sections_found += 1
    if "Bản Chất Kiến Trúc" in body or "Architectural Essence" in body:
        sections_found += 1
    if "Thông Số Kỹ Thuật" in body or "Specifications" in body or "Contract" in body:
        sections_found += 1
    if "Quy Trình Vận Hành" in body or "Runbook" in body:
        sections_found += 1
        
    section_score = min(0.5, sections_found * 0.125)
    score += section_score
    notes.append(f"Cấu trúc tài liệu Markdown ({sections_found} mục chính: +{section_score:.2f}/0.5)")
    
    return min(2.5, round(score, 2)), notes

def evaluate_command_safety(skill_md_content: str) -> tuple[float, list[str]]:
    """Đánh giá Tiêu chí 2: Cú pháp mã nguồn / CLI command validity & Safety [0 - 2.5 điểm]"""
    score = 0.0
    notes = []
    
    # 1. Khối code block thực thi (+0.5đ)
    code_blocks = re.findall(r'```[^\r\n]*\r?\n(.*?)\r?\n```', skill_md_content, re.DOTALL)
    if code_blocks:
        score += 0.5
        notes.append(f"Có {len(code_blocks)} khối mã lệnh thực thi (+0.5)")
    else:
        notes.append("Không tìm thấy khối mã lệnh code block (-0.5)")
        
    # 2. Tính hợp lệ cú pháp mã nguồn / lệnh CLI (+0.5đ)
    all_code_text = "\n".join(code_blocks) if code_blocks else ""
    valid_cli_commands = []
    for line in all_code_text.splitlines():
        line_clean = line.strip()
        if not line_clean or line_clean.startswith("#"):
            continue
        # Nhận diện lệnh CLI phổ biến
        if any(line_clean.startswith(cmd) for cmd in ["git ", "python ", "npm ", "node ", "pip ", "cargo ", "docker ", "curl ", "uv ", "pnpm "]):
            valid_cli_commands.append(line_clean)
            
    if valid_cli_commands:
        score += 0.5
        notes.append(f"Nhận diện {len(valid_cli_commands)} lệnh CLI tiêu chuẩn (+0.5)")
    elif code_blocks and len(all_code_text.strip()) > 20:
        score += 0.3
        notes.append("Chứa mã lệnh hoặc cấu hình hợp lệ (+0.3)")
    else:
        notes.append("Chưa có lệnh CLI thực thi cụ thể (-0.5)")
        
    # 3. Kiểm toán an toàn: Không chứa lệnh phá hoại (+1.5đ)
    violations = []
    for pattern, reason in DESTRUCTIVE_PATTERNS:
        if re.search(pattern, skill_md_content, re.IGNORECASE):
            violations.append(reason)
            
    if not violations:
        score += 1.5
        notes.append("An toàn tuyệt đối: Không chứa lệnh phá hoại hệ thống (+1.5)")
    else:
        score += 0.0
        notes.append(f"CẢNH BÁO: Phát hiện {len(violations)} mẫu lệnh phá hoại: {violations} (+0.0/1.5)")
        
    return min(2.5, round(score, 2)), notes

def evaluate_reference_coverage(skill_name: str) -> tuple[float, list[str]]:
    """Đánh giá Tiêu chí 3: Độ bao phủ tài liệu tham chiếu (references/<skill>/README.md) [0 - 2.5 điểm]"""
    score = 0.0
    notes = []
    
    ref_dir = os.path.join(REFERENCES_DIR, skill_name)
    ref_file = os.path.join(ref_dir, "README.md")
    
    if not os.path.exists(ref_dir):
        return 0.0, [f"Không tìm thấy thư mục tham chiếu: references/{skill_name}/ (0/2.5)"]
        
    score += 0.5
    notes.append(f"Thư mục tham chiếu references/{skill_name} tồn tại (+0.5)")
    
    if not os.path.exists(ref_file):
        return score, [f"Thiếu file references/{skill_name}/README.md (+0.5/2.5)"]
        
    try:
        with open(ref_file, "r", encoding="utf-8", errors="replace") as f:
            ref_content = f.read()
    except Exception as e:
        return score, [f"Không thể đọc file tham chiếu: {e}"]
        
    ref_len = len(ref_content.strip())
    if ref_len < 100:
        notes.append(f"Tài liệu tham chiếu quá ngắn ({ref_len} ký tự) (+0.2)")
        score += 0.2
    elif ref_len < 1000:
        notes.append(f"Tài liệu tham chiếu cơ bản ({ref_len} ký tự) (+0.8)")
        score += 0.8
    else:
        notes.append(f"Tài liệu tham chiếu chi tiết ({ref_len} ký tự) (+1.5)")
        score += 1.5
        
    # Đánh giá nội dung tài liệu gốc: có code blocks hoặc đề mục kiến trúc
    if "```" in ref_content:
        score += 0.3
        notes.append("Tài liệu tham chiếu có kèm ví dụ mã nguồn (+0.3)")
    if any(h in ref_content for h in ["#", "Installation", "Usage", "Quickstart", "Features", "Architecture"]):
        score += 0.2
        notes.append("Tài liệu tham chiếu có cấu trúc rõ ràng (+0.2)")
        
    return min(2.5, round(score, 2)), notes

def evaluate_ecosystem_compatibility(skill_md_content: str, manifest_data: dict, skill_name: str) -> tuple[float, list[str]]:
    """Đánh giá Tiêu chí 4: Độ tương thích hệ sinh thái Antigravity (AGENTS.md, Rule 14, 2-strike) [0 - 2.5 điểm]"""
    score = 0.0
    notes = []
    if not isinstance(manifest_data, dict):
        manifest_data = {}
    
    # 1. Kiểm toán Rule 14 / INV-E07: Không rò rỉ secret (+1.0đ)
    leaks = check_for_raw_secrets(skill_md_content)
    # Kiểm tra thêm trong file tham chiếu nếu có
    ref_file = os.path.join(REFERENCES_DIR, skill_name, "README.md")
    if os.path.exists(ref_file):
        try:
            with open(ref_file, "r", encoding="utf-8", errors="replace") as f:
                ref_leaks = check_for_raw_secrets(f.read())
                leaks.extend(ref_leaks)
        except Exception:
            pass
            
    if not leaks:
        score += 1.0
        notes.append("Tuân thủ AGENTS.md Rule 14 & INV-E07: Không có secret lộ lọt (+1.0)")
    else:
        notes.append(f"VI PHẠM BẢO MẬT: Phát hiện secret thô: {leaks} (+0.0/1.0)")
        
    # 2. Quy chuẩn ranh giới an toàn / Runbook / 2-strike (+0.75đ)
    safety_markers = ["Sandbox", "FAST Mode", "Runbook", "Bẫy Lỗi", "Guardrails", "Tự Kiểm chứng", "Evidence Ledger", "2-strike", "An Toàn"]
    found_markers = [m for m in safety_markers if m.lower() in skill_md_content.lower()]
    if len(found_markers) >= 3:
        score += 0.75
        notes.append(f"Khớp các nguyên tắc vận hành an toàn ({', '.join(found_markers[:3])}) (+0.75)")
    elif len(found_markers) >= 1:
        score += 0.4
        notes.append(f"Có đề cập nguyên tắc an toàn ({', '.join(found_markers)}) (+0.4)")
    else:
        notes.append("Chưa đề cập nguyên tắc ranh giới an toàn Sandbox/Runbook (-0.75)")
        
    # 3. Yêu cầu Human Gate trong Manifest (+0.75đ)
    if manifest_data.get("human_promotion_required") is True:
        score += 0.75
        notes.append("Cổng phê duyệt Human Gate (human_promotion_required=True) (+0.75)")
    else:
        notes.append("Thiếu cờ Human Gate bắt buộc trong manifest (-0.75)")
        
    return min(2.5, round(score, 2)), notes

def benchmark_candidate(skill_name: str, save_manifest: bool = True) -> dict:
    """
    Thực hiện chấm điểm benchmark định lượng toàn diện cho một Candidate Skill.
    Ghi kết quả trực tiếp vào CANDIDATE_MANIFEST.yaml của skill.
    """
    candidate_dir = os.path.join(CANDIDATES_DIR, skill_name)
    if not os.path.exists(candidate_dir):
        return {"status": "ERROR", "message": f"Không tìm thấy ứng viên '{skill_name}' tại {candidate_dir}"}
        
    skill_md_path = os.path.join(candidate_dir, "SKILL.md")
    manifest_path = os.path.join(candidate_dir, "CANDIDATE_MANIFEST.yaml")
    
    skill_content = ""
    if os.path.exists(skill_md_path):
        with open(skill_md_path, "r", encoding="utf-8", errors="replace") as f:
            skill_content = f.read()
            
    manifest_data = {}
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8", errors="replace") as f:
                loaded = yaml.safe_load(f)
                if isinstance(loaded, dict):
                    manifest_data = loaded
        except Exception:
            manifest_data = {}
            
    # Chấm 4 tiêu chí
    s1, notes1 = evaluate_structure_metadata(skill_content, skill_name)
    s2, notes2 = evaluate_command_safety(skill_content)
    s3, notes3 = evaluate_reference_coverage(skill_name)
    s4, notes4 = evaluate_ecosystem_compatibility(skill_content, manifest_data, skill_name)
    
    total_score = round(s1 + s2 + s3 + s4, 1)
    rating = "RECOMMENDED" if total_score >= 7.5 else "NEEDS_REVIEW"
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    benchmark_record = {
        "total_score": total_score,
        "rating": rating,
        "evaluated_at": now_iso,
        "breakdown": {
            "structure_metadata": s1,
            "command_safety": s2,
            "reference_coverage": s3,
            "ecosystem_compatibility": s4
        },
        "notes": notes1 + notes2 + notes3 + notes4
    }
    
    if save_manifest:
        if not isinstance(manifest_data, dict):
            manifest_data = {}
        manifest_data["benchmark"] = benchmark_record
        try:
            with open(manifest_path, "w", encoding="utf-8") as f:
                yaml.dump(manifest_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        except Exception as e:
            return {"status": "ERROR", "message": f"Không thể lưu manifest tại {manifest_path}: {e}"}
            
    return {
        "status": "SUCCESS",
        "skill_name": skill_name,
        "total_score": total_score,
        "rating": rating,
        "evaluated_at": now_iso,
        "breakdown": benchmark_record["breakdown"],
        "notes": benchmark_record["notes"],
        "manifest_file": manifest_path
    }

def benchmark_all_candidates(save_manifest: bool = True) -> dict[str, dict]:
    """Chấm điểm benchmark cho tất cả các Candidate Skills trong thư mục candidates/"""
    results = {}
    if not os.path.exists(CANDIDATES_DIR):
        return results
    for item in sorted(os.listdir(CANDIDATES_DIR)):
        item_path = os.path.join(CANDIDATES_DIR, item)
        if os.path.isdir(item_path):
            res = benchmark_candidate(item, save_manifest=save_manifest)
            results[item] = res
    return results

def print_benchmark_report(res: dict):
    """In bảng điểm Benchmark trực quan chuẩn Antigravity"""
    skill = res.get("skill_name", "Unknown")
    score = res.get("total_score", 0.0)
    rating = res.get("rating", "NEEDS_REVIEW")
    b = res.get("breakdown", {})
    
    badge = "🟢 [RECOMMENDED]" if rating == "RECOMMENDED" else "🟡 [NEEDS_REVIEW]"
    print(f"📊 ỨNG VIÊN: {skill:20} -> ĐIỂM TỔNG: {score:4.1f}/10 {badge}")
    print(f"   ├─ Cấu trúc & Metadata    : {b.get('structure_metadata', 0.0):.1f}/2.5")
    print(f"   ├─ Cú pháp & An toàn lệnh : {b.get('command_safety', 0.0):.1f}/2.5")
    print(f"   ├─ Tài liệu tham chiếu    : {b.get('reference_coverage', 0.0):.1f}/2.5")
    print(f"   └─ Tương thích hệ sinh thái: {b.get('ecosystem_compatibility', 0.0):.1f}/2.5")

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Candidate Benchmark Scoring Engine (Antigravity Ecosystem)")
    parser.add_argument("--benchmark", type=str, nargs="?", const="ALL", metavar="SKILL_NAME", 
                        help="Chấm điểm Candidate Skill cụ thể hoặc tất cả (mặc định: ALL)")
    parser.add_argument("--all", action="store_true", help="Chấm điểm tất cả Candidate Skills")
    parser.add_argument("--json", action="store_true", help="Xuất kết quả định dạng JSON")
    parser.add_argument("--verbose", action="store_true", help="Hiển thị chi tiết từng ghi chú đánh giá")
    args = parser.parse_args()
    
    target = args.benchmark
    if args.all or (target and target == "ALL") or (not target and len(sys.argv) == 1):
        target = "ALL"
        
    if target == "ALL":
        results = benchmark_all_candidates(save_manifest=True)
        if args.json:
            print(json.dumps(results, indent=2, ensure_ascii=False))
            return
        print("══════════════════════════════════════════════════════════════════════════")
        print("   BÁO CÁO CHẤM ĐIỂM BENCHMARK TOÀN BỘ CANDIDATE SKILLS (PHASE E)")
        print("══════════════════════════════════════════════════════════════════════════")
        if not results:
            print("  (Không tìm thấy Candidate Skill nào trong candidates/)")
        for sname, r in results.items():
            print_benchmark_report(r)
            if args.verbose:
                for note in r.get("notes", []):
                    print(f"      • {note}")
            print("──────────────────────────────────────────────────────────────────────────")
    else:
        res = benchmark_candidate(target, save_manifest=True)
        if args.json:
            print(json.dumps(res, indent=2, ensure_ascii=False))
            return
        if res.get("status") == "ERROR":
            print(f"❌ {res.get('message')}")
            sys.exit(1)
        print("══════════════════════════════════════════════════════════════════════════")
        print(f"   BÁO CÁO CHẤM ĐIỂM BENCHMARK CHO: {target}")
        print("══════════════════════════════════════════════════════════════════════════")
        print_benchmark_report(res)
        print("\nChi tiết đánh giá:")
        for note in res.get("notes", []):
            print(f"  • {note}")
        print("══════════════════════════════════════════════════════════════════════════")

if __name__ == "__main__":
    main()
