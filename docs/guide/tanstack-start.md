# TanStack Start Developer Guide

## Overview
TanStack Start is a full-stack TypeScript application starter provided by the TanStack ecosystem. It integrates several TanStack libraries for a cohesive development experience.

## Key Components
- **TanStack Query**: Data fetching and state management
- **TanStack Router**: Type-safe routing with file-based route structure
- **TanStack Form**: Form validation and state
- **TanStack Table**: Data table management

## Getting Started
1. Install the project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
Better Call Buffet uses a domain-based architecture with TanStack Start's file-based routing:

```
src/
├── core/              # Shared code
│   ├── api/           # API client and utilities
│   ├── components/    # Shared UI components
│   ├── context/       # Application-wide contexts
│   ├── hooks/         # Shared custom hooks
│   ├── utils/         # Utility functions
│   └── types/         # Common TypeScript types
├── domains/           # Business domains
│   ├── dashboard/     # Dashboard domain
│   │   ├── api/       # Domain-specific API calls
│   │   ├── components/# UI components 
│   │   ├── context/   # Domain state
│   │   ├── hooks/     # Custom hooks
│   │   ├── screens/   # Full page components
│   │   ├── schema/    # Types and validation
│   │   └── utils/     # Domain utilities
│   ├── budget/        # Budget management domain
│   └── expenses/      # Expense tracking domain
└── routes/            # TanStack Router file-based route definitions
    ├── __root.tsx     # Root layout route
    ├── index.tsx      # Home route
    └── dashboard.tsx  # Dashboard route
```

## Routing System
TanStack Start uses a file-based routing system:
- `routes/__root.tsx` - Defines the root layout applied to all routes
- `routes/index.tsx` - Handles the `/` route
- `routes/about.tsx` - Handles the `/about` route
- Nested folders create nested routes (e.g., `routes/settings/profile.tsx` → `/settings/profile`)

## File Naming Conventions
- Use PascalCase for component files (e.g., `DashboardScreen.tsx`)
- Use camelCase for utility files (e.g., `formatCurrency.ts`)
- Use kebab-case for CSS files (e.g., `button-styles.css`)

## Best Practices
- Use TypeScript for all components and utilities
- Keep code within its appropriate domain
- Leverage TanStack Query for all data fetching
- Use TanStack Router for navigation
- Create reusable components within domains first, then move to core if shared
- Follow the established domain structure consistently 