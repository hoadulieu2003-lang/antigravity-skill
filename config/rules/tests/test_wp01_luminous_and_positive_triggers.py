#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Suite: WP-01 Luminous Light Theme Invariant & Positive Skill Activation Triggers
Validates:
1. Negative gating clauses removal from open-design, design, and gsap.
2. Positive automatic activation directives for web UI design, landing page, and dashboard.
3. Strict preservation of non-visual backend boundary constraints (DESIGN_NONE).
4. System-wide consistency of Luminous Light Theme Invariant across rules, skills, and schemas.
5. Markdown formatting, balanced code fences, and UTF-8 encoding validity.
"""

import os
import re
import sys
import unittest
import yaml

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CONFIG_DIR = os.path.join(BASE_DIR, "config")
SKILLS_DIR = os.path.join(CONFIG_DIR, "skills")

class TestWP01LuminousAndPositiveTriggers(unittest.TestCase):

    def setUp(self):
        self.design_path = os.path.join(SKILLS_DIR, "design", "SKILL.md")
        self.od_path = os.path.join(SKILLS_DIR, "open-design", "SKILL.md")
        self.gsap_path = os.path.join(SKILLS_DIR, "gsap", "SKILL.md")
        self.agents_path = os.path.join(CONFIG_DIR, "AGENTS.md")
        self.gemini_path = os.path.join(BASE_DIR, "GEMINI.md")
        self.ledger_path = os.path.join(CONFIG_DIR, "EXPERIENCE_LEDGER.md")
        self.dev_skill_path = os.path.join(SKILLS_DIR, "dev", "SKILL.md")
        self.rules_yaml_path = os.path.join(SKILLS_DIR, "design", "assets", "DESIGN_FOUNDATION_RULES.yaml")
        self.schema_yaml_path = os.path.join(SKILLS_DIR, "design", "assets", "DESIGN_CONTRACT_SCHEMA.yaml")

    def test_01_negative_gating_clauses_removed(self):
        """Check that negative gating phrases are completely removed from frontmatters."""
        forbidden_phrases = [
            "activate only when specifically requested",
            "activates only when explicitly invoking",
            "activate only for dedicated javascript",
            "do not use for routine css",
            "do not use for standard css",
            "do not use for general ui components"
        ]

        targets = [self.design_path, self.od_path, self.gsap_path]
        for path in targets:
            self.assertTrue(os.path.exists(path), f"File missing: {path}")
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            self.assertIsNotNone(match, f"Frontmatter missing in {path}")
            desc = yaml.safe_load(match.group(1)).get("description", "").lower()
            for phrase in forbidden_phrases:
                self.assertNotIn(phrase, desc, f"Forbidden phrase '{phrase}' still found in {os.path.basename(os.path.dirname(path))}")

    def test_02_positive_triggers_present(self):
        """Check that positive automatic activation directives are present."""
        targets = [
            (self.design_path, "design"),
            (self.od_path, "open-design"),
            (self.gsap_path, "gsap")
        ]

        for path, name in targets:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            desc = yaml.safe_load(match.group(1)).get("description", "")
            self.assertIn("Automatically activate and reference for", desc, f"Missing positive trigger in {name}")
            self.assertIn("web UI design", desc, f"Missing web UI design in {name}")
            self.assertIn("landing page", desc, f"Missing landing page in {name}")
            self.assertIn("dashboard", desc, f"Missing dashboard in {name}")

    def test_03_backend_boundary_constraint_retained(self):
        """Check that negative boundary constraint against non-visual backend tasks is retained."""
        targets = [self.design_path, self.od_path, self.gsap_path]
        for path in targets:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            match = re.search(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
            desc = yaml.safe_load(match.group(1)).get("description", "")
            self.assertIn("DO NOT use for non-visual backend tasks (DESIGN_NONE)", desc)

    def test_04_luminous_light_theme_in_gemini_and_agents(self):
        """Check Luminous Light Theme Invariant definition in GEMINI.md and AGENTS.md."""
        for path in [self.gemini_path, self.agents_path]:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("Luminous Light Theme Invariant", content, f"Missing Invariant title in {path}")
            self.assertIn("Multi-Layered Luminous Surfaces", content, f"Missing Multi-Layered Surfaces in {path}")
            self.assertIn("Multi-Dimensional Layered Shadows", content, f"Missing Multi-Dimensional Shadows in {path}")
            self.assertIn("Monolithic Flat Paper", content, f"Missing anti-flat paper rule in {path}")
            self.assertIn("Pod 4", content, f"Missing Pod 4 in {path}")
            # Ensure Pod 4 refers to Luminous Light Theme
            pod4_match = re.search(r'Pod 4.*?(?:Luminous Light Theme Invariant)', content, re.DOTALL)
            self.assertIsNotNone(pod4_match, f"Pod 4 does not reference Luminous Light Theme Invariant in {path}")

    def test_05_luminous_light_theme_in_design_skills(self):
        """Check Luminous Light Theme Invariant across design and open-design SKILL.md."""
        # design SKILL.md
        with open(self.design_path, "r", encoding="utf-8") as f:
            d_content = f.read()
        self.assertIn("Luminous Light Theme is the mandatory default", d_content)
        self.assertIn("ANTI-AI-001 (Luminous Light Theme Invariant)", d_content)
        self.assertIn("Luminous Light Theme Độc bản", d_content)

        # open-design SKILL.md
        with open(self.od_path, "r", encoding="utf-8") as f:
            od_content = f.read()
        self.assertIn("Kỷ Luật Luminous Light Theme Invariant Bắt Buộc", od_content)
        self.assertIn("Multi-Layered Luminous Surfaces", od_content)
        self.assertIn("Multi-Dimensional Layered Shadows", od_content)

        # gsap SKILL.md
        with open(self.gsap_path, "r", encoding="utf-8") as f:
            gsap_content = f.read()
        self.assertIn("Khi Nào Tự Động Kích Hoạt & Sử Dụng Skill Này", gsap_content)
        self.assertIn("Luminous Light Theme", gsap_content)

        # dev SKILL.md
        with open(self.dev_skill_path, "r", encoding="utf-8") as f:
            dev_content = f.read()
        self.assertIn("Luminous Light Theme Invariant", dev_content)

    def test_06_design_foundation_rules_and_contract_schema(self):
        """Check YAML schemas enforce Luminous Light Theme and prohibit flat paper."""
        with open(self.rules_yaml_path, "r", encoding="utf-8") as f:
            rules_data = yaml.safe_load(f)
        rules = rules_data.get("rules", [])
        anti_ai_1 = next((r for r in rules if r.get("id") == "ANTI-AI-001"), None)
        self.assertIsNotNone(anti_ai_1, "ANTI-AI-001 rule missing")
        self.assertEqual(anti_ai_1.get("name"), "luminous_light_theme_invariant")
        self.assertIn("Luminous Light Theme", anti_ai_1.get("requirement", ""))

        with open(self.schema_yaml_path, "r", encoding="utf-8") as f:
            schema_data = yaml.safe_load(f)
        avoid_list = schema_data.get("art_direction", {}).get("avoid", [])
        self.assertIn("monolithic_flat_paper", avoid_list, "monolithic_flat_paper missing from avoid list in schema")
        theme_mode = schema_data.get("color_system", {}).get("theme_mode", "")
        self.assertEqual(theme_mode, "LUMINOUS_LIGHT_ONLY")

    def test_07_markdown_syntax_and_code_fences(self):
        """Ensure all modified markdown files have balanced code fences and valid UTF-8."""
        md_files = [
            self.design_path,
            self.od_path,
            self.gsap_path,
            self.agents_path,
            self.gemini_path,
            self.ledger_path,
            self.dev_skill_path
        ]

        for path in md_files:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            fence_count = content.count("```")
            self.assertEqual(fence_count % 2, 0, f"Unbalanced code fences in {path} (count: {fence_count})")
            self.assertTrue(len(content) > 500, f"File unexpectedly small: {path}")

if __name__ == "__main__":
    unittest.main(verbosity=2)
