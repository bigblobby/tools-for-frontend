import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

export default function useMostUseTools() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    if (pathname === '/') {
      return;
    }

    try {
      const stored = localStorage.getItem('page_view_counts');
      const pageViewCounts: Record<string, number> = stored ? JSON.parse(stored) : {};

      pageViewCounts[pathname] = (pageViewCounts[pathname] || 0) + 1;

      localStorage.setItem('page_view_counts', JSON.stringify(pageViewCounts));
    } catch (error) {
      console.warn('Failed to save page view counts:', error);
    }
  }, [pathname]);
  
  return (() => {
    try {
      const stored = localStorage.getItem('page_view_counts');
      if (!stored) {
        return [];
      }

      const pageViewCounts: Record<string, number> = JSON.parse(stored);

      // Convert to array of [pathname, count] and sort by count (descending)
      return Object.entries(pageViewCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([pathname]) => pathname);
    } catch (error) {
      console.warn('Failed to load page view counts:', error);
      return [];
    }
  })();
}