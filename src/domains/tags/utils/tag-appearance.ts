import {
  Baby,
  Banknote,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  Car,
  Coffee,
  CreditCard,
  Dog,
  Droplet,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  Hammer,
  HeartPulse,
  House,
  Landmark,
  Laptop,
  Music,
  PawPrint,
  Phone,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  Receipt,
  Scissors,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Tag,
  Train,
  TrendingUp,
  Tv,
  Umbrella,
  Utensils,
  Wallet,
  Wine,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// The icons a tag can use, keyed by their Lucide name. Each one is imported by name so only
// these end up in the bundle: never look icons up on 'lucide-react' by a runtime string.
export const TAG_ICON_GROUPS: { label: string; icons: Record<string, LucideIcon> }[] = [
  {
    label: 'Food & drink',
    icons: {
      'shopping-cart': ShoppingCart,
      utensils: Utensils,
      coffee: Coffee,
      pizza: Pizza,
      beer: Beer,
      wine: Wine,
    },
  },
  {
    label: 'Home & bills',
    icons: {
      house: House,
      zap: Zap,
      droplet: Droplet,
      wifi: Wifi,
      phone: Phone,
      tv: Tv,
      wrench: Wrench,
      hammer: Hammer,
      receipt: Receipt,
    },
  },
  {
    label: 'Transport',
    icons: {
      car: Car,
      fuel: Fuel,
      bus: Bus,
      train: Train,
      bike: Bike,
      plane: Plane,
    },
  },
  {
    label: 'Health',
    icons: {
      'heart-pulse': HeartPulse,
      pill: Pill,
      stethoscope: Stethoscope,
      dumbbell: Dumbbell,
    },
  },
  {
    label: 'Shopping & leisure',
    icons: {
      'shopping-bag': ShoppingBag,
      shirt: Shirt,
      scissors: Scissors,
      sparkles: Sparkles,
      gift: Gift,
      film: Film,
      music: Music,
      'gamepad-2': Gamepad2,
      'book-open': BookOpen,
      umbrella: Umbrella,
    },
  },
  {
    label: 'Family & pets',
    icons: {
      baby: Baby,
      'graduation-cap': GraduationCap,
      dog: Dog,
      'paw-print': PawPrint,
    },
  },
  {
    label: 'Work & money',
    icons: {
      briefcase: Briefcase,
      laptop: Laptop,
      'building-2': Building2,
      banknote: Banknote,
      wallet: Wallet,
      'credit-card': CreditCard,
      'piggy-bank': PiggyBank,
      landmark: Landmark,
      'trending-up': TrendingUp,
    },
  },
];

const TAG_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  TAG_ICON_GROUPS.flatMap(group => Object.entries(group.icons))
);

// No icon set → null. A key that left the list falls back to the generic tag icon.
export const getTagIcon = (key: string | null): LucideIcon | null => {
  if (!key) return null;
  return TAG_ICONS[key] ?? Tag;
};

// Each class is written out in full because Tailwind only generates the classes it finds in
// the source: building them like `bg-${color}-100` would ship no styles.
export const TAG_COLORS: Record<string, { swatch: string; background: string; icon: string }> = {
  slate: {
    swatch: 'bg-slate-500',
    background: 'bg-slate-200 dark:bg-slate-500/25',
    icon: 'text-slate-600 dark:text-slate-300',
  },
  red: {
    swatch: 'bg-red-500',
    background: 'bg-red-100 dark:bg-red-500/20',
    icon: 'text-red-600 dark:text-red-400',
  },
  orange: {
    swatch: 'bg-orange-500',
    background: 'bg-orange-100 dark:bg-orange-500/20',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  amber: {
    swatch: 'bg-amber-500',
    background: 'bg-amber-100 dark:bg-amber-500/20',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  lime: {
    swatch: 'bg-lime-500',
    background: 'bg-lime-100 dark:bg-lime-500/20',
    icon: 'text-lime-700 dark:text-lime-400',
  },
  emerald: {
    swatch: 'bg-emerald-500',
    background: 'bg-emerald-100 dark:bg-emerald-500/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  teal: {
    swatch: 'bg-teal-500',
    background: 'bg-teal-100 dark:bg-teal-500/20',
    icon: 'text-teal-600 dark:text-teal-400',
  },
  sky: {
    swatch: 'bg-sky-500',
    background: 'bg-sky-100 dark:bg-sky-500/20',
    icon: 'text-sky-600 dark:text-sky-400',
  },
  blue: {
    swatch: 'bg-blue-500',
    background: 'bg-blue-100 dark:bg-blue-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  violet: {
    swatch: 'bg-violet-500',
    background: 'bg-violet-100 dark:bg-violet-500/20',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  fuchsia: {
    swatch: 'bg-fuchsia-500',
    background: 'bg-fuchsia-100 dark:bg-fuchsia-500/20',
    icon: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  rose: {
    swatch: 'bg-rose-500',
    background: 'bg-rose-100 dark:bg-rose-500/20',
    icon: 'text-rose-600 dark:text-rose-400',
  },
};

// No color set, or a key that left the palette → null, so callers keep their default styles
export const getTagColor = (key: string | null) => (key ? (TAG_COLORS[key] ?? null) : null);
