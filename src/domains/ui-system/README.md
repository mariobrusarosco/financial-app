# UI System

This domain contains our shared UI component system built with Tailwind CSS and shadcn/ui.

## Structure

- `/components` - Base UI components from shadcn/ui and custom components
- `/themes` - Theme configuration for light/dark modes
- `/styles` - Global styles and Tailwind configuration
- `/hooks` - UI-related hooks (useTheme, useMediaQuery, etc.)
- `/utils` - UI utility functions

## Usage

Import components directly from the ui-system domain:

```tsx
import { Button } from '@/domains/ui-system/components/button';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

## Theme

The UI system supports light and dark modes with the Rose theme from shadcn/ui.
