# Software module and service delivery

- Inspect repository instructions, existing conventions, contracts, tests, and current changes before planning edits.
- Partition by bounded component, contract, layer, or independently integrable change; avoid parallel edits to shared core files.
- Define interface and schema changes before dependent implementation.
- Include compatibility, migrations, feature flags, error handling, observability, security, and rollback when required by the definition.
- Add focused tests during delivery for implementation feedback. Final independent verification still belongs to Step 3.
- Integrate in dependency order and validate the observable behavior, not merely file creation or compilation.

Evidence may include changed artifact manifest, build or type-check result, focused test result, contract examples, migration evidence, and integration notes.
