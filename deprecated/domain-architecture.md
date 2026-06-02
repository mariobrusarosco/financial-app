# Domain Architecture Guide

This guide defines the domain-based architecture used in Better Call Buffet.

## Domain-Based Architecture

The codebase is organized into cohesive, business-focused domains under `src/domains/`.

## Domain Structure

Each domain follows this pattern:

```text
domain-name/
├── api/
├── components/
├── hooks/
├── screens/
├── state-management/
├── utils/
└── index.ts
```

## Shared Domains

### Global Domain

- Use for truly application-wide code only.
- Avoid domain-specific logic in global components.
- Keep dependencies minimal and well-documented.

### Tools Domain

- Use for infrastructure and cross-cutting tools.
- Keep implementation details encapsulated.
- Provide clear documentation for each tool when needed.

### Testing Domain

- Use only for shared testing infrastructure.
- Co-locate actual test files with the source they verify.

## Domain Interaction

1. Domains can import from `global` and `tools`.
2. Domains should not import directly from other business domains.
3. For cross-domain communication, use:
   - event-based communication
   - shared state in `global`
   - a dedicated integration layer

## State Management

- Use React context for domain-specific state.
- Keep global state in the `global` domain.
- Prefer composition of small contexts over a single large context.

## General Principles

1. Keep domains focused on specific business capabilities.
2. Minimize dependencies between domains.
3. Write domain-specific tests for each domain.
4. Keep the file structure aligned with the surrounding domain.
