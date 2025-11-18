import { MetadataRoute } from 'next';
import ProductsRepository from '@/lib/repositories/ProductsRepository';
import CategoriesRepository from '@/lib/repositories/CategoriesRepository';
import { slugify, generateProductUrl } from '@/lib/utils/slugify';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.yonelotoyedekparca.com';
  const currentDate = new Date('2025-11-18');

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kvkk`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kullanim-kosullari`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/mesafeli-satis-sozlesmesi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/iade-ve-degisim`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  let categoryPages: MetadataRoute.Sitemap = [];
  let productPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  // Blog posts - Static list (matches blog/page.tsx)
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

  blogPages = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  try {
    // Fetch all categories
    const categories = await CategoriesRepository.findAll();

    // Helper function to find parent category
    const findParentCategory = (categoryId: number): { Id: number; Name: string; SubCategories?: Array<{ Id: number; Name: string }> } | null => {
      for (const cat of categories) {
        if (cat.SubCategories) {
          for (const sub of cat.SubCategories) {
            if (sub.Id === categoryId) {
              return cat;
            }
          }
        }
      }
      return null;
    };

    // Generate category URLs
    const allCategories: Array<{ Id: number; Name: string; SubCategories?: Array<{ Id: number; Name: string }> }> = [];
    categories.forEach((cat) => {
      allCategories.push(cat);
      if (cat.SubCategories) {
        allCategories.push(...cat.SubCategories);
      }
    });

    categoryPages = allCategories.map((category) => {
      const parentCat = findParentCategory(category.Id);
      let url = `${baseUrl}/urunler/${slugify(category.Name)}`;
      
      // If this is a subcategory, include parent in URL
      if (parentCat) {
        url = `${baseUrl}/urunler/${slugify(parentCat.Name)}/${slugify(category.Name)}`;
      }

      return {
        url,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: parentCat ? 0.9 : 0.85,
      };
    });

    // Fetch all products
    const { products } = await ProductsRepository.findAll({ limit: 10000 });

    // Generate product URLs with SEO-friendly format (kategori/urun-id)
    productPages = products
      .filter((product) => product.Id && product.Name)
      .map((product) => ({
        url: `${baseUrl}/urunler/urun/${generateProductUrl(product)}`,
        lastModified: product.CreatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Sitemap generated: ${staticPages.length} static, ${categoryPages.length} categories, ${productPages.length} products, ${blogPages.length} blog posts`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Sitemap generation error:', error);
    }
    // Return at least static pages if database fails
  }

  // Combine all pages
  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}

