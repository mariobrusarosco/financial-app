# ADR: Adopting Mock Service Worker (MSW) for API Mocking

## Status
Accepted

## Date
2023-11-10

## Context
During the development of our financial application, we need a way to simulate API responses without depending on a real backend. This allows frontend development to proceed independently while ensuring our application is prepared for eventual integration with a real API. For a financial application, it's particularly important to have realistic data mock-ups that represent complex financial scenarios.

## Decision
We will use Mock Service Worker (MSW) as our API mocking solution.

## Rationale

### Pros:
1. **Network-level Mocking**: MSW intercepts actual network requests at the service worker level, creating a more realistic testing environment than other mocking solutions.
2. **API-agnostic**: Works with any API client (fetch, axios, react-query, etc.) without requiring changes to the application code.
3. **Same API for Browser and Node**: Provides a consistent API for both browser and Node environments, making it useful for both development and testing.
4. **Request-based**: Focuses on handling requests rather than replacing modules or dependencies, which aligns better with how real APIs work.
5. **TypeScript Support**: Written in TypeScript and provides good type definitions.
6. **Modern Architecture**: Uses Service Workers, which is a modern web standard.
7. **Seamless Integration**: Minimal configuration required to set up, and it works with any frontend framework.
8. **Realistic Error Simulation**: Can easily simulate various API error conditions and edge cases.
9. **Developer Experience**: Good developer tools and debugging capabilities.
10. **Active Development**: Regularly updated and maintained.
11. **Financial Data Mocking**: Allows us to create complex financial data structures and scenarios.

### Cons:
1. **Learning Curve**: Requires understanding of Service Workers and request handling patterns.
2. **Browser Support**: Requires browsers that support Service Workers, though this is less of an issue with modern browsers.
3. **Setup Overhead**: Initial setup requires configuring a service worker and defining handlers.
4. **Dev/Prod Differences**: Need to ensure the service worker is only active in development environments.
5. **Debugging Complexity**: Debugging issues with Service Workers can be more complex than other approaches.
6. **Performance Impact**: Service Workers add a small overhead to network requests.

## Alternatives Considered

### JSON Server:
- Provides a full REST API with zero coding
- Operates as an actual HTTP server
- Good for simple CRUD operations
- Less flexible for complex scenarios
- Requires running a separate process
- No integration with testing environments
- Limited ability to handle complex financial data relationships

### Mirage JS:
- Schema-based API mocking
- Good integration with frontend frameworks
- Built-in database layer
- More opinionated in its approach
- Less realistic network simulation
- Potentially more overhead for simple use cases
- More complex setup for financial-specific data models

### Manually Mocking Fetch/Axios:
- Simplest approach with no dependencies
- Direct control over mock implementation
- Integrated directly into codebase
- Less realistic
- More maintenance overhead
- No standard patterns or tools
- Difficult to scale as financial API complexity grows

## Consequences
- We will be able to develop the frontend independently of backend development.
- We'll have a realistic environment for testing API interactions.
- We'll need to maintain our mock API definitions as the real API evolves.
- We'll need to ensure MSW is only active in development and testing environments.
- We'll need to establish patterns for defining and organizing our mock handlers.
- We'll be able to simulate various financial scenarios and edge cases for thorough testing.

## Implementation Notes
- We will set up MSW for the browser environment for development.
- We will set up MSW for Node environment for testing.
- We will organize our mock handlers to match our expected API structure.
- We will create realistic mock data generators for financial data.
- We will document our mocking patterns for team consistency.
- We will implement scenarios for different financial situations (high balances, overdrafts, etc.).
- We will ensure our mock data follows financial calculation rules and business logic. 