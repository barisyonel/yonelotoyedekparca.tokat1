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
import type { PlainCategory, PlainProduct, PlainSliderImage } from '@/lib/serializeDb';
import { toPlainProduct } from '@/lib/serializeDb';
import ClientOnly from '@/components/ClientOnly';
import Link from 'next/link';

// Dynamic imports
const ProductCard = nextDynamic(() => import('@/app/products/ProductCard'), { ssr: true });
const ProductsFilter = nextDynamic(() => import('@/app/products/ProductsFilter'), { ssr: false });
const ProductsPagination = nextDynamic(() => import('@/app/products/ProductsPagination'), { ssr: true });
const ProductsToolbar = nextDynamic(() => import('@/app/products/ProductsToolbar'), { ssr: true });
const ScrollToTop = nextDynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const ProductsCarousel = nextDynamic(() => import('@/components/ProductsCarousel'), { 
  ssr: true,
  loading: () => <div style={{ height: 'clamp(280px, 35vh, 400px)', backgroundColor: '#f3f4f6' }} />
});
const ProductsInfoCards = nextDynamic(() => import('@/components/ProductsInfoCards'), { ssr: false });

export const revalidate = 120;

interface PageProps {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Metadata kodları burada (Sizin orijinal dosyanızdaki ile aynı kalabilir veya sadeleştirebilirsiniz)
  return {
    title: 'Yönel Oto Yedek Parça Kataloğu',
    description: 'Tüm yedek parça ürünlerimiz.',
  };
}

export default async function UrunlerPage({ params, searchParams }: PageProps) {
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const searchRaw = Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search;
  const sortRaw = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const limitRaw = Array.isArray(searchParams.limit) ? searchParams.limit[0] : searchParams.limit;

  const pageParsed = parseInt(pageRaw as string, 10);
  const limitParsed = parseInt(limitRaw as string, 10);

  const page = Number.isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed;
  const search = (searchRaw as string) || '';
  const sort = (sortRaw as string) || 'newest';
  const limit = Number.isNaN(limitParsed) || limitParsed < 1 ? 12 : limitParsed;

  // KATEGORİLERİ ÇEKME (Bu kısım bozulmuş olabilir)
  let categories: PlainCategory[] = [];
  try {
    categories = await CategoriesRepository.findAll();
  } catch (error) {
    console.error('Kategoriler çekilemedi:', error);
    categories = [];
  }
  
  // Slug analizi ve aktif kategori belirleme
  let categoryId: number | undefined = undefined;
  let activeCategory = null;
  let parentCategory = null;
  
  if (params.slug && params.slug.length > 0 && categories.length > 0) {
    const parentSlug = params.slug[0];
    const subSlug = params.slug[1];
    
    for (const cat of categories) {
      if (slugify(cat.Name) === parentSlug) {
        parentCategory = cat;
        if (subSlug && cat.SubCategories) {
          for (const sub of cat.SubCategories) {
            if (slugify(sub.Name) === subSlug) {
              categoryId = sub.Id;
              activeCategory = sub;
              break;
            }
          }
        } else {
          categoryId = cat.Id;
          activeCategory = cat;
        }
        break;
      }
      
      // Marka bazlı özel routing (iveco/daily vb.)
      // Bu kısım sizin mevcut kodunuzdaki fuzzy match mantığıdır, burayı özet geçiyorum
      // Eğer kategori bulunamazsa null kalır.
    }
  }

  // ÜRÜNLERİ ÇEKME
  let products: PlainProduct[] = [];
  let total = 0;
  let sliders: PlainSliderImage[] = [];
  
  // Promise.all kullanmıyoruz: slider sorgusu patlarsa ürünler de komple boş dönmesin.
  try {
    const productResult = await ProductsRepository.findAll({ page, limit, search, categoryId, sort });
    products = productResult.products.map(toPlainProduct);
    total = productResult.total;
  } catch (error) {
    console.error('Ürünleri çekerken hata:', error);
  }

  try {
    sliders = await SliderImagesRepository.findAll();
  } catch (error) {
    console.error('Sliderları çekerken hata:', error);
    sliders = [];
  }
  
  const totalPages = Math.ceil(total / limit);

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', margin: '0 auto', px: { xs: '3%', md: '3%', lg: '2%' }, py: { xs: 2, md: 3 } }}>
      
      {/* Breadcrumb ve Header */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumb items={[{ label: 'Ürünler', href: '/urunler' }]} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <ProductsHeader activeCategory={activeCategory} searchQuery={search || undefined} />
      </Box>

      {/* Slider */}
      <Box sx={{ mb: 4 }}>
        <ClientOnly><ProductsCarousel sliders={sliders} /></ClientOnly>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, md: 3 } }}>
        {/* SOL TARAFTAKİ FİLTRE ALANI (Burayı kontrol ediyoruz) */}
        <Box sx={{ width: { xs: '100%', lg: '24%' }, display: { xs: 'none', lg: 'block' } }}>
          <ClientOnly>
            {/* Kategoriler prop'u buraya doğru gitmeli */}
            <ProductsFilter categories={categories} activeCategory={activeCategory} />
          </ClientOnly>
        </Box>

        {/* SAĞ TARAF - ÜRÜN LİSTESİ */}
        <Box sx={{ width: { xs: '100%', lg: '76%' } }}>
          <Box sx={{ mb: 3 }}>
            <ProductsToolbar categories={categories} activeCategory={activeCategory} />
          </Box>

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">Ürün bulunamadı</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 2 } }}>
                {products.map((product) => (
                  <ProductCard key={product.Id} product={product} />
                ))}
              </Box>
              {totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <ProductsPagination currentPage={page} totalPages={totalPages} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      
      <Box sx={{ mt: 5 }}>
        <ProductsInfoCards />
      </Box>
      <ClientOnly><ScrollToTop /></ClientOnly>
    </Box>
  );
}
