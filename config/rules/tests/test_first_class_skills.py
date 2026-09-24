#!/usr/bin/env python3
"""
Unit test suite for First-Class Skills in Antigravity 2.0.
Verifies taste-engine and design-engineering skills.
"""
import os
import unittest
import yaml

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SKILLS_DIR = os.path.join(BASE_DIR, "config", "skills")

class TestFirstClassSkills(unittest.TestCase):

    def _verify_skill(self, skill_name, required_concepts, expected_blocks_min=1):
        skill_dir = os.path.join(SKILLS_DIR, skill_name)
        skill_path = os.path.join(skill_dir, "SKILL.md")
        license_path = os.path.join(skill_dir, "LICENSE")

        self.assertTrue(os.path.exists(skill_path), f"File {skill_path} does not exist")
        self.assertTrue(os.path.exists(license_path), f"File {license_path} does not exist")

        with open(skill_path, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Frontmatter
        self.assertTrue(content.startswith("---"), f"{skill_name}/SKILL.md must start with ---")
        parts = content.split("---", 2)
        self.assertGreaterEqual(len(parts), 3, f"{skill_name}/SKILL.md must have closed frontmatter")
        fm = yaml.safe_load(parts[1].strip())
        self.assertIsInstance(fm, dict)
        self.assertIn("name", fm)
        self.assertIn("description", fm)
        self.assertEqual(fm["name"], skill_name)
        self.assertGreater(len(fm["description"]), 20)

        # 2. Balanced code blocks
        code_blocks = content.count("```")
        self.assertEqual(code_blocks % 2, 0, f"Unbalanced code blocks in {skill_name}")
        self.assertGreaterEqual(code_blocks // 2, expected_blocks_min)

        # 3. No em-dash (—) and no en-dash (–)
        self.assertEqual(content.count("\u2014"), 0, f"Found em-dash in {skill_name}")
        self.assertEqual(content.count("\u2013"), 0, f"Found en-dash in {skill_name}")

        # 4. Consistent table columns
        lines = content.splitlines()
        in_table = False
        col_count = 0
        for line_idx, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith("|") and stripped.endswith("|"):
                cells = [c.strip() for c in stripped.split("|")[1:-1]]
                if not in_table:
                    in_table = True
                    col_count = len(cells)
                else:
                    self.assertEqual(
                        len(cells), col_count,
                        f"Table line {line_idx} in {skill_name} has {len(cells)} cols, expected {col_count}"
                    )
            else:
                in_table = False

        # 5. Required concepts
        content_lower = content.lower()
        for concept in required_concepts:
            self.assertIn(
                concept.lower(),
                content_lower,
                f"Missing required concept '{concept}' in {skill_name}"
            )

    def test_taste_engine_skill(self):
        """Kiểm tra First-Class Skill taste-engine đạt chuẩn đầy đủ 100%"""
        reqs = [
            "DESIGN_VARIANCE: 8",
            "MOTION_INTENSITY: 6",
            "VISUAL_DENSITY: 4",
            "Anti-AI Slop",
            "Luminous Light Theme",
            "Design Read",
            "Redesign Protocol",
            "Reference Vocabulary"
        ]
        self._verify_skill("taste-engine", reqs, expected_blocks_min=2)

    def test_design_engineering_skill(self):
        """Kiểm tra First-Class Skill design-engineering đạt chuẩn đầy đủ 100%"""
        reqs = [
            "Emil Kowalski",
            "scale(0.965)",
            "cubic-bezier",
            "quang học",
            "Sonner",
            "Stagger",
            "Debugging"
        ]
        self._verify_skill("design-engineering", reqs, expected_blocks_min=4)

if __name__ == "__main__":
    unittest.main()
