/**
 * Ana sayfa hero slider — boş/hatalı buton linklerini kategori URL'lerine tamamlar.
 */

export type SliderLinkFields = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
};

const DEFAULT_LINK = '/urunler';
const DEFAULT_CTA = 'Ürünleri İncele';

/** Başlık/alt başlıktan katalog yolu tahmin et */
export function inferCatalogPathFromSliderText(text: string): string | null {
  const t = text.toLocaleLowerCase('tr-TR');

  if (t.includes('mutlu') || t.includes('akü') || t.includes('aku')) {
    return '/urunler/mutlu/aku';
  }
  if (t.includes('ducato') || (t.includes('fiat') && !t.includes('iveco'))) {
    return '/urunler/fiat/ducato';
  }
  if (t.includes('daily') || t.includes('eurobus') || t.includes('iveco')) {
    if (t.includes('120')) return '/urunler/iveco/120-14';
    if (t.includes('85-12') || t.includes('85 12')) return '/urunler/iveco/85-12';
    if (t.includes('65-9') || t.includes('65 9')) return '/urunler/iveco/65-9';
    if (t.includes('50nc') || t.includes('50 nc')) return '/urunler/iveco/50nc';
    return '/urunler/iveco/daily';
  }
  if (t.includes('foton') && t.includes('karataş')) {
    return '/urunler/foton';
  }
  if (t.includes('foton')) {
    return '/urunler/foton';
  }
  if (t.includes('karataş') || t.includes('karatas')) {
    return '/urunler/karatas';
  }

  return null;
}

function isUsableInternalLink(link: string): boolean {
  if (!link || link === '/' || link === '#') return false;
  // Harici http(s) veya site içi /path
  if (link.startsWith('http://') || link.startsWith('https://')) return true;
  if (link.startsWith('/')) return true;
  return false;
}

/** Link ile slayt metni aynı markayı mı hedefliyor? */
function linkMatchesSliderContent(link: string, text: string): boolean {
  const t = text.toLocaleLowerCase('tr-TR');
  const l = link.toLocaleLowerCase('tr-TR');

  if (l.includes('/foton') && !t.includes('foton')) return false;
  if (l.includes('/karatas') && !t.includes('karataş') && !t.includes('karatas')) return false;
  if (l.includes('/mutlu') && !t.includes('mutlu') && !t.includes('akü') && !t.includes('aku')) {
    return false;
  }
  if (l.includes('/fiat') && !t.includes('fiat') && !t.includes('ducato')) return false;
  if (l.includes('/iveco') && !t.includes('iveco') && !t.includes('daily') && !t.includes('eurobus')) {
    return false;
  }
  return true;
}

export function resolveHomeSliderCta(slide: SliderLinkFields): {
  buttonText: string;
  buttonLink: string;
} {
  const blob = [slide.title, slide.subtitle, slide.description].filter(Boolean).join(' ');
  const inferred = inferCatalogPathFromSliderText(blob);

  let buttonLink = (slide.buttonLink || '').trim();
  if (!isUsableInternalLink(buttonLink)) {
    buttonLink = inferred || DEFAULT_LINK;
  } else if (
    buttonLink === '/urunler' &&
    inferred &&
    inferred !== '/urunler'
  ) {
    // Genel /urunler yerine markaya özel yol daha iyi
    buttonLink = inferred;
  } else if (inferred && !linkMatchesSliderContent(buttonLink, blob)) {
    // Örn. Foton slaytı yanlışlıkla /urunler/karatas'a bağlıysa düzelt
    buttonLink = inferred;
  }

  let buttonText = (slide.buttonText || '').trim();
  if (!buttonText) {
    buttonText = DEFAULT_CTA;
  }

  return { buttonText, buttonLink };
}
