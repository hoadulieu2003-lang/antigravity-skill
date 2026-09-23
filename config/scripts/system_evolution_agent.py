#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
ANTIGRAVITY 2.0 — SYSTEM EVOLUTION ENGINE (CỖ MÁY TỰ TIẾN HÓA HỆ THỐNG)
===============================================================================
Module: config/scripts/system_evolution_agent.py
Vai trò (Role): Worker Pod 1 — Evolution Engine Developer
Mục tiêu (Objective):
  1. Đọc và phân tích tri thức tích lũy từ daily_learnings.md
  2. Đối chiếu với kho kỹ năng hiện hữu (config/skills/)
  3. Phân tích khoảng cách năng lực (Gap Analysis)
  4. Đề xuất cải tiến thành 3 nhóm chiến lược:
     - NEW_SKILL_CANDIDATE (Ứng viên kỹ năng mới)
     - SKILL_ENHANCEMENT (Nâng cấp kỹ năng hiện hữu)
     - ARCHITECTURE_OPTIMIZATION (Tối ưu hóa kiến trúc & quy chuẩn)
  5. Xuất báo cáo kép JSON + Markdown song ngữ và cập nhật Sổ cái Tiến hóa (evolution_ledger.json)
===============================================================================
"""

import os
import sys
import json
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Đảm bảo xuất chuẩn UTF-8 trên Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ===============================================================================
# ĐỊNH NGHĨA HẰNG SỐ & ĐƯỜNG DẪN HỆ THỐNG
# ===============================================================================
BASE_DIR = Path(r"C:\Users\game\.gemini")
KNOWLEDGE_FILE = BASE_DIR / "knowledge" / "daily_learnings.md"
SKILLS_DIR = BASE_DIR / "config" / "skills"
LEARNING_DIR = BASE_DIR / "config" / "learning"
CANDIDATES_DIR = LEARNING_DIR / "candidates"
EVOLUTION_LEDGER = LEARNING_DIR / "evolution_ledger.json"

# Danh mục ánh xạ tri thức để nhận diện các lĩnh vực công nghệ (Ưu tiên chuyên biệt lên trước)
TECH_DOMAIN_TAXONOMY = {
    "HARDWARE_PCB_EDA_DESIGN": {
        "keywords": ["easyeda", "eda", "pcb", "schematic", "circuit", "kicad", "hardware"],
        "target_skill": None,
        "domain_name": "Thiết kế Phần cứng & Mạch Điện tử (Hardware & PCB EDA Design)"
    },
    "QUANT_AND_FINANCE_AI": {
        "keywords": ["quant", "trading", "stock", "binance", "futures", "panwatch", "tick-stock", "tradingagents", "evolvetrade"],
        "target_skill": None,
        "domain_name": "Định lượng & Phân tích Thị trường (Quant & Financial AI)"
    },
    "PERSONAL_AI_OPERATING_SYSTEM": {
        "keywords": ["amethyst", "hartos", "agi os", "ai-native os", "fyagent", "desktop-eac", "nanobot", "sinew"],
        "target_skill": None,
        "domain_name": "Hệ điều hành Tác tử Cá nhân (Personal AI Operating System)"
    },
    "3D_GRAPHICS_AND_SPATIAL": {
        "keywords": ["blender", "bpy", "3d-print", "threejs", "webgl", "webgpu", "mesh", "shader"],
        "target_skill": "threejs",
        "domain_name": "Đồ họa 3D & Không gian (3D Graphics & Spatial Computing)"
    },
    "BROWSER_AUTOMATION_RPA": {
        "keywords": ["browser", "rpa", "playwright", "cdp", "puppeteer", "wechat", "selenium", "camofox", "headless", "scraping", "computer-use"],
        "target_skill": "cdp-engine",
        "domain_name": "Tự động hóa Trình duyệt & RPA (Browser Automation & RPA)"
    },
    "AST_SYNTAX_CODE_INTELLIGENCE": {
        "keywords": ["ast", "tree-sitter", "parser", "repo-map", "code-index", "symbols", "tianshu", "cvm", "stigmerg"],
        "target_skill": "ast-repo-map",
        "domain_name": "Bản đồ Cú pháp & Trí tuệ Mã nguồn (AST & Code Intelligence)"
    },
    "TERMINAL_CODING_AGENTS": {
        "keywords": ["fuxi", "aider", "cli agent", "terminal agent", "claude code", "codex cli", "cost-aware"],
        "target_skill": "aider-execution-engine",
        "domain_name": "Động cơ Lập trình Terminal (Terminal Coding Engines)"
    },
    "UI_UX_FRONTEND_ENGINEERING": {
        "keywords": ["adminforth", "vue", "dashboard", "crud", "generative ui", "shadcn", "component"],
        "target_skill": "ui-ux-pro-max",
        "domain_name": "Giao diện Người dùng & Trải nghiệm (UI/UX Engineering)"
    },
    "ADVANCED_REASONING_AND_TOOL_USE": {
        "keywords": ["toolgrad", "textual gradient", "reasoning", "focal search", "qubo", "arc", "rule-chaining", "cognitive"],
        "target_skill": "gemini-super-engine",
        "domain_name": "Suy luận Cấp cao & Gọi Công cụ (Advanced Reasoning & Tool Use)"
    },
    "MULTI_AGENT_ORCHESTRATION": {
        "keywords": ["orchestrator", "multi-agent", "council", "vcptoolbox", "mercury", "agentiloop", "swarms", "consensus", "federate"],
        "target_skill": "SYSTEM_ARCHITECTURE",
        "domain_name": "Điều phối Đa tác tử Hiệp đồng (Multi-Agent Orchestration)"
    },
    "EDGE_COMPUTE_AND_SECURITY": {
        "keywords": ["cloudflare", "casb", "dnssec", "post-quantum", "worker preview", "vary", "python workers", "cyber defense"],
        "target_skill": "SYSTEM_ARCHITECTURE",
        "domain_name": "Hạ tầng Biên & An ninh Mạng (Edge Infrastructure & Cyber Defense)"
    }
}


class LearningSessionParser:
    """Bộ bóc tách các phiên học tập tự trị từ daily_learnings.md"""

    def __init__(self, file_path: Path):
        self.file_path = file_path

    def parse(self, max_days: int = 14) -> List[Dict[str, Any]]:
        """Bóc tách các phiên học gần nhất theo số ngày chỉ định"""
        if not self.file_path.exists():
            print(f"[!] Cảnh báo: Không tìm thấy file {self.file_path}")
            return []

        with open(self.file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        # Tách theo phiên học: ## 📅 Phiên Học Tập: hoặc ## 📅 Phiên Học Tập Đa Nguồn:
        session_pattern = re.compile(
            r"## 📅 Phiên Học Tập(?: Đa Nguồn)?:\s*`([^`]+)`(.*?)(?=(?:## 📅 Phiên Học Tập)|$)",
            re.DOTALL
        )

        sessions = []
        now = datetime.now()

        for match in session_pattern.finditer(content):
            session_time_str = match.group(1).strip()
            session_body = match.group(2).strip()

            # Parse thời gian phiên
            session_dt = None
            try:
                session_dt = datetime.strptime(session_time_str, "%Y-%m-%d %H:%M:%S")
            except ValueError:
                try:
                    session_dt = datetime.strptime(session_time_str, "%Y-%m-%d")
                except ValueError:
                    pass

            # Nếu quá số ngày quy định, bỏ qua
            if session_dt and (now - session_dt).days > max_days:
                continue

            items = self._parse_items(session_body)
            if items:
                sessions.append({
                    "timestamp": session_time_str,
                    "datetime": session_dt.isoformat() if session_dt else session_time_str,
                    "total_items": len(items),
                    "items": items
                })

        return sessions

    def _parse_items(self, body: str) -> List[Dict[str, Any]]:
        """Trích xuất từng đầu mục tài liệu / repo / nghiên cứu"""
        items = []

        # Tách từng tiểu mục: ### Tiêu đề
        section_pattern = re.compile(r"###\s+([^\n]+)\n(.*?)(?=(?:###\s+)|$)", re.DOTALL)
        sections = section_pattern.findall(body)

        if not sections:
            # Fallback nếu không có ###
            sections = [("Tổng hợp (General)", body)]

        item_pattern = re.compile(
            r"-\s+\*\*\[(.*?)\]\*\*\s+\[(.*?)\]\((.*?)\)\s*\n(?:\s*>\s*(.*?)(?=\n-|\Z))?",
            re.DOTALL
        )

        for section_title, section_content in sections:
            section_title_clean = section_title.strip()

            for item_match in item_pattern.finditer(section_content):
                source = item_match.group(1).strip()
                title = item_match.group(2).strip()
                url = item_match.group(3).strip()
                desc = item_match.group(4).strip() if item_match.group(4) else ""
                # Làm sạch mô tả và loại bỏ thẻ untrusted
                desc = re.sub(r"</?untrusted_external_content>", "", desc)
                desc = re.sub(r"\s+", " ", desc).strip()

                items.append({
                    "section": section_title_clean,
                    "source": source,
                    "title": title,
                    "url": url,
                    "description": desc
                })

        return items


class SkillsInventory:
    """Quản trị danh mục kỹ năng hiện hữu của Antigravity"""

    def __init__(self, skills_dir: Path):
        self.skills_dir = skills_dir
        self.skills: Dict[str, Dict[str, Any]] = {}
        self._scan()

    def _scan(self):
        if not self.skills_dir.exists():
            return

        for item in self.skills_dir.iterdir():
            if item.is_dir() and not item.name.startswith("."):
                skill_slug = item.name
                skill_md = item / "SKILL.md"
                description = ""
                name = skill_slug

                if skill_md.exists():
                    try:
                        with open(skill_md, "r", encoding="utf-8", errors="replace") as f:
                            text = f.read(2048)  # Đọc 2KB đầu lấy frontmatter
                            # Parse YAML frontmatter nếu có
                            fm_match = re.search(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
                            if fm_match:
                                fm_text = fm_match.group(1)
                                name_match = re.search(r"name:\s*(.+)", fm_text)
                                desc_match = re.search(r"description:\s*(.+)", fm_text)
                                if name_match:
                                    name = name_match.group(1).strip().strip("'\"")
                                if desc_match:
                                    description = desc_match.group(1).strip().strip("'\"")
                    except Exception:
                        pass

                self.skills[skill_slug] = {
                    "slug": skill_slug,
                    "name": name,
                    "description": description,
                    "path": str(skill_md if skill_md.exists() else item)
                }

    def has_skill(self, skill_name_or_slug: str) -> bool:
        slug = skill_name_or_slug.lower().replace("_", "-")
        return slug in self.skills

    def get_skill_names(self) -> List[str]:
        return sorted(list(self.skills.keys()))


class SystemEvolutionAgent:
    """Cỗ máy phân tích đối chiếu (Gap Analysis) và kiến tạo đề xuất tiến hóa"""

    def __init__(self, max_days: int = 14):
        self.max_days = max_days
        self.parser = LearningSessionParser(KNOWLEDGE_FILE)
        self.inventory = SkillsInventory(SKILLS_DIR)
        self.today_str = datetime.now().strftime("%Y%m%d")

    def run_evolution_cycle(self) -> Dict[str, Any]:
        """Thực thi một chu trình tự tiến hóa toàn diện"""
        print(f"[*] 🚀 Bắt đầu Chu trình Tiến hóa Hệ thống Antigravity (Ngày: {self.today_str})...")

        # 1. Thu thập dữ liệu phiên học
        sessions = self.parser.parse(max_days=self.max_days)
        total_items = sum(s["total_items"] for s in sessions)
        print(f"[*] 📚 Đã quét {len(sessions)} phiên học gần nhất, tổng cộng {total_items} tài nguyên công nghệ.")

        # 2. Thu thập danh mục skills hiện có
        existing_skills = self.inventory.get_skill_names()
        print(f"[*] 🧰 Kho kỹ năng hiện hữu: {len(existing_skills)} skills đang hoạt động.")

        # 3. Phân tích đối chiếu (Gap Analysis)
        gap_results = self._perform_gap_analysis(sessions, existing_skills)

        # 4. Xuất kết quả JSON
        json_path = CANDIDATES_DIR / f"upgrade_{self.today_str}.json"
        self._export_json(gap_results, json_path)

        # 5. Xuất báo cáo Markdown song ngữ
        md_path = CANDIDATES_DIR / f"upgrade_{self.today_str}_briefing.md"
        self._export_markdown(gap_results, md_path)

        # 6. Ghi nhận Sổ cái Tiến hóa (evolution_ledger.json)
        self._update_ledger(gap_results, json_path, md_path)

        print(f"[+] ✅ Hoàn tất Chu trình Tiến hóa thành công!")
        print(f"    - JSON Data: {json_path}")
        print(f"    - Briefing MD: {md_path}")
        print(f"    - Evolution Ledger: {EVOLUTION_LEDGER}")

        return gap_results

    def _perform_gap_analysis(self, sessions: List[Dict[str, Any]], existing_skills: List[str]) -> Dict[str, Any]:
        """Thực hiện bóc tách, đối sánh và phân loại thành 3 nhóm đề xuất"""
        new_skill_candidates: List[Dict[str, Any]] = []
        skill_enhancements: List[Dict[str, Any]] = []
        architecture_optimizations: List[Dict[str, Any]] = []

        seen_entities = set()

        for session in sessions:
            for item in session["items"]:
                title = item["title"]
                desc = item["description"]
                source = item["source"]
                url = item["url"]
                full_text = f"{title} {desc} {item['section']}".lower()

                # Xác định domain công nghệ
                matched_domain = None
                matched_target_skill = None

                for domain_key, domain_info in TECH_DOMAIN_TAXONOMY.items():
                    for kw in domain_info["keywords"]:
                        if kw in full_text:
                            matched_domain = domain_info
                            matched_target_skill = domain_info["target_skill"]
                            break
                    if matched_domain:
                        break

                entity_id = title.split("/")[1] if "/" in title else title
                entity_id = entity_id.strip()
                entity_slug = re.sub(r"[^a-z0-9_-]", "-", entity_id.lower()).strip("-")
                entity_slug = re.sub(r"-+", "-", entity_slug)[:40].strip("-")

                if entity_id in seen_entities or entity_slug in seen_entities:
                    continue
                seen_entities.add(entity_id)
                seen_entities.add(entity_slug)

                # KIỂM TRA SỰ TỒN TẠI TRONG KHO KỸ NĂNG HIỆN HỮU (GAP ANALYSIS CORE)
                already_has_own_skill = self.inventory.has_skill(entity_slug) or self.inventory.has_skill(entity_id)

                # PHÂN LOẠI CHI TIẾT
                # Nhóm 1: ARCHITECTURE_OPTIMIZATION (Tối ưu hóa kiến trúc & Quy chuẩn)
                if matched_target_skill == "SYSTEM_ARCHITECTURE" or "google deepmind" in source.lower() or "google research" in source.lower() or "cloudflare" in source.lower():
                    arch_rec = self._evaluate_architecture_opportunity(item, matched_domain)
                    if arch_rec:
                        architecture_optimizations.append(arch_rec)

                # Nhóm 2: SKILL_ENHANCEMENT (Nếu đã có skill mang tên này hoặc có target_skill đã tồn tại)
                elif already_has_own_skill:
                    target_name = entity_slug if self.inventory.has_skill(entity_slug) else entity_id
                    enhancement = self._evaluate_skill_enhancement(item, target_name, matched_domain)
                    if enhancement:
                        skill_enhancements.append(enhancement)

                elif matched_target_skill and self.inventory.has_skill(matched_target_skill):
                    enhancement = self._evaluate_skill_enhancement(item, matched_target_skill, matched_domain)
                    if enhancement:
                        skill_enhancements.append(enhancement)

                # Nhóm 3: NEW_SKILL_CANDIDATE (Công nghệ đột phá mà hệ thống CHƯA CÓ skill)
                else:
                    new_candidate = self._evaluate_new_skill_candidate(item, matched_domain)
                    if new_candidate:
                        new_skill_candidates.append(new_candidate)

        # Lọc và xếp hạng ưu tiên (Priority Ranking)
        new_skill_candidates.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
        skill_enhancements.sort(key=lambda x: x.get("priority_score", 0), reverse=True)
        architecture_optimizations.sort(key=lambda x: x.get("priority_score", 0), reverse=True)

        return {
            "analysis_metadata": {
                "scan_date": datetime.now(timezone.utc).isoformat(),
                "cycle_id": f"EVO-{self.today_str}",
                "sessions_evaluated": len(sessions),
                "total_items_processed": sum(s["total_items"] for s in sessions),
                "active_skills_count": len(existing_skills),
                "candidates_count": len(new_skill_candidates),
                "enhancements_count": len(skill_enhancements),
                "optimizations_count": len(architecture_optimizations)
            },
            "new_skill_candidates": new_skill_candidates[:12],  # Giữ top các ứng viên sáng giá nhất
            "skill_enhancements": skill_enhancements[:12],
            "architecture_optimizations": architecture_optimizations[:12]
        }

    def _evaluate_new_skill_candidate(self, item: Dict[str, Any], domain: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Đánh giá và cấu trúc hóa đề xuất kỹ năng mới"""
        title = item["title"]
        desc = item["description"]
        source = item["source"]
        url = item["url"]

        # Trích xuất slug và tên kỹ năng chuẩn hóa
        raw_slug = title.split("/")[-1].lower() if "/" in title else title.lower()
        # Loại bỏ các từ thừa
        raw_slug = re.sub(r"[^a-z0-9_-]", "-", raw_slug).strip("-")
        slug = re.sub(r"-+", "-", raw_slug)[:40].strip("-")

        # Đánh giá độ ưu tiên dựa trên loại nguồn và sao GitHub
        priority_score = 40
        is_github = "github" in source.lower()
        if is_github:
            priority_score += 25  # Mã nguồn mở thực thi được có độ khả thi cao hơn lý thuyết

        stars_match = re.search(r"(\d+)\s*⭐", source)
        if stars_match:
            stars = int(stars_match.group(1))
            if stars > 10000:
                priority_score += 35
            elif stars > 1000:
                priority_score += 25
            elif stars > 100:
                priority_score += 15

        # Thưởng điểm cho các từ khóa công cụ/tác tử thực chiến
        text_lower = f"{title} {desc}".lower()
        for kw in ["agent", "harness", "framework", "os", "desktop", "eda", "quant", "trading", "rpa", "copilot"]:
            if kw in text_lower:
                priority_score += 5
                break

        domain_label = domain["domain_name"] if domain else "Công nghệ Mới nổi (Emerging Technology)"

        # Tạo template cấu trúc SKILL.md gợi ý
        suggested_skill_md = f"""---
name: {slug}
description: Tự động kích hoạt khi người dùng muốn tận dụng {title} cho các tác vụ {domain_label}.
---

# {title.upper()} SKILL ARCHITECTURE

## 🎯 1. Mục tiêu & Định vị (Intent & Positioning)
- Kế thừa giải pháp từ: `{title}` ({url})
- Lĩnh vực: {domain_label}

## 🛠️ 2. Workflows & Công cụ (Tools & Operations)
- Kích hoạt quy trình xử lý chuyên sâu theo ngữ cảnh.
- Tích hợp chuẩn giao tiếp Model Context Protocol (MCP) hoặc CLI execution engine.
"""

        return {
            "skill_slug": slug,
            "title": title,
            "source": source,
            "url": url,
            "domain": domain_label,
            "priority": "HIGH" if priority_score >= 70 else ("MEDIUM" if priority_score >= 50 else "EXPLORATORY"),
            "priority_score": priority_score,
            "capability_gap": f"Hệ thống hiện chưa có công cụ chuyên biệt tối ưu hóa cho {domain_label}.",
            "proposed_value": desc or f"Mở rộng khả năng xử lý của Antigravity trong mảng {domain_label}.",
            "suggested_skill_structure": suggested_skill_md
        }

    def _evaluate_skill_enhancement(self, item: Dict[str, Any], target_skill: str, domain: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Đánh giá cơ hội gia cố kỹ năng hiện hữu"""
        title = item["title"]
        desc = item["description"]
        source = item["source"]
        url = item["url"]

        priority_score = 60
        stars_match = re.search(r"(\d+)\s*⭐", source)
        if stars_match:
            stars = int(stars_match.group(1))
            if stars > 1000:
                priority_score += 25
            elif stars > 100:
                priority_score += 15

        specific_actions = {
            "cdp-engine": "Tích hợp công nghệ chống nhận diện (Anti-detection stealth) hoặc browser wrapper tối ưu hóa cho AI agents.",
            "ast-repo-map": "Nâng cấp cơ chế tiền lưu trữ cú pháp (Prefix caching / Stigmergy) giảm tối đa độ trễ nạp AST context.",
            "aider-execution-engine": "Bổ sung cơ chế định tuyến mô hình thông minh nhận biết chi phí (Cost-aware model routing).",
            "ui-ux-pro-max": "Bổ sung mẫu giao diện quản trị tác tử (Agentic Admin CRUD) và tương tác phản hồi trực quan.",
            "gemini-super-engine": "Khai thác kỹ thuật Textual Gradients (ToolGrad) để tinh chỉnh cú pháp và tăng độ chính xác khi gọi công cụ."
        }

        action_plan = specific_actions.get(target_skill, f"Bổ sung tri thức và thuật toán từ {title} vào module {target_skill}.")

        return {
            "target_skill": target_skill,
            "source_technology": title,
            "source_url": url,
            "source_type": source,
            "priority": "HIGH" if priority_score >= 75 else "MEDIUM",
            "priority_score": priority_score,
            "enhancement_rationale": desc or f"Cải thiện sức mạnh thực thi của skill {target_skill}.",
            "recommended_action": action_plan
        }

    def _evaluate_architecture_opportunity(self, item: Dict[str, Any], domain: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Đánh giá cơ hội tối ưu kiến trúc lõi & quy chuẩn vận hành"""
        title = item["title"]
        desc = item["description"]
        source = item["source"]
        url = item["url"]

        priority_score = 70
        if "deepmind" in source.lower() or "google research" in source.lower():
            priority_score += 25
        elif "cloudflare" in source.lower():
            priority_score += 15

        impact_area = "Tư duy Suy luận & An ninh Hệ thống (Reasoning Scaffold & System Security)"
        recommendation = "Cập nhật quy chuẩn vận hành AGENTS.md và tinh chỉnh System 2 Thinking Scaffolding."

        if "casb" in title.lower() or "cyber defense" in title.lower() or "dnssec" in title.lower():
            impact_area = "An ninh & Phòng thủ Chủ động (Security & Active Defense)"
            recommendation = "Thiết lập cơ chế tự động khắc phục sự cố (Auto-remediation policies) cho các lỗ hổng hệ thống."
        elif "worker preview" in title.lower():
            impact_area = "Môi trường Thử nghiệm Cách ly (Isolated Sandbox Preview)"
            recommendation = "Tự động kích hoạt môi trường xem trước (Preview branch) cho mỗi thay đổi do Subagents thực hiện."
        elif "toolgrad" in title.lower() or "focal search" in title.lower() or "rule-chaining" in title.lower():
            impact_area = "Thuật toán Suy luận & Gọi Công cụ (Reasoning & Tool Execution)"
            recommendation = "Nâng cấp kỹ thuật Textual Gradients và chuỗi quy tắc đa tầng vào AGENTS.md Rule 1."
        elif "orchestrator" in title.lower() or "vcptoolbox" in title.lower() or "mercury" in title.lower():
            impact_area = "Hội Đồng Đa Tác Tử (Multi-Agent Council Protocol)"
            recommendation = "Chuẩn hóa giao thức phân quyền, ngân sách token (Token budgets) và kênh giám sát 24/7."

        return {
            "title": title,
            "source": source,
            "url": url,
            "priority": "STRATEGIC" if priority_score >= 85 else "HIGH",
            "priority_score": priority_score,
            "impact_area": impact_area,
            "rationale": desc,
            "architectural_recommendation": recommendation
        }

    def _export_json(self, data: Dict[str, Any], output_path: Path):
        """Xuất dữ liệu chuẩn JSON cho máy đọc"""
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def _export_markdown(self, data: Dict[str, Any], output_path: Path):
        """Xuất báo cáo Markdown song ngữ Anh-Việt cao cấp cho Lead Architect & Orchestrator"""
        meta = data["analysis_metadata"]
        new_skills = data["new_skill_candidates"]
        enhancements = data["skill_enhancements"]
        optimizations = data["architecture_optimizations"]

        lines = []
        lines.append(f"# 🧬 BÁO CÁO TIẾN HÓA HỆ THỐNG ANTIGRAVITY (SYSTEM EVOLUTION BRIEFING)")
        lines.append(f"> **Mã chu kỳ (Cycle ID)**: `{meta['cycle_id']}` | **Thời gian**: `{meta['scan_date'][:19].replace('T', ' ')} UTC`  ")
        lines.append(f"> **Chủ quản**: Anh — Lead Architect / Product Owner  ")
        lines.append(f"> **Tác tử thực thi**: Worker Pod 1 — Evolution Engine Developer  ")
        lines.append(f"\n---\n")

        lines.append(f"## 📊 1. Bức Tranh Tổng Thể (Executive Summary & Metrics)")
        lines.append(f"| Chỉ số (Metric) | Số lượng (Count) | Ý nghĩa Kỹ thuật (Technical Rationale) |")
        lines.append(f"| :--- | :--- | :--- |")
        lines.append(f"| **Phiên học đã quét (Sessions Evaluated)** | `{meta['sessions_evaluated']}` | Toàn bộ tri thức tích lũy mới nhất trong `daily_learnings.md` |")
        lines.append(f"| **Tài nguyên công nghệ (Items Processed)** | `{meta['total_items_processed']}` | Các bài báo DeepMind, Cloudflare, ArXiv, GitHub Trending |")
        lines.append(f"| **Kỹ năng hiện hữu (Active Skills)** | `{meta['active_skills_count']}` | Kho năng lực sẵn có tại `config/skills/` |")
        lines.append(f"| **Ứng viên Kỹ năng Mới (New Skill Candidates)** | `{meta['candidates_count']}` | Các khoảng trống công nghệ cần bổ sung độc lập |")
        lines.append(f"| **Đề xuất Nâng cấp Kỹ năng (Skill Enhancements)** | `{meta['enhancements_count']}` | Tối ưu hóa các module hiện có (`cdp-engine`, `ui-ux`, v.v.) |")
        lines.append(f"| **Tối ưu Hóa Kiến Trúc (Architecture Optimizations)** | `{meta['optimizations_count']}` | Đột phá về lý thuyết suy luận, an ninh và đa tác tử |")
        lines.append(f"\n---\n")

        # PHẦN 2: ỨNG VIÊN KỸ NĂNG MỚI
        lines.append(f"## 🌟 2. Đề Xuất Ứng Viên Kỹ Năng Mới (`NEW_SKILL_CANDIDATE`)")
        lines.append(f"Các công nghệ đột phá giải quyết những bài toán mà Antigravity 2.0 hiện chưa có module chuyên trách:\n")

        for idx, item in enumerate(new_skills, 1):
            badge = "🔥 [HIGH PRIORITY]" if item["priority"] == "HIGH" else "⚡ [MEDIUM PRIORITY]"
            lines.append(f"### 2.{idx}. `{item['skill_slug']}` — {item['title']} {badge}")
            lines.append(f"- **Nguồn gốc (Source)**: [{item['source']}]({item['url']})")
            lines.append(f"- **Lĩnh vực (Domain)**: `{item['domain']}`")
            lines.append(f"- **Khoảng trống Năng lực (Capability Gap)**: {item['capability_gap']}")
            lines.append(f"- **Giá trị Đề xuất (Proposed Value)**: {item['proposed_value']}")
            lines.append(f"\n```yaml")
            lines.append(f"# Gợi ý Cấu trúc SKILL.md (Suggested Specification)")
            lines.append(item['suggested_skill_structure'].strip())
            lines.append(f"```\n")

        lines.append(f"---\n")

        # PHẦN 3: NÂNG CẤP KỸ NĂNG HIỆN HỮU
        lines.append(f"## 🛠️ 3. Đề Xuất Nâng Cấp Kỹ Năng Hiện Hữu (`SKILL_ENHANCEMENT`)")
        lines.append(f"Gia cố các module sẵn có bằng các giải thuật hoặc thư viện bổ trợ mới nhất:\n")
        lines.append(f"| Kỹ năng Mục tiêu (Target) | Công nghệ Đối chiếu (Source Tech) | Mức độ Ưu tiên (Priority) | Hành động Đề xuất (Recommended Action) |")
        lines.append(f"| :--- | :--- | :--- | :--- |")
        for item in enhancements:
            lines.append(f"| **`{item['target_skill']}`** | [{item['source_technology']}]({item['source_url']}) | `{item['priority']}` | {item['recommended_action']} |")
        lines.append(f"\n")

        # PHẦN 4: TỐI ƯU KIẾN TRÚC LÕI
        lines.append(f"## 🏛️ 4. Đề Xuất Tối Ưu Kiến Trúc & Quy Chuẩn (`ARCHITECTURE_OPTIMIZATION`)")
        lines.append(f"Các phát hiện mang tầm chiến lược tác động đến Hiến chương Tự trị và Quy tắc Suy luận Cấp cao:\n")

        for idx, item in enumerate(optimizations, 1):
            lines.append(f"#### 4.{idx}. {item['title']} — `{item['impact_area']}` ({item['priority']})")
            lines.append(f"- **Nguồn nghiên cứu**: [{item['source']}]({item['url']})")
            if item.get("rationale"):
                lines.append(f"- **Bối cảnh lý thuyết**: {item['rationale']}")
            lines.append(f"- **Khuyến nghị Kiến trúc (Architectural Directive)**: 👉 **{item['architectural_recommendation']}**\n")

        lines.append(f"---\n")
        lines.append(f"## 🎯 5. Kế Hoạch Hành Động Tiếp Theo (Next Action Steps)")
        lines.append(f"1. **Lead Orchestrator Phê Duyệt**: Anh và Tác tử Trưởng xem xét danh sách ứng viên.")
        lines.append(f"2. **Thực thi Tạo Candidate**: Với các mục `NEW_SKILL_CANDIDATE` đạt chuẩn, chuyển tiếp sang `skill_synthesizer.py` để đóng gói `SKILL.md` hoàn chỉnh.")
        lines.append(f"3. **Kiểm Thử Độc Lập**: Triển khai test suite trước khi Promote vào `config/skills/` chính thức theo quy trình Human Gate.")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def _update_ledger(self, data: Dict[str, Any], json_path: Path, md_path: Path):
        """Cập nhật Sổ cái Tiến hóa Hệ thống (evolution_ledger.json)"""
        EVOLUTION_LEDGER.parent.mkdir(parents=True, exist_ok=True)

        ledger = {
            "version": "2.0.0",
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "total_cycles_run": 0,
            "cycles": []
        }

        if EVOLUTION_LEDGER.exists():
            try:
                with open(EVOLUTION_LEDGER, "r", encoding="utf-8") as f:
                    ledger = json.load(f)
            except Exception:
                pass

        meta = data["analysis_metadata"]
        cycle_entry = {
            "cycle_id": meta["cycle_id"],
            "timestamp": meta["scan_date"],
            "sessions_analyzed": meta["sessions_evaluated"],
            "items_processed": meta["total_items_processed"],
            "candidates_count": meta["candidates_count"],
            "enhancements_count": meta["enhancements_count"],
            "optimizations_count": meta["optimizations_count"],
            "artifacts": {
                "json_report": str(json_path),
                "briefing_markdown": str(md_path)
            },
            "status": "COMPLETED_PENDING_ARCHITECT_REVIEW"
        }

        # Kiểm tra xem cycle_id đã có chưa để thay thế hoặc chèn mới
        existing_index = None
        for i, c in enumerate(ledger.get("cycles", [])):
            if c.get("cycle_id") == meta["cycle_id"]:
                existing_index = i
                break

        if existing_index is not None:
            ledger["cycles"][existing_index] = cycle_entry
        else:
            ledger["cycles"].append(cycle_entry)

        ledger["total_cycles_run"] = len(ledger["cycles"])
        ledger["last_updated"] = datetime.now(timezone.utc).isoformat()

        with open(EVOLUTION_LEDGER, "w", encoding="utf-8") as f:
            json.dump(ledger, f, ensure_ascii=False, indent=2)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity 2.0 System Evolution Engine")
    parser.add_argument("--days", type=int, default=14, help="Số ngày phiên học gần nhất cần quét (Mặc định: 14 ngày)")
    args = parser.parse_args()

    agent = SystemEvolutionAgent(max_days=args.days)
    results = agent.run_evolution_cycle()

    meta = results["analysis_metadata"]
    print("\n" + "="*70)
    print(f"🎉 TỔNG KẾT CHU TRÌNH TIẾN HÓA ({meta['cycle_id']}):")
    print(f"   • Phiên học đã phân tích: {meta['sessions_evaluated']}")
    print(f"   • Tài nguyên công nghệ đã xử lý: {meta['total_items_processed']}")
    print(f"   • Ứng viên Kỹ năng mới (NEW_SKILL_CANDIDATE): {meta['candidates_count']}")
    print(f"   • Đề xuất Nâng cấp Kỹ năng (SKILL_ENHANCEMENT): {meta['enhancements_count']}")
    print(f"   • Tối ưu Kiến trúc (ARCHITECTURE_OPTIMIZATION): {meta['optimizations_count']}")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
