#!/usr/bin/env python3
"""
Session Handoff & Continuity Ledger ($session-handoff)
Inspired by ECC's Unified Memory & Session Persistence architecture.
Allows agents to save and resume structured state snapshots across sessions.
"""
import os
import sys
import argparse
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DEFAULT_FILENAME = "SESSION_STATE.md"

TEMPLATE = """# SESSION STATE & CONTINUITY LEDGER
> Last Updated: {timestamp}
> Architecture Invariant: "Optimize the context window. Persist everything else."

## 1. Completed Items
{completed}

## 2. Active Decisions & Approved Invariants
{decisions}

## 3. In-Flight Tasks (Work-in-Progress)
{inflight}

## 4. Residual Risks & Technical Debt
{risks}

## 5. Next Immediate Action (Resume Target)
{next_action}
"""

def format_list(items, default="None recorded."):
    if not items:
        return f"- {default}"
    return "\n".join(f"- [x] {item}" if "done" in item.lower() or "hoàn thành" in item.lower() else f"- {item}" for item in items)

def save_session(target_dir, completed=None, decisions=None, inflight=None, risks=None, next_action=None):
    filepath = os.path.join(target_dir, DEFAULT_FILENAME)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    content = TEMPLATE.format(
        timestamp=timestamp,
        completed=format_list(completed, "No completed tasks recorded."),
        decisions=format_list(decisions, "Follow standard AGENTS.md & dynamic-project-system.md invariants."),
        inflight=format_list(inflight, "None in-flight. Ready for new sprint."),
        risks=format_list(risks, "No known critical risks."),
        next_action=f"> **{next_action}**" if next_action else "> Ready for next instruction from Lead Architect (Anh)."
    )
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"✅ Session state successfully persisted to: {filepath}")

def read_session(target_dir):
    filepath = os.path.join(target_dir, DEFAULT_FILENAME)
    if not os.path.exists(filepath):
        print(f"ℹ️ No active {DEFAULT_FILENAME} found in {target_dir}.")
        return
    
    print(f"📖 Reading session handoff from: {filepath}")
    print("=" * 60)
    with open(filepath, "r", encoding="utf-8") as f:
        print(f.read())
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(description="Session Handoff & Memory Ledger")
    subparsers = parser.add_subparsers(dest="command", help="Sub-commands: save, read")
    
    # Save parser
    save_p = subparsers.add_parser("save", help="Save current session snapshot")
    save_p.add_argument("--dir", default=os.getcwd(), help="Target directory for SESSION_STATE.md")
    save_p.add_argument("-c", "--completed", action="append", default=[], help="Completed items")
    save_p.add_argument("-d", "--decision", action="append", default=[], help="Active architectural decisions")
    save_p.add_argument("-i", "--inflight", action="append", default=[], help="In-flight work")
    save_p.add_argument("-r", "--risk", action="append", default=[], help="Residual risks")
    save_p.add_argument("-n", "--next", default="", help="Next action to resume")
    
    # Read parser
    read_p = subparsers.add_parser("read", help="Read current session snapshot")
    read_p.add_argument("--dir", default=os.getcwd(), help="Target directory to inspect")
    
    args = parser.parse_args()
    
    if args.command == "save":
        save_session(args.dir, args.completed, args.decision, args.inflight, args.risk, args.next)
    elif args.command == "read":
        read_session(args.dir)
    else:
        # Default behavior: read if exists, otherwise show help
        default_file = os.path.join(os.getcwd(), DEFAULT_FILENAME)
        if os.path.exists(default_file):
            read_session(os.getcwd())
        else:
            parser.print_help()

if __name__ == "__main__":
    main()
