# ADR: TypeScript Path Aliases and Configuration

## Status
Accepted

## Date
2023-11-12

## Context
In the Better Call Buffet project, we're using a domain-based architecture that requires importing modules across different domains. Without a proper import strategy, this can lead to complex relative import paths, reduced code readability, and maintenance challenges.

## Decision
We will implement TypeScript path aliases aligned with our domain-based architecture, along with strict TypeScript configuration to enhance type safety and developer experience.

## Rationale

### Pros:
1. **Cleaner Imports**: Replaces lengthy relative paths (`../../../domains/global/components`) with concise aliases (`@global/components`)
2. **Domain-Oriented**: Reinforces our domain-based architecture
3. **Refactoring Resilience**: Moves files without breaking import paths
4. **Better Developer Experience**: Improves code navigation and IDE auto-imports
5. **Type Safety**: Strict TypeScript configuration catches errors early
6. **Consistent Module Access**: Standardizes how domains are accessed
7. **Self-Documenting**: Path structure reveals architectural intent

### Cons:
1. **Configuration Overhead**: Requires additional build tool configuration
2. **Learning Curve**: New developers need to learn path alias patterns
3. **IDE Setup**: May require additional IDE configuration for optimal experience
4. **Potential Build Complexity**: Can add complexity to bundling configuration

## Configuration Details

### Path Aliases
We've configured the following path aliases:

| Alias | Points to | Purpose |
|-------|----------|---------|
| `@/*` | `src/*` | Access anything in the src directory |
| `@domains/*` | `src/domains/*` | Access any domain |
| `@global/*` | `src/domains/global/*` | Access shared components and utilities |
| `@tools/*` | `src/domains/tools/*` | Access feature flags, analytics, etc. |
| `@testing/*` | `src/domains/testing/*` | Access test utilities |

### TypeScript Configuration
- Strict mode enabled
- Null checking
- No implicit any types
- Enabled ES modules
- Modern JavaScript features (ES2022)
- Consistent file casing enforcement

## Alternatives Considered

### Relative Imports Only:
- No configuration needed
- Leads to "../../../" import paths
- Fragile during refactoring
- Harder to understand import sources

### Barrel Files (index.ts):
- Could use export aggregation without path aliases
- Creates potential circular dependencies
- Can impact bundle size through over-importing
- Still needs relative paths for initial imports

### Feature-Based Aliases:
- Could use feature-based instead of domain-based aliases
- Less aligned with our architecture
- Would create cross-cutting dependencies
- Harder to maintain separation of concerns

## Consequences
- Developers will use path aliases instead of relative imports
- TypeScript will provide stronger type checking
- Import statements will be more readable and maintainable
- Domain boundaries will be more explicitly enforced
- File moves within domains won't break imports
- Need to configure bundlers to understand path aliases

## Implementation Notes
- TypeScript configuration in `tsconfig.json`
- Path aliases defined in tsconfig.json
- Integration with bundler configuration needed
- Editor configuration recommended for team
- Enforcement through linting rules
- Documented usage patterns in developer guides 