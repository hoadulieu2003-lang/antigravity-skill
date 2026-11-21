import os
import sys
import yaml
import re

skills_dir = r"C:\Users\SAS\.gemini\config\skills"
dirs = sorted(os.listdir(skills_dir))

report = []
missing_skills = []
yaml_issues = []

for d in dirs:
    path = os.path.join(skills_dir, d)
    if not os.path.isdir(path):
        continue
    skill_file = os.path.join(path, "SKILL.md")
    if not os.path.exists(skill_file):
        missing_skills.append(d)
        continue
    
    with open(skill_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
    # Check YAML frontmatter
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not fm_match:
        yaml_issues.append((d, "Missing YAML frontmatter"))
    else:
        fm_text = fm_match.group(1)
        try:
            parsed = yaml.safe_load(fm_text)
            if not isinstance(parsed, dict):
                yaml_issues.append((d, "YAML is not a dict"))
            else:
                if "name" not in parsed:
                    yaml_issues.append((d, "Missing name in YAML"))
                if "description" not in parsed:
                    yaml_issues.append((d, "Missing description in YAML"))
        except Exception as e:
            yaml_issues.append((d, f"YAML syntax error: {e}"))

    lines = content.splitlines()
    num_lines = len(lines)
    
    # Bilingual patterns: English (Tieng Viet)
    bilingual_patterns = re.findall(r"[A-Za-z0-9\-_\s]{3,30}\s*\([^\)]*[\u00C0-\u1EF9][^\)]*\)", content)
    
    # Light theme keywords
    has_light_theme = ("luminous" in content.lower()) or ("light theme" in content.lower())
    has_dark_mode_explicit = ("dark" in content.lower())
    
    # Veo keywords
    has_veo = "veo" in content.lower()
    has_veo_lite = ("veo 3.1 - lite [lower priority]" in content.lower()) or ("veo_3_1_lite_low_priority" in content.lower())
    
    report.append({
        "name": d,
        "lines": num_lines,
        "yaml_ok": len([y for y in yaml_issues if y[0] == d]) == 0,
        "bilingual_count": len(bilingual_patterns),
        "has_light_theme": has_light_theme,
        "has_dark_mode_explicit": has_dark_mode_explicit,
        "has_veo": has_veo,
        "has_veo_lite": has_veo_lite
    })

print(f"Total skill folders: {len(dirs)}")
print(f"Missing SKILL.md: {missing_skills}")
print(f"YAML issues count: {len(yaml_issues)}")
if yaml_issues:
    for y in yaml_issues:
        print(f"  - {y[0]}: {y[1]}")

print("\n--- Key Antigravity 2.0 Skills Audit ---")
target_skills = [
    "system-evolution", "gemini-super-engine", "script-factory-pro", 
    "growth-marketing-fleet", "design", "design-engineering", 
    "magic-ui-vault", "react-bits-vault", "doc-previewer", 
    "taste-engine", "background-remover", "photoshop-studio", 
    "vibe-coding-cn", "copilotkit", "cherry-studio", "nanobot",
    "slide-architect", "ppt-master", "arcreel", "dramaclaw",
    "cdp-engine", "ast-repo-map", "aider-execution-engine"
]

for r in report:
    if r["name"] in target_skills:
        print(f"[{r['name']}] Lines: {r['lines']} | YAML: {r['yaml_ok']} | Bilingual: {r['bilingual_count']} | LightTheme: {r['has_light_theme']} | Veo: {r['has_veo']} (0-Credit: {r['has_veo_lite']})")

print("\n--- Top Skills by Line Count ---")
sorted_by_lines = sorted(report, key=lambda x: x["lines"], reverse=True)
for r in sorted_by_lines[:15]:
    print(f"  - {r['name']}: {r['lines']} lines")

print("\n--- Skills with Fewest Lines (< 50 lines) ---")
for r in sorted(report, key=lambda x: x["lines"]):
    if r["lines"] < 60:
        print(f"  - {r['name']}: {r['lines']} lines | Bilingual: {r['bilingual_count']}")
