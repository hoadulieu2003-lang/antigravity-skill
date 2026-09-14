#!/usr/bin/env python3
"""
Audit Remediation Comprehensive Verification Suite ($test)
Verifies all 5 key fixes implemented across the ecosystem.
"""
import os
import sys
import json
import re
import ssl
import yaml
import unittest

BASE_DIR = r"C:\Users\game\.gemini"
CONFIG_DIR = os.path.join(BASE_DIR, "config")
SCRIPTS_DIR = os.path.join(CONFIG_DIR, "scripts")
SIDECARS_DIR = os.path.join(CONFIG_DIR, "sidecars")
SKILLS_DIR = os.path.join(CONFIG_DIR, "skills")
LEARNING_DIR = os.path.join(CONFIG_DIR, "learning")
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge")

# Add scripts directory to sys.path
sys.path.insert(0, SCRIPTS_DIR)
import anti_learning_loop
import learning_governance

class TestAuditRemediation(unittest.TestCase):
    
    # -------------------------------------------------------------
    # 1. Anti Learning Loop Verification
    # -------------------------------------------------------------
    def test_01_ssl_context_uses_truststore_or_certifi(self):
        """Kiểm tra SSL Context không tắt kiểm tra chứng chỉ hoàn toàn (No CERT_NONE by default)"""
        ctx = anti_learning_loop.get_ssl_context()
        self.assertIsNotNone(ctx)
        # Context phải thực hiện xác minh chứng chỉ (CERT_REQUIRED)
        self.assertEqual(ctx.verify_mode, ssl.CERT_REQUIRED)

    def test_02_snippet_cleaner_handles_html_properly(self):
        """Kiểm tra trích xuất snippet bóc tách thẻ HTML, CDATA, script/style và entities"""
        raw_html = "<p>Discover how filmmakers and <b>Google DeepMind</b> used AI &amp; agents in film.</p>"
        clean = anti_learning_loop.clean_html_snippet(raw_html, max_length=100)
        self.assertEqual(clean, "Discover how filmmakers and Google DeepMind used AI & agents in film.")
        self.assertFalse(clean.startswith("<"))
        self.assertTrue(len(clean) > 0)

        # Kiểm tra CDATA và khối script/style
        complex_cdata = "<![CDATA[<style>.leak{display:none}</style><p>DeepMind Agentic Workflow &amp; Reasoning</p>]]>"
        clean_cdata = anti_learning_loop.clean_html_snippet(complex_cdata)
        self.assertEqual(clean_cdata, "DeepMind Agentic Workflow & Reasoning")
        self.assertNotIn("]]>", clean_cdata)
        self.assertNotIn("display:none", clean_cdata)

    def test_03_daily_learnings_contains_untrusted_content_tags(self):
        """Kiểm tra daily_learnings.md bọc nội dung cào từ web ngoài trong <untrusted_external_content>"""
        output_file = os.path.join(KNOWLEDGE_DIR, "daily_learnings.md")
        self.assertTrue(os.path.exists(output_file))
        with open(output_file, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("<untrusted_external_content>", content)
        self.assertIn("</untrusted_external_content>", content)

    def test_04_deduplication_cache_mechanism(self):
        """Kiểm tra cơ chế chống ghi trùng lặp lưu trữ và lọc URL chuẩn xác"""
        cache = anti_learning_loop.load_seen_cache()
        self.assertIsInstance(cache, set)
        self.assertTrue(len(cache) > 0, "Seen cache should have recorded links from runs")
        # Test add and save
        test_url = "https://test.example.com/unique-article-999"
        cache.add(test_url)
        anti_learning_loop.save_seen_cache(cache)
        reloaded = anti_learning_loop.load_seen_cache()
        self.assertIn(test_url, reloaded)
        # Cleanup test url
        reloaded.remove(test_url)
        anti_learning_loop.save_seen_cache(reloaded)

    def test_05_log_rotation_preserves_document_header(self):
        """Kiểm tra rotate_learning_log bảo vệ Header, ranh giới phiên và tính Idempotent qua nhiều chu trình xoay vòng"""
        import tempfile
        original_output = anti_learning_loop.OUTPUT_FILE
        try:
            with tempfile.NamedTemporaryFile(mode='w+', delete=False, encoding='utf-8') as tf:
                # Tạo header chuẩn
                tf.write("# 🧠 KHO TRI THỨC HỌC TẬP TỰ TRỊ HÀNG NGÀY (DAILY KNOWLEDGE VAULT)\n")
                tf.write("> Quản trị: Antigravity Autonomous Learning Engine\n")
                tf.write("> Tự động cập nhật mỗi khi Anh khởi động máy tính.\n\n")
                # Tạo 25 phiên học tập (~300 dòng)
                for s in range(25):
                    tf.write(f"## 📅 Phiên Học Tập: `2026-09-{s:02d}`\n")
                    tf.write("<untrusted_external_content>\n")
                    for itm in range(8):
                        tf.write(f"- Item {s}_{itm}\n")
                    tf.write("</untrusted_external_content>\n---\n")
                temp_log_path = tf.name

            anti_learning_loop.OUTPUT_FILE = temp_log_path

            # Chu trình xoay vòng lần 1 (ngưỡng 80 dòng)
            anti_learning_loop.rotate_learning_log(max_lines=80)
            with open(temp_log_path, "r", encoding="utf-8") as f:
                content_r1 = f.read()

            self.assertIn("# 🧠 KHO TRI THỨC HỌC TẬP TỰ TRỊ HÀNG NGÀY", content_r1[:100])
            self.assertEqual(content_r1.count("Ghi chú: Đã nén"), 1)

            # Thêm các phiên mới
            with open(temp_log_path, "a", encoding="utf-8") as f:
                for s in range(25, 35):
                    f.write(f"## 📅 Phiên Học Tập: `2026-09-{s:02d}`\n")
                    f.write("<untrusted_external_content>\n")
                    for itm in range(8):
                        f.write(f"- Item {s}_{itm}\n")
                    f.write("</untrusted_external_content>\n---\n")

            # Chu trình xoay vòng lần 2 (ngưỡng 80 dòng) -> kiểm tra tính Idempotent không nhân bản note
            anti_learning_loop.rotate_learning_log(max_lines=80)
            with open(temp_log_path, "r", encoding="utf-8") as f:
                content_r2 = f.read()

            self.assertIn("# 🧠 KHO TRI THỨC HỌC TẬP TỰ TRỊ HÀNG NGÀY", content_r2[:100])
            # Tuyệt đối chỉ có duy nhất 1 thông báo nén
            self.assertEqual(content_r2.count("Ghi chú: Đã nén"), 1, "Compression note must remain idempotent and not duplicate")
        finally:
            anti_learning_loop.OUTPUT_FILE = original_output
            if os.path.exists(temp_log_path):
                os.remove(temp_log_path)

    # -------------------------------------------------------------
    # 2. Config.json Normalization & Sandbox Verification
    # -------------------------------------------------------------
    def test_06_config_json_plugins_disabled_properly(self):
        """Kiểm tra config.json vô hiệu hóa đúng các plugin rác"""
        cfg_path = os.path.join(CONFIG_DIR, "config.json")
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)

        plugins = cfg.get("plugins", {})
        self.assertFalse(plugins.get("science", {}).get("enabled", True), "science must be disabled")
        self.assertFalse(plugins.get("android-cli-plugin", {}).get("enabled", True), "android-cli-plugin must be disabled")
        self.assertFalse(plugins.get("firebase", {}).get("enabled", True), "firebase must be disabled")
        self.assertFalse(plugins.get("flutter", {}).get("enabled", True), "flutter must be disabled")

        # Giữ lại các plugin cốt lõi
        self.assertTrue(plugins.get("chrome-devtools-plugin", {}).get("enabled", False))
        self.assertTrue(plugins.get("modern-web-guidance-plugin", {}).get("enabled", False))
        self.assertTrue(plugins.get("google-antigravity-sdk", {}).get("enabled", False))

    def test_07_terminal_sandbox_enabled(self):
        """Kiểm tra enableTerminalSandbox được bật lại (True) để bảo vệ máy trạm"""
        cfg_path = os.path.join(CONFIG_DIR, "config.json")
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        self.assertTrue(cfg.get("userSettings", {}).get("enableTerminalSandbox", False))

    def test_08_ai_engine_settings_normalized(self):
        """Kiểm tra aiEngineSettings tuân thủ Rule 1.5 HYPER_OVERCLOCKED_X8_ENGINEERING_ONLY"""
        cfg_path = os.path.join(CONFIG_DIR, "config.json")
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        settings = cfg.get("aiEngineSettings", {})
        self.assertEqual(settings.get("status"), "HYPER_OVERCLOCKED_X8_ENGINEERING_ONLY")
        self.assertEqual(settings.get("outputTokenMultiplier"), 8)
        self.assertEqual(settings.get("maxOutputTokensHeadroom"), 131072)
        self.assertEqual(settings.get("activeModel"), "gemini-3.8-flash")

    # -------------------------------------------------------------
    # 3. MCP Path & Secrets Protection Verification
    # -------------------------------------------------------------
    def test_09_mcp_config_points_to_canonical_sidecar(self):
        """Kiểm tra mcp_config.json trỏ thống nhất về sidecar trong .gemini"""
        mcp_cfg_path = os.path.join(CONFIG_DIR, "mcp_config.json")
        with open(mcp_cfg_path, "r", encoding="utf-8") as f:
            mcp_cfg = json.load(f)
        server_args = mcp_cfg.get("mcpServers", {}).get("cdp-bridge", {}).get("args", [])
        self.assertTrue(len(server_args) > 0)
        canonical_path = os.path.normpath(server_args[0])
        expected_path = os.path.normpath(r"C:\Users\game\.gemini\config\sidecars\cdp-bridge\cdp_mcp_server.js")
        self.assertEqual(canonical_path.lower(), expected_path.lower())

    def test_10_hub_config_no_plaintext_secrets(self):
        """Kiểm tra hub_config.json và telegram_master_listener.cjs không chứa token/secret dưới dạng plaintext"""
        hub_cfg_path = os.path.join(SIDECARS_DIR, "antigravity_master_hub", "hub_config.json")
        with open(hub_cfg_path, "r", encoding="utf-8") as f:
            hub_cfg = json.load(f)
        self.assertTrue(hub_cfg.get("bot_token", "").startswith("ENV:"))
        self.assertTrue(hub_cfg.get("nine_router_api_key", "").startswith("ENV:"))

        # Kiểm tra không có fallback hardcoded secret trong listener
        listener_path = os.path.join(SIDECARS_DIR, "antigravity_master_hub", "telegram_master_listener.cjs")
        with open(listener_path, "r", encoding="utf-8") as f:
            listener_code = f.read()
        self.assertNotIn("sk-f0c362c89bb464a4-odn1dd-95ae3a99", listener_code, "Listener must not contain hardcoded secret")
        for match in re.findall(r'sk-[a-zA-Z0-9_\-\.]{16,}', listener_code):
            self.fail(f"Found hardcoded secret in telegram listener: {match}")

    def test_11_env_local_and_gitignore_exist(self):
        """Kiểm tra file .env.local và .gitignore bảo vệ secrets tồn tại"""
        env_local = os.path.join(SIDECARS_DIR, "antigravity_master_hub", ".env.local")
        gitignore = os.path.join(SIDECARS_DIR, "antigravity_master_hub", ".gitignore")
        self.assertTrue(os.path.exists(env_local))
        self.assertTrue(os.path.exists(gitignore))
        with open(gitignore, "r", encoding="utf-8") as f:
            gi_content = f.read()
        self.assertIn(".env.local", gi_content)

    # -------------------------------------------------------------
    # 4. Learning Governance Runtime Verification (Phase E)
    # -------------------------------------------------------------
    def test_12_learning_governance_secret_sanitizer(self):
        """Kiểm tra hàm khử thông tin nhạy cảm INV-E07 trong learning_governance toàn diện"""
        dirty = "Error at Bearer sk-ant-secret123 with api_key: 'sk-99998888777766665555'"
        clean, removed = learning_governance.sanitize_secrets(dirty)
        self.assertTrue(removed)
        self.assertNotIn("sk-ant-secret123", clean)
        self.assertIn("[REDACTED_BEARER_TOKEN]", clean)
        self.assertIn("[REDACTED_API_KEY]", clean)

        # Kiểm tra unquoted api_key, Telegram bot token, và AWS access key
        dirty_unquoted = "api_key: secret_unquoted_token_12345678 and token: 8912939973:AAF54TxJyBSTUIAbAt5vLOzm5xjvVGXqUbU with AKIAIOSFODNN7EXAMPLE"
        clean_u, rem_u = learning_governance.sanitize_secrets(dirty_unquoted)
        self.assertTrue(rem_u)
        self.assertIn("[REDACTED_API_KEY]", clean_u)
        self.assertIn("[REDACTED_TELEGRAM_TOKEN]", clean_u)
        self.assertIn("[REDACTED_AWS_KEY]", clean_u)

    def test_13_learning_governance_audit_passes(self):
        """Kiểm toán toàn diện các tính bất biến INV-E01 -> INV-E07 bằng chính runtime engine"""
        runtime = learning_governance.LearningGovernanceRuntime()
        healthy, violations = runtime.audit_invariants()
        self.assertTrue(healthy, f"Audit violations: {violations}")
        self.assertEqual(len(violations), 0)

    def test_14_registry_invariants_strictly_locked(self):
        """Kiểm tra registry.yaml khóa chặt autonomous_global_mutation = False và human_promotion_required = True"""
        runtime = learning_governance.LearningGovernanceRuntime()
        reg = runtime.load_registry()
        invariants = reg.get("invariants", {})
        self.assertFalse(invariants.get("autonomous_global_mutation", True))
        self.assertTrue(invariants.get("human_promotion_required", False))
        self.assertIn("runtime_sync", reg)
        self.assertEqual(reg["runtime_sync"].get("sync_status"), "HEALTHY")

    # -------------------------------------------------------------
    # 5. Semantic Skill Collision Verification
    # -------------------------------------------------------------
    def test_15_skill_descriptions_are_well_partitioned(self):
        """Kiểm tra mô tả kỹ năng của cả 4 frontend skills (design, ui-ux-pro-max, open-design, gsap) đã phân định rõ ranh giới"""
        design_path = os.path.join(SKILLS_DIR, "design", "SKILL.md")
        ui_path = os.path.join(SKILLS_DIR, "ui-ux-pro-max", "SKILL.md")
        od_path = os.path.join(SKILLS_DIR, "open-design", "SKILL.md")
        gsap_path = os.path.join(SKILLS_DIR, "gsap", "SKILL.md")

        targets = [
            (design_path, "design"),
            (ui_path, "ui-ux-pro-max"),
            (od_path, "open-design"),
            (gsap_path, "gsap")
        ]

        for path, name in targets:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            self.assertIsNotNone(match, f"Frontmatter missing in {name}")
            frontmatter = yaml.safe_load(match.group(1))
            self.assertEqual(frontmatter.get("name"), name)
            desc = frontmatter.get("description", "")
            self.assertTrue(len(desc) > 30)
            self.assertIn("DO NOT", desc, f"{name} should include negative boundary constraints (DO NOT)")

if __name__ == "__main__":
    unittest.main(verbosity=2)
