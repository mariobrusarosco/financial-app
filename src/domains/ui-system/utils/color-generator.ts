// Standard Tailwind Color Palette (approximate hex values for stability in canvas/SVG)
// Typed as Record<string, Record<number, string>> to fix indexing issues
const TAILWIND_COLORS: Record<string, Record<number, string>> = {
  slate:   { 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b' },
  red:     { 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b' },
  orange:  { 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412' },
  amber:   { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e' },
  yellow:  { 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e' },
  lime:    { 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212' },
  green:   { 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534' },
  emerald: { 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46' },
  teal:    { 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59' },
  cyan:    { 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75' },
  sky:     { 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985' },
  blue:    { 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af' },
  indigo:  { 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3' },
  violet:  { 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6' },
  purple:  { 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8' },
  fuchsia: { 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f' },
  pink:    { 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d' },
  rose:    { 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239' },
};

// Preferred order of hues for maximum contrast between adjacent items
const HUE_ORDER = [
  'blue', 'emerald', 'violet', 'orange', 'cyan', 'pink', 
  'lime', 'indigo', 'amber', 'teal', 'fuchsia', 'red',
  'sky', 'green', 'purple', 'yellow', 'rose', 'slate'
] as const;

// Shade progression strategy: Start with vibrant base, then go dark, then light
const SHADE_ORDER = [500, 700, 400, 800, 300, 600] as const;

/**
 * Generates an array of distinct hex colors based on Tailwind palette.
 * Uses a matrix of Hues x Shades to support a large number of categories.
 * 
 * Strategy:
 * 1. Cycle through all Hues at shade 500 (Base).
 * 2. Cycle through all Hues at shade 700 (Darker).
 * 3. Cycle through all Hues at shade 400 (Lighter).
 * ... and so on.
 * 
 * @param count Number of distinct colors needed
 * @returns Array of hex strings
 */
export const generateDistinctColors = (count: number): string[] => {
  const colors: string[] = [];
  
  // Matrix generation
  for (const shade of SHADE_ORDER) {
    for (const hue of HUE_ORDER) {
      if (colors.length >= count) return colors;
      
      const hex = TAILWIND_COLORS[hue][shade];
      colors.push(hex);
    }
  }

  // Fallback if we somehow exceed the matrix (highly unlikely for < 100 items)
  // Just repeat the array from start if needed
  while (colors.length < count) {
    colors.push(colors[colors.length % colors.length]);
  }

  return colors;
};
