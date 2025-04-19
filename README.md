# Better Call Buffet - Financial App

A single-page application designed to help users manage their daily financial aspects.

## Project Overview

Better Call Buffet is a modern financial management application built with TanStack Start, using shadcn/ui for the interface and MSW for API mocking during development.

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

### Project Planning

- [Project Plan Overview](docs/plan/README.md)
- [Phase 1: Project Setup and Foundation](docs/plan/phase-1-setup.md)
- [Phase 2: Core Financial Features Implementation](docs/plan/phase-2-core-features.md)
- [Phase 3: Testing and Refinement](docs/plan/phase-3-refinement.md)
- [Phase 4: Future Enhancements](docs/plan/phase-4-future-enhancements.md)

## Development Setup

### Prerequisites

- Node.js (latest LTS version)
- Yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd financial-app

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

## Contributing

Before contributing to this project, please read through the relevant ADRs and planning documents to understand the project's architecture and roadmap.

## License

[License information will be added here] 