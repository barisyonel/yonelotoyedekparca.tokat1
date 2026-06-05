import { Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import Breadcrumb from '@/components/Breadcrumb';
import ProductsHeader from '@/app/products/ProductsHeader';
import { Metadata } from 'next';
import { fetchUrunlerPageData } from '@/lib/catalog/fetchUrunlerPage';
import { getCategoryPathFromSlug } from '@/lib/utils/urunlerUrls';
import type { PlainCategory, PlainProduct } from '@/lib/serializeDb';
import ProductsPageSlider from '@/app/urunler/ProductsPageSlider';

const ProductCard = nextDynamic(() => import('@/app/products/ProductCard'), { ssr: true });
const ProductsFilter = nextDynamic(() => import('@/app/products/ProductsFilter'), { ssr: false });
const ProductsPagination = nextDynamic(() => import('@/app/products/ProductsPagination'), { ssr: true });
const ProductsToolbar = nextDynamic(() => import('@/app/products/ProductsToolbar'), { ssr: true });
const ScrollToTop = nextDynamic(() => import('@/components/ScrollToTop'), { ssr: false });
const ProductsInfoCards = nextDynamic(() => import('@/components/ProductsInfoCards'), { ssr: false });

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
    <div
      className="mb-4 rounded-2xl bg-gray-100"
      style={{ height: 'clamp(280px, 35vh, 400px)' }}
    />
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
  const categoryPath = getCategoryPathFromSlug(params.slug);

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
    <div className="w-full max-w-[100vw] mx-auto px-[3%] lg:px-[2%] py-4 md:py-6">
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ürünler', href: '/urunler' }]} />
      </div>

      <ProductsHeader activeCategory={activeCategory} searchQuery={search || undefined} />

      <div className="mb-6 md:mb-8">
        <Suspense fallback={<SliderFallback />}>
          <ProductsPageSlider />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <aside className="hidden lg:block w-full lg:w-[24%]">
          <ProductsFilter
            categories={categories}
            activeCategory={activeCategory}
            expandedParentCategory={parentCategory}
          />
        </aside>

        <div className="w-full lg:w-[76%]">
          <ProductsToolbar
            categories={categories}
            activeCategory={activeCategory}
            expandedParentCategory={parentCategory}
          />

          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-lg text-gray-600 font-medium">Ürün bulunamadı</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.Id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <ProductsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    categoryPath={categoryPath || undefined}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-10">
        <ProductsInfoCards />
      </div>
      <ScrollToTop />
    </div>
  );
}
