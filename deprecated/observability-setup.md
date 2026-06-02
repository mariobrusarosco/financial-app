# Observability Setup Guide

This guide explains how frontend observability is configured in Better Call Buffet and how to verify that the setup is working end to end.

## What We Use

- `@sentry/react` for browser error monitoring
- Sentry TanStack Router tracing for page-load and navigation spans
- Session Replay with error-only sampling
- `@sentry/vite-plugin` for release injection and source-map upload

Browser observability is the official phase 1 baseline.

Server-function observability is intentionally deferred.

## Files That Matter

- [`src/client.tsx`](/Users/mariobrusarosco/coding/financial-app/src/client.tsx)
- [`src/config/observability/index.ts`](/Users/mariobrusarosco/coding/financial-app/src/config/observability/index.ts)
- [`src/routes/__root.tsx`](/Users/mariobrusarosco/coding/financial-app/src/routes/__root.tsx)
- [`vite.config.ts`](/Users/mariobrusarosco/coding/financial-app/vite.config.ts)
- [`.env.example`](/Users/mariobrusarosco/coding/financial-app/.env.example)

Focused example files:

- [`src/config/api/index.ts`](/Users/mariobrusarosco/coding/financial-app/src/config/api/index.ts)
- [`src/domains/auth/hooks/use-logout.ts`](/Users/mariobrusarosco/coding/financial-app/src/domains/auth/hooks/use-logout.ts)
- [`src/domains/accounts/hooks/use-parse-account-statement.ts`](/Users/mariobrusarosco/coding/financial-app/src/domains/accounts/hooks/use-parse-account-statement.ts)

## Environment Variables

Client-exposed variables:

- `VITE_SENTRY_DSN`
- `VITE_SENTRY_ENVIRONMENT`
- `VITE_SENTRY_ENABLED`

Build-only variables:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_RELEASE`

Example:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1

VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_ENABLED=false

SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=better-call-buffet-front
SENTRY_RELEASE=$(git rev-parse HEAD)
```

## Runtime Behavior

At app startup we:

- create the TanStack Router instance
- initialize Sentry before hydration
- attach React 19 root error hooks
- wrap the app shell in a root `Sentry.ErrorBoundary`
- sync only `user.id` into Sentry scope

At runtime we also:

- capture uncaught render and hydration failures
- create page-load and navigation traces
- record Replay only when an error happens
- redact sensitive request, user, breadcrumb, and extra/context fields before sending

## Privacy Defaults

Current defaults:

- `sendDefaultPii: false`
- replay session sample rate: `0`
- replay on error sample rate: `1.0`
- production trace sample rate: `0.1`
- local Vite dev sessions do not send events to Sentry

Never sent by default:

- email
- full name
- password
- tokens
- request bodies
- raw statement or invoice payloads
- transaction descriptions
- monetary values

## Source Maps And Releases

`vite.config.ts` enables source maps and conditionally enables the Sentry Vite plugin when the build credentials are present.

Important details:

- release injection stays on so the browser SDK can attach the same release name that source maps were uploaded against
- if `SENTRY_RELEASE` is not provided, the plugin can fall back to the current git commit SHA when build metadata is available
- build-time upload is skipped when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, or `SENTRY_PROJECT` is missing

Recommended CI or Netlify setup:

```bash
SENTRY_ORG=your-org
SENTRY_PROJECT=better-call-buffet-front
SENTRY_AUTH_TOKEN=...
SENTRY_RELEASE=$COMMIT_SHA
```

## Local Verification

### 1. Verify startup gating

- leave `VITE_SENTRY_DSN` empty
- start the app
- confirm no Sentry network traffic is sent

Local development note:

- the browser SDK is disabled during local Vite development, even if a DSN is present
- use the local console and the development error details shown by the root fallback to debug render crashes

### 2. Verify runtime reporting

- set a valid `VITE_SENTRY_DSN`
- run a deployed preview, staging, or production-like build with `VITE_SENTRY_ENABLED=true`
- temporarily throw inside a routed component
- confirm:
  - the root fallback renders
  - an issue is created in Sentry
  - the event has the correct environment

### 3. Verify handled-error reporting

- trigger a network or 5xx failure in an instrumented flow like statement parsing
- confirm the event includes:
  - `domain`
  - `operation`
  - `handled=true`

### 4. Verify privacy rules

- inspect the event payload in Sentry
- confirm that:
  - `user.id` exists
  - email is absent
  - request body is absent
  - authorization headers are redacted

### 5. Verify release and source maps

- run a production-like build with the Sentry build variables configured
- deploy or serve that build
- confirm a captured error shows a readable source-mapped stack trace and the expected release

## How To Read The Data

### Issues

Use Issues first when the question is:

- what broke
- how often it broke
- which release introduced it

Read in this order:

- title and stack trace
- release and environment
- tags `domain`, `operation`, `handled`
- replay link if available

### Traces

Use Traces when the question is:

- which page flow is slow
- did navigation or a user action trigger the failure
- how long did parse/import/export work take

Look for:

- page-load span
- navigation span
- custom flow spans such as account statement parsing

### Replays

Use Replay when the question is:

- what the user actually did before the error
- whether the issue is UX-driven, timing-driven, or data-driven

Remember:

- replay is error-only in phase 1
- replay text and inputs remain masked by default

## Verification Commands

Useful local commands:

```bash
yarn build
```

Repo-wide `yarn typecheck` currently fails because the project already has a large unrelated TypeScript error backlog. That is existing debt, not introduced by the observability setup itself.
