import type { FilteredSearchCategory, SearchCategory } from '@/interfaces/search.interface.ts';

export const filterSearchItems = (
  searchItems: SearchCategory[],
  searchValue: string
): FilteredSearchCategory[] => {
  if (!searchValue.trim()) {
    return searchItems;
  }

  const lowerSearchValue = searchValue.toLowerCase();

  return searchItems
    .map((group) => ({
      category: group.category,
      items: group.items.filter((item) =>
        item.title.toLowerCase().includes(lowerSearchValue)
      )
    }))
    .filter((group) => group.items.length > 0);
};

export const getTotalResults = (
  searchItems: SearchCategory[],
  searchValue: string
): number => {
  if (!searchValue.trim()) {
    return searchItems.reduce((acc, group) => acc + group.items.length, 0);
  }

  const lowerSearchValue = searchValue.toLowerCase();
  return searchItems.reduce((acc, group) => {
    return acc + group.items.filter((item) =>
      item.title.toLowerCase().includes(lowerSearchValue)
    ).length;
  }, 0);
};

