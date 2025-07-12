# ADR 0003: Standardize on `app/` as Primary Source Directory

**Date:** 2025-05-11

**Status:** Accepted

## Context

Previous architectural guidelines (notably outlined in an earlier ADR `b68c57bc-a2c5-4a5d-bbd2-1cfb9f66748d` regarding Domain-Based Architecture) suggested a project structure where domains and other source code would reside under a `src/` directory (e.g., `src/domains`).

However, the project's setup with TanStack Start inherently favors an `app/` directory at the project root for core application files such as `routes/`, `ssr.tsx`, `client.tsx`, `router.ts(x)`, and the auto-generated `routeTree.gen.ts`. Furthermore, existing scaffolded examples within the project, such as `app/domains/broker`, also follow this `app/`-centric structure.

This has created ambiguity regarding the correct location for new application modules, particularly domains.

## Decision

The project will officially standardize on using the `app/` directory as the primary root for all core application source code. This includes, but is not limited to:

- TanStack Start framework files (`routes/`, `ssr.tsx`, `client.tsx`, `router.tsx`, `routeTree.gen.ts`)
- Application domains (e.g., `app/domains/dashboard/`, `app/domains/investments/`)
- Shared application components, hooks, utilities, etc., that are part of the bundled application.

The `src/` directory, if used at all, should be reserved for code or assets that are not directly part of the TanStack Start application bundle (e.g., standalone scripts, build tools, documentation generation assets, or truly separate library code not intended to be part of the main app's structure).

## Rationale

- **Alignment with TanStack Start:** Adopting `app/` as the standard aligns directly with the conventions and expectations of the TanStack Start framework, simplifying configuration and ensuring smoother integration with its features (like file-based routing and manifest generation).
- **Structural Simplicity:** Consolidating all application source code under a single, well-defined root (`app/`) simplifies the project's directory structure and makes it easier for developers to navigate and understand.
- **Consistency with Existing Scaffolds:** This decision aligns with how example domains (e.g., `app/domains/broker`) are already structured within the project, promoting consistency.
- **Reduced Ambiguity:** Formalizing this standard eliminates confusion arising from conflicting guidelines or conventions (e.g., `src/domains` vs. `app/domains`).

## Consequences

- All new application code, especially domains, must be created within the `app/` directory (e.g., `app/domains/new-domain`).
- Any existing core application code currently residing in `src/` (if any, particularly domains intended to be part of the main application) should be considered for migration to the `app/` structure to maintain consistency. This migration can be phased.
- The guideline in ADR `b68c57bc-a2c5-4a5d-bbd2-1cfb9f66748d` (and any other documentation referencing `src/domains` or a `src/`-first approach for application code) is superseded by this ADR regarding the root path for application source files and domains. The principles of domain-driven structure within `app/domains/` still apply.
- Tooling configurations (e.g., `tsconfig.json` paths, `vite.config.ts`, ESLint configurations) should be verified and adjusted if necessary to correctly target the `app/` directory as the primary source root.

This decision aims to provide a clear and consistent structural foundation for the application's ongoing development.
