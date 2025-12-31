# Better Call Buffet - Financial App

A single-page application designed to help users manage their daily financial aspects.

## Project Overview

Better Call Buffet is a modern financial management application built with TanStack Start, using shadcn/ui for the interface and MSW for API mocking during development. We utilize **Shadcn/ui** as our primary component library, which is built on top of Radix UI and styled with **Tailwind CSS**. All custom styling, theme configurations, and UI-related utilities are centralized within the `app/domains/ui-system` domain to maintain a clear separation of concerns for our visual layer.

## Flowchart

The following diagram illustrates the conceptual architecture of the Better Call Buffet application, highlighting the client-server interaction within the TanStack Start framework:

```text
+-----------------------------------------------------------------------------------------+
|                                    User Interface                                     |
|                           (Browser - Client-Side Rendering)                           |
|                                                                                         |
|   +-----------------------+     +-------------------------------------------------+   |
|   |    TanStack Router    |<--->|      Interactive UI Elements                    |   |
|   | (Client Navigation,   |     |  (Rendered in Browser)                          |   |
|   |  Link Interception)   |     |                                                 |   |
|   +-----------------------+     |   *Built with:* Shadcn/ui (Base Components)     |   |
|                                 |   *Styled by:* Tailwind CSS (Utility Classes)   |   |
|                                 |   *Custom UI in:* `app/domains/ui-system`       |   |
|                                 +-------------------------------------------------+   |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
               | (Initial HTML Stream, Hydration, Client/Server API Calls)
               ▼
+-----------------------------------------------------------------------------+
|                             Application Logic                               |
|                    (Server-Side - TanStack Start / Node.js)                 |
|                                                                             |
|   +-----------------------+     +---------------------------------------+   |
|   |    TanStack Router    |<--->|         app/routes/                   |   |
|   | (SSR, Data Loaders,   |     | (Page structure, Server Functions)    |   |
|   |  Server Functions)    |     |                                       |   |
|   +-----------------------+     +---------------------------------------+   |
|                                                   |                       |
|                                                   | (Data requests)       |
|                                                   ▼                       |
|                                     +-----------------------+             |
|                                     |   MSW (API Mocking)   |             |
|                                     |      (Development)    |             |
|                                     +-----------------------+             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Diagram Explanation:**

- **User Interface (Browser):** This area depicts the client-side running in the browser.
  - **Interactive UI Elements (Rendered in Browser):** This represents the actual user interface that the user sees and interacts with.
    - It's **Built with: Shadcn/ui (Base Components)**, providing the foundational, unstyled, and accessible UI building blocks.
    - And it's **Styled by: Tailwind CSS (Utility Classes)**, applying styles to these components and other elements.
    - **Custom UI in: `app/domains/ui-system`**: This directory is where application-specific custom components, themes, and global styles are developed, leveraging Shadcn/ui and Tailwind CSS.
  - **TanStack Router (Client Navigation, Link Interception):** Manages client-side page transitions and URL updates, working in concert with these UI elements.
- **Application Logic (Server-Side):** This is the backend part, powered by TanStack Start. It processes initial requests, performs server-side rendering (SSR), handles data fetching via loaders in `app/routes/` (which define page structure and can contain server functions), and executes server functions. During development, it interfaces with MSW (Mock Service Worker) for API mocking.
- **Interaction Flow:** An initial page load involves the server rendering the page and sending HTML to the client. The client then hydrates this HTML, making it interactive. Subsequent navigation or data operations can be handled client-side, or involve calls to server functions, all orchestrated by TanStack Router and TanStack Start.

### Key Features (Planned)

- Dashboard for financial overview
- Transaction tracking and management
- Budget category management
- Financial visualization and reporting
- Future: API integration and authentication

## Documentation

All project documentation is organized in the `docs` folder:

### Architectural Decisions

- [TanStack Start Framework](docs/decisions/adr_tanstack_start.md)
- [shadcn/ui Component Library](docs/decisions/adr_shadcn_ui.md)
- [Mock Service Worker (MSW)](docs/decisions/adr_msw.md)
- [Coding Standards and Architecture](docs/decisions/coding-standards.md)
- [E2E Testing with Playwright](docs/decisions/015-adr-playwright-e2e.md)

### Project Planning

- [Project Plan Overview](docs/plan/README.md)
- [Phase 1: Project Setup and Foundation](docs/plan/phase-1-setup.md)
- [Phase 2: Core Financial Features Implementation](docs/plan/phase-2-core-features.md)
- [Phase 3: Testing and Refinement](docs/plan/phase-3-refinement.md)
- [Phase 4: Future Enhancements](docs/plan/phase-4-future-enhancements.md)

### Developer Guides

- [Testing Guide](docs/guides/testing.md)
- [E2E Testing Strategy](docs/guides/e2e-testing.md)
- [Path Aliases](docs/guides/path-aliases.md)

### User Journeys

- [User Journeys Overview](docs/user-journeys/README.md)
- [Authentication Journey](docs/user-journeys/01-authentication.md)
- [Dashboard Overview](docs/user-journeys/02-dashboard-overview.md)
- [Account Management](docs/user-journeys/03-account-management.md)
- [Transaction Management](docs/user-journeys/04-transaction-management.md)
- [Broker Management](docs/user-journeys/05-broker-management.md)
- [Vendor Management](docs/user-journeys/06-vendor-management.md)
- [Subscription Management](docs/user-journeys/07-subscription-management.md)
- [Category Management](docs/user-journeys/08-category-management.md)

## Development Setup

### 📋 Recommended Versions

- **Node.js**: `22.17.0` - For stable native fetch, latest ESM features, and security patches
- **Yarn**: `3.8.7` - For consistent CI/CD, modern workspaces, and reproducible builds

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd financial-app

# Enable Corepack for automatic Yarn version management
corepack enable

# Install dependencies
yarn install

# Start the development server
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
financial-app/
├── app/              # Application code
├── docs/             # Project documentation
│   ├── decisions/    # Architecture Decision Records (ADRs)
│   ├── guides/       # Developer guides
│   ├── plan/         # Project planning documents
│   └── fixing-log/   # Documentation of fixes for issues
└── public/           # Static assets
```

## Development Workflow

1. Tasks are organized by phases in the project plan
2. Reference the appropriate documentation before starting work on a feature
3. Use the shadcn/ui CLI for adding UI components
4. Follow the coding standards:
   - Use TypeScript
   - Import types using the `type` keyword
   - Use kebab-case for file naming

### API Type Naming Convention

For consistent API integration across all domains, follow this standardized pattern:

**Single Resource:**

- `I_[Resource]Response` - Data FROM backend (GET /resource/:id)
- `I_[Resource]Payload` - Data TO backend (POST/PUT /resource)

**Collections:**

- `I_[Resources]Response` - Collection FROM backend (GET /resources)
- `I_[Resources]Payload` - Collection TO backend (bulk operations)

**Examples:**

- `I_TransactionResponse` - Single transaction from API
- `I_TransactionPayload` - Single transaction to API
- `I_TransactionsResponse` - Transaction list from API
- `I_TransactionsPayload` - Transaction list to API (bulk operations)

This pattern ensures predictable type names and clear distinction between data flowing in different directions.

## Contributing

Before contributing to this project, please read through the relevant ADRs and planning documents to understand the project's architecture and roadmap.

## License

[License information will be added here]
