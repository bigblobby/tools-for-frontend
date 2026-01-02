import { useEffect, useMemo } from 'react';
import { useRouterState } from '@tanstack/react-router';

export default function useMostRecentPages() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  
  useEffect(() => {
    if (pathname === '/') {
      return;
    }

    try {
      const stored = localStorage.getItem('most_recent_pages');
      let mostRecentPagesArr: string[] = stored ? JSON.parse(stored) : [];

      mostRecentPagesArr = mostRecentPagesArr.filter(path => path !== pathname);
      mostRecentPagesArr.push(pathname);

      if (mostRecentPagesArr.length > 5) {
        mostRecentPagesArr = mostRecentPagesArr.slice(-5);
      }

      localStorage.setItem('most_recent_pages', JSON.stringify(mostRecentPagesArr));
    } catch (error) {
      console.warn('Failed to save most recent pages:', error);
    }
  }, [pathname]);
  
  return useMemo(() => {
    try {
      const stored = localStorage.getItem('most_recent_pages');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load most recent pages:', error);
      return [];
    }
  }, []);
}