# Independent Audit Protocol (`$test`)

## 1. Core Philosophy & Separation of Concerns

* **`$dev` proves its own work (Self-Verification)**:
  Developer runs targeted unit tests, verifies builds, checks contracts, and emits an `Evidence Ledger`.
* **`$test` independently attempts to disprove it (Adversarial Audit)**:
  Tester does not trust the developer's claims. Tester constructs fresh tests, challenges edge cases, verifies frozen baselines, and attempts to uncover regressions or hidden failures.

## 2. Invariants

1. **Explicit Call Only**: `$test` is NEVER invoked automatically after `$dev` or `$design`. It must be explicitly triggered by the Product Owner (`Anh`) or an explicit system instruction.
2. **`AUDIT_ONLY` by Default**: Tester has `source_write_access: false` and `auto_fix: false`.
3. **Fresh Context Protocol**: The auditor operates in a clean context without developer biases or cached intermediate state.
4. **No Fake Pass**: Any check that cannot be executed safely results in `TEST_BLOCKED`, never `TEST_PASS`.

## 3. Audit Execution Flow

```text
EXPLICIT CALL ($test)
       │
       ▼
[VALIDATE_BASELINE_FROZEN] ──(Not frozen?)──> TEST_BLOCKED
       │
       ▼
[GENERATE_AUDIT_PLAN] (Resolve Depth: TARGETED / STANDARD / DEEP, select Ladder Rungs)
       │
       ▼
[EXECUTE_INDEPENDENT_CHECKS] (Produce Test Evidence: TE-001, TE-002, ...)
       │
       ▼
[EVALUATE_FINDINGS] (Deduplicate, assess severity, map to likely failure classes)
       │
       ▼
[EMIT_INDEPENDENT_VERDICT]
       │
       ├─ All passed ─────────────────────────> TEST_PASS
       ├─ Non-blocking minor notes ───────────> TEST_PASS_WITH_FINDINGS
       ├─ Acceptance failed / Contract break ──> TEST_FAIL (STOP, NO AUTO-FIX)
       └─ Environment or baseline broken ─────> TEST_BLOCKED
```
