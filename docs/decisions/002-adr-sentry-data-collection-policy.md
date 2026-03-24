# ADR 002: Sentry Data Collection Policy

## Status

Accepted

## Date

2026-03-17

## Context

Better Call Buffet is a financial application. Observability must help us debug production problems without turning Sentry into a second datastore for sensitive customer information.

The riskiest data in this repo includes:

- emails and personal names
- access tokens and refresh tokens
- passwords
- raw statements and invoice contents
- request and response bodies
- transaction descriptions and monetary values

We need a policy that gives engineers a default they can follow safely without case-by-case interpretation every time they add a feature.

## Decision

We will use a strict minimal collection policy.

That means:

- `sendDefaultPii` stays `false`
- Sentry user scope may contain `user.id` only
- Replay stays masked by default
- replay collection is `error only`
- request bodies, statement contents, invoice contents, transaction descriptions, and monetary values must not be attached to Sentry events
- manual handled-error reports may include only low-sensitivity context such as booleans, counts, file type, route path, and pagination/filter presence

## Alternatives Considered

### 1. Strict minimal collection

Pros:

- safest default for a financial app
- reduces compliance and privacy review burden
- keeps engineer behavior easy to audit

Cons:

- less context available on each event
- some investigations require using replay and app logs together

### 2. Balanced collection

Pros:

- richer debugging context
- some issues become faster to understand

Cons:

- higher privacy review burden
- more opportunity for accidental leakage
- more policy exceptions to maintain

### 3. Debug-heavy collection

Pros:

- fastest raw debugging velocity

Cons:

- unacceptable default risk for this product domain
- too easy to leak sensitive financial or identity data
- noisy events and replays

## Rationale

The safest scalable policy is the one engineers can apply consistently.

Strict minimal collection still gives us meaningful observability because we retain:

- stack traces
- release and environment context
- route and navigation traces
- replay-on-error
- explicit low-sensitivity tags and counts for handled failures

This is enough to build a reliable baseline without over-collecting data.

## Policy Rules

Allowed by default:

- `user.id`
- route path
- environment and release
- booleans such as `hasFile`, `hasDateRange`, `hasAccountId`
- counts such as `transactions.count`, `rowCount`
- file metadata such as MIME type and size

Forbidden by default:

- email
- full name
- password
- access token
- refresh token
- raw statement or invoice data
- request or response bodies
- transaction descriptions
- balance, total, amount, or other monetary values

## Consequences

- new instrumentation must go through the shared helper or an explicit privacy review
- feature work should prefer counts and flags over payload snapshots
- if a team needs richer context for a specific issue class, that change must be intentional and documented

## Implementation Notes

- redaction and safe defaults live in [`src/config/observability/index.ts`](/Users/mariobrusarosco/coding/financial-app/src/config/observability/index.ts)
- engineer behavior is documented in [`docs/style-guide/observability-practices.md`](/Users/mariobrusarosco/coding/financial-app/docs/style-guide/observability-practices.md)
