# ADR 001: Integration of Shadcn UI with Rose Theme

## Status

Accepted

## Date

<!-- Current date -->

## Context

The Financial App requires a consistent, accessible, and visually appealing UI component system. We need to select a UI component library that:

1. Works well with React 19
2. Integrates with TanStack Router
3. Supports TypeScript
4. Is customizable for our branding (specifically a rose theme)
5. Provides a comprehensive set of accessible components
6. Has minimal bundle size impact

## Decision

We will integrate **Shadcn UI** as our component library with a customized rose theme, organized within our domain-driven structure as `src/domains/ui-system`.

Reasons for selecting Shadcn UI:
- It's not a component library but a collection of reusable components built using Radix UI and Tailwind CSS
- Components are copied into the project rather than installed as dependencies, allowing for full customization
- Built with accessibility in mind (using Radix UI primitives)
- Works well with React and TypeScript
- Uses Tailwind CSS which we've already integrated
- Has a theming system that allows for easy customization
- Low impact on bundle size since components are imported only as needed

## Implementation Strategy

1. Install the required dependencies for Shadcn UI
2. Create a dedicated domain for UI system (`src/domains/ui-system`)
3. Configure a custom rose theme using Tailwind CSS variables
4. Implement components in the UI system domain
5. Create a unified export through an index file for easy imports
6. Import and use components as needed in our application

## Structure

```
src/domains/ui-system/
├── components/    # UI components
├── lib/           # Utility functions
├── styles/        # Theme CSS
└── index.ts       # Unified exports
```

## Consequences

### Positive

- Consistent UI across the application
- Improved developer experience with well-documented components
- Accessibility built-in
- Full customization potential for branding
- Only import components we need, minimizing bundle size
- Domain-driven organization keeps UI system code isolated and maintainable

### Negative

- Additional setup time required
- Need to manage component updates manually
- Potential conflicts with existing Tailwind configuration

## Alternatives Considered

1. **Material UI**: More opinionated styling, heavier bundle size
2. **Chakra UI**: Good option, but less integration with Tailwind
3. **Ant Design**: Corporate feel, more difficult to customize
4. **Custom components**: Would require more development time

## Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/) 