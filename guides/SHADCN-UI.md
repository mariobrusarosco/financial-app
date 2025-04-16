# Shadcn UI Usage Guide

This guide explains how to use Shadcn UI components in the Financial App project with our custom rose theme.

## Overview

Shadcn UI is a collection of reusable components built using Radix UI primitives and styled with Tailwind CSS. We've integrated it with a rose theme for consistent branding across our application.

## Components Location

All Shadcn UI components are organized within our domain-driven structure:

```
src/domains/ui-system/
├── components/    # UI components like Button, Card, etc.
├── lib/           # Utility functions
└── styles/        # Theme CSS
```

## Using Components

To use a component in your code, import it from the ui-system domain:

```tsx
import { Button } from "~/domains/ui-system"

function MyComponent() {
  return (
    <Button variant="default">Click me</Button>
  )
}
```

Or import multiple components:

```tsx
import { Button, Card, CardContent } from "~/domains/ui-system"
```

## Available Variants

Most components have multiple variants. Here are some common ones with our theme:

### Button Variants

- `default`: Primary rose color
- `destructive`: Red color for destructive actions
- `outline`: Outlined style
- `secondary`: Gray background
- `ghost`: No background until hovered
- `link`: Appears as a link

### Input Components

Input components like `Input`, `Select`, and `Textarea` are styled consistently with our theme.

## Creating Custom Themed Components

If you need to create a new component that matches our theme:

1. Use existing UI system components as building blocks
2. Follow the same design patterns
3. Utilize our theme variables in your tailwind classes

Example:

```tsx
import { Card, Button } from "~/domains/ui-system"

export function CustomCard() {
  return (
    <Card className="border-primary/20">
      <div className="p-4">
        <h3 className="text-primary font-medium">Card Title</h3>
        <p className="text-muted-foreground">Card content</p>
        <Button className="mt-4">Action</Button>
      </div>
    </Card>
  )
}
```

## Theme Variables

Our rose theme uses these Tailwind CSS variables:

```css
--primary: 346.8 77.2% 49.8%;  /* Rose color */
--primary-foreground: 355.7 100% 97.3%;
--secondary: 240 4.8% 95.9%;
--secondary-foreground: 240 5.9% 10%;
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--muted: 240 4.8% 95.9%;
--muted-foreground: 240 3.8% 46.1%;
--accent: 240 4.8% 95.9%;
--accent-foreground: 240 5.9% 10%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
```

## Adding New Shadcn UI Components

If you need a component that isn't already installed:

1. Use the Shadcn CLI to add it temporarily to a temp directory
2. Move the component to `src/domains/ui-system/components/`
3. Update the imports to use our domain structure
4. Export the component through the main index file
5. Import and use it in your code

## Customizing Components

Since Shadcn UI components are part of our codebase (not a library), you can directly modify them:

1. Find the component in `src/domains/ui-system/components/`
2. Make changes as needed
3. The changes will apply everywhere the component is used

## Best Practices

- Use UI system components instead of creating new ones when possible
- Maintain accessibility by not removing ARIA attributes
- Keep the consistent look and feel by using provided variants
- For complex domain-specific components, compose using UI system primitives 