# Charts Guide

This guide covers the chart components available in the application and how to use them.

## Chart Library

We use **shadcn/ui Charts**, which is built on top of [Recharts](https://recharts.org/). This provides:

- ✅ Pre-styled components that match our design system
- ✅ Full access to Recharts API (no wrapper abstraction)
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Accessibility features
- ✅ TypeScript support

## Installation

Charts are already installed in this project. If you need to add chart components in a new project:

```bash
npx shadcn@latest add chart
```

This installs:

- `recharts` package (v2.15.4)
- Chart components in `src/domains/ui-system/components/chart.tsx`

## Available Chart Types

### Standard Charts (from shadcn/ui)

- **Area Charts** - Trends over time
- **Bar Charts** - Comparisons
- **Line Charts** - Time series data
- **Pie Charts** - Proportions
- **Radar Charts** - Multi-variable data
- **Radial Charts** - Circular progress

### Custom Components

#### GaugeChart

A speedometer-style gauge chart perfect for financial visualizations.

**Location:** `src/domains/ui-system/components/gauge-chart.tsx`

**Use Cases:**

- Budget tracking (spent vs. limit)
- Credit card utilization (used vs. available)
- Savings goals (current vs. target)
- Investment allocation (current vs. target)
- Monthly spending vs. income

**Basic Example:**

```tsx
import { GaugeChart } from '@ui-system/components/gauge-chart';

function BudgetGauge() {
  return (
    <GaugeChart
      value={750}
      max={1000}
      label="Monthly Budget"
      valueFormatter={v => `$${v.toLocaleString()}`}
    />
  );
}
```

**Props:**

| Prop                  | Type                             | Default                 | Description                                         |
| --------------------- | -------------------------------- | ----------------------- | --------------------------------------------------- |
| `value`               | `number`                         | required                | Current value (e.g., 750 for $750 spent)            |
| `max`                 | `number`                         | required                | Maximum value (e.g., 1000 for $1000 budget)         |
| `label`               | `string`                         | `'Progress'`            | Label to display in the center                      |
| `color`               | `string`                         | `'hsl(var(--chart-1))'` | Color of the gauge arc                              |
| `valueFormatter`      | `(value: number) => string`      | `(v) => v.toString()`   | Format function for displaying values               |
| `percentageFormatter` | `(percentage: number) => string` | `(p) => \`${p}%\``      | Format function for displaying percentage           |
| `startAngle`          | `number`                         | `90`                    | Start angle (0=top, 90=right, 180=bottom, 270=left) |
| `endAngle`            | `number`                         | `-180`                  | End angle (creates speedometer-style semi-circle)   |
| `className`           | `string`                         | -                       | Additional CSS classes for the container            |
| `children`            | `ReactNode`                      | -                       | Additional content to display below the percentage  |

**Advanced Example:**

```tsx
<GaugeChart
  value={3500}
  max={5000}
  label="Emergency Fund"
  color="hsl(var(--chart-3))"
  valueFormatter={v => `$${v.toLocaleString()}`}
  startAngle={90}
  endAngle={-180}
  className="w-full max-w-md"
/>
```

**Full Circle Example:**

```tsx
// For a complete circular gauge instead of speedometer
<GaugeChart value={75} max={100} label="Portfolio Diversity" startAngle={0} endAngle={360} />
```

## Using Recharts Directly

You can use any Recharts component directly with our `ChartContainer`:

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@ui-system/components/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { month: 'Jan', revenue: 1000 },
  { month: 'Feb', revenue: 1500 },
  { month: 'Mar', revenue: 1200 },
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" />
      </BarChart>
    </ChartContainer>
  );
}
```

## Chart Configuration

The `ChartConfig` type defines colors, labels, and icons for your chart data:

```tsx
const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
  savings: {
    label: 'Savings',
    color: 'hsl(var(--chart-3))',
    icon: SavingsIcon, // Optional icon component
  },
} satisfies ChartConfig;
```

## Theme Colors

Charts automatically use theme colors defined in your CSS:

```css
--chart-1: hsl(...) --chart-2: hsl(...) --chart-3: hsl(...) --chart-4: hsl(...) --chart-5: hsl(...);
```

These automatically switch for dark mode.

## Responsive Design

All charts are responsive by default using `ResponsiveContainer` from Recharts. Control the size via the container:

```tsx
<div className="h-[300px] w-full">
  <GaugeChart value={50} max={100} label="Progress" />
</div>
```

## Accessibility

Charts include accessibility features:

- Screen reader support via ARIA labels
- Keyboard navigation
- High contrast mode support
- Proper semantic HTML

## Resources

- [shadcn/ui Charts Documentation](https://ui.shadcn.com/docs/components/chart)
- [Recharts Documentation](https://recharts.org/)
- [Recharts Examples](https://recharts.org/en-US/examples)

## Examples in Codebase

See `src/domains/dashboard/screens/index.tsx` for live examples of gauge charts in use.
