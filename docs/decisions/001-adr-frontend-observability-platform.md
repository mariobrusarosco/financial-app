# ADR 001: Frontend Observability Platform

## Status

Accepted

## Date

2026-03-17

## Context

Better Call Buffet is a browser-first financial application with:

- TanStack Start for app runtime and routing
- TanStack Router for navigation
- Axios-based API access
- sensitive financial data that must not be exposed to debugging tools

We need a frontend observability foundation that gives engineers:

- production error tracking
- route and user-flow tracing
- replay-on-error for fast debugging
- a stable setup that fits the repo today

We do not need full-stack observability in phase 1. This repo has TanStack Start server functions, but the initial requirement is to establish a safe and practical browser observability standard first.

## Decision

We will adopt a browser-first Sentry setup based on:

- `@sentry/react` for runtime error reporting and React error boundaries
- Sentry's TanStack Router browser tracing integration for route spans
- `@sentry/vite-plugin` for release injection and source-map upload

Phase 1 explicitly excludes TanStack Start server-function instrumentation.

## Alternatives Considered

### 1. `@sentry/react` + TanStack Router tracing

Pros:

- stable browser SDK
- direct support for React error boundaries and React 19 root hooks
- direct support for TanStack Router tracing
- straightforward Vite source-map integration
- low migration risk for the current repo

Cons:

- phase 1 only covers browser observability
- server functions need a later follow-up

### 2. `@sentry/tanstackstart-react`

Pros:

- closer to a future full-stack setup
- potentially more native TanStack Start coverage

Cons:

- the dedicated TanStack Start SDK is still alpha
- higher operational risk for a financial app baseline
- unnecessary scope for the first rollout

### 3. Vendor-neutral or OpenTelemetry-first frontend foundation

Pros:

- lower vendor coupling
- potentially cleaner long-term multi-vendor story

Cons:

- materially more implementation work for this team today
- weaker day-1 ergonomics for React error monitoring and replay
- delays getting useful production signal

## Rationale

The browser-first Sentry option gives us the best immediate value-to-risk ratio:

- it covers the highest-value failures in the app today
- it fits our current routing and build setup
- it keeps privacy controls centralized
- it avoids tying the initial rollout to an alpha SDK

This also supports the phased plan:

- Phase 1: baseline setup, release/source maps, root safety net, replay-on-error
- Phase 2: handled-failure standards and feature-level instrumentation
- Phase 3: higher-value custom spans across key user flows

## Consequences

- frontend engineers will use the shared observability helpers instead of ad hoc Sentry calls
- source maps and releases become part of the build contract
- browser observability is the official standard now
- server-function observability remains deferred until we intentionally revisit it

## Implementation Notes

- initialize Sentry in [`src/client.tsx`](/Users/mariobrusarosco/coding/financial-app/src/client.tsx)
- centralize runtime setup and redaction in [`src/config/observability/index.ts`](/Users/mariobrusarosco/coding/financial-app/src/config/observability/index.ts)
- wire source-map upload through [`vite.config.ts`](/Users/mariobrusarosco/coding/financial-app/vite.config.ts)
- document setup and engineer expectations in:
  - [`docs/style-guide/observability-setup.md`](/Users/mariobrusarosco/coding/financial-app/docs/style-guide/observability-setup.md)
  - [`docs/style-guide/observability-practices.md`](/Users/mariobrusarosco/coding/financial-app/docs/style-guide/observability-practices.md)
