import type { PlainCategory } from '@/lib/serializeDb';
import { slugify } from './slugify';

export type ResolvedCategory = {
  categoryId: number | undefined;
  /** Ürün sorgusu — yalnızca alt kategori (veya alt kategorisi olmayan marka) */
  categoryIds: number[] | undefined;
  activeCategory: PlainCategory | null;
  parentCategory: PlainCategory | null;
};

function hasSubCategories(category: PlainCategory): boolean {
  return Boolean(category.SubCategories && category.SubCategories.length > 0);
}

/** Alt kategori seçili → sadece o alt kategori; markada alt yok → markanın kendisi */
function resolveSubFilter(
  parent: PlainCategory,
  sub: PlainCategory,
): ResolvedCategory {
  return {
    categoryId: sub.Id,
    categoryIds: [sub.Id],
    activeCategory: sub,
    parentCategory: parent,
  };
}

/** Sadece marka slug'ı — alt kategoriler varsa filtre yok (liste tüm ürünler veya alt seçilmeli) */
function resolveParentOnly(parent: PlainCategory): ResolvedCategory {
  if (hasSubCategories(parent)) {
    return {
      categoryId: undefined,
      categoryIds: undefined,
      activeCategory: null,
      parentCategory: parent,
    };
  }
  return {
    categoryId: parent.Id,
    categoryIds: [parent.Id],
    activeCategory: parent,
    parentCategory: parent,
  };
}

function findSubBySlug(parent: PlainCategory, subSlug: string): PlainCategory | null {
  if (!parent.SubCategories?.length) return null;

  for (const sub of parent.SubCategories) {
    if (slugify(sub.Name) === subSlug) return sub;
  }
  return null;
}

function findSubFuzzy(parent: PlainCategory, subSlug: string): PlainCategory | null {
  if (!parent.SubCategories?.length) return null;

  for (const sub of parent.SubCategories) {
    const subSlugNorm = slugify(sub.Name);
    const subNameLower = sub.Name.toLowerCase();
    if (
      subSlugNorm === subSlug ||
      subSlugNorm.includes(subSlug) ||
      subNameLower.includes(subSlug.replace(/-/g, '')) ||
      subNameLower.includes(subSlug)
    ) {
      return sub;
    }
  }
  return null;
}

function findSubByKeyword(
  parent: PlainCategory,
  matcher: (sub: PlainCategory) => boolean,
): PlainCategory | null {
  if (!parent.SubCategories?.length) return null;
  return parent.SubCategories.find(matcher) ?? null;
}

/**
 * URL slug'larından kategori çözümleme.
 * Filtre yalnızca alt kategori (veya alt kategorisi olmayan marka) için uygulanır.
 */
export function resolveCategoryFromSlug(
  slug: string[] | undefined,
  categories: PlainCategory[],
): ResolvedCategory {
  const empty: ResolvedCategory = {
    categoryId: undefined,
    categoryIds: undefined,
    activeCategory: null,
    parentCategory: null,
  };

  if (!slug?.length || categories.length === 0) {
    return empty;
  }

  const parentSlug = slug[0];
  const subSlug = slug[1];

  for (const cat of categories) {
    const catSlug = slugify(cat.Name);
    const catNameLower = cat.Name.toLowerCase();

    if (catSlug === parentSlug) {
      if (subSlug) {
        const sub = findSubBySlug(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
        const fuzzySub = findSubFuzzy(cat, subSlug);
        if (fuzzySub) return resolveSubFilter(cat, fuzzySub);
      }
      return resolveParentOnly(cat);
    }

    const slugKeywords = parentSlug.split('-').filter((k) => k.length > 2);
    const allKeywordsMatch =
      slugKeywords.length > 0 &&
      slugKeywords.every(
        (keyword) => catNameLower.includes(keyword) || catSlug.includes(keyword),
      );

    if (!allKeywordsMatch) continue;

    if (parentSlug === 'iveco' && catNameLower.includes('iveco')) {
      if (subSlug === 'daily') {
        const sub = findSubByKeyword(
          cat,
          (s) =>
            slugify(s.Name) === 'daily' || s.Name.toLowerCase().includes('daily'),
        );
        if (sub) return resolveSubFilter(cat, sub);
      } else if (subSlug) {
        const sub = findSubFuzzy(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
      }
      return resolveParentOnly(cat);
    }

    if (
      parentSlug === 'fiat' &&
      (catNameLower.includes('fiat') || catNameLower.includes('ducato'))
    ) {
      if (subSlug === 'ducato') {
        const sub = findSubByKeyword(
          cat,
          (s) =>
            slugify(s.Name) === 'ducato' || s.Name.toLowerCase().includes('ducato'),
        );
        if (sub) return resolveSubFilter(cat, sub);
      } else if (subSlug) {
        const sub = findSubFuzzy(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
      }
      return resolveParentOnly(cat);
    }

    if (parentSlug === 'foton' && catNameLower.includes('foton')) {
      if (subSlug) {
        const sub = findSubFuzzy(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
      }
      return resolveParentOnly(cat);
    }

    if (
      parentSlug === 'karatas' &&
      (catNameLower.includes('karataş') || catNameLower.includes('karatas'))
    ) {
      if (subSlug) {
        const sub = findSubFuzzy(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
      }
      return resolveParentOnly(cat);
    }

    if (parentSlug === 'mutlu' && catNameLower.includes('mutlu')) {
      if (subSlug === 'aku') {
        const sub = findSubByKeyword(
          cat,
          (s) => {
            const n = slugify(s.Name);
            return (
              n === 'aku' ||
              s.Name.toLowerCase().includes('akü') ||
              s.Name.toLowerCase().includes('aku')
            );
          },
        );
        if (sub) return resolveSubFilter(cat, sub);
      } else if (subSlug) {
        const sub = findSubFuzzy(cat, subSlug);
        if (sub) return resolveSubFilter(cat, sub);
      }
      return resolveParentOnly(cat);
    }
  }

  return empty;
}
