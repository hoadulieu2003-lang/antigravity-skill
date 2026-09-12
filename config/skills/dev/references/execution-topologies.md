# Execution topologies

Select topology from coupling and ownership, not from a fixed agent count.

## SINGLE_OWNER

Use for small work or a tightly coupled mutable surface. One owner plans and produces; a separate reviewer checks the result.

## SEQUENTIAL

Use when later packages require outputs or decisions from earlier packages. Define explicit handoff contracts and do not begin downstream mutation before the dependency is accepted.

## PARALLEL

Use only when each package has distinct ownership, inputs, outputs, and integration contracts. Isolate code branches, files, data partitions, design frames, document sections, or other mutable surfaces when possible. Shared artifacts remain read-only unless owned by the integrator.

## HYBRID

Use when discovery or component production can run in parallel but integration, migration, final editing, or release must be sequential.

## Conflict rules

- One mutable surface has one active owner.
- An interface change requires integrator approval and notification to affected owners.
- Review comments do not grant write ownership.
- If safe partitioning cannot be expressed, reduce parallelism.
- Integration failures trigger a local correction or topology change, not an automatic full restart.
