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
import Link from 'next/link';

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
  let title = 'İveco, Fiat, Foton ve Karataş Yedek Parça Kataloğu | Yönel Oto';
  let description = 'İveco Daily, Fiat Ducato, Foton, Karataş Traktör ve Mutlu Akü yedek parça kataloğu. Orijinal ve yan sanayi parça, hızlı teslimat, Türkiye geneli kargo hizmeti. 50+ yıllık tecrübe.';
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
            title = 'İveco Daily Yedek Parça Kataloğu | Yönel Oto';
            description = 'İveco Daily 120-14, 85-12, 65-9, 50NC modelleri için orijinal yedek parça. Hızlı teslimat, Türkiye geneli servis.';
            keywords = 'iveco daily 120-14 yedek parça, iveco 85-12 yedek parça, iveco 65-9 yedek parça, iveco 50nc yedek parça, iveco eurobus yedek parça, iveco daily fren balata, iveco motor parçaları, iveco daily online, türkiye geneli iveco daily, tüm türkiye iveco yedek parça';
          } else if (categoryName.toLowerCase().includes('ducato') || categoryName.toLowerCase().includes('fiat')) {
            title = 'Fiat Ducato 2.3 & 3.0 Yedek Parçaları | Yönel Oto';
            description = 'Fiat Ducato 2.3 ve 3.0 motor yedek parçaları. Orijinal Ducato parça, hızlı teslimat.';
            keywords = 'fiat ducato 2.3 yedek parça, fiat ducato 3.0 yedek parça, ducato yedek parça, ducato fren balata, ducato motor parçaları, ducato online, türkiye geneli ducato, tüm türkiye ducato yedek parça';
          } else if (categoryName.toLowerCase().includes('foton')) {
            title = 'Foton Traktör Yedek Parça Kataloğu | Yönel Oto';
            description = 'Foton Traktör yedek parçaları. Orijinal Foton traktör parçaları, hızlı teslimat. Türkiye geneli servis.';
            keywords = 'foton traktör yedek parça, foton traktör parçaları, foton traktör aksesuar, foton traktör online, türkiye geneli foton traktör, tüm türkiye foton traktör yedek parça';
          } else if (categoryName.toLowerCase().includes('karataş')) {
            title = 'Karataş Traktör Yedek Parça Kataloğu | Yönel Oto';
            description = 'Karataş Traktör yedek parçaları. Orijinal Karataş traktör parçaları, hızlı teslimat.';
            keywords = 'karataş traktör yedek parça, karataş traktör parçaları, karataş traktör aksesuar, karataş traktör online, türkiye geneli karataş traktör, tüm türkiye karataş traktör yedek parça';
          } else if (categoryName.toLowerCase().includes('mutlu')) {
            title = 'Mutlu Akü Çeşitleri ve Fiyatları | Yönel Oto';
            description = 'Mutlu Akü çeşitleri. Online akü satışı, hızlı teslimat. Araç ve traktör aküleri.';
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
  let sliders: SliderImage[] = [];
  try {
    const [productResult, sliderResult] = await Promise.all([
      ProductsRepository.findAll({
      page,
      limit,
      search,
      categoryId,
      sort,
      }),
      SliderImagesRepository.findAll(),
    ]);
    products = productResult.products;
    total = productResult.total;
    sliders = sliderResult;
  } catch (error) {
    console.error('Data fetch error:', error);
    products = [];
    total = 0;
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
          <ProductsHeader activeCategory={activeCategory} searchQuery={search || undefined} />
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
            {/* SEO Rich Content - Metin-kod oranını artırmak için */}
            <Box
              component="section"
              sx={{
                mb: { xs: '1.5rem', md: '2rem' },
                p: { xs: '1rem', md: '1.5rem' },
                bgcolor: '#f9fafb',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
              }}
            >
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.8,
                  color: '#374151',
                  mb: { xs: '0.75rem', md: '1rem' },
                }}
              >
                <strong>Yönel Oto Yedek Parça</strong> olarak, <Link href="/urunler/iveco/daily" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}><strong>İveco Daily</strong></Link> (120-14, 85-12, 65-9, 50NC), <Link href="/urunler/fiat/ducato" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}><strong>Fiat Ducato</strong></Link> (2.3 ve 3.0 MultiJet), 
                <Link href="/urunler/foton" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}><strong> Foton Traktör</strong></Link> (504, 604 serileri), <Link href="/urunler/karatas" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}><strong>Karataş Traktör</strong></Link> ve <Link href="/urunler/mutlu/aku" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}><strong>Mutlu Akü</strong></Link> markalarının tüm yedek parçalarını 
                Türkiye geneline hızlı ve güvenilir şekilde ulaştırıyoruz. Tokat merkezli stok altyapımız sayesinde en çok talep edilen <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>fren balatası</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>yağ filtresi</Link>, 
                <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>hava filtresi</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>yakıt filtresi</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>motor parçaları</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>şanzıman komponentleri</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>hidrolik pompa</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>alternatör</Link>, <Link href="/urunler" style={{ color: '#a80000', textDecoration: 'none' }}>marş motoru</Link> ve <Link href="/urunler/mutlu/aku" style={{ color: '#a80000', textDecoration: 'none' }}>akü</Link> gibi ürünleri fiziksel 
                depomuzda bulunduruyoruz.
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.8,
                  color: '#374151',
                  mb: { xs: '0.75rem', md: '1rem' },
                }}
              >
                Her siparişte şasi numarası, ürün kodu veya katalog referansı ile eşleştirme yaparak aracın üretim yılına, motor tipine veya özel paketine göre 
                doğru parçayı göndermeyi garanti ediyoruz. Orijinal yedek parçaların yanı sıra, OEM sertifikalı yan sanayi çözümleri de sunarak farklı bütçelere 
                uygun alternatifler öneriyoruz. Sipariş öncesi ve sonrası teknik destek, montaj tavsiyeleri ve tork değerleri gibi detaylı bilgileri de müşterilerimizle 
                paylaşıyoruz.
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.8,
                  color: '#374151',
                }}
              >
                50+ yıllık tecrübemizle, ticari araç ve traktör sahiplerinin ihtiyaç duyduğu tüm yedek parçaları tek katalog altında toplayarak, arama ve sipariş 
                sürecini kolaylaştırıyoruz. Aynı gün kargo, güvenli ödeme seçenekleri ve Türkiye geneli hızlı teslimat hizmetimizle yanınızdayız. WhatsApp üzerinden 
                hızlı destek ve telefon ile uzman danışmanlık hizmeti sunuyoruz.
              </Typography>
            </Box>

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

        {/* Info Cards - Alt bilgi kartları */}
        <Box sx={{ mt: { xs: '3rem', md: '4rem' } }}>
          <ProductsInfoCards />
        </Box>

        {/* Brand specific article */}
        <Box
          component="section"
          aria-label="Marka bazlı yedek parça bilgileri"
          sx={{ 
            mt: { xs: '3rem', md: '4rem' },
            mb: { xs: '2.5rem', md: '3rem' },
            p: { xs: '1.5rem', md: '2.5rem' },
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 700,
              color: '#111827',
              mb: { xs: '1rem', md: '1.5rem' },
            }}
          >
            Marka Bazlı Yedek Parça Kataloğu Hakkında
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
              color: '#374151',
              mb: { xs: '1rem', md: '1.25rem' },
            }}
          >
            <strong>Yönel Oto Yedek Parça</strong> kataloğu; <strong>İveco Daily</strong>, <strong>Fiat Ducato</strong>, <strong>Foton Traktör</strong>,
            <strong> Karataş Traktör</strong> ve <strong>Mutlu Akü</strong> ürünlerini aynı çatı altında sunmak üzere tasarlandı. Tokat merkezli stok
            altyapımız sayesinde en çok talep edilen fren balatası, yağ filtresi, hidrolik pompa ve akü referanslarını fiziksel olarak depomuzda tutuyor,
            her siparişte şasi numarası veya ürün kodu doğrulaması yaparak doğru parçayı göndermeyi garanti ediyoruz.
          </Typography>
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 600,
              color: '#111827',
              mb: { xs: '0.75rem', md: '1rem' },
            }}
          >
            İveco & Fiat Ürün Grupları
          </Typography>
          <Typography component="p" sx={{ color: '#4b5563', lineHeight: 1.8, mb: { xs: '0.75rem', md: '1rem' } }}>
            <strong>İveco Daily</strong> tarafında 65-9, 85-12, 120-14 ve 50NC modelleri için volan dişlisi, şanzıman dişli setleri, balata, fren diski,
            kızdırma bujisi ve diferansiyel rulmanı gibi ağır hizmet parçalarının tamamı fiziksel stoktan çıkıyor. Sipariş öncesi şasi numarası ve katalog referansı
            ile eşleştirme yaparak aracın üretim yılına veya özel paketine göre doğru parçayı gönderiyoruz. <strong>Fiat Ducato 2.3</strong> ve
            <strong> 3.0 MultiJet</strong> motor platformları için ise yağ filtresi, EGR valfi, turbo hortum setleri, soğutma hortumları, debriyaj kitleri ve
            hidrolik sistem komponentlerini aynı gün kargoya hazırlıyoruz. Orijinal parçaların yanı sıra OEM sertifikalı yan sanayi çözümleri sunarak farklı bütçelere
            uygun alternatifler öneriyor, montaj esnasında dikkat edilmesi gereken tork değerleri ve sıvı türleri gibi teknik bilgileri de paylaşıyoruz.
          </Typography>
            <Typography 
            variant="h3"
            component="h3"
              sx={{ 
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 600,
              color: '#111827',
              mb: { xs: '0.75rem', md: '1rem' },
            }}
          >
            Foton & Karataş Traktör Parçaları
          </Typography>
          <Typography component="p" sx={{ color: '#4b5563', lineHeight: 1.8, mb: { xs: '0.75rem', md: '1rem' } }}>
            <strong>Foton 504</strong>, <strong>Foton 604</strong> ve Karataş serileri için motor bloğu, piston setleri, hidrolik silindirler, lift kol
            parçaları, kabin süspansiyonu, klima hatları, filtre takımları ve hidrolik yağlar hazır depodan tedarik edilebiliyor. Tarla ve bahçe işlerinde sık
            kullanılan bu traktörlerin fren merkezi, hidrolik pompaları, direksiyon orbitrolü, şanzıman dişli takımları ve kabin ekipmanlarını Türkiye geneline
            kargo ile gönderiyoruz. Teslimat öncesinde her parçayı orijinal katalog referanslarıyla tarayıp şasi veya seri numarası bazlı doğrulama yapıyor,
            gerekirse komşu parçalarla birlikte set halinde paketleyerek montajda yaşanacak zaman kaybını önlüyoruz. Bu sayede sahadaki ekipmanlar uzun süreli
            ve kesintisiz çalışmaya devam ediyor.
            </Typography>
            <Typography 
            variant="h3"
            component="h3"
              sx={{ 
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 600,
              color: '#111827',
              mb: { xs: '0.75rem', md: '1rem' },
            }}
          >
            Mutlu Akü ve Destek Hizmetleri
          </Typography>
          <Typography component="p" sx={{ color: '#4b5563', lineHeight: 1.7 }}>
            Tokat bölgesinde <strong>Mutlu Akü</strong> yetkili satıcısı olarak 45 Ah’dan 200 Ah’a kadar tüm kapasitelerde stok bulunduruyoruz. Soğuk
            hava şartları veya uzun süre park eden araçlar için voltaj ölçümü, şarj uyarıları ve montaj tavsiyelerini siparişle birlikte paylaşıyor, gerektiğinde
            telefon ve WhatsApp üzerinden teknik destek veriyoruz. Böylece katalogda gördüğünüz her ürün; doğru referans, hızlı tedarik ve satış sonrası
            danışmanlıkla desteklenmiş oluyor.
            </Typography>
        </Box>

        {/* Scroll to Top Button */}
        <ClientOnly>
          <ScrollToTop />
        </ClientOnly>
      </Box>
    </div>
  );
}
