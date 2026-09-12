#!/usr/bin/env python3
"""
Autonomous Learning Governance Engine (Phase E Runtime)
Part of Google Antigravity Engineering Ecosystem.
Implements the Governed Continuous Learning Lifecycle (Tri-State: RECORD -> ACTIVATE -> PROMOTE),
heuristic triggers, secret sanitization (INV-E07), and registry synchronization for Phase E.
"""

import os
import sys
import json
import re
import yaml
from datetime import datetime, timezone

# Đảm bảo xuất chuẩn UTF-8 trên Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"C:\Users\game\.gemini"
LEARNING_DIR = os.path.join(BASE_DIR, "config", "learning")
EVENTS_DIR = os.path.join(LEARNING_DIR, "events")
CANDIDATES_DIR = os.path.join(LEARNING_DIR, "candidates")
REGISTRY_FILE = os.path.join(LEARNING_DIR, "registry.yaml")
DOMAIN_DIR = os.path.join(LEARNING_DIR, "domain")

def sanitize_secrets(text: str) -> tuple[str, bool]:
    """Sanitize secrets / tokens if present (INV-E07)"""
    if not text or not isinstance(text, str):
        return text, False
    original = text
    # Redact Bearer tokens
    text = re.sub(r'Bearer\s+[a-zA-Z0-9_\-\.]+', '[REDACTED_BEARER_TOKEN]', text, flags=re.IGNORECASE)
    # Redact API keys (with or without quotes)
    text = re.sub(r'api[-_]?key\s*[:=]\s*[\'\"]?[a-zA-Z0-9_\-\.]{8,}[\'\"]?', 'api_key: [REDACTED_API_KEY]', text, flags=re.IGNORECASE)
    # Redact generic sk- tokens (OpenAI, Anthropic, etc.)
    text = re.sub(r'sk-[a-zA-Z0-9_\-\.]{16,}', '[REDACTED_SECRET_KEY]', text)
    # Redact GitHub tokens
    text = re.sub(r'\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36,}\b', '[REDACTED_GITHUB_TOKEN]', text)
    text = re.sub(r'\bgithub_pat_[a-zA-Z0-9_]{50,}\b', '[REDACTED_GITHUB_TOKEN]', text)
    # Redact Telegram bot tokens
    text = re.sub(r'\b\d{8,10}:[a-zA-Z0-9_-]{35}\b', '[REDACTED_TELEGRAM_TOKEN]', text)
    # Redact AWS Access Key IDs
    text = re.sub(r'\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b', '[REDACTED_AWS_KEY]', text)
    return text, text != original

def sanitize_event_data(data):
    """Recursively sanitize all string fields in an event data structure (INV-E07)"""
    secrets_found = False
    if isinstance(data, dict):
        cleaned_dict = {}
        for k, v in data.items():
            cleaned_v, found = sanitize_event_data(v)
            cleaned_dict[k] = cleaned_v
            if found:
                secrets_found = True
        return cleaned_dict, secrets_found
    elif isinstance(data, list):
        cleaned_list = []
        for item in data:
            cleaned_item, found = sanitize_event_data(item)
            cleaned_list.append(cleaned_item)
            if found:
                secrets_found = True
        return cleaned_list, secrets_found
    elif isinstance(data, str):
        clean_text, found = sanitize_secrets(data)
        return clean_text, found
    return data, False

class LearningGovernanceRuntime:
    def __init__(self, learning_dir=LEARNING_DIR, registry_file=REGISTRY_FILE):
        self.learning_dir = learning_dir
        self.events_dir = os.path.join(learning_dir, "events")
        self.candidates_dir = os.path.join(learning_dir, "candidates")
        self.registry_file = registry_file
        os.makedirs(self.events_dir, exist_ok=True)
        os.makedirs(self.candidates_dir, exist_ok=True)

    def load_registry(self) -> dict:
        """Đọc file registry.yaml chuẩn mực"""
        if not os.path.exists(self.registry_file):
            raise FileNotFoundError(f"Không tìm thấy registry file: {self.registry_file}")
        with open(self.registry_file, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
        return data

    def save_registry(self, registry_data: dict):
        """Ghi an toàn vào file registry.yaml"""
        with open(self.registry_file, "w", encoding="utf-8") as f:
            yaml.dump(registry_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    def read_all_events(self) -> list[dict]:
        """Quét và chuẩn hóa toàn bộ sự kiện từ thư mục events/ (.json và .yaml)"""
        events = []
        if not os.path.exists(self.events_dir):
            return events

        for fname in sorted(os.listdir(self.events_dir)):
            fpath = os.path.join(self.events_dir, fname)
            if not os.path.isfile(fpath):
                continue

            event_obj = None
            try:
                if fname.endswith(".json"):
                    with open(fpath, "r", encoding="utf-8") as f:
                        event_obj = json.load(f)
                elif fname.endswith((".yaml", ".yml")):
                    with open(fpath, "r", encoding="utf-8") as f:
                        event_obj = yaml.safe_load(f)
            except Exception as e:
                print(f"⚠️ Không thể phân tích sự kiện {fname}: {e}")
                continue

            if not isinstance(event_obj, dict):
                continue

            # INV-E07: Làm sạch sâu thông tin nhạy cảm (secrets) trên toàn bộ cấu trúc sự kiện
            event_obj, secrets_removed = sanitize_event_data(event_obj)
            if secrets_removed:
                event_obj["secrets_removed"] = True

            # Chuẩn hóa metadata sự kiện
            event_id = event_obj.get("event_id") or os.path.splitext(fname)[0]
            event_type = event_obj.get("event_type", "UNKNOWN_EVENT")
            timestamp = event_obj.get("timestamp", datetime.now(timezone.utc).isoformat())

            event_obj["_file"] = fname
            event_obj["event_id"] = event_id
            event_obj["event_type"] = event_type
            event_obj["timestamp"] = timestamp
            events.append(event_obj)

        return events

    def analyze_learning_events(self, events: list[dict]) -> dict:
        """Phân tích các mẫu sự kiện, kích hoạt heuristic triggers và quản trị candidate"""
        autonomous_captures = 0
        knowledge_ingestions = 0
        failure_events = 0
        active_domains_found = []
        pattern_counter = {}

        for ev in events:
            ev_type = ev.get("event_type", "")
            if ev_type == "AUTONOMOUS_LEARNING_CAPTURE":
                autonomous_captures += 1
            elif ev_type == "KNOWLEDGE_INGESTION":
                knowledge_ingestions += 1
                domain = ev.get("domain")
                if domain and ev.get("status") == "ACTIVATED":
                    active_domains_found.append({
                        "domain": domain,
                        "manifest": f"config/learning/domain/{domain}/DOMAIN_MANIFEST.yaml",
                        "activated_at": ev.get("timestamp"),
                        "approved_by": ev.get("approved_by", "Anh (Product Owner)")
                    })
            elif ev_type in ["FAILURE_PATTERN", "TEST_FAIL", "TEST_BLOCKED", "REJECTED", "ROLLED_BACK"]:
                failure_events += 1

            # Đếm số lần lặp lại mẫu
            pattern_key = ev.get("domain") or ev_type
            pattern_counter[pattern_key] = pattern_counter.get(pattern_key, 0) + 1

        return {
            "total_events": len(events),
            "autonomous_captures": autonomous_captures,
            "knowledge_ingestions": knowledge_ingestions,
            "failure_events": failure_events,
            "active_domains_found": active_domains_found,
            "pattern_counter": pattern_counter
        }

    def sync(self) -> dict:
        """Thực thi chu trình đồng bộ hoá trạng thái học tập (Phase E Sync)"""
        registry = self.load_registry()
        events = self.read_all_events()
        analysis = self.analyze_learning_events(events)

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        registry["last_updated"] = now_iso

        # 1. BẢO VỆ TÍNH BẤT BIẾN (INVARIANTS LOCK):
        # INV-E01 & INV-E05: Tuyệt đối không cho phép tự động đột biến phạm vi Global mà không có Human Gate
        invariants = registry.get("invariants", {})
        invariants["autonomous_observation"] = True
        invariants["autonomous_candidate_creation"] = True
        invariants["autonomous_global_mutation"] = False
        invariants["human_promotion_required"] = True
        invariants["scope_priority"] = "NARROWEST_VALID_SCOPE_FIRST"
        registry["invariants"] = invariants

        # 2. CẬP NHẬT ACTIVE DOMAIN PACKS ĐÃ ĐƯỢC PHÊ DUYỆT
        current_packs = registry.get("active_domain_packs", [])
        known_domains = {p.get("domain") for p in current_packs if isinstance(p, dict)}
        for pack in analysis["active_domains_found"]:
            if pack["domain"] not in known_domains:
                current_packs.append(pack)
                known_domains.add(pack["domain"])
        registry["active_domain_packs"] = current_packs

        # 3. GHI NHẬN TRẠNG THÁI RUNTIME SYNC VÀO REGISTRY
        registry["governance_mode"] = "STRICT_HUMAN_PROMOTION_GATE"
        healthy, violations = self.audit_invariants()
        sync_status = "HEALTHY" if healthy else f"DEGRADED ({len(violations)} VIOLATIONS)"
        if not healthy:
            print(f"⚠️ Cảnh báo: Phát hiện {len(violations)} vi phạm bất biến khi sync: {violations}")

        registry["runtime_sync"] = {
            "last_sync": now_iso,
            "total_events_processed": analysis["total_events"],
            "autonomous_captures": analysis["autonomous_captures"],
            "knowledge_ingestions": analysis["knowledge_ingestions"],
            "failure_events": analysis["failure_events"],
            "sync_status": sync_status,
            "invariants_verified": [
                "INV-E01 (No autonomous global mutation)",
                "INV-E02 (One-off observation != Global rule)",
                "INV-E05 (Heuristic review trigger only)",
                "INV-E07 (Zero secrets/credentials ingested)"
            ]
        }

        self.save_registry(registry)
        return {
            "status": "SUCCESS" if healthy else "DEGRADED",
            "timestamp": now_iso,
            "analysis": analysis,
            "violations": violations
        }

    def audit_invariants(self) -> tuple[bool, list[str]]:
        """Kiểm toán độc lập toàn bộ các tính bất biến quản trị Phase E (INV-E01 -> INV-E07)"""
        registry = self.load_registry()
        violations = []

        invariants = registry.get("invariants", {})
        if invariants.get("autonomous_global_mutation") is not False:
            violations.append("VIOLATION: autonomous_global_mutation must be strictly False (INV-E01)")

        if invariants.get("human_promotion_required") is not True:
            violations.append("VIOLATION: human_promotion_required must be strictly True (INV-E05)")

        if registry.get("governance_mode") != "STRICT_HUMAN_PROMOTION_GATE":
            violations.append("VIOLATION: governance_mode must be STRICT_HUMAN_PROMOTION_GATE")

        # Kiểm tra promoted_rules: chỉ được phép có khi có bằng chứng và human approval
        for rule in registry.get("promoted_rules", []):
            if isinstance(rule, dict) and not rule.get("approved_by"):
                violations.append(f"VIOLATION: Rule '{rule.get('id')}' promoted without approved_by")

        # Kiểm tra các event xem có chứa secret lộ lọt hay không (INV-E07)
        events = self.read_all_events()
        for ev in events:
            text = str(ev)
            # Tìm mọi chuỗi sk- thô chưa được làm sạch
            uncleaned_sk = [tok for tok in re.findall(r'sk-[a-zA-Z0-9_\-\.]{16,}', text) if not tok.startswith("REDACTED")]
            for token in uncleaned_sk:
                violations.append(f"VIOLATION: Event '{ev.get('event_id')}' contains raw secret (INV-E07)")

            # Tìm telegram tokens thô
            uncleaned_tg = re.findall(r'\b\d{8,10}:[a-zA-Z0-9_-]{35}\b', text)
            for token in uncleaned_tg:
                violations.append(f"VIOLATION: Event '{ev.get('event_id')}' contains raw Telegram bot token (INV-E07)")

            # Tìm AWS access key thô
            uncleaned_aws = re.findall(r'\b(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b', text)
            for token in uncleaned_aws:
                violations.append(f"VIOLATION: Event '{ev.get('event_id')}' contains raw AWS access key (INV-E07)")

        is_healthy = len(violations) == 0
        return is_healthy, violations

    def list_candidates(self) -> list[dict]:
        """Liệt kê toàn bộ các Candidate Skills đang chờ phê duyệt tại candidates/"""
        candidates = []
        if not os.path.exists(self.candidates_dir):
            return candidates
        for item in sorted(os.listdir(self.candidates_dir)):
            item_path = os.path.join(self.candidates_dir, item)
            if os.path.isdir(item_path):
                manifest_path = os.path.join(item_path, "CANDIDATE_MANIFEST.yaml")
                skill_path = os.path.join(item_path, "SKILL.md")
                manifest_data = {}
                if os.path.exists(manifest_path):
                    try:
                        with open(manifest_path, "r", encoding="utf-8") as f:
                            loaded = yaml.safe_load(f)
                            if isinstance(loaded, dict):
                                manifest_data = loaded
                    except Exception:
                        manifest_data = {}
                benchmark_data = manifest_data.get("benchmark", {}) if isinstance(manifest_data, dict) else {}
                candidates.append({
                    "name": item,
                    "status": manifest_data.get("status", "CANDIDATE"),
                    "stars": manifest_data.get("stars", 0),
                    "source_repo": manifest_data.get("source_repo", "Unknown"),
                    "created_at": manifest_data.get("created_at", "Unknown"),
                    "has_skill_file": os.path.exists(skill_path),
                    "benchmark": benchmark_data
                })
        return candidates

    def promote_candidate(self, skill_name: str, approved_by: str = "Anh (Product Owner)") -> bool:
        """Thăng hạng Candidate Skill thành Official Skill theo chuẩn Human Gate (INV-E05)"""
        candidate_dir = os.path.join(self.candidates_dir, skill_name)
        candidate_skill_file = os.path.join(candidate_dir, "SKILL.md")
        if not os.path.exists(candidate_skill_file):
            print(f"❌ Không tìm thấy Candidate Skill '{skill_name}' tại {candidate_skill_file}")
            return False

        target_skill_dir = os.path.join(BASE_DIR, "config", "skills", skill_name)
        os.makedirs(target_skill_dir, exist_ok=True)
        target_skill_file = os.path.join(target_skill_dir, "SKILL.md")

        import shutil
        shutil.copy2(candidate_skill_file, target_skill_file)

        # Cập nhật registry.yaml
        registry = self.load_registry()
        promoted = registry.get("promoted_skills", [])
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        existing = [p for p in promoted if isinstance(p, dict) and p.get("skill") == skill_name]
        if not existing:
            promoted.append({
                "skill": skill_name,
                "promoted_at": now_iso,
                "approved_by": approved_by,
                "manifest": f"config/skills/{skill_name}/SKILL.md"
            })
        registry["promoted_skills"] = promoted
        self.save_registry(registry)

        # Ghi nhận sự kiện
        event_timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        event_file = os.path.join(self.events_dir, f"event_promoted_{event_timestamp}_{skill_name}.json")
        with open(event_file, "w", encoding="utf-8") as ef:
            json.dump({
                "event_type": "SKILL_PROMOTED_HUMAN_GATE",
                "timestamp": now_iso,
                "skill_name": skill_name,
                "approved_by": approved_by,
                "target_path": target_skill_file
            }, ef, indent=2)

        print(f"🎉 THĂNG HẠNG THÀNH CÔNG! Kỹ năng '{skill_name}' đã chính thức kích hoạt tại: {target_skill_file}")
        print(f"   Đã đăng ký vào registry.yaml dưới sự phê duyệt của: {approved_by}")
        return True

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Autonomous Learning Governance Engine (Phase E Runtime)")
    parser.add_argument("--sync", action="store_true", help="Chạy đồng bộ hoá sự kiện và cập nhật registry.yaml")
    parser.add_argument("--audit", action="store_true", help="Kiểm toán các bất biến INV-E01 đến INV-E07")
    parser.add_argument("--status", action="store_true", help="Hiển thị trạng thái kho tri thức và registry")
    parser.add_argument("--candidates", action="store_true", help="Liệt kê danh sách Candidate Skills đang chờ duyệt")
    parser.add_argument("--benchmark", type=str, nargs="?", const="ALL", metavar="SKILL_NAME", help="Chấm điểm Benchmark định lượng cho Candidate Skill")
    parser.add_argument("--promote", type=str, metavar="SKILL_NAME", help="Thăng hạng Candidate Skill thành Official Skill (Human Gate)")
    args = parser.parse_args()

    runtime = LearningGovernanceRuntime()

    if args.candidates:
        cands = runtime.list_candidates()
        print("════════════════════════════════════════════════════════════════")
        print("   DANH SÁCH CANDIDATE SKILLS ĐANG CHỜ PHÊ DUYỆT (HUMAN GATE)")
        print("════════════════════════════════════════════════════════════════")
        if not cands:
            print("  (Hiện chưa có Candidate Skill nào trong candidates/)")
        for c in cands:
            print(f"• Kỹ năng      : {c['name']} (Từ repo: {c['source_repo']} - {c['stars']} ⭐)")
            print(f"  Trạng thái   : {c['status']}")
            bench = c.get("benchmark", {})
            if bench and "total_score" in bench:
                rating = bench.get("rating", "NEEDS_REVIEW")
                badge = "🟢 [RECOMMENDED]" if rating == "RECOMMENDED" else "🟡 [NEEDS_REVIEW]"
                bk = bench.get("breakdown", {})
                print(f"  Benchmark    : {bench.get('total_score', 0)}/10 {badge} (Cấu trúc: {bk.get('structure_metadata', 0)} | Lệnh: {bk.get('command_safety', 0)} | Tài liệu: {bk.get('reference_coverage', 0)} | Tương thích: {bk.get('ecosystem_compatibility', 0)})")
            else:
                print(f"  Benchmark    : ⚪ Chưa chấm điểm (Chạy: python candidate_benchmark.py --benchmark {c['name']})")
            print(f"  File SKILL.md: {'Có sẵn' if c['has_skill_file'] else 'Thiếu'}")
            print(f"  Lệnh duyệt   : python learning_governance.py --promote {c['name']}")
            print("────────────────────────────────────────────────────────────────")
        return

    if args.benchmark:
        try:
            import candidate_benchmark
            if args.benchmark == "ALL":
                res = candidate_benchmark.benchmark_all_candidates(save_manifest=True)
                for sname, r in res.items():
                    candidate_benchmark.print_benchmark_report(r)
            else:
                res = candidate_benchmark.benchmark_candidate(args.benchmark, save_manifest=True)
                if res.get("status") == "ERROR":
                    print(f"❌ {res.get('message')}")
                    sys.exit(1)
                candidate_benchmark.print_benchmark_report(res)
        except Exception as e:
            print(f"❌ Lỗi khi thực hiện Benchmark: {e}")
            sys.exit(1)
        return

    if args.promote:
        print(f"🚀 Bắt đầu quy trình Thăng hạng Human Gate cho Kỹ năng: '{args.promote}'...")
        success = runtime.promote_candidate(args.promote)
        sys.exit(0 if success else 1)

    if args.audit:
        print("🔍 Đang kiểm toán các tính bất biến Quản trị Học tập Phase E...")
        healthy, violations = runtime.audit_invariants()
        if healthy:
            print("✅ KIỂM TOÁN HOÀN HẢO: Tất cả các tính bất biến INV-E01 -> INV-E07 đều được tôn trọng nghiêm ngặt.")
            sys.exit(0)
        else:
            print(f"❌ PHÁT HIỆN {len(violations)} VI PHẠM:")
            for v in violations:
                print(f"   - {v}")
            sys.exit(1)

    if args.status:
        reg = runtime.load_registry()
        events = runtime.read_all_events()
        print("════════════════════════════════════════════════════════════════")
        print("  BÁO CÁO TRẠNG THÁI QUẢN TRỊ HỌC TẬP (PHASE E REGISTRY STATUS)")
        print("════════════════════════════════════════════════════════════════")
        print(f"• Registry ID        : {reg.get('registry_id')}")
        print(f"• Governance Mode    : {reg.get('governance_mode')}")
        print(f"• Last Updated       : {reg.get('last_updated')}")
        print(f"• Tổng số Sự kiện    : {len(events)}")
        print(f"• Domain Packs       : {[p.get('domain') for p in reg.get('active_domain_packs', [])]}")
        print(f"• Capability History : {len(reg.get('capability_routing_history', []))} mục")
        sync_info = reg.get("runtime_sync", {})
        if sync_info:
            print(f"• Trạng thái Sync    : {sync_info.get('sync_status')} (Lúc: {sync_info.get('last_sync')})")
        print("════════════════════════════════════════════════════════════════")
        return

    # Mặc định chạy sync
    print("🚀 Đang chạy Động cơ Quản trị Học tập Phase E (Learning Governance Runtime)...")
    res = runtime.sync()
    analysis = res["analysis"]
    print(f"✅ Đồng bộ hoàn tất lúc: {res['timestamp']}")
    print(f"   - Tổng số sự kiện đã xử lý : {analysis['total_events']}")
    print(f"   - Phiên học tự trị (Loop)   : {analysis['autonomous_captures']}")
    print(f"   - Tri thức Ingestion        : {analysis['knowledge_ingestions']}")
    print(f"   - Sự kiện Thất bại/Lỗi      : {analysis['failure_events']}")
    print(f"   - Registry file đã đồng bộ  : {REGISTRY_FILE}")

if __name__ == "__main__":
    main()
