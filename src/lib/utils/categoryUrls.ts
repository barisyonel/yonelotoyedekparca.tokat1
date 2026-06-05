import type { PlainCategory } from '../serializeDb';
import { slugify } from './slugify';

/** Sitede kullanılan sabit SEO kategori yolları (footer, ana sayfa ile aynı) */
export const SEO_CATEGORY_PATHS = [
  'iveco/daily',
  'iveco/120-14',
  'iveco/85-12',
  'iveco/65-9',
  'iveco/50nc',
  'fiat/ducato',
  'foton',
  'karatas',
  'mutlu/aku',
] as const;

/** Ürünler listesi / filtre ile aynı: /urunler/ana veya /urunler/ana/alt */
export function generateCategoryPagePath(
  category: Pick<PlainCategory, 'Name'>,
  parent?: Pick<PlainCategory, 'Name'> | null,
): string {
  if (parent) {
    return `${slugify(parent.Name)}/${slugify(category.Name)}`;
  }
  return slugify(category.Name);
}

/** DB ağacından sitemap için benzersiz kategori path listesi */
export function collectCategoryPathsFromTree(categories: PlainCategory[]): string[] {
  const paths = new Set<string>();

  for (const cat of categories) {
    if (cat.SubCategories && cat.SubCategories.length > 0) {
      for (const sub of cat.SubCategories) {
        paths.add(generateCategoryPagePath(sub, cat));
      }
    } else {
      paths.add(generateCategoryPagePath(cat));
    }
  }

  for (const seoPath of SEO_CATEGORY_PATHS) {
    paths.add(seoPath);
  }

  return [...paths];
}
