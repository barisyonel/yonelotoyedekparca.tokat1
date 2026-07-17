import { staticAsset } from '@/lib/cloudinaryAssets';

/**
 * Cloudinary slider görselleri: kırpmadan sığdır (c_limit).
 * 16:9 banner'lar kart içinde kesilmeden görünür.
 * Yerel /public path'leri staticAsset ile Cloudinary'ye çevrilir.
 */
export function getSliderImageUrl(url: string): string {
  const resolved = staticAsset(url || '');

  if (!resolved.includes('res.cloudinary.com') || !resolved.includes('/upload/')) {
    return resolved;
  }

  if (resolved.includes('/upload/c_') || resolved.includes('/upload/f_')) {
    return resolved;
  }

  return resolved.replace('/upload/', '/upload/c_limit,f_auto,q_auto:good/');
}
