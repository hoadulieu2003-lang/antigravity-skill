---
name: plan
description: Step 1 ($plan or $project-definition) — Define and scope a new product, feature, technical module, service, AI/data pipeline, automation, or document/content deliverable with Adaptive Planning Depth (FAST / STANDARD / CRITICAL) before execution. Use when deciding what should exist, why it is needed, its boundaries, and its acceptance conditions; do not use to implement or perform final verification.
---

# Project Definition (Adaptive $plan)

Create an evidence-aware Definition Handoff that Step 2 ($dev) can execute without inventing requirements. The planning depth and ceremony automatically adapt to the resolved Execution Mode (`FAST`, `STANDARD`, or `CRITICAL`).

---

## 1. Classify Execution Mode & Risk First

Before writing the plan, the Engineering Kernel resolves the task into one of three execution tiers:

1. **FAST**: Local, reversible, low blast radius, no contract/security/migration impact.
2. **STANDARD**: Normal feature, module, internal endpoint, or bounded refactor.
3. **CRITICAL**: Architecture, authentication, security, database migration, public contracts, or irreversible changes.

*Safety Clamp Invariant*: If any critical risk signal is detected, the plan MUST escalate to `CRITICAL`. If uncertain between FAST and STANDARD, default to `STANDARD`.

---

## 2. Adaptive Planning Templates

Select the matching depth template based on the resolved mode:

### Template 1: FAST PLAN (Tinh gọn — Tối thiểu Thủ tục)
Use for small, local, reversible changes. Keep concise (under 25 lines):
```markdown
# [Task Title]

- **Execution Mode**: FAST
- **Intent**: What needs to be changed and why.
- **Affected Scope**: Exact files and functions impacted.
- **Acceptance Criteria**: Concrete verifiable conditions for completion.
- **Primary Risk**: Main failure mode and quick rollback method.
- **Proposed Topology**: SINGLE_OWNER
```

### Template 2: STANDARD PLAN (Tiêu chuẩn Tính năng)
Use for standard features and modules:
```markdown
# [Feature Title]

- **Execution Mode**: STANDARD
- **Problem & Objective**: Detailed problem statement and target outcome.
- **Scope & Non-Goals**: Explicit boundaries of what is in and out of scope.
- **Current Context**: Analysis of existing implementation and interfaces.
- **Dependencies & Integration**: Points of connection with other components.
- **Acceptance Criteria**: Requirement-traceable criteria (AC-01, AC-02...).
- **Work Boundaries**: Module ownership and do-not-touch boundaries.
- **Proposed Topology**: OWNER + REVIEWER
```

### Template 3: CRITICAL PLAN (Pháp y Kiến trúc Chuyên sâu)
Use for architecture, security, database, contracts, or high-risk tasks:
```markdown
# [Architecture / Migration Title]

- **Execution Mode**: CRITICAL
- **Problem & Forensic Analysis**: Deep dive into current state, code forensic, and historical context.
- **Scope & Strict Non-Goals**: Rigid containment boundaries.
- **Risk Surface & Threat Model**: Security, data integrity, and blast radius analysis.
- **Alternative Approaches & Trade-offs**: Evaluation of option A vs option B with explicit trade-offs.
- **System & API Contracts**: Formal contract specifications and backward compatibility guarantees.
- **Failure Modes & Degradation**: Behavior under partition, failure, or timeout.
- **Rollback & Disaster Recovery**: Step-by-step recovery procedure if deployment fails.
- **Security & Data Concerns**: Credentials, privacy, and migration safeguards.
- **Acceptance Criteria**: Strict verification requirements.
- **Human Decisions Required**: Explicit choices that require Product Owner (Anh) sign-off.
- **Proposed Topology**: ARCHITECT + ADVERSARIAL REVIEWER + HUMAN GATE
```

---

## 3. Work Protocol

1. **Inspect First**: Inspect existing code/artifacts before drafting.
2. **Select Depth**: Apply FAST, STANDARD, or CRITICAL template based on Kernel classification.
3. **Draft Plan**: Fill all required fields of the selected template. Do not invent facts; mark unknowns as `ASSUMPTION`.
4. **Gate Evaluation**:
   - `READY_FOR_DELIVERY`: Scope and acceptance criteria are actionable.
   - `CONDITIONAL_READY`: Planning may proceed, but list pending decisions.
   - `NOT_READY_FOR_DELIVERY`: Material ambiguity or unresolved critical risk prevents execution.
5. **Human Gate Enforcement**: If mode is `CRITICAL`, stop and obtain explicit sign-off from Product Owner (Anh) before transitioning to `$dev`.

Do not implement code in this skill. Conclude with the next authorized action.
