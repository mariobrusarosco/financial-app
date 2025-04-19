# ADR: Adopting TanStack Start as Framework

## Status
Accepted

## Date
2023-11-10

## Context
Our project, Better Call Buffet, needs a modern React-based framework that provides both client-side interactivity and server-side capabilities. We need a solution that will support full-stack development with type safety and provide a good developer experience. As a financial application, we require robust routing, data fetching, and server-side capabilities.

## Decision
We will use TanStack Start as our full-stack React framework for this project.

## Rationale

### Pros:
1. **Full-stack Type Safety**: Provides end-to-end type safety between client and server, reducing type-related bugs.
2. **Server-Side Rendering**: Offers full-document SSR, improving initial load performance and SEO capabilities.
3. **Server Functions**: Type-safe functions that run on the server, allowing for secure data operations.
4. **Built on TanStack Router**: Leverages TanStack Router's powerful type-safe routing capabilities.
5. **Modern Tooling**: Uses Vite for fast development and Nitro for deployment flexibility.
6. **Streaming Support**: Progressive rendering of content improves time-to-first-byte and user experience.
7. **Easy Deployment**: Ready to deploy to various hosting providers with minimal configuration.
8. **Active Community**: Being part of the TanStack ecosystem means good community support and regular updates.
9. **Framework Agnostic**: While we're using React, the underlying principles could apply to other frameworks in the future.
10. **Performance**: Built with performance in mind, which is crucial for a responsive financial application.

### Cons:
1. **Newer Framework**: As a relatively newer framework, it might have fewer resources, tutorials, and examples compared to more established ones.
2. **Learning Curve**: Team members might need time to learn TanStack Start's patterns and conventions.
3. **Smaller Ecosystem**: Fewer ready-made integrations and plugins compared to Next.js or similar frameworks.
4. **Potential Breaking Changes**: Newer frameworks are more likely to introduce breaking changes as they evolve.
5. **Less Battle-tested**: Might encounter edge cases that haven't been addressed in production environments.

## Alternatives Considered

### Next.js:
- More established with a larger community
- More extensive documentation and examples
- Built-in features like image optimization
- Less flexible in some routing aspects
- More opinionated, which can limit customization

### Remix:
- Strong focus on web fundamentals
- Good data loading patterns
- Great error handling
- Still relatively new
- Different mental model from traditional React apps

### SvelteKit:
- Different language/framework (Svelte instead of React)
- Excellent developer experience
- Smaller bundle sizes
- Would require team to learn Svelte
- Smaller ecosystem than React

## Consequences
- We will need to invest time in learning TanStack Start's patterns and best practices.
- We'll benefit from type-safe server functions and full-stack type safety.
- We'll need to monitor the framework's evolution and be prepared for potential breaking changes.
- We may need to create our own solutions for some features that might be built into more mature frameworks.
- We'll be able to build a high-performance, type-safe financial application with robust routing.

## Implementation Notes
- We should keep our code modular to minimize the impact of potential framework changes.
- We should maintain awareness of TanStack Start updates and community developments.
- We should document patterns and solutions we develop for common tasks to help team members.
- We will implement proper error handling and loading states for financial data operations.
- We will leverage server functions for sensitive financial calculations and data transformations. 