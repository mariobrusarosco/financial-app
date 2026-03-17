# ADR: Environment Variable Management Strategy

## Status

Accepted

## Date

2025-05-11

## Context

The Better Call Buffet application requires a flexible and secure way to manage configuration that may vary between different environments (e.g., development, testing, production) or contain sensitive information. This includes settings like API base URLs, feature flags, or external service keys.

TanStack Start, the framework used for this project, leverages Vinxi, which in turn often utilizes Vite for client-side bundling and development server capabilities. Vite has a built-in mechanism for handling environment variables.

## Decision

We will adopt Vite's standard mechanism for managing environment variables:

1.  **`.env` Files**: Utilize a series of `.env.*` files in the project root for defining variables:
    - `.env`: Loaded in all environments. (Should not contain secrets if committed).
    - `.env.local`: Loaded in all environments, overrides `.env`. **Should be in `.gitignore`**.
    - `.env.[mode]`: (e.g., `.env.development`, `.env.production`) Loaded for the specific mode.
    - `.env.[mode].local`: Loaded for the specific mode, overrides mode-specific `.env`. **Should be in `.gitignore`**.
2.  **Variable Prefixing**: Client-side environment variables (those accessible in browser code) **MUST** be prefixed with `VITE_`. For example, `VITE_API_BASE_URL`.
3.  **Access in Code**: Variables will be accessed in client-side TypeScript/JavaScript code via `import.meta.env.VITE_VARIABLE_NAME`.
4.  **`.env.example`**: An `.env.example` file will be maintained in the project root. This file will list all required `VITE_` prefixed variables with placeholder or example values. It **WILL be committed to version control** and serve as a template.
5.  **Type Safety**: A type definition file (`app/vite-env.d.ts`) will be maintained to provide TypeScript type checking and autocompletion for `import.meta.env`.

## Rationale

### Pros:

1.  **Standardization**: Aligns with the built-in capabilities of Vite, which is used by TanStack Start (via Vinxi).
2.  **Security**: Clearly separates client-exposed variables (`VITE_` prefix) from build-time or server-side variables. Enforces that only explicitly prefixed variables are bundled.
3.  **Flexibility**: Supports different configurations for various modes (development, production) and local overrides.
4.  **Clarity**: The `.env.example` file serves as clear documentation for required environment variables.
5.  **Type Safety**: The `vite-env.d.ts` file enhances developer experience and reduces runtime errors by providing type checking for environment variables.
6.  **Future-Proof**: This approach is consistent with Vite's core functionality, which TanStack Start plans to rely on more directly in the future (moving away from Vinxi as the primary orchestrator to a more direct Vite + Nitro setup).

### Cons:

1.  **Prefix Requirement**: Developers must remember to use the `VITE_` prefix for client-side variables.

## Alternatives Considered

### Custom Script / Other Libraries:

- Could introduce more complexity or dependencies.
- Vite's built-in solution is idiomatic and well-integrated.

### No Explicit Strategy:

- Could lead to inconsistent variable naming, exposure of sensitive data to the client, or difficulties in managing configurations across environments.

## Consequences

- Developers must use `.env` files and the `VITE_` prefix as described.
- The `.env.example` file must be kept up-to-date with all necessary client-side environment variables.
- The `app/vite-env.d.ts` file must be updated if new client-side environment variables are added.
- Sensitive information or local overrides should be placed in `.env*.local` files and these files **must be added to `.gitignore`**.

## Implementation Notes

- The `apiClient` in `app/config/api/index.ts` was updated to use `import.meta.env.VITE_API_BASE_URL`.
- An initial `.env.example` file was created in the project root.
- An initial `app/vite-env.d.ts` file was created for type definitions.
