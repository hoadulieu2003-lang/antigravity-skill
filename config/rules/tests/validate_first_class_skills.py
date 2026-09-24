import os
import sys
import yaml

sys.stdout.reconfigure(encoding='utf-8')

# Dynamically resolve base directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SKILLS_DIR = os.path.join(BASE_DIR, "config", "skills")

files = [
    os.path.join(SKILLS_DIR, "taste-engine", "SKILL.md"),
    os.path.join(SKILLS_DIR, "design-engineering", "SKILL.md")
]

all_passed = True

for path in files:
    name = os.path.basename(os.path.dirname(path))
    print(f'=== Testing {name} ===')
    if not os.path.exists(path):
        print(f'FAIL: File {path} does not exist!')
        all_passed = False
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Frontmatter test
    if not content.startswith('---'):
        print('FAIL: Does not start with frontmatter ---')
        all_passed = False
    else:
        parts = content.split('---', 2)
        if len(parts) < 3:
            print('FAIL: Incomplete frontmatter')
            all_passed = False
        else:
            fm_text = parts[1].strip()
            try:
                fm = yaml.safe_load(fm_text)
                if not isinstance(fm, dict):
                    print('FAIL: Frontmatter is not a dict')
                    all_passed = False
                elif 'name' not in fm or 'description' not in fm:
                    print(f'FAIL: Missing name or description in frontmatter: {fm}')
                    all_passed = False
                elif fm['name'] != name:
                    print(f'FAIL: name in frontmatter {fm["name"]} != {name}')
                    all_passed = False
                else:
                    print(f'PASS: Frontmatter valid. Name: {fm["name"]}')
                    print(f'      Description: {fm["description"][:80]}...')
            except Exception as e:
                print(f'FAIL: YAML parsing error: {e}')
                all_passed = False
    
    # 2. Markdown Code Blocks Test
    code_blocks = content.count('```')
    if code_blocks % 2 != 0:
        print(f'FAIL: Unbalanced code blocks (count: {code_blocks})')
        all_passed = False
    else:
        print(f'PASS: Balanced code blocks ({code_blocks // 2} blocks)')
    
    # 3. Em-dash and En-dash AI-slop test
    em_dashes = content.count('\u2014')
    en_dashes = content.count('\u2013')
    if em_dashes > 0:
        print(f'FAIL: Found {em_dashes} em-dashes (—) in {name}')
        all_passed = False
    elif en_dashes > 0:
        print(f'FAIL: Found {en_dashes} en-dashes (–) in {name}')
        all_passed = False
    else:
        print('PASS: Zero em-dashes (—) and zero en-dashes (–) found.')
    
    # 4. Table validation
    lines = content.splitlines()
    in_table = False
    col_count = 0
    table_errors = 0
    for line_idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if not in_table:
                in_table = True
                col_count = len(cells)
            else:
                if len(cells) != col_count:
                    print(f'FAIL: Table line {line_idx} has {len(cells)} cols, expected {col_count}')
                    table_errors += 1
                    all_passed = False
        else:
            in_table = False
    if table_errors == 0:
        print('PASS: All markdown tables have consistent column counts.')
    
    # 5. Check required domain concepts
    if name == 'taste-engine':
        reqs = [
            'DESIGN_VARIANCE: 8',
            'MOTION_INTENSITY: 6',
            'VISUAL_DENSITY: 4',
            'Anti-AI Slop',
            'Luminous Light Theme',
            'Design Read',
            'Redesign Protocol',
            'Reference Vocabulary'
        ]
        for r in reqs:
            if r.lower() in content.lower():
                print(f'PASS: Found required concept "{r}"')
            else:
                print(f'FAIL: Missing required concept "{r}"')
                all_passed = False
    elif name == 'design-engineering':
        reqs = [
            'Emil Kowalski',
            'scale(0.965)',
            'cubic-bezier',
            'quang học',
            'Sonner',
            'Stagger',
            'Debugging'
        ]
        for r in reqs:
            if r.lower() in content.lower():
                print(f'PASS: Found required concept "{r}"')
            else:
                print(f'FAIL: Missing required concept "{r}"')
                all_passed = False
    
    # Readability / Stats
    words = len(content.split())
    print(f'Stats: {len(lines)} lines, {words} words, {len(content)} characters.\n')

print('ALL TESTS PASSED!' if all_passed else 'SOME TESTS FAILED!')
if not all_passed:
    sys.exit(1)
