# UI System Guide

This guide covers the UI architecture, component usage, styling conventions, and design patterns used in Better Call Buffet.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Component Library (shadcn/ui)](#component-library-shadcnui)
- [Icon Library (Lucide React)](#icon-library-lucide-react)
- [Styling with Tailwind CSS](#styling-with-tailwind-css)
- [Theme and Design Tokens](#theme-and-design-tokens)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)

## Overview

Better Call Buffet uses a modern, component-based UI architecture built on:
- **shadcn/ui** - Copy-paste component library built on Radix UI
- **Lucide React** - Icon library
- **Tailwind CSS v4** - Utility-first CSS framework
- **Rose Theme** - Primary color scheme for financial trust and professionalism

## Technology Stack

### Core UI Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| shadcn/ui | Latest | Component library (Radix UI + Tailwind) |
| Lucide React | 0.556.0 | Icon library |
| Tailwind CSS | v4 | Styling framework |
| Radix UI | Various | Accessible UI primitives |

### Related Documentation

- [ADR: shadcn/ui Adoption](/docs/decisions/006-adr-shadcn-ui.md)
- [Coding Standards](/docs/decisions/014-coding-standards.md)

## Component Library (shadcn/ui)

### Overview

shadcn/ui is not a traditional npm package. Instead, components are copied into your codebase, giving you full control and ownership.

### Installation

**Always use the shadcn CLI** to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Component Location

All shadcn/ui components are located in:
```
src/domains/ui-system/components/
```

### Common Components

| Component | Use Case | Example |
|-----------|----------|---------|
| `Button` | Actions, form submissions | `<Button variant="default">Save</Button>` |
| `Card` | Content containers | `<Card><CardHeader>...</CardHeader></Card>` |
| `Dialog` | Modal dialogs | `<Dialog><DialogTrigger>...</DialogTrigger></Dialog>` |
| `Drawer` | Side panels | `<Drawer><DrawerTrigger>...</DrawerTrigger></Drawer>` |
| `Select` | Dropdowns | `<Select><SelectTrigger>...</SelectTrigger></Select>` |
| `Input` | Text input | `<Input type="text" placeholder="..." />` |
| `Table` | Data tables | `<Table><TableHeader>...</TableHeader></Table>` |
| `Tabs` | Tabbed interfaces | `<Tabs><TabsList>...</TabsList></Tabs>` |

### Customization

Components can be customized directly in the codebase:

```tsx
// src/domains/ui-system/components/button.tsx
// Modify variants, sizes, or add new ones
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        destructive: "bg-destructive text-destructive-foreground...",
        // Add custom variants here
      }
    }
  }
)
```

### Component Composition

shadcn/ui components are designed for composition:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Transaction Details</CardTitle>
    <CardDescription>View and edit transaction information</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

## Icon Library (Lucide React)

### Overview

Lucide React is the standard icon library for this project. It's tree-shakable, TypeScript-friendly, and integrates seamlessly with shadcn/ui.

**Configuration:** Set in `components.json`:
```json
{
  "iconLibrary": "lucide"
}
```

### Installation Pattern

Always use **named imports**:

```tsx
import { Calendar, Tag, CreditCard, Wallet } from 'lucide-react';
```

### Usage Patterns

#### 1. Static JSX Rendering

The most common pattern for fixed icons:

```tsx
import { Plus, Edit, Trash2 } from 'lucide-react';

function ActionButtons() {
  return (
    <div>
      <Button><Plus className="h-4 w-4 mr-2" />Add</Button>
      <Button><Edit className="h-4 w-4 mr-2" />Edit</Button>
      <Button><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
    </div>
  );
}
```

#### 2. Component Type Reference (Dynamic Rendering)

Store icons as component types for dynamic rendering:

```tsx
import { LayoutDashboard, CreditCard, Building2, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CreditCard, label: 'Cards', href: '/cards' },
  { icon: Building2, label: 'Accounts', href: '/accounts' },
  { icon: TrendingUp, label: 'Investments', href: '/investments' },
];

function Navigation() {
  return (
    <nav>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <a key={item.href} href={item.href}>
            <Icon className="h-5 w-5" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
```

#### 3. React.createElement (Conditional Icons)

Use for conditional icon rendering:

```tsx
import { CreditCard, Wallet } from 'lucide-react';
import React from 'react';

function TransactionIcon({ isCredit }: { isCredit: boolean }) {
  const Icon = isCredit ? CreditCard : Wallet;
  return React.createElement(Icon, { className: 'h-3 w-3' });
}
```

#### 4. Icon Aliasing

When the icon name conflicts with a component name:

```tsx
import { Calendar as CalendarIcon } from 'lucide-react';

<CalendarIcon className="h-4 w-4" />
```

### Standard Icon Sizes

Follow these size conventions for consistency:

| Size Class | Pixels | Use Case | Example |
|------------|--------|----------|---------|
| `h-3 w-3` | 12px | Small inline icons, badges | Transaction type indicators |
| `h-4 w-4` | 16px | Button icons, form controls | Add/Edit/Delete buttons |
| `h-5 w-5` | 20px | Navigation, list items | Main navigation icons |
| `h-6 w-6` | 24px | Large UI elements, headers | Page titles, hero sections |

**Example:**
```tsx
// Navigation - use h-5 w-5
<LayoutDashboard className="h-5 w-5" />

// Button icon - use h-4 w-4
<Button><Plus className="h-4 w-4 mr-2" />Add Transaction</Button>

// Small indicator - use h-3 w-3
<CreditCard className="h-3 w-3 text-muted-foreground" />
```

### Common Icons Used in the Project

| Icon | Import | Use Case |
|------|--------|----------|
| `LayoutDashboard` | `lucide-react` | Dashboard navigation |
| `CreditCard` | `lucide-react` | Credit cards, payment methods |
| `Building2` | `lucide-react` | Bank accounts, institutions |
| `TrendingUp` | `lucide-react` | Investments, growth |
| `Receipt` | `lucide-react` | Transactions |
| `Calendar` | `lucide-react` | Dates, scheduling |
| `Tag` | `lucide-react` | Categories, labels |
| `Wallet` | `lucide-react` | Expenses, debit transactions |
| `Plus` | `lucide-react` | Add actions |
| `Edit` | `lucide-react` | Edit actions |
| `Trash2` | `lucide-react` | Delete actions |
| `ChevronDown` | `lucide-react` | Dropdowns, expandable items |
| `ChevronLeft`/`ChevronRight` | `lucide-react` | Pagination, navigation |
| `X` | `lucide-react` | Close, dismiss |
| `Loader2` | `lucide-react` | Loading states |
| `Filter` | `lucide-react` | Filtering options |

### Icon Resources

- **Browse icons:** https://lucide.dev/icons
- **Search:** Use the search on lucide.dev to find the perfect icon
- **Documentation:** https://lucide.dev/guide/

## Styling with Tailwind CSS

### Overview

This project uses Tailwind CSS v4 for styling. All styles should use Tailwind utility classes.

### Common Utility Patterns

#### Layout
```tsx
// Flexbox
<div className="flex items-center justify-between">
<div className="flex flex-col gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Spacing
<div className="p-4">      {/* padding: 1rem */}
<div className="mx-auto">  {/* margin-left/right: auto */}
<div className="space-y-4"> {/* vertical spacing between children */}
```

#### Typography
```tsx
<h1 className="text-2xl font-bold">
<p className="text-sm text-muted-foreground">
<span className="font-medium">
```

#### Colors
```tsx
// Use theme colors
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="bg-muted text-muted-foreground">

// State colors
<div className="bg-destructive">  {/* Errors, deletions */}
<div className="text-success">    {/* Success states */}
```

#### Responsive Design
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
<div className="hidden md:block">
<div className="flex-col md:flex-row">
```

### Custom Styles Location

Domain-specific styles are located in:
```
src/domains/ui-system/styles/
```

Global app styles:
```
src/domains/ui-system/styles/app.css
```

## Theme and Design Tokens

### Color Scheme

The project uses the **Rose theme** configured in `tailwind.config.ts`.

#### Primary Colors
- `primary` - Main brand color (Rose-based)
- `primary-foreground` - Text on primary backgrounds

#### Semantic Colors
- `secondary` - Secondary actions, less prominent elements
- `muted` - Subtle backgrounds, disabled states
- `accent` - Highlights, hover states
- `destructive` - Errors, dangerous actions
- `success` - Success states, positive actions

#### UI Colors
- `background` - Page background
- `foreground` - Main text color
- `card` - Card backgrounds
- `border` - Border color
- `input` - Input backgrounds
- `ring` - Focus ring color

### Typography

Tailwind's default typography scale is used:
- `text-xs` - 12px
- `text-sm` - 14px
- `text-base` - 16px (default)
- `text-lg` - 18px
- `text-xl` - 20px
- `text-2xl` - 24px
- `text-3xl` - 30px

### Spacing

Follow the Tailwind spacing scale (1 unit = 0.25rem = 4px):
- `gap-2` - 8px
- `gap-4` - 16px
- `gap-6` - 24px
- `p-4` - padding 16px
- `mt-8` - margin-top 32px

## Common Patterns

### Loading States

```tsx
import { Loader2 } from 'lucide-react';

// Button loading state
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>

// Page loading state
{isLoading && (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
)}
```

### Empty States

```tsx
import { Receipt } from 'lucide-react';

function EmptyTransactions() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get started by adding your first transaction
      </p>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>
    </div>
  );
}
```

### Error States

```tsx
import { AlertTriangle } from 'lucide-react';

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-md">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
```

### Cards with Actions

```tsx
import { Edit, Trash2, MoreVertical } from 'lucide-react';

function AccountCard({ account }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <CardTitle>{account.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {/* Account details */}
      </CardContent>
    </Card>
  );
}
```

### Forms

```tsx
import { Calendar, DollarSign } from 'lucide-react';

function TransactionForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Amount</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="number" className="pl-9" placeholder="0.00" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="date" className="pl-9" />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Transaction
      </Button>
    </form>
  );
}
```

### Navigation

```tsx
import { LayoutDashboard, CreditCard, Building2, TrendingUp } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CreditCard, label: 'Credit Cards', href: '/credit-cards' },
  { icon: Building2, label: 'Accounts', href: '/accounts' },
  { icon: TrendingUp, label: 'Investments', href: '/investments' },
];

function Sidebar() {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
```

## Best Practices

### Component Development

1. **Always use shadcn CLI** to add new shadcn/ui components
2. **Customize thoughtfully** - Modify components only when necessary
3. **Document customizations** - Comment why custom modifications were made
4. **Keep components small** - Break down complex components into smaller pieces

### Icon Usage

1. **Named imports only** - Never use default imports for icons
2. **Consistent sizing** - Follow the standard size conventions
3. **Semantic naming** - Use icon names that match their purpose
4. **Type safety** - Use `LucideIcon` type for icon props

### Styling

1. **Tailwind utilities first** - Use Tailwind classes before custom CSS
2. **Theme colors** - Use theme color variables, not hard-coded colors
3. **Responsive design** - Use mobile-first responsive utilities
4. **Semantic spacing** - Use consistent spacing following the scale

### Accessibility

1. **Semantic HTML** - Use proper HTML elements (button, nav, etc.)
2. **ARIA labels** - Add labels for icon-only buttons
3. **Keyboard navigation** - Ensure all interactive elements are keyboard accessible
4. **Focus states** - Maintain visible focus indicators

**Example:**
```tsx
// Good - Accessible icon button
<Button variant="ghost" size="icon" aria-label="Edit transaction">
  <Edit className="h-4 w-4" />
</Button>

// Bad - No label for screen readers
<Button variant="ghost" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

### Performance

1. **Tree shaking** - Named imports enable tree-shaking for icons
2. **Lazy loading** - Use React.lazy for large components
3. **Memoization** - Use React.memo for expensive components
4. **Avoid inline styles** - Use Tailwind classes instead

## Related Documentation

- [CLAUDE.md](/CLAUDE.md) - Project setup and architecture
- [ADR: shadcn/ui Adoption](/docs/decisions/006-adr-shadcn-ui.md)
- [Coding Standards](/docs/decisions/014-coding-standards.md)
- [Drawer Implementation Guide](/docs/guides/drawer-implementation.md)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
