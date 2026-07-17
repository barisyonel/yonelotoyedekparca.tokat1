/**
 * Blog SEO / GEO — ortak güven ve konum mesajları.
 * Tecrübe: 45+ yıl (İveco grubu yedek parça odaklı).
 */

/** "45+ yıllık tecrübe" kalıbı */
export const BLOG_EXPERIENCE_LABEL = '45+ yıllık';
/** "45+ yıldır ..." cümle başı */
export const BLOG_EXPERIENCE_SINCE = '45+ yıldır';

export const BLOG_SITE_URL = 'https://www.yonelotoyedekparca.com';

export const BLOG_PHONE_DISPLAY = '0554 259 72 73';
export const BLOG_PHONE_E164 = '+905542597273';

export const BLOG_GEO = {
  city: 'Tokat',
  region: 'TR-60',
  country: 'TR',
  areaServed: 'Türkiye',
} as const;

/** Liste hero + CTA için kısa güven cümlesi */
export const BLOG_TRUST_SHORT =
  '45+ yıldır İveco grubunun tüm yedek parçalarını güvenle ve uygun fiyatla sunuyoruz. Tokat merkezliyiz; Türkiye geneline hızlı teslimat yapıyoruz.';

/** Yazı sonları / SEO blokları için genişletilmiş metin */
export const BLOG_TRUST_LONG =
  'Yönel Oto Yedek Parça olarak 45+ yıldır İveco grubu (İveco Daily, Eurobus ve ilgili ticari modeller) başta olmak üzere Fiat Ducato, Foton, Karataş traktör ve Mutlu akü yedek parçalarını güvenilir kalite ve uygun fiyatla satıyoruz. Mağazamız Tokat’tadır; Türkiye’nin her yerine kargo ile hizmet veriyoruz.';

export const BLOG_KEYWORDS_CORE = [
  'İveco yedek parça',
  'İveco Daily yedek parça',
  'İveco grubu yedek parça',
  'Tokat yedek parça',
  'Türkiye geneli yedek parça',
  'uygun fiyat yedek parça',
  'Fiat Ducato yedek parça',
  'Foton traktör yedek parça',
  'Karataş traktör yedek parça',
].join(', ');

export function blogOrganizationSchema(logoUrl: string) {
  return {
    '@type': 'Organization',
    name: 'Yönel Oto Yedek Parça',
    url: BLOG_SITE_URL,
    telephone: BLOG_PHONE_E164,
    logo: {
      '@type': 'ImageObject',
      url: logoUrl,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: BLOG_GEO.city,
      addressRegion: BLOG_GEO.region,
      addressCountry: BLOG_GEO.country,
    },
    areaServed: {
      '@type': 'Country',
      name: BLOG_GEO.areaServed,
    },
  };
}

export function blogLocalBusinessSchema(logoUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    name: 'Yönel Oto Yedek Parça',
    description: BLOG_TRUST_LONG,
    url: BLOG_SITE_URL,
    telephone: BLOG_PHONE_E164,
    image: logoUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BLOG_GEO.city,
      addressRegion: BLOG_GEO.region,
      addressCountry: BLOG_GEO.country,
    },
    areaServed: [
      { '@type': 'City', name: BLOG_GEO.city },
      { '@type': 'Country', name: BLOG_GEO.areaServed },
    ],
    knowsAbout: [
      'İveco Daily yedek parça',
      'İveco grubu yedek parça',
      'Fiat Ducato yedek parça',
      'Foton traktör yedek parça',
      'Karataş traktör yedek parça',
      'Mutlu akü',
    ],
  };
}

/** Cloudinary veya göreli path → schema image URL */
export function blogImageAbsoluteUrl(image: string): string {
  if (!image) return `${BLOG_SITE_URL}/`;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${BLOG_SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}
