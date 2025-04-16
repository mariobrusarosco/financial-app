# Contributing to Financial App

Thank you for your interest in contributing to the Financial App project! This document provides guidelines and instructions for contributing.

## Development Setup

Follow the setup instructions in the main [README.md](../README.md) to get your development environment ready.

## Development Workflow

1. **Create a new branch for your feature or fix**:
   ```sh
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

2. **Make your changes**: Implement your feature or fix according to the project conventions.

3. **Write or update tests**: Ensure your code is properly tested.

4. **Commit your changes**: Use descriptive commit messages:
   ```sh
   git commit -m "feat: add new investment tracking feature"
   # or
   git commit -m "fix: resolve dashboard loading issue"
   ```

5. **Submit a Pull Request**: Push your branch and create a pull request against the main branch.

## Code Style Guidelines

- Follow the existing code style and structure
- Use TypeScript for type safety
- Style components with Tailwind CSS
- Create reusable components when possible
- Document complex functions and components

## Domain-Driven Structure

The project follows a domain-driven structure:

- Place domain-specific code in the appropriate `src/domains/[domain-name]` directory
- Create reusable components in `src/components`
- Use appropriate hooks for state management
- Follow TanStack Router conventions for routing

## Architectural Decision Records (ADRs)

Major architectural decisions should be documented as ADRs in the `decision-log` directory. Before introducing significant architectural changes, check existing ADRs and create a new one if needed.

## Pull Request Process

1. Update the README.md and documentation with details of your changes if needed
2. Update the guides directory with any new processes or guidelines related to your changes
3. The PR will be reviewed by maintainers who may request changes
4. Once approved, your PR will be merged into the main branch

## Questions?

If you have any questions about contributing, please reach out to the project maintainers. 