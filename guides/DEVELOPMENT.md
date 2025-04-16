# Development Guide

This guide provides detailed information for developers working on the Financial App project.

## Project Architecture

The Financial App is built using:

- **React 19**: For the UI components
- **TanStack Router**: For routing and navigation
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Vinxi**: As the build/development tool

## Domain-Driven Structure

The application follows a domain-driven approach:

```
src/
├── domains/
│   ├── dashboard/           # Dashboard domain
│   │   ├── api/             # API requests for dashboard data
│   │   ├── components/      # Dashboard-specific components
│   │   ├── hooks/           # Dashboard-specific hooks
│   │   └── schemas/         # Data schemas for dashboard entities
│   │
│   └── investments/         # Investments domain
│       ├── api/             # API requests for investment data
│       ├── components/      # Investment-specific components
│       ├── hooks/           # Investment-specific hooks
│       └── schemas/         # Data schemas for investment entities
│
├── components/              # Shared components
├── routes/                  # Application routes
├── styles/                  # Global styles
└── utils/                   # Utility functions
```

## Routing

We use TanStack Router for routing. Routes are defined in the `src/routes` directory:

- File-based routing with TypeScript for type safety
- Each route file exports a Route object
- Components for each route are defined in the same file

Example route file:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  component: YourComponent,
})

function YourComponent() {
  return <div>Your Component Content</div>
}
```

## State Management

- Use React hooks for local state
- For more complex state, consider using React Context or a state management library
- Place domain-specific hooks in the appropriate domain directory

## Styling

We use Tailwind CSS for styling:

- Prefer utility classes over custom CSS
- For complex components, use composition of utility classes
- For reusable styles, extract them to shared components

## Adding New Features

When adding a new feature:

1. Identify which domain it belongs to
2. Create necessary components in the domain's components directory
3. Add any API integration in the domain's api directory
4. Define TypeScript interfaces in the domain's schemas directory
5. Create custom hooks in the domain's hooks directory if needed
6. Add routes in the src/routes directory
7. Document your feature in the guides directory

## Testing

- Write unit tests for utility functions
- Write component tests for UI components
- Test API integration with mock data

## Documentation

- Document complex logic with code comments
- Create or update guides for new features or significant changes
- Update README.md when necessary
- Document architectural decisions as ADRs in the decision-log directory 