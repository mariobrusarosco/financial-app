# Coding Standards

This document outlines the coding standards and best practices for the Better Call Buffet project. Adhering to these standards ensures consistency, readability, and maintainability across the codebase.

## TypeScript

- Use TypeScript for all code to leverage static typing benefits
- Enable strict mode in TypeScript configuration
- Use explicit return types for functions, especially for public APIs
- Minimize the use of `any` type, prefer `unknown` when type is uncertain
- Use interfaces for object shapes, especially for props and state
- Use type aliases for complex or reused types
- Use enums for finite sets of related constants
- Use generics for reusable components and functions

Example:
```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

type UserRole = 'admin' | 'user' | 'guest';

function fetchUser(id: string): Promise<User> {
  // ...
}

// Avoid
function processData(data: any): any {
  // ...
}
```

## Component Structure

- Use functional components with hooks
- Keep components focused on a single responsibility
- Break down complex components into smaller, reusable ones
- Co-locate related files (component, hooks, tests, styles)
- Use named exports for better import statements
- Document components with JSDoc comments
- Use TypeScript interfaces for component props

Example:
```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  label, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

## State Management

- Use TanStack Query for server state and remote data
- Use React Context for global UI state
- Use local component state for component-specific state
- Separate UI state from business logic
- Use custom hooks to encapsulate complex state logic
- Minimize prop drilling by using context or composition

## File Organization

- Group files by feature/domain, not by file type
- Keep related files close to each other
- Use consistent file naming conventions
- Use index files for clean exports
- Limit file size to maintain readability (aim for <300 lines)

## Styling

- Use Tailwind CSS for utility-first styling
- Follow the utility-first approach, composing complex components from utilities
- Extract common patterns to component classes using @apply when needed
- Use consistent naming for custom classes
- Use CSS variables for theming

## Error Handling

- Use error boundaries for UI error handling
- Provide meaningful error messages
- Log errors with appropriate context
- Handle expected errors gracefully
- Use try/catch blocks for async operations

## Imports and Dependencies

- Order imports consistently (React, external libraries, internal modules, types, styles)
- Use absolute imports for cross-feature references
- Use relative imports for within-feature references
- Avoid circular dependencies
- Keep external dependencies to a minimum

## Testing

- Write tests for all business logic
- Use React Testing Library for component tests
- Focus on testing behavior, not implementation
- Use mock data for API responses
- Test error cases and edge conditions

## Code Style

- Use ESLint with recommended rules
- Use Prettier for code formatting
- Use consistent indentation (2 spaces)
- Limit line length to 100 characters
- Use meaningful variable and function names
- Use camelCase for variables and functions
- Use PascalCase for component names and types
- Use UPPER_CASE for constants

## Comments and Documentation

- Document public APIs with JSDoc comments
- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes
- Document complex algorithms and business rules
- Create and maintain README files for major features

## Version Control

- Write clear, concise commit messages
- Reference issue numbers in commit messages
- Keep commits focused on single concerns
- Use feature branches for new features
- Use pull requests for code reviews

## Performance

- Avoid unnecessary renders with React.memo, useMemo, and useCallback
- Virtualize long lists with TanStack Virtual
- Optimize images and assets
- Use code splitting for large components
- Profile and optimize bottlenecks 