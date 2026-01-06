import { pageCategories } from '@/constants/page.constants.ts';

export const getPageTitle = (path: string): string => {
  const pageItems = pageCategories.flatMap((category) => category.items);
  const pageItem = pageItems.find((item) => item.path === path);
  return pageItem?.title || 'Unknown';
}