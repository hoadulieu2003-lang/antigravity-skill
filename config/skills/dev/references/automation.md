# Automation delivery

- Implement triggers, preconditions, state transitions, actions, and outputs as explicit work packages.
- Treat authorization, credentials, external side effects, retry, idempotency, compensation, and human approvals as first-class contracts.
- Use dry-run, sandbox, staging, or reversible checkpoints before live external mutation when available.
- Prevent multiple workers from concurrently changing the same live workflow or state store.
- Add audit events, failure visibility, ownership, and recovery instructions required by the definition.

Evidence may include dry-run traces, state-transition checks, duplicate-event behavior, retry and recovery demonstrations, audit records, and permission checks.
