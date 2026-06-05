/** Next/Image — PageSpeed uyumlu varsayılanlar */

export const IMAGE_QUALITY = {
  hero: 75,
  card: 72,
  logo: 70,
  product: 75,
} as const;

/** Ana sayfa hero slider (görüntülenen ~350–700px) */
export const HERO_SLIDE_SIZES =
  '(max-width: 640px) 350px, (max-width: 1024px) 560px, 700px';

/** Marka kartı (~112–168px görünen alan) */
export const BRAND_CARD_SIZES =
  '(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px';

/** Ürün kartı ana sayfa */
export const PRODUCT_CARD_SIZES =
  '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px';

/** Ürünler sayfası carousel */
export const PRODUCTS_CAROUSEL_SIZES =
  '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px';
