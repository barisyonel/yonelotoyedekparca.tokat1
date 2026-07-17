/**
 * Statik görseller — Cloudinary (yonel-static).
 * Yerel /public path → optimize delivery URL.
 * Yenilemek için: node scripts/upload-static-to-cloudinary.mjs
 */
const CLOUD_NAME = "dhqdwiovd";

const LOGO1 =
  "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/logo1_png";
const APP_ICON =
  "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/app-icon_png";

export const CLOUDINARY_STATIC_ASSETS: Record<string, string> = {
  "/app-icon.png": APP_ICON,
  "/apple-touch-icon.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/apple-touch-icon_png",
  // Yerelde bozuk placeholder'lardı
  "/og-image.jpg": LOGO1,
  "/twitter-image.jpg": LOGO1,
  "/android-chrome-192x192.png": APP_ICON,
  "/android-chrome-512x512.png": APP_ICON,
  "/assets/d.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/d_png",
  "/assets/dailly.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/dailly_png",
  "/assets/ducato.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/ducato_jpg",
  "/assets/foton.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/foton_png",
  "/assets/gorsel.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/gorsel_png",
  "/assets/gorsel1.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/gorsel1_png",
  "/assets/gorsel2.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/gorsel2_png",
  "/assets/ivec.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/ivec_png",
  "/assets/iveco.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/iveco_png",
  "/assets/karat.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/karat_png",
  "/assets/karatas.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/karatas_png",
  "/assets/logo.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/logo_jpg",
  "/assets/logo.webp": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/logo_webp",
  "/assets/logo1.png": LOGO1,
  "/assets/lovol.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/lovol_png",
  "/assets/mutlu.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/mutlu_png",
  "/assets/mutluu.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/mutluu_png",
  "/assets/png-transparent-n-motor-n-tornadoes-car-logo-vehicle-car-text-trademark-truck.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/png-transparent-n-motor-n-tornadoes-car-logo-vehicle-car-text-trademark-truck_png",
  "/assets/slider.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/slider_png",
  "/assets/slider1.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/slider1_png",
  "/assets/slider2.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/slider2_png",
  "/assets/slider3.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/assets/slider3_png",
  "/favicon.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/favicon_png",
  "/gorsel.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/gorsel_png",
  "/gorsel1.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/gorsel1_png",
  "/gorsel2.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/gorsel2_png",
  "/images/60aku.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/60aku_png",
  "/images/balata.png": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/balata_png",
  "/images/foton-oil-filter.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/foton-oil-filter_jpg",
  "/images/iveco-brake-pad.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/iveco-brake-pad_jpg",
  "/images/karatas-oil.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/karatas-oil_jpg",
  "/images/karatasbas.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/karatasbas_jpg",
  "/images/logo.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/logo_jpg",
  "/images/mutlu-60ah.jpg": "https://res.cloudinary.com/dhqdwiovd/image/upload/f_auto,q_auto/yonel-static/images/mutlu-60ah_jpg",
};

/** Yerel path veya tam site URL → Cloudinary URL; bilinmeyen path olduğu gibi döner */
export function staticAsset(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl;

  if (pathOrUrl.includes('res.cloudinary.com')) {
    return pathOrUrl;
  }

  const sitePrefix = 'https://www.yonelotoyedekparca.com';
  let key = pathOrUrl;
  if (key.startsWith(sitePrefix)) {
    key = key.slice(sitePrefix.length) || '/';
  }
  if (!key.startsWith('/')) {
    key = `/${key}`;
  }

  return CLOUDINARY_STATIC_ASSETS[key] ?? pathOrUrl;
}

export function cloudinaryCloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || CLOUD_NAME;
}
