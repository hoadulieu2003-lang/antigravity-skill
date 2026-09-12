# AI and data delivery

- Freeze representative data and evaluation cases before comparing approaches when feasible.
- Partition deterministic processing, data preparation, model or prompt behavior, orchestration, evaluation, and interface integration when their contracts are stable.
- Version schemas, prompts, models, datasets, and evaluation settings needed for reproducibility.
- Implement uncertainty, fallback, privacy, human review, observability, latency, and cost controls required by the definition.
- Do not optimize against a test set that is also used as the final acceptance set.

Evidence may include data-quality checks, evaluation results against a baseline, error analysis, reproducibility metadata, latency and cost measurements, and fallback demonstrations.
