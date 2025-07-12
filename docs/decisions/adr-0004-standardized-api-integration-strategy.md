# ADR-0004: Standardized API Integration Strategy

**Date**: 2025-05-11

**Status**: Accepted

## Context

As the application grows, it requires interaction with backend APIs to fetch and manipulate data. A consistent and robust strategy for API integration is crucial for maintainability, scalability, and developer efficiency. This includes how API calls are made, how server state is managed, and how these integrations are organized within the codebase.

We need a clear pattern for:

- Configuring the API client (base URL, headers).
- Structuring API call logic for different domains/entities.
- Managing server state (fetching, caching, synchronization, error handling) in the frontend.

## Decision

We will adopt a standardized approach for API integration based on the following components and patterns:

1.  **Centralized API Client (Axios)**:
    - An Axios instance will be configured centrally in `app/config/api/index.ts`.
    - This client will use a base URL sourced from an environment variable (`VITE_API_BASE_URL` in `.env` files), e.g., `VITE_API_BASE_URL=http://localhost:4000/api/v1`.
    - Default headers (like `Content-Type: application/json`) and interceptors (for request/response logging, error handling, or dynamic token injection) can be set up in this central client.

2.  **Domain-Specific API Services**:
    - For each domain (e.g., `accounts`, `investments`), an API service file will be created (e.g., `app/domains/accounts/api/index.ts`).
    - This file will import the `apiClient` and export an object (e.g., `accountsApi`) containing functions that make specific API calls related to that domain (e.g., `getAllAccounts()`, `createAccount()`).
    - These functions will use the `apiClient` to perform HTTP requests (GET, POST, PUT, DELETE, etc.) and will handle request parameters and response data, including type definitions for request payloads and API responses.

3.  **Server State Management (React Query)**:
    - `@tanstack/react-query` will be used for managing server state.
    - A global `QueryClient` instance will be created and provided to the application using `QueryClientProvider` at the root level (e.g., in `app/routes/__root.tsx`).

4.  **Custom React Query Hooks**:
    - For each set of related API operations within a domain, custom hooks will be created (e.g., `app/domains/accounts/hooks/use-accounts.ts` containing `useGetAllAccounts()` and `useCreateAccount()`).
    - These hooks will encapsulate `useQuery` (for data fetching) or `useMutation` (for data modification) calls.
    - The `queryFn` or `mutationFn` within these hooks will call the respective functions from the domain-specific API service.
    - Query keys will follow a consistent pattern, typically an array describing the data being fetched, e.g., `['accounts', 'all']` or `['accounts', 'active']` or `['account', accountId]`.

**Example Flow for Fetching Data**:

Component -> Custom Hook (`useGetAllAccounts`) -> React Query (`useQuery`) -> API Service (`accountsApi.getAllAccounts`) -> Central API Client (`apiClient.get('/accounts')`) -> Backend API

## Consequences

**Positive**:

- **Consistency**: Provides a uniform way to integrate with APIs across the application.
- **Maintainability**: Centralized API client configuration and clear separation of concerns make the code easier to understand and modify.
- **Scalability**: New API integrations can be added by following the established pattern (creating/updating API service files and hooks).
- **Developer Experience**: Clear structure reduces cognitive load for developers working on API integrations.
- **Robustness**: Leverages React Query's features like caching, automatic refetching, background updates, and optimistic updates, leading to a better user experience and reduced network traffic.
- **Testability**: API service functions and custom hooks can be unit-tested more easily.

**Negative**:

- **Boilerplate**: Requires setting up API service files and custom hooks for each domain or significant entity, which might feel like boilerplate for simple cases.
- **Learning Curve**: Developers need to be familiar with Axios, React Query, and the established patterns.
- **Dependency**: Introduces dependencies on Axios and `@tanstack/react-query`.

## Referenced Files (Examples)

- **Central API Client**: `app/config/api/index.ts`
- **Environment Variable for Base URL**: `.env` (e.g., `VITE_API_BASE_URL=http://localhost:4000/api/v1`)
- **Domain API Service**: `app/domains/accounts/api/index.ts`
- **Custom React Query Hook**: `app/domains/accounts/hooks/use-accounts.ts`
- **React Query Provider Setup**: `app/routes/__root.tsx`
