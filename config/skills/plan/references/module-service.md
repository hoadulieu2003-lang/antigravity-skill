# Module, feature, API, and service definition

Use this adapter for a bounded technical capability added to a new or existing system.

## Required analysis

- Inspect the relevant system context, conventions, callers, shared contracts, and current limitations before defining changes.
- Define the module's single responsibility, consumers, capabilities, and explicit non-responsibilities.
- Specify input, output, interface, event, API, or schema contracts at the precision needed for planning.
- Define data ownership, state transitions, permissions, dependencies, integration points, and compatibility obligations.
- Cover invalid input, dependency failure, timeout, partial completion, retry, cancellation, and recovery when relevant.
- Define non-functional needs such as security, privacy, performance, cost, observability, maintainability, and migration.
- Identify changes that require backward compatibility, data migration, feature flags, or rollback.

## Definition additions

Add system-context map, responsibility boundary, consumer list, capability list, contracts, state model, dependency and integration map, failure behavior, compatibility strategy, observability needs, and testable acceptance criteria.

Add screens or menus only if the module exposes a real user-facing interface.
