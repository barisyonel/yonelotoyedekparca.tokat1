import type { Category } from '../models/Category';

export type CategoryRow = {
  Id: number;
  Name: string;
  ParentId: number | null;
  CreatedAt: Date;
};

export function buildCategoryTree(
  categories: CategoryRow[],
  parentId: number | null = null,
): Category[] {
  return categories
    .filter((cat) => (cat.ParentId ?? null) === parentId)
    .map((cat) => ({
      ...cat,
      ParentId: cat.ParentId ?? undefined,
      SubCategories: buildCategoryTree(categories, cat.Id),
    }));
}
