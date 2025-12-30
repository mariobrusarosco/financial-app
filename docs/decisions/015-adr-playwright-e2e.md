# ADR 015: Playwright for End-to-End (E2E) Testing

## Status

Proposed

## Context

As the Better Call Buffet project (financial-app) matures, we need a robust End-to-End (E2E) testing strategy to ensure critical user journeys remain functional across deployments. While we use Vitest for unit and component testing, E2E tests provide the highest level of confidence by testing the application as a whole, including frontend-backend integration, database state, and real browser behavior.

## Decision

We will use **Playwright** as our primary E2E testing framework.

## Rationale

### Why Playwright?

1. **Developer Experience (DX):** Playwright offers powerful tools like `codegen` for recording tests, a dedicated UI mode, and a trace viewer for debugging failures.
2. **Speed and Reliability:** It is faster than older alternatives like Selenium and more reliable than Cypress for complex scenarios (e.g., multiple tabs, cross-domain navigation, and iframes).
3. **Native ESM Support:** Playwright works seamlessly with our modern TypeScript/ESM stack without complex configuration.
4. **Auto-waiting:** Playwright automatically waits for elements to be actionable before performing actions, significantly reducing test flakiness.
5. **Multi-browser Support:** Tests run across Chromium, Firefox, and WebKit (Safari), ensuring cross-browser compatibility.
6. **Parallelism:** Native support for running tests in parallel across multiple workers.

### Comparison with Alternatives

- **Cypress:** Great DX but has limitations with multiple tabs, origins, and can be slower in certain CI environments.
- **Selenium/WebdriverIO:** Older architecture, slower, and requires more boilerplate/setup compared to modern tools.
- **Vitest (for E2E):** While Vitest can run in a browser environment, it's designed for unit/component testing. It doesn't provide the high-level browser automation features (tracing, video recording, multi-browser) that Playwright specializes in.

## Implementation Plan

1.  **Installation:** Add Playwright to `financial-app` dev dependencies.
2.  **Configuration:** Create `playwright.config.ts` with settings for timeouts, retries, and browser selection.
3.  **Authentication Strategy:** Use `storageState` to reuse authentication tokens across tests, avoiding redundant login steps.
4.  **Folder Structure:** Place tests in an `e2e/` directory at the root of `financial-app`.
5.  **CI Integration:** Add a step to our CI pipeline to run E2E tests against the deployed beta environment or a local build.

## Consequences

- **Increased Confidence:** We can guarantee that critical flows like "Login -> Create Transaction -> Verify Dashboard" work before every merge.
- **Setup Overhead:** Requires managing a test environment (local or staging) and handling test data.
- **Learning Curve:** Team members will need to learn Playwright's API (though similar to Testing Library).
