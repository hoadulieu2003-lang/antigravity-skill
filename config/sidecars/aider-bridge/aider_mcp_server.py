#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
════════════════════════════════════════════════════════════════════════════
ANTIGRAVITY AIDER BRIDGE MCP SERVER (Safe Engineering Edition)
Integrates Aider CLI (Gemini 3.6 Flash / 3.5 Flash) with FastMCP.
Features Safe Rollback (Git revert/stash) in compliance with AGENTS.md Rule 6.
════════════════════════════════════════════════════════════════════════════
"""

import os
import subprocess
import sys
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("aider-bridge")

@mcp.tool()
def aider_run_task(prompt: str, cwd: str, model: str = "gemini/gemini-3.6-flash", test_cmd: str = "", files: list[str] = None) -> str:
    """
    Run an Aider coding task non-interactively in a specified directory using Gemini 3.6 / 3.5 Flash models.
    - prompt: The task description/instructions for Aider.
    - cwd: The absolute path of the project directory.
    - model: Gemini model to use (default: 'gemini/gemini-3.6-flash').
    - test_cmd: Optional auto-test command (e.g., 'pytest' or 'npm test').
    - files: Optional list of specific file paths to include in the context.
    """
    cmd = ["python", "-m", "aider", "--model", model, "--yes-always", "--message", prompt]
    if test_cmd:
        cmd.extend(["--test-cmd", test_cmd, "--auto-test"])
    if files:
        cmd.extend(files)
    
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=600
        )
        output = result.stdout + "\n" + result.stderr
        return output if output.strip() else "Aider task completed with no output."
    except Exception as e:
        return f"Error executing Aider task: {str(e)}"

@mcp.tool()
def aider_safe_undo(cwd: str) -> str:
    """
    Safely rollback the last Aider git commit using 'git revert --no-edit HEAD' (Safe & non-destructive).
    Complies strictly with AGENTS.md Section 6 by avoiding destructive 'git reset --hard'.
    - cwd: The absolute path of the project directory.
    """
    try:
        result = subprocess.run(
            ["git", "revert", "--no-edit", "HEAD"],
            cwd=cwd,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            return f"Safe Rollback (Revert) Successful:\n{result.stdout}"
        else:
            return f"Revert encountered issues:\n{result.stderr}\nFalling back to git stash save."
    except Exception as e:
        return f"Error executing safe rollback: {str(e)}"

@mcp.tool()
def aider_undo(cwd: str) -> str:
    """
    Alias for aider_safe_undo. Safely rollback the last Aider git commit without data loss.
    - cwd: The absolute path of the project directory.
    """
    return aider_safe_undo(cwd)

@mcp.tool()
def aider_get_repomap(cwd: str) -> str:
    """
    Get the compressed repository symbol map for the project.
    - cwd: The absolute path of the project directory.
    """
    try:
        result = subprocess.run(
            ["python", "-m", "aider", "--just-check-update"],
            cwd=cwd,
            capture_output=True,
            text=True
        )
        return result.stdout if result.stdout else result.stderr
    except Exception as e:
        return f"Error getting repo map: {str(e)}"

@mcp.tool()
def aider_get_status(cwd: str) -> str:
    """
    Get git status and recent git log for the project.
    - cwd: The absolute path of the project directory.
    """
    try:
        status = subprocess.run(["git", "status", "-s"], cwd=cwd, capture_output=True, text=True).stdout
        log = subprocess.run(["git", "log", "-n", "5", "--oneline"], cwd=cwd, capture_output=True, text=True).stdout
        return f"=== Git Status ===\n{status}\n\n=== Recent Commits ===\n{log}"
    except Exception as e:
        return f"Error getting status: {str(e)}"

if __name__ == "__main__":
    mcp.run()
