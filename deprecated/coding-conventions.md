# Coding Conventions Guide

This guide covers file naming, exports, type usage, and API naming conventions for Better Call Buffet.

## File Naming

- Use `kebab-case` for all files.
- Component files: `component-name.tsx`
- Utility files: `utility-name.ts`
- Hook files: `use-hook-name.ts`
- Types files: `types-and-interfaces.ts`

## Imports And Exports

- Default exports should match the filename.
- Always use named exports for utility functions and hooks.
- Always use the `type` keyword for type imports.
- Follow [Path Aliases](./path-aliases.md) for import rules.

## Type Definitions

- Define shared interfaces and types in the appropriate domain `types/` file.
- Keep type names explicit and aligned with the local domain language.

## API Type Naming Convention

For consistent API integration, follow this pattern:

### Single Resource

- `I_[Resource]Response` - Data from the backend for a single resource
- `I_[Resource]Payload` - Data sent to the backend for a single resource

### Collections

- `I_[Resources]Response` - Collection data from the backend
- `I_[Resources]Payload` - Collection data sent to the backend

### Examples

- `I_TransactionResponse`
- `I_TransactionPayload`
- `I_TransactionsResponse`
- `I_TransactionsPayload`
