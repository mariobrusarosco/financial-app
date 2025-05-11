# ADR: HTTP Client and API Instance Strategy

## Status
Accepted

## Date
2025-05-11

## Context
The Better Call Buffet application requires a standardized and robust mechanism for making HTTP requests to backend APIs. This is crucial for fetching data to display in the UI and for submitting user-initiated changes. Effective integration with TanStack Router, particularly for its `loader` and `action` functions, necessitates a clean and configurable approach to API interactions.

## Decision
We will adopt `axios` as the primary HTTP client library for the application.

A pre-configured `axios` instance, named `apiClient`, will be created and exported from `app/config/api/index.ts`. This instance will include:
- A default `baseURL` (configurable, potentially via environment variables).
- Default headers, such as `Content-Type: application/json`.
- Request and response interceptors for global handling of concerns like logging, authentication token injection, and error management.

## Rationale

### Pros:
1.  **Developer Experience**: `axios` provides a more convenient and intuitive API compared to native `fetch`.
2.  **Automatic Transformations**: Automatically transforms request and response data (e.g., JSON parsing/stringifying).
3.  **Error Handling**: Offers better built-in error handling, distinguishing between network errors and HTTP errors (4xx/5xx responses).
4.  **Interceptors**: Allows for powerful global configuration of requests and responses (e.g., adding auth tokens to all requests, global error logging/handling).
5.  **Centralized Configuration**: A single `apiClient` instance ensures consistent `baseURL`, headers, and other settings across all API calls.
6.  **TanStack Router Integration**: Easily usable within TanStack Router's `loader` and `action` functions for clean data fetching and mutations.
7.  **Browser Support**: Wide browser compatibility.
8.  **Cancellation**: Supports request cancellation.

### Cons:
1.  **Bundle Size**: Adds a small dependency to the project bundle compared to using native `fetch`.

## Alternatives Considered

### Native `fetch` API
-   **Pros**: Built into modern browsers, no extra dependency.
-   **Cons**: More verbose API, requires manual JSON parsing, error handling is less straightforward (e.g., `fetch` doesn't reject on HTTP error statuses like 4xx/5xx), lacks interceptors or global configuration out-of-the-box.

## Consequences
- All new API interactions should utilize the `apiClient` instance from `app/config/api/index.ts`.
- Developers will have a consistent pattern for making API calls.
- Global API concerns (like authentication headers or error logging) can be managed centrally via interceptors in `apiClient`.
- The `baseURL` for API calls is easily configurable.

## Implementation Notes
- `axios` was added to the project using the command: `yarn add axios`.
- The `apiClient` instance is defined and configured in `c:\Users\mario\coding\financial-app\app\config\api\index.ts`.
- The configuration includes a placeholder `baseURL` and examples for request/response interceptors which can be customized as needed.
