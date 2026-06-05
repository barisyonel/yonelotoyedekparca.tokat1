import { MetadataRoute } from 'next';
import ProductsRepository from '@/lib/repositories/ProductsRepository';
import CategoriesRepository from '@/lib/repositories/CategoriesRepository';
import { collectCategoryPathsFromTree } from '@/lib/utils/categoryUrls';
import { getProductCanonicalUrl } from '@/lib/utils/productUrls';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.yonelotoyedekparca.com';
  const fallbackDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: fallbackDate, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/urunler`, lastModified: fallbackDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/hakkimizda`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/iletisim`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: fallbackDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/kvkk`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/gizlilik-politikasi`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/kullanim-kosullari`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/mesafeli-satis-sozlesmesi`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/iade-ve-degisim`, lastModified: fallbackDate, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/organic-seo`, lastModified: fallbackDate, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const blogPosts = [
    'iveco-daily-yedek-parca-secimi-rehberi',
    'fiat-ducato-motor-bakimi-ipuclari',
    'foton-traktor-yedek-parca-temini',
    'karatas-traktor-hidrolik-sistem-bakimi',
    'mutlu-aku-bakim-ve-kullanim-omru',
    'iveco-daily-fren-sistemi-bakimi',
    'orijinal-yan-sanayi-yedek-parca-farklari',
    'ducato-salincak-ve-rotil-degisimi',
    'traktor-filtre-bakimi-rehberi',
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: fallbackDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const categories = await CategoriesRepository.findAll();
    const categoryPaths = collectCategoryPathsFromTree(categories);

    categoryPages = categoryPaths.map((path) => ({
      url: `${baseUrl}/urunler/${path}`,
      lastModified: fallbackDate,
      changeFrequency: 'daily' as const,
      priority: path.includes('/') ? 0.9 : 0.85,
    }));

    const { products } = await ProductsRepository.findAll({ limit: 10000 });

    productPages = products
      .filter((product) => product.Id && product.Name)
      .map((product) => ({
        url: getProductCanonicalUrl(
          {
            Id: product.Id,
            Name: product.Name,
            CategoryName: product.CategoryName,
            SubCategoryName: product.SubCategoryName,
          },
          baseUrl,
        ),
        lastModified: product.CreatedAt ? new Date(product.CreatedAt) : fallbackDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    console.log(
      `✅ Sitemap: ${staticPages.length} statik, ${categoryPages.length} kategori, ${productPages.length} ürün, ${blogPages.length} blog`,
    );
  } catch (error) {
    console.error('❌ Sitemap oluşturulamadı:', error);
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
