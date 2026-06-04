import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import Breadcrumb from '@/components/Breadcrumb';
import ProductsHeader from '@/app/products/ProductsHeader';
import { Metadata } from 'next';
import ClientOnly from '@/components/ClientOnly';
import { fetchUrunlerPageData } from '@/lib/catalog/fetchUrunlerPage';
import type { PlainCategory, PlainProduct } from '@/lib/serializeDb';
import ProductsPageSlider from '@/app/urunler/ProductsPageSlider';

const ProductCard = nextDynamic(() => import('@/app/products/ProductCard'), { ssr: true });
const ProductsFilter = nextDynamic(() => import('@/app/products/ProductsFilter'), { ssr: false });
const ProductsPagination = nextDynamic(() => import('@/app/products/ProductsPagination'), { ssr: true });
const ProductsToolbar = nextDynamic(() => import('@/app/products/ProductsToolbar'), { ssr: true });
const ScrollToTop = nextDynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const ProductsInfoCards = nextDynamic(() => import('@/components/ProductsInfoCards'), { ssr: false });

/** searchParams kullanıldığı için dinamik; veri unstable_cache ile önbelleklenir */
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Yönel Oto Yedek Parça Kataloğu',
    description: 'Tüm yedek parça ürünlerimiz.',
  };
}

function SliderFallback() {
  return (
    <div style={{ height: 'clamp(280px, 35vh, 400px)', backgroundColor: '#f3f4f6' }} />
  );
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

  let categories: PlainCategory[] = [];
  let products: PlainProduct[] = [];
  let total = 0;
  let activeCategory: PlainCategory | null = null;
  let parentCategory: PlainCategory | null = null;

  try {
    const data = await fetchUrunlerPageData({
      slug: params.slug,
      page,
      limit,
      search,
      sort,
    });
    categories = data.categories;
    products = data.products;
    total = data.total;
    activeCategory = data.activeCategory;
    parentCategory = data.parentCategory;
  } catch (error) {
    console.error('Ürünler sayfası verisi çekilemedi:', error);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        margin: '0 auto',
        px: { xs: '3%', md: '3%', lg: '2%' },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Breadcrumb items={[{ label: 'Ürünler', href: '/urunler' }]} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <ProductsHeader activeCategory={activeCategory} searchQuery={search || undefined} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Suspense fallback={<SliderFallback />}>
          <ProductsPageSlider />
        </Suspense>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ width: { xs: '100%', lg: '24%' }, display: { xs: 'none', lg: 'block' } }}>
          <ClientOnly>
            <ProductsFilter
              categories={categories}
              activeCategory={activeCategory}
              expandedParentCategory={parentCategory}
            />
          </ClientOnly>
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '76%' } }}>
          <Box sx={{ mb: 3 }}>
            <ProductsToolbar
              categories={categories}
              activeCategory={activeCategory}
              expandedParentCategory={parentCategory}
            />
          </Box>

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Ürün bulunamadı
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
                  gap: { xs: 1.5, md: 2 },
                }}
              >
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
      <ClientOnly>
        <ScrollToTop />
      </ClientOnly>
    </Box>
  );
}
