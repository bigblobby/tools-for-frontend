export interface PageItem {
  title: string;
  path: string;
}

export interface PageCategory {
  category: string;
  icon?: string;
  items: PageItem[];
}

export interface FilteredPageCategory extends PageCategory {
  items: PageItem[];
}
