---
name: dev
description: Step 2 ($dev or $project-delivery) — Plan, partition, produce, self-verify, and integrate an approved product, design, software, AI/data, automation, document, or content deliverable. Operates under strict Developer Self-Verification, Evidence Ledger emission, Scope Drift control, and Loop Budget accounting. Use after scope and acceptance criteria are defined; do not use to invent material requirements or perform final independent verification.
---

# Project Delivery ($dev)

Turn an approved Definition Handoff into an integrated, verifiable release candidate backed by concrete proof. 

> **Core Philosophy**:  
> No evidence, no handoff.  
> Verification depth follows execution risk.  
> Discovered work does not silently become current work.  
> Two failed repair attempts trigger failure diagnosis, not a third blind patch.

---

## 1. Execution Mode & Topology Routing

Delivery topology adapts strictly to the `execution_mode` established in $plan:
- **`FAST` Delivery**: `SINGLE_OWNER`. Targeted implementation and targeted self-verification (Single-Agent Turbo for rapid execution on small tasks, quick Q&A, and micro-fixes).
- **`STANDARD` Delivery**: `TEAMWORK_MULTI_AGENT` (`OWNER + REVIEWER` pod or native `teamwork_preview`). Work package partition with autonomous delegation via `invoke_subagent`. Antigravity acts as Lead Integrator.
- **`CRITICAL` Delivery**: `TEAMWORK_FULL_POD` (`ARCHITECT/OWNER + ADVERSARIAL REVIEWER + HUMAN GATE`). Autonomous multi-agent delegation preconditioned on explicit Human Approval from Product Owner (Anh).

### 1.1 Autonomous Teamwork Multi-Agent Protocol (Mặc định Đa tác tử)
When executing in `STANDARD` or `CRITICAL` mode:
1. **Zero-Friction Invariant**: The Product Owner (Anh) is **NEVER required to type `/teamwork-preview` manually**. The system defaults to teamwork execution automatically.
2. **Autonomous Dispatch**: Antigravity (acting as Lead Integrator / Orchestrator) converts the approved Definition Handoff into a structured Teamwork payload (R1, R2, Acceptance Criteria, Independent Verification).
3. **Subagent Delegation**: Automatically call `invoke_subagent(TypeName: "teamwork_preview", Prompt: payload)` or orchestrate dedicated specialist subagents (`research`, `self`, or custom workers).
4. **Integrator Gate & Synthesis**: When subagents complete execution, Antigravity audits diffs against AC, enforces the Developer Self-Verification contract, and presents verified results to Anh.

---

## 2. Developer Self-Verification Contract (Mandatory Exit Gate)

No Work Package may transition to `READY_FOR_INTEGRATION` or `READY_FOR_VERIFICATION` without completing Developer Self-Verification.

### Mode-Aware Verification Profiles
1. **FAST Profile (Targeted & Rapid)**:
   - Syntax / compile check relevant strictly to changed files.
   - Targeted lint on modified scope.
   - Targeted test if directly related.
   - Visual inspection for visible UI modifications.
   - *Never execute the entire repository test suite for local FAST changes.*
2. **STANDARD Profile (Feature-Complete)**:
   - Build relevant module or project.
   - Relevant lint (0 errors, 0 new warnings in affected scope).
   - Targeted unit and integration tests mapped to acceptance criteria.
   - Runtime sanity check (app runs without unhandled exceptions).
3. **CRITICAL Profile (Exhaustive & Defensive)**:
   - Full build and lint.
   - Comprehensive unit, integration, and contract regression checks.
   - Database migration dry-run / rollback verification when applicable.
   - Security and permission sanity check.

### Allowed Status per Verification Item
- `PASS`: Executed and succeeded (exit code 0 or confirmed observation).
- `FAIL`: Executed and failed.
- `N/A`: Not applicable to this work package (accompanied by valid technical rationale).
- `SKIPPED_BLOCKED`: Tooling or environment unavailable (recorded as known residual risk).

**Invariant**: *Never fabricate PASS for unexecuted or unobservable checks.*

---

## 3. Evidence Ledger Emission

Every completed Work Package must emit a structured `evidence_packet`:
```yaml
evidence_packet:
  schema_version: "1.0"
  work_package: WP-XX
  status: READY_FOR_INTEGRATION | BLOCKED | FAILED
  changed_files:
    - path/to/file
  acceptance_mapping:
    AC-01:
      status: PASS | FAIL | NOT_VERIFIED | N/A
      evidence_refs:
        - EV-001
  verification:
    - id: EV-001
      check: build | lint | unit | integration | runtime | visual | contract | other
      method: command | inspection | browser | script | other
      command: "actual shell command executed or null"
      scope: "exact scope tested"
      result: PASS | FAIL | N/A | SKIPPED_BLOCKED
      exit_code: integer | null
      notes: "output snippet or verification summary"
  discovered_issues:
    - id: ISSUE-001
      description: "description of discovered issue"
      required_for_current_acceptance: true | false
      action: FIX_CURRENT_WP | BACKLOG | RECLASSIFY
  repair_budget:
    attempts_used: 0
    max_attempts: 2
  known_risks:
    - "documented limitations"
  final_claim:
    ready: true | false
    reason: "summary of readiness"
```

---

## 4. Scope Drift Control Policy

When a developer discovers an unforeseen issue during implementation:
1. **Ask**: *Is this strictly required to satisfy current acceptance criteria?*
2. **If YES**:
   - Add it to the current Work Package as an authorized task.
   - Document in `discovered_issues` with action `FIX_CURRENT_WP`.
   - Update acceptance criteria and evidence accordingly.
3. **If NO**:
   - Log the issue to the project backlog / discovered list with action `BACKLOG`.
   - **DO NOT TOUCH** the code (strict prohibition against "while I'm here" refactoring).
4. **If MATERIAL RISK**:
   - If the discovery involves auth, security, database schema/migration, or public contracts:
   - **STOP IMMEDIATELY** $\to$ Reclassify to `CRITICAL` $\to$ Update plan $\to$ Request Human Gate.

---

## 5. Loop Budget & Failure Classification Policy

* **Repair Limit**: `MAX_FIX_ATTEMPTS = 2`.
  - An attempt is a distinct code/config modification aimed at fixing the same failed test or criterion.
* **Circuit Breaker on Exhaustion**:
  - After 2 failed attempts, **STOP PATCHING**. Do not attempt a 3rd blind fix.
  - Classify the root cause into one of five canonical failure classes:
    1. `IMPLEMENTATION_DEFECT`: Approach flawed $\to$ Propose alternative design or escalate reasoning model.
    2. `SPEC_DEFECT`: Contradictory or missing requirements $\to$ Return to $plan.
    3. `ARCHITECTURE_DEFECT`: Structural limitation $\to$ Escalate to Lead Architect (Anh).
    4. `ENVIRONMENT_DEFECT`: Toolchain/runtime/permission failure $\to$ Emit diagnostic report.
    5. `EXTERNAL_DEPENDENCY`: Upstream or third-party service outage $\to$ Emit blocked report.
  - Set status to `BLOCKED` or `FAILED` and emit the Failure Report.

---

## 6. Delivery Handoff Verdicts

Use exactly one verdict:
- `READY_FOR_INTEGRATION`: Work package verified with evidence, ready for assembly.
- `READY_FOR_VERIFICATION`: Delivery complete, release candidate baseline frozen.
- `CONDITIONAL_READY_FOR_VERIFICATION`: Complete with documented non-blocking limitations.
- `NOT_READY_FOR_VERIFICATION`: Verification failed or loop budget exhausted.

Do not claim final acceptance; independent verification belongs strictly to Step 3 ($test).
