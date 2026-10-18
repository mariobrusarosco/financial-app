import { useCallback, useEffect, useState } from 'react';

/**
 * - `auto`: no saved preference; CSS decides (icon rail below xl, full sidebar from xl)
 * - `collapsed` / `expanded`: the user's explicit choice, persisted across visits
 */
export type SidebarState = 'auto' | 'collapsed' | 'expanded';

const STORAGE_KEY = 'sidebar-state';
// Matches Tailwind's `xl` breakpoint, where the `auto` state shows the full sidebar
const WIDE_QUERY = '(min-width: 80rem)';

const readStoredState = (): SidebarState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'collapsed' || stored === 'expanded' ? stored : 'auto';
  } catch {
    // In case localStorage is disabled
    return 'auto';
  }
};

export const useSidebarState = () => {
  // Starts as `auto` on the server and first client render so markup matches during hydration
  const [state, setState] = useState<SidebarState>('auto');
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    setState(readStoredState());

    const query = window.matchMedia(WIDE_QUERY);
    const handleChange = () => setIsWide(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, []);

  const isCollapsed = state === 'auto' ? !isWide : state === 'collapsed';

  const toggle = useCallback(() => {
    const next: SidebarState = isCollapsed ? 'expanded' : 'collapsed';
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore localStorage errors
    }
  }, [isCollapsed]);

  return { state, isCollapsed, toggle };
};
