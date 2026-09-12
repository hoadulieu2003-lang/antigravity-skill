import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

GLOBAL_CONFIG_DIR = Path(r"C:\Users\game\.gemini\config")
REPOS_DIR = GLOBAL_CONFIG_DIR / "repositories"
SUPERPOWERS_REPO_DIR = REPOS_DIR / "superpowers"
GLOBAL_SKILLS_DIR = GLOBAL_CONFIG_DIR / "skills"

SUPERPOWERS_REPO_URL = "https://github.com/obra/superpowers.git"

ENHANCED_DESCRIPTIONS = {
    "brainstorming": (
        "Kích hoạt khi cần làm rõ ý tưởng, lên đặc tả thiết kế, thảo luận kiến trúc hoặc làm rõ yêu cầu người dùng trước khi triển khai (Brainstorming & Specification). "
        "Use before starting work to explore design ideas, clarify requirements, define specifications, and validate architectural choices."
    ),
    "dispatching-parallel-agents": (
        "Kích hoạt khi cần điều phối đồng thời nhiều subagents để xử lý song song các tác vụ độc lập. "
        "Use when executing multiple independent tasks simultaneously using parallel subagents."
    ),
    "executing-plans": (
        "Kích hoạt khi cần thực thi một kế hoạch triển khai (plan.md) đã được duyệt theo từng bước kiểm chứng. "
        "Use when executing an approved step-by-step implementation plan with disciplined validation."
    ),
    "finishing-a-development-branch": (
        "Kích hoạt khi cần hoàn tất công việc trên branch, merge code, dọn dẹp git worktree hoặc tạo PR. "
        "Use when completing work on a feature branch, verifying tests, creating commits, and merging or cleaning up worktrees."
    ),
    "receiving-code-review": (
        "Kích hoạt khi tiếp nhận nhận xét/góp ý code review để điều chỉnh code một cách có kỉ luật. "
        "Use when processing feedback from a code review to systematically verify and address suggestions."
    ),
    "requesting-code-review": (
        "Kích hoạt khi cần thực hiện rà soát chất lượng code (Code Review), kiểm tra diff, phát hiện lỗi tiềm ẩn trước khi commit. "
        "Use to perform a thorough code review on changes before marking a task as completed."
    ),
    "subagent-driven-development": (
        "Kích hoạt khi cần chia nhỏ kế hoạch phức tạp thành các micro-tasks độc lập và giao cho subagents thực thi. "
        "Use to execute implementation plans in focused chunks using dedicated subagents with strict acceptance criteria."
    ),
    "systematic-debugging": (
        "Kích hoạt khi gặp lỗi, bug, test fail, crash hoặc hành vi không xác định - thực hiện tìm nguyên nhân gốc rễ (Root Cause Analysis) không đoán mò. "
        "Use when troubleshooting bugs, failing tests, or unexpected errors using structured root cause investigation."
    ),
    "test-driven-development": (
        "Kích hoạt khi viết tính năng mới, sửa bug, hoặc refactor theo quy trình Test-Driven Development (TDD) Red-Green-Refactor. "
        "Use when implementing any feature or bugfix: write failing unit test first, implement minimal code to pass, then refactor."
    ),
    "using-git-worktrees": (
        "Kích hoạt khi cần tạo hoặc quản lý môi trường cách ly tính năng bằng Git Worktree. "
        "Use when starting new feature work or bugfixes in isolated Git worktrees without disrupting the main workspace."
    ),
    "using-superpowers": (
        "Kích hoạt khi cần hướng dẫn tổng quan về cách vận hành bộ kỹ năng kĩ thuật Superpowers. "
        "Overview skill for understanding and selecting appropriate Superpowers engineering workflows."
    ),
    "verification-before-completion": (
        "Kích hoạt khi chuẩn bị kết thúc task, cần nghiệm thu chạy toàn bộ test suite, lint, build để đảm bảo chất lượng tuyệt đối. "
        "Use before declaring any task complete to run full verification ladder (tests, lints, build) with zero regressions."
    ),
    "writing-plans": (
        "Kích hoạt khi cần lập kế hoạch triển khai chi tiết step-by-step cho tính năng mới hoặc refactor lớn. "
        "Use to break down user requests into detailed, verifiable step-by-step implementation plans."
    ),
    "writing-skills": (
        "Kích hoạt khi cần sáng tạo hoặc chỉnh sửa một skill / quy trình làm việc mới cho Agent. "
        "Use when creating or updating custom Agent skills and operational guidelines."
    )
}

def ensure_repo():
    REPOS_DIR.mkdir(parents=True, exist_ok=True)
    if not SUPERPOWERS_REPO_DIR.exists():
        print(f"Cloning {SUPERPOWERS_REPO_URL} into {SUPERPOWERS_REPO_DIR}...")
        subprocess.run(["git", "clone", SUPERPOWERS_REPO_URL, str(SUPERPOWERS_REPO_DIR)], check=True)
    else:
        print(f"Updating superpowers repo at {SUPERPOWERS_REPO_DIR}...")
        subprocess.run(["git", "-C", str(SUPERPOWERS_REPO_DIR), "pull"], check=True)

def update_frontmatter(content: str, skill_name: str) -> str:
    target_name = f"superpowers-{skill_name}"
    desc = ENHANCED_DESCRIPTIONS.get(skill_name, f"Superpowers skill for {skill_name}")
    
    frontmatter_pattern = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
    new_frontmatter = f"---\nname: {target_name}\ndescription: {desc}\n---\n\n"
    
    if frontmatter_pattern.match(content):
        return frontmatter_pattern.sub(new_frontmatter, content)
    else:
        return new_frontmatter + content

def install_skills():
    source_skills_dir = SUPERPOWERS_REPO_DIR / "skills"
    if not source_skills_dir.exists():
        print(f"Error: {source_skills_dir} does not exist.")
        sys.exit(1)
        
    GLOBAL_SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    
    count = 0
    for skill_folder in source_skills_dir.iterdir():
        if skill_folder.is_dir():
            skill_name = skill_folder.name
            target_skill_dir = GLOBAL_SKILLS_DIR / f"superpowers-{skill_name}"
            
            if target_skill_dir.exists():
                shutil.rmtree(target_skill_dir)
            
            shutil.copytree(skill_folder, target_skill_dir)
            
            skill_md_path = target_skill_dir / "SKILL.md"
            if skill_md_path.exists():
                with open(skill_md_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                updated_content = update_frontmatter(content, skill_name)
                
                with open(skill_md_path, "w", encoding="utf-8") as f:
                    f.write(updated_content)
            
            print(f"[SUCCESS] Installed skill: superpowers-{skill_name} -> {target_skill_dir}")
            count += 1
            
    print(f"\nSuccessfully installed/updated {count} Superpowers skills in Antigravity system!")

if __name__ == "__main__":
    ensure_repo()
    install_skills()
