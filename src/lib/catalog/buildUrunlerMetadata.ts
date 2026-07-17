import type { Metadata } from 'next';
import type { PlainCategory } from '@/lib/serializeDb';
import { resolveCategoryFromSlug } from '@/lib/utils/resolveCategoryFromSlug';
import { generateCategoryPagePath } from '@/lib/utils/categoryUrls';
import { BLOG_SITE_URL, BLOG_EXPERIENCE_SINCE } from '@/lib/blog/trustCopy';

export type UrunlerMetadataInput = {
  slug?: string[];
  categories: PlainCategory[];
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * /urunler ve /urunler/{kategori} için title / description / canonical / OG.
 * Querystring canonical'a girmez.
 */
export function buildUrunlerMetadata({
  slug,
  categories,
}: UrunlerMetadataInput): Metadata {
  const { activeCategory, parentCategory } = resolveCategoryFromSlug(slug, categories);

  let title: string;
  let description: string;
  let path = '/urunler';

  if (activeCategory && parentCategory && activeCategory.Id !== parentCategory.Id) {
    const label = `${parentCategory.Name} ${activeCategory.Name}`;
    title = `${label} Yedek Parça | Yönel Oto`;
    description = `${label} için orijinal ve uyumlu yedek parçalar. ${BLOG_EXPERIENCE_SINCE} güvenle ve uygun fiyatla — Tokat merkez, Türkiye geneli teslimat.`;
    path = `/urunler/${generateCategoryPagePath(activeCategory, parentCategory)}`;
  } else if (activeCategory) {
    title = `${activeCategory.Name} Yedek Parça | Yönel Oto`;
    description = `${activeCategory.Name} yedek parçaları. Orijinal ve uyumlu alternatifler. ${BLOG_EXPERIENCE_SINCE} güvenilir tedarik — Tokat, Türkiye geneli.`;
    path = `/urunler/${generateCategoryPagePath(activeCategory, null)}`;
  } else if (parentCategory) {
    // Marka slug'ı var ama alt kategori seçilmemiş (ör. /urunler/iveco)
    title = `${parentCategory.Name} Yedek Parça | Yönel Oto`;
    description = `${parentCategory.Name} modelleri için yedek parça kataloğu. ${BLOG_EXPERIENCE_SINCE} İveco grubu ve diğer markalarda güvenilir tedarik — Tokat merkez.`;
    path = `/urunler/${generateCategoryPagePath(parentCategory, null)}`;
  } else {
    title = 'Yönel Oto Yedek Parça Kataloğu | İveco, Ducato, Foton, Karataş';
    description = `İveco Daily, Fiat Ducato, Foton ve Karataş traktör yedek parçaları. ${BLOG_EXPERIENCE_SINCE} güvenle ve uygun fiyatla — Tokat merkez, Türkiye geneli.`;
  }

  const canonical = `${BLOG_SITE_URL}${path}`;
  const desc = truncate(description, 160);

  return {
    title,
    description: desc,
    keywords: [
      activeCategory?.Name,
      parentCategory?.Name,
      'yedek parça',
      'İveco',
      'Tokat',
      'Türkiye geneli',
    ]
      .filter(Boolean)
      .join(', '),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      locale: 'tr_TR',
      type: 'website',
      siteName: 'Yönel Oto Yedek Parça',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
