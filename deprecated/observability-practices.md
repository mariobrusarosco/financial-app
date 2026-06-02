# Observability Practices Guide

This guide defines the observability behavior expected from engineers when they add or change frontend features.

Use it as part of feature Definition of Done.

## Default Rule

Do not ask “can I send more data to Sentry?”

Ask:

- what is the smallest useful signal that helps us debug this safely

In this app, the answer is usually:

- stack trace
- route
- release
- a domain tag
- an operation tag
- one or two booleans or counts

## What Engineers Must Do

When adding a new feature:

- rely on the shared Sentry bootstrap for uncaught runtime failures
- use `captureHandledError(...)` only for important handled failures
- add spans for important user flows when timing matters
- keep all manual context low sensitivity
- make sure new instrumentation still respects the privacy policy

## Current Example Code

Use these files as the reference examples in this repo:

- [`src/config/api/index.ts`](/Users/mariobrusarosco/coding/financial-app/src/config/api/index.ts) for a critical handled failure captured with `captureHandledError(...)`
- [`src/domains/auth/hooks/use-logout.ts`](/Users/mariobrusarosco/coding/financial-app/src/domains/auth/hooks/use-logout.ts) for auth cleanup with `clearObservabilityUser()`
- [`src/domains/accounts/hooks/use-parse-account-statement.ts`](/Users/mariobrusarosco/coding/financial-app/src/domains/accounts/hooks/use-parse-account-statement.ts) for a timed flow with `Sentry.startSpan(...)` and handled failure capture

## When To Send Data To Sentry

Send handled errors when all of these are true:

- the error is already handled in UI code
- the user-impact is meaningful
- the failure is unexpected or operational
- the event would help us fix or prioritize the problem

Good examples:

- statement parsing fails because the backend or parser fails
- token refresh fails and the app must recover by clearing auth

## When Not To Send Data To Sentry

Do not send handled errors for:

- invalid credentials
- expected 4xx validation errors
- user cancellations
- empty states
- retryable UI noise that is already expected
- duplicate reports for the same failure path inside one flow

If the failure is part of the normal product contract, prefer user feedback only.

## How To Send Handled Errors

Use [`captureHandledError(...)`](/Users/mariobrusarosco/coding/financial-app/src/config/observability/index.ts).

Required fields:

- `domain`
- `operation`

Recommended shape:

```ts
captureHandledError(error, {
  domain: 'accounts',
  operation: 'parse-account-statement',
  context: {
    hasFile: true,
    hasAccountId: true,
  },
});
```

What the helper does:

- adds `domain`
- adds `operation`
- adds `handled=true`
- skips expected validation-style failures by default
- captures network, unknown, and 5xx failures
- respects global redaction rules

## What Context Is Allowed

Allowed:

- `hasFile`
- `hasAccountId`
- `hasDateRange`
- `transactions.count`
- `ignoredTransactions.size`
- page number
- per-page value
- file MIME type
- file size

Not allowed:

- email
- full name
- password
- token values
- raw API payloads
- statement or invoice text
- transaction descriptions
- balances, totals, or amounts

## How To Add Spans

Use spans when the timing of a user flow matters.

Current examples in the repo:

- account statement upload and parse

Pattern:

```ts
await Sentry.startSpan(
  {
    name: 'data-transfer.import.run',
    op: 'file.process',
    forceTransaction: true,
    attributes: {
      'app.domain': 'data-transfer',
      'file.type': file.type,
    },
  },
  async () => {
    return dataTransferApi.importData(file);
  }
);
```

Choose span names that answer:

- what flow was running
- which domain owned it
- whether it was a load, action, file process, or request

## Reading Sentry As An Engineer

### Start With Issues

Use Issues when you need:

- the stack trace
- the release
- the frequency
- the regression point

### Then Open The Replay

Open Replay when you need:

- user steps
- timing around the failure
- proof that the bug is reproducible in a specific flow

### Then Open The Trace

Open the Trace when you need:

- navigation timing
- page-load timing
- custom flow duration
- upstream request timing around the failure

## Feature Definition Of Done

For any new feature or risky change, check:

- uncaught failures are already covered by the app shell and do not need custom work
- important handled failures use `captureHandledError(...)`
- instrumentation does not send sensitive data
- any new critical timed flow has a clear span name
- user-facing error messaging still uses the existing error-handling patterns
- observability behavior is covered by tests or a manual verification note

## Send / Don’t Send Table

| Scenario                   | Send to Sentry | How                                  |
| -------------------------- | -------------- | ------------------------------------ |
| Render crash in production | Yes            | automatic root hooks / root boundary |
| Statement parse 5xx        | Yes            | `captureHandledError`                |
| Token refresh failure      | Yes            | `captureHandledError`                |
| Invalid login credentials  | No             | user toast only                      |
| Form validation error      | No             | inline error or toast only           |
| Empty subscriptions state  | No             | empty state only                     |
| User closes drawer         | No             | no event                             |
