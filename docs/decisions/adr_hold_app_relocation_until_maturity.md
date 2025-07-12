# ADR 0002: Defer `app/` directory relocation until TanStack Start stabilizes

Date: 2024-06-XX

## Status

Accepted – Deferred

## Context

The team explored moving the TanStack Start `app/` folder under `src/app/` to harmonize with our `src/`-first convention (see ADR 0001). Because TanStack Start is still in beta and its configuration APIs may change, adopting this restructuring now carries extra risk.

## Decision

Postpone the `app/` relocation and continue using the default `app/` layout at the project root until TanStack Start reaches a stable 1.0 release. At that time, we'll revisit ADR 0001 and, if the CLI and config APIs have stabilized, implement the change.

## Consequences

- We avoid churn and potential breaking updates while in beta.
- Future alignment with our `src/` structure can happen once the framework's landing zone is stable.
