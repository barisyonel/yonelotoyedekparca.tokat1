/**
 * Cloudinary slider görselleri: kırpmadan sığdır (c_limit).
 * 16:9 banner'lar kart içinde kesilmeden görünür.
 */
export function getSliderImageUrl(url: string): string {
  if (!url?.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  if (url.includes('/upload/c_') || url.includes('/upload/f_')) {
    return url;
  }

  return url.replace('/upload/', '/upload/c_limit,f_auto,q_auto:good/');
}
