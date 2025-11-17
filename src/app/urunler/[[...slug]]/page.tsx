import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import nextDynamic from 'next/dynamic';
import ProductsRepository from '@/lib/repositories/ProductsRepository';
import CategoriesRepository from '@/lib/repositories/CategoriesRepository';
import SliderImagesRepository from '@/lib/repositories/SliderImagesRepository';
import Breadcrumb from '@/components/Breadcrumb';
import ProductsHeader from '@/app/products/ProductsHeader';
import { Metadata } from 'next';
import { slugify, generateProductUrl } from '@/lib/utils/slugify';
import { notFound } from 'next/navigation';
import { SliderImage } from '@/lib/models/SliderImage';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import ClientOnly from '@/components/ClientOnly';

// Dynamic imports for better code splitting
const ProductCard = nextDynamic(() => import('@/app/products/ProductCard'), {
  ssr: true,
});
const ProductsFilter = nextDynamic(() => import('@/app/products/ProductsFilter'), {
  ssr: false,
});
const ProductsPagination = nextDynamic(() => import('@/app/products/ProductsPagination'), {
  ssr: true,
});
const ProductsToolbar = nextDynamic(() => import('@/app/products/ProductsToolbar'), {
  ssr: true,
});
const ScrollToTop = nextDynamic(() => import('@/components/ScrollToTop'), {
  ssr: false,
});
const ProductsCarousel = nextDynamic(() => import('@/components/ProductsCarousel'), {
  ssr: true,
  loading: () => <div style={{ height: 'clamp(280px, 35vh, 400px)', backgroundColor: '#f3f4f6' }} />,
});
const ProductsInfoCards = nextDynamic(() => import('@/components/ProductsInfoCards'), {
  ssr: false,
});

// Force dynamic rendering to prevent build-time database connection
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Metadata for SEO - Optimized lengths (Title: max 580px ≈ 55-60 chars, Description: max 1000px ≈ 155 chars)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let title = 'Yedek Parça Kataloğu - İveco, Ducato, Foton, Karataş - Yönel Oto';
  let description = 'İveco Daily, Fiat Ducato, Foton ve Karataş Traktör yedek parçaları, Mutlu Akü. Orijinal parça, hızlı teslimat.';
  let keywords = 'iveco daily 120-14 yedek parça, iveco 85-12, iveco 65-9, iveco 50nc, iveco eurobus, fiat ducato 2.3, fiat ducato 3.0, foton traktör, karataş traktör, mutlu akü, orijinal yedek parça, online yedek parça, türkiye geneli yedek parça, tüm türkiye yedek parça';
  let canonicalUrl = 'https://www.yonelotoyedekparca.com/urunler';

  if (params.slug && params.slug.length > 0) {
    const parentSlug = params.slug[0];
    const subSlug = params.slug[1];
    const categories = await CategoriesRepository.findAll();
    
    for (const cat of categories) {
      if (slugify(cat.Name) === parentSlug) {
        if (subSlug && cat.SubCategories) {
          // Alt kategori varsa
          for (const sub of cat.SubCategories) {
            if (slugify(sub.Name) === subSlug) {
              // Optimize title length (max 580px ≈ 55-60 chars)
              const categoryTitle = `${cat.Name} ${sub.Name}`;
              title = categoryTitle.length > 40 
                ? `${categoryTitle.substring(0, 40)}... Yedek Parça - Yönel Oto`
                : `${categoryTitle} Yedek Parçaları - Yönel Oto`;
              // Optimize description length (max 1000px ≈ 155 chars)
              description = `${cat.Name} ${sub.Name} yedek parça. Orijinal parça, hızlı teslimat.`;
              keywords = `${cat.Name.toLowerCase()} ${sub.Name.toLowerCase()} yedek parça, ${cat.Name.toLowerCase()} ${sub.Name.toLowerCase()} orijinal parça, ${cat.Name.toLowerCase()} ${sub.Name.toLowerCase()} online, türkiye geneli ${cat.Name.toLowerCase()} ${sub.Name.toLowerCase()}, tüm türkiye ${cat.Name.toLowerCase()} ${sub.Name.toLowerCase()} yedek parça`;
              canonicalUrl = `https://www.yonelotoyedekparca.com/urunler/${parentSlug}/${subSlug}`;
              break;
            }
          }
        } else {
          // Sadece ana kategori
          const categoryName = cat.Name;
          // İveco için özel title - Optimized length
          if (categoryName.toLowerCase().includes('iveco')) {
            title = `İveco Daily Yedek Parçaları - 120-14, 85-12, 50NC - Yönel Oto`;
            description = `İveco Daily 120-14, 85-12, 65-9, 50NC modelleri için orijinal yedek parça. Hızlı teslimat, Türkiye geneli servis.`;
            keywords = 'iveco daily 120-14 yedek parça, iveco 85-12 yedek parça, iveco 65-9 yedek parça, iveco 50nc yedek parça, iveco eurobus yedek parça, iveco daily fren balata, iveco motor parçaları, iveco daily online, türkiye geneli iveco daily, tüm türkiye iveco yedek parça';
          } else if (categoryName.toLowerCase().includes('ducato') || categoryName.toLowerCase().includes('fiat')) {
            title = `Fiat Ducato 2.3 ve 3.0 Yedek Parçaları - Yönel Oto`;
            description = `Fiat Ducato 2.3 ve 3.0 motor yedek parçaları. Orijinal Ducato parça, hızlı teslimat.`;
            keywords = 'fiat ducato 2.3 yedek parça, fiat ducato 3.0 yedek parça, ducato yedek parça, ducato fren balata, ducato motor parçaları, ducato online, türkiye geneli ducato, tüm türkiye ducato yedek parça';
          } else if (categoryName.toLowerCase().includes('foton')) {
            title = `Foton Traktör Yedek Parçaları - Yönel Oto`;
            description = `Foton Traktör yedek parçaları. Orijinal Foton traktör parçaları, hızlı teslimat. Türkiye geneli servis.`;
            keywords = 'foton traktör yedek parça, foton traktör parçaları, foton traktör aksesuar, foton traktör online, türkiye geneli foton traktör, tüm türkiye foton traktör yedek parça';
          } else if (categoryName.toLowerCase().includes('karataş')) {
            title = `Karataş Traktör Yedek Parçaları - Yönel Oto`;
            description = `Karataş Traktör yedek parçaları. Orijinal Karataş traktör parçaları, hızlı teslimat.`;
            keywords = 'karataş traktör yedek parça, karataş traktör parçaları, karataş traktör aksesuar, karataş traktör online, türkiye geneli karataş traktör, tüm türkiye karataş traktör yedek parça';
          } else if (categoryName.toLowerCase().includes('mutlu')) {
            title = `Mutlu Akü Çeşitleri - Yönel Oto`;
            description = `Mutlu Akü çeşitleri. Online akü satışı, hızlı teslimat. Araç ve traktör aküleri.`;
            keywords = 'mutlu akü, mutlu akü fiyat, mutlu akü çeşitleri, mutlu akü online, türkiye geneli mutlu akü, tüm türkiye mutlu akü';
          } else {
            // Optimize title length for other categories
            const categoryTitle = categoryName.length > 40 
              ? `${categoryName.substring(0, 40)}...`
              : categoryName;
            title = `${categoryTitle} Yedek Parçaları - Yönel Oto`;
            description = `${categoryName} yedek parça ürünleri. Orijinal parça, hızlı teslimat.`;
            keywords = `${categoryName.toLowerCase()} yedek parça, ${categoryName.toLowerCase()} orijinal parça, ${categoryName.toLowerCase()} online, türkiye geneli ${categoryName.toLowerCase()}, tüm türkiye ${categoryName.toLowerCase()} yedek parça`;
          }
          canonicalUrl = `https://www.yonelotoyedekparca.com/urunler/${parentSlug}`;
        }
        break;
      }
    }
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image.jpg'],
    },
  };
}


export default async function UrunlerPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page as string || '1');
  const search = searchParams.search as string || '';
  const sort = searchParams.sort as string || 'newest';
  const limit = parseInt(searchParams.limit as string || '12');

  // Fetch categories with error handling (hydration fix)
  let categories: Category[] = [];
  try {
    categories = await CategoriesRepository.findAll();
  } catch (error) {
    console.error('Categories fetch error:', error);
    categories = [];
  }
  
  // Slug'dan kategori bul
  let categoryId: number | undefined = undefined;
  let activeCategory = null;
  let parentCategory = null; // Ana kategoriyi takip etmek için
  
  if (params.slug && params.slug.length > 0 && categories.length > 0) {
    // URL yapısı: /urunler/parent-slug veya /urunler/parent-slug/sub-slug
    const parentSlug = params.slug[0]; // İlk segment ana kategori slug'ı
    const subSlug = params.slug[1]; // İkinci segment alt kategori slug'ı (varsa)
    
    // Debug: Log all categories and their slugs
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Looking for slug:', parentSlug);
      console.log('📋 Available categories:');
      categories.forEach(cat => {
        console.log(`  - "${cat.Name}" → slug: "${slugify(cat.Name)}"`);
        if (cat.SubCategories) {
          cat.SubCategories.forEach(sub => {
            console.log(`    └─ "${sub.Name}" → slug: "${slugify(sub.Name)}"`);
          });
        }
      });
    }
    
    // Önce ana kategoriyi bul - case-insensitive ve fuzzy matching
    for (const cat of categories) {
      const catSlug = slugify(cat.Name);
      const catNameLower = cat.Name.toLowerCase();
      
      // Exact match
      if (catSlug === parentSlug) {
        parentCategory = cat;
        
        // Eğer alt kategori slug'ı varsa onu ara
        if (subSlug && cat.SubCategories) {
          for (const sub of cat.SubCategories) {
            const subCatSlug = slugify(sub.Name);
            
            if (subCatSlug === subSlug) {
              categoryId = sub.Id;
              activeCategory = sub;
              break;
            }
          }
          
          // Alt kategori bulunamadıysa 404
          if (!activeCategory) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ Sub-category not found for slug:', subSlug);
            }
            notFound();
          }
        } else {
          // Alt kategori slug'ı yoksa, ana kategori aktif
          categoryId = cat.Id;
          activeCategory = cat;
        }
        break;
      }
      
      // Fuzzy match: Check if category name contains the slug keywords
      // e.g., "iveco-daily" matches "İveco Daily" or "Iveco Daily Yedek Parçaları"
      const slugKeywords = parentSlug.split('-').filter(k => k.length > 2);
      const allKeywordsMatch = slugKeywords.every(keyword => 
        catNameLower.includes(keyword) || catSlug.includes(keyword)
      );
      
      if (allKeywordsMatch && slugKeywords.length > 0) {
        // Special cases for known brands - URL format: /urunler/parent/sub (e.g., /urunler/iveco/daily)
        // For single-word slugs (foton, karatas), match directly
        // For multi-word slugs, parentSlug should match parent category (e.g., "iveco" for /urunler/iveco/daily)
        if (parentSlug === 'iveco' && subSlug === 'daily' && (catNameLower.includes('iveco'))) {
          // Look for "Daily" subcategory under "Iveco" parent
          if (cat.SubCategories) {
            for (const sub of cat.SubCategories) {
              const subCatSlug = slugify(sub.Name);
              if (subCatSlug === 'daily' || sub.Name.toLowerCase().includes('daily')) {
                parentCategory = cat;
                categoryId = sub.Id;
                activeCategory = sub;
                if (process.env.NODE_ENV === 'development') {
                  console.log('✅ Matched via fuzzy match:', cat.Name, '→', sub.Name);
                }
                break;
              }
            }
            if (activeCategory) break;
          }
          // If no subcategory found, use parent category
          if (!activeCategory && catNameLower.includes('iveco')) {
            parentCategory = cat;
            categoryId = cat.Id;
            activeCategory = cat;
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Matched via fuzzy match (parent only):', cat.Name);
            }
            break;
          }
        } else if (parentSlug === 'fiat' && subSlug === 'ducato' && (catNameLower.includes('fiat') || catNameLower.includes('ducato'))) {
          if (cat.SubCategories) {
            for (const sub of cat.SubCategories) {
              const subCatSlug = slugify(sub.Name);
              if (subCatSlug === 'ducato' || sub.Name.toLowerCase().includes('ducato')) {
                parentCategory = cat;
                categoryId = sub.Id;
                activeCategory = sub;
                if (process.env.NODE_ENV === 'development') {
                  console.log('✅ Matched via fuzzy match:', cat.Name, '→', sub.Name);
                }
                break;
              }
            }
            if (activeCategory) break;
          }
          if (!activeCategory && (catNameLower.includes('fiat') || catNameLower.includes('ducato'))) {
            parentCategory = cat;
            categoryId = cat.Id;
            activeCategory = cat;
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Matched via fuzzy match (parent only):', cat.Name);
            }
            break;
          }
        } else if (parentSlug === 'foton' && catNameLower.includes('foton')) {
          parentCategory = cat;
          categoryId = cat.Id;
          activeCategory = cat;
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Matched via fuzzy match:', cat.Name);
          }
          break;
        } else if (parentSlug === 'karatas' && (catNameLower.includes('karataş') || catNameLower.includes('karatas'))) {
          parentCategory = cat;
          categoryId = cat.Id;
          activeCategory = cat;
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Matched via fuzzy match:', cat.Name);
          }
          break;
        } else if (parentSlug === 'mutlu' && subSlug === 'aku' && (catNameLower.includes('mutlu'))) {
          if (cat.SubCategories) {
            for (const sub of cat.SubCategories) {
              const subCatSlug = slugify(sub.Name);
              if (subCatSlug === 'aku' || sub.Name.toLowerCase().includes('akü') || sub.Name.toLowerCase().includes('aku')) {
                parentCategory = cat;
                categoryId = sub.Id;
                activeCategory = sub;
                if (process.env.NODE_ENV === 'development') {
                  console.log('✅ Matched via fuzzy match:', cat.Name, '→', sub.Name);
                }
                break;
              }
            }
            if (activeCategory) break;
          }
          if (!activeCategory && catNameLower.includes('mutlu')) {
            parentCategory = cat;
            categoryId = cat.Id;
            activeCategory = cat;
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Matched via fuzzy match (parent only):', cat.Name);
            }
            break;
          }
        }
      }
    }
    
    // Ana kategori bulunamadıysa 404
    if (!parentCategory) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Category not found for slug:', parentSlug);
        console.error('Available slugs:', categories.map(c => slugify(c.Name)));
      }
      notFound();
    }
  }

  // Fetch data with error handling
  let products: Product[] = [];
  let total = 0;
  try {
    const result = await ProductsRepository.findAll({
      page,
      limit,
      search,
      categoryId,
      sort,
    });
    products = result.products;
    total = result.total;
  } catch (error) {
    console.error('Products fetch error:', error);
    products = [];
    total = 0;
  }

  // Fetch sliders with error handling
  let sliders: SliderImage[] = [];
  try {
    sliders = await SliderImagesRepository.findAll();
  } catch (error) {
    console.error('Sliders fetch error:', error);
    sliders = [];
  }
  
  const totalPages = Math.ceil(total / limit);

  // Breadcrumb Schema for Google
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: 'https://www.yonelotoyedekparca.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Ürünler',
      item: 'https://www.yonelotoyedekparca.com/urunler',
    },
  ];

  if (parentCategory) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: parentCategory.Name,
      item: `https://www.yonelotoyedekparca.com/urunler/${slugify(parentCategory.Name)}`,
    });
  }

  if (activeCategory) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: parentCategory ? 4 : 3,
      name: activeCategory.Name,
      item: parentCategory 
        ? `https://www.yonelotoyedekparca.com/urunler/${slugify(parentCategory.Name)}/${slugify(activeCategory.Name)}`
        : `https://www.yonelotoyedekparca.com/urunler/${slugify(activeCategory.Name)}`,
    });
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeCategory ? activeCategory.Name : 'Ürünler',
    description: 'Yonel Otomotiv yedek parça ürünleri',
    url: `https://www.yonelotoyedekparca.com/urunler${activeCategory ? `/${slugify(activeCategory.Name)}` : ''}`,
    numberOfItems: total,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.Name,
        description: product.Description || product.Name,
        url: `https://www.yonelotoyedekparca.com/urunler/urun/${generateProductUrl(product)}`,
      },
    })),
  };

  return (
    <div>
      {/* Breadcrumb Schema for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Collection Page Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Box
        sx={{
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
          px: { xs: '2%', sm: '3%', md: '2%', lg: '1.5%', xl: '1%' },
          py: { xs: '2rem', sm: '2.5rem', md: '3rem' },
        }}
      >
        {/* Breadcrumb */}
        <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
          <Breadcrumb
            items={[
              { label: 'Ürünler', href: '/urunler' },
              ...(parentCategory ? [{ label: parentCategory.Name, href: `/urunler/${slugify(parentCategory.Name)}` }] : []),
              ...(activeCategory ? [{ label: activeCategory.Name }] : []),
            ]}
          />
        </Box>

        {/* Header with title - H1 for SEO */}
        <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
          <ProductsHeader activeCategory={activeCategory} />
        </Box>

        {/* Products Carousel - Admin tarafından eklenen slider görselleri */}
        <Box sx={{ mb: { xs: '2rem', md: '2.5rem' } }}>
          <ClientOnly>
            <ProductsCarousel sliders={sliders} />
          </ClientOnly>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '2rem', md: '2.5%', lg: '2%', xl: '1.5%' },
            width: '100%',
          }}
        >
          {/* Sidebar - Filters (Desktop) */}
          <Box
            sx={{
              width: { xs: '100%', md: '22%', lg: '20%', xl: '18%' },
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <ClientOnly>
              <ProductsFilter categories={categories} activeCategory={activeCategory} />
            </ClientOnly>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              width: { xs: '100%', md: 'calc(78% - 2.5%)', lg: 'calc(80% - 2%)', xl: 'calc(82% - 1.5%)' },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {/* Toolbar - Sort & Limit Controls + Mobile Filter Button */}
            <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
              <ProductsToolbar categories={categories} activeCategory={activeCategory} />
            </Box>

            {/* Product Grid */}
            {products.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: { xs: '4rem', md: '6rem' },
                  bgcolor: '#f9f9f9',
                  borderRadius: 2,
                  px: '2%',
                }}
              >
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  Ürün bulunamadı
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  {search
                    ? 'Arama kriterlerinize uygun ürün bulunmamaktadır.'
                    : 'Bu kategoride henüz ürün bulunmamaktadır.'}
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                      xl: 'repeat(4, 1fr)',
                    },
                    gap: { xs: '1.5rem', sm: '1.8rem', md: '1.8rem', lg: '2rem', xl: '2rem' },
                    width: '100%',
                  }}
                >
                  {products.map((product) => (
                    <Box key={product.Id}>
                      <ProductCard product={product} />
                    </Box>
                  ))}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box
                    sx={{
                      mt: { xs: '3rem', md: '4rem' },
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <ProductsPagination 
                      currentPage={page} 
                      totalPages={totalPages}
                      categorySlug={
                        activeCategory && parentCategory
                          ? `${slugify(parentCategory.Name)}/${slugify(activeCategory.Name)}`
                          : activeCategory
                          ? slugify(activeCategory.Name)
                          : undefined
                      }
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* SEO Content Section - 250+ words for better SEO */}
        <Box 
          sx={{ 
            mt: { xs: '3rem', md: '4rem' },
            mb: { xs: '2rem', md: '3rem' },
            bgcolor: '#f9fafb',
            borderRadius: 3,
            p: { xs: '1.5rem', md: '2.5rem', lg: '3rem' },
          }}
        >
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontSize: { xs: '1.5rem', md: '2rem', lg: '2.25rem' },
              fontWeight: 700,
              color: '#1a1a1a',
              mb: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {activeCategory 
              ? `${activeCategory.Name} Yedek Parçaları Hakkında`
              : 'Yedek Parça Kataloğumuz Hakkında'}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: '1.5rem', md: '2rem' },
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: '#4a4a4a',
              }}
            >
              {activeCategory && activeCategory.Name.toLowerCase().includes('iveco') ? (
                <>
                  <strong>İveco Daily</strong> araç sahipleri için en kapsamlı yedek parça stoğuna sahibiz. 
                  <strong> İveco Daily 120-14, 85-12, 65-9, 50NC</strong> ve <strong>Eurobus</strong> modelleri için motor aksamı, 
                  şanzıman, diferansiyel, fren sistemi, elektrik parçaları ve kaporta ürünlerinde hem orijinal hem de kaliteli muadil ürünler sunmaktayız. 
                  İveco Daily yedek parça kategorisinde; debriyaj ve volant, fren balata ve diski, yağ ve hava filtresi, yakıt filtresi, alternatör, 
                  marş motoru, şarj dinamosu, su pompası, termostat gibi tüm bakım ürünleri depolarımızda mevcuttur. 
                  50+ yıllık tecrübemizle, maksimum 2 iş günü içerisinde adresinize teslim ediyoruz.
                </>
              ) : activeCategory && (activeCategory.Name.toLowerCase().includes('ducato') || activeCategory.Name.toLowerCase().includes('fiat')) ? (
                <>
                  <strong>Fiat Ducato</strong> ticari araçlarınız için en kaliteli yedek parçaları sunuyoruz. 
                  <strong> Fiat Ducato 2.3 MultiJet</strong> ve <strong>Fiat Ducato 3.0 MultiJet</strong> motor modellerine özel 
                  orijinal ve yan sanayi yedek parçalarımız bulunmaktadır. Ducato fren balata, motor yağ filtresi, hava filtresi, 
                  polen filtresi, su pompası, debriyaj seti, alternatör ve marş motoru gibi kritik parçalarda güvenle alışveriş yapabilirsiniz. 
                  Tüm Türkiye&apos;ye online satış ve hızlı teslimat garantisi ile hizmetinizdeyiz. Orijinal Ducato yedek parça tercihinizde 
                  profesyonel destek ve kalite garantisi sunuyoruz.
                </>
              ) : activeCategory && activeCategory.Name.toLowerCase().includes('foton') ? (
                <>
                  <strong>Foton Traktör</strong> sahipleri için en kapsamlı yedek parça stoğunu sunuyoruz. 
                  Tarımda güvenilirlik ve dayanıklılığıyla öne çıkan Foton traktörleriniz için motor parçaları, hidrolik sistem elemanları, 
                  şanzıman aksam, fren grubu ve elektrik sistemleri başta olmak üzere tüm yedek parça kategorilerinde hizmet veriyoruz. 
                  Foton traktör yedek parça kategorisinde; piston ve piston segmanları, silindir kapağı ve contaları, enjektör ve yakıt pompaları, 
                  hidrolik pompa ve motorlar, hidrolik silindir ve pistonlar, debriyaj balata ve baskı, şanzıman dişli takımları gibi tüm kritik 
                  parçalar stoklarımızda mevcuttur. Tarımda kesintisiz üretim için güvenilir parçalar.
                </>
              ) : activeCategory && activeCategory.Name.toLowerCase().includes('karataş') ? (
                <>
                  <strong>Karataş Traktör</strong>, Türkiye&apos;nin yerli üretim traktör markalarından biridir. 
                  Karataş traktörleriniz için orijinal ve yan sanayi yedek parçalarında uzman kadromuz ve geniş stoklarımızla hizmetinizdeyiz. 
                  Tarla çalışmalarınızda kesintisiz üretim için ihtiyaç duyduğunuz tüm yedek parçaları hızlı ve güvenilir şekilde tedarik ediyoruz. 
                  Karataş traktör yedek parça kategorisinde; motor revizyonu, şanzıman tamiri, hidrolik sistem bakımı, fren sistemi yenileme ve elektrik 
                  tesisatı onarımı için ihtiyaç duyacağınız tüm parçalar stoklarımızda mevcuttur. Yerli üretimin gücüyle, uygun fiyat avantajı ve hızlı teslimat garantisi sunuyoruz.
                </>
              ) : activeCategory && activeCategory.Name.toLowerCase().includes('mutlu') ? (
                <>
                  <strong>Mutlu Akü</strong> yetkili satıcısı olarak, otomobil, hafif ticari, ağır vasıta ve traktör aküsü çeşitlerinde 
                  en uygun fiyatları sunuyoruz. 45 Ah&apos;dan 200 Ah&apos;a kadar farklı kapasitelerde Mutlu akü stoğumuz mevcuttur. 
                  Araç ve traktörleriniz için güvenilir enerji çözümleri sunan Mutlu akü, uzun ömürlü ve yüksek performanslı akü teknolojisi ile 
                  öne çıkmaktadır. Tüm Türkiye&apos;ye online akü satışı ve hızlı teslimat ile hizmetinizdeyiz. 
                  Mutlu akü fiyatları ve kampanyalarımız için bizi arayabilirsiniz. Orijinal Mutlu akü garantisi ile güvenle alışveriş yapabilirsiniz.
                </>
              ) : (
                <>
                  <strong>Yönel Oto Yedek Parça</strong> olarak, <strong>İveco Daily</strong> (120-14, 85-12, 65-9, 50NC, Eurobus), 
                  <strong> Fiat Ducato</strong> (2.3, 3.0), <strong>Foton Traktör</strong>, <strong>Karataş Traktör</strong> yedek parçaları ve 
                  <strong> Mutlu Akü</strong> satışında Türkiye&apos;nin güvenilir adresiyiz. 50+ yıllık tecrübemizle, 
                  orijinal ve kaliteli yan sanayi ürünlerini tüm Türkiye&apos;ye hızlı teslimat ile sunuyoruz. 
                  Yedek parça katalogumuzda; fren sistemleri, motor yedek parçaları, filtre grubu, elektrik sistemleri, yağlar ve balata kampana 
                  gibi tüm kategori seçeneklerinde geniş ürün yelpazesi bulunmaktadır. Orijinal ürün garantisi, aynı gün kargo ve uzman destek 
                  garantisi ile hizmetinizdeyiz. Online yedek parça satışı konusunda Türkiye&apos;nin önde gelen firmalarından biri olarak, 
                  müşteri memnuniyetini ön planda tutuyoruz.
                </>
              )}
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.8,
                color: '#4a4a4a',
              }}
            >
              {activeCategory ? (
                <>
                  Kategorimizdeki ürünlerimiz, <strong>orijinal ürün garantisi</strong> ile satılmaktadır. 
                  Tüm Türkiye&apos;ye <strong>aynı gün kargo</strong> hizmeti sunuyoruz. 
                  Ürünlerimiz hakkında detaylı bilgi almak için WhatsApp hattımızdan veya telefon numaramızdan iletişime geçebilirsiniz. 
                  <strong> 50+ yıllık tecrübemiz</strong> ile, aradığınız yedek parçayı en doğru şekilde bulmanıza yardımcı oluyoruz.
                </>
              ) : (
                <>
                  Katalogumuzdaki tüm ürünler, <strong>orijinal ürün garantisi</strong> ile satılmaktadır. 
                  <strong> İveco Daily</strong>, <strong>Fiat Ducato</strong>, <strong>Foton</strong> ve <strong>Karataş Traktör</strong> yedek parçaları 
                  için Türkiye&apos;nin en geniş stoklarına sahibiz. Tüm Türkiye&apos;ye <strong>aynı gün kargo</strong> hizmeti sunuyoruz. 
                  Ürünlerimiz hakkında detaylı bilgi almak için WhatsApp hattımızdan veya telefon numaramızdan iletişime geçebilirsiniz. 
                  <strong> 50+ yıllık tecrübemiz</strong> ile, aradığınız yedek parçayı en doğru şekilde bulmanıza yardımcı oluyoruz.
                </>
              )}
            </Typography>
          </Box>
        </Box>

        {/* Info Cards - Alt bilgi kartları */}
        <Box sx={{ mt: { xs: '3rem', md: '4rem' } }}>
          <ClientOnly>
            <ProductsInfoCards />
          </ClientOnly>
        </Box>

        {/* Scroll to Top Button */}
        <ClientOnly>
          <ScrollToTop />
        </ClientOnly>
      </Box>
    </div>
  );
}
