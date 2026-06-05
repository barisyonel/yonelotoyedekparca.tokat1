import type { PlainCategory } from '@/lib/serializeDb';
import { generateCategoryPagePath } from './categoryUrls';

export function findParentCategory(
  category: Pick<PlainCategory, 'Id'>,
  categories: PlainCategory[],
): PlainCategory | null {
  for (const cat of categories) {
    if (cat.SubCategories?.some((sub) => sub.Id === category.Id)) {
      return cat;
    }
  }
  return null;
}

export function getCategoryPathFromSlug(slug?: string[]): string {
  return (slug ?? []).filter(Boolean).join('/');
}

export function buildUrunlerUrl(options: {
  category?: PlainCategory | null;
  categories?: PlainCategory[];
  categoryPath?: string;
  searchParams?: URLSearchParams | string;
}): string {
  let url = '/urunler';

  if (options.categoryPath) {
    url += `/${options.categoryPath}`;
  } else if (options.category) {
    const parent = options.categories
      ? findParentCategory(options.category, options.categories)
      : null;
    url += `/${generateCategoryPagePath(options.category, parent)}`;
  }

  const query =
    options.searchParams instanceof URLSearchParams
      ? options.searchParams.toString()
      : options.searchParams ?? '';

  if (query) {
    url += `?${query}`;
  }

  return url;
}
