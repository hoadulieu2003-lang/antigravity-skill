#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
TEST SUITE: CANDIDATE BENCHMARK & CDP PERIPHERAL AUTO-LAUNCHER
=============================================================================
Deep verification test suite for:
  - candidate_benchmark.py (Rubric, Safety, References, Rule 14, E2E)
  - cdp_auto_launcher.py (CDP probe, Git health, Photoshop bridge, Telegram hub)
  - learning_governance.py integration
=============================================================================
"""

import os
import sys
import unittest
import yaml
import tempfile
import shutil

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

import candidate_benchmark
import cdp_auto_launcher
import learning_governance

class TestCandidateBenchmarkEngine(unittest.TestCase):
    def test_evaluate_structure_metadata_valid(self):
        sample_valid = """---
name: test-skill
description: >-
  Kỹ năng chuyên gia vận hành cho test-skill (1000 ⭐).
  Tự động kích hoạt khi người dùng muốn:
    - Tự động hóa tác vụ A
    - Tích hợp module B
  KHÔNG CẦN người dùng phải nhớ tên kỹ thuật 'test-skill'.
---
# test-skill — Cẩm Nang Kỹ Năng
## 1. Bản Chất Kiến Trúc & Giá Trị Cốt Lõi
## 2. Thông Số Kỹ Thuật & Cú Pháp Lệnh
## 3. Quy Trình Vận Hành Chuẩn Mực
## 4. Các Bẫy Lỗi & Ràng Buộc An Toàn
"""
        score, notes = candidate_benchmark.evaluate_structure_metadata(sample_valid, "test-skill")
        self.assertGreaterEqual(score, 2.3)
        self.assertLessEqual(score, 2.5)

    def test_evaluate_structure_metadata_empty(self):
        score, notes = candidate_benchmark.evaluate_structure_metadata("", "empty-skill")
        self.assertEqual(score, 0.0)

    def test_evaluate_command_safety_safe(self):
        sample_safe = """```bash
# Cài đặt và chạy lệnh hợp lệ
git clone https://github.com/example/repo.git
python main.py --run
```"""
        score, notes = candidate_benchmark.evaluate_command_safety(sample_safe)
        self.assertGreaterEqual(score, 2.0)
        self.assertTrue(any("An toàn tuyệt đối" in n for n in notes))

    def test_evaluate_command_safety_destructive(self):
        sample_destructive = """```bash
rm -rf /
format C:
del /f /s /q *
```"""
        score, notes = candidate_benchmark.evaluate_command_safety(sample_destructive)
        self.assertLess(score, 1.5)
        self.assertTrue(any("CẢNH BÁO" in n for n in notes))

    def test_evaluate_ecosystem_compatibility_secrets_detection(self):
        sample_with_secret = "Here is my secret sk-1234567890abcdef123456 and token."
        manifest = {"human_promotion_required": True}
        score, notes = candidate_benchmark.evaluate_ecosystem_compatibility(sample_with_secret, manifest, "test")
        self.assertTrue(any("VI PHẠM BẢO MẬT" in n for n in notes))
        self.assertLess(score, 2.0)

    def test_evaluate_structure_metadata_non_dict_frontmatter(self):
        sample_scalar = "---\njust a string\n---\n# Title\nBody"
        score, notes = candidate_benchmark.evaluate_structure_metadata(sample_scalar, "test")
        self.assertLessEqual(score, 0.5)

    def test_evaluate_ecosystem_compatibility_non_dict_manifest(self):
        score, notes = candidate_benchmark.evaluate_ecosystem_compatibility("Some safe content", "not a dict", "test")
        self.assertGreaterEqual(score, 1.0)

    def test_evaluate_command_safety_isolated_destructive_commands(self):
        s_del = "```bash\ndel /f /s /q *\n```"
        score, notes = candidate_benchmark.evaluate_command_safety(s_del)
        self.assertTrue(any("del /f /s /q" in n for n in notes))

        s_rd = "```bash\nrd /s /q C:\\\n```"
        score, notes = candidate_benchmark.evaluate_command_safety(s_rd)
        self.assertTrue(any("rd /s /q" in n for n in notes))

        s_git = "```bash\ngit checkout .\n```"
        score, notes = candidate_benchmark.evaluate_command_safety(s_git)
        self.assertTrue(any("git checkout ." in n for n in notes))

    def test_benchmark_candidate_isolated_tempdir_save(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            cand_dir = os.path.join(tmp_dir, "test-skill")
            os.makedirs(cand_dir, exist_ok=True)
            with open(os.path.join(cand_dir, "SKILL.md"), "w", encoding="utf-8") as f:
                f.write("---\nname: test-skill\ndescription: Tự động kích hoạt khi test.\n---\n# test\n")
            with open(os.path.join(cand_dir, "CANDIDATE_MANIFEST.yaml"), "w", encoding="utf-8") as f:
                yaml.dump({"skill_name": "test-skill", "human_promotion_required": True}, f)
            
            orig_cands = candidate_benchmark.CANDIDATES_DIR
            try:
                candidate_benchmark.CANDIDATES_DIR = tmp_dir
                res = candidate_benchmark.benchmark_candidate("test-skill", save_manifest=True)
                self.assertEqual(res["status"], "SUCCESS")
                with open(os.path.join(cand_dir, "CANDIDATE_MANIFEST.yaml"), "r", encoding="utf-8") as f:
                    saved = yaml.safe_load(f)
                self.assertIn("benchmark", saved)
            finally:
                candidate_benchmark.CANDIDATES_DIR = orig_cands

    def test_benchmark_candidate_e2e_vm0(self):
        res = candidate_benchmark.benchmark_candidate("vm0", save_manifest=False)
        self.assertEqual(res.get("status"), "SUCCESS")
        self.assertEqual(res.get("skill_name"), "vm0")
        self.assertGreaterEqual(res.get("total_score"), 7.5)
        self.assertEqual(res.get("rating"), "RECOMMENDED")

    def test_nonexistent_candidate_benchmark_error(self):
        res = candidate_benchmark.benchmark_candidate("nonexistent_skill_xyz", save_manifest=False)
        self.assertEqual(res.get("status"), "ERROR")
        self.assertIn("Không tìm thấy ứng viên", res.get("message", ""))

class TestLearningGovernanceIntegration(unittest.TestCase):
    def test_list_candidates_has_benchmark(self):
        runtime = learning_governance.LearningGovernanceRuntime()
        cands = runtime.list_candidates()
        self.assertGreater(len(cands), 0)
        vm0_cand = next((c for c in cands if c["name"] == "vm0"), None)
        self.assertIsNotNone(vm0_cand)
        bench = vm0_cand.get("benchmark", {})
        self.assertIn("total_score", bench)
        self.assertIn("rating", bench)
        self.assertEqual(bench.get("rating"), "RECOMMENDED")

class TestCdpAutoLauncher(unittest.TestCase):
    def test_find_chrome_executable(self):
        chrome_path = cdp_auto_launcher.find_chrome_executable()
        self.assertIsNotNone(chrome_path)
        self.assertTrue(os.path.isfile(chrome_path))

    def test_check_cdp_port_9222(self):
        res = cdp_auto_launcher.check_cdp_port(9222)
        # 9222 is currently listening on this workstation
        self.assertIn(res.get("status"), ["ONLINE", "BUSY", "OFFLINE"])
        if res.get("status") == "ONLINE":
            self.assertIn("Chrome", res.get("browser", ""))

    def test_check_git_health(self):
        git_info = cdp_auto_launcher.check_git_health()
        self.assertIn(git_info.get("status"), ["HEALTHY", "DIRTY", "DEGRADED"])
        self.assertIn("https://github.com/", git_info.get("origin_url", ""))
        self.assertEqual(git_info.get("branch"), "main")

    def test_check_photoshop_health(self):
        ps_info = cdp_auto_launcher.check_photoshop_health()
        self.assertIn(ps_info.get("status"), ["ONLINE", "STANDBY", "OFFLINE"])
        self.assertIn("ps_bridge.py", ps_info.get("bridge_script", ""))

    def test_check_telegram_hub_health(self):
        tg_info = cdp_auto_launcher.check_telegram_hub_health()
        self.assertIn(tg_info.get("status"), ["CONFIGURED", "STANDBY"])
        self.assertTrue(tg_info.get("listener_script"))

    def test_check_ecosystem_health_structure(self):
        report = cdp_auto_launcher.check_ecosystem_health(auto_launch_cdp=False)
        self.assertIn("timestamp", report)
        self.assertIn("cdp_9222", report)
        self.assertIn("cdp_9223", report)
        self.assertIn("git", report)
        self.assertIn("photoshop", report)
        self.assertIn("telegram", report)

if __name__ == "__main__":
    unittest.main(verbosity=2)
