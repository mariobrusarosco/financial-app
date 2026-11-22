import { useEffect, useState } from 'react';

const getMatches = (query: string) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

/** Tracks a CSS media query, e.g. `useMediaQuery('(min-width: 48rem)')`. */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};
