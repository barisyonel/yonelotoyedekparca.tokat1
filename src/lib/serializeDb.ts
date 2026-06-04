import type { Category } from './models/Category';
import type { HomeSlider } from './models/HomeSlider';
import type { Product } from './models/Product';
import type { SliderImage } from './models/SliderImage';

/** unstable_cache ve Client Component props için JSON-serializable ürün */
export type PlainProduct = {
  Id: number;
  Name: string;
  Description?: string;
  ImageUrl?: string;
  CategoryName?: string;
  SubCategoryName?: string;
};

export type PlainHomeSlider = {
  Id: number;
  Title: string;
  Subtitle: string;
  Description: string;
  ImageUrl: string;
  CloudinaryPublicId: string;
  ButtonText: string;
  ButtonLink: string;
  SortOrder: number;
  IsActive: boolean;
};

export function toPlainProduct(row: Product): PlainProduct {
  return {
    Id: row.Id,
    Name: row.Name,
    Description: row.Description ?? undefined,
    ImageUrl: row.ImageUrl ?? undefined,
    CategoryName: row.CategoryName ?? undefined,
    SubCategoryName: row.SubCategoryName ?? undefined,
  };
}

export type PlainSliderImage = {
  Id: number;
  ImageUrl: string;
  CloudinaryPublicId: string;
};

export type PlainCategory = {
  Id: number;
  Name: string;
  ParentId?: number;
  SubCategories?: PlainCategory[];
};

export function toPlainSliderImage(row: SliderImage): PlainSliderImage {
  return {
    Id: row.Id,
    ImageUrl: row.ImageUrl,
    CloudinaryPublicId: row.CloudinaryPublicId,
  };
}

export function toPlainCategory(row: Category): PlainCategory {
  return {
    Id: row.Id,
    Name: row.Name,
    ParentId: row.ParentId ?? undefined,
    SubCategories: row.SubCategories?.map(toPlainCategory),
  };
}

export function toPlainHomeSlider(row: HomeSlider): PlainHomeSlider {
  return {
    Id: row.Id,
    Title: row.Title,
    Subtitle: row.Subtitle,
    Description: row.Description,
    ImageUrl: row.ImageUrl,
    CloudinaryPublicId: row.CloudinaryPublicId,
    ButtonText: row.ButtonText,
    ButtonLink: row.ButtonLink,
    SortOrder: row.SortOrder,
    IsActive: row.IsActive,
  };
}
