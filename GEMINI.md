# GEMINI.md

This file provides a comprehensive overview of the "Better Call Buffet" financial application, designed to serve as a quick-start guide for developers and a contextual reference for AI-powered development tools.

## Project Overview

"Better Call Buffet" is a modern, single-page financial management application built with a robust and modern tech stack. The application aims to provide users with a comprehensive set of tools to manage their finances, including a dashboard for a financial overview, transaction tracking, budget management, and financial reporting.

### AI Agent Guidelines
* It's MANDATORY that you don't rush into fixes and implementations. Always ask for clarifications and ask for the context before proceeding. Only if the prompt is very specific about you fixing and coding right away, then proceed.
* Reason. Your goal is to provide the best possible code to the user, and to do that, you need to understand the context of the project and the user's needs.
* Do never assume or write code before reading a library documentation that user asked you our that you find. Don't waste user's time with guessing and wrong implementation. DO NOT ASSUME THE API OF THAT library. search for examples and clarify your doubts with the user. But, NEVER IMPLEMENT A SLOPPY SOLUTION" 

#### Planner Mode
* Breakdown the feature into Phases and provide a clear plan of action.
* Breakdown Phases into small tasks and provide a clear plan of action.
* Consider break tasks into subtasks.
* Create a `.md` file for the plan. Store in the `/docs/plans` folder.
* Fprmat
```
# Phase 1

## Goal

## Tasks

### Task 1 - lorem ipsum dolor sit amet []
#### Task 1.1 - lorem ipsum dolor sit amet []
#### Task 1.2 - lorem ipsum dolor sit amet []

...


## Dependencies

## Expected Result

## Next Steps

```
* Once you finish a task, ask user to review your work. 
* Wait for user's confirmation before proceeding to the next task. 
* Be patient and don't rush into fixes and implementations.
* Be ready to do fixes.
* Once confirmed by the user, mark the current sub-task or task as done.
* If you need to do a fix, mark the current sub-task or task as in progress.

### Key Technologies

- **Framework**: [TanStack Start](https://tanstack.com/start/v1) - A modern, full-stack framework for React.
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable UI components.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- **Routing**: [TanStack Router](https://tanstack.com/router/v1) - A fully type-safe router with first-class support for search-param APIs.
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/v5) - A powerful data-fetching and state management library.
- **API Mocking**: [Mock Service Worker (MSW)](https://mswjs.io/) - For mocking API requests during development.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: [Yarn](https://yarnpkg.com/)

### Architecture

The application follows a client-server architecture, with TanStack Start handling both server-side rendering (SSR) and client-side rendering (CSR). The `src/ssr.tsx` file serves as the entry point for SSR, while `src/client.tsx` is the entry point for the client-side application. The routing is managed by TanStack Router, with routes defined in the `src/routes` directory. The root layout of the application is defined in `src/routes/__root.tsx`.

## Building and Running

### Recommended Versions

- **Node.js**: `22.17.0`
- **Yarn**: `3.8.7`

### Key Commands

- **`yarn install`**: Installs all project dependencies.
- **`yarn dev`**: Starts the development server with logging. The application will be available at `http://localhost:5173`.
- **`yarn dev:no-logs`**: Starts the development server without logging.
- **`yarn build`**: Builds the application for production.
- **`yarn start`**: Starts the production server.
- **`yarn typecheck`**: Runs the TypeScript compiler to check for type errors.
- **`yarn lint`**: Lints the codebase using ESLint.
- **`yarn format`**: Formats the codebase using Prettier.
- **`yarn test`**: Runs the unit tests using Vitest.

## Development Conventions

The project adheres to a strict set of development conventions to maintain code quality and consistency.

### Coding Style

- **File Naming**: All files should be named using `kebab-case`.
- **Type Imports**: Use the `type` keyword for all type imports.
- **API Type Naming**: Follow the naming convention outlined in the `README.md` and `docs/decisions/014-coding-standards.md` for API-related types.
- **Formatting**: The project uses Prettier for automatic code formatting.

### Testing

- The project uses [Vitest](https://vitest.dev/) for unit and integration testing.
- Test files are located alongside the files they are testing.

### Linting

- The project uses [ESLint](https://eslint.org/) to enforce code quality and style.
- The ESLint configuration is defined in the `eslint.config.js` file.

### Documentation

- All project documentation is located in the `docs` folder.
- Architectural decisions are documented in the `docs/decisions` folder.
- Developer guides are available in the `docs/guides` folder.
