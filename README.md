# Financial App

A modern financial web application built with React, TanStack Router, and Tailwind CSS.

## Features

- Dashboard for financial overview
- Investment tracking and management
- Modern, responsive UI

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd financial-app
```

2. Install dependencies:

```sh
npm install
# or
yarn
```

3. Start the development server:

```sh
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
financial-app/
├── decision-log/     # Architectural Decision Records
├── guides/           # Developer guides and documentation
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── domains/      # Domain-specific code
│   │   ├── dashboard/
│   │   └── investments/
│   ├── routes/       # Application routes
│   ├── styles/       # Global styles
│   └── utils/        # Utility functions
├── package.json
└── tailwind.config.mjs
```

## Development Guidelines

- Follow the guides in the `/guides` directory for detailed development instructions
- All architectural decisions are documented in the `/decision-log` directory
- Use TanStack Router for navigation and route management
- Style components with Tailwind CSS

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

## Learn More

For more information about the technologies used in this project:

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Start](https://tanstack.com/start/latest/docs/framework/react/quick-start)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

See the [CONTRIBUTING.md](./guides/CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.
