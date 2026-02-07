# GEMINI.md

This file provides a comprehensive overview of the "Better Call Buffet" financial application, designed to serve as a quick-start guide for developers and a contextual reference for AI-powered development tools.

## Project Overview

"Better Call Buffet" is a modern, single-page financial management application built with a robust and modern tech stack. The application aims to provide users with a comprehensive set of tools to manage their finances, including a dashboard for a financial overview, transaction tracking, budget management, and financial reporting.

### Core Mandates

1 - **Strict Scope Adherence:** Do not fix unrelated bugs, refactor code, or change naming conventions outside the explicit scope of the user's request, even if you find errors. If you
discover critical issues that block the requested task, report them to the user and ask for permission before proceeding
2 - **Strict Scope Adherence:** Focus exclusively on the user's request. Do not fix unrelated bugs, refactor code, or change naming conventions unless explicitly asked. If a deviation
adds significant value or is critical, ask for permission first.
3 - **Think Before You Act Adherence:** DO NOT RUSH. Analyze the request, reason through the solution, and plan your steps. If a request is vague, ask for clarification. Only proceed with
implementation when the path is clear and agreed upon.
4 - **Verify Assumptions Adherence:** Never guess APIs or library functionality. Always read documentation or search for examples before writing code. "Sloppy solutions" based on assumptions are
strictly forbidden.
5 - **Context Awareness Adherence:** Understand the project's existing architecture and conventions before making changes. Your goal is to provide high-quality, integrated code that respects the
current codebase.
6 - Planner Mode Adherence:

- Breakdown the feature into Phases and provide a clear plan of action.
- Breakdown Phases into small tasks and provide a clear plan of action.
- Consider break tasks into subtasks.
- Create a `.md` file for the plan. Store in the `/docs/plans` folder.
- Format

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

### Implementation Mode

- Once you finish a task or subtask, ask user to review your work.
- Wait for user's confirmation before proceeding to the next task or subtask.
- Be patient and don't rush into fixes and implementations.
- Be ready to do fixes.
- Once confirmed by the user, mark the current sub-task or task as done.
- If you need to do a fix, mark the current sub-task or task as in progress.

Example:

```
You don't have to ask permission to everyhing. let me explain:

You: "Can I start task 15.4.4?"
me: "Yes"
You:
'....
working on the task...
....'
You: "Finisish 15.4.4. Take a look and if it's good, I'll start 15.4.5"
Me: "it's all good, proceed"
You:
'....
working on the task...
....'
```

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

- **File Imports**: Use '/@' prefix. Always use absolute paths.
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
