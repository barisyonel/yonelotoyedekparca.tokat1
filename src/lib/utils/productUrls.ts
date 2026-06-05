import { generateProductUrl } from './slugify';

type ProductUrlInput = {
  Id: number;
  Name: string;
  CategoryName?: string;
  SubCategoryName?: string;
};

/** Ürün kartı, sitemap ve canonical ile aynı tam yol */
export function getProductPagePath(product: ProductUrlInput): string {
  return `/urunler/urun/${generateProductUrl(product)}`;
}

export function getProductCanonicalUrl(
  product: ProductUrlInput,
  baseUrl = 'https://www.yonelotoyedekparca.com',
): string {
  return `${baseUrl}${getProductPagePath(product)}`;
}
