export interface SearchItem {
  title: string;
  path: string;
}

export interface SearchCategory {
  category: string;
  items: SearchItem[];
}

export interface FilteredSearchCategory extends SearchCategory {
  items: SearchItem[];
}
